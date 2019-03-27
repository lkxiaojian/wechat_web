package com.kingweather.system.service.manager.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import com.kingweather.common.util.Md5Utils;
import com.kingweather.common.util.Page;
import com.kingweather.system.dao.manager.UserManagerDao;
import com.kingweather.system.manager.domain.User;
import com.kingweather.system.manager.domain.UserState;
import com.kingweather.system.service.manager.MenuManagerService;
import com.kingweather.system.service.manager.UserManagerService;
import com.kingweather.system.manager.domain.Email;
import org.springframework.transaction.annotation.Transactional;


/**
 * 用户管理
 */
@Service
public class UserManagerServiceImpl implements UserManagerService
{

    @Resource
    private UserManagerDao userManagerDaoImpl;

    @Resource
    private MenuManagerService menuManagerServiceImpl;
	@Transactional
	public Map<String, Object> getAllChildUsers(Object... object) {
		// TODO Auto-generated method stub
		HttpServletRequest request = (HttpServletRequest)object[0];

		Map<String,Object> conditions = new HashMap<String, Object>();
        String startNum = request.getParameter("pageNumber");
        String pageSizestr = request.getParameter("pageSize");
        int pageNo = 1;
        if (StringUtils.isNotEmpty(startNum)) {
          pageNo = Integer.parseInt(startNum);
        }
        int pageSize = 10;
        if (StringUtils.isNotEmpty(pageSizestr)) {
          pageSize = Integer.parseInt(pageSizestr);
        }
        conditions.put("startNum", pageNo);
        conditions.put("pageSize", pageSize);

        User user = (User)object[1];
        conditions.put("parentId", user.getUserId());

        conditions.put("userName", request.getParameter("userName"));
        conditions.put("userEmail", request.getParameter("userEmail"));

		Map<String, Object> map = new LinkedHashMap<String, Object>();
		map.put("code", 0);
		Page<Map<String, Object>> page = userManagerDaoImpl.getAllChildUsers(conditions);
		map.put("message", "查询成功");
		map.put("total", page.getTotalCount());
		map.put("result", page.getResult());
		return map;
	}
	@Transactional
	public Map<String, Object> getAllUsers(Object... object) {
		// TODO Auto-generated method stub
		HttpServletRequest request = (HttpServletRequest)object[0];

		Map<String,Object> conditions = new HashMap<String, Object>();
        String startNum = request.getParameter("pageNumber");
        String pageSizestr = request.getParameter("pageSize");
        int pageNo = 1;
        if (StringUtils.isNotEmpty(startNum)) {
          pageNo = Integer.parseInt(startNum);
        }
        int pageSize = 10;
        if (StringUtils.isNotEmpty(pageSizestr)) {
          pageSize = Integer.parseInt(pageSizestr);
        }
        conditions.put("startNum", pageNo);
        conditions.put("pageSize", pageSize);
        conditions.put("userName", request.getParameter("userName"));
        conditions.put("userEmail", request.getParameter("userEmail"));

		Map<String, Object> map = new LinkedHashMap<String, Object>();
		map.put("code", 0);
		Page<Map<String, Object>> page = userManagerDaoImpl.getAllUsers(conditions);
		map.put("message", "查询成功");
		map.put("total", page.getTotalCount());
		map.put("result", page.getResult());
		return map;
	}
	@Transactional
	public boolean addUser(User user) {
		// TODO Auto-generated method stub
		user.setStatus(UserState.NORMAL.getCode());
		user.setPassword(Md5Utils.encode2hex(user.getPassword()));
		return userManagerDaoImpl.addUser(user);
	}
	@Transactional
	public boolean addUserMenu(String userId, String menuIds) {
		// TODO Auto-generated method stub
		String [] ids = null;
		if(!"".equals(menuIds)&&menuIds!=null){
			ids = menuIds.split(",");
		}
		boolean result = userManagerDaoImpl.addUserMenu(userId, ids);
		return result;
	}
	@Transactional
	public boolean delCanceledURMidByUserId(String userId,String uncheckMids,String groupId){
		String [] canceledMid = null;
		if(uncheckMids == null){
			List<String> midlist = getCanceledMidsByUserId(userId,groupId);
			canceledMid = midlist.toArray(new String[midlist.size()]);
		}else{
			canceledMid = uncheckMids.split(",");
		}
		boolean result = userManagerDaoImpl.delSubUMCanceledMids(userId, canceledMid);
		result = userManagerDaoImpl.delSubRMCanceledMids(userId, canceledMid);
		return result;
	}

	/**
	 * 会将当前用户id对应的所有没有勾选的菜单id全部取出，没有勾选的id=全部菜单id - 当前用户所选择的id
	 *
	 * 备注：（该方法需要完善，只适合super给admin赋角色时，没有问题，当admin,下面的员工赋角色时，同时该员工下面还有员工，这种情况就有问题）
	 * 当公司的admin向它的员工赋角色的时候，groupId需要设置null,这样被赋角色的员工，如果它减掉一个模块
	 * 当前减模块的员工，下面如果还有子员工，则子员工的剩下的模块应该是：当前模块的当前员工原来所拥有-当前员工所现在勾选的模块
	 * 另一种方法：不需要这么复杂的，当赋角色时，从前端将当前员工去掉的模块传进来，直接减，肯定没有问题
	 *
	 * @param userId
	 * @return
     */
	@Transactional
	public List<String> getCanceledMidsByUserId(String userId,String groupId){
		List<String> canceledMid = new ArrayList<String>();
		List<Map<String,Object>> allMenus = menuManagerServiceImpl.getAllMenus();
		//第二个参数是查询组id,设置null将不会查询组id对应的模块,delSubRUMCanceledMids就是将它设置为null
		List<Map<String,Object>> userMenus = userManagerDaoImpl.getMenuByUserId(userId,groupId);
		for(Map<String,Object> menu:allMenus){
			String menuId = menu.get("menu_id").toString();
			boolean ishas = false;
			for(Map<String,Object> userMenu : userMenus){
				String userMid = userMenu.get("menu_id").toString();
				if(menuId.equals(userMid)){
					ishas = true;
				}
			}
			if(!ishas){
				canceledMid.add(menuId);
			}
		}
		return canceledMid;
	}
	@Transactional
	public boolean addUserRole(String userId, String roleIds) {
		// TODO Auto-generated method stub
		String [] ids = roleIds.split(",");
		boolean result = userManagerDaoImpl.deleteUMByUserIdRoleIds(userId, ids);
		result = userManagerDaoImpl.addUserRole(userId, ids);
		return result;
	}
	@Transactional
	public boolean updateStatus(String userId, int status) {
		// TODO Auto-generated method stub
		return userManagerDaoImpl.updateStatus(userId, status);
	}
	@Transactional
	public boolean editUser(User user) {
		// TODO Auto-generated method stub
		return userManagerDaoImpl.editUser(user);
	}
	@Transactional
	public Map<String, Object> deleteUser(String userId) {
		// TODO Auto-generated method stub
		Map<String, Object> map = new LinkedHashMap<String, Object>();

		String [] ids = userId.split(",");
		boolean hasChild = false;
		for(String id : ids){
			List<Map<String,Object>> users = userManagerDaoImpl.getChildUserByUserId(id);
			if(!users.isEmpty()){
				hasChild = true;
			}
		}

		boolean result = false;
		if(!hasChild){
			result = userManagerDaoImpl.deleteUserRole(ids);
			result = userManagerDaoImpl.deleteUserMenu(ids);
			result = userManagerDaoImpl.deleteUser(ids);
			if(result){
				map.put("delcode", 0);
				map.put("message", "删除成功!");
			}else{
				map.put("delcode", 1);
				map.put("message", "删除失败!");
			}
		}else{
			map.put("delcode", 2);
			map.put("message", "用户中存在子用户，请删除后再试！");
		}
		return map;
	}
	@Transactional
	public boolean deleteUserByType(String userType) {
		return userManagerDaoImpl.deleteUserByType(userType);
	}
	@Transactional
	public boolean deleteUserRole(String userId) {
		// TODO Auto-generated method stub
		String [] ids = userId.split(",");
		return userManagerDaoImpl.deleteUserRole(ids);
	}
	@Transactional
	public Map<String, Object> getRoleByUserId(String userId) {
		// TODO Auto-generated method stub
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		map.put("code", 0);
		map.put("message", "查询成功");
		map.put("result", userManagerDaoImpl.getRoleByUserId(userId));
		return map;
	}
	@Transactional
	public Map<String, Object> getMenuByUserId(String userId,String userType) {
		// TODO Auto-generated method stub
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		map.put("code", 0);
		map.put("message", "查询成功");
		map.put("result", userManagerDaoImpl.getMenuByUserId(userId,userType));
		return map;
	}
	@Transactional
	public User getUserByNamePassword(String userName, String password) {
		// TODO Auto-generated method stub
		String pwd = Md5Utils.encode2hex(password);
		return userManagerDaoImpl.getUserByNamePassword(userName, pwd);
	}

	@Override
	public void addLoginLog(HttpServletRequest request, User user) {
		userManagerDaoImpl.addLoginLog(request,user);
	}

	@Transactional
	public int updatePassword(String userName, String password, String newpassword) {
		// TODO Auto-generated method stub
		String pwd = Md5Utils.encode2hex(password);
		String newpwd = Md5Utils.encode2hex(newpassword);
		return userManagerDaoImpl.updatePassword(userName, pwd, newpwd);
	}
	@Transactional
	private Map<String, Object> getMenuTree(List<Map<String,Object>> menuMap){
		List<Map<String,Object>> parentMenuList = new ArrayList<Map<String,Object>>();
		Map<String,String> urlMap = new HashMap<String,String>();
		for(Map<String,Object> menu : menuMap){
			String parentId = menu.get("parent_id").toString();
			if(menu.get("action_url") != null && StringUtils.isNotEmpty(menu.get("action_url").toString())){
				urlMap.put(menu.get("action_url").toString(), "1");
			}
			if("0".equals(parentId)){
				Map<String,Object> parentMenu = menuManagerServiceImpl.getTreeMap(menu);

				menuManagerServiceImpl.buildMenuTree(parentMenu, menuMap);
				parentMenuList.add(parentMenu);
			}
		}
		Map<String,Object> menuTree = new HashMap<String, Object>();
		menuTree.put("id", 0);
		menuTree.put("item", parentMenuList);
		menuTree.put("urlMap", urlMap);
		return menuTree;
	}
	@Transactional
	public Map<String, Object> getMenuTreeByUserId(String userId) {
		// TODO Auto-generated method stub
		List<Map<String,Object>> menulist = userManagerDaoImpl.getMenuTreeByUserId(userId);
		return getMenuTree(menulist);

	}
	@Transactional
	public Map<String, Object> getMenuTreeByUidAndUtp(String userId,String userType) {
		// TODO Auto-generated method stub
		List<Map<String,Object>> menulist = userManagerDaoImpl.getMenuTreeByUidAndUtp(userId, userType);
		return getMenuTree(menulist);

	}
	@Transactional
    public List<Map<String,Object>> getUserApps(String entId){
    	return userManagerDaoImpl.getUserApps(entId);
    }
	@Transactional
	@Override
	public User getUserByName(String userName) {
		// TODO Auto-generated method stub
		return userManagerDaoImpl.getUserByName(userName);
	}
	@Transactional
	@Override
	public boolean regist(Map<String, Object> map) {
		// TODO Auto-generated method stub
		return userManagerDaoImpl.regist(map);
	}
	@Transactional
    @Override
    public Boolean finddomain(String domain){
    	return userManagerDaoImpl.getdomain(domain);
    }

	/**
	 * 取得邮件信息
	 */
	@Transactional
	@Override
	public String readEmail(String email)
	{
		return userManagerDaoImpl.readEmail(email);
	}

	/**
	 * 取得邮件信息
	 */
	@Override
	@Transactional
	public Email gEmailconfig()
	{
		Email e = new Email();
		List<Map<String, Object>> list = userManagerDaoImpl.getEmailConfig();
		if (list.size() > 0)
		{
			Map<String, Object> email = list.get(0);
			e.setServerDomain(email.get("server_domain").toString());
			e.setSmtpServer(email.get("smpt_server").toString());
			e.setSmtpPort(Integer.parseInt(email.get("smpt_port").toString()));
			e.setEmailName(email.get("mail_server") == null ? "" : email.get("mail_server").toString());
			e.setPassword(email.get("mail_pw") == null ? "" : email.get("mail_pw").toString());
			return e;
		}
		else
		{
			return null;
		}
	}

	@Override
	@Transactional
	public Integer delEmail()
	{
		return userManagerDaoImpl.delEmail();
	}

	/**
	 * 更新用户密码
	 */

	@Override
	@Transactional
	public Integer resetpw(String email, String newpw)
	{
		try
		{
			return userManagerDaoImpl.resetpw(email, newpw);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		return null;
	}

	/**
	 *查询所有admin账号的名称及所属的公司名称信息,在super和@kingweather创建其他公司账号时使用
	 */
	@Override
	@Transactional
	public Map<String, Object> getAllAdminAndGroup(Object... obj) {
		HttpServletRequest request = (HttpServletRequest) obj[0];
		Map<String,Object> conditions = new HashMap<String, Object>();
		String startNum = request.getParameter("pageNumber");
		String pageSizestr = request.getParameter("pageSize");
		int pageNo = 1;
		if (StringUtils.isNotEmpty(startNum)) {
			pageNo = Integer.parseInt(startNum);
		}
		int pageSize = 10;
		if (StringUtils.isNotEmpty(pageSizestr)) {
			pageSize = Integer.parseInt(pageSizestr);
		}
		conditions.put("startNum", pageNo);
		conditions.put("pageSize", pageSize);
		Page<Map<String, Object>> page = userManagerDaoImpl.getAllAdminAndGroup(conditions);
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		map.put("code", 0);
		map.put("message", "查询成功");
		map.put("total", page.getTotalCount());
		map.put("result", page.getResult());
		return map;
	}


	/**
	 * 增加邮件信息
	 */
	@Override
	@Transactional
	public Integer addEmailConfig(Email email)
	{
		try
		{
			return userManagerDaoImpl.addEmailConfig(email);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		return null;
	}

}



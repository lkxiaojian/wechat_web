package com.kingweather.system.controller.manager;

import com.kingweather.common.constants.SystemConstants;
import com.kingweather.common.controller.BaseController;
import com.kingweather.common.util.DateUtil;
import com.kingweather.common.util.Md5Utils;
import com.kingweather.system.manager.domain.Email;
import com.kingweather.system.manager.domain.User;
import com.kingweather.system.manager.domain.UserState;
import com.kingweather.system.service.manager.MenuManagerService;
import com.kingweather.system.service.manager.UserManagerService;
import com.kingweather.we_chat.service.UserMenuService;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.*;

/**
 * 用户管理
 */
@Controller
public class UserManagerController extends BaseController
{
    @Resource
    private UserManagerService userManagerServiceImpl;

    @Resource
    private MenuManagerService menuManagerServiceImpl;

	@Resource
	private UserMenuService userMenuServiceIml;

	private static Email e = null;

    /**
     * 用户注册
     */
    @ResponseBody
    @RequestMapping(value = "/user/regist")
    public Map<String, Object> regist()
    {
        String userName = request.getParameter("userName");
        String password = request.getParameter("password");
        String domain = request.getParameter("domain");
        String ip = request.getParameter("ip");
        String company = request.getParameter("company");
        String contact = request.getParameter("contact");
        String phone = request.getParameter("phone");
        String email = request.getParameter("email");
        String webType = request.getParameter("webType");
        String sysType = request.getParameter("sysType");

        Map<String, Object> resultMap = new HashMap<String, Object>();

        User user = userManagerServiceImpl.getUserByName(userName);
        if (null == user){
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("name", userName);
            map.put("password", Md5Utils.encode2hex(password));
            map.put("domain", domain);
            map.put("ip", ip);
            map.put("company", company);
            map.put("contact", contact);
            map.put("phone", phone);
            map.put("email", email);
            map.put("webtype", webType);
            map.put("systype", sysType);
            boolean isRegist = userManagerServiceImpl.regist(map);
//            if (isRegist) {
//                resultMap.put("result", 1);
//            }
        }else{
        	resultMap.put("result", 0);
        }
        return resultMap;
    }

    /**
	 * 新增用户
	 */
    @ResponseBody
	@RequestMapping(value="/user/manager",params="view=add",method= RequestMethod.POST)
	public  Map<String, Object> create(@RequestBody User user){
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		String view = request.getParameter("view");
		boolean fag = false;
		if(!"add".equals(view)){
			map.put("code", 1);
			map.put("message", "新增失败,请正确访问接口");
			map.put("result", null);
		}else{
			User sessionUser = (User)session.getAttribute("user");
			String currentUserType = sessionUser.getUserType();

			user.setParentId(sessionUser.getUserId());
//			if(SystemConstants.SUPERADMINISTRATOR_CODE.equals(currentUserType)){
//				user.setUserType(SystemConstants.PLATFORMUSER_CODE);
//			}else{
//				user.setUserType(currentUserType);
//			}
			user.setParentUser(sessionUser);
			fag = userManagerServiceImpl.addUser(user);
		}
		map.put("success", fag);
		return map;
	}

	/**
	 * 查询用户列表
	 */
    @ResponseBody
	@RequestMapping(value="/user/query",params="view=select",method= RequestMethod.GET)
	public  Map<String, Object> select(){
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		String view = request.getParameter("view");

		if(!"select".equals(view)){
			map.put("code", 1);
			map.put("message", "查询失败,请正确访问接口");
			map.put("result", null);
		}else{
			User user = (User)session.getAttribute("user");
			if(SystemConstants.SUPERADMINISTRATOR_CODE.equals(user.getUserType())){
				map = userManagerServiceImpl.getAllUsers(request);
			}else{
				map = userManagerServiceImpl.getAllChildUsers(request,user);
			}

		}
		return map;
	}

	/**
	 * 查询所有admin账号的名称，供super和@kingweather创建账号时选择@后缀使用
	 */
	@ResponseBody
	@RequestMapping(value = "/user/manager", params = "view=selectadmin", method = RequestMethod.GET)
	public Map<String, Object> getAllAdminUserName() {
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		String view = request.getParameter("view");
		if (!"selectadmin".equals(view)) {
			map.put("code", 1);
			map.put("message", "查询admin失败，请正确访问接口");
			map.put("result", null);
		}else {
//			map = userManagerServiceImpl.getAllAdminUserName();
			map = userManagerServiceImpl.getAllAdminAndGroup(request);
		}
		return map;
	}

	/**
	 * 刪除用户
	 */
    @ResponseBody
	@RequestMapping(value="/user/manager",params="view=delete",method= RequestMethod.GET)
	public  Map<String, Object> deleteUser(String userId){
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		String view = request.getParameter("view");
		if(!"delete".equals(view)){
			map.put("code", 1);
			map.put("message", "删除失败,请正确访问接口");
			map.put("result", null);
		}else{
			map = userManagerServiceImpl.deleteUser(userId);
		}
		return map;
	}


	/**
	 * 修改用户
	 */
    @ResponseBody
	@RequestMapping(value="/user/manager",params="view=update",method= RequestMethod.POST)
	public  Map<String, Object> update(@RequestBody User user){
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		String view = request.getParameter("view");
		boolean fag = false;
		if(!"update".equals(view)){
			map.put("code", 1);
			map.put("message", "更新失败,请正确访问接口");
			map.put("result", null);
		}else{
			fag = userManagerServiceImpl.editUser(user);
		}
		map.put("success", fag);
		return map;
	}

    /**
   	 * 更新状态
   	 */
    @ResponseBody
   	@RequestMapping(value="/user/manager",params="view=updateStatus",method= RequestMethod.GET)
   	public  Map<String, Object> update(String userId,int status){
   		Map<String, Object> map = new LinkedHashMap<String, Object>();
   		String view = request.getParameter("view");
   		boolean fag = false;
   		if(!"updateStatus".equals(view)){
   			map.put("code", 1);
   			map.put("message", "更新失败,请正确访问接口");
   			map.put("result", null);
   		}else{
   			fag = userManagerServiceImpl.updateStatus(userId, status);
   		}
   		map.put("success", fag);
   		return map;
   	}

    /**
   	 * 用户添加角色
   	 */
    @ResponseBody
   	@RequestMapping(value="/user/manager",params="view=addRole",method= RequestMethod.POST)
	public  Map<String, Object> addRole(@RequestBody Map<String,String> obj){
   	//public  Map<String, Object> addRole(String userId,String roleIds,String user_type){
   		Map<String, Object> map = new LinkedHashMap<String, Object>();
   		String view = request.getParameter("view");
   		boolean fag = false;
   		if(!"addRole".equals(view)){
   			map.put("code", 1);
   			map.put("message", "添加角色失败,请正确访问接口");
   			map.put("result", null);
   		}else{
			String userId = obj.get("userId");
			String roleIds = obj.get("roleIds");
			String groupId = obj.get("groupId");
			fag = userManagerServiceImpl.addUserRole(userId, roleIds);
   			fag = userManagerServiceImpl.delCanceledURMidByUserId(userId,null,groupId);
   		}
   		map.put("success", fag);
   		return map;
   	}

    /**
   	 * 用户功能授权
   	 */
    @ResponseBody
   	@RequestMapping(value="/user/manager",params="view=addMenu",method= RequestMethod.POST)
   	/*public  Map<String, Object> addMenu(String userId,String menuIds){*/
	public  Map<String, Object> addMenu(@RequestBody Map obj){
   		Map<String, Object> map = new LinkedHashMap<String, Object>();
   		String view = request.getParameter("view");
		String userId = obj.get("userId").toString();
		String menuIds = obj.get("menuIds").toString();
		String uncheckMids = obj.get("unCheckedId").toString();
		String groupId = obj.get("userType").toString();

   		boolean fag = false;
   		if(!"addMenu".equals(view)){
   			map.put("code", 1);
   			map.put("message", "用户授权失败,请正确访问接口");
   			map.put("result", null);
   		}else{
   			fag = userManagerServiceImpl.addUserMenu(userId, menuIds);
   			fag = userManagerServiceImpl.delCanceledURMidByUserId(userId,uncheckMids,groupId);
   		}
   		map.put("success", fag);
   		return map;
   	}

    /**
	 * 查询当前用户已经赋予的角色列表
	 */
    @ResponseBody
	@RequestMapping(value="/user/manager",params="view=selectRole",method= RequestMethod.GET)
	public  Map<String, Object> selectUserRole(String userId){
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		String view = request.getParameter("view");

		if(!"selectRole".equals(view)){
			map.put("code", 1);
			map.put("message", "查询失败,请正确访问接口");
			map.put("result", null);
		}else{
			map = userManagerServiceImpl.getRoleByUserId(userId);
		}
		return map;
	}

    /**
   	 * 查询当前用户已经授权的功能列表
   	 */
    @ResponseBody
   	@RequestMapping(value="/user/manager",params="view=selectMenu",method= RequestMethod.GET)
   	public  Map<String, Object> selectUserMenu(String userId,String parentId,String userType){
   		Map<String, Object> map = new LinkedHashMap<String, Object>();
   		String view = request.getParameter("view");

   		if(!"selectMenu".equals(view)){
   			map.put("code", 1);
   			map.put("message", "查询失败,请正确访问接口");
   			map.put("result", null);
   		}else{
   			String utp = null;
   			if(SystemConstants.ROOT_USER_ID.equals(parentId)){//超级管理员下一级用户
   				utp = userType;
   			}
   			map = userManagerServiceImpl.getMenuByUserId(userId,utp);
   		}
   		return map;
   	}


	/**
	* 用户登录
	*
	* @param userName 用户名
	* @param password 用户密码
	* @return 用户信息
	*/
	@ResponseBody
	@RequestMapping(value = "/user/login")
	public Map<String, Object> userLogin(String userName,String password){
       Map<String, Object> map = new HashMap<String, Object>();
       User user = userManagerServiceImpl.getUserByNamePassword(userName, password);
		if (null == user){
		   map.put("userCode", UserState.UNKNOWN.getCode());
           map.put("message", "用户名或者密码错误！！");
           map.put("code", 0);
	   } else {
		    String expireDateStr = user.getExpireDate();
		    Long expireDate = null;
		    if (StringUtils.isNotEmpty(expireDateStr)) {
                expireDate = DateUtil.strToDate(expireDateStr, "yyyy/MM/dd").getTime();
            }
            Long now = new Date().getTime();

		    if (user.getStatus() == 1) {
//                if (expireDate == null || (expireDate != null && expireDate > now)) {
                    session.setAttribute("user", user);

                    Map<String,Object> menuTree = null;
//                    String userId = user.getUserId();
//                    if(SystemConstants.ROOT_USER_ID.equals(user.getParentId())){//超级管理员下一级用户
//                        String userType = user.getUserType();
//                        menuTree = userManagerServiceImpl.getMenuTreeByUidAndUtp(userId, userType);
//                    }else if(SystemConstants.SUPERADMINISTRATOR_CODE.equals(user.getParentId())){
//                        menuTree = menuManagerServiceImpl.getAllMenuTree("1");
//                    }else{
//                        menuTree = userManagerServiceImpl.getMenuTreeByUserId(userId);
//                    }
					menuTree = menuManagerServiceImpl.getAllMenuTree("1");
                    List<Map<String,Object>> menuList = (List<Map<String,Object>>)menuTree.get("item");
                    if(menuList.isEmpty()){
                        map.put("userCode", UserState.NOAUTHORITY.getCode());
                        map.put("message", "用户"+UserState.NOAUTHORITY.getName()+",请联系管理员！");
                        map.put("code", 1);
                    }else{
                        map.put("userCode", UserState.NORMAL.getCode());
                        map.put("code", 0);
                        map.put("message", "登录成功！");
                        map.put("result", menuTree);
                        session.setAttribute("menusTree", menuTree);
                        map.put("loginUser", user);

						List list = userMenuServiceIml.getUserMenuTree(null,user.getId());
						map.put("userMenu", list);

					}
                }else if (expireDate < now) {
                    map.put("userCode", user.getStatus());
                    map.put("code", 0);
                    map.put("message", "账户已过期，请联系管理员");
                }
//            }else {
//                map.put("userCode", user.getStatus());
//                map.put("code", 1);
//                String status =  UserState.getUserState(user.getStatus()).getName();
//                map.put("message","用户"+status+",请联系管理员！");
//            }

//	       if (user.getStatus() == 1 && (expireDate == null || (expireDate != null && expireDate > now))){
//			   session.setAttribute("user", user);
//
//			   Map<String,Object> menuTree = null;
//			   String userId = user.getUserId();
//			   if(SystemConstants.ROOT_USER_ID.equals(user.getParentId())){//超级管理员下一级用户
//				   String userType = user.getUserType();
//				   menuTree = userManagerServiceImpl.getMenuTreeByUidAndUtp(userId, userType);
//			   }else if(SystemConstants.SUPERADMINISTRATOR_CODE.equals(user.getParentId())){
//				   menuTree = menuManagerServiceImpl.getAllMenuTree("1");
//			   }else{
//				   menuTree = userManagerServiceImpl.getMenuTreeByUserId(userId);
//			   }
//
//			   List<Map<String,Object>> menuList = (List<Map<String,Object>>)menuTree.get("item");
//			   if(menuList.isEmpty()){
//				   map.put("userCode", UserState.NOAUTHORITY.getCode());
//				   map.put("message", "用户"+UserState.NOAUTHORITY.getName()+",请联系管理员！");
//				   map.put("code", 1);
//			   }else{
//				   map.put("userCode", UserState.NORMAL.getCode());
//				   map.put("code", 0);
//				   map.put("message", "登录成功！");
//				   map.put("result", menuTree);
//
//				   session.setAttribute("menusTree", menuTree);
//
//				   //获取当前用户下的app
//				   String entId = user.getEnterprise_id();
//				   List<Map<String,Object>> apps = userManagerServiceImpl.getUserApps(entId);
//				   user.setAppList(apps);
//				   map.put("loginUser", user);
//			   }
//	       } else {
//	    	   map.put("userCode", user.getStatus());
//	    	   map.put("code", 1);
//	    	   String status =  UserState.getUserState(user.getStatus()).getName();
//	    	   map.put("message","用户"+status+",请联系管理员！");
//	       }
       }
	       return map;
	   }

	/**
	* 获取当前用户的菜单树
	*/
     @ResponseBody
     @RequestMapping(value = "/user/menu")
	 public Map<String, Object> getModules(String groupCode) {
    	Map<String, Object> map = new LinkedHashMap<String, Object>();
    	Map<String,Object> menuTree = null;
    	User user = (User)session.getAttribute("user");
    	if(SystemConstants.SUPERADMINISTRATOR_CODE.equals(user.getUserType())
    			&&SystemConstants.TENANTUSER_CODE.equals(groupCode)){
    		menuTree = menuManagerServiceImpl.getAllMenuTree("1");
    	}else{
    		menuTree = (Map<String,Object>)session.getAttribute("menusTree");
    	}
 		map.put("code", 0);
 		map.put("message", "查询成功");
 		map.put("result", menuTree);
       return map;
     }

     /**
 	* 获取当前用户的应用列表
 	*/
      @ResponseBody
      @RequestMapping(value = "/user/app")
 	 public Map<String, Object> getAppList() {
     	Map<String, Object> map = new LinkedHashMap<String, Object>();

     	User user = (User)session.getAttribute("user");
     	List<Map<String,Object>> apps = user.getAppList();
  		map.put("code", 0);
  		map.put("message", "查询成功");
  		map.put("result", apps);
        return map;
      }

     /**
      * 用户登出
      *
      * @return 返回信息
      */
     @ResponseBody
     @RequestMapping(value = "/user/loginOut")
     public Map<String, Object> loginOut()
     {
         session.removeAttribute("user");
         session.removeAttribute("menusTree");
         Map<String, Object> map = new HashMap<String, Object>();
         map.put("result", true);
         return map;
     }

     /**
      * 修改密码
      * @param password    密码
      * @param newPassword 新密码
      * @return 返回结果
      */
     @ResponseBody
     @RequestMapping(value = "/user/modifyPassword")
     public Map<String, Object> modifyPassword(String password,String newPassword)
     {
    	 User user = (User)session.getAttribute("user");
    	 String userName = user.getUserName();

    	 Map<String, Object> map = new LinkedHashMap<String, Object>();
    	 int result = userManagerServiceImpl.updatePassword(userName, password,newPassword);
    	 if(result>0){
    		 map.put("mcode", "0");
    		 map.put("message", "修改成功!");
    	 }else{
    		 map.put("mcode", "1");
    		 map.put("message", "原密码输入错误!");
    	 }
    		return map;
     }

     @ResponseBody
     @RequestMapping(value = "/user/getdomain", method = RequestMethod.GET)
     public Boolean getdomain(String domain){
     	return userManagerServiceImpl.finddomain(domain);
     }

	/**
	 * 用户验证如果用户名存在就不给新增
	 */
	@ResponseBody
	@RequestMapping(value = "/user/getuser", method = RequestMethod.GET)
	public Map<String, Object> getuser(String userName) {
		Map<String, Object> map = new HashMap<String, Object>();
		User user = userManagerServiceImpl.getUserByName(userName);
		if (null != user) {
			map.put("result", true);
		} else {
			map.put("result", false);
		}
		return map;
	}


}
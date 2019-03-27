package com.kingweather.system.dao.manager.impl;


import com.kingweather.common.jdbc.JdbcUtil;
import com.kingweather.common.util.DateUtil;
import com.kingweather.common.util.Page;
import com.kingweather.common.util.UtilString;
import com.kingweather.system.dao.manager.UserManagerDao;
import com.kingweather.system.manager.domain.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;


/**
 * 用户管理
 */
@Repository
public class UserManagerDaoImpl implements UserManagerDao {


	@Autowired
	private JdbcUtil jdbcUtil;
	@Autowired
	private JdbcTemplate jdbcTemplate;

	public Page<Map<String, Object>> getAllChildUsers(Map<String, Object> conditions) {

		String userName = conditions.get("userName") == null ? "" : conditions.get("userName").toString();
		String userEmail = conditions.get("userEmail") == null ? "" : conditions.get("userEmail").toString();
		long parentId = Long.parseLong(conditions.get("parentId").toString());
		String sql = "with sub_users as ("
				+ "select a.user_id,a.user_name,a.user_type,a.parent_id,a.phone,a.email,a.status,a.create_time, a.is_worker, a.isvip, a.expire_date from insure.recursiveUser('{"+parentId+"}')  a "
				+ "where a.status=1 and a.user_name like '%" + userName + "%' and a.email like '%" + userEmail + "%'"
				+ ")select su.user_id,su.user_name,su.parent_id,su.user_type,ug.group_name,su.phone,su.email,su.status,su.create_time, su.is_worker, su.isvip, su.expire_date from sub_users su"
				+ " left join insure.sys_user_group ug on su.user_type=ug.group_code";

		String countSql = "with sub_users as ("
				+ "select a.user_id,a.parent_id from insure.recursiveUser('{"+parentId+"}') a "
				+ "where a.status=1 and a.user_name like '%" + userName + "%' and a.email like '%" + userEmail + "%'"
				+ ")select count(*) from sub_users";
		Integer startNum = Integer.valueOf(conditions.get("startNum").toString());
		Integer pageSize = Integer.valueOf(conditions.get("pageSize").toString());


		Page<Map<String, Object>> page = jdbcUtil.queryForPage(startNum, pageSize, countSql, sql,
				new Object[]{});
		return page;
	}

	public Page<Map<String, Object>> getAllUsers(Map<String, Object> conditions) {
		String userName = conditions.get("userName") == null ? "" : conditions.get("userName").toString();
		String userEmail = conditions.get("userEmail") == null ? "" : conditions.get("userEmail").toString();

		String sql = "with sub_users as ("
				+ "select a.user_id,a.user_name,a.parent_id,a.user_type,a.phone,a.email,a.status,a.create_time, a.is_worker, a.isvip, a.expire_date from insure.recursiveUser('{1}') a "
				+ "where a.status=1  and a.user_name like '%" + userName + "%' and a.email like '%" + userEmail + "%'"
				+ ")select u.user_id,u.user_name,u.parent_id,u.user_type,ug.group_name,u.phone,u.email,u.status,u.create_time, u.is_worker, u.isvip, u.expire_date "
				+ "from  sub_users u LEFT JOIN insure.sys_user_group ug ON u.user_type=ug.group_code";

		String countSql = "with  sub_users as ("
				+ "select user_type from insure.recursiveUser('{1}') a "
				+ "where a.status=1 and a.user_name like '%" + userName + "%' and a.email like '%" + userEmail + "%'"
				+ ") select count(*) from  sub_users su LEFT JOIN insure.sys_user_group ug ON su.user_type=ug.group_code";
		Integer startNum = Integer.valueOf(conditions.get("startNum").toString());
		Integer pageSize = Integer.valueOf(conditions.get("pageSize").toString());

		Page<Map<String, Object>> page = jdbcUtil.queryForPage(startNum, pageSize, countSql, sql, new Object[]{});
		return page;
	}

	/**
	 * 将用户id和组id传进来，默认会将当前用户的用户菜单表、用户角色表的模块全部选择出来
	 * 如果传入组id，会将组id对应的菜单也加上这个umenu临时表中
	 * 备注：如果是角色菜单表，用户组菜单表，它对应的is_role值是1
	 * @param userId
	 * @param userType ：组id
     * @return
     */
	public List<Map<String, Object>> getMenuByUserId(String userId, String userType) {
		String sql = "with umenu as ("
				+ "(select um.menu_id,0 as is_role from insure.sys_user_menu um where um.user_id=" + Long.parseLong(userId) + ")"
				+ " union "
				+ "(select rm.menu_id,1 as is_role from insure.sys_role_menu rm where rm.role_id in"
				+ "(select ur.role_id from insure.sys_user_role ur left join insure.sys_role r on ur.role_id=r.role_id"
				+ " where r.status=1 and ur.user_id=" + Long.parseLong(userId) + "))";
		if (userType != null) {
			sql = sql + " union "
					+ "(select gm.menu_id,1 as is_role from insure.sys_group_menu gm where gm.group_code=" + Integer.parseInt(userType) + ")";
		}
		sql = sql + ")select um.menu_id,um.is_role from umenu um "
				+ "left join insure.sys_menu m on um.menu_id=m.menu_id"
				+ " where status=1";
		List<Map<String, Object>> menuList = (List<Map<String, Object>>) jdbcTemplate.queryForList(sql, new Object[]{});
		return menuList;
	}

	public List<Map<String, Object>> getRoleByUserId(String userId) {
		String sql = "select ur.role_id from insure.sys_user_role ur "
				+ "left join insure.sys_role r on ur.role_id=r.role_id"
				+ " where r.status=1 and ur.user_id=?";
		List<Map<String, Object>> roleList = (List<Map<String, Object>>) jdbcTemplate.queryForList(sql, new Object[]{Long.parseLong(userId)});
		return roleList;
	}

	public boolean updateStatus(String userId, int status) {
		String sql = "update insure.sys_user set status=? where user_id=?";
		int isUpdate = jdbcTemplate.update(sql,
				new Object[]{status, Long.parseLong(userId)});
		return (isUpdate != 0);
	}

	//取得租户sequence值
	private String hireserial() {
		String sql = "SELECT nextval('insure.hireserial') as nextv;";
		Long num = jdbcTemplate.query(sql, new ResultSetExtractor<Long>() {
			@Override
			public Long extractData(ResultSet rs) throws SQLException,
                    DataAccessException {
				if (rs.next()) {
					return rs.getLong("nextv");
				}
				return 0L;
			}
		});
		return num + "";
	}

	public boolean addUser(User user) {
		String puserType = user.getParentUser().getUserType();
		String userType = user.getUserType();
		String entId = "", is_worker = "", sys_type = "";
		if (userType.matches("2") && !puserType.matches("2")) {
			entId = hireserial();
		} else if (puserType.matches("2")) {
			entId = user.getParentUser().getEnterprise_id();
			sys_type = user.getParentUser().getSys_type();

		}
		is_worker = user.getIs_worker();

		String sql = "insert into insure.sys_user(user_name,password,user_type,parent_id,phone,email,status,create_time,enterprise_id,is_worker,sys_type, isvip, expire_date) values(?,?,?,?,?,?,?,?,?,?,?,?,?)";
		int isUpdate = jdbcTemplate.update(sql,
				new Object[]{
						user.getUserName(),
						user.getPassword(),
						Integer.parseInt(user.getUserType()),
						Long.parseLong(user.getParentId()),
						user.getPhone(),
						user.getEmail(),
						user.getStatus(),
						new Date(),
						entId,
						is_worker, sys_type,
						user.getIsVip(),
						user.getExpireDate()
				});
		return (isUpdate != 0);
	}

	/**
	 * 将userId下的用户菜单表全部删除掉之后，再将新选中的menuIdStrs菜单所有id，加到用户菜单表中
	 * @param userId
	 * @param menuIdStrs
     * @return
     */
	public boolean addUserMenu(String userId, String[] menuIdStrs) {
		boolean result = true;
		deleteUserMenu(userId.split(","));
		if (menuIdStrs != null) {
			List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
			Long[] menuIds = UtilString.strArrConvertToLongArr(menuIdStrs);
			for (long menuId : menuIds) {
				Map<String, Object> userMenu = new HashMap<String, Object>();
				userMenu.put("user_id", Long.parseLong(userId));
				userMenu.put("menu_id", menuId);
				list.add(userMenu);
			}
			result = jdbcUtil.batchUpdateBy("insure.sys_user_menu", list);
		}
		return result;
	}

	/**
	 * 将当前用户userId下的所有子用户全部找出，然后将子用户中用户菜单表属于menuIdStrs[userId没有的子菜单]全部删除
	 * @param userId
	 * @param menuIdStrs
     * @return
     */
	public boolean delSubUMCanceledMids(String userId, String[] menuIdStrs) {
		if (menuIdStrs.length == 0) {
			menuIdStrs = new String[]{"-1"};
		}
		StringBuffer placeholderSb = new StringBuffer();
		for (int i = 0; i < menuIdStrs.length; i++) {
			if (i == menuIdStrs.length - 1)
				placeholderSb.append("?");
			else {
				placeholderSb.append("?,");
			}
		}
//		String sql = "delete from insure.sys_user_menu um where um.user_id in("
//				+ "with RECURSIVE sub_users as ("
//				+ "select a.user_id,a.parent_id from insure.sys_user a "
//				+ "where a.parent_id=" + Long.parseLong(userId) + " union all "
//				+ "select b.user_id,b.parent_id from insure.sys_user b "
//				+ "inner join sub_users c on c.user_id = b.parent_id "
//				+ ")select su.user_id from sub_users su)"
//				+ " and um.menu_id in(" + placeholderSb + ")";
//		String sql = "with sub_userid as (select user_id from insure.recursiveUser('{"+Long.parseLong(userId)+"}') )" +
//				" delete from insure.sys_user_menu um where um.user_id in("
//				+ "select a.user_id from sub_userid a )"
//				+ " and um.menu_id in(" + placeholderSb + ")";

		String subSql = "select user_id from insure.recursiveUser('{"+Long.parseLong(userId)+"}')";
		List<Map<String, Object>> userIdList = jdbcTemplate.queryForList(subSql);
		if (userIdList.size() > 0) {
			StringBuffer userIdBuf = new StringBuffer();//{user_id=420}
			for (int i=0; i < userIdList.size(); i++) {
				userIdBuf.append(","+userIdList.get(i).get("user_id"));
			}
			String userIdStr = userIdBuf.substring(1);
			String sql = "delete from insure.sys_user_menu um where um.user_id in ("+userIdStr+") and um.menu_id in ("+placeholderSb+")";
			Long[] ids = UtilString.strArrConvertToLongArr(menuIdStrs);
			try {
				int isUpdate = jdbcTemplate.update(sql, ids);
			} catch (Exception e) {
				// TODO: handle exception
				e.printStackTrace();
				return false;
			}
		}
		return true;
	}

	/**
	 * 将当前用户userId下的所有子用户全部找出，然后将子用户中角色菜单表中属于menuIdStrs[userId没有的子菜单]全部删除
	 * @param userId
	 * @param menuIdStrs
     * @return
     */
	public boolean delSubRMCanceledMids(String userId, String[] menuIdStrs) {
		if (menuIdStrs.length == 0) {
			menuIdStrs = new String[]{"-1"};
		}
		StringBuffer placeholderSb = new StringBuffer();
		for (int i = 0; i < menuIdStrs.length; i++) {
			if (i == menuIdStrs.length - 1)
				placeholderSb.append("?");
			else {
				placeholderSb.append("?,");
			}
		}
//		String sql = "delete from insure.sys_role_menu rm "
//				+ "where rm.role_id in("
//				+ "select distinct(role_id) from insure.sys_user_role ur where ur.user_id in("
//				+ "with RECURSIVE sub_users as ("
//				+ "select a.user_id,a.parent_id from insure.sys_user a where a.parent_id=" + Long.parseLong(userId) + " "
//				+ "union all "
//				+ "select b.user_id,b.parent_id from insure.sys_user b "
//				+ "inner join sub_users c on c.user_id = b.parent_id )select su.user_id from sub_users su)) "
//				+ "and rm.menu_id in(" + placeholderSb + ")";
//		Long[] ids = UtilString.strArrConvertToLongArr(menuIdStrs);
//		try {
//			int isUpdate = jdbc.update(sql, ids);
//		} catch (Exception e) {
//			// TODO: handle exception
//			e.printStackTrace();
//			return false;
//		}
//		return true;
		String subSql = "select user_id from insure.recursiveUser('{"+Long.parseLong(userId)+"}')";
		List<Map<String, Object>> userIdList = jdbcTemplate.queryForList(subSql);
		if (userIdList.size() > 0) {
			StringBuffer userIdBuf = new StringBuffer();//{user_id=420}
			for (int i=0; i < userIdList.size(); i++) {
				userIdBuf.append(","+userIdList.get(i).get("user_id"));
			}
			String userIdStr = userIdBuf.substring(1);
			String sql = "delete from insure.sys_role_menu rm where rm.role_id in " +
					"(select distinct(role_id) from insure.sys_user_role ur " +
					"where ur.user_id in ("+userIdStr+")) and rm.menu_id in (" + placeholderSb + ")";
			Long[] ids = UtilString.strArrConvertToLongArr(menuIdStrs);
			try {
				int isUpdate = jdbcTemplate.update(sql, ids);
			} catch (Exception e) {
				// TODO: handle exception
				e.printStackTrace();
				return false;
			}
		}
		return true;
	}

	public boolean deleteUMByUserIdRoleIds(String userId, String[] roleIdStrs) {
		StringBuffer placeholderSb = new StringBuffer();
		for (int i = 0; i < roleIdStrs.length; i++) {
			if (i == roleIdStrs.length - 1)
				placeholderSb.append("?");
			else {
				placeholderSb.append("?,");
			}
		}
		String sql = "delete from insure.sys_user_menu um where um.user_id=" + Long.parseLong(userId)
				+ " and um.menu_id in"
				+ " (select menu_id from insure.sys_role_menu rm where rm.role_id in (" + placeholderSb + "))";

		Long[] roleIds = UtilString.strArrConvertToLongArr(roleIdStrs);
		try {
			int isUpdate = jdbcTemplate.update(sql, roleIds);
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return false;
		}

		return true;
	}

	public boolean addUserRole(String userId, String[] roleIdStrs) {

		deleteUserRole(userId.split(","));

		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();

		Long[] roleIds = UtilString.strArrConvertToLongArr(roleIdStrs);
		for (long roleId : roleIds) {
			Map<String, Object> userRole = new HashMap<String, Object>();
			userRole.put("user_id", Long.parseLong(userId));
			userRole.put("role_id", roleId);
			list.add(userRole);
		}
		boolean result = jdbcUtil.batchUpdateBy("insure.sys_user_role", list);

		return result;
	}

	public boolean editUser(User user) {
		String sql = "update insure.sys_user set user_name=?,phone=?,email=?,is_worker=?,isvip=?,expire_date=?  where user_id=?";
		int isUpdate = jdbcTemplate.update(sql,
				new Object[]{
						user.getUserName(),
						user.getPhone(),
						user.getEmail(),
						user.getIs_worker(),
						user.getIsVip(),
						user.getExpireDate(),
						Long.parseLong(user.getUserId())
				});
		return (isUpdate != 0);
	}

	public boolean deleteUser(String[] userIdStrs) {
		Long[] userIds = UtilString.strArrConvertToLongArr(userIdStrs);
		StringBuffer sqlInAppend = new StringBuffer();
		for (int i = 0; i < userIds.length; i++) {
			sqlInAppend.append("?");
			if (i != userIds.length - 1) {
				sqlInAppend.append(",");
			}
		}
		String sql = "delete from insure.sys_user where user_id in (" + sqlInAppend.toString() + ")";
		try {
			int isUpdate = jdbcTemplate.update(sql, userIds);
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return false;
		}

		return true;
	}

	public boolean deleteUserByType(String userType) {
		String sql = "delete from insure.sys_user where user_type = ?";

		try{
			int user_type = Integer.parseInt(userType);
			int isUpdate = jdbcTemplate.update(sql, user_type);
		}catch(Exception e) {
			//TODO:handle exception
			e.printStackTrace();
			return false;
		}
		return true;
	}

	/**
	 * 依据选中的用户id，将这个用户id对应的用户菜单表全部删除掉
	 * @param userIdStrs
     */
	public boolean deleteUserMenu(String[] userIdStrs) {
		Long[] userIds = UtilString.strArrConvertToLongArr(userIdStrs);
		StringBuffer sqlInAppend = new StringBuffer();
		for (int i = 0; i < userIds.length; i++) {
			sqlInAppend.append("?");
			if (i != userIds.length - 1) {
				sqlInAppend.append(",");
			}
		}
		String sql = "delete from insure.sys_user_menu where user_id in (" + sqlInAppend.toString() + ")";
		try {
			int isUpdate = jdbcTemplate.update(sql, userIds);
		} catch (Exception e) {
			return false;
		}

		return true;
	}

	public List<Map<String, Object>> getChildUserByUserId(String userId) {
		String sql = "select user_id from insure.sys_user where parent_id=?";
		List<Map<String, Object>> childUsers =
				(List<Map<String, Object>>) jdbcTemplate.queryForList(sql, new Object[]{Long.parseLong(userId)});
		return childUsers;

	}

	public boolean deleteUserRole(String[] userIdStrs) {
		Long[] userIds = UtilString.strArrConvertToLongArr(userIdStrs);
		StringBuffer sqlInAppend = new StringBuffer();
		for (int i = 0; i < userIds.length; i++) {
			sqlInAppend.append("?");
			if (i != userIds.length - 1) {
				sqlInAppend.append(",");
			}
		}
		String sql = "delete from insure.sys_user_role where user_id in (" + sqlInAppend.toString() + ")";
		try {
			int isUpdate = jdbcTemplate.update(sql, userIds);
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return false;
		}

		return true;
	}

	public User getUserByNamePassword(String userName, String password) {
		String sql = "select * " +
				" from zz_wechat.sys_user " +
				" where nick_name = ? and password= ?";
		Map<String, Object> map = jdbcTemplate.queryForMap(sql, new Object[]{userName, password});
		if (null == map) {
			return null;
		}
		User user = new User();
		user.setId(map.get("id").toString());
		user.setUserId(map.get("user_id").toString());
		user.setUserName(map.get("nick_name").toString());

//		user.setParentId(map.get("parent_id").toString());
		user.setStatus((Integer) map.get("status"));
		user.setPhone(map.get("tel_phone") == null ? "" : map.get("tel_phone").toString());
//		user.setEmail(map.get("email") == null ? "" : map.get("email").toString());
//		user.setEnterprise_id(map.get("enterprise_id") == null ? "" : map.get("enterprise_id").toString());
//		user.setIs_worker(map.get("is_worker") == null ? "" : map.get("is_worker").toString());
//		user.setSys_type(map.get("sys_type") == null ? "" : map.get("sys_type").toString());
//		user.setIsVip(map.get("isvip")==null ? "" : map.get("isvip").toString());
//		user.setExpireDate(map.get("expire_date") == null ? "" : map.get("expire_date").toString());
		return user;
	}

	public int updatePassword(String userName, String password, String newpassword) {
		String sql = "update zz_wechat.sys_user set password=? where nick_name=? and password=?";
		int isUpdate = jdbcTemplate.update(sql,
				new Object[]{
						newpassword,
						userName,
						password
				});
		return isUpdate;
	}

	@Override
	public void addLoginLog(HttpServletRequest request, User user) {
		int isUpdate = jdbcTemplate.update("INSERT INTO sys_login_log (user_id,login_time)VALUES(?,NOW())",
				new Object[]{
						user.getId()
				});
	}

	public List<Map<String, Object>> getMenuTreeByUserId(String userId) {
		String sql = "with umenu as ("
				+ "(select um.menu_id from insure.sys_user_menu um where um.user_id=" + Long.parseLong(userId) + ")"
				+ " union "
				+ "(select rm.menu_id from insure.sys_role_menu rm where rm.role_id in"
				+ "(select ur.role_id from insure.sys_user_role ur "
				+ "left join insure.sys_role r on ur.role_id=r.role_id "
				+ "where r.status=1 and ur.user_id=" + Long.parseLong(userId) + "))"
				+ ")select row_number() over(partition by m.parent_id order by m.menu_sort),"
				+ "m.menu_id,m.menu_name,m.action_url,m.parent_id,m.menu_sort,m.img_flag,m.subnode_flag from umenu um "
				+ "left join insure.sys_menu m on um.menu_id=m.menu_id"
				+ " where status=1";
		List<Map<String, Object>> menuList = (List<Map<String, Object>>) jdbcTemplate.queryForList(sql, new Object[]{});
		return menuList;
	}

	public List<Map<String, Object>> getMenuTreeByUidAndUtp(String userId, String userType) {
		String sql = "with umenu as ("
				+ "(select um.menu_id from insure.sys_user_menu um where um.user_id=" + Long.parseLong(userId) + ")"
				+ " union "
				+ "(select rm.menu_id from insure.sys_role_menu rm where rm.role_id in"
				+ "(select ur.role_id from insure.sys_user_role ur "
				+ "left join insure.sys_role r on ur.role_id=r.role_id "
				+ "where r.status=1 and ur.user_id=" + Long.parseLong(userId) + "))"
				+ " union "
				+ "(select gm.menu_id from insure.sys_group_menu gm where gm.group_code=" + Integer.parseInt(userType) + ")"
				+ ")select row_number() over(partition by m.parent_id order by m.menu_sort),"
				+ "m.menu_id,m.menu_name,m.action_url,m.parent_id,m.menu_sort,m.img_flag,m.subnode_flag from umenu um "
				+ "left join insure.sys_menu m on um.menu_id=m.menu_id"
				+ " where status=1";
		List<Map<String, Object>> menuList = (List<Map<String, Object>>) jdbcTemplate.queryForList(sql, new Object[]{});
		return menuList;
	}

	public List<Map<String, Object>> getUserApps(String entId) {
		String sql = "select id,name from insure.resource_table where status=1 and parent_id=?";
		List<Map<String, Object>> applist = (List<Map<String, Object>>) jdbcTemplate.queryForList(sql, new Object[]{entId});
		return applist;
	}

	@Override
	public User getUserByName(String userName) {
		User user = new User();
		String sql = "SELECT user_id,user_name,password,phone,email,status,user_type,parent_id,enterprise_id FROM insure.sys_user "
				+ " where user_name='" + userName + "'";
		Map<String, Object> map = jdbcTemplate.queryForMap(sql);
		if (null == map) {
			return null;
		}
		user.setUserName(String.valueOf(map.get("name")));
		user.setUserId(String.valueOf(map.get("user_id")));
		user.setPassword(map.get("password").toString());
//        user.setDomain(String.valueOf(map.get("domain")));
//        user.setProperty(String.valueOf(map.get("tsu_pro")));
		user.setEmail(String.valueOf(map.get("email")));
		user.setEnterprise_id(map.get("enterprise_id").toString());
		user.setParentId(map.get("parent_id").toString());
//        Enterprise enterprise = new Enterprise();
//        enterprise.setId(String.valueOf(map.get("enterprise_id")));
//        enterprise.setProperty(String.valueOf(map.get("rt_pro")));
//        user.setEnterprise(enterprise);
		return user;
	}

	//插入数据时用户表指定为租户，resource_table数据及指定property
	@Override
	public boolean regist(Map<String, Object> map) {

		String pid = hireserial();
		App app = new App();
		app.setId(hireserial());
		app.setParentId(pid);

		Map<String, Object> appProperty = new HashMap<String, Object>();
		appProperty.put("ip", map.get("ip"));
		appProperty.put("domain", map.get("domain"));
		app.setProperty(appProperty);

/*		PGobject appPro = new PGobject();
		appPro.setType("json");
		try {
			appPro.setValue((new ObjectMapper()).writeValueAsString(app.getProperty()));
		} catch (Exception e) {
			e.printStackTrace();
		}*/
		User user = new User();
		user.setUserName(String.valueOf(map.get("name")));
//        user.setDomain(String.valueOf(map.get("domain")));
		user.setPassword(String.valueOf(map.get("password")));
		user.setPhone(map.get("phone").toString());
		user.setEmail(String.valueOf(map.get("email")));
		user.setStatus(1);
		user.setUserType("2");
		user.setParentId("1");
		user.setEnterprise_id(pid);
		user.setIs_worker(map.get("webtype").toString());
		user.setSys_type(map.get("systype").toString());

		Map<String, Object> hirepro = new HashMap<String, Object>();
		hirepro.put("name", String.valueOf(map.get("company")));
		hirepro.put("company", map.get("company"));
		hirepro.put("phone", map.get("phone"));
		hirepro.put("contact", map.get("contact"));
		hirepro.put("domain", map.get("domain"));

/*		PGobject hireProperty = new PGobject();
		hireProperty.setType("json");
		try {
			hireProperty.setValue((new ObjectMapper()).writeValueAsString(hirepro));
		} catch (Exception e) {
			e.printStackTrace();
		}*/

		String sql = "insert into insure.sys_user(user_name,password,phone,email,status,user_type,create_time,parent_id,enterprise_id,is_worker,hirepro,sys_type) values(?,?,?,?,?,?,?,?,?,?,?,?)";
		int isUpdateUser = jdbcTemplate.update(sql, new Object[]{user.getUserName(), user.getPassword(), user.getPhone(),
				user.getEmail(), user.getStatus(), Integer.parseInt(user.getUserType()), new Date(),
				Integer.parseInt(user.getParentId()), user.getEnterprise_id(), user.getIs_worker(), "", user.getSys_type()});

		String sql3 = "insert into insure.resource_table(id,parent_id,name,type,status,property,opt_date) values(?,?,?,?,?,?,?)";
		int isUpdateApp = jdbcTemplate.update(sql3, new Object[]{app.getId(), app.getParentId(), "应用", ResourceType.APP.getCode(), AppType.WAITOPEN.getCode(), "", DateUtil.formatDateTime(new Date(), "yyyy-MM-dd HH:mm:ss")});

		return (isUpdateUser != 0 && isUpdateApp != 0);
	}

	@Override
	public Boolean getdomain(String domain) {

		String sql = "SELECT rt.property->>'domain' dom FROM insure.resource_table rt " +
				"where (rt.property->>'domain') is not null " +
				"and (rt.property->>'domain') = '" + domain + "' ";
		Map<String, Object> map = jdbcTemplate.queryForMap(sql);
		if (map != null) {
			String retd = (String) map.get("dom");
			return domain.equals(retd);
		}
		return false;
	}

	/**
	 * 查找是否已经有邮件信息，如果有就进行更新
	 */
	@Override
	public Integer addEmailConfig(Email email) {
		String sql = "SELECT * FROM insure.sys_config where config_type='email'";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		if (list.size() == 0) {
			sql = "INSERT INTO insure.sys_config (config_type,mail,server_domain) VALUES (?,(?,?,?,?),?)";
			Object[] obj = new Object[]{email.getConfigType(), email.getSmtpServer(), email.getSmtpPort(), email.getEmailName(), email.getPassword(), email.getServerDomain()};
			return jdbcTemplate.update(sql, obj);
		} else {
			sql = "update insure.sys_config set mail.smpt_server =?," + "mail.smpt_port =?,mail.mail_server =?,mail.mail_pw =?, server_domain=? " + " where config_type='email'";

			Object[] obj = new Object[]{email.getSmtpServer(), email.getSmtpPort(), email.getEmailName(), email.getPassword(), email.getServerDomain()};
			return jdbcTemplate.update(sql, obj);
		}
	}

	@Override
	public Integer delEmail() {
		String sql = "delete from insure.sys_config where config_type ='email'";
		return jdbcTemplate.update(sql);
	}

	/**
	 * 查找是否已经有邮件信息，如果有就进行更新
	 */
	@Override
	public List<Map<String, Object>> getEmailConfig() {
		String sql = "SELECT (mail).*,server_domain FROM insure.sys_config where config_type='email'";
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		return list;

	}

	/**
	 * 读取用户邮件信息
	 */
	@Override
	public Integer resetpw(String email, String newpw) {
		String sql = "update zz_wechat.sys_user set password='" + newpw + "' where email = '" + email + "'";
		return jdbcTemplate.update(sql);
	}

	/**
	 * 查询所有admin账号的名称及所属的公司名称信息,在super和@kingweather创建其他公司账号时使用
	 */
	@Override
	public Page<Map<String, Object>> getAllAdminAndGroup(Map<String, Object> conditions) {
//		String sql = "SELECT g.group_name , u.user_name, g.group_code from insure.sys_user_group g, insure.sys_user u " +
//				"where g.group_id = u.user_type and u.user_name not like '%super%' " +
//				"and u.parent_id = 1 " +
//				"and u.user_name not like '%@kingweather%' ";
//		String countSql = "SELECT count(*) from insure.sys_user_group g, insure.sys_user u " +
//				"where g.group_id = u.user_type and u.user_name not like '%super%' " +
//				"and u.parent_id = 1 " +
//				"and u.user_name not like '%@kingweather%' ";
		String sql = "select g.group_name, u.user_name " +
				"from (select ug.group_name, ug.group_code from insure.sys_user_group ug) g " +
				"left join insure.sys_user u on u.user_type = g.group_code " +
				"where u.user_name like '%admin%' and u.user_name not like '%kingweather%'";
		String countSql = "select count(*) " +
				"from (select ug.group_name, ug.group_code from insure.sys_user_group ug) g " +
				"left join insure.sys_user u on u.user_type = g.group_code " +
				"where u.user_name like '%admin%' and u.user_name not like '%kingweather%'";
		Integer startNum = Integer.valueOf(conditions.get("startNum").toString());
		Integer pageSize = Integer.valueOf(conditions.get("pageSize").toString());

		Page<Map<String, Object>> page = jdbcUtil.queryForPage(startNum, pageSize, countSql, sql,
				new Object[]{});
		return page;
	}

	/**
	 * 读取用户邮件信息
	 */
	@Override
	public String readEmail(String email) {
		String sql = "SELECT email FROM insure.sys_user where email = '" + email + "'";
		String emailstr = jdbcTemplate.query(sql, new ResultSetExtractor<String>() {
			@Override
			public String extractData(ResultSet rs) throws SQLException, DataAccessException {
				if (rs.next()) {
					return rs.getString("email");
				}
				return null;
			}
		});
		return emailstr;
	}
}

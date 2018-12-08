package com.kingweather.system.dao.manager.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.kingweather.common.jdbc.JdbcUtil;
import com.kingweather.common.util.Page;
import com.kingweather.common.util.UtilString;
import com.kingweather.system.dao.manager.RoleManagerDao;
import com.kingweather.system.manager.domain.Role;



/**
 * 角色管理
 */
@Repository
public class RoleManagerDaoImpl implements RoleManagerDao
{

	@Autowired
	private JdbcUtil jdbcUtil;

	@Autowired
	private JdbcTemplate jdbcTemplate;


	public Page<Map<String, Object>> getAllRole(int startNum, int pageSize,Map<String,Object> conditions){
		 String sql = "select role_id,role_name,status,role_note from insure.sys_role ";
	     String countSql = "select count(*) from insure.sys_role ";
	     String whereSql = "where 1=1";
	     
	     String status = conditions.get("status")==null?"":conditions.get("status").toString();	  
	     String roleName = conditions.get("roleName")==null?"":conditions.get("roleName").toString();
	     if(!"".equals(status)){
	    	 whereSql = whereSql+" and status="+Integer.parseInt(status);
	     } else if(!"".equals(roleName)){
	    	 whereSql = whereSql + " and role_name like '%"+roleName+"%'";
	     }
	     long userId = Long.parseLong(conditions.get("userId").toString());
	     whereSql = whereSql+" and user_id="+userId;
	     
	     Page<Map<String, Object>> page = jdbcUtil.queryForPage(
	    		 Integer.valueOf(startNum), 
	    		 Integer.valueOf(pageSize), 
	    		 countSql+whereSql, 
	    		 sql+whereSql,
	    		 new Object[]{});
	        return page;
	}
	
	public List<Map<String, Object>> getMenuByRoleId(String roleId){
		String sql = "select rm.menu_id from insure.sys_role_menu rm where rm.role_id=?";
		List<Map<String, Object>> menuList = (List<Map<String, Object>>)jdbcTemplate.queryForList(sql,new Object[]{Long.parseLong(roleId)});
		return menuList;
	}
	
	public boolean addRole(Role role) {
		String sql = "insert into insure.sys_role(role_name,status,role_note,user_id) values(?,?,?,?)";
		int isUpdate = jdbcTemplate.update(sql,
				new Object[]{
				role.getRoleName(),
				role.getStatus(),
				role.getRoleNote(),
				Long.parseLong(role.getUserId())
				});
		return (isUpdate != 0);
	}
	
	public boolean deleteUMByRoleIdAndMenuIds(String roleId, String [] menuIdStrs){
	   StringBuffer placeholderSb = new StringBuffer();
        for (int i = 0; i < menuIdStrs.length; i++) {
          if (i == menuIdStrs.length - 1)
            placeholderSb.append("?");
          else {
            placeholderSb.append("?,");
          }
        }
		String sql = "delete from insure.sys_user_menu um where um.menu_id in ("+placeholderSb+") "
				+ "and um.user_id in "
				+ "(select ur.user_id from insure.sys_user_role ur where ur.role_id="+Long.parseLong(roleId)+")";
		Long [] menuIds = UtilString.strArrConvertToLongArr(menuIdStrs);
		try {
			int isUpdate = jdbcTemplate.update(sql, menuIds);
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return false;
		}		
		return true;
	}
	
	public boolean addRoleMenu(String roleId, String [] menuIdStrs) {
		
		String [] rids = roleId.split(",");
		deleteRoleMenu(rids);
		
		List<Map<String, Object>> list = new ArrayList<Map<String,Object>>();
		
		Long [] menuIds = UtilString.strArrConvertToLongArr(menuIdStrs);
		for(long menuId : menuIds){
			Map<String,Object> roleMenu = new HashMap<String, Object>();
			roleMenu.put("role_id", Long.parseLong(roleId));
			roleMenu.put("menu_id", menuId);
			list.add(roleMenu);
		}
		boolean result = jdbcUtil.batchUpdateBy("insure.sys_role_menu", list);
		
		return result;
	}
	
	public boolean delSubRMCanceledMids(String roleId, String [] menuIdStrs){
		if(menuIdStrs.length==0){
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
		String sql = "delete from insure.sys_role_menu rm where rm.role_id in"
				+ "(select distinct(role_id) from insure.sys_user_role where user_id in"
				+ "(with RECURSIVE sub_users as ("
				+ "select a.user_id,a.parent_id from insure.sys_user a "
				+ "where a.parent_id in"
				+ "(select user_id from insure.sys_user_role ur where ur.role_id="+Long.parseLong(roleId)+") "
				+ "union all "
				+ "select b.user_id,b.parent_id from insure.sys_user b "
				+ "inner join sub_users c on c.user_id = b.parent_id"
				+ ")select su.user_id from sub_users su)"
				+ ") and rm.menu_id in ("+placeholderSb+")";
		Long [] ids = UtilString.strArrConvertToLongArr(menuIdStrs);
		try {
			int isUpdate = jdbcTemplate.update(sql, ids);
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return false;
		}
		
		return true;
	}


	public boolean delSubUMCanceledMids(String roleId, String [] menuIdStrs){
		if(menuIdStrs.length==0){
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
		String sql = "delete from insure.sys_user_menu um where um.user_id in("
				+ "with RECURSIVE sub_users as ("
				+ "select a.user_id,a.parent_id from insure.sys_user a "
				+ "where a.parent_id in "
				+ "(select user_id from insure.sys_user_role ur where ur.role_id="+Long.parseLong(roleId)+") "
				+ "union all "
				+ "select b.user_id,b.parent_id from insure.sys_user b "
				+ "inner join sub_users c on c.user_id = b.parent_id"
				+ ")select su.user_id from sub_users su) "
				+ "and um.menu_id in("+placeholderSb+")";
		Long [] ids = UtilString.strArrConvertToLongArr(menuIdStrs);
		try {
			int isUpdate = jdbcTemplate.update(sql, ids);
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return false;
		}
		return true;
	}
	
	public List<Map<String,Object>> getParentUserByRoleId(String parentId,String roleId){
		String sql = "select distinct(ur.user_id) from insure.sys_user_role ur "
				+ "left join insure.sys_user u on ur.user_id=u.user_id "
				+ "where u.parent_id=? and ur.role_id=?";
		
		List<Map<String, Object>> userList = (List<Map<String, Object>>)
				jdbcTemplate.queryForList(sql,new Object[]{Long.parseLong(parentId),Long.parseLong(roleId)});
		return userList;
	}
	
	public boolean editRole(Role role) {
		String sql = "update insure.sys_role set role_name=?,role_note=? where role_id=?";
		try {
			int isUpdate = jdbcTemplate.update(sql,
					new Object[]{
						role.getRoleName(),
						role.getRoleNote(),
						Long.parseLong(role.getRoleId())
						});
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return false;
		}		
		return true;
	}

	public boolean updateStatus(String roleId,int status){
		String sql = "update insure.sys_role set status=? where role_id=?";
		try {
			int isUpdate = jdbcTemplate.update(sql,
					new Object[]{status,Long.parseLong(roleId)});
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return false;
		}
		return true;
	}
	
	public boolean deleteRole(String [] roleIdStrs) {
		
		Long [] roleIds = UtilString.strArrConvertToLongArr(roleIdStrs);
		StringBuffer sqlInAppend=new StringBuffer();
		for(int i=0;i<roleIds.length;i++){
			sqlInAppend.append("?");
			if(i!=roleIds.length-1){
				sqlInAppend.append(",");
			}
		}
		String sql = "delete from insure.sys_role where role_id in ("+sqlInAppend.toString()+")";
		try {
			int isUpdate = jdbcTemplate.update(sql, roleIds);
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return false;
		}		
		return true;
	}	
	
	public boolean deleteRoleMenu(String [] roleIdStrs){
		
		Long [] roleIds = UtilString.strArrConvertToLongArr(roleIdStrs);
		StringBuffer sqlInAppend=new StringBuffer();
		for(int i=0;i<roleIds.length;i++){
			sqlInAppend.append("?");
			if(i!=roleIds.length-1){
				sqlInAppend.append(",");
			}
		}
		String sql = "delete from insure.sys_role_menu where role_id in ("+sqlInAppend.toString()+")";
		try {
			int isUpdate = jdbcTemplate.update(sql, roleIds);
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return false;
		}		
		return true;
	}
	
	public boolean deleteUserRole(String [] roleIdStrs) {
		
		Long [] roleIds = UtilString.strArrConvertToLongArr(roleIdStrs);
		StringBuffer sqlInAppend=new StringBuffer();
		for(int i=0;i<roleIds.length;i++){
			sqlInAppend.append("?");
			if(i!=roleIds.length-1){
				sqlInAppend.append(",");
			}
		}
		String sql = "delete from insure.sys_user_role where role_id in ("+sqlInAppend.toString()+")";
		try {
			int isUpdate = jdbcTemplate.update(sql, roleIds);
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return false;
		}		
		return true;
	}	
}

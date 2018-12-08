package com.kingweather.system.dao.manager.impl;

import java.util.*;

import javax.annotation.Resource;

import com.kingweather.system.manager.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.kingweather.common.jdbc.JdbcUtil;
import com.kingweather.common.util.Page;
import com.kingweather.common.util.UtilString;
import com.kingweather.system.dao.manager.UserGroupManagerDao;
import com.kingweather.system.manager.domain.UserGroup;


/**
 * 用户组管理
 */
@Repository
public class UserGroupManagerDaoImpl implements UserGroupManagerDao
{

	@Autowired
	private JdbcUtil jdbcUtil;
	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Override
	public Page<Map<String, Object>> getAllUserGroup(int startNum, int pageSize) {
		// TODO Auto-generated method stub
		String sql = "select g.group_id, g.group_name, g.group_note, g.group_code from " +
				"(select group_id " +
				"from insure.sys_user_group " +
				"GROUP BY group_id) sub ,insure.sys_user_group g " +
				"where g.group_id = sub.group_id";
		String countSql = "select count(*) from " +
				"(select group_id " +
				"from insure.sys_user_group " +
				"GROUP BY group_id) sub ,insure.sys_user_group g " +
				"where g.group_id = sub.group_id";
	     Page<Map<String, Object>> page = jdbcUtil.queryForPage(Integer.valueOf(startNum), Integer.valueOf(pageSize), countSql, sql, new Object[]{});
		 return page;
	}

    @Override
    public Page<Map<String, Object>> getAllUserGroup(Map<String, Object> conditions) {
        String gName = conditions.get("gName") == null ? "" : conditions.get("gName").toString();
        Integer startNum = Integer.valueOf(conditions.get("startNum").toString());
        Integer pageSize = Integer.valueOf(conditions.get("pageSize").toString());
		String sql = "select g.group_id, g.group_name, g.group_note, g.group_code from " +
				"(select group_id " +
				"from insure.sys_user_group " +
				"where group_name like '%"+gName+"%' " +
				"GROUP BY group_id) sub ,insure.sys_user_group g " +
				"where g.group_id = sub.group_id";
		String countSql = "select count(*) from " +
				"(select group_id " +
				"from insure.sys_user_group " +
				"where group_name like '%"+gName+"%' " +
				"GROUP BY group_id) sub ,insure.sys_user_group g " +
				"where g.group_id = sub.group_id";
        Page<Map<String, Object>> page = jdbcUtil.queryForPage(startNum, pageSize, countSql, sql,
                new Object[]{});
        return page;
    }

    @Override
	public List<Map<String, Object>> getMenuByGroupCode(String groupCode) {
		// TODO Auto-generated method stub
		String sql = "select row_number() over(partition by m.parent_id order by m.menu_sort),"
				+ "m.menu_id,m.menu_name,m.action_url,m.parent_id,m.menu_sort "
				+ "from insure.sys_group_menu gm "
				+ "left join insure.sys_user_group ug on gm.group_code=ug.group_code "
				+ "left join insure.sys_menu m on gm.menu_id=m.menu_id "
				+ "where m.status=1 and gm.group_code=?";
		List<Map<String, Object>> menuList = (List<Map<String, Object>>)jdbcTemplate.queryForList(sql,new Object[]{Integer.parseInt(groupCode)});
		return menuList;
	}
	
	@Override
	public List<Map<String, Object>> getMenuIdsByGroupCode(String groupCode) {
		// TODO Auto-generated method stub
		String sql = "select m.menu_id "
				+ "from insure.sys_group_menu gm "
				+ "left join insure.sys_user_group ug on gm.group_code=ug.group_code "
				+ "left join insure.sys_menu m on gm.menu_id=m.menu_id "
				+ "where m.status=1 and gm.group_code=?";
		List<Map<String, Object>> menuList = (List<Map<String, Object>>)jdbcTemplate.queryForList(sql,new Object[]{Integer.parseInt(groupCode)});
		return menuList;
	}

	@Override
	public boolean addUserGroup(UserGroup group, User user) {
		String seq_sql = "select nextval('insure.group_id_seq'::regclass)";
        String add_admin = "insert into insure.sys_user(user_name,password,user_type,parent_id,email,status,create_time,is_worker) values(?,?,?,?,?,?,?,?)";
		try{
			int seq = Integer.parseInt(jdbcTemplate.queryForMap(seq_sql).get("nextval").toString());
            String sql = "insert into insure.sys_user_group(group_id, group_name, group_note, group_code) values(?, ?, ?, ?)";
            int isUpdate = jdbcTemplate.update(sql, new Object[]{seq, group.getGroupName(),group.getNote(), seq});
            int isAdd = jdbcTemplate.update(add_admin, new Object[]{
                    user.getUserName(),
                    user.getPassword(),
                    seq,
                    Long.parseLong(user.getParentId()),
                    user.getEmail(),
                    user.getStatus(),
                    new Date(),
                    user.getIs_worker()
            });
            return (isUpdate != 0 && isAdd != 0);
		}catch(NumberFormatException e) {
			e.printStackTrace();
            return false;
		}
	}

	@Override
	public boolean addUserMenu(String groupCode, String[] menuIds) {
		// TODO Auto-generated method stub
		deleteUserGroupMenu(groupCode);	
		
		List<Map<String, Object>> list = new ArrayList<Map<String,Object>>();
		
		Long [] ids = UtilString.strArrConvertToLongArr(menuIds);
		for(long mid : ids){
			Map<String,Object> groupMenu = new HashMap<String, Object>();
			groupMenu.put("group_code", Long.parseLong(groupCode));
			groupMenu.put("menu_id", mid);
			list.add(groupMenu);
		}
		boolean result = jdbcUtil.batchUpdateBy("insure.sys_group_menu", list);
		
		return result;
	}
	
	public boolean delRoleMenuForAdminUser(String groupCode,String[] menuIds){
		Long [] ids = UtilString.strArrConvertToLongArr(menuIds);
		
		StringBuffer sqlInAppend=new StringBuffer();
		for(int i=0;i<ids.length;i++){
			sqlInAppend.append("?");
			if(i!=ids.length-1){
				sqlInAppend.append(",");
			}
		}
		String sql = "delete from insure.sys_role_menu rm "
				+ "where rm.role_id in"
				+ " (select distinct(role_id) from insure.sys_user_role ur "
				+ "where ur.user_id in(select user_id from insure.sys_user "
				+ "where parent_id=1 and user_type="+Integer.parseInt(groupCode)+"))"
				+ " and rm.menu_id in("+sqlInAppend.toString()+")";
		try {
			int isUpdate = jdbcTemplate.update(sql,ids);
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return false;
		}
		
		return true;
	}

	public boolean delRoleMenuByGidAndMids(String groupCode,String[] menuIds){
		Long [] ids = UtilString.strArrConvertToLongArr(menuIds);
		
		StringBuffer sqlInAppend=new StringBuffer();
		for(int i=0;i<ids.length;i++){
			sqlInAppend.append("?");
			if(i!=ids.length-1){
				sqlInAppend.append(",");
			}
		}
		String sql = "delete from insure.sys_role_menu rm "
				+ "where rm.role_id in"
				+ " (select distinct(role_id) from insure.sys_user_role ur "
				+ "where ur.user_id in(select user_id from insure.sys_user where user_type="+Integer.parseInt(groupCode)+"))"
				+ " and rm.menu_id not in("+sqlInAppend.toString()+")";
		try {
			int isUpdate = jdbcTemplate.update(sql,ids);
		} catch (Exception e) {
			// TODO: handle exception
			return false;
		}
		
		return true;
	}
	
	public boolean delUserMenuForAdminUser(String groupCode,String[] menuIds){
		Long [] ids = UtilString.strArrConvertToLongArr(menuIds);
		
		StringBuffer sqlInAppend=new StringBuffer();
		for(int i=0;i<ids.length;i++){
			sqlInAppend.append("?");
			if(i!=ids.length-1){
				sqlInAppend.append(",");
			}
		}
		String sql = "delete from insure.sys_user_menu um "
				+ "where um.user_id in "
				+ "(select user_id from insure.sys_user where parent_id=1 and user_type="+Integer.parseInt(groupCode)+")"
				+ " and um.menu_id in("+sqlInAppend.toString()+")";
		try {
			int isUpdate = jdbcTemplate.update(sql, ids);
		} catch (Exception e) {
			// TODO: handle exception
			return false;
		}		
		return true;
	}
	
	public boolean delUserMenuByGidAndMids(String groupCode,String[] menuIds){
		Long [] ids = UtilString.strArrConvertToLongArr(menuIds);
		
		StringBuffer sqlInAppend=new StringBuffer();
		for(int i=0;i<ids.length;i++){
			sqlInAppend.append("?");
			if(i!=ids.length-1){
				sqlInAppend.append(",");
			}
		}
		String sql = "delete from insure.sys_user_menu um "
				+ "where um.user_id in (select user_id from insure.sys_user where user_type="+Integer.parseInt(groupCode)+")"
				+ " and um.menu_id not in("+sqlInAppend.toString()+")";
		try {
			int isUpdate = jdbcTemplate.update(sql, ids);
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
			return false;
		}
		
		return true;
	}
	@Override
	public boolean editUserGroup(UserGroup group) {
		// TODO Auto-generated method stub
		String sql = "update insure.sys_user_group set group_name=?,group_note=? where group_code=?";
		int isUpdate = jdbcTemplate.update(sql,
				new Object[]{
				group.getGroupName(),
				group.getNote(),
//				Integer.parseInt(group.getGroupCode())});
                Integer.parseInt(group.getGroupId())});
		return (isUpdate != 0);
	}

	@Override
	public boolean deleteUserGroup(String groupCode) {
		// TODO Auto-generated method stub
		deleteUserGroupMenu(groupCode);
		String sql = "delete from insure.sys_user_group where group_code=?";
		int isUpdate = jdbcTemplate.update(sql, Integer.parseInt(groupCode));
		return (isUpdate != 0);
	}

	@Override
	public boolean deleteUserGroupMenu(String groupCode) {
		// TODO Auto-generated method stub
		String sql = "delete from insure.sys_group_menu where group_code=?";
		int isUpdate = jdbcTemplate.update(sql, Integer.parseInt(groupCode));
		return (isUpdate != 0);
	}	
}

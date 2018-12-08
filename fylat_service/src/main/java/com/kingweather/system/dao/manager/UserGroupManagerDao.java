package com.kingweather.system.dao.manager;

import java.util.List;
import java.util.Map;

import com.kingweather.common.util.Page;
import com.kingweather.system.manager.domain.User;
import com.kingweather.system.manager.domain.UserGroup;

/**
 * 　用户管理
 */
public interface UserGroupManagerDao
{
	 /**
     * 查询所有用户组
     */
	Page<Map<String, Object>> getAllUserGroup(int startNum, int pageSize);

    /**
     * 根据名称查询公司
     */
	Page<Map<String, Object>> getAllUserGroup(Map<String, Object> conditions);

	 /**
     * 查询指定用户组的功能权限树
     */
	List<Map<String, Object>> getMenuByGroupCode(String groupCode);	
	
	 /**
     * 查询指定用户组的功能权限IDs
     */
	List<Map<String, Object>> getMenuIdsByGroupCode(String groupCode);
	
	 /**
     * 添加用户组
     */
    boolean addUserGroup(UserGroup group, User user);
    
    /**
     * 添加权限
     */
    boolean addUserMenu(String groupCode, String[] menuIds);
    
    /**
     * 删除一级用户权限表中包含用户组的权限
     */
    boolean delUserMenuForAdminUser(String groupCode, String[] menuIds);
    
    /**
     * 删除一级用户角色权限表中包含用户组的权限
     */
    boolean delRoleMenuForAdminUser(String groupCode, String[] menuIds);
    
    /**
     * 删除所有角色权限中在用户组内取消的权限
     */
    boolean delRoleMenuByGidAndMids(String groupCode, String[] menuIds);
    
    /**
     * 删除所有用户权限中在用户组内取消的权限
     */
    boolean delUserMenuByGidAndMids(String groupCode, String[] menuIds);
    
   
    /**
     * 编辑用户
     */
    boolean editUserGroup(UserGroup group);
    
    /**
     * 删除用户
     */
    boolean deleteUserGroup(String groupCode);
    
    /**
     * 删除用户权限
     */
    boolean deleteUserGroupMenu(String groupCode);

}
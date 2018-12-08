package com.kingweather.system.service.manager;

import com.kingweather.system.manager.domain.User;
import com.kingweather.system.manager.domain.UserGroup;

import java.util.Map;



/**
 * 用户组管理
 */
public interface UserGroupManagerService
{
  
	 /**
     * 查询用户组
     */
	Map<String, Object> getAllUserGroup(Object... object);

    /**
     *根据条件查询公司
     */
	Map<String, Object> getAllUserGroup(Map<String, Object> conditions);
	
	 /**
     * 查询指定用户组功能树
     */
	Map<String, Object> getMenuTreeByGroupCode(String groupCode);
	
	 /**
     * 查询指定用户组功能IDs
     */
	Map<String, Object> getMenuIdsByGroupCode(String groupCode);
	
	 /**
     * 添加用户组
     */
    boolean addUserGroup(UserGroup group, User user);
    
    /**
     * 添加权限
     */
    boolean addUserMenu(String groupCode, String menuIdsStr);
    
   
    /**
     * 编辑用户
     */
    boolean editUserGroup(UserGroup group);
    
    /**
     * 删除用户
     */
    boolean deleteUserGroup(String groupCode);
}

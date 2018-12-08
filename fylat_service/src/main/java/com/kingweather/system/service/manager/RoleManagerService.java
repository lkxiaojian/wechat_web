package com.kingweather.system.service.manager;

import java.util.Map;

import com.kingweather.system.manager.domain.Role;


/**
 * 角色管理
 */
public interface RoleManagerService
{
	
	 /**
     * 查询用户
     */
	Map<String, Object> getAllRole(Object... object);
   
	 /**
     * 添加角色
     */
    boolean addRole(Role role);
    
    /**
     * 添加权限
     */
    boolean addRoleMenu(String roleId, String menuIds);
    
    /**
     * 删除子用户权限、角色权限中父用户该角色取消的权限
     */
    boolean delSubRUMCanceledMids(String parentId, String roleId);

    /**
     * 编辑角色
     */
    boolean editRole(Role role);
    
    /**
     * 更新状态
     */
    boolean updateStatus(String roleId, int status);
    
    /**
     * 删除角色
     */
    boolean deleteRole(String roleId);
    
    /**
     * 查询指定角色拥有的功能授权
     */
    Map<String,Object> getMenuByRoleId(String roleId);
}

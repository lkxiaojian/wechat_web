package com.kingweather.system.dao.manager;

import java.util.List;
import java.util.Map;

import com.kingweather.common.util.Page;
import com.kingweather.system.manager.domain.Role;


/**
 * 角色管理
 */
public interface RoleManagerDao
{  
	 /**
     * 查询角色
     */
	Page<Map<String, Object>> getAllRole(int startNum, int pageSize, Map<String, Object> conditions);
	
	 /**
     * 添加角色
     */
    boolean addRole(Role role);
    
    /**
     * 删除用户功能拥有授权中 角色需要新增的功能授权
     */
    boolean deleteUMByRoleIdAndMenuIds(String roleId, String[] menuIdStrs);
    
    /**
     * 添加权限
     */
    boolean addRoleMenu(String roleId, String[] menuIds);
    
    /**
     * 查询赋予该角色的最上级用户
     */
    List<Map<String,Object>> getParentUserByRoleId(String parentId, String roleId);
    
    /**
     * 删除用户的子用户的角色权限表中已经取消的权限
     */
    boolean delSubRMCanceledMids(String roleId, String[] menuIdStrs);
    
    /**
     * 删除用户的子用户的用户权限表中已经取消的权限
     */
    boolean delSubUMCanceledMids(String roleId, String[] menuIdStrs);

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
    boolean deleteRole(String[] roleIds);
    
    /**
     * 删除角色权限
     */
    boolean deleteRoleMenu(String[] roleIds);
    
    /**
     * 删除用户角色
     */
    boolean deleteUserRole(String[] roleIdStrs);

    /**
     * 获取指定角色拥有的所有菜单项
     */
    List<Map<String, Object>> getMenuByRoleId(String roleId);
}
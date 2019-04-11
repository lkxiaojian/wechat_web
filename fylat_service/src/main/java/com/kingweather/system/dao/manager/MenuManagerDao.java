package com.kingweather.system.dao.manager;

import java.util.List;
import java.util.Map;

import com.kingweather.system.manager.domain.Menu;


/**
 * 　菜单管理
 */
public interface MenuManagerDao
{
	/**
     * 查询菜单
     */
	List<Map<String, Object>> getAllMenu(String menuSatus);
    /**
     * 查询用户可用菜单
     */
	List<Map<String, Object>> getUserMenu(String userId);

	 /**
     * 添加菜单
     */
    boolean addMenu(Menu menu);

    /**
     * 编辑菜单
     */
    boolean editMenu(Menu menu);
    
    /**
     * 删除菜单
     */
    boolean deleteMenu(String[] menuIds);
    
    /**
     * 删除用户功能授权
     */
    boolean deleteUserMenu(String[] menuIds);
	
    /**
     * 删除角色功能授权
     */
	boolean deleteRoleMenu(String[] menuIds);
}
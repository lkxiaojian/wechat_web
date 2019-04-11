package com.kingweather.system.service.manager;

import com.kingweather.system.manager.domain.Menu;

import java.util.List;
import java.util.Map;



/**
 * 菜单管理
 */
public interface MenuManagerService
{
	/**
     * 查询出的菜单属性转换成前端需要的结构
     */
	Map<String,Object> getTreeMap(Map<String, Object> menu);
	
	/**
     * 构造菜单树
     */
	void buildMenuTree(Map<String, Object> menuMap, List<Map<String, Object>> allMenus);
	
	/**
     * 获取菜单树
     */
	Map<String,Object> getAllMenuTree(String menuStatus);

	/**
	 * 获取当前用户可用的菜单
	 * @param userId
	 * @return
	 */
	Map<String,Object> getUserMenuTree(String userId);

	/**
     * 查询菜单列表
     */
	List<Map<String,Object>> getAllMenus();
	
	 /**
     * 添加菜单
     */
    boolean addMenu(Menu menu);

    /**
     * 编辑角色
     */
    boolean editMenu(Menu menu);
    
    /**
     * 删除菜单
     */
    boolean deleteMenu(String menuIds);
}

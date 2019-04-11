package com.kingweather.system.service.manager.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;


import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import com.kingweather.system.dao.manager.MenuManagerDao;
import com.kingweather.system.manager.domain.Menu;
import com.kingweather.system.service.manager.MenuManagerService;
import org.springframework.transaction.annotation.Transactional;


/**
 * 菜单管理
 */
@Service
public class MenuManagerServiceImpl implements MenuManagerService
{
	@Resource
    private MenuManagerDao menuManagerDaoImpl;
	@Transactional
	public Map<String,Object> getTreeMap(Map<String,Object> menu){
		Map<String,Object> treeMap = new HashMap<String, Object>();
		treeMap.put("id", menu.get("menu_id"));
		treeMap.put("text", menu.get("menu_name"));
		
		List<Map<String,Object>> userData = new ArrayList<Map<String,Object>>();
		
		Map<String,Object> urldata = new HashMap<String, Object>();
		urldata.put("name", "actionUrl");
		urldata.put("content", menu.get("action_url"));
		userData.add(urldata);
		
		Map<String,Object> sortdata = new HashMap<String, Object>();
		sortdata.put("name", "menuSort");
		sortdata.put("content", menu.get("menu_sort"));
		userData.add(sortdata);
		
		Map<String,Object> statusdata = new HashMap<String, Object>();
		statusdata.put("name", "status");
		statusdata.put("content", menu.get("status"));		
		userData.add(statusdata);
		
		Map<String,Object> imgFlag = new HashMap<String, Object>();
		imgFlag.put("name", "imgFlag");
		imgFlag.put("content", menu.get("img_flag"));		
		userData.add(imgFlag);
		
		Map<String,Object> subnodeFlag = new HashMap<String, Object>();
		subnodeFlag.put("name", "subnodeFlag");
		subnodeFlag.put("content", menu.get("subnode_flag"));		
		userData.add(subnodeFlag);

		Map<String, Object> userGroupSuffix = new HashMap<String, Object>();
		userGroupSuffix.put("name", "userGroupSuffix");
		userGroupSuffix.put("content", menu.get("user_group_suffix"));
		userData.add(userGroupSuffix);
		
		treeMap.put("userdata", userData);
		return treeMap;
	}
	@Transactional
	private List<Map<String,Object>> getChildren(Map<String,Object> menuMap,List<Map<String,Object>> allMenus){
		
		List<Map<String,Object>> childrenMenuList = new ArrayList<Map<String,Object>>();
		String menuId = menuMap.get("id").toString();
		for(Map<String,Object> menu : allMenus){
			String parentId = menu.get("parent_id").toString();
			if(menuId.equals(parentId)){
				Map<String,Object> childrenMenu = getTreeMap(menu);
				childrenMenuList.add(childrenMenu);
			}
		}
		return childrenMenuList;
	}
	@Transactional
	public void buildMenuTree(Map<String,Object> menuMap,List<Map<String,Object>> allMenus){
		List<Map<String,Object>> childrenMenus = getChildren(menuMap, allMenus);
		if(childrenMenus.isEmpty()){
			return;
		}
		menuMap.put("item", childrenMenus);
		for(Map<String,Object> menu : childrenMenus){
			buildMenuTree(menu, allMenus);
		}
	}
	@Transactional
	public Map<String,Object> getAllMenuTree(String menuStatus) {
		// TODO Auto-generated method stub
		List<Map<String,Object>> menulist = menuManagerDaoImpl.getAllMenu(menuStatus);
		
		List<Map<String,Object>> parentMenuList = new ArrayList<Map<String,Object>>();
		Map<String,String> urlMap = new HashMap<String,String>();
		for(Map<String,Object> menu : menulist){
			String parentId = menu.get("parent_id").toString();
			if(menu.get("action_url") != null && StringUtils.isNotEmpty(menu.get("action_url").toString())){
				urlMap.put(menu.get("action_url").toString(), "1");
			}
			if("0".equals(parentId)){
				Map<String,Object> parentMenu = getTreeMap(menu);
				
				buildMenuTree(parentMenu, menulist);
				parentMenuList.add(parentMenu);
			}
		}
		Map<String,Object> menuTree = new HashMap<String, Object>();
		menuTree.put("id", 0);
		menuTree.put("item", parentMenuList);
		menuTree.put("urlMap", urlMap);
		return menuTree;
	}

	@Override
	public Map<String, Object> getUserMenuTree(String userId) {
		List<Map<String,Object>> menulist = menuManagerDaoImpl.getUserMenu(userId);

		List<Map<String,Object>> parentMenuList = new ArrayList<Map<String,Object>>();
		Map<String,String> urlMap = new HashMap<String,String>();
		for(Map<String,Object> menu : menulist){
			String parentId = menu.get("parent_id").toString();
			if(menu.get("action_url") != null && StringUtils.isNotEmpty(menu.get("action_url").toString())){
				urlMap.put(menu.get("action_url").toString(), "1");
			}
			if("0".equals(parentId)){
				Map<String,Object> parentMenu = getTreeMap(menu);

				buildMenuTree(parentMenu, menulist);
				parentMenuList.add(parentMenu);
			}
		}
		Map<String,Object> menuTree = new HashMap<String, Object>();
		menuTree.put("id", 0);
		menuTree.put("item", parentMenuList);
		menuTree.put("urlMap", urlMap);
		return menuTree;	}

	@Transactional
	public boolean addMenu(Menu menu) {
		// TODO Auto-generated method stub
		return menuManagerDaoImpl.addMenu(menu);
	}
	@Transactional
	public boolean editMenu(Menu menu) {
		// TODO Auto-generated method stub
		return menuManagerDaoImpl.editMenu(menu);
	}
	@Transactional
	public boolean deleteMenu(String menuIds) {
		// TODO Auto-generated method stub
		String [] ids = menuIds.split(",");
		boolean result = false;
		result = menuManagerDaoImpl.deleteUserMenu(ids);
		result = menuManagerDaoImpl.deleteRoleMenu(ids);
		result = menuManagerDaoImpl.deleteMenu(ids);
		return result;
	}
	@Transactional
	@Override
	public List<Map<String, Object>> getAllMenus() {
		// TODO Auto-generated method stub
		return menuManagerDaoImpl.getAllMenu("1");
	}
}

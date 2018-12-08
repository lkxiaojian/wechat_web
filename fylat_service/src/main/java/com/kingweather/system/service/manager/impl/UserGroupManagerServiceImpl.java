package com.kingweather.system.service.manager.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import com.kingweather.system.manager.domain.User;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import com.kingweather.common.util.Page;
import com.kingweather.system.dao.manager.UserGroupManagerDao;
import com.kingweather.system.manager.domain.UserGroup;
import com.kingweather.system.service.manager.MenuManagerService;
import com.kingweather.system.service.manager.UserGroupManagerService;
import org.springframework.transaction.annotation.Transactional;


/**
 * 用户组管理
 */
@Service
public class UserGroupManagerServiceImpl implements UserGroupManagerService
{

    @Resource
    private UserGroupManagerDao userGroupManagerDaoImpl;
    
    @Resource
    private MenuManagerService menuManagerServiceImpl;

	@Override
	@Transactional
	public Map<String, Object> getAllUserGroup(Object... object) {
		// TODO Auto-generated method stub
		HttpServletRequest request = (HttpServletRequest)object[0];

        String startNum = request.getParameter("pageNumber");
        String pageSizestr = request.getParameter("pageSize");
        int pageNo = 1;
        if (StringUtils.isNotEmpty(startNum)) {
          pageNo = Integer.parseInt(startNum);
        }
        int pageSize = 10;
        if (StringUtils.isNotEmpty(pageSizestr)) {
          pageSize = Integer.parseInt(pageSizestr);
        }
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		map.put("code", 0);
		Page<Map<String, Object>> page = userGroupManagerDaoImpl.getAllUserGroup(pageNo, pageSize);
		map.put("message", "查询成功");
		map.put("total", page.getTotalCount());
		map.put("result", page.getResult());
		return map;
	}

	@Override
	@Transactional
	public Map<String, Object> getAllUserGroup(Map<String, Object> conditions) {

		Map<String, Object> map = new LinkedHashMap<String, Object>();
		map.put("code", 0);
		Page<Map<String, Object>> page = userGroupManagerDaoImpl.getAllUserGroup(conditions);
		map.put("message", "查询成功");
		map.put("total", page.getTotalCount());
		map.put("result", page.getResult());
		return map;
	}

	@Override
	@Transactional
	public Map<String, Object> getMenuTreeByGroupCode(String groupCode) {
		// TODO Auto-generated method stub
		List<Map<String,Object>> menulist = userGroupManagerDaoImpl.getMenuByGroupCode(groupCode);
		
		List<Map<String,Object>> parentMenuList = new ArrayList<Map<String,Object>>();
		for(Map<String,Object> menu : menulist){
			String parentId = menu.get("parent_id").toString();
			if("0".equals(parentId)){
				Map<String,Object> parentMenu = menuManagerServiceImpl.getTreeMap(menu);
				
				menuManagerServiceImpl.buildMenuTree(parentMenu, menulist);
				parentMenuList.add(parentMenu);
			}
		}
		Map<String,Object> menuTree = new HashMap<String, Object>();
		menuTree.put("id", 0);
		menuTree.put("item", parentMenuList);
		return menuTree;
	}
	
	public Map<String, Object> getMenuIdsByGroupCode(String groupCode) {
		// TODO Auto-generated method stub
		Map<String, Object> map = new LinkedHashMap<String, Object>();		
		map.put("code", 0);
		map.put("message", "查询成功");
		map.put("result", userGroupManagerDaoImpl.getMenuIdsByGroupCode(groupCode));
		return map;
	}

	@Override
	@Transactional
	public boolean addUserGroup(UserGroup group, User user) {
		// TODO Auto-generated method stub
		return userGroupManagerDaoImpl.addUserGroup(group, user);
	}

	@Override
	@Transactional
	public boolean addUserMenu(String groupCode, String menuIdsStr) {
		// TODO Auto-generated method stub
		String [] ids = menuIdsStr.split(",");
		boolean result = userGroupManagerDaoImpl.delRoleMenuForAdminUser(groupCode, ids);
		result = userGroupManagerDaoImpl.delUserMenuForAdminUser(groupCode, ids);
		
		result = userGroupManagerDaoImpl.delUserMenuByGidAndMids(groupCode, ids);
		result = userGroupManagerDaoImpl.delRoleMenuByGidAndMids(groupCode, ids);
		result = userGroupManagerDaoImpl.addUserMenu(groupCode, ids);
		return result;
	}

	@Override
	@Transactional
	public boolean editUserGroup(UserGroup group) {
		// TODO Auto-generated method stub
		return userGroupManagerDaoImpl.editUserGroup(group);
	}

	@Override
	@Transactional
	public boolean deleteUserGroup(String groupCode) {
		// TODO Auto-generated method stub
		return userGroupManagerDaoImpl.deleteUserGroup(groupCode);
	}	
	
	
}



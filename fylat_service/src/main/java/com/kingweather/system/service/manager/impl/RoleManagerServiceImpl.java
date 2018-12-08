package com.kingweather.system.service.manager.impl;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import com.kingweather.common.util.Page;
import com.kingweather.system.dao.manager.RoleManagerDao;
import com.kingweather.system.manager.domain.Role;
import com.kingweather.system.service.manager.RoleManagerService;
import com.kingweather.system.service.manager.UserManagerService;


/**
 * 角色管理
 */
@Service
public class RoleManagerServiceImpl implements RoleManagerService
{

	@Resource
    private RoleManagerDao roleManagerDaoImpl;
	
	@Resource
	private UserManagerService userManagerServiceImpl;
	
	public Map<String, Object> getAllRole(Object... object) {
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
        
        String userId = (String)object[1];
        Map<String,Object> conditions = new HashMap<String, Object>();
        conditions.put("status", request.getParameter("status"));
        conditions.put("userId", userId);
        conditions.put("roleName", request.getParameter("roleName"));
        
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		map.put("code", 0);
		Page<Map<String, Object>> page = roleManagerDaoImpl.getAllRole(pageNo, pageSize,conditions);
		map.put("message", "查询成功");
		map.put("total", page.getTotalCount());
		map.put("result", page.getResult());
		return map;
	}
	
	public boolean addRole(Role role) {
		role.setStatus(1);
		boolean result = roleManagerDaoImpl.addRole(role);
		return result;
	}
	
	public boolean addRoleMenu(String roleId, String menuIds) {
		// TODO Auto-generated method stub
		String [] menuIdArr = menuIds.split(",");
		boolean result = roleManagerDaoImpl.deleteUMByRoleIdAndMenuIds(roleId, menuIdArr);
		result = roleManagerDaoImpl.addRoleMenu(roleId, menuIdArr);			
		return result;
	}
	
	public boolean delSubRUMCanceledMids(String parentId,String roleId){
		boolean result = true;
		List<Map<String,Object>> users = roleManagerDaoImpl.getParentUserByRoleId(parentId, roleId);
		for(Map<String,Object> user : users){
			String userId = user.get("user_id").toString();
			
			List<String> midlist =  userManagerServiceImpl
					.getCanceledMidsByUserId(userId,null);
			String [] canceledMid = midlist.toArray(new String[midlist.size()]);
			
			result = roleManagerDaoImpl.delSubRMCanceledMids(roleId, canceledMid);
			result = roleManagerDaoImpl.delSubUMCanceledMids(roleId, canceledMid);	
		}
		return result;
	}

    public boolean updateStatus(String roleId,int status){
    	return roleManagerDaoImpl.updateStatus(roleId, status);
    }
    
	public boolean editRole(Role role) {
		// TODO Auto-generated method stub
		boolean result = roleManagerDaoImpl.editRole(role);
		return result;
	}

	public boolean deleteRole(String roleId) {
		// TODO Auto-generated method stub
		String [] roleIds = roleId.split(",");	
		
		boolean result = false;
		result = roleManagerDaoImpl.deleteUserRole(roleIds);
		result = roleManagerDaoImpl.deleteRoleMenu(roleIds);
		result = roleManagerDaoImpl.deleteRole(roleIds);		
		return result;
	}	
	
	public Map<String, Object> getMenuByRoleId(String roleId) {
		// TODO Auto-generated method stub
		Map<String, Object> map = new LinkedHashMap<String, Object>();		
		map.put("code", 0);
		map.put("message", "查询成功");
		map.put("result", roleManagerDaoImpl.getMenuByRoleId(roleId));
		return map;
	}
}



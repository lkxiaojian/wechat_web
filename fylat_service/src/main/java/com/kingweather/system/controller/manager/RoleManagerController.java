package com.kingweather.system.controller.manager;

import com.kingweather.common.controller.BaseController;
import com.kingweather.system.manager.domain.Role;
import com.kingweather.system.manager.domain.User;
import com.kingweather.system.service.manager.RoleManagerService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.LinkedHashMap;
import java.util.Map;


/**
 * 角色管理
 */
@Controller
public class RoleManagerController extends BaseController
{
    @Resource
    private RoleManagerService roleManagerServiceImpl;

    /**
	 * 新增角色
	 */
    @ResponseBody
	@RequestMapping(value="/role/manager",params="view=add",method= RequestMethod.POST)
	public  Map<String, Object> create(@RequestBody Role role){
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		String view = request.getParameter("view");
		boolean fag = false;
		if(!"add".equals(view)){
			map.put("code", 1);
			map.put("message", "新增失败,请正确访问接口");
			map.put("result", null);
		}else{
			User user = (User)session.getAttribute("user");
			role.setUserId(user.getUserId());
			fag = roleManagerServiceImpl.addRole(role);
		}
		map.put("success", fag);
		return map;
	}
	
	/**
	 * 查询角色列表
	 */
    @ResponseBody
	@RequestMapping(value="/role/manager",params="view=select",method= RequestMethod.GET)
	public  Map<String, Object> select(){
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		String view = request.getParameter("view");
		
		if(!"select".equals(view)){
			map.put("code", 1);
			map.put("message", "查询失败,请正确访问接口");
			map.put("result", null);
		}else{
			User user = (User)session.getAttribute("user");
			map = roleManagerServiceImpl.getAllRole(request,user.getUserId());
		}
		return map;
	}
	
	/**
	 * 刪除角色
	 */
    @ResponseBody
	@RequestMapping(value="/role/manager",params="view=delete",method= RequestMethod.GET)
	public  Map<String, Object> deleteUser(String roleId){
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		String view = request.getParameter("view");
		boolean fag = false;
		if(!"delete".equals(view)){
			map.put("code", 1);
			map.put("message", "删除失败,请正确访问接口");
			map.put("result", null);
		}else{
			User user = (User)session.getAttribute("user");
			fag = roleManagerServiceImpl.deleteRole(roleId);
			for(String id : roleId.split(",")){			
				fag = roleManagerServiceImpl.delSubRUMCanceledMids(user.getUserId(), id);
			}
		}
		map.put("success", fag);
		return map;
	}
	
	
	/**
	 * 修改角色
	 */
    @ResponseBody
	@RequestMapping(value="/role/manager",params="view=update",method= RequestMethod.POST)
	public  Map<String, Object> update(@RequestBody Role role){
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		String view = request.getParameter("view");
		boolean fag = false;
		if(!"update".equals(view)){
			map.put("code", 1);
			map.put("message", "更新失败,请正确访问接口");
			map.put("result", null);
		}else{
			fag = roleManagerServiceImpl.editRole(role);
		}
		map.put("success", fag);
		return map;
	}
    
    /**
	 * 更新状态
	 */
    @ResponseBody
	@RequestMapping(value="/role/manager",params="view=updateStatus",method= RequestMethod.GET)
	public  Map<String, Object> update(String roleId,int status){
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		String view = request.getParameter("view");
		boolean fag = false;
		if(!"updateStatus".equals(view)){
			map.put("code", 1);
			map.put("message", "更新失败,请正确访问接口");
			map.put("result", null);
		}else{
			fag = roleManagerServiceImpl.updateStatus(roleId, status);
		}
		map.put("success", fag);
		return map;
	}
	
    /**
  	 * 角色授权
  	 */
    @ResponseBody
  	@RequestMapping(value="/role/manager",params="view=addMenu",method= RequestMethod.POST)
  	public  Map<String, Object> addMenu(String roleId,String menuIds){
  		Map<String, Object> map = new LinkedHashMap<String, Object>();
  		String view = request.getParameter("view");
  		boolean fag = false;
  		if(!"addMenu".equals(view)){
  			map.put("code", 1);
  			map.put("message", "角色授权失败,请正确访问接口");
  			map.put("result", null);
  		}else{
  			User user = (User)session.getAttribute("user");
  			fag = roleManagerServiceImpl.addRoleMenu(roleId, menuIds);
  			fag = roleManagerServiceImpl.delSubRUMCanceledMids(user.getUserId(), roleId);
  		}
  		map.put("success", fag);
  		return map;
  	}
      
    /**
 	 * 查询指定角色功能授权列表
 	 */
    @ResponseBody
 	@RequestMapping(value="/role/manager",params="view=selectMenu",method= RequestMethod.GET)
 	public  Map<String, Object> selectRoleMenu(String roleId){
 		Map<String, Object> map = new LinkedHashMap<String, Object>();
 		String view = request.getParameter("view");
 		
 		if(!"selectMenu".equals(view)){
 			map.put("code", 1);
 			map.put("message", "查询失败,请正确访问接口");
 			map.put("result", null);
 		}else{
 			map = roleManagerServiceImpl.getMenuByRoleId(roleId);
 		}
 		return map;
 	}
}
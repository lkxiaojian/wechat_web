package com.kingweather.system.controller.manager;

import com.kingweather.common.controller.BaseController;
import com.kingweather.common.util.Md5Utils;
import com.kingweather.system.manager.domain.User;
import com.kingweather.system.manager.domain.UserGroup;
import com.kingweather.system.manager.domain.UserState;
import com.kingweather.system.service.manager.UserGroupManagerService;
import com.kingweather.system.service.manager.UserManagerService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;


/**
 * 用户组管理
 */
@Controller
public class UserGroupManagerController extends BaseController
{
    @Resource
    private UserGroupManagerService userGroupManagerServiceImpl;

	@Resource
	private UserManagerService userManagerServiceImpl;

	/**
	 *新增公司
     */
	@ResponseBody
	@RequestMapping(value = "/group/manager", params = "view=add", method = RequestMethod.POST)
	public Map<String, Object> createUserGroup(@RequestBody Map<String, Object> obj) {
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		String view = request.getParameter("view");
		boolean flag = false;
		UserGroup group = new UserGroup();
		group.setGroupName(obj.get("groupName").toString());
		if (null != obj.get("note")) {
			group.setNote(obj.get("note").toString());
		}

        User user = new User();
        user.setUserName("admin@" + obj.get("admin").toString());
        user.setPassword(Md5Utils.encode2hex(obj.get("password").toString()));
        user.setEmail(obj.get("groupEmail").toString());
        user.setStatus(UserState.NORMAL.getCode());
        user.setParentId("1");
        user.setIs_worker("worker");
		if (!"add".equals(view)) {
			map.put("code", 1);
			map.put("message", "新增失败，请正确访问接口");
			map.put("result", null);
		}else {
			flag = userGroupManagerServiceImpl.addUserGroup(group, user);
		}
		map.put("success", flag);
		return map;
	}

	/**
	 * 更新公司
	 */
	@ResponseBody
	@RequestMapping(value = "/group/manager", params = "view=update", method = RequestMethod.POST)
	public Map<String, Object> updateUserGroup(@RequestBody Map obj) {
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		String view =request.getParameter("view");
		boolean flag = false;
		UserGroup group = new UserGroup();
		group.setGroupId(obj.get("groupId").toString());
		group.setNote(obj.get("note").toString());
		group.setGroupName(obj.get("groupName").toString());
		group.setGroupCode(obj.get("groupId").toString());
//		User user = new User();
//		user.setUserType(obj.get("groupId").toString());
//		user.setUserName(obj.get("groupEmail").toString());
//        user.setPassword(obj.get("groupPassword").toString());
		if (!"update".equals(view)) {
			map.put("code", 1);
			map.put("message", "更新失败，请正确访问接口");
			map.put("result", null);
		}else{
			flag = userGroupManagerServiceImpl.editUserGroup(group);
//			flag= userManagerServiceImpl.editUser(user);
		}
		map.put("success", flag);
		return map;
	}

	/**
	 * 删除公司
	 */
	@ResponseBody
	@RequestMapping(value = "/group/manager", params = "view=delete", method = RequestMethod.POST)
	public Map<String, Object> deleteUserGroup(@RequestBody Map obj) {
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		String view = request.getParameter("view");
		String groupId = obj.get("groupId").toString();
		boolean flag = false;
		if (!"delete".equals(view)) {
			map.put("code", 1);
			map.put("message", "删除失败，请正确访问接口");
			map.put("result", null);
		}else{
			flag = userGroupManagerServiceImpl.deleteUserGroup(groupId);
			flag = userManagerServiceImpl.deleteUserByType(groupId);
		}
		map.put("success", flag);
		return map;
	}

    /**
	 * 查询组列表
	 */
    @ResponseBody
	@RequestMapping(value="/group/query",params="view=select",method= RequestMethod.GET)
	public  Map<String, Object> select(){
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		String view = request.getParameter("view");

		if(!"select".equals(view)){
			map.put("code", 1);
			map.put("message", "查询失败,请正确访问接口");
			map.put("result", null);
		}else{
			int startNum = Integer.parseInt(request.getParameter("pageNumber"));
			int pageSize = Integer.parseInt(request.getParameter("pageSize"));
            String gName = request.getParameter("gName");

            Map<String, Object> conditions = new HashMap<String, Object>();
            conditions.put("startNum", startNum);
            conditions.put("pageSize", pageSize);
			if(gName == null || "".equals(gName)) {
                map = userGroupManagerServiceImpl.getAllUserGroup(request);
            }else{
                conditions.put("gName", gName);
                map = userGroupManagerServiceImpl.getAllUserGroup(conditions);
            }
		}
		return map;
	}
	
	/**
	 * 查询菜单树
	 */
    @ResponseBody
	@RequestMapping(value="/group/manager",params="view=selectMenu",method= RequestMethod.GET)
	public  Map<String, Object> selectMenu(String groupCode){
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		String view = request.getParameter("view");
		
		if(!"selectMenu".equals(view)){
			map.put("code", 1);
			map.put("message", "查询失败,请正确访问接口");
			map.put("result", null);
		}else{
			map.put("code", 0);
			map.put("message", "查询成功!");
			map.put("result", userGroupManagerServiceImpl.getMenuTreeByGroupCode(groupCode));
		}
		return map;
	}
	
    /**
   	 * 查询当前用户组已经授权的功能Ids
   	 */
    @ResponseBody
   	@RequestMapping(value="/group/manager",params="view=selectMenuIds",method= RequestMethod.GET)
   	public  Map<String, Object> selectGroupMenuIds(String groupCode){
   		Map<String, Object> map = new LinkedHashMap<String, Object>();
   		String view = request.getParameter("view");
   		
   		if(!"selectMenuIds".equals(view)){
   			map.put("code", 1);
   			map.put("message", "查询失败,请正确访问接口");
   			map.put("result", null);
   		}else{
   			map = userGroupManagerServiceImpl.getMenuIdsByGroupCode(groupCode);
   		}
   		return map;
   	}
    
    /**
  	 * 组授权
  	 */
    @ResponseBody
  	@RequestMapping(value="/group/manager",params="view=addMenu",method= RequestMethod.POST)
//  	public  Map<String, Object> addMenu(String groupCode,String menuIds){
	public  Map<String, Object> addMenu(@RequestBody Map obj){
  		Map<String, Object> map = new LinkedHashMap<String, Object>();
  		String view = request.getParameter("view");
  		String groupCode = obj.get("groupCode").toString();
  		String menuIds = obj.get("menuIds").toString();
  		boolean fag = false;
  		if(!"addMenu".equals(view)){
  			map.put("code", 1);
  			map.put("message", "角色授权失败,请正确访问接口");
  			map.put("result", null);
  		}else{
  			fag = userGroupManagerServiceImpl.addUserMenu(groupCode, menuIds);
  		}
  		map.put("success", fag);
  		return map;
  	}
}
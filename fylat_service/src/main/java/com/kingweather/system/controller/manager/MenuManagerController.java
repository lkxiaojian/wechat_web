package com.kingweather.system.controller.manager;

import com.kingweather.common.controller.BaseController;
import com.kingweather.system.manager.domain.Menu;
import com.kingweather.system.service.manager.MenuManagerService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.LinkedHashMap;
import java.util.Map;


/**
 * 菜单管理
 */
@Controller
public class MenuManagerController extends BaseController
{
    @Resource
    private MenuManagerService menuManagerServiceImpl;

    /**
	 * 新增菜单
	 */
    @ResponseBody
	@RequestMapping(value="/menu/manager",params="view=add",method= RequestMethod.POST)
	public  Map<String, Object> create(@RequestBody Menu menu){
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		String view = request.getParameter("view");
		boolean fag = false;
		if(!"add".equals(view)){
			map.put("code", 1);
			map.put("message", "新增失败,请正确访问接口");
			map.put("result", null);
		}else{
			fag = menuManagerServiceImpl.addMenu(menu);
		}
		map.put("success", fag);
		return map;
	}
	
	/**
	 * 查询菜单树
	 */
    @ResponseBody
	@RequestMapping(value="/menu/manager",params="view=select",method= RequestMethod.GET)
	public  Map<String, Object> select(){
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		String view = request.getParameter("view");
		
		if(!"select".equals(view)){
			map.put("code", 1);
			map.put("message", "查询失败,请正确访问接口");
			map.put("result", null);
		}else{
			map.put("code", 0);
			map.put("message", "查询成功!");
			map.put("result", menuManagerServiceImpl.getAllMenuTree(null));
		}
		return map;
	}
	
	/**
	 * 删除菜单
	 */
    @ResponseBody
	@RequestMapping(value="/menu/manager",params="view=delete",method= RequestMethod.GET)
	public  Map<String, Object> deleteUser(String menuIds){
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		String view = request.getParameter("view");
		boolean fag = false;
		if(!"delete".equals(view)){
			map.put("code", 1);
			map.put("message", "删除失败,请正确访问接口");
			map.put("result", null);
		}else{
			fag = menuManagerServiceImpl.deleteMenu(menuIds);
		}
		map.put("success", fag);
		return map;
	}
	
	
	/**
	 * 修改菜单
	 */
    @ResponseBody
	@RequestMapping(value="/menu/manager",params="view=update",method= RequestMethod.POST)
	public  Map<String, Object> update(@RequestBody Menu menu){
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		String view = request.getParameter("view");
		boolean fag = false;
		if(!"update".equals(view)){
			map.put("code", 1);
			map.put("message", "更新失败,请正确访问接口");
			map.put("result", null);
		}else{
			fag = menuManagerServiceImpl.editMenu(menu);
		}
		map.put("success", fag);
		return map;
	}
}
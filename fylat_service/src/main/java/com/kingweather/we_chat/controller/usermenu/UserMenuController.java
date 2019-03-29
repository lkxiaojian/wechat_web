package com.kingweather.we_chat.controller.usermenu;

import com.kingweather.we_chat.service.UserMenuService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Description: fylat_service
 * Created by s on 2019/1/29 9:43
 */

@RestController
@RequestMapping("/userMenu")
public class UserMenuController {

    @Resource
    private UserMenuService userMenuServiceIml;


    @RequestMapping(value = "/getMenuTree/rest", method = {RequestMethod.POST, RequestMethod.GET})
    public Object getMenuTree() {

        Map map = new HashMap();
        try {
            List list = userMenuServiceIml.getMenuTree();
//            map.put("code", 0);
//            map.put("message", "查询成功");
//            map.put("data", list);
//            return map;

            map.put("id", 0);
            List<Map> listResult = new ArrayList<>();
            listResult.add(0, map);
            map.put("item", list);
            Object o = listResult.get(0);
            return o;
        } catch (Exception e) {
            map.put("code", 2);
            map.put("message", "系统异常，请联系管理员！");
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/getUserMenu/rest", method = {RequestMethod.POST, RequestMethod.GET})
    public Map getUserMenuTree(HttpServletRequest request,@RequestParam String userId) {

        Map map = new HashMap();
        try {
            List list = userMenuServiceIml.getUserMenuTree(request,userId);
            map.put("code", 0);
            map.put("message", "查询成功");
            map.put("data", list);
            return map;
        } catch (Exception e) {
            map.put("code", 2);
            map.put("message", "系统异常，请联系管理员！");
            e.printStackTrace();
            return map;
        }
    }

    @RequestMapping(value = "/addUserReMenu/rest", method = {RequestMethod.POST, RequestMethod.GET})
    public Map addUserReMenu(@RequestParam List<String> list) {

        Map map = new HashMap();
        try {
            int i = userMenuServiceIml.addUserReMenu(list);
            if(i>0){
                map.put("code", 0);
                map.put("message", "添加成功！");
            }else{
                map.put("code", 0);
                map.put("message", "添加失败！");
            }
            return map;
        } catch (Exception e) {
            map.put("code", 2);
            map.put("message", "系统异常，请联系管理员！");
            e.printStackTrace();
            return map;
        }
    }

    @RequestMapping(value = "/removeUserReMenu/rest", method = {RequestMethod.POST, RequestMethod.GET})
    public Map removeUserReMenu(@RequestParam List<String> list) {

        Map map = new HashMap();
        try {
            int i = userMenuServiceIml.removeUserReMenu(list);
            if(i>0){
                map.put("code", 0);
                map.put("message", "删除成功！");
            }else{
                map.put("code", 0);
                map.put("message", "删除失败！");
            }
            return map;
        } catch (Exception e) {
            map.put("code", 2);
            map.put("message", "系统异常，请联系管理员！");
            e.printStackTrace();
            return map;
        }
    }
}

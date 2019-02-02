package com.kingweather.we_chat.controller.websysuser;

import com.kingweather.we_chat.service.WebSysUserService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/webSysUser")
public class WebSysUserController {

    @Resource
    private WebSysUserService webSysUserServiceIml;

    @RequestMapping(value = "/addUser/rest", method = {RequestMethod.POST,RequestMethod.GET})
    public Map addUser(@RequestParam Map<String, Object> info){
        Map map = new HashMap();
        try {
            map.put("code", 2);
            map.put("message", "系统异常，请联系管理员！");
            int i = webSysUserServiceIml.addUser(info);

            if(i>0){
                map.put("code", 0);
                map.put("message", "添加用户成功！");
            }
            return map;
        } catch (Exception e) {
            e.printStackTrace();
            return map;
        }
    }


    @RequestMapping(value = "/removeUser/rest", method = {RequestMethod.POST,RequestMethod.GET})
    public Map removeUser(@RequestParam List<String> list){
        Map map = new HashMap();
        try {
            map.put("code", 2);
            map.put("message", "系统异常，请联系管理员！");


            int i = webSysUserServiceIml.removeUser(list);
            if(i>0){
                map.put("code", 0);
                map.put("message", "删除用户成功！");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return map;
    }


    @RequestMapping(value = "/updUser/rest", method = {RequestMethod.POST,RequestMethod.GET})
    public Map updUser(@RequestParam Map<String, Object> info){
        Map map = new HashMap();
        try {
            map.put("code", 2);
            map.put("message", "系统异常，请联系管理员！");

            int i = webSysUserServiceIml.updUser(info);

            if(i>0){
                map.put("code", 0);
                map.put("message", "修改用户成功！");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return map;
    }


    @RequestMapping(value = "/selUser/rest", method = {RequestMethod.POST,RequestMethod.GET})
    public Map selUser(@RequestParam Map<String, Object> info){
        Map map = new HashMap();
        try {
            map.put("code", 2);
            map.put("message", "系统异常，请联系管理员！");

            List list  = webSysUserServiceIml.selUser(info);

            map.put("code", 0);
            map.put("message", "查询用户成功！");
            map.put("data",list);

        } catch (Exception e) {
            e.printStackTrace();
        }

        return map;
    }

    @RequestMapping(value = "/verifyLogin/rest", method = {RequestMethod.POST,RequestMethod.GET})
    public Map verifyLogin(@RequestParam String name,@RequestParam String pass){
        Map map = new HashMap();
        try {
            map.put("code", 2);
            map.put("message", "系统异常，请联系管理员！");

            int i = webSysUserServiceIml.verifyLogin(name,pass);

            if(i>0){
                map.put("code", 0);
                map.put("message", "校验登录成功！");
                map.put("verify",true);
            }else {
                map.put("code", 0);
                map.put("message", "账号或密码错误！");
                map.put("verify",false);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return map;
    }

    @RequestMapping(value = "/verifyName/rest", method = {RequestMethod.POST,RequestMethod.GET})
    public Map verifyName(@RequestParam String name){
        Map map = new HashMap();
        try {
            map.put("code", 2);
            map.put("message", "系统异常，请联系管理员！");

            int i  = webSysUserServiceIml.verifyName(name);
            if(i<1){
                map.put("code", 0);
                map.put("message", "校验用户名称可用！");
                map.put("verify",true);
            }else {
                map.put("code", 0);
                map.put("message", "校验用户名称重复！");
                map.put("verify",false);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return map;
    }

}

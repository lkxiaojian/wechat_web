package com.kingweather.we_chat.controller.usermenu;

import com.kingweather.we_chat.service.UserMenuService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
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
    public Map getMenuTree() {

        Map map = new HashMap();
        try {
            List list = userMenuServiceIml.getMenuTree();
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
}

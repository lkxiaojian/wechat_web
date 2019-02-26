package com.kingweather.we_chat.controller.releases;

import com.kingweather.common.controller.BaseController;
import com.kingweather.we_chat.service.ReleaseManagementService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/releaseManagement")
public class ReleaseManagementController extends BaseController {
    @Resource
    private ReleaseManagementService releaseManagementService;

    @RequestMapping(value = "/getTypeMenuTree/rest")
    public Map getTypeMenuTree() {

        Map map = new HashMap();
        try {
            List list = releaseManagementService.getTypeMenuTree();
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



    @RequestMapping(value = "/getTypeMessage/rest")
    public Map getTypeMessage(String article_type_id) {

        Map map = new HashMap();
        try {
            Map list = releaseManagementService.getTypeMessage(article_type_id);
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

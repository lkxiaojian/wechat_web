package com.kingweather.we_chat.controller.statistics;

import com.kingweather.we_chat.service.StatisticsService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;

/**
 * Description: wechat_web
 * Created by s on 2019/1/22 14:16
 */
@RestController
@RequestMapping("/statistics")
public class StatisticsController {

    @Resource
    private StatisticsService statisticsService;


    @RequestMapping(value = "/insertStatisticsInfo/rest", method = {RequestMethod.POST,RequestMethod.GET})
    public Map<String, Object> insertStatisticsInfo(@RequestParam Map<String, Object> info) {

        Map map = new HashMap();
        map.put("code", 2);
        map.put("message", "系统异常，请联系管理员！");
        try {
         int i  = statisticsService.insertStatisticsInfo(info);
            if (i>0){
                map.put("code", 0);
                map.put("message", "记录成功！");
            }
            return map;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return map;
    }


}

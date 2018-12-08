package com.kingweather.fylat_service.controller.other;

import com.kingweather.common.controller.BaseController;
import com.kingweather.fylat_service.service.other.DataManageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 数据管理-控制器
 * Created by handongchen on 2017/10/16.
 */
@RestController
public class DataManageController extends BaseController {
    Logger log = LoggerFactory.getLogger(DataManageController.class);
    @Autowired
    private DataManageService dataManageService;

    @GetMapping(value = "/getDataManageList" ,params="view=select")
    public Map<String, Object> getDataManageList() {
        log.info("根据查询条件获取数据管理模块的数据");
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        map.put("code", 0);
        map.put("message", "成功");
        System.out.println("req:" + request);
        //map.put("result", dataManageService.getDataManageList());
        //map.put("req",request);
        return map;
    }

}

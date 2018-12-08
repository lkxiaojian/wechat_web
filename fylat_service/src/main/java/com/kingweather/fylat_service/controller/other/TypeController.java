package com.kingweather.fylat_service.controller.other;

import com.kingweather.fylat_service.service.other.TypeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Created by handongchen on 2017/10/16.
 */
@RestController
public class TypeController {
    Logger log = LoggerFactory.getLogger(TypeController.class);
    @Autowired
    private TypeService typeService;

    @GetMapping(value = "/getTypeList")
    public Map<String, Object> getTypeList() {
        log.info("获取所有类型");
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        map.put("code", 0);
        map.put("message", "成功");
        map.put("result", typeService.getAllTypeList());
        return map;
    }

}

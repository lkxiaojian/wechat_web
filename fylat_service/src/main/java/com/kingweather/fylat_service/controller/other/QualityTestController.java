package com.kingweather.fylat_service.controller.other;

import com.kingweather.common.controller.BaseController;
import com.kingweather.fylat_service.service.other.QualityTestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.text.ParseException;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Created by handongchen on 2017/10/20.
 */
@RestController
public class QualityTestController extends BaseController{

    Logger log = LoggerFactory.getLogger(QualityTestController.class);
    @Resource
    private QualityTestService qualityTestService;

    /**
     * 获取单个目视检测数据
     *
     * @return
     */
    @GetMapping("/getSingleQualityTestData")
    public Map<String, Object> getImgForCondition() throws ParseException {
        log.info("访问--获取单个目视检测数据");
        //返回结果
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        //参数
        log.info("检索条件-----");
        log.info("condition：" + request.getParameterMap());
        try {
            map.put("code", 0);
            map.put("message", "成功");
           qualityTestService.getAllQualityList(request.getParameterMap());
           map.put("result","");
        } catch (Exception e) {
            e.printStackTrace();
            map.put("code", 0);
            map.put("message", "失败");
            map.put("result", null);
        }
        return map;
    }
}

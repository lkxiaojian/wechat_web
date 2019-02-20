package com.kingweather.we_chat.controller.bwList;

import com.kingweather.common.controller.BaseController;
import com.kingweather.fylat_service.controller.other.DataManageController;
import com.kingweather.we_chat.service.BWListService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.Map;

/**
 * 黑白名单 和分数管理controller
 */

@RestController
public class BWListController extends BaseController {
    Logger log = LoggerFactory.getLogger(DataManageController.class);
    @Resource
    private BWListService bwListService;


    /**
     * 分数参数设置
     * @return
     */

    @RequestMapping(value = "/scores/setting/rest", method = RequestMethod.POST)
    public Map<String, Object> scoresSetting(@RequestBody Map<String, Object> data) {
        log.info("分数参数设置");
        return bwListService.scoresSetting(data);
    }


    /**
     * 获取分数参数
     * @return
     */

    @RequestMapping(value = "/scores/GetSettingMessage/rest", method = RequestMethod.GET)
    public Map<String, Object> GetSettingMessage() {
        log.info("分数参数设置");
        return bwListService.GetSettingMessage();
    }






}

package com.kingweather.we_chat.controller.bwList;

import com.kingweather.common.controller.BaseController;
import com.kingweather.fylat_service.controller.other.DataManageController;
import com.kingweather.we_chat.service.BWListService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

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

    @RequestMapping(value = "/scores/setting", method = RequestMethod.POST)
    public Map<String, Object> scoresSetting(@RequestBody Map<String, Object> data) {
        log.info("分数参数设置");
        return bwListService.scoresSetting(data);
    }


    /**
     * 获取分数参数
     * @return
     */

    @RequestMapping(value = "/scores/GetSettingMessage", method = RequestMethod.GET)
    public Map<String, Object> GetSettingMessage() {
        log.info("得到分数参数设置");
        return bwListService.GetSettingMessage();
    }


    /**
     * 添加黑白名单类型
     * @return
     */

    @RequestMapping(value = "/bw/addbwKeyName", method = RequestMethod.GET)
    public Map<String, Object> addbwKeyName(String name) {
        log.info("添加黑白名单类型");
        return bwListService.addbwKeyName(name);
    }


    /**
     * 修改黑白名单类型
     * @return
     */

    @RequestMapping(value = "/bw/updatebwKeyName", method = RequestMethod.GET)
    public Map<String, Object> updatebwKeyName(String id,String name) {
        log.info("修改黑白名单类型");
        return bwListService.updatebwKeyName(id,name);
    }




    /**
     * 删除黑白名单类型
     * @return
     */

    @RequestMapping(value = "/bw/delbwKeyName", method = RequestMethod.GET)
    public Map<String, Object> delbwKeyName(String id) {
        log.info("删除黑白名单类型");
        return bwListService.delbwKeyName(id);
    }


    /**
     * 得到黑白名单类型
     * @return
     */

    @RequestMapping(value = "/bw/getbwKeyNameList", method = RequestMethod.GET)
    public Map<String, Object> getbwKeyNameList(String message) {
        log.info("得到黑白名单类型");
        return bwListService.getbwKeyNameList(message);
    }




    /**
     * 添加黑白名单
     * @return
     */

    @RequestMapping(value = "/bw/addBwList", method = RequestMethod.POST)
    public Map<String, Object> addBwList(@RequestBody Map<String, Object> data) {
        log.info("添加黑白名单");
        return bwListService.addBwList(data);
    }

    /**
     * 更新黑白名单
     * @return
     */

    @RequestMapping(value = "/bw/updateBwList", method = RequestMethod.POST)
    public Map<String, Object> updateBwList(@RequestBody Map<String, Object> data) {
        log.info("更新黑白名单");
        return bwListService.updateBwList(data);
    }

    /**
     * 删除黑白名单
     * @return
     */

    @RequestMapping(value = "/bw/delBwList", method = RequestMethod.GET)
    public Map<String, Object> delBwList(String id) {
        log.info("删除黑白名单");
        return bwListService.delBwList(id);
    }



    /**
     * 得到黑白名单
     * @return
     */

    @RequestMapping(value = "/bw/getBwList", method = RequestMethod.POST)
    public Map<String, Object> getBwList(@RequestBody Map<String, Object> data) {
        log.info("得到黑白名单");
        return bwListService.getBwList(data);
    }






}

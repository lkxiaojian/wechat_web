package com.kingweather.fylat_service.controller.integrationManage;

import com.kingweather.common.controller.BaseController;
import com.kingweather.common.util.Page;
import com.kingweather.fylat_service.service.integrationManage.ConfigService;
import com.kingweather.fylat_service.service.integrationManage.IntegrationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.text.ParseException;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Created by handongchen on 2017/10/20.
 */
@RestController
public class IntegrationController extends BaseController {

    Logger log = LoggerFactory.getLogger(IntegrationController.class);
    @Resource
    private IntegrationService integrationService;
    @Resource
    private ConfigService configService;

    /**
     * 新增进程
     *
     * @return
     */
    @PostMapping("integration/add")
    public Map<String, Object> addIntegration(@RequestBody Map<String, Object> dataParam) throws ParseException {
        log.info("----进程管理--新增进程");
        //返回结果
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        //参数
        log.info("数据-----");
        log.info("dataParam：" + dataParam);
        try {
            map.put("code", 0);
            map.put("message", "成功");
            map.put("result", integrationService.addIntegration(dataParam));
        } catch (Exception e) {
            e.printStackTrace();
            map.put("code", 0);
            map.put("message", "失败");
            map.put("result", null);
        }
        return map;
    }
    /**
     * 进入修改界面-（查询记录信息）
     *
     * @return
     */
    @PostMapping("integration/toupdate")
    public Map<String, Object> toUpdateIntegration(@RequestBody Map<String, Object> dataParam) throws ParseException {
        log.info("----进程管理--进入修改界面-（查询记录信息）");
        //返回结果
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        //参数
        log.info("数据-----");
        log.info("dataParam：" + dataParam);
        try {
            map.put("code", 0);
            map.put("message", "成功");
            map.put("result", integrationService.queryIntegrationForId(dataParam));
        } catch (Exception e) {
            e.printStackTrace();
            map.put("code", 0);
            map.put("message", "失败");
            map.put("result", null);
        }
        return map;
    }
    /**
     * 修改进程信息
     *
     * @return
     */
    @PostMapping("integration/update")
    public Map<String, Object> updateIntegration(@RequestBody Map<String, Object> dataParam) throws ParseException {
        log.info("----进程管理--修改进程信息");
        //返回结果
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        //参数
        log.info("数据-----");
        log.info("dataParam：" + dataParam);
        try {
            map.put("code", 0);
            map.put("message", "成功");
            map.put("result", integrationService.updateIntegration(dataParam));
        } catch (Exception e) {
            e.printStackTrace();
            map.put("code", 0);
            map.put("message", "失败");
            map.put("result", null);
        }
        return map;
    }

    /**
     * 获取所有进程
     *
     * @return
     */
    @PostMapping("integration/show")
    public Map<String, Object> showIntegrationPage(@RequestBody Map<String, Object> dataParam) throws ParseException {
        log.info("----进程管理--进程列表");
        //返回结果
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        //参数
        log.info("数据-----");
        log.info("dataParam：" + dataParam);
        try {
            Page<Map<String, Object>> integrationPage = integrationService.queryIntegrationPage(dataParam);
            map.put("code", 0);
            map.put("message", "成功");
            map.put("total", integrationPage.getTotalCount());
            map.put("result", integrationPage.getResult());
        } catch (Exception e) {
            e.printStackTrace();
            map.put("code", 0);
            map.put("message", "失败");
            map.put("result", null);
        }
        return map;
    }
    /**
     * 获取所有进程
     *
     * @return
     */
    @PostMapping("integration/getIntegrationForId")
    public Map<String, Object> getIntegrationForId(@RequestBody Map<String, Object> dataParam) throws ParseException {
        log.info("----进程管理--编辑进程·");
        //返回结果
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        //参数
        log.info("数据-----");
        log.info("dataParam：" + dataParam);
        try {
            Map<String, Object> integrationMap = integrationService.queryIntegrationForId(dataParam);
            map.put("code", 0);
            map.put("message", "成功");
            map.put("result", integrationMap);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("code", 0);
            map.put("message", "失败");
            map.put("result", null);
        }
        return map;
    }
    /**
     * 编译进程
     *
     * @return
     */
    @PostMapping("integration/complie")
    public Map<String, Object> complieIntegration(@RequestBody Map<String, Object> dataParam) throws ParseException {
        log.info("----进程管理--编译进程");
        //返回结果
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        //参数
        log.info("数据-----");
        log.info("dataParam：" + dataParam);
        try {
            String path = integrationService.complieIntegration(dataParam);
            map.put("code", 0);
            map.put("message", "成功");
            map.put("result", path);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("code", 0);
            map.put("message", "失败");
            map.put("result", null);
        }
        return map;
    }
    /**
     * 编译进程
     *
     * @return
     */
    @PostMapping("integration/deleteIntegration")
    public Map<String, Object> deleteIntegration(@RequestBody Map<String, Object> dataParam) throws ParseException {
        log.info("----进程管理--删除进程");
        //返回结果
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        //参数
        log.info("数据-----");
        log.info("dataParam：" + dataParam);
        try {
            String result = integrationService.deleteIntegration(dataParam);
            map.put("code", 0);
            map.put("message", "成功");
            map.put("result", result);
        } catch (Exception e) {
            e.printStackTrace();
            map.put("code", 0);
            map.put("message", "失败");
            map.put("result", null);
        }
        return map;
    }
}

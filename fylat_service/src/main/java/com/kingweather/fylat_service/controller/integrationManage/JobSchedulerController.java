package com.kingweather.fylat_service.controller.integrationManage;

import com.kingweather.common.controller.BaseController;
import com.kingweather.common.util.Page;
import com.kingweather.fylat_service.service.integrationManage.JobSchedulerService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import java.text.ParseException;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 作业流管理controller
 * Created by tian on 2017/12/20.
 */
@Controller
public class JobSchedulerController extends BaseController {
    @Resource
    JobSchedulerService JobSchedulerServiceImpl;

    @Resource
    private SimpMessagingTemplate messagingTemplate;

    /**
     * 用户新增作业流
     *
     * @param obj 作业流名，作业流类型，批处理时间范围，作业类下的进程
     * @return true/false
     */
    @ResponseBody
    @RequestMapping(value = "/job/manager", params = "view=handle", method = RequestMethod.POST)
    public Map<String, Object> addJobScheduler(@RequestBody Map<String, Object> obj) {
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        if (!"handle".equals(request.getParameter("view"))) {
            map.put("code", 1);
            map.put("message", "新增失败，请正确访问接口");
            map.put("result", null);
        } else {
            map.put("code", 0);
            map.put("message", "成功");
            map.put("result",JobSchedulerServiceImpl.addJob(obj));
        }
        return map;
    }

    /**
     * 用户删除作业流
     * @param obj 作业流id
     * @return true/false
     */
    @ResponseBody
    @RequestMapping(value = "/job/manager", params = "view=delete", method = RequestMethod.POST)
    public Map<String, Object> deleteJob(@RequestBody Map<String, Object> obj) {
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        if (!"delete".equals(request.getParameter("view"))) {
            map.put("code", 1);
            map.put("message", "删除失败，请正确访问接口");
            map.put("result", null);
        }else {
            map.put("code", 0);
            map.put("message", "成功");
            map.put("result",JobSchedulerServiceImpl.deleteJob(obj));
        }
        return map;
    }

    /**
     * 新增作业流->选择进程类型->显示类型下所有进程
     * @return map 作业流类型包含的进程
     */
    @ResponseBody
    @PostMapping("job/showProcess")
    public Map<String, Object> selectProcess(@RequestBody Map<String, Object> dataParam) throws ParseException {
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        try {
            Page<Map<String, Object>> jobPage = JobSchedulerServiceImpl.getProcess(dataParam);
            map.put("code", 0);
            map.put("message", "成功");
            map.put("total", jobPage.getTotalCount());
            map.put("result", jobPage.getResult());
        } catch (Exception e) {
            e.printStackTrace();
            map.put("code", 0);
            map.put("message", "失败");
            map.put("result", null);
        }
        return map;
    }

    /**
     * 查看用户已有作业流下的进程信息
     * @param obj userName，jobType
     * @return map 用户作业流下的进程
     */
    @ResponseBody
    @RequestMapping(value = "/job/manager", params = "view=jobProcess", method = RequestMethod.POST)
    public Map<String, Object> showJobProcess(@RequestBody Map<String, Object> obj) {
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        if (!"jobProcess".equals(request.getParameter("view"))) {
            map.put("code", 1);
            map.put("message", "查询失败，请正确访问接口");
            map.put("result", null);
        }else {
            map.put("code", 0);
            map.put("message", "成功");
            map.put("result",JobSchedulerServiceImpl.getJobProcess(obj));
        }
        return map;
    }

    /**
     * 执行当前作业流
     *
     * @param obj userName，jobType
     * @return map 用户名包含的进程信息
     */
    @ResponseBody
    @RequestMapping(value = "/job/manager", params = "view=jobRun", method = RequestMethod.POST)
    public Map<String, Object> jobRun(@RequestBody Map<String, Object> obj) {
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        String topic = obj.get("topic").toString();
        if (!"jobRun".equals(request.getParameter("view"))) {
            map.put("code", 1);
            map.put("message", "查询失败，请正确访问接口");
            map.put("result", null);
        } else {
            map.put("code", 0);
            map.put("message", "成功");
            JobSchedulerServiceImpl.setTopicPath(topic);
//            JobSchedulerServiceImpl.test(topic);
            JobSchedulerServiceImpl.jobRun(obj);
            map.put("result","success");
        }
        return map;
    }

    /**
     * 按检索条件查询作业流
     *
     * @return map 符合条件的作业流
     */
    @ResponseBody
    @PostMapping("job/showJob")
    public Map<String, Object> showJobPage(@RequestBody Map<String, Object> dataParam) throws ParseException {
        //返回结果
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        try {
            Page<Map<String, Object>> jobPage = JobSchedulerServiceImpl.queryJobPage(dataParam);
            map.put("code", 0);
            map.put("message", "成功");
            map.put("total", jobPage.getTotalCount());
            map.put("result", jobPage.getResult());
        } catch (Exception e) {
            e.printStackTrace();
            map.put("code", 0);
            map.put("message", "失败");
            map.put("result", null);
        }
        return map;
    }

    /**
     * 根据文件夹查询文件列表
     *
     * @return map
     */
    @ResponseBody
    @PostMapping("result/getFileList")
    public Map<String, Object> getFileList(@RequestBody Map<String, Object> dataParam) throws ParseException {
        //返回结果
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        try {
            map.put("code", 0);
            map.put("message", "成功");
            map.put("result", JobSchedulerServiceImpl.getFileList(dataParam.get("path").toString()));
        } catch (Exception e) {
            e.printStackTrace();
            map.put("code", 0);
            map.put("message", "失败");
            map.put("result", null);
        }
        return map;
    }
}


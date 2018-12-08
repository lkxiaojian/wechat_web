package com.kingweather.system.controller.manager;

import com.kingweather.common.controller.BaseController;
import com.kingweather.common.util.Page;
import com.kingweather.system.manager.domain.App;
import com.kingweather.system.manager.domain.AppType;
import com.kingweather.system.manager.domain.OperateState;
import com.kingweather.system.manager.domain.User;
import com.kingweather.system.service.manager.AppManagerService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;


/**
 * 应用管理
 */
@Controller
public class AppManagerController extends BaseController{
    @Resource
    private AppManagerService appManagerService;

    /**
     * 修改应用
     *
     * @return 返回结果
     */
   /* @ResponseBody
    @RequestMapping(value = "/app/modify")
    public Map<String, Object> modify(String id,String remark,String appName,String domain)
    {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("result", OperateState.FAIL.getCode());
        User user = (User) session.getAttribute("user");
        if (null != user)
        {
            App app = appManagerService.findById(id);

            App newApp = new App();
            newApp.setName(appName);
            
            Map<String, Object> jsonMap = new HashMap<String, Object>();
            jsonMap.put("remark", remark);
            jsonMap.put("ip", app.getIp());
            jsonMap.put("domain", domain);
            newApp.setProperty(jsonMap);
            boolean isModify = appManagerService.modify(id, newApp);
            if (isModify)
            {
                map.put("result", OperateState.SUCCESS.getCode());
            }
        }
        return map;
    }*/

    /**
     * 删除应用
     *
     * @param id 用户id
     * @return 返回结果
     */
    @ResponseBody
    @RequestMapping(value = "/app/delete")
    public Map<String, Object> delete(@RequestParam String id)
    {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("result", OperateState.FAIL.getCode());
        User user = (User) session.getAttribute("user");
        if (null != user)
        {
            boolean isDelete = appManagerService.delete(id);
            if (isDelete)
            {
                map.put("result", OperateState.SUCCESS.getCode());
            }
        }
        return map;
    }

    /**
     * 冻结应用
     *
     * @param id 用户id
     * @return 返回结果
     */
    @ResponseBody
    @RequestMapping(value = "/app/lock")
    public Map<String, Object> lock(@RequestParam String id)
    {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("result", OperateState.FAIL.getCode());
        User user = (User) session.getAttribute("user");
        if (null != user)
        {
            boolean isDelete = appManagerService.lock(id);
            if (isDelete)
            {
                map.put("result", OperateState.SUCCESS.getCode());
            }
        }
        return map;
    }

    /**
     * 待开通
     *
     * @param id 用户id
     * @return 返回结果
     */
    @ResponseBody
    @RequestMapping(value = "/app/waitOpen")
    public Map<String, Object> waitopen(@RequestParam String id)
    {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("result", OperateState.FAIL.getCode());
        User user = (User) session.getAttribute("user");
        if (null != user)
        {
            boolean isDelete = appManagerService.waitOpen(id);
            if (isDelete)
            {
                map.put("result", OperateState.SUCCESS.getCode());
            }
        }
        return map;
    }

    /**
     * 开通应用
     *
     * @param id 用户id
     * @return 返回结果
     */
    @ResponseBody
    @RequestMapping(value = "/app/open")
    public Map<String, Object> open(@RequestParam String id)
    {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("result", OperateState.FAIL.getCode());
        User user = (User) session.getAttribute("user");
        if (null != user)
        {
            boolean isDelete = appManagerService.open(id);
            if (isDelete)
            {
                map.put("result", OperateState.SUCCESS.getCode());
            }
        }
        return map;
    }

   /* *//**
     * 新增应用
     *//*
    @ResponseBody
    @RequestMapping(value = "/app/add")
    public Map<String, Object> add(){
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("result", OperateState.FAIL.getCode());
        User user = (User) session.getAttribute("user");

        if (null != user){
            String remark = request.getParameter("remark");
            String ip = request.getParameter("ip");
            String domain = request.getParameter("domain");
            String appName = request.getParameter("appName");
            String entId = request.getParameter("entId");
            App newApp = new App();
            Map<String, Object> jsonMap = new HashMap<String, Object>();
            jsonMap.put("remark", remark);
            jsonMap.put("ip", ip);
            jsonMap.put("domain", domain);
            newApp.setName(appName);
//            newApp.setParentId(user.getEnterprise().getId());
            newApp.setProperty(jsonMap);
            newApp.setStatus(AppType.WAITOPEN.getCode());
            newApp.setParentId(entId);
            boolean isModify = appManagerService.add(newApp);
            if (isModify){
                map.put("result", OperateState.SUCCESS.getCode());
            }
        }
        return map;
    }*/

    /**
     * 获取列表
     *
     * @return 应用列表
     */
    @ResponseBody
    @RequestMapping(value = "/app/list")
    public Map<String, Object> list()
    {
        Map<String, Object> map = new HashMap<String, Object>();
        User user = (User) session.getAttribute("user");
        
        if (null != user)
        {
            String startNum = request.getParameter("pageNumber");
            String pageSize = request.getParameter("pageSize");

            String name = request.getParameter("name");
            String status = request.getParameter("status");

            Map<String, Object> condition = new HashMap<String, Object>();
            condition.put("name", name);
            condition.put("status", status);
            condition.put("pid", user.getEnterprise_id());
//            condition.put("enterprise_id", user.getEnterprise().getId());
            Page<Map<String, Object>> page = appManagerService.findList(condition, startNum, pageSize);
            map.put("total", page.getTotalCount());
            map.put("result", page.getResult());
        }
        return map;
    }

    /**
     * 获取列表
     *
     * @return 应用列表
     */
    @ResponseBody
    @RequestMapping(value = "/app/listAll")
    public Map<String, Object> listAll()
    {
        Map<String, Object> map = new HashMap<String, Object>();
        User user = (User) session.getAttribute("user");
        if (null != user)
        {
            String startNum = request.getParameter("pageNumber");
            String pageSize = request.getParameter("pageSize");

            String domain = request.getParameter("domain");
            String status = request.getParameter("status");

            Map<String, Object> condition = new HashMap<String, Object>();
            condition.put("domain", domain);
            condition.put("status", status);
            condition.put("name", request.getParameter("name"));
            condition.put("pid", user.getEnterprise_id());
            Page<Map<String, Object>> page = appManagerService.findList(condition, startNum, pageSize);
            map.put("total", page.getTotalCount());
            map.put("result", page.getResult());
        }
        return map;
    }


}
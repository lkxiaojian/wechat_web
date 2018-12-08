package com.kingweather.system.controller.manager;

import com.kingweather.common.controller.BaseController;
import com.kingweather.common.util.Page;
import com.kingweather.system.manager.domain.LogType;
import com.kingweather.system.manager.domain.OperateState;
import com.kingweather.system.manager.domain.OperateType;
import com.kingweather.system.manager.domain.User;
import com.kingweather.system.service.manager.LogManagerService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;


/**
 * 日志管理
 */
@Controller
public class LogManagerController extends BaseController
{
    @Resource
    private LogManagerService logManagerService;

    /**
     * 获取列表
     *
     * @return 列表
     */
    @ResponseBody
    @RequestMapping(value = "/log/list")
    public Map<String, Object> list()
    {
        Map<String, Object> resultMap = new HashMap<String, Object>();

        String startNum = request.getParameter("pageNumber");
        String pageSizestr = request.getParameter("pageSize");
        String account = request.getParameter("account");
        String operation_type = request.getParameter("operation_type");
        String startDate = request.getParameter("startDate");
        String endDate = request.getParameter("endDate");
        String state = request.getParameter("state");
        User user = (User) session.getAttribute("user");
        if (null != user){
            Map<String, Object> map = new HashMap<String, Object>();
            int currentRoleType = Integer.parseInt(user.getUserType());
            if (currentRoleType == 1 ){
                map.put("type", LogType.PLATFORM.getCode());
//                map.put("domain", user.getDomain());
            }else if(currentRoleType == 2){
                map.put("type", LogType.TENANT.getCode());
//                map.put("domain", user.getDomain());
            }else {
            	map.put("type", LogType.UNKNOWN.getCode());
            }
            map.put("account", account);
            map.put("operation_type", operation_type);
            map.put("state", state);
            map.put("startDate", startDate);
            map.put("endDate", endDate);


            Page<Map<String, Object>> page = logManagerService.logs(map, startNum, pageSizestr);
            resultMap.put("total", page.getTotalCount());
            resultMap.put("result", page.getResult());
        }
        return resultMap;
    }


    /**
     * 获取列表
     *
     * @return 列表
     */
    @ResponseBody
    @RequestMapping(value = "/log/tenantList")
    public Map<String, Object> tenantList()
    {
        Map<String, Object> resultMap = new HashMap<String, Object>();

        String startNum = request.getParameter("pageNumber");
        String pageSizestr = request.getParameter("pageSize");
        String account = request.getParameter("account");
        String operation_type = request.getParameter("operation_type");
        String startDate = request.getParameter("startDate");
        String endDate = request.getParameter("endDate");
        String state = request.getParameter("state");
        User user = (User) session.getAttribute("user");
        if (null != user)
        {
            Map<String, Object> map = new HashMap<String, Object>();
//            int currentRoleType = user.getRole();
//            map.put("type", LogType.TENANT.getCode());
            map.put("account", account);
            map.put("operation_type", operation_type);
            map.put("state", state);
            map.put("startDate", startDate);
            map.put("endDate", endDate);

            Page<Map<String, Object>> page = logManagerService.logs(map, startNum, pageSizestr);
            resultMap.put("total", page.getTotalCount());
            resultMap.put("result", page.getResult());
        }
        return resultMap;
    }


    /**
     * 获取操作类型
     *
     * @return 列表
     */
    @ResponseBody
    @RequestMapping(value = "/log/operateTypes")
    public Map<Integer, Object> operateTypes()
    {
        Map<Integer, Object> map = new HashMap<Integer, Object>();
        for (OperateType ot : OperateType.values())
        {
            map.put(ot.getCode(), ot.getName());
        }
        return map;
    }

    /**
     * 获取操作结果
     *
     * @return 列表
     */
    @ResponseBody
    @RequestMapping(value = "/log/operateState")
    public Map<Integer, Object> operateState()
    {
        Map<Integer, Object> map = new HashMap<Integer, Object>();
        for (OperateState ot : OperateState.values())
        {
            map.put(ot.getCode(), ot.getName());
        }
        return map;
    }

}
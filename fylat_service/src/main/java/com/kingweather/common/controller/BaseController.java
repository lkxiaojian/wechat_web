package com.kingweather.common.controller;

import com.kingweather.common.exception.UserException;
import com.kingweather.system.manager.domain.Log;
import com.kingweather.system.manager.domain.OperateState;
import com.kingweather.system.manager.domain.OperateType;
import com.kingweather.system.manager.domain.User;
import com.kingweather.system.service.manager.LogManagerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;


//@ControllerAdvice
//@EnableWebMvc
public class BaseController {
    Logger logger = LoggerFactory.getLogger(getClass());
    private static final String MESSAGE_SESSION = "MESSAGE_SESSION";
    @Resource
    protected HttpServletRequest request;
    @Resource
    protected HttpSession session;
    String start;





    //	@ExceptionHandler(NullPointerException.class)
    @ResponseBody
    public Map<String, Object> runtimeExceptionHandler(NullPointerException e) {
        logger.error("exception",e);
        e.printStackTrace();
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        map.put("code", 1);
        map.put("message", "后台操作失败，请联系管理人员!" + (e == null ? "" : (e.getMessage().length() > 21 ? e.getMessage().substring(0, 20) : e.getMessage())));
        return map;
    }

    //	@ExceptionHandler(Exception.class)
    //    public ModelAndView handleAllException(Exception ex) {
    //        ModelAndView model = new ModelAndView("error/generic_error");
    //        model.addObject("errMsg", "this is Exception.class");
    //        return model;
    //    }


    @SuppressWarnings("unchecked")
    protected Map<String, Object> getUserMap(HttpServletRequest request) {
        Map<String, Object> userMap = (Map<String, Object>) request.getSession().getAttribute("userMap");
        return userMap;
    }

    protected void setMessage(String message) {
        session.setAttribute(MESSAGE_SESSION, message);
    }

    /**
     * 取得客户端真实ip
     *
     * @param request
     * @return 客户端真实ip
     */
    protected String getIpAddr(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");

        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        if ("127.0.0.1".equalsIgnoreCase(ip) || "0:0:0:0:0:0:0:1".equalsIgnoreCase(ip)) {
            InetAddress inet = null;
            try {
                inet = InetAddress.getLocalHost();
            } catch (UnknownHostException e) {
                e.printStackTrace();
            }
            ip = inet.getHostAddress();
        }
        return ip;
    }

    protected void setPage(int count) {
        start = request.getParameter("curPage");
        if (start == null) {
            start = "0";
        }
        request.setAttribute("curPage", start);
        //		request.setAttribute("pageSize","100");
        request.setAttribute("pageCount", (count - 1) / 100 + 1);
        request.setAttribute("totalPage", count);

    }

    public String getParameterURL(HttpServletRequest req) throws Exception {
        String httpString = req.getRequestURI();
        Map map = req.getParameterMap();
        Set<String> s = map.keySet();
        if (s != null && s.size() > 0) {
            httpString += "?";
            for (String key : s) {
                httpString += key + "=" + new String(req.getParameter(key).getBytes("ISO-8859-1"), "utf-8") + "&";
            }
            httpString = httpString.substring(0, httpString.length() - 1);
        }
        return httpString;
    }

    public void getPackMap(Map<String, Object> map, Object mapList, String message, int code) {
        map.clear();
        map.put("code", code);
        map.put("message", message);
        map.put("result", mapList);
    }

    /**
     * 写日志
     *
     * @param logManagerService
     * @param currentSession
     * @param currentRequest
     * @param state
     * @param operateType
     * @param property
     */
    public void log(LogManagerService logManagerService, HttpSession currentSession,
                    HttpServletRequest currentRequest, int state,
                    OperateType operateType, String property) {

        User currentUser = (User) currentSession.getAttribute("user");
        if (null != currentUser) {
            Log log = new Log();
            log.setAccount(currentUser.getUserName());
            log.setOperateState(OperateState.getOperateState(state));
//            log.setDomain(currentUser.getDomain());
            log.setIp(getIpAddr(currentRequest));
            log.setOperateType(operateType);
//            int currentRoleType = currentUser.getRole();
//            if (currentRoleType < 4)
//            {
//                log.setLogType(LogType.PLATFORM);
//            }
//            else
//            {
//                log.setLogType(LogType.TENANT);
//            }
            log.setOperateDate(new Date());
            log.setProperty(property);

            logManagerService.insertLog(log);
        }
    }
}

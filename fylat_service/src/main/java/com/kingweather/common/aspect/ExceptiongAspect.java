/**
 * @author luyl
 * 2014-12-18
 */
package com.kingweather.common.aspect;


import com.kingweather.common.exception.UserException;
import com.kingweather.system.manager.domain.Log;
import com.kingweather.system.manager.domain.OperateState;
import com.kingweather.system.manager.domain.OperateType;
import com.kingweather.system.manager.domain.User;
import com.kingweather.system.service.manager.LogManagerService;
import com.kingweather.we_chat.controller.UserManage.UserManageController;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.*;

@Aspect
@Order(5)
@Component
public class ExceptiongAspect {
    @Resource
    private JdbcTemplate jdbcTemplate;
    Logger logger = LoggerFactory.getLogger(this.getClass());
    private static Map<String, OperateType> methodMap = null;

    static {
        //userLogin
        if (methodMap == null) {
            methodMap = new HashMap<String, OperateType>();
            methodMap.put("getUserByNamePassword", OperateType.LOGIN);
            methodMap.put("create", OperateType.ADDUSER);
            methodMap.put("modifyPassword", OperateType.MODIFYPASSWD);
            methodMap.put("regist", OperateType.REGIST);
        }
    }

    @Resource
    protected HttpServletRequest request;

    @Resource
    protected HttpSession session;

    @Resource
    LogManagerService logManagerService;

    @Pointcut("execution (* com.kingweather..service..*.*(..)) && !execution(* com.kingweather..service.skipAspect..*.*(..))")
    private void cutMethod() {
    }

    @Pointcut("execution (* com.kingweather..controller..*.*(..)) && !execution (* com.kingweather..controller..Ws*.*(..))")
    private void cutController() {
    }

    @Before("cutController()")
    public void doBeforeController(JoinPoint joinPoint) throws Throwable {
        if (!joinPoint.toString().contains("UserManage.UserManageController")
                && !joinPoint.toString().contains("ArticleManage.ArticleManageController")
//                && !joinPoint.toString().contains("other.UploadController")
                && !joinPoint.toString().contains("statistics.StatisticsController")
                && !joinPoint.toString().contains("usermenu.UserMenuController")
                && !joinPoint.toString().contains("websysuser.WebSysUserController")
                &&!joinPoint.toString().contains("algorithm.algorithmController")
                &&!joinPoint.toString().contains("algorithm.AlgorithmDataController")){
            String method = joinPoint.getSignature().getName();
            if (session.getAttribute("user") == null && !method.equals("userLogin") && !method.equals("articleImageUpload") && !method.equals("addArticle")) {
//                logger.error("session失效");
//                throw new UserException("请重新登录!");
            }
        }

    }


    @AfterThrowing(pointcut = "cutMethod()", throwing = "e")
    public void afterThrowing(JoinPoint join, Exception e) throws Exception {
//		e.printStackTrace();
        try {
            logger.error(e.getMessage());

            String classname = join.getTarget().getClass().getName();
            String method = join.getSignature().getName();
            logger.info("--e--aop exception：" + classname + "------" + method);
            request.setAttribute("method", null);
        } catch (Exception e1) {
            logger.error("eaop:::" + e1.getMessage());
			throw new RuntimeException(e1);
        }

    }

    @Before("cutMethod()")
    public void doBefore(JoinPoint join) throws Exception {
//		try {
        String classname = join.getTarget().getClass().getName();
        String method = join.getSignature().getName();
        if ("insertSysLog".equals(method) || "insertLog".equals(method)) {
            return;
        }
        logger.debug("当前访问的链接是：" + request.getRequestURL() + (request.getQueryString() == null ? "" : ("?" + request.getQueryString())));
        logger.info("--b--aop：" + classname + "------" + method);
//			if(!method.equals("getUserByNamePassword") && session.getAttribute("user") == null){
//				logger.error("session失效");
//				throw new UserException("请重新登录!");
//			}
        logger.debug("view: " + request.getParameter("view"));
        if ("getDictionary".equals(method)) {
            logger.debug("错误的链接是：" + request.getRequestURL() + (request.getQueryString() == null ? "" : ("?" + request.getQueryString())));
        } else {
				/*if(method.startsWith("get") || method.startsWith("top")){
					if(StringUtils.isEmpty(request.getParameter("begin_time")) || StringUtils.isEmpty(request.getParameter("end_time"))){
						throw new RuntimeException("请传入开始和结束时间");
					}
				}*/
        }
        request.setAttribute("method", method);

//		} catch (Exception e) {
//			logger.error("aop:::::" + e.getMessage());
//		}
    }

    @AfterReturning("cutMethod()")
    public void after(JoinPoint join) throws Exception {
        try {
            //String classname = join.getTarget().getClass().getName();
            String method = join.getSignature().getName();

            if (!"insertLog".equals(method) && (method.equals(request.getAttribute("method")))) {
                //logger.info("--e--aop after：" + classname + "------" + method);
                OperateType op = methodMap.get(method) == null ? OperateType.UNKNOWN : methodMap.get(method);
                log(1, op, method);
            }

        } catch (Exception e1) {
            logger.error("eaop:::" + e1.getMessage());
//			throw new RuntimeException(e1);
        }

    }


    public void getParameters() {
        Map<?, ?> params = request.getParameterMap();
        Iterator<?> it = params.keySet().iterator();
        while (it.hasNext()) {
            String paramName = (String) it.next();
            String paramValue = request.getParameter(paramName);
            //处理你得到的参数名与值
            System.out.println(paramName + "=" + paramValue);
        }
    }

    public void getParameters2() {
        Enumeration<?> enu = request.getParameterNames();
        while (enu.hasMoreElements()) {
            String paraName = (String) enu.nextElement();
            System.err.println(paraName + ": " + request.getParameter(paraName));
        }
    }

    /**
     * 取得客户端真实ip
     *
     * @return 客户端真实ip
     */
    protected String getIpAddr() {
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

    /**
     * 写日志
     *
     * @param state       //成功或失败标识 0失败，1成功
     * @param operateType //登入，注册，之类
     * @param property    //调用方法的信息
     */
    public void log(int state, OperateType operateType, String property) {

        User currentUser = (User) session.getAttribute("user");
        Log log = new Log();
        if (null != currentUser) {
            log.setAccount(currentUser.getUserName());
            log.setOperateState(OperateState.getOperateState(state));
//            log.setDomain(currentUser.getDomain());
            log.setIp(getIpAddr());
            log.setOperateType(operateType);
//            int currentRoleType = currentUser.getRole();
//            if (currentRoleType < 4){
//                log.setLogType(LogType.PLATFORM);
//            }else{
//                log.setLogType(LogType.TENANT);
//            }
            log.setLogType(currentUser.getUserType());
            log.setOperateDate(new Date());
            log.setProperty(property);

            logManagerService.insertLog(log);
        } else if (null != property) {
            String ip = "";
            if (property.indexOf("@") > -1) {
                ip = property.split("@")[1];
            }
            if ("weather_service".equals(property.split("@")[0])) {
                log.setAccount("kingweather");
                log.setOperateState(OperateState.getOperateState(state));
                log.setDomain("kingweather");
                log.setIp(ip);
                log.setOperateType(operateType);
                log.setLogType("1");
                log.setOperateDate(new Date());
                log.setProperty(property);
                String sql = "insert into insure.tbl_logs(type,account,operation_type,operation_date,state,property,ip_address,domain) values(?,?,?,?,?,?,?,?)";
                try {
                    jdbcTemplate.update(sql, new Object[]{Integer.parseInt(log.getLogType()), log.getAccount(), log.getOperateType().getCode(), log.getOperateDate(), log.getOperateState().getCode(), log.getProperty(), log.getIp(), log.getDomain()});
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }
}

package com.kingweather.config;

import javax.servlet.http.HttpServletRequest;

import com.kingweather.common.exception.UserException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.LinkedHashMap;
import java.util.Map;


/**
 * 1、新建一个Class,这里取名为GlobalDefaultExceptionHandler
 * 2、在class上添加注解，@ControllerAdvice;
 * 3、在class中添加一个方法
 * 4、在方法上添加@ExcetionHandler拦截相应的异常信息；
 * 5、如果返回的是View -- 方法的返回值是ModelAndView;
 * 6、如果返回的是String或者是Json数据，那么需要在方法上添加@ResponseBody注解.
 *
 */
@ControllerAdvice
public class GlobalDefaultExceptionHandler {
	Logger logger = LoggerFactory.getLogger(getClass());
	@ExceptionHandler(Exception.class)
	@ResponseBody
	public String defaultExceptionHandler(HttpServletRequest req,Exception e){
		//是返回的String.
		//ModelAndView -- 介绍 模板引擎...?
//		ModelAndView mv = new ModelAndView();
//		mv.setViewName(viewName);
		return "sory!!!!";
	}
	@ExceptionHandler(Throwable.class)
    @ResponseBody
    public Map<String, Object> runtimeExceptionHandler(HttpServletRequest request, Exception e) {
        logger.error("exception",e);
        e.printStackTrace();
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        map.put("code", 1);
        map.put("message", "后台操作失败，请联系管理人员!" + (((e == null || e.getMessage() == null) ? "未知错误" + (e != null ? e.getClass().getName() : "") : (e.getMessage().length() > 100 ? e.getMessage().substring(0, 99) : e.getMessage()))));
        return map;
    }
	@ExceptionHandler(value = {UserException.class})
	@ResponseBody
	public Map<String, Object> handlerException(UserException e, HttpServletRequest req) {
		logger.error("UserException session is not valid!!!!!!!!!!!!!!!!! {}");
		Map<String, Object> map = new LinkedHashMap<String, Object>();
		map.put("sessionInvalid", 1);
		map.put("message", "后台操作失败，请联系管理人员!" );
		return map;

	}
}

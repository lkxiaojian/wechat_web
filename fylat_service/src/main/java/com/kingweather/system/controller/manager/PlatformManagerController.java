package com.kingweather.system.controller.manager;

import com.kingweather.common.controller.BaseController;
import com.kingweather.common.util.EmailUtils;
import com.kingweather.common.util.Md5Utils;
import com.kingweather.system.manager.domain.Email;
import com.kingweather.system.service.manager.UserManagerService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

/**
 * 平台管理
 */
@Controller
public class PlatformManagerController extends BaseController {
    @Resource
    private UserManagerService systemService;

    private static Email e = null;

    public Email emailInstance() {
        if (e == null) {
            e = systemService.gEmailconfig();
        }
        return e;
    }

    /**
     * 重置用户密码
     */
    @RequestMapping(value = "/reset/password", params = "reqverify", method = {RequestMethod.GET})
    public String resetpwd(String h, String email, Model model) {
        Long time = Long.parseLong(h, 16);
        Long cur = new Date().getTime();
        int flag = 0;
        String pwd = "";
        if ((cur - time) <= 1000 * 60 * 60 * 48) {
            Random r = new Random();
            pwd = r.nextInt(100000000) + "";
            flag = systemService.resetpw(email, Md5Utils.encode2hex(pwd));
        } else {
            pwd = "已超过48个小时，请重新申请密码重置";
        }
        model.addAttribute("issuccess", flag > 0 ? true : false);
        model.addAttribute("newpwd", pwd);
        return "dispatch";
    }

    /**
     * 测试用户email是否存在,如果存放给该用户发送邮件
     */
    @ResponseBody
    @RequestMapping(value = "/user/readEmail", method = {RequestMethod.GET})
    public boolean readEmail(String email) {
        String emailStr = systemService.readEmail(email);
        if (emailStr != null) {
            if (e == null) {
                e = systemService.gEmailconfig();
                if (e == null) {
                    return false;
                }
            }
            Long d = new Date().getTime();
            String time = Long.toHexString(d);
            String path = request.getContextPath();
            String resetpwd = e.getServerDomain();
            if (e.getServerDomain().matches("\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}")) {
                resetpwd = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path;
            }
            resetpwd += "/reset/password?reqverify&email=" + email + "&h=" + time;

            EmailUtils.confirm(e, emailStr, resetpwd);
        }
        return emailStr != null ? true : false;
    }

    /**
     * 保存邮件服务信息
     *
     * @param email
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/email/config", params = "view=json", method = {RequestMethod.POST})
    public Integer addEmailConfig(@RequestBody Email email) {
        return systemService.addEmailConfig(email);
    }

    /**
     * 测试邮件联接
     *
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/email/connect", method = {RequestMethod.GET})
    public boolean connectEmail() {
        Email email = systemService.gEmailconfig();
        if (email != null) {
            return EmailUtils.testConnect(email);
        }
        return false;
    }

    /**
     * 读取邮件信息
     *
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/email/detail", method = {RequestMethod.GET})
    public Map<String, Object> getEmail() {
        Map<String, Object> map = new HashMap<String, Object>();
        Email email = systemService.gEmailconfig();
        map.put("email", email);
        return map;
    }

    /**
     * 读取邮件信息
     *
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/email/delmail", method = {RequestMethod.GET})
    public Integer delEmail() {
        return systemService.delEmail();
    }
}

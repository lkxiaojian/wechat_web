package com.kingweather.we_chat.controller.UserManage;

import com.kingweather.common.controller.BaseController;
import com.kingweather.fylat_service.controller.other.DataManageController;
import com.kingweather.we_chat.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;

@RestController
public class UserManageController extends BaseController {

    Logger log = LoggerFactory.getLogger(DataManageController.class);
    @Resource
    private UserService userService;

    /**
     * 用户注册
     *
     * @param userData
     * @return
     */
    @RequestMapping(value = "/user/register/rest", method = RequestMethod.POST)
    public Map<String, Object> getDataManageList(@RequestBody Map<String, Object> userData) {
        Map map = new HashMap();
        log.info("用户注册");
        map = userService.registerUser(userData);

        return map;
    }

    /**
     * 获取首页所有信息
     *
     * @return
     */
    @RequestMapping(value = "/user/getIndexMessage/rest")
    public Map<String, Object> getIndexMessage(String wechatid,int page) {
        Map map = new HashMap();
        map= userService.getIndexMessage(wechatid,page);
        return map;
    }


    /**
     * 设置关注
     * @return
     */
    @RequestMapping(value = "/user/setAttention/rest")
    public Map<String, Object> setAttention(String wechatid,String attentions,String type) {
        Map map = new HashMap();
        map=userService.setAttention(wechatid,attentions,type);
        return map;
    }




}

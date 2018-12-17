package com.kingweather.we_chat.controller.UserManage;

import com.alibaba.fastjson.JSONObject;
import com.kingweather.common.controller.BaseController;
import com.kingweather.fylat_service.controller.other.DataManageController;
import com.kingweather.we_chat.constants.AesCbcUtil;
import com.kingweather.we_chat.constants.HttpRequest;
import com.kingweather.we_chat.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
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
    public Map<String, Object> getIndexMessage(String wechatid, int page) {
        Map map = new HashMap();
        map = userService.getIndexMessage(wechatid, page);
        return map;
    }





    /**
     * 获取类型剩余多少片文章
     *
     * @return
     */
    @RequestMapping(value = "/user/getIndexMessageLast/rest")
    public Map<String, Object> getIndexMessageLast(String wechatid, int page,String article_type_id) {
        Map map = new HashMap();

        map = userService.getIndexMessageLast(wechatid, page,article_type_id);
        return map;
    }




    /**
     * 设置关注
     *
     * @return
     */
    @RequestMapping(value = "/user/setAttention/rest")
    public Map<String, Object> setAttention(String wechatid, String attentions, String type) {
        Map map = new HashMap();
        map = userService.setAttention(wechatid, attentions, type);
        return map;
    }


    /**
     * 解密用户敏感数据
     * <p>
     * encryptedData 明文,加密数据
     * iv            加密算法的初始向量
     * code          用户允许登录后，回调内容会带上 code（有效期五分钟），开发者需要将 code 发送到开发者服务器后台，使用code 换取 session_key api，将 code 换成 openid 和 session_key
     *
     * @return
     */
    @RequestMapping(value = "/user/decodeUserInfo", method = RequestMethod.POST)
    public Map<String, Object> decodeUserInfo(@RequestBody Map<String, Object> data) {


        Object encryptedData = data.get("encryptedData");
        Object iv = data.get("iv");
        Object code = data.get("code");
        Map map = new HashMap();

        //登录凭证不能为空
        if (code == null || code.toString().length() == 0) {
            map.put("status", 0);
            map.put("msg", "code 不能为空");
            return map;
        }

        //小程序唯一标识   (在微信小程序管理后台获取)
        String wxspAppid = "wx505c1798ade5f3af";
        //小程序的 app secret (在微信小程序管理后台获取)
        String wxspSecret = "57ce6019a2424a4928203032fac9ff83";
        //授权（必填）
        String grant_type = "authorization_code";


        //////////////// 1、向微信服务器 使用登录凭证 code 获取 session_key 和 openid ////////////////
        //请求参数
        String params = "appid=" + wxspAppid + "&secret=" + wxspSecret.toString() + "&js_code=" + code.toString() + "&grant_type=" + grant_type;
        //发送请求
        String sr = HttpRequest.sendGet("https://api.weixin.qq.com/sns/jscode2session", params);
        //解析相应内容（转换成json对象）
        JSONObject json = JSONObject.parseObject(sr);

        if (json.get("openid") != null) {
            //获取会话密钥（session_key）
            String session_key = json.get("session_key").toString();
            //用户的唯一标识（openid）
            String openid = (String) json.get("openid");
            map.put("code", 0);
            map.put("session_key", session_key);
            map.put("openid", openid);
            return map;

        }



 /*       //////////////// 2、对encryptedData加密数据进行AES解密 ////////////////
        try {
            String result = AesCbcUtil.decrypt(encryptedData.toString(), session_key, iv.toString(), "UTF-8");
            if (null != result && result.length() > 0) {
                map.put("status", 1);
                map.put("msg", "解密成功");

                JSONObject userInfoJSON = JSONObject.parseObject(result);
                Map userInfo = new HashMap();
                userInfo.put("openId", userInfoJSON.get("openId"));
                userInfo.put("nickName", userInfoJSON.get("nickName"));
                userInfo.put("gender", userInfoJSON.get("gender"));
                userInfo.put("city", userInfoJSON.get("city"));
                userInfo.put("province", userInfoJSON.get("province"));
                userInfo.put("country", userInfoJSON.get("country"));
                userInfo.put("avatarUrl", userInfoJSON.get("avatarUrl"));
                userInfo.put("unionId", userInfoJSON.get("unionId"));
                map.put("userInfo", userInfo);
                return map;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }*/


        map.put("code", 1);
        map.put("msg", "传递code值过期");
        return map;
    }


}

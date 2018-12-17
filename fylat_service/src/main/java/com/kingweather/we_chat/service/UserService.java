package com.kingweather.we_chat.service;

import java.util.Map;

/**
 * 用户相关
 */
public interface UserService {
    /**
     * 用户注册
     * @param userData 信息
     * @return
     */
    Map<String, Object> registerUser(Map<String, Object> userData);

    Map<String, Object> getIndexMessage(String wechatid,int page);

    Map<String, Object> setAttention(String wechatid, String attentions,String type);

    Map getIndexMessageLast(String wechatid, int page, String article_type_id);
}

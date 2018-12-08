package com.kingweather.we_chat.dao;

import java.util.Map;

/**
 * 用户相关与数据库
 */
public interface userDao {

    Map<String, Object> registerUser(Map<String, Object> userData);

    Map<String,Object> getIndexMessage(String wechatid,int page);

    Map<String,Object> setAttention(String wechatid, String attentions,String type);
}

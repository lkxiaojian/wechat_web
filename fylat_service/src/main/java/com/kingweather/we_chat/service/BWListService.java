package com.kingweather.we_chat.service;

import java.util.Map;

public interface BWListService {
    Map<String,Object> scoresSetting(Map<String, Object> data);

    Map<String,Object> GetSettingMessage();

    Map<String,Object> addbwKeyName(String name);

    Map<String,Object> updatebwKeyName(String id,String name);

    Map<String,Object> delbwKeyName(String id);
}

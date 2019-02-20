package com.kingweather.we_chat.dao;

import java.util.Map;

public interface BWListDao {
    Map<String,Object> scoresSetting(Map<String, Object> data);

    Map<String,Object> GetSettingMessage();

}

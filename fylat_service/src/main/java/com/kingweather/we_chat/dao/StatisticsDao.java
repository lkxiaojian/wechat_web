package com.kingweather.we_chat.dao;

import java.util.Map;

/**
 * Description: wechat_web
 * Created by s on 2019/1/22 14:18
 */
public interface StatisticsDao {

    int insertStatisticsInfo(Map<String, Object> info) throws Exception;

}

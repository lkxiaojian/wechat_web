package com.kingweather.we_chat.service;

import java.util.Map;

/**
 * Description: wechat_web
 * Created by s on 2019/1/22 14:18
 */
public interface StatisticsService {

    int insertStatisticsInfo(Map<String, Object> info) throws Exception;
    Map getCharData(Map<String, Object> info) throws Exception;

    Map selStatisticsInfo(Map<String, Object> info) throws Exception;

}

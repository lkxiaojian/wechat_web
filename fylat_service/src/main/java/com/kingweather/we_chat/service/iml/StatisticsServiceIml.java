package com.kingweather.we_chat.service.iml;

import com.kingweather.we_chat.dao.StatisticsDao;
import com.kingweather.we_chat.service.StatisticsService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Map;

/**
 //endregion
 * Description: wechat_web
 * Created by s on 2019/1/22 14:19
 */
@Service
public class StatisticsServiceIml implements StatisticsService {

    @Resource
    private StatisticsDao statisticsDao;

    @Override
    public int insertStatisticsInfo(Map<String, Object> info) throws Exception{

        return statisticsDao.insertStatisticsInfo(info);
    }
}

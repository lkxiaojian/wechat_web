package com.kingweather.we_chat.dao.iml;

import com.kingweather.we_chat.dao.StatisticsDao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.util.Map;

/**
 * Description: wechat_web
 * Created by s on 2019/1/22 14:17
 */
@Repository
public class StatisticsDaoIml implements StatisticsDao {

    @Resource
    private JdbcTemplate jdbcTemplate;


    @Override
    public int insertStatisticsInfo(Map<String, Object> info) throws Exception {

        String sql = "INSERT INTO statistics_info (article_id,statistics_type,dispose_time,user_id,article_type) VALUES(?,?,NOW(),?,?)";

        int i = jdbcTemplate.update(sql, new Object[]{
                info.get("articleId"),
                info.get("statisticsType"),
                info.get("userId"),
                info.get("articleType")
        });
        return i;
    }
}

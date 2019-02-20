package com.kingweather.we_chat.dao.iml;

import com.kingweather.common.jdbc.JdbcUtil;
import com.kingweather.we_chat.dao.BWListDao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;

@Repository
public class BWListDaoIml implements BWListDao {

    @Resource
    private JdbcTemplate jdbcTemplate;
    @Resource
    private JdbcUtil jdbc;


    @Override
    public Map<String, Object> scoresSetting(Map<String, Object> data) {
        Object page_view = data.get("page_view");//浏览量 区间段如1000<1<10000<2
        Object article_standing_time = data.get("article_standing_time");//停留时间 区间段
        Object word_count = data.get("word_count");//字数  区间段
        Object author_adoption = data.get("author_adoption");//作者采纳率
        Object public_adoption = data.get("public_adoption");//公总号采纳率
        Object topic_match = data.get("topic_match");//题目相符
        Object transpond_count = data.get("transpond_count");//内容重叠率高于80%公总号转发次数
        Object content_plate = data.get("content_plate");//内容板块关联性（拼凑编造）
        Object fall_back = data.get("fall_back");//退回
        Object reserve = data.get("reserve");//保留
        Object callback = data.get("callback");//召回
        Object hot_article = data.get("hot_article");//热文
        Object technical_information = data.get("technical_information");//最新技术资讯
//传参错误
        if (page_view == null || article_standing_time == null || word_count == null || author_adoption == null ||
                public_adoption == null || topic_match == null || transpond_count == null || content_plate == null ||
                fall_back == null || reserve == null || callback == null || hot_article == null || technical_information == null) {

            return getErrorMap();

        }


        String countSql = "select count(*) as count  from zz_wechat.article_score";
        Map<String, Object> map = jdbcTemplate.queryForMap(countSql);
        //更新
        if (map != null && map.get("count") != null && Integer.parseInt(map.get("conunt").toString()) > 0) {

            String sql = "update zz_wechat.article_score set page_view=?,article_standing_time=?,word_count=?,author_adoption=?,public_adoption=?,\" +\n" +
                    " topic_match=?,transpond_count=?,content_plate=?,fall_back=?,reserve=?,callback=?,hot_article=?,technical_information=? where id=? ";

            int update = jdbcTemplate.update(sql, new Object[]{
                    page_view.toString(),
                    article_standing_time.toString(),
                    word_count.toString(),
                    author_adoption.toString(),
                    public_adoption.toString(),
                    topic_match.toString(),
                    transpond_count.toString(),
                    content_plate.toString(),
                    fall_back.toString(),
                    reserve.toString(),
                    callback.toString(),
                    hot_article.toString(),
                    technical_information,
                    1
            });


        } else {
            //新增
            String sql = "insert into zz_wechat.article_score (page_view,article_standing_time,word_count,author_adoption,public_adoption," +
                    "topic_match,transpond_count,content_plate,fall_back,reserve,callback,hot_article,technical_information) values " +
                    "( ?,?,?,?,?,?,?,?,?,?,?,?,?)";
            int update = jdbcTemplate.update(sql, new Object[]{
                    page_view.toString(),
                    article_standing_time.toString(),
                    word_count.toString(),
                    author_adoption.toString(),
                    public_adoption.toString(),
                    topic_match.toString(),
                    transpond_count.toString(),
                    content_plate.toString(),
                    fall_back.toString(),
                    reserve.toString(),
                    callback.toString(),
                    hot_article.toString(),
                    technical_information
            });
        }

        HashMap<String, Object> resultMap = new HashMap<>();
        map.put("code", 0);
        map.put("message", "成功！");
        return resultMap;
    }

    /**
     * 获取分数设置
     *
     * @return
     */

    @Override
    public Map<String, Object> GetSettingMessage() {
        String sql = "select * from zz_wechat.article_score LIMIT 0,1";
        Map<String, Object> map = jdbcTemplate.queryForMap(sql);
        HashMap<String, Object> resultMap = new HashMap<>();
        resultMap.put("code", 0);
        resultMap.put("message", "成功！");
        resultMap.put("result", map);

        return resultMap;
    }


    /**
     * 传参错误
     *
     * @return
     */
    private HashMap<String, Object> getErrorMap() {
        HashMap<String, Object> map = new HashMap<>();
        map.put("code", 1);
        map.put("message", "传参错误！");
        return map;
    }

    /**
     * 服务器内部错误
     *
     * @return
     */

    private HashMap<String, Object> getErrorMapService() {
        HashMap<String, Object> map = new HashMap<>();
        map.put("code", 2);
        map.put("message", "服务器内部错误！");
        return map;
    }
}

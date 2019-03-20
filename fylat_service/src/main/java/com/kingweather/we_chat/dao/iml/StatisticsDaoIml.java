package com.kingweather.we_chat.dao.iml;

import com.kingweather.we_chat.dao.StatisticsDao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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

        String sql = "INSERT INTO statistics_info (article_id,statistics_type,dispose_time,user_id,article_type,count_num) VALUES(?,?,NOW(),?,?,?)";

        int i = jdbcTemplate.update(sql, new Object[]{
                info.get("articleId"),
                info.get("statisticsType"),
                info.get("userId"),
                info.get("articleType"),
                info.get("countNum")
        });
        return i;
    }

    @Override
    public Map getCharData(Map<String, Object> info) throws Exception {
        String statisticsType =   info.get("statisticsType")==null?"":info.get("statisticsType").toString();
        String articleType =   info.get("articleType")==null?"":info.get("articleType").toString();
        String userId =   info.get("userId")==null?"":info.get("userId").toString();
        String startTime =   info.get("startTime")==null?"":info.get("startTime").toString();
        String endTime =   info.get("endTime")==null?"":info.get("endTime").toString();

        StringBuffer sql = new StringBuffer();
        List parameterList = new ArrayList();

        sql.append("  	SELECT 	 ");

//        if("3".equals(statisticsType)){
//            sql.append("  	ROUND(IFNULL(AVG(a.count_num),0))||'' num  ");
//        }else{
            sql.append("  	IFNULL(SUM(a.count_num),0) num ");
//        }
        sql.append("  	FROM  statistics_info a RIGHT JOIN sys_hour b ON DATE_FORMAT (a.dispose_time,'%k') = b.name   ");
        sql.append(" and a.statistics_Type = ? ");
        parameterList.add(statisticsType);
        sql.append(" AND a.dispose_time BETWEEN ? AND ? ");
        parameterList.add(startTime);
        parameterList.add(endTime);

        if(userId!=null&&!"".equals(userId)){
            sql.append("  and a.user_id = ?  	 ");
            parameterList.add(userId);
        }

        if(articleType!=null&&!"".equals(articleType)){
            sql.append("  and a.article_type = ?  	 ");
            parameterList.add(articleType);
        }
        sql.append("  	LEFT JOIN article_type c ON c.article_type_id = a.article_type and c.del_type = 0	 ");

        sql.append("  	GROUP BY b.name	 ");
        sql.append("  	ORDER BY b.name+0 	 ");

        List obj = jdbcTemplate.queryForList(sql.toString(),parameterList.toArray());
        String[] str = new String[obj.size()];
        for (int i=0,num=obj.size() ;i<num;i++){
          Map m =(Map) obj.get(i);
          str[i]=m.get("num").toString();
        }
        Map map = new HashMap();
        map.put("data",str);
        return map;
    }

    @Override
    public Map selStatisticsInfo(Map<String, Object> info) throws Exception {

        String statisticsType =   info.get("statisticsType")==null?"":info.get("statisticsType").toString();
        String startTime =   info.get("startTime")==null?"":info.get("startTime").toString();
        String endTime =   info.get("endTime")==null?"":info.get("endTime").toString();
        String userId =   info.get("userId")==null?"":info.get("userId").toString();
        String articleType =  info.get("articleType")==null?"":info.get("articleType").toString();
        String page =   info.get("page")==null?"":info.get("page").toString();
        String size =   info.get("size")==null?"":info.get("size").toString();
        String hour =   info.get("hour")==null?"":info.get("hour").toString();


        StringBuffer sql = new StringBuffer();
        List parameterList = new ArrayList();

        sql.append(" 	SELECT a.article_id articleId,	  ");
        sql.append(" 	a.article_type_id articleTypeId,	  ");
        sql.append(" 	c.article_type_name articleTypeName,	  ");
        sql.append(" 	a.article_title articleTitle,	  ");
        sql.append(" 	a.article_keyword articleKeyword,	  ");
        sql.append(" 	a.author author,	  ");
        sql.append(" 	a.create_time createTime,	  ");
        sql.append(" 	b.statistics_type statisticsType,	  ");
        sql.append(" 	a.source source,	  ");
        sql.append(" 	SUM(b.count_num) num	  ");
        sql.append(" 	FROM article a , statistics_info b,article_type c	  ");
        sql.append(" 	WHERE a.article_id = b.article_id and a.article_type_id = c.article_type_id	  ");
        sql.append(" AND c.del_type = 0 ");

        sql.append(" AND b.dispose_time BETWEEN ? AND ? ");
        parameterList.add(startTime);
        parameterList.add(endTime);
        sql.append(" 	AND b.statistics_type =	?  ");
        parameterList.add(statisticsType);

        if(userId!=null&&!"".equals(userId)){
            sql.append("  and b.user_id = ?  	 ");
            parameterList.add(userId);
        }
        if(articleType!=null&&!"".equals(articleType)){
            sql.append("  and b.article_type = ?  	 ");
            parameterList.add(articleType);
        }

        if(hour!=null&&!"".equals(hour)){
            sql.append("  and DATE_FORMAT (b.dispose_time,'%k') = ?  	 ");
            parameterList.add(hour);
        }
        sql.append(" 	GROUP BY a.article_id,b.statistics_type	  ");


        Number number =  jdbcTemplate.queryForObject("select count(1) from ("+sql.toString()+") c",parameterList.toArray(),Long.class);

        parameterList.add((Integer.valueOf(page)-1)*Integer.valueOf(size));
        parameterList.add(Integer.valueOf(size));
        sql.append("  	LIMIT ?, ? 	 ");

        List obj = jdbcTemplate.queryForList(sql.toString(),parameterList.toArray());

        Map map = new HashMap();
        map.put("data",obj);
        map.put("count",number.longValue());

        return map;
    }
}

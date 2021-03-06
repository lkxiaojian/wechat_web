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

        Map returnMap = new HashMap();
        String statisticsType =   info.get("statisticsType")==null?"":info.get("statisticsType").toString();
        String articleType =   info.get("articleType")==null?"":info.get("articleType").toString();
        String userId =   info.get("userId")==null?"":info.get("userId").toString();
        String startTime =   info.get("startTime")==null?"":info.get("startTime").toString();
        String endTime =   info.get("endTime")==null?"":info.get("endTime").toString();
        String state =   info.get("state")==null?"":info.get("state").toString();
        String type = info.get("type")==null?"":info.get("type").toString();

        List<Map<String,Object>>   XdataList = jdbcTemplate.queryForList("SELECT name FROM sys_code b WHERE b.state=1 AND b.type = ? ORDER BY b.name+0 ",new Object[]{type});

        String[] xData = new String[XdataList.size()];
        for (int i=0 ,numm = XdataList.size();i< numm;i++ ) {
            xData[i]=XdataList.get(i).get("name").toString();
        }

        List<Map<String,Object>> articleTypeList = jdbcTemplate.queryForList("SELECT article_type_id,article_type_name FROM article_type WHERE parentid=100  AND del_type=0 and issue=1");

        List dataList = new ArrayList();

        for (Map m:articleTypeList) {
            Map dataMap = new HashMap();
            String parentid = m.get("article_type_id").toString();
            String articleTypeName = m.get("article_type_name").toString();

            StringBuffer sql = new StringBuffer();
            List parameterList = new ArrayList();

            sql.append("  	SELECT COUNT(s.count_num) num FROM (	     ");
            sql.append("  	SELECT a.article_id,a.count_num,a.dispose_time  	     ");
            sql.append("  	FROM statistics_info a,article_type c,article d 	     ");
            sql.append("  	WHERE count_num IS NOT  NULL	     ");
            sql.append("  	AND c.article_type_id = a.article_type 	     ");
            sql.append("  	AND a.article_id = d.article_id 	     ");
            sql.append("  	AND a.dispose_time BETWEEN ? AND ?  	     ");
            parameterList.add(startTime);
            parameterList.add(endTime);
            if(articleType!=null&&!"".equals(articleType)){
                sql.append("  and a.article_type = ?  	 ");
                parameterList.add(articleType);
            }
            sql.append("  	AND c.article_type_id IN (SELECT w.article_type_id  FROM article_type w WHERE w.domain_id= ? )	     ");
            parameterList.add(parentid);
            sql.append("  	AND c.del_type=0 	     ");
            if(statisticsType!=null&&!"".equals(statisticsType)){
                sql.append("  AND a.statistics_Type = ?  	 ");
                parameterList.add(statisticsType);
            }
            if(state!=null&&!"".equals(state)){
                sql.append("  and d.state = ?  	 ");
                parameterList.add(state);
            }
            if(userId!=null&&!"".equals(userId)){
                sql.append("  and a.user_id = ?  	 ");
                parameterList.add(userId);
            }

            sql.append("  	) s RIGHT JOIN sys_code b ON DATE_FORMAT (s.dispose_time,'%"+type+"') = b.code where b.state=1 AND b.type = ? 	     ");
            parameterList.add(type);

            sql.append("  	GROUP BY b.code	     ");
            sql.append("  	ORDER BY b.code+0 	     ");


            List<Map<String,Object>> obj = jdbcTemplate.queryForList(sql.toString(),parameterList.toArray());
            String[] yData = new String[obj.size()];
            for (int i=0 ,numm = obj.size();i< numm;i++ ) {
                yData[i]=obj.get(i).get("num").toString();
            }


            dataMap.put("YData",yData);
            dataMap.put("YName",articleTypeName);
            dataList.add(dataMap);

        }
        returnMap.put("code",0);
        returnMap.put("Y",dataList);
        returnMap.put("X",xData);


        return returnMap;
    }

    @Override
    public Map selStatisticsInfo(Map<String, Object> info) throws Exception {

        String statisticsType =   info.get("statisticsType")==null?"":info.get("statisticsType").toString();
        String startTime =   info.get("startTime")==null?"":info.get("startTime").toString();
        String endTime =   info.get("endTime")==null?"":info.get("endTime").toString();
        String userId =   info.get("userId")==null?"":info.get("userId").toString();
        String articleType =  info.get("articleType")==null?"":info.get("articleType").toString();
        String page =   info.get("pageNumber")==null?"":info.get("pageNumber").toString();
        String size =   info.get("pageSize")==null?"":info.get("pageSize").toString();
        String hour =   info.get("hour")==null?"":info.get("hour").toString();
        String state =   info.get("state")==null?"":info.get("state").toString();
        String articleTitle =   info.get("articleTitle")==null?"":info.get("articleTitle").toString();

        StringBuffer sql = new StringBuffer();
        List parameterList = new ArrayList();

        sql.append(" 	SELECT a.article_id articleId,	  ");
        sql.append(" 	a.article_type_id articleTypeId,	  ");
        sql.append(" 	c.article_type_name articleTypeName,	  ");
        sql.append(" 	case a.article_title when '' then a.article_title_e else a.article_title  end articleTitle,	  ");
        sql.append(" 	case a.article_Keyword when  '' then a.article_Keyword_e else a.article_Keyword  end articleKeyword,	  ");
        sql.append(" 	case a.source when '' then a.publication_date else a.source end  source,	  ");
        sql.append(" 	case when a.create_time  is null then a.paper_create_time else a.create_time end  createTime,	  ");
        sql.append(" 	case a.author when '' then a.author_e else a.author end  author,	  ");
//        sql.append(" 	a.article_keyword articleKeyword,	  ");
//        sql.append(" 	a.author author,	  ");
//        sql.append(" 	a.create_time createTime,	  ");
        sql.append(" 	case a.content_excerpt when '' then a.content_excerpt_e else a.content_excerpt end  contentExcerpt,	  ");
//        sql.append(" 	a.content_excerpt contentExcerpt,	  ");
//        sql.append(" 	a.content_excerpt_e contentExcerptE ,	  ");
        sql.append(" 	DATE_FORMAT(a.update_time,'%Y-%m-%d %H:%i:%S') updateTime,	  ");
        sql.append(" 	case a.details_txt when '' then a.pdf_path else a.details_txt end  detailsTxt,	  ");

//        sql.append(" 	a.details_txt detailsTxt,	  ");
//        sql.append(" 	CHAR_LENGTH( a.details_txt) charNum,	  ");
        sql.append(" 	b.statistics_type statisticsType,	  ");
//        sql.append(" 	a.source source,	  ");
//        sql.append(" 	SUM(b.count_num) num	  ");
        sql.append(" 	SUM((CASE WHEN b.statistics_type=1 THEN b.count_num ELSE 0 END)) num1,	  ");
        sql.append(" 	SUM((CASE WHEN b.statistics_type=2 THEN b.count_num ELSE 0 END)) num2,	  ");
        sql.append(" 	SUM((CASE WHEN b.statistics_type=3 THEN b.count_num ELSE 0 END)) num3 	  ");
        sql.append(" 	FROM article a , statistics_info b,article_type c	  ");
        sql.append(" 	WHERE a.article_id = b.article_id and a.article_type_id = c.article_type_id	  ");
        sql.append(" AND c.del_type = 0 and c.issue=1  ");

        sql.append(" AND b.dispose_time BETWEEN ? AND ? ");
        parameterList.add(startTime);
        parameterList.add(endTime);

        if(statisticsType!=null&&!"".equals(statisticsType)){
            sql.append(" 	AND b.statistics_type =	?  ");
            parameterList.add(statisticsType);
        }

        if(userId!=null&&!"".equals(userId)){
            sql.append("  and b.user_id = ?  	 ");
            parameterList.add(userId);
        }

        if(articleTitle!=null&&!"".equals(articleTitle)){
            sql.append("  and a.article_title like ?  	 ");
            parameterList.add("%"+articleTitle+"%");
        }

        if(state!=null&&!"".equals(state)){
            sql.append("  and a.state = ?  	 ");
            parameterList.add(state);
        }
        if(articleType!=null&&!"".equals(articleType)){
            sql.append("  and b.article_type = ?  	 ");
            parameterList.add(articleType);
        }

       /* if(hour!=null&&!"".equals(hour)){
            sql.append("  and DATE_FORMAT (b.dispose_time,'%k') = ?  	 ");
            parameterList.add(hour);
        }*/
        sql.append(" 	GROUP BY a.article_id,b.statistics_type	  ");


        Number number =  jdbcTemplate.queryForObject("select count(1) from ("+sql.toString()+") c",parameterList.toArray(),Long.class);

        parameterList.add((Integer.valueOf(page)-1)*Integer.valueOf(size));
        parameterList.add(Integer.valueOf(size));
        sql.append("  	LIMIT ?, ? 	 ");

        List<Map<String,Object>> obj = jdbcTemplate.queryForList(sql.toString(),parameterList.toArray());
        for (Map m:obj ) {
            byte[] bytts = (byte[]) m.get("detailsTxt");
            if(bytts!=null){
                String detailsTxt = new String(bytts,"utf-8");
                m.put("charNum",detailsTxt.length());
                m.put("detailsTxt",detailsTxt);
            }else{
                m.put("charNum",0);
                m.put("detailsTxt","");
            }
        }

        Map map = new HashMap();
        map.put("result",obj);
        map.put("total",number.longValue());

        return map;
    }
}

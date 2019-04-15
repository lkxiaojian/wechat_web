package com.kingweather.we_chat.dao.iml;

import com.kingweather.we_chat.dao.ExcleDownloadDao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Description: wechat_web1
 */
@Repository
public class ExcleDownloadDaoIml implements ExcleDownloadDao {
    @Resource
    private JdbcTemplate jdbcTemplate;

    @Override
    public List<Map<String, Object>> selArticle(Map<String, Object> info) throws Exception {
        String page =   info.get("pageNumber")==null?"1":info.get("pageNumber").toString();
        String size =   info.get("pageSize")==null?"":info.get("pageSize").toString();
        String startTime =   info.get("startTime")==null?"":info.get("startTime").toString();
        String endTime =   info.get("endTime")==null?"":info.get("endTime").toString();
        String articleTypeId =   info.get("articleTypeId")==null?"":info.get("articleTypeId").toString();
        String state =   info.get("state")==null?"":info.get("state").toString();
        String articleTitle =   info.get("articleTitle")==null?"":info.get("articleTitle").toString();
        String articleTeyword =   info.get("articleTeyword")==null?"":info.get("articleTeyword").toString();

        StringBuffer sql = new StringBuffer();
        List parameterList = new ArrayList();

        sql.append("  	select 	 ");
        sql.append("  	a.`article_id`,	 ");
        sql.append("  	a.`article_type_id`,	 ");
        sql.append("  	c.`article_type_name`,	 ");
        sql.append("  	a.`article_title`,	 ");
        sql.append("  	a.`article_keyword`,	 ");
        sql.append("  	a.`author`,	 ");
        sql.append("  	a.`update_time`,	 ");
        sql.append("  	a.`create_time`,	 ");
        sql.append("  	a.`source`,	 ");
        sql.append("  	a.`share_count`,	 ");
        sql.append("  	a.`collect_count`,	 ");
        sql.append("  	a.`collect_initcount`,	 ");
        sql.append("  	a.`share_initcount`,	 ");
        sql.append("  	a.`content_type`,	 ");
        sql.append("  	a.`content_crawl`,	 ");
        sql.append("  	a.`content_manual`,	 ");
        sql.append("  	a.`content_readcount`,	 ");
        sql.append("  	a.`content_excerpt`,	 ");
        sql.append("  	a.`image_path`,	 ");
//        sql.append("  	a.`state` ,	 ");
        sql.append("  	case when a.`state`=1 then '论文' else  '文章' end state,	 ");
        sql.append("  	a.`details_txt`,	 ");
        sql.append("  	a.`details_div`,	 ");
        sql.append("  	a.`details_path`,	 ");
        sql.append("  	case when a.`check_type`=1 then '已删除' else  '未删除' end del_type,	 ");
        sql.append("  	a.`content_text`,	 ");
        sql.append("  	a.`word_count`,	 ");
        sql.append("  	a.`posting_name`,	 ");
        sql.append("  	a.`article_title_e`,	 ");
        sql.append("  	a.`content_excerpt_e`,	 ");
        sql.append("  	a.`pdf_path`,	 ");
        sql.append("  	a.`article_keyword_e`,	 ");
        sql.append("  	a.`author_e`,	 ");
        sql.append("  	a.`reference`,	 ");
        sql.append("  	a.`site_number`,	 ");
        sql.append("  	a.`publication_date`,	 ");
        sql.append("  	a.`article_score`,	 ");
        sql.append("  	a.`paper_create_time`,	 ");
        sql.append("  	case when a.`check_type`=0 then '未审核' else  '审核通过' end check_type	 ");
        sql.append("  	from article a,article_type c	 ");
        sql.append(" 	WHERE a.article_type_id = c.article_type_id	  ");
        sql.append(" AND c.del_type = 0 and a.del_type != 1 ");

        if(startTime!=null&&!"".equals(startTime)){
            sql.append("  and a.create_time > ?  	 ");
            parameterList.add(startTime);
        }
        if(endTime!=null&&!"".equals(endTime)){
            sql.append("  and a.create_time < ?  	 ");
            parameterList.add(endTime);
        }
        if(articleTitle!=null&&!"".equals(articleTitle)){
            sql.append("  and a.article_title like ?  	 ");
            parameterList.add("%"+articleTitle+"%");
        }
        if(articleTeyword!=null&&!"".equals(articleTeyword)){
            sql.append("  and a.article_teyword like ?  	 ");
            parameterList.add("%"+articleTeyword+"%");
        }

        if(state!=null&&!"".equals(state)){
            sql.append("  and a.state = ?  	 ");
            parameterList.add(state);
        }
        if(articleTypeId!=null&&!"".equals(articleTypeId)){
            sql.append("  and a.article_type_id = ?  	 ");
            parameterList.add(articleTypeId);
        }


        parameterList.add((Integer.valueOf(page)-1)*Integer.valueOf(size));
        parameterList.add(Integer.valueOf(size));
        sql.append("  	LIMIT ?, ? 	 ");

        List<Map<String,Object>> obj = jdbcTemplate.queryForList(sql.toString(),parameterList.toArray());
        return obj;
    }

    @Override
    public List<Map<String, Object>> selArticleTmp(Map<String, Object> info) throws Exception {
        String page =   info.get("pageNumber")==null?"1":info.get("pageNumber").toString();
        String size =   info.get("pageSize")==null?"":info.get("pageSize").toString();
        String startTime =   info.get("startTime")==null?"":info.get("startTime").toString();
        String endTime =   info.get("endTime")==null?"":info.get("endTime").toString();
        String articleTypeId =   info.get("articleTypeId")==null?"":info.get("articleTypeId").toString();
        String state =   info.get("state")==null?"":info.get("state").toString();
        String articleTitle =   info.get("articleTitle")==null?"":info.get("articleTitle").toString();
        String articleTeyword =   info.get("articleTeyword")==null?"":info.get("articleTeyword").toString();

        StringBuffer sql = new StringBuffer();
        List parameterList = new ArrayList();

        sql.append("  	select	 ");
        sql.append("  	a.`article_id`,	 ");
        sql.append("  	a.`article_type_id`,	 ");
        sql.append("  	c.`article_type_name`,	 ");
        sql.append("  	a.`article_title`,	 ");
        sql.append("  	a.`article_keyword`,	 ");
        sql.append("  	a.`author`,	 ");
        sql.append("  	a.`update_time`,	 ");
        sql.append("  	a.`create_time`,	 ");
        sql.append("  	a.`source`,	 ");
        sql.append("  	a.`content_excerpt`,	 ");
        sql.append("  	a.`image_path`,	 ");
        sql.append("  	a.`details_txt`,	 ");
        sql.append("  	a.`details_div`,	 ");
        sql.append("  	a.`details_size`,	 ");
        sql.append("  	case when a.`status`=1 then '论文' else  '文章' end state,	 ");
//        sql.append("  	a.`state`,	 ");
//        sql.append("  	a.`check_type`,	 ");
        sql.append("  	case when a.`check_type`=0 then '未审核' else  '审核通过' end check_type,	 ");
        sql.append("  	a.`article_score`,	 ");
        sql.append("  	case when a.`check_type`=1 then '已删除' else  '未删除' end del_type,	 ");
//        sql.append("  	a.`del_type`,	 ");
        sql.append("  	a.`simhash`	 ");
        sql.append("  	from article_tmp a,article_type c	 ");
        sql.append(" 	WHERE a.article_type_id = c.article_type_id	  ");
        sql.append(" AND c.del_type = 0 and a.del_type != 1 ");

        if(startTime!=null&&!"".equals(startTime)){
            sql.append("  and a.create_time > ?  	 ");
            parameterList.add(startTime);
        }
        if(endTime!=null&&!"".equals(endTime)){
            sql.append("  and a.create_time < ?  	 ");
            parameterList.add(endTime);
        }
        if(articleTitle!=null&&!"".equals(articleTitle)){
            sql.append("  and a.article_title like ?  	 ");
            parameterList.add("%"+articleTitle+"%");
        }

        if(state!=null&&!"".equals(state)){
            sql.append("  and a.state = ?  	 ");
            parameterList.add(state);
        }
        if(articleTypeId!=null&&!"".equals(articleTypeId)){
            sql.append("  and a.article_type_id = ?  	 ");
            parameterList.add(articleTypeId);
        }
        if(articleTeyword!=null&&!"".equals(articleTeyword)){
            sql.append("  and a.article_teyword like ?  	 ");
            parameterList.add("%"+articleTeyword+"%");
        }
        parameterList.add((Integer.valueOf(page)-1)*Integer.valueOf(size));
        parameterList.add(Integer.valueOf(size));
        sql.append("  	LIMIT ?, ? 	 ");

        List<Map<String,Object>> obj = jdbcTemplate.queryForList(sql.toString(),parameterList.toArray());
        return obj;
    }

    @Override
    public List<Map<String, Object>> selAcademicPaper(Map<String, Object> info) throws Exception {
        String page =   info.get("pageNumber")==null?"1":info.get("pageNumber").toString();
        String size =   info.get("pageSize")==null?"":info.get("pageSize").toString();
        String startTime =   info.get("startTime")==null?"":info.get("startTime").toString();
        String endTime =   info.get("endTime")==null?"":info.get("endTime").toString();
        String articleTitle =   info.get("articleTitle")==null?"":info.get("articleTitle").toString();
        String articleTeyword =   info.get("articleTeyword")==null?"":info.get("articleTeyword").toString();
        String postingName =   info.get("postingName")==null?"":info.get("postingName").toString();
        String seachKeyword =   info.get("seachKeyword")==null?"":info.get("seachKeyword").toString();

        StringBuffer sql = new StringBuffer();
        List parameterList = new ArrayList();

        sql.append("  	select 	 ");
        sql.append("  	a.`article_id`,	 ");
        sql.append("  	a.`article_title`,	 ");
        sql.append("  	a.`article_keyword`,	 ");
        sql.append("  	a.`author`,	 ");
        sql.append("  	a.`update_time`,	 ");
        sql.append("  	a.`create_time`,	 ");
        sql.append("  	a.`source`,	 ");
        sql.append("  	a.`content_type`,	 ");
        sql.append("  	a.`content_excerpt`,	 ");
        sql.append("  	a.`image_path`,	 ");
        sql.append("  	a.`article_type_id`,	 ");
//        sql.append("  	a.`state`,	 ");
        sql.append("  	case when a.`status`=1 then '论文' else  '文章' end state,	 ");
        sql.append("  	a.`posting_name`,	 ");
        sql.append("  	a.`article_title_e`,	 ");
        sql.append("  	a.`word_count`,	 ");
        sql.append("  	a.`content_excerpt_e`,	 ");
        sql.append("  	a.`pdf_path`,	 ");
        sql.append("  	a.`article_keyword_e`,	 ");
        sql.append("  	a.`author_e`,	 ");
        sql.append("  	a.`reference`,	 ");
        sql.append("  	a.`site_number`,	 ");
        sql.append("  	a.`seach_keyword`,	 ");
        sql.append("  	a.`publication_date`,	 ");
        sql.append("  	case when a.`check_type`=0 then '未审核' else  '审核通过' end check_type,	 ");
        sql.append("  	a.`article_score`,	 ");
        sql.append("  	case when a.`del_type`=1 then '已删除' else  '未删除' end del_type	 ");
        sql.append("  	from academic_paper a,article_type c	 ");
        sql.append(" 	WHERE a.article_type_id = c.article_type_id	  ");
        sql.append(" AND c.del_type = 0 and a.del_type != 1 ");

        if(startTime!=null&&!"".equals(startTime)){
            sql.append("  and a.create_time > ?  	 ");
            parameterList.add(startTime);
        }
        if(endTime!=null&&!"".equals(endTime)){
            sql.append("  and a.create_time < ?  	 ");
            parameterList.add(endTime);
        }
        if(articleTitle!=null&&!"".equals(articleTitle)){
            sql.append("  and a.article_title like ?  	 ");
            parameterList.add("%"+articleTitle+"%");
        }
        if(articleTeyword!=null&&!"".equals(articleTeyword)){
            sql.append("  and a.article_teyword like ?  	 ");
            parameterList.add("%"+articleTeyword+"%");
        }
        if(postingName!=null&&!"".equals(postingName)){
            sql.append("  and a.posting_Name = ?  	 ");
            parameterList.add(postingName);
        }
        if(seachKeyword!=null&&!"".equals(seachKeyword)){
            sql.append("  and a.seach_keyword = ?  	 ");
            parameterList.add(seachKeyword);
        }
        parameterList.add((Integer.valueOf(page)-1)*Integer.valueOf(size));
        parameterList.add(Integer.valueOf(size));
        sql.append("  	LIMIT ?, ? 	 ");

        List<Map<String,Object>> obj = jdbcTemplate.queryForList(sql.toString(),parameterList.toArray());
        return obj;
    }
}

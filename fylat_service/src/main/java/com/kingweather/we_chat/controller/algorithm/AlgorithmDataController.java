package com.kingweather.we_chat.controller.algorithm;

import com.alibaba.fastjson.JSON;
import com.kingweather.common.controller.BaseController;
import com.kingweather.common.util.DateUtil;
import com.kingweather.fylat_service.controller.other.DataManageController;
import com.kingweather.system.manager.domain.Log;
import com.kingweather.we_chat.bean.ArticleTmp;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.ObjectUtils;
import org.apache.commons.lang.time.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
public class AlgorithmDataController extends BaseController {

    @Resource
    private JdbcTemplate jdbcTemplate;

    @Value("${upload.pafpath}")
    private String pafpath;
    Logger log = LoggerFactory.getLogger(DataManageController.class);

    @RequestMapping(value = "/algorithm/wxdata", method = RequestMethod.POST)
    public int collectingAndShare(@RequestBody Map<String, Object> data) {
        String article_id = data.get("article_id").toString();
        log.info("微信文章id----->"+article_id);
        String exitArticle = "SELECT count(*) as count  from zz_wechat.article_tmp where article_id=?";
        Map<String, Object> exitArticleMap =null;
        try {
            exitArticleMap = jdbcTemplate.queryForMap(exitArticle, new Object[]{
                    article_id
            });
        }catch (Exception e){

        }
        if (exitArticleMap != null && exitArticleMap.get("count") != null && Integer.parseInt(exitArticleMap.get("count").toString()) != 0) {
            return 2;
        }


        List<String> typeNameList = (List<String>) data.get("type_name");
        List<String> typeList = (List<String>) data.get("type_id");
        List<String> articleKeywordList = (List<String>) data.get("article_keywords");
        String currentTime = DateUtil.getCurrentTimeString();


        Object author = data.get("author");
        Object source = data.get("source");
        if (author == null) {
            author = "";
        }
        if (source == null) {
            source = "";
        }

        String type_id = "";
        String typeName = "";
        String articleKeyword = "";
        String parent_id = "";
        if (typeList != null) {
            if (typeList.size() == 1) {
                parent_id = "-2";
                type_id = typeList.get(0);
            } else {
                parent_id = typeList.get(typeList.size() - 2);
                type_id = typeList.get(typeList.size() - 1);
            }

        } else {
            return 1;
        }

        for (int i = 0; i < typeNameList.size(); i++) {
            typeName = typeName + typeNameList.get(i).toString() + ",";
        }
        for (int i = 0; i < articleKeywordList.size(); i++) {
            articleKeyword = articleKeyword + articleKeywordList.get(i).toString() + ",";
        }
        if (typeName.length() > 1) {
            typeName = typeName.substring(0, typeName.length() - 1);
        }

        if (articleKeyword.length() > 1) {
            articleKeyword = articleKeyword.substring(0, articleKeyword.length() - 1);
        }


        //查询关联表中是否存在
        Map<String, Object> parentIdMap = null;
        try {
            String sql = "select parent_id,type,keep_type_id from zz_wechat.change_article_type where article_type_id=? ORDER BY update_time DESC LIMIT 0,1";
            parentIdMap = jdbcTemplate.queryForMap(sql, new Object[]{
                    type_id
            });
        } catch (Exception e) {

        }
        if (parentIdMap != null && parentIdMap.get("parent_id") != null) {
            if (Integer.parseInt(parentIdMap.get("type").toString()) == 0) {
                type_id = parentIdMap.get("keep_type_id").toString();
            }
            parent_id = parentIdMap.get("parent_id").toString();
        }


        //根据typeid查询是否存在id
        String countTypeSql = "select count(*) as  count from zz_wechat.article_type_tmp where article_type_id=?";
        Map<String, Object> map = null;
        try {
            map = jdbcTemplate.queryForMap(countTypeSql, new Object[]{
                    type_id
            });
        } catch (Exception e) {

        }


        //插入新的类型
        if (map != null && map.get("count") != null && Integer.parseInt(map.get("count").toString()) == 0
                && !type_id.isEmpty() && !typeName.isEmpty() && !articleKeyword.isEmpty()) {


            String insertTypeSql = "insert into zz_wechat.article_type_tmp (article_type_id,article_type_name,article_type_keyword,create_time,parentid,del_type,status,article_type_name_old,article_type_keyword_old,type_state,issue,parentid_tmp) values " +
                    "(?,?,?,date_format(?,'%Y-%m-%d %H:%i:%s'),?,?,?,?,?,?,?,?)";
            int update = jdbcTemplate.update(insertTypeSql, new Object[]{
                    type_id,
                    typeName,
                    articleKeyword,
                    currentTime,
                    parent_id,
                    0,
                    0,
                    typeName,
                    articleKeyword,
                    0,
                    0,
                    parent_id
            });

        }
        String create_time = data.get("create_time").toString();
        String insertArticleSql = "insert into zz_wechat.article_tmp (article_id,article_type_id,article_title,article_keyword,author,source,content_excerpt,details_txt" +
                ",details_div,details_size,create_time,update_time,status,check_type,article_score,del_type) values(?,?,?,?,?,?,?,?,?,?,date_format(?,'%Y-%m-%d %H:%i:%s'),date_format(?,'%Y-%m-%d %H:%i:%s'),?,?,?,?)";
        String div = data.get("article_div").toString();

        div = div.replaceAll("data-src=", "src=");
        div = div.replaceAll("webp", "png");
        div = div.substring(0, div.indexOf("<script nonce"));
        div = div + "</div>";
        System.out.print(div);
        try {
            int update = jdbcTemplate.update(insertArticleSql, new Object[]{
                    data.get("article_id").toString(),
                    type_id,
                    data.get("article_title").toString(),
                    articleKeyword,
                    author.toString(),
                    source.toString(),
                    data.get("summary").toString(),
                    data.get("article_txt").toString(),
                    div,
                    data.get("article_txt").toString().length(),
                    create_time,
                    currentTime,
                    0,
                    0,
                    0,
                    0
            });

        } catch (Exception e) {
            System.out.print(e);

        }

        return 0;


    }


    @RequestMapping(value = "/weatherData/fileUpload", method = RequestMethod.POST)
    public int copyFiletoDB(@RequestParam(value = "file", required = false) MultipartFile file, HttpServletRequest req) {


        try {
            String path = "";

            String article_id = req.getParameter("article_id");
            String exitArticle = "SELECT count(*) as count  from zz_wechat.academic_paper where article_id=?";
            Map<String, Object> exitArticleMap =null;
            try {
            exitArticleMap = jdbcTemplate.queryForMap(exitArticle, new Object[]{
                        article_id
                });
            }catch (Exception e){

            }


            if (exitArticleMap != null && exitArticleMap.get("count") != null && Integer.parseInt(exitArticleMap.get("count").toString()) != 0) {
                return 2;
            }


            if (file != null) {
//                String fileName = file.getOriginalFilename();
                String fileName = req.getParameter("FILE_NAME");
                fileName = new String(fileName.getBytes("UTF-8"), "UTF-8");
                log.info("pdf-----fileName--->" + fileName);
                String savePath = DateUtil.formatDateTime(new Date(), "yyyy-MM-dd") + "_" + (int) (Math.random() * 100) + "/" + fileName;
                path = pafpath + savePath;
                File f = new File(path);
                FileUtils.copyInputStreamToFile(file.getInputStream(), f);
                path = path.replaceAll("data/file/", "resources/");
            }

//            else {
//                path = req.getParameter("pdf_path");
//            }


            String create_time = req.getParameter("create_time");
            String author = req.getParameter("author").replaceAll("/r/n", "").replaceAll("/r", "").replaceAll("/n", "");
            String FILE_PATH = req.getParameter("FILE_PATH");
            String seach_keyword = req.getParameter("seach_keyword");
            String reference = req.getParameter("reference");
            String article_title = req.getParameter("article_title");
            String article_keyword = req.getParameter("article_keyword").replaceAll("/r/n", "").replaceAll("/r", "").replaceAll("/n", "");
            ;
            String posting_name = req.getParameter("posting_name");
            String article_keyword_e = req.getParameter("article_keyword_e");
            String publication_date = req.getParameter("publication_date");
            String author_e = req.getParameter("author_e");
            String content_excerpt = req.getParameter("content_excerpt");
            String site_number = req.getParameter("site_number");
            String article_title_e = req.getParameter("article_title_e");
            String content_excerpt_e = req.getParameter("content_excerpt_e");
            String source = req.getParameter("source");
            if (article_keyword != null && article_keyword.length() > 1) {
                article_keyword = article_keyword.substring(0, article_keyword.length() - 1);
            }
            if (article_keyword_e != null && article_keyword_e.length() > 1) {
                article_keyword_e = article_keyword_e.substring(0, article_keyword_e.length() - 1);
            }


            String json = req.getParameter("json");
            ArticleTmp article_tmp = JSON.parseObject(json, ArticleTmp.class);

            String currentTime = DateUtil.getCurrentTimeString();

            List<String> typeList = article_tmp.getResult().get(0).getType_id();
            List<String> articleKeywordList = article_tmp.getResult().get(0).getArticle_keywords();
            List<String> typeNameList = article_tmp.getResult().get(0).getType_name();


            String type_id = "";
            String typeName = "";
            String articleKeyword = "";
            String parent_id = "";
            if (typeList != null) {
                if (typeList.size() == 1) {
                    parent_id = "100";
                    type_id = typeList.get(0);
                } else {
                    parent_id = typeList.get(typeList.size() - 2);
                    type_id = typeList.get(typeList.size() - 1);
                }
            } else {
                return 1;
            }


            for (int i = 0; i < typeNameList.size(); i++) {
                typeName = typeName + typeNameList.get(i).toString() + ",";
            }
            for (int i = 0; i < articleKeywordList.size(); i++) {
                articleKeyword = articleKeyword + articleKeywordList.get(i).toString() + ",";
            }
            if (typeName.length() > 1) {
                typeName = typeName.substring(0, typeName.length() - 1);
            }

            if (articleKeyword.length() > 1) {
                articleKeyword = articleKeyword.substring(0, articleKeyword.length() - 1);
            }

            //查询关联表中是否存在
            Map<String, Object> parentIdMap = null;
            try {
                String sql = "select parent_id,type,keep_type_id from zz_wechat.change_article_type where article_type_id=? ORDER BY update_time DESC LIMIT 0,1";
                parentIdMap = jdbcTemplate.queryForMap(sql, new Object[]{
                        type_id
                });
            } catch (Exception e) {

            }

            if (parentIdMap != null && parentIdMap.get("parent_id") != null) {
                if (Integer.parseInt(parentIdMap.get("type").toString()) == 0) {
                    type_id = parentIdMap.get("keep_type_id").toString();
                }
                parent_id = parentIdMap.get("parent_id").toString();
            }

            //根据posting_name
            String countPostSql = "select count(*) as  count from zz_wechat.posting_paper where posting_name=?";
            Map<String, Object> countPostmap = null;
            try {
                countPostmap = jdbcTemplate.queryForMap(countPostSql, new Object[]{
                        posting_name
                });
            } catch (Exception e) {

            }

            if (countPostmap != null && countPostmap.get("count") != null && Integer.parseInt(countPostmap.get("count").toString()) == 0) {
                //插入posting_name

                String insertPostingSql = "insert into zz_wechat.posting_paper (posting_name) values (?)";
                jdbcTemplate.update(insertPostingSql, new Object[]{
                        posting_name
                });
            }

            //根据typeid查询是否存在id
            String countTypeSql = "select count(*) as  count from zz_wechat.article_type_tmp where article_type_id=?";
            Map<String, Object> map = null;
            try {
                map = jdbcTemplate.queryForMap(countTypeSql, new Object[]{
                        type_id
                });
            } catch (Exception e) {

            }

            //插入新的类型
            if (map != null && map.get("count") != null && Integer.parseInt(map.get("count").toString()) == 0
                    && !type_id.isEmpty() && !typeName.isEmpty() && !articleKeyword.isEmpty()) {
                String insertTypeSql = "insert into zz_wechat.article_type_tmp (article_type_id,article_type_name,article_type_keyword,create_time,parentid,del_type,status,article_type_name_old,article_type_keyword_old,type_state,issue) values " +
                        "(?,?,?,date_format(?,'%Y-%m-%d %H:%i:%s'),?,?,?,?,?,?,?)";
                int update = jdbcTemplate.update(insertTypeSql, new Object[]{
                        type_id,
                        typeName,
                        articleKeyword,
                        currentTime,
                        parent_id,
                        0,
                        0,
                        typeName,
                        articleKeyword,
                        1,
                        0
                });

            }


            String insertPaperSql = "insert into zz_wechat.academic_paper (article_id,article_title,article_keyword," +
                    "author,update_time,create_time,source" +
                    ",content_excerpt,article_type_id,status,posting_name" +
                    ",article_title_e,content_excerpt_e," +
                    "pdf_path,article_keyword_e,author_e,reference,site_number,seach_keyword,publication_date,check_type,article_score,del_type) " +
                    "values(?,?,?,?,date_format(?,'%Y-%m-%d %H:%i:%s'),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
            int update = jdbcTemplate.update(insertPaperSql, new Object[]{
                    article_id,
                    article_title,
                    article_keyword.substring(0, article_keyword.length() - 1),
                    author,
                    currentTime,
                    create_time,
                    source,
                    content_excerpt,
                    type_id,
                    "0",
                    posting_name,
                    article_title_e,
                    content_excerpt_e,
                    path,
                    article_keyword_e.substring(0, article_keyword.length() - 1),
                    author_e,
                    reference,
                    site_number,
                    seach_keyword,
                    publication_date,
                    0,
                    0,
                    0
            });


        } catch (Exception e) {
            e.printStackTrace();
        }

        return 0;

    }
}

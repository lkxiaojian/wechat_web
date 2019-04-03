package com.kingweather.we_chat.dao.iml;

import com.alibaba.fastjson.JSONObject;
import com.kingweather.common.jdbc.JdbcUtil;
import com.kingweather.common.util.DateUtil;
import com.kingweather.common.util.Page;
import com.kingweather.we_chat.constants.HttpRequest;
import com.kingweather.we_chat.constants.UuidUtils;
import com.kingweather.we_chat.dao.ArticleDao;
import org.mozilla.universalchardet.UniversalDetector;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import javax.rmi.CORBA.Util;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.*;

@Repository
public class ArticleDaoIml implements ArticleDao {
    @Resource
    private JdbcTemplate jdbcTemplate;
    @Resource
    private JdbcUtil jdbc;

    @Value("${urlPath}")
    private String urlPath;

    private int pageSize = 10;

    @Override
    public Map<String, Object> getArticleTrait(String articleId, int page) {
        if (articleId == null || articleId.isEmpty()) {
            return getErrorMap();
        }


        String sql = "SELECT a.article_type_id,b.article_id,a.iamge_back,b.article_keyword,b.article_title,b.content_excerpt ,b.content_type,b.state,b.pdf_path " +
                "FROM zz_wechat.article_type a,zz_wechat.article b where b.del_type !=1 and a.del_type !=1 and a.article_type_id=b.article_type_id and b.article_type_id=? ORDER BY b.create_time DESC LIMIT ?,?";


        List<Map<String, Object>> mapList = jdbcTemplate.queryForList(sql, new Object[]{
                articleId,
//                Integer.parseInt(articleId),
                page * pageSize,
                pageSize

        });

        HashMap<String, Object> map = new HashMap<>();
//        if(mapList.size()>0){
//            Map map1 = mapList.get(0);
        int articleNum = jdbcTemplate.queryForObject("SELECT COUNT(article_id) FROM article WHERE article_type_id = ? AND  state=0  ", Integer.class, new Object[]{articleId});
        int paperNum = jdbcTemplate.queryForObject("SELECT COUNT(article_id) FROM article WHERE article_type_id = ? AND  state=1  ", Integer.class, new Object[]{articleId});

        map.put("articleNum", articleNum);
        map.put("paperCount", paperNum);
//        }else{
//            map.put("articleNum", 0);
//            map.put("paperCount", 0);
//        }
        map.put("code", 0);
        map.put("message", "查询成功");
        map.put("result", mapList);
        return map;
    }

    @Override
    public Map<String, Object> getArticleMessage(String articleId, String wechatid) {
        if (articleId == null || articleId.isEmpty() || wechatid == null || wechatid.isEmpty()) {
            return getErrorMap();
        }


        //获取文章的详细信息 content_manual
//        String messageSql = "SELECT a.article_id,a.article_type_id,a.article_title,a.article_keyword,a.author,a.source,DATE_ADD(a.create_time,INTERVAL -13 hour) as create_time,(a.share_count+a.collect_initcount) as share_count,(a.collect_count+a.collect_initcount) as collect_count ,a.content_type,a.content_crawl,a.details_div,b.iamge_back ,a.content_manual FROM  article a,article_type b where a.article_type_id=b.article_type_id AND a.article_id=? ";

        String messageSql = "SELECT a.article_id,a.article_type_id,a.article_title,a.article_keyword,a.author,a.source,a.create_time,(a.share_count+a.collect_initcount) as share_count,(a.collect_count+a.collect_initcount) as collect_count ,a.content_type,a.content_crawl,a.details_div,b.iamge_back ,a.content_manual,a.content_type FROM  article a,article_type b where a.article_type_id=b.article_type_id AND a.article_id=? ";

        Map<String, Object> messageMap = jdbcTemplate.queryForMap(messageSql, new Object[]{articleId});

        Object details_div = messageMap.get("details_div");
        Object content_manual = messageMap.get("content_manual");
        byte[] bytes = (byte[]) details_div;
        byte[] content_manualbytes = (byte[]) content_manual;
        try {
            if (details_div != null) {
//                messageMap.put("details_div", new String(bytes, "UTF-8"));
                messageMap.put("details_div", guessEncoding(bytes));

            }

            if (content_manual != null) {
//                messageMap.put("content_manual", new String(content_manualbytes, "UTF-8"));
                messageMap.put("content_manual", guessEncoding(content_manualbytes));
            }

            String sql = "INSERT INTO statistics_info (article_id,statistics_type,dispose_time,user_id,article_type,count_num) VALUES(?,1,NOW(),?,?,1)";
            jdbcTemplate.update(sql, new Object[]{
                    articleId,
                    wechatid,
                    messageMap.get("article_type_id").toString()
            });

        } catch (Exception e) {
            e.printStackTrace();
        }


        //获取相关文章（后期改成随机三遍文章）
        String moreSql = "SELECT a.create_time ,a.article_id,a.article_title,a.article_keyword,a.image_path FROM  article a, article_type b where a.article_type_id=b.article_type_id AND a.article_id !=? AND a.article_type_id=? and a.state=0 ORDER BY a.create_time DESC limit 0,3";
        List<Map<String, Object>> mapList = jdbcTemplate.queryForList(moreSql, new Object[]{articleId,
                messageMap.get("article_type_id").toString()
        });


        //插入数据，代表文章已读

        String selectSql = "select user_id from zz_wechat.sys_user where wechat_id='" + wechatid + "'";
        Map<String, Object> userMap = jdbcTemplate.queryForMap(selectSql);
        Object objId = userMap.get("user_id");
        if (objId == null) {
            return getErrorMap();
        }
        String user_id = objId.toString();

        //查询该文章是否已经收藏
        String cSql = "select count(*) as count from user_article where article_id=? and user_id =? and type_id=?";
        Map<String, Object> cMap = jdbcTemplate.queryForMap(cSql, new Object[]{
                articleId,
                user_id,
                3
        });
        if (cMap != null && cMap.get("count") != null && Integer.parseInt(cMap.get("count").toString()) > 0) {
            messageMap.put("collect_state", 0);
        } else {
            messageMap.put("collect_state", 1);
        }


        boolean isFlag = false;

        try {
            String selectSqlFora = "select count(*) as count from zz_wechat.user_article where type_id=? and article_id=? and article_type_id=? AND user_id=?";
            Map<String, Object> forMap = jdbcTemplate.queryForMap(selectSqlFora, new Object[]{
                    1,
                    articleId,
                    messageMap.get("article_type_id").toString(),
                    user_id
            });
            if (forMap.get("count") == null || "0".equals(forMap.get("count").toString())) {
                isFlag = true;
            }


        } catch (Exception e) {
            isFlag = true;
        }
        if (isFlag) {
            String insertSql = "INSERT INTO zz_wechat.user_article (type_id,article_id,user_id,article_type_id) values (?,?,?,?)";
            jdbcTemplate.update(insertSql, new Object[]{
                    1,
                    articleId,
                    user_id,
                    messageMap.get("article_type_id").toString()

            });
        }


        messageMap.put("related", mapList);
        HashMap<String, Object> map = new HashMap<>();
        map.put("code", 0);
        map.put("message", "查询成功");
        map.put("result", messageMap);

        return map;
    }

    @Override
    public Map<String, Object> getPaperMessage(String articleId, String wechatid) {
        if (articleId == null || articleId.isEmpty() || wechatid == null || wechatid.isEmpty()) {
            return getErrorMap();
        }


        //获取文章的详细信息 content_manual
//        String messageSql = "SELECT a.article_id,a.article_type_id,a.article_title,a.article_keyword,a.author,a.source,DATE_ADD(a.create_time,INTERVAL -13 hour) as create_time,(a.share_count+a.collect_initcount) as share_count,(a.collect_count+a.collect_initcount) as collect_count ,a.content_type,a.content_crawl,a.details_div,b.iamge_back ,a.content_manual FROM  article a,article_type b where a.article_type_id=b.article_type_id AND a.article_id=? ";

        String messageSql = "SELECT a.article_id,a.article_type_id,a.article_title, a.article_title_e,a.content_excerpt,a.content_excerpt_e,a.posting_name,"
                + "a.article_keyword,a.article_keyword_e,a.author,a.author_e,a.source,"
                + "(a.share_count+a.collect_initcount) AS share_count,"
                + "(a.collect_count+a.collect_initcount) AS collect_count ,"
                + "a.publication_date,a.content_type,a.content_crawl,b.iamge_back ,a.content_type ,a.pdf_path,a.reference ,a.paper_create_time,a.site_number "
                + "FROM  article a,article_type b WHERE a.article_type_id=b.article_type_id AND a.article_id=?";
        Map<String, Object> messageMap = jdbcTemplate.queryForMap(messageSql, new Object[]{articleId});

        String sql = "INSERT INTO statistics_info (article_id,statistics_type,dispose_time,user_id,article_type,count_num) VALUES(?,1,NOW(),?,?,1)";
        jdbcTemplate.update(sql, new Object[]{
                articleId,
                wechatid,
                messageMap.get("article_type_id").toString()
        });


        //获取相关文章（后期改成随机三遍文章）
        String moreSql = "SELECT a.create_time ,a.article_id,a.article_title,a.article_keyword,(SELECT c.image_path FROM posting_paper c WHERE c.posting_name=a.posting_name) image_path \n" +
                " FROM  article a, article_type b where a.article_type_id=b.article_type_id AND a.article_id !=? AND a.article_type_id=? and a.state=1  ORDER BY a.create_time DESC limit 0,3";
        List<Map<String, Object>> mapList = jdbcTemplate.queryForList(moreSql, new Object[]{articleId,
                messageMap.get("article_type_id").toString()
        });


        //插入数据，代表文章已读

        String selectSql = "select user_id from zz_wechat.sys_user where wechat_id='" + wechatid + "'";
        Map<String, Object> userMap = jdbcTemplate.queryForMap(selectSql);
        Object objId = userMap.get("user_id");
        if (objId == null) {
            return getErrorMap();
        }
        String user_id = objId.toString();

        //查询该文章是否已经收藏
        String cSql = "select count(*) as count from user_article where article_id=? and user_id =? and type_id=?";
        Map<String, Object> cMap = jdbcTemplate.queryForMap(cSql, new Object[]{
                articleId,
                user_id,
                3
        });
        if (cMap != null && cMap.get("count") != null && Integer.parseInt(cMap.get("count").toString()) > 0) {
            messageMap.put("collect_state", 0);
        } else {
            messageMap.put("collect_state", 1);
        }


        boolean isFlag = false;

        try {
            String selectSqlFora = "select count(*) as count from zz_wechat.user_article where type_id=? and article_id=? and article_type_id=? AND user_id=?";
            Map<String, Object> forMap = jdbcTemplate.queryForMap(selectSqlFora, new Object[]{
                    1,
                    articleId,
                    messageMap.get("article_type_id").toString(),
                    user_id
            });
            if (forMap.get("count") == null || "0".equals(forMap.get("count").toString())) {
                isFlag = true;
            }


        } catch (Exception e) {
            isFlag = true;
        }
        if (isFlag) {
            String insertSql = "INSERT INTO zz_wechat.user_article (type_id,article_id,user_id,article_type_id) values (?,?,?,?)";
            jdbcTemplate.update(insertSql, new Object[]{
                    1,
                    articleId,
                    user_id,
                    messageMap.get("article_type_id").toString()

            });
        }


        messageMap.put("related", mapList);
        HashMap<String, Object> map = new HashMap<>();
        map.put("code", 0);
        map.put("message", "查询成功");
        map.put("result", messageMap);

        return map;
    }

    /**
     * 文章的分享或者收藏
     *
     * @param data
     * @return
     */
    @Override
    public Map<String, Object> collectingAndShare(Map<String, Object> data) {
        Object wechat_id = data.get("wechat_id");
        if (wechat_id == null || "".equals(wechat_id)) {
            wechat_id = "1";
        }
        //分享 2 收藏 3
        Object type = data.get("type");
        Object article_id = data.get("article_id");
        Object article_type_id = data.get("article_type_id");

        if (wechat_id == null || type == null || article_id == null || article_type_id == null) {
            return getErrorMap();
        }

        String selectSql = "select user_id from zz_wechat.sys_user where wechat_id='" + wechat_id.toString() + "'";
        Map<String, Object> userMap = jdbcTemplate.queryForMap(selectSql);
        Object objId = userMap.get("user_id");
        if (objId == null) {
            return getErrorMap();
        }
        String user_id = objId.toString();

        Map<String, Object> cMap = new HashMap<>();
        String fild = "share_count";
        if ("2".equals(type.toString())) {
            fild = "share_count";
        } else if ("3".equals(type.toString())) {
            fild = "collect_count";


            //判断是否已经收藏

            //查询该文章是否已经收藏
            String cSql = "select count(*) as count from user_article where article_id=? and user_id =? and type_id=?";
            cMap = jdbcTemplate.queryForMap(cSql, new Object[]{
                    article_id.toString(),
                    user_id,
                    3
            });
            if (cMap != null && cMap.get("count") != null && Integer.parseInt(cMap.get("count").toString()) > 0) {
                String delSql = "DELETE from user_article where article_id=? and user_id =? and type_id=?";
                jdbcTemplate.update(delSql, new Object[]{
                        article_id.toString(),
                        user_id,
                        3

                });


            } else {

            }


        } else {
            return getErrorMap();
        }
        //更新文章 分享或者收藏数量
        String updataSql = "update zz_wechat.article set " + fild + "=" + fild + "+ 1  where article_id=?";
        int update = jdbcTemplate.update(updataSql, new Object[]{
                article_id
        });


        boolean isFlag = false;
        // 判断是否已经分享
        try {

            String selectSqlFora = "select count(*) as count from zz_wechat.user_article where type_id=? and article_id=? and article_type_id=? AND user_id=?";
            Map<String, Object> forMap = jdbcTemplate.queryForMap(selectSqlFora, new Object[]{
                    Integer.parseInt(type.toString()),
                    article_id.toString(),
                    Integer.parseInt(article_type_id.toString()),
                    user_id
            });
            if (forMap.get("count") == null || "0".equals(forMap.get("count").toString())) {
                isFlag = true;
                if (cMap != null && cMap.get("count") != null && Integer.parseInt(cMap.get("count").toString()) > 0) {
                    isFlag = false;
                }
            }
        } catch (Exception e) {
            isFlag = true;
        }

        if (isFlag) {
            //分享代表关注
            String insertSql = "INSERT INTO zz_wechat.user_article (type_id,article_id,user_id,article_type_id) values (?,?,?,?)";

            jdbcTemplate.update(insertSql, new Object[]{
                    Integer.parseInt(type.toString()),
                    article_id.toString(),
                    user_id,
                    Integer.parseInt(article_type_id.toString())

            });
        }

        HashMap<String, Object> map = new HashMap<>();
        map.put("code", 0);
        map.put("message", "成功！");

        return map;


    }

    @Override
    public Map<String, Object> getAllArticleType(String wechatid, int page) {
        if (wechatid == null || "".equals(wechatid)) {
            return getErrorMap();
        }

        //关注的数量
        int gzCount = 0;
        //总共的类型的数量
        int allCount = 0;
        //剩余数量
        int total = 0;
        String gzCountSql = "SELECT  count(*) as count from article_type a,user_articletype b ,sys_user c WHERE a.del_type !=? and a.article_type_id=b.article_type_id AND c.user_id=b.user_id AND c.wechat_id=?" +
                "AND a.parentid !=? " +
                "AND a.parentid !=? " +
                "AND a.parentid !=? " +
                "AND a.issue !=? ";
        Map<String, Object> gzCountMap = null;
        Map<String, Object> allCountMap = null;
        try {
            gzCountMap = jdbcTemplate.queryForMap(gzCountSql, new Object[]{
                    1,
                    wechatid,
                    100,
                    -1,
                    -2,
                    0
            });

        } catch (Exception e) {
        }

        if (gzCountMap != null && gzCountMap.get("count") != null) {
            gzCount = Integer.parseInt(gzCountMap.get("count").toString());
        }


        String allCountSql = "select count(*) as count from zz_wechat.article_type where del_type !=?  " +
                "AND parentid !=? " +
                "AND parentid !=? " +
                "AND parentid !=? " +
                "AND issue !=? ";
        try {
            allCountMap = jdbcTemplate.queryForMap(allCountSql, new Object[]{
                    1,
                    100,
                    -1,
                    -2,
                    0
            });

        } catch (Exception e) {
        }

        if (allCountMap != null && allCountMap.get("count") != null) {
            allCount = Integer.parseInt(allCountMap.get("count").toString());
        }

        String gzSql = "SELECT  a.article_type_name,a.article_type_id,a.article_type_keyword,a.iamge_icon,a.iamge_back  ,1 as type_id from article_type a,user_articletype b ,sys_user c WHERE a.del_type !=? and a.article_type_id=b.article_type_id AND c.user_id=b.user_id AND c.wechat_id=?" +
                "AND a.parentid !=? " +
                "AND a.parentid !=? " +
                "AND a.parentid !=? " +
                "AND a.issue !=? " +
                "ORDER BY a.create_time DESC LIMIT ?,?";
        List<Map<String, Object>> gzList = jdbcTemplate.queryForList(gzSql, new Object[]{
                1,
                wechatid,
                100,
                -1,
                -2,
                0,
                page * pageSize,
                pageSize
        });
        List<Map<String, Object>> nogzList = new ArrayList<>();
        if (gzList.size() == 0 || gzList.size() < 10) {
            int num = ((page + 1) * pageSize - gzCount) / pageSize;
            if (num < 0) {
                num = 0;
            }


            String selectSql = "select user_id from zz_wechat.sys_user where wechat_id='" + wechatid.toString() + "'";
            Map<String, Object> userMap = jdbcTemplate.queryForMap(selectSql);
            Object objId = userMap.get("user_id");
            if (objId == null) {
                return getErrorMap();
            }
            String user_id = objId.toString();

            String nogzSql = "SELECT  a.article_type_name,a.article_type_id,a.article_type_keyword,a.iamge_icon,a.iamge_back  ,2 as type_id \n" +
                    "from zz_wechat.article_type a ,zz_wechat.sys_user c WHERE " +
                    "a.article_type_id not in(SELECT article_type_id FROM zz_wechat.user_articletype WHERE user_id=?) AND c.wechat_id=?" +
                    " AND a.del_type !=? AND a.parentid !=? AND a.parentid !=? AND a.parentid !=? AND a.issue !=?"
                    + " ORDER BY a.create_time DESC LIMIT ?,?";
            ;
            nogzList = jdbcTemplate.queryForList(nogzSql, new Object[]{
                    user_id,
                    wechatid,
                    1,
                    100,
                    -1,
                    -2,
                    0,
                    num * pageSize,
                    pageSize
            });
            total = allCount - gzCount - (num + 1) * pageSize;
        } else {
            total = allCount - (page + 1) * pageSize;
        }
        List list = new ArrayList();
        list.addAll(nogzList);
        list.addAll(gzList);
        if (total < 0) {
            total = 0;
        }

        HashMap<String, Object> map = new HashMap<>();
        map.put("cdoe", 0);
        map.put("message", "查询成功");
        map.put("result", list);
        map.put("total", total);
        return map;
    }

    @Override
    public Map<String, Object> articleSearch(String wechatid, String message, int page) {
        if (wechatid == null || "".equals(wechatid) || message == null || "".equals(message)) {
            return getErrorMap();
        }
        int pageSize = 10;
        HashMap<String, Object> resultMap = new HashMap<>();

        String selectSql = "select user_id from zz_wechat.sys_user where wechat_id='" + wechatid.toString() + "'";
        Map<String, Object> userMap = jdbcTemplate.queryForMap(selectSql);
        Object objId = userMap.get("user_id");
        if (objId == null) {
            return getErrorMap();
        }

        if (message != null) {
            message = message.replaceAll(" ", "").trim();
        }
        String user_id = objId.toString();
        List list = new ArrayList();
        //关注的类型sql
        String gzSeachSql = "SELECT article_type_id,article_type_name,article_type_keyword ,create_time,iamge_icon,iamge_back ,1 as type_id from zz_wechat.article_type WHERE del_type !=1 and parentid !=100 AND  parentid !=-1 AND (binary article_type_name LIKE '%" +
                message +
                "%' or binary article_type_keyword  LIKE '%" +
                message +
                "%') AND article_type_id in (SELECT article_type_id FROM user_articletype WHERE user_id='" +
                user_id +
                "')";

        List<Map<String, Object>> gzMapList = jdbcTemplate.queryForList(gzSeachSql);

        String nogzSeachSql = "SELECT article_type_id,article_type_name,article_type_keyword ,create_time,iamge_icon,iamge_back ,2 as type_id from zz_wechat.article_type WHERE del_type !=1 and  parentid !=100 AND  parentid !=-1 AND (binary article_type_name LIKE '%" +
                message +
                "%' or article_type_keyword  LIKE '%" +
                message +
                "%') AND article_type_id not in (SELECT article_type_id FROM user_articletype WHERE user_id='" +
                user_id +
                "')";

        List<Map<String, Object>> nogzmapList = jdbcTemplate.queryForList(nogzSeachSql);
        list.addAll(gzMapList);
        list.addAll(nogzmapList);

        resultMap.put("articleType", list);
//        String gzArticleSqlCount = "SELECT COUNT(*) as count FROM zz_wechat.article WHERE del_type !=1 and  article_type_id in(SELECT article_type_id FROM user_articletype WHERE user_id='" +
//                user_id +
//                "' ) AND (BINARY article_title LIKE '%" +
//                message +
//                "%' OR BINARY article_keyword LIKE '%" +
//                message +
//                "%' OR BINARY author LIKE '%" +
//                message +
//                "%' OR BINARY source LIKE '%" +
//                message +
//                "%' OR BINARY content_crawl LIKE '%" +
//                message +
//                "%'" +
//                "OR BINARY content_manual LIKE '%" +
//                message +
//                "%' OR BINARY content_excerpt LIKE '%" +
//                message +
//                "%' "+
//                " OR binary posting_name LIKE '%" +
//                message +
//                "%' OR BINARY article_title_e LIKE '%" +
//                message +
//                "%'"+
//                " OR BINARY content_excerpt_e LIKE '%" +
//                message +
//                "%' OR BINARY article_keyword_e LIKE '%" +
//                message +
//                "%' "
//                +
//                " OR BINARY reference LIKE '%" +
//                message +
//                "%' OR BINARY site_number LIKE '%" +
//                message +
//                "%')"
//                ;
//
//        Map<String, Object> map = jdbcTemplate.queryForMap(gzArticleSqlCount);
//        Object objCount = map.get("count");
//        int count = 0;
//        if (objCount != null) {
//            count = Integer.parseInt(objCount.toString());
//        }


//        if (count > 0 && pageSize * page <= count || count < 10) {

        String gzArticleSql = "SELECT article_id,article_type_id,article_title,article_keyword,create_time,content_excerpt,state,content_type,article_title_e,content_excerpt_e,pdf_path,article_keyword_e,author_e,publication_date,paper_create_time " +
                "FROM zz_wechat.article WHERE del_type !=1 " +
//                    "and  article_type_id in(SELECT article_type_id FROM user_articletype WHERE user_id='" +
//                    user_id +
//                    "' ) " +
                "AND (BINARY article_title LIKE '%" +
                message +
                "%' OR BINARY article_keyword LIKE '%" +
                message +
                "%' OR BINARY author LIKE '%" +
                message +
                "%' OR BINARY source LIKE '%" +
                message +
                "%' OR BINARY content_crawl LIKE '%" +
                message +
                "%'" +
                "OR BINARY content_manual LIKE '%" +
                message +
                "%' OR BINARY content_excerpt LIKE '%" +
                message +
                "%'" +
                "OR BINARY posting_name LIKE '%" +
                message +
                "%' OR BINARY article_title_e LIKE '%" +
                message +
                "%'" +
                "OR BINARY content_excerpt_e LIKE '%" +
                message +
                "%' OR BINARY article_keyword_e LIKE '%" +
                message +
                "%'"
                +
                "OR BINARY reference LIKE '%" +
                message +
                "%' OR BINARY site_number LIKE '%" +
                message +
                "%'" +
                ") ORDER BY create_time desc LIMIT " +
                page * pageSize +
                "," +
                pageSize;

        List<Map<String, Object>> gzArticleList = jdbcTemplate.queryForList(gzArticleSql);

        if (gzArticleList == null) {
            gzArticleList = new ArrayList<>();
        }

        resultMap.put("loveArticle", gzArticleList);
//        }

        if (resultMap.get("loveArticle") == null) {

            gzArticleList = new ArrayList<>();
            resultMap.put("loveArticle", gzArticleList);
        }


//        if (count < 10 || pageSize * page > count) {
//            count = (pageSize * page - count) / pageSize;
//            if (count < 0) {
//                count = 0;
//            }


//            String nogzArticleSql = "SELECT article_id,article_type_id,article_title,article_keyword,create_time,content_excerpt FROM zz_wechat.article WHERE del_type !=1 and  article_type_id NOT in(SELECT article_type_id FROM user_articletype WHERE user_id='" +
//                    user_id +
//                    "' ) AND (BINARY article_title LIKE '%" +
//                    message +
//                    "%' OR BINARY article_keyword LIKE '%" +
//                    message +
//                    "%' OR BINARY author LIKE '%" +
//                    message +
//                    "%' OR BINARY source LIKE '%" +
//                    message +
//                    "%' OR BINARY content_crawl LIKE '%" +
//                    message +
//                    "%'" +
//                    " OR BINARY content_manual LIKE '%" +
//                    message +
//                    "%' OR BINARY content_excerpt LIKE '%" +
//                    message +
//                    "%')ORDER BY create_time DESC LIMIT " +
//                    page * pageSize +
//                    "," +
//                    pageSize;

//
//            String nogzArticleSql = "SELECT article_id,article_type_id,article_title,article_keyword,create_time,content_excerpt FROM zz_wechat.article WHERE del_type !=1 and  article_type_id in(SELECT article_type_id FROM user_articletype WHERE user_id='" +
//                    user_id +
//                    "' ) AND (BINARY article_title LIKE '%" +
//                    message +
//                    "%' OR BINARY article_keyword LIKE '%" +
//                    message +
//                    "%' OR BINARY author LIKE '%" +
//                    message +
//                    "%' OR BINARY source LIKE '%" +
//                    message +
//                    "%' OR BINARY content_crawl LIKE '%" +
//                    message +
//                    "%'" +
//                    "OR BINARY content_manual LIKE '%" +
//                    message +
//                    "%' OR BINARY content_excerpt LIKE '%" +
//                    message +
//                    "%'" +
//                    "OR BINARY posting_name LIKE '%" +
//                    message +
//                    "%' OR BINARY article_title_e LIKE '%" +
//                    message +
//                    "%'"+
//                    "OR BINARY content_excerpt_e LIKE '%" +
//                    message +
//                    "%' OR BINARY article_keyword_e LIKE '%" +
//                    message +
//                    "%'"
//                    +
//                    "OR BINARY reference LIKE '%" +
//                    message +
//                    "%' OR BINARY site_number LIKE '%" +
//                    message +
//                    "%'"+
//                    ") ORDER BY create_time desc LIMIT " +
//                    page * pageSize +
//                    "," +
//                    pageSize;
//            List<Map<String, Object>> nogzArticleList = jdbcTemplate.queryForList(nogzArticleSql);
//            if (nogzArticleList == null) {
//                nogzArticleList = new ArrayList<>();
//            }
//
//            resultMap.put("notLoveArticle", nogzArticleList);
//        }


        if (resultMap.get("notLoveArticle") == null) {
            gzArticleList = new ArrayList<>();
            resultMap.put("notLoveArticle", gzArticleList);
        }


        resultMap.put("code", 0);
        resultMap.put("message", "查询成功");

        return resultMap;
    }

    /**
     * 添加领域
     *
     * @param name
     * @param keyword
     * @return
     */
    @Override
    public boolean insertDomain(Object name, Object keyword, String path) {
        String doNameSql = "select count(*) as count from zz_wechat.article_type where article_type_name=? and parentid=?";
        Map<String, Object> countMap = jdbcTemplate.queryForMap(doNameSql, new Object[]{
                name.toString(),
                0
        });

        //没有查找到
        if (countMap == null || countMap.get("count") == null || "0".equals(countMap.get("count").toString())) {

            String key = "";
            if (keyword != null) {
                key = keyword.toString();
            }
            String sysTime = DateUtil.getCurrentTimeString();
            String insertSql = "insert into zz_wechat.article_type (article_type_id,article_type_name,article_type_keyword,create_time,iamge_icon,parentid,del_type,issue,type_state,domain_id) values(?,?,?,date_format(?,'%Y-%m-%d %H:%i:%s'),?,?,?,0,2,?)";


            String insertSqlTMp = "insert into zz_wechat.article_type_tmp (article_type_id,article_type_name,article_type_keyword,create_time,iamge_icon,parentid,del_type,issue,type_state,domain_id) values(?,?,?,date_format(?,'%Y-%m-%d %H:%i:%s'),?,?,?,0,2,?)";
            String uUid = UuidUtils.getUUid();

            int update = jdbcTemplate.update(insertSql, new Object[]{
                    uUid,
                    name.toString(),
                    key,
                    sysTime,
                    path,
                    100,
                    0,
                    uUid

            });

            int updateTmp = jdbcTemplate.update(insertSqlTMp, new Object[]{
                    uUid,
                    name.toString(),
                    key,
                    sysTime,
                    path,
                    100,
                    0,
                    uUid
            });
            if (update == 1) {
                return true;
            }
        }
        return false;
    }

    @Override
    public List<Map<String, Object>> getAllDomain() {
        String sql = "select article_type_id,article_type_name from zz_wechat.article_type where parentid='100' AND del_type !=1 ORDER BY create_time DESC";
        List<Map<String, Object>> maps = jdbcTemplate.queryForList(sql);
        return maps;
    }

    @Override
    public boolean insertArticleType(String name, String keyword, String artcicle_type_id, String num, String pathICon, String pathback) {


        String doNameSql = "select count(*) as count from zz_wechat.article_type where article_type_name=? and parentid=?";
        Map<String, Object> countMap = jdbcTemplate.queryForMap(doNameSql, new Object[]{
                name.toString(),
                artcicle_type_id
        });
        //没有查找到
        if (countMap == null || countMap.get("count") == null || "0".equals(countMap.get("count").toString())) {

            String sysTime = DateUtil.getCurrentTimeString();


            String fafterSql="SELECT T2.article_type_id \n" +
                    "FROM ( \n" +
                    "    SELECT \n" +
                    "        @r AS _article_type_id, \n" +
                    "        (SELECT @r := parentid FROM article_type WHERE article_type_id = _article_type_id) AS parentid, \n" +
                    "        @l := @l + 1 AS lvl \n" +
                    "    FROM \n" +
                    "        (SELECT @r := '" +
                    artcicle_type_id +
                    "', @l := 0) vars, \n" +
                    "        article_type h \n" +
                    "    WHERE @r <> 0) T1 \n" +
                    "JOIN article_type T2 \n" +
                    "ON T1._article_type_id = T2.article_type_id \n" +
                    "ORDER BY T1.lvl DESC \n";
            List<Map<String, Object>> maps = jdbcTemplate.queryForList(fafterSql);

            String domian_id="";
            if(maps.size()==1){
                domian_id=maps.get(0).get("article_type_id").toString();
            }else if (maps.size()>1){
                domian_id=maps.get(1).get("article_type_id").toString();
            }


            //插入
            String sql = "insert into zz_wechat.article_type (article_type_name,article_type_keyword,create_time,iamge_icon,parentid,iamge_back,del_type,issue,domain_id,type_state) values (?,?,date_format(?,'%Y-%m-%d %H:%i:%s'),?,?,?,?,1,?,2)";
            int update = jdbcTemplate.update(sql, new Object[]{
                    name,
                    keyword,
                    sysTime,
                    pathICon,
                    artcicle_type_id,
                    pathback,
                    0,
                    domian_id
            });
            if (update == 1) {
                return true;
            }

        }
        return false;
    }

    @Override
    public List<Map<String, Object>> getAllAricleType(String article_type_id) {
        String sql = "";

        int parentid = 0;
        if (article_type_id == null || "".equals(article_type_id)) {
            sql = "select article_type_id,article_type_name from zz_wechat.article_type where parentid !=? AND parentid !=? AND del_type !=? ";
        } else {
            sql = "select article_type_id,article_type_name from zz_wechat.article_type where parentid=? AND parentid !=? AND del_type !=? ";
            parentid = Integer.parseInt(article_type_id);
        }

        List<Map<String, Object>> maps = jdbcTemplate.queryForList(sql, new Object[]{
                parentid,
                -1,
                1
        });


        return maps;
    }

    /**
     * 添加文章
     *
     * @param data
     * @return
     */
    @Override
    public Map<String, Object> addArticle(Map<String, Object> data) {
        Map<String, Object> map = new HashMap<>();
        Object article_type_id = data.get("article_type_id");
        Object author = data.get("author");
        Object source = data.get("source");
        Object article_title = data.get("article_title");
        Object article_keyword = data.get("article_keyword");
        Object content_excerpt = data.get("content_excerpt");
        Object share_initcount = data.get("share_initcount");
        Object collect_count = data.get("collect_count");
        Object content_manual = data.get("content_manual");
        Object dateTIme = data.get("dateTIme");


        Object word_count = data.get("word_count");
        Object details_txt = data.get("details_txt");
        if (content_manual == null || article_type_id == null ||
                source == null || article_title == null
                || article_keyword == null || share_initcount == null || collect_count == null
                || content_excerpt == null || word_count == null || details_txt == null) {
            return getErrorMap();
        }
        content_manual = content_manual.toString().replaceAll("webp", "png");
        try {
            if (author == null) {
                author = "";
            }
            String article_id = UuidUtils.getUUid();
            String create_time = DateUtil.getCurrentTimeString();
            String sql = "insert into  zz_wechat.article (article_id,article_type_id,article_title,article_keyword,author,source,create_time,share_initcount,collect_initcount,content_type,content_manual,word_count,details_txt,update_time,content_excerpt,share_count,collect_count,del_type,state) " +
                    "values(?,?,?,?,?,?,date_format(?,'%Y-%m-%d %H:%i:%s'),?,?,?,?,?,?,date_format(?,'%Y-%m-%d %H:%i:%s'),?,?,?,?,?)";

            int update = jdbcTemplate.update(sql, new Object[]{

                    article_id,
                    article_type_id.toString(),
                    article_title.toString(),
                    article_keyword.toString(),
                    author.toString(),
                    source.toString(),
                    dateTIme,
                    Integer.parseInt(share_initcount.toString()),
                    Integer.parseInt(collect_count.toString()),
                    0,
                    content_manual.toString(),
                    Integer.parseInt(word_count.toString()),
                    details_txt.toString(),
                    create_time,
                    content_excerpt,
                    0,
                    0,
                    0,
                    0


            });

        } catch (Exception e) {
            e.printStackTrace();
            return getErrorMapService();
        }

        map.put("code", 0);
        map.put("message", "增加成功");
        return map;
    }

    /**
     * 查询文章
     *
     * @param conditions
     * @return
     */
    @Override
    public Map<String, Object> getAllArticle(Map<String, Object> conditions) {


        Map<String, Object> map = new LinkedHashMap<String, Object>();
        Integer startNum = Integer.valueOf(conditions.get("startNum").toString());
        Integer pageSize = Integer.valueOf(conditions.get("pageSize").toString());
        Object message = conditions.get("message");
        String countSql = "select count(*) from zz_wechat.article where del_type !='1' ";
        if (message != null && !"".equals(message.toString())) {
            countSql = countSql + " and (article_title like '%" + message.toString() + "%' or author like '%" + message.toString() + "%' or source like '%" + message.toString() + "%' )";
        }
        String sql = "select article_id,article_type_id,article_title,author,source, word_count,article_keyword, create_time from zz_wechat.article where del_type !='1' ";
        if (message != null && !"".equals(message.toString())) {
            sql = sql + " and (article_title like '%" + message.toString() + "%' or author like '%" + message.toString() + "%' or source like '%" + message.toString() + "%' )";
        }
        sql = sql + " ORDER BY update_time desc";

        Page<Map<String, Object>> page = jdbc.queryForPage(startNum, pageSize, countSql, sql, new Object[]{});
        map.put("code", 0);
        map.put("message", "查询成功");
        map.put("total", page.getTotalCount());
        map.put("result", page.getResult());
        return map;
    }

    /**
     * 根据文章的id 删除
     *
     * @param article_id
     * @return
     */
    @Override
    public Map<String, Object> deletedById(String article_id, String type) {
        if (article_id == null || "".equals(article_id)) {
            return getErrorMap();

        }
        String idList = "";
        String[] split = article_id.split(",");

        for (int i = 0; i < split.length; i++) {
            idList = idList + "'" + split[i].toString() + "',";
        }
        idList = idList.substring(0, idList.length() - 1);

        if (type != null && "1".equals(type)) {
            String sql = "DELETE from zz_wechat.article  where article_id in(" + idList + ")";
            jdbcTemplate.update(sql);

        } else if ("2".equals(type)) {
            // 临时表论文
            String sql = "DELETE from zz_wechat.academic_paper  where article_id in(" + idList + ")";
            jdbcTemplate.update(sql);

        } else if ("3".equals(type)) {
            // 临时表文章
            String sql = "DELETE from zz_wechat.article_tmp  where article_id in(" + idList + ")";
            jdbcTemplate.update(sql);
        } else {
            String sql = "UPDATE  zz_wechat.article set del_type=1 where article_id in(" + idList + ")";
            jdbcTemplate.update(sql);

        }
        Map<String, Object> map = new HashMap<>();
        map.put("code", 0);
        map.put("message", "删除成功");

        return map;
    }

    /**
     * 添加搜索关键字
     *
     * @param data
     * @return
     */
    @Override
    public Map<String, Object> addKeyword(Map<String, Object> data) {
        Object keywords = data.get("keyword");
        Object parent_id = data.get("parent_id");
        if (keywords == null || "".equals(keywords) || parent_id == null || "".equals(parent_id)) {
            return getErrorMap();

        }

        String create_time = DateUtil.getCurrentTimeString();
        String sql = "insert into zz_wechat.keyword (id,keyword_name,create_time,last_time,del_type,parent_id) values(?,?,date_format(?,'%Y-%m-%d %H:%i:%s'),date_format(?,'%Y-%m-%d'),?,?)";

        int successCount = 0;

        String countSql = "select count(*) as count,id  from zz_wechat.keyword where keyword_name=?";

        String uUid = UuidUtils.getUUid();
        Map<String, Object> map = jdbcTemplate.queryForMap(countSql, new Object[]{keywords.toString()});
        if (map != null && map.get("count") != null && "1".equals(map.get("count").toString())) {

            String upsql = "update zz_wechat.keyword set keyword_name=?,update_time=date_format(?,'%Y-%m-%d %H:%i:%s'), parent_id=?,del_type=? where id=?";

            int update = jdbcTemplate.update(upsql, new Object[]{
                    keywords.toString(),
                    create_time,
                    parent_id,
                    0,
                    map.get("id")

            });

            String url = urlPath + "article/updateKeyword";
            try {
                HttpRequest.sendGet(url, "id=" + map.get("id") + "&keyword_name=" + URLEncoder.encode(keywords.toString(), "utf-8").trim() + "&parent_id=" + parent_id + "&del_type=0");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        } else {
            jdbcTemplate.update(sql, new Object[]{
                    uUid,
                    keywords.toString(),
                    create_time,
                    "2017-01-01",
                    0,
                    parent_id.toString()
            });
            successCount = successCount + 1;
        }

        if (successCount > 0) {
            String url = urlPath + "article/addKeyword";
            try {
                HttpRequest.sendGet(url, "param=" + URLEncoder.encode(keywords.toString(), "utf-8").trim() + "&uUid=" + uUid + "&parent_id=" + parent_id);
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }

        }

        Map<String, Object> remap = new HashMap<>();

        remap.put("code", 0);
        remap.put("message", "添加成功");


        return remap;
    }

    /**
     * 文章详情
     *
     * @param article_id
     * @return
     */
    @Override
    public Map<String, Object> getwebmessage(String article_id) {

        //获取文章的详细信息 content_manual
        String messageSql = "SELECT a.article_id,a.article_type_id,a.article_title,a.article_keyword,a.author,a.source,a.create_time ,a.collect_initcount,a.share_initcount ,a.collect_initcount ,a.content_type,a.content_crawl,a.details_div,a.content_manual,a.content_excerpt,b.article_type_id,b.article_type_name ," +
                " a.posting_name,a.article_title_e,a.content_excerpt_e,a.pdf_path,a.article_keyword_e,a.author_e,a.reference,a.site_number,a.publication_date,a.article_score,a.paper_create_time ,a.word_count,DATE_ADD( a.update_time,INTERVAL -8 HOUR) AS update_time   FROM  article a ,article_type b where a.article_type_id=b.article_type_id AND article_id=? ";
        Map<String, Object> messageMap = jdbcTemplate.queryForMap(messageSql, new Object[]{article_id});
        Object details_div = messageMap.get("details_div");

        Object content_manual = messageMap.get("content_manual");
        byte[] details_divbytes = (byte[]) details_div;

        byte[] content_manualbytes = (byte[]) content_manual;
        try {
            if (details_div != null) {
//                messageMap.put("details_div", new String(details_divbytes, "UTF-8"));
                messageMap.put("details_div", guessEncoding(details_divbytes));
            }
            if (content_manualbytes != null) {
//                messageMap.put("content_manual", new String(content_manualbytes, "UTF-8"));

                messageMap.put("content_manual", guessEncoding(content_manualbytes));

            }

        } catch (Exception e) {
            e.printStackTrace();
            return getErrorMapService();
        }

        Map<String, Object> map = new HashMap<>();
        map.put("code", 0);
        map.put("message", "查询成功");
        map.put("result", messageMap);


        return map;
    }

    /**
     * 更新文章
     *
     * @param data
     * @return
     */
    @Override
    public Map<String, Object> updateArticle(Map<String, Object> data) {
        Map<String, Object> map = new HashMap<>();
        Object article_type_id = data.get("article_type_id");
        Object author = data.get("author");
        Object source = data.get("source");
        Object article_title = data.get("article_title");
        Object article_keyword = data.get("article_keyword");
        Object content_excerpt = data.get("content_excerpt");
        Object share_initcount = data.get("share_initcount");
        Object collect_count = data.get("collect_count");
        Object content_manual = data.get("content_manual");
        Object dateTIme = data.get("dateTIme");
        Object article_id = data.get("article_id");


        Object word_count = data.get("word_count");
        Object details_txt = data.get("details_txt");


        Object article_title_e = data.get("article_title_e");
        Object content_excerpt_e = data.get("content_excerpt_e");
        Object article_keyword_e = data.get("article_keyword_e");
        Object author_e = data.get("author_e");
        Object reference = data.get("reference");
        Object site_number = data.get("site_number");
        Object publication_date = data.get("publication_date");

        if (article_id == null) {
            return getErrorMap();
        }
        if (content_manual != null) {
            content_manual = content_manual.toString().replaceAll("webp", "png");
        }

        try {
            if (author == null) {
                author = "";
            }

            String create_time = DateUtil.getCurrentTimeString();
            String sql = "UPDATE zz_wechat.article SET article_type_id=?,article_title=?,article_keyword=?," +
                    "author=?,source=?,create_time=date_format(?,'%Y-%m-%d %H:%i:%s')," +
                    "share_initcount=?,collect_initcount=?,content_type=?,content_manual=?,word_count=?," +
                    "details_txt=?,update_time=date_format(?,'%Y-%m-%d %H:%i:%s'),content_excerpt=?" +
                    ",article_title_e=?,content_excerpt_e=?,article_keyword_e=?,author_e=?" +
                    ",reference=?,site_number=?,publication_date=?" +
                    "  WHERE article_id=? ";
            int update = jdbcTemplate.update(sql, new Object[]{

                    article_type_id,
                    article_title.toString(),
                    article_keyword.toString(),
                    author.toString(),
                    source.toString(),
                    dateTIme,
                    Integer.parseInt(share_initcount.toString()),
                    Integer.parseInt(collect_count.toString()),
                    0,
                    content_manual.toString(),
                    Integer.parseInt(word_count.toString()),
                    details_txt.toString(),
                    create_time,
                    content_excerpt,
                    article_title_e,
                    content_excerpt_e,
                    article_keyword_e,
                    author_e,
                    reference,
                    site_number,
                    publication_date,
                    article_id.toString()


            });

        } catch (Exception e) {
            e.printStackTrace();
            return getErrorMapService();
        }

        map.put("code", 0);
        map.put("message", "更新成功");
        return map;
    }

    /**
     * @param map
     * @return
     */

    @Override
    public Map<String, Object> keywordQuery(Map<String, Object> map) {


        Map<String, Object> resultmap = new LinkedHashMap<String, Object>();
        Integer startNum = Integer.valueOf(map.get("startNum").toString());
        Integer pageSize = Integer.valueOf(map.get("pageSize").toString());
        Object message = map.get("message");
        Object parent_id = map.get("parent_id");
        Object type = map.get("type");


        String countSql = "select count(*) from zz_wechat.keyword a,zz_wechat.article_type b where a.del_type !='1' and a.parent_id=b.article_type_id ";

        if (type != null && "1".equals(type.toString())) {
            countSql = "select count(*) from zz_wechat.keyword a,zz_wechat.article_type b where a.del_type ='1' and a.parent_id=b.article_type_id ";

        }
        if (message != null && !"".equals(message.toString())) {
            countSql = countSql + " and a.keyword_name like '%" + message.toString() + "%' ";
        }
        String sql = "select a.id,a.keyword_name,a.parent_id,b.article_type_name from zz_wechat.keyword a,zz_wechat.article_type b where  a.del_type !='1' and a.parent_id=b.article_type_id ";

        if (type != null && "1".equals(type.toString())) {
            sql = "select a.id,a.keyword_name,a.parent_id,b.article_type_name from zz_wechat.keyword a,zz_wechat.article_type b where  a.del_type ='1' and a.parent_id=b.article_type_id ";

        }
        if (message != null && !"".equals(message.toString())) {
            sql = sql + " and a.keyword_name like '%" + message.toString() + "%' ";
        }

        if (parent_id != null && !"".equals(parent_id.toString())) {
            countSql = countSql + " and a.parent_id='" + parent_id + "'";
            sql = sql + " and a.parent_id='" + parent_id + "'";
        }
        sql = sql + " ORDER BY a.update_time desc";

        Page<Map<String, Object>> page = jdbc.queryForPage(startNum, pageSize, countSql, sql, new Object[]{});
        resultmap.put("code", 0);
        resultmap.put("message", "查询成功");
        resultmap.put("total", page.getTotalCount());
        resultmap.put("result", page.getResult());
        return resultmap;
    }

    @Override
    public Map<String, Object> updateKeyword(String id, String keyword_name, String parent_id) {

        if ("".equals(id) || id == null || "".equals(keyword_name) || keyword_name == null || parent_id == null || "".equals(parent_id)) {
            return getErrorMap();
        }

        String create_time = DateUtil.getCurrentTimeString();
        String sql = "update zz_wechat.keyword set keyword_name=?,update_time=date_format(?,'%Y-%m-%d %H:%i:%s'), parent_id=? where id=?";

        int update = jdbcTemplate.update(sql, new Object[]{
                keyword_name,
                create_time,
                parent_id,
                id

        });

        String url = urlPath + "article/updateKeyword";
        try {
            HttpRequest.sendGet(url, "id=" + id + "&keyword_name=" + URLEncoder.encode(keyword_name.toString(), "utf-8").trim() + "&parent_id=" + parent_id);
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        HashMap<String, Object> map = new HashMap<>();
        if (update == 1) {
            map.put("code", 0);
            map.put("message", "更新成功！");
            return map;
        }

        return getErrorMap();
    }

    /**
     * 关键词的删除
     *
     * @param id
     * @return
     */
    @Override
    public Map<String, Object> delKeyword(String id, String type) {
        if ("".equals(id) || id == null) {
            return getErrorMap();
        }
        HashMap<String, Object> map = new HashMap<>();
        if (type != null && "1".equals(type)) {

            String idList = "";
            String[] split = id.split(",");

            for (int i = 0; i < split.length; i++) {
                idList = idList + "'" + split[i].toString() + "',";
            }
            idList = idList.substring(0, idList.length() - 1);
            String sql = "DELETE FROM zz_wechat.keyword where id in(" + idList + ")";
            jdbcTemplate.update(sql);
            map.put("code", 0);
            map.put("message", "删除成功！");

        } else {
            String sql = "UPDATE  zz_wechat.keyword set del_type=? where id=?";
            int update = jdbcTemplate.update(sql, new Object[]{
                    1,
                    id
            });
            String url = urlPath + "article/delKeyword";
            HttpRequest.sendGet(url, "id=" + id);
            if (update == 1) {
                map.put("code", 0);
                map.put("message", "删除成功！");
            } else {
                return getErrorMap();
            }
        }
        return map;
    }

    /**
     * 领域分页和条件查询
     *
     * @param conditions
     * @return
     */
    @Override
    public Map<String, Object> getConditionDomain(Map<String, Object> conditions) {
        try {
            Map<String, Object> map = new LinkedHashMap<String, Object>();
            Integer startNum = Integer.valueOf(conditions.get("startNum").toString());
            Integer pageSize = Integer.valueOf(conditions.get("pageSize").toString());
            Object message = conditions.get("message");


            String countSql = "select count(*) from zz_wechat.article_type where parentid='100' and del_type !='1' ";
            if (message != null && !"".equals(message.toString())) {
                countSql = countSql + "  and article_type_name like '%" + message.toString() + "%' ";
            }
            String sql = "select article_type_id,article_type_name,article_type_keyword,create_time,iamge_icon, iamge_back,parentid from zz_wechat.article_type where parentid='100' and del_type !='1' ";
            if (message != null && !"".equals(message.toString())) {
                sql = sql + " and article_type_name like '%" + message.toString() + "%'  ";
            }
            sql = sql + " ORDER BY create_time desc";

            Page<Map<String, Object>> page = jdbc.queryForPage(startNum, pageSize, countSql, sql, new Object[]{});
            map.put("code", 0);
            map.put("message", "查询成功");
            map.put("total", page.getTotalCount());
            map.put("result", page.getResult());
            return map;

        } catch (Exception e) {
            return getErrorMap();
        }


    }

    /**
     * 根据id删除 领域
     *
     * @param id
     * @return
     */
    @Override
    public Map<String, Object> delDomainById(String id) {
        //删除相当于改变del_type 的值 不是真正的删除
        String sql = "update zz_wechat.article_type set del_type=1 where article_type_id='" + id + "'";
        jdbcTemplate.update(sql);
        //根据父级id 查询所有的子级的节点的id
   /*     String idlist = "SELECT article_type_id FROM\n" +
                "  (\n" +
                "    SELECT * FROM article_type ORDER BY parentid, article_type_id DESC\n" +
                "  ) realname_sorted,\n" +
                "  (SELECT @pv :=" +
                id +
                ") initialisation\n" +
                "  WHERE (FIND_IN_SET(parentid,@pv)>0 And @pv := concat(@pv, ',', article_type_id))";*/

/*        String idlist="SELECT  \n" +
                "    b.article_type_id  \n" +
                "FROM  \n" +
                "    article_type AS a,  \n" +
                "    article_type AS b  \n" +
                "WHERE  \n" +
                "    a.parentid= b.parentid  \n" +
                "AND(a.article_type_id= '" +id+
                "') ";


        List<Map<String, Object>> idlistMaps = jdbcTemplate.queryForList(idlist);


        String idString = "";

        if (idlistMaps != null && idlistMaps.size() > 0) {
            for (int i = 0; i < idlistMaps.size(); i++) {
                idString = idString + "'" + idlistMaps.get(i).get("article_type_id").toString() + "',";
            }
            if (idString.length() > 0) {
                idString = idString.substring(0, idString.length() - 1);
            }*/

             String  idString =getChildList(id,"0");

            //改变 子节点 del_type 的值
            String ChildSql = "update zz_wechat.article_type set del_type=1 where article_type_id in( " + idString + " )";
            jdbcTemplate.update(ChildSql);

            //改变 文章的 del_type 的值
            String ArticleSql = "update zz_wechat.article set del_type=1 where article_type_id in( " + idString + " )";
            jdbcTemplate.update(ArticleSql);

//        }
        HashMap<String, Object> map = new HashMap<>();
        map.put("code", 0);
        map.put("message", "删除成功");
        return map;
    }

    /**
     * @param data
     * @return
     */
    @Override
    public Map<String, Object> updateDomainById(Map<String, Object> data) {
        Object article_type_id = data.get("article_type_id");
        Object article_type_name = data.get("article_type_name");
        Object article_type_keyword = data.get("article_type_keyword");
        if (article_type_id == null || article_type_name == null || article_type_keyword == null) {
            return getErrorMap();
        }

        String sql = "update zz_wechat.article_type set article_type_name=?  ,article_type_keyword=? where article_type_id=?";


        String sqlTmp = "update zz_wechat.article_type_tmp set article_type_name=?  ,article_type_keyword=? where article_type_id=?";

        int update = jdbcTemplate.update(sql, new Object[]{
                article_type_name.toString(),
                article_type_keyword.toString(),
                article_type_id.toString()
        });
        jdbcTemplate.update(sqlTmp, new Object[]{
                article_type_name.toString(),
                article_type_keyword.toString(),
                article_type_id.toString()
        });
        if (update == 1) {
            HashMap<String, Object> map = new HashMap<>();
            map.put("code", 0);
            map.put("message", "更新成功！");
            return map;
        }

        return getErrorMap();
    }

    /**
     * 关键词 文章论文恢复
     *
     * @param id
     * @param type
     * @return
     */
    @Override
    public Map<String, Object> recoverKeyword(String id, String type) {
        if (id == null) {
            return getErrorMap();
        }

        String idList = "";
        String[] split = id.split(",");

        for (int i = 0; i < split.length; i++) {
            idList = idList + "'" + split[i].toString() + "',";
        }
        idList = idList.substring(0, idList.length() - 1);
        String sql = "update zz_wechat.keyword set del_type=0 where id in(" + idList + ")";
        if ("1".equals(type)) {
            sql = "update zz_wechat.article set del_type=0 where article_id in(" + idList + ")";
        } else if ("2".equals(type)) {
            sql = "update zz_wechat.article_tmp set del_type=0 where article_id in(" + idList + ")";
        } else if ("3".equals(type)) {
            sql = "update zz_wechat.academic_paper set del_type=0 where article_id in(" + idList + ")";
        } else if ("4".equals(type)) {
            String sqltmp = "update zz_wechat.article_type_tmp set del_type=0 where article_type_id in(" + idList + ")";
            sql = "update zz_wechat.article_type set del_type=0 where article_type_id in(" + idList + ")";
            jdbcTemplate.update(sqltmp);
        }

        jdbcTemplate.update(sql);
        HashMap<String, Object> map = new HashMap<>();
        map.put("code", 0);
        map.put("message", "恢复成功！");
        return map;
    }

    //获取领域以及id
    @Override
    public Map<String, Object> selectarticleType() {
        //获取一级领域
        String doMainSql = "select article_type_id as id,article_type_name as name ,article_type_keyword as keyword,type_state from zz_wechat.article_type where del_type!=? and issue=? AND parentid=?  AND parentid !=?";
        List<Map<String, Object>> doMainList = jdbcTemplate.queryForList(doMainSql, new Object[]{
                1,
                1,
                100,
                -1
        });
        //获取全部类型不包含领域
        String typeSql="SELECT article_type_id,article_type_name,article_type_keyword,type_state,domain_id,parentid  \n" +
                " from zz_wechat.article_type where del_type!=1 and issue=1 and (type_state=0 or type_state=1) AND parentid!=100  AND parentid !=-1 ORDER BY create_time DESC";

        List<Map<String, Object>> typeList = jdbcTemplate.queryForList(typeSql);
        for (int i=0;i<doMainList.size();i++){
            List<Map<String, Object>> dataMap=new ArrayList<>();
            Map<String, Object> doMainMap = doMainList.get(i);
            for (int j=0;j<typeList.size();j++){
                Map<String, Object> typeMap = typeList.get(j);
                if(doMainMap.get("id").toString().equals(typeMap.get("domain_id").toString())){
                    dataMap.add(typeMap);
                }
            }
            doMainMap.put("item",dataMap);
        }

        HashMap<String, Object> map = new HashMap<>();
        map.put("code", 0);
        map.put("message", "请求成功！");
        map.put("result", doMainList);
        return map;
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

    /**
     * 文档格式转换
     *
     * @param bytes
     * @return
     */

    private String guessEncoding(byte[] bytes) {
        UniversalDetector detector = new UniversalDetector(null);
        detector.handleData(bytes, 0, bytes.length);
        detector.dataEnd();
        String encoding = detector.getDetectedCharset();
        detector.reset();
        if (null != encoding) {
            try {
                return new String(bytes, encoding);
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        } else {
            return new String(bytes);
        }

        return "";
    }


    /**
     * 根据id获取所有下级id
     * @param id
     * @return
     */
    private String getChildList(String id,String type) {
        String idString = "'" +
                id +
                "',";
        String table=" zz_wechat.article_type";
        if("1".equals(type)){
            table=" zz_wechat.article_type_tmp";
        }

        String sql="select article_type_id from "+table+" where parentid=?";
        List<Map<String, Object>> result=new ArrayList<>();

        List<Map<String, Object>> maps = jdbcTemplate.queryForList(sql, new Object[]{
                id
        });
        result.addAll(maps);
        for (Map<String, Object> map:maps){

            if(map.get("article_type_id")!=null){
                List<Map<String, Object>> article_id = getlist(sql, map.get("article_type_id").toString());
                result.addAll(article_id);
            }

        }
        for (Map<String, Object> map:result){
            idString=idString+"'"+map.get("article_type_id")+"',";
        }
        return idString.substring(0,idString.length()-1);
    }


    private List<Map<String, Object>> getlist(String sql,String id ){
        List<Map<String, Object>> result=new ArrayList<>();

        List<Map<String, Object>> maps = jdbcTemplate.queryForList(sql, new Object[]{
                id
        });
        result.addAll(maps);
        for (Map<String, Object> map:maps){

            if(map.get("article_type_id")!=null){
                result.addAll(  getlist(sql,map.get("article_type_id").toString()));
            }

        }
        return result;
    }

}

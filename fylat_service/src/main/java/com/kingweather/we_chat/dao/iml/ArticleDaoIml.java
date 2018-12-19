package com.kingweather.we_chat.dao.iml;

import com.kingweather.common.jdbc.JdbcUtil;
import com.kingweather.common.util.DateUtil;
import com.kingweather.common.util.Page;
import com.kingweather.we_chat.constants.UuidUtils;
import com.kingweather.we_chat.dao.ArticleDao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.util.*;

@Repository
public class ArticleDaoIml implements ArticleDao {
    @Resource
    private JdbcTemplate jdbcTemplate;
    @Resource
    private JdbcUtil jdbc;

    @Override
    public Map<String, Object> getArticleTrait(String articleId, int page) {
        if (articleId == null || articleId.isEmpty()) {
            return getErrorMap();
        }
        int pageSize = 10;

        String sql = "SELECT a.article_type_id,b.article_id,a.iamge_back,b.article_keyword,b.article_title,b.content_excerpt " +
                "FROM zz_wechat.article_type a,zz_wechat.article b where a.article_type_id=b.article_type_id and b.article_type_id=? ORDER BY b.create_time LIMIT ?,?";


        List<Map<String, Object>> mapList = jdbcTemplate.queryForList(sql, new Object[]{
                Integer.parseInt(articleId),
                page * pageSize,
                pageSize

        });
        HashMap<String, Object> map = new HashMap<>();
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
        //获取文章的详细信息
        String messageSql = "SELECT article_id,article_type_id,article_title,article_keyword,author,source,create_time,(share_count+collect_initcount) as share_count,(collect_count+collect_initcount) as collect_count ,content_type,content_crawl,content_manual FROM  article where article_id=?";
        Map<String, Object> messageMap = jdbcTemplate.queryForMap(messageSql, new Object[]{articleId});

        //获取相关文章（后期改成随机三遍文章）
        String moreSql = "SELECT a.create_time ,a.article_id,a.article_title,a.article_keyword,a.image_path FROM  article a, article_type b where a.article_type_id=b.article_type_id AND article_id !=? ORDER BY a.create_time DESC limit 0,3";
        List<Map<String, Object>> mapList = jdbcTemplate.queryForList(moreSql, new Object[]{articleId});


        //插入数据，代表文章已读

        String selectSql = "select user_id from zz_wechat.sys_user where wechat_id='" + wechatid + "'";
        Map<String, Object> userMap = jdbcTemplate.queryForMap(selectSql);
        Object objId = userMap.get("user_id");
        if (objId == null) {
            return getErrorMap();
        }
        String user_id = objId.toString();

        boolean isFlag = false;

        try {
            String selectSqlFora = "select count(*) as count from zz_wechat.user_article where type_id=? and article_id=? and article_type_id=? AND user_id=?";
            Map<String, Object> forMap = jdbcTemplate.queryForMap(selectSqlFora, new Object[]{
                    1,
                    articleId,
                    Integer.parseInt(messageMap.get("article_type_id").toString()),
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
                    Integer.parseInt(messageMap.get("article_type_id").toString())

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


        String fild = "share_count";
        if ("2".equals(type.toString())) {
            fild = "share_count";
        } else if ("3".equals(type.toString())) {
            fild = "collect_count";
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
    public Map<String, Object> getAllArticleType(String wechatid) {
        if (wechatid == null || "".equals(wechatid)) {
            return getErrorMap();
        }
        String gzSql = "SELECT  a.article_type_name,a.article_type_id,a.article_type_keyword,a.iamge_icon,a.iamge_back  ,1 as type_id from article_type a,user_articletype b ,sys_user c WHERE a.article_type_id=b.article_type_id AND c.user_id=b.user_id AND c.wechat_id=?" +
                "AND a.parentid !=? " +
                "ORDER BY a.create_time DESC";
        List<Map<String, Object>> gzList = jdbcTemplate.queryForList(gzSql, new Object[]{
                wechatid,
                0
        });

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
                "AND a.parentid !=?";
        List<Map<String, Object>> nogzList = jdbcTemplate.queryForList(nogzSql, new Object[]{
                user_id,
                wechatid,
                0
        });

        List list = new ArrayList();
        list.addAll(gzList);
        list.addAll(nogzList);

        HashMap<String, Object> map = new HashMap<>();
        map.put("cdoe", 0);
        map.put("message", "查询成功");
        map.put("result", list);
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
        String user_id = objId.toString();
        List list = new ArrayList();
        //关注的类型sql
        String gzSeachSql = "SELECT article_type_id,article_type_name,article_type_keyword ,create_time,iamge_icon,iamge_back ,1 as type_id from zz_wechat.article_type WHERE parentid !=0 AND (article_type_name LIKE '%" +
                message +
                "%' or article_type_keyword  LIKE '%" +
                message +
                "%') AND article_type_id in (SELECT article_type_id FROM user_articletype WHERE user_id='" +
                user_id +
                "')";

        List<Map<String, Object>> gzMapList = jdbcTemplate.queryForList(gzSeachSql);

        String nogzSeachSql = "SELECT article_type_id,article_type_name,article_type_keyword ,create_time,iamge_icon,iamge_back ,1 as type_id from zz_wechat.article_type WHERE parentid !=0 AND (article_type_name LIKE '%" +
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
        String gzArticleSqlCount = "SELECT COUNT(*) as count FROM zz_wechat.article WHERE article_type_id in(SELECT article_type_id FROM user_articletype WHERE user_id='" +
                user_id +
                "' ) AND (article_title LIKE '%" +
                message +
                "%' OR article_keyword LIKE '%" +
                message +
                "%' OR author LIKE '%" +
                message +
                "%' OR source LIKE '%" +
                message +
                "%' OR content_crawl LIKE '%" +
                message +
                "%'" +
                "OR content_manual LIKE '%" +
                message +
                "%' OR content_excerpt LIKE '%" +
                message +
                "%')";

        Map<String, Object> map = jdbcTemplate.queryForMap(gzArticleSqlCount);
        Object objCount = map.get("count");
        int count = 0;
        if (objCount != null) {
            count = Integer.parseInt(objCount.toString());
        }


        if (count > 0 && pageSize * page <= count || count < 10) {

            String gzArticleSql = "SELECT article_id,article_type_id,article_title,article_keyword,create_time,content_excerpt FROM zz_wechat.article WHERE article_type_id in(SELECT article_type_id FROM user_articletype WHERE user_id='" +
                    user_id +
                    "' ) AND (article_title LIKE '%" +
                    message +
                    "%' OR article_keyword LIKE '%" +
                    message +
                    "%' OR author LIKE '%" +
                    message +
                    "%' OR source LIKE '%" +
                    message +
                    "%' OR content_crawl LIKE '%" +
                    message +
                    "%'" +
                    "OR content_manual LIKE '%" +
                    message +
                    "%' OR content_excerpt LIKE '%" +
                    message +
                    "%') ORDER BY create_time LIMIT " +
                    page * pageSize +
                    "," +
                    pageSize;

            List<Map<String, Object>> gzArticleList = jdbcTemplate.queryForList(gzArticleSql);

            if (gzArticleList == null) {
                gzArticleList = new ArrayList<>();
            }

            resultMap.put("loveArticle", gzArticleList);
        }

        if (resultMap.get("loveArticle") == null) {

            List<Map<String, Object>> gzArticleList = new ArrayList<>();
            resultMap.put("loveArticle", gzArticleList);
        }


        if (count < 10 || pageSize * page > count) {
            count = (pageSize * page - count) / pageSize;
            if (count < 0) {
                count = 0;
            }


            String nogzArticleSql = "SELECT article_id,article_type_id,article_title,article_keyword,create_time,content_excerpt FROM zz_wechat.article WHERE article_type_id NOT in(SELECT article_type_id FROM user_articletype WHERE user_id='" +
                    user_id +
                    "' ) AND (article_title LIKE '%" +
                    message +
                    "%' OR article_keyword LIKE '%" +
                    message +
                    "%' OR author LIKE '%" +
                    message +
                    "%' OR source LIKE '%" +
                    message +
                    "%' OR content_crawl LIKE '%" +
                    message +
                    "%'" +
                    "OR content_manual LIKE '%" +
                    message +
                    "%' OR content_excerpt LIKE '%" +
                    message +
                    "%')ORDER BY create_time LIMIT " +
                    page * pageSize +
                    "," +
                    pageSize;
            List<Map<String, Object>> nogzArticleList = jdbcTemplate.queryForList(nogzArticleSql);
            if (nogzArticleList == null) {
                nogzArticleList = new ArrayList<>();
            }

            resultMap.put("notLoveArticle", nogzArticleList);
        }


        if (resultMap.get("notLoveArticle") == null) {
            List<Map<String, Object>> gzArticleList = new ArrayList<>();
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
            String insertSql = "insert into zz_wechat.article_type (article_type_name,article_type_keyword,create_time,iamge_icon,parentid) values(?,?,date_format(?,'%Y-%m-%d %H:%i:%s'),?,?)";

            int update = jdbcTemplate.update(insertSql, new Object[]{
                    name.toString(),
                    key,
                    sysTime,
                    path,
                    0
            });
            if (update == 1) {
                return true;
            }
        }
        return false;
    }

    @Override
    public List<Map<String, Object>> getAllDomain() {
        String sql = "select article_type_id,article_type_name from zz_wechat.article_type where parentid='0' ORDER BY create_time DESC";
        List<Map<String, Object>> maps = jdbcTemplate.queryForList(sql);
        return maps;
    }

    @Override
    public boolean insertArticleType(String name, String keyword, String artcicle_type_id, String num, String pathICon, String pathback) {


        String doNameSql = "select count(*) as count from zz_wechat.article_type where article_type_name=? and parentid=?";
        Map<String, Object> countMap = jdbcTemplate.queryForMap(doNameSql, new Object[]{
                name.toString(),
                Integer.parseInt(artcicle_type_id)
        });
        //没有查找到
        if (countMap == null || countMap.get("count") == null || "0".equals(countMap.get("count").toString())) {

            String sysTime = DateUtil.getCurrentTimeString();
            //插入
            String sql = "insert into zz_wechat.article_type (article_type_name,article_type_keyword,create_time,iamge_icon,parentid,iamge_back) values (?,?,date_format(?,'%Y-%m-%d %H:%i:%s'),?,?,?)";
            int update = jdbcTemplate.update(sql, new Object[]{
                    name,
                    keyword,
                    sysTime,
                    pathICon,
                    Integer.parseInt(artcicle_type_id),
                    pathback
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
            sql = "select article_type_id,article_type_name from zz_wechat.article_type where parentid !=?";
        } else {
            sql = "select article_type_id,article_type_name from zz_wechat.article_type where parentid=?";
            parentid = Integer.parseInt(article_type_id);
        }

        List<Map<String, Object>> maps = jdbcTemplate.queryForList(sql, new Object[]{
                parentid
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
        try {
            if (author == null) {
                author = "";
            }
            String article_id = UuidUtils.getUUid();
            String create_time = DateUtil.getCurrentTimeString();
            String sql = "insert into  zz_wechat.article (article_id,article_type_id,article_title,article_keyword,author,source,create_time,share_initcount,collect_initcount,content_type,content_manual,word_count,details_txt,update_time,content_excerpt,share_count,collect_count) " +
                    "values(?,?,?,?,?,?,date_format(?,'%Y-%m-%d %H:%i:%s'),?,?,?,?,?,?,date_format(?,'%Y-%m-%d %H:%i:%s'),?,?,?)";

            int update = jdbcTemplate.update(sql, new Object[]{

                    article_id,
                    Integer.parseInt(article_type_id.toString()),
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
        String countSql = "select count(*) from zz_wechat.article ";

        String sql = "select article_id,article_type_id,article_title,author,source, word_count,article_keyword,create_time from zz_wechat.article ordery ORDER BY create_time desc";
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
    public Map<String, Object> deletedById(String article_id) {
        if (article_id == null || "".equals(article_id)) {
            return getErrorMap();

        }
        String sql = "DELETE from zz_wechat.article  where article_id =?";
        int update = jdbcTemplate.update(sql, new Object[]{
                article_id
        });
        Map<String, Object> map = new HashMap<>();
        map.put("code", 0);
        map.put("message", "删除成功");

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
}

package com.kingweather.we_chat.dao.iml;

import com.kingweather.common.jdbc.JdbcUtil;
import com.kingweather.common.util.DateUtil;
import com.kingweather.common.util.Page;
import com.kingweather.we_chat.dao.ReleaseManagementDao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Repository
public class ReleaseManagementDaoIml implements ReleaseManagementDao {
    @Resource
    private JdbcTemplate jdbcTemplate;
    @Resource
    private JdbcUtil jdbc;

    @Override
    public List<Map> getTypeMenuTree(String parent_id) {

        String sql = "select article_type_id,article_type_name,article_type_keyword,iamge_icon,iamge_back,parentid,type_state from zz_wechat.article_type_tmp where del_type!=? and parentid=?";
        List maps = jdbcTemplate.queryForList(sql, new Object[]{
                1, parent_id

        });

        return maps;
    }

    @Override
    public Map getTypeMessage(String article_type_id) {

        String sql = "select article_type_id,article_type_name,article_type_keyword,iamge_icon,iamge_back,parentid,type_state from zz_wechat.article_type_tmp where del_type!=? and article_type_id=?";

        Map maps = jdbcTemplate.queryForMap(sql, new Object[]{
                1, article_type_id

        });
        return maps;
    }

    @Override
    public int updateTypeMessage(String name, String keyword, String artcicle_type_id, String pathICon, String pathBack, String parentid) {
        try {
            String updateSqlTmp = "update  zz_wechat.article_type_tmp set article_type_name=?,article_type_keyword=?,iamge_icon=?,iamge_back=?,status=?, parentid=?  where article_type_id=?";
            int update = jdbcTemplate.update(updateSqlTmp, new Object[]{
                    name,
                    keyword,
                    pathICon,
                    pathBack,
                    "1",
                    parentid,
                    artcicle_type_id

            });

            try {
                String sqlCount = "select count(*) as count from zz_wechat.article_type where article_type_id=?";
                Map<String, Object> map = jdbcTemplate.queryForMap(sqlCount, new Object[]{
                        artcicle_type_id
                });
                if (map != null && map.get("count") != null && Integer.parseInt(map.get("count").toString()) == 0) {
                    //插入实际的类型表
                    String currentTime = DateUtil.getCurrentTimeString();
                    String insertSqlt = "insert into (artcicle_type_id,article_type_keyword,article_type_name,iamge_icon,iamge_back,parentid,del_type,create_time) values " +
                            "(?,?,?,?,?,?,?,date_format(?,'%Y-%m-%d %H:%i:%s'))";
                    jdbcTemplate.update(insertSqlt, new Object[]{
                            artcicle_type_id,
                            keyword,
                            name,
                            pathICon,
                            pathBack,
                            parentid,
                            0,
                            currentTime

                    });

                } else {
                    String updateSql = "update zz_wechat.article_type set article_type_name=?,article_type_keyword=?,iamge_icon=?,iamge_back=?, parentid=? ,del_type=?   where article_type_id=?";
                    jdbcTemplate.update(updateSql, new Object[]{

                            name,
                            keyword,
                            pathICon,
                            pathBack,
                            parentid,
                            0,
                            artcicle_type_id,


                    });
                }
            } catch (Exception e) {
                //插入实际的类型表
                String currentTime = DateUtil.getCurrentTimeString();
                String insertSqlt = "insert into zz_wechat.article_type(article_type_id,article_type_keyword,article_type_name,iamge_icon,iamge_back,parentid,del_type,create_time) values " +
                        "(?,?,?,?,?,?,?,date_format(?,'%Y-%m-%d %H:%i:%s') )";
                jdbcTemplate.update(insertSqlt, new Object[]{
                        artcicle_type_id,
                        keyword,
                        name,
                        pathICon,
                        pathBack,
                        parentid,
                        0,
                        currentTime
                });
            }

            return update;
        } catch (Exception e) {
            System.out.println(e);
            return 0;
        }
    }

    @Override
    public int updateTypeParentId(String article_type_id, String parentid) {

        String updateSqlTmp = "update zz_wechat.article_type_tmp set parentid=?   where article_type_id=?";
        int update = jdbcTemplate.update(updateSqlTmp, new Object[]{
                parentid,
                article_type_id

        });


        try {
            String sqlCount = "select count(*) as count from zz_wechat.article_type where artcicle_type_id=?";
            Map<String, Object> map = jdbcTemplate.queryForMap(sqlCount, new Object[]{
                    article_type_id
            });
            if (map != null && map.get("count") != null && Integer.parseInt(map.get("count").toString()) == 1) {

                String updateSql = "update zz_wechat.article_type set parentid=?   where article_type_id=?";
                jdbcTemplate.update(updateSql, new Object[]{
                        parentid,
                        article_type_id

                });

            }

        } catch (Exception e) {

        }

        return update;

    }

    @Override
    public Map selectAricleTmpList(Map<String, java.lang.Object> data) {
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        //查询的是论文还是文章 0 文章  1 论文
        Object type = data.get("type");
        //查询的类型的id
        Object article_type_id = data.get("article_type_id");

        Object startNum = data.get("pageNumber");
        Object pageSize = data.get("pageSize");
        if (type == null || article_type_id == null || startNum == null || pageSize == null) {
            return getErrorMap();
        }
        //入库的开始时间
        Object updateTimeStart = data.get("updateTimeStart");
        //入库的结束时间
        Object updateTimeEnd = data.get("updateTimeEnd");
        //是否审核 0 未审核  1 审核
        Object checkType = data.get("checkType");
        //搜索内容
        Object message = data.get("message");

        //查询的是文章
        if ("0".equals(type.toString())) {
            //创建的开始时间
            Object createTimeStart = data.get("createTimeStart");
            //创建的结束时间
            Object createTimeEnd = data.get("createTimeEnd");
            //字数大于多少
            Object details_size_more = data.get("details_size_more");
            //字数少于多少
            Object details_size_less = data.get("details_size_less");

            //分数大于多少
            Object article_score_more = data.get("article_score_more");
            //分数小于多少
            Object article_score_less = data.get("article_score_less");


            String sqlCount = "select count(*) as count from zz_wechat.article_tmp a ,zz_wechat.article_type_tmp b where a.del_type !=1 " +
                    "AND a.article_type_id=b.article_type_id and a.article_type_id='" + article_type_id + "' ";

            String sqlMessage = "select a.article_id,a.article_type_id,a.article_title,a.article_keyword,a.author,DATE_ADD( a.update_time,INTERVAL -8 HOUR) AS update_time,DATE_ADD( a.create_time,INTERVAL -8 HOUR) AS  create_time ,a.source,a.content_excerpt,a.details_size,a.check_type,a.article_score,b.article_type_name  " +
                    "from zz_wechat.article_tmp a ,zz_wechat.article_type_tmp b where a.del_type !=1" +
                    " AND a.article_type_id=b.article_type_id and a.article_type_id='" + article_type_id + "' ";

            if (updateTimeStart != null) {
//                String update_time = DateUtil.getCurrentTimeString(updateTimeStart.toString());
                sqlCount = sqlCount + " and update_time>=date_format('" + updateTimeStart.toString() + "','%Y-%m-%d %H:%i:%s')";
                sqlMessage = sqlMessage + " and update_time>=date_format('" + updateTimeStart.toString() + "','%Y-%m-%d %H:%i:%s')";
            }


            if (updateTimeEnd != null) {
//                String updateTime = DateUtil.getCurrentTimeString(updateTimeEnd.toString());
                sqlCount = sqlCount + " and update_time<=date_format('" + updateTimeEnd.toString() + "','%Y-%m-%d %H:%i:%s')";
                sqlMessage = sqlMessage + " and update_time<=date_format('" + updateTimeEnd.toString() + "','%Y-%m-%d %H:%i:%s')";
            }


            if (createTimeStart != null) {
//                String createTime = DateUtil.getCurrentTimeString(createTimeStart.toString());
                sqlCount = sqlCount + " and update_time>=date_format('" + createTimeStart.toString() + "','%Y-%m-%d %H:%i:%s')";
                sqlMessage = sqlMessage + " and update_time>=date_format('" + createTimeStart.toString() + "','%Y-%m-%d %H:%i:%s')";
            }

            if (createTimeEnd != null) {
//                String createTime = DateUtil.getCurrentTimeString(createTimeEnd.toString());
                sqlCount = sqlCount + " and update_time<=date_format('" + createTimeEnd.toString() + "','%Y-%m-%d %H:%i:%s')";
                sqlMessage = sqlMessage + " and update_time<=date_format('" + createTimeEnd.toString() + "','%Y-%m-%d %H:%i:%s')";
            }

            if (details_size_more != null) {
                sqlCount = sqlCount + " and details_size>=" + Integer.parseInt(details_size_more.toString());
                sqlMessage = sqlMessage + " and details_size>=" + Integer.parseInt(details_size_more.toString());
            }
            if (details_size_less != null) {
                sqlCount = sqlCount + " and details_size<=" + Integer.parseInt(details_size_less.toString());
                sqlMessage = sqlMessage + " and details_size<=" + Integer.parseInt(details_size_less.toString());
            }
             //分数
            if (article_score_more != null) {
                sqlCount = sqlCount + " and article_score>=" + Integer.parseInt(article_score_more.toString());
                sqlMessage = sqlMessage + " and article_score>=" + Integer.parseInt(article_score_more.toString());
            }
            if (article_score_less != null) {
                sqlCount = sqlCount + " and article_score<=" + Integer.parseInt(article_score_less.toString());
                sqlMessage = sqlMessage + " and article_score<=" + Integer.parseInt(article_score_less.toString());
            }
            if (message != null) {
                sqlCount = sqlCount + " and (article_title like '%" + message.toString() + "%' or author like '%" + message.toString() + "%' or source like '%" + message.toString() + "%' )";
                sqlMessage = sqlMessage + " and (article_title like '%" + message.toString() + "%' or author like '%" + message.toString() + "%' or source like '%" + message.toString() + "%' )";
            }
            if (checkType != null) {
                sqlCount = sqlCount + " and check_type=" + Integer.parseInt(checkType.toString());
                sqlMessage = sqlMessage + " and check_type=" + Integer.parseInt(checkType.toString());
            }


            sqlMessage = sqlMessage + " ORDER BY update_time asc";
            Page<Map<String, Object>> page = jdbc.queryForPage(Integer.parseInt(startNum.toString()), Integer.parseInt(pageSize.toString()), sqlCount, sqlMessage, new Object[]{});
            map.put("code", 0);
            map.put("message", "查询成功");
            map.put("total", page.getTotalCount());
            map.put("result", page.getResult());
            return map;


        } else {
            //创建时间
            Object createTime = data.get("createTime");

            Object language = data.get("language");//0  中文  1 英文

            //查询的是论文
            String sqlCount = "select count(*) as count from zz_wechat.academic_paper a ,zz_wechat.article_type_tmp b where a.del_type !=1 " +
                    "AND a.article_type_id=b.article_type_id and a.article_type_id='" + article_type_id + "' ";

            String sqlMessage = "select a.article_id,a.article_type_id,a.article_title,a.article_keyword,a.author,DATE_ADD( a.update_time,INTERVAL -8 HOUR) AS update_time,create_time ,a.source,a.content_excerpt,a.details_size,a.check_type,a.article_score,b.article_type_name  " +
                    "from zz_wechat.article_tmp a ,zz_wechat.article_type_tmp b where a.del_type !=1" +
                    " AND a.article_type_id=b.article_type_id and a.article_type_id='" + article_type_id + "' ";

            if(language!=null&&"1".equals(language)){
                sqlMessage = "select a.article_id,a.article_type_id,a.article_title_e,a.article_keyword_e,a.author_e,DATE_ADD( a.update_time,INTERVAL -8 HOUR) AS update_time,DATE_ADD( a.create_time,INTERVAL -8 HOUR) AS  create_time ,a.source,a.content_excerpt_e,a.reference,a.article_score,a.check_type,a.article_score,b.article_type_name  " +
                        "from zz_wechat.article_tmp a ,zz_wechat.article_type_tmp b where a.del_type !=1" +
                        " AND a.article_type_id=b.article_type_id and a.article_type_id='" + article_type_id + "' ";
            }

            //入库时间
            if (updateTimeStart != null) {
//                String update_time = DateUtil.getCurrentTimeString(updateTimeStart.toString());
                sqlCount = sqlCount + " and update_time>=date_format('" + updateTimeStart.toString() + "','%Y-%m-%d %H:%i:%s')";
                sqlMessage = sqlMessage + " and update_time>=date_format('" + updateTimeStart.toString() + "','%Y-%m-%d %H:%i:%s')";
            }


            if (updateTimeEnd != null) {
//                String updateTime = DateUtil.getCurrentTimeString(updateTimeEnd.toString());
                sqlCount = sqlCount + " and update_time<=date_format('" + updateTimeEnd.toString() + "','%Y-%m-%d %H:%i:%s')";
                sqlMessage = sqlMessage + " and update_time<=date_format('" + updateTimeEnd.toString() + "','%Y-%m-%d %H:%i:%s')";
            }


            if (message != null) {
                sqlCount = sqlCount + " and (article_title like '%" + message.toString() + "%' or author like '%" + message.toString() + "%' or source like '%" + message.toString() + "%' )";
                sqlMessage = sqlMessage + " and (article_title like '%" + message.toString() + "%' or author like '%" + message.toString() + "%' or source like '%" + message.toString() + "%' )";
            }


            if (checkType != null) {
                sqlCount = sqlCount + " and check_type=" + Integer.parseInt(checkType.toString());
                sqlMessage = sqlMessage + " and check_type=" + Integer.parseInt(checkType.toString());
            }


            if (createTime != null) {
                sqlCount = sqlCount + " and create_time like '%" + createTime+"%'";
                sqlMessage = sqlMessage + " and create_time like '%" + createTime+"%'";
            }

            sqlMessage = sqlMessage + " ORDER BY update_time asc";
            Page<Map<String, Object>> page = jdbc.queryForPage(Integer.parseInt(startNum.toString()), Integer.parseInt(pageSize.toString()), sqlCount, sqlMessage, new Object[]{});
            map.put("code", 0);
            map.put("message", "查询成功");
            map.put("total", page.getTotalCount());
            map.put("result", page.getResult());
            return map;


        }

    }

    /**
     * 根据id 删除文章
     *
     * @param articleIdList
     * @return
     */
    @Override
    public Map<String, Object> delAricleTmpList(String articleIdList) {
        if (articleIdList == null || "".equals(articleIdList)) {
            return getErrorMap();
        }
        String idList = "";
        String[] split = articleIdList.split(",");

        for (int i = 0; i < split.length; i++) {
            idList = idList + "'" + split[i].toString() + "',";
        }
        idList = idList.substring(0, idList.length() - 1);
        String updateSql = "update zz_wechat.article_tmp set del_type=1 where article_id in (" + idList + ")";
        jdbcTemplate.update(updateSql);
        HashMap<String, Object> map = new HashMap<>();
        map.put("code", 0);
        map.put("message", "删除成功！");
        return map;
    }

    /**
     * 根据文章id获取文章的详情
     *
     * @param articleId
     * @return
     */

    @Override
    public Map<String, Object> getAricleTmpMessageById(String articleId, String type) {
        if (articleId == null || type == null) {
            return getErrorMap();
        }

        //文章查询
        if ("0".equals(type)) {

            String sql = "select a.article_id,a.article_type_id,a.article_title,a.article_keyword,a.author,DATE_ADD( a.update_time,INTERVAL -8 HOUR) AS update_time,DATE_ADD( a.create_time,INTERVAL -8 HOUR) AS  create_time ,a.source,a.content_excerpt,a.details_size,a.check_type,a.article_score,a.details_txt,a.details_div,b.article_type_name  " +
                    "from zz_wechat.article_tmp a ,zz_wechat.article_type_tmp b where a.article_type_id=b.article_type_id and  a.article_id=?";
            Map<String, Object> map = jdbcTemplate.queryForMap(sql, new Object[]{
                    articleId
            });
            byte[] details_txt = (byte[]) map.get("details_txt");
            byte[] details_div = (byte[]) map.get("details_div");

            try {
                if (details_txt != null) {
                    map.put("details_txt", new String(details_txt, "UTF-8"));
                }
                if (details_div != null) {
                    map.put("details_div", new String(details_div, "UTF-8"));
                }

            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }


            HashMap<String, Object> result = new HashMap<>();
            result.put("code", 0);
            result.put("message", "查询成功");
            result.put("result", map);

            return result;


        }

        return null;
    }

    @Override
    public Map<String, Object> getAricleTmpCheckById(String articleId, String type) {
        if (articleId == null || type == null) {
            return getErrorMap();
        }
        if ("0".equals(type)) {
            String idList = "";
            String[] split = articleId.split(",");
            for (int i = 0; i < split.length; i++) {
                idList = idList + "'" + split[i].toString() + "',";
            }
            idList = idList.substring(0, idList.length() - 1);
            String updateSql = "update zz_wechat.article_tmp set check_type=1 where article_id in (" + idList + ")";
            jdbcTemplate.update(updateSql);
            HashMap<String, Object> map = new HashMap<>();
            map.put("code", 0);
            map.put("message", "审核成功！");
            return map;
        }
        return null;
    }

    /**
     * 更新论文或者文章
     *
     * @param data
     * @return
     */
    @Override
    public Map<String, Object> updateAricleTmpMesage(Map<String, Object> data) {
        Object type = data.get("type");
        Object article_id = data.get("article_id");
        Object article_type_id = data.get("article_type_id");
        Object article_title = data.get("article_title");
        Object article_keyword = data.get("article_keyword");
        Object create_time = data.get("create_time");
        Object content_excerpt = data.get("content_excerpt");
        Object details_txt = data.get("details_txt");
        Object details_div = data.get("details_div");
//        Object details_size = data.get("details_size");
        Object article_score = data.get("article_score");
        if (type == null || article_id == null || article_type_id == null || article_title == null || article_keyword == null || create_time == null
                || content_excerpt == null || details_txt == null || details_div == null || article_score == null) {
            return getErrorMap();
        }


        Object author = data.get("author");

        Object source = data.get("source");

        String currentTimeString = DateUtil.getCurrentTimeString();
        if ("0".equals(type)) {
            String sql = "update zz_wechat.article_tmp set article_type_id=?,article_title=?,article_keyword=?,author=?,source=?," +
                    "content_excerpt=?,details_txt=?,details_div=?,details_size=?,status=?,article_score=?,del_type=?," +
                    " create_time=date_format(?,'%Y-%m-%d %H:%i:%s'),  update_time=date_format(?,'%Y-%m-%d %H:%i:%s') where article_id=?";

            int update = jdbcTemplate.update(sql, new Object[]{
                    article_type_id.toString(),
                    article_title.toString(),
                    article_keyword.toString(),
                    author,
                    source,
                    content_excerpt.toString(),
                    details_txt.toString(),
                    details_div.toString(),
                    details_txt.toString().length(),
                    "1",
                    Integer.parseInt(article_score.toString()),
                    "0",
                    create_time,
                    currentTimeString,
                    article_id.toString()
            });
            HashMap<String, Object> map = new HashMap<>();
            map.put("code", 0);
            map.put("message", "更新成功！");
            return map;
        } else {
            //论文
        }


        return null;
    }

    @Override
    public Map<String, Object> pushAricleTmpById(String articleIds, String type) {
        if (articleIds == null || type == null) {
            return getErrorMap();
        }
        String idList = "";
        String[] split = articleIds.split(",");
        for (int i = 0; i < split.length; i++) {
            idList = idList + "'" + split[i].toString() + "',";
        }
        idList = idList.substring(0, idList.length() - 1);
        if ("0".equals(type)) {
            String sql = "select article_id,article_type_id,article_title,article_keyword,author,create_time,source,content_excerpt,details_txt,details_div,details_size,article_score from zz_wechat.article_tmp where " +
                    " article_id in(" + idList + " )";

            List<Map<String, Object>> articleTmpMaps = jdbcTemplate.queryForList(sql);
            for (int i = 0; i < articleTmpMaps.size(); i++) {
                Map<String, Object> articleTmp = articleTmpMaps.get(i);


                String insertSql = "insert into zz_wechat.article (article_id,article_type_id,article_title,article_keyword,author,source" +
                        ",share_count,collect_count,collect_initcount,share_initcount,content_type,content_manual,content_excerpt," +
                        "details_txt,del_type,word_count,state " +
                        ",create_time,update_time) values(?,?,?,?,?,?," +
                        "?,?,?,?,?,?,?,?," +
                        "?,?,?" +
                        ",date_format(?,'%Y-%m-%d %H:%i:%s'),date_format(?,'%Y-%m-%d %H:%i:%s'))";
                int update = jdbcTemplate.update(insertSql, new Object[]{
                        articleTmp.get("article_id"),
                        articleTmp.get("article_type_id"),
                        articleTmp.get("article_title"),
                        articleTmp.get("article_keyword"),
                        articleTmp.get("author"),
                        articleTmp.get("source"),
                        0,
                        0,
                        0,
                        0,
                        1,
                        articleTmp.get("details_div"),
                        articleTmp.get("content_excerpt"),
                        articleTmp.get("details_txt"),
                        0,
                        Integer.parseInt(articleTmp.get("details_size").toString()),
                        1,
                        articleTmp.get("create_time"),
                        DateUtil.getCurrentTimeString()
                });

                if (update == 1) {
                    String delSql = "DELETE  from zz_wechat.article_tmp where article_id=?";
                    jdbcTemplate.update(delSql, new Object[]{
                            articleTmp.get("article_id")
                    });
                }


            }

            HashMap<String, Object> map = new HashMap<>();
            map.put("code", 0);
            map.put("message", "更新成功！");
            return map;
        }


        return null;
    }

    /**
     * 合并文章类型
     *
     * @param data
     * @return
     */
    @Override
    public int mergeTypeById(Map<String, Object> data) {
        try {
            Object article_type_id = data.get("article_type_id");
            Object parent_id = data.get("parent_id");
            Object merge_type_id = data.get("merge_type_id");
            if (article_type_id == null || parent_id == null || merge_type_id == null) {
                return 0;
            }
            //要合并的id
            String[] merge_type_idList = merge_type_id.toString().split(",");
            String mergeIdList = "";

            for (int i = 0; i < merge_type_idList.length; i++) {
                mergeIdList = mergeIdList + "'" + merge_type_idList[i].toString() + "',";
            }
            mergeIdList = mergeIdList.substring(0, mergeIdList.length() - 1);

//        String tmpChildSql="select parentid from zz_wecaht.article_type_tmp where article_type_id in ("+mergeIdList+" )";
//        String childSql="select parentid from zz_wecaht.article_type where article_type_id in ("+mergeIdList+" )";
            String tmpChildSql = "update zz_wecaht.article_type_tmp set parentid='" + parent_id + "' where parentid in(" +
                    " select parentid from zz_wecaht.article_type_tmp where article_type_id in (" +
                    "" + mergeIdList +
                    " ))";

            String childSql = "update zz_wecaht.article_type set parentid='" + parent_id + "' where parentid in(" +
                    " select parentid from zz_wecaht.article_type where article_type_id in (" +
                    "" + mergeIdList +
                    " ))";

            jdbcTemplate.update(tmpChildSql);
            jdbcTemplate.update(childSql);
            String deltmpChildSql = "delete from zz_wecaht.article_type_tmp where article_type_id=?";
            jdbcTemplate.update(deltmpChildSql, new Object[]{
                    article_type_id.toString()
            });

            String delChildSql = "update zz_wechat.article_type set del_type=? where article_type_id=?";
            jdbcTemplate.update(delChildSql, new Object[]{
                    1,
                    article_type_id.toString()
            });

        } catch (Exception e) {
            return 0;
        }
        return 1;
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

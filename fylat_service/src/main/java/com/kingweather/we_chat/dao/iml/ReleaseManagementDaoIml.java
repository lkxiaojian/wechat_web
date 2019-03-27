package com.kingweather.we_chat.dao.iml;

import com.google.common.collect.Lists;
import com.kingweather.common.jdbc.JdbcUtil;
import com.kingweather.common.util.DateUtil;
import com.kingweather.common.util.Page;
import com.kingweather.we_chat.dao.ReleaseManagementDao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
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
    public List<Map> getTypeMenuTree(String parent_id, String type) {

        String sql = "select article_type_id as id,article_type_name as text,article_type_keyword,iamge_icon,iamge_back,parentid,type_state,issue,article_type_name_old,article_type_keyword_old from zz_wechat.article_type_tmp where del_type!=? and parentid=?";

        if ("1".equals(type)) {
            sql = "select article_type_id as id,article_type_name as text,article_type_keyword,iamge_icon,iamge_back,parentid,type_state, issue  from zz_wechat.article_type where del_type!=? and parentid=?";
        } else if ("2".equals(type)) {
            sql = "select article_type_id as id,article_type_name as text,article_type_keyword,iamge_icon,iamge_back,parentid,type_state,issue,article_type_name_old,article_type_keyword_old from zz_wechat.article_type_tmp where del_type!=? and parentid=?";

        }
        List maps = jdbcTemplate.queryForList(sql, new Object[]{
                1, parent_id

        });
        if (maps != null && !"1".equals(type)) {
            maps.stream().forEach(s -> {
                Map map = (Map<String, Object>) s;
                Map userdata = new HashMap();
                userdata.put("name", "issue");
                userdata.put("content", map.get("issue"));
                map.put("userdata", Lists.newArrayList(userdata));
            });
        }

        return maps;
    }

    @Override
    public Map getTypeMessage(String article_type_id, String type) {


        String sql = "select article_type_id,article_type_name,article_type_keyword,iamge_icon,iamge_back,parentid,type_state,article_type_name_old,article_type_keyword_old from zz_wechat.article_type_tmp where del_type!=? and article_type_id=?";
        if ("1".equals(type)) {//正式表
            sql = "select article_type_id,article_type_name,article_type_keyword,iamge_icon,iamge_back,parentid,type_state from zz_wechat.article_type where del_type!=? and article_type_id=?";
        }
        Map maps = jdbcTemplate.queryForMap(sql, new Object[]{
                1, article_type_id

        });
        return maps;
    }

    @Override
    public int updateTypeMessage(String name, String keyword, String artcicle_type_id, String pathICon, String pathBack, String parentid, String type) {
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

//            String typeSql = "select type_state from zz_wechat.article_type_tmp where article_type_id=?";
//            Map<String, Object> typeMap = jdbcTemplate.queryForMap(typeSql, new Object[]{
//                    artcicle_type_id
//            });

            try {
                String sqlCount = "select count(*) as count from zz_wechat.article_type where article_type_id=?";
                Map<String, Object> map = jdbcTemplate.queryForMap(sqlCount, new Object[]{
                        artcicle_type_id
                });
                if (map != null && map.get("count") != null && Integer.parseInt(map.get("count").toString()) == 0) {

                } else {
                    String updateSql = "update zz_wechat.article_type set article_type_name=?,article_type_keyword=?,iamge_icon=?,iamge_back=?, parentid=? ,del_type=?   where article_type_id=?";
                    jdbcTemplate.update(updateSql, new Object[]{

                            name,
                            keyword,
                            pathICon,
                            pathBack,
                            parentid,
                            0,
                            artcicle_type_id


                    });
                }
            } catch (Exception e) {

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

        //对要合并的类型插入到临时表
        String Changesql = "select count(*) as count from zz_wechat.change_article_type where article_type_id=? and type=?";
        Map<String, Object> changeMap = jdbcTemplate.queryForMap(Changesql, new Object[]{
                article_type_id,
                1
        });

        //插入
        if (changeMap != null && changeMap.get("count") != null
                && Integer.parseInt(changeMap.get("count").toString()) == 0) {
            String insertChangeTypeSql = "insert into zz_wechat.change_article_type(article_type_id,parent_id,type,update_time) values(?,?,1,now())";
            jdbcTemplate.update(insertChangeTypeSql, new Object[]{
                    article_type_id,
                    parentid
            });

        } else {
            //更新
            String insertChangeTypeSql = "UPDATE  zz_wechat.change_article_type SET parent_id=?,update_time=? where article_type_id=? AND type=? ";
            jdbcTemplate.update(insertChangeTypeSql, new Object[]{
                    parentid,
                    DateUtil.getCurrentTimeString(),
                    article_type_id,
                    0
            });
        }


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
    public Map selectAricleTmpList(HttpServletRequest req) {
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        //查询的是论文还是文章 0 文章  1 论文
        Object type = req.getParameter("type");
        //查看的是否是回收站 0不是 1是
        Object del_type = req.getParameter("del_type");
        //查询的是否是临时表 1是 0不是
        Object tmp_type = req.getParameter("tmp_type");
        //查询是否 是wx二级类型一下文章或者论文 0 不是  1 是
        Object wx_type = req.getParameter("wx_type");
        //查询的类型的id
        Object article_type_id = req.getParameter("article_type_id");
        if (article_type_id != null && "".equals(article_type_id)) {
            article_type_id = null;
        }

        Object startNum = req.getParameter("pageNumber");
        Object pageSize = req.getParameter("pageSize");
        if (type == null || startNum == null || pageSize == null) {
            return getErrorMap();
        }
        //入库的开始时间
        Object updateTimeStart = req.getParameter("updateTimeStart");
        //入库的结束时间
        Object updateTimeEnd = req.getParameter("updateTimeEnd");
        //是否审核 0 未审核  1 审核
        Object checkType = req.getParameter("checkType");
        //搜索内容
        Object message = req.getParameter("message");

        String delTypeSql = " !=1 ";

        if (del_type != null && "1".equals(del_type.toString())) {
            delTypeSql = " =1 ";
        }


        //查询的是文章
        if ("0".equals(type.toString())) {
            //创建的开始时间
            Object createTimeStart = req.getParameter("createTimeStart");
            //创建的结束时间
            Object createTimeEnd = req.getParameter("createTimeEnd");
            //字数大于多少
            Object details_size_more = req.getParameter("details_size_more");
            //字数少于多少
            Object details_size_less = req.getParameter("details_size_less");

            //分数大于多少
            Object article_score_more = req.getParameter("article_score_more");
            //分数小于多少
            Object article_score_less = req.getParameter("article_score_less");


            String sqlCount = "select count(*) as count from zz_wechat.article_tmp a ,zz_wechat.article_type_tmp b where a.del_type  " + delTypeSql +
                    "AND a.article_type_id=b.article_type_id ";
//                    "and a.article_type_id='" + article_type_id + "' ";

            String sqlMessage = "select a.article_id,a.article_type_id,a.article_title,a.article_keyword,a.author,DATE_ADD( a.update_time,INTERVAL -8 HOUR) AS update_time,DATE_ADD( a.create_time,INTERVAL -8 HOUR) AS  create_time ,a.source,a.content_excerpt,a.details_size,a.check_type,a.article_score,b.article_type_name  " +
                    "from zz_wechat.article_tmp a ,zz_wechat.article_type_tmp b where a.del_type " + delTypeSql +
                    " AND a.article_type_id=b.article_type_id ";
//                    " and a.article_type_id='" + article_type_id + "' ";


            if (tmp_type != null && !"1".equals(tmp_type.toString())) {

                sqlCount = "select count(*) as count from zz_wechat.article a ,zz_wechat.article_type b where a.del_type  " + delTypeSql +
                        "AND a.article_type_id=b.article_type_id and  a.state=0 ";
//                        "and a.article_type_id='" + article_type_id + "' ";

                sqlMessage = "select a.article_id,a.article_type_id,a.article_title,a.article_keyword,a.author,DATE_ADD( a.update_time,INTERVAL -8 HOUR) AS update_time,DATE_ADD( a.create_time,INTERVAL -8 HOUR) AS  create_time ,a.source,a.content_excerpt,a.word_count,a.article_score,b.article_type_name  " +
                        "from zz_wechat.article a ,zz_wechat.article_type b where a.del_type " + delTypeSql +
                        " AND a.article_type_id=b.article_type_id and  a.state=0 ";
//                        "and a.article_type_id='" + article_type_id + "' ";

            }

            if (article_type_id != null && !"100".equals(article_type_id)) {
                if("1".equals(wx_type)){
                    String childList = "SELECT article_type_id FROM\n" +
                            "  (\n" +
                            "    SELECT * FROM article_type_tmp  ORDER BY parentid, article_type_id DESC\n" +
                            "  ) realname_sorted,\n" +
                            "  (SELECT @pv :='" +
                            article_type_id +
                            "') initialisation\n" +
                            "  WHERE (FIND_IN_SET(parentid,@pv)>0 And @pv := concat(@pv, ',', article_type_id))";
                    String idString = "'" +
                            article_type_id +
                            "',";
                    List<Map<String, Object>> idlistMaps = jdbcTemplate.queryForList(childList);
                    if (idlistMaps != null && idlistMaps.size() > 0) {
                        for (int i = 0; i < idlistMaps.size(); i++) {
                            idString = idString + "'" + idlistMaps.get(i).get("article_type_id").toString() + "',";
                        }
                    }

                    if (idString.length() > 0) {
                        idString = idString.substring(0, idString.length() - 1);
                    }


                    sqlCount = sqlCount + " and a.article_type_id in (" + idString + ") ";
                    sqlMessage = sqlMessage + " and a.article_type_id in(" + idString + ") ";
                }else {
                    sqlCount = sqlCount + " and a.article_type_id='" + article_type_id + "' ";
                    sqlMessage = sqlMessage + " and a.article_type_id='" + article_type_id + "' ";
                }

            }


            if (updateTimeStart != null && !updateTimeStart.toString().equals("")) {
//                String update_time = DateUtil.getCurrentTimeString(updateTimeStart.toString());
                sqlCount = sqlCount + " and a.update_time>=date_format('" + updateTimeStart.toString() + "','%Y-%m-%d %H:%i:%s')";
                sqlMessage = sqlMessage + " and a.update_time>=date_format('" + updateTimeStart.toString() + "','%Y-%m-%d %H:%i:%s')";
            }


            if (updateTimeEnd != null && !updateTimeEnd.toString().equals("")) {
//                String updateTime = DateUtil.getCurrentTimeString(updateTimeEnd.toString());
                sqlCount = sqlCount + " and a.update_time<=date_format('" + updateTimeEnd.toString() + "','%Y-%m-%d %H:%i:%s')";
                sqlMessage = sqlMessage + " and a.update_time<=date_format('" + updateTimeEnd.toString() + "','%Y-%m-%d %H:%i:%s')";
            }


            if (createTimeStart != null && !createTimeStart.toString().equals("")) {
//                String createTime = DateUtil.getCurrentTimeString(createTimeStart.toString());
                sqlCount = sqlCount + " and a.update_time>=date_format('" + createTimeStart.toString() + "','%Y-%m-%d %H:%i:%s')";
                sqlMessage = sqlMessage + " and a.update_time>=date_format('" + createTimeStart.toString() + "','%Y-%m-%d %H:%i:%s')";
            }

            if (createTimeEnd != null && !createTimeEnd.toString().equals("")) {
//                String createTime = DateUtil.getCurrentTimeString(createTimeEnd.toString());
                sqlCount = sqlCount + " and a.update_time<=date_format('" + createTimeEnd.toString() + "','%Y-%m-%d %H:%i:%s')";
                sqlMessage = sqlMessage + " and a.update_time<=date_format('" + createTimeEnd.toString() + "','%Y-%m-%d %H:%i:%s')";
            }

            if (details_size_more != null && !details_size_more.toString().equals("")) {
                if (tmp_type != null && !"1".equals(tmp_type.toString())) {
                    sqlCount = sqlCount + " and a.word_count>=" + Integer.parseInt(details_size_more.toString());
                    sqlMessage = sqlMessage + " and a.word_count>=" + Integer.parseInt(details_size_more.toString());

                } else {
                    sqlCount = sqlCount + " and a.details_size>=" + Integer.parseInt(details_size_more.toString());
                    sqlMessage = sqlMessage + " and a.details_size>=" + Integer.parseInt(details_size_more.toString());
                }
            }
            if (details_size_less != null && !details_size_less.toString().equals("")) {


                if (tmp_type != null && !"1".equals(tmp_type.toString())) {
                    sqlCount = sqlCount + " and a.word_count<=" + Integer.parseInt(details_size_less.toString());
                    sqlMessage = sqlMessage + " and a.word_count<=" + Integer.parseInt(details_size_less.toString());

                } else {
                    sqlCount = sqlCount + " and a.details_size<=" + Integer.parseInt(details_size_less.toString());
                    sqlMessage = sqlMessage + " and a.details_size<=" + Integer.parseInt(details_size_less.toString());

                }

            }
            //分数
            if (article_score_more != null && !article_score_more.toString().equals("")) {
                sqlCount = sqlCount + " and a.article_score>=" + Integer.parseInt(article_score_more.toString());
                sqlMessage = sqlMessage + " and a.article_score>=" + Integer.parseInt(article_score_more.toString());
            }
            if (article_score_less != null && !article_score_less.toString().equals("")) {
                sqlCount = sqlCount + " and a.article_score<=" + Integer.parseInt(article_score_less.toString());
                sqlMessage = sqlMessage + " and a.article_score<=" + Integer.parseInt(article_score_less.toString());
            }
            if (message != null && !message.toString().equals("")) {
                sqlCount = sqlCount + " and (a.article_title like '%" + message.toString() + "%' or a.author like '%" + message.toString() + "%' or a.source like '%" + message.toString() + "%' )";
                sqlMessage = sqlMessage + " and (a.article_title like '%" + message.toString() + "%' or a.author like '%" + message.toString() + "%' or a.source like '%" + message.toString() + "%' )";
            }
            if (checkType != null && !checkType.toString().equals("")) {
                sqlCount = sqlCount + " and a.check_type=" + Integer.parseInt(checkType.toString());
                sqlMessage = sqlMessage + " and a.check_type=" + Integer.parseInt(checkType.toString());
            }


            sqlMessage = sqlMessage + " ORDER BY a.update_time desc";
            Page<Map<String, Object>> page = jdbc.queryForPage(Integer.parseInt(startNum.toString()), Integer.parseInt(pageSize.toString()), sqlCount, sqlMessage, new Object[]{});
            map.put("code", 0);
            map.put("message", "查询成功");
            map.put("total", page.getTotalCount());
            map.put("result", page.getResult());
            return map;


        } else {
            //创建时间
            Object createTime = req.getParameter("createTime");

            Object language = req.getParameter("language");//0  中文  1 英文

            //查询的是论文
            String sqlCount = "select count(*) as count from zz_wechat.academic_paper a ,zz_wechat.article_type_tmp b where a.del_type  " + delTypeSql +
                    " AND a.article_type_id=b.article_type_id ";
//                    "and a.article_type_id='" + article_type_id + "' ";

            String sqlMessage = "select a.article_id,a.article_type_id,a.article_title,a.article_keyword,a.author,DATE_ADD( a.update_time,INTERVAL -8 HOUR) AS update_time,a.create_time ,a.source,a.content_excerpt,a.check_type,a.reference,a.article_score,b.article_type_name  " +
                    "from zz_wechat.academic_paper a ,zz_wechat.article_type_tmp b where a.del_type " + delTypeSql +
                    " AND a.article_type_id=b.article_type_id ";
//                    "and a.article_type_id='" + article_type_id + "' ";


            if (tmp_type != null && !"1".equals(tmp_type.toString())) {

                sqlMessage = "select a.article_id,a.article_type_id,a.article_title,a.article_keyword,a.author,DATE_ADD( a.update_time,INTERVAL -8 HOUR) AS update_time,a.paper_create_time ,a.source,a.content_excerpt,a.check_type,a.reference,a.article_score,b.article_type_name  " +
                        "from zz_wechat.article a ,zz_wechat.article_type b where a.del_type " + delTypeSql +
                        " AND a.article_type_id=b.article_type_id and  a.state=1 ";
//                        "and a.article_type_id='" + article_type_id + "' ";

                if (language != null && "1".equals(language)) {
                    sqlMessage = "select a.article_id,a.article_type_id,a.article_title_e,a.article_keyword_e,a.author_e,DATE_ADD( a.update_time,INTERVAL -8 HOUR) AS update_time,a.paper_create_time,a.source,a.content_excerpt_e,a.reference,a.article_score,b.article_type_name  " +
                            "from zz_wechat.article a ,zz_wechat.article_type b where a.del_type " + delTypeSql +
                            " AND a.article_type_id=b.article_type_id and  a.state=1 ";
//                            "and a.article_type_id='" + article_type_id + "' ";
                }


                sqlCount = "select count(*) as count from zz_wechat.article a ,zz_wechat.article_type b where a.del_type  " + delTypeSql +
                        " AND a.article_type_id=b.article_type_id ";
//                        "and a.article_type_id='" + article_type_id + "' ";


            } else {

                if (language != null && "1".equals(language)) {
                    sqlMessage = "select a.article_id,a.article_type_id,a.article_title_e,a.article_keyword_e,a.author_e,DATE_ADD( a.update_time,INTERVAL -8 HOUR) AS update_time,a.create_time ,a.source,a.content_excerpt_e,a.reference,a.article_score,a.check_type,b.article_type_name  " +
                            "from zz_wechat.academic_paper a ,zz_wechat.article_type_tmp b where a.del_type " + delTypeSql +
                            " AND a.article_type_id=b.article_type_id and  a.state=1  ";
//                            "and a.article_type_id='" + article_type_id + "' ";
                }


            }


            if (article_type_id != null && !"100".equals(article_type_id)) {
                if("1".equals(wx_type)){
                    String childList = "SELECT article_type_id FROM\n" +
                            "  (\n" +
                            "    SELECT * FROM article_type_tmp  ORDER BY parentid, article_type_id DESC\n" +
                            "  ) realname_sorted,\n" +
                            "  (SELECT @pv :='" +
                            article_type_id +
                            "') initialisation\n" +
                            "  WHERE (FIND_IN_SET(parentid,@pv)>0 And @pv := concat(@pv, ',', article_type_id))";
                    String idString = "'" +
                            article_type_id +
                            "',";
                    List<Map<String, Object>> idlistMaps = jdbcTemplate.queryForList(childList);
                    if (idlistMaps != null && idlistMaps.size() > 0) {
                        for (int i = 0; i < idlistMaps.size(); i++) {
                            idString = idString + "'" + idlistMaps.get(i).get("article_type_id").toString() + "',";
                        }
                    }

                    if (idString.length() > 0) {
                        idString = idString.substring(0, idString.length() - 1);
                    }

                    sqlCount = sqlCount + " and a.article_type_id in (" + article_type_id + ") ";
                    sqlMessage = sqlMessage + " and a.article_type_id in(" + article_type_id + ") ";
                }else {
                    sqlCount = sqlCount + " and a.article_type_id='" + article_type_id + "' ";
                    sqlMessage = sqlMessage + " and a.article_type_id='" + article_type_id + "' ";
                }
            }

            //入库时间
            if (updateTimeStart != null && !updateTimeStart.toString().equals("")) {
//                String update_time = DateUtil.getCurrentTimeString(updateTimeStart.toString());
                sqlCount = sqlCount + " and a.update_time>=date_format('" + updateTimeStart.toString() + "','%Y-%m-%d %H:%i:%s')";
                sqlMessage = sqlMessage + " and a.update_time>=date_format('" + updateTimeStart.toString() + "','%Y-%m-%d %H:%i:%s')";
            }


            if (updateTimeEnd != null && !updateTimeEnd.toString().equals("")) {
//                String updateTime = DateUtil.getCurrentTimeString(updateTimeEnd.toString());
                sqlCount = sqlCount + " and a.update_time<=date_format('" + updateTimeEnd.toString() + "','%Y-%m-%d %H:%i:%s')";
                sqlMessage = sqlMessage + " and a.update_time<=date_format('" + updateTimeEnd.toString() + "','%Y-%m-%d %H:%i:%s')";
            }


            if (message != null && !message.toString().equals("")) {
                sqlCount = sqlCount + " and (a.article_title like '%" + message.toString() + "%' or a.author like '%" + message.toString() + "%' or a.source like '%" + message.toString() + "%' )";
                sqlMessage = sqlMessage + " and (a.article_title like '%" + message.toString() + "%' or a.author like '%" + message.toString() + "%' or a.source like '%" + message.toString() + "%' )";
            }


            if (checkType != null && !checkType.toString().equals("")) {
                sqlCount = sqlCount + " and a.check_type=" + Integer.parseInt(checkType.toString());
                sqlMessage = sqlMessage + " and a.check_type=" + Integer.parseInt(checkType.toString());
            }


            if (createTime != null && !createTime.toString().equals("")) {

                if (tmp_type != null && !"1".equals(tmp_type.toString())) {
                    sqlCount = sqlCount + " and a.paper_create_time like '%" + createTime + "%'";
                    sqlMessage = sqlMessage + " and a.paper_create_time like '%" + createTime + "%'";
                } else {
                    sqlCount = sqlCount + " and a.create_time like '%" + createTime + "%'";
                    sqlMessage = sqlMessage + " and a.create_time like '%" + createTime + "%'";
                }

            }

            sqlMessage = sqlMessage + " ORDER BY a.update_time asc";
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
        String updatePaperSql = "update zz_wechat.academic_paper set del_type=1 where article_id in (" + idList + ")";
        jdbcTemplate.update(updateSql);
        jdbcTemplate.update(updatePaperSql);
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


        } else {


            String sql = "select a.* from zz_wechat.academic_paper a ,zz_wechat.article_type_tmp b " +
                    " where a.del_type !=1 AND a.article_type_id=b.article_type_id and a.article_id='" +
                    articleId +
                    "'  ";
            Map<String, Object> map = jdbcTemplate.queryForMap(sql);
            HashMap<String, Object> result = new HashMap<>();
            result.put("code", 0);
            result.put("message", "查询成功");
            result.put("result", map);

            return result;

        }


    }

    @Override
    public Map<String, Object> getAricleTmpCheckById(String articleId, String type) {
        if (articleId == null || type == null) {
            return getErrorMap();
        }
        String idList = "";
        String[] split = articleId.split(",");
        for (int i = 0; i < split.length; i++) {
            idList = idList + "'" + split[i].toString() + "',";
        }
        idList = idList.substring(0, idList.length() - 1);
        if ("0".equals(type)) {

            String updateSql = "update zz_wechat.article_tmp set check_type=1 where article_id in (" + idList + ")";
            jdbcTemplate.update(updateSql);
            HashMap<String, Object> map = new HashMap<>();
            map.put("code", 0);
            map.put("message", "审核成功！");
            return map;
        } else {
            String updateSql = "update zz_wechat.academic_paper set check_type=1 where article_id in (" + idList + ")";
            jdbcTemplate.update(updateSql);
            HashMap<String, Object> map = new HashMap<>();
            map.put("code", 0);
            map.put("message", "审核成功！");
            return map;

        }
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
        Object article_score = data.get("article_score");
        if (type == null || article_id == null || article_type_id == null || article_title == null || article_keyword == null || create_time == null
                || content_excerpt == null) {
            return getErrorMap();
        }


        Object author = data.get("author");

        Object source = data.get("source");

        String currentTimeString = DateUtil.getCurrentTimeString();
        if ("0".equals(type)) {
            Object details_txt = data.get("details_txt");
            Object details_div = data.get("details_div");

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
            //论文更新

            Object article_title_e = data.get("article_title_e");
            Object content_excerpt_e = data.get("content_excerpt_e");
            Object article_keyword_e = data.get("article_keyword_e");
            Object author_e = data.get("author_e");
            Object reference = data.get("reference");
            Object site_number = data.get("site_number");
            Object publication_date = data.get("publication_date");
            Object tmp_type = data.get("tmp_type");

            String sql = "update zz_wechat.academic_paper set article_type_id=?,article_title=?,article_keyword=?,author=?,source=?," +
                    "content_excerpt=?,status=?,article_score=?,del_type=?," +
                    " create_time=?,update_time=date_format(?,'%Y-%m-%d %H:%i:%s') ,article_title_e=?,content_excerpt_e=?,article_keyword_e=?" +
                    ",author_e=?,reference=?,site_number=?,publication_date=?,article_score=? " +
                    "where article_id=?";

            if ("1".equals(tmp_type)) {

                sql = "update zz_wechat.article set article_type_id=?,article_title=?,article_keyword=?,author=?,source=?," +
                        "content_excerpt=?,status=?,article_score=?,del_type=?," +
                        " paper_create_time=?,update_time=date_format(?,'%Y-%m-%d %H:%i:%s') ,article_title_e=?,content_excerpt_e=?,article_keyword_e=?" +
                        ",author_e=?,reference=?,site_number=?,publication_date=?,article_score=? " +
                        "where article_id=?";

            }

            int update = jdbcTemplate.update(sql, new Object[]{
                    article_type_id.toString(),
                    article_title.toString(),
                    article_keyword.toString(),
                    author,
                    source,
                    content_excerpt.toString(),
                    "1",
                    Integer.parseInt(article_score.toString()),
                    "0",
                    create_time,
                    currentTimeString,
                    article_title_e,
                    content_excerpt_e,
                    article_keyword_e,
                    author_e,
                    reference,
                    site_number,
                    publication_date,
                    article_score,
                    article_id.toString()
            });
            HashMap<String, Object> map = new HashMap<>();
            map.put("code", 0);
            map.put("message", "更新成功！");
            return map;

        }

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
                        0,
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
        } else {
            //论文发表

            String sql = "select * from zz_wechat.academic_paper where article_id in(" + idList + ")";
            List<Map<String, Object>> mapList = jdbcTemplate.queryForList(sql);
            for (int i = 0; i < mapList.size(); i++) {

                Map<String, Object> paper = mapList.get(i);
                String insertSql = "insert into zz_wechat.article (article_id,article_type_id,article_title,article_keyword,author,source" +
                        ",share_count,collect_count,collect_initcount,share_initcount,content_type,content_excerpt," +
                        "del_type,state " +
                        ",paper_create_time,update_time," +
                        "posting_name,article_title_e,content_excerpt_e,pdf_path,article_keyword_e,author_e," +
                        "reference,site_number,publication_date,article_score" +
                        ") values(?,?,?,?,?,?," +
                        "?,?,?,?,?,?,?,?" +
                        ",?,date_format(?,'%Y-%m-%d %H:%i:%s')" +
                        ",?,?,?,?,?,?," +
                        "?,?,?,?)";


                int update = jdbcTemplate.update(insertSql, new Object[]{
                        paper.get("article_id"),
                        paper.get("article_type_id"),
                        paper.get("article_title"),
                        paper.get("article_keyword"),
                        paper.get("author"),
                        paper.get("source"),
                        0,
                        0,
                        0,
                        0,
                        2,
                        paper.get("content_excerpt"),
                        0,
                        1,
                        paper.get("create_time"),
                        DateUtil.getCurrentTimeString(),
                        paper.get("posting_name"),
                        paper.get("article_title_e"),
                        paper.get("content_excerpt_e"),
                        paper.get("pdf_path"),
                        paper.get("article_keyword_e"),
                        paper.get("author_e"),
                        paper.get("reference"),
                        paper.get("site_number"),
                        paper.get("publication_date"),
                        paper.get("article_score")

                });

                if (update == 1) {
                    String delSql = "DELETE  from zz_wechat.academic_paper where article_id=?";
                    jdbcTemplate.update(delSql, new Object[]{
                            paper.get("article_id")
                    });
                }


            }

            HashMap<String, Object> map = new HashMap<>();
            map.put("code", 0);
            map.put("message", "更新成功！");
            return map;
        }


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
            Object type = data.get("type");
            Object merge_type_id = data.get("merge_type_id");
            if (article_type_id == null || merge_type_id == null) {
                return 0;
            }
            //要合并的id
            String[] merge_type_idList = merge_type_id.toString().split(",");
            String mergeIdList = "";
            String sql = "";
            if ("0".equals(type) || type == null) {
                sql = "select parentid from zz_wechat.article_type_tmp where article_type_id=?";
            } else {
                sql = "select parentid from zz_wechat.article_type where article_type_id=?";
            }
            Map<String, Object> map = jdbcTemplate.queryForMap(sql, new Object[]{
                    article_type_id.toString()
            });
            String parent_id = map.get("parentid").toString();

            for (int i = 0; i < merge_type_idList.length; i++) {
                mergeIdList = mergeIdList + "'" + merge_type_idList[i].toString() + "',";


                //对要合并的类型插入到临时表
                String Changesql = "select count(*) as count from zz_wechat.change_article_type where article_type_id=? and type=?";
                Map<String, Object> changeMap = jdbcTemplate.queryForMap(Changesql, new Object[]{
                        merge_type_idList[i].toString(),
                        0
                });
                //插入
                if (changeMap != null && changeMap.get("count") != null
                        && Integer.parseInt(changeMap.get("count").toString()) == 0) {
                    String insertChangeTypeSql = "insert into zz_wechat.change_article_type(article_type_id,parent_id,type,update_time,keep_type_id) values(?,?,0,now(),article_type_id)";
                    jdbcTemplate.update(insertChangeTypeSql, new Object[]{
                            merge_type_idList[i].toString(),
                            parent_id
                    });

                } else {
                    //更新

                    String insertChangeTypeSql = "UPDATE  zz_wechat.change_article_type SET parent_id=?,update_time=? ,keep_type_id=? where article_type_id=? AND type=? ";
                    jdbcTemplate.update(insertChangeTypeSql, new Object[]{
                            parent_id,
                            DateUtil.getCurrentTimeString(),
                            article_type_id,
                            merge_type_idList[i].toString(),
                            0
                    });
                }


            }
            mergeIdList = mergeIdList.substring(0, mergeIdList.length() - 1);

            //更新临时表中的子节点 的parendid
            String tmpChildSql = "update zz_wechat.article_type_tmp set parentid='" + article_type_id + "' where parentid in(" +
                    mergeIdList +
                    " )";
            //更新正式表中的子节点 的parendid
            String childSql = "update zz_wechat.article_type set parentid='" + article_type_id + "' where parentid in(" +
                    mergeIdList +
                    " )";
            jdbcTemplate.update(tmpChildSql);
            jdbcTemplate.update(childSql);

            //更新临时文章表中 类型id
            String updateArticleTmpSql = "update zz_wechat.article_tmp set article_type_id='" +
                    article_type_id +
                    "' WHERE article_id  " +
                    "in ( SELECT article_id from (SELECT article_id from zz_wechat.article_tmp WHERE article_type_id in (" +
                    mergeIdList +
                    "))as  a)";

            jdbcTemplate.update(updateArticleTmpSql);


            //更新临时表论文中的 类型id
            String updatePaperTmpSql = "update zz_wechat.academic_paper set article_type_id='" +
                    article_type_id +
                    "' WHERE article_id  " +
                    "in ( SELECT article_id from (SELECT article_id from zz_wechat.academic_paper WHERE article_type_id in (" +
                    mergeIdList +
                    "))as  a)";

            jdbcTemplate.update(updatePaperTmpSql);


            //更新正式文章表中 类型id
            String updateArticleSql = "update zz_wechat.article set article_type_id='" +
                    article_type_id +
                    "' WHERE article_id  " +
                    "in ( SELECT article_id from (SELECT article_id from zz_wechat.article WHERE article_type_id in (" +
                    mergeIdList +
                    "))as  a)";

            jdbcTemplate.update(updateArticleSql);


            //删除临时表中的合并的id
            String deltmpChildSql = "delete from zz_wechat.article_type_tmp where article_type_id in (" + mergeIdList + ")";
            jdbcTemplate.update(deltmpChildSql);
            //删除正式表中的合并的id
            String delChildSql = "update zz_wechat.article_type set del_type=1 where article_type_id  in (" + mergeIdList + ")";
            jdbcTemplate.update(delChildSql);

        } catch (Exception e) {
            return 0;
        }
        return 1;
    }

    /**
     * 得到posting 列表
     *
     * @param data
     * @return
     */
    @Override
    public Map<String, Object> getPostingList(Map<String, Object> data) {

        Object startNum = data.get("pageNumber");
        Object pageSize = data.get("pageSize");
        Object message = data.get("message");

        if (startNum == null || pageSize == null) {
            return getErrorMap();
        }

        String countSql = "select count(*) as count from zz_wechat.posting_paper ";

        String sqlMessage = "select posting_id,posting_name,image_path from zz_wechat.posting_paper ";
        if (message != null) {
            countSql = countSql + " where posting_name like '%" + message.toString() + "%'";
            sqlMessage = sqlMessage + " where posting_name like '%" + message.toString() + "%'";
        }
        Map<String, Object> map = new HashMap<>();
        sqlMessage = sqlMessage + " ORDER BY posting_id asc";
        Page<Map<String, Object>> page = jdbc.queryForPage(Integer.parseInt(startNum.toString()), Integer.parseInt(pageSize.toString()), countSql, sqlMessage, new Object[]{});
        map.put("code", 0);
        map.put("message", "查询成功");
        map.put("total", page.getTotalCount());
        map.put("result", page.getResult());
        return map;

    }

    @Override
    public Map<String, Object> getPostingMessage(String posting_id) {
        try {
            if (posting_id == null) {
                return getErrorMap();
            }
            Map<String, Object> resultMap = new HashMap<>();
            String sql = "select posting_id,posting_name,image_path from zz_wechat.posting_paper where posting_id=?";
            Map<String, Object> map = jdbcTemplate.queryForMap(sql, new Object[]{
                    Integer.parseInt(posting_id)

            });
            resultMap.put("code", 0);
            resultMap.put("message", "查询成功");

            resultMap.put("result", map);
            return resultMap;
        } catch (Exception e) {
            return getErrorMap();
        }
    }

    @Override
    public int updatePostingImage(String posting_id, String pathICon) {

        String updateSql = "update zz_wechat.posting_paper set image_path=? where posting_id=?";
        int update = jdbcTemplate.update(updateSql, new Object[]{
                pathICon,
                Integer.parseInt(posting_id)
        });
        return update;
    }

    @Override
    public Map<String, Object> delArticleTypeById(String article_type_id) {
        if (article_type_id == null) {
            return getErrorMap();
        }

        try {
            String childList = "SELECT article_type_id FROM\n" +
                    "  (\n" +
                    "    SELECT * FROM article_type_tmp ORDER BY parentid, article_type_id DESC\n" +
                    "  ) realname_sorted,\n" +
                    "  (SELECT @pv :='" +
                    article_type_id +
                    "') initialisation\n" +
                    "  WHERE (FIND_IN_SET(parentid,@pv)>0 And @pv := concat(@pv, ',', article_type_id))";
            String idString = "'" +
                    article_type_id +
                    "',";
            List<Map<String, Object>> idlistMaps = jdbcTemplate.queryForList(childList);
            if (idlistMaps != null && idlistMaps.size() > 0) {
                for (int i = 0; i < idlistMaps.size(); i++) {
                    idString = idString + "'" + idlistMaps.get(i).get("article_type_id").toString() + "',";
                }

            }

            if (idString.length() > 0) {
                idString = idString.substring(0, idString.length() - 1);
            }
            //删除类型的临时表
            String delTypeTmpsql = "delete from zz_wechat.article_type_tmp where article_type_id in(" + idString + ")";

            //删除文章的临时表
            String delArticleTmpsql = "delete from zz_wechat.article_tmp where article_type_id in(" + idString + ")";

            //删除论文的临时表
            String delPaperTmpsql = "delete from zz_wechat.academic_paper where article_type_id in(" + idString + ")";

            // 更新正式表类型del_type
            String updateTypeSql = "update zz_wechat.article_type set del_type=1 where article_type_id in (" + idString + ")";


            // 更新正式表类型del_type
            String updateArticleSql = "update zz_wechat.article set del_type=1 where article_type_id in (" + idString + ")";

            int update = jdbcTemplate.update(delTypeTmpsql);
            int update1 = jdbcTemplate.update(delArticleTmpsql);
            int update2 = jdbcTemplate.update(delPaperTmpsql);
            int update3 = jdbcTemplate.update(updateTypeSql);
            int update4 = jdbcTemplate.update(updateArticleSql);
            HashMap<String, Object> map = new HashMap<>();
            map.put("code", 0);
            map.put("message", "更新成功！");
            return map;
        } catch (Exception e) {
            return getErrorMapService();
        }

    }

    @Override
    public List<Map<String, Object>> combinedScore(int i) {
        String sql = "select  article_type_id,article_type_name_old from zz_wechat.article_type_tmp where del_type !=? and parentid !=? and type_state=?";
        List<Map<String, Object>> maps = jdbcTemplate.queryForList(sql, new Object[]{
                1,
                -1,
                i
        });
        return maps;
    }

    @Override
    public Map getAllIssueArticleType(String type) {

        String sql = "";
        if ("0".equals(type)) {
            sql = "select article_type_id,article_type_name,parentid,type_state,issue from zz_wechat.article_type_tmp where issue=1 and del_type=0 and parentid !='100' and parentid !='1'";

        } else if ("1".equals(type)) {
            sql = "select article_type_id,article_type_name,parentid,type_state from zz_wechat.article_type where del_type=0 and parentid !='100' and parentid !='1'";
        } else {
            sql = "select article_type_id,article_type_name,parentid,type_state,issue from zz_wechat.article_type_tmp where del_type=0 and parentid !='100' and parentid !='1'";

        }
        List<Map<String, Object>> maps = jdbcTemplate.queryForList(sql);
        HashMap<String, Object> map = new HashMap<>();
        map.put("code", 0);
        map.put("message", "查询成功！");
        map.put("result", maps);
        return map;
    }

    @Override
    public Map seachArticleType(String type, String message) {

        String sql = "";
        if ("0".equals(type)) {
            sql = "select article_type_id,article_type_name,parentid,type_state,issue from zz_wechat.article_type_tmp where 1=1 ";
        } else {
            sql = "select article_type_id,article_type_name,parentid,type_state from zz_wechat.article_type where 1=1 ";
        }

        if (message != null && !"".equals(message)) {
            sql = sql + " and article_type_name like '%" + message + "%'";
        }


        List<Map<String, Object>> maps = jdbcTemplate.queryForList(sql);
        HashMap<String, Object> map = new HashMap<>();
        map.put("code", 0);
        map.put("message", "查询成功！");
        map.put("result", maps);
        return map;
    }

    @Override
    public Map pushArticleType(String typeId, String type) {
        if (typeId == null || "".equals(typeId)) {
            return getErrorMap();
        }

        String[] split = typeId.split(",");
        try {
            for (int i = 0; i < split.length; i++) {
                String artcicle_type_id = split[i];
                String updateTypeSql = "update zz_wechat.article_type_tmp set issue=? where article_type_id =?";
                jdbcTemplate.update(updateTypeSql, new Object[]{
                        1,
                        artcicle_type_id
                });
                String typeSql = "select * from zz_wechat.article_type_tmp where article_type_id=?";
                Map<String, Object> typeMap = jdbcTemplate.queryForMap(typeSql, new Object[]{
                        artcicle_type_id
                });

                //type 0 是发布 1 取消发布
                if ("0".equals(type) || type.isEmpty()) {
                    try {
                        String sqlCount = "select count(*) as count from zz_wechat.article_type where article_type_id=?";
                        Map<String, Object> map = jdbcTemplate.queryForMap(sqlCount, new Object[]{
                                artcicle_type_id
                        });
                        if (map != null && map.get("count") != null && Integer.parseInt(map.get("count").toString()) == 0) {
                            //插入实际的类型表
                            String currentTime = DateUtil.getCurrentTimeString();
                            String insertSqlt = "insert into (artcicle_type_id,article_type_keyword,article_type_name,iamge_icon,iamge_back,parentid,del_type,create_time,type_state) values " +
                                    "(?,?,?,?,?,?,?,date_format(?,'%Y-%m-%d %H:%i:%s'),?)";
                            jdbcTemplate.update(insertSqlt, new Object[]{
                                    artcicle_type_id,
                                    typeMap.get("article_type_keyword"),
                                    typeMap.get("article_type_name"),
                                    typeMap.get("iamge_icon"),
                                    typeMap.get("iamge_back"),
                                    typeMap.get("parentid"),
                                    0,
                                    currentTime,
                                    Integer.parseInt(typeMap.get("type_state").toString())

                            });
                        }
                    } catch (Exception e) {
                        //插入实际的类型表
                        String currentTime = DateUtil.getCurrentTimeString();
                        String insertSqlt = "insert into zz_wechat.article_type(article_type_id,article_type_keyword,article_type_name,iamge_icon,iamge_back,parentid,del_type,create_time,type_state) values " +
                                "(?,?,?,?,?,?,?,date_format(?,'%Y-%m-%d %H:%i:%s'),? )";
                        jdbcTemplate.update(insertSqlt, new Object[]{
                                artcicle_type_id,
                                typeMap.get("article_type_keyword"),
                                typeMap.get("article_type_name"),
                                typeMap.get("iamge_icon"),
                                typeMap.get("iamge_back"),
                                typeMap.get("parentid"),
                                0,
                                currentTime,
                                Integer.parseInt(typeMap.get("type_state").toString())
                        });
                    }
                } else {
                    //临时表
                    String sqlTmp = "update zz_wechat.article_type_tmp set issue=0 where article_type_id ='" + artcicle_type_id + "'";
                    //正式表
                    String sql = "update zz_wechat.article_type set issue=0 where article_type_id ='" + artcicle_type_id + "'";
                    jdbcTemplate.update(sqlTmp);
                    jdbcTemplate.update(sql);
                }
            }
        } catch (Exception e) {
            System.out.println(e);
            return getErrorMapService();

        }
        HashMap<String, Object> map = new HashMap<>();
        map.put("code", 0);
        map.put("message", "操作成功！");
        return map;

    }

    @Override
    public String getArticleNameById(String id1) {

        String sql = "select article_type_name from zz_wechat.article_type_tmp where article_type_id=?";
        Map<String, Object> map = jdbcTemplate.queryForMap(sql, new Object[]{
                id1
        });
        return map.get("article_type_name") == null ? "" : map.get("article_type_name").toString();
    }

    @Override
    public Map getWxArticleList(Map<String, Object> data) {


        return null;
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

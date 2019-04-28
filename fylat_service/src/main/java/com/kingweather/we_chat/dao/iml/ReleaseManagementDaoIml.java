package com.kingweather.we_chat.dao.iml;

import com.fasterxml.jackson.databind.deser.std.FromStringDeserializer;
import com.google.common.collect.Lists;
import com.kingweather.common.jdbc.JdbcUtil;
import com.kingweather.common.util.DateUtil;
import com.kingweather.common.util.Page;
import com.kingweather.we_chat.dao.ReleaseManagementDao;
import org.mozilla.universalchardet.UniversalDetector;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.util.*;

@Repository
public class ReleaseManagementDaoIml implements ReleaseManagementDao {
    @Resource
    private JdbcTemplate jdbcTemplate;
    @Resource
    private JdbcUtil jdbc;

    @Override
    public List<Map> getTypeMenuTree(String parent_id, String type, String delType, int value) {
        int del = 1;//默认查询的是没有删除的文章
        if ("0".equals(delType)) {
            del = 0;
        }

        String sql = "select article_type_id as id,article_type_name as text,article_type_keyword,iamge_icon,iamge_back,parentid,type_state,issue,article_type_name_old,article_type_keyword_old,del_type,domain_id from zz_wechat.article_type_tmp where del_type!=? and parentid=?";

        if ("1".equals(type)) {

            if (value != 0) {
                sql = "select article_type_id as id,article_type_name as text,article_type_keyword,iamge_icon,iamge_back,parentid,type_state,issue,del_type,domain_id from zz_wechat.article_type where del_type!=? and domain_id=?  and parentid !=100 AND  issue=1";
            } else {
                sql = "select article_type_id as id,article_type_name as text,article_type_keyword,iamge_icon,iamge_back,parentid,type_state, issue,del_type,domain_id  from zz_wechat.article_type where del_type!=? and parentid=? AND  issue=1";

            }
        } else if ("2".equals(type)) {
            sql = "select article_type_id as id,article_type_name as text,article_type_keyword,iamge_icon,iamge_back,parentid,type_state,issue,article_type_name_old,article_type_keyword_old ,del_type from zz_wechat.article_type_tmp where del_type!=? and parentid=? AND type_state !=1";

        }
        List maps = jdbcTemplate.queryForList(sql, new Object[]{
                del, parent_id

        });
        if (maps != null && !"1".equals(type)) {
            maps.stream().forEach(s -> {
                Map map = (Map<String, Object>) s;
                Map userdata1 = new HashMap();
                userdata1.put("name", "issue");
                userdata1.put("content", map.get("issue"));
                Map userdata2 = new HashMap();
                userdata2.put("name", "type_state");
                userdata2.put("content", map.get("type_state"));
//                map.put("userdata", Lists.newArrayList(userdata1,userdata2));
                Map userdata3 = new HashMap();
                userdata3.put("name", "del_type");
                userdata3.put("content", map.get("del_type"));
                map.put("userdata", Lists.newArrayList(userdata1, userdata2, userdata3));
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
    @Transactional
    public int updateTypeMessage(String name, String keyword, String artcicle_type_id, String pathICon, String pathBack, String parentid, String type) {
        try {
            //获取领域id
            Object domain_id = parentid;
            Map<String, Object> maps = new HashMap<>();
            if ("-1".equals(parentid) || "100".equals(parentid)) {
                domain_id = artcicle_type_id;
            } else {
                try {
                    String typeSql = "select domain_id from zz_wechat.article_type_tmp where article_type_id=?";
                    maps = jdbcTemplate.queryForMap(typeSql, new Object[]{
                            parentid.toString()
                    });

                } catch (Exception e) {


                }

                if (maps == null || maps.get("domain_id") == null) {
                    try {
                        String typeSql = "select domain_id from zz_wechat.article_type where article_type_id=?";
                        maps = jdbcTemplate.queryForMap(typeSql, new Object[]{
                                parentid.toString()
                        });

                    } catch (Exception e) {


                    }
                }

                if (maps != null && maps.get("domain_id") != null) {
                    domain_id = maps.get("domain_id");

                }
            }


            String childList = getChildList(artcicle_type_id, "1");
            String childList2 = getChildList(artcicle_type_id, "0");

            //临时表
            String sqlTmp = "update zz_wechat.article_type_tmp set domain_id='" +
                    domain_id +
                    "' where article_type_id in(" + childList + ")";
            //正式表
            String sql = "update zz_wechat.article_type set domain_id='" +
                    domain_id +
                    "' where article_type_id in(" + childList + ")";
            String sql2 = "update zz_wechat.article_type set domain_id='" +
                    domain_id +
                    "' where article_type_id in(" + childList2 + ")";
            jdbcTemplate.update(sqlTmp);
            jdbcTemplate.update(sql);
            jdbcTemplate.update(sql2);


            String updateSqlTmp = "update  zz_wechat.article_type_tmp set article_type_name=?,article_type_keyword=?,iamge_icon=?,iamge_back=?,status=?, parentid=?,domain_id=?,update_time=now()  where article_type_id=?";
            int update = jdbcTemplate.update(updateSqlTmp, new Object[]{
                    name,
                    keyword,
                    pathICon,
                    pathBack,
                    "1",
                    parentid,
                    domain_id,
                    artcicle_type_id

            });


            try {
                String sqlCount = "select count(*) as count from zz_wechat.article_type where article_type_id=?";
                Map<String, Object> map = jdbcTemplate.queryForMap(sqlCount, new Object[]{
                        artcicle_type_id
                });
                if (map != null && map.get("count") != null && Integer.parseInt(map.get("count").toString()) == 0) {

                } else {
                    String updateSql = "update zz_wechat.article_type set article_type_name=?,article_type_keyword=?,iamge_icon=?,iamge_back=?, parentid=? ,del_type=?,domain_id=? ,update_time=now()  where article_type_id=?";
                    jdbcTemplate.update(updateSql, new Object[]{

                            name,
                            keyword,
                            pathICon,
                            pathBack,
                            parentid,
                            0,
                            domain_id,
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


        //获取领域id
        Object domain_id = parentid;
        Map<String, Object> maps = new HashMap<>();
        if ("-1".equals(parentid) || "100".equals(parentid)) {
            domain_id = article_type_id;
        } else {
            try {
                String typeSql = "select domain_id from zz_wechat.article_type_tmp where article_type_id=?";
                maps = jdbcTemplate.queryForMap(typeSql, new Object[]{
                        parentid.toString()
                });

            } catch (Exception e) {


            }

            if (maps == null || maps.get("domain_id") == null) {
                try {
                    String typeSql = "select domain_id from zz_wechat.article_type where article_type_id=?";
                    maps = jdbcTemplate.queryForMap(typeSql, new Object[]{
                            parentid.toString()
                    });

                } catch (Exception e) {
                }
            }

            if (maps != null && maps.get("domain_id") != null) {
                domain_id = maps.get("domain_id");

            }
        }

        String idlist = getChildList(article_type_id, "1");
        String updateSqlTmp = "update zz_wechat.article_type_tmp set domain_id='" +
                domain_id +
                "'   where article_type_id in(" +
                idlist +
                ")";

        String sql = "update zz_wechat.article_type_tmp set parentid=? where article_type_id=?";

        jdbcTemplate.update(sql, new Object[]{
                parentid,
                article_type_id
        });
        int update = jdbcTemplate.update(updateSqlTmp);

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
            String sqlCount = "select count(*) as count from zz_wechat.article_type where article_type_id=?";
            Map<String, Object> map = jdbcTemplate.queryForMap(sqlCount, new Object[]{
                    article_type_id
            });
            if (map != null && map.get("count") != null && Integer.parseInt(map.get("count").toString()) == 1) {
                String idlist2 = getChildList(article_type_id, "2");


                String updateSql = "update zz_wechat.article_type set domain_id='" +
                        domain_id +
                        "'   where article_type_id in(" +
                        idlist2 +
                        ")";
                String updateSql2 = "update zz_wechat.article_type set domain_id='" +
                        domain_id +
                        "'   where article_type_id in(" +
                        idlist +
                        ")";

                jdbcTemplate.update(updateSql);
                jdbcTemplate.update(updateSql2);

                String sqlTmp = "update zz_wechat.article_type set parentid=? where article_type_id=?";

                jdbcTemplate.update(sqlTmp, new Object[]{
                        parentid,
                        article_type_id
                });

            }

        } catch (Exception e) {
            System.out.print(e);

        }

        return 1;

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

        int startNumI = Integer.parseInt(startNum.toString());
        int pageSizeI = Integer.parseInt(pageSize.toString());
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

            String sqlMessage = "select a.article_id,a.article_type_id,a.article_title,a.article_keyword,a.author,DATE_ADD( a.update_time,INTERVAL -8 HOUR) AS update_time,DATE_ADD( a.create_time,INTERVAL -8 HOUR) AS  create_time ,a.source,a.content_excerpt,a.details_size,a.check_type,a.article_score,b.article_type_name  " +
                    "from zz_wechat.article_tmp a ,zz_wechat.article_type_tmp b where a.del_type " + delTypeSql +
                    " AND a.article_type_id=b.article_type_id ";


            if (tmp_type != null && !"1".equals(tmp_type.toString())) {

                sqlCount = "select count(*) as count from zz_wechat.article a ,zz_wechat.article_type b where a.del_type  " + delTypeSql +
                        "AND a.article_type_id=b.article_type_id and  a.state=0 ";

                sqlMessage = "select a.article_id,a.article_type_id,a.article_title,a.article_keyword,a.author,DATE_ADD( a.update_time,INTERVAL -8 HOUR) AS update_time,DATE_ADD( a.create_time,INTERVAL -8 HOUR) AS  create_time ,a.source,a.content_excerpt,a.word_count,a.article_score,b.article_type_name  " +
                        "from zz_wechat.article a ,zz_wechat.article_type b where a.del_type " + delTypeSql +
                        " AND a.article_type_id=b.article_type_id and  a.state=0 ";
            }

            if (article_type_id != null && !"100".equals(article_type_id)) {
                if ("1".equals(wx_type)) {
                    String idString = getChildList(article_type_id.toString(), "1");
                    sqlCount = sqlCount + " and a.article_type_id in (" + idString + ") ";
                    sqlMessage = sqlMessage + " and a.article_type_id in(" + idString + ") ";
                } else {
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
                sqlCount = sqlCount + " and a.create_time>=date_format('" + createTimeStart.toString() + "','%Y-%m-%d %H:%i:%s')";
                sqlMessage = sqlMessage + " and a.create_time>=date_format('" + createTimeStart.toString() + "','%Y-%m-%d %H:%i:%s')";
            }

            if (createTimeEnd != null && !createTimeEnd.toString().equals("")) {
//                String createTime = DateUtil.getCurrentTimeString(createTimeEnd.toString());
                sqlCount = sqlCount + " and a.create_time<=date_format('" + createTimeEnd.toString() + "','%Y-%m-%d %H:%i:%s')";
                sqlMessage = sqlMessage + " and a.create_time<=date_format('" + createTimeEnd.toString() + "','%Y-%m-%d %H:%i:%s')";
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
                message = message.toString().toLowerCase();
                sqlCount = sqlCount + " and (BINARY LOWER(a.article_title) like '%" + message.toString() + "%' or BINARY LOWER(a.author) like '%" + message.toString() + "%' or BINARY LOWER(a.source) like '%" + message.toString() + "%' )";
                sqlMessage = sqlMessage + " and (BINARY LOWER(a.article_title) like '%" + message.toString() + "%' or BINARY LOWER(a.author) like '%" + message.toString() + "%' or BINARY LOWER(a.source) like '%" + message.toString() + "%' )";
            }
            if (checkType != null && !checkType.toString().equals("")) {
                sqlCount = sqlCount + " and a.check_type=" + Integer.parseInt(checkType.toString());
                sqlMessage = sqlMessage + " and a.check_type=" + Integer.parseInt(checkType.toString());
            }


            sqlMessage = sqlMessage + " ORDER BY a.update_time asc";
            Page<Map<String, Object>> page = jdbc.queryForPage(Integer.parseInt(startNum.toString()), Integer.parseInt(pageSize.toString()), sqlCount, sqlMessage, new Object[]{});
            map.put("code", 0);
            map.put("message", "查询成功");
            map.put("total", page.getTotalCount());
            map.put("result", page.getResult());
            return map;


        }
       /* else {
            //创建时间
            Object createTime = req.getParameter("createTime");
            //0  中文  1 英文
            Object language = req.getParameter("language");

            //查询的是论文
//            String sqlCount = "select count(*) as count from zz_wechat.academic_paper a ,zz_wechat.article_type_tmp b where a.del_type  " + delTypeSql +
//                    " AND a.article_type_id=b.article_type_id ";

            String sqlCount ="SELECT count(*) as count from zz_wechat.academic_paper a  where   a.article_type_id in (SELECT article_type_id from article_type_tmp  where del_type" +delTypeSql+ ")";
            String sqlMessage = "SELECT a.*,b.article_type_name from (select a.article_id,a.article_type_id,a.article_title,a.article_keyword,a.author,DATE_ADD( a.update_time,INTERVAL -8 HOUR) AS update_time,a.create_time ,a.source,a.content_excerpt,a.check_type,a.reference,a.article_score,a.posting_name,a.article_title_e,a.content_excerpt_e,a.article_keyword_e,a.author_e   " +
                    "from zz_wechat.academic_paper a FORCE INDEX(update_time,article_type_id) where a.del_type " + delTypeSql +
                    " AND 1=1 ";



            if (tmp_type != null && !"1".equals(tmp_type.toString())) {

                sqlMessage = "SELECT a.*,b.article_type_name from (select a.article_id,a.article_type_id,a.article_title,a.article_keyword,a.author,DATE_ADD( a.update_time,INTERVAL -8 HOUR) AS update_time,a.paper_create_time ,a.source,a.content_excerpt,a.check_type,a.reference,a.article_score,a.posting_name ,a.article_title_e,a.content_excerpt_e,a.article_keyword_e,a.author_e   " +
                        "from zz_wechat.article a where a.del_type " + delTypeSql +
                        " AND 1=1 and  a.state=1 ";


                if (language != null && "1".equals(language)) {
                    sqlMessage = "SELECT a.*,b.article_type_name from (select a.article_id,a.article_type_id,a.article_title_e as article_title,a.article_keyword_e as article_keyword,a.author_e as author,DATE_ADD( a.update_time,INTERVAL -8 HOUR) AS update_time,a.paper_create_time,a.source,a.content_excerpt_e as content_excerpt,a.reference,a.article_score,a.posting_name ,a.article_title,a.content_excerpt,a.article_keyword,a.author  " +
                            "from zz_wechat.article a FORCE INDEX(update_time,article_type_id) where a.del_type " + delTypeSql +
                            " AND 1=1 and  a.state=1 ";
                }


                sqlCount = "select count(*) as count from zz_wechat.article a ,zz_wechat.article_type b where a.del_type  " + delTypeSql +
                        " AND a.article_type_id=b.article_type_id  and  a.state=1";
            } else {

                if (language != null && "1".equals(language)) {
                    sqlMessage = "SELECT a.*,b.article_type_name from (select a.article_id,a.article_type_id,a.article_title_e ,a.article_keyword_e ,a.author_e as author,DATE_ADD( a.update_time,INTERVAL -8 HOUR) AS update_time,a.create_time ,a.source,a.content_excerpt_e ,a.reference,a.article_score,a.check_type,a.posting_name,a.article_title,a.content_excerpt,a.article_keyword ,a.author  " +
                            "from zz_wechat.academic_paper a  FORCE INDEX(update_time,article_type_id) where a.del_type " + delTypeSql +
                            " AND 1=1   ";
                }


            }


            if (article_type_id != null && !"100".equals(article_type_id)) {
                if ("1".equals(wx_type)) {
                    String idString=  getChildList(article_type_id.toString(),"1");
                    sqlCount = sqlCount + " and a.article_type_id in (" + idString + ") ";
                    sqlMessage = sqlMessage + " and a.article_type_id in(" + idString + ") ";
                } else {
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
                if(language==null){
                    sqlCount = sqlCount + " and (BINARY a.article_title like '%" + message.toString() + "%' or BINARY a.author like '%" + message.toString() + "%' or BINARY a.source like '%" + message.toString() + "%' " +
                            " or BINARY a.source_e like '%" + message.toString() + "%' or BINARY a.article_title_e like '%" + message.toString() + "%' or BINARY a.author_e like '%" + message.toString() + "%')";
                    sqlMessage = sqlMessage + " and (BINARY a.article_title like '%" + message.toString() + "%' or BINARY a.author like '%" + message.toString() + "%' or BINARY a.source like '%" + message.toString() + "%' " +
                            " or BINARY a.source_e like '%" + message.toString() + "%' or BINARY a.article_title_e like '%" + message.toString() + "%' or BINARY a.author_e like '%" + message.toString() + "%')";

                }else if (language != null && "1".equals(language)) {
                    sqlCount = sqlCount + " and (BINARY a.article_title_e like '%" + message.toString() + "%' or BINARY a.author_e like '%" + message.toString() + "%' or BINARY a.source_e like '%" + message.toString() + "%' )";
                    sqlMessage = sqlMessage + " and (BINARY a.article_title_e like '%" + message.toString() + "%' or BINARY a.author_e like '%" + message.toString() + "%' or BINARY a.source_e like '%" + message.toString() + "%' )";

                }else{
                    sqlCount = sqlCount + " and (BINARY a.article_title like '%" + message.toString() + "%' or BINARY a.author like '%" + message.toString() + "%' or BINARY a.source like '%" + message.toString() + "%' )";
                    sqlMessage = sqlMessage + " and (BINARY a.article_title like '%" + message.toString() + "%' or BINARY a.author like '%" + message.toString() + "%' or BINARY a.source like '%" + message.toString() + "%' )";


                }

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

            }*/

//
//            sqlMessage = sqlMessage + " ORDER BY a.update_time ASC " +
//                    "LIMIT " +
//                    (startNumI - 1) * pageSizeI  +
//                    "," +pageSizeI +
//                    " ) a,article_type_tmp b where a.article_type_id=b.article_type_id  AND b.del_type != 1";


        else {
            //创建时间
            Object createTime = req.getParameter("createTime");

            Object language = req.getParameter("language");//0  中文  1 英文

            //查询的是论文
            String sqlCount = "select count(*) as count from zz_wechat.academic_paper a ,zz_wechat.article_type_tmp b where a.del_type  " + delTypeSql +
                    " AND a.article_type_id=b.article_type_id ";
//                    "and a.article_type_id='" + article_type_id + "' ";

            String sqlMessage = "select a.article_id,a.article_type_id,a.article_title,a.article_keyword,a.author,DATE_ADD( a.update_time,INTERVAL -8 HOUR) AS update_time,a.create_time ,a.source,a.content_excerpt,a.check_type,a.reference,a.article_score,b.article_type_name ,a.posting_name,a.article_title_e,a.content_excerpt_e,a.article_keyword_e,a.author_e   " +
                    "from zz_wechat.academic_paper a ,zz_wechat.article_type_tmp b where a.del_type " + delTypeSql +
                    " AND a.article_type_id=b.article_type_id ";
//                    "and a.article_type_id='" + article_type_id + "' ";


            if (tmp_type != null && !"1".equals(tmp_type.toString())) {

                sqlMessage = "select a.article_id,a.article_type_id,a.article_title,a.article_keyword,a.author,DATE_ADD( a.update_time,INTERVAL -8 HOUR) AS update_time,a.paper_create_time as create_time ,a.source,a.content_excerpt,a.check_type,a.reference,a.article_score,b.article_type_name ,a.posting_name ,a.article_title_e,a.content_excerpt_e,a.article_keyword_e,a.author_e   " +
                        "from zz_wechat.article a ,zz_wechat.article_type b where a.del_type " + delTypeSql +
                        " AND a.article_type_id=b.article_type_id and  a.state=1 ";

                if (language != null && "1".equals(language)) {
                    sqlMessage = "select a.article_id,a.article_type_id,a.article_title_e ,a.article_keyword_e ,a.author_e ,DATE_ADD( a.update_time,INTERVAL -8 HOUR) AS update_time,a.paper_create_time as create_time,a.source,content_excerpt_e,a.reference,a.article_score,b.article_type_name,a.posting_name ,a.article_title,a.content_excerpt,a.article_keyword,a.author  " +
                            "from zz_wechat.article a ,zz_wechat.article_type b where a.del_type " + delTypeSql +
                            " AND a.article_type_id=b.article_type_id and  a.state=1 ";

                }

                sqlCount = "select count(*) as count from zz_wechat.article a ,zz_wechat.article_type b where a.del_type  " + delTypeSql +
                        " AND a.article_type_id=b.article_type_id  and  a.state=1";

                if ("1".equals(language)) {
                    sqlMessage = sqlMessage + " and a.article_title_e !='' ";
                    sqlCount = sqlCount + " and a.article_title_e !=''";

                } else if ("0".equals(language)) {
                    sqlMessage = sqlMessage + " and a.article_title !='' ";
                    sqlCount = sqlCount + " and a.article_title !=''";
                }


            } else {

//                if (language != null && "1".equals(language)) {
//                    sqlMessage = "select a.article_id,a.article_type_id,a.article_title_e ,a.article_keyword_e ,a.author_e as author,DATE_ADD( a.update_time,INTERVAL -8 HOUR) AS update_time,a.create_time ,a.source,a.content_excerpt_e ,a.reference,a.article_score,a.check_type,b.article_type_name,a.posting_name,a.article_title,a.content_excerpt,a.article_keyword ,a.author  " +
//                            "from zz_wechat.academic_paper a ,zz_wechat.article_type_tmp b where a.del_type " + delTypeSql +
//                            " AND a.article_type_id=b.article_type_id   ";
//
//                }

                sqlMessage = "select a.article_id,a.article_type_id,a.article_title_e ,a.article_keyword_e ,a.author_e as author,DATE_ADD( a.update_time,INTERVAL -8 HOUR) AS update_time,a.create_time ,a.source,a.content_excerpt_e ,a.reference,a.article_score,a.check_type,b.article_type_name,a.posting_name,a.article_title,a.content_excerpt,a.article_keyword ,a.author  " +
                        "from zz_wechat.academic_paper a ,zz_wechat.article_type_tmp b where a.del_type " + delTypeSql +
                        " AND a.article_type_id=b.article_type_id   ";
                if ("1".equals(language)) {
                    sqlMessage = sqlMessage + " and a.article_title_e !='' ";
                    sqlCount = sqlCount + " and a.article_title_e !=''";

                } else if ("0".equals(language)) {
                    sqlMessage = sqlMessage + " and a.article_title !='' ";
                    sqlCount = sqlCount + " and a.article_title !=''";
                }


            }


            if (article_type_id != null && !"100".equals(article_type_id)) {
                if ("1".equals(wx_type)) {
                    String idString = getChildList(article_type_id.toString(), "1");
                    sqlCount = sqlCount + " and a.article_type_id in (" + idString + ") ";
                    sqlMessage = sqlMessage + " and a.article_type_id in(" + idString + ") ";
                } else {
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
            if ("".equals(language)) {
                language = null;
            }
            if(message!=null){
                message = message.toString().toLowerCase();
            }

            if (message != null && !message.toString().equals("")) {
                if (language == null) {
                    sqlCount = sqlCount + " and (BINARY LOWER(a.article_title) like '%" + message.toString() + "%' or BINARY LOWER(a.author) like '%" + message.toString() + "%' or BINARY LOWER(a.source) like '%" + message.toString() + "%' " +
                            " or BINARY a.article_title_e like '%" + message.toString() + "%' or BINARY a.author_e like '%" + message.toString() + "%')";
                    sqlMessage = sqlMessage + " and (BINARY LOWER(a.article_title) like '%" + message.toString() + "%' or BINARY LOWER(a.author) like '%" + message.toString() + "%' or BINARY LOWER(a.source) like '%" + message.toString() + "%' " +
                            "  or BINARY LOWER(a.article_title_e) like '%" + message.toString() + "%' or BINARY LOWER(a.author_e) like '%" + message.toString() + "%')";

                } else if (language != null && "1".equals(language)) {
                    sqlCount = sqlCount + " and (BINARY LOWER(a.article_title_e) like '%" + message.toString() + "%' or BINARY LOWER(a.author_e) like '%" + message.toString() + "%' or BINARY LOWER(a.source) like '%" + message.toString() + "%' )";
                    sqlMessage = sqlMessage + " and (BINARY LOWER(a.article_title_e) like '%" + message.toString() + "%' or BINARY LOWER(a.author_e) like '%" + message.toString() + "%' or BINARY LOWER(a.source) like '%" + message.toString() + "%' )";

                } else {
                    sqlCount = sqlCount + " and (BINARY LOWER(a.article_title) like '%" + message.toString() + "%' or BINARY LOWER(a.author) like '%" + message.toString() + "%' or BINARY LOWER(a.source) like '%" + message.toString() + "%' )";
                    sqlMessage = sqlMessage + " and (BINARY LOWER(a.article_title) like '%" + message.toString() + "%' or BINARY LOWER(a.author) like '%" + message.toString() + "%' or BINARY LOWER(a.source) like '%" + message.toString() + "%' )";


                }

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
//                    map.put("details_txt", new String(details_txt, "UTF-8"));

                    map.put("details_txt", guessEncoding(details_txt));

                }
                if (details_div != null) {
//                    map.put("details_div", new String(details_div, "UTF-8"));
                    map.put("details_div", guessEncoding(details_div));
                }

            } catch (Exception e) {
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
        } else if ("1".equals(type)) {
            String updateSql = "update zz_wechat.academic_paper set check_type=1 where article_id in (" + idList + ")";
            jdbcTemplate.update(updateSql);
            HashMap<String, Object> map = new HashMap<>();
            map.put("code", 0);
            map.put("message", "审核成功！");
            return map;

        } else if ("2".equals(type)) {

            String updateSql = "update zz_wechat.article_tmp set check_type=0 where article_id in (" + idList + ")";
            jdbcTemplate.update(updateSql);
            HashMap<String, Object> map = new HashMap<>();
            map.put("code", 0);
            map.put("message", "取消审核成功！");
            return map;

        } else if ("3".equals(type)) {

            String updateSql = "update zz_wechat.academic_paper set check_type=0 where article_id in (" + idList + ")";
            jdbcTemplate.update(updateSql);
            HashMap<String, Object> map = new HashMap<>();
            map.put("code", 0);
            map.put("message", "取消审核成功！");
            return map;

        } else {
            return getErrorMap();
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

//            if ("1".equals(tmp_type)) {
//
//                sql = "update zz_wechat.article set article_type_id=?,article_title=?,article_keyword=?,author=?,source=?," +
//                        "content_excerpt=?,status=?,article_score=?,del_type=?," +
//                        " paper_create_time=?,update_time=date_format(?,'%Y-%m-%d %H:%i:%s') ,article_title_e=?,content_excerpt_e=?,article_keyword_e=?" +
//                        ",author_e=?,reference=?,site_number=?,publication_date=?,article_score=? " +
//                        "where article_id=?";
//
//            }

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
    @Transactional
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
                Map<String, Object> countMap = null;
                try {
                    String countSql = "select count(*) as count from zz_wechat.article where article_id=?";
                    countMap = jdbcTemplate.queryForMap(countSql, new Object[]{
                            articleTmp.get("article_id")
                    });
                } catch (Exception e) {

                }

                if (countMap != null && countMap.get("count") != null && Integer.parseInt(countMap.get("count").toString()) > 0) {

                    String delSql = "DELETE  from zz_wechat.article_tmp where article_id=?";
                    jdbcTemplate.update(delSql, new Object[]{
                            articleTmp.get("article_id")
                    });
                    continue;
                }

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


                String delSql = "DELETE  from zz_wechat.article_tmp where article_id=?";
                jdbcTemplate.update(delSql, new Object[]{
                        articleTmp.get("article_id")
                });


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

                Map<String, Object> countMap = null;
                try {
                    String countSql = "select count(*) as count from zz_wechat.article where article_id=?";
                    countMap = jdbcTemplate.queryForMap(countSql, new Object[]{
                            paper.get("article_id")
                    });
                } catch (Exception e) {

                }

                if (countMap != null && countMap.get("count") != null && Integer.parseInt(countMap.get("count").toString()) > 0) {
                    String delSql = "DELETE  from zz_wechat.academic_paper where article_id=?";
                    jdbcTemplate.update(delSql, new Object[]{
                            paper.get("article_id")
                    });
                    continue;
                }

                String insertSql = "insert into zz_wechat.article (article_id,article_type_id,article_title,article_keyword,author,source" +
                        ",share_count,collect_count,collect_initcount,share_initcount,content_type,content_excerpt," +
                        "del_type,state " +
                        ",paper_create_time,update_time," +
                        "posting_name,article_title_e,content_excerpt_e,pdf_path,article_keyword_e,author_e," +
                        "reference,site_number,publication_date,article_score,image_path" +
                        ") values(?,?,?,?,?,?," +
                        "?,?,?,?,?,?,?,?" +
                        ",?,date_format(?,'%Y-%m-%d %H:%i:%s')" +
                        ",?,?,?,?,?,?," +
                        "?,?,?,?,?)";


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
                        paper.get("article_score"),
                        paper.get("image_path")


                });


                String delSql = "DELETE  from zz_wechat.academic_paper where article_id=?";
                jdbcTemplate.update(delSql, new Object[]{
                        paper.get("article_id")
                });


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
                sql = "select parentid,domain_id from zz_wechat.article_type_tmp where article_type_id=?";
            } else {
                sql = "select parentid,domain_id from zz_wechat.article_type where article_type_id=?";
            }
            Map<String, Object> map = jdbcTemplate.queryForMap(sql, new Object[]{
                    article_type_id.toString()
            });
            String parent_id = map.get("parentid").toString();


            String domain_id = "";
            Map<String, Object> maps = new HashMap<>();
            if ("-1".equals(parent_id) || "100".equals(parent_id)) {
                domain_id = article_type_id.toString();
            } else {
                try {
                    String typeSql = "select domain_id from zz_wechat.article_type_tmp where article_type_id=?";
                    maps = jdbcTemplate.queryForMap(typeSql, new Object[]{
                            article_type_id.toString()
                    });

                } catch (Exception e) {


                }

                if (maps == null || maps.get("domain_id") == null) {
                    try {
                        String typeSql = "select domain_id from zz_wechat.article_type where article_type_id=?";
                        maps = jdbcTemplate.queryForMap(typeSql, new Object[]{
                                article_type_id.toString()
                        });

                    } catch (Exception e) {


                    }
                }

                if (maps != null && maps.get("domain_id") != null) {
                    domain_id = maps.get("domain_id").toString();

                }
            }


            for (int i = 0; i < merge_type_idList.length; i++) {
                mergeIdList = mergeIdList + "'" + merge_type_idList[i].toString() + "',";
                String artcicle_type_id = merge_type_idList[i].toString();
                String childList = getChildList(artcicle_type_id, "1");
                String childList2 = getChildList(artcicle_type_id, "0");

                //临时表
                String sqlTmp = "update zz_wechat.article_type_tmp set domain_id='" +
                        domain_id +
                        "' where article_type_id in(" + childList + ")";
                //正式表
                String sql1 = "update zz_wechat.article_type set domain_id='" +
                        domain_id +
                        "' where article_type_id in(" + childList + ")";
                String sql2 = "update zz_wechat.article_type set domain_id='" +
                        domain_id +
                        "' where article_type_id in(" + childList2 + ")";
                jdbcTemplate.update(sqlTmp);
                jdbcTemplate.update(sql1);
                jdbcTemplate.update(sql2);


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
            String tmpChildSql = "update zz_wechat.article_type_tmp set parentid='" + article_type_id + "',domain_id='" +
                    map.get("domain_id") +
                    "' where parentid in(" +
                    mergeIdList +
                    " )";
            //更新正式表中的子节点 的parendid
            String childSql = "update zz_wechat.article_type set parentid='" + article_type_id + "',domain_id='" +
                    map.get("domain_id") +
                    "' where parentid in(" +
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
    public Map<String, Object> delArticleTypeById(String article_type_id, String type) {
        if (article_type_id == null) {
            return getErrorMap();
        }

        try {
//            String childList = "SELECT article_type_id FROM\n" +
//                    "  (\n" +
//                    "    SELECT * FROM article_type_tmp ORDER BY parentid, article_type_id DESC\n" +
//                    "  ) realname_sorted,\n" +
//                    "  (SELECT @pv :='" +
//                    article_type_id +
//                    "') initialisation\n" +
//                    "  WHERE (FIND_IN_SET(parentid,@pv)>0 And @pv := concat(@pv, ',', article_type_id))";


//            String childList="SELECT  \n" +
//                    "    b.article_type_id  \n" +
//                    "FROM  \n" +
//                    "    article_type_tmp AS a,  \n" +
//                    "    article_type_tmp AS b  \n" +
//                    "WHERE  \n" +
//                    "    a.parentid= b.parentid  \n" +
//                    "AND(a.article_type_id= '" +article_type_id+
//                    "') ";
//            String idString = "'" +
//                    article_type_id +
//                    "',";

            String idString = getChildList(article_type_id, "1");
//            List<Map<String, Object>> idlistMaps = jdbcTemplate.queryForList(childList);
//            if (idlistMaps != null && idlistMaps.size() > 0) {
//                for (int i = 0; i < idlistMaps.size(); i++) {
//                    idString = idString + "'" + idlistMaps.get(i).get("article_type_id").toString() + "',";
//                }
//
//            }
//
//            if (idString.length() > 0) {
//                idString = idString.substring(0, idString.length() - 1);
//            }
            //回收站
            if ("1".equals(type)) {

                String delTypeTmpsql = "delete from zz_wechat.article_type_tmp where article_type_id in(" + idString + ")";
                String delTypeSql = "delete from zz_wechat.article_type where article_type_id in(" + idString + ")";
                jdbcTemplate.update(delTypeTmpsql);
                jdbcTemplate.update(delTypeSql);


            } else {
                //删除类型的临时表
                String delTypeTmpsql = "update zz_wechat.article_type_tmp set del_type=1 where article_type_id in(" + idString + ")";

                //删除文章的临时表
                String delArticleTmpsql = "update zz_wechat.article_tmp  set del_type=1  where article_type_id in(" + idString + ")";

                //删除论文的临时表
                String delPaperTmpsql = "update zz_wechat.academic_paper set del_type=1  where article_type_id in(" + idString + ")";

                // 更新正式表类型del_type
                String updateTypeSql = "update zz_wechat.article_type set del_type=1 where article_type_id in (" + idString + ")";


                // 更新正式表类型del_type
                String updateArticleSql = "update zz_wechat.article set del_type=1 where article_type_id in (" + idString + ")";

                int update = jdbcTemplate.update(delTypeTmpsql);
                int update1 = jdbcTemplate.update(delArticleTmpsql);
                int update2 = jdbcTemplate.update(delPaperTmpsql);
                int update3 = jdbcTemplate.update(updateTypeSql);
                int update4 = jdbcTemplate.update(updateArticleSql);
            }
            HashMap<String, Object> map = new HashMap<>();
            map.put("code", 0);
            map.put("message", "删除成功！");
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
    public Map getAllIssueArticleType(String type, String message) {

        String sql = "";
        if ("0".equals(type)) {
            sql = "select article_type_id,article_type_name,parentid,type_state,issue from zz_wechat.article_type_tmp where issue=1 and del_type=0 and parentid !='100' and parentid !='1' ";

        } else if ("1".equals(type)) {
            sql = "select article_type_id,article_type_name,parentid,type_state from zz_wechat.article_type where del_type=0 and parentid !='100' and parentid !='1'";
        } else if ("2".equals(type)) {
            sql = "select article_type_id,article_type_name,parentid,type_state,issue from zz_wechat.article_type_tmp where del_type=0 and parentid !='100' and parentid !='1' ";

        } else if ("3".equals(type)) {
            sql = "select article_type_id,article_type_name,parentid,type_state,issue from zz_wechat.article_type_tmp where del_type=0  and parentid !='1' ";

        } else if ("4".equals(type)) {
            sql = "select article_type_id,article_type_name,parentid,type_state,issue from zz_wechat.article_type_tmp where 1=1 ";

        } else if ("5".equals(type)) {
            sql = "select article_type_id,article_type_name,parentid,type_state,issue from zz_wechat.article_type where 1=1 ";

        }
        if (message != null && !"".equals(message)) {
            sql = sql + " AND article_type_name LIKE '%" + message + "%'";
        }
        sql = sql + " ORDER by update_time desc";
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


                //type 0 是发布 1 取消发布
                if ("0".equals(type) || type.isEmpty()) {
                    Map<String, Object> typeMap;
                    try {
                        String typeSql = "select * from zz_wechat.article_type_tmp where article_type_id=?";
                        typeMap = jdbcTemplate.queryForMap(typeSql, new Object[]{
                                artcicle_type_id
                        });
                    } catch (Exception e) {
                        continue;
                    }

                    try {
                        String sqlCount = "select count(*) as count from zz_wechat.article_type where article_type_id=?";
                        Map<String, Object> map = jdbcTemplate.queryForMap(sqlCount, new Object[]{
                                artcicle_type_id
                        });
                        if (map != null && map.get("count") != null && Integer.parseInt(map.get("count").toString()) == 0) {
                            //插入实际的类型表
                            String currentTime = DateUtil.getCurrentTimeString();
                            String insertSqlt = "insert into zz_wechat.article_type(article_type_id,article_type_keyword,article_type_name,iamge_icon,iamge_back,parentid,del_type,create_time,type_state,domain_id,issue) values " +
                                    "(?,?,?,?,?,?,?,date_format(?,'%Y-%m-%d %H:%i:%s'),?,?,?)";
                            jdbcTemplate.update(insertSqlt, new Object[]{
                                    artcicle_type_id,
                                    typeMap.get("article_type_keyword"),
                                    typeMap.get("article_type_name"),
                                    typeMap.get("iamge_icon"),
                                    typeMap.get("iamge_back"),
                                    typeMap.get("parentid"),
                                    0,
                                    currentTime,
                                    Integer.parseInt(typeMap.get("type_state").toString()),
                                    typeMap.get("domain_id"),
                                    1
                            });
                        } else {
                            String sql = "update zz_wechat.article_type set issue=1 where article_type_id ='" + artcicle_type_id + "'";
                            jdbcTemplate.update(sql);
                        }
                    } catch (Exception e) {
                        //插入实际的类型表
                        String currentTime = DateUtil.getCurrentTimeString();
                        String insertSqlt = "insert into zz_wechat.article_type(article_type_id,article_type_keyword,article_type_name,iamge_icon,iamge_back,parentid,del_type,create_time,type_state,domain_id,issue) values " +
                                "(?,?,?,?,?,?,?,date_format(?,'%Y-%m-%d %H:%i:%s'),?,?,?)";
                        jdbcTemplate.update(insertSqlt, new Object[]{
                                artcicle_type_id,
                                typeMap.get("article_type_keyword"),
                                typeMap.get("article_type_name"),
                                typeMap.get("iamge_icon"),
                                typeMap.get("iamge_back"),
                                typeMap.get("parentid"),
                                0,
                                currentTime,
                                Integer.parseInt(typeMap.get("type_state").toString()),
                                typeMap.get("domain_id"),
                                1
                        });
                    }
                } else {
                    String childList = getChildList(artcicle_type_id, "1");
                    String childList2 = getChildList(artcicle_type_id, "0");

                    //临时表
                    String sqlTmp = "update zz_wechat.article_type_tmp set issue=0 where article_type_id in(" + childList + ")";
                    //正式表
                    String sql = "update zz_wechat.article_type set issue=0 where article_type_id in(" + childList + ")";
                    String sql2 = "update zz_wechat.article_type set issue=0 where article_type_id in(" + childList2 + ")";
                    jdbcTemplate.update(sqlTmp);
                    jdbcTemplate.update(sql);
                    jdbcTemplate.update(sql2);
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


    /**
     * 清空回收站
     *
     * @param type 0 全部 1关键词  2 已发布的文章  3 已发布的论文  4 未发布的文章 5 未发布的论文 6类型
     * @return
     */
    @Override
    public Map delAllRecycle(String type) {
        if (type.isEmpty()) {
            return getErrorMap();
        }

        if ("0".equals(type)) {
            delAllArticle();
            delAllArticleTmp();
            delAllAticleType();
            delAllKeyword();
            delAllPaper();
            delAllPaperTmp();
        } else if ("1".equals(type)) {
            delAllKeyword();

        } else if ("2".equals(type)) {
            delAllArticle();

        } else if ("3".equals(type)) {
            delAllPaper();

        } else if ("4".equals(type)) {
            delAllArticleTmp();

        } else if ("5".equals(type)) {

            delAllPaperTmp();

        } else if ("6".equals(type)) {
            delAllAticleType();
        } else {
            return getErrorMap();
        }


        HashMap<String, Object> map = new HashMap<>();
        map.put("code", 0);
        map.put("message", "删除成功！");
        return map;
    }

    /**
     * 获取删除的类型
     *
     * @return
     */
    @Override
    public Map getDelArticleType(Map<String, Object> data) {
        String tableName = "zz_wechat.article_type";
        Object type = data.get("type");
        Object message = data.get("message");
        Object startNum = data.get("pageNumber");
        Object pageSize = data.get("pageSize");
        if (startNum == null || pageSize == null) {
            return getErrorMap();
        }

        if (type != null && "1".equals(type.toString())) {
            tableName = "zz_wechat.article_type_tmp";
        }

        String sqlCount = "select count(*) as count  from " + tableName + " where del_type=1 ";

        String sqlResult = "select * from " + tableName + " where del_type=1 ";
        if (message != null && message.toString().length() > 0) {
            sqlCount = sqlCount + " and article_type_name like '%" + message.toString() + "%'";
            sqlResult = sqlResult + " and article_type_name like '%" + message.toString() + "%'";
        }

        sqlResult = sqlResult + " ORDER BY create_time desc";
        Page<Map<String, Object>> page = jdbc.queryForPage(Integer.parseInt(startNum.toString()), Integer.parseInt(pageSize.toString()), sqlCount, sqlResult, new Object[]{});
        Map<String, Object> map = new HashMap<>();
        map.put("code", 0);
        map.put("message", "查询成功");
        map.put("total", page.getTotalCount());
        map.put("result", page.getResult());
        return map;

    }

    @Override
    public List<Map<String, Object>> combinedScoreById(String id) {
//        String childList = "SELECT article_type_id FROM\n" +
//                "  (\n" +
//                "    SELECT * FROM article_type_tmp ORDER BY parentid, article_type_id DESC\n" +
//                "  ) realname_sorted,\n" +
//                "  (SELECT @pv :='" +
//                id +
//                "') initialisation\n" +
//                "  WHERE (FIND_IN_SET(parentid,@pv)>0 And @pv := concat(@pv, ',', article_type_id))";


     /*   String childList="SELECT  \n" +
                "    b.article_type_id  \n" +
                "FROM  \n" +
                "    article_type_tmp AS a,  \n" +
                "    article_type_tmp AS b  \n" +
                "WHERE  \n" +
                "    a.parentid= b.parentid  \n" +
                "AND(a.article_type_id= '" +id+
                "') ";*/

        String idString = getChildList(id, "1");


/*//        String idString = "'" +
//                id +
//                "',";
        List<Map<String, Object>> idlistMaps = jdbcTemplate.queryForList(childList);
        if (idlistMaps != null && idlistMaps.size() > 0) {
            for (int i = 0; i < idlistMaps.size(); i++) {
                idString = idString + "'" + idlistMaps.get(i).get("article_type_id").toString() + "',";
            }

        }

        if (idString.length() > 0) {
            idString = idString.substring(0, idString.length() - 1);
        }*/


        String sql = "select  article_type_id,article_type_name_old from zz_wechat.article_type_tmp where del_type !=1 and parentid !=100 and  parentid !=-1 and article_type_id in(" + idString + ")";
        List<Map<String, Object>> maps = jdbcTemplate.queryForList(sql);

        return maps;
    }


    @Override
    public List<Map> getTypeMenuTree(String type, String delType) {

        String sql = "select article_type_id as id,article_type_name as text,article_type_keyword,iamge_icon,iamge_back,parentid,type_state,issue,article_type_name_old,article_type_keyword_old,del_type,domain_id from zz_wechat.article_type_tmp where del_type!=? and parentid=? AND domain_id !='' ";
        List maps = jdbcTemplate.queryForList(sql, new Object[]{
                1,
                -1
        });
        return maps;
    }

    @Override
    public List<Map<String, Object>> getArticleOldNameById(String articleTypeId) {
        String sql = "select  article_type_id,article_type_name_old,type_state from zz_wechat.article_type_tmp where article_type_id ='" + articleTypeId + "'";
        List<Map<String, Object>> maps = jdbcTemplate.queryForList(sql);
        return maps;
    }

    @Override
    public List<Map<String, Object>> combinedScoreByState(int state) {
        String sql = "select  article_type_id,article_type_name_old from zz_wechat.article_type_tmp where del_type !=1 and parentid !=100 and  parentid !=-1 and type_state ='" + state + "'";
        List<Map<String, Object>> maps = jdbcTemplate.queryForList(sql);
        return maps;
    }


    /**
     * 根据id获取所有下级id
     *
     * @param id
     * @return
     */
    private String getChildList(String id, String type) {
        String idString = "'" +
                id +
                "',";
        String table = " zz_wechat.article_type";
        if ("1".equals(type)) {
            table = " zz_wechat.article_type_tmp";
        }

        String sql = "select article_type_id from " + table + " where parentid=?";
        List<Map<String, Object>> result = new ArrayList<>();

        List<Map<String, Object>> maps = jdbcTemplate.queryForList(sql, new Object[]{
                id
        });
        result.addAll(maps);
        for (Map<String, Object> map : maps) {

            if (map.get("article_type_id") != null) {
                List<Map<String, Object>> article_id = getlist(sql, map.get("article_type_id").toString());
                result.addAll(article_id);
            }

        }
        for (Map<String, Object> map : result) {
            idString = idString + "'" + map.get("article_type_id") + "',";
        }
        return idString.substring(0, idString.length() - 1);
    }


    private List<Map<String, Object>> getlist(String sql, String id) {
        List<Map<String, Object>> result = new ArrayList<>();

        List<Map<String, Object>> maps = jdbcTemplate.queryForList(sql, new Object[]{
                id
        });
        result.addAll(maps);
        for (Map<String, Object> map : maps) {

            if (map.get("article_type_id") != null) {
                result.addAll(getlist(sql, map.get("article_type_id").toString()));
            }

        }
        return result;
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
     * 格式转换
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
     * 删除全部回收站内容
     *
     * @return
     */
    private int delAllKeyword() {

        String delSql = " DELETE FROM zz_wechat.keyword where del_type=1";
        int update = jdbcTemplate.update(delSql);
        return update;

    }

    /**
     * 删除全部回收站内容
     *
     * @return
     */
    private int delAllArticle() {

        String delSql = " DELETE FROM zz_wechat.article where del_type=1 AND state=0";
        int update = jdbcTemplate.update(delSql);
        return update;

    }

    /**
     * 删除已发布的论文
     *
     * @return
     */
    private int delAllPaper() {
        String delSql = " DELETE FROM zz_wechat.article where del_type=1 AND state=1";
        int update = jdbcTemplate.update(delSql);
        return update;

    }

    /**
     * 删除未发布的文章
     *
     * @return
     */
    private int delAllArticleTmp() {

        String delSql = " DELETE FROM zz_wechat.article_tmp where del_type=1";
        int update = jdbcTemplate.update(delSql);
        return update;

    }

    /**
     * 删除未发布的论文
     *
     * @return
     */
    private int delAllPaperTmp() {
        String delSql = " DELETE FROM zz_wechat.academic_paper where del_type=1";
        int update = jdbcTemplate.update(delSql);
        return update;

    }

    /**
     * 删除类型
     *
     * @return
     */
    private int delAllAticleType() {
        String delTmpSql = " DELETE FROM zz_wechat.article_type_tmp where del_type=1";
        int update = jdbcTemplate.update(delTmpSql);
        String delSql = " DELETE FROM zz_wechat.article_type where del_type=1";
        int update1 = jdbcTemplate.update(delSql);
        return update + update1;

    }


}

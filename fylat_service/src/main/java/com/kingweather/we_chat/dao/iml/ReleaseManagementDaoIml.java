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

        String sql = "select article_type_id,article_type_name,article_type_keyword,iamge_icon,iamge_back,parentid from zz_wechat.article_type_tmp where del_type!=? and parentid=?";
        List maps = jdbcTemplate.queryForList(sql, new Object[]{
                1, parent_id

        });

        return maps;
    }

    @Override
    public Map getTypeMessage(String article_type_id) {

        String sql = "select article_type_id,article_type_name,article_type_keyword,iamge_icon,iamge_back,parentid from zz_wechat.article_type_tmp where del_type!=? and article_type_id=?";

        Map maps = jdbcTemplate.queryForMap(sql, new Object[]{
                1, article_type_id

        });
        return maps;
    }

    @Override
    public int updateTypeMessage(String name, String keyword, String artcicle_type_id, String pathICon, String pathBack, String parentid) {

        String updateSqlTmp = "update set article_type_name=?,article_type_keyword=?,iamge_icon=?,iamge_back=?,status=?, parentid=? from zz_wechat.article_type_tmp where article_type_id=?";
        int update = jdbcTemplate.update(updateSqlTmp, new Object[]{

                name,
                keyword,
                pathICon,
                pathBack,
                "1",
                artcicle_type_id

        });


        String sqlCount = "select count(*) as count from zz_wechat.article_type where artcicle_type_id=?";
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
            String updateSql = "update set article_type_name=?,article_type_keyword=?,iamge_icon=?,iamge_back=?,status=?, parentid=? ,del_type=? from zz_wechat.article_type where article_type_id=?";
            jdbcTemplate.update(updateSql, new Object[]{

                    name,
                    keyword,
                    pathICon,
                    pathBack,
                    "1",
                    artcicle_type_id,
                    0

            });
        }
        return update;
    }

    @Override
    public int updateTypeParentId(String article_type_id, String parentid) {

        String updateSqlTmp = "update set parentid=? from zz_wechat.article_type_tmp where article_type_id=?";
        int update = jdbcTemplate.update(updateSqlTmp, new Object[]{
                parentid,
                article_type_id

        });

        String sqlCount = "select count(*) as count from zz_wechat.article_type where artcicle_type_id=?";
        Map<String, Object> map = jdbcTemplate.queryForMap(sqlCount, new Object[]{
                article_type_id
        });
        if (map != null && map.get("count") != null && Integer.parseInt(map.get("count").toString()) == 1) {

            String updateSql = "update set parentid=? from zz_wechat.article_type where article_type_id=?";
            jdbcTemplate.update(updateSql, new Object[]{
                    parentid,
                    article_type_id

            });

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

        Object startNum = data.get("startNum");
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


            String sqlCount = "select count(*) as count from zz_wechat.article_tmp a ,zz_wechat.article_type_tmp b where a.del_type !=1 " +
                    "AND a.article_type_id=b.article_type_id and article_type_id='" + article_type_id + "' ";

            String sqlMessage = "select a.article_id,a.article_type_id,a.article_title,a.article_keyword,a.author,DATE_ADD( a.update_time,INTERVAL -8 HOUR) AS update_time,DATE_ADD( a.create_time,INTERVAL -8 HOUR) AS  create_time ,a.source,a.content_excerpt,a.details_size,a.check_type,a.article_score,b.article_type_name  " +
                    "from zz_wechat.article_tmp a ,zz_wechat.article_type_tmp b where a.del_type !=1" +
                    " AND a.article_type_id=b.article_type_id and article_type_id='" + article_type_id + "' ";

            if (updateTimeStart != null) {
                String update_time = DateUtil.getCurrentTimeString(updateTimeStart.toString());
                sqlCount = sqlCount + " and update_time>=date_format(" + update_time + ",'%Y-%m-%d %H:%i:%s')";
                sqlMessage = sqlMessage + " and update_time>=date_format(" + update_time + ",'%Y-%m-%d %H:%i:%s')";
            }


            if (updateTimeEnd != null) {
                String updateTime = DateUtil.getCurrentTimeString(updateTimeEnd.toString());
                sqlCount = sqlCount + " and update_time<=date_format(" + updateTime + ",'%Y-%m-%d %H:%i:%s')";
                sqlMessage = sqlMessage + " and update_time<=date_format(" + updateTime + ",'%Y-%m-%d %H:%i:%s')";
            }


            if (createTimeStart != null) {
                String createTime = DateUtil.getCurrentTimeString(createTimeStart.toString());
                sqlCount = sqlCount + " and update_time>=date_format(" + createTime + ",'%Y-%m-%d %H:%i:%s')";
                sqlMessage = sqlMessage + " and update_time>=date_format(" + createTime + ",'%Y-%m-%d %H:%i:%s')";
            }

            if (createTimeEnd != null) {
                String createTime = DateUtil.getCurrentTimeString(createTimeEnd.toString());
                sqlCount = sqlCount + " and update_time<=date_format(" + createTime + ",'%Y-%m-%d %H:%i:%s')";
                sqlMessage = sqlMessage + " and update_time<=date_format(" + createTime + ",'%Y-%m-%d %H:%i:%s')";
            }

            if (details_size_more != null) {
                sqlCount = sqlCount + " and details_size>=" + Integer.parseInt(details_size_more.toString());
                sqlMessage = sqlMessage + " and details_size>=" + Integer.parseInt(details_size_more.toString());

            }


            if (details_size_less != null) {
                sqlCount = sqlCount + " and details_size<=" + Integer.parseInt(details_size_less.toString());
                sqlMessage = sqlMessage + " and details_size<=" + Integer.parseInt(details_size_less.toString());
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
            //查询的是论文


        }


        return null;
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
            idList = idList + "'" + split + "',";
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

            String sql = "select a.article_id,a.article_type_id,a.article_title,a.article_keyword,a.author,DATE_ADD( a.update_time,INTERVAL -8 HOUR) AS update_time,DATE_ADD( a.create_time,INTERVAL -8 HOUR) AS  create_time ,a.source,a.content_excerpt,a.details_size,a.check_type,a.article_score,b.article_type_name  " +
                    "from zz_wechat.article_tmp a ,zz_wechat.article_type_tmp b where article_id=?";
            Map<String, Object> map = jdbcTemplate.queryForMap(sql, new Object[]{
                    articleId
            });
            byte[] details_txt = (byte[]) map.get("details_txt");
            byte[] details_div = (byte[]) map.get("details_div");

            try {
                if (details_txt != null) {
                    map.put("details_div", new String(details_txt, "UTF-8"));
                }
                if (details_div != null) {
                    map.put("content_manual", new String(details_div, "UTF-8"));
                }

            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }


            HashMap<String, Object> result = new HashMap<>();
            map.put("code", 0);
            map.put("message", "查询成功");
            map.put("result", map);

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
                idList = idList + "'" + split + "',";
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

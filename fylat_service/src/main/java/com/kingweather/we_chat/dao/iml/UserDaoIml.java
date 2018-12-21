package com.kingweather.we_chat.dao.iml;

import com.kingweather.common.util.DateUtil;
import com.kingweather.we_chat.constants.UuidUtils;
import com.kingweather.we_chat.dao.userDao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.sql.Timestamp;
import java.util.*;

@Repository
public class UserDaoIml implements userDao {
    @Resource
    private JdbcTemplate jdbcTemplate;

    @Override
    public Map<String, Object> registerUser(Map<String, Object> userData) {
        HashMap<String, Object> map = new HashMap<>();
        Object wechat_id = userData.get("wechat_id");
        if (wechat_id == null) {
            return getErrorMap();
        }

        //判断不让重复注册
        String selectSql = "SELECT count(*) as count from zz_wechat.sys_user where wechat_id=?";
        List<Map<String, Object>> mapList = jdbcTemplate.queryForList(selectSql, new Object[]{wechat_id.toString()});
        boolean isFirst = false;
        if (mapList.size() == 1) {
            Map<String, Object> stringObjectMap = mapList.get(0);
            if (stringObjectMap.get("count").toString().equals("0")) {
                isFirst = true;
            } else {
                map.put("code", 3);
                map.put("message", "该用户已经注册！");
                return map;

            }
        }

        if (isFirst) {
            String tel_phone = userData.get("tel_phone") == null ? "" : userData.get("tel_phone").toString();
            Object nick_name = userData.get("nick_name") == null ? "" : userData.get("nick_name").toString();
            Object true_name = userData.get("true_name") == null ? "" : userData.get("true_name").toString();
            int user_sex = userData.get("user_sex") == null ? 2 : Integer.parseInt(userData.get("user_sex").toString());
            String sysTime = DateUtil.getCurrentTimeString();
            Object icon_path = userData.get("icon_path") == null ? "" : userData.get("icon_path").toString();
            String user_id = UuidUtils.getUUid();

            String inserSql = "insert into zz_wechat.sys_user (user_id,tel_phone,nick_name,true_name,user_sex,create_time,icon_path,wechat_id) " +
                    "values(?,?,?,?,?,date_format(?,'%Y-%m-%d %H:%i:%s'),?,?)";
            int update = jdbcTemplate.update(inserSql, new Object[]{
                    user_id,
                    tel_phone,
                    nick_name,
                    true_name,
                    user_sex,
                    sysTime,
                    icon_path,
                    wechat_id.toString()
            });

            if (update == 1) {
                map.put("code", 0);
                map.put("message", "注册成功");
                map.put("user_id", user_id);
                return map;
            } else {
                return getErrorMapService();
            }

        }

        return getErrorMap();
    }

    @Override
    public Map<String, Object> getIndexMessage(String wechatid, int page) {

        if (wechatid == null || "".equals(wechatid)) {
            return getErrorMap();
        }
        List<Object> list = new ArrayList();
        //默认每页显示10页
        int pageSize = 10;
        //用户关注类型的文章
        String attentionSql = "SELECT c.article_type_name,c.article_type_id,c.article_type_keyword,c.create_time,c.iamge_icon,c.iamge_back,c. parentid" +
                " FROM zz_wechat.sys_user a,zz_wechat.user_articletype b,zz_wechat.article_type c" +
                " where a.user_id=b.user_id AND b.article_type_id=c.article_type_id AND a.wechat_id=? AND c.parentid !=?";
        List<Map<String, Object>> attentionList = jdbcTemplate.queryForList(attentionSql, new Object[]{
                wechatid,
                0
        });
        //查询关注文章的总数
        String countSql = "select count(*) as count from zz_wechat.sys_user a,zz_wechat.article_type b,zz_wechat.user_articletype c where b.article_type_id=c.article_type_id AND a.user_id=c.user_id AND a.wechat_id=?";

        Map<String, Object> countMap = jdbcTemplate.queryForMap(countSql, new Object[]{
                wechatid
        });
        int count = 0;
        Object objCount = countMap.get("count");
        if (objCount != null) {
            count = Integer.parseInt(objCount.toString());
        }
        String sql = "select user_id from zz_wechat.sys_user where wechat_id='" + wechatid + "'";
        Map<String, Object> userMap = jdbcTemplate.queryForMap(sql);
        Object objId = userMap.get("user_id");
        if (objId == null) {
            return getErrorMap();
        }
        String user_id = objId.toString();
        //有关注的文章且 查询的都是关注的文章
        if (count > 0 && pageSize * page <= count || count < 10) {


            String sqld = "SELECT COUNT(*)-1 AS num_prods,c.article_type_id,c.article_id,c.article_keyword,c.create_time,c.content_excerpt,c.article_title,d.iamge_icon,d.article_type_name \n" +
                    "from zz_wechat.sys_user a,zz_wechat.user_articletype b,zz_wechat.article c,zz_wechat.article_type d " +
                    "WHERE a.user_id=b.user_id AND b.article_type_id=d.article_type_id AND c.article_type_id=d.article_type_id " +
                    "AND c.article_id NOT IN (SELECT article_id FROM zz_wechat.user_article WHERE user_id='" +
                    user_id +
                    "' AND type_id ='1') " +
                    "AND a.wechat_id='" +
                    wechatid +
                    "' GROUP BY d.article_type_id ORDER BY c.create_time LIMIT " +
                    page * pageSize +
                    "," +
                    pageSize +
                    "";

            List<Map<String, Object>> mapList = jdbcTemplate.queryForList(sqld);


            list.addAll(mapList);





      /*      String loveId = "SELECT a.article_type_id from zz_wechat.article_type a,zz_wechat.user_articletype b " +
                    "WHERE a.article_type_id=b.article_type_id AND b.user_id='" +
                    user_id +
                    "' AND a.parentid!=0 LIMIT " +
                    page * pageSize +
                    "," +
                    pageSize +
                    "";
            List<Map<String, Object>> loveIdList = jdbcTemplate.queryForList(loveId);
            if (loveIdList != null) {
                for (int i = 0; i < loveIdList.size(); i++) {
                    String article_type_id = loveIdList.get(i).get("article_type_id").toString();

                    String loveSql = "SELECT a.article_type_id,a.article_type_name,a.iamge_icon ,b.article_id,b.article_title ,b.article_keyword ,b.create_time,b.content_excerpt,b.content_type from zz_wechat.article_type a,zz_wechat.article b \n" +
                            " WHERE a.article_type_id=b.article_type_id AND b.article_id NOT in(SELECT article_id from zz_wechat.user_article WHERE user_id='" +
                            user_id +
                            "' AND type_id=1) AND a.article_type_id='" +
                            Integer.parseInt(article_type_id) +
                            "' ORDER BY b.create_time DESC ";
                    List<Map<String, Object>> mapList = jdbcTemplate.queryForList(loveSql);
                    if (mapList != null && mapList.size() > 0) {
                        list.add(mapList);
                    }


                }
            }
*/

        }
        //查询的不是关注的文章
        if (count < 10 || pageSize * page > count) {
            count = (pageSize * page - count) / pageSize;
            if (count < 0) {
                count = 0;
            }


//            String isNoLoveSql = "SELECT COUNT(*)-1 AS num_prods,c.article_id,c.article_type_id,c.article_keyword,c.create_time,c.content_excerpt,c.article_title,d.iamge_icon,d.article_type_name " +
//                    "from zz_wechat.sys_user a,zz_wechat.user_articletype b,zz_wechat.article c,zz_wechat.article_type d " +
//                    "WHERE a.user_id=b.user_id AND b.article_type_id!=d.article_type_id AND c.article_type_id=d.article_type_id AND c.article_id NOT IN (SELECT article_id FROM zz_wechat.user_article WHERE user_id='" + user_id +
//                    "' AND type_id ='1'" +
//                    ") AND a.wechat_id=? GROUP BY d.article_type_id ORDER BY c.create_time DESC LIMIT ?,?";


            String isNoLoveSql = "SELECT COUNT(*)-1 AS num_prods,c.article_id,c.article_type_id,c.article_keyword,c.create_time,c.content_excerpt,c.article_title,d.iamge_icon,d.article_type_name FROM \n" +
                    "zz_wechat.article c,zz_wechat.article_type d WHERE d.article_type_id=c.article_type_id  AND  d.article_type_id NOT IN(SELECT article_type_id FROM user_articletype WHERE user_id='" +
                    user_id +
                    "')  " +
                    "AND d.parentid!='0' AND c.article_id NOT IN (SELECT article_id FROM zz_wechat.user_article WHERE user_id='" +
                    user_id +
                    "' AND type_id ='1') " +
                    "GROUP BY d.article_type_id ORDER BY c.create_time DESC LIMIT " +
                    count * pageSize +
                    "," +
                    pageSize +
                    "  ";

//            List<Map<String, Object>> nomapList = jdbcTemplate.queryForList(isNoLoveSql, new Object[]{
//                    user_id,
//                    0,
//                    user_id,
//                    1,
//                    count * pageSize,
//                    pageSize
//
//            });

            List<Map<String, Object>> nomapList = jdbcTemplate.queryForList(isNoLoveSql);

            list.addAll(nomapList);


        /*    String noLoveId = "SELECT article_type_id from zz_wechat.article_type WHERE article_type_id NOT in(SELECT article_type_id from user_articletype where user_id ='" +
                    user_id +
                    "') LIMIT " +
                    count * pageSize +
                    "," +
                    pageSize;
            List<Map<String, Object>> noLoveIdList = jdbcTemplate.queryForList(noLoveId);

            if (noLoveIdList != null) {
                for (int i = 0; i < noLoveIdList.size(); i++) {
                    String article_type_id = noLoveIdList.get(i).get("article_type_id").toString();
                    String loveSql = "SELECT a.article_type_id,a.article_type_name,a.iamge_icon ,b.article_id,b.article_title ,b.article_keyword ,b.create_time,b.content_excerpt,b.content_type from zz_wechat.article_type a,zz_wechat.article b \n" +
                            " WHERE a.article_type_id=b.article_type_id AND b.article_id NOT in(SELECT article_id from zz_wechat.user_article WHERE user_id='" +
                            user_id +
                            "' AND type_id=1) AND a.article_type_id='" +
                            Integer.parseInt(article_type_id) +
                            "' ORDER BY b.create_time DESC ";
                    List<Map<String, Object>> mapList = jdbcTemplate.queryForList(loveSql);
                    if (mapList != null && mapList.size() > 0) {
                        list.add(mapList);
                    }
                }
            }*/


        }

        HashMap<String, Object> result = new HashMap<>();
        result.put("attention", attentionList);
        result.put("article", list);

        HashMap<String, Object> map = new HashMap<>();
        map.put("code", 0);
        map.put("message", "查询成功");
        map.put("result", result);
        return map;
    }

    /**
     * 用户关注
     *
     * @param wechatid
     * @param attentions
     * @return
     */
    @Override
    public Map<String, Object> setAttention(String wechatid, String attentions, String type) {
        if (wechatid == null || wechatid.isEmpty() || attentions == null || attentions.isEmpty()) {
            return getErrorMap();
        }
        try {
            String[] attentionList = attentions.split(",");
            String selectSql = "select user_id from zz_wechat.sys_user where wechat_id='" + wechatid + "'";
            Map<String, Object> userMap = jdbcTemplate.queryForMap(selectSql);
            Object objId = userMap.get("user_id");
            if (objId == null) {
                return getErrorMap();
            }
            String user_id = objId.toString();

            for (int i = 0; i < attentionList.length; i++) {
                String insertsql = "insert into zz_wechat.user_articletype (user_id,article_type_id) values(?,?)";

                if ("1".equals(type)) {
                    insertsql = " DELETE FROM zz_wechat.user_articletype WHERE user_id=? AND article_type_id=?";
                }
                jdbcTemplate.update(insertsql, new Object[]{
                        user_id,
                        Integer.parseInt(attentionList[i])
                });
            }
        } catch (Exception e) {
            return getErrorMapService();
        }

        HashMap<String, Object> map = new HashMap<>();
        map.put("code", 0);
        map.put("message", "订阅成功");
        return map;
    }

    @Override
    public Map getIndexMessageLast(String wechatid, int page, String article_type_id) {
        if (wechatid == null || "".equals(wechatid)) {
            return getErrorMap();
        }
        if (article_type_id == null || "".equals(article_type_id)) {
            return getErrorMap();
        }
        try {
            String selectSql = "select user_id from zz_wechat.sys_user where wechat_id='" + wechatid + "'";
            Map<String, Object> userMap = jdbcTemplate.queryForMap(selectSql);
            Object objId = userMap.get("user_id");
            if (objId == null) {
                return getErrorMap();
            }
            String user_id = objId.toString();

            String sqlCount = "SELECT count(*) as count FROM " +
                    " zz_wechat.article_type a,zz_wechat.article b WHERE a.parentid !='0' AND a.article_type_id=b.article_type_id \n" +
                    " AND a.article_type_id='" +
                    Integer.parseInt(article_type_id) +
                    "' " +
                    "AND b.article_id NOT in(SELECT article_id from zz_wechat.user_article WHERE user_id ='" +
                    user_id +
                    "' AND type_id='1') " +
                    "ORDER BY b.create_time DESC";
            Map<String, Object> mapCount = jdbcTemplate.queryForMap(sqlCount);
            int count = 0;
            Object objCount = mapCount.get("count");
            if (objCount != null) {
                count = Integer.parseInt(objCount.toString());
            }
            int pageSize = 10;
            String sql = "SELECT a.article_type_id,a.iamge_icon,a.article_type_name,b.article_id,b.article_title ,b.article_keyword ,b.create_time,b.content_excerpt FROM " +
                    " zz_wechat.article_type a,zz_wechat.article b WHERE a.parentid !='0' AND a.article_type_id=b.article_type_id  " +
                    " AND b.article_type_id='" +
                    Integer.parseInt(article_type_id) +
                    "' AND b.article_id NOT in(SELECT article_id from zz_wechat.user_article WHERE user_id ='" +
                    user_id +
                    "' AND type_id='1') " +
                    "ORDER BY b.create_time DESC LIMIT " +
                    page * pageSize +
                    "," +
                    pageSize;

            Map<String, Object> mapresult = new HashMap<>();
            List<Map<String, Object>> mapList = jdbcTemplate.queryForList(sql);
            int num = count - (page + 1) * pageSize - 1;
            if (num < 0) {
                num = 0;
            }
            mapresult.put("count", num);
            mapresult.put("article", mapList);
            Map<String, Object> map = new HashMap<>();
            map.put("code", 0);
            map.put("message", "查询成功");
            map.put("result", mapresult);
            return map;


        } catch (Exception e) {
            return getErrorMapService();

        }


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

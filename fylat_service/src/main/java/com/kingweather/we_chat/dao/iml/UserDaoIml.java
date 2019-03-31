package com.kingweather.we_chat.dao.iml;

import com.kingweather.common.util.DateUtil;
import com.kingweather.we_chat.constants.UuidUtils;
import com.kingweather.we_chat.dao.userDao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
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

/*
    @Override
    public Map<String, Object> getIndexMessage(String wechatid, int page) {

        if (wechatid == null || "".equals(wechatid)) {
            return getErrorMap();
        }
        String currentTimeString = DateUtil.getCurrentTimeString();
        String oneDay = DateUtil.getbeforeDayCurrentDateString(1);

        String oneStartTime = oneDay + " 00:00:00";
        String oneEndTime = oneDay + " 23:59:59";
        String twoDay = DateUtil.getbeforeDayCurrentDateString(2);
        String twoStartTime = twoDay + " 00:00:00";
        String twoEndTime = twoDay + " 23:59:59";
        String threeDay = DateUtil.getbeforeDayCurrentDateString(3);
        String threeStartTime = threeDay + " 00:00:00";
        String threeEndTime = threeDay + " 23:59:59";
        List<Object> list = new ArrayList();
        String sql = "select user_id from zz_wechat.sys_user where wechat_id='" + wechatid + "'";
        Map<String, Object> userMap = jdbcTemplate.queryForMap(sql);
        Object objId = userMap.get("user_id");
        if (objId == null) {
            return getErrorMap();
        }
        String user_id = objId.toString();
        //默认每页显示10页
        int pageSize = 10;
        //用户关注类型的文章
*/
/*        String attentionSql = "SELECT c.article_type_name,c.article_type_id,c.article_type_keyword,c.create_time,c.iamge_icon,c.iamge_back,c. parentid" +
                " FROM zz_wechat.sys_user a,zz_wechat.user_articletype b,zz_wechat.article_type c" +
                " where a.user_id=b.user_id AND b.article_type_id=c.article_type_id AND a.wechat_id=? AND c.parentid !=?";*//*



        String attentionSql = "SELECT 1 as type, c.article_type_name,c.article_type_id,c.article_type_keyword,c.create_time,c.iamge_icon,c.iamge_back,c.parentid" +
                " FROM zz_wechat.sys_user a,zz_wechat.user_articletype b,zz_wechat.article_type c" +
                " where a.user_id=b.user_id AND b.article_type_id=c.article_type_id AND a.wechat_id=? AND c.parentid !=?" +
                " AND b.article_type_id IN (SELECT article_type_id FROM zz_wechat.article where " +
                " update_time<=date_format(?,'%Y-%m-%d %H:%i:%s') " +
                "AND update_time>=date_format(?,'%Y-%m-%d %H:%i:%s') and article_id NOT IN (SELECT article_id FROM  zz_wechat.user_article WHERE user_id=?))";

        List<Map<String, Object>> attentionList = jdbcTemplate.queryForList(attentionSql, new Object[]{
                wechatid,
                0,
                currentTimeString,
                oneStartTime,
                user_id
        });
//        String attentionSqla = "SELECT 2 as type, c.article_type_name,c.article_type_id,c.article_type_keyword,c.create_time,c.iamge_icon,c.iamge_back,c. parentid" +
//                " FROM zz_wechat.sys_user a,zz_wechat.user_articletype b,zz_wechat.article_type c" +
//                " where a.user_id=b.user_id AND b.article_type_id=c.article_type_id AND a.wechat_id=? AND c.parentid !=?" +
//                " AND b.article_type_id NOT IN (SELECT article_type_id FROM zz_wechat.article where " +
//                " update_time<date_format(?,'%Y-%m-%d %H:%i:%s') " +
//                "AND update_time>date_format(?,'%Y-%m-%d %H:%i:%s'))";

        String attentionSqla = "SELECT 2 as type, c.article_type_name,c.article_type_id,c.article_type_keyword,c.create_time,c.iamge_icon,c.iamge_back,c. parentid" +
                " FROM zz_wechat.sys_user a,zz_wechat.user_articletype b,zz_wechat.article_type c" +
                " where a.user_id=b.user_id AND b.article_type_id=c.article_type_id AND a.wechat_id=? AND c.parentid !=?";

        List<Map<String, Object>> maps = jdbcTemplate.queryForList(attentionSqla, new Object[]{
                wechatid,
                0
        });

        List<Map<String, Object>> rulust = new ArrayList<>();
        for (int i = 0; i < maps.size(); i++) {
            for (int j = 0; j < attentionList.size(); j++) {
                if (maps.get(i).get("article_type_id") == attentionList.get(j).get("article_type_id")) {
                    rulust.add(maps.get(i));
                }
            }
        }
        maps.removeAll(rulust);
        attentionList.addAll(maps);
        //查询关注文章的总数
//        String countSql = "select count(*) as count from zz_wechat.sys_user a,zz_wechat.article_type b,zz_wechat.user_articletype c where b.article_type_id=c.article_type_id AND a.user_id=c.user_id AND a.wechat_id=?";
//
//        Map<String, Object> countMap = jdbcTemplate.queryForMap(countSql, new Object[]{
//                wechatid
//        });
//        int count = 0;
//        Object objCount = countMap.get("count");
//        if (objCount != null) {
//            count = Integer.parseInt(objCount.toString());
//        }


        //有关注的文章且 查询的都是关注的文章
//        if (count > 0 && pageSize * page < count || count < 10) {
        if (page == 0) {
            String hoursSql = "SELECT * ,COUNT(*) - 1 AS num_prods,1 as  type from (SELECT c.article_type_id,c.article_id,c.article_keyword,c.create_time,c.content_excerpt,c.article_title,DATE_ADD(c.update_time,INTERVAL -8 HOUR) AS update_time,d.iamge_icon,d.article_type_name \n" +
                    "from zz_wechat.sys_user a,zz_wechat.user_articletype b,zz_wechat.article c,zz_wechat.article_type d \n" +
                    "WHERE a.user_id=b.user_id AND b.article_type_id=d.article_type_id AND c.article_type_id=d.article_type_id \n" +
                    " AND c.update_time>date_format('" +
                    oneEndTime +
                    "','%Y-%m-%d %H:%i:%s')\n" +
                    " AND c.update_time<=date_format('" +
                    currentTimeString +
                    "','%Y-%m-%d %H:%i:%s')\n" +
                    "AND c.article_id NOT IN (SELECT article_id FROM zz_wechat.user_article \n" +
                    "WHERE user_id='" +
                    user_id +
                    "' AND type_id ='1') \n" +
                    "AND a.wechat_id='" +
                    wechatid +
                    "' \n" +
                    "ORDER BY c.update_time DESC) t \n" +
                    "GROUP BY article_type_id ,date_format(update_time, '%Y-%m-%d %H ')\n" +
                    "ORDER BY update_time DESC ";
            List<Map<String, Object>> hoursDay = jdbcTemplate.queryForList(hoursSql);
            list.addAll(hoursDay);
            String oneDaySql = "SELECT * ,COUNT(*) - 1 AS num_prods,2 as  type from (SELECT c.article_type_id,c.article_id,c.article_keyword,c.create_time,c.content_excerpt,c.article_title,DATE_ADD(c.update_time,INTERVAL -8 HOUR) AS update_time,d.iamge_icon,d.article_type_name \n" +
                    "from zz_wechat.sys_user a,zz_wechat.user_articletype b,zz_wechat.article c,zz_wechat.article_type d \n" +
                    "WHERE a.user_id=b.user_id AND b.article_type_id=d.article_type_id AND c.article_type_id=d.article_type_id \n" +
                    " AND c.update_time>=date_format('" +
                    oneStartTime +
                    "','%Y-%m-%d %H:%i:%s')\n" +
                    " AND c.update_time<=date_format('" +
                    oneEndTime +
                    "','%Y-%m-%d %H:%i:%s')\n" +
                    "AND c.article_id NOT IN (SELECT article_id FROM zz_wechat.user_article \n" +
                    "WHERE user_id='" +
                    user_id +
                    "' AND type_id ='1') \n" +
                    "AND a.wechat_id='" +
                    wechatid +
                    "' \n" +
                    "ORDER BY c.update_time DESC) t \n" +
                    "GROUP BY article_type_id,date_format(update_time, '%Y-%m-%d') " +
                    "ORDER BY update_time DESC ";
            List<Map<String, Object>> oneDayList = jdbcTemplate.queryForList(oneDaySql);
            list.addAll(oneDayList);


            String twoDaySql = "SELECT * ,COUNT(*) - 1 AS num_prods,3 as  type from (SELECT c.article_type_id,c.article_id,c.article_keyword,c.create_time,c.content_excerpt,c.article_title,DATE_ADD(c.update_time,INTERVAL -8 HOUR) AS update_time,d.iamge_icon,d.article_type_name \n" +
                    "from zz_wechat.sys_user a,zz_wechat.user_articletype b,zz_wechat.article c,zz_wechat.article_type d \n" +
                    "WHERE a.user_id=b.user_id AND b.article_type_id=d.article_type_id AND c.article_type_id=d.article_type_id \n" +
                    " AND c.update_time>=date_format('" +
                    twoStartTime +
                    "','%Y-%m-%d %H:%i:%s')\n" +
                    " AND c.update_time<=date_format('" +
                    twoEndTime +
                    "','%Y-%m-%d %H:%i:%s')\n" +
                    "AND c.article_id NOT IN (SELECT article_id FROM zz_wechat.user_article \n" +
                    "WHERE user_id='" +
                    user_id +
                    "' AND type_id ='1') \n" +
                    "AND a.wechat_id='" +
                    wechatid +
                    "' \n" +
                    "ORDER BY c.update_time DESC) t \n" +
                    "GROUP BY article_type_id,date_format(update_time, '%Y-%m-%d') " +
                    "ORDER BY update_time DESC ";
            List<Map<String, Object>> twoDayList = jdbcTemplate.queryForList(twoDaySql);
            list.addAll(twoDayList);


            String sqld = "SELECT * ,COUNT(*) - 1 AS num_prods,4 as  type from (SELECT c.article_type_id,c.article_id,c.article_keyword,c.create_time,c.content_excerpt,c.article_title,DATE_ADD(c.update_time,INTERVAL -8 HOUR) AS update_time,d.iamge_icon,d.article_type_name \n" +
                    "from zz_wechat.sys_user a,zz_wechat.user_articletype b,zz_wechat.article c,zz_wechat.article_type d \n" +
                    "WHERE a.user_id=b.user_id AND b.article_type_id=d.article_type_id AND c.article_type_id=d.article_type_id \n" +
                    " AND c.update_time<=date_format('" +
                    threeStartTime +
                    "','%Y-%m-%d %H:%i:%s')\n" +
                    "AND c.article_id NOT IN (SELECT article_id FROM zz_wechat.user_article \n" +
                    "WHERE user_id='" +
                    user_id +
                    "' AND type_id ='1') \n" +
                    "AND a.wechat_id='" +
                    wechatid +
                    "' \n" +
                    "ORDER BY c.update_time DESC) t \n" +
                    "GROUP BY article_type_id" +
                    " ORDER BY update_time DESC ";


       */
/*     String sqld = "SELECT * ,COUNT(*) - 1 AS num_prods from (SELECT c.article_type_id,c.article_id,c.article_keyword,c.create_time,c.content_excerpt,c.article_title,DATE_ADD(c.update_time,INTERVAL -8 HOUR) AS update_time,d.iamge_icon,d.article_type_name \n" +
                    "from zz_wechat.sys_user a,zz_wechat.user_articletype b,zz_wechat.article c,zz_wechat.article_type d " +
                    "WHERE a.user_id=b.user_id AND b.article_type_id=d.article_type_id AND c.article_type_id=d.article_type_id " +
                    "AND c.article_id NOT IN (SELECT article_id FROM zz_wechat.user_article WHERE user_id='" +
                    user_id +
                    "' AND type_id ='1') " +
                    "AND a.wechat_id='" +
                    wechatid +
                    "' ORDER BY" +
                    " c.update_time DESC) t GROUP BY article_type_id ORDER BY update_time DESC LIMIT " +
                    page * pageSize +
                    "," +
                    pageSize +
                    "";*//*


            List<Map<String, Object>> mapList = jdbcTemplate.queryForList(sqld);
            list.addAll(mapList);
        }
//        }
        //查询的不是关注的文章
//        if (count < 10 || pageSize * page >= count) {
//            count = (pageSize * page - count) / pageSize;
//            if (count < 0) {
//                count = 0;
//            }
//            String isNoLoveSql = "SELECT * ,COUNT(*) - 1 AS num_prods from (SELECT c.article_id,c.article_type_id,c.article_keyword,c.create_time,c.content_excerpt,c.article_title,DATE_ADD(c.update_time,INTERVAL -8 HOUR) AS update_time,d.iamge_icon,d.article_type_name FROM \n" +
//                    "zz_wechat.article c,zz_wechat.article_type d WHERE d.article_type_id=c.article_type_id  AND  d.article_type_id NOT IN(SELECT article_type_id FROM user_articletype WHERE user_id='" +
//                    user_id +
//                    "')  " +
//                    "AND d.parentid!='0' AND c.article_id NOT IN (SELECT article_id FROM zz_wechat.user_article WHERE user_id='" +
//                    user_id +
//                    "' AND type_id ='1') ORDER BY c.update_time DESC) t " +
//                    "GROUP BY article_type_id ORDER BY update_time DESC LIMIT " +
//                    count * pageSize +
//                    "," +
//                    pageSize +
//                    "  ";
//            List<Map<String, Object>> nomapList = jdbcTemplate.queryForList(isNoLoveSql);
//            list.addAll(nomapList);
//        }

        if (page == 1 || list.size() == 0&&page < 2) {


                String noHosursSql = "SELECT * ,COUNT(*) - 1 AS num_prods,1 as  type from (SELECT c.article_id,c.article_type_id,c.article_keyword,c.create_time,c.content_excerpt,c.article_title,DATE_ADD(c.update_time,INTERVAL -8 HOUR) AS update_time,d.iamge_icon,d.article_type_name FROM \n" +
                        "zz_wechat.article c,zz_wechat.article_type d \n" +
                        "WHERE d.article_type_id=c.article_type_id  \n" +
                        "AND  d.article_type_id NOT IN(SELECT article_type_id FROM user_articletype \n" +
                        "WHERE user_id='" +
                        user_id +
                        "')  AND d.parentid!='0' \n" +
                        " AND c.update_time>=date_format('" +
                        oneEndTime +
                        "','%Y-%m-%d %H:%i:%s')\n" +
                        " AND c.update_time<=date_format('" +
                        currentTimeString +
                        "','%Y-%m-%d %H:%i:%s')\n" +
                        "AND c.article_id NOT IN (SELECT article_id FROM zz_wechat.user_article \n" +
                        "WHERE user_id='" +
                        wechatid +
                        "' AND type_id ='1') \n" +
                        "ORDER BY c.update_time DESC) t \n" +
                        "GROUP BY article_type_id ,date_format(update_time, '%Y-%m-%d %H ') ORDER BY update_time desc";

                List<Map<String, Object>> noHosursList = jdbcTemplate.queryForList(noHosursSql);
                list.addAll(noHosursList);


                String noOneDaySql = "SELECT * ,COUNT(*) - 1 AS num_prods,2 as  type from (SELECT c.article_id,c.article_type_id,c.article_keyword,c.create_time,c.content_excerpt,c.article_title,DATE_ADD(c.update_time,INTERVAL -8 HOUR) AS update_time,d.iamge_icon,d.article_type_name FROM \n" +
                        "zz_wechat.article c,zz_wechat.article_type d \n" +
                        "WHERE d.article_type_id=c.article_type_id  \n" +
                        "AND  d.article_type_id NOT IN(SELECT article_type_id FROM user_articletype \n" +
                        "WHERE user_id='" +
                        user_id +
                        "')  AND d.parentid!='0' \n" +
                        " AND c.update_time>=date_format('" +
                        oneStartTime +
                        "','%Y-%m-%d %H:%i:%s')\n" +
                        " AND c.update_time<=date_format('" +
                        oneEndTime +
                        "','%Y-%m-%d %H:%i:%s')\n" +
                        "AND c.article_id NOT IN (SELECT article_id FROM zz_wechat.user_article \n" +
                        "WHERE user_id='" +
                        wechatid +
                        "' AND type_id ='1') \n" +
                        "ORDER BY c.update_time DESC) t \n" +
                        "GROUP BY article_type_id  ORDER BY update_time desc";

                List<Map<String, Object>> noOneDayList = jdbcTemplate.queryForList(noOneDaySql);
                list.addAll(noOneDayList);


                String noTwoDaySql = "SELECT * ,COUNT(*) - 1 AS num_prods,3 as  type from (SELECT c.article_id,c.article_type_id,c.article_keyword,c.create_time,c.content_excerpt,c.article_title,DATE_ADD(c.update_time,INTERVAL -8 HOUR) AS update_time,d.iamge_icon,d.article_type_name FROM \n" +
                        "zz_wechat.article c,zz_wechat.article_type d \n" +
                        "WHERE d.article_type_id=c.article_type_id  \n" +
                        "AND  d.article_type_id NOT IN(SELECT article_type_id FROM user_articletype \n" +
                        "WHERE user_id='" +
                        user_id +
                        "')  AND d.parentid!='0' \n" +
                        " AND c.update_time>=date_format('" +
                        twoStartTime +
                        "','%Y-%m-%d %H:%i:%s')\n" +
                        " AND c.update_time<=date_format('" +
                        twoEndTime +
                        "','%Y-%m-%d %H:%i:%s')\n" +
                        "AND c.article_id NOT IN (SELECT article_id FROM zz_wechat.user_article \n" +
                        "WHERE user_id='" +
                        wechatid +
                        "' AND type_id ='1') \n" +
                        "ORDER BY c.update_time DESC) t \n" +
                        "GROUP BY article_type_id ,date_format(update_time, '%Y-%m-%d') ORDER BY update_time desc";

                List<Map<String, Object>> noTwoDayList = jdbcTemplate.queryForList(noTwoDaySql);
                list.addAll(noTwoDayList);


                String noThreeDaySql = "SELECT * ,COUNT(*) - 1 AS num_prods,4 as  type from (SELECT c.article_id,c.article_type_id,c.article_keyword,c.create_time,c.content_excerpt,c.article_title,DATE_ADD(c.update_time,INTERVAL -8 HOUR) AS update_time,d.iamge_icon,d.article_type_name FROM \n" +
                        "zz_wechat.article c,zz_wechat.article_type d \n" +
                        "WHERE d.article_type_id=c.article_type_id  \n" +
                        "AND  d.article_type_id NOT IN(SELECT article_type_id FROM user_articletype \n" +
                        "WHERE user_id='" +
                        user_id +
                        "')  AND d.parentid!='0' \n" +
                        " AND c.update_time<=date_format('" +
                        threeStartTime +
                        "','%Y-%m-%d %H:%i:%s')\n" +
                        "AND c.article_id NOT IN (SELECT article_id FROM zz_wechat.user_article \n" +
                        "WHERE user_id='" +
                        wechatid +
                        "' AND type_id ='1') \n" +
                        "ORDER BY c.update_time DESC) t \n" +
                        "GROUP BY article_type_id  ORDER BY update_time desc";

                List<Map<String, Object>> noThreeDayList = jdbcTemplate.queryForList(noThreeDaySql);
                list.addAll(noThreeDayList);
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
*/


    @Override
    public Map<String, Object> getIndexMessage(String wechatid, int page) {
        try {



        if (wechatid == null || "".equals(wechatid)) {
            return getErrorMap();
        }
        String currentTimeString = DateUtil.getCurrentTimeString();
        String oneDay = DateUtil.getbeforeDayCurrentDateString(1);

        String oneStartTime = oneDay + " 00:00:00";
        String oneEndTime = oneDay + " 23:59:59";
        List<Object> list = new ArrayList();
        String sql = "select user_id from zz_wechat.sys_user where wechat_id='" + wechatid + "'";
        Map<String, Object> userMap = jdbcTemplate.queryForMap(sql);
        Object objId = userMap.get("user_id");
        if (objId == null) {
            return getErrorMap();
        }
        String user_id = objId.toString();
        //默认每页显示10页
        int pageSize = 10;
        //用户关注类型的文章
/*        String attentionSql = "SELECT c.article_type_name,c.article_type_id,c.article_type_keyword,c.create_time,c.iamge_icon,c.iamge_back,c. parentid" +
                " FROM zz_wechat.sys_user a,zz_wechat.user_articletype b,zz_wechat.article_type c" +
                " where a.user_id=b.user_id AND b.article_type_id=c.article_type_id AND a.wechat_id=? AND c.parentid !=?";*/


        String attentionSql = "SELECT 1 as type, c.article_type_name,c.article_type_id,c.article_type_keyword,c.create_time,c.iamge_icon,c.iamge_back,c.parentid" +
                " FROM zz_wechat.sys_user a,zz_wechat.user_articletype b,zz_wechat.article_type c" +
                " where c.del_type !=1 and a.user_id=b.user_id AND b.article_type_id=c.article_type_id AND a.wechat_id=? AND c.parentid !=? AND c.parentid !=? AND c.issue =?" +
                " AND b.article_type_id IN (SELECT article_type_id FROM zz_wechat.article where " +
                " update_time<=date_format(?,'%Y-%m-%d %H:%i:%s') " +
                "AND update_time>=date_format(?,'%Y-%m-%d %H:%i:%s') and article_id NOT IN (SELECT article_id FROM  zz_wechat.user_article WHERE user_id=?))";

        List<Map<String, Object>> attentionList = jdbcTemplate.queryForList(attentionSql, new Object[]{
                wechatid,
                100,
                -1,
                1,
                currentTimeString,
                oneStartTime,
                user_id
        });


        String attentionSqla = "SELECT 2 as type, c.article_type_name,c.article_type_id,c.article_type_keyword,c.create_time,c.iamge_icon,c.iamge_back,c. parentid" +
                " FROM zz_wechat.sys_user a,zz_wechat.user_articletype b,zz_wechat.article_type c" +
                " where c.del_type != ? AND  a.user_id=b.user_id AND b.article_type_id=c.article_type_id AND a.wechat_id=? AND c.parentid !=? AND c.parentid !=? AND c.issue =?";

        List<Map<String, Object>> maps = jdbcTemplate.queryForList(attentionSqla, new Object[]{
                1,
                wechatid,
                100,
                -1,
                1
        });

        List<Map<String, Object>> rulust = new ArrayList<>();
        for (int i = 0; i < maps.size(); i++) {
            for (int j = 0; j < attentionList.size(); j++) {
                if (maps.get(i).get("article_type_id") .equals( attentionList.get(j).get("article_type_id"))) {
                    rulust.add(maps.get(i));
                }
            }
        }
        maps.removeAll(rulust);
        attentionList.addAll(maps);
        //查询关注文章的总数
        String countSql = " SELECT count(*) as count from ( SELECT 2 as  type from (SELECT c.state,c.article_type_id,c.article_id,c.create_time,DATE_ADD(c.update_time,INTERVAL -8 HOUR) AS update_time\n" +
                "from zz_wechat.sys_user a,zz_wechat.user_articletype b,zz_wechat.article c,zz_wechat.article_type d \n" +
                "WHERE d.del_type !=1 and d.issue=1 and c.del_type !=1 and a.user_id=b.user_id AND b.article_type_id=d.article_type_id AND c.article_type_id=d.article_type_id \n" +
                " AND c.update_time<=date_format('" +
                oneEndTime +
                "','%Y-%m-%d %H:%i:%s')\n" +
                "AND c.article_id NOT IN (SELECT article_id FROM zz_wechat.user_article \n" +
                "WHERE user_id='" +
                user_id +
                "' AND type_id ='1') \n" +
                "AND a.wechat_id='" +
                wechatid +
                "' \n" +
                "ORDER BY c.update_time DESC) t \n" +
                "GROUP BY article_type_id,date_format(update_time, '%Y-%m-%d') ORDER BY update_time DESC )m";

        Map<String, Object> countMap = jdbcTemplate.queryForMap(countSql);
        int count = 0;
        Object objCount = countMap.get("count");
        if (objCount != null) {
            count = Integer.parseInt(objCount.toString());
        }


        //有关注的文章且 查询的都是关注的文章
//        if (count > 0 && pageSize * page < count || count < 10) {
        if (page == 0) {
            String hoursSql = "SELECT * ,COUNT(*) - 1 AS num_prods,1 as  type from (SELECT c.content_type,c.state, c.article_type_id,c.article_id,c.article_keyword,c.create_time,c.content_excerpt,c.article_title,DATE_ADD(c.update_time,INTERVAL -8 HOUR) AS update_time,d.iamge_icon,d.article_type_name \n" +
                    "from zz_wechat.sys_user a,zz_wechat.user_articletype b,zz_wechat.article c,zz_wechat.article_type d \n" +
                    "WHERE d.del_type !=1 and d.issue=1 and c.del_type !=1 and a.user_id=b.user_id AND b.article_type_id=d.article_type_id AND c.article_type_id=d.article_type_id \n" +
                    " AND c.update_time>date_format('" +
                    oneEndTime +
                    "','%Y-%m-%d %H:%i:%s')\n" +
                    " AND c.update_time<=date_format('" +
                    currentTimeString +
                    "','%Y-%m-%d %H:%i:%s')\n" +
                    "AND c.article_id NOT IN (SELECT article_id FROM zz_wechat.user_article \n" +
                    "WHERE user_id='" +
                    user_id +
                    "' AND type_id ='1') \n" +
                    "AND a.wechat_id='" +
                    wechatid +
                    "' \n" +
                    "ORDER BY c.update_time DESC) t \n" +
                    "GROUP BY article_type_id ,date_format(update_time, '%Y-%m-%d %H '),state \n" +
                    "ORDER BY update_time DESC ";
            List<Map<String, Object>> hoursDay = jdbcTemplate.queryForList(hoursSql);
            list.addAll(hoursDay);
            String oneDaySql = "SELECT * ,COUNT(*) - 1 AS num_prods,2 as  type from (SELECT c.content_type,c.state, c.article_type_id,c.article_id,c.article_keyword,c.create_time,c.content_excerpt,c.article_title,DATE_ADD(c.update_time,INTERVAL -8 HOUR) AS update_time,d.iamge_icon,d.article_type_name \n" +
                    "from zz_wechat.sys_user a,zz_wechat.user_articletype b,zz_wechat.article c,zz_wechat.article_type d \n" +
                    "WHERE d.del_type !=1 and d.issue=1 and c.del_type !=1 and a.user_id=b.user_id AND b.article_type_id=d.article_type_id AND c.article_type_id=d.article_type_id \n" +
                    " AND c.update_time<=date_format('" +
                    oneEndTime +
                    "','%Y-%m-%d %H:%i:%s')\n" +
                    "AND c.article_id NOT IN (SELECT article_id FROM zz_wechat.user_article \n" +
                    "WHERE user_id='" +
                    user_id +
                    "' AND type_id ='1') \n" +
                    "AND a.wechat_id='" +
                    wechatid +
                    "' \n" +
                    "ORDER BY c.update_time DESC) t \n" +
                    "GROUP BY article_type_id,date_format(update_time, '%Y-%m-%d'),state " +
                    "ORDER BY update_time DESC LIMIT 0,10";
            List<Map<String, Object>> oneDayList = jdbcTemplate.queryForList(oneDaySql);
            list.addAll(oneDayList);
        }
        if (page >= 0 && count > 0 && pageSize * (page + 1) < count) {
            String oneDaySql = "SELECT * ,COUNT(*) - 1 AS num_prods,2 as  type from (SELECT  c.content_type, c.state,c.article_type_id,c.article_id,c.article_keyword,c.create_time,c.content_excerpt,c.article_title,DATE_ADD(c.update_time,INTERVAL -8 HOUR) AS update_time,d.iamge_icon,d.article_type_name \n" +
                    "from zz_wechat.sys_user a,zz_wechat.user_articletype b,zz_wechat.article c,zz_wechat.article_type d \n" +
                    "WHERE d.del_type !=1 and d.issue=1  and c.del_type !=1 and a.user_id=b.user_id AND b.article_type_id=d.article_type_id AND c.article_type_id=d.article_type_id \n" +
                    " AND c.update_time<=date_format('" +
                    oneEndTime +
                    "','%Y-%m-%d %H:%i:%s')\n" +
                    "AND c.article_id NOT IN (SELECT article_id FROM zz_wechat.user_article \n" +
                    "WHERE user_id='" +
                    user_id +
                    "' AND type_id ='1') \n" +
                    "AND a.wechat_id='" +
                    wechatid +
                    "' \n" +
                    "ORDER BY c.update_time DESC) t \n" +
                    "GROUP BY article_type_id,date_format(update_time, '%Y-%m-%d'),state " +
                    "ORDER BY update_time DESC LIMIT " +
                    (page + 1) * pageSize +
                    "," +
                    pageSize;
            List<Map<String, Object>> oneDayList = jdbcTemplate.queryForList(oneDaySql);
            list.addAll(oneDayList);

        }
//  没有关注的文章 按类型和天来进行分类
        if (list == null || list.size() < pageSize || pageSize * (page + 1) >= count) {


            String noCount = "SELECT  count(*) as noCount from ( SELECT 2 as  type from (SELECT c.content_type,c.state,c.article_id,c.article_type_id,c.article_keyword,c.create_time,c.content_excerpt,c.article_title,DATE_ADD(c.update_time,INTERVAL -8 HOUR) AS update_time,d.iamge_icon,d.article_type_name FROM \n" +
                    "zz_wechat.article c,zz_wechat.article_type d \n" +
                    "WHERE d.del_type !=1 and d.issue=1 and c.del_type !=1 and d.article_type_id=c.article_type_id  \n" +
                    "AND  d.article_type_id NOT IN(SELECT article_type_id FROM user_articletype \n" +
                    "WHERE user_id='" +
                    user_id +
                    "')  AND d.parentid!='0' AND d.parentid!='-1' \n" +
                    " AND c.update_time<=date_format('" +
                    oneEndTime +
                    "','%Y-%m-%d %H:%i:%s')\n" +
                    "AND c.article_id NOT IN (SELECT article_id FROM zz_wechat.user_article \n" +
                    "WHERE user_id='" +
                    wechatid +
                    "' AND type_id ='1') \n" +
                    "ORDER BY c.update_time DESC) t \n" +
                    "GROUP BY article_type_id, date_format(update_time, '%Y-%m-%d'),state ORDER BY update_time desc )m";

            Map<String, Object> noCountMap = jdbcTemplate.queryForMap(noCount);

            int noLoveCount = 0;
            Object objNoCount = noCountMap.get("noCount");
            if (objNoCount != null) {
                noLoveCount = Integer.parseInt(objNoCount.toString());
            }
            int num = page-(count / pageSize) +1;
            if (num < 0) {
                num = 0;
            }
            if (num == 0||page==0) {
                //小时分类
                String noHosursSql = "SELECT * ,COUNT(*) - 1 AS num_prods,1 as  type from (SELECT c.content_type,c.state,c.article_id,c.article_type_id,c.article_keyword,c.create_time,c.content_excerpt,c.article_title,DATE_ADD(c.update_time,INTERVAL -8 HOUR) AS update_time,d.iamge_icon,d.article_type_name FROM \n" +
                        "zz_wechat.article c,zz_wechat.article_type d \n" +
                        "WHERE d.del_type !=1 and d.issue=1  and c.del_type !=1 and d.article_type_id=c.article_type_id  \n" +
                        "AND  d.article_type_id NOT IN(SELECT article_type_id FROM user_articletype \n" +
                        "WHERE user_id='" +
                        user_id +
                        "')  AND d.parentid!='0' AND d.parentid!='-1'\n" +
                        " AND c.update_time>=date_format('" +
                        oneEndTime +
                        "','%Y-%m-%d %H:%i:%s')\n" +
                        " AND c.update_time<=date_format('" +
                        currentTimeString +
                        "','%Y-%m-%d %H:%i:%s')\n" +
                        "AND c.article_id NOT IN (SELECT article_id FROM zz_wechat.user_article \n" +
                        "WHERE user_id='" +
                        wechatid +
                        "' AND type_id ='1') \n" +
                        "ORDER BY c.update_time DESC) t \n" +
                        "GROUP BY article_type_id ,date_format(update_time, '%Y-%m-%d %H '),state ORDER BY update_time desc";

                List<Map<String, Object>> noHosursList = jdbcTemplate.queryForList(noHosursSql);
                list.addAll(noHosursList);
            }


            if (page >=0  && noLoveCount > 0 && pageSize * num < noLoveCount) {

                String noOneDaySql = "SELECT * ,COUNT(*) - 1 AS num_prods,2 as  type from (SELECT c.content_type,c.state, c.article_id,c.article_type_id,c.article_keyword,c.create_time,c.content_excerpt,c.article_title,DATE_ADD(c.update_time,INTERVAL -8 HOUR) AS update_time,d.iamge_icon,d.article_type_name FROM \n" +
                        "zz_wechat.article c,zz_wechat.article_type d \n" +
                        "WHERE d.del_type !=1 and d.issue=1  and c.del_type !=1 and d.article_type_id=c.article_type_id  \n" +
                        "AND  d.article_type_id NOT IN(SELECT article_type_id FROM user_articletype \n" +
                        "WHERE user_id='" +
                        user_id +
                        "')  AND d.parentid!='0' AND d.parentid!='-1'\n" +
                        " AND c.update_time<=date_format('" +
                        oneEndTime +
                        "','%Y-%m-%d %H:%i:%s')\n" +
                        "AND c.article_id NOT IN (SELECT article_id FROM zz_wechat.user_article \n" +
                        "WHERE user_id='" +
                        wechatid +
                        "' AND type_id ='1') \n" +
                        "ORDER BY c.update_time DESC) t \n" +
                        "GROUP BY article_type_id ,date_format(update_time, '%Y-%m-%d'),state ORDER BY update_time desc LIMIT " +
                        num * pageSize +
                        "," +
                        pageSize;
                List<Map<String, Object>> noOneDayList = jdbcTemplate.queryForList(noOneDaySql);
                list.addAll(noOneDayList);

            }

        }

        HashMap<String, Object> result = new HashMap<>();
        result.put("attention", attentionList);
        result.put("article", list);
        HashMap<String, Object> map = new HashMap<>();
        map.put("code", 0);
        map.put("message", "查询成功");
        map.put("result", result);
        return map;

        }catch (Exception e){
            HashMap<String, Object> map = new HashMap<>();
            map.put("code", 1);
            map.put("message", "服务器内部错误");
            return map;

        }
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
                String insertsql = "";


                if ("1".equals(type)) {
                    insertsql = " DELETE FROM zz_wechat.user_articletype WHERE user_id=? AND article_type_id=?";
                    jdbcTemplate.update(insertsql, new Object[]{
                            user_id,
                            attentionList[i]
                    });
                }else {
                    Map<String, Object> map=null;
                    try {
                    String countSql="select count(*) as count from zz_wechat.user_articletype where user_id=? and article_type_id=?";
                      map = jdbcTemplate.queryForMap(countSql, new Object[]{
                            user_id,
                            attentionList[i]
                    });
                    }catch (Exception e){
                        insertsql = "insert into zz_wechat.user_articletype (user_id,article_type_id) values(?,?)";
                        jdbcTemplate.update(insertsql, new Object[]{
                                user_id,
                                attentionList[i]
                        });

                    }

                    if(map!=null&&Integer.parseInt(map.get("count").toString())==0){

                        insertsql = "insert into zz_wechat.user_articletype (user_id,article_type_id) values(?,?)";
                        jdbcTemplate.update(insertsql, new Object[]{
                                user_id,
                                attentionList[i]
                        });

                    }

                }

            }
        } catch (Exception e) {
            return getErrorMap();
        }

        HashMap<String, Object> map = new HashMap<>();
        map.put("code", 0);
        map.put("message", "订阅成功");
        return map;
    }

    @Override
    public Map getIndexMessageLast(String state,String wechatid, int page, String article_type_id, int type, String time, String article_id) {
        if (wechatid == null || "".equals(wechatid)) {
            return getErrorMap();
        }
        if (article_type_id == null || "".equals(article_type_id)) {
            return getErrorMap();
        }

        Map<String, Object> mapresult = new HashMap<>();
        try {
            String selectSql = "select user_id from zz_wechat.sys_user where wechat_id='" + wechatid + "'";
            Map<String, Object> userMap = jdbcTemplate.queryForMap(selectSql);
            Object objId = userMap.get("user_id");
            if (objId == null) {
                return getErrorMap();
            }
            String user_id = objId.toString();
            //歷史數據
            if (type == 4) {
//         /*       String sqlCount = "SELECT count(*) as count FROM " +
//                        " zz_wechat.article_type a,zz_wechat.article b WHERE a.parentid !='0' AND a.article_type_id=b.article_type_id \n" +
//                        " AND a.article_type_id='" +
//                        Integer.parseInt(article_type_id) +
//                        "' " +
//                        "AND b.article_id NOT in(SELECT article_id from zz_wechat.user_article WHERE user_id ='" +
//                        user_id +
//                        "' AND type_id='1') " +
//                        "ORDER BY b.create_time DESC";
//                Map<String, Object> mapCount = jdbcTemplate.queryForMap(sqlCount);
//                int count = 0;
//                Object objCount = mapCount.get("count");
//                if (objCount != null) {
//                    count = Integer.parseInt(objCount.toString());
//                }
//                int pageSize = 10;
//                String sql = "SELECT a.article_type_id,a.iamge_icon,a.article_type_name,b.article_id,b.article_title ,b.article_keyword ,b.create_time,b.content_excerpt FROM " +
//                        " zz_wechat.article_type a,zz_wechat.article b WHERE a.parentid !='0' AND a.article_type_id=b.article_type_id  " +
//                        " AND b.article_type_id='" +
//                        Integer.parseInt(article_type_id) +
//                        "' AND b.article_id NOT in(SELECT article_id from zz_wechat.user_article WHERE user_id ='" +
//                        user_id +
//                        "' AND type_id='1') " +
//                        "ORDER BY b.create_time DESC LIMIT " +
//                        page * pageSize + 1 +
//                        "," +
//                        pageSize;
//
//                Map<String, Object> mapresult = new HashMap<>();
//                List<Map<String, Object>> mapList = jdbcTemplate.queryForList(sql);
//                int num = count - (page + 1) * pageSize - 1;
//                if (num < 0) {
//                    num = 0;
//                }*/

                String threeDay = DateUtil.getbeforeCurrentDateString(3);
                String sqlCount = "SELECT count(*) as count FROM " +
                        " zz_wechat.article_type a,zz_wechat.article b WHERE b.del_type !=1 and a.del_type !=1 and a.parentid !='0' AND  a.parentid !='-1' AND a.article_type_id=b.article_type_id \n" +
                        " AND a.article_type_id='" +
                        Integer.parseInt(article_type_id) +
                        "' AND b.update_time<date_format('" +
                        threeDay +
                        "','%Y-%m-%d %H:%i:%s') and b.state= '"+state+
                        "' AND b.article_id NOT in(SELECT article_id from zz_wechat.user_article WHERE user_id ='" +
                        user_id +
                        "' AND type_id='1' ) " +
                        "ORDER BY b.create_time DESC";
                Map<String, Object> mapCount = jdbcTemplate.queryForMap(sqlCount);
                int count = 0;
                Object objCount = mapCount.get("count");
                if (objCount != null) {
                    count = Integer.parseInt(objCount.toString());
                }
                int pageSize = 10;
                String sql = "SELECT a.article_type_id,a.iamge_icon,a.article_type_name,b.article_id,b.article_title ,b.article_keyword ,b.create_time,b.content_excerpt FROM " +
                        " zz_wechat.article_type a,zz_wechat.article b WHERE b.del_type !=1 and a.del_type !=1 and a.parentid !='0' AND a.parentid !='-1' AND a.article_type_id=b.article_type_id  " +
                        " AND b.article_type_id='" +
                        Integer.parseInt(article_type_id) +
                        "' and b.state='"+state+
                        "' AND b.update_time<date_format('" +
                        threeDay +
                        "','%Y-%m-%d %H:%i:%s') " +
                        "AND b.article_id NOT in(SELECT article_id from zz_wechat.user_article WHERE user_id ='" +
                        user_id +
                        "' AND type_id='1') " +
                        "ORDER BY b.update_time DESC LIMIT " +
                        (page * pageSize + 1) +
                        "," +
                        pageSize;

//                Map<String, Object> mapresult = new HashMap<>();
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

            } else {

                if (time == null || "".equals(time)) {
//                    Map<String, Object> mapresult = new HashMap<>();
                    mapresult.put("count", 0);
                    mapresult.put("article", new ArrayList<>());
                    Map<String, Object> map = new HashMap<>();
                    map.put("code", 0);
                    map.put("message", "查询成功");
                    map.put("result", mapresult);
                    return map;

                }
                String startTime = "";
                String endTime = "";
                if (type == 1) {
                    String sql = "select  update_time from zz_wechat.article where article_id='" + article_id + "'";
                    Map<String, Object> timeMap = jdbcTemplate.queryForMap(sql);
                    Object update_time = timeMap.get("update_time");
                    if (update_time != null) {
                        startTime = update_time.toString().substring(0, 13) + ":00:00";
                        endTime = update_time.toString().substring(0, 13) + ":59:59";
                    }

                } else if (type == 2 || type == 3) {
//                    String day = time.substring(0, 1);
                 /*   String day = 2 + "";
                    if (time.endsWith("小时前更新")) {
                        day = "1";
                    }
                    String s = DateUtil.getbeforeDayCurrentDateString(Integer.parseInt(day));
                    startTime = s + " 00:00:00";
                    endTime = s + " 23:59:59";*/



                    String sql = "select  update_time from zz_wechat.article where article_id='" + article_id + "'";
                    Map<String, Object> timeMap = jdbcTemplate.queryForMap(sql);
                    Object update_time = timeMap.get("update_time");
                    if (update_time != null) {
                        startTime = update_time.toString().substring(0, 10) + " 00:00:00";
                        endTime = update_time.toString().substring(0, 10) + " 23:59:59";
                    }
                }

                String sql = "SELECT a.article_type_id,a.iamge_icon,a.article_type_name,b.article_id,b.article_title ,b.article_keyword ,b.create_time,b.content_excerpt FROM " +
                        " zz_wechat.article_type a,zz_wechat.article b WHERE b.del_type !=1 and a.del_type !=1 and a.parentid !='0' AND a.parentid !='-1' AND a.article_type_id=b.article_type_id  " +
                        " AND b.article_type_id='" +
                        Integer.parseInt(article_type_id) +
                        "' and b.state='"+state+
                        "' AND b.update_time<date_format('" +
                        endTime +
                        "','%Y-%m-%d %H:%i:%s') " +
                        "AND b.update_time>date_format('" +
                        startTime +
                        "','%Y-%m-%d %H:%i:%s')  " +
                        "AND b.article_id NOT in(SELECT article_id from zz_wechat.user_article WHERE user_id ='" +
                        user_id +
                        "' AND type_id='1') AND b.article_id !='" +
                        article_id +
                        "' " +
                        "ORDER BY b.update_time DESC";

//                Map<String, Object> mapresult = new HashMap<>();
                List<Map<String, Object>> mapList = jdbcTemplate.queryForList(sql);
                mapresult.put("count", 0);
                mapresult.put("article", mapList);
                Map<String, Object> map = new HashMap<>();
                map.put("code", 0);
                map.put("message", "查询成功");
                map.put("result", mapresult);
                return map;
            }

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

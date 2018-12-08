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
        List<Map<String, Object>> mapList = jdbcTemplate.queryForList(selectSql, new Object[]{wechat_id});
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
            int user_sex = userData.get("user_sex") == null ? 2 : (int) userData.get("tel_phone");
            String sysTime = DateUtil.getCurrentTimeString();
            Object icon_path = userData.get("icon_path") == null ? "" : userData.get("icon_path").toString();
            String user_id = UuidUtils.getUUid();

            String inserSql = "insert into zz_wechat.sys_user (user_id,tel_phone,nick_name,true_name,user_sex,create_time,icon_path) " +
                    "values(?,?,?,?,?,date_format(?,'%Y-%d-%m %H:%i:%s'),?)";
            int update = jdbcTemplate.update(inserSql, new Object[]{
                    user_id,
                    tel_phone,
                    nick_name,
                    true_name,
                    user_sex,
                    sysTime,
                    icon_path
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

        if (wechatid == null) {
            return getErrorMap();
        }
        List list = new ArrayList();
        //默认每页显示10页
        int pageSize = 10;
        //用户关注类型的文章
        String attentionSql = "SELECT c.article_type_name,c.article_type_id,c.article_type_keyword,c.create_time,c.iamge_icon,c.iamge_back,c. parentid" +
                " FROM zz_wechat.sys_user a,zz_wechat.user_articletype b,zz_wechat.article_type c" +
                " where a.user_id=b.user_id AND b.article_type_id=c.article_type_id AND a.wechat_id=?";
        List<Map<String, Object>> attentionList = jdbcTemplate.queryForList(attentionSql, new Object[]{
                wechatid
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
        String user_id = userMap.get("user_id").toString();
        //有关注的文章且 查询的都是关注的文章
        if (count > 0 && pageSize * page <= count || count < 10) {
            String isLoveSql = "SELECT c.article_type_id,c.article_id,c.article_keyword,c.create_time,c.content_excerpt,c.article_title,d.iamge_icon,d.article_type_name " +
                    "from zz_wechat.sys_user a,zz_wechat.user_articletype b,zz_wechat.article c,zz_wechat.article_type d " +
                    "WHERE a.user_id=b.user_id AND b.article_type_id=d.article_type_id AND c.article_type_id=d.article_type_id AND c.article_id NOT IN (SELECT article_id FROM zz_wechat.user_article WHERE user_id='" + user_id +
                    "' AND type_id='1'" +
                    ") AND a.wechat_id=? GROUP BY d.article_type_id ORDER BY c.create_time LIMIT ?,?";
            List<Map<String, Object>> mapList = jdbcTemplate.queryForList(isLoveSql, new Object[]{
                    wechatid,
                    count * pageSize,
                    pageSize

            });
            list.addAll(mapList);

        }
        //查询的不是关注的文章
        if (count < 10 || pageSize * page > count) {
            count = (pageSize * page - count) / pageSize;
            if (count < 0) {
                count = 0;
            }
//            String isLoveSql = "SELECT c.article_type_id,c.article_id,c.article_type_id,c.article_type_id,c.article_keyword,c.create_time,c.content_excerpt,d.iamge_icon,d.article_type_name " +
//                    "from zz_wechat.sys_user a,zz_wechat.user_articletype b,zz_wechat.article c,zz_wechat.article_type d \n" +
//                    "WHERE a.user_id=b.user_id AND b.article_type_id!= d.article_type_id AND c.article_type_id=d.article_type_id AND a.wechat_id=? GROUP BY d.article_type_id ORDER BY c.create_time LIMIT ?,?";


            String isNoLoveSql = "SELECT c.article_id,c.article_type_id,c.article_keyword,c.create_time,c.content_excerpt,c.article_title,d.iamge_icon,d.article_type_name " +
                    "from zz_wechat.sys_user a,zz_wechat.user_articletype b,zz_wechat.article c,zz_wechat.article_type d " +
                    "WHERE a.user_id=b.user_id AND b.article_type_id!=d.article_type_id AND c.article_type_id=d.article_type_id AND c.article_id NOT IN (SELECT article_id FROM zz_wechat.user_article WHERE user_id='" + user_id +
                    "' AND type_id='1'" +
                    ") AND a.wechat_id=? GROUP BY d.article_type_id ORDER BY c.create_time DESC LIMIT ?,?";

            List<Map<String, Object>> mapList = jdbcTemplate.queryForList(isNoLoveSql, new Object[]{
                    wechatid,
                    count * pageSize,
                    pageSize

            });
            list.addAll(mapList);

        }

        HashMap<String, Object> result = new HashMap<>();
        result.put("attention",attentionList);
        result.put("article",list);

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
        if (wechatid.isEmpty() || attentions.isEmpty()) {
            return getErrorMap();
        }
        try {
            String[] attentionList = attentions.split(",");
            String selectSql = "select user_id from zz_wechat.sys_user where wechat_id='" + wechatid + "'";
            Map<String, Object> userMap = jdbcTemplate.queryForMap(selectSql);
            String user_id = userMap.get("user_id").toString();

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

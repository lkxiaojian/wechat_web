package com.kingweather.we_chat.controller.algorithm;

import com.kingweather.common.controller.BaseController;
import com.kingweather.fylat_service.controller.other.DataManageController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class algorithmController extends BaseController {
    Logger log = LoggerFactory.getLogger(DataManageController.class);

    @Resource
    private JdbcTemplate jdbcTemplate;


    @RequestMapping(value = "/reptile/getData/rest", method = RequestMethod.GET)
    public Map<String, Object> getData(int rows, int page, String type) {
        String countSql = "select count(*) as count from zz_wechat.article1 ";
        String sql = "select details_txt,article_title,update_time from zz_wechat.article1 ";
        if (type != null || "".equals(type)) {
            String messageSql = "";
            if ("1".equals(type)) {
                messageSql = "where article_title like '%3D打印%' or article_title like '%增材制造%' or article_title like '%3D 设计%' or article_title like '%3D 建模%'";

            } else if ("3".equals(type)) {
                messageSql = "where article_title like '%传感器%' or article_title like '%MEMS 传感%'";
            } else if ("2".equals(type)) {
                messageSql = "where article_title like '%机器人%' or article_title like '%SLAM%'";
            } else if ("16".equals(type)) {
                messageSql = "where article_title like '%智能制造%' or article_title like '%工业4.0%'";
            }
            countSql = countSql + messageSql;
            sql = sql + messageSql;
        }
        sql = sql + " ORDER BY update_time ASC LIMIT " + (page - 1) * rows + "," + rows;
        Map<String, Object> map = new HashMap<>();
        Map<String, Object> resultMap = new HashMap<>();
        Map<String, Object> conutMap = jdbcTemplate.queryForMap(countSql);
        List<Map<String, Object>> maps = jdbcTemplate.queryForList(sql);
        List<String> resultList = new ArrayList<>();
        for (int i = 0; i < maps.size(); i++) {
            Object details_div = maps.get(i).get("details_txt");
            Object article_title = maps.get(i).get("article_title");

            byte[] details_divbytes = (byte[]) details_div;
            if (details_div != null && article_title != null) {
                try {
                    String s = new String(details_divbytes, "UTF-8").replaceAll(" ", "").replaceAll("\\s", "").replaceAll(",", "，").replaceAll("!", "！").replaceAll("\\.", "。").replaceAll("\\[", "】")
                            .replaceAll("]", "】").replaceAll("\\(", "（").replaceAll("\\)", "）").replaceAll("\\|", "|")
                            .replaceAll("-", "—");
                    String s1 = article_title.toString().replaceAll(",", "，").replaceAll("!", "！").replaceAll("\\.", "。").replaceAll("\\[", "】")
                            .replaceAll("]", "】").replaceAll("\\(", "（").replaceAll("\\)", "）").replaceAll("\\|", "|")
                            .replaceAll("-", "—").replaceAll(" ", "").replaceAll("\\s", "");
                    s = s.replaceAll(s1, "");
                    resultList.add(s);
                    maps.get(i).put("details_txt", s);
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
            }
        }
        resultMap.put("count", Integer.parseInt(conutMap.get("count").toString()) - page * rows);
        resultMap.put("txt", maps);
        map.put("code", 0);
        map.put("result", resultMap);
        return map;
    }


    @RequestMapping(value = "/reptile/getManualData/rest", method = RequestMethod.GET)
    public Map<String, Object> getManualData(int rows, int page, int type) {
        String Sql = "select a.details_txt,b.parentid,a.article_type_id,a.article_title,a.update_time from zz_wechat.article a, zz_wechat.article_type b where a.article_type_id=b.article_type_id AND b.article_type_id !='0'" +
                " AND  a.article_type_id='" + type + "'";
        Sql = Sql + " ORDER BY update_time ASC LIMIT " + (page - 1) * rows + "," + rows;

        String countSql = "select count(*) as count from zz_wechat.article a, zz_wechat.article_type b where a.article_type_id=b.article_type_id AND b.article_type_id !='0'" +
                " AND  a.article_type_id='" + type + "'";
        Map<String, Object> conutMap = jdbcTemplate.queryForMap(countSql);
        Map<String, Object> map = new HashMap<>();
        Map<String, Object> resultMap = new HashMap<>();
        List<Map<String, Object>> maps = jdbcTemplate.queryForList(Sql);
        for (int i = 0; i < maps.size(); i++) {
            Object details_div = maps.get(i).get("details_txt");
            Object article_title = maps.get(i).get("article_title");
            byte[] details_divbytes = (byte[]) details_div;
            if (details_div != null && article_title != null) {
                try {
                    String s = new String(details_divbytes, "UTF-8").replaceAll(" ", "").replaceAll("\\s", "").replaceAll(",", "，").replaceAll("!", "！").replaceAll("\\.", "。").replaceAll("\\[", "】")
                            .replaceAll("]", "】").replaceAll("\\(", "（").replaceAll("\\)", "）").replaceAll("\\|", "|")
                            .replaceAll("-", "—");
                    String s1 = article_title.toString().replaceAll(",", "，").replaceAll("!", "！").replaceAll("\\.", "。").replaceAll("\\[", "】")
                            .replaceAll("]", "】").replaceAll("\\(", "（").replaceAll("\\)", "）").replaceAll("\\|", "|")
                            .replaceAll("-", "—").replaceAll(" ", "").replaceAll("\\s", "");
                    s = s.replaceAll(s1, "");
                    maps.get(i).put("details_txt", s);
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
            }
        }
        int count = Integer.parseInt(conutMap.get("count").toString()) - page * rows;
        if (count < 0) {
            count = 0;
        }
        resultMap.put("count", count);
        resultMap.put("txt", maps);
        map.put("code", 0);
        map.put("result", resultMap);
        return map;
    }


    @RequestMapping(value = "/reptile/getDominData/rest", method = RequestMethod.GET)
    public Map<String, Object> getDominData() {
        String sql = "select article_type_id,article_type_name,article_type_keyword from article_type where del_type !=1 AND parentid='100'";
        Map<String, Object> map = new HashMap<>();
        List<Map<String, Object>> maps = jdbcTemplate.queryForList(sql);
        map.put("code", 0);
        map.put("result", maps);
        return map;
    }


}

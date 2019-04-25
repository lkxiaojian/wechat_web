package com.kingweather.we_chat.task;

import com.alibaba.fastjson.JSON;

import com.kingweather.common.util.DateUtil;
import com.kingweather.we_chat.bean.AllArticleTmp;
import com.kingweather.we_chat.constants.HttpUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;


@Component
@EnableScheduling
public class ArithmeticArticleTask {

    private static final Logger log = LoggerFactory.getLogger(ArithmeticArticleTask.class);

    @Resource
    private JdbcTemplate jdbcTemplate;

    @Value("${urlTypePath}")
    private String articlePath;

//    @Scheduled(cron = "0/30 * * * * ?")
    @Scheduled(cron = "0 10 1 * * ?")
    public void selectAllType() {
        log.info("获取全部类型");
        String s = HttpUtils.doPost(articlePath + "type_info", "");
        AllArticleTmp allArticleTmp = JSON.parseObject(s, AllArticleTmp.class);
        String currentTime = DateUtil.getCurrentTimeString();
        if (allArticleTmp != null && allArticleTmp.getResult().size() > 0) {
            List<AllArticleTmp.ResultBean> result = allArticleTmp.getResult();
            for (AllArticleTmp.ResultBean bean : result) {


                String type_id = bean.getArticle_type_id();
                List<String> parent_type_id = bean.getParent_type_id();
                //父级id
                String parent_id = "";
                //领域id
                String domain_id="";
                if (parent_type_id.size() == 1) {
                    parent_id = parent_type_id.get(0);
                    domain_id=type_id;
                }else if(parent_type_id.size()>1) {
                    parent_id = parent_type_id.get(parent_type_id.size()-1);
                    domain_id=parent_type_id.get(1);
                }

                String typeName = "";
                if (bean.getArticle_type_keyword() != null) {
                    for (int i = 0; i < bean.getArticle_type_keyword().size(); i++) {
                        typeName = typeName + bean.getArticle_type_keyword().get(i).toString() + ",";
                    }
                }
                if (typeName.length() > 0) {
                    typeName = typeName.substring(0, typeName.length() - 1);
                }

                //查询关联表中是否存在
                Map<String, Object> parentIdMap = null;
                try {
                    String sql = "select parent_id,type,keep_type_id from zz_wechat.change_article_type where article_type_id=? ORDER BY update_time DESC LIMIT 0,1";
                    parentIdMap = jdbcTemplate.queryForMap(sql, new Object[]{
                            type_id
                    });
                } catch (Exception e) {

                }
                if (parentIdMap != null && parentIdMap.get("parent_id") != null) {
                    if (Integer.parseInt(parentIdMap.get("type").toString()) == 0) {

                        type_id = parentIdMap.get("keep_type_id").toString();
                        continue;
                    }
                    parent_id = parentIdMap.get("parent_id").toString();
                }


                //根据typeid查询是否存在id
                String countTypeSql = "select count(*) as  count from zz_wechat.article_type_tmp where article_type_id=?";
                Map<String, Object> map = null;
                try {
                    map = jdbcTemplate.queryForMap(countTypeSql, new Object[]{
                            type_id
                    });
                } catch (Exception e) {

                }


                //插入新的类型
                if (map != null && map.get("count") != null && Integer.parseInt(map.get("count").toString()) == 0
                        && !type_id.isEmpty()) {


                    String insertTypeSql = "insert into zz_wechat.article_type_tmp (article_type_id,article_type_name,article_type_keyword,create_time,parentid,del_type,status,article_type_name_old,article_type_keyword_old,type_state,issue,parentid_tmp,domain_id) values " +
                            "(?,?,?,date_format(?,'%Y-%m-%d %H:%i:%s'),?,?,?,?,?,?,?,?,?)";
                    int update = jdbcTemplate.update(insertTypeSql, new Object[]{
                            type_id,
                            typeName,
                            typeName,
                            currentTime,
                            parent_id,
                            0,
                            0,
                            typeName,
                            typeName,
                            bean.getIs_paper()
                            ,
                            0,
                            parent_id,
                            domain_id
                    });
                    log.info("获取全部类型" + bean.toString());
                }


            }
        }
        log.info("获取全部类型完毕！！！！");


    }


    //    @Scheduled(cron ="0 0 21 ? * * ")
    public void test() {
        String sql = "select pdf_path,article_id from academic_paper";
        List<Map<String, Object>> maps = jdbcTemplate.queryForList(sql);
        for (Map<String, Object> map : maps) {


            if (map.get("pdf_path") != null) {
                String pdf_path = map.get("pdf_path").toString().replaceAll("/resourcespdf", "/resources/pdf");
                String updateSql = "update academic_paper set pdf_path=? where article_id=?";
                int article_id = jdbcTemplate.update(updateSql, new Object[]{
                        pdf_path,
                        map.get("article_id")
                });

                log.info("更新字段--->" + article_id + "---" + pdf_path);

            }

        }

        log.info("更新完成");


    }


}

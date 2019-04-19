package com.kingweather.we_chat.task;

import com.alibaba.fastjson.JSON;
import com.kingweather.we_chat.bean.ArticleTmp;
import com.kingweather.we_chat.constants.HttpUtils;
import com.kingweather.we_chat.constants.UuidUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AbstractArticleTask {
    private static final Logger log = LoggerFactory.getLogger(ArithmeticArticleTask.class);

    @Resource
    private JdbcTemplate jdbcTemplate;
    @Value("${urlTypePath}")
    private String articlePath;


    //    @Scheduled(cron = "0/30 * * * * ?")
//    @Scheduled(cron = "0 15 6 ? * MON")
    public void AbstractArticle() {
        String sql="select * from zz_wechat.abstract";


        List<Map<String, Object>> maps = jdbcTemplate.queryForList(sql);
        for(Map<String, Object> map:maps){
            try {
                Object oState = map.get("state");

                int state=Integer.parseInt(oState.toString());
                //文章
                if(state==0){
                    String articleSql="select article_id,article_title,details_txt from zz_wechat.article where article_type_id=? and state=?";
                    List<Map<String, Object>> articleList = jdbcTemplate.queryForList(articleSql, new Object[]{
                            map.get("article_type_id"),
                            state
                    });

                    String articleSqlTmp="select article_id,article_title,details_txt from zz_wechat.article_tmp where article_type_id=?";
                    List<Map<String, Object>> articleListTmp = jdbcTemplate.queryForList(articleSqlTmp, new Object[]{
                            map.get("article_type_id")
                    });
                    articleList.addAll(articleListTmp);
                    Map typeMap = null;
                    List typeMaps = new ArrayList();
                    for (int i = 0; i < articleList.size(); i++) {
                        typeMap = new HashMap();
                        byte[] details_divbytes = (byte[]) ((Map) articleList.get(i)).get("details_txt");

                        if (details_divbytes != null) {

                            typeMap.put("content", UuidUtils.guessEncoding(details_divbytes));
                            typeMap.put("article_id", ((Map) maps.get(i)).get("article_id"));
                            typeMap.put("title", ((Map) maps.get(i)).get("article_title"));
                            typeMaps.add(typeMap);
                            String type = JSON.toJSONString(typeMaps);
                            if (type.length() > 2) {
                                type = "{ \"articles\": [" + type.substring(1, type.length() - 1) + "    ]}";
                            }
                            //请求文章类型id算法
                            String sendTypePost = HttpUtils.doPost(this.articlePath + "wechat", type);
                            if (sendTypePost.isEmpty()) {
                                System.out.print("文章抽取-####-->5\n");
                                continue;
                            }
                            //解析算法返回文章的类型
                            ArticleTmp article_tmp = (ArticleTmp) JSON.parseObject(sendTypePost, ArticleTmp.class);
                            if(article_tmp!=null&&article_tmp.getResult().size()>0){
                                List<String> typeList = article_tmp.getResult().get(0).getType_id();
                                String type_id = "";


                                if (typeList != null) {
                                    if (typeList.size() == 1) {
                                        type_id = typeList.get(0);
                                    } else {
                                        type_id = typeList.get(typeList.size() - 1);

                                    }

                                }

                               String updataSql="update zz_wechat.article set article_type_id=? where article_id=?";
                                jdbcTemplate.update(updataSql,new Object[]{
                                        type_id,
                                        maps.get(i).get("article_id")


                                });
                                String updataSqlTmp="update zz_wechat.article_tmp set article_type_id=? where article_id=?";
                                jdbcTemplate.update(updataSqlTmp,new Object[]{
                                        type_id,
                                        maps.get(i).get("article_id")


                                });


                            }


                        }

                    }



                }else {
                    //论文

                    String articleSql="select article_id,article_title,article_title_e,content_excerpt,content_excerpt_e from zz_wechat.article where article_type_id=? and state=?";
                    List<Map<String, Object>> articleList = jdbcTemplate.queryForList(articleSql, new Object[]{
                            map.get("article_type_id"),
                            state
                    });

                    String articleSqlTmp="select article_id,article_title,article_title_e,content_excerpt,content_excerpt_e from zz_wechat.academic_paper where article_type_id=?";
                    List<Map<String, Object>> articleListTmp = jdbcTemplate.queryForList(articleSqlTmp, new Object[]{
                            map.get("article_type_id")
                    });
                    articleList.addAll(articleListTmp);
                    List paperMaps = new ArrayList();
                    Map paperMap = null;
                    for (int i = 0; i < articleList.size(); i++) {
                        Map<String, Object> dataMap = articleList.get(i);
                        paperMaps = new ArrayList();
                        paperMap = new HashMap();
                        int is_english = 0;
                        Object article_title = dataMap.get("article_title");
                        Object content = dataMap.get("content_excerpt");
                        if (article_title == null || article_title.toString().length() == 0) {
                            article_title = dataMap.get("article_title_e");
                            content = dataMap.get("content_excerpt_e");
                            is_english=1;
                        }
                        if (article_title == null || article_title.toString().length() == 0) {
                            continue;
                        }
                        paperMap.put("article_id", dataMap.get("article_id"));
                        paperMap.put("title", article_title);
                        paperMap.put("content", content);
                        paperMaps.add(paperMap);

                        String type = JSON.toJSONString(paperMaps);
                        if (type.length() > 2) {
                            type = "{ \"articles\": [" + type.substring(1, type.length() - 1) + "    ], \"is_english\":" +
                                    is_english+
                                    "}";
                        }

                        String sendTypePost = HttpUtils.doPost(this.articlePath + "paper", type);
                        if (sendTypePost.isEmpty()) {
                            continue;
                        }
                        //解析算法返回文章的类型
                        ArticleTmp article_tmp = (ArticleTmp) JSON.parseObject(sendTypePost, ArticleTmp.class);
                        if(article_tmp!=null&&article_tmp.getResult().size()>0){
                            List<String> typeList = article_tmp.getResult().get(0).getType_id();
                            String type_id = "";
                            if (typeList != null) {
                                if (typeList.size() == 1) {
                                    type_id = typeList.get(0);
                                } else {
                                    type_id = typeList.get(typeList.size() - 1);

                                }

                            }

                            String updataSql="update zz_wechat.article set article_type_id=? where article_id=?";
                            jdbcTemplate.update(updataSql,new Object[]{
                                    type_id,
                                    maps.get(i).get("article_id")


                            });
                            String updataSqlTmp="update zz_wechat.academic_paper set article_type_id=? where article_id=?";
                            jdbcTemplate.update(updataSqlTmp,new Object[]{
                                    type_id,
                                    maps.get(i).get("article_id")


                            });


                        }

                    }






                }







            }catch (Exception e){
                continue;
            }



        }


    }
}

package com.kingweather.we_chat.service.iml;

import com.alibaba.fastjson.JSON;
import com.fasterxml.jackson.core.JsonParser;
import com.kingweather.we_chat.bean.ArticleTypeSouce;
import com.kingweather.we_chat.constants.HttpUtils;
import com.kingweather.we_chat.dao.ReleaseManagementDao;
import com.kingweather.we_chat.service.ReleaseManagementService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReleaseManagementIml implements ReleaseManagementService {
    @Resource
    private ReleaseManagementDao releaseManagementDao;
    @Value("${urlTypePath}")
    private String urlTypePath;
    private int value=0;


    @Override
    public List getTypeMenuTree(String type, String delType) {
        List<Map> list=new ArrayList<>();
        if("1".equals(type)){
            //查询精选类型
            list = releaseManagementDao.getTypeMenuTree(type, delType);

            for (Map s : list) {
                List childrenList = getMenuTreeChildren(s.get("domain_id").toString(), type, delType,0);
                value=value+1;
                if (childrenList != null) {
                    s.put("item", childrenList);
                }
            }

        }else {
            String parentId = "-1";
            if ("2".equals(type)) {
                parentId = "-2";
            }
             list = releaseManagementDao.getTypeMenuTree(parentId, type, delType,-1);
            for (Map s : list) {
                List childrenList = getMenuTreeChildren(s.get("id").toString(), type, delType,-1);
                if (childrenList != null) {
                    s.put("item", childrenList);
                }
            }
        }

        return list;


    }

    @Override
    public Map getTypeMessage(String article_type_id, String type) {
        Map map = releaseManagementDao.getTypeMessage(article_type_id, type);
        return map;
    }

    @Override
    public int updateTypeMessage(String name, String keyword, String artcicle_type_id, String pathICon, String pathBack, String parentid, String type) {

        int i = releaseManagementDao.updateTypeMessage(name, keyword, artcicle_type_id, pathICon, pathBack, parentid, type);


        return i;
    }

    @Override
    public int updateTypeParentId(String article_type_id, String parentid) {
        int i = releaseManagementDao.updateTypeParentId(article_type_id, parentid);

        return i;
    }

    @Override
    public Map selectAricleTmpList(HttpServletRequest req) {
        return releaseManagementDao.selectAricleTmpList(req);
    }

    @Override
    public Map<String, Object> delAricleTmpList(String articleIdList) {
        return releaseManagementDao.delAricleTmpList(articleIdList);
    }

    @Override
    public Map<String, Object> getAricleTmpMessageById(String articleId, String type) {
        return releaseManagementDao.getAricleTmpMessageById(articleId, type);
    }

    @Override
    public Map<String, Object> getAricleTmpCheckById(String articleId, String type) {
        return releaseManagementDao.getAricleTmpCheckById(articleId, type);
    }

    @Override
    public Map<String, Object> updateAricleTmpMesage(Map<String, Object> data) {
        return releaseManagementDao.updateAricleTmpMesage(data);
    }


    @Override
    public Map<String, Object> pushAricleTmpById(String articleIds, String type) {
        return releaseManagementDao.pushAricleTmpById(articleIds, type);
    }

    @Override
    public int mergeTypeById(Map<String, Object> data) {

        return releaseManagementDao.mergeTypeById(data);
    }

    @Override
    public Map<String, Object> getPostingList(Map<String, Object> data) {
        return releaseManagementDao.getPostingList(data);
    }

    @Override
    public Map<String, Object> getPostingMessage(String posting_id) {
        return releaseManagementDao.getPostingMessage(posting_id);
    }

    @Override
    public int updatePostingImage(String posting_id, String pathICon) {
        return releaseManagementDao.updatePostingImage(posting_id, pathICon);
    }

    @Override
    public Map<String, Object> delArticleTypeById(String article_type_id, String type) {
        return releaseManagementDao.delArticleTypeById(article_type_id, type);
    }

    @Override
    public Map combinedScore(String articleTypeId,String type) {
        try {
            Map<String, Object> jsonMap = new HashMap<>();
//            //文章
//            List<Map<String, Object>> articleList = releaseManagementDao.combinedScore(0);
//            Map artileMap = getArtileMap(articleList);
//            jsonMap.put("cluster_A", artileMap);
//            //论文
//            List<Map<String, Object>> paperList = releaseManagementDao.combinedScore(1);
//            Map artileMap1 = getArtileMap(paperList);
//            jsonMap.put("cluster_B", artileMap1);

            //文章
//            List<Map<String, Object>> articleList = releaseManagementDao.combinedScoreById(articleTypeId);
//            Map artileMap = getArtileMap(articleList);
//            jsonMap.put("cluster_A", artileMap);
//            //论文
//            List<Map<String, Object>> paperList = releaseManagementDao.combinedScoreById(paperTypeId);
//            Map artileMap1 = getArtileMap(paperList);
//            jsonMap.put("cluster_B", artileMap1);
//
//            jsonMap.put("Topn", 3);


            List<Map<String, Object>> articleList= releaseManagementDao.getArticleOldNameById(articleTypeId);
             Map artileMap = getArtileMap(articleList);
             jsonMap.put("cluster_A", artileMap);
             int state=0;

             if(articleList!=null||articleList.size()>0){
                 Object type_state = articleList.get(0).get("type_state");
                 if(type_state!=null&&!"".equals(type_state.toString())&&0==Integer.parseInt(type_state.toString())){
                     state=1;
                 }
             }

             List<Map<String, Object>> paperList = releaseManagementDao.combinedScoreByState(state);
            Map artileMap1 = getArtileMap(paperList);
            jsonMap.put("cluster_B", artileMap1);

            jsonMap.put("Topn", 3);


            String json = JSON.toJSONString(jsonMap);
            String sendAbstractsPost = HttpUtils.doPost(urlTypePath + "similarity", json);

            ArticleTypeSouce articleTypeSouce = JSON.parseObject(sendAbstractsPost, ArticleTypeSouce.class);
            List<ArticleTypeSouce.ResultBean> result = articleTypeSouce.getResult();
            if (result != null) {
                for (int i = 0; i < result.size(); i++) {
                    String id1Name = releaseManagementDao.getArticleNameById(result.get(i).getId1());
                    String id2Name = releaseManagementDao.getArticleNameById(result.get(i).getId2());
                    result.get(i).setId1Name(id1Name);
                    result.get(i).setId2Name(id2Name);

                }

            }
            Map<String, Object> map = new HashMap<>();
            map.put("code", 0);
            map.put("result", result);
            return map;

        } catch (Exception e) {
            Map<String, Object> map = new HashMap<>();
            map.put("code", 0);
            map.put("message", "算法计算错误！");
            return map;

        }


    }

    @Override
    public Map getAllIssueArticleType(String type,String message) {
        return releaseManagementDao.getAllIssueArticleType(type,message);
    }

    @Override
    public Map seachArticleType(String type, String message) {
        return releaseManagementDao.seachArticleType(type, message);
    }

    @Override
    public Map pushArticleType(String typeId, String type) {
        return releaseManagementDao.pushArticleType(typeId, type);
    }


    @Override
    public Map delAllRecycle(String type) {
        return releaseManagementDao.delAllRecycle(type);
    }

    @Override
    public Map getDelArticleType(Map<String, Object> data) {
        return releaseManagementDao.getDelArticleType(data);
    }


    private List getMenuTreeChildren(String parentId, String type, String delType,int value) {

        List<Map> list = releaseManagementDao.getTypeMenuTree(parentId, type, delType,value);
        value=value+1;
        for (Map s : list) {
            List childrenList = new ArrayList();
            if("1".equals(type)){
                if(s.get("domain_id")!=null&&value==1){
                    childrenList = getMenuTreeChildren(s.get("domain_id").toString(), type, delType,-2);
                }

            }else {
                 childrenList = getMenuTreeChildren(s.get("id").toString(), type, delType,-2);
            }

            if (childrenList != null) {
                s.put("item", childrenList);
            }
        }
        return list;
    }


    private Map getArtileMap(List<Map<String, Object>> list) {
        Map<String, Object> map = new HashMap<>();
        for (int i = 0; i < list.size(); i++) {
            Map<String, Object> mapTmp = new HashMap<>();
            Map<String, Object> resultMap = list.get(i);
            if (resultMap.get("article_type_name_old") != null) {
                String[] article_type_name_olds = resultMap.get("article_type_name_old").toString().split(",");
                mapTmp.put(resultMap.get("article_type_id").toString(), article_type_name_olds);
                map.putAll(mapTmp);
            }

        }

        return map;
    }

}

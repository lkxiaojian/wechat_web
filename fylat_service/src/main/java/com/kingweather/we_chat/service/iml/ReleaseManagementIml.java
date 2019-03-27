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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReleaseManagementIml implements ReleaseManagementService {
    @Resource
    private ReleaseManagementDao releaseManagementDao;
    @Value("${urlTypePath}")
    private String urlTypePath;


    @Override
    public List getTypeMenuTree(String type) {
        String parentId="-1";
        if("2".equals(type)){
            parentId="-2";
        }

        List<Map> list = releaseManagementDao.getTypeMenuTree(parentId, type);
        for (Map s : list) {
            List childrenList = getMenuTreeChildren(s.get("id").toString(), type);
            if (childrenList != null) {
                s.put("item", childrenList);
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
    public Map<String, Object> delArticleTypeById(String article_type_id) {
        return releaseManagementDao.delArticleTypeById(article_type_id);
    }

    @Override
    public Map combinedScore() {
        Map<String, Object> jsonMap = new HashMap<>();
        //文章
        List<Map<String, Object>> articleList = releaseManagementDao.combinedScore(0);
        Map artileMap = getArtileMap(articleList);
        jsonMap.put("cluster_A", artileMap);
        //论文
        List<Map<String, Object>> paperList = releaseManagementDao.combinedScore(1);
        Map artileMap1 = getArtileMap(paperList);
        jsonMap.put("cluster_B", artileMap1);
        jsonMap.put("Topn", 3);

        String json = JSON.toJSONString(jsonMap);
        String sendAbstractsPost = HttpUtils.doPost(urlTypePath + "similarity", json);

        ArticleTypeSouce articleTypeSouce = JSON.parseObject(sendAbstractsPost, ArticleTypeSouce.class);
        List<ArticleTypeSouce.ResultBean> result = articleTypeSouce.getResult();
        if (result != null) {
            for(int i=0;i<result.size();i++){
                String id1Name=releaseManagementDao.getArticleNameById(result.get(i).getId1());
                String id2Name=releaseManagementDao.getArticleNameById(result.get(i).getId2());
                result.get(i).setId1Name(id1Name);
                result.get(i).setId2Name(id2Name);

            }

        }
        Map<String, Object> map = new HashMap<>();
        map.put("code",0);
        map.put("result",result);
        return map;
    }

    @Override
    public Map getAllIssueArticleType(String type) {
        return releaseManagementDao.getAllIssueArticleType(type);
    }

    @Override
    public Map seachArticleType(String type, String message) {
        return releaseManagementDao.seachArticleType(type, message);
    }

    @Override
    public Map pushArticleType(String typeId,String type) {
        return releaseManagementDao.pushArticleType(typeId, type);
    }


    private List getMenuTreeChildren(String parentId, String type) {

        List<Map> list = releaseManagementDao.getTypeMenuTree(parentId, type);
        for (Map s : list) {
            List childrenList = getMenuTreeChildren(s.get("id").toString(), type);
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

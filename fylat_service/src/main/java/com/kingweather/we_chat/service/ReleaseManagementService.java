package com.kingweather.we_chat.service;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

public interface ReleaseManagementService {
    List getTypeMenuTree(String type,String delType);

    Map getTypeMessage(String article_type_id,String type);

    int updateTypeMessage(String name, String keyword, String artcicle_type_id, String pathICon, String pathBack,String parentid, String type);

    int updateTypeParentId(String article_type_id, String parentid);

    Map selectAricleTmpList(HttpServletRequest req);

    Map<String,Object> delAricleTmpList(String articleIdList);

    Map<String,Object> getAricleTmpMessageById(String articleId,String type);

    Map<String,Object> getAricleTmpCheckById(String articleId, String type);

    Map<String,Object> updateAricleTmpMesage(Map<String, Object> data);

    Map<String,Object> pushAricleTmpById(String articleIds, String type);

    int mergeTypeById(Map<String, Object> data);

    Map<String,Object> getPostingList(Map<String, Object> data);

    Map<String,Object> getPostingMessage(String posting_id);

    int updatePostingImage(String posting_id, String pathICon);

    Map<String,Object> delArticleTypeById(String article_type_id,String type);

    Map  combinedScore(String articleTypeId,String paperTypeId);

    Map getAllIssueArticleType(String type,String message);

    Map seachArticleType(String type, String message);

    Map pushArticleType(String typeId,String type);



    Map delAllRecycle(String type);

    Map getDelArticleType(Map<String,Object> data);
}

package com.kingweather.we_chat.service;

import java.util.List;
import java.util.Map;

public interface ReleaseManagementService {
    List getTypeMenuTree();

    Map getTypeMessage(String article_type_id);

    int updateTypeMessage(String name, String keyword, String artcicle_type_id, String pathICon, String pathBack,String parentid);

    int updateTypeParentId(String article_type_id, String parentid);

    Map selectAricleTmpList(Map<String,Object> data);

    Map<String,Object> delAricleTmpList(String articleIdList);

    Map<String,Object> getAricleTmpMessageById(String articleId,String type);

    Map<String,Object> getAricleTmpCheckById(String articleId, String type);

    Map<String,Object> updateAricleTmpMesage(Map<String, Object> data);

    Map<String,Object> pushAricleTmpById(String articleIds, String type);

    int mergeTypeById(Map<String, Object> data);

    Map<String,Object> getPostingList(Map<String, Object> data);

    Map<String,Object> getPostingMessage(String posting_id);

    int updatePostingImage(String posting_id, String pathICon);

    Map<String,Object> delArticleTypeById(String article_type_id);
}

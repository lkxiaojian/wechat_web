package com.kingweather.we_chat.dao;

import org.omg.CORBA.Object;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

public interface ReleaseManagementDao {
    List<Map> getTypeMenuTree(String s,String type,String delType);

    Map getTypeMessage(String article_type_id,String type);

    int updateTypeMessage(String name, String keyword, String artcicle_type_id, String pathICon, String pathBack,String parentid, String type);

    int updateTypeParentId(String article_type_id, String parentid);

    Map<String,Object> selectAricleTmpList(HttpServletRequest req);

    Map<String,java.lang.Object> delAricleTmpList(String articleIdList);

    Map<String,java.lang.Object> getAricleTmpMessageById(String articleId,String type);

    Map<String,java.lang.Object> getAricleTmpCheckById(String articleId, String type);

    Map<String,java.lang.Object> updateAricleTmpMesage(Map<String, java.lang.Object> data);

    Map<String,java.lang.Object> pushAricleTmpById(String articleIds, String type);

    int mergeTypeById(Map<String, java.lang.Object> data);

    Map<String,java.lang.Object> getPostingList(Map<String, java.lang.Object> data);

    Map<String,java.lang.Object> getPostingMessage(String posting_id);

    int updatePostingImage(String posting_id, String pathICon);

    Map<String,java.lang.Object> delArticleTypeById(String article_type_id,String type);

    List<Map<String, java.lang.Object>> combinedScore(int i);

    Map getAllIssueArticleType(String table);

    Map seachArticleType(String type, String message);

    Map pushArticleType(String typeId,String type);

    String getArticleNameById(String id1);


    Map delAllRecycle(String type);

    Map getDelArticleType(Map<String, java.lang.Object> data);
}

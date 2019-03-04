package com.kingweather.we_chat.dao;

import org.omg.CORBA.Object;

import java.util.List;
import java.util.Map;

public interface ReleaseManagementDao {
    List<Map> getTypeMenuTree(String s);

    Map getTypeMessage(String article_type_id);

    int updateTypeMessage(String name, String keyword, String artcicle_type_id, String pathICon, String pathBack,String parentid);

    int updateTypeParentId(String article_type_id, String parentid);

    Map<String,Object> selectAricleTmpList(Map<String, java.lang.Object> data);

    Map<String,java.lang.Object> delAricleTmpList(String articleIdList);

    Map<String,java.lang.Object> getAricleTmpMessageById(String articleId,String type);

    Map<String,java.lang.Object> getAricleTmpCheckById(String articleId, String type);

    Map<String,java.lang.Object> updateAricleTmpMesage(Map<String, java.lang.Object> data);

    Map<String,java.lang.Object> pushAricleTmpById(String articleIds, String type);

    int mergeTypeById(Map<String, java.lang.Object> data);
}

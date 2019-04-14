package com.kingweather.we_chat.dao;

import java.util.List;
import java.util.Map;

/**
 * Description: wechat_web1
 */
public interface ExcleDownloadDao {
    List<Map<String,Object>> selArticle(Map<String, Object> info) throws Exception;

    List<Map<String,Object>> selArticleTmp(Map<String, Object> info) throws Exception;

    List<Map<String,Object>> selAcademicPaper(Map<String, Object> info) throws Exception;

}

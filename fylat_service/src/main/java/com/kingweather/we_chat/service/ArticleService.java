package com.kingweather.we_chat.service;

import java.util.List;
import java.util.Map;

public interface ArticleService {
    Map<String, Object> getArticleTrait(String articleId,int page);

    Map<String,Object> getArticleMessage(String articleId,String wechatid);

    Map<String,Object> collectingAndShare(Map<String, Object> data);

    Map<String,Object> getAllArticleType(String wechatid);

    Map<String,Object> articleSearch(String wechatid, String message, int page);

    boolean insertDomain(Object name, Object keyword,String path);

    List<Map<String, Object>> getAllDomain();

    boolean insertArticleType(String name, String keyword, String artcicle_type_id, String num, String path,String pathBack);

    List<Map<String,Object>> getAllAricleType(String article_type_id);

    Map<String,Object> addArticle(Map<String, Object> data);



    Map<String,Object> getAllArticle(Map<String, Object> conditions);

    Map<String,Object> deletedById(String article_id);

    Map<String,Object> addKeyword(Map<String, Object> data);

    Map<String,Object> getwebmessage(String article_id);

    Map<String,Object> updateArticle(Map<String, Object> data);

    Map<String,Object> keywordQuery(Map<String, Object> map);

    Map<String,Object> updateKeyword(String id,String keyword_name);

    Map<String,Object> delKeyword(String id);

    Map<String,Object>  getConditionDomain(Map<String, Object> conditions);

    Map<String,Object> delDomainById(String id);

    Map<String,Object> updateDomainById(Map<String, Object> data);
}

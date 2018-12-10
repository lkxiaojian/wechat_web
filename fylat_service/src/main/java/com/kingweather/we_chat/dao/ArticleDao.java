package com.kingweather.we_chat.dao;

import java.util.Map;

public interface ArticleDao {
    Map<String, Object> getArticleTrait(String articleId,int page);

    Map<String,Object> getArticleMessage(String articleId,String wechatid);

    Map<String,Object> collectingAndShare(Map<String, Object> data);

    Map<String,Object> getAllArticleType(String wechatid);

    Map<String,Object> articleSearch(String wechatid, String message, int page);

    boolean insertDomain(Object name, Object keyword,String path);
}

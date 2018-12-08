package com.kingweather.we_chat.service;

import java.util.Map;

public interface ArticleService {
    Map<String, Object> getArticleTrait(String articleId,int page);

    Map<String,Object> getArticleMessage(String articleId,String wechatid);

    Map<String,Object> collectingAndShare(Map<String, Object> data);

    Map<String,Object> getAllArticleType(String wechatid);

    Map<String,Object> articleSearch(String wechatid, String message, int page);
}

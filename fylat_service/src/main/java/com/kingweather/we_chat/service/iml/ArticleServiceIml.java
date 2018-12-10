package com.kingweather.we_chat.service.iml;

import com.kingweather.we_chat.dao.ArticleDao;
import com.kingweather.we_chat.service.ArticleService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Map;

@Service
public class ArticleServiceIml implements ArticleService {
    @Resource
    private ArticleDao articleDao;

    @Override
    public Map<String, Object> getArticleTrait(String articleId,int page) {
        return articleDao.getArticleTrait(articleId,page);
    }

    @Override
    public Map<String, Object> getArticleMessage(String articleId,String wechatid) {
        return articleDao.getArticleMessage(articleId,wechatid);
    }

    @Override
    public Map<String, Object> collectingAndShare(Map<String, Object> data) {
        return articleDao.collectingAndShare(data);
    }

    @Override
    public Map<String, Object> getAllArticleType(String wechatid) {
        return articleDao.getAllArticleType(wechatid);
    }

    @Override
    public Map<String, Object> articleSearch(String wechatid,String message, int page) {
        return articleDao.articleSearch(wechatid,message,page);
    }

    @Override
    public boolean insertDomain(Object name, Object keyword,String path) {
        return articleDao.insertDomain(name,keyword,path);
    }
}

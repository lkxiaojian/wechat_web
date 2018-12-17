package com.kingweather.we_chat.service.iml;

import com.kingweather.we_chat.dao.ArticleDao;
import com.kingweather.we_chat.service.ArticleService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
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

    @Override
    public List<Map<String, Object>> getAllDomain() {
        return articleDao.getAllDomain();
    }

    @Override
    public boolean insertArticleType(String name, String keyword, String artcicle_type_id, String num, String path,String pathBack) {
        return articleDao.insertArticleType(name,keyword,artcicle_type_id,num,path,pathBack);
    }

    @Override
    public List<Map<String, Object>> getAllAricleType(String article_type_id) {
        return articleDao.getAllAricleType(article_type_id);
    }

    @Override
    public Map<String, Object> addArticle(Map<String, Object> data) {
        return articleDao.addArticle(data);
    }

    @Override
    public Map<String, Object> getAllArticle(Map<String, Object> conditions) {
        return articleDao.getAllArticle(conditions);
    }

    @Override
    public Map<String, Object> deletedById(String article_id) {
        return articleDao.deletedById( article_id);
    }
}

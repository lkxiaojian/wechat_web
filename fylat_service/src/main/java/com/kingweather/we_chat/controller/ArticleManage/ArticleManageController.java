package com.kingweather.we_chat.controller.ArticleManage;

import com.kingweather.common.controller.BaseController;
import com.kingweather.fylat_service.controller.other.DataManageController;
import com.kingweather.we_chat.service.ArticleService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import javax.annotation.Resource;
import java.util.Map;

@RestController
public class ArticleManageController extends BaseController {

    Logger log = LoggerFactory.getLogger(DataManageController.class);
    @Resource
    private ArticleService articleService;

    /**
     * 根据类型获取所有该文章
     * @param articleId
     * @param page
     * @return
     */

    @RequestMapping(value = "/article/trait/rest", method = RequestMethod.GET)
    public Map<String, Object> getArticleTraitList(String articleId, int page) {
        log.info("获取文章类型");

        return articleService.getArticleTrait(articleId, page);
    }


    /**
     * 文章详情
     * @param articleId
     * @param wechatid
     * @return
     */
    @RequestMapping(value = "/article/message/rest", method = RequestMethod.GET)
    public Map<String, Object> getArticleMessage(String articleId,String wechatid) {

        return articleService.getArticleMessage(articleId,wechatid);
    }

    /**
     * 文章的分享或者收藏
     * @param data
     * @return
     */
    @RequestMapping(value = "/article/collectingAndShare/rest", method = RequestMethod.POST)
    public Map<String, Object> collectingAndShare(@RequestBody Map<String, Object> data) {

        return articleService.collectingAndShare(data);
    }


    /**
     * 获取全部期刊
     * @param wechatid
     * @return
     */
    @RequestMapping(value = "/article/getalltype/rest", method = RequestMethod.GET)
    public Map<String, Object> getAllArticleType(String  wechatid) {
        log.info("查询全部期刊");
        return articleService.getAllArticleType(wechatid);
    }


    /**
     * 获取全部期刊
     * @param wechatid
     * @return
     */
    @RequestMapping(value = "/article/search/rest", method = RequestMethod.GET)
        public Map<String, Object> articleSearch(String  wechatid, String message, int page) {
        log.info("搜索");
        return articleService.articleSearch(wechatid,message,page);
    }


}

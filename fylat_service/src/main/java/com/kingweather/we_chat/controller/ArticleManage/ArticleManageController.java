package com.kingweather.we_chat.controller.ArticleManage;

import com.kingweather.common.controller.BaseController;
import com.kingweather.common.util.DateUtil;
import com.kingweather.fylat_service.controller.other.DataManageController;
import com.kingweather.we_chat.service.ArticleService;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.*;

@RestController
public class ArticleManageController extends BaseController {

    Logger log = LoggerFactory.getLogger(DataManageController.class);
    @Resource
    private ArticleService articleService;
    @Value("${upload.realpath}")
    private String realpath;

    /**
     * 根据类型获取所有该文章
     *
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
     *
     * @param articleId
     * @param wechatid
     * @return
     */
    @RequestMapping(value = "/article/message/rest", method = RequestMethod.GET)
    public Map<String, Object> getArticleMessage(String articleId, String wechatid) {

        return articleService.getArticleMessage(articleId, wechatid);
    }

    /**
     * 文章的分享或者收藏
     *
     * @param data
     * @return
     */
    @RequestMapping(value = "/article/collectingAndShare/rest", method = RequestMethod.POST)
    public Map<String, Object> collectingAndShare(@RequestBody Map<String, Object> data) {

        return articleService.collectingAndShare(data);
    }


    /**
     * 获取全部期刊
     *
     * @param wechatid
     * @return
     */
    @RequestMapping(value = "/article/getalltype/rest", method = RequestMethod.GET)
    public Map<String, Object> getAllArticleType(String wechatid) {
        log.info("查询全部期刊");
        return articleService.getAllArticleType(wechatid);
    }


    /**
     * 获取全部期刊
     *
     * @param wechatid
     * @return
     */
    @RequestMapping(value = "/article/search/rest", method = RequestMethod.GET)
    public Map<String, Object> articleSearch(String wechatid, String message, int page) {
        log.info("搜索");
        return articleService.articleSearch(wechatid, message, page);
    }


    /**
     * 上传图片-领域信息
     *
     * @param file
     * @param req
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "article/fileUploadDomain", method = RequestMethod.POST)
    public Map<String, Object> add(@RequestParam MultipartFile file, HttpServletRequest req) {
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        Object objType = req.getParameter("int_type");
        if (objType == null) {
            map.put("code", 0);
            map.put("message", "传参错误");
            return map;
        }
        boolean isFlag = false;
        String savePath = DateUtil.formatDateTime(new Date(), "yyyy-MM-dd") + "_" + (int) (Math.random() * 100) + "/" + file.getOriginalFilename();
        File f = new File(realpath + savePath);
        int type = Integer.parseInt(objType.toString());
        if (type == 1) {
            //领域
            Object name = req.getParameter("name");
            Object keyword = req.getParameter("keyword");

            if (name == null) {
                map.put("code", 0);
                map.put("message", "传参错误");
                return map;
            }
            String path = realpath + savePath;
            if (file == null) {
                path = "";
            }
            isFlag = articleService.insertDomain(name, keyword, path);


        }

        if (isFlag) {
            try {
                FileUtils.copyInputStreamToFile(file.getInputStream(), f);
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            map.put("code", 0);
            map.put("message", "传参错误");
            return map;
        }
        return map;
    }


    /**
     * 获取全部领域
     *
     * @return
     */
    @RequestMapping(value = "article/getAllDomain")
    public List<Map<String, Object>> getAllDomain() {

        return articleService.getAllDomain();
    }




    /**
     * 上传图片-领域信息
     *
     * @param file1
     * @param req
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "article/addArticleType", method = RequestMethod.POST)
    public Map<String, Object> addArticleType(@RequestParam("file[0]") MultipartFile  file1, @RequestParam("file[1]") MultipartFile  file2,HttpServletRequest req) {
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        Object objType = req.getParameter("int_type");
        if (objType == null) {
            map.put("code", 0);
            map.put("message", "传参错误");
            return map;
        }

        boolean isFlag = false;
        String savePathIcon = DateUtil.formatDateTime(new Date(), "yyyy-MM-dd") + "_" + (int) (Math.random() * 100) + "/" + file1.getOriginalFilename();
        File fICon = new File(realpath + savePathIcon);
        String savePathBack = DateUtil.formatDateTime(new Date(), "yyyy-MM-dd") + "_" + (int) (Math.random() * 100) + "/" + file2.getOriginalFilename();
        File fBack= new File(realpath + savePathBack);
        int type = Integer.parseInt(objType.toString());
     if (type == 2) {
            //文章类型
            String name = req.getParameter("name");
            String keyword = req.getParameter("keyword");
            String artcicle_type_id = req.getParameter("artcicle_type_id");
            String num = req.getParameter("num_id");
            String pathICon = realpath + savePathIcon;
            String pathBack = realpath + savePathBack;
            isFlag = articleService.insertArticleType(name, keyword, artcicle_type_id, num,pathICon,pathBack);
        }

        if (isFlag) {
            try {
                FileUtils.copyInputStreamToFile(file1.getInputStream(), fICon);
                FileUtils.copyInputStreamToFile(file2.getInputStream(), fBack);

            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            map.put("code", 0);
            map.put("message", "传参错误");
            return map;
        }
        return map;
    }




}

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
public class WebArticleManageController extends BaseController {

    Logger log = LoggerFactory.getLogger(DataManageController.class);
    @Resource
    private ArticleService articleService;
    @Value("${upload.realpath}")
    private String realpath;


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
            String path = realpath.replaceAll("home", "resources") + savePath;
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


    @RequestMapping(value = "article/getAllAricleType")
    public List<Map<String, Object>> getAllAricleType(String article_type_id) {

        return articleService.getAllAricleType(article_type_id);
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
    public Map<String, Object> addArticleType(@RequestParam("file[0]") MultipartFile file1, @RequestParam("file[1]") MultipartFile file2, HttpServletRequest req) {
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
        File fBack = new File(realpath + savePathBack);
        int type = Integer.parseInt(objType.toString());
        if (type == 2) {
            //文章类型
            String name = req.getParameter("name");
            String keyword = req.getParameter("keyword");
            String artcicle_type_id = req.getParameter("artcicle_type_id");
            String num = req.getParameter("num_id");
            String pathICon = realpath.replaceAll("home", "resources") + savePathIcon;
            String pathBack = realpath.replaceAll("home", "resources") + savePathBack;
            isFlag = articleService.insertArticleType(name, keyword, artcicle_type_id, num, pathICon, pathBack);
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


    /**
     * 添加文章
     *
     * @return
     */
    @RequestMapping(value = "article/addArticle", method = RequestMethod.POST)
    public Map<String, Object> addArticle(@RequestBody Map<String, Object> data) {

        Map<String, Object> maps = articleService.addArticle(data);
        return maps;
    }


    /**
     * 上传图片-领域信息
     *
     * @param file
     * @param req
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "article/articleImageUpload", method = RequestMethod.POST)
    public Map<String, Object> articleImageUpload(@RequestParam("file") MultipartFile file, HttpServletRequest req) {


        Map<String, Object> map = new LinkedHashMap<String, Object>();
        String savePath = DateUtil.formatDateTime(new Date(), "yyyy-MM-dd") + "_" + (int) (Math.random() * 100) + "/" + file.getOriginalFilename();

        String path = realpath + savePath;
        File f = new File(path);

        try {
            FileUtils.copyInputStreamToFile(file.getInputStream(), f);
            map.put("code",0);
            List<String> pathList=new ArrayList<>();
            String s = path.replaceAll("home", "resources");
            pathList.add("http://106.2.11.94:7902"+s);
            map.put("data", pathList);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return map;

    }



    /**
     * 查询组列表
     */
    @RequestMapping(value="/article/query",method=RequestMethod.GET)
    public  Map<String, Object> select(){
        Map<String, Object> map = new LinkedHashMap<String, Object>();

            int startNum = Integer.parseInt(request.getParameter("pageNumber"));
            int pageSize = Integer.parseInt(request.getParameter("pageSize"));
//            String gName = request.getParameter("gName");

            Map<String, Object> conditions = new HashMap<String, Object>();
            conditions.put("startNum", startNum);
            conditions.put("pageSize", pageSize);

            map = articleService.getAllArticle(conditions);


        return map;
    }



    /**
     * 文章删除
     */
    @RequestMapping(value="/article/deletedById",method=RequestMethod.GET)
    public  Map<String, Object> deletedById(String article_id){
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        map = articleService.deletedById(article_id);


        return map;
    }




}
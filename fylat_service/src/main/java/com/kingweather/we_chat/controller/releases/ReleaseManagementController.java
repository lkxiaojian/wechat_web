package com.kingweather.we_chat.controller.releases;

import com.kingweather.common.controller.BaseController;
import com.kingweather.common.util.DateUtil;
import com.kingweather.we_chat.service.ReleaseManagementService;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/releaseManagement")
public class ReleaseManagementController extends BaseController {
    @Resource
    private ReleaseManagementService releaseManagementService;
    @Value("${upload.realpath}")
    private String realpath;

    /**
     * 得到算法返回的类型树状
     *
     * @return
     */
    @RequestMapping(value = "/getTypeMenuTree/rest")
    public Map getTypeMenuTree() {

        Map map = new HashMap();
        try {
            List list = releaseManagementService.getTypeMenuTree();
            map.put("code", 0);
            map.put("message", "查询成功");
            map.put("data", list);
            return map;
        } catch (Exception e) {
            map.put("code", 2);
            map.put("message", "系统异常，请联系管理员！");
            e.printStackTrace();
            return map;
        }
    }

    /**
     * 根据id 来算法的获取类型的详情
     *
     * @param article_type_id
     * @return
     */

    @RequestMapping(value = "/getTypeMessage/rest")
    public Map getTypeMessage(String article_type_id) {

        Map map = new HashMap();
        try {
            Map list = releaseManagementService.getTypeMessage(article_type_id);
            map.put("code", 0);
            map.put("message", "查询成功");
            map.put("data", list);
            return map;
        } catch (Exception e) {
            map.put("code", 2);
            map.put("message", "系统异常，请联系管理员！");
            e.printStackTrace();
            return map;
        }
    }

    /**
     * 修改文章的类型
     *
     * @param file1
     * @param file2
     * @param req
     * @return
     */

    @RequestMapping(value = "updateTypeMessage/rest", method = RequestMethod.POST)
    public Map<String, Object> updateTypeMessage(@RequestParam("file[0]") MultipartFile file1, @RequestParam("file[1]") MultipartFile file2, HttpServletRequest req) {
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        String pathICon = "";
        String pathBack = "";
        try {
            if (file1 != null) {
                String savePathIcon = DateUtil.formatDateTime(new Date(), "yyyy-MM-dd") + "_" + (int) (Math.random() * 100) + "/" + file1.getOriginalFilename();
                File fICon = new File(realpath + savePathIcon);
                pathICon = realpath.replaceAll("home", "resources") + savePathIcon;
                FileUtils.copyInputStreamToFile(file1.getInputStream(), fICon);

            } else {
                pathICon = req.getParameter("iamge_icon");
            }
            if (file2 != null) {
                String savePathBack = DateUtil.formatDateTime(new Date(), "yyyy-MM-dd") + "_" + (int) (Math.random() * 100) + "/" + file2.getOriginalFilename();
                File fBack = new File(realpath + savePathBack);
                pathBack = realpath.replaceAll("home", "resources") + savePathBack;
                FileUtils.copyInputStreamToFile(file2.getInputStream(), fBack);
            } else {
                pathBack = req.getParameter("iamge_back");
            }
        } catch (Exception e) {
            map.put("code", 2);
            map.put("message", "系统异常，请联系管理员！");
            e.printStackTrace();
            return map;
        }


        //文章类型
        String name = req.getParameter("name");
        String keyword = req.getParameter("keyword");
        String artcicle_type_id = req.getParameter("artcicle_type_id");
        String parentid = req.getParameter("parentid");
        int i = releaseManagementService.updateTypeMessage(name, keyword, artcicle_type_id, pathICon, pathBack, parentid);

        if (i == 1) {
            map.put("code", 0);
            map.put("message", "更新成功");
        } else {
            map.put("code", 1);
            map.put("message", "传参错误");
        }
        return map;
    }


    /**
     * 根据id 来更新类型的parentid
     *
     * @param article_type_id
     * @return
     */

    @RequestMapping(value = "/updateTypeParentId/rest")
    public Map updateTypeParentId(String article_type_id, String parentid) {

        Map map = new HashMap();
        try {
            int i = releaseManagementService.updateTypeParentId(article_type_id, parentid);
            if (i == 1) {
                map.put("code", 0);
                map.put("message", "更新成功");

                return map;
            } else {
                return getErrorMap();
            }

        } catch (Exception e) {
            e.printStackTrace();
            return getErrorMapService();
        }
    }

    /**
     * 文章或者论文列表
     *
     * @param data
     * @return
     */

    @RequestMapping(value = "selectAricleTmpList/rest", method = RequestMethod.POST)
    public Map<String, Object> selectAricleTmpList(@RequestParam Map<String, Object> data) {
        try {

            return releaseManagementService.selectAricleTmpList(data);
        } catch (Exception e) {

            return getErrorMapService();
        }
    }

    /**
     * 批量或者单个删除文章或者论文
     *
     * @param articleIdList
     * @return
     */
    @RequestMapping(value = "delAricleTmpList/rest", method = RequestMethod.POST)
    public Map<String, Object> delAricleTmpList(String articleIdList) {
        try {

            return releaseManagementService.delAricleTmpList(articleIdList);
        } catch (Exception e) {

            return getErrorMapService();
        }
    }

    /**
     * 根据文章的id ，获取文章的详情
     *
     * @param articleId type 0  文章 1 论文
     * @return
     */
    @RequestMapping(value = "getAricleTmpMessageById/rest", method = RequestMethod.GET)
    public Map<String, Object> getAricleTmpMessageById(String articleId, String type) {
        try {
            return releaseManagementService.getAricleTmpMessageById(articleId,type);
        } catch (Exception e) {
            return getErrorMapService();
        }
    }

    /**
     * 根据文章的id  进行审核
     * @param articleId
     * @param type  type 0  文章 1 论文
     * @return
     */

    @RequestMapping(value = "getAricleTmpCheckById/rest", method = RequestMethod.GET)
    public Map<String, Object> getAricleTmpCheckById(String articleId, String type) {
        try {
            return releaseManagementService.getAricleTmpCheckById(articleId,type);
        } catch (Exception e) {
            return getErrorMapService();
        }
    }


    /**
     * 传参错误
     *
     * @return
     */
    private HashMap<String, Object> getErrorMap() {
        HashMap<String, Object> map = new HashMap<>();
        map.put("code", 1);
        map.put("message", "传参错误！");
        return map;
    }

    /**
     * 服务器内部错误
     *
     * @return
     */

    private HashMap<String, Object> getErrorMapService() {
        HashMap<String, Object> map = new HashMap<>();
        map.put("code", 2);
        map.put("message", "服务器内部错误！");
        return map;
    }


}

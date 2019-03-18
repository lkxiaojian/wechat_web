package com.kingweather.we_chat.controller.releases;

import com.kingweather.common.controller.BaseController;
import com.kingweather.common.util.DateUtil;
import com.kingweather.we_chat.service.ReleaseManagementService;
import com.sun.javafx.scene.control.skin.VirtualFlow;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;
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
    public Object getTypeMenuTree(String type) {

        if (type == null || "".equals(type)) {
            type = "0";
        }
        Map map = new HashMap();
        try {
            List list = releaseManagementService.getTypeMenuTree(type);
            map.put("id", 0);
            List<Map> listResult = new ArrayList<>();
            listResult.add(0, map);
            map.put("item", list);
            Object o = listResult.get(0);
            return o;
        } catch (Exception e) {
            map.put("code", 2);
            map.put("message", "系统异常，请联系管理员！");
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 根据id 来算法的获取类型的详情
     *
     * @param article_type_id type 1 为真是表中的信息  0 或者null 查询临时表
     * @return
     */

    @RequestMapping(value = "/getTypeMessage/rest")
    public Map getTypeMessage(String article_type_id, String type) {
        if (type == null || "".equals(type)) {
            type = "0";
        }

        Map map = new HashMap();
        try {
            Map list = releaseManagementService.getTypeMessage(article_type_id, type);
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

    @RequestMapping(value = "/updateTypeMessage/rest", method = RequestMethod.POST)
    @Transactional
    public Map<String, Object> updateTypeMessage(@RequestParam(value = "file[0]", required = false) MultipartFile file1, @RequestParam(value = "file[1]", required = false) MultipartFile file2, HttpServletRequest req) {
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
        String type = req.getParameter("type");
        int i = releaseManagementService.updateTypeMessage(name, keyword, artcicle_type_id, pathICon, pathBack, parentid, type);

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
     * 根据id 合并类型
     *
     * @param data
     * @return
     */

    @RequestMapping(value = "/mergeTypeById/rest", method = RequestMethod.POST)
    @Transactional
    public Map mergeTypeById(@RequestBody Map<String, Object> data) {
        Map map = new HashMap();
        try {
            int i = releaseManagementService.mergeTypeById(data);
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
     * @param
     * @return
     */

    @RequestMapping(value = "/selectAricleTmpList/rest", method = {RequestMethod.POST, RequestMethod.GET})
    public Map<String, Object> selectAricleTmpList(HttpServletRequest req) {
        try {

            return releaseManagementService.selectAricleTmpList(req);
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
    @RequestMapping(value = "/delAricleTmpList/rest", method = RequestMethod.GET)
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
    @RequestMapping(value = "/getAricleTmpMessageById/rest", method = RequestMethod.GET)
    public Map<String, Object> getAricleTmpMessageById(String articleId, String type) {
        try {
            return releaseManagementService.getAricleTmpMessageById(articleId, type);
        } catch (Exception e) {
            return getErrorMapService();
        }
    }

    /**
     * 根据文章的id  进行审核
     *
     * @param articleIds
     * @param type       type 0  文章 1 论文
     * @return
     */

    @RequestMapping(value = "/getAricleTmpCheckById/rest", method = RequestMethod.GET)
    public Map<String, Object> checkAricleTmpCheckById(String articleIds, String type) {
        try {
            return releaseManagementService.getAricleTmpCheckById(articleIds, type);
        } catch (Exception e) {
            return getErrorMapService();
        }
    }


    /**
     * 更新文章或者论文
     *
     * @param data
     * @return
     */

    @RequestMapping(value = "/updateAricleTmpMesage/rest", method = RequestMethod.POST)
    public Map<String, Object> updateAricleTmpMesage(@RequestBody Map<String, Object> data) {
        try {
            return releaseManagementService.updateAricleTmpMesage(data);
        } catch (Exception e) {

            return getErrorMapService();
        }
    }


    /**
     * 根据文章的id  进行发布
     *
     * @param articleIds
     * @param type       type 0  文章 1 论文
     * @return
     */

    @RequestMapping(value = "/pushAricleTmpById/rest", method = RequestMethod.GET)
    public Map<String, Object> pushAricleTmpCheckById(String articleIds, String type) {
        try {
            return releaseManagementService.pushAricleTmpById(articleIds, type);
        } catch (Exception e) {
            return getErrorMapService();
        }
    }

    /**
     * 查询 论文posting列表
     *
     * @param data
     * @return
     */
    @RequestMapping(value = "/getPostingList/rest", method = RequestMethod.POST)
    public Map<String, Object> getPostingList(@RequestBody Map<String, Object> data) {
        try {
            return releaseManagementService.getPostingList(data);
        } catch (Exception e) {
            return getErrorMapService();
        }
    }

    /**
     * 根据id 获取论文posting 详细信息
     *
     * @param posting_id
     * @return
     */

    @RequestMapping(value = "/getPostingMessage/rest", method = RequestMethod.GET)
    public Map<String, Object> getPostingMessage(String posting_id) {
        try {
            return releaseManagementService.getPostingMessage(posting_id);
        } catch (Exception e) {
            return getErrorMapService();
        }
    }


    /**
     * 更改posting 图片
     *
     * @param file1
     * @param req
     * @return
     */

    @RequestMapping(value = "/updatePostingImage/rest", method = RequestMethod.POST)
    public Map<String, Object> updatePostingImage(@RequestParam("file[0]") MultipartFile file1, HttpServletRequest req) {
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        String savePathIcon = DateUtil.formatDateTime(new Date(), "yyyy-MM-dd") + "_" + (int) (Math.random() * 100) + "/" + file1.getOriginalFilename();
        File fICon = new File(realpath + savePathIcon);
        String posting_id = req.getParameter("posting_id");
        if (posting_id == null) {
            return getErrorMap();
        }
        try {
            FileUtils.copyInputStreamToFile(file1.getInputStream(), fICon);
            String pathICon = realpath.replaceAll("home", "resources") + savePathIcon;
            int i = releaseManagementService.updatePostingImage(posting_id, pathICon);

            if (i == 1) {
                map.put("code", 0);
                map.put("message", "更新成功");
                return map;
            } else {
                return getErrorMap();
            }

        } catch (IOException e) {
            e.printStackTrace();
            return getErrorMapService();
        }


    }

    /**
     * 根据id删除文章类型
     *
     * @param article_type_id
     * @return
     */

    @RequestMapping(value = "/delArticleTypeById/rest", method = RequestMethod.GET)
    @Transactional
    public Map<String, Object> delArticleTypeById(String article_type_id) {
        try {
            return releaseManagementService.delArticleTypeById(article_type_id);
        } catch (Exception e) {
            return getErrorMapService();
        }
    }


    @RequestMapping(value = "/combinedScore/rest", method = RequestMethod.GET)
    public Map combinedScore() {
        try {
            return releaseManagementService.combinedScore();
        } catch (Exception e) {
            return getErrorMapService();
        }
    }

    /**
     * 查询所有已发布的类型
     *
     * @param type
     * @return
     */

    @RequestMapping(value = "/getAllIssueArticleType/rest", method = RequestMethod.GET)
    public Map getAllIssueArticleType(String type) {
        try {
            return releaseManagementService.getAllIssueArticleType(type);
        } catch (Exception e) {
            return getErrorMapService();
        }
    }


    /**
     * 模糊查询所有的类型
     *
     * @param type
     * @return
     */

    @RequestMapping(value = "/seachArticleType/rest", method = RequestMethod.GET)
    public Map seachArticleType(String type, String message) {
        try {
            return releaseManagementService.seachArticleType(type, message);
        } catch (Exception e) {
            return getErrorMapService();
        }
    }
    /**
     * 多个文章类型发布
     *
     * @param typeId
     * @return
     */

    @RequestMapping(value = "/pushArticleType/rest", method = RequestMethod.GET)
    @Transactional
    public Map pushArticleType(String typeId) {
        try {
            return releaseManagementService.pushArticleType(typeId);
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

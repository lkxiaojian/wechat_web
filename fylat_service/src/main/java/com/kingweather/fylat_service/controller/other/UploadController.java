package com.kingweather.fylat_service.controller.other;

import com.kingweather.common.util.DateUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.apache.commons.io.FileUtils;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 文件上传-控制器
 * Created by handongchen on 2017/12/19.
 */

@Controller
public class UploadController {

    @Value("${upload.realpath}")
    private String realpath;

    /**
     * 上传文件-进程源码
     *
     * @param file
     * @param req
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "orderData/fileUpload", method = RequestMethod.POST)
    public Map<String, Object> add(@RequestParam MultipartFile file, HttpServletRequest req) {
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        String savePath = DateUtil.formatDateTime(new Date(), "yyyy-MM-dd") + "_" + (int) (Math.random() * 100) + "/" + file.getOriginalFilename();

        File f = new File(realpath + savePath);

        try {
            FileUtils.copyInputStreamToFile(file.getInputStream(), f);
            map = uploadOrder(realpath + savePath, file.getOriginalFilename());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return map;
    }

    /**
     * 返回信息
     *
     * @param savepath 路径
     * @param fileName 文件名
     * @return
     */
    public Map<String, Object> uploadOrder(String savepath, String fileName) {
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        Map<String, String> result = new LinkedHashMap<String, String>();
        result.put("fileName", fileName);
        result.put("filePath", savepath);
        result.put("uploadState", "成功");
        result.put("compileState", "未编译");
        map.put("code", 0);
        map.put("message", "成功");
        map.put("result", result);
        return map;
    }
}

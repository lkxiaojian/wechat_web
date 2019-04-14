package com.kingweather.we_chat.service.iml;

import com.kingweather.we_chat.dao.ExcleDownloadDao;
import com.kingweather.we_chat.service.ExcleDownloadService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

/**
 * Description: wechat_web1
 */
@Service
public class ExcleDownloadServiceIml implements ExcleDownloadService {
    @Resource
    private  ExcleDownloadDao excleDownloadDao;


    @Override
    public List<Map<String, Object>> selArticle(Map<String, Object> info) throws Exception {
        String size =  info.get("pageSize")==null?"0":info.get("pageSize").toString();
        info.put("pageSize",Integer.valueOf(size)>1000?"10":size) ;
        return excleDownloadDao.selArticle(info);
    }

    @Override
    public List<Map<String, Object>> selArticleTmp(Map<String, Object> info) throws Exception {
        String size =   info.get("pageSize")==null?"0":info.get("pageSize").toString();
        info.put("pageSize",Integer.valueOf(size)>1000?"10":size) ;
        return excleDownloadDao.selArticleTmp(info);
    }

    @Override
    public List<Map<String, Object>> selAcademicPaper(Map<String, Object> info) throws Exception {
        String size =   info.get("pageSize")==null?"0":info.get("pageSize").toString();
        info.put("pageSize",Integer.valueOf(size)>1000?"10":size) ;
        return excleDownloadDao.selAcademicPaper(info);
    }
}

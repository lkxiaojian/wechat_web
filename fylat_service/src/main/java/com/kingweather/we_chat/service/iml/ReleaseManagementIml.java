package com.kingweather.we_chat.service.iml;

import com.kingweather.we_chat.dao.ReleaseManagementDao;
import com.kingweather.we_chat.service.ReleaseManagementService;
import org.springframework.stereotype.Service;
import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@Service
public class ReleaseManagementIml implements ReleaseManagementService {
    @Resource
    private ReleaseManagementDao releaseManagementDao;

    @Override
    public List getTypeMenuTree() {

        List<Map> list = releaseManagementDao.getTypeMenuTree("-1");
        for(Map s:list) {
            List childrenList = getMenuTreeChildren(s.get("article_type_id").toString());
            if(childrenList!=null){
                s.put("children",childrenList);
            }
        }
        return list;


    }

    private List getMenuTreeChildren(String parentId) {

        List<Map> list = releaseManagementDao.getTypeMenuTree(parentId);
        for (Map s:list) {
            List childrenList = getMenuTreeChildren(s.get("article_type_id").toString());
            if(childrenList!=null){
                s.put("children",childrenList);
            }
        }
        return list;
    }

}

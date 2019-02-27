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

    @Override
    public Map getTypeMessage(String article_type_id) {
        Map map =releaseManagementDao.getTypeMessage(article_type_id);
        return map;
    }

    @Override
    public int updateTypeMessage(String name, String keyword, String artcicle_type_id, String pathICon, String pathBack,String parentid) {

        int i = releaseManagementDao.updateTypeMessage(name, keyword, artcicle_type_id, pathICon, pathBack,parentid);





        return i;
    }

    @Override
    public int updateTypeParentId(String article_type_id, String parentid) {
        int i=releaseManagementDao.updateTypeParentId(article_type_id,parentid);

        return i;
    }

    @Override
    public Map selectAricleTmpList(Map<String, java.lang.Object> data) {
        return releaseManagementDao.selectAricleTmpList(data);
    }

    @Override
    public Map<String, Object> delAricleTmpList(String articleIdList) {
        return releaseManagementDao.delAricleTmpList(articleIdList);
    }

    @Override
    public Map<String, Object> getAricleTmpMessageById(String articleId,String type) {
        return releaseManagementDao.getAricleTmpMessageById(articleId,type);
    }

    @Override
    public Map<String, Object> getAricleTmpCheckById(String articleId, String type) {
        return releaseManagementDao.getAricleTmpCheckById(articleId,type);
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

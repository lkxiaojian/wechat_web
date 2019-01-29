package com.kingweather.we_chat.service.iml;

import ch.qos.logback.core.net.SyslogOutputStream;
import com.kingweather.we_chat.dao.UserMenuDao;
import com.kingweather.we_chat.service.UserMenuService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Description: fylat_service
 * Created by s on 2019/1/29 9:44
 */
@Service
public class UserMenuServiceIml implements UserMenuService {

    @Resource
    private UserMenuDao userMenuDaoImp;


    @Override
    public List getMenuTree() {
       List<Map> list = userMenuDaoImp.getMenuTree("0");
        for(Map s:list) {
            List childrenList = getMenuTreeChildren(s.get("id").toString());
            if(childrenList!=null){
                s.put("children",childrenList);
            }
        }
        return list;
    }

    public List<Map> getMenuTreeChildren(String parentId) {
        List<Map> list = userMenuDaoImp.getMenuTree(parentId);
        for (Map s:list) {
            List childrenList = getMenuTreeChildren(s.get("id").toString());
            if(childrenList!=null){
                s.put("children",childrenList);
            }
        }
        return list;
    }

}

package com.kingweather.we_chat.service.iml;

import com.kingweather.we_chat.dao.BWListDao;
import com.kingweather.we_chat.service.BWListService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Map;

@Service
public class BWListServiceIml implements BWListService{
    @Resource
    private BWListDao bwListDao;


    @Override
    public Map<String, Object> scoresSetting(Map<String, Object> data) {

        return bwListDao.scoresSetting(data);
    }

    @Override
    public Map<String, Object> GetSettingMessage() {
        return bwListDao.GetSettingMessage();
    }

    @Override
    public Map<String, Object> addbwKeyName(String name) {
        return bwListDao.addbwKeyName( name);
    }

    @Override
    public Map<String, Object> updatebwKeyName(String id,String name) {
        return bwListDao.updatebwKeyName( id,name);
    }

    @Override
    public Map<String, Object> delbwKeyName(String id) {
        return bwListDao.delbwKeyName(id);
    }

    @Override
    public Map<String, Object> getbwKeyNameList(String message) {
        return bwListDao.getbwKeyNameList(message);
    }

    @Override
    public Map<String, Object> addBwList(Map<String, Object> data) {
        return bwListDao.addBwList(data) ;
    }

    @Override
    public Map<String, Object> updateBwList(Map<String, Object> data) {
        return bwListDao.updateBwList(data) ;
    }

    @Override
    public Map<String, Object> delBwList(String id) {
        return bwListDao.delBwList(id);
    }

    @Override
    public Map<String, Object> getBwList(Map<String, Object> data) {
        return bwListDao.getBwList(data);
    }
}

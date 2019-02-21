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
}

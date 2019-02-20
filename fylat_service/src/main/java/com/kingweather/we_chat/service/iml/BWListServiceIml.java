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
}

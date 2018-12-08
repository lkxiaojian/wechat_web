package com.kingweather.fylat_service.service.integrationManage.impl;

import com.kingweather.fylat_service.dao.ConfigDao;
import com.kingweather.fylat_service.service.integrationManage.ConfigService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author handongchen
 * @date 2017/12/25
 */
@Service("configService")
public class ConfigServiceImpl implements ConfigService {

    @Resource
    private ConfigDao configDao;

    @Override
    public String add(Map<String, Object> pageParam) {
        if (configDao.add(getArgsForConfig(pageParam)) > 0) {
            return "access";
        } else {
            return "sql exec 0";
        }
    }

    //-------------------------类内通用方法---------------------------------

    /**
     * 将网页传过来的map转换为占位符需要的格式
     *
     * @param map 页面传过来的
     * @return 占位符需要的格式
     */
    private Object[] getArgsForConfig(Map<String, Object> map) {
        Object[] args = new Object[]{
                map.get("config_head"),
                map.get("config_foot"),
                map.get("config_param").toString(),
                map.get("config_path"),
                map.get("config_belong_int")
        };
        return args;
    }


}

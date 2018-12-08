package com.kingweather.fylat_service.service.other.impl;

import com.kingweather.common.util.Page;
import com.kingweather.fylat_service.dao.DataManageDao;
import com.kingweather.fylat_service.service.other.DataManageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

/**
 * 数据管理模块-业务-实现类
 * Created by handongchen on 2017/10/17.
 */
@Service("dataManageService")
public class DataManageServiceImpl implements DataManageService{

    @Autowired
    private DataManageDao dataManageDao;

    @Transactional
    @Override
    public Page<Map<String, Object>> getDataManageList(Map<String, Object> conditions) {
        return dataManageDao.getDataManageList(conditions);
    }
}

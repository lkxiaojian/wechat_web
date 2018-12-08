package com.kingweather.fylat_service.service.other.impl;

import com.kingweather.common.util.Page;
import com.kingweather.fylat_service.dao.QualityTestDao;
import com.kingweather.fylat_service.service.other.QualityTestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * 质量检测（目视，异源，不同类型）模块-相关业务-接口
 * Created by handongchen on 2017/10/16.
 */
@Service("qualityTestService")
public class QualityTestServiceImpl implements QualityTestService {

    @Autowired
    private QualityTestDao qualityTestDao;


    @Override
    public Page<Map<String, Object>> getAllQualityList(Map<String, String[]> conditions) {
        return qualityTestDao.getAllQualityList(conditions);
    }
}

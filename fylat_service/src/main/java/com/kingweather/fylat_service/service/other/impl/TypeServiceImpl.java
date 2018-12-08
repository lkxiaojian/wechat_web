package com.kingweather.fylat_service.service.other.impl;

import com.kingweather.fylat_service.dao.TypeDao;
import com.kingweather.fylat_service.service.other.TypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * 类型相关业务-实现类
 * Created by handongchen on 2017/10/16.
 */
@Service("typeService")
public class TypeServiceImpl implements TypeService {

    @Autowired
    private TypeDao typeDao;

    @Transactional
    @Override
    public List<Map<String, Object>> getAllTypeList() {
        return typeDao.getAllTypeList();
    }
}

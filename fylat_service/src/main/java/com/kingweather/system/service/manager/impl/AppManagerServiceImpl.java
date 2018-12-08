package com.kingweather.system.service.manager.impl;

import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.kingweather.common.util.Page;
import com.kingweather.system.dao.manager.AppManagerDao;
import com.kingweather.system.manager.domain.App;
import com.kingweather.system.service.manager.AppManagerService;
import org.springframework.transaction.annotation.Transactional;


/**
 * 应用管理
 */
@Service
public class AppManagerServiceImpl implements AppManagerService
{
    @Resource
    private AppManagerDao appManagerDao;

    @Override
    @Transactional
    public boolean delete(String id)
    {
        return appManagerDao.delete(id);
    }

    @Override
    @Transactional
    public boolean lock(String id)
    {
        return appManagerDao.lock(id);
    }

    @Override
    @Transactional
    public boolean open(String id)
    {
        return appManagerDao.open(id);
    }


    @Override
    @Transactional
    public boolean waitOpen(String id)
    {
        return appManagerDao.waitOpen(id);
    }


    @Override
    @Transactional
    public App findById(String id)
    {
        return appManagerDao.findById(id);
    }

    @Override
    @Transactional
    public Page<Map<String, Object>> findList(Map<String, Object> condition, String startNum, String pageSize)
    {
        return appManagerDao.list(condition, startNum, pageSize);
    }
}



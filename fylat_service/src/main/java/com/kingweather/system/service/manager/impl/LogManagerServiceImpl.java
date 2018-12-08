package com.kingweather.system.service.manager.impl;

import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.kingweather.common.util.Page;
import com.kingweather.system.dao.manager.LogManagerDao;
import com.kingweather.system.manager.domain.Log;
import com.kingweather.system.service.manager.LogManagerService;
import org.springframework.transaction.annotation.Transactional;


/**
 * 日志管理
 */
@Service
public class LogManagerServiceImpl implements LogManagerService
{
    @Resource
    private LogManagerDao logManagerDao;

    @Override
    @Transactional
    public Page<Map<String, Object>> logs(Map<String, Object> log, String startNum, String pageSize)
    {
        return logManagerDao.logs(log, startNum, pageSize);
    }

    @Override
    @Transactional
    public boolean insertLog(Log log)
    {
        return logManagerDao.insertLog(log);
    }

}



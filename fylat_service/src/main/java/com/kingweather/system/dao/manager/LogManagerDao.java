package com.kingweather.system.dao.manager;

import java.util.Map;

import com.kingweather.common.util.Page;
import com.kingweather.system.manager.domain.Log;

/**
 * 　日志管理
 */
public interface LogManagerDao
{
    /**
     * 根据条件查询日志
     *
     * @return 列表
     */
    Page<Map<String, Object>> logs(Map<String, Object> log, String startNum, String pageSize);

    /**
     * 插入日志
     */
    boolean insertLog(Log log);
}
package com.kingweather.system.service.manager;

import com.kingweather.common.util.Page;
import com.kingweather.system.manager.domain.Log;

import java.util.Map;


/**
 * 应用管理
 */
public interface LogManagerService
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

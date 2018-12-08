package com.kingweather.system.service.manager;

import java.util.Map;

import com.kingweather.common.util.Page;
import com.kingweather.system.manager.domain.App;



/**
 * 应用管理
 */
public interface AppManagerService
{
    boolean delete(String id);

    boolean lock(String id);

    boolean open(String id);

    boolean waitOpen(String id);


    App findById(String id);

    Page<Map<String, Object>> findList(Map<String, Object> condition, String startNum, String pageSize);
}

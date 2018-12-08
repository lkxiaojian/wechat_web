package com.kingweather.system.dao.manager;

import java.util.Map;

import com.kingweather.common.util.Page;
import com.kingweather.system.manager.domain.App;


/**
 * 　应用管理
 */
public interface AppManagerDao
{
    public boolean delete(String id);


    public App findById(String id);

    public boolean lock(String id);

    public boolean open(String id);

    public boolean waitOpen(String id);


    public Page<Map<String, Object>> list(Map<String, Object> condition, String startNum, String pageSize);
}
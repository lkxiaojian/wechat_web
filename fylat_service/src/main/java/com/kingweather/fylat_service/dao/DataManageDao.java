package com.kingweather.fylat_service.dao;

import com.kingweather.common.util.Page;

import java.util.List;
import java.util.Map;

/**
 * 数据管理模块-相关数据操作-接口
 * Created by handongchen on 2017/10/16.
 */
public interface DataManageDao {
    /**
     * 根据类型查询数据
     *
     * @param conditions 查询参数
     * @return 数据管理需要的数据集合
     */
    Page<Map<String, Object>> getDataManageList(Map<String, Object> conditions);
}

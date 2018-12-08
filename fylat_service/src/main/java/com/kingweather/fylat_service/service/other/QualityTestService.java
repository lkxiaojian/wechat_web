package com.kingweather.fylat_service.service.other;

import com.kingweather.common.util.Page;

import java.util.Map;

/**
 * 质量检测（目视，异源，不同类型）模块-相关业务-接口
 * Created by handongchen on 2017/10/16.
 */
public interface QualityTestService {
    /**
     * 根据查询条件查询质量检测相关数据
     *
     * @param conditions 查询条件
     * @return 查询结果
     */
    Page<Map<String, Object>> getAllQualityList(Map<String, String[]> conditions);
}

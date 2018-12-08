package com.kingweather.fylat_service.service.other;

import java.util.List;
import java.util.Map;

/**
 * 类型相关数据操作-接口
 * Created by handongchen on 2017/10/16.
 */
public interface TypeService {
    /**
     * 查询所有类型
     *
     * @return 类型集合
     */
    List<Map<String, Object>> getAllTypeList();
}

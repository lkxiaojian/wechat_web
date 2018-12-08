package com.kingweather.fylat_service.service.integrationManage;

import java.util.Map;

/**
 * 配置文件-相关业务
 * Created by handongchen on 2017/12/25.
 */
public interface ConfigService {
    /**
     * 新增配置文件
     *
     * @param pageParam 网页传过来的参数
     * @return 结果
     */
    String add(Map<String, Object> pageParam);
}

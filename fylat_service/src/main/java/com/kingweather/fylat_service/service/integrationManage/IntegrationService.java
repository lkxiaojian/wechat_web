package com.kingweather.fylat_service.service.integrationManage;

import com.kingweather.common.util.Page;

import java.io.IOException;
import java.util.Map;

/**
 * 进程信息相关业务
 * Created by handongchen on 2017/12/18.
 */
public interface IntegrationService {
    /**
     * 新增进程
     *
     * @param pageParam 网页传过来的参数
     * @return 结果
     */
    String addIntegration(Map<String, Object> pageParam);

    /**
     * 修改进程信息
     *
     * @param pageParam 网页传过来的参数
     * @return 结果
     */
    String updateIntegration(Map<String, Object> pageParam);

    /**
     * 进程列表
     *
     * @param pageParamForPage 网页传过来的参数
     * @return 进程集合额
     */
    Page<Map<String, Object>> queryIntegrationPage(Map<String, Object> pageParamForPage);

    /**
     * 根据进程编号查询单条记录
     *
     * @param pageParamForPage 网页传过来的参数
     * @return 进程信息
     */
    Map<String, Object> queryIntegrationForId(Map<String, Object> pageParamForPage);

    /**
     * 编译进程
     *
     * @param conditionForPage 网页传过来的参数
     * @return 解压后的目录
     */
    String complieIntegration(Map<String, Object> conditionForPage) throws Exception;

    /**
     * 删除进程信息（包括源码，配置文件等）
     *
     * @param conditionForPage
     * @return
     */
    String deleteIntegration(Map<String, Object> conditionForPage) throws IOException;
}

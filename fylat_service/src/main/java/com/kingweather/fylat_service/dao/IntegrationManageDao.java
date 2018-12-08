package com.kingweather.fylat_service.dao;

import com.kingweather.common.util.Page;

import java.util.List;
import java.util.Map;

/**
 * 进程信息相关数据库操作
 * Created by handongchen on 2017/10/16.
 */
public interface IntegrationManageDao {
    /**
     * 新增进程信息
     *
     * @param args 占位符对应的值
     * @return 执行结果
     */
    int addIntegration(Object[] args);

    /**
     * 根据条件查询进程信息
     *
     * @param condition 查询条件map
     * @return 进程信息集合
     */
    Page<Map<String, Object>> queryIntegrationList(Map<String, Object> condition, String filed, Integer startNum, Integer pageSize);

    /**
     * 查询单条记录
     *
     * @param condition 查询条件
     * @return 单条配置文件信息
     */
    Map<String, Object> queryIntegrationForId(Map<String, Object> condition, String filed);

    /**
     * 修改进程信息
     *
     * @param condition 修改的参数
     * @return 结果
     */
    int update(Map<String, Object> condition);

    /**
     * 删除进程信息（修改进程数据状态）
     *
     * @param args 进程编号集合
     * @return 进程信息集合
     */
    int deleteIntegration(List<Object[]> args);
}

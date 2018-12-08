package com.kingweather.fylat_service.dao;

import javax.jws.Oneway;
import java.util.List;
import java.util.Map;

/**
 * 配置文件-相关数据库操作
 * Created by handongchen on 2017/12/25.
 */
public interface ConfigDao {
    /**
     * 新增配置文件
     *
     * @param args 占位符对应的值
     * @return 结果
     */
    int add(Object[] args);

    /**
     * 修改配置文件
     *
     * @param condition 修改的参数
     * @return 结果
     */
    int update(Map<String, Object> condition);

    /**
     * 读取配置文件
     *
     * @param condition 查询条件
     * @return 单条配置文件信息
     */
    Map<String, Object> queryForIntegration(Map<String, Object> condition, String filed);

    /**
     * 删除配置文件
     *
     * @param args 进程编号集合
     * @return 删除结果
     */
    int delete(List<Object[]> args);
}

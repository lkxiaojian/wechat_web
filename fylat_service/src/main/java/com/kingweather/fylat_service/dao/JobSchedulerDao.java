package com.kingweather.fylat_service.dao;

import com.kingweather.common.util.Page;
import java.util.List;
import java.util.Map;

/**
 * 作业流管理
 * Created by tian on 2017/12/21.
 */
public interface JobSchedulerDao {
    /**
     * 查询当前进程的配置文件信息
     */
    Map<String, Object> getConfig(String interationId);

    /**
     * 已有作业流下的进程信息
     */
    List<Map<String, Object>> userJobProcess(String userName,List<Object> processIdList);

    /**
     *  用户新增作业流入库
     */
    boolean addJobData(String userName,String jobName,String jobType,
                                            String dataStartTime,String dataEndTime,String job_process,String nowTime);

    /**
     *  用户删除当前作业流
     */
    boolean deleteJobData(Map<String, Object> obj);

    /**
     *  当前用户拥有的作业流
     */
    Page<Map<String, Object>> queryJobList(Map<String, Object> condition, String filed, Integer startNum, Integer pageSize);

    /**
     * 新增作业流->选择进程类型->显示类型下所有进程
     */
    Page<Map<String, Object>> queryProcessList(Map<String, Object> condition, String filed, Integer startNum, Integer pageSize);

    /**
    * 数据库m_jobscheduler_manage表更新
    */
    boolean updateJobTable(Map<String, Object> condition);
}

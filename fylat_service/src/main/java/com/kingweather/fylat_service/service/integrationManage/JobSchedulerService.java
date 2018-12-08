package com.kingweather.fylat_service.service.integrationManage;

import com.kingweather.common.util.Page;
import java.text.ParseException;
import java.util.List;
import java.util.Map;

/**
 * 作业流管理
 * Created by tian on 2017/12/21.
 */
public interface JobSchedulerService {

    /**
     * 作业流运行
     */
    void jobRun(Map<String,Object> data);

    /**
     * 解析批处理时间
     */
    Map<String, Object> analyseTime(String startTime, String endTime, String int_id, List<String> intIdList);

    /**
     * 新增作业流->选择进程类型->显示类型下所有进程
     */
    Page<Map<String, Object>> getProcess(Map<String, Object> pageParamForPage);

    /**
     * 查看用户已有作业流下的进程信息
     */
    List<Map<String, Object>> getJobProcess(Map<String, Object> obj);

    /**
     * 用户新增作业流
     */
    boolean addJob(Map<String, Object> obj);
    /**
     * 用户删除作业流
     */
    boolean deleteJob(Map<String, Object> obj);

    /**
     * 用户作业流列表
     */
    Page<Map<String, Object>> queryJobPage(Map<String, Object> pageParamForPage);

    /**
     * 生成配置文件主方法并执行
     *
     * @param jobData 包含（始末时间Map，时间List，配置文件map）
     */
    boolean execMain(Map<String, Object> jobData) throws ParseException;

    /**
     * 设置websockt主题
     */
    void setTopicPath(String topicPath);

    /**
     * 根据文件路径
     * @param path
     * @return
     */
    List<String> getFileList(String path);

    // 回显测试方法
    public void test(String topicPath);
}

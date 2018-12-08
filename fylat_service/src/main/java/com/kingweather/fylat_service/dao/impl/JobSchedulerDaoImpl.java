package com.kingweather.fylat_service.dao.impl;

import com.kingweather.common.jdbc.JdbcUtil;
import com.kingweather.common.util.Page;
import com.kingweather.fylat_service.dao.JobSchedulerDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 作业流管理
 * Created by tian on 2017/12/21.
 */
@Repository
public class JobSchedulerDaoImpl implements JobSchedulerDao{
    @Autowired
    private JdbcUtil jdbcUtil;
    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * 查询当前用户拥有的作业流
     *
     * @param condition
     * @param filed     查询的字段
     * @param startNum
     * @param pageSize
     * @return
     */
    @Override
    public Page<Map<String, Object>> queryJobList(Map<String, Object> condition, String filed, Integer startNum, Integer pageSize) {
        if (null == filed || "".trim().equals(filed)) {
            return null;
        }
        List<Object> args = new ArrayList<Object>();                        //查询参数，占位符的替代
        StringBuilder countSql = new StringBuilder("select count(job_name) ");
        StringBuilder sql = new StringBuilder("SELECT ");
        sql.append(filed);
        //查询的表
        countSql.append("FROM fylat.m_jobscheduler_manage WHERE job_name!=''");
        sql.append(" FROM fylat.m_jobscheduler_manage WHERE job_name!=''");
        //条件拼装
        for (String key : condition.keySet()) {
            if (StringUtils.isEmpty(condition.get(key))){
                continue;
            }
            sql.append(" AND " + key + "?");
            countSql.append(" AND " + key + "?");
            args.add(condition.get(key));
        }
        sql.append(" ORDER BY job_id");
        Page<Map<String, Object>> integrationPage = (Page<Map<String, Object>>) jdbcUtil.queryForPage(startNum, pageSize, countSql.toString(), sql.toString(), args.toArray());
        return integrationPage;
    }

    /**
     * 新增作业流->选择进程类型->显示类型下所有进程
     *
     * @param condition
     * @param filed     查询的字段
     * @param startNum
     * @param pageSize
     * @return
     */
    @Override
    public Page<Map<String, Object>> queryProcessList(Map<String, Object> condition, String filed, Integer startNum, Integer pageSize) {
        if (null == filed || "".trim().equals(filed)) {
            return null;
        }
        List<Object> args = new ArrayList<Object>();                        //查询参数，占位符的替代
        StringBuilder countSql = new StringBuilder("select count(int_id) ");
        StringBuilder sql = new StringBuilder("SELECT ");
        sql.append(filed);
        countSql.append("FROM fylat.m_integration_manage WHERE 1=1");
        sql.append(" FROM fylat.m_integration_manage WHERE 1=1");
        //条件拼装
        for (String key : condition.keySet()) {
            if (StringUtils.isEmpty(condition.get(key))) {
                continue;
            }
            sql.append(" AND " + key + "?");
            countSql.append(" AND " + key + "?");
            args.add(condition.get(key));
        }
        sql.append(" ORDER BY int_id");
        Page<Map<String, Object>> integrationPage = (Page<Map<String, Object>>) jdbcUtil.queryForPage(startNum, pageSize, countSql.toString(), sql.toString(), args.toArray());
        return integrationPage;
    }


    /**
     * 返回当前进程的配置文件信息
     *
     * @param interationId
     * @return
     */
    @Override
    public Map<String, Object> getConfig(String interationId) {
        List<Map<String, Object>> configList = null;
        String sql = "SELECT config_head,config_foot,config_param,config_path FROM fylat.m_config WHERE config_belong_int=?";
        configList = jdbcTemplate.queryForList(sql, new Object[]{interationId});
        return configList.get(0);
    }

    /**
     * 已有作业流下的进程详细信息
     *
     * @param userName
     * @param processIdList
     * @return
     */
    @Override
    public List<Map<String, Object>> userJobProcess(String userName, List<Object> processIdList) {
        List<Map<String, Object>> processList = null;
        String sql = "SELECT int_name,int_version,int_type FROM fylat.m_integration_manage WHERE 1=1";
        for (int i = 0; i < processIdList.size(); i++) {
            if (i > 0) {
                sql += " OR int_id=?";
            } else {
                sql += " AND int_id=?";
            }
        }
        return jdbcTemplate.queryForList(sql, processIdList.toArray());
    }

    /**
     * 用户添加作业流
     *
     * @param userName      当前用户
     * @param jobName       新增作业流名
     * @param jobType       新增作业流类型
     * @param dataStartTime 批处理开始时间
     * @param dataEndTime   批处理结束时间
     * @param process       进程
     * @return
     */
    @Override
    public boolean addJobData(String userName, String jobName, String jobType, String dataStartTime, String dataEndTime, String process, String nowTime) {
        String sql = "insert into fylat.m_jobscheduler_manage(job_user,job_name,job_type,job_data_starttime,job_data_endtime,job_process,job_state,job_createtime)" +
                " values(?, ?, ?, ?, ?, ?, ?, ?)";
        int isUpdate = jdbcTemplate.update(sql, new Object[]{userName, jobName, jobType, dataStartTime, dataEndTime, process, 0, nowTime});
        return (isUpdate != 0);
    }

    /**
     * 用户删除当前作业流
     *
     * @param obj
     * @return
     */
    @Override
    public boolean deleteJobData(Map<String, Object> obj) {
        String sql = "DELETE FROM fylat.m_jobscheduler_manage WHERE job_id=?";
        if (!StringUtils.isEmpty(obj.get("jobId").toString())) {
            int jobId = Integer.parseInt(obj.get("jobId").toString());
            int isUpdate = jdbcTemplate.update(sql, new Object[]{jobId});
            return (isUpdate != 0);
        }
        return false;
    }

    /**
     * 数据库更新m_jobscheduler_manage表
     *
     * @param condition 必须包含job_id和至少一对需要更新的字段和字段值
     * @return
     */
    @Override
    public boolean updateJobTable(Map<String, Object> condition) {
        if (null == condition || StringUtils.isEmpty(condition.get("job_id"))) {
            return false;
        }
        List<Object> args = new ArrayList<Object>();
        StringBuilder sql = new StringBuilder("UPDATE fylat.m_jobscheduler_manage SET ");
        //条件拼装
        for (String key : condition.keySet()) {
            if (condition.get(key)==null || "job_id".equals(key)) {
                continue;
            }
            sql.append("," + key + "=?");
            args.add(condition.get(key));
        }
        sql.append(" WHERE job_id = ?");
        String strSql = sql.toString().replace("SET ,","SET ");
        /**condition中除了job_id外只有一个参数，且传值为null或者只传了job_id,此时sql拼接为：
           "UPDATE fylat.m_jobscheduler_manage SET  WHERE job_id = ?"    返回false
         **/
        if("  ".equals(strSql.substring(strSql.indexOf("SET") + 3, strSql.indexOf("WHERE")))){
            return false;
        }
        args.add(condition.get("job_id"));
        int isUpdate = jdbcTemplate.update(strSql, args.toArray());
        return (isUpdate != 0);
    }
}

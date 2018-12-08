package com.kingweather.fylat_service.dao.impl;

import com.kingweather.common.jdbc.JdbcUtil;
import com.kingweather.common.util.Page;
import com.kingweather.fylat_service.dao.IntegrationManageDao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by handongchen on 2017/12/18.
 */
@Repository
public class IntegrationDaoImpl implements IntegrationManageDao {

    @Resource
    private JdbcTemplate jdbcTemplate;
    @Resource
    private JdbcUtil jdbcUtil;


    @Override
    public int addIntegration(Object[] args) {
        if (args.length < 5) {
            return 0;
        }
        String sql = "INSERT INTO fylat.m_integration_manage (int_id,int_name,int_version,int_version_explain,int_type,int_project_type,int_belong_user,int_src_path,int_language,int_upload_state,int_complie_state,int_download_num,int_state,int_createtime,int_leadtime) values (?,?,?,?,?,?,?,?,?,0,0,0,1,now(),now())";
        return jdbcTemplate.update(sql, args);
    }

    @Override
    public Page<Map<String, Object>> queryIntegrationList(Map<String, Object> condition, String filed, Integer startNum, Integer pageSize) {
        if (null == filed || "".trim().equals(filed)) {
            return null;
        }

        List<Object> args = new ArrayList<Object>();                        //查询参数，占位符的替代

        StringBuilder countSql = new StringBuilder("select count(int_id) ");
        StringBuilder sql = new StringBuilder("SELECT ");
        //查询字段
        sql.append(filed);
        //查询的表
        countSql.append("FROM fylat.m_integration_manage WHERE int_state <> 0");
        sql.append(" FROM fylat.m_integration_manage WHERE int_state <> 0");
        //条件拼装
        for (String key : condition.keySet()) {
            if (null == condition.get(key) || "".equals(condition.get(key))) {
                continue;
            }
            sql.append(" AND " + key + "?");
            countSql.append(" AND " + key + "?");
            args.add(condition.get(key));

        }
        sql.append(" ORDER BY int_leadtime");
        Page<Map<String, Object>> integrationPage = (Page<Map<String, Object>>) jdbcUtil.queryForPage(startNum, pageSize, countSql.toString(), sql.toString(), args.toArray());
        return integrationPage;
    }

    @Override
    public Map<String, Object> queryIntegrationForId(Map<String, Object> condition, String filed) {
        if (null == filed || "".trim().equals(filed)) {
            return null;
        }

        List<Object> args = new ArrayList<Object>();                        //查询参数，占位符的替代

        StringBuilder sql = new StringBuilder("SELECT ");
        //查询字段
        sql.append(filed);
        //查询的表
        sql.append(" FROM fylat.m_integration_manage WHERE int_state <> 0");
        //条件拼装
        for (String key : condition.keySet()) {
            if (null == condition.get(key) || "".equals(condition.get(key))) {
                continue;
            }
            sql.append(" AND " + key + "=?");
            args.add(condition.get(key));

        }
        Map<String, Object> integrationMap = jdbcTemplate.queryForMap(sql.toString(), args.toArray());
        return integrationMap;
    }

    @Override
    public int update(Map<String, Object> condition) {
        if (null == condition || null == condition.get("int_id")) {
            return 0;
        }

        List<Object> args = new ArrayList<Object>();                        //查询参数，占位符的替代

        StringBuilder sql = new StringBuilder("UPDATE fylat.m_integration_manage SET int_leadtime = now()");
        //条件拼装
        for (String key : condition.keySet()) {
            if (null == condition.get(key) || "".equals(condition.get(key)) || "int_id".equals(key)) {
                continue;
            }
            if (null != condition.get(key)) {
                sql.append("," + key + "=?");
                args.add(condition.get(key));
            }


        }
        sql.append(" WHERE int_id = ?");
        args.add(condition.get("int_id"));
        int result = jdbcTemplate.update(sql.toString(), args.toArray());
        return result;
    }

    @Override
    public int deleteIntegration(List<Object[]> args) {
        int result[] = null;
        if (null == args || 0 == args.size()) {
            return result.length;
        }
        String sql = "UPDATE fylat.m_integration_manage SET int_state = 0 WHERE int_id = ?";
        result = jdbcTemplate.batchUpdate(sql, args);
        return result.length;
    }
}

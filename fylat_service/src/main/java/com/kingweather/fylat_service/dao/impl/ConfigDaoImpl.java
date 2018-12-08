package com.kingweather.fylat_service.dao.impl;

import com.kingweather.common.util.Page;
import com.kingweather.fylat_service.dao.ConfigDao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by handongchen on 2017/12/25.
 */
@Repository
public class ConfigDaoImpl implements ConfigDao {
    @Resource
    private JdbcTemplate jdbcTemplate;

    @Override
    public int add(Object[] args) {
        if (args.length < 5) {
            return 0;
        }
        String sql = "INSERT INTO fylat.m_config (config_head,config_foot,config_param,config_path,config_belong_int) values (?,?,?,?,?)";
        return jdbcTemplate.update(sql, args);
    }

    @Override
    public int update(Map<String, Object> condition) {
        if (null == condition || null == condition.get("config_belong_int")) {
            return 0;
        }

        List<Object> args = new ArrayList<Object>();                        //查询参数，占位符的替代

        StringBuilder sql = new StringBuilder("UPDATE fylat.m_config SET config_belong_int = '" + condition.get("config_belong_int") + "'");
        //条件拼装
        for (String key : condition.keySet()) {
            if (null == condition.get(key) || "".equals(condition.get(key)) || "config_belong_int".equals(key)) {
                continue;
            }
            sql.append("," + key + "=?");
            args.add(condition.get(key));

        }
        sql.append(" WHERE config_belong_int = ?");
        args.add(condition.get("config_belong_int"));
        int result = jdbcTemplate.update(sql.toString(), args.toArray());
        return result;
    }

    @Override
    public Map<String, Object> queryForIntegration(Map<String, Object> condition, String filed) {
        if (null == filed || "".trim().equals(filed)) {
            return null;
        }

        List<Object> args = new ArrayList<Object>();                        //查询参数，占位符的替代

        StringBuilder sql = new StringBuilder("SELECT ");
        //查询字段
        sql.append(filed);
        //查询的表
        sql.append(" FROM fylat.m_config WHERE 1=1");
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
    public int delete(List<Object[]> args) {
        int result[] = null;
        if (null == args || 0 == args.size()) {
            return result.length;
        }
        String sql = "DELETE FROM fylat.m_config  WHERE config_belong_int = ?";
        result = jdbcTemplate.batchUpdate(sql, args);
        return result.length;
    }
}

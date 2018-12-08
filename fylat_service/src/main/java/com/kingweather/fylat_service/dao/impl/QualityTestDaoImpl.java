package com.kingweather.fylat_service.dao.impl;

import com.kingweather.common.jdbc.JdbcUtil;
import com.kingweather.common.util.Page;
import com.kingweather.fylat_service.dao.QualityTestDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 质量检测（目视，异源，不同类型）模块-相关数据操作-实现类
 * Created by handongchen on 2017/10/20.
 */
@Repository
public class QualityTestDaoImpl implements QualityTestDao {

    @Autowired
    private JdbcUtil jdbcUtil;

    @Override
    public Page<Map<String, Object>> getAllQualityList(Map<String, String[]> conditions) {
        Integer startNum = Integer.valueOf(conditions.get("pageNumber")[0]); //开始索引
        Integer pageSize = Integer.valueOf(conditions.get("pageSize")[0]); //每页大小
        List<Object> args = new ArrayList<Object>();                        //查询参数，占位符的替代
        StringBuilder sql = new StringBuilder("SELECT ");
        StringBuilder countSql = new StringBuilder("select count(qua_id) ");
        //查询字段
        sql.append("* ");
        //查询的表
        sql.append("FROM fylat.m_quailty_test WHERE 1=1");
        countSql.append("FROM fylat.m_quailty_test WHERE 1=1");
        //条件拼装
        if (conditions != null && !"".equals(conditions)) {
            if (null != conditions.get("type_id") && !"".equals(conditions.get("type_id"))) {
                //类型
                sql.append(" AND qua_type = ?");
                countSql.append(" AND qua_type = ?");
                args.add(conditions.get("type_id"));
            }
            if (null != conditions.get("starttime") && !"".equals(conditions.get("starttime"))) {
                //时间范围
                sql.append(" AND qua_datetime >= ? ::timestamp and qua_datetime <= ? ::timestamp");
                countSql.append(" AND qua_datetime >= ? ::timestamp and qua_datetime <= ? ::timestamp");
                args.add(conditions.get("starttime")[0]);
                args.add(conditions.get("endtime")[0]);
            }
            if (null != conditions.get("source") && !"".equals(conditions.get("source"))) {
                //数据源
                sql.append(" AND qua_source = ?");
                countSql.append(" AND qua_source = ?");
                args.add(conditions.get("source")[0]);
            }
            if (null != conditions.get("conf_url") && !"".equals(conditions.get("conf_url"))) {
                //配置文件目录
                sql.append(" AND qua_conf_url = ?");
                countSql.append(" AND qua_conf_url = ?");
                args.add(conditions.get("conf_url")[0]);
            }
        }
        Page<Map<String, Object>> QualityTestList = (Page<Map<String, Object>>) jdbcUtil.queryForPage(startNum, pageSize, countSql.toString(),sql.toString(), args.toArray());

        return QualityTestList;
    }
}
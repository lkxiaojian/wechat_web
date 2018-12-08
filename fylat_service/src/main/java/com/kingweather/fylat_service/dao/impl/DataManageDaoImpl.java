package com.kingweather.fylat_service.dao.impl;

import com.kingweather.common.jdbc.JdbcUtil;
import com.kingweather.common.util.Page;
import com.kingweather.fylat_service.dao.DataManageDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 数据管理模块-相关数据操作-实现类
 * Created by handongchen on 2017/10/17.
 */
@Repository
public class DataManageDaoImpl implements DataManageDao {

    @Autowired
    private JdbcUtil jdbcUtil;

    @Override
    public Page<Map<String, Object>> getDataManageList(Map<String, Object> conditions) {
        Integer startNum = Integer.valueOf(conditions.get("startNum").toString()); //开始索引
        Integer pageSize = Integer.valueOf(conditions.get("pageSize").toString()); //每页大小
        List<Object> args = new ArrayList<Object>();                        //查询参数，占位符的替代

        StringBuilder countSql = new StringBuilder("select count(data_id) ");
        StringBuilder sql = new StringBuilder("SELECT ");
        //查询字段
        sql.append("data_id,data_name,data_type_id,data_expand1 ");
        //查询的表
        countSql.append("FROM m_data_manage WHERE 1=1");
        sql.append("FROM m_data_manage WHERE 1=1");
        //条件拼装
        if(conditions != null && !"".equals(conditions)){
            if(null != conditions.get("type_id") && !"".equals(conditions.get("type_id"))){
                countSql.append(" AND data_type_id = ?");
                sql.append(" AND data_type_id = ?");
                args.add(conditions.get("type_id"));
            }
        }

        Page<Map<String, Object>> dataManageList = (Page<Map<String, Object>>) jdbcUtil.queryForPage(startNum,pageSize,countSql.toString(),sql.toString(),args);
        return dataManageList;
    }
}

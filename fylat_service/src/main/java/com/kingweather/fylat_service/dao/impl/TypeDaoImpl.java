package com.kingweather.fylat_service.dao.impl;

import com.kingweather.fylat_service.dao.TypeDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * 类型相关数据操作-实现类
 * Created by handongchen on 2017/10/16.
 */
@Repository
public class TypeDaoImpl implements TypeDao {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public List<Map<String, Object>> getAllTypeList() {
        String sql = "select " +
                "type_id,type_name,type_nickname" +
                " from fylat.m_type";
        List<Map<String, Object>> typeList = (List<Map<String, Object>>) jdbcTemplate.queryForList(sql, new Object[]{});
        return typeList;
    }
}

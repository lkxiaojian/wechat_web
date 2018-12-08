package com.kingweather.system.dao.manager.impl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.stereotype.Repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kingweather.common.jdbc.JdbcUtil;
import com.kingweather.common.util.Page;
import com.kingweather.system.dao.manager.AppManagerDao;
import com.kingweather.system.manager.domain.App;
import com.kingweather.system.manager.domain.AppType;
import com.kingweather.system.manager.domain.ResourceType;



/**
 * 应用管理
 */
@Repository
public class AppManagerDaoImpl implements AppManagerDao
{

    @Autowired
    private JdbcUtil jdbcUtil;
    @Autowired
    private JdbcTemplate jdbcTemplate;


    @Override
    public boolean delete(String id)
    {
        String sql = "delete from insure.resource_table where id = ? ";
        int isUpdate = jdbcTemplate.update(sql, new Object[]{id});
        return (isUpdate != 0);
    }

//    @Override
//    public boolean modify(String id, App app)
//    {
//        PGobject po = new PGobject();
//        po.setType("json");
//        try
//        {
//            po.setValue((new ObjectMapper()).writeValueAsString(app.getProperty()));
//        }
//        catch (Exception e)
//        {
//            e.printStackTrace();
//        }
//        String sql = "update insure.resource_table set name=?,property = ? where id = ?";
//        int isUpdate = jdbcUtil.update(sql, new Object[]{app.getName(),po, id});
//        return isUpdate != 0;
//    }

    @Override
    public App findById(String id)
    {
        String sql = "select * from insure.resource_table where id = ?";
        Map<String, Object> map = jdbcTemplate.queryForMap(sql, new Object[]{id});
        App app = new App();
        app.setId(String.valueOf(map.get("id")));
        app.setName(String.valueOf(map.get("name")));
        app.setStatus(Integer.valueOf(map.get("status").toString()));
        app.setProperty(String.valueOf(map.get("property")));
        return app;
    }

    @Override
    public boolean lock(String id)
    {
        String sql = "update insure.resource_table set status = ? where id = ?";
        int isUpdate = jdbcTemplate.update(sql, new Object[]{AppType.LOCK.getCode(), id});
        return isUpdate != 0;
    }

    @Override
    public boolean open(String id)
    {
        String sql = "update insure.resource_table set status = ? where id = ?";
        int isUpdate = jdbcTemplate.update(sql, new Object[]{AppType.NORMAL.getCode(), id});
        return isUpdate != 0;
    }

    @Override
    public boolean waitOpen(String id)
    {
        String sql = "update insure.resource_table set status = ? where id = ?";
        int isUpdate = jdbcTemplate.update(sql, new Object[]{AppType.WAITOPEN.getCode(), id});
        return isUpdate != 0;
    }
    //取得租户sequence值
    private String hireserial(){
    	String sql = "SELECT nextval('insure.hireserial') as nextv;";
    	Long num = jdbcTemplate.query(sql, new ResultSetExtractor<Long>(){

			@Override
			public Long extractData(ResultSet rs) throws SQLException,
					DataAccessException {
				if(rs.next()){
					return rs.getLong("nextv");
				}
				return 0L;
			}
    	});
    	return  num+"";
    }



    @Override
    public Page<Map<String, Object>> list(Map<String, Object> condition, String startNum, String pageSize)
    {
        String sql = "select id,name,type,status,property from insure.resource_table where  type = 2";
        String countSql = "select count(*) from insure.resource_table where  type = 2";

        if (null != condition.get("enterprise_id") && !condition.get("enterprise_id").toString().isEmpty())
        {
            String tempSql = " and parent_id = '" + condition.get("enterprise_id").toString() + "' ";
            sql += tempSql;
            countSql = countSql + tempSql;
        }
        if(condition.get("name")!=null && StringUtils.isNotEmpty(condition.get("name").toString())){
            String tempSql = " and name like '%" + condition.get("name")+"%'";
            sql += tempSql;
            countSql = countSql + tempSql;
        }

        if (null != condition.get("domain") && !condition.get("domain").toString().isEmpty())
        {
            String tempSql = " and property->>'domain' like '%" + condition.get("domain") + "%'";
            sql += tempSql;
            countSql = countSql + tempSql;
        }

        if (null != condition.get("status") && !condition.get("status").toString().isEmpty() && !condition.get("status").toString().equals("0"))
        {
            String tempSql = " and status = " + condition.get("status");
            sql += tempSql;
            countSql = countSql + tempSql;
        }
        if(!StringUtils.isEmpty(condition.get("pid").toString())){
            String tempSql = " and parent_id = '" + condition.get("pid")+"'";
            sql += tempSql;
            countSql = countSql + tempSql;
        }
        sql += "order by opt_date desc";

        Page<Map<String, Object>> page = jdbcUtil.queryForPage(Integer.valueOf(startNum), Integer.valueOf(pageSize), countSql, sql, new Object[]{});
        return page;
    }
}
package com.kingweather.system.dao.manager.impl;


import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.kingweather.common.jdbc.JdbcUtil;
import com.kingweather.common.util.Page;
import com.kingweather.system.dao.manager.LogManagerDao;
import com.kingweather.system.manager.domain.Log;


/**
 * 日志管理
 */
@Repository
public class LogManagerDaoImpl implements LogManagerDao
{
    @Autowired
    private JdbcUtil jdbcUtil;
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public Page<Map<String, Object>> logs(Map<String, Object> condition, String startNum, String pageSize)
    {
        String type = condition.get("type").toString();

        String sql = "select account,ip_address,operation_type,state,operation_date,property from insure.tbl_logs  where 1=1 ";
        String countSql = "select count(account) from insure.tbl_logs where 1=1 ";

//        if (null != condition.get("domain") && !condition.get("domain").toString().isEmpty()){
//            String tempSql = " and domain = '" + condition.get("domain") + "'";
//            sql += tempSql;
//            countSql = countSql + tempSql;
//        }
        if(!StringUtils.isEmpty(type) && !"0".equals(type)){
        	sql +=  " and type='"+ type +"'";
        	countSql += " and type='"+ type +"'";
        }
        if (null != condition.get("account") && !condition.get("account").toString().isEmpty()){
            String tempSql = " and account like '%" + condition.get("account") + "%'";
            sql += tempSql;
            countSql = countSql + tempSql;
        }

        if (null != condition.get("state") && !condition.get("state").toString().isEmpty() 
        		&& !condition.get("state").toString().equals("2")){
            String tempSql = " and state = " + condition.get("state");
            sql += tempSql;
            countSql = countSql + tempSql;
        }

        if (null != condition.get("operation_type") && !condition.get("operation_type").toString().isEmpty() && !condition.get("operation_type").toString().equals("0"))
        {
            String tempSql = " and operation_type = " + condition.get("operation_type");
            sql += tempSql;
            countSql = countSql + tempSql;
        }

        if (null != condition.get("startDate") && !condition.get("startDate").toString().isEmpty() && null != condition.get("endDate") && !condition.get("endDate").toString().isEmpty())
        {
            String tempSql = " and operation_date BETWEEN '" + condition.get("startDate") + "' AND  '" + condition.get("endDate") + "'";
            sql += tempSql;
            countSql = countSql + tempSql;
        }
        sql += " order by operation_date DESC ";

        Page<Map<String, Object>> page = jdbcUtil.queryForPage(Integer.valueOf(startNum), Integer.valueOf(pageSize), countSql, sql, new Object[]{});
        return page;

    }

    @Override
    public boolean insertLog(Log log)
    {

        String sql = "insert into zz_wechat.tbl_logs(type,account,operation_type,operation_date,state,property,ip_address,domain) values(?,?,?,?,?,?,?,?)";
        int isUpdate = 0;
        try {
//			isUpdate = jdbcTemplate.update(sql, new Object[]{1, log.getAccount(), log.getOperateType().getCode(), log.getOperateDate(), log.getOperateState().getCode(), log.getProperty(), log.getIp(), log.getDomain()});
		} catch (Exception e) {
			e.printStackTrace();
		}
        return (isUpdate != 0);
    }
}

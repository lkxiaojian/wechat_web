package com.kingweather.we_chat.dao.iml;

import com.kingweather.we_chat.dao.UserMenuDao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.util.List;

/**
 * Description: fylat_service
 * Created by s on 2019/1/29 9:45
 */
@Repository
public class UserMenuDaoImp implements UserMenuDao {

    @Resource
    private JdbcTemplate jdbcTemplate;

    @Override
    public List getMenuTree(String parentId) {

        String sql = "SELECT menu_id id ,menu_name lobel,parent_id parentId FROM sys_menu WHERE parent_id = ? ";

        List list = jdbcTemplate.queryForList(sql,new Object[]{parentId});
        return list;
    }
}

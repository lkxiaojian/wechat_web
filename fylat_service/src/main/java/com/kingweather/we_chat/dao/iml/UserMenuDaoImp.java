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

    @Override
    public int addUserReMenu(String str) throws Exception {
        String[] s = str.split("_");
        String sql = "INSERT INTO sys_user_re_menu (id,user_id,menu_id) VALUES (?,?,?)";
        return jdbcTemplate.update(sql,new Object[]{str,s[0],s[1]});
    }

    @Override
    public int removeUserReMenu(String str) {

        String sql ="DELETE FROM sys_user_re_menu WHERE id = ? ";
        return jdbcTemplate.update(sql,new Object[]{str});
    }
}

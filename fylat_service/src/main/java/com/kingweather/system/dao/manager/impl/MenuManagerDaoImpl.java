package com.kingweather.system.dao.manager.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.kingweather.common.jdbc.JdbcUtil;
import com.kingweather.common.util.UtilString;
import com.kingweather.system.dao.manager.MenuManagerDao;
import com.kingweather.system.manager.domain.Menu;


/**
 * 菜单管理
 */
@Repository
public class MenuManagerDaoImpl implements MenuManagerDao {

    @Autowired
    private JdbcUtil jdbcUtil;
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> getAllMenu(String menuSatus) {
//		String sql = "select row_number() over(partition by parent_id order by menu_sort),menu_id,menu_name,action_url,parent_id,menu_sort,img_flag,subnode_flag,status,user_group_suffix from zz_wechat.sys_menu";
        String sql = " select( @rowNO :=@rowNo +1)AS row_number,menu_id, menu_name, action_url, parent_id, menu_sort, img_flag, subnode_flag," +
                "status, user_group_suffix from zz_wechat.sys_menu, (select @rowNO :=0)b ";

        if (!"".equals(menuSatus) && menuSatus != null) {
            sql = sql + " where status=" + Integer.parseInt(menuSatus);
        }
        List<Map<String, Object>> menuList =
                (List<Map<String, Object>>) jdbcTemplate.queryForList(sql, new Object[]{});
        return menuList;
    }

    public boolean addMenu(Menu menu) {
        String sql = "insert into insure.sys_menu(menu_name,action_url,parent_id,menu_sort,img_flag,subnode_flag,status,user_group_suffix) values(?,?,?,?,?,?,?,?)";
        int isUpdate = jdbcTemplate.update(sql,
                new Object[]{
                        menu.getMenuName(),
                        menu.getActionUrl(),
                        Long.parseLong(menu.getParentId()),
                        menu.getMenuSort(),
                        menu.getImgFlag(),
                        menu.getSubnodeFlag(),
                        menu.getStatus(),
                        menu.getUserGroupSuffix()
                });
        String querySql = "select menu_id from insure.sys_menu where menu_name=?";
        Map<String, Object> menuItem = jdbcTemplate.queryForMap(querySql, new Object[]{menu.getMenuName()});
        String insertSql = "insert into insure.sys_role_menu values (1,?)";
        int isUpdate2 = jdbcTemplate.update(insertSql, new Object[]{menuItem.get("menu_id")});

        return (isUpdate != 0 && isUpdate2 != 0);
    }

    public boolean editMenu(Menu menu) {
        String sql = "update insure.sys_menu set menu_name=?,action_url=?,menu_sort=?,img_flag=?,subnode_flag=?,status=? where menu_id=?";
        int isUpdate = jdbcTemplate.update(sql,
                new Object[]{
                        menu.getMenuName(),
                        menu.getActionUrl(),
                        menu.getMenuSort(),
                        menu.getImgFlag(),
                        menu.getSubnodeFlag(),
                        menu.getStatus(),
                        Long.parseLong(menu.getMenuId())
                });
        return (isUpdate != 0);
    }

    public boolean deleteMenu(String[] menuIdStrs) {
        Long[] menuIds = UtilString.strArrConvertToLongArr(menuIdStrs);
        StringBuffer sqlInAppend = new StringBuffer();
        for (int i = 0; i < menuIds.length; i++) {
            sqlInAppend.append("?");
            if (i != menuIds.length - 1) {
                sqlInAppend.append(",");
            }
        }
        String sql = "delete from insure.sys_menu where menu_id in (" + sqlInAppend.toString() + ")";
        try {
            int isUpdate = jdbcTemplate.update(sql, menuIds);
        } catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace();
            return false;
        }
        return true;
    }

    public boolean deleteUserMenu(String[] menuIdStrs) {
        Long[] menuIds = UtilString.strArrConvertToLongArr(menuIdStrs);
        StringBuffer sqlInAppend = new StringBuffer();
        for (int i = 0; i < menuIds.length; i++) {
            sqlInAppend.append("?");
            if (i != menuIds.length - 1) {
                sqlInAppend.append(",");
            }
        }
        String sql = "delete from insure.sys_user_menu where menu_id in (" + sqlInAppend.toString() + ")";
        try {
            int isUpdate = jdbcTemplate.update(sql, menuIds);
        } catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace();
            return false;
        }
        return true;
    }

    public boolean deleteRoleMenu(String[] menuIdStrs) {
        Long[] menuIds = UtilString.strArrConvertToLongArr(menuIdStrs);
        StringBuffer sqlInAppend = new StringBuffer();
        for (int i = 0; i < menuIds.length; i++) {
            sqlInAppend.append("?");
            if (i != menuIds.length - 1) {
                sqlInAppend.append(",");
            }
        }
        String sql = "delete from insure.sys_role_menu where menu_id in (" + sqlInAppend.toString() + ")";
        try {
            int isUpdate = jdbcTemplate.update(sql, menuIds);
        } catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace();
            return false;
        }
        return true;
    }
}

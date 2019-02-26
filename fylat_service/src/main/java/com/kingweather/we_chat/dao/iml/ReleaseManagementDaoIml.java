package com.kingweather.we_chat.dao.iml;

import com.kingweather.we_chat.dao.ReleaseManagementDao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;

@Repository
public class ReleaseManagementDaoIml implements ReleaseManagementDao {
    @Resource
    private JdbcTemplate jdbcTemplate;

    @Override
    public List<Map> getTypeMenuTree(String parent_id) {

        String sql = "select article_type_id,article_type_name,article_type_keyword,iamge_icon,iamge_back,parentid from zz_wechat.article_type_tmp where del_type!=? and parentid=?";
        List maps = jdbcTemplate.queryForList(sql, new Object[]{
                1, parent_id

        });

        return maps;
    }

    @Override
    public Map getTypeMessage(String article_type_id) {

        String sql = "select article_type_id,article_type_name,article_type_keyword,iamge_icon,iamge_back,parentid from zz_wechat.article_type_tmp where del_type!=? and article_type_id=?";

        Map maps = jdbcTemplate.queryForMap(sql, new Object[]{
                1, article_type_id

        });
        return maps;
    }
}

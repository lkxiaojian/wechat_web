package com.kingweather.we_chat.dao.iml;

import com.kingweather.common.util.Md5Utils;
import com.kingweather.we_chat.dao.WebSysUserDao;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class WebSysUserDaoIml implements WebSysUserDao {

    @Resource
    private JdbcTemplate jdbcTemplate;

    @Override
    public int addUser(Map<String, Object> info)throws Exception {

        StringBuffer sql =  new StringBuffer();
        sql.append("  	INSERT INTO zz_wechat.sys_user 		 ");
        sql.append("  		(tel_phone, 	 ");
        sql.append("  		nick_name,  	 ");
        sql.append("  		user_sex, 	 ");
        sql.append("  		create_time, 	 ");
        sql.append("  		PASSWORD, 	 ");
        sql.append("  		STATUS)	 ");
        sql.append("  		VALUES	 ");
        sql.append("  		(?,?,?,now(),?,1)	 ");

        int i = jdbcTemplate.update(sql.toString(), new Object[]{
                info.get("telPhone"),
                info.get("name"),
                info.get("userSex"),
                Md5Utils.encode2hex(info.get("pass").toString())
        });
        return i;
    }

    @Override
    public int removeUser(String id)throws Exception {
        String sql = "delete from sys_user where id = ?";
        return jdbcTemplate.update(sql,new Object[]{id});
    }

    @Override
    public int updUser(Map<String, Object> info) throws Exception{
        StringBuffer sql =  new StringBuffer();
        List list = new ArrayList();
        String telPhone =   info.get("telPhone")==null?"":info.get("telPhone").toString();
        String name =   info.get("name")==null?"":info.get("name").toString();
        String userSex =   info.get("userSex")==null?"":info.get("userSex").toString();
        String pass =   info.get("pass")==null?"":info.get("pass").toString();

        sql.append("  	UPDATE zz_wechat.sys_user 	 ");
        sql.append("  	SET	 ");
        if(telPhone!=null&&!"".equals(telPhone)){
            sql.append("  	tel_phone = ? , 	 ");
            list.add(telPhone);
        }
        if(name!=null&&!"".equals(name)){
            sql.append("  	nick_name = ? , 	 ");
            list.add(name);
        }
        if(userSex!=null&&!"".equals(userSex)){
            sql.append("  	user_sex = ? , 	 ");
            list.add(userSex);
        }
        if(pass!=null&&!"".equals(pass)){
            sql.append("  	PASSWORD = ? , 	 ");
            list.add( Md5Utils.encode2hex((pass)));
        }
        sql.append("  	update_time = now() 	 ");
        sql.append("  	WHERE	 ");
        sql.append("  	id = ? 	 ");
        list.add(info.get("id"));
        int i = jdbcTemplate.update(sql.toString(), list.toArray());
        return i;
    }

    @Override
    public Map selUser(Map<String, Object> info) throws Exception{

        Map map = new HashMap();
        String page =   info.get("page")==null?"":info.get("page").toString();
        String size =   info.get("size")==null?"":info.get("size").toString();
        String telPhone =   info.get("telPhone")==null?"":info.get("telPhone").toString();
        String name =   info.get("name")==null?"":info.get("name").toString();
        String userSex =   info.get("userSex")==null?"":info.get("userSex").toString();

        StringBuffer sql =  new StringBuffer();
        StringBuffer sqlCount =  new StringBuffer();
        List list = new ArrayList();
        List listCount = new ArrayList();

        sql.append("  	SELECT 	 ");
        sql.append("  	tel_phone telPhone, 	 ");
        sql.append("  	nick_name name, 	 ");
        sql.append("  	user_sex userSex, 	 ");
        sql.append("  	date_format(create_time,'%Y-%m-%d %H:%i:%S') createTime, 	 ");
        sql.append("  	date_format(update_time,'%Y-%m-%d %H:%i:%S') updateTime	 ");
        sql.append("  	FROM 	 ");
        sql.append("  	zz_wechat.sys_user WHERE STATUS= 1	 ");

        sqlCount.append("  	SELECT 	 ");
        sqlCount.append("  	count(id) num	 ");
        sqlCount.append("  	FROM 	 ");
        sqlCount.append("  	zz_wechat.sys_user WHERE STATUS= 1	 ");

        if(telPhone!=null&&!"".equals(telPhone)){
            sql.append("  	and tel_phone like ?  	 ");
            list.add(telPhone+"%");
            sqlCount.append("  	and tel_phone like ?  	 ");
            listCount.add(telPhone+"%");

        }
        if(name!=null&&!"".equals(name)){
            sql.append("  and nick_name like ?  	 ");
            list.add(name+"%");
            sqlCount.append("  and nick_name like ?  	 ");
            listCount.add(name+"%");

        }
        if(userSex!=null&&!"".equals(userSex)){
            sql.append("  and user_sex = ?  	 ");
            list.add(userSex);
            sqlCount.append("  and user_sex = ?  	 ");
            listCount.add(userSex);

        }


        list.add((Integer.valueOf(page)-1)*Integer.valueOf(size));
        list.add(Integer.valueOf(size));
        sql.append("  	LIMIT ?, ? 	 ");
        List listData = jdbcTemplate.queryForList(sql.toString(),list.toArray());
        map.put("data",listData);

        Map mapCount = jdbcTemplate.queryForMap(sqlCount.toString(),listCount.toArray());
        map.put("num",Integer.valueOf( mapCount.get("num").toString() ));
        return map;
    }

    @Override
    public int verifyLogin(String name, String pass)throws Exception {
        String sql = "select count(id) num from sys_user where nick_name=? and PASSWORD=?";
        Map map = jdbcTemplate.queryForMap(sql,new Object[]{name,Md5Utils.encode2hex(pass)});
        return Integer.valueOf( map.get("num").toString() );
    }

    @Override
    public int verifyName(String name) throws Exception{
        String sql = "select count(id) num from sys_user where nick_name = ?";
        Map map = jdbcTemplate.queryForMap(sql,new Object[]{name});
        return Integer.valueOf( map.get("num").toString() );
    }
}

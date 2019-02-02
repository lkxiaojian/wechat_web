package com.kingweather.we_chat.dao;

import java.util.List;
import java.util.Map;

public interface WebSysUserDao {

    public int addUser(Map<String, Object> info)throws Exception;

    public int removeUser(String id)throws Exception;

    public int updUser(Map<String, Object> info)throws Exception;

    public List selUser(Map<String, Object> info)throws Exception;

    public int verifyLogin(String name,String pass)throws Exception;

    public int verifyName(String name)throws Exception;

}

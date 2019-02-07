package com.kingweather.we_chat.service;

import java.util.List;
import java.util.Map;

public interface WebSysUserService {

    public int addUser(Map<String, Object> info) throws Exception;

    public int removeUser(List<String> list)throws Exception;

    public int updUser(Map<String, Object> info)throws Exception;

    public Map selUser(Map<String, Object> info)throws Exception;

    public int verifyLogin(String name,String pass)throws Exception;

    public int verifyName(String name)throws Exception;


}

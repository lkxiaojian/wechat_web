package com.kingweather.we_chat.service.iml;

import com.kingweather.we_chat.dao.WebSysUserDao;
import com.kingweather.we_chat.service.WebSysUserService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;
@Service
public class WebSysUserServiceIml implements WebSysUserService {

    @Resource
    private WebSysUserDao webSysUserDaoIml;

    @Override
    public int addUser(Map<String, Object> info) throws Exception{

        return webSysUserDaoIml.addUser(info);
    }

    @Override
    public int removeUser(List<String> list)throws Exception {
        int i =0;
        for (String s : list) {
            i+=webSysUserDaoIml.removeUser(s);
        }
        return i;
    }

    @Override
    public int updUser(Map<String, Object> info) throws Exception{
        return webSysUserDaoIml.updUser(info);
    }

    @Override
    public List selUser(Map<String, Object> info)throws Exception {
        return webSysUserDaoIml.selUser(info);
    }

    @Override
    public int verifyLogin(String name, String pass) throws Exception{
        return webSysUserDaoIml.verifyLogin(name,pass);
    }

    @Override
    public int verifyName(String name) throws Exception{
        return webSysUserDaoIml.verifyName(name);
    }
}

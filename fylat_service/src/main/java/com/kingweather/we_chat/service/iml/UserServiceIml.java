package com.kingweather.we_chat.service.iml;

import com.kingweather.we_chat.dao.userDao;
import com.kingweather.we_chat.service.UserService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.Map;

@Service
public class UserServiceIml implements UserService {
    @Resource
    private userDao userDao;

    @Override
    public Map<String, Object> registerUser(Map<String, Object> userData) {
        return userDao.registerUser(userData);
    }

    @Override
    public Map<String, Object> getIndexMessage(String wechatid,int page) {
        return userDao.getIndexMessage(wechatid,page);
    }

    @Override
    public Map<String, Object> setAttention(String wechatid, String attentions,String type) {
        return userDao.setAttention(wechatid,attentions,type);
    }
}

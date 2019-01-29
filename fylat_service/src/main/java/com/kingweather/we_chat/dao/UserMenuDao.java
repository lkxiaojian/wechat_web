package com.kingweather.we_chat.dao;

import java.util.List;

/**
 * Description: fylat_service
 * Created by s on 2019/1/29 9:45
 */
public interface UserMenuDao {

    public List getMenuTree(String parentId);
}

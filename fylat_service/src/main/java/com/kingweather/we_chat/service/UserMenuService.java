package com.kingweather.we_chat.service;

import java.util.List;

/**
 * Description: fylat_service
 * Created by s on 2019/1/29 9:44
 */
public interface UserMenuService {

    public List getMenuTree();

    public int addUserReMenu(List<String> list);

    public int removeUserReMenu(List<String> list);
}

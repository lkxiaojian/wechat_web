package com.kingweather.we_chat.dao;

import java.util.List;
import java.util.Map;

public interface ReleaseManagementDao {
    List<Map> getTypeMenuTree(String s);

    Map getTypeMessage(String article_type_id);
}

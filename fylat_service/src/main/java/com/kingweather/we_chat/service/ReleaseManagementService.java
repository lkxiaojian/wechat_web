package com.kingweather.we_chat.service;

import java.util.List;
import java.util.Map;

public interface ReleaseManagementService {
    List getTypeMenuTree();

    Map getTypeMessage(String article_type_id);
}

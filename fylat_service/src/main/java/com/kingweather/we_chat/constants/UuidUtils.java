package com.kingweather.we_chat.constants;

import java.util.UUID;

public class UuidUtils {

    public static String getUUid() {
        return UUID.randomUUID().toString().replaceAll("-", "");
    }
}

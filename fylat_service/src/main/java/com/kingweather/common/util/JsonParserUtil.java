package com.kingweather.common.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;

/**
 * Created by sunfengju on 15/5/12.
 */
public class JsonParserUtil
{
    /**
     * 解析json为json树
     *
     * @param json
     * @return
     */
    public static JsonNode parseJson(String json)
    {
        ObjectMapper objectMapper = new ObjectMapper();
        try
        {
            return objectMapper.readTree(json);
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 对象生成json
     *
     * @param obj
     * @return
     */
    public static String toJson(Object obj)
    {
        ObjectMapper objectMapper = new ObjectMapper();
        try
        {
            return objectMapper.writeValueAsString(obj);
        }
        catch (JsonProcessingException e)
        {
            e.printStackTrace();
        }
        return null;
    }
}

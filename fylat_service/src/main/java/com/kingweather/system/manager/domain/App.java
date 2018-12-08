package com.kingweather.system.manager.domain;

import com.fasterxml.jackson.databind.JsonNode;
import com.kingweather.common.util.JsonParserUtil;

/**
 * 应用
 */
public class App
{
    private String   id;
    private String   parentId;
    private String   name;
    private String   domain;
    private Integer  status;
    private JsonNode property;
    private String   remark;
    private String   ip;

    public String getId()
    {
        return id;
    }

    public void setId(String id)
    {
        this.id = id;
    }

    public String getParentId()
    {
        return parentId;
    }

    public void setParentId(String parentId)
    {
        this.parentId = parentId;
    }

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
    }

    public String getDomain()
    {
        return domain;
    }

    public void setDomain(String domain)
    {
        this.domain = domain;
    }

    public Integer getStatus()
    {
        return status;
    }

    public void setStatus(Integer status)
    {
        this.status = status;
    }

    public JsonNode getProperty()
    {
        if (null == property)
        {
            property = JsonParserUtil.parseJson("{}");
        }
        return property;
    }

    public void setProperty(String property)
    {
        this.property = JsonParserUtil.parseJson(property);
        if (null != this.property)
        {
            this.remark = this.property.get("remark") == null ? "" : this.property.get("remark").asText();
            this.ip = this.property.get("ip") == null ? "" : this.property.get("ip").asText();
            this.domain = this.property.get("domain") == null ? "" : this.property.get("domain").asText();
        }
    }

    public void setProperty(Object property)
    {
        this.property = JsonParserUtil.parseJson(JsonParserUtil.toJson(property));
        if (null != this.property)
        {
            this.remark = this.property.get("remark") == null ? "" : this.property.get("remark").asText();
            this.ip = this.property.get("ip") == null ? "" : this.property.get("ip").asText();
            this.domain = this.property.get("domain") == null ? "" : this.property.get("domain").asText();
        }
    }

    public String getIp()
    {
        return ip;
    }

    public void setIp(String ip)
    {
        this.ip = ip;
    }

    public String getRemark()
    {
        return remark;
    }

    public void setRemark(String remark)
    {
        this.remark = remark;
    }

}
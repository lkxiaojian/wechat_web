package com.kingweather.system.manager.domain;

/**
 * 资源
 */
public class Resource
{
    private String id;  // 资源编号
    private String parentId; // 资源上级节点
    private String doman;
    private String name; // 资源名称
    private Integer type; // 资源类型 1：企业，2:应用，3:页面，4:页面组
    private Integer virtual; // 资源虚实
    private Integer alarm;  //资源告警 缺省 1
    private Integer status; // 资源状态 1:正常，2:冻结，0，待开通
    private String property; // 扩展（不同资源信息）
    private String choice;
    private String ip;  //服务器
    private String url; // 网址
    private String password; // 密码

    public String getChoice()
    {
        return choice;
    }

    public void setChoice(String choice)
    {
        this.choice = choice;
    }

    public String getIp()
    {
        return ip;
    }

    public void setIp(String ip)
    {
        this.ip = ip;
    }

    public String getUrl()
    {
        return url;
    }

    public void setUrl(String url)
    {
        this.url = url;
    }

    public String getPassword()
    {
        return password;
    }

    public void setPassword(String password)
    {
        this.password = password;
    }

    public String getDoman()
    {
        return doman;
    }

    public void setDoman(String doman)
    {
        this.doman = doman;
    }

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

    public Integer getType()
    {
        return type;
    }

    public void setType(Integer type)
    {
        this.type = type;
    }

    public Integer getVirtual()
    {
        return virtual;
    }

    public void setVirtual(Integer virtual)
    {
        this.virtual = virtual;
    }

    public Integer getAlarm()
    {
        return alarm;
    }

    public void setAlarm(Integer alarm)
    {
        this.alarm = alarm;
    }

    public Integer getStatus()
    {
        return status;
    }

    public void setStatus(Integer status)
    {
        this.status = status;
    }

    public String getProperty()
    {
        return property;
    }

    public void setProperty(String property)
    {
        this.property = property;
    }
}

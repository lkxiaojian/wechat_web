package com.kingweather.system.manager.domain;

import java.util.Date;

/**
 * 日志
 */
public class Log
{
    private String       account;
    private String      logType;
    private OperateType  operateType;
    private Date         operateDate;
    private String       domain;
    private String       ip;
    private OperateState operateState;
    private String       property;

    public String getAccount()
    {
        return account;
    }

    public void setAccount(String account)
    {
        this.account = account;
    }

    public String getLogType()
    {
        return logType;
    }

    public void setLogType(String logType)
    {
        this.logType = logType;
    }

    public OperateType getOperateType()
    {
        return operateType;
    }

    public void setOperateType(OperateType operateType)
    {
        this.operateType = operateType;
    }

    public Date getOperateDate()
    {
        return operateDate;
    }

    public void setOperateDate(Date operateDate)
    {
        this.operateDate = operateDate;
    }

    public String getDomain()
    {
        return domain;
    }

    public void setDomain(String domain)
    {
        this.domain = domain;
    }

    public String getIp()
    {
        return ip;
    }

    public void setIp(String ip)
    {
        this.ip = ip;
    }

    public OperateState getOperateState()
    {
        return operateState;
    }

    public void setOperateState(OperateState operateState)
    {
        this.operateState = operateState;
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

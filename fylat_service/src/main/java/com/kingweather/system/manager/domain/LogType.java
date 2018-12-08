package com.kingweather.system.manager.domain;

/**
 * Created by sunfengju on 15/5/9.
 * 日志类型
 */
public enum LogType
{
    UNKNOWN(0),
    //未知
    PLATFORM(1),
    //平台日志
    TENANT(2) //住户日志
    ;

    private int code;

    private LogType(int code)
    {
        this.code = code;
    }

    /**
     * 获得枚举code
     *
     * @return code
     */
    public int getCode()
    {
        return this.code;
    }

    /**
     * 通过code获取枚举值
     *
     * @param _code
     * @return 枚举值
     */
    public static LogType getLogType(int _code)
    {
        switch (_code)
        {
            case 1:
                return LogType.PLATFORM;

            case 2:
                return LogType.TENANT;

            default:
                return LogType.UNKNOWN;

        }
    }
}

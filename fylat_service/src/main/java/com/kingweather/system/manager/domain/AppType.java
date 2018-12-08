package com.kingweather.system.manager.domain;

/**
 * Created by sunfengju on 15/5/9.
 * 用户类型
 */
public enum AppType
{
    UNKNOWN("未知", 0),
    NORMAL("正常", 1),
    LOCK("冻结", 2),
    WAITOPEN("待开通", 3);

    private String name;
    private int    code;

    private AppType(String name, int code)
    {
        this.name = name;
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
     * 获得枚举name
     *
     * @return name
     */
    public String getName()
    {
        return this.name;
    }

    /**
     * 通过code获取枚举值
     *
     * @param _code
     * @return 枚举值
     */
    public static AppType getOperateState(int _code)
    {
        switch (_code)
        {
            case 1:
                return AppType.NORMAL;

            case 2:
                return AppType.LOCK;

            case 3:
                return AppType.WAITOPEN;

            default:
                return AppType.UNKNOWN;
        }
    }
}

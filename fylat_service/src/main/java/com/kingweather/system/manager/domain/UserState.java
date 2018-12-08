package com.kingweather.system.manager.domain;

/**
 * Created by sunfengju on 15/5/9.
 * 用户状态
 */
public enum UserState
{
    UNKNOWN("未知", 0),
    NORMAL("正常", 1),
    LOCK("已冻结", 2),
    NOAUTHORITY("未授权",3);
    
    private String name;
    private int    code;

    private UserState(String name, int code)
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
    public static UserState getUserState(int _code)
    {
        switch (_code)
        {
            case 1:
                return UserState.NORMAL;

            case 2:
                return UserState.LOCK;

            case 3:
                return UserState.NOAUTHORITY;

            default:
                return UserState.UNKNOWN;
        }
    }
}
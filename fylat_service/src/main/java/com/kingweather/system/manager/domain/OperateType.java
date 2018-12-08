package com.kingweather.system.manager.domain;

/**
 * Created by sunfengju on 15/5/9.
 * 操作类型
 */
public enum OperateType
{
    UNKNOWN("未知", 0),
    REGIST("注册", 1),
    LOGIN("登录", 2),
    MODIFYPASSWD("修改密码", 3),
    ADDUSER("增加用户", 4);

    private String name;
    private int    code;

    private OperateType(String name, int code)
    {
        this.code = code;
        this.name = name;
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
    public static OperateType getOperateType(int _code)
    {
        switch (_code)
        {
            case 1:
                return OperateType.REGIST;

            case 2:
                return OperateType.LOGIN;

            case 3:
                return OperateType.MODIFYPASSWD;

            case 4:
                return OperateType.ADDUSER;

            default:
                return OperateType.UNKNOWN;

        }
    }
}

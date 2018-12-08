package com.kingweather.system.manager.domain;

/**
 * Created by sunfengju on 15/5/9.
 * 资源类型
 */
public enum ResourceType
{
    UNKNOWN("未知", 0),
    ENTERPRISE("企业", 1),
    APP("应用", 2),
    PAGE("页面", 3),
    PAGEGROUP("页面组", 4),
    MODULE("模块", 5);

    private String name;
    private int    code;

    private ResourceType(String name, int code)
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
    public static ResourceType getOperateState(int _code)
    {
        switch (_code)
        {
            case 1:
                return ResourceType.ENTERPRISE;

            case 2:
                return ResourceType.APP;

            case 3:
                return ResourceType.PAGE;

            case 4:
                return ResourceType.PAGEGROUP;

            case 5:
                return ResourceType.MODULE;

            default:
                return ResourceType.UNKNOWN;
        }
    }
}

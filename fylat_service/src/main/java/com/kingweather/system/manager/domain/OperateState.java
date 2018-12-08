package com.kingweather.system.manager.domain;

/**
 * Created by sunfengju on 15/5/9.
 * 操作状态
 */
public enum OperateState
{

    FAIL("失败", 0),
    SUCCESS("成功", 1);

    private String name;
    private int    code;

    private OperateState(String name, int code)
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
    public static OperateState getOperateState(int _code)
    {
        switch (_code)
        {
            case 1:
                return OperateState.SUCCESS;

            default:
                return OperateState.FAIL;

        }
    }
}

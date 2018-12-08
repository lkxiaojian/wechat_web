'use strict';
app.constant('pd_kpi1', {th0: "类别名称", th1: "商品数", th2: "销量", th3: "销售额", th4: "访问次数", th5: "浏览量", th6: "用户数"});
app.constant('pd_ds1',
    [
        {td0: "类别1", td1: Math.ceil(Math.random() * 100), td2: Math.ceil(Math.random() * 100), td3: Math.ceil(Math.random() * 100), td4: Math.ceil(Math.random() * 100), td5: Math.ceil(Math.random() * 100), td6: Math.ceil(Math.random() * 100)},
        {td0: "类别2", td1: Math.ceil(Math.random() * 100), td2: Math.ceil(Math.random() * 100), td3: Math.ceil(Math.random() * 100), td4: Math.ceil(Math.random() * 100), td5: Math.ceil(Math.random() * 100), td6: Math.ceil(Math.random() * 100)},
        {td0: "类别3", td1: Math.ceil(Math.random() * 100), td2: Math.ceil(Math.random() * 100), td3: Math.ceil(Math.random() * 100), td4: Math.ceil(Math.random() * 100), td5: Math.ceil(Math.random() * 100), td6: Math.ceil(Math.random() * 100)},
        {td0: "类别4", td1: Math.ceil(Math.random() * 100), td2: Math.ceil(Math.random() * 100), td3: Math.ceil(Math.random() * 100), td4: Math.ceil(Math.random() * 100), td5: Math.ceil(Math.random() * 100), td6: Math.ceil(Math.random() * 100)},
        {td0: "类别5", td1: Math.ceil(Math.random() * 100), td2: Math.ceil(Math.random() * 100), td3: Math.ceil(Math.random() * 100), td4: Math.ceil(Math.random() * 100), td5: Math.ceil(Math.random() * 100), td6: Math.ceil(Math.random() * 100)}
    ]);

app.constant('pd_kpi2', {th0: "商品", th1: "浏览量", th2: "用户数", th3: "新用户数", th4: "加入购物车", th5: "订购量", th6: "订购金额"});
app.constant('pd_ds2',
    [
        {td0: "商品1", td1: Math.ceil(Math.random() * 100), td2: Math.ceil(Math.random() * 100), td3: Math.ceil(Math.random() * 100), td4: Math.ceil(Math.random() * 100), td5: Math.ceil(Math.random() * 100), td6: Math.ceil(Math.random() * 100)},
        {td0: "商品2", td1: Math.ceil(Math.random() * 100), td2: Math.ceil(Math.random() * 100), td3: Math.ceil(Math.random() * 100), td4: Math.ceil(Math.random() * 100), td5: Math.ceil(Math.random() * 100), td6: Math.ceil(Math.random() * 100)},
        {td0: "商品3", td1: Math.ceil(Math.random() * 100), td2: Math.ceil(Math.random() * 100), td3: Math.ceil(Math.random() * 100), td4: Math.ceil(Math.random() * 100), td5: Math.ceil(Math.random() * 100), td6: Math.ceil(Math.random() * 100)},
        {td0: "商品4", td1: Math.ceil(Math.random() * 100), td2: Math.ceil(Math.random() * 100), td3: Math.ceil(Math.random() * 100), td4: Math.ceil(Math.random() * 100), td5: Math.ceil(Math.random() * 100), td6: Math.ceil(Math.random() * 100)},
        {td0: "商品5", td1: Math.ceil(Math.random() * 100), td2: Math.ceil(Math.random() * 100), td3: Math.ceil(Math.random() * 100), td4: Math.ceil(Math.random() * 100), td5: Math.ceil(Math.random() * 100), td6: Math.ceil(Math.random() * 100)}
    ]);

app.constant('pd_zb',
    [
        {name: "销量", value: Math.ceil(Math.random() * 100)},
        {name: "销售额", value: Math.ceil(Math.random() * 100)},
        {name: "浏览量", value: Math.ceil(Math.random() * 100)},
        {name: "用户数", value: Math.ceil(Math.random() * 100)},
        {name: "新用户数", value: Math.ceil(Math.random() * 100)},
        {name: "加入购物车次数", value: Math.ceil(Math.random() * 100)},
        {name: "被收藏次数", value: Math.ceil(Math.random() * 100)},
        {name: "订购量", value: Math.ceil(Math.random() * 100)},
        {name: "订单量", value: Math.ceil(Math.random() * 100)},
        {name: "退货量", value: Math.ceil(Math.random() * 100)}
    ])
;

app.constant('pd_region', [
    {name: "北京", rate: "30%", value: Math.ceil(Math.random() * 100)},
    {name: "上海", rate: "30%", value: Math.ceil(Math.random() * 100)},
    {name: "广州", rate: "40%", value: Math.ceil(Math.random() * 100)}
]);

app.constant('pd_source', [
    {name: "商品浏览", rate: "30%", value: Math.ceil(Math.random() * 100)},
    {name: "站内搜索", rate: "30%", value: Math.ceil(Math.random() * 100)},
    {name: "站内推广", rate: "40%", value: Math.ceil(Math.random() * 100)}
]);

app.constant('pd_kpi3', {th0: "区域", th1: "访问次数", th2: "浏览量", th3: "用户数", th4: "加购物车次数", th5: "订单量", th6: "订购量", th7: "销售额"});
app.constant('pd_ds3',
    [
        {td0: "北京", td1: Math.ceil(Math.random() * 100), td2: Math.ceil(Math.random() * 100), td3: Math.ceil(Math.random() * 100), td4: Math.ceil(Math.random() * 100), td5: Math.ceil(Math.random() * 100), td6: Math.ceil(Math.random() * 100), td7: Math.ceil(Math.random() * 100)},
        {td0: "上海", td1: Math.ceil(Math.random() * 100), td2: Math.ceil(Math.random() * 100), td3: Math.ceil(Math.random() * 100), td4: Math.ceil(Math.random() * 100), td5: Math.ceil(Math.random() * 100), td6: Math.ceil(Math.random() * 100), td7: Math.ceil(Math.random() * 100)},
        {td0: "广州", td1: Math.ceil(Math.random() * 100), td2: Math.ceil(Math.random() * 100), td3: Math.ceil(Math.random() * 100), td4: Math.ceil(Math.random() * 100), td5: Math.ceil(Math.random() * 100), td6: Math.ceil(Math.random() * 100), td7: Math.ceil(Math.random() * 100)}
    ]);

app.constant('pd_kpi4', {th0: "来源", th1: "销售量", th2: "销售额"});
app.constant('pd_ds4',
    [
        {td0: "商品浏览", td1: Math.ceil(Math.random() * 100), td2: Math.ceil(Math.random() * 100)},
        {td0: "站内搜索", td1: Math.ceil(Math.random() * 100), td2: Math.ceil(Math.random() * 100)},
        {td0: "站内推广", td1: Math.ceil(Math.random() * 100), td2: Math.ceil(Math.random() * 100)}
    ]);
app.constant('pd_kpi5', {th0: "商品", th1: "数量", th2: "保质期", th3: "条形码"});
app.constant('pd_ds5',
    [
        {td0: "商品1", td1: Math.ceil(Math.random() * 100), td2: Math.ceil(Math.random() * 100), td3: Math.ceil(Math.random() * 100)},
        {td0: "商品2", td1: Math.ceil(Math.random() * 100), td2: Math.ceil(Math.random() * 100), td3: Math.ceil(Math.random() * 100)},
        {td0: "商品3", td1: Math.ceil(Math.random() * 100), td2: Math.ceil(Math.random() * 100), td3: Math.ceil(Math.random() * 100)}
    ]);



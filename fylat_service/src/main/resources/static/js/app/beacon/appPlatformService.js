'use strict';
app.constant('appPlatformService',
    [
        {id: 'id1', type: "phone", name: "http://phone.jd.com/1212", url: "http://phone.jd.com/1212", page_view: Math.ceil(Math.random() * 100)},
        {id: 'id2', type: "book", name: "http://book.jd.com/32613", url: "http://book.jd.com/32613", page_view: Math.ceil(Math.random() * 100)},
        {id: 'id3', type: "phone", name: "http://phone.jd.com/122", url: "http://phone.jd.com/122", page_view: Math.ceil(Math.random() * 100)},
        {id: 'id4', type: "phone", name: "http://phone.jd.com/812", url: "http://phone.jd.com/812", page_view: Math.ceil(Math.random() * 100)},
        {id: 'id5', type: "book", name: "http://book.jd.com/5613", url: "http://book.jd.com/5613", page_view: Math.ceil(Math.random() * 100)},
        {id: 'id6', type: "book", name: "http://book.jd.com/3423", url: "http://book.jd.com/3423", page_view: Math.ceil(Math.random() * 100)}
    ]);

app.constant('appPlatformKpiService', {name: "页面名称", url: "页面URL", type: "类别", page_view: "浏览量"});

app.constant('ap_timeGroupService',
    [
        {id: "lastmonth", name: "最近1个月"},
        {id: "lastweek", name: "最近一周"},
        {id: "lastthreedmonth", name: "最近三个月"},
        {id: "lasthalfyear", name: "最近半年"},
        {id: "lastyear", name: "最近一年"}
    ]);

app.constant('ap_platfrom', {name: "名称", page_view: "浏览量", unique_visitor: "用户数", newunique_visitor: "新用户数"
	,throughput:"吞吐量", avg_resp_time: "平均响应时间", err_data: "错误数", err_rate: "错误率",user_index:"用户满意度"});

app.constant('ap_visitBehaviorDataService',
    [
        {name: "group1", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100)},
        {name: "group2", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100)},
        {name: "group3", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100)},
        {name: "group4", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100)},
        {name: "group5", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100)},
        {name: "group6", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100)},
        {name: "group7", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100)},
        {name: "group8", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100)}
    ]);

app.constant('apvb_KpiService', {name: "分组名称", page_view: "浏览量", unique_visitor: "用户数", newunique_visitor: "新用户数", visit: "访问次数", avg_resp_time: "平均响应时间", throughput: "吞吐量", apdex: "访问体验（apdex）", err_rate: "错误率"});

app.constant('apvb_service',
    [
        {id: 'id1', name: "group1", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {id: 'id2', name: "group2", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {id: 'id3', name: "group3", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {id: 'id4', name: "group4", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {id: 'id5', name: "group5", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {id: 'id6', name: "group6", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {id: 'id7', name: "group7", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {id: 'id8', name: "group8", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {id: 'id9', name: "group9", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {id: 'id10', name: "group10", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {id: 'id11', name: "group11", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {id: 'id12', name: "group12", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {id: 'id13', name: "group13", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {id: 'id14', name: "group14", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {id: 'id15', name: "group15", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)}
    ]);


app.constant('apvb_trendService', [
    {
        key: "group1",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    },
    {
        key: "group2",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    },
    {
        key: "group3",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    }
]);


app.constant('apve_dataService',
    [
        {name: "group1", avg_resp_time: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {name: "group2", avg_resp_time: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {name: "group3", avg_resp_time: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {name: "group4", avg_resp_time: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {name: "group5", avg_resp_time: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {name: "group6", avg_resp_time: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {name: "group7", avg_resp_time: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {name: "group8", avg_resp_time: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)}
    ]);


app.constant('apve_KpiService', {name: "分组名称", page_view: "浏览量", unique_visitor: "用户数", newunique_visitor: "新用户数", visit: "访问次数", avg_resp_time: "平均响应时间", throughput: "吞吐量", apdex: "访问体验（apdex）", err_rate: "错误率"});


app.constant('apve_service',
    [
        {id: 'id1', name: "group1", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {id: 'id2', name: "group2", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {id: 'id3', name: "group3", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {id: 'id4', name: "group4", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {id: 'id5', name: "group5", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {id: 'id6', name: "group6", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {id: 'id7', name: "group7", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {id: 'id8', name: "group8", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {id: 'id9', name: "group9", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {id: 'id10', name: "group10", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {id: 'id11', name: "group11", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {id: 'id12', name: "group12", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {id: 'id13', name: "group13", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {id: 'id14', name: "group14", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {id: 'id15', name: "group15", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)}
    ]);


app.constant('apve_trendService', [
    {
        key: "group1",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    },
    {
        key: "group2",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    },
    {
        key: "group3",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    }
]);

app.constant('ap_assignPageService', [
    {
        key: "当前",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    },
    {
        key: "昨日",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    },
    {
        key: "上周同日",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    },
    {
        key: "上月同日对比",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    }
]);


app.constant('kpiService',
    [
        {id: "yhs", name: "用户数"},
        {id: "xyhs", name: "新用户数"},
        {id: "lll", name: "浏览量"},
        {id: "fwcs", name: "访问次数"},
        {id: "pjxysj", name: "平均响应时间"},
        {id: "ddje", name: "订单金额"},
        {id: "apdex", name: "访问体验(apdex)"},
        {id: "cwl", name: "错误率"},
        {id: "ddl", name: "订单量"}
    ]);

app.constant('ap_apgKpi', {name: "页面名称", page_view: "浏览量", unique_visitor: "用户数", newunique_visitor: "新用户数", visit: "访问次数", convert: "转化次数", avg_resp_time: "平均响应时间", throughput: "吞吐量", loading_time: "加载时间", apdex: "访问体验（apdex）", err_rate: "错误率"});

app.constant('ap_apgDataService',
    [
        {name: "页面1", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), convert: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {name: "页面2", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), convert: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {name: "页面3", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), convert: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {name: "页面4", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), convert: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {name: "页面5", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), convert: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {name: "页面6", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), convert: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)},
        {name: "页面7", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), newunique_visitor: Math.ceil(Math.random() * 100), visit: Math.ceil(Math.random() * 100), convert: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), throughput: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100), apdex: Math.ceil(Math.random() * 100), err_rate: Math.ceil(Math.random() * 100)}
    ]);

app.constant('ap_apKpi', {name: "组件名称", url: "URL", resp_time: "响应时间", loading_time: "加载时间", component_size: "组件大小"});

app.constant('ap_apDataService',
    [
        {name: "组件1", url: "http://book.jd.com/" + Math.ceil(Math.random() * 100), resp_time: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100), component_size: Math.ceil(Math.random() * 100)},
        {name: "组件2", url: "http://book.jd.com/" + Math.ceil(Math.random() * 100), resp_time: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100), component_size: Math.ceil(Math.random() * 100)},
        {name: "组件3", url: "http://book.jd.com/" + Math.ceil(Math.random() * 100), resp_time: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100), component_size: Math.ceil(Math.random() * 100)},
        {name: "组件4", url: "http://book.jd.com/" + Math.ceil(Math.random() * 100), resp_time: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100), component_size: Math.ceil(Math.random() * 100)},
        {name: "组件5", url: "http://book.jd.com/" + Math.ceil(Math.random() * 100), resp_time: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100), component_size: Math.ceil(Math.random() * 100)},
        {name: "组件6", url: "http://book.jd.com/" + Math.ceil(Math.random() * 100), resp_time: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100), component_size: Math.ceil(Math.random() * 100)},
        {name: "组件7", url: "http://book.jd.com/" + Math.ceil(Math.random() * 100), resp_time: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100), component_size: Math.ceil(Math.random() * 100)},
        {name: "组件8", url: "http://book.jd.com/" + Math.ceil(Math.random() * 100), resp_time: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100), component_size: Math.ceil(Math.random() * 100)},
        {name: "组件9", url: "http://book.jd.com/" + Math.ceil(Math.random() * 100), resp_time: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100), component_size: Math.ceil(Math.random() * 100)}
    ]);


app.constant('ap_searchKpi', {name: "关键词", search: "搜索次数", return_product: "返回产品数", return_page: "返回结果分页数", avg_resp_time: "平均响应时间", index_click: "搜索页首页点击数", page_turn: "搜索页翻页次数"});

app.constant('ap_searchDataService',
    [
        {name: "关键词1", search: Math.ceil(Math.random() * 100), return_product: Math.ceil(Math.random() * 100), return_page: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), index_click: Math.ceil(Math.random() * 100), page_turn: Math.ceil(Math.random() * 100)},
        {name: "关键词2", search: Math.ceil(Math.random() * 100), return_product: Math.ceil(Math.random() * 100), return_page: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), index_click: Math.ceil(Math.random() * 100), page_turn: Math.ceil(Math.random() * 100)},
        {name: "关键词3", search: Math.ceil(Math.random() * 100), return_product: Math.ceil(Math.random() * 100), return_page: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), index_click: Math.ceil(Math.random() * 100), page_turn: Math.ceil(Math.random() * 100)},
        {name: "关键词4", search: Math.ceil(Math.random() * 100), return_product: Math.ceil(Math.random() * 100), return_page: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), index_click: Math.ceil(Math.random() * 100), page_turn: Math.ceil(Math.random() * 100)},
        {name: "关键词5", search: Math.ceil(Math.random() * 100), return_product: Math.ceil(Math.random() * 100), return_page: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), index_click: Math.ceil(Math.random() * 100), page_turn: Math.ceil(Math.random() * 100)},
        {name: "关键词6", search: Math.ceil(Math.random() * 100), return_product: Math.ceil(Math.random() * 100), return_page: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), index_click: Math.ceil(Math.random() * 100), page_turn: Math.ceil(Math.random() * 100)},
        {name: "关键词7", search: Math.ceil(Math.random() * 100), return_product: Math.ceil(Math.random() * 100), return_page: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), index_click: Math.ceil(Math.random() * 100), page_turn: Math.ceil(Math.random() * 100)},
        {name: "关键词8", search: Math.ceil(Math.random() * 100), return_product: Math.ceil(Math.random() * 100), return_page: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), index_click: Math.ceil(Math.random() * 100), page_turn: Math.ceil(Math.random() * 100)}
    ]);

//对比功能	
app.constant('ap_apgcService', [
    {code: 'group1', name: "组1"},
    {code: 'group1', name: "组2"},
    {code: 'group1', name: "组3"},
    {code: 'group1', name: "组4"},
    {code: 'group1', name: "组5"},
    {code: 'group1', name: "组6"},
    {code: 'group1', name: "组7"},
    {code: 'group1', name: "组8"},
    {code: 'group1', name: "组9"},
    {code: 'group1', name: "组10"}
]);

//对比功能	
app.constant('ap_apcService', [
    {code: 'url1', name: "url1"},
    {code: 'url2', name: "url2"},
    {code: 'url3', name: "url3"},
    {code: 'url4', name: "url4"},
    {code: 'url5', name: "url5"},
    {code: 'url6', name: "url6"},
    {code: 'url7', name: "url7"},
    {code: 'url8', name: "url8"},
    {code: 'url9', name: "url9"},
    {code: 'url10', name: "url10"}
]);


app.constant('ap_apgcdService', [
    {
        key: "组1",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    },
    {
        key: "组2",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    },
    {
        key: "组3",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    },
    {
        key: "组4",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    },
    {
        key: "组5",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    },
    {
        key: "组6",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    },
    {
        key: "组7",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    },
    {
        key: "组8",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    },
    {
        key: "组9",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    },
    {
        key: "组10",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    }
]);

app.constant('ap_apcdService', [
    {
        key: "url1",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    },
    {
        key: "url2",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    },
    {
        key: "url3",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    },
    {
        key: "url4",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    },
    {
        key: "url5",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    },
    {
        key: "url6",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    },
    {
        key: "url7",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    },
    {
        key: "url8",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    },
    {
        key: "url9",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    },
    {
        key: "url10",
        values: [
            [ 1083297600000 , Math.ceil(Math.random() * 100)] ,
            [ 1085976000000 , Math.ceil(Math.random() * 100)] ,
            [ 1088568000000 , Math.ceil(Math.random() * 100)] ,
            [ 1091246400000 , Math.ceil(Math.random() * 100)] ,
            [ 1093924800000 , Math.ceil(Math.random() * 100)] ,
            [ 1096516800000 , Math.ceil(Math.random() * 100)] ,
            [ 1099195200000 , Math.ceil(Math.random() * 100)] ,
            [ 1101790800000 , Math.ceil(Math.random() * 100)] ,
            [ 1104469200000 , Math.ceil(Math.random() * 100)] ,
            [ 1107147600000 , Math.ceil(Math.random() * 100)] ,
            [ 1109566800000 , Math.ceil(Math.random() * 100)] ,
            [ 1112245200000 , Math.ceil(Math.random() * 100)] ,
            [ 1114833600000 , Math.ceil(Math.random() * 100)] ,
            [ 1117512000000 , Math.ceil(Math.random() * 100)] ,
            [ 1120104000000 , Math.ceil(Math.random() * 100)] ,
            [ 1122782400000 , Math.ceil(Math.random() * 100)] ,
            [ 1125460800000 , Math.ceil(Math.random() * 100)] ,
            [ 1128052800000 , Math.ceil(Math.random() * 100)] ,
            [ 1130734800000 , Math.ceil(Math.random() * 100)]
        ]
    }
]);

app.constant('apKpi', {name: "页面名称",url:"URL", page_view: "浏览量", unique_visitor: "用户数",   avg_resp_time: "平均响应时间",  loading_time: "加载时间"});


app.constant('ap_dataService',
    [
        {name: "页面1",url:"url1", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100)},
        {name: "页面2",url:"url2", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100)},
        {name: "页面3",url:"url3", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100)},
        {name: "页面4",url:"url4", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100)},
        {name: "页面5",url:"url5", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100)},
        {name: "页面6",url:"url6", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100)},
        {name: "页面7",url:"url7", page_view: Math.ceil(Math.random() * 100), unique_visitor: Math.ceil(Math.random() * 100), avg_resp_time: Math.ceil(Math.random() * 100), loading_time: Math.ceil(Math.random() * 100)}
    ]);
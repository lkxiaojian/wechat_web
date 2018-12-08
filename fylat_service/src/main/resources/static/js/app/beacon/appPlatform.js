'use strict';


app.controller('appPlatform', ['$scope', '$location', 'ap_assignPageService', 'ap_dataService', 'apKpi', 'ap_visitBehaviorDataService', function ($scope, $location, ap_assignPageService, ap_dataService, apKpi, ap_visitBehaviorDataService) {
    $scope.currentHead = "概览";
    $scope.zhibiaos = [
        {name: "浏览量", value: Math.ceil(Math.random() * 100)},
        {name: "用户数", value: Math.ceil(Math.random() * 100)},
        {name: "新用户数", value: Math.ceil(Math.random() * 100)},
        {name: "访问次数", value: Math.ceil(Math.random() * 100)},
        {name: "转化次数", value: Math.ceil(Math.random() * 100)},
        {name: "平均响应时间", value: Math.ceil(Math.random() * 100)},
        {name: "平均页面加载时间", value: Math.ceil(Math.random() * 100)},
        {name: "吞吐量", value: Math.ceil(Math.random() * 100)},
        {name: "访问体验（apdex）", value: Math.ceil(Math.random() * 100)},
        {name: "错误率", value: Math.ceil(Math.random() * 100)}
    ];
    $scope.items = [];
    for (var i = 0; i < $scope.zhibiaos.length; i++) {
        $scope.items[i] = {name: $scope.zhibiaos[i].name, value: $scope.zhibiaos[i].value, cloumn: "col-sm-2"};
        if (i > 4) {
            break;
        }
    }


    var baroption = function (pieName) {
        return  {
            chart: {
                type: 'discreteBarChart',
                height: 200,
                tooltips: true,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 55
                },
                x: function (d) {
                    return d.label;
                },
                y: function (d) {
                    return d.value;
                },
                showValues: true,
                valueFormat: function (d) {
                    return d3.format(',')(d);
                },
                transitionDuration: 500,
                yAxis: {
                    axisLabel: pieName,
                    axisLabelDistance: 30
                }
            }
        };
    };

    var barData = function (kpi) {
        var kpiData = [];
        for (var i = 0; i < ap_visitBehaviorDataService.length; i++) {
            var item = ap_visitBehaviorDataService[i];
            var kpiValue = item[kpi];
            var name = item.name;
            var itemValue = [name, kpiValue];
            kpiData[i] = itemValue;
        }

        var topKpiValues = [];
        for (var index = 0; index < kpiData.length; index++) {
            topKpiValues[index] = {"label": kpiData[index][0], "value": kpiData[index][1]};
        }
        return [
            {key: kpi, values: topKpiValues}
        ];
    };

    $scope.page_view_p = baroption("浏览量最大");
    $scope.unique_visitor_p = baroption("用户数最多");

    $scope.page_view_data_p = barData("page_view");
    $scope.unique_visitor_data_p = barData("unique_visitor");


    //趋势对比
    var lineOption = function (axisLabelName) {
        return  {
            chart: {
                type: 'lineChart',
                height: 200,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 65
                },
                x: function (d) {
                    return d[0];
                },
                y: function (d) {
                    return d[1];
                },
                color: d3.scale.category10().range(),
                useInteractiveGuideline: true,
                clipVoronoi: true,
                xAxis: {
                    tickFormat: function (d) {
                        return d3.time.format('%m/%d/%y')(new Date(d));
                    }
                },
                yAxis: {
                    axisLabelDistance: 30,
                    axisLabel: axisLabelName
                }
            }
        };
    }

    $scope.page_view = lineOption("浏览量");
    $scope.unique_visitor = lineOption("用户数");
    $scope.newunique_visitor = lineOption("新用户数");
    $scope.visit = lineOption("访问次数");
    $scope.convert = lineOption("转化次数");
    $scope.avg_resp_time = lineOption("平均响应时间");
    $scope.throughput = lineOption("吞吐量");
    $scope.loading_time = lineOption("平均加载时间");
    $scope.apdex = lineOption("访问体验（apdex）");
    $scope.err_rate = lineOption("错误率");

    var tempData = ap_assignPageService;
    $scope.page_view_data = tempData;
    $scope.unique_visitor_data = tempData;
    $scope.newunique_visitor_data = tempData;
    $scope.visit_data = tempData;
    $scope.convert_data = tempData;
    $scope.avg_resp_time_data = tempData;
    $scope.throughput_data = tempData;
    $scope.loading_time_data = tempData;
    $scope.apdex_data = tempData;
    $scope.err_rate_data = tempData;

    var dataService = function () {
        var ds = [];
        for (var i = 0; i < ap_dataService.length; i++) {
            var row = ap_dataService[i];
            row.pageHref = "#/app/insure/ap_assignPage?page=" + row.name;
            ds[i] = row;
        }
        return ds;
    };

    //列表展示
    $scope.itemtable = {
        head: apKpi,
        body: dataService(),
        foot: 10,
        type: "appPlatform",
        search: true
    };


}]);


app.controller('ap_autoDiscover', ['$scope', '$location', '$window', 'appPlatformService', 'appPlatformKpiService', function ($scope, $location, $window, appPlatformService, appPlatformKpiService) {
    $scope.currentHead = "页面自动发现";

    var dataService = function () {
        var ds = [];
        for (var i = 0; i < appPlatformService.length; i++) {
            var row = appPlatformService[i];
            row.pageGroupHref = "#/app/insure/ap_assignPageGroup?group=" + row.type;
            row.pageHref = "#/app/insure/ap_assignPage?page=" + row.name;
            ds[i] = row;
        }
        return ds;

    };

    //列表展示
    $scope.itemtable = {
        head: appPlatformKpiService,
        body: dataService(),
        foot: 10,
        type: "ap_autoDiscover",
        search: true
    };
}]);

app.controller('ap_search', ['$scope', '$location', 'ap_searchKpi', 'ap_searchDataService', function ($scope, $location, ap_searchKpi, ap_searchDataService) {
    $scope.currentHead = "搜索功能分析";
    $scope.zhibiaos = [
        {name: "浏览量", value: Math.ceil(Math.random() * 100)},
        {name: "用户数", value: Math.ceil(Math.random() * 100)},
        {name: "新用户数", value: Math.ceil(Math.random() * 100)},
        {name: "访问次数", value: Math.ceil(Math.random() * 100)},
        {name: "点击量", value: Math.ceil(Math.random() * 100)},
        {name: "平均响应时间", value: Math.ceil(Math.random() * 100)},
        {name: "吞吐量", value: Math.ceil(Math.random() * 100)},
        {name: "访问体验（apdex）", value: Math.ceil(Math.random() * 100)},
        {name: "错误率", value: Math.ceil(Math.random() * 100)}
    ];
    $scope.items = [];
    for (var i = 0; i < $scope.zhibiaos.length; i++) {
        $scope.items[i] = {name: $scope.zhibiaos[i].name, value: $scope.zhibiaos[i].value, cloumn: "col-sm-2"};
        if (i > 4) {
            break;
        }
    }

    var dataService = function () {
        var ds = [];
        for (var i = 0; i < ap_searchDataService.length; i++) {
            var row = ap_searchDataService[i];
            row.pageHref = "#/app/insure/ap_assignPage?page=" + row.name;
            ds[i] = row;
        }
        return ds;
    };
    //列表展示
    $scope.itemtable = {
        head: ap_searchKpi,
        body: dataService(),
        foot: 10,
        type: "ap_search",
        search: true
    };


}]);

app.controller('ap_visitBehavior', ['$scope', '$location', 'ap_timeGroupService', 'ap_visitBehaviorDataService', 'apvb_KpiService', 'apvb_service', 'apvb_trendService', function ($scope, $location, ap_timeGroupService, ap_visitBehaviorDataService, apvb_KpiService, apvb_service, apvb_trendService) {
    $scope.currentHead = "访问行为";

    //指标
    $scope.defaultzhibiao = ap_timeGroupService[0];
    $scope.zhibiaos = ap_timeGroupService;

    //选择指标
    $scope.selectzb = function (id) {
        for (var i = 0; i < $scope.zhibiaos.length; i++) {
            if ($scope.zhibiaos[i].id == id) {
                $scope.defaultzhibiao = $scope.zhibiaos[i];
                $scope.page_view_data_p = barData("page_view");
                $scope.unique_visitor_data_p = barData("unique_visitor");
                $scope.newunique_visitor_data_p = barData("newunique_visitor");
                $scope.visit_data_p = barData("visit");
            }
        }
    };

    //列表展示
    $scope.itemtable = {
        head: apvb_KpiService,
        body: apvb_service,
        foot: 10,
        type: "ap_visitBehavior"
    };

    var baroption = function (pieName) {
        return  {
            chart: {
                type: 'discreteBarChart',
                height: 200,
                tooltips: true,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 55
                },
                x: function (d) {
                    return d.label;
                },
                y: function (d) {
                    return d.value;
                },
                showValues: true,
                valueFormat: function (d) {
                    return d3.format(',')(d);
                },
                transitionDuration: 500,
                yAxis: {
                    axisLabel: pieName,
                    axisLabelDistance: 30
                }
            }
        };
    };

    var barData = function (kpi) {
        var kpiData = [];
        for (var i = 0; i < ap_visitBehaviorDataService.length; i++) {
            var item = ap_visitBehaviorDataService[i];
            var kpiValue = item[kpi];
            var name = item.name;
            var itemValue = [name, kpiValue];
            kpiData[i] = itemValue;
        }

        var topKpiValues = [];
        for (var index = 0; index < kpiData.length; index++) {
            topKpiValues[index] = {"label": kpiData[index][0], "value": kpiData[index][1]};
        }
        return [
            {key: kpi, values: topKpiValues}
        ];
    };

    $scope.page_view_p = baroption("浏览量最大");
    $scope.unique_visitor_p = baroption("用户数最多");
    $scope.newunique_visitor_p = baroption("新用户数最多");
    $scope.visit_p = baroption("访问次数最多");

    $scope.page_view_data_p = barData("page_view");
    $scope.unique_visitor_data_p = barData("unique_visitor");
    $scope.newunique_visitor_data_p = barData("newunique_visitor");
    $scope.visit_data_p = barData("visit");

    //趋势对比
    var lineOption = function (axisLabelName) {
        return {
            chart: {
                type: 'lineChart',
                height: 200,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 65
                },
                x: function (d) {
                    return d[0];
                },
                y: function (d) {
                    return d[1];
                },
                color: d3.scale.category10().range(),
                useInteractiveGuideline: true,
                clipVoronoi: true,
                xAxis: {
                    tickFormat: function (d) {
                        return d3.time.format('%m/%d/%y')(new Date(d));
                    }
                },
                yAxis: {
                    axisLabelDistance: 30,
                    axisLabel: axisLabelName
                }
            }
        };
    };

    //趋势图
    $scope.page_view = lineOption("浏览量");
    $scope.unique_visitor = lineOption("用户数");
    $scope.newunique_visitor = lineOption("新用户数");
    $scope.visit = lineOption("访问次数");
    $scope.avg_resp_time = lineOption("平均响应时间");
    $scope.throughput = lineOption("吞吐量");
    $scope.apdex = lineOption("访问体验（apdex）");
    $scope.err_rate = lineOption("错误率");

    var tempData = apvb_trendService;
    $scope.page_view_data = tempData;
    $scope.unique_visitor_data = tempData;
    $scope.newunique_visitor_data = tempData;
    $scope.visit_data = tempData;
    $scope.avg_resp_time_data = tempData;
    $scope.throughput_data = tempData;
    $scope.apdex_data = tempData;
    $scope.err_rate_data = tempData;

}]);

app.controller('ap_visitExperience', ['$scope', '$location', 'ap_timeGroupService', 'apve_dataService', 'apve_KpiService', 'apve_service', 'apve_trendService', function ($scope, $location, ap_timeGroupService, apve_dataService, apve_KpiService, apve_service, apve_trendService) {
    $scope.currentHead = "访问体验";

    //指标
    $scope.defaultzhibiao = ap_timeGroupService[0];
    $scope.zhibiaos = ap_timeGroupService;

    //选择指标
    $scope.selectzb = function (id) {
        for (var i = 0; i < $scope.zhibiaos.length; i++) {
            if ($scope.zhibiaos[i].id == id) {
                $scope.defaultzhibiao = $scope.zhibiaos[i];
                $scope.page_view_data_p = barData("page_view");
                $scope.unique_visitor_data_p = barData("unique_visitor");
                $scope.newunique_visitor_data_p = barData("newunique_visitor");
                $scope.visit_data_p = barData("visit");
            }
        }
    };

    //列表展示
    $scope.itemtable = {
        head: apve_KpiService,
        body: apve_service,
        foot: 10,
        type: "ap_visitExperience"
    };

    var baroption = function (pieName) {
        return  {
            chart: {
                type: 'discreteBarChart',
                height: 200,
                tooltips: true,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 55
                },
                x: function (d) {
                    return d.label;
                },
                y: function (d) {
                    return d.value;
                },
                showValues: true,
                valueFormat: function (d) {
                    return d3.format(',')(d);
                },
                transitionDuration: 500,
                yAxis: {
                    axisLabel: pieName,
                    axisLabelDistance: 30
                }
            }
        };
    }

    var barData = function (kpi) {
        var kpiData = [];
        for (var i = 0; i < apve_dataService.length; i++) {
            var item = apve_dataService[i];
            var kpiValue = item[kpi];
            var name = item.name;
            var itemValue = [name, kpiValue];
            kpiData[i] = itemValue;
        }

        var topKpiValues = [];
        for (var index = 0; index < kpiData.length; index++) {
            topKpiValues[index] = {"label": kpiData[index][0], "value": kpiData[index][1]};
        }
        return [
            {key: kpi, values: topKpiValues}
        ];
    };

    $scope.avg_resp_time_p = baroption("响应时间最慢");
    $scope.loading_time_p = baroption("加载时间最慢");
    $scope.throughput_p = baroption("吞吐量最大");
    $scope.err_rate_p = baroption("错误率最多");

    $scope.avg_resp_time_data_p = barData("avg_resp_time");
    $scope.loading_time_data_p = barData("loading_time");
    $scope.throughput_data_p = barData("throughput");
    $scope.err_rate_data_p = barData("err_rate");

    //趋势对比
    var lineOption = function (axisLabelName) {
        return {
            chart: {
                type: 'lineChart',
                height: 200,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 65
                },
                x: function (d) {
                    return d[0];
                },
                y: function (d) {
                    return d[1];
                },
                color: d3.scale.category10().range(),
                useInteractiveGuideline: true,
                clipVoronoi: true,
                xAxis: {
                    tickFormat: function (d) {
                        return d3.time.format('%m/%d/%y')(new Date(d));
                    }
                },
                yAxis: {
                    axisLabelDistance: 30,
                    axisLabel: axisLabelName
                }
            }
        };
    }

    //趋势图
    $scope.page_view = lineOption("浏览量");
    $scope.unique_visitor = lineOption("用户数");
    $scope.newunique_visitor = lineOption("新用户数");
    $scope.visit = lineOption("访问次数");
    $scope.avg_resp_time = lineOption("平均响应时间");
    $scope.throughput = lineOption("吞吐量");
    $scope.apdex = lineOption("访问体验（apdex）");
    $scope.err_rate = lineOption("错误率");
    $scope.loading_time = lineOption("加载时间");

    var tempData = apve_trendService;
    $scope.page_view_data = tempData;
    $scope.unique_visitor_data = tempData;
    $scope.newunique_visitor_data = tempData;
    $scope.visit_data = tempData;
    $scope.avg_resp_time_data = tempData;
    $scope.throughput_data = tempData;
    $scope.apdex_data = tempData;
    $scope.err_rate_data = tempData;
    $scope.loading_time_data = tempData;

}]);

app.controller('ap_visitPath', ['$scope', '$location', function ($scope, $location) {

}]);

app.controller('ap_assignPageGroup', ['$scope', '$location', 'ap_assignPageService', 'ap_apgKpi', 'ap_apgDataService', function ($scope, $location, ap_assignPageService, ap_apgKpi, ap_apgDataService) {
    $scope.currentHead = $location.search().group;
    $scope.zhibiaos = [
        {name: "页面数量", value: Math.ceil(Math.random() * 100)},
        {name: "浏览量", value: Math.ceil(Math.random() * 100)},
        {name: "用户数", value: Math.ceil(Math.random() * 100)},
        {name: "新用户数", value: Math.ceil(Math.random() * 100)},
        {name: "访问次数", value: Math.ceil(Math.random() * 100)},
        {name: "转化次数", value: Math.ceil(Math.random() * 100)},
        {name: "平均响应时间", value: Math.ceil(Math.random() * 100)},
        {name: "吞吐量", value: Math.ceil(Math.random() * 100)},
        {name: "访问体验（apdex）", value: Math.ceil(Math.random() * 100)},
        {name: "错误率", value: Math.ceil(Math.random() * 100)}
    ];
    $scope.items = [];
    for (var i = 0; i < $scope.zhibiaos.length; i++) {
        $scope.items[i] = {name: $scope.zhibiaos[i].name, value: $scope.zhibiaos[i].value, cloumn: "col-sm-2"};
        if (i > 4) {
            break;
        }
    }

    //趋势对比
    var lineOption = function (axisLabelName) {
        return  {
            chart: {
                type: 'lineChart',
                height: 200,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 65
                },
                x: function (d) {
                    return d[0];
                },
                y: function (d) {
                    return d[1];
                },
                color: d3.scale.category10().range(),
                useInteractiveGuideline: true,
                clipVoronoi: true,
                xAxis: {
                    tickFormat: function (d) {
                        return d3.time.format('%m/%d/%y')(new Date(d));
                    }
                },
                yAxis: {
                    axisLabelDistance: 30,
                    axisLabel: axisLabelName
                }
            }
        };
    }

    $scope.page_view = lineOption("浏览量");
    $scope.unique_visitor = lineOption("用户数");
    $scope.newunique_visitor = lineOption("新用户数");
    $scope.visit = lineOption("访问次数");
    $scope.avg_resp_time = lineOption("平均响应时间");
    $scope.throughput = lineOption("吞吐量");
    $scope.loading_time = lineOption("平均加载时间");
    $scope.apdex = lineOption("访问体验（apdex）");
    $scope.err_rate = lineOption("错误率");

    var tempData = ap_assignPageService;
    $scope.page_view_data = tempData;
    $scope.unique_visitor_data = tempData;
    $scope.newunique_visitor_data = tempData;
    $scope.visit_data = tempData;
    $scope.avg_resp_time_data = tempData;
    $scope.throughput_data = tempData;
    $scope.loading_time_data = tempData;
    $scope.apdex_data = tempData;
    $scope.err_rate_data = tempData;

    var dataService = function () {
        var ds = [];
        for (var i = 0; i < ap_apgDataService.length; i++) {
            var row = ap_apgDataService[i];
            row.pageHref = "#/app/insure/ap_assignPage?page=" + row.name;
            ds[i] = row;
        }
        return ds;
    }

    //列表展示
    $scope.itemtable = {
        head: ap_apgKpi,
        body: dataService(),
        foot: 10,
        type: "ap_assignPageGroup",
        search: true
    };
}]);

app.controller('ap_assignPage', ['$scope', '$location', 'ap_assignPageService', 'ap_apKpi', 'ap_apDataService', function ($scope, $location, ap_assignPageService, ap_apKpi, ap_apDataService) {
    $scope.currentHead = $location.search().page;
    $scope.zhibiaos = [
        {name: "浏览量", value: Math.ceil(Math.random() * 100)},
        {name: "用户数", value: Math.ceil(Math.random() * 100)},
        {name: "新用户数", value: Math.ceil(Math.random() * 100)},
        {name: "访问次数", value: Math.ceil(Math.random() * 100)},
        {name: "转化次数", value: Math.ceil(Math.random() * 100)},
        {name: "平均响应时间", value: Math.ceil(Math.random() * 100)},
        {name: "加载时间", value: Math.ceil(Math.random() * 100)},
        {name: "访问体验(apdex)", value: Math.ceil(Math.random() * 100)},
        {name: "错误率", value: Math.ceil(Math.random() * 100)}
    ];
    $scope.items = [];
    for (var i = 0; i < $scope.zhibiaos.length; i++) {
        $scope.items[i] = {name: $scope.zhibiaos[i].name, value: $scope.zhibiaos[i].value, cloumn: "col-sm-2"};
        if (i > 4) {
            break;
        }
    }

    //趋势对比
    var lineOption = function (axisLabelName) {
        return  {
            chart: {
                type: 'lineChart',
                height: 200,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 65
                },
                x: function (d) {
                    return d[0];
                },
                y: function (d) {
                    return d[1];
                },
                color: d3.scale.category10().range(),
                useInteractiveGuideline: true,
                clipVoronoi: true,
                xAxis: {
                    tickFormat: function (d) {
                        return d3.time.format('%m/%d/%y')(new Date(d));
                    }
                },
                yAxis: {
                    axisLabelDistance: 30,
                    axisLabel: axisLabelName
                }
            }
        };
    }

    $scope.unique_visitor = lineOption("用户数");
    $scope.newunique_visitor = lineOption("新用户数");
    $scope.page_view = lineOption("浏览量");
    $scope.visit = lineOption("访问次数");
    $scope.avg_resp_time = lineOption("平均响应时间");
    $scope.throughput = lineOption("吞吐量");
    $scope.loading_time = lineOption("加载时间");
    $scope.apdex = lineOption("访问体验（apdex）");
    $scope.err_rate = lineOption("错误率");
    var tempData = ap_assignPageService;
    $scope.unique_visitor_data = tempData;
    $scope.newunique_visitor_data = tempData;
    $scope.page_view_data = tempData;
    $scope.visit_data = tempData;
    $scope.avg_resp_time_data = tempData;
    $scope.throughput_data = tempData;
    $scope.loading_time_data = tempData;
    $scope.apdex_data = tempData;
    $scope.err_rate_data = tempData;

    var dataService = function () {
        var ds = [];
        for (var i = 0; i < ap_apDataService.length; i++) {
            var row = ap_apDataService[i];
            ds[i] = row;
        }
        return ds;
    }

    //列表展示
    $scope.itemtable = {
        head: ap_apKpi,
        body: dataService(),
        foot: 10,
        type: "ap_assignPage",
        search: true
    };
}]);

app.controller('ap_assignPageGroupCompare', ['$scope', '$location', 'ap_apgcService', 'ap_apgcdService', function ($scope, $location, ap_apgcService, ap_apgcdService) {
    $scope.currentHead = $location.search().group;
    var lineOption = function (axisLabelName) {
        return  {
            chart: {
                type: 'lineChart',
                height: 200,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 65
                },
                x: function (d) {
                    return d[0];
                },
                y: function (d) {
                    return d[1];
                },
                color: d3.scale.category10().range(),
                useInteractiveGuideline: true,
                clipVoronoi: true,
                xAxis: {
                    tickFormat: function (d) {
                        return d3.time.format('%m/%d/%y')(new Date(d));
                    }
                },
                yAxis: {
                    axisLabelDistance: 30,
                    axisLabel: axisLabelName
                }
            }
        };
    }
    $scope.page_amount = lineOption("页面数量");
    $scope.page_view = lineOption("浏览量");
    $scope.unique_visitor = lineOption("用户数");
    $scope.newunique_visitor = lineOption("新用户数");
    $scope.visit = lineOption("访问次数");
    $scope.convert = lineOption("转化次数");
    $scope.avg_resp_time = lineOption("平均响应时间");
    $scope.throughput = lineOption("吞吐量");
    $scope.loading_time = lineOption("加载时间");
    $scope.apdex = lineOption("访问体验（apdex）");
    $scope.err_rate = lineOption("错误率");

    $scope.groupOrder = function (item) {
        if (item.code[0] >= 'A' && item.code[0] <= 'M') {
            return 'From A - M';
        }
        if (item.code[0] >= 'N' && item.code[0] <= 'Z') {
            return 'From N - Z';
        }
        if (item.code[0] >= 'a' && item.code[0] <= 'm') {
            return 'From A - M';
        }
        if (item.code[0] >= 'n' && item.code[0] <= 'z') {
            return 'From N - Z';
        }
    };

    $scope.area = ap_apgcService;
    $scope.multipleArea = {};
    $scope.multipleArea.selectedAreaWithGroupBy = [$scope.area[0]];

    if ($scope.multipleArea.selectedAreaWithGroupBy) {
        $scope.$watch('multipleArea.selectedAreaWithGroupBy', function (data) {
            var tempData = [], index = 0;
            for (var i = 0; i < ap_apgcdService.length; i++) {
                var name = ap_apgcdService[i].key;
                for (var j = 0; j < data.length; j++) {
                    if (name == data[j].name) {
                        tempData[index] = ap_apgcdService[i];
                        index++;
                    }
                }
            }
            $scope.page_amount_data = tempData;
            $scope.page_view_data = tempData;
            $scope.unique_visitor_data = tempData;
            $scope.newunique_visitor_data = tempData;
            $scope.visit_data = tempData;
            $scope.convert_data = tempData;
            $scope.avg_resp_time_data = tempData;
            $scope.throughput_data = tempData;
            $scope.loading_time_data = tempData;
            $scope.apdex_data = tempData;
            $scope.err_rate_data = tempData;
        }, true);
    }


}]);

app.controller('ap_assignPageCompare', ['$scope', '$location', 'ap_apcService', 'ap_apcdService', function ($scope, $location, ap_apcService, ap_apcdService) {
    $scope.currentHead = $location.search().page;
    var lineOption = function (axisLabelName) {
        return  {
            chart: {
                type: 'lineChart',
                height: 200,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 65
                },
                x: function (d) {
                    return d[0];
                },
                y: function (d) {
                    return d[1];
                },
                color: d3.scale.category10().range(),
                useInteractiveGuideline: true,
                clipVoronoi: true,
                xAxis: {
                    tickFormat: function (d) {
                        return d3.time.format('%m/%d/%y')(new Date(d));
                    }
                },
                yAxis: {
                    axisLabelDistance: 30,
                    axisLabel: axisLabelName
                }
            }
        };
    }
    $scope.page_view = lineOption("浏览量");
    $scope.unique_visitor = lineOption("用户数");
    $scope.newunique_visitor = lineOption("新用户数");
    $scope.visit = lineOption("访问次数");
    $scope.convert = lineOption("转化次数");
    $scope.avg_resp_time = lineOption("平均响应时间");
    $scope.throughput = lineOption("吞吐量");
    $scope.loading_time = lineOption("加载时间");
    $scope.apdex = lineOption("访问体验（apdex）");
    $scope.err_rate = lineOption("错误率");


    $scope.groupOrder = function (item) {
        if (item.code[0] >= 'A' && item.code[0] <= 'M') {
            return 'From A - M';
        }
        if (item.code[0] >= 'N' && item.code[0] <= 'Z') {
            return 'From N - Z';
        }
        if (item.code[0] >= 'a' && item.code[0] <= 'm') {
            return 'From A - M';
        }
        if (item.code[0] >= 'n' && item.code[0] <= 'z') {
            return 'From N - Z';
        }
    };
    $scope.area = ap_apcService;
    $scope.multipleArea = {};
    $scope.multipleArea.selectedAreaWithGroupBy = [$scope.area[0]];
    if ($scope.multipleArea.selectedAreaWithGroupBy) {
        $scope.$watch('multipleArea.selectedAreaWithGroupBy', function (data) {
            var tempData = [], index = 0;
            for (var i = 0; i < ap_apcdService.length; i++) {
                var name = ap_apcdService[i].key;
                for (var j = 0; j < data.length; j++) {
                    if (name == data[j].name) {
                        tempData[index] = ap_apcdService[i];
                        index++;
                    }
                }
            }

            $scope.page_view_data = tempData;
            $scope.unique_visitor_data = tempData;
            $scope.newunique_visitor_data = tempData;
            $scope.visit_data = tempData;
            $scope.convert_data = tempData;
            $scope.avg_resp_time_data = tempData;
            $scope.throughput_data = tempData;
            $scope.loading_time_data = tempData;
            $scope.apdex_data = tempData;
            $scope.err_rate_data = tempData;

        }, true);
    }
}]);

'use strict';

app.controller('product', ['$scope', '$location', '$state', 'pd_kpi1', 'pd_ds1', 'pd_kpi2', 'pd_ds2', 'pd_zb', 'pd_region', 'pd_source', 'pd_kpi3', 'pd_ds3', 'pd_kpi4', 'pd_ds4', 'pd_kpi5', 'pd_ds5', function ($scope, $location, $state, pd_kpi1, pd_ds1, pd_kpi2, pd_ds2, pd_zb, pd_region, pd_source, pd_kpi3, pd_ds3, pd_kpi4, pd_ds4, pd_kpi5, pd_ds5) {

    //柱状图选项
    var baroption = function (barName) {
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
                    axisLabel: barName,
                    axisLabelDistance: 30
                }
            }
        };
    };

    //柱状图数据
    var barData = function (kpi, datas) {
        var kpiData = [];
        for (var i = 0; i < datas.length; i++) {
            var item = datas[i];
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

    //柱状图数据
    var barData2 = function (kpi, datas) {
        var kpiData = [];
        for (var i = 0; i < datas.length; i++) {
            var item = datas[i];
            var kpiValue = item[kpi];
            var name = item.td0;
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

    //线图选项
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
    };

    //趋势数据
    var lineData = function (keys) {
        var time = new Date().getTime();
        var allReturn = [];
        for (var i = 0; i < keys.length; i++) {
            var values = [];
            for (var j = 0; j < 10; j++) {
                values[j] = [time + (j + 1) * 1000, Math.ceil(Math.random() * 100)];
            }
            allReturn[i] = {key: keys[i], values: values};
        }
        return allReturn;
    };

    //饼图选项
    var pieOption = function (axisLabelName) {
        return {
            chart: {
                type: 'pieChart',
                height: 200,
                x: function (d) {
                    return d.name;
                },
                y: function (d) {
                    return d.value;
                },
                showLabels: false,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                },
                tooltips: true,
                tooltipContent: function (key, y, e, graph) {
                    return'<p>' + e.point.rate + '</p>';
                }
            },
            caption: {
                enable: true,
                text: axisLabelName
            }
        };
    };

    var name = $location.search().name;

    var gl = function () {
    };

    var group = function () {
        if (null == name) {
            $scope.currentHead = "商品类别";

            $scope.bars = [
                {option: baroption("商品数"), data: barData2("td1", pd_ds1)},
                {option: baroption("销量"), data: barData2("td2", pd_ds1)},
                {option: baroption("销售额"), data: barData2("td3", pd_ds1)},
                {option: baroption("访问次数"), data: barData2("td4", pd_ds1)},
                {option: baroption("浏览量"), data: barData2("td5", pd_ds1)},
                {option: baroption("用户数"), data: barData2("td6", pd_ds1)}
            ];

            var kpis = ["类别1", "类别2", "类别3", "类别4", "类别5"];
            $scope.lines = [
                {option: lineOption("商品数"), data: lineData(kpis)},
                {option: lineOption("销量"), data: lineData(kpis)},
                {option: lineOption("销售额"), data: lineData(kpis)},
                {option: lineOption("访问次数"), data: lineData(kpis)},
                {option: lineOption("浏览量"), data: lineData(kpis)},
                {option: lineOption("用户数"), data: lineData(kpis)}
            ];

            var dataService = function (datasource) {
                var ds = [];
                for (var i = 0; i < datasource.length; i++) {
                    var row = datasource[i];
                    row.pageHref = "#/app/insure/pd_subgroup?name=" + row.td0;
                    ds[i] = row;
                }
                return ds;
            };

            //列表展示
            $scope.itemtable = {
                head: pd_kpi1,
                body: dataService(pd_ds1),
                foot: 10,
                type: "marketing",
                search: true
            };

        } else {

            $scope.return = "app.insure.pd_group";
            $scope.currentHead = name;

            $scope.bars = [
                {option: baroption("浏览量"), data: barData2("td1", pd_ds2)},
                {option: baroption("用户数"), data: barData2("td2", pd_ds2)},
                {option: baroption("新用户数"), data: barData2("td3", pd_ds2)},
                {option: baroption("加入购物车"), data: barData2("td4", pd_ds2)},
                {option: baroption("订购量"), data: barData2("td5", pd_ds2)},
                {option: baroption("订购金额"), data: barData2("td6", pd_ds2)}
            ];

            var kpis = ["商品1", "商品2", "商品3", "商品4", "商品5"];
            $scope.lines = [
                {option: lineOption("浏览量"), data: lineData(kpis)},
                {option: lineOption("用户数"), data: lineData(kpis)},
                {option: lineOption("新用户数"), data: lineData(kpis)},
                {option: lineOption("加入购物车"), data: lineData(kpis)},
                {option: lineOption("订购量"), data: lineData(kpis)},
                {option: lineOption("订购金额"), data: lineData(kpis)}
            ];

            var dataService = function (datasource) {
                var ds = [];
                for (var i = 0; i < datasource.length; i++) {
                    var row = datasource[i];
                    row.pageHref = "#/app/insure/pd_produce?name=" + row.td0;
                    ds[i] = row;
                }
                return ds;
            };

            //列表展示
            $scope.itemtable = {
                head: pd_kpi2,
                body: dataService(pd_ds2),
                foot: 10,
                type: "marketing",
                search: true
            };
        }
    };

    var product = function () {

        $scope.return = "app.insure.pd_group";
        $scope.currentHead = name;

        $scope.items = [];
        for (var i = 0; i < pd_zb.length; i++) {
            $scope.items[i] = {name: pd_zb[i].name, value: pd_zb[i].value, cloumn: "col-sm-2"};
            if (i > 4) {
                break;
            }
        }

        var kpis = ["当前", "昨日", "上周同日", "上月同日"];
        $scope.lines = [
            {option: lineOption("销量"), data: lineData(kpis)},
            {option: lineOption("浏览量"), data: lineData(kpis)},
            {option: lineOption("用户数"), data: lineData(kpis)},
            {option: lineOption("新用户数"), data: lineData(kpis)},
            {option: lineOption("加入购物车次数"), data: lineData(kpis)},
            {option: lineOption("被收藏次数"), data: lineData(kpis)},
            {option: lineOption("订购量"), data: lineData(kpis)},
            {option: lineOption("订单量"), data: lineData(kpis)},
            {option: lineOption("销售额"), data: lineData(kpis)},
            {option: lineOption("退货量"), data: lineData(kpis)}
        ];

        $scope.pies = [
            {option: pieOption("区域"), data: pd_region },
            {option: pieOption("来源"), data: pd_source }
        ];

        //列表展示
        $scope.itemtable = {
            head: pd_kpi3,
            body: pd_ds3,
            foot: 10,
            type: "marketing"
        };

        //列表展示
        $scope.itemtable2 = {
            head: pd_kpi4,
            body: pd_ds4,
            foot: 10,
            type: "marketing"
        };
    };

    var search = function () {
        $scope.currentHead = "商品查询";

        $scope.items = [];
        for (var i = 0; i < pd_zb.length; i++) {
            $scope.items[i] = {name: pd_zb[i].name, value: pd_zb[i].value, cloumn: "col-sm-2"};
            if (i > 4) {
                break;
            }
        }

        var kpis = ["当前", "昨日", "上周同日", "上月同日"];
        $scope.lines = [
            {option: lineOption("销量"), data: lineData(kpis)},
            {option: lineOption("浏览量"), data: lineData(kpis)},
            {option: lineOption("用户数"), data: lineData(kpis)},
            {option: lineOption("新用户数"), data: lineData(kpis)},
            {option: lineOption("加入购物车次数"), data: lineData(kpis)},
            {option: lineOption("被收藏次数"), data: lineData(kpis)},
            {option: lineOption("订购量"), data: lineData(kpis)},
            {option: lineOption("订单量"), data: lineData(kpis)},
            {option: lineOption("销售额"), data: lineData(kpis)},
            {option: lineOption("退货量"), data: lineData(kpis)}
        ];

        $scope.pies = [
            {option: pieOption("区域"), data: pd_region },
            {option: pieOption("来源"), data: pd_source }
        ];

        //列表展示
        $scope.itemtable = {
            head: pd_kpi3,
            body: pd_ds3,
            foot: 10,
            type: "marketing"
        };

        //列表展示
        $scope.itemtable2 = {
            head: pd_kpi4,
            body: pd_ds4,
            foot: 10,
            type: "marketing"
        };
    };

    var manager = function () {
        $scope.currentHead = "商品管理";
        //列表展示
        $scope.itemtable = {
            head: pd_kpi5,
            body: pd_ds5,
            foot: 10,
            type: "marketing"
        };
    };

    if ($state.includes("app.insure.pd_group")) {
        $scope.searchProduct = false;
        group();
    }
    else if ($state.includes("app.insure.pd_subgroup")) {
        $scope.searchProduct = false;
        group();
    }
    else if ($state.includes("app.insure.pd_produce")) {
        $scope.searchProduct = false;
        product();
    }
    else if ($state.includes("app.insure.pd_search")) {
        $scope.searchProduct = true;
        search();
    }
    else if ($state.includes("app.insure.pd_manager")) {
        $scope.searchProduct = false;
        manager();
    }
    else {
        gl();
    }
}])
;

app.controller('product_assign', ['$scope', '$location', '$state', function ($scope, $location, $state) {
    //柱状图选项
    var baroption = function (barName) {
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
                    axisLabel: barName,
                    axisLabelDistance: 30
                }
            }
        };
    };

    //柱状图数据
    var barData = function (kpi, datas) {
        var kpiData = [];
        for (var i = 0; i < datas.length; i++) {
            var item = datas[i];
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

    //柱状图数据
    var barData2 = function (kpi, datas) {
        var kpiData = [];
        for (var i = 0; i < datas.length; i++) {
            var item = datas[i];
            var kpiValue = item[kpi];
            var name = item.td0;
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

    //线图选项
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
    };

    //趋势数据
    var lineData = function (keys) {
        var time = new Date().getTime();
        var allReturn = [];
        for (var i = 0; i < keys.length; i++) {
            var values = [];
            for (var j = 0; j < 10; j++) {
                values[j] = [time + (j + 1) * 1000, Math.ceil(Math.random() * 100)];
            }
            allReturn[i] = {key: keys[i], values: values};
        }
        return allReturn;
    };

    //饼图选项
    var pieOption = function (axisLabelName) {
        return {
            chart: {
                type: 'pieChart',
                height: 200,
                x: function (d) {
                    return d.name;
                },
                y: function (d) {
                    return d.value;
                },
                showLabels: false,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                },
                tooltips: true,
                tooltipContent: function (key, y, e, graph) {
                    return'<p>' + e.point.rate + '</p>';
                }
            },
            caption: {
                enable: true,
                text: axisLabelName
            }
        };
    };

    var gl = function () {
    };

    var group = function () {
    };

    var search = function () {
    };

    var manager = function () {
    };

    if ($state.includes("app.insure.pd_group")) {
        group();
    }
    else if ($state.includes("app.insure.pd_search")) {
        search();
    }
    else if ($state.includes("app.insure.pd_manager")) {
        manager();
    }
    else {
        gl();
    }
}]);
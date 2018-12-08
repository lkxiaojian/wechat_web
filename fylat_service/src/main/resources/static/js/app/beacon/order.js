'use strict';

app.controller('order', ['$scope', '$location', '$state', function ($scope, $location, $state) {

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

    var region = function () {
    };

    var terminal = function () {
    };

    var user = function () {
    };

    var source = function () {
    };

    if ($state.includes("app.insure.od_Region")) {
        region();
    }
    else if ($state.includes("app.insure.od_terminal")) {
        terminal();
    }
    else if ($state.includes("app.insure.od_user")) {
        user();
    }
    else if ($state.includes("app.insure.od_source")) {
        source();
    }
    else {
        gl();
    }
}]);


app.controller('order_assign', ['$scope', '$location', '$state', function ($scope, $location, $state) {
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

    var region = function () {
    };

    var terminal = function () {
    };

    var user = function () {
    };

    var source = function () {
    };

    if ($state.includes("app.insure.od_Region")) {
        region();
    }
    else if ($state.includes("app.insure.od_terminal")) {
        terminal();
    }
    else if ($state.includes("app.insure.od_user")) {
        user();
    }
    else if ($state.includes("app.insure.od_source")) {
        source();
    }
    else {
        gl();
    }
}]);

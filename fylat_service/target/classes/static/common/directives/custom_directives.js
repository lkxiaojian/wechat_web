'use strict';
var customEcharts = null;  //charts实例
/**
 * 表格指令
 */
app.directive('tableDirective', ['$timeout',
    function ($timeout) {
        return {
            restrict: 'EA',
            // template: '<div><table id="events-table"></table></div>',
            scope: {
                tableoption: "=?",
                instance: '=?'
            },
            link: function ($scope, element, attrs, contr) {
                $timeout(function () {
                    var tableH;
                    var pageSize = 10;
                    if (element.hasClass('crtlh')) {
                        var nT = element.offset().top;
                        nT = (nT < 100 ? 132 : nT);
                        tableH = $(window).height() - nT - 10;
                        pageSize = Math.round((tableH - 147) / 40);
                        pageSize = (pageSize > 0 ? pageSize : 10);
                    } else if (element.hasClass('half')) {
                        var nT = element.offset().top;
                        nT = (nT < 100 ? 132 : nT);
                        tableH = $(window).height() / 2 - nT - 65;
                    } else if (element.hasClass('fixh')) {
                        tableH = 280;
                    } else if (element.hasClass('tp10h')) {
                        tableH = 485;
                    } else {
                        tableH = 400;
                    }
                    var toption = {
                        cache: false,
                        sortable: false,
                        height: tableH,
                        striped: true,
                        queryParamsType: '',
                        showToggle: false,
                        pagination: true,
                        pageSize: pageSize,
                        pageList: [20, 50, 100, 150, 200],
                        search: false,
                        showColumns: false,
                        showRefresh: false,
                        clickToSelect: false,
                        sidePagination: 'server'
                    };
                    $scope.$watch('tableoption', function (tableoption, olddata) {
                        if (tableoption) {
                            var parm = $.extend({}, toption, tableoption);
                            $scope.instance = element.bootstrapTable(parm);
                        }
                    }, true);
                    var timeout = null;
                    $(window).resize(function () {
                        clearTimeout(timeout);
                        timeout = setTimeout(function () {
                            $scope.instance.bootstrapTable('resetView');
                        }, 500)
                    });
                }, 1000);
            }

        };
    }]);
/**
 * ui高度指令
 */
app.directive('uiHeight', [
    function () {
        return {
            restrict: 'AE',
            scope: true,
            link: function ($scope, $element, $attrs) {
                var height = document.body.offsetHeight - 50;
                $element[0].style.height = height + "px";
            }
        };
    }]);
/**
 * uiSortable指令
 */
app.directive('uiSortable', [
    function () {
        return {
            restrict: 'AE',
            scope: true,
            link: function ($scope, $element, $attrs) {
                $element.sortable();
                $element.disableSelection();
            }
        };
    }]);
/**
 *  echarts-指令（柱状图，折线图，仪表图,气压图）
 * 事例：<div echarts linedata="rhuData_station_online" style="height: 220px;"></div>
 * linedata 折线图
 * rhuData_station_online 绘制图表需要的数据
 * 注意：使用echarts需要指定高度
 */
/**
 *
 */
app.directive('echarts', ['echartsConfigService', 'userMenuService', '$filter', '$state', function (echartsConfigService, userMenuService, $filter, $state) {
    return {
        restrict: 'AE',
        //父子作用域-数据双向绑定
        scope: {
            pieHollowData: '=',
            gaugedata: '=',
            piedata: '=',
            barverticaldata: '=',
            linedata: '=',
        },
        link: function ($scope, element, attrs, ctrl) {
            /**
             * 环形图（多个）
             */
            $scope.$watch('pieHollowData', function (pieHollowData) {
                if (pieHollowData) {
                    element[0].style = 'height:300px';
                    if (pieHollowData.legend) {
                        var option = echartsConfigService.annularOption();
                        //设置标题信息
                        option.title.text = pieHollowData.title.text;
                        option.title.subtext = pieHollowData.title.subtext;
                        //设置元素高度（先得出分几层，每层3个图表）
                        var eleTier = pieHollowData.legend.length / 3;
                        if (legend.length / 3 != 0) {
                            eleTier = eleTier + 1;
                        }
                        element[0].style = 'height:' + 250 * eleTier + 'px';
                        //循环设置legend
                        var legend = [];
                        for (var k in pieHollowData.legend.data) {
                            legend.push(k);
                        }
                        option.legend.data(legend);
                        //循环设置series
                        var demoSeries = $.extend(true, {}, option.series[0]);
                        for (var i = 0; i < pieHollowData.series.length; i++) {
                            if (i != 0) {
                                option.series.push($.extend(true, {}, demoSeries));
                            }
                            option.series[i].center = gaugedata[i].center;
                            option.series[i].data.name = gaugedata[i].data.name;
                            option.series[i].data.value = gaugedata[i].data.value;
                        }
                        ;
                        customEcharts = echarts.init(element[0]).setOption(option);
                    } else {
                        //customEcharts = echarts.init(element[0]).setOption({series: [{}]});
                        option = echartsConfigService.annularOption();
                        customEcharts = echarts.init(element[0]).setOption(option);

                    }

                    $(window).resize(function () {
                        customEcharts.resize();
                    });
                }
            });
            //饼图
            $scope.$watch('piedata', function (piedata) {
                if (piedata) {
                    if (piedata.legend) {
                        var option = echartsConfigService.pieOption();
                        option.title = {
                            text: piedata.title.text,
                            subtext: piedata.title.subtext,
                            x: 'center'
                        };
                        //循环设置legend
                        for (var k in piedata.legend) {
                            option.legend.data.push(piedata.legend[k]);
                        }
                        //循环设置series
                        for (var i = 0; i < piedata.series; i++) {
                            option.series.push({
                                name: piedata.series.name,
                                type: 'pie',
                                radius: '55%',
                                center: piedata.series.center,
                                data: piedata.series.data,
                            });
                        }
                        ;

                        customEcharts = echarts.init(element[0]).setOption(option);
                    } else {
                        customEcharts = echarts.init(element[0]).setOption({series: [{}]});
                    }

                    $(window).resize(function () {
                        customEcharts.resize();
                    });
                }
            });
            /**
             * 仪表图：多个仪表(
             * param: gaugedata{
             *         name   名称
             *         data   使用率
             *         center 中心点位置
             *        }
             */
            $scope.$watch('gaugedata', function (gaugedata) {
                if (gaugedata) {
                    //引入默认样式
                    var option = echartsConfigService.normalGauge();
                    var demoSeries = $.extend(true, {}, option.series[0]);
                    //循环设置每个仪表数据
                    for (var i = 0; i < gaugedata.length; i++) {
                        if (i != 0) {
                            option.series.push($.extend(true, {}, demoSeries));
                        }
                        option.series[i].name = gaugedata[i].name;
                        option.series[i].data = gaugedata[i].data;
                        option.series[i].center = gaugedata[i].center;
                    }
                    //初始化echarts，绘制图
                    customEcharts = echarts.init(element[0]).setOption(option);
                    // customEcharts.refresh();
                    console.log(JSON.stringify(option));
                    //当窗口大小发生改变时
                    $(window).resize(function () {
                        customEcharts.resize();
                    });
                }
            });
            //气压图
            $scope.$watch('barverticaldata', function (barverticaldata) {
                if (barverticaldata) {
                    /*
                     * legendSet是图例的名称；
                     * xData是横轴的标注
                     * featureSet是画折线的数据
                     */
                    var xData = barverticaldata.xData, featureSet = barverticaldata.featureSet,
                        legendSet = barverticaldata.legendSet;
                    var yAxisLabelFormatter = barverticaldata.yAxisLabelFormatter;
                    if (xData[0]) {
                        var option = echartsConfigService.barVerticalOption();
                        for (var k in legendSet) {
                            option.legend.data.push(legendSet[k]);
                        }
                        option.xAxis[0].data = xData;
                        option.yAxis[0].axisLabel.formatter = yAxisLabelFormatter;
                        for (var f in featureSet) {
                            option.series.push({
                                name: legendSet[f],
                                type: 'bar',
                                smooth: true,
                                data: featureSet[f],
                                markPoint: {
                                    data: [
                                        {type: 'max', name: '最大值'},
                                        {type: 'min', name: '最小值'}
                                    ]
                                },
                                markLine: {
                                    data: [
                                        {type: 'average', name: '平均值'}
                                    ]
                                }
                            });
                        }
                        customEcharts = echarts.init(element[0]).setOption(option);
                    } else {
                        customEcharts = echarts.init(element[0]).setOption({series: [{}]});
                    }
                    $(window).resize(function () {
                        customEcharts.resize();
                    });
                }
            });
            //折线图
            $scope.$watch('linedata', function (linedata) {
                if (linedata) {
                    /*
                     * legendSet是图例的名称；
                     * xData是横轴的标注
                     * featureSet是画折线的数据
                     */
                    var xData = linedata.xData, featureSet = linedata.featureSet, legendSet = linedata.legendSet;
                    var yAxisLabelFormatter = linedata.yAxisLabelFormatter;
                    var yAxisName = linedata.yAxisName;
                    if (xData[0]) {
                        var option = echartsConfigService.nomalLine();
                        for (var k in legendSet) {
                            option.legend.data.push(legendSet[k]);
                        }
                        option.xAxis[0].data = xData;
                        option.yAxis[0].axisLabel.formatter = yAxisLabelFormatter;
                        option.yAxis[0].name = yAxisName;
                        for (var f in featureSet) {
                            option.series.push({
                                name: legendSet[f],
                                type: 'line',
                                smooth: true,
                                data: featureSet[f],
                                // itemStyle: {
                                //   normal: {
                                //       lineStyle: {
                                //           color:
                                //       }
                                //   }
                                // },

                                markPoint: featureSet[f].markPoint ? featureSet[f].markPoint : {
                                    data: [{
                                        type: 'max',
                                        name: '最大值'
                                    }, {type: 'min', name: '最小值'}]
                                }
                                ,
                                // markPoint : {
                                //     data : [
                                //         {type : 'max', name: '最大值'},
                                //         {type : 'min', name: '最小值'}
                                //     ]
                                // },
                                markLine: {
                                    data: [
                                        {type: 'average', name: '平均值'}
                                    ]
                                }
                            });
                        }
                        customEcharts = echarts.init(element[0]).setOption(option);
                    } else {
                        customEcharts = echarts.init(element[0]).setOption({series: [{}]});
                    }

                    $(window).resize(function () {
                        customEcharts.resize();
                    });
                }
            });
        }
    };
}])
/**
 * echartsTag指令
 */
app.directive('echartsTag', [
    function () {
        return {
            restrict: 'AE',
            scope: {
                options: '=',
                funcs: '='
            },
            link: function ($scope, $element, $attrs) {
                $scope.attr = [];
                var ifIn = false;
                var x = $element[0].offsetWidth;
                var y = $element[0].offsetHeight;
                var WH = {
                    x: x,
                    y: y
                }
                if ($scope.funcs && $scope.funcs._getWH) {
                    $scope.funcs._getWH(WH);
                }
                $scope.$watch("options", function (newVal, oldVal) {
                    if (null == newVal) {
                        return;
                    }
                    $scope.myChart = echarts.init($element[0]);
                    $scope.myChart.showLoading({
                        text: '加载中',
                        effect: 'spin',
                        effectOption: {
                            backgroundColor: "#fff"
                        },
                        textStyle: {
                            color: 'black'
                        }
                    });
                    if (ifIn || newVal.isDebug) {
                        if ($scope.myChart && $scope.myChart.dispose) {
                            $scope.myChart.dispose();
                        }
                        if (newVal.series && !newVal.series[0]) {
                            $scope.myChart = echarts.init($element[0]);
                            $scope.myChart.showLoading({
                                text: '没有数据',
                                effect: 'bubble',
                                effectOption: {
                                    effect: {
                                        n: 0
                                    }
                                },
                                textStyle: {
                                    color: 'black'
                                }
                            });
                        }
                        else if (newVal.series && newVal.series[0]) {
                            $scope.myChart = echarts.init($element[0]);
                            $scope.myChart.setOption(newVal);
                            $scope.myChart.on('click', function (data) {
                                if ($scope.funcs && $scope.funcs._click) {
                                    $scope.funcs._click(data);
                                }
                            });
                            window.addEventListener('resize', function () {
                                $scope.myChart.resize();
                            }, false);
                        }
                        else {
                            $scope.myChart = echarts.init($element[0]);
                            $scope.myChart.showLoading({
                                text: '没有数据',
                                effect: 'bubble',
                                effectOption: {
                                    effect: {
                                        n: 0
                                    }
                                },
                                textStyle: {
                                    color: 'black'
                                }
                            });
                        }
                    }
                    ifIn = true;
                }, true);
            }
        };
    }]);
/**
 * showinfo指令
 */
app.directive('showinfo', ['$filter', function ($filter) {
    var colors = {device: '24E523', os: 'FFFF27', browser: 'FF7D27', isp: 'DF2291', region: 'FF2727'};
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            /*function translateDictionaryId(key){
             $.each(scope.Dictionary,function(i,k){
             $.each(k.content);
             });
             }*/
            scope.$watch('publicprm', function (n, o) {
                if (n) {
                    setTimeout(function () {
                        var dfg = $(document.createDocumentFragment());
                        $.each(n, function (pk, pv) {
                            $.each(pv, function (k, v) {
                                if (v) {
                                    var key = k;
                                    var strkey;
                                    if (pk == 'region') {
                                        key = $filter("translate")(k);
                                        strkey = key;
                                    } else {
                                        strkey = scope.showinfobj[key];
                                    }
                                    var espan = $('<span class="btn btn-info btn-xs m-r-xss m-b-xs no-border text-overflow" title=\"' + strkey + '\">' + strkey + '</span>')
                                        .click(function (e) {
                                            console.log(1)
                                            e.stopPropagation();
                                            scope.$apply(function () {
                                                delete scope.publicprm[pk][k];
                                                scope.getprm();
                                            })
                                        })
                                        .css('background', '#' + colors[pk]);
                                    dfg.append(espan);
                                } else {
                                    delete scope.publicprm[pk][k];
                                }
                            });
                        });
                        element.html(dfg);
                    });

                }
            }, true);
        }
    }
}]);
/**
 * selectPage指令
 */
app.directive('selectPage', [function () {
    return {
        restrict: 'EA',
        scope: {
            selectPageData: "=?",
            instance: "=?"
        },
        link: function ($scope, element, attrs, contr) {
            $scope.$watch('selectPageData', function (selectPageData, oldVal) {
                if (selectPageData && selectPageData !== oldVal) {
                    var container = angular.element('.sp_container');
                    if (container.length == 0) {
                        element.bSelectPage({
                            showField: selectPageData.name,
                            keyField: selectPageData.id,
                            data: selectPageData.data,
                            formatItem: selectPageData.formatter,
                            callback: selectPageData.callback
                        })
                    }
                }
            }, true)
        }
    };
}]);
/**
 * marquee指令
 */
app.directive('marquee', [function () {
    return {
        restrict: 'EA',
        link: function ($scope, element, attrs, contr) {
            element.marquee();
        }
    }
}]);
/**
 * 树状菜单
 */
app.directive('dhtmlxTree', ['$http', 'rowData', function ($http, rowData) {
    return {
        restrict: 'AE',
        scope: {
            usermes: '=',
            roleid: '=',
            groupid: '='
        },
        link: function (scope, element, attrs) {
            var myTree;
            var menuIds = '';
            var unChecked = '';
            var groupCode = '';

            var createTree = function () {
                if (scope.groupid) {
                    groupCode = scope.groupid;
                } else if (scope.usermes) {
                    groupCode = scope.usermes.userType;
                }

                myTree = new dhtmlXTreeObject('treeboxbox_tree', '100%', '100%', 0);
                myTree.setImagePath("./vendor/dhtmlx/imgs/dhxtree_skyblue/");
                myTree.enableCheckBoxes(1);
                myTree.enableThreeStateCheckboxes(true);
                myTree.enableTreeImages(false);

                myTree.setOnLoadingEnd(function () {
                    //设置字体，以区分菜单节点和功能节点
                    var array = myTree.getAllSubItems(0).split(',');
                    for (var i = 0; i < array.length; i++) {
                        var level = myTree.getLevel(array[i]);
                        if (level == 1 || level == 2) {
                            myTree.setItemStyle(array[i], 'color:#616b88; font-weight: bold;');
                        }
                    }
                    //禁用掉跟节点，保证array变量不包括根节点
                    myTree.disableCheckbox(0, true);

                    //根据不同的情况选中相应的节点
                    var url = '', pobj = {}
                    if (scope.groupid) {
                        url = 'group/manager?view=selectMenuIds';
                        pobj = {groupCode: scope.groupid};
                    } else if (scope.usermes) {
                        var user = scope.usermes;
                        url = 'user/manager?view=selectMenu';
                        pobj = {userId: user.userId, parentId: user.parentId, userType: user.userType};
                    } else if (scope.roleid) {
                        url = 'role/manager?view=selectMenu';
                        pobj = {roleId: scope.roleid};
                    }

                    //处理节点选中
                    $http({
                        url: url,
                        params: pobj
                    }).success(function (data) {
                        var checkIds = data.result;
                        for (var i = 0; i < checkIds.length; i++) {
                            myTree.setCheck(checkIds[i].menu_id, true);
                        }
                        var array = myTree.getAllCheckedBranches().split(',');
                        for (var i = 0; i < array.length; i++) {
                            for (var j = 0; j < checkIds.length; j++) {
                                if (array[i] == checkIds[j].menu_id) {
                                    if (checkIds[j].is_role == 1 && scope.usermes) {//用户列表：模块授权情景
                                        myTree.disableCheckbox(checkIds[j].menu_id, true);
                                    }
                                    break;
                                }
                                if (j == checkIds.length - 1) {
                                    myTree.setCheck(array[i], false);
                                }
                            }
                        }
                        menuIds = myTree.getAllCheckedBranches();
                        rowData[0] = menuIds;
                        unChecked = myTree.getAllUnchecked();
                        rowData[1] = unChecked;
                    });
                });

                myTree.setOnCheckHandler(function (id, state) {
                    menuIds = myTree.getAllCheckedBranches();
                    rowData[0] = menuIds;
                    unChecked = myTree.getAllUnchecked();
                    rowData[1] = unChecked;
                });

                //加载所有树节点
                $http({
                    url: 'user/menu',
                    params: {groupCode: groupCode}
                }).success(function (data) {
                    myTree.parse(data.result, 'json');
                });
            };
            createTree();
        }
    };
}]);
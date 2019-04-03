'use strict';
var customEcharts = null;  //charts实例
var pieEchart = null, worldEcharts = null, chinaEcharts = null, provinceEcharts = null, barverticalEcharts = null,
    levelbarverticalEcharts = null, areaEcharts = null;
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
                            if ($scope.instance) {
                                $scope.instance.bootstrapTable('resetView');
                            }
                        }, 500)
                    });
                }, 1000);
            }

        };
    }])
    .directive('uiHeight', [
        function () {
            return {
                restrict: 'AE',
                scope: true,
                link: function ($scope, $element, $attrs) {
                    var height = document.body.offsetHeight - 50;
                    $element[0].style.height = height + "px";
                }
            };
        }])

    .directive('uiSortable', [
        function () {
            return {
                restrict: 'AE',
                scope: true,
                link: function ($scope, $element, $attrs) {
                    $element.sortable();
                    $element.disableSelection();
                }
            };
        }])
    /**
     *  echarts-指令（柱状图，折线图，仪表图,气压图）
     * 事例：<div echarts linedata="rhuData_station_online" style="height: 220px;"></div>
     * linedata 折线图
     * rhuData_station_online 绘制图表需要的数据
     * 注意：使用echarts需要指定高度
     */
    /**
     * 如果使用modal去渲染echarts需要主动设置一下外层的div width的px宽度，否则echarts无法主动刷新
     */
    .directive('echarts', ['echartsConfigService', 'userMenuService', '$filter', '$state', function (echartsConfigService, userMenuService, $filter, $state) {
        return {
            restrict: 'AE',
            scope: {
                piedata: '=',
                barverticaldata: '=',
                linedata: '=',
                categorydata: '='

            },
            link: function ($scope, element, attrs, ctrl) {
                //散点图
                $scope.$watch('categorydata', function (categorydata) {
                    if (categorydata) {
                        var option = echartsConfigService.categoryOption();
                        customEcharts = echarts.init(element[0]).setOption(option);
                        // console.log(JSON.stringify(option));
                        $(window).resize(function () {
                            customEcharts.resize();
                        });
                    }

                });
                //饼图
                $scope.$watch('piedata', function (piedata) {
                    if (piedata) {
                        //console.log(JSON.stringify(option));
                        if (piedata.series) {
                            //element[0].remove();
                            var option = echartsConfigService.pieOption();
                            option.title = {
                                text: piedata.title.text,
                                subtext: piedata.title.subtext,
                                x: 'left'
                            };
                            //循环设置legend
                            option.legend.data = piedata.legend.data;
                            //循环设置series
                            option.series[0].data = piedata.series.data;


                            pieEchart = echarts.init(element[0]).setOption(option);
                        } else {
                            var option = echartsConfigService.pieOption();
                            pieEchart = echarts.init(element[0]).setOption(option);

                        }

                        $(window).resize(function () {
                            pieEchart.resize();
                        });
                    }
                });
                $scope.$watch('barverticaldata', function (barverticaldata) {
                    if (barverticaldata) {
                        /*
                         * legendSet是图例的名称；
                         * xData是横轴的标注
                         * featureSet是画折线的数据
                         */
                        var xData = barverticaldata.xData, featureSet = barverticaldata.featureSet,
                            legendSet = barverticaldata.legendSet;
                        // var title=barverticaldata.title;
                        var title='';
                        // var yAxisLabelFormatter = barverticaldata.yAxisLabelFormatter;
                        if (xData[0]) {
                            var option = echartsConfigService.barVerticalOption();
                            for (var k in legendSet) {
                                option.legend.data.push(legendSet[k]);
                            }
                            if (title){
                                option.title.text=title;
                            }
                            option.xAxis[0].data = xData;
                            // option.yAxis[0].axisLabel.formatter = yAxisLabelFormatter;
                            for (var f in featureSet) {
                                option.series.push({
                                    name: legendSet[f],
                                    type: 'bar',
                                    smooth: true,
                                    data: featureSet[f],
                                    markPoint: {
                                        data: [
                                            {type: 'max', name: '最大值',symbolSize:5},
                                            {type: 'min', name: '最小值',symbolSize:5}
                                        ]
                                    },
                                    markLine: {
                                        data: [
                                            {type: 'average', name: '平均值',symbolSize:5}
                                        ]
                                    }
                                });
                            }
                            barverticalEcharts = echarts.init(element[0]).setOption(option);
                        } else {
                            barverticalEcharts = echarts.init(element[0]).setOption({series: [{}]});
                        }
                        $(window).resize(function () {
                            barverticalEcharts.resize();
                        });
                    }
                });

                $scope.$watch('linedata', function (linedata, olddata) {
                    if (linedata) {
                        if (linedata) {
                            var lineoption = echartsConfigService.nomalLine();
                            var parm = $.extend({}, lineoption, linedata);
                            areaEcharts = echarts.init(element[0]).setOption(parm);
                        } else {
                            areaEcharts = echarts.init(element[0]).setOption({series: [{}]});
                        }
                        $(window).resize(function () {
                            areaEcharts.resize();
                        });

                    }

                }, true);


            }
        };
    }])
    .directive('echartsTag', [
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
        }])

    .directive('showinfo', ['$filter', function ($filter) {
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
                                                // console.log(1)
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
    }])
    .directive('selectPage', [function () {
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
    }])
    .directive('marquee', [function () {
        return {
            restrict: 'EA',
            link: function ($scope, element, attrs, contr) {
                element.marquee();
            }
        }
    }])
;

//insure工程指令
//横向百分比柱状条
/*app.directive('percentbar', [function () {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            molecule: '=',
            denominator: '='
        },
        template: '<div style="position: relative; z-index: 0; background: #c6efd0;">' +
        '<div style="position: absolute; z-index: -1; top: 0px; left: 0px; background: #b0e1f1; height: 100%;"></div>' +
        '<span></span>' +
        '</div>',
        link: function (scope, element, attrs) {
            var percent = parseInt((scope.molecule / scope.denominator) * 100) + '%';
            element.find('span').html(scope.molecule + '(' + percent + ')');
            element.find('div').css('width', percent);
        }
    };
}]);*/
//树状菜单
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

                myTree = new dhtmlXTreeObject(attrs.id, '100%', '100%', 0);
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
                    var url = '', pobj = {};
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


var mapsNone = false;
/**
 * A、btnCommon标签说明：
 * 1、该标签的功能用于权限管理，判断某个用户是否有某个操作权限
 * 2、如当前页面跳转链接：app.insure.dataOrder_orderApplyList,在这个页面中有一个审批按钮如下：
 * <a btn-common route-flag="approve" btn-flag="a" class="a-approve a-blue" href="javascript:;"/>
 * B、如何使用
 * 1、需要使用super用户在功能管理菜单上增加该操作的链接，如控制当前审批按钮，取出当前页面的链接：app.insure.dataOrder_orderApplyList 再加下划线，再加route-flag的值
 * 如：app.insure.dataOrder_orderApplyList_approve
 * 2、btn-flag：它的作用就是当用户没有这个操作权限，移除这个操作的标识
 */
app.directive('btnCommon', ['userMenu', 'userMenuService', '$rootScope', '$state', '$localStorage', function (userMenu, userMenuService, $rootScope, $state, $localStorage) {

    return {
        restrict: 'AE',
        link: function (scope, element, attrs) {
            var existMenu = {};
            if ($localStorage.urlMap) {
                existMenu = $localStorage.urlMap;
            } else {
                existMenu = userMenuService.getuserMenu().result.urlMap;
                $localStorage.$default({"urlMap": existMenu});
            }

            var curUrl = $state.current.name;
            var deep = curUrl.split(".").length
            var newUrl = curUrl + '_' + attrs.routeFlag;
            var flag = true;
            var isHaveNode = function (url) {
                if (existMenu[url] == 1) {
                    flag = false;
                }
            };
            var isHaveAccess = function () {
                optDom(flag);
            };
            var optDom = function (flag) {
                if (attrs.btnFlag == 'a' || attrs.btnFlag == 'span') {
                    if (flag) {
                        //element.css({'display':'none'});
                        //element.css({'pointer-events':'none', 'color':'#666'});
                        element.html("");
                        element.removeAttr("class");
                    } else {
                        //element.css({'pointer-events':'auto', 'color':'#428bca'});
                    }
                } else if (attrs.btnFlag == 'remove') {
                    if (flag) {
                        element.remove();
                    }
                } else if (attrs.btnFlag == 'a-del') {
                    if (flag) {
                        element.css({'pointer-events': 'none', 'color': '#666'});
                    } else {
                        //element.css({'pointer-events':'auto', 'color':'red'});
                    }
                } else if (attrs.btnFlag == 'img') {
                    if (flag) {
                        element.css('pointer-events', 'none');
                    } else {
                        element.css('pointer-events', 'auto');
                    }
                } else if (attrs.btnFlag == 'disable') {
                    if (flag) {
                        element.attr('disabled', true);
                    } else {
                        element.attr('disabled', false);
                    }
                } else if (attrs.btnFlag == 'button' || attrs.btnFlag == 'input' || attrs.btnFlag == 'div') {
                    if (flag) {
                        element.hide();
                    } else {
                        element.show();
                    }
                } else if (attrs.btnFlag == 'select') {
                    if (flag) {
                        element.attr('disabled', true);
                    } else {
                        element.attr('disabled', false);
                    }
                } else if (attrs.btnFlag == 'radio-world-map') {
                    if (flag) {
                        element.hide();
                        scope.getMapData('china');
                        mapsNone = true;
                    } else {
                        element.show();
                    }
                } else if (attrs.btnFlag == 'radio-china-map') {
                    if (flag) {
                        element.hide();
                        if (!mapsNone) {
                            scope.getMapData('world');
                        } else {//当世界和中国都被禁用时的情景
                            $("#mapData").hide();
                            $("#mapTableData").hide();
                        }
                    } else {
                        element.show();
                    }
                }
            };
            isHaveNode(newUrl);
            isHaveAccess();

            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                flag = true;
                newUrl = toState.name + '.' + attrs.routeFlag;
                isHaveNode(newUrl);
                isHaveAccess();
            });
        }
    };
}]);

/**
 * Created by tian on 2018/1/22.
 * 实况天气/历史天气 -- 站点折线图/环境折线图/台风折线图 弹出框
 * http://api.jqueryui.com/dialog/
 */
app.directive('stationDialog', [function () {
    return {
        restrict: 'AE',
        scope: {
            dialogStyle: '=',    // 弹出框样式
            dialogElement: '=?',
            attrSet: '=?'
        },
        link: function (scope, element, attrs) {
            element.dialog(scope.dialogStyle);

            scope.dataDialog = {
                dataElement: element,
                open: function (dialogTitle) {
                    var my = "right center", at = "right-10 center", of = window;
                    element.dialog("open");
                    element.dialog("option", "title", dialogTitle);
                    if (scope.attrSet && scope.attrSet.set) {
                        //通过传值设置dialog
                        my=scope.attrSet.set.my?scope.attrSet.set.my:my;
                        at=scope.attrSet.set.at?scope.attrSet.set.at:at;
                        of=scope.attrSet.set.of?scope.attrSet.set.of:of;
                    }
                    element.dialog("option", "position", {
                        my: my,
                        at: at,
                        of: of
                    });
                },
                close: function () {
                    element.dialog("close");
                    element.dialog("destroy");
                }
            };
            scope.dialogElement = scope.dataDialog;
        }
    }
}]);
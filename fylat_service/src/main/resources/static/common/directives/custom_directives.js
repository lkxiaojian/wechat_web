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

app.directive('wuiDate', function() {
    return {
        // Restrict to elements and attributes
        restrict: 'EA',

        // Assign the angular link function
        compile: fieldCompile,

        // Assign the angular directive template HTML
        template: fieldTemplate,
        // templateUrl: "pageTemplate.html",

        // Assign the angular scope attribute formatting
        scope: {
            id: '@?', // 时间插件主键 默认scope.$id
            name: '@?', // 绑定表单验证input的name属性
            format: '@?', // 定义时间格式 默认yyyy-mm-dd
            interval: '@?', // 定义time时间间隔 默认30minutes
            placeholder: '@?', // 选择框提示语 默认 '选择时间'
            position: '@?', // 定义选择框浮动位置 默认left
            ngModel: '=', // 父scope绑定的时间的属性
            btns: '@', // 按钮信息 空则不显示任何按钮
            dateClass: '@?', // 自定义样式
            width: '@?', // 输入框宽度 支持px及百分比
            size: '@?' // 插件大小 默认为迷你型  large、L、l表示大型窗
        }

    };

    function fieldCompile(scope, element, attr) {
        return {
            pre: function(scope, element, attr) {

                scope.id = scope.id || 'date' + scope.$id; // 生成插件唯一id
                var position = scope.position || 'left', // 面板浮动
                    iptWidth = parseInt(scope.width); // 输入框宽度
                var iptWidthU = scope.width?scope.width.search('%') == -1 ? 'px' : '%':null,
                    size = scope.size != 'large' && scope.size != 'l' && scope.size != 'L' ? 'small' : null;
                angular.element(element).find('.wui-date').addClass('wui-date-' + scope.id);
                if(scope.name != '' && typeof scope.name != 'undefined') {
                    angular.element(element).find('.wui-date input').attr('name', scope.name);
                }
                if(size) {
                    angular.element(element).find('.wui-date').addClass(size); // 大小
                }
                angular.element(element).find('.wui-date .wui-date-picker').addClass(position); // 面板添加浮动
                scope.dateClass ? angular.element(element).find('.wui-date').addClass(scope.dateClass) : null; // 插件外部样式
                iptWidth ? angular.element(element).find('.wui-date').css('width', iptWidth + iptWidthU) : null; // 输入框宽度
            },
            post: function(scope, element, attr) {
                fieldLink(scope, element, attr);
            }
        }
    }

    function fieldLink(scope, element, attr) {
        // 初始化
        var GMTDate, // GMT格式时间
            format = (scope.format || 'yyyy-mm-dd').toLowerCase(), // 时间格式
            interval = parseInt(scope.interval) || 30, // time间隔
            interval = (60 % interval === 0 || interval % 60 === 0) && interval <= 12 * 60 ? interval : 30,
            placeholder = scope.placeholder || "选择时间",
            maxYear = parseInt(new Date().getFullYear()) + 100, // 插件最大year
            minYear = 1900, // 插件最小year
            SPECIAL_DATE_RULES = ['至今'], // 特殊字符串规则
            DATE_RULES = ['yyyy-mm-dd hh:mm:ss', 'yyyy-mm-dd hh:mm', 'yyyy-mm-dd', 'yyyy-mm']; // 内置的日期格式

        // angular对象初始化
        scope.date = {
            year: '0000',
            month: '00',
            date: '00',
            hours: '00',
            minutes: '00',
            seconds: '00',
            dateList: [],
            timeList: [],
            yearList: {},
            showPicker: false,
            showTimePicker: false,
            showTimeList: true,
            showClearIcon: false,
            selector: 1,
            btns: scope.btns ? JSON.parse(scope.btns.replace(/'/g, '"')) : {}, // btns字符串转对象
            showBtn: false,
        };

        // 初始化GMT时间
        function GMTDateInit(date) {
            date = dateFormat(date);
            if(date) {
                if(!SPECIAL_DATE_RULES.includes(date)) {
                    GMTDate = StrDateToGMT(date);
                } else {
                    GMTDate = new Date();
                }
            } else {
                GMTDate = new Date();
            }
        }

        // 加载dom
        function domBootstrap(format) {
            if(Object.keys(scope.date.btns).length) {
                scope.date.showBtn = true;
            }
            switch(format) {
                case 'yyyy-mm-dd hh:mm:ss':
                case 'yyyy-mm-dd hh:mm':
                    scope.date.showTimePicker = true; //
                    scope.date.selector = 1;
                    angular.element(element).find('.wui-date .wui-date-picker').removeClass('no_timer');
                    break;
                case 'yyyy-mm-dd':
                    scope.date.showTimePicker = false;
                    angular.element(element).find('.wui-date .wui-date-picker').addClass('no_timer');
                    scope.date.selector = 1;
                    break;
                case 'yyyy-mm':
                    scope.date.showTimePicker = false;
                    scope.date.selector = 2;
                    angular.element(element).find('.wui-date .wui-date-picker').addClass('no_timer');
                    break;
                default:
                    break;
            }
        }

        // 时间格式化
        function dateFormat(date) {
            if(!date) {
                return null;
            }
            if(SPECIAL_DATE_RULES.includes(date)) { // 特殊字符串
                return date;
            }
            date = date.toString().replace(/[\D]/g, ""); // 清除时间除数字外字符
            var len = format.replace(/\W/g, "").length; // 默认格式长度
            var str = date.length >= len ? date.slice(0, len) : '';
            if(date && str) {
                switch(format) {
                    case 'yyyy-mm-dd hh:mm:ss':
                        date = str.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1-$2-$3 $4:$5:$6");
                        break;
                    case 'yyyy-mm-dd hh:mm':
                        date = str.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1-$2-$3 $4:$5");
                        break;
                    case 'yyyy-mm-dd':
                        date = str.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
                        break;
                    case 'yyyy-mm':
                        date = str.replace(/(\d{4})(\d{2})/, "$1-$2");
                        break;
                    default:
                        break;
                }
                return str !== date ? date : null; // 正则替换失败后返回原字符串  替换成功则 str != date
            }
            return null;
        }
        // 字符串时间格式化为标准时间
        function StrDateToGMT(date) {
            if(date && new Date(date) != 'Invalid Date') {
                return new Date(date);
            }
            return null;
        }
        // 标准时间格式化为字符串时间
        function GMTToStrDate(date) {
            date = new Date(date);
            if(date && toString.call(date) == '[object Date]') {
                return date.getFullYear() + '/' + getDoubleDigit(date.getMonth() + 1) + '/' + getDoubleDigit(date.getDate()) + ' ' + getDoubleDigit(date.getHours()) + ':' + getDoubleDigit(date.getMinutes()) + ':' + getDoubleDigit(date.getSeconds());
            }
            return null;
        }
        // 生成两位月、日
        function getDoubleDigit(num) {
            num = '0' + num;
            return num.slice(-2);
        }

        // 显示的年月日时分秒数据
        function getAllDate() {
            scope.date.year = GMTDate.getFullYear(); // 初始化年份
            scope.date.month = getDoubleDigit(GMTDate.getMonth() + 1); // 两位月份
            scope.date.day = getDoubleDigit(GMTDate.getDate()); // 两位日期
            scope.date.hours = getDoubleDigit(GMTDate.getHours()); // 两位时
            scope.date.minutes = getDoubleDigit(GMTDate.getMinutes()); // 两位分
            scope.date.seconds = getDoubleDigit(GMTDate.getSeconds()); // 两位秒
        }
        // 生成日期数据
        function getDateList(date) {
            date = date || new Date();
            if(date.getFullYear() <= maxYear && date.getFullYear() >= minYear) { // 判断年份上下限
                // 初始化数据
                var dateList = [], // 属性type：1 表示上月的日期 2表示当月日期 3表示下月日期, 属性date：当天是几号
                    weekOfFirstDay, // 当月第一天是周几
                    endDayOfMonth, // 当前月份最后一天
                    endDayOfLastMonth, // 上月最后一天
                    modelDate = StrDateToGMT(scope.ngModel);

                getAllDate();

                weekOfFirstDay = new Date(scope.date.year, scope.date.month - 1, 1).getDay();
                endDayOfMonth = new Date(scope.date.year, scope.date.month, 0).getDate();
                endDayOfLastMonth = new Date(scope.date.year, scope.date.month - 1, 0).getDate();

                // 当月日期列表
                for(var i = 1; i <= endDayOfMonth; i++) {
                    // 面板显示日期与输入框日期相同返回 true
                    if(modelDate) {
                        var condition1 = modelDate.getFullYear() == scope.date.year && (modelDate.getMonth() + 1) == scope.date.month && modelDate.getDate() == i;
                    }
                    // 面板日期为系统当天日期返回 true
                    var condition2 = new Date().getFullYear() == GMTDate.getFullYear() && new Date().getMonth() == GMTDate.getMonth() && new Date().getDate() == i;
                    var dateObj = {
                        'type': 2,
                        'date': i
                    };
                    if(condition1) {
                        dateObj.current = true; // currently picked
                    }
                    if(condition2) {
                        dateObj.today = true; // today
                    }
                    dateList.push(dateObj);
                }

                // 根据week生成填充上月日期
                var prevLen = 0; // the length of prev month day
                prevLen = weekOfFirstDay || 7;
                for(var j = 0; j < prevLen; j++) {
                    dateList.unshift({
                        'type': 1,
                        'date': endDayOfLastMonth--
                    });
                }

                // 每个面板最多显示42天  计算剩余下月显示的天数
                var nextLen = 42 - prevLen - endDayOfMonth;
                for(var k = 1; k <= nextLen; k++) {
                    dateList.push({
                        'type': 3,
                        'date': k
                    });
                }

                // 按每行显示7天分割数组
                var count = 0,
                    arr = [],
                    resList = [];
                for(var l = 0; l < dateList.length; l++) {
                    count++;
                    arr.push(dateList[l]);
                    if(count >= 7) {
                        resList.push(arr);
                        count = 0;
                        arr = [];
                    }
                }
                return resList;
            }
        }

        // 生成时间选择列表数据
        function createTimeList() {
            var h = 8,
                m = 0,
                resList = [{
                    'time': '08:00'
                }];
            // fill time list
            for(var i = 1; i < 24 * 60 / interval; i++) {
                m = m + interval;
                if(m >= 60) {
                    h = h + (m / 60);
                    m = 0;
                }
                if(h >= 24) {
                    h = h - 24;
                }
                var timeObj = {
                    'time': getDoubleDigit(h) + ":" + getDoubleDigit(m)
                };
                resList.push(timeObj);
            }
            return resList;
        }

        // 生成年份选择列表数据
        function createYearList(year) {
            year = parseInt(year) || GMTDate.getFullYear();
            if(year) {
                var yearList = {};
                yearList.startYear = year;
                yearList.endYear = yearList.startYear + 10;
                yearList.y1 = [];
                yearList.y2 = [];
                yearList.y3 = [];

                for(var i = 0; i < 4; i++) {
                    yearList.y1.push(year + i);
                    yearList.y2.push(year + i + 4);
                    if(yearList.y3.length <= 2) {
                        yearList.y3.push(year + i + 8);
                    }
                }
                return yearList;
            }
            return null;
        }

        // 输出时间
        function outputDate() {
            scope.ngModel = dateFormat(GMTToStrDate(GMTDate));
        }

        // 点击某天关闭弹窗的规则
        var DATE_PICK_CLOSE = (format == DATE_RULES[2]);

        // Pick Date
        scope.pickDate = function(item, e) {
            if(item.type == 2) {
                GMTDate.setDate(item.date);
                if(DATE_PICK_CLOSE) {
                    scope.date.showPicker = false;
                }
            } else if(item.type == 1) {
                GMTDate.setDate(item.date);
                GMTDate.setMonth(scope.date.month - 2);
            } else if(item.type == 3) {
                GMTDate.setDate(item.date);
                GMTDate.setMonth(scope.date.month);
            }
            outputDate();
            scope.date.dateList = getDateList(GMTDate); // 生成年月日数据
        }

        // Pick Time
        scope.pickTime = function(time) {
            GMTDate.setHours(time.slice(0, 2));
            GMTDate.setMinutes(time.slice(3, 5));
            outputDate();
            getAllDate();
        }

        // Prev Year
        scope.prevYear = function() {
            var y = scope.date.year - 1;
            if(y >= minYear) {
                GMTDate.setFullYear(y);
                scope.date.dateList = getDateList(GMTDate); // 生成年月日数据
            }
        }

        // Next Year
        scope.nextYear = function() {
            var y = scope.date.year + 1;
            if(y <= maxYear) {
                GMTDate.setFullYear(y);
                scope.date.dateList = getDateList(GMTDate); // 生成年月日数据
            }
        }

        // Prev Year
        scope.prevYearByMonth = function() {
            var y = scope.date.year - 1;
            if(y >= minYear) {
                GMTDate.setFullYear(y);
                getAllDate();
            }
        }

        // Next Year
        scope.nextYearByMonth = function() {
            var y = scope.date.year + 1;
            if(y <= maxYear) {
                GMTDate.setFullYear(y);
                getAllDate();
            }
        }

        // Prev Month
        scope.prevMonth = function() {
            var m = scope.date.month - 2;
            GMTDate.setMonth(m);
            scope.date.dateList = getDateList(GMTDate); // 生成年月日数据
        }

        // Next Month
        scope.nextMonth = function() {
            var m = scope.date.month;
            GMTDate.setMonth(m);
            scope.date.dateList = getDateList(GMTDate); // 生成年月日数据
        }

        // 打开年份选择列表
        scope.openYearPicker = function(year) {
            scope.date.selector = 3;
            scope.date.yearList = createYearList(year);
        }

        // Pick Year
        scope.selectYear = function(year) {
            GMTDate.setFullYear(year);
            scope.date.selector = 2;
            getAllDate();
            outputDate();
        }

        scope.pickPrevYear = function() {
            var year = scope.date.yearList.startYear - 11;
            if(year >= minYear) {
                scope.openYearPicker(year);
            }
        }

        scope.pickNextYear = function() {
            var year = scope.date.yearList.startYear + 11;
            if(year <= maxYear) {
                scope.openYearPicker(year);
            }
        }

        // 打开月份选择列表
        scope.openMonthPicker = function() {
            scope.date.selector = 2;
        }

        // 点击某月关闭弹窗的规则
        var MONTH_PICK_CLOSE = (format == DATE_RULES[3]);

        // Select Month
        scope.selectMonth = function(m) {
            GMTDate.setMonth(m - 1);
            scope.date.dateList = getDateList(GMTDate); // 生成年月日数据
            scope.date.selector = 1;
            outputDate();
            if(MONTH_PICK_CLOSE) {
                scope.date.showPicker = false;
            }
        }

        // 选择至今
        scope.hitherto = function() {
            scope.ngModel = '至今';
            scope.date.showPicker = false;
        }

        // Picker open
        scope.openPicker = function() {
            domBootstrap(format); // 打开日期面板更新样式
            angular.element(".wui-date .wui-date-picker").hide();
            angular.element(".wui-date-" + scope.id + " .wui-date-picker").show();
            GMTDateInit(scope.ngModel);
            scope.date.dateList = getDateList(GMTDate); // 生成年月日数据
            scope.date.showPicker = true;
        }

        // 确定按钮
        scope.confirm = function() {
            outputDate();
            scope.date.showPicker = false;
        }

        // 此刻按钮
        scope.moment = function() {
            GMTDate = new Date();
            outputDate();
            scope.date.showPicker = false;
        }

        // 格式化input的date
        scope.checkDateFormat = function() {
            scope.ngModel = dateFormat(scope.ngModel);
        }

        // date init
        scope.dateInit = function() {
            domBootstrap(format);
            GMTDateInit(scope.ngModel);
            scope.date.dateList = getDateList(GMTDate); // 生成年月日数据
            scope.date.timeList = createTimeList();
        }

        scope.$watch('date.showPicker', function() {
            if(scope.date.showPicker) {
                scope.dateInit();
            }
        });

        // Close by click blank
        element.on('click', function(e) {
            //阻止底层冒泡
            e.stopPropagation();
        });

        angular.element('body').on('click', ':not(.wui-date)', function() {
            angular.element(element).find('.wui-date-picker').hide();
        });

    }

    function fieldTemplate(scope, element, attr) {
        return(
            '<div class="wui-date wui-date" ng-app="wui.date">' +
            '<div class="wui-date-editor" ng-click="openPicker()">' +
            '<input class="wui-input wui-input-block wui-date-input" type="text" placeholder="{{placeholder}}" ng-model="ngModel" autocomplete="off" ng-blur=checkDateFormat()>' +
            '<i class="iconfont icon1">&#xe807;</i>' +
            '</div>' +
            '<br/>' +
            '<div class="wui-date-picker" ng-show="date.showPicker">' +
            '<div class="wui-date-picker_body">' +
            '<div class="wui-date-picker_panel" ng-show="date.selector == 1">' +
            '<div class="wui-date-panel_header">' +
            '<i class="iconfont" ng-click="prevYear()">&#xe809;</i>' +
            '<i class="iconfont" ng-click="prevMonth()">&#xe808;</i>' +
            '<span class="title">' +
            '<span class="txt" ng-click="openYearPicker()"><span>{{date.year}}</span> 年 </span>' +
            '<span class="txt" ng-click="openMonthPicker()"><span>{{date.month}}</span> 月</span>' +
            '</span>' +
            '<i class="iconfont" ng-click="nextMonth()">&#xe886;</i>' +
            '<i class="iconfont" ng-click="nextYear()">&#xe640;</i>' +
            '</div>' +
            '<div class="wui-date-picker_content">' +
            '<table class="wui-data-table">' +
            '<tr>' +
            '<th>日</th>' +
            '<th>一</th>' +
            '<th>二</th>' +
            '<th>三</th>' +
            '<th>四</th>' +
            '<th>五</th>' +
            '<th>六</th>' +
            '</tr>' +
            '<tr ng-repeat="item in date.dateList track by $index">' +
            '<td ng-repeat="subItem in date.dateList[$index]"><div ng-class="{&apos;prev-date&apos;:subItem.type==1,&apos;date&apos;:subItem.type==2,&apos;next-date&apos;:subItem.type==3}"><span ng-click="pickDate(subItem,$event)" ng-class="{&apos;today&apos;:subItem.today,&apos;current&apos;:subItem.current}">{{subItem.date}}</span></div></td>' +
            '</tr>' +
            '</table>' +
            '</div>' +
            '</div>' +
            '<div class="wui-date-picker_panel month_panel" ng-show="date.selector == 2">' +
            '<div class="wui-date-panel_header">' +
            '<i class="iconfont" ng-click="prevYearByMonth()">&#xe809;</i>' +
            '<span class="title">' +
            '<span class="txt" ng-click="openYearPicker()"><span>{{date.year}}</span> 年</span>' +
            '</span>' +
            '<i class="iconfont" ng-click="nextYearByMonth()">&#xe640;</i>' +
            '</div>	' +
            '<div class="wui-date-picker_content">' +
            '<table class="wui-data-table">' +
            '<tr>' +
            '<td>' +
            '<a class="cell" ng-click="selectMonth(1)">一月</a>' +
            '</td>' +
            '<td>' +
            '<a class="cell" ng-click="selectMonth(2)">二月</a>' +
            '</td>' +
            '<td>' +
            '<a class="cell" ng-click="selectMonth(3)">三月</a>' +
            '</td>' +
            '<td>' +
            '<a class="cell" ng-click="selectMonth(4)">四月</a>' +
            '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>' +
            '<a class="cell" ng-click="selectMonth(5)">五月</a>' +
            '</td>' +
            '<td>' +
            '<a class="cell" ng-click="selectMonth(6)">六月</a>' +
            '</td>' +
            '<td>' +
            '<a class="cell" ng-click="selectMonth(7)">七月</a>' +
            '</td>' +
            '<td>' +
            '<a class="cell" ng-click="selectMonth(8)">八月</a>' +
            '</td>' +
            '</tr>' +
            '<tr>' +
            '<td>' +
            '<a class="cell" ng-click="selectMonth(9)">九月</a>' +
            '</td>' +
            '<td>' +
            '<a class="cell" ng-click="selectMonth(10)">十月</a>' +
            '</td>' +
            '<td>' +
            '<a class="cell" ng-click="selectMonth(11)">十一月</a>' +
            '</td>' +
            '<td>' +
            '<a class="cell" ng-click="selectMonth(12)">十二月</a>' +
            '</td>' +
            '</tr>' +
            '</table>' +
            '</div>	' +
            '</div>' +
            '<div class="wui-date-picker_panel year_panel" ng-show="date.selector == 3 ">' +
            '<div class="wui-date-panel_header">' +
            '<i class="iconfont" ng-click="pickPrevYear()">&#xe809;</i>' +
            '<span class="title">' +
            '<span class="txt"><span>{{date.yearList.startYear}}</span> 年 - <span>{{date.yearList.endYear}}</span> 年</span>' +
            '</span>' +
            '<i class="iconfont" ng-click="pickNextYear()">&#xe640;</i>' +
            '</div>' +
            '<div class="wui-date-picker_content">' +
            '<table class="wui-data-table">' +
            '<tr>' +
            '<td ng-repeat="item in date.yearList.y1 track by $index">' +
            '<a class="cell" ng-click="selectYear(item)">{{item}}</a>' +
            '</td>' +
            '</tr>' +
            '<tr>' +
            '<td ng-repeat="item in date.yearList.y2 track by $index">' +
            '<a class="cell" ng-click="selectYear(item)">{{item}}</a>' +
            '</td>' +
            '</tr>' +
            '<tr>' +
            '<td ng-repeat="item in date.yearList.y3 track by $index">' +
            '<a class="cell" ng-click="selectYear(item)">{{item}}</a>' +
            '</td>' +
            '</tr>' +
            '</table>' +
            '</div>' +
            '</div>' +
            '<div class="wui-date-picker_aside" ng-show="date.showTimePicker">' +
            '<div class="wui-date-aside_header">' +
            '<div class="wui-select wui-select-block time-select" id="time">' +
            '<div class="wui-select-selection time-selection">' +
            '<input type="hidden" name="" value="" >' +
            '<span class="wui-select-icon iconfont time-icon">&#xe887;</span>' +
            '<span class="wui-select-placeholder placeholder">{{date.hours}}:{{date.minutes}}</span>' +
            '<span class="wui-select-selected-value value"></span>' +
            '</div>' +
            '<div class="wui-select-menu time-menu" ng-show="date.showTimeList">' +
            '<ul>' +
            '<li class="wui-select-item time-menu-item" ng-repeat="item in date.timeList" ng-click="pickTime(item.time)">{{item.time}}</li>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="wui-date-picker_footer" ng-show="date.showBtn">' +
            '<button type="button" class="wui-btn wui-btn-white wui-btn-xsmall" ng-click="moment()" ng-if="date.btns.now">{{date.btns.now}}</button>' +
            '<button type="button" class="wui-btn wui-btn-primary wui-btn-xsmall" ng-click="confirm()" ng-if="date.btns.ok">{{date.btns.ok}}</button>' +
            '<button type="button" class="wui-btn wui-btn-white wui-btn-xsmall" ng-click="hitherto()" ng-if="date.btns.hitherto">至今</button>' +
            '</div>' +
            '</div>' +
            '</div>'
        );
    }

});


app.directive('select2', function(select2Query) {
    return {
        restrict: 'A',
        scope: {
            config: '=',
            ngModel: '=',
            select2Model: '='
        },
        link: function(scope, element, attrs) {
            var tagName = element[0].tagName
                , config = {
                allowClear: true,
                multiple: !!attrs.multiple,
                placeholder: attrs.placeholder || ' '
            };
            if (tagName === 'SELECT') {
                var $element = $(element);
                delete config.multiple;
                $element.val('').select2(config);
                scope.$watch('ngModel', function(newVal) {
                    setTimeout(function() {
                        $element.find('[value^="?"]').remove();
                        $element.select2('val', newVal);
                    }, 0);
                }, true);
                scope.$watch('config', function() {
                    setTimeout(function() {
                        $element.find('[value^="?"]').remove();
                        $element.select2('val', scope.ngModel);
                    }, 0);
                }, true);
                return false;
            }
            if (tagName === 'INPUT') {
                var $element = $(element);
                if (attrs.query) {
                    scope.config = select2Query[attrs.query]();
                }
                scope.$watch('config', function() {
                    angular.extend(config, scope.config);
                    var select = $element.select2('destroy');
                    $element.select2(config);
                }, true);
                $element.on('change', function() {
                    scope.$apply(function() {
                        scope.select2Model = $element.select2('data');
                    });
                });
                scope.$watch('select2Model', function(newVal) {
                    $element.select2('data', newVal);
                }, true);
                scope.$watch('ngModel', function(newVal) {
                    if (config.ajax || config.multiple) {
                        return false
                    }
                    $element.select2('val', newVal);
                }, true);
            }
        }
    }
});
app.factory('select2Query', function($timeout) {
    return {
        testAJAX: function() {
            var config = {
                minimumInputLength: 1,
                ajax: {
                    url: "http://api.rottentomatoes.com/api/public/v1.0/movies.json",
                    dataType: 'jsonp',
                    data: function(term) {
                        return {
                            q: term,
                            page_limit: 10,
                            apikey: "ju6z9mjyajq2djue3gbvv26t"
                        };
                    },
                    results: function(data, page) {
                        return {
                            results: data.movies
                        };
                    }
                },
                formatResult: function(data) {
                    return data.title;
                },
                formatSelection: function(data) {
                    return data.title;
                }
            };
            return config;
        }
    }
});

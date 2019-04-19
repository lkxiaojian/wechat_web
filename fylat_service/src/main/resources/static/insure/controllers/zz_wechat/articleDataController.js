app.controller('articleDataController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'insureUtil', '$window', 'modalTip', '$compile',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, insureUtil, $window, modalTip, $compile) {
        $scope.listObj = {
            current_location: 'app.insure.article_data',
            navigationMsg: '管理平台 >已发表文章统计',
            defaultSearchParams: {
                view: 'select',
                type:"0", //文章
                tmp_type:"1", //正式发布的
                hour:"10",
                size:"10",
                page:"1",


            },
        }


        //文章列表
        $scope.listAritcle = function () {

            $scope.tableOption = {
                url: 'statistics/selStatisticsInfo/rest',
                resultTag: 'result',
                method: 'get',
                queryParams: function (params) {
                    serializeJson(params, "queryForm");
                    $.extend(params, $scope.listObj.defaultSearchParams);
                    return params;
                },
                pageList: ['All'],
                pageSize: 10,
                onLoadSuccess: function (data) {
                    if (data.code != 0) {
                        modalTip({
                            tip: data.message,
                            type: true
                        });
                    }
                },
                columns: [ {
                        title: '标题',
                        class: 'col-md-1',
                        field: 'articleTitle',
                        align: 'center',
                        titleTooltip: 'title',
                        // width: "15%",
                        cellStyle:{
                                css:{
                                    "min-width":"100px",
                                    "max-width":"200px"
                                }
                        }
                    }, {
                    title: '摘要',
                    class: 'col-md-1',
                    field: 'contentExcerpt',
                    align: 'center',
                    cellStyle:{
                        css:{
                            "min-width":"100px",
                            "max-width":"200px"
                        },
                        classes:["overflow"]
                    }
                },  {
                    title: '关键词',
                    class: 'col-md-1',
                    field: 'articleKeyword',
                    align: 'center'

                },  {
                    title: '入库时间',
                    class: 'col-md-1',
                    field: 'createTime',
                    align: 'center',
                    width: "150px",
                    formatter: function (value, row, index) {
                        if (value) {
                            return insureUtil.dateToString(new Date(value), "yyyy-MM-dd hh:mm:ss");
                        }
                        return '';
                    }

                }, {
                        title: '发表时间',
                        class: 'col-md-1',
                        field: 'createTime',
                        align: 'center',
                        width: "150px",
                        formatter: function (value, row, index) {
                            if (value) {
                                return insureUtil.dateToString(new Date(value), "yyyy-MM-dd");
                            }
                            return '';
                        }
                    },{
                        title: '来源',
                        class: 'col-md-1',
                        field: 'source',
                        align: 'center',
                        sortable: false
                    }, {
                        title: '作者',
                        class: 'col-md-1',
                        field: 'author',
                        align: 'center'

                    }, {
                        title: '字数',
                        class: 'col-md-1',
                        field: 'charNum',
                        align: 'center',
                        width: "100px"
                    },
                    {
                        title: '转发数',
                        class: 'col-md-1',
                        field: 'num2',
                        align: 'center',
                        width: "100px"
                    },
                    {
                        title: '阅读数',
                        class: 'col-md-1',
                        field: 'num1',
                        align: 'center',
                        width: "100px"
                    },
                    {
                        title: '阅读进度',
                        class: 'col-md-1',
                        field: 'num1',
                        align: 'center',
                        width: "100px"
                    },{
                        title: '留存时间',
                        class: 'col-md-1',
                        field: 'num3',
                        align: 'center',
                        width: "100px",
                        formatter: function (value, row, index) {
                            if (value) {
                                return value+'ms';
                            }
                            return '';
                        }
                    }
                ]
            };
        }
        $scope.listAritcle();
        $scope.yAxisLabelFormatter=function (value) {
            return value+"次";
        }
        $scope.month = function(){
            $scope.timeType='c';
            $scope.getOptions();
        }
        $scope.week = function(){
            $scope.timeType='w';
            $scope.getOptions();
        }
        $scope.day = function(){
            $scope.timeType='e';
            $scope.getOptions();
        }
        $scope.hour = function(){
            $scope.timeType='k';
            $scope.getOptions();
        }

        $scope.getCurrentMonthFirst=function(){
            var date=new Date();
            date.setDate(1);
            return $scope.setToday(date);
        }
// 获取当前月的最后一天
        $scope.getCurrentMonthLast=function(){
            var date=new Date();
            var currentMonth=date.getMonth();
            var nextMonth=++currentMonth;
            var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
            var oneDay=1000*60*60*24;
            return $scope.setToday(new Date(nextMonthFirstDay-oneDay));
        }
        /**
         * 获取当天所在周的周一和周日的日期
         * 返回 YYYY-MM-DD 格式时间
         */
        $scope.setToday =function(t) {
            return t.getFullYear()+'-'+$scope.setT(t.getMonth() + 1)+'-'+$scope.setT(t.getDate());
        }
        $scope.setT =function(e) {
            return 10>e ? '0'+e:e;

        }
        $scope.getWeekDayStart=function() {
            var date1=new Date();
            return $scope.setToday(new Date(date1.setDate(date1.getDate() - date1.getDay() + 1)));
        }
        $scope.getWeekDayEnd=function() {
            var date2=new Date();
            return $scope.setToday( new Date(date2.setDate(date2.getDate() + (7 - date2.getDay()))));
        }
        $scope.initDateAll=function () {
            $("#startTime").val($scope.getCurrentMonthFirst());
            $("#endTime").val($scope.getCurrentMonthLast());
            $scope.timeType='e';//小时k  周w 天e 月c
        }
        $scope.initDateAll();
        $scope.getOptions=function () {
            $http({
                method: 'GET',
                url: 'statistics/getCharData/rest',
                params: {
                    state:0,
                    type:$scope.timeType,
                    statisticsType:1,
                    startTime:$("#startTime").val(),
                    endTime:$("#endTime").val(),
                },
            }).success(function (data) {
                if (data.code == 0) {
                    var legend=[];
                    var features=[];
                    for(var f in data.Y){
                        legend.push(data.Y[f].YName);
                        features.push(data.Y[f].YData);
                    }

                    $scope.pieOption1 ={
                        title:'阅读数',
                        xData:data.X,
                        legendSet:legend,
                        featureSet :features,

                    };
                } else {
                    layer.msg(data.message)
                }
            }).error(function (data) {
                layer.alert("请求失败",{icon:2})
            });
            $http({
                method: 'GET',
                url: 'statistics/getCharData/rest',
                params: {
                    state:0,
                    type:$scope.timeType,
                    statisticsType:2,
                    startTime:$("#startTime").val(),
                    endTime:$("#endTime").val(),
                },
            }).success(function (data) {
                if (data.code == 0) {
                    var legend=[];
                    var features=[];
                    for(var f in data.Y){
                        legend.push(data.Y[f].YName);
                        features.push(data.Y[f].YData);
                    }

                    $scope.pieOption2 ={
                        title:'转发数',
                        xData:data.X,
                        legendSet:legend,
                        featureSet :features,

                    };
                } else {
                    layer.msg(data.message)
                }
            }).error(function (data) {
                layer.alert("请求失败",{icon:2})
            });
            $http({
                method: 'GET',
                url: 'statistics/getCharData/rest',
                params: {
                    state:0,
                    type:$scope.timeType,
                    statisticsType:3,
                    startTime:$("#startTime").val(),
                    endTime:$("#endTime").val(),
                },
            }).success(function (data) {
                if (data.code == 0) {
                    var legend=[];
                    var features=[];
                    for(var f in data.Y){
                        legend.push(data.Y[f].YName);
                        features.push(data.Y[f].YData);
                    }

                    $scope.pieOption3 ={
                        title:'停留时间',
                        xData:data.X,
                        legendSet:legend,
                        featureSet :features,

                    };
                } else {
                    layer.msg(data.message)
                }
            }).error(function (data) {
                layer.alert("请求失败",{icon:2})
            });
        }


        $scope.getOptions();

        $scope.query = function(){
            if(!$("#article_type").val()){
                layer.msg("文章类型不能为空");
                return;
            }
            $scope.tableInstance.bootstrapTable('refresh');
        }
        $scope.reset = function(){
            $.each($("#queryForm select,#queryForm input"),
                function(i, n) {
                    $(n).val('');
                });
        }



        $scope.checkAll = function(){
            $scope.tableInstance.bootstrapTable('checkAll');
        }
        $scope.uncheckAll = function(){
            $scope.tableInstance.bootstrapTable('uncheckAll');
        }


        //获取所有已发布的类型
        $scope.getAllPublishedType = function(){
            $http({
                method: 'GET',
                url: '/releaseManagement/getAllIssueArticleType/rest',
                params: {
                    type: "1"
                }
            }).success(function (data) {
                if (data.code == 0) {
                    $scope.publishedTypeList = data.result;
                } else {
                    layer.msg(data.message)
                }
            }).error(function (data) {
                layer.alert("请求失败",{icon:2})
            })
        }
        $scope.getAllPublishedType();
    }]);




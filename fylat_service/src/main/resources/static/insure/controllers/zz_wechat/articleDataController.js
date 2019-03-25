app.controller('articleDataController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'insureUtil', '$window', 'modalTip', '$compile',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, insureUtil, $window, modalTip, $compile) {
        $scope.listObj = {
            current_location: 'app.insure.article_data',
            navigationMsg: '管理平台 >文章统计',
            defaultSearchParams: {
                view: 'select',
                type:"0", //文章
                tmp_type:"1", //正式发布的
                statisticsType:"1",
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
                        field: 'article_title',
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
                    field: 'content_excerpt',
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
                    field: 'article_keyword',
                    align: 'center'

                },  {
                    title: '入库时间',
                    class: 'col-md-1',
                    field: 'update_time',
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
                        field: 'create_time',
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
                        field: 'word_count',
                        align: 'center',
                        width: "100px"
                    },
                    {
                        title: '转发数',
                        class: 'col-md-1',
                        field: 'word_count',
                        align: 'center',
                        width: "100px"
                    },
                    {
                        title: '阅读数',
                        class: 'col-md-1',
                        field: 'word_count',
                        align: 'center',
                        width: "100px"
                    },
                    {
                        title: '阅读进度',
                        class: 'col-md-1',
                        field: 'word_count',
                        align: 'center',
                        width: "100px"
                    },{
                        title: '留存时间',
                        class: 'col-md-1',
                        field: 'word_count',
                        align: 'center',
                        width: "100px"
                    }
                ]
            };
        }
        $scope.listAritcle();
        $scope.getOptions=function () {
            $scope.listObj.defaultSearchParams.statisticsType=1;
            $scope.listObj.defaultSearchParams.hour=12;
            // $http({
            //     method: 'GET',
            //     url: 'statistics/getCharData/rest',
            //     params: $scope.queryParams()
            // }).success(function (data) {
            //     if (data.code == 0) {
            //         $scope.poptions1 = data.result;
            //     } else {
            //         layer.msg(data.message)
            //     }
            // }).error(function (data) {
            //     layer.alert("请求失败",{icon:2})
            // });

            $scope.listObj.defaultSearchParams.statisticsType=2;
            // $http({
            //     method: 'GET',
            //     url: 'statistics/getCharData/rest',
            //     params: $scope.queryParams(),
            // }).success(function (data) {
            //     if (data.code == 0) {
            //         $scope.poptions2 = data.result;
            //     } else {
            //         layer.msg(data.message)
            //     }
            // }).error(function (data) {
            //     layer.alert("请求失败",{icon:2})
            // });
            $scope.listObj.defaultSearchParams.statisticsType=3;
            // $http({
            //     method: 'GET',
            //     url: 'statistics/getCharData/rest',
            //     params: $scope.queryParams()
            // }).success(function (data) {
            //     if (data.code == 0) {
            //         $scope.poptions3 = data.result;
            //     } else {
            //         layer.msg(data.message)
            //     }
            // }).error(function (data) {
            //     layer.alert("请求失败",{icon:2})
            // });
            $scope.poptions1 ={
                title : {
                    text: '数据图表',
                    subtext: ''
                },
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['蒸发量','降水量']
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'蒸发量',
                        type:'bar',
                        data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
                        // markPoint : {
                        //     data : [
                        //         {type : 'max', name: '最大值'},
                        //         {type : 'min', name: '最小值'}
                        //     ]
                        // },
                        // markLine : {
                        //     data : [
                        //         {type : 'average', name: '平均值'}
                        //     ]
                        // }
                    },
                    {
                        name:'降水量',
                        type:'bar',
                        data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                        // markPoint : {
                        //     data : [
                        //         {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183, symbolSize:18},
                        //         {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
                        //     ]
                        // },
                        // markLine : {
                        //     data : [
                        //         {type : 'average', name : '平均值'}
                        //     ]
                        // }
                    }
                ]
            }

            $scope.poptions2=$scope.poptions1;
            $scope.poptions3=$scope.poptions1;
        }
        $scope.queryParams=function (params) {
            serializeJson(params, "queryForm");
            $.extend(params, $scope.listObj.defaultSearchParams);
            return params;
        },
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
        $scope.month = function(){
            $("#startTime").val($scope.getCurrentMonthFirst());
            $("#endTime").val($scope.getCurrentMonthLast());
        }
        $scope.week = function(){
            $("#startTime").val($scope.getWeekDayStart());
            $("#endTime").val($scope.getWeekDayEnd());
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




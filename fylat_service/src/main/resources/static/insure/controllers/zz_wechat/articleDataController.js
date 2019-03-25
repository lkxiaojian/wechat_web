app.controller('articleDataController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'insureUtil', '$window', 'modalTip', '$compile',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, insureUtil, $window, modalTip, $compile) {
        $scope.listObj = {
            current_location: 'app.insure.article_data',
            navigationMsg: '管理平台 >文章统计',
            defaultSearchParams: {
                view: 'select',
                type:"0", //文章
                del_type:"0", //非删除
                tmp_type:"1", //正式发布的
                statisticsType:"1",
                articleType:"1"

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
        $scope.query = function(){
            if(!$("#article_type_id").val()){
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

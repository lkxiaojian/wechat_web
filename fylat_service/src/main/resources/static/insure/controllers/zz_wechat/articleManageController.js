app.controller('articleManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'insureUtil', '$window', 'modalTip', '$compile',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, insureUtil, $window, modalTip, $compile) {
        $scope.listObj = {
            current_location: 'app.insure.article_manage',
            navigationMsg: '管理平台 >已发布的文章管理',
            defaultSearchParams: {
                view: 'select',
                type:"0", //文章
                del_type:"0", //非删除
                tmp_type:"0" //正式发布的
            },
        }

        $scope.query_params = {
            updateTimeStart:'',
            updateTimeEnd:'',
            createTimeStart:'',
            createTimeEnd:'',
            article_type_id:'',
            details_size_more:'',
            details_size_less:'',
            message:'',
            pageNo:1//传参用，不用于分页
        }
        if($stateParams.query_params){
            $scope.query_params = JSON.parse($stateParams.query_params);
        }

        //文章列表
        $scope.listAritcle = function () {

            $scope.tableOption = {
                url: 'releaseManagement/selectAricleTmpList/rest',
                resultTag: 'result',
                method: 'get',
                queryParams: function (params) {
                    $.extend(params, $scope.query_params);
                    $.extend(params, $scope.listObj.defaultSearchParams);
                    return params;
                },
                pageList: ['All'],
                pageSize: 10,
                pageNumber: $scope.query_params.pageNo,
                onPageChange: function(number,size){
                    $scope.query_params.pageNo = number;
                },
                onLoadSuccess: function (data) {
                    if (data.code != 0) {
                        modalTip({
                            tip: data.message,
                            type: true
                        });
                    }
                },
                columns: [{
                  checkbox: true
                    }, {
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
                        title: '所属分类',
                        class: 'col-md-1',
                        field: 'article_type_name',
                        align: 'center',
                        cellStyle: {
                            css: {
                                "min-width": "100px",
                                "max-width": "200px"
                            },
                            classes: ["overflow"]
                        },formatter:function(value, row, index) {
                            var values = row.article_type_name;
                            var span=document.createElement('span');
                            span.setAttribute('title',values);
                            span.innerHTML = row.article_type_name;
                            return span.outerHTML;
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
                    }, {
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
                        title: '关键词',
                        class: 'col-md-1',
                        field: 'article_keyword',
                        align: 'center'

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
                        },formatter:function(value, row, index) {
                            var values = row.content_excerpt;
                            var span=document.createElement('span');
                            span.setAttribute('title',values);
                            span.innerHTML = row.content_excerpt;
                            return span.outerHTML;
                        }
                    }, {
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
                    }, {
                        title: '操作',
                        class: 'col-md-1',
                        align: 'center',
                        formatter: function (value, row, index) {

                            return '<a class="btn btn-info btn-xs a-view" href="javascript:;">查看</a>&nbsp;' +
                                '<a class="btn btn-blue btn-xs a-edit" href="javascript:;">修改</a>&nbsp;' +
                                '<a class="btn btn-danger btn-xs a-delete" href="javascript:;"> 删除</a>';
                        },
                        events: {
                            'click .a-view': function (e, value, row, index) {
                                $state.go('app.insure.modify_paper', {
                                    pre_query_params: JSON.stringify($scope.query_params),
                                    article_id: row.article_id,
                                    pre_location:$scope.listObj.current_location,
                                    operate_type:"view",
                                    type: "0",//文章
                                    tmp_type: $scope.listObj.defaultSearchParams.tmp_type
                                });
                                // $scope.tableInstance.bootstrapTable('refresh');
                            },
                            'click .a-edit': function (e, value, row, index) {
                                $state.go('app.insure.modify_paper', {
                                    pre_query_params: JSON.stringify($scope.query_params),
                                    article_id: row.article_id,
                                    pre_location:$scope.listObj.current_location,
                                    operate_type:"edit",
                                    type:"0",//文章
                                    tmp_type: $scope.listObj.defaultSearchParams.tmp_type
                                });
                                // $scope.tableInstance.bootstrapTable('refresh');
                            },
                            'click .a-delete': function (e, value, row, index) {
                                deleteData(row.article_id);
                            }
                        }
                    }
                ]
            };
        }
        $scope.listAritcle();
        $scope.query = function(){
            $scope.tableInstance.bootstrapTable('refresh',{url:"releaseManagement/selectAricleTmpList/rest",pageNumber:1,
                pageSize:10});
        }
        $scope.reset = function(){
            $scope.query_params = {};
            // $scope.tableInstance.bootstrapTable()
        }
        $scope.checkAll = function(){
            $scope.tableInstance.bootstrapTable('checkAll');
        }
        $scope.uncheckAll = function(){
            $scope.tableInstance.bootstrapTable('uncheckAll');
        }
        $scope.batchDownload = function(){
            var array = $scope.tableInstance.bootstrapTable('getSelections');
            if(!array || array.length == 0){
                layer.msg("请至少勾选一条数据");
                return;
            }
            // tablesToExcel(['articleTb'], ['ProductDay1'], 'TestBook.xls', 'Excel');
            method5('articleTb')

        }
        $scope.batchDelete = function(){
            var array = $scope.tableInstance.bootstrapTable('getSelections');
            if(!array || array.length == 0){
                layer.msg("请至少勾选一条数据");
                return;
            }
            var ids = "";
            for(var i = 0;i<array.length;i++){
                ids += array[i].article_id;
                ids += ",";
            }
            deleteData(ids);
        }

        function deleteData(rowIds){
            var confirm = layer.confirm('确认删除勾选的数据吗？', {
                btn: ['取消','确认'] //按钮
            }, function(){
                layer.close(confirm);
            }, function(){
                layer.load(2);
                $http({
                    method: 'GET',
                    url: 'article/deletedById',
                    params: {
                        article_id: rowIds,
                        type: '0'
                    }
                }).success(function (data) {
                    layer.closeAll('loading');
                    if (data.code == 0) {
                        layer.alert(data.message);
                        $scope.tableInstance.bootstrapTable('refresh');
                    } else {
                        layer.alert(data.message);
                    }

                }).error(function (data) {
                    layer.closeAll('loading');
                    layer.alert("删除失败");
                })
            });
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

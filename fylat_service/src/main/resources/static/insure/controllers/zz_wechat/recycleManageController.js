app.controller('recycleManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'insureUtil', '$window', 'modalTip', '$compile',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, insureUtil, $window, modalTip, $compile) {
        $scope.listObj = {
            current_location: 'app.insure.article_manage',
            navigationMsg: '管理平台 >回收站管理',
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
            createTime:'',
            language:'',
            article_type_id:'',
            // details_size_more:'',
            // details_size_less:'',
            message:''
        }
        if($stateParams.query_params){
            $scope.query_params = JSON.parse($stateParams.query_params);
        }

        //文章列表
        $scope.listAritcle = function () {

            $scope.articleOption = {
                url: 'releaseManagement/selectAricleTmpList/rest',
                resultTag: 'result',
                method: 'get',
                queryParams: function (params) {
                    serializeJson(params, "queryForm");
                    $.extend(params, {
                        type:"0", //文章
                        del_type:"1",
                        tmp_type:"0"
                    });
                    return params;
                },
                pageList: ['All'],
                pageSize: 10,
                onLoadSuccess: function (data) {
                    if (data.code != 0) {
                        layer.msg(data.message);
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
                        align: 'center'
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
                                '<a class="btn btn-blue btn-xs a-recover" href="javascript:;">恢复</a>&nbsp;' +
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
                            },
                            'click .a-recover': function (e, value, row, index) {
                                recoverData(row.article_id,0);
                            },
                            'click .a-delete': function (e, value, row, index) {
                                deleteData(row.article_id,0);
                            }
                        }
                    }
                ]
            };
        }
        $scope.listAritcle();

        //论文列表
        $scope.listPaper = function () {

            $scope.paperOption = {
                url: 'releaseManagement/selectAricleTmpList/rest',
                resultTag: 'result',
                method: 'get',
                queryParams: function (params) {
                    serializeJson(params, "queryForm");
                    $.extend(params, {
                        type:"1", //论文
                        del_type:"1",
                        tmp_type:"0"
                    });
                    return params;
                },
                pageList: ['All'],
                pageSize: 10,
                onLoadSuccess: function (data) {
                    if (data.code != 0) {
                        layer.msg(data.message);
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
                    align: 'center'
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
                    title: '操作',
                    class: 'col-md-1',
                    align: 'center',
                    width: '100px',
                    formatter: function (value, row, index) {
                        return '<a class="btn btn-info btn-xs a-view" href="javascript:;">查看</a>&nbsp;' +
                            '<a class="btn btn-blue btn-xs a-recover" href="javascript:;">恢复</a>&nbsp;' +
                            '<a class="btn btn-danger btn-xs a-delete" href="javascript:;"> 删除</a>';
                    },
                    events: {
                        'click .a-view': function (e, value, row, index) {
                            $state.go('app.insure.modify_paper', {
                                pre_query_params: JSON.stringify($scope.query_params),
                                article_id: row.article_id,
                                pre_location:$scope.listObj.current_location,
                                operate_type:"view",
                                type: "1",//论文
                                tmp_type: $scope.listObj.defaultSearchParams.tmp_type
                            });                        },
                        'click .a-recover': function (e, value, row, index) {
                            recoverData(row.article_id,1);
                        },
                        'click .a-delete': function (e, value, row, index) {
                            deleteData(row.article_id,1);
                        }
                    }
                }
                ]
            };
        }
        $scope.listPaper();

        //类型列表
        $scope.listType = function () {

            $scope.typeOption = {
                url: 'releaseManagement/getDelArticleType/rest',
                resultTag: 'result',
                method: 'get',
                queryParams: function (params) {
                    serializeJson(params, "queryForm");
                    $.extend(params, {
                        type:"0" //已发布的类型
                    });
                    return params;
                },
                pageList: ['All'],
                pageSize: 10,
                onLoadSuccess: function (data) {
                    if (data.code != 0) {
                        layer.msg(data.message);
                    }
                },
                columns: [{
                    checkbox: true
                }, {
                    title: '类型名称',
                    class: 'col-md-1',
                    field: 'article_type_name',
                    align: 'center'
                },{
                    title: '关键词',
                    class: 'col-md-1',
                    field: 'article_type_keyword',
                    align: 'center'
                },{
                    title: '操作',
                    class: 'col-md-1',
                    align: 'center',
                    width: '100px',
                    formatter: function (value, row, index) {
                        return '<a class="btn btn-blue btn-xs a-recover" href="javascript:;">恢复</a>&nbsp;' +
                            '<a class="btn btn-danger btn-xs a-delete" href="javascript:;"> 删除</a>';
                    },
                    events: {
                        'click .a-recover': function (e, value, row, index) {
                            recoverData(row.article_id,2);
                        },
                        'click .a-delete': function (e, value, row, index) {
                            deleteData(row.article_id,2);
                        }
                    }
                }
                ]
            };
        }
        $scope.listType();

        $scope.query = function(){
            $scope.articleInstance.bootstrapTable('refresh');
            $scope.paperInstance.bootstrapTable('refresh');
            $scope.typeInstance.bootstrapTable('refresh');
        }
        $scope.reset = function(){
            $.each($("#queryForm select,#queryForm input"),
                function(i, n) {
                    $(n).val('');
                });
        }
        //清空回收站
        $scope.clearRecycle = function(){
            var confirm = layer.confirm('确认彻底删除勾选的数据吗？', {
                btn: ['取消','确认'] //按钮
            }, function(){
                layer.close(confirm);
            }, function(){
                layer.load(2);
                $http({
                    method: 'GET',
                    url: 'releaseManagement/delAllRecycle/reset',
                    params: {
                        type: '0'//清空
                    }
                }).success(function (data) {
                    layer.closeAll('loading');
                    if (data.code == 0) {
                        layer.alert(data.message);
                        $scope.articleInstance.bootstrapTable('refresh');
                        $scope.paperInstance.bootstrapTable('refresh');
                        $scope.typeInstance.bootstrapTable('refresh');
                    } else {
                        layer.alert(data.message);
                    }

                }).error(function (data) {
                    layer.closeAll('loading');
                    layer.alert("删除失败");
                })
            });
        }
        $scope.checkAll = function(type){
            $scope.getTableInstanceByType(type).bootstrapTable('checkAll');
        }
        $scope.uncheckAll = function(type){
            $scope.getTableInstanceByType(type).bootstrapTable('uncheckAll');
        }
        $scope.getTableInstanceByType = function(type){
            if(type == '0'){
                return $scope.articleInstance;
            }else if(type == '1'){
                return $scope.paperInstance;
            }else {
                return $scope.typeInstance;
            }
        }
        $scope.batchDelete = function(type){
            var array = $scope.getTableInstanceByType(type).bootstrapTable('getSelections');
            if(!array || array.length == 0){
                layer.msg("请至少勾选一条数据");
                return;
            }
            var ids = "";
            for(var i = 0;i<array.length;i++){
                ids += array[i].article_id;
                ids += ",";
            }
            deleteData(ids,type);
        }

        function deleteData(rowIds,type){
            debugger
            var confirm = layer.confirm('确认彻底删除勾选的数据吗？', {
                btn: ['取消','确认'] //按钮
            }, function(){
                layer.close(confirm);
            }, function(){

                layer.load(2);
                $http({
                    method: 'GET',
                    url: '/article/deletedById',
                    params: {
                        article_id:rowIds,
                        type: '1'
                    }
                }).success(function (data) {
                    layer.closeAll('loading');
                    if (data.code == 0) {
                        layer.alert(data.message);
                        $scope.getTableInstanceByType(type).bootstrapTable('refresh');
                    } else {
                        layer.alert(data.message);
                    }

                }).error(function (data) {
                    layer.closeAll('loading');
                    layer.alert("删除失败");
                })
            });
        }

        $scope.batchRecover = function(type){
            var array = $scope.getTableInstanceByType(type).bootstrapTable('getSelections');
            if(!array || array.length == 0){
                layer.msg("请至少勾选一条数据");
                return;
            }
            var ids = "";
            for(var i = 0;i<array.length;i++){
                ids += array[i].article_id;
                ids += ",";
            }
            recoverData(ids,type);
        }
        function recoverData(rowIds,type){
            debugger
            var recoverType = '1';//恢复论文和文章传1
            if(type == 2){
                recoverType = '0';//恢复关键字传0
            }
            var confirm = layer.confirm('确认恢复勾选的数据吗？', {
                btn: ['取消','确认'] //按钮
            }, function(){
                layer.close(confirm);
            }, function(){
                layer.load(2);
                $http({
                    method: 'GET',
                    url: 'article/recoverKeyword',
                    params: {
                        id: rowIds,
                        type: recoverType
                    }
                }).success(function (data) {
                    layer.closeAll('loading');
                    if (data.code == 0) {
                        layer.alert(data.message);
                        $scope.getTableInstanceByType(type).bootstrapTable('refresh');
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

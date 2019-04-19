app.controller('recycleManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'insureUtil', '$window', 'modalTip', '$compile',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, insureUtil, $window, modalTip, $compile) {
        $scope.listObj = {
            current_location: 'app.insure.recycle_manage',
            navigationMsg: '管理平台 >回收站管理'
        }
        $scope.query_params = {
            updateTimeStart:'',
            updateTimeEnd:'',
            createTime:'',
            language:'',
            article_type_id:'',
            message:''
        }

        //文章列表
        $scope.listAritcle = function () {

            $scope.articleOption = {
                url: 'releaseManagement/selectAricleTmpList/rest',
                resultTag: 'result',
                method: 'get',
                queryParams: function (params) {
                    $.extend(params, $scope.query_params);
                    $.extend(params, {
                        type:"0", //文章
                        del_type:"1",
                        tmp_type:$scope.query_params.dataType == '0'?'1':'0'
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
                                    tmp_type: $scope.query_params.dataType == '0'?'1':'0'
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
                    $.extend(params, $scope.query_params);
                    $.extend(params, {
                        type:"1", //论文
                        del_type:"1",
                        tmp_type:$scope.query_params.dataType == '0'?'1':'0'
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
                    },formatter: function (value, row, index) {
                        if (!row.article_title) {
                            return row.article_title_e;
                        }
                        return row.article_title;
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
                    align: 'center',
                    formatter: function (value, row, index) {
                        if (!row.article_keyword) {
                            return row.article_keyword_e;
                        }
                        return row.article_keyword;
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
                    },formatter:function(value, row, index) {
                        var values = row.content_excerpt;
                        if(!row.content_excerpt){
                            values = row.content_excerpt_e;
                        }                        var span=document.createElement('span');
                        span.setAttribute('title',values);
                        span.innerHTML = row.values;
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
                                tmp_type: $scope.query_params.dataType == '0'?'1':'0'
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
                    $.extend(params, $scope.query_params);
                    $.extend(params, {
                        type: $scope.query_params.dataType == '0'?'1':'0'
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
                            recoverData(row.article_type_id,2);
                        },
                        'click .a-delete': function (e, value, row, index) {
                            deleteData(row.article_type_id,2);
                        }
                    }
                }
                ]
            };
        }
        $scope.listType();

        //关键词列表
        $scope.listKeyword = function () {

            $scope.keywordOption = {
                url: 'article/keywordQuery',
                resultTag: 'result',
                method: 'get',
                queryParams: function (params) {
                    $.extend(params, $scope.query_params);
                    $.extend(params, {
                        type:"1",
                        parent_id:params.article_type_id
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
                },{
                    title: '关键词',
                    class: 'col-md-1',
                    field: 'keyword_name',
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
                            recoverData(row.id,3);
                        },
                        'click .a-delete': function (e, value, row, index) {
                            deleteData(row.id,3);
                        }
                    }
                }
                ]
            };
        }
        $scope.listKeyword();

        $scope.query = function(){
            $scope.articleInstance.bootstrapTable('refresh',{url:"releaseManagement/selectAricleTmpList/rest",pageNumber:1,
                pageSize:10});
            $scope.paperInstance.bootstrapTable('refresh',{url:"releaseManagement/selectAricleTmpList/rest",pageNumber:1,
                pageSize:10});
            $scope.typeInstance.bootstrapTable('refresh',{url:"releaseManagement/getDelArticleType/rest",pageNumber:1,
                pageSize:10});
            $scope.keywordInstance.bootstrapTable('refresh',{url:"article/keywordQuery",pageNumber:1,
                pageSize:10});
            // $scope.articleInstance.bootstrapTable('refresh');
            // $scope.paperInstance.bootstrapTable('refresh');
            // $scope.typeInstance.bootstrapTable('refresh');
        }
        $scope.reset = function(){
            $scope.query_params = {dataType:'0'};
        }

        $scope.changeDataType = function(){
            $scope.getAllPublishedType();
            $scope.query();
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
                        $scope.query();
                    } else {
                        layer.alert(data.message);
                    }

                }).error(function (data) {
                    layer.closeAll('loading');
                    layer.alert("清空回收站失败");
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
            }else if(type=='2'){
                return $scope.typeInstance;
            }else{
                return $scope.keywordInstance;
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
                ids += array[i][getField(type)];
                ids += ",";
            }
            deleteData(ids,type);
        }

        function deleteData(rowIds,type){
            var url = "article/deletedById";
            if(type == '2'){
                url = "releaseManagement/delArticleTypeById/rest";//类型
            }
            if(type == '3'){
                url = "article/delKeyword";//关键词
            }
            var confirm = layer.confirm('确认彻底删除勾选的数据吗？', {
                btn: ['取消','确认'] //按钮
            }, function(){
                layer.close(confirm);
            }, function(){
                layer.load(2);
                $http({
                    method: 'GET',
                    url: url,
                    params: {
                        article_id:rowIds,//文章删除用的
                        article_type_id:rowIds,//文章类型删除用的
                        id:rowIds,//关键词删除用的
                        type: '1'
                    }
                }).success(function (data) {
                    debugger
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
                ids += array[i][getField(type)];
                ids += ",";
            }
            recoverData(ids,type);
        }
        function getField(type) {
            if(type == '0' || type == '1'){文章
                return "article_id";
            }else if(type == '2'){//类型
                return "article_type_id";
            }else if(type == '3'){//关键词
                return "id";
            }
        }
        function recoverData(rowIds,type){
            var recoverType = '1';//恢复已发布论文和文章传1
            if(type == '3'){
                recoverType = '0';//关键词
            }
            if(type == '0' && $scope.query_params.dataType == '0'){
                recoverType = '2';//临时的文章
            }
            if(type == '1' && $scope.query_params.dataType == '0'){
                recoverType = '3';//临时的论文
            }
            if(type == '2'){
                recoverType = '4';//类型
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
                    type: $scope.query_params.dataType == '0'?'4':'5'
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

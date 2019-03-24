app.controller('publishManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'insureUtil', '$window', 'modalTip', '$compile',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, insureUtil, $window, modalTip, $compile) {
        var artcicle_type_id = $stateParams.type_id;
        $scope.activeTab=1;
        $scope.listObj = {
            navigationMsg: '管理平台 >发布管理',
            artcicle_type_id: $stateParams.type_id,//类型id
            pre_location: $stateParams.pre_location,
            comming_type_id: $stateParams.comming_type_id, //带过来的typeId
            current_location: "app.insure.publish_manage"
        };

        $scope.query_params = {
            type:'0',
            updateTimeStart:'',
            updateTimeEnd:'',
            createTimeStart:'',
            createTimeEnd:'',
            createTime:'',
            language:'',
            checkType:'',
            article_type_id: $scope.listObj.comming_type_id,
            details_size_more:'',
            details_size_less:'',
            message:''
        }
        if($stateParams.query_params){
            $scope.query_params = JSON.parse($stateParams.query_params);
        }
        if($scope.query_params.type == '0'){
            $scope.article_query_params = $scope.query_params;
            if(!$scope.paper_query_params){
                $scope.paper_query_params = $scope.article_query_params;
            }
        }else{
            $scope.paper_query_params = $scope.query_params;
            $("#tab2Btn").trigger("click");
            $scope.activeTab=2;
        }

        $scope.listAritcle = function () {

            $scope.articleTmpOption = {
                url: 'releaseManagement/selectAricleTmpList/rest',
                resultTag: 'result',
                method: 'get',
                queryParams: function (params) {
                    serializeJson(params, "queryArticleForm");
                    $.extend(params, {
                        view: 'select',
                        type: "0", //文章
                        del_type: "0", //非删除
                        tmp_type: "0" //非正式发布的
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
                    cellStyle: {
                        css: {
                            "min-width": "100px",
                            "max-width": "200px"
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
                    cellStyle: {
                        css: {
                            "min-width": "100px",
                            "max-width": "200px"
                        },
                        classes: ["overflow"]
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
                    title: '审核',
                    class: 'col-md-1',
                    align: 'center',
                    width: "100px",
                    formatter: function (value, row, index) {
                        if(row.check_type == '1'){
                            return '已审核';
                        }else {
                            return '<a class="a-check a-blue btn btn-default btn-sm" href="javascript:;">审核</a>';
                        }
                    },
                    events: {
                        'click .a-check': function (e, value, row, index) {
                            check(row.article_id, 0);
                        }
                    }
                }, {
                    title: '发布',
                    class: 'col-md-1',
                    align: 'center',
                    width: "100px",
                    formatter: function (value, row, index) {
                        return '<a class="a-publish a-blue btn btn-default btn-sm" href="javascript:;">发布</a>';
                    },
                    events: {
                        'click .a-publish': function (e, value, row, index) {
                            publish(row.article_id, 0);
                        }
                    }
                }, {
                    title: '操作',
                    class: 'col-md-1',
                    align: 'center',
                    width: '115px',
                    formatter: function (value, row, index) {

                        return '<a class="a-view a-blue" href="javascript:;">查看</a>&nbsp;' +
                            '<a class="a-edit a-blue" href="javascript:;">修改</a>&nbsp;' +
                            '<a class="a-delete a-red" href="javascript:;"> 删除</a>';
                    },
                    events: {
                        'click .a-view': function (e, value, row, index) {
                            $state.go('app.insure.modify_paper', {
                                pre_query_params: JSON.stringify($scope.query_params),
                                article_id: row.article_id,
                                pre_location:$scope.listObj.current_location,
                                operate_type:"view",
                                type: "0",//文章
                                tmp_type: "0"
                            });
                            // $scope.tableInstance.bootstrapTable('refresh');
                        },
                        'click .a-edit': function (e, value, row, index) {
                            $state.go('app.insure.modify_paper', {
                                pre_query_params: JSON.stringify($scope.query_params),
                                article_id: row.article_id,
                                pre_location:$scope.listObj.current_location,
                                operate_type:"edit",
                                type: "0",//文章
                                tmp_type: "0"
                            });
                            // $scope.tableInstance.bootstrapTable('refresh');
                        },
                        'click .a-delete': function (e, value, row, index) {
                            deleteData(row.article_id,'0');
                        }
                    }
                }
                ]
            };
        }
        $scope.listAritcle();


        //论文列表
        $scope.listPaper = function () {

            $scope.paperTmpOption = {
                url: 'releaseManagement/selectAricleTmpList/rest',
                resultTag: 'result',
                method: 'get',
                queryParams: function (params) {
                    serializeJson(params, "queryPaperForm");
                    $.extend(params, {
                        view: 'select',
                        type: "1", //论文
                        del_type: "0", //非删除
                        tmp_type: "0" //非正式发布的
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
                    cellStyle: {
                        css: {
                            "min-width": "100px",
                            "max-width": "200px"
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
                    cellStyle: {
                        css: {
                            "min-width": "100px",
                            "max-width": "200px"
                        },
                        classes: ["overflow"]
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
                    title: '审核',
                    class: 'col-md-1',
                    align: 'center',
                    width: "100px",
                    formatter: function (value, row, index) {
                        if(row.check_type == '1'){
                            return '已审核';
                        }else{
                            return '<a class="a-check a-blue btn btn-default btn-sm" href="javascript:;">审核</a>';
                        }
                    },
                    events: {
                        'click .a-check': function (e, value, row, index) {
                            check(row.article_id, 1);
                        }
                    }
                }, {
                    title: '发布',
                    class: 'col-md-1',
                    align: 'center',
                    width: "100px",
                    formatter: function (value, row, index) {
                        return '<a class="a-publish a-blue btn btn-default btn-sm" href="javascript:;">发布</a>';
                    },
                    events: {
                        'click .a-publish': function (e, value, row, index) {
                            publish(row.article_id, 1);
                        }
                    }
                }, {
                    title: '操作',
                    class: 'col-md-1',
                    align: 'center',
                    width: '115px',
                    formatter: function (value, row, index) {

                        return '<a class="a-view a-blue" href="javascript:;">查看</a>&nbsp;' +
                            '<a class="a-edit a-blue" href="javascript:;">修改</a>&nbsp;' +
                            '<a class="a-delete a-red" href="javascript:;"> 删除</a>';
                    },
                    events: {
                        'click .a-view': function (e, value, row, index) {
                            $state.go('app.insure.modify_paper', {
                                pre_query_params: JSON.stringify($scope.query_params),
                                article_id: row.article_id,
                                pre_location:$scope.listObj.current_location,
                                operate_type:"view",
                                type: "1",//论文
                                tmp_type: "0"
                            });
                            // $scope.tableInstance.bootstrapTable('refresh');
                        },
                        'click .a-edit': function (e, value, row, index) {
                            $state.go('app.insure.modify_paper', {
                                pre_query_params: JSON.stringify($scope.query_params),
                                article_id: row.article_id,
                                pre_location:$scope.listObj.current_location,
                                operate_type:"edit",
                                type: "1",//论文
                                tmp_type: "0"
                            });
                            // $scope.tableInstance.bootstrapTable('refresh');
                        },
                        'click .a-delete': function (e, value, row, index) {
                            deleteData(row.article_id,'1');
                        }
                    }
                }
                ]
            };
        }
        $scope.listPaper();


        //获取所有已发布的类型
        $scope.getAllPublishedType = function () {
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
                layer.alert("请求失败", {icon: 2})
            })
        }
        $scope.getAllPublishedType();

        $scope.queryArticle=function () {
            /*if(!$("#queryArticleForm [name=article_type_id]").val()){
                layer.msg("文章类型不能为空");
                return;
            }*/
            $scope.articleTmpInstance.bootstrapTable('refresh');
        }
        $scope.resetArticle=function () {
            $.each($("#queryArticleForm select,#queryArticleForm input"),
                function(i, n) {
                    $(n).val('');
                });
        }

        $scope.queryPager=function () {
            /*if(!$("#queryPaperForm [name=article_type_id]").val()){
                layer.msg("论文类型不能为空");
                return;
            }*/
            $scope.paperTmpInstance.bootstrapTable('refresh');
        }
        $scope.resetPager=function () {
            $.each($("#queryPaperForm select,#queryPaperForm input"),
                function(i, n) {
                    $(n).val('');
                });
        }

        $scope.checkAll=function (type) {
            if(type=='0'){
                $scope.articleTmpInstance.bootstrapTable('checkAll');
            }else{
                $scope.paperTmpInstance.bootstrapTable('refresh');
            }
        }
        $scope.uncheckAll=function (type) {
            if(type=='0'){
                $scope.articleTmpInstance.bootstrapTable('uncheckAll');
            }else{
                $scope.paperTmpInstance.bootstrapTable('uncheckAll');
            }
        }
        $scope.batchPublish=function (type) {
            var array;
            if(type=='0'){
                array = $scope.articleTmpInstance.bootstrapTable('getSelections');
            }else{
                array = $scope.paperTmpInstance.bootstrapTable('getSelections');
            }
            if(!array || array.length == 0){
                layer.msg("请至少勾选一条数据");
                return;
            }
            var ids = "";
            for(var i = 0;i<array.length;i++){
                ids += array[i].article_id;
                ids += ",";
            }
            publish(ids,type);
        }
        function publish(rowIds,type){
            var confirm = layer.confirm('确认发布勾选的数据吗？', {
                btn: ['取消','确认'] //按钮
            }, function(){
                layer.close(confirm);
            }, function(){
                layer.load(2);
                $http({
                    method: 'GET',
                    url: 'releaseManagement/pushAricleTmpById/rest',
                    params: {
                        articleIds: rowIds,
                        type:type
                    }
                }).success(function (data) {
                    layer.closeAll('loading');
                    if (data.code == 0) {
                        layer.alert(data.message);
                        if(type=='0'){
                            $scope.articleTmpInstance.bootstrapTable('refresh');
                        }else{
                            $scope.paperTmpInstance.bootstrapTable('refresh');
                        }
                    } else {
                        layer.alert(data.message);
                    }

                }).error(function (data) {
                    layer.closeAll('loading');
                    layer.alert("发布失败");
                })
            });
        }
        $scope.batchDelete=function (type) {
            var array;
            if(type=='0'){
                array = $scope.articleTmpInstance.bootstrapTable('getSelections');
            }else{
                array = $scope.paperTmpInstance.bootstrapTable('getSelections');
            }
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
            var confirm = layer.confirm('确认删除勾选的数据吗？', {
                btn: ['取消','确认'] //按钮
            }, function(){
                layer.close(confirm);
            }, function(){
                layer.load(2);
                $http({
                    method: 'GET',
                    url: 'releaseManagement/delAricleTmpList/rest',
                    params: {
                        articleIdList: rowIds
                    }
                }).success(function (data) {
                    layer.closeAll('loading');
                    if (data.code == 0) {
                        layer.alert(data.message);
                        if(type=='0'){
                            $scope.articleTmpInstance.bootstrapTable('refresh');
                        }else{
                            $scope.paperTmpInstance.bootstrapTable('refresh');
                        }
                    } else {
                        layer.alert(data.message);
                    }

                }).error(function (data) {
                    layer.closeAll('loading');
                    layer.alert("删除失败");
                })
            });
        }
        //审核
        function check(article_id,type){
            var confirm = layer.confirm('确认审核勾选的数据吗？', {
                btn: ['取消','确认'] //按钮
            }, function(){
                layer.close(confirm);
            }, function(){
                layer.load(2);
                $http({
                    method: 'GET',//TODO 后台没支持已发布的审核啊
                    url: 'releaseManagement/getAricleTmpCheckById/rest',
                    params: {
                        articleIds: article_id,
                        type:type
                    }
                }).success(function (data) {
                    layer.closeAll('loading');
                    if (data.code == 0) {
                        layer.alert(data.message);
                        if(type=='0'){
                            $scope.articleTmpInstance.bootstrapTable('refresh');
                        }else{
                            $scope.paperTmpInstance.bootstrapTable('refresh');
                        }
                    } else {
                        layer.alert(data.message);
                    }

                }).error(function (data) {
                    layer.closeAll('loading');
                    layer.alert("删除失败");
                })
            });
        }

    }]);


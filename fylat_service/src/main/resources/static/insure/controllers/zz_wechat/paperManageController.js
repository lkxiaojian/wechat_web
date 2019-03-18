app.controller('paperManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'insureUtil', '$window', 'modalTip', '$compile',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, insureUtil, $window, modalTip, $compile) {
        $scope.listObj = {
            current_location: 'app.insure.paper_manage',
            navigationMsg: '管理平台 >论文管理',
            defaultSearchParams: {
                view: 'select',
                type:"1", //论文
                del_type:"0", //非删除
                tmp_type:"1" //正式发布的
            },
        }


        //论文列表
        $scope.listAritcle = function () {

            $scope.tableOption = {
                url: 'releaseManagement/selectAricleTmpList/rest',
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
                        title: '正文',
                        class: 'col-md-1',
                        field: 'details_txt',
                        align: 'center',
                        cellStyle:{
                            css:{
                                "min-width":"100px",
                                "max-width":"200px"
                            },
                            classes:["overflow"]
                        }
                    }, {
                        title: '操作',
                        class: 'col-md-1',
                        align: 'center',
                        width: '100px',
                        formatter: function (value, row, index) {

                            return '<a class="a-view a-blue" href="javascript:;">查看</a>&nbsp;' +
                                '<a class="a-edit a-blue" href="javascript:;">修改</a>&nbsp;' +
                                '<a class="a-delete a-red" href="javascript:;"> 删除</a>';
                        },
                        events: {
                            'click .a-view': function (e, value, row, index) {
                                $state.go('app.insure.modify_article', {article_id: row.article_id,pre_location:$scope.listObj.current_location,operate_type:"view",article_type: "article"});
                                // $scope.tableInstance.bootstrapTable('refresh');
                            },
                            'click .a-edit': function (e, value, row, index) {
                                $state.go('app.insure.modify_article', {article_id: row.article_id,pre_location:$scope.listObj.current_location,operate_type:"edit",article_type: "article"});
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
            if(!$("#article_type_id").val()){
                modalTip({
                    tip: "论文类型不能为空",
                    type: true
                });
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
        $scope.batchDownload = function(){
            var array = $scope.tableInstance.bootstrapTable('getSelections');
            if(!array || array.length == 0){
                modalTip({
                    tip: "请至少勾选一条数据",
                    type: true
                });
                return;
            }
            for(var i = 0;i<array.length;i++){

            }
        }
        $scope.batchDelete = function(){
            var array = $scope.tableInstance.bootstrapTable('getSelections');
            if(!array || array.length == 0){
                modalTip({
                    tip: "请至少勾选一条数据",
                    type: true
                });
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
            if (confirm(switchLang.switchLang('确认删除勾选的数据吗？'))) {
                $http({
                    method: 'GET',
                    url: 'releaseManagement/delAricleTmpList/rest',
                    params: {
                        articleIdList: rowIds
                    }
                }).success(function (data) {
                    if (data.code == 0) {
                        modalTip({
                            tip: data.message,
                            type: true
                        });
                        $scope.tableInstance.bootstrapTable('refresh');
                    } else {
                        modalTip({
                            tip: data.message,
                            type: false
                        });
                    }

                }).error(function (data) {
                    modalTip({
                        tip: "删除失败",
                        type: false
                    });
                })
            }
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
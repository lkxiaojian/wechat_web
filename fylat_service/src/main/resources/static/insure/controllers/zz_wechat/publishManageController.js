app.controller('publishManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'insureUtil', '$window', 'modalTip', '$compile',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, insureUtil, $window, modalTip, $compile) {
        var artcicle_type_id = $stateParams.type_id;
        $scope.listObj = {
            navigationMsg: '管理平台 >发布管理',
            artcicle_type_id: $stateParams.type_id,//类型id
            pre_location: $stateParams.pre_location,
            current_location: "app.insure.publish_manage"
        };

        //论文列表
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
                            $state.go('app.insure.modify_article', {
                                article_id: row.article_id,
                                pre_location: $scope.listObj.current_location,
                                operate_type: "view",
                                article_type: "article"
                            });
                            // $scope.tableInstance.bootstrapTable('refresh');
                        },
                        'click .a-edit': function (e, value, row, index) {
                            $state.go('app.insure.modify_article', {
                                article_id: row.article_id,
                                pre_location: $scope.listObj.current_location,
                                operate_type: "edit",
                                article_type: "article"
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
                    title: '字数',
                    class: 'col-md-1',
                    field: 'word_count',
                    align: 'center',
                    width: "100px"
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
                            $state.go('app.insure.modify_article', {
                                article_id: row.article_id,
                                pre_location: $scope.listObj.current_location,
                                operate_type: "view",
                                article_type: "article"
                            });
                            // $scope.tableInstance.bootstrapTable('refresh');
                        },
                        'click .a-edit': function (e, value, row, index) {
                            $state.go('app.insure.modify_article', {
                                article_id: row.article_id,
                                pre_location: $scope.listObj.current_location,
                                operate_type: "edit",
                                article_type: "article"
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
            if(!$("#queryArticleForm [name=article_type_id]").val()){
                layer.msg("文章类型不能为空");
                return;
            }
            $scope.articleTmpInstance.bootstrapTable('refresh');
        }
        $scope.resetArticle=function () {
            $.each($("#queryArticleForm select,#queryArticleForm input"),
                function(i, n) {
                    $(n).val('');
                });
        }

        $scope.queryPager=function () {
            if(!$("#queryPaperForm [name=article_type_id]").val()){
                layer.msg("论文类型不能为空");
                return;
            }
            $scope.paperTmpInstance.bootstrapTable('refresh');
        }
        $scope.resetPager=function () {
            $.each($("#queryPaperForm select,#queryPaperForm input"),
                function(i, n) {
                    $(n).val('');
                });
        }

    }]);


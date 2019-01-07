app.controller('articleListManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'insureUtil', '$window', 'modalTip', '$compile',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, insureUtil, $window, modalTip, $compile) {
        var editor;
        $scope.listObj = {
            navigationMsg: '管理平台 >文章管理',
            seachMessage: '',
            seach: function () {
                var a=$scope.listObj.seachMessage;
                $scope.testInstance.bootstrapTable('refresh')
            },
            clear: function () {
                $scope.listObj.seachMessage = '';
            }
        }


        //文章列表
        $scope.listAritcle = function () {

            $scope.testOption = {
                url: 'article/query',
                resultTag: 'result',
                method: 'get',
                // params: {
                //     view: 'select',
                //     message: $scope.listObj.seachMessage
                // },
                queryParams: function (params) {
                    // console.log(params);
                    $.extend(params, {
                        view: 'select',
                        message: $scope.listObj.seachMessage
                    });
                    return params;
                },
                message: $scope.listObj.seachMessage,
                pageList: ['All'],
                pageSize: 10,
                onLoadSuccess: function (data) {
                    console.log(data)
                },
                columns: [
                    {
                        title: '标题',
                        class: 'col-md-1',
                        field: 'article_title',
                        align: 'center',
                        width: "15%"
                    }, {
                        title: '作者',
                        class: 'col-md-1',
                        field: 'author',
                        align: 'center',
                        width: "4%"

                    }, {
                        title: '来源',
                        class: 'col-md-1',
                        field: 'source',
                        align: 'center',
                        sortable: false,
                        width: "4%"
                    }, {
                        title: '字数',
                        class: 'col-md-1',
                        field: 'word_count',
                        align: 'center',
                        width: "4%"
                    }, {
                        title: '发表时间',
                        class: 'col-md-1',
                        field: 'create_time',
                        align: 'center',
                        width: "7%",
                        formatter: function (value, row, index) {
                            if (value) {
                                return insureUtil.dateToString(new Date(value), "yyyy-MM-dd hh:mm:ss");
                            }
                            return '';
                        }
                    }, {
                        title: '操作',
                        class: 'col-md-1',
                        align: 'center',
                        width: '10%',
                        formatter: function (value, row, index) {

                            return '<a class="a-edit a-blue" href="javascript:;">编辑</a>&nbsp;' +
                                '<a class="a-delete a-red" href="javascript:;"> 删除</a>';
                        },
                        events: {
                            'click .a-edit': function (e, value, row, index) {
                                $state.go('app.insure.modify_article', {article_id: row.article_id});
                                $scope.testInstance.bootstrapTable('refresh');
                                // modalTip({
                                //     tip: '开发中',
                                //     type: false
                                // });
                            },
                            'click .a-delete': function (e, value, row, index) {
                                if (confirm(switchLang.switchLang('确认删除该片文章吗？'))) {
                                    $http({
                                        method: 'GET',
                                        url: 'article/deletedById',
                                        params: {
                                            view: 'delete',
                                            article_id: row.article_id
                                        }
                                    }).success(function (data) {
                                        if (data.code == 0) {
                                            modalTip({
                                                tip: data.message,
                                                type: true
                                            });

                                            // angular.element('#getAllArticle').bootstrapTable('selectPage', 1);
                                            // angular.element('#getAllArticle').bootstrapTable('refresh');
                                            $scope.testInstance.bootstrapTable('refresh');
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
                                $scope.testInstance.bootstrapTable('refresh');
                            }
                        }
                    }
                ]
            };
        }

        $scope.listAritcle();

    }])
;


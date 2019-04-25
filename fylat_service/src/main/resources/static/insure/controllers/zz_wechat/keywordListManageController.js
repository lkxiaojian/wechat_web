app.controller('keywordListManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'insureUtil', '$window', 'modalTip', '$compile',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, insureUtil, $window, modalTip, $compile) {
        var editor;
        $scope.listObj = {
            navigationMsg: '管理平台 >爬虫关键词列表',
            seachMessage: '',
            parent_id: null,
            seach: function () {
                // var a=$scope.listObj.seachMessage;
                $scope.testInstance.bootstrapTable('refresh')
            },
            clear: function () {
                $scope.listObj.seachMessage = '';
                $scope.listObj.region.selected = undefined;
            },
            add: function () {
                $state.go('app.insure.keyword_Manage');
            },
            projectData: [],
            region: {selected: undefined},
            getTypeSelect: function (item) {
                $scope.listObj.region.selected = item;
                $scope.listObj.parent_id = item.article_type_id;
            },
            postDownload: function () {
                $http({
                    url: 'article/getAllDomain',
                    method: "GET"
                }).success(function (data) {
                    // $scope.listObj.region.selected = data[0];
                    $scope.listObj.projectData = data;
                }).error(function (data) {
                    alert("服务器请求错误")
                });
            }
        };


        //领域列表
        $scope.listDomain = function () {
            $scope.testOption = {
                url: 'article/keywordQuery',
                resultTag: 'result',
                method: 'get',
                queryParams: function (params) {
                    $.extend(params, {
                        view: 'select',
                        message: $scope.listObj.seachMessage,
                        //领域ID
                        parent_id: $scope.listObj.parent_id
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
                        title: 'ID',
                        class: 'col-md-1',
                        field: 'id',
                        align: 'center',
                        width: "6%"
                    }, {
                        title: '所属领域',
                        class: 'col-md-1',
                        field: 'article_type_name',
                        align: 'center',
                        width: "13%"

                    }, {
                        title: '关键词',
                        class: 'col-md-1',
                        field: 'keyword_name',
                        align: 'center',
                        width: "13%"

                    }, {
                        title: '操作',
                        class: 'col-md-1',
                        align: 'center',
                        width: '5%',
                        formatter: function (value, row, index) {

                            return '<a class="a-edit a-blue" href="javascript:;">编辑</a>&nbsp;' +
                                '<a class="a-delete a-red" href="javascript:;"> 删除</a>';
                        },
                        events: {
                            'click .a-edit': function (e, value, row, index) {
                                $state.go('app.insure.modifyKeyword', {
                                    id: row.id,
                                    keyword_name: row.keyword_name,
                                    parent_id: row.parent_id,
                                    article_type_name: row.article_type_name});
                                $scope.testInstance.bootstrapTable('refresh');
                                // modalTip({
                                //     tip: '开发中',
                                //     type: false
                                // });
                            },
                            'click .a-delete': function (e, value, row, index) {
                                if (confirm(switchLang.switchLang('确认删除该关键词吗？'))) {
                                    $http({
                                        method: 'GET',
                                        url: 'article/delKeyword',
                                        params: {
                                            view: 'delete',
                                            id: row.id
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
        };

        $scope.listObj.postDownload();
        $scope.listDomain();

    }])
;

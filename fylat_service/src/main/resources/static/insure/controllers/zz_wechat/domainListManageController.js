app.controller('domainListManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'insureUtil', '$window', 'modalTip', '$compile',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, insureUtil, $window, modalTip, $compile) {
        var editor;
        $scope.listObj = {
            navigationMsg: '管理平台 >领域列表',
            seachMessage: '',
            seach: function () {
                // var a=$scope.listObj.seachMessage;
                $scope.testInstance.bootstrapTable('refresh')
            },
            clear: function () {
                $scope.listObj.seachMessage = '';
            },
            add: function () {
                $state.go('app.insure.domain_Manage');
            }
        }


        //领域列表
        $scope.listDomain = function () {

            $scope.testOption = {
                url: 'article/getConditionDomain',
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
                        title: '领域名称',
                        class: 'col-md-1',
                        field: 'article_type_name',
                        align: 'center',
                        width: "6%"
                    }, {
                        title: '关键词',
                        class: 'col-md-1',
                        field: 'article_type_keyword',
                        align: 'center',
                        width: "13%"

                    }, {
                        title: '父ID',
                        class: 'col-md-1',
                        field: 'parentid',
                        align: 'center',
                        sortable: false,
                        width: "4%"
                    },  {
                        title: '创建时间',
                        class: 'col-md-1',
                        field: 'create_time',
                        align: 'center',
                        width: "5%",
                        formatter: function (value, row, index) {
                            if (value) {
                                return insureUtil.dateToString(new Date(value), "yyyy-MM-dd");
                            }
                            return '';
                        }
                        // }, {
                        //     title: '领域id',
                        //     class: 'col-md-1',
                        //     field: 'article_type_id',
                        //     align: 'center',
                        //     width: "3%"
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
                                $state.go('app.insure.modifyDomain', {
                                    article_type_id: row.article_type_id,
                                    article_type_name: row.article_type_name,
                                    article_type_keyword: row.article_type_keyword});
                                $scope.testInstance.bootstrapTable('refresh');
                                // modalTip({
                                //     tip: '开发中',
                                //     type: false
                                // });
                            },
                            'click .a-delete': function (e, value, row, index) {
                                if (confirm(switchLang.switchLang('确认删除该领域吗？'))) {
                                    $http({
                                        method: 'GET',
                                        url: 'article/delDomainById',
                                        params: {
                                            view: 'delete',
                                            id: row.article_type_id
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

        $scope.listDomain();

    }])
;

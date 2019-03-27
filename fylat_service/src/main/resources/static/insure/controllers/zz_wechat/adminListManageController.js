app.controller('adminListManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'insureUtil', '$window', 'modalTip', '$compile',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, insureUtil, $window, modalTip, $compile) {
        var editor;
        $scope.listObj = {
            navigationMsg: '管理平台 >管理员',
            seachMessage: '',
            parent_id: null,
            defaultSearchParams: {
                view: 'select',
                state:'0',
                type:"0", //文章
                tmp_type:"1", //正式发布的
                hour:"10",
                size:"10",
                page:"1",


            },


        };


        //领域列表
        $scope.listAdmin = function () {
            $scope.testOption = {
                url: 'webSysUser/selUser/rest',
                resultTag: 'result',
                method: 'get',
                queryParams: function (params) {
                    serializeJson(params, "queryForm");
                    $.extend(params, $scope.listObj.defaultSearchParams);
                    return params;
                },
                pageList: ['All'],
                size: 10,
                onLoadSuccess: function (data) {
                    console.log(data)
                },
                columns: [
                    {
                        title: '编号',
                        class: 'col-md-1',
                        field: 'id',
                        align: 'center',
                        width: "6%"
                    }, {
                        title: '管理员名称',
                        class: 'col-md-1',
                        field: 'name',
                        align: 'center',
                        width: "13%"

                    }, {
                        title: '最近登录时间',
                        class: 'col-md-1',
                        field: 'updateTime',
                        align: 'center',
                        width: "13%"

                    },  {
                        title: '登录次数',
                        class: 'col-md-1',
                        field: 'keyword_name',
                        align: 'center',
                        width: "13%"

                    }, {
                        title: '创建时间',
                        class: 'col-md-1',
                        field: 'createTime',
                        align: 'center',
                        width: "13%"

                    },{
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
                                $state.go('app.insure.adminEdit', {
                                    id: row.id});
                                $scope.testInstance.bootstrapTable('refresh');
                                // modalTip({
                                //     tip: '开发中',
                                //     type: false
                                // });
                            },
                            'click .a-delete': function (e, value, row, index) {
                                if (confirm(switchLang.switchLang('确认删除该管理员吗？'))) {
                                    $http({
                                        method: 'GET',
                                        url: 'webSysUser/removeUser/rest',
                                        params: {
                                            view: 'delete',
                                            list: row.id
                                        }
                                    }).success(function (data) {
                                        if (data.code == 0) {
                                            modalTip({
                                                tip: data.message,
                                                type: true
                                            });

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

        $scope.listAdmin();

    }])
;
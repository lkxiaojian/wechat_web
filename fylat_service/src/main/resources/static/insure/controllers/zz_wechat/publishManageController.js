app.controller('publishManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'insureUtil', '$window', 'modalTip', '$compile',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, insureUtil, $window, modalTip, $compile) {
        var editor;
        $scope.listObj = {
            navigationMsg: '管理平台 >发布管理',
            artcicle_type_id: null,
            seachMessage: '',
            activeTab: 1,
            result: [
                {
                    "article_id": "10e279c1064ac80bf21b48af6edbf46f",
                    "article_keyword": "俱乐部,40,师爷,式,电感式,能量,元件,规模,为主,经济",
                    "article_score": 0,
                    "article_title": "一文读懂传感器,全球著名传感器企业及产品应用领域都在这!",
                    "article_type_id": 36946,
                    "article_type_name": "测试key12",
                    "author": "",
                    "check_type": 0,
                    "content_excerpt": "一文",
                    "create_time": 1472699487000,
                    "details_size": 2963,
                    "source": "工业4俱乐部",
                    "update_time": 1551136841000
                }
            ],
            seach: function () {
                var a=$scope.listObj.seachMessage;
                $scope.testInstance.bootstrapTable('refresh')
            },
            clear: function () {
                $scope.listObj.seachMessage = '';
            },
            getKeywordMessage: function () {
                // $scope.listObj.artcicle_type_id = $stateParams.artcicle_type_id;
                $scope.listObj.artcicle_type_id = 54;
            },
            //文章列表
            listAritcle: function () {
                console.log($scope.listObj.artcicle_type_id)
                console.log($scope.listObj.activeTab)

                // $http({
                //     url: 'releaseManagement/selectAricleTmpList/rest',
                //     method: 'POST',
                //     data: {
                //         type: 0 ,
                //         article_type_id: 54,
                //         pageNumber: 1,
                //         pageSize: 10,
                //         del_type: 0,
                //         tmp_type: 1,
                //         checkType: 0,
                //         message:null
                //     }
                // }).success(function (data) {
                //     console.log(data)
                //     if (data.code == 0) {
                //         modalTip({
                //             tip: switchLang.switchLang('请求成功'),
                //             type: true
                //         });
                //     } else {
                //         modalTip({
                //             tip: switchLang.switchLang('请求失败'),
                //             type: false
                //         });
                //     }
                // }).error(function (data, status, headers, config) {
                //     console.log(data)
                //     modalTip({
                //         tip: switchLang.switchLang('请求失败'),
                //         type: false
                //     });
                //
                // });

                $scope.testOption = {
                    url: 'releaseManagement/selectAricleTmpList/rest',
                    method: 'POST',
                    data: {
                        type: 0 ,
                        article_type_id: 54,
                        pageNumber: 1,
                        pageSize: 10,
                        del_type: 0,
                        tmp_type: 1,
                        checkType: 0,
                        message:null
                    },
                    // resultTag: 'result',
                    resultTag: $scope.listObj.result,
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
                    // onLoadSuccess: function (data) {
                    //     console.log(data)
                    // },
                    columns: [
                        {
                            title: '选择',
                            class: 'col-md-1',
                            field: 'article_type_name',
                            align: 'center',
                            width: "4%"
                        },
                        {
                            title: '文章/论文名称',
                            class: 'col-md-1',
                            field: 'word_count',
                            align: 'center',
                            width: "4%"
                        },
                        {
                            title: '所属分类',
                            class: 'col-md-1',
                            field: 'word_count',
                            align: 'center',
                            width: "4%"
                        },
                        {
                            title: '发表时间',
                            class: 'col-md-1',
                            field: 'create_time',
                            align: 'center',
                            width: "4%",
                            formatter: function (value, row, index) {
                                if (value) {
                                    return insureUtil.dateToString(new Date(value), "yyyy-MM-dd");
                                }
                                return '';
                            }
                        },
                        {
                            title: '入库时间',
                            class: 'col-md-1',
                            field: 'create_time',
                            align: 'center',
                            width: "4%",
                            formatter: function (value, row, index) {
                                if (value) {
                                    return insureUtil.dateToString(new Date(value), "yyyy-MM-dd");
                                }
                                return '';
                            }
                        },
                        {
                            title: '关键词',
                            class: 'col-md-1',
                            field: 'word_count',
                            align: 'center',
                            width: "4%"
                        },
                        {
                            title: '摘要',
                            class: 'col-md-1',
                            field: 'word_count',
                            align: 'center',
                            width: "4%"
                        },
                        {
                            title: '爬取网址/公众号',
                            class: 'col-md-1',
                            field: 'word_count',
                            align: 'center',
                            width: "4%"
                        },
                        {
                            title: '作者',
                            class: 'col-md-1',
                            field: 'word_count',
                            align: 'center',
                            width: "4%"
                        },
                        {
                            title: '分数',
                            class: 'col-md-1',
                            field: 'word_count',
                            align: 'center',
                            width: "4%"
                        },
                        {
                            title: '字数',
                            class: 'col-md-1',
                            field: 'word_count',
                            align: 'center',
                            width: "4%"
                        },
                        {
                            title: '正文',
                            class: 'col-md-1',
                            field: 'word_count',
                            align: 'center',
                            width: "4%"
                        },
                        {
                            title: '审核',
                            class: 'col-md-1',
                            field: 'word_count',
                            align: 'center',
                            width: "4%"
                        },
                        {
                            title: '发布',
                            class: 'col-md-1',
                            field: 'word_count',
                            align: 'center',
                            width: "4%"
                        },
                        {
                            title: '操作',
                            class: 'col-md-1',
                            field: 'word_count',
                            align: 'center',
                            width: "4%"
                        },
                        // {
                        //     title: '选择',
                        //     class: 'col-md-1',
                        //     field: 'article_title',
                        //     align: 'center',
                        //     width: "15%"
                        // }, {
                        //     title: '作者',
                        //     class: 'col-md-1',
                        //     field: 'author',
                        //     align: 'center',
                        //     width: "4%"
                        //
                        // }, {
                        //     title: '来源',
                        //     class: 'col-md-1',
                        //     field: 'source',
                        //     align: 'center',
                        //     sortable: false,
                        //     width: "4%"
                        // }, {
                        //     title: '字数',
                        //     class: 'col-md-1',
                        //     field: 'word_count',
                        //     align: 'center',
                        //     width: "4%"
                        // }, {
                        //     title: '发表时间',
                        //     class: 'col-md-1',
                        //     field: 'create_time',
                        //     align: 'center',
                        //     width: "5%",
                        //     formatter: function (value, row, index) {
                        //         if (value) {
                        //             return insureUtil.dateToString(new Date(value), "yyyy-MM-dd");
                        //         }
                        //         return '';
                        //     }
                        // }, {
                        //     title: '文章id',
                        //     class: 'col-md-1',
                        //     field: 'article_id',
                        //     align: 'center',
                        //     width: "7%"
                        // }, {
                        //     title: '操作',
                        //     class: 'col-md-1',
                        //     align: 'center',
                        //     width: '5%',
                        //     formatter: function (value, row, index) {
                        //
                        //         return '<a class="a-edit a-blue" href="javascript:;">编辑</a>&nbsp;' +
                        //             '<a class="a-delete a-red" href="javascript:;"> 删除</a>';
                        //     },
                        //     events: {
                        //         'click .a-edit': function (e, value, row, index) {
                        //             $state.go('app.insure.modify_article', {article_id: row.article_id});
                        //             $scope.testInstance.bootstrapTable('refresh');
                        //             // modalTip({
                        //             //     tip: '开发中',
                        //             //     type: false
                        //             // });
                        //         },
                        //         'click .a-delete': function (e, value, row, index) {
                        //             if (confirm(switchLang.switchLang('确认删除该片文章吗？'))) {
                        //                 $http({
                        //                     method: 'GET',
                        //                     url: 'article/deletedById',
                        //                     params: {
                        //                         view: 'delete',
                        //                         article_id: row.article_id
                        //                     }
                        //                 }).success(function (data) {
                        //                     if (data.code == 0) {
                        //                         modalTip({
                        //                             tip: data.message,
                        //                             type: true
                        //                         });
                        //
                        //                         // angular.element('#getAllArticle').bootstrapTable('selectPage', 1);
                        //                         // angular.element('#getAllArticle').bootstrapTable('refresh');
                        //                         $scope.testInstance.bootstrapTable('refresh');
                        //                     } else {
                        //                         modalTip({
                        //                             tip: data.message,
                        //                             type: false
                        //                         });
                        //                     }
                        //
                        //                 }).error(function (data) {
                        //                     modalTip({
                        //                         tip: "删除失败",
                        //                         type: false
                        //                     });
                        //                 })
                        //             }
                        //             $scope.testInstance.bootstrapTable('refresh');
                        //         }
                        //     }
                        // }
                    ]
                };
            }
        };

        $scope.listObj.getKeywordMessage();
        $scope.listObj.listAritcle();

    }])
;


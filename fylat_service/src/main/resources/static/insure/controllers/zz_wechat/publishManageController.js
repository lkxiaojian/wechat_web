app.controller('publishManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'insureUtil', '$window', 'modalTip', '$compile',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, insureUtil, $window, modalTip, $compile) {
        var artcicle_type_id = $stateParams.type_id;
        $scope.listObj = {
            navigationMsg: '管理平台 >发布管理',
            artcicle_type_id: $stateParams.type_id,
            seachMessage: '',
            activeTab: 1,
            type: 0,
            del_type: 0,
            tmp_type: 1,
            checkType: 0,
            message: null,

            seach: function () {
                var a = $scope.listObj.seachMessage;
                $scope.articleTmpOption.bootstrapTable('refresh')
            },
            clear: function () {
                $scope.listObj.seachMessage = '';
            },


        };

        //文章列表
        $scope.listAritcle= function () {
            $scope.articleTmpOption = {
                url: 'releaseManagement/selectAricleTmpList/rest',
                method: 'GET',
                pageList: ['All'],
                resultTag: 'result',
                pageSize: 10,
                queryParams: function (params) {
                    $.extend(params, {
                        view: 'select',
                        message: $scope.listObj.seachMessage,
                        article_type_id: $scope.listObj.artcicle_type_id,
                        type: $scope.listObj.type
                    });
                    return params;
                },
                onLoadSuccess: function (data) {
                    console.log(data)
                },
                columns: [
                    {
                        title: '文章/论文名称',
                        class: 'col-md-1',
                        field: 'article_title',
                        align: 'center',
                        width: "4%"
                    },
                    {
                        title: '所属分类',
                        class: 'col-md-1',
                        field: 'article_type_name',
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
                        title: '关键词',
                        class: 'col-md-1',
                        field: 'article_keyword',
                        align: 'center',
                        width: "4%"
                    },
                    {
                        title: '摘要',
                        class: 'col-md-1',
                        field: 'content_excerpt',
                        align: 'center',
                        width: "4%",
                        formatter: function (value, row, index) {
                            if (value.length>10) {
                                return value.substring(0,10);
                            }
                            return value;
                        }
                    },
                    {
                        title: '爬取网址/公众号',
                        class: 'col-md-1',
                        field: 'source',
                        align: 'center',
                        width: "4%"
                    },
                    {
                        title: '作者',
                        class: 'col-md-1',
                        field: 'author',
                        align: 'center',
                        width: "4%"
                    },
                    {
                        title: '分数',
                        class: 'col-md-1',
                        field: 'article_score',
                        align: 'center',
                        width: "4%"
                    },
                    {
                        title: '审核',
                        class: 'col-md-1',
                        field: 'check_type',
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

                ]
            };
        };

        $scope.listAritcle();

    }])
;


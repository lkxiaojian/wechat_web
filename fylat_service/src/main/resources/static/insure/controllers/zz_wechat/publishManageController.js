app.controller('publishManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'insureUtil', '$window', 'modalTip', '$compile',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, insureUtil, $window, modalTip, $compile) {
        var artcicle_type_id = $stateParams.type_id;
        $scope.listObj = {
            navigationMsg: '管理平台 >发布管理',
            artcicle_type_id: $stateParams.type_id,//类型id
            seachMessage: '',//搜索内容
            type: 0,//0 微信文章  1 论文
            del_type: 0,// 查看的是否是回收站 0不是 1是
            tmp_type: 1,//查询的是否是发布管理的内容 1是 0不是
            checkType: 0,//是否审核0 未审核 1 审核过
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
                url: 'releaseManagement/selectAricleTmpList/rest',//url
                method: 'GET',
                pageList: ['All'],
                resultTag: 'result',
                pageSize: 10,//每页请求以的数量
                queryParams: function (params) {//参数
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
                        field: 'article_title',//与返回的字段需要对应
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
                            //可以做些点击事件，详细用法参考 controllers\zz_wechat\domainListManageController.js  zz_wechat\articleListManageController.js
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


/**
 * 领域管理
 */
app.controller('keywordManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', '$window', 'modalTip',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams,  $window, modalTip) {
        $scope.update = function () {
            if ($scope.listObj.integrationQuery.domain_keyword == null) {
                modalTip({
                    tip: switchLang.switchLang('关键词为空'),
                    type: false
                });
                return;
            }
            $http({
                url : 'article/addKeyword',
                method: 'POST',
                data: {
                    keyword: $scope.listObj.integrationQuery.domain_keyword,
                    parent_id: $scope.listObj.integrationQuery.article_type_id
                }
            }).success(function (data) {
                console.log(data)
                if (data!=null&&data.code == 0) {
                    modalTip({
                        tip: switchLang.switchLang('添加成功'),
                        type: true
                    });
                    $scope.listObj. integrationQuery= {
                        article_keyword: null,//关键词
                    }
                    $state.go('app.insure.keywordList');

                } else {
                    modalTip({
                        tip: switchLang.switchLang('添加失败'),
                        type: false
                    });
                }
            }).error(function (data, status, headers, config) {
                // console.log(data)
                // modalTip({
                //     tip: switchLang.switchLang('添加失败'),
                //     type: false
                // });

            });
        };

        $scope.listObj = {
            navigationMsg: '管理平台 > 关键词管理',   //导航栏显示信息
            // projectData: fylatService.projectSelect,   //产品选择框数据
            // /**
            //  * 选择产品后，级联显示类型
            //  */
            // getTypeSelect: function (select) {
            //     $scope.listObj.typeData = select.typeSelect
            // },
            //
            // addIntegration: function () {        //新增进程按钮
            //     $state.go('app.insure.integrationManage_addIntegration', {'param': 'add'});
            //
            // },
            //查询参数
            integrationQuery: {
                domain_keyword: null,
                article_type_id: null
            },
            projectData: [],
            region: {selected: undefined},
            getTypeSelect: function (item) {
                $scope.listObj.region.selected = item;
                $scope.listObj.integrationQuery.article_type_id = item.article_type_id;
            },
            postDownload: function () {
                $http({
                    url: 'article/getAllDomain',
                    method: "GET"
                }).success(function (data) {
                    $scope.listObj.region.selected = data[0];
                    $scope.listObj.integrationQuery.article_type_id = data[0].article_type_id;
                    $scope.listObj.projectData = data;
                }).error(function (data) {
                    alert("服务器请求错误")
                });
            }
        };
        $scope.listObj.postDownload();
    }]);



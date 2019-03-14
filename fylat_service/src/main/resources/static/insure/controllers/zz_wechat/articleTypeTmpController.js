app.controller('articleTypeManageTmpController', ['$scope', '$modal', '$http', '$state', 'switchLang', '$stateParams', 'Upload', '$window', 'modalTip',
    function ($scope, $modal, $http, $state, switchLang, $stateParams, Upload, $window, modalTip) {

        $scope.data = {
            file_icon: null,
            file_back: null

        };

        $scope.data = {
            file_icon_server: null,
            file_back_server: null
        };
        $scope.type_id = $stateParams.type_id;
        $scope.mulImages = [];
        $scope.update = function () {
            $scope.mulImages = [];
            if ($scope.listObj.integrationQuery.domain_name == null) {
                alert("文章类型名字为空！！！")
                return;
            }

            if ($scope.listObj.integrationQuery.domain_keyword == null) {
                alert("关键词为空！！！")
                return;
            }
            if (!$scope.data.file_icon || !$scope.data.file_back) {
                alert("有图片还没有选择")
                $scope.mulImages = [];
                return;
            }

            var url = 'releaseManagement/updateTypeMessage/rest';
            var data = angular.copy({
                artcicle_type_id: $scope.type_id,
                name: $scope.listObj.integrationQuery.domain_name,
                keyword:$scope.listObj.integrationQuery.domain_keyword,
                parentid:$scope.listObj.integrationQuery.parentId,
                type:0,
                 iamge_back: $scope.data.file_icon_server,
                 iamge_icon: $scope.data.file_back_server,

            });
            $scope.mulImages.push($scope.data.file_icon);
            $scope.mulImages.push($scope.data.file_back);
            data.file = $scope.mulImages;
            Upload.upload({
                url: url,
                data: data
            }).success(function (data) {
                $scope.data = {
                    file_icon: null,
                    file_back: null

                };
                $scope.listObj.integrationQuery = {
                    domain_name: null,
                    domain_keyword: null,
                    int_type: 2,
                    file_name: null,
                    artcicle_type_id: null
                },
                    $state.go('app.insure.publishManage',{type_id:$scope.type_id});
                    // modalTip({
                    //     tip: switchLang.switchLang('添加成功'),
                    //     type: true
                    // });

            }).error(function () {
                $scope.mulImages = [];
                modalTip({
                    tip: switchLang.switchLang('添加失败'),
                    type: true
                });
            });
        };


        $scope.listObj = {
            navigationMsg: '管理平台 > 文章类型',   //导航栏显示信息
            //查询参数
            integrationQuery: {
                domain_name: null,
                domain_keyword: null,
                parentId: 2,
                file_name: null,
                artcicle_type_id: null
            },
            projectData: [],
            region: {selected: undefined},
            getTypeSelect: function (item) {
                $scope.listObj.region.selected = item;
            },
            postDownload: function () {

                $http({
                    method: 'GET',
                    url: 'releaseManagement/getTypeMessage/rest',
                    params: {
                        "article_type_id": $scope.type_id,
                        "type": 0
                    }
                }).success(function (data) {
                    $scope.listObj.integrationQuery.domain_name = data.data.article_type_name;
                    $scope.listObj.integrationQuery.domain_keyword = data.data.article_type_keyword;
                    $scope.listObj.integrationQuery.parentId = data.data.parentid;
                    $scope.data.file_icon = data.data.iamge_icon;
                    $scope.data.file_back = data.data.iamge_back;
                    $scope.data.file_icon_server = data.data.iamge_icon;
                    $scope.data.file_back_server = data.data.iamge_back;


                }).error(function (data) {
                    alert("服务器请求错误")
                });
            }

        };
        $scope.listObj.postDownload();


    }]);
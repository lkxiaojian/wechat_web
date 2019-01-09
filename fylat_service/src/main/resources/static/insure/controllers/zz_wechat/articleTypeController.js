app.controller('articleTypeManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'FileUploader', 'Upload', '$window','modalTip',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, FileUploader, Upload, $window,modalTip) {

        $scope.data = {
            file_icon: null,
            file_back: null

        };
        $scope.mulImages = [];
        $scope.update = function () {
            $scope.mulImages = [];
            if ($scope.listObj.region.selected == null) {
                alert("领域未选择！！！");
                return;

            }

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

            var url = 'article/addArticleType';
            var data = angular.copy({
                int_type: $scope.listObj.integrationQuery.int_type,
                name: $scope.listObj.integrationQuery.domain_name,
                keyword: $scope.listObj.integrationQuery.domain_keyword,
                artcicle_type_id: $scope.listObj.region.selected.article_type_id,
                num_id: 0
            });
            $scope.mulImages.push($scope.data.file_icon);
            $scope.mulImages.push($scope.data.file_back);
            data.file = $scope.mulImages;
            // data.file=$scope.data.file_icon;




            Upload.upload({
                url: url,
                data: data
            }).success(function (data) {
                $scope.data = {
                    file_icon: null,
                    file_back: null

                };


                $scope.listObj. integrationQuery= {
                    domain_name: null,
                        domain_keyword: null,
                        int_type: 2,
                        file_name: null,
                        artcicle_type_id: null
                },
                modalTip({
                    tip: switchLang.switchLang('添加成功'),
                    type: true
                });

            }).error(function () {
                $scope.mulImages = [];
                modalTip({
                    tip: switchLang.switchLang('添加失败'),
                    type: true
                });
            });


            // for (var i = 0; i < $scope.mulImages.length; i++) {
            //
            //
            //     data.file = $scope.mulImages[i];
            //     data.num_id = i;
            //
            //     Upload.upload({
            //         url: url,
            //         data: data
            //     }).success(function (data) {
            //         // $window.location.reload();
            //     }).error(function () {
            //         $scope.mulImages = [];
            //         alert("上传失败！！！")
            //     });
            //
            // }
        };


        $scope.listObj = {
            navigationMsg: '管理平台 > 文章类型',   //导航栏显示信息
            // projectData: fylatService.projectSelect,   //产品选择框数据

            //查询参数
            integrationQuery: {
                domain_name: null,
                domain_keyword: null,
                int_type: 2,
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
                    url: 'article/getAllDomain',
                    method: "GET"
                }).success(function (data) {
                    $scope.listObj.region.selected = data[0];
                    $scope.listObj.projectData = data;


                }).error(function (data) {
                    alert("服务器请求错误")
                });
            }

        };
        $scope.listObj.postDownload();


    }]);
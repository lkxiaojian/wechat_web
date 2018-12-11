app.controller('articleTypeManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'FileUploader', 'Upload', '$window',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, FileUploader, Upload, $window) {

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
                alert("关键字为空！！！")
                return;
            }
            if (!$scope.data.file_icon || !$scope.data.file_back) {
                alert("有图片还没有选择")
                $scope.mulImages = [];
                return;
            }

            var url = 'article/fileUploadDomain';
            $scope.mulImages.push($scope.data.file_icon);
            $scope.mulImages.push($scope.data.file_back);
            // data.file = $scope.mulImages;
            // data.file=$scope.data.file_icon;


            for (var i = 0; i < $scope.mulImages.length; i++) {
                var data = angular.copy({
                    int_type: $scope.listObj.integrationQuery.int_type,
                    name: $scope.listObj.integrationQuery.domain_name,
                    keyword: $scope.listObj.integrationQuery.domain_keyword,
                    artcicle_type_id: $scope.listObj.region.selected.article_type_id,
                    num_id: 0
                });

                data.file = $scope.mulImages[i];
                data.num_id = i;

                Upload.upload({
                    url: url,
                    data: data
                }).success(function (data) {
                    // $window.location.reload();
                }).error(function () {
                    $scope.mulImages = [];
                    alert("上传失败！！！")
                });

            }
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

        // /**
        //  * 绘制源码上传信息表格
        //  * @param data
        //  */
        // $scope.getIntegrationSrcTable = function (data) {
        //     $scope.btnHtml = '<button class="btn btn-blue hdc-btn hdc-a-compile" type="button">编译</button>'
        //
        //     $scope.integrationSrcTable = {
        //         data: $scope.uploadPath,
        //         height: 245,
        //         pagination: false,
        //         cardView: false,
        //         sidePagination: 'client',
        //         columns: [{
        //             title: '源码名',
        //             class: 'col-md-1',
        //             field: 'fileName',
        //             align: 'center',
        //             sortable: true,
        //             width: '20%'
        //         }, {
        //             title: '路径',
        //             class: 'col-md-1',
        //             field: 'filePath',
        //             align: 'center',
        //             sortable: true,
        //             width: '50%'
        //         }, {
        //             title: '上传状态',
        //             class: 'col-md-1',
        //             field: 'uploadState',
        //             align: 'center',
        //             sortable: true,
        //             width: '10%'
        //         }, {
        //             title: '编译状态',
        //             class: 'col-md-1',
        //             field: 'compileState',
        //             align: 'center',
        //             sortable: true,
        //             width: '10%'
        //         }, {
        //             title: '操作',
        //             class: 'col-md-1',
        //             align: 'center',
        //             width: '10%',
        //             formatter: function (value, row, index) {
        //                 if (row.compileState == '未编译') {
        //                     return $scope.btnHtml;
        //                 } else {
        //                     return '';
        //                 }
        //
        //             },
        //             events: {
        //                 'click .hdc-a-compile': function (e, value, row, index) {
        //                     $scope.addIntegrationObj.open('bg', row, index);
        //                 }
        //
        //             }
        //
        //         }]
        //
        //     }
        // };

    }]);
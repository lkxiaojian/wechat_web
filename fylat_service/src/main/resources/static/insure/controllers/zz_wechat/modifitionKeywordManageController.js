app.controller('modifitionKeywordManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'insureUtil', '$window', 'modalTip', '$compile', '$timeout','FileUploader','Upload',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, insureUtil, $window, modalTip, $compile, $timeout,FileUploader,Upload) {
        // var editor;

        $scope.data = {
            file_back: null

        };

        $scope.listObj = {
            navigationMsg: '管理平台 >关键词修改',
            id: null,
            keyword_name: null,
            parent_id: null,
            article_type_name: null,
            errorMessage: {
                keyword_name: false//关键词名称
            },
            addMessageCommit: function () {
                if (!$scope.listObj.keyword_name) {
                    $scope.listObj.errorMessage.keyword_name = true;
                    return;
                }

                $http({
                    url: 'article/updateKeyword',
                    method: "GET",
                    params: {
                        id: $scope.listObj.id,
                        keyword_name: $scope.listObj.keyword_name,
                        parent_id: $scope.listObj.parent_id
                    }
                }).success(function (data) {
                    console.log(data)
                    if (data.code == 0) {
                        modalTip({
                            tip: switchLang.switchLang('更新成功'),
                            type: true
                        });

                        $scope.listObj.id = null;
                        $scope.listObj.keyword_name = null;
                        $state.go('app.insure.keywordList');
                    } else {
                        modalTip({
                            tip: switchLang.switchLang('更新失败'),
                            type: false
                        });
                    }
                }).error(function (data, status, headers, config) {
                    console.log(data)
                    modalTip({
                        tip: switchLang.switchLang('更新失败'),
                        type: false
                    });

                });
            },

            projectData: [],
            region: {selected: undefined},
            getTypeSelect: function (item) {
                $scope.listObj.region.selected = item;
                $scope.listObj.parent_id = item.article_type_id;
                // $scope.listObj.article_type_name = item.article_type_name;
            },
            postDownload: function () {
                $http({
                    url: 'article/getAllDomain',
                    method: "GET"
                }).success(function (data) {
                    console.log(data[0])
                    var temp = {article_type_id: $scope.listObj.parent_id, article_type_name: $scope.listObj.article_type_name};
                    $scope.listObj.region.selected = temp;
                    // $scope.listObj.parent_id = data[0].article_type_id;
                    $scope.listObj.projectData = data;
                }).error(function (data) {
                    alert("服务器请求错误")
                });
            },

            getKeywordMessage: function () {
                $scope.listObj.id = $stateParams.id;
                $scope.listObj.keyword_name = $stateParams.keyword_name;
                $scope.listObj.parent_id = $stateParams.parent_id;
                $scope.listObj.article_type_name = $stateParams.article_type_name;
            }
        };
        $scope.listObj.postDownload();
        $scope.listObj.getKeywordMessage();
    }])
;


app.controller('modifitionDomainManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'insureUtil', '$window', 'modalTip', '$compile', '$timeout','FileUploader','Upload',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, insureUtil, $window, modalTip, $compile, $timeout,FileUploader,Upload) {
        // var editor;

        $scope.data = {
            file_back: null

        };

        $scope.listObj = {
            navigationMsg: '管理平台 >领域修改',
            article_type_id: 0,
            article_type_name: null,
            article_type_keyword: null,
            errorMessage: {
                article_type_name: false,//领域名称
                article_type_keyword: false//关键词
            },
            addMessageCommit: function () {
                debugger
                if (!$scope.listObj.article_type_name) {
                    $scope.listObj.errorMessage.article_type_name = true;
                    return;
                }
                $scope.listObj.errorMessage.article_type_keyword = false;

                $http({
                    url: 'article/updateDomainById',
                    method: 'POST',
                    data: {
                        article_type_id: $scope.listObj.article_type_id,
                        article_type_name: $scope.listObj.article_type_name,
                        article_type_keyword: $scope.listObj.article_type_keyword
                    }
                }).success(function (data) {
                    console.log(data)
                    if (data.code == 0) {
                        modalTip({
                            tip: switchLang.switchLang('更新成功'),
                            type: true
                        });

                        $scope.listObj.article_type_id = null;
                        $scope.listObj.article_type_name = null;
                        $scope.listObj.article_type_keyword = null;
                        $state.go('app.insure.domainList');
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

            getDomainMessage: function () {
                console.log($stateParams)
                $scope.listObj.article_type_id = $stateParams.article_type_id;
                $scope.listObj.article_type_name = $stateParams.article_type_name;
                $scope.listObj.article_type_keyword = $stateParams.article_type_keyword;
                // $http({
                //     url: 'domain/webMessage',
                //     method: "GET",
                //     params: {
                //         article_type_id: $scope.listObj.article_type_id
                //     }
                // }).success(function (data) {
                //     if (data != null && data.result != null) {
                //         // $scope.listObj.article_type_id = data.result.article_type_id;
                //         $scope.listObj.article_type_name = data.result.article_type_name;
                //         $scope.listObj.article_type_keyword = data.result.article_type_keyword;
                //     } else {
                //         modalTip({
                //             tip: switchLang.switchLang('网络请求错误'),
                //             type: false
                //         });
                //     }
                // }).error(function (data) {
                //     modalTip({
                //         tip: switchLang.switchLang('网络请求错误'),
                //         type: false
                //     });
                // });
            }
        };
        $scope.listObj.getDomainMessage();
    }])
;


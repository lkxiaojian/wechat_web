/**
 * 集成管理-控制器
 * Created by handongchen on 2017/9/28.
 */
app.controller('addArticleManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'insureUtil',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, insureUtil) {
        $scope.integrationSrcTable = null;
        /**
         *
         * @type {{navigationMsg: string, typeData: Array, addIntegration: addIntegration}}
         */
        $scope.listObj = {
            navigationMsg: '管理平台 >文章管理',
            region: {selected: undefined},//领域
            regionType: {selected: undefined},//文章类型
            //查询参数
            integrationQuery: {
                int_name: null,
                int_version: null,
                int_version_explain: null,
                int_type: null,

            },
            projectData: [],//领域
            articleTyprData: [],//
            getRegionSelect: function (item) {
                $scope.listObj.region.selected = item;
                $scope.listObj.postDownload();
            },
            getRegionTypeSelect: function (item) {
                $scope.listObj.regionType.selected = item;
            },
            postRegion: function () {
                $http({
                    url: 'article/getAllDomain',
                    method: "GET"
                }).success(function (data) {
                    // $scope.listObj.region.selected = data[0];
                    $scope.listObj.projectData = data;


                }).error(function (data) {
                    alert("服务器请求错误")
                });
            },
            postDownload: function () {
                var article_type_id;
                if($scope.listObj.region.selected!=null){
                    article_type_id=  $scope.listObj.region.selected.article_type_id
                }

                $http({
                    url: 'article/getAllAricleType',
                    method: "GET",
                    params: {
                        article_type_id:article_type_id
                    }
                }).success(function (data) {
                    $scope.listObj.articleTyprData = data;

                }).error(function (data, status, headers, config) {

                });
            }

        };


        $scope.listObj.postRegion();
        $scope.listObj.postDownload();

    }]);


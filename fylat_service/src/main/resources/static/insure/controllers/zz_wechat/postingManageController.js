app.controller('postingManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'FileUploader', 'Upload', 'insureUtil', '$window', 'modalTip', '$compile', '$timeout',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, FileUploader, Upload, insureUtil, $window, modalTip) {
        $scope.listObj = {
            current_location: 'app.insure.posting_manage',
            pic_location: "http://106.2.11.94:7902",
            navigationMsg: '管理平台 >期刊名称管理',
            message: ''
        }
        $scope.typeForm = {
            posting_id:'',
            file:'',
        }
        //论文列表
        $scope.listPosting = function () {
            $scope.tableOption = {
                url: 'releaseManagement/getPostingList/rest',
                resultTag: 'result',
                method: 'post',
                queryParams: function (params) {
                    return $.extend(params, {
                        message : $scope.listObj.message
                    });
                },
                pageList: ['All'],
                pageSize: 10,
                onLoadSuccess: function (data) {
                    if (data.code != 0) {
                        layer.msg(data.message);
                    }
                },
                columns: [{
                        title: '期刊名称',
                        class: 'col-md-1',
                        field: 'posting_name',
                        align: 'center'

                    }, {
                        title: '期刊图片',
                        class: 'col-md-1',
                        field: 'image_path',
                        align: 'center',
                        formatter: function (value, row, index) {
                            if(value){
                                return '<span class = "a-add"><img src="' + $scope.listObj.pic_location+value + '" style="max-width: 80px;max-height: 80px;"></span>';
                            }else {
                                return '<a class="btn btn-info btn-xs a-add" href="javascript:;">添加图片</a>';
                            }
                        },
                        events: {
                            'click .a-add': function (e, value, row, index) {
                                $scope.typeForm.posting_id = row.posting_id;
                                $("#addModal").modal({
                                    backdrop:'static',
                                    keyboard : false
                                });
                            }
                        }
                    }
                ]
            };
        };
        $scope.listPosting();
        $scope.query = function(){
            $scope.tableInstance.bootstrapTable('refresh');
        }
        $scope.reset = function(){
            $scope.listObj.message = '';
        }
        $scope.mulImages = [];
        $scope.save = function(){
            if(!$scope.typeForm.file){
                layer.msg("请选择文件");
                return;
            }
            $scope.mulImages.push($scope.typeForm.file);
            var data = {
                posting_id:$scope.typeForm.posting_id,
                file:$scope.mulImages
            }
            layer.load(2);
            Upload.upload({
                url:'/releaseManagement/updatePostingImage/rest',
                data: data
            }).success(function (data) {
                layer.closeAll('loading');
                if(data.code == '0'){
                    layer.msg("保存成功");
                    $("#addModal").modal("hide");
                    $scope.tableInstance.bootstrapTable('refresh');
                }else{
                    layer.alert(data.message);
                }
            }).error(function () {
                layer.closeAll('loading');
                layer.alert("保存失败");
            });
        }
        $('#addModal').on('hidden.bs.modal', function () {
            $scope.mulImages = [];
            $scope.typeForm.file=null;
        })
    }]);

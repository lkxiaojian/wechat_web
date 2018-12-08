/**
 * 进程上传-控制器
 * Created by handongchen on 2017/10/12.
 */
app.controller('FileUploadCtrl', ['$scope', 'FileUploader', function ($scope, FileUploader) {
    $scope.result = []
    /**
     * 函数集合
     * @type {{}}
     */
    $scope.funObj = {
        filterFile: function (item) {
            var result = false;
            if (item.type == 'application/zip') {
                result = true;
            }
            return result;
        }
    }
    var uploader = $scope.uploader = new FileUploader({
        url: 'orderData/fileUpload',
        method: 'POST'
    });

    // FILTERS

    uploader.filters.push({
        name: 'customFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            return this.queue.length < 5;
        }

    });
    uploader.filters.push({
        name: 'fileTypeFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            return $scope.funObj.filterFile(item);
        }

    });

    // CALLBACKS

    uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function (fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function (addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function (item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function (fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function (progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
        //向上传播，使父作用域访问得到
        $scope.result.push(response.result);
        $scope.$emit('summon', $scope.result);
    };
    uploader.onErrorItem = function (fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function (fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function () {
        console.info('onCompleteAll');
    };

    console.info('uploader', uploader);
}]);

/**
 * 作业流查看详细弹出框-控制器
 */
app.controller('dispatchDetailsController', ['$scope', '$modal', '$http', '$state', 'insureUtil', '$modalInstance', 'FileUploader', 'item'
    , function ($scope, $modal, $http, $state, insureUtil, $modalInstance, FileUploader, item) {

        /**
         * 取消
         */
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.detailsObj = {
            name: item.name
        };
        $scope.getDownloadTable = function (data) {
            // 作业流下的进程表格模板
            $scope.operationTable = {
                data: data,
                pagination: false,
                cardView: false,
                columns: [{
                    title: '步骤',
                    class: 'col-md-1',
                    field: 'int_step',
                    align: 'center',
                    sortable: true,
                    width: '3%'
                }, {
                    title: '进程名',
                    class: 'col-md-1',
                    field: 'int_name',
                    align: 'center',
                    sortable: true,
                    width: '30%'
                }, {
                    title: '进程类型',
                    class: 'col-md-1',
                    field: 'int_type',
                    align: 'center',
                    sortable: true,
                    width: '16%'
                }, {
                    title: '版本',
                    class: 'col-md-1',
                    field: 'int_version',
                    align: 'center',
                    sortable: true,
                    width: '16%'
                }, {
                    title: '操作',
                    class: 'col-md-1',
                    align: 'center',
                    // field: 'opera_env',
                    width: '30%',
                    formatter: function (value, row, index) {
                        return '<button class="btn btn-blue hdc-btn downlaodCheckForDir" type="button" data-toggle="modal" data-target=".bs-example-modal-lg">修改</button>';
                    },
                    events: {
                        'click .downlaodCheckForDir': function (e, value, row, index) {
                            $modalInstance.dismiss('cancel');
                            $state.go('app.insure.integrationManage_addIntegration', {
                                param: 'update',
                                data: row.int_id
                            });
                        }
                    }

                }]

            };
        };
        // 进程数据
        $scope.integration = [
            {
                opera_step: '1',
                opera_name: 'convert_sst.exe',
                opera_version: 'v.1.0',
                opera_in: 'convert_sst.in',
                opera_env: 'convert_sst.env'

            },
            {
                opera_step: '2',
                opera_name: 'clm.exe',
                opera_version: 'v.1.0',
                opera_in: 'convert_sst.in',
                opera_env: 'convert_sst.env'

            },
            {
                opera_step: '3',
                opera_name: 'convert_sst.exe',
                opera_version: 'v.1.0',
                opera_in: 'convert_sst.in',
                opera_env: 'convert_sst.env'

            }
        ];
        $scope.getDownloadTable(item.processData);
    }]);

/**
 * 新建进程编译/作业流运行-弹出框
 */
app.controller('integrationCompileModalController', ['$scope', '$modal', '$http', 'item', 'insureUtil', '$modalInstance',
    function ($scope, $modal, $http, item, insureUtil, $modalInstance) {

        $scope.listObj = {
            userName: $scope.userName,  //当前操作用户
            runModalTitle: item.modalTitle,         //运行弹出框title
            timeStamp: ((new Date()).valueOf()).toString(), //时间戳
            runMessage: [],
            //执行http返回的数据
            requestResult: {},
            //返回给父控制器的数据
            contrastResult: {
                isHaveErr: false,
                data: item.data
                //返回执行信息，用于"再次显示日志"
                // runResult: $scope.listObj.runMessage
            },
            //任务名称（）
            title: item.title
        };
        var topic = '/topic/' + $scope.listObj.userName + '/' + $scope.listObj.timeStamp;
        item.data.topic = topic;
        var webWocketObj = {};
        var subscribeRef = null;
        webWocketObj.stompClient = null;
        webWocketObj.connect = function (user, time) {
            //1，表示连接的SockJS的endpoint名称为/endpointSang
            var socket = new SockJS('/endpointFylat');
            //表示使用STOMP来创建WebSocket客户端
            webWocketObj.stompClient = Stomp.over(socket);
            //2,联接websocket进行交互
            webWocketObj.stompClient.connect('', '', function (frame) {
                subscribeRef = webWocketObj.stompClient.subscribe('/topic/' + user + '/' + time, function (response) {
                    var lineDataObj = {message: '', satate: ''};
                    lineDataObj.message = response.body;
                    lineDataObj.date = insureUtil.dateToString(new Date(), 'yyyy-MM-dd hh:mm:ss')
                    if (response.body.split(':')[0] == 'error') {
                        lineDataObj.state = 'ERROR';
                        lineDataObj.message = response.body.split(':')[1];
                        $scope.listObj.isHaveErr = true;
                    } else {
                        lineDataObj.state = 'INFO';
                    }

                    $scope.$apply(function () {
                        $scope.listObj.runMessage.push(lineDataObj);
                    });

                    // 判断runMessage大小，超过某一值则删除头部数据
                    if ($scope.listObj.runMessage.length > 200) {
                        aaa =$scope.listObj.runMessage.length;
                        $scope.listObj.runMessage.splice(0, 100);
                    }
                });
                $scope.httpFun.requestData();
            });
        };
        webWocketObj.disconnect = function () {
            if (webWocketObj.stompClient != null) {
                webWocketObj.stompClient.disconnect();
            }
            if (subscribeRef != null) {
                subscribeRef.unsubscribe()
            }
            console.log('Disconnected');
        };
        // webSocket连接
        webWocketObj.connect($scope.listObj.userName, $scope.listObj.timeStamp);
        //页面跳转时注销当前websocket
        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            webWocketObj.disconnect();
        });
        //关闭弹出框时注销当前websocket
        $scope.ok = function () {
            $modalInstance.close($scope.listObj.contrastResult);
            webWocketObj.disconnect();
        };
        /**
         * 请求相关函数
         * @type {{requestData: requestData}}
         */
        $scope.httpFun = {
            /**
             * websocket连接后处理的请求
             */
            requestData: function () {
                $http({
                    method: "POST",
                    url: item.url,
                    data: item.data
                }).success(function (data) {
                    $scope.ok();
                    $scope.listObj.requestResult = data;
                    $scope.listObj.contrastResult.result = data.result;
                });
            }
        }
    }]);
/**
 * 展示运行结果-弹出框
 */
app.controller('operationResultController', ['$scope', '$modal', '$http', 'item', 'insureUtil', '$modalInstance', '$timeout',
    function ($scope, $modal, $http, item, insureUtil, $modalInstance, $timeout) {

        $scope.listObj = {
            /**
             * 文件/文件夹 位置发上改变
             * @param path
             */
            changeDir: function (path) {
                $scope.listObj.path = path;
                $scope.listObj.getFileLocation();
            },
            /**
             * 得到文件位置导航
             */
            getFileLocation: function () {
                $scope.listObj.locationList = [];
                $scope.listObj.locationList.push({
                    name: item.path,
                    path: item.path
                });
                var restLocations = $scope.listObj.path.replace(item.path, "").split("/");
                var restLocationPath = item.path;
                for (var i = 0; i < restLocations.length; i++) {
                    if (restLocations[i] != "") {
                        restLocationPath = restLocationPath + "/" + restLocations[i];
                        $scope.listObj.locationList.push({
                            name: restLocations[i],
                            path: restLocationPath

                        });
                    }

                }

            },
            /**
             * 返回上一级
             */
            backUpLevel: function () {
                var path = $scope.listObj.path;
                if (path != item.path) {
                    if (path.substr($scope.listObj.path.length - 1, 1) == "/") {
                        path = path.substr($scope.listObj.path.length - 1, 1)
                    }
                    $scope.httpFun.requestData(path.substr(0, path.lastIndexOf("/")));
                }


            }

        };

        /**
         * 请求相关函数
         * @type {{requestData: requestData}}
         */
        $scope.httpFun = {
            /**
             * 获取文件列表
             */
            requestData: function (path) {
                $http({
                    method: "POST",
                    url: "/result/getFileList",
                    data: {
                        path: path
                    }
                }).success(function (data) {
                    if (data.result && null != data.result) {
                        $scope.listObj.fileList = data.result;
                        $scope.listObj.changeDir(path);
                    }

                });
            }
        }
        $scope.ok = function () {
            $modalInstance.close("ok");
        };
        //进入执行
        $scope.listObj.path = item.path;
        $scope.httpFun.requestData($scope.listObj.path);
        $scope.listObj.getFileLocation();
    }]);

/**
 * 滚动条默认处于底部
 */
app.directive('scrollBottom',[function () {
    return{
        restrict: 'AE',
        scope: {
            runMessage: '='
        },
        link: function (scope, element, attrs) {
            scope.$watchCollection('runMessage',  function(runMessage, oldValue) {
                element.scrollTop(element[0].scrollHeight);
            });
        }
    }
}]);
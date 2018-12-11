/**
 * 领域管理
 */
app.controller('domainManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'FileUploader', 'Upload','$window',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, FileUploader, Upload,$window) {

        $scope.data = {
            file: null
        };


        $scope.update = function () {
            if ($scope.listObj.integrationQuery.domain_name == null) {
                alert("领域名字没空！！！")
                return;
            }
            if (!$scope.data.file) {
                return;
            }

            var url = 'article/fileUploadDomain';  //params是model传的参数，图片上传接口的url
            var data = angular.copy({
                int_type: $scope.listObj.integrationQuery.int_type,
                name: $scope.listObj.integrationQuery.domain_name,
                keyword: $scope.listObj.integrationQuery.domain_keyword

            });
            data.file = $scope.data.file;

            Upload.upload({
                url: url,
                data: data
            }).success(function (data) {
                $window.location.reload();
            }).error(function () {
                alert("上传失败！！！")
            });
        };


        $scope.listObj = {
            navigationMsg: '管理平台 > 领域管理',   //导航栏显示信息
            projectData: fylatService.projectSelect,   //产品选择框数据
            /**
             * 选择产品后，级联显示类型
             */
            getTypeSelect: function (select) {
                $scope.listObj.typeData = select.typeSelect
            },

            addIntegration: function () {        //新增进程按钮
                $state.go('app.insure.integrationManage_addIntegration', {'param': 'add'});

            },
            //查询参数
            integrationQuery: {
                domain_name: null,
                domain_keyword: null,
                int_type: 1,
                file_name: null
            },
            searchPolicyBtn: function () {
                $scope.listObj.integrationTableInstance.bootstrapTable('refresh');
            },
            postDownload: function (row) {// 下载
                $http({
                    url: 'insure/export_dt',
                    method: "POST",
                    data: $.param({
                        fileSuffix: row.download
                    }),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    responseType: 'arraybuffer'
                }).success(function (data, status, headers, config) {
                    var blob = new Blob([data], {type: "application/octet-stream"});
                    saveAs(blob, [headers('Content-Disposition').replace(/attachment;fileName=/, "")]);
                }).error(function (data, status, headers, config) {
                    //upload failed
                });
            }

        };


        /**
         * 绘制源码上传信息表格
         * @param data
         */
        $scope.getIntegrationSrcTable = function (data) {
            $scope.btnHtml = '<button class="btn btn-blue hdc-btn hdc-a-compile" type="button">编译</button>'

            $scope.integrationSrcTable = {
                data: $scope.uploadPath,
                height: 245,
                pagination: false,
                cardView: false,
                sidePagination: 'client',
                columns: [{
                    title: '源码名',
                    class: 'col-md-1',
                    field: 'fileName',
                    align: 'center',
                    sortable: true,
                    width: '20%'
                }, {
                    title: '路径',
                    class: 'col-md-1',
                    field: 'filePath',
                    align: 'center',
                    sortable: true,
                    width: '50%'
                }, {
                    title: '上传状态',
                    class: 'col-md-1',
                    field: 'uploadState',
                    align: 'center',
                    sortable: true,
                    width: '10%'
                }, {
                    title: '编译状态',
                    class: 'col-md-1',
                    field: 'compileState',
                    align: 'center',
                    sortable: true,
                    width: '10%'
                }, {
                    title: '操作',
                    class: 'col-md-1',
                    align: 'center',
                    width: '10%',
                    formatter: function (value, row, index) {
                        if (row.compileState == '未编译') {
                            return $scope.btnHtml;
                        } else {
                            return '';
                        }

                    },
                    events: {
                        'click .hdc-a-compile': function (e, value, row, index) {
                            $scope.addIntegrationObj.open('bg', row, index);
                        }

                    }

                }]

            }
        };

    }]);


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

            },

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
            contrastResult: {
                isHaveErr: false,
                data: item.data
            },
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
                        $scope.listObj.isHaveErr = true;
                    } else {
                        lineDataObj.state = 'INFO';
                    }
                    $scope.$apply(function () {
                        $scope.listObj.runMessage.push(lineDataObj);
                    });
                    // 判断runMessage大小，超过某一值则删除头部数据
                    if ($scope.listObj.runMessage.length > 200) {
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
        //关闭弹出框时注销当前websocket
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
            webWocketObj.disconnect();
        };
        //页面跳转时注销当前websocket
        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            webWocketObj.disconnect();
        });
        $scope.ok = function () {
            $modalInstance.close($scope.listObj.contrastResult);
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
                    $scope.listObj.contrastResult.result = data;
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

/**
 * 作业流管理-控制器
 */
app.controller('operationManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', 'modalTip',
    function ($scope, $modal, $http, fylatService, $state, switchLang, modalTip) {

        $scope.listObj = {
            userName: $scope.userName,  //当前操作用户
            project_type: {id: 'YCP', name: '云产品'},     //作业流类型
            projectData: fylatService.projectSelect,
            jobState: {id: null, name: '全部'},         //作业流执行状态
            serchStartTime: '',   //检索开始时间
            serchEndTime: '',     //检索结束时间
            navigationMsg: '管理平台 > 作业流管理',  //导航栏显示信息
            type: fylatService.typeSelect,       //类型选择框数据
            stateData: [{id: null, name: '全部'},{id: '0', name: '未运行'}, {id: '1', name: '运行完成'}, {id: '2', name: '运行失败'}], //作业流状态选择框数据
            operationTableResultInstance: null,
            userSelectJob: [],             //符合检索条件的作业流
            runModalTitle: '作业流运行信息',         //运行弹出框title
            timeStamp: ((new Date()).valueOf()).toString(), //时间戳
            addOperation: function () {   //新增作业流
                $state.go('app.insure.operationManage_addOperation');
            },
            searchJobBtn: function () {
                $scope.listObj.serchStartTime = angular.element("#serchStart").val();
                $scope.listObj.serchEndTime = angular.element("#serchEnd").val();
                $scope.listObj.operationTableResultInstance.bootstrapTable('refresh');
            },
            runModal: function (job_data_map, job_run_url) {          // 运行弹出框
                var modalInstance = $modal.open({
                    backdrop: false,
                    templateUrl: 'insure/template/fylat/common/integrationCompileModal.html',
                    controller: 'integrationCompileModalController',
                    size: 'bg',
                    resolve: {
                        item: function () {
                            return {
                                modalTitle: $scope.listObj.runModalTitle,
                                data: job_data_map,
                                url: job_run_url,
                                title: '运行'
                            };
                        }
                    }
                });
            },
            openResultModal: function (path, size) {
                var modalInstance = $modal.open({
                    backdrop: false,
                    templateUrl: 'insure/template/fylat/common/operationResultModal.html',
                    controller: 'operationResultController',
                    size: size,
                    resolve: {
                        item: function () {
                            return {
                                path: path
                            };
                        }
                    }
                });
            }
        };

        //作业流表格
        $scope.getJobTable = function () {
            var operaResultBtnHtml = '<button class="btn btn-blue hdc-btn dispatch-details" type="button">详情</button>'
                + '<button class="btn btn-blue hdc-btn dispatch-run" type="button">运行</button>'
                + '<button class="btn btn-blue hdc-btn dispatch-delete" type="button">删除</button>';
                // + '<button class="btn btn-blue hdc-btn dispatch-result" type="button">查看结果</button>';
            //表格
            $scope.operationResultTable = {
                url: '/job/showJob',
                resultTag: 'result',
                // data: data,
                pagination: true,
                cardView: false,
                uniqueId: "job_name",
                method: 'post',
                queryParams: function (params) {
                    $.extend(params, {
                        param: {
                            'job_user =': $scope.listObj.userName,
                            'job_type =': $scope.listObj.project_type.id,
                            'job_state =': $scope.listObj.jobState.id,
                            'job_createtime >=': $scope.listObj.serchStartTime,
                            'job_createtime <=': $scope.listObj.serchEndTime
                        }
                    });
                    return params;
                },
                columns: [{
                    title: '名称',
                    class: 'col-md-1',
                    field: 'job_name',
                    align: 'center',
                    sortable: true,
                    width: '13%'
                }, {
                    title: '类型',
                    class: 'col-md-1',
                    field: 'job_type',
                    align: 'center',
                    sortable: true,
                    width: '7%'
                }, {
                    title: '执行状态',
                    class: 'col-md-1',
                    field: 'job_state',
                    align: 'center',
                    sortable: true,
                    width: '9%',
                    formatter: function (value, row, index) {
                        if (value == 0) {
                            return '<div>未运行</div>'
                        } else if(value ==1){
                            return '<div>运行完成</div>'
                        } else {
                            return '<div>运行出错</div>'
                        }
                    }
                }, {
                    title: '批处理开始时间',
                    class: 'col-md-1',
                    field: 'job_data_starttime',
                    align: 'center',
                    sortable: true,
                    width: '13%'
                }, {
                    title: '批处理结束时间',
                    class: 'col-md-1',
                    field: 'job_data_endtime',
                    align: 'center',
                    sortable: true,
                    width: '13%'
                }, {
                    title: '创建时间',
                    class: 'col-md-1',
                    field: 'job_createtime',
                    align: 'center',
                    sortable: true,
                    width: '12%',
                    formatter: function (value, row, index) {
                        return value.split(" ")[0];
                    }
                }, {
                    title: '操作',
                    class: 'col-md-1',
                    align: 'center',
                    width: '33%',
                    formatter: function (value, row, index) {
                        var btnHtml = '';
                        if(row.job_state== '1'){
                            btnHtml = operaResultBtnHtml + '<button class="btn btn-blue hdc-btn dispatch-result" type="button">查看结果</button>';
                        }else{
                            btnHtml = operaResultBtnHtml + '<button class="btn btn-blue hdc-btn dispatch-result" disabled="disabled" type="button">查看结果</button>';
                        }
                        return btnHtml;
                    },
                    events: {
                        'click .dispatch-details': function (e, value, row, index) {
                            $http({
                                method: "POST",
                                url: 'job/manager?view=jobProcess',
                                data: {
                                    jobProcess: row.job_process,
                                    userName: $scope.listObj.userName
                                }
                            }).success(function (data) {
                                if (data.result) {
                                    $modal.open({
                                        templateUrl: 'insure/template/fylat/common/operationModal.html',
                                        controller: 'dispatchDetailsController',
                                        // size:'sm',
                                        backdrop: false,
                                        resolve: {
                                            item: function () {
                                                return {
                                                    name: row.job_name,
                                                    processData: data.result
                                                };
                                            }
                                        }
                                    });
                                }
                            });
                        },
                        'click .dispatch-run': function (e, value, row, index) {
                            var job_run_url = 'job/manager?view=jobRun';
                            var jobDataMap = {
                                startTime: row.job_data_starttime,
                                endTime: row.job_data_endtime,
                                jobProcess: row.job_process,
                                jobId: row.job_id
                            };
                            $scope.listObj.runModal(jobDataMap, job_run_url);
                        },
                        'click .dispatch-result': function (e, value, row, index) {
                            $scope.listObj.openResultModal(row.job_outputpath, 'lg');
                            //$scope.listObj.openResultModal("D://", 'lg');
                        },
                        'click .dispatch-delete': function (e, value, row, index) {
                            if (confirm(switchLang.switchLang('确认删除吗？'))) {
                                $http({
                                    method: "POST",
                                    url: 'job/manager?view=delete',
                                    data: {
                                        jobId: row.job_id
                                    }
                                }).success(function (data) {
                                    if (data.result) {
                                        $scope.listObj.operationTableResultInstance.bootstrapTable('removeByUniqueId', row.job_name);
                                        modalTip({
                                            tip: "删除成功",
                                            type: true
                                        });
                                    } else {
                                        modalTip({
                                            tip: "撤销失败",
                                            type: false
                                        });
                                    }
                                })
                            }
                        }
                    }
                }]
            }
        };
        $scope.getJobTable();
    }]);


/**
 * 新建作业流-控制器
 */
app.controller('addOperationController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'insureUtil',
    function ($scope, $modal, $http, fylatService, $state, insureUtil) {
        $scope.listObj = {
            navigationMsg: '管理平台 > 作业流管理 > 新增作业流',       //导航栏显示信息
            projectData: fylatService.projectSelect,   //产品类型
            jobType: null,
            int_type: {
                id: "CLM",
                name: ""
            },
            /**
             * 选择产品后，级联显示类型
             */
            typeData: null,
            getTypeSelect: function (select) {
                this.typeData = select.typeSelect
            },
            userName: $scope.userName,  //当前用户
            showTable: false,
            showProcessTable: true,
            name: '',          //用户新增作业流名称
            startTime: '',     //批处理开始时间
            endTime: '',       //批处理结束时间
            operationType: '', //用户新增作业流类型
            process: [],       //用户作业流类型下包含的进程
            orderProcess: [],  //用户勾选的进程--排序后
            checkIntId: []     //用户勾选的进程id--int_id
        };
        // 点击保存按钮
        $scope.saveOperationBtn = function () {
            // 1.获取用户新建的作业流数据
            $scope.listObj.startTime = angular.element("#dataTimeStart").val();
            $scope.listObj.endTime = angular.element("#dataTimeEnd").val();
            var process = $scope.listObj.processOrderTableInstance.bootstrapTable('getData', true);
            var processList = new Array();
            for (var i = 0; i < process.length; i++) {
                var id_type = process[i].int_id + "_" + process[i].int_type;
                processList.push(id_type);
            }
            // 2.后台配置文件生成，用户新增作业流存入数据库
            $http({
                method: "POST",
                url: 'job/manager?view=handle',
                data: {
                    userName: $scope.listObj.userName,
                    jobName: $scope.listObj.name,
                    jobType: $scope.listObj.jobType.id,
                    dataStartTime: $scope.listObj.startTime,
                    dataEndTime: $scope.listObj.endTime,
                    jobProces: processList
                }
            }).success(function (data) {
                if (data.success) {

                } else {

                }
            });
            // 3.跳转至作业流运行界面
            $state.go('app.insure.integration_jobManage');
        };
        //用户更改作业流类型
        $scope.selectOperation = function (type) {
            $scope.listObj.processTableInstance.bootstrapTable('refresh');
        };
        // 进程类型下已有的进程--表格模板
        $scope.getProcess = function () {

            $scope.operationTable = {
                url: '/job/showProcess',
                resultTag: 'result',
                pagination: true,
                cardView: false,
                method: 'post',
                height: 250,
                queryParams: function (params) {
                    $.extend(params, {
                        param: {
                            'int_belong_user =': $scope.userName,
                            'int_type =': $scope.listObj.int_type.id
                        }
                    });
                    return params;
                },
                uniqueId: "int_id",
                columns: [{
                    checkbox: true,
                    boxwidth: 15,
                    formatter : $scope.stateFormatter
                }, {
                    title: '进程名',
                    class: 'col-md-1',
                    field: 'int_name',
                    align: 'center',
                    sortable: true,
                    width: '30%'
                }, {
                    title: '版本',
                    class: 'col-md-1',
                    field: 'int_version',
                    align: 'center',
                    sortable: true,
                    width: '30%'
                },{
                    title: '最后修改时间',
                    class: 'col-md-1',
                    field: 'int_leadtime',
                    align: 'center',
                    sortable: true,
                    width: '30%',
                    formatter: function (value, row, index) {
                        return insureUtil.dateToString(new Date(value), 'yyyy/MM/dd hh:mm');
                    }
                }],
                onCheck: function (row) {
                    $scope.listObj.orderProcess.push(row);
                    $scope.listObj.processOrderTableInstance.bootstrapTable('load', $scope.listObj.orderProcess);
                    $scope.listObj.checkIntId.push(row.int_id);
                },
                onCheckAll: function (rows) {
                    $scope.listObj.checkIntId = [];
                    for(var i=0;i<rows.length;i++){
                        $scope.listObj.checkIntId.push(rows[i].int_id);
                    }
                    $scope.listObj.orderProcess = rows;
                    $scope.listObj.processOrderTableInstance.bootstrapTable('removeAll');
                    $scope.listObj.processOrderTableInstance.bootstrapTable('load', rows);
                },
                onUncheck: function (row) {
                    $scope.listObj.processOrderTableInstance.bootstrapTable('removeByUniqueId', row.int_id);
                    $scope.removeByValue($scope.listObj.checkIntId,row.int_id);
                },
                onUncheckAll: function (rows) {
                    // $scope.listObj.processOrderTableInstance.bootstrapTable('removeAll');
                    for(var i=0;i<rows.length;i++){
                        $scope.removeByValue($scope.listObj.checkIntId,rows[i].int_id);
                        $scope.listObj.processOrderTableInstance.bootstrapTable('removeByUniqueId', rows[i].int_id);
                    }
                }
            };
        };
        // 勾选用户已选择的进程
        $scope.stateFormatter = function (value, row, index) {
            for(var a=0;a<$scope.listObj.checkIntId.length;a++){
                if (row.int_id == $scope.listObj.checkIntId[a])
                    return {
                        disabled : false,//设置是否可用
                        checked : true//设置选中
                    };
            }
            return value;
        };
        $scope.removeByValue = function (arr, val) {
            for(var i=0; i<arr.length; i++) {
                if(arr[i] == val) {
                    arr.splice(i, 1);
                    break;
                }
            }
        };
        // 用户选择排序后的进程--表格模板
        $scope.selectProcess = function (data) {

            $scope.processOrderTable = {
                data: data,
                pagination: false,
                cardView: false,
                height: 250,
                sidePagination: 'client',
                uniqueId: "int_id",
                columns: [ {
                    title: '执行顺序',
                    class: 'col-md-1',
                    field: 'int_number',
                    align: 'center',
                    sortable: true,
                    width: '15%',
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                },{
                    title: '进程名',
                    class: 'col-md-1',
                    field: 'int_name',
                    align: 'center',
                    sortable: true,
                    width: '30%'
                }, {
                    title: '版本',
                    class: 'col-md-1',
                    field: 'int_version',
                    align: 'center',
                    sortable: true,
                    width: '25%'
                }, {
                    title: '最后修改时间',
                    class: 'col-md-1',
                    field: 'int_leadtime',
                    align: 'center',
                    sortable: true,
                    width: '30%',
                    formatter: function (value, row, index) {
                        return insureUtil.dateToString(new Date(value), 'yyyy/MM/dd hh:mm');
                    }
                }]
            };
        };
        $scope.getProcess();
        $scope.selectProcess($scope.listObj.orderProcess);
    }]);


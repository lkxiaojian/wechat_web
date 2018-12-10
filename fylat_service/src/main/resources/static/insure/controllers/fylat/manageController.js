/**
 * 集成管理-控制器
 * Created by handongchen on 2017/9/28.
 */
app.controller('integrationManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams) {

        /**
         *
         * @type {{navigationMsg: string, typeData: Array, addIntegration: addIntegration}}
         */
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
                int_name: null,
                int_version: null,
                int_version_explain: null,
                int_type: null,

            },
            searchPolicyBtn: function () {
                $scope.listObj.integrationTableInstance.bootstrapTable('refresh');
            },
            postDownload: function (row) {     // 下载
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
            },
            deleteIntegration: function () {
                if (confirm(switchLang.switchLang('此操作，将删除所选条目的源码，确认删除吗？'))) {
                    $scope.listObj.deleteData = $scope.listObj.integrationTableInstance.bootstrapTable('getSelections');
                    $scope.httpFunction.deleteIntegration();
                }


            },
        };
        /**
         * 新建进程界面相关方法及变量
         * @type {{explainObj: {head: [*], foot: [*], fylat_sensor_id: [*], code_root_path: [*], L1b_data_path: [*], nwp_data_path: [*], oisst_data_path: [*], fy3_mersi_L1b_data: [*], fy3_mersi_GEO_data: [*], fy3_mersi_CLM_data: string, fy3_mersi_CPP_data: string, fy3_mersi_CTP_data: string, fy3_mersi_COP_data: string, fy3_mersi_CLD_data: string, fy3_intermediate: string, fylat_nwp_opt: string, fylat_rtm_opt: string, nwp_grib_data1: string, nwp_grib_data2: string, oisst_data: string, cloudmask_id: string, cloudphase_id: string, cloudtopz_id: string, cloudtau_day_id: string, cloudtau_night_id: string, cloudtypeII_id: string, write_inter_id: string}, addParamList: Array, getTableForSrc: getTableForSrc, open: open, configExplainFun: configExplainFun, remooveParam: remooveParam, addParam: addParam}}
         */
        $scope.addIntegrationObj = {
            //传过来的参数
            param: $stateParams.param,
            isHaveErr: true,
            //名词解释集合
            explainObj: {
                head: ['配置信息头部标识'],
                foot: ['配置信息头部标识'],
                fylat_sensor_id: ['传感器编号'],
                code_root_path: ['代码根路径', '包含类型文件夹时用%type代替', '例如:', '"/home/huxq/FYLAT/script/CLM/"', '  实际输入:', '"/home/huxq/FYLAT/script/%type/"'],
                L1b_data_path: ['L1b数据路径', '如果有时间包含在值中，请转义', '时间转义规则:', '--年：%y', '--月：%m', '--日：%d', '--时：%h', '--分：%mi', '--秒：%s', '例如:', '/home/FY3D/2005/20050101/', '实际输入:', '/home/FY3D/%y/%y%m%d/'],
                nwp_data_path: ['nwp数据路径'],
                oisst_data_path: ['oisst数据路径'],
                fy3_mersi_L1b_data: ['风云3meri，L1b数据'],
                fy3_mersi_GEO_data: ['风云3meri，GEO数据'],
                fy3_mersi_CLM_data: '',
                fy3_mersi_CPP_data: '',
                fy3_mersi_CTP_data: '',
                fy3_mersi_COP_data: '',
                fy3_mersi_CLD_data: '',
                fy3_intermediate: '',
                fylat_nwp_opt: '',
                fylat_rtm_opt: '',
                nwp_grib_data1: '',
                nwp_grib_data2: '',
                oisst_data: '',
                cloudmask_id: '',
                cloudphase_id: '',
                cloudtopz_id: '',
                cloudtau_day_id: '',
                cloudtau_night_id: '',
                cloudtypeII_id: '',
                write_inter_id: '',
                ipath: ['海温转换', '输入路径'],
                opath: ['海温转换', '输出路径'],
            },
            //输出路径
            getOutputPath: function (type) {
                var outputPath = {
                    CLM: {
                        int_output_path: {
                            fy3_mersi_CLM_data: $scope.addIntegrationObj.config.config_param.fy3_mersi_CLM_data,
                            fy3_mersi_CPP_data: $scope.addIntegrationObj.config.config_param.fy3_mersi_CPP_data,
                            fy3_mersi_CTP_data: $scope.addIntegrationObj.config.config_param.fy3_mersi_CTP_data,
                            fy3_mersi_COP_data: $scope.addIntegrationObj.config.config_param.fy3_mersi_COP_data,
                            fy3_mersi_CLD_data: $scope.addIntegrationObj.config.config_param.fy3_mersi_CLD_data,
                            fy3_intermediate: $scope.addIntegrationObj.config.config_param.fy3_intermediate
                        }
                    },
                    SST: {
                        int_output_path: {
                            opath: $scope.addIntegrationObj.config.config_param.opath
                        }
                    }
                };
                return outputPath[$scope.addIntegrationObj.addData.int_type.id];
            },
            //追加参数集合
            addParamList: [],
            /**
             * 获取上传后源码信息表格（编译步骤展示表格）
             * @returns {boolean}
             */
            getTableForSrc: function () {
                if ($scope.listObj.integrationSrcTableInstance) {
                    $scope.listObj.integrationSrcTableInstance.bootstrapTable('load', $scope.uploadPath);
                } else {
                    $scope.getIntegrationSrcTable($scope.uploadPath);
                }


                return true;
            },
            /**
             * 编译界面，编译信息弹出框
             * @param size 弹出框大小（'bg'，'lg','sm',''）
             * @param data 传给弹出框的数据
             */
            open: function (size, param, index) {
                /**
                 * 弹出框实例
                 */
                var modalInstance = $modal.open({
                    backdrop: false,
                    templateUrl: 'insure/template/fylat/common/integrationCompileModal.html',
                    controller: 'integrationCompileModalController',
                    size: size,
                    resolve: {
                        item: function () {
                            return {
                                modalTitle: "管理平台 > 集成管理 > 新建进程 > 编译信息",
                                data: {
                                    filePath: param.filePath,
                                    index: index,
                                    intType: $scope.addIntegrationObj.addData.int_type.id
                                },
                                url: "/integration/complie",
                                title: "编译--" + $scope.addIntegrationObj.addData.int_type.name

                            };
                        }
                    }
                });
                modalInstance.result.then(function (contrastResult) {
                    $scope.addIntegrationObj.isHaveErr = contrastResult.data.isHaveErr;
                    if (contrastResult.data.isHaveErr) {
                        param.compileState = "编译失败";
                        $scope.addIntegrationObj.config.config_param.code_root_path = contrastResult.result;
                    } else {
                        param.compileState = "编译未出现错误";

                    }
                    $scope.listObj.integrationSrcTableInstance.bootstrapTable('updateRow', {
                        index: contrastResult.data.index,
                        row: param
                    });

                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            },
            /**
             * 配置参数名次解释-展示
             * @param configType
             */
            configExplainFun: function (configType) {
                $scope.addIntegrationObj.showExplain = $scope.addIntegrationObj.explainObj[configType];
            },
            /**
             * 移除追加参数
             */
            remooveParam: function (index) {
                this.addParamList.splice(index, index + 1)
            },
            /**
             * 追加参数
             */
            addParam: function () {
                this.addParamList.push({key: this.config.addKey, value: this.config.addValue})
            },
            /**
             * 点击完成，新增或者修改
             */
            completeForAdd: function () {
                if ('add' === $stateParams.param) {
                    $scope.httpFunction.addIntegration();
                }
                if ('update' === $stateParams.param) {
                    $scope.httpFunction.updateIntegration();
                }
                if ('updateVersion' === $stateParams.param) {
                    $scope.httpFunction.addIntegration();
                }
                $state.go('app.insure.integration_processManage');
            },
            /**
             * 根据跳转前操作确定是'新增'，'编辑'，'更新版本'
             */
            getIntegrationForId: function () {
                if ('update' === $stateParams.param || 'updateVersion' === $stateParams.param) {
                    var data = {int_id: $stateParams.data};
                    $scope.httpFunction.toUpdateIntegration(data);
                }

            },
            /**
             * 处理数据库取到的数据（包括产品，类型选择框默认选中及配置主题的格式化）
             */
            dealDataForUpdatePage: function () {
                $scope.addIntegrationObj.config.config_param = eval("(" + $scope.addIntegrationObj.config.config_param + ")");
                $scope.addIntegrationObj.addData.int_project_type = this.getObjForStr($scope.addIntegrationObj.addData.int_project_type, $scope.listObj.projectData);
                $scope.listObj.getTypeSelect($scope.addIntegrationObj.addData.int_project_type);
                $scope.addIntegrationObj.addData.int_type = this.getObjForStr($scope.addIntegrationObj.addData.int_type, $scope.listObj.typeData);

            },
            /**
             * 根据id找出相应对象
             * @param id id，map的一个属性
             * @param map 对象集合
             * @returns {*} 对象
             */
            getObjForStr: function (id, map) {
                var result = null;
                angular.forEach(map, function (data) {
                    if (id == data.id) {
                        result = data;
                    }
                });
                return result;

            }
        };
        /**
         * 获取上传信息
         */
        $scope.$on('summon', function (e, newLocation) {
            $scope.uploadPath = newLocation;
        });
        /**
         * 请求相关-函数
         * @type {{addIntegrationBaseMsg: addIntegrationBaseMsg}}
         */
        $scope.httpFunction = {
            /**
             * 新增进程
             * @param dataParam
             */
            addIntegration: function () {
                $scope.addIntegrationObj.addData.int_src_path = $scope.uploadPath;
                $scope.addIntegrationObj.addData.int_belong_user = $scope.userName;
                $scope.addIntegrationObj.addData.int_output_path = $scope.addIntegrationObj.getOutputPath()[$scope.addIntegrationObj.addData.int_type];
                $http({
                    method: 'POST',
                    url: '/integration/add',
                    cache: false,
                    data: {
                        baseMsg: $scope.addIntegrationObj.addData,
                        configMsg: $scope.addIntegrationObj.config
                    }
                }).success(function (data) {
                    if (data.result == 'access') {

                    }
                });
            },
            /**
             * 进入修改进程-加载原来数据
             * @param dataParam
             */
            toUpdateIntegration: function (dataParam) {
                $http({
                    method: 'POST',
                    url: '/integration/toupdate',
                    cache: false,
                    data: dataParam
                }).success(function (data) {
                    if (data.code == 0) {
                        $scope.addIntegrationObj.addData = data.result.integration;
                        $scope.addIntegrationObj.config = data.result.config;
                        $scope.addIntegrationObj.dealDataForUpdatePage();
                    }
                });
            },
            /**
             * 修改进程
             * @param dataParam
             */
            updateIntegration: function () {
                $scope.addIntegrationObj.addData.int_src_path = $scope.uploadPath;
                $scope.addIntegrationObj.addData.int_belong_user = $scope.userName;
                $scope.addIntegrationObj.addData.int_output_path = $scope.addIntegrationObj.getOutputPath();
                $http({
                    method: 'POST',
                    url: '/integration/update',
                    cache: false,
                    data: {
                        baseMsg: $scope.addIntegrationObj.addData,
                        configMsg: $scope.addIntegrationObj.config
                    }
                }).success(function (data) {
                    if (data.result == 'access') {

                    }
                });
            },
            /**
             * 删除进程
             */
            deleteIntegration: function () {
                $http({
                    method: 'POST',
                    url: '/integration/deleteIntegration',
                    cache: false,
                    data: {data: $scope.listObj.deleteData},

                }).success(function (data) {
                    if (data.result == 'access') {
                        $scope.listObj.integrationTableInstance.bootstrapTable('refresh');
                    }
                });
            }
        };

        /**
         * 绘制进程信息表格
         * @param data
         */
        $scope.getDownloadTable = function () {
            $scope.btnHtml = '<button class="btn btn-blue hdc-a-update" type="button">编辑</button>'
                + '<button class="btn btn-blue hdc-btn hdc-a-update_version" type="button">新增版本</button>'
                + '<button class="btn btn-blue hdc-btn hdc-a-del" type="button">删除</button>';
            $scope.integrationTable = {
                url: '/integration/show',
                resultTag: 'result',
                pagination: true,
                cardView: false,
                method: 'post',
                queryParams: function (params) {
                    $.extend(params, {
                        view: 'select',
                        param: {
                            'int_name ~ ': $scope.listObj.integrationQuery.int_name,
                            'int_version ~': $scope.listObj.integrationQuery.int_version,
                            'int_version_explain ~': $scope.listObj.integrationQuery.int_version_explain,
                            'int_project_type =': $scope.listObj.integrationQuery.int_project_type != null ? $scope.listObj.integrationQuery.int_project_type.id : null,
                            'int_type =': $scope.listObj.integrationQuery.int_type != null ? $scope.listObj.integrationQuery.int_type.id : null,
                            'int_belong_user =': $scope.userName != null ? $scope.userName : null,
                        }
                    });
                    return params;
                },
                columns: [{
                    checkbox: true,
                    boxwidth: 15
                }, {
                    title: '进程名',
                    class: 'col-md-1',
                    field: 'int_name',
                    align: 'center',
                    sortable: true,
                    width: '13%'
                }, {
                    title: '版本',
                    class: 'col-md-1',
                    field: 'int_version',
                    align: 'center',
                    sortable: true,
                    width: '13%'
                }, {
                    title: '版本说明',
                    class: 'col-md-1',
                    field: 'int_version_explain',
                    align: 'center',
                    sortable: true,
                    width: '35%'
                }, {
                    title: '操作',
                    class: 'col-md-1',
                    align: 'center',
                    width: '35%',
                    formatter: function (value, row, index) {
                        return $scope.btnHtml;
                    },
                    events: {
                        //start.......
                        'click .hdc-a-update': function (e, value, row, index) {
                            $state.go('app.insure.integrationManage_addIntegration', {
                                param: 'update',
                                data: row.int_id
                            });
                        },
                        'click .hdc-a-update_version': function (e, value, row, index) {
                            $state.go('app.insure.integrationManage_addIntegration', {
                                param: 'updateVersion',
                                data: row.int_id
                            });
                        },
                        'click .hdc-a-del': function (e, value, row, index) {
                            if (confirm(switchLang.switchLang('此操作，将删除源码，确认删除吗？'))) {
                                $scope.listObj.deleteData = [];
                                $scope.listObj.deleteData.push(row);
                                $scope.httpFunction.deleteIntegration();
                                $scope.listObj.integrationTableInstance.bootstrapTable('refresh');
                            }
                        }
                        //end


                    },

                }]

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
        //进入执行方法
        $scope.addIntegrationObj.getIntegrationForId();
        //----------------------------------------------伪造数据--------------------------------------------

        $scope.getDownloadTable();


    }]);

/**
 * 作业流管理-控制器
 */
app.controller('operationManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', 'modalTip',
    function ($scope, $modal, $http, fylatService, $state, switchLang, modalTip) {

        $scope.listObj = {
            userName: $scope.userName,  //当前操作用户
            project_type: {id: 'YCP', name: '云产品'},     //作业流类型
            projectData: fylatService.projectSelect,
            jobState: {id: 0, name: '未运行'},         //作业流执行状态
            serchStartTime: '',   //检索开始时间
            serchEndTime: '',     //检索结束时间
            navigationMsg: '管理平台 > 作业流管理',  //导航栏显示信息
            type: fylatService.typeSelect,       //类型选择框数据
            stateData: [{id: 0, name: '未运行'}, {id: 1, name: '运行完成'}], //作业流状态选择框数据
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
                                url: job_run_url
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
                + '<button class="btn btn-blue hdc-btn dispatch-delete" type="button">删除</button>'
                + '<button class="btn btn-blue hdc-btn dispatch-result" type="button">查看结果</button>';
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
                        } else {
                            return '<div>运行完成</div>'
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
                        return operaResultBtnHtml;
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
                            //$scope.listObj.openResultModal(row.job_outputpath);
                            $scope.listObj.openResultModal("D://", 'lg');
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
 * 质量检测-控制器
 * Created by handongchen on 2017/9/28.
 */
app.controller('qualityTestController', ['$scope', '$modal', '$http', 'fylatService', '$state', function ($scope, $modal, $http, fylatService, $state) {
    /**
     * 设置'新增进程'默认值
     * @type {{itType: {id: string, name: string}}}
     */
    $scope.qualityParam = {
        qtType: {id: 'CLM', name: '云检测(CLM)'},
        qtSource: {id: 'FY3D', name: '风云3D'},
    }
    /**
     *
     * @type {{navigationMsg: string, typeData: Array, addIntegration: addIntegration}}
     */
    $scope.listObj = {
        navigationMsg: '管理平台 > 质量检测',   //导航栏显示信息
        typeData: fylatService.typeSelect,   //类型选择框数据
        sourceData: [
            {
                id: 'FY3D',
                name: '风云3D'
            }, {
                id: 'Modis',
                name: 'Modis'
            }],
        searchPolicyBtn: function () {
            $scope.listObj.qualityTableInstance.bootstrapTable('refresh');
        }
    };
    /**
     * 绘制进程信息表格
     * @param data
     */
    $scope.getDownloadTable = function () {
        //----------------------------------------------伪造数据--------------------------------------------
        $scope.visualData = {
            datetime: '2017-10-01',
            count: '10',
            slope: '1.04',
            Intercept: '98',
            standarError: '1.4',
            absoluteError: '2.1',
            relativeError: '0.1',
        }
    };

    $scope.getDownloadTable();

}]);

/**
 * 资源管理-控制器
 * Created by handongchen on 2017/9/28.
 */
app.controller('resourceManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', function ($scope, $modal, $http, fylatService, $state) {
    /**
     * 设置'新增进程'默认值
     * @type {{itType: {id: string, name: string}}}
     */
    $scope.resourceParam = {}
    /**
     *
     * @type {{navigationMsg: string, typeData: Array, addIntegration: addIntegration}}
     */
    $scope.listObj = {
        navigationMsg: '管理平台 > 资源管理',   //导航栏显示信息
        typeData: fylatService.typeSelect,   //类型选择框数据
    };
    /**
     * 绘制磁盘信息-仪表图
     */
    $scope.getDiskMsg = function () {
        $scope.pieHollowData = {
            title: {
                text: '磁盘使用状况',
            }
        };
        $scope.gaugedata = [
            {
                name: 'sdk1使用率',
                data: [{value: 50, name: 'sdk1使用率'}],
                center: ['16.5%', '50%']
            },
            {
                name: 'sdk2使用率',
                data: [{value: 60, name: 'sdk2使用率'}],
                center: ['49.5%', '50%']
            },
            {
                name: 'sdk3使用率',
                data: [{value: 10, name: 'sdk3使用率'}],
                center: ['82.5%', '50%']
            }
        ];
    }
    $scope.getDiskMsg();

}]);

/**
 * 数据分享-控制器
 * Created by handongchen on 2017/9/28.
 */
app.controller('dataShareController', ['$scope', '$modal', '$http', 'fylatService', '$state', function ($scope, $modal, $http, fylatService, $state) {
    /**
     * 设置'新增进程'默认值
     * @type {{itType: {id: string, name: string}}}
     */
    $scope.dataParam = {
        itType: {id: 'CLM', name: '云检测(CLM)'},
    }
    /**
     *
     * @type {{navigationMsg: string, typeData: Array, addIntegration: addIntegration}}
     */
    $scope.listObj = {
        navigationMsg: '管理平台 > 数据管理',   //导航栏显示信息
        typeData: fylatService.typeSelect,   //类型选择框数据
        searchPolicyBtn: function () {
            $scope.listObj.qualityTableInstance.bootstrapTable('refresh');
        }
    };
    /**
     * 绘制进程信息表格
     * @param data
     */
    $scope.getDownloadTable = function (data) {
        $scope.dataTable = {
            //url: url,
            // resultTag: 'result',+
            data: data,
            pagination: false,
            cardView: false,
            // queryParams: function (params) {
            //     $.extend(params, {
            //         view: 'select',
            //         policy_company: $scope.listObj.policy_company ? $scope.listObj.policy_company : '',
            //         policy_code: $scope.listObj.policy_code ? $scope.listObj.policy_code : '',
            //         policy_holder: $scope.listObj.policy_holder ? $scope.listObj.policy_holder : '',
            //         insurant: $scope.listObj.insurant ? $scope.listObj.insurant : ''
            //     });
            //     return params;
            // },
            columns: [{
                checkbox: true,
                boxwidth: 15,
            }, {
                title: '数据',
                class: 'col-md-12',
                field: 'data',
                align: 'center',
                sortable: true,
                width: '60%'
            }]

        }
    };
    //----------------------------------------------伪造数据--------------------------------------------
    $scope.integration = [
        {
            data: '20170908',
        },
        {
            data: '20170908',
        },
        {
            data: '20170908',
        },
        {
            data: '20170908',
        },
        {
            data: '20170908',
        },
        {
            data: '20170908',
        },
        {
            data: '20170908',
        },
    ]
    $scope.getDownloadTable($scope.integration);


}]);


/**
 * 新建作业流-控制器
 */
app.controller('addOperationController', ['$scope', '$modal', '$http', 'fylatService', '$state',
    function ($scope, $modal, $http, fylatService, $state) {
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
                    formatter: $scope.stateFormatter
                }, {
                    title: '进程名',
                    class: 'col-md-1',
                    field: 'int_name',
                    align: 'center',
                    sortable: true,
                    width: '40%'
                }, {
                    title: '版本',
                    class: 'col-md-1',
                    field: 'int_version',
                    align: 'center',
                    sortable: true,
                    width: '40%'
                }],
                onCheck: function (row) {
                    $scope.listObj.orderProcess.push(row);
                    $scope.listObj.processOrderTableInstance.bootstrapTable('load', $scope.listObj.orderProcess);
                    $scope.listObj.checkIntId.push(row.int_id);
                },
                onCheckAll: function (rows) {
                    $scope.listObj.checkIntId = [];
                    for (var i = 0; i < rows.length; i++) {
                        $scope.listObj.checkIntId.push(rows[i].int_id);
                    }
                    $scope.listObj.orderProcess = rows;
                    $scope.listObj.processOrderTableInstance.bootstrapTable('removeAll');
                    $scope.listObj.processOrderTableInstance.bootstrapTable('load', rows);
                },
                onUncheck: function (row) {
                    $scope.listObj.processOrderTableInstance.bootstrapTable('removeByUniqueId', row.int_id);
                    $scope.removeByValue($scope.listObj.checkIntId, row.int_id);
                },
                onUncheckAll: function (rows) {
                    // $scope.listObj.processOrderTableInstance.bootstrapTable('removeAll');
                    for (var i = 0; i < rows.length; i++) {
                        $scope.removeByValue($scope.listObj.checkIntId, rows[i].int_id);
                        $scope.listObj.processOrderTableInstance.bootstrapTable('removeByUniqueId', rows[i].int_id);
                    }
                }
            };
        };
        // 勾选用户已选择的进程
        $scope.stateFormatter = function (value, row, index) {
            for (var a = 0; a < $scope.listObj.checkIntId.length; a++) {
                if (row.int_id == $scope.listObj.checkIntId[a])
                    return {
                        disabled: false,//设置是否可用
                        checked: true//设置选中
                    };
            }
            return value;
        };
        $scope.removeByValue = function (arr, val) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == val) {
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
                columns: [{
                    title: '进程名',
                    class: 'col-md-1',
                    field: 'int_name',
                    align: 'center',
                    sortable: true,
                    width: '13%'
                }, {
                    title: '执行顺序',
                    class: 'col-md-1',
                    field: 'int_number',
                    align: 'center',
                    sortable: true,
                    formatter: function (value, row, index) {
                        return index + 1;
                    }
                }, {
                    title: '版本',
                    class: 'col-md-1',
                    field: 'int_version',
                    align: 'center',
                    sortable: true,
                    width: '13%'
                }]
            };
        };
        $scope.getProcess();
        $scope.selectProcess($scope.listObj.orderProcess);
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
        url: 'article/fileUploadDomain',
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
            title:item.title

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
                    lineDataObj.date =  insureUtil.dateToString(new Date(), 'yyyy-MM-dd hh:mm:ss')
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
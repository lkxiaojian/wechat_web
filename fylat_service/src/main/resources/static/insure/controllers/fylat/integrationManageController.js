/**
 * 集成管理-控制器
 * Created by handongchen on 2017/9/28.
 */
app.controller('integrationManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'insureUtil',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, insureUtil) {
        $scope.integrationSrcTable = null;
        /**
         *
         * @type {{navigationMsg: string, typeData: Array, addIntegration: addIntegration}}
         */
        $scope.listObj = {
            navigationMsg: '管理平台 >领域管理',   //导航栏显示信息
            projectData: fylatService.projectSelect,   //产品选择框数据
            languageData: [
                'shell',
                'Python',
                'c语言',
                'c++',
                'c#',
                '其他',
            ],


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
                    $scope.listObj.integrationTableInstance.bootstrapTable('refresh');
                }


            },
        };
        /**
         * 新建进程界面相关方法及变量
         * @type {{explainObj: {head: [*], foot: [*], fylat_sensor_id: [*], code_root_path: [*], L1b_data_path: [*], nwp_data_path: [*], oisst_data_path: [*], fy3_mersi_L1b_data: [*], fy3_mersi_GEO_data: [*], fy3_mersi_CLM_data: string, fy3_mersi_CPP_data: string, fy3_mersi_CTP_data: string, fy3_mersi_COP_data: string, fy3_mersi_CLD_data: string, fy3_intermediate: string, fylat_nwp_opt: string, fylat_rtm_opt: string, nwp_grib_data1: string, nwp_grib_data2: string, oisst_data: string, cloudmask_id: string, cloudphase_id: string, cloudtopz_id: string, cloudtau_day_id: string, cloudtau_night_id: string, cloudtypeII_id: string, write_inter_id: string}, addParamList: Array, getTableForSrc: getTableForSrc, open: open, configExplainFun: configExplainFun, remooveParam: remooveParam, addParam: addParam}}
         */
        var clmOutputPath = "/home/huxq/NETDISK/web/test/data_clm/%id/%yyyy/%yyyy%mm%dd/";
        var sstOutputPath = "/home/huxq/NETDISK/web/test/data_clm/%yyyy/%yyyy%mm%dd/";
        $scope.addIntegrationObj = {

            config: {
                config_head: '&config',
                config_foot: '/',
                config_param: {
                    //输出路径
                    fy3_mersi_CLM_data: clmOutputPath,
                    fy3_mersi_CPP_data: clmOutputPath,
                    fy3_mersi_CTP_data: clmOutputPath,
                    fy3_mersi_COP_data: clmOutputPath,
                    fy3_mersi_CLD_data: clmOutputPath,
                    fy3_intermediate: clmOutputPath,
                    //输入路径
                    fy3_mersi_L1b_data: "/home/huxq/FYLAT/data/FY3D/MERSI/L1/1000M/%yyyy/%yyyy%mm%dd/",
                    fy3_mersi_GEO_data: "/home/huxq/FYLAT/data/FY3D/MERSI/L1/GEO1K/%yyyy/%yyyy%mm%dd/",
                    //找到辅助文件位置
                    nwp_grib_data1: "/home/huxq/FYLAT/data/NWP/ORG/",
                    nwp_grib_data2: "/home/huxq/FYLAT/data/NWP/ORG/",

                    //执行run_sst.sh脚本生成的辅助文件，要按当前时次的时间减两天执行
                    oisst_data: "/home/huxq/FYLAT/data/SST/DAILY/%yyyy/ ",
                    //
                    fylat_sensor_id: 1,
                    L1b_data_path: "/home/huxq/FYLAT/data/FY3D/MERSI/L1/1000M/%yyyy/%yyyy%mm%dd/",
                    nwp_data_path: "/home/huxq/FYLAT/data/NWP/",
                    oisst_data_path: "/home/huxq/FYLAT/data/SST/DAILY/%yyyy/",
                    code_root_path: "/home/huxq/FYLAT/script/CLM/",
                    //其他
                    fylat_nwp_opt: 1,
                    fylat_rtm_opt: 1,
                    cloudmask_id: 1,
                    cloudphase_id: 0,
                    cloudtopz_id: 0,
                    cloudtau_day_id: 0,
                    cloudtau_night_id: 0,
                    cloudtypeII_id: 0,
                    write_inter_id: 0
                }
            },
            //传过来的参数
            param: $stateParams.param,
            isHaveErr: true,
            //名词解释集合
            explainObj: {
                head: ['配置信息头部标识'],
                foot: ['配置信息头部标识'],
                fylat_sensor_id: ['传感器编号'],
                //code_root_path: ['代码根路径', '包含类型文件夹时用%type代替', '例如:', '"/home/huxq/FYLAT/script/CLM/"', '  实际输入:', '"/home/huxq/FYLAT/script/%type/"'],
                L1b_data_path: ['L1b数据路径', '如果有时间包含在值中，请转义', '时间转义规则:', '--年：%y', '--月：%m', '--日：%d', '--时：%h', '--分：%mi', '--秒：%s', '例如:', '/home/FY3D/2005/20050101/', '实际输入:', '/home/FY3D/%y/%y%m%d/'],
                nwp_data_path: ['nwp数据路径'],
                oisst_data_path: ['oisst数据路径'],
                fy3_mersi_L1b_data: ['风云3meri，L1b数据,输入路径'],
                fy3_mersi_GEO_data: ['风云3meri，GEO数据，输入路径'],
                fy3_mersi_CLM_data: ['风云3meri，CLM数据,输入路径'],
                fy3_mersi_CPP_data: ['风云3meri，CPP数据,输入路径'],
                fy3_mersi_CTP_data: ['风云3meri，CTP数据,输入路径'],
                fy3_mersi_COP_data: ['风云3meri，COP数据,输入路径'],
                fy3_mersi_CLD_data: ['风云3meri，CLD数据,输入路径'],
                fy3_intermediate: ['风云3meri，intermediate数据,输入路径'],
                fylat_nwp_opt: '',
                fylat_rtm_opt: '',
                nwp_grib_data1: ['辅助文件位置'],
                nwp_grib_data2: ['辅助文件位置'],
                oisst_data: ['执行run_sst.sh脚本生成的辅助文件', '要按当前时次的时间减两天执行'],
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
                        $scope.addIntegrationObj.addData.int_src_path = null;
                    } else {
                        param.compileState = "编译成功";
                        if(contrastResult.result){
                            $scope.addIntegrationObj.addData.int_src_path = contrastResult.result;
                        }else {
                            $scope.addIntegrationObj.addData.int_src_path = '未知';
                        }

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
            remooveParam: function (item) {

                this.addParamList.splice(index, index + 1)
            },
            /**
             * 追加参数
             */
            addParam: function () {
                this.addParamList.push({key: $scope.addIntegrationObj.addKey, value:  $scope.addIntegrationObj.addValue})
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
                //$scope.addIntegrationObj.addData.int_src_path = $scope.uploadPath;
                $scope.addIntegrationObj.addData.int_belong_user = $scope.userName;
                //$scope.addIntegrationObj.addData.int_output_path = $scope.addIntegrationObj.getOutputPath()[$scope.addIntegrationObj.addData.int_type];
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
                    width: '10%'
                }, {
                    title: '版本',
                    class: 'col-md-1',
                    field: 'int_version',
                    align: 'center',
                    sortable: true,
                    width: '7%'
                }, {
                    title: '语言',
                    class: 'col-md-1',
                    field: 'int_language',
                    align: 'center',
                    sortable: true,
                    width: '8%'
                }, {
                    title: '版本说明',
                    class: 'col-md-1',
                    field: 'int_version_explain',
                    align: 'center',
                    sortable: true,
                    width: '25%'
                }, {
                    title: '创建时间',
                    class: 'col-md-1',
                    field: 'int_createtime',
                    align: 'center',
                    formatter: function (value, row, index) {
                        return insureUtil.dateToString(new Date(value),'yyyy-MM-dd hh:mm:ss');
                    },
                    width: '10%'
                }, {
                    title: '修改时间',
                    class: 'col-md-1',
                    field: 'int_leadtime',
                    align: 'center',
                    formatter: function (value, row, index) {
                        return insureUtil.dateToString(new Date(value),'yyyy-MM-dd hh:mm:ss');
                    },
                    width: '10%'
                }, {
                    title: '操作',
                    class: 'col-md-1',
                    align: 'center',
                    width: '25%',
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
                    formatter: function (value, row, index) {
                        return value.substring(18);
                    },
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


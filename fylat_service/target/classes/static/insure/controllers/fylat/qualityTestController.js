/**
 * 单产品目视质检-控制器
 * Created by handongchen on 2017/9/28.
 */
app.controller('singleQualityTestController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'insureUtil', function ($scope, $modal, $http, fylatService, $state, insureUtil) {
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
        navigationMsg: '管理平台 > 单产品目视质检',   //导航栏显示信息
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
            $scope.listObj.qualityReportTableInstance.bootstrapTable('refresh');
        },
        open: function (size) {
            var modalInstance = $modal.open({
                templateUrl: 'insure/template/fylat/common/quality_report_person.html',
                controller: 'singleQualityTestController',
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
        }
    };

    /**
     * 绘制信息表格
     * @param data
     */
    $scope.singleQualityTestTable = function (url) {
        //质检报告表格
        $scope.qualityReportTable = {
            pagination: true,
            url: 'getSingleQualityTestData',
            resultTag: 'result',
            queryParams: function (params) {
                $.extend(params, {
                    view: 'select',
                });
                return params;
            },
            columns: [{
                checkbox: true,
                boxwidth: 15,
            }, {
                title: '时间',
                class: 'col-md-1',
                field: 'qua_datetime',
                align: 'center',
                sortable: true,
                width: '3%',
                order: 'desc',
                formatter: function (value, row, index) {
                    return insureUtil.dateToString(new Date(value), 'yyyy-mm-dd');
                }
            }, {
                title: '名称',
                class: 'col-md-1',
                field: 'qua_name',
                align: 'center',
                sortable: true,
                width: '13%'
            }, {
                title: '算数均值',
                class: 'col-md-1',
                field: 'qua_mean_value',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '中位数',
                class: 'col-md-1',
                field: 'qua_median',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '标准差',
                class: 'col-md-1',
                field: 'qua_standard_variance',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '变异系数',
                class: 'col-md-1',
                field: 'qua_coefficient_of_variation',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '异常',
                class: 'col-md-1',
                field: 'qua_abnormal_value',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '准确度',
                class: 'col-md-1',
                field: 'qua_accuracy',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '整体有效率',
                class: 'col-md-1',
                field: 'qua_valid_ratio',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '平均偏差',
                class: 'col-md-1',
                field: 'qua_mean_bias',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '均方根误差',
                class: 'col-md-1',
                field: 'qua_root_mean_square_error',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '决定系数',
                class: 'col-md-1',
                field: 'qua_r2',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '线性回归方程',
                class: 'col-md-1',
                field: 'qua_linear_regression_equation',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '图片地址',
                class: 'col-md-1',
                field: 'qua_linear_regression_equation',
                align: 'center',
                visible: false,
                sortable: true,
                width: '35%'
            }, {
                radio: true,
                boxwidth: 15,
            }, {
                title: '操作',
                class: 'col-md-1',
                align: 'center',
                width: '10%',
                formatter: function (value, row, index) {
                    return '<button class="btn btn-blue hdc-btn downlaodCheckForDir" type="button" data-toggle="modal" data-target=".bs-example-modal-lg">查看</button>';
                },
                events: {
                    'click .downlaodCheckForDir': function (e, value, row, index) {

                    }
                },

            }]

        };

        $scope.visualData = {
            qua_datetime: '2017-10-01',
            qua_mean_value: '99',
            qua_median: '98',
            qua_standard_variance: '1.4',
            qua_coefficient_of_variation: '2.1',
            qua_abnormal_value: '0.1',
        }
    };

    $scope.singleQualityTestTable("getSingleQualityTestData");
    //----------------------------------------------伪造数据--------------------------------------------
    $scope.singleQualityTestData = [
        {
            qua_datetime: '2017-10-01',
            qua_name: '10',
            qua_mean_value: '99',
            qua_median: '98',
            qua_standard_variance: '1.4',
            qua_coefficient_of_variation: '2.1',
            qua_abnormal_value: '0.1',
            qua_accuracy: '80%',
            qua_valid_ratio: '90%',
            qua_mean_bias: '0.6',
            qua_root_mean_square_error: '0.8',
            qua_r2: '8',
            qua_linear_regression_equation: '8',
            qua_image_url: ''
        },
        {
            qua_datetime: '2017-10-01',
            qua_name: '10',
            qua_mean_value: '99',
            qua_median: '98',
            qua_standard_variance: '1.4',
            qua_coefficient_of_variation: '2.1',
            qua_abnormal_value: '0.1',
            qua_accuracy: '80%',
            qua_valid_ratio: '90%',
            qua_mean_bias: '0.6',
            qua_root_mean_square_error: '0.8',
            qua_r2: '8',
            qua_linear_regression_equation: '8',
            qua_image_url: ''
        }
    ]
}]);

/**
 * 异源遥感产品质检-控制器
 * Created by handongchen on 2017/9/28.
 */
app.controller('difSourceQualityTestController', ['$scope', '$modal', '$http', 'fylatService', '$state', function ($scope, $modal, $http, fylatService, $state) {
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
        navigationMsg: '管理平台 > 异源遥感产品质检',   //导航栏显示信息
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
            $scope.listObj.qualityReportTableInstance.bootstrapTable('refresh');
        },
        open: function (size) {
            var modalInstance = $modal.open({
                templateUrl: 'insure/template/fylat/common/quality_report_person.html',
                controller: 'difSourceQualityTestController',
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
        }
    };

    /**
     * 绘制信息表格
     * @param data
     */
    $scope.difSourceQualityTestTable = function (data) {
        //质检报告表格
        $scope.qualityReportTable = {
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
                title: '时间',
                class: 'col-md-1',
                field: 'qua_datetime',
                align: 'center',
                sortable: true,
                width: '3%'
            }, {
                title: '名称',
                class: 'col-md-1',
                field: 'qua_name',
                align: 'center',
                sortable: true,
                width: '13%'
            }, {
                title: '算数均值',
                class: 'col-md-1',
                field: 'qua_mean_value',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '中位数',
                class: 'col-md-1',
                field: 'qua_median',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '标准差',
                class: 'col-md-1',
                field: 'qua_standard_variance',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '变异系数',
                class: 'col-md-1',
                field: 'qua_coefficient_of_variation',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '异常',
                class: 'col-md-1',
                field: 'qua_abnormal_value',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '准确度',
                class: 'col-md-1',
                field: 'qua_accuracy',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '整体有效率',
                class: 'col-md-1',
                field: 'qua_valid_ratio',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '平均偏差',
                class: 'col-md-1',
                field: 'qua_mean_bias',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '均方根误差',
                class: 'col-md-1',
                field: 'qua_root_mean_square_error',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '决定系数',
                class: 'col-md-1',
                field: 'qua_r2',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '线性回归方程',
                class: 'col-md-1',
                field: 'qua_linear_regression_equation',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '图片地址',
                class: 'col-md-1',
                field: 'qua_linear_regression_equation',
                align: 'center',
                visible: false,
                sortable: true,
                width: '35%'
            }, {
                radio: true,
                boxwidth: 15,
            }, {
                title: '操作',
                class: 'col-md-1',
                align: 'center',
                width: '10%',
                formatter: function (value, row, index) {
                    return '<button class="btn btn-blue hdc-btn downlaodCheckForDir" type="button" data-toggle="modal" data-target=".bs-example-modal-lg">查看</button>';
                },
                events: {
                    'click .downlaodCheckForDir': function (e, value, row, index) {

                    }
                },

            }]

        }

        $scope.visualData = {
            qua_datetime: '2017-10-01',
            qua_mean_value: '99',
            qua_median: '98',
            qua_standard_variance: '1.4',
            qua_coefficient_of_variation: '2.1',
            qua_abnormal_value: '0.1',
        }
    };

    $scope.singleQualityTestTable($scope.singleQualityTestData);
    //----------------------------------------------伪造数据--------------------------------------------
    $scope.singleQualityTestData = [
        {
            qua_datetime: '2017-10-01',
            qua_name: '10',
            qua_mean_value: '99',
            qua_median: '98',
            qua_standard_variance: '1.4',
            qua_coefficient_of_variation: '2.1',
            qua_abnormal_value: '0.1',
            qua_accuracy: '80%',
            qua_valid_ratio: '90%',
            qua_mean_bias: '0.6',
            qua_root_mean_square_error: '0.8',
            qua_r2: '8',
            qua_linear_regression_equation: '8',
            qua_image_url: ''
        },
        {
            qua_datetime: '2017-10-01',
            qua_name: '10',
            qua_mean_value: '99',
            qua_median: '98',
            qua_standard_variance: '1.4',
            qua_coefficient_of_variation: '2.1',
            qua_abnormal_value: '0.1',
            qua_accuracy: '80%',
            qua_valid_ratio: '90%',
            qua_mean_bias: '0.6',
            qua_root_mean_square_error: '0.8',
            qua_r2: '8',
            qua_linear_regression_equation: '8',
            qua_image_url: ''
        }
    ]
}]);
/**
 * 异源遥感产品质检-控制器
 * Created by handongchen on 2017/9/28.
 */
app.controller('difTypeQualityTestController', ['$scope', '$modal', '$http', 'fylatService', '$state', function ($scope, $modal, $http, fylatService, $state) {
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
        navigationMsg: '管理平台 > 异源遥感产品质检',   //导航栏显示信息
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
            $scope.listObj.qualityReportTableInstance.bootstrapTable('refresh');
        },
        open: function (size) {
            var modalInstance = $modal.open({
                templateUrl: 'insure/template/fylat/common/quality_report_person.html',
                controller: 'difSourceQualityTestController',
                size: size,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
        }
    };

    /**
     * 绘制信息表格
     * @param data
     */
    $scope.difSourceQualityTestTable = function (data) {
        //质检报告表格
        $scope.qualityReportTable = {
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
                title: '时间',
                class: 'col-md-1',
                field: 'qua_datetime',
                align: 'center',
                sortable: true,
                width: '3%'
            }, {
                title: '名称',
                class: 'col-md-1',
                field: 'qua_name',
                align: 'center',
                sortable: true,
                width: '13%'
            }, {
                title: '算数均值',
                class: 'col-md-1',
                field: 'qua_mean_value',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '中位数',
                class: 'col-md-1',
                field: 'qua_median',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '标准差',
                class: 'col-md-1',
                field: 'qua_standard_variance',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '变异系数',
                class: 'col-md-1',
                field: 'qua_coefficient_of_variation',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '异常',
                class: 'col-md-1',
                field: 'qua_abnormal_value',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '准确度',
                class: 'col-md-1',
                field: 'qua_accuracy',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '整体有效率',
                class: 'col-md-1',
                field: 'qua_valid_ratio',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '平均偏差',
                class: 'col-md-1',
                field: 'qua_mean_bias',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '均方根误差',
                class: 'col-md-1',
                field: 'qua_root_mean_square_error',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '决定系数',
                class: 'col-md-1',
                field: 'qua_r2',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '线性回归方程',
                class: 'col-md-1',
                field: 'qua_linear_regression_equation',
                align: 'center',
                sortable: true,
                width: '35%'
            }, {
                title: '图片地址',
                class: 'col-md-1',
                field: 'qua_linear_regression_equation',
                align: 'center',
                visible: false,
                sortable: true,
                width: '35%'
            }, {
                radio: true,
                boxwidth: 15,
            }, {
                title: '操作',
                class: 'col-md-1',
                align: 'center',
                width: '10%',
                formatter: function (value, row, index) {
                    return '<button class="btn btn-blue hdc-btn downlaodCheckForDir" type="button" data-toggle="modal" data-target=".bs-example-modal-lg">查看</button>';
                },
                events: {
                    'click .downlaodCheckForDir': function (e, value, row, index) {

                    }
                },

            }]

        }

        $scope.visualData = {
            qua_datetime: '2017-10-01',
            qua_mean_value: '99',
            qua_median: '98',
            qua_standard_variance: '1.4',
            qua_coefficient_of_variation: '2.1',
            qua_abnormal_value: '0.1',
        }
    };

    $scope.singleQualityTestTable($scope.singleQualityTestData);
    //----------------------------------------------伪造数据--------------------------------------------
    $scope.singleQualityTestData = [
        {
            qua_datetime: '2017-10-01',
            qua_name: '10',
            qua_mean_value: '99',
            qua_median: '98',
            qua_standard_variance: '1.4',
            qua_coefficient_of_variation: '2.1',
            qua_abnormal_value: '0.1',
            qua_accuracy: '80%',
            qua_valid_ratio: '90%',
            qua_mean_bias: '0.6',
            qua_root_mean_square_error: '0.8',
            qua_r2: '8',
            qua_linear_regression_equation: '8',
            qua_image_url: ''
        },
        {
            qua_datetime: '2017-10-01',
            qua_name: '10',
            qua_mean_value: '99',
            qua_median: '98',
            qua_standard_variance: '1.4',
            qua_coefficient_of_variation: '2.1',
            qua_abnormal_value: '0.1',
            qua_accuracy: '80%',
            qua_valid_ratio: '90%',
            qua_mean_bias: '0.6',
            qua_root_mean_square_error: '0.8',
            qua_r2: '8',
            qua_linear_regression_equation: '8',
            qua_image_url: ''
        }
    ]
}]);
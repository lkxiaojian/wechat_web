
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

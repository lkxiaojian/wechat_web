/**
 * Created by zhengjy on 2017/3/30.
 */

/**
 *行为分析
 */
app.controller('behaviorAnalysisController',['$scope', '$http', 'switchLang', function ($scope, $http, switchLang) {
    $scope.behaviorAnalysisTable = {
        url: 'orderData/behaviorAnalysis',
        resultTag: 'result',
        queryParams: function (params) {
            $.extend(params, {
                view: 'select',
                user_name: $scope.user_name ? $scope.user_name : '',
                score: $scope.score ? $scope.score : '',
                download: $scope.download ? $scope.download : ''
            });
            return params;
        },
        columns: [{
            title: '用户',
            field: 'account',
            class: 'col-md-1',
            width: '20%',
            align: 'center',
            sortable: false
        }, {
            title: 'IP',
            field: "ip_address",
            class: 'col-md-1',
            width: '20%',
            align: 'center',
            sortable: false
        }, {
            title: '登录次数',
            field: 'login',
            class: 'col-md-1',
            width: '20%',
            align: 'center',
            sortable: false
        }, {
            title: '下载次数',
            field: 'download',
            class: 'col-md-1',
            width: '20%',
            align: 'center',
            sortable: false
        }, {
            title: '评分',
            field: 'score',
            class: 'col-md-1',
            width: '20%',
            align: 'center',
            sortable: false
        }]
    }
    
    $scope.behaviorSearch = function () {
        $scope.behaviorAnalysisInstance.bootstrapTable('refresh');
    }
}]);
/**
 *订单详情
 */
app.controller('dataOrderDetailController', ['$scope', '$state', 'switchLang', '$cookieStore', function ($scope, $state, switchLang, $cookieStore) {
    var rowDetail = $cookieStore.get("row");
    // console.log(rowDetail);

    var region = rowDetail.region;
    var city = rowDetail.city;
    var country = rowDetail.country;
    var inputlonlat = rowDetail.inputlonlat;
    var site;
    if (inputlonlat) {
        site = inputlonlat;
    }else if (country) {
        if (country.indexOf(',') != -1) {
            site = country.split(',')[1];
        }
    }else if (city) {
        if (city.indexOf(',') != -1) {
            site = city.split(',')[1];
        }
    }else if (region) {
        if (region.indexOf(',') != -1) {
            site = region.split(',')[1];
        }
    }
    $scope.dataType = switchLang.switchLang(rowDetail.category + '.' + rowDetail.category) + ' '
        + switchLang.switchLang(rowDetail.category + '.' + rowDetail.datatype);
    $scope.timeInterval = rowDetail.datatimestart + '-' + rowDetail.datatimeend;
    $scope.location = site;
    $scope.datausageinput = switchLang.switchLang("datausageinput" + "." + rowDetail.datausageinput);
    $scope.crop = rowDetail.crop;

    $scope.alink_return = function () {
        $cookieStore.remove("row");
        $state.go("app.insure.dataOrder_orderApplyList");
    }
}]);
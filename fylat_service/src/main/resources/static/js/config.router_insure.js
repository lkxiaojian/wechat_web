'use strict';

/**
 * Config for the router
 */
angular.module('app').config(['$stateProvider' ,'$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app.insure', {
            url: '/insure',
            // templateUrl: 'common/template/template_v1.html',
            templateUrl: 'common/template/template_main.html    ',
            controller: 'insureCtrl',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'css/bootstrap-table.css',
                            /*'arcgis_js_api/3.9/js/dojo/dijit/themes/tundra/tundra.css',
                            'arcgis_js_api/3.9/js/esri/css/esri.css',*/
                            'css/insure/fylat_style.css',
                            'vendor/My97DatePicker/WdatePicker.js',
                            'insure/controllers/common_insure.js',

                        ]);
                    }]
            }
        })
        .state('app.insure.integration_processManage', {
            url: '/integrationManage',
            templateUrl: 'insure/template/fylat/integrationManage.html',
            pageTitle: '进程管理',
            controller: 'integrationManageController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'insure/controllers/fylat/integrationManageController.js',
                            "ui.select",
                            'angularFileUpload'

                        ]);
                    }]
            }
        })

        .state('app.insure.domain_Manage', {
            url: '/domainManage',
            templateUrl: 'insure/template/zz_wechat/domainManage.html',
            pageTitle: '领域管理',
            controller: 'domainManageController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'vendor/angular/angular-file-upload/ng-file-upload.js',
                            'vendor/angular/angular-file-upload/ng-file-upload-shim.js',
                            'insure/controllers/zz_wechat/domainManageController.js',
                            'ui.select',
                            'ngFileUpload'

                        ]);
                    }]
            }
        })
        .state('app.insure.article_type', {
            url: '/articleTypeManage',
            templateUrl: 'insure/template/zz_wechat/articleTypeManage.html',
            pageTitle: '文章类型',
            controller: 'articleTypeManageController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'vendor/angular/angular-file-upload/ng-file-upload.js',
                            'vendor/angular/angular-file-upload/ng-file-upload-shim.js',
                            'insure/controllers/zz_wechat/articleTypeController.js',
                            'ui.select',
                            'ngFileUpload'


                        ]);
                    }]
            }
        })

        .state('app.insure.integrationManage_addIntegration', {
            url: '/addIntegration',
            params: {param: null, data: null},
            templateUrl: 'insure/template/fylat/addIntegration.html',
            pageTitle: '进程管理-新增进程',
            controller: 'integrationManageController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'insure/controllers/fylat/integrationManageController.js',
                            'insure/controllers/fylat/otherController.js',
                            'vendor/websocket/sockjs.min.js',
                            'vendor/websocket/stomp.js',
                            "ui.select"
                        ]);
                    }]
            }
        })
        .state('app.insure.operationManage_addOperation', {
            url: '/addOperation',
            templateUrl: 'insure/template/fylat/addOperation.html',
            params: {"userName": null},
            pageTitle: '新建作业流',
            controller: 'addOperationController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'insure/controllers/fylat/jobSchedulerManageController.js',
                            "ui.select"
                        ]);
                    }]
            }
        })
        .state('app.insure.integration_jobManage', {
            url: '/operationManage',
            templateUrl: 'insure/template/fylat/operationManage.html',
            pageTitle: '作业流管理',
            controller: 'operationManageController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'vendor/websocket/sockjs.min.js',
                            'vendor/websocket/stomp.js',
                            'insure/controllers/fylat/jobSchedulerManageController.js',
                            'insure/controllers/fylat/otherController.js',
                            "ui.select"
                        ]);
                    }]
            }
        })

        .state('app.insure.qualityTest_same', {
            url: '/qualityTest_same',
            templateUrl: 'insure/template/fylat/qualityTest_same.html',
            pageTitle: '结果查看-目视检测',
            controller: 'singleQualityTestController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'insure/controllers/fylat/otherManageController.js',
                            "ui.select"
                        ]);
                    }]
            }
        })
        .state('app.insure.qualityTest_different', {
            url: '/qualityTest_different',
            templateUrl: 'insure/template/fylat/qualityTest_different.html',
            pageTitle: '结果查看-异源检测',
            controller: 'difSourceQualityTestController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'insure/controllers/fylat/otherManageController.js',
                            "ui.select"
                        ]);
                    }]
            }
        })
        .state('app.insure.qualityTest_different_type', {
            url: '/qualityTest_different_type',
            templateUrl: 'insure/template/fylat/qualityTest_different_type.html',
            pageTitle: '结果查看-不同类型检测',
            controller: 'difTypeQualityTestController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'insure/controllers/fylat/otherManageController.js',
                            "ui.select"
                        ]);
                    }]
            }
        })
        .state('app.insure.resourceManage', {
            url: '/resourceManage',
            templateUrl: 'insure/template/fylat/resourceManage.html',
            pageTitle: '资源管理',
            controller: 'resourceManageController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'insure/controllers/fylat/otherManageController.js',
                            'vendor/echarts/echarts-all.js',
                            "ui.select"
                        ]);
                    }]
            }
        })

        .state('app.insure.dataShare', {
            url: '/dataShare',
            templateUrl: 'insure/template/fylat/dataShare.html',
            pageTitle: '数据分享',
            controller: 'dataShareController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'insure/controllers/fylat/otherManageController.js',
                            "ui.select"
                        ]);
                    }]
            }
        })
        .state('app.insure.fileUpload', {
            url: '/fileUpload',
            templateUrl: 'insure/template/fylat/fileUpload.html',
            cache: false,
            pageTitle: '上传文件',
            controller: 'fileUploadController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'insure/controllers/fylat/otherController.js',
                        ]);
                    }]
            }
        })


}]);
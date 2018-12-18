'use strict';

/**
 * Config for the router
 */
angular.module('app').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
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
                            'ngFileUpload',

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

        .state('app.insure.add_article', {
            url: '/addArticle',
            params: {param: null, data: null},
            templateUrl: 'insure/template/zz_wechat/addArticle.html',
            pageTitle: '添加文章',
            controller: 'addArticleManageController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'vendor/jquery/wangEditor.js',
                            'common/directives/custom_directives.js',
                            'insure/controllers/zz_wechat/addArticleManageController.js',
                            'ui.select'
                        ]);
                    }]
            }
        })


        .state('app.insure.article_list', {
            url: '/articleList',
            params: {param: null, data: null},
            templateUrl: 'insure/template/zz_wechat/articleList.html',
            pageTitle: '文章列表',
            controller: 'articleListManageController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'common/directives/custom_directives.js',
                            'insure/controllers/zz_wechat/articleListManageController.js',
                            'ui.select'
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
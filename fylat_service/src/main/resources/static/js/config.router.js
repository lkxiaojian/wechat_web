'use strict';

/**
 * Config for the router
 */
angular.module('app')
    .run(['$rootScope', '$state', '$stateParams', '$filter', '$cookieStore', function ($rootScope, $state, $stateParams, $filter, $cookieStore) {
        /*$rootScope.$state = $state;
         $rootScope.$stateParams = $stateParams;*/
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            /*var pageTitle=toState.pageTitle;
             if(pageTitle){
             $rootScope.pageTitle=pageTitle;
             };*/
        });
    }])
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        //app/insure/urlStrategy
        $urlRouterProvider.otherwise('applogin');
        $stateProvider
            .state('applogin', {
                url: '/applogin?error',
                templateUrl: 'common/page/template_login.html',
                controller: 'globalCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['common/controllers/common_global.js',
                                'vendor/angular/angular-translate/angular-translate.js',
                                'vendor/angular/angular-translate/loader-static-files.js',
                                'vendor/jquery/jquery.marquee.js'
                            ]);
                        }]
                }
            })
            .state('app.insure.authorityControl', {
                url: '/authorityControl',
                templateUrl: 'common/page/exception/notification.html',
                pageTitle: '异常提示',
                controller: 'exceptionCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['common/controllers/common_global.js',
                                'vendor/angular/angular-translate/angular-translate.js',
                                'vendor/angular/angular-translate/loader-static-files.js']);
                        }]
                }
            })
            .state('app.insure.payTipControl', {
                url: '/payTipControl',
                templateUrl: 'common/page/exception/payTip.html',
                pageTitle: '付费提示',
                controller: 'payTipController',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['common/controllers/common_global.js',
                                'vendor/angular/angular-translate/angular-translate.js',
                                'vendor/angular/angular-translate/loader-static-files.js']);
                        }]
                }
            })
            .state('appregister', {
                url: '/appregister',
                templateUrl: 'common/page/template_registration.html',
                controller: 'globalCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load(['common/controllers/common_global.js']);
                        }]
                }
            })
            .state('welcome', {
                url: '/welcome',
                templateUrl: 'common/page/welcome.html',
                controller: 'welcomeCtrl'
            })
            .state('app', {
                abstract: true,
                url: '/app',
                // templateUrl: 'common/template/template_main.html',
                templateUrl: 'common/template/template_v1.html',
                controller: 'globalCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'css/app.css',
                                // 'common/directives/custom_directives.js',
                                'common/controllers/common_global.js',
                                'insure/service/config_service_insure.js',
                                'vendor/jquery/jquery.marquee.js'
                            ]);
                        }]
                }
            })
            .state('app.insure.sysManage_userRightsManange', {
                url: '/userRightsManange',
                templateUrl: 'common/page/userRightsManage_tpl.html',
                pageTitle: '用户管理',
                controller: 'userRightsManageCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'vendor/websocket/sockjs.min.js',
                                'vendor/websocket/stomp.js',
                                'common/service/appPlatformService.js',
                                'vendor/dhtmlx/dhtmlx.js',
                                'vendor/dhtmlx/dhtmlx.css'
                            ]);
                        }]
                }
            })
            .state('app.insure.sysManage_userRightsManange_addUser', {
                url: '/addUser',
                params: {"param": null},
                templateUrl: 'common/page/modal/add_user_model.html',
                pageTitle: '新增用户',
                controller: 'adduserCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'common/controllers/system_manage.js'
                            ]);
                        }
                    ]
                }
            })
            .state('app.insure.sysManage_userRightsManange_editUser', {
                url: '/editUser',
                templateUrl: 'common/page/modal/add_user_model.html',
                pageTitle: '编辑用户',
                controller: 'adduserCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'common/controllers/system_manage.js'
                            ]);
                        }
                    ]
                }
            })
            .state('app.insure.sysManage_userRoleManange', {
                url: '/userRoleManange',
                templateUrl: 'common/page/userRoleManage_tpl.html',
                pageTitle: '角色管理',
                controller: 'userRoleManageCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'common/service/appPlatformService.js',
                                'vendor/dhtmlx/dhtmlx.js',
                                'vendor/dhtmlx/dhtmlx.css'
                            ]);
                        }]
                }
            }).state('app.insure.sysManage_userMenuManange', {
            url: '/userMenuManange',
            templateUrl: 'common/page/userMenuManage_tpl.html',
            pageTitle: '功能管理',
            controller: 'userMenuManageCtrl',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'common/service/appPlatformService.js',
                            'vendor/dhtmlx/dhtmlx.js',
                            'vendor/dhtmlx/dhtmlx.css'
                        ]);
                    }]
            }
        })
            .state('app.insure.sysManage_mgr_log', {
                url: '/mgr_log',
                templateUrl: 'common/page/mgr_log.html',
                pageTitle: '日志管理',
                controller: 'mgrlogCtrl'
            })

            .state('app.insure.config_email', {
                url: '/config_email',
                templateUrl: 'common/page/config_email.html',
                pageTitle: '邮件配置',
                controller: 'configemailCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'common/controllers/system_manage.js'
                            ]);
                        }]
                }
            })
            .state('exception_golbal', {
                url: '/exception_golbal?errorCode&errorMsg',
                templateUrl: 'common/page/exception/page_exception.html',
                controller: 'exceptionCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'common/controllers/common_global.js'
                            ]);
                        }]
                }
            })
            .state('forget_password', {
                url: '/forget_password',
                templateUrl: 'common/page/find_password.html',
                controller: 'globalCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'common/controllers/common_global.js'
                            ]);
                        }]
                }
            })
            .state('pwd_reset', {
                url: '/pwd_reset?issuc&p',
                templateUrl: 'common/page/password_reset.html',
                controller: 'pwd_reset',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'common/controllers/common_global.js'
                            ]);
                        }]
                }
            })
            .state('register_ok', {
                url: '/register_ok?name',
                templateUrl: 'common/page/send_register_email.html',
                controller: 'globalCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'common/controllers/common_global.js'
                            ]);
                        }]
                }
            })
    }]);
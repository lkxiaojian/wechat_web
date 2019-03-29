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
                            'vendor/angular/angular-file-upload/ng-file-upload.js',
                            'vendor/angular/angular-file-upload/ng-file-upload-shim.js'
                        ]);
                    }]
            }
        })
        .state('app.insure.domain_Manage', {
            url: '/domainManage',
            templateUrl: 'insure/template/zz_wechat/domainManage.html',
            pageTitle: '领域新增',
            controller: 'domainManageController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
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
                            'ui.select',
                            'ngFileUpload'
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
        .state('app.insure.keyword_Manage', {
            url: '/keywordManage',
            templateUrl: 'insure/template/zz_wechat/keywordManage.html',
            pageTitle: '关键词',
            controller: 'keywordManageController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'insure/controllers/zz_wechat/keywordManageController.js',
                            'ui.select',


                        ]);
                    }]
            }
        })
        .state('app.insure.modify_article', {
            url: '/modifyArticle',
            params: {param: null,
                article_id: null,
                pre_location: null,
                operate_type: null,
                type: null,//论文OR文章
                tmp_type: null //1查询已发布的，0查询未发布的
            },
            templateUrl: 'insure/template/zz_wechat/modifitionArticle.html',
            pageTitle: '文章修改',
            controller: 'modificationArticleManageController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'vendor/jquery/wangEditor.js',
                            'common/directives/custom_directives.js',
                            'insure/controllers/zz_wechat/modifitionArticleManageController.js',
                            'ui.select',
                            'ngFileUpload'
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
/*
        .state('app.insure.publishManage', {
            url: '/publishManage',
            params: {param: null, type_id: null},
            templateUrl: 'insure/template/zz_wechat/articleTmpList.html',
            pageTitle: '发布管理',
            controller: 'publishManageController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'common/directives/custom_directives.js',
                            'insure/controllers/zz_wechat/publishManageController.js',
                            'ui.select'
                            // publishManage
                        ]);
                    }]
            }
        })*/
        .state('app.insure.domainList', {
            url: '/domainList',
            // params: {param: null, data: null},
            templateUrl: 'insure/template/zz_wechat/domainList.html',
            pageTitle: '领域管理',
            controller: 'domainListManageController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'common/directives/custom_directives.js',
                            'insure/controllers/zz_wechat/domainListManageController.js',
                            'ui.select'
                        ]);
                    }]
            }
        })
        .state('app.insure.modifyDomain', {
            url: '/modifyDomain',
            params: {param: null, article_type_id: null, article_type_name: null, article_type_keyword: null},
            templateUrl: 'insure/template/zz_wechat/modifitionDomaim.html',
            pageTitle: '领域修改',
            controller: 'modifitionDomainManageController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            // 'vendor/jquery/wangEditor.js',
                            'common/directives/custom_directives.js',
                            'insure/controllers/zz_wechat/modifitionDomainManageController.js',
                            'ui.select',
                            // 'ngFileUpload'
                        ]);
                    }]
            }
        })
        .state('app.insure.keywordList', {
            url: '/keywordList',
            // params: {param: null, data: null},
            templateUrl: 'insure/template/zz_wechat/keywordList.html',
            pageTitle: '关键词管理',
            controller: 'keywordListManageController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'common/directives/custom_directives.js',
                            'insure/controllers/zz_wechat/keywordListManageController.js',
                            'ui.select'
                        ]);
                    }]
            }
        })
        .state('app.insure.modifyKeyword', {
            url: '/modifyKeyword',
            params: {id: null, keyword_name: null, parent_id: null, article_type_name: null},
            templateUrl: 'insure/template/zz_wechat/modifitionKeyword.html',
            pageTitle: '关键词修改',
            controller: 'modifitionKeywordManageController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            // 'vendor/jquery/wangEditor.js',
                            'common/directives/custom_directives.js',
                            'insure/controllers/zz_wechat/modifitionKeywordManageController.js',
                            'ui.select',
                            // 'ngFileUpload'
                        ]);
                    }]
            }
        })
        .state('app.insure.test', {
            url: '/test',
            templateUrl: 'insure/template/zz_wechat/typeMangeTmp.html',
            pageTitle: '测试',
            controller: 'testManageController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'insure/directives/system_directives.js',
                            // 'common/directives/custom_directives.js',
                            'insure/controllers/zz_wechat/testManageController.js',
                            'ui.select',
                            'vendor/dhtmlx/dhtmlx.js',
                            'vendor/dhtmlx/dhtmlx.css'
                        ]);
                    }]
            }
        })
        .state('app.insure.articleTypeTmp', {
            url: '/test2',
            params: {param: null, type_id: null},
            templateUrl: 'insure/template/zz_wechat/articleTypeManageTmp.html',
            pageTitle: '测试',
            controller: 'articleTypeManageTmpController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'insure/controllers/zz_wechat/articleTypeTmpController.js',
                            'ui.select',
                            'ngFileUpload'
                        ]);
                    }]
            }
        })

        .state('app.insure.article_manage', {
            url: '/articleManage',
            params: {param: null, data: null,query_params:null},
            templateUrl: 'insure/template/zz_wechat/articleManage.html',
            pageTitle: '文章管理',
            controller: 'articleManageController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'common/directives/custom_directives.js',
                            'insure/controllers/zz_wechat/articleManageController.js',
                            'ui.select'
                        ]);
                    }]
            }
        })
        .state('app.insure.article_data', {
            url: '/articleData',
            params: {param: null, data: null},
            templateUrl: 'insure/template/zz_wechat/articleData.html',
            pageTitle: '文章统计',
            controller: 'articleDataController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'common/directives/custom_directives.js',
                            'insure/controllers/zz_wechat/articleDataController.js',
                            'ui.select'
                        ]);
                    }]
            }
        })

        .state('app.insure.paper_manage', {
            url: '/paperManage',
            params: {param: null, data: null,query_params:null},
            templateUrl: 'insure/template/zz_wechat/paperManage.html',
            pageTitle: '论文管理',
            controller: 'paperManageController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'common/directives/custom_directives.js',
                            'insure/controllers/zz_wechat/paperManageController.js',
                            'ui.select'
                        ]);
                    }]
            }
        })
        .state('app.insure.paper_data', {
            url: '/paperData',
            params: {param: null, data: null},
            templateUrl: 'insure/template/zz_wechat/paperData.html',
            pageTitle: '论文统计',
            controller: 'paperDataController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'common/directives/custom_directives.js',
                            'insure/controllers/zz_wechat/paperDataController.js',
                            'ui.select'
                        ]);
                    }]
            }
        })
        .state('app.insure.type_manage', {
            url: '/typeManage',
            params: {param: null, data: null,type:'0'},
            templateUrl: 'insure/template/zz_wechat/typeManage.html',
            pageTitle: '分类管理',
            controller: 'typeManageController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'common/directives/custom_directives.js',
                            'insure/controllers/zz_wechat/typeManageController.js',
                            'ui.select',
                            'vendor/dhtmlx/dhtmlx.js',
                            'vendor/dhtmlx/dhtmlx.css',
                            'ngFileUpload'
                        ]);
                    }]
            }
        })
        .state('app.insure.pub_type_manage', {
            url: '/pubTypeManage',
            params: {param: null, data: null,type:'1'},
            templateUrl: 'insure/template/zz_wechat/typeManage.html',
            pageTitle: '精品名称管理',
            controller: 'typeManageController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'common/directives/custom_directives.js',
                            'insure/controllers/zz_wechat/typeManageController.js',
                            'ui.select',
                            'vendor/dhtmlx/dhtmlx.js',
                            'vendor/dhtmlx/dhtmlx.css',
                            'ngFileUpload'
                        ]);
                    }]
            }
        })
        .state('app.insure.todo_type_manage', {
            url: '/pubTypeManage',
            params: {param: null, data: null,type:'2'},
            templateUrl: 'insure/template/zz_wechat/typeManage.html',
            pageTitle: '待修复分类管理',
            controller: 'typeManageController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'common/directives/custom_directives.js',
                            'insure/controllers/zz_wechat/typeManageController.js',
                            'ui.select',
                            'vendor/dhtmlx/dhtmlx.js',
                            'vendor/dhtmlx/dhtmlx.css',
                            'ngFileUpload'
                        ]);
                    }]
            }
        })

        .state('app.insure.publish_manage', {
            url: '/publishManage',
            params: {param: null, data: null,type_id: null,pre_location: null,comming_type_id:null,query_params:null,wx_type:null},
            templateUrl: 'insure/template/zz_wechat/publishManage.html',
            pageTitle: '发布管理',
            controller: 'publishManageController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'common/directives/custom_directives.js',
                            'insure/controllers/zz_wechat/publishManageController.js',
                            'ui.select'
                        ]);
                    }]
            }
        })

        .state('app.insure.modify_paper', {
            url: '/modifyPaperManage',
            params: {param: null,
                pre_query_params: null,//上级的查询条件
                article_id: null,
                pre_location: null,
                operate_type: null,
                type: null,//论文OR文章
                tmp_type: null //1查询已发布的，0查询未发布的
            },
            templateUrl: 'insure/template/zz_wechat/modifyPaperManage.html',
            pageTitle: '修改',
            controller: 'modifyPaperManageController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'vendor/jquery/wangEditor.js',
                            'common/directives/custom_directives.js',
                            'insure/controllers/zz_wechat/modifyPaperManageController.js',
                            'ui.select',
                            'ngFileUpload'
                        ]);
                    }]
            }
        })
        .state('app.insure.admin_list', {
            url: '/adminList',
            params: {param: null, data: null},
            templateUrl: 'insure/template/zz_wechat/adminList.html',
            pageTitle: '管理员',
            controller: 'adminListManageController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'common/directives/custom_directives.js',
                            'insure/controllers/zz_wechat/adminListManageController.js',
                            'ui.select'
                        ]);
                    }]
            }
        })
        .state('app.insure.admin_edit', {
            url: '/adminEdit',
            params: {userId: null, name: null},
            templateUrl: 'insure/template/zz_wechat/adminEdit.html',
            pageTitle: '编辑管理员',
            controller: 'adminEditManageController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'common/directives/custom_directives.js',
                            'insure/controllers/zz_wechat/adminEditManageController.js',
                            'ui.select',
                            'vendor/dhtmlx/dhtmlx.js',
                            'vendor/dhtmlx/dhtmlx.css'
                        ]);
                    }]
            }
        })
        .state('app.insure.admin_add', {
            url: '/adminAdd',
            params: {param: null, data: null},
            templateUrl: 'insure/template/zz_wechat/adminAdd.html',
            pageTitle: '添加管理员',
            controller: 'adminAddManageController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'common/directives/custom_directives.js',
                            'insure/controllers/zz_wechat/adminAddManageController.js',
                            'ui.select',
                            'vendor/dhtmlx/dhtmlx.js',
                            'vendor/dhtmlx/dhtmlx.css',
                        ]);
                    }]
            }
        })

        .state('app.insure.recycle_manage', {
            url: '/recycleManage',
            params: {param: null, data: null},
            templateUrl: 'insure/template/zz_wechat/recycleManage.html',
            pageTitle: '回收站管理',
            controller: 'recycleManageController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'common/directives/custom_directives.js',
                            'insure/controllers/zz_wechat/recycleManageController.js',
                            'ui.select'
                        ]);
                    }]
            }
        })
        .state('app.insure.posting_manage', {
            url: '/postingManageController',
            params: {param: null, data: null},
            templateUrl: 'insure/template/zz_wechat/postingManage.html',
            pageTitle: '期刊名称管理',
            controller: 'postingManageController',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load([
                            'common/directives/custom_directives.js',
                            'insure/controllers/zz_wechat/postingManageController.js',
                            'ui.select',
                            'ngFileUpload'
                        ]);
                    }]
            }
        })
}]);

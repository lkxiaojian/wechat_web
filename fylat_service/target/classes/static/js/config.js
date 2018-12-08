// config

var app = angular.module('app')
    .config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
        function ($controllerProvider, $compileProvider, $filterProvider, $provide) {

            // lazy controller, directive and service
            app.controller = $controllerProvider.register;
            app.directive = $compileProvider.directive;
            app.filter = $filterProvider.register;
            app.factory = $provide.factory;
            app.service = $provide.service;
            app.constant = $provide.constant;
            app.value = $provide.value;
        }
    ])
    .config(['$translateProvider', function ($translateProvider) {
        // Register a loader for the static files
        // So, the module will search missing translation tables under the specified urls.
        // Those urls are [prefix][langKey][suffix].
        $translateProvider.useStaticFilesLoader({
            prefix: 'l10n/',
            suffix: '.json'
        });
        // Tell the module to store the language in the local storage
        $translateProvider.useLocalStorage();
        // Tell the module what language to use by default
        $translateProvider.preferredLanguage('zh_CN');

    }])

    //全局拦截器
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('respHttpInterceptor');
    }])
    .factory('respHttpInterceptor', ['$q', '$location', function ($q, $location) {
        return {
            'request': function (config) {
                return config;
            },
            'requestError': function (rejection) {
                return $q.reject(rejection);
            },

            'response': function (response) {
                if (response.data.code == 1) {
                    //console.dir(response.data.result);
                    $location.path("/exception_golbal").search({
                        errorCode: response.data.code,
                        errorMsg: response.data.message
                    });
                    return $q.reject(response);
                } else if (response.data.sessionInvalid == 1) {
                    console.dir(response)
                    $location.path("/applogin").search({
                        error: '1'
                    });
                    return $q.reject(response);
                }
                return response;
            },
            'responseError': function (rejection) {
                return $q.reject(rejection);
            }
        };
    }]);

'use strict';

/**
 * 0.1.1
 * General-purpose jQuery wrapper. Simply pass the plugin name as the expression.
 *
 * It is possible to specify a default set of parameters for each jQuery plugin.
 * Under the jq key, namespace each plugin by that which will be passed to ui-jq.
 * Unfortunately, at this time you can only pre-define the first parameter.
 * @example { jq : { datepicker : { showOn:'click' } } }
 *
 * @param ui-jq {string} The $elm.[pluginName]() to call.
 * @param [ui-options] {mixed} Expression to be evaluated and passed as options to the function
 *     Multiple parameters can be separated by commas
 * @param [ui-refresh] {expression} Watch expression and refire plugin on changes
 *
 * @example <input ui-jq="datepicker" ui-options="{showOn:'click'},secondParameter,thirdParameter" ui-refresh="iChange">
 */
angular.module('ui.jq', ['ui.load']).value('uiJqConfig', {})
    .directive('uiJq', ['uiJqConfig', 'JQ_CONFIG', 'uiLoad', '$timeout', function uiJqInjectingFunction(uiJqConfig, JQ_CONFIG, uiLoad, $timeout) {
        return {
            restrict: 'A',
            compile: function uiJqCompilingFunction(tElm, tAttrs) {

                if (!angular.isFunction(tElm[tAttrs.uiJq]) && !JQ_CONFIG[tAttrs.uiJq]) {
                    throw new Error('ui-jq: The "' + tAttrs.uiJq + '" function does not exist');
                }
                var options = uiJqConfig && uiJqConfig[tAttrs.uiJq];
                return function uiJqLinkingFunction(scope, elm, attrs) {
                    function getOptions(){
                        var linkOptions = [];

                        // If ui-options are passed, merge (or override) them onto global defaults and pass to the jQuery method
                        if (attrs.uiOptions) {
                            linkOptions = scope.$eval('[' + attrs.uiOptions + ']');
                            if (angular.isObject(options) && angular.isObject(linkOptions[0])) {
                                linkOptions[0] = angular.extend({}, options, linkOptions[0]);
                            }
                        } else if (options) {
                            linkOptions = [options];
                        }
                        return linkOptions;
                    }
                    // function getOptions() {
                    //     var linkOptions = [];
                    //
                    //     // If ui-options are passed, merge (or override) them onto global defaults and pass to the jQuery method
                    //     if (attrs.uiOptions) {
                    //         linkOptions = scope.$eval('[' + attrs.uiOptions + ']');
                    //         if (angular.isObject(options) && angular.isObject(linkOptions[0])) {
                    //             linkOptions[0] = angular.extend({}, options, linkOptions[0]);
                    //         }else{
                    //             var obj = elm[0];
                    //             for ( var i = 0; i < obj.options.length; i++) {
                    //                 if (obj.options[i].value == linkOptions[0]) {
                    //                     obj.options[i].selected = true;
                    //                     break;
                    //                 }
                    //             }
                    //         }
                    //     } else if (options) {
                    //         linkOptions = [options];
                    //     }
                    //     return linkOptions;
                    // }

                    // If change compatibility is enabled, the form input's "change" event will trigger an "input" event
                    if (attrs.ngModel && elm.is('select,input,textarea')) {
                        elm.bind('change', function (ev, data) {
                            elm.trigger('input');
                            scope.$emit("jquery_change_event", {data: data});
                        });
                    }

                    // Call jQuery method and pass relevant options
                    function callPlugin() {
                        $timeout(function () {
                            elm[attrs.uiJq].apply(elm, getOptions());
                        }, 0, false);
                    }

                    function refresh() {
                        // If ui-refresh is used, re-fire the the method upon every change
                        if (attrs.uiRefresh) {
                            scope.$watch(attrs.uiRefresh, function () {
                                callPlugin();
                            });
                        }
                    }

                    if (JQ_CONFIG[attrs.uiJq]) {
                        uiLoad.load(JQ_CONFIG[attrs.uiJq]).then(function () {
                            callPlugin();
                            refresh();
                        }).catch(function () {

                        });
                    } else {
                        callPlugin();
                        refresh();
                    }
                };
            }
        };
    }])
    .directive('jqvmap', ['$state', '$filter','$timeout', function jqvmap($state, $filter,$timeout) {
        return {
            restrict: 'A',
            scope: {
                options: '=',
                params: '='
            },
            controller: ['$scope', '$element', '$attrs', function (scope, element, attrs) {
                element.bind('labelShow.jqvmap', function (event, label, code) {
                    label.empty();
                    if (scope.params) {
                        var _rs_obj = scope.params;
                        var _areas = _rs_obj._areas;
                        var _map_type = '';
                        var content = '';
                        if (_rs_obj._map == 'china') {
                            _map_type = code;
                        } else if (_rs_obj._map == 'world') {
                            _map_type = code.toLocaleUpperCase()
                        }
                        content = "<span><strong>" + $filter("translate")(_map_type) + "</strong></span><br/>";
                        for (var i = 0; i < _areas.length; i++) {
                            if (_map_type == _areas[i].area_name) {
                                content += "<span>总访问次数:" + _areas[i].total_count + "</span><br/>";
                                break;
                            }
                            if (i == _areas.length - 1) {
                                content += "<span>总访问次数:0</span><br/>";
                            }
                        }
                    } else {
                        content = "<span><strong>" + $filter("translate")(code) + "</strong></span><br/>";
                    }

                    /*if (scope.params) {
                        for (var i = 0; i < scope.params.length; i++) {
                            if (code == scope.params[i].map) {
                                content += "<span>访问次数:" + scope.params[i].visit + "</span><br/>";
                                content += "<span>浏览量:" + scope.params[i].page_view + "</span><br/>";
                                content += "<span>用户数:" + scope.params[i].unique_visitor + "</span><br/>";
                                break;
                            }

                        }
                    }*/
                    label.html(content);
                });
                element.bind('regionClick.jqvmap', function (event, code, region) {
                    scope.$emit("regionClick-jqvmap", {
                        event: event,
                        code: code,
                        region: region
                    });


                });
                $timeout(function(){
                    element.vectorMap(scope.options);
                });
            }],
            link: function (scope, element, attr) {
                scope.$on('$destroy', function () {
                    element.data().mapObject.applyTransform = function () {
                    };
                });
                scope.$watch('options.values', function (newValue, oldValue) {
                    if (null != newValue && newValue != oldValue) {
                        element.vectorMap('set', 'values', newValue);
                    }
                }, true);
            }
        }
    }]);
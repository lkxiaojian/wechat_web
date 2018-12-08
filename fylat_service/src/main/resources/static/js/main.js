'use strict';

/* Controllers */
var globalDatetype = {id: "today", name: '今日'};
angular.module('app')
    .controller('AppCtrl', ['$scope', '$translate', '$localStorage', '$cookieStore', '$window', '$http', '$filter',
        function ($scope, $translate, $localStorage, $cookieStore, $window, $http, $filter) {
            // add 'ie' classes to html
            var isIE = !!navigator.userAgent.match(/MSIE/i);
            isIE && angular.element($window.document.body).addClass('ie');
            isSmartDevice($window) && angular.element($window.document.body).addClass('smart');
            var user = $cookieStore.get('user');
            // config
            $scope.app = {
                src: '',
                name: '',
                version: '1.0',
                // for chart colors
                color: {
                    primary: '#7266ba',
                    info: '#23b7e5',
                    success: '#27c24c',
                    warning: '#fad733',
                    danger: '#f05050',
                    light: '#e8eff0',
                    dark: '#3a3f51',
                    black: '#1c2b36'
                },
                settings: {
                    themeID: 14,
                    navbarHeaderColor: 'bg-black',
                    navbarCollapseColor: 'bg-black',
                    /*navbarHeaderColor: 'bg-dark',
                     navbarCollapseColor: 'bg-dark',*/
                    asideColor: 'bg-black',
                    headerFixed: true,
                    asideFixed: true,
                    asideFolded: false,
                    asideDock: false,
                    container: false,
                    footColor: 'bg-white'
                },
                insureGlobal: {
                    timesbehavior: {},
                    times: {},
                    kpis: {},
                    filters: {},
                    _app: {sel: "", cols: []},
                    userConfig: {username: ""},
                    isShowTpt: true//是否显示template_page_title.html模板
                }
            };
            /*        $scope.app.insureGlobal.customFun = function(){};
             //定义时间集合 下拉菜单默认数据
             $scope.app.insureGlobal.times.collection = [
             {id: "1", name: '最近1小时'},
             {id: "24", name: '最近24小时'},
             {id: "48", name: '最近48小时'},
             {id: "72", name: '最近72小时'}
             ];

             $scope.app.insureGlobal.timesbehavior.collection = [
             //{id: "today", name: '今日'},
             //{id: "this_week", name: '本周'}//,
             //{id: "latest_hour", name: '最近一小时'},
             {id: "lastestDay", name: '最近一天'},
             {id: "lastestWeek", name: '最近一周'},
             {id: "lastestMonth", name: '最近一月'}
             ];
             $scope.PickerBool=false;
             $scope.ShowDatePicker=function($event){
             $event.stopPropagation();
             $scope.PickerBool=!$scope.PickerBool;
             }
             $scope.app.insureGlobal.times.custom = {startTime: null, endTime: null};
             $scope.app.insureGlobal.timesbehavior.custom = {startTime: null, endTime: null};

             //定义默认显示时间
             $scope.app.insureGlobal.times.default = $scope.app.insureGlobal.times.collection[0];
             $scope.app.insureGlobal.time_name = $scope.app.insureGlobal.times.default.name;
             $scope.app.insureGlobal.timesbehavior.default = $scope.app.insureGlobal.timesbehavior.collection[0];
             $scope.app.insureGlobal.timebehavior_name = $scope.app.insureGlobal.timesbehavior.default.name;
             //注册事件修改默认时间事件
             $scope.$on('modify_insure_global_default_time_event', function (event, data) {
             $scope.app.insureGlobal.times.default = data;
             $scope.app.insureGlobal.timesbehavior.default = data;
             globalDatetype=data;
             $scope.app.insureGlobal.time_name = data.name;
             $scope.app.insureGlobal.timebehavior_name = data.name;

             });

             $scope.$on('modify_insure_global_default_app_event', function (event, data) {
             $scope.app.insureGlobal._app.sel = {id: data.id, name: data.name};
             $localStorage._app = $scope.app.insureGlobal._app;
             $scope.$broadcast("change_default_app_event", {id: data.id, name: data.name});
             });

             $scope.$on('bootstrap_datetime_picker_event', function (event, data) {
             if (data.id == 'custom_start_time') {
             $scope.app.insureGlobal.times.custom.startTime = data.date;
             }
             if (data.id == 'custom_end_time') {
             $scope.app.insureGlobal.times.custom.endTime = data.date;
             }
             });

             $scope.app.insureGlobal.minTimeFormat = function (time) {
             var date = new Date();
             date.setTime(time);
             var formatDate = "";
             formatDate += date.getFullYear();
             formatDate += "-";
             formatDate += (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
             formatDate += "-";
             formatDate += date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
             formatDate += " ";
             formatDate += date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
             formatDate += ":";
             formatDate += date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
             return formatDate;
             };

             //给入时间对象 和数据 计算时间点 （开始时间，结束时间）
             $scope.app.insureGlobal.btimeCalculate = function (timeItem) {
             var nowDate = new Date();
             var perDate = new Date();
             var id = "today";
             //今天
             if (timeItem.id == "today") {
             perDate.setFullYear(nowDate.getFullYear());
             perDate.setMonth(nowDate.getMonth());
             perDate.setDate(nowDate.getDate());
             perDate.setHours(0);
             perDate.setMinutes(0);
             perDate.setSeconds(0);
             id = "today";
             }

             //本周
             else if (timeItem.id == "week") {
             var day = nowDate.getDay();
             perDate.setFullYear(nowDate.getFullYear());
             perDate.setMonth(nowDate.getMonth());
             perDate.setDate(nowDate.getDate() - day + 1);
             perDate.setHours(0);
             perDate.setMinutes(0);
             perDate.setSeconds(0);

             nowDate.setDate(nowDate.getDate() + (7 - day));
             nowDate.setHours(23);
             nowDate.setMinutes(59);
             nowDate.setSeconds(59);
             id = "week";
             }

             //最近一小时
             else if (timeItem.id == "latestHour") {
             perDate.setTime(nowDate.getTime() - 1000 * 60 * 60);
             id = "latestHour";
             }

             //最近一天
             else if (timeItem.id == "lastestDay") {
             perDate.setTime(nowDate.getTime() - 1000 * 60 * 60 * 24);
             id = "lastestDay";
             }

             //最近一周
             else if (timeItem.id == "lastestWeek") {
             perDate.setTime(nowDate.getTime() - 1000 * 60 * 60 * 24 * 7);
             id = "lastestWeek";
             }

             //最近一月
             else if (timeItem.id == "lastestMonth") {
             perDate.setTime(nowDate.getTime() - 1000 * 60 * 60 * 24 * 30);
             id = "lastestMonth";
             }

             //最近一年
             else if (timeItem.id == "latestYear") {
             perDate.setTime(nowDate.getTime() - 1000 * 60 * 60 * 24 * 365);
             id = "latestYear";
             }
             else {
             perDate.setTime($scope.app.insureGlobal.timesbehavior.custom.startTime);
             nowDate.setTime($scope.app.insureGlobal.timesbehavior.custom.endTime);
             }

             $scope.app.insureGlobal.timesbehavior.startFormat = $scope.app.insureGlobal.minTimeFormat(perDate.getTime());
             $scope.app.insureGlobal.timesbehavior.endFormat = $scope.app.insureGlobal.minTimeFormat(nowDate.getTime());

             return {
             startFormat: $scope.app.insureGlobal.timesbehavior.startFormat,
             endFormat: $scope.app.insureGlobal.timesbehavior.endFormat,
             id:id
             };
             };

             $scope.app.insureGlobal.timeCalculate = function (timeItem) {
             var nowDate = new Date();
             var perDate = new Date();
             //今天
             if (timeItem.id == "today") {
             perDate.setFullYear(nowDate.getFullYear());
             perDate.setMonth(nowDate.getMonth());
             perDate.setDate(nowDate.getDate());
             perDate.setHours(0);
             perDate.setMinutes(0);
             perDate.setSeconds(0);
             }

             //本周
             else if (timeItem.id == "week") {
             var day = nowDate.getDay();
             perDate.setFullYear(nowDate.getFullYear());
             perDate.setMonth(nowDate.getMonth());
             perDate.setDate(nowDate.getDate() - day + 1);
             perDate.setHours(0);
             perDate.setMinutes(0);
             perDate.setSeconds(0);

             nowDate.setDate(nowDate.getDate() + (7 - day));
             nowDate.setHours(23);
             nowDate.setMinutes(59);
             nowDate.setSeconds(59);
             }

             //最近一小时
             else if (timeItem.id == "latestHour") {
             perDate.setTime(nowDate.getTime() - 1000 * 60 * 60);
             }

             //最近一天
             else if (timeItem.id == "latestDay") {
             perDate.setTime(nowDate.getTime() - 1000 * 60 * 60 * 24);
             }

             //最近一周
             else if (timeItem.id == "latestWeek") {
             perDate.setTime(nowDate.getTime() - 1000 * 60 * 60 * 24 * 7);
             }

             //最近一月
             else if (timeItem.id == "latestMonth") {
             perDate.setTime(nowDate.getTime() - 1000 * 60 * 60 * 24 * 30);
             }

             //最近一年
             else if (timeItem.id == "latestYear") {
             perDate.setTime(nowDate.getTime() - 1000 * 60 * 60 * 24 * 365);
             }
             //昨天同一时刻最近一小时
             else if (timeItem.id == "yesterdayLatestHour") {
             perDate.setFullYear(nowDate.getFullYear());
             perDate.setMonth(nowDate.getMonth());
             perDate.setDate(nowDate.getDate());
             perDate.setHours(0);
             perDate.setMinutes(0);
             perDate.setSeconds(0);
             perDate.setTime(perDate.getTime() - 1000 * 60 * 60 * 24);
             nowDate.setTime(nowDate.getTime() - 1000 * 60 * 60 * 24);
             }
             else {
             perDate.setTime($scope.app.insureGlobal.times.custom.startTime);
             nowDate.setTime($scope.app.insureGlobal.times.custom.endTime);
             }

             $scope.app.insureGlobal.times.startFormat = $scope.app.insureGlobal.minTimeFormat(perDate.getTime());
             $scope.app.insureGlobal.times.endFormat = $scope.app.insureGlobal.minTimeFormat(nowDate.getTime());

             return {
             startFormat: $scope.app.insureGlobal.times.startFormat,
             endFormat: $scope.app.insureGlobal.times.endFormat
             };
             };*/


            //注册事件修改默认kpi事件
            $scope.$on('modify_insure_global_default_kpi_event', function (event, data) {
                $scope.app.insureGlobal.kpis.default = data;
            });


// save settings to local storage
            if (angular.isDefined($localStorage.settings)) {
                $scope.app.settings = $localStorage.settings;
            }
            else {
                $localStorage.settings = $scope.app.settings;
            }

            $scope.$watch('app.settings', function () {
                if ($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
                    // aside dock and fixed must set the header fixed.
                    $scope.app.settings.headerFixed = true;
                }
                // save to local storage
                $localStorage.settings = $scope.app.settings;
            }, true);

// angular translate
//         $scope.lang = {isopen: false};
//         $scope.langs = {en: 'English', de_DE: 'German', it_IT: 'Italian', zh_CN: '中文'};
//         $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
//         $scope.setLang = function (langKey, $event) {
//             // set the current lang
//             $scope.selectLang = $scope.langs[langKey];
//             // You can change the language during runtime
//             $translate.use(langKey);
//             $scope.lang.isopen = !$scope.lang.isopen;
//         };


            function isSmartDevice($window) {
                // Adapted from http://www.detectmobilebrowsers.com
                var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
                // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
                return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
            }

            window.timeCheck = function (dp) {
                // $(this).popover('hide')
                var nowLong = new Date().getTime();
                var longTime = nowLong - (1000 * 60 * 60 * 24 * 365);
                var _3yearsLong = 3 * 365 * 24 * 60 * 60 * 1000;
                var startTime = new Date(dp.cal.getNewDateStr()).getTime()
                var diff = nowLong - startTime;
                if (diff > _3yearsLong) {
                    //提示并将时间改回来
                    $(this).popover('show')
                    this.value = new Date(longTime).format('yyyy/MM/dd');
                }
            }
            window.isVip_begin = function (beginTimeId, endTimeId, maxDate, dateFmt) {
                if (user.isVip == '1') {
                    WdatePicker({el: beginTimeId, maxDate: '#F{$dp.$D(' + endTimeId + ');}', dateFmt: dateFmt})
                } else {
                    WdatePicker({
                        el: beginTimeId,
                        maxDate: '#F{$dp.$D(' + endTimeId + ');}',
                        dateFmt: dateFmt,
                        onpicked: timeCheck
                    })
                }
            }

            window.isVip_end = function (beginTimeId, endTimeId, maxDate, dateFmt) {
                if (user.isVip == '1') {
                    WdatePicker({
                        el: endTimeId,
                        minDate: '#F{$dp.$D(' + beginTimeId + ');}',
                        maxDate: maxDate,
                        dateFmt: dateFmt
                    })
                } else {
                    WdatePicker({
                        el: endTimeId,
                        minDate: '#F{$dp.$D(' + beginTimeId + ');}',
                        maxDate: maxDate,
                        dateFmt: dateFmt
                    })
                }
            }
        }]);

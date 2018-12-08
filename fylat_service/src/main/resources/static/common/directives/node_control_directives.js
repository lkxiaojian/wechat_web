var mapsNone = false;

app.directive('btnCommon', ['userMenu', 'userMenuService', '$rootScope', '$state', '$cookieStore', function (userMenu, userMenuService, $rootScope, $state, $cookieStore) {
    return {
        restrict: 'AE',
        link: function (scope, element, attrs) {
            var existMenu = {};
            if ($cookieStore.get("urlMap")) {
                existMenu = $cookieStore.get("urlMap");
            }else {
                existMenu = userMenuService.getuserMenu().result.urlMap;
                $cookieStore.put("urlMap", existMenu);
            }

            var curUrl = $state.current.name;
            var deep = curUrl.split(".").length
            var newUrl = curUrl + '_' + attrs.routeFlag;
            var flag = true;
            var isHaveNode = function (url) {
                if (existMenu[url] == 1){
                    flag = false;
                }
            }
            var isHaveAccess = function() {
                optDom(flag);
            }
            var optDom = function(flag) {
                if(attrs.btnFlag == 'a' || attrs.btnFlag == 'span') {
                    if (flag) {
                        //element.css({'display':'none'});
                        //element.css({'pointer-events':'none', 'color':'#666'});
                        element.html("");
                        element.removeAttr("class");
                    } else {
                        //element.css({'pointer-events':'auto', 'color':'#428bca'});
                    }
                } else if (attrs.btnFlag == 'remove') {
                    if (flag) {
                        element.remove();
                    }
                } else if (attrs.btnFlag == 'a-del') {
                    if (flag) {
                        element.css({'pointer-events':'none', 'color':'#666'});
                    } else {
                        //element.css({'pointer-events':'auto', 'color':'red'});
                    }
                } else if (attrs.btnFlag == 'img') {
                    if (flag) {
                        element.css('pointer-events','none');
                    } else {
                        element.css('pointer-events','auto');
                    }
                } else if (attrs.btnFlag == 'disable') {
                    if (flag) {
                        element.attr('disabled',true);
                    } else {
                        element.attr('disabled',false);
                    }
                } else if (attrs.btnFlag == 'button' || attrs.btnFlag == 'input' || attrs.btnFlag == 'div') {
                    if (flag) {
                        element.hide();
                    } else {
                        element.show();
                    }
                } else if (attrs.btnFlag == 'select') {
                    if (flag) {
                        element.attr('disabled', true);
                    } else {
                        element.attr('disabled', false);
                    }
                } else if (attrs.btnFlag == 'radio-world-map') {
                    if (flag) {
                        element.hide();
                        scope.getMapData('china');
                        mapsNone = true;
                    } else {
                        element.show();
                    }
                } else if (attrs.btnFlag == 'radio-china-map') {
                    if (flag) {
                        element.hide();
                        if (!mapsNone) {
                            scope.getMapData('world');
                        } else {//当世界和中国都被禁用时的情景
                            $("#mapData").hide();
                            $("#mapTableData").hide();
                        }
                    } else {
                        element.show();
                    }
                }
            }
            isHaveNode(newUrl);
            isHaveAccess();

            $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
                flag = true;
                newUrl = toState.name + '.' + attrs.routeFlag;
                isHaveNode(newUrl);
                isHaveAccess();
            });
        }
    };
}]);
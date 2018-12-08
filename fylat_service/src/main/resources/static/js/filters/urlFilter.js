'use strict';

angular.module("app")
    .filter('urlFilter', function () {
        return function (curActionUrl, urlMap) {
            var flag = false;
            if (urlMap && urlMap[curActionUrl] == 1) {
                flag = true;
            }
            return flag;
        }
    })
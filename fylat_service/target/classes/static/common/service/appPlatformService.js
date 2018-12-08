/**
 * 页面对象数据传递时，桥梁对象
 */
app.value('rowData',[]);

/*
 * opt:{
 * 	tip:提示文字，
 * 	type:提示类型,
 * 	duration:自动关闭的时间,
 * 	callback:关闭之后的回调,
 * }
 * */
app.factory('modalTip',['$modal','$timeout',function($modal,$timeout){
	return function(opt){
		$modal.open({
			template:'<div class="alert alert-'+(opt.type?'success':'warning')+' m-b-none">'+opt.tip+'</div>',
			backdrop:false,
			controller:function($scope, $modalInstance){
				var timer=$timeout(function(){
					$modalInstance.close();
					opt.callback&&opt.callback();
					$timeout.cancel(timer);
				},opt.duration?opt.duration:1500);
			}
		});
	}
}]);


/**
 * 查询后台用户功能数据
 */
app.service("userMenuService", ['$http',function ($http) {
	this.getUserMenu = function() {
		var promise = $http({url: 'user/menu'});
		return promise.then(function(obj){
			return obj.data;
		});
	};
}]);
/**
 * 缓存功能数据
 */
var cacheMeuns = {items : {}}
app.factory('menus',[function(){
	return cacheMeuns;
}]);

app.factory('userMenu',['menus',function(menus){

	return {
		get : function(){
			return menus.items;
		},
		put : function(user_menu){
			menus.items = user_menu;
		}
	};
}]);

/**
 * 国际化过滤器
 */
app.factory('switchLang', ['$translate', function($translate) {
    var switchLang = {
        switchLang:function(key) {
            if(key){
                return $translate.instant(key);
            }
            return key;
        }
    };
    return switchLang;
}]);



/*app.service('userMenuService', ['$http', '$q', function ($http, $q) {
	return {
		getUserMenu : function() {
			var deferred = $q.defer();
			$http({method: 'GET', url: 'user/menu'}).
			success(function(data, status, headers, config) {
				deferred.resolve(data);
			}).
			error(function(data, status, headers, config) {
				deferred.reject(data);
			});
			return deferred.promise;
		}
	};
}]);*/
app.value('titleObj', {curTime:'',parmHour:'',pastHourEnd:'',pastHourStart:'',curApp:'',appId:''});
app.constant('apvb_KpiService2', {name: "分组名称", page_view: "浏览量", unique_visitor: "用户数", newunique_visitor: "新用户数",
	visit: "访问次数", avg_resp_time: "平均响应时间", apdex: "访问体验（apdex）", err_rate: "错误率"});

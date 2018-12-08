angular.module('app')
  .directive('uiNavMenu', [
      function () {
        return {
          	restrict: 'EA',
  		  	scope : true,
  			controller: ['$scope','$element','$attrs','$compile',function ( $scope, $element, $attrs,$compile ) {
				//生成模版
				$scope.makeTemplateString = function() {
  					var groups = $scope.insuregroups;
					var templateString = '' ;
					for(var i = 0 ;i < groups.length; i++)
					{
						var menus = groups[i].menus;
						templateString += '<li class="hidden-folded padder m-t m-b-sm text-muted text-xs"><span translate="'+ groups[i].groupName +'"></span></li>';
						for(var j = 0 ;j<menus.length; j++)
						{
							var menu = menus[j];
							templateString +='<li>';
							templateString +='<a href class="auto">';      
	     					templateString +='<span class="pull-right text-muted">';
	       					templateString +='<i class="fa fa-fw fa-angle-right text"></i>';
	       				 	templateString +='<i class="fa fa-fw fa-angle-down text-active"></i>';
	      				  	templateString +='</span>';
	     				   	templateString +='<i class="glyphicon glyphicon-stats icon text-primary-dker"></i>';
	     				   	templateString +='<span class="font-bold" translate="'+menu.name+'"></span>';
	    					templateString +='</a>';
	   					 	templateString +='<ul class="nav nav-sub dk">';
	   					 	templateString +='<li class="nav-sub-header">';
	    					templateString +='<a href>';
	       					templateString +='<span translate="'+menu.name+'"></span>';
	      				 	templateString +='</a>';
							templateString +='</li>';
							var submenus = menu.submenus;
							for(var k = 0 ; k < submenus.length; k ++)
							{
								var submenu = submenus[k];
      						  		templateString +='<li ui-sref-active="active">';
       					   	  	  	templateString +='<a ui-sref="'+submenu.href+'">';
          					  	  	templateString +='<span>'+submenu.name+'</span>';
        					  	  	templateString +='</a>';
      						  	  	templateString +='</li>';
							}
							templateString += "</ul>";
							templateString += "</li>";
						}
					}
  					 return templateString;
  				  };
				
				//查找容器
  				$scope.findWidgetContainer = function(element) {
  						return element.find('.nav');
  					  };				
				
				//编译
  				$scope.compileTemplate = function() {
  					var container = $scope.findWidgetContainer($element);
  					var templateString = $scope.makeTemplateString();
  					var widgetElement = angular.element(templateString);

  					container.empty();
  					container.append(widgetElement);
  					$compile(widgetElement)($scope);
  				};	
  		}],
  		link: function(scope, el, attr) {
			scope.compileTemplate();
         }
        }
      }
    ] );
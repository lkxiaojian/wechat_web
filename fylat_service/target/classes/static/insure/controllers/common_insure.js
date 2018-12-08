/**
 * 地图弹出框
 */
app.controller('mapAddressController', ['$scope','$modalInstance','$http', '$filter', 'esriMapService','items',
    function($scope, $modalInstance,  $http, $filter, esriMapService,items) {
        require(["esri/toolbars/draw","esri/graphic","esri/symbols/SimpleLineSymbol"],
            function (Draw, Graphic, SimpleLineSymbol) { });
        $scope.selected = null;
        var drawTool,symbol;
        $scope.$on('map-load', function(data) {
            var nT = $("#mapModel").offset().top;
            var winHeight = $(window).height();
            if( nT > winHeight*0.7){
                nT = nT/3
            }
            var left = $("#mapModel").offset().left*2;
            nT = (nT < 200 ? 260 : nT);
            var mapH = winHeight - nT;
            var mapW = $(window).width() -left-50;
            //alert("winH="+$(window).height()+",mapH="+mapH+",nt="+nT);
            //var vph = 530;
            //var vpw = 1260;
            esriMapService.setMapExtent({"xmin":76.70556640625,"ymin":21.68701190625,"xmax":132.07666015625,"ymax":46.29638690625},3);
            esriMapService.resizeDiv(mapH,mapW);

            drawTool = new esri.toolbars.Draw(esriMapService.mapInstance);
            drawTool.on("draw-end", function(evtObj){
                var extentJson = evtObj.geometry.toJson();
                $scope.selected = '{"xmin":'+extentJson.xmin+',"ymin":'+extentJson.ymin+',"xmax":'+extentJson.xmax+',"ymax":'+extentJson.ymax+'}';
                esriMapService.mapInstance.graphics.clear();
                drawTool.deactivate();

                var graphic = new esri.Graphic(evtObj.geometry, symbol);
                esriMapService.mapInstance.graphics.add(graphic);
            });
            symbol = new esri.symbol.SimpleLineSymbol();
            symbol.setColor(new dojo.Color([ 252, 4, 12, 0.6 ]));
            symbol.width = 3;

        });

        $scope.clipExtent = function() {
            drawTool.activate(esri.toolbars.Draw.EXTENT);
        }

        $scope.ok = function () {
            $modalInstance.close($scope.selected);
        };
        $scope.cancel = function () {
            //$modalInstance.dismiss('cancel');
            if(esriMapService.mapInstance.loaded){
                esriMapService.mapInstance.graphics.clear();
            }
        };
    }]);

/**
 * 文件上传
 */
app.controller('upLoadController', ['$scope', 'FileUploader', function( $scope, FileUploader) {

    //可以在这个构造参数上加不同的属性，参看源代码，默认提交到后台的文件字段是"file"
    var uploader = $scope.uploader = new FileUploader({
        url: 'insure/fileUpload'
    });
    // a sync filter
    uploader.filters.push({
        name: 'syncFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
            console.log('syncFilter');
            return this.queue.length < 10;
        }
    });

    // an async filter
    uploader.filters.push({
        name: 'asyncFilter',
        fn: function(item /*{File|FileLikeObject}*/, options, deferred) {
            console.log('asyncFilter');
            setTimeout(deferred.resolve, 1e3);
        }
    });

    //事件回调
    uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function(addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function(item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function(fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function(progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function(fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function(fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function(fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function() {
        console.info('onCompleteAll');
    };
    console.info('uploader', uploader);

    /*$scope.getDownload = function(){
        window.open('export?project_id=1232&rule_names=aadsf');
    }

    $scope.postDownload = function(){
        $http({
            url: 'insure/export_dt',
            method: "POST",
            data: $.param({
                project_id : "123324",
                content: {}
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            responseType: 'arraybuffer'
        }).success(function (data, status, headers, config) {
            var blob = new Blob([data], {type: "application/octet-stream"});
            saveAs(blob, [headers('Content-Disposition').replace(/attachment;fileName=/,"")]);
        }).error(function (data, status, headers, config) {
            //upload failed
        });
    }*/
}]);

app.controller('insureCtrl', ['$http', '$scope', '$filter', '$cookieStore', '$state', 'titleObj', function($http, $scope, $filter, $cookieStore, $state, titleObj) {

    /*$scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

        /!*if(toState.isSearch){
            $scope.isSearch = true
        }else{
            $scope.isSearch = false
        }*!/
        toState.searchTime ? $scope.searchTime = true : $scope.searchTime = false;
        var pageTitle = toState.pageTitle;
        if (pageTitle) {
            $scope.pageTitle = pageTitle;
        }


    });*/


    //初始化应用列表
    /*$scope.insureApp = {sel:{}, cols:[]};
    $http({
        url:'user/app'
    }).success(function(data) {
        if (data.code == 0) {
            var appList = data.result, ids = '';
            for (var i = 0; i < appList.length; i++) {
                ids = ids + ',' + appList[i].id;
                $scope.insureApp.cols.push({id:appList[i].id, name:appList[i].name});
            }
            ids = ids.substr(1);
            $scope.insureApp.cols.splice(0, 0, {id:ids, name:'全部'});
            $scope.insureApp.sel = $scope.insureApp.cols[0];
        }
    });*/
    /*if ($cookieStore.get('user')) {
        var appList = $cookieStore.get('user').appList, ids = '';
        $scope.cloudApp = [];
        for (var i = 0; i < appList.length; i++) {
            ids = ids + ',' + appList[i].id;
            $scope.cloudApp.push({id:appList[i].id, name:appList[i].name});
        }
        ids = ids.substr(1);
        $scope.cloudApp.splice(0, 0, {id:ids, name:'全部'});
        //初始化当前应用
        $scope.curApp = '全部';
        //初始化隐藏模型变量appId
        $scope.appId = ids;

        //初始化全局变量title对象
        titleObj.curApp = $scope.curApp;
        titleObj.appId = $scope.appId;
    } else {
        $state.go('applogin');
    }*/
}]);

//状态改变时保存状态对象
app.controller('titleCtrl', ['$scope', '$filter', 'titleObj', function($scope, $filter, titleObj) {
    $scope.$watch('parmHour', function(newV, oldV) {
        if(newV !== oldV){
            titleObj.curTime = $scope.curTime;
            titleObj.parmHour = $scope.parmHour;

            var today = new Date();
            titleObj.pastHourEnd = $filter('date')(today, 'y-MM-dd HH:mm');
            today.setHours(today.getHours() - Number(titleObj.parmHour.replace('h', '')));
            titleObj.pastHourStart = $filter('date')(today, 'y-MM-dd HH:mm');
        }
    });
    $scope.$watch('appId', function(newV, oldV) {
        if(newV !== oldV){
            titleObj.curApp = $scope.curApp;
            titleObj.appId = $scope.appId;
        }
    });
}]);

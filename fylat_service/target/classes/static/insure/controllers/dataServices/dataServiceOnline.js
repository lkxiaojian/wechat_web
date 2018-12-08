//数据服务在线服务
app.controller('onlineController', ['$scope', 'esriMapService', '$http', '$filter', '$compile', 'insureUtil','typhoonService','switchLang','modalTip',
    function ($scope, esriMapService, $http, $filter, $compile, insureUtil,typhoonService, switchLang, modalTip) {

        /*******************向导****************************/
        var tour = new Tour({
            storage: false, //相关可选项目值：window.localStorage(缺省), window.sessionStorage ，false　或者自定义obj

            template: '<div class="popover text-blue" role="tooltip">' +
            '<div class="arrow"></div> ' +
            '<h3 class="popover-title"></h3> ' +
            '<div class="popover-content"></div> ' +
            '<div class="popover-navigation"> ' +
            '   <div class="btn-group"> ' +
            '       <button class="btn btn-sm btn-default text-blue" data-role="prev">&laquo;'+switchLang.switchLang("app.tour.prev")+'</button> ' +//Prev
            '       <button class="btn btn-sm btn-default text-blue" data-role="next">'+switchLang.switchLang("app.tour.next")+'&raquo;</button> ' + //Next
            '       <button class="btn btn-sm btn-default text-blue" data-role="pause-resume" data-pause-text="Pause" data-resume-text="Resume">Pause</button> ' +
            '       <button class="btn btn-sm btn-default text-blue" data-role="end">'+switchLang.switchLang("app.tour.end")+'</button>' +
            '   </div> ' +
            '</div> ' +
            '</div>',
            steps:[
                {placement:"bottom",element:'#beginBtn'
                    ,backdrop:true,title:switchLang.switchLang("app.tour.title"),content:switchLang.switchLang("app.tour.input_click")
                    ,onNext:function(tour){
                        //console.dir(tour)
                        $scope.$apply(function(scope){
                            if(scope.isCollapsed){
                                scope.isCollapsed=!scope.isCollapsed;
                            }
                        });
                    }
                },
                {placement:"top",element:'#satellite'
                    ,backdrop:true ,title:switchLang.switchLang("app.tour.title"),content:switchLang.switchLang("app.tour.satellite_click")
                    ,onNext:function(tour){
                        $scope.$apply(function(scope){
                            scope.tab(1)
                        });
                    }
                },
                {placement:"left",element:'#typhoonInfoTable'
                    ,backdrop:true,title:switchLang.switchLang("app.tour.title"),content:switchLang.switchLang("app.tour.typhoon_check"),orphan:true
                    ,onNext:function(tour){
                        $scope.$apply(function(scope){
                            scope.mapOnlineObj.typhoonInfoInstance.bootstrapTable('check', 1);
                        });
                    }
                },
                {placement:"left",element:'#mapID'
                    ,title:switchLang.switchLang("app.tour.title"),content:switchLang.switchLang("app.tour.tphPoint_click")
                    ,onNext:function(tour){
                        var typhoonId = typhoonService.typhoonInfoIds.replace(/'/g, "");
                        typhoonService.bufferGraphics(typhoonService.moveParam.toPoint[typhoonId], 100,typhoonId)
                    }
                },
                {placement:"left",element:'#mapID'
                    ,title:switchLang.switchLang("app.tour.title"),content:switchLang.switchLang("app.tour.station_analysis")
                    ,onNext:function(tour){
                        $scope.$apply(function(scope){
                            scope.mapOnlineObj.typ_stationId = "59107";
                            var feature = scope.mapOnlineObj.featureType_station ? scope.mapOnlineObj.featureType_station : 'win';
                            scope.mapOnlineObj.station_levl = '11';
                            //取到台风最后一个点的时间
                            var toPoint = typhoonService.moveParam.toPoint[typhoonService.typhoonInfoIds.replace(/'/g, "")];
                            $scope.mapOnlineObj.stationTime = toPoint.attributes.time;
                            scope.mapOnlineObj.typhoonSerialize(feature);
                        })
                    }
                },
                {placement:"left",element:'#mapID' ,title:switchLang.switchLang("app.tour.title"),content:switchLang.switchLang("app.tour.station_analysis")}
            ]
        });
        // Initialize the tour
        tour.init();
        // Start the tour
        tour.start();
        /*********************************************/

        $scope.app.settings.asideFolded = true;
        //获取window的宽高
        var winHeight = $(window).height();
        var winWidth = $(window).width();
        var queryTask, query, infoTemplate, symbol;
        //切换地图标签,同时关联过滤条件
        var searchFilterArray = ["site", "satellite", "grid"];
        $scope.tabs = [true, false, false];
        $scope.tab = function (index) {

            if(typhoonService.stationZoomEnd){
                typhoonService.stationZoomEnd.remove();
            }

            angular.forEach($scope.tabs, function (i, v) {
                $scope.tabs[v] = false;
            });
            $scope.tabs[index] = true;
            if (esriMapService.mapInstance.loaded) {
                esriMapService.mapInstance.graphics.clear();
                $scope.mapOnlineObj.stationGraphic.clear();
                //当选择的非台风时隐藏地图上的台风路径、台风站点、缓冲圈；切换到台风时再显示
                if (index != 1) {
                    if (typhoonService.tphStationLayer) {
                        typhoonService.tphStationLayer.clear();
                    }
                    if (typhoonService.tphGraphicsLayer) {
                        typhoonService.tphGraphicsLayer.clear();
                    }
                    if (typhoonService.tphBufferGraphic) {
                        typhoonService.tphBufferGraphic.clear();
                    }
                }
            }
            $scope.mapOnlineObj.searchFilter = searchFilterArray[index];
            /**
             * 目前只开发了台风模块，默认直接让它触发台风选项
             */
            if($scope.mapOnlineObj.satelliteOption=='typhoon'){

                $scope.mapOnlineObj.satelliteSelectChange('');
            }
            if (index == 2) {
                modalTip({
                    tip: switchLang.switchLang('common.tips.building'),
                    type: false
                })
            }
        };

        $scope.mapOnlineObj = {
            selectType: 'region',
            stationOption: 'tem',//默认选择为温度
            stationTime: '',//台风过境时间
            searchFilter: "site",//site，grid,satellite,
            stationType: "",//stateStation,autoStation
            satelliteOption: "typhoon",
            region: {selected: undefined},
            regionItems: [],
            xy: {},
            lastSelectStationType: '',//存储上次选择的站点类型
            resizeMapInvoke: {tag: false, currentLevel: "'11'"},
            stationFeature: {},//存放从后台取出的实况站点风温湿降水值
            resizeMap: function (item) {
                var adcode99 = item.adcode99;

                $http({
                    url: 'orderData/getProvinceBoundary',
                    method: 'GET',
                    params: {
                        view: 'select',
                        provinceId: adcode99
                    }
                }).success(function (data) {
                    if (data && data.result) {
                        var geoRes = data.result.geometry;
                        var recRes = data.result.rectangle;
                        if (geoRes && recRes) {
                            var geoObject = eval('('+geoRes+')');
                            var geometryArr = geoObject.geometry;
                            var rectangleObject = eval('('+recRes+')');
                            var rectangle = rectangleObject.rectangle;
                            /**
                             * 1，根据四角坐标查询站点
                             * 2，构造geometry对象 ；
                             * 2，传给addLineGeometry()，该方法接收一个geometry对象，然后设置线符号，再添加到graphics图层上；
                             */
                            if (esriMapService.mapInstance.loaded) {
                                //清除之前的图形
                                if (esriMapService.mapInstance.graphics) {
                                    esriMapService.mapInstance.graphics.clear();
                                }

                                var polygon = new esri.geometry.Polygon(esriMapService.mapInstance.spatialReference);
                                for (var i=0; i<geometryArr.length; i++) {
                                    var singleGeo = geometryArr[i];
                                    polygon.addRing(singleGeo);
                                }
                                $scope.mapOnlineObj.xy = rectangle;
                                $scope.mapOnlineObj.provincePolygon = polygon;
                                //将新的省边界添加到图层上
                                esriMapService.addLineGeometry(polygon);
                                esriMapService.leftToExtent($scope.mapOnlineObj.xy.xmin, $scope.mapOnlineObj.xy.ymin, $scope.mapOnlineObj.xy.xmax, $scope.mapOnlineObj.xy.ymax, 5);

                                if ($scope.mapOnlineObj.stationType && $scope.mapOnlineObj.region.selected) {
                                    //根据从库里取出的四角坐标请求站点
                                    $scope.mapOnlineObj.loadStation();
                                }
                            }
                        }
                    }
                })
            },
            stationGraphic: new esri.layers.GraphicsLayer({id: "stationLayer"}),
            //当选中二级站点时提示正在建设中
            stationSelectChange : function () {
                if(this.stationType && this.region.selected &&
                    this.xy.xmin && this.xy.xmax && this.xy.ymin && this.xy.ymax){
                    // esriMapService.selAreaDraw2(this.xy.xmin, this.xy.ymin, this.xy.xmax, this.xy.ymax);

                    this.loadStation();

                    // esriMapService.addLineGeometry(this.provincePolygon);
                    var zoom = esriMapService.mapInstance.getZoom() ? esriMapService.mapInstance.getZoom() : 5;
                    var flag;
                    //选择的区域没有变化，只是切换了一级／二级站点时，取消自适应
                    if ($scope.mapOnlineObj.lastSelectStationType && $scope.mapOnlineObj.lastSelectStationType != this.stationType) {
                        flag = true;
                    }
                    esriMapService.leftToExtent(this.xy.xmin, this.xy.ymin, this.xy.xmax, this.xy.ymax, zoom, flag);
                }
                $scope.mapOnlineObj.lastSelectStationType = this.stationType;
            },
            loadStation: function () {
                $scope.isCollapsed = !$scope.isCollapsed;
                this.resizeMapInvoke.tag = true;
                var url = "weatherData/stationSelect?view=select"
                if (this.stationType == 'autoStation') {
                    url = "weatherData/autoStationSelect?view=select"
                }
                $http({
                    method: 'POST',
                    url: url,
                    data: $scope.mapOnlineObj.xy
                }).success(function (data) {
                    $scope.mapOnlineObj.stationGraphic.clear();
                    dojo.forEach(data.result, function (station) {
                        var stationPoint = esriMapService.getPointByCoords(station.lon, station.lat);
                        if ($scope.mapOnlineObj.provincePolygon && $scope.mapOnlineObj.provincePolygon.contains(stationPoint)) {
                            //graphic.setInfoTemplate(infoTemplate);
                            var pictureType = station.station_levl=='14'? "pointPicture2" : "pointPicture";
                            symbol = esriMapService.getSymbolByType(pictureType);

                            var stationGraphic = new esri.Graphic(stationPoint, symbol);
                            stationGraphic.setAttributes(station);
                            $scope.mapOnlineObj.stationGraphic.add(stationGraphic);
                            if ($scope.mapOnlineObj.stationType == 'stateStation') {
                                var textSymbol = new esri.symbol.TextSymbol(station.station_name, new esri.symbol.Font(), new dojo.Color([255, 126, 0]));
                                textSymbol.setOffset(30, -6);
                                var textGraphic = new esri.Graphic(stationPoint, textSymbol);
                                $scope.mapOnlineObj.stationGraphic.add(textGraphic);
                            }
                        }
                    });
                    $scope.mapOnlineObj.resizeMapInvoke.tag = false;
                })
            },

            typhoonInfoFun: function(){
                this.typhoonInfoTable = typhoonService.typhoonInfoTableBak(function(){
                    var tableRef ={
                        typhoonInfo : $scope.mapOnlineObj.typhoonInfoInstance,
                        typhoonPath : $scope.mapOnlineObj.typhoonPathTableInstance
                    }
                    return tableRef;
                })
            },
            typhoonPathFun: function(){
                this.typhoonPathTable= typhoonService.typhoonPathTableBak;
            },
            tabClick : function(featureType){
                this.featureType = featureType;
                this.typhoonSerialize(featureType)
            },
            tabClick_station : function (featureType) {
              this.featureType_station = featureType;
                this.stationLatest(featureType);
            },
            stationLatest: function (feature) {
                var longSTime = new Date().getTime() - (24 * 60 * 60 * 1000);
                var sTime = new Date(longSTime).format("yyyy/MM/dd hh:mm:ss");
                var eTime = new Date().format("yyyy/MM/dd hh:mm:ss");

                $http({
                    method: 'POST',
                    url: 'weatherData/getLatestFeatureHour?view=select',
                    data: {
                        stationId: $scope.mapOnlineObj.station_stationid,
                        feature: feature,
                        sTime: sTime,
                        eTime: eTime,
                        stationType : $scope.mapOnlineObj.stationType
                    }
                }).success(function (data) {
                    var res = data.result;
                    if (res) {
                        var latestHour = res.latestHour, latest1Day = res.latest1day;
                        if (latestHour) {
                            var lon = latestHour.lon;
                            var lat = latestHour.lat;
                            var alti = latestHour.alti;
                            // console.dir('lon->'+lon+';lat->'+lat+';alti->'+alti);

                            var title = latestHour.station_name + ' 经纬度:' + lon + ',' + lat
                                + ' 海拔:' + alti + 'm '
                                + insureUtil.dateToString(new Date(latestHour.datetime), 'yyyy/MM/dd hh:mm:ss'); //+ switchLang.switchLang("weatherService.onlineStationTitle");
                            angular.element("#stationDialog_online").dialog("open");
                            angular.element("#stationDialog_online").dialog("option", "title", title);
                            angular.element("#stationDialog_online").dialog( "option", "position", { my: "right center",at: "right-30 center", of: window } );
                            $scope.mapOnlineObj.stationFeature = {
                                tem : latestHour.tem,
                                tem_max : latestHour.tem_max,
                                tem_min : latestHour.tem_min,
                                win_s_2mi_avg : latestHour.win_s_avg_2mi,
                                win_s_max : latestHour.win_s_max,
                                rhu : latestHour.rhu,
                                rhu_min : latestHour.rhu_min,
                                pre : latestHour.pre_1h
                            }
                        }
                        //画趋势图
                        if (latest1Day && latest1Day.length > 0) {
                            var unit = '', featureSet = {};
                            var legend = {
                                data : []
                            };
                            var xAxis = [
                                {
                                    type : 'category',
                                    data : []
                                }
                            ];
                            var yAxis = [
                                {
                                    type : 'value'
                                }
                            ];
                            var series = [];

                            //设置x轴的值和featureSet对象
                            for (var i = 0; i < latest1Day.length; i++) {
                                var d = insureUtil.dateToString(new Date(latest1Day[i]['datetime']), "yyyy/MM/dd hh:mm");
                                xAxis[0].data.push(d);
                                var featureObj = latest1Day[i];
                                var index = 0;
                                angular.forEach(featureObj, function (val, key) {
                                    if (index >= 3) {
                                        if (null == featureSet[key]) {
                                            featureSet[key] = [];
                                        }
                                        featureSet[key].push(parseFloat(featureObj[key]));
                                    }
                                    index++;
                                })
                            }
                            //设置图例对象和series对象
                            for (var f in featureSet) {
                                legend.data.push(switchLang.switchLang('site.' + f.toUpperCase()));
                                var s = {
                                    name: switchLang.switchLang('site.' + f.toUpperCase()),
                                    type: 'line',
                                    data: featureSet[f],
                                    markPoint : {//标注
                                        data : [
                                            {type : 'max', name: '最大值'},
                                            {type : 'min', name: '最小值'}
                                        ]
                                    },
                                    markLine : {//标注线
                                        data : [
                                            {type : 'average', name: '平均值'}
                                        ]
                                    }
                                }
                                series.push(s);
                            }
                            var stationObj = {xAxis: xAxis, yAxis: yAxis, series: series, legend: legend};
                            //设置y轴的单位
                            if (feature == 'tem') {
                                unit = '(°C)';
                                $scope.temData_station_online = stationObj;
                            } else if (feature == 'win') {
                                unit = '(m／s)';
                                $scope.winData_station_online = stationObj;
                            } else if (feature == 'rhu') {
                                unit = '(%)';
                                $scope.rhuData_station_online = stationObj;
                            } else if (feature == 'pre') {
                                unit = '(mm)';
                                $scope.preData_station_online = stationObj;
                            }
                            yAxis[0].name = switchLang.switchLang('site.' + feature.toUpperCase()) + unit;
                        }
                    }
                })
            },
            typhoonSerialize : function(featureType){
                var time = new Date(Date.parse($scope.mapOnlineObj.stationTime));
                var sTime = time.setHours(time.getHours() - 12);
                sTime = new Date(sTime).format('yyyy/MM/dd hh:mm:ss');
                time = new Date(Date.parse($scope.mapOnlineObj.stationTime));
                var eTime = time.setHours(time.getHours() + 12);
                eTime = new Date(eTime).format('yyyy/MM/dd hh:mm:ss');

                /*console.log("stationId="+$scope.mapOnlineObj.typ_stationId+";feature="+featureType+
                    ';sTime='+sTime+';eTime='+eTime+';station_levl='+ $scope.mapOnlineObj.station_levl);*/
                $http({
                    method: 'POST',
                    url: 'weatherData/getLatestFeatureHour?view=select',
                    data: {
                        stationId: $scope.mapOnlineObj.typ_stationId,
                        feature: featureType,
                        sTime: sTime ,
                        eTime: eTime,
                        isLatestHour: false,
                        station_levl : $scope.mapOnlineObj.station_levl
                    }
                }).success(function (data) {
                    var markPointData = {}, unit = '', featureSet = {};;
                    var res = data.result;
                    if (res && res.latest1day && res.latest1day.length > 0) {
                        var title = '';
                        //设置图名称
                        if (res.latest1day[0]) {
                            title = res.latest1day[0]['station_name'] + sTime + '--' + eTime
                                + switchLang.switchLang('site.' + $scope.mapOnlineObj.stationOption.toUpperCase());
                        }
                        angular.element( "#dialog" ).dialog( "open" );
                        angular.element( "#dialog" ).dialog( "option", "title", title );
                        angular.element("#dialog").dialog( "option", "position", { my: "right center",at: "right-30 center", of: window } );
                        // console.log(tph._24hTphPointsTimes.length);

                        var legend = {
                            data : []
                        };
                        var xAxis = [
                            {
                                type : 'category',
                                data : []
                            }
                        ];
                        var yAxis = [
                            {
                                type : 'value'
                            }
                        ];
                        var series = [];

                        //设置x轴标注并构造featureSet对象
                        for (var i = 0; i < res.latest1day.length; i++) {
                            var d = insureUtil.dateToString(new Date(res.latest1day[i]['datetime']), "yyyy/MM/dd hh:mm");
                            xAxis[0].data.push(d);
                            var featureObj =res.latest1day[i];
                            var index = 0;
                            angular.forEach(featureObj,function(val,key){
                                if( index >= 3 ){
                                    for (var i=0; i<tph._24hTphPointsTimes.length; i++) {
                                        var dataObj = {};
                                        if (insureUtil.stringToDate(tph._24hTphPointsTimes[i], 'yyyy/MM/dd hh:mm').getTime() == featureObj.datetime){
                                            dataObj.name = "台风经过时刻值";
                                            dataObj.value = featureObj[key];
                                            dataObj.xAxis = tph._24hTphPointsTimes[i];
                                            dataObj.yAxis = featureObj[key];
                                            if (null == markPointData[key]) {
                                                markPointData[key] = [];
                                            }
                                            markPointData[key].push(dataObj);
                                        }
                                    }
                                    if (null == featureSet[key]) {
                                        featureSet[key] = [];
                                    }
                                    // featureSet[key].push(featureObj[key]);
                                    featureSet[key].push(parseFloat(featureObj[key]));
                                    featureSet[key].markPoint = {
                                        data: markPointData[key]
                                    }
                                }
                                index++;
                            })
                        }
                        //设置图例对象和series对象
                        for (var f in featureSet) {
                            legend.data.push(switchLang.switchLang('site.' + f.toUpperCase()));
                            var s = {
                                name: switchLang.switchLang('site.' + f.toUpperCase()),
                                type: 'line',
                                data: featureSet[f],
                                markPoint : featureSet[f].markPoint
                            }
                            series.push(s);
                        }
                        var stationObj = {xAxis: xAxis, yAxis: yAxis, series: series, legend: legend};
                        //设置y轴的单位
                        if (featureType == 'tem') {
                            unit = '(°C)';
                            $scope.temData = stationObj;
                        } else if (featureType == 'win') {
                            unit = '(m／s)';
                            $scope.winData = stationObj;
                        } else if (featureType == 'rhu') {
                            unit = '(%)';
                            $scope.rhuData = stationObj;
                        } else if (featureType == 'pre') {
                            unit = '(mm)';
                            $scope.preData = stationObj;
                        }
                        yAxis[0].name = switchLang.switchLang('site.' + featureType.toUpperCase()) + unit;
                    }
                })
            },
            satelliteSelectChange: function (type) {
                if(this.searchFilter == "satellite" && this.satelliteOption=='typhoon'){
                    if($scope.mapOnlineObj.typhoonInfoInstance){
                        $scope.mapOnlineObj.typhoonInfoInstance.bootstrapTable('refresh')
                    }
                    $scope.mapOnlineObj.typhoonInfoFun();
                    $scope.mapOnlineObj.typhoonPathFun();
                    typhoonService.clearMapGraphicInfo();

                    typhoonService.tphStationLayer.on("click", function (evt) {

                        var graphicAttr = evt.graphic.attributes;
                        // console.dir(graphicAttr);
                        if (graphicAttr && graphicAttr.station_id_d) {
                            $scope.mapOnlineObj.stationTime = graphicAttr.time;
                            $scope.mapOnlineObj.typ_stationId = graphicAttr.station_id_d;
                            $scope.mapOnlineObj.station_levl = graphicAttr.station_levl;
                            var featureType = $scope.mapOnlineObj.featureType ? $scope.mapOnlineObj.featureType : "win";
                            if ($scope.mapOnlineObj.stationTime) {
                                $scope.mapOnlineObj.typhoonSerialize(featureType)
                            }
                        }
                    })
                }else if (this.searchFilter == "satellite" && this.satelliteOption !='typhoon'){
                    //提示正在建设中
                    modalTip({
                        tip: switchLang.switchLang('common.tips.building'),
                        type: false
                    })
                }
            },
            selectStationById: function () {
                $http({
                    method: 'GET',
                    url: 'weatherData/getstationbyid',
                    params: {
                        view: 'select',
                        stationId: $scope.mapOnlineObj.inputStationId
                    }
                }).success(function (data) {
                    var res = data.result;
                    if (res.length > 0) {
                        $scope.stationsInfo.data = res;
                        $scope.stationsInfo.id = 'station_id_d';
                        $scope.stationsInfo.name = 'station_name';
                    }
                })
            },
            selectProvince : function () {
                $http({
                    method: 'GET',
                    url: 'orderData/provinceSelect',
                    params: {
                        view: 'select'
                    }
                }).success(function (data) {
                    var res = data.result;
                    if (res) {
                        angular.forEach(res, function (val, k) {
                            res[k].name99 = switchLang.switchLang(val.name99);
                        });
                        $scope.mapOnlineObj.regionItems = res;
                    }
                })
            }
        }
        $scope.stationsInfo = {};
        $scope.stationsInfo.formatter = function(data){
            return data.station_name + '(' + data.station_id_d + ')';
        }
        $scope.stationsInfo.callback = function (data) {
            esriMapService.mapInstance.graphics.clear();
            var stationPoint = esriMapService.getPointByCoords(data.lon, data.lat);

            var pictureType = data.station_levl=='14'? "pointPicture2" : "pointPicture";
            var symbol = esriMapService.getSymbolByType(pictureType);

            var stationGraphic = new esri.Graphic(stationPoint, symbol);
            stationGraphic.setAttributes(data);
            if ($scope.mapOnlineObj.stationGraphic) {
                $scope.mapOnlineObj.stationGraphic.clear();
                var textSymbol = new esri.symbol.TextSymbol(data.station_name, new esri.symbol.Font(), new dojo.Color([255, 126, 0]));
                textSymbol.setOffset(30, -6);
                var textGraphic = new esri.Graphic(stationPoint, textSymbol);
                $scope.mapOnlineObj.stationGraphic.add(textGraphic);
                $scope.mapOnlineObj.stationGraphic.add(stationGraphic);

                var xmin = data.lon - 3, xmax = data.lon + 3;
                var ymin = data.lat - 3, ymax = data.lat + 3;
                esriMapService.leftToExtent(xmin, ymin, xmax, ymax, 7);
            }
        }
        $scope.mapOnlineObj.selectProvince();

        $scope.$on('map-load', function (data) {
            esriMapService.mapInstance.setMapCursor("pointer");
            var vph = $(window).height() - 80;
            var vpw = $(window).width() - 10;
            esriMapService.resizeDiv(vph, vpw);
            esriMapService.setMapExtent({
                "xmin":72.9921875,"ymin":24.1699220625,"xmax":136.6689453125,"ymax":54.448242375
            }, 3);

            //为站点增加一个GraphicLayer对象
            esriMapService.mapInstance.addLayer($scope.mapOnlineObj.stationGraphic);
            $scope.mapOnlineObj.stationGraphic.on("click", function (eventObj) {
                //console.log(eventObj);
                var graphicAttr = eventObj.graphic.attributes;
                var point = eventObj.mapPoint;
                //取站点最近一小时数据并展示最近24小时趋势图
                if (graphicAttr && graphicAttr.station_id_d) {
                    $scope.mapOnlineObj.station_stationid = graphicAttr.station_id_d;
                    var feature = $scope.mapOnlineObj.featureType_station ? $scope.mapOnlineObj.featureType_station : 'win';
                    //获取站点最近一小时数据和最近24小时趋势图
                    $scope.mapOnlineObj.stationLatest(feature);
                }
            });
            esriMapService.mapInstance.on('zoom-end', function (obj) {
                //console.dir(obj)
                if ($scope.mapOnlineObj.selectType == 'region') {
                    var level = obj.level;
                    if (level < 5) {
                        $scope.mapOnlineObj.xy.station_levl = "'11'"
                        $scope.mapOnlineObj.xy.maplevel = "less5";
                    } else if (level >= 5 && level < 6) {
                        $scope.mapOnlineObj.xy.station_levl = "'11','12'"
                        $scope.mapOnlineObj.xy.maplevel = "less8";
                    }else if (level >= 6 && level < 8) {
                        $scope.mapOnlineObj.xy.station_levl = "'11','12','13'"
                        $scope.mapOnlineObj.xy.maplevel = "less8";
                    } else if (level >= 8  && level < 10) {
                        $scope.mapOnlineObj.xy.station_levl = "'11','12','13'"
                        $scope.mapOnlineObj.xy.maplevel = "less10";
                    }else if (level >= 10  && level < 12) {
                        $scope.mapOnlineObj.xy.station_levl = "'11','12','13'"
                        $scope.mapOnlineObj.xy.maplevel = "less12";
                    }else if (level >= 12) {
                        $scope.mapOnlineObj.xy.station_levl = "'11','12','13'"
                        $scope.mapOnlineObj.xy.maplevel = "more12";
                    }
                    if($scope.mapOnlineObj.searchFilter == "site" &&  $scope.mapOnlineObj.stationType=='stateStation'){
                        if (!$scope.mapOnlineObj.resizeMapInvoke.tag && $scope.mapOnlineObj.resizeMapInvoke.currentLevel != $scope.mapOnlineObj.xy.station_levl
                            && $scope.mapOnlineObj.xy.xmin && $scope.mapOnlineObj.xy.ymin
                            && $scope.mapOnlineObj.xy.xmax && $scope.mapOnlineObj.xy.ymax) {

                            $scope.mapOnlineObj.resizeMapInvoke.currentLevel = $scope.mapOnlineObj.xy.station_levl;
                            $scope.mapOnlineObj.loadStation();
                        }
                    }else if($scope.mapOnlineObj.searchFilter == "site" &&  $scope.mapOnlineObj.stationType=='autoStation'){
                        if(!$scope.mapOnlineObj.resizeMapInvoke.tag && $scope.mapOnlineObj.resizeMapInvoke.currentLevel != $scope.mapOnlineObj.xy.maplevel
                            && $scope.mapOnlineObj.xy.xmin && $scope.mapOnlineObj.xy.ymin
                            && $scope.mapOnlineObj.xy.xmax && $scope.mapOnlineObj.xy.ymax){

                            $scope.mapOnlineObj.resizeMapInvoke.currentLevel = $scope.mapOnlineObj.xy.maplevel;
                            $scope.mapOnlineObj.loadStation();
                        }
                    }
                }
            });
        });



        angular.element( "#dialog" ).dialog({
            autoOpen: false,
            width:  winWidth * 0.46,
            height : winHeight * 0.6
        });
        angular.element( "#stationDialog_online" ).dialog({
            autoOpen: false,
            width:  winWidth * 0.46,
            height : winHeight * 0.69
        });
        $scope.queryTask = function () {


        }

        //跳转到其他页面时关闭折线图弹出框
        $scope.$on('$stateChangeStart', function (evt, toState, toParams, fromState, fromParams) {
            angular.element( "#dialog" ).dialog( "close" );
            angular.element("#dialog").dialog( "destroy" );

            angular.element('#stationDialog_online').dialog("close");
            angular.element('#stationDialog_online').dialog("destroy");
            tour.end();
        })
      //指标与帮助信息对应-名词解释
        $scope.targetHelpMsg = {
            //平均温度
            "TEM_Avg": "指某一段时间内，各次观测的气温值的算术平均值。通常通过气温的平均情况来表达气温一段时间内的状况。",
            //最高温度
            "TEM_Max": "指某一段时间内的气温最高值。",
            //最低温度
            "TEM_MIN": "指某一段时间内的气温最低值。",

            //俩分钟最大风速
            "WIN_S_2MI_AVG": "指给定某一段时间内的瞬时风速的最大值，瞬时风速指3秒钟平均风速。一天的极大风速就在这一天内瞬时（一般是指1s）风速的最大值，极大风速是个瞬时值。在指定的同一时段内，绝大部分情况下极大风速大于最大风速。",
            //最大风速
            "WIN_S_MAX": "指某一段时间内的10分钟平均风速的最大值。挑取一天最大风速就是在这一天内任意的10分钟平均值的最大者为日最大风速，最大风速是个平均值。",

            //平均湿度
            "RHU_AVG": "指某一段时间内，各次观测的相对湿度的算术平均值。",
            //最小湿度
            "RHU_MIN": "指某一段时间内的相对湿度最小值。",

            //降水量: PRE_1H
            "PRE_1H": "指从天空降落到地面上的液态或固态（经融化后）水，未经蒸发、渗透、流失，而在水平面上积聚的深度。降水量以mm为单位，气象观测中取一位小数。"
        };
        

    }]);

app.controller('digitalEarthController', ['$scope', '$http', '$filter',  'insureUtil','switchLang',
    function ($scope, $http, $filter,  insureUtil, switchLang) {



}]);

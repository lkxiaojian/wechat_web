//数据服务站点历史数据
app.controller('historyController', ['$scope', '$state', 'typhoonHistoryService', 'esriMapService', '$http', '$filter', '$compile', 'insureUtil', '$sessionStorage', 'switchLang', 'modalTip',
    function ($scope, $state, typhoonHistoryService, esriMapService, $http, $filter, $compile, insureUtil, $sessionStorage, switchLang, modalTip) {

        /**********************向导**********************/
        var historyTour = new Tour({
            storage: false,
            template: '<div class="popover text-blue" role="tooltip">' +
            '<div class="arrow"></div> ' +
            '<h3 class="popover-title"></h3> ' +
            '<div class="popover-content"></div> ' +
            '<div class="popover-navigation"> ' +
            '   <div class="btn-group"> ' +
            '       <button class="btn btn-sm btn-default text-blue" data-role="prev">&laquo;'+switchLang.switchLang("app.tour.prev")+'</button> ' +//Prev
            '       <button class="btn btn-sm btn-default text-blue" data-role="next">'+switchLang.switchLang("app.tour.next")+'&raquo;</button> ' + //Next
            '       <button class="btn btn-sm btn-default text-blue" data-role="pause-resume" data-pause-text="Pause" data-resume-text="Resume">Pause</button> ' +
            '       <button class="btn btn-sm btn-default text-blue" data-role="end">'+switchLang.switchLang("app.tour.end")+'</button> ' + //End tour
            '   </div> ' +
            '</div> ' +
            '</div>',
            steps: [
                {placement:"bottom",element:'#beginBtn'
                    ,backdrop:true,title:switchLang.switchLang("app.tour.title"),content:switchLang.switchLang("app.tour.input_click")
                    ,onNext:function(historyTour){
                        $scope.$apply(function(scope){
                            if(scope.isCollapsed){
                                scope.isCollapsed=!scope.isCollapsed;
                            }
                        });
                    }
                },
                {placement:"top",element:'#satellite'
                    ,backdrop:true ,title:switchLang.switchLang("app.tour.title"),content:switchLang.switchLang("app.tour.satellite_click")
                    ,onNext:function(historyTour){
                        $scope.$apply(function(scope){
                            scope.tab(1)
                        });
                    }
                },
                {placement:"top", element:'#satellite'
                    ,backdrop:true ,title:switchLang.switchLang("app.tour.title"),content:switchLang.switchLang("app.tour.tphMonitor_click")
                    ,onNext:function(historyTour){
                        $scope.$apply(function(scope){
                            scope.mapHistoryObj.satelliteOption = 'typhoon';
                            scope.mapHistoryObj.satelliteSelectChange(7);
                        });
                    }
                },
                {placement:"top", element:'#typhoonSelect'
                    ,backdrop:true ,title:switchLang.switchLang("app.tour.title"),content:switchLang.switchLang("app.tour.tphAdvance")
                    ,onNext:function(historyTour){
                        $scope.$apply(function(scope){
                            scope.mapHistoryObj.typhoonAdvanceSearch = 1;
                            $("#typhoonAdvance").addClass("active");
                        });
                    }
                },
                {placement:"top", element:'#typhoonSelect'
                    ,backdrop:true ,title:switchLang.switchLang("app.tour.title"),content:switchLang.switchLang("app.tour.tphAdvanceParams")
                    ,onNext:function(historyTour){
                        $scope.$apply(function(scope){
                        });
                    }
                },
                {placement:"left", element:'#analysis'
                    ,backdrop:true ,title:switchLang.switchLang("app.tour.title"),content:switchLang.switchLang("app.tour.analysis_click")
                    ,onNext:function(historyTour){
                        $scope.$apply(function(scope){
                            var queryParameter = {
                                endTime: "2017/06/16",
                                powerMax: "30",
                                powerMin: "0",
                                speedMax: "95",
                                speedMin: "0",
                                startTime : "2016/06/16",
                                xmax: '',
                                xmin: '',
                                ymax: '',
                                ymin: ''
                            };
                            typhoonHistoryService.advanceSearch(queryParameter)
                            $("#typhoonAdvance").removeClass("active");
                            $("#typhoonAdvanceButton").addClass("active");
                        })
                    }
                },
                {placement:"left",element:'#typhoonInfo'
                    ,backdrop:true,title:switchLang.switchLang("app.tour.title"),content:switchLang.switchLang("app.tour.typhoon_check"),orphan:true
                    ,onNext:function(historyTour){
                         $scope.$apply(function(scope){
                              scope.mapHistoryObj.typhoonInfoInstance.bootstrapTable('check', 6);
                         });
                    }
                },
                {placement:"left",element:'#mapID'
                    ,title:switchLang.switchLang("app.tour.title"),content:switchLang.switchLang("app.tour.tphPoint_click")
                    ,onNext:function(historyTour){
                        var typhoonId = typhoonHistoryService.typhoonInfoIds.replace(/'/g, "");
                        typhoonHistoryService.bufferGraphics(typhoonHistoryService.moveParam.toPoint[typhoonId], 100,typhoonId)
                    }
                },
                {placement:"left",element:'#mapID'
                    ,title:switchLang.switchLang("app.tour.title"),content:switchLang.switchLang("app.tour.station_analysis")
                    ,onNext:function(historyTour){
                        $scope.$apply(function(scope){
                            scope.mapHistoryObj.typhoonStationId = "59102";
                            var feature = scope.mapHistoryObj.featureType_station ? scope.mapHistoryObj.featureType_station : 'win';
                            scope.mapHistoryObj.station_levl = '11';
                            scope.mapHistoryObj.typhoonHistorySerialize(feature);
                        })
                    }
                },
                {placement:"left",element:'#mapID' ,title:switchLang.switchLang("app.tour.title"),content:switchLang.switchLang("app.tour.station_analysis")}
            ]
        })
        historyTour.init();
        historyTour.start();
        /*************************向导结束********************/

        $scope.app.settings.asideFolded = true;
        //获取window的宽高
        var winHeight = $(window).height();
        var winWidth = $(window).width();

        //切换地图标签,同时关联过滤条件
        var queryTask, query, infoTemplate, symbol;
        symbol = esriMapService.getSymbolByType("pointPicture");
        var searchFilterArray = ["site", "satellite", "grid"];
        $scope.tabs = [true, false, false];
        $scope.tab = function (index) {
            if(tphHistorty.stationZoomEnd){
                tphHistorty.stationZoomEnd.remove();
            }
            angular.forEach($scope.tabs, function (val, k) {
                $scope.tabs[k] = false;
            });
            $scope.tabs[index] = true;
            if (esriMapService.mapInstance.loaded) {
                esriMapService.mapInstance.graphics.clear();
                $scope.mapHistoryObj.stationGraphic.clear();

                //当选择的非台风时隐藏地图上的台风路径、台风站点、缓冲圈；切换到台风时再显示
                if (index != 1) {
                    if (tphHistorty.tphStationLayer) {
                        tphHistorty.tphStationLayer.clear();
                    }
                    if (tphHistorty.tphBufferGraphic) {
                        tphHistorty.tphBufferGraphic.clear();
                    }
                    if (tphHistorty.typhoonTableInstance.typhoonInfo) {
                        tphHistorty.typhoonTableInstance.typhoonInfo.bootstrapTable('refresh');
                    }
                }
            }
            $scope.mapHistoryObj.searchFilter = searchFilterArray[index];
            if (index == 2) {
                modalTip({
                    tip: switchLang.switchLang('common.tips.building'),
                    type: false
                })
            }

        }
        var longTime = new Date().getTime() - (1000 * 60 * 60 * 24 * 365);
        $scope.mapHistoryObj = {
            selectType: 'region',
            stationStartTime: insureUtil.dateToString(new Date(longTime), "yyyy/MM/dd"),
            stationEndTime: insureUtil.dateToString(new Date(), 'yyyy/MM/dd'),
            stationOption: 'tem',//默认选择为温度
            satelliteOption: 'fire',//默认选择为火点
            stationType: '',//stateStation,autoStation
            searchFilter: "site",//site，grid,satellite,
            region: {selected: undefined},
            regionItems: [],
            xy: {},
            lastSelectStationType: '',//存储上次选择的站点类型
            cityItems: [],
            countryItems: [],
            resizeMapInvoke: {tag: false, currentLevel: "'11'"},
            showTyphoonAdvance: false,//是否显示台风高级查询框
            /*stationClick: function () {
                //console.log($scope.mapHistoryObj.stationOption);
                this.stationSerialize($scope.mapHistoryObj.stationId, $scope.mapHistoryObj.stationOption);
            },*/
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
                                $scope.mapHistoryObj.xy = rectangle;
                                $scope.mapHistoryObj.provincePolygon = polygon;
                                //将新的省边界添加到图层上
                                esriMapService.addLineGeometry(polygon);
                                esriMapService.leftToExtent($scope.mapHistoryObj.xy.xmin, $scope.mapHistoryObj.xy.ymin, $scope.mapHistoryObj.xy.xmax, $scope.mapHistoryObj.xy.ymax, 5);

                                if ($scope.mapHistoryObj.stationType && $scope.mapHistoryObj.region.selected) {
                                    //根据从库里取出的四角坐标请求站点
                                    $scope.mapHistoryObj.loadStation();
                                }
                            }
                        }
                    }
                })
            },
            stationGraphic: new esri.layers.GraphicsLayer({id: "stationLayer"}),
            loadStation: function () {
                $scope.isCollapsed = !$scope.isCollapsed;
                this.resizeMapInvoke.tag = true;
                var url = 'weatherData/stationSelect?view=select';
                if (this.stationType == 'autoStation') {
                    url = "weatherData/autoStationSelect?view=select"
                }
                $http({
                    method: 'POST',
                    url: url,
                    data: $scope.mapHistoryObj.xy
                }).success(function (data) {
                    $scope.mapHistoryObj.stationGraphic.clear();
                    dojo.forEach(data.result, function (station) {
                        var stationPoint = esriMapService.getPointByCoords(station.lon, station.lat);
                        if ($scope.mapHistoryObj.provincePolygon.contains(stationPoint)) {
                            var pictureType = station.station_levl=='14'? "pointPicture2" : "pointPicture";
                            symbol = esriMapService.getSymbolByType(pictureType);
                            var stationGrephic = new esri.Graphic(stationPoint, symbol);
                            stationGrephic.setAttributes(station);
                            $scope.mapHistoryObj.stationGraphic.add(stationGrephic);
                            if ($scope.mapHistoryObj.stationType == 'stateStation') {
                                var textSymbol = new esri.symbol.TextSymbol(station.station_name, new esri.symbol.Font(), new dojo.Color([255, 255, 255]));
                                textSymbol.setOffset(30, -6);
                                var textGraphic = new esri.Graphic(stationPoint, textSymbol);
                                $scope.mapHistoryObj.stationGraphic.add(textGraphic);
                            }
                        }
                    })
                    $scope.mapHistoryObj.resizeMapInvoke.tag = false;
                })
            },
            typhoonInfoFun: function (pageSize) {
                this.typhoonInfoTable = typhoonHistoryService.typhoonInfoTable(pageSize, function (typhoonName) {
                    if (typhoonName) {
                        $scope.$applyAsync(function (scope) {
                            scope.mapHistoryObj.typhoonpathName = switchLang.switchLang(typhoonName.substring(0, typhoonName.length-2)) + '--';
                        })

                        /*$scope.$apply(function (scope) {
                            scope.mapHistoryObj.typhoonpathName = switchLang.switchLang(typhoonName.substring(0, typhoonName.length-2)) + '--';
                        })*/
                    }
                    var tableRef = {
                        typhoonInfo: $scope.mapHistoryObj.typhoonInfoInstance,
                        typhoonPath: $scope.mapHistoryObj.typhoonPathTableInstance
                    }
                    return tableRef;
                })
            },
            typhoonPathFun: function () {
                this.typhoonPathTable = typhoonHistoryService.typhoonPathTable;
            },
            satelliteSelectChange: function (pageSize) {
                if (this.searchFilter == "satellite" && $scope.mapHistoryObj.satelliteOption == 'typhoon') {
                    this.showTyphoonAdvance = true;
                    if ($scope.mapHistoryObj.typhoonInfoInstance) {
                        $scope.mapHistoryObj.typhoonInfoInstance.bootstrapTable('refresh')
                    }
                    if (!pageSize) {
                        pageSize = 5
                    }
                    $scope.mapHistoryObj.typhoonInfoFun(pageSize);
                    $scope.mapHistoryObj.typhoonPathFun();
                    typhoonHistoryService.clearMapGraphicInfo();
                    //click台风站点上显示站点的趋势图
                    typhoonHistoryService.tphStationLayer.on("click", function (evt) {
                        var graphicAttr = evt.graphic.attributes;
                        if (graphicAttr && graphicAttr.station_id_d) {
                            $scope.mapHistoryObj.typhoonStationId = graphicAttr.station_id_d;
                            $scope.mapHistoryObj.station_levl = graphicAttr.station_levl;
                            var featureType = $scope.mapHistoryObj.featureType ? $scope.mapHistoryObj.featureType : "win";
                            $scope.mapHistoryObj.typhoonHistorySerialize(featureType);
                        }
                    })
                }else {
                    //清除地图上的台风路径、台风站点、缓冲圈
                    esriMapService.mapInstance.graphics.clear();
                    if (tphHistorty.tphStationLayer) {
                        tphHistorty.tphStationLayer.clear();
                    }
                    if (tphHistorty.tphBufferGraphic) {
                        tphHistorty.tphBufferGraphic.clear();
                    }
                    modalTip({
                        tip: switchLang.switchLang('common.tips.building'),
                        type: false
                    })
                }
            },
            tabClick: function (featureType) {
                this.featureType = featureType;
                this.typhoonHistorySerialize(featureType)
            },
            //绘制台风站点趋势图
            typhoonHistorySerialize: function (featureType) {
                var params = {
                    stationId: $scope.mapHistoryObj.typhoonStationId,
                    feature: featureType,
                    startTime: angular.element('#start').val(),
                    endTime: angular.element('#end').val(),
                    station_levl : $scope.mapHistoryObj.station_levl
                };
                /*console.log("stationId="+$scope.mapHistoryObj.typhoonStationId+";feature="+featureType
                    + ';sTime='+angular.element('#start').val()+';eTime='+angular.element('#end').val()
                    + ';station_levl='+ $scope.mapHistoryObj.station_levl);*/
                $http({
                    method: 'POST',
                    url: 'weatherData/getHistoryFeature?view=select',
                    data : params
                }).success(function (data) {
                    var res = data.result;
                    if (res && res.length > 0) {
                        var title = '';
                        //设置图名称
                        if (res[0]) {
                            title = res[0]['station_name'] + insureUtil.dateToString(new Date(res[0]['datetime']), "yyyy/MM/dd") + '--'
                                + insureUtil.dateToString(new Date(res[res.length - 1]['datetime']), "yyyy/MM/dd")
                                +switchLang.switchLang('site.' + featureType.toUpperCase());
                        }
                        angular.element("#dialog_history").dialog("open");
                        angular.element("#dialog_history").dialog("option", "title", title);
                        angular.element("#dialog_history").dialog( "option", "position", { my: "right center",at: "right-30 center", of: window } );

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
                        //设置x轴标注和featureSet对象
                        for (var i = 0; i < res.length; i++) {
                            var d = insureUtil.dateToString(new Date(res[i]['datetime']), "yyyy/MM/dd");
                            xAxis[0].data.push(d);
                            var featureObj = res[i];
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
                        //设置图例名称和series对象
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
                        if (featureType == 'tem') {
                            unit = '(°C)';
                            $scope.temData_history = stationObj;
                        } else if (featureType == 'win') {
                            unit = '(m／s)';
                            $scope.winData_history = stationObj;
                        } else if (featureType == 'rhu') {
                            unit = '(%)';
                            $scope.rhuData_history = stationObj;
                        } else if (featureType == 'pre') {
                            unit = '(mm)';
                            $scope.preData_history = stationObj;
                        }
                        yAxis[0].name = switchLang.switchLang('site.' + featureType.toUpperCase()) + unit;
                    }
                })
            },
            typhoonAdvanceSearch: '0',
            advanceFun: function () {
                if (this.satelliteOption == 'typhoon' && this.typhoonAdvanceSearch == '1') {
                    this.advance = true;
                } else {
                    this.advance = false;
                }
            },
            tabClick_station: function (featureType) {
                this.station_featureType = featureType;
                this.stationSerialize(this.stationId, featureType);
            },
            //绘制站点趋势图
            stationSerialize : function (stationId, feature) {
                //请求站点要素数据
                var params = {
                    stationId: stationId,
                    feature: feature,
                    startTime: angular.element('#stationStart').val(),
                    endTime: angular.element('#stationEnd').val(),
                    stationType : $scope.mapHistoryObj.stationType
                };
                $http({
                    method: 'POST',
                    url: 'weatherData/getHistoryFeature?view=select',
                    data : params
                }).success(function (data) {
                    var xData = [], legendSet = [], unit = '', featureSet = {};
                    var res = data.result;
                    angular.element("#stationDialog").dialog("open");
                    if (res && res.length > 0) {
                        var title = '';
                        if (res[0]) {
                            title = res[0]['station_name'] + angular.element('#stationStart').val() + '--'
                                + angular.element('#stationEnd').val()
                                + switchLang.switchLang('site.' + feature.toUpperCase());
                        }
                        angular.element("#stationDialog").dialog("option", "title", title);
                        angular.element("#stationDialog").dialog( "option", "position", { my: "right center",at: "right-30 center", of: window } );

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

                        //设置x轴标注和featureSet对象
                        for (var i = 0; i < res.length; i++) {
                            var d = insureUtil.dateToString(new Date(res[i]['datetime']), "yyyy/MM/dd");
                            xAxis[0].data.push(d);
                            var featureObj = res[i];
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
                        //设置图例名称和series对象
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
                            $scope.temData_historyStation = stationObj;
                        } else if (feature == 'win') {
                            unit = '(m／s)';
                            $scope.winData_historyStation = stationObj;
                        } else if (feature == 'rhu') {
                            unit = '(%)';
                            $scope.rhuData_historyStation = stationObj;
                        } else if (feature == 'pre') {
                            unit = '(mm)';
                            $scope.preData_historyStation = stationObj;
                        }
                        yAxis[0].name = switchLang.switchLang('site.' + feature.toUpperCase()) + unit;
                    }
                })
            },
            stationSelectChange : function () {
                if(this.stationType && this.region.selected &&
                    this.xy.xmin && this.xy.xmax && this.xy.ymin && this.xy.ymax){
                    this.loadStation();
                    var zoom = esriMapService.mapInstance.getZoom() ? esriMapService.mapInstance.getZoom() : 5;
                    var flag;
                    //选择的区域没有变化，只是切换了一级／二级站点时，取消自适应
                    if ($scope.mapHistoryObj.lastSelectStationType && $scope.mapHistoryObj.lastSelectStationType != this.stationType) {
                        flag = true;
                    }
                    esriMapService.leftToExtent(this.xy.xmin, this.xy.ymin, this.xy.xmax, this.xy.ymax, zoom, flag);
                }
                $scope.mapHistoryObj.lastSelectStationType = this.stationType;
            },
            selectStationById: function () {
                $http({
                    method: 'GET',
                    url: 'weatherData/getstationbyid',
                    params: {
                        view: 'select',
                        stationId: $scope.mapHistoryObj.inputStationId
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
                        $scope.mapHistoryObj.regionItems = res;
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
            if ($scope.mapHistoryObj.stationGraphic) {
                $scope.mapHistoryObj.stationGraphic.clear();
                var textSymbol = new esri.symbol.TextSymbol(data.station_name, new esri.symbol.Font(), new dojo.Color([255, 126, 0]));
                textSymbol.setOffset(30, -6);
                var textGraphic = new esri.Graphic(stationPoint, textSymbol);
                $scope.mapHistoryObj.stationGraphic.add(textGraphic);
                $scope.mapHistoryObj.stationGraphic.add(stationGraphic);

                var xmin = data.lon - 0.1, xmax = data.lon + 2;
                var ymin = data.lat - 0.4, ymax = data.lat + 2;
                esriMapService.leftToExtent(xmin, ymin, xmax, ymax, 7);
            }
        }

        //省市县下拉框
        /*$scope.selectRegion = function (tag, regionId) {
            $http({
                method: 'GET',
                url: 'orderData/regionSelect',
                params: {
                    view: 'select',
                    regionId: regionId
                }
            }).success(function (data) {
                var result = data.result;
				angular.forEach(result, function (val, k) {
                    result[k].fullname = switchLang.switchLang(val.fullname);
                });
                if (tag == 'region') {
                    $scope.mapHistoryObj.regionItems = result;
                }
                else if (tag == 'city') {
                    $scope.mapHistoryObj.cityItems = result;
                } else if (tag == 'country') {
                    $scope.mapHistoryObj.countryItems = result;
                }
            })
        }
        $scope.selectRegion('region', '0');*/

        $scope.mapHistoryObj.selectProvince();

        $scope.$on('map-load', function (data) {
            esriMapService.mapInstance.setMapCursor("pointer");
            var vph = $(window).height() - 80;
            var vpw = $(window).width() - 10;
            esriMapService.resizeDiv(vph, vpw);
            esriMapService.setMapExtent({
                "xmin":72.9921875,"ymin":24.1699220625,"xmax":136.6689453125,"ymax":54.448242375
            }, 3);
            //为站点增加一个GraphicLayer对象
            esriMapService.mapInstance.addLayer($scope.mapHistoryObj.stationGraphic);

            //click站点弹出框
            $scope.mapHistoryObj.stationGraphic.on("click", function (eventObj) {
                var graphicAttr = eventObj.graphic.attributes;
                var feature = $scope.mapHistoryObj.station_featureType ? $scope.mapHistoryObj.station_featureType : 'win';
                var point = eventObj.mapPoint;
                if (graphicAttr && graphicAttr.station_id_d) {
                    $scope.mapHistoryObj.stationId = graphicAttr.station_id_d;
                    $scope.mapHistoryObj.stationSerialize(graphicAttr.station_id_d, feature);
                }
            });

            esriMapService.mapInstance.on('zoom-end', function (obj) {
                if ($scope.mapHistoryObj.selectType == 'region') {
                    if($scope.mapHistoryObj.searchFilter == "site"){
                        var level = obj.level;
                        if (level < 5) {
                            $scope.mapHistoryObj.xy.station_levl = "'11'"
                            $scope.mapHistoryObj.xy.maplevel = "less5";
                        } else if (level >= 5 && level < 6) {
                            $scope.mapHistoryObj.xy.station_levl = "'11','12'"
                            $scope.mapHistoryObj.xy.maplevel = "less8";
                        }else if (level >= 6 && level < 8) {
                            $scope.mapHistoryObj.xy.station_levl = "'11','12','13'"
                            $scope.mapHistoryObj.xy.maplevel = "less8";
                        }  else if (level >= 8  && level < 10) {
                            $scope.mapHistoryObj.xy.station_levl = "'11','12','13'"
                            $scope.mapHistoryObj.xy.maplevel = "less10";
                        }else if (level >= 10  && level < 12) {
                            $scope.mapHistoryObj.xy.station_levl = "'11','12','13'"
                            $scope.mapHistoryObj.xy.maplevel = "less12";
                        }else if (level >= 12) {
                            $scope.mapHistoryObj.xy.station_levl = "'11','12','13'"
                            $scope.mapHistoryObj.xy.maplevel = "more12";
                        }
                        if($scope.mapHistoryObj.stationType=='stateStation'){
                            if (!$scope.mapHistoryObj.resizeMapInvoke.tag && $scope.mapHistoryObj.resizeMapInvoke.currentLevel != $scope.mapHistoryObj.xy.station_levl
                                && $scope.mapHistoryObj.xy.xmin && $scope.mapHistoryObj.xy.ymin
                                && $scope.mapHistoryObj.xy.xmax && $scope.mapHistoryObj.xy.ymax) {

                                $scope.mapHistoryObj.resizeMapInvoke.currentLevel = $scope.mapHistoryObj.xy.station_levl;
                                $scope.mapHistoryObj.loadStation();
                            }
                        }else if($scope.mapHistoryObj.stationType=='autoStation'){
                            if(!$scope.mapHistoryObj.resizeMapInvoke.tag && $scope.mapHistoryObj.resizeMapInvoke.currentLevel != $scope.mapHistoryObj.xy.maplevel
                                && $scope.mapHistoryObj.xy.xmin && $scope.mapHistoryObj.xy.ymin
                                && $scope.mapHistoryObj.xy.xmax && $scope.mapHistoryObj.xy.ymax){

                                $scope.mapHistoryObj.resizeMapInvoke.currentLevel = $scope.mapHistoryObj.xy.maplevel;
                                $scope.mapHistoryObj.loadStation();
                            }
                        }
                    }
                }
            });
        });

        angular.element("#dialog_history").dialog({
            autoOpen: false,
            width: winWidth * 0.46,
            height: winHeight * 0.6
        });

        angular.element("#stationDialog").dialog({
            autoOpen: false,
            width: winWidth * 0.46,
            height: winHeight * 0.6
        })

        $scope.queryTask = function () {

        }
        //跳转到其他页面时关闭折线图弹出框
        $scope.$on('$stateChangeStart', function (evt, toState, toParams, fromState, fromParams) {
            angular.element("#dialog_history").dialog("close");
            angular.element("#stationDialog").dialog("close");
            angular.element("#dialog_history").dialog("destroy");
            angular.element("#stationDialog").dialog("destroy");
            historyTour.end();
        })
    }]);

//在dialog中画折线图
app.controller('history_stationzDialogController', ['$scope', '$sessionStorage', 'insureUtil', 'switchLang', function ($scope, $sessionStorage, insureUtil, switchLang) {
    var xData = [], legendSet = [], yAxisLabelFormatter = '', unit = '', featureSet = {};
    var res = $sessionStorage.stationData;
    var feature = $sessionStorage.feature;
    var width = $sessionStorage.width;
    var height = $sessionStorage.height;
    angular.element('#echartsContent').css('height', height);//element, name, value
    angular.element('#echartsContent').css('width', width);

    //设置y轴的单位
    if (feature.toLowerCase() == 'tem') {
        unit = '°C';
    } else if (feature.toLowerCase() == 'win') {
        unit = 'm／s';
    } else if (feature.toLowerCase() == 'rhu') {
        unit = '%';
    } else if (feature.toLowerCase() == 'pre') {
        unit = 'mm';
    }
    yAxisLabelFormatter = "{value}" + unit;

    //设置x轴标注和series值
    for (var i = 0; i < res.length; i++) {
        // console.log(res[i]);
        var d = insureUtil.dateToString(new Date(res[i]['datetime']), "yyyy/MM/dd");
        xData.push(d);
        var featureObj = JSON.parse(res[i][feature]);
        for (f in featureObj) {
            if (null == featureSet[f]) {
                featureSet[f] = [];
            }
            featureSet[f].push(featureObj[f]);
        }
    }

    //设置图例名称
    for (f in featureSet) {
        legendSet[f] = switchLang.switchLang('site.' + f.toUpperCase());
        // console.log(f+ ':' + featureSet[f]);
    }

    $scope.stationData = {
        xData: xData,
        featureSet: featureSet,
        legendSet: legendSet,
        yAxisLabelFormatter: yAxisLabelFormatter
    }
}]);

//台风精确信息分析
app.controller('history_typhoonzDialogController', ['$scope', '$http', 'typhoonHistoryService', 'esriMapService', 'insureUtil','switchLang',
    function ($scope, $http, typhoonHistoryService, esriMapService, insureUtil,switchLang) {

        var powerList = [];
        $scope.getList = function () {
            for (var k = 0; k < 31; k++) {
                powerList.push(k);
            }
        }

        $scope.getList();
        //省下拉框查询
        $scope.selectRegion = function (tag, regionId) {
            $http({
                method: 'GET',
                url: 'orderData/regionSelect',
                params: {
                    view: "select",
                    regionId: regionId
                }
            }).success(function (data) {
                angular.forEach(data.result, function (val, k) {
                    data.result[k].fullname = switchLang.switchLang(val.fullname);
                });
                $scope.typhoonObj.regionItems = data.result;
            })
        }
        $scope.selectRegion("region", '0');
        var longTime = new Date().getTime() - (1000 * 60 * 60 * 24 * 365)
        $scope.typhoonObj = {
            dataTimeStart: insureUtil.dateToString(new Date(longTime), "yyyy/MM/dd"),
            dataTimeEnd: insureUtil.dateToString(new Date(), "yyyy/MM/dd"),
            powerMin: {selected: undefined},
            powerMax: {selected: undefined},
            powerItems: powerList,
            region: {selected: undefined},
            regionItems: [],
            xy: {},
            getXy: function (region) {
                this.xy = esriMapService.areaXY[region.regionid];
            },
            searchTyphoon: function () {
                var queryParameter = {
                    startTime: angular.element('#start').val(),
                    endTime: angular.element('#end').val(),
                    speedMin: this.speedMin ? this.speedMin : '0',
                    speedMax: this.speedMax ? this.speedMax : '95',
                    powerMin: this.powerMin.selected ? this.powerMin.selected : '0',
                    powerMax: this.powerMax.selected ? this.powerMax.selected : '30',
                    xmin: this.xy.xmin ? this.xy.xmin : '',
                    xmax: this.xy.xmax ? this.xy.xmax : '',
                    ymin: this.xy.ymin ? this.xy.ymin : '',
                    ymax: this.xy.ymax ? this.xy.ymax : ''
                };
                $("#typhoonAdvance").removeClass("active");
                $("#typhoonAdvanceButton").addClass("active");
                typhoonHistoryService.advanceSearch(queryParameter)
            }
        }

    }])
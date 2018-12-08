var tph = {};
app.factory("typhoonService", ['$http', '$filter', 'esriMapService', 'insureUtil','switchLang',
    function ($http, $filter, esriMapService, insureUtil, switchLang) {
    tph.tphGraphicsLayer = null;
    tph.tphBufferGraphic = null;
    tph.tphStationLayer = null;
    tph._24hTphPointsTimes = [];//存储趋势图上需要标注的时间点，从moveParam.typhoonGraphic获取的
    tph.init = function () {

        var extent = esriMapService.getMapExtent(105.2041015625, 3.6254884687499995, 164.7939453125, 33.90380878125);
        esriMapService.mapInstance.setExtent(extent, true);
        tph.tphBufferGraphic = new esri.layers.GraphicsLayer();
        tph.tphGraphicsLayer = new esri.layers.GraphicsLayer();
        tph.tphStationLayer = new esri.layers.GraphicsLayer();

        esriMapService.mapInstance.addLayer(tph.tphBufferGraphic);
        esriMapService.mapInstance.addLayer(tph.tphGraphicsLayer);
        esriMapService.mapInstance.addLayer(tph.tphStationLayer);
        tph.tphGraphicsLayer.on("mouse-over", function (evt) {
            var g = evt.graphic;
            var point = evt.mapPoint;
            if (g.attributes && g.infoTemplate) {
                esriMapService.showInfoWindow(point, g.getTitle(), g.getContent(), 330, 260)
            }
        })
        esriMapService.mapInstance.graphics.on("mouse-over", function (evt) {
            var g = evt.graphic;
            var point = evt.mapPoint;
            if (g.attributes && g.infoTemplate) {
                //esriMapService.mapInstance.infoWindow.setContent(g.getContent());
                //esriMapService.mapInstance.infoWindow.setTitle(g.getTitle());
                //esriMapService.mapInstance.infoWindow.show(evt.screenPoint,esriMapService.mapInstance.getInfoWindowAnchor(evt.screenPoint));
                esriMapService.showInfoWindow(point, g.getTitle(), g.getContent(), 330, 400)
            }

            if (g.attributes && g.attributes.station_id_d) {
                $http({
                    method: 'GET',
                    url: 'weatherData/getLatestFeature',
                    params: {
                        view: "select",
                        stationId: g.attributes.station_id_d
                    }
                }).success(function (data) {
                    var res = data.result;
                    if (res) {

                        var dateTime = insureUtil.dateToString(new Date(res.datetime), "yyyy/MM/dd")

                        var content = '<div class="form-group">' +
                            ' <label class="col-sm-4 control-label font-bold">'+switchLang.switchLang("site.TEM")+'</label>' +
                            '<div class="col-sm-8">' +
                            '<div>'+switchLang.switchLang("site.TEM_Avg")+'：' + res.tem_avg + '°C</div>' +
                            '<div>'+switchLang.switchLang("site.TEM_Max")+'：' + res.tem_max + '°C</div>' +
                            '<div>'+switchLang.switchLang("site.TEM_MIN")+'：' + res.tem_min + '°C</div>' +
                            '</div>' +
                            '</div>' +
                            '<div class="line line-dashed b-b line-lg pull-in"></div>' +
                            '<div class="form-group">' +
                            ' <label class="col-sm-4 control-label font-bold">'+switchLang.switchLang("site.WIN")+'</label>' +
                            '<div class="col-sm-8">' +
                            '<div>'+switchLang.switchLang("site.WIN_S_2MI_AVG")+'：' + res.win_s_2mi_avg + switchLang.switchLang("common.unit.wind") + '</div>' +
                            '<div>'+switchLang.switchLang("site.WIN_S_MAX")+'：' + res.win_s_max + switchLang.switchLang("common.unit.wind") + '</div>' +
                            '</div>' +
                            '</div>' +
                            '<div class="line line-dashed b-b line-lg pull-in"></div>' +
                            '<div class="form-group">' +
                            ' <label class="col-sm-4 control-label font-bold">'+switchLang.switchLang("site.RHU")+'</label>' +
                            '<div class="col-sm-8">' +
                            '<div>'+switchLang.switchLang("site.RHU_AVG")+'：' + res.rhu_avg + '%</div>' +
                            '<div>'+switchLang.switchLang("site.RHU_MIN")+'：' + res.rhu_min + '%</div>' +
                            '</div>' +
                            '</div>' +
                            '<div class="line line-dashed b-b line-lg pull-in"></div>' +
                            '<div class="form-group">' +
                            ' <label class="col-sm-4 control-label font-bold">'+switchLang.switchLang("site.PRE")+'</label>' +
                            '<div class="col-sm-8">' +
                            '<div>'+switchLang.switchLang("site.PRE_TIME_2020")+'：' + res.pre_time_2020 + 'mm</div>' +
                            '</div>' +
                            '</div>';
                        esriMapService.showInfoWindow(point, dateTime + "--"+switchLang.switchLang("weatherService.onlineStationTitle")+":", content, 300, 300)
                    }
                })
            }
        })
        esriMapService.mapInstance.graphics.on("mouse-out", function (evt) {
            var g = evt.graphic;
            if (g.attributes && g.infoTemplate) {
                esriMapService.mapInstance.infoWindow.hide();
            }
        })

        esriMapService.mapInstance.graphics.on("click", function (evt) {
            var tempTimes = [];
            if(typeof(evt.graphic.attributes)!='undefined'){
                if(evt.graphic.geometry.type == 'point'){
                    var dataObj = evt.graphic.attributes;
                    tph.refersh(dataObj);
                }
            }
            if (evt.graphic.attributes && evt.graphic.attributes.typhoonId) {
                var allTphPathPoints = tph.typhoonData[evt.graphic.attributes.typhoonId];
                angular.forEach(allTphPathPoints, function (val, k) {
                    if (val && val.time ) {
                        var currentTime = new Date(Date.parse(evt.graphic.attributes.time));
                        var sTime = currentTime.setHours(currentTime.getHours() - 12);
                        currentTime = new Date(Date.parse(evt.graphic.attributes.time));
                        var eTime = currentTime.setHours(currentTime.getHours() + 12);
                        if (Date.parse(val.time) >= sTime && Date.parse(val.time) <= eTime) {
                            tph._24hTphPointsTimes.push(insureUtil.dateToString(new Date(val.time),'yyyy/MM/dd hh:mm'));
                        }
                    }
                })
                var point = evt.graphic.geometry;
                if(point.type=='point'){
                    var size = tph.getTphWindSize(evt.graphic.attributes.speed);
                    var paths1 = tph.getCircleLinePaths(point, size);
                    var polygon1 = new esri.geometry.Polygon(esriMapService.mapInstance.spatialReference);
                    polygon1.addRing(paths1);
                    tph.moveParam.circleGhBig[evt.graphic.attributes.typhoonId].setGeometry(polygon1);
                    tph.moveParam.circleGhSmall[evt.graphic.attributes.typhoonId].setGeometry(point);
                    if(tph.stationZoomEnd){
                        tph.stationZoomEnd.remove();
                    }
                    tph.bufferGraphics(evt.graphic, 100, evt.graphic.attributes.typhoonId)
                }
            }
        })

    }
    tph.refersh=function(typhoon){
        // 显示预警路径
        tph.showTphWarnTrack(typhoon);
        // 显示轨迹点信息
        //tph.showTphPointInfo(typhoon);
    }
    // 显示台风预警路径
    tph.showTphWarnTrack = function(typhoonPathObj){
        tph.tphGraphicsLayer.clear();
        var typhoonGraphicData = tph.moveParam.typhoonGraphic[typhoonPathObj.typhoonId];
        angular.forEach(typhoonPathObj.forecast,function(typhoonSubPath,key){
            var tphWarnTrackData = typhoonSubPath.forecastpoints;
            var orgnization = typhoonSubPath.tm;
            if(tphWarnTrackData!=null && tphWarnTrackData.length>0){
                var pathArray = null;
                for(var i=0; i<tphWarnTrackData.length; i++){
                    pathArray = [];
                    var item = tphWarnTrackData[i];
                    var point = esriMapService.getPointByCoords(item.lng, item.lat);
                    if(i < tphWarnTrackData.length-1){
                        var nextItem = tphWarnTrackData[i+1];
                        var nextPoint = esriMapService.getPointByCoords(nextItem.lng, nextItem.lat);

                        pathArray.push(point);
                        pathArray.push(nextPoint);

                        var line = new esri.geometry.Polyline(esriMapService.mapInstance.spatialReference);
                        line.addPath(pathArray);

                        var lineGraphic = new esri.Graphic(line, tph.getStateLineSymbol(orgnization), 2);
                        tph.tphGraphicsLayer.add(lineGraphic);
                        typhoonGraphicData.push(lineGraphic)
                    }
                    if(i > 0){
                        var pointGraphic = new esri.Graphic(point, tph.getPointSymbol(item.speed));
                        var infoTemplate = new esri.InfoTemplate(switchLang.switchLang("weatherService.forecastTitle"), tph.setForecastContext());
                        pointGraphic.setInfoTemplate(infoTemplate);
                        item.tm = switchLang.switchLang(orgnization);
                        pointGraphic.setAttributes(item);
                        tph.tphGraphicsLayer.add(pointGraphic);
                        typhoonGraphicData.push(pointGraphic)
                        //var textSymbol = new esri.symbol.TextSymbol(item.prediction+'小时', new esri.symbol.Font(), new dojo.Color([255, 126, 0]));
                        //textSymbol.setOffset(30, -6);
                        //var textGraphic = new esri.Graphic(point, textSymbol);
                        //tph.tphGraphicsLayer.add(textGraphic);

                    }
                }
            }
        })
    }
    tph.forecastContentFormat = function () {
        
    }
    tph.infoTemplateFormat = function (value, key, data) {
        switch (key) {
            case "speed":
                if (value) {
                    value = value + 'm/s';
                }else {
                    value = '-';
                }
                break;

            case "pressure":
                if (value) {
                    value = value + 'hpa';
                }else {
                    value = '-';
                }
                break;
        }
        return value;
    }
    tph.setForecastContext = function(){
        var content =
            '<div class="form-group">' +
            '<label class="col-sm-6 control-label font-bold">'+switchLang.switchLang("weatherService.forecastAgency")+':</label>' +
            '<div class="col-sm-6">' +
            '<div>${tm}</div>' +
            '</div>' +
            '</div>' +
            '<div class="line line-dashed b-b line-lg pull-in"></div>' +
            '<div class="form-group">' +
            '<label class="col-sm-6 control-label font-bold">'+switchLang.switchLang("weatherService.center")+':</label>' +
            '<div class="col-sm-6">' +
            '<div>${lng}°E|${lat}°N</div>' +
            '</div>' +
            '</div>' +
            '<div class="line line-dashed b-b line-lg pull-in"></div>' +
            '<div class="form-group">' +
            '<label class="col-sm-6 control-label font-bold">'+switchLang.switchLang("weatherService.arriveTime")+':</label>' +
            '<div class="col-sm-6">' +
            '<div>${time}</div>' +
            '</div>' +
            '</div>' +
            '<div class="line line-dashed b-b line-lg pull-in"></div>' +
            '<div class="form-group">' +
            '<label class="col-sm-6 control-label font-bold">'+switchLang.switchLang("weatherService.centerPressure")+':</label>' +
            '<div class="col-sm-6">' +
            '<div>${pressure: tph.infoTemplateFormat}</div>' +
            '</div>' +
            '</div>' +
            '<div class="line line-dashed b-b line-lg pull-in"></div>' +
            '<div class="form-group">' +
            '<label class="col-sm-6 control-label font-bold">'+switchLang.switchLang("weatherService.maxSpeed")+':</label>' +
            '<div class="col-sm-6">' +
            '<div>${speed: tph.infoTemplateFormat}</div>' +
            '</div>' +
            '</div>';
        return content;
    }
    tph.get = function (typhoonId) {
        return $http({
            method: 'GET',
            url: 'weatherData/getTyphoon2Map',
            params: {
                view: "select",
                typhoonIds: typhoonId
            }
        }).then(function (obj) {
            return obj.data.result;
        });
    };

    /**
     * 台风轨迹点数据
     */
    tph.typhoonData = {};

    tph.moveParam = {
        index: {},
        totlLength: {},
        fromPoint: {},
        toPoint: {},
        circleGhBig: {},
        circleGhSmall: {},
        circleGhBuffer:{},
        isMove: false,
        typhoonObj:{},
        typhoonGraphic: {} //该结构保存每个台风id及路径对应的每个数组
    };
    tph.playMovieInit = function (thphoonIds, checkTag, uncheckId) {
        var thphoonIdArray = thphoonIds.split(",");
        if (checkTag == "uncheck" || checkTag == "uncheckAll") {
            var uncheckIdArray = uncheckId.split(",");
            tph.uncheckTyphoon(uncheckIdArray)
        } else {
            for (var i = 0; i < thphoonIdArray.length; i++) {
                var typhoonId = thphoonIdArray[i].replace(/'/g, "");
                //tph.extent2AllGraphicsLayer(typhoonId);
                var typhoonGraphicCache = tph.moveParam.typhoonGraphic[typhoonId];
                if (!typhoonGraphicCache) {
                    var data = tph.typhoonData[typhoonId];
                    if (data != null || data.length > 0) {
                        tph.setPlayMovieText(false);
                        tph.moveParam.typhoonGraphic[typhoonId] = [];
                        var name = switchLang.switchLang(tph.moveParam.typhoonObj[typhoonId].typhoonName);
                        tph.playMovie(typhoonId,name);
                    }
                } else {
                    tph.checkTyphoon(typhoonGraphicCache)
                }
            }
        }
    }
    tph.uncheckTyphoon = function (thphoonIdArray) {
        for (var i = 0; i < thphoonIdArray.length; i++) {
            var typhoonId = thphoonIdArray[i];
            var typhoonGraphicArr = tph.moveParam.typhoonGraphic[typhoonId];
            for (var j = 0; typhoonGraphicArr && j < typhoonGraphicArr.length; j++) {
                typhoonGraphicArr[j].hide();
            }
        }
    }
    tph.checkTyphoon = function (typhoonGraphicArr) {
        for (var j = 0; j < typhoonGraphicArr.length; j++) {
            typhoonGraphicArr[j].show();
        }
    }
    // graphicsLayer 缩放到外包络范围（包括台风预警路径）
    tph.extent2AllGraphicsLayer = function (typhoonId) {
        var data = tph.typhoonData[typhoonId];
        if (data == null || data.length <= 0) return;
        var points = [];
        if (data != null && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                points.push(esriMapService.getPointByCoords(item.lng, item.lat));
            }
        }
        var line = new esri.geometry.Polyline(esriMapService.mapInstance.spatialReference);
        line.addPath(points);

        // 自适应范围
        var extent = line.getExtent();
        //var extent = esriMapService.getMapExtent(105.2041015625, 3.6254884687499995, 164.7939453125, 33.90380878125);
        esriMapService.mapInstance.setExtent(extent, true);
    }
// 清空所有地图标注
    tph.clearMapGraphicInfo = function () {
        //var count =0;
        //angular.forEach(tph.moveParam.typhoonGraphic, function (obj, key) {
        //    for(var j = 0; j < obj.length; j++){
        //        obj[j].hide();
        //    }
        //    count++;
        //})
        if (tph.tphGraphicsLayer && tph.tphGraphicsLayer.loaded) {
            tph.tphGraphicsLayer.clear();
            tph.tphBufferGraphic.clear();
            esriMapService.mapInstance.graphics.clear();
            if (tph.tphStationLayer) {
                tph.tphStationLayer.clear();
            }


            tph.moveParam.typhoonGraphic = {};
            tph.typhoonData={};
            tph.typhoonAfterTag = {};
            tph.moveParam = {
                index: {},totlLength: {},fromPoint: {},toPoint: {},circleGhBig: {},
                circleGhSmall: {},circleGhBuffer:{},isMove: false,typhoonObj:{},typhoonGraphic: {}
            };

        }
        tph.init()
    }
// 设置播放按钮文字
    tph.setPlayMovieText = function (state) {
        if (tph.typhoonData == null || tph.typhoonData.length <= 0)return;
        if (state) {
            tph.moveParam.isMove = false;
        } else {
            tph.moveParam.isMove = true;
        }
    }


//设置台风点文本内容
    tph.setTyphoonContext = function () {
        var content =
            '<div class="form-group">' +
            '<label class="col-sm-6 control-label font-bold">'+switchLang.switchLang("weatherService.center")+':</label>' +
            '<div class="col-sm-6">' +
            '<div>${lng}°E|${lat}°N</div>' +
            '</div>' +
            '</div>' +
            '<div class="line line-dashed b-b line-lg pull-in"></div>' +
            '<div class="form-group">' +
            '<label class="col-sm-6 control-label font-bold">'+switchLang.switchLang("weatherService.strength")+':</label>' +
            '<div class="col-sm-6">' +
            '<div>${strong}</div>' +
            '</div>' +
            '</div>' +
            '<div class="line line-dashed b-b line-lg pull-in"></div>' +
            '<div class="form-group">' +
            '<label class="col-sm-6 control-label font-bold">'+switchLang.switchLang("weatherService.maxSpeed")+':</label>' +
            '<div class="col-sm-6">' +
            '<div>${speed:  tph.infoTemplateFormat}</div>' +
            '</div>' +
            '</div>' +
            '<div class="line line-dashed b-b line-lg pull-in"></div>' +
            '<div class="form-group">' +
            '<label class="col-sm-6 control-label font-bold">'+switchLang.switchLang("weatherService.centerPressure")+':</label>' +
            '<div class="col-sm-6">' +
            '<div>${pressure: tph.infoTemplateFormat}</div>' +
            '</div>' +
            '</div>' +
            '<div class="line line-dashed b-b line-lg pull-in"></div>' +
            '<div class="form-group">' +
            '<label class="col-sm-6 control-label font-bold">'+switchLang.switchLang("weatherService.movingDirection")+':</label>' +
            '<div class="col-sm-6">' +
            '<div>${movedirection}</div>' +
            '</div>' +
            '</div>' +
            '<div class="line line-dashed b-b line-lg pull-in"></div>' +
            '<div class="form-group">' +
            '<label class="col-sm-6 control-label font-bold">'+switchLang.switchLang("weatherService.sevenCircleRadius")+':</label>' +
            '<div class="col-sm-6">' +
            '<div>${radius7}</div>' +
            '</div>' +
            '</div>' +
            '<div class="line line-dashed b-b line-lg pull-in"></div>' +
            '<div class="form-group">' +
            '<label class="col-sm-6 control-label font-bold">'+switchLang.switchLang("weatherService.tenCircleRadius")+':</label>' +
            '<div class="col-sm-6">' +
            '<div>${radius10}</div>' +
            '</div>' +
            '</div>' +
            '<div class="line line-dashed b-b line-lg pull-in"></div>' +
            '<div class="form-group">' +
            '<label class="col-sm-6 control-label font-bold">'+switchLang.switchLang("weatherService.twelfthCircleRadius")+':</label>' +
            '<div class="col-sm-6">' +
            '<div>${radius12}</div>' +
            '</div>' +
            '</div>';
        return content;
    }
// 台风动画开始执行
    tph.playMovie = function (typhoonId,typhoonName) {
        if (tph.moveParam.isMove == false)return;

        var typhoonData = tph.typhoonData[typhoonId];
        var typhoonGraphicData = tph.moveParam.typhoonGraphic[typhoonId];
        var k = tph.moveParam.index[typhoonId];

        var typhoonObjk = typhoonData[k];
        typhoonObjk.typhoonId = typhoonId;
        var typhoonTime = typhoonObjk.time;
        //while(k < tph.moveParam.totlLength[typhoonId]){
        if (k < (tph.moveParam.totlLength[typhoonId] - 1)) {
            var typhoonObjkNext = typhoonData[k+1];
            typhoonObjkNext.typhoonId = typhoonId;
            // 添加台风线
            var pArray = new Array();
            var mapPointF = esriMapService.getPointByCoords(parseFloat(typhoonObjk.lng), parseFloat(typhoonObjk.lat));
            var mapPointT = esriMapService.getPointByCoords(parseFloat(typhoonObjkNext.lng), parseFloat(typhoonObjkNext.lat));
            pArray.push(mapPointF);
            pArray.push(mapPointT);
            var line = new esri.geometry.Polyline(esriMapService.mapInstance.spatialReference);
            line.addPath(pArray);
            var lineGraphic = new esri.Graphic(line, tph.getLineSymbol(typhoonObjk.speed), 2);
            esriMapService.mapInstance.graphics.add(lineGraphic);
            typhoonGraphicData.push(lineGraphic)
            // 添加台风点
            if (k == 0) {
                var graphic = new esri.Graphic(mapPointF, tph.getPointSymbol(typhoonObjk.speed));

                var infoTemplate = new esri.InfoTemplate(typhoonTime + "--"+switchLang.switchLang("weatherService.onlineTyphoonTitle"), tph.setTyphoonContext());
                graphic.setInfoTemplate(infoTemplate);
                typhoonObjk.strong = switchLang.switchLang(typhoonObjk.strong);
                typhoonObjk.movedirection = switchLang.switchLang(typhoonObjk.movedirection);
                graphic.setAttributes(typhoonObjk);
                esriMapService.mapInstance.graphics.add(graphic);

                var font = new esri.symbol.Font();
                font.setSize("12pt");
                font.setWeight(esri.symbol.Font.WEIGHT_BOLD);
                var textSymbol = new esri.symbol.TextSymbol(typhoonName, font, new dojo.Color([255, 126, 0]));
                textSymbol.setOffset(30, -6);
                var textGraphic = new esri.Graphic(mapPointF, textSymbol);
                esriMapService.mapInstance.graphics.add(textGraphic);

                typhoonGraphicData.push(graphic)
                typhoonGraphicData.push(textGraphic)
            } else {
                tph.moveParam.toPoint[typhoonId].setSymbol(tph.getPointSymbol(typhoonData[k - 1].speed));
            }
            /*----添加大风圈开始----*/
            var size = tph.getTphWindSize(typhoonObjk.speed);

            var symbol = tph.getCircleSymbol();
            var paths1 = tph.getCircleLinePaths(mapPointT, size);
            //var paths2 = tph.getCircleLinePaths(mapPointT, 50);

            var polygon1 = new esri.geometry.Polygon(esriMapService.mapInstance.spatialReference);
            polygon1.addRing(paths1);

            var graphic1 = new esri.Graphic(polygon1, symbol);
            if (k == 0 || tph.moveParam.circleGhBig[typhoonId] == null) {
                tph.moveParam.circleGhBig[typhoonId] = graphic1;
                tph.tphBufferGraphic.add(tph.moveParam.circleGhBig[typhoonId]);
                typhoonGraphicData.push(graphic1)
            } else {
                tph.moveParam.circleGhBig[typhoonId].setGeometry(polygon1);
            }

            //var polygon2 = new esri.geometry.Polygon(esriMapService.mapInstance.spatialReference);
            //polygon2.addRing(paths2);
            //var graphic2 = new esri.Graphic(polygon2, symbol);
            //台风图片
            var graphic2 = new esri.Graphic(mapPointT, tph.getTyphoonSymbol());
            if (k == 0 || tph.moveParam.circleGhSmall[typhoonId] == null) {
                tph.moveParam.circleGhSmall[typhoonId] = graphic2;
                esriMapService.mapInstance.graphics.add(tph.moveParam.circleGhSmall[typhoonId]);
                typhoonGraphicData.push(graphic2)
            } else {
                //tph.moveParam.circleGhSmall[typhoonId].setGeometry(polygon2);
                tph.moveParam.circleGhSmall[typhoonId].setGeometry(mapPointT);
            }
            /*----添加大风圈结束.下面是不显示大风圈的做法----*/
            /*else {
             jhdmap.map.graphics.remove(mas2js.tph.moveParam.circleGhBig[typhoonId]);
             jhdmap.map.graphics.remove(mas2js.tph.moveParam.circleGhSmall[typhoonId]);
             mas2js.tph.moveParam.circleGhBig[typhoonId] = null;
             mas2js.tph.moveParam.circleGhSmall[typhoonId] = null;
             }*/
            tph.nextPointGraphic(typhoonObjkNext,typhoonGraphicData,typhoonId);
            /*var graphic3 = new esri.Graphic(mapPointT, tph.getPointSymbol(typhoonObjkNext.speed));// mas2js.tph.getPointSymbol(typhoonObjk.windspeed)
            // tph.pointSymbol[1]
            var typhoonTime_second = typhoonObjkNext.time;
            var infoTemplate3 = new esri.InfoTemplate(typhoonTime_second + "--"+switchLang.switchLang("weatherService.onlineTyphoonTitle"), tph.setTyphoonContext());
            graphic3.setInfoTemplate(infoTemplate3);
            typhoonObjkNext.strong = switchLang.switchLang(typhoonObjkNext.strong);
            typhoonObjkNext.movedirection = switchLang.switchLang(typhoonObjkNext.movedirection);
            typhoonObjkNext.radius7 = typhoonObjkNext.radius7 ? (typhoonObjkNext.radius7 + 'KM') : '-';
            typhoonObjkNext.radius10 = typhoonObjkNext.radius10 ? (typhoonObjkNext.radius10 + 'KM') : '-';
            typhoonObjkNext.radius12 = typhoonObjkNext.radius12 ? (typhoonObjkNext.radius12 + 'KM') : '-';
            graphic3.setAttributes(typhoonObjkNext);
            esriMapService.mapInstance.graphics.add(graphic3);
            typhoonGraphicData.push(graphic3)
            tph.moveParam.toPoint[typhoonId] = graphic3;*/
            // mas2js.tph.extent2GraphicsLayer();

        } else {
            if(tph.moveParam.totlLength[typhoonId]==1){
                tph.nextPointGraphic(typhoonObjk,typhoonGraphicData,typhoonId,true);
            }
            tph.moveParam.toPoint[typhoonId].setSymbol(tph.getPointSymbol(typhoonObjk.speed));
            tph.setPlayMovieText(true);
            //tph.bufferGraphics(tph.moveParam.toPoint[typhoonId], 100,typhoonId)
            tph.showTphWarnTrack(typhoonObjk)

            var allTphPathPoints = tph.typhoonData[typhoonId];
            angular.forEach(allTphPathPoints, function (val, k) {
                if (val && val.time ) {
                    var currentTime = new Date(Date.parse(typhoonTime));
                    var currentTime_change = new Date(Date.parse(typhoonTime));;
                    var sTime = currentTime.setHours(currentTime.getHours() - 12);
                    var eTime = currentTime_change.setHours(currentTime_change.getHours() + 12);
                    if (Date.parse(val.time) >= sTime && Date.parse(val.time) <= eTime) {
                        tph._24hTphPointsTimes.push(insureUtil.dateToString(new Date(val.time),'yyyy/MM/dd hh:mm'));
                    }
                }
            })
            //esriMapService.mapInstance.graphics.remove(tph.moveParam.circleGhBig[typhoonId]);
            //esriMapService.mapInstance.graphics.remove(tph.moveParam.circleGhSmall[typhoonId]);
            //tph.moveParam.circleGhBig[typhoonId] = null;
            //tph.moveParam.circleGhSmall[typhoonId] = null;

        }
        k = k + 1;
        tph.moveParam.index[typhoonId] = k;
        window.setTimeout("tph.playMovie('" + typhoonId + "','"+typhoonName+"')", 20);
        // modify end
        // tph.bindMouseClickListener();
        //}

    }
    tph.nextPointGraphic = function(typhoonObj,typhoonGraphicData,typhoonId,isOnlyOntPoint){
        var point = esriMapService.getPointByCoords(parseFloat(typhoonObj.lng), parseFloat(typhoonObj.lat));
        var graphic = new esri.Graphic(point);
        if(isOnlyOntPoint){
            graphic = new esri.Graphic(point);
        }else{
            graphic = new esri.Graphic(point,tph.getPointSymbol(typhoonObj.speed));
        }
        var typhoonTime_second = typhoonObj.time;
        var infoTemplate = new esri.InfoTemplate(typhoonTime_second + "--"+switchLang.switchLang("weatherService.onlineTyphoonTitle"), tph.setTyphoonContext());
        graphic.setInfoTemplate(infoTemplate);
        typhoonObj.strong = switchLang.switchLang(typhoonObj.strong);
        typhoonObj.movedirection = switchLang.switchLang(typhoonObj.movedirection);
        typhoonObj.radius7 = typhoonObj.radius7 ? (typhoonObj.radius7 + 'KM') : '-';
        typhoonObj.radius10 = typhoonObj.radius10 ? (typhoonObj.radius10 + 'KM') : '-';
        typhoonObj.radius12 = typhoonObj.radius12 ? (typhoonObj.radius12 + 'KM') : '-';
        graphic.setAttributes(typhoonObj);
        esriMapService.mapInstance.graphics.add(graphic);
        typhoonGraphicData.push(graphic)
        tph.moveParam.toPoint[typhoonId] = graphic;
    }

    tph.bufferGraphics = function (pointGraphic, distance,typhoonId) {
        esriMapService.bufferGraphics(pointGraphic.geometry, distance, function (bufferedGeometries) {
            var symbol = tph.getBufferSymbol();
            var time = pointGraphic.attributes.time;
            //请求缓冲区内的站点并显示
            tph.getBufferStation(bufferedGeometries[0], typhoonId, time);

            angular.forEach(bufferedGeometries, function (geometry, key) {
                var graphic = null;
                if (tph.moveParam.circleGhBuffer[typhoonId]) {
                    graphic = tph.moveParam.circleGhBuffer[typhoonId];
                    graphic.setGeometry(geometry);
                }else {
                    graphic = new esri.Graphic(geometry, symbol);
                    tph.moveParam.circleGhBuffer[typhoonId] = graphic;
                    tph.tphBufferGraphic.add(graphic);
                    tph.moveParam.typhoonGraphic[typhoonId].push(graphic);
                }
            });
        }, function (errobj) {
            console.dir(errobj);
        });
    }
    //求缓冲面的四角坐标点,同时将缓冲区左移
    tph.getBufferCoordinate = function (polygon) {

        var rings = polygon.rings[0];
        var minx = rings[0][0], miny = rings[0][1], maxx = rings[0][0], maxy = rings[0][1];
        angular.forEach(rings, function (value, index) {
            var x = value[0], y = value[1];
            minx = Math.min(minx, x);
            miny = Math.min(miny, y);
            maxx = Math.max(maxx, x);
            maxy = Math.max(maxy, y);
        })
        //将缓冲区左移
        var lng = maxx + (maxx - minx)/2.0;
        var lat = miny + (maxy - miny)/2.0;
        var leftPoint = esriMapService.getPointByCoords(lng, lat);
        esriMapService.mapInstance.centerAndZoom(leftPoint, 6);
        return {xmin: minx, ymin: miny, xmax: maxx, ymax: maxy, station_levl: "'11'", maplevel: 'less5'};
    }
    //得到缓冲区对应的站点并在地图上进行叠加
    tph.stationObj={};
    tph.stationZoomEnd = null;
    tph.getBufferStation = function (polygon, typhoonId, time) {
        var bufferCoordinate = tph.getBufferCoordinate(polygon);
        if(!tph.stationObj[typhoonId]){
            tph.stationObj[typhoonId] = {};
        }
        tph.stationZoomEnd = esriMapService.mapInstance.on('zoom-end', function (obj) {
            var level = obj.level;
            if (level < 5) {
                bufferCoordinate.station_levl = "'11'"
                bufferCoordinate.maplevel = "less5";
            } else if (level >= 5 && level < 8) {
                bufferCoordinate.station_levl = "'11','12'"
                bufferCoordinate.maplevel = "less8";
            } else if (level >= 8 && level < 10) {
                bufferCoordinate.station_levl = "'11','12','13'"
                bufferCoordinate.maplevel = "less10";
            } else if (level >= 10 && level < 12) {
                bufferCoordinate.station_levl = "'11','12','13'"
                bufferCoordinate.maplevel = "less12";
            } else if (level >= 12) {
                bufferCoordinate.station_levl = "'11','12','13'"
                bufferCoordinate.maplevel = "more12";
            }
            if(tph.stationObj[typhoonId].currentLevel != bufferCoordinate.maplevel ){
                tph.stationObj[typhoonId].currentLevel = bufferCoordinate.maplevel;
                tph.loadContryAutoStation(bufferCoordinate,typhoonId,time,polygon);
            }
        });
        tph.stationObj[typhoonId].currentLevel = bufferCoordinate.maplevel;
        tph.loadContryAutoStation(bufferCoordinate,typhoonId,time,polygon);
    }
    tph.loadContryAutoStation = function(bufferCoordinate,typhoonId,time,polygon){
        $http({
            method: 'POST',
            url: 'weatherData/getContryAutoStation',
            data: bufferCoordinate
        }).success(function (data) {
            tph.tphStationLayer.clear();
            dojo.forEach(data.result, function (station) {
                station.time = time;
                var stationPoint = esriMapService.getPointByCoords(station.lon, station.lat);
                if(polygon.contains(stationPoint)){
                    //graphic.setInfoTemplate(infoTemplate);
                    var pictureType = station.station_levl=='14'? "pointPicture2" : "pointPicture";
                    var symbol = esriMapService.getSymbolByType(pictureType);
                    var stationGraphic = new esri.Graphic(stationPoint, symbol);
                    stationGraphic.setAttributes(station);
                    // esriMapService.mapInstance.graphics.add(stationGraphic);
                    tph.tphStationLayer.add(stationGraphic);
                    tph.moveParam.typhoonGraphic[typhoonId].push(stationGraphic);

                    /*var textSymbol = new esri.symbol.TextSymbol(station.station_name, new esri.symbol.Font(), new dojo.Color([255, 126, 0]));
                     textSymbol.setOffset(30, -6);
                     var textGraphic = new esri.Graphic(stationPoint, textSymbol);
                     // esriMapService.mapInstance.graphics.add(textGraphic);
                     tph.tphStationLayer.add(textGraphic);
                     tph.moveParam.typhoonGraphic[typhoonId].push(textGraphic);*/
                }
            });
        })
    }
// 获得台风 线的样式
    tph.getLineSymbol = function (windspeed) {
        if (windspeed < 10.8) {
            return tph.lineSymbol[0];
        } else if (windspeed < 17.1) {
            return tph.lineSymbol[1];
        } else if (windspeed < 24.4) {
            return tph.lineSymbol[2];
        } else if (windspeed < 32.6) {
            return tph.lineSymbol[3];
        } else if (windspeed < 41.4) {
            return tph.lineSymbol[4];
        } else if (windspeed <= 50.9) {
            return tph.lineSymbol[5];
        } else if (windspeed > 50.9) {
            return tph.lineSymbol[6];
        }
    }

// 获得台风 预警线的样式
    tph.getWarnLineSymbol = function (windspeed) {
        if (windspeed < 10.8) {
            return tph.warnLineSymbol[0];
        } else if (windspeed < 17.1) {
            return tph.warnLineSymbol[1];
        } else if (windspeed < 24.4) {
            return tph.warnLineSymbol[2];
        } else if (windspeed < 32.6) {
            return tph.warnLineSymbol[3];
        } else if (windspeed < 41.4) {
            return tph.warnLineSymbol[4];
        } else if (windspeed <= 50.9) {
            return tph.warnLineSymbol[5];
        } else if (windspeed > 50.9) {
            return tph.warnLineSymbol[6];
        }
    }
    // 不同国家对应不同的预测线
    tph.getStateLineSymbol = function (orgnization) {
        if ( "中国" == orgnization ) {
            return tph.warnLineSymbol[0];
        } else if ( "中国台湾" == orgnization ) {
            return tph.warnLineSymbol[1];
        } else if ( "中国香港" == orgnization ) {
            return tph.warnLineSymbol[2];
        } else if ( "日本" == orgnization ) {
            return tph.warnLineSymbol[3];
        } else if ( "美国" == orgnization ) {
            return tph.warnLineSymbol[4];
        } else if ( "韩国" == orgnization ) {
            return tph.warnLineSymbol[5];
        } else if ( "欧洲" == orgnization ) {
            return tph.warnLineSymbol[6];
        }
    }
// 获得台风 点的样式
    tph.getPointSymbol = function (windspeed) {
        if (windspeed < 10.8) {
            return tph.pointSymbol[0];
        } else if (windspeed < 17.1) {
            return tph.pointSymbol[1];
        } else if (windspeed < 24.4) {
            return tph.pointSymbol[2];
        } else if (windspeed < 32.6) {
            return tph.pointSymbol[3];
        } else if (windspeed < 41.4) {
            return tph.pointSymbol[4];
        } else if (windspeed <= 50.9) {
            return tph.pointSymbol[5];
        } else if (windspeed > 50.9) {
            return tph.pointSymbol[6];
        }
    }

// 获得大风圈大小
    tph.getTphWindSize = function (windspeed) {
        var midl = 10;
        if (windspeed <= 10) {
            return 10 * midl;
        } else if (windspeed <= 20) {
            return 20 * midl;
        } else if (windspeed <= 40) {
            return 30 * midl;
        } else if (windspeed <= 60) {
            return 40 * midl;
        } else {
            return 50 * midl;
        }
    }

    // 台风点样式数组
    tph.pointSymbol = [
        new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 10,
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0]), 0.1), new dojo.Color([76, 238, 223])),
        new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 10,
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0]), 0.1), new dojo.Color([76, 238, 223])),
        new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 10,
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0]), 0.1), new dojo.Color([144, 244, 109])),
        new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 10,
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0]), 0.1), new dojo.Color([255, 242, 2])),
        new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 10,
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0]), 0.1), new dojo.Color([255, 126, 0])),
        new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 10,
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0]), 0.1), new dojo.Color([247, 26, 8])),
        new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 10,
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0]), 0.1), new dojo.Color([148, 14, 233])),
        new esri.symbol.PictureMarkerSymbol("../../index/news/typhoon/333.png", 50, 50)
    ];
// 台风线样式数组
    tph.lineSymbol = [
        new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([76, 238, 223]), 3),
        new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([76, 238, 223]), 3),
        new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([144, 244, 109]), 3),
        new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 242, 2]), 3),
        new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 126, 0]), 3),
        new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([247, 26, 8]), 3),
        new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([148, 14, 233]), 3)
    ];

// 台风线样式数组
    tph.warnLineSymbol = [
        new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([76, 238, 223]), 2),
        new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([76, 238, 223]), 2),
        new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([144, 244, 109]), 2),
        new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 242, 2]), 2),
        new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 126, 0]), 2),
        new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([247, 26, 8]), 2),
        new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([148, 14, 233]), 2)
    ];

// 获取 圆型标注样式
    tph.getCircleSymbol = function () {
        return new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([39, 194, 76, 0.65]), 2),
            new dojo.Color([39, 194, 76, 0.35])
        )
    }
    tph.getTyphoonSymbol = function () {
        return new esri.symbol.PictureMarkerSymbol("img/mapstyle/typhoon.gif", 40, 40);
    }
    tph.getBufferSymbol = function () {
        return new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0, 1]), 2), new dojo.Color([255, 170, 37, 0]));
    }
    // 计算圆形边线数据
    tph.getCircleLinePaths = function (centerPoint, size) {
        var cx = parseFloat(centerPoint.x);
        var cy = parseFloat(centerPoint.y);
        var pointArry = [];
        size = size / 111.1
        for (var i = 0; i <= 360; i++) {
            degree = i * (Math.PI / 180);
            var px = cx + Math.cos(degree) * size;
            var py = cy + Math.sin(degree) * size;
            pointArry.push([px, py]);
        }
        return pointArry;
    }
    //台风信息列表
    tph.typhoonInfoTableBak = function (callBackFun) {
        return {
            pageList: ['All'],
            url: 'weatherData/get5Typhoons?view=select',
            method: 'GET',
            resultTag: 'result',
            classes: "table-no-bordered",
            pageSize: 5,
            height: 190,
            hidePaginationInfo: true,
            checkboxHeader: false,
            maintainSelected: true,
            onCheck: function (row) {
                tph.showTyphoonPath(callBackFun(),'', row)
            },
            onUncheck: function (row) {
                tph.showTyphoonPath(callBackFun(),"uncheck", [row])
            },
            onLoadSuccess: function (data) {},
            columns: [{
                checkbox: true,
                width: '10%'
            }, {
                title: switchLang.switchLang("weatherService.time"),
                class: 'col-md-1',
                field: 'starttime',
                align: 'center',
                sortable: false,
                width: '10%',
                formatter: function (value, row, index) {
                    return value.substring(0, value.indexOf("/",5));
                }
            }, {
                title: switchLang.switchLang('weatherService.code'),
                class: 'col-md-1',
                field: 'tfid',
                align: 'center',
                sortable: false,
                width: '10%',
                formatter: function (value, row, index) {
                    return switchLang.switchLang(value);
                }
            }, {
                title: switchLang.switchLang('weatherService.name'),
                class: 'col-md-1',
                field: 'name',
                align: 'center',
                sortable: false,
                width: '5%',
                formatter: function (value, row, index) {
                    return switchLang.switchLang(value);
                }
            }]
        }
    }
    tph.typhoonInfoIds = "";
    tph.typhoonAfterTag = {};
    //根据checkbox选中情况来展示台风
    tph.showTyphoonPath = function (typoonInstance, tag, rows) {
        var typhoonIds = "";
        var uncheckIds = "";
        if (tag == "uncheckAll" || tag == "uncheck") {
            angular.forEach(rows, function (row, key) {
                uncheckIds += "," + row.tfid;
            })
            tph.typhoonUncheckIds = uncheckIds.substr(1);
            if(tph.stationZoomEnd){
                tph.stationZoomEnd.remove();
            }
        } else {
            typoonInstance.typhoonPath.bootstrapTable('refresh',{url:'weatherData/getTyphoonPathInfo?view=select&typhoonId='+rows.tfid.replace(/'/g, "")});
            // typoonInstance.typhoonPath.bootstrapTable('refresh',{url:'http://typhoon.zjwater.gov.cn/Api/TyphoonInfo/'+rows.tfid.replace(/'/g, "")});
            typhoonIds += ",'" + rows.tfid + "'";
            typhoonIds = typhoonIds.substr(1);
            tph.typhoonInfoIds = typhoonIds;
        }

        if(tph.typhoonData[tph.typhoonInfoIds.replace(/'/g, "")]){
            tph.playMovieInit(typhoonIds, tag, uncheckIds);
        }
    }

    //台风路径列表
    tph.typhoonPathTableBak = {
        pageList: ['All'],
        url: 'weatherData/getTyphoonPathInfo',
        queryParams: function (params) {
           angular.extend(params, {
               view: "select",
               typhoonId: 1
           });
           return params;
        },
        resultTag: 'result',
        classes: "table-no-bordered",
        pageSize: 5,
        height: 190,
        hidePaginationInfo: true,
        onLoadSuccess: function (data) {
            if (data.rows && data.rows.length > 0) {
                var tphInfo = data.tphInfo;

                var typooonParentId = tphInfo.tfid;
                var typhoonGraphicCache = tph.moveParam.typhoonGraphic[typooonParentId];
                if (!typhoonGraphicCache) {
                    tph.typhoonData[typooonParentId] = data.rows;
                    tph.moveParam.typhoonObj[typooonParentId] = {typhoonName : tphInfo.name,warnlevel: tphInfo.warnlevel}
                    tph.moveParam.index[typooonParentId] = 0;
                    tph.moveParam.totlLength[typooonParentId] = data.rows.length;
                }
                if(!tph.typhoonAfterTag[typooonParentId]){
                    tph.playMovieInit(typooonParentId, null, "");
                    tph.typhoonAfterTag[typooonParentId] = "hasInit";
                }
            }
        },
        columns: [{
            title: switchLang.switchLang('weatherService.time'),
            class: 'col-md-1',
            field: 'time',
            align: 'center',
            sortable: false,
            width: '10%',
            formatter: function (value, row, index) {
                return value;
            }
        }, {
            title: switchLang.switchLang('weatherService.center'),
            class: 'col-md-1',
            field: 'lng',
            align: 'center',
            sortable: false,
            width: '10%',
            formatter: function (value, row, index) {
                return  value+ "°E|" + row.lat +"°N";
            }
        }, {
            title: switchLang.switchLang('weatherService.center'),
            class: 'col-md-1',
            field: 'speed',
            align: 'center',
            sortable: false,
            width: '5%',
            formatter: function (value, row, index) {
                return value + "m/s";
            }
        }, {
            title: switchLang.switchLang('weatherService.minPressure'),
            class: 'col-md-1',
            field: 'pressure',
            align: 'center',
            sortable: false,
            width: '5%',
            formatter: function (value, row, index) {
                return value + "hpa";
            }
        }]
    }

    /*tph.typhoonPathTableBak = {
        pageList: ['All'],
        url: 'http://typhoon.zjwater.gov.cn/Api/TyphoonInfo/1',
        dataType : "jsonp",
        jsonpOption : {jsonp:"callback"},
        resultTag: '[],0,points',
        classes: "table-no-bordered",
        pageSize: 5,
        height: 190,
        hidePaginationInfo: true,
        //queryParams: function (params) {
        //    angular.extend(params, {
        //        view: "select",
        //        typhoonIds: tph.typhoonInfoIds
        //    });
        //    return params;
        //},
        onLoadSuccess: function (data) {
            if (data.rows && data.rows.length > 0) {
                var typooonParentId = data[0].tfid;
                var typhoonGraphicCache = tph.moveParam.typhoonGraphic[typooonParentId];
                if (!typhoonGraphicCache) {
                    tph.typhoonData[typooonParentId] = data.rows;
                    tph.moveParam.typhoonObj[typooonParentId] = {typhoonName : data[0].name,warnlevel: data[0].warnlevel}
                    tph.moveParam.index[typooonParentId] = 0;
                    tph.moveParam.totlLength[typooonParentId] = data.rows.length;
                }
                //tph.setPlayMovieText(false);
                //tph.moveParam.typhoonGraphic[typooonParentId] = [];
                //tph.playMovie(typooonParentId,data[0].name);
                if(!tph.typhoonAfterTag[typooonParentId]){
                    tph.playMovieInit(typooonParentId, null, "");
                    tph.typhoonAfterTag[typooonParentId] = "hasInit";
                }
            }
        },
        columns: [{
            title: switchLang.switchLang('weatherService.time'),
            class: 'col-md-1',
            field: 'time',
            align: 'center',
            sortable: false,
            width: '10%',
            formatter: function (value, row, index) {
                return value;
            }
        }, {
            title: switchLang.switchLang('weatherService.center'),
            class: 'col-md-1',
            field: 'lng',
            align: 'center',
            sortable: false,
            width: '10%',
            formatter: function (value, row, index) {
                return  value+ "°E|" + row.lat +"°N";
            }
        }, {
            title: switchLang.switchLang('weatherService.center'),
            class: 'col-md-1',
            field: 'speed',
            align: 'center',
            sortable: false,
            width: '5%',
            formatter: function (value, row, index) {
                return value + "m/s";
            }
        }, {
            title: switchLang.switchLang('weatherService.minPressure'),
            class: 'col-md-1',
            field: 'pressure',
            align: 'center',
            sortable: false,
            width: '5%',
            formatter: function (value, row, index) {
                return value + "hpa";
            }
        }]
    }*/

    return tph;
}]);

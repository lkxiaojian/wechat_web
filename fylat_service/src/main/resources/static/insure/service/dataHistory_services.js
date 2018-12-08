var tphHistorty = {};
app.factory("typhoonHistoryService", ['$http', '$filter', 'esriMapService', 'insureUtil', 'switchLang',
    function ($http, $filter, esriMapService, insureUtil, switchLang) {

        tphHistorty.tphBufferGraphic = null;
        tphHistorty.tphGraphicsLayer = null;
        tphHistorty.tphStationLayer = null;
        tphHistorty.init = function () {

            var extent = esriMapService.getMapExtent(105.2041015625, 3.6254884687499995, 164.7939453125, 33.90380878125);
            esriMapService.mapInstance.setExtent(extent, true);

            tphHistorty.tphBufferGraphic = new esri.layers.GraphicsLayer();
            tphHistorty.tphStationLayer = new esri.layers.GraphicsLayer();
            //tphHistorty.tphGraphicsLayer = new esri.layers.GraphicsLayer();

            esriMapService.mapInstance.addLayer(tphHistorty.tphBufferGraphic);
            esriMapService.mapInstance.addLayer(tphHistorty.tphStationLayer);
            //esriMapService.mapInstance.addLayer(tphHistorty.tphGraphicsLayer);


            //##########esriMapService.mapInstance.graphics事件beging##########
            esriMapService.mapInstance.graphics.on("mouse-over", function (evt) {
                var g = evt.graphic;
                var point = evt.mapPoint;
                if (g.attributes && g.infoTemplate) {
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
                                ' <label class="col-sm-4 control-label font-bold">' + switchLang.switchLang("site.TEM") + '</label>' +
                                '<div class="col-sm-8">' +
                                '<div>' + switchLang.switchLang("site.TEM_Avg") + '：' + res.tem_avg + '°C</div>' +
                                '<div>' + switchLang.switchLang("site.TEM_Max") + '：' + res.tem_max + '°C</div>' +
                                '<div>' + switchLang.switchLang("site.TEM_MIN") + '：' + res.tem_min + '°C</div>' +
                                '</div>' +
                                '</div>' +
                                '<div class="line line-dashed b-b line-lg pull-in"></div>' +
                                '<div class="form-group">' +
                                ' <label class="col-sm-4 control-label font-bold">' + switchLang.switchLang("site.WIN") + '</label>' +
                                '<div class="col-sm-8">' +
                                '<div>' + switchLang.switchLang("site.WIN_S_2MI_AVG") + '：' + res.win_s_2mi_avg + switchLang.switchLang("common.unit.wind") + '</div>' +
                                '<div>' + switchLang.switchLang("site.WIN_S_MAX") + '：' + res.win_s_max + switchLang.switchLang("common.unit.wind") + '</div>' +
                                '</div>' +
                                '</div>' +
                                '<div class="line line-dashed b-b line-lg pull-in"></div>' +
                                '<div class="form-group">' +
                                ' <label class="col-sm-4 control-label font-bold">' + switchLang.switchLang("site.RHU") + '</label>' +
                                '<div class="col-sm-8">' +
                                '<div>' + switchLang.switchLang("site.RHU_AVG") + '：' + res.rhu_avg + '%</div>' +
                                '<div>' + switchLang.switchLang("site.RHU_MIN") + '：' + res.rhu_min + '%</div>' +
                                '</div>' +
                                '</div>' +
                                '<div class="line line-dashed b-b line-lg pull-in"></div>' +
                                '<div class="form-group">' +
                                ' <label class="col-sm-4 control-label font-bold">' + switchLang.switchLang("site.PRE") + '</label>' +
                                '<div class="col-sm-8">' +
                                '<div>' + switchLang.switchLang("site.PRE_TIME_2020") + '：' + res.pre_time_2020 + 'mm</div>' +
                                '</div>' +
                                '</div>';
                            esriMapService.showInfoWindow(point, dateTime + "--" + switchLang.switchLang("weatherService.onlineStationTitle") + ":", content, 330, 300)

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
                var g = evt.graphic;
                if (g.attributes && g.attributes.typhoonId) {
                    var point = g.geometry;
                    if (point.type == 'point') {
                        var size = tphHistorty.getTphWindSize(g.attributes.speed);
                        var paths1 = tphHistorty.getCircleLinePaths(point, size);
                        var polygon1 = new esri.geometry.Polygon(esriMapService.mapInstance.spatialReference);
                        polygon1.addRing(paths1);
                        tphHistorty.moveParam.circleGhBig[g.attributes.typhoonId].setGeometry(polygon1);
                        tphHistorty.moveParam.circleGhSmall[g.attributes.typhoonId].setGeometry(point);
                        if(tphHistorty.stationZoomEnd){
                            tphHistorty.stationZoomEnd.remove();
                        }
                        tphHistorty.bufferGraphics(g, 100, g.attributes.typhoonId)
                    }
                }
            })

            //##########esriMapService.mapInstance.graphics事件end##########
        }
        tphHistorty.refersh = function (typhoon) {
            // 显示预警路径
            tphHistorty.showTphWarnTrack(typhoon);
            // 显示轨迹点信息
            //tphHistorty.showTphPointInfo(typhoon);
        }
        // 显示台风预警路径
        tphHistorty.showTphWarnTrack = function (typhoonPathObj) {
            tphHistorty.tphGraphicsLayer.clear();
            var typhoonGraphicData = tphHistorty.moveParam.typhoonGraphic[typhoonPathObj.typhoonId];
            angular.forEach(typhoonPathObj.forecast, function (typhoonSubPath, key) {
                var tphWarnTrackData = typhoonSubPath.forecastpoints;
                var orgnization = typhoonSubPath.tm;
                if (tphWarnTrackData != null && tphWarnTrackData.length > 0) {
                    var pathArray = null;
                    for (var i = 0; i < tphWarnTrackData.length; i++) {
                        pathArray = [];
                        var item = tphWarnTrackData[i];
                        var point = esriMapService.getPointByCoords(item.lng, item.lat);
                        if (i < tphWarnTrackData.length - 1) {
                            var nextItem = tphWarnTrackData[i + 1];
                            var nextPoint = esriMapService.getPointByCoords(nextItem.lng, nextItem.lat);

                            pathArray.push(point);
                            pathArray.push(nextPoint);

                            var line = new esri.geometry.Polyline(esriMapService.mapInstance.spatialReference);
                            line.addPath(pathArray);

                            var lineGraphic = new esri.Graphic(line, tphHistorty.getStateLineSymbol(orgnization), 2);
                            tphHistorty.tphGraphicsLayer.add(lineGraphic);
                            typhoonGraphicData.push(lineGraphic)
                        }
                        if (i > 0) {
                            var pointGraphic = new esri.Graphic(point, tphHistorty.getPointSymbol(item.speed));
                            var infoTemplate = new esri.InfoTemplate("台风预报", tphHistorty.setForecastContext());
                            pointGraphic.setInfoTemplate(infoTemplate);
                            item.tm = orgnization;
                            pointGraphic.setAttributes(item);
                            tphHistorty.tphGraphicsLayer.add(pointGraphic);
                            typhoonGraphicData.push(pointGraphic)
                            //var textSymbol = new esri.symbol.TextSymbol(item.prediction+'小时', new esri.symbol.Font(), new dojo.Color([255, 126, 0]));
                            //textSymbol.setOffset(30, -6);
                            //var textGraphic = new esri.Graphic(point, textSymbol);
                            //tphHistorty.tphGraphicsLayer.add(textGraphic);

                        }
                    }
                }
            })
        }
        tphHistorty.infoTemplateFormat = function (value, key, data) {
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
        tphHistorty.setForecastContext = function () {
            var content =
                '<div class="form-group">' +
                '<label class="col-sm-6 control-label font-bold">预报机构:</label>' +
                '<div class="col-sm-6">' +
                '<div>${tm}</div>' +
                '</div>' +
                '</div>' +
                '<div class="line line-dashed b-b line-lg pull-in"></div>' +
                '<div class="form-group">' +
                '<label class="col-sm-6 control-label font-bold">中心位置:</label>' +
                '<div class="col-sm-6">' +
                '<div>${lng}°E|${lat}°N</div>' +
                '</div>' +
                '</div>' +
                '<div class="line line-dashed b-b line-lg pull-in"></div>' +
                '<div class="form-group">' +
                '<label class="col-sm-6 control-label font-bold">到达时间:</label>' +
                '<div class="col-sm-6">' +
                '<div>${time}</div>' +
                '</div>' +
                '</div>' +
                '<div class="line line-dashed b-b line-lg pull-in"></div>' +
                '<div class="form-group">' +
                '<label class="col-sm-6 control-label font-bold">中心气压:</label>' +
                '<div class="col-sm-6">' +
                '<div>${pressure: tphHistorty.infoTemplateFormat}</div>' +
                '</div>' +
                '</div>' +
                '<div class="line line-dashed b-b line-lg pull-in"></div>' +
                '<div class="form-group">' +
                '<label class="col-sm-6 control-label font-bold">最大风速:</label>' +
                '<div class="col-sm-6">' +
                '<div>${speed: tphHistorty.infoTemplateFormat}</div>' +
                '</div>' +
                '</div>';
            return content;
        }
        tphHistorty.get = function (typhoonId) {
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
        tphHistorty.typhoonData = {};
        tphHistorty.typhoonAfterTag = {};
        tphHistorty.moveParam = {
            index: {},
            totlLength: {},
            fromPoint: {},
            toPoint: {},
            circleGhBig: {},
            circleGhSmall: {},
            circleGhBuffer: {},
            isMove: false,
            typhoonObj: {},
            typhoonGraphic: {} //该结构保存每个台风id及路径对应的每个数组
        };
        tphHistorty.playMovieInit = function (thphoonIds, checkTag, uncheckId) {
            var thphoonIdArray = thphoonIds.split(",");
            if (checkTag == "uncheck" || checkTag == "uncheckAll") {
                var uncheckIdArray = uncheckId.split(",");
                tphHistorty.uncheckTyphoon(uncheckIdArray)
            } else {
                for (var i = 0; i < thphoonIdArray.length; i++) {
                    var typhoonId = thphoonIdArray[i].replace(/'/g, "");
                    tphHistorty.extent2AllGraphicsLayer(typhoonId);
                    var typhoonGraphicCache = tphHistorty.moveParam.typhoonGraphic[typhoonId];
                    if (!typhoonGraphicCache) {
                        var data = tphHistorty.typhoonData[typhoonId];
                        if (data != null || data.length > 0) {
                            tphHistorty.setPlayMovieText(false);
                            tphHistorty.moveParam.typhoonGraphic[typhoonId] = [];
                            var name = switchLang.switchLang(tphHistorty.moveParam.typhoonObj[typhoonId].typhoonName);//tphHistorty.moveParam.typhoonObj[typhoonId].typhoonName
                            tphHistorty.playMovie(typhoonId, name);
                        }
                    } else {
                        tphHistorty.checkTyphoon(typhoonGraphicCache)
                    }
                }
            }
        }
        tphHistorty.uncheckTyphoon = function (thphoonIdArray) {
            for (var i = 0; i < thphoonIdArray.length; i++) {
                var typhoonId = thphoonIdArray[i];
                var typhoonGraphicArr = tphHistorty.moveParam.typhoonGraphic[typhoonId];
                for (var j = 0; typhoonGraphicArr && j < typhoonGraphicArr.length; j++) {
                    typhoonGraphicArr[j].hide();
                }
            }
        }
        tphHistorty.checkTyphoon = function (typhoonGraphicArr) {
            for (var j = 0; j < typhoonGraphicArr.length; j++) {
                typhoonGraphicArr[j].show();
            }
        }
        // graphicsLayer 缩放到外包络范围（包括台风预警路径）
        tphHistorty.extent2AllGraphicsLayer = function (typhoonId) {
            var data = tphHistorty.typhoonData[typhoonId];
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
        tphHistorty.clearMapGraphicInfo = function () {
            //var count =0;
            //angular.forEach(tphHistorty.moveParam.typhoonGraphic, function (obj, key) {
            //    for(var j = 0; j < obj.length; j++){
            //        obj[j].hide();
            //    }
            //    count++;
            //})
            if (tphHistorty.tphBufferGraphic && tphHistorty.tphBufferGraphic.loaded) {
                //tphHistorty.tphGraphicsLayer.clear();
                tphHistorty.tphBufferGraphic.clear();
                tphHistorty.tphStationLayer.clear();
                tphHistorty.typhoonData = {};
                tphHistorty.typhoonAfterTag = {};
                tphHistorty.moveParam = {
                    index: {}, totlLength: {}, fromPoint: {}, toPoint: {}, circleGhBig: {},
                    circleGhSmall: {}, circleGhBuffer: {}, isMove: false, typhoonObj: {}, typhoonGraphic: {}
                };
            }
            tphHistorty.init()
        }
// 设置播放按钮文字
        tphHistorty.setPlayMovieText = function (state) {
            if (tphHistorty.typhoonData == null || tphHistorty.typhoonData.length <= 0)return;
            if (state) {
                tphHistorty.moveParam.isMove = false;
            } else {
                tphHistorty.moveParam.isMove = true;
            }
        }


//设置台风点文本内容
        tphHistorty.setTyphoonContext = function () {
            var content =
                '<div class="form-group">' +
                '<label class="col-sm-6 control-label font-bold">' + switchLang.switchLang("weatherService.center") + ':</label>' +
                '<div class="col-sm-6">' +
                '<div>${lng}°E|${lat}°N</div>' +
                '</div>' +
                '</div>' +
                '<div class="line line-dashed b-b line-lg pull-in"></div>' +
                '<div class="form-group">' +
                '<label class="col-sm-6 control-label font-bold">' + switchLang.switchLang("weatherService.strength") + ':</label>' +
                '<div class="col-sm-6">' +
                '<div>${strong}</div>' +
                '</div>' +
                '</div>' +
                '<div class="line line-dashed b-b line-lg pull-in"></div>' +
                '<div class="form-group">' +
                '<label class="col-sm-6 control-label font-bold">' + switchLang.switchLang("weatherService.maxSpeed") + ':</label>' +
                '<div class="col-sm-6">' +
                '<div>${speed: tphHistorty.infoTemplateFormat}</div>' +
                '</div>' +
                '</div>' +
                '<div class="line line-dashed b-b line-lg pull-in"></div>' +
                '<div class="form-group">' +
                '<label class="col-sm-6 control-label font-bold">' + switchLang.switchLang("weatherService.centerPressure") + ':</label>' +
                '<div class="col-sm-6">' +
                '<div>${pressure: tphHistorty.infoTemplateFormat}</div>' +
                '</div>' +
                '</div>' +
                '<div class="line line-dashed b-b line-lg pull-in"></div>' +
                '<div class="form-group">' +
                '<label class="col-sm-6 control-label font-bold">' + switchLang.switchLang("weatherService.movingDirection") + ':</label>' +
                '<div class="col-sm-6">' +
                '<div>${movedirection}</div>' +
                '</div>' +
                '</div>' +
                '<div class="line line-dashed b-b line-lg pull-in"></div>' +
                '<div class="form-group">' +
                '<label class="col-sm-6 control-label font-bold">' + switchLang.switchLang("weatherService.sevenCircleRadius") + ':</label>' +
                '<div class="col-sm-6">' +
                '<div>${radius7}</div>' +
                '</div>' +
                '</div>' +
                '<div class="line line-dashed b-b line-lg pull-in"></div>' +
                '<div class="form-group">' +
                '<label class="col-sm-6 control-label font-bold">' + switchLang.switchLang("weatherService.tenCircleRadius") + ':</label>' +
                '<div class="col-sm-6">' +
                '<div>${radius10}</div>' +
                '</div>' +
                '</div>' +
                '<div class="line line-dashed b-b line-lg pull-in"></div>' +
                '<div class="form-group">' +
                '<label class="col-sm-6 control-label font-bold">' + switchLang.switchLang("weatherService.twelfthCircleRadius") + ':</label>' +
                '<div class="col-sm-6">' +
                '<div>${radius12}</div>' +
                '</div>' +
                '</div>';
            return content;
        }
// 台风动画开始执行
        tphHistorty.playMovie = function (typhoonId, typhoonName) {
            if (tphHistorty.moveParam.isMove == false)return;

            var typhoonData = tphHistorty.typhoonData[typhoonId];
            var typhoonGraphicData = tphHistorty.moveParam.typhoonGraphic[typhoonId];
            var k = tphHistorty.moveParam.index[typhoonId];

            var typhoonObjk = typhoonData[k];
            typhoonObjk.typhoonId = typhoonId;
            var typhoonTime = typhoonObjk.time;
            //while(k < tphHistorty.moveParam.totlLength[typhoonId]){
            if (k < (tphHistorty.moveParam.totlLength[typhoonId] - 1)) {
                var typhoonObjkNext = typhoonData[k + 1];
                typhoonObjkNext.typhoonId = typhoonId;
                // 添加台风线
                var pArray = new Array();
                var mapPointF = esriMapService.getPointByCoords(parseFloat(typhoonObjk.lng), parseFloat(typhoonObjk.lat));
                var mapPointT = esriMapService.getPointByCoords(parseFloat(typhoonObjkNext.lng), parseFloat(typhoonObjkNext.lat));
                pArray.push(mapPointF);
                pArray.push(mapPointT);
                var line = new esri.geometry.Polyline(esriMapService.mapInstance.spatialReference);
                line.addPath(pArray);
                var lineGraphic = new esri.Graphic(line, tphHistorty.getLineSymbol(typhoonObjk.speed), 2);
                esriMapService.mapInstance.graphics.add(lineGraphic);
                typhoonGraphicData.push(lineGraphic)
                // 添加台风点
                if (k == 0) {
                    var graphic = new esri.Graphic(mapPointF, tphHistorty.getPointSymbol(typhoonObjk.speed));

                    var infoTemplate = new esri.InfoTemplate(typhoonTime + "--" + switchLang.switchLang("weatherService.historyTyphoonTitle"), tphHistorty.setTyphoonContext());
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
                    tphHistorty.moveParam.toPoint[typhoonId].setSymbol(tphHistorty.getPointSymbol(typhoonData[k - 1].speed));
                }
                /*----添加大风圈开始----*/
                var size = tphHistorty.getTphWindSize(typhoonObjk.speed);

                var symbol = tphHistorty.getCircleSymbol();
                var paths1 = tphHistorty.getCircleLinePaths(mapPointT, size);
                //var paths2 = tphHistorty.getCircleLinePaths(mapPointT, 50);

                var polygon1 = new esri.geometry.Polygon(esriMapService.mapInstance.spatialReference);
                polygon1.addRing(paths1);

                var graphic1 = new esri.Graphic(polygon1, symbol);
                if (k == 0 || tphHistorty.moveParam.circleGhBig[typhoonId] == null) {
                    tphHistorty.moveParam.circleGhBig[typhoonId] = graphic1;
                    tphHistorty.tphBufferGraphic.add(tphHistorty.moveParam.circleGhBig[typhoonId]);
                    typhoonGraphicData.push(graphic1)
                } else {
                    tphHistorty.moveParam.circleGhBig[typhoonId].setGeometry(polygon1);
                }

                //var polygon2 = new esri.geometry.Polygon(esriMapService.mapInstance.spatialReference);
                //polygon2.addRing(paths2);
                //var graphic2 = new esri.Graphic(polygon2, symbol);
                //台风图片
                var graphic2 = new esri.Graphic(mapPointT, tphHistorty.getTyphoonSymbol());
                if (k == 0 || tphHistorty.moveParam.circleGhSmall[typhoonId] == null) {
                    tphHistorty.moveParam.circleGhSmall[typhoonId] = graphic2;
                    esriMapService.mapInstance.graphics.add(tphHistorty.moveParam.circleGhSmall[typhoonId]);
                    typhoonGraphicData.push(graphic2)
                } else {
                    //tphHistorty.moveParam.circleGhSmall[typhoonId].setGeometry(polygon2);
                    tphHistorty.moveParam.circleGhSmall[typhoonId].setGeometry(mapPointT);
                }
                /*----添加大风圈结束.下面是不显示大风圈的做法----*/
                /*else {
                 jhdmap.map.graphics.remove(mas2js.tphHistorty.moveParam.circleGhBig[typhoonId]);
                 jhdmap.map.graphics.remove(mas2js.tphHistorty.moveParam.circleGhSmall[typhoonId]);
                 mas2js.tphHistorty.moveParam.circleGhBig[typhoonId] = null;
                 mas2js.tphHistorty.moveParam.circleGhSmall[typhoonId] = null;
                 }*/

                var graphic3 = new esri.Graphic(mapPointT, tphHistorty.getPointSymbol(typhoonObjk.speed));// mas2js.tphHistorty.getPointSymbol(typhoonObjkNext.windspeed)
                // tphHistorty.pointSymbol[1]
                var typhoonTime_second = typhoonObjkNext.time;
                var infoTemplate3 = new esri.InfoTemplate(typhoonTime_second + "--" + switchLang.switchLang("weatherService.historyTyphoonTitle"), tphHistorty.setTyphoonContext());
                graphic3.setInfoTemplate(infoTemplate3);
                typhoonObjkNext.strong = switchLang.switchLang(typhoonObjkNext.strong);
                typhoonObjkNext.movedirection = switchLang.switchLang(typhoonObjkNext.movedirection);
                typhoonObjkNext.radius7 = typhoonObjkNext.radius7 ? (typhoonObjkNext.radius7 + 'KM') : '-';
                typhoonObjkNext.radius10 = typhoonObjkNext.radius10 ? (typhoonObjkNext.radius10 + 'KM') : '-';
                typhoonObjkNext.radius12 = typhoonObjkNext.radius12 ? (typhoonObjkNext.radius12 + 'KM') : '-';

                graphic3.setAttributes(typhoonObjkNext);
                esriMapService.mapInstance.graphics.add(graphic3);
                typhoonGraphicData.push(graphic3)
                tphHistorty.moveParam.toPoint[typhoonId] = graphic3;
                // mas2js.tphHistorty.extent2GraphicsLayer();

            } else {
                tphHistorty.moveParam.toPoint[typhoonId].setSymbol(tphHistorty.getPointSymbol(typhoonObjk.speed));
                tphHistorty.setPlayMovieText(true);
                //最后一个站点不缓冲
                //tphHistorty.bufferGraphics(tphHistorty.moveParam.toPoint[typhoonId], 100, typhoonId)
                //tphHistorty.showTphWarnTrack(typhoonObjk)
                //esriMapService.mapInstance.graphics.remove(tphHistorty.moveParam.circleGhBig[typhoonId]);
                //esriMapService.mapInstance.graphics.remove(tphHistorty.moveParam.circleGhSmall[typhoonId]);
                //tphHistorty.moveParam.circleGhBig[typhoonId] = null;
                //tphHistorty.moveParam.circleGhSmall[typhoonId] = null;

            }
            k = k + 1;
            tphHistorty.moveParam.index[typhoonId] = k;
            window.setTimeout("tphHistorty.playMovie('" + typhoonId + "','" + typhoonName + "')", 20);
            // modify end
            // tphHistorty.bindMouseClickListener();
            //}

        }

        tphHistorty.bufferGraphics = function (pointGraphic, distance, typhoonId) {
            esriMapService.bufferGraphics(pointGraphic.geometry, distance, function (bufferedGeometries) {
                tphHistorty.getBufferStation(bufferedGeometries[0], typhoonId);
                angular.forEach(bufferedGeometries, function (geometry, key) {
                    var graphic = null;
                    if (tphHistorty.moveParam.circleGhBuffer[typhoonId]) {
                        graphic = tphHistorty.moveParam.circleGhBuffer[typhoonId];
                        graphic.setGeometry(geometry)
                    } else {
                        var symbol = tphHistorty.getBufferSymbol();
                        graphic = new esri.Graphic(geometry, symbol);
                        tphHistorty.moveParam.circleGhBuffer[typhoonId] = graphic;
                        tphHistorty.tphBufferGraphic.add(graphic);
                        tphHistorty.moveParam.typhoonGraphic[typhoonId].push(graphic);
                    }
                });

            }, function (errobj) {
                console.dir(errobj);
            });
        }
        //求缓冲面的四角坐标点并将缓冲区左移
        tphHistorty.getBufferCoordinate = function (polygon) {

            var rings = polygon.rings[0];
            var minx = rings[0][0], miny = rings[0][1], maxx = rings[0][0], maxy = rings[0][1];
            angular.forEach(rings, function (value, index) {
                var x = value[0], y = value[1];
                minx = Math.min(minx, x);
                miny = Math.min(miny, y);
                maxx = Math.max(maxx, x);
                maxy = Math.max(maxy, y);
            });
            //将缓冲区左移
            var lng = maxx + (maxx - minx)/2.0;
            var lat = miny + (maxy - miny)/2.0;
            var leftPoint = esriMapService.getPointByCoords(lng, lat);
            esriMapService.mapInstance.centerAndZoom(leftPoint, 6);
            return {xmin: minx, ymin: miny, xmax: maxx, ymax: maxy, station_levl: "'11'", maplevel: 'less5'};
        }
        //得到缓冲区对应的站点并在地图上进行叠加
        tphHistorty.stationObj={};
        tphHistorty.stationZoomEnd = null;
        tphHistorty.getBufferStation = function (polygon, typhoonId) {
            var bufferCoordinate = tphHistorty.getBufferCoordinate(polygon);
            if(!tphHistorty.stationObj[typhoonId]){
                tphHistorty.stationObj[typhoonId] = {};
            }
            tphHistorty.stationZoomEnd = esriMapService.mapInstance.on('zoom-end', function (obj) {
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
                if(tphHistorty.stationObj[typhoonId].currentLevel != bufferCoordinate.maplevel ){
                    tphHistorty.stationObj[typhoonId].currentLevel = bufferCoordinate.maplevel;
                    tphHistorty.loadContryAutoStation(bufferCoordinate,typhoonId,polygon);
                }
            });
            tphHistorty.stationObj[typhoonId].currentLevel = bufferCoordinate.maplevel;
            tphHistorty.loadContryAutoStation(bufferCoordinate,typhoonId,polygon);

        }
        tphHistorty.loadContryAutoStation = function(bufferCoordinate,typhoonId,polygon){
            $http({
                method: 'POST',
                url: 'weatherData/getContryAutoStation',
                data: bufferCoordinate
            }).success(function (data) {
                tphHistorty.tphStationLayer.clear();
                dojo.forEach(data.result, function (station) {
                    var stationPoint = esriMapService.getPointByCoords(station.lon, station.lat);
                    if(polygon.contains(stationPoint)){
                        //graphic.setInfoTemplate(infoTemplate);
                        var pictureType = station.station_levl=='14'? "pointPicture2" : "pointPicture";
                        symbol = esriMapService.getSymbolByType(pictureType);

                        var stationGraphic = new esri.Graphic(stationPoint, symbol);
                        stationGraphic.setAttributes(station);
                        tphHistorty.tphStationLayer.add(stationGraphic);
                        tphHistorty.moveParam.typhoonGraphic[typhoonId].push(stationGraphic);

                        /*var textSymbol = new esri.symbol.TextSymbol(station.station_name, new esri.symbol.Font(), new dojo.Color([255, 126, 0]));
                         textSymbol.setOffset(30, -6);
                         var textGraphic = new esri.Graphic(stationPoint, textSymbol);
                         tphHistorty.tphStationLayer.add(textGraphic);
                         tphHistorty.moveParam.typhoonGraphic[typhoonId].push(textGraphic);*/
                    }
                });
            })
        }

// 获得台风 线的样式
        tphHistorty.getLineSymbol = function (windspeed) {
            if (windspeed < 10.8) {
                return tphHistorty.lineSymbol[0];
            } else if (windspeed < 17.1) {
                return tphHistorty.lineSymbol[1];
            } else if (windspeed < 24.4) {
                return tphHistorty.lineSymbol[2];
            } else if (windspeed < 32.6) {
                return tphHistorty.lineSymbol[3];
            } else if (windspeed < 41.4) {
                return tphHistorty.lineSymbol[4];
            } else if (windspeed <= 50.9) {
                return tphHistorty.lineSymbol[5];
            } else if (windspeed > 50.9) {
                return tphHistorty.lineSymbol[6];
            }
        }

// 获得台风 预警线的样式
        tphHistorty.getWarnLineSymbol = function (windspeed) {
            if (windspeed < 10.8) {
                return tphHistorty.warnLineSymbol[0];
            } else if (windspeed < 17.1) {
                return tphHistorty.warnLineSymbol[1];
            } else if (windspeed < 24.4) {
                return tphHistorty.warnLineSymbol[2];
            } else if (windspeed < 32.6) {
                return tphHistorty.warnLineSymbol[3];
            } else if (windspeed < 41.4) {
                return tphHistorty.warnLineSymbol[4];
            } else if (windspeed <= 50.9) {
                return tphHistorty.warnLineSymbol[5];
            } else if (windspeed > 50.9) {
                return tphHistorty.warnLineSymbol[6];
            }
        }
        // 不同国家对应不同的预测线
        tphHistorty.getStateLineSymbol = function (orgnization) {
            if ("中国" == orgnization) {
                return tphHistorty.warnLineSymbol[0];
            } else if ("中国台湾" == orgnization) {
                return tphHistorty.warnLineSymbol[1];
            } else if ("中国香港" == orgnization) {
                return tphHistorty.warnLineSymbol[2];
            } else if ("日本" == orgnization) {
                return tphHistorty.warnLineSymbol[3];
            } else if ("美国" == orgnization) {
                return tphHistorty.warnLineSymbol[4];
            } else if ("韩国" == orgnization) {
                return tphHistorty.warnLineSymbol[5];
            } else if ("欧洲" == orgnization) {
                return tphHistorty.warnLineSymbol[6];
            }
        }
// 获得台风 点的样式
        tphHistorty.getPointSymbol = function (windspeed) {
            if (windspeed < 10.8) {
                return tphHistorty.pointSymbol[0];
            } else if (windspeed < 17.1) {
                return tphHistorty.pointSymbol[1];
            } else if (windspeed < 24.4) {
                return tphHistorty.pointSymbol[2];
            } else if (windspeed < 32.6) {
                return tphHistorty.pointSymbol[3];
            } else if (windspeed < 41.4) {
                return tphHistorty.pointSymbol[4];
            } else if (windspeed <= 50.9) {
                return tphHistorty.pointSymbol[5];
            } else if (windspeed > 50.9) {
                return tphHistorty.pointSymbol[6];
            }
        }

// 获得大风圈大小
        tphHistorty.getTphWindSize = function (windspeed) {
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
        tphHistorty.pointSymbol = [
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
        tphHistorty.lineSymbol = [
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([76, 238, 223]), 3),
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([76, 238, 223]), 3),
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([144, 244, 109]), 3),
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 242, 2]), 3),
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 126, 0]), 3),
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([247, 26, 8]), 3),
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([148, 14, 233]), 3)
        ];

// 台风线样式数组
        tphHistorty.warnLineSymbol = [
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([76, 238, 223]), 2),
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([76, 238, 223]), 2),
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([144, 244, 109]), 2),
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 242, 2]), 2),
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 126, 0]), 2),
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([247, 26, 8]), 2),
            new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([148, 14, 233]), 2)
        ];

// 获取 圆型标注样式
        tphHistorty.getCircleSymbol = function () {
            return new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([39, 194, 76, 0.65]), 2),
                new dojo.Color([39, 194, 76, 0.35])
            )
        }
        tphHistorty.getTyphoonSymbol = function () {
            return new esri.symbol.PictureMarkerSymbol("img/mapstyle/typhoon.gif", 40, 40);
        }
        tphHistorty.getBufferSymbol = function () {
            return new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0, 1]), 2), new dojo.Color([255, 170, 37, 0]));
        }
        // 计算圆形边线数据
        tphHistorty.getCircleLinePaths = function (centerPoint, size) {
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
        tphHistorty.typhoonTableInstance = {}
        tphHistorty.advanceSearchObj = {};
        tphHistorty.advanceSearch = function (param) {
            tphHistorty.advanceSearchObj = param;
            tphHistorty.typhoonTableInstance.typhoonInfo.bootstrapTable('refresh');
        }
        //台风信息列表
        tphHistorty.typhoonInfoTable = function (pageSize, callBackFun) {
            var startTime, endTime;
            var longTime = new Date().getTime() - (1000 * 60 * 60 * 24 * 365);
            startTime = insureUtil.dateToString(new Date(longTime), "yyyy/MM/dd");
            endTime = insureUtil.dateToString(new Date(), "yyyy/MM/dd");
            return {
                pageList: ['All'],
                url: 'weatherData/typhoonInfo?view=select',
                resultTag: 'result',
                classes: "table-no-bordered",
                pageSize: pageSize,
                height: 170,
                method: "post",
                hidePaginationInfo: true,
                checkboxHeader: false,
                maintainSelected: true,
                queryParams: function (params) {
                    angular.extend(params, {
                        startTime: startTime,
                        endTime: endTime
                    }, tphHistorty.advanceSearchObj);
                    return params;
                },
                onCheck: function (row) {
                    tphHistorty.typhoonTableInstance = callBackFun(row.name + "--");
                    tphHistorty.showTyphoonPath("", row)
                },
                onUncheck: function (row) {
                    tphHistorty.showTyphoonPath("uncheck", row)
                },
                onLoadSuccess: function (data) {
                    //$("table td").css({border: "none"})
                    //$("table th").css({border: "none"})
                    tphHistorty.typhoonTableInstance = callBackFun("");
                },
                columns: [{
                    checkbox: true,
                    width: '10%'
                }, {
                    title: switchLang.switchLang('weatherService.time'),
                    class: 'col-md-1',
                    field: 'starttime',
                    align: 'center',
                    sortable: false,
                    width: '10%',
                    formatter: function (value, row, index) {
                        var res = value.substring(0, value.indexOf("/", 5)) + "";
                        return res;
                    }
                }, {
                    title: switchLang.switchLang('weatherService.code'),
                    class: 'col-md-1',
                    field: 'tfid',
                    align: 'center',
                    sortable: false,
                    width: '10%',
                    formatter: function (value, row, index) {
                        return value;
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

        tphHistorty.typhoonInfoIds = "";

        //根据checkbox选中情况来展示台风
        tphHistorty.showTyphoonPath = function (tag, row) {
            if (tag == "uncheckAll" || tag == "uncheck") {
                tphHistorty.typhoonUncheckIds = row.tfid;
                if(tphHistorty.stationZoomEnd){
                    tphHistorty.stationZoomEnd.remove();
                }
            } else {
                tphHistorty.typhoonInfoIds = "'" + row.tfid + "'";
                tphHistorty.typhoonTableInstance.typhoonPath.bootstrapTable('refresh');
            }

            if (tphHistorty.typhoonData[tphHistorty.typhoonInfoIds.replace(/'/g, "")]) {
                tphHistorty.playMovieInit(tphHistorty.typhoonInfoIds, tag, tphHistorty.typhoonUncheckIds);
            }
        }
        //台风路径列表
        tphHistorty.typhoonPathTable = {
            pageList: ['All'],
            url: 'weatherData/getTyphoon2Map',
            resultTag: 'result',
            classes: "table-no-bordered",
            pageSize: 5,
            height: 170,
            hidePaginationInfo: true,
            queryParams: function (params) {
                angular.extend(params, {
                    view: "select",
                    typhoonIds: tphHistorty.typhoonInfoIds
                });
                return params;
            },
            onLoadSuccess: function (data) {
                //$("table td").css({border: "none"})
                //$("table th").css({border: "none"})
                if (data.rows && data.rows.length > 0) {
                    var typooonParentId = data.rows[0].tfid;
                    var typhoonGraphicCache = tphHistorty.moveParam.typhoonGraphic[typooonParentId];
                    if (!typhoonGraphicCache) {
                        tphHistorty.typhoonData[typooonParentId] = data.rows;
                        tphHistorty.moveParam.typhoonObj[typooonParentId] = {
                            typhoonName: data.rows[0].name,
                            warnlevel: data.rows[0].warnlevel
                        }
                        tphHistorty.moveParam.index[typooonParentId] = 0;
                        tphHistorty.moveParam.totlLength[typooonParentId] = data.rows.length;
                    }
                    //tphHistorty.setPlayMovieText(false);
                    //tphHistorty.moveParam.typhoonGraphic[typooonParentId] = [];
                    //tphHistorty.playMovie(typooonParentId,data[0].name);
                    if (!tphHistorty.typhoonAfterTag[typooonParentId]) {
                        tphHistorty.playMovieInit(typooonParentId, null, "");
                        tphHistorty.typhoonAfterTag[typooonParentId] = "hasInit";
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
                    return value + "°E|" + row.lat + "°N";
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


        return tphHistorty;
    }]);

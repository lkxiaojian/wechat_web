// create the esriMap module
var esriMap = angular.module('map', []);

// create an object to wrap the ESRI Map OPbject
var mapObjectWrapper = {
    map: undefined,
    mapInstance: undefined,
    resizeDiv: function (mapH, mapW) {
        var resizeTimer;

        function resize() {
            if (dojo.byId("mapID")) {
                dojo.style(dojo.byId("mapID"), {
                    'height': mapH + 'px',
                    'width': mapW + 'px'
                });
                mapObjectWrapper.mapInstance.resize();
                mapObjectWrapper.mapInstance.reposition();
            }
        }

        resize();
        if (!mapH && !mapW) {
            mapH = $(window).height() - 70;
            mapW = $(window).width() - 70;
        }
        mapObjectWrapper.mapInstance.on('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                resize();
            }, 500);
        });
    },
    getMapExtent: function (xmin, ymin, xmax, ymax) {
        var extent = new esri.geometry.Extent(xmin, ymin, xmax, ymax, jhdmap.map.spatialReference);
        return extent;
    },
    setMapExtent: function (extent, level) {
        var mapExtent = new esri.geometry.Extent(extent.xmin, extent.ymin, extent.xmax, extent.ymax, this.mapInstance.spatialReference);
        if (this.mapInstance.setExtent) {
            this.mapInstance.setExtent(mapExtent, true);
        }
        if (level) {
            this.mapInstance.centerAndZoom(mapExtent.getCenter(), level);
        }
    },
    getPointByCoords: function (x, y) { // 通过坐标得到 地图点
        var mapPoint = new esri.geometry.Point(x, y, this.mapInstance.spatialReference);
        return mapPoint;
    },
    toScreen: function (mapPoint) {
        return this.mapInstance.toScreen(mapPoint);
    },
    showInfoWindow: function (mapPoint, title, content, width, height) {
        var infoWindow = this.mapInstance.infoWindow;
        infoWindow.setTitle(title);
        infoWindow.setContent(content);
        if (!width || !height) {
            infoWindow.resize(350, 198);
        } else {
            infoWindow.resize(width, height);
        }
        infoWindow._contentPane.style.height = height + "px";
        infoWindow.show(this.toScreen(mapPoint), this.mapInstance.getInfoWindowAnchor(this.toScreen(mapPoint)));
    },
    showInfoLTWindow: function (mapPoint, title, content, width, height) {
        var infoWindow = this.mapInstance.infoWindow;
        infoWindow.setTitle(title);
        infoWindow.setContent(content);
        if (!width || !height) {
            infoWindow.resize(350, 198);
        } else {
            infoWindow.resize(width, height);
        }
        var p = this.toScreen(mapPoint);
        p.setX(49);
        p.setY(-12);

        infoWindow.show(p, this.mapInstance.getInfoWindowAnchor(p));
    },
    hideInfoWindow: function () {
        this.mapInstance.infoWindow.hide();
    },
    geometryService: function () {
        var gsvc = new esri.tasks.GeometryService("https://sampleserver1.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer");
        return gsvc;
    },
    bufferGraphics: function (mapPoint, distance, callback, errback) {// 通过某点，获取周边分析缓冲图
        //var symbol = new esri.symbol.SimpleMarkerSymbol();
        //var graphic = new esri.Graphic(mapPoint, symbol);

        var params = new esri.tasks.BufferParameters();
        params.geometries = [mapPoint];

        params.inSpatialReference = new esri.SpatialReference({wkid: 4326})
        params.outSpatialReference = new esri.SpatialReference({wkid: 4326})
        params.bufferSpatialReference = new esri.SpatialReference({wkid: 102113})
        params.distances = [distance];
        params.unit = esri.tasks.GeometryService.UNIT_KILOMETER;

        this.geometryService().buffer(params, callback, errback);
    },
    measureDistance: function () { //测距
        this.mapInstance.spatialReference.wkid = 4326;
        var tb = new esri.toolbars.Draw(jhdmap.map);
        dojo.connect(tb, "onDrawEnd", function (geometry) {
            mapObjectWrapper.mapInstance.graphics.clear();
            var graphic = mapObjectWrapper.mapInstance.graphics.add(new esri.Graphic(geometry, new esri.symbol.SimpleLineSymbol()));
            this.geometryService.project([graphic], new esri.SpatialReference({
                "wkid": 32650
            }));

        });
        tb.activate(esri.toolbars.Draw.POLYLINE);
    },
    printMap: function (domObj) {
        var printer = new esri.dijit.Print({
            map: esriMapService.mapInstance,
            url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
        }, domObj);//dojo.byId("printButton")
        printer.startup();
    },
    areasAndLengths: function (geometryArr, callback, errback) {//求面积和周长
        var projectParameters = new esri.tasks.ProjectParameters();
        var geometryService = this.geometryService();
        projectParameters.geometries = geometryArr;
        projectParameters.outSR = new esri.SpatialReference({'wkid': 102009});//因为此处用的geometryService是sampleserver1
        geometryService.project(projectParameters, function (geometries) {
            if (geometries && geometries.length > 0) {
                geometryArr = geometries;
            }
            //setup the parameters for the areas and lengths operation
            var areasAndLengthParams = new esri.tasks.AreasAndLengthsParameters();
            areasAndLengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_KILOMETER;
            areasAndLengthParams.areaUnit = esri.tasks.GeometryService.UNIT_SQUARE_KILOMETERS;
            areasAndLengthParams.calculationType = "geodesic";
            areasAndLengthParams.polygons = geometryArr;
            geometryService.simplify(geometryArr, function (simplifiedGeometries) {
                areasAndLengthParams.polygons = simplifiedGeometries;
                geometryService.areasAndLengths(areasAndLengthParams, callback, errback);
            }, function (err) {
                console.log(err)
            });
        }, function (err) {
            console.log(err)
        });
    },
    measureArea: function () { //测面
        var tb = new esri.toolbars.Draw(jhdmap.map);
        dojo.connect(tb, "onDrawEnd", function (geometry) {
            this.mapInstance.graphics.clear();
            var gc = this.mapInstance.graphics.add(new esri.Graphic(geometry, new esri.symbol.SimpleFillSymbol()));
            this.geometryService.project([gc], new esri.SpatialReference({
                "wkid": 32650
            }));

        });
        tb.activate(esri.toolbars.Draw.POLYGON);
    },
    getMapExtent: function (xmin, ymin, xmax, ymax) {
        var extent = new esri.geometry.Extent(xmin, ymin, xmax, ymax, this.mapInstance.spatialReference);
        return extent;
    },
    addLineGeometry: function (geometry) {
        var symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color("#0000FF"), 2);
        var graphic = new esri.Graphic(geometry, symbol);
        this.mapInstance.graphics.add(graphic);
    },
    getSymbolByType: function (type) { // 通过图形type得到样式
        var symbol;

        switch (type) {
            case "point":
                symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 17, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0]), 1), new dojo.Color([255, 0, 0, 0.6]));
                break;
            case "pointPicture":
                symbol = new esri.symbol.PictureMarkerSymbol("img/mapstyle/weizhi1.png", 19, 26);
                break;
            case "pointPicture2":
                symbol = new esri.symbol.PictureMarkerSymbol("img/mapstyle/weizhi2.png", 19, 26);
                break;
            case "pointPicture3":
                symbol = new esri.symbol.PictureMarkerSymbol("img/mapstyle/weizhi3.png", 19, 26);
                break;
            case "polyline":
                symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 0]), 1);
                break;
            case "polygon":
                symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_NONE, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 0, 0, 0.25]));
                break;
            case "extent":
                symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_NONE, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 0, 0, 0.25]));
                break;
            case "multipoint":
                symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 10, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 1), new dojo.Color([255, 0, 0, 1]));
                break;
        }
        return symbol;
    },
    areaXY: {
        "ALL": {name: "中国及周边", xmin: 70, ymin: 10, xmax: 150, ymax: 60},
        "110000": {
            name: "北京",
            xmin: 114.916519165,
            ymin: 38.9424667360001,
            xmax: 117.999198914,
            ymax: 41.5586090090001
        },
        "340000": {name: "安徽", xmin: 114.379386902, ymin: 28.89522171, xmax: 120.144439697, ymax: 35.1537437440001},
        "350000": {name: "福建", xmin: 115.349868774, ymin: 23.0691185000001, xmax: 121.221336365, ymax: 28.810081482},
        "620000": {
            name: "甘肃",
            xmin: 92.2641601560001,
            ymin: 32.0939712520001,
            xmax: 109.214057922,
            ymax: 43.2947540280001
        },
        "440000": {name: "广东", xmin: 109.161376953, ymin: 19.717283249, xmax: 117.804153442, ymax: 26.0186443330001},
        "450000": {
            name: "广西",
            xmin: 103.982917786,
            ymin: 20.3970756530001,
            xmax: 112.556900024,
            ymax: 26.8863906860001
        },
        "520000": {
            name: "贵州",
            xmin: 103.102462769,
            ymin: 24.1261959080001,
            xmax: 110.085716248,
            ymax: 29.7191638950001
        },
        "460000": {
            name: "海南",
            xmin: 108.116287231,
            ymin: 5.81864118600009,
            xmax: 118.314598083,
            ymax: 20.6652565000001
        },
        "130000": {
            name: "河北",
            xmin: 112.960273743,
            ymin: 35.5462226870001,
            xmax: 120.348297119,
            ymax: 43.1211700440001
        },
        "410000": {name: "河南", xmin: 109.854789734, ymin: 30.8844585420001, xmax: 117.141082764, ymax: 36.870563507},
        "230000": {
            name: "黑龙江",
            xmin: 120.684318542,
            ymin: 42.9187049870001,
            xmax: 135.585830688,
            ymax: 54.0579261780001
        },
        "420000": {name: "湖北", xmin: 107.869613647, ymin: 28.536144257, xmax: 116.628326416, ymax: 33.7760887150001},
        "430000": {
            name: "湖南",
            xmin: 108.283111572,
            ymin: 24.1341991420001,
            xmax: 114.753929138,
            ymax: 30.6280059810001
        },
        "220000": {name: "吉林", xmin: 121.125267029, ymin: 40.359706879, xmax: 131.814407349, ymax: 46.7999572750001},
        "320000": {name: "江苏", xmin: 115.85635376, ymin: 30.262845993, xmax: 122.399520874, ymax: 35.6280593870001},
        "360000": {
            name: "江西",
            xmin: 113.073402405,
            ymin: 23.9870414730001,
            xmax: 118.981010437,
            ymax: 30.5799808500001
        },
        "210000": {name: "辽宁", xmin: 118.334869385, ymin: 38.2202339170001, xmax: 126.287406921, ymax: 43.990642548},
        "150000": {name: "内蒙古", xmin: 96.668746948, ymin: 36.907787323, xmax: 126.575637817, ymax: 53.8326492310001},
        "640000": {name: "宁夏", xmin: 103.79385376, ymin: 34.7353553770001, xmax: 108.151748657, ymax: 39.8808784480001},
        "630000": {name: "青海", xmin: 88.90007782, ymin: 31.042411804, xmax: 103.559593201, ymax: 39.839595795},
        "370000": {name: "山东", xmin: 114.297737122, ymin: 33.8869819640001, xmax: 123.199897766, ymax: 38.905010223},
        "140000": {name: "山西", xmin: 109.748031616, ymin: 34.0915298460001, xmax: 115.045372009, ymax: 41.241592407},
        "610000": {name: "陕西", xmin: 104.991790771, ymin: 31.212747574, xmax: 111.748123169, ymax: 40.082336426},
        "310000": {name: "上海", xmin: 120.358161926, ymin: 30.190925598, xmax: 122.402648926, ymax: 32.3503074650001},
        "510000": {name: "四川", xmin: 96.856208801, ymin: 25.547668457, xmax: 109.034233093, ymax: 34.812778473},
        "710000": {name: "台湾", xmin: 118.816467285, ymin: 21.254276276, xmax: 125.076187134, ymax: 26.4481296540001},
        "120000": {name: "天津", xmin: 116.204483032, ymin: 38.0695457460001, xmax: 118.562812805, ymax: 40.744033813},
        "540000": {
            name: "西藏",
            xmin: 77.8962173460001,
            ymin: 26.3549842830001,
            xmax: 99.6118011470001,
            ymax: 36.9857902530001
        },
        "650000": {name: "新疆", xmin: 72.9469604490001, ymin: 33.83298111, xmax: 96.8837509160001, ymax: 49.677589417},
        "530000": {name: "云南", xmin: 97.02911377, ymin: 20.6446723940001, xmax: 106.694206238, ymax: 29.7509918210001},
        "330000": {
            name: "浙江",
            xmin: 117.528266907,
            ymin: 26.6444683070001,
            xmax: 123.451927185,
            ymax: 31.6827316280001
        },
        "500000": {
            name: "重庆",
            xmin: 104.787216187,
            ymin: 27.6641273500001,
            xmax: 110.690429687,
            ymax: 32.7120437620001
        },
        "NJ": {name: "嫩江流域", xmin: 122.44, ymin: 43.94, xmax: 127.56, ymax: 49.06},
        "LH": {name: "辽河流域", xmin: 119.94, ymin: 39.94, xmax: 125.06, ymax: 45.06},
        "HA": {name: "海河流域", xmin: 113.94, ymin: 36.94, xmax: 119.06, ymax: 42.06},
        "HH": {name: "黄河流域", xmin: 111.94, ymin: 31.94, xmax: 117.06, ymax: 37.06},
        "HI": {name: "淮河流域", xmin: 115.44, ymin: 30.44, xmax: 120.56, ymax: 35.56},
        "HS": {name: "汉水流域", xmin: 109.94, ymin: 29.94, xmax: 115.06, ymax: 35.06},
        "TH": {name: "太湖流域", xmin: 117.94, ymin: 28.94, xmax: 123.06, ymax: 34.06},
        "SC": {name: "四川地区", xmin: 102.94, ymin: 27.94, xmax: 108.06, ymax: 33.06},
        "DT": {name: "洞庭湖流域", xmin: 109.94, ymin: 26.94, xmax: 115.04, ymax: 31.52},
        "PY": {name: "鄱阳湖流域", xmin: 114.94, ymin: 26.44, xmax: 120.06, ymax: 31.56},
        "FJ": {name: "福建地区", xmin: 114.94, ymin: 26.44, xmax: 120.06, ymax: 31.56},
        "GZ": {name: "贵州地区", xmin: 104.94, ymin: 23.44, xmax: 110.06, ymax: 28.56},
        "YJ": {name: "邕江", xmin: 104.94, ymin: 20.94, xmax: 110.06, ymax: 26.06},
        "ZJ": {name: "珠江流域", xmin: 109.94, ymin: 20.94, xmax: 115.06, ymax: 26.06},
        "XJ": {name: "新疆地区", xmin: 83.94, ymin: 44.94, xmax: 89.06, ymax: 50.06},
        "ZD": {name: "西藏扎达", xmin: 78.94, ymin: 31.94, xmax: 80.06, ymax: 33}
    },
    selAreaDraw2: function (xmin, ymin, xmax, ymax) {
        if (xmin == "0.0" || ymin == "0.0" || xmax == "0.0" || ymax == "0.0") return;

        var mapExtent = this.getMapExtent(xmin, ymin, xmax, ymax);
        this.addLineGeometry(mapExtent);

//		var mapExtent2 = jhdmap.core.getMapExtent(xmin-0.1, ymin-0.1, xmax-0.1, ymax-0.1);
//        this.centerToExtent(xmin, ymin, xmax, ymax, 8);
        this.leftToExtent(xmin, ymin, xmax, ymax, 5);
    },
    centerToExtent: function (xmin, ymin, xmax, ymax, scale) {
        //scale 越大 框越大
        var xc = (parseFloat(xmax) - parseFloat(xmin)) / scale;
        var yc = (parseFloat(ymax) - parseFloat(ymin)) / scale;

        var x1 = parseFloat(xmin) - xc;
        var x2 = parseFloat(xmax) + xc;
        var y1 = parseFloat(ymin) - yc;
        var y2 = parseFloat(ymax) + yc;

        var p1 = this.getPointByCoords(x1, y1);
        var p2 = this.getPointByCoords(x1, y2);
        var p3 = this.getPointByCoords(x2, y2);
        var p4 = this.getPointByCoords(x2, y1);
        var line = new esri.geometry.Polyline(this.mapInstance.spatialReference);
        line.addPath([p1, p2, p3, p4, p1]);
        this.mapInstance.setExtent(line.getExtent(), true);
    },
    leftToExtent: function (xmin, ymin, xmax, ymax, scale, flag) {
        //只需将xmax变成xmin,将原来的xmax+（parseFloat(xmax) - parseFloat(xmin)）
        var xdistance = parseFloat(xmax) - parseFloat(xmin);
        xmin = xmax;
        xmax = xmax + xdistance;
        //scale 越大 框越大
        var xc = xdistance / scale;
        var yc = (parseFloat(ymax) - parseFloat(ymin)) / scale;

        var x1 = parseFloat(xmin) - xc;
        var x2 = parseFloat(xmax) + xc;
        var y1 = parseFloat(ymin) - yc;
        var y2 = parseFloat(ymax) + yc;

        var p1 = this.getPointByCoords(x1, y1);
        var p2 = this.getPointByCoords(x1, y2);
        var p3 = this.getPointByCoords(x2, y2);
        var p4 = this.getPointByCoords(x2, y1);
        var line = new esri.geometry.Polyline(this.mapInstance.spatialReference);
        line.addPath([p1, p2, p3, p4, p1]);
        if (!flag) {
            this.mapInstance.setExtent(line.getExtent(), true);
        }
    }
};

// create an AngularJS Factory that can provide the map object to AngularJS controllers
esriMap.factory('esriMapService', function () {
    return mapObjectWrapper;
})

// the DOJO-ish code which loads the map object; saves it to the mapObjectWrapper
require(['esri/map', 'esri/config', 'esri/tasks/QueryTask', 'esri/tasks/query', 'esri/layers/GraphicsLayer', 'esri/dijit/Print',
        'esri/tasks/BufferParameters', 'esri/tasks/GeometryService', 'esri/toolbars/draw',
        'esri/tasks/ProjectParameters', 'esri/tasks/AreasAndLengthsParameters'],
    function (Map, esriConfig, QueryTask, Query, GraphicsLayer, Print, BufferParameters, GeometryService, Draw,
              ProjectParameters, AreasAndLengthsParameters) {
        //XMLHttpRequest cannot load http://services.arcgisonline.com/ArcGIS/rest/info?f=json.
        // No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost' is therefore not allowed access.
        esriConfig.defaults.io.corsDetection = false;//加上这个忽略浏览器报的 CORS 错误
        mapObjectWrapper.map = Map;
        mapObjectWrapper.QueryTask = QueryTask;
        mapObjectWrapper.Query = Query;

        if (mapObjectWrapper.scope) {
            mapObjectWrapper.scope.recreateMap();
        }

    });


// create the map directive
esriMap.directive('esriMap', function () {
    return {
        restrict: 'EA',
        // the directive's actual code code is in the MapController set up below this
        controller: 'MapController',
        // the link just calls the init method in the controller
        link: function (scope, element, attrs, ctrl) {
            ctrl.init(element);
        }
    };
});

esriMap.controller('MapController', ['$rootScope', '$scope', '$attrs', 'esriMapService', function ($rootScope, $scope, $attrs, esriMapService) {
    var flag = 'img';

    //加载天地图的底图
    dojo.declare("TianDiTiledMapServiceLayer", esri.layers.TiledMapServiceLayer, {
        constructor: function () {
            this.spatialReference = new esri.SpatialReference({wkid: 4326});
            this.initialExtent = (this.fullExtent = new esri.geometry.Extent(65, 4, 135, 63, this.spatialReference));
            this.tileInfo = new esri.layers.TileInfo({
                "rows": 256,
                "cols": 256,
                "compressionQuality": 0,
                "origin": {"x": -180, "y": 90},
                "spatialReference": {"wkid": 4326},
                "lods": [
                    {"level": 0, "resolution": 0.703125, "scale": 295497593.05875},
                    {"level": 1, "resolution": 0.3515625, "scale": 147748796.529375},
                    {"level": 2, "resolution": 0.17578125, "scale": 73874398.264688},
                    {"level": 3, "resolution": 0.087890625, "scale": 36937199.132344},
                    {"level": 4, "resolution": 0.0439453125, "scale": 18468599.566172},
                    {"level": 5, "resolution": 0.02197265625, "scale": 9234299.783086},
                    {"level": 6, "resolution": 0.010986328125, "scale": 4617149.891543},
                    {"level": 7, "resolution": 0.0054931640625, "scale": 2308574.945771},
                    {"level": 8, "resolution": 0.00274658203125, "scale": 1154287.472886},
                    {"level": 9, "resolution": 0.001373291015625, "scale": 577143.736443},
                    {"level": 10, "resolution": 0.0006866455078125, "scale": 288571.86822143558},
                    {"level": 11, "resolution": 0.00034332275390625, "scale": 144285.93411071779},
                    {"level": 12, "resolution": 0.000171661376953125, "scale": 72142.967055358895},
                    {"level": 13, "resolution": 8.58306884765625e-005, "scale": 36071.483527679447},
                    {"level": 14, "resolution": 4.291534423828125e-005, "scale": 18035.741763839724},
                    {"level": 15, "resolution": 2.1457672119140625e-005, "scale": 9017.8708819198619},
                    {"level": 16, "resolution": 1.0728836059570313e-005, "scale": 4508.9354409599309},
                    {"level": 17, "resolution": 5.3644180297851563e-006, "scale": 2254.4677204799655}]
            });
            this.loaded = true;
            this.onLoad(this);
        },
        getTileUrl: function (level, row, col) {
            var levelMap = "";
            if (level < 10) {
                levelMap = "A0512_EMap";
            } else if (level < 12) {
                levelMap = "B0627_EMap1112";
            } else if (level < 18) {
                levelMap = "siwei0608";
            }
            if (flag == 'img') {
                return "http://t1.tianditu.cn/DataServer?T=img_c&" + levelMap + "&X=" + col + "&Y=" + row + "&L=" + (level * 1 + 1);
            }
            if (flag == 'vec') {
                return "http://t1.tianditu.cn/DataServer?T=vec_c&" + levelMap + "&X=" + col + "&Y=" + row + "&L=" + (level * 1 + 1);
            }
        }
    });

    //加载中文注释图
    dojo.declare("TianDiChBiaoZhuMapServiceLayer", TianDiTiledMapServiceLayer, {
        getTileUrl: function (level, row, col) {
            if (flag == 'img') {
                return "http://t1.tianditu.cn/DataServer?T=cia_c&X=" + col + "&Y=" + row + "&L=" + (level * 1 + 1);
            }
            if (flag == 'vec') {
                return "http://t1.tianditu.cn/DataServer?T=cva_c&X=" + col + "&Y=" + row + "&L=" + (level * 1 + 1);
            }
        }
    });
    //加载英文注释图
    dojo.declare("TianDiEhBiaoZhuMapServiceLayer", TianDiTiledMapServiceLayer, {
        getTileUrl: function (level, row, col) {
            if (flag == 'img') {
                return "http://t1.tianditu.cn/DataServer?T=eia_c&X=" + col + "&Y=" + row + "&L=" + (level * 1 + 1);
            }
            if (flag == 'vec') {
                return "http://t1.tianditu.cn/DataServer?T=eva_c&X=" + col + "&Y=" + row + "&L=" + (level * 1 + 1);
            }
        }
    });
    //加载图像图
    dojo.declare("TianDiYXMapServiceLayer", TianDiTiledMapServiceLayer, {
        getTileUrl: function (level, row, col) {//wmts
            return "http://t1.tianditu.cn/DataServer?T=img_c&X=" + col + "&Y=" + row + "&L=" + (level * 1 + 1);
        }
    });

    esri.config.defaults.io.proxyUrl = "arcgis_js_api/sdk/jshelp/proxy.jsp";
    esri.config.defaults.io.alwaysUseProxy = false;

    var mapDiv, resizeTimer, layers = [];
    $scope.$element;

    // copy the esriMapService to a local variable
    $scope.mapService = esriMapService;
    // put the scope variable in the MapService so that when the DOJO AMD finally loads the map; it can trigger the code in the controller
    $scope.mapService.scope = $scope;

    // the init method
    this.init = function (element) {
        if (!$attrs.id) {
            throw new Error('\'id\' is required for a map.');
        }
        $scope.$element = element;

        // if the map isn't loaded yet; return to stop processing
        // the recreateMap function will be triggered when the map does load
        if (!$scope.mapService.map) {
            return;
        }
        $scope.recreateMap();
    };

    // a helper function to create the map
    $scope.recreateMap = function () {
        createDiv();
        createMap();

    }

    // In theory we only want to create the div once..
    // so we should add code in here to make sure the div is not created if it is already created
    // either that or delete the existeing div and -recreate it
    var createDiv = function () {
        if (mapDiv) {
            return;
        }
        mapDiv = document.createElement('div');
        mapDiv.setAttribute('id', $attrs.id);
        $scope.$element.removeAttr('id');
        $scope.$element.append(mapDiv);
    };
    var createMap = function () {
        if (!$scope.mapService.map) {
            return;
        }
        if (!mapDiv) {
            return;
        }
        var options = {
            //center: $attrs.center ? JSON.parse($attrs.center) : [106.32470703125, 33.442383],
            //zoom: $attrs.zoom ? parseInt($attrs.zoom) : 3
            //basemap: $attrs.basemap ? $attrs.basemap : 'streets'
            logo: false,
            autoResize: true,
            showInfoWindowOnClick: false
        };

        //http://server.arcgisonline.com/ArcGIS/rest/services/ESRI_StreetMap_World_2D/MapServer
        //https://server.arcgisonline.com/ArcGIS/rest/services/NGS_Topo_US_2D/MapServer
        //这是一个24级的英文世界地图，投影是102113（3857）兰博特投影：http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer
        $scope.map = new $scope.mapService.map($attrs.id, options);
        esriMapService.mapInstance = $scope.map;
        var MyTiledMapServiceLayer = new esri.layers.ArcGISTiledMapServiceLayer("https://server.arcgisonline.com/arcgis/rest/services/ESRI_Imagery_World_2D/MapServer", {"id": "WIMG"});
        $scope.map.addLayer(MyTiledMapServiceLayer);
        //MyTiledMapServiceLayer.hide();
        //$scope.mapService.centerToChina();
        //var basemap = new TianDiTiledMapServiceLayer();
        //$scope.map.addLayer(basemap);

        //var yx =  TianDiYXMapServiceLayer()
        //$scope.map.addLayer(yx);

        var annolayer_Ch = new TianDiChBiaoZhuMapServiceLayer();
        annolayer_Ch.id = 'anno_Ch';
        $scope.map.addLayer(annolayer_Ch);

        var annolayer_Eh = new TianDiEhBiaoZhuMapServiceLayer();
        annolayer_Eh.id = 'anno_Eh';
        $scope.map.addLayer(annolayer_Eh);
        annolayer_Eh.hide();


        //var mapExtent = new esri.geometry.Extent(59.78662109375,26.7626955,118.62939453125,57.0410158125, $scope.map.spatialReference);


        $scope.map.on('load', function () {
            //esriMapService.resizeDiv()
            /*            $scope.map.on('resize', function () {
             clearTimeout(resizeTimer);
             resizeTimer = setTimeout(function () {
             var mapH = $(window).height() - 70;
             var mapW = $(window).width() - 30;
             dojo.style(dojo.byId("mapID"), {
             'height': mapH + 'px',
             'width': mapW + 'px'
             });
             $scope.map.resize();
             $scope.map.reposition();
             }, 500);
             });*/
            $rootScope.$broadcast('map-load');
        });
        //$scope.map.on('zoom-end', function (obj) {
        //    alert(obj.level)
        //})
        //$scope.map.on('pan-end', function (obj) {
        //    alert(dojo.toJson(obj.extent.toJson()))
        //})
        //$scope.map.on('click', function (e) { $rootScope.$broadcast('map-click', e); });
        //$scope.map.on('click', function (e) { console.dir(e); });


        // This layer thing comes fromt he blog I sourced this from; but not anything
        // I've investigated personally yet
        // commenting out for now
        /*        if (layers.length > 0) {
         $scope.map.addLayers(layers);
         layers = [];
         }*/
    };

    /* comment out the addLayer method temporarily
     $scope.addLayer = function (layer) {
     if ($scope.map) {
     $scope.map.addLayer(layer);
     } else {
     layers.push(layer);
     }
     };*/

}]);

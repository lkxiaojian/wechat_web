var app = angular.module('app');
var leafLetMapWrapper = {
    mapInstance : undefined,
    resizeDiv: function (mapH, mapW) {
        var resizeTimer;
        function resize() {
            if(angular.element("#leafletmapID")){
                angular.element("#leafletmapID").css({
                    height : mapH
                   // width : mapW
                });
            }
        }
        resize();
        if (!mapH && !mapW) {
            mapH = $(window).height() - 70;
            //mapW = $(window).width() - 30;
        }
        leafLetMapWrapper.mapInstance.on('resize', function (resizeEvent) {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                resize();
            }, 500);
        });
    }

}
app.factory('leafLetMapService',function(){
    return leafLetMapWrapper;
})
app.directive('leafletMap', function () {
    return {
        restrict: 'EA',
        controller: 'leafLetMapController',
        scope: {
            leafletOption: "=?",
            instance: '=?'
        },
        link: function (scope, element, attrs, ctrl) {
            ctrl.init(element);
        }
    };
});

app.controller('leafLetMapController', ['$rootScope', '$scope', '$attrs','leafLetMapService', function ($rootScope, $scope, $attrs, leafLetMapService) {

    $scope.$element;
    $scope.mapService = leafLetMapService;
    // the init method
    this.init = function (element) {
        if (!$attrs.id) { throw new Error('\'id\' is required for a map.'); }
        $scope.$element = element;
        $scope.createMap();
    };

    $scope.createMap = function () {
        var options = {
            center: $attrs.center ? JSON.parse($attrs.center) : [40, 100],
            zoom: $attrs.zoom ? parseInt($attrs.zoom) : 4
        };

        $scope.map = L.map($attrs.id, options);
        leafLetMapService.mapInstance = $scope.map;
        // 矢量图
        L.tileLayer("http://t{s}.tianditu.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles", {
            subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"]
        }).addTo($scope.map);
        // 影像
        //L.tileLayer("http://t{s}.tianditu.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&//format=tiles", {
        //    subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"]
        //}).addTo($scope.map);

        // 地名标注
        L.tileLayer("http://t{s}.tianditu.cn/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles", {
            subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"]
        }).addTo(leafLetMapService.mapInstance);

        // 边界
        L.tileLayer("http://t{s}.tianditu.cn/ibo_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=ibo&tileMatrixSet=w&TileMatrix={z}&TileRow={y}&TileCol={x}&style=default&format=tiles", {
            subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"]
        }).addTo(leafLetMapService.mapInstance).bringToFront();

        if($scope.map._loaded){
            $rootScope.$broadcast('leaflet-load');
        }


/*        var popup = L.popup();
        function onMapClick(e) {
            popup.setLatLng(e.latlng)
                .setContent("You clicked the map at " + e.latlng.toString())
                .openOn($scope.map);
        }
        $scope.map.on('click', onMapClick);*/
        //$scope.map.on('click', function (e) { $rootScope.$broadcast('leaflet-click', e); });

    };
}]);

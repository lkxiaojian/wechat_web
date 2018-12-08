app.controller('FileUploadCtrl', ['$scope', 'FileUploader', '$http', function ($scope, FileUploader, $http) {

    var getUpLoadToken = function () {
        var tokenUrl = '/risk-web/tool/upload?view=demo2';
        var url = 'demo/getToken?view=csrf';
        $http.get(url).then(function (resp) {
            var result = resp.data.result == null ? [] : resp.data.result;
            $scope.token = {url: '/risk-web/tool/upload?view=demo2&_csrf=' + result.token};
            tokenUrl = '/risk-web/tool/upload?view=demo2&_csrf=' + result.token;
        });
        return tokenUrl;
    };

    var uploader = $scope.uploader = new FileUploader({
        url: getUpLoadToken()
    });

    uploader.filters.push({
        name: 'customFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var name = item.name.slice(item.name.lastIndexOf('.') + 1);
            return 'nbe'.indexOf(name) !== -1;
        }
    });

    uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
        console.info('onWhenAddingFileFailed', item, filter, options);
    };
    uploader.onAfterAddingFile = function (fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    uploader.onAfterAddingAll = function (addedFileItems) {
        console.info('onAfterAddingAll', addedFileItems);
    };
    uploader.onBeforeUploadItem = function (item) {
        console.info('onBeforeUploadItem', item);
    };
    uploader.onProgressItem = function (fileItem, progress) {
        console.info('onProgressItem', fileItem, progress);
    };
    uploader.onProgressAll = function (progress) {
        console.info('onProgressAll', progress);
    };
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        console.info('onSuccessItem', fileItem, response, status, headers);
    };
    uploader.onErrorItem = function (fileItem, response, status, headers) {
        console.info('onErrorItem', fileItem, response, status, headers);
    };
    uploader.onCancelItem = function (fileItem, response, status, headers) {
        console.info('onCancelItem', fileItem, response, status, headers);
    };
    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        console.info('onCompleteItem', fileItem, response, status, headers);
    };
    uploader.onCompleteAll = function () {
        console.info('onCompleteAll');
    };
    console.info('uploader', uploader);

    var getShellList = function () {
        var url = 'demo/getFileList?view=config&start_time=2014&end_time=2016';
        $http.get(url).then(function (resp) {
            var result = resp.data.result == null ? [] : resp.data.result;
            for (var i = 0; i < result.length; i++) {
                $scope.uploader.queue.push({file: {name: result[i].old_name, size: result[i].size}, progress: "100", isSuccess: true});
            }
        });
    };
    getShellList();
}]);
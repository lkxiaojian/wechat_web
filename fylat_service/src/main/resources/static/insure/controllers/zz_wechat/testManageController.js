app.controller('testManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'insureUtil', '$window', 'modalTip', '$compile', '$timeout',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, insureUtil, $window, modalTip) {
        $scope.title = '领域管理';
        $scope.dataACL = {
            ptreeInstance: {},
            id: '',
            // 获取区域权限
            getTreeData: function (treeInstance) {
                var adcodeArray = new Array();
                // 所有选中的节点id
                var treelist = treeInstance.getAllChecked();
                var checkidArray = treelist.split(",");
                for (var i = 0; i < checkidArray.length; i++) {

                    var checkId = checkidArray[i];
                    //判断是否选中全部 提示用户不能全部选择
                    if (checkId == 100) {
                        modalTip({
                            tip: switchLang.switchLang('不能全部选择'),
                            type: true
                        });
                        return;
                    }
                    //父节点的id
                    var parentId = treeInstance.getParentId(checkId);
                    var parIscheck = treeInstance.isItemChecked(checkId);
                    if (parentId == 1 && parIscheck != 0) {
                        var adcodeObj = {};
                        var id = treeInstance.getUserData(checkId, "id");
                        adcodeObj['id'] = id;
                        adcodeObj['parendId'] = checkId;
                        //获取该id 下面的节点
                        var getAllSubItems = treeInstance.getAllSubItems(checkId);
                        var chrildArray = getAllSubItems.split(",");
                        var chrildCheckList = new Array();
                        for (var j = 0; j < chrildArray.length; j++) {
                            //根据id判断改节点是否选择 (0 - unchecked,1 - checked, 2 - third state)
                            var isChecked = treeInstance.isItemChecked(chrildArray[j]);
                            if (isChecked != 0 && chrildArray[j] != "") {
                                chrildCheckList.push(chrildArray[j]);
                            }
                        }
                        adcodeObj['chrild'] = chrildCheckList;
                        adcodeArray.push(adcodeObj);
                    }
                }

                if (treeInstance.isItemChecked(1) == 1 || treeInstance.getAllCheckedBranches().length == 1) {
                    var checkidArray = new Array();
                    var isFirst = {};
                    isFirst['isFirstParendId'] = true;
                    checkidArray.push(isFirst);
                    adcodeArray = checkidArray;
                }
                return adcodeArray;
            }
        };

        $scope.ok = function (e) {
            var areaData = $scope.dataACL.getTreeData($scope.dataACL.ptreeInstance);
            // var allAreaData = {
            //     'areaDataTree': areaData,
            // };
            // $scope.dataACL.adcode = JSON.stringify(allAreaData);

            $http({
                method: 'GET',
                url: 'releaseManagement/getTypeMessage/rest',
                params: {
                   "article_type_id":areaData,
                    "type" :0
                }
            }).success(function (data) {
                if (data.success) {
                    modalTip({
                        tip: switchLang.switchLang('成功'),
                        type: true,
                        callback: function () {
                            $state.go('app.insure.');
                        }
                    });
                } else {
                    modalTip({
                        tip: switchLang.switchLang('失败'),
                        type: true
                    });
                }
            })
        }
    }])
;


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

                if (checkidArray == null || checkidArray.length == 0) {

                    modalTip({
                        tip: switchLang.switchLang('至少选择一个'),
                        type: true
                    });
                    return;


                }

                if (checkidArray != null && checkidArray.length > 1) {

                    modalTip({
                        tip: switchLang.switchLang('不能多选'),
                        type: true
                    });
                    return;


                }

                // for (var i = 0; i < checkidArray.length; i++) {
                //
                //     var checkId = checkidArray[i];
                //     //判断是否选中全部 提示用户不能全部选择
                //     if (checkId == 100) {
                //         modalTip({
                //             tip: switchLang.switchLang('不能全部选择'),
                //             type: true
                //         });
                //         return;
                //     }
                //     //父节点的id
                //     var parentId = treeInstance.getParentId(checkId);
                //     var parIscheck = treeInstance.isItemChecked(checkId);
                //     if (parentId == 1 && parIscheck != 0) {
                //         var adcodeObj = {};
                //         var id = treeInstance.getUserData(checkId, "id");
                //         adcodeObj['id'] = id;
                //         adcodeObj['parendId'] = checkId;
                //         //获取该id 下面的节点
                //         var getAllSubItems = treeInstance.getAllSubItems(checkId);
                //         var chrildArray = getAllSubItems.split(",");
                //         var chrildCheckList = new Array();
                //         for (var j = 0; j < chrildArray.length; j++) {
                //             //根据id判断改节点是否选择 (0 - unchecked,1 - checked, 2 - third state)
                //             var isChecked = treeInstance.isItemChecked(chrildArray[j]);
                //             if (isChecked != 0 && chrildArray[j] != "") {
                //                 chrildCheckList.push(chrildArray[j]);
                //             }
                //         }
                //         adcodeObj['chrild'] = chrildCheckList;
                //         adcodeArray.push(adcodeObj);
                //     }
                // }

                return checkidArray;
            }
        };

        $scope.ok = function (e) {
            var areaData = $scope.dataACL.getTreeData($scope.dataACL.ptreeInstance);

            if (areaData == null) {
                return;
            }

            // $state.go('app.insure.publishManage',{type_id:areaData});
            $state.go('app.insure.articleTypeTmp',{type_id: areaData});

            //以后改用弹框
       /*     $http({
                method: 'GET',
                url: 'releaseManagement/getTypeMessage/rest',
                params: {
                    "article_type_id": areaData[0],
                    "type": 0
                }
            }).success(function (data) {
                if (data.code == 0) {
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
            })*/
        }


    }])
;


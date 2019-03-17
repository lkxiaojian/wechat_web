app.controller('typeManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'insureUtil', '$window', 'modalTip', '$compile', '$timeout',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, insureUtil, $window, modalTip) {
        $scope.listObj ={
            navigationMsg: "管理平台 >分类管理",
            current_location: "app.insure.type_manage"
        }

        $scope.publish = function(){
            debugger
            layer.msg("待完成发布功能")
            var treelist = $scope.myTree.getAllChecked();
            var checkidArray = treelist.split(",");

            if (checkidArray == null || checkidArray.length == 0) {

                modalTip({
                    tip: switchLang.switchLang('至少选择一个'),
                    type: true
                });
                return;

            }
        }

        $scope.query = function(){
            $scope.myTree.findItem($scope.typeName,0,1);
        }
        $scope.refresh = function(){
            $scope.myTree.refreshItem();
        }
        $scope.goPubView = function(){
            $state.go('app.insure.publish_manage',
                {pre_location:$scope.listObj.current_location});
        }

        $scope.createTree = function () {
            $scope.myTree = new dhtmlXTreeObject("dataTree", '100%', '100%', 0);
            // 设置皮肤
            $scope.myTree.setImagePath("./vendor/dhtmlx/imgs/dhxtree_skyblue/");
            // 设置复选框
            $scope.myTree.enableCheckBoxes(1);
            // 允许半选状态
            $scope.myTree.enableThreeStateCheckboxes(true);
            $scope.myTree.enableTreeImages(false);
            $scope.myTree.enableThreeStateCheckboxes(false);// 是否级联选中

            $scope.myTree.enableDragAndDrop(true);
            $scope.myTree.enableDragAndDropScrolling(true);//在拖放操作中启用自动滚动
            $scope.myTree.enableItemEditor(true); //开启允许编辑条目的文本
            // $scope.myTree.enableKeySearch(true); //开启允许编辑条目的文本

            // 设置是否允许显示树图片
            // setOnLoadingStart   setOnLoadingEnd
            $scope.myTree.setOnLoadingEnd(function () {
                //设置字体，以区分菜单节点和功能节点
                var array = $scope.myTree.getAllSubItems(0).split(',');

                for (var i = 0; i < array.length; i++) {
                    var level = $scope.myTree.getLevel(array[i]);
                    //展开所有一级节点
                    if(level == 1){
                        $scope.myTree.openAllItems(array[i]);
                    }
                    if (level == 1 || level == 2) {
                        $scope.myTree.setItemStyle(array[i], 'color:#616b88; font-weight: bold;');
                    }
                }

                //聚焦
                if($scope.focusNode){
                    $scope.myTree.findItem($scope.focusNode,0,1);

                }
            });
            // // 设置允许动态加载xml文件（异步加载）
            $scope.myTree.setXMLAutoLoading("releaseManagement/getTypeMenuTree/rest?type=0");
            $scope.myTree.setDataMode("json");

            $scope.myTree.loadJSON('releaseManagement/getTypeMenuTree/rest?type=0',function(){
                $scope.myTree.openAllItems();

            });
            $scope.myTree.setDragHandler(function(srcNode,tarNode){
                debugger
                layer.confirm('请选择操作？', {
                    btn: ['作为目标子类','合并到目标'] //按钮
                }, function(){
                    debugger
                    return true;
                    $http({
                        method: 'GET',
                        url: '/releaseManagement/updateTypeParentId/rest',
                        params: {
                            article_type_id: srcNode,
                            parentid:tarNode
                        }
                    }).success(function (data) {
                        if (data.code == 0) {
                            layer.msg(data.message);
                            $scope.focusNode = tarNode;
                            $scope.refresh();
                        } else {
                            layer.alert(data.message,{icon:2})
                        }
                    }).error(function (data) {
                        modalTip({
                            tip: "删除失败",
                            type: false
                        });
                    })
                }, function(){
                    debugger
                    return true;
                    $http({
                        method: 'GET',
                        url: 'releaseManagement/mergeTypeById/rest',
                        params: {
                            article_type_id:srcNode,// 要合并的保留的类型的id
                            parent_id:'',// 要合并的保留的类型的父级id
                            merge_type_id:tarNode//  要被合并 的类型id（传递一个最高的节点）
                        }
                    }).success(function (data) {
                        if (data.code == 0) {
                            layer.msg(data.message);
                            $scope.focusNode = tarNode;
                            $scope.refresh();
                        } else {
                            layer.alert(data.message,{icon:2})
                        }
                    }).error(function (data) {
                        layer.alert("请求失败",{icon:2})
                    })
                });

            });
            $scope.myTree.setOnEditHandler(function(state,id,tree,value){
                debugger

                //保存
                if(state ==2){
                    if(!value){
                        layer.msg("名称不能为空")
                        return false;
                    }
                    $http({
                        method: 'GET',
                        url: 'releaseManagement/updateTypeMessage/rest',
                        params: {
                            article_type_id:id,// 类型id
                            name:value// 类型名称
                        }
                    }).success(function (data) {
                        if (data.code == 0) {
                            layer.msg(data.message);
                            $scope.focusNode = id;
                            $scope.refresh();
                        } else {
                            layer.alert(data.message,{icon:2})
                        }
                    }).error(function (data) {
                        layer.alert("请求失败",{icon:2})
                    })
                }
                return true;
            });

            // $scope.myTree.attachEvent("onDragIn", function(sId, tId, sObject, tObject){
            //     debugger
            //     return true;
            // });
        };
        //
        $scope.createTree();


    }])
;


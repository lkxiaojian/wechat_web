app.controller('typeManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'FileUploader', 'Upload', 'insureUtil', '$window', 'modalTip', '$compile', '$timeout',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, FileUploader, Upload, insureUtil, $window, modalTip) {
        $scope.listObj = {
            navigationMsg: "管理平台 >分类管理",
            type: $stateParams.type,
            current_location: "app.insure.type_manage",
            pic_location: "http://106.2.11.94:7902"
        };
        if($scope.listObj.type == '2'){
            $scope.listObj.navigationMsg = "管理平台 >待修复分类管理";
        }else if($scope.listObj.type == '1'){
            $scope.listObj.navigationMsg = "管理平台 >精品名称管理";
        }else{
            $scope.listObj.navigationMsg = "管理平台 >分类管理";
        }
        //获取所有已发布的类型
        $scope.getAllType = function () {
            var type = '3';
            // if($scope.listObj.type=='0'){
            //     type = '2';
            // }
            $http({
                method: 'GET',
                url: '/releaseManagement/getAllIssueArticleType/rest',
                params: {
                    type: type
                }
            }).success(function (data) {
                if (data.code == 0) {
                    $scope.typeList = data.result;
                } else {
                    layer.alert(data.message)
                }
            }).error(function (data) {
                layer.alert("请求失败", {icon: 2})
            })
        }
        $scope.getAllType();

        $scope.data = {
            file_icon: null,
            file_back: null
        };
        $scope.mulImages = [];
        $scope.cancel = function(){
            $("#editModal").modal("hide");
        }
        $('#editModal').on('hidden.bs.modal', function () {
            $scope.typeForm.iamge_icon_file = "";
            $scope.typeForm.iamge_back_file = "";
            $scope.mulImages = [];
        })
        $scope.update = function () {
            $scope.mulImages = [];
            if (!$scope.typeForm.name) {
                layer.msg("类型名字为空！！！")
                return;
            }

            if (!$scope.typeForm.keyword) {
                layer.msg("关键词为空！！！")
                return;
            }
            if ((!$scope.typeForm.iamge_icon && !$scope.typeForm.iamge_icon_file)
                || (!$scope.typeForm.iamge_back && !$scope.typeForm.iamge_back_file)) {
                layer.msg("有图片还没有选择")
                $scope.mulImages = [];
                return;
            }

            var url = '/releaseManagement/updateTypeMessage/rest';
            var data = angular.copy({
                artcicle_type_id: $scope.typeForm.article_type_id,
                parentid: $scope.typeForm.parentid,
                name: $scope.typeForm.name,
                keyword: $scope.typeForm.keyword,
                iamge_icon:$scope.typeForm.iamge_icon,
                iamge_back:$scope.typeForm.iamge_back,
                type: $scope.listObj.type
            });
            //TODO 图片的回显问题
            $scope.mulImages.push($scope.typeForm.iamge_icon_file);
            $scope.mulImages.push($scope.typeForm.iamge_back_file);
            data.file = $scope.mulImages;
            layer.load(2);
            Upload.upload({
                url: url,
                data: data
            }).success(function (data) {
                layer.closeAll('loading');
                if(data.code == '0'){
                    layer.msg("修改成功");
                    $scope.mulImages = [];
                    $("#editModal").modal("hide");
                    $scope.focusNode = $scope.typeForm.article_type_id;
                    $scope.refresh();
                }else{
                    layer.alert(data.message);
                }
            }).error(function () {
                layer.closeAll('loading');
                layer.alert("修改失败");
                $scope.mulImages = [];
            });
        };

        $scope.publish = function (type) {
            var treelist = $scope.myTree.getAllChecked();
            if (!treelist) {
                layer.msg('至少勾选一个节点');
                return;
            }
            layer.load(2);
            $http({
                method: 'GET',
                url: 'releaseManagement/pushArticleType/rest',
                params: {
                    typeId: treelist,
                    type : type
                }
            }).success(function (data) {
                layer.closeAll('loading');
                if (data.code == 0) {
                    layer.msg(data.message);
                    $scope.refresh();
                } else {
                    layer.alert(data.message, {icon: 2})
                }
            }).error(function (data) {
                layer.closeAll('loading');
                layer.alert("请求失败", {icon: 2})
            })
        }

        $scope.query = function () {
            if(!$scope.typeName){
                layer.msg("请填写类型名称");
                return;
            }
            $scope.myTree.findItem($scope.typeName, 0, 1);
        }
        var refreshLoding = layer.load(2);;
        $scope.refresh = function () {
            refreshLoding = layer.load(2);
            $scope.myTree.refreshItem();
        }
        //相似度
        $scope.similarity = function () {
            layer.load(2);
            $http({
                method: 'GET',
                url: 'releaseManagement/combinedScore/rest'
            }).success(function (data) {
                layer.closeAll('loading');
                if (data.code == 0) {
                    $scope.similarityList = data.result;

                    $("#similarityModal").modal({
/*
                        backdrop:'static',
*/
                        keyboard : false
                    });
                } else {
                    layer.alert(data.message, {icon: 2})
                }
            }).error(function (data) {
                layer.closeAll('loading');
                layer.alert("请求失败", {icon: 2})
            })
        }
        $scope.mergeTypeList = [];
        $scope.showMergeModal = function () {
            var treelist = $scope.myTree.getAllChecked();
            if (!treelist) {
                layer.msg('至少勾选两个节点');
                return;
            }
            var split = treelist.split(",");
            if(split.length<2){
                layer.msg('至少勾选两个节点');
                return;
            }
            var arr = new Array();
            for (var i = 0; i < split.length; i++) {
                var id = split[i];
                var text = $scope.myTree.getItemText(id);
                arr.push({id: id, text: text})
            }
            $scope.mergeTypeList = arr;

            $("#mergeModal").modal({
                backdrop:'static',
                keyboard : false
            });
        }
        $scope.cancelMerge = function () {
            $("#mergeModal").modal("hide");
        }
        $scope.batchMerge = function () {
            var tarNode = $("[name=optionsRadios]:checked").val();
            var radioArr = $("[name=optionsRadios]");
            var idArr = new Array();
            for (var i = 0; i < radioArr.length; i++) {
                var id = radioArr[i].value;
                if(id == tarNode){
                    continue;
                }
                idArr.push(id)
            }
            var mergeList = idArr.join(",");
            $scope.merge(tarNode, mergeList);
        }
        $scope.merge = function(tarNode,mergeList){
            layer.load(2);
            $http({
                method: 'POST',
                url: 'releaseManagement/mergeTypeById/rest',
                data: {
                    article_type_id: tarNode,// 要合并的保留的类型的id
                    type: $scope.listObj.type,// type为0
                    merge_type_id: mergeList//  要被合并 的类型id（传递一个最高的节点）
                }
            }).success(function (data) {
                layer.closeAll('loading');
                if (data.code == 0) {
                    layer.msg(data.message);
                    $("#mergeModal").modal("hide");
                    $scope.focusNode = tarNode;
                    $scope.refresh();
                } else {
                    layer.alert(data.message, {icon: 2})
                }
            }).error(function (data) {
                layer.closeAll('loading');
                layer.alert("请求失败", {icon: 2})
            })
        }

        $scope.updateDomainObj = {article_type_id:'',parentid:''};
        $scope.showParentView = function(){
            var selectedNode = $scope.myTree.getSelected();
            if(!selectedNode){
                layer.msg("请选中一个节点");
                return;
            }
            layer.load(2);
            $http({
                method: 'GET',
                url: 'reptile/getDominData/rest',
                params: {
                    type: 0
                }
            }).success(function (data) {
                layer.closeAll('loading');
                if (data.code == 0) {
                    $scope.updateDomainObj.article_type_id = selectedNode;
                    $scope.domainDataList = data.result;
                    $("#addParentModal").modal({
                        backdrop:'static',
                        keyboard : false
                    });
                } else {
                    layer.alert(data.message, {icon: 2})
                }
            }).error(function (data) {
                layer.closeAll('loading');
                layer.alert("请求失败", {icon: 2})
            })
        }
        $scope.cancelAddParent = function(){
            $("#addParentModal").modal("hide");
        }
        $scope.updateDomain = function(){
            layer.load(2);
            $http({
                method: 'GET',
                url: '/releaseManagement/updateTypeParentId/rest',
                params: {
                    article_type_id: $scope.updateDomainObj.article_type_id,
                    parentid: $scope.updateDomainObj.parentid
                }
            }).success(function (data) {
                layer.closeAll('loading');
                if (data.code == 0) {
                    layer.alert("更新成功");
                    $("#addParentModal").modal('hide');
                    $scope.refresh();
                } else {
                    layer.alert(data.message, {icon: 2})
                }
            }).error(function (data) {
                layer.closeAll('loading');
                layer.alert("请求失败", {icon: 2})
            })
        }
        $scope.goPubView = function () {
            var selectedNode = '';
            if(!$scope.myTree.hasChildren()){
                selectedNode = $scope.myTree.getSelected();
            }
            var wx_type = '0';
            if($scope.listObj.type == '2'){
                wx_type = '1';
            }
            var type = 0;
            if($scope.myTree.getUserData(selectedNode,"type_state")==0){
                type = 0;
            }else if($scope.myTree.getUserData(selectedNode,"type_state")==1){
                type = 1;
            }
            $state.go('app.insure.publish_manage',
                {pre_location: $scope.listObj.current_location,
                    comming_type_id: selectedNode,
                    wx_type:wx_type,
                    type:type
                });
        }

        $scope.delete = function (){
            var treelist = $scope.myTree.getAllChecked();
            if (!treelist) {
                layer.msg('至少勾选一个节点');
                return;
            }
            var confirm = layer.confirm('确认要删除勾选的类型吗？', {
                btn: ['取消','确认'] //按钮
            }, function(){
                layer.close(confirm);
            }, function(){
                layer.load(2);
                $http({
                    method: 'GET',
                    url: 'releaseManagement/delArticleTypeById/rest',
                    params: {
                        article_type_id: treelist,
                        type:'0'
                    }
                }).success(function (data) {
                    layer.closeAll('loading');
                    if (data.code == 0) {
                        layer.alert(data.message);
                        $scope.myTree.refreshItem();
                    } else {
                        layer.alert(data.message);
                    }

                }).error(function (data) {
                    layer.closeAll('loading');
                    layer.alert("删除失败");
                })
            });
        }

        $scope.createTree = function () {
            $scope.myTree = new dhtmlXTreeObject("dataTree", '100%', '100%', 0);
            // 设置皮肤
            $scope.myTree.setImagePath("./vendor/dhtmlx/imgs/dhxtree_skyblue/");
            // $scope.myTree.enableTreeImages(document.getElementById('a1').checked);
            $scope.myTree.enableTreeLines(true);
            // 设置复选框
            $scope.myTree.enableCheckBoxes(1);
            // 允许半选状态
            $scope.myTree.enableThreeStateCheckboxes(true);
            // $scope.myTree.enableTreeImages(false);
            $scope.myTree.enableThreeStateCheckboxes(false);// 是否级联选中

            $scope.myTree.enableDragAndDrop(true);
            $scope.myTree.enableDragAndDropScrolling(true);//在拖放操作中启用自动滚动
            // $scope.myTree.enableItemEditor(true); //开启允许编辑条目的文本
            // $scope.myTree.enableKeySearch(true); //开启允许编辑条目的文本

            // 设置是否允许显示树图片
            // setOnLoadingStart   setOnLoadingEnd
            $scope.myTree.setOnLoadingEnd(function (node) {
                //设置字体，以区分菜单节点和功能节点
                var array = $scope.myTree.getAllSubItems(0).split(',');

                for (var i = 0; i < array.length; i++) {
                    var level = $scope.myTree.getLevel(array[i]);
                    //展开所有一级节点
                    if (level == 1) {
                        $scope.myTree.openAllItems(array[i]);
                    }
                    if (level == 1 || level == 2) {
                        $scope.myTree.setItemStyle(array[i], 'color:#616b88; font-weight: bold;');
                    }
                    if($scope.myTree.getUserData(array[i],"issue")==1){
                        $scope.myTree.setItemStyle(array[i], 'color:red;');
                    }
                    if($scope.myTree.getUserData(array[i],"type_state")==0){
                        $scope.myTree.setItemImage(array[i], "text.gif");
                    }else if($scope.myTree.getUserData(array[i],"type_state")==1){
                        $scope.myTree.setItemImage(array[i], "graph.gif");
                    }
                }
                if(refreshLoding){
                    layer.close(refreshLoding);
                }

                //聚焦
                if ($scope.focusNode) {
                    $scope.myTree.selectItem($scope.focusNode);
                    $scope.myTree.focusItem($scope.focusNode);
                }
            });
            // // 设置允许动态加载xml文件（异步加载）
            $scope.myTree.setXMLAutoLoading("releaseManagement/getTypeMenuTree/rest?type="+$scope.listObj.type);
            $scope.myTree.setDataMode("json");

            $scope.myTree.loadJSON('releaseManagement/getTypeMenuTree/rest?type='+$scope.listObj.type, function (data) {
                $scope.myTree.openAllItems();

            });
            $scope.myTree.setDragHandler(function (srcNode, tarNode) {
                layer.confirm('请选择操作？', {
                    btn: ['作为目标子类', '合并到目标'] //按钮
                }, function () {
                    $http({
                        method: 'GET',
                        url: '/releaseManagement/updateTypeParentId/rest',
                        params: {
                            article_type_id: srcNode,
                            parentid: tarNode
                        }
                    }).success(function (data) {
                        if (data.code == 0) {
                            layer.msg(data.message);
                            $scope.focusNode = srcNode;
                            $scope.refresh();
                        } else {
                            layer.alert(data.message, {icon: 2})
                        }
                    }).error(function (data) {
                        layer.alert("请求失败", {icon: 2})
                    })
                }, function () {
                    $scope.merge(tarNode,srcNode);
                });

            });
            $scope.myTree.setOnEditHandler(function (state, id, tree, value) {
                //保存
                if (state == 2) {
                    if (!value) {
                        layer.msg("名称不能为空")
                        return false;
                    }
                    return true;
                    var url = 'releaseManagement/updateTypeMessage/rest';
                    var data = {
                        artcicle_type_id: id,// 类型id
                        name: value// 类型名称
                    }
                    Upload.upload({
                        url: url,
                        data: data
                    }).success(function (data) {
                        // $scope.myTree.setItemText(value);
                        if (data.code == 0) {
                            layer.msg(data.message);
                            $scope.focusNode = id;
                            $scope.refresh();
                        } else {
                            layer.alert(data.message, {icon: 2})
                        }
                    }).error(function () {
                        layer.alert("请求失败", {icon: 2})
                    });

                }
                return true;
            });
            $scope.typeForm = {}
            $scope.myTree.setOnDblClickHandler(function(nodeId){
                $http({
                    method: 'GET',
                    url: 'releaseManagement/getTypeMessage/rest',
                    params: {
                        type: $scope.listObj.type,// type为0
                        article_type_id: nodeId
                    }
                }).success(function (data) {
                    if (data.code == 0) {
                        $scope.typeForm.name = data.data.article_type_name;
                        $scope.typeForm.keyword = data.data.article_type_keyword;
                        $scope.typeForm.article_type_id = data.data.article_type_id;
                        $scope.typeForm.iamge_icon = data.data.iamge_icon;
                        $scope.typeForm.iamge_back = data.data.iamge_back;
                        $scope.typeForm.parentid = data.data.parentid;
                        $scope.typeForm.article_type_name_old = data.data.article_type_name_old;
                        $scope.typeForm.article_type_keyword_old = data.data.article_type_keyword_old;
                        if(data.data.iamge_icon){
                            $scope.iamge_icon_url = $scope.listObj.pic_location+data.data.iamge_icon;
                        }else{
                            $scope.iamge_icon_url = "";
                        }
                        if(data.data.iamge_back) {
                            $scope.iamge_back_url = $scope.listObj.pic_location+data.data.iamge_back;
                        }else{
                            $scope.iamge_back_url = "";
                        }

                        $("#editModal").modal({
                            backdrop:'static',
                            keyboard : false
                        });
                    } else {
                        layer.alert(data.message, {icon: 2})
                    }
                }).error(function (data) {
                    layer.alert("请求失败", {icon: 2})
                })

            });
        };
        //
        $scope.createTree();

    }])
;


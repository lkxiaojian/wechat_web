app.controller('typeManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'FileUploader', 'Upload', 'insureUtil', '$window', 'modalTip', '$compile', '$timeout',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, FileUploader, Upload, insureUtil, $window, modalTip) {
        $scope.listObj = {
            navigationMsg: "管理平台 >分类管理",
            type: "0",
            domainList: [],//领域列表
            current_location: "app.insure.type_manage",
            //查询参数
            integrationQuery: {
                domain_name: null,
                domain_keyword: null,
                file_name: null,
                artcicle_type_id: null
            },
            projectData: [],
            region: {selected: undefined},
            getTypeSelect: function (item) {
                $scope.listObj.region.selected = item;
            },
            postDownload: function () {
                $http({
                    url: 'article/getAllDomain',
                    method: "GET"
                }).success(function (data) {
                    $scope.listObj.domainList = data;
                }).error(function (data) {
                    layer.alert("服务器请求错误")
                });
            }

        };
        $scope.listObj.postDownload();

        $scope.data = {
            file_icon: null,
            file_back: null

        };
        $scope.mulImages = [];
        $scope.cancel = function(){
            $("#editModal").modal("hide");
        }
        $scope.update = function () {
            $scope.mulImages = [];
            if ($scope.listObj.region.selected == null) {
                layer.msg("领域未选择！！！");
                return;
            }

            if ($scope.listObj.integrationQuery.domain_name == null) {
                layer.msg("文章类型名字为空！！！")
                return;
            }

            if ($scope.listObj.integrationQuery.domain_keyword == null) {
                layer.msg("关键词为空！！！")
                return;
            }
            if (!$scope.data.file_icon || !$scope.data.file_back) {
                layer.msg("有图片还没有选择")
                $scope.mulImages = [];
                return;
            }

            var url = '/releaseManagement/updateTypeMessage/rest';
            var data = angular.copy({
                name: $scope.listObj.integrationQuery.domain_name,
                keyword: $scope.listObj.integrationQuery.domain_keyword,
                artcicle_type_id: $scope.listObj.region.selected.article_type_id,
                num_id: 0
            });
            $scope.mulImages.push($scope.data.file_icon);
            $scope.mulImages.push($scope.data.file_back);
            data.file = $scope.mulImages;
            Upload.upload({
                url: url,
                data: data
            }).success(function (data) {
                $scope.data = {
                    file_icon: null,
                    file_back: null

                };
                $scope.listObj.integrationQuery= {
                    domain_name: null,
                    domain_keyword: null,
                    file_name: null,
                    artcicle_type_id: null
                };
                layer.alert("修改成功");
                $("#editModal").modal("hide");
            }).error(function () {
                $scope.mulImages = [];
                layer.alert("修改失败");
            });
        };





        $scope.publish = function () {
            var treelist = $scope.myTree.getAllChecked();
            if (!treelist) {
                layer.msg('至少勾选一个节点');
                return;
            }
            $http({
                method: 'GET',
                url: 'releaseManagement/pushArticleType/rest',
                params: {
                    typeId: treelist
                }
            }).success(function (data) {
                if (data.code == 0) {
                    layer.msg(data.message);
                    $scope.refresh();
                } else {
                    layer.alert(data.message, {icon: 2})
                }
            }).error(function (data) {
                layer.alert("请求失败", {icon: 2})
            })
        }

        $scope.query = function () {
            $scope.myTree.findItem($scope.typeName, 0, 1);
        }
        $scope.refresh = function () {
            $scope.myTree.refreshItem();
        }
        $scope.goPubView = function () {
            $state.go('app.insure.publish_manage',
                {pre_location: $scope.listObj.current_location});
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
            $scope.myTree.enableTreeImages(false);
            $scope.myTree.enableThreeStateCheckboxes(false);// 是否级联选中

            $scope.myTree.enableDragAndDrop(true);
            $scope.myTree.enableDragAndDropScrolling(true);//在拖放操作中启用自动滚动
            // $scope.myTree.enableItemEditor(true); //开启允许编辑条目的文本
            // $scope.myTree.enableKeySearch(true); //开启允许编辑条目的文本

            // 设置是否允许显示树图片
            // setOnLoadingStart   setOnLoadingEnd
            $scope.myTree.setOnLoadingEnd(function () {
                //设置字体，以区分菜单节点和功能节点
                var array = $scope.myTree.getAllSubItems(0).split(',');

                for (var i = 0; i < array.length; i++) {
                    var level = $scope.myTree.getLevel(array[i]);
                    //展开所有一级节点
                    if (level == 1) {
                        $scope.myTree.openAllItems(array[i]);
                    }
                    if (level == 1 || level == 2) {
                        $scope.myTree.setItemStyle(array[i], 'color:#616b88; font-weight: bold;text-al');
                    }
                }

                //聚焦
                if ($scope.focusNode) {
                    $scope.myTree.findItem($scope.focusNode, 0, 1);

                }
            });
            // // 设置允许动态加载xml文件（异步加载）
            $scope.myTree.setXMLAutoLoading("releaseManagement/getTypeMenuTree/rest?type="+$scope.listObj.type);
            $scope.myTree.setDataMode("json");

            $scope.myTree.loadJSON('releaseManagement/getTypeMenuTree/rest?type='+$scope.listObj.type, function () {
                $scope.myTree.openAllItems();

            });
            $scope.myTree.setDragHandler(function (srcNode, tarNode) {
                debugger
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
                            $scope.focusNode = tarNode;
                            $scope.refresh();
                        } else {
                            layer.alert(data.message, {icon: 2})
                        }
                    }).error(function (data) {
                        layer.alert("请求失败", {icon: 2})
                    })
                }, function () {
                    debugger
                    $http({
                        method: 'GET',
                        url: 'releaseManagement/mergeTypeById/rest',
                        params: {
                            article_type_id: srcNode,// 要合并的保留的类型的id
                            type: $scope.listObj.type,// type为0
                            merge_type_id: tarNode//  要被合并 的类型id（传递一个最高的节点）
                        }
                    }).success(function (data) {
                        if (data.code == 0) {
                            layer.msg(data.message);
                            $scope.focusNode = tarNode;
                            $scope.refresh();
                        } else {
                            layer.alert(data.message, {icon: 2})
                        }
                    }).error(function (data) {
                        layer.alert("请求失败", {icon: 2})
                    })
                });

            });
            $scope.myTree.setOnEditHandler(function (state, id, tree, value) {
                debugger
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
                        debugger
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
            $scope.myTree.setOnDblClickHandler(function(nodeId){
                debugger
                $http({
                    method: 'GET',
                    url: 'releaseManagement/getTypeMessage/rest',
                    params: {
                        type: $scope.listObj.type,// type为0
                        article_type_id: nodeId
                    }
                }).success(function (data) {
                    if (data.code == 0) {
                        debugger
                        $scope.typeForm.name = data.data.article_type_name;
                        $scope.typeForm.keyword = data.data.article_type_keyword;
                        $scope.typeForm.article_type_id = data.data.article_type_id;
                        $scope.typeForm.iamge_icon = data.data.iamge_icon;
                        $scope.typeForm.iamge_back = data.data.iamge_back;
                        $scope.typeForm.parentid = data.data.parentid;

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

            // $scope.myTree.attachEvent("onDragIn", function(sId, tId, sObject, tObject){
            //     debugger
            //     return true;
            // });
        };
        //
        $scope.createTree();

    }])
;


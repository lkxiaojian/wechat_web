app.controller('adminAddManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'insureUtil', '$window', 'modalTip', '$compile',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, insureUtil, $window, modalTip, $compile) {
        var editor;
        $scope.listObj = {
            navigationMsg: '管理平台 >添加管理员',
            seachMessage: '',
            parent_id: null,
            defaultSearchParams: {
                view: 'select',
                state:'0',
                type:"0", //文章
                tmp_type:"1", //正式发布的
                hour:"10",
                size:"10",
                page:"1",


            },


        };

        $scope.checkUserName=function () {
            if(!$scope.name){
                layer.msg('请输入账号');
                return;
            }
            if(!$scope.pass){
                layer.msg('请输入密码');
                return;
            }
            if(!$scope.telPhone){
                layer.msg('请输入手机号');
                return;
            }


            var auth=$scope.myTree.getAllChecked();

            if (!auth) {
                layer.msg('至少勾选一个节点');
                return;
            }

            $http({
                method: 'GET',
                url: 'webSysUser/verifyName/rest',
                params: {
                    name:$scope.name,
                },
            }).success(function (data) {
                if (data.code == 0) {
                    if (data.verify) {
                        $scope.saveUserAndAuth();
                    } else {
                        layer.msg(data.message)
                        $("#name").focus();
                    }
                } else {
                    layer.msg(data.message)
                }
            }).error(function (data) {
                layer.alert("请求失败",{icon:2})
            });
        }
        $scope.saveUserAndAuth=function () {
            var auth1=$scope.myTree.getAllChecked();
            var auth2=$scope.myTree.getAllPartiallyChecked();
            if (auth2){
                auth1=auth1+','+auth2;
            }
            var auth=auth1.split(',');

            $http({
                method: 'GET',
                url: 'webSysUser/addUser/rest',
                params: {
                    name:$scope.name,
                    userSex:1,
                    pass:$scope.pass,
                    telPhone:$scope.telPhone,
                },
            }).success(function (data) {

                if (data.code == 0) {
                    var userId=data.userId;

                    var list2='';
                    for (id in auth){
                        list2=list2+userId+'_'+auth[id]+',';
                    }
                    list2=list2.substr(0,list2.length-1);
                    $http({
                        method: 'GET',
                        url: 'userMenu/addUserReMenu/rest',
                        params: {
                            list:list2,
                        },
                    }).success(function (data) {
                        if (data.code == 0) {
                            layer.msg(data.message)
                            $state.go('app.insure.admin_list', {});
                        } else {
                            layer.msg(data.message)
                        }
                    }).error(function (data) {
                        layer.alert("请求失败",{icon:2})
                    });
                } else {
                    layer.msg(data.message)
                }
            }).error(function (data) {
                layer.alert("请求失败",{icon:2})
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
            $scope.myTree.enableTreeImages(false);
            $scope.myTree.enableThreeStateCheckboxes(true);// 是否级联选中

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
                }
                // if(refreshLoding){
                //     layer.close(refreshLoding);
                // }

                //聚焦
                if ($scope.focusNode) {
                    $scope.myTree.selectItem($scope.focusNode, 0, 1);
                }
            });
            // // 设置允许动态加载xml文件（异步加载）
            $scope.myTree.setXMLAutoLoading("'userMenu/getMenuTree/rest");
            $scope.myTree.setDataMode("json");

            $scope.myTree.loadJSON('userMenu/getMenuTree/rest', function (data) {
                $scope.myTree.openAllItems();

            });

            $scope.typeForm = {}
        };
        //
        $scope.createTree();

    }])
;
/**
 * 区域树
 * dhtmlxTree参考 https://www.cnblogs.com/draem0507/archive/2013/02/01/2889317.html
 */
app.directive('areaTree', ['$http', function ($http) {
    return {
        restrict: 'AE',
        scope: {
            treeInstance: '=?',
            userId: '=?'
        },
        link: function (scope, element, attrs) {
            scope.createTree = function () {
                scope.myTree = new dhtmlXTreeObject(attrs.id, '100%', '100%', 0);
                // 设置皮肤
                scope.myTree.setImagePath("./vendor/dhtmlx/imgs/dhxtree_skyblue/");
                // 设置复选框
                scope.myTree.enableCheckBoxes(1);
                // 允许半选状态
                scope.myTree.enableThreeStateCheckboxes(true);
                scope.myTree.enableTreeImages(false);
                //允许拖拽
                scope.myTree.enableDragAndDrop(true);
                // 设置是否允许显示树图片
                // setOnLoadingStart   setOnLoadingEnd
                scope.myTree.setOnLoadingEnd(function () {
                    //设置字体，以区分菜单节点和功能节点
                    var array = scope.myTree.getAllSubItems(0).split(',');
                    for (var i = 0; i < array.length; i++) {
                        var level = scope.myTree.getLevel(array[i]);
                        if (level == 1 || level == 2) {
                            scope.myTree.setItemStyle(array[i], 'color:#616b88; font-weight: bold;');
                        }
                    }
                });
                // // 设置允许动态加载xml文件（异步加载）
                scope.myTree.setXMLAutoLoading("releaseManagement/getTypeMenuTree/rest?type=0");
                scope.myTree.setDataMode("json");

                scope.myTree.loadJSON('releaseManagement/getTypeMenuTree/rest?type=0');
            };
            scope.createTree();
            scope.treeInstance = scope.myTree;
        }
    };
}]);

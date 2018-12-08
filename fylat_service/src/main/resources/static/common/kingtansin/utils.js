
var kingtansin = {};
(function(){
    kingtansin.utils = {
        // 生成0-a之间的随机数
        frandom: function (a) {
            if (a) {
                var num = parseInt(Math.random() * a);
            }
            else {
                var num = 0;
            }
            return num;
        },
        /**
         * 从集合中删除元素
         * @param ele 元素
         * @param arr 集合
         * @returns {number} 返回下标 没有找到返回 －1
         */
        deleteEleFromArr: function (ele, arr) {
            for (var i = 0; i < arr.length; i++) {反反复复
                if (arr[i] == ele) {
                    arr.splice(i, 1);
                    return i;
                }
            }
            return -1;
        },
        /**
         * 检查数组中是否有重复元素
         * @param arr 数组
         * 如果有重复元素返回true，没有重复元素返回false
         */
        isRepeat : function(arr) {
            var hash = {};
            for(var i in arr) {
                if(hash[arr[i]]){
                    return true;
                }
                // 不存在该元素，则赋值为true，可以赋任意值，相应的修改if判断条件即可
                hash[arr[i]] = true;
            }
            return false;
        },
        /*
         * 传入字符串attr,数字index
         * 空格分开成数组
         * 返回index位的字符串
         */
        truncationAttr : function(attr,index) {
            var attrend = "";
            var attrarr = attr.split(" ");
            for(var i = 0; i<index; i++){
                attrend += attrarr[i] + " ";
            }
            return attrend;
        },
        /*对象排序比较函数*/
        compare :function(propertyName){
            return function (object1, object2) {
                var value1 = object1[propertyName];
                var value2 = object2[propertyName];
                if (value2 < value1) {
                    return -1;
                }
                else if (value2 > value1) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
        }
    };
    this.kingtansin = kingtansin;
})();


'use strict';
app.controller('globalCtrl', ['$scope', '$http', '$stateParams', '$state', '$modal', '$cookieStore', 'userMenu', 'modalTip', '$translate',  'switchLang','$filter'
    ,  function ($scope, $http, $stateParams, $state, $modal, $cookieStore,  userMenu, modalTip, $translate, switchLang,$filter) {

    var height = $(window).height();
    $("#logindiv").css({"height" : height})
    //angular transplate
    $scope.lang = { isopen: false };
    $scope.langs = {en_US:'English', zh_CN: '简体中文'};
    $scope.setLang = function(langKey, $event) {
        //current lang
        $scope.selectLang = langKey;
        $translate.use(langKey);
        $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales[langKey]);
    };

    /*$scope.$on('map-load', function (data) {
        var selectLang = $scope.selectLang;
        if (selectLang == 'zh_CN') {
            esriMapService.mapInstance._layers['anno_Ch'].show();
            esriMapService.mapInstance._layers['anno_Eh'].hide();
        }else if (selectLang == 'en_US') {
            esriMapService.mapInstance._layers['anno_Eh'].show();
            esriMapService.mapInstance._layers['anno_Ch'].hide();
        }
    });*/

    $scope.selectLang = $translate.use() || 'zh_CN';
    $scope.cur_langKey = $scope.selectLang;

    $scope.registration = function () {
        $state.go('appregister');
    };

    $scope.forget_password = function () {
        $state.go('forget_password');
    };
    var sr = $stateParams.error;
    if (sr == 1) {
        $scope.sessionError = "由于您长时间未操作系统,为了保障您的账户安全,请重新登陆!";
    }
    $scope.showError = false;
    $scope.user = {};
    $scope.authError = null;

    $scope.flag_setup = true;
    $scope.setup_def = false;

    $scope.isOrange = true;
    $scope.isSetUp = false;
    $scope.webType = 'web';
    $scope.sysType = 'behavior';

    $scope.create_code = function () {
        $scope.code = "";
        var codeLength = 4;
        var codeChars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
            'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
            'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
        for (var i = 0; i < codeLength; i++) {
            var charNum = Math.floor(Math.random() * 52);
            $scope.code += codeChars[charNum];
        }
    };
    $scope.open_modal = function () {
        $('#myModal').modal('show');
    }

    $scope.ok = function () {
        if (null != $scope.user.code && null != $scope.user.email) {
            if (angular.lowercase($scope.user.code) != angular.lowercase($scope.code)) {
                $scope.showError = true;
                $scope.authError = '验证码错误';
            } else {
                $scope.showError = false;
                $scope.flag_setup = false;
                $scope.setup_def = true;
                $scope.isSetUp = true;
                var url = 'user/readEmail?email=' + $scope.user.email;
                $http({
                    method: 'GET',
                    url: url
                }).success(function (data) {
                    $scope.isexist = !data;
                })
            }
        }
    };

    $scope.user_conf = function (dom) {
        $http({
            method: 'GET',
            url: 'user/getuser?userName=admin@' + $scope.user_account
        }).success(function (data) {
            if (data['result']) {
                $scope.error_msg = "当前帐户已被使用!";
            } else {
                $scope.error_msg = null;
            }
        });
    }

    $scope.domain_conf = function () {
        if ($scope.domain_name) {
            $http({
                method: 'GET',
                url: 'user/getdomain?domain=' + $scope.domain_name
            }).success(function (data) {
                if (data) {
                    $scope.domain_msg = "当前域名已被使用!";
                } else {
                    $scope.domain_msg = null;
                }
            });
        }
    }
    $scope.registers = function () {
        $scope.submitted = false;

        if ($scope.error_msg) {
            $scope.error_msg = "当前帐户已被使用!";
            return;
        }
        if ($scope.domain_msg) {
            $scope.domain_msg = "当前域名已被使用!";
            return;
        }

        if ($scope.forma.$valid) {
            var data = {
                userName: "admin@" + $scope.user_account,
                password: $scope.user_pwd,
                domain: $scope.domain_name,
                ip: $scope.server_ip,
                company: $scope.company_name,
                contact: $scope.contact_person,
                phone: $scope.contact_phone,
                email: $scope.contact_email,
                webType: $scope.webType,
                sysType: $scope.sysType
            };

            var transFn = function (data) {
                return $.param(data);
            };

            var postCfg = {
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                transformRequest: transFn
            };

            $http.post("user/regist", data, postCfg).success(function (data, status, headers, config) {
                $state.go("register_ok", {name: "admin@" + $scope.user_account});
            }).error(function (data, status, headers, config) {
            });
        } else {
            $scope.submitted = true;
        }
    };

    $scope.password_reset = function () {
        var flag = true;
        if (null == $scope.user_pwd) {
            $scope.pwd = true;
            $scope.pwd_msg = err_empty;
        } else {
            var regp = /^\w+$/;
            if (!regp.test($scope.user_pwd)) {
                $scope.pwd = true;
                $scope.pwd_msg = err_message;
                flag = false;
                return;
            } else {
                $scope.pwd = false;
            }
        }
        if (null == $scope.user_password) {
            $scope.password = true;
            $scope.password_msg = err_empty;
        } else {
            var pwds_regs = /^\w+$/;
            if ($scope.user_password != $scope.user_pwd) {
                $scope.password = true;
                $scope.password_msg = '输入密码不一致';
                flag = false;
                return;
            } else if (!pwds_regs.test($scope.user_password)) {
                $scope.password = true;
                $scope.password_msg = err_message;
                flag = false;
                return;
            } else {
                $scope.password = false;
            }
        }
        if (flag) {
            var url = '/user/register?action=activate&pwd=' + $scope.user_pwd
                + '&password=' + $scope.user_password + '&optype=4';
            $http.get(url).then(function (resp) {

                $state.go('register_account');
            });
        }
    };

    $scope.login = function () {
        var url = 'user/login?userName=' + $scope.user.userName + '&password=' + $scope.user.passWord;
        if ($scope.user.userName == null || $scope.user.userName.length == 0) {
            $scope.error_msg = "用户名不能为空!";
            return;
        }
        else if ($scope.user.passWord == null || $scope.user.passWord.length == 0) {
            $scope.error_msg = "密码不能为空!";
            return;
        }
        $http.get(url).then(function (resp) {
            var data = resp.data;

            if (data.userCode == 1) {

                if (data.result) {
                    userMenu.put(data.result);
                    // $cookieStore.put("userMenu", data.result);
                    $cookieStore.put("urlMap", data.result.urlMap);
                    $cookieStore.put("user",data.loginUser);

                    //设置logo和web名称

                    $scope.app.src = 'img/insure/logo.png';
                    $scope.app.name = '';
                    $scope.app.src2 = 'img/insure/copyright.png';

                    var facade;

                    if(data.result.item[0].item){
                        if(data.result.item[0].item[0].item){
                            facade = data.result.item[0].item[0].item[0].userdata[0].content;
                        }
                        else{
                            facade = data.result.item[0].item[0].userdata[0].content;
                        }

                    }else {
                        facade = data.result.item[0].userdata[0].content;
                    }

                    $state.go(facade);

                }else {
                    $scope.sessionError = data.message;
                }

            } else {
                $scope.error_msg = data.message;
            }
        });
    };

    $scope.modifyUserPasswd = function () {
        var modalInstance = $modal.open({
            templateUrl : 'updPwdModalContent.html',
            controller : 'updatePasswordCtrl',
            size : 'lg'
        });
        modalInstance.result.then(function(result) {

        });
    };

    $scope.changeApp = function (item) {
        $scope.$emit("modify_insure_global_default_app_event", item);
    };
    $scope.loginOut = function () {
        $http({
            url : 'user/loginOut'
        }).success(function(data) {
            if (data.result) {
                $cookieStore.remove("user");
                $state.go('applogin');
            } else {
                modalTip({
                    tip : '退出失败',
                    type : false,
                    /*callback : function() {
                     $state.go('applogin');
                     }*/
                })
            }
        });
    };

    if ($cookieStore.get("user")) {
        $scope.userName = $cookieStore.get("user").userName;
    }

    $scope.register_accounts = $stateParams.name;
    $scope.$watch('selectLang',function(newVal,oldVal,scope){
            if(newVal){
                $scope.login_title = switchLang.switchLang("天气保险服务平台");
                $scope.userNamePlaceholder = switchLang.switchLang("请输入用户名");
                $scope.pwdPlaceholder = switchLang.switchLang("请输入密码");
                $scope.login_btn = switchLang.switchLang("登录");
            }
    },true)

}]);

//重置密码
app.controller('pwd_reset', ['$scope', '$http', '$cookieStore', '$state', '$stateParams',
    function ($scope, $http, $cookieStore, $state, $stateParams) {
        $scope.loginOut = function () {
            $cookieStore.remove("userName");
            $cookieStore.remove("site_type");
            $state.go('applogin');
        };
        var pw = $stateParams.p;
        var issuc = $stateParams.issuc;
        if (issuc == "true") {
            $scope.ispwd = true;
            $scope.pwd = parseInt(pw, 32);
        } else {
            $scope.pwd = "密码未修改，联系管理员";
        }

    }]);

//主导航控制器
app.controller('NavCtrl', ['$scope', '$cookieStore', '$http', 'userMenu', 'userMenuService', function ($scope, $cookieStore, $http, userMenu, userMenuService) {
    //概览设置
    $scope.insure = {};
    $scope.insure.survey = {};

    $scope.navStyle = "";
    var array = [];
    var menus = [];

    if (userMenu.get().item) {
        array = userMenu.get().item;
        disposeMenu(array);
    } else {
        userMenuService.getUserMenu().then(function(obj){
            array = obj.result.item;
            //$scope.beacon = resp.data;
            //userMenu.put(resp.data.result);
            disposeMenu(array);

            //设置logo和web名称
            if ($cookieStore.get('user')) {
                $scope.app.src = 'img/insure/logo.png';
                $scope.app.name = '专知管理平台';
                $scope.app.src2 = 'img/insure/copyright.png';
            }
        })


    }

    function disposeMenu(array) {
        if(array[0].id==1){
            array = array[0].item;
        }
        for (var i = 0; i < array.length; i++) {

            if (array[i].userdata[4].content == 1) { //如果是叶子节点
                var menu = {};
                menu.icon = array[i].userdata[3].content;
                menu.name = array[i].text;
                menu.href = array[i].userdata[0].content;
                menu.isLeaf = array[i].userdata[4].content;
                menus.push(menu);
            } else {
                var sub_array = array[i].item;
                if (sub_array) {
                    var menu = {};
                    menu.icon = array[i].userdata[3].content;
                    menu.name = array[i].text;
                    menu.submenus = [];
                    for (var j = 0; j < sub_array.length; j++) {
                        var sub_menu = {};
                        sub_menu.name = sub_array[j].text;
                        sub_menu.href = sub_array[j].userdata[0].content;
                        sub_menu.isLeaf = sub_array[j].userdata[4].content;
                        menu.submenus.push(sub_menu);
                    }
                    menus.push(menu);
                }
            }
        }
        //TODO 测试方便加的
        var menu = {};
        menu.icon = 'icon-info';
        menu.name = '类型管理';
        menu.submenus = [];

        var sub_menu = {};
        sub_menu.name = '文章管理';
        sub_menu.href = 'app.insure.article_manage';
        sub_menu.isLeaf = '1';
        menu.submenus.push(sub_menu);
        var sub_menu3 = {};
        sub_menu3.name = '文章统计';
        sub_menu3.href = 'app.insure.article_data';
        sub_menu3.isLeaf = '1';
        menu.submenus.push(sub_menu3);
        var sub_menu1 = {};
        sub_menu1.name = '论文管理';
        sub_menu1.href = 'app.insure.paper_manage';
        sub_menu1.isLeaf = '1';
        menu.submenus.push(sub_menu1);
        var sub_menu4 = {};
        sub_menu4.name = '论文统计';
        sub_menu4.href = 'app.insure.paper_data';
        sub_menu4.isLeaf = '1';
        menu.submenus.push(sub_menu4);
        var sub_menu2 = {};
        sub_menu2.name = '分类管理';
        sub_menu2.href = 'app.insure.type_manage';
        sub_menu2.isLeaf = '1';
        menu.submenus.push(sub_menu2);
        var sub_menu5 = {};
        sub_menu5.name = '精品名称管理';
        sub_menu5.href = 'app.insure.pub_type_manage';
        sub_menu5.isLeaf = '1';
        menu.submenus.push(sub_menu5);
        var sub_menu6 = {};
        sub_menu6.name = '待修复分类管理';
        sub_menu6.href = 'app.insure.todo_type_manage';
        sub_menu6.isLeaf = '1';
        menu.submenus.push(sub_menu6);
        var sub_menu7 = {};
        sub_menu7.name = '回收站管理';
        sub_menu7.href = 'app.insure.recycle_manage';
        sub_menu7.isLeaf = '1';
        menu.submenus.push(sub_menu7);
        var sub_menu8 = {};
        sub_menu8.name = '期刊名称管理';
        sub_menu8.href = 'app.insure.posting_manage';
        sub_menu8.isLeaf = '1';
        menu.submenus.push(sub_menu8);
        menus.push(menu);
        
        var menuAdmin = {};
        menuAdmin.icon = 'icon-info';
        menuAdmin.name = '权限管理';
        menuAdmin.submenus = [];

        var sub_menu = {};
        sub_menu.name = '管理员';
        sub_menu.href = 'app.insure.admin_list';
        sub_menu.isLeaf = '1';
        menuAdmin.submenus.push(sub_menu);
        var sub_menu2 = {};
        sub_menu2.name = '添加管理员';
        sub_menu2.href = 'app.insure.admin_add';
        sub_menu2.isLeaf = '1';
        menuAdmin.submenus.push(sub_menu2);
        menus.push(menuAdmin);
        //TODO 测试方便加的

        $scope.insure.menus = menus;
    }
}]);

//修改密码
app.controller('updatePasswordCtrl', ['$scope', '$http', 'modalTip', '$state', '$modalInstance', function($scope, $http, modalTip, $state, $modalInstance) {
    $scope.title = '修改密码';
    $scope.formparam = {};

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    }

    $scope.ok = function(e) {
        var newPwd = $scope.formparam.newPwd;
        var entPwd = $scope.formparam.entPwd;

        if (newPwd != entPwd) {
            $scope.error_msg = '新密码和再次输入新密码不一样！';
            return;
        }
        if (newPwd.indexOf('#') > -1) {
            $scope.error_msg = '新密码中不能包含"#"';
            return;
        }

        $scope.error_msg = '';

        var target = $(e.target);
        target.attr('disabled', 'disabled');

        $http({
            url : 'user/modifyPassword',
            params : {
                password : $scope.formparam.oldPwd,
                newPassword : newPwd
            }
        }).success(function(data) {
            if (data.mcode == 1) {
                $scope.error_msg = data.message;
                target.removeAttr('disabled');
            } else if (data.mcode == 0) {
                modalTip({
                    tip : '修改成功',
                    type : true,
                    callback : function() {
                        $modalInstance.close();
                        $state.go('applogin');
                    }
                });
            }
        });
    }
}]);

//配置管理－用户管理管理-修改密码
app.controller('modifyUserPasswdCtrl', ['$scope', '$modalInstance', '$cookieStore', '$http', function ($scope, $modalInstance, $cookieStore, $http) {
    $scope.title = "修改密码";

    this.oldpass = "";
    this.newpass = "";
    this.confirmPass = "";
    var un = $cookieStore.get("userName");
    $scope.confirmpw = function () {
        $http({
            method: 'GET',
            url: 'user/getOldpw?userName=' + un + '&pw=' + this.oldpass
        }).success(function (data) {
            if (!data['result']) {
                $scope.error_msg = "无法与旧密码进行匹配!!!";
                $scope.flag = true;
            } else {
                $scope.error_msg = "";
                $scope.flag = false;
            }
        })
    }

    $scope.conf = function () {
        if (!this.newpass) {
            $scope.error_msg = "密码不能为空!!!";
            return;
        }
        if (this.newpass.length < 8 || this.newpass.length > 16) {
            $scope.error_msg = "密码需大于等于8或不小于16的数字或字母!";
            return;
        }
        if (!this.confirmPass) {
            $scope.error_msg = "确认密码不能为空!!!";
            return;
        }
        if (this.newpass != this.confirmPass) {
            $scope.error_msg = "新密码与确认密码不匹配!";
            return;
        }
        if ($scope.flag) {
            $scope.error_msg = "无法与旧密码进行匹配!!!";
            return;
        }

        var url = 'user/modifyPassword?userName=' + $cookieStore.get("userName") + '&password=' + this.oldpass + '&newPassword=' + this.newpass;
        $http.get(url).then(function (resp) {
            var data = resp.data;
            if (data.result) {
                $modalInstance.close();
            }
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);

//异常控制器
app.controller('exceptionCtrl', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
    $scope.errorCode = $stateParams.errorCode;
    $scope.errorMsg = $stateParams.errorMsg;
}]);

//付费提示控制器
app.controller('payTipController', ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
}]);

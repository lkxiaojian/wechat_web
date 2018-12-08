'use strict';

app.controller('welcomeCtrl', ['$s' +
'cope', function ($scope) {
    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
}]);

//用户管理
app.controller('userRightsManageCtrl', ['$scope', '$state', '$modal', '$http', 'modalTip', '$compile', 'rowData', '$cookieStore', 'switchLang',
    function ($scope, $state, $modal, $http, modalTip, $compile, rowData, $cookieStore, switchLang) {
    $scope.groupListObj = {
        gName: ''
    }
    $scope.addUserGroup = function (row) {
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent4.html',
            controller: 'addUserGroupCtrl',
            size: 'lg',
            resolve: {
                obj: function () {
                    return row;
                }
            }
        });
        modalInstance.result.then(function () {
            if (angular.element('#usergrouptable')) {
                angular.element('#usergrouptable').bootstrapTable('selectPage', 1);
            }
            if (angular.element('#userrmgtable')) {
                angular.element('#userrmgtable').bootstrapTable('selectPage', 1);
            }
        });
    };
    $scope.searchgroupBtn = function () {
        angular.element('#usergrouptable').bootstrapTable('refresh');
    };
    $scope.userTypeDtOpt = {
        //data : [{user_type_name:'平台用户', description:'平台用户描述'},{user_type_name:'租户', description:'租户描述'}],
        pagination: true,
        url: 'group/query',
        resultTag: 'result',
        queryParams: function (params) {
            // console.log(params);
            $.extend(params, {
                view: 'select',
                gName: $scope.groupListObj.gName ? $scope.groupListObj.gName : ''
            });
            return params;
        },
        columns: [{
            title: switchLang.switchLang('userRightManage.userGroupTbl.groupName'),
            class: 'col-md-1',
            // field: 'group_name',
            formatter: function (value, row, index) {
                return switchLang.switchLang(row.group_name);
            },
            align: 'center',
            sortable: true,
            width: '10%'
        }, {
            title: switchLang.switchLang('userRightManage.userGroupTbl.groupNote'),
            class: 'col-md-1',
            // field: 'group_note',
            formatter: function (value, row, index) {
                return switchLang.switchLang(row.group_note);
            },
            align: 'center',
            sortable: false,
            width: '15%'
        },
            {
                title: switchLang.switchLang('common.btn.optionBtn'),
                class: 'col-md-1',
                align: 'center',
                formatter: function (value, row, index) {
                    return '<a class="a-edit a-blue" href="javascript:;">' + switchLang.switchLang('common.btn.editBtn') + '</a>&nbsp;' +
                        '<a class="a-delete a-red" href="javascript:;">' + switchLang.switchLang('common.btn.delBtn') + '</a>';
                },
                events: {
                    'click .a-edit': function (e, value, row, index) {
                        var modalInstance = $modal.open({
                            templateUrl: 'myModalContent4.html',
                            controller: 'addUserGroupCtrl',
                            size: 'lg',
                            resolve: {
                                obj: function () {
                                    return angular.extend(row, {index: index});
                                }
                            }
                        });
                        modalInstance.result.then(function (result) {
                            $('#usergrouptable').bootstrapTable('updateRow', {index: result.index, row: result});
                        });
                    },
                    'click .a-delete': function (e, value, row, index) {
                        if (confirm(switchLang.switchLang('common.btn.confirmDelBtn'))) {
                            $http({
                                method: "POST",
                                url: 'group/manager?view=delete',
                                data: {
                                    groupId: row.group_id
                                }
                            }).success(function (data) {
                                if (data.success) {
                                    modalTip({
                                        tip: switchLang.switchLang('common.tips.delSuccess'),
                                        type: true
                                    });
                                    $scope.groupInstance.bootstrapTable('selectPage', 1);
                                    $scope.tdInstance.bootstrapTable('selectPage', 1);
                                } else {
                                    modalTip({
                                        tip: switchLang.switchLang('common.tips.delFailed'),
                                        type: false
                                    });
                                }
                            })
                            /*$.ajax({
                             url: 'group/manager?view=delete',
                             type: 'POST',
                             data: {
                             groupId: row.group_id,
                             },
                             success: function (data) {
                             if (data.success) {
                             modalTip({
                             tip: switchLang.switchLang('common.tips.delSuccess'),
                             type: true
                             });
                             $scope.groupInstance.bootstrapTable('selectPage', 1);
                             $scope.tdInstance.bootstrapTable('selectPage', 1);
                             } else {
                             modalTip({
                             tip: switchLang.switchLang('common.tips.delFailed'),
                             type: false
                             });
                             }
                             }
                             });*/
                        }
                    }
                },
                width: '15%'
            },
            {
                title: switchLang.switchLang('common.authorize.authorizeBtn'),
                class: 'col-md-1',
                align: 'center',
                formatter: function (value, row, index) {
                    return '<a class="a-groupaccredit a-blue" href="javascript:;">' + switchLang.switchLang('common.authorize.moduleAuthorizeBtn') + '</a>';
                },
                events: {
                    'click .a-groupaccredit': function (e, value, row, index) {
                        var modalInstance = $modal.open({
                            templateUrl: 'myModalContent3.html',
                            controller: 'groupAccreditCtrl',
                            resolve: {
                                obj: function () {
                                    return angular.extend(row, {index: index});
                                }
                            }
                        });
                        modalInstance.result.then(function (result) {

                        });
                    }
                },
                width: '10%'
            }]
    };


    $scope.userListObj = {
        uName: '',
        uEmail: ''
    };
    $scope.addUser = function () {
        $state.go('app.insure.sysManage_userRightsManange_addUser', {'param': 'add'});
    };

    $scope.searchUserBtn = function () {
        angular.element('#userrmgtable').bootstrapTable('refresh');
    };
    $scope.deleteUser = function () {
        var selectRow = angular.element('#userrmgtable').bootstrapTable('getSelections');

        if (selectRow.length) {
            var ids = '';
            $.each(selectRow, function (index, item) {
                ids += "," + item.user_id;
            });
            ids = ids.substr(1);

            if (confirm(switchLang.switchLang('common.btn.confirmDelBtn'))) {
                $http({
                    method: 'GET',
                    url: 'user/manage',
                    params: {
                        view: 'delete',
                        userId: ids
                    }
                }).success(function (data) {
                    if (data.delcode == 0) {
                        modalTip({
                            tip: data.message,
                            type: true
                        });
                        angular.element('#userrmgtable').bootstrapTable('selectPage', 1);
                    } else if (data.delcode == 1 || data.delcode == 2) {
                        modalTip({
                            tip: data.message,
                            type: false
                        });
                    }
                })
                /*$.ajax({
                 url: 'user/manager?view=delete',
                 type: "POST",
                 data: {
                 userId: ids
                 },
                 success: function (data) {
                 if (data.delcode == 0) {
                 modalTip({
                 tip: data.message,
                 type: true
                 });
                 angular.element('#userrmgtable').bootstrapTable('selectPage', 1);
                 } else if (data.delcode == 1 || data.delcode == 2) {
                 modalTip({
                 tip: data.message,
                 type: false
                 });
                 }
                 }
                 });*/
            }
        } else {
            modalTip({
                tip: switchLang.switchLang('common.tips.delSelect'),
                type: false
            });
        }
    };

    $scope.userListDtOpt = {
        /*data : [{user_name:111, user_email:'xfdafd@126.com', user_mobile:'13333333333', state:'启用'},
         {user_name:111, user_email:'xfdafd@126.com', user_mobile:'13333333333', state:'启用'},
         {user_name:111, user_email:'xfdafd@126.com', user_mobile:'13333333333', state:'启用'}],*/
        url: 'user/query',
        resultTag: 'result',
        queryParams: function (params) {
            // console.log(params)
            $.extend(params, {
                view: 'select',
                userName: $scope.userListObj.uName ? $scope.userListObj.uName : '',
                userEmail: $scope.userListObj.uEmail ? $scope.userListObj.uEmail : ''
            });
            return params;
        },
        columns: [{
            checkbox: true,
            boxwidth: 15
        }, {
            title: switchLang.switchLang('userRightManage.userTbl.userName'),
            class: 'col-md-1',
            field: 'user_name',
            align: 'center',
            sortable: true,
            /*formatter : function(value, row, index) {
             return 'ACL-' + value
             }*/
            width: "10%"
        }, {
            title: switchLang.switchLang('userRightManage.userTbl.groupName'),
            class: 'col-md-1',
            // field: 'group_name',
            formatter: function (value, row, index) {
                return switchLang.switchLang(row.group_name)
            },
            align: 'center',
            sortable: false,
            // formatter: function (value, row, index) {
            //     return value ? value : '-';
            // }
        },
            {
                title: switchLang.switchLang('userRightManage.userTbl.email'),
                class: 'col-md-1',
                field: 'email',
                align: 'center',
                sortable: false,
                width: "20%"
            }, {
                title: switchLang.switchLang('userRightManage.userTbl.phone'),
                class: 'col-md-1',
                field: 'phone',
                align: 'center',
                sortable: false,
                width: "15%"
            }, {
                title: switchLang.switchLang('userRightManage.userTbl.enableUser'),
                class: 'col-md-4',
                field: 'status',
                align: 'center',
                sortable: false,
                formatter: function (value, row, index) {
                    var b = (value == 2);
                    //btn-common
                    var compiled = $compile('<button  route-flag="userState" btn-flag="disable" class=\"btn btn-switch w-xxs btn-sm ' + ( b ? 'btn-success' : 'btn-warning') + '\">' + ( b ? switchLang.switchLang("common.btn.enableBtn") : switchLang.switchLang("common.btn.frozenBtn")) + '</button>')($scope);
                    return compiled[0].outerHTML;
                },
                events: {
                    'click .btn-switch': function (e, value, row, index) {
                        var _this = $(this);
                        var isStart = '';
                        if (_this.text() == switchLang.switchLang('common.btn.frozenBtn')) {
                            isStart = 2;
                        } else {
                            isStart = 1;
                        }
                        $http({
                            method: 'GET',
                            url: 'user/manager',
                            params: {
                                view: 'updateStatus',
                                userId: row.user_id,
                                status: isStart
                            }
                        }).success(function () {
                            isStart == '2' ? _this.removeClass('btn-warning').addClass('btn-success').html(switchLang.switchLang('common.btn.enableBtn')) : _this.removeClass('btn-success').addClass('btn-warning').html(switchLang.switchLang('common.btn.frozenBtn'));
                        })
                        /*$.ajax({
                         url: 'user/manager?view=updateStatus',
                         data: {
                         userId: row.user_id,
                         status: isStart
                         },
                         success: function () {
                         isStart == '2' ? _this.removeClass('btn-warning').addClass('btn-success').html(switchLang.switchLang('common.btn.enableBtn')) : _this.removeClass('btn-success').addClass('btn-warning').html(switchLang.switchLang('common.btn.frozenBtn'));
                         }
                         })*/
                    }
                },
                width: "10%"
            }, {
                title: switchLang.switchLang('common.btn.optionBtn'),
                class: 'col-md-1',
                align: 'center',
                formatter: function (value, row, index) {
                    //return '<i class="fa fa-edit text-info"></i>&nbsp;<i class="glyphicon glyphicon-trash' + ' text-danger"></i>';btn-common
                    var edit = $compile('<a  route-flag="editUser" btn-flag="a" class="a-edit a-blue" href="javascript:;">' + switchLang.switchLang("common.btn.editBtn") + '</a>')($scope);
                    var del = $compile('<a  route-flag="delUser" btn-flag="a-del" class="a-delete a-red" href="javascript:;">' + switchLang.switchLang("common.btn.delBtn") + '</a>')($scope);
                    return edit[0].outerHTML + '&nbsp;' + del[0].outerHTML;
                },
                events: {
                    'click .a-edit': function (e, value, row, index) {
                        rowData[0] = row;
                        $state.go('app.insure.sysManage_userRightsManange_editUser');
                    },
                    'click .a-delete': function (e, value, row, index) {
                        if (confirm(switchLang.switchLang('common.btn.confirmDelBtn'))) {
                            $http({
                                method: 'GET',
                                url: 'user/manager',
                                params: {
                                    view: 'delete',
                                    userId: row.user_id
                                }
                            }).success(function (data) {
                                if (data.delcode == 0) {
                                    modalTip({
                                        tip: data.message,
                                        type: true
                                    });
                                    // $scope.tdInstance.bootstrapTable('selectPage', 1);
                                    angular.element('#userrmgtable').bootstrapTable('selectPage', 1);
                                } else if (data.delcode == 1 || data.delcode == 2) {
                                    modalTip({
                                        tip: data.message,
                                        type: false
                                    });
                                }
                            })
                            /*$.ajax({
                             url: 'user/manager?view=delete',
                             type: 'POST',
                             data: {
                             userId: row.user_id
                             },
                             success: function (data) {
                             if (data.delcode == 0) {
                             modalTip({
                             tip: data.message,
                             type: true
                             });
                             // $scope.tdInstance.bootstrapTable('selectPage', 1);
                             angular.element('#userrmgtable').bootstrapTable('selectPage', 1);
                             } else if (data.delcode == 1 || data.delcode == 2) {
                             modalTip({
                             tip: data.message,
                             type: false
                             });
                             }
                             }
                             });*/
                        }
                    }
                },
                width: "10%"
            }, {
                title: switchLang.switchLang('common.authorize.authorizeBtn'),
                class: 'col-md-1',
                align: 'center',
                field: 'user_type',
                formatter: function (value, row, index) {
                    //if (value == 1) {
                    //return '<i class="fa fa-edit text-info"></i>&nbsp;<i class="glyphicon glyphicon-trash' + ' text-danger"></i>';btn-common
                    var jssq = $compile('<a  route-flag="jssq" btn-flag="a" class="a-roleaccredit a-blue" href="javascript:;">' + switchLang.switchLang("common.authorize.roleAuthorizeBtn") + '</a>')($scope);
                    var mksq = $compile('<a  route-flag="mksq" btn-flag="a" class="a-menuaccredit a-blue" href="javascript:;">' + switchLang.switchLang("common.authorize.moduleAuthorizeBtn") + '</a>')($scope);
                    return jssq[0].outerHTML + '&nbsp;' + mksq[0].outerHTML;
                    //} else {
                    //    return '';
                    //}
                },
                events: {
                    'click .a-roleaccredit': function (e, value, row, index) {
                        var modalInstance = $modal.open({
                            templateUrl: 'myModalContent2.html',
                            controller: 'roleAccreditCtrl',
                            resolve: {
                                obj: function () {
                                    return angular.extend(row, {index: index});
                                }
                            }
                        });
                        modalInstance.result.then(function (result) {

                        });
                    },
                    'click .a-menuaccredit': function (e, value, row, index) {
                        var modalInstance = $modal.open({
                            templateUrl: 'myModalContent3.html',
                            controller: 'menuAccreditUserCtrl',
                            resolve: {
                                obj: function () {
                                    return angular.extend(row, {index: index});
                                }
                            }
                        });
                        modalInstance.result.then(function (result) {

                        });
                    },
                },
                width: '30%'
            }]
    };
}]);
//新增用户组
app.controller('addUserGroupCtrl', ['$scope', 'obj', '$modalInstance', '$http', 'modalTip', 'switchLang', function ($scope, obj, $modalInstance, $http, modalTip, switchLang) {
    $scope.formparam = {};

    if (obj) {
        $scope.title = '编辑公司';
        $scope.formparam.groupName = obj.group_name;
        $scope.formparam.note = obj.group_note;
        $scope.formparam.groupEmail = obj.email;
        // if (obj.user_name.toString().split('@').length > 0 && obj.user_name.toString().split('@')[1] != null) {
        //     $scope.formparam.groupAdmin = obj.user_name.toString().split('@')[1];
        // }else {
        //     $scope.formparam.groupAdmin = '';
        // }

    } else {
        $scope.title = '新增公司';
        $scope.isVisible = true;
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function (e) {
        var target = $(e.target);
        target.attr('disabled', 'disabled');

        if (obj) {
            var curObj = {};
            curObj.index = obj.index;
            curObj.group_name = $scope.formparam.groupName;
            curObj.group_note = $scope.formparam.note;
            console.log('resetPwd=' + $scope.formparam.resetPwd);
            $http({
                url: 'group/manager?view=update',
                method: 'POST',
                data: {
                    groupId: obj.group_id,
                    groupName: $scope.formparam.groupName,
                    note: $scope.formparam.note,
                    groupEmail: $scope.formparam.groupEmail,
                    groupPassword: $scope.formparam.password
                }
            }).then(function (res) {
                if (res.data.success) {
                    modalTip({
                        tip: switchLang.switchLang('修改成功'),
                        type: true,
                        callback: function () {
                            $modalInstance.close(curObj);
                        }
                    });
                } else {
                    modalTip({
                        tip: switchLang.switchLang('修改失败'),
                        type: false
                    });
                    target.removeAttr('disabled');
                }
            });
        } else {
            //console.log($scope.formparam.groupName + '***' + $scope.formparam.groupEmail + '***' + $scope.formparam.groupAdmin + '***' + $scope.formparam.note + '***' + $scope.formparam.password);
            $http({
                url: 'group/manager?view=add',
                method: 'POST',
                data: {
                    groupName: $scope.formparam.groupName,
                    note: $scope.formparam.note,
                    groupEmail: $scope.formparam.groupEmail,
                    admin: $scope.formparam.groupAdmin,
                    password: $scope.formparam.password
                }
            }).then(function (res) {
                if (res.data.success) {
                    modalTip({
                        tip: switchLang.switchLang('添加成功'),
                        type: true,
                        callback: function () {
                            $modalInstance.close();
                        }
                    });
                } else {
                    modalTip({
                        tip: switchLang.switchLang('添加失败'),
                        type: false
                    });
                    target.removeAttr('disabled');
                }
            });
        }
    }
}]);
//新增用户
app.controller('adduserCtrl', ['$scope', 'rowData', '$http', 'modalTip', '$state', '$stateParams', '$cookieStore', '$modal', 'switchLang', 'insureUtil', function ($scope, rowData, $http, modalTip, $state, $stateParams, $cookieStore, $modal, switchLang, insureUtil) {
    if ($stateParams.param == 'add') {
        rowData[0] = null;
    }
    $scope.isShowForSuper = false;
    $scope.isShowForOther = false;
    $scope.title = '新增用户';
    $scope.isVisible = true;

    var longTime = new Date().getTime() + (1000 * 60 * 60 * 24 * 30);
    var time = insureUtil.dateToString(new Date(longTime), "yyyy/MM/dd");
    $scope.formparam = {
        isWorker: 'worker',
        isVip: '0',//0代表非会员，1代表会员
        group: '0',//0代表本公司，1代表其他公司
        suffixUserName: '@kingtansin.com',
        userType: '',
        expireDate: time,
        groupSelectChanged: function () {
            if ($scope.formparam.group == '1') {
                $scope.isShowForOther = true;
            } else if ($scope.formparam.group == '0') {
                $scope.isShowForOther = false;
                $scope.formparam.suffixUserName = '@kingtansin.com';
            }
        }
    };
    var user = $cookieStore.get("user");
    if (user) {
        if (user.userName == 'super') {
            $scope.formparam.userType = '1';
            $scope.isShowForSuper = true;
        } else {
            $scope.formparam.userType = user.userType;
        }
        if (user.userName.split('@').length > 1) {
            if (user.userName.split('@')[1].indexOf('kingtansin') > -1) {
                $scope.isShowForSuper = true;
            } else {
                $scope.formparam.suffixUserName = '@' + user.userName.split('@')[1];
            }
        }
    }

    if (rowData[0]) {
        $scope.title = '编辑用户';
        $scope.isVisible = false;
        if (rowData[0].user_name.indexOf('@') != -1) {
            $scope.formparam.userName = rowData[0].user_name.split('@')[0];
            $scope.formparam.suffixUserName = '@' + rowData[0].user_name.split('@')[1];
        } else {
            $scope.formparam.userName = rowData[0].user_name;
            $scope.formparam.suffixUserName = '';
        }
        $scope.formparam.isVip = rowData[0].isvip;
        $scope.formparam.email = rowData[0].email;
        $scope.formparam.phone = rowData[0].phone;
        if (rowData[0].expire_date) {
            $scope.formparam.expireDate = rowData[0].expire_date.replace(/-/g, '/');
        }
    }
    $scope.userGroupOnFocus = function () {
        //创建公司-admin列表的模态窗口
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'selectUserGroupController',
            size: 'lg',
            resolve: {
                obj: function () {
                    return {};
                }
            }
        });
        modalInstance.result.then(function (selectRow) {
            var user_name = selectRow[0].user_name;
            if (user_name.indexOf('@') != -1) {
                $('#userGroup').val(selectRow[0].group_name);
                $scope.formparam.suffixUserName = user_name.substring(user_name.indexOf('@'));
                $scope.formparam.userType = selectRow[0].group_code;
            }
        });
    };
    $scope.reset = function () {
        //清空的同时会把验证提示显示出来
        $('#userGroup').val('');
        $scope.formparam.userName = '';
        $scope.formparam.password = '';
        $scope.formparam.phone = '';
        $scope.formparam.email = '';
    };
    $scope.ok = function (e) {
        var target = $(e.target);
        target.attr('disabled', 'disabled');

        var expireDate = angular.element('#expireDate').val();
        if (!expireDate) {
            //继承父账号的到期时间和是否会员的属性
            $scope.formparam.isVip = user.isVip;
            expireDate = user.expireDate;
        }
        if (rowData[0]) {
            var curObj = {};
            curObj.index = rowData[0].index;
            curObj.user_name = $scope.formparam.userName;
            curObj.email = $scope.formparam.email;
            curObj.phone = $scope.formparam.phone;
            $http({
                url: 'user/manager?view=update',
                method: 'POST',
                data: {
                    userName: $scope.formparam.userName + $scope.formparam.suffixUserName,
                    phone: $scope.formparam.phone,
                    email: $scope.formparam.email,
                    userId: rowData[0].user_id,
                    is_worker: $scope.formparam.isWorker,
                    isVip: $scope.formparam.isVip,
                    expireDate: expireDate
                }
            }).then(function (res) {
                if (res.data.success) {
                    modalTip({
                        tip: switchLang.switchLang('修改成功'),
                        type: true,
                        callback: function () {
                            $state.go('app.insure.sysManage_userRightsManange');
                        }
                    });
                } else {
                    modalTip({
                        tip: switchLang.switchLang('修改失败'),
                        type: false
                    });
                    target.removeAttr('disabled');
                }
            });
        } else {
            // console.log($scope.formparam.userName + "***" + $scope.formparam.password + "***" + $scope.formparam.phone
            //      + "***" + $scope.formparam.email + "***" + $scope.formparam.isWorker
            //      + "***" + expireDate
            //      + "***" + $scope.formparam.isVip + "***" + $scope.formparam.userType);

            $http({
                url: 'user/manager?view=add',
                method: 'POST',
                data: {
                    userName: $scope.formparam.userName + $scope.formparam.suffixUserName,
                    password: $scope.formparam.password,
                    phone: $scope.formparam.phone,
                    email: $scope.formparam.email,
                    is_worker: $scope.formparam.isWorker,
                    isVip: $scope.formparam.isVip,
                    userType: $scope.formparam.userType,
                    expireDate: expireDate
                }
            }).then(function (res) {
                if (res.data.success) {
                    modalTip({
                        tip: switchLang.switchLang('添加成功'),
                        type: true,
                        callback: function () {
                            $state.go('app.insure.sysManage_userRightsManange');
                        }
                    });
                } else {
                    modalTip({
                        tip: switchLang.switchLang('添加失败'),
                        type: false
                    });
                    target.removeAttr('disabled');
                }
            });
        }
    }
}]);
//选择公司及对应的admin账号(super或@kingtansin账号新建其他公司账号时使用)
app.controller('selectUserGroupController', ['$scope', '$modalInstance', 'switchLang', 'modalTip', function ($scope, $modalInstance, switchLang, modalTip) {
    $scope.title = '公司选择';
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.selectGroupDtOpt = {
        url: 'user/manager?view=selectadmin',
        resultTag: 'result',
        columns: [{
            checkbox: true,
            boxwidth: 15
        }, {
            title: switchLang.switchLang('公司名称'),
            class: 'col-md-1',
            field: 'group_name',
            align: 'center',
            width: '30%',
            sortable: true
        }, {
            title: switchLang.switchLang('名称后缀'),
            class: 'col-md-1',
            field: 'user_name',
            align: 'center',
            width: '30%',
            formatter: function (value, row, index) {
                if (value.indexOf('@') != -1) {
                    return '@' + value.split('@')[1];
                } else {
                    return value;
                }
            }
        }]
    };
    $scope.ok = function (e) {
        var selectRow = $('#selectgrouptable').bootstrapTable('getSelections');
        if (selectRow.length > 1) {
            modalTip({
                tip: '只能选择一个公司!',
                type: false
            })
        } else {
            $modalInstance.close(selectRow);
        }
    }

}]);
//模块授权(用户管理-针对用户组)
app.controller('groupAccreditCtrl', ['$scope', 'obj', '$modalInstance', '$http', 'modalTip', 'rowData', 'switchLang', function ($scope, obj, $modalInstance, $http, modalTip, rowData, switchLang) {
    $scope.title = '模块授权';
    $scope.optdescript = obj.group_name;

    $scope.groupid = obj.group_code;//传给弹出层的作用域里的变量

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        var menuIds = rowData[0];
        if (menuIds == '') {
            modalTip({
                tip: switchLang.switchLang('请选择权限'),
                type: false
            });
        } else {
            if (confirm(switchLang.switchLang('确认授权吗？'))) {
                $http({
                    method: 'POST',
                    url: 'group/manager?view=addMenu',
                    data: {
                        groupCode: obj.group_code,
                        menuIds: menuIds
                    }
                }).success(function (data) {
                    if (data.success) {
                        modalTip({
                            tip: switchLang.switchLang('授权成功'),
                            type: true,
                            callback: function () {
                                $modalInstance.close();
                            }
                        });
                    } else {
                        modalTip({
                            tip: switchLang.switchLang('授权失败'),
                            type: false
                        });
                    }
                });
                /*$.ajax({
                 url: 'group/manager?view=addMenu',
                 type: 'post',
                 data: {
                 groupCode: obj.group_code,
                 menuIds: menuIds
                 },
                 success: function (data) {
                 if (data.success) {
                 modalTip({
                 tip: switchLang.switchLang('授权成功'),
                 type: true,
                 callback: function () {
                 $modalInstance.close();
                 }
                 });
                 } else {
                 modalTip({
                 tip: switchLang.switchLang('授权失败'),
                 type: false
                 });
                 }
                 }
                 });*/
            }
        }
    };
}]);
//角色授权
app.controller('roleAccreditCtrl', ['$scope', 'obj', '$modalInstance', '$http', 'modalTip', 'switchLang', function ($scope, obj, $modalInstance, $http, modalTip, switchLang) {
    $scope.title = '角色授权';
    $scope.optdescript = obj.user_name;
    $scope.roleaccredit = {};
    var roleIds = [];
    var flag = true;
    $scope.dtOpt = {
        url: 'role/manager?view=select',
        /*responseHandler : function(res) {
         return res
         },*/
        resultTag: 'result',
        columns: [{
            checkbox: true,
            boxwidth: 15
        }, {
            title: switchLang.switchLang('角色名称'),
            class: 'col-md-1',
            field: 'role_name',
            align: 'center',
            sortable: true,
            width: "20%",
        }, {
            title: switchLang.switchLang('角色描述'),
            class: 'col-md-1',
            field: 'role_note',
            align: 'center',
            sortable: false,
            width: "30%"
        }],
        onLoadSuccess: function () {
            if (flag) {
                $http({
                    url: 'user/manager?view=selectRole',
                    params: {
                        userId: obj.user_id
                    }
                }).success(function (data) {
                    flag = false;
                    for (var i = 0; i < data.result.length; i++) {
                        roleIds.push(data.result[i].role_id);
                    }
                    $scope.roleaccredit.tdInstance.bootstrapTable('checkBy', {field: 'role_id', values: roleIds});

                    $('#role_accredit_tab').on('check.bs.table', function (e, obj) {
                        if (roleIds.length == 0) {
                            roleIds.push(obj.role_id);
                        }
                        for (var i = 0; i < roleIds.length; i++) {
                            if (roleIds[i] == obj.role_id) {
                                break;
                            }
                            if (i == roleIds.length - 1) {
                                roleIds.push(obj.role_id);
                            }
                        }
                    });
                    $('#role_accredit_tab').on('uncheck.bs.table', function (e, obj) {
                        for (var i = 0; i < roleIds.length; i++) {
                            if (roleIds[i] == obj.role_id) {
                                roleIds.splice(i, 1);
                                break;
                            }
                        }
                    });
                    $('#role_accredit_tab').on('check-all.bs.table', function (e, obj) {
                        if (roleIds.length == 0) {
                            for (var i = 0; i < obj.length; i++) {
                                roleIds.push(obj[i].role_id);
                            }
                        }
                        for (var i = 0; i < obj.length; i++) {
                            for (var j = 0; j < roleIds.length; j++) {
                                if (roleIds[j] == obj[i].role_id) {
                                    break;
                                }
                                if (j == roleIds.length - 1) {
                                    roleIds.push(obj[i].role_id);
                                }
                            }
                        }
                    });
                    $('#role_accredit_tab').on('uncheck-all.bs.table', function (e, obj) {
                        for (var i = 0; i < obj.length; i++) {
                            for (var j = 0; j < roleIds.length; j++) {
                                if (roleIds[j] == obj[i].role_id) {
                                    roleIds.splice(j, 1);
                                    break;
                                }
                            }
                        }
                    });
                });
            }
            $scope.roleaccredit.tdInstance.bootstrapTable('checkBy', {field: 'role_id', values: roleIds});
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.ok = function (e) {
        if (roleIds.length) {
            var ids = '';
            $.each(roleIds, function (index, item) {
                ids += "," + item;
            });
            ids = ids.substr(1);
            if (confirm(switchLang.switchLang('确认授权吗？'))) {
                $http({
                    method: 'POST',
                    url: 'user/manager?view=addRole',
                    data: {
                        userId: obj.user_id,
                        roleIds: ids,
                        groupId: obj.user_type
                    }
                }).success(function (data) {
                    if (data.success) {
                        modalTip({
                            tip: switchLang.switchLang('授权成功'),
                            type: true,
                            callback: function () {
                                $modalInstance.close();
                            }
                        });
                    } else {
                        modalTip({
                            tip: switchLang.switchLang('授权失败'),
                            type: false
                        });
                    }
                })
                /*$.ajax({
                 url: 'user/manager?view=addRole',
                 type: 'post',
                 data: {
                 userId: obj.user_id,
                 roleIds: ids
                 },
                 success: function (data) {
                 if (data.success) {
                 modalTip({
                 tip: switchLang.switchLang('授权成功'),
                 type: true,
                 callback: function () {
                 $modalInstance.close();
                 }
                 });
                 } else {
                 modalTip({
                 tip: switchLang.switchLang('授权失败'),
                 type: false
                 });
                 }
                 }
                 });*/
            }
        } else {
            modalTip({
                tip: switchLang.switchLang('请选择需要授权的角色'),
                type: false
            });
        }
    };
}]);
//模块授权(用户管理-针对用户)
app.controller('menuAccreditUserCtrl', ['$scope', 'obj', '$modalInstance', '$http', 'modalTip', 'rowData', 'switchLang', function ($scope, obj, $modalInstance, $http, modalTip, rowData, switchLang) {
    $scope.title = '模块授权';
    $scope.optdescript = obj.user_name;

    //$scope.userid = obj.user_id;//传给弹出层的作用域里的变量
    $scope.userObj = {userId: obj.user_id, parentId: obj.parent_id, userType: obj.user_type};//传给弹出层的作用域里的变量

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.ok = function (e) {
        //console.log($scope.menuIds);//???
        //console.log($("#menuIds").val());
        //var menuIds = $("#menuIds").val();
        var menuIds = rowData[0];
        var unChecked = rowData[1];
        if (menuIds == '' && unChecked == '') {
            modalTip({
                tip: switchLang.switchLang('权限已满'),
                type: false
            });
        } else {
            if (confirm(switchLang.switchLang('确认授权吗？'))) {
                $http({
                    method: 'POST',
                    url: 'user/manager?view=addMenu',
                    data: {
                        userId: obj.user_id,
                        menuIds: menuIds,
                        unCheckedId: unChecked,
                        userType: obj.user_type
                    }
                }).success(function (data) {
                    if (data.success) {
                        modalTip({
                            tip: switchLang.switchLang('授权成功'),
                            type: true,
                            callback: function () {
                                $modalInstance.close();
                            }
                        });
                    } else {
                        modalTip({
                            tip: switchLang.switchLang('授权失败'),
                            type: false
                        });
                    }
                });
                /*$.ajax({
                 url: 'user/manager?view=addMenu',
                 type: 'post',
                 data: {
                 userId: obj.user_id,
                 menuIds: menuIds
                 },
                 success: function (data) {
                 if (data.success) {
                 modalTip({
                 tip: switchLang.switchLang('授权成功'),
                 type: true,
                 callback: function () {
                 $modalInstance.close();
                 }
                 });
                 } else {
                 modalTip({
                 tip: switchLang.switchLang('授权失败'),
                 type: false
                 });
                 }
                 }
                 });*/
            }
        }
    };
}]);
//菜单授权
app.controller('menuAccreditRoleCtrl', ['$scope', 'obj', '$modalInstance', '$http', 'modalTip', 'rowData', 'switchLang', function ($scope, obj, $modalInstance, $http, modalTip, rowData, switchLang) {
    $scope.title = '资源授权';
    $scope.optdescript = obj.role_name;

    $scope.roleid = obj.role_id;//传给弹出层的作用域里的变量

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.ok = function (e) {
        //console.log($scope.menuIds);//???
        //console.log($("#menuIds").val());
        //var menuIds = $("#menuIds").val();
        var menuIds = rowData[0];
        if (menuIds == '') {
            modalTip({
                tip: switchLang.switchLang('请选择需要授权的资源'),
                type: false
            });
        } else {
            if (confirm(switchLang.switchLang('确认授权吗？'))) {
                $http({
                    method: 'POST',
                    url: 'role/manager?view=addMenu',
                    data: {
                        roleId: obj.role_id,
                        menuIds: menuIds
                    }
                }).success(function (data) {
                    if (data.success) {
                        modalTip({
                            tip: switchLang.switchLang('授权成功'),
                            type: true,
                            callback: function () {
                                $modalInstance.close();
                            }
                        });
                    } else {
                        modalTip({
                            tip: switchLang.switchLang('授权失败'),
                            type: false
                        });
                    }
                });
                /*$.ajax({
                 url: 'role/manager?view=addMenu',
                 type: 'post',
                 data: {
                 roleId: obj.role_id,
                 menuIds: menuIds
                 },
                 success: function (data) {
                 if (data.success) {
                 modalTip({
                 tip: switchLang.switchLang('授权成功'),
                 type: true,
                 callback: function () {
                 $modalInstance.close();
                 }
                 });
                 } else {
                 modalTip({
                 tip: switchLang.switchLang('授权失败'),
                 type: false
                 });
                 }
                 }
                 });*/
            }
        }
    };
}]);
//角色管理
app.controller('userRoleManageCtrl', ['$scope', '$modal', '$http', 'modalTip', '$compile', 'switchLang', function ($scope, $modal, $http, modalTip, $compile, switchLang) {
    $scope.addRole = function (row) {
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'addroleCtrl',
            size: 'lg',
            resolve: {
                obj: function () {
                    return row;
                }
            }
        });

        modalInstance.result.then(function () {
            if ($scope.tdInstance) {
                var data = $scope.tdInstance.bootstrapTable('getData');
                if (data.length) {
                    $scope.tdInstance.bootstrapTable('selectPage', 1);
                } else {
                    $scope.tdInstance.bootstrapTable('refresh');
                }
            }
        });
    };

    $scope.deleteRole = function () {
        var Td = $scope.tdInstance;
        var selectRow = Td.bootstrapTable('getSelections');

        if (selectRow.length) {
            var ids = '';
            $.each(selectRow, function (index, item) {
                ids += "," + item.role_id;
            });
            ids = ids.substr(1);

            if (confirm(switchLang.switchLang('common.btn.confirmDelBtn'))) {
                $http({
                    method: 'GET',
                    url: 'role/manager',
                    params: {
                        view: 'delete',
                        roleId: ids
                    }
                }).success(function (data) {
                    if (data.success) {
                        modalTip({
                            tip: switchLang.switchLang('common.tips.delSuccess'),
                            type: true
                        });
                        $scope.tdInstance.bootstrapTable('selectPage', 1);
                    } else {
                        modalTip({
                            tip: switchLang.switchLang('common.tips.delFailed'),
                            type: false
                        });
                    }
                });
                /*$.ajax({
                 url: 'role/manager?view=delete',
                 data: {
                 roleId: ids
                 },
                 success: function (data) {
                 if (data.success) {
                 modalTip({
                 tip: switchLang.switchLang('common.tips.delSuccess'),
                 type: true
                 });
                 $scope.tdInstance.bootstrapTable('selectPage', 1);
                 } else {
                 modalTip({
                 tip: switchLang.switchLang('common.tips.delFailed'),
                 type: false
                 });
                 }
                 }
                 });*/
            }
        } else {
            modalTip({
                tip: switchLang.switchLang('common.tips.delSelect'),
                type: false
            });
        }
    };

    $scope.dtOpt = {
        /*data : [{role_name:'aa', role_sort:'1', role_describe:'这是角色a'},
         {role_name:'bb', role_sort:'2', role_describe:'这是角色b'},
         {role_name:'cc', role_sort:'3', role_describe:'这是角色c'}],*/
        url: 'role/manager?view=select',
        resultTag: 'result',
        queryParams: function (params) {
            $.extend(params, {
                roleName: $scope.rName ? $scope.rName : '',
                status: $scope.chosen_state
            });
            return params;
        },
        columns: [{
            checkbox: true,
            boxwidth: 15
        }, {
            title: switchLang.switchLang('roleManage.roleName'),
            class: 'col-md-1',
            field: 'role_name',
            align: 'center',
            sortable: true,
            /*formatter : function(value, row, index) {
             return 'ACL-' + value
             }*/
            width: "10%"
        }, {
            title: switchLang.switchLang('roleManage.description'),
            class: 'col-md-1',
            field: 'role_note',
            align: 'center',
            sortable: false,
            width: "20%"
        }, {
            title: switchLang.switchLang('roleManage.startRole'),
            class: 'col-md-1',
            field: 'status',
            align: 'center',
            sortable: false,
            formatter: function (value, row, index) {
                var b = (value == 2);
                var compiled = $compile('<button btn-common route-flag="roleState" btn-flag="disable" class=\"btn btn-switch w-xxs btn-sm ' + ( b ? 'btn-success' : 'btn-warning') + '\">' + ( b ? switchLang.switchLang("common.btn.enableBtn") : switchLang.switchLang("common.btn.disableBtn")) + '</button>')($scope);
                return compiled[0].outerHTML;
            },
            events: {
                'click .btn-switch': function (e, value, row, index) {
                    var _this = $(this);
                    var isStart = '';
                    if (_this.text() == switchLang.switchLang('common.btn.disableBtn')) {
                        isStart = 2;
                    } else {
                        isStart = 1;
                    }
                    $http({
                        method: 'GET',
                        url: 'role/manager',
                        params: {
                            view: 'updateStatus',
                            roleId: row.role_id,
                            status: isStart
                        }
                    }).success(function () {
                        isStart == '2' ? _this.removeClass('btn-warning').addClass('btn-success').html(switchLang.switchLang('common.btn.enableBtn')) : _this.removeClass('btn-success').addClass('btn-warning').html(switchLang.switchLang('common.btn.disableBtn'));
                    });
                    /*$.ajax({
                     url: 'role/manager?view=updateStatus',
                     data: {
                     roleId: row.role_id,
                     status: isStart
                     },
                     success: function () {
                     isStart == '2' ? _this.removeClass('btn-warning').addClass('btn-success').html(switchLang.switchLang('common.btn.enableBtn')) : _this.removeClass('btn-success').addClass('btn-warning').html(switchLang.switchLang('common.btn.disableBtn'));
                     }
                     })*/
                }
            },
            width: "20%"
        }, {
            title: switchLang.switchLang('common.btn.optionBtn'),
            class: 'col-md-1',
            align: 'center',
            width: "10%",
            formatter: function (value, row, index) {
                var edit = $compile('<a btn-common route-flag="roleEdi" btn-flag="a" class="a-edit a-blue" href="javascript:;">' + switchLang.switchLang("common.btn.editBtn") + '</a>')($scope);
                var del = $compile('<a btn-common route-flag="roleDel" btn-flag="a-del" class="a-delete a-red" href="javascript:;">' + switchLang.switchLang("common.btn.delBtn") + '</a>')($scope);
                return edit[0].outerHTML + '&nbsp;' + del[0].outerHTML;
            },
            events: {
                'click .a-edit': function (e, value, row, index) {
                    var modalInstance = $modal.open({
                        templateUrl: 'myModalContent.html',
                        controller: 'addroleCtrl',
                        size: 'lg',
                        resolve: {
                            obj: function () {
                                return angular.extend(row, {index: index});
                            }
                        }
                    });
                    modalInstance.result.then(function (result) {
                        $('#userrletable').bootstrapTable('updateRow', {index: result.index, row: result});
                    });
                },
                'click .a-delete': function (e, value, row, index) {
                    if (confirm(switchLang.switchLang('common.btn.confirmBtn'))) {
                        $http({
                            method: 'GET',
                            url: 'role/manager',
                            params: {
                                view: 'delete',
                                roleId: row.role_id
                            }
                        }).success(function (data) {
                            if (data.success) {
                                modalTip({
                                    tip: switchLang.switchLang('common.tips.delSuccess'),
                                    type: true
                                });
                                $scope.tdInstance.bootstrapTable('selectPage', 1);
                            } else {
                                modalTip({
                                    tip: switchLang.switchLang('common.tips.delFailed'),
                                    type: false
                                });
                            }
                        });
                        /*$.ajax({
                         url: 'role/manager?view=delete',
                         data: {
                         roleId: row.role_id
                         },
                         success: function (data) {
                         if (data.success) {
                         modalTip({
                         tip: switchLang.switchLang('common.tips.delSuccess'),
                         type: true
                         });
                         $scope.tdInstance.bootstrapTable('selectPage', 1);
                         } else {
                         modalTip({
                         tip: switchLang.switchLang('common.tips.delFailed'),
                         type: false
                         });
                         }
                         }
                         });*/
                    }
                }
            }
        }, {
            title: switchLang.switchLang('common.authorize.authorizeBtn'),
            class: 'col-md-1',
            field: 'status',
            align: 'center',
            sortable: false,
            width: "10%",
            formatter: function (value, row, index) {
                // var compiled = $compile('<a btn-common route-flag="zysq" btn-flag="a" class="a-menuaccredit a-blue" href="javascript:;">' + switchLang.switchLang("common.authorize.sourceAuthorizeBtn") + '</a>')($scope);
                var compiled = $compile('<a class="a-menuaccredit a-blue" href="javascript:;">' + switchLang.switchLang("common.authorize.sourceAuthorizeBtn") + '</a>')($scope);
                return compiled[0].outerHTML;
            },
            events: {
                'click .a-menuaccredit': function (e, value, row, index) {
                    var modalInstance = $modal.open({
                        templateUrl: 'myModalContent3.html',
                        controller: 'menuAccreditRoleCtrl',
                        resolve: {
                            obj: function () {
                                return angular.extend(row, {index: index});
                            }
                        }
                    });
                    modalInstance.result.then(function (result) {

                    });
                }
            }
        }]
    };

    $scope.states = [{id: '', name: switchLang.switchLang("common.btn.allBtn")}, {
        id: 1,
        name: switchLang.switchLang("common.btn.enableBtn")
    }, {id: 2, name: switchLang.switchLang("common.btn.disableBtn")}];
    $scope.chosen_state = $scope.states[0].id;

    $scope.searchRoleBtn = function () {
        $scope.tdInstance.bootstrapTable('refresh');
    }
}]);
//新增角色
app.controller('addroleCtrl', ['$scope', 'obj', '$modalInstance', '$http', 'modalTip', 'switchLang', function ($scope, obj, $modalInstance, $http, modalTip, switchLang) {
    $scope.formparam = {};
    if (obj) {
        $scope.title = '编辑角色';
        $scope.formparam.roleName = obj.role_name;
        $scope.formparam.roleNote = obj.role_note;
    } else {
        $scope.title = '新增角色';
    }
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    $scope.ok = function (e) {
        var target = $(e.target);
        target.attr('disabled', 'disabled');

        if (obj) {
            var curObj = {};
            curObj.index = obj.index;
            curObj.role_name = $scope.formparam.roleName;
            curObj.role_note = $scope.formparam.roleNote;

            $http({
                url: 'role/manager?view=update',
                method: 'POST',
                data: {
                    roleName: $scope.formparam.roleName,
                    roleNote: $scope.formparam.roleNote,
                    roleId: obj.role_id
                }
            }).then(function (res) {
                if (res.data.success) {
                    modalTip({
                        tip: switchLang.switchLang('修改成功'),
                        type: true,
                        callback: function () {
                            $modalInstance.close(curObj);
                        }
                    });
                } else {
                    modalTip({
                        tip: switchLang.switchLang('修改失败'),
                        type: false
                    });
                    target.removeAttr('disabled');
                }
            });
        } else {
            $http({
                url: 'role/manager?view=add',
                method: 'POST',
                data: {
                    roleName: $scope.formparam.roleName,
                    roleNote: $scope.formparam.roleNote
                }
            }).then(function (res) {
                if (res.data.success) {
                    modalTip({
                        tip: switchLang.switchLang('添加成功'),
                        type: true,
                        callback: function () {
                            $modalInstance.close();
                        }
                    });
                } else {
                    modalTip({
                        tip: switchLang.switchLang('添加失败'),
                        type: false
                    });
                    target.removeAttr('disabled');
                }
            });
        }
    };
}]);
//菜单管理
app.controller('userMenuManageCtrl', ['$scope', '$http', '$modal', 'modalTip', '$state', 'switchLang', function ($scope, $http, $modal, modalTip, $state, switchLang) {
    $scope.formparam = {};
    $scope.formparam.user_group_suffix = '';
    //创建公司-admin列表的模态窗口
    $scope.moduleOpen = function () {
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'selectUserGroupController',
            size: 'lg',
            resolve: {
                obj: function () {
                    return {};
                }
            }
        });
        modalInstance.result.then(function (selectRow) {
            var user_name = selectRow[0].user_name;
            if (user_name.indexOf('@') != -1) {
                angular.element('#companyName').val(selectRow[0].group_name);
                $scope.formparam.user_group_suffix = user_name.substr(user_name.indexOf('@') + 1);
                if ($scope.formparam.actionUrl.indexOf('insure') > 0) {
                    $scope.formparam.actionUrl = $scope.formparam.actionUrl.replace('insure', $scope.formparam.user_group_suffix)
                    // console.log($scope.formparam.actionUrl.replace('insure', $scope.formparam.user_group_suffix))
                }
            }
        });
    };
    $scope.optflag = false;

    var flag = false;

    $scope.formparam.menuStatus = 1;//增加菜单时，默认启用
    $scope.formparam.isLeaf = 1;//增加菜单时，默认是

    var myTree = '';
    var isChild = 0;

    function getTree() {
        $("#treeboxbox_tree").html('');
        myTree = new dhtmlXTreeObject('treeboxbox_tree', '100%', '100%', 0);
        myTree.setImagePath("./vendor/dhtmlx/imgs/dhxtree_skyblue/");
        myTree.enableTreeImages(false);
        myTree.setOnClickHandler(function (id) {
            //$scope.formparam.menuName = myTree.getItemText(id);

            $scope.$apply(function () {
                flag = false;
                $scope.formparam.menuName = myTree.getItemText(id);
                $scope.formparam.parentMenuName = myTree.getItemText(myTree.getParentId(id));
                $scope.formparam.parentMenuId = id;
                $scope.formparam.actionUrl = myTree.getUserData(id, "actionUrl");
                $scope.formparam.menuSort = myTree.getUserData(id, "menuSort");
                $scope.formparam.menuId = id;
                $scope.formparam.menuStatus = myTree.getUserData(id, "status");
                $scope.formparam.menuIcon = myTree.getUserData(id, "imgFlag");
                angular.element('#companyName').val(myTree.getUserData(id, "userGroupSuffix"));

                $scope.optflag = true;
                $scope.optctx = switchLang.switchLang('修改');
                var isLeaf = myTree.getUserData(id, "subnodeFlag");
                if (isLeaf == 1) {
                    $scope.formparam.isLeaf = 1;
                } else {
                    $scope.formparam.isLeaf = 2;
                }
            });

            isChild = myTree.hasChildren(id);
        });
        myTree.setOnLoadingEnd(function () {
            //设置字体，以区分菜单节点和功能节点
            var array = myTree.getAllSubItems(0).split(',');
            for (var i = 0; i < array.length; i++) {
                var level = myTree.getLevel(array[i]);
                if (level == 1) {
                    myTree.setItemStyle(array[i], 'color:#616b88; font-weight: bold;');
                } else if (level == 2) {
                    myTree.setItemStyle(array[i], 'color:#3f87c0; font-weight: bold;');
                }
            }
        });
        $http({
            url: 'menu/manager?view=select'
        }).success(function (data) {
            myTree.parse(data.result, 'json');
        });
    }

    getTree();

    $scope.addMenu = function () {
        flag = true;
        $scope.formparam.user_group_suffix = '';
        $scope.formparam.menuName = '';
        var id = myTree.getSelectedItemId();
        var url = myTree.getUserData(id, 'actionUrl');
        if (url.indexOf('app.insure') < 0) {
            url = 'app.insure.' + url;
        }
        $scope.formparam.actionUrl = url + '_';
        $scope.formparam.menuSort = '';
        $scope.formparam.parentMenuName = myTree.getSelectedItemText();
        $scope.optflag = true;
        $scope.optctx = switchLang.switchLang('新增');
    };

    $scope.isShow = true;
    $scope.leafYes = function () {
        $scope.isShow = true;
    };
    $scope.leafNo = function () {
        $scope.isShow = false;
    };

    $scope.ok = function (e) {
        var target = $(e.target);
        target.attr('disabled', 'disabled');

        if ($scope.formparam.parentMenuId) {
            if (flag) {
                $http({
                    url: 'menu/manager?view=add',
                    method: 'POST',
                    data: {
                        parentId: $scope.formparam.parentMenuId,
                        menuName: $scope.formparam.menuName,
                        actionUrl: $scope.formparam.actionUrl,
                        menuSort: $scope.formparam.menuSort,
                        status: $scope.formparam.menuStatus,
                        imgFlag: $scope.formparam.menuIcon,
                        subnodeFlag: $scope.formparam.isLeaf,
                        userGroupSuffix: $scope.formparam.user_group_suffix
                    }
                }).then(function (res) {
                    if (res.data.success) {
                        modalTip({
                            tip: switchLang.switchLang('添加成功'),
                            type: true,
                            callback: function () {
                                getTree();
                                /*$scope.formparam.menuName = '';
                                 $scope.formparam.actionUrl = '';
                                 $scope.formparam.menuSort = '';
                                 $scope.formparam.parentMenuName = '';*/
                                //$('#form_menu')[0].reset();
                                $scope.optflag = false;
                                $state.reload();
                            }
                        });
                    } else {
                        modalTip({
                            tip: switchLang.switchLang('添加失败'),
                            type: false
                        });
                        target.removeAttr('disabled');
                    }
                });
            } else {
                $http({
                    url: 'menu/manager?view=update',
                    method: 'POST',
                    data: {
                        parentId: $scope.formparam.parentMenuId,
                        menuName: $scope.formparam.menuName,
                        actionUrl: $scope.formparam.actionUrl,
                        menuSort: $scope.formparam.menuSort,
                        menuId: $scope.formparam.menuId,
                        status: $scope.formparam.menuStatus,
                        imgFlag: $scope.formparam.menuIcon,
                        subnodeFlag: $scope.formparam.isLeaf
                    }
                }).then(function (res) {
                    if (res.data.success) {
                        modalTip({
                            tip: switchLang.switchLang('修改成功'),
                            type: true,
                            callback: function () {
                                getTree();
                                /*$scope.formparam.menuName = '';
                                 $scope.formparam.actionUrl = '';
                                 $scope.formparam.menuSort = '';
                                 $scope.formparam.parentMenuName = '';*/
                                //$('#form_menu')[0].reset();
                                $scope.optflag = false;
                                $state.reload();
                            }
                        });
                    } else {
                        modalTip({
                            tip: switchLang.switchLang('修改失败'),
                            type: false
                        });
                        target.removeAttr('disabled');
                    }
                });
            }
        } else {
            modalTip({
                tip: '请在左边的菜单列表里选择一个节点',
                type: false
            });
            target.removeAttr('disabled');
        }
    };

    $scope.delMenu = function () {
        if ($scope.formparam.menuId) {
            if (isChild == 0) {
                if (confirm(switchLang.switchLang('确认删除吗？'))) {
                    $http({
                        method: 'GET',
                        url: 'menu/manager',
                        params: {
                            view: 'delete',
                            menuIds: $scope.formparam.menuId
                        }
                    }).success(function (data) {
                        if (data.success) {
                            modalTip({
                                tip: switchLang.switchLang('删除成功'),
                                type: true,
                                callback: function () {
                                    getTree();
                                    $state.reload();
                                }
                            });
                        } else {
                            modalTip({
                                tip: switchLang.switchLang('删除失败'),
                                type: false
                            });
                        }
                    })
                }
            } else {
                modalTip({
                    tip: switchLang.switchLang('请选择叶子节点'),
                    type: false
                });
            }
        } else {
            modalTip({
                tip: switchLang.switchLang('请选择一个节点'),
                type: false
            });
        }
    }
}]);
//配置管理－日志管理
app.controller('mgrlogCtrl', ['$http', '$scope', 'switchLang', function ($http, $scope, switchLang) {
    $scope.title = "日志管理";
    $scope.account = "";
    $scope.operations = [
        {
            id: 0,
            name: switchLang.switchLang("全部")
        }, {
            id: 1,
            name: switchLang.switchLang("注册")
        }, {
            id: 2,
            name: switchLang.switchLang("登录")
        }, {
            id: 3,
            name: switchLang.switchLang("修改密码")
        }, {
            id: 4,
            name: switchLang.switchLang("增加用户")
        }];
    $scope.chosen_operation = $scope.operations[0].id;
    $scope.results = [
        {
            id: 2,
            name: switchLang.switchLang("全部")
        },
        {
            id: 1,
            name: switchLang.switchLang("成功")
        }, {
            id: 0,
            name: switchLang.switchLang("失败")
        }];
    $scope.chosen_result = $scope.results[0].id;
    $scope.startDate = "";
    $scope.endDate = "";

    var columnTitles = [
        {
            field: 'account',
            title: switchLang.switchLang("用户"),
            align: 'center'
        },
        {
            field: 'ip_address',
            title: switchLang.switchLang("登录") + "IP",
            align: 'center'
        },
        {
            field: 'operation_type',
            title: switchLang.switchLang('操作类型'),
            align: 'center',
            formatter: function (value, row) {
                if (1 == row.operation_type) {
                    return switchLang.switchLang("注册");
                } else if (2 == row.operation_type) {
                    return switchLang.switchLang("登录");
                } else if (3 == row.operation_type) {
                    return switchLang.switchLang("修改密码");
                } else if (4 == row.operation_type) {
                    return switchLang.switchLang("增加用户");
                } else {
                    return switchLang.switchLang("其它");
                }
            }
        },
        {
            field: 'state',
            title: switchLang.switchLang('操作结果'),
            align: 'center',
            formatter: function (value, row) {
                if (0 == row.state) {
                    return switchLang.switchLang("失败");
                } else {
                    return switchLang.switchLang("成功");
                }
            }
        },
        {
            field: 'operation_date',
            title: switchLang.switchLang('操作时间'),
            align: 'center',
            formatter: function (value, row) {
                var date = new Date();
                date.setTime(row.operation_date);
                var formatDate = "";
                formatDate += date.getFullYear();
                formatDate += "-";
                formatDate += (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
                formatDate += "-";
                formatDate += date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                formatDate += " ";
                formatDate += date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                formatDate += ":";
                formatDate += date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                return formatDate;
            }
        },
        {
            field: 'property',
            title: switchLang.switchLang('参数'),
            align: 'center',
            formatter: function (value, row) {
                if (row.property) {
                    // var property = JSON.parse(row.property.value);
                    var property = row.property;
                    if (property) {
                        var remark = property;
                        return remark;
                    }
                }
                return "-";
            }
        }
    ];
    var url = 'log/list?account=' + $scope.account + '&operation_type=' + $scope.chosen_operation + '&startDate=' + $scope.startDate + '&endDate=' + $scope.endDate + '&state=' + $scope.chosen_result + '&d=' + new Date().getTime();
    var list = function () {
        $scope.tableoption = {
            url: url,
            showToggle: false,
            showRefresh: false,
            pagination: true,
            showColumns: false,
            search: false,
            resultTag: "result",
            columns: columnTitles
        };
    };
    list();

    $scope.filterQuery = function () {
        url = 'log/list?account=' + $scope.account + '&operation_type=' + $scope.chosen_operation + '&startDate=' + $scope.startDate + '&endDate=' + $scope.endDate + '&state=' + $scope.chosen_result + '&d=' + new Date().getTime();
        $scope.tdInstance.bootstrapTable('refresh', {url: url});
    };

    $scope.$on("bootstrap_datetime_picker_event", function (e, d) {
        if (d && d.id) {
            if (d.id == "custom_start_time") {
                var date = new Date();
                date.setTime(d.date);
                var formatDate = "";
                formatDate += date.getFullYear();
                formatDate += "-";
                formatDate += (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
                formatDate += "-";
                formatDate += date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                formatDate += " ";
                formatDate += date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                formatDate += ":";
                formatDate += date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                $scope.startDate = formatDate;
            }
            else if (d.id == "custom_end_time") {
                var date = new Date();
                date.setTime(d.date);
                var formatDate = "";
                formatDate += date.getFullYear();
                formatDate += "-";
                formatDate += (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
                formatDate += "-";
                formatDate += date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                formatDate += " ";
                formatDate += date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                formatDate += ":";
                formatDate += date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                $scope.endDate = formatDate;
            }
        }
    });
}]);
//配置管理－应用配置
app.controller('mgrappCtrl', ['$http', '$scope', '$filter', '$state', '$modal', '$compile', function ($http, $scope, $filter, $state, $modal, $compile) {
    $scope.title = "应用配置";
    $scope.domain = "";
    $scope.states = [
        {
            id: 0,
            name: "全部"
        },
        {
            id: 1,
            name: "正常"
        },
        {
            id: 2,
            name: "冻结"
        },
        {
            id: 3,
            name: "待开通"
        }];
    $scope.chosen_state = $scope.states[0].id;

    var columnTitles = [
        {
            field: 'name',
            title: "应用名称",
            align: 'center',
            formatter: function (value, row) {

                return row.name;
            }
        },
        {
            field: 'domain',
            title: "应用域名",
            align: 'center',
            formatter: function (value, row) {
                if (row.property) {
                    var property = JSON.parse(row.property.value);
                    if (property) {
                        var domain = property.domain;
                        return domain;
                    }
                }
                return "";
            }
        },
        {
            field: 'ip_address',
            title: "应用服务器",
            align: 'center',
            formatter: function (value, row) {
                if (row.property) {
                    var property = JSON.parse(row.property.value);
                    if (property) {
                        var ip = property.ip;
                        return ip;
                    }
                }
                return "";
            }
        },
        {
            field: 'status',
            title: '状态',
            align: 'center',
            formatter: function (value, row) {
                if (1 == row.status) {
                    return "正常";
                } else if (2 == row.status) {
                    return "冻结";
                } else if (3 == row.status) {
                    return "待开通";
                } else {
                    return "未知";
                }
            }
        },
        {
            field: 'property',
            title: '备注',
            align: 'center',
            formatter: function (value, row) {
                if (row.property) {
                    var property = JSON.parse(row.property.value);
                    if (property) {
                        var remark = property.remark;
                        return remark;
                    }
                }
                return "";
            }
        },
        {
            field: 'operation',
            title: "操作",
            align: 'center',
            formatter: function (value, row) {
                var edit = $compile('<a btn-common route-flag="editApp" btn-flag="img" class="edit" href="javascript:void(0)" ><i class="fa fa-edit text-info text m-r"></i></a>')($scope);
                var del = $compile('<a btn-common route-flag="delApp" btn-flag="img" class="delete" href="javascript:void(0)"><i class="fa fa-trash-o text-danger text"></i></a>')($scope);
                return '<span>' + edit[0].outerHTML + del[0].outerHTML + '</span>';
            },
            events: {
                'click .edit': function (e, value, row, index) {
                    var remark = "", domain = "", ip = "";
                    if (null != row.property) {
                        var property = JSON.parse(row.property.value);
                        remark = property.remark == null ? "" : property.remark;
                        domain = property.domain == null ? "" : property.domain;
                        ip = property.ip == null ? "" : property.ip;
                    }
                    $scope.$emit("edit_app_template_event", {
                        id: row.id,
                        remark: remark,
                        domain: domain,
                        ip: ip,
                        name: row.name
                    });
                },
                'click .delete': function (e, value, row, index) {
                    $scope.$emit("delete_app_template_event", {
                        id: row.id
                    });
                }
            }
        }
    ];

    var list = function () {
        var url = 'app/list?domain=' + $scope.domain + '&status=' + $scope.chosen_state + '&d=' + new Date().getTime();
        $scope.tableoption = {
            url: url,
            showToggle: false,
            showRefresh: false,
            pagination: true,
            showColumns: false,
            search: false,
            resultTag: "result",
            columns: columnTitles
        };
    };
    list();


    $scope.filterQuery = function () {
        var url = 'app/list?name=' + $scope.name + '&status=' + $scope.chosen_state + '&d=' + new Date().getTime();
        $scope.tdInstance.bootstrapTable('refresh', {url: url});
    };


    $scope.mgr_app_add = function () {
        var modalInstance = $modal.open({
            templateUrl: 'mgr_app_add_template',
            controller: 'mgrAddAppCtrl',
            size: 'md',
            scope: $scope
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        });
    };

    $scope.$on("edit_app_template_event", function (e, d) {
        var modalInstance = $modal.open({
            templateUrl: 'mgr_app_config_template',
            controller: 'mgrappconfigCtrl',
            size: 'md',
            scope: $scope,
            resolve: {
                AppOption: function () {
                    return {
                        id: d.id,
                        remark: d.remark,
                        domain: d.domain,
                        ip: d.ip,
                        name: d.name
                    };
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        });
    });

    $scope.$on("delete_app_template_event", function (e, d) {
        var modalInstance = $modal.open({
            templateUrl: 'action_template',
            controller: 'deleteAppCtrl',
            size: 'md',
            scope: $scope,
            resolve: {
                AppOption: function () {
                    return {
                        id: d.id
                    };
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        });
    });

    $scope.$on("app_refresh_list_event", function (e, d) {
        var url = 'app/list?domain=' + $scope.domain + '&status=' + $scope.chosen_state + '&d=' + new Date().getTime();
        $scope.tdInstance.bootstrapTable('refresh', {url: url});
    });
}]);
//配置管理－应用配置-修改应用配置
app.controller('mgrappconfigCtrl', ['$http', '$scope', '$filter', '$state', '$stateParams', '$modalInstance', 'AppOption', function ($http, $scope, $filter, $state, $stateParams, $modalInstance, AppOption) {
    $scope.title = "修改应用";
    $scope.id = AppOption.id;
    $scope.remark = AppOption.remark;
    $scope.domain = AppOption.domain;
    $scope.ip = AppOption.ip;
    $scope.name = AppOption.name;

    $scope.error_msg = "";
    $scope.ok = function () {

        var data = {
            id: AppOption.id,
            remark: this.remark,
            domain: this.domain,
            appName: this.name,
            ip: AppOption.ip
        };

        var transFn = function (data) {
            return $.param(data);
        };

        var postCfg = {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: transFn
        };

        $http.post("app/modify", data, postCfg)
            .success(function (data, status, headers, config) {
                $scope.$emit("app_refresh_list_event", {});
                $modalInstance.close();
            })
            .error(function (data, status, headers, config) {
                $modalInstance.close();
            });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
//配置管理－应用配置-删除应用配置
app.controller('deleteAppCtrl', ['$http', '$scope', '$filter', '$state', '$stateParams', '$modalInstance', 'AppOption', function ($http, $scope, $filter, $state, $stateParams, $modalInstance, AppOption) {
    $scope.title = "删除应用";
    $scope.actionMsg = "确认删除？";

    $scope.ok = function () {

        var data = {
            id: AppOption.id
        };

        var transFn = function (data) {
            return $.param(data);
        };

        var postCfg = {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: transFn
        };

        $http.post("app/delete", data, postCfg)
            .success(function (data, status, headers, config) {
                $scope.$emit("app_refresh_list_event", {});
                $modalInstance.close();
            })
            .error(function (data, status, headers, config) {
                $modalInstance.close();
            });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
//配置管理－应用配置-新增应用配置
app.controller('mgrAddAppCtrl', ['$scope', '$http', '$filter', '$modalInstance', '$cookieStore', function ($scope, $http, $filter, $modalInstance, $cookieStore) {
    $scope.title = "新增应用";
    var loginUser = $cookieStore.get("user");

    $scope.domain_conf = function () {
        if (this.domain) {
            $http({
                method: 'GET',
                url: 'user/getdomain?domain=' + this.domain
            }).success(function (data) {
                if (data) {
                    $scope.domain_msg = true;
                    $scope.error_msg = "当前域名已被使用!";
                } else {
                    $scope.error_msg = null;
                    $scope.domain_msg = null;
                }
            });
        }
    };
    $scope.ok = function () {
        if (!this.appName) {
            $scope.error_msg = "请输入应用名称!";
            return;
        }
        if (!this.domain) {
            $scope.error_msg = "请输入应用域名!";
            return;
        }
        if (!this.ip) {
            $scope.error_msg = "请输入应用服务器Ip!";
            return;
        }
        if (this.domain_msg) {
            $scope.error_msg = "当前域名已被使用!";
            return;
        }

        var data = {
            remark: this.remark,
            domain: this.domain,
            appName: this.appName,
            ip: this.ip,
            entId: loginUser.enterprise_id
        };

        var transFn = function (data) {
            return $.param(data);
        };

        var postCfg = {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: transFn
        };

        $http.post("app/add", data, postCfg)
            .success(function (data, status, headers, config) {
                $scope.$emit("app_refresh_list_event", {});
                $modalInstance.close();
            })
            .error(function (data, status, headers, config) {
                $modalInstance.close();
            });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
//租户应用配置
app.controller('configuserCtrl', ['$scope', '$http', '$filter', '$modal', '$compile', function ($scope, $http, $filter, $modal, $compile) {
    $scope.title = "租户应用配置";
    $scope.domain = "";
    $scope.name = '';
    $scope.states = [
        {
            id: 0,
            name: "全部"
        },
        {
            id: 1,
            name: "正常"
        },
        {
            id: 2,
            name: "冻结"
        },
        {
            id: 3,
            name: "待开通"
        }];
    $scope.chosen_state = $scope.states[0].id;

    var columnTitles = [
        {
            field: 'name',
            title: "名称",
            align: 'center',
            width: '20%',
            formatter: function (value, row) {
                return row.name;
            }
        },
        {
            field: 'domain',
            title: "域名",
            align: 'center',
            formatter: function (value, row) {
                if (row.property) {
                    var property = JSON.parse(row.property.value);
                    if (property) {
                        var domain = property.domain;
                        return domain;
                    }
                }
                return "";
            }
        },
        {
            field: 'ip_address',
            title: "应用服务器",
            align: 'center',
            formatter: function (value, row) {
                if (row.property) {
                    var property = JSON.parse(row.property.value);
                    if (property) {
                        var ip = property.ip;
                        return ip;
                    }
                }
                return "";
            }
        },
        {
            field: 'status',
            title: '状态',
            align: 'center',
            formatter: function (value, row) {
                if (1 == row.status) {
                    return "正常";
                } else if (2 == row.status) {
                    return "冻结";
                } else if (3 == row.status) {
                    return "待开通";
                } else {
                    return "未知";
                }
            }
        },
        {
            field: 'property',
            title: '备注',
            align: 'center',
            formatter: function (value, row) {
                if (row.property) {
                    var property = JSON.parse(row.property.value);
                    if (property) {
                        var remark = property.remark;
                        return remark;
                    }
                }
                return "";
            }
        },
        {
            field: 'operation',
            title: "操作",
            width: '8%',
            align: 'center',
            formatter: function (value, row) {
                var edit = $compile('<a btn-common route-flag="editCu" btn-flag="img" class="edit" href="javascript:void(0)" ><i class="fa fa-edit text-info text"></i></a>')($scope);
                var open = $compile('<a btn-common route-flag="openCu" btn-flag="img" class="open" href="javascript:void(0)"><i class="icon-control-play text-danger text"></i></a>')($scope);
                var lock = $compile('<a btn-common route-flag="lockCu" btn-flag="img" class="lock" href="javascript:void(0)"><i class="icon-lock text-danger text"></i></a>')($scope);
                var unLock = $compile('<a btn-common route-flag="unlockCu" btn-flag="img" class="unlock" href="javascript:void(0)"><i class="icon-lock-open text-danger text"></i></a>')($scope);
                var del = $compile('<a btn-common route-flag="delCu" btn-flag="img" class="delete" href="javascript:void(0)"><i class="fa fa-trash-o text-danger text"></i></a>')($scope);
                var oper = "";
                if (row.status == 1) {
                    oper = edit[0].outerHTML + '&nbsp;' + lock[0].outerHTML;
                } else if (row.status == 2) {
                    oper = unLock[0].outerHTML + '&nbsp;' + del[0].outerHTML;
                } else if (row.status == 3) {
                    oper = open[0].outerHTML;
                }
                return '<span>' + oper + '</span>';
            },
            events: {
                'click .edit': function (e, value, row, index) {
                    var remark = "", domain = "", ip = "";
                    if (null != row.property) {
                        var property = JSON.parse(row.property.value);
                        remark = property.remark == null ? "" : property.remark;
                        domain = property.domain == null ? "" : property.domain;
                        ip = property.ip == null ? "" : property.ip;
                    }
                    $scope.$emit("edit_app_template_event", {
                        id: row.id,
                        remark: remark,
                        domain: domain,
                        ip: ip,
                        name: row.name
                    });
                },
                'click .delete': function (e, value, row, index) {
                    $scope.$emit("delete_app_template_event", {
                        id: row.id
                    });
                },
                'click .open': function (e, value, row, index) {
                    $scope.$emit("open_app_template_event", {
                        id: row.id
                    });
                },
                'click .lock': function (e, value, row, index) {
                    $scope.$emit("lock_app_template_event", {
                        id: row.id
                    });
                },
                'click .unlock': function (e, value, row, index) {
                    $scope.$emit("unlock_app_template_event", {
                        id: row.id
                    });
                }
            }
        }
    ];

    var list = function () {
        var url = 'app/listAll?name=' + $scope.name + '&domain=' + $scope.domain + '&status=' + $scope.chosen_state + '&d=' + new Date().getTime();
        $scope.tableoption = {
            url: url,
            showToggle: false,
            showRefresh: false,
            pagination: true,
            showColumns: false,
            search: false,
            resultTag: "result",
            columns: columnTitles
        };
    };
    list();


    $scope.filterQuery = function () {
        //list();
        var url = 'app/listAll?name=' + $scope.name + '&domain=' + $scope.domain + '&status=' + $scope.chosen_state + '&d=' + new Date().getTime();
        $scope.tdInstance.bootstrapTable('refresh', {url: url});
    };


    $scope.mgr_app_add = function () {
        var modalInstance = $modal.open({
            templateUrl: 'mgr_app_add_template',
            controller: 'mgrAddAppCtrl',
            size: 'md',
            scope: $scope
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        });
    };

    $scope.$on("edit_app_template_event", function (e, d) {
        var modalInstance = $modal.open({
            templateUrl: 'config_app_edit_template',
            controller: 'configappeditCtrl',
            size: 'md',
            scope: $scope,
            resolve: {
                AppOption: function () {
                    return {
                        id: d.id,
                        remark: d.remark,
                        domain: d.domain,
                        ip: d.ip,
                        name: d.name
                    };
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        });
    });

    $scope.$on("delete_app_template_event", function (e, d) {
        var modalInstance = $modal.open({
            templateUrl: 'action_template',
            controller: 'configappdeleteCtrl',
            size: 'md',
            scope: $scope,
            resolve: {
                AppOption: function () {
                    return {
                        id: d.id
                    };
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        });
    });

    $scope.$on("open_app_template_event", function (e, d) {
        var modalInstance = $modal.open({
            templateUrl: 'action_template',
            controller: 'configappopenCtrl',
            size: 'md',
            scope: $scope,
            resolve: {
                AppOption: function () {
                    return {
                        id: d.id
                    };
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        });
    });

    $scope.$on("lock_app_template_event", function (e, d) {
        var modalInstance = $modal.open({
            templateUrl: 'action_template',
            controller: 'configapplockCtrl',
            size: 'md',
            scope: $scope,
            resolve: {
                AppOption: function () {
                    return {
                        id: d.id
                    };
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        });
    });

    $scope.$on("unlock_app_template_event", function (e, d) {
        var modalInstance = $modal.open({
            templateUrl: 'action_template',
            controller: 'configAppUnLockCtrl',
            size: 'md',
            scope: $scope,
            resolve: {
                AppOption: function () {
                    return {
                        id: d.id
                    };
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        });
    });

    $scope.$on("app_refresh_list_event", function (e, d) {
        //list();
        var url = 'app/listAll?name=' + $scope.name + '&domain=' + $scope.domain + '&status=' + $scope.chosen_state + '&d=' + new Date().getTime();
        $scope.tdInstance.bootstrapTable('refresh', {url: url});
    });

}]);
//租户应用配置-修改应用配置
app.controller('configappeditCtrl', ['$scope', '$http', '$filter', '$modalInstance', 'AppOption', function ($scope, $http, $filter, $modalInstance, AppOption) {
    $scope.title = "修改应用";
    $scope.id = AppOption.id;
    $scope.remark = AppOption.remark;
    $scope.domain = AppOption.domain;
    $scope.ip = AppOption.ip;
    $scope.name = AppOption.name;

    $scope.ok = function () {

        var data = {
            id: AppOption.id,
            remark: this.remark,
            domain: AppOption.domain,
            ip: AppOption.ip,
            appName: this.name
        };

        var transFn = function (data) {
            return $.param(data);
        };

        var postCfg = {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: transFn
        };

        $http.post("app/modify", data, postCfg)
            .success(function (data, status, headers, config) {
                $scope.$emit("app_refresh_list_event", {});
                $modalInstance.close();
            })
            .error(function (data, status, headers, config) {
                $modalInstance.close();
            });
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
//租户应用配置-删除应用
app.controller('configappdeleteCtrl', ['$http', '$scope', '$filter', '$modalInstance', 'AppOption', function ($http, $scope, $filter, $modalInstance, AppOption) {
    $scope.title = "删除应用";
    $scope.actionMsg = "确认删除？";

    $scope.ok = function () {

        var data = {
            id: AppOption.id
        };

        var transFn = function (data) {
            return $.param(data);
        };

        var postCfg = {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: transFn
        };

        $http.post("app/delete", data, postCfg)
            .success(function (data, status, headers, config) {
                $scope.$emit("app_refresh_list_event", {});
                $modalInstance.close();
            })
            .error(function (data, status, headers, config) {
                $modalInstance.close();
            });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);
//租户应用配置-开通应用
app.controller('configappopenCtrl', ['$http', '$scope', '$filter', '$modalInstance', 'AppOption', function ($http, $scope, $filter, $modalInstance, AppOption) {
    $scope.title = "开通应用";
    $scope.actionMsg = "确认开通？";

    $scope.ok = function () {

        var data = {
            id: AppOption.id
        };

        var transFn = function (data) {
            return $.param(data);
        };

        var postCfg = {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: transFn
        };

        $http.post("app/open", data, postCfg)
            .success(function (data, status, headers, config) {
                $scope.$emit("app_refresh_list_event", {});
                $modalInstance.close();
            })
            .error(function (data, status, headers, config) {
                $modalInstance.close();
            });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);
//租户应用配置-锁定应用
app.controller('configapplockCtrl', ['$http', '$scope', '$filter', '$modalInstance', 'AppOption', function ($http, $scope, $filter, $modalInstance, AppOption) {
    $scope.title = "冻结应用";
    $scope.actionMsg = "确认冻结？";

    $scope.ok = function () {

        var data = {
            id: AppOption.id
        };

        var transFn = function (data) {
            return $.param(data);
        };

        var postCfg = {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: transFn
        };

        $http.post("app/lock", data, postCfg)
            .success(function (data, status, headers, config) {
                $scope.$emit("app_refresh_list_event", {});
                $modalInstance.close();
            })
            .error(function (data, status, headers, config) {
                $modalInstance.close();
            });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
//租户应用配置-锁定应用
app.controller('configAppUnLockCtrl', ['$http', '$scope', '$filter', '$modalInstance', 'AppOption', function ($http, $scope, $filter, $modalInstance, AppOption) {
    $scope.title = "解冻应用";
    $scope.actionMsg = "确认解冻？";

    $scope.ok = function () {

        var data = {
            id: AppOption.id
        };

        var transFn = function (data) {
            return $.param(data);
        };

        var postCfg = {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
            transformRequest: transFn
        };

        $http.post("app/open", data, postCfg)
            .success(function (data, status, headers, config) {
                $scope.$emit("app_refresh_list_event", {});
                $modalInstance.close();
            })
            .error(function (data, status, headers, config) {
                $modalInstance.close();
            });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
//服务器邮件配制
app.controller('configemailCtrl', ['$scope', '$http', '$filter', '$state',
    function ($scope, $http, $filter, $state) {
        $scope.title = "邮件配置";

        $scope.submitted = false;
        $scope.issuccess = false;
        $scope.message = "";
        $scope.saveemail = function () {
            var url = 'email/config?view=json';
            var email = {
                configType: "email",
                serverDomain: $scope.serverDomain,
                smtpServer: $scope.smtpServer,
                smtpPort: $scope.smtpPort ? $scope.smtpPort : 25,
                emailName: $scope.emailName,
                password: $scope.password
            }
            if ($scope.mailval.$valid) {
                $http({
                    method: 'POST',
                    url: url,
                    data: email
                }).success(function (data) {
                    $scope.issuccess = true;
                    $scope.message = "邮件信息已保存!!!";
                }).error(function (data) {
                });
            } else {
                $scope.submitted = true;
            }
        };
        //测试牵手
        $scope.connectemail = function () {
            $http({
                method: 'GET',
                url: 'email/connect'
            }).success(function (retdata) {
                $scope.issuccess = true;
                if (retdata) {
                    $scope.message = "牵手成功!!!";
                } else {
                    $scope.message = "请确认SMTP服务是否开启!!!";
                }
            });
        }
        //初始时，读取邮件信息
        $http({
            method: 'GET',
            url: 'email/detail'
        }).success(function (retdata) {
            if (retdata.email) {
                $scope.serverDomain = retdata.email.serverDomain;
                $scope.smtpServer = retdata.email.smtpServer;
                $scope.smtpPort = retdata.email.smtpPort;
                $scope.emailName = retdata.email.emailName;
                $scope.password = retdata.email.password;
            }
        });
        //删除数据库中的邮件信息
        $scope.delemail = function () {
            $http({
                method: 'GET',
                url: 'email/delmail'
            }).success(function (retdata) {
                if (retdata == 1) {
                    $scope.serverDomain = "www.google.com";
                    $scope.smtpServer = "smtp.example.com";
                    $scope.smtpPort = "";
                    $scope.emailName = "abc@abc.com";
                    $scope.password = "";
                    $scope.issuccess = true;
                    $scope.message = "服务器邮件信息已删除!!!";
                } else {
                    $scope.submitted = false;
                    $scope.issuccess = true;
                    $scope.message = "服务器没有邮件信息!!!";
                }
            });
        }

    }
]);
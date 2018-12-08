//数据订购流程
app.controller('orderApplyFormController', ['$scope', '$http', '$filter', 'insureUtil', '$cookieStore','modalTip','switchLang','$state','$modal',
    function ($scope, $http, $filter, insureUtil, $cookieStore, modalTip,switchLang,$state,$modal) {
        var longTime = new Date().getTime() - (1000 * 60 * 60 * 24 * 7)
        $scope.resultObj = {};
        //标签栏初始化
        $scope.steps = {
            percent: 20,
            step1: true,
            step2: false,
            step3: false
        };
        $scope.formObj = {
            approve:"0",
            userName: $cookieStore.get("user").userName,
            // dataUsageInput: "indexInsure",
            dataUsageInput: "",
            category: "grid",
            dataType: "relative_humidity",
            regionType: 'region',
            region: {selected: undefined},
            regionItems: [],
            city: {selected: undefined},
            cityItems: [],
            county: {selected: undefined},
            countyItems: [],
            dataTimeStart: insureUtil.dateToString(new Date(longTime), "yyyy/MM/dd"),
            dataTimeEnd: insureUtil.dateToString(new Date(), "yyyy/MM/dd"),
            produceTime: insureUtil.dateToString(new Date(), "yyyy/MM/dd"),
            dataUsage: "indexInsure",
            submitTag: false,
            submit: function () {
                    var tag;
                this.submitTag = true;
                if (this.regionType == "region" && (!this.region.selected )) {
                    tag = true;
                }
                if (this.regionType == "loglat" && (!this.inputLonlat.ymin || !this.inputLonlat.xmin
                    || !this.inputLonlat.ymax || !this.inputLonlat.xmax)) {
                    tag = true;
                }
                if (this.regionType == "map" && !this.mapValue) {
                    tag = true;
                }
                if ($scope.formObj.dataUsage == 'otherInsure' && !$scope.formObj.dataUsageInput) {
                    tag = true;
                }
                if (!$scope.formObj.crop) {
                    tag = true;
                }
                if (tag) {
                    $scope.steps.step3 = false;
                } else {
                    $scope.steps.step3 = true;
                    $scope.steps.percent = 60;
                }
            },
            formFinish: false,
            formFinishFun: function () {
                this.formFinish = true;
                $scope.steps.percent = 100;
                angular.forEach($scope.formObj, function (value, key) {
                    if (!angular.isFunction(value) && !angular.isArray(value)) {
                        if (angular.isObject(value)) { //过滤区域
                            if (value.selected) {
                                $scope.resultObj[key] = value.selected.adcode99+","+value.selected.name99;
                            }
                            if (value.xmin && value.xmax && value.ymin && value.ymax) {
                                $scope.resultObj[key] = '{"xmin":' + value.xmin + ',"ymin":' + value.ymin + ',"xmax":' + value.xmax + ',"ymax":' + value.ymax + '}';
                            }
                        } else {
                            $scope.resultObj[key] = value;
                        }
                    }
                })
                $scope.resultObj['dataTimeStart'] = angular.element("#dataTimeStart").val();
                $scope.resultObj['dataTimeEnd'] = angular.element("#dataTimeEnd").val();
                $scope.resultObj['produceTime'] = angular.element("#produceTime").val();
                // console.dir($scope.resultObj)
                $http({
                    method: 'POST',
                    url: "orderData/create?view=add",
                    data: $scope.resultObj
                }).success(function (data) {
                    if (data.success) {
                        modalTip({
                            tip: switchLang.switchLang('保存成功'),
                            type: true
                        });
                        $state.go("app.insure.dataOrder_orderApplyList");
                    } else {
                        modalTip({
                            tip: switchLang.switchLang('保存失败'),
                            type: false
                        });
                    }
                }).error(function (data) {});

            },
            moduleOpen : function () {
                var modalInstance = $modal.open({
                    templateUrl: 'myModalContent.html',
                    controller: 'mapAddressController',
                    size:"bg",
                    resolve: {
                        items: function () {
                            return {};
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    $scope.formObj.mapValue = result;
                }, function (reason) {console.log(reason);});
            }

        };
        //订单默认关联当前登录用户的邮箱
        $scope.formObj.email = $cookieStore.get('user').email;
        //省市县下拉框查询
        $scope.selectProvince = function () {
            $http({
                method: 'GET',
                url: 'orderData/provinceSelect',
                params: {
                    view: 'select'
                }
            }).success(function (data) {
                var res = data.result;
                if (res) {
                    $scope.formObj.regionItems = res;
                }
            })
        }
        $scope.selectCity = function (provinceId) {
            $http({
                method: 'GET',
                url: 'orderData/citySelect',
                params: {
                    view: 'select',
                    provinceId: provinceId
                }
            }).success(function (data) {
                var res = data.result;
                if (res && res.length > 0) {
                    $scope.formObj.cityItems = res;
                }
            })
        }
        $scope.selectCounty = function (cityId) {
            $http({
                method: 'GET',
                url: 'orderData/countySelect',
                params: {
                    view: 'select',
                    cityId: cityId
                }
            }).success(function (data) {
                var res = data.result;
                if (res && res.length > 0) {
                    $scope.formObj.countryItems = res;
                }
            })
        }
        $scope.selectProvince();

        //$scope.agree = '1'
        //数据类型标签
        $scope.tabs = [true, false, false];
        $scope.tab = function (index) {
            angular.forEach($scope.tabs, function (i, v) {
                $scope.tabs[v] = false;
            });
            $scope.tabs[index] = true;
        }

}]);
//订单列表
app.controller('orderApplyListController', ['$scope', '$http',  'insureUtil', '$cookieStore','modalTip','switchLang','$state', '$compile',
    function ($scope, $http, insureUtil, $cookieStore, modalTip,switchLang,$state,$compile) {
        var longTime = new Date().getTime() - (1000 * 60 * 60 * 24 * 7)

        $scope.listObj = {
            dataTimeStart: insureUtil.dateToString(new Date(longTime), "yyyy/MM/dd"),
            dataTimeEnd: insureUtil.dateToString(new Date(), "yyyy/MM/dd"),
            category: "",
            categoryIds : {grid:"格网",satellite:"卫星",site:"站点"},
            approveIds : {"0":"数据准备中","1":"无法处理","2":"数据可下载"},
            orderSearch : function(){
                $scope.listObj.orderListInstance.bootstrapTable('refresh');
            },
            applyOrder : function(){
                $state.go("app.insure.dataOrder_orderApplyForm")
            },
            deleteOrders : function () {
                var Td = $scope.listObj.orderListInstance;
                var selectRow = Td.bootstrapTable('getSelections');

                if (selectRow.length) {
                    var ids = '', flag = true;
                    $.each(selectRow, function (index, item) {
                        ids += "," + item.id;
                        if (item.downloadtime) {
                            flag = false;
                        }
                    });
                    ids = ids.substr(1);

                    if (confirm(switchLang.switchLang('确认删除吗？'))) {
                        if (flag) {
                            $http({
                                method: 'GET',
                                url: 'orderData/delete',
                                params: {
                                    view: "delete",
                                    ids: ids
                                }
                            }).success(function (data) {
                                if (data) {
                                    modalTip({
                                        tip: "删除成功",
                                        type: true
                                    });
                                    $scope.listObj.orderListInstance.bootstrapTable('selectPage', 1);
                                }else {
                                    modalTip({
                                        tip: "删除失败",
                                        type: flag
                                    });
                                }
                            })
                        }else {
                            modalTip({
                                tip: '已通过审批的订单不能删除！',
                                type: false
                            })
                        }
                    }
                } else {
                    modalTip({
                        tip: switchLang.switchLang('请选择需要删除的记录'),
                        type: false
                    });
                }
            },
            postDownload : function(row){
                $http({
                    url: 'insure/export_dt',
                    method: "POST",
                    data: $.param({
                        fileSuffix : row.download
                    }),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    responseType: 'arraybuffer'
                }).success(function (data, status, headers, config) {
                    var blob = new Blob([data], {type: "application/octet-stream"});
                    saveAs(blob, [headers('Content-Disposition').replace(/attachment;fileName=/,"")]);
                }).error(function (data, status, headers, config) {
                    //upload failed
                });
            }
            // addBehavior: function () {
            //     $http({
            //         url: 'orderData/behaviorAnalysis?view=add',
            //         method: "POST",
            //         params: {
            //             userName: $cookieStore.get("user").userName,
            //             isDownload : true
            //         }
            //     }).success(function (data) {
            //         // console.log(data);
            //     })
            // }

        }

        $scope.listObj.orderApplyListTable = {
            url: 'orderData/query',
            resultTag: 'result',
            queryParams: function (params) {
                $.extend(params, {
                    view : "select",
                    dataTimeStart : angular.element("#dataTimeStart").val(),
                    dataTimeEnd : angular.element("#dataTimeEnd").val(),
                    category : $scope.listObj.category,
                    userName: $cookieStore.get("user").userName
                } );
                return params;
            },
            columns: [{
                checkbox: true,
                boxwidth: 10
            },{
                title: '订单编号',
                class: 'col-md-1',
                field: 'id',
                align: 'center',
                sortable: false,
                width: '5%'
            },{
                title: '订单生成时间',
                class: 'col-md-1',
                field: 'createtime',
                align: 'center',
                sortable: false,
                width: '15%',
                formatter: function (value, row, index) {
                    return new Date(parseInt(value)).format('yyyy/MM/dd hh:mm:ss');
                }
            },{
                title: '数据类型',
                class: 'col-md-1',
                field: 'category',
                align: 'center',
                sortable: false,
                width: '5%',
                formatter: function (value, row, index) {
                    return $scope.listObj.categoryIds[value];
                }
            },{
                title: '数据时间范围',
                class: 'col-md-1',
                field: 'datatimestart',
                align: 'center',
                sortable: false,
                width: '20%',
                formatter: function (value, row, index) {
                    return value +" - "+row.datatimeend;
                }
            },{
                title: '预估数据可下载时间',
                class: 'col-md-1',
                field: 'downloadtime',
                align: 'center',
                sortable: false,
                width: '10%',
                formatter: function (value, row, index) {
                    return 'undefined' === value ? '-' : value;
                }
            },{
                title: '被保作物',
                class: 'col-md-1',
                field: 'crop',
                align: 'center',
                sortable: false,
                width: '5%'
            },{
                title: '订单状态',
                class: 'col-md-1',
                field: 'approve',
                align: 'center',
                sortable: false,
                width: '10%',
                formatter: function (value, row, index) {
                    return $scope.listObj.approveIds[value];
                }
            },{
                title: '操作',
                class: 'col-md-1',
                align: 'center',
                width: '30%',
                formatter: function (value, row, index) {
                    var edit = $compile('<a btn-common route-flag="approve" btn-flag="a" class="a-approve a-blue" href="javascript:;">'+switchLang.switchLang("审批")+'</a>')($scope);
                    var approve = edit[0].outerHTML;
                    var upFile = $compile('<a btn-common route-flag="uploadFile" btn-flag="a" class="a-upload a-blue" href="javascript:;">'+switchLang.switchLang("上传")+'</a>')($scope);
                    var upFileDom = upFile[0].outerHTML;
                    var del = '删除';
                    if (row.downloadtime) {
                        del = '撤销';
                    }
                    return approve + '&nbsp;'+ upFileDom +"&nbsp;"+
                    '<a class="download a-blue" href="javascript:;">下载</a>&nbsp;' +
                        '<a class="detail a-blue" href="javascript:;">详细</a>&nbsp;'+
                        '<a class="del a-blue" href="javascript:;">'+del+'</a>&nbsp;';
                },
                events: {
                    'click .a-approve': function (e, value, row,index) {
                        var id = row.id;
                        $cookieStore.put("row",row);
                        $state.go('app.insure.dataOrder_orderApplyList_approve',{id:id});
                    },
                    'click .a-upload': function (e, value, row,index) {
                        $cookieStore.put("row",row);
                        $state.go('app.insure.dataOrder_orderApplyList_uploadFile');
                    },
                    'click .download': function (e, value, row,index) {
                        if(row.approve == "0"){
                            modalTip({
                                tip: "数据准备中...",
                                type: true
                            });
                        }else if(row.approve == "2"){
                            modalTip({
                                tip: "数据下载中...",
                                type: true
                            });
                            $scope.listObj.postDownload(row);
                            // $scope.listObj.addBehavior();
                        }
                        //$state.go('app.insure.insureService_policyManage_checkGisData');
                    },
                    'click .detail': function (e, value, row, index) {
                        $cookieStore.put("row", row);
                        $state.go('app.insure.dataOrder_orderApplyList_dataOrderDetail');
                    },
                    'click .del': function (e, value, row, index) {
                        if (row.downloadtime) {//已审批的无法撤销
                            modalTip({
                                tip: '已通过审批，无法撤销，如有需要请重新订购！',
                                type: false,
                                duration: 10000
                            })
                        }else {
                            if (confirm(switchLang.switchLang('确认撤销吗？'))) {
                                $http({
                                    method: 'GET',
                                    url: 'orderData/delete',
                                    params: {
                                        view: "delete",
                                        ids: row.id
                                    }
                                }).success(function (data) {
                                    if (data) {
                                        modalTip({
                                            tip: "撤销成功",
                                            type: true
                                        });
                                        $scope.listObj.orderListInstance.bootstrapTable('selectPage', 1);
                                    }else{
                                        modalTip({
                                            tip: "撤销失败",
                                            type: false
                                        });
                                    }
                                })
                            }
                        }
                    }


                }
            }]
        };
}]);

/**
 * 订单审批
 */
app.controller('orderApproveController', ['$scope', '$http', 'insureUtil', '$stateParams','modalTip','switchLang','$state','$cookieStore',
    function ($scope, $http, insureUtil, $stateParams, modalTip,switchLang,$state,$cookieStore) {

        var rowObj = $cookieStore.get("row");
        $scope.approveObj = {
            alinkReturn: function(){
                $cookieStore.remove("row");
                $state.go("app.insure.dataOrder_orderApplyList")
            },
            approve: rowObj.approve ? rowObj.approve : "0",
            downloadTime : rowObj.downloadtime ? rowObj.downloadtime : insureUtil.dateToString(new Date(), "yyyy/MM/dd"),
            note :  rowObj.note ? rowObj.note : "",
            submit : function(){
                $http({
                    method: 'GET',
                    url: 'orderData/approveOrder?view=approve',
                    params: {
                        approve: $scope.approveObj.approve,
                        downloadTime: angular.element("#downloadTime").val(),
                        note : $scope.approveObj.note,
                        id : $stateParams.id,
                        email :  rowObj.email,
                        datatimestart: rowObj.datatimestart,
                        datatimeend: rowObj.datatimeend,
                        datatype: switchLang.switchLang(rowObj.category + '.' + rowObj.datatype)
                    }
                }).success(function (data) {
                    if (data.success) {
                        modalTip({
                            tip: "提交成功",
                            type: true
                        });
                        $cookieStore.remove("row");
                        $state.go("app.insure.dataOrder_orderApplyList")

                    } else{
                        modalTip({
                            tip: "提交失败",
                            type: false
                        });
                    }
                })
            }
        };
    }]);

app.controller('orderUpFileController', ['$scope', '$http', 'FileUploader','modalTip','switchLang','$state','$cookieStore',
    function ($scope, $http, FileUploader, modalTip,switchLang,$state,$cookieStore){

        var rowObj = $cookieStore.get("row");
        $scope.uploadObj = {
            upfileType : "webupload",
            uploadSubmit : function() {
                if($scope.uploadObj.upfileType=="webupload"){
                    uploader.queue[0].upload();
                }else if($scope.uploadObj.upfileType=="manualupload"){
                    $http({
                        method: 'GET',
                        url: 'orderData/uploadOrder',
                        params: {
                            savepath : $scope.approveObj.fileName,
                            id : rowObj.id,
                            email : rowObj.email
                        }
                    }).success(function (data) {
                        if (data.success) {
                            modalTip({
                                tip: "提交成功",
                                type: true
                            });
                            $cookieStore.remove("row");
                            $state.go("app.insure.dataOrder_orderApplyList")

                        } else{
                            modalTip({
                                tip: "提交失败",
                                type: false
                            });
                        }
                    })
                }

            },
            alinkReturn: function(){
                $cookieStore.remove("row");
                $state.go("app.insure.dataOrder_orderApplyList")
            }
        };
        var uploader = $scope.uploader = new FileUploader({
            url: 'orderData/fileUpload',
            formData: [{
                id: rowObj.id,
                email : rowObj.email
            }]
        });
        // a sync filter
        uploader.filters.push({
            name: 'syncFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                // console.log('syncFilter');
                return this.queue.length < 10;
            }
        });

        // an async filter
        uploader.filters.push({
            name: 'asyncFilter',
            fn: function(item /*{File|FileLikeObject}*/, options, deferred) {
                // console.log('asyncFilter');
                setTimeout(deferred.resolve, 1e3);
            }
        });

        //事件回调
        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            // console.info('onAfterAddingFile', fileItem);
            //fileItem.upload();
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
            if (status == 200) {
                uploader.clearQueue();
                uploader.destroy();
                modalTip({
                    tip: "提交成功",
                    type: true
                });
                $cookieStore.remove("row");
                $state.go("app.insure.dataOrder_orderApplyList");
            } else if (status == 400) {
                modalTip({
                    tip: "提交数据有误:" + response.message,
                    type: false
                });
            } else if (status == 401) {
                modalTip({
                    tip: "操作失败，因为权限受限",
                    type: false
                });
            } else {
                modalTip({
                    tip: "系统异常",
                    type: false
                });
            }
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };
        // console.info('uploader', uploader);

    }]);
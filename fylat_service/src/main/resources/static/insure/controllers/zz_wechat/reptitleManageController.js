app.controller('reptitleManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'insureUtil', '$window', 'modalTip', '$compile',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, insureUtil, $window, modalTip, $compile) {
        var artcicle_type_id = $stateParams.type_id;
        $scope.activeTab=1;
        $scope.listObj = {
            navigationMsg: '管理平台 >爬虫界面',
            artcicle_type_id: $stateParams.type_id,//类型id
            pre_location: $stateParams.pre_location,
            comming_type_id: $stateParams.comming_type_id, //带过来的typeId
            wx_type: $stateParams.wx_type, //带过来的wx_type
            current_location: "app.insure.reptile_manage",
            defaultSearchParams:{
                tmp_type:1
            }
        };

        $scope.query_params = {
            type:'0',
            startTime:'',
            endTime:'',
            checkType:'',
            articleTypeId: '',
            articleTitle:'',
            articleKeyword:''
        }
        if($stateParams.query_params){
            $scope.query_params = JSON.parse($stateParams.query_params);
        }
        if($scope.query_params.type == '0'){
            $scope.article_query_params = $scope.query_params;
            if(!$scope.paper_query_params){
                $scope.paper_query_params = $scope.article_query_params;
            }
        }else{
            $scope.paper_query_params = $scope.query_params;
            $("#tab2Btn").trigger("click");
            $scope.activeTab=2;
        }

        if($stateParams.type == '1'){
            $scope.paper_query_params = $scope.query_params;
            $("#tab2Btn").trigger("click");
            $scope.activeTab=2;
        }


        $scope.goPreLocation = function(){
            $state.go($scope.listObj.pre_location, {
                focus_node: $stateParams.comming_type_id,
                type:$stateParams.menu_type
            });

        }

        $scope.listAritcle = function () {

            $scope.articleTmpOption = {
                url: 'http://106.2.13.148:8990/reptile/getArticleData',
                resultTag: 'result',
                method: 'get',
                queryParams: function (params) {
                    serializeJson(params, "queryArticleForm");
                    $.extend(params, {
                        view: 'select',
                        type: "0", //文章
                        del_type: "0", //非删除
                        tmp_type: $scope.listObj.defaultSearchParams.tmp_type, //非正式发布的
                        wx_type: $scope.listObj.wx_type
                    });
                    return params;
                },
                pageList: ['All'],
                pageSize: 10,
                onLoadSuccess: function (data) {
                    if (data.code != 0) {
                        layer.msg(data.message);
                    }
                },
                columns: [{
                    checkbox: true
                }, {
                    title: '文章名称',
                    class: 'col-md-1',
                    field: 'articleitle',
                    align: 'center',
                    titleTooltip: 'title',
                    // width: "15%",
                    cellStyle: {
                        css: {
                            "min-width": "100px",
                            "max-width": "200px"
                        }
                    }
                }, {
                    title: '发表时间',
                    class: 'col-md-1',
                    field: 'createime',
                    align: 'center',
                    width: "150px",
                    cellStyle: {
                        css: {
                            "min-widh": "150px"
                        }
                    },
                    formatter: function (value, row, index) {
                        if (value) {
                            return insureUtil.dateToString(new Date(value), "yyyy-MM-dd");
                        }
                        return '';
                    }
                }, {
                    title: '入库时间',
                    class: 'col-md-1',
                    field: 'updateTime',
                    align: 'center',
                    width: "150px",
                    cellStyle: {
                        css: {
                            "min-widh": "150px"
                        }
                    },
                    formatter: function (value, row, index) {
                        if (value) {
                            return insureUtil.dateToString(new Date(value), "yyyy-MM-dd hh:mm:ss");
                        }
                        return '';
                    }

                }, {
                    title: '关键词',
                    class: 'col-md-1',
                    field: 'articleKeyword',
                    align: 'center'

                }, {
                    title: '摘要',
                    class: 'col-md-1',
                    field: 'contentExcerpt',
                    align: 'center',
                    cellStyle: {
                        css: {
                            "min-width": "100px",
                            "max-width": "200px"
                        },
                        classes: ["overflow"]
                    },formatter:function(value, row, index) {
                        var values = row.content_excerpt;
                        var span=document.createElement('span');
                        span.setAttribute('title',values);
                        span.innerHTML = row.content_excerpt;
                        return span.outerHTML;
                    }
                }, {
                    title: '爬取来源',
                    class: 'col-md-1',
                    field: 'source',
                    align: 'center',
                    sortable: false
                }, {
                    title: '作者',
                    class: 'col-md-1',
                    field: 'author',
                    align: 'center'

                }, {
                    title: '字数',
                    class: 'col-md-1',
                    field: 'num',
                    align: 'center',
                    width: "100px"
                }, {
                    title: '操作',
                    class: 'col-md-1',
                    align: 'center',
                    formatter: function (value, row, index) {
                        return '<a class="btn btn-info btn-xs a-view" href="javascript:;">查看</a>&nbsp;' +
                            '<a class="btn btn-danger btn-xs a-delete" href="javascript:;"> 删除</a>';
                    },
                    events: {
                        'click .a-view': function (e, value, row, index) {
                            $state.go('app.insure.modify_paper', {
                                pre_query_params: JSON.stringify($scope.query_params),
                                article_id: row.articleId,
                                pre_location:$scope.listObj.current_location,
                                operate_type:"view",
                                type: "0",//文章
                                tmp_type: $scope.listObj.defaultSearchParams.tmp_type
                            });
                            // $scope.tableInstance.bootstrapTable('refresh');
                        },
                        'click .a-delete': function (e, value, row, index) {
                            deleteData(row.articleId,'0');
                        }
                    }
                }
                ]
            };
        }
        $scope.listAritcle();


        //论文列表
        $scope.listPaper = function () {

            $scope.paperTmpOption = {
                url: 'http://106.2.13.148:8990/reptile/getPaperData',
                resultTag: 'result',
                method: 'get',
                queryParams: function (params) {
                    serializeJson(params, "queryPaperForm");
                    $.extend(params, {
                        view: 'select',
                        type: "1", //论文
                        del_type: "0", //非删除
                        tmp_type: $scope.listObj.defaultSearchParams.tmp_type //非正式发布的
                    });
                    return params;
                },
                pageList: ['All'],
                pageSize: 10,
                onLoadSuccess: function (data) {
                    if (data.code != 0) {
                        layer.msg(data.message);
                    }
                },
                columns: [{
                    checkbox: true
                }, {
                    title: '论文名称',
                    class: 'col-md-1',
                    field: 'articleTitle',
                    align: 'center',
                    titleTooltip: 'title',
                    // width: "15%",
                    cellStyle: {
                        css: {
                            "min-width": "100px",
                            "max-width": "200px"
                        }
                    }
                }, {
                    title: '发表时间',
                    class: 'col-md-1',
                    field: 'createTime',
                    align: 'center',
                    width: "150px",
                    cellStyle: {
                        css: {
                            "min-widh": "150px"
                        }
                    },
                    formatter: function (value, row, index) {
                        if (value) {
                            return insureUtil.dateToString(new Date(value), "yyyy-MM-dd");
                        }
                        return '';
                    }
                }, {
                    title: '入库时间',
                    class: 'col-md-1',
                    field: 'updateTime',
                    align: 'center',
                    width: "150px",
                    cellStyle: {
                        css: {
                            "min-widh": "150px"
                        }
                    },
                    formatter: function (value, row, index) {
                        if (value) {
                            return insureUtil.dateToString(new Date(value), "yyyy-MM-dd hh:mm:ss");
                        }
                        return '';
                    }

                }, {
                    title: '关键词',
                    class: 'col-md-1',
                    field: 'articleKeyword',
                    align: 'center'

                }, {
                    title: '摘要',
                    class: 'col-md-1',
                    field: 'contentExcerpt',
                    align: 'center',
                    cellStyle: {
                        css: {
                            "min-width": "100px",
                            "max-width": "200px"
                        },
                        classes: ["overflow"]
                    },formatter:function(value, row, index) {
                        var values = row.content_excerpt;
                        var span=document.createElement('span');
                        span.setAttribute('title',values);
                        span.innerHTML = row.content_excerpt;
                        return span.outerHTML;
                    }
                }, {
                    title: '爬取来源',
                    class: 'col-md-1',
                    field: 'source',
                    align: 'center',
                    sortable: false
                }, {
                    title: '作者',
                    class: 'col-md-1',
                    field: 'author',
                    align: 'center'

                },{
                    title: '字数',
                    class: 'col-md-1',
                    field: 'num',
                    align: 'center',
                    width: "100px"
                },{
                    title: '操作',
                    class: 'col-md-1',
                    align: 'center',
                    formatter: function (value, row, index) {
                        return '<a class="btn btn-info btn-xs a-view" href="javascript:;">查看</a>&nbsp;' +
                            '<a class="btn btn-danger btn-xs a-delete" href="javascript:;"> 删除</a>';
                    },
                    events: {
                        'click .a-view': function (e, value, row, index) {
                            $state.go('app.insure.modify_paper', {
                                pre_query_params: JSON.stringify($scope.query_params),
                                article_id: row.articleId,
                                pre_location:$scope.listObj.current_location,
                                operate_type:"view",
                                type: "1",//论文
                                tmp_type: $scope.listObj.defaultSearchParams.tmp_type
                            });
                            // $scope.tableInstance.bootstrapTable('refresh');
                        },

                        'click .a-delete': function (e, value, row, index) {
                            deleteData(row.articleId,'1');
                        }
                    }
                }
                ]
            };
        }
        $scope.listPaper();


        //获取所有已发布的类型
        $scope.getAllPublishedType = function () {
            $http({
                method: 'GET',
                url: '/releaseManagement/getAllIssueArticleType/rest',
                params: {
                    type: "2"
                }
            }).success(function (data) {
                if (data.code == 0) {
                    $scope.publishedTypeList = data.result;
                    $(".selectpicker").empty();
                    $(".selectpicker").append('<option value="">--请选择--</option>');
                    for(var o in $scope.publishedTypeList) {
                        var option = $('<option>', {
                            'value': $scope.publishedTypeList[o].article_type_id,
                            'selected':$scope.publishedTypeList[o].article_type_id==$scope.query_params.article_type_id?true:false
                        }).append($scope.publishedTypeList[o].article_type_name)
                        $(".selectpicker").append(option);
                    }
                    $('.selectpicker').selectpicker('refresh');
                    $('.selectpicker').selectpicker('render');
                } else {
                    layer.msg(data.message)
                }
            }).error(function (data) {
                layer.alert("请求失败", {icon: 2})
            })
        }
        $scope.getAllPublishedType();

        $scope.queryArticle=function () {
            /*if(!$("#queryArticleForm [name=article_type_id]").val()){
                layer.msg("文章类型不能为空");
                return;
            }*/
            $scope.articleTmpInstance.bootstrapTable('refresh',{url:"http://106.2.13.148:8990/reptile/getArticleData",pageNumber:1,
                pageSize:10});
            // $scope.articleTmpInstance.bootstrapTable('refresh');
        }
        $scope.resetArticle=function () {
            $.each($("#queryArticleForm select,#queryArticleForm input"),
                function(i, n) {
                    $(n).val('');
                });
            $('#queryArticleForm .selectpicker').selectpicker('val', '');
        }

        $scope.queryPager=function () {
            /*if(!$("#queryPaperForm [name=article_type_id]").val()){
                layer.msg("论文类型不能为空");
                return;
            }*/
            $scope.paperTmpInstance.bootstrapTable('refresh',{url:"http://106.2.13.148:8990/reptile/getPaperData",pageNumber:1,
                pageSize:10});
            // $scope.paperTmpInstance.bootstrapTable('refresh');
        }
        $scope.resetPager=function () {
            $.each($("#queryPaperForm select,#queryPaperForm input"),
                function(i, n) {
                    $(n).val('');
                });
            $('#queryPaperForm .selectpicker').selectpicker('val', '');
        }

        $scope.batchDownload=function (type) {
            var array;
            if(type=='0'){
                array = $scope.articleTmpInstance.bootstrapTable('getSelections');
            }else{
                array = $scope.paperTmpInstance.bootstrapTable('getSelections');
            }
            if(!array || array.length == 0){
                layer.msg("请至少勾选一条数据");
                return;
            }
            var ids = "";
            for(var i = 0;i<array.length;i++){
                ids += array[i].articleId;
                ids += ",";
            }
            download(ids,type);
        }
        function download(rowIds,type){
            var confirm = layer.confirm('确认发布勾选的数据吗？', {
                btn: ['取消','确认'] //按钮
            }, function(){
                layer.close(confirm);
            }, function(){
                layer.load(2);
                var urlTemp='';
                if(type=='0'){
                    urlTemp='http://106.2.13.148:8990/reptile/getExcelArticleData';
                }else{
                    urlTemp='http://106.2.13.148:8990/reptile/getExcelPaperData';
                }
                $http({
                    method: 'GET',
                    url: urlTemp,
                    params: {
                        list: rowIds
                    }
                }).success(function (data) {
                    layer.closeAll('loading');
                    if (data.code == 0) {
                        layer.alert(data.message);
                        if(type=='0'){
                            $scope.articleTmpInstance.bootstrapTable('refresh');
                        }else{
                            $scope.paperTmpInstance.bootstrapTable('refresh');
                        }
                    } else {
                        layer.alert(data.message);
                    }

                }).error(function (data) {
                    layer.closeAll('loading');
                    layer.alert("发布失败");
                })
            });
        }
        $scope.batchDelete=function (type) {
            var array;
            if(type=='0'){
                array = $scope.articleTmpInstance.bootstrapTable('getSelections');
            }else{
                array = $scope.paperTmpInstance.bootstrapTable('getSelections');
            }
            if(!array || array.length == 0){
                layer.msg("请至少勾选一条数据");
                return;
            }
            var ids = "";
            for(var i = 0;i<array.length;i++){
                ids += array[i].articleId;
                ids += ",";
            }
            deleteData(ids,type);
        }

        function deleteData(rowIds,type){
            var confirm = layer.confirm('确认删除勾选的数据吗？', {
                btn: ['取消','确认'] //按钮
            }, function(){
                layer.close(confirm);
            }, function(){
                layer.load(2);
                var urlTemp='';
                if(type=='0'){
                    urlTemp='http://106.2.13.148:8990/reptile/delByArticle';
                }else{
                    urlTemp='http://106.2.13.148:8990/reptile/delByPaper';
                }
                $http({
                    method: 'GET',
                    url: urlTemp,
                    params: {
                        list: rowIds
                    }
                }).success(function (data) {
                    layer.closeAll('loading');
                    if (data.code == 0) {
                        layer.alert(data.message);
                        if(type=='0'){
                            $scope.articleTmpInstance.bootstrapTable('refresh');
                        }else{
                            $scope.paperTmpInstance.bootstrapTable('refresh');
                        }
                    } else {
                        layer.alert(data.message);
                    }

                }).error(function (data) {
                    layer.closeAll('loading');
                    layer.alert("删除失败");
                })
            });
        }

    }]);


app.controller('modifyPaperManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'insureUtil', '$window', 'modalTip', '$compile', '$timeout','FileUploader','Upload',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, insureUtil, $window, modalTip, $compile, $timeout,FileUploader,Upload) {
        var editor;

        $scope.data = {
            file_back: null

        };
        $scope.uploadImage = function (file) {
            $scope.data.file_back='上传中';
            Upload.upload({
                url: 'article/addArticleImage',
                data: {file: file}
            }).success(function (result) {

                if (result != null && result.code == 0) {
                    $scope.data.file_back = result.path;
                }else {
                    $scope.data.file_back='上传失败';
                }

            }).error(function () {
                $scope.data.file_back='上传失败';
                layer.alert("添加失败");
            });
        };

        $scope.listObj = {
            navigationMsg: '管理平台 >文章修改',
            pre_location: '',
            operate_type: '',
            type: '',
            tmp_type: '',
            regionType: {selected: undefined},//文章类型
            dataTime: insureUtil.dateToString(new Date(), "yyyy-MM-dd"),
            article_id: null,
            selectedItem: {
                article_type_id: null,
                article_type_name: null
            },

            //查询参数
            integrationQuery: {
                author: null,//作者
                source: null,//来源
                article_title: null,//文章标题
                article_keyword: null,//关键词
                content_excerpt: null,//文章摘要
                share_initcount: 0,//分享基数
                collect_count: 0,//收藏基数
                content: null,//文章内容
                content_type: null,//0 手动输入 1爬取
                details_div: null,//爬取
                content_manual: null//手动输入
            },

            errorMessage: {
                author: false,//作者
                source: false,//来源
                article_title: false,//文章标题
                article_keyword: false,//关键词
                content_excerpt: false,//文章摘要
                content: false

            },
            articleTypeData: [],//
            region: [],//
            articleMessage: {},
            getRegionTypeSelect: function (item) {
                $scope.listObj.regionType.selected = item;
            },
            postDownload: function () {//类型查询
                var article_type_id;
                if ($scope.listObj.region.selected != null) {
                    article_type_id = $scope.listObj.region.selected.article_type_id
                }
                $http({
                    url: 'article/getAllAricleType',
                    method: "GET",
                    params: {
                        article_type_id: article_type_id
                    }
                }).success(function (data) {
                    $scope.listObj.articleTypeData = data;

                }).error(function (data) {

                });
            },
            setTime: function (endTimeId, maxDate, dateFmt) {
                WdatePicker({
                    el: endTimeId,
                    maxDate: maxDate,
                    dateFmt: dateFmt
                })
            },

            getAtirlceMessage: function () {
                $scope.listObj.article_id = $stateParams.article_id;
                $scope.listObj.pre_location = $stateParams.pre_location;
                $scope.listObj.operate_type = $stateParams.operate_type;
                $scope.listObj.type = $stateParams.type;
                $scope.listObj.tmp_type = $stateParams.tmp_type;

                $http({
                    url: 'article/webMessage',
                    method: "GET",
                    params: {
                        article_id: $scope.listObj.article_id
                    }
                }).success(function (data) {
                    debugger
                    if (data != null && data.result != null) {
                        $scope.listObj.integrationQuery.article_title = data.result.article_title;
                        $scope.listObj.integrationQuery.author = data.result.author;
                        $scope.listObj.integrationQuery.source = data.result.source;
                        $scope.listObj.integrationQuery.article_keyword = data.result.article_keyword;
                        $scope.listObj.integrationQuery.content_excerpt = data.result.content_excerpt;
                        $scope.listObj.integrationQuery.share_initcount = data.result.share_initcount;
                        $scope.listObj.integrationQuery.content_type = data.result.content_type;
                        $scope.listObj.integrationQuery.content_manual = data.result.content_manual;
                        $scope.listObj.integrationQuery.details_div = data.result.details_div;
                        $scope.listObj.integrationQuery.collect_count = data.result.collect_initcount;

                        $scope.listObj.integrationQuery.word_count = data.result.word_count;
                        $scope.listObj.integrationQuery.site_number = data.result.site_number;
                        $scope.listObj.integrationQuery.content_excerpt_e = data.result.content_excerpt_e;
                        $scope.listObj.integrationQuery.article_keyword_e = data.result.article_keyword_e;
                        $scope.listObj.integrationQuery.article_title_e = data.result.article_title_e;
                        $scope.listObj.integrationQuery.publication_date = data.result.publication_date;
                        $scope.listObj.integrationQuery.article_score = data.result.article_score;

                        $scope.listObj.integrationQuery.create_time = insureUtil.dateToString(new Date(data.result.create_time), "yyyy-MM-dd");
                        $scope.listObj.integrationQuery.update_time = insureUtil.dateToString(new Date(data.result.update_time), "yyyy-MM-dd");

                        $scope.listObj.selectedItem.article_type_id = data.result.article_type_id;
                        $scope.listObj.selectedItem.article_type_name = data.result.article_type_name;
                        $scope.listObj.regionType.selected= $scope.listObj.selectedItem;
                        if (editor != null && $scope.listObj.integrationQuery.content_type == 0) {
                            editor.txt.html($scope.listObj.integrationQuery.content_manual)
                        } else if (editor != null && $scope.listObj.integrationQuery.content_type == 1) {
                            editor.txt.html($scope.listObj.integrationQuery.details_div)
                        }
                        if($scope.listObj.operate_type == 'view'){
                            $("#add_integration input,#add_integration button,#add_integration select,#add_integration textarea").attr("disabled", "disabled");
                        }
                        $scope.listObj.postDownload();
                    } else {
                        layer.alert(data.message);
                    }
                }).error(function (data) {
                    layer.alert("请求失败");
                });
            }
        };

        $scope.operate = {
            delete:function(){
                if (confirm(switchLang.switchLang('确认删除数据吗？'))) {
                    layer.load(2);
                    $http({
                        method: 'GET',//TODO 后台没支持已发布的删除
                        url: 'releaseManagement/delAricleTmpList/rest',
                        params: {
                            articleIdList: $scope.listObj.article_id
                        }
                    }).success(function (data) {
                        layer.closeAll('loading');
                        if (data.code == 0) {
                            layer.msg(data.message);
                            $state.go($scope.pre_location);
                        } else {
                            layer.alert(data.message);
                        }

                    }).error(function (data) {
                        layer.closeAll('loading');
                        layer.alert("删除失败");
                    })
                }
            },
            check:function(){
                if (confirm(switchLang.switchLang('确认审批通过吗？'))) {
                    layer.load(2);
                    $http({
                        method: 'GET',//TODO 后台没支持已发布的审核啊
                        url: 'releaseManagement/getAricleTmpCheckById/rest',
                        params: {
                            articleIds: $scope.listObj.article_id,
                            type:$scope.listObj.type
                        }
                    }).success(function (data) {
                        layer.closeAll('loading');
                        if (data.code == 0) {
                            layer.msg(data.message);
                            $state.go($scope.pre_location);
                        } else {
                            layer.alert(data.message);
                        }

                    }).error(function (data) {
                        layer.closeAll('loading');
                        layer.alert("删除失败");
                    })
                }
            },
            save:function(){
                $scope.save();
            },
            publish:function () {
                //TODO 后台没有提供发布功能啊
                $scope.save(function(){
                    $http({
                        method: 'GET',
                        url: 'releaseManagement/pushAricleTmpById/rest',
                        params: {
                            articleIds: $scope.listObj.article_id,
                            type:$scope.listObj.type
                        }
                    }).success(function (data) {
                        layer.closeAll('loading');
                        if (data.code == 0) {
                            layer.msg(data.message);
                            $state.go($scope.pre_location);
                        } else {
                            layer.alert(data.message);
                        }

                    }).error(function (data) {
                        layer.closeAll('loading');
                        layer.alert("发布失败");
                    })
                });
            }
        }

        $scope.save = function(callback){
            if(!$scope.listObj.integrationQuery.article_title){
                layer.tips("请输入标题","#article_title");
                return;
            }
            if(!$scope.listObj.regionType.selected){
                layer.tips("请选择类型","#article_type");
                return;
            }
            if(!$scope.listObj.integrationQuery.source){
                layer.tips("请输入来源","#source");
                return;
            }
            if(!$scope.listObj.integrationQuery.create_time){
                layer.tips("请选择发表时间","#create_time");
                return;
            }
            if(!$scope.listObj.integrationQuery.update_time){
                layer.tips("请选择入库时间","#update_time");
                return;
            }
            if(!$scope.listObj.integrationQuery.article_keyword){
                layer.tips("请输入关键字","#article_keyword");
                return;
            }
            if(!$scope.listObj.integrationQuery.content_excerpt){
                layer.tips("请输入摘要","#content_excerpt");
                return;
            }
            // 获取编辑器区域完整html代码
            var html = editor.txt.html();
            // 获取编辑器纯文本内容
            var text = editor.txt.text();
            if (text == null || text.length == 0) {
                layer.tips("请输入正文","#content");
                return;
            }

            $scope.listObj.dataTime = angular.element('#time').val();
            layer.load(2);
            $http({
                url: 'releaseManagement/updateAricleTmpMesage/rest',
                method: 'POST',
                data: {
                    type: $scope.listObj.type,
                    tmp_type: $scope.listObj.tmp_type,
                    article_id: $scope.listObj.article_id ,
                    article_type_id: $scope.listObj.regionType.selected.article_type_id,
                    author: $scope.listObj.integrationQuery.author,
                    source: $scope.listObj.integrationQuery.source,
                    article_title: $scope.listObj.integrationQuery.article_title,
                    article_keyword: $scope.listObj.integrationQuery.article_keyword,
                    content_excerpt: $scope.listObj.integrationQuery.content_excerpt,
                    // share_initcount: $scope.listObj.integrationQuery.share_initcount,
                    // collect_count: $scope.listObj.integrationQuery.collect_count,
                    content_manual: html, //TODO 注意后台没存啊
                    details_txt: text,
                    reference:$scope.listObj.integrationQuery.reference,
                    create_time: $scope.listObj.integrationQuery.create_time,
                    //未更新
                    update_time: $scope.listObj.integrationQuery.update_time,//后台未更新
                    word_count: text.length,
                    site_number: $scope.listObj.integrationQuery.site_number,
                    content_excerpt_e: $scope.listObj.integrationQuery.content_excerpt_e,
                    article_keyword_e: $scope.listObj.integrationQuery.article_keyword_e,
                    article_title_e: $scope.listObj.integrationQuery.article_title_e,
                    publication_date: $scope.listObj.integrationQuery.publication_date,
                    article_score: $scope.listObj.integrationQuery.article_score


                }
            }).success(function (data) {
                layer.closeAll('loading');
                if (data.code == 0) {
                    layer.msg("保存成功");
                    if(callback){
                        callback();
                    }else{
                        $state.go($scope.pre_location);
                    }
                } else {
                    layer.alert("更新失败");
                }
            }).error(function (data, status, headers, config) {
                layer.closeAll('loading');
                layer.alert("更新失败");
            });
        }

        $scope.listObj.getAtirlceMessage();
        $timeout(function () {
            var E = $window.wangEditor;
            editor = new E('#weEditor');
            // 忽略粘贴内容中的图片
            editor.customConfig.pasteIgnoreImg = true;
            editor.customConfig.menus = [
                'head',  // 标题
                'bold',  // 粗体
                'fontSize',  // 字号
                'fontName',  // 字体
                'italic',  // 斜体
                'underline',  // 下划线
                'strikeThrough',  // 删除线
                'foreColor',  // 文字颜色
                'backColor',  // 背景颜色
                'link',  // 插入链接
                // 'list',  // 列表
                'justify',  // 对齐方式
                'quote',  // 引用
                'emoticon',  // 表情
                'image',  // 插入图片
                'table',  // 表格
                'video',  // 插入视频
                'code',  // 插入代码
                'undo',  // 撤销
                'redo'  // 重复
            ];

            editor.create();
            if (editor != null && $scope.listObj.integrationQuery.content_type == 0) {
                editor.txt.html($scope.listObj.integrationQuery.content_manual)
            } else if (editor != null && $scope.listObj.integrationQuery.content_type == 1) {
                editor.txt.html($scope.listObj.integrationQuery.details_div)
            }
        }, 0);
    }])
;


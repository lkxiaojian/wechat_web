app.controller('addArticleManageController', ['$scope', '$modal', '$http','fylatService', '$state', 'switchLang', '$stateParams', 'insureUtil', '$window', 'modalTip', '$compile', '$timeout','FileUploader','Upload',
    function ($scope, $modal, $http,fylatService, $state, switchLang, $stateParams, insureUtil, $window, modalTip, $compile, $timeout,FileUploader,Upload ) {
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
                }

            }).error(function () {
                modalTip({
                    tip: switchLang.switchLang('添加失败'),
                    type: true
                });
            });
        };

        $scope.listObj = {
            navigationMsg: '管理平台 >文章管理',
            region: {selected: undefined},//领域
            regionType: {selected: undefined},//文章类型
            dataTime: insureUtil.dateToString(new Date(), "yyyy-MM-dd"),

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

            },

            errorMessage: {
                author: false,//作者
                source: false,//来源
                article_title: false,//文章标题
                article_keyword: false,//关键词
                content_excerpt: false,//文章摘要
                content: false

            },
            projectData: [],//领域
            articleTyprData: [],//
            getRegionSelect: function (item) {
                $scope.listObj.region.selected = item;
                $scope.listObj.postDownload();
            },
            getRegionTypeSelect: function (item) {
                $scope.listObj.regionType.selected = item;
            },
            postRegion: function () {// 领域查询
                $http({
                    url: 'article/getAllDomain',
                    method: "GET"
                }).success(function (data) {
                    // $scope.listObj.region.selected = data[0];
                    $scope.listObj.projectData = data;


                }).error(function (data) {
                    alert("服务器请求错误")
                });
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
                    $scope.listObj.articleTyprData = data;

                }).error(function (data) {

                });
            },
            addMessageCommit: function () {
                $scope.listObj.errorMessage.author = false;
                $scope.listObj.errorMessage.source = false;
                $scope.listObj.errorMessage.article_title = false;
                $scope.listObj.errorMessage.article_keyword = false;
                $scope.listObj.errorMessage.content_excerpt = false;
                $scope.listObj.errorMessage.content = false
                if (!$scope.listObj.regionType.selected) {
                    return;
                }
                // if (!$scope.listObj.integrationQuery.author) {
                //     $scope.listObj.errorMessage.author = true;
                //     return;
                // }
                if (!$scope.listObj.integrationQuery.source) {
                    $scope.listObj.errorMessage.source = true;
                    return;
                }

                if (!$scope.listObj.integrationQuery.article_title) {
                    $scope.listObj.errorMessage.article_title = true;
                    return;
                }
                if (!$scope.listObj.integrationQuery.article_keyword) {
                    $scope.listObj.errorMessage.article_keyword = true;
                    return;
                }

                if (!$scope.listObj.integrationQuery.content_excerpt) {
                    $scope.listObj.errorMessage.content_excerpt = true;
                    return;
                }
                // 获取编辑器区域完整html代码
                var html = editor.txt.html();
                // 获取编辑器纯文本内容
                var text = editor.txt.text();
                if (text == null || text.length == 0) {
                    $scope.listObj.errorMessage.content = true;
                    return;
                }

                $scope.listObj.dataTime = angular.element('#time').val();
                ;

                $http({
                    url: 'article/addArticle',
                    method: 'POST',
                    data: {
                        article_type_id: $scope.listObj.regionType.selected.article_type_id,
                        author: $scope.listObj.integrationQuery.author,
                        source: $scope.listObj.integrationQuery.source,
                        article_title: $scope.listObj.integrationQuery.article_title,
                        article_keyword: $scope.listObj.integrationQuery.article_keyword,
                        content_excerpt: $scope.listObj.integrationQuery.content_excerpt,
                        share_initcount: $scope.listObj.integrationQuery.share_initcount,
                        collect_count: $scope.listObj.integrationQuery.collect_count,
                        word_count: text.length,
                        content_manual: html,
                        details_txt: text,
                        dateTIme: $scope.listObj.dataTime,
                    }
                }).success(function (data) {
                    console.log(data)
                    if (data.code == 0) {
                        modalTip({
                            tip: switchLang.switchLang('添加成功'),
                            type: true
                        });

                        $scope.listObj.integrationQuery = {
                            author: null,//作者
                            source: null,//来源
                            article_title: null,//文章标题
                            article_keyword: null,//关键词
                            content_excerpt: null,//文章摘要
                            share_initcount: 0,//分享基数
                            collect_count: 0,//收藏基数
                            content: null,//文章内容
                        }
                        $scope.listObj.errorMessage = {
                            author: false,//作者
                            source: false,//来源
                            article_title: false,//文章标题
                            article_keyword: false,//关键词
                            content_excerpt: false,//文章摘要
                            content: false
                        }

                        editor.txt.clear()
                    } else {
                        modalTip({
                            tip: switchLang.switchLang('添加失败'),
                            type: false
                        });
                    }
                }).error(function (data, status, headers, config) {
                    console.log(data)
                    modalTip({
                        tip: switchLang.switchLang('添加失败'),
                        type: false
                    });

                });


            },
            setTIme: function (endTimeId, maxDate, dateFmt) {
                WdatePicker({
                    el: endTimeId,
                    maxDate: maxDate,
                    dateFmt: dateFmt
                })
            }

        };



        $scope.listObj.postRegion();
        $scope.listObj.postDownload();
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

        }, 0);
    }]);


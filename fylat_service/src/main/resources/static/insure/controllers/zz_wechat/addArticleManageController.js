app.controller('addArticleManageController', ['$scope', '$modal', '$http', 'fylatService', '$state', 'switchLang', '$stateParams', 'insureUtil', '$window', 'modalTip', '$compile','$timeout',
    function ($scope, $modal, $http, fylatService, $state, switchLang, $stateParams, insureUtil, $window, modalTip, $compile,$timeout) {
        var editor;
/*        window.onload = function () {
            var E = $window.wangEditor;
            editor = new E('#weEditor')
         /!*   editor.customConfig.uploadFileName = 'file'
            editor.customConfig.uploadImgHeaders = {
                'Accept': 'multipart/form-data; charset=utf-8'
            }
            // 将图片大小限制为 3M
            editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
            // 限制一次最多上传 5 张图片
            editor.customConfig.uploadImgMaxLength = 1;
            editor.customConfig.uploadImgServer = 'article/articleImageUpload'  // 上传图片到服务器


            editor.customConfig.uploadImgHooks = {
                before: function (xhr, editor, files) {
                    // 图片上传之前触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件

                    // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
                    // return {
                    //     prevent: true,
                    //     msg: '放弃上传'
                    // }
                },
                success: function (xhr, editor, result) {
                    // 图片上传并返回结果，图片插入成功之后触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
                    console.log(result)
                },
                fail: function (xhr, editor, result) {
                    // 图片上传并返回结果，但图片插入错误时触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
                    console.log(result)
                },
                error: function (xhr, editor) {
                    // 图片上传出错时触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
                    console.log(result)
                },
                timeout: function (xhr, editor) {
                    // 图片上传超时时触发
                    // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
                    console.log(result)
                },

                // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
                // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
                customInsert: function (insertImg, result, editor) {
                    // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
                    // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

                    // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
                    console.log(result)
                    insertImg(result.data)

                    // result 必须是一个 JSON 格式字符串！！！否则报错
                }
            }*!/
            editor.create()

        }*/


        $scope.listObj = {
            navigationMsg: '管理平台 >文章管理',
            region: {selected: undefined},//领域
            regionType: {selected: undefined},//文章类型
            dataTime: insureUtil.dateToString(new Date(), "yyyy-MM-dd hh:mm:ss"),

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

                $scope.listObj.dataTime=  angular.element('#time').val();;

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
                        dateTIme:$scope.listObj.dataTime,
                    }
                }).success(function (data) {
                    console.log(data)
                    if (data.code == 0) {
                        modalTip({
                            tip: switchLang.switchLang('添加成功'),
                            type: true
                        });

                        $scope.listObj. integrationQuery= {
                            author: null,//作者
                                source: null,//来源
                                article_title: null,//文章标题
                                article_keyword: null,//关键词
                                content_excerpt: null,//文章摘要
                                share_initcount: 0,//分享基数
                                collect_count: 0,//收藏基数
                                content: null,//文章内容
                        }
                        $scope.listObj. errorMessage= {
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
            setTIme:function (endTimeId,maxDate,dateFmt) {
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
        },0);
    }])
;


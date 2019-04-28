app.factory("insureUtil", ['$http', '$filter', function ($http, $filter) {
    //原生日期对象扩展
    Date.prototype.format = function (format) {
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(),    //day
            "h+": this.getHours(),   //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
            "S": this.getMilliseconds() //millisecond
        }
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                    ("00" + o[k]).substr(("" + o[k]).length));
        return format;
    }

//原生字符串扩展
    /*************************************************
     Usage…
     var test = "   Test   ";
     var test1 = test.ltrim();   // returns "Test   "
     var test2 = test.rtrim();   // returns "   Test"
     var test3 = test.trim();    // returns "Test"
     *************************************************/
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, "");
    }
    String.prototype.ltrim = function () {
        return this.replace(/^\s+/g, "");
    }
    String.prototype.rtrim = function () {
        return this.replace(/\s+$/g, "");
    }

    String.prototype.toDate = function (style) {
        if (style == null) style = 'yyyy-MM-dd hh:mm:ss';
        var o = {'y+': 'y', 'M+': 'M', 'd+': 'd', 'h+': 'h', 'm+': 'm', 's+': 's'};
        var result = {'y': '', 'M': '', 'd': '', 'h': '00', 'm': '00', 's': '00'}
        var tmp = style;
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(style)) {
                result[o[k]] = this.substring(tmp.indexOf(RegExp.$1), tmp.indexOf(RegExp.$1) + RegExp.$1.length);
            }
        }
        return new Date(result['y'], result['M'] - 1, result['d'], result['h'], result['m'], result['s']);
    }

    return {
        dateToString: function (dateObj, pattern) {
            return dateObj.format(pattern);
        },
        stringToDate: function (strDate, pattern) {
            return strDate.toDate(pattern);
        },
        getWindowHeight: function () {
            var winHeight = 0;
            if (window.innerHeight) {
                winHeight = window.innerHeight;
            } else if ((document.body) && (document.body.clientHeight)) {
                winHeight = document.body.clientHeight;
            }
            if (document.documentElement && document.documentElement.clientHeight) {
                winHeight = document.documentElement.clientHeight;
            }
            return winHeight;
        },
        getWindowWidth: function () {
            var winWidth = 0;
            if (window.innerWidth)
                winWidth = window.innerWidth;
            else if ((document.body) && (document.body.clientWidth))
                winWidth = document.body.clientWidth;
            if (document.documentElement && document.documentElement.clientWidth) {
                winWidth = document.documentElement.clientWidth;
            }
            return winWidth;
        }
    };
}]);
app.service("echartsConfigService", ['$filter', '$http', function ($filter, $http) {
    //环形图
    this.annularOption = function () {
        var labelTop = {
            //中间名称
            normal : {
                label : {
                    show : true,
                    position : 'center',
                    formatter : '{b}',
                    textStyle: {
                        baseline : 'bottom'
                    }
                },
                labelLine : {
                    show : false
                }
            }
        };
        var labelFromatter = {
            normal : {
                label : {
                    formatter : function (params){
                        return 100 - params.value + '%'
                    },
                    textStyle: {
                        baseline : 'top'
                    }
                }
            },
        };
        var labelBottom = {
            normal : {
                color: '#acacac',
                label : {
                    show : true,
                    position : 'center'
                },
                labelLine : {
                    show : false
                }
            },
            emphasis: {
                color: '#ccc'
            }
        };
        var radius = [48, 55];
        var option = {
            legend: {
                x : 'center',
                y : 'center',
                data:[
                    'sdk1使用','sdk2使用'
                ]
            },
            title : {
                text: '磁盘使用',
                subtext: 'from global web index',
                x: 'center'
            },
            toolbox: {
                show : true,
                feature : {
                    dataView : {show: true, readOnly: true},
                    magicType : {
                        show: true,
                        type: ['pie', 'funnel'],
                        option: {
                            funnel: {
                                width: '20%',
                                height: '30%',
                                itemStyle : {
                                    normal : {
                                        label : {
                                            formatter : function (params){
                                                return 'other\n' + params.value + '%\n'
                                            },
                                            textStyle: {
                                                baseline : 'middle'
                                            }
                                        }
                                    },
                                }
                            }
                        }
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            series : [
                {
                    name:'sdk1',
                    type : 'pie',
                    center : ['10%', '30%'],
                    radius : radius,
                    x: '0%', // for funnel
                    itemStyle : labelFromatter,
                    data : [
                        {name:'sdk1未使用', value:46, itemStyle : labelBottom},
                        {name:'sdk1使用', value:54,itemStyle : labelTop}
                    ]
                },
                {
                    type : 'pie',
                    center : ['30%', '30%'],
                    radius : radius,
                    x: '20%', // for funnel
                    itemStyle : labelFromatter,
                    data : [
                        {name:'sdk2未使用', value:36, itemStyle : labelBottom},
                        {name:'sdk2使用', value:54,itemStyle : labelTop}
                    ]
                },
            ]
        };
        return option;
    }
    //饼图
    this.pieOption = function () {

        return {
            title: {
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
                x: 'left',
                data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎'],
            },
            series: [
                {
                    name: '总访问次数',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [
                        {value: 335, name: '直接访问'},
                        {value: 310, name: '邮件营销'},
                        {value: 234, name: '联盟广告'},
                        {value: 135, name: '视频广告'},
                        {value: 1548, name: '搜索引擎'}
                    ],
                    data: [],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
    };
    //仪表图
    this.normalGauge = function () {
        return {
            tooltip: {
                formatter: "{a} <br/>{b} : {c}%"
            },
            toolbox: {
                show: true,
                feature: {
                    mark: {show: true},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            series: [
                {
                    name: '业务指标',
                    type: 'gauge',
                    splitNumber: 10,       // 分割段数，默认为5
                    axisLine: {            // 坐标轴线
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: [[0.2, '#228b22'], [0.8, '#48b'], [1, '#ff4500']],
                            width: 8
                        }
                    },
                    axisTick: {            // 坐标轴小标记
                        splitNumber: 10,   // 每份split细分多少段
                        length: 12,        // 属性length控制线长
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: 'auto'
                        }
                    },
                    axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            color: 'auto'
                        }
                    },
                    splitLine: {           // 分隔线
                        show: true,        // 默认显示，属性show控制显示与否
                        length: 30,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            color: 'auto'
                        }
                    },
                    pointer: {
                        width: 5
                    },
                    title: {
                        show: true,
                        offsetCenter: [0, '-40%'],       // x, y，单位px
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'bolder'
                        }
                    },
                    detail: {
                        formatter: '{value}%',
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            color: 'auto',
                            fontWeight: 'bolder'
                        }
                    },
                    data: [{value: 50, name: '完成率'}]
                }
            ]
        };

    }
    //柱形图
    this.barVerticalOption = function () {
        return {
            title: {
                text: '',
                subtext: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                //data:['触发次数']
                x:'80',
                data: [],
                padding:[0,10,10,-200]
            },
            toolbox: {
                show: false,
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            //calculable : true,
            xAxis: [
                {
                    type: 'category',
                    data: []
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                /*{
                 name:'触发次数',
                 type:'bar',
                 data:_value,
                 markPoint : {
                 data : [
                 {type : 'max', name: '最大值'},
                 {type : 'min', name: '最小值'}
                 ]
                 },
                 markLine : {
                 data : [
                 {type : 'average', name: '平均值'}
                 ]
                 },
                 itemStyle : {
                 normal : {
                 color: '#616b88'
                 }
                 }
                 }*/
            ]
        };
    };

    //标准面积图
    this.nomalLine = function () {
        var lineoption = {
            title: {//标题
                text: '',
                subtext: ''
            },
            dataZoom: {//数据缩放
                show: false
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {//图例，必须
                data: ['最高气温']
            },
            grid: {x: 50, y: 35, x2: 40, y2: 20},
            toolbox: {//工具箱，false：不显示，true：显示
                show: false,
                feature: {
                    mark: {show: true},
                    dataView: {show: true, readOnly: false},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            calculable: false,//是否启用拖拽重计算特性，默认关闭
            xAxis: [
                {
                    type: 'category',//三种类型：value, time, category
                    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']//x轴的值域
                }
            ],
            yAxis: [
                {
                    type: 'value',//三种类型：value, time, category
                    axisLabel: {//坐标轴文本标签选项
                        formatter: '{value} °C'//显示格式化
                    }
                }
            ],
            series: [
                {
                    name: '最高气温',
                    type: 'line',
                    data: [11, 11, 15, 13, 12, 13, 10],
                    markPoint: {//标注
                        data: [
                            {type: 'max', name: '最大值'},
                            {type: 'min', name: '最小值'}
                        ]
                    },
                    markLine: {//标注线
                        data: [
                            {type: 'average', name: '平均值'}
                        ]
                    }
                }
            ]
        }
        return lineoption;
    };

    //折线(面积图)[通过itemStyle: {normal: {areaStyle: {type: 'default'}}}这个属性，设置面积颜色，形成面积图；若不设置，则为折线图]
    this.lineOption = function (url) {

        var option = {
            isDebug: true,
            grid: {x: 50, y: 45, x2: 35},
            legend: {data: [], y: 10},
            title: {
                text: '',
                subtext: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            toolbox: {
                y: 1,
                padding: [0, 35, 0, 0],
                show: true,
                feature: {
                    mark: {show: false},
                    dataView: {show: false, readOnly: false},
                    magicType: {show: false, type: ['line', 'bar', 'stack', 'tiled']},
                    restore: {show: false},
                    saveAsImage: {show: false}
                }
            },
            xAxis: [{type: 'category', boundaryGap: false, data: []}],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        //formatter: '{value} 次'
                    }
                }
            ],
            series: []
        };

        $http.get(url).then(function (resp) {
            if (resp.data.code == 0) {
                var result = resp.data.result;

                var allnum = result.allnum,
                    blocknum = result.blocknum,
                    normalnum = result.normalnum;

                var xsData = [],
                    names = ['所有访问', '拦截访问', '正常访问'],
                    allArray = [], blockArray = [], normalArray = [];

                for (var i = 0; i < allnum.length; i++) {
                    //xsData.push($filter('date')(total[i].x,'M月d日 HH:mm'));
                    //xsData.push($filter('date')(total[i].x,'M/d HH:mm'));
                    xsData.push($filter('date')(allnum[i].x, 'y-MM-dd'));
                    allArray.push(allnum[i].y);
                    blockArray.push(blocknum[i].y);
                    normalArray.push(normalnum[i].y);
                }

                var ssDatas = [allArray, blockArray, normalArray];

                var color = ['#c3a02c', '#ca5c57', '#439aaa'];

                option.legend.data = names;
                option.xAxis[0].data = xsData;

                for (var i = 0; i < names.length; i++) {
                    option.series.push({
                        name: names[i],
                        type: 'line',
                        smooth: false,
                        itemStyle: {
                            normal: {
                                color: color[i],
                                areaStyle: {type: 'default'},
                                label: {
                                    textStyle: {
                                        color: color[i]
                                    }
                                },
                                lineStyle: {
                                    color: color[i]
                                }
                            }
                        },
                        data: ssDatas[i]
                    });
                }
            }
        });

        return option;
    }
}]);
app.factory("fylatService", ['$http', '$filter', function ($http, $filter) {
    var obj = {
        projectSelect:[
            {
                id:'YCP',
                name:'云产品',
                typeSelect: [
                    {id: null, name: '全部'},
                    {id: 'CLM', name: '云检测(CLM)'},
                    {id: 'SST', name: '海面温度(SST)'},
                ]

            },
            
            /*{
            	id:'SST',
            	name:'海面温度',
            	typeSelect:[
    	            {id:null,name:'全部'},
    	            {id:'SST',name:'海面温度(SST)'}
            	 ]
            },
            {
            	id:'CLM',
            	name:'云检测',
            	typeSelect:[
    	            {id:null,name:'全部'},
	                {id:'CLM',name:'云检测(CLM)'}
	            ]
            },*/
            {
            	id:'CO2',
            	name:'二氧化碳',
            	typeSelect:[
    	            {id:null,name:'全部'},
    	            {id:'CO2',name:'二氧化碳(CO2)'}
    	         ]
            	
            	
            },
            {
            	id:'MRR',
            	name:'微波降水',
            	typeSelect:[
    	            {id:null,name:'全部'},
    	            {id:'MRR',name:'微波降水(MRR)'}
    	         ]
            },
            {
            	id:'VASS',
            	name:'大气廓线',
            	typeSelect:[
    	            {id:null,name:'全部'},
    	            {id:'VASS',name:'大气廓线(VASS)'}
    	         ]
            },
            {
            	id:'SNC',
            	name:'积雪覆盖',
            	typeSelect:[
    	            {id:null,name:'全部'},
    	            {id:'SNC',name:'积雪覆盖(SNC)'}
    	          ]
            },
            {
            	id:'CLM',
            	name:'海面风速',
            	typeSelect:[
    	            {id:null,name:'全部'},
    	            {id:'CLM',name:'海面风速(CLM)'}
    	          ]
            },
            {
                id:'OTHER',
                name:'其他',
                typeSelect: [
                    {id: null, name: '全部'},
                    {id: 'CO2', name: '二氧化碳(CO2)'},
                    {id: 'MRR', name: '微波降水(MRR)'},
                    {id: 'VASS', name: '大气廓线(VASS)'},
                    {id: 'SNC', name: '积雪覆盖(SNC)'},
                    {id: 'CLM', name: '海面风速(CLM)'},
                ]

            },
        ]

    };
    return obj;
}]);


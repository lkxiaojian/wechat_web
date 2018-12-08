document.domain = 'jd.com';
$(function () {
    var ifm = $('<iframe></iframe>');
    var $body = $('body');
    ifm.attr({
        'src': location.href + "?wqnmlgb",
        'width': '100%',
        'height': $(window).height(),
        'scrolling': 'auto',
        'frameborder': '0'
    });
    var sCSS = {
        'width': 126,
        'background': '#fff',
        'position': 'fixed',
        'right': '38px',
        'top': '168px',
        'z-index': 100000,
        'padding': '16px 20px',
        'border': '1px solid #000',
        'border-radius':'8px'
    };
    ifm.load(function () {
        var ifmdoc = $(ifm[0].contentDocument || ifm[0].contentWindow.document);
        var divcenter = $("<div><img width=\'\' /><div class=\'advttitle\'>聚宝云大数据</div><span class=\'closebtn\'>&times;</span><dl><dt>准实时</dt><dd>分钟甚至十秒级的准实时端到端分析能力</dd><dt>无风险</dt><dd>无需升级现有系统<br>无可靠性及性能风险</dd><dt>业务级分析</dt><dd>从总体到每个行业交易环节的业务级分析</dd><dt>可追溯</dt><dd>高性能线速存储并可回溯追踪各业务交易</dd></dl></div>").css(sCSS);
        divcenter.find('dt').css({
            'text-align': 'center',
            'font-size': '14px',
            'font-weight': 'bold',
            'color': '#08c',
            'margin-bottom': '6px',
            'font-family':'楷体'
        });
        divcenter.find('dd').css({
            'border': '1px dashed #000',
            'border-radius': '5px',
            'padding': '8px',
            'margin-bottom': '6px',
            'font-family':'微软雅黑'
        });
        divcenter.find('.closebtn').css({
            'position': 'absolute',
            'right': '8px',
            'top': '8px',
            'font-size':18,
            'font-family':'宋体',
            'cursor':'pointer'
        })
            .click(function(){
                $(this).parent().hide();
                ifmdoc.find('.showadvt').show();
            });
        divcenter.find('.advttitle').css({
            'font-size': '19px',
            'text-align': 'center',
            'line-height': '50px',
            'font-weight':'bold',
            'font-family':'隶书',
            'color':'#c41b22'
        });
        var btn=$('<btn class="showadvt">展开广告</btn>')
            .css({
                'position': 'fixed',
                'right': '60px',
                'bottom': '20px',
                'display':'none',
                'z-index':'100000',
                'border':'1px solid #000',
                'background':'#fff'
            })
            .click(function(){
                divcenter.show();
                $(this).hide();
            });
        ifmdoc.find('body').append(divcenter,btn)
    });
    $body.append(ifm)
});
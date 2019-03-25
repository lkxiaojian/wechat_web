var serializeJson = function(serializeObj, formId) {
    var array = $("#" + formId).serializeArray();
    $(array).each(
        function() {
            if (serializeObj[this.name]) {
                if ($.isArray(serializeObj[this.name])) {
                    serializeObj[this.name].push(this.value);
                } else {
                    serializeObj[this.name] = [ serializeObj[this.name],
                        this.value ];
                }
            } else {
                serializeObj[this.name] = this.value;
            }
        });
    return serializeObj;
}


//打印表格
var idTmr;

function getExplorer() {
    var explorer = window.navigator.userAgent;
    //ie
    if(explorer.indexOf("MSIE") >= 0) {
        return 'ie';
    }
    //firefox
    else if(explorer.indexOf("Firefox") >= 0) {
        return 'Firefox';
    }
    //Chrome
    else if(explorer.indexOf("Chrome") >= 0) {
        return 'Chrome';
    }
    //Opera
    else if(explorer.indexOf("Opera") >= 0) {
        return 'Opera';
    }
    //Safari
    else if(explorer.indexOf("Safari") >= 0) {
        return 'Safari';
    }
}

function method5(tableid) {
    if(getExplorer() == 'ie') {
        var curTbl = document.getElementById(tableid);
        var oXL = new ActiveXObject("Excel.Application");
        var oWB = oXL.Workbooks.Add();
        var xlsheet = oWB.Worksheets(1);
        var sel = document.body.createTextRange();
        sel.moveToElementText(curTbl);
        sel.select();
        sel.execCommand("Copy");
        xlsheet.Paste();
        oXL.Visible = true;

        try {
            var fname = oXL.Application.GetSaveAsFilename("Excel.xls",
                "Excel Spreadsheets (*.xls), *.xls");
        } catch(e) {
            print("Nested catch caught " + e);
        } finally {
            oWB.SaveAs(fname);
            oWB.Close(savechanges = false);
            oXL.Quit();
            oXL = null;
            idTmr = window.setInterval("Cleanup();", 1);
        }

    } else {
        tableToExcel(tableid)
    }
}

function Cleanup() {
    window.clearInterval(idTmr);
    CollectGarbage();
}
var tableToExcel = (function() {
    var uri = 'data:application/vnd.ms-excel;base64,',
        template = '<html><head><meta charset="UTF-8"></head><body><table  border="1">{table}</table></body></html>',
        base64 = function(
            s) {
            return window.btoa(unescape(encodeURIComponent(s)))
        },
        format = function(s, c) {
            return s.replace(/{(\w+)}/g, function(m, p) {
                return c[p];
            })
        }
    return function(table, name) {
        if(!table.nodeType)
            table = document.getElementById(table)
        var ctx = {
            worksheet: name || 'Worksheet',
            table: table.innerHTML
        }
        window.location.href = uri + base64(format(template, ctx))
    }
})();

var tablesToExcel = (function() {
    var uri = 'data:application/vnd.ms-excel;base64,'
        , tmplWorkbookXML = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">'
        + '<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Author>Axel Richter</Author><Created>{created}</Created></DocumentProperties>'
        + '<Styles>'
        + '<Style ss:ID="Currency"><NumberFormat ss:Format="Currency"></NumberFormat></Style>'
        + '<Style ss:ID="Date"><NumberFormat ss:Format="Medium Date"></NumberFormat></Style>'
        + '</Styles>'
        + '{worksheets}</Workbook>'
        , tmplWorksheetXML = '<Worksheet ss:Name="{nameWS}"><Table>{rows}</Table></Worksheet>'
        , tmplCellXML = '<Cell{attributeStyleID}{attributeFormula}><Data ss:Type="{nameType}">{data}</Data></Cell>'
        , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
    return function(tables, wsnames, wbname, appname) {
        debugger
        var ctx = "";
        var workbookXML = "";
        var worksheetsXML = "";
        var rowsXML = "";

        for (var i = 0; i < tables.length; i++) {
            if (!tables[i].nodeType) tables[i] = document.getElementById(tables[i]);

//              控制要导出的行数
            for (var j = 0; j < tables[i].rows.length; j++) {
                rowsXML += '<Row>';

//                    控制导出的列数（在本例中，最后一列为button,导出的文件会出错，所以导出到倒数第二列
                for (var k = 0; k < tables[i].rows[j].cells.length-1; k++) {
                    var dataType = tables[i].rows[j].cells[k].getAttribute("data-type");
                    var dataStyle = tables[i].rows[j].cells[k].getAttribute("data-style");
                    var dataValue = tables[i].rows[j].cells[k].getAttribute("data-value");
                    dataValue = (dataValue)?dataValue:tables[i].rows[j].cells[k].innerHTML;
                    var dataFormula = tables[i].rows[j].cells[k].getAttribute("data-formula");
                    dataFormula = (dataFormula)?dataFormula:(appname=='Calc' && dataType=='DateTime')?dataValue:null;
                    ctx = {  attributeStyleID: (dataStyle=='Currency' || dataStyle=='Date')?' ss:StyleID="'+dataStyle+'"':''
                        , nameType: (dataType=='Number' || dataType=='DateTime' || dataType=='Boolean' || dataType=='Error')?dataType:'String'
                        , data: (dataFormula)?'':dataValue
                        , attributeFormula: (dataFormula)?' ss:Formula="'+dataFormula+'"':''
                    };
                    rowsXML += format(tmplCellXML, ctx);
                }
                rowsXML += '</Row>'
            }
            ctx = {rows: rowsXML, nameWS: wsnames[i] || 'Sheet' + i};
            worksheetsXML += format(tmplWorksheetXML, ctx);
            rowsXML = "";
        }

        ctx = {created: (new Date()).getTime(), worksheets: worksheetsXML};
        workbookXML = format(tmplWorkbookXML, ctx);

//          查看后台的打印输出
        console.log(workbookXML);

        var link = document.createElement("A");
        link.href = uri + base64(workbookXML);
        link.download = wbname || 'Workbook.xls';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
})();
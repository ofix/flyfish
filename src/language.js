// Windows系统需要配置环境变量  NODE_PATH=%USERPROFILE%\AppData\Roaming\npm\node_modules
const Excel = require('exceljs');
let excelData = [];
let dumpExcel = true;
let APP_PATH = "E:\\work_root\\bmc_webui\\app";
let EXCEL_PATH = "E:\\BMC_2020_Q3_Russian.xlsx";
let TXT_PATH = "E:\\BMC_2020_Q3_Russian.txt";
let SHEET_NAME = "GREAT_WALL_BMC_2020_Q3";

scanDir(APP_PATH, '.js', function (filePath, stat) {
    let fs = require('fs');
    //let regexChinese = /[\'\"]?([\u4e00-\u9fa5]+).*[\'\"]?/g;
    let data = fs.readFileSync(filePath, "utf-8");
    let PREFIX_LEN = "E:\\work_root\\bmc_webui\\".length;
    console.info("\r\n+++++++++++++++++++++   " + filePath.substr(PREFIX_LEN) + "   +++++++++++++++++++++\r\n");
    fs.appendFileSync(TXT_PATH, "+++++++++++++++++++++   " + filePath.substr(PREFIX_LEN) + "   +++++++++++++++++++++\r\n", 'utf8');
    // let arrChinese = data.match(regexChinese);
    // if( arrChinese != null){ //匹配到了中文
    //     for(let i=0; i<arrChinese.length; i++){
    //         console.log(i+"  ",arrChinese[i]);
    //         fs.appendFileSync(TXT_PATH,arrChinese[i]+"\r\n", 'utf8');
    //     }
    // }
    let o = { filePath: filePath.substr(PREFIX_LEN), rows: [] };
    let lines = data.split('\n'); //按行读取
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim(); //去除空格
        let chinese = findChineseChars(line);
        for (let j = 0; j < chinese.length; j++) {
            fs.appendFileSync(TXT_PATH, padZero(i) + "  " + chinese[j] + "\r\n", 'utf8');
            // 导出数据到Excel
            if (dumpExcel) {
                o.rows.push([padZero(i), chinese[j]]);
            }
        }
    }
    if (dumpExcel) {
        console.log(o);
        excelData.push(o);
    }
});

if (dumpExcel) {
    exportDataToExcel(EXCEL_PATH, excelData);
    console.log("导出Excel文件成功! ", EXCEL_PATH);
}

/////////////////////////// 帮助函数 ///////////////////////////////////

//遍历文件夹
function scanDir(dirPath, suffix, callback) {
    let fs = require('fs'),
        path = require('path');
    let files = fs.readdirSync(dirPath);
    for (let i = 0; i < files.length; i++) {
        let filePath = path.join(dirPath, files[i]);
        let stat = fs.statSync(filePath);
        let ext = path.extname(filePath);
        if (stat.isFile()) {
            if (suffix.indexOf(ext) != -1) {
                callback(filePath, stat);
            }
        } else if (stat.isDirectory()) {
            scanDir(filePath, suffix, callback);
        }
    }
}
//查找中文字符串
function findChineseChars(line) {
    let chinese = [];
    let strFound = false;
    let posStart = 0;
    let posEnd = 0;
    let matchComma = '';
    for (let i = 0; i < line.length; i++) { //字符串匹配
        if (isQuote(line[i]) && !strFound) {
            strFound = true;
            posStart = i;
            matchComma = line[i];
            i++;
        }
        if (strFound) {
            if (line[i] == '\\') { //碰到转义字符需要+1
                i++;
                continue;
            }
            if (isQuote(line[i]) && line[i] == matchComma) {
                posEnd = i;
                let strChinese = line.substring(posStart + 1, posEnd);
                if (strChinese.match(/[\u4e00-\u9fa5]+/g) != null) {
                    chinese.push(strChinese);
                }
                posEnd = 0;
                posStart = 0;
                matchComma = '';
                strFound = false;
            }
        }
    }
    return chinese;
}
//是否是引号
function isQuote(char) {
    return char == "'" || char == '"';
}
//添加前缀零
function padZero(data) {
    return ('00' + data).slice(-3);
}

//导出数据到Excel文件
function exportDataToExcel(filePath, data) {
    const workbook = new Excel.Workbook();
    workbook.creator = 'ofix';
    workbook.lastModifiedBy = 'ofix';
    workbook.created = new Date(2020, 8, 6);
    workbook.modified = new Date();
    workbook.lastPrinted = new Date(2020, 8, 6);
    const sheet = workbook.addWorksheet(SHEET_NAME);
    sheet.views = [
        { state: 'frozen', xSplit: 0, ySplit: 1, topLeftCell: 'A2', activeCell: 'C3' }
    ];
    // sheet.properties.defaultRowHeight = 24;
    // header::columns
    sheet.columns = [
        { header: '代码行号', key: 'lineno', width: 16 },
        { header: '中文', key: 'chinese', width: 62 },
        { header: '俄文', key: 'russian', width: 62 }
    ];
    sheet.getCell('A1').alignment = {horizontal:'center'};
    //添加数据
    let line_no = 2;
    for (let i = 0; i < data.length; i++) {
        if (data[i].rows.length == 0) {
            continue;
        }
        //合并单元格并设置样式
        sheet.mergeCells('A' + line_no + ":C" + line_no);
        sheet.getCell('A' + line_no).alignment = { horizontal: 'left', vertical: 'middle' };
        // sheet.getCell('A' + line_no).border = {
        //     top: { style: 'thin' },
        //     left: { style: 'thin' },
        //     bottom: { style: 'thin' },
        //     right: { style: 'thin' }
        // };
        //添加文件名
        sheet.insertRow(line_no, [data[i].filePath]);
        sheet.addConditionalFormatting({
            ref: 'A' + line_no + ':C' + line_no,
            rules: [
                {
                    type: 'expression',
                    formulae: ['true'],
                    style: {
                        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFDDDDDD' } }
                    },
                }
            ]
        });
        sheet.getCell('A' + line_no).font = {
            name: 'Arial',
            family: 2,
            // size: 16,
            bold: true
        };
        //添加数据
        for (let j = 0; j < data[i].rows.length; j++) {
            line_no++;
            sheet.insertRow(line_no, [data[i].rows[j][0], data[i].rows[j][1]]);
            sheet.getCell('A' + line_no).alignment = { horizontal: 'center' };
        }
        line_no++;
    }

    //格式化表头
    sheet.addConditionalFormatting({
        ref: 'A1:C1',
        rules: [
            {
                type: 'expression',
                formulae: ['true'],
                style: {
                    fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFCDCCFE' } }
                },
            }
        ]
    });
    //格式化每行的高度
    for (let i = 0; i < line_no; i++) {
        const row = sheet.getRow(i);
        row.height = 20;
    }
    //上下居中
    sheet.addConditionalFormatting({
        ref: 'A1:C' + line_no,
        rules: [
            {
                type: 'expression',
                formulae: ['true'],
                style: {
                    alignment: { vertical: 'middle' }
                },
            }
        ]
    });
    //写入文件
    workbook.xlsx.writeFile(filePath);
}

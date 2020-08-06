const Excel = require('exceljs');
// 需要配置环境变量  NODE_PATH=%USERPROFILE%\AppData\Roaming\npm\node_modules
//nodejs 遍历文件
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

function findChineseChars(line) {
    let chinese = [];
    let strFound = false;
    let posStart = 0;
    let posEnd = 0;
    let matchComma = '';
    for (let i = 0; i < line.length; i++) { //字符串匹配
        if (isComma(line[i]) && !strFound) {
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
            if (isComma(line[i]) && line[i] == matchComma) {
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

function isComma(char) {
    return char == "'" || char == '"';
}

function padZero(data) {
    return ('00' + data).slice(-3);
}

function dumpDataToExcel(filePath, data) {
    const workbook = new Excel.Workbook();
    workbook.creator = 'ofix';
    workbook.lastModifiedBy = 'ofix';
    workbook.created = new Date(2020, 8, 6);
    workbook.modified = new Date();
    workbook.lastPrinted = new Date(2020, 8, 6);
    const sheet = workbook.addWorksheet('BMC文字翻译');
    // header::columns
    sheet.columns = [
        { header: '行号', key: 'lineno', width: 20 },
        { header: '中文', key: 'chinese', width: 62 },
        { header: '俄文', key: 'russian', width: 42 }
    ];
    //添加数据
    let line_no = 2;
    for (let i = 0; i < data.length; i++) {
        if (data[i].rows.length == 0) {
            continue;
        }
        //合并单元格
        sheet.mergeCells('A' + line_no + "C" + line_no);
        //格式化颜色
        //添加文件名
        sheet.insertRow(line_no, [data[i].filePath]);
        //添加数据
        for (let j = 0; j < data[i].rows.length; j++) {
            line_no++;
            sheet.insertRow(line_no, [data[i].rows[j][0], data[i].rows[j][1]]);
        }
        line_no++;
    }
    //写入文件
    workbook.xlsx.writeFile(filePath);
}

let excelData = [];
let exportExcel = true;
let excelPath = "D:\\work_root\\bmc\\translate.xlsx";

scanDir("D:\\work_root\\bmc\\app", '.js', function (filePath, stat) {
    let fs = require('fs');
    let regexChinese = /[\'\"]?([\u4e00-\u9fa5]+).*[\'\"]?/g;
    let chineseFilePath = "D:\\work_root\\bmc\\translate.txt";
    let data = fs.readFileSync(filePath, "utf-8");
    // console.log("++++++++++++++++++   " + filePath + "   +++++++++++++++++++++\r\n");
    fs.appendFileSync(chineseFilePath, "++++++++++++++++++   " + filePath + "   +++++++++++++++++++++\r\n", 'utf8');
    // let arrChinese = data.match(regexChinese);
    // if( arrChinese != null){ //匹配到了中文
    //     for(let i=0; i<arrChinese.length; i++){
    //         console.log(i+"  ",arrChinese[i]);
    //         fs.appendFileSync(chineseFilePath,arrChinese[i]+"\r\n", 'utf8');
    //     }
    // }
    let o = { filePath: filePath, rows: [] };
    let lines = data.split('\n'); //按行读取
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim(); //去除空格
        let chinese = findChineseChars(line);
        for (let j = 0; j < chinese.length; j++) {
            fs.appendFileSync(chineseFilePath, padZero(i) + "  " + chinese[j] + "\r\n", 'utf8');
            //console.log(padZero(i) + '  ' + chinese[j]);
            // 导出数据到Excel
            if (exportExcel) {
                o.rows.push([padZero(i), chinese[j]]);
            }
        }
    }
    if (exportExcel) {
        excelData.push(o);
    }
});

if (exportExcel) {
    dumpDataToExcel(excelPath, excelData);
    console.log("导出Excel文件成功! ", excelPath);
}
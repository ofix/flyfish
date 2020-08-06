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
        if(isComma(line[i]) && !strFound){
            strFound = true;
            posStart = i;
            matchComma = line[i];
            i++;
        }
        if(strFound){
            if(line[i] == '\\'){ //碰到转义字符需要+1
                i++;
                continue;
            }
            if(isComma(line[i]) && line[i] == matchComma){
                posEnd = i;
                let strChinese = line.substring(posStart+1,posEnd);
                if(strChinese.match(/[\u4e00-\u9fa5]+/g) != null){
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

function isComma(char){
     return char == "'" || char== '"';
}

function padZero(data) {
    return ('00' + data).slice(-3);
}


scanDir("E:\\work_root\\bmc_webui\\app", '.js', function (filePath, stat) {
    let fs = require('fs');
    let regexChinese = /[\'\"]?([\u4e00-\u9fa5]+).*[\'\"]?/g;
    let chineseFilePath = "E:\\work_root\\translate.txt";
    fs.readFile(filePath, "utf-8", function (error, data) {
        console.log("++++++++++++++++++   " + filePath + "   +++++++++++++++++++++\r\n");
        fs.appendFileSync(chineseFilePath,"++++++++++++++++++   " + filePath + "   +++++++++++++++++++++\r\n", 'utf8');
        // let arrChinese = data.match(regexChinese);
        // if( arrChinese != null){ //匹配到了中文
        //     for(let i=0; i<arrChinese.length; i++){
        //         console.log(i+"  ",arrChinese[i]);
        //         fs.appendFileSync(chineseFilePath,arrChinese[i]+"\r\n", 'utf8');
        //     }
        // }
        let lines = data.split('\n'); //按行读取
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim(); //去除空格
            let chinese = findChineseChars(line);
            for(let j=0; j<chinese.length; j++){
                fs.appendFileSync(chineseFilePath, padZero(i) + "  " + chinese[j] + "\r\n", 'utf8');
                console.log(padZero(i)+ '  ' +chinese[j]);
            }
        }
    });
});
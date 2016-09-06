var fs = require("fs");
var argv = require('optimist').argv;
var pathNode = require('path');

var helpMsg = '\nusage: \n    node replaceJSPVersion.js --sourceMap="./source-map.json" --outputDir="./output" --pathPrefix="//static.chimeroi.com" --input="../jsp/"\n\n' +
    "参数说明:\n" +
    "    sourceMap: webpack生成的sourceMap文件，该文件有对应模块的css/js路径\n" +
    "    outputDir: jsp的输出目录\n" +
    "    pathPrefix: js/css的路径前缀\n" +
    "    input: 输入，可以是一个jsp文件或目录\n"


if(argv.h || argv.help){
    console.log(helpMsg);
    return;
}

var pathPrefix = argv.pathPrefix || "",
    sourceMap = argv.sourceMap || "../source-map-test.json",
    outputDir = argv.outputDir || "jsp-version-output-test",
    input = argv.input || "../jsp";

try{
    var sourceMap = require(sourceMap);
}catch(e){
    console.log("Can not read file: " + sourceMap); 
    console.log(e);
    return;
}

var libMap = {
    "jssor.slider.mini.js": "/static/js/jssor.slider.mini.js",
    "jquery-1.11.3.min.js": "/static/js/jquery-1.11.3.min.js",
    "mustache.min.js": "/static/js/mustache.min.js",
    "html5media.min.js":"/static/js/html5media.min.js"
}


//替换一个文件
function doReplaceFile(inputFilePath, outputFilePath){
    var content = fs.readFileSync(inputFilePath, "utf8");
    var out = fs.createWriteStream(outputFilePath, { encoding: "utf8" });
    content.split(/\r?\n/).forEach(function (line) {    
        line = line.trim();
        if(!line.length) return;
        if(line.indexOf("static-lib") >= 0){
            for(var key in libMap){
                if(line.indexOf(key) >= 0){
                    line = '<script src="' + libMap[key] + '"></script>';
                }
            }
        }
        if(line.match(/fedren.com/)){
            var patterns = line.match(/\/([^\/]+)\.(js|css)/);
            var module = patterns[1];
            var fileExtend = patterns[2];
            try{
                var path = pathPrefix + sourceMap[module][fileExtend];
            }catch(e){
                console.log("替换文件" + inputFilePath + "发生错误，当行是：" + line);
                throw e; 
            }
            if(fileExtend === "js"){
                line = '<script src="' + path + '"></script>';
            } else if(fileExtend === "css"){
                line = '<link rel="stylesheet" type="text/css" href="' + path + '"></link>';
            }
        }
        out.write(line + "\n");
    });
    out.end();
}

function dirExists(dirPath){
    try{
        return fs.statSync(dirPath).isDirectory();
    } catch (err) {
        return false;
    }
}

function replaceFile(file, input){
    if(file.match(/\.jsp$/)){
        var outputPath = outputDir + "/" + file.substring(input.length);
        var reg = new RegExp("[^\\" + pathNode.sep + "]+\\.jsp");
        var newDir = outputDir + "/" + file.replace(reg, "").substring(input.length);
        if(!dirExists(newDir)){
            fs.mkdirSync(newDir);
        }
        try{
            doReplaceFile(file, outputPath);
            console.log("processed: " + file);
        }catch(e){
            console.error("file: " + file + " process failed");
            console.error(e);
        }
    }
    else{
        console.log("not jsp file, ignore: " + file);
    }
}

function replaceAllFile(input){
    if(fs.lstatSync(input).isDirectory()){
        var recursive = require('recursive-readdir');
        recursive(input, function (err, files) {
            for(var i = 0; i < files.length; i++){
                replaceFile(files[i], input);
            }
        });
    }
    else {
        replaceFile(input);
    }
}

replaceAllFile(input);

//console.log(sourceMap);
/*
fs.readFile('./source-map.json', function(err, data){
    if(err){
        throw err;
    }
    console.log(data);
});
*/

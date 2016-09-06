var chokidar = require('chokidar'),
    argv = require('optimist').argv,
    isWindows = /^win/.test(process.platform);

var fxName = "", //for windows using secureFX
    serverName = "";

var fork = require('child_process').fork;
var reloadServer = fork(__dirname + '/reload-server.js');

reloadServer.on('message', function(response) {
    console.log("message from reload server: " + response);
});

var watchDir = "",
    serverDir = "";
    //自动上传jsp到服务器
    if(argv.site){
        watchDirs = ["../site/jsp"];
        serverName = "web@10.4.29.111";
        serverDirs = ["/data/xce/myproject/webapp/WEB-INF/views/jsp/"];
        fxName = "10.4.29.111"; //for windows using secureFX
    }
    else{
        console.log("Unknown project type, type should be 'site', like --site");
        return;
    }

var pscpPath = argv.pscpPath || "sfxcl";

var watchers = [];
for(var i = 0; i < watchDirs.length; i++){
    var watchDir = watchDirs[i],
        serverDir = serverDirs[i];

    // Initialize watcher.
    var watcher = chokidar.watch(watchDir, {
      ignored: /[\/\\]\./,
      persistent: true
    });
    
    watchers.push(watcher);
    // Something to use when events are received.
    var log = console.log.bind(console);
    
    var exec = require('child_process').exec;
    var execSync = require('child_process').execSync;
    
    watchers[i]
      //监听保存事件，然后上传文件和刷新浏览器
      .on('change', function(path){
            var subPath = path.substring(watchDir.length);
            var subDir = "";
            if(subPath.lastIndexOf("/") > 0){
                subDir = subPath.substring(0, subPath.lastIndexOf("/")) + "/";
            }
            var command = "";
            if(!isWindows) {
                command += "scp " + path + " " + (serverName + ":" + serverDir) + "/" + subDir;
            } else {
                command = "sfxcl " + path + " /S " + "\"" + fxName + "\" " + serverDir + "/" + subDir;
            }
            log(command);
            //执行上传命令
            execSync(command);
            //向本地socket服务发送刷新页面的msg
            reloadServer.send({msgType: 'reload'});
      });
    
    console.log("watcher启动, 监听目录：" + watchDir + " 服务器目录：" + serverName + ":" + serverDir);
}

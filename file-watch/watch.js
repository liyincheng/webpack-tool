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

    if(argv.site){
        watchDirs = ["../site/jsp"];
        serverName = "xce@10.4.29.111";
        serverDirs = ["/data/xce/homethy_agent_site_frontend/webapp/WEB-INF/views/template/grand-new/web/jsp"];
        fxName = "10.4.29.111"; //for windows using secureFX
    }
    else if(argv.sitetest){
        watchDirs = ["../site/jsp"];
        serverName = "web@10.4.24.116";
        serverDirs = ["/data/web/homethy_agent_site_web_test/webapp/WEB-INF/views/template/grand-new/web/jsp/"];
        fxName = "10.4.24.116";
    }
    else if(argv.card){
        watchDirs = ["../card-site/jsp"];
        serverName = "web@10.4.29.111";
        serverDirs = ["/data/xce/homethy_agent_site_frontend/webapp/WEB-INF/views/template/grand-new/web/jsp","/data/xce/homethy_agent_site_frontend/webapp/WEB-INF/views/"];
        fxName = "10.4.29.111";
    }
    else if(argv.ggsite){
        watchDirs = ["../gg-site/jsp"];
        serverName = "xce@10.4.29.111";
        serverDirs = ["/data/xce/homethy_agent_site_frontend/webapp/WEB-INF/views/template/michelle"];
        fxName = "10.4.29.111";
    }
    else if(argv.newhome){
        watchDirs = ["../newhome/jsp"];
        serverName = "web@10.4.24.116";
        serverDirs = ["/data/web/bing.li6/newhome/homethy-newhome-web-1.0-SNAPSHOT/WEB-INF/views/newhome"];
        fxName = "10.4.24.116";
    }
    else if(argv.home){
        watchDirs = ["../home/jsp"];
        serverName = "xce@10.4.29.111";
        serverDirs = ["/data/xce/homethy_official_web/webapp/WEB-INF/views/home"];
        fxName = "10.4.29.111";
    }
    else if(argv.forgot){
        watchDirs = ["../small-project/forgot-pwd/jsp"];
        serverName = "xce@10.4.29.111";
        serverDirs = ["/data/xce/homethy_agent_site_frontend/webapp/WEB-INF/views/home"];
        fxName = "10.4.29.111"; //window securefx name
    }
    else if(argv.crm){
        watchDirs = ["../crm/src/views"];
        serverName = "web@10.4.24.116";
        serverDirs = ["homethy_crm_web_stage/homethy-crm-web-1.0-SNAPSHOT/WEB-INF/views"];
        fxName = "10.4.24.116";
    }
    else if(argv.crm138){
        watchDirs = ["../crm/src/views"];
        serverName = "web@10.4.22.138";
        serverDirs = ["/data/web/homethy/homethy-crm-web/WEB-INF/views"];
        fxName = "10.4.22.138";
    }
    else if(argv.payment){
        watchDirs = ["../payment-admin/jsp"];
        serverName = "web@10.4.24.116";
        serverDirs = ["/data/web/homethy_admin_web/homethy-admin-web-1.0-SNAPSHOT/WEB-INF/views/payment"];
        fxName = "10.4.24.116";
    }
    else if(argv.crmhtml){
        watchDirs = ["../crm/src/html"];
        serverName = "web@10.4.24.116";
        serverDirs = ["homethy_crm_web_stage/homethy-crm-web-1.0-SNAPSHOT/WEB-INF/static/html"];
        fxName = "10.4.24.116";
    }
    else if(argv.crm136){
        watchDirs = ["../crm/src/views"];
        serverName = "web@10.4.24.116";
        serverDirs = ["homethy_crm_web_dev2/homethy-crm-web-1.0-SNAPSHOT/WEB-INF/views"];
        fxName = "10.4.24.116";
    }
    else if(argv.crmtest){
        watchDirs = ["../crm/src/views"];
        serverName = "web@10.4.24.116";
        serverDirs = ["homethy_crm_web_test/webapp/WEB-INF/views"];
        fxName = "10.4.24.116";
    }
    else if(argv.crmCustomize){
        watchDirs = ["../crmCustomize/src/views"];
        serverName = "xce@10.4.29.111";
        serverDirs = ["customized_crm_web/crm_web/webapp/WEB-INF/views"];
        fxName = "10.4.29.111";
    }
    else{
        console.log("Unknown project type, type should be site, newhome, home, crm or payment, like --site");
        return;
    }

//var watchDir = argv.watchDir || '../newhome/jsp';
//var watchDir = argv.watchDir || "../payment-admin/jsp";//'../site/jsp',//'../newhome/jsp',

//var serverDir = argv.serverDir || 'web@10.4.24.116:/data/web/bing.li6/newhome/homethy-newhome-web-1.0-SNAPSHOT/WEB-INF/views/newhome';
//var serverDir = argv.serverDir || "web@10.4.35.29:/data/web/crm_zhanzhan.qi/homethy-admin-web-1.0-SNAPSHOT/WEB-INF/views/payment"//'web@10.4.24.116:/data/web/bo.li7/frontend/webapp/WEB-INF/views/template/grand-new/web/jsp',//'web@10.4.24.116:/data/web/bing.li6/newhome/homethy-newhome-web-1.0-SNAPSHOT/WEB-INF/views/newhome',
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
    //  .on('add', path => log(`File ${path} has been added`))
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

            execSync(command);
            if(argv.card){
                if(!isWindows) {
                    command += "scp " + path + " " + serverDirs[1] + "/" + subDir;
                } else {
                    command = "sfxcl.exe " + path + " /S " + "\"" + fxName + "\" " + serverDirs[1] + "/" + subDir;
                }
                log(command);
                execSync(command);
                console.log(serverDirs[2]);
                if(path.indexOf("gatheragentinfo") >= 0){
                    if(!isWindows) {
                        command += "scp " + path + " " + serverDirs[2] + "/" + subDir;
                    } else {
                        command = "sfxcl.exe " + path + " /S " + "\"" + fxName + "\" " + serverDirs[2] + "/" + subDir;
                    }
                    log(command);
                    execSync(command);
                }
            }

            //setTimeout(function(){
                reloadServer.send({msgType: 'reload'});
            //}, 500);
      });
    
    console.log("watcher启动, 监听目录：" + watchDir + " 服务器目录：" + serverName + ":" + serverDir);
}

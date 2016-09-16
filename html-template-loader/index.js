module.exports = function(source, map) {
    this.cacheable();

    //console.log("--------------html template loader-----------");
    //console.log(source);
    var tpl = "__only__: ";


    var prepareScript = "",
        meetPreScript = false,
        generateScript = "",
        meetGenerateScript = false;

    var onlyOneTpl = true;

    source.split(/\r?\n/).forEach(function(line){
        line = line.trim();
        if(!line.length){
            return;
        }
        var regArray = line.match(/<!--%([\w\d$]+)%-->/);
        //match a new template variable
        if(regArray){
            variable = regArray[1];
            tpl += "'',\n" + variable + ":";
            onlyOneTpl = false;
        //prepare script start
        } else if(/<script\s+generate/.test(line)){
            prepareScript += line;
            meetPreScript = true;
            prepareScript = prepareScript.replace(/<script\s+generate[^>]*>/, "");
            if(line.indexOf("</script>") >= 0){
                meetPreScript = false;
                prepareScript = prepareScript.replace("</script>", "");
            }
        //prepare script end
        } else if(meetPreScript && line.indexOf("</script>") >= 0){
            prepareScript += line;
            meetPreScript = false;
            prepareScript = prepareScript.replace("</script>", "");
        } else if(meetPreScript){
            prepareScript += line;
        } else if(line.indexOf("<script>") >= 0){
            meetGenerateScript = true;
            //generateScript += line
            line = line.replace("<script>", "");
            if(line.indexOf("</script>") >= 0){
                line = line.replace("</script>", "");
                meetGenerateScript = false;
            }
            if(line.length){
                tpl += line + "+";
            }
        } else if(meetGenerateScript && line.indexOf("</script>") >= 0){
            meetGenerateScript = false;
            line = line.replace("</script>", "");
            if(line.length){
                tpl += line + "\n+";
            }
        } else if(meetGenerateScript){
            tpl += line + "+\n";
        } else {
            tpl += "'" + line.replace(/'/g, "\\'") + "'+\n";
        }
    });

    tpl += "''";
    if(onlyOneTpl){
        tpl = tpl.replace("__only__:", "");
        tpl = "var tpl = " + tpl;
    } else {
        tpl = tpl.replace("__only__: '',", "");
        tpl = "var tpl = {" + tpl + "}";
    }
    //var html = eval(tpl.email);
    //console.log(JSON.stringify(html));

    map = {};
    source = "";
    //this.callback(null, source, {hello: "world"}); 
    var abc = 5;
    var exports = prepareScript + "\nmodule.exports = tpl";
    //console.log("-------------------------exports------------------------");
    //console.log(exports);
    //console.log("------------------------tpl-----------------------");
    //console.log(tpl);
    return prepareScript + "\n" + tpl + "\nmodule.exports = tpl";

}

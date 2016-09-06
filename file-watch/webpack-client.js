/*自定义reload window*/
//将这段代码拷到node_modules/webpack-dev-server/client/index.js的最后面
var reload = new SockJS("http://localhost:9999/reload");
reload.onopen = function(){
    console.log("customer reload start.......");
}

reload.onclose = function(){
    console.log("customer reload close.......");
}

reload.onmessage = function(_msg){
    var msg = JSON.parse(_msg.data);
    if(msg.type === "reload"){
        console.log("customer reload window now");
        window.location.reload();
    }
}

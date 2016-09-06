var allConnections = [];

function recieveFun(msg) {
    //process.send('Hello ' + input);
    if(msg.msgType === "reload"){
        for(var i = 0; i < allConnections.length; i++){
            allConnections[i].write(JSON.stringify({type: "reload"}));
        }
    }
}

process.on('message', function(msg) {
    recieveFun(msg);
});


var http = require('http');
var sockjs = require('sockjs');

var socket = sockjs.createServer();
socket.on('connection', function(conn) {
    allConnections.push(conn);
    console.log("connect");
    conn.on('data', function(message) {
        conn.write(message);
    });
    conn.on('close', function() {
        allConnections.splice(allConnections.indexOf(conn), 1);
    });
});

var server = http.createServer();
socket.installHandlers(server, {prefix:'/reload'});
server.listen(9999, '127.0.0.1');

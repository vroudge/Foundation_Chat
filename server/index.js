/**
 * Created by Psykopatik on 31/10/2015.
 */

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var globals = {
    config:{
        runningPort:1337
    }
};

app.get('/', function(req, res){
    res.sendfile('index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
});

http.listen(globals.config.runningPort, function(){
    console.log('listening on *:'+globals.config.runningPort);
});
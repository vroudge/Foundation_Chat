/**
 * Created by Psykopatik on 31/10/2015.
 */

//requires
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//globals holder
var globals = {
    config:{
        runningPort:1337
    },
    connectedClients : [],
    roomList:[{name:"lobby", messageList:""}]
};

//io wrapper for all events
io.on('connection', function(socket){

    console.log('a user connected with id='+socket.id);

    //send unique ID to client immediately
    socket.send({"event:registeredId":socket.id});

    socket.room = "lobby";
    socket.join("Lobby");

    //and add him to the client list
    globals.connectedClients.push(toolBox.createUser(socket.id));

    //listener for all client messages
    socket.on('message', function(eventName, data){
        switch(eventName){
            case "event:queryingName":
                if(!toolBox.isNameIsAlreadyTaken(data.name)){
                    var currentClientIndex = toolBox.getIndexOfClientFromConnectedListById(socket.id);
                    globals.connectedClients[currentClientIndex].name = data.name;

                    socket.broadcast.send('event:updateUserList', {list:toolBox.createSendableClientList()});
                    socket.send('event:updateUserList', {list:toolBox.createSendableClientList()});
                    socket.send("event:authenticated", {isAuth:true, name:data.name, room:socket.room});
                }
                break;
            case "event:chatMessage":
                io.sockets["in"](socket.room).emit('event:chatMessage', data.user, data);
                console.log(socket.room);
                break;
            case "event:joinRoom":
                socket.join(data.roomName);
                socket.room = data.roomName;
                socket.send("event:joinRoom", {room:data.roomName});
                break;
            default:
                break;
        }
    });

    //ensure the list of connected clients is kept clean
    socket.on('disconnect', function(){
        console.log("User with Id="+socket.id+" disconnected");
        var i = globals.connectedClients.indexOf(socket);
        globals.connectedClients.splice(i, 1)
    })
});

var toolBox = {

    /**
     * helper for creating client object
     * @param id
     * @returns {{id: string, name: string}}
     */
    createUser:function(id){
        return {
            id:id,
            name:"",
            room:"",
            isAdmin:false
        }
    },
    /**
     * remove IDs from list to somewhat get rid of users spoofing others, only names
     */
    createSendableClientList:function() {
        var sendableList = [];
        globals.connectedClients.forEach(function(elem,index,array){
            sendableList.push(elem.name);
        });
        return sendableList;
    },

    getIndexOfClientFromConnectedListById:function(id){
        var i = globals.connectedClients.length-1;
        while(i>0){
            if(id === globals.connectedClients[i]){
                return i;
            }
            --i;
        }
        return i;
    },

    isNameIsAlreadyTaken:function(name){
        if(globals.connectedClients.length>0){
            var i = globals.connectedClients.length-1;
            while(i>0){
                console.log(name);
                if(globals.connectedClients[i].name === name){
                    return true;
                }
                --i;
            }
            return false;
        }else{
            return false;
        }

    }


};

http.listen(globals.config.runningPort, function(){
    console.log('listening on *:'+globals.config.runningPort);
});




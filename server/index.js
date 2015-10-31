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
    }
};

http.listen(globals.config.runningPort, function(){
    console.log('listening on *:'+globals.config.runningPort);
});


var connectedClients = [],//connected clients
    roomList = []; //room list (captain obvious)

//io wrapper for all events
io.on('connection', function(socket){

    console.log('a user connected with id='+socket.id);

    //send unique ID to client immediately
    socket.send({"event:registeredId":socket.id});

    //and add him to the client list
    connectedClients.push(toolBox.createUser(socket.id));

    //listener for all client messages
    socket.on('message', function(eventName, data){
        switch(eventName){
            case "event:queryingName":
                if(!toolBox.isNameIsAlreadyTaken(data.name)){
                    var currentClientIndex = toolBox.getIndexOfClientFromConnectedListById(socket.id);
                    connectedClients[currentClientIndex].name = data.name;

                    socket.broadcast.send('event:updateUserList', {list:toolBox.createSendableClientList()});
                    socket.send('event:updateUserList', {list:toolBox.createSendableClientList()});
                    socket.send("event:authenticated", {isAuth:true, name:data.name});
                }
                break;
            case "event:chatMessage":

                break;
            default:
                break;
        }
    });

    //ensure the list of connected clients is kept clean
    socket.on('disconnect', function(){
        console.log("User with Id="+socket.id+" disconnected");
        var i = connectedClients.indexOf(socket);
        connectedClients.splice(i, 1)
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
            name:""
        }
    },
    /**
     * remove IDs from list to somewhat get rid of users spoofing others, only names
     */
    createSendableClientList:function() {
        var sendableList = [];
        connectedClients.forEach(function(elem,index,array){
            sendableList.push(elem.name);
        });
        return sendableList;
    },

    getIndexOfClientFromConnectedListById:function(id){
        var i = connectedClients.length-1;
        while(i>0){
            if(id === connectedClients[i]){
                return i;
            }
            --i;
        }
        return i;
    },

    isNameIsAlreadyTaken:function(name){
        if(connectedClients.length>0){
            var i = connectedClients.length-1;
            while(i>0){
                console.log(name);
                if(connectedClients[i].name === name){
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




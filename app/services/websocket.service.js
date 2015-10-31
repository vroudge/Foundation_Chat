/**
 * Created by Psykopatik on 31/10/2015.
 */

(function(){

    "use strict";

    angular
        .module('app')
        .service('websocketService', websocketService);

    function websocketService($rootScope, socketServer, userService) {
        var socket = {};
        var isConnected = false;
        var currentRoom = "";

        /** socket events **/

        socket = io(socketServer.location);

        socket.on('connect', function(){
            isConnected = true; //might be useful at some point (green/red icon)
        });

        socket.on('message', function(message, data){
            switch(message){
                case 'event:updateUserList':
                    console.log(data);
                    break;
                case 'event:authenticated' :
                    console.log(data);
                    $rootScope.$broadcast();
                    break;
                default:
                    break;
            }
        });

        socket.on('disconnect', function(){
            isConnected = false; //might be useful at some point (green/red icon)
        });

        /** methods **/

        this.signUp = function(name, password){
            socket.send("event:queryingName", {name:name, pw: password});
        };

        this.auth = function(name, password){ //todo when database part has been included
            socket.send("event:authName", {name:name, pw: password});
        };

        this.sendChatMessage = function(message){
            socket.send("event:chatMessage", {user:userService.getName(), message:message});
        };

        this.getCurrentRoom = function(){
            return currentRoom;
        };

        this.setRoom = function(roomName){
            socket.send("event:joinRoom", {user:userService.getName(), roomName:roomName});
        };


    }


})();

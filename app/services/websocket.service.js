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

        /** socket events **/

        socket = io(socketServer.location);

        socket.on('connect', function(){
            isConnected = true; //might be useful at some point (green/red icon)
        });

        socket.on('message', function(message, data){
            switch(message){
                case 'event:updateUserList':
                    $rootScope.$broadcast('$update_participant_list',{list:data.list});
                    break;
                case 'event:authenticated' :
                    $rootScope.$broadcast('$user_authenticated',{name:data.name, room:data.room });
                    break;
                case 'event:chatMessage' :
                    $rootScope.$broadcast('$chat_message',{data:data.list});
                    break;
                case "event:joinRoom" :
                    $rootScope.$broadcast('$room_update', {room:data.room});
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

        this.setRoom = function(roomName){
            socket.send("event:joinRoom", {user:userService.getName(), roomName:roomName});
        };


    }


})();

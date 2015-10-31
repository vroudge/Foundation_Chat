/**
 * Created by Psykopatik on 31/10/2015.
 */

(function(){

    "use strict";

    angular
        .module('app')
        .service('websocketService', websocketService);

    function websocketService(socketServer) {
        var socket = io(socketServer.location);

        this.sendChatMessage = function(user, message){
            socket.send({user:user, message:message});
        };

        this.signUp = function(){

        };

        this.getCurrentRoom = function(){

        };

        this.setRoom = function(roomName){

        };
    }


})();

/**
 * Created by Psykopatik on 31/10/2015.
 */


(function() {

    "use strict";

    angular
        .module('app.chat')
        .controller('chatCtrl', chatCtrl);

    function chatCtrl(websocketService){
        var vm = this;
        vm.dataToSend = "";

        vm.sendMessage = sendMessage;

        function sendMessage(message){
            websocketService.sendChatMessage(message);
        }
    }

})();
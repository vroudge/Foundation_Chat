/**
 * Created by Psykopatik on 31/10/2015.
 */


(function() {

    "use strict";

    angular
        .module('app.chat')
        .controller('chatCtrl', chatCtrl);

    function chatCtrl(userService, websocketService){
        var vm = this;

        vm.dataToSend = "";
        vm.displayedUserName = "";

        vm.invalidCommand = false;
        vm.unknownCommand = false;

        vm.sendMessage = sendMessage;

        function sendMessage(){
            parseCommand(vm.dataToSend);
        }

        function parseCommand(inputChatData){
            var plainString = inputChatData,
                splitedString = inputChatData.split(" ");

            if(splitedString.length >3 && plainString[0]==="/"){
                vm.invalidCommand = true;
            }else{
                switch (splitedString[0]){
                    case "/signup":
                        if(splitedString[1] !== "" && splitedString[1] != undefined){
                            websocketService.signUp(splitedString[1], splitedString[2]);
                            vm.invalidCommand = false;
                            vm.dataToSend = ""
                        }else{
                            vm.invalidCommand = true;
                        }
                        break;
                    case "/logout":
                        //todo
                        break;
                    case "/room":
                        if(splitedString[1] == "join"){

                        }else if(splitedString[1] == "create"){

                        }else if(splitedString[1] == "leave"){

                        }else{
                            vm.invalidCommand = true;
                        }
                        break;
                    default:
                        vm.unknownCommand = true;
                        break;
                }
            }

            //websocketService.sendChatMessage

        }
    }

})();
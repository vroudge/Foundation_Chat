/**
 * Created by Psykopatik on 31/10/2015.
 */


(function() {

    "use strict";

    angular
        .module('app.chat')
        .controller('chatCtrl', chatCtrl);

    function chatCtrl($scope, $rootScope, userService, websocketService){
        var vm = this;

        vm.dataToSend = "";
        vm.displayedUserName = "";
        vm.currentRoom = "";

        vm.signedIn = false;
        vm.invalidCommand = false;
        vm.unknownCommand = false;

        vm.participantList = [];
        vm.chatMessages = [];

        vm.sendMessage = sendMessage;

        $rootScope.$on('$user_authenticated', function(e,data){
            vm.signedIn = true; //todo switch in a user factory instead.
            vm.displayedUserName = data.name;
            vm.currentRoom = data.room;

            userService.setName(data.name);
            $rootScope.$apply();
        });

        $rootScope.$on('$update_participant_list', function(e,data){
            vm.participantList = data.list;
            $rootScope.$apply();
        });

        $rootScope.$on('$chat_message', function(e,data){
            vm.chatMessages = data.list;
            $scope.$apply();
        });

        $rootScope.$on('$room_update', function(e,data){
            vm.currentRoom = data.room;
            $scope.$apply();
        });

        function sendMessage(){
            parseCommand(vm, vm.dataToSend);
        }

        function parseCommand(scope, inputChatData){
            var plainString = inputChatData,
                splitedString = inputChatData.split(" ");

            if(plainString[0]==="/" && splitedString.length >3 ){
                scope.invalidCommand = true;
            }else if(plainString[0]==="/"){
                switch (splitedString[0]){
                    case "/signup":
                        if(splitedString[1] !== "" && splitedString[1] != undefined){
                            websocketService.signUp(splitedString[1], splitedString[2]);
                            scope.invalidCommand = false;
                            scope.dataToSend = ""
                        }else{
                            scope.invalidCommand = true;
                        }
                        break;
                    case "/logout":
                        //todo
                        break;
                    case "/room":
                        if(splitedString[1] == "join" ||  splitedString[1] == "create"){
                            websocketService.setRoom(splitedString[2]);
                            scope.dataToSend = ""
                        }else if(splitedString[1] == "leave"){
                            websocketService.setRoom("Lobby");
                            scope.dataToSend = ""
                        }else{
                            scope.invalidCommand = true;
                        }
                        break;
                    default:
                        scope.unknownCommand = true;
                        break;
                }
            }else{
                websocketService.sendChatMessage(plainString);
            }
        }
    }

})();
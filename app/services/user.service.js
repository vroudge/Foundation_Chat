/**
 * Created by Psykopatik on 31/10/2015.
 */

(function() {

    "use strict";

    angular
        .module('app')
        .service('userService', userService);

    function userService() {
        var username = "";

        this.isAuth = function(){
            return !(username == "");
        };

        this.getName = function(){
            return username;
        };

        this.setName = function(checkedName){
            username = checkedName;
        };
    }

})();
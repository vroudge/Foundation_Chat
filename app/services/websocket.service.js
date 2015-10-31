/**
 * Created by Psykopatik on 31/10/2015.
 */


angular
    .module('foundation-chat')
    .service('websocket', websocket);

function websocket() {
    var socket = io();
}
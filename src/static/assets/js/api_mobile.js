var mobile = (function(){
    "use strict";
    
    function send(method, url, data, callback){
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.status !== 200) callback("[" + xhr.status + "]" + xhr.responseText, null);
            else callback(null, JSON.parse(xhr.responseText));
        };
        xhr.open(method, url, true);
        if (!data) xhr.send();
        else{
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(data));
        }
    }
    
    var module = {};

    module.listAllRooms = function(callback){
        send("GET", "/api/allrooms/" , null, callback);
    }

    module.requestRoomConnection = function(roomId, username, callback){
        send("GET", "/api/requestConnection/" + roomId + "/" + username + "/", null, callback);
    }

    module.connectToRoom = function(roomId, playerNum, connectionStr, callback){
        var body = {roomId: roomId, playerNum: playerNum, connectionStr: connectionStr};
        send("POST", "/api/connectToRoom/", body, callback);
    }


    return module;
})();
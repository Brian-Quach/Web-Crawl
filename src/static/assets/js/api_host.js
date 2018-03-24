var host = (function(){
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

    module.createGameRoom = function(roomName, capacity, callback){
        send("POST", "/api/createroom/", {roomName: roomName, capacity: capacity}, callback);
    }

    module.sendConnectionString = function(roomId, connectionStr, callback){
        send("POST", "/api/newpeer/", {roomId: roomId, connectionStr: connectionStr}, callback);
    }

    module.getPlayerConnection = function(roomId, playerNum, callback){
        send("GET", "/api/getConnection/"+roomId+"/"+playerNum+"/", null, callback);
    }

    module.getAllLevels = function(callback){
        send("GET", "/api/allLevels/", null, callback);
    }

    module.getLevel = function(levelId, callback){
        send("GET", "/api/getLevel/"+levelId+"/", null, callback);
    }
    return module;
})();
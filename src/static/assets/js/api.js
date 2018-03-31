var api = (function(){
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
        
    module.getDeviceType = function(callback){
        send("GET", "/api/device/", null, callback);
    }

    module.getCurrentUser = function(){
        //var l = document.cookie.split("username=");
        //if (l.length > 1) return l[1];
        return null;
    }

    module.signIn = function (username, password, callback){
        send("POST", "/api/signIn/", {username: username, password: password}, callback);
    }

    module.signUp = function (username, password, callback){
        send("POST", "/api/signUp/", {username: username, password: password}, callback);
    }
    
    return module;
})();
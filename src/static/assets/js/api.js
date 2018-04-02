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
        var nameEQ =  "username=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    //
    // module.getCurrentUser = function(){
    //     var l = document.cookie.split("username=");
    //     if (l.length > 1) return l[1];
    //     return null;
    // } // TODO: Do this w/ connection string cookies

    module.signIn = function (username, password, callback){
        send("POST", "/api/signIn/", {username: username, password: password}, callback);
    }

    module.signOut = function (callback){
        send("GET", "/api/signout/", null, callback);
    }

    module.signUp = function (username, password, callback){
        send("POST", "/api/signUp/", {username: username, password: password}, callback);
    }

    module.getLevel = function (username, callback){
        send("GET", "/api/getlevel/" + username + "/", null, callback);
    }

    module.giveXp = function (username, experience, callback){
        send("POST", "/api/givexp/", {username: username, experience: experience}, callback);
    }

    return module;
})();
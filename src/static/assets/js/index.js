(function(){
    "use strict";

	var Peer = require('simple-peer');

    function setCookie(cname, cvalue) {
        document.cookie = cname + "=" + cvalue + ";path=/";
    }

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }


	function setupHostPeer(){
        var p = new Peer({
            initiator: true,
            trickle: false
        });

        p.on('error', function (err){
            console.log('error', err);
        });

		return p;
    }

    function setupClientPeer(){
        var p = new Peer({
            initiator: false,
            trickle: false
        });

        p.on('error', function (err){
           console.log('error', err);
        });

        return p;
    }

    function gameRoomSetup(roomName, capacity){

        // Request room ID from server
        host.createGameRoom(roomName, capacity, function(err, res){
            var roomId = res;
            document.getElementById('roomId').innerHTML = roomId;
            var players = [];

            // UNWRAPPED THIS CODE - NOT REALLY SURE HOW TO RUN DYNAMICALLY - TEMP SOLN
            /*
            for (var i=0; i<capacity; i++){
                var curr_i = i;
                var newPlayer = setupHostPeer();
                newPlayer.on('signal', function(data){
                    host.sendConnectionString(roomId, JSON.stringify(data), function(err, res){
                    });
                });
                newPlayer.on('connect', function(){
                    var playernum = curr_i;
                    console.log("Player Connected (%s)", playernum);

                })

                players.push({
                    peer: newPlayer,
                    id: null
                });

                // Receive Data
                newPlayer.on('data', function (data) {
                    alert(data);
                });

                document.getElementById('sendAlert').addEventListener('click', function(){
                    newPlayer.send("Test");
                });
                console.log(curr_i);

            }*/

            if (capacity > 0) {
                var player1 = setupHostPeer();
                player1.on('signal', function(data){
                    host.sendConnectionString(roomId, JSON.stringify(data), function(err, res){
                    });
                });
                player1.on('connect', function(){
                    var playernum = 1;
                    console.log("Player Connected (%s)", playernum);

                })

                players.push({
                    peer: player1,
                    id: null
                });

                // Receive Data
                player1.on('data', function (data) {
                    displayMessage(data);
                });

                document.getElementById('sendAlert').addEventListener('click', function(){
                    player1.send("Test");
                });
            }

            if (capacity > 1) {
                var player2 = setupHostPeer();
                player2.on('signal', function(data){
                    host.sendConnectionString(roomId, JSON.stringify(data), function(err, res){
                    });
                });
                player2.on('connect', function(){
                    var playernum = 2;
                    console.log("Player Connected (%s)", playernum);

                })

                players.push({
                    peer: player2,
                    id: null
                });

                // Receive Data
                player2.on('data', function (data) {
                    displayMessage(data);
                });

                document.getElementById('sendAlert').addEventListener('click', function(){
                    player2.send("Test");
                });
            }

            if (capacity > 2) {
                var player3 = setupHostPeer();
                player3.on('signal', function(data){
                    host.sendConnectionString(roomId, JSON.stringify(data), function(err, res){
                    });
                });
                player3.on('connect', function(){
                    var playernum = 2;
                    console.log("Player Connected (%s)", playernum);

                })

                players.push({
                    peer: player3,
                    id: null
                });

                // Receive Data
                player3.on('data', function (data) {
                    displayMessage(data);
                });

                document.getElementById('sendAlert').addEventListener('click', function(){
                    player3.send("Test");
                });
            }

            if (capacity > 3) {
                var player4 = setupHostPeer();
                player4.on('signal', function(data){
                    host.sendConnectionString(roomId, JSON.stringify(data), function(err, res){
                    });
                });
                player4.on('connect', function(){
                    var playernum = 3;
                    console.log("Player Connected (%s)", playernum);

                })

                players.push({
                    peer: player4,
                    id: null
                });

                // Receive Data
                player4.on('data', function (data) {
                    displayMessage(data);
                });

                document.getElementById('sendAlert').addEventListener('click', function(){
                    player4.send("Test");
                });
            }
            // Caps at 4.


            document.getElementById('checkRoom').addEventListener('click', function () {
                gameRoomConnect(players, roomId);
            });

            document.getElementById('connect').addEventListener('click', function (){
                connectAll(players);
            });
        });
	}

	function gameRoomConnect(players, roomId){
        for (var i=0; i<players.length ; i++){
            if (players[i].id == null){
                host.getPlayerConnection(roomId, i, function(err, res){
                    if (res == ""){
                        return;
                    }
                    setCookie("id_Player"+res.playerNum, res.playerId);
                    setCookie("connectStr_Player"+res.playerNum, res.connectionStr);
                });
            }
        }
    }

    function connectAll(players){
        for (var i=0; i<players.length ; i++){
            if ((players[i].id == null)&& readCookie("connectStr_Player"+i)){
                players[i].id = readCookie("id_Player"+i);
                players[i].peer.signal(readCookie("connectStr_Player"+i));
            }
        }
    }

	function joinRoom(roomId){
        mobile.requestRoomConnection(roomId, function(err, res){
            if (err) {
                console.log(err);
                return;
            }
            var playerNumber = res.playerNumber;
            var connectionStr = res.connectionString;

            var gameRoom = setupClientPeer();

            gameRoom.on('signal', function(data){
                var responseString = JSON.stringify(data);
                mobile.connectToRoom(roomId, playerNumber, responseString, function(err, res){
                    if (err) console.log(err);
                });
            });

            gameRoom.signal(connectionStr);

            gameRoom.on('connect', function(){
                console.log("Player Connected");
            })

            // Receive Data
            gameRoom.on('data', function (data) {
                displayMessage(data);
            });

            document.getElementById('sendAlert').addEventListener('click', function(){
                gameRoom.send("Test");
            });

            // TODO: Connection done. Game stuff below

        });
    }

    function welcomeMessage(userType){
    	var welcome = document.getElementById("title");
		var message = "Hello " + userType + " user!";
        welcome.innerHTML = message;
        welcome.setAttribute("UserType", userType);
    }
    
	function welcomeDeviceType(){
		api.getDeviceType(function(err, device){
			if (err) console.log(err);
		    welcomeMessage(device);
		});
	}

	function displayMessage(msg){
        var newMsg = document.createElement('p');
        newMsg.innerHTML = msg;
        document.getElementById('datastream').appendChild(newMsg);
    }

    window.addEventListener('load', function(){
		welcomeDeviceType();

		document.getElementById('createRoom').addEventListener('click', function () {
            var roomName = "testGame";
            var roomCapacity = 2;
            gameRoomSetup(roomName, roomCapacity);
        });

        document.getElementById('reqRoom').addEventListener('click', function () {
            // TODO: Option to see all rooms and choose one
            var roomId = document.getElementById('roomId').value;
            joinRoom(roomId);
        });



    });
}())



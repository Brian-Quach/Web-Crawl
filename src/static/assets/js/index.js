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

            for (var i=0; i<capacity; i++){
                var newPlayer = setupHostPeer();
                newPlayer.on('signal', function(data){
                    host.sendConnectionString(roomId, JSON.stringify(data), function(err, res){
                    });
                });
                newPlayer.on('connect', function(){
                    console.log("Player Connected");
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
            }

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
                alert(data);
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

    window.addEventListener('load', function(){
		welcomeDeviceType();

		document.getElementById('createRoom').addEventListener('click', function () {
            var roomName = "testGame";
            var roomCapacity = 1;
            gameRoomSetup(roomName, roomCapacity);
        });

        document.getElementById('reqRoom').addEventListener('click', function () {
            // TODO: Option to see all rooms and choose one
            var roomId = document.getElementById('roomId').value;
            joinRoom(roomId);
        });



    });
}())



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

    function checkCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return true;
        }
        return false;
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
                    id: null,
                    connected: false
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
                    id: null,
                    connected: false
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
                    var playernum = 3;
                    console.log("Player Connected (%s)", playernum);

                })

                players.push({
                    peer: player3,
                    id: null,
                    connected: false
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
                    var playernum = 2;
                    console.log("Player Connected (%s)", playernum);

                })

                players.push({
                    peer: player4,
                    id: null,
                    connected: false
                });


                document.getElementById('sendAlert').addEventListener('click', function(){
                    player4.send("Test");
                });
            }
            // Caps at 4.


/*            document.getElementById('checkRoom').addEventListener('click', function () {
                gameRoomConnect(players, roomId);
            });*/

            document.getElementById('connect').addEventListener('click', function (){
                connectAll(players);
            });


            // TODO: Connections set up: Start game stuff below

            startGame(players, roomId);
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

            document.getElementById('sendAlert').addEventListener('click', function(){
                gameRoom.send("Test");
            });

            startController(gameRoom);

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

    function parseLevel(levelStr){
        var level = levelStr.split("");
        return level;
    }

    function startGame(players, roomId ){
        var gameTimer = 0;
        var gameStarted = false;

        // Temp "Level"
        var levelStr = "ABCDAABBDDCCAABDBCABCADBACABBDABBAABCADABCABDABABDCABA!";
        var nextMove;
        var level = parseLevel(levelStr);

        var mainState = {
            preload: function() {
                // This function will be executed at the beginning
                game.load.image('box1', 'assets/img/button1.png');
                game.load.image('box2', 'assets/img/button2.png');
                game.load.image('box3', 'assets/img/button3.png');
                game.load.image('box4', 'assets/img/button4.png');
                game.load.image('connectButton', 'assets/img/connect.png');
            },

            create: function() {
                // This function is called after the preload function
                // Here we set up the game, display sprites, etc.
                game.stage.backgroundColor = '#71c5cf';
                this.connectButton = game.add.button(25, 300, 'connectButton', this.startGame);
            },

            update: function() {
                if ((gameTimer++ == 10)&&(!gameStarted)){
                    gameRoomConnect(players, roomId);
                    gameTimer = 0;
                }

            },

            startGame: function() {
                game.state.start('gState', true, true);
            },
        };

        var gameState = {
            preload: function() {
                // This function will be executed at the beginning
                game.load.image('box1', 'assets/img/button1.png');
                game.load.image('box2', 'assets/img/button2.png');
                game.load.image('box3', 'assets/img/button3.png');
                game.load.image('box4', 'assets/img/button4.png');
            },

            create: function() {
                // This function is called after the preload function
                // Here we set up the game, display sprites, etc.
                game.stage.backgroundColor = '#4bf442';
                for (var i=0; i<players.length; i++){
                    players[i].peer.on('data', function (data) {
                        gameState.buttonPressed(i, data);
                    });
                }

                var firstMove = level.shift();
                gameState.displayNext(firstMove);
                nextMove = firstMove;
            },

            update: function() {


            },

            displayNext: function(next){
                //this.nextMove.destroy();
                switch(next) {
                    case 'A':
                        this.nextColour = game.add.sprite(400, 300, 'box1');
                        nextMove = 'A';
                        break;
                    case 'B':
                        this.nextColour = game.add.sprite(400, 300, 'box2');
                        nextMove = 'B';
                        break;
                    case 'C':
                        this.nextColour = game.add.sprite(400, 300, 'box3');
                        nextMove = 'C';
                        break;
                    case 'D':
                        this.nextColour = game.add.sprite(400, 300, 'box4');
                        nextMove = 'D';
                        break;
                    default:
                        this.nextColour.destroy();
                        gameState.endGame();
                }


            },

            buttonPressed: function(player, button) {
                console.log(button + " sent");
                console.log(nextMove);
                if (button == nextMove){
                    gameState.displayNext(level.shift());
                }
            },

            endGame: function() {
                game.state.start('main', true, true);
            },

        };


        var game = new Phaser.Game(800, 500);

        // Add the 'mainState' and call it 'main'
        game.state.add('main', mainState);
        // Add the 'gameState' and call it 'gState'
        game.state.add('gState', gameState);

        // Start the state to actually start the game
        game.state.start('main');

        return game;
    }


    function startController(connection){
        var mainState = {
            preload: function() {
                // This function will be executed at the beginning
                // That's where we load the images and sounds
                controller.load.image('button1', 'assets/img/button1.png');
                controller.load.image('button2', 'assets/img/button2.png');
                controller.load.image('button3', 'assets/img/button3.png');
                controller.load.image('button4', 'assets/img/button4.png');
            },

            create: function() {
                // Change the background color of the game to blue
                controller.stage.backgroundColor = '#71c5cf';
                // Display the buttons
                this.button1 = controller.add.button(25, 300, 'button1', this.button1);
                this.button2 = controller.add.button(125, 300, 'button2', this.button2);
                this.button3 = controller.add.button(225, 300, 'button3', this.button3);
                this.button4 = controller.add.button(325, 300, 'button4', this.button4);

                connection.on('data', function (data) {
                    displayMessage(data);
                });

            },

            update: function() {
                // This function is called 60 times per second
                // It contains the game's logic

            },

            button1: function() {
                connection.send("A");
                console.log("Button1 Pressed");
            },
            button2: function() {
                connection.send("B");
                console.log("Button2 Pressed");
            },
            button3: function() {
                connection.send("C");
                console.log("Button3 Pressed");
            },
            button4: function() {
                connection.send("D");
                console.log("Button4 Pressed");
            }

        };

        var controller = new Phaser.Game(400, 490);

        // Add the 'mainState' and call it 'main'
        controller.state.add('main', mainState);

        // Start the state to actually start the game
        controller.state.start('main');

        return controller;
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



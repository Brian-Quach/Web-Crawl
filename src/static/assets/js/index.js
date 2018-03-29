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
            //document.getElementById('roomId').innerHTML = roomId;
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


            }
            // Caps at 4.


/*            document.getElementById('checkRoom').addEventListener('click', function () {
                gameRoomConnect(players, roomId);
            });*/



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

	function pageSetUp(){
        api.getDeviceType(function(err, device){
            if (err) return console.log(err);
            var pageBody = document.getElementById('pageContent');

            console.log(device);

            if (device == 'host'){
                var createRoomName = document.createElement('textarea');
                createRoomName.placeholder = 'Name of Game Room';
                createRoomName.required = true;

                var createRoomButton = document.createElement('button');
                createRoomButton.innerHTML = 'Create Game Room';

                pageBody.appendChild(createRoomName);
                pageBody.appendChild(createRoomButton);

                createRoomButton.addEventListener('click', function () {
                    var roomName = createRoomName.value;
                    var roomCapacity = 2;
                    pageBody.style.display = "none";
                    gameRoomSetup(roomName, roomCapacity);
                });
            } else if (device == 'controller'){
                startController();
            } else{
                alert("Device not supported");
            }


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

        var gameWidth = 800;
        var gameHeight = 600;
        var numPlayers = players.length;
        var playerStatus = [];

        // Temp "Level"
        var levelStr = "ABCDABCDCBABCDABCDABCDABC";
        var level = parseLevel(levelStr);

        var mainState = {
            preload: function() {
                // This function will be executed at the beginning
                game.load.image('connectButton', 'assets/img/connect.png');
            },

            create: function() {
                //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                // This function is called after the preload function
                // Here we set up the game, display sprites, etc.
                game.stage.backgroundColor = '#71c5cf';
                this.connectButton = game.add.button(game.world.centerX, game.world.centerY, 'connectButton', this.startGame);
                this.connectButton.anchor.setTo(0.5);
            },

            update: function() {
                // Keep checking for connections
                if ((gameTimer++ > 10)&&(!gameStarted)){
                    gameRoomConnect(players, roomId);
                    gameTimer = 0;
                }

            },

            startGame: function() {
                connectAll(players);
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
                this.stageMoves = gameState.nextMoveSet();

                for (var i=0; i<players.length; i++){

                    var playerState = {
                        stageComplete: false, // True when stage complete
                        stageStep: 0, // Keep track of which step player is on
                        stageScore: 0, // Score multiplier based on timing
                        totalScore: 0 // Total score to be displayed at top
                    };

                    playerStatus.push(playerState);
                    gameState.displayMoves(this.stageMoves, i);

                    gameState.createListener(i);
                }
                gameTimer = 0;
            },

            createListener: function(playerNum){
                players[playerNum].peer.on('data', function (data) {
                    gameState.buttonPressed(playerNum, data);
                });
            },

            update: function() {
                // Keep checking for connections
                if (gameTimer++ > 600){
                    //TODO: Update scores
                    this.stageMoves = gameState.nextMoveSet();

                    if (this.stageMoves.length !== 0){
                        for (var i=0; i<playerStatus.length; i++){
                            playerStatus[i].stageComplete = false;
                            playerStatus[i].stageStep = 0;
                            playerStatus[i].totalScore += playerStatus[i].stageScore;
                            playerStatus[i].stageScore = 0;

                            gameState.displayMoves(this.stageMoves, i);
                        }
                    } else {
                        console.log("GameOver");
                        game.state.start('main', true, true);
                        // TODO: End game
                    }

                    gameTimer = 0;
                }

            },

            nextMoveSet: function(){
                var nextMoves = level.splice(0,5);
                console.log(nextMoves);
                return nextMoves;
            },

            displayMoves: function(moves, playerNum){
                console.log(playerNum);
                console.log(numPlayers);
                var xPos = gameWidth/(2*numPlayers) + (gameWidth*(playerNum))/numPlayers;
                var yPos = gameHeight/3 + 50;

                for (var i=0; i<moves.length; i++){
                    console.log(moves[i]);
                    game.add.sprite(xPos, yPos, gameState.decodeMove(moves[i])).anchor.setTo(0.5);
                    yPos += 60;
                }
            },

            decodeMove: function(move){
                switch (move) {
                    case 'A':
                        return 'box1';
                    case 'B':
                        return 'box2';
                    case 'C':
                        return 'box3';
                    case 'D':
                        return 'box4';
                }
            },

            buttonPressed: function(player, button) {
                console.log(playerStatus);
                console.log(button + " sent");
                if (!playerStatus[player].stageComplete){
                    var currStep = playerStatus[player].stageStep;
                    console.log(this.stageMoves[currStep]);
                    if (button == this.stageMoves[currStep]){
                        playerStatus[player].stageStep++;
                        if(playerStatus[player].stageStep === this.stageMoves.length){
                            // TODO: Add score properly
                            playerStatus[player].stageScore = 500-gameTimer;
                            playerStatus[player].stageComplete = true;
                            console.log("Done!!");
                        }

                    } else {
                        console.log("Wrong move");
                        playerStatus[player].stageStep = 0;
                    }
                }
            },

            endGame: function() {
                game.state.start('main', true, true);
            },

        };

        var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO);

        // Add the 'mainState' and call it 'main'
        game.state.add('main', mainState);
        // Add the 'gameState' and call it 'gState'
        game.state.add('gState', gameState);

        // Start the state to actually start the game
        game.state.start('main');

        return game;
    }


    function startController(){
        var allRooms = [];

        var gameWidth = window.innerWidth;
        var gameHeight = window.innerHeight;


        var roomId;
        var connection; // Passing in for now, but will change so that user selects game room from game
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
                //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

                var buttonY = gameHeight*(3/4);

                // Display the buttons
                this.button1 = controller.add.button(gameWidth*(1/8), buttonY, 'button1', this.button1).anchor.setTo(0.5,0.5);
                this.button2 = controller.add.button(gameWidth*(3/8), buttonY, 'button2', this.button2).anchor.setTo(0.5,0.5);
                this.button3 = controller.add.button(gameWidth*(5/8), buttonY, 'button3', this.button3).anchor.setTo(0.5,0.5);
                this.button4 = controller.add.button(gameWidth*(7/8), buttonY, 'button4', this.button4).anchor.setTo(0.5,0.5);


                mobile.requestRoomConnection(roomId, function(err, res){
                    if (err) {
                        console.log(err);
                        return controller.state.start('selectRoom', true, true);
                    } else

                    var playerNumber = res.playerNumber;
                    var connectionStr = res.connectionString;

                    var gameRoom = setupClientPeer();

                    gameRoom.on('signal', function (data) {
                        var responseString = JSON.stringify(data);
                        mobile.connectToRoom(roomId, playerNumber, responseString, function (err, res) {
                            if (err) return console.log(err);
                        });
                    });

                    gameRoom.signal(connectionStr);

                    gameRoom.on('connect', function () {
                        console.log("Player Connected");
                    })

                    gameRoom.on('data', function (data) {
                        displayMessage(data);
                    });
                    connection = gameRoom;

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

        var selectState = {

            init: function () {

                //Load the plugin
                this.game.kineticScrolling = this.game.plugins.add(Phaser.Plugin.KineticScrolling);


            },
            create: function () {
                //Starts the plugin
                this.game.kineticScrolling.start();

                this.info = this.game.add.text(controller.world.width*0.01, controller.world.height*0.01, "Select Room To Join", {
                    font: "22px Arial",
                    fill: "#ffffff"
                });
                this.info.fixedToCamera = true;

                this.levels = [];

                var initX = 50;

                for (var i = 0; i < allRooms.length; i++) {
                    var newButton = this.createButton(initX, this.game.world.centerY - 100, 250, 200);
                    var btnId = allRooms[i].roomId;
                    newButton.events.onInputUp.add(selectState.selectLevel, {id: btnId});
                    this.levels.push(newButton);
                    this.index = this.game.add.text(initX + 125, this.game.world.centerY, allRooms[i].roomName,
                        { font: '50px Arial', align: "center" });
                    this.index.anchor.set(0.5);
                    initX += 300;
                }

                //Changing the world width
                this.game.world.setBounds(0, 0, 302 * this.levels.length, this.game.height);
            },


            createButton: function (x, y, w, h) {
                var newButton = this.game.add.graphics(x, y);
                newButton.beginFill(0x00FA9A, 1);
                newButton.bounds = new PIXI.Rectangle(0, 0, w, h);
                newButton.drawRect(0, 0, w, h);

                newButton.inputEnabled = true;
                newButton.input.useHandCursor = true;


                return newButton;
            },

            selectLevel: function(){
                roomId = this.id;
                controller.state.start('main', true, true);
            }
        };

        var loadingState ={
            init: function () {
                this.roomsPromise = new Promise(function (resolve, reject){
                    mobile.listAllRooms(function(err, allRooms){
                        if (err) reject(err);
                        resolve(allRooms);
                    });
                });
            },

            create: function () {
                this.roomsPromise.then(function(result){
                    allRooms = result;
                    controller.state.start('selectRoom', true, true);
                }, function(err){
                    console.log(err);
                })
            },

            update: function () {
            },
        };

        var controller = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO);


        // Add controller states
        controller.state.add('main', mainState);
        controller.state.add('selectRoom', selectState);
        controller.state.add('load', loadingState);
        //controller.state.add('roomSelect', roomSelectState);

        // Start the state to actually start the game
        //controller.state.start('main');
        controller.state.start('load');


        return controller;
    }

    window.addEventListener('load', function(){
        pageSetUp();
        //testScroll();

    });
}())



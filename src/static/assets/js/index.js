(function () {
    "use strict";

    var Peer = require('simple-peer');
    var phaserObj;

    function setCookie(cname, cvalue) {
        document.cookie = cname + "=" + cvalue + ";path=/";
    }

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function checkCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return true;
        }
        return false;
    }

    function setupHostPeer() {
        var p = new Peer({
            initiator: true,
            trickle: false
        });

        p.on('error', function (err) {
            console.log('error', err);
        });

        return p;
    }

    function setupClientPeer() {
        var p = new Peer({
            initiator: false,
            trickle: false
        });

        p.on('error', function (err) {
            console.log('error', err);
        });

        return p;
    }

    function gameRoomSetup(roomName, capacity) {

        // Request room ID from server
        host.createGameRoom(roomName, capacity, function (err, res) {
            var roomId = res;

            var players = [];

            if (capacity > 0) {
                var player1 = setupHostPeer();
                player1.on('signal', function (data) {
                    host.sendConnectionString(roomId, JSON.stringify(data), function (err, res) {
                    });
                });
                player1.on('connect', function () {
                    var playernum = 1;
                    console.log("Player Connected (%s)", playernum);

                })

                players.push({
                    peer: player1,
                    id: null,
                    username: null,
                    connected: false
                });


            }

            if (capacity > 1) {
                var player2 = setupHostPeer();
                player2.on('signal', function (data) {
                    host.sendConnectionString(roomId, JSON.stringify(data), function (err, res) {
                    });
                });
                player2.on('connect', function () {
                    var playernum = 2;
                    console.log("Player Connected (%s)", playernum);

                })

                players.push({
                    peer: player2,
                    id: null,
                    username: null,
                    connected: false
                });

            }
            if (capacity > 2) {
                var player3 = setupHostPeer();
                player3.on('signal', function (data) {
                    host.sendConnectionString(roomId, JSON.stringify(data), function (err, res) {
                    });
                });
                player3.on('connect', function () {
                    var playernum = 3;
                    console.log("Player Connected (%s)", playernum);

                })

                players.push({
                    peer: player3,
                    id: null,
                    username: null,
                    connected: false
                });

            }

            if (capacity > 3) {
                var player4 = setupHostPeer();
                player4.on('signal', function (data) {
                    host.sendConnectionString(roomId, JSON.stringify(data), function (err, res) {
                    });
                });
                player4.on('connect', function () {
                    var playernum = 2;
                    console.log("Player Connected (%s)", playernum);

                })

                players.push({
                    peer: player4,
                    id: null,
                    username: null,
                    connected: false
                });


            }
            // Caps at 4.
            phaserObj = startGame(players, roomId);
        });
    }

    function gameRoomConnect(players, roomId) {
        for (var i = 0; i < players.length; i++) {
            if (players[i].id == null) {
                host.getPlayerConnection(roomId, i, function (err, res) {
                    if (res == "") {
                        return;
                    }
                    console.log(res);
                    setCookie("username" + res.playerNum, res.username);
                    setCookie("id_Player" + res.playerNum, res.playerId);
                    setCookie("connectStr_Player" + res.playerNum, res.connectionStr);
                });
            }
        }
    }

    function connectAll(players) {
        for (var i = 0; i < players.length; i++) {
            if ((players[i].id == null) && readCookie("connectStr_Player" + i)) {
                players[i].id = readCookie("id_Player" + i);
                players[i].username = readCookie("username" + i);
                players[i].peer.signal(readCookie("connectStr_Player" + i));
            }
        }
    }

    function welcomeMessage(userType) {
        var welcome = document.getElementById("title");
        var message = "Hello " + userType + " user!";
        welcome.innerHTML = message;
        welcome.setAttribute("UserType", userType);
    }

    function welcomeDeviceType() {
        api.getDeviceType(function (err, device) {
            if (err) console.log(err);
            welcomeMessage(device);
        });
    }

    function pageSetUp() {

        api.getDeviceType(function (err, device) {
            if (err) return console.log(err);
            var pageBody = document.getElementById('pageContent');

            console.log(device);

            if (device == 'host') {
                hostSetUp(pageBody);
            } else if (device == 'controller') {
                controllerSetUp(pageBody);
            } else {
                alert("Device not supported");
            }


        });


    }

    function hostSetUp(pageBody){
        var createRoomName = document.createElement('textarea');
        createRoomName.placeholder = 'Name of Game Room';
        createRoomName.required = true;

        var createRoomCapacity = document.createElement('select');
        createRoomCapacity.innerHTML =
            "<option value=1 disabled selected hidden>Room Capacity</option>" +
            "<option value=1>1</option>" +
            "<option value=2>2</option>" +
            "<option value=3>3</option>" +
            "<option value=4>4</option>";

        var createRoomButton = document.createElement('button');
        createRoomButton.innerHTML = 'Create Game Room';


        pageBody.appendChild(createRoomName);
        pageBody.appendChild(createRoomCapacity);
        pageBody.appendChild(createRoomButton);

        createRoomButton.addEventListener('click', function () {
            var roomName = createRoomName.value;
            var roomCapacity = createRoomCapacity.value;
            pageBody.style.display = "none";
            gameRoomSetup(roomName, roomCapacity);
        });
    };

    function controllerSetUp(pageBody){
        if (api.getCurrentUser() !== null){
            phaserObj = startController();
        } else {
            loginSetUp(pageBody);
        }

    };

    function loginSetUp(pageBody){
        var loginButton = document.createElement('a');
        loginButton.href = "/login.html";
        loginButton.text = "Log In or Create Account";

        pageBody.appendChild(loginButton);

    }

    function displayMessage(msg) {
        var newMsg = document.createElement('p');
        newMsg.innerHTML = msg;
        document.getElementById('datastream').appendChild(newMsg);
    }

    function generateLevelString(len){
        var levelStr = "";

        while(levelStr.length < len){
            levelStr += "ABCD".charAt(Math.floor(Math.random() * 4));
        }

        return levelStr;
    }

    function parseLevel(levelStr) {
        var level = levelStr.split("");
        return level;
    }

    function startGame(players, roomId) {
        var gameTimer = 0;
        var gameStarted = false;
        var firstGame = true;

        var gameWidth = 800;
        var gameHeight = 600;
        var numPlayers = players.length;
        var playerStatus = [];

        var playerScores = [];
        var stepsDisplayed = [];
        while (playerScores.length < players.length){
            playerScores.push(null);
            var steps = {
                marker: null,
                steps: [null, null, null, null, null]
            };
            stepsDisplayed.push(steps);
        }

        var levelStr;
        var level;


        var mainState = {
            preload: function () {
                // This function will be executed at the beginning
                //TODO: Change this to "START GAME" button or something
                game.load.image('connectButton', 'assets/img/connect.png');
            },

            create: function () {
                //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                // This function is called after the preload function
                // Here we set up the game, display sprites, etc.
                game.stage.backgroundColor = '#71c5cf';
                this.connectButton = game.add.button(game.world.centerX, game.world.centerY, 'connectButton', this.startGame);
                this.connectButton.anchor.setTo(0.5);
            },

            update: function () {
                // Keep checking for connections
                if ((gameTimer++ > 10) && (!gameStarted)) {
                    gameRoomConnect(players, roomId);
                    gameTimer = 0;
                }

            },

            startGame: function () {
                connectAll(players);
                game.state.start('preGame', true, true);
            },
        };

        var preGameState = {
            preload: function () {
                this.countDownTimer = 5.00;
                this.countDown = game.add.text(game.world.centerX, game.world.centerY, '');
                this.countDown.anchor.setTo(0.5);
            },

            create: function () {

            },

            update: function () {
                this.countDownTimer -= (1/60);
                if (this.countDownTimer < -1){
                    preGameState.startGame();
                }

                if (this.countDownTimer > 0){
                    this.countDown.setText(Number.parseFloat(this.countDownTimer).toPrecision(3));
                } else {
                    this.countDown.setText("Start!");
                }
            },

            startGame: function () {
                this.countDown.destroy();
                game.state.start('gState', true, true);
            },

        };

        var gameState = {
            preload: function () {
                this.stepMap = {'A': 'box1', 'B': 'box2', 'C': 'box3' , 'D': 'box4'};

                // TODO: Get from server
                // Temp "Level"
                var levelLength = 60;
                //TODO: Change back
                levelLength = 15;

                levelStr = generateLevelString(levelLength);
                level = parseLevel(levelStr);
                // This function will be executed at the beginning
                game.load.image('box1', 'assets/img/button1.png');
                game.load.image('box2', 'assets/img/button2.png');
                game.load.image('box3', 'assets/img/button3.png');
                game.load.image('box4', 'assets/img/button4.png');
                game.load.image('stepMarker', 'assets/img/stepMarker.png');
            },

            create: function () {
                // This function is called after the preload function
                // Here we set up the game, display sprites, etc.
                game.stage.backgroundColor = '#4bf442';
                this.stageMoves = gameState.nextMoveSet();

                for (var i = 0; i < players.length; i++) {

                    var playerState = {
                        username: players[i].username,
                        stageComplete: false, // True when stage complete
                        stageStep: 0, // Keep track of which step player is on
                        stageScore: 0, // Score multiplier based on timing
                        totalScore: 0 // Total score to be displayed at top
                    };

                    playerStatus.push(playerState);
                    gameState.displayMoves(this.stageMoves, i);

                    if (firstGame){
                        gameState.createListener(i);
                    }
                }
                gameState.updateScores();
                gameTimer = 0;
            },

            createListener: function (playerNum) {
                players[playerNum].peer.on('data', function (data) {

                    gameState.buttonPressed(playerNum, data);
                });
            },

            update: function () {
                if (gameTimer++ > 300) {
                    //TODO: Update scores
                    this.stageMoves = gameState.nextMoveSet();

                    if (this.stageMoves.length !== 0) {
                        for (var i = 0; i < playerStatus.length; i++) {
                            playerStatus[i].stageComplete = false;
                            playerStatus[i].stageStep = 0;
                            playerStatus[i].totalScore += playerStatus[i].stageScore;
                            playerStatus[i].stageScore = 0;

                            gameState.displayMoves(this.stageMoves, i);
                        }
                        gameState.updateScores();
                    } else {
                        console.log("GameOver");
                        for (var i = 0; i < playerStatus.length; i++) {
                            playerStatus[i].totalScore += playerStatus[i].stageScore;
                        }
                        gameState.endGame();
                    }

                    gameTimer = 0;
                }
                console.log(gameTimer);
            },

            nextMoveSet: function () {
                var nextMoves = level.splice(0, 5);
                console.log(nextMoves);
                return nextMoves;
            },

            displayMoves: function (moves, playerNum) {
                console.log(playerNum);
                console.log(numPlayers);
                var xPos = gameWidth / (2 * numPlayers) + (gameWidth * (playerNum)) / numPlayers;
                var yPos = gameHeight / 3 + 50;

                for (var i=0; i<stepsDisplayed[playerNum].length; i++){
                    if (stepsDisplayed[playerNum].steps[i] !== null){
                        stepsDisplayed[playerNum].steps[i].destroy();
                    }
                }

                for (i=0; i < moves.length; i++) {
                    console.log(moves[i]);
                    stepsDisplayed[playerNum].steps[i] = game.add.sprite(xPos, yPos, gameState.decodeMove(moves[i]));
                    stepsDisplayed[playerNum].steps[i].anchor.setTo(0.5);

                    if (i===0){
                        if (stepsDisplayed[playerNum].marker !== null){
                            stepsDisplayed[playerNum].marker.destroy();
                        }
                        stepsDisplayed[playerNum].marker = game.add.sprite(xPos, yPos, 'stepMarker');
                        stepsDisplayed[playerNum].marker.anchor.setTo(0.5);
                    }


                    yPos += 60;
                }
            },

            updateScores: function(){
                //TODO: Font
                var yPos = gameHeight / 3 - 80;
                for (var playerNum = 0; playerNum < playerStatus.length; playerNum++){
                    var xPos = gameWidth / (2 * numPlayers) + (gameWidth * (playerNum)) / numPlayers;
                    if(playerScores[playerNum] != null){
                        playerScores[playerNum].setText(playerStatus[playerNum].username + "\nPts: " + playerStatus[playerNum].totalScore);
                    } else {
                        console.log(playerStatus[playerNum]);
                        playerScores[playerNum] = game.add.text(xPos, yPos, playerStatus[playerNum].username + "\nPts: 0");
                        playerScores[playerNum].anchor.setTo(0.5,0.5);
                    }

                }

            },

            decodeMove: function (move) {
                return this.stepMap[move];
            },

            buttonPressed: function (player, button) {

                var yPos = gameHeight / 3 + 50;

                console.log(playerStatus);
                console.log(button + " sent");
                if (!playerStatus[player].stageComplete) {
                    var currStep = playerStatus[player].stageStep;
                    console.log(this.stageMoves[currStep]);
                    if (button == this.stageMoves[currStep]) {
                        playerStatus[player].stageStep++;
                        if (playerStatus[player].stageStep === this.stageMoves.length) {
                            playerStatus[player].stageScore = 500 - gameTimer;
                            playerStatus[player].stageComplete = true;
                            console.log("Done!!");
                        } else {
                            yPos += 60*playerStatus[player].stageStep;
                            game.add.tween(stepsDisplayed[player].marker).to({y:yPos},100, Phaser.Easing.Bounce.Out, true);
                        }

                    } else {
                        console.log("Wrong move");
                        game.add.tween(stepsDisplayed[player].marker).to({y:yPos},100, Phaser.Easing.Bounce.Out, true);
                        playerStatus[player].stageStep = 0;
                    }
                }
            },

            endGame: function () {
                game.state.start('winnerState', true, true);
            },

        };

        var winnerState = {
            preload: function () {
                // This function will be executed at the beginning
                game.load.image('nextButton', 'assets/img/connect.png');
            },

            create: function () {
                //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                // This function is called after the preload function
                // Here we set up the game, display sprites, etc.
                game.stage.backgroundColor = '#71c5cf';
                //TODO: Exit button
                this.restartButton = game.add.button(game.world.centerX*(2/3), game.world.centerY*(3/2), 'nextButton', this.restartGame);
                this.exitButton = game.add.button(game.world.centerX*(4/3), game.world.centerY*(3/2), 'nextButton', this.quitGame);
                this.restartButton.anchor.setTo(0.5, 0.5);
                this.exitButton.anchor.setTo(0.5, 0.5);

                var winnerPlayer = null;
                var winnerScore = -1;

                for (var i=0; i<playerStatus.length; i++){
                    // Give experience
                    api.giveXp(playerStatus[i].username, playerStatus[i].totalScore, function(err, res){});

                    // Check for highest score
                    if (playerStatus[i].totalScore > winnerScore){
                        winnerPlayer = playerStatus[i].username;
                        winnerScore = playerStatus[i].totalScore;
                    }
                }

                this.winnerText = game.add.text(game.world.centerX, game.world.centerY, "Winner: "+ winnerPlayer + "\nScore: " + winnerScore);
                this.winnerText.anchor.setTo(0.5,0.5);
            },

            update: function () {

            },

            restartGame: function () {
                firstGame = false;
                playerStatus = [];
                playerScores = [];
                stepsDisplayed = [];
                while (playerScores.length < players.length){
                    playerScores.push(null);
                    var steps = {
                        marker: null,
                        steps: [null, null, null, null, null]
                    };
                    stepsDisplayed.push(steps);
                }
                game.state.start('preGame', true, true);
            },


            quitGame: function () {
                exitGame(roomId);
            }
        };


        var game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO);

        // Add the 'mainState' and call it 'main'
        game.state.add('main', mainState);
        // Add the 'gameState' and call it 'gState'
        game.state.add('gState', gameState);
        game.state.add('preGame', preGameState);
        game.state.add('winnerState', winnerState);

        // Start the state to actually start the game
        game.state.start('main');

        return game;
    }

    function exitGame(roomId){
        phaserObj.destroy();

        host.closeRoom(roomId, function(res, err){});

        var pageBody = document.getElementById('pageContent');
        pageBody.style.display = "block";
        pageBody.innerHTML = "";
        pageSetUp();

    }

    function startController() {
        var allRooms = [];

        var gameWidth = window.innerWidth;
        var gameHeight = window.innerHeight;

        var roomId;
        var connection;


        var mainState = {
            preload: function () {
                // This function will be executed at the beginning
                // That's where we load the images and sounds
                controller.load.image('button1', 'assets/img/button1.png');
                controller.load.image('button2', 'assets/img/button2.png');
                controller.load.image('button3', 'assets/img/button3.png');
                controller.load.image('button4', 'assets/img/button4.png');
            },

            create: function () {

                //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

                var buttonY = gameHeight * (3 / 4);

                // Display the buttons
                var button1 = controller.add.button(gameWidth * (1 / 8), buttonY, 'button1', this.button1);
                var button2 = controller.add.button(gameWidth * (3 / 8), buttonY, 'button2', this.button2);
                var button3 = controller.add.button(gameWidth * (5 / 8), buttonY, 'button3', this.button3);
                var button4 = controller.add.button(gameWidth * (7 / 8), buttonY, 'button4', this.button4);

                button1.anchor.setTo(0.5, 0.5);
                button1.scale.setTo(3, 3);
                button2.anchor.setTo(0.5, 0.5);
                button2.scale.setTo(3, 3);
                button3.anchor.setTo(0.5, 0.5);
                button3.scale.setTo(3, 3);
                button4.anchor.setTo(0.5, 0.5);
                button4.scale.setTo(3, 3);


                var currUser =  api.getCurrentUser();
                mobile.requestRoomConnection(roomId, currUser, function (err, res) {
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
                        console.log(data);
                    });
                    connection = gameRoom;


                });

            },

            update: function () {
                // This function is called 60 times per second
                // It contains the game's logic

            },

            button1: function () {
                connection.send("A");
                console.log("Button1 Pressed");
            },
            button2: function () {
                connection.send("B");
                console.log("Button2 Pressed");
            },
            button3: function () {
                connection.send("C");
                console.log("Button3 Pressed");
            },
            button4: function () {
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

                this.info = this.game.add.text(controller.world.width * 0.01, controller.world.height * 0.01, "Select Room To Join", {
                    font: "22px Arial",
                    fill: "#ffffff"
                });
                this.info.fixedToCamera = true;

                this.rooms = [];

                var initX = 50;

                for (var i = 0; i < allRooms.length; i++) {
                    var newButton = this.createButton(initX, this.game.world.centerY - 100, 250, 200);
                    var btnId = allRooms[i].roomId;
                    newButton.events.onInputUp.add(selectState.selectRoom, {id: btnId});
                    this.rooms.push(newButton);
                    this.index = this.game.add.text(initX + 125, this.game.world.centerY, allRooms[i].roomName,
                        {font: '50px Arial', align: "center"});
                    this.index.anchor.set(0.5);
                    initX += 300;
                }

                //Changing the world width
                this.game.world.setBounds(0, 0, 302 * this.rooms.length, this.game.height);
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

            selectRoom: function () {
                roomId = this.id;
                controller.state.start('main', true, true);
            }
        };

        var loadingState = {
            init: function () {
                this.roomsPromise = new Promise(function (resolve, reject) {
                    mobile.listAllRooms(function (err, allRooms) {
                        if (err) reject(err);
                        resolve(allRooms);
                    });
                });
            },

            create: function () {
                this.roomsPromise.then(function (result) {
                    allRooms = result;
                    controller.state.start('selectRoom', true, true);
                }, function (err) {
                    console.log(err);
                })
            },

            update: function () {
            },
        };

        var controller = new Phaser.Game(gameWidth, gameHeight, Phaser.CANVAS);


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

    window.addEventListener('load', function () {
        pageSetUp();
        //testScroll();

    });
}());



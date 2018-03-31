// #!/usr/bin/env nodejs

const express = require('express');
const app = express();
const fs = require('fs');
var device = require('express-device');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('static'));
app.use(device.capture());

var options = {
  password: 'CSCC09'
};

var redis = require('redis');
/*var client = redis.createClient(options);

client.on('error', function(err){
    // Fall back to url if not connecting locally
    client = redis.createClient(6379, "briiquach.com", options);
})*/

var Connection = function(hostString){
    this.hostString = hostString;
    this.peerString = null;
    this.playerId = -1; // Will be used for account identification
};

var GameRoom = function (id, roomName, capacity){
    this.id = id;
    this.capacity = capacity;
    this.roomName = roomName;
    this.players = [];
};

var host_platforms = ['desktop'];
var mobile_platforms = ['phone','tablet'];

var rooms = [];
var roomsnext = 0;


var Level = function(levelId, levelName, steps){
    this.id = levelId;
    this.name = levelName;
    this.level = steps;
    //this.song = song;
    //this.recordholder = recordHolderName;
    //this.highscore = highscore;
};

// Log Http requests to console
app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});

// Get device type
app.get('/api/device/',function(req,res) {
    var deviceType = req.device.type;
    if (host_platforms.includes(deviceType)) {
        return res.json("host");
    } else if (mobile_platforms.includes(deviceType)){
        return res.json("controller");
    } else {
        return res.json("unknown device");
    }
});

app.post('/api/createroom/', function(req,res){
    var roomid = roomsnext++;
    var room = new GameRoom(roomid, req.body.roomName, req.body.capacity);
    rooms.push(room);
    console.log("Created room %s", roomid);
    return res.json(roomid);
});

app.get('/api/allrooms/', function(req, res){
    var roomList = [];
    for (var i=0; i<rooms.length; i++){
        var nextRoom = {
            roomId: rooms[i].id,
            roomName: rooms[i].roomName
        };
        roomList.push(nextRoom);
    }
    return res.json(roomList);
});

app.post('/api/newpeer/', function(req, res){
    var roomId = req.body.roomId;
    for (var i=0; i<rooms.length; i++){
        if (rooms[i].id == roomId){
            if (rooms[i].players.length == rooms[i].capacity){
                console.log("Room full");
                return res.status(401).end("Room Full");
            } else {
                var connection = new Connection(req.body.connectionStr);
                rooms[i].players.push(connection);
                console.log("new connection added");
                return res.json("Connection Added");
            }
        }
    }
    console.log("couldn't find room");
    return res.status(401).end("Could not find room");
});

// Get connection string for requested room
// curl -H "Content-Type: application/json" -X GET -d '{"roomId":0}' localhost:3000/api/requestConnection
app.get('/api/requestConnection/:roomId/', function(req, res){
    var roomId = req.params.roomId;
    console.log(roomId);
    for (var i=0; i<rooms.length; i++){
        if (rooms[i].id == roomId){
            var room = rooms[i];
            for (var j=0; j<room.players.length; j++){
                if (room.players[j].peerString == null){
                    var ret = {
                        playerNumber: j,
                        connectionString: room.players[j].hostString
                    };
                    room.players[j].peerString = "Waiting";
                    return res.json(ret);
                }
            }
            return res.status(401).end("Room is full");
        }
    }
    console.log("couldn't find");
    return res.status(401).end("Could not find room");
});

app.post('/api/connectToRoom/', function(req, res){
    var roomId = req.body.roomId;
    var playerNum = req.body.playerNum;
    var connectionStr = req.body.connectionStr;

    for (var i=0; i<rooms.length; i++){
        if (rooms[i].id == roomId){
            var player = rooms[i].players[playerNum];
            if (player.peerString != "Waiting"){
                return res.status(401).end("Connection unavailable");
            }
            player.peerString = connectionStr;
            return res.json("Connection request complete");
        }
    }
    console.log("couldn't find room");
    return res.status(401).end("Could not find room");
});

app.get('/api/getConnection/:roomId/:playerNum/', function(req, res){
    var roomId = req.params.roomId;
    var playerNum = req.params.playerNum;

    for (var i=0; i<rooms.length; i++){
        if (rooms[i].id == roomId){
            var player = rooms[i].players[playerNum];
            if ((player.peerString == "Waiting")||(player.peerString == null)){
                return res.json("");
            }
            var connectionStr = player.peerString;
            var ret = {
                playerNum: playerNum,
                playerId: player.playerId,
                connectionStr: connectionStr
            };
            return res.json(ret);
        }
    }
    console.log("couldn't find room");
    return res.status(401).end("Could not find room");
});


// TODO: User DB

const https = require('https');
const PORT = 3000;

var privateKey = fs.readFileSync( 'server.key' );
var certificate = fs.readFileSync( 'server.crt' );
var config = {
        key: privateKey,
        cert: certificate
};

https.createServer(config, app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTPS server on https://localhost:%s", PORT);
});

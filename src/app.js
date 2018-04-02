// #!/usr/bin/env nodejs

const express = require('express');
const app = express();
const fs = require('fs');
var device = require('express-device');

const crypto = require('crypto');
var salt = crypto.randomBytes(16).toString('base64');

const session = require('express-session');
app.use(session({
    secret: 'Session_Key',
    resave: false,
    saveUninitialized: true,
}));

const cookie = require('cookie');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static('static'));
app.use(device.capture());

var options = {
    password: 'CSCC09'
};

var redis = require('redis');

//var client = redis.createClient(options);
var client = redis.createClient(6379, "briiquach.com", options);

client.on('error', function (err) {
    console.log(err);
});

client.on('connect', function () {
    console.log('connected');
});

var Connection = function (hostString) {
    this.username = null;
    this.hostString = hostString;
    this.peerString = null;
    this.playerId = -1;
};

var GameRoom = function (id, roomName, capacity) {
    this.id = id;
    this.capacity = capacity;
    this.roomName = roomName;
    this.players = [];
    this.full = false;
};

var User = function (username, password) {
    this.username = username;
    this.password = password;
    this.avatar = 0;
    this.experience = 0;
    this.highScore = 0;
    this.gamesPlayed = 0;
};

var host_platforms = ['desktop'];
var mobile_platforms = ['phone', 'tablet'];

var rooms = [];
var roomsnext = 0;


// Log Http requests to console
app.use(function (req, res, next) {
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});


// userName, password
app.post('/api/signUp/', function (req, res) {
    client.exists(req.body.username, function (err, reply) {
        var username = req.body.username;
        var password = req.body.password;
        var hash = crypto.createHmac('sha512', salt);
        hash.update(password);
        var saltedHash = hash.digest('base64');
        if (reply === 1) {
            return res.status(500).end("User already exists");
        } else {
            var newUser = new User(username, saltedHash);
            console.log(newUser);
            client.hmset(username, newUser);
            // initialize cookie
            res.setHeader('Set-Cookie', cookie.serialize('username', username, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7
            }));
            req.session.username = username;
            return res.json("Account Created");
        }
    });
});

app.post('/api/signIn/', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var saltedHash = hash.digest('base64');
    client.hgetall(username, function (err, account) {
        if (err) return console.log(err);
        if (account === null) {
            return res.status(500).end("User doesn't exists");
        } else {
            if (account.password != saltedHash) return res.status(500).end("Incorrect Password");
            // initialize cookie
            res.setHeader('Set-Cookie', cookie.serialize('username', username, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7
            }));
            req.session.username = username;
            return res.json(username); //TODO: return something useful
        }
    });
});


app.get('/api/signout/', function (req, res) {
    res.setHeader('Set-Cookie', cookie.serialize('username', '', {
        path : '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
    }));
    req.session.username = '';
    res.redirect('/');
});

app.get('/api/getlevel/:username/', function (req, res){
    var username = req.params.username;
    client.hgetall(username, function (err, account) {
        if (err) return console.log(err);
        if (account === null) return res.status(500).end("User doesn't exists");
        var userXp =  parseInt(account.experience);
        var userLevel = {
            level: Math.floor(userXp/10000),
            xp: userXp%10000
        };
        return res.json(userLevel); //TODO: return something useful
    });
});

app.post('/api/givexp/', function (req, res){
    var username = req.body.username;
    var exp = req.body.experience;
    client.hgetall(username, function (err, account) {
        if (err) return console.log(err);
        if (account === null) return res.status(500).end("User doesn't exists");
        var userXp =  parseInt(account.experience);
        userXp += exp;
        client.hmset(username, "experience", userXp);
        return res.json(userXp); //TODO: return something useful
    });
});


// Get device type
app.get('/api/device/', function (req, res) {
    var deviceType = req.device.type;
    if (host_platforms.includes(deviceType)) {
        return res.json("host");
    } else if (mobile_platforms.includes(deviceType)) {
        return res.json("controller");
    } else {
        return res.json("unknown device");
    }
});

app.post('/api/createroom/', function (req, res) {
    var roomid = roomsnext++;
    var room = new GameRoom(roomid, req.body.roomName, req.body.capacity);
    rooms.push(room);
    console.log("Created room %s", roomid);
    return res.json(roomid);
});

app.get('/api/allrooms/', function (req, res) {
    var roomList = [];
    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].full === false){
            var nextRoom = {
                roomId: rooms[i].id,
                roomName: rooms[i].roomName

            };
            roomList.push(nextRoom);
        }
    }
    return res.json(roomList);
});

app.post('/api/newpeer/', function (req, res) {
    var roomId = req.body.roomId;
    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].id == roomId) {
            if (rooms[i].players.length == rooms[i].capacity) {
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
app.get('/api/requestConnection/:roomId/:username/', function (req, res) {
    var roomId = req.params.roomId;
    var username = req.params.username;
    console.log(roomId);
    console.log(username);
    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].id == roomId) {
            var room = rooms[i];
            for (var j = 0; j < room.players.length; j++) {
                if (room.players[j].peerString === null) {
                    var ret = {
                        playerNumber: j,
                        connectionString: room.players[j].hostString
                    };
                    room.players[j].peerString = "Waiting";
                    room.players[j].username = username;

                    if(j+1 == room.players.length){
                        rooms[i].full = true;
                    }

                    return res.json(ret);
                }
            }
            return res.status(401).end("Room is full");
        }
    }
    console.log("couldn't find");
    return res.status(401).end("Could not find room");
});

app.post('/api/closeRoom/', function (req, res){
    var roomId = req.body.roomId;
    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].id == roomId) {
            rooms.splice(i, 1);
            return res.json("Room removed");
        }
    }
    console.log("couldn't find");
    return res.status(401).end("Could not find room");

});

app.post('/api/connectToRoom/', function (req, res) {
    var roomId = req.body.roomId;
    var playerNum = req.body.playerNum;
    var connectionStr = req.body.connectionStr;

    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].id == roomId) {
            var player = rooms[i].players[playerNum];
            if (player.peerString != "Waiting") {
                return res.status(401).end("Connection unavailable");
            }
            player.peerString = connectionStr;
            return res.json("Connection request complete");
        }
    }
    console.log("couldn't find room");
    return res.status(401).end("Could not find room");
});

app.get('/api/getConnection/:roomId/:playerNum/', function (req, res) {
    var roomId = req.params.roomId;
    var playerNum = req.params.playerNum;


    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].id == roomId) {
            var player = rooms[i].players[playerNum];
            if ((player.peerString == "Waiting") || (player.peerString === null)) {
                return res.json("");
            }
            var connectionStr = player.peerString;
            var username = player.username;
            var ret = {
                username: username,
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

var privateKey = fs.readFileSync('server.key');
var certificate = fs.readFileSync('server.crt');
var config = {
    key: privateKey,
    cert: certificate
};

https.createServer(config, app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTPS server on https://localhost:%s", PORT);
});

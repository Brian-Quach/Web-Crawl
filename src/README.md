# The Webcrawlers API ♫꒰･‿･๑꒱

## The methods available for use:
* signUp - sign up a new user given the username and password
* signIn - sign in an existing user given the username and password
* signout - signout the current user that is signed in
* getlevel - given the username, get the level information and exp for the user
* givexp - given the username, give xp to the user
* device - get the device type for a connected device (host or controller or unknown)
* createroom - create a room and assign a room id, this new room is now available for playing
* allrooms - returns a list of all rooms that have been created
* newpeer - given the roomid and connection string, determine whether a new peer can be added to room roomid
* requestConnection - given a roomid and username, get the connection string for the room roomid
* closeRoom - given the roomid, remove room roomid from available rooms
* connectToRoom - given the roomid, playerNum, and connectionStr, connect the player to the room
* getConnection - given the roomid and playerNum, get the username, playerNum, playerId, and connection string

## signUp
Request 
* HTTP method - POST
* URL - https://briiquach.com/api/signUp/
* content-type - application/json
* body - username and password for signup

Response - HTTP Status Code: 200 for success with string "Account Created", 500 if the username already exists

Example
```
curl --request POST 
	-H "Content-Type: application/json" 
	-d '{"username":"alice","password":"alice"}' 
	-c cookie.txt 
	https://briiquach.com/api/signUp/
```

## signIn
Request 
* HTTP method - POST
* URL - https://briiquach.com/api/signIn/
* content-type - application/json
* body - username and password for signin

Response - HTTP Status Code: 200 for success with the username, 500 if the username does not exist or if the password is incorrect

Example
```
curl --request POST 
	-H "Content-Type: application/json" 
	-d '{"username":"alice","password":"alice"}' 
	-c cookie.txt 
	https://briiquach.com/api/signIn/
```

## signout
Request
* HTTP method - GET
* URL - https://briiquach.com/api/signout/

Response - Redirect to '/'

Example
```
curl --request GET
	-c cookie.txt 
	https://briiquach.com/api/signout/
```

## getlevel
Request
* HTTP method - GET
* URL - https://briiquach.com/api/getlevel/:username/

Response - HTTP Status Code: 200 for success with level information, 500 if the user does not exist

Example
```
curl --request GET 
	https://briiquach.com/api/getlevel/alice/
```

## givexp
Request 
* HTTP method - POST
* URL - https://briiquach.com/api/givexp/
* content-type - application/json
* body - username and exp to assign

Response - HTTP Status Code: 200 for success with exp number awarded, 500 if the user does not exist

Example
```
curl --request POST 
	-H "Content-Type: application/json" 
	-d '{"username":"alice","experience":100}' 
	-c cookie.txt 
	https://briiquach.com/api/givexp/
```

## device
Request
* HTTP method - GET
* URL - https://briiquach.com/api/device/

Response - HTTP Status Code: 200 with string "host"/"controller"/"unknown" based on device type

Example
```
curl --request GET 
	https://briiquach.com/api/device/
```

## createroom
Request 
* HTTP method - POST
* URL - https://briiquach.com/api/createroom/
* content-type - application/json
* body - room name and capacity

Response - HTTP Status Code: 200 with roomid for the new room

Example
```
curl --request POST 
	-H "Content-Type: application/json" 
	-d '{"roomName":"yay1","capacity":2}' 
	-c cookie.txt 
	https://briiquach.com/api/createroom/
```

## allrooms
Request
* HTTP method - GET
* URL - https://briiquach.com/api/allrooms/

Response - HTTP Status Code: 200 with a list of all room ids and names available for play

Example
```
curl --request GET 
	https://briiquach.com/api/allrooms/
```

## newpeer
Request 
* HTTP method - POST
* URL - https://briiquach.com/api/newpeer/
* content-type - application/json
* body - roomid and connection string

Response - HTTP Status Code: 200 for success with string "Connection Added", 401 if the room is full or not found

Example
```
curl --request POST 
	-H "Content-Type: application/json" 
	-d '{"roomId":0,"connectionStr":"{\"type\":\"offer\",\"sdp\":\"v=0\\r\\no=- 1151854594411489540 2 IN IP4 127.0.0.1\\r\\ns=-\\r\\nt=0 0\\r\\na=group:BUNDLE data\\r\\na=msid-semantic: WMS\\r\\nm=application 58005 DTLS/SCTP 5000\\r\\nc=IN IP4 108.63.122.173\\r\\na=candidate:2087201215 1 udp 2113937151 192.168.1.14 58005 typ host generation 0 network-cost 50\\r\\na=candidate:842163049 1 udp 1677729535 108.63.122.173 58005 typ srflx raddr 192.168.1.14 rport 58005 generation 0 network-cost 50\\r\\na=ice-ufrag:BNBy\\r\\na=ice-pwd:4k3yIzbC+kNI9xidVW+DWTvc\\r\\na=ice-options:trickle\\r\\na=fingerprint:sha-256 40:0D:B2:EA:BF:F1:8D:E6:6B:8A:35:FF:80:62:A0:88:6F:60:47:09:E2:AB:42:32:FF:47:7B:44:B2:A8:5C:E8\\r\\na=setup:actpass\\r\\na=mid:data\\r\\na=sctpmap:5000 webrtc-datachannel 1024\\r\\n\"}"}' 
	-c cookie.txt 
	https://briiquach.com/api/newpeer/
```

## requestConnection
Request
* HTTP method - GET
* URL - https://briiquach.com/api/requestConnection/:roomId/:username/

Response - HTTP Status Code: 200 for success with the player number and connection string, 401 if the room is full or not found

Example
```
curl --request GET 
	https://briiquach.com/api/requestConnection/0/alice/
```

## closeRoom
Request 
* HTTP method - POST
* URL - https://briiquach.com/api/closeRoom/
* content-type - application/json
* body - roomId

Response - HTTP Status Code: 200 for success with string "Room removed", 401 if the room is not found

Example
```
curl --request POST 
	-H "Content-Type: application/json" 
	-d '{"roomId":0}' 
	-c cookie.txt 
	https://briiquach.com/api/closeRoom/
```

## connectToRoom
Request 
* HTTP method - POST
* URL - https://briiquach.com/api/connectToRoom/
* content-type - application/json
* body - roomId, playerNum, and connectionStr

Response - HTTP Status Code: 200 for success with string "Connection request complete", 401 if the room is not found or the connection is unavailable

Example
```
curl --request POST 
	-H "Content-Type: application/json" 
	-d '{"roomId":1, "playerNum":0, "connectionStr":"{\"type\":\"offer\",\"sdp\":\"v=0\\r\\no=- 1151854594411489540 2 IN IP4 127.0.0.1\\r\\ns=-\\r\\nt=0 0\\r\\na=group:BUNDLE data\\r\\na=msid-semantic: WMS\\r\\nm=application 58005 DTLS/SCTP 5000\\r\\nc=IN IP4 108.63.122.173\\r\\na=candidate:2087201215 1 udp 2113937151 192.168.1.14 58005 typ host generation 0 network-cost 50\\r\\na=candidate:842163049 1 udp 1677729535 108.63.122.173 58005 typ srflx raddr 192.168.1.14 rport 58005 generation 0 network-cost 50\\r\\na=ice-ufrag:BNBy\\r\\na=ice-pwd:4k3yIzbC+kNI9xidVW+DWTvc\\r\\na=ice-options:trickle\\r\\na=fingerprint:sha-256 40:0D:B2:EA:BF:F1:8D:E6:6B:8A:35:FF:80:62:A0:88:6F:60:47:09:E2:AB:42:32:FF:47:7B:44:B2:A8:5C:E8\\r\\na=setup:actpass\\r\\na=mid:data\\r\\na=sctpmap:5000 webrtc-datachannel 1024\\r\\n\"}"}' 
	-c cookie.txt 
	https://briiquach.com/api/connectToRoom/
```

## getConnection
Request
* HTTP method - GET
* URL - https://briiquach.com/api/getConnection/:roomId/:playerNum/

Response - HTTP Status Code: 200 for success with player information (username, playerNum, playerId, connectionStr), 401 if the room is not found

Example
```
curl --request GET 
	https://briiquach.com/api/getConnection/1/0/
```




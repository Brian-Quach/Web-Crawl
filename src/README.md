# The Webcrawlers API ♫꒰･‿･๑꒱

## The methods available for use:
* signUp - sign up a new user given the username and password
* signIn - sign in an existing user given the username and password
* signout - signout the current user that is signed in
* getlevel - given the username, get the level information for the user
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

Response - HTTP Status Code: 200 for success, 500 if the username exists

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

Response - HTTP Status Code: 200 for success, 500 if the username does not exist or if the password is incorrect

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
	https://briiquach.com/api/getlevel/alice
```

## givexp
Request 
* HTTP method - POST
* URL - https://briiquach.com/api/givexp/
* content-type - application/json
* body - username and exp to assign

Response - HTTP Status Code: 200 for success, 500 if the user does not exist

Example
```
curl --request POST 
	-H "Content-Type: application/json" 
	-d '{"username":"alice","experience":100}' 
	-c cookie.txt 
	https://briiquach.com/api/givexp/
```

## device

## createroom

## allrooms

## newpeer

## requestConnection

## closeRoom

## connectToRoom

## getConnection





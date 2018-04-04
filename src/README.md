Welcome to the webcrawlers API ♫꒰･‿･๑꒱

## The methods available for use:
* signup - sign up a new user given the username and password
* signin - sign in an existing user given the username and password
* signout - signout the current user that is signed in
* getlevel - given the username, get the level
* givexp - given the username, give xp to the user
* device - get the device type for a connected device (host or controller or unknown)
* createroom - create a room and assign a room id, this new room is now available for playing
* allrooms - returns a list of all rooms that have been created
* newpeer - given the roomid and connection string, determine whether a new peer can be added to room roomid
* requestConnection - given a roomid and username, get the connection string for the room roomid
* closeRoom - given the roomid, remove room roomid from available rooms
* connectToRoom - given the roomid, playerNum, and connectionStr, connect the player to the room
* getConnection - given the roomid and playerNum, get the username, playerNum, playerId, and connection string

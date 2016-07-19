var db = require('../dbConnection');
var FriendRequest = require('../models/friendRequest');

//create FriendRequests collection
var FriendRequests = new db.Collection();
FriendRequests.model = FriendRequest;

module.exports = FriendRequests;
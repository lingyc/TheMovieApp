var db = require('../dbConnection');
var FriendRequest = require('../models/allRequest');

//create FriendRequests collection
var allRequests = new db.Collection();
allRequests.model = allRequest;

module.exports = allRequests;
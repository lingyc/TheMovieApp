var db = require('../dbConnection');
var allRequest = require('../models/allRequest');

//create FriendRequests collection
var allRequests = new db.Collection();
allRequests.model = allRequest;

module.exports = allRequests;
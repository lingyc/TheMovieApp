var db = require('../dbConnection');
var WatchRequest = require('../models/watchRequest');

//create WatchRequests collection
var WatchRequests = new db.Collection();
WatchRequests.model = WatchRequest;

module.exports = WatchRequest;
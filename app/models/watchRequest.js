var db = require('../dbConnection');
var User = require('./user');

//create friendRequest model
var WatchRequest = db.Model.extend({
  tableName: 'watchRequests',
  hasTimestamps: true
});

module.exports = WatchRequest;

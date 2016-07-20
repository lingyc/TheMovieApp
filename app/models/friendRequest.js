var db = require('../dbConnection');
var User = require('./user');

//create friendRequest model
var FriendRequest = db.Model.extend({
  tableName: 'friendRequests',
  hasTimestamps: true
});

module.exports = FriendRequest;

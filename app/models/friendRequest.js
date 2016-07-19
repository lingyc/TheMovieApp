var db = require('../dbConnection');
var User = require('./user');

//create friendRequest model
var FriendRequest = db.Model.extend({
  tableName: 'friendRequests',
  requestor: function() {
    return this.belongsTo(User, 'requestor');
  },
  requestee: function() {
    return this.belongsTo(User, 'requestee');
  },
  hasTimestamps: true
});

module.exports = FriendRequest;

var db = require('../dbConnection');
var User = require('./user');

//create friendRequest model
var WatchRequest = db.Model.extend({
  tableName: 'watchRequests',
  requestor: function() {
    return this.belongsTo(User, 'requestor');
  },
  requestee: function() {
    return this.belongsTo(User, 'requestee');
  },
  hasTimestamps: true
});

module.exports = WatchRequest;

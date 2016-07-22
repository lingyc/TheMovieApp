var db = require('../dbConnection');

//create friendRequest model
var allRequest = db.Model.extend({
  tableName: 'allRequests',
  hasTimestamps: true
});

module.exports = allRequest;

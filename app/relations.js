var db = require('./dbConnection');

//create user relationship model
var Relation = db.Model.extend({
  tableName: 'relations',
  user1: function() {
    return this.belongsTo(User,'user1id');
  },
  user2: function() {
    return this.belongsTo(User,'user2id');
  }
});

//create user relationships collection
var Relations = new db.Collection();
Relations.model = Relation;

module.exports = Relation;
module.exports = Relations;
var db = require('../dbConnection');
var Relation = require('./relation');

var User = db.Model.extend({
  tableName: 'users',
  relation: function() {
    return this.hasMany(Relation);
  },

});

module.exports = User;
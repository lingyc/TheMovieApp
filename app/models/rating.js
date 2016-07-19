var db = require('../dbConnection');
var User = require('./user');
var Movie = require('./movie');

//create rating model
var Rating = db.Model.extend({
  tableName: 'ratings',
  user: function() {
    return this.belongsTo(User, 'userid');
  },
  movie: function() {
    return this.belongsTo(Movie, 'movieid');
  },
  hasTimestamps: true
});

module.exports = Rating;

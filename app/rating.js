var db = require('./dbConnection');

//create rating model
var Rating = db.Model.extend({
  tableName: 'ratings',
  user: function() {
    return this.belongsTo(User, 'userid');
  },
  movies: function() {
    return this.belongsTo(Movie, 'movieid');
  }
});

//create rating collection
var Ratings = new db.Collection();
Ratings.model = Rating;

module.exports = Rating;
module.exports = Ratings;
var db = require('./dbConnection')

//create movie model
var Movie = db.Model.extend({
  tableName: 'movies'
});

//create movies collection
var Movies = new db.Collection();
Movies.model = Movie;

module.exports = Movie;
module.exports = Movies;
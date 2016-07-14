var db = require('../dbConnection')
var Movie = require('../models/movie');

//create movies collection
var Movies = new db.Collection();
Movies.model = Movie;

module.exports = Movies;
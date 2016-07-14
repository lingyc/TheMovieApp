var db = require('../dbConnection');
var Rating = require('../models/rating');

//create rating collection
var Ratings = new db.Collection();
Ratings.model = Rating;

module.exports = Ratings;
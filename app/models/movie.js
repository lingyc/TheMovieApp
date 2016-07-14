var db = require('../dbConnection')
var Rating = require('./rating');

var Movie = db.Model.extend({
  tableName: 'movies',
  rating: function() {
    return this.hasMany(Rating);
  },
});

module.exports = Movie;
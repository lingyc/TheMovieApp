var db = require('../app/dbConnection');
var Movie = require('../app/models/movie');
var Rating = require('../app/models/rating');
var Relation = require('../app/models/relation');


exports.loginUser = function(req, res) {
  new User({ username: req.body.username }).fetch().then(function(found) {
	  if (found) {
	    res.redirect('/signup');
	  } else {
	    Users.create({
	      username: req.body.username,
	      password: req.body.password,
	    })
	    .then(function(user) {
	      res.redirect('/');
	    });
	  }
	}
};

exports.rateMovie = function(req, res) {
  
};
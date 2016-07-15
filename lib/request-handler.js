var db = require('../app/dbConnection');
var Movie = require('../app/models/movie');
var Rating = require('../app/models/rating');
var Relation = require('../app/models/relation');
var User = require('../app/models/user');

var Movies = require('../app/collections/movies');
var Ratings = require('../app/collections/ratings');
var Relations = require('../app/collections/relations');
var Users = require('../app/collections/users');
//var sessions = require("client-sessions");





exports.signupUser = function(req, res) {
	console.log('calling login', req.body);
	console.log('this is the session',req.session)
  new User({ username: req.body.name }).fetch().then(function(found) {
	  if (found) {
	  	//check password
	  	   //if (password matches)
	  	   //{ add sessions and redirect}
	    res.redirect('/signup');
	  } else {
	  	console.log('creating user');
	    Users.create({
	      username: req.body.name,
	      password: req.body.password,
	    })
	    .then(function(user) {
		  	console.log('created a new user');
		  	
	      res.redirect('/login');
	    });
	  }
	});
};

exports.signinUser = function(req, res) {
	console.log('calling signin', req.body);
	new User({ username: req.body.name }).fetch().then(function(found){

		if (found){
			new User({ username: req.body.name, password:req.body.password}).fetch().then(function(found){
				if (found){
					req.mySession.user = found.attributes.username;
          console.log(found.attributes.username)
					console.log('we found you!!')
					res.send('it worked');
				} else {
					console.log('sorry, no match!!!')
				}
			})
		} else {
			console.log('no such user')
		}

  }) 

}

exports.logout = function(req, res) {
	req.mySession.destroy(function(err){
		console.log(err);
	});
	console.log('logout');
	res.send('logout');
}

exports.getFriendRatings = function(req, res) {
	console.log(req.body);
	var ratings = [];
	new User({ username: req.mySession.user }).fetch().then(function(user){
		console.log('user:', user);
		new Movie({ title: req.body.name }).fetch().then(function(movie){
		console.log('movie:', movie);
			new Relation({ user1id: user.attributes.id }).fetchAll().then(function(friends){
				console.log('movie:', movie);
		// 		friends.forEach(function(friend) {
		// 			new Rating({ userid: friend.user2id, movieid: movie.id }).fetchAll().then(function(rating){
		// 				ratings.push(rating);
		// 		})
			})
		})
	})
				
}

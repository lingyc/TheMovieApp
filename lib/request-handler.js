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

/////////////////////
/////movie handlers
/////////////////////

//a handeler that takes a rating from user and add it to the database
// expects req.body to have this: {username: 'name', moviename: 'name', genre: 'genre', poster: 'link', release_date: 'year', rating: 'number'}
exports.rateMovie = function(req, res) {
  new Movie({ name: req.body.moviename }).fetch()
  .then(function(foundMovie) {
  	if (foundMoive) {
  		return foundMoive;
  	} else {
  		return exports.addMovie(req, res);
  	}
  })
  .then(function(foundMovie) {
		return new User({ name: req.body.username }).fetch()
		.then(function(foundUser) {
			return new Rating({ movieid: foundMoive.id, userid: foundUser.id }).fetch()
			.then(function(foundRating) {
				if (foundRating) {
  				return new Ratings({'id': foundRating.id}).save({
					    rating: req.body.rating
					});
				} else {
			    return Ratings.create({
			    	rating: req.body.rating,
			      userid: foundUser.id,
			      password: foundMoive.id
			    });					
				}
			});
		});
	})
	.then(function(newRating) {
		console.log('rating created:', newRating);
  	res.status(201).send('rating recieved');
	})
};

//this function adds the movie into database
//expects req.body to have this: { moviename: 'name', genre: 'genre', poster: 'link', release_date: 'year' }
//this function will only ever be called inside exports.rateMovie
exports.addMovie = function(req, res) {
	console.log('calling addMovie');
  return Movies.create({
    title: req.body.title,
    genre: req.body.genre,
    release_date: req.body.release_date,
    poster: req.body.poster
  })
  .then(function(newMovie) {
  	console.log('movie created', newMovie);
  	return newMovie;
  	// res.status(201).send('created');
  })
};

// exports.getUserRating = function(req, res) {

// }

//get all movie ratings that a user rated
//should return an array that look like the following:
// [ {movieName: 'name', rating: 'rating'}, {movieName2: 'name', rating2: 'rating'} ... ]
// expects obj: {username: 'name'}
exports.getUserRating = function(req, res) {
  new User({ name: req.body.username }).fetch().then(function(foundUser) {
    new Rating({ userid: foundUser.id })
    // HAVE NOT TESTED THIS, NOT SURE THIS IS WORKING YET
    .fetchAll({ withRelated: ['movies'] })
    .then(function(foundRatings) {
      console.log(foundRatings);
    });
  });
};


////////////////////////
/////friendship handlers
////////////////////////

//this would send a notice to the user who receive the friend request, prompting them to accept or deny the request
exports.addFriend = function(req, res) {

};


//this would confirm the friendship and establish the relationship in the database
exports.confirmFriendship = function(req, res) {

};


//this would retrieve all of user's friends
//data would look like the following:
//[{name: 'name'}, {name: 'name'} ... ]
exports.getFriends = function(req, res) {

};


//TBD
exports.getHighCompatibilityUsers = function(req, res) {
  
};


//TBD
exports.getRecommendedMovies = function(req, res) {

};

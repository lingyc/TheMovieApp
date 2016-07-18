var db = require('../app/dbConnection');
var mysql = require('mysql');

var Movie = require('../app/models/movie');
var Rating = require('../app/models/rating');
var Relation = require('../app/models/relation');
var User = require('../app/models/user');

var Movies = require('../app/collections/movies');
var Ratings = require('../app/collections/ratings');
var Relations = require('../app/collections/relations');
var Users = require('../app/collections/users');
var Promise = require("bluebird");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "MainDatabase"
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

/////////////////
////user auth
/////////////////


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


/////////////////////
/////movie handlers
/////////////////////

//a handeler that takes a rating from user and add it to the database
// expects req.body to have this: {username: 'name', title: 'name', genre: 'genre', poster: 'link', release_date: 'year', rating: 'number'}
exports.rateMovie = function(req, res) {
	var userid;
	var movieid;

  new Movie({ title: req.body.title }).fetch()
  .then(function(foundMovie) {
  	if (foundMovie) {
  		console.log('movie found');
  		return foundMovie;
  	} else {
  		return exports.addMovie(req.body);
  	}
  })
  .then(function(foundMovie) {
		movieid = foundMovie.attributes.id;
		return new User({ username: req.body.username }).fetch()
		.then(function(foundUser) {
			userid = foundUser.attributes.id;
			return new Rating({ movieid: movieid, userid: userid }).fetch()
			.then(function(foundRating) {
				if (foundRating) {
					console.log('update rating', foundRating)
  				return new Rating({'id': foundRating.attributes.id}).save({
					    score: req.body.rating
					});
				} else {
					console.log('creating rating');
			    return Ratings.create({
			    	score: req.body.rating,
			      userid: userid,
			      movieid: movieid
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
  })
};

var addOneMovie = function(movieObj) {
	console.log('calling addMovie');
  return Movies.create({
    title: movieObj.title,
    genre: movieObj.genre,
    release_date: movieObj.release_date,
    poster: movieObj.poster
  })
  .then(function(newMovie) {
  	console.log('movie created', newMovie);
  	return newMovie;
  })
};


//get all movie ratings that a user rated
//should return an array that look like the following:
// [ {title: 'name', genre: 'genre' , poster: 'url', release_date: 'date', score: n, friendAverageRating: n} ... ]
// expects obj: {username: 'name'}
exports.getUserRatings = function(req, res) {
  Rating.query(function(qb){
  	qb.innerJoin('users', 'ratings.userid', '=', 'users.id');
  	qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
  	qb.select('users.username', 'movies.title', 'movies.genre', 'movies.poster', 'movies.release_date', 'ratings.score');
  	qb.where('users.username', '=', req.query.username);
  })
  .fetchAll()
  //this fetch all user ratings
  //but the ratings doesn't have friend average rating yet, the following adds it
  .then(function(ratings){
		return Promise.map(ratings.models, function(rating) {
			return exports.getFriendRatings(req.query.username, rating.attributes.title)
			.then(function(friendsRatings){
				// console.log('friendsRatings', averageRating(friendsRatings));
				//if friendsRatings is null, Rating.attributes.friendAverageRating is null
				if (!friendsRatings) {
					rating.attributes.friendAverageRating = null;
				} else {
					rating.attributes.friendAverageRating = averageRating(friendsRatings);
				}
				return rating;
			})
		})
  })
  .then(function(ratings) {
  	console.log('retriving all user ratings', ratings);
  	res.status(200).json(ratings);
  })
};


//this function outputs ratings of a user's friend for a particular movie
//expect current username and movieTitle as input
//outputs: {user2id: 'id', title:'movieTitle', score:n }
exports.getFriendRatings = function(username, movieTitle) {
	// console.log('getting friend ratings', username, movieTitle);
	return User.query(function(qb){
		qb.innerJoin('relations', 'relations.user1id', '=', 'users.id');
		qb.innerJoin('ratings', 'ratings.userid', '=', 'relations.user2id');
		qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
		qb.select('relations.user2id', 'movies.title', 'ratings.score');
		qb.where({
			'users.username': username, 
			'movies.title': movieTitle });
	})
	.fetchAll()
	.then(function(friendsRatings){
		//if no friend has rated the movie, return null
		if (!friendsRatings) {
			return null;
		} else {
			return friendsRatings.models;
		}
	});
};


//a helper function that averages the rating
//inputs ratings, outputs the average score;
var averageRating = function(ratings) {
	return ratings
	.reduce(function(total, rating){
		return total += rating.attributes.score;
	}, 0) / ratings.length
}


//a helper function that outputs user rating and average friend rating for one movie
//outputs: {title: 'name', genre: 'genre' , poster: 'url', release_date: 'date', score: n, friendAverageRating: n}
var getOneMovieRating = function(username, movieTitle, movieObj) {
  return Rating.query(function(qb){
  	qb.innerJoin('users', 'ratings.userid', '=', 'users.id');
  	qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
  	qb.select('users.username', 'movies.title', 'movies.genre', 'movies.poster', 'movies.release_date', 'ratings.score');
  	qb.where({'users.username': username, 'movies.title': movieTitle});
  })
  .fetch()
  .then(function(rating){
  	if (!rating) {
			//return null to score when a rating doesn't exit
  		rating.attributes = reqBody
  		rating.attributes.score = null;
  	}
		return exports.getFriendRatings(username, movieTitle)
		.then(function(friendsRatings){
			// console.log('rating', rating)
			rating.attributes.friendAverageRating = averageRating(friendsRatings);
			return rating;
		})
  })
}


//this handler is specifically for sending out a list of movie ratings when the client sends a list of movie to the server
//outputs [ {title: 'name', genre: 'genre' , poster: 'url', release_date: 'date', score: n, friendAverageRating: n} ... ]
exports.getMultipleMovieRatings = function(req, res) {
	req.body.movies = [{title: 'matrix'}, {title: 'starwars'}];
	Promise.map(req.body.movies, function(movie) {
		//first check whether movie is in the database
		return new Movie({title: movie.title}).fetch()
		.then(function(foundMovie) {
			//if not create one
			if (!foundMovie) {
				return addOneMovie(movie);
			} else {
				return foundMovie;
			}
		})
		.then(function(foundMovie){
			// console.log('found movie', foundMovie);
			return getOneMovieRating(req.body.username, movie.title, foundMovie.attributes);
		})
	})
	.then(function(ratings){
		// console.log('sending ratings', ratings);
		res.json(ratings);
	})
}


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
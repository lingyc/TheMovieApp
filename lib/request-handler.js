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
//var sessions = require("client-sessions");
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
console.log('this is a test!')


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
	con.query('SELECT * FROM users',function(err,rows){
  if(err) throw err;

  console.log('Data received from Db:\n');
  console.log(rows);
});
	
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
  		return exports.addMovie(req, res);
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

//get all movie ratings that a user rated
//should return an array that look like the following:
// [ {title: 'name', genre: 'genre' , poster: 'url', release_date: 'date', rating: n, friendAverageRating: n} ... ]
// expects obj: {username: 'name'}
exports.getUserRating = function(req, res) {
  Rating.query(function(qb){
  	qb.innerJoin('users', 'ratings.userid', '=', 'users.id');
  	qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
  	qb.select('users.username', 'movies.title', 'movies.genre', 'movies.poster', 'movies.release_date', 'ratings.score');
  	qb.where('users.username', '=', req.query.username);
  })
  .fetchAll()
  .then(function(users){
  	console.log(users.models);
  	res.status(200).send('found user rating');
  })
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

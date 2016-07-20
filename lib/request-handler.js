var db = require('../app/dbConnection');
var mysql = require('mysql');
var express = require('express');
var Movie = require('../app/models/movie');
var Rating = require('../app/models/rating');
var Relation = require('../app/models/relation');
var User = require('../app/models/user');
var FriendRequest = require('../app/models/friendRequest');
var WatchRequest = require('../app/models/watchRequest');

var Movies = require('../app/collections/movies');
var Ratings = require('../app/collections/ratings');
var Relations = require('../app/collections/relations');
var Users = require('../app/collections/users');
var FriendRequests = require('../app/collections/friendRequests');
var WatchRequests = require('../app/collections/watchRequests');

var Promise = require("bluebird");
var request = require('request');

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

exports.sendRequest = function(req, response) {
  console.log('this is what Im getting', req.body);

var request = {requestor: req.mySession.user, requestee: req.body.name };

con.query('INSERT INTO friendRequests SET ?', request, function(err,res){
  if(err) throw err;
  console.log('Last insert ID:', res.insertId);
  response.send('Thats my style!!!');
});

 
};

exports.listRequests = function(req, response) {
  var request = req.mySession.user

  con.query('Select * FROM friendRequests WHERE requestee= ?', request, function(err,res){
  if(err) throw err;
  console.log(res)
  response.send(res);
});


};

exports.accept = function(req, response) {
 var requestor=req.body.personToAccept;
 var requestee=req.mySession.user;
con.query('DELETE FROM friendRequests WHERE requestor = '+'"'+ requestor+'"'+' AND requestee='+'"'+ requestee+'"', function(err, res) {
        if (err) throw err;
        console.log('Last insert ID:', res.insertId);
    
      });

  con.query('SELECT id FROM users WHERE username = ?', req.body.personToAccept, function(err, res) {
    if (err) throw err;
    console.log('Last insert ID:', res[0].id, err);
    var person1 = res[0].id
    con.query('SELECT id FROM users WHERE username = ?', req.mySession.user, function(err, resp) {
      if (err) throw err;
      console.log('Last insert ID:', resp[0].id, err);

      var person2 = resp[0].id
      var request = {
        user1id: person1,
        user2id: person2
      }
      con.query('INSERT INTO relations SET ?', request, function(err, res) {
        if (err) throw err;
        console.log('Last insert ID:', res.insertId);
        response.send('Thats my style!!!');
      });
    })
  })
};




exports.decline=function(req,response){
  var requestor=req.body.personToDecline;
 var requestee=req.mySession.user;

 con.query('DELETE FROM friendRequests WHERE requestor = '+'"'+ requestor+'"'+' AND requestee='+'"'+ requestee+'"', function(err, res) {
        if (err) throw err;
        console.log('Last insert ID:', res.insertId);
      response.send(requestor + 'deleted');
      });
}





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
// expects req.body to have this: {title: 'name', genre: 'genre', poster: 'link', release_date: 'year', rating: 'number'}
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
		return new User({ username: req.mySession.user }).fetch()
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
		console.log('rating created:', newRating.attributes.title);
  	res.status(201).send('rating recieved');
	})
};

//this helper function adds the movie into database
//it follows the same movie id as TMDB
//expects req.body to have these atribute : {id, title, genre, poster_path, release_date, overview, vote_average}
var addOneMovie = function(movieObj) {
	var genre = (movieObj.genre_ids) ? genres[movieObj.genre_ids[0]] : 'n/a';
  return new Movie({
  	id: movieObj.id,
    title: movieObj.title,
    genre: genre,
    poster: 'https://image.tmdb.org/t/p/w185/' + movieObj.poster_path,
    release_date: movieObj.release_date,
    description: movieObj.overview.slice(0, 255),
    imdbRating: movieObj.vote_average
  }).save(null, {method: 'insert'})
  .then(function(newMovie) {
  	console.log('movie created', newMovie.attributes.title);
  	return newMovie;
  })
};


//get all movie ratings that a user rated
//should return an array that look like the following:
// [ {title: 'name', genre: 'genre' , poster: 'url', release_date: 'date', score: n, friendAverageRating: n} ... ]
// expects req.mySession.user as input
exports.getUserRatings = function(req, res) {
  Rating.query(function(qb){
  	qb.innerJoin('users', 'ratings.userid', '=', 'users.id');
  	qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
  	qb.select('users.username', 'movies.title', 'movies.genre', 'movies.poster', 'movies.release_date', 'movies.imdbRating', 'movies.description', 'ratings.score', 'ratings.review');
  	qb.where('users.username', '=', req.mySession.user);
  })
  .fetchAll()
  //this fetch all user ratings
  //but the ratings doesn't have friend average rating yet, the following adds it
  .then(function(ratings){
		return Promise.map(ratings.models, function(rating) {
			return exports.getFriendRatings(req.mySession.user, rating.attributes)
			.then(function(friendsRatings){
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
  	console.log('retriving all user ratings');
  	res.status(200).json(ratings);
  })
};


//this function outputs ratings of a user's friend for a particular movie
//expect current username and movieTitle as input
//outputs: {user2id: 'id', friendUserName:'name', friendFirstName:'name', title:'movieTitle', score:n }
exports.getFriendRatings = function(username, movieObj) {
	return User.query(function(qb){
		qb.innerJoin('relations', 'relations.user1id', '=', 'users.id');
		qb.innerJoin('ratings', 'ratings.userid', '=', 'relations.user2id');
		qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
		qb.select('relations.user2id', 'movies.title', 'ratings.score');
		qb.where({
			'users.username': username, 
			'movies.title': movieObj.attributes.title,
			'movies.id': movieObj.attributes.id });
	})
	.fetchAll()
	.then(function(friendsRatings){
	//the following block adds the friendName attribute to the ratings
		return Promise.map(friendsRatings.models, function(friendRating) {
			return new User({ id: friendRating.attributes.user2id }).fetch()
			.then(function(friend){
				friendRating.attributes.friendUserName = friend.attributes.username;
				friendRating.attributes.friendFirstName = friend.attributes.firstName;
				return friendRating;
			});
		});
	})
	.then(function(friendsRatings){
		return friendsRatings;
	});
};


//a helper function that averages the rating
//inputs ratings, outputs the average score;
var averageRating = function(ratings) {
	//return null if no friend has rated the movie
	if (ratings.length === 0) {
		return null;
	}
	return ratings
	.reduce(function(total, rating){
		return total += rating.attributes.score;
	}, 0) / ratings.length;
}


//a helper function that outputs user rating and average friend rating for one movie
//outputs one rating obj: {title: 'name', genre: 'genre' , poster: 'url', release_date: 'date', score: n, friendAverageRating: n}
var getOneMovieRating = function(username, movieObj) {
	console.log('getOneMovieRating');
  return Rating.query(function(qb){
  	qb.innerJoin('users', 'ratings.userid', '=', 'users.id');
  	qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
  	qb.select('users.username', 'movies.title', 'movies.genre', 'movies.poster', 'movies.release_date', 'movies.imdbRating', 'movies.description', 'ratings.score', 'ratings.review');
  	qb.where({'users.username': username, 'movies.title': movieObj.title, 'movies.id': movieObj.id});
  })
  .fetch()
  .then(function(rating){
	  if (!rating) {
	  	//if the user has not rated the movie, return an obj that has the movie information, but score is set to null
	  	return new Movie({title: movieObj.title, id: movieObj.id}).fetch()
	  	.then(function(movie) {
	  		movie.attributes.score = null;
	  		return movie;
	  	})
	  } else {
	  	return rating;
	  }
	})
	.then(function(rating){
		return exports.getFriendRatings(username, rating)
		.then(function(friendsRatings){
			// console.log('friendsRatings', friendsRatings);
			rating.attributes.friendAverageRating = averageRating(friendsRatings);
			console.log('added average friend rating', rating.attributes.title, rating.attributes.friendAverageRating);
			return rating;
		});
	});
}


//this handler is specifically for sending out a list of movie ratings when the client sends a list of movie to the server
//expects req.body to be an array of obj with these attributes: {id, title, genre, poster_path, release_date, overview, vote_average}
//outputs [ {title: 'name', genre: 'genre' , poster: 'url', release_date: 'date', score: n, friendAverageRating: n} ... ]
exports.getMultipleMovieRatings = function(req, res) {
	console.log('getMultipleMovieRatings');
	Promise.map(req.body.movies, function(movie) {
		//first check whether movie is in the database
		return new Movie({title: movie.title, id: movie.id}).fetch()
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
			return getOneMovieRating(req.mySession.user, foundMovie.attributes);
		})
	})
	.then(function(ratings){
		console.log('sending rating to client');
		res.json(ratings);
	})
}

//this handler sends an get request to TMDB API to retrive recent titles
//we cannot do it in the front end because cross origin request issues
exports.getRecentRelease = function(req, res) {
  var params = {
    api_key: '9d3b035ef1cd669aed398400b17fcea2',
    primary_release_year: new Date().getFullYear(),
    sort_by: 'popularity.desc'
  };

  var data = '';
	request({
		method: 'GET',
		url: 'https://api.themoviedb.org/3/discover/movie/',
		qs: params
	})
	.on('data',function(chunk){
		data += chunk;
	})
	.on('end', function(){
		recentMovies = JSON.parse(data);
    req.body.movies = recentMovies.results;
    //transfers the movie data to getMultipleMovieRatings to decorate with score (user rating) and avgfriendRating attribute
    exports.getMultipleMovieRatings(req, res);

	})
	.on('error', function(error){
		console.log(error);
	})
}

//this is TMDB's genre code, we might want to place this somewhere else
var genres = {
   12: "Adventure",
   14: "Fantasy",
   16: "Animation",
   18: "Drama",
   27: "Horror",
   28: "Action",
   35: "Comedy",
   36: "History",
   37: "Western",
   53: "Thriller",
   80: "Crime",
   99: "Documentary",
   878: "Science Fiction",
   9648: "Mystery",
   10402: "Music",
   10749: "Romance",
   10751: "Family",
   10752: "War",
   10769: "Foreign",
   10770: "TV Movie"
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
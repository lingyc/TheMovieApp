'use strict';

//////////////////
///////////////The algorithm
/////////////////////
var helper = function helper(num1, num2) {
	var diff = Math.abs(num1 - num2);
	return 5 - diff;
};

var comp = function comp(first, second) {
	var final = [];
	for (var i = 0; i < first.length; i++) {

		for (var x = 0; x < second.length; x++) {

			if (first[i][0] === second[x][0]) {

				final.push(helper(first[i][1], second[x][1]));
			}
		}
	}
	var sum = final.reduce(function (a, b) {
		return a + b;
	}, 0);
	return Math.round(20 * sum / final.length);
};
///////////////////////////////
/////////////////////////////
//////////////////////////

var db = require('../app/dbConnection');
var mysql = require('mysql');
var express = require('express');
var Movie = require('../app/models/movie');
var Rating = require('../app/models/rating');
var Relation = require('../app/models/relation');
var User = require('../app/models/user');
var allRequest = require('../app/models/allRequest');

var Movies = require('../app/collections/movies');
var Ratings = require('../app/collections/ratings');
var Relations = require('../app/collections/relations');
var Users = require('../app/collections/users');
var allRequests = require('../app/collections/allRequests');

var Promise = require("bluebird");
var request = require('request');

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "12345",
	database: "MainDatabase"
});

con.connect(function (err) {
	if (err) {
		console.log('Error connecting to Db');
		return;
	}
	console.log('Connection established');
});

/////////////////
////user auth
/////////////////

exports.signupUser = function (req, res) {
	console.log('calling login', req.body);
	console.log('this is the session', req.session);
	new User({ username: req.body.name }).fetch().then(function (found) {
		if (found) {
			//check password
			//if (password matches)
			//{ add sessions and redirect}
			res.redirect('/signup');
		} else {
			console.log('creating user');
			Users.create({
				username: req.body.name,
				password: req.body.password
			}).then(function (user) {
				console.log('created a new user');

				res.redirect('/login');
			});
		}
	});
};

exports.sendWatchRequest = function (req, response) {
	console.log(req.body.requestee);
	if (Array.isArray(req.body.requestee)) {
		var requestees = req.body.requestee;
	} else {
		var requestees = [req.body.requestee];
	}
	Promise.each(requestees, function (requestee) {
		var request = {
			requestor: req.mySession.user,
			requestTyp: 'watch',
			movie: req.body.movie,
			requestee: requestee
		};
		con.query('INSERT INTO allrequests SET ?', request, function (err, res) {
			if (err) throw err;
			console.log('Last insert ID:', res.insertId);
		});
	}).then(function (done) {
		response.send('Thats my style!');
	});
};

exports.sendRequest = function (req, response) {
	console.log('this is what Im getting', req.body);
	if (req.mySession.user === req.body.name) {
		response.send("you can't friend yourself!");
	} else {

		var request = { requestor: req.mySession.user, requestee: req.body.name, requestTyp: 'friend' };

		con.query('INSERT INTO allrequests SET ?', request, function (err, res) {
			if (err) throw err;
			console.log('Last insert ID:', res.insertId);
			response.send('Thats my style!!!');
		});
	}
};

exports.listRequests = function (req, response) {
	var request = req.mySession.user;

	con.query('Select * FROM allrequests WHERE requestee=' + '"' + request + '"' + '' + 'OR requestor =' + '"' + request + '"' + '', function (err, res) {
		if (err) throw err;
		console.log(res);
		response.send([res, request]);
	});
};

exports.accept = function (req, response) {
	var requestor = req.body.personToAccept;
	var requestee = req.mySession.user;

	con.query('UPDATE allrequests SET response=' + '"' + 'yes' + '"' + '  WHERE requestor = ' + '"' + requestor + '"' + ' AND requestee=' + '"' + requestee + '"', function (err, res) {
		if (err) throw err;
		console.log('Last insert ID:', res.insertId);
	});

	con.query('SELECT id FROM users WHERE username = ?', req.body.personToAccept, function (err, res) {
		if (err) throw err;
		console.log('Last insert ID:', res[0].id, err);
		var person1 = res[0].id;
		con.query('SELECT id FROM users WHERE username = ?', req.mySession.user, function (err, resp) {
			if (err) throw err;
			console.log('Last insert ID:', resp[0].id, err);

			var person2 = resp[0].id;
			var request = {
				user1id: person1,
				user2id: person2
			};
			var request2 = {
				user1id: person2,
				user2id: person1
			};

			console.log('the requests:::', request, request2);
			con.query('INSERT INTO relations SET ?', request, function (err, res) {
				if (err) throw err;
				console.log('Last insert ID:', res.insertId);

				con.query('INSERT INTO relations SET ?', request2, function (err, res) {
					if (err) throw err;
					console.log('Last insert ID:', res.insertId);

					response.send('Thats my style!!!');
				});
			});
		});
	});
};

exports.getThisFriendsMovies = function (req, response) {

	var movies = [];
	console.log(req.body.specificFriend);
	var person = req.body.specificFriend;
	var id = null;
	var len = null;
	con.query('SELECT id FROM users WHERE username = ?', person, function (err, resp) {
		console.log(resp);
		id = resp[0].id;

		con.query('SELECT * FROM ratings WHERE userid = ?', id, function (err, resp) {
			console.log('errrrrrrrr', err, resp.length);
			len = resp.length;
			resp.forEach(function (a) {

				con.query('SELECT title FROM movies WHERE id = ?', a.movieid, function (err, resp) {
					console.log(resp);
					movies.push([resp[0].title, a.score, a.review]);
					console.log(movies);
					if (movies.length === len) {
						response.send(movies);
					}
				});
			});
		});
	});
};

exports.findMovieBuddies = function (req, response) {
	console.log("you're trying to find buddies!!");
	con.query('SELECT * FROM users', function (err, resp) {
		var people = resp.map(function (a) {
			return a.username;
		});
		var Ids = resp.map(function (a) {
			return a.id;
		});
		var idKeyObj = {};
		for (var i = 0; i < Ids.length; i++) {
			idKeyObj[Ids[i]] = people[i];
		}
		console.log('current user', req.mySession.user);
		var currentUser = req.mySession.user;

		var obj1 = {};
		for (var i = 0; i < Ids.length; i++) {
			obj1[idKeyObj[Ids[i]]] = [];
		}

		con.query('SELECT score,movieid,userid FROM ratings', function (err, respon) {

			for (var i = 0; i < respon.length; i++) {
				obj1[idKeyObj[respon[i].userid]].push([respon[i].movieid, respon[i].score]);
			}

			console.log('obj1', obj1);
			currentUserInfo = obj1[currentUser];
			//console.log('currentUserInfo',currentUserInfo)
			var comparisons = {};

			for (var key in obj1) {
				if (key !== currentUser) {
					comparisons[key] = comp(currentUserInfo, obj1[key]);
				}
			}
			console.log(comparisons);
			var finalSend = [];
			for (var key in comparisons) {
				if (comparisons[key] !== 'NaN%') {
					finalSend.push([key, comparisons[key]]);
				} else {
					finalSend.push([key, "No Comparison to Make"]);
				}
			}

			response.send(finalSend);
		});
	});
};

exports.decline = function (req, response) {
	var requestor = req.body.personToDecline;
	var requestee = req.mySession.user;

	con.query('UPDATE allrequests SET response=' + '"' + 'no' + '"' + ' WHERE requestor = ' + '"' + requestor + '"' + ' AND requestee=' + '"' + requestee + '"', function (err, res) {
		if (err) throw err;
		console.log('Last insert ID:', res.insertId);
		response.send(requestor + 'deleted');
	});
};

exports.signinUser = function (req, res) {
	console.log('calling signin', req.body);
	new User({ username: req.body.name }).fetch().then(function (found) {

		if (found) {
			new User({ username: req.body.name, password: req.body.password }).fetch().then(function (found) {
				if (found) {
					req.mySession.user = found.attributes.username;
					console.log(found.attributes.username);
					console.log('we found you!!');
					res.send(['it worked', req.mySession.user]);
				} else {
					console.log('sorry, no match!!!');
				}
			});
		} else {
			console.log('no such user');
		}
	});
};

exports.logout = function (req, res) {
	req.mySession.destroy(function (err) {
		console.log(err);
	});
	console.log('logout');
	res.send('logout');
};

/////////////////////
/////movie handlers
/////////////////////

//a handeler that takes a rating from user and add it to the database
// expects req.body to have this: {title: 'name', genre: 'genre', poster: 'link', release_date: 'year', rating: 'number'}
exports.rateMovie = function (req, res) {
	console.log('calling rateMovie');
	var userid;
	return new User({ username: req.mySession.user }).fetch().then(function (foundUser) {
		userid = foundUser.attributes.id;
		return new Rating({ movieid: req.body.id, userid: userid }).fetch().then(function (foundRating) {
			if (foundRating) {
				//since rating or review is updated seperatly in client, the following
				//make sure it gets updated according to the req
				// console.log('update rating', foundRating)
				if (req.body.rating) {
					var ratingObj = { score: req.body.rating };
				} else if (req.body.review) {
					var ratingObj = { review: req.body.review };
				}
				return new Rating({ 'id': foundRating.attributes.id }).save(ratingObj);
			} else {
				console.log('creating rating');
				return Ratings.create({
					score: req.body.rating,
					userid: userid,
					movieid: req.body.id,
					review: req.body.review
				});
			}
		});
	}).then(function (newRating) {
		console.log('rating created:', newRating.attributes);
		res.status(201).send('rating recieved');
	});
};

//this helper function adds the movie into database
//it follows the same movie id as TMDB
//expects req.body to have these atribute : {id, title, genre, poster_path, release_date, overview, vote_average}
var addOneMovie = function addOneMovie(movieObj) {
	var genre = movieObj.genre_ids ? genres[movieObj.genre_ids[0]] : 'n/a';
	return new Movie({
		id: movieObj.id,
		title: movieObj.title,
		genre: genre,
		poster: 'https://image.tmdb.org/t/p/w185/' + movieObj.poster_path,
		release_date: movieObj.release_date,
		description: movieObj.overview.slice(0, 255),
		imdbRating: movieObj.vote_average
	}).save(null, { method: 'insert' }).then(function (newMovie) {
		console.log('movie created', newMovie.attributes.title);
		return newMovie;
	});
};

//get all movie ratings that a user rated
//should return an array that look like the following:
// [ {title: 'name', genre: 'genre' , poster: 'url', release_date: 'date', score: n, friendAverageRating: n} ... ]
// will get ratings for the current user
exports.getUserRatings = function (req, res) {
	Rating.query(function (qb) {
		qb.innerJoin('users', 'ratings.userid', '=', 'users.id');
		qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
		qb.select('users.username', 'movies.title', 'movies.id', 'movies.genre', 'movies.poster', 'movies.release_date', 'movies.imdbRating', 'movies.description', 'ratings.score', 'ratings.review', 'ratings.updated_at');
		qb.where('users.username', '=', req.mySession.user);
		qb.orderBy('updated_at', 'DESC');
	}).fetchAll().then(function (ratings) {
		//decorate it with avg friend rating
		return Promise.map(ratings.models, function (rating) {
			return attachFriendAvgRating(rating, req.mySession.user);
		});
	}).then(function (ratings) {
		console.log('retriving all user ratings');
		res.status(200).json(ratings);
	});
};

exports.getFriendUserRatings = function (req, res) {
	Rating.query(function (qb) {
		qb.innerJoin('users', 'ratings.userid', '=', 'users.id');
		qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
		qb.select('users.username', 'movies.title', 'movies.id', 'movies.genre', 'movies.poster', 'movies.release_date', 'movies.imdbRating', 'movies.description', 'ratings.score as friendScore', 'ratings.review as friendReview', 'ratings.updated_at');
		qb.where('users.username', '=', req.query.friendName);
		qb.orderBy('updated_at', 'DESC');
	}).fetchAll().then(function (ratings) {
		//decorate it with current user's rating
		return Promise.map(ratings.models, function (rating) {
			return attachUserRating(rating, req.mySession.user);
		});
	}).then(function (ratings) {
		console.log('retriving all user ratings');
		res.status(200).json(ratings);
	});
};

//a decorator function that attaches friend avg rating to the rating obj
var attachFriendAvgRating = function attachFriendAvgRating(rating, username) {
	return exports.getFriendRatings(username, rating).then(function (friendsRatings) {
		//if friendsRatings is null, Rating.attributes.friendAverageRating is null
		if (!friendsRatings) {
			rating.attributes.friendAverageRating = null;
		} else {
			rating.attributes.friendAverageRating = averageRating(friendsRatings);
		}
		return rating;
	});
};

//a decorator function that attaches user rating and reviews to the rating obj
var attachUserRating = function attachUserRating(rating, username) {
	return Rating.query(function (qb) {
		qb.innerJoin('users', 'users.id', '=', 'ratings.userid');
		qb.innerJoin('movies', 'movies.id', '=', 'ratings.movieid');
		qb.select('ratings.score', 'ratings.review');
		qb.where({
			'users.username': username,
			'movies.title': rating.attributes.title,
			'movies.id': rating.attributes.id
		});
	}).fetch().then(function (userRating) {
		if (userRating) {
			rating.attributes.score = userRating.attributes.score;
			rating.attributes.review = userRating.attributes.review;
		} else {
			rating.attributes.score = null;
			rating.attributes.review = null;
		}
		return rating;
	});
};

//this is a wraper function for getFriendRatings which will sent the client all of the friend ratings
exports.handleGetFriendRatings = function (req, res) {
	console.log('handleGetFriendRatings, ', req.mySession.user, req.body.movie.title);
	exports.getFriendRatings(req.mySession.user, { attributes: req.body.movie }).then(function (friendRatings) {
		res.json(friendRatings);
	});
};

//this function outputs ratings of a user's friend for a particular movie
//expect current username and movieTitle as input
//outputs: {user2id: 'id', friendUserName:'name', friendFirstName:'name', title:'movieTitle', score:n }
exports.getFriendRatings = function (username, movieObj) {
	return User.query(function (qb) {
		qb.innerJoin('relations', 'relations.user1id', '=', 'users.id');
		qb.innerJoin('ratings', 'ratings.userid', '=', 'relations.user2id');
		qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
		qb.select('relations.user2id', 'movies.title', 'ratings.score', 'ratings.review');
		qb.where({
			'users.username': username,
			'movies.title': movieObj.attributes.title,
			'movies.id': movieObj.attributes.id });
	}).fetchAll().then(function (friendsRatings) {
		//the following block adds the friendName attribute to the ratings
		return Promise.map(friendsRatings.models, function (friendRating) {
			return new User({ id: friendRating.attributes.user2id }).fetch().then(function (friend) {
				friendRating.attributes.friendUserName = friend.attributes.username;
				friendRating.attributes.friendFirstName = friend.attributes.firstName;
				return friendRating;
			});
		});
	}).then(function (friendsRatings) {
		return friendsRatings;
	});
};

//a helper function that averages the rating
//inputs ratings, outputs the average score;
var averageRating = function averageRating(ratings) {
	//return null if no friend has rated the movie
	if (ratings.length === 0) {
		return null;
	}
	return ratings.reduce(function (total, rating) {
		return total += rating.attributes.score;
	}, 0) / ratings.length;
};

//a helper function that outputs user rating and average friend rating for one movie
//outputs one rating obj: {title: 'name', genre: 'genre' , poster: 'url', release_date: 'date', score: n, friendAverageRating: n}
var getOneMovieRating = function getOneMovieRating(username, movieObj) {
	return Rating.query(function (qb) {
		qb.innerJoin('users', 'ratings.userid', '=', 'users.id');
		qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
		qb.select('users.username', 'movies.title', 'movies.id', 'movies.genre', 'movies.poster', 'movies.release_date', 'movies.imdbRating', 'movies.description', 'ratings.score', 'ratings.review');
		qb.where({ 'users.username': username, 'movies.title': movieObj.title, 'movies.id': movieObj.id });
	}).fetch().then(function (rating) {
		if (!rating) {
			//if the user has not rated the movie, return an obj that has the movie information, but score is set to null
			return new Movie({ title: movieObj.title, id: movieObj.id }).fetch().then(function (movie) {
				movie.attributes.score = null;
				return movie;
			});
		} else {
			return rating;
		}
	}).then(function (rating) {
		return exports.getFriendRatings(username, rating).then(function (friendsRatings) {
			// console.log('friendsRatings', friendsRatings);
			rating.attributes.friendAverageRating = averageRating(friendsRatings);
			console.log('added average friend rating', rating.attributes.title, rating.attributes.friendAverageRating);
			return rating;
		});
	});
};

//this handler is specifically for sending out a list of movie ratings when the client sends a list of movie to the server
//expects req.body to be an array of obj with these attributes: {id, title, genre, poster_path, release_date, overview, vote_average}
//outputs [ {title: 'name', genre: 'genre' , poster: 'url', release_date: 'date', score: n, friendAverageRating: n} ... ]
exports.getMultipleMovieRatings = function (req, res) {
	console.log('getMultipleMovieRatings');
	Promise.map(req.body.movies, function (movie) {
		//first check whether movie is in the database
		return new Movie({ title: movie.title, id: movie.id }).fetch().then(function (foundMovie) {
			//if not create one
			if (!foundMovie) {
				return addOneMovie(movie);
			} else {
				return foundMovie;
			}
		}).then(function (foundMovie) {
			// console.log('found movie', foundMovie);
			return getOneMovieRating(req.mySession.user, foundMovie.attributes);
		});
	}).then(function (ratings) {
		console.log('sending rating to client');
		res.json(ratings);
	});
};

//this handler sends an get request to TMDB API to retrive recent titles
//we cannot do it in the front end because cross origin request issues
exports.getRecentRelease = function (req, res) {
	var params = {
		api_key: '9d3b035ef1cd669aed398400b17fcea2',
		primary_release_year: new Date().getFullYear(),
		include_adult: false,
		sort_by: 'popularity.desc'
	};

	var data = '';
	request({
		method: 'GET',
		url: 'https://api.themoviedb.org/3/discover/movie/',
		qs: params
	}).on('data', function (chunk) {
		data += chunk;
	}).on('end', function () {
		recentMovies = JSON.parse(data);
		req.body.movies = recentMovies.results;
		//transfers the movie data to getMultipleMovieRatings to decorate with score (user rating) and avgfriendRating attribute
		exports.getMultipleMovieRatings(req, res);
	}).on('error', function (error) {
		console.log(error);
	});
};

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

//this function will send back searcb movies user has rated in the database
//it will send back movie objs that match the search input, expects movie name in req.body.title
exports.searchRatedMovie = function (req, res) {
	return Rating.query(function (qb) {
		qb.innerJoin('users', 'ratings.userid', '=', 'users.id');
		qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
		qb.select('users.username', 'movies.title', 'movies.id', 'movies.genre', 'movies.poster', 'movies.release_date', 'movies.imdbRating', 'movies.description', 'ratings.score', 'ratings.review');
		qb.whereRaw('MATCH (movies.title) AGAINST (\'' + req.query.title + '\' IN NATURAL LANGUAGE MODE)');
		qb.andWhere('users.username', '=', req.mySession.user);
		qb.orderBy('updated_at', 'DESC');
	}).fetchAll().then(function (matches) {
		console.log(matches.models);
		res.json(matches);
	});
};

////////////////////////
/////friendship handlers
////////////////////////

exports.getFriendList = function (req, res) {
	return Relation.query(function (qb) {
		qb.innerJoin('users', 'relations.user1id', '=', 'users.id');
		qb.select('relations.user2id');
		qb.where({
			'users.username': req.mySession.user
		});
	}).fetchAll().then(function (friends) {
		return Promise.map(friends.models, function (friend) {
			return new User({ id: friend.attributes.user2id }).fetch().then(function (friendUser) {
				return friendUser.attributes.username;
			});
		});
	}).then(function (friends) {
		console.log('sending a list of friend names', friends);
		res.json(friends);
	});
};

//this would send a notice to the user who receive the friend request, prompting them to accept or deny the request
exports.addFriend = function (req, res) {};

//this would confirm the friendship and establish the relationship in the database
exports.confirmFriendship = function (req, res) {};

exports.getFriends = function (req, res) {
	var peopleId = [];
	var id = req.mySession.user;
	con.query('SELECT id FROM users WHERE username = ?', id, function (err, resp) {
		var userid = resp[0].id;

		con.query('SELECT * FROM ratings WHERE userid = ?', userid, function (err, resp) {
			var usersRatings = resp.map(function (a) {
				return [a.movieid, a.score];
			});

			con.query('SELECT * FROM relations WHERE user1id = ?', userid, function (err, resp) {
				for (var i = 0; i < resp.length; i++) {
					if (peopleId.indexOf(resp[i].user2id) === -1) {
						peopleId.push(resp[i].user2id);
					}
				}
				var people = [];
				var keyId = {};
				peopleId.forEach(function (a) {
					con.query('SELECT username FROM users WHERE id = ?', a, function (err, respo) {
						keyId[a] = respo[0].username;
						con.query('SELECT * FROM ratings WHERE userid =' + '"' + a + '"', function (err, resp) {
							people.push(resp.map(function (a) {
								return [a.userid, a.movieid, a.score];
							}));
							if (people.length === peopleId.length) {

								var final = {};

								for (var i = 0; i < people.length; i++) {
									final[keyId[people[i][0][0]]] = [];
									for (var x = 0; x < people[i].length; x++) {
										final[keyId[people[i][0][0]]].push([]);

										for (var z = 1; z < people[i][x].length; z++) {
											final[keyId[people[i][0][0]]][x].push(people[i][x][z]);
										}
									}
								}

								console.log('final', final, usersRatings);

								var comparisons = {};
								for (var key in final) {

									comparisons[key] = comp(usersRatings, final[key]);
								}

								console.log(comparisons);
								veryFinal = [];
								for (var key in comparisons) {
									veryFinal.push([key, comparisons[key]]);
								}
								console.log(veryFinal);

								res.send(veryFinal);
							}
						});
					});
				});
			});
		});
	});
};

//TBD
exports.getHighCompatibilityUsers = function (req, res) {};

//TBD
exports.getRecommendedMovies = function (req, res) {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9yZXF1ZXN0LWhhbmRsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQSxJQUFJLFNBQVEsU0FBUixNQUFRLENBQVMsSUFBVCxFQUFjLElBQWQsRUFBbUI7QUFDL0IsS0FBSSxPQUFLLEtBQUssR0FBTCxDQUFTLE9BQUssSUFBZCxDQUFUO0FBQ0EsUUFBTyxJQUFFLElBQVQ7QUFDQyxDQUhEOztBQUtBLElBQUksT0FBTyxTQUFQLElBQU8sQ0FBUyxLQUFULEVBQWdCLE1BQWhCLEVBQXdCO0FBQ25DLEtBQUksUUFBTyxFQUFYO0FBQ0UsTUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFHLE1BQU0sTUFBekIsRUFBaUMsR0FBakMsRUFBc0M7O0FBRXBDLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxPQUFPLE1BQTNCLEVBQW1DLEdBQW5DLEVBQXdDOztBQUV0QyxPQUFJLE1BQU0sQ0FBTixFQUFTLENBQVQsTUFBZ0IsT0FBTyxDQUFQLEVBQVUsQ0FBVixDQUFwQixFQUFrQzs7QUFFcEMsVUFBTSxJQUFOLENBQVcsT0FBTyxNQUFNLENBQU4sRUFBUyxDQUFULENBQVAsRUFBbUIsT0FBTyxDQUFQLEVBQVUsQ0FBVixDQUFuQixDQUFYO0FBRUc7QUFDRjtBQUNGO0FBQ0gsS0FBSSxNQUFLLE1BQU0sTUFBTixDQUFhLFVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYTtBQUFDLFNBQU8sSUFBRSxDQUFUO0FBQVcsRUFBdEMsRUFBdUMsQ0FBdkMsQ0FBVDtBQUNBLFFBQU8sS0FBSyxLQUFMLENBQVcsS0FBRyxHQUFILEdBQU8sTUFBTSxNQUF4QixDQUFQO0FBQ0MsQ0FmRDs7Ozs7QUF3QkEsSUFBSSxLQUFLLFFBQVEscUJBQVIsQ0FBVDtBQUNBLElBQUksUUFBUSxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUksVUFBVSxRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQUksUUFBUSxRQUFRLHFCQUFSLENBQVo7QUFDQSxJQUFJLFNB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LEVBQWtCLE1BQU0sR0FBTixDQUFsQixDQUFqQjtBQUNEOztBQUVILGdCQUFRLEdBQVIsQ0FBWSxXQUFaO0FBQ0Esb0JBQVUsRUFBVjtBQUNBLGFBQUssSUFBSSxHQUFULElBQWdCLFdBQWhCLEVBQTRCO0FBQzNCLG1CQUFVLElBQVYsQ0FBZSxDQUFDLEdBQUQsRUFBSyxZQUFZLEdBQVosQ0FBTCxDQUFmO0FBQ0E7QUFDRCxnQkFBUSxHQUFSLENBQVksU0FBWjs7QUFFQSxZQUFJLElBQUosQ0FBUyxTQUFUO0FBQ0M7QUFHQSxPQXRDTztBQXdDQyxNQTFDSDtBQTJDQyxLQTVDRDtBQTZDTCxJQXRERTtBQXVERSxHQTFERjtBQTREQSxFQS9ERDtBQWdFRCxDQW5FRDs7O0FBd0VBLFFBQVEseUJBQVIsR0FBb0MsVUFBUyxHQUFULEVBQWMsR0FBZCxFQUFtQixDQUV0RCxDQUZEOzs7QUFNQSxRQUFRLG9CQUFSLEdBQStCLFVBQVMsR0FBVCxFQUFjLEdBQWQsRUFBbUIsQ0FFakQsQ0FGRCIsImZpbGUiOiJyZXF1ZXN0LWhhbmRsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vL1RoZSBhbGdvcml0aG1cbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xudmFyIGhlbHBlcj0gZnVuY3Rpb24obnVtMSxudW0yKXtcbnZhciBkaWZmPU1hdGguYWJzKG51bTEtbnVtMik7XG5yZXR1cm4gNS1kaWZmO1xufVxuXG52YXIgY29tcCA9IGZ1bmN0aW9uKGZpcnN0LCBzZWNvbmQpIHtcbnZhciBmaW5hbD0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGk8IGZpcnN0Lmxlbmd0aDsgaSsrKSB7XG5cbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHNlY29uZC5sZW5ndGg7IHgrKykge1xuXG4gICAgICBpZiAoZmlyc3RbaV1bMF0gPT09IHNlY29uZFt4XVswXSkge1xuXG4gICAgZmluYWwucHVzaChoZWxwZXIoZmlyc3RbaV1bMV0sc2Vjb25kW3hdWzFdKSlcblxuICAgICAgfVxuICAgIH1cbiAgfVxudmFyIHN1bT0gZmluYWwucmVkdWNlKGZ1bmN0aW9uKGEsYil7cmV0dXJuIGErYn0sMCk7XG5yZXR1cm4gTWF0aC5yb3VuZCgyMCpzdW0vZmluYWwubGVuZ3RoKVxufVxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuXG5cblxudmFyIGRiID0gcmVxdWlyZSgnLi4vYXBwL2RiQ29ubmVjdGlvbicpO1xudmFyIG15c3FsID0gcmVxdWlyZSgnbXlzcWwnKTtcbnZhciBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xudmFyIE1vdmllID0gcmVxdWlyZSgnLi4vYXBwL21vZGVscy9tb3ZpZScpO1xudmFyIFJhdGluZyA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvcmF0aW5nJyk7XG52YXIgUmVsYXRpb24gPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL3JlbGF0aW9uJyk7XG52YXIgVXNlciA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvdXNlcicpO1xudmFyIGFsbFJlcXVlc3QgPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL2FsbFJlcXVlc3QnKTtcblxudmFyIE1vdmllcyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy9tb3ZpZXMnKTtcbnZhciBSYXRpbmdzID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL3JhdGluZ3MnKTtcbnZhciBSZWxhdGlvbnMgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvcmVsYXRpb25zJyk7XG52YXIgVXNlcnMgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvdXNlcnMnKTtcbnZhciBhbGxSZXF1ZXN0cyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy9hbGxSZXF1ZXN0cycpO1xuXG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoXCJibHVlYmlyZFwiKTtcbnZhciByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdCcpO1xuXG52YXIgY29uID0gbXlzcWwuY3JlYXRlQ29ubmVjdGlvbih7XG4gIGhvc3Q6IFwibG9jYWxob3N0XCIsXG4gIHVzZXI6IFwicm9vdFwiLFxuICBwYXNzd29yZDogXCIxMjM0NVwiLFxuICBkYXRhYmFzZTogXCJNYWluRGF0YWJhc2VcIlxufSk7XG5cbmNvbi5jb25uZWN0KGZ1bmN0aW9uKGVycil7XG4gIGlmKGVycil7XG4gICAgY29uc29sZS5sb2coJ0Vycm9yIGNvbm5lY3RpbmcgdG8gRGInKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc29sZS5sb2coJ0Nvbm5lY3Rpb24gZXN0YWJsaXNoZWQnKTtcbn0pO1xuXG4vLy8vLy8vLy8vLy8vLy8vL1xuLy8vL3VzZXIgYXV0aFxuLy8vLy8vLy8vLy8vLy8vLy9cblxuXG5leHBvcnRzLnNpZ251cFVzZXIgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXHRjb25zb2xlLmxvZygnY2FsbGluZyBsb2dpbicsIHJlcS5ib2R5KTtcblx0Y29uc29sZS5sb2coJ3RoaXMgaXMgdGhlIHNlc3Npb24nLHJlcS5zZXNzaW9uKVxuICBuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEuYm9keS5uYW1lIH0pLmZldGNoKCkudGhlbihmdW5jdGlvbihmb3VuZCkge1xuXHQgIGlmIChmb3VuZCkge1xuXHQgIFx0Ly9jaGVjayBwYXNzd29yZFxuXHQgIFx0ICAgLy9pZiAocGFzc3dvcmQgbWF0Y2hlcylcblx0ICBcdCAgIC8veyBhZGQgc2Vzc2lvbnMgYW5kIHJlZGlyZWN0fVxuXHQgICAgcmVzLnJlZGlyZWN0KCcvc2lnbnVwJyk7XG5cdCAgfSBlbHNlIHtcblx0ICBcdGNvbnNvbGUubG9nKCdjcmVhdGluZyB1c2VyJyk7XG5cdCAgICBVc2Vycy5jcmVhdGUoe1xuXHQgICAgICB1c2VybmFtZTogcmVxLmJvZHkubmFtZSxcblx0ICAgICAgcGFzc3dvcmQ6IHJlcS5ib2R5LnBhc3N3b3JkLFxuXHQgICAgfSlcblx0ICAgIC50aGVuKGZ1bmN0aW9uKHVzZXIpIHtcblx0XHQgIFx0Y29uc29sZS5sb2coJ2NyZWF0ZWQgYSBuZXcgdXNlcicpO1xuXHRcdCAgXHRcblx0ICAgICAgcmVzLnJlZGlyZWN0KCcvbG9naW4nKTtcblx0ICAgIH0pO1xuXHQgIH1cblx0fSk7XG59O1xuXG5cbmV4cG9ydHMuc2VuZFdhdGNoUmVxdWVzdCA9IGZ1bmN0aW9uKHJlcSwgcmVzcG9uc2UpIHtcblx0Y29uc29sZS5sb2cocmVxLmJvZHkucmVxdWVzdGVlKVxuXHRpZiAoQXJyYXkuaXNBcnJheShyZXEuYm9keS5yZXF1ZXN0ZWUpKSB7XG5cdFx0dmFyIHJlcXVlc3RlZXMgPSByZXEuYm9keS5yZXF1ZXN0ZWU7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIHJlcXVlc3RlZXMgPSBbcmVxLmJvZHkucmVxdWVzdGVlXTtcblx0fVxuXHRQcm9taXNlLmVhY2gocmVxdWVzdGVlcywgZnVuY3Rpb24ocmVxdWVzdGVlKXtcblx0XHR2YXIgcmVxdWVzdCA9IHtcblx0XHRcdHJlcXVlc3RvcjogcmVxLm15U2Vzc2lvbi51c2VyLCBcblx0XHRcdHJlcXVlc3RUeXA6J3dhdGNoJyxcblx0XHRcdG1vdmllOnJlcS5ib2R5Lm1vdmllLFxuXHRcdFx0cmVxdWVzdGVlOiByZXF1ZXN0ZWVcblx0XHR9O1xuXHRcdGNvbi5xdWVyeSgnSU5TRVJUIElOVE8gYWxscmVxdWVzdHMgU0VUID8nLCByZXF1ZXN0LCBmdW5jdGlvbihlcnIscmVzKXtcblx0XHQgIGlmKGVycikgdGhyb3cgZXJyO1xuXHRcdCAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XG5cdFx0fSk7XG5cdH0pXG5cdC50aGVuKGZ1bmN0aW9uKGRvbmUpe1xuXHRcdHJlc3BvbnNlLnNlbmQoJ1RoYXRzIG15IHN0eWxlIScpO1xuXHR9KVxufVxuXG5cbmV4cG9ydHMuc2VuZFJlcXVlc3QgPSBmdW5jdGlvbihyZXEsIHJlc3BvbnNlKSB7XG4gIGNvbnNvbGUubG9nKCd0aGlzIGlzIHdoYXQgSW0gZ2V0dGluZycsIHJlcS5ib2R5KTtcbiAgaWYgKHJlcS5teVNlc3Npb24udXNlcj09PXJlcS5ib2R5Lm5hbWUpe1xuICAgIHJlc3BvbnNlLnNlbmQoXCJ5b3UgY2FuJ3QgZnJpZW5kIHlvdXJzZWxmIVwiKVxuICB9IGVsc2Uge1xuXG52YXIgcmVxdWVzdCA9IHtyZXF1ZXN0b3I6IHJlcS5teVNlc3Npb24udXNlciwgcmVxdWVzdGVlOiByZXEuYm9keS5uYW1lLCByZXF1ZXN0VHlwOidmcmllbmQnfTtcblxuY29uLnF1ZXJ5KCdJTlNFUlQgSU5UTyBhbGxyZXF1ZXN0cyBTRVQgPycsIHJlcXVlc3QsIGZ1bmN0aW9uKGVycixyZXMpe1xuICBpZihlcnIpIHRocm93IGVycjtcbiAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XG4gIHJlc3BvbnNlLnNlbmQoJ1RoYXRzIG15IHN0eWxlISEhJyk7XG59KTtcblxuIH1cbn07XG5cbmV4cG9ydHMubGlzdFJlcXVlc3RzID0gZnVuY3Rpb24ocmVxLCByZXNwb25zZSkge1xuICB2YXIgcmVxdWVzdCA9IHJlcS5teVNlc3Npb24udXNlclxuXG4gIGNvbi5xdWVyeSgnU2VsZWN0ICogRlJPTSBhbGxyZXF1ZXN0cyBXSEVSRSByZXF1ZXN0ZWU9JysnXCInK3JlcXVlc3QrJ1wiJysnJysnT1IgcmVxdWVzdG9yID0nKydcIicrcmVxdWVzdCsnXCInKycnLCBmdW5jdGlvbihlcnIscmVzKXtcbiAgaWYoZXJyKSB0aHJvdyBlcnI7XG4gIGNvbnNvbGUubG9nKHJlcylcbiAgcmVzcG9uc2Uuc2VuZChbcmVzLHJlcXVlc3RdKTtcbn0pO1xuXG5cbn07XG5cbmV4cG9ydHMuYWNjZXB0ID0gZnVuY3Rpb24ocmVxLCByZXNwb25zZSkge1xuIHZhciByZXF1ZXN0b3I9cmVxLmJvZHkucGVyc29uVG9BY2NlcHQ7XG4gdmFyIHJlcXVlc3RlZT1yZXEubXlTZXNzaW9uLnVzZXI7XG5cbmNvbi5xdWVyeSgnVVBEQVRFIGFsbHJlcXVlc3RzIFNFVCByZXNwb25zZT0nKydcIicgKyAneWVzJyArICdcIicrJyAgV0hFUkUgcmVxdWVzdG9yID0gJysnXCInKyByZXF1ZXN0b3IrJ1wiJysnIEFORCByZXF1ZXN0ZWU9JysnXCInKyByZXF1ZXN0ZWUrJ1wiJywgZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcbiAgICBcbiAgICAgIH0pO1xuXG5cblxuXG5cbiAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCByZXEuYm9keS5wZXJzb25Ub0FjY2VwdCwgZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlc1swXS5pZCwgZXJyKTtcbiAgICB2YXIgcGVyc29uMSA9IHJlc1swXS5pZDtcbiAgICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIHJlcS5teVNlc3Npb24udXNlciwgZnVuY3Rpb24oZXJyLCByZXNwKSB7XG4gICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzcFswXS5pZCwgZXJyKTtcblxuICAgICAgdmFyIHBlcnNvbjIgPSByZXNwWzBdLmlkO1xuICAgICAgdmFyIHJlcXVlc3QgPSB7XG4gICAgICAgIHVzZXIxaWQ6IHBlcnNvbjEsXG4gICAgICAgIHVzZXIyaWQ6IHBlcnNvbjJcbiAgICAgIH1cbiAgICAgIHZhciByZXF1ZXN0MiA9IHtcbiAgICAgICAgdXNlcjFpZDogcGVyc29uMixcbiAgICAgICAgdXNlcjJpZDogcGVyc29uMVxuICAgICAgfVxuXG4gICAgICBjb25zb2xlLmxvZygndGhlIHJlcXVlc3RzOjo6JyxyZXF1ZXN0LHJlcXVlc3QyKVxuICAgICAgY29uLnF1ZXJ5KCdJTlNFUlQgSU5UTyByZWxhdGlvbnMgU0VUID8nLCByZXF1ZXN0LCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xuXG5cbmNvbi5xdWVyeSgnSU5TRVJUIElOVE8gcmVsYXRpb25zIFNFVCA/JywgcmVxdWVzdDIsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XG5cbiAgICAgICAgcmVzcG9uc2Uuc2VuZCgnVGhhdHMgbXkgc3R5bGUhISEnKTtcbiAgICAgIH0pXG4gICAgICB9KTtcbiAgICB9KVxuICB9KVxufTtcblxuZXhwb3J0cy5nZXRUaGlzRnJpZW5kc01vdmllcz1mdW5jdGlvbihyZXEscmVzcG9uc2Upe1xuXG4gIHZhciBtb3ZpZXM9W107XG4gIGNvbnNvbGUubG9nKHJlcS5ib2R5LnNwZWNpZmljRnJpZW5kKTtcbiAgdmFyIHBlcnNvbj1yZXEuYm9keS5zcGVjaWZpY0ZyaWVuZFxuICB2YXIgaWQ9bnVsbFxuICB2YXIgbGVuPW51bGw7XG4gIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgcGVyc29uLCBmdW5jdGlvbihlcnIsIHJlc3Ape1xuY29uc29sZS5sb2cocmVzcClcbmlkPXJlc3BbMF0uaWQ7XG5cblxuY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHJhdGluZ3MgV0hFUkUgdXNlcmlkID0gPycsIGlkICxmdW5jdGlvbihlcnIscmVzcCl7XG5jb25zb2xlLmxvZygnZXJycnJycnJycicsZXJyLHJlc3AubGVuZ3RoKVxubGVuPXJlc3AubGVuZ3RoO1xucmVzcC5mb3JFYWNoKGZ1bmN0aW9uKGEpe1xuXG5jb24ucXVlcnkoJ1NFTEVDVCB0aXRsZSBGUk9NIG1vdmllcyBXSEVSRSBpZCA9ID8nLCBhLm1vdmllaWQgLGZ1bmN0aW9uKGVycixyZXNwKXtcbiAgY29uc29sZS5sb2cocmVzcClcbm1vdmllcy5wdXNoKFtyZXNwWzBdLnRpdGxlLGEuc2NvcmUsYS5yZXZpZXddKVxuY29uc29sZS5sb2cobW92aWVzKVxuaWYgKG1vdmllcy5sZW5ndGg9PT1sZW4pe1xuICByZXNwb25zZS5zZW5kKG1vdmllcyk7XG59XG59KVxuXG59KVxuXG59KVxuXG5cbiAgfVxuXG4pfVxuXG5leHBvcnRzLmZpbmRNb3ZpZUJ1ZGRpZXM9ZnVuY3Rpb24ocmVxLHJlc3BvbnNlKXtcbiAgY29uc29sZS5sb2coXCJ5b3UncmUgdHJ5aW5nIHRvIGZpbmQgYnVkZGllcyEhXCIpO1xuY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHVzZXJzJyxmdW5jdGlvbihlcnIscmVzcCl7XG4gIHZhciBwZW9wbGU9cmVzcC5tYXAoZnVuY3Rpb24oYSl7cmV0dXJuIGEudXNlcm5hbWV9KVxuICB2YXIgSWRzPSByZXNwLm1hcChmdW5jdGlvbihhKXtyZXR1cm4gYS5pZH0pXG4gIHZhciBpZEtleU9iaj17fVxuZm9yICh2YXIgaT0wO2k8SWRzLmxlbmd0aDtpKyspe1xuICBpZEtleU9ialtJZHNbaV1dPXBlb3BsZVtpXVxufVxuY29uc29sZS5sb2coJ2N1cnJlbnQgdXNlcicscmVxLm15U2Vzc2lvbi51c2VyKTtcbnZhciBjdXJyZW50VXNlcj1yZXEubXlTZXNzaW9uLnVzZXJcblxuXG4gdmFyIG9iajE9e307XG4gIGZvciAodmFyIGk9MDtpPElkcy5sZW5ndGg7aSsrKXtcbm9iajFbaWRLZXlPYmpbSWRzW2ldXV09W107XG4gIH1cblxuICBjb24ucXVlcnkoJ1NFTEVDVCBzY29yZSxtb3ZpZWlkLHVzZXJpZCBGUk9NIHJhdGluZ3MnLGZ1bmN0aW9uKGVycixyZXNwb24pe1xuICBcbmZvciAodmFyIGk9MDtpPHJlc3Bvbi5sZW5ndGg7aSsrKXtcbiAgb2JqMVtpZEtleU9ialtyZXNwb25baV0udXNlcmlkXV0ucHVzaChbcmVzcG9uW2ldLm1vdmllaWQscmVzcG9uW2ldLnNjb3JlXSlcbn1cblxuY29uc29sZS5sb2coJ29iajEnLG9iajEpO1xuY3VycmVudFVzZXJJbmZvPW9iajFbY3VycmVudFVzZXJdXG4vL2NvbnNvbGUubG9nKCdjdXJyZW50VXNlckluZm8nLGN1cnJlbnRVc2VySW5mbylcbnZhciBjb21wYXJpc29ucz17fVxuXG5mb3IgKHZhciBrZXkgaW4gb2JqMSl7XG4gIGlmIChrZXkhPT1jdXJyZW50VXNlcikge1xuICAgIGNvbXBhcmlzb25zW2tleV09Y29tcChjdXJyZW50VXNlckluZm8sb2JqMVtrZXldKVxuICB9XG59XG5jb25zb2xlLmxvZyhjb21wYXJpc29ucylcbnZhciBmaW5hbFNlbmQ9W11cbmZvciAodmFyIGtleSBpbiBjb21wYXJpc29ucyl7XG4gIGlmIChjb21wYXJpc29uc1trZXldICE9PSAnTmFOJScpIHtcbiAgZmluYWxTZW5kLnB1c2goW2tleSxjb21wYXJpc29uc1trZXldXSk7XG59IGVsc2UgIHtcbiAgZmluYWxTZW5kLnB1c2goW2tleSxcIk5vIENvbXBhcmlzb24gdG8gTWFrZVwiXSlcbn1cblxufVxuXG4gIHJlc3BvbnNlLnNlbmQoZmluYWxTZW5kKVxufSlcbn0pXG59XG5cblxuZXhwb3J0cy5kZWNsaW5lPWZ1bmN0aW9uKHJlcSxyZXNwb25zZSl7XG4gIHZhciByZXF1ZXN0b3I9cmVxLmJvZHkucGVyc29uVG9EZWNsaW5lO1xuIHZhciByZXF1ZXN0ZWU9cmVxLm15U2Vzc2lvbi51c2VyO1xuXG4gY29uLnF1ZXJ5KCdVUERBVEUgYWxscmVxdWVzdHMgU0VUIHJlc3BvbnNlPScrJ1wiJyArICdubycgKyAnXCInKyAnIFdIRVJFIHJlcXVlc3RvciA9ICcrJ1wiJysgcmVxdWVzdG9yKydcIicrJyBBTkQgcmVxdWVzdGVlPScrJ1wiJysgcmVxdWVzdGVlKydcIicsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XG4gICAgICByZXNwb25zZS5zZW5kKHJlcXVlc3RvciArICdkZWxldGVkJyk7XG4gICAgICB9KTtcbn1cblxuXG5cblxuXG5leHBvcnRzLnNpZ25pblVzZXIgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXHRjb25zb2xlLmxvZygnY2FsbGluZyBzaWduaW4nLCByZXEuYm9keSk7XG5cdG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUgfSkuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGZvdW5kKXtcblxuXHRcdGlmIChmb3VuZCl7XG5cdFx0XHRuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEuYm9keS5uYW1lLCBwYXNzd29yZDpyZXEuYm9keS5wYXNzd29yZH0pLmZldGNoKCkudGhlbihmdW5jdGlvbihmb3VuZCl7XG5cdFx0XHRcdGlmIChmb3VuZCl7XG5cdFx0XHRcdFx0cmVxLm15U2Vzc2lvbi51c2VyID0gZm91bmQuYXR0cmlidXRlcy51c2VybmFtZTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhmb3VuZC5hdHRyaWJ1dGVzLnVzZXJuYW1lKVxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCd3ZSBmb3VuZCB5b3UhIScpXG5cdFx0XHRcdFx0cmVzLnNlbmQoWydpdCB3b3JrZWQnLHJlcS5teVNlc3Npb24udXNlcl0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdzb3JyeSwgbm8gbWF0Y2ghISEnKVxuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zb2xlLmxvZygnbm8gc3VjaCB1c2VyJylcblx0XHR9XG5cbiAgfSkgXG5cbn1cblxuZXhwb3J0cy5sb2dvdXQgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXHRyZXEubXlTZXNzaW9uLmRlc3Ryb3koZnVuY3Rpb24oZXJyKXtcblx0XHRjb25zb2xlLmxvZyhlcnIpO1xuXHR9KTtcblx0Y29uc29sZS5sb2coJ2xvZ291dCcpO1xuXHRyZXMuc2VuZCgnbG9nb3V0Jyk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vL21vdmllIGhhbmRsZXJzXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuLy9hIGhhbmRlbGVyIHRoYXQgdGFrZXMgYSByYXRpbmcgZnJvbSB1c2VyIGFuZCBhZGQgaXQgdG8gdGhlIGRhdGFiYXNlXG4vLyBleHBlY3RzIHJlcS5ib2R5IHRvIGhhdmUgdGhpczoge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnLCBwb3N0ZXI6ICdsaW5rJywgcmVsZWFzZV9kYXRlOiAneWVhcicsIHJhdGluZzogJ251bWJlcid9XG5leHBvcnRzLnJhdGVNb3ZpZSA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cdGNvbnNvbGUubG9nKCdjYWxsaW5nIHJhdGVNb3ZpZScpO1xuXHR2YXIgdXNlcmlkO1xuXHRyZXR1cm4gbmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLm15U2Vzc2lvbi51c2VyIH0pLmZldGNoKClcblx0LnRoZW4oZnVuY3Rpb24oZm91bmRVc2VyKSB7XG5cdFx0dXNlcmlkID0gZm91bmRVc2VyLmF0dHJpYnV0ZXMuaWQ7XG5cdFx0cmV0dXJuIG5ldyBSYXRpbmcoeyBtb3ZpZWlkOiByZXEuYm9keS5pZCwgdXNlcmlkOiB1c2VyaWQgfSkuZmV0Y2goKVxuXHRcdC50aGVuKGZ1bmN0aW9uKGZvdW5kUmF0aW5nKSB7XG5cdFx0XHRpZiAoZm91bmRSYXRpbmcpIHtcblx0XHRcdFx0Ly9zaW5jZSByYXRpbmcgb3IgcmV2aWV3IGlzIHVwZGF0ZWQgc2VwZXJhdGx5IGluIGNsaWVudCwgdGhlIGZvbGxvd2luZ1xuXHRcdFx0XHQvL21ha2Ugc3VyZSBpdCBnZXRzIHVwZGF0ZWQgYWNjb3JkaW5nIHRvIHRoZSByZXFcblx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ3VwZGF0ZSByYXRpbmcnLCBmb3VuZFJhdGluZylcblx0XHRcdFx0aWYgKHJlcS5ib2R5LnJhdGluZykge1xuXHRcdFx0XHRcdHZhciByYXRpbmdPYmogPSB7c2NvcmU6IHJlcS5ib2R5LnJhdGluZ307XG5cdFx0XHRcdH0gZWxzZSBpZiAocmVxLmJvZHkucmV2aWV3KSB7XG5cdFx0XHRcdFx0dmFyIHJhdGluZ09iaiA9IHtyZXZpZXc6IHJlcS5ib2R5LnJldmlld307XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIG5ldyBSYXRpbmcoeydpZCc6IGZvdW5kUmF0aW5nLmF0dHJpYnV0ZXMuaWR9KVxuXHRcdFx0XHRcdC5zYXZlKHJhdGluZ09iaik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnY3JlYXRpbmcgcmF0aW5nJyk7XG5cdFx0ICAgIHJldHVybiBSYXRpbmdzLmNyZWF0ZSh7XG5cdFx0ICAgIFx0c2NvcmU6IHJlcS5ib2R5LnJhdGluZyxcblx0XHQgICAgICB1c2VyaWQ6IHVzZXJpZCxcblx0XHQgICAgICBtb3ZpZWlkOiByZXEuYm9keS5pZCxcblx0XHQgICAgICByZXZpZXc6IHJlcS5ib2R5LnJldmlld1xuXHRcdCAgICB9KTtcdFx0XHRcdFx0XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pXG5cdC50aGVuKGZ1bmN0aW9uKG5ld1JhdGluZykge1xuXHRcdGNvbnNvbGUubG9nKCdyYXRpbmcgY3JlYXRlZDonLCBuZXdSYXRpbmcuYXR0cmlidXRlcyk7XG4gIFx0cmVzLnN0YXR1cygyMDEpLnNlbmQoJ3JhdGluZyByZWNpZXZlZCcpO1xuXHR9KVxufTtcblxuLy90aGlzIGhlbHBlciBmdW5jdGlvbiBhZGRzIHRoZSBtb3ZpZSBpbnRvIGRhdGFiYXNlXG4vL2l0IGZvbGxvd3MgdGhlIHNhbWUgbW92aWUgaWQgYXMgVE1EQlxuLy9leHBlY3RzIHJlcS5ib2R5IHRvIGhhdmUgdGhlc2UgYXRyaWJ1dGUgOiB7aWQsIHRpdGxlLCBnZW5yZSwgcG9zdGVyX3BhdGgsIHJlbGVhc2VfZGF0ZSwgb3ZlcnZpZXcsIHZvdGVfYXZlcmFnZX1cbnZhciBhZGRPbmVNb3ZpZSA9IGZ1bmN0aW9uKG1vdmllT2JqKSB7XG5cdHZhciBnZW5yZSA9IChtb3ZpZU9iai5nZW5yZV9pZHMpID8gZ2VucmVzW21vdmllT2JqLmdlbnJlX2lkc1swXV0gOiAnbi9hJztcbiAgcmV0dXJuIG5ldyBNb3ZpZSh7XG4gIFx0aWQ6IG1vdmllT2JqLmlkLFxuICAgIHRpdGxlOiBtb3ZpZU9iai50aXRsZSxcbiAgICBnZW5yZTogZ2VucmUsXG4gICAgcG9zdGVyOiAnaHR0cHM6Ly9pbWFnZS50bWRiLm9yZy90L3AvdzE4NS8nICsgbW92aWVPYmoucG9zdGVyX3BhdGgsXG4gICAgcmVsZWFzZV9kYXRlOiBtb3ZpZU9iai5yZWxlYXNlX2RhdGUsXG4gICAgZGVzY3JpcHRpb246IG1vdmllT2JqLm92ZXJ2aWV3LnNsaWNlKDAsIDI1NSksXG4gICAgaW1kYlJhdGluZzogbW92aWVPYmoudm90ZV9hdmVyYWdlXG4gIH0pLnNhdmUobnVsbCwge21ldGhvZDogJ2luc2VydCd9KVxuICAudGhlbihmdW5jdGlvbihuZXdNb3ZpZSkge1xuICBcdGNvbnNvbGUubG9nKCdtb3ZpZSBjcmVhdGVkJywgbmV3TW92aWUuYXR0cmlidXRlcy50aXRsZSk7XG4gIFx0cmV0dXJuIG5ld01vdmllO1xuICB9KVxufTtcblxuXG4vL2dldCBhbGwgbW92aWUgcmF0aW5ncyB0aGF0IGEgdXNlciByYXRlZFxuLy9zaG91bGQgcmV0dXJuIGFuIGFycmF5IHRoYXQgbG9vayBsaWtlIHRoZSBmb2xsb3dpbmc6XG4vLyBbIHt0aXRsZTogJ25hbWUnLCBnZW5yZTogJ2dlbnJlJyAsIHBvc3RlcjogJ3VybCcsIHJlbGVhc2VfZGF0ZTogJ2RhdGUnLCBzY29yZTogbiwgZnJpZW5kQXZlcmFnZVJhdGluZzogbn0gLi4uIF1cbi8vIHdpbGwgZ2V0IHJhdGluZ3MgZm9yIHRoZSBjdXJyZW50IHVzZXJcbmV4cG9ydHMuZ2V0VXNlclJhdGluZ3MgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICBSYXRpbmcucXVlcnkoZnVuY3Rpb24ocWIpe1xuICBcdHFiLmlubmVySm9pbigndXNlcnMnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICd1c2Vycy5pZCcpO1xuICBcdHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xuICBcdHFiLnNlbGVjdCgndXNlcnMudXNlcm5hbWUnLCAnbW92aWVzLnRpdGxlJywgJ21vdmllcy5pZCcsICdtb3ZpZXMuZ2VucmUnLCAnbW92aWVzLnBvc3RlcicsICdtb3ZpZXMucmVsZWFzZV9kYXRlJywgJ21vdmllcy5pbWRiUmF0aW5nJywgJ21vdmllcy5kZXNjcmlwdGlvbicsICdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3JywgJ3JhdGluZ3MudXBkYXRlZF9hdCcpO1xuICBcdHFiLndoZXJlKCd1c2Vycy51c2VybmFtZScsICc9JywgcmVxLm15U2Vzc2lvbi51c2VyKTtcbiAgXHRxYi5vcmRlckJ5KCd1cGRhdGVkX2F0JywgJ0RFU0MnKVxuICB9KVxuICAuZmV0Y2hBbGwoKVxuICAudGhlbihmdW5jdGlvbihyYXRpbmdzKXtcblx0XHQvL2RlY29yYXRlIGl0IHdpdGggYXZnIGZyaWVuZCByYXRpbmdcblx0XHRyZXR1cm4gUHJvbWlzZS5tYXAocmF0aW5ncy5tb2RlbHMsIGZ1bmN0aW9uKHJhdGluZykge1xuXHRcdFx0cmV0dXJuIGF0dGFjaEZyaWVuZEF2Z1JhdGluZyhyYXRpbmcsIHJlcS5teVNlc3Npb24udXNlcik7XG5cdFx0fSk7XG5cdH0pXG4gIC50aGVuKGZ1bmN0aW9uKHJhdGluZ3MpIHtcbiAgXHRjb25zb2xlLmxvZygncmV0cml2aW5nIGFsbCB1c2VyIHJhdGluZ3MnKTtcbiAgXHRyZXMuc3RhdHVzKDIwMCkuanNvbihyYXRpbmdzKTtcbiAgfSlcbn07XG5cbmV4cG9ydHMuZ2V0RnJpZW5kVXNlclJhdGluZ3MgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICBSYXRpbmcucXVlcnkoZnVuY3Rpb24ocWIpe1xuICBcdHFiLmlubmVySm9pbigndXNlcnMnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICd1c2Vycy5pZCcpO1xuICBcdHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xuICBcdHFiLnNlbGVjdCgndXNlcnMudXNlcm5hbWUnLCAnbW92aWVzLnRpdGxlJywgJ21vdmllcy5pZCcsICdtb3ZpZXMuZ2VucmUnLCAnbW92aWVzLnBvc3RlcicsICdtb3ZpZXMucmVsZWFzZV9kYXRlJywgJ21vdmllcy5pbWRiUmF0aW5nJywgJ21vdmllcy5kZXNjcmlwdGlvbicsICdyYXRpbmdzLnNjb3JlIGFzIGZyaWVuZFNjb3JlJywgJ3JhdGluZ3MucmV2aWV3IGFzIGZyaWVuZFJldmlldycsICdyYXRpbmdzLnVwZGF0ZWRfYXQnKTtcbiAgXHRxYi53aGVyZSgndXNlcnMudXNlcm5hbWUnLCAnPScsIHJlcS5xdWVyeS5mcmllbmROYW1lKTtcbiAgXHRxYi5vcmRlckJ5KCd1cGRhdGVkX2F0JywgJ0RFU0MnKVxuICB9KVxuICAuZmV0Y2hBbGwoKVxuICAudGhlbihmdW5jdGlvbihyYXRpbmdzKXtcblx0XHQvL2RlY29yYXRlIGl0IHdpdGggY3VycmVudCB1c2VyJ3MgcmF0aW5nXG5cdFx0cmV0dXJuIFByb21pc2UubWFwKHJhdGluZ3MubW9kZWxzLCBmdW5jdGlvbihyYXRpbmcpIHtcblx0XHRcdHJldHVybiBhdHRhY2hVc2VyUmF0aW5nKHJhdGluZywgcmVxLm15U2Vzc2lvbi51c2VyKTtcblx0XHR9KTtcblx0fSlcbiAgLnRoZW4oZnVuY3Rpb24ocmF0aW5ncykge1xuICBcdGNvbnNvbGUubG9nKCdyZXRyaXZpbmcgYWxsIHVzZXIgcmF0aW5ncycpO1xuICBcdHJlcy5zdGF0dXMoMjAwKS5qc29uKHJhdGluZ3MpO1xuICB9KVxufTtcblxuLy9hIGRlY29yYXRvciBmdW5jdGlvbiB0aGF0IGF0dGFjaGVzIGZyaWVuZCBhdmcgcmF0aW5nIHRvIHRoZSByYXRpbmcgb2JqXG52YXIgYXR0YWNoRnJpZW5kQXZnUmF0aW5nID0gZnVuY3Rpb24ocmF0aW5nLCB1c2VybmFtZSkge1xuXHRyZXR1cm4gZXhwb3J0cy5nZXRGcmllbmRSYXRpbmdzKHVzZXJuYW1lLCByYXRpbmcpXG5cdC50aGVuKGZ1bmN0aW9uKGZyaWVuZHNSYXRpbmdzKXtcblx0XHQvL2lmIGZyaWVuZHNSYXRpbmdzIGlzIG51bGwsIFJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgaXMgbnVsbFxuXHRcdGlmICghZnJpZW5kc1JhdGluZ3MpIHtcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgPSBudWxsO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nID0gYXZlcmFnZVJhdGluZyhmcmllbmRzUmF0aW5ncyk7XG5cdFx0fVxuXHRcdHJldHVybiByYXRpbmc7XG5cdH0pXG59XG5cbi8vYSBkZWNvcmF0b3IgZnVuY3Rpb24gdGhhdCBhdHRhY2hlcyB1c2VyIHJhdGluZyBhbmQgcmV2aWV3cyB0byB0aGUgcmF0aW5nIG9ialxudmFyIGF0dGFjaFVzZXJSYXRpbmcgPSBmdW5jdGlvbihyYXRpbmcsIHVzZXJuYW1lKSB7XG5cdHJldHVybiBSYXRpbmcucXVlcnkoZnVuY3Rpb24ocWIpIHtcblx0XHRxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3VzZXJzLmlkJywgJz0nLCAncmF0aW5ncy51c2VyaWQnKVxuXHRcdHFiLmlubmVySm9pbignbW92aWVzJywgJ21vdmllcy5pZCcsICc9JywgJ3JhdGluZ3MubW92aWVpZCcpXG5cdFx0cWIuc2VsZWN0KCdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3Jylcblx0XHRxYi53aGVyZSh7XG5cdFx0XHQndXNlcnMudXNlcm5hbWUnOiB1c2VybmFtZSxcblx0XHRcdCdtb3ZpZXMudGl0bGUnOiByYXRpbmcuYXR0cmlidXRlcy50aXRsZSxcblx0XHRcdCdtb3ZpZXMuaWQnOiByYXRpbmcuYXR0cmlidXRlcy5pZFxuXHRcdH0pXG5cdH0pXG5cdC5mZXRjaCgpXG5cdC50aGVuKGZ1bmN0aW9uKHVzZXJSYXRpbmcpe1xuXHRcdGlmICh1c2VyUmF0aW5nKSB7XG5cdFx0XHRyYXRpbmcuYXR0cmlidXRlcy5zY29yZSA9IHVzZXJSYXRpbmcuYXR0cmlidXRlcy5zY29yZTtcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLnJldmlldyA9IHVzZXJSYXRpbmcuYXR0cmlidXRlcy5yZXZpZXc7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLnNjb3JlID0gbnVsbDtcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLnJldmlldyA9IG51bGw7XG5cdFx0fVxuXHRcdHJldHVybiByYXRpbmc7XG5cdH0pO1xufTtcblxuLy90aGlzIGlzIGEgd3JhcGVyIGZ1bmN0aW9uIGZvciBnZXRGcmllbmRSYXRpbmdzIHdoaWNoIHdpbGwgc2VudCB0aGUgY2xpZW50IGFsbCBvZiB0aGUgZnJpZW5kIHJhdGluZ3NcbmV4cG9ydHMuaGFuZGxlR2V0RnJpZW5kUmF0aW5ncyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cdGNvbnNvbGUubG9nKCdoYW5kbGVHZXRGcmllbmRSYXRpbmdzLCAnLCByZXEubXlTZXNzaW9uLnVzZXIsIHJlcS5ib2R5Lm1vdmllLnRpdGxlKTtcblx0ZXhwb3J0cy5nZXRGcmllbmRSYXRpbmdzKHJlcS5teVNlc3Npb24udXNlciwge2F0dHJpYnV0ZXM6IHJlcS5ib2R5Lm1vdmllfSlcblx0LnRoZW4oZnVuY3Rpb24oZnJpZW5kUmF0aW5ncyl7XG5cdFx0cmVzLmpzb24oZnJpZW5kUmF0aW5ncyk7XG5cdH0pO1xufVxuXG4vL3RoaXMgZnVuY3Rpb24gb3V0cHV0cyByYXRpbmdzIG9mIGEgdXNlcidzIGZyaWVuZCBmb3IgYSBwYXJ0aWN1bGFyIG1vdmllXG4vL2V4cGVjdCBjdXJyZW50IHVzZXJuYW1lIGFuZCBtb3ZpZVRpdGxlIGFzIGlucHV0XG4vL291dHB1dHM6IHt1c2VyMmlkOiAnaWQnLCBmcmllbmRVc2VyTmFtZTonbmFtZScsIGZyaWVuZEZpcnN0TmFtZTonbmFtZScsIHRpdGxlOidtb3ZpZVRpdGxlJywgc2NvcmU6biB9XG5leHBvcnRzLmdldEZyaWVuZFJhdGluZ3MgPSBmdW5jdGlvbih1c2VybmFtZSwgbW92aWVPYmopIHtcblx0cmV0dXJuIFVzZXIucXVlcnkoZnVuY3Rpb24ocWIpe1xuXHRcdHFiLmlubmVySm9pbigncmVsYXRpb25zJywgJ3JlbGF0aW9ucy51c2VyMWlkJywgJz0nLCAndXNlcnMuaWQnKTtcblx0XHRxYi5pbm5lckpvaW4oJ3JhdGluZ3MnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICdyZWxhdGlvbnMudXNlcjJpZCcpO1xuXHRcdHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xuXHRcdHFiLnNlbGVjdCgncmVsYXRpb25zLnVzZXIyaWQnLCAnbW92aWVzLnRpdGxlJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnKTtcblx0XHRxYi53aGVyZSh7XG5cdFx0XHQndXNlcnMudXNlcm5hbWUnOiB1c2VybmFtZSwgXG5cdFx0XHQnbW92aWVzLnRpdGxlJzogbW92aWVPYmouYXR0cmlidXRlcy50aXRsZSxcblx0XHRcdCdtb3ZpZXMuaWQnOiBtb3ZpZU9iai5hdHRyaWJ1dGVzLmlkIH0pO1xuXHR9KVxuXHQuZmV0Y2hBbGwoKVxuXHQudGhlbihmdW5jdGlvbihmcmllbmRzUmF0aW5ncyl7XG5cdC8vdGhlIGZvbGxvd2luZyBibG9jayBhZGRzIHRoZSBmcmllbmROYW1lIGF0dHJpYnV0ZSB0byB0aGUgcmF0aW5nc1xuXHRcdHJldHVybiBQcm9taXNlLm1hcChmcmllbmRzUmF0aW5ncy5tb2RlbHMsIGZ1bmN0aW9uKGZyaWVuZFJhdGluZykge1xuXHRcdFx0cmV0dXJuIG5ldyBVc2VyKHsgaWQ6IGZyaWVuZFJhdGluZy5hdHRyaWJ1dGVzLnVzZXIyaWQgfSkuZmV0Y2goKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oZnJpZW5kKXtcblx0XHRcdFx0ZnJpZW5kUmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kVXNlck5hbWUgPSBmcmllbmQuYXR0cmlidXRlcy51c2VybmFtZTtcblx0XHRcdFx0ZnJpZW5kUmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kRmlyc3ROYW1lID0gZnJpZW5kLmF0dHJpYnV0ZXMuZmlyc3ROYW1lO1xuXHRcdFx0XHRyZXR1cm4gZnJpZW5kUmF0aW5nO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0pXG5cdC50aGVuKGZ1bmN0aW9uKGZyaWVuZHNSYXRpbmdzKXtcblx0XHRyZXR1cm4gZnJpZW5kc1JhdGluZ3M7XG5cdH0pO1xufTtcblxuXG4vL2EgaGVscGVyIGZ1bmN0aW9uIHRoYXQgYXZlcmFnZXMgdGhlIHJhdGluZ1xuLy9pbnB1dHMgcmF0aW5ncywgb3V0cHV0cyB0aGUgYXZlcmFnZSBzY29yZTtcbnZhciBhdmVyYWdlUmF0aW5nID0gZnVuY3Rpb24ocmF0aW5ncykge1xuXHQvL3JldHVybiBudWxsIGlmIG5vIGZyaWVuZCBoYXMgcmF0ZWQgdGhlIG1vdmllXG5cdGlmIChyYXRpbmdzLmxlbmd0aCA9PT0gMCkge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdHJldHVybiByYXRpbmdzXG5cdC5yZWR1Y2UoZnVuY3Rpb24odG90YWwsIHJhdGluZyl7XG5cdFx0cmV0dXJuIHRvdGFsICs9IHJhdGluZy5hdHRyaWJ1dGVzLnNjb3JlO1xuXHR9LCAwKSAvIHJhdGluZ3MubGVuZ3RoO1xufVxuXG5cbi8vYSBoZWxwZXIgZnVuY3Rpb24gdGhhdCBvdXRwdXRzIHVzZXIgcmF0aW5nIGFuZCBhdmVyYWdlIGZyaWVuZCByYXRpbmcgZm9yIG9uZSBtb3ZpZVxuLy9vdXRwdXRzIG9uZSByYXRpbmcgb2JqOiB7dGl0bGU6ICduYW1lJywgZ2VucmU6ICdnZW5yZScgLCBwb3N0ZXI6ICd1cmwnLCByZWxlYXNlX2RhdGU6ICdkYXRlJywgc2NvcmU6IG4sIGZyaWVuZEF2ZXJhZ2VSYXRpbmc6IG59XG52YXIgZ2V0T25lTW92aWVSYXRpbmcgPSBmdW5jdGlvbih1c2VybmFtZSwgbW92aWVPYmopIHtcbiAgcmV0dXJuIFJhdGluZy5xdWVyeShmdW5jdGlvbihxYil7XG4gIFx0cWIuaW5uZXJKb2luKCd1c2VycycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3VzZXJzLmlkJyk7XG4gIFx0cWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XG4gIFx0cWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnKTtcbiAgXHRxYi53aGVyZSh7J3VzZXJzLnVzZXJuYW1lJzogdXNlcm5hbWUsICdtb3ZpZXMudGl0bGUnOiBtb3ZpZU9iai50aXRsZSwgJ21vdmllcy5pZCc6IG1vdmllT2JqLmlkfSk7XG4gIH0pXG4gIC5mZXRjaCgpXG4gIC50aGVuKGZ1bmN0aW9uKHJhdGluZyl7XG5cdCAgaWYgKCFyYXRpbmcpIHtcblx0ICBcdC8vaWYgdGhlIHVzZXIgaGFzIG5vdCByYXRlZCB0aGUgbW92aWUsIHJldHVybiBhbiBvYmogdGhhdCBoYXMgdGhlIG1vdmllIGluZm9ybWF0aW9uLCBidXQgc2NvcmUgaXMgc2V0IHRvIG51bGxcblx0ICBcdHJldHVybiBuZXcgTW92aWUoe3RpdGxlOiBtb3ZpZU9iai50aXRsZSwgaWQ6IG1vdmllT2JqLmlkfSkuZmV0Y2goKVxuXHQgIFx0LnRoZW4oZnVuY3Rpb24obW92aWUpIHtcblx0ICBcdFx0bW92aWUuYXR0cmlidXRlcy5zY29yZSA9IG51bGw7XG5cdCAgXHRcdHJldHVybiBtb3ZpZTtcblx0ICBcdH0pXG5cdCAgfSBlbHNlIHtcblx0ICBcdHJldHVybiByYXRpbmc7XG5cdCAgfVxuXHR9KVxuXHQudGhlbihmdW5jdGlvbihyYXRpbmcpe1xuXHRcdHJldHVybiBleHBvcnRzLmdldEZyaWVuZFJhdGluZ3ModXNlcm5hbWUsIHJhdGluZylcblx0XHQudGhlbihmdW5jdGlvbihmcmllbmRzUmF0aW5ncyl7XG5cdFx0XHQvLyBjb25zb2xlLmxvZygnZnJpZW5kc1JhdGluZ3MnLCBmcmllbmRzUmF0aW5ncyk7XG5cdFx0XHRyYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nID0gYXZlcmFnZVJhdGluZyhmcmllbmRzUmF0aW5ncyk7XG5cdFx0XHRjb25zb2xlLmxvZygnYWRkZWQgYXZlcmFnZSBmcmllbmQgcmF0aW5nJywgcmF0aW5nLmF0dHJpYnV0ZXMudGl0bGUsIHJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcpO1xuXHRcdFx0cmV0dXJuIHJhdGluZztcblx0XHR9KTtcblx0fSk7XG59XG5cblxuLy90aGlzIGhhbmRsZXIgaXMgc3BlY2lmaWNhbGx5IGZvciBzZW5kaW5nIG91dCBhIGxpc3Qgb2YgbW92aWUgcmF0aW5ncyB3aGVuIHRoZSBjbGllbnQgc2VuZHMgYSBsaXN0IG9mIG1vdmllIHRvIHRoZSBzZXJ2ZXJcbi8vZXhwZWN0cyByZXEuYm9keSB0byBiZSBhbiBhcnJheSBvZiBvYmogd2l0aCB0aGVzZSBhdHRyaWJ1dGVzOiB7aWQsIHRpdGxlLCBnZW5yZSwgcG9zdGVyX3BhdGgsIHJlbGVhc2VfZGF0ZSwgb3ZlcnZpZXcsIHZvdGVfYXZlcmFnZX1cbi8vb3V0cHV0cyBbIHt0aXRsZTogJ25hbWUnLCBnZW5yZTogJ2dlbnJlJyAsIHBvc3RlcjogJ3VybCcsIHJlbGVhc2VfZGF0ZTogJ2RhdGUnLCBzY29yZTogbiwgZnJpZW5kQXZlcmFnZVJhdGluZzogbn0gLi4uIF1cbmV4cG9ydHMuZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXHRjb25zb2xlLmxvZygnZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MnKTtcblx0UHJvbWlzZS5tYXAocmVxLmJvZHkubW92aWVzLCBmdW5jdGlvbihtb3ZpZSkge1xuXHRcdC8vZmlyc3QgY2hlY2sgd2hldGhlciBtb3ZpZSBpcyBpbiB0aGUgZGF0YWJhc2Vcblx0XHRyZXR1cm4gbmV3IE1vdmllKHt0aXRsZTogbW92aWUudGl0bGUsIGlkOiBtb3ZpZS5pZH0pLmZldGNoKClcblx0XHQudGhlbihmdW5jdGlvbihmb3VuZE1vdmllKSB7XG5cdFx0XHQvL2lmIG5vdCBjcmVhdGUgb25lXG5cdFx0XHRpZiAoIWZvdW5kTW92aWUpIHtcblx0XHRcdFx0cmV0dXJuIGFkZE9uZU1vdmllKG1vdmllKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBmb3VuZE1vdmllO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LnRoZW4oZnVuY3Rpb24oZm91bmRNb3ZpZSl7XG5cdFx0XHQvLyBjb25zb2xlLmxvZygnZm91bmQgbW92aWUnLCBmb3VuZE1vdmllKTtcblx0XHRcdHJldHVybiBnZXRPbmVNb3ZpZVJhdGluZyhyZXEubXlTZXNzaW9uLnVzZXIsIGZvdW5kTW92aWUuYXR0cmlidXRlcyk7XG5cdFx0fSlcblx0fSlcblx0LnRoZW4oZnVuY3Rpb24ocmF0aW5ncyl7XG5cdFx0Y29uc29sZS5sb2coJ3NlbmRpbmcgcmF0aW5nIHRvIGNsaWVudCcpO1xuXHRcdHJlcy5qc29uKHJhdGluZ3MpO1xuXHR9KVxufVxuXG4vL3RoaXMgaGFuZGxlciBzZW5kcyBhbiBnZXQgcmVxdWVzdCB0byBUTURCIEFQSSB0byByZXRyaXZlIHJlY2VudCB0aXRsZXNcbi8vd2UgY2Fubm90IGRvIGl0IGluIHRoZSBmcm9udCBlbmQgYmVjYXVzZSBjcm9zcyBvcmlnaW4gcmVxdWVzdCBpc3N1ZXNcbmV4cG9ydHMuZ2V0UmVjZW50UmVsZWFzZSA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIHZhciBwYXJhbXMgPSB7XG4gICAgYXBpX2tleTogJzlkM2IwMzVlZjFjZDY2OWFlZDM5ODQwMGIxN2ZjZWEyJyxcbiAgICBwcmltYXJ5X3JlbGVhc2VfeWVhcjogbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpLFxuICAgIGluY2x1ZGVfYWR1bHQ6IGZhbHNlLFxuICAgIHNvcnRfYnk6ICdwb3B1bGFyaXR5LmRlc2MnXG4gIH07XG5cblx0IFxuICB2YXIgZGF0YSA9ICcnO1xuXHRyZXF1ZXN0KHtcblx0XHRtZXRob2Q6ICdHRVQnLFxuXHRcdHVybDogJ2h0dHBzOi8vYXBpLnRoZW1vdmllZGIub3JnLzMvZGlzY292ZXIvbW92aWUvJyxcblx0XHRxczogcGFyYW1zXG5cdH0pXG5cdC5vbignZGF0YScsZnVuY3Rpb24oY2h1bmspe1xuXHRcdGRhdGEgKz0gY2h1bms7XG5cdH0pXG5cdC5vbignZW5kJywgZnVuY3Rpb24oKXtcblx0XHRyZWNlbnRNb3ZpZXMgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgIHJlcS5ib2R5Lm1vdmllcyA9IHJlY2VudE1vdmllcy5yZXN1bHRzO1xuICAgIC8vdHJhbnNmZXJzIHRoZSBtb3ZpZSBkYXRhIHRvIGdldE11bHRpcGxlTW92aWVSYXRpbmdzIHRvIGRlY29yYXRlIHdpdGggc2NvcmUgKHVzZXIgcmF0aW5nKSBhbmQgYXZnZnJpZW5kUmF0aW5nIGF0dHJpYnV0ZVxuICAgIGV4cG9ydHMuZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MocmVxLCByZXMpO1xuXG5cdH0pXG5cdC5vbignZXJyb3InLCBmdW5jdGlvbihlcnJvcil7XG5cdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHR9KVxuXG59XG5cbi8vdGhpcyBpcyBUTURCJ3MgZ2VucmUgY29kZSwgd2UgbWlnaHQgd2FudCB0byBwbGFjZSB0aGlzIHNvbWV3aGVyZSBlbHNlXG52YXIgZ2VucmVzID0ge1xuICAgMTI6IFwiQWR2ZW50dXJlXCIsXG4gICAxNDogXCJGYW50YXN5XCIsXG4gICAxNjogXCJBbmltYXRpb25cIixcbiAgIDE4OiBcIkRyYW1hXCIsXG4gICAyNzogXCJIb3Jyb3JcIixcbiAgIDI4OiBcIkFjdGlvblwiLFxuICAgMzU6IFwiQ29tZWR5XCIsXG4gICAzNjogXCJIaXN0b3J5XCIsXG4gICAzNzogXCJXZXN0ZXJuXCIsXG4gICA1MzogXCJUaHJpbGxlclwiLFxuICAgODA6IFwiQ3JpbWVcIixcbiAgIDk5OiBcIkRvY3VtZW50YXJ5XCIsXG4gICA4Nzg6IFwiU2NpZW5jZSBGaWN0aW9uXCIsXG4gICA5NjQ4OiBcIk15c3RlcnlcIixcbiAgIDEwNDAyOiBcIk11c2ljXCIsXG4gICAxMDc0OTogXCJSb21hbmNlXCIsXG4gICAxMDc1MTogXCJGYW1pbHlcIixcbiAgIDEwNzUyOiBcIldhclwiLFxuICAgMTA3Njk6IFwiRm9yZWlnblwiLFxuICAgMTA3NzA6IFwiVFYgTW92aWVcIlxuIH07XG5cbi8vdGhpcyBmdW5jdGlvbiB3aWxsIHNlbmQgYmFjayBzZWFyY2IgbW92aWVzIHVzZXIgaGFzIHJhdGVkIGluIHRoZSBkYXRhYmFzZVxuLy9pdCB3aWxsIHNlbmQgYmFjayBtb3ZpZSBvYmpzIHRoYXQgbWF0Y2ggdGhlIHNlYXJjaCBpbnB1dCwgZXhwZWN0cyBtb3ZpZSBuYW1lIGluIHJlcS5ib2R5LnRpdGxlXG5leHBvcnRzLnNlYXJjaFJhdGVkTW92aWUgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICByZXR1cm4gUmF0aW5nLnF1ZXJ5KGZ1bmN0aW9uKHFiKXtcblx0XHRxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcblx0XHRxYi5pbm5lckpvaW4oJ21vdmllcycsICdyYXRpbmdzLm1vdmllaWQnLCAnPScsICdtb3ZpZXMuaWQnKTtcblx0XHRxYi5zZWxlY3QoJ3VzZXJzLnVzZXJuYW1lJywgJ21vdmllcy50aXRsZScsICdtb3ZpZXMuaWQnLCAnbW92aWVzLmdlbnJlJywgJ21vdmllcy5wb3N0ZXInLCAnbW92aWVzLnJlbGVhc2VfZGF0ZScsICdtb3ZpZXMuaW1kYlJhdGluZycsICdtb3ZpZXMuZGVzY3JpcHRpb24nLCAncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycpO1xuICBcdHFiLndoZXJlUmF3KGBNQVRDSCAobW92aWVzLnRpdGxlKSBBR0FJTlNUICgnJHtyZXEucXVlcnkudGl0bGV9JyBJTiBOQVRVUkFMIExBTkdVQUdFIE1PREUpYClcbiAgXHRxYi5hbmRXaGVyZSgndXNlcnMudXNlcm5hbWUnLCAnPScsIHJlcS5teVNlc3Npb24udXNlcilcbiAgXHRxYi5vcmRlckJ5KCd1cGRhdGVkX2F0JywgJ0RFU0MnKVxuICB9KVxuICAuZmV0Y2hBbGwoKVxuICAudGhlbihmdW5jdGlvbihtYXRjaGVzKXtcbiAgXHRjb25zb2xlLmxvZyhtYXRjaGVzLm1vZGVscyk7XG4gIFx0cmVzLmpzb24obWF0Y2hlcyk7XG4gIH0pXG59XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy9mcmllbmRzaGlwIGhhbmRsZXJzXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuZXhwb3J0cy5nZXRGcmllbmRMaXN0ID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcblx0cmV0dXJuIFJlbGF0aW9uLnF1ZXJ5KGZ1bmN0aW9uKHFiKXtcblx0XHRxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JlbGF0aW9ucy51c2VyMWlkJywgJz0nLCAndXNlcnMuaWQnKTtcblx0XHRxYi5zZWxlY3QoJ3JlbGF0aW9ucy51c2VyMmlkJyk7XG5cdFx0cWIud2hlcmUoe1xuXHRcdFx0J3VzZXJzLnVzZXJuYW1lJzogcmVxLm15U2Vzc2lvbi51c2VyXG5cdFx0fSlcblx0fSlcblx0LmZldGNoQWxsKClcblx0LnRoZW4oZnVuY3Rpb24oZnJpZW5kcyl7XG5cdFx0cmV0dXJuIFByb21pc2UubWFwKGZyaWVuZHMubW9kZWxzLCBmdW5jdGlvbihmcmllbmQpIHtcblx0XHRcdHJldHVybiBuZXcgVXNlcih7aWQ6IGZyaWVuZC5hdHRyaWJ1dGVzLnVzZXIyaWR9KS5mZXRjaCgpXG5cdFx0XHQudGhlbihmdW5jdGlvbihmcmllbmRVc2VyKXtcblx0XHRcdFx0cmV0dXJuIGZyaWVuZFVzZXIuYXR0cmlidXRlcy51c2VybmFtZTtcblx0XHRcdH0pXG5cdFx0fSlcblx0fSlcblx0LnRoZW4oZnVuY3Rpb24oZnJpZW5kcyl7XG5cdFx0Y29uc29sZS5sb2coJ3NlbmRpbmcgYSBsaXN0IG9mIGZyaWVuZCBuYW1lcycsIGZyaWVuZHMpO1xuXHRcdHJlcy5qc29uKGZyaWVuZHMpO1xuXHR9KVxufVxuXG4vL3RoaXMgd291bGQgc2VuZCBhIG5vdGljZSB0byB0aGUgdXNlciB3aG8gcmVjZWl2ZSB0aGUgZnJpZW5kIHJlcXVlc3QsIHByb21wdGluZyB0aGVtIHRvIGFjY2VwdCBvciBkZW55IHRoZSByZXF1ZXN0XG5leHBvcnRzLmFkZEZyaWVuZCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cbn07XG5cblxuLy90aGlzIHdvdWxkIGNvbmZpcm0gdGhlIGZyaWVuZHNoaXAgYW5kIGVzdGFibGlzaCB0aGUgcmVsYXRpb25zaGlwIGluIHRoZSBkYXRhYmFzZVxuZXhwb3J0cy5jb25maXJtRnJpZW5kc2hpcCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cbn07XG5cblxuXG5leHBvcnRzLmdldEZyaWVuZHMgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICB2YXIgcGVvcGxlSWQgPSBbXTtcbiAgdmFyIGlkID0gcmVxLm15U2Vzc2lvbi51c2VyXG4gIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgaWQsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xuICAgIHZhciB1c2VyaWQgPSByZXNwWzBdLmlkO1xuICBcbiAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByYXRpbmdzIFdIRVJFIHVzZXJpZCA9ID8nLCB1c2VyaWQsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xuICB2YXIgdXNlcnNSYXRpbmdzPXJlc3AubWFwKGZ1bmN0aW9uKGEpeyByZXR1cm4gW2EubW92aWVpZCwgYS5zY29yZV19KTtcblxuICAgY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHJlbGF0aW9ucyBXSEVSRSB1c2VyMWlkID0gPycsIHVzZXJpZCwgZnVuY3Rpb24oZXJyLCByZXNwKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3AubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHBlb3BsZUlkLmluZGV4T2YocmVzcFtpXS51c2VyMmlkKSA9PT0gLTEpIHtcbiAgICAgICAgICBwZW9wbGVJZC5wdXNoKHJlc3BbaV0udXNlcjJpZCk7XG4gICAgICAgIH1cblxuICAgICAgfVxuICAgICAgdmFyIHBlb3BsZSA9IFtdXG4gICAgICB2YXIga2V5SWQ9e307XG4gICAgICBwZW9wbGVJZC5mb3JFYWNoKGZ1bmN0aW9uKGEpIHtcbiAgICAgIGNvbi5xdWVyeSgnU0VMRUNUIHVzZXJuYW1lIEZST00gdXNlcnMgV0hFUkUgaWQgPSA/JywgYSwgZnVuY3Rpb24oZXJyLCByZXNwbykge1xuICAgICAgXHRrZXlJZFthXT1yZXNwb1swXS51c2VybmFtZTtcbiAgICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHJhdGluZ3MgV0hFUkUgdXNlcmlkID0nKydcIicrYSsnXCInLCBmdW5jdGlvbihlcnIsIHJlc3ApIHtcbnBlb3BsZS5wdXNoKHJlc3AubWFwKGZ1bmN0aW9uKGEpe3JldHVybiBbYS51c2VyaWQsYS5tb3ZpZWlkLGEuc2NvcmVdO30pKTtcbmlmIChwZW9wbGUubGVuZ3RoPT09cGVvcGxlSWQubGVuZ3RoKXtcblxuXG52YXIgZmluYWwgPSB7fTtcblxuXG5mb3IgKHZhciBpID0gMDsgaSA8IHBlb3BsZS5sZW5ndGg7IGkrKykge1xuICBmaW5hbFtrZXlJZFtwZW9wbGVbaV1bMF1bMF1dXSA9IFtdO1xuICBmb3IgKHZhciB4ID0gMDsgeCA8IHBlb3BsZVtpXS5sZW5ndGg7IHgrKykge1xuICAgIGZpbmFsW2tleUlkW3Blb3BsZVtpXVswXVswXV1dLnB1c2goW10pO1xuXG4gICAgZm9yICh2YXIgeiA9IDE7IHogPCBwZW9wbGVbaV1beF0ubGVuZ3RoOyB6KyspIHtcbiAgICAgIGZpbmFsW2tleUlkW3Blb3BsZVtpXVswXVswXV1dW3hdLnB1c2gocGVvcGxlW2ldW3hdW3pdKVxuICAgIH1cbiAgfVxufVxuXG5jb25zb2xlLmxvZygnZmluYWwnLGZpbmFsLHVzZXJzUmF0aW5ncyk7XG5cbnZhciBjb21wYXJpc29ucz17fTtcbmZvciAodmFyIGtleSBpbiBmaW5hbCl7XG4gIFxuICAgIGNvbXBhcmlzb25zW2tleV09Y29tcCh1c2Vyc1JhdGluZ3MsZmluYWxba2V5XSlcbiAgfVxuXG5jb25zb2xlLmxvZyhjb21wYXJpc29ucyk7XG52ZXJ5RmluYWw9W107XG5mb3IgKHZhciBrZXkgaW4gY29tcGFyaXNvbnMpe1xuXHR2ZXJ5RmluYWwucHVzaChba2V5LGNvbXBhcmlzb25zW2tleV1dKVxufVxuY29uc29sZS5sb2codmVyeUZpbmFsKTtcblxucmVzLnNlbmQodmVyeUZpbmFsKTtcbn1cblxuXG59KVxuXG4gICAgICAgIH0pXG4gICAgICB9KTtcbn0pXG4gICAgfSlcblxuICB9KVxufTtcblxuXG5cbi8vVEJEXG5leHBvcnRzLmdldEhpZ2hDb21wYXRpYmlsaXR5VXNlcnMgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICBcbn07XG5cblxuLy9UQkRcbmV4cG9ydHMuZ2V0UmVjb21tZW5kZWRNb3ZpZXMgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXG59OyJdfQ==
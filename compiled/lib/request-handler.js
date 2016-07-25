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

// var con = mysql.createConnection({
//   host     : 'us-cdbr-iron-east-04.cleardb.net',
//   user     : 'b03916e750e81d',
//   password : 'bef4f775',
//   database : 'heroku_919bcc8005bfd4c'
// });

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
  // console.log('this is the session',req.session)
  new User({ username: req.body.name }).fetch().then(function (found) {
    if (found) {
      //check password
      //if (password matches)
      //{ add sessions and redirect}
      console.log('username already exist, cannot signup ', req.body.name);
      res.status(403).send('username exist');
    } else {
      console.log('creating user');
      req.mySession.user = req.body.name;
      Users.create({
        username: req.body.name,
        password: req.body.password
      }).then(function (user) {
        console.log('created a new user');
        res.status(201).send('login created');
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
      message: req.body.message,
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

exports.removeWatchRequest = function (req, res) {
  if (Array.isArray(req.body.requestee)) {
    var requestees = req.body.requestee;
  } else {
    var requestees = [req.body.requestee];
  }
  var requestor = req.body.requestor;
  var movie = req.body.movie;

  allRequest.forge({ requestor: requestor, requestee: requestees, movie: movie }).fetch().then(function (allRequest) {
    allRequest.destroy().then(function () {
      res.json({ error: true, data: { message: 'User successfully deleted' } });
    }).catch(function (err) {
      res.status(500).json({ error: true, data: { message: err.message } });
    });
  }).catch(function (err) {
    res.status(500).json({ error: true, data: { message: err.message } });
  });
};

exports.sendRequest = function (req, response) {
  console.log('this is what Im getting', req.body);
  if (req.mySession.user === req.body.name) {
    response.send("You can't friend yourself!");
  } else {

    var request = { requestor: req.mySession.user, requestee: req.body.name, requestTyp: 'friend' };

    con.query('SELECT requestee,response FROM allrequests WHERE  requestor = ? AND requestTyp =' + '"' + 'friend' + '"', request['requestor'], function (err, res) {
      if (res === undefined) {
        response.send('no friends');
      }
      var test = res.filter(function (a) {
        return a.response === null;
      });
      var test2 = test.map(function (a) {
        return a.requestee;
      });
      console.log('names of people whom Ive requested as friends', test);

      con.query('INSERT INTO allrequests SET ?', request, function (err, resp) {
        if (err) throw err;
        console.log('Last insert ID:', resp.insertId);
        response.send(test2);
      });
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
  var movie = req.body.movie;

  console.log('this is req body ', req.body);

  con.query('UPDATE allrequests SET response=' + '"' + 'yes' + '"' + '  WHERE requestor = ' + '"' + requestor + '"' + ' AND movie=' + '"' + movie + '"', function (err, res) {
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
  // allRequest.forge({requestor: requestor, requestee: requestee})
  //   .fetch().then(function(allRequest) {
  //     allRequest.destroy()
  //       .then(function() {
  //         response.json({error: true, data: {message: 'User successfully deleted'}});
  //       })
  //       .catch(function(err) {
  //         response.status(500).json({error: true, data: {message: err.message}});
  //       });
  //   })
  //   .catch(function(err) {
  //     response.status(500).json({error: true, data: {message: err.message}});
  //   });
};

exports.removeRequest = function (req, res) {
  var requestor = req.body.requestor;
  var requestee = req.body.requestee;

  allRequest.forge({ requestor: requestor, requestee: requestee }).fetch().then(function (allRequest) {
    allRequest.destroy().then(function () {
      res.json({ error: true, data: { message: 'User successfully deleted' } });
    }).catch(function (err) {
      res.status(500).json({ error: true, data: { message: req.body } });
    });
  }).catch(function (err) {
    res.status(500).json({ error: true, data: { message: req.body } });
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
  var movie = req.body.movie;

  con.query('UPDATE allrequests SET response=' + '"' + 'no' + '"' + ' WHERE requestor = ' + '"' + requestor + '"' + ' AND requestee=' + '"' + requestee + '"' + ' AND movie =' + '"' + movie + '"', function (err, res) {
    if (err) throw err;
    console.log('Last insert ID:', res.insertId);
    // response.send(requestor + 'deleted');
  });

  // allRequest.forge({requestor: requestor, requestee: requestee})
  //   .fetch().then(function(allRequest) {
  //     allRequest.destroy()
  //       .then(function() {
  //         response.json({error: true, data: {message: 'User successfully deleted'}});
  //       })
  //       .catch(function(err) {
  //         response.status(500).json({error: true, data: {message: err.message}});
  //       });
  //   })
  //   .catch(function(err) {
  //     response.status(500).json({error: true, data: {message: err.message}});
  //   });
};

exports.signupUser = function (req, res) {
  console.log('calling login', req.body);
  // console.log('this is the session',req.session)
  new User({ username: req.body.name }).fetch().then(function (found) {
    if (found) {
      //check password
      //if (password matches)
      //{ add sessions and redirect}
      console.log('username already exist, cannot signup ', req.body.name);
      res.status(403).send('username exist');
    } else {
      console.log('creating user');
      req.mySession.user = req.body.name;
      Users.create({
        username: req.body.name,
        password: req.body.password
      }).then(function (user) {
        console.log('created a new user');
        res.status(201).send('login created');
      });
    }
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
          res.status(404).send('bad login');
          console.log('wrong password');
        }
      });
    } else {
      res.status(404).send('bad login');
      console.log('user not found');
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
    console.log('this should be ling/2', id);

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
        console.log('This should also be peopleee', peopleId);
        var keyId = {};
        peopleId.forEach(function (a) {

          con.query('SELECT username FROM users WHERE id = ?', a, function (err, respo) {
            keyId[a] = respo[0].username;
            console.log('this is ONE of the people!!', respo[0].username);
            con.query('SELECT * FROM ratings WHERE userid =' + '"' + a + '"', function (err, re) {
              console.log('this is a', a);
              if (re.length === 0) {
                re = [{ userid: a, movieid: Math.round(Math.random() * 10000), score: 99 }];
              }
              console.log('this should be the ratings from each person!!', re);

              people.push(re.map(function (a) {
                return [a.userid, a.movieid, a.score];
              }));

              if (people.length === peopleId.length) {
                var final = {};

                console.log('this should be people', people);
                for (var i = 0; i < people.length; i++) {
                  if (people[i][0] !== undefined) {
                    final[keyId[people[i][0][0]]] = [];
                    for (var x = 0; x < people[i].length; x++) {
                      final[keyId[people[i][0][0]]].push([]);
                      for (var z = 1; z < people[i][x].length; z++) {
                        final[keyId[people[i][0][0]]][x].push(people[i][x][z]);
                      }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9yZXF1ZXN0LWhhbmRsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQSxJQUFJLFNBQVEsU0FBUixNQUFRLENBQVMsSUFBVCxFQUFjLElBQWQsRUFBbUI7QUFDL0IsTUFBSSxPQUFLLEtBQUssR0FBTCxDQUFTLE9BQUssSUFBZCxDQUFUO0FBQ0EsU0FBTyxJQUFFLElBQVQ7QUFDQyxDQUhEOztBQUtBLElBQUksT0FBTyxTQUFQLElBQU8sQ0FBUyxLQUFULEVBQWdCLE1BQWhCLEVBQXdCO0FBQ25DLE1BQUksUUFBTyxFQUFYO0FBQ0UsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFHLE1BQU0sTUFBekIsRUFBaUMsR0FBakMsRUFBc0M7O0FBRXBDLFNBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxPQUFPLE1BQTNCLEVBQW1DLEdBQW5DLEVBQXdDOztBQUV0QyxVQUFJLE1BQU0sQ0FBTixFQUFTLENBQVQsTUFBZ0IsT0FBTyxDQUFQLEVBQVUsQ0FBVixDQUFwQixFQUFrQzs7QUFFcEMsY0FBTSxJQUFOLENBQVcsT0FBTyxNQUFNLENBQU4sRUFBUyxDQUFULENBQVAsRUFBbUIsT0FBTyxDQUFQLEVBQVUsQ0FBVixDQUFuQixDQUFYO0FBRUc7QUFDRjtBQUNGO0FBQ0gsTUFBSSxNQUFLLE1BQU0sTUFBTixDQUFhLFVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYTtBQUFDLFdBQU8sSUFBRSxDQUFUO0FBQVcsR0FBdEMsRUFBdUMsQ0FBdkMsQ0FBVDtBQUNBLFNBQU8sS0FBSyxLQUFMLENBQVcsS0FBRyxHQUFILEdBQU8sTUFBTSxNQUF4QixDQUFQO0FBQ0MsQ0FmRDs7Ozs7QUF3QkEsSUFBSSxLQUFLLFFBQVEscUJBQVIsQ0FBVDtBQUNBLElBQUksUUFBUSxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUksVUFBVSxRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQUksUUFBUSxRQUFRLHFCQUFSLENBQVo7QUFDQSxJQUFJLFNB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RCx3QkFBUSxHQUFSLENBQVksU0FBWjtBQUNBLG9CQUFJLElBQUosQ0FBUyxTQUFUO0FBQ0Q7QUFDRixhQXZDRDtBQXdDRCxXQTNDRDtBQTRDRCxTQTlDRDtBQStDRCxPQXhERDtBQXlERCxLQTVERDtBQTZERCxHQWpFRDtBQWtFRCxDQXJFRDs7O0FBMEVBLFFBQVEseUJBQVIsR0FBb0MsVUFBUyxHQUFULEVBQWMsR0FBZCxFQUFtQixDQUV0RCxDQUZEOzs7QUFNQSxRQUFRLG9CQUFSLEdBQStCLFVBQVMsR0FBVCxFQUFjLEdBQWQsRUFBbUIsQ0FFakQsQ0FGRCIsImZpbGUiOiJyZXF1ZXN0LWhhbmRsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vL1RoZSBhbGdvcml0aG1cbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xudmFyIGhlbHBlcj0gZnVuY3Rpb24obnVtMSxudW0yKXtcbnZhciBkaWZmPU1hdGguYWJzKG51bTEtbnVtMik7XG5yZXR1cm4gNS1kaWZmO1xufVxuXG52YXIgY29tcCA9IGZ1bmN0aW9uKGZpcnN0LCBzZWNvbmQpIHtcbnZhciBmaW5hbD0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGk8IGZpcnN0Lmxlbmd0aDsgaSsrKSB7XG5cbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHNlY29uZC5sZW5ndGg7IHgrKykge1xuXG4gICAgICBpZiAoZmlyc3RbaV1bMF0gPT09IHNlY29uZFt4XVswXSkge1xuXG4gICAgZmluYWwucHVzaChoZWxwZXIoZmlyc3RbaV1bMV0sc2Vjb25kW3hdWzFdKSlcblxuICAgICAgfVxuICAgIH1cbiAgfVxudmFyIHN1bT0gZmluYWwucmVkdWNlKGZ1bmN0aW9uKGEsYil7cmV0dXJuIGErYn0sMCk7XG5yZXR1cm4gTWF0aC5yb3VuZCgyMCpzdW0vZmluYWwubGVuZ3RoKVxufVxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuXG5cblxudmFyIGRiID0gcmVxdWlyZSgnLi4vYXBwL2RiQ29ubmVjdGlvbicpO1xudmFyIG15c3FsID0gcmVxdWlyZSgnbXlzcWwnKTtcbnZhciBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xudmFyIE1vdmllID0gcmVxdWlyZSgnLi4vYXBwL21vZGVscy9tb3ZpZScpO1xudmFyIFJhdGluZyA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvcmF0aW5nJyk7XG52YXIgUmVsYXRpb24gPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL3JlbGF0aW9uJyk7XG52YXIgVXNlciA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvdXNlcicpO1xudmFyIGFsbFJlcXVlc3QgPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL2FsbFJlcXVlc3QnKTtcblxudmFyIE1vdmllcyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy9tb3ZpZXMnKTtcbnZhciBSYXRpbmdzID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL3JhdGluZ3MnKTtcbnZhciBSZWxhdGlvbnMgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvcmVsYXRpb25zJyk7XG52YXIgVXNlcnMgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvdXNlcnMnKTtcbnZhciBhbGxSZXF1ZXN0cyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy9hbGxSZXF1ZXN0cycpO1xuXG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoXCJibHVlYmlyZFwiKTtcbnZhciByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdCcpO1xuXG52YXIgY29uID0gbXlzcWwuY3JlYXRlQ29ubmVjdGlvbih7XG4gIGhvc3Q6IFwibG9jYWxob3N0XCIsXG4gIHVzZXI6IFwicm9vdFwiLFxuICBwYXNzd29yZDogXCIxMjM0NVwiLFxuICBkYXRhYmFzZTogXCJNYWluRGF0YWJhc2VcIlxufSk7XG5cbi8vIHZhciBjb24gPSBteXNxbC5jcmVhdGVDb25uZWN0aW9uKHtcbi8vICAgaG9zdCAgICAgOiAndXMtY2Rici1pcm9uLWVhc3QtMDQuY2xlYXJkYi5uZXQnLFxuLy8gICB1c2VyICAgICA6ICdiMDM5MTZlNzUwZTgxZCcsXG4vLyAgIHBhc3N3b3JkIDogJ2JlZjRmNzc1Jyxcbi8vICAgZGF0YWJhc2UgOiAnaGVyb2t1XzkxOWJjYzgwMDViZmQ0Yydcbi8vIH0pO1xuXG5jb24uY29ubmVjdChmdW5jdGlvbihlcnIpe1xuICBpZihlcnIpe1xuICAgIGNvbnNvbGUubG9nKCdFcnJvciBjb25uZWN0aW5nIHRvIERiJyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnNvbGUubG9nKCdDb25uZWN0aW9uIGVzdGFibGlzaGVkJyk7XG59KTtcblxuLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy91c2VyIGF1dGhcbi8vLy8vLy8vLy8vLy8vLy8vXG5cbmV4cG9ydHMuc2lnbnVwVXNlciA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cdGNvbnNvbGUubG9nKCdjYWxsaW5nIGxvZ2luJywgcmVxLmJvZHkpO1xuXHQvLyBjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgc2Vzc2lvbicscmVxLnNlc3Npb24pXG4gIG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUgfSkuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGZvdW5kKSB7XG5cdCAgaWYgKGZvdW5kKSB7XG5cdCAgXHQvL2NoZWNrIHBhc3N3b3JkXG5cdCAgXHQgICAvL2lmIChwYXNzd29yZCBtYXRjaGVzKVxuXHQgIFx0ICAgLy97IGFkZCBzZXNzaW9ucyBhbmQgcmVkaXJlY3R9XG5cdCAgXHRjb25zb2xlLmxvZygndXNlcm5hbWUgYWxyZWFkeSBleGlzdCwgY2Fubm90IHNpZ251cCAnLCByZXEuYm9keS5uYW1lKTtcblx0ICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKCd1c2VybmFtZSBleGlzdCcpO1xuXHQgIH0gZWxzZSB7XG5cdCAgXHRjb25zb2xlLmxvZygnY3JlYXRpbmcgdXNlcicpO1xuICAgICAgcmVxLm15U2Vzc2lvbi51c2VyID0gcmVxLmJvZHkubmFtZTtcblx0ICAgIFVzZXJzLmNyZWF0ZSh7XG5cdCAgICAgIHVzZXJuYW1lOiByZXEuYm9keS5uYW1lLFxuXHQgICAgICBwYXNzd29yZDogcmVxLmJvZHkucGFzc3dvcmQsXG5cdCAgICB9KVxuXHQgICAgLnRoZW4oZnVuY3Rpb24odXNlcikge1xuXHRcdCAgXHRjb25zb2xlLmxvZygnY3JlYXRlZCBhIG5ldyB1c2VyJyk7XG5cdCAgICAgIHJlcy5zdGF0dXMoMjAxKS5zZW5kKCdsb2dpbiBjcmVhdGVkJyk7XG5cdCAgICB9KTtcblx0ICB9XG5cdH0pO1xufTtcblxuXG5leHBvcnRzLnNlbmRXYXRjaFJlcXVlc3QgPSBmdW5jdGlvbihyZXEsIHJlc3BvbnNlKSB7XG5cdGNvbnNvbGUubG9nKHJlcS5ib2R5LnJlcXVlc3RlZSlcblx0aWYgKEFycmF5LmlzQXJyYXkocmVxLmJvZHkucmVxdWVzdGVlKSkge1xuXHRcdHZhciByZXF1ZXN0ZWVzID0gcmVxLmJvZHkucmVxdWVzdGVlO1xuXHR9IGVsc2Uge1xuXHRcdHZhciByZXF1ZXN0ZWVzID0gW3JlcS5ib2R5LnJlcXVlc3RlZV07XG5cdH1cblx0UHJvbWlzZS5lYWNoKHJlcXVlc3RlZXMsIGZ1bmN0aW9uKHJlcXVlc3RlZSl7XG5cdFx0dmFyIHJlcXVlc3QgPSB7XG4gICAgICBtZXNzYWdlOiByZXEuYm9keS5tZXNzYWdlLFxuXHRcdFx0cmVxdWVzdG9yOiByZXEubXlTZXNzaW9uLnVzZXIsIFxuXHRcdFx0cmVxdWVzdFR5cDond2F0Y2gnLFxuXHRcdFx0bW92aWU6cmVxLmJvZHkubW92aWUsXG5cdFx0XHRyZXF1ZXN0ZWU6IHJlcXVlc3RlZVxuXHRcdH07XG5cdFx0Y29uLnF1ZXJ5KCdJTlNFUlQgSU5UTyBhbGxyZXF1ZXN0cyBTRVQgPycsIHJlcXVlc3QsIGZ1bmN0aW9uKGVycixyZXMpe1xuXHRcdCAgaWYoZXJyKSB0aHJvdyBlcnI7XG5cdFx0ICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcblx0XHR9KTtcblx0fSlcblx0LnRoZW4oZnVuY3Rpb24oZG9uZSl7XG5cdFx0cmVzcG9uc2Uuc2VuZCgnVGhhdHMgbXkgc3R5bGUhJyk7XG5cdH0pXG59XG5cbmV4cG9ydHMucmVtb3ZlV2F0Y2hSZXF1ZXN0ID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkocmVxLmJvZHkucmVxdWVzdGVlKSkge1xuICAgIHZhciByZXF1ZXN0ZWVzID0gcmVxLmJvZHkucmVxdWVzdGVlO1xuICB9IGVsc2Uge1xuICAgIHZhciByZXF1ZXN0ZWVzID0gW3JlcS5ib2R5LnJlcXVlc3RlZV07XG4gIH1cbiAgdmFyIHJlcXVlc3Rvcj1yZXEuYm9keS5yZXF1ZXN0b3I7XG4gIHZhciBtb3ZpZSA9IHJlcS5ib2R5Lm1vdmllO1xuXG4gIGFsbFJlcXVlc3QuZm9yZ2Uoe3JlcXVlc3RvcjogcmVxdWVzdG9yLCByZXF1ZXN0ZWU6IHJlcXVlc3RlZXMsIG1vdmllOiBtb3ZpZSB9KVxuICAgIC5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oYWxsUmVxdWVzdCkge1xuICAgICAgYWxsUmVxdWVzdC5kZXN0cm95KClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmVzLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogJ1VzZXIgc3VjY2Vzc2Z1bGx5IGRlbGV0ZWQnfX0pO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XG4gICAgICAgIH0pO1xuICAgIH0pXG4gICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XG4gICAgfSk7XG59O1xuXG5cbmV4cG9ydHMuc2VuZFJlcXVlc3QgPSBmdW5jdGlvbihyZXEsIHJlc3BvbnNlKSB7XG4gIGNvbnNvbGUubG9nKCd0aGlzIGlzIHdoYXQgSW0gZ2V0dGluZycsIHJlcS5ib2R5KTtcbiAgaWYgKHJlcS5teVNlc3Npb24udXNlcj09PXJlcS5ib2R5Lm5hbWUpe1xuICAgIHJlc3BvbnNlLnNlbmQoXCJZb3UgY2FuJ3QgZnJpZW5kIHlvdXJzZWxmIVwiKVxuICB9IGVsc2Uge1xuXG52YXIgcmVxdWVzdCA9IHtyZXF1ZXN0b3I6IHJlcS5teVNlc3Npb24udXNlciwgcmVxdWVzdGVlOiByZXEuYm9keS5uYW1lLCByZXF1ZXN0VHlwOidmcmllbmQnfTtcblxuY29uLnF1ZXJ5KCdTRUxFQ1QgcmVxdWVzdGVlLHJlc3BvbnNlIEZST00gYWxscmVxdWVzdHMgV0hFUkUgIHJlcXVlc3RvciA9ID8gQU5EIHJlcXVlc3RUeXAgPScrJ1wiJysgJ2ZyaWVuZCcrJ1wiJywgcmVxdWVzdFsncmVxdWVzdG9yJ10sIGZ1bmN0aW9uKGVycixyZXMpe1xuaWYgKHJlcyA9PT0gdW5kZWZpbmVkKSB7XG4gIHJlc3BvbnNlLnNlbmQoJ25vIGZyaWVuZHMnKVxufVxudmFyIHRlc3Q9cmVzLmZpbHRlcihmdW5jdGlvbihhKXtyZXR1cm4gYS5yZXNwb25zZT09PW51bGx9KVxudmFyIHRlc3QyPXRlc3QubWFwKGZ1bmN0aW9uKGEpeyByZXR1cm4gYS5yZXF1ZXN0ZWV9KVxuY29uc29sZS5sb2coJ25hbWVzIG9mIHBlb3BsZSB3aG9tIEl2ZSByZXF1ZXN0ZWQgYXMgZnJpZW5kcycsdGVzdCk7XG5cblxuXG5jb24ucXVlcnkoJ0lOU0VSVCBJTlRPIGFsbHJlcXVlc3RzIFNFVCA/JywgcmVxdWVzdCwgZnVuY3Rpb24oZXJyLHJlc3Ape1xuICBpZihlcnIpIHRocm93IGVycjtcbiAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlc3AuaW5zZXJ0SWQpO1xuICByZXNwb25zZS5zZW5kKHRlc3QyKTtcbn0pXG59KTtcblxuIH1cbn07XG5cblxuXG5cblxuXG5cblxuXG5leHBvcnRzLmxpc3RSZXF1ZXN0cyA9IGZ1bmN0aW9uKHJlcSwgcmVzcG9uc2UpIHtcbiAgdmFyIHJlcXVlc3QgPSByZXEubXlTZXNzaW9uLnVzZXJcblxuICBjb24ucXVlcnkoJ1NlbGVjdCAqIEZST00gYWxscmVxdWVzdHMgV0hFUkUgcmVxdWVzdGVlPScrJ1wiJytyZXF1ZXN0KydcIicrJycrJ09SIHJlcXVlc3RvciA9JysnXCInK3JlcXVlc3QrJ1wiJysnJywgZnVuY3Rpb24oZXJyLHJlcyl7XG4gIGlmKGVycikgdGhyb3cgZXJyO1xuICBjb25zb2xlLmxvZyhyZXMpXG4gIHJlc3BvbnNlLnNlbmQoW3JlcyxyZXF1ZXN0XSk7XG59KTtcblxuXG59O1xuXG5leHBvcnRzLmFjY2VwdCA9IGZ1bmN0aW9uKHJlcSwgcmVzcG9uc2UpIHtcbiAgdmFyIHJlcXVlc3Rvcj1yZXEuYm9keS5wZXJzb25Ub0FjY2VwdDtcbiAgdmFyIHJlcXVlc3RlZT1yZXEubXlTZXNzaW9uLnVzZXI7XG4gIHZhciBtb3ZpZSA9IHJlcS5ib2R5Lm1vdmllO1xuXG4gIGNvbnNvbGUubG9nKCd0aGlzIGlzIHJlcSBib2R5ICcscmVxLmJvZHkpO1xuXG4gIGNvbi5xdWVyeSgnVVBEQVRFIGFsbHJlcXVlc3RzIFNFVCByZXNwb25zZT0nKydcIicgKyAneWVzJyArICdcIicrJyAgV0hFUkUgcmVxdWVzdG9yID0gJysnXCInKyByZXF1ZXN0b3IrJ1wiJysnIEFORCBtb3ZpZT0nKydcIicrIG1vdmllKydcIicsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XG4gICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XG4gICAgfSk7XG5cbiAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCByZXEuYm9keS5wZXJzb25Ub0FjY2VwdCwgZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlc1swXS5pZCwgZXJyKTtcbiAgICB2YXIgcGVyc29uMSA9IHJlc1swXS5pZDtcbiAgICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIHJlcS5teVNlc3Npb24udXNlciwgZnVuY3Rpb24oZXJyLCByZXNwKSB7XG4gICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzcFswXS5pZCwgZXJyKTtcblxuICAgICAgdmFyIHBlcnNvbjIgPSByZXNwWzBdLmlkO1xuICAgICAgdmFyIHJlcXVlc3QgPSB7XG4gICAgICAgIHVzZXIxaWQ6IHBlcnNvbjEsXG4gICAgICAgIHVzZXIyaWQ6IHBlcnNvbjJcbiAgICAgIH1cbiAgICAgIHZhciByZXF1ZXN0MiA9IHtcbiAgICAgICAgdXNlcjFpZDogcGVyc29uMixcbiAgICAgICAgdXNlcjJpZDogcGVyc29uMVxuICAgICAgfVxuXG4gICAgICBjb25zb2xlLmxvZygndGhlIHJlcXVlc3RzOjo6JyxyZXF1ZXN0LHJlcXVlc3QyKVxuICAgICAgY29uLnF1ZXJ5KCdJTlNFUlQgSU5UTyByZWxhdGlvbnMgU0VUID8nLCByZXF1ZXN0LCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xuXG4gICAgICBjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIHJlbGF0aW9ucyBTRVQgPycsIHJlcXVlc3QyLCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XG5cbiAgICAgICAgICAgcmVzcG9uc2Uuc2VuZCgnVGhhdHMgbXkgc3R5bGUhISEnKTtcbiAgICAgICAgfSlcbiAgICAgIH0pO1xuICAgIH0pXG4gIH0pXG4gIC8vIGFsbFJlcXVlc3QuZm9yZ2Uoe3JlcXVlc3RvcjogcmVxdWVzdG9yLCByZXF1ZXN0ZWU6IHJlcXVlc3RlZX0pXG4gIC8vICAgLmZldGNoKCkudGhlbihmdW5jdGlvbihhbGxSZXF1ZXN0KSB7XG4gIC8vICAgICBhbGxSZXF1ZXN0LmRlc3Ryb3koKVxuICAvLyAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgLy8gICAgICAgICByZXNwb25zZS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6ICdVc2VyIHN1Y2Nlc3NmdWxseSBkZWxldGVkJ319KTtcbiAgLy8gICAgICAgfSlcbiAgLy8gICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAvLyAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XG4gIC8vICAgICAgIH0pO1xuICAvLyAgIH0pXG4gIC8vICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAvLyAgICAgcmVzcG9uc2Uuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcbiAgLy8gICB9KTtcbn07XG5cbmV4cG9ydHMucmVtb3ZlUmVxdWVzdCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIHZhciByZXF1ZXN0b3I9cmVxLmJvZHkucmVxdWVzdG9yO1xuICB2YXIgcmVxdWVzdGVlPXJlcS5ib2R5LnJlcXVlc3RlZTtcblxuICBhbGxSZXF1ZXN0LmZvcmdlKHtyZXF1ZXN0b3I6IHJlcXVlc3RvciwgcmVxdWVzdGVlOiByZXF1ZXN0ZWV9KVxuICAgIC5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oYWxsUmVxdWVzdCkge1xuICAgICAgYWxsUmVxdWVzdC5kZXN0cm95KClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmVzLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogJ1VzZXIgc3VjY2Vzc2Z1bGx5IGRlbGV0ZWQnfX0pO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogcmVxLmJvZHl9fSk7XG4gICAgICAgIH0pO1xuICAgIH0pXG4gICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogcmVxLmJvZHl9fSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydHMuZ2V0VGhpc0ZyaWVuZHNNb3ZpZXM9ZnVuY3Rpb24ocmVxLHJlc3BvbnNlKXtcblxuICB2YXIgbW92aWVzPVtdO1xuICBjb25zb2xlLmxvZyhyZXEuYm9keS5zcGVjaWZpY0ZyaWVuZCk7XG4gIHZhciBwZXJzb249cmVxLmJvZHkuc3BlY2lmaWNGcmllbmRcbiAgdmFyIGlkPW51bGxcbiAgdmFyIGxlbj1udWxsO1xuICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIHBlcnNvbiwgZnVuY3Rpb24oZXJyLCByZXNwKXtcbmNvbnNvbGUubG9nKHJlc3ApXG5pZD1yZXNwWzBdLmlkO1xuXG5cbmNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByYXRpbmdzIFdIRVJFIHVzZXJpZCA9ID8nLCBpZCAsZnVuY3Rpb24oZXJyLHJlc3Ape1xuY29uc29sZS5sb2coJ2VycnJycnJycnInLGVycixyZXNwLmxlbmd0aClcbmxlbj1yZXNwLmxlbmd0aDtcbnJlc3AuZm9yRWFjaChmdW5jdGlvbihhKXtcblxuY29uLnF1ZXJ5KCdTRUxFQ1QgdGl0bGUgRlJPTSBtb3ZpZXMgV0hFUkUgaWQgPSA/JywgYS5tb3ZpZWlkICxmdW5jdGlvbihlcnIscmVzcCl7XG4gIGNvbnNvbGUubG9nKHJlc3ApXG5tb3ZpZXMucHVzaChbcmVzcFswXS50aXRsZSxhLnNjb3JlLGEucmV2aWV3XSlcbmNvbnNvbGUubG9nKG1vdmllcylcbmlmIChtb3ZpZXMubGVuZ3RoPT09bGVuKXtcbiAgcmVzcG9uc2Uuc2VuZChtb3ZpZXMpO1xufVxufSlcblxufSlcblxufSlcblxuXG4gIH1cblxuKX1cblxuZXhwb3J0cy5maW5kTW92aWVCdWRkaWVzPWZ1bmN0aW9uKHJlcSxyZXNwb25zZSl7XG4gIGNvbnNvbGUubG9nKFwieW91J3JlIHRyeWluZyB0byBmaW5kIGJ1ZGRpZXMhIVwiKTtcbmNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSB1c2VycycsZnVuY3Rpb24oZXJyLHJlc3Ape1xuICB2YXIgcGVvcGxlPXJlc3AubWFwKGZ1bmN0aW9uKGEpe3JldHVybiBhLnVzZXJuYW1lfSlcbiAgdmFyIElkcz0gcmVzcC5tYXAoZnVuY3Rpb24oYSl7cmV0dXJuIGEuaWR9KVxuICB2YXIgaWRLZXlPYmo9e31cbmZvciAodmFyIGk9MDtpPElkcy5sZW5ndGg7aSsrKXtcbiAgaWRLZXlPYmpbSWRzW2ldXT1wZW9wbGVbaV1cbn1cbmNvbnNvbGUubG9nKCdjdXJyZW50IHVzZXInLHJlcS5teVNlc3Npb24udXNlcik7XG52YXIgY3VycmVudFVzZXI9cmVxLm15U2Vzc2lvbi51c2VyXG5cblxuIHZhciBvYmoxPXt9O1xuICBmb3IgKHZhciBpPTA7aTxJZHMubGVuZ3RoO2krKyl7XG5vYmoxW2lkS2V5T2JqW0lkc1tpXV1dPVtdO1xuICB9XG5cbiAgY29uLnF1ZXJ5KCdTRUxFQ1Qgc2NvcmUsbW92aWVpZCx1c2VyaWQgRlJPTSByYXRpbmdzJyxmdW5jdGlvbihlcnIscmVzcG9uKXtcbiAgXG5mb3IgKHZhciBpPTA7aTxyZXNwb24ubGVuZ3RoO2krKyl7XG4gIG9iajFbaWRLZXlPYmpbcmVzcG9uW2ldLnVzZXJpZF1dLnB1c2goW3Jlc3BvbltpXS5tb3ZpZWlkLHJlc3BvbltpXS5zY29yZV0pXG59XG5cbmNvbnNvbGUubG9nKCdvYmoxJyxvYmoxKTtcbmN1cnJlbnRVc2VySW5mbz1vYmoxW2N1cnJlbnRVc2VyXVxuLy9jb25zb2xlLmxvZygnY3VycmVudFVzZXJJbmZvJyxjdXJyZW50VXNlckluZm8pXG52YXIgY29tcGFyaXNvbnM9e31cblxuZm9yICh2YXIga2V5IGluIG9iajEpe1xuICBpZiAoa2V5IT09Y3VycmVudFVzZXIpIHtcbiAgICBjb21wYXJpc29uc1trZXldPWNvbXAoY3VycmVudFVzZXJJbmZvLG9iajFba2V5XSlcbiAgfVxufVxuY29uc29sZS5sb2coY29tcGFyaXNvbnMpXG52YXIgZmluYWxTZW5kPVtdXG5mb3IgKHZhciBrZXkgaW4gY29tcGFyaXNvbnMpe1xuICBpZiAoY29tcGFyaXNvbnNba2V5XSAhPT0gJ05hTiUnKSB7XG4gIGZpbmFsU2VuZC5wdXNoKFtrZXksY29tcGFyaXNvbnNba2V5XV0pO1xufSBlbHNlICB7XG4gIGZpbmFsU2VuZC5wdXNoKFtrZXksXCJObyBDb21wYXJpc29uIHRvIE1ha2VcIl0pXG59XG5cbn1cblxuICByZXNwb25zZS5zZW5kKGZpbmFsU2VuZClcbn0pXG59KVxufVxuXG5cbmV4cG9ydHMuZGVjbGluZT1mdW5jdGlvbihyZXEscmVzcG9uc2Upe1xuICB2YXIgcmVxdWVzdG9yPXJlcS5ib2R5LnBlcnNvblRvRGVjbGluZTtcbiAgdmFyIHJlcXVlc3RlZT1yZXEubXlTZXNzaW9uLnVzZXI7XG4gIHZhciBtb3ZpZT1yZXEuYm9keS5tb3ZpZTtcblxuICBjb24ucXVlcnkoJ1VQREFURSBhbGxyZXF1ZXN0cyBTRVQgcmVzcG9uc2U9JysnXCInICsgJ25vJyArICdcIicrICcgV0hFUkUgcmVxdWVzdG9yID0gJysnXCInKyByZXF1ZXN0b3IrJ1wiJysnIEFORCByZXF1ZXN0ZWU9JysnXCInKyByZXF1ZXN0ZWUrJ1wiJysnIEFORCBtb3ZpZSA9JysnXCInK21vdmllKydcIicsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XG4gICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xuICAgICAgLy8gcmVzcG9uc2Uuc2VuZChyZXF1ZXN0b3IgKyAnZGVsZXRlZCcpO1xuICAgIH0pO1xuXG4gIC8vIGFsbFJlcXVlc3QuZm9yZ2Uoe3JlcXVlc3RvcjogcmVxdWVzdG9yLCByZXF1ZXN0ZWU6IHJlcXVlc3RlZX0pXG4gIC8vICAgLmZldGNoKCkudGhlbihmdW5jdGlvbihhbGxSZXF1ZXN0KSB7XG4gIC8vICAgICBhbGxSZXF1ZXN0LmRlc3Ryb3koKVxuICAvLyAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgLy8gICAgICAgICByZXNwb25zZS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6ICdVc2VyIHN1Y2Nlc3NmdWxseSBkZWxldGVkJ319KTtcbiAgLy8gICAgICAgfSlcbiAgLy8gICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAvLyAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XG4gIC8vICAgICAgIH0pO1xuICAvLyAgIH0pXG4gIC8vICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAvLyAgICAgcmVzcG9uc2Uuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcbiAgLy8gICB9KTtcbn07XG5cbmV4cG9ydHMuc2lnbnVwVXNlciA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIGNvbnNvbGUubG9nKCdjYWxsaW5nIGxvZ2luJywgcmVxLmJvZHkpO1xuICAvLyBjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgc2Vzc2lvbicscmVxLnNlc3Npb24pXG4gIG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUgfSkuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGZvdW5kKSB7XG4gICAgaWYgKGZvdW5kKSB7XG4gICAgICAvL2NoZWNrIHBhc3N3b3JkXG4gICAgICAgICAvL2lmIChwYXNzd29yZCBtYXRjaGVzKVxuICAgICAgICAgLy97IGFkZCBzZXNzaW9ucyBhbmQgcmVkaXJlY3R9XG4gICAgICBjb25zb2xlLmxvZygndXNlcm5hbWUgYWxyZWFkeSBleGlzdCwgY2Fubm90IHNpZ251cCAnLCByZXEuYm9keS5uYW1lKTtcbiAgICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKCd1c2VybmFtZSBleGlzdCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnY3JlYXRpbmcgdXNlcicpO1xuICAgICAgcmVxLm15U2Vzc2lvbi51c2VyID0gcmVxLmJvZHkubmFtZTtcbiAgICAgIFVzZXJzLmNyZWF0ZSh7XG4gICAgICAgIHVzZXJuYW1lOiByZXEuYm9keS5uYW1lLFxuICAgICAgICBwYXNzd29yZDogcmVxLmJvZHkucGFzc3dvcmQsXG4gICAgICB9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24odXNlcikge1xuICAgICAgICBjb25zb2xlLmxvZygnY3JlYXRlZCBhIG5ldyB1c2VyJyk7XG4gICAgICAgIHJlcy5zdGF0dXMoMjAxKS5zZW5kKCdsb2dpbiBjcmVhdGVkJyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTtcblxuZXhwb3J0cy5zaWduaW5Vc2VyID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcblx0Y29uc29sZS5sb2coJ2NhbGxpbmcgc2lnbmluJywgcmVxLmJvZHkpO1xuXHRuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEuYm9keS5uYW1lIH0pLmZldGNoKCkudGhlbihmdW5jdGlvbihmb3VuZCl7XG5cblx0XHRpZiAoZm91bmQpe1xuXHRcdFx0bmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLmJvZHkubmFtZSwgcGFzc3dvcmQ6cmVxLmJvZHkucGFzc3dvcmR9KS5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oZm91bmQpe1xuXHRcdFx0XHRpZiAoZm91bmQpe1xuXHRcdFx0XHRcdHJlcS5teVNlc3Npb24udXNlciA9IGZvdW5kLmF0dHJpYnV0ZXMudXNlcm5hbWU7XG4gICAgICAgICAgY29uc29sZS5sb2coZm91bmQuYXR0cmlidXRlcy51c2VybmFtZSlcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnd2UgZm91bmQgeW91ISEnKVxuXHRcdFx0XHRcdHJlcy5zZW5kKFsnaXQgd29ya2VkJyxyZXEubXlTZXNzaW9uLnVzZXJdKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXMuc3RhdHVzKDQwNCkuc2VuZCgnYmFkIGxvZ2luJyk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ3dyb25nIHBhc3N3b3JkJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlcy5zdGF0dXMoNDA0KS5zZW5kKCdiYWQgbG9naW4nKTtcblx0XHRcdGNvbnNvbGUubG9nKCd1c2VyIG5vdCBmb3VuZCcpO1xuXHRcdH1cblxuICB9KSBcblxufVxuXG5leHBvcnRzLmxvZ291dCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cdHJlcS5teVNlc3Npb24uZGVzdHJveShmdW5jdGlvbihlcnIpe1xuXHRcdGNvbnNvbGUubG9nKGVycik7XG5cdH0pO1xuXHRjb25zb2xlLmxvZygnbG9nb3V0Jyk7XG5cdHJlcy5zZW5kKCdsb2dvdXQnKTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vbW92aWUgaGFuZGxlcnNcbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vL2EgaGFuZGVsZXIgdGhhdCB0YWtlcyBhIHJhdGluZyBmcm9tIHVzZXIgYW5kIGFkZCBpdCB0byB0aGUgZGF0YWJhc2Vcbi8vIGV4cGVjdHMgcmVxLmJvZHkgdG8gaGF2ZSB0aGlzOiB7dGl0bGU6ICduYW1lJywgZ2VucmU6ICdnZW5yZScsIHBvc3RlcjogJ2xpbmsnLCByZWxlYXNlX2RhdGU6ICd5ZWFyJywgcmF0aW5nOiAnbnVtYmVyJ31cbmV4cG9ydHMucmF0ZU1vdmllID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcblx0Y29uc29sZS5sb2coJ2NhbGxpbmcgcmF0ZU1vdmllJyk7XG5cdHZhciB1c2VyaWQ7XG5cdHJldHVybiBuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEubXlTZXNzaW9uLnVzZXIgfSkuZmV0Y2goKVxuXHQudGhlbihmdW5jdGlvbihmb3VuZFVzZXIpIHtcblx0XHR1c2VyaWQgPSBmb3VuZFVzZXIuYXR0cmlidXRlcy5pZDtcblx0XHRyZXR1cm4gbmV3IFJhdGluZyh7IG1vdmllaWQ6IHJlcS5ib2R5LmlkLCB1c2VyaWQ6IHVzZXJpZCB9KS5mZXRjaCgpXG5cdFx0LnRoZW4oZnVuY3Rpb24oZm91bmRSYXRpbmcpIHtcblx0XHRcdGlmIChmb3VuZFJhdGluZykge1xuXHRcdFx0XHQvL3NpbmNlIHJhdGluZyBvciByZXZpZXcgaXMgdXBkYXRlZCBzZXBlcmF0bHkgaW4gY2xpZW50LCB0aGUgZm9sbG93aW5nXG5cdFx0XHRcdC8vbWFrZSBzdXJlIGl0IGdldHMgdXBkYXRlZCBhY2NvcmRpbmcgdG8gdGhlIHJlcVxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZygndXBkYXRlIHJhdGluZycsIGZvdW5kUmF0aW5nKVxuXHRcdFx0XHRpZiAocmVxLmJvZHkucmF0aW5nKSB7XG5cdFx0XHRcdFx0dmFyIHJhdGluZ09iaiA9IHtzY29yZTogcmVxLmJvZHkucmF0aW5nfTtcblx0XHRcdFx0fSBlbHNlIGlmIChyZXEuYm9keS5yZXZpZXcpIHtcblx0XHRcdFx0XHR2YXIgcmF0aW5nT2JqID0ge3JldmlldzogcmVxLmJvZHkucmV2aWV3fTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gbmV3IFJhdGluZyh7J2lkJzogZm91bmRSYXRpbmcuYXR0cmlidXRlcy5pZH0pXG5cdFx0XHRcdFx0LnNhdmUocmF0aW5nT2JqKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdjcmVhdGluZyByYXRpbmcnKTtcblx0XHQgICAgcmV0dXJuIFJhdGluZ3MuY3JlYXRlKHtcblx0XHQgICAgXHRzY29yZTogcmVxLmJvZHkucmF0aW5nLFxuXHRcdCAgICAgIHVzZXJpZDogdXNlcmlkLFxuXHRcdCAgICAgIG1vdmllaWQ6IHJlcS5ib2R5LmlkLFxuXHRcdCAgICAgIHJldmlldzogcmVxLmJvZHkucmV2aWV3XG5cdFx0ICAgIH0pO1x0XHRcdFx0XHRcblx0XHRcdH1cblx0XHR9KTtcblx0fSlcblx0LnRoZW4oZnVuY3Rpb24obmV3UmF0aW5nKSB7XG5cdFx0Y29uc29sZS5sb2coJ3JhdGluZyBjcmVhdGVkOicsIG5ld1JhdGluZy5hdHRyaWJ1dGVzKTtcbiAgXHRyZXMuc3RhdHVzKDIwMSkuc2VuZCgncmF0aW5nIHJlY2lldmVkJyk7XG5cdH0pXG59O1xuXG4vL3RoaXMgaGVscGVyIGZ1bmN0aW9uIGFkZHMgdGhlIG1vdmllIGludG8gZGF0YWJhc2Vcbi8vaXQgZm9sbG93cyB0aGUgc2FtZSBtb3ZpZSBpZCBhcyBUTURCXG4vL2V4cGVjdHMgcmVxLmJvZHkgdG8gaGF2ZSB0aGVzZSBhdHJpYnV0ZSA6IHtpZCwgdGl0bGUsIGdlbnJlLCBwb3N0ZXJfcGF0aCwgcmVsZWFzZV9kYXRlLCBvdmVydmlldywgdm90ZV9hdmVyYWdlfVxudmFyIGFkZE9uZU1vdmllID0gZnVuY3Rpb24obW92aWVPYmopIHtcblx0dmFyIGdlbnJlID0gKG1vdmllT2JqLmdlbnJlX2lkcykgPyBnZW5yZXNbbW92aWVPYmouZ2VucmVfaWRzWzBdXSA6ICduL2EnO1xuICByZXR1cm4gbmV3IE1vdmllKHtcbiAgXHRpZDogbW92aWVPYmouaWQsXG4gICAgdGl0bGU6IG1vdmllT2JqLnRpdGxlLFxuICAgIGdlbnJlOiBnZW5yZSxcbiAgICBwb3N0ZXI6ICdodHRwczovL2ltYWdlLnRtZGIub3JnL3QvcC93MTg1LycgKyBtb3ZpZU9iai5wb3N0ZXJfcGF0aCxcbiAgICByZWxlYXNlX2RhdGU6IG1vdmllT2JqLnJlbGVhc2VfZGF0ZSxcbiAgICBkZXNjcmlwdGlvbjogbW92aWVPYmoub3ZlcnZpZXcuc2xpY2UoMCwgMjU1KSxcbiAgICBpbWRiUmF0aW5nOiBtb3ZpZU9iai52b3RlX2F2ZXJhZ2VcbiAgfSkuc2F2ZShudWxsLCB7bWV0aG9kOiAnaW5zZXJ0J30pXG4gIC50aGVuKGZ1bmN0aW9uKG5ld01vdmllKSB7XG4gIFx0Y29uc29sZS5sb2coJ21vdmllIGNyZWF0ZWQnLCBuZXdNb3ZpZS5hdHRyaWJ1dGVzLnRpdGxlKTtcbiAgXHRyZXR1cm4gbmV3TW92aWU7XG4gIH0pXG59O1xuXG5cbi8vZ2V0IGFsbCBtb3ZpZSByYXRpbmdzIHRoYXQgYSB1c2VyIHJhdGVkXG4vL3Nob3VsZCByZXR1cm4gYW4gYXJyYXkgdGhhdCBsb29rIGxpa2UgdGhlIGZvbGxvd2luZzpcbi8vIFsge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnICwgcG9zdGVyOiAndXJsJywgcmVsZWFzZV9kYXRlOiAnZGF0ZScsIHNjb3JlOiBuLCBmcmllbmRBdmVyYWdlUmF0aW5nOiBufSAuLi4gXVxuLy8gd2lsbCBnZXQgcmF0aW5ncyBmb3IgdGhlIGN1cnJlbnQgdXNlclxuZXhwb3J0cy5nZXRVc2VyUmF0aW5ncyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIFJhdGluZy5xdWVyeShmdW5jdGlvbihxYil7XG4gIFx0cWIuaW5uZXJKb2luKCd1c2VycycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3VzZXJzLmlkJyk7XG4gIFx0cWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XG4gIFx0cWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnLCAncmF0aW5ncy51cGRhdGVkX2F0Jyk7XG4gIFx0cWIud2hlcmUoJ3VzZXJzLnVzZXJuYW1lJywgJz0nLCByZXEubXlTZXNzaW9uLnVzZXIpO1xuICBcdHFiLm9yZGVyQnkoJ3VwZGF0ZWRfYXQnLCAnREVTQycpXG4gIH0pXG4gIC5mZXRjaEFsbCgpXG4gIC50aGVuKGZ1bmN0aW9uKHJhdGluZ3Mpe1xuXHRcdC8vZGVjb3JhdGUgaXQgd2l0aCBhdmcgZnJpZW5kIHJhdGluZ1xuXHRcdHJldHVybiBQcm9taXNlLm1hcChyYXRpbmdzLm1vZGVscywgZnVuY3Rpb24ocmF0aW5nKSB7XG5cdFx0XHRyZXR1cm4gYXR0YWNoRnJpZW5kQXZnUmF0aW5nKHJhdGluZywgcmVxLm15U2Vzc2lvbi51c2VyKTtcblx0XHR9KTtcblx0fSlcbiAgLnRoZW4oZnVuY3Rpb24ocmF0aW5ncykge1xuICBcdGNvbnNvbGUubG9nKCdyZXRyaXZpbmcgYWxsIHVzZXIgcmF0aW5ncycpO1xuICBcdHJlcy5zdGF0dXMoMjAwKS5qc29uKHJhdGluZ3MpO1xuICB9KVxufTtcblxuZXhwb3J0cy5nZXRGcmllbmRVc2VyUmF0aW5ncyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIFJhdGluZy5xdWVyeShmdW5jdGlvbihxYil7XG4gIFx0cWIuaW5uZXJKb2luKCd1c2VycycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3VzZXJzLmlkJyk7XG4gIFx0cWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XG4gIFx0cWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUgYXMgZnJpZW5kU2NvcmUnLCAncmF0aW5ncy5yZXZpZXcgYXMgZnJpZW5kUmV2aWV3JywgJ3JhdGluZ3MudXBkYXRlZF9hdCcpO1xuICBcdHFiLndoZXJlKCd1c2Vycy51c2VybmFtZScsICc9JywgcmVxLnF1ZXJ5LmZyaWVuZE5hbWUpO1xuICBcdHFiLm9yZGVyQnkoJ3VwZGF0ZWRfYXQnLCAnREVTQycpXG4gIH0pXG4gIC5mZXRjaEFsbCgpXG4gIC50aGVuKGZ1bmN0aW9uKHJhdGluZ3Mpe1xuXHRcdC8vZGVjb3JhdGUgaXQgd2l0aCBjdXJyZW50IHVzZXIncyByYXRpbmdcblx0XHRyZXR1cm4gUHJvbWlzZS5tYXAocmF0aW5ncy5tb2RlbHMsIGZ1bmN0aW9uKHJhdGluZykge1xuXHRcdFx0cmV0dXJuIGF0dGFjaFVzZXJSYXRpbmcocmF0aW5nLCByZXEubXlTZXNzaW9uLnVzZXIpO1xuXHRcdH0pO1xuXHR9KVxuICAudGhlbihmdW5jdGlvbihyYXRpbmdzKSB7XG4gIFx0Y29uc29sZS5sb2coJ3JldHJpdmluZyBhbGwgdXNlciByYXRpbmdzJyk7XG4gIFx0cmVzLnN0YXR1cygyMDApLmpzb24ocmF0aW5ncyk7XG4gIH0pXG59O1xuXG4vL2EgZGVjb3JhdG9yIGZ1bmN0aW9uIHRoYXQgYXR0YWNoZXMgZnJpZW5kIGF2ZyByYXRpbmcgdG8gdGhlIHJhdGluZyBvYmpcbnZhciBhdHRhY2hGcmllbmRBdmdSYXRpbmcgPSBmdW5jdGlvbihyYXRpbmcsIHVzZXJuYW1lKSB7XG5cdHJldHVybiBleHBvcnRzLmdldEZyaWVuZFJhdGluZ3ModXNlcm5hbWUsIHJhdGluZylcblx0LnRoZW4oZnVuY3Rpb24oZnJpZW5kc1JhdGluZ3Mpe1xuXHRcdC8vaWYgZnJpZW5kc1JhdGluZ3MgaXMgbnVsbCwgUmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyBpcyBudWxsXG5cdFx0aWYgKCFmcmllbmRzUmF0aW5ncykge1xuXHRcdFx0cmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyA9IG51bGw7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgPSBhdmVyYWdlUmF0aW5nKGZyaWVuZHNSYXRpbmdzKTtcblx0XHR9XG5cdFx0cmV0dXJuIHJhdGluZztcblx0fSlcbn1cblxuLy9hIGRlY29yYXRvciBmdW5jdGlvbiB0aGF0IGF0dGFjaGVzIHVzZXIgcmF0aW5nIGFuZCByZXZpZXdzIHRvIHRoZSByYXRpbmcgb2JqXG52YXIgYXR0YWNoVXNlclJhdGluZyA9IGZ1bmN0aW9uKHJhdGluZywgdXNlcm5hbWUpIHtcblx0cmV0dXJuIFJhdGluZy5xdWVyeShmdW5jdGlvbihxYikge1xuXHRcdHFiLmlubmVySm9pbigndXNlcnMnLCAndXNlcnMuaWQnLCAnPScsICdyYXRpbmdzLnVzZXJpZCcpXG5cdFx0cWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAnbW92aWVzLmlkJywgJz0nLCAncmF0aW5ncy5tb3ZpZWlkJylcblx0XHRxYi5zZWxlY3QoJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnKVxuXHRcdHFiLndoZXJlKHtcblx0XHRcdCd1c2Vycy51c2VybmFtZSc6IHVzZXJuYW1lLFxuXHRcdFx0J21vdmllcy50aXRsZSc6IHJhdGluZy5hdHRyaWJ1dGVzLnRpdGxlLFxuXHRcdFx0J21vdmllcy5pZCc6IHJhdGluZy5hdHRyaWJ1dGVzLmlkXG5cdFx0fSlcblx0fSlcblx0LmZldGNoKClcblx0LnRoZW4oZnVuY3Rpb24odXNlclJhdGluZyl7XG5cdFx0aWYgKHVzZXJSYXRpbmcpIHtcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLnNjb3JlID0gdXNlclJhdGluZy5hdHRyaWJ1dGVzLnNjb3JlO1xuXHRcdFx0cmF0aW5nLmF0dHJpYnV0ZXMucmV2aWV3ID0gdXNlclJhdGluZy5hdHRyaWJ1dGVzLnJldmlldztcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmF0aW5nLmF0dHJpYnV0ZXMuc2NvcmUgPSBudWxsO1xuXHRcdFx0cmF0aW5nLmF0dHJpYnV0ZXMucmV2aWV3ID0gbnVsbDtcblx0XHR9XG5cdFx0cmV0dXJuIHJhdGluZztcblx0fSk7XG59O1xuXG4vL3RoaXMgaXMgYSB3cmFwZXIgZnVuY3Rpb24gZm9yIGdldEZyaWVuZFJhdGluZ3Mgd2hpY2ggd2lsbCBzZW50IHRoZSBjbGllbnQgYWxsIG9mIHRoZSBmcmllbmQgcmF0aW5nc1xuZXhwb3J0cy5oYW5kbGVHZXRGcmllbmRSYXRpbmdzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcblx0Y29uc29sZS5sb2coJ2hhbmRsZUdldEZyaWVuZFJhdGluZ3MsICcsIHJlcS5teVNlc3Npb24udXNlciwgcmVxLmJvZHkubW92aWUudGl0bGUpO1xuXHRleHBvcnRzLmdldEZyaWVuZFJhdGluZ3MocmVxLm15U2Vzc2lvbi51c2VyLCB7YXR0cmlidXRlczogcmVxLmJvZHkubW92aWV9KVxuXHQudGhlbihmdW5jdGlvbihmcmllbmRSYXRpbmdzKXtcblx0XHRyZXMuanNvbihmcmllbmRSYXRpbmdzKTtcblx0fSk7XG59XG5cbi8vdGhpcyBmdW5jdGlvbiBvdXRwdXRzIHJhdGluZ3Mgb2YgYSB1c2VyJ3MgZnJpZW5kIGZvciBhIHBhcnRpY3VsYXIgbW92aWVcbi8vZXhwZWN0IGN1cnJlbnQgdXNlcm5hbWUgYW5kIG1vdmllVGl0bGUgYXMgaW5wdXRcbi8vb3V0cHV0czoge3VzZXIyaWQ6ICdpZCcsIGZyaWVuZFVzZXJOYW1lOiduYW1lJywgZnJpZW5kRmlyc3ROYW1lOiduYW1lJywgdGl0bGU6J21vdmllVGl0bGUnLCBzY29yZTpuIH1cbmV4cG9ydHMuZ2V0RnJpZW5kUmF0aW5ncyA9IGZ1bmN0aW9uKHVzZXJuYW1lLCBtb3ZpZU9iaikge1xuXHRyZXR1cm4gVXNlci5xdWVyeShmdW5jdGlvbihxYil7XG5cdFx0cWIuaW5uZXJKb2luKCdyZWxhdGlvbnMnLCAncmVsYXRpb25zLnVzZXIxaWQnLCAnPScsICd1c2Vycy5pZCcpO1xuXHRcdHFiLmlubmVySm9pbigncmF0aW5ncycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3JlbGF0aW9ucy51c2VyMmlkJyk7XG5cdFx0cWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XG5cdFx0cWIuc2VsZWN0KCdyZWxhdGlvbnMudXNlcjJpZCcsICdtb3ZpZXMudGl0bGUnLCAncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycpO1xuXHRcdHFiLndoZXJlKHtcblx0XHRcdCd1c2Vycy51c2VybmFtZSc6IHVzZXJuYW1lLCBcblx0XHRcdCdtb3ZpZXMudGl0bGUnOiBtb3ZpZU9iai5hdHRyaWJ1dGVzLnRpdGxlLFxuXHRcdFx0J21vdmllcy5pZCc6IG1vdmllT2JqLmF0dHJpYnV0ZXMuaWQgfSk7XG5cdH0pXG5cdC5mZXRjaEFsbCgpXG5cdC50aGVuKGZ1bmN0aW9uKGZyaWVuZHNSYXRpbmdzKXtcblx0Ly90aGUgZm9sbG93aW5nIGJsb2NrIGFkZHMgdGhlIGZyaWVuZE5hbWUgYXR0cmlidXRlIHRvIHRoZSByYXRpbmdzXG5cdFx0cmV0dXJuIFByb21pc2UubWFwKGZyaWVuZHNSYXRpbmdzLm1vZGVscywgZnVuY3Rpb24oZnJpZW5kUmF0aW5nKSB7XG5cdFx0XHRyZXR1cm4gbmV3IFVzZXIoeyBpZDogZnJpZW5kUmF0aW5nLmF0dHJpYnV0ZXMudXNlcjJpZCB9KS5mZXRjaCgpXG5cdFx0XHQudGhlbihmdW5jdGlvbihmcmllbmQpe1xuXHRcdFx0XHRmcmllbmRSYXRpbmcuYXR0cmlidXRlcy5mcmllbmRVc2VyTmFtZSA9IGZyaWVuZC5hdHRyaWJ1dGVzLnVzZXJuYW1lO1xuXHRcdFx0XHRmcmllbmRSYXRpbmcuYXR0cmlidXRlcy5mcmllbmRGaXJzdE5hbWUgPSBmcmllbmQuYXR0cmlidXRlcy5maXJzdE5hbWU7XG5cdFx0XHRcdHJldHVybiBmcmllbmRSYXRpbmc7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSlcblx0LnRoZW4oZnVuY3Rpb24oZnJpZW5kc1JhdGluZ3Mpe1xuXHRcdHJldHVybiBmcmllbmRzUmF0aW5ncztcblx0fSk7XG59O1xuXG5cbi8vYSBoZWxwZXIgZnVuY3Rpb24gdGhhdCBhdmVyYWdlcyB0aGUgcmF0aW5nXG4vL2lucHV0cyByYXRpbmdzLCBvdXRwdXRzIHRoZSBhdmVyYWdlIHNjb3JlO1xudmFyIGF2ZXJhZ2VSYXRpbmcgPSBmdW5jdGlvbihyYXRpbmdzKSB7XG5cdC8vcmV0dXJuIG51bGwgaWYgbm8gZnJpZW5kIGhhcyByYXRlZCB0aGUgbW92aWVcblx0aWYgKHJhdGluZ3MubGVuZ3RoID09PSAwKSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0cmV0dXJuIHJhdGluZ3Ncblx0LnJlZHVjZShmdW5jdGlvbih0b3RhbCwgcmF0aW5nKXtcblx0XHRyZXR1cm4gdG90YWwgKz0gcmF0aW5nLmF0dHJpYnV0ZXMuc2NvcmU7XG5cdH0sIDApIC8gcmF0aW5ncy5sZW5ndGg7XG59XG5cblxuLy9hIGhlbHBlciBmdW5jdGlvbiB0aGF0IG91dHB1dHMgdXNlciByYXRpbmcgYW5kIGF2ZXJhZ2UgZnJpZW5kIHJhdGluZyBmb3Igb25lIG1vdmllXG4vL291dHB1dHMgb25lIHJhdGluZyBvYmo6IHt0aXRsZTogJ25hbWUnLCBnZW5yZTogJ2dlbnJlJyAsIHBvc3RlcjogJ3VybCcsIHJlbGVhc2VfZGF0ZTogJ2RhdGUnLCBzY29yZTogbiwgZnJpZW5kQXZlcmFnZVJhdGluZzogbn1cbnZhciBnZXRPbmVNb3ZpZVJhdGluZyA9IGZ1bmN0aW9uKHVzZXJuYW1lLCBtb3ZpZU9iaikge1xuICByZXR1cm4gUmF0aW5nLnF1ZXJ5KGZ1bmN0aW9uKHFiKXtcbiAgXHRxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcbiAgXHRxYi5pbm5lckpvaW4oJ21vdmllcycsICdyYXRpbmdzLm1vdmllaWQnLCAnPScsICdtb3ZpZXMuaWQnKTtcbiAgXHRxYi5zZWxlY3QoJ3VzZXJzLnVzZXJuYW1lJywgJ21vdmllcy50aXRsZScsICdtb3ZpZXMuaWQnLCAnbW92aWVzLmdlbnJlJywgJ21vdmllcy5wb3N0ZXInLCAnbW92aWVzLnJlbGVhc2VfZGF0ZScsICdtb3ZpZXMuaW1kYlJhdGluZycsICdtb3ZpZXMuZGVzY3JpcHRpb24nLCAncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycpO1xuICBcdHFiLndoZXJlKHsndXNlcnMudXNlcm5hbWUnOiB1c2VybmFtZSwgJ21vdmllcy50aXRsZSc6IG1vdmllT2JqLnRpdGxlLCAnbW92aWVzLmlkJzogbW92aWVPYmouaWR9KTtcbiAgfSlcbiAgLmZldGNoKClcbiAgLnRoZW4oZnVuY3Rpb24ocmF0aW5nKXtcblx0ICBpZiAoIXJhdGluZykge1xuXHQgIFx0Ly9pZiB0aGUgdXNlciBoYXMgbm90IHJhdGVkIHRoZSBtb3ZpZSwgcmV0dXJuIGFuIG9iaiB0aGF0IGhhcyB0aGUgbW92aWUgaW5mb3JtYXRpb24sIGJ1dCBzY29yZSBpcyBzZXQgdG8gbnVsbFxuXHQgIFx0cmV0dXJuIG5ldyBNb3ZpZSh7dGl0bGU6IG1vdmllT2JqLnRpdGxlLCBpZDogbW92aWVPYmouaWR9KS5mZXRjaCgpXG5cdCAgXHQudGhlbihmdW5jdGlvbihtb3ZpZSkge1xuXHQgIFx0XHRtb3ZpZS5hdHRyaWJ1dGVzLnNjb3JlID0gbnVsbDtcblx0ICBcdFx0cmV0dXJuIG1vdmllO1xuXHQgIFx0fSlcblx0ICB9IGVsc2Uge1xuXHQgIFx0cmV0dXJuIHJhdGluZztcblx0ICB9XG5cdH0pXG5cdC50aGVuKGZ1bmN0aW9uKHJhdGluZyl7XG5cdFx0cmV0dXJuIGV4cG9ydHMuZ2V0RnJpZW5kUmF0aW5ncyh1c2VybmFtZSwgcmF0aW5nKVxuXHRcdC50aGVuKGZ1bmN0aW9uKGZyaWVuZHNSYXRpbmdzKXtcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdmcmllbmRzUmF0aW5ncycsIGZyaWVuZHNSYXRpbmdzKTtcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgPSBhdmVyYWdlUmF0aW5nKGZyaWVuZHNSYXRpbmdzKTtcblx0XHRcdGNvbnNvbGUubG9nKCdhZGRlZCBhdmVyYWdlIGZyaWVuZCByYXRpbmcnLCByYXRpbmcuYXR0cmlidXRlcy50aXRsZSwgcmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyk7XG5cdFx0XHRyZXR1cm4gcmF0aW5nO1xuXHRcdH0pO1xuXHR9KTtcbn1cblxuXG4vL3RoaXMgaGFuZGxlciBpcyBzcGVjaWZpY2FsbHkgZm9yIHNlbmRpbmcgb3V0IGEgbGlzdCBvZiBtb3ZpZSByYXRpbmdzIHdoZW4gdGhlIGNsaWVudCBzZW5kcyBhIGxpc3Qgb2YgbW92aWUgdG8gdGhlIHNlcnZlclxuLy9leHBlY3RzIHJlcS5ib2R5IHRvIGJlIGFuIGFycmF5IG9mIG9iaiB3aXRoIHRoZXNlIGF0dHJpYnV0ZXM6IHtpZCwgdGl0bGUsIGdlbnJlLCBwb3N0ZXJfcGF0aCwgcmVsZWFzZV9kYXRlLCBvdmVydmlldywgdm90ZV9hdmVyYWdlfVxuLy9vdXRwdXRzIFsge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnICwgcG9zdGVyOiAndXJsJywgcmVsZWFzZV9kYXRlOiAnZGF0ZScsIHNjb3JlOiBuLCBmcmllbmRBdmVyYWdlUmF0aW5nOiBufSAuLi4gXVxuZXhwb3J0cy5nZXRNdWx0aXBsZU1vdmllUmF0aW5ncyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cdGNvbnNvbGUubG9nKCdnZXRNdWx0aXBsZU1vdmllUmF0aW5ncycpO1xuXHRQcm9taXNlLm1hcChyZXEuYm9keS5tb3ZpZXMsIGZ1bmN0aW9uKG1vdmllKSB7XG5cdFx0Ly9maXJzdCBjaGVjayB3aGV0aGVyIG1vdmllIGlzIGluIHRoZSBkYXRhYmFzZVxuXHRcdHJldHVybiBuZXcgTW92aWUoe3RpdGxlOiBtb3ZpZS50aXRsZSwgaWQ6IG1vdmllLmlkfSkuZmV0Y2goKVxuXHRcdC50aGVuKGZ1bmN0aW9uKGZvdW5kTW92aWUpIHtcblx0XHRcdC8vaWYgbm90IGNyZWF0ZSBvbmVcblx0XHRcdGlmICghZm91bmRNb3ZpZSkge1xuXHRcdFx0XHRyZXR1cm4gYWRkT25lTW92aWUobW92aWUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGZvdW5kTW92aWU7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQudGhlbihmdW5jdGlvbihmb3VuZE1vdmllKXtcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdmb3VuZCBtb3ZpZScsIGZvdW5kTW92aWUpO1xuXHRcdFx0cmV0dXJuIGdldE9uZU1vdmllUmF0aW5nKHJlcS5teVNlc3Npb24udXNlciwgZm91bmRNb3ZpZS5hdHRyaWJ1dGVzKTtcblx0XHR9KVxuXHR9KVxuXHQudGhlbihmdW5jdGlvbihyYXRpbmdzKXtcblx0XHRjb25zb2xlLmxvZygnc2VuZGluZyByYXRpbmcgdG8gY2xpZW50Jyk7XG5cdFx0cmVzLmpzb24ocmF0aW5ncyk7XG5cdH0pXG59XG5cbi8vdGhpcyBoYW5kbGVyIHNlbmRzIGFuIGdldCByZXF1ZXN0IHRvIFRNREIgQVBJIHRvIHJldHJpdmUgcmVjZW50IHRpdGxlc1xuLy93ZSBjYW5ub3QgZG8gaXQgaW4gdGhlIGZyb250IGVuZCBiZWNhdXNlIGNyb3NzIG9yaWdpbiByZXF1ZXN0IGlzc3Vlc1xuZXhwb3J0cy5nZXRSZWNlbnRSZWxlYXNlID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgdmFyIHBhcmFtcyA9IHtcbiAgICBhcGlfa2V5OiAnOWQzYjAzNWVmMWNkNjY5YWVkMzk4NDAwYjE3ZmNlYTInLFxuICAgIHByaW1hcnlfcmVsZWFzZV95ZWFyOiBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCksXG4gICAgaW5jbHVkZV9hZHVsdDogZmFsc2UsXG4gICAgc29ydF9ieTogJ3BvcHVsYXJpdHkuZGVzYydcbiAgfTtcblxuXHQgXG4gIHZhciBkYXRhID0gJyc7XG5cdHJlcXVlc3Qoe1xuXHRcdG1ldGhvZDogJ0dFVCcsXG5cdFx0dXJsOiAnaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy9kaXNjb3Zlci9tb3ZpZS8nLFxuXHRcdHFzOiBwYXJhbXNcblx0fSlcblx0Lm9uKCdkYXRhJyxmdW5jdGlvbihjaHVuayl7XG5cdFx0ZGF0YSArPSBjaHVuaztcblx0fSlcblx0Lm9uKCdlbmQnLCBmdW5jdGlvbigpe1xuXHRcdHJlY2VudE1vdmllcyA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgcmVxLmJvZHkubW92aWVzID0gcmVjZW50TW92aWVzLnJlc3VsdHM7XG4gICAgLy90cmFuc2ZlcnMgdGhlIG1vdmllIGRhdGEgdG8gZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MgdG8gZGVjb3JhdGUgd2l0aCBzY29yZSAodXNlciByYXRpbmcpIGFuZCBhdmdmcmllbmRSYXRpbmcgYXR0cmlidXRlXG4gICAgZXhwb3J0cy5nZXRNdWx0aXBsZU1vdmllUmF0aW5ncyhyZXEsIHJlcyk7XG5cblx0fSlcblx0Lm9uKCdlcnJvcicsIGZ1bmN0aW9uKGVycm9yKXtcblx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdH0pXG5cbn1cblxuLy90aGlzIGlzIFRNREIncyBnZW5yZSBjb2RlLCB3ZSBtaWdodCB3YW50IHRvIHBsYWNlIHRoaXMgc29tZXdoZXJlIGVsc2VcbnZhciBnZW5yZXMgPSB7XG4gICAxMjogXCJBZHZlbnR1cmVcIixcbiAgIDE0OiBcIkZhbnRhc3lcIixcbiAgIDE2OiBcIkFuaW1hdGlvblwiLFxuICAgMTg6IFwiRHJhbWFcIixcbiAgIDI3OiBcIkhvcnJvclwiLFxuICAgMjg6IFwiQWN0aW9uXCIsXG4gICAzNTogXCJDb21lZHlcIixcbiAgIDM2OiBcIkhpc3RvcnlcIixcbiAgIDM3OiBcIldlc3Rlcm5cIixcbiAgIDUzOiBcIlRocmlsbGVyXCIsXG4gICA4MDogXCJDcmltZVwiLFxuICAgOTk6IFwiRG9jdW1lbnRhcnlcIixcbiAgIDg3ODogXCJTY2llbmNlIEZpY3Rpb25cIixcbiAgIDk2NDg6IFwiTXlzdGVyeVwiLFxuICAgMTA0MDI6IFwiTXVzaWNcIixcbiAgIDEwNzQ5OiBcIlJvbWFuY2VcIixcbiAgIDEwNzUxOiBcIkZhbWlseVwiLFxuICAgMTA3NTI6IFwiV2FyXCIsXG4gICAxMDc2OTogXCJGb3JlaWduXCIsXG4gICAxMDc3MDogXCJUViBNb3ZpZVwiXG4gfTtcblxuLy90aGlzIGZ1bmN0aW9uIHdpbGwgc2VuZCBiYWNrIHNlYXJjYiBtb3ZpZXMgdXNlciBoYXMgcmF0ZWQgaW4gdGhlIGRhdGFiYXNlXG4vL2l0IHdpbGwgc2VuZCBiYWNrIG1vdmllIG9ianMgdGhhdCBtYXRjaCB0aGUgc2VhcmNoIGlucHV0LCBleHBlY3RzIG1vdmllIG5hbWUgaW4gcmVxLmJvZHkudGl0bGVcbmV4cG9ydHMuc2VhcmNoUmF0ZWRNb3ZpZSA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIHJldHVybiBSYXRpbmcucXVlcnkoZnVuY3Rpb24ocWIpe1xuXHRcdHFiLmlubmVySm9pbigndXNlcnMnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICd1c2Vycy5pZCcpO1xuXHRcdHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xuXHRcdHFiLnNlbGVjdCgndXNlcnMudXNlcm5hbWUnLCAnbW92aWVzLnRpdGxlJywgJ21vdmllcy5pZCcsICdtb3ZpZXMuZ2VucmUnLCAnbW92aWVzLnBvc3RlcicsICdtb3ZpZXMucmVsZWFzZV9kYXRlJywgJ21vdmllcy5pbWRiUmF0aW5nJywgJ21vdmllcy5kZXNjcmlwdGlvbicsICdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3Jyk7XG4gIFx0cWIud2hlcmVSYXcoYE1BVENIIChtb3ZpZXMudGl0bGUpIEFHQUlOU1QgKCcke3JlcS5xdWVyeS50aXRsZX0nIElOIE5BVFVSQUwgTEFOR1VBR0UgTU9ERSlgKVxuICBcdHFiLmFuZFdoZXJlKCd1c2Vycy51c2VybmFtZScsICc9JywgcmVxLm15U2Vzc2lvbi51c2VyKVxuICBcdHFiLm9yZGVyQnkoJ3VwZGF0ZWRfYXQnLCAnREVTQycpXG4gIH0pXG4gIC5mZXRjaEFsbCgpXG4gIC50aGVuKGZ1bmN0aW9uKG1hdGNoZXMpe1xuICBcdGNvbnNvbGUubG9nKG1hdGNoZXMubW9kZWxzKTtcbiAgXHRyZXMuanNvbihtYXRjaGVzKTtcbiAgfSlcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vL2ZyaWVuZHNoaXAgaGFuZGxlcnNcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5leHBvcnRzLmdldEZyaWVuZExpc3QgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXHRyZXR1cm4gUmVsYXRpb24ucXVlcnkoZnVuY3Rpb24ocWIpe1xuXHRcdHFiLmlubmVySm9pbigndXNlcnMnLCAncmVsYXRpb25zLnVzZXIxaWQnLCAnPScsICd1c2Vycy5pZCcpO1xuXHRcdHFiLnNlbGVjdCgncmVsYXRpb25zLnVzZXIyaWQnKTtcblx0XHRxYi53aGVyZSh7XG5cdFx0XHQndXNlcnMudXNlcm5hbWUnOiByZXEubXlTZXNzaW9uLnVzZXJcblx0XHR9KVxuXHR9KVxuXHQuZmV0Y2hBbGwoKVxuXHQudGhlbihmdW5jdGlvbihmcmllbmRzKXtcblx0XHRyZXR1cm4gUHJvbWlzZS5tYXAoZnJpZW5kcy5tb2RlbHMsIGZ1bmN0aW9uKGZyaWVuZCkge1xuXHRcdFx0cmV0dXJuIG5ldyBVc2VyKHtpZDogZnJpZW5kLmF0dHJpYnV0ZXMudXNlcjJpZH0pLmZldGNoKClcblx0XHRcdC50aGVuKGZ1bmN0aW9uKGZyaWVuZFVzZXIpe1xuXHRcdFx0XHRyZXR1cm4gZnJpZW5kVXNlci5hdHRyaWJ1dGVzLnVzZXJuYW1lO1xuXHRcdFx0fSlcblx0XHR9KVxuXHR9KVxuXHQudGhlbihmdW5jdGlvbihmcmllbmRzKXtcblx0XHRjb25zb2xlLmxvZygnc2VuZGluZyBhIGxpc3Qgb2YgZnJpZW5kIG5hbWVzJywgZnJpZW5kcyk7XG5cdFx0cmVzLmpzb24oZnJpZW5kcyk7XG5cdH0pXG59XG5cbi8vdGhpcyB3b3VsZCBzZW5kIGEgbm90aWNlIHRvIHRoZSB1c2VyIHdobyByZWNlaXZlIHRoZSBmcmllbmQgcmVxdWVzdCwgcHJvbXB0aW5nIHRoZW0gdG8gYWNjZXB0IG9yIGRlbnkgdGhlIHJlcXVlc3RcbmV4cG9ydHMuYWRkRnJpZW5kID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcblxufTtcblxuXG4vL3RoaXMgd291bGQgY29uZmlybSB0aGUgZnJpZW5kc2hpcCBhbmQgZXN0YWJsaXNoIHRoZSByZWxhdGlvbnNoaXAgaW4gdGhlIGRhdGFiYXNlXG5leHBvcnRzLmNvbmZpcm1GcmllbmRzaGlwID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcblxufTtcblxuXG5cbmV4cG9ydHMuZ2V0RnJpZW5kcyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIHZhciBwZW9wbGVJZCA9IFtdO1xuICB2YXIgaWQgPSByZXEubXlTZXNzaW9uLnVzZXJcbiAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCBpZCwgZnVuY3Rpb24oZXJyLCByZXNwKSB7XG4gICAgdmFyIHVzZXJpZCA9IHJlc3BbMF0uaWQ7XG4gICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGJlIGxpbmcvMicsaWQpXG4gIFxuICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByYXRpbmdzIFdIRVJFIHVzZXJpZCA9ID8nLCB1c2VyaWQsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xuICAgICAgdmFyIHVzZXJzUmF0aW5ncz1yZXNwLm1hcChmdW5jdGlvbihhKXsgcmV0dXJuIFthLm1vdmllaWQsIGEuc2NvcmVdfSk7XG5cbiAgICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByZWxhdGlvbnMgV0hFUkUgdXNlcjFpZCA9ID8nLCB1c2VyaWQsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3AubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAocGVvcGxlSWQuaW5kZXhPZihyZXNwW2ldLnVzZXIyaWQpID09PSAtMSkge1xuICAgICAgICAgICAgcGVvcGxlSWQucHVzaChyZXNwW2ldLnVzZXIyaWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgcGVvcGxlID0gW11cbiAgICAgICAgY29uc29sZS5sb2coJ1RoaXMgc2hvdWxkIGFsc28gYmUgcGVvcGxlZWUnLHBlb3BsZUlkKTtcbiAgICAgICAgdmFyIGtleUlkPXt9O1xuICAgICAgICBwZW9wbGVJZC5mb3JFYWNoKGZ1bmN0aW9uKGEpIHtcblxuICAgICAgICAgIGNvbi5xdWVyeSgnU0VMRUNUIHVzZXJuYW1lIEZST00gdXNlcnMgV0hFUkUgaWQgPSA/JywgYSwgZnVuY3Rpb24oZXJyLCByZXNwbykge1xuICBcdCAgICAgICAga2V5SWRbYV09cmVzcG9bMF0udXNlcm5hbWU7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygndGhpcyBpcyBPTkUgb2YgdGhlIHBlb3BsZSEhJyxyZXNwb1swXS51c2VybmFtZSlcbiAgICAgICAgICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByYXRpbmdzIFdIRVJFIHVzZXJpZCA9JysnXCInK2ErJ1wiJywgZnVuY3Rpb24oZXJyLCByZSkge1xuICAgICAgXHQgICAgICBjb25zb2xlLmxvZygndGhpcyBpcyBhJyxhKVxuICAgICAgXHQgICAgICBpZiAocmUubGVuZ3RoPT09MCl7XG4gICAgICBcdFx0ICAgICAgcmU9W3t1c2VyaWQ6YSxtb3ZpZWlkOk1hdGgucm91bmQoTWF0aC5yYW5kb20oKSoxMDAwMCksc2NvcmU6OTl9XVxuICAgICAgXHQgICAgICB9XG4gICAgICBcdCAgICAgIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBiZSB0aGUgcmF0aW5ncyBmcm9tIGVhY2ggcGVyc29uISEnLHJlKTtcblxuICAgICAgICAgICAgICBwZW9wbGUucHVzaChyZS5tYXAoZnVuY3Rpb24oYSl7cmV0dXJuIFthLnVzZXJpZCxhLm1vdmllaWQsYS5zY29yZV07fSkpO1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgaWYgKHBlb3BsZS5sZW5ndGg9PT1wZW9wbGVJZC5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIHZhciBmaW5hbCA9IHt9O1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGJlIHBlb3BsZScsIHBlb3BsZSk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwZW9wbGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgIGlmIChwZW9wbGVbaV1bMF0hPT11bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgICAgICBmaW5hbFtrZXlJZFtwZW9wbGVbaV1bMF1bMF1dXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBlb3BsZVtpXS5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICAgIGZpbmFsW2tleUlkW3Blb3BsZVtpXVswXVswXV1dLnB1c2goW10pO1xuICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHogPSAxOyB6IDwgcGVvcGxlW2ldW3hdLmxlbmd0aDsgeisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5hbFtrZXlJZFtwZW9wbGVbaV1bMF1bMF1dXVt4XS5wdXNoKHBlb3BsZVtpXVt4XVt6XSlcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZmluYWwnLGZpbmFsLHVzZXJzUmF0aW5ncyk7XG5cbiAgICAgICAgICAgICAgICB2YXIgY29tcGFyaXNvbnM9e307XG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGZpbmFsKXtcbiAgICAgICAgICAgICAgICAgIGNvbXBhcmlzb25zW2tleV09Y29tcCh1c2Vyc1JhdGluZ3MsZmluYWxba2V5XSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY29tcGFyaXNvbnMpO1xuICAgICAgICAgICAgICAgIHZlcnlGaW5hbD1bXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gY29tcGFyaXNvbnMpe1xuICAgICAgICAgICAgICAgICAgdmVyeUZpbmFsLnB1c2goW2tleSxjb21wYXJpc29uc1trZXldXSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codmVyeUZpbmFsKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZCh2ZXJ5RmluYWwpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICB9KVxuICB9KVxufTtcblxuXG5cbi8vVEJEXG5leHBvcnRzLmdldEhpZ2hDb21wYXRpYmlsaXR5VXNlcnMgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICBcbn07XG5cblxuLy9UQkRcbmV4cG9ydHMuZ2V0UmVjb21tZW5kZWRNb3ZpZXMgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXG59OyJdfQ==
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
  password: "123",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9yZXF1ZXN0LWhhbmRsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQSxJQUFJLFNBQVEsU0FBUixNQUFRLENBQVMsSUFBVCxFQUFjLElBQWQsRUFBbUI7QUFDL0IsTUFBSSxPQUFLLEtBQUssR0FBTCxDQUFTLE9BQUssSUFBZCxDQUFUO0FBQ0EsU0FBTyxJQUFFLElBQVQ7QUFDQyxDQUhEOztBQUtBLElBQUksT0FBTyxTQUFQLElBQU8sQ0FBUyxLQUFULEVBQWdCLE1BQWhCLEVBQXdCO0FBQ25DLE1BQUksUUFBTyxFQUFYO0FBQ0UsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFHLE1BQU0sTUFBekIsRUFBaUMsR0FBakMsRUFBc0M7O0FBRXBDLFNBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxPQUFPLE1BQTNCLEVBQW1DLEdBQW5DLEVBQXdDOztBQUV0QyxVQUFJLE1BQU0sQ0FBTixFQUFTLENBQVQsTUFBZ0IsT0FBTyxDQUFQLEVBQVUsQ0FBVixDQUFwQixFQUFrQzs7QUFFcEMsY0FBTSxJQUFOLENBQVcsT0FBTyxNQUFNLENBQU4sRUFBUyxDQUFULENBQVAsRUFBbUIsT0FBTyxDQUFQLEVBQVUsQ0FBVixDQUFuQixDQUFYO0FBRUc7QUFDRjtBQUNGO0FBQ0gsTUFBSSxNQUFLLE1BQU0sTUFBTixDQUFhLFVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYTtBQUFDLFdBQU8sSUFBRSxDQUFUO0FBQVcsR0FBdEMsRUFBdUMsQ0FBdkMsQ0FBVDtBQUNBLFNBQU8sS0FBSyxLQUFMLENBQVcsS0FBRyxHQUFILEdBQU8sTUFBTSxNQUF4QixDQUFQO0FBQ0MsQ0FmRDs7Ozs7QUF3QkEsSUFBSSxLQUFLLFFBQVEscUJBQVIsQ0FBVDtBQUNBLElBQUksUUFBUSxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUksVUFBVSxRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQUksUUFBUSxRQUFRLHFCQUFSLENBQVo7QUFDQSxJQUFJLFNB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RCx3QkFBUSxHQUFSLENBQVksU0FBWjtBQUNBLG9CQUFJLElBQUosQ0FBUyxTQUFUO0FBQ0Q7QUFDRixhQXZDRDtBQXdDRCxXQTNDRDtBQTRDRCxTQTlDRDtBQStDRCxPQXhERDtBQXlERCxLQTVERDtBQTZERCxHQWpFRDtBQWtFRCxDQXJFRDs7O0FBMEVBLFFBQVEseUJBQVIsR0FBb0MsVUFBUyxHQUFULEVBQWMsR0FBZCxFQUFtQixDQUV0RCxDQUZEOzs7QUFNQSxRQUFRLG9CQUFSLEdBQStCLFVBQVMsR0FBVCxFQUFjLEdBQWQsRUFBbUIsQ0FFakQsQ0FGRCIsImZpbGUiOiJyZXF1ZXN0LWhhbmRsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vL1RoZSBhbGdvcml0aG1cbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xudmFyIGhlbHBlcj0gZnVuY3Rpb24obnVtMSxudW0yKXtcbnZhciBkaWZmPU1hdGguYWJzKG51bTEtbnVtMik7XG5yZXR1cm4gNS1kaWZmO1xufVxuXG52YXIgY29tcCA9IGZ1bmN0aW9uKGZpcnN0LCBzZWNvbmQpIHtcbnZhciBmaW5hbD0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGk8IGZpcnN0Lmxlbmd0aDsgaSsrKSB7XG5cbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHNlY29uZC5sZW5ndGg7IHgrKykge1xuXG4gICAgICBpZiAoZmlyc3RbaV1bMF0gPT09IHNlY29uZFt4XVswXSkge1xuXG4gICAgZmluYWwucHVzaChoZWxwZXIoZmlyc3RbaV1bMV0sc2Vjb25kW3hdWzFdKSlcblxuICAgICAgfVxuICAgIH1cbiAgfVxudmFyIHN1bT0gZmluYWwucmVkdWNlKGZ1bmN0aW9uKGEsYil7cmV0dXJuIGErYn0sMCk7XG5yZXR1cm4gTWF0aC5yb3VuZCgyMCpzdW0vZmluYWwubGVuZ3RoKVxufVxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuXG5cblxudmFyIGRiID0gcmVxdWlyZSgnLi4vYXBwL2RiQ29ubmVjdGlvbicpO1xudmFyIG15c3FsID0gcmVxdWlyZSgnbXlzcWwnKTtcbnZhciBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xudmFyIE1vdmllID0gcmVxdWlyZSgnLi4vYXBwL21vZGVscy9tb3ZpZScpO1xudmFyIFJhdGluZyA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvcmF0aW5nJyk7XG52YXIgUmVsYXRpb24gPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL3JlbGF0aW9uJyk7XG52YXIgVXNlciA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvdXNlcicpO1xudmFyIGFsbFJlcXVlc3QgPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL2FsbFJlcXVlc3QnKTtcblxudmFyIE1vdmllcyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy9tb3ZpZXMnKTtcbnZhciBSYXRpbmdzID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL3JhdGluZ3MnKTtcbnZhciBSZWxhdGlvbnMgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvcmVsYXRpb25zJyk7XG52YXIgVXNlcnMgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvdXNlcnMnKTtcbnZhciBhbGxSZXF1ZXN0cyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy9hbGxSZXF1ZXN0cycpO1xuXG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoXCJibHVlYmlyZFwiKTtcbnZhciByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdCcpO1xuXG52YXIgY29uID0gbXlzcWwuY3JlYXRlQ29ubmVjdGlvbih7XG4gIGhvc3Q6IFwibG9jYWxob3N0XCIsXG4gIHVzZXI6IFwicm9vdFwiLFxuICBwYXNzd29yZDogXCIxMjNcIixcbiAgZGF0YWJhc2U6IFwiTWFpbkRhdGFiYXNlXCJcbn0pO1xuXG4vLyB2YXIgY29uID0gbXlzcWwuY3JlYXRlQ29ubmVjdGlvbih7XG4vLyAgIGhvc3QgICAgIDogJ3VzLWNkYnItaXJvbi1lYXN0LTA0LmNsZWFyZGIubmV0Jyxcbi8vICAgdXNlciAgICAgOiAnYjAzOTE2ZTc1MGU4MWQnLFxuLy8gICBwYXNzd29yZCA6ICdiZWY0Zjc3NScsXG4vLyAgIGRhdGFiYXNlIDogJ2hlcm9rdV85MTliY2M4MDA1YmZkNGMnXG4vLyB9KTtcblxuY29uLmNvbm5lY3QoZnVuY3Rpb24oZXJyKXtcbiAgaWYoZXJyKXtcbiAgICBjb25zb2xlLmxvZygnRXJyb3IgY29ubmVjdGluZyB0byBEYicpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zb2xlLmxvZygnQ29ubmVjdGlvbiBlc3RhYmxpc2hlZCcpO1xufSk7XG5cbi8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vdXNlciBhdXRoXG4vLy8vLy8vLy8vLy8vLy8vL1xuXG5leHBvcnRzLnNpZ251cFVzZXIgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXHRjb25zb2xlLmxvZygnY2FsbGluZyBsb2dpbicsIHJlcS5ib2R5KTtcblx0Ly8gY29uc29sZS5sb2coJ3RoaXMgaXMgdGhlIHNlc3Npb24nLHJlcS5zZXNzaW9uKVxuICBuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEuYm9keS5uYW1lIH0pLmZldGNoKCkudGhlbihmdW5jdGlvbihmb3VuZCkge1xuXHQgIGlmIChmb3VuZCkge1xuXHQgIFx0Ly9jaGVjayBwYXNzd29yZFxuXHQgIFx0ICAgLy9pZiAocGFzc3dvcmQgbWF0Y2hlcylcblx0ICBcdCAgIC8veyBhZGQgc2Vzc2lvbnMgYW5kIHJlZGlyZWN0fVxuXHQgIFx0Y29uc29sZS5sb2coJ3VzZXJuYW1lIGFscmVhZHkgZXhpc3QsIGNhbm5vdCBzaWdudXAgJywgcmVxLmJvZHkubmFtZSk7XG5cdCAgICByZXMuc3RhdHVzKDQwMykuc2VuZCgndXNlcm5hbWUgZXhpc3QnKTtcblx0ICB9IGVsc2Uge1xuXHQgIFx0Y29uc29sZS5sb2coJ2NyZWF0aW5nIHVzZXInKTtcbiAgICAgIHJlcS5teVNlc3Npb24udXNlciA9IHJlcS5ib2R5Lm5hbWU7XG5cdCAgICBVc2Vycy5jcmVhdGUoe1xuXHQgICAgICB1c2VybmFtZTogcmVxLmJvZHkubmFtZSxcblx0ICAgICAgcGFzc3dvcmQ6IHJlcS5ib2R5LnBhc3N3b3JkLFxuXHQgICAgfSlcblx0ICAgIC50aGVuKGZ1bmN0aW9uKHVzZXIpIHtcblx0XHQgIFx0Y29uc29sZS5sb2coJ2NyZWF0ZWQgYSBuZXcgdXNlcicpO1xuXHQgICAgICByZXMuc3RhdHVzKDIwMSkuc2VuZCgnbG9naW4gY3JlYXRlZCcpO1xuXHQgICAgfSk7XG5cdCAgfVxuXHR9KTtcbn07XG5cblxuZXhwb3J0cy5zZW5kV2F0Y2hSZXF1ZXN0ID0gZnVuY3Rpb24ocmVxLCByZXNwb25zZSkge1xuXHRjb25zb2xlLmxvZyhyZXEuYm9keS5yZXF1ZXN0ZWUpXG5cdGlmIChBcnJheS5pc0FycmF5KHJlcS5ib2R5LnJlcXVlc3RlZSkpIHtcblx0XHR2YXIgcmVxdWVzdGVlcyA9IHJlcS5ib2R5LnJlcXVlc3RlZTtcblx0fSBlbHNlIHtcblx0XHR2YXIgcmVxdWVzdGVlcyA9IFtyZXEuYm9keS5yZXF1ZXN0ZWVdO1xuXHR9XG5cdFByb21pc2UuZWFjaChyZXF1ZXN0ZWVzLCBmdW5jdGlvbihyZXF1ZXN0ZWUpe1xuXHRcdHZhciByZXF1ZXN0ID0ge1xuICAgICAgbWVzc2FnZTogcmVxLmJvZHkubWVzc2FnZSxcblx0XHRcdHJlcXVlc3RvcjogcmVxLm15U2Vzc2lvbi51c2VyLCBcblx0XHRcdHJlcXVlc3RUeXA6J3dhdGNoJyxcblx0XHRcdG1vdmllOnJlcS5ib2R5Lm1vdmllLFxuXHRcdFx0cmVxdWVzdGVlOiByZXF1ZXN0ZWVcblx0XHR9O1xuXHRcdGNvbi5xdWVyeSgnSU5TRVJUIElOVE8gYWxscmVxdWVzdHMgU0VUID8nLCByZXF1ZXN0LCBmdW5jdGlvbihlcnIscmVzKXtcblx0XHQgIGlmKGVycikgdGhyb3cgZXJyO1xuXHRcdCAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XG5cdFx0fSk7XG5cdH0pXG5cdC50aGVuKGZ1bmN0aW9uKGRvbmUpe1xuXHRcdHJlc3BvbnNlLnNlbmQoJ1RoYXRzIG15IHN0eWxlIScpO1xuXHR9KVxufVxuXG5leHBvcnRzLnJlbW92ZVdhdGNoUmVxdWVzdCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHJlcS5ib2R5LnJlcXVlc3RlZSkpIHtcbiAgICB2YXIgcmVxdWVzdGVlcyA9IHJlcS5ib2R5LnJlcXVlc3RlZTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgcmVxdWVzdGVlcyA9IFtyZXEuYm9keS5yZXF1ZXN0ZWVdO1xuICB9XG4gIHZhciByZXF1ZXN0b3I9cmVxLmJvZHkucmVxdWVzdG9yO1xuICB2YXIgbW92aWUgPSByZXEuYm9keS5tb3ZpZTtcblxuICBhbGxSZXF1ZXN0LmZvcmdlKHtyZXF1ZXN0b3I6IHJlcXVlc3RvciwgcmVxdWVzdGVlOiByZXF1ZXN0ZWVzLCBtb3ZpZTogbW92aWUgfSlcbiAgICAuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGFsbFJlcXVlc3QpIHtcbiAgICAgIGFsbFJlcXVlc3QuZGVzdHJveSgpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJlcy5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6ICdVc2VyIHN1Y2Nlc3NmdWxseSBkZWxldGVkJ319KTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xuICAgICAgICB9KTtcbiAgICB9KVxuICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xuICAgIH0pO1xufTtcblxuXG5leHBvcnRzLnNlbmRSZXF1ZXN0ID0gZnVuY3Rpb24ocmVxLCByZXNwb25zZSkge1xuICBjb25zb2xlLmxvZygndGhpcyBpcyB3aGF0IEltIGdldHRpbmcnLCByZXEuYm9keSk7XG4gIGlmIChyZXEubXlTZXNzaW9uLnVzZXI9PT1yZXEuYm9keS5uYW1lKXtcbiAgICByZXNwb25zZS5zZW5kKFwiWW91IGNhbid0IGZyaWVuZCB5b3Vyc2VsZiFcIilcbiAgfSBlbHNlIHtcblxudmFyIHJlcXVlc3QgPSB7cmVxdWVzdG9yOiByZXEubXlTZXNzaW9uLnVzZXIsIHJlcXVlc3RlZTogcmVxLmJvZHkubmFtZSwgcmVxdWVzdFR5cDonZnJpZW5kJ307XG5cbmNvbi5xdWVyeSgnU0VMRUNUIHJlcXVlc3RlZSxyZXNwb25zZSBGUk9NIGFsbHJlcXVlc3RzIFdIRVJFICByZXF1ZXN0b3IgPSA/IEFORCByZXF1ZXN0VHlwID0nKydcIicrICdmcmllbmQnKydcIicsIHJlcXVlc3RbJ3JlcXVlc3RvciddLCBmdW5jdGlvbihlcnIscmVzKXtcbmlmIChyZXMgPT09IHVuZGVmaW5lZCkge1xuICByZXNwb25zZS5zZW5kKCdubyBmcmllbmRzJylcbn1cbnZhciB0ZXN0PXJlcy5maWx0ZXIoZnVuY3Rpb24oYSl7cmV0dXJuIGEucmVzcG9uc2U9PT1udWxsfSlcbnZhciB0ZXN0Mj10ZXN0Lm1hcChmdW5jdGlvbihhKXsgcmV0dXJuIGEucmVxdWVzdGVlfSlcbmNvbnNvbGUubG9nKCduYW1lcyBvZiBwZW9wbGUgd2hvbSBJdmUgcmVxdWVzdGVkIGFzIGZyaWVuZHMnLHRlc3QpO1xuXG5cblxuY29uLnF1ZXJ5KCdJTlNFUlQgSU5UTyBhbGxyZXF1ZXN0cyBTRVQgPycsIHJlcXVlc3QsIGZ1bmN0aW9uKGVycixyZXNwKXtcbiAgaWYoZXJyKSB0aHJvdyBlcnI7XG4gIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXNwLmluc2VydElkKTtcbiAgcmVzcG9uc2Uuc2VuZCh0ZXN0Mik7XG59KVxufSk7XG5cbiB9XG59O1xuXG5cblxuXG5cblxuXG5cblxuZXhwb3J0cy5saXN0UmVxdWVzdHMgPSBmdW5jdGlvbihyZXEsIHJlc3BvbnNlKSB7XG4gIHZhciByZXF1ZXN0ID0gcmVxLm15U2Vzc2lvbi51c2VyXG5cbiAgY29uLnF1ZXJ5KCdTZWxlY3QgKiBGUk9NIGFsbHJlcXVlc3RzIFdIRVJFIHJlcXVlc3RlZT0nKydcIicrcmVxdWVzdCsnXCInKycnKydPUiByZXF1ZXN0b3IgPScrJ1wiJytyZXF1ZXN0KydcIicrJycsIGZ1bmN0aW9uKGVycixyZXMpe1xuICBpZihlcnIpIHRocm93IGVycjtcbiAgY29uc29sZS5sb2cocmVzKVxuICByZXNwb25zZS5zZW5kKFtyZXMscmVxdWVzdF0pO1xufSk7XG5cblxufTtcblxuZXhwb3J0cy5hY2NlcHQgPSBmdW5jdGlvbihyZXEsIHJlc3BvbnNlKSB7XG4gIHZhciByZXF1ZXN0b3I9cmVxLmJvZHkucGVyc29uVG9BY2NlcHQ7XG4gIHZhciByZXF1ZXN0ZWU9cmVxLm15U2Vzc2lvbi51c2VyO1xuICB2YXIgbW92aWUgPSByZXEuYm9keS5tb3ZpZTtcblxuICBjb25zb2xlLmxvZygndGhpcyBpcyByZXEgYm9keSAnLHJlcS5ib2R5KTtcblxuICBjb24ucXVlcnkoJ1VQREFURSBhbGxyZXF1ZXN0cyBTRVQgcmVzcG9uc2U9JysnXCInICsgJ3llcycgKyAnXCInKycgIFdIRVJFIHJlcXVlc3RvciA9ICcrJ1wiJysgcmVxdWVzdG9yKydcIicrJyBBTkQgbW92aWU9JysnXCInKyBtb3ZpZSsnXCInLCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xuICAgIH0pO1xuXG4gIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgcmVxLmJvZHkucGVyc29uVG9BY2NlcHQsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XG4gICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXNbMF0uaWQsIGVycik7XG4gICAgdmFyIHBlcnNvbjEgPSByZXNbMF0uaWQ7XG4gICAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCByZXEubXlTZXNzaW9uLnVzZXIsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xuICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlc3BbMF0uaWQsIGVycik7XG5cbiAgICAgIHZhciBwZXJzb24yID0gcmVzcFswXS5pZDtcbiAgICAgIHZhciByZXF1ZXN0ID0ge1xuICAgICAgICB1c2VyMWlkOiBwZXJzb24xLFxuICAgICAgICB1c2VyMmlkOiBwZXJzb24yXG4gICAgICB9XG4gICAgICB2YXIgcmVxdWVzdDIgPSB7XG4gICAgICAgIHVzZXIxaWQ6IHBlcnNvbjIsXG4gICAgICAgIHVzZXIyaWQ6IHBlcnNvbjFcbiAgICAgIH1cblxuICAgICAgY29uc29sZS5sb2coJ3RoZSByZXF1ZXN0czo6OicscmVxdWVzdCxyZXF1ZXN0MilcbiAgICAgIGNvbi5xdWVyeSgnSU5TRVJUIElOVE8gcmVsYXRpb25zIFNFVCA/JywgcmVxdWVzdCwgZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcblxuICAgICAgY29uLnF1ZXJ5KCdJTlNFUlQgSU5UTyByZWxhdGlvbnMgU0VUID8nLCByZXF1ZXN0MiwgZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xuXG4gICAgICAgICAgIHJlc3BvbnNlLnNlbmQoJ1RoYXRzIG15IHN0eWxlISEhJyk7XG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgICB9KVxuICB9KVxuICAvLyBhbGxSZXF1ZXN0LmZvcmdlKHtyZXF1ZXN0b3I6IHJlcXVlc3RvciwgcmVxdWVzdGVlOiByZXF1ZXN0ZWV9KVxuICAvLyAgIC5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oYWxsUmVxdWVzdCkge1xuICAvLyAgICAgYWxsUmVxdWVzdC5kZXN0cm95KClcbiAgLy8gICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gIC8vICAgICAgICAgcmVzcG9uc2UuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiAnVXNlciBzdWNjZXNzZnVsbHkgZGVsZXRlZCd9fSk7XG4gIC8vICAgICAgIH0pXG4gIC8vICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgLy8gICAgICAgICByZXNwb25zZS5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xuICAvLyAgICAgICB9KTtcbiAgLy8gICB9KVxuICAvLyAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgLy8gICAgIHJlc3BvbnNlLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XG4gIC8vICAgfSk7XG59O1xuXG5leHBvcnRzLnJlbW92ZVJlcXVlc3QgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICB2YXIgcmVxdWVzdG9yPXJlcS5ib2R5LnJlcXVlc3RvcjtcbiAgdmFyIHJlcXVlc3RlZT1yZXEuYm9keS5yZXF1ZXN0ZWU7XG5cbiAgYWxsUmVxdWVzdC5mb3JnZSh7cmVxdWVzdG9yOiByZXF1ZXN0b3IsIHJlcXVlc3RlZTogcmVxdWVzdGVlfSlcbiAgICAuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGFsbFJlcXVlc3QpIHtcbiAgICAgIGFsbFJlcXVlc3QuZGVzdHJveSgpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJlcy5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6ICdVc2VyIHN1Y2Nlc3NmdWxseSBkZWxldGVkJ319KTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IHJlcS5ib2R5fX0pO1xuICAgICAgICB9KTtcbiAgICB9KVxuICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IHJlcS5ib2R5fX0pO1xuICAgIH0pO1xufVxuXG5leHBvcnRzLmdldFRoaXNGcmllbmRzTW92aWVzPWZ1bmN0aW9uKHJlcSxyZXNwb25zZSl7XG5cbiAgdmFyIG1vdmllcz1bXTtcbiAgY29uc29sZS5sb2cocmVxLmJvZHkuc3BlY2lmaWNGcmllbmQpO1xuICB2YXIgcGVyc29uPXJlcS5ib2R5LnNwZWNpZmljRnJpZW5kXG4gIHZhciBpZD1udWxsXG4gIHZhciBsZW49bnVsbDtcbiAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCBwZXJzb24sIGZ1bmN0aW9uKGVyciwgcmVzcCl7XG5jb25zb2xlLmxvZyhyZXNwKVxuaWQ9cmVzcFswXS5pZDtcblxuXG5jb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gcmF0aW5ncyBXSEVSRSB1c2VyaWQgPSA/JywgaWQgLGZ1bmN0aW9uKGVycixyZXNwKXtcbmNvbnNvbGUubG9nKCdlcnJycnJycnJyJyxlcnIscmVzcC5sZW5ndGgpXG5sZW49cmVzcC5sZW5ndGg7XG5yZXNwLmZvckVhY2goZnVuY3Rpb24oYSl7XG5cbmNvbi5xdWVyeSgnU0VMRUNUIHRpdGxlIEZST00gbW92aWVzIFdIRVJFIGlkID0gPycsIGEubW92aWVpZCAsZnVuY3Rpb24oZXJyLHJlc3Ape1xuICBjb25zb2xlLmxvZyhyZXNwKVxubW92aWVzLnB1c2goW3Jlc3BbMF0udGl0bGUsYS5zY29yZSxhLnJldmlld10pXG5jb25zb2xlLmxvZyhtb3ZpZXMpXG5pZiAobW92aWVzLmxlbmd0aD09PWxlbil7XG4gIHJlc3BvbnNlLnNlbmQobW92aWVzKTtcbn1cbn0pXG5cbn0pXG5cbn0pXG5cblxuICB9XG5cbil9XG5cbmV4cG9ydHMuZmluZE1vdmllQnVkZGllcz1mdW5jdGlvbihyZXEscmVzcG9uc2Upe1xuICBjb25zb2xlLmxvZyhcInlvdSdyZSB0cnlpbmcgdG8gZmluZCBidWRkaWVzISFcIik7XG5jb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gdXNlcnMnLGZ1bmN0aW9uKGVycixyZXNwKXtcbiAgdmFyIHBlb3BsZT1yZXNwLm1hcChmdW5jdGlvbihhKXtyZXR1cm4gYS51c2VybmFtZX0pXG4gIHZhciBJZHM9IHJlc3AubWFwKGZ1bmN0aW9uKGEpe3JldHVybiBhLmlkfSlcbiAgdmFyIGlkS2V5T2JqPXt9XG5mb3IgKHZhciBpPTA7aTxJZHMubGVuZ3RoO2krKyl7XG4gIGlkS2V5T2JqW0lkc1tpXV09cGVvcGxlW2ldXG59XG5jb25zb2xlLmxvZygnY3VycmVudCB1c2VyJyxyZXEubXlTZXNzaW9uLnVzZXIpO1xudmFyIGN1cnJlbnRVc2VyPXJlcS5teVNlc3Npb24udXNlclxuXG5cbiB2YXIgb2JqMT17fTtcbiAgZm9yICh2YXIgaT0wO2k8SWRzLmxlbmd0aDtpKyspe1xub2JqMVtpZEtleU9ialtJZHNbaV1dXT1bXTtcbiAgfVxuXG4gIGNvbi5xdWVyeSgnU0VMRUNUIHNjb3JlLG1vdmllaWQsdXNlcmlkIEZST00gcmF0aW5ncycsZnVuY3Rpb24oZXJyLHJlc3Bvbil7XG4gIFxuZm9yICh2YXIgaT0wO2k8cmVzcG9uLmxlbmd0aDtpKyspe1xuICBvYmoxW2lkS2V5T2JqW3Jlc3BvbltpXS51c2VyaWRdXS5wdXNoKFtyZXNwb25baV0ubW92aWVpZCxyZXNwb25baV0uc2NvcmVdKVxufVxuXG5jb25zb2xlLmxvZygnb2JqMScsb2JqMSk7XG5jdXJyZW50VXNlckluZm89b2JqMVtjdXJyZW50VXNlcl1cbi8vY29uc29sZS5sb2coJ2N1cnJlbnRVc2VySW5mbycsY3VycmVudFVzZXJJbmZvKVxudmFyIGNvbXBhcmlzb25zPXt9XG5cbmZvciAodmFyIGtleSBpbiBvYmoxKXtcbiAgaWYgKGtleSE9PWN1cnJlbnRVc2VyKSB7XG4gICAgY29tcGFyaXNvbnNba2V5XT1jb21wKGN1cnJlbnRVc2VySW5mbyxvYmoxW2tleV0pXG4gIH1cbn1cbmNvbnNvbGUubG9nKGNvbXBhcmlzb25zKVxudmFyIGZpbmFsU2VuZD1bXVxuZm9yICh2YXIga2V5IGluIGNvbXBhcmlzb25zKXtcbiAgaWYgKGNvbXBhcmlzb25zW2tleV0gIT09ICdOYU4lJykge1xuICBmaW5hbFNlbmQucHVzaChba2V5LGNvbXBhcmlzb25zW2tleV1dKTtcbn0gZWxzZSAge1xuICBmaW5hbFNlbmQucHVzaChba2V5LFwiTm8gQ29tcGFyaXNvbiB0byBNYWtlXCJdKVxufVxuXG59XG5cbiAgcmVzcG9uc2Uuc2VuZChmaW5hbFNlbmQpXG59KVxufSlcbn1cblxuXG5leHBvcnRzLmRlY2xpbmU9ZnVuY3Rpb24ocmVxLHJlc3BvbnNlKXtcbiAgdmFyIHJlcXVlc3Rvcj1yZXEuYm9keS5wZXJzb25Ub0RlY2xpbmU7XG4gIHZhciByZXF1ZXN0ZWU9cmVxLm15U2Vzc2lvbi51c2VyO1xuICB2YXIgbW92aWU9cmVxLmJvZHkubW92aWU7XG5cbiAgY29uLnF1ZXJ5KCdVUERBVEUgYWxscmVxdWVzdHMgU0VUIHJlc3BvbnNlPScrJ1wiJyArICdubycgKyAnXCInKyAnIFdIRVJFIHJlcXVlc3RvciA9ICcrJ1wiJysgcmVxdWVzdG9yKydcIicrJyBBTkQgcmVxdWVzdGVlPScrJ1wiJysgcmVxdWVzdGVlKydcIicrJyBBTkQgbW92aWUgPScrJ1wiJyttb3ZpZSsnXCInLCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcbiAgICAgIC8vIHJlc3BvbnNlLnNlbmQocmVxdWVzdG9yICsgJ2RlbGV0ZWQnKTtcbiAgICB9KTtcblxuICAvLyBhbGxSZXF1ZXN0LmZvcmdlKHtyZXF1ZXN0b3I6IHJlcXVlc3RvciwgcmVxdWVzdGVlOiByZXF1ZXN0ZWV9KVxuICAvLyAgIC5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oYWxsUmVxdWVzdCkge1xuICAvLyAgICAgYWxsUmVxdWVzdC5kZXN0cm95KClcbiAgLy8gICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gIC8vICAgICAgICAgcmVzcG9uc2UuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiAnVXNlciBzdWNjZXNzZnVsbHkgZGVsZXRlZCd9fSk7XG4gIC8vICAgICAgIH0pXG4gIC8vICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgLy8gICAgICAgICByZXNwb25zZS5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xuICAvLyAgICAgICB9KTtcbiAgLy8gICB9KVxuICAvLyAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgLy8gICAgIHJlc3BvbnNlLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XG4gIC8vICAgfSk7XG59O1xuXG5leHBvcnRzLnNpZ251cFVzZXIgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICBjb25zb2xlLmxvZygnY2FsbGluZyBsb2dpbicsIHJlcS5ib2R5KTtcbiAgLy8gY29uc29sZS5sb2coJ3RoaXMgaXMgdGhlIHNlc3Npb24nLHJlcS5zZXNzaW9uKVxuICBuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEuYm9keS5uYW1lIH0pLmZldGNoKCkudGhlbihmdW5jdGlvbihmb3VuZCkge1xuICAgIGlmIChmb3VuZCkge1xuICAgICAgLy9jaGVjayBwYXNzd29yZFxuICAgICAgICAgLy9pZiAocGFzc3dvcmQgbWF0Y2hlcylcbiAgICAgICAgIC8veyBhZGQgc2Vzc2lvbnMgYW5kIHJlZGlyZWN0fVxuICAgICAgY29uc29sZS5sb2coJ3VzZXJuYW1lIGFscmVhZHkgZXhpc3QsIGNhbm5vdCBzaWdudXAgJywgcmVxLmJvZHkubmFtZSk7XG4gICAgICByZXMuc3RhdHVzKDQwMykuc2VuZCgndXNlcm5hbWUgZXhpc3QnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ2NyZWF0aW5nIHVzZXInKTtcbiAgICAgIHJlcS5teVNlc3Npb24udXNlciA9IHJlcS5ib2R5Lm5hbWU7XG4gICAgICBVc2Vycy5jcmVhdGUoe1xuICAgICAgICB1c2VybmFtZTogcmVxLmJvZHkubmFtZSxcbiAgICAgICAgcGFzc3dvcmQ6IHJlcS5ib2R5LnBhc3N3b3JkLFxuICAgICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHVzZXIpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2NyZWF0ZWQgYSBuZXcgdXNlcicpO1xuICAgICAgICByZXMuc3RhdHVzKDIwMSkuc2VuZCgnbG9naW4gY3JlYXRlZCcpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn07XG5cbmV4cG9ydHMuc2lnbmluVXNlciA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cdGNvbnNvbGUubG9nKCdjYWxsaW5nIHNpZ25pbicsIHJlcS5ib2R5KTtcblx0bmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLmJvZHkubmFtZSB9KS5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oZm91bmQpe1xuXG5cdFx0aWYgKGZvdW5kKXtcblx0XHRcdG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUsIHBhc3N3b3JkOnJlcS5ib2R5LnBhc3N3b3JkfSkuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGZvdW5kKXtcblx0XHRcdFx0aWYgKGZvdW5kKXtcblx0XHRcdFx0XHRyZXEubXlTZXNzaW9uLnVzZXIgPSBmb3VuZC5hdHRyaWJ1dGVzLnVzZXJuYW1lO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGZvdW5kLmF0dHJpYnV0ZXMudXNlcm5hbWUpXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ3dlIGZvdW5kIHlvdSEhJylcblx0XHRcdFx0XHRyZXMuc2VuZChbJ2l0IHdvcmtlZCcscmVxLm15U2Vzc2lvbi51c2VyXSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmVzLnN0YXR1cyg0MDQpLnNlbmQoJ2JhZCBsb2dpbicpO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCd3cm9uZyBwYXNzd29yZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXMuc3RhdHVzKDQwNCkuc2VuZCgnYmFkIGxvZ2luJyk7XG5cdFx0XHRjb25zb2xlLmxvZygndXNlciBub3QgZm91bmQnKTtcblx0XHR9XG5cbiAgfSkgXG5cbn1cblxuZXhwb3J0cy5sb2dvdXQgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXHRyZXEubXlTZXNzaW9uLmRlc3Ryb3koZnVuY3Rpb24oZXJyKXtcblx0XHRjb25zb2xlLmxvZyhlcnIpO1xuXHR9KTtcblx0Y29uc29sZS5sb2coJ2xvZ291dCcpO1xuXHRyZXMuc2VuZCgnbG9nb3V0Jyk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vL21vdmllIGhhbmRsZXJzXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuLy9hIGhhbmRlbGVyIHRoYXQgdGFrZXMgYSByYXRpbmcgZnJvbSB1c2VyIGFuZCBhZGQgaXQgdG8gdGhlIGRhdGFiYXNlXG4vLyBleHBlY3RzIHJlcS5ib2R5IHRvIGhhdmUgdGhpczoge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnLCBwb3N0ZXI6ICdsaW5rJywgcmVsZWFzZV9kYXRlOiAneWVhcicsIHJhdGluZzogJ251bWJlcid9XG5leHBvcnRzLnJhdGVNb3ZpZSA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cdGNvbnNvbGUubG9nKCdjYWxsaW5nIHJhdGVNb3ZpZScpO1xuXHR2YXIgdXNlcmlkO1xuXHRyZXR1cm4gbmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLm15U2Vzc2lvbi51c2VyIH0pLmZldGNoKClcblx0LnRoZW4oZnVuY3Rpb24oZm91bmRVc2VyKSB7XG5cdFx0dXNlcmlkID0gZm91bmRVc2VyLmF0dHJpYnV0ZXMuaWQ7XG5cdFx0cmV0dXJuIG5ldyBSYXRpbmcoeyBtb3ZpZWlkOiByZXEuYm9keS5pZCwgdXNlcmlkOiB1c2VyaWQgfSkuZmV0Y2goKVxuXHRcdC50aGVuKGZ1bmN0aW9uKGZvdW5kUmF0aW5nKSB7XG5cdFx0XHRpZiAoZm91bmRSYXRpbmcpIHtcblx0XHRcdFx0Ly9zaW5jZSByYXRpbmcgb3IgcmV2aWV3IGlzIHVwZGF0ZWQgc2VwZXJhdGx5IGluIGNsaWVudCwgdGhlIGZvbGxvd2luZ1xuXHRcdFx0XHQvL21ha2Ugc3VyZSBpdCBnZXRzIHVwZGF0ZWQgYWNjb3JkaW5nIHRvIHRoZSByZXFcblx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ3VwZGF0ZSByYXRpbmcnLCBmb3VuZFJhdGluZylcblx0XHRcdFx0aWYgKHJlcS5ib2R5LnJhdGluZykge1xuXHRcdFx0XHRcdHZhciByYXRpbmdPYmogPSB7c2NvcmU6IHJlcS5ib2R5LnJhdGluZ307XG5cdFx0XHRcdH0gZWxzZSBpZiAocmVxLmJvZHkucmV2aWV3KSB7XG5cdFx0XHRcdFx0dmFyIHJhdGluZ09iaiA9IHtyZXZpZXc6IHJlcS5ib2R5LnJldmlld307XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIG5ldyBSYXRpbmcoeydpZCc6IGZvdW5kUmF0aW5nLmF0dHJpYnV0ZXMuaWR9KVxuXHRcdFx0XHRcdC5zYXZlKHJhdGluZ09iaik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnY3JlYXRpbmcgcmF0aW5nJyk7XG5cdFx0ICAgIHJldHVybiBSYXRpbmdzLmNyZWF0ZSh7XG5cdFx0ICAgIFx0c2NvcmU6IHJlcS5ib2R5LnJhdGluZyxcblx0XHQgICAgICB1c2VyaWQ6IHVzZXJpZCxcblx0XHQgICAgICBtb3ZpZWlkOiByZXEuYm9keS5pZCxcblx0XHQgICAgICByZXZpZXc6IHJlcS5ib2R5LnJldmlld1xuXHRcdCAgICB9KTtcdFx0XHRcdFx0XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pXG5cdC50aGVuKGZ1bmN0aW9uKG5ld1JhdGluZykge1xuXHRcdGNvbnNvbGUubG9nKCdyYXRpbmcgY3JlYXRlZDonLCBuZXdSYXRpbmcuYXR0cmlidXRlcyk7XG4gIFx0cmVzLnN0YXR1cygyMDEpLnNlbmQoJ3JhdGluZyByZWNpZXZlZCcpO1xuXHR9KVxufTtcblxuLy90aGlzIGhlbHBlciBmdW5jdGlvbiBhZGRzIHRoZSBtb3ZpZSBpbnRvIGRhdGFiYXNlXG4vL2l0IGZvbGxvd3MgdGhlIHNhbWUgbW92aWUgaWQgYXMgVE1EQlxuLy9leHBlY3RzIHJlcS5ib2R5IHRvIGhhdmUgdGhlc2UgYXRyaWJ1dGUgOiB7aWQsIHRpdGxlLCBnZW5yZSwgcG9zdGVyX3BhdGgsIHJlbGVhc2VfZGF0ZSwgb3ZlcnZpZXcsIHZvdGVfYXZlcmFnZX1cbnZhciBhZGRPbmVNb3ZpZSA9IGZ1bmN0aW9uKG1vdmllT2JqKSB7XG5cdHZhciBnZW5yZSA9IChtb3ZpZU9iai5nZW5yZV9pZHMpID8gZ2VucmVzW21vdmllT2JqLmdlbnJlX2lkc1swXV0gOiAnbi9hJztcbiAgcmV0dXJuIG5ldyBNb3ZpZSh7XG4gIFx0aWQ6IG1vdmllT2JqLmlkLFxuICAgIHRpdGxlOiBtb3ZpZU9iai50aXRsZSxcbiAgICBnZW5yZTogZ2VucmUsXG4gICAgcG9zdGVyOiAnaHR0cHM6Ly9pbWFnZS50bWRiLm9yZy90L3AvdzE4NS8nICsgbW92aWVPYmoucG9zdGVyX3BhdGgsXG4gICAgcmVsZWFzZV9kYXRlOiBtb3ZpZU9iai5yZWxlYXNlX2RhdGUsXG4gICAgZGVzY3JpcHRpb246IG1vdmllT2JqLm92ZXJ2aWV3LnNsaWNlKDAsIDI1NSksXG4gICAgaW1kYlJhdGluZzogbW92aWVPYmoudm90ZV9hdmVyYWdlXG4gIH0pLnNhdmUobnVsbCwge21ldGhvZDogJ2luc2VydCd9KVxuICAudGhlbihmdW5jdGlvbihuZXdNb3ZpZSkge1xuICBcdGNvbnNvbGUubG9nKCdtb3ZpZSBjcmVhdGVkJywgbmV3TW92aWUuYXR0cmlidXRlcy50aXRsZSk7XG4gIFx0cmV0dXJuIG5ld01vdmllO1xuICB9KVxufTtcblxuXG4vL2dldCBhbGwgbW92aWUgcmF0aW5ncyB0aGF0IGEgdXNlciByYXRlZFxuLy9zaG91bGQgcmV0dXJuIGFuIGFycmF5IHRoYXQgbG9vayBsaWtlIHRoZSBmb2xsb3dpbmc6XG4vLyBbIHt0aXRsZTogJ25hbWUnLCBnZW5yZTogJ2dlbnJlJyAsIHBvc3RlcjogJ3VybCcsIHJlbGVhc2VfZGF0ZTogJ2RhdGUnLCBzY29yZTogbiwgZnJpZW5kQXZlcmFnZVJhdGluZzogbn0gLi4uIF1cbi8vIHdpbGwgZ2V0IHJhdGluZ3MgZm9yIHRoZSBjdXJyZW50IHVzZXJcbmV4cG9ydHMuZ2V0VXNlclJhdGluZ3MgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICBSYXRpbmcucXVlcnkoZnVuY3Rpb24ocWIpe1xuICBcdHFiLmlubmVySm9pbigndXNlcnMnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICd1c2Vycy5pZCcpO1xuICBcdHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xuICBcdHFiLnNlbGVjdCgndXNlcnMudXNlcm5hbWUnLCAnbW92aWVzLnRpdGxlJywgJ21vdmllcy5pZCcsICdtb3ZpZXMuZ2VucmUnLCAnbW92aWVzLnBvc3RlcicsICdtb3ZpZXMucmVsZWFzZV9kYXRlJywgJ21vdmllcy5pbWRiUmF0aW5nJywgJ21vdmllcy5kZXNjcmlwdGlvbicsICdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3JywgJ3JhdGluZ3MudXBkYXRlZF9hdCcpO1xuICBcdHFiLndoZXJlKCd1c2Vycy51c2VybmFtZScsICc9JywgcmVxLm15U2Vzc2lvbi51c2VyKTtcbiAgXHRxYi5vcmRlckJ5KCd1cGRhdGVkX2F0JywgJ0RFU0MnKVxuICB9KVxuICAuZmV0Y2hBbGwoKVxuICAudGhlbihmdW5jdGlvbihyYXRpbmdzKXtcblx0XHQvL2RlY29yYXRlIGl0IHdpdGggYXZnIGZyaWVuZCByYXRpbmdcblx0XHRyZXR1cm4gUHJvbWlzZS5tYXAocmF0aW5ncy5tb2RlbHMsIGZ1bmN0aW9uKHJhdGluZykge1xuXHRcdFx0cmV0dXJuIGF0dGFjaEZyaWVuZEF2Z1JhdGluZyhyYXRpbmcsIHJlcS5teVNlc3Npb24udXNlcik7XG5cdFx0fSk7XG5cdH0pXG4gIC50aGVuKGZ1bmN0aW9uKHJhdGluZ3MpIHtcbiAgXHRjb25zb2xlLmxvZygncmV0cml2aW5nIGFsbCB1c2VyIHJhdGluZ3MnKTtcbiAgXHRyZXMuc3RhdHVzKDIwMCkuanNvbihyYXRpbmdzKTtcbiAgfSlcbn07XG5cbmV4cG9ydHMuZ2V0RnJpZW5kVXNlclJhdGluZ3MgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICBSYXRpbmcucXVlcnkoZnVuY3Rpb24ocWIpe1xuICBcdHFiLmlubmVySm9pbigndXNlcnMnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICd1c2Vycy5pZCcpO1xuICBcdHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xuICBcdHFiLnNlbGVjdCgndXNlcnMudXNlcm5hbWUnLCAnbW92aWVzLnRpdGxlJywgJ21vdmllcy5pZCcsICdtb3ZpZXMuZ2VucmUnLCAnbW92aWVzLnBvc3RlcicsICdtb3ZpZXMucmVsZWFzZV9kYXRlJywgJ21vdmllcy5pbWRiUmF0aW5nJywgJ21vdmllcy5kZXNjcmlwdGlvbicsICdyYXRpbmdzLnNjb3JlIGFzIGZyaWVuZFNjb3JlJywgJ3JhdGluZ3MucmV2aWV3IGFzIGZyaWVuZFJldmlldycsICdyYXRpbmdzLnVwZGF0ZWRfYXQnKTtcbiAgXHRxYi53aGVyZSgndXNlcnMudXNlcm5hbWUnLCAnPScsIHJlcS5xdWVyeS5mcmllbmROYW1lKTtcbiAgXHRxYi5vcmRlckJ5KCd1cGRhdGVkX2F0JywgJ0RFU0MnKVxuICB9KVxuICAuZmV0Y2hBbGwoKVxuICAudGhlbihmdW5jdGlvbihyYXRpbmdzKXtcblx0XHQvL2RlY29yYXRlIGl0IHdpdGggY3VycmVudCB1c2VyJ3MgcmF0aW5nXG5cdFx0cmV0dXJuIFByb21pc2UubWFwKHJhdGluZ3MubW9kZWxzLCBmdW5jdGlvbihyYXRpbmcpIHtcblx0XHRcdHJldHVybiBhdHRhY2hVc2VyUmF0aW5nKHJhdGluZywgcmVxLm15U2Vzc2lvbi51c2VyKTtcblx0XHR9KTtcblx0fSlcbiAgLnRoZW4oZnVuY3Rpb24ocmF0aW5ncykge1xuICBcdGNvbnNvbGUubG9nKCdyZXRyaXZpbmcgYWxsIHVzZXIgcmF0aW5ncycpO1xuICBcdHJlcy5zdGF0dXMoMjAwKS5qc29uKHJhdGluZ3MpO1xuICB9KVxufTtcblxuLy9hIGRlY29yYXRvciBmdW5jdGlvbiB0aGF0IGF0dGFjaGVzIGZyaWVuZCBhdmcgcmF0aW5nIHRvIHRoZSByYXRpbmcgb2JqXG52YXIgYXR0YWNoRnJpZW5kQXZnUmF0aW5nID0gZnVuY3Rpb24ocmF0aW5nLCB1c2VybmFtZSkge1xuXHRyZXR1cm4gZXhwb3J0cy5nZXRGcmllbmRSYXRpbmdzKHVzZXJuYW1lLCByYXRpbmcpXG5cdC50aGVuKGZ1bmN0aW9uKGZyaWVuZHNSYXRpbmdzKXtcblx0XHQvL2lmIGZyaWVuZHNSYXRpbmdzIGlzIG51bGwsIFJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgaXMgbnVsbFxuXHRcdGlmICghZnJpZW5kc1JhdGluZ3MpIHtcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgPSBudWxsO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nID0gYXZlcmFnZVJhdGluZyhmcmllbmRzUmF0aW5ncyk7XG5cdFx0fVxuXHRcdHJldHVybiByYXRpbmc7XG5cdH0pXG59XG5cbi8vYSBkZWNvcmF0b3IgZnVuY3Rpb24gdGhhdCBhdHRhY2hlcyB1c2VyIHJhdGluZyBhbmQgcmV2aWV3cyB0byB0aGUgcmF0aW5nIG9ialxudmFyIGF0dGFjaFVzZXJSYXRpbmcgPSBmdW5jdGlvbihyYXRpbmcsIHVzZXJuYW1lKSB7XG5cdHJldHVybiBSYXRpbmcucXVlcnkoZnVuY3Rpb24ocWIpIHtcblx0XHRxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3VzZXJzLmlkJywgJz0nLCAncmF0aW5ncy51c2VyaWQnKVxuXHRcdHFiLmlubmVySm9pbignbW92aWVzJywgJ21vdmllcy5pZCcsICc9JywgJ3JhdGluZ3MubW92aWVpZCcpXG5cdFx0cWIuc2VsZWN0KCdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3Jylcblx0XHRxYi53aGVyZSh7XG5cdFx0XHQndXNlcnMudXNlcm5hbWUnOiB1c2VybmFtZSxcblx0XHRcdCdtb3ZpZXMudGl0bGUnOiByYXRpbmcuYXR0cmlidXRlcy50aXRsZSxcblx0XHRcdCdtb3ZpZXMuaWQnOiByYXRpbmcuYXR0cmlidXRlcy5pZFxuXHRcdH0pXG5cdH0pXG5cdC5mZXRjaCgpXG5cdC50aGVuKGZ1bmN0aW9uKHVzZXJSYXRpbmcpe1xuXHRcdGlmICh1c2VyUmF0aW5nKSB7XG5cdFx0XHRyYXRpbmcuYXR0cmlidXRlcy5zY29yZSA9IHVzZXJSYXRpbmcuYXR0cmlidXRlcy5zY29yZTtcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLnJldmlldyA9IHVzZXJSYXRpbmcuYXR0cmlidXRlcy5yZXZpZXc7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLnNjb3JlID0gbnVsbDtcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLnJldmlldyA9IG51bGw7XG5cdFx0fVxuXHRcdHJldHVybiByYXRpbmc7XG5cdH0pO1xufTtcblxuLy90aGlzIGlzIGEgd3JhcGVyIGZ1bmN0aW9uIGZvciBnZXRGcmllbmRSYXRpbmdzIHdoaWNoIHdpbGwgc2VudCB0aGUgY2xpZW50IGFsbCBvZiB0aGUgZnJpZW5kIHJhdGluZ3NcbmV4cG9ydHMuaGFuZGxlR2V0RnJpZW5kUmF0aW5ncyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cdGNvbnNvbGUubG9nKCdoYW5kbGVHZXRGcmllbmRSYXRpbmdzLCAnLCByZXEubXlTZXNzaW9uLnVzZXIsIHJlcS5ib2R5Lm1vdmllLnRpdGxlKTtcblx0ZXhwb3J0cy5nZXRGcmllbmRSYXRpbmdzKHJlcS5teVNlc3Npb24udXNlciwge2F0dHJpYnV0ZXM6IHJlcS5ib2R5Lm1vdmllfSlcblx0LnRoZW4oZnVuY3Rpb24oZnJpZW5kUmF0aW5ncyl7XG5cdFx0cmVzLmpzb24oZnJpZW5kUmF0aW5ncyk7XG5cdH0pO1xufVxuXG4vL3RoaXMgZnVuY3Rpb24gb3V0cHV0cyByYXRpbmdzIG9mIGEgdXNlcidzIGZyaWVuZCBmb3IgYSBwYXJ0aWN1bGFyIG1vdmllXG4vL2V4cGVjdCBjdXJyZW50IHVzZXJuYW1lIGFuZCBtb3ZpZVRpdGxlIGFzIGlucHV0XG4vL291dHB1dHM6IHt1c2VyMmlkOiAnaWQnLCBmcmllbmRVc2VyTmFtZTonbmFtZScsIGZyaWVuZEZpcnN0TmFtZTonbmFtZScsIHRpdGxlOidtb3ZpZVRpdGxlJywgc2NvcmU6biB9XG5leHBvcnRzLmdldEZyaWVuZFJhdGluZ3MgPSBmdW5jdGlvbih1c2VybmFtZSwgbW92aWVPYmopIHtcblx0cmV0dXJuIFVzZXIucXVlcnkoZnVuY3Rpb24ocWIpe1xuXHRcdHFiLmlubmVySm9pbigncmVsYXRpb25zJywgJ3JlbGF0aW9ucy51c2VyMWlkJywgJz0nLCAndXNlcnMuaWQnKTtcblx0XHRxYi5pbm5lckpvaW4oJ3JhdGluZ3MnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICdyZWxhdGlvbnMudXNlcjJpZCcpO1xuXHRcdHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xuXHRcdHFiLnNlbGVjdCgncmVsYXRpb25zLnVzZXIyaWQnLCAnbW92aWVzLnRpdGxlJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnKTtcblx0XHRxYi53aGVyZSh7XG5cdFx0XHQndXNlcnMudXNlcm5hbWUnOiB1c2VybmFtZSwgXG5cdFx0XHQnbW92aWVzLnRpdGxlJzogbW92aWVPYmouYXR0cmlidXRlcy50aXRsZSxcblx0XHRcdCdtb3ZpZXMuaWQnOiBtb3ZpZU9iai5hdHRyaWJ1dGVzLmlkIH0pO1xuXHR9KVxuXHQuZmV0Y2hBbGwoKVxuXHQudGhlbihmdW5jdGlvbihmcmllbmRzUmF0aW5ncyl7XG5cdC8vdGhlIGZvbGxvd2luZyBibG9jayBhZGRzIHRoZSBmcmllbmROYW1lIGF0dHJpYnV0ZSB0byB0aGUgcmF0aW5nc1xuXHRcdHJldHVybiBQcm9taXNlLm1hcChmcmllbmRzUmF0aW5ncy5tb2RlbHMsIGZ1bmN0aW9uKGZyaWVuZFJhdGluZykge1xuXHRcdFx0cmV0dXJuIG5ldyBVc2VyKHsgaWQ6IGZyaWVuZFJhdGluZy5hdHRyaWJ1dGVzLnVzZXIyaWQgfSkuZmV0Y2goKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oZnJpZW5kKXtcblx0XHRcdFx0ZnJpZW5kUmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kVXNlck5hbWUgPSBmcmllbmQuYXR0cmlidXRlcy51c2VybmFtZTtcblx0XHRcdFx0ZnJpZW5kUmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kRmlyc3ROYW1lID0gZnJpZW5kLmF0dHJpYnV0ZXMuZmlyc3ROYW1lO1xuXHRcdFx0XHRyZXR1cm4gZnJpZW5kUmF0aW5nO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0pXG5cdC50aGVuKGZ1bmN0aW9uKGZyaWVuZHNSYXRpbmdzKXtcblx0XHRyZXR1cm4gZnJpZW5kc1JhdGluZ3M7XG5cdH0pO1xufTtcblxuXG4vL2EgaGVscGVyIGZ1bmN0aW9uIHRoYXQgYXZlcmFnZXMgdGhlIHJhdGluZ1xuLy9pbnB1dHMgcmF0aW5ncywgb3V0cHV0cyB0aGUgYXZlcmFnZSBzY29yZTtcbnZhciBhdmVyYWdlUmF0aW5nID0gZnVuY3Rpb24ocmF0aW5ncykge1xuXHQvL3JldHVybiBudWxsIGlmIG5vIGZyaWVuZCBoYXMgcmF0ZWQgdGhlIG1vdmllXG5cdGlmIChyYXRpbmdzLmxlbmd0aCA9PT0gMCkge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdHJldHVybiByYXRpbmdzXG5cdC5yZWR1Y2UoZnVuY3Rpb24odG90YWwsIHJhdGluZyl7XG5cdFx0cmV0dXJuIHRvdGFsICs9IHJhdGluZy5hdHRyaWJ1dGVzLnNjb3JlO1xuXHR9LCAwKSAvIHJhdGluZ3MubGVuZ3RoO1xufVxuXG5cbi8vYSBoZWxwZXIgZnVuY3Rpb24gdGhhdCBvdXRwdXRzIHVzZXIgcmF0aW5nIGFuZCBhdmVyYWdlIGZyaWVuZCByYXRpbmcgZm9yIG9uZSBtb3ZpZVxuLy9vdXRwdXRzIG9uZSByYXRpbmcgb2JqOiB7dGl0bGU6ICduYW1lJywgZ2VucmU6ICdnZW5yZScgLCBwb3N0ZXI6ICd1cmwnLCByZWxlYXNlX2RhdGU6ICdkYXRlJywgc2NvcmU6IG4sIGZyaWVuZEF2ZXJhZ2VSYXRpbmc6IG59XG52YXIgZ2V0T25lTW92aWVSYXRpbmcgPSBmdW5jdGlvbih1c2VybmFtZSwgbW92aWVPYmopIHtcbiAgcmV0dXJuIFJhdGluZy5xdWVyeShmdW5jdGlvbihxYil7XG4gIFx0cWIuaW5uZXJKb2luKCd1c2VycycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3VzZXJzLmlkJyk7XG4gIFx0cWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XG4gIFx0cWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnKTtcbiAgXHRxYi53aGVyZSh7J3VzZXJzLnVzZXJuYW1lJzogdXNlcm5hbWUsICdtb3ZpZXMudGl0bGUnOiBtb3ZpZU9iai50aXRsZSwgJ21vdmllcy5pZCc6IG1vdmllT2JqLmlkfSk7XG4gIH0pXG4gIC5mZXRjaCgpXG4gIC50aGVuKGZ1bmN0aW9uKHJhdGluZyl7XG5cdCAgaWYgKCFyYXRpbmcpIHtcblx0ICBcdC8vaWYgdGhlIHVzZXIgaGFzIG5vdCByYXRlZCB0aGUgbW92aWUsIHJldHVybiBhbiBvYmogdGhhdCBoYXMgdGhlIG1vdmllIGluZm9ybWF0aW9uLCBidXQgc2NvcmUgaXMgc2V0IHRvIG51bGxcblx0ICBcdHJldHVybiBuZXcgTW92aWUoe3RpdGxlOiBtb3ZpZU9iai50aXRsZSwgaWQ6IG1vdmllT2JqLmlkfSkuZmV0Y2goKVxuXHQgIFx0LnRoZW4oZnVuY3Rpb24obW92aWUpIHtcblx0ICBcdFx0bW92aWUuYXR0cmlidXRlcy5zY29yZSA9IG51bGw7XG5cdCAgXHRcdHJldHVybiBtb3ZpZTtcblx0ICBcdH0pXG5cdCAgfSBlbHNlIHtcblx0ICBcdHJldHVybiByYXRpbmc7XG5cdCAgfVxuXHR9KVxuXHQudGhlbihmdW5jdGlvbihyYXRpbmcpe1xuXHRcdHJldHVybiBleHBvcnRzLmdldEZyaWVuZFJhdGluZ3ModXNlcm5hbWUsIHJhdGluZylcblx0XHQudGhlbihmdW5jdGlvbihmcmllbmRzUmF0aW5ncyl7XG5cdFx0XHQvLyBjb25zb2xlLmxvZygnZnJpZW5kc1JhdGluZ3MnLCBmcmllbmRzUmF0aW5ncyk7XG5cdFx0XHRyYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nID0gYXZlcmFnZVJhdGluZyhmcmllbmRzUmF0aW5ncyk7XG5cdFx0XHRjb25zb2xlLmxvZygnYWRkZWQgYXZlcmFnZSBmcmllbmQgcmF0aW5nJywgcmF0aW5nLmF0dHJpYnV0ZXMudGl0bGUsIHJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcpO1xuXHRcdFx0cmV0dXJuIHJhdGluZztcblx0XHR9KTtcblx0fSk7XG59XG5cblxuLy90aGlzIGhhbmRsZXIgaXMgc3BlY2lmaWNhbGx5IGZvciBzZW5kaW5nIG91dCBhIGxpc3Qgb2YgbW92aWUgcmF0aW5ncyB3aGVuIHRoZSBjbGllbnQgc2VuZHMgYSBsaXN0IG9mIG1vdmllIHRvIHRoZSBzZXJ2ZXJcbi8vZXhwZWN0cyByZXEuYm9keSB0byBiZSBhbiBhcnJheSBvZiBvYmogd2l0aCB0aGVzZSBhdHRyaWJ1dGVzOiB7aWQsIHRpdGxlLCBnZW5yZSwgcG9zdGVyX3BhdGgsIHJlbGVhc2VfZGF0ZSwgb3ZlcnZpZXcsIHZvdGVfYXZlcmFnZX1cbi8vb3V0cHV0cyBbIHt0aXRsZTogJ25hbWUnLCBnZW5yZTogJ2dlbnJlJyAsIHBvc3RlcjogJ3VybCcsIHJlbGVhc2VfZGF0ZTogJ2RhdGUnLCBzY29yZTogbiwgZnJpZW5kQXZlcmFnZVJhdGluZzogbn0gLi4uIF1cbmV4cG9ydHMuZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXHRjb25zb2xlLmxvZygnZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MnKTtcblx0UHJvbWlzZS5tYXAocmVxLmJvZHkubW92aWVzLCBmdW5jdGlvbihtb3ZpZSkge1xuXHRcdC8vZmlyc3QgY2hlY2sgd2hldGhlciBtb3ZpZSBpcyBpbiB0aGUgZGF0YWJhc2Vcblx0XHRyZXR1cm4gbmV3IE1vdmllKHt0aXRsZTogbW92aWUudGl0bGUsIGlkOiBtb3ZpZS5pZH0pLmZldGNoKClcblx0XHQudGhlbihmdW5jdGlvbihmb3VuZE1vdmllKSB7XG5cdFx0XHQvL2lmIG5vdCBjcmVhdGUgb25lXG5cdFx0XHRpZiAoIWZvdW5kTW92aWUpIHtcblx0XHRcdFx0cmV0dXJuIGFkZE9uZU1vdmllKG1vdmllKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBmb3VuZE1vdmllO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LnRoZW4oZnVuY3Rpb24oZm91bmRNb3ZpZSl7XG5cdFx0XHQvLyBjb25zb2xlLmxvZygnZm91bmQgbW92aWUnLCBmb3VuZE1vdmllKTtcblx0XHRcdHJldHVybiBnZXRPbmVNb3ZpZVJhdGluZyhyZXEubXlTZXNzaW9uLnVzZXIsIGZvdW5kTW92aWUuYXR0cmlidXRlcyk7XG5cdFx0fSlcblx0fSlcblx0LnRoZW4oZnVuY3Rpb24ocmF0aW5ncyl7XG5cdFx0Y29uc29sZS5sb2coJ3NlbmRpbmcgcmF0aW5nIHRvIGNsaWVudCcpO1xuXHRcdHJlcy5qc29uKHJhdGluZ3MpO1xuXHR9KVxufVxuXG4vL3RoaXMgaGFuZGxlciBzZW5kcyBhbiBnZXQgcmVxdWVzdCB0byBUTURCIEFQSSB0byByZXRyaXZlIHJlY2VudCB0aXRsZXNcbi8vd2UgY2Fubm90IGRvIGl0IGluIHRoZSBmcm9udCBlbmQgYmVjYXVzZSBjcm9zcyBvcmlnaW4gcmVxdWVzdCBpc3N1ZXNcbmV4cG9ydHMuZ2V0UmVjZW50UmVsZWFzZSA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIHZhciBwYXJhbXMgPSB7XG4gICAgYXBpX2tleTogJzlkM2IwMzVlZjFjZDY2OWFlZDM5ODQwMGIxN2ZjZWEyJyxcbiAgICBwcmltYXJ5X3JlbGVhc2VfeWVhcjogbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpLFxuICAgIGluY2x1ZGVfYWR1bHQ6IGZhbHNlLFxuICAgIHNvcnRfYnk6ICdwb3B1bGFyaXR5LmRlc2MnXG4gIH07XG5cblx0IFxuICB2YXIgZGF0YSA9ICcnO1xuXHRyZXF1ZXN0KHtcblx0XHRtZXRob2Q6ICdHRVQnLFxuXHRcdHVybDogJ2h0dHBzOi8vYXBpLnRoZW1vdmllZGIub3JnLzMvZGlzY292ZXIvbW92aWUvJyxcblx0XHRxczogcGFyYW1zXG5cdH0pXG5cdC5vbignZGF0YScsZnVuY3Rpb24oY2h1bmspe1xuXHRcdGRhdGEgKz0gY2h1bms7XG5cdH0pXG5cdC5vbignZW5kJywgZnVuY3Rpb24oKXtcblx0XHRyZWNlbnRNb3ZpZXMgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgIHJlcS5ib2R5Lm1vdmllcyA9IHJlY2VudE1vdmllcy5yZXN1bHRzO1xuICAgIC8vdHJhbnNmZXJzIHRoZSBtb3ZpZSBkYXRhIHRvIGdldE11bHRpcGxlTW92aWVSYXRpbmdzIHRvIGRlY29yYXRlIHdpdGggc2NvcmUgKHVzZXIgcmF0aW5nKSBhbmQgYXZnZnJpZW5kUmF0aW5nIGF0dHJpYnV0ZVxuICAgIGV4cG9ydHMuZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MocmVxLCByZXMpO1xuXG5cdH0pXG5cdC5vbignZXJyb3InLCBmdW5jdGlvbihlcnJvcil7XG5cdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHR9KVxuXG59XG5cbi8vdGhpcyBpcyBUTURCJ3MgZ2VucmUgY29kZSwgd2UgbWlnaHQgd2FudCB0byBwbGFjZSB0aGlzIHNvbWV3aGVyZSBlbHNlXG52YXIgZ2VucmVzID0ge1xuICAgMTI6IFwiQWR2ZW50dXJlXCIsXG4gICAxNDogXCJGYW50YXN5XCIsXG4gICAxNjogXCJBbmltYXRpb25cIixcbiAgIDE4OiBcIkRyYW1hXCIsXG4gICAyNzogXCJIb3Jyb3JcIixcbiAgIDI4OiBcIkFjdGlvblwiLFxuICAgMzU6IFwiQ29tZWR5XCIsXG4gICAzNjogXCJIaXN0b3J5XCIsXG4gICAzNzogXCJXZXN0ZXJuXCIsXG4gICA1MzogXCJUaHJpbGxlclwiLFxuICAgODA6IFwiQ3JpbWVcIixcbiAgIDk5OiBcIkRvY3VtZW50YXJ5XCIsXG4gICA4Nzg6IFwiU2NpZW5jZSBGaWN0aW9uXCIsXG4gICA5NjQ4OiBcIk15c3RlcnlcIixcbiAgIDEwNDAyOiBcIk11c2ljXCIsXG4gICAxMDc0OTogXCJSb21hbmNlXCIsXG4gICAxMDc1MTogXCJGYW1pbHlcIixcbiAgIDEwNzUyOiBcIldhclwiLFxuICAgMTA3Njk6IFwiRm9yZWlnblwiLFxuICAgMTA3NzA6IFwiVFYgTW92aWVcIlxuIH07XG5cbi8vdGhpcyBmdW5jdGlvbiB3aWxsIHNlbmQgYmFjayBzZWFyY2IgbW92aWVzIHVzZXIgaGFzIHJhdGVkIGluIHRoZSBkYXRhYmFzZVxuLy9pdCB3aWxsIHNlbmQgYmFjayBtb3ZpZSBvYmpzIHRoYXQgbWF0Y2ggdGhlIHNlYXJjaCBpbnB1dCwgZXhwZWN0cyBtb3ZpZSBuYW1lIGluIHJlcS5ib2R5LnRpdGxlXG5leHBvcnRzLnNlYXJjaFJhdGVkTW92aWUgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICByZXR1cm4gUmF0aW5nLnF1ZXJ5KGZ1bmN0aW9uKHFiKXtcblx0XHRxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcblx0XHRxYi5pbm5lckpvaW4oJ21vdmllcycsICdyYXRpbmdzLm1vdmllaWQnLCAnPScsICdtb3ZpZXMuaWQnKTtcblx0XHRxYi5zZWxlY3QoJ3VzZXJzLnVzZXJuYW1lJywgJ21vdmllcy50aXRsZScsICdtb3ZpZXMuaWQnLCAnbW92aWVzLmdlbnJlJywgJ21vdmllcy5wb3N0ZXInLCAnbW92aWVzLnJlbGVhc2VfZGF0ZScsICdtb3ZpZXMuaW1kYlJhdGluZycsICdtb3ZpZXMuZGVzY3JpcHRpb24nLCAncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycpO1xuICBcdHFiLndoZXJlUmF3KGBNQVRDSCAobW92aWVzLnRpdGxlKSBBR0FJTlNUICgnJHtyZXEucXVlcnkudGl0bGV9JyBJTiBOQVRVUkFMIExBTkdVQUdFIE1PREUpYClcbiAgXHRxYi5hbmRXaGVyZSgndXNlcnMudXNlcm5hbWUnLCAnPScsIHJlcS5teVNlc3Npb24udXNlcilcbiAgXHRxYi5vcmRlckJ5KCd1cGRhdGVkX2F0JywgJ0RFU0MnKVxuICB9KVxuICAuZmV0Y2hBbGwoKVxuICAudGhlbihmdW5jdGlvbihtYXRjaGVzKXtcbiAgXHRjb25zb2xlLmxvZyhtYXRjaGVzLm1vZGVscyk7XG4gIFx0cmVzLmpzb24obWF0Y2hlcyk7XG4gIH0pXG59XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy9mcmllbmRzaGlwIGhhbmRsZXJzXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuZXhwb3J0cy5nZXRGcmllbmRMaXN0ID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcblx0cmV0dXJuIFJlbGF0aW9uLnF1ZXJ5KGZ1bmN0aW9uKHFiKXtcblx0XHRxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JlbGF0aW9ucy51c2VyMWlkJywgJz0nLCAndXNlcnMuaWQnKTtcblx0XHRxYi5zZWxlY3QoJ3JlbGF0aW9ucy51c2VyMmlkJyk7XG5cdFx0cWIud2hlcmUoe1xuXHRcdFx0J3VzZXJzLnVzZXJuYW1lJzogcmVxLm15U2Vzc2lvbi51c2VyXG5cdFx0fSlcblx0fSlcblx0LmZldGNoQWxsKClcblx0LnRoZW4oZnVuY3Rpb24oZnJpZW5kcyl7XG5cdFx0cmV0dXJuIFByb21pc2UubWFwKGZyaWVuZHMubW9kZWxzLCBmdW5jdGlvbihmcmllbmQpIHtcblx0XHRcdHJldHVybiBuZXcgVXNlcih7aWQ6IGZyaWVuZC5hdHRyaWJ1dGVzLnVzZXIyaWR9KS5mZXRjaCgpXG5cdFx0XHQudGhlbihmdW5jdGlvbihmcmllbmRVc2VyKXtcblx0XHRcdFx0cmV0dXJuIGZyaWVuZFVzZXIuYXR0cmlidXRlcy51c2VybmFtZTtcblx0XHRcdH0pXG5cdFx0fSlcblx0fSlcblx0LnRoZW4oZnVuY3Rpb24oZnJpZW5kcyl7XG5cdFx0Y29uc29sZS5sb2coJ3NlbmRpbmcgYSBsaXN0IG9mIGZyaWVuZCBuYW1lcycsIGZyaWVuZHMpO1xuXHRcdHJlcy5qc29uKGZyaWVuZHMpO1xuXHR9KVxufVxuXG4vL3RoaXMgd291bGQgc2VuZCBhIG5vdGljZSB0byB0aGUgdXNlciB3aG8gcmVjZWl2ZSB0aGUgZnJpZW5kIHJlcXVlc3QsIHByb21wdGluZyB0aGVtIHRvIGFjY2VwdCBvciBkZW55IHRoZSByZXF1ZXN0XG5leHBvcnRzLmFkZEZyaWVuZCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cbn07XG5cblxuLy90aGlzIHdvdWxkIGNvbmZpcm0gdGhlIGZyaWVuZHNoaXAgYW5kIGVzdGFibGlzaCB0aGUgcmVsYXRpb25zaGlwIGluIHRoZSBkYXRhYmFzZVxuZXhwb3J0cy5jb25maXJtRnJpZW5kc2hpcCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cbn07XG5cblxuXG5leHBvcnRzLmdldEZyaWVuZHMgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICB2YXIgcGVvcGxlSWQgPSBbXTtcbiAgdmFyIGlkID0gcmVxLm15U2Vzc2lvbi51c2VyXG4gIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgaWQsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xuICAgIHZhciB1c2VyaWQgPSByZXNwWzBdLmlkO1xuICAgIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBiZSBsaW5nLzInLGlkKVxuICBcbiAgICBjb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gcmF0aW5ncyBXSEVSRSB1c2VyaWQgPSA/JywgdXNlcmlkLCBmdW5jdGlvbihlcnIsIHJlc3ApIHtcbiAgICAgIHZhciB1c2Vyc1JhdGluZ3M9cmVzcC5tYXAoZnVuY3Rpb24oYSl7IHJldHVybiBbYS5tb3ZpZWlkLCBhLnNjb3JlXX0pO1xuXG4gICAgICBjb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gcmVsYXRpb25zIFdIRVJFIHVzZXIxaWQgPSA/JywgdXNlcmlkLCBmdW5jdGlvbihlcnIsIHJlc3ApIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXNwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHBlb3BsZUlkLmluZGV4T2YocmVzcFtpXS51c2VyMmlkKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHBlb3BsZUlkLnB1c2gocmVzcFtpXS51c2VyMmlkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBlb3BsZSA9IFtdXG4gICAgICAgIGNvbnNvbGUubG9nKCdUaGlzIHNob3VsZCBhbHNvIGJlIHBlb3BsZWVlJyxwZW9wbGVJZCk7XG4gICAgICAgIHZhciBrZXlJZD17fTtcbiAgICAgICAgcGVvcGxlSWQuZm9yRWFjaChmdW5jdGlvbihhKSB7XG5cbiAgICAgICAgICBjb24ucXVlcnkoJ1NFTEVDVCB1c2VybmFtZSBGUk9NIHVzZXJzIFdIRVJFIGlkID0gPycsIGEsIGZ1bmN0aW9uKGVyciwgcmVzcG8pIHtcbiAgXHQgICAgICAgIGtleUlkW2FdPXJlc3BvWzBdLnVzZXJuYW1lO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3RoaXMgaXMgT05FIG9mIHRoZSBwZW9wbGUhIScscmVzcG9bMF0udXNlcm5hbWUpXG4gICAgICAgICAgICBjb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gcmF0aW5ncyBXSEVSRSB1c2VyaWQgPScrJ1wiJythKydcIicsIGZ1bmN0aW9uKGVyciwgcmUpIHtcbiAgICAgIFx0ICAgICAgY29uc29sZS5sb2coJ3RoaXMgaXMgYScsYSlcbiAgICAgIFx0ICAgICAgaWYgKHJlLmxlbmd0aD09PTApe1xuICAgICAgXHRcdCAgICAgIHJlPVt7dXNlcmlkOmEsbW92aWVpZDpNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkqMTAwMDApLHNjb3JlOjk5fV1cbiAgICAgIFx0ICAgICAgfVxuICAgICAgXHQgICAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgYmUgdGhlIHJhdGluZ3MgZnJvbSBlYWNoIHBlcnNvbiEhJyxyZSk7XG5cbiAgICAgICAgICAgICAgcGVvcGxlLnB1c2gocmUubWFwKGZ1bmN0aW9uKGEpe3JldHVybiBbYS51c2VyaWQsYS5tb3ZpZWlkLGEuc2NvcmVdO30pKTtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIGlmIChwZW9wbGUubGVuZ3RoPT09cGVvcGxlSWQubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICB2YXIgZmluYWwgPSB7fTtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBiZSBwZW9wbGUnLCBwZW9wbGUpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGVvcGxlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICBpZiAocGVvcGxlW2ldWzBdIT09dW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICAgICAgZmluYWxba2V5SWRbcGVvcGxlW2ldWzBdWzBdXV0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBwZW9wbGVbaV0ubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICBmaW5hbFtrZXlJZFtwZW9wbGVbaV1bMF1bMF1dXS5wdXNoKFtdKTtcbiAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB6ID0gMTsgeiA8IHBlb3BsZVtpXVt4XS5sZW5ndGg7IHorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxba2V5SWRbcGVvcGxlW2ldWzBdWzBdXV1beF0ucHVzaChwZW9wbGVbaV1beF1bel0pXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZpbmFsJyxmaW5hbCx1c2Vyc1JhdGluZ3MpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGNvbXBhcmlzb25zPXt9O1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBmaW5hbCl7XG4gICAgICAgICAgICAgICAgICBjb21wYXJpc29uc1trZXldPWNvbXAodXNlcnNSYXRpbmdzLGZpbmFsW2tleV0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvbXBhcmlzb25zKTtcbiAgICAgICAgICAgICAgICB2ZXJ5RmluYWw9W107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGNvbXBhcmlzb25zKXtcbiAgICAgICAgICAgICAgICAgIHZlcnlGaW5hbC5wdXNoKFtrZXksY29tcGFyaXNvbnNba2V5XV0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHZlcnlGaW5hbCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQodmVyeUZpbmFsKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn07XG5cblxuXG4vL1RCRFxuZXhwb3J0cy5nZXRIaWdoQ29tcGF0aWJpbGl0eVVzZXJzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgXG59O1xuXG5cbi8vVEJEXG5leHBvcnRzLmdldFJlY29tbWVuZGVkTW92aWVzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcblxufTsiXX0=
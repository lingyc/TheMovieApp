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

// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "12345",
//   database: "MainDatabase"
// });

var con = mysql.createConnection({
  host: 'us-cdbr-iron-east-04.cleardb.net',
  user: 'b41928aa9d6e3c',
  password: '5a72009f',
  database: 'heroku_75e4ff295c2758d'
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
  var requestType = "friend";

  if (movie === '') {
    con.query('UPDATE allrequests SET response=' + '"' + 'yes' + '"' + '  WHERE requestor = ' + '"' + requestor + '"' + ' AND requestTyp=' + '"' + requestType + '"', function (err, res) {
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
  } else {
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
  }
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
  var requestType = 'friend';

  if (movie === '') {
    con.query('UPDATE allrequests SET response=' + '"' + 'no' + '"' + ' WHERE requestor = ' + '"' + requestor + '"' + ' AND requestTyp=' + '"' + requestType + '"', function (err, res) {
      if (err) throw err;
      console.log('Last insert ID:', res.insertId);
      response.send(requestor + 'deleted');
    });
  } else {
    con.query('UPDATE allrequests SET response=' + '"' + 'no' + '"' + ' WHERE requestor = ' + '"' + requestor + '"' + ' AND requestee=' + '"' + requestee + '"' + ' AND movie =' + '"' + movie + '"', function (err, res) {
      if (err) throw err;
      console.log('Last insert ID:', res.insertId);
      response.send(requestor + 'deleted');
    });
  }

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9yZXF1ZXN0LWhhbmRsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQSxJQUFJLFNBQVEsU0FBUixNQUFRLENBQVMsSUFBVCxFQUFjLElBQWQsRUFBbUI7QUFDL0IsTUFBSSxPQUFLLEtBQUssR0FBTCxDQUFTLE9BQUssSUFBZCxDQUFUO0FBQ0EsU0FBTyxJQUFFLElBQVQ7QUFDQyxDQUhEOztBQUtBLElBQUksT0FBTyxTQUFQLElBQU8sQ0FBUyxLQUFULEVBQWdCLE1BQWhCLEVBQXdCO0FBQ25DLE1BQUksUUFBTyxFQUFYO0FBQ0UsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFHLE1BQU0sTUFBekIsRUFBaUMsR0FBakMsRUFBc0M7O0FBRXBDLFNBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxPQUFPLE1BQTNCLEVBQW1DLEdBQW5DLEVBQXdDOztBQUV0QyxVQUFJLE1BQU0sQ0FBTixFQUFTLENBQVQsTUFBZ0IsT0FBTyxDQUFQLEVBQVUsQ0FBVixDQUFwQixFQUFrQzs7QUFFcEMsY0FBTSxJQUFOLENBQVcsT0FBTyxNQUFNLENBQU4sRUFBUyxDQUFULENBQVAsRUFBbUIsT0FBTyxDQUFQLEVBQVUsQ0FBVixDQUFuQixDQUFYO0FBRUc7QUFDRjtBQUNGO0FBQ0gsTUFBSSxNQUFLLE1BQU0sTUFBTixDQUFhLFVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYTtBQUFDLFdBQU8sSUFBRSxDQUFUO0FBQVcsR0FBdEMsRUFBdUMsQ0FBdkMsQ0FBVDtBQUNBLFNBQU8sS0FBSyxLQUFMLENBQVcsS0FBRyxHQUFILEdBQU8sTUFBTSxNQUF4QixDQUFQO0FBQ0MsQ0FmRDs7Ozs7QUF3QkEsSUFBSSxLQUFLLFFBQVEscUJBQVIsQ0FBVDtBQUNBLElBQUksUUFBUSxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUksVUFBVSxRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQUksUUFBUSxRQUFRLHFCQUFSLENBQVo7QUFDQSxJQUFJLFNB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REQ7QUF5REQsS0E1REQ7QUE2REQsR0FqRUQ7QUFrRUQsQ0FyRUQ7OztBQTBFQSxRQUFRLHlCQUFSLEdBQW9DLFVBQVMsR0FBVCxFQUFjLEdBQWQsRUFBbUIsQ0FFdEQsQ0FGRDs7O0FBTUEsUUFBUSxvQkFBUixHQUErQixVQUFTLEdBQVQsRUFBYyxHQUFkLEVBQW1CLENBRWpELENBRkQiLCJmaWxlIjoicmVxdWVzdC1oYW5kbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vLy8vLy8vLy8vLy9UaGUgYWxnb3JpdGhtXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbnZhciBoZWxwZXI9IGZ1bmN0aW9uKG51bTEsbnVtMil7XG52YXIgZGlmZj1NYXRoLmFicyhudW0xLW51bTIpO1xucmV0dXJuIDUtZGlmZjtcbn1cblxudmFyIGNvbXAgPSBmdW5jdGlvbihmaXJzdCwgc2Vjb25kKSB7XG52YXIgZmluYWw9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpPCBmaXJzdC5sZW5ndGg7IGkrKykge1xuXG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCBzZWNvbmQubGVuZ3RoOyB4KyspIHtcblxuICAgICAgaWYgKGZpcnN0W2ldWzBdID09PSBzZWNvbmRbeF1bMF0pIHtcblxuICAgIGZpbmFsLnB1c2goaGVscGVyKGZpcnN0W2ldWzFdLHNlY29uZFt4XVsxXSkpXG5cbiAgICAgIH1cbiAgICB9XG4gIH1cbnZhciBzdW09IGZpbmFsLnJlZHVjZShmdW5jdGlvbihhLGIpe3JldHVybiBhK2J9LDApO1xucmV0dXJuIE1hdGgucm91bmQoMjAqc3VtL2ZpbmFsLmxlbmd0aClcbn1cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cblxuXG5cbnZhciBkYiA9IHJlcXVpcmUoJy4uL2FwcC9kYkNvbm5lY3Rpb24nKTtcbnZhciBteXNxbCA9IHJlcXVpcmUoJ215c3FsJyk7XG52YXIgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcbnZhciBNb3ZpZSA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvbW92aWUnKTtcbnZhciBSYXRpbmcgPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL3JhdGluZycpO1xudmFyIFJlbGF0aW9uID0gcmVxdWlyZSgnLi4vYXBwL21vZGVscy9yZWxhdGlvbicpO1xudmFyIFVzZXIgPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL3VzZXInKTtcbnZhciBhbGxSZXF1ZXN0ID0gcmVxdWlyZSgnLi4vYXBwL21vZGVscy9hbGxSZXF1ZXN0Jyk7XG5cbnZhciBNb3ZpZXMgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvbW92aWVzJyk7XG52YXIgUmF0aW5ncyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy9yYXRpbmdzJyk7XG52YXIgUmVsYXRpb25zID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL3JlbGF0aW9ucycpO1xudmFyIFVzZXJzID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL3VzZXJzJyk7XG52YXIgYWxsUmVxdWVzdHMgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvYWxsUmVxdWVzdHMnKTtcblxudmFyIFByb21pc2UgPSByZXF1aXJlKFwiYmx1ZWJpcmRcIik7XG52YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QnKTtcblxuLy8gdmFyIGNvbiA9IG15c3FsLmNyZWF0ZUNvbm5lY3Rpb24oe1xuLy8gICBob3N0OiBcImxvY2FsaG9zdFwiLFxuLy8gICB1c2VyOiBcInJvb3RcIixcbi8vICAgcGFzc3dvcmQ6IFwiMTIzNDVcIixcbi8vICAgZGF0YWJhc2U6IFwiTWFpbkRhdGFiYXNlXCJcbi8vIH0pO1xuXG52YXIgY29uID0gbXlzcWwuY3JlYXRlQ29ubmVjdGlvbih7XG4gIGhvc3QgICAgIDogJ3VzLWNkYnItaXJvbi1lYXN0LTA0LmNsZWFyZGIubmV0JyxcbiAgdXNlciAgICAgOiAnYjQxOTI4YWE5ZDZlM2MnLFxuICBwYXNzd29yZCA6ICc1YTcyMDA5ZicsXG4gIGRhdGFiYXNlIDogJ2hlcm9rdV83NWU0ZmYyOTVjMjc1OGQnXG59KTtcblxuY29uLmNvbm5lY3QoZnVuY3Rpb24oZXJyKXtcbiAgaWYoZXJyKXtcbiAgICBjb25zb2xlLmxvZygnRXJyb3IgY29ubmVjdGluZyB0byBEYicpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zb2xlLmxvZygnQ29ubmVjdGlvbiBlc3RhYmxpc2hlZCcpO1xufSk7XG5cbi8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vdXNlciBhdXRoXG4vLy8vLy8vLy8vLy8vLy8vL1xuXG5leHBvcnRzLnNpZ251cFVzZXIgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXHRjb25zb2xlLmxvZygnY2FsbGluZyBsb2dpbicsIHJlcS5ib2R5KTtcblx0Ly8gY29uc29sZS5sb2coJ3RoaXMgaXMgdGhlIHNlc3Npb24nLHJlcS5zZXNzaW9uKVxuICBuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEuYm9keS5uYW1lIH0pLmZldGNoKCkudGhlbihmdW5jdGlvbihmb3VuZCkge1xuXHQgIGlmIChmb3VuZCkge1xuXHQgIFx0Ly9jaGVjayBwYXNzd29yZFxuXHQgIFx0ICAgLy9pZiAocGFzc3dvcmQgbWF0Y2hlcylcblx0ICBcdCAgIC8veyBhZGQgc2Vzc2lvbnMgYW5kIHJlZGlyZWN0fVxuXHQgIFx0Y29uc29sZS5sb2coJ3VzZXJuYW1lIGFscmVhZHkgZXhpc3QsIGNhbm5vdCBzaWdudXAgJywgcmVxLmJvZHkubmFtZSk7XG5cdCAgICByZXMuc3RhdHVzKDQwMykuc2VuZCgndXNlcm5hbWUgZXhpc3QnKTtcblx0ICB9IGVsc2Uge1xuXHQgIFx0Y29uc29sZS5sb2coJ2NyZWF0aW5nIHVzZXInKTtcbiAgICAgIHJlcS5teVNlc3Npb24udXNlciA9IHJlcS5ib2R5Lm5hbWU7XG5cdCAgICBVc2Vycy5jcmVhdGUoe1xuXHQgICAgICB1c2VybmFtZTogcmVxLmJvZHkubmFtZSxcblx0ICAgICAgcGFzc3dvcmQ6IHJlcS5ib2R5LnBhc3N3b3JkLFxuXHQgICAgfSlcblx0ICAgIC50aGVuKGZ1bmN0aW9uKHVzZXIpIHtcblx0XHQgIFx0Y29uc29sZS5sb2coJ2NyZWF0ZWQgYSBuZXcgdXNlcicpO1xuXHQgICAgICByZXMuc3RhdHVzKDIwMSkuc2VuZCgnbG9naW4gY3JlYXRlZCcpO1xuXHQgICAgfSk7XG5cdCAgfVxuXHR9KTtcbn07XG5cblxuZXhwb3J0cy5zZW5kV2F0Y2hSZXF1ZXN0ID0gZnVuY3Rpb24ocmVxLCByZXNwb25zZSkge1xuXHRjb25zb2xlLmxvZyhyZXEuYm9keS5yZXF1ZXN0ZWUpXG5cdGlmIChBcnJheS5pc0FycmF5KHJlcS5ib2R5LnJlcXVlc3RlZSkpIHtcblx0XHR2YXIgcmVxdWVzdGVlcyA9IHJlcS5ib2R5LnJlcXVlc3RlZTtcblx0fSBlbHNlIHtcblx0XHR2YXIgcmVxdWVzdGVlcyA9IFtyZXEuYm9keS5yZXF1ZXN0ZWVdO1xuXHR9XG5cdFByb21pc2UuZWFjaChyZXF1ZXN0ZWVzLCBmdW5jdGlvbihyZXF1ZXN0ZWUpe1xuXHRcdHZhciByZXF1ZXN0ID0ge1xuICAgICAgbWVzc2FnZTogcmVxLmJvZHkubWVzc2FnZSxcblx0XHRcdHJlcXVlc3RvcjogcmVxLm15U2Vzc2lvbi51c2VyLCBcblx0XHRcdHJlcXVlc3RUeXA6J3dhdGNoJyxcblx0XHRcdG1vdmllOnJlcS5ib2R5Lm1vdmllLFxuXHRcdFx0cmVxdWVzdGVlOiByZXF1ZXN0ZWVcblx0XHR9O1xuXHRcdGNvbi5xdWVyeSgnSU5TRVJUIElOVE8gYWxscmVxdWVzdHMgU0VUID8nLCByZXF1ZXN0LCBmdW5jdGlvbihlcnIscmVzKXtcblx0XHQgIGlmKGVycikgdGhyb3cgZXJyO1xuXHRcdCAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XG5cdFx0fSk7XG5cdH0pXG5cdC50aGVuKGZ1bmN0aW9uKGRvbmUpe1xuXHRcdHJlc3BvbnNlLnNlbmQoJ1RoYXRzIG15IHN0eWxlIScpO1xuXHR9KVxufVxuXG5leHBvcnRzLnJlbW92ZVdhdGNoUmVxdWVzdCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHJlcS5ib2R5LnJlcXVlc3RlZSkpIHtcbiAgICB2YXIgcmVxdWVzdGVlcyA9IHJlcS5ib2R5LnJlcXVlc3RlZTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgcmVxdWVzdGVlcyA9IFtyZXEuYm9keS5yZXF1ZXN0ZWVdO1xuICB9XG4gIHZhciByZXF1ZXN0b3I9cmVxLmJvZHkucmVxdWVzdG9yO1xuICB2YXIgbW92aWUgPSByZXEuYm9keS5tb3ZpZTtcblxuICBhbGxSZXF1ZXN0LmZvcmdlKHtyZXF1ZXN0b3I6IHJlcXVlc3RvciwgcmVxdWVzdGVlOiByZXF1ZXN0ZWVzLCBtb3ZpZTogbW92aWUgfSlcbiAgICAuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGFsbFJlcXVlc3QpIHtcbiAgICAgIGFsbFJlcXVlc3QuZGVzdHJveSgpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJlcy5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6ICdVc2VyIHN1Y2Nlc3NmdWxseSBkZWxldGVkJ319KTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xuICAgICAgICB9KTtcbiAgICB9KVxuICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xuICAgIH0pO1xufTtcblxuXG5leHBvcnRzLnNlbmRSZXF1ZXN0ID0gZnVuY3Rpb24ocmVxLCByZXNwb25zZSkge1xuICBjb25zb2xlLmxvZygndGhpcyBpcyB3aGF0IEltIGdldHRpbmcnLCByZXEuYm9keSk7XG4gIGlmIChyZXEubXlTZXNzaW9uLnVzZXI9PT1yZXEuYm9keS5uYW1lKXtcbiAgICByZXNwb25zZS5zZW5kKFwiWW91IGNhbid0IGZyaWVuZCB5b3Vyc2VsZiFcIilcbiAgfSBlbHNlIHtcblxudmFyIHJlcXVlc3QgPSB7cmVxdWVzdG9yOiByZXEubXlTZXNzaW9uLnVzZXIsIHJlcXVlc3RlZTogcmVxLmJvZHkubmFtZSwgcmVxdWVzdFR5cDonZnJpZW5kJ307XG5cbmNvbi5xdWVyeSgnU0VMRUNUIHJlcXVlc3RlZSxyZXNwb25zZSBGUk9NIGFsbHJlcXVlc3RzIFdIRVJFICByZXF1ZXN0b3IgPSA/IEFORCByZXF1ZXN0VHlwID0nKydcIicrICdmcmllbmQnKydcIicsIHJlcXVlc3RbJ3JlcXVlc3RvciddLCBmdW5jdGlvbihlcnIscmVzKXtcbmlmIChyZXMgPT09IHVuZGVmaW5lZCkge1xuICByZXNwb25zZS5zZW5kKCdubyBmcmllbmRzJylcbn1cbnZhciB0ZXN0PXJlcy5maWx0ZXIoZnVuY3Rpb24oYSl7cmV0dXJuIGEucmVzcG9uc2U9PT1udWxsfSlcbnZhciB0ZXN0Mj10ZXN0Lm1hcChmdW5jdGlvbihhKXsgcmV0dXJuIGEucmVxdWVzdGVlfSlcbmNvbnNvbGUubG9nKCduYW1lcyBvZiBwZW9wbGUgd2hvbSBJdmUgcmVxdWVzdGVkIGFzIGZyaWVuZHMnLHRlc3QpO1xuXG5cblxuY29uLnF1ZXJ5KCdJTlNFUlQgSU5UTyBhbGxyZXF1ZXN0cyBTRVQgPycsIHJlcXVlc3QsIGZ1bmN0aW9uKGVycixyZXNwKXtcbiAgaWYoZXJyKSB0aHJvdyBlcnI7XG4gIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXNwLmluc2VydElkKTtcbiAgcmVzcG9uc2Uuc2VuZCh0ZXN0Mik7XG59KVxufSk7XG5cbiB9XG59O1xuXG5cblxuXG5cblxuXG5cblxuZXhwb3J0cy5saXN0UmVxdWVzdHMgPSBmdW5jdGlvbihyZXEsIHJlc3BvbnNlKSB7XG4gIHZhciByZXF1ZXN0ID0gcmVxLm15U2Vzc2lvbi51c2VyXG5cbiAgY29uLnF1ZXJ5KCdTZWxlY3QgKiBGUk9NIGFsbHJlcXVlc3RzIFdIRVJFIHJlcXVlc3RlZT0nKydcIicrcmVxdWVzdCsnXCInKycnKydPUiByZXF1ZXN0b3IgPScrJ1wiJytyZXF1ZXN0KydcIicrJycsIGZ1bmN0aW9uKGVycixyZXMpe1xuICBpZihlcnIpIHRocm93IGVycjtcbiAgY29uc29sZS5sb2cocmVzKVxuICByZXNwb25zZS5zZW5kKFtyZXMscmVxdWVzdF0pO1xufSk7XG5cblxufTtcblxuZXhwb3J0cy5hY2NlcHQgPSBmdW5jdGlvbihyZXEsIHJlc3BvbnNlKSB7XG4gIHZhciByZXF1ZXN0b3I9cmVxLmJvZHkucGVyc29uVG9BY2NlcHQ7XG4gIHZhciByZXF1ZXN0ZWU9cmVxLm15U2Vzc2lvbi51c2VyO1xuICB2YXIgbW92aWUgPSByZXEuYm9keS5tb3ZpZTtcbiAgdmFyIHJlcXVlc3RUeXBlID0gXCJmcmllbmRcIjtcblxuICBpZiAobW92aWUgPT09ICcnKSB7XG4gICAgY29uLnF1ZXJ5KCdVUERBVEUgYWxscmVxdWVzdHMgU0VUIHJlc3BvbnNlPScrJ1wiJyArICd5ZXMnICsgJ1wiJysnICBXSEVSRSByZXF1ZXN0b3IgPSAnKydcIicrIHJlcXVlc3RvcisnXCInKycgQU5EIHJlcXVlc3RUeXA9JysnXCInK3JlcXVlc3RUeXBlKydcIicsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XG4gICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xuICAgIH0pO1xuXG4gIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgcmVxLmJvZHkucGVyc29uVG9BY2NlcHQsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XG4gICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXNbMF0uaWQsIGVycik7XG4gICAgdmFyIHBlcnNvbjEgPSByZXNbMF0uaWQ7XG4gICAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCByZXEubXlTZXNzaW9uLnVzZXIsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xuICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlc3BbMF0uaWQsIGVycik7XG5cbiAgICAgIHZhciBwZXJzb24yID0gcmVzcFswXS5pZDtcbiAgICAgIHZhciByZXF1ZXN0ID0ge1xuICAgICAgICB1c2VyMWlkOiBwZXJzb24xLFxuICAgICAgICB1c2VyMmlkOiBwZXJzb24yXG4gICAgICB9XG4gICAgICB2YXIgcmVxdWVzdDIgPSB7XG4gICAgICAgIHVzZXIxaWQ6IHBlcnNvbjIsXG4gICAgICAgIHVzZXIyaWQ6IHBlcnNvbjFcbiAgICAgIH1cblxuICAgICAgY29uc29sZS5sb2coJ3RoZSByZXF1ZXN0czo6OicscmVxdWVzdCxyZXF1ZXN0MilcbiAgICAgIGNvbi5xdWVyeSgnSU5TRVJUIElOVE8gcmVsYXRpb25zIFNFVCA/JywgcmVxdWVzdCwgZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcblxuICAgICAgY29uLnF1ZXJ5KCdJTlNFUlQgSU5UTyByZWxhdGlvbnMgU0VUID8nLCByZXF1ZXN0MiwgZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xuXG4gICAgICAgICAgIHJlc3BvbnNlLnNlbmQoJ1RoYXRzIG15IHN0eWxlISEhJyk7XG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgICB9KVxuICB9KVxuICB9IGVsc2Uge1xuICBjb25zb2xlLmxvZygndGhpcyBpcyByZXEgYm9keSAnLHJlcS5ib2R5KTtcblxuICBjb24ucXVlcnkoJ1VQREFURSBhbGxyZXF1ZXN0cyBTRVQgcmVzcG9uc2U9JysnXCInICsgJ3llcycgKyAnXCInKycgIFdIRVJFIHJlcXVlc3RvciA9ICcrJ1wiJysgcmVxdWVzdG9yKydcIicrJyBBTkQgbW92aWU9JysnXCInKyBtb3ZpZSsnXCInLCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xuICB9KTtcblxuICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIHJlcS5ib2R5LnBlcnNvblRvQWNjZXB0LCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzWzBdLmlkLCBlcnIpO1xuICAgIHZhciBwZXJzb24xID0gcmVzWzBdLmlkO1xuICAgIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgcmVxLm15U2Vzc2lvbi51c2VyLCBmdW5jdGlvbihlcnIsIHJlc3ApIHtcbiAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXNwWzBdLmlkLCBlcnIpO1xuXG4gICAgICB2YXIgcGVyc29uMiA9IHJlc3BbMF0uaWQ7XG4gICAgICB2YXIgcmVxdWVzdCA9IHtcbiAgICAgICAgdXNlcjFpZDogcGVyc29uMSxcbiAgICAgICAgdXNlcjJpZDogcGVyc29uMlxuICAgICAgfVxuICAgICAgdmFyIHJlcXVlc3QyID0ge1xuICAgICAgICB1c2VyMWlkOiBwZXJzb24yLFxuICAgICAgICB1c2VyMmlkOiBwZXJzb24xXG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUubG9nKCd0aGUgcmVxdWVzdHM6OjonLHJlcXVlc3QscmVxdWVzdDIpXG4gICAgICBjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIHJlbGF0aW9ucyBTRVQgPycsIHJlcXVlc3QsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XG5cbiAgICAgIGNvbi5xdWVyeSgnSU5TRVJUIElOVE8gcmVsYXRpb25zIFNFVCA/JywgcmVxdWVzdDIsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcblxuICAgICAgICAgICByZXNwb25zZS5zZW5kKCdUaGF0cyBteSBzdHlsZSEhIScpO1xuICAgICAgICB9KVxuICAgICAgfSk7XG4gICAgfSlcbiAgfSlcbn1cbiAgLy8gYWxsUmVxdWVzdC5mb3JnZSh7cmVxdWVzdG9yOiByZXF1ZXN0b3IsIHJlcXVlc3RlZTogcmVxdWVzdGVlfSlcbiAgLy8gICAuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGFsbFJlcXVlc3QpIHtcbiAgLy8gICAgIGFsbFJlcXVlc3QuZGVzdHJveSgpXG4gIC8vICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAvLyAgICAgICAgIHJlc3BvbnNlLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogJ1VzZXIgc3VjY2Vzc2Z1bGx5IGRlbGV0ZWQnfX0pO1xuICAvLyAgICAgICB9KVxuICAvLyAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gIC8vICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcbiAgLy8gICAgICAgfSk7XG4gIC8vICAgfSlcbiAgLy8gICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gIC8vICAgICByZXNwb25zZS5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xuICAvLyAgIH0pO1xufTtcblxuZXhwb3J0cy5yZW1vdmVSZXF1ZXN0ID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgdmFyIHJlcXVlc3Rvcj1yZXEuYm9keS5yZXF1ZXN0b3I7XG4gIHZhciByZXF1ZXN0ZWU9cmVxLmJvZHkucmVxdWVzdGVlO1xuXG4gIGFsbFJlcXVlc3QuZm9yZ2Uoe3JlcXVlc3RvcjogcmVxdWVzdG9yLCByZXF1ZXN0ZWU6IHJlcXVlc3RlZX0pXG4gICAgLmZldGNoKCkudGhlbihmdW5jdGlvbihhbGxSZXF1ZXN0KSB7XG4gICAgICBhbGxSZXF1ZXN0LmRlc3Ryb3koKVxuICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXMuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiAnVXNlciBzdWNjZXNzZnVsbHkgZGVsZXRlZCd9fSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiByZXEuYm9keX19KTtcbiAgICAgICAgfSk7XG4gICAgfSlcbiAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiByZXEuYm9keX19KTtcbiAgICB9KTtcbn1cblxuZXhwb3J0cy5nZXRUaGlzRnJpZW5kc01vdmllcz1mdW5jdGlvbihyZXEscmVzcG9uc2Upe1xuXG4gIHZhciBtb3ZpZXM9W107XG4gIGNvbnNvbGUubG9nKHJlcS5ib2R5LnNwZWNpZmljRnJpZW5kKTtcbiAgdmFyIHBlcnNvbj1yZXEuYm9keS5zcGVjaWZpY0ZyaWVuZFxuICB2YXIgaWQ9bnVsbFxuICB2YXIgbGVuPW51bGw7XG4gIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgcGVyc29uLCBmdW5jdGlvbihlcnIsIHJlc3Ape1xuY29uc29sZS5sb2cocmVzcClcbmlkPXJlc3BbMF0uaWQ7XG5cblxuY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHJhdGluZ3MgV0hFUkUgdXNlcmlkID0gPycsIGlkICxmdW5jdGlvbihlcnIscmVzcCl7XG5jb25zb2xlLmxvZygnZXJycnJycnJycicsZXJyLHJlc3AubGVuZ3RoKVxubGVuPXJlc3AubGVuZ3RoO1xucmVzcC5mb3JFYWNoKGZ1bmN0aW9uKGEpe1xuXG5jb24ucXVlcnkoJ1NFTEVDVCB0aXRsZSBGUk9NIG1vdmllcyBXSEVSRSBpZCA9ID8nLCBhLm1vdmllaWQgLGZ1bmN0aW9uKGVycixyZXNwKXtcbiAgY29uc29sZS5sb2cocmVzcClcbm1vdmllcy5wdXNoKFtyZXNwWzBdLnRpdGxlLGEuc2NvcmUsYS5yZXZpZXddKVxuY29uc29sZS5sb2cobW92aWVzKVxuaWYgKG1vdmllcy5sZW5ndGg9PT1sZW4pe1xuICByZXNwb25zZS5zZW5kKG1vdmllcyk7XG59XG59KVxuXG59KVxuXG59KVxuXG5cbiAgfVxuXG4pfVxuXG5leHBvcnRzLmZpbmRNb3ZpZUJ1ZGRpZXM9ZnVuY3Rpb24ocmVxLHJlc3BvbnNlKXtcbiAgY29uc29sZS5sb2coXCJ5b3UncmUgdHJ5aW5nIHRvIGZpbmQgYnVkZGllcyEhXCIpO1xuY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHVzZXJzJyxmdW5jdGlvbihlcnIscmVzcCl7XG4gIHZhciBwZW9wbGU9cmVzcC5tYXAoZnVuY3Rpb24oYSl7cmV0dXJuIGEudXNlcm5hbWV9KVxuICB2YXIgSWRzPSByZXNwLm1hcChmdW5jdGlvbihhKXtyZXR1cm4gYS5pZH0pXG4gIHZhciBpZEtleU9iaj17fVxuZm9yICh2YXIgaT0wO2k8SWRzLmxlbmd0aDtpKyspe1xuICBpZEtleU9ialtJZHNbaV1dPXBlb3BsZVtpXVxufVxuY29uc29sZS5sb2coJ2N1cnJlbnQgdXNlcicscmVxLm15U2Vzc2lvbi51c2VyKTtcbnZhciBjdXJyZW50VXNlcj1yZXEubXlTZXNzaW9uLnVzZXJcblxuXG4gdmFyIG9iajE9e307XG4gIGZvciAodmFyIGk9MDtpPElkcy5sZW5ndGg7aSsrKXtcbm9iajFbaWRLZXlPYmpbSWRzW2ldXV09W107XG4gIH1cblxuICBjb24ucXVlcnkoJ1NFTEVDVCBzY29yZSxtb3ZpZWlkLHVzZXJpZCBGUk9NIHJhdGluZ3MnLGZ1bmN0aW9uKGVycixyZXNwb24pe1xuICBcbmZvciAodmFyIGk9MDtpPHJlc3Bvbi5sZW5ndGg7aSsrKXtcbiAgb2JqMVtpZEtleU9ialtyZXNwb25baV0udXNlcmlkXV0ucHVzaChbcmVzcG9uW2ldLm1vdmllaWQscmVzcG9uW2ldLnNjb3JlXSlcbn1cblxuY29uc29sZS5sb2coJ29iajEnLG9iajEpO1xuY3VycmVudFVzZXJJbmZvPW9iajFbY3VycmVudFVzZXJdXG4vL2NvbnNvbGUubG9nKCdjdXJyZW50VXNlckluZm8nLGN1cnJlbnRVc2VySW5mbylcbnZhciBjb21wYXJpc29ucz17fVxuXG5mb3IgKHZhciBrZXkgaW4gb2JqMSl7XG4gIGlmIChrZXkhPT1jdXJyZW50VXNlcikge1xuICAgIGNvbXBhcmlzb25zW2tleV09Y29tcChjdXJyZW50VXNlckluZm8sb2JqMVtrZXldKVxuICB9XG59XG5jb25zb2xlLmxvZyhjb21wYXJpc29ucylcbnZhciBmaW5hbFNlbmQ9W11cbmZvciAodmFyIGtleSBpbiBjb21wYXJpc29ucyl7XG4gIGlmIChjb21wYXJpc29uc1trZXldICE9PSAnTmFOJScpIHtcbiAgZmluYWxTZW5kLnB1c2goW2tleSxjb21wYXJpc29uc1trZXldXSk7XG59IGVsc2UgIHtcbiAgZmluYWxTZW5kLnB1c2goW2tleSxcIk5vIENvbXBhcmlzb24gdG8gTWFrZVwiXSlcbn1cblxufVxuXG4gIHJlc3BvbnNlLnNlbmQoZmluYWxTZW5kKVxufSlcbn0pXG59XG5cblxuZXhwb3J0cy5kZWNsaW5lPWZ1bmN0aW9uKHJlcSxyZXNwb25zZSl7XG4gIHZhciByZXF1ZXN0b3I9cmVxLmJvZHkucGVyc29uVG9EZWNsaW5lO1xuICB2YXIgcmVxdWVzdGVlPXJlcS5teVNlc3Npb24udXNlcjtcbiAgdmFyIG1vdmllPXJlcS5ib2R5Lm1vdmllO1xuICB2YXIgcmVxdWVzdFR5cGUgPSAnZnJpZW5kJztcblxuICBpZiAobW92aWUgPT09ICcnKSB7XG4gICAgY29uLnF1ZXJ5KCdVUERBVEUgYWxscmVxdWVzdHMgU0VUIHJlc3BvbnNlPScrJ1wiJyArICdubycgKyAnXCInKyAnIFdIRVJFIHJlcXVlc3RvciA9ICcrJ1wiJysgcmVxdWVzdG9yKydcIicrJyBBTkQgcmVxdWVzdFR5cD0nKydcIicrIHJlcXVlc3RUeXBlKydcIicsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XG4gICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcbiAgICAgIHJlc3BvbnNlLnNlbmQocmVxdWVzdG9yICsgJ2RlbGV0ZWQnKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBjb24ucXVlcnkoJ1VQREFURSBhbGxyZXF1ZXN0cyBTRVQgcmVzcG9uc2U9JysnXCInICsgJ25vJyArICdcIicrICcgV0hFUkUgcmVxdWVzdG9yID0gJysnXCInKyByZXF1ZXN0b3IrJ1wiJysnIEFORCByZXF1ZXN0ZWU9JysnXCInKyByZXF1ZXN0ZWUrJ1wiJysnIEFORCBtb3ZpZSA9JysnXCInK21vdmllKydcIicsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XG4gICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcbiAgICAgIHJlc3BvbnNlLnNlbmQocmVxdWVzdG9yICsgJ2RlbGV0ZWQnKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIGFsbFJlcXVlc3QuZm9yZ2Uoe3JlcXVlc3RvcjogcmVxdWVzdG9yLCByZXF1ZXN0ZWU6IHJlcXVlc3RlZX0pXG4gIC8vICAgLmZldGNoKCkudGhlbihmdW5jdGlvbihhbGxSZXF1ZXN0KSB7XG4gIC8vICAgICBhbGxSZXF1ZXN0LmRlc3Ryb3koKVxuICAvLyAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgLy8gICAgICAgICByZXNwb25zZS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6ICdVc2VyIHN1Y2Nlc3NmdWxseSBkZWxldGVkJ319KTtcbiAgLy8gICAgICAgfSlcbiAgLy8gICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAvLyAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XG4gIC8vICAgICAgIH0pO1xuICAvLyAgIH0pXG4gIC8vICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAvLyAgICAgcmVzcG9uc2Uuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcbiAgLy8gICB9KTtcbn07XG5cbmV4cG9ydHMuc2lnbnVwVXNlciA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIGNvbnNvbGUubG9nKCdjYWxsaW5nIGxvZ2luJywgcmVxLmJvZHkpO1xuICAvLyBjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgc2Vzc2lvbicscmVxLnNlc3Npb24pXG4gIG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUgfSkuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGZvdW5kKSB7XG4gICAgaWYgKGZvdW5kKSB7XG4gICAgICAvL2NoZWNrIHBhc3N3b3JkXG4gICAgICAgICAvL2lmIChwYXNzd29yZCBtYXRjaGVzKVxuICAgICAgICAgLy97IGFkZCBzZXNzaW9ucyBhbmQgcmVkaXJlY3R9XG4gICAgICBjb25zb2xlLmxvZygndXNlcm5hbWUgYWxyZWFkeSBleGlzdCwgY2Fubm90IHNpZ251cCAnLCByZXEuYm9keS5uYW1lKTtcbiAgICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKCd1c2VybmFtZSBleGlzdCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnY3JlYXRpbmcgdXNlcicpO1xuICAgICAgcmVxLm15U2Vzc2lvbi51c2VyID0gcmVxLmJvZHkubmFtZTtcbiAgICAgIFVzZXJzLmNyZWF0ZSh7XG4gICAgICAgIHVzZXJuYW1lOiByZXEuYm9keS5uYW1lLFxuICAgICAgICBwYXNzd29yZDogcmVxLmJvZHkucGFzc3dvcmQsXG4gICAgICB9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24odXNlcikge1xuICAgICAgICBjb25zb2xlLmxvZygnY3JlYXRlZCBhIG5ldyB1c2VyJyk7XG4gICAgICAgIHJlcy5zdGF0dXMoMjAxKS5zZW5kKCdsb2dpbiBjcmVhdGVkJyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufTtcblxuZXhwb3J0cy5zaWduaW5Vc2VyID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcblx0Y29uc29sZS5sb2coJ2NhbGxpbmcgc2lnbmluJywgcmVxLmJvZHkpO1xuXHRuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEuYm9keS5uYW1lIH0pLmZldGNoKCkudGhlbihmdW5jdGlvbihmb3VuZCl7XG5cblx0XHRpZiAoZm91bmQpe1xuXHRcdFx0bmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLmJvZHkubmFtZSwgcGFzc3dvcmQ6cmVxLmJvZHkucGFzc3dvcmR9KS5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oZm91bmQpe1xuXHRcdFx0XHRpZiAoZm91bmQpe1xuXHRcdFx0XHRcdHJlcS5teVNlc3Npb24udXNlciA9IGZvdW5kLmF0dHJpYnV0ZXMudXNlcm5hbWU7XG4gICAgICAgICAgY29uc29sZS5sb2coZm91bmQuYXR0cmlidXRlcy51c2VybmFtZSlcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnd2UgZm91bmQgeW91ISEnKVxuXHRcdFx0XHRcdHJlcy5zZW5kKFsnaXQgd29ya2VkJyxyZXEubXlTZXNzaW9uLnVzZXJdKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXMuc3RhdHVzKDQwNCkuc2VuZCgnYmFkIGxvZ2luJyk7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ3dyb25nIHBhc3N3b3JkJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlcy5zdGF0dXMoNDA0KS5zZW5kKCdiYWQgbG9naW4nKTtcblx0XHRcdGNvbnNvbGUubG9nKCd1c2VyIG5vdCBmb3VuZCcpO1xuXHRcdH1cblxuICB9KSBcblxufVxuXG5leHBvcnRzLmxvZ291dCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cdHJlcS5teVNlc3Npb24uZGVzdHJveShmdW5jdGlvbihlcnIpe1xuXHRcdGNvbnNvbGUubG9nKGVycik7XG5cdH0pO1xuXHRjb25zb2xlLmxvZygnbG9nb3V0Jyk7XG5cdHJlcy5zZW5kKCdsb2dvdXQnKTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vbW92aWUgaGFuZGxlcnNcbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4vL2EgaGFuZGVsZXIgdGhhdCB0YWtlcyBhIHJhdGluZyBmcm9tIHVzZXIgYW5kIGFkZCBpdCB0byB0aGUgZGF0YWJhc2Vcbi8vIGV4cGVjdHMgcmVxLmJvZHkgdG8gaGF2ZSB0aGlzOiB7dGl0bGU6ICduYW1lJywgZ2VucmU6ICdnZW5yZScsIHBvc3RlcjogJ2xpbmsnLCByZWxlYXNlX2RhdGU6ICd5ZWFyJywgcmF0aW5nOiAnbnVtYmVyJ31cbmV4cG9ydHMucmF0ZU1vdmllID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcblx0Y29uc29sZS5sb2coJ2NhbGxpbmcgcmF0ZU1vdmllJyk7XG5cdHZhciB1c2VyaWQ7XG5cdHJldHVybiBuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEubXlTZXNzaW9uLnVzZXIgfSkuZmV0Y2goKVxuXHQudGhlbihmdW5jdGlvbihmb3VuZFVzZXIpIHtcblx0XHR1c2VyaWQgPSBmb3VuZFVzZXIuYXR0cmlidXRlcy5pZDtcblx0XHRyZXR1cm4gbmV3IFJhdGluZyh7IG1vdmllaWQ6IHJlcS5ib2R5LmlkLCB1c2VyaWQ6IHVzZXJpZCB9KS5mZXRjaCgpXG5cdFx0LnRoZW4oZnVuY3Rpb24oZm91bmRSYXRpbmcpIHtcblx0XHRcdGlmIChmb3VuZFJhdGluZykge1xuXHRcdFx0XHQvL3NpbmNlIHJhdGluZyBvciByZXZpZXcgaXMgdXBkYXRlZCBzZXBlcmF0bHkgaW4gY2xpZW50LCB0aGUgZm9sbG93aW5nXG5cdFx0XHRcdC8vbWFrZSBzdXJlIGl0IGdldHMgdXBkYXRlZCBhY2NvcmRpbmcgdG8gdGhlIHJlcVxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZygndXBkYXRlIHJhdGluZycsIGZvdW5kUmF0aW5nKVxuXHRcdFx0XHRpZiAocmVxLmJvZHkucmF0aW5nKSB7XG5cdFx0XHRcdFx0dmFyIHJhdGluZ09iaiA9IHtzY29yZTogcmVxLmJvZHkucmF0aW5nfTtcblx0XHRcdFx0fSBlbHNlIGlmIChyZXEuYm9keS5yZXZpZXcpIHtcblx0XHRcdFx0XHR2YXIgcmF0aW5nT2JqID0ge3JldmlldzogcmVxLmJvZHkucmV2aWV3fTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gbmV3IFJhdGluZyh7J2lkJzogZm91bmRSYXRpbmcuYXR0cmlidXRlcy5pZH0pXG5cdFx0XHRcdFx0LnNhdmUocmF0aW5nT2JqKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdjcmVhdGluZyByYXRpbmcnKTtcblx0XHQgICAgcmV0dXJuIFJhdGluZ3MuY3JlYXRlKHtcblx0XHQgICAgXHRzY29yZTogcmVxLmJvZHkucmF0aW5nLFxuXHRcdCAgICAgIHVzZXJpZDogdXNlcmlkLFxuXHRcdCAgICAgIG1vdmllaWQ6IHJlcS5ib2R5LmlkLFxuXHRcdCAgICAgIHJldmlldzogcmVxLmJvZHkucmV2aWV3XG5cdFx0ICAgIH0pO1x0XHRcdFx0XHRcblx0XHRcdH1cblx0XHR9KTtcblx0fSlcblx0LnRoZW4oZnVuY3Rpb24obmV3UmF0aW5nKSB7XG5cdFx0Y29uc29sZS5sb2coJ3JhdGluZyBjcmVhdGVkOicsIG5ld1JhdGluZy5hdHRyaWJ1dGVzKTtcbiAgXHRyZXMuc3RhdHVzKDIwMSkuc2VuZCgncmF0aW5nIHJlY2lldmVkJyk7XG5cdH0pXG59O1xuXG4vL3RoaXMgaGVscGVyIGZ1bmN0aW9uIGFkZHMgdGhlIG1vdmllIGludG8gZGF0YWJhc2Vcbi8vaXQgZm9sbG93cyB0aGUgc2FtZSBtb3ZpZSBpZCBhcyBUTURCXG4vL2V4cGVjdHMgcmVxLmJvZHkgdG8gaGF2ZSB0aGVzZSBhdHJpYnV0ZSA6IHtpZCwgdGl0bGUsIGdlbnJlLCBwb3N0ZXJfcGF0aCwgcmVsZWFzZV9kYXRlLCBvdmVydmlldywgdm90ZV9hdmVyYWdlfVxudmFyIGFkZE9uZU1vdmllID0gZnVuY3Rpb24obW92aWVPYmopIHtcblx0dmFyIGdlbnJlID0gKG1vdmllT2JqLmdlbnJlX2lkcykgPyBnZW5yZXNbbW92aWVPYmouZ2VucmVfaWRzWzBdXSA6ICduL2EnO1xuICByZXR1cm4gbmV3IE1vdmllKHtcbiAgXHRpZDogbW92aWVPYmouaWQsXG4gICAgdGl0bGU6IG1vdmllT2JqLnRpdGxlLFxuICAgIGdlbnJlOiBnZW5yZSxcbiAgICBwb3N0ZXI6ICdodHRwczovL2ltYWdlLnRtZGIub3JnL3QvcC93MTg1LycgKyBtb3ZpZU9iai5wb3N0ZXJfcGF0aCxcbiAgICByZWxlYXNlX2RhdGU6IG1vdmllT2JqLnJlbGVhc2VfZGF0ZSxcbiAgICBkZXNjcmlwdGlvbjogbW92aWVPYmoub3ZlcnZpZXcuc2xpY2UoMCwgMjU1KSxcbiAgICBpbWRiUmF0aW5nOiBtb3ZpZU9iai52b3RlX2F2ZXJhZ2VcbiAgfSkuc2F2ZShudWxsLCB7bWV0aG9kOiAnaW5zZXJ0J30pXG4gIC50aGVuKGZ1bmN0aW9uKG5ld01vdmllKSB7XG4gIFx0Y29uc29sZS5sb2coJ21vdmllIGNyZWF0ZWQnLCBuZXdNb3ZpZS5hdHRyaWJ1dGVzLnRpdGxlKTtcbiAgXHRyZXR1cm4gbmV3TW92aWU7XG4gIH0pXG59O1xuXG5cbi8vZ2V0IGFsbCBtb3ZpZSByYXRpbmdzIHRoYXQgYSB1c2VyIHJhdGVkXG4vL3Nob3VsZCByZXR1cm4gYW4gYXJyYXkgdGhhdCBsb29rIGxpa2UgdGhlIGZvbGxvd2luZzpcbi8vIFsge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnICwgcG9zdGVyOiAndXJsJywgcmVsZWFzZV9kYXRlOiAnZGF0ZScsIHNjb3JlOiBuLCBmcmllbmRBdmVyYWdlUmF0aW5nOiBufSAuLi4gXVxuLy8gd2lsbCBnZXQgcmF0aW5ncyBmb3IgdGhlIGN1cnJlbnQgdXNlclxuZXhwb3J0cy5nZXRVc2VyUmF0aW5ncyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIFJhdGluZy5xdWVyeShmdW5jdGlvbihxYil7XG4gIFx0cWIuaW5uZXJKb2luKCd1c2VycycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3VzZXJzLmlkJyk7XG4gIFx0cWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XG4gIFx0cWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnLCAncmF0aW5ncy51cGRhdGVkX2F0Jyk7XG4gIFx0cWIud2hlcmUoJ3VzZXJzLnVzZXJuYW1lJywgJz0nLCByZXEubXlTZXNzaW9uLnVzZXIpO1xuICBcdHFiLm9yZGVyQnkoJ3VwZGF0ZWRfYXQnLCAnREVTQycpXG4gIH0pXG4gIC5mZXRjaEFsbCgpXG4gIC50aGVuKGZ1bmN0aW9uKHJhdGluZ3Mpe1xuXHRcdC8vZGVjb3JhdGUgaXQgd2l0aCBhdmcgZnJpZW5kIHJhdGluZ1xuXHRcdHJldHVybiBQcm9taXNlLm1hcChyYXRpbmdzLm1vZGVscywgZnVuY3Rpb24ocmF0aW5nKSB7XG5cdFx0XHRyZXR1cm4gYXR0YWNoRnJpZW5kQXZnUmF0aW5nKHJhdGluZywgcmVxLm15U2Vzc2lvbi51c2VyKTtcblx0XHR9KTtcblx0fSlcbiAgLnRoZW4oZnVuY3Rpb24ocmF0aW5ncykge1xuICBcdGNvbnNvbGUubG9nKCdyZXRyaXZpbmcgYWxsIHVzZXIgcmF0aW5ncycpO1xuICBcdHJlcy5zdGF0dXMoMjAwKS5qc29uKHJhdGluZ3MpO1xuICB9KVxufTtcblxuZXhwb3J0cy5nZXRGcmllbmRVc2VyUmF0aW5ncyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIFJhdGluZy5xdWVyeShmdW5jdGlvbihxYil7XG4gIFx0cWIuaW5uZXJKb2luKCd1c2VycycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3VzZXJzLmlkJyk7XG4gIFx0cWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XG4gIFx0cWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUgYXMgZnJpZW5kU2NvcmUnLCAncmF0aW5ncy5yZXZpZXcgYXMgZnJpZW5kUmV2aWV3JywgJ3JhdGluZ3MudXBkYXRlZF9hdCcpO1xuICBcdHFiLndoZXJlKCd1c2Vycy51c2VybmFtZScsICc9JywgcmVxLnF1ZXJ5LmZyaWVuZE5hbWUpO1xuICBcdHFiLm9yZGVyQnkoJ3VwZGF0ZWRfYXQnLCAnREVTQycpXG4gIH0pXG4gIC5mZXRjaEFsbCgpXG4gIC50aGVuKGZ1bmN0aW9uKHJhdGluZ3Mpe1xuXHRcdC8vZGVjb3JhdGUgaXQgd2l0aCBjdXJyZW50IHVzZXIncyByYXRpbmdcblx0XHRyZXR1cm4gUHJvbWlzZS5tYXAocmF0aW5ncy5tb2RlbHMsIGZ1bmN0aW9uKHJhdGluZykge1xuXHRcdFx0cmV0dXJuIGF0dGFjaFVzZXJSYXRpbmcocmF0aW5nLCByZXEubXlTZXNzaW9uLnVzZXIpO1xuXHRcdH0pO1xuXHR9KVxuICAudGhlbihmdW5jdGlvbihyYXRpbmdzKSB7XG4gIFx0Y29uc29sZS5sb2coJ3JldHJpdmluZyBhbGwgdXNlciByYXRpbmdzJyk7XG4gIFx0cmVzLnN0YXR1cygyMDApLmpzb24ocmF0aW5ncyk7XG4gIH0pXG59O1xuXG4vL2EgZGVjb3JhdG9yIGZ1bmN0aW9uIHRoYXQgYXR0YWNoZXMgZnJpZW5kIGF2ZyByYXRpbmcgdG8gdGhlIHJhdGluZyBvYmpcbnZhciBhdHRhY2hGcmllbmRBdmdSYXRpbmcgPSBmdW5jdGlvbihyYXRpbmcsIHVzZXJuYW1lKSB7XG5cdHJldHVybiBleHBvcnRzLmdldEZyaWVuZFJhdGluZ3ModXNlcm5hbWUsIHJhdGluZylcblx0LnRoZW4oZnVuY3Rpb24oZnJpZW5kc1JhdGluZ3Mpe1xuXHRcdC8vaWYgZnJpZW5kc1JhdGluZ3MgaXMgbnVsbCwgUmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyBpcyBudWxsXG5cdFx0aWYgKCFmcmllbmRzUmF0aW5ncykge1xuXHRcdFx0cmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyA9IG51bGw7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgPSBhdmVyYWdlUmF0aW5nKGZyaWVuZHNSYXRpbmdzKTtcblx0XHR9XG5cdFx0cmV0dXJuIHJhdGluZztcblx0fSlcbn1cblxuLy9hIGRlY29yYXRvciBmdW5jdGlvbiB0aGF0IGF0dGFjaGVzIHVzZXIgcmF0aW5nIGFuZCByZXZpZXdzIHRvIHRoZSByYXRpbmcgb2JqXG52YXIgYXR0YWNoVXNlclJhdGluZyA9IGZ1bmN0aW9uKHJhdGluZywgdXNlcm5hbWUpIHtcblx0cmV0dXJuIFJhdGluZy5xdWVyeShmdW5jdGlvbihxYikge1xuXHRcdHFiLmlubmVySm9pbigndXNlcnMnLCAndXNlcnMuaWQnLCAnPScsICdyYXRpbmdzLnVzZXJpZCcpXG5cdFx0cWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAnbW92aWVzLmlkJywgJz0nLCAncmF0aW5ncy5tb3ZpZWlkJylcblx0XHRxYi5zZWxlY3QoJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnKVxuXHRcdHFiLndoZXJlKHtcblx0XHRcdCd1c2Vycy51c2VybmFtZSc6IHVzZXJuYW1lLFxuXHRcdFx0J21vdmllcy50aXRsZSc6IHJhdGluZy5hdHRyaWJ1dGVzLnRpdGxlLFxuXHRcdFx0J21vdmllcy5pZCc6IHJhdGluZy5hdHRyaWJ1dGVzLmlkXG5cdFx0fSlcblx0fSlcblx0LmZldGNoKClcblx0LnRoZW4oZnVuY3Rpb24odXNlclJhdGluZyl7XG5cdFx0aWYgKHVzZXJSYXRpbmcpIHtcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLnNjb3JlID0gdXNlclJhdGluZy5hdHRyaWJ1dGVzLnNjb3JlO1xuXHRcdFx0cmF0aW5nLmF0dHJpYnV0ZXMucmV2aWV3ID0gdXNlclJhdGluZy5hdHRyaWJ1dGVzLnJldmlldztcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmF0aW5nLmF0dHJpYnV0ZXMuc2NvcmUgPSBudWxsO1xuXHRcdFx0cmF0aW5nLmF0dHJpYnV0ZXMucmV2aWV3ID0gbnVsbDtcblx0XHR9XG5cdFx0cmV0dXJuIHJhdGluZztcblx0fSk7XG59O1xuXG4vL3RoaXMgaXMgYSB3cmFwZXIgZnVuY3Rpb24gZm9yIGdldEZyaWVuZFJhdGluZ3Mgd2hpY2ggd2lsbCBzZW50IHRoZSBjbGllbnQgYWxsIG9mIHRoZSBmcmllbmQgcmF0aW5nc1xuZXhwb3J0cy5oYW5kbGVHZXRGcmllbmRSYXRpbmdzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcblx0Y29uc29sZS5sb2coJ2hhbmRsZUdldEZyaWVuZFJhdGluZ3MsICcsIHJlcS5teVNlc3Npb24udXNlciwgcmVxLmJvZHkubW92aWUudGl0bGUpO1xuXHRleHBvcnRzLmdldEZyaWVuZFJhdGluZ3MocmVxLm15U2Vzc2lvbi51c2VyLCB7YXR0cmlidXRlczogcmVxLmJvZHkubW92aWV9KVxuXHQudGhlbihmdW5jdGlvbihmcmllbmRSYXRpbmdzKXtcblx0XHRyZXMuanNvbihmcmllbmRSYXRpbmdzKTtcblx0fSk7XG59XG5cbi8vdGhpcyBmdW5jdGlvbiBvdXRwdXRzIHJhdGluZ3Mgb2YgYSB1c2VyJ3MgZnJpZW5kIGZvciBhIHBhcnRpY3VsYXIgbW92aWVcbi8vZXhwZWN0IGN1cnJlbnQgdXNlcm5hbWUgYW5kIG1vdmllVGl0bGUgYXMgaW5wdXRcbi8vb3V0cHV0czoge3VzZXIyaWQ6ICdpZCcsIGZyaWVuZFVzZXJOYW1lOiduYW1lJywgZnJpZW5kRmlyc3ROYW1lOiduYW1lJywgdGl0bGU6J21vdmllVGl0bGUnLCBzY29yZTpuIH1cbmV4cG9ydHMuZ2V0RnJpZW5kUmF0aW5ncyA9IGZ1bmN0aW9uKHVzZXJuYW1lLCBtb3ZpZU9iaikge1xuXHRyZXR1cm4gVXNlci5xdWVyeShmdW5jdGlvbihxYil7XG5cdFx0cWIuaW5uZXJKb2luKCdyZWxhdGlvbnMnLCAncmVsYXRpb25zLnVzZXIxaWQnLCAnPScsICd1c2Vycy5pZCcpO1xuXHRcdHFiLmlubmVySm9pbigncmF0aW5ncycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3JlbGF0aW9ucy51c2VyMmlkJyk7XG5cdFx0cWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XG5cdFx0cWIuc2VsZWN0KCdyZWxhdGlvbnMudXNlcjJpZCcsICdtb3ZpZXMudGl0bGUnLCAncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycpO1xuXHRcdHFiLndoZXJlKHtcblx0XHRcdCd1c2Vycy51c2VybmFtZSc6IHVzZXJuYW1lLCBcblx0XHRcdCdtb3ZpZXMudGl0bGUnOiBtb3ZpZU9iai5hdHRyaWJ1dGVzLnRpdGxlLFxuXHRcdFx0J21vdmllcy5pZCc6IG1vdmllT2JqLmF0dHJpYnV0ZXMuaWQgfSk7XG5cdH0pXG5cdC5mZXRjaEFsbCgpXG5cdC50aGVuKGZ1bmN0aW9uKGZyaWVuZHNSYXRpbmdzKXtcblx0Ly90aGUgZm9sbG93aW5nIGJsb2NrIGFkZHMgdGhlIGZyaWVuZE5hbWUgYXR0cmlidXRlIHRvIHRoZSByYXRpbmdzXG5cdFx0cmV0dXJuIFByb21pc2UubWFwKGZyaWVuZHNSYXRpbmdzLm1vZGVscywgZnVuY3Rpb24oZnJpZW5kUmF0aW5nKSB7XG5cdFx0XHRyZXR1cm4gbmV3IFVzZXIoeyBpZDogZnJpZW5kUmF0aW5nLmF0dHJpYnV0ZXMudXNlcjJpZCB9KS5mZXRjaCgpXG5cdFx0XHQudGhlbihmdW5jdGlvbihmcmllbmQpe1xuXHRcdFx0XHRmcmllbmRSYXRpbmcuYXR0cmlidXRlcy5mcmllbmRVc2VyTmFtZSA9IGZyaWVuZC5hdHRyaWJ1dGVzLnVzZXJuYW1lO1xuXHRcdFx0XHRmcmllbmRSYXRpbmcuYXR0cmlidXRlcy5mcmllbmRGaXJzdE5hbWUgPSBmcmllbmQuYXR0cmlidXRlcy5maXJzdE5hbWU7XG5cdFx0XHRcdHJldHVybiBmcmllbmRSYXRpbmc7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSlcblx0LnRoZW4oZnVuY3Rpb24oZnJpZW5kc1JhdGluZ3Mpe1xuXHRcdHJldHVybiBmcmllbmRzUmF0aW5ncztcblx0fSk7XG59O1xuXG5cbi8vYSBoZWxwZXIgZnVuY3Rpb24gdGhhdCBhdmVyYWdlcyB0aGUgcmF0aW5nXG4vL2lucHV0cyByYXRpbmdzLCBvdXRwdXRzIHRoZSBhdmVyYWdlIHNjb3JlO1xudmFyIGF2ZXJhZ2VSYXRpbmcgPSBmdW5jdGlvbihyYXRpbmdzKSB7XG5cdC8vcmV0dXJuIG51bGwgaWYgbm8gZnJpZW5kIGhhcyByYXRlZCB0aGUgbW92aWVcblx0aWYgKHJhdGluZ3MubGVuZ3RoID09PSAwKSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0cmV0dXJuIHJhdGluZ3Ncblx0LnJlZHVjZShmdW5jdGlvbih0b3RhbCwgcmF0aW5nKXtcblx0XHRyZXR1cm4gdG90YWwgKz0gcmF0aW5nLmF0dHJpYnV0ZXMuc2NvcmU7XG5cdH0sIDApIC8gcmF0aW5ncy5sZW5ndGg7XG59XG5cblxuLy9hIGhlbHBlciBmdW5jdGlvbiB0aGF0IG91dHB1dHMgdXNlciByYXRpbmcgYW5kIGF2ZXJhZ2UgZnJpZW5kIHJhdGluZyBmb3Igb25lIG1vdmllXG4vL291dHB1dHMgb25lIHJhdGluZyBvYmo6IHt0aXRsZTogJ25hbWUnLCBnZW5yZTogJ2dlbnJlJyAsIHBvc3RlcjogJ3VybCcsIHJlbGVhc2VfZGF0ZTogJ2RhdGUnLCBzY29yZTogbiwgZnJpZW5kQXZlcmFnZVJhdGluZzogbn1cbnZhciBnZXRPbmVNb3ZpZVJhdGluZyA9IGZ1bmN0aW9uKHVzZXJuYW1lLCBtb3ZpZU9iaikge1xuICByZXR1cm4gUmF0aW5nLnF1ZXJ5KGZ1bmN0aW9uKHFiKXtcbiAgXHRxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcbiAgXHRxYi5pbm5lckpvaW4oJ21vdmllcycsICdyYXRpbmdzLm1vdmllaWQnLCAnPScsICdtb3ZpZXMuaWQnKTtcbiAgXHRxYi5zZWxlY3QoJ3VzZXJzLnVzZXJuYW1lJywgJ21vdmllcy50aXRsZScsICdtb3ZpZXMuaWQnLCAnbW92aWVzLmdlbnJlJywgJ21vdmllcy5wb3N0ZXInLCAnbW92aWVzLnJlbGVhc2VfZGF0ZScsICdtb3ZpZXMuaW1kYlJhdGluZycsICdtb3ZpZXMuZGVzY3JpcHRpb24nLCAncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycpO1xuICBcdHFiLndoZXJlKHsndXNlcnMudXNlcm5hbWUnOiB1c2VybmFtZSwgJ21vdmllcy50aXRsZSc6IG1vdmllT2JqLnRpdGxlLCAnbW92aWVzLmlkJzogbW92aWVPYmouaWR9KTtcbiAgfSlcbiAgLmZldGNoKClcbiAgLnRoZW4oZnVuY3Rpb24ocmF0aW5nKXtcblx0ICBpZiAoIXJhdGluZykge1xuXHQgIFx0Ly9pZiB0aGUgdXNlciBoYXMgbm90IHJhdGVkIHRoZSBtb3ZpZSwgcmV0dXJuIGFuIG9iaiB0aGF0IGhhcyB0aGUgbW92aWUgaW5mb3JtYXRpb24sIGJ1dCBzY29yZSBpcyBzZXQgdG8gbnVsbFxuXHQgIFx0cmV0dXJuIG5ldyBNb3ZpZSh7dGl0bGU6IG1vdmllT2JqLnRpdGxlLCBpZDogbW92aWVPYmouaWR9KS5mZXRjaCgpXG5cdCAgXHQudGhlbihmdW5jdGlvbihtb3ZpZSkge1xuXHQgIFx0XHRtb3ZpZS5hdHRyaWJ1dGVzLnNjb3JlID0gbnVsbDtcblx0ICBcdFx0cmV0dXJuIG1vdmllO1xuXHQgIFx0fSlcblx0ICB9IGVsc2Uge1xuXHQgIFx0cmV0dXJuIHJhdGluZztcblx0ICB9XG5cdH0pXG5cdC50aGVuKGZ1bmN0aW9uKHJhdGluZyl7XG5cdFx0cmV0dXJuIGV4cG9ydHMuZ2V0RnJpZW5kUmF0aW5ncyh1c2VybmFtZSwgcmF0aW5nKVxuXHRcdC50aGVuKGZ1bmN0aW9uKGZyaWVuZHNSYXRpbmdzKXtcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdmcmllbmRzUmF0aW5ncycsIGZyaWVuZHNSYXRpbmdzKTtcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgPSBhdmVyYWdlUmF0aW5nKGZyaWVuZHNSYXRpbmdzKTtcblx0XHRcdGNvbnNvbGUubG9nKCdhZGRlZCBhdmVyYWdlIGZyaWVuZCByYXRpbmcnLCByYXRpbmcuYXR0cmlidXRlcy50aXRsZSwgcmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyk7XG5cdFx0XHRyZXR1cm4gcmF0aW5nO1xuXHRcdH0pO1xuXHR9KTtcbn1cblxuXG4vL3RoaXMgaGFuZGxlciBpcyBzcGVjaWZpY2FsbHkgZm9yIHNlbmRpbmcgb3V0IGEgbGlzdCBvZiBtb3ZpZSByYXRpbmdzIHdoZW4gdGhlIGNsaWVudCBzZW5kcyBhIGxpc3Qgb2YgbW92aWUgdG8gdGhlIHNlcnZlclxuLy9leHBlY3RzIHJlcS5ib2R5IHRvIGJlIGFuIGFycmF5IG9mIG9iaiB3aXRoIHRoZXNlIGF0dHJpYnV0ZXM6IHtpZCwgdGl0bGUsIGdlbnJlLCBwb3N0ZXJfcGF0aCwgcmVsZWFzZV9kYXRlLCBvdmVydmlldywgdm90ZV9hdmVyYWdlfVxuLy9vdXRwdXRzIFsge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnICwgcG9zdGVyOiAndXJsJywgcmVsZWFzZV9kYXRlOiAnZGF0ZScsIHNjb3JlOiBuLCBmcmllbmRBdmVyYWdlUmF0aW5nOiBufSAuLi4gXVxuZXhwb3J0cy5nZXRNdWx0aXBsZU1vdmllUmF0aW5ncyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cdGNvbnNvbGUubG9nKCdnZXRNdWx0aXBsZU1vdmllUmF0aW5ncycpO1xuXHRQcm9taXNlLm1hcChyZXEuYm9keS5tb3ZpZXMsIGZ1bmN0aW9uKG1vdmllKSB7XG5cdFx0Ly9maXJzdCBjaGVjayB3aGV0aGVyIG1vdmllIGlzIGluIHRoZSBkYXRhYmFzZVxuXHRcdHJldHVybiBuZXcgTW92aWUoe3RpdGxlOiBtb3ZpZS50aXRsZSwgaWQ6IG1vdmllLmlkfSkuZmV0Y2goKVxuXHRcdC50aGVuKGZ1bmN0aW9uKGZvdW5kTW92aWUpIHtcblx0XHRcdC8vaWYgbm90IGNyZWF0ZSBvbmVcblx0XHRcdGlmICghZm91bmRNb3ZpZSkge1xuXHRcdFx0XHRyZXR1cm4gYWRkT25lTW92aWUobW92aWUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGZvdW5kTW92aWU7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQudGhlbihmdW5jdGlvbihmb3VuZE1vdmllKXtcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdmb3VuZCBtb3ZpZScsIGZvdW5kTW92aWUpO1xuXHRcdFx0cmV0dXJuIGdldE9uZU1vdmllUmF0aW5nKHJlcS5teVNlc3Npb24udXNlciwgZm91bmRNb3ZpZS5hdHRyaWJ1dGVzKTtcblx0XHR9KVxuXHR9KVxuXHQudGhlbihmdW5jdGlvbihyYXRpbmdzKXtcblx0XHRjb25zb2xlLmxvZygnc2VuZGluZyByYXRpbmcgdG8gY2xpZW50Jyk7XG5cdFx0cmVzLmpzb24ocmF0aW5ncyk7XG5cdH0pXG59XG5cbi8vdGhpcyBoYW5kbGVyIHNlbmRzIGFuIGdldCByZXF1ZXN0IHRvIFRNREIgQVBJIHRvIHJldHJpdmUgcmVjZW50IHRpdGxlc1xuLy93ZSBjYW5ub3QgZG8gaXQgaW4gdGhlIGZyb250IGVuZCBiZWNhdXNlIGNyb3NzIG9yaWdpbiByZXF1ZXN0IGlzc3Vlc1xuZXhwb3J0cy5nZXRSZWNlbnRSZWxlYXNlID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgdmFyIHBhcmFtcyA9IHtcbiAgICBhcGlfa2V5OiAnOWQzYjAzNWVmMWNkNjY5YWVkMzk4NDAwYjE3ZmNlYTInLFxuICAgIHByaW1hcnlfcmVsZWFzZV95ZWFyOiBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCksXG4gICAgaW5jbHVkZV9hZHVsdDogZmFsc2UsXG4gICAgc29ydF9ieTogJ3BvcHVsYXJpdHkuZGVzYydcbiAgfTtcblxuXHQgXG4gIHZhciBkYXRhID0gJyc7XG5cdHJlcXVlc3Qoe1xuXHRcdG1ldGhvZDogJ0dFVCcsXG5cdFx0dXJsOiAnaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy9kaXNjb3Zlci9tb3ZpZS8nLFxuXHRcdHFzOiBwYXJhbXNcblx0fSlcblx0Lm9uKCdkYXRhJyxmdW5jdGlvbihjaHVuayl7XG5cdFx0ZGF0YSArPSBjaHVuaztcblx0fSlcblx0Lm9uKCdlbmQnLCBmdW5jdGlvbigpe1xuXHRcdHJlY2VudE1vdmllcyA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgcmVxLmJvZHkubW92aWVzID0gcmVjZW50TW92aWVzLnJlc3VsdHM7XG4gICAgLy90cmFuc2ZlcnMgdGhlIG1vdmllIGRhdGEgdG8gZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MgdG8gZGVjb3JhdGUgd2l0aCBzY29yZSAodXNlciByYXRpbmcpIGFuZCBhdmdmcmllbmRSYXRpbmcgYXR0cmlidXRlXG4gICAgZXhwb3J0cy5nZXRNdWx0aXBsZU1vdmllUmF0aW5ncyhyZXEsIHJlcyk7XG5cblx0fSlcblx0Lm9uKCdlcnJvcicsIGZ1bmN0aW9uKGVycm9yKXtcblx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdH0pXG5cbn1cblxuLy90aGlzIGlzIFRNREIncyBnZW5yZSBjb2RlLCB3ZSBtaWdodCB3YW50IHRvIHBsYWNlIHRoaXMgc29tZXdoZXJlIGVsc2VcbnZhciBnZW5yZXMgPSB7XG4gICAxMjogXCJBZHZlbnR1cmVcIixcbiAgIDE0OiBcIkZhbnRhc3lcIixcbiAgIDE2OiBcIkFuaW1hdGlvblwiLFxuICAgMTg6IFwiRHJhbWFcIixcbiAgIDI3OiBcIkhvcnJvclwiLFxuICAgMjg6IFwiQWN0aW9uXCIsXG4gICAzNTogXCJDb21lZHlcIixcbiAgIDM2OiBcIkhpc3RvcnlcIixcbiAgIDM3OiBcIldlc3Rlcm5cIixcbiAgIDUzOiBcIlRocmlsbGVyXCIsXG4gICA4MDogXCJDcmltZVwiLFxuICAgOTk6IFwiRG9jdW1lbnRhcnlcIixcbiAgIDg3ODogXCJTY2llbmNlIEZpY3Rpb25cIixcbiAgIDk2NDg6IFwiTXlzdGVyeVwiLFxuICAgMTA0MDI6IFwiTXVzaWNcIixcbiAgIDEwNzQ5OiBcIlJvbWFuY2VcIixcbiAgIDEwNzUxOiBcIkZhbWlseVwiLFxuICAgMTA3NTI6IFwiV2FyXCIsXG4gICAxMDc2OTogXCJGb3JlaWduXCIsXG4gICAxMDc3MDogXCJUViBNb3ZpZVwiXG4gfTtcblxuLy90aGlzIGZ1bmN0aW9uIHdpbGwgc2VuZCBiYWNrIHNlYXJjYiBtb3ZpZXMgdXNlciBoYXMgcmF0ZWQgaW4gdGhlIGRhdGFiYXNlXG4vL2l0IHdpbGwgc2VuZCBiYWNrIG1vdmllIG9ianMgdGhhdCBtYXRjaCB0aGUgc2VhcmNoIGlucHV0LCBleHBlY3RzIG1vdmllIG5hbWUgaW4gcmVxLmJvZHkudGl0bGVcbmV4cG9ydHMuc2VhcmNoUmF0ZWRNb3ZpZSA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIHJldHVybiBSYXRpbmcucXVlcnkoZnVuY3Rpb24ocWIpe1xuXHRcdHFiLmlubmVySm9pbigndXNlcnMnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICd1c2Vycy5pZCcpO1xuXHRcdHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xuXHRcdHFiLnNlbGVjdCgndXNlcnMudXNlcm5hbWUnLCAnbW92aWVzLnRpdGxlJywgJ21vdmllcy5pZCcsICdtb3ZpZXMuZ2VucmUnLCAnbW92aWVzLnBvc3RlcicsICdtb3ZpZXMucmVsZWFzZV9kYXRlJywgJ21vdmllcy5pbWRiUmF0aW5nJywgJ21vdmllcy5kZXNjcmlwdGlvbicsICdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3Jyk7XG4gIFx0cWIud2hlcmVSYXcoYE1BVENIIChtb3ZpZXMudGl0bGUpIEFHQUlOU1QgKCcke3JlcS5xdWVyeS50aXRsZX0nIElOIE5BVFVSQUwgTEFOR1VBR0UgTU9ERSlgKVxuICBcdHFiLmFuZFdoZXJlKCd1c2Vycy51c2VybmFtZScsICc9JywgcmVxLm15U2Vzc2lvbi51c2VyKVxuICBcdHFiLm9yZGVyQnkoJ3VwZGF0ZWRfYXQnLCAnREVTQycpXG4gIH0pXG4gIC5mZXRjaEFsbCgpXG4gIC50aGVuKGZ1bmN0aW9uKG1hdGNoZXMpe1xuICBcdGNvbnNvbGUubG9nKG1hdGNoZXMubW9kZWxzKTtcbiAgXHRyZXMuanNvbihtYXRjaGVzKTtcbiAgfSlcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vL2ZyaWVuZHNoaXAgaGFuZGxlcnNcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5leHBvcnRzLmdldEZyaWVuZExpc3QgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXHRyZXR1cm4gUmVsYXRpb24ucXVlcnkoZnVuY3Rpb24ocWIpe1xuXHRcdHFiLmlubmVySm9pbigndXNlcnMnLCAncmVsYXRpb25zLnVzZXIxaWQnLCAnPScsICd1c2Vycy5pZCcpO1xuXHRcdHFiLnNlbGVjdCgncmVsYXRpb25zLnVzZXIyaWQnKTtcblx0XHRxYi53aGVyZSh7XG5cdFx0XHQndXNlcnMudXNlcm5hbWUnOiByZXEubXlTZXNzaW9uLnVzZXJcblx0XHR9KVxuXHR9KVxuXHQuZmV0Y2hBbGwoKVxuXHQudGhlbihmdW5jdGlvbihmcmllbmRzKXtcblx0XHRyZXR1cm4gUHJvbWlzZS5tYXAoZnJpZW5kcy5tb2RlbHMsIGZ1bmN0aW9uKGZyaWVuZCkge1xuXHRcdFx0cmV0dXJuIG5ldyBVc2VyKHtpZDogZnJpZW5kLmF0dHJpYnV0ZXMudXNlcjJpZH0pLmZldGNoKClcblx0XHRcdC50aGVuKGZ1bmN0aW9uKGZyaWVuZFVzZXIpe1xuXHRcdFx0XHRyZXR1cm4gZnJpZW5kVXNlci5hdHRyaWJ1dGVzLnVzZXJuYW1lO1xuXHRcdFx0fSlcblx0XHR9KVxuXHR9KVxuXHQudGhlbihmdW5jdGlvbihmcmllbmRzKXtcblx0XHRjb25zb2xlLmxvZygnc2VuZGluZyBhIGxpc3Qgb2YgZnJpZW5kIG5hbWVzJywgZnJpZW5kcyk7XG5cdFx0cmVzLmpzb24oZnJpZW5kcyk7XG5cdH0pXG59XG5cbi8vdGhpcyB3b3VsZCBzZW5kIGEgbm90aWNlIHRvIHRoZSB1c2VyIHdobyByZWNlaXZlIHRoZSBmcmllbmQgcmVxdWVzdCwgcHJvbXB0aW5nIHRoZW0gdG8gYWNjZXB0IG9yIGRlbnkgdGhlIHJlcXVlc3RcbmV4cG9ydHMuYWRkRnJpZW5kID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcblxufTtcblxuXG4vL3RoaXMgd291bGQgY29uZmlybSB0aGUgZnJpZW5kc2hpcCBhbmQgZXN0YWJsaXNoIHRoZSByZWxhdGlvbnNoaXAgaW4gdGhlIGRhdGFiYXNlXG5leHBvcnRzLmNvbmZpcm1GcmllbmRzaGlwID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcblxufTtcblxuXG5cbmV4cG9ydHMuZ2V0RnJpZW5kcyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIHZhciBwZW9wbGVJZCA9IFtdO1xuICB2YXIgaWQgPSByZXEubXlTZXNzaW9uLnVzZXJcbiAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCBpZCwgZnVuY3Rpb24oZXJyLCByZXNwKSB7XG4gICAgdmFyIHVzZXJpZCA9IHJlc3BbMF0uaWQ7XG4gICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGJlIGxpbmcvMicsaWQpXG4gIFxuICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByYXRpbmdzIFdIRVJFIHVzZXJpZCA9ID8nLCB1c2VyaWQsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xuICAgICAgdmFyIHVzZXJzUmF0aW5ncz1yZXNwLm1hcChmdW5jdGlvbihhKXsgcmV0dXJuIFthLm1vdmllaWQsIGEuc2NvcmVdfSk7XG5cbiAgICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByZWxhdGlvbnMgV0hFUkUgdXNlcjFpZCA9ID8nLCB1c2VyaWQsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3AubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAocGVvcGxlSWQuaW5kZXhPZihyZXNwW2ldLnVzZXIyaWQpID09PSAtMSkge1xuICAgICAgICAgICAgcGVvcGxlSWQucHVzaChyZXNwW2ldLnVzZXIyaWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgcGVvcGxlID0gW11cbiAgICAgICAgY29uc29sZS5sb2coJ1RoaXMgc2hvdWxkIGFsc28gYmUgcGVvcGxlZWUnLHBlb3BsZUlkKTtcbiAgICAgICAgdmFyIGtleUlkPXt9O1xuICAgICAgICBwZW9wbGVJZC5mb3JFYWNoKGZ1bmN0aW9uKGEpIHtcblxuICAgICAgICAgIGNvbi5xdWVyeSgnU0VMRUNUIHVzZXJuYW1lIEZST00gdXNlcnMgV0hFUkUgaWQgPSA/JywgYSwgZnVuY3Rpb24oZXJyLCByZXNwbykge1xuICBcdCAgICAgICAga2V5SWRbYV09cmVzcG9bMF0udXNlcm5hbWU7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygndGhpcyBpcyBPTkUgb2YgdGhlIHBlb3BsZSEhJyxyZXNwb1swXS51c2VybmFtZSlcbiAgICAgICAgICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByYXRpbmdzIFdIRVJFIHVzZXJpZCA9JysnXCInK2ErJ1wiJywgZnVuY3Rpb24oZXJyLCByZSkge1xuICAgICAgXHQgICAgICBjb25zb2xlLmxvZygndGhpcyBpcyBhJyxhKVxuICAgICAgXHQgICAgICBpZiAocmUubGVuZ3RoPT09MCl7XG4gICAgICBcdFx0ICAgICAgcmU9W3t1c2VyaWQ6YSxtb3ZpZWlkOk1hdGgucm91bmQoTWF0aC5yYW5kb20oKSoxMDAwMCksc2NvcmU6OTl9XVxuICAgICAgXHQgICAgICB9XG4gICAgICBcdCAgICAgIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBiZSB0aGUgcmF0aW5ncyBmcm9tIGVhY2ggcGVyc29uISEnLHJlKTtcblxuICAgICAgICAgICAgICBwZW9wbGUucHVzaChyZS5tYXAoZnVuY3Rpb24oYSl7cmV0dXJuIFthLnVzZXJpZCxhLm1vdmllaWQsYS5zY29yZV07fSkpO1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgaWYgKHBlb3BsZS5sZW5ndGg9PT1wZW9wbGVJZC5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIHZhciBmaW5hbCA9IHt9O1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGJlIHBlb3BsZScsIHBlb3BsZSk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwZW9wbGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgIGlmIChwZW9wbGVbaV1bMF0hPT11bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgICAgICBmaW5hbFtrZXlJZFtwZW9wbGVbaV1bMF1bMF1dXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBlb3BsZVtpXS5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICAgIGZpbmFsW2tleUlkW3Blb3BsZVtpXVswXVswXV1dLnB1c2goW10pO1xuICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHogPSAxOyB6IDwgcGVvcGxlW2ldW3hdLmxlbmd0aDsgeisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5hbFtrZXlJZFtwZW9wbGVbaV1bMF1bMF1dXVt4XS5wdXNoKHBlb3BsZVtpXVt4XVt6XSlcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZmluYWwnLGZpbmFsLHVzZXJzUmF0aW5ncyk7XG5cbiAgICAgICAgICAgICAgICB2YXIgY29tcGFyaXNvbnM9e307XG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGZpbmFsKXtcbiAgICAgICAgICAgICAgICAgIGNvbXBhcmlzb25zW2tleV09Y29tcCh1c2Vyc1JhdGluZ3MsZmluYWxba2V5XSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY29tcGFyaXNvbnMpO1xuICAgICAgICAgICAgICAgIHZlcnlGaW5hbD1bXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gY29tcGFyaXNvbnMpe1xuICAgICAgICAgICAgICAgICAgdmVyeUZpbmFsLnB1c2goW2tleSxjb21wYXJpc29uc1trZXldXSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codmVyeUZpbmFsKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZCh2ZXJ5RmluYWwpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICB9KVxuICB9KVxufTtcblxuXG5cbi8vVEJEXG5leHBvcnRzLmdldEhpZ2hDb21wYXRpYmlsaXR5VXNlcnMgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICBcbn07XG5cblxuLy9UQkRcbmV4cG9ydHMuZ2V0UmVjb21tZW5kZWRNb3ZpZXMgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXG59OyJdfQ==
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
//   password: "123",
//   database: "MainDatabase"
// });

var con = mysql.createConnection({
  host: 'us-cdbr-iron-east-04.cleardb.net',
  user: 'b03916e750e81d',
  password: 'bef4f775',
  database: 'heroku_919bcc8005bfd4c'
});

var connection;
function handleDisconnect() {
  connection = mysql.createConnection({
    host: 'us-cdbr-iron-east-04.cleardb.net',
    user: 'b03916e750e81d',
    password: 'bef4f775',
    database: 'heroku_919bcc8005bfd4c'
  }); // Recreate the connection, since
  // the old one cannot be reused.

  connection.connect(function (err) {
    // The server is either down
    if (err) {
      // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    } // to avoid a hot loop, and to allow our node script to
  }); // process asynchronous requests in the meantime.
  // If you're also serving http, display a 503 error.
  connection.on('error', function (err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      // Connection to the MySQL server is usually
      handleDisconnect(); // lost due to either server restart, or a
    } else {
      // connnection idle timeout (the wait_timeout
      throw err; // server variable configures this)
    }
  });
}

handleDisconnect();
// con.connect(function(err){
//   if(err){
//     console.log('Error connecting to Db');
//     return;
//   }
//   console.log('Connection established');
// });

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9yZXF1ZXN0LWhhbmRsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQSxJQUFJLFNBQVEsU0FBUixNQUFRLENBQVMsSUFBVCxFQUFjLElBQWQsRUFBbUI7QUFDL0IsTUFBSSxPQUFLLEtBQUssR0FBTCxDQUFTLE9BQUssSUFBZCxDQUFUO0FBQ0EsU0FBTyxJQUFFLElBQVQ7QUFDQyxDQUhEOztBQUtBLElBQUksT0FBTyxTQUFQLElBQU8sQ0FBUyxLQUFULEVBQWdCLE1BQWhCLEVBQXdCO0FBQ25DLE1BQUksUUFBTyxFQUFYO0FBQ0UsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFHLE1BQU0sTUFBekIsRUFBaUMsR0FBakMsRUFBc0M7O0FBRXBDLFNBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxPQUFPLE1BQTNCLEVBQW1DLEdBQW5DLEVBQXdDOztBQUV0QyxVQUFJLE1BQU0sQ0FBTixFQUFTLENBQVQsTUFBZ0IsT0FBTyxDQUFQLEVBQVUsQ0FBVixDQUFwQixFQUFrQzs7QUFFcEMsY0FBTSxJQUFOLENBQVcsT0FBTyxNQUFNLENBQU4sRUFBUyxDQUFULENBQVAsRUFBbUIsT0FBTyxDQUFQLEVBQVUsQ0FBVixDQUFuQixDQUFYO0FBRUc7QUFDRjtBQUNGO0FBQ0gsTUFBSSxNQUFLLE1BQU0sTUFBTixDQUFhLFVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYTtBQUFDLFdBQU8sSUFBRSxDQUFUO0FBQVcsR0FBdEMsRUFBdUMsQ0FBdkMsQ0FBVDtBQUNBLFNBQU8sS0FBSyxLQUFMLENBQVcsS0FBRyxHQUFILEdBQU8sTUFBTSxNQUF4QixDQUFQO0FBQ0MsQ0FmRDs7Ozs7QUF3QkEsSUFBSSxLQUFLLFFBQVEscUJBQVIsQ0FBVDtBQUNBLElBQUksUUFBUSxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUksVUFBVSxRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQUksUUFBUSxRQUFRLHFCQUFSLENBQVo7QUFDQSxJQUFJLFNB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QSxvQkFBSSxjQUFZLEVBQWhCO0FBQ0EscUJBQUssSUFBSSxHQUFULElBQWdCLEtBQWhCLEVBQXNCO0FBQ3BCLDhCQUFZLEdBQVosSUFBaUIsS0FBSyxZQUFMLEVBQWtCLE1BQU0sR0FBTixDQUFsQixDQUFqQjtBQUNEO0FBQ0Qsd0JBQVEsR0FBUixDQUFZLFdBQVo7QUFDQSw0QkFBVSxFQUFWO0FBQ0EscUJBQUssSUFBSSxHQUFULElBQWdCLFdBQWhCLEVBQTRCO0FBQzFCLDRCQUFVLElBQVYsQ0FBZSxDQUFDLEdBQUQsRUFBSyxZQUFZLEdBQVosQ0FBTCxDQUFmO0FBQ0Q7QUFDRCx3QkFBUSxHQUFSLENBQVksU0FBWjtBQUNBLG9CQUFJLElBQUosQ0FBUyxTQUFUO0FBQ0Q7QUFDRixhQXZDRDtBQXdDRCxXQTNDRDtBQTRDRCxTQTlDRDtBQStDRCxPQXhERDtBQXlERCxLQTVERDtBQTZERCxHQWpFRDtBQWtFRCxDQXJFRDs7O0FBMEVBLFFBQVEseUJBQVIsR0FBb0MsVUFBUyxHQUFULEVBQWMsR0FBZCxFQUFtQixDQUV0RCxDQUZEOzs7QUFNQSxRQUFRLG9CQUFSLEdBQStCLFVBQVMsR0FBVCxFQUFjLEdBQWQsRUFBbUIsQ0FFakQsQ0FGRCIsImZpbGUiOiJyZXF1ZXN0LWhhbmRsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vL1RoZSBhbGdvcml0aG1cbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xudmFyIGhlbHBlcj0gZnVuY3Rpb24obnVtMSxudW0yKXtcbnZhciBkaWZmPU1hdGguYWJzKG51bTEtbnVtMik7XG5yZXR1cm4gNS1kaWZmO1xufVxuXG52YXIgY29tcCA9IGZ1bmN0aW9uKGZpcnN0LCBzZWNvbmQpIHtcbnZhciBmaW5hbD0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGk8IGZpcnN0Lmxlbmd0aDsgaSsrKSB7XG5cbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHNlY29uZC5sZW5ndGg7IHgrKykge1xuXG4gICAgICBpZiAoZmlyc3RbaV1bMF0gPT09IHNlY29uZFt4XVswXSkge1xuXG4gICAgZmluYWwucHVzaChoZWxwZXIoZmlyc3RbaV1bMV0sc2Vjb25kW3hdWzFdKSlcblxuICAgICAgfVxuICAgIH1cbiAgfVxudmFyIHN1bT0gZmluYWwucmVkdWNlKGZ1bmN0aW9uKGEsYil7cmV0dXJuIGErYn0sMCk7XG5yZXR1cm4gTWF0aC5yb3VuZCgyMCpzdW0vZmluYWwubGVuZ3RoKVxufVxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuXG5cblxudmFyIGRiID0gcmVxdWlyZSgnLi4vYXBwL2RiQ29ubmVjdGlvbicpO1xudmFyIG15c3FsID0gcmVxdWlyZSgnbXlzcWwnKTtcbnZhciBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xudmFyIE1vdmllID0gcmVxdWlyZSgnLi4vYXBwL21vZGVscy9tb3ZpZScpO1xudmFyIFJhdGluZyA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvcmF0aW5nJyk7XG52YXIgUmVsYXRpb24gPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL3JlbGF0aW9uJyk7XG52YXIgVXNlciA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvdXNlcicpO1xudmFyIGFsbFJlcXVlc3QgPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL2FsbFJlcXVlc3QnKTtcblxudmFyIE1vdmllcyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy9tb3ZpZXMnKTtcbnZhciBSYXRpbmdzID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL3JhdGluZ3MnKTtcbnZhciBSZWxhdGlvbnMgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvcmVsYXRpb25zJyk7XG52YXIgVXNlcnMgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvdXNlcnMnKTtcbnZhciBhbGxSZXF1ZXN0cyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy9hbGxSZXF1ZXN0cycpO1xuXG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoXCJibHVlYmlyZFwiKTtcbnZhciByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdCcpO1xuXG4vLyB2YXIgY29uID0gbXlzcWwuY3JlYXRlQ29ubmVjdGlvbih7XG4vLyAgIGhvc3Q6IFwibG9jYWxob3N0XCIsXG4vLyAgIHVzZXI6IFwicm9vdFwiLFxuLy8gICBwYXNzd29yZDogXCIxMjNcIixcbi8vICAgZGF0YWJhc2U6IFwiTWFpbkRhdGFiYXNlXCJcbi8vIH0pO1xuXG52YXIgY29uID0gbXlzcWwuY3JlYXRlQ29ubmVjdGlvbih7XG4gIGhvc3QgICAgIDogJ3VzLWNkYnItaXJvbi1lYXN0LTA0LmNsZWFyZGIubmV0JyxcbiAgdXNlciAgICAgOiAnYjAzOTE2ZTc1MGU4MWQnLFxuICBwYXNzd29yZCA6ICdiZWY0Zjc3NScsXG4gIGRhdGFiYXNlIDogJ2hlcm9rdV85MTliY2M4MDA1YmZkNGMnXG59KTtcblxudmFyIGNvbm5lY3Rpb247XG5mdW5jdGlvbiBoYW5kbGVEaXNjb25uZWN0KCkge1xuICBjb25uZWN0aW9uID0gbXlzcWwuY3JlYXRlQ29ubmVjdGlvbih7XG4gICAgaG9zdCAgICAgOiAndXMtY2Rici1pcm9uLWVhc3QtMDQuY2xlYXJkYi5uZXQnLFxuICAgIHVzZXIgICAgIDogJ2IwMzkxNmU3NTBlODFkJyxcbiAgICBwYXNzd29yZCA6ICdiZWY0Zjc3NScsXG4gICAgZGF0YWJhc2UgOiAnaGVyb2t1XzkxOWJjYzgwMDViZmQ0YydcbiAgfSk7IC8vIFJlY3JlYXRlIHRoZSBjb25uZWN0aW9uLCBzaW5jZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgb2xkIG9uZSBjYW5ub3QgYmUgcmV1c2VkLlxuXG4gIGNvbm5lY3Rpb24uY29ubmVjdChmdW5jdGlvbihlcnIpIHsgICAgICAgICAgICAgIC8vIFRoZSBzZXJ2ZXIgaXMgZWl0aGVyIGRvd25cbiAgICBpZihlcnIpIHsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gb3IgcmVzdGFydGluZyAodGFrZXMgYSB3aGlsZSBzb21ldGltZXMpLlxuICAgICAgY29uc29sZS5sb2coJ2Vycm9yIHdoZW4gY29ubmVjdGluZyB0byBkYjonLCBlcnIpO1xuICAgICAgc2V0VGltZW91dChoYW5kbGVEaXNjb25uZWN0LCAyMDAwKTsgLy8gV2UgaW50cm9kdWNlIGEgZGVsYXkgYmVmb3JlIGF0dGVtcHRpbmcgdG8gcmVjb25uZWN0LFxuICAgIH0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdG8gYXZvaWQgYSBob3QgbG9vcCwgYW5kIHRvIGFsbG93IG91ciBub2RlIHNjcmlwdCB0b1xuICB9KTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcHJvY2VzcyBhc3luY2hyb25vdXMgcmVxdWVzdHMgaW4gdGhlIG1lYW50aW1lLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgeW91J3JlIGFsc28gc2VydmluZyBodHRwLCBkaXNwbGF5IGEgNTAzIGVycm9yLlxuICBjb25uZWN0aW9uLm9uKCdlcnJvcicsIGZ1bmN0aW9uKGVycikge1xuICAgIGNvbnNvbGUubG9nKCdkYiBlcnJvcicsIGVycik7XG4gICAgaWYoZXJyLmNvZGUgPT09ICdQUk9UT0NPTF9DT05ORUNUSU9OX0xPU1QnKSB7IC8vIENvbm5lY3Rpb24gdG8gdGhlIE15U1FMIHNlcnZlciBpcyB1c3VhbGx5XG4gICAgICBoYW5kbGVEaXNjb25uZWN0KCk7ICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxvc3QgZHVlIHRvIGVpdGhlciBzZXJ2ZXIgcmVzdGFydCwgb3IgYVxuICAgIH0gZWxzZSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25ubmVjdGlvbiBpZGxlIHRpbWVvdXQgKHRoZSB3YWl0X3RpbWVvdXRcbiAgICAgIHRocm93IGVycjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2VydmVyIHZhcmlhYmxlIGNvbmZpZ3VyZXMgdGhpcylcbiAgICB9XG4gIH0pO1xufVxuXG5oYW5kbGVEaXNjb25uZWN0KCk7XG4vLyBjb24uY29ubmVjdChmdW5jdGlvbihlcnIpe1xuLy8gICBpZihlcnIpe1xuLy8gICAgIGNvbnNvbGUubG9nKCdFcnJvciBjb25uZWN0aW5nIHRvIERiJyk7XG4vLyAgICAgcmV0dXJuO1xuLy8gICB9XG4vLyAgIGNvbnNvbGUubG9nKCdDb25uZWN0aW9uIGVzdGFibGlzaGVkJyk7XG4vLyB9KTtcblxuLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy91c2VyIGF1dGhcbi8vLy8vLy8vLy8vLy8vLy8vXG5cbmV4cG9ydHMuc2lnbnVwVXNlciA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cdGNvbnNvbGUubG9nKCdjYWxsaW5nIGxvZ2luJywgcmVxLmJvZHkpO1xuXHQvLyBjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgc2Vzc2lvbicscmVxLnNlc3Npb24pXG4gIG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUgfSkuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGZvdW5kKSB7XG5cdCAgaWYgKGZvdW5kKSB7XG5cdCAgXHQvL2NoZWNrIHBhc3N3b3JkXG5cdCAgXHQgICAvL2lmIChwYXNzd29yZCBtYXRjaGVzKVxuXHQgIFx0ICAgLy97IGFkZCBzZXNzaW9ucyBhbmQgcmVkaXJlY3R9XG5cdCAgXHRjb25zb2xlLmxvZygndXNlcm5hbWUgYWxyZWFkeSBleGlzdCwgY2Fubm90IHNpZ251cCAnLCByZXEuYm9keS5uYW1lKTtcblx0ICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKCd1c2VybmFtZSBleGlzdCcpO1xuXHQgIH0gZWxzZSB7XG5cdCAgXHRjb25zb2xlLmxvZygnY3JlYXRpbmcgdXNlcicpO1xuICAgICAgcmVxLm15U2Vzc2lvbi51c2VyID0gcmVxLmJvZHkubmFtZTtcblx0ICAgIFVzZXJzLmNyZWF0ZSh7XG5cdCAgICAgIHVzZXJuYW1lOiByZXEuYm9keS5uYW1lLFxuXHQgICAgICBwYXNzd29yZDogcmVxLmJvZHkucGFzc3dvcmQsXG5cdCAgICB9KVxuXHQgICAgLnRoZW4oZnVuY3Rpb24odXNlcikge1xuXHRcdCAgXHRjb25zb2xlLmxvZygnY3JlYXRlZCBhIG5ldyB1c2VyJyk7XG5cdCAgICAgIHJlcy5zdGF0dXMoMjAxKS5zZW5kKCdsb2dpbiBjcmVhdGVkJyk7XG5cdCAgICB9KTtcblx0ICB9XG5cdH0pO1xufTtcblxuXG5leHBvcnRzLnNlbmRXYXRjaFJlcXVlc3QgPSBmdW5jdGlvbihyZXEsIHJlc3BvbnNlKSB7XG5cdGNvbnNvbGUubG9nKHJlcS5ib2R5LnJlcXVlc3RlZSlcblx0aWYgKEFycmF5LmlzQXJyYXkocmVxLmJvZHkucmVxdWVzdGVlKSkge1xuXHRcdHZhciByZXF1ZXN0ZWVzID0gcmVxLmJvZHkucmVxdWVzdGVlO1xuXHR9IGVsc2Uge1xuXHRcdHZhciByZXF1ZXN0ZWVzID0gW3JlcS5ib2R5LnJlcXVlc3RlZV07XG5cdH1cblx0UHJvbWlzZS5lYWNoKHJlcXVlc3RlZXMsIGZ1bmN0aW9uKHJlcXVlc3RlZSl7XG5cdFx0dmFyIHJlcXVlc3QgPSB7XG4gICAgICBtZXNzYWdlOiByZXEuYm9keS5tZXNzYWdlLFxuXHRcdFx0cmVxdWVzdG9yOiByZXEubXlTZXNzaW9uLnVzZXIsIFxuXHRcdFx0cmVxdWVzdFR5cDond2F0Y2gnLFxuXHRcdFx0bW92aWU6cmVxLmJvZHkubW92aWUsXG5cdFx0XHRyZXF1ZXN0ZWU6IHJlcXVlc3RlZVxuXHRcdH07XG5cdFx0Y29uLnF1ZXJ5KCdJTlNFUlQgSU5UTyBhbGxyZXF1ZXN0cyBTRVQgPycsIHJlcXVlc3QsIGZ1bmN0aW9uKGVycixyZXMpe1xuXHRcdCAgaWYoZXJyKSB0aHJvdyBlcnI7XG5cdFx0ICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcblx0XHR9KTtcblx0fSlcblx0LnRoZW4oZnVuY3Rpb24oZG9uZSl7XG5cdFx0cmVzcG9uc2Uuc2VuZCgnVGhhdHMgbXkgc3R5bGUhJyk7XG5cdH0pXG59XG5cbmV4cG9ydHMucmVtb3ZlV2F0Y2hSZXF1ZXN0ID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkocmVxLmJvZHkucmVxdWVzdGVlKSkge1xuICAgIHZhciByZXF1ZXN0ZWVzID0gcmVxLmJvZHkucmVxdWVzdGVlO1xuICB9IGVsc2Uge1xuICAgIHZhciByZXF1ZXN0ZWVzID0gW3JlcS5ib2R5LnJlcXVlc3RlZV07XG4gIH1cbiAgdmFyIHJlcXVlc3Rvcj1yZXEuYm9keS5yZXF1ZXN0b3I7XG4gIHZhciBtb3ZpZSA9IHJlcS5ib2R5Lm1vdmllO1xuXG4gIGFsbFJlcXVlc3QuZm9yZ2Uoe3JlcXVlc3RvcjogcmVxdWVzdG9yLCByZXF1ZXN0ZWU6IHJlcXVlc3RlZXMsIG1vdmllOiBtb3ZpZSB9KVxuICAgIC5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oYWxsUmVxdWVzdCkge1xuICAgICAgYWxsUmVxdWVzdC5kZXN0cm95KClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmVzLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogJ1VzZXIgc3VjY2Vzc2Z1bGx5IGRlbGV0ZWQnfX0pO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XG4gICAgICAgIH0pO1xuICAgIH0pXG4gICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XG4gICAgfSk7XG59O1xuXG5cbmV4cG9ydHMuc2VuZFJlcXVlc3QgPSBmdW5jdGlvbihyZXEsIHJlc3BvbnNlKSB7XG4gIGNvbnNvbGUubG9nKCd0aGlzIGlzIHdoYXQgSW0gZ2V0dGluZycsIHJlcS5ib2R5KTtcbiAgaWYgKHJlcS5teVNlc3Npb24udXNlcj09PXJlcS5ib2R5Lm5hbWUpe1xuICAgIHJlc3BvbnNlLnNlbmQoXCJZb3UgY2FuJ3QgZnJpZW5kIHlvdXJzZWxmIVwiKVxuICB9IGVsc2Uge1xuXG52YXIgcmVxdWVzdCA9IHtyZXF1ZXN0b3I6IHJlcS5teVNlc3Npb24udXNlciwgcmVxdWVzdGVlOiByZXEuYm9keS5uYW1lLCByZXF1ZXN0VHlwOidmcmllbmQnfTtcblxuY29uLnF1ZXJ5KCdTRUxFQ1QgcmVxdWVzdGVlLHJlc3BvbnNlIEZST00gYWxscmVxdWVzdHMgV0hFUkUgIHJlcXVlc3RvciA9ID8gQU5EIHJlcXVlc3RUeXAgPScrJ1wiJysgJ2ZyaWVuZCcrJ1wiJywgcmVxdWVzdFsncmVxdWVzdG9yJ10sIGZ1bmN0aW9uKGVycixyZXMpe1xuaWYgKHJlcyA9PT0gdW5kZWZpbmVkKSB7XG4gIHJlc3BvbnNlLnNlbmQoJ25vIGZyaWVuZHMnKVxufVxudmFyIHRlc3Q9cmVzLmZpbHRlcihmdW5jdGlvbihhKXtyZXR1cm4gYS5yZXNwb25zZT09PW51bGx9KVxudmFyIHRlc3QyPXRlc3QubWFwKGZ1bmN0aW9uKGEpeyByZXR1cm4gYS5yZXF1ZXN0ZWV9KVxuY29uc29sZS5sb2coJ25hbWVzIG9mIHBlb3BsZSB3aG9tIEl2ZSByZXF1ZXN0ZWQgYXMgZnJpZW5kcycsdGVzdCk7XG5cblxuXG5jb24ucXVlcnkoJ0lOU0VSVCBJTlRPIGFsbHJlcXVlc3RzIFNFVCA/JywgcmVxdWVzdCwgZnVuY3Rpb24oZXJyLHJlc3Ape1xuICBpZihlcnIpIHRocm93IGVycjtcbiAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlc3AuaW5zZXJ0SWQpO1xuICByZXNwb25zZS5zZW5kKHRlc3QyKTtcbn0pXG59KTtcblxuIH1cbn07XG5cblxuXG5cblxuXG5cblxuXG5leHBvcnRzLmxpc3RSZXF1ZXN0cyA9IGZ1bmN0aW9uKHJlcSwgcmVzcG9uc2UpIHtcbiAgdmFyIHJlcXVlc3QgPSByZXEubXlTZXNzaW9uLnVzZXJcblxuICBjb24ucXVlcnkoJ1NlbGVjdCAqIEZST00gYWxscmVxdWVzdHMgV0hFUkUgcmVxdWVzdGVlPScrJ1wiJytyZXF1ZXN0KydcIicrJycrJ09SIHJlcXVlc3RvciA9JysnXCInK3JlcXVlc3QrJ1wiJysnJywgZnVuY3Rpb24oZXJyLHJlcyl7XG4gIGlmKGVycikgdGhyb3cgZXJyO1xuICBjb25zb2xlLmxvZyhyZXMpXG4gIHJlc3BvbnNlLnNlbmQoW3JlcyxyZXF1ZXN0XSk7XG59KTtcblxuXG59O1xuXG5leHBvcnRzLmFjY2VwdCA9IGZ1bmN0aW9uKHJlcSwgcmVzcG9uc2UpIHtcbiAgdmFyIHJlcXVlc3Rvcj1yZXEuYm9keS5wZXJzb25Ub0FjY2VwdDtcbiAgdmFyIHJlcXVlc3RlZT1yZXEubXlTZXNzaW9uLnVzZXI7XG4gIHZhciBtb3ZpZSA9IHJlcS5ib2R5Lm1vdmllO1xuICB2YXIgcmVxdWVzdFR5cGUgPSBcImZyaWVuZFwiO1xuXG4gIGlmIChtb3ZpZSA9PT0gJycpIHtcbiAgICBjb24ucXVlcnkoJ1VQREFURSBhbGxyZXF1ZXN0cyBTRVQgcmVzcG9uc2U9JysnXCInICsgJ3llcycgKyAnXCInKycgIFdIRVJFIHJlcXVlc3RvciA9ICcrJ1wiJysgcmVxdWVzdG9yKydcIicrJyBBTkQgcmVxdWVzdFR5cD0nKydcIicrcmVxdWVzdFR5cGUrJ1wiJywgZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XG4gICAgfSk7XG5cbiAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCByZXEuYm9keS5wZXJzb25Ub0FjY2VwdCwgZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlc1swXS5pZCwgZXJyKTtcbiAgICB2YXIgcGVyc29uMSA9IHJlc1swXS5pZDtcbiAgICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIHJlcS5teVNlc3Npb24udXNlciwgZnVuY3Rpb24oZXJyLCByZXNwKSB7XG4gICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzcFswXS5pZCwgZXJyKTtcblxuICAgICAgdmFyIHBlcnNvbjIgPSByZXNwWzBdLmlkO1xuICAgICAgdmFyIHJlcXVlc3QgPSB7XG4gICAgICAgIHVzZXIxaWQ6IHBlcnNvbjEsXG4gICAgICAgIHVzZXIyaWQ6IHBlcnNvbjJcbiAgICAgIH1cbiAgICAgIHZhciByZXF1ZXN0MiA9IHtcbiAgICAgICAgdXNlcjFpZDogcGVyc29uMixcbiAgICAgICAgdXNlcjJpZDogcGVyc29uMVxuICAgICAgfVxuXG4gICAgICBjb25zb2xlLmxvZygndGhlIHJlcXVlc3RzOjo6JyxyZXF1ZXN0LHJlcXVlc3QyKVxuICAgICAgY29uLnF1ZXJ5KCdJTlNFUlQgSU5UTyByZWxhdGlvbnMgU0VUID8nLCByZXF1ZXN0LCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xuXG4gICAgICBjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIHJlbGF0aW9ucyBTRVQgPycsIHJlcXVlc3QyLCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XG5cbiAgICAgICAgICAgcmVzcG9uc2Uuc2VuZCgnVGhhdHMgbXkgc3R5bGUhISEnKTtcbiAgICAgICAgfSlcbiAgICAgIH0pO1xuICAgIH0pXG4gIH0pXG4gIH0gZWxzZSB7XG4gIGNvbnNvbGUubG9nKCd0aGlzIGlzIHJlcSBib2R5ICcscmVxLmJvZHkpO1xuXG4gIGNvbi5xdWVyeSgnVVBEQVRFIGFsbHJlcXVlc3RzIFNFVCByZXNwb25zZT0nKydcIicgKyAneWVzJyArICdcIicrJyAgV0hFUkUgcmVxdWVzdG9yID0gJysnXCInKyByZXF1ZXN0b3IrJ1wiJysnIEFORCBtb3ZpZT0nKydcIicrIG1vdmllKydcIicsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XG4gICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XG4gIH0pO1xuXG4gIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgcmVxLmJvZHkucGVyc29uVG9BY2NlcHQsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XG4gICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXNbMF0uaWQsIGVycik7XG4gICAgdmFyIHBlcnNvbjEgPSByZXNbMF0uaWQ7XG4gICAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCByZXEubXlTZXNzaW9uLnVzZXIsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xuICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlc3BbMF0uaWQsIGVycik7XG5cbiAgICAgIHZhciBwZXJzb24yID0gcmVzcFswXS5pZDtcbiAgICAgIHZhciByZXF1ZXN0ID0ge1xuICAgICAgICB1c2VyMWlkOiBwZXJzb24xLFxuICAgICAgICB1c2VyMmlkOiBwZXJzb24yXG4gICAgICB9XG4gICAgICB2YXIgcmVxdWVzdDIgPSB7XG4gICAgICAgIHVzZXIxaWQ6IHBlcnNvbjIsXG4gICAgICAgIHVzZXIyaWQ6IHBlcnNvbjFcbiAgICAgIH1cblxuICAgICAgY29uc29sZS5sb2coJ3RoZSByZXF1ZXN0czo6OicscmVxdWVzdCxyZXF1ZXN0MilcbiAgICAgIGNvbi5xdWVyeSgnSU5TRVJUIElOVE8gcmVsYXRpb25zIFNFVCA/JywgcmVxdWVzdCwgZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcblxuICAgICAgY29uLnF1ZXJ5KCdJTlNFUlQgSU5UTyByZWxhdGlvbnMgU0VUID8nLCByZXF1ZXN0MiwgZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xuXG4gICAgICAgICAgIHJlc3BvbnNlLnNlbmQoJ1RoYXRzIG15IHN0eWxlISEhJyk7XG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgICB9KVxuICB9KVxufVxuICAvLyBhbGxSZXF1ZXN0LmZvcmdlKHtyZXF1ZXN0b3I6IHJlcXVlc3RvciwgcmVxdWVzdGVlOiByZXF1ZXN0ZWV9KVxuICAvLyAgIC5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oYWxsUmVxdWVzdCkge1xuICAvLyAgICAgYWxsUmVxdWVzdC5kZXN0cm95KClcbiAgLy8gICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gIC8vICAgICAgICAgcmVzcG9uc2UuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiAnVXNlciBzdWNjZXNzZnVsbHkgZGVsZXRlZCd9fSk7XG4gIC8vICAgICAgIH0pXG4gIC8vICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgLy8gICAgICAgICByZXNwb25zZS5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xuICAvLyAgICAgICB9KTtcbiAgLy8gICB9KVxuICAvLyAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgLy8gICAgIHJlc3BvbnNlLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XG4gIC8vICAgfSk7XG59O1xuXG5leHBvcnRzLnJlbW92ZVJlcXVlc3QgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICB2YXIgcmVxdWVzdG9yPXJlcS5ib2R5LnJlcXVlc3RvcjtcbiAgdmFyIHJlcXVlc3RlZT1yZXEuYm9keS5yZXF1ZXN0ZWU7XG5cbiAgYWxsUmVxdWVzdC5mb3JnZSh7cmVxdWVzdG9yOiByZXF1ZXN0b3IsIHJlcXVlc3RlZTogcmVxdWVzdGVlfSlcbiAgICAuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGFsbFJlcXVlc3QpIHtcbiAgICAgIGFsbFJlcXVlc3QuZGVzdHJveSgpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJlcy5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6ICdVc2VyIHN1Y2Nlc3NmdWxseSBkZWxldGVkJ319KTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IHJlcS5ib2R5fX0pO1xuICAgICAgICB9KTtcbiAgICB9KVxuICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IHJlcS5ib2R5fX0pO1xuICAgIH0pO1xufVxuXG5leHBvcnRzLmdldFRoaXNGcmllbmRzTW92aWVzPWZ1bmN0aW9uKHJlcSxyZXNwb25zZSl7XG5cbiAgdmFyIG1vdmllcz1bXTtcbiAgY29uc29sZS5sb2cocmVxLmJvZHkuc3BlY2lmaWNGcmllbmQpO1xuICB2YXIgcGVyc29uPXJlcS5ib2R5LnNwZWNpZmljRnJpZW5kXG4gIHZhciBpZD1udWxsXG4gIHZhciBsZW49bnVsbDtcbiAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCBwZXJzb24sIGZ1bmN0aW9uKGVyciwgcmVzcCl7XG5jb25zb2xlLmxvZyhyZXNwKVxuaWQ9cmVzcFswXS5pZDtcblxuXG5jb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gcmF0aW5ncyBXSEVSRSB1c2VyaWQgPSA/JywgaWQgLGZ1bmN0aW9uKGVycixyZXNwKXtcbmNvbnNvbGUubG9nKCdlcnJycnJycnJyJyxlcnIscmVzcC5sZW5ndGgpXG5sZW49cmVzcC5sZW5ndGg7XG5yZXNwLmZvckVhY2goZnVuY3Rpb24oYSl7XG5cbmNvbi5xdWVyeSgnU0VMRUNUIHRpdGxlIEZST00gbW92aWVzIFdIRVJFIGlkID0gPycsIGEubW92aWVpZCAsZnVuY3Rpb24oZXJyLHJlc3Ape1xuICBjb25zb2xlLmxvZyhyZXNwKVxubW92aWVzLnB1c2goW3Jlc3BbMF0udGl0bGUsYS5zY29yZSxhLnJldmlld10pXG5jb25zb2xlLmxvZyhtb3ZpZXMpXG5pZiAobW92aWVzLmxlbmd0aD09PWxlbil7XG4gIHJlc3BvbnNlLnNlbmQobW92aWVzKTtcbn1cbn0pXG5cbn0pXG5cbn0pXG5cblxuICB9XG5cbil9XG5cbmV4cG9ydHMuZmluZE1vdmllQnVkZGllcz1mdW5jdGlvbihyZXEscmVzcG9uc2Upe1xuICBjb25zb2xlLmxvZyhcInlvdSdyZSB0cnlpbmcgdG8gZmluZCBidWRkaWVzISFcIik7XG5jb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gdXNlcnMnLGZ1bmN0aW9uKGVycixyZXNwKXtcbiAgdmFyIHBlb3BsZT1yZXNwLm1hcChmdW5jdGlvbihhKXtyZXR1cm4gYS51c2VybmFtZX0pXG4gIHZhciBJZHM9IHJlc3AubWFwKGZ1bmN0aW9uKGEpe3JldHVybiBhLmlkfSlcbiAgdmFyIGlkS2V5T2JqPXt9XG5mb3IgKHZhciBpPTA7aTxJZHMubGVuZ3RoO2krKyl7XG4gIGlkS2V5T2JqW0lkc1tpXV09cGVvcGxlW2ldXG59XG5jb25zb2xlLmxvZygnY3VycmVudCB1c2VyJyxyZXEubXlTZXNzaW9uLnVzZXIpO1xudmFyIGN1cnJlbnRVc2VyPXJlcS5teVNlc3Npb24udXNlclxuXG5cbiB2YXIgb2JqMT17fTtcbiAgZm9yICh2YXIgaT0wO2k8SWRzLmxlbmd0aDtpKyspe1xub2JqMVtpZEtleU9ialtJZHNbaV1dXT1bXTtcbiAgfVxuXG4gIGNvbi5xdWVyeSgnU0VMRUNUIHNjb3JlLG1vdmllaWQsdXNlcmlkIEZST00gcmF0aW5ncycsZnVuY3Rpb24oZXJyLHJlc3Bvbil7XG4gIFxuZm9yICh2YXIgaT0wO2k8cmVzcG9uLmxlbmd0aDtpKyspe1xuICBvYmoxW2lkS2V5T2JqW3Jlc3BvbltpXS51c2VyaWRdXS5wdXNoKFtyZXNwb25baV0ubW92aWVpZCxyZXNwb25baV0uc2NvcmVdKVxufVxuXG5jb25zb2xlLmxvZygnb2JqMScsb2JqMSk7XG5jdXJyZW50VXNlckluZm89b2JqMVtjdXJyZW50VXNlcl1cbi8vY29uc29sZS5sb2coJ2N1cnJlbnRVc2VySW5mbycsY3VycmVudFVzZXJJbmZvKVxudmFyIGNvbXBhcmlzb25zPXt9XG5cbmZvciAodmFyIGtleSBpbiBvYmoxKXtcbiAgaWYgKGtleSE9PWN1cnJlbnRVc2VyKSB7XG4gICAgY29tcGFyaXNvbnNba2V5XT1jb21wKGN1cnJlbnRVc2VySW5mbyxvYmoxW2tleV0pXG4gIH1cbn1cbmNvbnNvbGUubG9nKGNvbXBhcmlzb25zKVxudmFyIGZpbmFsU2VuZD1bXVxuZm9yICh2YXIga2V5IGluIGNvbXBhcmlzb25zKXtcbiAgaWYgKGNvbXBhcmlzb25zW2tleV0gIT09ICdOYU4lJykge1xuICBmaW5hbFNlbmQucHVzaChba2V5LGNvbXBhcmlzb25zW2tleV1dKTtcbn0gZWxzZSAge1xuICBmaW5hbFNlbmQucHVzaChba2V5LFwiTm8gQ29tcGFyaXNvbiB0byBNYWtlXCJdKVxufVxuXG59XG5cbiAgcmVzcG9uc2Uuc2VuZChmaW5hbFNlbmQpXG59KVxufSlcbn1cblxuXG5leHBvcnRzLmRlY2xpbmU9ZnVuY3Rpb24ocmVxLHJlc3BvbnNlKXtcbiAgdmFyIHJlcXVlc3Rvcj1yZXEuYm9keS5wZXJzb25Ub0RlY2xpbmU7XG4gIHZhciByZXF1ZXN0ZWU9cmVxLm15U2Vzc2lvbi51c2VyO1xuICB2YXIgbW92aWU9cmVxLmJvZHkubW92aWU7XG4gIHZhciByZXF1ZXN0VHlwZSA9ICdmcmllbmQnO1xuXG4gIGlmIChtb3ZpZSA9PT0gJycpIHtcbiAgICBjb24ucXVlcnkoJ1VQREFURSBhbGxyZXF1ZXN0cyBTRVQgcmVzcG9uc2U9JysnXCInICsgJ25vJyArICdcIicrICcgV0hFUkUgcmVxdWVzdG9yID0gJysnXCInKyByZXF1ZXN0b3IrJ1wiJysnIEFORCByZXF1ZXN0VHlwPScrJ1wiJysgcmVxdWVzdFR5cGUrJ1wiJywgZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xuICAgICAgcmVzcG9uc2Uuc2VuZChyZXF1ZXN0b3IgKyAnZGVsZXRlZCcpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGNvbi5xdWVyeSgnVVBEQVRFIGFsbHJlcXVlc3RzIFNFVCByZXNwb25zZT0nKydcIicgKyAnbm8nICsgJ1wiJysgJyBXSEVSRSByZXF1ZXN0b3IgPSAnKydcIicrIHJlcXVlc3RvcisnXCInKycgQU5EIHJlcXVlc3RlZT0nKydcIicrIHJlcXVlc3RlZSsnXCInKycgQU5EIG1vdmllID0nKydcIicrbW92aWUrJ1wiJywgZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xuICAgICAgcmVzcG9uc2Uuc2VuZChyZXF1ZXN0b3IgKyAnZGVsZXRlZCcpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gYWxsUmVxdWVzdC5mb3JnZSh7cmVxdWVzdG9yOiByZXF1ZXN0b3IsIHJlcXVlc3RlZTogcmVxdWVzdGVlfSlcbiAgLy8gICAuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGFsbFJlcXVlc3QpIHtcbiAgLy8gICAgIGFsbFJlcXVlc3QuZGVzdHJveSgpXG4gIC8vICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAvLyAgICAgICAgIHJlc3BvbnNlLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogJ1VzZXIgc3VjY2Vzc2Z1bGx5IGRlbGV0ZWQnfX0pO1xuICAvLyAgICAgICB9KVxuICAvLyAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gIC8vICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcbiAgLy8gICAgICAgfSk7XG4gIC8vICAgfSlcbiAgLy8gICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gIC8vICAgICByZXNwb25zZS5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xuICAvLyAgIH0pO1xufTtcblxuZXhwb3J0cy5zaWdudXBVc2VyID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgY29uc29sZS5sb2coJ2NhbGxpbmcgbG9naW4nLCByZXEuYm9keSk7XG4gIC8vIGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBzZXNzaW9uJyxyZXEuc2Vzc2lvbilcbiAgbmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLmJvZHkubmFtZSB9KS5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oZm91bmQpIHtcbiAgICBpZiAoZm91bmQpIHtcbiAgICAgIC8vY2hlY2sgcGFzc3dvcmRcbiAgICAgICAgIC8vaWYgKHBhc3N3b3JkIG1hdGNoZXMpXG4gICAgICAgICAvL3sgYWRkIHNlc3Npb25zIGFuZCByZWRpcmVjdH1cbiAgICAgIGNvbnNvbGUubG9nKCd1c2VybmFtZSBhbHJlYWR5IGV4aXN0LCBjYW5ub3Qgc2lnbnVwICcsIHJlcS5ib2R5Lm5hbWUpO1xuICAgICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoJ3VzZXJuYW1lIGV4aXN0Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdjcmVhdGluZyB1c2VyJyk7XG4gICAgICByZXEubXlTZXNzaW9uLnVzZXIgPSByZXEuYm9keS5uYW1lO1xuICAgICAgVXNlcnMuY3JlYXRlKHtcbiAgICAgICAgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUsXG4gICAgICAgIHBhc3N3b3JkOiByZXEuYm9keS5wYXNzd29yZCxcbiAgICAgIH0pXG4gICAgICAudGhlbihmdW5jdGlvbih1c2VyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdjcmVhdGVkIGEgbmV3IHVzZXInKTtcbiAgICAgICAgcmVzLnN0YXR1cygyMDEpLnNlbmQoJ2xvZ2luIGNyZWF0ZWQnKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59O1xuXG5leHBvcnRzLnNpZ25pblVzZXIgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXHRjb25zb2xlLmxvZygnY2FsbGluZyBzaWduaW4nLCByZXEuYm9keSk7XG5cdG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUgfSkuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGZvdW5kKXtcblxuXHRcdGlmIChmb3VuZCl7XG5cdFx0XHRuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEuYm9keS5uYW1lLCBwYXNzd29yZDpyZXEuYm9keS5wYXNzd29yZH0pLmZldGNoKCkudGhlbihmdW5jdGlvbihmb3VuZCl7XG5cdFx0XHRcdGlmIChmb3VuZCl7XG5cdFx0XHRcdFx0cmVxLm15U2Vzc2lvbi51c2VyID0gZm91bmQuYXR0cmlidXRlcy51c2VybmFtZTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhmb3VuZC5hdHRyaWJ1dGVzLnVzZXJuYW1lKVxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCd3ZSBmb3VuZCB5b3UhIScpXG5cdFx0XHRcdFx0cmVzLnNlbmQoWydpdCB3b3JrZWQnLHJlcS5teVNlc3Npb24udXNlcl0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJlcy5zdGF0dXMoNDA0KS5zZW5kKCdiYWQgbG9naW4nKTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnd3JvbmcgcGFzc3dvcmQnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVzLnN0YXR1cyg0MDQpLnNlbmQoJ2JhZCBsb2dpbicpO1xuXHRcdFx0Y29uc29sZS5sb2coJ3VzZXIgbm90IGZvdW5kJyk7XG5cdFx0fVxuXG4gIH0pIFxuXG59XG5cbmV4cG9ydHMubG9nb3V0ID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcblx0cmVxLm15U2Vzc2lvbi5kZXN0cm95KGZ1bmN0aW9uKGVycil7XG5cdFx0Y29uc29sZS5sb2coZXJyKTtcblx0fSk7XG5cdGNvbnNvbGUubG9nKCdsb2dvdXQnKTtcblx0cmVzLnNlbmQoJ2xvZ291dCcpO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy9tb3ZpZSBoYW5kbGVyc1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbi8vYSBoYW5kZWxlciB0aGF0IHRha2VzIGEgcmF0aW5nIGZyb20gdXNlciBhbmQgYWRkIGl0IHRvIHRoZSBkYXRhYmFzZVxuLy8gZXhwZWN0cyByZXEuYm9keSB0byBoYXZlIHRoaXM6IHt0aXRsZTogJ25hbWUnLCBnZW5yZTogJ2dlbnJlJywgcG9zdGVyOiAnbGluaycsIHJlbGVhc2VfZGF0ZTogJ3llYXInLCByYXRpbmc6ICdudW1iZXInfVxuZXhwb3J0cy5yYXRlTW92aWUgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXHRjb25zb2xlLmxvZygnY2FsbGluZyByYXRlTW92aWUnKTtcblx0dmFyIHVzZXJpZDtcblx0cmV0dXJuIG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5teVNlc3Npb24udXNlciB9KS5mZXRjaCgpXG5cdC50aGVuKGZ1bmN0aW9uKGZvdW5kVXNlcikge1xuXHRcdHVzZXJpZCA9IGZvdW5kVXNlci5hdHRyaWJ1dGVzLmlkO1xuXHRcdHJldHVybiBuZXcgUmF0aW5nKHsgbW92aWVpZDogcmVxLmJvZHkuaWQsIHVzZXJpZDogdXNlcmlkIH0pLmZldGNoKClcblx0XHQudGhlbihmdW5jdGlvbihmb3VuZFJhdGluZykge1xuXHRcdFx0aWYgKGZvdW5kUmF0aW5nKSB7XG5cdFx0XHRcdC8vc2luY2UgcmF0aW5nIG9yIHJldmlldyBpcyB1cGRhdGVkIHNlcGVyYXRseSBpbiBjbGllbnQsIHRoZSBmb2xsb3dpbmdcblx0XHRcdFx0Ly9tYWtlIHN1cmUgaXQgZ2V0cyB1cGRhdGVkIGFjY29yZGluZyB0byB0aGUgcmVxXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKCd1cGRhdGUgcmF0aW5nJywgZm91bmRSYXRpbmcpXG5cdFx0XHRcdGlmIChyZXEuYm9keS5yYXRpbmcpIHtcblx0XHRcdFx0XHR2YXIgcmF0aW5nT2JqID0ge3Njb3JlOiByZXEuYm9keS5yYXRpbmd9O1xuXHRcdFx0XHR9IGVsc2UgaWYgKHJlcS5ib2R5LnJldmlldykge1xuXHRcdFx0XHRcdHZhciByYXRpbmdPYmogPSB7cmV2aWV3OiByZXEuYm9keS5yZXZpZXd9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBuZXcgUmF0aW5nKHsnaWQnOiBmb3VuZFJhdGluZy5hdHRyaWJ1dGVzLmlkfSlcblx0XHRcdFx0XHQuc2F2ZShyYXRpbmdPYmopO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ2NyZWF0aW5nIHJhdGluZycpO1xuXHRcdCAgICByZXR1cm4gUmF0aW5ncy5jcmVhdGUoe1xuXHRcdCAgICBcdHNjb3JlOiByZXEuYm9keS5yYXRpbmcsXG5cdFx0ICAgICAgdXNlcmlkOiB1c2VyaWQsXG5cdFx0ICAgICAgbW92aWVpZDogcmVxLmJvZHkuaWQsXG5cdFx0ICAgICAgcmV2aWV3OiByZXEuYm9keS5yZXZpZXdcblx0XHQgICAgfSk7XHRcdFx0XHRcdFxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KVxuXHQudGhlbihmdW5jdGlvbihuZXdSYXRpbmcpIHtcblx0XHRjb25zb2xlLmxvZygncmF0aW5nIGNyZWF0ZWQ6JywgbmV3UmF0aW5nLmF0dHJpYnV0ZXMpO1xuICBcdHJlcy5zdGF0dXMoMjAxKS5zZW5kKCdyYXRpbmcgcmVjaWV2ZWQnKTtcblx0fSlcbn07XG5cbi8vdGhpcyBoZWxwZXIgZnVuY3Rpb24gYWRkcyB0aGUgbW92aWUgaW50byBkYXRhYmFzZVxuLy9pdCBmb2xsb3dzIHRoZSBzYW1lIG1vdmllIGlkIGFzIFRNREJcbi8vZXhwZWN0cyByZXEuYm9keSB0byBoYXZlIHRoZXNlIGF0cmlidXRlIDoge2lkLCB0aXRsZSwgZ2VucmUsIHBvc3Rlcl9wYXRoLCByZWxlYXNlX2RhdGUsIG92ZXJ2aWV3LCB2b3RlX2F2ZXJhZ2V9XG52YXIgYWRkT25lTW92aWUgPSBmdW5jdGlvbihtb3ZpZU9iaikge1xuXHR2YXIgZ2VucmUgPSAobW92aWVPYmouZ2VucmVfaWRzKSA/IGdlbnJlc1ttb3ZpZU9iai5nZW5yZV9pZHNbMF1dIDogJ24vYSc7XG4gIHJldHVybiBuZXcgTW92aWUoe1xuICBcdGlkOiBtb3ZpZU9iai5pZCxcbiAgICB0aXRsZTogbW92aWVPYmoudGl0bGUsXG4gICAgZ2VucmU6IGdlbnJlLFxuICAgIHBvc3RlcjogJ2h0dHBzOi8vaW1hZ2UudG1kYi5vcmcvdC9wL3cxODUvJyArIG1vdmllT2JqLnBvc3Rlcl9wYXRoLFxuICAgIHJlbGVhc2VfZGF0ZTogbW92aWVPYmoucmVsZWFzZV9kYXRlLFxuICAgIGRlc2NyaXB0aW9uOiBtb3ZpZU9iai5vdmVydmlldy5zbGljZSgwLCAyNTUpLFxuICAgIGltZGJSYXRpbmc6IG1vdmllT2JqLnZvdGVfYXZlcmFnZVxuICB9KS5zYXZlKG51bGwsIHttZXRob2Q6ICdpbnNlcnQnfSlcbiAgLnRoZW4oZnVuY3Rpb24obmV3TW92aWUpIHtcbiAgXHRjb25zb2xlLmxvZygnbW92aWUgY3JlYXRlZCcsIG5ld01vdmllLmF0dHJpYnV0ZXMudGl0bGUpO1xuICBcdHJldHVybiBuZXdNb3ZpZTtcbiAgfSlcbn07XG5cblxuLy9nZXQgYWxsIG1vdmllIHJhdGluZ3MgdGhhdCBhIHVzZXIgcmF0ZWRcbi8vc2hvdWxkIHJldHVybiBhbiBhcnJheSB0aGF0IGxvb2sgbGlrZSB0aGUgZm9sbG93aW5nOlxuLy8gWyB7dGl0bGU6ICduYW1lJywgZ2VucmU6ICdnZW5yZScgLCBwb3N0ZXI6ICd1cmwnLCByZWxlYXNlX2RhdGU6ICdkYXRlJywgc2NvcmU6IG4sIGZyaWVuZEF2ZXJhZ2VSYXRpbmc6IG59IC4uLiBdXG4vLyB3aWxsIGdldCByYXRpbmdzIGZvciB0aGUgY3VycmVudCB1c2VyXG5leHBvcnRzLmdldFVzZXJSYXRpbmdzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgUmF0aW5nLnF1ZXJ5KGZ1bmN0aW9uKHFiKXtcbiAgXHRxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcbiAgXHRxYi5pbm5lckpvaW4oJ21vdmllcycsICdyYXRpbmdzLm1vdmllaWQnLCAnPScsICdtb3ZpZXMuaWQnKTtcbiAgXHRxYi5zZWxlY3QoJ3VzZXJzLnVzZXJuYW1lJywgJ21vdmllcy50aXRsZScsICdtb3ZpZXMuaWQnLCAnbW92aWVzLmdlbnJlJywgJ21vdmllcy5wb3N0ZXInLCAnbW92aWVzLnJlbGVhc2VfZGF0ZScsICdtb3ZpZXMuaW1kYlJhdGluZycsICdtb3ZpZXMuZGVzY3JpcHRpb24nLCAncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycsICdyYXRpbmdzLnVwZGF0ZWRfYXQnKTtcbiAgXHRxYi53aGVyZSgndXNlcnMudXNlcm5hbWUnLCAnPScsIHJlcS5teVNlc3Npb24udXNlcik7XG4gIFx0cWIub3JkZXJCeSgndXBkYXRlZF9hdCcsICdERVNDJylcbiAgfSlcbiAgLmZldGNoQWxsKClcbiAgLnRoZW4oZnVuY3Rpb24ocmF0aW5ncyl7XG5cdFx0Ly9kZWNvcmF0ZSBpdCB3aXRoIGF2ZyBmcmllbmQgcmF0aW5nXG5cdFx0cmV0dXJuIFByb21pc2UubWFwKHJhdGluZ3MubW9kZWxzLCBmdW5jdGlvbihyYXRpbmcpIHtcblx0XHRcdHJldHVybiBhdHRhY2hGcmllbmRBdmdSYXRpbmcocmF0aW5nLCByZXEubXlTZXNzaW9uLnVzZXIpO1xuXHRcdH0pO1xuXHR9KVxuICAudGhlbihmdW5jdGlvbihyYXRpbmdzKSB7XG4gIFx0Y29uc29sZS5sb2coJ3JldHJpdmluZyBhbGwgdXNlciByYXRpbmdzJyk7XG4gIFx0cmVzLnN0YXR1cygyMDApLmpzb24ocmF0aW5ncyk7XG4gIH0pXG59O1xuXG5leHBvcnRzLmdldEZyaWVuZFVzZXJSYXRpbmdzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgUmF0aW5nLnF1ZXJ5KGZ1bmN0aW9uKHFiKXtcbiAgXHRxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcbiAgXHRxYi5pbm5lckpvaW4oJ21vdmllcycsICdyYXRpbmdzLm1vdmllaWQnLCAnPScsICdtb3ZpZXMuaWQnKTtcbiAgXHRxYi5zZWxlY3QoJ3VzZXJzLnVzZXJuYW1lJywgJ21vdmllcy50aXRsZScsICdtb3ZpZXMuaWQnLCAnbW92aWVzLmdlbnJlJywgJ21vdmllcy5wb3N0ZXInLCAnbW92aWVzLnJlbGVhc2VfZGF0ZScsICdtb3ZpZXMuaW1kYlJhdGluZycsICdtb3ZpZXMuZGVzY3JpcHRpb24nLCAncmF0aW5ncy5zY29yZSBhcyBmcmllbmRTY29yZScsICdyYXRpbmdzLnJldmlldyBhcyBmcmllbmRSZXZpZXcnLCAncmF0aW5ncy51cGRhdGVkX2F0Jyk7XG4gIFx0cWIud2hlcmUoJ3VzZXJzLnVzZXJuYW1lJywgJz0nLCByZXEucXVlcnkuZnJpZW5kTmFtZSk7XG4gIFx0cWIub3JkZXJCeSgndXBkYXRlZF9hdCcsICdERVNDJylcbiAgfSlcbiAgLmZldGNoQWxsKClcbiAgLnRoZW4oZnVuY3Rpb24ocmF0aW5ncyl7XG5cdFx0Ly9kZWNvcmF0ZSBpdCB3aXRoIGN1cnJlbnQgdXNlcidzIHJhdGluZ1xuXHRcdHJldHVybiBQcm9taXNlLm1hcChyYXRpbmdzLm1vZGVscywgZnVuY3Rpb24ocmF0aW5nKSB7XG5cdFx0XHRyZXR1cm4gYXR0YWNoVXNlclJhdGluZyhyYXRpbmcsIHJlcS5teVNlc3Npb24udXNlcik7XG5cdFx0fSk7XG5cdH0pXG4gIC50aGVuKGZ1bmN0aW9uKHJhdGluZ3MpIHtcbiAgXHRjb25zb2xlLmxvZygncmV0cml2aW5nIGFsbCB1c2VyIHJhdGluZ3MnKTtcbiAgXHRyZXMuc3RhdHVzKDIwMCkuanNvbihyYXRpbmdzKTtcbiAgfSlcbn07XG5cbi8vYSBkZWNvcmF0b3IgZnVuY3Rpb24gdGhhdCBhdHRhY2hlcyBmcmllbmQgYXZnIHJhdGluZyB0byB0aGUgcmF0aW5nIG9ialxudmFyIGF0dGFjaEZyaWVuZEF2Z1JhdGluZyA9IGZ1bmN0aW9uKHJhdGluZywgdXNlcm5hbWUpIHtcblx0cmV0dXJuIGV4cG9ydHMuZ2V0RnJpZW5kUmF0aW5ncyh1c2VybmFtZSwgcmF0aW5nKVxuXHQudGhlbihmdW5jdGlvbihmcmllbmRzUmF0aW5ncyl7XG5cdFx0Ly9pZiBmcmllbmRzUmF0aW5ncyBpcyBudWxsLCBSYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nIGlzIG51bGxcblx0XHRpZiAoIWZyaWVuZHNSYXRpbmdzKSB7XG5cdFx0XHRyYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nID0gbnVsbDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyA9IGF2ZXJhZ2VSYXRpbmcoZnJpZW5kc1JhdGluZ3MpO1xuXHRcdH1cblx0XHRyZXR1cm4gcmF0aW5nO1xuXHR9KVxufVxuXG4vL2EgZGVjb3JhdG9yIGZ1bmN0aW9uIHRoYXQgYXR0YWNoZXMgdXNlciByYXRpbmcgYW5kIHJldmlld3MgdG8gdGhlIHJhdGluZyBvYmpcbnZhciBhdHRhY2hVc2VyUmF0aW5nID0gZnVuY3Rpb24ocmF0aW5nLCB1c2VybmFtZSkge1xuXHRyZXR1cm4gUmF0aW5nLnF1ZXJ5KGZ1bmN0aW9uKHFiKSB7XG5cdFx0cWIuaW5uZXJKb2luKCd1c2VycycsICd1c2Vycy5pZCcsICc9JywgJ3JhdGluZ3MudXNlcmlkJylcblx0XHRxYi5pbm5lckpvaW4oJ21vdmllcycsICdtb3ZpZXMuaWQnLCAnPScsICdyYXRpbmdzLm1vdmllaWQnKVxuXHRcdHFiLnNlbGVjdCgncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycpXG5cdFx0cWIud2hlcmUoe1xuXHRcdFx0J3VzZXJzLnVzZXJuYW1lJzogdXNlcm5hbWUsXG5cdFx0XHQnbW92aWVzLnRpdGxlJzogcmF0aW5nLmF0dHJpYnV0ZXMudGl0bGUsXG5cdFx0XHQnbW92aWVzLmlkJzogcmF0aW5nLmF0dHJpYnV0ZXMuaWRcblx0XHR9KVxuXHR9KVxuXHQuZmV0Y2goKVxuXHQudGhlbihmdW5jdGlvbih1c2VyUmF0aW5nKXtcblx0XHRpZiAodXNlclJhdGluZykge1xuXHRcdFx0cmF0aW5nLmF0dHJpYnV0ZXMuc2NvcmUgPSB1c2VyUmF0aW5nLmF0dHJpYnV0ZXMuc2NvcmU7XG5cdFx0XHRyYXRpbmcuYXR0cmlidXRlcy5yZXZpZXcgPSB1c2VyUmF0aW5nLmF0dHJpYnV0ZXMucmV2aWV3O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyYXRpbmcuYXR0cmlidXRlcy5zY29yZSA9IG51bGw7XG5cdFx0XHRyYXRpbmcuYXR0cmlidXRlcy5yZXZpZXcgPSBudWxsO1xuXHRcdH1cblx0XHRyZXR1cm4gcmF0aW5nO1xuXHR9KTtcbn07XG5cbi8vdGhpcyBpcyBhIHdyYXBlciBmdW5jdGlvbiBmb3IgZ2V0RnJpZW5kUmF0aW5ncyB3aGljaCB3aWxsIHNlbnQgdGhlIGNsaWVudCBhbGwgb2YgdGhlIGZyaWVuZCByYXRpbmdzXG5leHBvcnRzLmhhbmRsZUdldEZyaWVuZFJhdGluZ3MgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXHRjb25zb2xlLmxvZygnaGFuZGxlR2V0RnJpZW5kUmF0aW5ncywgJywgcmVxLm15U2Vzc2lvbi51c2VyLCByZXEuYm9keS5tb3ZpZS50aXRsZSk7XG5cdGV4cG9ydHMuZ2V0RnJpZW5kUmF0aW5ncyhyZXEubXlTZXNzaW9uLnVzZXIsIHthdHRyaWJ1dGVzOiByZXEuYm9keS5tb3ZpZX0pXG5cdC50aGVuKGZ1bmN0aW9uKGZyaWVuZFJhdGluZ3Mpe1xuXHRcdHJlcy5qc29uKGZyaWVuZFJhdGluZ3MpO1xuXHR9KTtcbn1cblxuLy90aGlzIGZ1bmN0aW9uIG91dHB1dHMgcmF0aW5ncyBvZiBhIHVzZXIncyBmcmllbmQgZm9yIGEgcGFydGljdWxhciBtb3ZpZVxuLy9leHBlY3QgY3VycmVudCB1c2VybmFtZSBhbmQgbW92aWVUaXRsZSBhcyBpbnB1dFxuLy9vdXRwdXRzOiB7dXNlcjJpZDogJ2lkJywgZnJpZW5kVXNlck5hbWU6J25hbWUnLCBmcmllbmRGaXJzdE5hbWU6J25hbWUnLCB0aXRsZTonbW92aWVUaXRsZScsIHNjb3JlOm4gfVxuZXhwb3J0cy5nZXRGcmllbmRSYXRpbmdzID0gZnVuY3Rpb24odXNlcm5hbWUsIG1vdmllT2JqKSB7XG5cdHJldHVybiBVc2VyLnF1ZXJ5KGZ1bmN0aW9uKHFiKXtcblx0XHRxYi5pbm5lckpvaW4oJ3JlbGF0aW9ucycsICdyZWxhdGlvbnMudXNlcjFpZCcsICc9JywgJ3VzZXJzLmlkJyk7XG5cdFx0cWIuaW5uZXJKb2luKCdyYXRpbmdzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAncmVsYXRpb25zLnVzZXIyaWQnKTtcblx0XHRxYi5pbm5lckpvaW4oJ21vdmllcycsICdyYXRpbmdzLm1vdmllaWQnLCAnPScsICdtb3ZpZXMuaWQnKTtcblx0XHRxYi5zZWxlY3QoJ3JlbGF0aW9ucy51c2VyMmlkJywgJ21vdmllcy50aXRsZScsICdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3Jyk7XG5cdFx0cWIud2hlcmUoe1xuXHRcdFx0J3VzZXJzLnVzZXJuYW1lJzogdXNlcm5hbWUsIFxuXHRcdFx0J21vdmllcy50aXRsZSc6IG1vdmllT2JqLmF0dHJpYnV0ZXMudGl0bGUsXG5cdFx0XHQnbW92aWVzLmlkJzogbW92aWVPYmouYXR0cmlidXRlcy5pZCB9KTtcblx0fSlcblx0LmZldGNoQWxsKClcblx0LnRoZW4oZnVuY3Rpb24oZnJpZW5kc1JhdGluZ3Mpe1xuXHQvL3RoZSBmb2xsb3dpbmcgYmxvY2sgYWRkcyB0aGUgZnJpZW5kTmFtZSBhdHRyaWJ1dGUgdG8gdGhlIHJhdGluZ3Ncblx0XHRyZXR1cm4gUHJvbWlzZS5tYXAoZnJpZW5kc1JhdGluZ3MubW9kZWxzLCBmdW5jdGlvbihmcmllbmRSYXRpbmcpIHtcblx0XHRcdHJldHVybiBuZXcgVXNlcih7IGlkOiBmcmllbmRSYXRpbmcuYXR0cmlidXRlcy51c2VyMmlkIH0pLmZldGNoKClcblx0XHRcdC50aGVuKGZ1bmN0aW9uKGZyaWVuZCl7XG5cdFx0XHRcdGZyaWVuZFJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZFVzZXJOYW1lID0gZnJpZW5kLmF0dHJpYnV0ZXMudXNlcm5hbWU7XG5cdFx0XHRcdGZyaWVuZFJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEZpcnN0TmFtZSA9IGZyaWVuZC5hdHRyaWJ1dGVzLmZpcnN0TmFtZTtcblx0XHRcdFx0cmV0dXJuIGZyaWVuZFJhdGluZztcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9KVxuXHQudGhlbihmdW5jdGlvbihmcmllbmRzUmF0aW5ncyl7XG5cdFx0cmV0dXJuIGZyaWVuZHNSYXRpbmdzO1xuXHR9KTtcbn07XG5cblxuLy9hIGhlbHBlciBmdW5jdGlvbiB0aGF0IGF2ZXJhZ2VzIHRoZSByYXRpbmdcbi8vaW5wdXRzIHJhdGluZ3MsIG91dHB1dHMgdGhlIGF2ZXJhZ2Ugc2NvcmU7XG52YXIgYXZlcmFnZVJhdGluZyA9IGZ1bmN0aW9uKHJhdGluZ3MpIHtcblx0Ly9yZXR1cm4gbnVsbCBpZiBubyBmcmllbmQgaGFzIHJhdGVkIHRoZSBtb3ZpZVxuXHRpZiAocmF0aW5ncy5sZW5ndGggPT09IDApIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRyZXR1cm4gcmF0aW5nc1xuXHQucmVkdWNlKGZ1bmN0aW9uKHRvdGFsLCByYXRpbmcpe1xuXHRcdHJldHVybiB0b3RhbCArPSByYXRpbmcuYXR0cmlidXRlcy5zY29yZTtcblx0fSwgMCkgLyByYXRpbmdzLmxlbmd0aDtcbn1cblxuXG4vL2EgaGVscGVyIGZ1bmN0aW9uIHRoYXQgb3V0cHV0cyB1c2VyIHJhdGluZyBhbmQgYXZlcmFnZSBmcmllbmQgcmF0aW5nIGZvciBvbmUgbW92aWVcbi8vb3V0cHV0cyBvbmUgcmF0aW5nIG9iajoge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnICwgcG9zdGVyOiAndXJsJywgcmVsZWFzZV9kYXRlOiAnZGF0ZScsIHNjb3JlOiBuLCBmcmllbmRBdmVyYWdlUmF0aW5nOiBufVxudmFyIGdldE9uZU1vdmllUmF0aW5nID0gZnVuY3Rpb24odXNlcm5hbWUsIG1vdmllT2JqKSB7XG4gIHJldHVybiBSYXRpbmcucXVlcnkoZnVuY3Rpb24ocWIpe1xuICBcdHFiLmlubmVySm9pbigndXNlcnMnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICd1c2Vycy5pZCcpO1xuICBcdHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xuICBcdHFiLnNlbGVjdCgndXNlcnMudXNlcm5hbWUnLCAnbW92aWVzLnRpdGxlJywgJ21vdmllcy5pZCcsICdtb3ZpZXMuZ2VucmUnLCAnbW92aWVzLnBvc3RlcicsICdtb3ZpZXMucmVsZWFzZV9kYXRlJywgJ21vdmllcy5pbWRiUmF0aW5nJywgJ21vdmllcy5kZXNjcmlwdGlvbicsICdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3Jyk7XG4gIFx0cWIud2hlcmUoeyd1c2Vycy51c2VybmFtZSc6IHVzZXJuYW1lLCAnbW92aWVzLnRpdGxlJzogbW92aWVPYmoudGl0bGUsICdtb3ZpZXMuaWQnOiBtb3ZpZU9iai5pZH0pO1xuICB9KVxuICAuZmV0Y2goKVxuICAudGhlbihmdW5jdGlvbihyYXRpbmcpe1xuXHQgIGlmICghcmF0aW5nKSB7XG5cdCAgXHQvL2lmIHRoZSB1c2VyIGhhcyBub3QgcmF0ZWQgdGhlIG1vdmllLCByZXR1cm4gYW4gb2JqIHRoYXQgaGFzIHRoZSBtb3ZpZSBpbmZvcm1hdGlvbiwgYnV0IHNjb3JlIGlzIHNldCB0byBudWxsXG5cdCAgXHRyZXR1cm4gbmV3IE1vdmllKHt0aXRsZTogbW92aWVPYmoudGl0bGUsIGlkOiBtb3ZpZU9iai5pZH0pLmZldGNoKClcblx0ICBcdC50aGVuKGZ1bmN0aW9uKG1vdmllKSB7XG5cdCAgXHRcdG1vdmllLmF0dHJpYnV0ZXMuc2NvcmUgPSBudWxsO1xuXHQgIFx0XHRyZXR1cm4gbW92aWU7XG5cdCAgXHR9KVxuXHQgIH0gZWxzZSB7XG5cdCAgXHRyZXR1cm4gcmF0aW5nO1xuXHQgIH1cblx0fSlcblx0LnRoZW4oZnVuY3Rpb24ocmF0aW5nKXtcblx0XHRyZXR1cm4gZXhwb3J0cy5nZXRGcmllbmRSYXRpbmdzKHVzZXJuYW1lLCByYXRpbmcpXG5cdFx0LnRoZW4oZnVuY3Rpb24oZnJpZW5kc1JhdGluZ3Mpe1xuXHRcdFx0Ly8gY29uc29sZS5sb2coJ2ZyaWVuZHNSYXRpbmdzJywgZnJpZW5kc1JhdGluZ3MpO1xuXHRcdFx0cmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyA9IGF2ZXJhZ2VSYXRpbmcoZnJpZW5kc1JhdGluZ3MpO1xuXHRcdFx0Y29uc29sZS5sb2coJ2FkZGVkIGF2ZXJhZ2UgZnJpZW5kIHJhdGluZycsIHJhdGluZy5hdHRyaWJ1dGVzLnRpdGxlLCByYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nKTtcblx0XHRcdHJldHVybiByYXRpbmc7XG5cdFx0fSk7XG5cdH0pO1xufVxuXG5cbi8vdGhpcyBoYW5kbGVyIGlzIHNwZWNpZmljYWxseSBmb3Igc2VuZGluZyBvdXQgYSBsaXN0IG9mIG1vdmllIHJhdGluZ3Mgd2hlbiB0aGUgY2xpZW50IHNlbmRzIGEgbGlzdCBvZiBtb3ZpZSB0byB0aGUgc2VydmVyXG4vL2V4cGVjdHMgcmVxLmJvZHkgdG8gYmUgYW4gYXJyYXkgb2Ygb2JqIHdpdGggdGhlc2UgYXR0cmlidXRlczoge2lkLCB0aXRsZSwgZ2VucmUsIHBvc3Rlcl9wYXRoLCByZWxlYXNlX2RhdGUsIG92ZXJ2aWV3LCB2b3RlX2F2ZXJhZ2V9XG4vL291dHB1dHMgWyB7dGl0bGU6ICduYW1lJywgZ2VucmU6ICdnZW5yZScgLCBwb3N0ZXI6ICd1cmwnLCByZWxlYXNlX2RhdGU6ICdkYXRlJywgc2NvcmU6IG4sIGZyaWVuZEF2ZXJhZ2VSYXRpbmc6IG59IC4uLiBdXG5leHBvcnRzLmdldE11bHRpcGxlTW92aWVSYXRpbmdzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcblx0Y29uc29sZS5sb2coJ2dldE11bHRpcGxlTW92aWVSYXRpbmdzJyk7XG5cdFByb21pc2UubWFwKHJlcS5ib2R5Lm1vdmllcywgZnVuY3Rpb24obW92aWUpIHtcblx0XHQvL2ZpcnN0IGNoZWNrIHdoZXRoZXIgbW92aWUgaXMgaW4gdGhlIGRhdGFiYXNlXG5cdFx0cmV0dXJuIG5ldyBNb3ZpZSh7dGl0bGU6IG1vdmllLnRpdGxlLCBpZDogbW92aWUuaWR9KS5mZXRjaCgpXG5cdFx0LnRoZW4oZnVuY3Rpb24oZm91bmRNb3ZpZSkge1xuXHRcdFx0Ly9pZiBub3QgY3JlYXRlIG9uZVxuXHRcdFx0aWYgKCFmb3VuZE1vdmllKSB7XG5cdFx0XHRcdHJldHVybiBhZGRPbmVNb3ZpZShtb3ZpZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gZm91bmRNb3ZpZTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC50aGVuKGZ1bmN0aW9uKGZvdW5kTW92aWUpe1xuXHRcdFx0Ly8gY29uc29sZS5sb2coJ2ZvdW5kIG1vdmllJywgZm91bmRNb3ZpZSk7XG5cdFx0XHRyZXR1cm4gZ2V0T25lTW92aWVSYXRpbmcocmVxLm15U2Vzc2lvbi51c2VyLCBmb3VuZE1vdmllLmF0dHJpYnV0ZXMpO1xuXHRcdH0pXG5cdH0pXG5cdC50aGVuKGZ1bmN0aW9uKHJhdGluZ3Mpe1xuXHRcdGNvbnNvbGUubG9nKCdzZW5kaW5nIHJhdGluZyB0byBjbGllbnQnKTtcblx0XHRyZXMuanNvbihyYXRpbmdzKTtcblx0fSlcbn1cblxuLy90aGlzIGhhbmRsZXIgc2VuZHMgYW4gZ2V0IHJlcXVlc3QgdG8gVE1EQiBBUEkgdG8gcmV0cml2ZSByZWNlbnQgdGl0bGVzXG4vL3dlIGNhbm5vdCBkbyBpdCBpbiB0aGUgZnJvbnQgZW5kIGJlY2F1c2UgY3Jvc3Mgb3JpZ2luIHJlcXVlc3QgaXNzdWVzXG5leHBvcnRzLmdldFJlY2VudFJlbGVhc2UgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICB2YXIgcGFyYW1zID0ge1xuICAgIGFwaV9rZXk6ICc5ZDNiMDM1ZWYxY2Q2NjlhZWQzOTg0MDBiMTdmY2VhMicsXG4gICAgcHJpbWFyeV9yZWxlYXNlX3llYXI6IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKSxcbiAgICBpbmNsdWRlX2FkdWx0OiBmYWxzZSxcbiAgICBzb3J0X2J5OiAncG9wdWxhcml0eS5kZXNjJ1xuICB9O1xuXG5cdCBcbiAgdmFyIGRhdGEgPSAnJztcblx0cmVxdWVzdCh7XG5cdFx0bWV0aG9kOiAnR0VUJyxcblx0XHR1cmw6ICdodHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zL2Rpc2NvdmVyL21vdmllLycsXG5cdFx0cXM6IHBhcmFtc1xuXHR9KVxuXHQub24oJ2RhdGEnLGZ1bmN0aW9uKGNodW5rKXtcblx0XHRkYXRhICs9IGNodW5rO1xuXHR9KVxuXHQub24oJ2VuZCcsIGZ1bmN0aW9uKCl7XG5cdFx0cmVjZW50TW92aWVzID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICByZXEuYm9keS5tb3ZpZXMgPSByZWNlbnRNb3ZpZXMucmVzdWx0cztcbiAgICAvL3RyYW5zZmVycyB0aGUgbW92aWUgZGF0YSB0byBnZXRNdWx0aXBsZU1vdmllUmF0aW5ncyB0byBkZWNvcmF0ZSB3aXRoIHNjb3JlICh1c2VyIHJhdGluZykgYW5kIGF2Z2ZyaWVuZFJhdGluZyBhdHRyaWJ1dGVcbiAgICBleHBvcnRzLmdldE11bHRpcGxlTW92aWVSYXRpbmdzKHJlcSwgcmVzKTtcblxuXHR9KVxuXHQub24oJ2Vycm9yJywgZnVuY3Rpb24oZXJyb3Ipe1xuXHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0fSlcblxufVxuXG4vL3RoaXMgaXMgVE1EQidzIGdlbnJlIGNvZGUsIHdlIG1pZ2h0IHdhbnQgdG8gcGxhY2UgdGhpcyBzb21ld2hlcmUgZWxzZVxudmFyIGdlbnJlcyA9IHtcbiAgIDEyOiBcIkFkdmVudHVyZVwiLFxuICAgMTQ6IFwiRmFudGFzeVwiLFxuICAgMTY6IFwiQW5pbWF0aW9uXCIsXG4gICAxODogXCJEcmFtYVwiLFxuICAgMjc6IFwiSG9ycm9yXCIsXG4gICAyODogXCJBY3Rpb25cIixcbiAgIDM1OiBcIkNvbWVkeVwiLFxuICAgMzY6IFwiSGlzdG9yeVwiLFxuICAgMzc6IFwiV2VzdGVyblwiLFxuICAgNTM6IFwiVGhyaWxsZXJcIixcbiAgIDgwOiBcIkNyaW1lXCIsXG4gICA5OTogXCJEb2N1bWVudGFyeVwiLFxuICAgODc4OiBcIlNjaWVuY2UgRmljdGlvblwiLFxuICAgOTY0ODogXCJNeXN0ZXJ5XCIsXG4gICAxMDQwMjogXCJNdXNpY1wiLFxuICAgMTA3NDk6IFwiUm9tYW5jZVwiLFxuICAgMTA3NTE6IFwiRmFtaWx5XCIsXG4gICAxMDc1MjogXCJXYXJcIixcbiAgIDEwNzY5OiBcIkZvcmVpZ25cIixcbiAgIDEwNzcwOiBcIlRWIE1vdmllXCJcbiB9O1xuXG4vL3RoaXMgZnVuY3Rpb24gd2lsbCBzZW5kIGJhY2sgc2VhcmNiIG1vdmllcyB1c2VyIGhhcyByYXRlZCBpbiB0aGUgZGF0YWJhc2Vcbi8vaXQgd2lsbCBzZW5kIGJhY2sgbW92aWUgb2JqcyB0aGF0IG1hdGNoIHRoZSBzZWFyY2ggaW5wdXQsIGV4cGVjdHMgbW92aWUgbmFtZSBpbiByZXEuYm9keS50aXRsZVxuZXhwb3J0cy5zZWFyY2hSYXRlZE1vdmllID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgcmV0dXJuIFJhdGluZy5xdWVyeShmdW5jdGlvbihxYil7XG5cdFx0cWIuaW5uZXJKb2luKCd1c2VycycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3VzZXJzLmlkJyk7XG5cdFx0cWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XG5cdFx0cWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnKTtcbiAgXHRxYi53aGVyZVJhdyhgTUFUQ0ggKG1vdmllcy50aXRsZSkgQUdBSU5TVCAoJyR7cmVxLnF1ZXJ5LnRpdGxlfScgSU4gTkFUVVJBTCBMQU5HVUFHRSBNT0RFKWApXG4gIFx0cWIuYW5kV2hlcmUoJ3VzZXJzLnVzZXJuYW1lJywgJz0nLCByZXEubXlTZXNzaW9uLnVzZXIpXG4gIFx0cWIub3JkZXJCeSgndXBkYXRlZF9hdCcsICdERVNDJylcbiAgfSlcbiAgLmZldGNoQWxsKClcbiAgLnRoZW4oZnVuY3Rpb24obWF0Y2hlcyl7XG4gIFx0Y29uc29sZS5sb2cobWF0Y2hlcy5tb2RlbHMpO1xuICBcdHJlcy5qc29uKG1hdGNoZXMpO1xuICB9KVxufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vZnJpZW5kc2hpcCBoYW5kbGVyc1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmV4cG9ydHMuZ2V0RnJpZW5kTGlzdCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cdHJldHVybiBSZWxhdGlvbi5xdWVyeShmdW5jdGlvbihxYil7XG5cdFx0cWIuaW5uZXJKb2luKCd1c2VycycsICdyZWxhdGlvbnMudXNlcjFpZCcsICc9JywgJ3VzZXJzLmlkJyk7XG5cdFx0cWIuc2VsZWN0KCdyZWxhdGlvbnMudXNlcjJpZCcpO1xuXHRcdHFiLndoZXJlKHtcblx0XHRcdCd1c2Vycy51c2VybmFtZSc6IHJlcS5teVNlc3Npb24udXNlclxuXHRcdH0pXG5cdH0pXG5cdC5mZXRjaEFsbCgpXG5cdC50aGVuKGZ1bmN0aW9uKGZyaWVuZHMpe1xuXHRcdHJldHVybiBQcm9taXNlLm1hcChmcmllbmRzLm1vZGVscywgZnVuY3Rpb24oZnJpZW5kKSB7XG5cdFx0XHRyZXR1cm4gbmV3IFVzZXIoe2lkOiBmcmllbmQuYXR0cmlidXRlcy51c2VyMmlkfSkuZmV0Y2goKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oZnJpZW5kVXNlcil7XG5cdFx0XHRcdHJldHVybiBmcmllbmRVc2VyLmF0dHJpYnV0ZXMudXNlcm5hbWU7XG5cdFx0XHR9KVxuXHRcdH0pXG5cdH0pXG5cdC50aGVuKGZ1bmN0aW9uKGZyaWVuZHMpe1xuXHRcdGNvbnNvbGUubG9nKCdzZW5kaW5nIGEgbGlzdCBvZiBmcmllbmQgbmFtZXMnLCBmcmllbmRzKTtcblx0XHRyZXMuanNvbihmcmllbmRzKTtcblx0fSlcbn1cblxuLy90aGlzIHdvdWxkIHNlbmQgYSBub3RpY2UgdG8gdGhlIHVzZXIgd2hvIHJlY2VpdmUgdGhlIGZyaWVuZCByZXF1ZXN0LCBwcm9tcHRpbmcgdGhlbSB0byBhY2NlcHQgb3IgZGVueSB0aGUgcmVxdWVzdFxuZXhwb3J0cy5hZGRGcmllbmQgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXG59O1xuXG5cbi8vdGhpcyB3b3VsZCBjb25maXJtIHRoZSBmcmllbmRzaGlwIGFuZCBlc3RhYmxpc2ggdGhlIHJlbGF0aW9uc2hpcCBpbiB0aGUgZGF0YWJhc2VcbmV4cG9ydHMuY29uZmlybUZyaWVuZHNoaXAgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXG59O1xuXG5cblxuZXhwb3J0cy5nZXRGcmllbmRzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgdmFyIHBlb3BsZUlkID0gW107XG4gIHZhciBpZCA9IHJlcS5teVNlc3Npb24udXNlclxuICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIGlkLCBmdW5jdGlvbihlcnIsIHJlc3ApIHtcbiAgICB2YXIgdXNlcmlkID0gcmVzcFswXS5pZDtcbiAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgYmUgbGluZy8yJyxpZClcbiAgXG4gICAgY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHJhdGluZ3MgV0hFUkUgdXNlcmlkID0gPycsIHVzZXJpZCwgZnVuY3Rpb24oZXJyLCByZXNwKSB7XG4gICAgICB2YXIgdXNlcnNSYXRpbmdzPXJlc3AubWFwKGZ1bmN0aW9uKGEpeyByZXR1cm4gW2EubW92aWVpZCwgYS5zY29yZV19KTtcblxuICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHJlbGF0aW9ucyBXSEVSRSB1c2VyMWlkID0gPycsIHVzZXJpZCwgZnVuY3Rpb24oZXJyLCByZXNwKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChwZW9wbGVJZC5pbmRleE9mKHJlc3BbaV0udXNlcjJpZCkgPT09IC0xKSB7XG4gICAgICAgICAgICBwZW9wbGVJZC5wdXNoKHJlc3BbaV0udXNlcjJpZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBwZW9wbGUgPSBbXVxuICAgICAgICBjb25zb2xlLmxvZygnVGhpcyBzaG91bGQgYWxzbyBiZSBwZW9wbGVlZScscGVvcGxlSWQpO1xuICAgICAgICB2YXIga2V5SWQ9e307XG4gICAgICAgIHBlb3BsZUlkLmZvckVhY2goZnVuY3Rpb24oYSkge1xuXG4gICAgICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgdXNlcm5hbWUgRlJPTSB1c2VycyBXSEVSRSBpZCA9ID8nLCBhLCBmdW5jdGlvbihlcnIsIHJlc3BvKSB7XG4gIFx0ICAgICAgICBrZXlJZFthXT1yZXNwb1swXS51c2VybmFtZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0aGlzIGlzIE9ORSBvZiB0aGUgcGVvcGxlISEnLHJlc3BvWzBdLnVzZXJuYW1lKVxuICAgICAgICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHJhdGluZ3MgV0hFUkUgdXNlcmlkID0nKydcIicrYSsnXCInLCBmdW5jdGlvbihlcnIsIHJlKSB7XG4gICAgICBcdCAgICAgIGNvbnNvbGUubG9nKCd0aGlzIGlzIGEnLGEpXG4gICAgICBcdCAgICAgIGlmIChyZS5sZW5ndGg9PT0wKXtcbiAgICAgIFx0XHQgICAgICByZT1be3VzZXJpZDphLG1vdmllaWQ6TWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKjEwMDAwKSxzY29yZTo5OX1dXG4gICAgICBcdCAgICAgIH1cbiAgICAgIFx0ICAgICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGJlIHRoZSByYXRpbmdzIGZyb20gZWFjaCBwZXJzb24hIScscmUpO1xuXG4gICAgICAgICAgICAgIHBlb3BsZS5wdXNoKHJlLm1hcChmdW5jdGlvbihhKXtyZXR1cm4gW2EudXNlcmlkLGEubW92aWVpZCxhLnNjb3JlXTt9KSk7XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBpZiAocGVvcGxlLmxlbmd0aD09PXBlb3BsZUlkLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgdmFyIGZpbmFsID0ge307XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgYmUgcGVvcGxlJywgcGVvcGxlKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBlb3BsZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgaWYgKHBlb3BsZVtpXVswXSE9PXVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgICAgIGZpbmFsW2tleUlkW3Blb3BsZVtpXVswXVswXV1dID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgcGVvcGxlW2ldLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgZmluYWxba2V5SWRbcGVvcGxlW2ldWzBdWzBdXV0ucHVzaChbXSk7XG4gICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeiA9IDE7IHogPCBwZW9wbGVbaV1beF0ubGVuZ3RoOyB6KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsW2tleUlkW3Blb3BsZVtpXVswXVswXV1dW3hdLnB1c2gocGVvcGxlW2ldW3hdW3pdKVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdmaW5hbCcsZmluYWwsdXNlcnNSYXRpbmdzKTtcblxuICAgICAgICAgICAgICAgIHZhciBjb21wYXJpc29ucz17fTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gZmluYWwpe1xuICAgICAgICAgICAgICAgICAgY29tcGFyaXNvbnNba2V5XT1jb21wKHVzZXJzUmF0aW5ncyxmaW5hbFtrZXldKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjb21wYXJpc29ucyk7XG4gICAgICAgICAgICAgICAgdmVyeUZpbmFsPVtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBjb21wYXJpc29ucyl7XG4gICAgICAgICAgICAgICAgICB2ZXJ5RmluYWwucHVzaChba2V5LGNvbXBhcmlzb25zW2tleV1dKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2ZXJ5RmluYWwpO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHZlcnlGaW5hbCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59O1xuXG5cblxuLy9UQkRcbmV4cG9ydHMuZ2V0SGlnaENvbXBhdGliaWxpdHlVc2VycyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIFxufTtcblxuXG4vL1RCRFxuZXhwb3J0cy5nZXRSZWNvbW1lbmRlZE1vdmllcyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cbn07Il19
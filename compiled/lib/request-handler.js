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
  host: '127.0.0.1',
  user: 'root',
  password: '12345',
  database: 'MainDatabase'
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
  }).catch(function (err) {
    res.status(500).send('error');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9yZXF1ZXN0LWhhbmRsZXIuanMiXSwibmFtZXMiOlsiaGVscGVyIiwibnVtMSIsIm51bTIiLCJkaWZmIiwiTWF0aCIsImFicyIsImNvbXAiLCJmaXJzdCIsInNlY29uZCIsImZpbmFsIiwiaSIsImxlbmd0aCIsIngiLCJwdXNoIiwic3VtIiwicmVkdWNlIiwiYSIsImIiLCJyb3VuZCIsImRiIiwicmVxdWlyZSIsIm15c3FsIiwiZXhwcmVzcyIsIk1vdmllIiwiUmF0aW5nIiwiUmVsYXRpb24iLCJVc2VyIiwiYWxsUmVxdWVzdCIsIk1vdmllcyIsIlJhdGluZ3MiLCJSZWxhdGlvbnMiLCJVc2VycyIsImFsbFJlcXVlc3RzIiwiUHJvbWlzZSIsInJlcXVlc3QiLCJjb24iLCJjcmVhdGVDb25uZWN0aW9uIiwiaG9zdCIsInVzZXIiLCJwYXNzd29yZCIsImRhdGFiYXNlIiwiY29ubmVjdCIsImVyciIsImNvbnNvbGUiLCJsb2ciLCJleHBvcnRzIiwic2lnbnVwVXNlciIsInJlcSIsInJlcyIsImJvZHkiLCJ1c2VybmFtZSIsIm5hbWUiLCJmZXRjaCIsInRoZW4iLCJmb3VuZCIsInN0YXR1cyIsInNlbmQiLCJteVNlc3Npb24iLCJjcmVhdGUiLCJzZW5kV2F0Y2hSZXF1ZXN0IiwicmVzcG9uc2UiLCJyZXF1ZXN0ZWUiLCJBcnJheSIsImlzQXJyYXkiLCJyZXF1ZXN0ZWVzIiwiZWFjaCIsIm1lc3NhZ2UiLCJyZXF1ZXN0b3IiLCJyZXF1ZXN0VHlwIiwibW92aWUiLCJxdWVyeSIsImluc2VydElkIiwiZG9uZSIsInJlbW92ZVdhdGNoUmVxdWVzdCIsImZvcmdlIiwiZGVzdHJveSIsImpzb24iLCJlcnJvciIsImRhdGEiLCJjYXRjaCIsInNlbmRSZXF1ZXN0IiwidW5kZWZpbmVkIiwidGVzdCIsImZpbHRlciIsInRlc3QyIiwibWFwIiwicmVzcCIsImxpc3RSZXF1ZXN0cyIsImFjY2VwdCIsInBlcnNvblRvQWNjZXB0IiwicmVxdWVzdFR5cGUiLCJpZCIsInBlcnNvbjEiLCJwZXJzb24yIiwidXNlcjFpZCIsInVzZXIyaWQiLCJyZXF1ZXN0MiIsInJlbW92ZVJlcXVlc3QiLCJnZXRUaGlzRnJpZW5kc01vdmllcyIsIm1vdmllcyIsInNwZWNpZmljRnJpZW5kIiwicGVyc29uIiwibGVuIiwiZm9yRWFjaCIsIm1vdmllaWQiLCJ0aXRsZSIsInNjb3JlIiwicmV2aWV3IiwiZmluZE1vdmllQnVkZGllcyIsInBlb3BsZSIsIklkcyIsImlkS2V5T2JqIiwiY3VycmVudFVzZXIiLCJvYmoxIiwicmVzcG9uIiwidXNlcmlkIiwiY3VycmVudFVzZXJJbmZvIiwiY29tcGFyaXNvbnMiLCJrZXkiLCJmaW5hbFNlbmQiLCJkZWNsaW5lIiwicGVyc29uVG9EZWNsaW5lIiwic2lnbmluVXNlciIsImF0dHJpYnV0ZXMiLCJsb2dvdXQiLCJyYXRlTW92aWUiLCJmb3VuZFVzZXIiLCJmb3VuZFJhdGluZyIsInJhdGluZyIsInJhdGluZ09iaiIsInNhdmUiLCJuZXdSYXRpbmciLCJhZGRPbmVNb3ZpZSIsIm1vdmllT2JqIiwiZ2VucmUiLCJnZW5yZV9pZHMiLCJnZW5yZXMiLCJwb3N0ZXIiLCJwb3N0ZXJfcGF0aCIsInJlbGVhc2VfZGF0ZSIsImRlc2NyaXB0aW9uIiwib3ZlcnZpZXciLCJzbGljZSIsImltZGJSYXRpbmciLCJ2b3RlX2F2ZXJhZ2UiLCJtZXRob2QiLCJuZXdNb3ZpZSIsImdldFVzZXJSYXRpbmdzIiwicWIiLCJpbm5lckpvaW4iLCJzZWxlY3QiLCJ3aGVyZSIsIm9yZGVyQnkiLCJmZXRjaEFsbCIsInJhdGluZ3MiLCJtb2RlbHMiLCJhdHRhY2hGcmllbmRBdmdSYXRpbmciLCJnZXRGcmllbmRVc2VyUmF0aW5ncyIsImZyaWVuZE5hbWUiLCJhdHRhY2hVc2VyUmF0aW5nIiwiZ2V0RnJpZW5kUmF0aW5ncyIsImZyaWVuZHNSYXRpbmdzIiwiZnJpZW5kQXZlcmFnZVJhdGluZyIsImF2ZXJhZ2VSYXRpbmciLCJ1c2VyUmF0aW5nIiwiaGFuZGxlR2V0RnJpZW5kUmF0aW5ncyIsImZyaWVuZFJhdGluZ3MiLCJmcmllbmRSYXRpbmciLCJmcmllbmQiLCJmcmllbmRVc2VyTmFtZSIsImZyaWVuZEZpcnN0TmFtZSIsImZpcnN0TmFtZSIsInRvdGFsIiwiZ2V0T25lTW92aWVSYXRpbmciLCJnZXRNdWx0aXBsZU1vdmllUmF0aW5ncyIsImZvdW5kTW92aWUiLCJnZXRSZWNlbnRSZWxlYXNlIiwicGFyYW1zIiwiYXBpX2tleSIsInByaW1hcnlfcmVsZWFzZV95ZWFyIiwiRGF0ZSIsImdldEZ1bGxZZWFyIiwiaW5jbHVkZV9hZHVsdCIsInNvcnRfYnkiLCJ1cmwiLCJxcyIsIm9uIiwiY2h1bmsiLCJyZWNlbnRNb3ZpZXMiLCJKU09OIiwicGFyc2UiLCJyZXN1bHRzIiwic2VhcmNoUmF0ZWRNb3ZpZSIsIndoZXJlUmF3IiwiYW5kV2hlcmUiLCJtYXRjaGVzIiwiZ2V0RnJpZW5kTGlzdCIsImZyaWVuZHMiLCJmcmllbmRVc2VyIiwiYWRkRnJpZW5kIiwiY29uZmlybUZyaWVuZHNoaXAiLCJnZXRGcmllbmRzIiwicGVvcGxlSWQiLCJ1c2Vyc1JhdGluZ3MiLCJpbmRleE9mIiwia2V5SWQiLCJyZXNwbyIsInJlIiwicmFuZG9tIiwieiIsInZlcnlGaW5hbCIsImdldEhpZ2hDb21wYXRpYmlsaXR5VXNlcnMiLCJnZXRSZWNvbW1lbmRlZE1vdmllcyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQSxJQUFJQSxTQUFRLFNBQVJBLE1BQVEsQ0FBU0MsSUFBVCxFQUFjQyxJQUFkLEVBQW1CO0FBQy9CLE1BQUlDLE9BQUtDLEtBQUtDLEdBQUwsQ0FBU0osT0FBS0MsSUFBZCxDQUFUO0FBQ0EsU0FBTyxJQUFFQyxJQUFUO0FBQ0MsQ0FIRDs7QUFLQSxJQUFJRyxPQUFPLFNBQVBBLElBQU8sQ0FBU0MsS0FBVCxFQUFnQkMsTUFBaEIsRUFBd0I7QUFDbkMsTUFBSUMsUUFBTyxFQUFYO0FBQ0UsT0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUdILE1BQU1JLE1BQXpC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RCxLQTVERDtBQTZERCxHQWpFRDtBQWtFRCxDQXJFRDs7QUF5RUE7QUFDQXJLLFFBQVFzSyx5QkFBUixHQUFvQyxVQUFTcEssR0FBVCxFQUFjQyxHQUFkLEVBQW1CLENBRXRELENBRkQ7O0FBS0E7QUFDQUgsUUFBUXVLLG9CQUFSLEdBQStCLFVBQVNySyxHQUFULEVBQWNDLEdBQWQsRUFBbUIsQ0FFakQsQ0FGRCIsImZpbGUiOiJyZXF1ZXN0LWhhbmRsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vVGhlIGFsZ29yaXRobVxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxudmFyIGhlbHBlcj0gZnVuY3Rpb24obnVtMSxudW0yKXtcclxudmFyIGRpZmY9TWF0aC5hYnMobnVtMS1udW0yKTtcclxucmV0dXJuIDUtZGlmZjtcclxufVxyXG5cclxudmFyIGNvbXAgPSBmdW5jdGlvbihmaXJzdCwgc2Vjb25kKSB7XHJcbnZhciBmaW5hbD0gW11cclxuICBmb3IgKHZhciBpID0gMDsgaTwgZmlyc3QubGVuZ3RoOyBpKyspIHtcclxuXHJcbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHNlY29uZC5sZW5ndGg7IHgrKykge1xyXG5cclxuICAgICAgaWYgKGZpcnN0W2ldWzBdID09PSBzZWNvbmRbeF1bMF0pIHtcclxuXHJcbiAgICBmaW5hbC5wdXNoKGhlbHBlcihmaXJzdFtpXVsxXSxzZWNvbmRbeF1bMV0pKVxyXG5cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxudmFyIHN1bT0gZmluYWwucmVkdWNlKGZ1bmN0aW9uKGEsYil7cmV0dXJuIGErYn0sMCk7XHJcbnJldHVybiBNYXRoLnJvdW5kKDIwKnN1bS9maW5hbC5sZW5ndGgpXHJcbn1cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuXHJcblxyXG5cclxuXHJcbnZhciBkYiA9IHJlcXVpcmUoJy4uL2FwcC9kYkNvbm5lY3Rpb24nKTtcclxudmFyIG15c3FsID0gcmVxdWlyZSgnbXlzcWwnKTtcclxudmFyIGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XHJcbnZhciBNb3ZpZSA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvbW92aWUnKTtcclxudmFyIFJhdGluZyA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvcmF0aW5nJyk7XHJcbnZhciBSZWxhdGlvbiA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvcmVsYXRpb24nKTtcclxudmFyIFVzZXIgPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL3VzZXInKTtcclxudmFyIGFsbFJlcXVlc3QgPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL2FsbFJlcXVlc3QnKTtcclxuXHJcbnZhciBNb3ZpZXMgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvbW92aWVzJyk7XHJcbnZhciBSYXRpbmdzID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL3JhdGluZ3MnKTtcclxudmFyIFJlbGF0aW9ucyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy9yZWxhdGlvbnMnKTtcclxudmFyIFVzZXJzID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL3VzZXJzJyk7XHJcbnZhciBhbGxSZXF1ZXN0cyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy9hbGxSZXF1ZXN0cycpO1xyXG5cclxudmFyIFByb21pc2UgPSByZXF1aXJlKFwiYmx1ZWJpcmRcIik7XHJcbnZhciByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdCcpO1xyXG5cclxuLy8gdmFyIGNvbiA9IG15c3FsLmNyZWF0ZUNvbm5lY3Rpb24oe1xyXG4vLyAgIGhvc3Q6IFwibG9jYWxob3N0XCIsXHJcbi8vICAgdXNlcjogXCJyb290XCIsXHJcbi8vICAgcGFzc3dvcmQ6IFwiMTIzNDVcIixcclxuLy8gICBkYXRhYmFzZTogXCJNYWluRGF0YWJhc2VcIlxyXG4vLyB9KTtcclxuXHJcbnZhciBjb24gPSBteXNxbC5jcmVhdGVDb25uZWN0aW9uKHtcclxuICAgIGhvc3QgICAgIDogJzEyNy4wLjAuMScsXHJcbiAgICB1c2VyICAgICA6ICdyb290JyxcclxuICAgIHBhc3N3b3JkIDogJzEyMzQ1JyxcclxuICAgIGRhdGFiYXNlIDogJ01haW5EYXRhYmFzZScsXHJcbn0pO1xyXG5cclxuY29uLmNvbm5lY3QoZnVuY3Rpb24oZXJyKXtcclxuICBpZihlcnIpe1xyXG4gICAgY29uc29sZS5sb2coJ0Vycm9yIGNvbm5lY3RpbmcgdG8gRGInKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgY29uc29sZS5sb2coJ0Nvbm5lY3Rpb24gZXN0YWJsaXNoZWQnKTtcclxufSk7XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vdXNlciBhdXRoXHJcbi8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5leHBvcnRzLnNpZ251cFVzZXIgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG5cdGNvbnNvbGUubG9nKCdjYWxsaW5nIGxvZ2luJywgcmVxLmJvZHkpO1xyXG5cdC8vIGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBzZXNzaW9uJyxyZXEuc2Vzc2lvbilcclxuICBuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEuYm9keS5uYW1lIH0pLmZldGNoKCkudGhlbihmdW5jdGlvbihmb3VuZCkge1xyXG5cdCAgaWYgKGZvdW5kKSB7XHJcblx0ICBcdC8vY2hlY2sgcGFzc3dvcmRcclxuXHQgIFx0ICAgLy9pZiAocGFzc3dvcmQgbWF0Y2hlcylcclxuXHQgIFx0ICAgLy97IGFkZCBzZXNzaW9ucyBhbmQgcmVkaXJlY3R9XHJcblx0ICBcdGNvbnNvbGUubG9nKCd1c2VybmFtZSBhbHJlYWR5IGV4aXN0LCBjYW5ub3Qgc2lnbnVwICcsIHJlcS5ib2R5Lm5hbWUpO1xyXG5cdCAgICByZXMuc3RhdHVzKDQwMykuc2VuZCgndXNlcm5hbWUgZXhpc3QnKTtcclxuXHQgIH0gZWxzZSB7XHJcblx0ICBcdGNvbnNvbGUubG9nKCdjcmVhdGluZyB1c2VyJyk7XHJcbiAgICAgIHJlcS5teVNlc3Npb24udXNlciA9IHJlcS5ib2R5Lm5hbWU7XHJcblx0ICAgIFVzZXJzLmNyZWF0ZSh7XHJcblx0ICAgICAgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUsXHJcblx0ICAgICAgcGFzc3dvcmQ6IHJlcS5ib2R5LnBhc3N3b3JkLFxyXG5cdCAgICB9KVxyXG5cdCAgICAudGhlbihmdW5jdGlvbih1c2VyKSB7XHJcblx0XHQgIFx0Y29uc29sZS5sb2coJ2NyZWF0ZWQgYSBuZXcgdXNlcicpO1xyXG5cdCAgICAgIHJlcy5zdGF0dXMoMjAxKS5zZW5kKCdsb2dpbiBjcmVhdGVkJyk7XHJcblx0ICAgIH0pO1xyXG5cdCAgfVxyXG5cdH0pO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydHMuc2VuZFdhdGNoUmVxdWVzdCA9IGZ1bmN0aW9uKHJlcSwgcmVzcG9uc2UpIHtcclxuXHRjb25zb2xlLmxvZyhyZXEuYm9keS5yZXF1ZXN0ZWUpXHJcblx0aWYgKEFycmF5LmlzQXJyYXkocmVxLmJvZHkucmVxdWVzdGVlKSkge1xyXG5cdFx0dmFyIHJlcXVlc3RlZXMgPSByZXEuYm9keS5yZXF1ZXN0ZWU7XHJcblx0fSBlbHNlIHtcclxuXHRcdHZhciByZXF1ZXN0ZWVzID0gW3JlcS5ib2R5LnJlcXVlc3RlZV07XHJcblx0fVxyXG5cdFByb21pc2UuZWFjaChyZXF1ZXN0ZWVzLCBmdW5jdGlvbihyZXF1ZXN0ZWUpe1xyXG5cdFx0dmFyIHJlcXVlc3QgPSB7XHJcbiAgICAgIG1lc3NhZ2U6IHJlcS5ib2R5Lm1lc3NhZ2UsXHJcblx0XHRcdHJlcXVlc3RvcjogcmVxLm15U2Vzc2lvbi51c2VyLCBcclxuXHRcdFx0cmVxdWVzdFR5cDond2F0Y2gnLFxyXG5cdFx0XHRtb3ZpZTpyZXEuYm9keS5tb3ZpZSxcclxuXHRcdFx0cmVxdWVzdGVlOiByZXF1ZXN0ZWVcclxuXHRcdH07XHJcblx0XHRjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIGFsbHJlcXVlc3RzIFNFVCA/JywgcmVxdWVzdCwgZnVuY3Rpb24oZXJyLHJlcyl7XHJcblx0XHQgIGlmKGVycikgdGhyb3cgZXJyO1xyXG5cdFx0ICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcclxuXHRcdH0pO1xyXG5cdH0pXHJcblx0LnRoZW4oZnVuY3Rpb24oZG9uZSl7XHJcblx0XHRyZXNwb25zZS5zZW5kKCdUaGF0cyBteSBzdHlsZSEnKTtcclxuXHR9KVxyXG59XHJcblxyXG5leHBvcnRzLnJlbW92ZVdhdGNoUmVxdWVzdCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgaWYgKEFycmF5LmlzQXJyYXkocmVxLmJvZHkucmVxdWVzdGVlKSkge1xyXG4gICAgdmFyIHJlcXVlc3RlZXMgPSByZXEuYm9keS5yZXF1ZXN0ZWU7XHJcbiAgfSBlbHNlIHtcclxuICAgIHZhciByZXF1ZXN0ZWVzID0gW3JlcS5ib2R5LnJlcXVlc3RlZV07XHJcbiAgfVxyXG4gIHZhciByZXF1ZXN0b3I9cmVxLmJvZHkucmVxdWVzdG9yO1xyXG4gIHZhciBtb3ZpZSA9IHJlcS5ib2R5Lm1vdmllO1xyXG5cclxuICBhbGxSZXF1ZXN0LmZvcmdlKHtyZXF1ZXN0b3I6IHJlcXVlc3RvciwgcmVxdWVzdGVlOiByZXF1ZXN0ZWVzLCBtb3ZpZTogbW92aWUgfSlcclxuICAgIC5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oYWxsUmVxdWVzdCkge1xyXG4gICAgICBhbGxSZXF1ZXN0LmRlc3Ryb3koKVxyXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgcmVzLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogJ1VzZXIgc3VjY2Vzc2Z1bGx5IGRlbGV0ZWQnfX0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xyXG4gICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KVxyXG4gICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xyXG4gICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcclxuICAgIH0pO1xyXG59O1xyXG5cclxuXHJcbmV4cG9ydHMuc2VuZFJlcXVlc3QgPSBmdW5jdGlvbihyZXEsIHJlc3BvbnNlKSB7XHJcbiAgY29uc29sZS5sb2coJ3RoaXMgaXMgd2hhdCBJbSBnZXR0aW5nJywgcmVxLmJvZHkpO1xyXG4gIGlmIChyZXEubXlTZXNzaW9uLnVzZXI9PT1yZXEuYm9keS5uYW1lKXtcclxuICAgIHJlc3BvbnNlLnNlbmQoXCJZb3UgY2FuJ3QgZnJpZW5kIHlvdXJzZWxmIVwiKVxyXG4gIH0gZWxzZSB7XHJcblxyXG52YXIgcmVxdWVzdCA9IHtyZXF1ZXN0b3I6IHJlcS5teVNlc3Npb24udXNlciwgcmVxdWVzdGVlOiByZXEuYm9keS5uYW1lLCByZXF1ZXN0VHlwOidmcmllbmQnfTtcclxuXHJcbmNvbi5xdWVyeSgnU0VMRUNUIHJlcXVlc3RlZSxyZXNwb25zZSBGUk9NIGFsbHJlcXVlc3RzIFdIRVJFICByZXF1ZXN0b3IgPSA/IEFORCByZXF1ZXN0VHlwID0nKydcIicrICdmcmllbmQnKydcIicsIHJlcXVlc3RbJ3JlcXVlc3RvciddLCBmdW5jdGlvbihlcnIscmVzKXtcclxuaWYgKHJlcyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgcmVzcG9uc2Uuc2VuZCgnbm8gZnJpZW5kcycpXHJcbn1cclxudmFyIHRlc3Q9cmVzLmZpbHRlcihmdW5jdGlvbihhKXtyZXR1cm4gYS5yZXNwb25zZT09PW51bGx9KVxyXG52YXIgdGVzdDI9dGVzdC5tYXAoZnVuY3Rpb24oYSl7IHJldHVybiBhLnJlcXVlc3RlZX0pXHJcbmNvbnNvbGUubG9nKCduYW1lcyBvZiBwZW9wbGUgd2hvbSBJdmUgcmVxdWVzdGVkIGFzIGZyaWVuZHMnLHRlc3QpO1xyXG5cclxuXHJcblxyXG5jb24ucXVlcnkoJ0lOU0VSVCBJTlRPIGFsbHJlcXVlc3RzIFNFVCA/JywgcmVxdWVzdCwgZnVuY3Rpb24oZXJyLHJlc3Ape1xyXG4gIGlmKGVycikgdGhyb3cgZXJyO1xyXG4gIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXNwLmluc2VydElkKTtcclxuICByZXNwb25zZS5zZW5kKHRlc3QyKTtcclxufSlcclxufSk7XHJcblxyXG4gfVxyXG59O1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5leHBvcnRzLmxpc3RSZXF1ZXN0cyA9IGZ1bmN0aW9uKHJlcSwgcmVzcG9uc2UpIHtcclxuICB2YXIgcmVxdWVzdCA9IHJlcS5teVNlc3Npb24udXNlclxyXG5cclxuICBjb24ucXVlcnkoJ1NlbGVjdCAqIEZST00gYWxscmVxdWVzdHMgV0hFUkUgcmVxdWVzdGVlPScrJ1wiJytyZXF1ZXN0KydcIicrJycrJ09SIHJlcXVlc3RvciA9JysnXCInK3JlcXVlc3QrJ1wiJysnJywgZnVuY3Rpb24oZXJyLHJlcyl7XHJcbiAgaWYoZXJyKSB0aHJvdyBlcnI7XHJcbiAgY29uc29sZS5sb2cocmVzKVxyXG4gIHJlc3BvbnNlLnNlbmQoW3JlcyxyZXF1ZXN0XSk7XHJcbn0pO1xyXG5cclxuXHJcbn07XHJcblxyXG5leHBvcnRzLmFjY2VwdCA9IGZ1bmN0aW9uKHJlcSwgcmVzcG9uc2UpIHtcclxuICB2YXIgcmVxdWVzdG9yPXJlcS5ib2R5LnBlcnNvblRvQWNjZXB0O1xyXG4gIHZhciByZXF1ZXN0ZWU9cmVxLm15U2Vzc2lvbi51c2VyO1xyXG4gIHZhciBtb3ZpZSA9IHJlcS5ib2R5Lm1vdmllO1xyXG4gIHZhciByZXF1ZXN0VHlwZSA9IFwiZnJpZW5kXCI7XHJcblxyXG4gIGlmIChtb3ZpZSA9PT0gJycpIHtcclxuICAgIGNvbi5xdWVyeSgnVVBEQVRFIGFsbHJlcXVlc3RzIFNFVCByZXNwb25zZT0nKydcIicgKyAneWVzJyArICdcIicrJyAgV0hFUkUgcmVxdWVzdG9yID0gJysnXCInKyByZXF1ZXN0b3IrJ1wiJysnIEFORCByZXF1ZXN0VHlwPScrJ1wiJytyZXF1ZXN0VHlwZSsnXCInLCBmdW5jdGlvbihlcnIsIHJlcykge1xyXG4gICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XHJcbiAgICB9KTtcclxuXHJcbiAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCByZXEuYm9keS5wZXJzb25Ub0FjY2VwdCwgZnVuY3Rpb24oZXJyLCByZXMpIHtcclxuICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXNbMF0uaWQsIGVycik7XHJcbiAgICB2YXIgcGVyc29uMSA9IHJlc1swXS5pZDtcclxuICAgIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgcmVxLm15U2Vzc2lvbi51c2VyLCBmdW5jdGlvbihlcnIsIHJlc3ApIHtcclxuICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzcFswXS5pZCwgZXJyKTtcclxuXHJcbiAgICAgIHZhciBwZXJzb24yID0gcmVzcFswXS5pZDtcclxuICAgICAgdmFyIHJlcXVlc3QgPSB7XHJcbiAgICAgICAgdXNlcjFpZDogcGVyc29uMSxcclxuICAgICAgICB1c2VyMmlkOiBwZXJzb24yXHJcbiAgICAgIH1cclxuICAgICAgdmFyIHJlcXVlc3QyID0ge1xyXG4gICAgICAgIHVzZXIxaWQ6IHBlcnNvbjIsXHJcbiAgICAgICAgdXNlcjJpZDogcGVyc29uMVxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zb2xlLmxvZygndGhlIHJlcXVlc3RzOjo6JyxyZXF1ZXN0LHJlcXVlc3QyKVxyXG4gICAgICBjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIHJlbGF0aW9ucyBTRVQgPycsIHJlcXVlc3QsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XHJcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xyXG5cclxuICAgICAgY29uLnF1ZXJ5KCdJTlNFUlQgSU5UTyByZWxhdGlvbnMgU0VUID8nLCByZXF1ZXN0MiwgZnVuY3Rpb24oZXJyLCByZXMpIHtcclxuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcclxuXHJcbiAgICAgICAgICAgcmVzcG9uc2Uuc2VuZCgnVGhhdHMgbXkgc3R5bGUhISEnKTtcclxuICAgICAgICB9KVxyXG4gICAgICB9KTtcclxuICAgIH0pXHJcbiAgfSlcclxuICB9IGVsc2Uge1xyXG4gIGNvbnNvbGUubG9nKCd0aGlzIGlzIHJlcSBib2R5ICcscmVxLmJvZHkpO1xyXG5cclxuICBjb24ucXVlcnkoJ1VQREFURSBhbGxyZXF1ZXN0cyBTRVQgcmVzcG9uc2U9JysnXCInICsgJ3llcycgKyAnXCInKycgIFdIRVJFIHJlcXVlc3RvciA9ICcrJ1wiJysgcmVxdWVzdG9yKydcIicrJyBBTkQgbW92aWU9JysnXCInKyBtb3ZpZSsnXCInLCBmdW5jdGlvbihlcnIsIHJlcykge1xyXG4gICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcclxuICB9KTtcclxuXHJcbiAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCByZXEuYm9keS5wZXJzb25Ub0FjY2VwdCwgZnVuY3Rpb24oZXJyLCByZXMpIHtcclxuICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXNbMF0uaWQsIGVycik7XHJcbiAgICB2YXIgcGVyc29uMSA9IHJlc1swXS5pZDtcclxuICAgIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgcmVxLm15U2Vzc2lvbi51c2VyLCBmdW5jdGlvbihlcnIsIHJlc3ApIHtcclxuICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzcFswXS5pZCwgZXJyKTtcclxuXHJcbiAgICAgIHZhciBwZXJzb24yID0gcmVzcFswXS5pZDtcclxuICAgICAgdmFyIHJlcXVlc3QgPSB7XHJcbiAgICAgICAgdXNlcjFpZDogcGVyc29uMSxcclxuICAgICAgICB1c2VyMmlkOiBwZXJzb24yXHJcbiAgICAgIH1cclxuICAgICAgdmFyIHJlcXVlc3QyID0ge1xyXG4gICAgICAgIHVzZXIxaWQ6IHBlcnNvbjIsXHJcbiAgICAgICAgdXNlcjJpZDogcGVyc29uMVxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zb2xlLmxvZygndGhlIHJlcXVlc3RzOjo6JyxyZXF1ZXN0LHJlcXVlc3QyKVxyXG4gICAgICBjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIHJlbGF0aW9ucyBTRVQgPycsIHJlcXVlc3QsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XHJcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xyXG5cclxuICAgICAgY29uLnF1ZXJ5KCdJTlNFUlQgSU5UTyByZWxhdGlvbnMgU0VUID8nLCByZXF1ZXN0MiwgZnVuY3Rpb24oZXJyLCByZXMpIHtcclxuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcclxuXHJcbiAgICAgICAgICAgcmVzcG9uc2Uuc2VuZCgnVGhhdHMgbXkgc3R5bGUhISEnKTtcclxuICAgICAgICB9KVxyXG4gICAgICB9KTtcclxuICAgIH0pXHJcbiAgfSlcclxufVxyXG4gIC8vIGFsbFJlcXVlc3QuZm9yZ2Uoe3JlcXVlc3RvcjogcmVxdWVzdG9yLCByZXF1ZXN0ZWU6IHJlcXVlc3RlZX0pXHJcbiAgLy8gICAuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGFsbFJlcXVlc3QpIHtcclxuICAvLyAgICAgYWxsUmVxdWVzdC5kZXN0cm95KClcclxuICAvLyAgICAgICAudGhlbihmdW5jdGlvbigpIHtcclxuICAvLyAgICAgICAgIHJlc3BvbnNlLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogJ1VzZXIgc3VjY2Vzc2Z1bGx5IGRlbGV0ZWQnfX0pO1xyXG4gIC8vICAgICAgIH0pXHJcbiAgLy8gICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xyXG4gIC8vICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcclxuICAvLyAgICAgICB9KTtcclxuICAvLyAgIH0pXHJcbiAgLy8gICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XHJcbiAgLy8gICAgIHJlc3BvbnNlLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XHJcbiAgLy8gICB9KTtcclxufTtcclxuXHJcbmV4cG9ydHMucmVtb3ZlUmVxdWVzdCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgdmFyIHJlcXVlc3Rvcj1yZXEuYm9keS5yZXF1ZXN0b3I7XHJcbiAgdmFyIHJlcXVlc3RlZT1yZXEuYm9keS5yZXF1ZXN0ZWU7XHJcblxyXG4gIGFsbFJlcXVlc3QuZm9yZ2Uoe3JlcXVlc3RvcjogcmVxdWVzdG9yLCByZXF1ZXN0ZWU6IHJlcXVlc3RlZX0pXHJcbiAgICAuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGFsbFJlcXVlc3QpIHtcclxuICAgICAgYWxsUmVxdWVzdC5kZXN0cm95KClcclxuICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHJlcy5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6ICdVc2VyIHN1Y2Nlc3NmdWxseSBkZWxldGVkJ319KTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IHJlcS5ib2R5fX0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcclxuICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogcmVxLmJvZHl9fSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0cy5nZXRUaGlzRnJpZW5kc01vdmllcz1mdW5jdGlvbihyZXEscmVzcG9uc2Upe1xyXG5cclxuICB2YXIgbW92aWVzPVtdO1xyXG4gIGNvbnNvbGUubG9nKHJlcS5ib2R5LnNwZWNpZmljRnJpZW5kKTtcclxuICB2YXIgcGVyc29uPXJlcS5ib2R5LnNwZWNpZmljRnJpZW5kXHJcbiAgdmFyIGlkPW51bGxcclxuICB2YXIgbGVuPW51bGw7XHJcbiAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCBwZXJzb24sIGZ1bmN0aW9uKGVyciwgcmVzcCl7XHJcbmNvbnNvbGUubG9nKHJlc3ApXHJcbmlkPXJlc3BbMF0uaWQ7XHJcblxyXG5cclxuY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHJhdGluZ3MgV0hFUkUgdXNlcmlkID0gPycsIGlkICxmdW5jdGlvbihlcnIscmVzcCl7XHJcbmNvbnNvbGUubG9nKCdlcnJycnJycnJyJyxlcnIscmVzcC5sZW5ndGgpXHJcbmxlbj1yZXNwLmxlbmd0aDtcclxucmVzcC5mb3JFYWNoKGZ1bmN0aW9uKGEpe1xyXG5cclxuY29uLnF1ZXJ5KCdTRUxFQ1QgdGl0bGUgRlJPTSBtb3ZpZXMgV0hFUkUgaWQgPSA/JywgYS5tb3ZpZWlkICxmdW5jdGlvbihlcnIscmVzcCl7XHJcbiAgY29uc29sZS5sb2cocmVzcClcclxubW92aWVzLnB1c2goW3Jlc3BbMF0udGl0bGUsYS5zY29yZSxhLnJldmlld10pXHJcbmNvbnNvbGUubG9nKG1vdmllcylcclxuaWYgKG1vdmllcy5sZW5ndGg9PT1sZW4pe1xyXG4gIHJlc3BvbnNlLnNlbmQobW92aWVzKTtcclxufVxyXG59KVxyXG5cclxufSlcclxuXHJcbn0pXHJcblxyXG5cclxuICB9XHJcblxyXG4pfVxyXG5cclxuZXhwb3J0cy5maW5kTW92aWVCdWRkaWVzPWZ1bmN0aW9uKHJlcSxyZXNwb25zZSl7XHJcbiAgY29uc29sZS5sb2coXCJ5b3UncmUgdHJ5aW5nIHRvIGZpbmQgYnVkZGllcyEhXCIpO1xyXG5jb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gdXNlcnMnLGZ1bmN0aW9uKGVycixyZXNwKXtcclxuICB2YXIgcGVvcGxlPXJlc3AubWFwKGZ1bmN0aW9uKGEpe3JldHVybiBhLnVzZXJuYW1lfSlcclxuICB2YXIgSWRzPSByZXNwLm1hcChmdW5jdGlvbihhKXtyZXR1cm4gYS5pZH0pXHJcbiAgdmFyIGlkS2V5T2JqPXt9XHJcbmZvciAodmFyIGk9MDtpPElkcy5sZW5ndGg7aSsrKXtcclxuICBpZEtleU9ialtJZHNbaV1dPXBlb3BsZVtpXVxyXG59XHJcbmNvbnNvbGUubG9nKCdjdXJyZW50IHVzZXInLHJlcS5teVNlc3Npb24udXNlcik7XHJcbnZhciBjdXJyZW50VXNlcj1yZXEubXlTZXNzaW9uLnVzZXJcclxuXHJcblxyXG4gdmFyIG9iajE9e307XHJcbiAgZm9yICh2YXIgaT0wO2k8SWRzLmxlbmd0aDtpKyspe1xyXG5vYmoxW2lkS2V5T2JqW0lkc1tpXV1dPVtdO1xyXG4gIH1cclxuXHJcbiAgY29uLnF1ZXJ5KCdTRUxFQ1Qgc2NvcmUsbW92aWVpZCx1c2VyaWQgRlJPTSByYXRpbmdzJyxmdW5jdGlvbihlcnIscmVzcG9uKXtcclxuICBcclxuZm9yICh2YXIgaT0wO2k8cmVzcG9uLmxlbmd0aDtpKyspe1xyXG4gIG9iajFbaWRLZXlPYmpbcmVzcG9uW2ldLnVzZXJpZF1dLnB1c2goW3Jlc3BvbltpXS5tb3ZpZWlkLHJlc3BvbltpXS5zY29yZV0pXHJcbn1cclxuXHJcbmNvbnNvbGUubG9nKCdvYmoxJyxvYmoxKTtcclxuY3VycmVudFVzZXJJbmZvPW9iajFbY3VycmVudFVzZXJdXHJcbi8vY29uc29sZS5sb2coJ2N1cnJlbnRVc2VySW5mbycsY3VycmVudFVzZXJJbmZvKVxyXG52YXIgY29tcGFyaXNvbnM9e31cclxuXHJcbmZvciAodmFyIGtleSBpbiBvYmoxKXtcclxuICBpZiAoa2V5IT09Y3VycmVudFVzZXIpIHtcclxuICAgIGNvbXBhcmlzb25zW2tleV09Y29tcChjdXJyZW50VXNlckluZm8sb2JqMVtrZXldKVxyXG4gIH1cclxufVxyXG5jb25zb2xlLmxvZyhjb21wYXJpc29ucylcclxudmFyIGZpbmFsU2VuZD1bXVxyXG5mb3IgKHZhciBrZXkgaW4gY29tcGFyaXNvbnMpe1xyXG4gIGlmIChjb21wYXJpc29uc1trZXldICE9PSAnTmFOJScpIHtcclxuICBmaW5hbFNlbmQucHVzaChba2V5LGNvbXBhcmlzb25zW2tleV1dKTtcclxufSBlbHNlICB7XHJcbiAgZmluYWxTZW5kLnB1c2goW2tleSxcIk5vIENvbXBhcmlzb24gdG8gTWFrZVwiXSlcclxufVxyXG5cclxufVxyXG5cclxuICByZXNwb25zZS5zZW5kKGZpbmFsU2VuZClcclxufSlcclxufSlcclxufVxyXG5cclxuXHJcbmV4cG9ydHMuZGVjbGluZT1mdW5jdGlvbihyZXEscmVzcG9uc2Upe1xyXG4gIHZhciByZXF1ZXN0b3I9cmVxLmJvZHkucGVyc29uVG9EZWNsaW5lO1xyXG4gIHZhciByZXF1ZXN0ZWU9cmVxLm15U2Vzc2lvbi51c2VyO1xyXG4gIHZhciBtb3ZpZT1yZXEuYm9keS5tb3ZpZTtcclxuICB2YXIgcmVxdWVzdFR5cGUgPSAnZnJpZW5kJztcclxuXHJcbiAgaWYgKG1vdmllID09PSAnJykge1xyXG4gICAgY29uLnF1ZXJ5KCdVUERBVEUgYWxscmVxdWVzdHMgU0VUIHJlc3BvbnNlPScrJ1wiJyArICdubycgKyAnXCInKyAnIFdIRVJFIHJlcXVlc3RvciA9ICcrJ1wiJysgcmVxdWVzdG9yKydcIicrJyBBTkQgcmVxdWVzdFR5cD0nKydcIicrIHJlcXVlc3RUeXBlKydcIicsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XHJcbiAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XHJcbiAgICAgIHJlc3BvbnNlLnNlbmQocmVxdWVzdG9yICsgJ2RlbGV0ZWQnKTtcclxuICAgIH0pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjb24ucXVlcnkoJ1VQREFURSBhbGxyZXF1ZXN0cyBTRVQgcmVzcG9uc2U9JysnXCInICsgJ25vJyArICdcIicrICcgV0hFUkUgcmVxdWVzdG9yID0gJysnXCInKyByZXF1ZXN0b3IrJ1wiJysnIEFORCByZXF1ZXN0ZWU9JysnXCInKyByZXF1ZXN0ZWUrJ1wiJysnIEFORCBtb3ZpZSA9JysnXCInK21vdmllKydcIicsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XHJcbiAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XHJcbiAgICAgIHJlc3BvbnNlLnNlbmQocmVxdWVzdG9yICsgJ2RlbGV0ZWQnKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gYWxsUmVxdWVzdC5mb3JnZSh7cmVxdWVzdG9yOiByZXF1ZXN0b3IsIHJlcXVlc3RlZTogcmVxdWVzdGVlfSlcclxuICAvLyAgIC5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oYWxsUmVxdWVzdCkge1xyXG4gIC8vICAgICBhbGxSZXF1ZXN0LmRlc3Ryb3koKVxyXG4gIC8vICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xyXG4gIC8vICAgICAgICAgcmVzcG9uc2UuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiAnVXNlciBzdWNjZXNzZnVsbHkgZGVsZXRlZCd9fSk7XHJcbiAgLy8gICAgICAgfSlcclxuICAvLyAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XHJcbiAgLy8gICAgICAgICByZXNwb25zZS5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xyXG4gIC8vICAgICAgIH0pO1xyXG4gIC8vICAgfSlcclxuICAvLyAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcclxuICAvLyAgICAgcmVzcG9uc2Uuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcclxuICAvLyAgIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0cy5zaWdudXBVc2VyID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICBjb25zb2xlLmxvZygnY2FsbGluZyBsb2dpbicsIHJlcS5ib2R5KTtcclxuICAvLyBjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgc2Vzc2lvbicscmVxLnNlc3Npb24pXHJcbiAgbmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLmJvZHkubmFtZSB9KS5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oZm91bmQpIHtcclxuICAgIGlmIChmb3VuZCkge1xyXG4gICAgICAvL2NoZWNrIHBhc3N3b3JkXHJcbiAgICAgICAgIC8vaWYgKHBhc3N3b3JkIG1hdGNoZXMpXHJcbiAgICAgICAgIC8veyBhZGQgc2Vzc2lvbnMgYW5kIHJlZGlyZWN0fVxyXG4gICAgICBjb25zb2xlLmxvZygndXNlcm5hbWUgYWxyZWFkeSBleGlzdCwgY2Fubm90IHNpZ251cCAnLCByZXEuYm9keS5uYW1lKTtcclxuICAgICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoJ3VzZXJuYW1lIGV4aXN0Jyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZygnY3JlYXRpbmcgdXNlcicpO1xyXG4gICAgICByZXEubXlTZXNzaW9uLnVzZXIgPSByZXEuYm9keS5uYW1lO1xyXG4gICAgICBVc2Vycy5jcmVhdGUoe1xyXG4gICAgICAgIHVzZXJuYW1lOiByZXEuYm9keS5uYW1lLFxyXG4gICAgICAgIHBhc3N3b3JkOiByZXEuYm9keS5wYXNzd29yZCxcclxuICAgICAgfSlcclxuICAgICAgLnRoZW4oZnVuY3Rpb24odXNlcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjcmVhdGVkIGEgbmV3IHVzZXInKTtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMSkuc2VuZCgnbG9naW4gY3JlYXRlZCcpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxufTtcclxuXHJcbmV4cG9ydHMuc2lnbmluVXNlciA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcblx0Y29uc29sZS5sb2coJ2NhbGxpbmcgc2lnbmluJywgcmVxLmJvZHkpO1xyXG5cdG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUgfSkuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGZvdW5kKXtcclxuXHJcblx0XHRpZiAoZm91bmQpe1xyXG5cdFx0XHRuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEuYm9keS5uYW1lLCBwYXNzd29yZDpyZXEuYm9keS5wYXNzd29yZH0pLmZldGNoKCkudGhlbihmdW5jdGlvbihmb3VuZCl7XHJcblx0XHRcdFx0aWYgKGZvdW5kKXtcclxuXHRcdFx0XHRcdHJlcS5teVNlc3Npb24udXNlciA9IGZvdW5kLmF0dHJpYnV0ZXMudXNlcm5hbWU7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhmb3VuZC5hdHRyaWJ1dGVzLnVzZXJuYW1lKVxyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ3dlIGZvdW5kIHlvdSEhJylcclxuXHRcdFx0XHRcdHJlcy5zZW5kKFsnaXQgd29ya2VkJyxyZXEubXlTZXNzaW9uLnVzZXJdKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cmVzLnN0YXR1cyg0MDQpLnNlbmQoJ2JhZCBsb2dpbicpO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ3dyb25nIHBhc3N3b3JkJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmVzLnN0YXR1cyg0MDQpLnNlbmQoJ2JhZCBsb2dpbicpO1xyXG5cdFx0XHRjb25zb2xlLmxvZygndXNlciBub3QgZm91bmQnKTtcclxuXHRcdH1cclxuXHJcbiAgfSkgXHJcblxyXG59XHJcblxyXG5leHBvcnRzLmxvZ291dCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcblx0cmVxLm15U2Vzc2lvbi5kZXN0cm95KGZ1bmN0aW9uKGVycil7XHJcblx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdH0pO1xyXG5cdGNvbnNvbGUubG9nKCdsb2dvdXQnKTtcclxuXHRyZXMuc2VuZCgnbG9nb3V0Jyk7XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy9tb3ZpZSBoYW5kbGVyc1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbi8vYSBoYW5kZWxlciB0aGF0IHRha2VzIGEgcmF0aW5nIGZyb20gdXNlciBhbmQgYWRkIGl0IHRvIHRoZSBkYXRhYmFzZVxyXG4vLyBleHBlY3RzIHJlcS5ib2R5IHRvIGhhdmUgdGhpczoge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnLCBwb3N0ZXI6ICdsaW5rJywgcmVsZWFzZV9kYXRlOiAneWVhcicsIHJhdGluZzogJ251bWJlcid9XHJcbmV4cG9ydHMucmF0ZU1vdmllID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuXHRjb25zb2xlLmxvZygnY2FsbGluZyByYXRlTW92aWUnKTtcclxuXHR2YXIgdXNlcmlkO1xyXG5cdHJldHVybiBuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEubXlTZXNzaW9uLnVzZXIgfSkuZmV0Y2goKVxyXG5cdC50aGVuKGZ1bmN0aW9uKGZvdW5kVXNlcikge1xyXG5cdFx0dXNlcmlkID0gZm91bmRVc2VyLmF0dHJpYnV0ZXMuaWQ7XHJcblx0XHRyZXR1cm4gbmV3IFJhdGluZyh7IG1vdmllaWQ6IHJlcS5ib2R5LmlkLCB1c2VyaWQ6IHVzZXJpZCB9KS5mZXRjaCgpXHJcblx0XHQudGhlbihmdW5jdGlvbihmb3VuZFJhdGluZykge1xyXG5cdFx0XHRpZiAoZm91bmRSYXRpbmcpIHtcclxuXHRcdFx0XHQvL3NpbmNlIHJhdGluZyBvciByZXZpZXcgaXMgdXBkYXRlZCBzZXBlcmF0bHkgaW4gY2xpZW50LCB0aGUgZm9sbG93aW5nXHJcblx0XHRcdFx0Ly9tYWtlIHN1cmUgaXQgZ2V0cyB1cGRhdGVkIGFjY29yZGluZyB0byB0aGUgcmVxXHJcblx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ3VwZGF0ZSByYXRpbmcnLCBmb3VuZFJhdGluZylcclxuXHRcdFx0XHRpZiAocmVxLmJvZHkucmF0aW5nKSB7XHJcblx0XHRcdFx0XHR2YXIgcmF0aW5nT2JqID0ge3Njb3JlOiByZXEuYm9keS5yYXRpbmd9O1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAocmVxLmJvZHkucmV2aWV3KSB7XHJcblx0XHRcdFx0XHR2YXIgcmF0aW5nT2JqID0ge3JldmlldzogcmVxLmJvZHkucmV2aWV3fTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIG5ldyBSYXRpbmcoeydpZCc6IGZvdW5kUmF0aW5nLmF0dHJpYnV0ZXMuaWR9KVxyXG5cdFx0XHRcdFx0LnNhdmUocmF0aW5nT2JqKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZygnY3JlYXRpbmcgcmF0aW5nJyk7XHJcblx0XHQgICAgcmV0dXJuIFJhdGluZ3MuY3JlYXRlKHtcclxuXHRcdCAgICBcdHNjb3JlOiByZXEuYm9keS5yYXRpbmcsXHJcblx0XHQgICAgICB1c2VyaWQ6IHVzZXJpZCxcclxuXHRcdCAgICAgIG1vdmllaWQ6IHJlcS5ib2R5LmlkLFxyXG5cdFx0ICAgICAgcmV2aWV3OiByZXEuYm9keS5yZXZpZXdcclxuXHRcdCAgICB9KTtcdFx0XHRcdFx0XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0pXHJcblx0LnRoZW4oZnVuY3Rpb24obmV3UmF0aW5nKSB7XHJcblx0XHRjb25zb2xlLmxvZygncmF0aW5nIGNyZWF0ZWQ6JywgbmV3UmF0aW5nLmF0dHJpYnV0ZXMpO1xyXG4gIFx0cmVzLnN0YXR1cygyMDEpLnNlbmQoJ3JhdGluZyByZWNpZXZlZCcpO1xyXG5cdH0pXHJcbiAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xyXG4gICAgcmVzLnN0YXR1cyg1MDApLnNlbmQoJ2Vycm9yJyk7XHJcbiAgfSlcclxufTtcclxuXHJcbi8vdGhpcyBoZWxwZXIgZnVuY3Rpb24gYWRkcyB0aGUgbW92aWUgaW50byBkYXRhYmFzZVxyXG4vL2l0IGZvbGxvd3MgdGhlIHNhbWUgbW92aWUgaWQgYXMgVE1EQlxyXG4vL2V4cGVjdHMgcmVxLmJvZHkgdG8gaGF2ZSB0aGVzZSBhdHJpYnV0ZSA6IHtpZCwgdGl0bGUsIGdlbnJlLCBwb3N0ZXJfcGF0aCwgcmVsZWFzZV9kYXRlLCBvdmVydmlldywgdm90ZV9hdmVyYWdlfVxyXG52YXIgYWRkT25lTW92aWUgPSBmdW5jdGlvbihtb3ZpZU9iaikge1xyXG5cdHZhciBnZW5yZSA9IChtb3ZpZU9iai5nZW5yZV9pZHMpID8gZ2VucmVzW21vdmllT2JqLmdlbnJlX2lkc1swXV0gOiAnbi9hJztcclxuICByZXR1cm4gbmV3IE1vdmllKHtcclxuICBcdGlkOiBtb3ZpZU9iai5pZCxcclxuICAgIHRpdGxlOiBtb3ZpZU9iai50aXRsZSxcclxuICAgIGdlbnJlOiBnZW5yZSxcclxuICAgIHBvc3RlcjogJ2h0dHBzOi8vaW1hZ2UudG1kYi5vcmcvdC9wL3cxODUvJyArIG1vdmllT2JqLnBvc3Rlcl9wYXRoLFxyXG4gICAgcmVsZWFzZV9kYXRlOiBtb3ZpZU9iai5yZWxlYXNlX2RhdGUsXHJcbiAgICBkZXNjcmlwdGlvbjogbW92aWVPYmoub3ZlcnZpZXcuc2xpY2UoMCwgMjU1KSxcclxuICAgIGltZGJSYXRpbmc6IG1vdmllT2JqLnZvdGVfYXZlcmFnZVxyXG4gIH0pLnNhdmUobnVsbCwge21ldGhvZDogJ2luc2VydCd9KVxyXG4gIC50aGVuKGZ1bmN0aW9uKG5ld01vdmllKSB7XHJcbiAgXHRjb25zb2xlLmxvZygnbW92aWUgY3JlYXRlZCcsIG5ld01vdmllLmF0dHJpYnV0ZXMudGl0bGUpO1xyXG4gIFx0cmV0dXJuIG5ld01vdmllO1xyXG4gIH0pXHJcbn07XHJcblxyXG5cclxuLy9nZXQgYWxsIG1vdmllIHJhdGluZ3MgdGhhdCBhIHVzZXIgcmF0ZWRcclxuLy9zaG91bGQgcmV0dXJuIGFuIGFycmF5IHRoYXQgbG9vayBsaWtlIHRoZSBmb2xsb3dpbmc6XHJcbi8vIFsge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnICwgcG9zdGVyOiAndXJsJywgcmVsZWFzZV9kYXRlOiAnZGF0ZScsIHNjb3JlOiBuLCBmcmllbmRBdmVyYWdlUmF0aW5nOiBufSAuLi4gXVxyXG4vLyB3aWxsIGdldCByYXRpbmdzIGZvciB0aGUgY3VycmVudCB1c2VyXHJcbmV4cG9ydHMuZ2V0VXNlclJhdGluZ3MgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIFJhdGluZy5xdWVyeShmdW5jdGlvbihxYil7XHJcbiAgXHRxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcclxuICBcdHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xyXG4gIFx0cWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnLCAncmF0aW5ncy51cGRhdGVkX2F0Jyk7XHJcbiAgXHRxYi53aGVyZSgndXNlcnMudXNlcm5hbWUnLCAnPScsIHJlcS5teVNlc3Npb24udXNlcik7XHJcbiAgXHRxYi5vcmRlckJ5KCd1cGRhdGVkX2F0JywgJ0RFU0MnKVxyXG4gIH0pXHJcbiAgLmZldGNoQWxsKClcclxuICAudGhlbihmdW5jdGlvbihyYXRpbmdzKXtcclxuXHRcdC8vZGVjb3JhdGUgaXQgd2l0aCBhdmcgZnJpZW5kIHJhdGluZ1xyXG5cdFx0cmV0dXJuIFByb21pc2UubWFwKHJhdGluZ3MubW9kZWxzLCBmdW5jdGlvbihyYXRpbmcpIHtcclxuXHRcdFx0cmV0dXJuIGF0dGFjaEZyaWVuZEF2Z1JhdGluZyhyYXRpbmcsIHJlcS5teVNlc3Npb24udXNlcik7XHJcblx0XHR9KTtcclxuXHR9KVxyXG4gIC50aGVuKGZ1bmN0aW9uKHJhdGluZ3MpIHtcclxuICBcdGNvbnNvbGUubG9nKCdyZXRyaXZpbmcgYWxsIHVzZXIgcmF0aW5ncycpO1xyXG4gIFx0cmVzLnN0YXR1cygyMDApLmpzb24ocmF0aW5ncyk7XHJcbiAgfSlcclxufTtcclxuXHJcbmV4cG9ydHMuZ2V0RnJpZW5kVXNlclJhdGluZ3MgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIFJhdGluZy5xdWVyeShmdW5jdGlvbihxYil7XHJcbiAgXHRxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcclxuICBcdHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xyXG4gIFx0cWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUgYXMgZnJpZW5kU2NvcmUnLCAncmF0aW5ncy5yZXZpZXcgYXMgZnJpZW5kUmV2aWV3JywgJ3JhdGluZ3MudXBkYXRlZF9hdCcpO1xyXG4gIFx0cWIud2hlcmUoJ3VzZXJzLnVzZXJuYW1lJywgJz0nLCByZXEucXVlcnkuZnJpZW5kTmFtZSk7XHJcbiAgXHRxYi5vcmRlckJ5KCd1cGRhdGVkX2F0JywgJ0RFU0MnKVxyXG4gIH0pXHJcbiAgLmZldGNoQWxsKClcclxuICAudGhlbihmdW5jdGlvbihyYXRpbmdzKXtcclxuXHRcdC8vZGVjb3JhdGUgaXQgd2l0aCBjdXJyZW50IHVzZXIncyByYXRpbmdcclxuXHRcdHJldHVybiBQcm9taXNlLm1hcChyYXRpbmdzLm1vZGVscywgZnVuY3Rpb24ocmF0aW5nKSB7XHJcblx0XHRcdHJldHVybiBhdHRhY2hVc2VyUmF0aW5nKHJhdGluZywgcmVxLm15U2Vzc2lvbi51c2VyKTtcclxuXHRcdH0pO1xyXG5cdH0pXHJcbiAgLnRoZW4oZnVuY3Rpb24ocmF0aW5ncykge1xyXG4gIFx0Y29uc29sZS5sb2coJ3JldHJpdmluZyBhbGwgdXNlciByYXRpbmdzJyk7XHJcbiAgXHRyZXMuc3RhdHVzKDIwMCkuanNvbihyYXRpbmdzKTtcclxuICB9KVxyXG59O1xyXG5cclxuLy9hIGRlY29yYXRvciBmdW5jdGlvbiB0aGF0IGF0dGFjaGVzIGZyaWVuZCBhdmcgcmF0aW5nIHRvIHRoZSByYXRpbmcgb2JqXHJcbnZhciBhdHRhY2hGcmllbmRBdmdSYXRpbmcgPSBmdW5jdGlvbihyYXRpbmcsIHVzZXJuYW1lKSB7XHJcblx0cmV0dXJuIGV4cG9ydHMuZ2V0RnJpZW5kUmF0aW5ncyh1c2VybmFtZSwgcmF0aW5nKVxyXG5cdC50aGVuKGZ1bmN0aW9uKGZyaWVuZHNSYXRpbmdzKXtcclxuXHRcdC8vaWYgZnJpZW5kc1JhdGluZ3MgaXMgbnVsbCwgUmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyBpcyBudWxsXHJcblx0XHRpZiAoIWZyaWVuZHNSYXRpbmdzKSB7XHJcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgPSBudWxsO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyA9IGF2ZXJhZ2VSYXRpbmcoZnJpZW5kc1JhdGluZ3MpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJhdGluZztcclxuXHR9KVxyXG59XHJcblxyXG4vL2EgZGVjb3JhdG9yIGZ1bmN0aW9uIHRoYXQgYXR0YWNoZXMgdXNlciByYXRpbmcgYW5kIHJldmlld3MgdG8gdGhlIHJhdGluZyBvYmpcclxudmFyIGF0dGFjaFVzZXJSYXRpbmcgPSBmdW5jdGlvbihyYXRpbmcsIHVzZXJuYW1lKSB7XHJcblx0cmV0dXJuIFJhdGluZy5xdWVyeShmdW5jdGlvbihxYikge1xyXG5cdFx0cWIuaW5uZXJKb2luKCd1c2VycycsICd1c2Vycy5pZCcsICc9JywgJ3JhdGluZ3MudXNlcmlkJylcclxuXHRcdHFiLmlubmVySm9pbignbW92aWVzJywgJ21vdmllcy5pZCcsICc9JywgJ3JhdGluZ3MubW92aWVpZCcpXHJcblx0XHRxYi5zZWxlY3QoJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnKVxyXG5cdFx0cWIud2hlcmUoe1xyXG5cdFx0XHQndXNlcnMudXNlcm5hbWUnOiB1c2VybmFtZSxcclxuXHRcdFx0J21vdmllcy50aXRsZSc6IHJhdGluZy5hdHRyaWJ1dGVzLnRpdGxlLFxyXG5cdFx0XHQnbW92aWVzLmlkJzogcmF0aW5nLmF0dHJpYnV0ZXMuaWRcclxuXHRcdH0pXHJcblx0fSlcclxuXHQuZmV0Y2goKVxyXG5cdC50aGVuKGZ1bmN0aW9uKHVzZXJSYXRpbmcpe1xyXG5cdFx0aWYgKHVzZXJSYXRpbmcpIHtcclxuXHRcdFx0cmF0aW5nLmF0dHJpYnV0ZXMuc2NvcmUgPSB1c2VyUmF0aW5nLmF0dHJpYnV0ZXMuc2NvcmU7XHJcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLnJldmlldyA9IHVzZXJSYXRpbmcuYXR0cmlidXRlcy5yZXZpZXc7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyYXRpbmcuYXR0cmlidXRlcy5zY29yZSA9IG51bGw7XHJcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLnJldmlldyA9IG51bGw7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmF0aW5nO1xyXG5cdH0pO1xyXG59O1xyXG5cclxuLy90aGlzIGlzIGEgd3JhcGVyIGZ1bmN0aW9uIGZvciBnZXRGcmllbmRSYXRpbmdzIHdoaWNoIHdpbGwgc2VudCB0aGUgY2xpZW50IGFsbCBvZiB0aGUgZnJpZW5kIHJhdGluZ3NcclxuZXhwb3J0cy5oYW5kbGVHZXRGcmllbmRSYXRpbmdzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuXHRjb25zb2xlLmxvZygnaGFuZGxlR2V0RnJpZW5kUmF0aW5ncywgJywgcmVxLm15U2Vzc2lvbi51c2VyLCByZXEuYm9keS5tb3ZpZS50aXRsZSk7XHJcblx0ZXhwb3J0cy5nZXRGcmllbmRSYXRpbmdzKHJlcS5teVNlc3Npb24udXNlciwge2F0dHJpYnV0ZXM6IHJlcS5ib2R5Lm1vdmllfSlcclxuXHQudGhlbihmdW5jdGlvbihmcmllbmRSYXRpbmdzKXtcclxuXHRcdHJlcy5qc29uKGZyaWVuZFJhdGluZ3MpO1xyXG5cdH0pO1xyXG59XHJcblxyXG4vL3RoaXMgZnVuY3Rpb24gb3V0cHV0cyByYXRpbmdzIG9mIGEgdXNlcidzIGZyaWVuZCBmb3IgYSBwYXJ0aWN1bGFyIG1vdmllXHJcbi8vZXhwZWN0IGN1cnJlbnQgdXNlcm5hbWUgYW5kIG1vdmllVGl0bGUgYXMgaW5wdXRcclxuLy9vdXRwdXRzOiB7dXNlcjJpZDogJ2lkJywgZnJpZW5kVXNlck5hbWU6J25hbWUnLCBmcmllbmRGaXJzdE5hbWU6J25hbWUnLCB0aXRsZTonbW92aWVUaXRsZScsIHNjb3JlOm4gfVxyXG5leHBvcnRzLmdldEZyaWVuZFJhdGluZ3MgPSBmdW5jdGlvbih1c2VybmFtZSwgbW92aWVPYmopIHtcclxuXHRyZXR1cm4gVXNlci5xdWVyeShmdW5jdGlvbihxYil7XHJcblx0XHRxYi5pbm5lckpvaW4oJ3JlbGF0aW9ucycsICdyZWxhdGlvbnMudXNlcjFpZCcsICc9JywgJ3VzZXJzLmlkJyk7XHJcblx0XHRxYi5pbm5lckpvaW4oJ3JhdGluZ3MnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICdyZWxhdGlvbnMudXNlcjJpZCcpO1xyXG5cdFx0cWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XHJcblx0XHRxYi5zZWxlY3QoJ3JlbGF0aW9ucy51c2VyMmlkJywgJ21vdmllcy50aXRsZScsICdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3Jyk7XHJcblx0XHRxYi53aGVyZSh7XHJcblx0XHRcdCd1c2Vycy51c2VybmFtZSc6IHVzZXJuYW1lLCBcclxuXHRcdFx0J21vdmllcy50aXRsZSc6IG1vdmllT2JqLmF0dHJpYnV0ZXMudGl0bGUsXHJcblx0XHRcdCdtb3ZpZXMuaWQnOiBtb3ZpZU9iai5hdHRyaWJ1dGVzLmlkIH0pO1xyXG5cdH0pXHJcblx0LmZldGNoQWxsKClcclxuXHQudGhlbihmdW5jdGlvbihmcmllbmRzUmF0aW5ncyl7XHJcblx0Ly90aGUgZm9sbG93aW5nIGJsb2NrIGFkZHMgdGhlIGZyaWVuZE5hbWUgYXR0cmlidXRlIHRvIHRoZSByYXRpbmdzXHJcblx0XHRyZXR1cm4gUHJvbWlzZS5tYXAoZnJpZW5kc1JhdGluZ3MubW9kZWxzLCBmdW5jdGlvbihmcmllbmRSYXRpbmcpIHtcclxuXHRcdFx0cmV0dXJuIG5ldyBVc2VyKHsgaWQ6IGZyaWVuZFJhdGluZy5hdHRyaWJ1dGVzLnVzZXIyaWQgfSkuZmV0Y2goKVxyXG5cdFx0XHQudGhlbihmdW5jdGlvbihmcmllbmQpe1xyXG5cdFx0XHRcdGZyaWVuZFJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZFVzZXJOYW1lID0gZnJpZW5kLmF0dHJpYnV0ZXMudXNlcm5hbWU7XHJcblx0XHRcdFx0ZnJpZW5kUmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kRmlyc3ROYW1lID0gZnJpZW5kLmF0dHJpYnV0ZXMuZmlyc3ROYW1lO1xyXG5cdFx0XHRcdHJldHVybiBmcmllbmRSYXRpbmc7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSlcclxuXHQudGhlbihmdW5jdGlvbihmcmllbmRzUmF0aW5ncyl7XHJcblx0XHRyZXR1cm4gZnJpZW5kc1JhdGluZ3M7XHJcblx0fSk7XHJcbn07XHJcblxyXG5cclxuLy9hIGhlbHBlciBmdW5jdGlvbiB0aGF0IGF2ZXJhZ2VzIHRoZSByYXRpbmdcclxuLy9pbnB1dHMgcmF0aW5ncywgb3V0cHV0cyB0aGUgYXZlcmFnZSBzY29yZTtcclxudmFyIGF2ZXJhZ2VSYXRpbmcgPSBmdW5jdGlvbihyYXRpbmdzKSB7XHJcblx0Ly9yZXR1cm4gbnVsbCBpZiBubyBmcmllbmQgaGFzIHJhdGVkIHRoZSBtb3ZpZVxyXG5cdGlmIChyYXRpbmdzLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG5cdHJldHVybiByYXRpbmdzXHJcblx0LnJlZHVjZShmdW5jdGlvbih0b3RhbCwgcmF0aW5nKXtcclxuXHRcdHJldHVybiB0b3RhbCArPSByYXRpbmcuYXR0cmlidXRlcy5zY29yZTtcclxuXHR9LCAwKSAvIHJhdGluZ3MubGVuZ3RoO1xyXG59XHJcblxyXG5cclxuLy9hIGhlbHBlciBmdW5jdGlvbiB0aGF0IG91dHB1dHMgdXNlciByYXRpbmcgYW5kIGF2ZXJhZ2UgZnJpZW5kIHJhdGluZyBmb3Igb25lIG1vdmllXHJcbi8vb3V0cHV0cyBvbmUgcmF0aW5nIG9iajoge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnICwgcG9zdGVyOiAndXJsJywgcmVsZWFzZV9kYXRlOiAnZGF0ZScsIHNjb3JlOiBuLCBmcmllbmRBdmVyYWdlUmF0aW5nOiBufVxyXG52YXIgZ2V0T25lTW92aWVSYXRpbmcgPSBmdW5jdGlvbih1c2VybmFtZSwgbW92aWVPYmopIHtcclxuICByZXR1cm4gUmF0aW5nLnF1ZXJ5KGZ1bmN0aW9uKHFiKXtcclxuICBcdHFiLmlubmVySm9pbigndXNlcnMnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICd1c2Vycy5pZCcpO1xyXG4gIFx0cWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XHJcbiAgXHRxYi5zZWxlY3QoJ3VzZXJzLnVzZXJuYW1lJywgJ21vdmllcy50aXRsZScsICdtb3ZpZXMuaWQnLCAnbW92aWVzLmdlbnJlJywgJ21vdmllcy5wb3N0ZXInLCAnbW92aWVzLnJlbGVhc2VfZGF0ZScsICdtb3ZpZXMuaW1kYlJhdGluZycsICdtb3ZpZXMuZGVzY3JpcHRpb24nLCAncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycpO1xyXG4gIFx0cWIud2hlcmUoeyd1c2Vycy51c2VybmFtZSc6IHVzZXJuYW1lLCAnbW92aWVzLnRpdGxlJzogbW92aWVPYmoudGl0bGUsICdtb3ZpZXMuaWQnOiBtb3ZpZU9iai5pZH0pO1xyXG4gIH0pXHJcbiAgLmZldGNoKClcclxuICAudGhlbihmdW5jdGlvbihyYXRpbmcpe1xyXG5cdCAgaWYgKCFyYXRpbmcpIHtcclxuXHQgIFx0Ly9pZiB0aGUgdXNlciBoYXMgbm90IHJhdGVkIHRoZSBtb3ZpZSwgcmV0dXJuIGFuIG9iaiB0aGF0IGhhcyB0aGUgbW92aWUgaW5mb3JtYXRpb24sIGJ1dCBzY29yZSBpcyBzZXQgdG8gbnVsbFxyXG5cdCAgXHRyZXR1cm4gbmV3IE1vdmllKHt0aXRsZTogbW92aWVPYmoudGl0bGUsIGlkOiBtb3ZpZU9iai5pZH0pLmZldGNoKClcclxuXHQgIFx0LnRoZW4oZnVuY3Rpb24obW92aWUpIHtcclxuXHQgIFx0XHRtb3ZpZS5hdHRyaWJ1dGVzLnNjb3JlID0gbnVsbDtcclxuXHQgIFx0XHRyZXR1cm4gbW92aWU7XHJcblx0ICBcdH0pXHJcblx0ICB9IGVsc2Uge1xyXG5cdCAgXHRyZXR1cm4gcmF0aW5nO1xyXG5cdCAgfVxyXG5cdH0pXHJcblx0LnRoZW4oZnVuY3Rpb24ocmF0aW5nKXtcclxuXHRcdHJldHVybiBleHBvcnRzLmdldEZyaWVuZFJhdGluZ3ModXNlcm5hbWUsIHJhdGluZylcclxuXHRcdC50aGVuKGZ1bmN0aW9uKGZyaWVuZHNSYXRpbmdzKXtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ2ZyaWVuZHNSYXRpbmdzJywgZnJpZW5kc1JhdGluZ3MpO1xyXG5cdFx0XHRyYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nID0gYXZlcmFnZVJhdGluZyhmcmllbmRzUmF0aW5ncyk7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdhZGRlZCBhdmVyYWdlIGZyaWVuZCByYXRpbmcnLCByYXRpbmcuYXR0cmlidXRlcy50aXRsZSwgcmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyk7XHJcblx0XHRcdHJldHVybiByYXRpbmc7XHJcblx0XHR9KTtcclxuXHR9KTtcclxufVxyXG5cclxuXHJcbi8vdGhpcyBoYW5kbGVyIGlzIHNwZWNpZmljYWxseSBmb3Igc2VuZGluZyBvdXQgYSBsaXN0IG9mIG1vdmllIHJhdGluZ3Mgd2hlbiB0aGUgY2xpZW50IHNlbmRzIGEgbGlzdCBvZiBtb3ZpZSB0byB0aGUgc2VydmVyXHJcbi8vZXhwZWN0cyByZXEuYm9keSB0byBiZSBhbiBhcnJheSBvZiBvYmogd2l0aCB0aGVzZSBhdHRyaWJ1dGVzOiB7aWQsIHRpdGxlLCBnZW5yZSwgcG9zdGVyX3BhdGgsIHJlbGVhc2VfZGF0ZSwgb3ZlcnZpZXcsIHZvdGVfYXZlcmFnZX1cclxuLy9vdXRwdXRzIFsge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnICwgcG9zdGVyOiAndXJsJywgcmVsZWFzZV9kYXRlOiAnZGF0ZScsIHNjb3JlOiBuLCBmcmllbmRBdmVyYWdlUmF0aW5nOiBufSAuLi4gXVxyXG5leHBvcnRzLmdldE11bHRpcGxlTW92aWVSYXRpbmdzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuXHRjb25zb2xlLmxvZygnZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MnKTtcclxuXHRQcm9taXNlLm1hcChyZXEuYm9keS5tb3ZpZXMsIGZ1bmN0aW9uKG1vdmllKSB7XHJcblx0XHQvL2ZpcnN0IGNoZWNrIHdoZXRoZXIgbW92aWUgaXMgaW4gdGhlIGRhdGFiYXNlXHJcblx0XHRyZXR1cm4gbmV3IE1vdmllKHt0aXRsZTogbW92aWUudGl0bGUsIGlkOiBtb3ZpZS5pZH0pLmZldGNoKClcclxuXHRcdC50aGVuKGZ1bmN0aW9uKGZvdW5kTW92aWUpIHtcclxuXHRcdFx0Ly9pZiBub3QgY3JlYXRlIG9uZVxyXG5cdFx0XHRpZiAoIWZvdW5kTW92aWUpIHtcclxuXHRcdFx0XHRyZXR1cm4gYWRkT25lTW92aWUobW92aWUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBmb3VuZE1vdmllO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdFx0LnRoZW4oZnVuY3Rpb24oZm91bmRNb3ZpZSl7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdmb3VuZCBtb3ZpZScsIGZvdW5kTW92aWUpO1xyXG5cdFx0XHRyZXR1cm4gZ2V0T25lTW92aWVSYXRpbmcocmVxLm15U2Vzc2lvbi51c2VyLCBmb3VuZE1vdmllLmF0dHJpYnV0ZXMpO1xyXG5cdFx0fSlcclxuXHR9KVxyXG5cdC50aGVuKGZ1bmN0aW9uKHJhdGluZ3Mpe1xyXG5cdFx0Y29uc29sZS5sb2coJ3NlbmRpbmcgcmF0aW5nIHRvIGNsaWVudCcpO1xyXG5cdFx0cmVzLmpzb24ocmF0aW5ncyk7XHJcblx0fSlcclxufVxyXG5cclxuLy90aGlzIGhhbmRsZXIgc2VuZHMgYW4gZ2V0IHJlcXVlc3QgdG8gVE1EQiBBUEkgdG8gcmV0cml2ZSByZWNlbnQgdGl0bGVzXHJcbi8vd2UgY2Fubm90IGRvIGl0IGluIHRoZSBmcm9udCBlbmQgYmVjYXVzZSBjcm9zcyBvcmlnaW4gcmVxdWVzdCBpc3N1ZXNcclxuZXhwb3J0cy5nZXRSZWNlbnRSZWxlYXNlID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICB2YXIgcGFyYW1zID0ge1xyXG4gICAgYXBpX2tleTogJzlkM2IwMzVlZjFjZDY2OWFlZDM5ODQwMGIxN2ZjZWEyJyxcclxuICAgIHByaW1hcnlfcmVsZWFzZV95ZWFyOiBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCksXHJcbiAgICBpbmNsdWRlX2FkdWx0OiBmYWxzZSxcclxuICAgIHNvcnRfYnk6ICdwb3B1bGFyaXR5LmRlc2MnXHJcbiAgfTtcclxuXHJcblx0IFxyXG4gIHZhciBkYXRhID0gJyc7XHJcblx0cmVxdWVzdCh7XHJcblx0XHRtZXRob2Q6ICdHRVQnLFxyXG5cdFx0dXJsOiAnaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy9kaXNjb3Zlci9tb3ZpZS8nLFxyXG5cdFx0cXM6IHBhcmFtc1xyXG5cdH0pXHJcblx0Lm9uKCdkYXRhJyxmdW5jdGlvbihjaHVuayl7XHJcblx0XHRkYXRhICs9IGNodW5rO1xyXG5cdH0pXHJcblx0Lm9uKCdlbmQnLCBmdW5jdGlvbigpe1xyXG5cdFx0cmVjZW50TW92aWVzID0gSlNPTi5wYXJzZShkYXRhKTtcclxuICAgIHJlcS5ib2R5Lm1vdmllcyA9IHJlY2VudE1vdmllcy5yZXN1bHRzO1xyXG4gICAgLy90cmFuc2ZlcnMgdGhlIG1vdmllIGRhdGEgdG8gZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MgdG8gZGVjb3JhdGUgd2l0aCBzY29yZSAodXNlciByYXRpbmcpIGFuZCBhdmdmcmllbmRSYXRpbmcgYXR0cmlidXRlXHJcbiAgICBleHBvcnRzLmdldE11bHRpcGxlTW92aWVSYXRpbmdzKHJlcSwgcmVzKTtcclxuXHJcblx0fSlcclxuXHQub24oJ2Vycm9yJywgZnVuY3Rpb24oZXJyb3Ipe1xyXG5cdFx0Y29uc29sZS5sb2coZXJyb3IpO1xyXG5cdH0pXHJcblxyXG59XHJcblxyXG4vL3RoaXMgaXMgVE1EQidzIGdlbnJlIGNvZGUsIHdlIG1pZ2h0IHdhbnQgdG8gcGxhY2UgdGhpcyBzb21ld2hlcmUgZWxzZVxyXG52YXIgZ2VucmVzID0ge1xyXG4gICAxMjogXCJBZHZlbnR1cmVcIixcclxuICAgMTQ6IFwiRmFudGFzeVwiLFxyXG4gICAxNjogXCJBbmltYXRpb25cIixcclxuICAgMTg6IFwiRHJhbWFcIixcclxuICAgMjc6IFwiSG9ycm9yXCIsXHJcbiAgIDI4OiBcIkFjdGlvblwiLFxyXG4gICAzNTogXCJDb21lZHlcIixcclxuICAgMzY6IFwiSGlzdG9yeVwiLFxyXG4gICAzNzogXCJXZXN0ZXJuXCIsXHJcbiAgIDUzOiBcIlRocmlsbGVyXCIsXHJcbiAgIDgwOiBcIkNyaW1lXCIsXHJcbiAgIDk5OiBcIkRvY3VtZW50YXJ5XCIsXHJcbiAgIDg3ODogXCJTY2llbmNlIEZpY3Rpb25cIixcclxuICAgOTY0ODogXCJNeXN0ZXJ5XCIsXHJcbiAgIDEwNDAyOiBcIk11c2ljXCIsXHJcbiAgIDEwNzQ5OiBcIlJvbWFuY2VcIixcclxuICAgMTA3NTE6IFwiRmFtaWx5XCIsXHJcbiAgIDEwNzUyOiBcIldhclwiLFxyXG4gICAxMDc2OTogXCJGb3JlaWduXCIsXHJcbiAgIDEwNzcwOiBcIlRWIE1vdmllXCJcclxuIH07XHJcblxyXG4vL3RoaXMgZnVuY3Rpb24gd2lsbCBzZW5kIGJhY2sgc2VhcmNiIG1vdmllcyB1c2VyIGhhcyByYXRlZCBpbiB0aGUgZGF0YWJhc2VcclxuLy9pdCB3aWxsIHNlbmQgYmFjayBtb3ZpZSBvYmpzIHRoYXQgbWF0Y2ggdGhlIHNlYXJjaCBpbnB1dCwgZXhwZWN0cyBtb3ZpZSBuYW1lIGluIHJlcS5ib2R5LnRpdGxlXHJcbmV4cG9ydHMuc2VhcmNoUmF0ZWRNb3ZpZSA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgcmV0dXJuIFJhdGluZy5xdWVyeShmdW5jdGlvbihxYil7XHJcblx0XHRxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcclxuXHRcdHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xyXG5cdFx0cWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnKTtcclxuICBcdHFiLndoZXJlUmF3KGBNQVRDSCAobW92aWVzLnRpdGxlKSBBR0FJTlNUICgnJHtyZXEucXVlcnkudGl0bGV9JyBJTiBOQVRVUkFMIExBTkdVQUdFIE1PREUpYClcclxuICBcdHFiLmFuZFdoZXJlKCd1c2Vycy51c2VybmFtZScsICc9JywgcmVxLm15U2Vzc2lvbi51c2VyKVxyXG4gIFx0cWIub3JkZXJCeSgndXBkYXRlZF9hdCcsICdERVNDJylcclxuICB9KVxyXG4gIC5mZXRjaEFsbCgpXHJcbiAgLnRoZW4oZnVuY3Rpb24obWF0Y2hlcyl7XHJcbiAgXHRjb25zb2xlLmxvZyhtYXRjaGVzLm1vZGVscyk7XHJcbiAgXHRyZXMuanNvbihtYXRjaGVzKTtcclxuICB9KVxyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy9mcmllbmRzaGlwIGhhbmRsZXJzXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZXhwb3J0cy5nZXRGcmllbmRMaXN0ID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuXHRyZXR1cm4gUmVsYXRpb24ucXVlcnkoZnVuY3Rpb24ocWIpe1xyXG5cdFx0cWIuaW5uZXJKb2luKCd1c2VycycsICdyZWxhdGlvbnMudXNlcjFpZCcsICc9JywgJ3VzZXJzLmlkJyk7XHJcblx0XHRxYi5zZWxlY3QoJ3JlbGF0aW9ucy51c2VyMmlkJyk7XHJcblx0XHRxYi53aGVyZSh7XHJcblx0XHRcdCd1c2Vycy51c2VybmFtZSc6IHJlcS5teVNlc3Npb24udXNlclxyXG5cdFx0fSlcclxuXHR9KVxyXG5cdC5mZXRjaEFsbCgpXHJcblx0LnRoZW4oZnVuY3Rpb24oZnJpZW5kcyl7XHJcblx0XHRyZXR1cm4gUHJvbWlzZS5tYXAoZnJpZW5kcy5tb2RlbHMsIGZ1bmN0aW9uKGZyaWVuZCkge1xyXG5cdFx0XHRyZXR1cm4gbmV3IFVzZXIoe2lkOiBmcmllbmQuYXR0cmlidXRlcy51c2VyMmlkfSkuZmV0Y2goKVxyXG5cdFx0XHQudGhlbihmdW5jdGlvbihmcmllbmRVc2VyKXtcclxuXHRcdFx0XHRyZXR1cm4gZnJpZW5kVXNlci5hdHRyaWJ1dGVzLnVzZXJuYW1lO1xyXG5cdFx0XHR9KVxyXG5cdFx0fSlcclxuXHR9KVxyXG5cdC50aGVuKGZ1bmN0aW9uKGZyaWVuZHMpe1xyXG5cdFx0Y29uc29sZS5sb2coJ3NlbmRpbmcgYSBsaXN0IG9mIGZyaWVuZCBuYW1lcycsIGZyaWVuZHMpO1xyXG5cdFx0cmVzLmpzb24oZnJpZW5kcyk7XHJcblx0fSlcclxufVxyXG5cclxuLy90aGlzIHdvdWxkIHNlbmQgYSBub3RpY2UgdG8gdGhlIHVzZXIgd2hvIHJlY2VpdmUgdGhlIGZyaWVuZCByZXF1ZXN0LCBwcm9tcHRpbmcgdGhlbSB0byBhY2NlcHQgb3IgZGVueSB0aGUgcmVxdWVzdFxyXG5leHBvcnRzLmFkZEZyaWVuZCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcblxyXG59O1xyXG5cclxuXHJcbi8vdGhpcyB3b3VsZCBjb25maXJtIHRoZSBmcmllbmRzaGlwIGFuZCBlc3RhYmxpc2ggdGhlIHJlbGF0aW9uc2hpcCBpbiB0aGUgZGF0YWJhc2VcclxuZXhwb3J0cy5jb25maXJtRnJpZW5kc2hpcCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcblxyXG59O1xyXG5cclxuXHJcblxyXG5leHBvcnRzLmdldEZyaWVuZHMgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIHZhciBwZW9wbGVJZCA9IFtdO1xyXG4gIHZhciBpZCA9IHJlcS5teVNlc3Npb24udXNlclxyXG4gIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgaWQsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xyXG4gICAgdmFyIHVzZXJpZCA9IHJlc3BbMF0uaWQ7XHJcbiAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgYmUgbGluZy8yJyxpZClcclxuICBcclxuICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByYXRpbmdzIFdIRVJFIHVzZXJpZCA9ID8nLCB1c2VyaWQsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xyXG4gICAgICB2YXIgdXNlcnNSYXRpbmdzPXJlc3AubWFwKGZ1bmN0aW9uKGEpeyByZXR1cm4gW2EubW92aWVpZCwgYS5zY29yZV19KTtcclxuXHJcbiAgICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByZWxhdGlvbnMgV0hFUkUgdXNlcjFpZCA9ID8nLCB1c2VyaWQsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgaWYgKHBlb3BsZUlkLmluZGV4T2YocmVzcFtpXS51c2VyMmlkKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgcGVvcGxlSWQucHVzaChyZXNwW2ldLnVzZXIyaWQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcGVvcGxlID0gW11cclxuICAgICAgICBjb25zb2xlLmxvZygnVGhpcyBzaG91bGQgYWxzbyBiZSBwZW9wbGVlZScscGVvcGxlSWQpO1xyXG4gICAgICAgIHZhciBrZXlJZD17fTtcclxuICAgICAgICBwZW9wbGVJZC5mb3JFYWNoKGZ1bmN0aW9uKGEpIHtcclxuXHJcbiAgICAgICAgICBjb24ucXVlcnkoJ1NFTEVDVCB1c2VybmFtZSBGUk9NIHVzZXJzIFdIRVJFIGlkID0gPycsIGEsIGZ1bmN0aW9uKGVyciwgcmVzcG8pIHtcclxuICBcdCAgICAgICAga2V5SWRbYV09cmVzcG9bMF0udXNlcm5hbWU7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0aGlzIGlzIE9ORSBvZiB0aGUgcGVvcGxlISEnLHJlc3BvWzBdLnVzZXJuYW1lKVxyXG4gICAgICAgICAgICBjb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gcmF0aW5ncyBXSEVSRSB1c2VyaWQgPScrJ1wiJythKydcIicsIGZ1bmN0aW9uKGVyciwgcmUpIHtcclxuICAgICAgXHQgICAgICBjb25zb2xlLmxvZygndGhpcyBpcyBhJyxhKVxyXG4gICAgICBcdCAgICAgIGlmIChyZS5sZW5ndGg9PT0wKXtcclxuICAgICAgXHRcdCAgICAgIHJlPVt7dXNlcmlkOmEsbW92aWVpZDpNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkqMTAwMDApLHNjb3JlOjk5fV1cclxuICAgICAgXHQgICAgICB9XHJcbiAgICAgIFx0ICAgICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGJlIHRoZSByYXRpbmdzIGZyb20gZWFjaCBwZXJzb24hIScscmUpO1xyXG5cclxuICAgICAgICAgICAgICBwZW9wbGUucHVzaChyZS5tYXAoZnVuY3Rpb24oYSl7cmV0dXJuIFthLnVzZXJpZCxhLm1vdmllaWQsYS5zY29yZV07fSkpO1xyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIGlmIChwZW9wbGUubGVuZ3RoPT09cGVvcGxlSWQubGVuZ3RoKXtcclxuICAgICAgICAgICAgICAgIHZhciBmaW5hbCA9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBiZSBwZW9wbGUnLCBwZW9wbGUpO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwZW9wbGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKHBlb3BsZVtpXVswXSE9PXVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgZmluYWxba2V5SWRbcGVvcGxlW2ldWzBdWzBdXV0gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBlb3BsZVtpXS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgZmluYWxba2V5SWRbcGVvcGxlW2ldWzBdWzBdXV0ucHVzaChbXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB6ID0gMTsgeiA8IHBlb3BsZVtpXVt4XS5sZW5ndGg7IHorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5hbFtrZXlJZFtwZW9wbGVbaV1bMF1bMF1dXVt4XS5wdXNoKHBlb3BsZVtpXVt4XVt6XSlcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZmluYWwnLGZpbmFsLHVzZXJzUmF0aW5ncyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGNvbXBhcmlzb25zPXt9O1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGZpbmFsKXtcclxuICAgICAgICAgICAgICAgICAgY29tcGFyaXNvbnNba2V5XT1jb21wKHVzZXJzUmF0aW5ncyxmaW5hbFtrZXldKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY29tcGFyaXNvbnMpO1xyXG4gICAgICAgICAgICAgICAgdmVyeUZpbmFsPVtdO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGNvbXBhcmlzb25zKXtcclxuICAgICAgICAgICAgICAgICAgdmVyeUZpbmFsLnB1c2goW2tleSxjb21wYXJpc29uc1trZXldXSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHZlcnlGaW5hbCk7XHJcbiAgICAgICAgICAgICAgICByZXMuc2VuZCh2ZXJ5RmluYWwpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG4gIH0pXHJcbn07XHJcblxyXG5cclxuXHJcbi8vVEJEXHJcbmV4cG9ydHMuZ2V0SGlnaENvbXBhdGliaWxpdHlVc2VycyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgXHJcbn07XHJcblxyXG5cclxuLy9UQkRcclxuZXhwb3J0cy5nZXRSZWNvbW1lbmRlZE1vdmllcyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcblxyXG59OyJdfQ==
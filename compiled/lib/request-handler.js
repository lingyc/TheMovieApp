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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9yZXF1ZXN0LWhhbmRsZXIuanMiXSwibmFtZXMiOlsiaGVscGVyIiwibnVtMSIsIm51bTIiLCJkaWZmIiwiTWF0aCIsImFicyIsImNvbXAiLCJmaXJzdCIsInNlY29uZCIsImZpbmFsIiwiaSIsImxlbmd0aCIsIngiLCJwdXNoIiwic3VtIiwicmVkdWNlIiwiYSIsImIiLCJyb3VuZCIsImRiIiwicmVxdWlyZSIsIm15c3FsIiwiZXhwcmVzcyIsIk1vdmllIiwiUmF0aW5nIiwiUmVsYXRpb24iLCJVc2VyIiwiYWxsUmVxdWVzdCIsIk1vdmllcyIsIlJhdGluZ3MiLCJSZWxhdGlvbnMiLCJVc2VycyIsImFsbFJlcXVlc3RzIiwiUHJvbWlzZSIsInJlcXVlc3QiLCJjb24iLCJjcmVhdGVDb25uZWN0aW9uIiwiaG9zdCIsInVzZXIiLCJwYXNzd29yZCIsImRhdGFiYXNlIiwiY29ubmVjdCIsImVyciIsImNvbnNvbGUiLCJsb2ciLCJleHBvcnRzIiwic2lnbnVwVXNlciIsInJlcSIsInJlcyIsImJvZHkiLCJ1c2VybmFtZSIsIm5hbWUiLCJmZXRjaCIsInRoZW4iLCJmb3VuZCIsInN0YXR1cyIsInNlbmQiLCJteVNlc3Npb24iLCJjcmVhdGUiLCJzZW5kV2F0Y2hSZXF1ZXN0IiwicmVzcG9uc2UiLCJyZXF1ZXN0ZWUiLCJBcnJheSIsImlzQXJyYXkiLCJyZXF1ZXN0ZWVzIiwiZWFjaCIsIm1lc3NhZ2UiLCJyZXF1ZXN0b3IiLCJyZXF1ZXN0VHlwIiwibW92aWUiLCJxdWVyeSIsImluc2VydElkIiwiZG9uZSIsInJlbW92ZVdhdGNoUmVxdWVzdCIsImZvcmdlIiwiZGVzdHJveSIsImpzb24iLCJlcnJvciIsImRhdGEiLCJjYXRjaCIsInNlbmRSZXF1ZXN0IiwidW5kZWZpbmVkIiwidGVzdCIsImZpbHRlciIsInRlc3QyIiwibWFwIiwicmVzcCIsImxpc3RSZXF1ZXN0cyIsImFjY2VwdCIsInBlcnNvblRvQWNjZXB0IiwicmVxdWVzdFR5cGUiLCJpZCIsInBlcnNvbjEiLCJwZXJzb24yIiwidXNlcjFpZCIsInVzZXIyaWQiLCJyZXF1ZXN0MiIsInJlbW92ZVJlcXVlc3QiLCJnZXRUaGlzRnJpZW5kc01vdmllcyIsIm1vdmllcyIsInNwZWNpZmljRnJpZW5kIiwicGVyc29uIiwibGVuIiwiZm9yRWFjaCIsIm1vdmllaWQiLCJ0aXRsZSIsInNjb3JlIiwicmV2aWV3IiwiZmluZE1vdmllQnVkZGllcyIsInBlb3BsZSIsIklkcyIsImlkS2V5T2JqIiwiY3VycmVudFVzZXIiLCJvYmoxIiwicmVzcG9uIiwidXNlcmlkIiwiY3VycmVudFVzZXJJbmZvIiwiY29tcGFyaXNvbnMiLCJrZXkiLCJmaW5hbFNlbmQiLCJkZWNsaW5lIiwicGVyc29uVG9EZWNsaW5lIiwic2lnbmluVXNlciIsImF0dHJpYnV0ZXMiLCJsb2dvdXQiLCJyYXRlTW92aWUiLCJmb3VuZFVzZXIiLCJmb3VuZFJhdGluZyIsInJhdGluZyIsInJhdGluZ09iaiIsInNhdmUiLCJuZXdSYXRpbmciLCJhZGRPbmVNb3ZpZSIsIm1vdmllT2JqIiwiZ2VucmUiLCJnZW5yZV9pZHMiLCJnZW5yZXMiLCJwb3N0ZXIiLCJwb3N0ZXJfcGF0aCIsInJlbGVhc2VfZGF0ZSIsImRlc2NyaXB0aW9uIiwib3ZlcnZpZXciLCJzbGljZSIsImltZGJSYXRpbmciLCJ2b3RlX2F2ZXJhZ2UiLCJtZXRob2QiLCJuZXdNb3ZpZSIsImdldFVzZXJSYXRpbmdzIiwicWIiLCJpbm5lckpvaW4iLCJzZWxlY3QiLCJ3aGVyZSIsIm9yZGVyQnkiLCJmZXRjaEFsbCIsInJhdGluZ3MiLCJtb2RlbHMiLCJhdHRhY2hGcmllbmRBdmdSYXRpbmciLCJnZXRGcmllbmRVc2VyUmF0aW5ncyIsImZyaWVuZE5hbWUiLCJhdHRhY2hVc2VyUmF0aW5nIiwiZ2V0RnJpZW5kUmF0aW5ncyIsImZyaWVuZHNSYXRpbmdzIiwiZnJpZW5kQXZlcmFnZVJhdGluZyIsImF2ZXJhZ2VSYXRpbmciLCJ1c2VyUmF0aW5nIiwiaGFuZGxlR2V0RnJpZW5kUmF0aW5ncyIsImZyaWVuZFJhdGluZ3MiLCJmcmllbmRSYXRpbmciLCJmcmllbmQiLCJmcmllbmRVc2VyTmFtZSIsImZyaWVuZEZpcnN0TmFtZSIsImZpcnN0TmFtZSIsInRvdGFsIiwiZ2V0T25lTW92aWVSYXRpbmciLCJnZXRNdWx0aXBsZU1vdmllUmF0aW5ncyIsImZvdW5kTW92aWUiLCJnZXRSZWNlbnRSZWxlYXNlIiwicGFyYW1zIiwiYXBpX2tleSIsInByaW1hcnlfcmVsZWFzZV95ZWFyIiwiRGF0ZSIsImdldEZ1bGxZZWFyIiwiaW5jbHVkZV9hZHVsdCIsInNvcnRfYnkiLCJ1cmwiLCJxcyIsIm9uIiwiY2h1bmsiLCJyZWNlbnRNb3ZpZXMiLCJKU09OIiwicGFyc2UiLCJyZXN1bHRzIiwic2VhcmNoUmF0ZWRNb3ZpZSIsIndoZXJlUmF3IiwiYW5kV2hlcmUiLCJtYXRjaGVzIiwiZ2V0RnJpZW5kTGlzdCIsImZyaWVuZHMiLCJmcmllbmRVc2VyIiwiYWRkRnJpZW5kIiwiY29uZmlybUZyaWVuZHNoaXAiLCJnZXRGcmllbmRzIiwicGVvcGxlSWQiLCJ1c2Vyc1JhdGluZ3MiLCJpbmRleE9mIiwia2V5SWQiLCJyZXNwbyIsInJlIiwicmFuZG9tIiwieiIsInZlcnlGaW5hbCIsImdldEhpZ2hDb21wYXRpYmlsaXR5VXNlcnMiLCJnZXRSZWNvbW1lbmRlZE1vdmllcyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQSxJQUFJQSxTQUFRLFNBQVJBLE1BQVEsQ0FBU0MsSUFBVCxFQUFjQyxJQUFkLEVBQW1CO0FBQy9CLE1BQUlDLE9BQUtDLEtBQUtDLEdBQUwsQ0FBU0osT0FBS0MsSUFBZCxDQUFUO0FBQ0EsU0FBTyxJQUFFQyxJQUFUO0FBQ0MsQ0FIRDs7QUFLQSxJQUFJRyxPQUFPLFNBQVBBLElBQU8sQ0FBU0MsS0FBVCxFQUFnQkMsTUFBaEIsRUFBd0I7QUFDbkMsTUFBSUMsUUFBTyxFQUFYO0FBQ0UsT0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUdILE1BQU1JLE1BQXpC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RCxLQTVERDtBQTZERCxHQWpFRDtBQWtFRCxDQXJFRDs7QUF5RUE7QUFDQXJLLFFBQVFzSyx5QkFBUixHQUFvQyxVQUFTcEssR0FBVCxFQUFjQyxHQUFkLEVBQW1CLENBRXRELENBRkQ7O0FBS0E7QUFDQUgsUUFBUXVLLG9CQUFSLEdBQStCLFVBQVNySyxHQUFULEVBQWNDLEdBQWQsRUFBbUIsQ0FFakQsQ0FGRCIsImZpbGUiOiJyZXF1ZXN0LWhhbmRsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vL1RoZSBhbGdvcml0aG1cbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xudmFyIGhlbHBlcj0gZnVuY3Rpb24obnVtMSxudW0yKXtcbnZhciBkaWZmPU1hdGguYWJzKG51bTEtbnVtMik7XG5yZXR1cm4gNS1kaWZmO1xufVxuXG52YXIgY29tcCA9IGZ1bmN0aW9uKGZpcnN0LCBzZWNvbmQpIHtcbnZhciBmaW5hbD0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGk8IGZpcnN0Lmxlbmd0aDsgaSsrKSB7XG5cbiAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHNlY29uZC5sZW5ndGg7IHgrKykge1xuXG4gICAgICBpZiAoZmlyc3RbaV1bMF0gPT09IHNlY29uZFt4XVswXSkge1xuXG4gICAgZmluYWwucHVzaChoZWxwZXIoZmlyc3RbaV1bMV0sc2Vjb25kW3hdWzFdKSlcblxuICAgICAgfVxuICAgIH1cbiAgfVxudmFyIHN1bT0gZmluYWwucmVkdWNlKGZ1bmN0aW9uKGEsYil7cmV0dXJuIGErYn0sMCk7XG5yZXR1cm4gTWF0aC5yb3VuZCgyMCpzdW0vZmluYWwubGVuZ3RoKVxufVxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cblxuXG5cblxudmFyIGRiID0gcmVxdWlyZSgnLi4vYXBwL2RiQ29ubmVjdGlvbicpO1xudmFyIG15c3FsID0gcmVxdWlyZSgnbXlzcWwnKTtcbnZhciBleHByZXNzID0gcmVxdWlyZSgnZXhwcmVzcycpO1xudmFyIE1vdmllID0gcmVxdWlyZSgnLi4vYXBwL21vZGVscy9tb3ZpZScpO1xudmFyIFJhdGluZyA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvcmF0aW5nJyk7XG52YXIgUmVsYXRpb24gPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL3JlbGF0aW9uJyk7XG52YXIgVXNlciA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvdXNlcicpO1xudmFyIGFsbFJlcXVlc3QgPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL2FsbFJlcXVlc3QnKTtcblxudmFyIE1vdmllcyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy9tb3ZpZXMnKTtcbnZhciBSYXRpbmdzID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL3JhdGluZ3MnKTtcbnZhciBSZWxhdGlvbnMgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvcmVsYXRpb25zJyk7XG52YXIgVXNlcnMgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvdXNlcnMnKTtcbnZhciBhbGxSZXF1ZXN0cyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy9hbGxSZXF1ZXN0cycpO1xuXG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoXCJibHVlYmlyZFwiKTtcbnZhciByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdCcpO1xuXG4vLyB2YXIgY29uID0gbXlzcWwuY3JlYXRlQ29ubmVjdGlvbih7XG4vLyAgIGhvc3Q6IFwibG9jYWxob3N0XCIsXG4vLyAgIHVzZXI6IFwicm9vdFwiLFxuLy8gICBwYXNzd29yZDogXCIxMjM0NVwiLFxuLy8gICBkYXRhYmFzZTogXCJNYWluRGF0YWJhc2VcIlxuLy8gfSk7XG5cbnZhciBjb24gPSBteXNxbC5jcmVhdGVDb25uZWN0aW9uKHtcbiAgICBob3N0ICAgICA6ICcxMjcuMC4wLjEnLFxuICAgIHVzZXIgICAgIDogJ3Jvb3QnLFxuICAgIHBhc3N3b3JkIDogJzEyMzQ1JyxcbiAgICBkYXRhYmFzZSA6ICdNYWluRGF0YWJhc2UnLFxufSk7XG5cbmNvbi5jb25uZWN0KGZ1bmN0aW9uKGVycil7XG4gIGlmKGVycil7XG4gICAgY29uc29sZS5sb2coJ0Vycm9yIGNvbm5lY3RpbmcgdG8gRGInKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc29sZS5sb2coJ0Nvbm5lY3Rpb24gZXN0YWJsaXNoZWQnKTtcbn0pO1xuXG4vLy8vLy8vLy8vLy8vLy8vL1xuLy8vL3VzZXIgYXV0aFxuLy8vLy8vLy8vLy8vLy8vLy9cblxuZXhwb3J0cy5zaWdudXBVc2VyID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcblx0Y29uc29sZS5sb2coJ2NhbGxpbmcgbG9naW4nLCByZXEuYm9keSk7XG5cdC8vIGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBzZXNzaW9uJyxyZXEuc2Vzc2lvbilcbiAgbmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLmJvZHkubmFtZSB9KS5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oZm91bmQpIHtcblx0ICBpZiAoZm91bmQpIHtcblx0ICBcdC8vY2hlY2sgcGFzc3dvcmRcblx0ICBcdCAgIC8vaWYgKHBhc3N3b3JkIG1hdGNoZXMpXG5cdCAgXHQgICAvL3sgYWRkIHNlc3Npb25zIGFuZCByZWRpcmVjdH1cblx0ICBcdGNvbnNvbGUubG9nKCd1c2VybmFtZSBhbHJlYWR5IGV4aXN0LCBjYW5ub3Qgc2lnbnVwICcsIHJlcS5ib2R5Lm5hbWUpO1xuXHQgICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoJ3VzZXJuYW1lIGV4aXN0Jyk7XG5cdCAgfSBlbHNlIHtcblx0ICBcdGNvbnNvbGUubG9nKCdjcmVhdGluZyB1c2VyJyk7XG4gICAgICByZXEubXlTZXNzaW9uLnVzZXIgPSByZXEuYm9keS5uYW1lO1xuXHQgICAgVXNlcnMuY3JlYXRlKHtcblx0ICAgICAgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUsXG5cdCAgICAgIHBhc3N3b3JkOiByZXEuYm9keS5wYXNzd29yZCxcblx0ICAgIH0pXG5cdCAgICAudGhlbihmdW5jdGlvbih1c2VyKSB7XG5cdFx0ICBcdGNvbnNvbGUubG9nKCdjcmVhdGVkIGEgbmV3IHVzZXInKTtcblx0ICAgICAgcmVzLnN0YXR1cygyMDEpLnNlbmQoJ2xvZ2luIGNyZWF0ZWQnKTtcblx0ICAgIH0pO1xuXHQgIH1cblx0fSk7XG59O1xuXG5cbmV4cG9ydHMuc2VuZFdhdGNoUmVxdWVzdCA9IGZ1bmN0aW9uKHJlcSwgcmVzcG9uc2UpIHtcblx0Y29uc29sZS5sb2cocmVxLmJvZHkucmVxdWVzdGVlKVxuXHRpZiAoQXJyYXkuaXNBcnJheShyZXEuYm9keS5yZXF1ZXN0ZWUpKSB7XG5cdFx0dmFyIHJlcXVlc3RlZXMgPSByZXEuYm9keS5yZXF1ZXN0ZWU7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIHJlcXVlc3RlZXMgPSBbcmVxLmJvZHkucmVxdWVzdGVlXTtcblx0fVxuXHRQcm9taXNlLmVhY2gocmVxdWVzdGVlcywgZnVuY3Rpb24ocmVxdWVzdGVlKXtcblx0XHR2YXIgcmVxdWVzdCA9IHtcbiAgICAgIG1lc3NhZ2U6IHJlcS5ib2R5Lm1lc3NhZ2UsXG5cdFx0XHRyZXF1ZXN0b3I6IHJlcS5teVNlc3Npb24udXNlciwgXG5cdFx0XHRyZXF1ZXN0VHlwOid3YXRjaCcsXG5cdFx0XHRtb3ZpZTpyZXEuYm9keS5tb3ZpZSxcblx0XHRcdHJlcXVlc3RlZTogcmVxdWVzdGVlXG5cdFx0fTtcblx0XHRjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIGFsbHJlcXVlc3RzIFNFVCA/JywgcmVxdWVzdCwgZnVuY3Rpb24oZXJyLHJlcyl7XG5cdFx0ICBpZihlcnIpIHRocm93IGVycjtcblx0XHQgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xuXHRcdH0pO1xuXHR9KVxuXHQudGhlbihmdW5jdGlvbihkb25lKXtcblx0XHRyZXNwb25zZS5zZW5kKCdUaGF0cyBteSBzdHlsZSEnKTtcblx0fSlcbn1cblxuZXhwb3J0cy5yZW1vdmVXYXRjaFJlcXVlc3QgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICBpZiAoQXJyYXkuaXNBcnJheShyZXEuYm9keS5yZXF1ZXN0ZWUpKSB7XG4gICAgdmFyIHJlcXVlc3RlZXMgPSByZXEuYm9keS5yZXF1ZXN0ZWU7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHJlcXVlc3RlZXMgPSBbcmVxLmJvZHkucmVxdWVzdGVlXTtcbiAgfVxuICB2YXIgcmVxdWVzdG9yPXJlcS5ib2R5LnJlcXVlc3RvcjtcbiAgdmFyIG1vdmllID0gcmVxLmJvZHkubW92aWU7XG5cbiAgYWxsUmVxdWVzdC5mb3JnZSh7cmVxdWVzdG9yOiByZXF1ZXN0b3IsIHJlcXVlc3RlZTogcmVxdWVzdGVlcywgbW92aWU6IG1vdmllIH0pXG4gICAgLmZldGNoKCkudGhlbihmdW5jdGlvbihhbGxSZXF1ZXN0KSB7XG4gICAgICBhbGxSZXF1ZXN0LmRlc3Ryb3koKVxuICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXMuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiAnVXNlciBzdWNjZXNzZnVsbHkgZGVsZXRlZCd9fSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcbiAgICAgICAgfSk7XG4gICAgfSlcbiAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcbiAgICB9KTtcbn07XG5cblxuZXhwb3J0cy5zZW5kUmVxdWVzdCA9IGZ1bmN0aW9uKHJlcSwgcmVzcG9uc2UpIHtcbiAgY29uc29sZS5sb2coJ3RoaXMgaXMgd2hhdCBJbSBnZXR0aW5nJywgcmVxLmJvZHkpO1xuICBpZiAocmVxLm15U2Vzc2lvbi51c2VyPT09cmVxLmJvZHkubmFtZSl7XG4gICAgcmVzcG9uc2Uuc2VuZChcIllvdSBjYW4ndCBmcmllbmQgeW91cnNlbGYhXCIpXG4gIH0gZWxzZSB7XG5cbnZhciByZXF1ZXN0ID0ge3JlcXVlc3RvcjogcmVxLm15U2Vzc2lvbi51c2VyLCByZXF1ZXN0ZWU6IHJlcS5ib2R5Lm5hbWUsIHJlcXVlc3RUeXA6J2ZyaWVuZCd9O1xuXG5jb24ucXVlcnkoJ1NFTEVDVCByZXF1ZXN0ZWUscmVzcG9uc2UgRlJPTSBhbGxyZXF1ZXN0cyBXSEVSRSAgcmVxdWVzdG9yID0gPyBBTkQgcmVxdWVzdFR5cCA9JysnXCInKyAnZnJpZW5kJysnXCInLCByZXF1ZXN0WydyZXF1ZXN0b3InXSwgZnVuY3Rpb24oZXJyLHJlcyl7XG5pZiAocmVzID09PSB1bmRlZmluZWQpIHtcbiAgcmVzcG9uc2Uuc2VuZCgnbm8gZnJpZW5kcycpXG59XG52YXIgdGVzdD1yZXMuZmlsdGVyKGZ1bmN0aW9uKGEpe3JldHVybiBhLnJlc3BvbnNlPT09bnVsbH0pXG52YXIgdGVzdDI9dGVzdC5tYXAoZnVuY3Rpb24oYSl7IHJldHVybiBhLnJlcXVlc3RlZX0pXG5jb25zb2xlLmxvZygnbmFtZXMgb2YgcGVvcGxlIHdob20gSXZlIHJlcXVlc3RlZCBhcyBmcmllbmRzJyx0ZXN0KTtcblxuXG5cbmNvbi5xdWVyeSgnSU5TRVJUIElOVE8gYWxscmVxdWVzdHMgU0VUID8nLCByZXF1ZXN0LCBmdW5jdGlvbihlcnIscmVzcCl7XG4gIGlmKGVycikgdGhyb3cgZXJyO1xuICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzcC5pbnNlcnRJZCk7XG4gIHJlc3BvbnNlLnNlbmQodGVzdDIpO1xufSlcbn0pO1xuXG4gfVxufTtcblxuXG5cblxuXG5cblxuXG5cbmV4cG9ydHMubGlzdFJlcXVlc3RzID0gZnVuY3Rpb24ocmVxLCByZXNwb25zZSkge1xuICB2YXIgcmVxdWVzdCA9IHJlcS5teVNlc3Npb24udXNlclxuXG4gIGNvbi5xdWVyeSgnU2VsZWN0ICogRlJPTSBhbGxyZXF1ZXN0cyBXSEVSRSByZXF1ZXN0ZWU9JysnXCInK3JlcXVlc3QrJ1wiJysnJysnT1IgcmVxdWVzdG9yID0nKydcIicrcmVxdWVzdCsnXCInKycnLCBmdW5jdGlvbihlcnIscmVzKXtcbiAgaWYoZXJyKSB0aHJvdyBlcnI7XG4gIGNvbnNvbGUubG9nKHJlcylcbiAgcmVzcG9uc2Uuc2VuZChbcmVzLHJlcXVlc3RdKTtcbn0pO1xuXG5cbn07XG5cbmV4cG9ydHMuYWNjZXB0ID0gZnVuY3Rpb24ocmVxLCByZXNwb25zZSkge1xuICB2YXIgcmVxdWVzdG9yPXJlcS5ib2R5LnBlcnNvblRvQWNjZXB0O1xuICB2YXIgcmVxdWVzdGVlPXJlcS5teVNlc3Npb24udXNlcjtcbiAgdmFyIG1vdmllID0gcmVxLmJvZHkubW92aWU7XG4gIHZhciByZXF1ZXN0VHlwZSA9IFwiZnJpZW5kXCI7XG5cbiAgaWYgKG1vdmllID09PSAnJykge1xuICAgIGNvbi5xdWVyeSgnVVBEQVRFIGFsbHJlcXVlc3RzIFNFVCByZXNwb25zZT0nKydcIicgKyAneWVzJyArICdcIicrJyAgV0hFUkUgcmVxdWVzdG9yID0gJysnXCInKyByZXF1ZXN0b3IrJ1wiJysnIEFORCByZXF1ZXN0VHlwPScrJ1wiJytyZXF1ZXN0VHlwZSsnXCInLCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcbiAgICB9KTtcblxuICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIHJlcS5ib2R5LnBlcnNvblRvQWNjZXB0LCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzWzBdLmlkLCBlcnIpO1xuICAgIHZhciBwZXJzb24xID0gcmVzWzBdLmlkO1xuICAgIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgcmVxLm15U2Vzc2lvbi51c2VyLCBmdW5jdGlvbihlcnIsIHJlc3ApIHtcbiAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXNwWzBdLmlkLCBlcnIpO1xuXG4gICAgICB2YXIgcGVyc29uMiA9IHJlc3BbMF0uaWQ7XG4gICAgICB2YXIgcmVxdWVzdCA9IHtcbiAgICAgICAgdXNlcjFpZDogcGVyc29uMSxcbiAgICAgICAgdXNlcjJpZDogcGVyc29uMlxuICAgICAgfVxuICAgICAgdmFyIHJlcXVlc3QyID0ge1xuICAgICAgICB1c2VyMWlkOiBwZXJzb24yLFxuICAgICAgICB1c2VyMmlkOiBwZXJzb24xXG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUubG9nKCd0aGUgcmVxdWVzdHM6OjonLHJlcXVlc3QscmVxdWVzdDIpXG4gICAgICBjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIHJlbGF0aW9ucyBTRVQgPycsIHJlcXVlc3QsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XG5cbiAgICAgIGNvbi5xdWVyeSgnSU5TRVJUIElOVE8gcmVsYXRpb25zIFNFVCA/JywgcmVxdWVzdDIsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcblxuICAgICAgICAgICByZXNwb25zZS5zZW5kKCdUaGF0cyBteSBzdHlsZSEhIScpO1xuICAgICAgICB9KVxuICAgICAgfSk7XG4gICAgfSlcbiAgfSlcbiAgfSBlbHNlIHtcbiAgY29uc29sZS5sb2coJ3RoaXMgaXMgcmVxIGJvZHkgJyxyZXEuYm9keSk7XG5cbiAgY29uLnF1ZXJ5KCdVUERBVEUgYWxscmVxdWVzdHMgU0VUIHJlc3BvbnNlPScrJ1wiJyArICd5ZXMnICsgJ1wiJysnICBXSEVSRSByZXF1ZXN0b3IgPSAnKydcIicrIHJlcXVlc3RvcisnXCInKycgQU5EIG1vdmllPScrJ1wiJysgbW92aWUrJ1wiJywgZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcbiAgfSk7XG5cbiAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCByZXEuYm9keS5wZXJzb25Ub0FjY2VwdCwgZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlc1swXS5pZCwgZXJyKTtcbiAgICB2YXIgcGVyc29uMSA9IHJlc1swXS5pZDtcbiAgICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIHJlcS5teVNlc3Npb24udXNlciwgZnVuY3Rpb24oZXJyLCByZXNwKSB7XG4gICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzcFswXS5pZCwgZXJyKTtcblxuICAgICAgdmFyIHBlcnNvbjIgPSByZXNwWzBdLmlkO1xuICAgICAgdmFyIHJlcXVlc3QgPSB7XG4gICAgICAgIHVzZXIxaWQ6IHBlcnNvbjEsXG4gICAgICAgIHVzZXIyaWQ6IHBlcnNvbjJcbiAgICAgIH1cbiAgICAgIHZhciByZXF1ZXN0MiA9IHtcbiAgICAgICAgdXNlcjFpZDogcGVyc29uMixcbiAgICAgICAgdXNlcjJpZDogcGVyc29uMVxuICAgICAgfVxuXG4gICAgICBjb25zb2xlLmxvZygndGhlIHJlcXVlc3RzOjo6JyxyZXF1ZXN0LHJlcXVlc3QyKVxuICAgICAgY29uLnF1ZXJ5KCdJTlNFUlQgSU5UTyByZWxhdGlvbnMgU0VUID8nLCByZXF1ZXN0LCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xuXG4gICAgICBjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIHJlbGF0aW9ucyBTRVQgPycsIHJlcXVlc3QyLCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XG5cbiAgICAgICAgICAgcmVzcG9uc2Uuc2VuZCgnVGhhdHMgbXkgc3R5bGUhISEnKTtcbiAgICAgICAgfSlcbiAgICAgIH0pO1xuICAgIH0pXG4gIH0pXG59XG4gIC8vIGFsbFJlcXVlc3QuZm9yZ2Uoe3JlcXVlc3RvcjogcmVxdWVzdG9yLCByZXF1ZXN0ZWU6IHJlcXVlc3RlZX0pXG4gIC8vICAgLmZldGNoKCkudGhlbihmdW5jdGlvbihhbGxSZXF1ZXN0KSB7XG4gIC8vICAgICBhbGxSZXF1ZXN0LmRlc3Ryb3koKVxuICAvLyAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgLy8gICAgICAgICByZXNwb25zZS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6ICdVc2VyIHN1Y2Nlc3NmdWxseSBkZWxldGVkJ319KTtcbiAgLy8gICAgICAgfSlcbiAgLy8gICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAvLyAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XG4gIC8vICAgICAgIH0pO1xuICAvLyAgIH0pXG4gIC8vICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAvLyAgICAgcmVzcG9uc2Uuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcbiAgLy8gICB9KTtcbn07XG5cbmV4cG9ydHMucmVtb3ZlUmVxdWVzdCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIHZhciByZXF1ZXN0b3I9cmVxLmJvZHkucmVxdWVzdG9yO1xuICB2YXIgcmVxdWVzdGVlPXJlcS5ib2R5LnJlcXVlc3RlZTtcblxuICBhbGxSZXF1ZXN0LmZvcmdlKHtyZXF1ZXN0b3I6IHJlcXVlc3RvciwgcmVxdWVzdGVlOiByZXF1ZXN0ZWV9KVxuICAgIC5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oYWxsUmVxdWVzdCkge1xuICAgICAgYWxsUmVxdWVzdC5kZXN0cm95KClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmVzLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogJ1VzZXIgc3VjY2Vzc2Z1bGx5IGRlbGV0ZWQnfX0pO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogcmVxLmJvZHl9fSk7XG4gICAgICAgIH0pO1xuICAgIH0pXG4gICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogcmVxLmJvZHl9fSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydHMuZ2V0VGhpc0ZyaWVuZHNNb3ZpZXM9ZnVuY3Rpb24ocmVxLHJlc3BvbnNlKXtcblxuICB2YXIgbW92aWVzPVtdO1xuICBjb25zb2xlLmxvZyhyZXEuYm9keS5zcGVjaWZpY0ZyaWVuZCk7XG4gIHZhciBwZXJzb249cmVxLmJvZHkuc3BlY2lmaWNGcmllbmRcbiAgdmFyIGlkPW51bGxcbiAgdmFyIGxlbj1udWxsO1xuICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIHBlcnNvbiwgZnVuY3Rpb24oZXJyLCByZXNwKXtcbmNvbnNvbGUubG9nKHJlc3ApXG5pZD1yZXNwWzBdLmlkO1xuXG5cbmNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByYXRpbmdzIFdIRVJFIHVzZXJpZCA9ID8nLCBpZCAsZnVuY3Rpb24oZXJyLHJlc3Ape1xuY29uc29sZS5sb2coJ2VycnJycnJycnInLGVycixyZXNwLmxlbmd0aClcbmxlbj1yZXNwLmxlbmd0aDtcbnJlc3AuZm9yRWFjaChmdW5jdGlvbihhKXtcblxuY29uLnF1ZXJ5KCdTRUxFQ1QgdGl0bGUgRlJPTSBtb3ZpZXMgV0hFUkUgaWQgPSA/JywgYS5tb3ZpZWlkICxmdW5jdGlvbihlcnIscmVzcCl7XG4gIGNvbnNvbGUubG9nKHJlc3ApXG5tb3ZpZXMucHVzaChbcmVzcFswXS50aXRsZSxhLnNjb3JlLGEucmV2aWV3XSlcbmNvbnNvbGUubG9nKG1vdmllcylcbmlmIChtb3ZpZXMubGVuZ3RoPT09bGVuKXtcbiAgcmVzcG9uc2Uuc2VuZChtb3ZpZXMpO1xufVxufSlcblxufSlcblxufSlcblxuXG4gIH1cblxuKX1cblxuZXhwb3J0cy5maW5kTW92aWVCdWRkaWVzPWZ1bmN0aW9uKHJlcSxyZXNwb25zZSl7XG4gIGNvbnNvbGUubG9nKFwieW91J3JlIHRyeWluZyB0byBmaW5kIGJ1ZGRpZXMhIVwiKTtcbmNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSB1c2VycycsZnVuY3Rpb24oZXJyLHJlc3Ape1xuICB2YXIgcGVvcGxlPXJlc3AubWFwKGZ1bmN0aW9uKGEpe3JldHVybiBhLnVzZXJuYW1lfSlcbiAgdmFyIElkcz0gcmVzcC5tYXAoZnVuY3Rpb24oYSl7cmV0dXJuIGEuaWR9KVxuICB2YXIgaWRLZXlPYmo9e31cbmZvciAodmFyIGk9MDtpPElkcy5sZW5ndGg7aSsrKXtcbiAgaWRLZXlPYmpbSWRzW2ldXT1wZW9wbGVbaV1cbn1cbmNvbnNvbGUubG9nKCdjdXJyZW50IHVzZXInLHJlcS5teVNlc3Npb24udXNlcik7XG52YXIgY3VycmVudFVzZXI9cmVxLm15U2Vzc2lvbi51c2VyXG5cblxuIHZhciBvYmoxPXt9O1xuICBmb3IgKHZhciBpPTA7aTxJZHMubGVuZ3RoO2krKyl7XG5vYmoxW2lkS2V5T2JqW0lkc1tpXV1dPVtdO1xuICB9XG5cbiAgY29uLnF1ZXJ5KCdTRUxFQ1Qgc2NvcmUsbW92aWVpZCx1c2VyaWQgRlJPTSByYXRpbmdzJyxmdW5jdGlvbihlcnIscmVzcG9uKXtcbiAgXG5mb3IgKHZhciBpPTA7aTxyZXNwb24ubGVuZ3RoO2krKyl7XG4gIG9iajFbaWRLZXlPYmpbcmVzcG9uW2ldLnVzZXJpZF1dLnB1c2goW3Jlc3BvbltpXS5tb3ZpZWlkLHJlc3BvbltpXS5zY29yZV0pXG59XG5cbmNvbnNvbGUubG9nKCdvYmoxJyxvYmoxKTtcbmN1cnJlbnRVc2VySW5mbz1vYmoxW2N1cnJlbnRVc2VyXVxuLy9jb25zb2xlLmxvZygnY3VycmVudFVzZXJJbmZvJyxjdXJyZW50VXNlckluZm8pXG52YXIgY29tcGFyaXNvbnM9e31cblxuZm9yICh2YXIga2V5IGluIG9iajEpe1xuICBpZiAoa2V5IT09Y3VycmVudFVzZXIpIHtcbiAgICBjb21wYXJpc29uc1trZXldPWNvbXAoY3VycmVudFVzZXJJbmZvLG9iajFba2V5XSlcbiAgfVxufVxuY29uc29sZS5sb2coY29tcGFyaXNvbnMpXG52YXIgZmluYWxTZW5kPVtdXG5mb3IgKHZhciBrZXkgaW4gY29tcGFyaXNvbnMpe1xuICBpZiAoY29tcGFyaXNvbnNba2V5XSAhPT0gJ05hTiUnKSB7XG4gIGZpbmFsU2VuZC5wdXNoKFtrZXksY29tcGFyaXNvbnNba2V5XV0pO1xufSBlbHNlICB7XG4gIGZpbmFsU2VuZC5wdXNoKFtrZXksXCJObyBDb21wYXJpc29uIHRvIE1ha2VcIl0pXG59XG5cbn1cblxuICByZXNwb25zZS5zZW5kKGZpbmFsU2VuZClcbn0pXG59KVxufVxuXG5cbmV4cG9ydHMuZGVjbGluZT1mdW5jdGlvbihyZXEscmVzcG9uc2Upe1xuICB2YXIgcmVxdWVzdG9yPXJlcS5ib2R5LnBlcnNvblRvRGVjbGluZTtcbiAgdmFyIHJlcXVlc3RlZT1yZXEubXlTZXNzaW9uLnVzZXI7XG4gIHZhciBtb3ZpZT1yZXEuYm9keS5tb3ZpZTtcbiAgdmFyIHJlcXVlc3RUeXBlID0gJ2ZyaWVuZCc7XG5cbiAgaWYgKG1vdmllID09PSAnJykge1xuICAgIGNvbi5xdWVyeSgnVVBEQVRFIGFsbHJlcXVlc3RzIFNFVCByZXNwb25zZT0nKydcIicgKyAnbm8nICsgJ1wiJysgJyBXSEVSRSByZXF1ZXN0b3IgPSAnKydcIicrIHJlcXVlc3RvcisnXCInKycgQU5EIHJlcXVlc3RUeXA9JysnXCInKyByZXF1ZXN0VHlwZSsnXCInLCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XG4gICAgICByZXNwb25zZS5zZW5kKHJlcXVlc3RvciArICdkZWxldGVkJyk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY29uLnF1ZXJ5KCdVUERBVEUgYWxscmVxdWVzdHMgU0VUIHJlc3BvbnNlPScrJ1wiJyArICdubycgKyAnXCInKyAnIFdIRVJFIHJlcXVlc3RvciA9ICcrJ1wiJysgcmVxdWVzdG9yKydcIicrJyBBTkQgcmVxdWVzdGVlPScrJ1wiJysgcmVxdWVzdGVlKydcIicrJyBBTkQgbW92aWUgPScrJ1wiJyttb3ZpZSsnXCInLCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XG4gICAgICByZXNwb25zZS5zZW5kKHJlcXVlc3RvciArICdkZWxldGVkJyk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBhbGxSZXF1ZXN0LmZvcmdlKHtyZXF1ZXN0b3I6IHJlcXVlc3RvciwgcmVxdWVzdGVlOiByZXF1ZXN0ZWV9KVxuICAvLyAgIC5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oYWxsUmVxdWVzdCkge1xuICAvLyAgICAgYWxsUmVxdWVzdC5kZXN0cm95KClcbiAgLy8gICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gIC8vICAgICAgICAgcmVzcG9uc2UuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiAnVXNlciBzdWNjZXNzZnVsbHkgZGVsZXRlZCd9fSk7XG4gIC8vICAgICAgIH0pXG4gIC8vICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgLy8gICAgICAgICByZXNwb25zZS5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xuICAvLyAgICAgICB9KTtcbiAgLy8gICB9KVxuICAvLyAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgLy8gICAgIHJlc3BvbnNlLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XG4gIC8vICAgfSk7XG59O1xuXG5leHBvcnRzLnNpZ251cFVzZXIgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICBjb25zb2xlLmxvZygnY2FsbGluZyBsb2dpbicsIHJlcS5ib2R5KTtcbiAgLy8gY29uc29sZS5sb2coJ3RoaXMgaXMgdGhlIHNlc3Npb24nLHJlcS5zZXNzaW9uKVxuICBuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEuYm9keS5uYW1lIH0pLmZldGNoKCkudGhlbihmdW5jdGlvbihmb3VuZCkge1xuICAgIGlmIChmb3VuZCkge1xuICAgICAgLy9jaGVjayBwYXNzd29yZFxuICAgICAgICAgLy9pZiAocGFzc3dvcmQgbWF0Y2hlcylcbiAgICAgICAgIC8veyBhZGQgc2Vzc2lvbnMgYW5kIHJlZGlyZWN0fVxuICAgICAgY29uc29sZS5sb2coJ3VzZXJuYW1lIGFscmVhZHkgZXhpc3QsIGNhbm5vdCBzaWdudXAgJywgcmVxLmJvZHkubmFtZSk7XG4gICAgICByZXMuc3RhdHVzKDQwMykuc2VuZCgndXNlcm5hbWUgZXhpc3QnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ2NyZWF0aW5nIHVzZXInKTtcbiAgICAgIHJlcS5teVNlc3Npb24udXNlciA9IHJlcS5ib2R5Lm5hbWU7XG4gICAgICBVc2Vycy5jcmVhdGUoe1xuICAgICAgICB1c2VybmFtZTogcmVxLmJvZHkubmFtZSxcbiAgICAgICAgcGFzc3dvcmQ6IHJlcS5ib2R5LnBhc3N3b3JkLFxuICAgICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHVzZXIpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2NyZWF0ZWQgYSBuZXcgdXNlcicpO1xuICAgICAgICByZXMuc3RhdHVzKDIwMSkuc2VuZCgnbG9naW4gY3JlYXRlZCcpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn07XG5cbmV4cG9ydHMuc2lnbmluVXNlciA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cdGNvbnNvbGUubG9nKCdjYWxsaW5nIHNpZ25pbicsIHJlcS5ib2R5KTtcblx0bmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLmJvZHkubmFtZSB9KS5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oZm91bmQpe1xuXG5cdFx0aWYgKGZvdW5kKXtcblx0XHRcdG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUsIHBhc3N3b3JkOnJlcS5ib2R5LnBhc3N3b3JkfSkuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGZvdW5kKXtcblx0XHRcdFx0aWYgKGZvdW5kKXtcblx0XHRcdFx0XHRyZXEubXlTZXNzaW9uLnVzZXIgPSBmb3VuZC5hdHRyaWJ1dGVzLnVzZXJuYW1lO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGZvdW5kLmF0dHJpYnV0ZXMudXNlcm5hbWUpXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ3dlIGZvdW5kIHlvdSEhJylcblx0XHRcdFx0XHRyZXMuc2VuZChbJ2l0IHdvcmtlZCcscmVxLm15U2Vzc2lvbi51c2VyXSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmVzLnN0YXR1cyg0MDQpLnNlbmQoJ2JhZCBsb2dpbicpO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCd3cm9uZyBwYXNzd29yZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXMuc3RhdHVzKDQwNCkuc2VuZCgnYmFkIGxvZ2luJyk7XG5cdFx0XHRjb25zb2xlLmxvZygndXNlciBub3QgZm91bmQnKTtcblx0XHR9XG5cbiAgfSkgXG5cbn1cblxuZXhwb3J0cy5sb2dvdXQgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXHRyZXEubXlTZXNzaW9uLmRlc3Ryb3koZnVuY3Rpb24oZXJyKXtcblx0XHRjb25zb2xlLmxvZyhlcnIpO1xuXHR9KTtcblx0Y29uc29sZS5sb2coJ2xvZ291dCcpO1xuXHRyZXMuc2VuZCgnbG9nb3V0Jyk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vL21vdmllIGhhbmRsZXJzXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuLy9hIGhhbmRlbGVyIHRoYXQgdGFrZXMgYSByYXRpbmcgZnJvbSB1c2VyIGFuZCBhZGQgaXQgdG8gdGhlIGRhdGFiYXNlXG4vLyBleHBlY3RzIHJlcS5ib2R5IHRvIGhhdmUgdGhpczoge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnLCBwb3N0ZXI6ICdsaW5rJywgcmVsZWFzZV9kYXRlOiAneWVhcicsIHJhdGluZzogJ251bWJlcid9XG5leHBvcnRzLnJhdGVNb3ZpZSA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cdGNvbnNvbGUubG9nKCdjYWxsaW5nIHJhdGVNb3ZpZScpO1xuXHR2YXIgdXNlcmlkO1xuXHRyZXR1cm4gbmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLm15U2Vzc2lvbi51c2VyIH0pLmZldGNoKClcblx0LnRoZW4oZnVuY3Rpb24oZm91bmRVc2VyKSB7XG5cdFx0dXNlcmlkID0gZm91bmRVc2VyLmF0dHJpYnV0ZXMuaWQ7XG5cdFx0cmV0dXJuIG5ldyBSYXRpbmcoeyBtb3ZpZWlkOiByZXEuYm9keS5pZCwgdXNlcmlkOiB1c2VyaWQgfSkuZmV0Y2goKVxuXHRcdC50aGVuKGZ1bmN0aW9uKGZvdW5kUmF0aW5nKSB7XG5cdFx0XHRpZiAoZm91bmRSYXRpbmcpIHtcblx0XHRcdFx0Ly9zaW5jZSByYXRpbmcgb3IgcmV2aWV3IGlzIHVwZGF0ZWQgc2VwZXJhdGx5IGluIGNsaWVudCwgdGhlIGZvbGxvd2luZ1xuXHRcdFx0XHQvL21ha2Ugc3VyZSBpdCBnZXRzIHVwZGF0ZWQgYWNjb3JkaW5nIHRvIHRoZSByZXFcblx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ3VwZGF0ZSByYXRpbmcnLCBmb3VuZFJhdGluZylcblx0XHRcdFx0aWYgKHJlcS5ib2R5LnJhdGluZykge1xuXHRcdFx0XHRcdHZhciByYXRpbmdPYmogPSB7c2NvcmU6IHJlcS5ib2R5LnJhdGluZ307XG5cdFx0XHRcdH0gZWxzZSBpZiAocmVxLmJvZHkucmV2aWV3KSB7XG5cdFx0XHRcdFx0dmFyIHJhdGluZ09iaiA9IHtyZXZpZXc6IHJlcS5ib2R5LnJldmlld307XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIG5ldyBSYXRpbmcoeydpZCc6IGZvdW5kUmF0aW5nLmF0dHJpYnV0ZXMuaWR9KVxuXHRcdFx0XHRcdC5zYXZlKHJhdGluZ09iaik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnY3JlYXRpbmcgcmF0aW5nJyk7XG5cdFx0ICAgIHJldHVybiBSYXRpbmdzLmNyZWF0ZSh7XG5cdFx0ICAgIFx0c2NvcmU6IHJlcS5ib2R5LnJhdGluZyxcblx0XHQgICAgICB1c2VyaWQ6IHVzZXJpZCxcblx0XHQgICAgICBtb3ZpZWlkOiByZXEuYm9keS5pZCxcblx0XHQgICAgICByZXZpZXc6IHJlcS5ib2R5LnJldmlld1xuXHRcdCAgICB9KTtcdFx0XHRcdFx0XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pXG5cdC50aGVuKGZ1bmN0aW9uKG5ld1JhdGluZykge1xuXHRcdGNvbnNvbGUubG9nKCdyYXRpbmcgY3JlYXRlZDonLCBuZXdSYXRpbmcuYXR0cmlidXRlcyk7XG4gIFx0cmVzLnN0YXR1cygyMDEpLnNlbmQoJ3JhdGluZyByZWNpZXZlZCcpO1xuXHR9KVxuICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgcmVzLnN0YXR1cyg1MDApLnNlbmQoJ2Vycm9yJyk7XG4gIH0pXG59O1xuXG4vL3RoaXMgaGVscGVyIGZ1bmN0aW9uIGFkZHMgdGhlIG1vdmllIGludG8gZGF0YWJhc2Vcbi8vaXQgZm9sbG93cyB0aGUgc2FtZSBtb3ZpZSBpZCBhcyBUTURCXG4vL2V4cGVjdHMgcmVxLmJvZHkgdG8gaGF2ZSB0aGVzZSBhdHJpYnV0ZSA6IHtpZCwgdGl0bGUsIGdlbnJlLCBwb3N0ZXJfcGF0aCwgcmVsZWFzZV9kYXRlLCBvdmVydmlldywgdm90ZV9hdmVyYWdlfVxudmFyIGFkZE9uZU1vdmllID0gZnVuY3Rpb24obW92aWVPYmopIHtcblx0dmFyIGdlbnJlID0gKG1vdmllT2JqLmdlbnJlX2lkcykgPyBnZW5yZXNbbW92aWVPYmouZ2VucmVfaWRzWzBdXSA6ICduL2EnO1xuICByZXR1cm4gbmV3IE1vdmllKHtcbiAgXHRpZDogbW92aWVPYmouaWQsXG4gICAgdGl0bGU6IG1vdmllT2JqLnRpdGxlLFxuICAgIGdlbnJlOiBnZW5yZSxcbiAgICBwb3N0ZXI6ICdodHRwczovL2ltYWdlLnRtZGIub3JnL3QvcC93MTg1LycgKyBtb3ZpZU9iai5wb3N0ZXJfcGF0aCxcbiAgICByZWxlYXNlX2RhdGU6IG1vdmllT2JqLnJlbGVhc2VfZGF0ZSxcbiAgICBkZXNjcmlwdGlvbjogbW92aWVPYmoub3ZlcnZpZXcuc2xpY2UoMCwgMjU1KSxcbiAgICBpbWRiUmF0aW5nOiBtb3ZpZU9iai52b3RlX2F2ZXJhZ2VcbiAgfSkuc2F2ZShudWxsLCB7bWV0aG9kOiAnaW5zZXJ0J30pXG4gIC50aGVuKGZ1bmN0aW9uKG5ld01vdmllKSB7XG4gIFx0Y29uc29sZS5sb2coJ21vdmllIGNyZWF0ZWQnLCBuZXdNb3ZpZS5hdHRyaWJ1dGVzLnRpdGxlKTtcbiAgXHRyZXR1cm4gbmV3TW92aWU7XG4gIH0pXG59O1xuXG5cbi8vZ2V0IGFsbCBtb3ZpZSByYXRpbmdzIHRoYXQgYSB1c2VyIHJhdGVkXG4vL3Nob3VsZCByZXR1cm4gYW4gYXJyYXkgdGhhdCBsb29rIGxpa2UgdGhlIGZvbGxvd2luZzpcbi8vIFsge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnICwgcG9zdGVyOiAndXJsJywgcmVsZWFzZV9kYXRlOiAnZGF0ZScsIHNjb3JlOiBuLCBmcmllbmRBdmVyYWdlUmF0aW5nOiBufSAuLi4gXVxuLy8gd2lsbCBnZXQgcmF0aW5ncyBmb3IgdGhlIGN1cnJlbnQgdXNlclxuZXhwb3J0cy5nZXRVc2VyUmF0aW5ncyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIFJhdGluZy5xdWVyeShmdW5jdGlvbihxYil7XG4gIFx0cWIuaW5uZXJKb2luKCd1c2VycycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3VzZXJzLmlkJyk7XG4gIFx0cWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XG4gIFx0cWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnLCAncmF0aW5ncy51cGRhdGVkX2F0Jyk7XG4gIFx0cWIud2hlcmUoJ3VzZXJzLnVzZXJuYW1lJywgJz0nLCByZXEubXlTZXNzaW9uLnVzZXIpO1xuICBcdHFiLm9yZGVyQnkoJ3VwZGF0ZWRfYXQnLCAnREVTQycpXG4gIH0pXG4gIC5mZXRjaEFsbCgpXG4gIC50aGVuKGZ1bmN0aW9uKHJhdGluZ3Mpe1xuXHRcdC8vZGVjb3JhdGUgaXQgd2l0aCBhdmcgZnJpZW5kIHJhdGluZ1xuXHRcdHJldHVybiBQcm9taXNlLm1hcChyYXRpbmdzLm1vZGVscywgZnVuY3Rpb24ocmF0aW5nKSB7XG5cdFx0XHRyZXR1cm4gYXR0YWNoRnJpZW5kQXZnUmF0aW5nKHJhdGluZywgcmVxLm15U2Vzc2lvbi51c2VyKTtcblx0XHR9KTtcblx0fSlcbiAgLnRoZW4oZnVuY3Rpb24ocmF0aW5ncykge1xuICBcdGNvbnNvbGUubG9nKCdyZXRyaXZpbmcgYWxsIHVzZXIgcmF0aW5ncycpO1xuICBcdHJlcy5zdGF0dXMoMjAwKS5qc29uKHJhdGluZ3MpO1xuICB9KVxufTtcblxuZXhwb3J0cy5nZXRGcmllbmRVc2VyUmF0aW5ncyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIFJhdGluZy5xdWVyeShmdW5jdGlvbihxYil7XG4gIFx0cWIuaW5uZXJKb2luKCd1c2VycycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3VzZXJzLmlkJyk7XG4gIFx0cWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XG4gIFx0cWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUgYXMgZnJpZW5kU2NvcmUnLCAncmF0aW5ncy5yZXZpZXcgYXMgZnJpZW5kUmV2aWV3JywgJ3JhdGluZ3MudXBkYXRlZF9hdCcpO1xuICBcdHFiLndoZXJlKCd1c2Vycy51c2VybmFtZScsICc9JywgcmVxLnF1ZXJ5LmZyaWVuZE5hbWUpO1xuICBcdHFiLm9yZGVyQnkoJ3VwZGF0ZWRfYXQnLCAnREVTQycpXG4gIH0pXG4gIC5mZXRjaEFsbCgpXG4gIC50aGVuKGZ1bmN0aW9uKHJhdGluZ3Mpe1xuXHRcdC8vZGVjb3JhdGUgaXQgd2l0aCBjdXJyZW50IHVzZXIncyByYXRpbmdcblx0XHRyZXR1cm4gUHJvbWlzZS5tYXAocmF0aW5ncy5tb2RlbHMsIGZ1bmN0aW9uKHJhdGluZykge1xuXHRcdFx0cmV0dXJuIGF0dGFjaFVzZXJSYXRpbmcocmF0aW5nLCByZXEubXlTZXNzaW9uLnVzZXIpO1xuXHRcdH0pO1xuXHR9KVxuICAudGhlbihmdW5jdGlvbihyYXRpbmdzKSB7XG4gIFx0Y29uc29sZS5sb2coJ3JldHJpdmluZyBhbGwgdXNlciByYXRpbmdzJyk7XG4gIFx0cmVzLnN0YXR1cygyMDApLmpzb24ocmF0aW5ncyk7XG4gIH0pXG59O1xuXG4vL2EgZGVjb3JhdG9yIGZ1bmN0aW9uIHRoYXQgYXR0YWNoZXMgZnJpZW5kIGF2ZyByYXRpbmcgdG8gdGhlIHJhdGluZyBvYmpcbnZhciBhdHRhY2hGcmllbmRBdmdSYXRpbmcgPSBmdW5jdGlvbihyYXRpbmcsIHVzZXJuYW1lKSB7XG5cdHJldHVybiBleHBvcnRzLmdldEZyaWVuZFJhdGluZ3ModXNlcm5hbWUsIHJhdGluZylcblx0LnRoZW4oZnVuY3Rpb24oZnJpZW5kc1JhdGluZ3Mpe1xuXHRcdC8vaWYgZnJpZW5kc1JhdGluZ3MgaXMgbnVsbCwgUmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyBpcyBudWxsXG5cdFx0aWYgKCFmcmllbmRzUmF0aW5ncykge1xuXHRcdFx0cmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyA9IG51bGw7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgPSBhdmVyYWdlUmF0aW5nKGZyaWVuZHNSYXRpbmdzKTtcblx0XHR9XG5cdFx0cmV0dXJuIHJhdGluZztcblx0fSlcbn1cblxuLy9hIGRlY29yYXRvciBmdW5jdGlvbiB0aGF0IGF0dGFjaGVzIHVzZXIgcmF0aW5nIGFuZCByZXZpZXdzIHRvIHRoZSByYXRpbmcgb2JqXG52YXIgYXR0YWNoVXNlclJhdGluZyA9IGZ1bmN0aW9uKHJhdGluZywgdXNlcm5hbWUpIHtcblx0cmV0dXJuIFJhdGluZy5xdWVyeShmdW5jdGlvbihxYikge1xuXHRcdHFiLmlubmVySm9pbigndXNlcnMnLCAndXNlcnMuaWQnLCAnPScsICdyYXRpbmdzLnVzZXJpZCcpXG5cdFx0cWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAnbW92aWVzLmlkJywgJz0nLCAncmF0aW5ncy5tb3ZpZWlkJylcblx0XHRxYi5zZWxlY3QoJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnKVxuXHRcdHFiLndoZXJlKHtcblx0XHRcdCd1c2Vycy51c2VybmFtZSc6IHVzZXJuYW1lLFxuXHRcdFx0J21vdmllcy50aXRsZSc6IHJhdGluZy5hdHRyaWJ1dGVzLnRpdGxlLFxuXHRcdFx0J21vdmllcy5pZCc6IHJhdGluZy5hdHRyaWJ1dGVzLmlkXG5cdFx0fSlcblx0fSlcblx0LmZldGNoKClcblx0LnRoZW4oZnVuY3Rpb24odXNlclJhdGluZyl7XG5cdFx0aWYgKHVzZXJSYXRpbmcpIHtcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLnNjb3JlID0gdXNlclJhdGluZy5hdHRyaWJ1dGVzLnNjb3JlO1xuXHRcdFx0cmF0aW5nLmF0dHJpYnV0ZXMucmV2aWV3ID0gdXNlclJhdGluZy5hdHRyaWJ1dGVzLnJldmlldztcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmF0aW5nLmF0dHJpYnV0ZXMuc2NvcmUgPSBudWxsO1xuXHRcdFx0cmF0aW5nLmF0dHJpYnV0ZXMucmV2aWV3ID0gbnVsbDtcblx0XHR9XG5cdFx0cmV0dXJuIHJhdGluZztcblx0fSk7XG59O1xuXG4vL3RoaXMgaXMgYSB3cmFwZXIgZnVuY3Rpb24gZm9yIGdldEZyaWVuZFJhdGluZ3Mgd2hpY2ggd2lsbCBzZW50IHRoZSBjbGllbnQgYWxsIG9mIHRoZSBmcmllbmQgcmF0aW5nc1xuZXhwb3J0cy5oYW5kbGVHZXRGcmllbmRSYXRpbmdzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcblx0Y29uc29sZS5sb2coJ2hhbmRsZUdldEZyaWVuZFJhdGluZ3MsICcsIHJlcS5teVNlc3Npb24udXNlciwgcmVxLmJvZHkubW92aWUudGl0bGUpO1xuXHRleHBvcnRzLmdldEZyaWVuZFJhdGluZ3MocmVxLm15U2Vzc2lvbi51c2VyLCB7YXR0cmlidXRlczogcmVxLmJvZHkubW92aWV9KVxuXHQudGhlbihmdW5jdGlvbihmcmllbmRSYXRpbmdzKXtcblx0XHRyZXMuanNvbihmcmllbmRSYXRpbmdzKTtcblx0fSk7XG59XG5cbi8vdGhpcyBmdW5jdGlvbiBvdXRwdXRzIHJhdGluZ3Mgb2YgYSB1c2VyJ3MgZnJpZW5kIGZvciBhIHBhcnRpY3VsYXIgbW92aWVcbi8vZXhwZWN0IGN1cnJlbnQgdXNlcm5hbWUgYW5kIG1vdmllVGl0bGUgYXMgaW5wdXRcbi8vb3V0cHV0czoge3VzZXIyaWQ6ICdpZCcsIGZyaWVuZFVzZXJOYW1lOiduYW1lJywgZnJpZW5kRmlyc3ROYW1lOiduYW1lJywgdGl0bGU6J21vdmllVGl0bGUnLCBzY29yZTpuIH1cbmV4cG9ydHMuZ2V0RnJpZW5kUmF0aW5ncyA9IGZ1bmN0aW9uKHVzZXJuYW1lLCBtb3ZpZU9iaikge1xuXHRyZXR1cm4gVXNlci5xdWVyeShmdW5jdGlvbihxYil7XG5cdFx0cWIuaW5uZXJKb2luKCdyZWxhdGlvbnMnLCAncmVsYXRpb25zLnVzZXIxaWQnLCAnPScsICd1c2Vycy5pZCcpO1xuXHRcdHFiLmlubmVySm9pbigncmF0aW5ncycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3JlbGF0aW9ucy51c2VyMmlkJyk7XG5cdFx0cWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XG5cdFx0cWIuc2VsZWN0KCdyZWxhdGlvbnMudXNlcjJpZCcsICdtb3ZpZXMudGl0bGUnLCAncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycpO1xuXHRcdHFiLndoZXJlKHtcblx0XHRcdCd1c2Vycy51c2VybmFtZSc6IHVzZXJuYW1lLCBcblx0XHRcdCdtb3ZpZXMudGl0bGUnOiBtb3ZpZU9iai5hdHRyaWJ1dGVzLnRpdGxlLFxuXHRcdFx0J21vdmllcy5pZCc6IG1vdmllT2JqLmF0dHJpYnV0ZXMuaWQgfSk7XG5cdH0pXG5cdC5mZXRjaEFsbCgpXG5cdC50aGVuKGZ1bmN0aW9uKGZyaWVuZHNSYXRpbmdzKXtcblx0Ly90aGUgZm9sbG93aW5nIGJsb2NrIGFkZHMgdGhlIGZyaWVuZE5hbWUgYXR0cmlidXRlIHRvIHRoZSByYXRpbmdzXG5cdFx0cmV0dXJuIFByb21pc2UubWFwKGZyaWVuZHNSYXRpbmdzLm1vZGVscywgZnVuY3Rpb24oZnJpZW5kUmF0aW5nKSB7XG5cdFx0XHRyZXR1cm4gbmV3IFVzZXIoeyBpZDogZnJpZW5kUmF0aW5nLmF0dHJpYnV0ZXMudXNlcjJpZCB9KS5mZXRjaCgpXG5cdFx0XHQudGhlbihmdW5jdGlvbihmcmllbmQpe1xuXHRcdFx0XHRmcmllbmRSYXRpbmcuYXR0cmlidXRlcy5mcmllbmRVc2VyTmFtZSA9IGZyaWVuZC5hdHRyaWJ1dGVzLnVzZXJuYW1lO1xuXHRcdFx0XHRmcmllbmRSYXRpbmcuYXR0cmlidXRlcy5mcmllbmRGaXJzdE5hbWUgPSBmcmllbmQuYXR0cmlidXRlcy5maXJzdE5hbWU7XG5cdFx0XHRcdHJldHVybiBmcmllbmRSYXRpbmc7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSlcblx0LnRoZW4oZnVuY3Rpb24oZnJpZW5kc1JhdGluZ3Mpe1xuXHRcdHJldHVybiBmcmllbmRzUmF0aW5ncztcblx0fSk7XG59O1xuXG5cbi8vYSBoZWxwZXIgZnVuY3Rpb24gdGhhdCBhdmVyYWdlcyB0aGUgcmF0aW5nXG4vL2lucHV0cyByYXRpbmdzLCBvdXRwdXRzIHRoZSBhdmVyYWdlIHNjb3JlO1xudmFyIGF2ZXJhZ2VSYXRpbmcgPSBmdW5jdGlvbihyYXRpbmdzKSB7XG5cdC8vcmV0dXJuIG51bGwgaWYgbm8gZnJpZW5kIGhhcyByYXRlZCB0aGUgbW92aWVcblx0aWYgKHJhdGluZ3MubGVuZ3RoID09PSAwKSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0cmV0dXJuIHJhdGluZ3Ncblx0LnJlZHVjZShmdW5jdGlvbih0b3RhbCwgcmF0aW5nKXtcblx0XHRyZXR1cm4gdG90YWwgKz0gcmF0aW5nLmF0dHJpYnV0ZXMuc2NvcmU7XG5cdH0sIDApIC8gcmF0aW5ncy5sZW5ndGg7XG59XG5cblxuLy9hIGhlbHBlciBmdW5jdGlvbiB0aGF0IG91dHB1dHMgdXNlciByYXRpbmcgYW5kIGF2ZXJhZ2UgZnJpZW5kIHJhdGluZyBmb3Igb25lIG1vdmllXG4vL291dHB1dHMgb25lIHJhdGluZyBvYmo6IHt0aXRsZTogJ25hbWUnLCBnZW5yZTogJ2dlbnJlJyAsIHBvc3RlcjogJ3VybCcsIHJlbGVhc2VfZGF0ZTogJ2RhdGUnLCBzY29yZTogbiwgZnJpZW5kQXZlcmFnZVJhdGluZzogbn1cbnZhciBnZXRPbmVNb3ZpZVJhdGluZyA9IGZ1bmN0aW9uKHVzZXJuYW1lLCBtb3ZpZU9iaikge1xuICByZXR1cm4gUmF0aW5nLnF1ZXJ5KGZ1bmN0aW9uKHFiKXtcbiAgXHRxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcbiAgXHRxYi5pbm5lckpvaW4oJ21vdmllcycsICdyYXRpbmdzLm1vdmllaWQnLCAnPScsICdtb3ZpZXMuaWQnKTtcbiAgXHRxYi5zZWxlY3QoJ3VzZXJzLnVzZXJuYW1lJywgJ21vdmllcy50aXRsZScsICdtb3ZpZXMuaWQnLCAnbW92aWVzLmdlbnJlJywgJ21vdmllcy5wb3N0ZXInLCAnbW92aWVzLnJlbGVhc2VfZGF0ZScsICdtb3ZpZXMuaW1kYlJhdGluZycsICdtb3ZpZXMuZGVzY3JpcHRpb24nLCAncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycpO1xuICBcdHFiLndoZXJlKHsndXNlcnMudXNlcm5hbWUnOiB1c2VybmFtZSwgJ21vdmllcy50aXRsZSc6IG1vdmllT2JqLnRpdGxlLCAnbW92aWVzLmlkJzogbW92aWVPYmouaWR9KTtcbiAgfSlcbiAgLmZldGNoKClcbiAgLnRoZW4oZnVuY3Rpb24ocmF0aW5nKXtcblx0ICBpZiAoIXJhdGluZykge1xuXHQgIFx0Ly9pZiB0aGUgdXNlciBoYXMgbm90IHJhdGVkIHRoZSBtb3ZpZSwgcmV0dXJuIGFuIG9iaiB0aGF0IGhhcyB0aGUgbW92aWUgaW5mb3JtYXRpb24sIGJ1dCBzY29yZSBpcyBzZXQgdG8gbnVsbFxuXHQgIFx0cmV0dXJuIG5ldyBNb3ZpZSh7dGl0bGU6IG1vdmllT2JqLnRpdGxlLCBpZDogbW92aWVPYmouaWR9KS5mZXRjaCgpXG5cdCAgXHQudGhlbihmdW5jdGlvbihtb3ZpZSkge1xuXHQgIFx0XHRtb3ZpZS5hdHRyaWJ1dGVzLnNjb3JlID0gbnVsbDtcblx0ICBcdFx0cmV0dXJuIG1vdmllO1xuXHQgIFx0fSlcblx0ICB9IGVsc2Uge1xuXHQgIFx0cmV0dXJuIHJhdGluZztcblx0ICB9XG5cdH0pXG5cdC50aGVuKGZ1bmN0aW9uKHJhdGluZyl7XG5cdFx0cmV0dXJuIGV4cG9ydHMuZ2V0RnJpZW5kUmF0aW5ncyh1c2VybmFtZSwgcmF0aW5nKVxuXHRcdC50aGVuKGZ1bmN0aW9uKGZyaWVuZHNSYXRpbmdzKXtcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdmcmllbmRzUmF0aW5ncycsIGZyaWVuZHNSYXRpbmdzKTtcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgPSBhdmVyYWdlUmF0aW5nKGZyaWVuZHNSYXRpbmdzKTtcblx0XHRcdGNvbnNvbGUubG9nKCdhZGRlZCBhdmVyYWdlIGZyaWVuZCByYXRpbmcnLCByYXRpbmcuYXR0cmlidXRlcy50aXRsZSwgcmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyk7XG5cdFx0XHRyZXR1cm4gcmF0aW5nO1xuXHRcdH0pO1xuXHR9KTtcbn1cblxuXG4vL3RoaXMgaGFuZGxlciBpcyBzcGVjaWZpY2FsbHkgZm9yIHNlbmRpbmcgb3V0IGEgbGlzdCBvZiBtb3ZpZSByYXRpbmdzIHdoZW4gdGhlIGNsaWVudCBzZW5kcyBhIGxpc3Qgb2YgbW92aWUgdG8gdGhlIHNlcnZlclxuLy9leHBlY3RzIHJlcS5ib2R5IHRvIGJlIGFuIGFycmF5IG9mIG9iaiB3aXRoIHRoZXNlIGF0dHJpYnV0ZXM6IHtpZCwgdGl0bGUsIGdlbnJlLCBwb3N0ZXJfcGF0aCwgcmVsZWFzZV9kYXRlLCBvdmVydmlldywgdm90ZV9hdmVyYWdlfVxuLy9vdXRwdXRzIFsge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnICwgcG9zdGVyOiAndXJsJywgcmVsZWFzZV9kYXRlOiAnZGF0ZScsIHNjb3JlOiBuLCBmcmllbmRBdmVyYWdlUmF0aW5nOiBufSAuLi4gXVxuZXhwb3J0cy5nZXRNdWx0aXBsZU1vdmllUmF0aW5ncyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cdGNvbnNvbGUubG9nKCdnZXRNdWx0aXBsZU1vdmllUmF0aW5ncycpO1xuXHRQcm9taXNlLm1hcChyZXEuYm9keS5tb3ZpZXMsIGZ1bmN0aW9uKG1vdmllKSB7XG5cdFx0Ly9maXJzdCBjaGVjayB3aGV0aGVyIG1vdmllIGlzIGluIHRoZSBkYXRhYmFzZVxuXHRcdHJldHVybiBuZXcgTW92aWUoe3RpdGxlOiBtb3ZpZS50aXRsZSwgaWQ6IG1vdmllLmlkfSkuZmV0Y2goKVxuXHRcdC50aGVuKGZ1bmN0aW9uKGZvdW5kTW92aWUpIHtcblx0XHRcdC8vaWYgbm90IGNyZWF0ZSBvbmVcblx0XHRcdGlmICghZm91bmRNb3ZpZSkge1xuXHRcdFx0XHRyZXR1cm4gYWRkT25lTW92aWUobW92aWUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGZvdW5kTW92aWU7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQudGhlbihmdW5jdGlvbihmb3VuZE1vdmllKXtcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdmb3VuZCBtb3ZpZScsIGZvdW5kTW92aWUpO1xuXHRcdFx0cmV0dXJuIGdldE9uZU1vdmllUmF0aW5nKHJlcS5teVNlc3Npb24udXNlciwgZm91bmRNb3ZpZS5hdHRyaWJ1dGVzKTtcblx0XHR9KVxuXHR9KVxuXHQudGhlbihmdW5jdGlvbihyYXRpbmdzKXtcblx0XHRjb25zb2xlLmxvZygnc2VuZGluZyByYXRpbmcgdG8gY2xpZW50Jyk7XG5cdFx0cmVzLmpzb24ocmF0aW5ncyk7XG5cdH0pXG59XG5cbi8vdGhpcyBoYW5kbGVyIHNlbmRzIGFuIGdldCByZXF1ZXN0IHRvIFRNREIgQVBJIHRvIHJldHJpdmUgcmVjZW50IHRpdGxlc1xuLy93ZSBjYW5ub3QgZG8gaXQgaW4gdGhlIGZyb250IGVuZCBiZWNhdXNlIGNyb3NzIG9yaWdpbiByZXF1ZXN0IGlzc3Vlc1xuZXhwb3J0cy5nZXRSZWNlbnRSZWxlYXNlID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgdmFyIHBhcmFtcyA9IHtcbiAgICBhcGlfa2V5OiAnOWQzYjAzNWVmMWNkNjY5YWVkMzk4NDAwYjE3ZmNlYTInLFxuICAgIHByaW1hcnlfcmVsZWFzZV95ZWFyOiBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCksXG4gICAgaW5jbHVkZV9hZHVsdDogZmFsc2UsXG4gICAgc29ydF9ieTogJ3BvcHVsYXJpdHkuZGVzYydcbiAgfTtcblxuXHQgXG4gIHZhciBkYXRhID0gJyc7XG5cdHJlcXVlc3Qoe1xuXHRcdG1ldGhvZDogJ0dFVCcsXG5cdFx0dXJsOiAnaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy9kaXNjb3Zlci9tb3ZpZS8nLFxuXHRcdHFzOiBwYXJhbXNcblx0fSlcblx0Lm9uKCdkYXRhJyxmdW5jdGlvbihjaHVuayl7XG5cdFx0ZGF0YSArPSBjaHVuaztcblx0fSlcblx0Lm9uKCdlbmQnLCBmdW5jdGlvbigpe1xuXHRcdHJlY2VudE1vdmllcyA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgcmVxLmJvZHkubW92aWVzID0gcmVjZW50TW92aWVzLnJlc3VsdHM7XG4gICAgLy90cmFuc2ZlcnMgdGhlIG1vdmllIGRhdGEgdG8gZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MgdG8gZGVjb3JhdGUgd2l0aCBzY29yZSAodXNlciByYXRpbmcpIGFuZCBhdmdmcmllbmRSYXRpbmcgYXR0cmlidXRlXG4gICAgZXhwb3J0cy5nZXRNdWx0aXBsZU1vdmllUmF0aW5ncyhyZXEsIHJlcyk7XG5cblx0fSlcblx0Lm9uKCdlcnJvcicsIGZ1bmN0aW9uKGVycm9yKXtcblx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdH0pXG5cbn1cblxuLy90aGlzIGlzIFRNREIncyBnZW5yZSBjb2RlLCB3ZSBtaWdodCB3YW50IHRvIHBsYWNlIHRoaXMgc29tZXdoZXJlIGVsc2VcbnZhciBnZW5yZXMgPSB7XG4gICAxMjogXCJBZHZlbnR1cmVcIixcbiAgIDE0OiBcIkZhbnRhc3lcIixcbiAgIDE2OiBcIkFuaW1hdGlvblwiLFxuICAgMTg6IFwiRHJhbWFcIixcbiAgIDI3OiBcIkhvcnJvclwiLFxuICAgMjg6IFwiQWN0aW9uXCIsXG4gICAzNTogXCJDb21lZHlcIixcbiAgIDM2OiBcIkhpc3RvcnlcIixcbiAgIDM3OiBcIldlc3Rlcm5cIixcbiAgIDUzOiBcIlRocmlsbGVyXCIsXG4gICA4MDogXCJDcmltZVwiLFxuICAgOTk6IFwiRG9jdW1lbnRhcnlcIixcbiAgIDg3ODogXCJTY2llbmNlIEZpY3Rpb25cIixcbiAgIDk2NDg6IFwiTXlzdGVyeVwiLFxuICAgMTA0MDI6IFwiTXVzaWNcIixcbiAgIDEwNzQ5OiBcIlJvbWFuY2VcIixcbiAgIDEwNzUxOiBcIkZhbWlseVwiLFxuICAgMTA3NTI6IFwiV2FyXCIsXG4gICAxMDc2OTogXCJGb3JlaWduXCIsXG4gICAxMDc3MDogXCJUViBNb3ZpZVwiXG4gfTtcblxuLy90aGlzIGZ1bmN0aW9uIHdpbGwgc2VuZCBiYWNrIHNlYXJjYiBtb3ZpZXMgdXNlciBoYXMgcmF0ZWQgaW4gdGhlIGRhdGFiYXNlXG4vL2l0IHdpbGwgc2VuZCBiYWNrIG1vdmllIG9ianMgdGhhdCBtYXRjaCB0aGUgc2VhcmNoIGlucHV0LCBleHBlY3RzIG1vdmllIG5hbWUgaW4gcmVxLmJvZHkudGl0bGVcbmV4cG9ydHMuc2VhcmNoUmF0ZWRNb3ZpZSA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIHJldHVybiBSYXRpbmcucXVlcnkoZnVuY3Rpb24ocWIpe1xuXHRcdHFiLmlubmVySm9pbigndXNlcnMnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICd1c2Vycy5pZCcpO1xuXHRcdHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xuXHRcdHFiLnNlbGVjdCgndXNlcnMudXNlcm5hbWUnLCAnbW92aWVzLnRpdGxlJywgJ21vdmllcy5pZCcsICdtb3ZpZXMuZ2VucmUnLCAnbW92aWVzLnBvc3RlcicsICdtb3ZpZXMucmVsZWFzZV9kYXRlJywgJ21vdmllcy5pbWRiUmF0aW5nJywgJ21vdmllcy5kZXNjcmlwdGlvbicsICdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3Jyk7XG4gIFx0cWIud2hlcmVSYXcoYE1BVENIIChtb3ZpZXMudGl0bGUpIEFHQUlOU1QgKCcke3JlcS5xdWVyeS50aXRsZX0nIElOIE5BVFVSQUwgTEFOR1VBR0UgTU9ERSlgKVxuICBcdHFiLmFuZFdoZXJlKCd1c2Vycy51c2VybmFtZScsICc9JywgcmVxLm15U2Vzc2lvbi51c2VyKVxuICBcdHFiLm9yZGVyQnkoJ3VwZGF0ZWRfYXQnLCAnREVTQycpXG4gIH0pXG4gIC5mZXRjaEFsbCgpXG4gIC50aGVuKGZ1bmN0aW9uKG1hdGNoZXMpe1xuICBcdGNvbnNvbGUubG9nKG1hdGNoZXMubW9kZWxzKTtcbiAgXHRyZXMuanNvbihtYXRjaGVzKTtcbiAgfSlcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vL2ZyaWVuZHNoaXAgaGFuZGxlcnNcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5leHBvcnRzLmdldEZyaWVuZExpc3QgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXHRyZXR1cm4gUmVsYXRpb24ucXVlcnkoZnVuY3Rpb24ocWIpe1xuXHRcdHFiLmlubmVySm9pbigndXNlcnMnLCAncmVsYXRpb25zLnVzZXIxaWQnLCAnPScsICd1c2Vycy5pZCcpO1xuXHRcdHFiLnNlbGVjdCgncmVsYXRpb25zLnVzZXIyaWQnKTtcblx0XHRxYi53aGVyZSh7XG5cdFx0XHQndXNlcnMudXNlcm5hbWUnOiByZXEubXlTZXNzaW9uLnVzZXJcblx0XHR9KVxuXHR9KVxuXHQuZmV0Y2hBbGwoKVxuXHQudGhlbihmdW5jdGlvbihmcmllbmRzKXtcblx0XHRyZXR1cm4gUHJvbWlzZS5tYXAoZnJpZW5kcy5tb2RlbHMsIGZ1bmN0aW9uKGZyaWVuZCkge1xuXHRcdFx0cmV0dXJuIG5ldyBVc2VyKHtpZDogZnJpZW5kLmF0dHJpYnV0ZXMudXNlcjJpZH0pLmZldGNoKClcblx0XHRcdC50aGVuKGZ1bmN0aW9uKGZyaWVuZFVzZXIpe1xuXHRcdFx0XHRyZXR1cm4gZnJpZW5kVXNlci5hdHRyaWJ1dGVzLnVzZXJuYW1lO1xuXHRcdFx0fSlcblx0XHR9KVxuXHR9KVxuXHQudGhlbihmdW5jdGlvbihmcmllbmRzKXtcblx0XHRjb25zb2xlLmxvZygnc2VuZGluZyBhIGxpc3Qgb2YgZnJpZW5kIG5hbWVzJywgZnJpZW5kcyk7XG5cdFx0cmVzLmpzb24oZnJpZW5kcyk7XG5cdH0pXG59XG5cbi8vdGhpcyB3b3VsZCBzZW5kIGEgbm90aWNlIHRvIHRoZSB1c2VyIHdobyByZWNlaXZlIHRoZSBmcmllbmQgcmVxdWVzdCwgcHJvbXB0aW5nIHRoZW0gdG8gYWNjZXB0IG9yIGRlbnkgdGhlIHJlcXVlc3RcbmV4cG9ydHMuYWRkRnJpZW5kID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcblxufTtcblxuXG4vL3RoaXMgd291bGQgY29uZmlybSB0aGUgZnJpZW5kc2hpcCBhbmQgZXN0YWJsaXNoIHRoZSByZWxhdGlvbnNoaXAgaW4gdGhlIGRhdGFiYXNlXG5leHBvcnRzLmNvbmZpcm1GcmllbmRzaGlwID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcblxufTtcblxuXG5cbmV4cG9ydHMuZ2V0RnJpZW5kcyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIHZhciBwZW9wbGVJZCA9IFtdO1xuICB2YXIgaWQgPSByZXEubXlTZXNzaW9uLnVzZXJcbiAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCBpZCwgZnVuY3Rpb24oZXJyLCByZXNwKSB7XG4gICAgdmFyIHVzZXJpZCA9IHJlc3BbMF0uaWQ7XG4gICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGJlIGxpbmcvMicsaWQpXG4gIFxuICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByYXRpbmdzIFdIRVJFIHVzZXJpZCA9ID8nLCB1c2VyaWQsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xuICAgICAgdmFyIHVzZXJzUmF0aW5ncz1yZXNwLm1hcChmdW5jdGlvbihhKXsgcmV0dXJuIFthLm1vdmllaWQsIGEuc2NvcmVdfSk7XG5cbiAgICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByZWxhdGlvbnMgV0hFUkUgdXNlcjFpZCA9ID8nLCB1c2VyaWQsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3AubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAocGVvcGxlSWQuaW5kZXhPZihyZXNwW2ldLnVzZXIyaWQpID09PSAtMSkge1xuICAgICAgICAgICAgcGVvcGxlSWQucHVzaChyZXNwW2ldLnVzZXIyaWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgcGVvcGxlID0gW11cbiAgICAgICAgY29uc29sZS5sb2coJ1RoaXMgc2hvdWxkIGFsc28gYmUgcGVvcGxlZWUnLHBlb3BsZUlkKTtcbiAgICAgICAgdmFyIGtleUlkPXt9O1xuICAgICAgICBwZW9wbGVJZC5mb3JFYWNoKGZ1bmN0aW9uKGEpIHtcblxuICAgICAgICAgIGNvbi5xdWVyeSgnU0VMRUNUIHVzZXJuYW1lIEZST00gdXNlcnMgV0hFUkUgaWQgPSA/JywgYSwgZnVuY3Rpb24oZXJyLCByZXNwbykge1xuICBcdCAgICAgICAga2V5SWRbYV09cmVzcG9bMF0udXNlcm5hbWU7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygndGhpcyBpcyBPTkUgb2YgdGhlIHBlb3BsZSEhJyxyZXNwb1swXS51c2VybmFtZSlcbiAgICAgICAgICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByYXRpbmdzIFdIRVJFIHVzZXJpZCA9JysnXCInK2ErJ1wiJywgZnVuY3Rpb24oZXJyLCByZSkge1xuICAgICAgXHQgICAgICBjb25zb2xlLmxvZygndGhpcyBpcyBhJyxhKVxuICAgICAgXHQgICAgICBpZiAocmUubGVuZ3RoPT09MCl7XG4gICAgICBcdFx0ICAgICAgcmU9W3t1c2VyaWQ6YSxtb3ZpZWlkOk1hdGgucm91bmQoTWF0aC5yYW5kb20oKSoxMDAwMCksc2NvcmU6OTl9XVxuICAgICAgXHQgICAgICB9XG4gICAgICBcdCAgICAgIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBiZSB0aGUgcmF0aW5ncyBmcm9tIGVhY2ggcGVyc29uISEnLHJlKTtcblxuICAgICAgICAgICAgICBwZW9wbGUucHVzaChyZS5tYXAoZnVuY3Rpb24oYSl7cmV0dXJuIFthLnVzZXJpZCxhLm1vdmllaWQsYS5zY29yZV07fSkpO1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgaWYgKHBlb3BsZS5sZW5ndGg9PT1wZW9wbGVJZC5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIHZhciBmaW5hbCA9IHt9O1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGJlIHBlb3BsZScsIHBlb3BsZSk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwZW9wbGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgIGlmIChwZW9wbGVbaV1bMF0hPT11bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgICAgICBmaW5hbFtrZXlJZFtwZW9wbGVbaV1bMF1bMF1dXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBlb3BsZVtpXS5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICAgIGZpbmFsW2tleUlkW3Blb3BsZVtpXVswXVswXV1dLnB1c2goW10pO1xuICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHogPSAxOyB6IDwgcGVvcGxlW2ldW3hdLmxlbmd0aDsgeisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5hbFtrZXlJZFtwZW9wbGVbaV1bMF1bMF1dXVt4XS5wdXNoKHBlb3BsZVtpXVt4XVt6XSlcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZmluYWwnLGZpbmFsLHVzZXJzUmF0aW5ncyk7XG5cbiAgICAgICAgICAgICAgICB2YXIgY29tcGFyaXNvbnM9e307XG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGZpbmFsKXtcbiAgICAgICAgICAgICAgICAgIGNvbXBhcmlzb25zW2tleV09Y29tcCh1c2Vyc1JhdGluZ3MsZmluYWxba2V5XSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY29tcGFyaXNvbnMpO1xuICAgICAgICAgICAgICAgIHZlcnlGaW5hbD1bXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gY29tcGFyaXNvbnMpe1xuICAgICAgICAgICAgICAgICAgdmVyeUZpbmFsLnB1c2goW2tleSxjb21wYXJpc29uc1trZXldXSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codmVyeUZpbmFsKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZCh2ZXJ5RmluYWwpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICB9KVxuICB9KVxufTtcblxuXG5cbi8vVEJEXG5leHBvcnRzLmdldEhpZ2hDb21wYXRpYmlsaXR5VXNlcnMgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICBcbn07XG5cblxuLy9UQkRcbmV4cG9ydHMuZ2V0UmVjb21tZW5kZWRNb3ZpZXMgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXG59OyJdfQ==
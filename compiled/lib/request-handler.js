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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9yZXF1ZXN0LWhhbmRsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQSxJQUFJLFNBQVEsU0FBUixNQUFRLENBQVMsSUFBVCxFQUFjLElBQWQsRUFBbUI7QUFDL0IsTUFBSSxPQUFLLEtBQUssR0FBTCxDQUFTLE9BQUssSUFBZCxDQUFUO0FBQ0EsU0FBTyxJQUFFLElBQVQ7QUFDQyxDQUhEOztBQUtBLElBQUksT0FBTyxTQUFQLElBQU8sQ0FBUyxLQUFULEVBQWdCLE1BQWhCLEVBQXdCO0FBQ25DLE1BQUksUUFBTyxFQUFYO0FBQ0UsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFHLE1BQU0sTUFBekIsRUFBaUMsR0FBakMsRUFBc0M7O0FBRXBDLFNBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxPQUFPLE1BQTNCLEVBQW1DLEdBQW5DLEVBQXdDOztBQUV0QyxVQUFJLE1BQU0sQ0FBTixFQUFTLENBQVQsTUFBZ0IsT0FBTyxDQUFQLEVBQVUsQ0FBVixDQUFwQixFQUFrQzs7QUFFcEMsY0FBTSxJQUFOLENBQVcsT0FBTyxNQUFNLENBQU4sRUFBUyxDQUFULENBQVAsRUFBbUIsT0FBTyxDQUFQLEVBQVUsQ0FBVixDQUFuQixDQUFYO0FBRUc7QUFDRjtBQUNGO0FBQ0gsTUFBSSxNQUFLLE1BQU0sTUFBTixDQUFhLFVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYTtBQUFDLFdBQU8sSUFBRSxDQUFUO0FBQVcsR0FBdEMsRUFBdUMsQ0FBdkMsQ0FBVDtBQUNBLFNBQU8sS0FBSyxLQUFMLENBQVcsS0FBRyxHQUFILEdBQU8sTUFBTSxNQUF4QixDQUFQO0FBQ0MsQ0FmRDs7Ozs7QUF3QkEsSUFBSSxLQUFLLFFBQVEscUJBQVIsQ0FBVDtBQUNBLElBQUksUUFBUSxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUksVUFBVSxRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQUksUUFBUSxRQUFRLHFCQUFSLENBQVo7QUFDQSxJQUFJLFNB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QUFRLEdBQVIsQ0FBWSxTQUFaO0FBQ0Esb0JBQUksSUFBSixDQUFTLFNBQVQ7QUFDRDtBQUNGLGFBdkNEO0FBd0NELFdBM0NEO0FBNENELFNBOUNEO0FBK0NELE9BeEREO0FBeURELEtBNUREO0FBNkRELEdBakVEO0FBa0VELENBckVEOzs7QUEwRUEsUUFBUSx5QkFBUixHQUFvQyxVQUFTLEdBQVQsRUFBYyxHQUFkLEVBQW1CLENBRXRELENBRkQ7OztBQU1BLFFBQVEsb0JBQVIsR0FBK0IsVUFBUyxHQUFULEVBQWMsR0FBZCxFQUFtQixDQUVqRCxDQUZEIiwiZmlsZSI6InJlcXVlc3QtaGFuZGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vVGhlIGFsZ29yaXRobVxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG52YXIgaGVscGVyPSBmdW5jdGlvbihudW0xLG51bTIpe1xudmFyIGRpZmY9TWF0aC5hYnMobnVtMS1udW0yKTtcbnJldHVybiA1LWRpZmY7XG59XG5cbnZhciBjb21wID0gZnVuY3Rpb24oZmlyc3QsIHNlY29uZCkge1xudmFyIGZpbmFsPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaTwgZmlyc3QubGVuZ3RoOyBpKyspIHtcblxuICAgIGZvciAodmFyIHggPSAwOyB4IDwgc2Vjb25kLmxlbmd0aDsgeCsrKSB7XG5cbiAgICAgIGlmIChmaXJzdFtpXVswXSA9PT0gc2Vjb25kW3hdWzBdKSB7XG5cbiAgICBmaW5hbC5wdXNoKGhlbHBlcihmaXJzdFtpXVsxXSxzZWNvbmRbeF1bMV0pKVxuXG4gICAgICB9XG4gICAgfVxuICB9XG52YXIgc3VtPSBmaW5hbC5yZWR1Y2UoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYStifSwwKTtcbnJldHVybiBNYXRoLnJvdW5kKDIwKnN1bS9maW5hbC5sZW5ndGgpXG59XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXG5cblxuXG52YXIgZGIgPSByZXF1aXJlKCcuLi9hcHAvZGJDb25uZWN0aW9uJyk7XG52YXIgbXlzcWwgPSByZXF1aXJlKCdteXNxbCcpO1xudmFyIGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XG52YXIgTW92aWUgPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL21vdmllJyk7XG52YXIgUmF0aW5nID0gcmVxdWlyZSgnLi4vYXBwL21vZGVscy9yYXRpbmcnKTtcbnZhciBSZWxhdGlvbiA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvcmVsYXRpb24nKTtcbnZhciBVc2VyID0gcmVxdWlyZSgnLi4vYXBwL21vZGVscy91c2VyJyk7XG52YXIgYWxsUmVxdWVzdCA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvYWxsUmVxdWVzdCcpO1xuXG52YXIgTW92aWVzID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL21vdmllcycpO1xudmFyIFJhdGluZ3MgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvcmF0aW5ncycpO1xudmFyIFJlbGF0aW9ucyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy9yZWxhdGlvbnMnKTtcbnZhciBVc2VycyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy91c2VycycpO1xudmFyIGFsbFJlcXVlc3RzID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL2FsbFJlcXVlc3RzJyk7XG5cbnZhciBQcm9taXNlID0gcmVxdWlyZShcImJsdWViaXJkXCIpO1xudmFyIHJlcXVlc3QgPSByZXF1aXJlKCdyZXF1ZXN0Jyk7XG5cbi8vIHZhciBjb24gPSBteXNxbC5jcmVhdGVDb25uZWN0aW9uKHtcbi8vICAgaG9zdDogXCJsb2NhbGhvc3RcIixcbi8vICAgdXNlcjogXCJyb290XCIsXG4vLyAgIHBhc3N3b3JkOiBcIjEyMzQ1XCIsXG4vLyAgIGRhdGFiYXNlOiBcIk1haW5EYXRhYmFzZVwiXG4vLyB9KTtcblxudmFyIGNvbiA9IG15c3FsLmNyZWF0ZUNvbm5lY3Rpb24oe1xuICBob3N0ICAgICA6ICd1cy1jZGJyLWlyb24tZWFzdC0wNC5jbGVhcmRiLm5ldCcsXG4gIHVzZXIgICAgIDogJ2I0MTkyOGFhOWQ2ZTNjJyxcbiAgcGFzc3dvcmQgOiAnNWE3MjAwOWYnLFxuICBkYXRhYmFzZSA6ICdoZXJva3VfNzVlNGZmMjk1YzI3NThkJ1xufSk7XG5cbmNvbi5jb25uZWN0KGZ1bmN0aW9uKGVycil7XG4gIGlmKGVycil7XG4gICAgY29uc29sZS5sb2coJ0Vycm9yIGNvbm5lY3RpbmcgdG8gRGInKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc29sZS5sb2coJ0Nvbm5lY3Rpb24gZXN0YWJsaXNoZWQnKTtcbn0pO1xuXG4vLy8vLy8vLy8vLy8vLy8vL1xuLy8vL3VzZXIgYXV0aFxuLy8vLy8vLy8vLy8vLy8vLy9cblxuZXhwb3J0cy5zaWdudXBVc2VyID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcblx0Y29uc29sZS5sb2coJ2NhbGxpbmcgbG9naW4nLCByZXEuYm9keSk7XG5cdC8vIGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBzZXNzaW9uJyxyZXEuc2Vzc2lvbilcbiAgbmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLmJvZHkubmFtZSB9KS5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oZm91bmQpIHtcblx0ICBpZiAoZm91bmQpIHtcblx0ICBcdC8vY2hlY2sgcGFzc3dvcmRcblx0ICBcdCAgIC8vaWYgKHBhc3N3b3JkIG1hdGNoZXMpXG5cdCAgXHQgICAvL3sgYWRkIHNlc3Npb25zIGFuZCByZWRpcmVjdH1cblx0ICBcdGNvbnNvbGUubG9nKCd1c2VybmFtZSBhbHJlYWR5IGV4aXN0LCBjYW5ub3Qgc2lnbnVwICcsIHJlcS5ib2R5Lm5hbWUpO1xuXHQgICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoJ3VzZXJuYW1lIGV4aXN0Jyk7XG5cdCAgfSBlbHNlIHtcblx0ICBcdGNvbnNvbGUubG9nKCdjcmVhdGluZyB1c2VyJyk7XG4gICAgICByZXEubXlTZXNzaW9uLnVzZXIgPSByZXEuYm9keS5uYW1lO1xuXHQgICAgVXNlcnMuY3JlYXRlKHtcblx0ICAgICAgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUsXG5cdCAgICAgIHBhc3N3b3JkOiByZXEuYm9keS5wYXNzd29yZCxcblx0ICAgIH0pXG5cdCAgICAudGhlbihmdW5jdGlvbih1c2VyKSB7XG5cdFx0ICBcdGNvbnNvbGUubG9nKCdjcmVhdGVkIGEgbmV3IHVzZXInKTtcblx0ICAgICAgcmVzLnN0YXR1cygyMDEpLnNlbmQoJ2xvZ2luIGNyZWF0ZWQnKTtcblx0ICAgIH0pO1xuXHQgIH1cblx0fSk7XG59O1xuXG5cbmV4cG9ydHMuc2VuZFdhdGNoUmVxdWVzdCA9IGZ1bmN0aW9uKHJlcSwgcmVzcG9uc2UpIHtcblx0Y29uc29sZS5sb2cocmVxLmJvZHkucmVxdWVzdGVlKVxuXHRpZiAoQXJyYXkuaXNBcnJheShyZXEuYm9keS5yZXF1ZXN0ZWUpKSB7XG5cdFx0dmFyIHJlcXVlc3RlZXMgPSByZXEuYm9keS5yZXF1ZXN0ZWU7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIHJlcXVlc3RlZXMgPSBbcmVxLmJvZHkucmVxdWVzdGVlXTtcblx0fVxuXHRQcm9taXNlLmVhY2gocmVxdWVzdGVlcywgZnVuY3Rpb24ocmVxdWVzdGVlKXtcblx0XHR2YXIgcmVxdWVzdCA9IHtcbiAgICAgIG1lc3NhZ2U6IHJlcS5ib2R5Lm1lc3NhZ2UsXG5cdFx0XHRyZXF1ZXN0b3I6IHJlcS5teVNlc3Npb24udXNlciwgXG5cdFx0XHRyZXF1ZXN0VHlwOid3YXRjaCcsXG5cdFx0XHRtb3ZpZTpyZXEuYm9keS5tb3ZpZSxcblx0XHRcdHJlcXVlc3RlZTogcmVxdWVzdGVlXG5cdFx0fTtcblx0XHRjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIGFsbHJlcXVlc3RzIFNFVCA/JywgcmVxdWVzdCwgZnVuY3Rpb24oZXJyLHJlcyl7XG5cdFx0ICBpZihlcnIpIHRocm93IGVycjtcblx0XHQgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xuXHRcdH0pO1xuXHR9KVxuXHQudGhlbihmdW5jdGlvbihkb25lKXtcblx0XHRyZXNwb25zZS5zZW5kKCdUaGF0cyBteSBzdHlsZSEnKTtcblx0fSlcbn1cblxuZXhwb3J0cy5yZW1vdmVXYXRjaFJlcXVlc3QgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICBpZiAoQXJyYXkuaXNBcnJheShyZXEuYm9keS5yZXF1ZXN0ZWUpKSB7XG4gICAgdmFyIHJlcXVlc3RlZXMgPSByZXEuYm9keS5yZXF1ZXN0ZWU7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHJlcXVlc3RlZXMgPSBbcmVxLmJvZHkucmVxdWVzdGVlXTtcbiAgfVxuICB2YXIgcmVxdWVzdG9yPXJlcS5ib2R5LnJlcXVlc3RvcjtcbiAgdmFyIG1vdmllID0gcmVxLmJvZHkubW92aWU7XG5cbiAgYWxsUmVxdWVzdC5mb3JnZSh7cmVxdWVzdG9yOiByZXF1ZXN0b3IsIHJlcXVlc3RlZTogcmVxdWVzdGVlcywgbW92aWU6IG1vdmllIH0pXG4gICAgLmZldGNoKCkudGhlbihmdW5jdGlvbihhbGxSZXF1ZXN0KSB7XG4gICAgICBhbGxSZXF1ZXN0LmRlc3Ryb3koKVxuICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXMuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiAnVXNlciBzdWNjZXNzZnVsbHkgZGVsZXRlZCd9fSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcbiAgICAgICAgfSk7XG4gICAgfSlcbiAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcbiAgICB9KTtcbn07XG5cblxuZXhwb3J0cy5zZW5kUmVxdWVzdCA9IGZ1bmN0aW9uKHJlcSwgcmVzcG9uc2UpIHtcbiAgY29uc29sZS5sb2coJ3RoaXMgaXMgd2hhdCBJbSBnZXR0aW5nJywgcmVxLmJvZHkpO1xuICBpZiAocmVxLm15U2Vzc2lvbi51c2VyPT09cmVxLmJvZHkubmFtZSl7XG4gICAgcmVzcG9uc2Uuc2VuZChcIllvdSBjYW4ndCBmcmllbmQgeW91cnNlbGYhXCIpXG4gIH0gZWxzZSB7XG5cbnZhciByZXF1ZXN0ID0ge3JlcXVlc3RvcjogcmVxLm15U2Vzc2lvbi51c2VyLCByZXF1ZXN0ZWU6IHJlcS5ib2R5Lm5hbWUsIHJlcXVlc3RUeXA6J2ZyaWVuZCd9O1xuXG5jb24ucXVlcnkoJ1NFTEVDVCByZXF1ZXN0ZWUscmVzcG9uc2UgRlJPTSBhbGxyZXF1ZXN0cyBXSEVSRSAgcmVxdWVzdG9yID0gPyBBTkQgcmVxdWVzdFR5cCA9JysnXCInKyAnZnJpZW5kJysnXCInLCByZXF1ZXN0WydyZXF1ZXN0b3InXSwgZnVuY3Rpb24oZXJyLHJlcyl7XG5pZiAocmVzID09PSB1bmRlZmluZWQpIHtcbiAgcmVzcG9uc2Uuc2VuZCgnbm8gZnJpZW5kcycpXG59XG52YXIgdGVzdD1yZXMuZmlsdGVyKGZ1bmN0aW9uKGEpe3JldHVybiBhLnJlc3BvbnNlPT09bnVsbH0pXG52YXIgdGVzdDI9dGVzdC5tYXAoZnVuY3Rpb24oYSl7IHJldHVybiBhLnJlcXVlc3RlZX0pXG5jb25zb2xlLmxvZygnbmFtZXMgb2YgcGVvcGxlIHdob20gSXZlIHJlcXVlc3RlZCBhcyBmcmllbmRzJyx0ZXN0KTtcblxuXG5cbmNvbi5xdWVyeSgnSU5TRVJUIElOVE8gYWxscmVxdWVzdHMgU0VUID8nLCByZXF1ZXN0LCBmdW5jdGlvbihlcnIscmVzcCl7XG4gIGlmKGVycikgdGhyb3cgZXJyO1xuICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzcC5pbnNlcnRJZCk7XG4gIHJlc3BvbnNlLnNlbmQodGVzdDIpO1xufSlcbn0pO1xuXG4gfVxufTtcblxuXG5cblxuXG5cblxuXG5cbmV4cG9ydHMubGlzdFJlcXVlc3RzID0gZnVuY3Rpb24ocmVxLCByZXNwb25zZSkge1xuICB2YXIgcmVxdWVzdCA9IHJlcS5teVNlc3Npb24udXNlclxuXG4gIGNvbi5xdWVyeSgnU2VsZWN0ICogRlJPTSBhbGxyZXF1ZXN0cyBXSEVSRSByZXF1ZXN0ZWU9JysnXCInK3JlcXVlc3QrJ1wiJysnJysnT1IgcmVxdWVzdG9yID0nKydcIicrcmVxdWVzdCsnXCInKycnLCBmdW5jdGlvbihlcnIscmVzKXtcbiAgaWYoZXJyKSB0aHJvdyBlcnI7XG4gIGNvbnNvbGUubG9nKHJlcylcbiAgcmVzcG9uc2Uuc2VuZChbcmVzLHJlcXVlc3RdKTtcbn0pO1xuXG5cbn07XG5cbmV4cG9ydHMuYWNjZXB0ID0gZnVuY3Rpb24ocmVxLCByZXNwb25zZSkge1xuICB2YXIgcmVxdWVzdG9yPXJlcS5ib2R5LnBlcnNvblRvQWNjZXB0O1xuICB2YXIgcmVxdWVzdGVlPXJlcS5teVNlc3Npb24udXNlcjtcbiAgdmFyIG1vdmllID0gcmVxLmJvZHkubW92aWU7XG4gIHZhciByZXF1ZXN0VHlwZSA9IFwiZnJpZW5kXCI7XG5cbiAgaWYgKG1vdmllID09PSAnJykge1xuICAgIGNvbi5xdWVyeSgnVVBEQVRFIGFsbHJlcXVlc3RzIFNFVCByZXNwb25zZT0nKydcIicgKyAneWVzJyArICdcIicrJyAgV0hFUkUgcmVxdWVzdG9yID0gJysnXCInKyByZXF1ZXN0b3IrJ1wiJysnIEFORCByZXF1ZXN0VHlwPScrJ1wiJytyZXF1ZXN0VHlwZSsnXCInLCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcbiAgICB9KTtcblxuICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIHJlcS5ib2R5LnBlcnNvblRvQWNjZXB0LCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzWzBdLmlkLCBlcnIpO1xuICAgIHZhciBwZXJzb24xID0gcmVzWzBdLmlkO1xuICAgIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgcmVxLm15U2Vzc2lvbi51c2VyLCBmdW5jdGlvbihlcnIsIHJlc3ApIHtcbiAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXNwWzBdLmlkLCBlcnIpO1xuXG4gICAgICB2YXIgcGVyc29uMiA9IHJlc3BbMF0uaWQ7XG4gICAgICB2YXIgcmVxdWVzdCA9IHtcbiAgICAgICAgdXNlcjFpZDogcGVyc29uMSxcbiAgICAgICAgdXNlcjJpZDogcGVyc29uMlxuICAgICAgfVxuICAgICAgdmFyIHJlcXVlc3QyID0ge1xuICAgICAgICB1c2VyMWlkOiBwZXJzb24yLFxuICAgICAgICB1c2VyMmlkOiBwZXJzb24xXG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUubG9nKCd0aGUgcmVxdWVzdHM6OjonLHJlcXVlc3QscmVxdWVzdDIpXG4gICAgICBjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIHJlbGF0aW9ucyBTRVQgPycsIHJlcXVlc3QsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XG5cbiAgICAgIGNvbi5xdWVyeSgnSU5TRVJUIElOVE8gcmVsYXRpb25zIFNFVCA/JywgcmVxdWVzdDIsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcblxuICAgICAgICAgICByZXNwb25zZS5zZW5kKCdUaGF0cyBteSBzdHlsZSEhIScpO1xuICAgICAgICB9KVxuICAgICAgfSk7XG4gICAgfSlcbiAgfSlcbiAgfSBlbHNlIHtcbiAgY29uc29sZS5sb2coJ3RoaXMgaXMgcmVxIGJvZHkgJyxyZXEuYm9keSk7XG5cbiAgY29uLnF1ZXJ5KCdVUERBVEUgYWxscmVxdWVzdHMgU0VUIHJlc3BvbnNlPScrJ1wiJyArICd5ZXMnICsgJ1wiJysnICBXSEVSRSByZXF1ZXN0b3IgPSAnKydcIicrIHJlcXVlc3RvcisnXCInKycgQU5EIG1vdmllPScrJ1wiJysgbW92aWUrJ1wiJywgZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcbiAgfSk7XG5cbiAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCByZXEuYm9keS5wZXJzb25Ub0FjY2VwdCwgZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlc1swXS5pZCwgZXJyKTtcbiAgICB2YXIgcGVyc29uMSA9IHJlc1swXS5pZDtcbiAgICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIHJlcS5teVNlc3Npb24udXNlciwgZnVuY3Rpb24oZXJyLCByZXNwKSB7XG4gICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzcFswXS5pZCwgZXJyKTtcblxuICAgICAgdmFyIHBlcnNvbjIgPSByZXNwWzBdLmlkO1xuICAgICAgdmFyIHJlcXVlc3QgPSB7XG4gICAgICAgIHVzZXIxaWQ6IHBlcnNvbjEsXG4gICAgICAgIHVzZXIyaWQ6IHBlcnNvbjJcbiAgICAgIH1cbiAgICAgIHZhciByZXF1ZXN0MiA9IHtcbiAgICAgICAgdXNlcjFpZDogcGVyc29uMixcbiAgICAgICAgdXNlcjJpZDogcGVyc29uMVxuICAgICAgfVxuXG4gICAgICBjb25zb2xlLmxvZygndGhlIHJlcXVlc3RzOjo6JyxyZXF1ZXN0LHJlcXVlc3QyKVxuICAgICAgY29uLnF1ZXJ5KCdJTlNFUlQgSU5UTyByZWxhdGlvbnMgU0VUID8nLCByZXF1ZXN0LCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xuXG4gICAgICBjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIHJlbGF0aW9ucyBTRVQgPycsIHJlcXVlc3QyLCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XG5cbiAgICAgICAgICAgcmVzcG9uc2Uuc2VuZCgnVGhhdHMgbXkgc3R5bGUhISEnKTtcbiAgICAgICAgfSlcbiAgICAgIH0pO1xuICAgIH0pXG4gIH0pXG59XG4gIC8vIGFsbFJlcXVlc3QuZm9yZ2Uoe3JlcXVlc3RvcjogcmVxdWVzdG9yLCByZXF1ZXN0ZWU6IHJlcXVlc3RlZX0pXG4gIC8vICAgLmZldGNoKCkudGhlbihmdW5jdGlvbihhbGxSZXF1ZXN0KSB7XG4gIC8vICAgICBhbGxSZXF1ZXN0LmRlc3Ryb3koKVxuICAvLyAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgLy8gICAgICAgICByZXNwb25zZS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6ICdVc2VyIHN1Y2Nlc3NmdWxseSBkZWxldGVkJ319KTtcbiAgLy8gICAgICAgfSlcbiAgLy8gICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAvLyAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XG4gIC8vICAgICAgIH0pO1xuICAvLyAgIH0pXG4gIC8vICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAvLyAgICAgcmVzcG9uc2Uuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcbiAgLy8gICB9KTtcbn07XG5cbmV4cG9ydHMucmVtb3ZlUmVxdWVzdCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIHZhciByZXF1ZXN0b3I9cmVxLmJvZHkucmVxdWVzdG9yO1xuICB2YXIgcmVxdWVzdGVlPXJlcS5ib2R5LnJlcXVlc3RlZTtcblxuICBhbGxSZXF1ZXN0LmZvcmdlKHtyZXF1ZXN0b3I6IHJlcXVlc3RvciwgcmVxdWVzdGVlOiByZXF1ZXN0ZWV9KVxuICAgIC5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oYWxsUmVxdWVzdCkge1xuICAgICAgYWxsUmVxdWVzdC5kZXN0cm95KClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmVzLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogJ1VzZXIgc3VjY2Vzc2Z1bGx5IGRlbGV0ZWQnfX0pO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogcmVxLmJvZHl9fSk7XG4gICAgICAgIH0pO1xuICAgIH0pXG4gICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogcmVxLmJvZHl9fSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydHMuZ2V0VGhpc0ZyaWVuZHNNb3ZpZXM9ZnVuY3Rpb24ocmVxLHJlc3BvbnNlKXtcblxuICB2YXIgbW92aWVzPVtdO1xuICBjb25zb2xlLmxvZyhyZXEuYm9keS5zcGVjaWZpY0ZyaWVuZCk7XG4gIHZhciBwZXJzb249cmVxLmJvZHkuc3BlY2lmaWNGcmllbmRcbiAgdmFyIGlkPW51bGxcbiAgdmFyIGxlbj1udWxsO1xuICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIHBlcnNvbiwgZnVuY3Rpb24oZXJyLCByZXNwKXtcbmNvbnNvbGUubG9nKHJlc3ApXG5pZD1yZXNwWzBdLmlkO1xuXG5cbmNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByYXRpbmdzIFdIRVJFIHVzZXJpZCA9ID8nLCBpZCAsZnVuY3Rpb24oZXJyLHJlc3Ape1xuY29uc29sZS5sb2coJ2VycnJycnJycnInLGVycixyZXNwLmxlbmd0aClcbmxlbj1yZXNwLmxlbmd0aDtcbnJlc3AuZm9yRWFjaChmdW5jdGlvbihhKXtcblxuY29uLnF1ZXJ5KCdTRUxFQ1QgdGl0bGUgRlJPTSBtb3ZpZXMgV0hFUkUgaWQgPSA/JywgYS5tb3ZpZWlkICxmdW5jdGlvbihlcnIscmVzcCl7XG4gIGNvbnNvbGUubG9nKHJlc3ApXG5tb3ZpZXMucHVzaChbcmVzcFswXS50aXRsZSxhLnNjb3JlLGEucmV2aWV3XSlcbmNvbnNvbGUubG9nKG1vdmllcylcbmlmIChtb3ZpZXMubGVuZ3RoPT09bGVuKXtcbiAgcmVzcG9uc2Uuc2VuZChtb3ZpZXMpO1xufVxufSlcblxufSlcblxufSlcblxuXG4gIH1cblxuKX1cblxuZXhwb3J0cy5maW5kTW92aWVCdWRkaWVzPWZ1bmN0aW9uKHJlcSxyZXNwb25zZSl7XG4gIGNvbnNvbGUubG9nKFwieW91J3JlIHRyeWluZyB0byBmaW5kIGJ1ZGRpZXMhIVwiKTtcbmNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSB1c2VycycsZnVuY3Rpb24oZXJyLHJlc3Ape1xuICB2YXIgcGVvcGxlPXJlc3AubWFwKGZ1bmN0aW9uKGEpe3JldHVybiBhLnVzZXJuYW1lfSlcbiAgdmFyIElkcz0gcmVzcC5tYXAoZnVuY3Rpb24oYSl7cmV0dXJuIGEuaWR9KVxuICB2YXIgaWRLZXlPYmo9e31cbmZvciAodmFyIGk9MDtpPElkcy5sZW5ndGg7aSsrKXtcbiAgaWRLZXlPYmpbSWRzW2ldXT1wZW9wbGVbaV1cbn1cbmNvbnNvbGUubG9nKCdjdXJyZW50IHVzZXInLHJlcS5teVNlc3Npb24udXNlcik7XG52YXIgY3VycmVudFVzZXI9cmVxLm15U2Vzc2lvbi51c2VyXG5cblxuIHZhciBvYmoxPXt9O1xuICBmb3IgKHZhciBpPTA7aTxJZHMubGVuZ3RoO2krKyl7XG5vYmoxW2lkS2V5T2JqW0lkc1tpXV1dPVtdO1xuICB9XG5cbiAgY29uLnF1ZXJ5KCdTRUxFQ1Qgc2NvcmUsbW92aWVpZCx1c2VyaWQgRlJPTSByYXRpbmdzJyxmdW5jdGlvbihlcnIscmVzcG9uKXtcbiAgXG5mb3IgKHZhciBpPTA7aTxyZXNwb24ubGVuZ3RoO2krKyl7XG4gIG9iajFbaWRLZXlPYmpbcmVzcG9uW2ldLnVzZXJpZF1dLnB1c2goW3Jlc3BvbltpXS5tb3ZpZWlkLHJlc3BvbltpXS5zY29yZV0pXG59XG5cbmNvbnNvbGUubG9nKCdvYmoxJyxvYmoxKTtcbmN1cnJlbnRVc2VySW5mbz1vYmoxW2N1cnJlbnRVc2VyXVxuLy9jb25zb2xlLmxvZygnY3VycmVudFVzZXJJbmZvJyxjdXJyZW50VXNlckluZm8pXG52YXIgY29tcGFyaXNvbnM9e31cblxuZm9yICh2YXIga2V5IGluIG9iajEpe1xuICBpZiAoa2V5IT09Y3VycmVudFVzZXIpIHtcbiAgICBjb21wYXJpc29uc1trZXldPWNvbXAoY3VycmVudFVzZXJJbmZvLG9iajFba2V5XSlcbiAgfVxufVxuY29uc29sZS5sb2coY29tcGFyaXNvbnMpXG52YXIgZmluYWxTZW5kPVtdXG5mb3IgKHZhciBrZXkgaW4gY29tcGFyaXNvbnMpe1xuICBpZiAoY29tcGFyaXNvbnNba2V5XSAhPT0gJ05hTiUnKSB7XG4gIGZpbmFsU2VuZC5wdXNoKFtrZXksY29tcGFyaXNvbnNba2V5XV0pO1xufSBlbHNlICB7XG4gIGZpbmFsU2VuZC5wdXNoKFtrZXksXCJObyBDb21wYXJpc29uIHRvIE1ha2VcIl0pXG59XG5cbn1cblxuICByZXNwb25zZS5zZW5kKGZpbmFsU2VuZClcbn0pXG59KVxufVxuXG5cbmV4cG9ydHMuZGVjbGluZT1mdW5jdGlvbihyZXEscmVzcG9uc2Upe1xuICB2YXIgcmVxdWVzdG9yPXJlcS5ib2R5LnBlcnNvblRvRGVjbGluZTtcbiAgdmFyIHJlcXVlc3RlZT1yZXEubXlTZXNzaW9uLnVzZXI7XG4gIHZhciBtb3ZpZT1yZXEuYm9keS5tb3ZpZTtcbiAgdmFyIHJlcXVlc3RUeXBlID0gJ2ZyaWVuZCc7XG5cbiAgaWYgKG1vdmllID09PSAnJykge1xuICAgIGNvbi5xdWVyeSgnVVBEQVRFIGFsbHJlcXVlc3RzIFNFVCByZXNwb25zZT0nKydcIicgKyAnbm8nICsgJ1wiJysgJyBXSEVSRSByZXF1ZXN0b3IgPSAnKydcIicrIHJlcXVlc3RvcisnXCInKycgQU5EIHJlcXVlc3RUeXA9JysnXCInKyByZXF1ZXN0VHlwZSsnXCInLCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XG4gICAgICByZXNwb25zZS5zZW5kKHJlcXVlc3RvciArICdkZWxldGVkJyk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY29uLnF1ZXJ5KCdVUERBVEUgYWxscmVxdWVzdHMgU0VUIHJlc3BvbnNlPScrJ1wiJyArICdubycgKyAnXCInKyAnIFdIRVJFIHJlcXVlc3RvciA9ICcrJ1wiJysgcmVxdWVzdG9yKydcIicrJyBBTkQgcmVxdWVzdGVlPScrJ1wiJysgcmVxdWVzdGVlKydcIicrJyBBTkQgbW92aWUgPScrJ1wiJyttb3ZpZSsnXCInLCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XG4gICAgICByZXNwb25zZS5zZW5kKHJlcXVlc3RvciArICdkZWxldGVkJyk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBhbGxSZXF1ZXN0LmZvcmdlKHtyZXF1ZXN0b3I6IHJlcXVlc3RvciwgcmVxdWVzdGVlOiByZXF1ZXN0ZWV9KVxuICAvLyAgIC5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oYWxsUmVxdWVzdCkge1xuICAvLyAgICAgYWxsUmVxdWVzdC5kZXN0cm95KClcbiAgLy8gICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gIC8vICAgICAgICAgcmVzcG9uc2UuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiAnVXNlciBzdWNjZXNzZnVsbHkgZGVsZXRlZCd9fSk7XG4gIC8vICAgICAgIH0pXG4gIC8vICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgLy8gICAgICAgICByZXNwb25zZS5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xuICAvLyAgICAgICB9KTtcbiAgLy8gICB9KVxuICAvLyAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgLy8gICAgIHJlc3BvbnNlLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XG4gIC8vICAgfSk7XG59O1xuXG5leHBvcnRzLnNpZ251cFVzZXIgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICBjb25zb2xlLmxvZygnY2FsbGluZyBsb2dpbicsIHJlcS5ib2R5KTtcbiAgLy8gY29uc29sZS5sb2coJ3RoaXMgaXMgdGhlIHNlc3Npb24nLHJlcS5zZXNzaW9uKVxuICBuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEuYm9keS5uYW1lIH0pLmZldGNoKCkudGhlbihmdW5jdGlvbihmb3VuZCkge1xuICAgIGlmIChmb3VuZCkge1xuICAgICAgLy9jaGVjayBwYXNzd29yZFxuICAgICAgICAgLy9pZiAocGFzc3dvcmQgbWF0Y2hlcylcbiAgICAgICAgIC8veyBhZGQgc2Vzc2lvbnMgYW5kIHJlZGlyZWN0fVxuICAgICAgY29uc29sZS5sb2coJ3VzZXJuYW1lIGFscmVhZHkgZXhpc3QsIGNhbm5vdCBzaWdudXAgJywgcmVxLmJvZHkubmFtZSk7XG4gICAgICByZXMuc3RhdHVzKDQwMykuc2VuZCgndXNlcm5hbWUgZXhpc3QnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ2NyZWF0aW5nIHVzZXInKTtcbiAgICAgIHJlcS5teVNlc3Npb24udXNlciA9IHJlcS5ib2R5Lm5hbWU7XG4gICAgICBVc2Vycy5jcmVhdGUoe1xuICAgICAgICB1c2VybmFtZTogcmVxLmJvZHkubmFtZSxcbiAgICAgICAgcGFzc3dvcmQ6IHJlcS5ib2R5LnBhc3N3b3JkLFxuICAgICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHVzZXIpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2NyZWF0ZWQgYSBuZXcgdXNlcicpO1xuICAgICAgICByZXMuc3RhdHVzKDIwMSkuc2VuZCgnbG9naW4gY3JlYXRlZCcpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn07XG5cbmV4cG9ydHMuc2lnbmluVXNlciA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cdGNvbnNvbGUubG9nKCdjYWxsaW5nIHNpZ25pbicsIHJlcS5ib2R5KTtcblx0bmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLmJvZHkubmFtZSB9KS5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oZm91bmQpe1xuXG5cdFx0aWYgKGZvdW5kKXtcblx0XHRcdG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUsIHBhc3N3b3JkOnJlcS5ib2R5LnBhc3N3b3JkfSkuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGZvdW5kKXtcblx0XHRcdFx0aWYgKGZvdW5kKXtcblx0XHRcdFx0XHRyZXEubXlTZXNzaW9uLnVzZXIgPSBmb3VuZC5hdHRyaWJ1dGVzLnVzZXJuYW1lO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGZvdW5kLmF0dHJpYnV0ZXMudXNlcm5hbWUpXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ3dlIGZvdW5kIHlvdSEhJylcblx0XHRcdFx0XHRyZXMuc2VuZChbJ2l0IHdvcmtlZCcscmVxLm15U2Vzc2lvbi51c2VyXSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmVzLnN0YXR1cyg0MDQpLnNlbmQoJ2JhZCBsb2dpbicpO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCd3cm9uZyBwYXNzd29yZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXMuc3RhdHVzKDQwNCkuc2VuZCgnYmFkIGxvZ2luJyk7XG5cdFx0XHRjb25zb2xlLmxvZygndXNlciBub3QgZm91bmQnKTtcblx0XHR9XG5cbiAgfSkgXG5cbn1cblxuZXhwb3J0cy5sb2dvdXQgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXHRyZXEubXlTZXNzaW9uLmRlc3Ryb3koZnVuY3Rpb24oZXJyKXtcblx0XHRjb25zb2xlLmxvZyhlcnIpO1xuXHR9KTtcblx0Y29uc29sZS5sb2coJ2xvZ291dCcpO1xuXHRyZXMuc2VuZCgnbG9nb3V0Jyk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vL21vdmllIGhhbmRsZXJzXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuLy9hIGhhbmRlbGVyIHRoYXQgdGFrZXMgYSByYXRpbmcgZnJvbSB1c2VyIGFuZCBhZGQgaXQgdG8gdGhlIGRhdGFiYXNlXG4vLyBleHBlY3RzIHJlcS5ib2R5IHRvIGhhdmUgdGhpczoge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnLCBwb3N0ZXI6ICdsaW5rJywgcmVsZWFzZV9kYXRlOiAneWVhcicsIHJhdGluZzogJ251bWJlcid9XG5leHBvcnRzLnJhdGVNb3ZpZSA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cdGNvbnNvbGUubG9nKCdjYWxsaW5nIHJhdGVNb3ZpZScpO1xuXHR2YXIgdXNlcmlkO1xuXHRyZXR1cm4gbmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLm15U2Vzc2lvbi51c2VyIH0pLmZldGNoKClcblx0LnRoZW4oZnVuY3Rpb24oZm91bmRVc2VyKSB7XG5cdFx0dXNlcmlkID0gZm91bmRVc2VyLmF0dHJpYnV0ZXMuaWQ7XG5cdFx0cmV0dXJuIG5ldyBSYXRpbmcoeyBtb3ZpZWlkOiByZXEuYm9keS5pZCwgdXNlcmlkOiB1c2VyaWQgfSkuZmV0Y2goKVxuXHRcdC50aGVuKGZ1bmN0aW9uKGZvdW5kUmF0aW5nKSB7XG5cdFx0XHRpZiAoZm91bmRSYXRpbmcpIHtcblx0XHRcdFx0Ly9zaW5jZSByYXRpbmcgb3IgcmV2aWV3IGlzIHVwZGF0ZWQgc2VwZXJhdGx5IGluIGNsaWVudCwgdGhlIGZvbGxvd2luZ1xuXHRcdFx0XHQvL21ha2Ugc3VyZSBpdCBnZXRzIHVwZGF0ZWQgYWNjb3JkaW5nIHRvIHRoZSByZXFcblx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ3VwZGF0ZSByYXRpbmcnLCBmb3VuZFJhdGluZylcblx0XHRcdFx0aWYgKHJlcS5ib2R5LnJhdGluZykge1xuXHRcdFx0XHRcdHZhciByYXRpbmdPYmogPSB7c2NvcmU6IHJlcS5ib2R5LnJhdGluZ307XG5cdFx0XHRcdH0gZWxzZSBpZiAocmVxLmJvZHkucmV2aWV3KSB7XG5cdFx0XHRcdFx0dmFyIHJhdGluZ09iaiA9IHtyZXZpZXc6IHJlcS5ib2R5LnJldmlld307XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIG5ldyBSYXRpbmcoeydpZCc6IGZvdW5kUmF0aW5nLmF0dHJpYnV0ZXMuaWR9KVxuXHRcdFx0XHRcdC5zYXZlKHJhdGluZ09iaik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnY3JlYXRpbmcgcmF0aW5nJyk7XG5cdFx0ICAgIHJldHVybiBSYXRpbmdzLmNyZWF0ZSh7XG5cdFx0ICAgIFx0c2NvcmU6IHJlcS5ib2R5LnJhdGluZyxcblx0XHQgICAgICB1c2VyaWQ6IHVzZXJpZCxcblx0XHQgICAgICBtb3ZpZWlkOiByZXEuYm9keS5pZCxcblx0XHQgICAgICByZXZpZXc6IHJlcS5ib2R5LnJldmlld1xuXHRcdCAgICB9KTtcdFx0XHRcdFx0XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pXG5cdC50aGVuKGZ1bmN0aW9uKG5ld1JhdGluZykge1xuXHRcdGNvbnNvbGUubG9nKCdyYXRpbmcgY3JlYXRlZDonLCBuZXdSYXRpbmcuYXR0cmlidXRlcyk7XG4gIFx0cmVzLnN0YXR1cygyMDEpLnNlbmQoJ3JhdGluZyByZWNpZXZlZCcpO1xuXHR9KVxuICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgcmVzLnN0YXR1cyg1MDApLnNlbmQoJ2Vycm9yJyk7XG4gIH0pXG59O1xuXG4vL3RoaXMgaGVscGVyIGZ1bmN0aW9uIGFkZHMgdGhlIG1vdmllIGludG8gZGF0YWJhc2Vcbi8vaXQgZm9sbG93cyB0aGUgc2FtZSBtb3ZpZSBpZCBhcyBUTURCXG4vL2V4cGVjdHMgcmVxLmJvZHkgdG8gaGF2ZSB0aGVzZSBhdHJpYnV0ZSA6IHtpZCwgdGl0bGUsIGdlbnJlLCBwb3N0ZXJfcGF0aCwgcmVsZWFzZV9kYXRlLCBvdmVydmlldywgdm90ZV9hdmVyYWdlfVxudmFyIGFkZE9uZU1vdmllID0gZnVuY3Rpb24obW92aWVPYmopIHtcblx0dmFyIGdlbnJlID0gKG1vdmllT2JqLmdlbnJlX2lkcykgPyBnZW5yZXNbbW92aWVPYmouZ2VucmVfaWRzWzBdXSA6ICduL2EnO1xuICByZXR1cm4gbmV3IE1vdmllKHtcbiAgXHRpZDogbW92aWVPYmouaWQsXG4gICAgdGl0bGU6IG1vdmllT2JqLnRpdGxlLFxuICAgIGdlbnJlOiBnZW5yZSxcbiAgICBwb3N0ZXI6ICdodHRwczovL2ltYWdlLnRtZGIub3JnL3QvcC93MTg1LycgKyBtb3ZpZU9iai5wb3N0ZXJfcGF0aCxcbiAgICByZWxlYXNlX2RhdGU6IG1vdmllT2JqLnJlbGVhc2VfZGF0ZSxcbiAgICBkZXNjcmlwdGlvbjogbW92aWVPYmoub3ZlcnZpZXcuc2xpY2UoMCwgMjU1KSxcbiAgICBpbWRiUmF0aW5nOiBtb3ZpZU9iai52b3RlX2F2ZXJhZ2VcbiAgfSkuc2F2ZShudWxsLCB7bWV0aG9kOiAnaW5zZXJ0J30pXG4gIC50aGVuKGZ1bmN0aW9uKG5ld01vdmllKSB7XG4gIFx0Y29uc29sZS5sb2coJ21vdmllIGNyZWF0ZWQnLCBuZXdNb3ZpZS5hdHRyaWJ1dGVzLnRpdGxlKTtcbiAgXHRyZXR1cm4gbmV3TW92aWU7XG4gIH0pXG59O1xuXG5cbi8vZ2V0IGFsbCBtb3ZpZSByYXRpbmdzIHRoYXQgYSB1c2VyIHJhdGVkXG4vL3Nob3VsZCByZXR1cm4gYW4gYXJyYXkgdGhhdCBsb29rIGxpa2UgdGhlIGZvbGxvd2luZzpcbi8vIFsge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnICwgcG9zdGVyOiAndXJsJywgcmVsZWFzZV9kYXRlOiAnZGF0ZScsIHNjb3JlOiBuLCBmcmllbmRBdmVyYWdlUmF0aW5nOiBufSAuLi4gXVxuLy8gd2lsbCBnZXQgcmF0aW5ncyBmb3IgdGhlIGN1cnJlbnQgdXNlclxuZXhwb3J0cy5nZXRVc2VyUmF0aW5ncyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIFJhdGluZy5xdWVyeShmdW5jdGlvbihxYil7XG4gIFx0cWIuaW5uZXJKb2luKCd1c2VycycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3VzZXJzLmlkJyk7XG4gIFx0cWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XG4gIFx0cWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnLCAncmF0aW5ncy51cGRhdGVkX2F0Jyk7XG4gIFx0cWIud2hlcmUoJ3VzZXJzLnVzZXJuYW1lJywgJz0nLCByZXEubXlTZXNzaW9uLnVzZXIpO1xuICBcdHFiLm9yZGVyQnkoJ3VwZGF0ZWRfYXQnLCAnREVTQycpXG4gIH0pXG4gIC5mZXRjaEFsbCgpXG4gIC50aGVuKGZ1bmN0aW9uKHJhdGluZ3Mpe1xuXHRcdC8vZGVjb3JhdGUgaXQgd2l0aCBhdmcgZnJpZW5kIHJhdGluZ1xuXHRcdHJldHVybiBQcm9taXNlLm1hcChyYXRpbmdzLm1vZGVscywgZnVuY3Rpb24ocmF0aW5nKSB7XG5cdFx0XHRyZXR1cm4gYXR0YWNoRnJpZW5kQXZnUmF0aW5nKHJhdGluZywgcmVxLm15U2Vzc2lvbi51c2VyKTtcblx0XHR9KTtcblx0fSlcbiAgLnRoZW4oZnVuY3Rpb24ocmF0aW5ncykge1xuICBcdGNvbnNvbGUubG9nKCdyZXRyaXZpbmcgYWxsIHVzZXIgcmF0aW5ncycpO1xuICBcdHJlcy5zdGF0dXMoMjAwKS5qc29uKHJhdGluZ3MpO1xuICB9KVxufTtcblxuZXhwb3J0cy5nZXRGcmllbmRVc2VyUmF0aW5ncyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIFJhdGluZy5xdWVyeShmdW5jdGlvbihxYil7XG4gIFx0cWIuaW5uZXJKb2luKCd1c2VycycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3VzZXJzLmlkJyk7XG4gIFx0cWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XG4gIFx0cWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUgYXMgZnJpZW5kU2NvcmUnLCAncmF0aW5ncy5yZXZpZXcgYXMgZnJpZW5kUmV2aWV3JywgJ3JhdGluZ3MudXBkYXRlZF9hdCcpO1xuICBcdHFiLndoZXJlKCd1c2Vycy51c2VybmFtZScsICc9JywgcmVxLnF1ZXJ5LmZyaWVuZE5hbWUpO1xuICBcdHFiLm9yZGVyQnkoJ3VwZGF0ZWRfYXQnLCAnREVTQycpXG4gIH0pXG4gIC5mZXRjaEFsbCgpXG4gIC50aGVuKGZ1bmN0aW9uKHJhdGluZ3Mpe1xuXHRcdC8vZGVjb3JhdGUgaXQgd2l0aCBjdXJyZW50IHVzZXIncyByYXRpbmdcblx0XHRyZXR1cm4gUHJvbWlzZS5tYXAocmF0aW5ncy5tb2RlbHMsIGZ1bmN0aW9uKHJhdGluZykge1xuXHRcdFx0cmV0dXJuIGF0dGFjaFVzZXJSYXRpbmcocmF0aW5nLCByZXEubXlTZXNzaW9uLnVzZXIpO1xuXHRcdH0pO1xuXHR9KVxuICAudGhlbihmdW5jdGlvbihyYXRpbmdzKSB7XG4gIFx0Y29uc29sZS5sb2coJ3JldHJpdmluZyBhbGwgdXNlciByYXRpbmdzJyk7XG4gIFx0cmVzLnN0YXR1cygyMDApLmpzb24ocmF0aW5ncyk7XG4gIH0pXG59O1xuXG4vL2EgZGVjb3JhdG9yIGZ1bmN0aW9uIHRoYXQgYXR0YWNoZXMgZnJpZW5kIGF2ZyByYXRpbmcgdG8gdGhlIHJhdGluZyBvYmpcbnZhciBhdHRhY2hGcmllbmRBdmdSYXRpbmcgPSBmdW5jdGlvbihyYXRpbmcsIHVzZXJuYW1lKSB7XG5cdHJldHVybiBleHBvcnRzLmdldEZyaWVuZFJhdGluZ3ModXNlcm5hbWUsIHJhdGluZylcblx0LnRoZW4oZnVuY3Rpb24oZnJpZW5kc1JhdGluZ3Mpe1xuXHRcdC8vaWYgZnJpZW5kc1JhdGluZ3MgaXMgbnVsbCwgUmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyBpcyBudWxsXG5cdFx0aWYgKCFmcmllbmRzUmF0aW5ncykge1xuXHRcdFx0cmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyA9IG51bGw7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgPSBhdmVyYWdlUmF0aW5nKGZyaWVuZHNSYXRpbmdzKTtcblx0XHR9XG5cdFx0cmV0dXJuIHJhdGluZztcblx0fSlcbn1cblxuLy9hIGRlY29yYXRvciBmdW5jdGlvbiB0aGF0IGF0dGFjaGVzIHVzZXIgcmF0aW5nIGFuZCByZXZpZXdzIHRvIHRoZSByYXRpbmcgb2JqXG52YXIgYXR0YWNoVXNlclJhdGluZyA9IGZ1bmN0aW9uKHJhdGluZywgdXNlcm5hbWUpIHtcblx0cmV0dXJuIFJhdGluZy5xdWVyeShmdW5jdGlvbihxYikge1xuXHRcdHFiLmlubmVySm9pbigndXNlcnMnLCAndXNlcnMuaWQnLCAnPScsICdyYXRpbmdzLnVzZXJpZCcpXG5cdFx0cWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAnbW92aWVzLmlkJywgJz0nLCAncmF0aW5ncy5tb3ZpZWlkJylcblx0XHRxYi5zZWxlY3QoJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnKVxuXHRcdHFiLndoZXJlKHtcblx0XHRcdCd1c2Vycy51c2VybmFtZSc6IHVzZXJuYW1lLFxuXHRcdFx0J21vdmllcy50aXRsZSc6IHJhdGluZy5hdHRyaWJ1dGVzLnRpdGxlLFxuXHRcdFx0J21vdmllcy5pZCc6IHJhdGluZy5hdHRyaWJ1dGVzLmlkXG5cdFx0fSlcblx0fSlcblx0LmZldGNoKClcblx0LnRoZW4oZnVuY3Rpb24odXNlclJhdGluZyl7XG5cdFx0aWYgKHVzZXJSYXRpbmcpIHtcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLnNjb3JlID0gdXNlclJhdGluZy5hdHRyaWJ1dGVzLnNjb3JlO1xuXHRcdFx0cmF0aW5nLmF0dHJpYnV0ZXMucmV2aWV3ID0gdXNlclJhdGluZy5hdHRyaWJ1dGVzLnJldmlldztcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmF0aW5nLmF0dHJpYnV0ZXMuc2NvcmUgPSBudWxsO1xuXHRcdFx0cmF0aW5nLmF0dHJpYnV0ZXMucmV2aWV3ID0gbnVsbDtcblx0XHR9XG5cdFx0cmV0dXJuIHJhdGluZztcblx0fSk7XG59O1xuXG4vL3RoaXMgaXMgYSB3cmFwZXIgZnVuY3Rpb24gZm9yIGdldEZyaWVuZFJhdGluZ3Mgd2hpY2ggd2lsbCBzZW50IHRoZSBjbGllbnQgYWxsIG9mIHRoZSBmcmllbmQgcmF0aW5nc1xuZXhwb3J0cy5oYW5kbGVHZXRGcmllbmRSYXRpbmdzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcblx0Y29uc29sZS5sb2coJ2hhbmRsZUdldEZyaWVuZFJhdGluZ3MsICcsIHJlcS5teVNlc3Npb24udXNlciwgcmVxLmJvZHkubW92aWUudGl0bGUpO1xuXHRleHBvcnRzLmdldEZyaWVuZFJhdGluZ3MocmVxLm15U2Vzc2lvbi51c2VyLCB7YXR0cmlidXRlczogcmVxLmJvZHkubW92aWV9KVxuXHQudGhlbihmdW5jdGlvbihmcmllbmRSYXRpbmdzKXtcblx0XHRyZXMuanNvbihmcmllbmRSYXRpbmdzKTtcblx0fSk7XG59XG5cbi8vdGhpcyBmdW5jdGlvbiBvdXRwdXRzIHJhdGluZ3Mgb2YgYSB1c2VyJ3MgZnJpZW5kIGZvciBhIHBhcnRpY3VsYXIgbW92aWVcbi8vZXhwZWN0IGN1cnJlbnQgdXNlcm5hbWUgYW5kIG1vdmllVGl0bGUgYXMgaW5wdXRcbi8vb3V0cHV0czoge3VzZXIyaWQ6ICdpZCcsIGZyaWVuZFVzZXJOYW1lOiduYW1lJywgZnJpZW5kRmlyc3ROYW1lOiduYW1lJywgdGl0bGU6J21vdmllVGl0bGUnLCBzY29yZTpuIH1cbmV4cG9ydHMuZ2V0RnJpZW5kUmF0aW5ncyA9IGZ1bmN0aW9uKHVzZXJuYW1lLCBtb3ZpZU9iaikge1xuXHRyZXR1cm4gVXNlci5xdWVyeShmdW5jdGlvbihxYil7XG5cdFx0cWIuaW5uZXJKb2luKCdyZWxhdGlvbnMnLCAncmVsYXRpb25zLnVzZXIxaWQnLCAnPScsICd1c2Vycy5pZCcpO1xuXHRcdHFiLmlubmVySm9pbigncmF0aW5ncycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3JlbGF0aW9ucy51c2VyMmlkJyk7XG5cdFx0cWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XG5cdFx0cWIuc2VsZWN0KCdyZWxhdGlvbnMudXNlcjJpZCcsICdtb3ZpZXMudGl0bGUnLCAncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycpO1xuXHRcdHFiLndoZXJlKHtcblx0XHRcdCd1c2Vycy51c2VybmFtZSc6IHVzZXJuYW1lLCBcblx0XHRcdCdtb3ZpZXMudGl0bGUnOiBtb3ZpZU9iai5hdHRyaWJ1dGVzLnRpdGxlLFxuXHRcdFx0J21vdmllcy5pZCc6IG1vdmllT2JqLmF0dHJpYnV0ZXMuaWQgfSk7XG5cdH0pXG5cdC5mZXRjaEFsbCgpXG5cdC50aGVuKGZ1bmN0aW9uKGZyaWVuZHNSYXRpbmdzKXtcblx0Ly90aGUgZm9sbG93aW5nIGJsb2NrIGFkZHMgdGhlIGZyaWVuZE5hbWUgYXR0cmlidXRlIHRvIHRoZSByYXRpbmdzXG5cdFx0cmV0dXJuIFByb21pc2UubWFwKGZyaWVuZHNSYXRpbmdzLm1vZGVscywgZnVuY3Rpb24oZnJpZW5kUmF0aW5nKSB7XG5cdFx0XHRyZXR1cm4gbmV3IFVzZXIoeyBpZDogZnJpZW5kUmF0aW5nLmF0dHJpYnV0ZXMudXNlcjJpZCB9KS5mZXRjaCgpXG5cdFx0XHQudGhlbihmdW5jdGlvbihmcmllbmQpe1xuXHRcdFx0XHRmcmllbmRSYXRpbmcuYXR0cmlidXRlcy5mcmllbmRVc2VyTmFtZSA9IGZyaWVuZC5hdHRyaWJ1dGVzLnVzZXJuYW1lO1xuXHRcdFx0XHRmcmllbmRSYXRpbmcuYXR0cmlidXRlcy5mcmllbmRGaXJzdE5hbWUgPSBmcmllbmQuYXR0cmlidXRlcy5maXJzdE5hbWU7XG5cdFx0XHRcdHJldHVybiBmcmllbmRSYXRpbmc7XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fSlcblx0LnRoZW4oZnVuY3Rpb24oZnJpZW5kc1JhdGluZ3Mpe1xuXHRcdHJldHVybiBmcmllbmRzUmF0aW5ncztcblx0fSk7XG59O1xuXG5cbi8vYSBoZWxwZXIgZnVuY3Rpb24gdGhhdCBhdmVyYWdlcyB0aGUgcmF0aW5nXG4vL2lucHV0cyByYXRpbmdzLCBvdXRwdXRzIHRoZSBhdmVyYWdlIHNjb3JlO1xudmFyIGF2ZXJhZ2VSYXRpbmcgPSBmdW5jdGlvbihyYXRpbmdzKSB7XG5cdC8vcmV0dXJuIG51bGwgaWYgbm8gZnJpZW5kIGhhcyByYXRlZCB0aGUgbW92aWVcblx0aWYgKHJhdGluZ3MubGVuZ3RoID09PSAwKSB7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0cmV0dXJuIHJhdGluZ3Ncblx0LnJlZHVjZShmdW5jdGlvbih0b3RhbCwgcmF0aW5nKXtcblx0XHRyZXR1cm4gdG90YWwgKz0gcmF0aW5nLmF0dHJpYnV0ZXMuc2NvcmU7XG5cdH0sIDApIC8gcmF0aW5ncy5sZW5ndGg7XG59XG5cblxuLy9hIGhlbHBlciBmdW5jdGlvbiB0aGF0IG91dHB1dHMgdXNlciByYXRpbmcgYW5kIGF2ZXJhZ2UgZnJpZW5kIHJhdGluZyBmb3Igb25lIG1vdmllXG4vL291dHB1dHMgb25lIHJhdGluZyBvYmo6IHt0aXRsZTogJ25hbWUnLCBnZW5yZTogJ2dlbnJlJyAsIHBvc3RlcjogJ3VybCcsIHJlbGVhc2VfZGF0ZTogJ2RhdGUnLCBzY29yZTogbiwgZnJpZW5kQXZlcmFnZVJhdGluZzogbn1cbnZhciBnZXRPbmVNb3ZpZVJhdGluZyA9IGZ1bmN0aW9uKHVzZXJuYW1lLCBtb3ZpZU9iaikge1xuICByZXR1cm4gUmF0aW5nLnF1ZXJ5KGZ1bmN0aW9uKHFiKXtcbiAgXHRxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcbiAgXHRxYi5pbm5lckpvaW4oJ21vdmllcycsICdyYXRpbmdzLm1vdmllaWQnLCAnPScsICdtb3ZpZXMuaWQnKTtcbiAgXHRxYi5zZWxlY3QoJ3VzZXJzLnVzZXJuYW1lJywgJ21vdmllcy50aXRsZScsICdtb3ZpZXMuaWQnLCAnbW92aWVzLmdlbnJlJywgJ21vdmllcy5wb3N0ZXInLCAnbW92aWVzLnJlbGVhc2VfZGF0ZScsICdtb3ZpZXMuaW1kYlJhdGluZycsICdtb3ZpZXMuZGVzY3JpcHRpb24nLCAncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycpO1xuICBcdHFiLndoZXJlKHsndXNlcnMudXNlcm5hbWUnOiB1c2VybmFtZSwgJ21vdmllcy50aXRsZSc6IG1vdmllT2JqLnRpdGxlLCAnbW92aWVzLmlkJzogbW92aWVPYmouaWR9KTtcbiAgfSlcbiAgLmZldGNoKClcbiAgLnRoZW4oZnVuY3Rpb24ocmF0aW5nKXtcblx0ICBpZiAoIXJhdGluZykge1xuXHQgIFx0Ly9pZiB0aGUgdXNlciBoYXMgbm90IHJhdGVkIHRoZSBtb3ZpZSwgcmV0dXJuIGFuIG9iaiB0aGF0IGhhcyB0aGUgbW92aWUgaW5mb3JtYXRpb24sIGJ1dCBzY29yZSBpcyBzZXQgdG8gbnVsbFxuXHQgIFx0cmV0dXJuIG5ldyBNb3ZpZSh7dGl0bGU6IG1vdmllT2JqLnRpdGxlLCBpZDogbW92aWVPYmouaWR9KS5mZXRjaCgpXG5cdCAgXHQudGhlbihmdW5jdGlvbihtb3ZpZSkge1xuXHQgIFx0XHRtb3ZpZS5hdHRyaWJ1dGVzLnNjb3JlID0gbnVsbDtcblx0ICBcdFx0cmV0dXJuIG1vdmllO1xuXHQgIFx0fSlcblx0ICB9IGVsc2Uge1xuXHQgIFx0cmV0dXJuIHJhdGluZztcblx0ICB9XG5cdH0pXG5cdC50aGVuKGZ1bmN0aW9uKHJhdGluZyl7XG5cdFx0cmV0dXJuIGV4cG9ydHMuZ2V0RnJpZW5kUmF0aW5ncyh1c2VybmFtZSwgcmF0aW5nKVxuXHRcdC50aGVuKGZ1bmN0aW9uKGZyaWVuZHNSYXRpbmdzKXtcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdmcmllbmRzUmF0aW5ncycsIGZyaWVuZHNSYXRpbmdzKTtcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgPSBhdmVyYWdlUmF0aW5nKGZyaWVuZHNSYXRpbmdzKTtcblx0XHRcdGNvbnNvbGUubG9nKCdhZGRlZCBhdmVyYWdlIGZyaWVuZCByYXRpbmcnLCByYXRpbmcuYXR0cmlidXRlcy50aXRsZSwgcmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyk7XG5cdFx0XHRyZXR1cm4gcmF0aW5nO1xuXHRcdH0pO1xuXHR9KTtcbn1cblxuXG4vL3RoaXMgaGFuZGxlciBpcyBzcGVjaWZpY2FsbHkgZm9yIHNlbmRpbmcgb3V0IGEgbGlzdCBvZiBtb3ZpZSByYXRpbmdzIHdoZW4gdGhlIGNsaWVudCBzZW5kcyBhIGxpc3Qgb2YgbW92aWUgdG8gdGhlIHNlcnZlclxuLy9leHBlY3RzIHJlcS5ib2R5IHRvIGJlIGFuIGFycmF5IG9mIG9iaiB3aXRoIHRoZXNlIGF0dHJpYnV0ZXM6IHtpZCwgdGl0bGUsIGdlbnJlLCBwb3N0ZXJfcGF0aCwgcmVsZWFzZV9kYXRlLCBvdmVydmlldywgdm90ZV9hdmVyYWdlfVxuLy9vdXRwdXRzIFsge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnICwgcG9zdGVyOiAndXJsJywgcmVsZWFzZV9kYXRlOiAnZGF0ZScsIHNjb3JlOiBuLCBmcmllbmRBdmVyYWdlUmF0aW5nOiBufSAuLi4gXVxuZXhwb3J0cy5nZXRNdWx0aXBsZU1vdmllUmF0aW5ncyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cdGNvbnNvbGUubG9nKCdnZXRNdWx0aXBsZU1vdmllUmF0aW5ncycpO1xuXHRQcm9taXNlLm1hcChyZXEuYm9keS5tb3ZpZXMsIGZ1bmN0aW9uKG1vdmllKSB7XG5cdFx0Ly9maXJzdCBjaGVjayB3aGV0aGVyIG1vdmllIGlzIGluIHRoZSBkYXRhYmFzZVxuXHRcdHJldHVybiBuZXcgTW92aWUoe3RpdGxlOiBtb3ZpZS50aXRsZSwgaWQ6IG1vdmllLmlkfSkuZmV0Y2goKVxuXHRcdC50aGVuKGZ1bmN0aW9uKGZvdW5kTW92aWUpIHtcblx0XHRcdC8vaWYgbm90IGNyZWF0ZSBvbmVcblx0XHRcdGlmICghZm91bmRNb3ZpZSkge1xuXHRcdFx0XHRyZXR1cm4gYWRkT25lTW92aWUobW92aWUpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGZvdW5kTW92aWU7XG5cdFx0XHR9XG5cdFx0fSlcblx0XHQudGhlbihmdW5jdGlvbihmb3VuZE1vdmllKXtcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdmb3VuZCBtb3ZpZScsIGZvdW5kTW92aWUpO1xuXHRcdFx0cmV0dXJuIGdldE9uZU1vdmllUmF0aW5nKHJlcS5teVNlc3Npb24udXNlciwgZm91bmRNb3ZpZS5hdHRyaWJ1dGVzKTtcblx0XHR9KVxuXHR9KVxuXHQudGhlbihmdW5jdGlvbihyYXRpbmdzKXtcblx0XHRjb25zb2xlLmxvZygnc2VuZGluZyByYXRpbmcgdG8gY2xpZW50Jyk7XG5cdFx0cmVzLmpzb24ocmF0aW5ncyk7XG5cdH0pXG59XG5cbi8vdGhpcyBoYW5kbGVyIHNlbmRzIGFuIGdldCByZXF1ZXN0IHRvIFRNREIgQVBJIHRvIHJldHJpdmUgcmVjZW50IHRpdGxlc1xuLy93ZSBjYW5ub3QgZG8gaXQgaW4gdGhlIGZyb250IGVuZCBiZWNhdXNlIGNyb3NzIG9yaWdpbiByZXF1ZXN0IGlzc3Vlc1xuZXhwb3J0cy5nZXRSZWNlbnRSZWxlYXNlID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgdmFyIHBhcmFtcyA9IHtcbiAgICBhcGlfa2V5OiAnOWQzYjAzNWVmMWNkNjY5YWVkMzk4NDAwYjE3ZmNlYTInLFxuICAgIHByaW1hcnlfcmVsZWFzZV95ZWFyOiBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCksXG4gICAgaW5jbHVkZV9hZHVsdDogZmFsc2UsXG4gICAgc29ydF9ieTogJ3BvcHVsYXJpdHkuZGVzYydcbiAgfTtcblxuXHQgXG4gIHZhciBkYXRhID0gJyc7XG5cdHJlcXVlc3Qoe1xuXHRcdG1ldGhvZDogJ0dFVCcsXG5cdFx0dXJsOiAnaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy9kaXNjb3Zlci9tb3ZpZS8nLFxuXHRcdHFzOiBwYXJhbXNcblx0fSlcblx0Lm9uKCdkYXRhJyxmdW5jdGlvbihjaHVuayl7XG5cdFx0ZGF0YSArPSBjaHVuaztcblx0fSlcblx0Lm9uKCdlbmQnLCBmdW5jdGlvbigpe1xuXHRcdHJlY2VudE1vdmllcyA9IEpTT04ucGFyc2UoZGF0YSk7XG4gICAgcmVxLmJvZHkubW92aWVzID0gcmVjZW50TW92aWVzLnJlc3VsdHM7XG4gICAgLy90cmFuc2ZlcnMgdGhlIG1vdmllIGRhdGEgdG8gZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MgdG8gZGVjb3JhdGUgd2l0aCBzY29yZSAodXNlciByYXRpbmcpIGFuZCBhdmdmcmllbmRSYXRpbmcgYXR0cmlidXRlXG4gICAgZXhwb3J0cy5nZXRNdWx0aXBsZU1vdmllUmF0aW5ncyhyZXEsIHJlcyk7XG5cblx0fSlcblx0Lm9uKCdlcnJvcicsIGZ1bmN0aW9uKGVycm9yKXtcblx0XHRjb25zb2xlLmxvZyhlcnJvcik7XG5cdH0pXG5cbn1cblxuLy90aGlzIGlzIFRNREIncyBnZW5yZSBjb2RlLCB3ZSBtaWdodCB3YW50IHRvIHBsYWNlIHRoaXMgc29tZXdoZXJlIGVsc2VcbnZhciBnZW5yZXMgPSB7XG4gICAxMjogXCJBZHZlbnR1cmVcIixcbiAgIDE0OiBcIkZhbnRhc3lcIixcbiAgIDE2OiBcIkFuaW1hdGlvblwiLFxuICAgMTg6IFwiRHJhbWFcIixcbiAgIDI3OiBcIkhvcnJvclwiLFxuICAgMjg6IFwiQWN0aW9uXCIsXG4gICAzNTogXCJDb21lZHlcIixcbiAgIDM2OiBcIkhpc3RvcnlcIixcbiAgIDM3OiBcIldlc3Rlcm5cIixcbiAgIDUzOiBcIlRocmlsbGVyXCIsXG4gICA4MDogXCJDcmltZVwiLFxuICAgOTk6IFwiRG9jdW1lbnRhcnlcIixcbiAgIDg3ODogXCJTY2llbmNlIEZpY3Rpb25cIixcbiAgIDk2NDg6IFwiTXlzdGVyeVwiLFxuICAgMTA0MDI6IFwiTXVzaWNcIixcbiAgIDEwNzQ5OiBcIlJvbWFuY2VcIixcbiAgIDEwNzUxOiBcIkZhbWlseVwiLFxuICAgMTA3NTI6IFwiV2FyXCIsXG4gICAxMDc2OTogXCJGb3JlaWduXCIsXG4gICAxMDc3MDogXCJUViBNb3ZpZVwiXG4gfTtcblxuLy90aGlzIGZ1bmN0aW9uIHdpbGwgc2VuZCBiYWNrIHNlYXJjYiBtb3ZpZXMgdXNlciBoYXMgcmF0ZWQgaW4gdGhlIGRhdGFiYXNlXG4vL2l0IHdpbGwgc2VuZCBiYWNrIG1vdmllIG9ianMgdGhhdCBtYXRjaCB0aGUgc2VhcmNoIGlucHV0LCBleHBlY3RzIG1vdmllIG5hbWUgaW4gcmVxLmJvZHkudGl0bGVcbmV4cG9ydHMuc2VhcmNoUmF0ZWRNb3ZpZSA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIHJldHVybiBSYXRpbmcucXVlcnkoZnVuY3Rpb24ocWIpe1xuXHRcdHFiLmlubmVySm9pbigndXNlcnMnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICd1c2Vycy5pZCcpO1xuXHRcdHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xuXHRcdHFiLnNlbGVjdCgndXNlcnMudXNlcm5hbWUnLCAnbW92aWVzLnRpdGxlJywgJ21vdmllcy5pZCcsICdtb3ZpZXMuZ2VucmUnLCAnbW92aWVzLnBvc3RlcicsICdtb3ZpZXMucmVsZWFzZV9kYXRlJywgJ21vdmllcy5pbWRiUmF0aW5nJywgJ21vdmllcy5kZXNjcmlwdGlvbicsICdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3Jyk7XG4gIFx0cWIud2hlcmVSYXcoYE1BVENIIChtb3ZpZXMudGl0bGUpIEFHQUlOU1QgKCcke3JlcS5xdWVyeS50aXRsZX0nIElOIE5BVFVSQUwgTEFOR1VBR0UgTU9ERSlgKVxuICBcdHFiLmFuZFdoZXJlKCd1c2Vycy51c2VybmFtZScsICc9JywgcmVxLm15U2Vzc2lvbi51c2VyKVxuICBcdHFiLm9yZGVyQnkoJ3VwZGF0ZWRfYXQnLCAnREVTQycpXG4gIH0pXG4gIC5mZXRjaEFsbCgpXG4gIC50aGVuKGZ1bmN0aW9uKG1hdGNoZXMpe1xuICBcdGNvbnNvbGUubG9nKG1hdGNoZXMubW9kZWxzKTtcbiAgXHRyZXMuanNvbihtYXRjaGVzKTtcbiAgfSlcbn1cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vL2ZyaWVuZHNoaXAgaGFuZGxlcnNcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5leHBvcnRzLmdldEZyaWVuZExpc3QgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXHRyZXR1cm4gUmVsYXRpb24ucXVlcnkoZnVuY3Rpb24ocWIpe1xuXHRcdHFiLmlubmVySm9pbigndXNlcnMnLCAncmVsYXRpb25zLnVzZXIxaWQnLCAnPScsICd1c2Vycy5pZCcpO1xuXHRcdHFiLnNlbGVjdCgncmVsYXRpb25zLnVzZXIyaWQnKTtcblx0XHRxYi53aGVyZSh7XG5cdFx0XHQndXNlcnMudXNlcm5hbWUnOiByZXEubXlTZXNzaW9uLnVzZXJcblx0XHR9KVxuXHR9KVxuXHQuZmV0Y2hBbGwoKVxuXHQudGhlbihmdW5jdGlvbihmcmllbmRzKXtcblx0XHRyZXR1cm4gUHJvbWlzZS5tYXAoZnJpZW5kcy5tb2RlbHMsIGZ1bmN0aW9uKGZyaWVuZCkge1xuXHRcdFx0cmV0dXJuIG5ldyBVc2VyKHtpZDogZnJpZW5kLmF0dHJpYnV0ZXMudXNlcjJpZH0pLmZldGNoKClcblx0XHRcdC50aGVuKGZ1bmN0aW9uKGZyaWVuZFVzZXIpe1xuXHRcdFx0XHRyZXR1cm4gZnJpZW5kVXNlci5hdHRyaWJ1dGVzLnVzZXJuYW1lO1xuXHRcdFx0fSlcblx0XHR9KVxuXHR9KVxuXHQudGhlbihmdW5jdGlvbihmcmllbmRzKXtcblx0XHRjb25zb2xlLmxvZygnc2VuZGluZyBhIGxpc3Qgb2YgZnJpZW5kIG5hbWVzJywgZnJpZW5kcyk7XG5cdFx0cmVzLmpzb24oZnJpZW5kcyk7XG5cdH0pXG59XG5cbi8vdGhpcyB3b3VsZCBzZW5kIGEgbm90aWNlIHRvIHRoZSB1c2VyIHdobyByZWNlaXZlIHRoZSBmcmllbmQgcmVxdWVzdCwgcHJvbXB0aW5nIHRoZW0gdG8gYWNjZXB0IG9yIGRlbnkgdGhlIHJlcXVlc3RcbmV4cG9ydHMuYWRkRnJpZW5kID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcblxufTtcblxuXG4vL3RoaXMgd291bGQgY29uZmlybSB0aGUgZnJpZW5kc2hpcCBhbmQgZXN0YWJsaXNoIHRoZSByZWxhdGlvbnNoaXAgaW4gdGhlIGRhdGFiYXNlXG5leHBvcnRzLmNvbmZpcm1GcmllbmRzaGlwID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcblxufTtcblxuXG5cbmV4cG9ydHMuZ2V0RnJpZW5kcyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIHZhciBwZW9wbGVJZCA9IFtdO1xuICB2YXIgaWQgPSByZXEubXlTZXNzaW9uLnVzZXJcbiAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCBpZCwgZnVuY3Rpb24oZXJyLCByZXNwKSB7XG4gICAgdmFyIHVzZXJpZCA9IHJlc3BbMF0uaWQ7XG4gICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGJlIGxpbmcvMicsaWQpXG4gIFxuICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByYXRpbmdzIFdIRVJFIHVzZXJpZCA9ID8nLCB1c2VyaWQsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xuICAgICAgdmFyIHVzZXJzUmF0aW5ncz1yZXNwLm1hcChmdW5jdGlvbihhKXsgcmV0dXJuIFthLm1vdmllaWQsIGEuc2NvcmVdfSk7XG5cbiAgICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByZWxhdGlvbnMgV0hFUkUgdXNlcjFpZCA9ID8nLCB1c2VyaWQsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3AubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAocGVvcGxlSWQuaW5kZXhPZihyZXNwW2ldLnVzZXIyaWQpID09PSAtMSkge1xuICAgICAgICAgICAgcGVvcGxlSWQucHVzaChyZXNwW2ldLnVzZXIyaWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgcGVvcGxlID0gW11cbiAgICAgICAgY29uc29sZS5sb2coJ1RoaXMgc2hvdWxkIGFsc28gYmUgcGVvcGxlZWUnLHBlb3BsZUlkKTtcbiAgICAgICAgdmFyIGtleUlkPXt9O1xuICAgICAgICBwZW9wbGVJZC5mb3JFYWNoKGZ1bmN0aW9uKGEpIHtcblxuICAgICAgICAgIGNvbi5xdWVyeSgnU0VMRUNUIHVzZXJuYW1lIEZST00gdXNlcnMgV0hFUkUgaWQgPSA/JywgYSwgZnVuY3Rpb24oZXJyLCByZXNwbykge1xuICBcdCAgICAgICAga2V5SWRbYV09cmVzcG9bMF0udXNlcm5hbWU7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygndGhpcyBpcyBPTkUgb2YgdGhlIHBlb3BsZSEhJyxyZXNwb1swXS51c2VybmFtZSlcbiAgICAgICAgICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByYXRpbmdzIFdIRVJFIHVzZXJpZCA9JysnXCInK2ErJ1wiJywgZnVuY3Rpb24oZXJyLCByZSkge1xuICAgICAgXHQgICAgICBjb25zb2xlLmxvZygndGhpcyBpcyBhJyxhKVxuICAgICAgXHQgICAgICBpZiAocmUubGVuZ3RoPT09MCl7XG4gICAgICBcdFx0ICAgICAgcmU9W3t1c2VyaWQ6YSxtb3ZpZWlkOk1hdGgucm91bmQoTWF0aC5yYW5kb20oKSoxMDAwMCksc2NvcmU6OTl9XVxuICAgICAgXHQgICAgICB9XG4gICAgICBcdCAgICAgIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBiZSB0aGUgcmF0aW5ncyBmcm9tIGVhY2ggcGVyc29uISEnLHJlKTtcblxuICAgICAgICAgICAgICBwZW9wbGUucHVzaChyZS5tYXAoZnVuY3Rpb24oYSl7cmV0dXJuIFthLnVzZXJpZCxhLm1vdmllaWQsYS5zY29yZV07fSkpO1xuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgaWYgKHBlb3BsZS5sZW5ndGg9PT1wZW9wbGVJZC5sZW5ndGgpe1xuICAgICAgICAgICAgICAgIHZhciBmaW5hbCA9IHt9O1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGJlIHBlb3BsZScsIHBlb3BsZSk7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwZW9wbGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgIGlmIChwZW9wbGVbaV1bMF0hPT11bmRlZmluZWQpe1xuICAgICAgICAgICAgICAgICAgICBmaW5hbFtrZXlJZFtwZW9wbGVbaV1bMF1bMF1dXSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBlb3BsZVtpXS5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICAgIGZpbmFsW2tleUlkW3Blb3BsZVtpXVswXVswXV1dLnB1c2goW10pO1xuICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHogPSAxOyB6IDwgcGVvcGxlW2ldW3hdLmxlbmd0aDsgeisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5hbFtrZXlJZFtwZW9wbGVbaV1bMF1bMF1dXVt4XS5wdXNoKHBlb3BsZVtpXVt4XVt6XSlcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZmluYWwnLGZpbmFsLHVzZXJzUmF0aW5ncyk7XG5cbiAgICAgICAgICAgICAgICB2YXIgY29tcGFyaXNvbnM9e307XG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGZpbmFsKXtcbiAgICAgICAgICAgICAgICAgIGNvbXBhcmlzb25zW2tleV09Y29tcCh1c2Vyc1JhdGluZ3MsZmluYWxba2V5XSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY29tcGFyaXNvbnMpO1xuICAgICAgICAgICAgICAgIHZlcnlGaW5hbD1bXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gY29tcGFyaXNvbnMpe1xuICAgICAgICAgICAgICAgICAgdmVyeUZpbmFsLnB1c2goW2tleSxjb21wYXJpc29uc1trZXldXSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codmVyeUZpbmFsKTtcbiAgICAgICAgICAgICAgICByZXMuc2VuZCh2ZXJ5RmluYWwpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICB9KVxuICB9KVxufTtcblxuXG5cbi8vVEJEXG5leHBvcnRzLmdldEhpZ2hDb21wYXRpYmlsaXR5VXNlcnMgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICBcbn07XG5cblxuLy9UQkRcbmV4cG9ydHMuZ2V0UmVjb21tZW5kZWRNb3ZpZXMgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXG59OyJdfQ==
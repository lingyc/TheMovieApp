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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9yZXF1ZXN0LWhhbmRsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQSxJQUFJLFNBQVEsU0FBUixNQUFRLENBQVMsSUFBVCxFQUFjLElBQWQsRUFBbUI7QUFDL0IsTUFBSSxPQUFLLEtBQUssR0FBTCxDQUFTLE9BQUssSUFBZCxDQUFUO0FBQ0EsU0FBTyxJQUFFLElBQVQ7QUFDQyxDQUhEOztBQUtBLElBQUksT0FBTyxTQUFQLElBQU8sQ0FBUyxLQUFULEVBQWdCLE1BQWhCLEVBQXdCO0FBQ25DLE1BQUksUUFBTyxFQUFYO0FBQ0UsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFHLE1BQU0sTUFBekIsRUFBaUMsR0FBakMsRUFBc0M7O0FBRXBDLFNBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxPQUFPLE1BQTNCLEVBQW1DLEdBQW5DLEVBQXdDOztBQUV0QyxVQUFJLE1BQU0sQ0FBTixFQUFTLENBQVQsTUFBZ0IsT0FBTyxDQUFQLEVBQVUsQ0FBVixDQUFwQixFQUFrQzs7QUFFcEMsY0FBTSxJQUFOLENBQVcsT0FBTyxNQUFNLENBQU4sRUFBUyxDQUFULENBQVAsRUFBbUIsT0FBTyxDQUFQLEVBQVUsQ0FBVixDQUFuQixDQUFYO0FBRUc7QUFDRjtBQUNGO0FBQ0gsTUFBSSxNQUFLLE1BQU0sTUFBTixDQUFhLFVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYTtBQUFDLFdBQU8sSUFBRSxDQUFUO0FBQVcsR0FBdEMsRUFBdUMsQ0FBdkMsQ0FBVDtBQUNBLFNBQU8sS0FBSyxLQUFMLENBQVcsS0FBRyxHQUFILEdBQU8sTUFBTSxNQUF4QixDQUFQO0FBQ0MsQ0FmRDs7Ozs7QUF3QkEsSUFBSSxLQUFLLFFBQVEscUJBQVIsQ0FBVDtBQUNBLElBQUksUUFBUSxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUksVUFBVSxRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQUksUUFBUSxRQUFRLHFCQUFSLENBQVo7QUFDQSxJQUFJLFNB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REQ7QUF5REQsS0E1REQ7QUE2REQsR0FqRUQ7QUFrRUQsQ0FyRUQ7OztBQTBFQSxRQUFRLHlCQUFSLEdBQW9DLFVBQVMsR0FBVCxFQUFjLEdBQWQsRUFBbUIsQ0FFdEQsQ0FGRDs7O0FBTUEsUUFBUSxvQkFBUixHQUErQixVQUFTLEdBQVQsRUFBYyxHQUFkLEVBQW1CLENBRWpELENBRkQiLCJmaWxlIjoicmVxdWVzdC1oYW5kbGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vLy8vLy8vLy8vLy9UaGUgYWxnb3JpdGhtXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbnZhciBoZWxwZXI9IGZ1bmN0aW9uKG51bTEsbnVtMil7XG52YXIgZGlmZj1NYXRoLmFicyhudW0xLW51bTIpO1xucmV0dXJuIDUtZGlmZjtcbn1cblxudmFyIGNvbXAgPSBmdW5jdGlvbihmaXJzdCwgc2Vjb25kKSB7XG52YXIgZmluYWw9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpPCBmaXJzdC5sZW5ndGg7IGkrKykge1xuXG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCBzZWNvbmQubGVuZ3RoOyB4KyspIHtcblxuICAgICAgaWYgKGZpcnN0W2ldWzBdID09PSBzZWNvbmRbeF1bMF0pIHtcblxuICAgIGZpbmFsLnB1c2goaGVscGVyKGZpcnN0W2ldWzFdLHNlY29uZFt4XVsxXSkpXG5cbiAgICAgIH1cbiAgICB9XG4gIH1cbnZhciBzdW09IGZpbmFsLnJlZHVjZShmdW5jdGlvbihhLGIpe3JldHVybiBhK2J9LDApO1xucmV0dXJuIE1hdGgucm91bmQoMjAqc3VtL2ZpbmFsLmxlbmd0aClcbn1cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG5cblxuXG5cbnZhciBkYiA9IHJlcXVpcmUoJy4uL2FwcC9kYkNvbm5lY3Rpb24nKTtcbnZhciBteXNxbCA9IHJlcXVpcmUoJ215c3FsJyk7XG52YXIgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcbnZhciBNb3ZpZSA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvbW92aWUnKTtcbnZhciBSYXRpbmcgPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL3JhdGluZycpO1xudmFyIFJlbGF0aW9uID0gcmVxdWlyZSgnLi4vYXBwL21vZGVscy9yZWxhdGlvbicpO1xudmFyIFVzZXIgPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL3VzZXInKTtcbnZhciBhbGxSZXF1ZXN0ID0gcmVxdWlyZSgnLi4vYXBwL21vZGVscy9hbGxSZXF1ZXN0Jyk7XG5cbnZhciBNb3ZpZXMgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvbW92aWVzJyk7XG52YXIgUmF0aW5ncyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy9yYXRpbmdzJyk7XG52YXIgUmVsYXRpb25zID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL3JlbGF0aW9ucycpO1xudmFyIFVzZXJzID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL3VzZXJzJyk7XG52YXIgYWxsUmVxdWVzdHMgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvYWxsUmVxdWVzdHMnKTtcblxudmFyIFByb21pc2UgPSByZXF1aXJlKFwiYmx1ZWJpcmRcIik7XG52YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QnKTtcblxuLy8gdmFyIGNvbiA9IG15c3FsLmNyZWF0ZUNvbm5lY3Rpb24oe1xuLy8gICBob3N0OiBcImxvY2FsaG9zdFwiLFxuLy8gICB1c2VyOiBcInJvb3RcIixcbi8vICAgcGFzc3dvcmQ6IFwiMTIzXCIsXG4vLyAgIGRhdGFiYXNlOiBcIk1haW5EYXRhYmFzZVwiXG4vLyB9KTtcblxudmFyIGNvbiA9IG15c3FsLmNyZWF0ZUNvbm5lY3Rpb24oe1xuICBob3N0ICAgICA6ICd1cy1jZGJyLWlyb24tZWFzdC0wNC5jbGVhcmRiLm5ldCcsXG4gIHVzZXIgICAgIDogJ2IwMzkxNmU3NTBlODFkJyxcbiAgcGFzc3dvcmQgOiAnYmVmNGY3NzUnLFxuICBkYXRhYmFzZSA6ICdoZXJva3VfOTE5YmNjODAwNWJmZDRjJ1xufSk7XG5cbmNvbi5jb25uZWN0KGZ1bmN0aW9uKGVycil7XG4gIGlmKGVycil7XG4gICAgY29uc29sZS5sb2coJ0Vycm9yIGNvbm5lY3RpbmcgdG8gRGInKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc29sZS5sb2coJ0Nvbm5lY3Rpb24gZXN0YWJsaXNoZWQnKTtcbn0pO1xuXG4vLy8vLy8vLy8vLy8vLy8vL1xuLy8vL3VzZXIgYXV0aFxuLy8vLy8vLy8vLy8vLy8vLy9cblxuZXhwb3J0cy5zaWdudXBVc2VyID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcblx0Y29uc29sZS5sb2coJ2NhbGxpbmcgbG9naW4nLCByZXEuYm9keSk7XG5cdC8vIGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBzZXNzaW9uJyxyZXEuc2Vzc2lvbilcbiAgbmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLmJvZHkubmFtZSB9KS5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oZm91bmQpIHtcblx0ICBpZiAoZm91bmQpIHtcblx0ICBcdC8vY2hlY2sgcGFzc3dvcmRcblx0ICBcdCAgIC8vaWYgKHBhc3N3b3JkIG1hdGNoZXMpXG5cdCAgXHQgICAvL3sgYWRkIHNlc3Npb25zIGFuZCByZWRpcmVjdH1cblx0ICBcdGNvbnNvbGUubG9nKCd1c2VybmFtZSBhbHJlYWR5IGV4aXN0LCBjYW5ub3Qgc2lnbnVwICcsIHJlcS5ib2R5Lm5hbWUpO1xuXHQgICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoJ3VzZXJuYW1lIGV4aXN0Jyk7XG5cdCAgfSBlbHNlIHtcblx0ICBcdGNvbnNvbGUubG9nKCdjcmVhdGluZyB1c2VyJyk7XG4gICAgICByZXEubXlTZXNzaW9uLnVzZXIgPSByZXEuYm9keS5uYW1lO1xuXHQgICAgVXNlcnMuY3JlYXRlKHtcblx0ICAgICAgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUsXG5cdCAgICAgIHBhc3N3b3JkOiByZXEuYm9keS5wYXNzd29yZCxcblx0ICAgIH0pXG5cdCAgICAudGhlbihmdW5jdGlvbih1c2VyKSB7XG5cdFx0ICBcdGNvbnNvbGUubG9nKCdjcmVhdGVkIGEgbmV3IHVzZXInKTtcblx0ICAgICAgcmVzLnN0YXR1cygyMDEpLnNlbmQoJ2xvZ2luIGNyZWF0ZWQnKTtcblx0ICAgIH0pO1xuXHQgIH1cblx0fSk7XG59O1xuXG5cbmV4cG9ydHMuc2VuZFdhdGNoUmVxdWVzdCA9IGZ1bmN0aW9uKHJlcSwgcmVzcG9uc2UpIHtcblx0Y29uc29sZS5sb2cocmVxLmJvZHkucmVxdWVzdGVlKVxuXHRpZiAoQXJyYXkuaXNBcnJheShyZXEuYm9keS5yZXF1ZXN0ZWUpKSB7XG5cdFx0dmFyIHJlcXVlc3RlZXMgPSByZXEuYm9keS5yZXF1ZXN0ZWU7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIHJlcXVlc3RlZXMgPSBbcmVxLmJvZHkucmVxdWVzdGVlXTtcblx0fVxuXHRQcm9taXNlLmVhY2gocmVxdWVzdGVlcywgZnVuY3Rpb24ocmVxdWVzdGVlKXtcblx0XHR2YXIgcmVxdWVzdCA9IHtcbiAgICAgIG1lc3NhZ2U6IHJlcS5ib2R5Lm1lc3NhZ2UsXG5cdFx0XHRyZXF1ZXN0b3I6IHJlcS5teVNlc3Npb24udXNlciwgXG5cdFx0XHRyZXF1ZXN0VHlwOid3YXRjaCcsXG5cdFx0XHRtb3ZpZTpyZXEuYm9keS5tb3ZpZSxcblx0XHRcdHJlcXVlc3RlZTogcmVxdWVzdGVlXG5cdFx0fTtcblx0XHRjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIGFsbHJlcXVlc3RzIFNFVCA/JywgcmVxdWVzdCwgZnVuY3Rpb24oZXJyLHJlcyl7XG5cdFx0ICBpZihlcnIpIHRocm93IGVycjtcblx0XHQgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xuXHRcdH0pO1xuXHR9KVxuXHQudGhlbihmdW5jdGlvbihkb25lKXtcblx0XHRyZXNwb25zZS5zZW5kKCdUaGF0cyBteSBzdHlsZSEnKTtcblx0fSlcbn1cblxuZXhwb3J0cy5yZW1vdmVXYXRjaFJlcXVlc3QgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICBpZiAoQXJyYXkuaXNBcnJheShyZXEuYm9keS5yZXF1ZXN0ZWUpKSB7XG4gICAgdmFyIHJlcXVlc3RlZXMgPSByZXEuYm9keS5yZXF1ZXN0ZWU7XG4gIH0gZWxzZSB7XG4gICAgdmFyIHJlcXVlc3RlZXMgPSBbcmVxLmJvZHkucmVxdWVzdGVlXTtcbiAgfVxuICB2YXIgcmVxdWVzdG9yPXJlcS5ib2R5LnJlcXVlc3RvcjtcbiAgdmFyIG1vdmllID0gcmVxLmJvZHkubW92aWU7XG5cbiAgYWxsUmVxdWVzdC5mb3JnZSh7cmVxdWVzdG9yOiByZXF1ZXN0b3IsIHJlcXVlc3RlZTogcmVxdWVzdGVlcywgbW92aWU6IG1vdmllIH0pXG4gICAgLmZldGNoKCkudGhlbihmdW5jdGlvbihhbGxSZXF1ZXN0KSB7XG4gICAgICBhbGxSZXF1ZXN0LmRlc3Ryb3koKVxuICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXMuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiAnVXNlciBzdWNjZXNzZnVsbHkgZGVsZXRlZCd9fSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcbiAgICAgICAgfSk7XG4gICAgfSlcbiAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcbiAgICB9KTtcbn07XG5cblxuZXhwb3J0cy5zZW5kUmVxdWVzdCA9IGZ1bmN0aW9uKHJlcSwgcmVzcG9uc2UpIHtcbiAgY29uc29sZS5sb2coJ3RoaXMgaXMgd2hhdCBJbSBnZXR0aW5nJywgcmVxLmJvZHkpO1xuICBpZiAocmVxLm15U2Vzc2lvbi51c2VyPT09cmVxLmJvZHkubmFtZSl7XG4gICAgcmVzcG9uc2Uuc2VuZChcIllvdSBjYW4ndCBmcmllbmQgeW91cnNlbGYhXCIpXG4gIH0gZWxzZSB7XG5cbnZhciByZXF1ZXN0ID0ge3JlcXVlc3RvcjogcmVxLm15U2Vzc2lvbi51c2VyLCByZXF1ZXN0ZWU6IHJlcS5ib2R5Lm5hbWUsIHJlcXVlc3RUeXA6J2ZyaWVuZCd9O1xuXG5jb24ucXVlcnkoJ1NFTEVDVCByZXF1ZXN0ZWUscmVzcG9uc2UgRlJPTSBhbGxyZXF1ZXN0cyBXSEVSRSAgcmVxdWVzdG9yID0gPyBBTkQgcmVxdWVzdFR5cCA9JysnXCInKyAnZnJpZW5kJysnXCInLCByZXF1ZXN0WydyZXF1ZXN0b3InXSwgZnVuY3Rpb24oZXJyLHJlcyl7XG5pZiAocmVzID09PSB1bmRlZmluZWQpIHtcbiAgcmVzcG9uc2Uuc2VuZCgnbm8gZnJpZW5kcycpXG59XG52YXIgdGVzdD1yZXMuZmlsdGVyKGZ1bmN0aW9uKGEpe3JldHVybiBhLnJlc3BvbnNlPT09bnVsbH0pXG52YXIgdGVzdDI9dGVzdC5tYXAoZnVuY3Rpb24oYSl7IHJldHVybiBhLnJlcXVlc3RlZX0pXG5jb25zb2xlLmxvZygnbmFtZXMgb2YgcGVvcGxlIHdob20gSXZlIHJlcXVlc3RlZCBhcyBmcmllbmRzJyx0ZXN0KTtcblxuXG5cbmNvbi5xdWVyeSgnSU5TRVJUIElOVE8gYWxscmVxdWVzdHMgU0VUID8nLCByZXF1ZXN0LCBmdW5jdGlvbihlcnIscmVzcCl7XG4gIGlmKGVycikgdGhyb3cgZXJyO1xuICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzcC5pbnNlcnRJZCk7XG4gIHJlc3BvbnNlLnNlbmQodGVzdDIpO1xufSlcbn0pO1xuXG4gfVxufTtcblxuXG5cblxuXG5cblxuXG5cbmV4cG9ydHMubGlzdFJlcXVlc3RzID0gZnVuY3Rpb24ocmVxLCByZXNwb25zZSkge1xuICB2YXIgcmVxdWVzdCA9IHJlcS5teVNlc3Npb24udXNlclxuXG4gIGNvbi5xdWVyeSgnU2VsZWN0ICogRlJPTSBhbGxyZXF1ZXN0cyBXSEVSRSByZXF1ZXN0ZWU9JysnXCInK3JlcXVlc3QrJ1wiJysnJysnT1IgcmVxdWVzdG9yID0nKydcIicrcmVxdWVzdCsnXCInKycnLCBmdW5jdGlvbihlcnIscmVzKXtcbiAgaWYoZXJyKSB0aHJvdyBlcnI7XG4gIGNvbnNvbGUubG9nKHJlcylcbiAgcmVzcG9uc2Uuc2VuZChbcmVzLHJlcXVlc3RdKTtcbn0pO1xuXG5cbn07XG5cbmV4cG9ydHMuYWNjZXB0ID0gZnVuY3Rpb24ocmVxLCByZXNwb25zZSkge1xuICB2YXIgcmVxdWVzdG9yPXJlcS5ib2R5LnBlcnNvblRvQWNjZXB0O1xuICB2YXIgcmVxdWVzdGVlPXJlcS5teVNlc3Npb24udXNlcjtcbiAgdmFyIG1vdmllID0gcmVxLmJvZHkubW92aWU7XG4gIHZhciByZXF1ZXN0VHlwZSA9IFwiZnJpZW5kXCI7XG5cbiAgaWYgKG1vdmllID09PSAnJykge1xuICAgIGNvbi5xdWVyeSgnVVBEQVRFIGFsbHJlcXVlc3RzIFNFVCByZXNwb25zZT0nKydcIicgKyAneWVzJyArICdcIicrJyAgV0hFUkUgcmVxdWVzdG9yID0gJysnXCInKyByZXF1ZXN0b3IrJ1wiJysnIEFORCByZXF1ZXN0VHlwPScrJ1wiJytyZXF1ZXN0VHlwZSsnXCInLCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcbiAgICB9KTtcblxuICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIHJlcS5ib2R5LnBlcnNvblRvQWNjZXB0LCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzWzBdLmlkLCBlcnIpO1xuICAgIHZhciBwZXJzb24xID0gcmVzWzBdLmlkO1xuICAgIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgcmVxLm15U2Vzc2lvbi51c2VyLCBmdW5jdGlvbihlcnIsIHJlc3ApIHtcbiAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXNwWzBdLmlkLCBlcnIpO1xuXG4gICAgICB2YXIgcGVyc29uMiA9IHJlc3BbMF0uaWQ7XG4gICAgICB2YXIgcmVxdWVzdCA9IHtcbiAgICAgICAgdXNlcjFpZDogcGVyc29uMSxcbiAgICAgICAgdXNlcjJpZDogcGVyc29uMlxuICAgICAgfVxuICAgICAgdmFyIHJlcXVlc3QyID0ge1xuICAgICAgICB1c2VyMWlkOiBwZXJzb24yLFxuICAgICAgICB1c2VyMmlkOiBwZXJzb24xXG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUubG9nKCd0aGUgcmVxdWVzdHM6OjonLHJlcXVlc3QscmVxdWVzdDIpXG4gICAgICBjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIHJlbGF0aW9ucyBTRVQgPycsIHJlcXVlc3QsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XG5cbiAgICAgIGNvbi5xdWVyeSgnSU5TRVJUIElOVE8gcmVsYXRpb25zIFNFVCA/JywgcmVxdWVzdDIsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcblxuICAgICAgICAgICByZXNwb25zZS5zZW5kKCdUaGF0cyBteSBzdHlsZSEhIScpO1xuICAgICAgICB9KVxuICAgICAgfSk7XG4gICAgfSlcbiAgfSlcbiAgfSBlbHNlIHtcbiAgY29uc29sZS5sb2coJ3RoaXMgaXMgcmVxIGJvZHkgJyxyZXEuYm9keSk7XG5cbiAgY29uLnF1ZXJ5KCdVUERBVEUgYWxscmVxdWVzdHMgU0VUIHJlc3BvbnNlPScrJ1wiJyArICd5ZXMnICsgJ1wiJysnICBXSEVSRSByZXF1ZXN0b3IgPSAnKydcIicrIHJlcXVlc3RvcisnXCInKycgQU5EIG1vdmllPScrJ1wiJysgbW92aWUrJ1wiJywgZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcbiAgfSk7XG5cbiAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCByZXEuYm9keS5wZXJzb25Ub0FjY2VwdCwgZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlc1swXS5pZCwgZXJyKTtcbiAgICB2YXIgcGVyc29uMSA9IHJlc1swXS5pZDtcbiAgICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIHJlcS5teVNlc3Npb24udXNlciwgZnVuY3Rpb24oZXJyLCByZXNwKSB7XG4gICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzcFswXS5pZCwgZXJyKTtcblxuICAgICAgdmFyIHBlcnNvbjIgPSByZXNwWzBdLmlkO1xuICAgICAgdmFyIHJlcXVlc3QgPSB7XG4gICAgICAgIHVzZXIxaWQ6IHBlcnNvbjEsXG4gICAgICAgIHVzZXIyaWQ6IHBlcnNvbjJcbiAgICAgIH1cbiAgICAgIHZhciByZXF1ZXN0MiA9IHtcbiAgICAgICAgdXNlcjFpZDogcGVyc29uMixcbiAgICAgICAgdXNlcjJpZDogcGVyc29uMVxuICAgICAgfVxuXG4gICAgICBjb25zb2xlLmxvZygndGhlIHJlcXVlc3RzOjo6JyxyZXF1ZXN0LHJlcXVlc3QyKVxuICAgICAgY29uLnF1ZXJ5KCdJTlNFUlQgSU5UTyByZWxhdGlvbnMgU0VUID8nLCByZXF1ZXN0LCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xuXG4gICAgICBjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIHJlbGF0aW9ucyBTRVQgPycsIHJlcXVlc3QyLCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XG5cbiAgICAgICAgICAgcmVzcG9uc2Uuc2VuZCgnVGhhdHMgbXkgc3R5bGUhISEnKTtcbiAgICAgICAgfSlcbiAgICAgIH0pO1xuICAgIH0pXG4gIH0pXG59XG4gIC8vIGFsbFJlcXVlc3QuZm9yZ2Uoe3JlcXVlc3RvcjogcmVxdWVzdG9yLCByZXF1ZXN0ZWU6IHJlcXVlc3RlZX0pXG4gIC8vICAgLmZldGNoKCkudGhlbihmdW5jdGlvbihhbGxSZXF1ZXN0KSB7XG4gIC8vICAgICBhbGxSZXF1ZXN0LmRlc3Ryb3koKVxuICAvLyAgICAgICAudGhlbihmdW5jdGlvbigpIHtcbiAgLy8gICAgICAgICByZXNwb25zZS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6ICdVc2VyIHN1Y2Nlc3NmdWxseSBkZWxldGVkJ319KTtcbiAgLy8gICAgICAgfSlcbiAgLy8gICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAvLyAgICAgICAgIHJlc3BvbnNlLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XG4gIC8vICAgICAgIH0pO1xuICAvLyAgIH0pXG4gIC8vICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAvLyAgICAgcmVzcG9uc2Uuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcbiAgLy8gICB9KTtcbn07XG5cbmV4cG9ydHMucmVtb3ZlUmVxdWVzdCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIHZhciByZXF1ZXN0b3I9cmVxLmJvZHkucmVxdWVzdG9yO1xuICB2YXIgcmVxdWVzdGVlPXJlcS5ib2R5LnJlcXVlc3RlZTtcblxuICBhbGxSZXF1ZXN0LmZvcmdlKHtyZXF1ZXN0b3I6IHJlcXVlc3RvciwgcmVxdWVzdGVlOiByZXF1ZXN0ZWV9KVxuICAgIC5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oYWxsUmVxdWVzdCkge1xuICAgICAgYWxsUmVxdWVzdC5kZXN0cm95KClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmVzLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogJ1VzZXIgc3VjY2Vzc2Z1bGx5IGRlbGV0ZWQnfX0pO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogcmVxLmJvZHl9fSk7XG4gICAgICAgIH0pO1xuICAgIH0pXG4gICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogcmVxLmJvZHl9fSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydHMuZ2V0VGhpc0ZyaWVuZHNNb3ZpZXM9ZnVuY3Rpb24ocmVxLHJlc3BvbnNlKXtcblxuICB2YXIgbW92aWVzPVtdO1xuICBjb25zb2xlLmxvZyhyZXEuYm9keS5zcGVjaWZpY0ZyaWVuZCk7XG4gIHZhciBwZXJzb249cmVxLmJvZHkuc3BlY2lmaWNGcmllbmRcbiAgdmFyIGlkPW51bGxcbiAgdmFyIGxlbj1udWxsO1xuICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIHBlcnNvbiwgZnVuY3Rpb24oZXJyLCByZXNwKXtcbmNvbnNvbGUubG9nKHJlc3ApXG5pZD1yZXNwWzBdLmlkO1xuXG5cbmNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByYXRpbmdzIFdIRVJFIHVzZXJpZCA9ID8nLCBpZCAsZnVuY3Rpb24oZXJyLHJlc3Ape1xuY29uc29sZS5sb2coJ2VycnJycnJycnInLGVycixyZXNwLmxlbmd0aClcbmxlbj1yZXNwLmxlbmd0aDtcbnJlc3AuZm9yRWFjaChmdW5jdGlvbihhKXtcblxuY29uLnF1ZXJ5KCdTRUxFQ1QgdGl0bGUgRlJPTSBtb3ZpZXMgV0hFUkUgaWQgPSA/JywgYS5tb3ZpZWlkICxmdW5jdGlvbihlcnIscmVzcCl7XG4gIGNvbnNvbGUubG9nKHJlc3ApXG5tb3ZpZXMucHVzaChbcmVzcFswXS50aXRsZSxhLnNjb3JlLGEucmV2aWV3XSlcbmNvbnNvbGUubG9nKG1vdmllcylcbmlmIChtb3ZpZXMubGVuZ3RoPT09bGVuKXtcbiAgcmVzcG9uc2Uuc2VuZChtb3ZpZXMpO1xufVxufSlcblxufSlcblxufSlcblxuXG4gIH1cblxuKX1cblxuZXhwb3J0cy5maW5kTW92aWVCdWRkaWVzPWZ1bmN0aW9uKHJlcSxyZXNwb25zZSl7XG4gIGNvbnNvbGUubG9nKFwieW91J3JlIHRyeWluZyB0byBmaW5kIGJ1ZGRpZXMhIVwiKTtcbmNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSB1c2VycycsZnVuY3Rpb24oZXJyLHJlc3Ape1xuICB2YXIgcGVvcGxlPXJlc3AubWFwKGZ1bmN0aW9uKGEpe3JldHVybiBhLnVzZXJuYW1lfSlcbiAgdmFyIElkcz0gcmVzcC5tYXAoZnVuY3Rpb24oYSl7cmV0dXJuIGEuaWR9KVxuICB2YXIgaWRLZXlPYmo9e31cbmZvciAodmFyIGk9MDtpPElkcy5sZW5ndGg7aSsrKXtcbiAgaWRLZXlPYmpbSWRzW2ldXT1wZW9wbGVbaV1cbn1cbmNvbnNvbGUubG9nKCdjdXJyZW50IHVzZXInLHJlcS5teVNlc3Npb24udXNlcik7XG52YXIgY3VycmVudFVzZXI9cmVxLm15U2Vzc2lvbi51c2VyXG5cblxuIHZhciBvYmoxPXt9O1xuICBmb3IgKHZhciBpPTA7aTxJZHMubGVuZ3RoO2krKyl7XG5vYmoxW2lkS2V5T2JqW0lkc1tpXV1dPVtdO1xuICB9XG5cbiAgY29uLnF1ZXJ5KCdTRUxFQ1Qgc2NvcmUsbW92aWVpZCx1c2VyaWQgRlJPTSByYXRpbmdzJyxmdW5jdGlvbihlcnIscmVzcG9uKXtcbiAgXG5mb3IgKHZhciBpPTA7aTxyZXNwb24ubGVuZ3RoO2krKyl7XG4gIG9iajFbaWRLZXlPYmpbcmVzcG9uW2ldLnVzZXJpZF1dLnB1c2goW3Jlc3BvbltpXS5tb3ZpZWlkLHJlc3BvbltpXS5zY29yZV0pXG59XG5cbmNvbnNvbGUubG9nKCdvYmoxJyxvYmoxKTtcbmN1cnJlbnRVc2VySW5mbz1vYmoxW2N1cnJlbnRVc2VyXVxuLy9jb25zb2xlLmxvZygnY3VycmVudFVzZXJJbmZvJyxjdXJyZW50VXNlckluZm8pXG52YXIgY29tcGFyaXNvbnM9e31cblxuZm9yICh2YXIga2V5IGluIG9iajEpe1xuICBpZiAoa2V5IT09Y3VycmVudFVzZXIpIHtcbiAgICBjb21wYXJpc29uc1trZXldPWNvbXAoY3VycmVudFVzZXJJbmZvLG9iajFba2V5XSlcbiAgfVxufVxuY29uc29sZS5sb2coY29tcGFyaXNvbnMpXG52YXIgZmluYWxTZW5kPVtdXG5mb3IgKHZhciBrZXkgaW4gY29tcGFyaXNvbnMpe1xuICBpZiAoY29tcGFyaXNvbnNba2V5XSAhPT0gJ05hTiUnKSB7XG4gIGZpbmFsU2VuZC5wdXNoKFtrZXksY29tcGFyaXNvbnNba2V5XV0pO1xufSBlbHNlICB7XG4gIGZpbmFsU2VuZC5wdXNoKFtrZXksXCJObyBDb21wYXJpc29uIHRvIE1ha2VcIl0pXG59XG5cbn1cblxuICByZXNwb25zZS5zZW5kKGZpbmFsU2VuZClcbn0pXG59KVxufVxuXG5cbmV4cG9ydHMuZGVjbGluZT1mdW5jdGlvbihyZXEscmVzcG9uc2Upe1xuICB2YXIgcmVxdWVzdG9yPXJlcS5ib2R5LnBlcnNvblRvRGVjbGluZTtcbiAgdmFyIHJlcXVlc3RlZT1yZXEubXlTZXNzaW9uLnVzZXI7XG4gIHZhciBtb3ZpZT1yZXEuYm9keS5tb3ZpZTtcbiAgdmFyIHJlcXVlc3RUeXBlID0gJ2ZyaWVuZCc7XG5cbiAgaWYgKG1vdmllID09PSAnJykge1xuICAgIGNvbi5xdWVyeSgnVVBEQVRFIGFsbHJlcXVlc3RzIFNFVCByZXNwb25zZT0nKydcIicgKyAnbm8nICsgJ1wiJysgJyBXSEVSRSByZXF1ZXN0b3IgPSAnKydcIicrIHJlcXVlc3RvcisnXCInKycgQU5EIHJlcXVlc3RUeXA9JysnXCInKyByZXF1ZXN0VHlwZSsnXCInLCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XG4gICAgICByZXNwb25zZS5zZW5kKHJlcXVlc3RvciArICdkZWxldGVkJyk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY29uLnF1ZXJ5KCdVUERBVEUgYWxscmVxdWVzdHMgU0VUIHJlc3BvbnNlPScrJ1wiJyArICdubycgKyAnXCInKyAnIFdIRVJFIHJlcXVlc3RvciA9ICcrJ1wiJysgcmVxdWVzdG9yKydcIicrJyBBTkQgcmVxdWVzdGVlPScrJ1wiJysgcmVxdWVzdGVlKydcIicrJyBBTkQgbW92aWUgPScrJ1wiJyttb3ZpZSsnXCInLCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XG4gICAgICByZXNwb25zZS5zZW5kKHJlcXVlc3RvciArICdkZWxldGVkJyk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBhbGxSZXF1ZXN0LmZvcmdlKHtyZXF1ZXN0b3I6IHJlcXVlc3RvciwgcmVxdWVzdGVlOiByZXF1ZXN0ZWV9KVxuICAvLyAgIC5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oYWxsUmVxdWVzdCkge1xuICAvLyAgICAgYWxsUmVxdWVzdC5kZXN0cm95KClcbiAgLy8gICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gIC8vICAgICAgICAgcmVzcG9uc2UuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiAnVXNlciBzdWNjZXNzZnVsbHkgZGVsZXRlZCd9fSk7XG4gIC8vICAgICAgIH0pXG4gIC8vICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgLy8gICAgICAgICByZXNwb25zZS5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xuICAvLyAgICAgICB9KTtcbiAgLy8gICB9KVxuICAvLyAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgLy8gICAgIHJlc3BvbnNlLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XG4gIC8vICAgfSk7XG59O1xuXG5leHBvcnRzLnNpZ251cFVzZXIgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICBjb25zb2xlLmxvZygnY2FsbGluZyBsb2dpbicsIHJlcS5ib2R5KTtcbiAgLy8gY29uc29sZS5sb2coJ3RoaXMgaXMgdGhlIHNlc3Npb24nLHJlcS5zZXNzaW9uKVxuICBuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEuYm9keS5uYW1lIH0pLmZldGNoKCkudGhlbihmdW5jdGlvbihmb3VuZCkge1xuICAgIGlmIChmb3VuZCkge1xuICAgICAgLy9jaGVjayBwYXNzd29yZFxuICAgICAgICAgLy9pZiAocGFzc3dvcmQgbWF0Y2hlcylcbiAgICAgICAgIC8veyBhZGQgc2Vzc2lvbnMgYW5kIHJlZGlyZWN0fVxuICAgICAgY29uc29sZS5sb2coJ3VzZXJuYW1lIGFscmVhZHkgZXhpc3QsIGNhbm5vdCBzaWdudXAgJywgcmVxLmJvZHkubmFtZSk7XG4gICAgICByZXMuc3RhdHVzKDQwMykuc2VuZCgndXNlcm5hbWUgZXhpc3QnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ2NyZWF0aW5nIHVzZXInKTtcbiAgICAgIHJlcS5teVNlc3Npb24udXNlciA9IHJlcS5ib2R5Lm5hbWU7XG4gICAgICBVc2Vycy5jcmVhdGUoe1xuICAgICAgICB1c2VybmFtZTogcmVxLmJvZHkubmFtZSxcbiAgICAgICAgcGFzc3dvcmQ6IHJlcS5ib2R5LnBhc3N3b3JkLFxuICAgICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHVzZXIpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2NyZWF0ZWQgYSBuZXcgdXNlcicpO1xuICAgICAgICByZXMuc3RhdHVzKDIwMSkuc2VuZCgnbG9naW4gY3JlYXRlZCcpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn07XG5cbmV4cG9ydHMuc2lnbmluVXNlciA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cdGNvbnNvbGUubG9nKCdjYWxsaW5nIHNpZ25pbicsIHJlcS5ib2R5KTtcblx0bmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLmJvZHkubmFtZSB9KS5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oZm91bmQpe1xuXG5cdFx0aWYgKGZvdW5kKXtcblx0XHRcdG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUsIHBhc3N3b3JkOnJlcS5ib2R5LnBhc3N3b3JkfSkuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGZvdW5kKXtcblx0XHRcdFx0aWYgKGZvdW5kKXtcblx0XHRcdFx0XHRyZXEubXlTZXNzaW9uLnVzZXIgPSBmb3VuZC5hdHRyaWJ1dGVzLnVzZXJuYW1lO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGZvdW5kLmF0dHJpYnV0ZXMudXNlcm5hbWUpXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ3dlIGZvdW5kIHlvdSEhJylcblx0XHRcdFx0XHRyZXMuc2VuZChbJ2l0IHdvcmtlZCcscmVxLm15U2Vzc2lvbi51c2VyXSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmVzLnN0YXR1cyg0MDQpLnNlbmQoJ2JhZCBsb2dpbicpO1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCd3cm9uZyBwYXNzd29yZCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXMuc3RhdHVzKDQwNCkuc2VuZCgnYmFkIGxvZ2luJyk7XG5cdFx0XHRjb25zb2xlLmxvZygndXNlciBub3QgZm91bmQnKTtcblx0XHR9XG5cbiAgfSkgXG5cbn1cblxuZXhwb3J0cy5sb2dvdXQgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXHRyZXEubXlTZXNzaW9uLmRlc3Ryb3koZnVuY3Rpb24oZXJyKXtcblx0XHRjb25zb2xlLmxvZyhlcnIpO1xuXHR9KTtcblx0Y29uc29sZS5sb2coJ2xvZ291dCcpO1xuXHRyZXMuc2VuZCgnbG9nb3V0Jyk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vL21vdmllIGhhbmRsZXJzXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuLy9hIGhhbmRlbGVyIHRoYXQgdGFrZXMgYSByYXRpbmcgZnJvbSB1c2VyIGFuZCBhZGQgaXQgdG8gdGhlIGRhdGFiYXNlXG4vLyBleHBlY3RzIHJlcS5ib2R5IHRvIGhhdmUgdGhpczoge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnLCBwb3N0ZXI6ICdsaW5rJywgcmVsZWFzZV9kYXRlOiAneWVhcicsIHJhdGluZzogJ251bWJlcid9XG5leHBvcnRzLnJhdGVNb3ZpZSA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cdGNvbnNvbGUubG9nKCdjYWxsaW5nIHJhdGVNb3ZpZScpO1xuXHR2YXIgdXNlcmlkO1xuXHRyZXR1cm4gbmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLm15U2Vzc2lvbi51c2VyIH0pLmZldGNoKClcblx0LnRoZW4oZnVuY3Rpb24oZm91bmRVc2VyKSB7XG5cdFx0dXNlcmlkID0gZm91bmRVc2VyLmF0dHJpYnV0ZXMuaWQ7XG5cdFx0cmV0dXJuIG5ldyBSYXRpbmcoeyBtb3ZpZWlkOiByZXEuYm9keS5pZCwgdXNlcmlkOiB1c2VyaWQgfSkuZmV0Y2goKVxuXHRcdC50aGVuKGZ1bmN0aW9uKGZvdW5kUmF0aW5nKSB7XG5cdFx0XHRpZiAoZm91bmRSYXRpbmcpIHtcblx0XHRcdFx0Ly9zaW5jZSByYXRpbmcgb3IgcmV2aWV3IGlzIHVwZGF0ZWQgc2VwZXJhdGx5IGluIGNsaWVudCwgdGhlIGZvbGxvd2luZ1xuXHRcdFx0XHQvL21ha2Ugc3VyZSBpdCBnZXRzIHVwZGF0ZWQgYWNjb3JkaW5nIHRvIHRoZSByZXFcblx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ3VwZGF0ZSByYXRpbmcnLCBmb3VuZFJhdGluZylcblx0XHRcdFx0aWYgKHJlcS5ib2R5LnJhdGluZykge1xuXHRcdFx0XHRcdHZhciByYXRpbmdPYmogPSB7c2NvcmU6IHJlcS5ib2R5LnJhdGluZ307XG5cdFx0XHRcdH0gZWxzZSBpZiAocmVxLmJvZHkucmV2aWV3KSB7XG5cdFx0XHRcdFx0dmFyIHJhdGluZ09iaiA9IHtyZXZpZXc6IHJlcS5ib2R5LnJldmlld307XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIG5ldyBSYXRpbmcoeydpZCc6IGZvdW5kUmF0aW5nLmF0dHJpYnV0ZXMuaWR9KVxuXHRcdFx0XHRcdC5zYXZlKHJhdGluZ09iaik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLmxvZygnY3JlYXRpbmcgcmF0aW5nJyk7XG5cdFx0ICAgIHJldHVybiBSYXRpbmdzLmNyZWF0ZSh7XG5cdFx0ICAgIFx0c2NvcmU6IHJlcS5ib2R5LnJhdGluZyxcblx0XHQgICAgICB1c2VyaWQ6IHVzZXJpZCxcblx0XHQgICAgICBtb3ZpZWlkOiByZXEuYm9keS5pZCxcblx0XHQgICAgICByZXZpZXc6IHJlcS5ib2R5LnJldmlld1xuXHRcdCAgICB9KTtcdFx0XHRcdFx0XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0pXG5cdC50aGVuKGZ1bmN0aW9uKG5ld1JhdGluZykge1xuXHRcdGNvbnNvbGUubG9nKCdyYXRpbmcgY3JlYXRlZDonLCBuZXdSYXRpbmcuYXR0cmlidXRlcyk7XG4gIFx0cmVzLnN0YXR1cygyMDEpLnNlbmQoJ3JhdGluZyByZWNpZXZlZCcpO1xuXHR9KVxufTtcblxuLy90aGlzIGhlbHBlciBmdW5jdGlvbiBhZGRzIHRoZSBtb3ZpZSBpbnRvIGRhdGFiYXNlXG4vL2l0IGZvbGxvd3MgdGhlIHNhbWUgbW92aWUgaWQgYXMgVE1EQlxuLy9leHBlY3RzIHJlcS5ib2R5IHRvIGhhdmUgdGhlc2UgYXRyaWJ1dGUgOiB7aWQsIHRpdGxlLCBnZW5yZSwgcG9zdGVyX3BhdGgsIHJlbGVhc2VfZGF0ZSwgb3ZlcnZpZXcsIHZvdGVfYXZlcmFnZX1cbnZhciBhZGRPbmVNb3ZpZSA9IGZ1bmN0aW9uKG1vdmllT2JqKSB7XG5cdHZhciBnZW5yZSA9IChtb3ZpZU9iai5nZW5yZV9pZHMpID8gZ2VucmVzW21vdmllT2JqLmdlbnJlX2lkc1swXV0gOiAnbi9hJztcbiAgcmV0dXJuIG5ldyBNb3ZpZSh7XG4gIFx0aWQ6IG1vdmllT2JqLmlkLFxuICAgIHRpdGxlOiBtb3ZpZU9iai50aXRsZSxcbiAgICBnZW5yZTogZ2VucmUsXG4gICAgcG9zdGVyOiAnaHR0cHM6Ly9pbWFnZS50bWRiLm9yZy90L3AvdzE4NS8nICsgbW92aWVPYmoucG9zdGVyX3BhdGgsXG4gICAgcmVsZWFzZV9kYXRlOiBtb3ZpZU9iai5yZWxlYXNlX2RhdGUsXG4gICAgZGVzY3JpcHRpb246IG1vdmllT2JqLm92ZXJ2aWV3LnNsaWNlKDAsIDI1NSksXG4gICAgaW1kYlJhdGluZzogbW92aWVPYmoudm90ZV9hdmVyYWdlXG4gIH0pLnNhdmUobnVsbCwge21ldGhvZDogJ2luc2VydCd9KVxuICAudGhlbihmdW5jdGlvbihuZXdNb3ZpZSkge1xuICBcdGNvbnNvbGUubG9nKCdtb3ZpZSBjcmVhdGVkJywgbmV3TW92aWUuYXR0cmlidXRlcy50aXRsZSk7XG4gIFx0cmV0dXJuIG5ld01vdmllO1xuICB9KVxufTtcblxuXG4vL2dldCBhbGwgbW92aWUgcmF0aW5ncyB0aGF0IGEgdXNlciByYXRlZFxuLy9zaG91bGQgcmV0dXJuIGFuIGFycmF5IHRoYXQgbG9vayBsaWtlIHRoZSBmb2xsb3dpbmc6XG4vLyBbIHt0aXRsZTogJ25hbWUnLCBnZW5yZTogJ2dlbnJlJyAsIHBvc3RlcjogJ3VybCcsIHJlbGVhc2VfZGF0ZTogJ2RhdGUnLCBzY29yZTogbiwgZnJpZW5kQXZlcmFnZVJhdGluZzogbn0gLi4uIF1cbi8vIHdpbGwgZ2V0IHJhdGluZ3MgZm9yIHRoZSBjdXJyZW50IHVzZXJcbmV4cG9ydHMuZ2V0VXNlclJhdGluZ3MgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICBSYXRpbmcucXVlcnkoZnVuY3Rpb24ocWIpe1xuICBcdHFiLmlubmVySm9pbigndXNlcnMnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICd1c2Vycy5pZCcpO1xuICBcdHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xuICBcdHFiLnNlbGVjdCgndXNlcnMudXNlcm5hbWUnLCAnbW92aWVzLnRpdGxlJywgJ21vdmllcy5pZCcsICdtb3ZpZXMuZ2VucmUnLCAnbW92aWVzLnBvc3RlcicsICdtb3ZpZXMucmVsZWFzZV9kYXRlJywgJ21vdmllcy5pbWRiUmF0aW5nJywgJ21vdmllcy5kZXNjcmlwdGlvbicsICdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3JywgJ3JhdGluZ3MudXBkYXRlZF9hdCcpO1xuICBcdHFiLndoZXJlKCd1c2Vycy51c2VybmFtZScsICc9JywgcmVxLm15U2Vzc2lvbi51c2VyKTtcbiAgXHRxYi5vcmRlckJ5KCd1cGRhdGVkX2F0JywgJ0RFU0MnKVxuICB9KVxuICAuZmV0Y2hBbGwoKVxuICAudGhlbihmdW5jdGlvbihyYXRpbmdzKXtcblx0XHQvL2RlY29yYXRlIGl0IHdpdGggYXZnIGZyaWVuZCByYXRpbmdcblx0XHRyZXR1cm4gUHJvbWlzZS5tYXAocmF0aW5ncy5tb2RlbHMsIGZ1bmN0aW9uKHJhdGluZykge1xuXHRcdFx0cmV0dXJuIGF0dGFjaEZyaWVuZEF2Z1JhdGluZyhyYXRpbmcsIHJlcS5teVNlc3Npb24udXNlcik7XG5cdFx0fSk7XG5cdH0pXG4gIC50aGVuKGZ1bmN0aW9uKHJhdGluZ3MpIHtcbiAgXHRjb25zb2xlLmxvZygncmV0cml2aW5nIGFsbCB1c2VyIHJhdGluZ3MnKTtcbiAgXHRyZXMuc3RhdHVzKDIwMCkuanNvbihyYXRpbmdzKTtcbiAgfSlcbn07XG5cbmV4cG9ydHMuZ2V0RnJpZW5kVXNlclJhdGluZ3MgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICBSYXRpbmcucXVlcnkoZnVuY3Rpb24ocWIpe1xuICBcdHFiLmlubmVySm9pbigndXNlcnMnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICd1c2Vycy5pZCcpO1xuICBcdHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xuICBcdHFiLnNlbGVjdCgndXNlcnMudXNlcm5hbWUnLCAnbW92aWVzLnRpdGxlJywgJ21vdmllcy5pZCcsICdtb3ZpZXMuZ2VucmUnLCAnbW92aWVzLnBvc3RlcicsICdtb3ZpZXMucmVsZWFzZV9kYXRlJywgJ21vdmllcy5pbWRiUmF0aW5nJywgJ21vdmllcy5kZXNjcmlwdGlvbicsICdyYXRpbmdzLnNjb3JlIGFzIGZyaWVuZFNjb3JlJywgJ3JhdGluZ3MucmV2aWV3IGFzIGZyaWVuZFJldmlldycsICdyYXRpbmdzLnVwZGF0ZWRfYXQnKTtcbiAgXHRxYi53aGVyZSgndXNlcnMudXNlcm5hbWUnLCAnPScsIHJlcS5xdWVyeS5mcmllbmROYW1lKTtcbiAgXHRxYi5vcmRlckJ5KCd1cGRhdGVkX2F0JywgJ0RFU0MnKVxuICB9KVxuICAuZmV0Y2hBbGwoKVxuICAudGhlbihmdW5jdGlvbihyYXRpbmdzKXtcblx0XHQvL2RlY29yYXRlIGl0IHdpdGggY3VycmVudCB1c2VyJ3MgcmF0aW5nXG5cdFx0cmV0dXJuIFByb21pc2UubWFwKHJhdGluZ3MubW9kZWxzLCBmdW5jdGlvbihyYXRpbmcpIHtcblx0XHRcdHJldHVybiBhdHRhY2hVc2VyUmF0aW5nKHJhdGluZywgcmVxLm15U2Vzc2lvbi51c2VyKTtcblx0XHR9KTtcblx0fSlcbiAgLnRoZW4oZnVuY3Rpb24ocmF0aW5ncykge1xuICBcdGNvbnNvbGUubG9nKCdyZXRyaXZpbmcgYWxsIHVzZXIgcmF0aW5ncycpO1xuICBcdHJlcy5zdGF0dXMoMjAwKS5qc29uKHJhdGluZ3MpO1xuICB9KVxufTtcblxuLy9hIGRlY29yYXRvciBmdW5jdGlvbiB0aGF0IGF0dGFjaGVzIGZyaWVuZCBhdmcgcmF0aW5nIHRvIHRoZSByYXRpbmcgb2JqXG52YXIgYXR0YWNoRnJpZW5kQXZnUmF0aW5nID0gZnVuY3Rpb24ocmF0aW5nLCB1c2VybmFtZSkge1xuXHRyZXR1cm4gZXhwb3J0cy5nZXRGcmllbmRSYXRpbmdzKHVzZXJuYW1lLCByYXRpbmcpXG5cdC50aGVuKGZ1bmN0aW9uKGZyaWVuZHNSYXRpbmdzKXtcblx0XHQvL2lmIGZyaWVuZHNSYXRpbmdzIGlzIG51bGwsIFJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgaXMgbnVsbFxuXHRcdGlmICghZnJpZW5kc1JhdGluZ3MpIHtcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgPSBudWxsO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nID0gYXZlcmFnZVJhdGluZyhmcmllbmRzUmF0aW5ncyk7XG5cdFx0fVxuXHRcdHJldHVybiByYXRpbmc7XG5cdH0pXG59XG5cbi8vYSBkZWNvcmF0b3IgZnVuY3Rpb24gdGhhdCBhdHRhY2hlcyB1c2VyIHJhdGluZyBhbmQgcmV2aWV3cyB0byB0aGUgcmF0aW5nIG9ialxudmFyIGF0dGFjaFVzZXJSYXRpbmcgPSBmdW5jdGlvbihyYXRpbmcsIHVzZXJuYW1lKSB7XG5cdHJldHVybiBSYXRpbmcucXVlcnkoZnVuY3Rpb24ocWIpIHtcblx0XHRxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3VzZXJzLmlkJywgJz0nLCAncmF0aW5ncy51c2VyaWQnKVxuXHRcdHFiLmlubmVySm9pbignbW92aWVzJywgJ21vdmllcy5pZCcsICc9JywgJ3JhdGluZ3MubW92aWVpZCcpXG5cdFx0cWIuc2VsZWN0KCdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3Jylcblx0XHRxYi53aGVyZSh7XG5cdFx0XHQndXNlcnMudXNlcm5hbWUnOiB1c2VybmFtZSxcblx0XHRcdCdtb3ZpZXMudGl0bGUnOiByYXRpbmcuYXR0cmlidXRlcy50aXRsZSxcblx0XHRcdCdtb3ZpZXMuaWQnOiByYXRpbmcuYXR0cmlidXRlcy5pZFxuXHRcdH0pXG5cdH0pXG5cdC5mZXRjaCgpXG5cdC50aGVuKGZ1bmN0aW9uKHVzZXJSYXRpbmcpe1xuXHRcdGlmICh1c2VyUmF0aW5nKSB7XG5cdFx0XHRyYXRpbmcuYXR0cmlidXRlcy5zY29yZSA9IHVzZXJSYXRpbmcuYXR0cmlidXRlcy5zY29yZTtcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLnJldmlldyA9IHVzZXJSYXRpbmcuYXR0cmlidXRlcy5yZXZpZXc7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLnNjb3JlID0gbnVsbDtcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLnJldmlldyA9IG51bGw7XG5cdFx0fVxuXHRcdHJldHVybiByYXRpbmc7XG5cdH0pO1xufTtcblxuLy90aGlzIGlzIGEgd3JhcGVyIGZ1bmN0aW9uIGZvciBnZXRGcmllbmRSYXRpbmdzIHdoaWNoIHdpbGwgc2VudCB0aGUgY2xpZW50IGFsbCBvZiB0aGUgZnJpZW5kIHJhdGluZ3NcbmV4cG9ydHMuaGFuZGxlR2V0RnJpZW5kUmF0aW5ncyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cdGNvbnNvbGUubG9nKCdoYW5kbGVHZXRGcmllbmRSYXRpbmdzLCAnLCByZXEubXlTZXNzaW9uLnVzZXIsIHJlcS5ib2R5Lm1vdmllLnRpdGxlKTtcblx0ZXhwb3J0cy5nZXRGcmllbmRSYXRpbmdzKHJlcS5teVNlc3Npb24udXNlciwge2F0dHJpYnV0ZXM6IHJlcS5ib2R5Lm1vdmllfSlcblx0LnRoZW4oZnVuY3Rpb24oZnJpZW5kUmF0aW5ncyl7XG5cdFx0cmVzLmpzb24oZnJpZW5kUmF0aW5ncyk7XG5cdH0pO1xufVxuXG4vL3RoaXMgZnVuY3Rpb24gb3V0cHV0cyByYXRpbmdzIG9mIGEgdXNlcidzIGZyaWVuZCBmb3IgYSBwYXJ0aWN1bGFyIG1vdmllXG4vL2V4cGVjdCBjdXJyZW50IHVzZXJuYW1lIGFuZCBtb3ZpZVRpdGxlIGFzIGlucHV0XG4vL291dHB1dHM6IHt1c2VyMmlkOiAnaWQnLCBmcmllbmRVc2VyTmFtZTonbmFtZScsIGZyaWVuZEZpcnN0TmFtZTonbmFtZScsIHRpdGxlOidtb3ZpZVRpdGxlJywgc2NvcmU6biB9XG5leHBvcnRzLmdldEZyaWVuZFJhdGluZ3MgPSBmdW5jdGlvbih1c2VybmFtZSwgbW92aWVPYmopIHtcblx0cmV0dXJuIFVzZXIucXVlcnkoZnVuY3Rpb24ocWIpe1xuXHRcdHFiLmlubmVySm9pbigncmVsYXRpb25zJywgJ3JlbGF0aW9ucy51c2VyMWlkJywgJz0nLCAndXNlcnMuaWQnKTtcblx0XHRxYi5pbm5lckpvaW4oJ3JhdGluZ3MnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICdyZWxhdGlvbnMudXNlcjJpZCcpO1xuXHRcdHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xuXHRcdHFiLnNlbGVjdCgncmVsYXRpb25zLnVzZXIyaWQnLCAnbW92aWVzLnRpdGxlJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnKTtcblx0XHRxYi53aGVyZSh7XG5cdFx0XHQndXNlcnMudXNlcm5hbWUnOiB1c2VybmFtZSwgXG5cdFx0XHQnbW92aWVzLnRpdGxlJzogbW92aWVPYmouYXR0cmlidXRlcy50aXRsZSxcblx0XHRcdCdtb3ZpZXMuaWQnOiBtb3ZpZU9iai5hdHRyaWJ1dGVzLmlkIH0pO1xuXHR9KVxuXHQuZmV0Y2hBbGwoKVxuXHQudGhlbihmdW5jdGlvbihmcmllbmRzUmF0aW5ncyl7XG5cdC8vdGhlIGZvbGxvd2luZyBibG9jayBhZGRzIHRoZSBmcmllbmROYW1lIGF0dHJpYnV0ZSB0byB0aGUgcmF0aW5nc1xuXHRcdHJldHVybiBQcm9taXNlLm1hcChmcmllbmRzUmF0aW5ncy5tb2RlbHMsIGZ1bmN0aW9uKGZyaWVuZFJhdGluZykge1xuXHRcdFx0cmV0dXJuIG5ldyBVc2VyKHsgaWQ6IGZyaWVuZFJhdGluZy5hdHRyaWJ1dGVzLnVzZXIyaWQgfSkuZmV0Y2goKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oZnJpZW5kKXtcblx0XHRcdFx0ZnJpZW5kUmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kVXNlck5hbWUgPSBmcmllbmQuYXR0cmlidXRlcy51c2VybmFtZTtcblx0XHRcdFx0ZnJpZW5kUmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kRmlyc3ROYW1lID0gZnJpZW5kLmF0dHJpYnV0ZXMuZmlyc3ROYW1lO1xuXHRcdFx0XHRyZXR1cm4gZnJpZW5kUmF0aW5nO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH0pXG5cdC50aGVuKGZ1bmN0aW9uKGZyaWVuZHNSYXRpbmdzKXtcblx0XHRyZXR1cm4gZnJpZW5kc1JhdGluZ3M7XG5cdH0pO1xufTtcblxuXG4vL2EgaGVscGVyIGZ1bmN0aW9uIHRoYXQgYXZlcmFnZXMgdGhlIHJhdGluZ1xuLy9pbnB1dHMgcmF0aW5ncywgb3V0cHV0cyB0aGUgYXZlcmFnZSBzY29yZTtcbnZhciBhdmVyYWdlUmF0aW5nID0gZnVuY3Rpb24ocmF0aW5ncykge1xuXHQvL3JldHVybiBudWxsIGlmIG5vIGZyaWVuZCBoYXMgcmF0ZWQgdGhlIG1vdmllXG5cdGlmIChyYXRpbmdzLmxlbmd0aCA9PT0gMCkge1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdHJldHVybiByYXRpbmdzXG5cdC5yZWR1Y2UoZnVuY3Rpb24odG90YWwsIHJhdGluZyl7XG5cdFx0cmV0dXJuIHRvdGFsICs9IHJhdGluZy5hdHRyaWJ1dGVzLnNjb3JlO1xuXHR9LCAwKSAvIHJhdGluZ3MubGVuZ3RoO1xufVxuXG5cbi8vYSBoZWxwZXIgZnVuY3Rpb24gdGhhdCBvdXRwdXRzIHVzZXIgcmF0aW5nIGFuZCBhdmVyYWdlIGZyaWVuZCByYXRpbmcgZm9yIG9uZSBtb3ZpZVxuLy9vdXRwdXRzIG9uZSByYXRpbmcgb2JqOiB7dGl0bGU6ICduYW1lJywgZ2VucmU6ICdnZW5yZScgLCBwb3N0ZXI6ICd1cmwnLCByZWxlYXNlX2RhdGU6ICdkYXRlJywgc2NvcmU6IG4sIGZyaWVuZEF2ZXJhZ2VSYXRpbmc6IG59XG52YXIgZ2V0T25lTW92aWVSYXRpbmcgPSBmdW5jdGlvbih1c2VybmFtZSwgbW92aWVPYmopIHtcbiAgcmV0dXJuIFJhdGluZy5xdWVyeShmdW5jdGlvbihxYil7XG4gIFx0cWIuaW5uZXJKb2luKCd1c2VycycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3VzZXJzLmlkJyk7XG4gIFx0cWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XG4gIFx0cWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnKTtcbiAgXHRxYi53aGVyZSh7J3VzZXJzLnVzZXJuYW1lJzogdXNlcm5hbWUsICdtb3ZpZXMudGl0bGUnOiBtb3ZpZU9iai50aXRsZSwgJ21vdmllcy5pZCc6IG1vdmllT2JqLmlkfSk7XG4gIH0pXG4gIC5mZXRjaCgpXG4gIC50aGVuKGZ1bmN0aW9uKHJhdGluZyl7XG5cdCAgaWYgKCFyYXRpbmcpIHtcblx0ICBcdC8vaWYgdGhlIHVzZXIgaGFzIG5vdCByYXRlZCB0aGUgbW92aWUsIHJldHVybiBhbiBvYmogdGhhdCBoYXMgdGhlIG1vdmllIGluZm9ybWF0aW9uLCBidXQgc2NvcmUgaXMgc2V0IHRvIG51bGxcblx0ICBcdHJldHVybiBuZXcgTW92aWUoe3RpdGxlOiBtb3ZpZU9iai50aXRsZSwgaWQ6IG1vdmllT2JqLmlkfSkuZmV0Y2goKVxuXHQgIFx0LnRoZW4oZnVuY3Rpb24obW92aWUpIHtcblx0ICBcdFx0bW92aWUuYXR0cmlidXRlcy5zY29yZSA9IG51bGw7XG5cdCAgXHRcdHJldHVybiBtb3ZpZTtcblx0ICBcdH0pXG5cdCAgfSBlbHNlIHtcblx0ICBcdHJldHVybiByYXRpbmc7XG5cdCAgfVxuXHR9KVxuXHQudGhlbihmdW5jdGlvbihyYXRpbmcpe1xuXHRcdHJldHVybiBleHBvcnRzLmdldEZyaWVuZFJhdGluZ3ModXNlcm5hbWUsIHJhdGluZylcblx0XHQudGhlbihmdW5jdGlvbihmcmllbmRzUmF0aW5ncyl7XG5cdFx0XHQvLyBjb25zb2xlLmxvZygnZnJpZW5kc1JhdGluZ3MnLCBmcmllbmRzUmF0aW5ncyk7XG5cdFx0XHRyYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nID0gYXZlcmFnZVJhdGluZyhmcmllbmRzUmF0aW5ncyk7XG5cdFx0XHRjb25zb2xlLmxvZygnYWRkZWQgYXZlcmFnZSBmcmllbmQgcmF0aW5nJywgcmF0aW5nLmF0dHJpYnV0ZXMudGl0bGUsIHJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcpO1xuXHRcdFx0cmV0dXJuIHJhdGluZztcblx0XHR9KTtcblx0fSk7XG59XG5cblxuLy90aGlzIGhhbmRsZXIgaXMgc3BlY2lmaWNhbGx5IGZvciBzZW5kaW5nIG91dCBhIGxpc3Qgb2YgbW92aWUgcmF0aW5ncyB3aGVuIHRoZSBjbGllbnQgc2VuZHMgYSBsaXN0IG9mIG1vdmllIHRvIHRoZSBzZXJ2ZXJcbi8vZXhwZWN0cyByZXEuYm9keSB0byBiZSBhbiBhcnJheSBvZiBvYmogd2l0aCB0aGVzZSBhdHRyaWJ1dGVzOiB7aWQsIHRpdGxlLCBnZW5yZSwgcG9zdGVyX3BhdGgsIHJlbGVhc2VfZGF0ZSwgb3ZlcnZpZXcsIHZvdGVfYXZlcmFnZX1cbi8vb3V0cHV0cyBbIHt0aXRsZTogJ25hbWUnLCBnZW5yZTogJ2dlbnJlJyAsIHBvc3RlcjogJ3VybCcsIHJlbGVhc2VfZGF0ZTogJ2RhdGUnLCBzY29yZTogbiwgZnJpZW5kQXZlcmFnZVJhdGluZzogbn0gLi4uIF1cbmV4cG9ydHMuZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXHRjb25zb2xlLmxvZygnZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MnKTtcblx0UHJvbWlzZS5tYXAocmVxLmJvZHkubW92aWVzLCBmdW5jdGlvbihtb3ZpZSkge1xuXHRcdC8vZmlyc3QgY2hlY2sgd2hldGhlciBtb3ZpZSBpcyBpbiB0aGUgZGF0YWJhc2Vcblx0XHRyZXR1cm4gbmV3IE1vdmllKHt0aXRsZTogbW92aWUudGl0bGUsIGlkOiBtb3ZpZS5pZH0pLmZldGNoKClcblx0XHQudGhlbihmdW5jdGlvbihmb3VuZE1vdmllKSB7XG5cdFx0XHQvL2lmIG5vdCBjcmVhdGUgb25lXG5cdFx0XHRpZiAoIWZvdW5kTW92aWUpIHtcblx0XHRcdFx0cmV0dXJuIGFkZE9uZU1vdmllKG1vdmllKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBmb3VuZE1vdmllO1xuXHRcdFx0fVxuXHRcdH0pXG5cdFx0LnRoZW4oZnVuY3Rpb24oZm91bmRNb3ZpZSl7XG5cdFx0XHQvLyBjb25zb2xlLmxvZygnZm91bmQgbW92aWUnLCBmb3VuZE1vdmllKTtcblx0XHRcdHJldHVybiBnZXRPbmVNb3ZpZVJhdGluZyhyZXEubXlTZXNzaW9uLnVzZXIsIGZvdW5kTW92aWUuYXR0cmlidXRlcyk7XG5cdFx0fSlcblx0fSlcblx0LnRoZW4oZnVuY3Rpb24ocmF0aW5ncyl7XG5cdFx0Y29uc29sZS5sb2coJ3NlbmRpbmcgcmF0aW5nIHRvIGNsaWVudCcpO1xuXHRcdHJlcy5qc29uKHJhdGluZ3MpO1xuXHR9KVxufVxuXG4vL3RoaXMgaGFuZGxlciBzZW5kcyBhbiBnZXQgcmVxdWVzdCB0byBUTURCIEFQSSB0byByZXRyaXZlIHJlY2VudCB0aXRsZXNcbi8vd2UgY2Fubm90IGRvIGl0IGluIHRoZSBmcm9udCBlbmQgYmVjYXVzZSBjcm9zcyBvcmlnaW4gcmVxdWVzdCBpc3N1ZXNcbmV4cG9ydHMuZ2V0UmVjZW50UmVsZWFzZSA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIHZhciBwYXJhbXMgPSB7XG4gICAgYXBpX2tleTogJzlkM2IwMzVlZjFjZDY2OWFlZDM5ODQwMGIxN2ZjZWEyJyxcbiAgICBwcmltYXJ5X3JlbGVhc2VfeWVhcjogbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpLFxuICAgIGluY2x1ZGVfYWR1bHQ6IGZhbHNlLFxuICAgIHNvcnRfYnk6ICdwb3B1bGFyaXR5LmRlc2MnXG4gIH07XG5cblx0IFxuICB2YXIgZGF0YSA9ICcnO1xuXHRyZXF1ZXN0KHtcblx0XHRtZXRob2Q6ICdHRVQnLFxuXHRcdHVybDogJ2h0dHBzOi8vYXBpLnRoZW1vdmllZGIub3JnLzMvZGlzY292ZXIvbW92aWUvJyxcblx0XHRxczogcGFyYW1zXG5cdH0pXG5cdC5vbignZGF0YScsZnVuY3Rpb24oY2h1bmspe1xuXHRcdGRhdGEgKz0gY2h1bms7XG5cdH0pXG5cdC5vbignZW5kJywgZnVuY3Rpb24oKXtcblx0XHRyZWNlbnRNb3ZpZXMgPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgIHJlcS5ib2R5Lm1vdmllcyA9IHJlY2VudE1vdmllcy5yZXN1bHRzO1xuICAgIC8vdHJhbnNmZXJzIHRoZSBtb3ZpZSBkYXRhIHRvIGdldE11bHRpcGxlTW92aWVSYXRpbmdzIHRvIGRlY29yYXRlIHdpdGggc2NvcmUgKHVzZXIgcmF0aW5nKSBhbmQgYXZnZnJpZW5kUmF0aW5nIGF0dHJpYnV0ZVxuICAgIGV4cG9ydHMuZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MocmVxLCByZXMpO1xuXG5cdH0pXG5cdC5vbignZXJyb3InLCBmdW5jdGlvbihlcnJvcil7XG5cdFx0Y29uc29sZS5sb2coZXJyb3IpO1xuXHR9KVxuXG59XG5cbi8vdGhpcyBpcyBUTURCJ3MgZ2VucmUgY29kZSwgd2UgbWlnaHQgd2FudCB0byBwbGFjZSB0aGlzIHNvbWV3aGVyZSBlbHNlXG52YXIgZ2VucmVzID0ge1xuICAgMTI6IFwiQWR2ZW50dXJlXCIsXG4gICAxNDogXCJGYW50YXN5XCIsXG4gICAxNjogXCJBbmltYXRpb25cIixcbiAgIDE4OiBcIkRyYW1hXCIsXG4gICAyNzogXCJIb3Jyb3JcIixcbiAgIDI4OiBcIkFjdGlvblwiLFxuICAgMzU6IFwiQ29tZWR5XCIsXG4gICAzNjogXCJIaXN0b3J5XCIsXG4gICAzNzogXCJXZXN0ZXJuXCIsXG4gICA1MzogXCJUaHJpbGxlclwiLFxuICAgODA6IFwiQ3JpbWVcIixcbiAgIDk5OiBcIkRvY3VtZW50YXJ5XCIsXG4gICA4Nzg6IFwiU2NpZW5jZSBGaWN0aW9uXCIsXG4gICA5NjQ4OiBcIk15c3RlcnlcIixcbiAgIDEwNDAyOiBcIk11c2ljXCIsXG4gICAxMDc0OTogXCJSb21hbmNlXCIsXG4gICAxMDc1MTogXCJGYW1pbHlcIixcbiAgIDEwNzUyOiBcIldhclwiLFxuICAgMTA3Njk6IFwiRm9yZWlnblwiLFxuICAgMTA3NzA6IFwiVFYgTW92aWVcIlxuIH07XG5cbi8vdGhpcyBmdW5jdGlvbiB3aWxsIHNlbmQgYmFjayBzZWFyY2IgbW92aWVzIHVzZXIgaGFzIHJhdGVkIGluIHRoZSBkYXRhYmFzZVxuLy9pdCB3aWxsIHNlbmQgYmFjayBtb3ZpZSBvYmpzIHRoYXQgbWF0Y2ggdGhlIHNlYXJjaCBpbnB1dCwgZXhwZWN0cyBtb3ZpZSBuYW1lIGluIHJlcS5ib2R5LnRpdGxlXG5leHBvcnRzLnNlYXJjaFJhdGVkTW92aWUgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICByZXR1cm4gUmF0aW5nLnF1ZXJ5KGZ1bmN0aW9uKHFiKXtcblx0XHRxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcblx0XHRxYi5pbm5lckpvaW4oJ21vdmllcycsICdyYXRpbmdzLm1vdmllaWQnLCAnPScsICdtb3ZpZXMuaWQnKTtcblx0XHRxYi5zZWxlY3QoJ3VzZXJzLnVzZXJuYW1lJywgJ21vdmllcy50aXRsZScsICdtb3ZpZXMuaWQnLCAnbW92aWVzLmdlbnJlJywgJ21vdmllcy5wb3N0ZXInLCAnbW92aWVzLnJlbGVhc2VfZGF0ZScsICdtb3ZpZXMuaW1kYlJhdGluZycsICdtb3ZpZXMuZGVzY3JpcHRpb24nLCAncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycpO1xuICBcdHFiLndoZXJlUmF3KGBNQVRDSCAobW92aWVzLnRpdGxlKSBBR0FJTlNUICgnJHtyZXEucXVlcnkudGl0bGV9JyBJTiBOQVRVUkFMIExBTkdVQUdFIE1PREUpYClcbiAgXHRxYi5hbmRXaGVyZSgndXNlcnMudXNlcm5hbWUnLCAnPScsIHJlcS5teVNlc3Npb24udXNlcilcbiAgXHRxYi5vcmRlckJ5KCd1cGRhdGVkX2F0JywgJ0RFU0MnKVxuICB9KVxuICAuZmV0Y2hBbGwoKVxuICAudGhlbihmdW5jdGlvbihtYXRjaGVzKXtcbiAgXHRjb25zb2xlLmxvZyhtYXRjaGVzLm1vZGVscyk7XG4gIFx0cmVzLmpzb24obWF0Y2hlcyk7XG4gIH0pXG59XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy9mcmllbmRzaGlwIGhhbmRsZXJzXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuZXhwb3J0cy5nZXRGcmllbmRMaXN0ID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcblx0cmV0dXJuIFJlbGF0aW9uLnF1ZXJ5KGZ1bmN0aW9uKHFiKXtcblx0XHRxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JlbGF0aW9ucy51c2VyMWlkJywgJz0nLCAndXNlcnMuaWQnKTtcblx0XHRxYi5zZWxlY3QoJ3JlbGF0aW9ucy51c2VyMmlkJyk7XG5cdFx0cWIud2hlcmUoe1xuXHRcdFx0J3VzZXJzLnVzZXJuYW1lJzogcmVxLm15U2Vzc2lvbi51c2VyXG5cdFx0fSlcblx0fSlcblx0LmZldGNoQWxsKClcblx0LnRoZW4oZnVuY3Rpb24oZnJpZW5kcyl7XG5cdFx0cmV0dXJuIFByb21pc2UubWFwKGZyaWVuZHMubW9kZWxzLCBmdW5jdGlvbihmcmllbmQpIHtcblx0XHRcdHJldHVybiBuZXcgVXNlcih7aWQ6IGZyaWVuZC5hdHRyaWJ1dGVzLnVzZXIyaWR9KS5mZXRjaCgpXG5cdFx0XHQudGhlbihmdW5jdGlvbihmcmllbmRVc2VyKXtcblx0XHRcdFx0cmV0dXJuIGZyaWVuZFVzZXIuYXR0cmlidXRlcy51c2VybmFtZTtcblx0XHRcdH0pXG5cdFx0fSlcblx0fSlcblx0LnRoZW4oZnVuY3Rpb24oZnJpZW5kcyl7XG5cdFx0Y29uc29sZS5sb2coJ3NlbmRpbmcgYSBsaXN0IG9mIGZyaWVuZCBuYW1lcycsIGZyaWVuZHMpO1xuXHRcdHJlcy5qc29uKGZyaWVuZHMpO1xuXHR9KVxufVxuXG4vL3RoaXMgd291bGQgc2VuZCBhIG5vdGljZSB0byB0aGUgdXNlciB3aG8gcmVjZWl2ZSB0aGUgZnJpZW5kIHJlcXVlc3QsIHByb21wdGluZyB0aGVtIHRvIGFjY2VwdCBvciBkZW55IHRoZSByZXF1ZXN0XG5leHBvcnRzLmFkZEZyaWVuZCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cbn07XG5cblxuLy90aGlzIHdvdWxkIGNvbmZpcm0gdGhlIGZyaWVuZHNoaXAgYW5kIGVzdGFibGlzaCB0aGUgcmVsYXRpb25zaGlwIGluIHRoZSBkYXRhYmFzZVxuZXhwb3J0cy5jb25maXJtRnJpZW5kc2hpcCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cbn07XG5cblxuXG5leHBvcnRzLmdldEZyaWVuZHMgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICB2YXIgcGVvcGxlSWQgPSBbXTtcbiAgdmFyIGlkID0gcmVxLm15U2Vzc2lvbi51c2VyXG4gIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgaWQsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xuICAgIHZhciB1c2VyaWQgPSByZXNwWzBdLmlkO1xuICAgIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBiZSBsaW5nLzInLGlkKVxuICBcbiAgICBjb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gcmF0aW5ncyBXSEVSRSB1c2VyaWQgPSA/JywgdXNlcmlkLCBmdW5jdGlvbihlcnIsIHJlc3ApIHtcbiAgICAgIHZhciB1c2Vyc1JhdGluZ3M9cmVzcC5tYXAoZnVuY3Rpb24oYSl7IHJldHVybiBbYS5tb3ZpZWlkLCBhLnNjb3JlXX0pO1xuXG4gICAgICBjb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gcmVsYXRpb25zIFdIRVJFIHVzZXIxaWQgPSA/JywgdXNlcmlkLCBmdW5jdGlvbihlcnIsIHJlc3ApIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXNwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHBlb3BsZUlkLmluZGV4T2YocmVzcFtpXS51c2VyMmlkKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHBlb3BsZUlkLnB1c2gocmVzcFtpXS51c2VyMmlkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHBlb3BsZSA9IFtdXG4gICAgICAgIGNvbnNvbGUubG9nKCdUaGlzIHNob3VsZCBhbHNvIGJlIHBlb3BsZWVlJyxwZW9wbGVJZCk7XG4gICAgICAgIHZhciBrZXlJZD17fTtcbiAgICAgICAgcGVvcGxlSWQuZm9yRWFjaChmdW5jdGlvbihhKSB7XG5cbiAgICAgICAgICBjb24ucXVlcnkoJ1NFTEVDVCB1c2VybmFtZSBGUk9NIHVzZXJzIFdIRVJFIGlkID0gPycsIGEsIGZ1bmN0aW9uKGVyciwgcmVzcG8pIHtcbiAgXHQgICAgICAgIGtleUlkW2FdPXJlc3BvWzBdLnVzZXJuYW1lO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3RoaXMgaXMgT05FIG9mIHRoZSBwZW9wbGUhIScscmVzcG9bMF0udXNlcm5hbWUpXG4gICAgICAgICAgICBjb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gcmF0aW5ncyBXSEVSRSB1c2VyaWQgPScrJ1wiJythKydcIicsIGZ1bmN0aW9uKGVyciwgcmUpIHtcbiAgICAgIFx0ICAgICAgY29uc29sZS5sb2coJ3RoaXMgaXMgYScsYSlcbiAgICAgIFx0ICAgICAgaWYgKHJlLmxlbmd0aD09PTApe1xuICAgICAgXHRcdCAgICAgIHJlPVt7dXNlcmlkOmEsbW92aWVpZDpNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkqMTAwMDApLHNjb3JlOjk5fV1cbiAgICAgIFx0ICAgICAgfVxuICAgICAgXHQgICAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgYmUgdGhlIHJhdGluZ3MgZnJvbSBlYWNoIHBlcnNvbiEhJyxyZSk7XG5cbiAgICAgICAgICAgICAgcGVvcGxlLnB1c2gocmUubWFwKGZ1bmN0aW9uKGEpe3JldHVybiBbYS51c2VyaWQsYS5tb3ZpZWlkLGEuc2NvcmVdO30pKTtcbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIGlmIChwZW9wbGUubGVuZ3RoPT09cGVvcGxlSWQubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICB2YXIgZmluYWwgPSB7fTtcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBiZSBwZW9wbGUnLCBwZW9wbGUpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGVvcGxlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICBpZiAocGVvcGxlW2ldWzBdIT09dW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICAgICAgZmluYWxba2V5SWRbcGVvcGxlW2ldWzBdWzBdXV0gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBwZW9wbGVbaV0ubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICBmaW5hbFtrZXlJZFtwZW9wbGVbaV1bMF1bMF1dXS5wdXNoKFtdKTtcbiAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB6ID0gMTsgeiA8IHBlb3BsZVtpXVt4XS5sZW5ndGg7IHorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmluYWxba2V5SWRbcGVvcGxlW2ldWzBdWzBdXV1beF0ucHVzaChwZW9wbGVbaV1beF1bel0pXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZpbmFsJyxmaW5hbCx1c2Vyc1JhdGluZ3MpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGNvbXBhcmlzb25zPXt9O1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBmaW5hbCl7XG4gICAgICAgICAgICAgICAgICBjb21wYXJpc29uc1trZXldPWNvbXAodXNlcnNSYXRpbmdzLGZpbmFsW2tleV0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvbXBhcmlzb25zKTtcbiAgICAgICAgICAgICAgICB2ZXJ5RmluYWw9W107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGNvbXBhcmlzb25zKXtcbiAgICAgICAgICAgICAgICAgIHZlcnlGaW5hbC5wdXNoKFtrZXksY29tcGFyaXNvbnNba2V5XV0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHZlcnlGaW5hbCk7XG4gICAgICAgICAgICAgICAgcmVzLnNlbmQodmVyeUZpbmFsKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn07XG5cblxuXG4vL1RCRFxuZXhwb3J0cy5nZXRIaWdoQ29tcGF0aWJpbGl0eVVzZXJzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgXG59O1xuXG5cbi8vVEJEXG5leHBvcnRzLmdldFJlY29tbWVuZGVkTW92aWVzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcblxufTsiXX0=
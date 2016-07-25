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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9yZXF1ZXN0LWhhbmRsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQSxJQUFJLFNBQVEsU0FBUixNQUFRLENBQVMsSUFBVCxFQUFjLElBQWQsRUFBbUI7QUFDL0IsTUFBSSxPQUFLLEtBQUssR0FBTCxDQUFTLE9BQUssSUFBZCxDQUFUO0FBQ0EsU0FBTyxJQUFFLElBQVQ7QUFDQyxDQUhEOztBQUtBLElBQUksT0FBTyxTQUFQLElBQU8sQ0FBUyxLQUFULEVBQWdCLE1BQWhCLEVBQXdCO0FBQ25DLE1BQUksUUFBTyxFQUFYO0FBQ0UsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFHLE1BQU0sTUFBekIsRUFBaUMsR0FBakMsRUFBc0M7O0FBRXBDLFNBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxPQUFPLE1BQTNCLEVBQW1DLEdBQW5DLEVBQXdDOztBQUV0QyxVQUFJLE1BQU0sQ0FBTixFQUFTLENBQVQsTUFBZ0IsT0FBTyxDQUFQLEVBQVUsQ0FBVixDQUFwQixFQUFrQzs7QUFFcEMsY0FBTSxJQUFOLENBQVcsT0FBTyxNQUFNLENBQU4sRUFBUyxDQUFULENBQVAsRUFBbUIsT0FBTyxDQUFQLEVBQVUsQ0FBVixDQUFuQixDQUFYO0FBRUc7QUFDRjtBQUNGO0FBQ0gsTUFBSSxNQUFLLE1BQU0sTUFBTixDQUFhLFVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYTtBQUFDLFdBQU8sSUFBRSxDQUFUO0FBQVcsR0FBdEMsRUFBdUMsQ0FBdkMsQ0FBVDtBQUNBLFNBQU8sS0FBSyxLQUFMLENBQVcsS0FBRyxHQUFILEdBQU8sTUFBTSxNQUF4QixDQUFQO0FBQ0MsQ0FmRDs7Ozs7QUF3QkEsSUFBSSxLQUFLLFFBQVEscUJBQVIsQ0FBVDtBQUNBLElBQUksUUFBUSxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUksVUFBVSxRQUFRLFNBQVIsQ0FBZDtBQUNBLElBQUksUUFBUSxRQUFRLHFCQUFSLENBQVo7QUFDQSxJQUFJLFNB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O0FBeURELEtBNUREO0FBNkRELEdBakVEO0FBa0VELENBckVEOzs7QUEwRUEsUUFBUSx5QkFBUixHQUFvQyxVQUFTLEdBQVQsRUFBYyxHQUFkLEVBQW1CLENBRXRELENBRkQ7OztBQU1BLFFBQVEsb0JBQVIsR0FBK0IsVUFBUyxHQUFULEVBQWMsR0FBZCxFQUFtQixDQUVqRCxDQUZEIiwiZmlsZSI6InJlcXVlc3QtaGFuZGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vVGhlIGFsZ29yaXRobVxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG52YXIgaGVscGVyPSBmdW5jdGlvbihudW0xLG51bTIpe1xudmFyIGRpZmY9TWF0aC5hYnMobnVtMS1udW0yKTtcbnJldHVybiA1LWRpZmY7XG59XG5cbnZhciBjb21wID0gZnVuY3Rpb24oZmlyc3QsIHNlY29uZCkge1xudmFyIGZpbmFsPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaTwgZmlyc3QubGVuZ3RoOyBpKyspIHtcblxuICAgIGZvciAodmFyIHggPSAwOyB4IDwgc2Vjb25kLmxlbmd0aDsgeCsrKSB7XG5cbiAgICAgIGlmIChmaXJzdFtpXVswXSA9PT0gc2Vjb25kW3hdWzBdKSB7XG5cbiAgICBmaW5hbC5wdXNoKGhlbHBlcihmaXJzdFtpXVsxXSxzZWNvbmRbeF1bMV0pKVxuXG4gICAgICB9XG4gICAgfVxuICB9XG52YXIgc3VtPSBmaW5hbC5yZWR1Y2UoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYStifSwwKTtcbnJldHVybiBNYXRoLnJvdW5kKDIwKnN1bS9maW5hbC5sZW5ndGgpXG59XG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuXG5cblxuXG52YXIgZGIgPSByZXF1aXJlKCcuLi9hcHAvZGJDb25uZWN0aW9uJyk7XG52YXIgbXlzcWwgPSByZXF1aXJlKCdteXNxbCcpO1xudmFyIGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XG52YXIgTW92aWUgPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL21vdmllJyk7XG52YXIgUmF0aW5nID0gcmVxdWlyZSgnLi4vYXBwL21vZGVscy9yYXRpbmcnKTtcbnZhciBSZWxhdGlvbiA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvcmVsYXRpb24nKTtcbnZhciBVc2VyID0gcmVxdWlyZSgnLi4vYXBwL21vZGVscy91c2VyJyk7XG52YXIgYWxsUmVxdWVzdCA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvYWxsUmVxdWVzdCcpO1xuXG52YXIgTW92aWVzID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL21vdmllcycpO1xudmFyIFJhdGluZ3MgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvcmF0aW5ncycpO1xudmFyIFJlbGF0aW9ucyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy9yZWxhdGlvbnMnKTtcbnZhciBVc2VycyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy91c2VycycpO1xudmFyIGFsbFJlcXVlc3RzID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL2FsbFJlcXVlc3RzJyk7XG5cbnZhciBQcm9taXNlID0gcmVxdWlyZShcImJsdWViaXJkXCIpO1xudmFyIHJlcXVlc3QgPSByZXF1aXJlKCdyZXF1ZXN0Jyk7XG5cbnZhciBjb24gPSBteXNxbC5jcmVhdGVDb25uZWN0aW9uKHtcbiAgaG9zdDogXCJsb2NhbGhvc3RcIixcbiAgdXNlcjogXCJyb290XCIsXG4gIHBhc3N3b3JkOiBcIjEyM1wiLFxuICBkYXRhYmFzZTogXCJNYWluRGF0YWJhc2VcIlxufSk7XG5cbi8vIHZhciBjb24gPSBteXNxbC5jcmVhdGVDb25uZWN0aW9uKHtcbi8vICAgaG9zdCAgICAgOiAndXMtY2Rici1pcm9uLWVhc3QtMDQuY2xlYXJkYi5uZXQnLFxuLy8gICB1c2VyICAgICA6ICdiMDM5MTZlNzUwZTgxZCcsXG4vLyAgIHBhc3N3b3JkIDogJ2JlZjRmNzc1Jyxcbi8vICAgZGF0YWJhc2UgOiAnaGVyb2t1XzkxOWJjYzgwMDViZmQ0Yydcbi8vIH0pO1xuXG5jb24uY29ubmVjdChmdW5jdGlvbihlcnIpe1xuICBpZihlcnIpe1xuICAgIGNvbnNvbGUubG9nKCdFcnJvciBjb25uZWN0aW5nIHRvIERiJyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnNvbGUubG9nKCdDb25uZWN0aW9uIGVzdGFibGlzaGVkJyk7XG59KTtcblxuLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy91c2VyIGF1dGhcbi8vLy8vLy8vLy8vLy8vLy8vXG5cbmV4cG9ydHMuc2lnbnVwVXNlciA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cdGNvbnNvbGUubG9nKCdjYWxsaW5nIGxvZ2luJywgcmVxLmJvZHkpO1xuXHQvLyBjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgc2Vzc2lvbicscmVxLnNlc3Npb24pXG4gIG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUgfSkuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGZvdW5kKSB7XG5cdCAgaWYgKGZvdW5kKSB7XG5cdCAgXHQvL2NoZWNrIHBhc3N3b3JkXG5cdCAgXHQgICAvL2lmIChwYXNzd29yZCBtYXRjaGVzKVxuXHQgIFx0ICAgLy97IGFkZCBzZXNzaW9ucyBhbmQgcmVkaXJlY3R9XG5cdCAgXHRjb25zb2xlLmxvZygndXNlcm5hbWUgYWxyZWFkeSBleGlzdCwgY2Fubm90IHNpZ251cCAnLCByZXEuYm9keS5uYW1lKTtcblx0ICAgIHJlcy5zdGF0dXMoNDAzKS5zZW5kKCd1c2VybmFtZSBleGlzdCcpO1xuXHQgIH0gZWxzZSB7XG5cdCAgXHRjb25zb2xlLmxvZygnY3JlYXRpbmcgdXNlcicpO1xuICAgICAgcmVxLm15U2Vzc2lvbi51c2VyID0gcmVxLmJvZHkubmFtZTtcblx0ICAgIFVzZXJzLmNyZWF0ZSh7XG5cdCAgICAgIHVzZXJuYW1lOiByZXEuYm9keS5uYW1lLFxuXHQgICAgICBwYXNzd29yZDogcmVxLmJvZHkucGFzc3dvcmQsXG5cdCAgICB9KVxuXHQgICAgLnRoZW4oZnVuY3Rpb24odXNlcikge1xuXHRcdCAgXHRjb25zb2xlLmxvZygnY3JlYXRlZCBhIG5ldyB1c2VyJyk7XG5cdCAgICAgIHJlcy5zdGF0dXMoMjAxKS5zZW5kKCdsb2dpbiBjcmVhdGVkJyk7XG5cdCAgICB9KTtcblx0ICB9XG5cdH0pO1xufTtcblxuXG5leHBvcnRzLnNlbmRXYXRjaFJlcXVlc3QgPSBmdW5jdGlvbihyZXEsIHJlc3BvbnNlKSB7XG5cdGNvbnNvbGUubG9nKHJlcS5ib2R5LnJlcXVlc3RlZSlcblx0aWYgKEFycmF5LmlzQXJyYXkocmVxLmJvZHkucmVxdWVzdGVlKSkge1xuXHRcdHZhciByZXF1ZXN0ZWVzID0gcmVxLmJvZHkucmVxdWVzdGVlO1xuXHR9IGVsc2Uge1xuXHRcdHZhciByZXF1ZXN0ZWVzID0gW3JlcS5ib2R5LnJlcXVlc3RlZV07XG5cdH1cblx0UHJvbWlzZS5lYWNoKHJlcXVlc3RlZXMsIGZ1bmN0aW9uKHJlcXVlc3RlZSl7XG5cdFx0dmFyIHJlcXVlc3QgPSB7XG4gICAgICBtZXNzYWdlOiByZXEuYm9keS5tZXNzYWdlLFxuXHRcdFx0cmVxdWVzdG9yOiByZXEubXlTZXNzaW9uLnVzZXIsIFxuXHRcdFx0cmVxdWVzdFR5cDond2F0Y2gnLFxuXHRcdFx0bW92aWU6cmVxLmJvZHkubW92aWUsXG5cdFx0XHRyZXF1ZXN0ZWU6IHJlcXVlc3RlZVxuXHRcdH07XG5cdFx0Y29uLnF1ZXJ5KCdJTlNFUlQgSU5UTyBhbGxyZXF1ZXN0cyBTRVQgPycsIHJlcXVlc3QsIGZ1bmN0aW9uKGVycixyZXMpe1xuXHRcdCAgaWYoZXJyKSB0aHJvdyBlcnI7XG5cdFx0ICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcblx0XHR9KTtcblx0fSlcblx0LnRoZW4oZnVuY3Rpb24oZG9uZSl7XG5cdFx0cmVzcG9uc2Uuc2VuZCgnVGhhdHMgbXkgc3R5bGUhJyk7XG5cdH0pXG59XG5cbmV4cG9ydHMucmVtb3ZlV2F0Y2hSZXF1ZXN0ID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkocmVxLmJvZHkucmVxdWVzdGVlKSkge1xuICAgIHZhciByZXF1ZXN0ZWVzID0gcmVxLmJvZHkucmVxdWVzdGVlO1xuICB9IGVsc2Uge1xuICAgIHZhciByZXF1ZXN0ZWVzID0gW3JlcS5ib2R5LnJlcXVlc3RlZV07XG4gIH1cbiAgdmFyIHJlcXVlc3Rvcj1yZXEuYm9keS5yZXF1ZXN0b3I7XG4gIHZhciBtb3ZpZSA9IHJlcS5ib2R5Lm1vdmllO1xuXG4gIGFsbFJlcXVlc3QuZm9yZ2Uoe3JlcXVlc3RvcjogcmVxdWVzdG9yLCByZXF1ZXN0ZWU6IHJlcXVlc3RlZXMsIG1vdmllOiBtb3ZpZSB9KVxuICAgIC5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oYWxsUmVxdWVzdCkge1xuICAgICAgYWxsUmVxdWVzdC5kZXN0cm95KClcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmVzLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogJ1VzZXIgc3VjY2Vzc2Z1bGx5IGRlbGV0ZWQnfX0pO1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XG4gICAgICAgIH0pO1xuICAgIH0pXG4gICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XG4gICAgfSk7XG59O1xuXG5cbmV4cG9ydHMuc2VuZFJlcXVlc3QgPSBmdW5jdGlvbihyZXEsIHJlc3BvbnNlKSB7XG4gIGNvbnNvbGUubG9nKCd0aGlzIGlzIHdoYXQgSW0gZ2V0dGluZycsIHJlcS5ib2R5KTtcbiAgaWYgKHJlcS5teVNlc3Npb24udXNlcj09PXJlcS5ib2R5Lm5hbWUpe1xuICAgIHJlc3BvbnNlLnNlbmQoXCJZb3UgY2FuJ3QgZnJpZW5kIHlvdXJzZWxmIVwiKVxuICB9IGVsc2Uge1xuXG52YXIgcmVxdWVzdCA9IHtyZXF1ZXN0b3I6IHJlcS5teVNlc3Npb24udXNlciwgcmVxdWVzdGVlOiByZXEuYm9keS5uYW1lLCByZXF1ZXN0VHlwOidmcmllbmQnfTtcblxuY29uLnF1ZXJ5KCdTRUxFQ1QgcmVxdWVzdGVlLHJlc3BvbnNlIEZST00gYWxscmVxdWVzdHMgV0hFUkUgIHJlcXVlc3RvciA9ID8gQU5EIHJlcXVlc3RUeXAgPScrJ1wiJysgJ2ZyaWVuZCcrJ1wiJywgcmVxdWVzdFsncmVxdWVzdG9yJ10sIGZ1bmN0aW9uKGVycixyZXMpe1xuaWYgKHJlcyA9PT0gdW5kZWZpbmVkKSB7XG4gIHJlc3BvbnNlLnNlbmQoJ25vIGZyaWVuZHMnKVxufVxudmFyIHRlc3Q9cmVzLmZpbHRlcihmdW5jdGlvbihhKXtyZXR1cm4gYS5yZXNwb25zZT09PW51bGx9KVxudmFyIHRlc3QyPXRlc3QubWFwKGZ1bmN0aW9uKGEpeyByZXR1cm4gYS5yZXF1ZXN0ZWV9KVxuY29uc29sZS5sb2coJ25hbWVzIG9mIHBlb3BsZSB3aG9tIEl2ZSByZXF1ZXN0ZWQgYXMgZnJpZW5kcycsdGVzdCk7XG5cblxuXG5jb24ucXVlcnkoJ0lOU0VSVCBJTlRPIGFsbHJlcXVlc3RzIFNFVCA/JywgcmVxdWVzdCwgZnVuY3Rpb24oZXJyLHJlc3Ape1xuICBpZihlcnIpIHRocm93IGVycjtcbiAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlc3AuaW5zZXJ0SWQpO1xuICByZXNwb25zZS5zZW5kKHRlc3QyKTtcbn0pXG59KTtcblxuIH1cbn07XG5cblxuXG5cblxuXG5cblxuXG5leHBvcnRzLmxpc3RSZXF1ZXN0cyA9IGZ1bmN0aW9uKHJlcSwgcmVzcG9uc2UpIHtcbiAgdmFyIHJlcXVlc3QgPSByZXEubXlTZXNzaW9uLnVzZXJcblxuICBjb24ucXVlcnkoJ1NlbGVjdCAqIEZST00gYWxscmVxdWVzdHMgV0hFUkUgcmVxdWVzdGVlPScrJ1wiJytyZXF1ZXN0KydcIicrJycrJ09SIHJlcXVlc3RvciA9JysnXCInK3JlcXVlc3QrJ1wiJysnJywgZnVuY3Rpb24oZXJyLHJlcyl7XG4gIGlmKGVycikgdGhyb3cgZXJyO1xuICBjb25zb2xlLmxvZyhyZXMpXG4gIHJlc3BvbnNlLnNlbmQoW3JlcyxyZXF1ZXN0XSk7XG59KTtcblxuXG59O1xuXG5leHBvcnRzLmFjY2VwdCA9IGZ1bmN0aW9uKHJlcSwgcmVzcG9uc2UpIHtcbiAgdmFyIHJlcXVlc3Rvcj1yZXEuYm9keS5wZXJzb25Ub0FjY2VwdDtcbiAgdmFyIHJlcXVlc3RlZT1yZXEubXlTZXNzaW9uLnVzZXI7XG4gIHZhciBtb3ZpZSA9IHJlcS5ib2R5Lm1vdmllO1xuICB2YXIgcmVxdWVzdFR5cGUgPSBcImZyaWVuZFwiO1xuXG4gIGlmIChtb3ZpZSA9PT0gJycpIHtcbiAgICBjb24ucXVlcnkoJ1VQREFURSBhbGxyZXF1ZXN0cyBTRVQgcmVzcG9uc2U9JysnXCInICsgJ3llcycgKyAnXCInKycgIFdIRVJFIHJlcXVlc3RvciA9ICcrJ1wiJysgcmVxdWVzdG9yKydcIicrJyBBTkQgcmVxdWVzdFR5cD0nKydcIicrcmVxdWVzdFR5cGUrJ1wiJywgZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XG4gICAgfSk7XG5cbiAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCByZXEuYm9keS5wZXJzb25Ub0FjY2VwdCwgZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlc1swXS5pZCwgZXJyKTtcbiAgICB2YXIgcGVyc29uMSA9IHJlc1swXS5pZDtcbiAgICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIHJlcS5teVNlc3Npb24udXNlciwgZnVuY3Rpb24oZXJyLCByZXNwKSB7XG4gICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzcFswXS5pZCwgZXJyKTtcblxuICAgICAgdmFyIHBlcnNvbjIgPSByZXNwWzBdLmlkO1xuICAgICAgdmFyIHJlcXVlc3QgPSB7XG4gICAgICAgIHVzZXIxaWQ6IHBlcnNvbjEsXG4gICAgICAgIHVzZXIyaWQ6IHBlcnNvbjJcbiAgICAgIH1cbiAgICAgIHZhciByZXF1ZXN0MiA9IHtcbiAgICAgICAgdXNlcjFpZDogcGVyc29uMixcbiAgICAgICAgdXNlcjJpZDogcGVyc29uMVxuICAgICAgfVxuXG4gICAgICBjb25zb2xlLmxvZygndGhlIHJlcXVlc3RzOjo6JyxyZXF1ZXN0LHJlcXVlc3QyKVxuICAgICAgY29uLnF1ZXJ5KCdJTlNFUlQgSU5UTyByZWxhdGlvbnMgU0VUID8nLCByZXF1ZXN0LCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xuXG4gICAgICBjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIHJlbGF0aW9ucyBTRVQgPycsIHJlcXVlc3QyLCBmdW5jdGlvbihlcnIsIHJlcykge1xuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XG5cbiAgICAgICAgICAgcmVzcG9uc2Uuc2VuZCgnVGhhdHMgbXkgc3R5bGUhISEnKTtcbiAgICAgICAgfSlcbiAgICAgIH0pO1xuICAgIH0pXG4gIH0pXG4gIH0gZWxzZSB7XG4gIGNvbnNvbGUubG9nKCd0aGlzIGlzIHJlcSBib2R5ICcscmVxLmJvZHkpO1xuXG4gIGNvbi5xdWVyeSgnVVBEQVRFIGFsbHJlcXVlc3RzIFNFVCByZXNwb25zZT0nKydcIicgKyAneWVzJyArICdcIicrJyAgV0hFUkUgcmVxdWVzdG9yID0gJysnXCInKyByZXF1ZXN0b3IrJ1wiJysnIEFORCBtb3ZpZT0nKydcIicrIG1vdmllKydcIicsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XG4gICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XG4gIH0pO1xuXG4gIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgcmVxLmJvZHkucGVyc29uVG9BY2NlcHQsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XG4gICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXNbMF0uaWQsIGVycik7XG4gICAgdmFyIHBlcnNvbjEgPSByZXNbMF0uaWQ7XG4gICAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCByZXEubXlTZXNzaW9uLnVzZXIsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xuICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlc3BbMF0uaWQsIGVycik7XG5cbiAgICAgIHZhciBwZXJzb24yID0gcmVzcFswXS5pZDtcbiAgICAgIHZhciByZXF1ZXN0ID0ge1xuICAgICAgICB1c2VyMWlkOiBwZXJzb24xLFxuICAgICAgICB1c2VyMmlkOiBwZXJzb24yXG4gICAgICB9XG4gICAgICB2YXIgcmVxdWVzdDIgPSB7XG4gICAgICAgIHVzZXIxaWQ6IHBlcnNvbjIsXG4gICAgICAgIHVzZXIyaWQ6IHBlcnNvbjFcbiAgICAgIH1cblxuICAgICAgY29uc29sZS5sb2coJ3RoZSByZXF1ZXN0czo6OicscmVxdWVzdCxyZXF1ZXN0MilcbiAgICAgIGNvbi5xdWVyeSgnSU5TRVJUIElOVE8gcmVsYXRpb25zIFNFVCA/JywgcmVxdWVzdCwgZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcblxuICAgICAgY29uLnF1ZXJ5KCdJTlNFUlQgSU5UTyByZWxhdGlvbnMgU0VUID8nLCByZXF1ZXN0MiwgZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xuXG4gICAgICAgICAgIHJlc3BvbnNlLnNlbmQoJ1RoYXRzIG15IHN0eWxlISEhJyk7XG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgICB9KVxuICB9KVxufVxuICAvLyBhbGxSZXF1ZXN0LmZvcmdlKHtyZXF1ZXN0b3I6IHJlcXVlc3RvciwgcmVxdWVzdGVlOiByZXF1ZXN0ZWV9KVxuICAvLyAgIC5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oYWxsUmVxdWVzdCkge1xuICAvLyAgICAgYWxsUmVxdWVzdC5kZXN0cm95KClcbiAgLy8gICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XG4gIC8vICAgICAgICAgcmVzcG9uc2UuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiAnVXNlciBzdWNjZXNzZnVsbHkgZGVsZXRlZCd9fSk7XG4gIC8vICAgICAgIH0pXG4gIC8vICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgLy8gICAgICAgICByZXNwb25zZS5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xuICAvLyAgICAgICB9KTtcbiAgLy8gICB9KVxuICAvLyAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgLy8gICAgIHJlc3BvbnNlLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XG4gIC8vICAgfSk7XG59O1xuXG5leHBvcnRzLnJlbW92ZVJlcXVlc3QgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICB2YXIgcmVxdWVzdG9yPXJlcS5ib2R5LnJlcXVlc3RvcjtcbiAgdmFyIHJlcXVlc3RlZT1yZXEuYm9keS5yZXF1ZXN0ZWU7XG5cbiAgYWxsUmVxdWVzdC5mb3JnZSh7cmVxdWVzdG9yOiByZXF1ZXN0b3IsIHJlcXVlc3RlZTogcmVxdWVzdGVlfSlcbiAgICAuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGFsbFJlcXVlc3QpIHtcbiAgICAgIGFsbFJlcXVlc3QuZGVzdHJveSgpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJlcy5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6ICdVc2VyIHN1Y2Nlc3NmdWxseSBkZWxldGVkJ319KTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IHJlcS5ib2R5fX0pO1xuICAgICAgICB9KTtcbiAgICB9KVxuICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IHJlcS5ib2R5fX0pO1xuICAgIH0pO1xufVxuXG5leHBvcnRzLmdldFRoaXNGcmllbmRzTW92aWVzPWZ1bmN0aW9uKHJlcSxyZXNwb25zZSl7XG5cbiAgdmFyIG1vdmllcz1bXTtcbiAgY29uc29sZS5sb2cocmVxLmJvZHkuc3BlY2lmaWNGcmllbmQpO1xuICB2YXIgcGVyc29uPXJlcS5ib2R5LnNwZWNpZmljRnJpZW5kXG4gIHZhciBpZD1udWxsXG4gIHZhciBsZW49bnVsbDtcbiAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCBwZXJzb24sIGZ1bmN0aW9uKGVyciwgcmVzcCl7XG5jb25zb2xlLmxvZyhyZXNwKVxuaWQ9cmVzcFswXS5pZDtcblxuXG5jb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gcmF0aW5ncyBXSEVSRSB1c2VyaWQgPSA/JywgaWQgLGZ1bmN0aW9uKGVycixyZXNwKXtcbmNvbnNvbGUubG9nKCdlcnJycnJycnJyJyxlcnIscmVzcC5sZW5ndGgpXG5sZW49cmVzcC5sZW5ndGg7XG5yZXNwLmZvckVhY2goZnVuY3Rpb24oYSl7XG5cbmNvbi5xdWVyeSgnU0VMRUNUIHRpdGxlIEZST00gbW92aWVzIFdIRVJFIGlkID0gPycsIGEubW92aWVpZCAsZnVuY3Rpb24oZXJyLHJlc3Ape1xuICBjb25zb2xlLmxvZyhyZXNwKVxubW92aWVzLnB1c2goW3Jlc3BbMF0udGl0bGUsYS5zY29yZSxhLnJldmlld10pXG5jb25zb2xlLmxvZyhtb3ZpZXMpXG5pZiAobW92aWVzLmxlbmd0aD09PWxlbil7XG4gIHJlc3BvbnNlLnNlbmQobW92aWVzKTtcbn1cbn0pXG5cbn0pXG5cbn0pXG5cblxuICB9XG5cbil9XG5cbmV4cG9ydHMuZmluZE1vdmllQnVkZGllcz1mdW5jdGlvbihyZXEscmVzcG9uc2Upe1xuICBjb25zb2xlLmxvZyhcInlvdSdyZSB0cnlpbmcgdG8gZmluZCBidWRkaWVzISFcIik7XG5jb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gdXNlcnMnLGZ1bmN0aW9uKGVycixyZXNwKXtcbiAgdmFyIHBlb3BsZT1yZXNwLm1hcChmdW5jdGlvbihhKXtyZXR1cm4gYS51c2VybmFtZX0pXG4gIHZhciBJZHM9IHJlc3AubWFwKGZ1bmN0aW9uKGEpe3JldHVybiBhLmlkfSlcbiAgdmFyIGlkS2V5T2JqPXt9XG5mb3IgKHZhciBpPTA7aTxJZHMubGVuZ3RoO2krKyl7XG4gIGlkS2V5T2JqW0lkc1tpXV09cGVvcGxlW2ldXG59XG5jb25zb2xlLmxvZygnY3VycmVudCB1c2VyJyxyZXEubXlTZXNzaW9uLnVzZXIpO1xudmFyIGN1cnJlbnRVc2VyPXJlcS5teVNlc3Npb24udXNlclxuXG5cbiB2YXIgb2JqMT17fTtcbiAgZm9yICh2YXIgaT0wO2k8SWRzLmxlbmd0aDtpKyspe1xub2JqMVtpZEtleU9ialtJZHNbaV1dXT1bXTtcbiAgfVxuXG4gIGNvbi5xdWVyeSgnU0VMRUNUIHNjb3JlLG1vdmllaWQsdXNlcmlkIEZST00gcmF0aW5ncycsZnVuY3Rpb24oZXJyLHJlc3Bvbil7XG4gIFxuZm9yICh2YXIgaT0wO2k8cmVzcG9uLmxlbmd0aDtpKyspe1xuICBvYmoxW2lkS2V5T2JqW3Jlc3BvbltpXS51c2VyaWRdXS5wdXNoKFtyZXNwb25baV0ubW92aWVpZCxyZXNwb25baV0uc2NvcmVdKVxufVxuXG5jb25zb2xlLmxvZygnb2JqMScsb2JqMSk7XG5jdXJyZW50VXNlckluZm89b2JqMVtjdXJyZW50VXNlcl1cbi8vY29uc29sZS5sb2coJ2N1cnJlbnRVc2VySW5mbycsY3VycmVudFVzZXJJbmZvKVxudmFyIGNvbXBhcmlzb25zPXt9XG5cbmZvciAodmFyIGtleSBpbiBvYmoxKXtcbiAgaWYgKGtleSE9PWN1cnJlbnRVc2VyKSB7XG4gICAgY29tcGFyaXNvbnNba2V5XT1jb21wKGN1cnJlbnRVc2VySW5mbyxvYmoxW2tleV0pXG4gIH1cbn1cbmNvbnNvbGUubG9nKGNvbXBhcmlzb25zKVxudmFyIGZpbmFsU2VuZD1bXVxuZm9yICh2YXIga2V5IGluIGNvbXBhcmlzb25zKXtcbiAgaWYgKGNvbXBhcmlzb25zW2tleV0gIT09ICdOYU4lJykge1xuICBmaW5hbFNlbmQucHVzaChba2V5LGNvbXBhcmlzb25zW2tleV1dKTtcbn0gZWxzZSAge1xuICBmaW5hbFNlbmQucHVzaChba2V5LFwiTm8gQ29tcGFyaXNvbiB0byBNYWtlXCJdKVxufVxuXG59XG5cbiAgcmVzcG9uc2Uuc2VuZChmaW5hbFNlbmQpXG59KVxufSlcbn1cblxuXG5leHBvcnRzLmRlY2xpbmU9ZnVuY3Rpb24ocmVxLHJlc3BvbnNlKXtcbiAgdmFyIHJlcXVlc3Rvcj1yZXEuYm9keS5wZXJzb25Ub0RlY2xpbmU7XG4gIHZhciByZXF1ZXN0ZWU9cmVxLm15U2Vzc2lvbi51c2VyO1xuICB2YXIgbW92aWU9cmVxLmJvZHkubW92aWU7XG4gIHZhciByZXF1ZXN0VHlwZSA9ICdmcmllbmQnO1xuXG4gIGlmIChtb3ZpZSA9PT0gJycpIHtcbiAgICBjb24ucXVlcnkoJ1VQREFURSBhbGxyZXF1ZXN0cyBTRVQgcmVzcG9uc2U9JysnXCInICsgJ25vJyArICdcIicrICcgV0hFUkUgcmVxdWVzdG9yID0gJysnXCInKyByZXF1ZXN0b3IrJ1wiJysnIEFORCByZXF1ZXN0VHlwPScrJ1wiJysgcmVxdWVzdFR5cGUrJ1wiJywgZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xuICAgICAgcmVzcG9uc2Uuc2VuZChyZXF1ZXN0b3IgKyAnZGVsZXRlZCcpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGNvbi5xdWVyeSgnVVBEQVRFIGFsbHJlcXVlc3RzIFNFVCByZXNwb25zZT0nKydcIicgKyAnbm8nICsgJ1wiJysgJyBXSEVSRSByZXF1ZXN0b3IgPSAnKydcIicrIHJlcXVlc3RvcisnXCInKycgQU5EIHJlcXVlc3RlZT0nKydcIicrIHJlcXVlc3RlZSsnXCInKycgQU5EIG1vdmllID0nKydcIicrbW92aWUrJ1wiJywgZnVuY3Rpb24oZXJyLCByZXMpIHtcbiAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xuICAgICAgcmVzcG9uc2Uuc2VuZChyZXF1ZXN0b3IgKyAnZGVsZXRlZCcpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gYWxsUmVxdWVzdC5mb3JnZSh7cmVxdWVzdG9yOiByZXF1ZXN0b3IsIHJlcXVlc3RlZTogcmVxdWVzdGVlfSlcbiAgLy8gICAuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGFsbFJlcXVlc3QpIHtcbiAgLy8gICAgIGFsbFJlcXVlc3QuZGVzdHJveSgpXG4gIC8vICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAvLyAgICAgICAgIHJlc3BvbnNlLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogJ1VzZXIgc3VjY2Vzc2Z1bGx5IGRlbGV0ZWQnfX0pO1xuICAvLyAgICAgICB9KVxuICAvLyAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gIC8vICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcbiAgLy8gICAgICAgfSk7XG4gIC8vICAgfSlcbiAgLy8gICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gIC8vICAgICByZXNwb25zZS5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xuICAvLyAgIH0pO1xufTtcblxuZXhwb3J0cy5zaWdudXBVc2VyID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgY29uc29sZS5sb2coJ2NhbGxpbmcgbG9naW4nLCByZXEuYm9keSk7XG4gIC8vIGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBzZXNzaW9uJyxyZXEuc2Vzc2lvbilcbiAgbmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLmJvZHkubmFtZSB9KS5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oZm91bmQpIHtcbiAgICBpZiAoZm91bmQpIHtcbiAgICAgIC8vY2hlY2sgcGFzc3dvcmRcbiAgICAgICAgIC8vaWYgKHBhc3N3b3JkIG1hdGNoZXMpXG4gICAgICAgICAvL3sgYWRkIHNlc3Npb25zIGFuZCByZWRpcmVjdH1cbiAgICAgIGNvbnNvbGUubG9nKCd1c2VybmFtZSBhbHJlYWR5IGV4aXN0LCBjYW5ub3Qgc2lnbnVwICcsIHJlcS5ib2R5Lm5hbWUpO1xuICAgICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoJ3VzZXJuYW1lIGV4aXN0Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdjcmVhdGluZyB1c2VyJyk7XG4gICAgICByZXEubXlTZXNzaW9uLnVzZXIgPSByZXEuYm9keS5uYW1lO1xuICAgICAgVXNlcnMuY3JlYXRlKHtcbiAgICAgICAgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUsXG4gICAgICAgIHBhc3N3b3JkOiByZXEuYm9keS5wYXNzd29yZCxcbiAgICAgIH0pXG4gICAgICAudGhlbihmdW5jdGlvbih1c2VyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdjcmVhdGVkIGEgbmV3IHVzZXInKTtcbiAgICAgICAgcmVzLnN0YXR1cygyMDEpLnNlbmQoJ2xvZ2luIGNyZWF0ZWQnKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59O1xuXG5leHBvcnRzLnNpZ25pblVzZXIgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXHRjb25zb2xlLmxvZygnY2FsbGluZyBzaWduaW4nLCByZXEuYm9keSk7XG5cdG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUgfSkuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGZvdW5kKXtcblxuXHRcdGlmIChmb3VuZCl7XG5cdFx0XHRuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEuYm9keS5uYW1lLCBwYXNzd29yZDpyZXEuYm9keS5wYXNzd29yZH0pLmZldGNoKCkudGhlbihmdW5jdGlvbihmb3VuZCl7XG5cdFx0XHRcdGlmIChmb3VuZCl7XG5cdFx0XHRcdFx0cmVxLm15U2Vzc2lvbi51c2VyID0gZm91bmQuYXR0cmlidXRlcy51c2VybmFtZTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhmb3VuZC5hdHRyaWJ1dGVzLnVzZXJuYW1lKVxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCd3ZSBmb3VuZCB5b3UhIScpXG5cdFx0XHRcdFx0cmVzLnNlbmQoWydpdCB3b3JrZWQnLHJlcS5teVNlc3Npb24udXNlcl0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJlcy5zdGF0dXMoNDA0KS5zZW5kKCdiYWQgbG9naW4nKTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnd3JvbmcgcGFzc3dvcmQnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVzLnN0YXR1cyg0MDQpLnNlbmQoJ2JhZCBsb2dpbicpO1xuXHRcdFx0Y29uc29sZS5sb2coJ3VzZXIgbm90IGZvdW5kJyk7XG5cdFx0fVxuXG4gIH0pIFxuXG59XG5cbmV4cG9ydHMubG9nb3V0ID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcblx0cmVxLm15U2Vzc2lvbi5kZXN0cm95KGZ1bmN0aW9uKGVycil7XG5cdFx0Y29uc29sZS5sb2coZXJyKTtcblx0fSk7XG5cdGNvbnNvbGUubG9nKCdsb2dvdXQnKTtcblx0cmVzLnNlbmQoJ2xvZ291dCcpO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8vLy9tb3ZpZSBoYW5kbGVyc1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbi8vYSBoYW5kZWxlciB0aGF0IHRha2VzIGEgcmF0aW5nIGZyb20gdXNlciBhbmQgYWRkIGl0IHRvIHRoZSBkYXRhYmFzZVxuLy8gZXhwZWN0cyByZXEuYm9keSB0byBoYXZlIHRoaXM6IHt0aXRsZTogJ25hbWUnLCBnZW5yZTogJ2dlbnJlJywgcG9zdGVyOiAnbGluaycsIHJlbGVhc2VfZGF0ZTogJ3llYXInLCByYXRpbmc6ICdudW1iZXInfVxuZXhwb3J0cy5yYXRlTW92aWUgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXHRjb25zb2xlLmxvZygnY2FsbGluZyByYXRlTW92aWUnKTtcblx0dmFyIHVzZXJpZDtcblx0cmV0dXJuIG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5teVNlc3Npb24udXNlciB9KS5mZXRjaCgpXG5cdC50aGVuKGZ1bmN0aW9uKGZvdW5kVXNlcikge1xuXHRcdHVzZXJpZCA9IGZvdW5kVXNlci5hdHRyaWJ1dGVzLmlkO1xuXHRcdHJldHVybiBuZXcgUmF0aW5nKHsgbW92aWVpZDogcmVxLmJvZHkuaWQsIHVzZXJpZDogdXNlcmlkIH0pLmZldGNoKClcblx0XHQudGhlbihmdW5jdGlvbihmb3VuZFJhdGluZykge1xuXHRcdFx0aWYgKGZvdW5kUmF0aW5nKSB7XG5cdFx0XHRcdC8vc2luY2UgcmF0aW5nIG9yIHJldmlldyBpcyB1cGRhdGVkIHNlcGVyYXRseSBpbiBjbGllbnQsIHRoZSBmb2xsb3dpbmdcblx0XHRcdFx0Ly9tYWtlIHN1cmUgaXQgZ2V0cyB1cGRhdGVkIGFjY29yZGluZyB0byB0aGUgcmVxXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKCd1cGRhdGUgcmF0aW5nJywgZm91bmRSYXRpbmcpXG5cdFx0XHRcdGlmIChyZXEuYm9keS5yYXRpbmcpIHtcblx0XHRcdFx0XHR2YXIgcmF0aW5nT2JqID0ge3Njb3JlOiByZXEuYm9keS5yYXRpbmd9O1xuXHRcdFx0XHR9IGVsc2UgaWYgKHJlcS5ib2R5LnJldmlldykge1xuXHRcdFx0XHRcdHZhciByYXRpbmdPYmogPSB7cmV2aWV3OiByZXEuYm9keS5yZXZpZXd9O1xuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBuZXcgUmF0aW5nKHsnaWQnOiBmb3VuZFJhdGluZy5hdHRyaWJ1dGVzLmlkfSlcblx0XHRcdFx0XHQuc2F2ZShyYXRpbmdPYmopO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5sb2coJ2NyZWF0aW5nIHJhdGluZycpO1xuXHRcdCAgICByZXR1cm4gUmF0aW5ncy5jcmVhdGUoe1xuXHRcdCAgICBcdHNjb3JlOiByZXEuYm9keS5yYXRpbmcsXG5cdFx0ICAgICAgdXNlcmlkOiB1c2VyaWQsXG5cdFx0ICAgICAgbW92aWVpZDogcmVxLmJvZHkuaWQsXG5cdFx0ICAgICAgcmV2aWV3OiByZXEuYm9keS5yZXZpZXdcblx0XHQgICAgfSk7XHRcdFx0XHRcdFxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9KVxuXHQudGhlbihmdW5jdGlvbihuZXdSYXRpbmcpIHtcblx0XHRjb25zb2xlLmxvZygncmF0aW5nIGNyZWF0ZWQ6JywgbmV3UmF0aW5nLmF0dHJpYnV0ZXMpO1xuICBcdHJlcy5zdGF0dXMoMjAxKS5zZW5kKCdyYXRpbmcgcmVjaWV2ZWQnKTtcblx0fSlcbn07XG5cbi8vdGhpcyBoZWxwZXIgZnVuY3Rpb24gYWRkcyB0aGUgbW92aWUgaW50byBkYXRhYmFzZVxuLy9pdCBmb2xsb3dzIHRoZSBzYW1lIG1vdmllIGlkIGFzIFRNREJcbi8vZXhwZWN0cyByZXEuYm9keSB0byBoYXZlIHRoZXNlIGF0cmlidXRlIDoge2lkLCB0aXRsZSwgZ2VucmUsIHBvc3Rlcl9wYXRoLCByZWxlYXNlX2RhdGUsIG92ZXJ2aWV3LCB2b3RlX2F2ZXJhZ2V9XG52YXIgYWRkT25lTW92aWUgPSBmdW5jdGlvbihtb3ZpZU9iaikge1xuXHR2YXIgZ2VucmUgPSAobW92aWVPYmouZ2VucmVfaWRzKSA/IGdlbnJlc1ttb3ZpZU9iai5nZW5yZV9pZHNbMF1dIDogJ24vYSc7XG4gIHJldHVybiBuZXcgTW92aWUoe1xuICBcdGlkOiBtb3ZpZU9iai5pZCxcbiAgICB0aXRsZTogbW92aWVPYmoudGl0bGUsXG4gICAgZ2VucmU6IGdlbnJlLFxuICAgIHBvc3RlcjogJ2h0dHBzOi8vaW1hZ2UudG1kYi5vcmcvdC9wL3cxODUvJyArIG1vdmllT2JqLnBvc3Rlcl9wYXRoLFxuICAgIHJlbGVhc2VfZGF0ZTogbW92aWVPYmoucmVsZWFzZV9kYXRlLFxuICAgIGRlc2NyaXB0aW9uOiBtb3ZpZU9iai5vdmVydmlldy5zbGljZSgwLCAyNTUpLFxuICAgIGltZGJSYXRpbmc6IG1vdmllT2JqLnZvdGVfYXZlcmFnZVxuICB9KS5zYXZlKG51bGwsIHttZXRob2Q6ICdpbnNlcnQnfSlcbiAgLnRoZW4oZnVuY3Rpb24obmV3TW92aWUpIHtcbiAgXHRjb25zb2xlLmxvZygnbW92aWUgY3JlYXRlZCcsIG5ld01vdmllLmF0dHJpYnV0ZXMudGl0bGUpO1xuICBcdHJldHVybiBuZXdNb3ZpZTtcbiAgfSlcbn07XG5cblxuLy9nZXQgYWxsIG1vdmllIHJhdGluZ3MgdGhhdCBhIHVzZXIgcmF0ZWRcbi8vc2hvdWxkIHJldHVybiBhbiBhcnJheSB0aGF0IGxvb2sgbGlrZSB0aGUgZm9sbG93aW5nOlxuLy8gWyB7dGl0bGU6ICduYW1lJywgZ2VucmU6ICdnZW5yZScgLCBwb3N0ZXI6ICd1cmwnLCByZWxlYXNlX2RhdGU6ICdkYXRlJywgc2NvcmU6IG4sIGZyaWVuZEF2ZXJhZ2VSYXRpbmc6IG59IC4uLiBdXG4vLyB3aWxsIGdldCByYXRpbmdzIGZvciB0aGUgY3VycmVudCB1c2VyXG5leHBvcnRzLmdldFVzZXJSYXRpbmdzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgUmF0aW5nLnF1ZXJ5KGZ1bmN0aW9uKHFiKXtcbiAgXHRxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcbiAgXHRxYi5pbm5lckpvaW4oJ21vdmllcycsICdyYXRpbmdzLm1vdmllaWQnLCAnPScsICdtb3ZpZXMuaWQnKTtcbiAgXHRxYi5zZWxlY3QoJ3VzZXJzLnVzZXJuYW1lJywgJ21vdmllcy50aXRsZScsICdtb3ZpZXMuaWQnLCAnbW92aWVzLmdlbnJlJywgJ21vdmllcy5wb3N0ZXInLCAnbW92aWVzLnJlbGVhc2VfZGF0ZScsICdtb3ZpZXMuaW1kYlJhdGluZycsICdtb3ZpZXMuZGVzY3JpcHRpb24nLCAncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycsICdyYXRpbmdzLnVwZGF0ZWRfYXQnKTtcbiAgXHRxYi53aGVyZSgndXNlcnMudXNlcm5hbWUnLCAnPScsIHJlcS5teVNlc3Npb24udXNlcik7XG4gIFx0cWIub3JkZXJCeSgndXBkYXRlZF9hdCcsICdERVNDJylcbiAgfSlcbiAgLmZldGNoQWxsKClcbiAgLnRoZW4oZnVuY3Rpb24ocmF0aW5ncyl7XG5cdFx0Ly9kZWNvcmF0ZSBpdCB3aXRoIGF2ZyBmcmllbmQgcmF0aW5nXG5cdFx0cmV0dXJuIFByb21pc2UubWFwKHJhdGluZ3MubW9kZWxzLCBmdW5jdGlvbihyYXRpbmcpIHtcblx0XHRcdHJldHVybiBhdHRhY2hGcmllbmRBdmdSYXRpbmcocmF0aW5nLCByZXEubXlTZXNzaW9uLnVzZXIpO1xuXHRcdH0pO1xuXHR9KVxuICAudGhlbihmdW5jdGlvbihyYXRpbmdzKSB7XG4gIFx0Y29uc29sZS5sb2coJ3JldHJpdmluZyBhbGwgdXNlciByYXRpbmdzJyk7XG4gIFx0cmVzLnN0YXR1cygyMDApLmpzb24ocmF0aW5ncyk7XG4gIH0pXG59O1xuXG5leHBvcnRzLmdldEZyaWVuZFVzZXJSYXRpbmdzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgUmF0aW5nLnF1ZXJ5KGZ1bmN0aW9uKHFiKXtcbiAgXHRxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcbiAgXHRxYi5pbm5lckpvaW4oJ21vdmllcycsICdyYXRpbmdzLm1vdmllaWQnLCAnPScsICdtb3ZpZXMuaWQnKTtcbiAgXHRxYi5zZWxlY3QoJ3VzZXJzLnVzZXJuYW1lJywgJ21vdmllcy50aXRsZScsICdtb3ZpZXMuaWQnLCAnbW92aWVzLmdlbnJlJywgJ21vdmllcy5wb3N0ZXInLCAnbW92aWVzLnJlbGVhc2VfZGF0ZScsICdtb3ZpZXMuaW1kYlJhdGluZycsICdtb3ZpZXMuZGVzY3JpcHRpb24nLCAncmF0aW5ncy5zY29yZSBhcyBmcmllbmRTY29yZScsICdyYXRpbmdzLnJldmlldyBhcyBmcmllbmRSZXZpZXcnLCAncmF0aW5ncy51cGRhdGVkX2F0Jyk7XG4gIFx0cWIud2hlcmUoJ3VzZXJzLnVzZXJuYW1lJywgJz0nLCByZXEucXVlcnkuZnJpZW5kTmFtZSk7XG4gIFx0cWIub3JkZXJCeSgndXBkYXRlZF9hdCcsICdERVNDJylcbiAgfSlcbiAgLmZldGNoQWxsKClcbiAgLnRoZW4oZnVuY3Rpb24ocmF0aW5ncyl7XG5cdFx0Ly9kZWNvcmF0ZSBpdCB3aXRoIGN1cnJlbnQgdXNlcidzIHJhdGluZ1xuXHRcdHJldHVybiBQcm9taXNlLm1hcChyYXRpbmdzLm1vZGVscywgZnVuY3Rpb24ocmF0aW5nKSB7XG5cdFx0XHRyZXR1cm4gYXR0YWNoVXNlclJhdGluZyhyYXRpbmcsIHJlcS5teVNlc3Npb24udXNlcik7XG5cdFx0fSk7XG5cdH0pXG4gIC50aGVuKGZ1bmN0aW9uKHJhdGluZ3MpIHtcbiAgXHRjb25zb2xlLmxvZygncmV0cml2aW5nIGFsbCB1c2VyIHJhdGluZ3MnKTtcbiAgXHRyZXMuc3RhdHVzKDIwMCkuanNvbihyYXRpbmdzKTtcbiAgfSlcbn07XG5cbi8vYSBkZWNvcmF0b3IgZnVuY3Rpb24gdGhhdCBhdHRhY2hlcyBmcmllbmQgYXZnIHJhdGluZyB0byB0aGUgcmF0aW5nIG9ialxudmFyIGF0dGFjaEZyaWVuZEF2Z1JhdGluZyA9IGZ1bmN0aW9uKHJhdGluZywgdXNlcm5hbWUpIHtcblx0cmV0dXJuIGV4cG9ydHMuZ2V0RnJpZW5kUmF0aW5ncyh1c2VybmFtZSwgcmF0aW5nKVxuXHQudGhlbihmdW5jdGlvbihmcmllbmRzUmF0aW5ncyl7XG5cdFx0Ly9pZiBmcmllbmRzUmF0aW5ncyBpcyBudWxsLCBSYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nIGlzIG51bGxcblx0XHRpZiAoIWZyaWVuZHNSYXRpbmdzKSB7XG5cdFx0XHRyYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nID0gbnVsbDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyA9IGF2ZXJhZ2VSYXRpbmcoZnJpZW5kc1JhdGluZ3MpO1xuXHRcdH1cblx0XHRyZXR1cm4gcmF0aW5nO1xuXHR9KVxufVxuXG4vL2EgZGVjb3JhdG9yIGZ1bmN0aW9uIHRoYXQgYXR0YWNoZXMgdXNlciByYXRpbmcgYW5kIHJldmlld3MgdG8gdGhlIHJhdGluZyBvYmpcbnZhciBhdHRhY2hVc2VyUmF0aW5nID0gZnVuY3Rpb24ocmF0aW5nLCB1c2VybmFtZSkge1xuXHRyZXR1cm4gUmF0aW5nLnF1ZXJ5KGZ1bmN0aW9uKHFiKSB7XG5cdFx0cWIuaW5uZXJKb2luKCd1c2VycycsICd1c2Vycy5pZCcsICc9JywgJ3JhdGluZ3MudXNlcmlkJylcblx0XHRxYi5pbm5lckpvaW4oJ21vdmllcycsICdtb3ZpZXMuaWQnLCAnPScsICdyYXRpbmdzLm1vdmllaWQnKVxuXHRcdHFiLnNlbGVjdCgncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycpXG5cdFx0cWIud2hlcmUoe1xuXHRcdFx0J3VzZXJzLnVzZXJuYW1lJzogdXNlcm5hbWUsXG5cdFx0XHQnbW92aWVzLnRpdGxlJzogcmF0aW5nLmF0dHJpYnV0ZXMudGl0bGUsXG5cdFx0XHQnbW92aWVzLmlkJzogcmF0aW5nLmF0dHJpYnV0ZXMuaWRcblx0XHR9KVxuXHR9KVxuXHQuZmV0Y2goKVxuXHQudGhlbihmdW5jdGlvbih1c2VyUmF0aW5nKXtcblx0XHRpZiAodXNlclJhdGluZykge1xuXHRcdFx0cmF0aW5nLmF0dHJpYnV0ZXMuc2NvcmUgPSB1c2VyUmF0aW5nLmF0dHJpYnV0ZXMuc2NvcmU7XG5cdFx0XHRyYXRpbmcuYXR0cmlidXRlcy5yZXZpZXcgPSB1c2VyUmF0aW5nLmF0dHJpYnV0ZXMucmV2aWV3O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyYXRpbmcuYXR0cmlidXRlcy5zY29yZSA9IG51bGw7XG5cdFx0XHRyYXRpbmcuYXR0cmlidXRlcy5yZXZpZXcgPSBudWxsO1xuXHRcdH1cblx0XHRyZXR1cm4gcmF0aW5nO1xuXHR9KTtcbn07XG5cbi8vdGhpcyBpcyBhIHdyYXBlciBmdW5jdGlvbiBmb3IgZ2V0RnJpZW5kUmF0aW5ncyB3aGljaCB3aWxsIHNlbnQgdGhlIGNsaWVudCBhbGwgb2YgdGhlIGZyaWVuZCByYXRpbmdzXG5leHBvcnRzLmhhbmRsZUdldEZyaWVuZFJhdGluZ3MgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXHRjb25zb2xlLmxvZygnaGFuZGxlR2V0RnJpZW5kUmF0aW5ncywgJywgcmVxLm15U2Vzc2lvbi51c2VyLCByZXEuYm9keS5tb3ZpZS50aXRsZSk7XG5cdGV4cG9ydHMuZ2V0RnJpZW5kUmF0aW5ncyhyZXEubXlTZXNzaW9uLnVzZXIsIHthdHRyaWJ1dGVzOiByZXEuYm9keS5tb3ZpZX0pXG5cdC50aGVuKGZ1bmN0aW9uKGZyaWVuZFJhdGluZ3Mpe1xuXHRcdHJlcy5qc29uKGZyaWVuZFJhdGluZ3MpO1xuXHR9KTtcbn1cblxuLy90aGlzIGZ1bmN0aW9uIG91dHB1dHMgcmF0aW5ncyBvZiBhIHVzZXIncyBmcmllbmQgZm9yIGEgcGFydGljdWxhciBtb3ZpZVxuLy9leHBlY3QgY3VycmVudCB1c2VybmFtZSBhbmQgbW92aWVUaXRsZSBhcyBpbnB1dFxuLy9vdXRwdXRzOiB7dXNlcjJpZDogJ2lkJywgZnJpZW5kVXNlck5hbWU6J25hbWUnLCBmcmllbmRGaXJzdE5hbWU6J25hbWUnLCB0aXRsZTonbW92aWVUaXRsZScsIHNjb3JlOm4gfVxuZXhwb3J0cy5nZXRGcmllbmRSYXRpbmdzID0gZnVuY3Rpb24odXNlcm5hbWUsIG1vdmllT2JqKSB7XG5cdHJldHVybiBVc2VyLnF1ZXJ5KGZ1bmN0aW9uKHFiKXtcblx0XHRxYi5pbm5lckpvaW4oJ3JlbGF0aW9ucycsICdyZWxhdGlvbnMudXNlcjFpZCcsICc9JywgJ3VzZXJzLmlkJyk7XG5cdFx0cWIuaW5uZXJKb2luKCdyYXRpbmdzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAncmVsYXRpb25zLnVzZXIyaWQnKTtcblx0XHRxYi5pbm5lckpvaW4oJ21vdmllcycsICdyYXRpbmdzLm1vdmllaWQnLCAnPScsICdtb3ZpZXMuaWQnKTtcblx0XHRxYi5zZWxlY3QoJ3JlbGF0aW9ucy51c2VyMmlkJywgJ21vdmllcy50aXRsZScsICdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3Jyk7XG5cdFx0cWIud2hlcmUoe1xuXHRcdFx0J3VzZXJzLnVzZXJuYW1lJzogdXNlcm5hbWUsIFxuXHRcdFx0J21vdmllcy50aXRsZSc6IG1vdmllT2JqLmF0dHJpYnV0ZXMudGl0bGUsXG5cdFx0XHQnbW92aWVzLmlkJzogbW92aWVPYmouYXR0cmlidXRlcy5pZCB9KTtcblx0fSlcblx0LmZldGNoQWxsKClcblx0LnRoZW4oZnVuY3Rpb24oZnJpZW5kc1JhdGluZ3Mpe1xuXHQvL3RoZSBmb2xsb3dpbmcgYmxvY2sgYWRkcyB0aGUgZnJpZW5kTmFtZSBhdHRyaWJ1dGUgdG8gdGhlIHJhdGluZ3Ncblx0XHRyZXR1cm4gUHJvbWlzZS5tYXAoZnJpZW5kc1JhdGluZ3MubW9kZWxzLCBmdW5jdGlvbihmcmllbmRSYXRpbmcpIHtcblx0XHRcdHJldHVybiBuZXcgVXNlcih7IGlkOiBmcmllbmRSYXRpbmcuYXR0cmlidXRlcy51c2VyMmlkIH0pLmZldGNoKClcblx0XHRcdC50aGVuKGZ1bmN0aW9uKGZyaWVuZCl7XG5cdFx0XHRcdGZyaWVuZFJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZFVzZXJOYW1lID0gZnJpZW5kLmF0dHJpYnV0ZXMudXNlcm5hbWU7XG5cdFx0XHRcdGZyaWVuZFJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEZpcnN0TmFtZSA9IGZyaWVuZC5hdHRyaWJ1dGVzLmZpcnN0TmFtZTtcblx0XHRcdFx0cmV0dXJuIGZyaWVuZFJhdGluZztcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9KVxuXHQudGhlbihmdW5jdGlvbihmcmllbmRzUmF0aW5ncyl7XG5cdFx0cmV0dXJuIGZyaWVuZHNSYXRpbmdzO1xuXHR9KTtcbn07XG5cblxuLy9hIGhlbHBlciBmdW5jdGlvbiB0aGF0IGF2ZXJhZ2VzIHRoZSByYXRpbmdcbi8vaW5wdXRzIHJhdGluZ3MsIG91dHB1dHMgdGhlIGF2ZXJhZ2Ugc2NvcmU7XG52YXIgYXZlcmFnZVJhdGluZyA9IGZ1bmN0aW9uKHJhdGluZ3MpIHtcblx0Ly9yZXR1cm4gbnVsbCBpZiBubyBmcmllbmQgaGFzIHJhdGVkIHRoZSBtb3ZpZVxuXHRpZiAocmF0aW5ncy5sZW5ndGggPT09IDApIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHRyZXR1cm4gcmF0aW5nc1xuXHQucmVkdWNlKGZ1bmN0aW9uKHRvdGFsLCByYXRpbmcpe1xuXHRcdHJldHVybiB0b3RhbCArPSByYXRpbmcuYXR0cmlidXRlcy5zY29yZTtcblx0fSwgMCkgLyByYXRpbmdzLmxlbmd0aDtcbn1cblxuXG4vL2EgaGVscGVyIGZ1bmN0aW9uIHRoYXQgb3V0cHV0cyB1c2VyIHJhdGluZyBhbmQgYXZlcmFnZSBmcmllbmQgcmF0aW5nIGZvciBvbmUgbW92aWVcbi8vb3V0cHV0cyBvbmUgcmF0aW5nIG9iajoge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnICwgcG9zdGVyOiAndXJsJywgcmVsZWFzZV9kYXRlOiAnZGF0ZScsIHNjb3JlOiBuLCBmcmllbmRBdmVyYWdlUmF0aW5nOiBufVxudmFyIGdldE9uZU1vdmllUmF0aW5nID0gZnVuY3Rpb24odXNlcm5hbWUsIG1vdmllT2JqKSB7XG4gIHJldHVybiBSYXRpbmcucXVlcnkoZnVuY3Rpb24ocWIpe1xuICBcdHFiLmlubmVySm9pbigndXNlcnMnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICd1c2Vycy5pZCcpO1xuICBcdHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xuICBcdHFiLnNlbGVjdCgndXNlcnMudXNlcm5hbWUnLCAnbW92aWVzLnRpdGxlJywgJ21vdmllcy5pZCcsICdtb3ZpZXMuZ2VucmUnLCAnbW92aWVzLnBvc3RlcicsICdtb3ZpZXMucmVsZWFzZV9kYXRlJywgJ21vdmllcy5pbWRiUmF0aW5nJywgJ21vdmllcy5kZXNjcmlwdGlvbicsICdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3Jyk7XG4gIFx0cWIud2hlcmUoeyd1c2Vycy51c2VybmFtZSc6IHVzZXJuYW1lLCAnbW92aWVzLnRpdGxlJzogbW92aWVPYmoudGl0bGUsICdtb3ZpZXMuaWQnOiBtb3ZpZU9iai5pZH0pO1xuICB9KVxuICAuZmV0Y2goKVxuICAudGhlbihmdW5jdGlvbihyYXRpbmcpe1xuXHQgIGlmICghcmF0aW5nKSB7XG5cdCAgXHQvL2lmIHRoZSB1c2VyIGhhcyBub3QgcmF0ZWQgdGhlIG1vdmllLCByZXR1cm4gYW4gb2JqIHRoYXQgaGFzIHRoZSBtb3ZpZSBpbmZvcm1hdGlvbiwgYnV0IHNjb3JlIGlzIHNldCB0byBudWxsXG5cdCAgXHRyZXR1cm4gbmV3IE1vdmllKHt0aXRsZTogbW92aWVPYmoudGl0bGUsIGlkOiBtb3ZpZU9iai5pZH0pLmZldGNoKClcblx0ICBcdC50aGVuKGZ1bmN0aW9uKG1vdmllKSB7XG5cdCAgXHRcdG1vdmllLmF0dHJpYnV0ZXMuc2NvcmUgPSBudWxsO1xuXHQgIFx0XHRyZXR1cm4gbW92aWU7XG5cdCAgXHR9KVxuXHQgIH0gZWxzZSB7XG5cdCAgXHRyZXR1cm4gcmF0aW5nO1xuXHQgIH1cblx0fSlcblx0LnRoZW4oZnVuY3Rpb24ocmF0aW5nKXtcblx0XHRyZXR1cm4gZXhwb3J0cy5nZXRGcmllbmRSYXRpbmdzKHVzZXJuYW1lLCByYXRpbmcpXG5cdFx0LnRoZW4oZnVuY3Rpb24oZnJpZW5kc1JhdGluZ3Mpe1xuXHRcdFx0Ly8gY29uc29sZS5sb2coJ2ZyaWVuZHNSYXRpbmdzJywgZnJpZW5kc1JhdGluZ3MpO1xuXHRcdFx0cmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyA9IGF2ZXJhZ2VSYXRpbmcoZnJpZW5kc1JhdGluZ3MpO1xuXHRcdFx0Y29uc29sZS5sb2coJ2FkZGVkIGF2ZXJhZ2UgZnJpZW5kIHJhdGluZycsIHJhdGluZy5hdHRyaWJ1dGVzLnRpdGxlLCByYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nKTtcblx0XHRcdHJldHVybiByYXRpbmc7XG5cdFx0fSk7XG5cdH0pO1xufVxuXG5cbi8vdGhpcyBoYW5kbGVyIGlzIHNwZWNpZmljYWxseSBmb3Igc2VuZGluZyBvdXQgYSBsaXN0IG9mIG1vdmllIHJhdGluZ3Mgd2hlbiB0aGUgY2xpZW50IHNlbmRzIGEgbGlzdCBvZiBtb3ZpZSB0byB0aGUgc2VydmVyXG4vL2V4cGVjdHMgcmVxLmJvZHkgdG8gYmUgYW4gYXJyYXkgb2Ygb2JqIHdpdGggdGhlc2UgYXR0cmlidXRlczoge2lkLCB0aXRsZSwgZ2VucmUsIHBvc3Rlcl9wYXRoLCByZWxlYXNlX2RhdGUsIG92ZXJ2aWV3LCB2b3RlX2F2ZXJhZ2V9XG4vL291dHB1dHMgWyB7dGl0bGU6ICduYW1lJywgZ2VucmU6ICdnZW5yZScgLCBwb3N0ZXI6ICd1cmwnLCByZWxlYXNlX2RhdGU6ICdkYXRlJywgc2NvcmU6IG4sIGZyaWVuZEF2ZXJhZ2VSYXRpbmc6IG59IC4uLiBdXG5leHBvcnRzLmdldE11bHRpcGxlTW92aWVSYXRpbmdzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcblx0Y29uc29sZS5sb2coJ2dldE11bHRpcGxlTW92aWVSYXRpbmdzJyk7XG5cdFByb21pc2UubWFwKHJlcS5ib2R5Lm1vdmllcywgZnVuY3Rpb24obW92aWUpIHtcblx0XHQvL2ZpcnN0IGNoZWNrIHdoZXRoZXIgbW92aWUgaXMgaW4gdGhlIGRhdGFiYXNlXG5cdFx0cmV0dXJuIG5ldyBNb3ZpZSh7dGl0bGU6IG1vdmllLnRpdGxlLCBpZDogbW92aWUuaWR9KS5mZXRjaCgpXG5cdFx0LnRoZW4oZnVuY3Rpb24oZm91bmRNb3ZpZSkge1xuXHRcdFx0Ly9pZiBub3QgY3JlYXRlIG9uZVxuXHRcdFx0aWYgKCFmb3VuZE1vdmllKSB7XG5cdFx0XHRcdHJldHVybiBhZGRPbmVNb3ZpZShtb3ZpZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gZm91bmRNb3ZpZTtcblx0XHRcdH1cblx0XHR9KVxuXHRcdC50aGVuKGZ1bmN0aW9uKGZvdW5kTW92aWUpe1xuXHRcdFx0Ly8gY29uc29sZS5sb2coJ2ZvdW5kIG1vdmllJywgZm91bmRNb3ZpZSk7XG5cdFx0XHRyZXR1cm4gZ2V0T25lTW92aWVSYXRpbmcocmVxLm15U2Vzc2lvbi51c2VyLCBmb3VuZE1vdmllLmF0dHJpYnV0ZXMpO1xuXHRcdH0pXG5cdH0pXG5cdC50aGVuKGZ1bmN0aW9uKHJhdGluZ3Mpe1xuXHRcdGNvbnNvbGUubG9nKCdzZW5kaW5nIHJhdGluZyB0byBjbGllbnQnKTtcblx0XHRyZXMuanNvbihyYXRpbmdzKTtcblx0fSlcbn1cblxuLy90aGlzIGhhbmRsZXIgc2VuZHMgYW4gZ2V0IHJlcXVlc3QgdG8gVE1EQiBBUEkgdG8gcmV0cml2ZSByZWNlbnQgdGl0bGVzXG4vL3dlIGNhbm5vdCBkbyBpdCBpbiB0aGUgZnJvbnQgZW5kIGJlY2F1c2UgY3Jvc3Mgb3JpZ2luIHJlcXVlc3QgaXNzdWVzXG5leHBvcnRzLmdldFJlY2VudFJlbGVhc2UgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuICB2YXIgcGFyYW1zID0ge1xuICAgIGFwaV9rZXk6ICc5ZDNiMDM1ZWYxY2Q2NjlhZWQzOTg0MDBiMTdmY2VhMicsXG4gICAgcHJpbWFyeV9yZWxlYXNlX3llYXI6IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKSxcbiAgICBpbmNsdWRlX2FkdWx0OiBmYWxzZSxcbiAgICBzb3J0X2J5OiAncG9wdWxhcml0eS5kZXNjJ1xuICB9O1xuXG5cdCBcbiAgdmFyIGRhdGEgPSAnJztcblx0cmVxdWVzdCh7XG5cdFx0bWV0aG9kOiAnR0VUJyxcblx0XHR1cmw6ICdodHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zL2Rpc2NvdmVyL21vdmllLycsXG5cdFx0cXM6IHBhcmFtc1xuXHR9KVxuXHQub24oJ2RhdGEnLGZ1bmN0aW9uKGNodW5rKXtcblx0XHRkYXRhICs9IGNodW5rO1xuXHR9KVxuXHQub24oJ2VuZCcsIGZ1bmN0aW9uKCl7XG5cdFx0cmVjZW50TW92aWVzID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICByZXEuYm9keS5tb3ZpZXMgPSByZWNlbnRNb3ZpZXMucmVzdWx0cztcbiAgICAvL3RyYW5zZmVycyB0aGUgbW92aWUgZGF0YSB0byBnZXRNdWx0aXBsZU1vdmllUmF0aW5ncyB0byBkZWNvcmF0ZSB3aXRoIHNjb3JlICh1c2VyIHJhdGluZykgYW5kIGF2Z2ZyaWVuZFJhdGluZyBhdHRyaWJ1dGVcbiAgICBleHBvcnRzLmdldE11bHRpcGxlTW92aWVSYXRpbmdzKHJlcSwgcmVzKTtcblxuXHR9KVxuXHQub24oJ2Vycm9yJywgZnVuY3Rpb24oZXJyb3Ipe1xuXHRcdGNvbnNvbGUubG9nKGVycm9yKTtcblx0fSlcblxufVxuXG4vL3RoaXMgaXMgVE1EQidzIGdlbnJlIGNvZGUsIHdlIG1pZ2h0IHdhbnQgdG8gcGxhY2UgdGhpcyBzb21ld2hlcmUgZWxzZVxudmFyIGdlbnJlcyA9IHtcbiAgIDEyOiBcIkFkdmVudHVyZVwiLFxuICAgMTQ6IFwiRmFudGFzeVwiLFxuICAgMTY6IFwiQW5pbWF0aW9uXCIsXG4gICAxODogXCJEcmFtYVwiLFxuICAgMjc6IFwiSG9ycm9yXCIsXG4gICAyODogXCJBY3Rpb25cIixcbiAgIDM1OiBcIkNvbWVkeVwiLFxuICAgMzY6IFwiSGlzdG9yeVwiLFxuICAgMzc6IFwiV2VzdGVyblwiLFxuICAgNTM6IFwiVGhyaWxsZXJcIixcbiAgIDgwOiBcIkNyaW1lXCIsXG4gICA5OTogXCJEb2N1bWVudGFyeVwiLFxuICAgODc4OiBcIlNjaWVuY2UgRmljdGlvblwiLFxuICAgOTY0ODogXCJNeXN0ZXJ5XCIsXG4gICAxMDQwMjogXCJNdXNpY1wiLFxuICAgMTA3NDk6IFwiUm9tYW5jZVwiLFxuICAgMTA3NTE6IFwiRmFtaWx5XCIsXG4gICAxMDc1MjogXCJXYXJcIixcbiAgIDEwNzY5OiBcIkZvcmVpZ25cIixcbiAgIDEwNzcwOiBcIlRWIE1vdmllXCJcbiB9O1xuXG4vL3RoaXMgZnVuY3Rpb24gd2lsbCBzZW5kIGJhY2sgc2VhcmNiIG1vdmllcyB1c2VyIGhhcyByYXRlZCBpbiB0aGUgZGF0YWJhc2Vcbi8vaXQgd2lsbCBzZW5kIGJhY2sgbW92aWUgb2JqcyB0aGF0IG1hdGNoIHRoZSBzZWFyY2ggaW5wdXQsIGV4cGVjdHMgbW92aWUgbmFtZSBpbiByZXEuYm9keS50aXRsZVxuZXhwb3J0cy5zZWFyY2hSYXRlZE1vdmllID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgcmV0dXJuIFJhdGluZy5xdWVyeShmdW5jdGlvbihxYil7XG5cdFx0cWIuaW5uZXJKb2luKCd1c2VycycsICdyYXRpbmdzLnVzZXJpZCcsICc9JywgJ3VzZXJzLmlkJyk7XG5cdFx0cWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XG5cdFx0cWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnKTtcbiAgXHRxYi53aGVyZVJhdyhgTUFUQ0ggKG1vdmllcy50aXRsZSkgQUdBSU5TVCAoJyR7cmVxLnF1ZXJ5LnRpdGxlfScgSU4gTkFUVVJBTCBMQU5HVUFHRSBNT0RFKWApXG4gIFx0cWIuYW5kV2hlcmUoJ3VzZXJzLnVzZXJuYW1lJywgJz0nLCByZXEubXlTZXNzaW9uLnVzZXIpXG4gIFx0cWIub3JkZXJCeSgndXBkYXRlZF9hdCcsICdERVNDJylcbiAgfSlcbiAgLmZldGNoQWxsKClcbiAgLnRoZW4oZnVuY3Rpb24obWF0Y2hlcyl7XG4gIFx0Y29uc29sZS5sb2cobWF0Y2hlcy5tb2RlbHMpO1xuICBcdHJlcy5qc29uKG1hdGNoZXMpO1xuICB9KVxufVxuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vLy8vZnJpZW5kc2hpcCBoYW5kbGVyc1xuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmV4cG9ydHMuZ2V0RnJpZW5kTGlzdCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cdHJldHVybiBSZWxhdGlvbi5xdWVyeShmdW5jdGlvbihxYil7XG5cdFx0cWIuaW5uZXJKb2luKCd1c2VycycsICdyZWxhdGlvbnMudXNlcjFpZCcsICc9JywgJ3VzZXJzLmlkJyk7XG5cdFx0cWIuc2VsZWN0KCdyZWxhdGlvbnMudXNlcjJpZCcpO1xuXHRcdHFiLndoZXJlKHtcblx0XHRcdCd1c2Vycy51c2VybmFtZSc6IHJlcS5teVNlc3Npb24udXNlclxuXHRcdH0pXG5cdH0pXG5cdC5mZXRjaEFsbCgpXG5cdC50aGVuKGZ1bmN0aW9uKGZyaWVuZHMpe1xuXHRcdHJldHVybiBQcm9taXNlLm1hcChmcmllbmRzLm1vZGVscywgZnVuY3Rpb24oZnJpZW5kKSB7XG5cdFx0XHRyZXR1cm4gbmV3IFVzZXIoe2lkOiBmcmllbmQuYXR0cmlidXRlcy51c2VyMmlkfSkuZmV0Y2goKVxuXHRcdFx0LnRoZW4oZnVuY3Rpb24oZnJpZW5kVXNlcil7XG5cdFx0XHRcdHJldHVybiBmcmllbmRVc2VyLmF0dHJpYnV0ZXMudXNlcm5hbWU7XG5cdFx0XHR9KVxuXHRcdH0pXG5cdH0pXG5cdC50aGVuKGZ1bmN0aW9uKGZyaWVuZHMpe1xuXHRcdGNvbnNvbGUubG9nKCdzZW5kaW5nIGEgbGlzdCBvZiBmcmllbmQgbmFtZXMnLCBmcmllbmRzKTtcblx0XHRyZXMuanNvbihmcmllbmRzKTtcblx0fSlcbn1cblxuLy90aGlzIHdvdWxkIHNlbmQgYSBub3RpY2UgdG8gdGhlIHVzZXIgd2hvIHJlY2VpdmUgdGhlIGZyaWVuZCByZXF1ZXN0LCBwcm9tcHRpbmcgdGhlbSB0byBhY2NlcHQgb3IgZGVueSB0aGUgcmVxdWVzdFxuZXhwb3J0cy5hZGRGcmllbmQgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXG59O1xuXG5cbi8vdGhpcyB3b3VsZCBjb25maXJtIHRoZSBmcmllbmRzaGlwIGFuZCBlc3RhYmxpc2ggdGhlIHJlbGF0aW9uc2hpcCBpbiB0aGUgZGF0YWJhc2VcbmV4cG9ydHMuY29uZmlybUZyaWVuZHNoaXAgPSBmdW5jdGlvbihyZXEsIHJlcykge1xuXG59O1xuXG5cblxuZXhwb3J0cy5nZXRGcmllbmRzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcbiAgdmFyIHBlb3BsZUlkID0gW107XG4gIHZhciBpZCA9IHJlcS5teVNlc3Npb24udXNlclxuICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIGlkLCBmdW5jdGlvbihlcnIsIHJlc3ApIHtcbiAgICB2YXIgdXNlcmlkID0gcmVzcFswXS5pZDtcbiAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgYmUgbGluZy8yJyxpZClcbiAgXG4gICAgY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHJhdGluZ3MgV0hFUkUgdXNlcmlkID0gPycsIHVzZXJpZCwgZnVuY3Rpb24oZXJyLCByZXNwKSB7XG4gICAgICB2YXIgdXNlcnNSYXRpbmdzPXJlc3AubWFwKGZ1bmN0aW9uKGEpeyByZXR1cm4gW2EubW92aWVpZCwgYS5zY29yZV19KTtcblxuICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHJlbGF0aW9ucyBXSEVSRSB1c2VyMWlkID0gPycsIHVzZXJpZCwgZnVuY3Rpb24oZXJyLCByZXNwKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChwZW9wbGVJZC5pbmRleE9mKHJlc3BbaV0udXNlcjJpZCkgPT09IC0xKSB7XG4gICAgICAgICAgICBwZW9wbGVJZC5wdXNoKHJlc3BbaV0udXNlcjJpZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciBwZW9wbGUgPSBbXVxuICAgICAgICBjb25zb2xlLmxvZygnVGhpcyBzaG91bGQgYWxzbyBiZSBwZW9wbGVlZScscGVvcGxlSWQpO1xuICAgICAgICB2YXIga2V5SWQ9e307XG4gICAgICAgIHBlb3BsZUlkLmZvckVhY2goZnVuY3Rpb24oYSkge1xuXG4gICAgICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgdXNlcm5hbWUgRlJPTSB1c2VycyBXSEVSRSBpZCA9ID8nLCBhLCBmdW5jdGlvbihlcnIsIHJlc3BvKSB7XG4gIFx0ICAgICAgICBrZXlJZFthXT1yZXNwb1swXS51c2VybmFtZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0aGlzIGlzIE9ORSBvZiB0aGUgcGVvcGxlISEnLHJlc3BvWzBdLnVzZXJuYW1lKVxuICAgICAgICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHJhdGluZ3MgV0hFUkUgdXNlcmlkID0nKydcIicrYSsnXCInLCBmdW5jdGlvbihlcnIsIHJlKSB7XG4gICAgICBcdCAgICAgIGNvbnNvbGUubG9nKCd0aGlzIGlzIGEnLGEpXG4gICAgICBcdCAgICAgIGlmIChyZS5sZW5ndGg9PT0wKXtcbiAgICAgIFx0XHQgICAgICByZT1be3VzZXJpZDphLG1vdmllaWQ6TWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKjEwMDAwKSxzY29yZTo5OX1dXG4gICAgICBcdCAgICAgIH1cbiAgICAgIFx0ICAgICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGJlIHRoZSByYXRpbmdzIGZyb20gZWFjaCBwZXJzb24hIScscmUpO1xuXG4gICAgICAgICAgICAgIHBlb3BsZS5wdXNoKHJlLm1hcChmdW5jdGlvbihhKXtyZXR1cm4gW2EudXNlcmlkLGEubW92aWVpZCxhLnNjb3JlXTt9KSk7XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBpZiAocGVvcGxlLmxlbmd0aD09PXBlb3BsZUlkLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgdmFyIGZpbmFsID0ge307XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgYmUgcGVvcGxlJywgcGVvcGxlKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBlb3BsZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgaWYgKHBlb3BsZVtpXVswXSE9PXVuZGVmaW5lZCl7XG4gICAgICAgICAgICAgICAgICAgIGZpbmFsW2tleUlkW3Blb3BsZVtpXVswXVswXV1dID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgcGVvcGxlW2ldLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgZmluYWxba2V5SWRbcGVvcGxlW2ldWzBdWzBdXV0ucHVzaChbXSk7XG4gICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeiA9IDE7IHogPCBwZW9wbGVbaV1beF0ubGVuZ3RoOyB6KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsW2tleUlkW3Blb3BsZVtpXVswXVswXV1dW3hdLnB1c2gocGVvcGxlW2ldW3hdW3pdKVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdmaW5hbCcsZmluYWwsdXNlcnNSYXRpbmdzKTtcblxuICAgICAgICAgICAgICAgIHZhciBjb21wYXJpc29ucz17fTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gZmluYWwpe1xuICAgICAgICAgICAgICAgICAgY29tcGFyaXNvbnNba2V5XT1jb21wKHVzZXJzUmF0aW5ncyxmaW5hbFtrZXldKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjb21wYXJpc29ucyk7XG4gICAgICAgICAgICAgICAgdmVyeUZpbmFsPVtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBjb21wYXJpc29ucyl7XG4gICAgICAgICAgICAgICAgICB2ZXJ5RmluYWwucHVzaChba2V5LGNvbXBhcmlzb25zW2tleV1dKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2ZXJ5RmluYWwpO1xuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHZlcnlGaW5hbCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59O1xuXG5cblxuLy9UQkRcbmV4cG9ydHMuZ2V0SGlnaENvbXBhdGliaWxpdHlVc2VycyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG4gIFxufTtcblxuXG4vL1RCRFxuZXhwb3J0cy5nZXRSZWNvbW1lbmRlZE1vdmllcyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XG5cbn07Il19
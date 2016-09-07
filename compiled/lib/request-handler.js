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
    response.send('Success');
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

    var request = {
      requestor: req.mySession.user,
      requestee: req.body.name,
      requestTyp: 'friend'
    };

    con.query('SELECT requestee,response FROM allrequests WHERE  requestor = ? AND requestTyp =' + '"' + 'friend' + '"', request['requestor'], function (err, res) {
      if (!res) {
        response.send('no friends');
      }
      var pplReqd = res.filter(function (a) {
        return a.response === null;
      });
      var requestees = pplReqd.map(function (a) {
        return a.requestee;
      });
      console.log('names of people whom Ive requested as friends', pplReqd);

      con.query('INSERT INTO allrequests SET ?', request, function (err, resp) {
        if (err) throw err;
        console.log('Last insert ID:', resp.insertId);
        response.send(requestees);
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

    con.query('SELECT id FROM users WHERE username = ?', requestor, function (err, res) {
      if (err) throw err;
      console.log('Last insert ID:', res[0].id, err);
      var person1 = res[0].id;
      con.query('SELECT id FROM users WHERE username = ?', requestee, function (err, resp) {
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

            response.send('Success');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9yZXF1ZXN0LWhhbmRsZXIuanMiXSwibmFtZXMiOlsiaGVscGVyIiwibnVtMSIsIm51bTIiLCJkaWZmIiwiTWF0aCIsImFicyIsImNvbXAiLCJmaXJzdCIsInNlY29uZCIsImZpbmFsIiwiaSIsImxlbmd0aCIsIngiLCJwdXNoIiwic3VtIiwicmVkdWNlIiwiYSIsImIiLCJyb3VuZCIsImRiIiwicmVxdWlyZSIsIm15c3FsIiwiZXhwcmVzcyIsIk1vdmllIiwiUmF0aW5nIiwiUmVsYXRpb24iLCJVc2VyIiwiYWxsUmVxdWVzdCIsIk1vdmllcyIsIlJhdGluZ3MiLCJSZWxhdGlvbnMiLCJVc2VycyIsImFsbFJlcXVlc3RzIiwiUHJvbWlzZSIsInJlcXVlc3QiLCJjb24iLCJjcmVhdGVDb25uZWN0aW9uIiwiaG9zdCIsInVzZXIiLCJwYXNzd29yZCIsImRhdGFiYXNlIiwiY29ubmVjdCIsImVyciIsImNvbnNvbGUiLCJsb2ciLCJleHBvcnRzIiwic2lnbnVwVXNlciIsInJlcSIsInJlcyIsImJvZHkiLCJ1c2VybmFtZSIsIm5hbWUiLCJmZXRjaCIsInRoZW4iLCJmb3VuZCIsInN0YXR1cyIsInNlbmQiLCJteVNlc3Npb24iLCJjcmVhdGUiLCJzZW5kV2F0Y2hSZXF1ZXN0IiwicmVzcG9uc2UiLCJyZXF1ZXN0ZWUiLCJBcnJheSIsImlzQXJyYXkiLCJyZXF1ZXN0ZWVzIiwiZWFjaCIsIm1lc3NhZ2UiLCJyZXF1ZXN0b3IiLCJyZXF1ZXN0VHlwIiwibW92aWUiLCJxdWVyeSIsImluc2VydElkIiwicmVtb3ZlV2F0Y2hSZXF1ZXN0IiwiZm9yZ2UiLCJkZXN0cm95IiwianNvbiIsImVycm9yIiwiZGF0YSIsImNhdGNoIiwic2VuZFJlcXVlc3QiLCJwcGxSZXFkIiwiZmlsdGVyIiwibWFwIiwicmVzcCIsImxpc3RSZXF1ZXN0cyIsImFjY2VwdCIsInBlcnNvblRvQWNjZXB0IiwicmVxdWVzdFR5cGUiLCJpZCIsInBlcnNvbjEiLCJwZXJzb24yIiwidXNlcjFpZCIsInVzZXIyaWQiLCJyZXF1ZXN0MiIsInJlbW92ZVJlcXVlc3QiLCJnZXRUaGlzRnJpZW5kc01vdmllcyIsIm1vdmllcyIsInNwZWNpZmljRnJpZW5kIiwicGVyc29uIiwibGVuIiwiZm9yRWFjaCIsIm1vdmllaWQiLCJ0aXRsZSIsInNjb3JlIiwicmV2aWV3IiwiZmluZE1vdmllQnVkZGllcyIsInBlb3BsZSIsIklkcyIsImlkS2V5T2JqIiwiY3VycmVudFVzZXIiLCJvYmoxIiwicmVzcG9uIiwidXNlcmlkIiwiY3VycmVudFVzZXJJbmZvIiwiY29tcGFyaXNvbnMiLCJrZXkiLCJmaW5hbFNlbmQiLCJkZWNsaW5lIiwicGVyc29uVG9EZWNsaW5lIiwic2lnbmluVXNlciIsImF0dHJpYnV0ZXMiLCJsb2dvdXQiLCJyYXRlTW92aWUiLCJmb3VuZFVzZXIiLCJmb3VuZFJhdGluZyIsInJhdGluZyIsInJhdGluZ09iaiIsInNhdmUiLCJuZXdSYXRpbmciLCJhZGRPbmVNb3ZpZSIsIm1vdmllT2JqIiwiZ2VucmUiLCJnZW5yZV9pZHMiLCJnZW5yZXMiLCJwb3N0ZXIiLCJwb3N0ZXJfcGF0aCIsInJlbGVhc2VfZGF0ZSIsImRlc2NyaXB0aW9uIiwib3ZlcnZpZXciLCJzbGljZSIsImltZGJSYXRpbmciLCJ2b3RlX2F2ZXJhZ2UiLCJtZXRob2QiLCJuZXdNb3ZpZSIsImdldFVzZXJSYXRpbmdzIiwicWIiLCJpbm5lckpvaW4iLCJzZWxlY3QiLCJ3aGVyZSIsIm9yZGVyQnkiLCJmZXRjaEFsbCIsInJhdGluZ3MiLCJtb2RlbHMiLCJhdHRhY2hGcmllbmRBdmdSYXRpbmciLCJnZXRGcmllbmRVc2VyUmF0aW5ncyIsImZyaWVuZE5hbWUiLCJhdHRhY2hVc2VyUmF0aW5nIiwiZ2V0RnJpZW5kUmF0aW5ncyIsImZyaWVuZHNSYXRpbmdzIiwiZnJpZW5kQXZlcmFnZVJhdGluZyIsImF2ZXJhZ2VSYXRpbmciLCJ1c2VyUmF0aW5nIiwiaGFuZGxlR2V0RnJpZW5kUmF0aW5ncyIsImZyaWVuZFJhdGluZ3MiLCJmcmllbmRSYXRpbmciLCJmcmllbmQiLCJmcmllbmRVc2VyTmFtZSIsImZyaWVuZEZpcnN0TmFtZSIsImZpcnN0TmFtZSIsInRvdGFsIiwiZ2V0T25lTW92aWVSYXRpbmciLCJnZXRNdWx0aXBsZU1vdmllUmF0aW5ncyIsImZvdW5kTW92aWUiLCJnZXRSZWNlbnRSZWxlYXNlIiwicGFyYW1zIiwiYXBpX2tleSIsInByaW1hcnlfcmVsZWFzZV95ZWFyIiwiRGF0ZSIsImdldEZ1bGxZZWFyIiwiaW5jbHVkZV9hZHVsdCIsInNvcnRfYnkiLCJ1cmwiLCJxcyIsIm9uIiwiY2h1bmsiLCJyZWNlbnRNb3ZpZXMiLCJKU09OIiwicGFyc2UiLCJyZXN1bHRzIiwic2VhcmNoUmF0ZWRNb3ZpZSIsIndoZXJlUmF3IiwiYW5kV2hlcmUiLCJtYXRjaGVzIiwiZ2V0RnJpZW5kTGlzdCIsImZyaWVuZHMiLCJmcmllbmRVc2VyIiwiYWRkRnJpZW5kIiwiY29uZmlybUZyaWVuZHNoaXAiLCJnZXRGcmllbmRzIiwicGVvcGxlSWQiLCJ1c2Vyc1JhdGluZ3MiLCJpbmRleE9mIiwia2V5SWQiLCJyZXNwbyIsInJlIiwicmFuZG9tIiwidW5kZWZpbmVkIiwieiIsInZlcnlGaW5hbCIsImdldEhpZ2hDb21wYXRpYmlsaXR5VXNlcnMiLCJnZXRSZWNvbW1lbmRlZE1vdmllcyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQSxJQUFNQSxTQUFRLFNBQVJBLE1BQVEsQ0FBQ0MsSUFBRCxFQUFNQyxJQUFOLEVBQWE7QUFDM0IsTUFBTUMsT0FBS0MsS0FBS0MsR0FBTCxDQUFTSixPQUFLQyxJQUFkLENBQVg7QUFDQSxTQUFPLElBQUVDLElBQVQ7QUFDQyxDQUhEOztBQUtBLElBQU1HLE9BQU8sU0FBUEEsSUFBTyxDQUFDQyxLQUFELEVBQVFDLE1BQVIsRUFBa0I7QUFDL0IsTUFBTUMsUUFBTyxFQUFiO0FBQ0UsT0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUdILE1BQU1JLE1BQXpCLEVBQWlDRCxHQUFqQyxF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QUVqRCxDQUZEIiwiZmlsZSI6InJlcXVlc3QtaGFuZGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy9UaGUgYWxnb3JpdGhtXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5jb25zdCBoZWxwZXI9IChudW0xLG51bTIpPT57XHJcbmNvbnN0IGRpZmY9TWF0aC5hYnMobnVtMS1udW0yKTtcclxucmV0dXJuIDUtZGlmZjtcclxufVxyXG5cclxuY29uc3QgY29tcCA9IChmaXJzdCwgc2Vjb25kKT0+IHtcclxuY29uc3QgZmluYWw9IFtdXHJcbiAgZm9yIChsZXQgaSA9IDA7IGk8IGZpcnN0Lmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBzZWNvbmQubGVuZ3RoOyB4KyspIHtcclxuXHJcbiAgICAgIGlmIChmaXJzdFtpXVswXSA9PT0gc2Vjb25kW3hdWzBdKSB7XHJcblxyXG4gICAgZmluYWwucHVzaChoZWxwZXIoZmlyc3RbaV1bMV0sc2Vjb25kW3hdWzFdKSlcclxuXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG5jb25zdCBzdW09IGZpbmFsLnJlZHVjZShmdW5jdGlvbihhLGIpe3JldHVybiBhK2J9LDApO1xyXG5yZXR1cm4gTWF0aC5yb3VuZCgyMCpzdW0vZmluYWwubGVuZ3RoKVxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcblxyXG5cclxuXHJcbnZhciBkYiA9IHJlcXVpcmUoJy4uL2FwcC9kYkNvbm5lY3Rpb24nKTtcclxudmFyIG15c3FsID0gcmVxdWlyZSgnbXlzcWwnKTtcclxudmFyIGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XHJcbnZhciBNb3ZpZSA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvbW92aWUnKTtcclxudmFyIFJhdGluZyA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvcmF0aW5nJyk7XHJcbnZhciBSZWxhdGlvbiA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvcmVsYXRpb24nKTtcclxudmFyIFVzZXIgPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL3VzZXInKTtcclxudmFyIGFsbFJlcXVlc3QgPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL2FsbFJlcXVlc3QnKTtcclxuXHJcbnZhciBNb3ZpZXMgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvbW92aWVzJyk7XHJcbnZhciBSYXRpbmdzID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL3JhdGluZ3MnKTtcclxudmFyIFJlbGF0aW9ucyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy9yZWxhdGlvbnMnKTtcclxudmFyIFVzZXJzID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL3VzZXJzJyk7XHJcbnZhciBhbGxSZXF1ZXN0cyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy9hbGxSZXF1ZXN0cycpO1xyXG5cclxudmFyIFByb21pc2UgPSByZXF1aXJlKFwiYmx1ZWJpcmRcIik7XHJcbnZhciByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdCcpO1xyXG5cclxuXHJcbnZhciBjb24gPSBteXNxbC5jcmVhdGVDb25uZWN0aW9uKHtcclxuICAgIGhvc3QgICAgIDogJzEyNy4wLjAuMScsXHJcbiAgICB1c2VyICAgICA6ICdyb290JyxcclxuICAgIHBhc3N3b3JkIDogJzEyMzQ1JyxcclxuICAgIGRhdGFiYXNlIDogJ01haW5EYXRhYmFzZScsXHJcbn0pO1xyXG5cclxuY29uLmNvbm5lY3QoZnVuY3Rpb24oZXJyKXtcclxuICBpZihlcnIpe1xyXG4gICAgY29uc29sZS5sb2coJ0Vycm9yIGNvbm5lY3RpbmcgdG8gRGInKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgY29uc29sZS5sb2coJ0Nvbm5lY3Rpb24gZXN0YWJsaXNoZWQnKTtcclxufSk7XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vdXNlciBhdXRoXHJcbi8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5leHBvcnRzLnNpZ251cFVzZXIgPSAocmVxLCByZXMpPT4ge1xyXG5cdGNvbnNvbGUubG9nKCdjYWxsaW5nIGxvZ2luJywgcmVxLmJvZHkpO1xyXG5cdC8vIGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBzZXNzaW9uJyxyZXEuc2Vzc2lvbilcclxuICBuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEuYm9keS5uYW1lIH0pLmZldGNoKCkudGhlbihmb3VuZCA9PntcclxuXHQgIGlmIChmb3VuZCkge1xyXG5cdCAgXHQvL2NoZWNrIHBhc3N3b3JkXHJcblx0ICBcdCAgIC8vaWYgKHBhc3N3b3JkIG1hdGNoZXMpXHJcblx0ICBcdCAgIC8veyBhZGQgc2Vzc2lvbnMgYW5kIHJlZGlyZWN0fVxyXG5cdCAgXHRjb25zb2xlLmxvZygndXNlcm5hbWUgYWxyZWFkeSBleGlzdCwgY2Fubm90IHNpZ251cCAnLCByZXEuYm9keS5uYW1lKTtcclxuXHQgICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoJ3VzZXJuYW1lIGV4aXN0Jyk7XHJcblx0ICB9IGVsc2Uge1xyXG5cdCAgXHRjb25zb2xlLmxvZygnY3JlYXRpbmcgdXNlcicpO1xyXG4gICAgICByZXEubXlTZXNzaW9uLnVzZXIgPSByZXEuYm9keS5uYW1lO1xyXG5cdCAgICBVc2Vycy5jcmVhdGUoe1xyXG5cdCAgICAgIHVzZXJuYW1lOiByZXEuYm9keS5uYW1lLFxyXG5cdCAgICAgIHBhc3N3b3JkOiByZXEuYm9keS5wYXNzd29yZCxcclxuXHQgICAgfSlcclxuXHQgICAgLnRoZW4oZnVuY3Rpb24odXNlcikge1xyXG5cdFx0ICBcdGNvbnNvbGUubG9nKCdjcmVhdGVkIGEgbmV3IHVzZXInKTtcclxuXHQgICAgICByZXMuc3RhdHVzKDIwMSkuc2VuZCgnbG9naW4gY3JlYXRlZCcpO1xyXG5cdCAgICB9KTtcclxuXHQgIH1cclxuXHR9KTtcclxufTtcclxuXHJcblxyXG5leHBvcnRzLnNlbmRXYXRjaFJlcXVlc3QgPSAocmVxLCByZXNwb25zZSk9PiB7XHJcblx0Y29uc29sZS5sb2cocmVxLmJvZHkucmVxdWVzdGVlKVxyXG5cdGlmIChBcnJheS5pc0FycmF5KHJlcS5ib2R5LnJlcXVlc3RlZSkpIHtcclxuXHRcdHZhciByZXF1ZXN0ZWVzID0gcmVxLmJvZHkucmVxdWVzdGVlO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR2YXIgcmVxdWVzdGVlcyA9IFtyZXEuYm9keS5yZXF1ZXN0ZWVdO1xyXG5cdH1cclxuXHRQcm9taXNlLmVhY2gocmVxdWVzdGVlcywgcmVxdWVzdGVlID0+e1xyXG5cdFx0Y29uc3QgcmVxdWVzdCA9IHtcclxuICAgICAgbWVzc2FnZTogcmVxLmJvZHkubWVzc2FnZSxcclxuXHRcdFx0cmVxdWVzdG9yOiByZXEubXlTZXNzaW9uLnVzZXIsIFxyXG5cdFx0XHRyZXF1ZXN0VHlwOid3YXRjaCcsXHJcblx0XHRcdG1vdmllOnJlcS5ib2R5Lm1vdmllLFxyXG5cdFx0XHRyZXF1ZXN0ZWU6IHJlcXVlc3RlZVxyXG5cdFx0fTtcclxuXHRcdGNvbi5xdWVyeSgnSU5TRVJUIElOVE8gYWxscmVxdWVzdHMgU0VUID8nLCByZXF1ZXN0LCAoZXJyLHJlcyk9PntcclxuXHRcdCAgaWYoZXJyKSB0aHJvdyBlcnI7XHJcblx0XHQgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xyXG5cdFx0fSk7XHJcblx0fSlcclxuXHQudGhlbihkb25lPT57XHJcblx0XHRyZXNwb25zZS5zZW5kKCdTdWNjZXNzJyk7XHJcblx0fSlcclxufVxyXG5cclxuZXhwb3J0cy5yZW1vdmVXYXRjaFJlcXVlc3QgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIGlmIChBcnJheS5pc0FycmF5KHJlcS5ib2R5LnJlcXVlc3RlZSkpIHtcclxuICAgIHZhciByZXF1ZXN0ZWVzID0gcmVxLmJvZHkucmVxdWVzdGVlO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB2YXIgcmVxdWVzdGVlcyA9IFtyZXEuYm9keS5yZXF1ZXN0ZWVdO1xyXG4gIH1cclxuICB2YXIgcmVxdWVzdG9yPXJlcS5ib2R5LnJlcXVlc3RvcjtcclxuICB2YXIgbW92aWUgPSByZXEuYm9keS5tb3ZpZTtcclxuXHJcbiAgYWxsUmVxdWVzdC5mb3JnZSh7cmVxdWVzdG9yOiByZXF1ZXN0b3IsIHJlcXVlc3RlZTogcmVxdWVzdGVlcywgbW92aWU6IG1vdmllIH0pXHJcbiAgICAuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGFsbFJlcXVlc3QpIHtcclxuICAgICAgYWxsUmVxdWVzdC5kZXN0cm95KClcclxuICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHJlcy5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6ICdVc2VyIHN1Y2Nlc3NmdWxseSBkZWxldGVkJ319KTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcclxuICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcblxyXG5leHBvcnRzLnNlbmRSZXF1ZXN0ID0gKHJlcSwgcmVzcG9uc2UpPT4ge1xyXG4gIGNvbnNvbGUubG9nKCd0aGlzIGlzIHdoYXQgSW0gZ2V0dGluZycsIHJlcS5ib2R5KTtcclxuICBpZiAocmVxLm15U2Vzc2lvbi51c2VyID09PSByZXEuYm9keS5uYW1lKSB7XHJcbiAgICByZXNwb25zZS5zZW5kKFwiWW91IGNhbid0IGZyaWVuZCB5b3Vyc2VsZiFcIilcclxuICB9IGVsc2Uge1xyXG5cclxuICAgIHZhciByZXF1ZXN0ID0ge1xyXG4gICAgICByZXF1ZXN0b3I6IHJlcS5teVNlc3Npb24udXNlcixcclxuICAgICAgcmVxdWVzdGVlOiByZXEuYm9keS5uYW1lLFxyXG4gICAgICByZXF1ZXN0VHlwOiAnZnJpZW5kJ1xyXG4gICAgfTtcclxuXHJcbiAgICBjb24ucXVlcnkoJ1NFTEVDVCByZXF1ZXN0ZWUscmVzcG9uc2UgRlJPTSBhbGxyZXF1ZXN0cyBXSEVSRSAgcmVxdWVzdG9yID0gPyBBTkQgcmVxdWVzdFR5cCA9JyArICdcIicgKyAnZnJpZW5kJyArICdcIicsIHJlcXVlc3RbJ3JlcXVlc3RvciddLCBmdW5jdGlvbihlcnIsIHJlcykge1xyXG4gICAgICBpZiAoIXJlcykge1xyXG4gICAgICAgIHJlc3BvbnNlLnNlbmQoJ25vIGZyaWVuZHMnKVxyXG4gICAgICB9XHJcbiAgICAgIHZhciBwcGxSZXFkID0gcmVzLmZpbHRlcihhPT4gKFxyXG4gICAgICAgICBhLnJlc3BvbnNlID09PSBudWxsXHJcbiAgICAgICkpXHJcbiAgICAgIHZhciByZXF1ZXN0ZWVzID0gcHBsUmVxZC5tYXAoYT0+IChcclxuICAgICAgICAgYS5yZXF1ZXN0ZWVcclxuICAgICAgKSlcclxuICAgICAgY29uc29sZS5sb2coJ25hbWVzIG9mIHBlb3BsZSB3aG9tIEl2ZSByZXF1ZXN0ZWQgYXMgZnJpZW5kcycsIHBwbFJlcWQpO1xyXG5cclxuXHJcblxyXG4gICAgICBjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIGFsbHJlcXVlc3RzIFNFVCA/JywgcmVxdWVzdCwgKGVyciwgcmVzcCk9PiB7XHJcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXNwLmluc2VydElkKTtcclxuICAgICAgICByZXNwb25zZS5zZW5kKHJlcXVlc3RlZXMpO1xyXG4gICAgICB9KVxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxufTtcclxuXHJcblxyXG5leHBvcnRzLmxpc3RSZXF1ZXN0cyA9IChyZXEsIHJlc3BvbnNlKSA9PiB7XHJcbiAgdmFyIHJlcXVlc3QgPSByZXEubXlTZXNzaW9uLnVzZXI7XHJcbiAgY29uLnF1ZXJ5KCdTZWxlY3QgKiBGUk9NIGFsbHJlcXVlc3RzIFdIRVJFIHJlcXVlc3RlZT0nICsgJ1wiJyArIHJlcXVlc3QgKyAnXCInICsgJycgKyAnT1IgcmVxdWVzdG9yID0nICsgJ1wiJyArIHJlcXVlc3QgKyAnXCInICsgJycsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XHJcbiAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICBjb25zb2xlLmxvZyhyZXMpXHJcbiAgICByZXNwb25zZS5zZW5kKFtyZXMsIHJlcXVlc3RdKTtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG5leHBvcnRzLmFjY2VwdCA9IGZ1bmN0aW9uKHJlcSwgcmVzcG9uc2UpIHtcclxuICB2YXIgcmVxdWVzdG9yPXJlcS5ib2R5LnBlcnNvblRvQWNjZXB0O1xyXG4gIHZhciByZXF1ZXN0ZWU9cmVxLm15U2Vzc2lvbi51c2VyO1xyXG4gIHZhciBtb3ZpZSA9IHJlcS5ib2R5Lm1vdmllO1xyXG4gIHZhciByZXF1ZXN0VHlwZSA9IFwiZnJpZW5kXCI7XHJcblxyXG4gIGlmIChtb3ZpZSA9PT0gJycpIHtcclxuICAgIGNvbi5xdWVyeSgnVVBEQVRFIGFsbHJlcXVlc3RzIFNFVCByZXNwb25zZT0nKydcIicgKyAneWVzJyArICdcIicrJyAgV0hFUkUgcmVxdWVzdG9yID0gJysnXCInKyByZXF1ZXN0b3IrJ1wiJysnIEFORCByZXF1ZXN0VHlwPScrJ1wiJytyZXF1ZXN0VHlwZSsnXCInLCAoZXJyLCByZXMpPT4ge1xyXG4gICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XHJcbiAgICB9KTtcclxuXHJcbiAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCByZXF1ZXN0b3IsIChlcnIsIHJlcyk9PiB7XHJcbiAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzWzBdLmlkLCBlcnIpO1xyXG4gICAgdmFyIHBlcnNvbjEgPSByZXNbMF0uaWQ7XHJcbiAgICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIHJlcXVlc3RlZSwgKGVyciwgcmVzcCk9PiB7XHJcbiAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlc3BbMF0uaWQsIGVycik7XHJcblxyXG4gICAgICB2YXIgcGVyc29uMiA9IHJlc3BbMF0uaWQ7XHJcbiAgICAgIHZhciByZXF1ZXN0ID0ge1xyXG4gICAgICAgIHVzZXIxaWQ6IHBlcnNvbjEsXHJcbiAgICAgICAgdXNlcjJpZDogcGVyc29uMlxyXG4gICAgICB9XHJcbiAgICAgIHZhciByZXF1ZXN0MiA9IHtcclxuICAgICAgICB1c2VyMWlkOiBwZXJzb24yLFxyXG4gICAgICAgIHVzZXIyaWQ6IHBlcnNvbjFcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc29sZS5sb2coJ3RoZSByZXF1ZXN0czo6OicscmVxdWVzdCxyZXF1ZXN0MilcclxuICAgICAgY29uLnF1ZXJ5KCdJTlNFUlQgSU5UTyByZWxhdGlvbnMgU0VUID8nLCByZXF1ZXN0LCAoZXJyLCByZXMpPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcclxuXHJcbiAgICAgIGNvbi5xdWVyeSgnSU5TRVJUIElOVE8gcmVsYXRpb25zIFNFVCA/JywgcmVxdWVzdDIsIChlcnIsIHJlcyk9PiB7XHJcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XHJcblxyXG4gICAgICAgICAgIHJlc3BvbnNlLnNlbmQoJ1N1Y2Nlc3MnKTtcclxuICAgICAgICB9KVxyXG4gICAgICB9KTtcclxuICAgIH0pXHJcbiAgfSlcclxuICB9IGVsc2Uge1xyXG4gIGNvbnNvbGUubG9nKCd0aGlzIGlzIHJlcSBib2R5ICcscmVxLmJvZHkpO1xyXG5cclxuICBjb24ucXVlcnkoJ1VQREFURSBhbGxyZXF1ZXN0cyBTRVQgcmVzcG9uc2U9JysnXCInICsgJ3llcycgKyAnXCInKycgIFdIRVJFIHJlcXVlc3RvciA9ICcrJ1wiJysgcmVxdWVzdG9yKydcIicrJyBBTkQgbW92aWU9JysnXCInKyBtb3ZpZSsnXCInLCBmdW5jdGlvbihlcnIsIHJlcykge1xyXG4gICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcclxuICB9KTtcclxuXHJcbiAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCByZXEuYm9keS5wZXJzb25Ub0FjY2VwdCwgZnVuY3Rpb24oZXJyLCByZXMpIHtcclxuICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXNbMF0uaWQsIGVycik7XHJcbiAgICB2YXIgcGVyc29uMSA9IHJlc1swXS5pZDtcclxuICAgIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgcmVxLm15U2Vzc2lvbi51c2VyLCBmdW5jdGlvbihlcnIsIHJlc3ApIHtcclxuICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzcFswXS5pZCwgZXJyKTtcclxuXHJcbiAgICAgIHZhciBwZXJzb24yID0gcmVzcFswXS5pZDtcclxuICAgICAgdmFyIHJlcXVlc3QgPSB7XHJcbiAgICAgICAgdXNlcjFpZDogcGVyc29uMSxcclxuICAgICAgICB1c2VyMmlkOiBwZXJzb24yXHJcbiAgICAgIH1cclxuICAgICAgdmFyIHJlcXVlc3QyID0ge1xyXG4gICAgICAgIHVzZXIxaWQ6IHBlcnNvbjIsXHJcbiAgICAgICAgdXNlcjJpZDogcGVyc29uMVxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zb2xlLmxvZygndGhlIHJlcXVlc3RzOjo6JyxyZXF1ZXN0LHJlcXVlc3QyKVxyXG4gICAgICBjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIHJlbGF0aW9ucyBTRVQgPycsIHJlcXVlc3QsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XHJcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xyXG5cclxuICAgICAgY29uLnF1ZXJ5KCdJTlNFUlQgSU5UTyByZWxhdGlvbnMgU0VUID8nLCByZXF1ZXN0MiwgZnVuY3Rpb24oZXJyLCByZXMpIHtcclxuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcclxuXHJcbiAgICAgICAgICAgcmVzcG9uc2Uuc2VuZCgnVGhhdHMgbXkgc3R5bGUhISEnKTtcclxuICAgICAgICB9KVxyXG4gICAgICB9KTtcclxuICAgIH0pXHJcbiAgfSlcclxufVxyXG4gIC8vIGFsbFJlcXVlc3QuZm9yZ2Uoe3JlcXVlc3RvcjogcmVxdWVzdG9yLCByZXF1ZXN0ZWU6IHJlcXVlc3RlZX0pXHJcbiAgLy8gICAuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGFsbFJlcXVlc3QpIHtcclxuICAvLyAgICAgYWxsUmVxdWVzdC5kZXN0cm95KClcclxuICAvLyAgICAgICAudGhlbihmdW5jdGlvbigpIHtcclxuICAvLyAgICAgICAgIHJlc3BvbnNlLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogJ1VzZXIgc3VjY2Vzc2Z1bGx5IGRlbGV0ZWQnfX0pO1xyXG4gIC8vICAgICAgIH0pXHJcbiAgLy8gICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xyXG4gIC8vICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcclxuICAvLyAgICAgICB9KTtcclxuICAvLyAgIH0pXHJcbiAgLy8gICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XHJcbiAgLy8gICAgIHJlc3BvbnNlLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XHJcbiAgLy8gICB9KTtcclxufTtcclxuXHJcbmV4cG9ydHMucmVtb3ZlUmVxdWVzdCA9IChyZXEsIHJlcykgPT57XHJcbiAgdmFyIHJlcXVlc3Rvcj1yZXEuYm9keS5yZXF1ZXN0b3I7XHJcbiAgdmFyIHJlcXVlc3RlZT1yZXEuYm9keS5yZXF1ZXN0ZWU7XHJcblxyXG4gIGFsbFJlcXVlc3QuZm9yZ2Uoe3JlcXVlc3RvcjogcmVxdWVzdG9yLCByZXF1ZXN0ZWU6IHJlcXVlc3RlZX0pXHJcbiAgICAuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGFsbFJlcXVlc3QpIHtcclxuICAgICAgYWxsUmVxdWVzdC5kZXN0cm95KClcclxuICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHJlcy5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6ICdVc2VyIHN1Y2Nlc3NmdWxseSBkZWxldGVkJ319KTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IHJlcS5ib2R5fX0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcclxuICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogcmVxLmJvZHl9fSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0cy5nZXRUaGlzRnJpZW5kc01vdmllcz1mdW5jdGlvbihyZXEscmVzcG9uc2Upe1xyXG5cclxuICB2YXIgbW92aWVzPVtdO1xyXG4gIGNvbnNvbGUubG9nKHJlcS5ib2R5LnNwZWNpZmljRnJpZW5kKTtcclxuICB2YXIgcGVyc29uPXJlcS5ib2R5LnNwZWNpZmljRnJpZW5kXHJcbiAgdmFyIGlkPW51bGxcclxuICB2YXIgbGVuPW51bGw7XHJcbiAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCBwZXJzb24sIGZ1bmN0aW9uKGVyciwgcmVzcCl7XHJcbmNvbnNvbGUubG9nKHJlc3ApXHJcbmlkPXJlc3BbMF0uaWQ7XHJcblxyXG5cclxuY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHJhdGluZ3MgV0hFUkUgdXNlcmlkID0gPycsIGlkICxmdW5jdGlvbihlcnIscmVzcCl7XHJcbmNvbnNvbGUubG9nKCdlcnJycnJycnJyJyxlcnIscmVzcC5sZW5ndGgpXHJcbmxlbj1yZXNwLmxlbmd0aDtcclxucmVzcC5mb3JFYWNoKGZ1bmN0aW9uKGEpe1xyXG5cclxuY29uLnF1ZXJ5KCdTRUxFQ1QgdGl0bGUgRlJPTSBtb3ZpZXMgV0hFUkUgaWQgPSA/JywgYS5tb3ZpZWlkICxmdW5jdGlvbihlcnIscmVzcCl7XHJcbiAgY29uc29sZS5sb2cocmVzcClcclxubW92aWVzLnB1c2goW3Jlc3BbMF0udGl0bGUsYS5zY29yZSxhLnJldmlld10pXHJcbmNvbnNvbGUubG9nKG1vdmllcylcclxuaWYgKG1vdmllcy5sZW5ndGg9PT1sZW4pe1xyXG4gIHJlc3BvbnNlLnNlbmQobW92aWVzKTtcclxufVxyXG59KVxyXG5cclxufSlcclxuXHJcbn0pXHJcblxyXG5cclxuICB9XHJcblxyXG4pfVxyXG5cclxuZXhwb3J0cy5maW5kTW92aWVCdWRkaWVzPWZ1bmN0aW9uKHJlcSxyZXNwb25zZSl7XHJcbiAgY29uc29sZS5sb2coXCJ5b3UncmUgdHJ5aW5nIHRvIGZpbmQgYnVkZGllcyEhXCIpO1xyXG5jb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gdXNlcnMnLGZ1bmN0aW9uKGVycixyZXNwKXtcclxuICB2YXIgcGVvcGxlPXJlc3AubWFwKGZ1bmN0aW9uKGEpe3JldHVybiBhLnVzZXJuYW1lfSlcclxuICB2YXIgSWRzPSByZXNwLm1hcChmdW5jdGlvbihhKXtyZXR1cm4gYS5pZH0pXHJcbiAgdmFyIGlkS2V5T2JqPXt9XHJcbmZvciAodmFyIGk9MDtpPElkcy5sZW5ndGg7aSsrKXtcclxuICBpZEtleU9ialtJZHNbaV1dPXBlb3BsZVtpXVxyXG59XHJcbmNvbnNvbGUubG9nKCdjdXJyZW50IHVzZXInLHJlcS5teVNlc3Npb24udXNlcik7XHJcbnZhciBjdXJyZW50VXNlcj1yZXEubXlTZXNzaW9uLnVzZXJcclxuXHJcblxyXG4gdmFyIG9iajE9e307XHJcbiAgZm9yICh2YXIgaT0wO2k8SWRzLmxlbmd0aDtpKyspe1xyXG5vYmoxW2lkS2V5T2JqW0lkc1tpXV1dPVtdO1xyXG4gIH1cclxuXHJcbiAgY29uLnF1ZXJ5KCdTRUxFQ1Qgc2NvcmUsbW92aWVpZCx1c2VyaWQgRlJPTSByYXRpbmdzJyxmdW5jdGlvbihlcnIscmVzcG9uKXtcclxuICBcclxuZm9yICh2YXIgaT0wO2k8cmVzcG9uLmxlbmd0aDtpKyspe1xyXG4gIG9iajFbaWRLZXlPYmpbcmVzcG9uW2ldLnVzZXJpZF1dLnB1c2goW3Jlc3BvbltpXS5tb3ZpZWlkLHJlc3BvbltpXS5zY29yZV0pXHJcbn1cclxuXHJcbmNvbnNvbGUubG9nKCdvYmoxJyxvYmoxKTtcclxuY3VycmVudFVzZXJJbmZvPW9iajFbY3VycmVudFVzZXJdXHJcbi8vY29uc29sZS5sb2coJ2N1cnJlbnRVc2VySW5mbycsY3VycmVudFVzZXJJbmZvKVxyXG52YXIgY29tcGFyaXNvbnM9e31cclxuXHJcbmZvciAodmFyIGtleSBpbiBvYmoxKXtcclxuICBpZiAoa2V5IT09Y3VycmVudFVzZXIpIHtcclxuICAgIGNvbXBhcmlzb25zW2tleV09Y29tcChjdXJyZW50VXNlckluZm8sb2JqMVtrZXldKVxyXG4gIH1cclxufVxyXG5jb25zb2xlLmxvZyhjb21wYXJpc29ucylcclxudmFyIGZpbmFsU2VuZD1bXVxyXG5mb3IgKHZhciBrZXkgaW4gY29tcGFyaXNvbnMpe1xyXG4gIGlmIChjb21wYXJpc29uc1trZXldICE9PSAnTmFOJScpIHtcclxuICBmaW5hbFNlbmQucHVzaChba2V5LGNvbXBhcmlzb25zW2tleV1dKTtcclxufSBlbHNlICB7XHJcbiAgZmluYWxTZW5kLnB1c2goW2tleSxcIk5vIENvbXBhcmlzb24gdG8gTWFrZVwiXSlcclxufVxyXG5cclxufVxyXG5cclxuICByZXNwb25zZS5zZW5kKGZpbmFsU2VuZClcclxufSlcclxufSlcclxufVxyXG5cclxuXHJcbmV4cG9ydHMuZGVjbGluZT1mdW5jdGlvbihyZXEscmVzcG9uc2Upe1xyXG4gIHZhciByZXF1ZXN0b3I9cmVxLmJvZHkucGVyc29uVG9EZWNsaW5lO1xyXG4gIHZhciByZXF1ZXN0ZWU9cmVxLm15U2Vzc2lvbi51c2VyO1xyXG4gIHZhciBtb3ZpZT1yZXEuYm9keS5tb3ZpZTtcclxuICB2YXIgcmVxdWVzdFR5cGUgPSAnZnJpZW5kJztcclxuXHJcbiAgaWYgKG1vdmllID09PSAnJykge1xyXG4gICAgY29uLnF1ZXJ5KCdVUERBVEUgYWxscmVxdWVzdHMgU0VUIHJlc3BvbnNlPScrJ1wiJyArICdubycgKyAnXCInKyAnIFdIRVJFIHJlcXVlc3RvciA9ICcrJ1wiJysgcmVxdWVzdG9yKydcIicrJyBBTkQgcmVxdWVzdFR5cD0nKydcIicrIHJlcXVlc3RUeXBlKydcIicsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XHJcbiAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XHJcbiAgICAgIHJlc3BvbnNlLnNlbmQocmVxdWVzdG9yICsgJ2RlbGV0ZWQnKTtcclxuICAgIH0pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjb24ucXVlcnkoJ1VQREFURSBhbGxyZXF1ZXN0cyBTRVQgcmVzcG9uc2U9JysnXCInICsgJ25vJyArICdcIicrICcgV0hFUkUgcmVxdWVzdG9yID0gJysnXCInKyByZXF1ZXN0b3IrJ1wiJysnIEFORCByZXF1ZXN0ZWU9JysnXCInKyByZXF1ZXN0ZWUrJ1wiJysnIEFORCBtb3ZpZSA9JysnXCInK21vdmllKydcIicsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XHJcbiAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XHJcbiAgICAgIHJlc3BvbnNlLnNlbmQocmVxdWVzdG9yICsgJ2RlbGV0ZWQnKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gYWxsUmVxdWVzdC5mb3JnZSh7cmVxdWVzdG9yOiByZXF1ZXN0b3IsIHJlcXVlc3RlZTogcmVxdWVzdGVlfSlcclxuICAvLyAgIC5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oYWxsUmVxdWVzdCkge1xyXG4gIC8vICAgICBhbGxSZXF1ZXN0LmRlc3Ryb3koKVxyXG4gIC8vICAgICAgIC50aGVuKGZ1bmN0aW9uKCkge1xyXG4gIC8vICAgICAgICAgcmVzcG9uc2UuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiAnVXNlciBzdWNjZXNzZnVsbHkgZGVsZXRlZCd9fSk7XHJcbiAgLy8gICAgICAgfSlcclxuICAvLyAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XHJcbiAgLy8gICAgICAgICByZXNwb25zZS5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xyXG4gIC8vICAgICAgIH0pO1xyXG4gIC8vICAgfSlcclxuICAvLyAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcclxuICAvLyAgICAgcmVzcG9uc2Uuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcclxuICAvLyAgIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0cy5zaWdudXBVc2VyID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICBjb25zb2xlLmxvZygnY2FsbGluZyBsb2dpbicsIHJlcS5ib2R5KTtcclxuICAvLyBjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgc2Vzc2lvbicscmVxLnNlc3Npb24pXHJcbiAgbmV3IFVzZXIoeyB1c2VybmFtZTogcmVxLmJvZHkubmFtZSB9KS5mZXRjaCgpLnRoZW4oZnVuY3Rpb24oZm91bmQpIHtcclxuICAgIGlmIChmb3VuZCkge1xyXG4gICAgICAvL2NoZWNrIHBhc3N3b3JkXHJcbiAgICAgICAgIC8vaWYgKHBhc3N3b3JkIG1hdGNoZXMpXHJcbiAgICAgICAgIC8veyBhZGQgc2Vzc2lvbnMgYW5kIHJlZGlyZWN0fVxyXG4gICAgICBjb25zb2xlLmxvZygndXNlcm5hbWUgYWxyZWFkeSBleGlzdCwgY2Fubm90IHNpZ251cCAnLCByZXEuYm9keS5uYW1lKTtcclxuICAgICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoJ3VzZXJuYW1lIGV4aXN0Jyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZygnY3JlYXRpbmcgdXNlcicpO1xyXG4gICAgICByZXEubXlTZXNzaW9uLnVzZXIgPSByZXEuYm9keS5uYW1lO1xyXG4gICAgICBVc2Vycy5jcmVhdGUoe1xyXG4gICAgICAgIHVzZXJuYW1lOiByZXEuYm9keS5uYW1lLFxyXG4gICAgICAgIHBhc3N3b3JkOiByZXEuYm9keS5wYXNzd29yZCxcclxuICAgICAgfSlcclxuICAgICAgLnRoZW4oZnVuY3Rpb24odXNlcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjcmVhdGVkIGEgbmV3IHVzZXInKTtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMSkuc2VuZCgnbG9naW4gY3JlYXRlZCcpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxufTtcclxuXHJcbmV4cG9ydHMuc2lnbmluVXNlciA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcblx0Y29uc29sZS5sb2coJ2NhbGxpbmcgc2lnbmluJywgcmVxLmJvZHkpO1xyXG5cdG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUgfSkuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGZvdW5kKXtcclxuXHJcblx0XHRpZiAoZm91bmQpe1xyXG5cdFx0XHRuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEuYm9keS5uYW1lLCBwYXNzd29yZDpyZXEuYm9keS5wYXNzd29yZH0pLmZldGNoKCkudGhlbihmdW5jdGlvbihmb3VuZCl7XHJcblx0XHRcdFx0aWYgKGZvdW5kKXtcclxuXHRcdFx0XHRcdHJlcS5teVNlc3Npb24udXNlciA9IGZvdW5kLmF0dHJpYnV0ZXMudXNlcm5hbWU7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhmb3VuZC5hdHRyaWJ1dGVzLnVzZXJuYW1lKVxyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ3dlIGZvdW5kIHlvdSEhJylcclxuXHRcdFx0XHRcdHJlcy5zZW5kKFsnaXQgd29ya2VkJyxyZXEubXlTZXNzaW9uLnVzZXJdKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cmVzLnN0YXR1cyg0MDQpLnNlbmQoJ2JhZCBsb2dpbicpO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ3dyb25nIHBhc3N3b3JkJyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmVzLnN0YXR1cyg0MDQpLnNlbmQoJ2JhZCBsb2dpbicpO1xyXG5cdFx0XHRjb25zb2xlLmxvZygndXNlciBub3QgZm91bmQnKTtcclxuXHRcdH1cclxuXHJcbiAgfSkgXHJcblxyXG59XHJcblxyXG5leHBvcnRzLmxvZ291dCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcblx0cmVxLm15U2Vzc2lvbi5kZXN0cm95KGZ1bmN0aW9uKGVycil7XHJcblx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG5cdH0pO1xyXG5cdGNvbnNvbGUubG9nKCdsb2dvdXQnKTtcclxuXHRyZXMuc2VuZCgnbG9nb3V0Jyk7XHJcbn1cclxuXHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy9tb3ZpZSBoYW5kbGVyc1xyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbi8vYSBoYW5kZWxlciB0aGF0IHRha2VzIGEgcmF0aW5nIGZyb20gdXNlciBhbmQgYWRkIGl0IHRvIHRoZSBkYXRhYmFzZVxyXG4vLyBleHBlY3RzIHJlcS5ib2R5IHRvIGhhdmUgdGhpczoge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnLCBwb3N0ZXI6ICdsaW5rJywgcmVsZWFzZV9kYXRlOiAneWVhcicsIHJhdGluZzogJ251bWJlcid9XHJcbmV4cG9ydHMucmF0ZU1vdmllID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuXHRjb25zb2xlLmxvZygnY2FsbGluZyByYXRlTW92aWUnKTtcclxuXHR2YXIgdXNlcmlkO1xyXG5cdHJldHVybiBuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEubXlTZXNzaW9uLnVzZXIgfSkuZmV0Y2goKVxyXG5cdC50aGVuKGZ1bmN0aW9uKGZvdW5kVXNlcikge1xyXG5cdFx0dXNlcmlkID0gZm91bmRVc2VyLmF0dHJpYnV0ZXMuaWQ7XHJcblx0XHRyZXR1cm4gbmV3IFJhdGluZyh7IG1vdmllaWQ6IHJlcS5ib2R5LmlkLCB1c2VyaWQ6IHVzZXJpZCB9KS5mZXRjaCgpXHJcblx0XHQudGhlbihmdW5jdGlvbihmb3VuZFJhdGluZykge1xyXG5cdFx0XHRpZiAoZm91bmRSYXRpbmcpIHtcclxuXHRcdFx0XHQvL3NpbmNlIHJhdGluZyBvciByZXZpZXcgaXMgdXBkYXRlZCBzZXBlcmF0bHkgaW4gY2xpZW50LCB0aGUgZm9sbG93aW5nXHJcblx0XHRcdFx0Ly9tYWtlIHN1cmUgaXQgZ2V0cyB1cGRhdGVkIGFjY29yZGluZyB0byB0aGUgcmVxXHJcblx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ3VwZGF0ZSByYXRpbmcnLCBmb3VuZFJhdGluZylcclxuXHRcdFx0XHRpZiAocmVxLmJvZHkucmF0aW5nKSB7XHJcblx0XHRcdFx0XHR2YXIgcmF0aW5nT2JqID0ge3Njb3JlOiByZXEuYm9keS5yYXRpbmd9O1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAocmVxLmJvZHkucmV2aWV3KSB7XHJcblx0XHRcdFx0XHR2YXIgcmF0aW5nT2JqID0ge3JldmlldzogcmVxLmJvZHkucmV2aWV3fTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIG5ldyBSYXRpbmcoeydpZCc6IGZvdW5kUmF0aW5nLmF0dHJpYnV0ZXMuaWR9KVxyXG5cdFx0XHRcdFx0LnNhdmUocmF0aW5nT2JqKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjb25zb2xlLmxvZygnY3JlYXRpbmcgcmF0aW5nJyk7XHJcblx0XHQgICAgcmV0dXJuIFJhdGluZ3MuY3JlYXRlKHtcclxuXHRcdCAgICBcdHNjb3JlOiByZXEuYm9keS5yYXRpbmcsXHJcblx0XHQgICAgICB1c2VyaWQ6IHVzZXJpZCxcclxuXHRcdCAgICAgIG1vdmllaWQ6IHJlcS5ib2R5LmlkLFxyXG5cdFx0ICAgICAgcmV2aWV3OiByZXEuYm9keS5yZXZpZXdcclxuXHRcdCAgICB9KTtcdFx0XHRcdFx0XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0pXHJcblx0LnRoZW4oZnVuY3Rpb24obmV3UmF0aW5nKSB7XHJcblx0XHRjb25zb2xlLmxvZygncmF0aW5nIGNyZWF0ZWQ6JywgbmV3UmF0aW5nLmF0dHJpYnV0ZXMpO1xyXG4gIFx0cmVzLnN0YXR1cygyMDEpLnNlbmQoJ3JhdGluZyByZWNpZXZlZCcpO1xyXG5cdH0pXHJcbiAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xyXG4gICAgcmVzLnN0YXR1cyg1MDApLnNlbmQoJ2Vycm9yJyk7XHJcbiAgfSlcclxufTtcclxuXHJcbi8vdGhpcyBoZWxwZXIgZnVuY3Rpb24gYWRkcyB0aGUgbW92aWUgaW50byBkYXRhYmFzZVxyXG4vL2l0IGZvbGxvd3MgdGhlIHNhbWUgbW92aWUgaWQgYXMgVE1EQlxyXG4vL2V4cGVjdHMgcmVxLmJvZHkgdG8gaGF2ZSB0aGVzZSBhdHJpYnV0ZSA6IHtpZCwgdGl0bGUsIGdlbnJlLCBwb3N0ZXJfcGF0aCwgcmVsZWFzZV9kYXRlLCBvdmVydmlldywgdm90ZV9hdmVyYWdlfVxyXG52YXIgYWRkT25lTW92aWUgPSBmdW5jdGlvbihtb3ZpZU9iaikge1xyXG5cdHZhciBnZW5yZSA9IChtb3ZpZU9iai5nZW5yZV9pZHMpID8gZ2VucmVzW21vdmllT2JqLmdlbnJlX2lkc1swXV0gOiAnbi9hJztcclxuICByZXR1cm4gbmV3IE1vdmllKHtcclxuICBcdGlkOiBtb3ZpZU9iai5pZCxcclxuICAgIHRpdGxlOiBtb3ZpZU9iai50aXRsZSxcclxuICAgIGdlbnJlOiBnZW5yZSxcclxuICAgIHBvc3RlcjogJ2h0dHBzOi8vaW1hZ2UudG1kYi5vcmcvdC9wL3cxODUvJyArIG1vdmllT2JqLnBvc3Rlcl9wYXRoLFxyXG4gICAgcmVsZWFzZV9kYXRlOiBtb3ZpZU9iai5yZWxlYXNlX2RhdGUsXHJcbiAgICBkZXNjcmlwdGlvbjogbW92aWVPYmoub3ZlcnZpZXcuc2xpY2UoMCwgMjU1KSxcclxuICAgIGltZGJSYXRpbmc6IG1vdmllT2JqLnZvdGVfYXZlcmFnZVxyXG4gIH0pLnNhdmUobnVsbCwge21ldGhvZDogJ2luc2VydCd9KVxyXG4gIC50aGVuKGZ1bmN0aW9uKG5ld01vdmllKSB7XHJcbiAgXHRjb25zb2xlLmxvZygnbW92aWUgY3JlYXRlZCcsIG5ld01vdmllLmF0dHJpYnV0ZXMudGl0bGUpO1xyXG4gIFx0cmV0dXJuIG5ld01vdmllO1xyXG4gIH0pXHJcbn07XHJcblxyXG5cclxuLy9nZXQgYWxsIG1vdmllIHJhdGluZ3MgdGhhdCBhIHVzZXIgcmF0ZWRcclxuLy9zaG91bGQgcmV0dXJuIGFuIGFycmF5IHRoYXQgbG9vayBsaWtlIHRoZSBmb2xsb3dpbmc6XHJcbi8vIFsge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnICwgcG9zdGVyOiAndXJsJywgcmVsZWFzZV9kYXRlOiAnZGF0ZScsIHNjb3JlOiBuLCBmcmllbmRBdmVyYWdlUmF0aW5nOiBufSAuLi4gXVxyXG4vLyB3aWxsIGdldCByYXRpbmdzIGZvciB0aGUgY3VycmVudCB1c2VyXHJcbmV4cG9ydHMuZ2V0VXNlclJhdGluZ3MgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIFJhdGluZy5xdWVyeShmdW5jdGlvbihxYil7XHJcbiAgXHRxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcclxuICBcdHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xyXG4gIFx0cWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnLCAncmF0aW5ncy51cGRhdGVkX2F0Jyk7XHJcbiAgXHRxYi53aGVyZSgndXNlcnMudXNlcm5hbWUnLCAnPScsIHJlcS5teVNlc3Npb24udXNlcik7XHJcbiAgXHRxYi5vcmRlckJ5KCd1cGRhdGVkX2F0JywgJ0RFU0MnKVxyXG4gIH0pXHJcbiAgLmZldGNoQWxsKClcclxuICAudGhlbihmdW5jdGlvbihyYXRpbmdzKXtcclxuXHRcdC8vZGVjb3JhdGUgaXQgd2l0aCBhdmcgZnJpZW5kIHJhdGluZ1xyXG5cdFx0cmV0dXJuIFByb21pc2UubWFwKHJhdGluZ3MubW9kZWxzLCBmdW5jdGlvbihyYXRpbmcpIHtcclxuXHRcdFx0cmV0dXJuIGF0dGFjaEZyaWVuZEF2Z1JhdGluZyhyYXRpbmcsIHJlcS5teVNlc3Npb24udXNlcik7XHJcblx0XHR9KTtcclxuXHR9KVxyXG4gIC50aGVuKGZ1bmN0aW9uKHJhdGluZ3MpIHtcclxuICBcdGNvbnNvbGUubG9nKCdyZXRyaXZpbmcgYWxsIHVzZXIgcmF0aW5ncycpO1xyXG4gIFx0cmVzLnN0YXR1cygyMDApLmpzb24ocmF0aW5ncyk7XHJcbiAgfSlcclxufTtcclxuXHJcbmV4cG9ydHMuZ2V0RnJpZW5kVXNlclJhdGluZ3MgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIFJhdGluZy5xdWVyeShmdW5jdGlvbihxYil7XHJcbiAgXHRxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcclxuICBcdHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xyXG4gIFx0cWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUgYXMgZnJpZW5kU2NvcmUnLCAncmF0aW5ncy5yZXZpZXcgYXMgZnJpZW5kUmV2aWV3JywgJ3JhdGluZ3MudXBkYXRlZF9hdCcpO1xyXG4gIFx0cWIud2hlcmUoJ3VzZXJzLnVzZXJuYW1lJywgJz0nLCByZXEucXVlcnkuZnJpZW5kTmFtZSk7XHJcbiAgXHRxYi5vcmRlckJ5KCd1cGRhdGVkX2F0JywgJ0RFU0MnKVxyXG4gIH0pXHJcbiAgLmZldGNoQWxsKClcclxuICAudGhlbihmdW5jdGlvbihyYXRpbmdzKXtcclxuXHRcdC8vZGVjb3JhdGUgaXQgd2l0aCBjdXJyZW50IHVzZXIncyByYXRpbmdcclxuXHRcdHJldHVybiBQcm9taXNlLm1hcChyYXRpbmdzLm1vZGVscywgZnVuY3Rpb24ocmF0aW5nKSB7XHJcblx0XHRcdHJldHVybiBhdHRhY2hVc2VyUmF0aW5nKHJhdGluZywgcmVxLm15U2Vzc2lvbi51c2VyKTtcclxuXHRcdH0pO1xyXG5cdH0pXHJcbiAgLnRoZW4oZnVuY3Rpb24ocmF0aW5ncykge1xyXG4gIFx0Y29uc29sZS5sb2coJ3JldHJpdmluZyBhbGwgdXNlciByYXRpbmdzJyk7XHJcbiAgXHRyZXMuc3RhdHVzKDIwMCkuanNvbihyYXRpbmdzKTtcclxuICB9KVxyXG59O1xyXG5cclxuLy9hIGRlY29yYXRvciBmdW5jdGlvbiB0aGF0IGF0dGFjaGVzIGZyaWVuZCBhdmcgcmF0aW5nIHRvIHRoZSByYXRpbmcgb2JqXHJcbnZhciBhdHRhY2hGcmllbmRBdmdSYXRpbmcgPSBmdW5jdGlvbihyYXRpbmcsIHVzZXJuYW1lKSB7XHJcblx0cmV0dXJuIGV4cG9ydHMuZ2V0RnJpZW5kUmF0aW5ncyh1c2VybmFtZSwgcmF0aW5nKVxyXG5cdC50aGVuKGZ1bmN0aW9uKGZyaWVuZHNSYXRpbmdzKXtcclxuXHRcdC8vaWYgZnJpZW5kc1JhdGluZ3MgaXMgbnVsbCwgUmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyBpcyBudWxsXHJcblx0XHRpZiAoIWZyaWVuZHNSYXRpbmdzKSB7XHJcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgPSBudWxsO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyA9IGF2ZXJhZ2VSYXRpbmcoZnJpZW5kc1JhdGluZ3MpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJhdGluZztcclxuXHR9KVxyXG59XHJcblxyXG4vL2EgZGVjb3JhdG9yIGZ1bmN0aW9uIHRoYXQgYXR0YWNoZXMgdXNlciByYXRpbmcgYW5kIHJldmlld3MgdG8gdGhlIHJhdGluZyBvYmpcclxudmFyIGF0dGFjaFVzZXJSYXRpbmcgPSBmdW5jdGlvbihyYXRpbmcsIHVzZXJuYW1lKSB7XHJcblx0cmV0dXJuIFJhdGluZy5xdWVyeShmdW5jdGlvbihxYikge1xyXG5cdFx0cWIuaW5uZXJKb2luKCd1c2VycycsICd1c2Vycy5pZCcsICc9JywgJ3JhdGluZ3MudXNlcmlkJylcclxuXHRcdHFiLmlubmVySm9pbignbW92aWVzJywgJ21vdmllcy5pZCcsICc9JywgJ3JhdGluZ3MubW92aWVpZCcpXHJcblx0XHRxYi5zZWxlY3QoJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnKVxyXG5cdFx0cWIud2hlcmUoe1xyXG5cdFx0XHQndXNlcnMudXNlcm5hbWUnOiB1c2VybmFtZSxcclxuXHRcdFx0J21vdmllcy50aXRsZSc6IHJhdGluZy5hdHRyaWJ1dGVzLnRpdGxlLFxyXG5cdFx0XHQnbW92aWVzLmlkJzogcmF0aW5nLmF0dHJpYnV0ZXMuaWRcclxuXHRcdH0pXHJcblx0fSlcclxuXHQuZmV0Y2goKVxyXG5cdC50aGVuKGZ1bmN0aW9uKHVzZXJSYXRpbmcpe1xyXG5cdFx0aWYgKHVzZXJSYXRpbmcpIHtcclxuXHRcdFx0cmF0aW5nLmF0dHJpYnV0ZXMuc2NvcmUgPSB1c2VyUmF0aW5nLmF0dHJpYnV0ZXMuc2NvcmU7XHJcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLnJldmlldyA9IHVzZXJSYXRpbmcuYXR0cmlidXRlcy5yZXZpZXc7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyYXRpbmcuYXR0cmlidXRlcy5zY29yZSA9IG51bGw7XHJcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLnJldmlldyA9IG51bGw7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmF0aW5nO1xyXG5cdH0pO1xyXG59O1xyXG5cclxuLy90aGlzIGlzIGEgd3JhcGVyIGZ1bmN0aW9uIGZvciBnZXRGcmllbmRSYXRpbmdzIHdoaWNoIHdpbGwgc2VudCB0aGUgY2xpZW50IGFsbCBvZiB0aGUgZnJpZW5kIHJhdGluZ3NcclxuZXhwb3J0cy5oYW5kbGVHZXRGcmllbmRSYXRpbmdzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuXHRjb25zb2xlLmxvZygnaGFuZGxlR2V0RnJpZW5kUmF0aW5ncywgJywgcmVxLm15U2Vzc2lvbi51c2VyLCByZXEuYm9keS5tb3ZpZS50aXRsZSk7XHJcblx0ZXhwb3J0cy5nZXRGcmllbmRSYXRpbmdzKHJlcS5teVNlc3Npb24udXNlciwge2F0dHJpYnV0ZXM6IHJlcS5ib2R5Lm1vdmllfSlcclxuXHQudGhlbihmdW5jdGlvbihmcmllbmRSYXRpbmdzKXtcclxuXHRcdHJlcy5qc29uKGZyaWVuZFJhdGluZ3MpO1xyXG5cdH0pO1xyXG59XHJcblxyXG4vL3RoaXMgZnVuY3Rpb24gb3V0cHV0cyByYXRpbmdzIG9mIGEgdXNlcidzIGZyaWVuZCBmb3IgYSBwYXJ0aWN1bGFyIG1vdmllXHJcbi8vZXhwZWN0IGN1cnJlbnQgdXNlcm5hbWUgYW5kIG1vdmllVGl0bGUgYXMgaW5wdXRcclxuLy9vdXRwdXRzOiB7dXNlcjJpZDogJ2lkJywgZnJpZW5kVXNlck5hbWU6J25hbWUnLCBmcmllbmRGaXJzdE5hbWU6J25hbWUnLCB0aXRsZTonbW92aWVUaXRsZScsIHNjb3JlOm4gfVxyXG5leHBvcnRzLmdldEZyaWVuZFJhdGluZ3MgPSBmdW5jdGlvbih1c2VybmFtZSwgbW92aWVPYmopIHtcclxuXHRyZXR1cm4gVXNlci5xdWVyeShmdW5jdGlvbihxYil7XHJcblx0XHRxYi5pbm5lckpvaW4oJ3JlbGF0aW9ucycsICdyZWxhdGlvbnMudXNlcjFpZCcsICc9JywgJ3VzZXJzLmlkJyk7XHJcblx0XHRxYi5pbm5lckpvaW4oJ3JhdGluZ3MnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICdyZWxhdGlvbnMudXNlcjJpZCcpO1xyXG5cdFx0cWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XHJcblx0XHRxYi5zZWxlY3QoJ3JlbGF0aW9ucy51c2VyMmlkJywgJ21vdmllcy50aXRsZScsICdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3Jyk7XHJcblx0XHRxYi53aGVyZSh7XHJcblx0XHRcdCd1c2Vycy51c2VybmFtZSc6IHVzZXJuYW1lLCBcclxuXHRcdFx0J21vdmllcy50aXRsZSc6IG1vdmllT2JqLmF0dHJpYnV0ZXMudGl0bGUsXHJcblx0XHRcdCdtb3ZpZXMuaWQnOiBtb3ZpZU9iai5hdHRyaWJ1dGVzLmlkIH0pO1xyXG5cdH0pXHJcblx0LmZldGNoQWxsKClcclxuXHQudGhlbihmdW5jdGlvbihmcmllbmRzUmF0aW5ncyl7XHJcblx0Ly90aGUgZm9sbG93aW5nIGJsb2NrIGFkZHMgdGhlIGZyaWVuZE5hbWUgYXR0cmlidXRlIHRvIHRoZSByYXRpbmdzXHJcblx0XHRyZXR1cm4gUHJvbWlzZS5tYXAoZnJpZW5kc1JhdGluZ3MubW9kZWxzLCBmdW5jdGlvbihmcmllbmRSYXRpbmcpIHtcclxuXHRcdFx0cmV0dXJuIG5ldyBVc2VyKHsgaWQ6IGZyaWVuZFJhdGluZy5hdHRyaWJ1dGVzLnVzZXIyaWQgfSkuZmV0Y2goKVxyXG5cdFx0XHQudGhlbihmdW5jdGlvbihmcmllbmQpe1xyXG5cdFx0XHRcdGZyaWVuZFJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZFVzZXJOYW1lID0gZnJpZW5kLmF0dHJpYnV0ZXMudXNlcm5hbWU7XHJcblx0XHRcdFx0ZnJpZW5kUmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kRmlyc3ROYW1lID0gZnJpZW5kLmF0dHJpYnV0ZXMuZmlyc3ROYW1lO1xyXG5cdFx0XHRcdHJldHVybiBmcmllbmRSYXRpbmc7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSlcclxuXHQudGhlbihmdW5jdGlvbihmcmllbmRzUmF0aW5ncyl7XHJcblx0XHRyZXR1cm4gZnJpZW5kc1JhdGluZ3M7XHJcblx0fSk7XHJcbn07XHJcblxyXG5cclxuLy9hIGhlbHBlciBmdW5jdGlvbiB0aGF0IGF2ZXJhZ2VzIHRoZSByYXRpbmdcclxuLy9pbnB1dHMgcmF0aW5ncywgb3V0cHV0cyB0aGUgYXZlcmFnZSBzY29yZTtcclxudmFyIGF2ZXJhZ2VSYXRpbmcgPSBmdW5jdGlvbihyYXRpbmdzKSB7XHJcblx0Ly9yZXR1cm4gbnVsbCBpZiBubyBmcmllbmQgaGFzIHJhdGVkIHRoZSBtb3ZpZVxyXG5cdGlmIChyYXRpbmdzLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG5cdHJldHVybiByYXRpbmdzXHJcblx0LnJlZHVjZShmdW5jdGlvbih0b3RhbCwgcmF0aW5nKXtcclxuXHRcdHJldHVybiB0b3RhbCArPSByYXRpbmcuYXR0cmlidXRlcy5zY29yZTtcclxuXHR9LCAwKSAvIHJhdGluZ3MubGVuZ3RoO1xyXG59XHJcblxyXG5cclxuLy9hIGhlbHBlciBmdW5jdGlvbiB0aGF0IG91dHB1dHMgdXNlciByYXRpbmcgYW5kIGF2ZXJhZ2UgZnJpZW5kIHJhdGluZyBmb3Igb25lIG1vdmllXHJcbi8vb3V0cHV0cyBvbmUgcmF0aW5nIG9iajoge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnICwgcG9zdGVyOiAndXJsJywgcmVsZWFzZV9kYXRlOiAnZGF0ZScsIHNjb3JlOiBuLCBmcmllbmRBdmVyYWdlUmF0aW5nOiBufVxyXG52YXIgZ2V0T25lTW92aWVSYXRpbmcgPSBmdW5jdGlvbih1c2VybmFtZSwgbW92aWVPYmopIHtcclxuICByZXR1cm4gUmF0aW5nLnF1ZXJ5KGZ1bmN0aW9uKHFiKXtcclxuICBcdHFiLmlubmVySm9pbigndXNlcnMnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICd1c2Vycy5pZCcpO1xyXG4gIFx0cWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XHJcbiAgXHRxYi5zZWxlY3QoJ3VzZXJzLnVzZXJuYW1lJywgJ21vdmllcy50aXRsZScsICdtb3ZpZXMuaWQnLCAnbW92aWVzLmdlbnJlJywgJ21vdmllcy5wb3N0ZXInLCAnbW92aWVzLnJlbGVhc2VfZGF0ZScsICdtb3ZpZXMuaW1kYlJhdGluZycsICdtb3ZpZXMuZGVzY3JpcHRpb24nLCAncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycpO1xyXG4gIFx0cWIud2hlcmUoeyd1c2Vycy51c2VybmFtZSc6IHVzZXJuYW1lLCAnbW92aWVzLnRpdGxlJzogbW92aWVPYmoudGl0bGUsICdtb3ZpZXMuaWQnOiBtb3ZpZU9iai5pZH0pO1xyXG4gIH0pXHJcbiAgLmZldGNoKClcclxuICAudGhlbihmdW5jdGlvbihyYXRpbmcpe1xyXG5cdCAgaWYgKCFyYXRpbmcpIHtcclxuXHQgIFx0Ly9pZiB0aGUgdXNlciBoYXMgbm90IHJhdGVkIHRoZSBtb3ZpZSwgcmV0dXJuIGFuIG9iaiB0aGF0IGhhcyB0aGUgbW92aWUgaW5mb3JtYXRpb24sIGJ1dCBzY29yZSBpcyBzZXQgdG8gbnVsbFxyXG5cdCAgXHRyZXR1cm4gbmV3IE1vdmllKHt0aXRsZTogbW92aWVPYmoudGl0bGUsIGlkOiBtb3ZpZU9iai5pZH0pLmZldGNoKClcclxuXHQgIFx0LnRoZW4oZnVuY3Rpb24obW92aWUpIHtcclxuXHQgIFx0XHRtb3ZpZS5hdHRyaWJ1dGVzLnNjb3JlID0gbnVsbDtcclxuXHQgIFx0XHRyZXR1cm4gbW92aWU7XHJcblx0ICBcdH0pXHJcblx0ICB9IGVsc2Uge1xyXG5cdCAgXHRyZXR1cm4gcmF0aW5nO1xyXG5cdCAgfVxyXG5cdH0pXHJcblx0LnRoZW4oZnVuY3Rpb24ocmF0aW5nKXtcclxuXHRcdHJldHVybiBleHBvcnRzLmdldEZyaWVuZFJhdGluZ3ModXNlcm5hbWUsIHJhdGluZylcclxuXHRcdC50aGVuKGZ1bmN0aW9uKGZyaWVuZHNSYXRpbmdzKXtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ2ZyaWVuZHNSYXRpbmdzJywgZnJpZW5kc1JhdGluZ3MpO1xyXG5cdFx0XHRyYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nID0gYXZlcmFnZVJhdGluZyhmcmllbmRzUmF0aW5ncyk7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdhZGRlZCBhdmVyYWdlIGZyaWVuZCByYXRpbmcnLCByYXRpbmcuYXR0cmlidXRlcy50aXRsZSwgcmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyk7XHJcblx0XHRcdHJldHVybiByYXRpbmc7XHJcblx0XHR9KTtcclxuXHR9KTtcclxufVxyXG5cclxuXHJcbi8vdGhpcyBoYW5kbGVyIGlzIHNwZWNpZmljYWxseSBmb3Igc2VuZGluZyBvdXQgYSBsaXN0IG9mIG1vdmllIHJhdGluZ3Mgd2hlbiB0aGUgY2xpZW50IHNlbmRzIGEgbGlzdCBvZiBtb3ZpZSB0byB0aGUgc2VydmVyXHJcbi8vZXhwZWN0cyByZXEuYm9keSB0byBiZSBhbiBhcnJheSBvZiBvYmogd2l0aCB0aGVzZSBhdHRyaWJ1dGVzOiB7aWQsIHRpdGxlLCBnZW5yZSwgcG9zdGVyX3BhdGgsIHJlbGVhc2VfZGF0ZSwgb3ZlcnZpZXcsIHZvdGVfYXZlcmFnZX1cclxuLy9vdXRwdXRzIFsge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnICwgcG9zdGVyOiAndXJsJywgcmVsZWFzZV9kYXRlOiAnZGF0ZScsIHNjb3JlOiBuLCBmcmllbmRBdmVyYWdlUmF0aW5nOiBufSAuLi4gXVxyXG5leHBvcnRzLmdldE11bHRpcGxlTW92aWVSYXRpbmdzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuXHRjb25zb2xlLmxvZygnZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MnKTtcclxuXHRQcm9taXNlLm1hcChyZXEuYm9keS5tb3ZpZXMsIGZ1bmN0aW9uKG1vdmllKSB7XHJcblx0XHQvL2ZpcnN0IGNoZWNrIHdoZXRoZXIgbW92aWUgaXMgaW4gdGhlIGRhdGFiYXNlXHJcblx0XHRyZXR1cm4gbmV3IE1vdmllKHt0aXRsZTogbW92aWUudGl0bGUsIGlkOiBtb3ZpZS5pZH0pLmZldGNoKClcclxuXHRcdC50aGVuKGZ1bmN0aW9uKGZvdW5kTW92aWUpIHtcclxuXHRcdFx0Ly9pZiBub3QgY3JlYXRlIG9uZVxyXG5cdFx0XHRpZiAoIWZvdW5kTW92aWUpIHtcclxuXHRcdFx0XHRyZXR1cm4gYWRkT25lTW92aWUobW92aWUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBmb3VuZE1vdmllO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdFx0LnRoZW4oZnVuY3Rpb24oZm91bmRNb3ZpZSl7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdmb3VuZCBtb3ZpZScsIGZvdW5kTW92aWUpO1xyXG5cdFx0XHRyZXR1cm4gZ2V0T25lTW92aWVSYXRpbmcocmVxLm15U2Vzc2lvbi51c2VyLCBmb3VuZE1vdmllLmF0dHJpYnV0ZXMpO1xyXG5cdFx0fSlcclxuXHR9KVxyXG5cdC50aGVuKGZ1bmN0aW9uKHJhdGluZ3Mpe1xyXG5cdFx0Y29uc29sZS5sb2coJ3NlbmRpbmcgcmF0aW5nIHRvIGNsaWVudCcpO1xyXG5cdFx0cmVzLmpzb24ocmF0aW5ncyk7XHJcblx0fSlcclxufVxyXG5cclxuLy90aGlzIGhhbmRsZXIgc2VuZHMgYW4gZ2V0IHJlcXVlc3QgdG8gVE1EQiBBUEkgdG8gcmV0cml2ZSByZWNlbnQgdGl0bGVzXHJcbi8vd2UgY2Fubm90IGRvIGl0IGluIHRoZSBmcm9udCBlbmQgYmVjYXVzZSBjcm9zcyBvcmlnaW4gcmVxdWVzdCBpc3N1ZXNcclxuZXhwb3J0cy5nZXRSZWNlbnRSZWxlYXNlID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICB2YXIgcGFyYW1zID0ge1xyXG4gICAgYXBpX2tleTogJzlkM2IwMzVlZjFjZDY2OWFlZDM5ODQwMGIxN2ZjZWEyJyxcclxuICAgIHByaW1hcnlfcmVsZWFzZV95ZWFyOiBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCksXHJcbiAgICBpbmNsdWRlX2FkdWx0OiBmYWxzZSxcclxuICAgIHNvcnRfYnk6ICdwb3B1bGFyaXR5LmRlc2MnXHJcbiAgfTtcclxuXHJcblx0IFxyXG4gIHZhciBkYXRhID0gJyc7XHJcblx0cmVxdWVzdCh7XHJcblx0XHRtZXRob2Q6ICdHRVQnLFxyXG5cdFx0dXJsOiAnaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy9kaXNjb3Zlci9tb3ZpZS8nLFxyXG5cdFx0cXM6IHBhcmFtc1xyXG5cdH0pXHJcblx0Lm9uKCdkYXRhJyxmdW5jdGlvbihjaHVuayl7XHJcblx0XHRkYXRhICs9IGNodW5rO1xyXG5cdH0pXHJcblx0Lm9uKCdlbmQnLCBmdW5jdGlvbigpe1xyXG5cdFx0cmVjZW50TW92aWVzID0gSlNPTi5wYXJzZShkYXRhKTtcclxuICAgIHJlcS5ib2R5Lm1vdmllcyA9IHJlY2VudE1vdmllcy5yZXN1bHRzO1xyXG4gICAgLy90cmFuc2ZlcnMgdGhlIG1vdmllIGRhdGEgdG8gZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MgdG8gZGVjb3JhdGUgd2l0aCBzY29yZSAodXNlciByYXRpbmcpIGFuZCBhdmdmcmllbmRSYXRpbmcgYXR0cmlidXRlXHJcbiAgICBleHBvcnRzLmdldE11bHRpcGxlTW92aWVSYXRpbmdzKHJlcSwgcmVzKTtcclxuXHJcblx0fSlcclxuXHQub24oJ2Vycm9yJywgZnVuY3Rpb24oZXJyb3Ipe1xyXG5cdFx0Y29uc29sZS5sb2coZXJyb3IpO1xyXG5cdH0pXHJcblxyXG59XHJcblxyXG4vL3RoaXMgaXMgVE1EQidzIGdlbnJlIGNvZGUsIHdlIG1pZ2h0IHdhbnQgdG8gcGxhY2UgdGhpcyBzb21ld2hlcmUgZWxzZVxyXG52YXIgZ2VucmVzID0ge1xyXG4gICAxMjogXCJBZHZlbnR1cmVcIixcclxuICAgMTQ6IFwiRmFudGFzeVwiLFxyXG4gICAxNjogXCJBbmltYXRpb25cIixcclxuICAgMTg6IFwiRHJhbWFcIixcclxuICAgMjc6IFwiSG9ycm9yXCIsXHJcbiAgIDI4OiBcIkFjdGlvblwiLFxyXG4gICAzNTogXCJDb21lZHlcIixcclxuICAgMzY6IFwiSGlzdG9yeVwiLFxyXG4gICAzNzogXCJXZXN0ZXJuXCIsXHJcbiAgIDUzOiBcIlRocmlsbGVyXCIsXHJcbiAgIDgwOiBcIkNyaW1lXCIsXHJcbiAgIDk5OiBcIkRvY3VtZW50YXJ5XCIsXHJcbiAgIDg3ODogXCJTY2llbmNlIEZpY3Rpb25cIixcclxuICAgOTY0ODogXCJNeXN0ZXJ5XCIsXHJcbiAgIDEwNDAyOiBcIk11c2ljXCIsXHJcbiAgIDEwNzQ5OiBcIlJvbWFuY2VcIixcclxuICAgMTA3NTE6IFwiRmFtaWx5XCIsXHJcbiAgIDEwNzUyOiBcIldhclwiLFxyXG4gICAxMDc2OTogXCJGb3JlaWduXCIsXHJcbiAgIDEwNzcwOiBcIlRWIE1vdmllXCJcclxuIH07XHJcblxyXG4vL3RoaXMgZnVuY3Rpb24gd2lsbCBzZW5kIGJhY2sgc2VhcmNiIG1vdmllcyB1c2VyIGhhcyByYXRlZCBpbiB0aGUgZGF0YWJhc2VcclxuLy9pdCB3aWxsIHNlbmQgYmFjayBtb3ZpZSBvYmpzIHRoYXQgbWF0Y2ggdGhlIHNlYXJjaCBpbnB1dCwgZXhwZWN0cyBtb3ZpZSBuYW1lIGluIHJlcS5ib2R5LnRpdGxlXHJcbmV4cG9ydHMuc2VhcmNoUmF0ZWRNb3ZpZSA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgcmV0dXJuIFJhdGluZy5xdWVyeShmdW5jdGlvbihxYil7XHJcblx0XHRxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcclxuXHRcdHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xyXG5cdFx0cWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnKTtcclxuICBcdHFiLndoZXJlUmF3KGBNQVRDSCAobW92aWVzLnRpdGxlKSBBR0FJTlNUICgnJHtyZXEucXVlcnkudGl0bGV9JyBJTiBOQVRVUkFMIExBTkdVQUdFIE1PREUpYClcclxuICBcdHFiLmFuZFdoZXJlKCd1c2Vycy51c2VybmFtZScsICc9JywgcmVxLm15U2Vzc2lvbi51c2VyKVxyXG4gIFx0cWIub3JkZXJCeSgndXBkYXRlZF9hdCcsICdERVNDJylcclxuICB9KVxyXG4gIC5mZXRjaEFsbCgpXHJcbiAgLnRoZW4oZnVuY3Rpb24obWF0Y2hlcyl7XHJcbiAgXHRjb25zb2xlLmxvZyhtYXRjaGVzLm1vZGVscyk7XHJcbiAgXHRyZXMuanNvbihtYXRjaGVzKTtcclxuICB9KVxyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy9mcmllbmRzaGlwIGhhbmRsZXJzXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZXhwb3J0cy5nZXRGcmllbmRMaXN0ID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuXHRyZXR1cm4gUmVsYXRpb24ucXVlcnkoZnVuY3Rpb24ocWIpe1xyXG5cdFx0cWIuaW5uZXJKb2luKCd1c2VycycsICdyZWxhdGlvbnMudXNlcjFpZCcsICc9JywgJ3VzZXJzLmlkJyk7XHJcblx0XHRxYi5zZWxlY3QoJ3JlbGF0aW9ucy51c2VyMmlkJyk7XHJcblx0XHRxYi53aGVyZSh7XHJcblx0XHRcdCd1c2Vycy51c2VybmFtZSc6IHJlcS5teVNlc3Npb24udXNlclxyXG5cdFx0fSlcclxuXHR9KVxyXG5cdC5mZXRjaEFsbCgpXHJcblx0LnRoZW4oZnVuY3Rpb24oZnJpZW5kcyl7XHJcblx0XHRyZXR1cm4gUHJvbWlzZS5tYXAoZnJpZW5kcy5tb2RlbHMsIGZ1bmN0aW9uKGZyaWVuZCkge1xyXG5cdFx0XHRyZXR1cm4gbmV3IFVzZXIoe2lkOiBmcmllbmQuYXR0cmlidXRlcy51c2VyMmlkfSkuZmV0Y2goKVxyXG5cdFx0XHQudGhlbihmdW5jdGlvbihmcmllbmRVc2VyKXtcclxuXHRcdFx0XHRyZXR1cm4gZnJpZW5kVXNlci5hdHRyaWJ1dGVzLnVzZXJuYW1lO1xyXG5cdFx0XHR9KVxyXG5cdFx0fSlcclxuXHR9KVxyXG5cdC50aGVuKGZ1bmN0aW9uKGZyaWVuZHMpe1xyXG5cdFx0Y29uc29sZS5sb2coJ3NlbmRpbmcgYSBsaXN0IG9mIGZyaWVuZCBuYW1lcycsIGZyaWVuZHMpO1xyXG5cdFx0cmVzLmpzb24oZnJpZW5kcyk7XHJcblx0fSlcclxufVxyXG5cclxuLy90aGlzIHdvdWxkIHNlbmQgYSBub3RpY2UgdG8gdGhlIHVzZXIgd2hvIHJlY2VpdmUgdGhlIGZyaWVuZCByZXF1ZXN0LCBwcm9tcHRpbmcgdGhlbSB0byBhY2NlcHQgb3IgZGVueSB0aGUgcmVxdWVzdFxyXG5leHBvcnRzLmFkZEZyaWVuZCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcblxyXG59O1xyXG5cclxuXHJcbi8vdGhpcyB3b3VsZCBjb25maXJtIHRoZSBmcmllbmRzaGlwIGFuZCBlc3RhYmxpc2ggdGhlIHJlbGF0aW9uc2hpcCBpbiB0aGUgZGF0YWJhc2VcclxuZXhwb3J0cy5jb25maXJtRnJpZW5kc2hpcCA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcblxyXG59O1xyXG5cclxuXHJcblxyXG5leHBvcnRzLmdldEZyaWVuZHMgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIHZhciBwZW9wbGVJZCA9IFtdO1xyXG4gIHZhciBpZCA9IHJlcS5teVNlc3Npb24udXNlclxyXG4gIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgaWQsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xyXG4gICAgdmFyIHVzZXJpZCA9IHJlc3BbMF0uaWQ7XHJcbiAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgYmUgbGluZy8yJyxpZClcclxuICBcclxuICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByYXRpbmdzIFdIRVJFIHVzZXJpZCA9ID8nLCB1c2VyaWQsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xyXG4gICAgICB2YXIgdXNlcnNSYXRpbmdzPXJlc3AubWFwKGZ1bmN0aW9uKGEpeyByZXR1cm4gW2EubW92aWVpZCwgYS5zY29yZV19KTtcclxuXHJcbiAgICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByZWxhdGlvbnMgV0hFUkUgdXNlcjFpZCA9ID8nLCB1c2VyaWQsIGZ1bmN0aW9uKGVyciwgcmVzcCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgaWYgKHBlb3BsZUlkLmluZGV4T2YocmVzcFtpXS51c2VyMmlkKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgcGVvcGxlSWQucHVzaChyZXNwW2ldLnVzZXIyaWQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcGVvcGxlID0gW11cclxuICAgICAgICBjb25zb2xlLmxvZygnVGhpcyBzaG91bGQgYWxzbyBiZSBwZW9wbGVlZScscGVvcGxlSWQpO1xyXG4gICAgICAgIHZhciBrZXlJZD17fTtcclxuICAgICAgICBwZW9wbGVJZC5mb3JFYWNoKGZ1bmN0aW9uKGEpIHtcclxuXHJcbiAgICAgICAgICBjb24ucXVlcnkoJ1NFTEVDVCB1c2VybmFtZSBGUk9NIHVzZXJzIFdIRVJFIGlkID0gPycsIGEsIGZ1bmN0aW9uKGVyciwgcmVzcG8pIHtcclxuICBcdCAgICAgICAga2V5SWRbYV09cmVzcG9bMF0udXNlcm5hbWU7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0aGlzIGlzIE9ORSBvZiB0aGUgcGVvcGxlISEnLHJlc3BvWzBdLnVzZXJuYW1lKVxyXG4gICAgICAgICAgICBjb24ucXVlcnkoJ1NFTEVDVCAqIEZST00gcmF0aW5ncyBXSEVSRSB1c2VyaWQgPScrJ1wiJythKydcIicsIGZ1bmN0aW9uKGVyciwgcmUpIHtcclxuICAgICAgXHQgICAgICBjb25zb2xlLmxvZygndGhpcyBpcyBhJyxhKVxyXG4gICAgICBcdCAgICAgIGlmIChyZS5sZW5ndGg9PT0wKXtcclxuICAgICAgXHRcdCAgICAgIHJlPVt7dXNlcmlkOmEsbW92aWVpZDpNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkqMTAwMDApLHNjb3JlOjk5fV1cclxuICAgICAgXHQgICAgICB9XHJcbiAgICAgIFx0ICAgICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGJlIHRoZSByYXRpbmdzIGZyb20gZWFjaCBwZXJzb24hIScscmUpO1xyXG5cclxuICAgICAgICAgICAgICBwZW9wbGUucHVzaChyZS5tYXAoZnVuY3Rpb24oYSl7cmV0dXJuIFthLnVzZXJpZCxhLm1vdmllaWQsYS5zY29yZV07fSkpO1xyXG4gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIGlmIChwZW9wbGUubGVuZ3RoPT09cGVvcGxlSWQubGVuZ3RoKXtcclxuICAgICAgICAgICAgICAgIHZhciBmaW5hbCA9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBiZSBwZW9wbGUnLCBwZW9wbGUpO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwZW9wbGUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKHBlb3BsZVtpXVswXSE9PXVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgZmluYWxba2V5SWRbcGVvcGxlW2ldWzBdWzBdXV0gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHBlb3BsZVtpXS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgZmluYWxba2V5SWRbcGVvcGxlW2ldWzBdWzBdXV0ucHVzaChbXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB6ID0gMTsgeiA8IHBlb3BsZVtpXVt4XS5sZW5ndGg7IHorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaW5hbFtrZXlJZFtwZW9wbGVbaV1bMF1bMF1dXVt4XS5wdXNoKHBlb3BsZVtpXVt4XVt6XSlcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZmluYWwnLGZpbmFsLHVzZXJzUmF0aW5ncyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGNvbXBhcmlzb25zPXt9O1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGZpbmFsKXtcclxuICAgICAgICAgICAgICAgICAgY29tcGFyaXNvbnNba2V5XT1jb21wKHVzZXJzUmF0aW5ncyxmaW5hbFtrZXldKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coY29tcGFyaXNvbnMpO1xyXG4gICAgICAgICAgICAgICAgdmVyeUZpbmFsPVtdO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGNvbXBhcmlzb25zKXtcclxuICAgICAgICAgICAgICAgICAgdmVyeUZpbmFsLnB1c2goW2tleSxjb21wYXJpc29uc1trZXldXSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHZlcnlGaW5hbCk7XHJcbiAgICAgICAgICAgICAgICByZXMuc2VuZCh2ZXJ5RmluYWwpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG4gIH0pXHJcbn07XHJcblxyXG5cclxuXHJcbi8vVEJEXHJcbmV4cG9ydHMuZ2V0SGlnaENvbXBhdGliaWxpdHlVc2VycyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgXHJcbn07XHJcblxyXG5cclxuLy9UQkRcclxuZXhwb3J0cy5nZXRSZWNvbW1lbmRlZE1vdmllcyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcblxyXG59OyJdfQ==
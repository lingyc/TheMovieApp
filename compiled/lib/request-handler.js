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
  } else {
    con.query('UPDATE allrequests SET response=' + '"' + 'yes' + '"' + '  WHERE requestor = ' + '"' + requestor + '"' + ' AND movie=' + '"' + movie + '"', function (err, res) {
      if (err) throw err;
      console.log('Last insert ID:', res.insertId);
    });
  }

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
};
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

    id = resp[0].id;
    console.log(id);

    con.query('SELECT * FROM ratings WHERE userid = ?', id, function (err, resp) {
      console.log('errrrrrrrr', err, resp.length);
      len = resp.length;
      resp.forEach(function (a) {
        con.query('SELECT title FROM movies WHERE id = ?', a.movieid, function (err, resp) {
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

    var currentUser = req.mySession.user;
    console.log('current user', currentUser);

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
  var addOn = !movie ? ' AND requestTyp=' + '"' + requestType + '"' : ' AND requestee=' + '"' + requestee + '"' + ' AND movie =' + '"' + movie + '"';

  con.query('UPDATE allrequests SET response=' + '"' + 'no' + '"' + ' WHERE requestor = ' + '"' + requestor + '"' + addOn, function (err, res) {
    if (err) throw err;
    console.log('Last insert ID:', res.insertId);
    response.send(requestor + 'deleted');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9yZXF1ZXN0LWhhbmRsZXIuanMiXSwibmFtZXMiOlsiaGVscGVyIiwibnVtMSIsIm51bTIiLCJkaWZmIiwiTWF0aCIsImFicyIsImNvbXAiLCJmaXJzdCIsInNlY29uZCIsImZpbmFsIiwiaSIsImxlbmd0aCIsIngiLCJwdXNoIiwic3VtIiwicmVkdWNlIiwiYSIsImIiLCJyb3VuZCIsImRiIiwicmVxdWlyZSIsIm15c3FsIiwiZXhwcmVzcyIsIk1vdmllIiwiUmF0aW5nIiwiUmVsYXRpb24iLCJVc2VyIiwiYWxsUmVxdWVzdCIsIk1vdmllcyIsIlJhdGluZ3MiLCJSZWxhdGlvbnMiLCJVc2VycyIsImFsbFJlcXVlc3RzIiwiUHJvbWlzZSIsInJlcXVlc3QiLCJjb24iLCJjcmVhdGVDb25uZWN0aW9uIiwiaG9zdCIsInVzZXIiLCJwYXNzd29yZCIsImRhdGFiYXNlIiwiY29ubmVjdCIsImVyciIsImNvbnNvbGUiLCJsb2ciLCJleHBvcnRzIiwic2lnbnVwVXNlciIsInJlcSIsInJlcyIsImJvZHkiLCJ1c2VybmFtZSIsIm5hbWUiLCJmZXRjaCIsInRoZW4iLCJmb3VuZCIsInN0YXR1cyIsInNlbmQiLCJteVNlc3Npb24iLCJjcmVhdGUiLCJzZW5kV2F0Y2hSZXF1ZXN0IiwicmVzcG9uc2UiLCJyZXF1ZXN0ZWUiLCJBcnJheSIsImlzQXJyYXkiLCJyZXF1ZXN0ZWVzIiwiZWFjaCIsIm1lc3NhZ2UiLCJyZXF1ZXN0b3IiLCJyZXF1ZXN0VHlwIiwibW92aWUiLCJxdWVyeSIsImluc2VydElkIiwicmVtb3ZlV2F0Y2hSZXF1ZXN0IiwiZm9yZ2UiLCJkZXN0cm95IiwianNvbiIsImVycm9yIiwiZGF0YSIsImNhdGNoIiwic2VuZFJlcXVlc3QiLCJwcGxSZXFkIiwiZmlsdGVyIiwibWFwIiwicmVzcCIsImxpc3RSZXF1ZXN0cyIsImFjY2VwdCIsInBlcnNvblRvQWNjZXB0IiwicmVxdWVzdFR5cGUiLCJpZCIsInBlcnNvbjEiLCJwZXJzb24yIiwidXNlcjFpZCIsInVzZXIyaWQiLCJyZXF1ZXN0MiIsInJlbW92ZVJlcXVlc3QiLCJnZXRUaGlzRnJpZW5kc01vdmllcyIsIm1vdmllcyIsInNwZWNpZmljRnJpZW5kIiwicGVyc29uIiwibGVuIiwiZm9yRWFjaCIsIm1vdmllaWQiLCJ0aXRsZSIsInNjb3JlIiwicmV2aWV3IiwiZmluZE1vdmllQnVkZGllcyIsInBlb3BsZSIsIklkcyIsImlkS2V5T2JqIiwiY3VycmVudFVzZXIiLCJvYmoxIiwicmVzcG9uIiwidXNlcmlkIiwiY3VycmVudFVzZXJJbmZvIiwiY29tcGFyaXNvbnMiLCJrZXkiLCJmaW5hbFNlbmQiLCJkZWNsaW5lIiwicGVyc29uVG9EZWNsaW5lIiwiYWRkT24iLCJzaWduaW5Vc2VyIiwiYXR0cmlidXRlcyIsImxvZ291dCIsInJhdGVNb3ZpZSIsImZvdW5kVXNlciIsImZvdW5kUmF0aW5nIiwicmF0aW5nIiwicmF0aW5nT2JqIiwic2F2ZSIsIm5ld1JhdGluZyIsImFkZE9uZU1vdmllIiwiZ2VucmUiLCJtb3ZpZU9iaiIsImdlbnJlX2lkcyIsImdlbnJlcyIsInBvc3RlciIsInBvc3Rlcl9wYXRoIiwicmVsZWFzZV9kYXRlIiwiZGVzY3JpcHRpb24iLCJvdmVydmlldyIsInNsaWNlIiwiaW1kYlJhdGluZyIsInZvdGVfYXZlcmFnZSIsIm1ldGhvZCIsIm5ld01vdmllIiwiZ2V0VXNlclJhdGluZ3MiLCJxYiIsImlubmVySm9pbiIsInNlbGVjdCIsIndoZXJlIiwib3JkZXJCeSIsImZldGNoQWxsIiwicmF0aW5ncyIsIm1vZGVscyIsImF0dGFjaEZyaWVuZEF2Z1JhdGluZyIsImdldEZyaWVuZFVzZXJSYXRpbmdzIiwiZnJpZW5kTmFtZSIsImF0dGFjaFVzZXJSYXRpbmciLCJnZXRGcmllbmRSYXRpbmdzIiwiZnJpZW5kc1JhdGluZ3MiLCJmcmllbmRBdmVyYWdlUmF0aW5nIiwiYXZlcmFnZVJhdGluZyIsInVzZXJSYXRpbmciLCJoYW5kbGVHZXRGcmllbmRSYXRpbmdzIiwiZnJpZW5kUmF0aW5ncyIsImZyaWVuZFJhdGluZyIsImZyaWVuZCIsImZyaWVuZFVzZXJOYW1lIiwiZnJpZW5kRmlyc3ROYW1lIiwiZmlyc3ROYW1lIiwidG90YWwiLCJnZXRPbmVNb3ZpZVJhdGluZyIsImdldE11bHRpcGxlTW92aWVSYXRpbmdzIiwiZm91bmRNb3ZpZSIsImdldFJlY2VudFJlbGVhc2UiLCJwYXJhbXMiLCJhcGlfa2V5IiwicHJpbWFyeV9yZWxlYXNlX3llYXIiLCJEYXRlIiwiZ2V0RnVsbFllYXIiLCJpbmNsdWRlX2FkdWx0Iiwic29ydF9ieSIsInVybCIsInFzIiwib24iLCJjaHVuayIsInJlY2VudE1vdmllcyIsIkpTT04iLCJwYXJzZSIsInJlc3VsdHMiLCJzZWFyY2hSYXRlZE1vdmllIiwid2hlcmVSYXciLCJhbmRXaGVyZSIsIm1hdGNoZXMiLCJnZXRGcmllbmRMaXN0IiwiZnJpZW5kcyIsImZyaWVuZFVzZXIiLCJnZXRGcmllbmRzIiwicGVvcGxlSWQiLCJ1c2Vyc1JhdGluZ3MiLCJpbmRleE9mIiwia2V5SWQiLCJyZXNwbyIsInJlIiwicmFuZG9tIiwidW5kZWZpbmVkIiwieiIsInZlcnlGaW5hbCJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQSxJQUFNQSxTQUFRLFNBQVJBLE1BQVEsQ0FBQ0MsSUFBRCxFQUFNQyxJQUFOLEVBQWE7QUFDM0IsTUFBTUMsT0FBS0MsS0FBS0MsR0FBTCxDQUFTSixPQUFLQyxJQUFkLENBQVg7QUFDQSxTQUFPLElBQUVDLElBQVQ7QUFDQyxDQUhEOztBQUtBLElBQU1HLE9BQU8sU0FBUEEsSUFBTyxDQUFDQyxLQUFELEVBQVFDLE1BQVIsRUFBa0I7QUFDL0IsTUFBTUMsUUFBTyxFQUFiO0FBQ0UsT0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUdILE1BQU1JLE1BQXpCLEVBQWlDRCxHQUFqQyxFQUFzQzs7QUFFcEMsU0FBSyxJQUFJRSxJQUFJLENBQWIsRUFBZ0JBLElBQUlKLE9BQU9HLE1BQTNCLEVBQW1DQyxHQUFuQyxFQUF3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RyxPQUFPaEcsQ0FBUCxFQUFVRSxDQUFWLEVBQWFELE1BQWpDLEVBQXlDbU0sR0FBekMsRUFBOEM7QUFDNUNyTSw4QkFBTWdNLE1BQU0vRixPQUFPaEcsQ0FBUCxFQUFVLENBQVYsRUFBYSxDQUFiLENBQU4sQ0FBTixFQUE4QkUsQ0FBOUIsRUFBaUNDLElBQWpDLENBQXNDNkYsT0FBT2hHLENBQVAsRUFBVUUsQ0FBVixFQUFha00sQ0FBYixDQUF0QztBQUNEO0FBQ0Y7QUFDRjtBQUNGOztBQUVEbkssd0JBQVFDLEdBQVIsQ0FBWSxPQUFaLEVBQW9CbkMsS0FBcEIsRUFBMEI4TCxZQUExQjs7QUFFQSxvQkFBSXJGLGNBQVksRUFBaEI7QUFDQSxxQkFBSyxJQUFJQyxHQUFULElBQWdCMUcsS0FBaEIsRUFBc0I7QUFDcEJ5Ryw4QkFBWUMsR0FBWixJQUFpQjdHLEtBQUtpTSxZQUFMLEVBQWtCOUwsTUFBTTBHLEdBQU4sQ0FBbEIsQ0FBakI7QUFDRDtBQUNEeEUsd0JBQVFDLEdBQVIsQ0FBWXNFLFdBQVo7QUFDQTZGLDRCQUFVLEVBQVY7QUFDQSxxQkFBSyxJQUFJNUYsR0FBVCxJQUFnQkQsV0FBaEIsRUFBNEI7QUFDMUI2Riw0QkFBVWxNLElBQVYsQ0FBZSxDQUFDc0csR0FBRCxFQUFLRCxZQUFZQyxHQUFaLENBQUwsQ0FBZjtBQUNEO0FBQ0R4RSx3QkFBUUMsR0FBUixDQUFZbUssU0FBWjtBQUNBL0osb0JBQUlRLElBQUosQ0FBU3VKLFNBQVQ7QUFDRDtBQUNGLGFBdkNEO0FBd0NELFdBM0NEO0FBNENELFNBOUNEO0FBK0NELE9BeEREO0FBeURELEtBNUREO0FBNkRELEdBakVEO0FBa0VELENBckVEIiwiZmlsZSI6InJlcXVlc3QtaGFuZGxlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vLy8vLy8vLy8vLy9UaGUgYWxnb3JpdGhtXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5jb25zdCBoZWxwZXI9IChudW0xLG51bTIpPT57XHJcbmNvbnN0IGRpZmY9TWF0aC5hYnMobnVtMS1udW0yKTtcclxucmV0dXJuIDUtZGlmZjtcclxufVxyXG5cclxuY29uc3QgY29tcCA9IChmaXJzdCwgc2Vjb25kKT0+IHtcclxuY29uc3QgZmluYWw9IFtdXHJcbiAgZm9yIChsZXQgaSA9IDA7IGk8IGZpcnN0Lmxlbmd0aDsgaSsrKSB7XHJcblxyXG4gICAgZm9yIChsZXQgeCA9IDA7IHggPCBzZWNvbmQubGVuZ3RoOyB4KyspIHtcclxuXHJcbiAgICAgIGlmIChmaXJzdFtpXVswXSA9PT0gc2Vjb25kW3hdWzBdKSB7XHJcblxyXG4gICAgZmluYWwucHVzaChoZWxwZXIoZmlyc3RbaV1bMV0sc2Vjb25kW3hdWzFdKSlcclxuXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG5jb25zdCBzdW09IGZpbmFsLnJlZHVjZShmdW5jdGlvbihhLGIpe3JldHVybiBhK2J9LDApO1xyXG5yZXR1cm4gTWF0aC5yb3VuZCgyMCpzdW0vZmluYWwubGVuZ3RoKVxyXG59XHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcblxyXG5cclxuXHJcbnZhciBkYiA9IHJlcXVpcmUoJy4uL2FwcC9kYkNvbm5lY3Rpb24nKTtcclxudmFyIG15c3FsID0gcmVxdWlyZSgnbXlzcWwnKTtcclxudmFyIGV4cHJlc3MgPSByZXF1aXJlKCdleHByZXNzJyk7XHJcbnZhciBNb3ZpZSA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvbW92aWUnKTtcclxudmFyIFJhdGluZyA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvcmF0aW5nJyk7XHJcbnZhciBSZWxhdGlvbiA9IHJlcXVpcmUoJy4uL2FwcC9tb2RlbHMvcmVsYXRpb24nKTtcclxudmFyIFVzZXIgPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL3VzZXInKTtcclxudmFyIGFsbFJlcXVlc3QgPSByZXF1aXJlKCcuLi9hcHAvbW9kZWxzL2FsbFJlcXVlc3QnKTtcclxuXHJcbnZhciBNb3ZpZXMgPSByZXF1aXJlKCcuLi9hcHAvY29sbGVjdGlvbnMvbW92aWVzJyk7XHJcbnZhciBSYXRpbmdzID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL3JhdGluZ3MnKTtcclxudmFyIFJlbGF0aW9ucyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy9yZWxhdGlvbnMnKTtcclxudmFyIFVzZXJzID0gcmVxdWlyZSgnLi4vYXBwL2NvbGxlY3Rpb25zL3VzZXJzJyk7XHJcbnZhciBhbGxSZXF1ZXN0cyA9IHJlcXVpcmUoJy4uL2FwcC9jb2xsZWN0aW9ucy9hbGxSZXF1ZXN0cycpO1xyXG5cclxudmFyIFByb21pc2UgPSByZXF1aXJlKFwiYmx1ZWJpcmRcIik7XHJcbnZhciByZXF1ZXN0ID0gcmVxdWlyZSgncmVxdWVzdCcpO1xyXG5cclxuXHJcbnZhciBjb24gPSBteXNxbC5jcmVhdGVDb25uZWN0aW9uKHtcclxuICAgIGhvc3QgICAgIDogJzEyNy4wLjAuMScsXHJcbiAgICB1c2VyICAgICA6ICdyb290JyxcclxuICAgIHBhc3N3b3JkIDogJzEyMzQ1JyxcclxuICAgIGRhdGFiYXNlIDogJ01haW5EYXRhYmFzZScsXHJcbn0pO1xyXG5cclxuY29uLmNvbm5lY3QoZnVuY3Rpb24oZXJyKXtcclxuICBpZihlcnIpe1xyXG4gICAgY29uc29sZS5sb2coJ0Vycm9yIGNvbm5lY3RpbmcgdG8gRGInKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgY29uc29sZS5sb2coJ0Nvbm5lY3Rpb24gZXN0YWJsaXNoZWQnKTtcclxufSk7XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vdXNlciBhdXRoXHJcbi8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG5leHBvcnRzLnNpZ251cFVzZXIgPSAocmVxLCByZXMpPT4ge1xyXG5cdGNvbnNvbGUubG9nKCdjYWxsaW5nIGxvZ2luJywgcmVxLmJvZHkpO1xyXG5cdC8vIGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBzZXNzaW9uJyxyZXEuc2Vzc2lvbilcclxuICBuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEuYm9keS5uYW1lIH0pLmZldGNoKCkudGhlbihmb3VuZCA9PntcclxuXHQgIGlmIChmb3VuZCkge1xyXG5cdCAgXHQvL2NoZWNrIHBhc3N3b3JkXHJcblx0ICBcdCAgIC8vaWYgKHBhc3N3b3JkIG1hdGNoZXMpXHJcblx0ICBcdCAgIC8veyBhZGQgc2Vzc2lvbnMgYW5kIHJlZGlyZWN0fVxyXG5cdCAgXHRjb25zb2xlLmxvZygndXNlcm5hbWUgYWxyZWFkeSBleGlzdCwgY2Fubm90IHNpZ251cCAnLCByZXEuYm9keS5uYW1lKTtcclxuXHQgICAgcmVzLnN0YXR1cyg0MDMpLnNlbmQoJ3VzZXJuYW1lIGV4aXN0Jyk7XHJcblx0ICB9IGVsc2Uge1xyXG5cdCAgXHRjb25zb2xlLmxvZygnY3JlYXRpbmcgdXNlcicpO1xyXG4gICAgICByZXEubXlTZXNzaW9uLnVzZXIgPSByZXEuYm9keS5uYW1lO1xyXG5cdCAgICBVc2Vycy5jcmVhdGUoe1xyXG5cdCAgICAgIHVzZXJuYW1lOiByZXEuYm9keS5uYW1lLFxyXG5cdCAgICAgIHBhc3N3b3JkOiByZXEuYm9keS5wYXNzd29yZCxcclxuXHQgICAgfSlcclxuXHQgICAgLnRoZW4oZnVuY3Rpb24odXNlcikge1xyXG5cdFx0ICBcdGNvbnNvbGUubG9nKCdjcmVhdGVkIGEgbmV3IHVzZXInKTtcclxuXHQgICAgICByZXMuc3RhdHVzKDIwMSkuc2VuZCgnbG9naW4gY3JlYXRlZCcpO1xyXG5cdCAgICB9KTtcclxuXHQgIH1cclxuXHR9KTtcclxufTtcclxuXHJcblxyXG5leHBvcnRzLnNlbmRXYXRjaFJlcXVlc3QgPSAocmVxLCByZXNwb25zZSk9PiB7XHJcblx0Y29uc29sZS5sb2cocmVxLmJvZHkucmVxdWVzdGVlKVxyXG5cdGlmIChBcnJheS5pc0FycmF5KHJlcS5ib2R5LnJlcXVlc3RlZSkpIHtcclxuXHRcdHZhciByZXF1ZXN0ZWVzID0gcmVxLmJvZHkucmVxdWVzdGVlO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR2YXIgcmVxdWVzdGVlcyA9IFtyZXEuYm9keS5yZXF1ZXN0ZWVdO1xyXG5cdH1cclxuXHRQcm9taXNlLmVhY2gocmVxdWVzdGVlcywgcmVxdWVzdGVlID0+e1xyXG5cdFx0Y29uc3QgcmVxdWVzdCA9IHtcclxuICAgICAgbWVzc2FnZTogcmVxLmJvZHkubWVzc2FnZSxcclxuXHRcdFx0cmVxdWVzdG9yOiByZXEubXlTZXNzaW9uLnVzZXIsIFxyXG5cdFx0XHRyZXF1ZXN0VHlwOid3YXRjaCcsXHJcblx0XHRcdG1vdmllOnJlcS5ib2R5Lm1vdmllLFxyXG5cdFx0XHRyZXF1ZXN0ZWU6IHJlcXVlc3RlZVxyXG5cdFx0fTtcclxuXHRcdGNvbi5xdWVyeSgnSU5TRVJUIElOVE8gYWxscmVxdWVzdHMgU0VUID8nLCByZXF1ZXN0LCAoZXJyLHJlcyk9PntcclxuXHRcdCAgaWYoZXJyKSB0aHJvdyBlcnI7XHJcblx0XHQgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xyXG5cdFx0fSk7XHJcblx0fSlcclxuXHQudGhlbihkb25lPT57XHJcblx0XHRyZXNwb25zZS5zZW5kKCdTdWNjZXNzJyk7XHJcblx0fSlcclxufVxyXG5cclxuZXhwb3J0cy5yZW1vdmVXYXRjaFJlcXVlc3QgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIGlmIChBcnJheS5pc0FycmF5KHJlcS5ib2R5LnJlcXVlc3RlZSkpIHtcclxuICAgIHZhciByZXF1ZXN0ZWVzID0gcmVxLmJvZHkucmVxdWVzdGVlO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB2YXIgcmVxdWVzdGVlcyA9IFtyZXEuYm9keS5yZXF1ZXN0ZWVdO1xyXG4gIH1cclxuICB2YXIgcmVxdWVzdG9yPXJlcS5ib2R5LnJlcXVlc3RvcjtcclxuICB2YXIgbW92aWUgPSByZXEuYm9keS5tb3ZpZTtcclxuXHJcbiAgYWxsUmVxdWVzdC5mb3JnZSh7cmVxdWVzdG9yOiByZXF1ZXN0b3IsIHJlcXVlc3RlZTogcmVxdWVzdGVlcywgbW92aWU6IG1vdmllIH0pXHJcbiAgICAuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGFsbFJlcXVlc3QpIHtcclxuICAgICAgYWxsUmVxdWVzdC5kZXN0cm95KClcclxuICAgICAgICAudGhlbihmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHJlcy5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6ICdVc2VyIHN1Y2Nlc3NmdWxseSBkZWxldGVkJ319KTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcclxuICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IGVyci5tZXNzYWdlfX0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSlcclxuICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcclxuICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XHJcbiAgICB9KTtcclxufTtcclxuXHJcblxyXG5leHBvcnRzLnNlbmRSZXF1ZXN0ID0gKHJlcSwgcmVzcG9uc2UpPT4ge1xyXG4gIGNvbnNvbGUubG9nKCd0aGlzIGlzIHdoYXQgSW0gZ2V0dGluZycsIHJlcS5ib2R5KTtcclxuICBpZiAocmVxLm15U2Vzc2lvbi51c2VyID09PSByZXEuYm9keS5uYW1lKSB7XHJcbiAgICByZXNwb25zZS5zZW5kKFwiWW91IGNhbid0IGZyaWVuZCB5b3Vyc2VsZiFcIilcclxuICB9IGVsc2Uge1xyXG5cclxuICAgIHZhciByZXF1ZXN0ID0ge1xyXG4gICAgICByZXF1ZXN0b3I6IHJlcS5teVNlc3Npb24udXNlcixcclxuICAgICAgcmVxdWVzdGVlOiByZXEuYm9keS5uYW1lLFxyXG4gICAgICByZXF1ZXN0VHlwOiAnZnJpZW5kJ1xyXG4gICAgfTtcclxuXHJcbiAgICBjb24ucXVlcnkoJ1NFTEVDVCByZXF1ZXN0ZWUscmVzcG9uc2UgRlJPTSBhbGxyZXF1ZXN0cyBXSEVSRSAgcmVxdWVzdG9yID0gPyBBTkQgcmVxdWVzdFR5cCA9JyArICdcIicgKyAnZnJpZW5kJyArICdcIicsIHJlcXVlc3RbJ3JlcXVlc3RvciddLCBmdW5jdGlvbihlcnIsIHJlcykge1xyXG4gICAgICBpZiAoIXJlcykge1xyXG4gICAgICAgIHJlc3BvbnNlLnNlbmQoJ25vIGZyaWVuZHMnKVxyXG4gICAgICB9XHJcbiAgICAgIHZhciBwcGxSZXFkID0gcmVzLmZpbHRlcihhPT4gKFxyXG4gICAgICAgICBhLnJlc3BvbnNlID09PSBudWxsXHJcbiAgICAgICkpXHJcbiAgICAgIHZhciByZXF1ZXN0ZWVzID0gcHBsUmVxZC5tYXAoYT0+IChcclxuICAgICAgICAgYS5yZXF1ZXN0ZWVcclxuICAgICAgKSlcclxuICAgICAgY29uc29sZS5sb2coJ25hbWVzIG9mIHBlb3BsZSB3aG9tIEl2ZSByZXF1ZXN0ZWQgYXMgZnJpZW5kcycsIHBwbFJlcWQpO1xyXG5cclxuXHJcblxyXG4gICAgICBjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIGFsbHJlcXVlc3RzIFNFVCA/JywgcmVxdWVzdCwgKGVyciwgcmVzcCk9PiB7XHJcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXNwLmluc2VydElkKTtcclxuICAgICAgICByZXNwb25zZS5zZW5kKHJlcXVlc3RlZXMpO1xyXG4gICAgICB9KVxyXG4gICAgfSk7XHJcblxyXG4gIH1cclxufTtcclxuXHJcblxyXG5leHBvcnRzLmxpc3RSZXF1ZXN0cyA9IChyZXEsIHJlc3BvbnNlKSA9PiB7XHJcbiAgdmFyIHJlcXVlc3QgPSByZXEubXlTZXNzaW9uLnVzZXI7XHJcbiAgY29uLnF1ZXJ5KCdTZWxlY3QgKiBGUk9NIGFsbHJlcXVlc3RzIFdIRVJFIHJlcXVlc3RlZT0nICsgJ1wiJyArIHJlcXVlc3QgKyAnXCInICsgJycgKyAnT1IgcmVxdWVzdG9yID0nICsgJ1wiJyArIHJlcXVlc3QgKyAnXCInICsgJycsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XHJcbiAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICBjb25zb2xlLmxvZyhyZXMpXHJcbiAgICByZXNwb25zZS5zZW5kKFtyZXMsIHJlcXVlc3RdKTtcclxuICB9KTtcclxufTtcclxuXHJcblxyXG5leHBvcnRzLmFjY2VwdCA9IGZ1bmN0aW9uKHJlcSwgcmVzcG9uc2UpIHtcclxuICB2YXIgcmVxdWVzdG9yPXJlcS5ib2R5LnBlcnNvblRvQWNjZXB0O1xyXG4gIHZhciByZXF1ZXN0ZWU9cmVxLm15U2Vzc2lvbi51c2VyO1xyXG4gIHZhciBtb3ZpZSA9IHJlcS5ib2R5Lm1vdmllO1xyXG4gIHZhciByZXF1ZXN0VHlwZSA9IFwiZnJpZW5kXCI7XHJcblxyXG4gIGlmIChtb3ZpZSA9PT0gJycpIHtcclxuICAgIGNvbi5xdWVyeSgnVVBEQVRFIGFsbHJlcXVlc3RzIFNFVCByZXNwb25zZT0nKydcIicgKyAneWVzJyArICdcIicrJyAgV0hFUkUgcmVxdWVzdG9yID0gJysnXCInKyByZXF1ZXN0b3IrJ1wiJysnIEFORCByZXF1ZXN0VHlwPScrJ1wiJytyZXF1ZXN0VHlwZSsnXCInLCAoZXJyLCByZXMpPT4ge1xyXG4gICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XHJcbiAgICB9KVxyXG4gIH0gZWxzZSB7XHJcbiAgICBjb24ucXVlcnkoJ1VQREFURSBhbGxyZXF1ZXN0cyBTRVQgcmVzcG9uc2U9JysnXCInICsgJ3llcycgKyAnXCInKycgIFdIRVJFIHJlcXVlc3RvciA9ICcrJ1wiJysgcmVxdWVzdG9yKydcIicrJyBBTkQgbW92aWU9JysnXCInKyBtb3ZpZSsnXCInLCAoZXJyLCByZXMpPT4ge1xyXG4gICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICBjb25zb2xlLmxvZygnTGFzdCBpbnNlcnQgSUQ6JywgcmVzLmluc2VydElkKTtcclxuICB9KTtcclxuICB9XHJcblxyXG4gIGNvbi5xdWVyeSgnU0VMRUNUIGlkIEZST00gdXNlcnMgV0hFUkUgdXNlcm5hbWUgPSA/JywgcmVxdWVzdG9yLCAoZXJyLCByZXMpPT4ge1xyXG4gICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlc1swXS5pZCwgZXJyKTtcclxuICAgIHZhciBwZXJzb24xID0gcmVzWzBdLmlkO1xyXG4gICAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCByZXF1ZXN0ZWUsIChlcnIsIHJlc3ApPT4ge1xyXG4gICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXNwWzBdLmlkLCBlcnIpO1xyXG5cclxuICAgICAgdmFyIHBlcnNvbjIgPSByZXNwWzBdLmlkO1xyXG4gICAgICB2YXIgcmVxdWVzdCA9IHtcclxuICAgICAgICB1c2VyMWlkOiBwZXJzb24xLFxyXG4gICAgICAgIHVzZXIyaWQ6IHBlcnNvbjJcclxuICAgICAgfVxyXG4gICAgICB2YXIgcmVxdWVzdDIgPSB7XHJcbiAgICAgICAgdXNlcjFpZDogcGVyc29uMixcclxuICAgICAgICB1c2VyMmlkOiBwZXJzb24xXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnNvbGUubG9nKCd0aGUgcmVxdWVzdHM6OjonLHJlcXVlc3QscmVxdWVzdDIpXHJcbiAgICAgIGNvbi5xdWVyeSgnSU5TRVJUIElOVE8gcmVsYXRpb25zIFNFVCA/JywgcmVxdWVzdCwgKGVyciwgcmVzKT0+IHtcclxuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0xhc3QgaW5zZXJ0IElEOicsIHJlcy5pbnNlcnRJZCk7XHJcblxyXG4gICAgICBjb24ucXVlcnkoJ0lOU0VSVCBJTlRPIHJlbGF0aW9ucyBTRVQgPycsIHJlcXVlc3QyLCAoZXJyLCByZXMpPT4ge1xyXG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xyXG4gICAgICAgICAgIHJlc3BvbnNlLnNlbmQoJ1N1Y2Nlc3MnKTtcclxuICAgICAgICB9KVxyXG4gICAgICB9KTtcclxuICAgIH0pXHJcbiAgfSlcclxufVxyXG4gIC8vIGFsbFJlcXVlc3QuZm9yZ2Uoe3JlcXVlc3RvcjogcmVxdWVzdG9yLCByZXF1ZXN0ZWU6IHJlcXVlc3RlZX0pXHJcbiAgLy8gICAuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGFsbFJlcXVlc3QpIHtcclxuICAvLyAgICAgYWxsUmVxdWVzdC5kZXN0cm95KClcclxuICAvLyAgICAgICAudGhlbihmdW5jdGlvbigpIHtcclxuICAvLyAgICAgICAgIHJlc3BvbnNlLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogJ1VzZXIgc3VjY2Vzc2Z1bGx5IGRlbGV0ZWQnfX0pO1xyXG4gIC8vICAgICAgIH0pXHJcbiAgLy8gICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xyXG4gIC8vICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcclxuICAvLyAgICAgICB9KTtcclxuICAvLyAgIH0pXHJcbiAgLy8gICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XHJcbiAgLy8gICAgIHJlc3BvbnNlLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XHJcbiAgLy8gICB9KTtcclxuXHJcblxyXG5leHBvcnRzLnJlbW92ZVJlcXVlc3QgPSAocmVxLCByZXMpID0+e1xyXG4gIHZhciByZXF1ZXN0b3I9cmVxLmJvZHkucmVxdWVzdG9yO1xyXG4gIHZhciByZXF1ZXN0ZWU9cmVxLmJvZHkucmVxdWVzdGVlO1xyXG5cclxuICBhbGxSZXF1ZXN0LmZvcmdlKHtyZXF1ZXN0b3I6IHJlcXVlc3RvciwgcmVxdWVzdGVlOiByZXF1ZXN0ZWV9KVxyXG4gICAgLmZldGNoKCkudGhlbihmdW5jdGlvbihhbGxSZXF1ZXN0KSB7XHJcbiAgICAgIGFsbFJlcXVlc3QuZGVzdHJveSgpXHJcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICByZXMuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiAnVXNlciBzdWNjZXNzZnVsbHkgZGVsZXRlZCd9fSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiByZXEuYm9keX19KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pXHJcbiAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHtlcnJvcjogdHJ1ZSwgZGF0YToge21lc3NhZ2U6IHJlcS5ib2R5fX0pO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydHMuZ2V0VGhpc0ZyaWVuZHNNb3ZpZXMgPSAocmVxLCByZXNwb25zZSkgPT4ge1xyXG5cclxuICB2YXIgbW92aWVzID0gW107XHJcbiAgY29uc29sZS5sb2cocmVxLmJvZHkuc3BlY2lmaWNGcmllbmQpO1xyXG4gIHZhciBwZXJzb24gPSByZXEuYm9keS5zcGVjaWZpY0ZyaWVuZFxyXG4gIHZhciBpZCA9IG51bGxcclxuICB2YXIgbGVuID0gbnVsbDtcclxuICBjb24ucXVlcnkoJ1NFTEVDVCBpZCBGUk9NIHVzZXJzIFdIRVJFIHVzZXJuYW1lID0gPycsIHBlcnNvbiwgKGVyciwgcmVzcCk9PiB7XHJcbiAgICAgIFxyXG4gICAgICBpZCA9IHJlc3BbMF0uaWQ7XHJcbiAgICAgIGNvbnNvbGUubG9nKGlkKVxyXG5cclxuICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHJhdGluZ3MgV0hFUkUgdXNlcmlkID0gPycsIGlkLCAoZXJyLCByZXNwKT0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZygnZXJycnJycnJycicsIGVyciwgcmVzcC5sZW5ndGgpXHJcbiAgICAgICAgbGVuID0gcmVzcC5sZW5ndGg7XHJcbiAgICAgICAgcmVzcC5mb3JFYWNoKGE9PiB7XHJcbiAgICAgICAgICBjb24ucXVlcnkoJ1NFTEVDVCB0aXRsZSBGUk9NIG1vdmllcyBXSEVSRSBpZCA9ID8nLCBhLm1vdmllaWQsIChlcnIsIHJlc3ApPT4ge1xyXG4gICAgICAgICAgICBtb3ZpZXMucHVzaChbcmVzcFswXS50aXRsZSwgYS5zY29yZSwgYS5yZXZpZXddKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhtb3ZpZXMpXHJcbiAgICAgICAgICAgIGlmIChtb3ZpZXMubGVuZ3RoID09PSBsZW4pIHtcclxuICAgICAgICAgICAgICByZXNwb25zZS5zZW5kKG1vdmllcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgICAgfSlcclxuICAgIH1cclxuICApXHJcbn1cclxuXHJcblxyXG5leHBvcnRzLmZpbmRNb3ZpZUJ1ZGRpZXMgPSBmdW5jdGlvbihyZXEsIHJlc3BvbnNlKSB7XHJcbiAgY29uc29sZS5sb2coXCJ5b3UncmUgdHJ5aW5nIHRvIGZpbmQgYnVkZGllcyEhXCIpO1xyXG4gIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSB1c2VycycsIChlcnIsIHJlc3ApPT4ge1xyXG4gICAgdmFyIHBlb3BsZSA9IHJlc3AubWFwKGE9PiAoXHJcbiAgICAgICBhLnVzZXJuYW1lXHJcbiAgICApKVxyXG4gICAgdmFyIElkcyA9IHJlc3AubWFwKGE9PiAoXHJcbiAgICAgICBhLmlkXHJcbiAgICApKVxyXG4gICAgdmFyIGlkS2V5T2JqID0ge31cclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgSWRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGlkS2V5T2JqW0lkc1tpXV0gPSBwZW9wbGVbaV07XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHZhciBjdXJyZW50VXNlciA9IHJlcS5teVNlc3Npb24udXNlclxyXG5jb25zb2xlLmxvZygnY3VycmVudCB1c2VyJywgY3VycmVudFVzZXIpO1xyXG5cclxuICAgIHZhciBvYmoxID0ge307XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IElkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBvYmoxW2lkS2V5T2JqW0lkc1tpXV1dID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgY29uLnF1ZXJ5KCdTRUxFQ1Qgc2NvcmUsbW92aWVpZCx1c2VyaWQgRlJPTSByYXRpbmdzJywgKGVyciwgcmVzcG9uKT0+IHtcclxuXHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcG9uLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgb2JqMVtpZEtleU9ialtyZXNwb25baV0udXNlcmlkXV0ucHVzaChbcmVzcG9uW2ldLm1vdmllaWQsIHJlc3BvbltpXS5zY29yZV0pXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnNvbGUubG9nKCdvYmoxJywgb2JqMSk7XHJcbiAgICAgIGN1cnJlbnRVc2VySW5mbyA9IG9iajFbY3VycmVudFVzZXJdXHJcblxyXG4gICAgICB2YXIgY29tcGFyaXNvbnMgPSB7fVxyXG5cclxuICAgICAgZm9yICh2YXIga2V5IGluIG9iajEpIHtcclxuICAgICAgICBpZiAoa2V5ICE9PSBjdXJyZW50VXNlcikge1xyXG4gICAgICAgICAgY29tcGFyaXNvbnNba2V5XSA9IGNvbXAoY3VycmVudFVzZXJJbmZvLCBvYmoxW2tleV0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGNvbnNvbGUubG9nKGNvbXBhcmlzb25zKVxyXG4gICAgICB2YXIgZmluYWxTZW5kID0gW107XHJcbiAgICAgIGZvciAodmFyIGtleSBpbiBjb21wYXJpc29ucykge1xyXG4gICAgICAgIGlmIChjb21wYXJpc29uc1trZXldICE9PSAnTmFOJScpIHtcclxuICAgICAgICAgIGZpbmFsU2VuZC5wdXNoKFtrZXksIGNvbXBhcmlzb25zW2tleV1dKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZmluYWxTZW5kLnB1c2goW2tleSwgXCJObyBDb21wYXJpc29uIHRvIE1ha2VcIl0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJlc3BvbnNlLnNlbmQoZmluYWxTZW5kKVxyXG4gICAgfSlcclxuICB9KVxyXG59XHJcblxyXG5cclxuZXhwb3J0cy5kZWNsaW5lPWZ1bmN0aW9uKHJlcSxyZXNwb25zZSl7XHJcbiAgdmFyIHJlcXVlc3Rvcj1yZXEuYm9keS5wZXJzb25Ub0RlY2xpbmU7XHJcbiAgdmFyIHJlcXVlc3RlZT1yZXEubXlTZXNzaW9uLnVzZXI7XHJcbiAgdmFyIG1vdmllPXJlcS5ib2R5Lm1vdmllO1xyXG4gIHZhciByZXF1ZXN0VHlwZSA9ICdmcmllbmQnO1xyXG4gIHZhciBhZGRPbj0hbW92aWU/JyBBTkQgcmVxdWVzdFR5cD0nKydcIicrIHJlcXVlc3RUeXBlKydcIic6JyBBTkQgcmVxdWVzdGVlPScrJ1wiJysgcmVxdWVzdGVlKydcIicrJyBBTkQgbW92aWUgPScrJ1wiJyttb3ZpZSsnXCInO1xyXG5cclxuICAgIGNvbi5xdWVyeSgnVVBEQVRFIGFsbHJlcXVlc3RzIFNFVCByZXNwb25zZT0nKydcIicgKyAnbm8nICsgJ1wiJysgJyBXSEVSRSByZXF1ZXN0b3IgPSAnKydcIicrIHJlcXVlc3RvcisnXCInK2FkZE9uLCAoZXJyLCByZXMpPT4ge1xyXG4gICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdMYXN0IGluc2VydCBJRDonLCByZXMuaW5zZXJ0SWQpO1xyXG4gICAgICByZXNwb25zZS5zZW5kKHJlcXVlc3RvciArICdkZWxldGVkJyk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gIC8vIGFsbFJlcXVlc3QuZm9yZ2Uoe3JlcXVlc3RvcjogcmVxdWVzdG9yLCByZXF1ZXN0ZWU6IHJlcXVlc3RlZX0pXHJcbiAgLy8gICAuZmV0Y2goKS50aGVuKGZ1bmN0aW9uKGFsbFJlcXVlc3QpIHtcclxuICAvLyAgICAgYWxsUmVxdWVzdC5kZXN0cm95KClcclxuICAvLyAgICAgICAudGhlbihmdW5jdGlvbigpIHtcclxuICAvLyAgICAgICAgIHJlc3BvbnNlLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogJ1VzZXIgc3VjY2Vzc2Z1bGx5IGRlbGV0ZWQnfX0pO1xyXG4gIC8vICAgICAgIH0pXHJcbiAgLy8gICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xyXG4gIC8vICAgICAgICAgcmVzcG9uc2Uuc3RhdHVzKDUwMCkuanNvbih7ZXJyb3I6IHRydWUsIGRhdGE6IHttZXNzYWdlOiBlcnIubWVzc2FnZX19KTtcclxuICAvLyAgICAgICB9KTtcclxuICAvLyAgIH0pXHJcbiAgLy8gICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XHJcbiAgLy8gICAgIHJlc3BvbnNlLnN0YXR1cyg1MDApLmpzb24oe2Vycm9yOiB0cnVlLCBkYXRhOiB7bWVzc2FnZTogZXJyLm1lc3NhZ2V9fSk7XHJcbiAgLy8gICB9KTtcclxufTtcclxuXHJcbmV4cG9ydHMuc2lnbnVwVXNlciA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgY29uc29sZS5sb2coJ2NhbGxpbmcgbG9naW4nLCByZXEuYm9keSk7XHJcbiAgLy8gY29uc29sZS5sb2coJ3RoaXMgaXMgdGhlIHNlc3Npb24nLHJlcS5zZXNzaW9uKVxyXG4gIG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUgfSkuZmV0Y2goKS50aGVuKGZvdW5kPT4ge1xyXG4gICAgaWYgKGZvdW5kKSB7XHJcbiAgICAgIC8vY2hlY2sgcGFzc3dvcmRcclxuICAgICAgICAgLy9pZiAocGFzc3dvcmQgbWF0Y2hlcylcclxuICAgICAgICAgLy97IGFkZCBzZXNzaW9ucyBhbmQgcmVkaXJlY3R9XHJcbiAgICAgIGNvbnNvbGUubG9nKCd1c2VybmFtZSBhbHJlYWR5IGV4aXN0LCBjYW5ub3Qgc2lnbnVwICcsIHJlcS5ib2R5Lm5hbWUpO1xyXG4gICAgICByZXMuc3RhdHVzKDQwMykuc2VuZCgndXNlcm5hbWUgZXhpc3QnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdjcmVhdGluZyB1c2VyJyk7XHJcbiAgICAgIHJlcS5teVNlc3Npb24udXNlciA9IHJlcS5ib2R5Lm5hbWU7XHJcbiAgICAgIFVzZXJzLmNyZWF0ZSh7XHJcbiAgICAgICAgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUsXHJcbiAgICAgICAgcGFzc3dvcmQ6IHJlcS5ib2R5LnBhc3N3b3JkLFxyXG4gICAgICB9KVxyXG4gICAgICAudGhlbih1c2VyPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjcmVhdGVkIGEgbmV3IHVzZXInKTtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMSkuc2VuZCgnbG9naW4gY3JlYXRlZCcpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxufTtcclxuXHJcbmV4cG9ydHMuc2lnbmluVXNlciA9IChyZXEsIHJlcyk9PiB7XHJcblx0Y29uc29sZS5sb2coJ2NhbGxpbmcgc2lnbmluJywgcmVxLmJvZHkpO1xyXG5cdG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5ib2R5Lm5hbWUgfSkuZmV0Y2goKS50aGVuKGZvdW5kPT57XHJcblx0XHRpZiAoZm91bmQpe1xyXG5cdFx0XHRuZXcgVXNlcih7IHVzZXJuYW1lOiByZXEuYm9keS5uYW1lLCBwYXNzd29yZDpyZXEuYm9keS5wYXNzd29yZH0pLmZldGNoKCkudGhlbihmb3VuZD0+e1xyXG5cdFx0XHRcdGlmIChmb3VuZCl7XHJcblx0XHRcdFx0XHRyZXEubXlTZXNzaW9uLnVzZXIgPSBmb3VuZC5hdHRyaWJ1dGVzLnVzZXJuYW1lO1xyXG4gICAgICAgICAgY29uc29sZS5sb2coZm91bmQuYXR0cmlidXRlcy51c2VybmFtZSlcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCd3ZSBmb3VuZCB5b3UhIScpXHJcblx0XHRcdFx0XHRyZXMuc2VuZChbJ2l0IHdvcmtlZCcscmVxLm15U2Vzc2lvbi51c2VyXSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJlcy5zdGF0dXMoNDA0KS5zZW5kKCdiYWQgbG9naW4nKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCd3cm9uZyBwYXNzd29yZCcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSlcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJlcy5zdGF0dXMoNDA0KS5zZW5kKCdiYWQgbG9naW4nKTtcclxuXHRcdFx0Y29uc29sZS5sb2coJ3VzZXIgbm90IGZvdW5kJyk7XHJcblx0XHR9XHJcbiAgfSkgXHJcbn1cclxuXHJcbmV4cG9ydHMubG9nb3V0ID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuXHRyZXEubXlTZXNzaW9uLmRlc3Ryb3koZnVuY3Rpb24oZXJyKXtcclxuXHRcdGNvbnNvbGUubG9nKGVycik7XHJcblx0fSk7XHJcblx0Y29uc29sZS5sb2coJ2xvZ291dCcpO1xyXG5cdHJlcy5zZW5kKCdsb2dvdXQnKTtcclxufVxyXG5cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLy8vL21vdmllIGhhbmRsZXJzXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuLy9hIGhhbmRlbGVyIHRoYXQgdGFrZXMgYSByYXRpbmcgZnJvbSB1c2VyIGFuZCBhZGQgaXQgdG8gdGhlIGRhdGFiYXNlXHJcbi8vIGV4cGVjdHMgcmVxLmJvZHkgdG8gaGF2ZSB0aGlzOiB7dGl0bGU6ICduYW1lJywgZ2VucmU6ICdnZW5yZScsIHBvc3RlcjogJ2xpbmsnLCByZWxlYXNlX2RhdGU6ICd5ZWFyJywgcmF0aW5nOiAnbnVtYmVyJ31cclxuZXhwb3J0cy5yYXRlTW92aWUgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG5cdGNvbnNvbGUubG9nKCdjYWxsaW5nIHJhdGVNb3ZpZScpO1xyXG5cdHZhciB1c2VyaWQ7XHJcblx0cmV0dXJuIG5ldyBVc2VyKHsgdXNlcm5hbWU6IHJlcS5teVNlc3Npb24udXNlciB9KS5mZXRjaCgpXHJcblx0LnRoZW4oZm91bmRVc2VyPT4ge1xyXG5cdFx0dXNlcmlkID0gZm91bmRVc2VyLmF0dHJpYnV0ZXMuaWQ7XHJcblx0XHRyZXR1cm4gbmV3IFJhdGluZyh7IG1vdmllaWQ6IHJlcS5ib2R5LmlkLCB1c2VyaWQ6IHVzZXJpZCB9KS5mZXRjaCgpXHJcblx0XHQudGhlbihmb3VuZFJhdGluZz0+IHtcclxuXHRcdFx0aWYgKGZvdW5kUmF0aW5nKSB7XHJcblx0XHRcdFx0Ly9zaW5jZSByYXRpbmcgb3IgcmV2aWV3IGlzIHVwZGF0ZWQgc2VwZXJhdGx5IGluIGNsaWVudCwgdGhlIGZvbGxvd2luZ1xyXG5cdFx0XHRcdC8vbWFrZSBzdXJlIGl0IGdldHMgdXBkYXRlZCBhY2NvcmRpbmcgdG8gdGhlIHJlcVxyXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKCd1cGRhdGUgcmF0aW5nJywgZm91bmRSYXRpbmcpXHJcblx0XHRcdFx0aWYgKHJlcS5ib2R5LnJhdGluZykge1xyXG5cdFx0XHRcdFx0dmFyIHJhdGluZ09iaiA9IHtzY29yZTogcmVxLmJvZHkucmF0aW5nfTtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHJlcS5ib2R5LnJldmlldykge1xyXG5cdFx0XHRcdFx0dmFyIHJhdGluZ09iaiA9IHtyZXZpZXc6IHJlcS5ib2R5LnJldmlld307XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBuZXcgUmF0aW5nKHsnaWQnOiBmb3VuZFJhdGluZy5hdHRyaWJ1dGVzLmlkfSlcclxuXHRcdFx0XHRcdC5zYXZlKHJhdGluZ09iaik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coJ2NyZWF0aW5nIHJhdGluZycpO1xyXG5cdFx0ICAgIHJldHVybiBSYXRpbmdzLmNyZWF0ZSh7XHJcblx0XHQgICAgXHRzY29yZTogcmVxLmJvZHkucmF0aW5nLFxyXG5cdFx0ICAgICAgdXNlcmlkOiB1c2VyaWQsXHJcblx0XHQgICAgICBtb3ZpZWlkOiByZXEuYm9keS5pZCxcclxuXHRcdCAgICAgIHJldmlldzogcmVxLmJvZHkucmV2aWV3XHJcblx0XHQgICAgfSk7XHRcdFx0XHRcdFxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9KVxyXG5cdC50aGVuKG5ld1JhdGluZz0+IHtcclxuXHRcdGNvbnNvbGUubG9nKCdyYXRpbmcgY3JlYXRlZDonLCBuZXdSYXRpbmcuYXR0cmlidXRlcyk7XHJcbiAgXHRyZXMuc3RhdHVzKDIwMSkuc2VuZCgncmF0aW5nIHJlY2lldmVkJyk7XHJcblx0fSlcclxuICAuY2F0Y2goZXJyID0+IHtcclxuICAgIHJlcy5zdGF0dXMoNTAwKS5zZW5kKCdlcnJvcicpO1xyXG4gIH0pXHJcbn07XHJcblxyXG4vL3RoaXMgaGVscGVyIGZ1bmN0aW9uIGFkZHMgdGhlIG1vdmllIGludG8gZGF0YWJhc2VcclxuLy9pdCBmb2xsb3dzIHRoZSBzYW1lIG1vdmllIGlkIGFzIFRNREJcclxuLy9leHBlY3RzIHJlcS5ib2R5IHRvIGhhdmUgdGhlc2UgYXRyaWJ1dGUgOiB7aWQsIHRpdGxlLCBnZW5yZSwgcG9zdGVyX3BhdGgsIHJlbGVhc2VfZGF0ZSwgb3ZlcnZpZXcsIHZvdGVfYXZlcmFnZX1cclxudmFyIGFkZE9uZU1vdmllID0gbW92aWVPYmo9PiB7XHJcblx0dmFyIGdlbnJlID0gKG1vdmllT2JqLmdlbnJlX2lkcykgPyBnZW5yZXNbbW92aWVPYmouZ2VucmVfaWRzWzBdXSA6ICduL2EnO1xyXG4gIHJldHVybiBuZXcgTW92aWUoe1xyXG4gIFx0aWQ6IG1vdmllT2JqLmlkLFxyXG4gICAgdGl0bGU6IG1vdmllT2JqLnRpdGxlLFxyXG4gICAgZ2VucmU6IGdlbnJlLFxyXG4gICAgcG9zdGVyOiAnaHR0cHM6Ly9pbWFnZS50bWRiLm9yZy90L3AvdzE4NS8nICsgbW92aWVPYmoucG9zdGVyX3BhdGgsXHJcbiAgICByZWxlYXNlX2RhdGU6IG1vdmllT2JqLnJlbGVhc2VfZGF0ZSxcclxuICAgIGRlc2NyaXB0aW9uOiBtb3ZpZU9iai5vdmVydmlldy5zbGljZSgwLCAyNTUpLFxyXG4gICAgaW1kYlJhdGluZzogbW92aWVPYmoudm90ZV9hdmVyYWdlXHJcbiAgfSkuc2F2ZShudWxsLCB7bWV0aG9kOiAnaW5zZXJ0J30pXHJcbiAgLnRoZW4obmV3TW92aWU9PiB7XHJcbiAgXHRjb25zb2xlLmxvZygnbW92aWUgY3JlYXRlZCcsIG5ld01vdmllLmF0dHJpYnV0ZXMudGl0bGUpO1xyXG4gIFx0cmV0dXJuIG5ld01vdmllO1xyXG4gIH0pXHJcbn07XHJcblxyXG5cclxuLy9nZXQgYWxsIG1vdmllIHJhdGluZ3MgdGhhdCBhIHVzZXIgcmF0ZWRcclxuLy9zaG91bGQgcmV0dXJuIGFuIGFycmF5IHRoYXQgbG9vayBsaWtlIHRoZSBmb2xsb3dpbmc6XHJcbi8vIFsge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnICwgcG9zdGVyOiAndXJsJywgcmVsZWFzZV9kYXRlOiAnZGF0ZScsIHNjb3JlOiBuLCBmcmllbmRBdmVyYWdlUmF0aW5nOiBufSAuLi4gXVxyXG4vLyB3aWxsIGdldCByYXRpbmdzIGZvciB0aGUgY3VycmVudCB1c2VyXHJcbmV4cG9ydHMuZ2V0VXNlclJhdGluZ3MgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIFJhdGluZy5xdWVyeShmdW5jdGlvbihxYil7XHJcbiAgXHRxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcclxuICBcdHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xyXG4gIFx0cWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnLCAncmF0aW5ncy51cGRhdGVkX2F0Jyk7XHJcbiAgXHRxYi53aGVyZSgndXNlcnMudXNlcm5hbWUnLCAnPScsIHJlcS5teVNlc3Npb24udXNlcik7XHJcbiAgXHRxYi5vcmRlckJ5KCd1cGRhdGVkX2F0JywgJ0RFU0MnKVxyXG4gIH0pXHJcbiAgLmZldGNoQWxsKClcclxuICAudGhlbihmdW5jdGlvbihyYXRpbmdzKXtcclxuXHRcdC8vZGVjb3JhdGUgaXQgd2l0aCBhdmcgZnJpZW5kIHJhdGluZ1xyXG5cdFx0cmV0dXJuIFByb21pc2UubWFwKHJhdGluZ3MubW9kZWxzLCBmdW5jdGlvbihyYXRpbmcpIHtcclxuXHRcdFx0cmV0dXJuIGF0dGFjaEZyaWVuZEF2Z1JhdGluZyhyYXRpbmcsIHJlcS5teVNlc3Npb24udXNlcik7XHJcblx0XHR9KTtcclxuXHR9KVxyXG4gIC50aGVuKGZ1bmN0aW9uKHJhdGluZ3MpIHtcclxuICBcdGNvbnNvbGUubG9nKCdyZXRyaXZpbmcgYWxsIHVzZXIgcmF0aW5ncycpO1xyXG4gIFx0cmVzLnN0YXR1cygyMDApLmpzb24ocmF0aW5ncyk7XHJcbiAgfSlcclxufTtcclxuXHJcbmV4cG9ydHMuZ2V0RnJpZW5kVXNlclJhdGluZ3MgPSBmdW5jdGlvbihyZXEsIHJlcykge1xyXG4gIFJhdGluZy5xdWVyeShmdW5jdGlvbihxYil7XHJcbiAgXHRxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcclxuICBcdHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xyXG4gIFx0cWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUgYXMgZnJpZW5kU2NvcmUnLCAncmF0aW5ncy5yZXZpZXcgYXMgZnJpZW5kUmV2aWV3JywgJ3JhdGluZ3MudXBkYXRlZF9hdCcpO1xyXG4gIFx0cWIud2hlcmUoJ3VzZXJzLnVzZXJuYW1lJywgJz0nLCByZXEucXVlcnkuZnJpZW5kTmFtZSk7XHJcbiAgXHRxYi5vcmRlckJ5KCd1cGRhdGVkX2F0JywgJ0RFU0MnKVxyXG4gIH0pXHJcbiAgLmZldGNoQWxsKClcclxuICAudGhlbihmdW5jdGlvbihyYXRpbmdzKXtcclxuXHRcdC8vZGVjb3JhdGUgaXQgd2l0aCBjdXJyZW50IHVzZXIncyByYXRpbmdcclxuXHRcdHJldHVybiBQcm9taXNlLm1hcChyYXRpbmdzLm1vZGVscywgZnVuY3Rpb24ocmF0aW5nKSB7XHJcblx0XHRcdHJldHVybiBhdHRhY2hVc2VyUmF0aW5nKHJhdGluZywgcmVxLm15U2Vzc2lvbi51c2VyKTtcclxuXHRcdH0pO1xyXG5cdH0pXHJcbiAgLnRoZW4oZnVuY3Rpb24ocmF0aW5ncykge1xyXG4gIFx0Y29uc29sZS5sb2coJ3JldHJpdmluZyBhbGwgdXNlciByYXRpbmdzJyk7XHJcbiAgXHRyZXMuc3RhdHVzKDIwMCkuanNvbihyYXRpbmdzKTtcclxuICB9KVxyXG59O1xyXG5cclxuLy9hIGRlY29yYXRvciBmdW5jdGlvbiB0aGF0IGF0dGFjaGVzIGZyaWVuZCBhdmcgcmF0aW5nIHRvIHRoZSByYXRpbmcgb2JqXHJcbnZhciBhdHRhY2hGcmllbmRBdmdSYXRpbmcgPSBmdW5jdGlvbihyYXRpbmcsIHVzZXJuYW1lKSB7XHJcblx0cmV0dXJuIGV4cG9ydHMuZ2V0RnJpZW5kUmF0aW5ncyh1c2VybmFtZSwgcmF0aW5nKVxyXG5cdC50aGVuKGZ1bmN0aW9uKGZyaWVuZHNSYXRpbmdzKXtcclxuXHRcdC8vaWYgZnJpZW5kc1JhdGluZ3MgaXMgbnVsbCwgUmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyBpcyBudWxsXHJcblx0XHRpZiAoIWZyaWVuZHNSYXRpbmdzKSB7XHJcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgPSBudWxsO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyA9IGF2ZXJhZ2VSYXRpbmcoZnJpZW5kc1JhdGluZ3MpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJhdGluZztcclxuXHR9KVxyXG59XHJcblxyXG4vL2EgZGVjb3JhdG9yIGZ1bmN0aW9uIHRoYXQgYXR0YWNoZXMgdXNlciByYXRpbmcgYW5kIHJldmlld3MgdG8gdGhlIHJhdGluZyBvYmpcclxudmFyIGF0dGFjaFVzZXJSYXRpbmcgPSBmdW5jdGlvbihyYXRpbmcsIHVzZXJuYW1lKSB7XHJcblx0cmV0dXJuIFJhdGluZy5xdWVyeShmdW5jdGlvbihxYikge1xyXG5cdFx0cWIuaW5uZXJKb2luKCd1c2VycycsICd1c2Vycy5pZCcsICc9JywgJ3JhdGluZ3MudXNlcmlkJylcclxuXHRcdHFiLmlubmVySm9pbignbW92aWVzJywgJ21vdmllcy5pZCcsICc9JywgJ3JhdGluZ3MubW92aWVpZCcpXHJcblx0XHRxYi5zZWxlY3QoJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnKVxyXG5cdFx0cWIud2hlcmUoe1xyXG5cdFx0XHQndXNlcnMudXNlcm5hbWUnOiB1c2VybmFtZSxcclxuXHRcdFx0J21vdmllcy50aXRsZSc6IHJhdGluZy5hdHRyaWJ1dGVzLnRpdGxlLFxyXG5cdFx0XHQnbW92aWVzLmlkJzogcmF0aW5nLmF0dHJpYnV0ZXMuaWRcclxuXHRcdH0pXHJcblx0fSlcclxuXHQuZmV0Y2goKVxyXG5cdC50aGVuKGZ1bmN0aW9uKHVzZXJSYXRpbmcpe1xyXG5cdFx0aWYgKHVzZXJSYXRpbmcpIHtcclxuXHRcdFx0cmF0aW5nLmF0dHJpYnV0ZXMuc2NvcmUgPSB1c2VyUmF0aW5nLmF0dHJpYnV0ZXMuc2NvcmU7XHJcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLnJldmlldyA9IHVzZXJSYXRpbmcuYXR0cmlidXRlcy5yZXZpZXc7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyYXRpbmcuYXR0cmlidXRlcy5zY29yZSA9IG51bGw7XHJcblx0XHRcdHJhdGluZy5hdHRyaWJ1dGVzLnJldmlldyA9IG51bGw7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmF0aW5nO1xyXG5cdH0pO1xyXG59O1xyXG5cclxuLy90aGlzIGlzIGEgd3JhcGVyIGZ1bmN0aW9uIGZvciBnZXRGcmllbmRSYXRpbmdzIHdoaWNoIHdpbGwgc2VudCB0aGUgY2xpZW50IGFsbCBvZiB0aGUgZnJpZW5kIHJhdGluZ3NcclxuZXhwb3J0cy5oYW5kbGVHZXRGcmllbmRSYXRpbmdzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuXHRjb25zb2xlLmxvZygnaGFuZGxlR2V0RnJpZW5kUmF0aW5ncywgJywgcmVxLm15U2Vzc2lvbi51c2VyLCByZXEuYm9keS5tb3ZpZS50aXRsZSk7XHJcblx0ZXhwb3J0cy5nZXRGcmllbmRSYXRpbmdzKHJlcS5teVNlc3Npb24udXNlciwge2F0dHJpYnV0ZXM6IHJlcS5ib2R5Lm1vdmllfSlcclxuXHQudGhlbihmdW5jdGlvbihmcmllbmRSYXRpbmdzKXtcclxuXHRcdHJlcy5qc29uKGZyaWVuZFJhdGluZ3MpO1xyXG5cdH0pO1xyXG59XHJcblxyXG4vL3RoaXMgZnVuY3Rpb24gb3V0cHV0cyByYXRpbmdzIG9mIGEgdXNlcidzIGZyaWVuZCBmb3IgYSBwYXJ0aWN1bGFyIG1vdmllXHJcbi8vZXhwZWN0IGN1cnJlbnQgdXNlcm5hbWUgYW5kIG1vdmllVGl0bGUgYXMgaW5wdXRcclxuLy9vdXRwdXRzOiB7dXNlcjJpZDogJ2lkJywgZnJpZW5kVXNlck5hbWU6J25hbWUnLCBmcmllbmRGaXJzdE5hbWU6J25hbWUnLCB0aXRsZTonbW92aWVUaXRsZScsIHNjb3JlOm4gfVxyXG5leHBvcnRzLmdldEZyaWVuZFJhdGluZ3MgPSBmdW5jdGlvbih1c2VybmFtZSwgbW92aWVPYmopIHtcclxuXHRyZXR1cm4gVXNlci5xdWVyeShmdW5jdGlvbihxYil7XHJcblx0XHRxYi5pbm5lckpvaW4oJ3JlbGF0aW9ucycsICdyZWxhdGlvbnMudXNlcjFpZCcsICc9JywgJ3VzZXJzLmlkJyk7XHJcblx0XHRxYi5pbm5lckpvaW4oJ3JhdGluZ3MnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICdyZWxhdGlvbnMudXNlcjJpZCcpO1xyXG5cdFx0cWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XHJcblx0XHRxYi5zZWxlY3QoJ3JlbGF0aW9ucy51c2VyMmlkJywgJ21vdmllcy50aXRsZScsICdyYXRpbmdzLnNjb3JlJywgJ3JhdGluZ3MucmV2aWV3Jyk7XHJcblx0XHRxYi53aGVyZSh7XHJcblx0XHRcdCd1c2Vycy51c2VybmFtZSc6IHVzZXJuYW1lLCBcclxuXHRcdFx0J21vdmllcy50aXRsZSc6IG1vdmllT2JqLmF0dHJpYnV0ZXMudGl0bGUsXHJcblx0XHRcdCdtb3ZpZXMuaWQnOiBtb3ZpZU9iai5hdHRyaWJ1dGVzLmlkIH0pO1xyXG5cdH0pXHJcblx0LmZldGNoQWxsKClcclxuXHQudGhlbihmdW5jdGlvbihmcmllbmRzUmF0aW5ncyl7XHJcblx0Ly90aGUgZm9sbG93aW5nIGJsb2NrIGFkZHMgdGhlIGZyaWVuZE5hbWUgYXR0cmlidXRlIHRvIHRoZSByYXRpbmdzXHJcblx0XHRyZXR1cm4gUHJvbWlzZS5tYXAoZnJpZW5kc1JhdGluZ3MubW9kZWxzLCBmdW5jdGlvbihmcmllbmRSYXRpbmcpIHtcclxuXHRcdFx0cmV0dXJuIG5ldyBVc2VyKHsgaWQ6IGZyaWVuZFJhdGluZy5hdHRyaWJ1dGVzLnVzZXIyaWQgfSkuZmV0Y2goKVxyXG5cdFx0XHQudGhlbihmdW5jdGlvbihmcmllbmQpe1xyXG5cdFx0XHRcdGZyaWVuZFJhdGluZy5hdHRyaWJ1dGVzLmZyaWVuZFVzZXJOYW1lID0gZnJpZW5kLmF0dHJpYnV0ZXMudXNlcm5hbWU7XHJcblx0XHRcdFx0ZnJpZW5kUmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kRmlyc3ROYW1lID0gZnJpZW5kLmF0dHJpYnV0ZXMuZmlyc3ROYW1lO1xyXG5cdFx0XHRcdHJldHVybiBmcmllbmRSYXRpbmc7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fSlcclxuXHQudGhlbihmdW5jdGlvbihmcmllbmRzUmF0aW5ncyl7XHJcblx0XHRyZXR1cm4gZnJpZW5kc1JhdGluZ3M7XHJcblx0fSk7XHJcbn07XHJcblxyXG5cclxuLy9hIGhlbHBlciBmdW5jdGlvbiB0aGF0IGF2ZXJhZ2VzIHRoZSByYXRpbmdcclxuLy9pbnB1dHMgcmF0aW5ncywgb3V0cHV0cyB0aGUgYXZlcmFnZSBzY29yZTtcclxudmFyIGF2ZXJhZ2VSYXRpbmcgPSBmdW5jdGlvbihyYXRpbmdzKSB7XHJcblx0Ly9yZXR1cm4gbnVsbCBpZiBubyBmcmllbmQgaGFzIHJhdGVkIHRoZSBtb3ZpZVxyXG5cdGlmIChyYXRpbmdzLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG5cdHJldHVybiByYXRpbmdzXHJcblx0LnJlZHVjZShmdW5jdGlvbih0b3RhbCwgcmF0aW5nKXtcclxuXHRcdHJldHVybiB0b3RhbCArPSByYXRpbmcuYXR0cmlidXRlcy5zY29yZTtcclxuXHR9LCAwKSAvIHJhdGluZ3MubGVuZ3RoO1xyXG59XHJcblxyXG5cclxuLy9hIGhlbHBlciBmdW5jdGlvbiB0aGF0IG91dHB1dHMgdXNlciByYXRpbmcgYW5kIGF2ZXJhZ2UgZnJpZW5kIHJhdGluZyBmb3Igb25lIG1vdmllXHJcbi8vb3V0cHV0cyBvbmUgcmF0aW5nIG9iajoge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnICwgcG9zdGVyOiAndXJsJywgcmVsZWFzZV9kYXRlOiAnZGF0ZScsIHNjb3JlOiBuLCBmcmllbmRBdmVyYWdlUmF0aW5nOiBufVxyXG52YXIgZ2V0T25lTW92aWVSYXRpbmcgPSBmdW5jdGlvbih1c2VybmFtZSwgbW92aWVPYmopIHtcclxuICByZXR1cm4gUmF0aW5nLnF1ZXJ5KGZ1bmN0aW9uKHFiKXtcclxuICBcdHFiLmlubmVySm9pbigndXNlcnMnLCAncmF0aW5ncy51c2VyaWQnLCAnPScsICd1c2Vycy5pZCcpO1xyXG4gIFx0cWIuaW5uZXJKb2luKCdtb3ZpZXMnLCAncmF0aW5ncy5tb3ZpZWlkJywgJz0nLCAnbW92aWVzLmlkJyk7XHJcbiAgXHRxYi5zZWxlY3QoJ3VzZXJzLnVzZXJuYW1lJywgJ21vdmllcy50aXRsZScsICdtb3ZpZXMuaWQnLCAnbW92aWVzLmdlbnJlJywgJ21vdmllcy5wb3N0ZXInLCAnbW92aWVzLnJlbGVhc2VfZGF0ZScsICdtb3ZpZXMuaW1kYlJhdGluZycsICdtb3ZpZXMuZGVzY3JpcHRpb24nLCAncmF0aW5ncy5zY29yZScsICdyYXRpbmdzLnJldmlldycpO1xyXG4gIFx0cWIud2hlcmUoeyd1c2Vycy51c2VybmFtZSc6IHVzZXJuYW1lLCAnbW92aWVzLnRpdGxlJzogbW92aWVPYmoudGl0bGUsICdtb3ZpZXMuaWQnOiBtb3ZpZU9iai5pZH0pO1xyXG4gIH0pXHJcbiAgLmZldGNoKClcclxuICAudGhlbihmdW5jdGlvbihyYXRpbmcpe1xyXG5cdCAgaWYgKCFyYXRpbmcpIHtcclxuXHQgIFx0Ly9pZiB0aGUgdXNlciBoYXMgbm90IHJhdGVkIHRoZSBtb3ZpZSwgcmV0dXJuIGFuIG9iaiB0aGF0IGhhcyB0aGUgbW92aWUgaW5mb3JtYXRpb24sIGJ1dCBzY29yZSBpcyBzZXQgdG8gbnVsbFxyXG5cdCAgXHRyZXR1cm4gbmV3IE1vdmllKHt0aXRsZTogbW92aWVPYmoudGl0bGUsIGlkOiBtb3ZpZU9iai5pZH0pLmZldGNoKClcclxuXHQgIFx0LnRoZW4oZnVuY3Rpb24obW92aWUpIHtcclxuXHQgIFx0XHRtb3ZpZS5hdHRyaWJ1dGVzLnNjb3JlID0gbnVsbDtcclxuXHQgIFx0XHRyZXR1cm4gbW92aWU7XHJcblx0ICBcdH0pXHJcblx0ICB9IGVsc2Uge1xyXG5cdCAgXHRyZXR1cm4gcmF0aW5nO1xyXG5cdCAgfVxyXG5cdH0pXHJcblx0LnRoZW4oZnVuY3Rpb24ocmF0aW5nKXtcclxuXHRcdHJldHVybiBleHBvcnRzLmdldEZyaWVuZFJhdGluZ3ModXNlcm5hbWUsIHJhdGluZylcclxuXHRcdC50aGVuKGZ1bmN0aW9uKGZyaWVuZHNSYXRpbmdzKXtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ2ZyaWVuZHNSYXRpbmdzJywgZnJpZW5kc1JhdGluZ3MpO1xyXG5cdFx0XHRyYXRpbmcuYXR0cmlidXRlcy5mcmllbmRBdmVyYWdlUmF0aW5nID0gYXZlcmFnZVJhdGluZyhmcmllbmRzUmF0aW5ncyk7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdhZGRlZCBhdmVyYWdlIGZyaWVuZCByYXRpbmcnLCByYXRpbmcuYXR0cmlidXRlcy50aXRsZSwgcmF0aW5nLmF0dHJpYnV0ZXMuZnJpZW5kQXZlcmFnZVJhdGluZyk7XHJcblx0XHRcdHJldHVybiByYXRpbmc7XHJcblx0XHR9KTtcclxuXHR9KTtcclxufVxyXG5cclxuXHJcbi8vdGhpcyBoYW5kbGVyIGlzIHNwZWNpZmljYWxseSBmb3Igc2VuZGluZyBvdXQgYSBsaXN0IG9mIG1vdmllIHJhdGluZ3Mgd2hlbiB0aGUgY2xpZW50IHNlbmRzIGEgbGlzdCBvZiBtb3ZpZSB0byB0aGUgc2VydmVyXHJcbi8vZXhwZWN0cyByZXEuYm9keSB0byBiZSBhbiBhcnJheSBvZiBvYmogd2l0aCB0aGVzZSBhdHRyaWJ1dGVzOiB7aWQsIHRpdGxlLCBnZW5yZSwgcG9zdGVyX3BhdGgsIHJlbGVhc2VfZGF0ZSwgb3ZlcnZpZXcsIHZvdGVfYXZlcmFnZX1cclxuLy9vdXRwdXRzIFsge3RpdGxlOiAnbmFtZScsIGdlbnJlOiAnZ2VucmUnICwgcG9zdGVyOiAndXJsJywgcmVsZWFzZV9kYXRlOiAnZGF0ZScsIHNjb3JlOiBuLCBmcmllbmRBdmVyYWdlUmF0aW5nOiBufSAuLi4gXVxyXG5leHBvcnRzLmdldE11bHRpcGxlTW92aWVSYXRpbmdzID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuXHRjb25zb2xlLmxvZygnZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MnKTtcclxuXHRQcm9taXNlLm1hcChyZXEuYm9keS5tb3ZpZXMsIGZ1bmN0aW9uKG1vdmllKSB7XHJcblx0XHQvL2ZpcnN0IGNoZWNrIHdoZXRoZXIgbW92aWUgaXMgaW4gdGhlIGRhdGFiYXNlXHJcblx0XHRyZXR1cm4gbmV3IE1vdmllKHt0aXRsZTogbW92aWUudGl0bGUsIGlkOiBtb3ZpZS5pZH0pLmZldGNoKClcclxuXHRcdC50aGVuKGZ1bmN0aW9uKGZvdW5kTW92aWUpIHtcclxuXHRcdFx0Ly9pZiBub3QgY3JlYXRlIG9uZVxyXG5cdFx0XHRpZiAoIWZvdW5kTW92aWUpIHtcclxuXHRcdFx0XHRyZXR1cm4gYWRkT25lTW92aWUobW92aWUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBmb3VuZE1vdmllO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdFx0LnRoZW4oZnVuY3Rpb24oZm91bmRNb3ZpZSl7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdmb3VuZCBtb3ZpZScsIGZvdW5kTW92aWUpO1xyXG5cdFx0XHRyZXR1cm4gZ2V0T25lTW92aWVSYXRpbmcocmVxLm15U2Vzc2lvbi51c2VyLCBmb3VuZE1vdmllLmF0dHJpYnV0ZXMpO1xyXG5cdFx0fSlcclxuXHR9KVxyXG5cdC50aGVuKGZ1bmN0aW9uKHJhdGluZ3Mpe1xyXG5cdFx0Y29uc29sZS5sb2coJ3NlbmRpbmcgcmF0aW5nIHRvIGNsaWVudCcpO1xyXG5cdFx0cmVzLmpzb24ocmF0aW5ncyk7XHJcblx0fSlcclxufVxyXG5cclxuLy90aGlzIGhhbmRsZXIgc2VuZHMgYW4gZ2V0IHJlcXVlc3QgdG8gVE1EQiBBUEkgdG8gcmV0cml2ZSByZWNlbnQgdGl0bGVzXHJcbi8vd2UgY2Fubm90IGRvIGl0IGluIHRoZSBmcm9udCBlbmQgYmVjYXVzZSBjcm9zcyBvcmlnaW4gcmVxdWVzdCBpc3N1ZXNcclxuZXhwb3J0cy5nZXRSZWNlbnRSZWxlYXNlID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuICB2YXIgcGFyYW1zID0ge1xyXG4gICAgYXBpX2tleTogJzlkM2IwMzVlZjFjZDY2OWFlZDM5ODQwMGIxN2ZjZWEyJyxcclxuICAgIHByaW1hcnlfcmVsZWFzZV95ZWFyOiBuZXcgRGF0ZSgpLmdldEZ1bGxZZWFyKCksXHJcbiAgICBpbmNsdWRlX2FkdWx0OiBmYWxzZSxcclxuICAgIHNvcnRfYnk6ICdwb3B1bGFyaXR5LmRlc2MnXHJcbiAgfTtcclxuXHJcblx0IFxyXG4gIHZhciBkYXRhID0gJyc7XHJcblx0cmVxdWVzdCh7XHJcblx0XHRtZXRob2Q6ICdHRVQnLFxyXG5cdFx0dXJsOiAnaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy9kaXNjb3Zlci9tb3ZpZS8nLFxyXG5cdFx0cXM6IHBhcmFtc1xyXG5cdH0pXHJcblx0Lm9uKCdkYXRhJyxmdW5jdGlvbihjaHVuayl7XHJcblx0XHRkYXRhICs9IGNodW5rO1xyXG5cdH0pXHJcblx0Lm9uKCdlbmQnLCBmdW5jdGlvbigpe1xyXG5cdFx0cmVjZW50TW92aWVzID0gSlNPTi5wYXJzZShkYXRhKTtcclxuICAgIHJlcS5ib2R5Lm1vdmllcyA9IHJlY2VudE1vdmllcy5yZXN1bHRzO1xyXG4gICAgLy90cmFuc2ZlcnMgdGhlIG1vdmllIGRhdGEgdG8gZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MgdG8gZGVjb3JhdGUgd2l0aCBzY29yZSAodXNlciByYXRpbmcpIGFuZCBhdmdmcmllbmRSYXRpbmcgYXR0cmlidXRlXHJcbiAgICBleHBvcnRzLmdldE11bHRpcGxlTW92aWVSYXRpbmdzKHJlcSwgcmVzKTtcclxuXHJcblx0fSlcclxuXHQub24oJ2Vycm9yJywgZnVuY3Rpb24oZXJyb3Ipe1xyXG5cdFx0Y29uc29sZS5sb2coZXJyb3IpO1xyXG5cdH0pXHJcblxyXG59XHJcblxyXG4vL3RoaXMgaXMgVE1EQidzIGdlbnJlIGNvZGUsIHdlIG1pZ2h0IHdhbnQgdG8gcGxhY2UgdGhpcyBzb21ld2hlcmUgZWxzZVxyXG52YXIgZ2VucmVzID0ge1xyXG4gICAxMjogXCJBZHZlbnR1cmVcIixcclxuICAgMTQ6IFwiRmFudGFzeVwiLFxyXG4gICAxNjogXCJBbmltYXRpb25cIixcclxuICAgMTg6IFwiRHJhbWFcIixcclxuICAgMjc6IFwiSG9ycm9yXCIsXHJcbiAgIDI4OiBcIkFjdGlvblwiLFxyXG4gICAzNTogXCJDb21lZHlcIixcclxuICAgMzY6IFwiSGlzdG9yeVwiLFxyXG4gICAzNzogXCJXZXN0ZXJuXCIsXHJcbiAgIDUzOiBcIlRocmlsbGVyXCIsXHJcbiAgIDgwOiBcIkNyaW1lXCIsXHJcbiAgIDk5OiBcIkRvY3VtZW50YXJ5XCIsXHJcbiAgIDg3ODogXCJTY2llbmNlIEZpY3Rpb25cIixcclxuICAgOTY0ODogXCJNeXN0ZXJ5XCIsXHJcbiAgIDEwNDAyOiBcIk11c2ljXCIsXHJcbiAgIDEwNzQ5OiBcIlJvbWFuY2VcIixcclxuICAgMTA3NTE6IFwiRmFtaWx5XCIsXHJcbiAgIDEwNzUyOiBcIldhclwiLFxyXG4gICAxMDc2OTogXCJGb3JlaWduXCIsXHJcbiAgIDEwNzcwOiBcIlRWIE1vdmllXCJcclxuIH07XHJcblxyXG4vL3RoaXMgZnVuY3Rpb24gd2lsbCBzZW5kIGJhY2sgc2VhcmNiIG1vdmllcyB1c2VyIGhhcyByYXRlZCBpbiB0aGUgZGF0YWJhc2VcclxuLy9pdCB3aWxsIHNlbmQgYmFjayBtb3ZpZSBvYmpzIHRoYXQgbWF0Y2ggdGhlIHNlYXJjaCBpbnB1dCwgZXhwZWN0cyBtb3ZpZSBuYW1lIGluIHJlcS5ib2R5LnRpdGxlXHJcbmV4cG9ydHMuc2VhcmNoUmF0ZWRNb3ZpZSA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgcmV0dXJuIFJhdGluZy5xdWVyeShmdW5jdGlvbihxYil7XHJcblx0XHRxYi5pbm5lckpvaW4oJ3VzZXJzJywgJ3JhdGluZ3MudXNlcmlkJywgJz0nLCAndXNlcnMuaWQnKTtcclxuXHRcdHFiLmlubmVySm9pbignbW92aWVzJywgJ3JhdGluZ3MubW92aWVpZCcsICc9JywgJ21vdmllcy5pZCcpO1xyXG5cdFx0cWIuc2VsZWN0KCd1c2Vycy51c2VybmFtZScsICdtb3ZpZXMudGl0bGUnLCAnbW92aWVzLmlkJywgJ21vdmllcy5nZW5yZScsICdtb3ZpZXMucG9zdGVyJywgJ21vdmllcy5yZWxlYXNlX2RhdGUnLCAnbW92aWVzLmltZGJSYXRpbmcnLCAnbW92aWVzLmRlc2NyaXB0aW9uJywgJ3JhdGluZ3Muc2NvcmUnLCAncmF0aW5ncy5yZXZpZXcnKTtcclxuICBcdHFiLndoZXJlUmF3KGBNQVRDSCAobW92aWVzLnRpdGxlKSBBR0FJTlNUICgnJHtyZXEucXVlcnkudGl0bGV9JyBJTiBOQVRVUkFMIExBTkdVQUdFIE1PREUpYClcclxuICBcdHFiLmFuZFdoZXJlKCd1c2Vycy51c2VybmFtZScsICc9JywgcmVxLm15U2Vzc2lvbi51c2VyKVxyXG4gIFx0cWIub3JkZXJCeSgndXBkYXRlZF9hdCcsICdERVNDJylcclxuICB9KVxyXG4gIC5mZXRjaEFsbCgpXHJcbiAgLnRoZW4oZnVuY3Rpb24obWF0Y2hlcyl7XHJcbiAgXHRjb25zb2xlLmxvZyhtYXRjaGVzLm1vZGVscyk7XHJcbiAgXHRyZXMuanNvbihtYXRjaGVzKTtcclxuICB9KVxyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8vLy9mcmllbmRzaGlwIGhhbmRsZXJzXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuZXhwb3J0cy5nZXRGcmllbmRMaXN0ID0gZnVuY3Rpb24ocmVxLCByZXMpIHtcclxuXHRyZXR1cm4gUmVsYXRpb24ucXVlcnkoZnVuY3Rpb24ocWIpe1xyXG5cdFx0cWIuaW5uZXJKb2luKCd1c2VycycsICdyZWxhdGlvbnMudXNlcjFpZCcsICc9JywgJ3VzZXJzLmlkJyk7XHJcblx0XHRxYi5zZWxlY3QoJ3JlbGF0aW9ucy51c2VyMmlkJyk7XHJcblx0XHRxYi53aGVyZSh7XHJcblx0XHRcdCd1c2Vycy51c2VybmFtZSc6IHJlcS5teVNlc3Npb24udXNlclxyXG5cdFx0fSlcclxuXHR9KVxyXG5cdC5mZXRjaEFsbCgpXHJcblx0LnRoZW4oZnVuY3Rpb24oZnJpZW5kcyl7XHJcblx0XHRyZXR1cm4gUHJvbWlzZS5tYXAoZnJpZW5kcy5tb2RlbHMsIGZ1bmN0aW9uKGZyaWVuZCkge1xyXG5cdFx0XHRyZXR1cm4gbmV3IFVzZXIoe2lkOiBmcmllbmQuYXR0cmlidXRlcy51c2VyMmlkfSkuZmV0Y2goKVxyXG5cdFx0XHQudGhlbihmdW5jdGlvbihmcmllbmRVc2VyKXtcclxuXHRcdFx0XHRyZXR1cm4gZnJpZW5kVXNlci5hdHRyaWJ1dGVzLnVzZXJuYW1lO1xyXG5cdFx0XHR9KVxyXG5cdFx0fSlcclxuXHR9KVxyXG5cdC50aGVuKGZ1bmN0aW9uKGZyaWVuZHMpe1xyXG5cdFx0Y29uc29sZS5sb2coJ3NlbmRpbmcgYSBsaXN0IG9mIGZyaWVuZCBuYW1lcycsIGZyaWVuZHMpO1xyXG5cdFx0cmVzLmpzb24oZnJpZW5kcyk7XHJcblx0fSlcclxufVxyXG5cclxuXHJcbmV4cG9ydHMuZ2V0RnJpZW5kcyA9IGZ1bmN0aW9uKHJlcSwgcmVzKSB7XHJcbiAgdmFyIHBlb3BsZUlkID0gW107XHJcbiAgdmFyIGlkID0gcmVxLm15U2Vzc2lvbi51c2VyXHJcbiAgY29uLnF1ZXJ5KCdTRUxFQ1QgaWQgRlJPTSB1c2VycyBXSEVSRSB1c2VybmFtZSA9ID8nLCBpZCwgZnVuY3Rpb24oZXJyLCByZXNwKSB7XHJcbiAgICB2YXIgdXNlcmlkID0gcmVzcFswXS5pZDtcclxuICAgIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBiZSBsaW5nLzInLGlkKVxyXG4gIFxyXG4gICAgY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHJhdGluZ3MgV0hFUkUgdXNlcmlkID0gPycsIHVzZXJpZCwgZnVuY3Rpb24oZXJyLCByZXNwKSB7XHJcbiAgICAgIHZhciB1c2Vyc1JhdGluZ3M9cmVzcC5tYXAoZnVuY3Rpb24oYSl7IHJldHVybiBbYS5tb3ZpZWlkLCBhLnNjb3JlXX0pO1xyXG5cclxuICAgICAgY29uLnF1ZXJ5KCdTRUxFQ1QgKiBGUk9NIHJlbGF0aW9ucyBXSEVSRSB1c2VyMWlkID0gPycsIHVzZXJpZCwgZnVuY3Rpb24oZXJyLCByZXNwKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXNwLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBpZiAocGVvcGxlSWQuaW5kZXhPZihyZXNwW2ldLnVzZXIyaWQpID09PSAtMSkge1xyXG4gICAgICAgICAgICBwZW9wbGVJZC5wdXNoKHJlc3BbaV0udXNlcjJpZCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBwZW9wbGUgPSBbXVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdUaGlzIHNob3VsZCBhbHNvIGJlIHBlb3BsZWVlJyxwZW9wbGVJZCk7XHJcbiAgICAgICAgdmFyIGtleUlkPXt9O1xyXG4gICAgICAgIHBlb3BsZUlkLmZvckVhY2goZnVuY3Rpb24oYSkge1xyXG5cclxuICAgICAgICAgIGNvbi5xdWVyeSgnU0VMRUNUIHVzZXJuYW1lIEZST00gdXNlcnMgV0hFUkUgaWQgPSA/JywgYSwgZnVuY3Rpb24oZXJyLCByZXNwbykge1xyXG4gIFx0ICAgICAgICBrZXlJZFthXT1yZXNwb1swXS51c2VybmFtZTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3RoaXMgaXMgT05FIG9mIHRoZSBwZW9wbGUhIScscmVzcG9bMF0udXNlcm5hbWUpXHJcbiAgICAgICAgICAgIGNvbi5xdWVyeSgnU0VMRUNUICogRlJPTSByYXRpbmdzIFdIRVJFIHVzZXJpZCA9JysnXCInK2ErJ1wiJywgZnVuY3Rpb24oZXJyLCByZSkge1xyXG4gICAgICBcdCAgICAgIGNvbnNvbGUubG9nKCd0aGlzIGlzIGEnLGEpXHJcbiAgICAgIFx0ICAgICAgaWYgKHJlLmxlbmd0aD09PTApe1xyXG4gICAgICBcdFx0ICAgICAgcmU9W3t1c2VyaWQ6YSxtb3ZpZWlkOk1hdGgucm91bmQoTWF0aC5yYW5kb20oKSoxMDAwMCksc2NvcmU6OTl9XVxyXG4gICAgICBcdCAgICAgIH1cclxuICAgICAgXHQgICAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgYmUgdGhlIHJhdGluZ3MgZnJvbSBlYWNoIHBlcnNvbiEhJyxyZSk7XHJcblxyXG4gICAgICAgICAgICAgIHBlb3BsZS5wdXNoKHJlLm1hcChmdW5jdGlvbihhKXtyZXR1cm4gW2EudXNlcmlkLGEubW92aWVpZCxhLnNjb3JlXTt9KSk7XHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgaWYgKHBlb3BsZS5sZW5ndGg9PT1wZW9wbGVJZC5sZW5ndGgpe1xyXG4gICAgICAgICAgICAgICAgdmFyIGZpbmFsID0ge307XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGJlIHBlb3BsZScsIHBlb3BsZSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBlb3BsZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICBpZiAocGVvcGxlW2ldWzBdIT09dW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgICAgICAgICBmaW5hbFtrZXlJZFtwZW9wbGVbaV1bMF1bMF1dXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgcGVvcGxlW2ldLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICBmaW5hbFtrZXlJZFtwZW9wbGVbaV1bMF1bMF1dXS5wdXNoKFtdKTtcclxuICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHogPSAxOyB6IDwgcGVvcGxlW2ldW3hdLmxlbmd0aDsgeisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbmFsW2tleUlkW3Blb3BsZVtpXVswXVswXV1dW3hdLnB1c2gocGVvcGxlW2ldW3hdW3pdKVxyXG4gICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdmaW5hbCcsZmluYWwsdXNlcnNSYXRpbmdzKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgY29tcGFyaXNvbnM9e307XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gZmluYWwpe1xyXG4gICAgICAgICAgICAgICAgICBjb21wYXJpc29uc1trZXldPWNvbXAodXNlcnNSYXRpbmdzLGZpbmFsW2tleV0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhjb21wYXJpc29ucyk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ5RmluYWw9W107XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gY29tcGFyaXNvbnMpe1xyXG4gICAgICAgICAgICAgICAgICB2ZXJ5RmluYWwucHVzaChba2V5LGNvbXBhcmlzb25zW2tleV1dKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codmVyeUZpbmFsKTtcclxuICAgICAgICAgICAgICAgIHJlcy5zZW5kKHZlcnlGaW5hbCk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgfSlcclxufTtcclxuIl19
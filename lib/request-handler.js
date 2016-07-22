//////////////////
///////////////The algorithm
/////////////////////
var helper= function(num1,num2){
var diff=Math.abs(num1-num2);
return 10-diff;
}

var comp = function(first, second) {
var final= []
  for (var i = 0; i< first.length; i++) {

    for (var x = 0; x < second.length; x++) {

      if (first[i][0] === second[x][0]) {

    final.push(helper(first[i][1],second[x][1]))

      }
    }
  }
var sum= final.reduce(function(a,b){return a+b},0);
return 10*sum/final.length +'%'
}
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
  password: "12345",
  database: "MainDatabase"
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

/////////////////
////user auth
/////////////////


exports.signupUser = function(req, res) {
	console.log('calling login', req.body);
	console.log('this is the session',req.session)
  new User({ username: req.body.name }).fetch().then(function(found) {
	  if (found) {
	  	//check password
	  	   //if (password matches)
	  	   //{ add sessions and redirect}
	    res.redirect('/signup');
	  } else {
	  	console.log('creating user');
	    Users.create({
	      username: req.body.name,
	      password: req.body.password,
	    })
	    .then(function(user) {
		  	console.log('created a new user');
		  	
	      res.redirect('/login');
	    });
	  }
	});
};


exports.sendWatchRequest = function(req, response) {
	console.log('req.body',req.body);

var request = {requestor: req.mySession.user, requestee: req.body.requestee};

con.query('INSERT INTO friendRequests SET ?', request, function(err,res){
  if(err) throw err;
  console.log('Last insert ID:', res.insertId);
  response.send('Thats my style!');
});

}


exports.sendRequest = function(req, response) {
  console.log('this is what Im getting', req.body);
  if (req.mySession.user===req.body.name){
    response.send("you can't friend yourself!")
  } else {

var request = {requestor: req.mySession.user, requestee: req.body.name };

con.query('INSERT INTO friendRequests SET ?', request, function(err,res){
  if(err) throw err;
  console.log('Last insert ID:', res.insertId);
  response.send('Thats my style!!!');
});

 }
};

exports.listRequests = function(req, response) {
  var request = req.mySession.user

  con.query('Select * FROM friendRequests WHERE requestee= ?', request, function(err,res){
  if(err) throw err;
  console.log(res)
  response.send(res);
});


};

exports.accept = function(req, response) {
 var requestor=req.body.personToAccept;
 var requestee=req.mySession.user;
con.query('DELETE FROM friendRequests WHERE requestor = '+'"'+ requestor+'"'+' AND requestee='+'"'+ requestee+'"', function(err, res) {
        if (err) throw err;
        console.log('Last insert ID:', res.insertId);
    
      });

  con.query('SELECT id FROM users WHERE username = ?', req.body.personToAccept, function(err, res) {
    if (err) throw err;
    console.log('Last insert ID:', res[0].id, err);
    var person1 = res[0].id;
    con.query('SELECT id FROM users WHERE username = ?', req.mySession.user, function(err, resp) {
      if (err) throw err;
      console.log('Last insert ID:', resp[0].id, err);

      var person2 = resp[0].id;
      var request = {
        user1id: person1,
        user2id: person2
      }
      var request2 = {
        user1id: person2,
        user2id: person1
      }

      console.log('the requests:::',request,request2)
      con.query('INSERT INTO relations SET ?', request, function(err, res) {
        if (err) throw err;
        console.log('Last insert ID:', res.insertId);


con.query('INSERT INTO relations SET ?', request2, function(err, res) {
        if (err) throw err;
        console.log('Last insert ID:', res.insertId);

        response.send('Thats my style!!!');
      })
      });
    })
  })
};



exports.getThisFriendsMovies=function(req,response){

  var movies=[];
  console.log(req.body.specificFriend);
  var person=req.body.specificFriend
  var id=null
  var len=null;
  con.query('SELECT id FROM users WHERE username = ?', person, function(err, resp){
console.log(resp)
id=resp[0].id;


con.query('SELECT * FROM ratings WHERE userid = ?', id ,function(err,resp){
console.log('errrrrrrrr',err,resp.length)
len=resp.length;
resp.forEach(function(a){

con.query('SELECT title FROM movies WHERE id = ?', a.movieid ,function(err,resp){
  console.log(resp)
movies.push([resp[0].title,a.score,a.review])
console.log(movies)
if (movies.length===len){
  response.send(movies);
}
})

})

})


  }

)}

exports.findMovieBuddies=function(req,response){
  console.log("you're trying to find buddies!!");
con.query('SELECT * FROM users',function(err,resp){
  var people=resp.map(function(a){return a.username})
  var Ids= resp.map(function(a){return a.id})
  var idKeyObj={}
for (var i=0;i<Ids.length;i++){
  idKeyObj[Ids[i]]=people[i]
}
console.log('current user',req.mySession.user);
var currentUser=req.mySession.user


 var obj1={};
  for (var i=0;i<Ids.length;i++){
obj1[idKeyObj[Ids[i]]]=[];
  }

  con.query('SELECT score,movieid,userid FROM ratings',function(err,respon){
  
for (var i=0;i<respon.length;i++){
  obj1[idKeyObj[respon[i].userid]].push([respon[i].movieid,respon[i].score])
}

console.log('obj1',obj1);
currentUserInfo=obj1[currentUser]
//console.log('currentUserInfo',currentUserInfo)
var comparisons={}

for (var key in obj1){
  if (key!==currentUser) {
    comparisons[key]=comp(currentUserInfo,obj1[key])
  }
}
console.log(comparisons)
var finalSend=[]
for (var key in comparisons){
  if (comparisons[key] !== 'NaN%') {
  finalSend.push([key,comparisons[key]]);
} else  {
  finalSend.push([key,"No Comparison to Make"])
}

}

  response.send(finalSend)
})
})
}


exports.decline=function(req,response){
  var requestor=req.body.personToDecline;
 var requestee=req.mySession.user;

 con.query('DELETE FROM friendRequests WHERE requestor = '+'"'+ requestor+'"'+' AND requestee='+'"'+ requestee+'"', function(err, res) {
        if (err) throw err;
        console.log('Last insert ID:', res.insertId);
      response.send(requestor + 'deleted');
      });
}





exports.signinUser = function(req, res) {
	console.log('calling signin', req.body);
	new User({ username: req.body.name }).fetch().then(function(found){

		if (found){
			new User({ username: req.body.name, password:req.body.password}).fetch().then(function(found){
				if (found){
					req.mySession.user = found.attributes.username;
          console.log(found.attributes.username)
					console.log('we found you!!')
					res.send('it worked');
				} else {
					console.log('sorry, no match!!!')
				}
			})
		} else {
			console.log('no such user')
		}

  }) 

}

exports.logout = function(req, res) {
	req.mySession.destroy(function(err){
		console.log(err);
	});
	console.log('logout');
	res.send('logout');
}


/////////////////////
/////movie handlers
/////////////////////

//a handeler that takes a rating from user and add it to the database
// expects req.body to have this: {title: 'name', genre: 'genre', poster: 'link', release_date: 'year', rating: 'number'}
exports.rateMovie = function(req, res) {
	console.log('calling rateMovie');
	var userid;
	return new User({ username: req.mySession.user }).fetch()
	.then(function(foundUser) {
		userid = foundUser.attributes.id;
		return new Rating({ movieid: req.body.id, userid: userid }).fetch()
		.then(function(foundRating) {
			if (foundRating) {
				//since rating or review is updated seperatly in client, the following
				//make sure it gets updated according to the req
				// console.log('update rating', foundRating)
				if (req.body.rating) {
					var ratingObj = {score: req.body.rating};
				} else if (req.body.review) {
					var ratingObj = {review: req.body.review};
				}
				return new Rating({'id': foundRating.attributes.id})
					.save(ratingObj);
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
	})
	.then(function(newRating) {
		console.log('rating created:', newRating.attributes);
  	res.status(201).send('rating recieved');
	})
};

//this helper function adds the movie into database
//it follows the same movie id as TMDB
//expects req.body to have these atribute : {id, title, genre, poster_path, release_date, overview, vote_average}
var addOneMovie = function(movieObj) {
	var genre = (movieObj.genre_ids) ? genres[movieObj.genre_ids[0]] : 'n/a';
  return new Movie({
  	id: movieObj.id,
    title: movieObj.title,
    genre: genre,
    poster: 'https://image.tmdb.org/t/p/w185/' + movieObj.poster_path,
    release_date: movieObj.release_date,
    description: movieObj.overview.slice(0, 255),
    imdbRating: movieObj.vote_average
  }).save(null, {method: 'insert'})
  .then(function(newMovie) {
  	console.log('movie created', newMovie.attributes.title);
  	return newMovie;
  })
};


//get all movie ratings that a user rated
//should return an array that look like the following:
// [ {title: 'name', genre: 'genre' , poster: 'url', release_date: 'date', score: n, friendAverageRating: n} ... ]
// expects req.mySession.user as input
exports.getUserRatings = function(req, res) {
	console.log('getUserRatings');
  Rating.query(function(qb){
  	qb.innerJoin('users', 'ratings.userid', '=', 'users.id');
  	qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
  	qb.select('users.username', 'movies.title', 'movies.id', 'movies.genre', 'movies.poster', 'movies.release_date', 'movies.imdbRating', 'movies.description', 'ratings.score', 'ratings.review');
  	qb.where('users.username', '=', req.mySession.user);
  	qb.orderBy('updated_at', 'DESC')
  })
  .fetchAll()
  //this fetch all user ratings
  //but the ratings doesn't have friend average rating yet, the following adds it
  .then(function(ratings){
  	console.log('ratingss', ratings.models);
		return Promise.map(ratings.models, function(rating) {
			console.log('rating.attributes: ', rating);
			return exports.getFriendRatings(req.mySession.user, rating)
			.then(function(friendsRatings){
				//if friendsRatings is null, Rating.attributes.friendAverageRating is null
				if (!friendsRatings) {
					rating.attributes.friendAverageRating = null;
				} else {
					rating.attributes.friendAverageRating = averageRating(friendsRatings);
				}
				return rating;
			})
		})
  })
  .then(function(ratings) {
  	console.log('retriving all user ratings');
  	res.status(200).json(ratings);
  })
};

//this is a wraper function for getFriendRatings which will sent the client all of the friend ratings
exports.handleGetFriendRatings = function(req, res) {
	console.log('handleGetFriendRatings');
	exports.getFriendRatings(req.mySession.user, {attributes: req.body.movie})
	.then(function(friendRatings){
		res.json(friendRatings);
	});
}

//this function outputs ratings of a user's friend for a particular movie
//expect current username and movieTitle as input
//outputs: {user2id: 'id', friendUserName:'name', friendFirstName:'name', title:'movieTitle', score:n }
exports.getFriendRatings = function(username, movieObj) {
	return User.query(function(qb){
		qb.innerJoin('relations', 'relations.user1id', '=', 'users.id');
		qb.innerJoin('ratings', 'ratings.userid', '=', 'relations.user2id');
		qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
		qb.select('relations.user2id', 'movies.title', 'ratings.score');
		qb.where({
			'users.username': username, 
			'movies.title': movieObj.attributes.title,
			'movies.id': movieObj.attributes.id });
	})
	.fetchAll()
	.then(function(friendsRatings){
	//the following block adds the friendName attribute to the ratings
		return Promise.map(friendsRatings.models, function(friendRating) {
			return new User({ id: friendRating.attributes.user2id }).fetch()
			.then(function(friend){
				friendRating.attributes.friendUserName = friend.attributes.username;
				friendRating.attributes.friendFirstName = friend.attributes.firstName;
				return friendRating;
			});
		});
	})
	.then(function(friendsRatings){
		return friendsRatings;
	});
};


//a helper function that averages the rating
//inputs ratings, outputs the average score;
var averageRating = function(ratings) {
	//return null if no friend has rated the movie
	if (ratings.length === 0) {
		return null;
	}
	return ratings
	.reduce(function(total, rating){
		return total += rating.attributes.score;
	}, 0) / ratings.length;
}


//a helper function that outputs user rating and average friend rating for one movie
//outputs one rating obj: {title: 'name', genre: 'genre' , poster: 'url', release_date: 'date', score: n, friendAverageRating: n}
var getOneMovieRating = function(username, movieObj) {
  return Rating.query(function(qb){
  	qb.innerJoin('users', 'ratings.userid', '=', 'users.id');
  	qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
  	qb.select('users.username', 'movies.title', 'movies.id', 'movies.genre', 'movies.poster', 'movies.release_date', 'movies.imdbRating', 'movies.description', 'ratings.score', 'ratings.review');
  	qb.where({'users.username': username, 'movies.title': movieObj.title, 'movies.id': movieObj.id});
  })
  .fetch()
  .then(function(rating){
	  if (!rating) {
	  	//if the user has not rated the movie, return an obj that has the movie information, but score is set to null
	  	return new Movie({title: movieObj.title, id: movieObj.id}).fetch()
	  	.then(function(movie) {
	  		movie.attributes.score = null;
	  		return movie;
	  	})
	  } else {
	  	return rating;
	  }
	})
	.then(function(rating){
		return exports.getFriendRatings(username, rating)
		.then(function(friendsRatings){
			// console.log('friendsRatings', friendsRatings);
			rating.attributes.friendAverageRating = averageRating(friendsRatings);
			console.log('added average friend rating', rating.attributes.title, rating.attributes.friendAverageRating);
			return rating;
		});
	});
}


//this handler is specifically for sending out a list of movie ratings when the client sends a list of movie to the server
//expects req.body to be an array of obj with these attributes: {id, title, genre, poster_path, release_date, overview, vote_average}
//outputs [ {title: 'name', genre: 'genre' , poster: 'url', release_date: 'date', score: n, friendAverageRating: n} ... ]
exports.getMultipleMovieRatings = function(req, res) {
	console.log('getMultipleMovieRatings');
	Promise.map(req.body.movies, function(movie) {
		//first check whether movie is in the database
		return new Movie({title: movie.title, id: movie.id}).fetch()
		.then(function(foundMovie) {
			//if not create one
			if (!foundMovie) {
				return addOneMovie(movie);
			} else {
				return foundMovie;
			}
		})
		.then(function(foundMovie){
			// console.log('found movie', foundMovie);
			return getOneMovieRating(req.mySession.user, foundMovie.attributes);
		})
	})
	.then(function(ratings){
		console.log('sending rating to client');
		res.json(ratings);
	})
}

//this handler sends an get request to TMDB API to retrive recent titles
//we cannot do it in the front end because cross origin request issues
exports.getRecentRelease = function(req, res) {
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
	})
	.on('data',function(chunk){
		data += chunk;
	})
	.on('end', function(){
		recentMovies = JSON.parse(data);
    req.body.movies = recentMovies.results;
    //transfers the movie data to getMultipleMovieRatings to decorate with score (user rating) and avgfriendRating attribute
    exports.getMultipleMovieRatings(req, res);

	})
	.on('error', function(error){
		console.log(error);
	})

}

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
exports.searchRatedMovie = function(req, res) {
  return Rating.query(function(qb){
		qb.innerJoin('users', 'ratings.userid', '=', 'users.id');
		qb.innerJoin('movies', 'ratings.movieid', '=', 'movies.id');
		qb.select('users.username', 'movies.title', 'movies.id', 'movies.genre', 'movies.poster', 'movies.release_date', 'movies.imdbRating', 'movies.description', 'ratings.score', 'ratings.review');
  	qb.whereRaw(`MATCH (movies.title) AGAINST ('${req.query.title}' IN NATURAL LANGUAGE MODE)`)
  	qb.andWhere('users.username', '=', req.mySession.user)
  	qb.orderBy('updated_at', 'DESC')
  })
  .fetchAll()
  .then(function(matches){
  	console.log(matches.models);
  	res.json(matches);
  })
}

////////////////////////
/////friendship handlers
////////////////////////

//this would send a notice to the user who receive the friend request, prompting them to accept or deny the request
exports.addFriend = function(req, res) {

};


//this would confirm the friendship and establish the relationship in the database
exports.confirmFriendship = function(req, res) {

};



exports.getFriends = function(req, res) {
  var peopleId=[]
console.log('user',req.mySession.user)
var id=req.mySession.user
con.query('SELECT id FROM users WHERE username = ?', id ,function(err,resp){
  var userid=resp[0].id;
con.query('SELECT * FROM relations WHERE user1id = ?', userid ,function(err,resp){
  
  for (var i=0; i<resp.length;i++){
    if (peopleId.indexOf(resp[i].user2id)===-1){
    peopleId.push(resp[i].user2id);
  }

  }
  var people=[]
peopleId.forEach(function(a){
con.query('SELECT username FROM users WHERE id = ?', a ,function(err,resp){
people.push(resp[0].username)
if (people.length===peopleId.length) {
  console.log(people)
  res.send(people)
}

})
});

})

})
};


//TBD
exports.getHighCompatibilityUsers = function(req, res) {
  
};


//TBD
exports.getRecommendedMovies = function(req, res) {

};
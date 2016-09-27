
var handler = require('./lib/request-handler.js');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sessions = require("client-sessions");
var cors = require('cors');

app.get('*', function(req,res,next) {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    res.redirect('https://' + req.hostname + req.url);
  } else {
    next();
  }
});

app.use(cors());
app.use(sessions({
  cookieName: 'mySession', // cookie name dictates the key name added to the request object
  secret: 'blargadeeblargblarg', // should be a large unguessable string
  resave: true,
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
  saveInitialized: true
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/node_modules'));
app.use('/compiled', express.static(__dirname + '/compiled'));


app.post('/signup', handler.signupUser);
app.post('/login', handler.signinUser);
app.get('/login',function(req,res){
	console.log('loeijwfloejfelifjdp')
});

//////////////////
//Handling friends
//////////////////

//friend requests
app.post('/listRequests', handler.listRequests);
app.post('/sendRequest', handler.sendRequest);
//Friend requests
app.post('/getThisFriendsMovies',handler.getThisFriendsMovies)
app.post('/logout', handler.logout);

app.post('/sendWatchRequest',handler.sendWatchRequest)
app.delete('/sendWatchRequest', handler.removeWatchRequest)

app.post('/decline', handler.decline);
app.post('/accept', handler.accept);
app.delete('/removeRequest', handler.removeRequest)

app.post('/findMovieBuddies',handler.findMovieBuddies)
app.post('/getFriends',handler.getFriends)
app.get('/getFriendList', handler.getFriendList)


//////////////////
//Handling movies
//////////////////
app.post('/ratemovie', handler.rateMovie);
app.get('/recentRelease', handler.getRecentRelease);
app.get('/getUserRatings', handler.getUserRatings);
app.get('/getFriendUserRatings', handler.getFriendUserRatings);
app.post('/getMultipleMovieRatings', handler.getMultipleMovieRatings);
app.post('/getFriendRatings', handler.handleGetFriendRatings);
app.get('/searchRatedMovie', handler.searchRatedMovie);


var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('listening on port 3000!');
});
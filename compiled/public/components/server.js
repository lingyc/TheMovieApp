'use strict';

var handler = require('./lib/request-handler.js');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var sessions = require("client-sessions");
var cors = require('cors');

app.use(cors());
app.use(sessions({
  cookieName: 'mySession', // cookie name dictates the key name added to the request object
  secret: 'blargadeeblargblarg', // should be a large unguessable string
  resave: true,
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
  saveInitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/node_modules'));
app.use('/compiled', express.static(__dirname + '/compiled'));

app.post('/signup', handler.signupUser);
app.post('/login', handler.signinUser);
app.get('/login', function (req, res) {
  console.log('loeijwfloejfelifjdp');
});

//////////////////
//Handling friends
//////////////////

//friend requests
app.post('/listRequests', handler.listRequests);
app.post('/sendRequest', handler.sendRequest);
//Friend requests
app.post('/getThisFriendsMovies', handler.getThisFriendsMovies);
app.post('/logout', handler.logout);

app.post('/sendWatchRequest', handler.sendWatchRequest);
app.delete('/sendWatchRequest', handler.removeWatchRequest);

app.post('/decline', handler.decline);
app.post('/accept', handler.accept);
app.delete('/removeRequest', handler.removeRequest);

app.post('/findMovieBuddies', handler.findMovieBuddies);
app.post('/getFriends', handler.getFriends);
app.get('/getFriendList', handler.getFriendList);

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
  console.log('Example app listening on port 3000!');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL3NlcnZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLElBQUksVUFBVSxRQUFRLDBCQUFSLENBQWQ7QUFDQSxJQUFJLFVBQVUsUUFBUSxTQUFSLENBQWQ7QUFDQSxJQUFJLE1BQU0sU0FBVjtBQUNBLElBQUksYUFBYSxRQUFRLGFBQVIsQ0FBakI7QUFDQSxJQUFJLFdBQVcsUUFBUSxpQkFBUixDQUFmO0FBQ0EsSUFBSSxPQUFPLFFBQVEsTUFBUixDQUFYOztBQUVBLElBQUksR0FBSixDQUFRLE1BQVI7QUFDQSxJQUFJLEdBQUosQ0FBUSxTQUFTO0FBQ2YsY0FBWSxXQURHLEVBQ1U7QUFDekIsVUFBUSxxQkFGTyxFQUVnQjtBQUMvQixVQUFRLElBSE87QUFJZixZQUFVLEtBQUssRUFBTCxHQUFVLEVBQVYsR0FBZSxJQUpWLEVBSWdCO0FBQy9CLGtCQUFnQixPQUFPLEVBQVAsR0FBWSxDQUxiLEVBS2dCO0FBQy9CLG1CQUFpQjtBQU5GLENBQVQsQ0FBUjs7QUFTQSxJQUFJLEdBQUosQ0FBUSxXQUFXLFVBQVgsQ0FBc0IsRUFBQyxVQUFVLElBQVgsRUFBdEIsQ0FBUjtBQUNBLElBQUksR0FBSixDQUFRLFdBQVcsSUFBWCxFQUFSO0FBQ0EsSUFBSSxHQUFKLENBQVEsUUFBUSxNQUFSLENBQWUsWUFBWSxTQUEzQixDQUFSO0FBQ0EsSUFBSSxHQUFKLENBQVEsVUFBUixFQUFvQixRQUFRLE1BQVIsQ0FBZSxZQUFZLGVBQTNCLENBQXBCO0FBQ0EsSUFBSSxHQUFKLENBQVEsV0FBUixFQUFxQixRQUFRLE1BQVIsQ0FBZSxZQUFZLFdBQTNCLENBQXJCOztBQUVBLElBQUksSUFBSixDQUFTLFNBQVQsRUFBb0IsUUFBUSxVQUE1QjtBQUNBLElBQUksSUFBSixDQUFTLFFBQVQsRUFBbUIsUUFBUSxVQUEzQjtBQUNBLElBQUksR0FBSixDQUFRLFFBQVIsRUFBaUIsVUFBUyxHQUFULEVBQWEsR0FBYixFQUFpQjtBQUNqQyxVQUFRLEdBQVIsQ0FBWSxxQkFBWjtBQUNBLENBRkQ7O0FBSUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBSSxJQUFKLENBQVMsZUFBVCxFQUEwQixRQUFRLFlBQWxDO0FBQ0EsSUFBSSxJQUFKLENBQVMsY0FBVCxFQUF5QixRQUFRLFdBQWpDO0FBQ0E7QUFDQSxJQUFJLElBQUosQ0FBUyx1QkFBVCxFQUFpQyxRQUFRLG9CQUF6QztBQUNBLElBQUksSUFBSixDQUFTLFNBQVQsRUFBb0IsUUFBUSxNQUE1Qjs7QUFFQSxJQUFJLElBQUosQ0FBUyxtQkFBVCxFQUE2QixRQUFRLGdCQUFyQztBQUNBLElBQUksTUFBSixDQUFXLG1CQUFYLEVBQWdDLFFBQVEsa0JBQXhDOztBQUVBLElBQUksSUFBSixDQUFTLFVBQVQsRUFBcUIsUUFBUSxPQUE3QjtBQUNBLElBQUksSUFBSixDQUFTLFNBQVQsRUFBb0IsUUFBUSxNQUE1QjtBQUNBLElBQUksTUFBSixDQUFXLGdCQUFYLEVBQTZCLFFBQVEsYUFBckM7O0FBRUEsSUFBSSxJQUFKLENBQVMsbUJBQVQsRUFBNkIsUUFBUSxnQkFBckM7QUFDQSxJQUFJLElBQUosQ0FBUyxhQUFULEVBQXVCLFFBQVEsVUFBL0I7QUFDQSxJQUFJLEdBQUosQ0FBUSxnQkFBUixFQUEwQixRQUFRLGFBQWxDOztBQUdBO0FBQ0E7QUFDQTtBQUNBLElBQUksSUFBSixDQUFTLFlBQVQsRUFBdUIsUUFBUSxTQUEvQjtBQUNBLElBQUksR0FBSixDQUFRLGdCQUFSLEVBQTBCLFFBQVEsZ0JBQWxDO0FBQ0EsSUFBSSxHQUFKLENBQVEsaUJBQVIsRUFBMkIsUUFBUSxjQUFuQztBQUNBLElBQUksR0FBSixDQUFRLHVCQUFSLEVBQWlDLFFBQVEsb0JBQXpDO0FBQ0EsSUFBSSxJQUFKLENBQVMsMEJBQVQsRUFBcUMsUUFBUSx1QkFBN0M7QUFDQSxJQUFJLElBQUosQ0FBUyxtQkFBVCxFQUE4QixRQUFRLHNCQUF0QztBQUNBLElBQUksR0FBSixDQUFRLG1CQUFSLEVBQTZCLFFBQVEsZ0JBQXJDOztBQUdBLElBQUksT0FBTyxRQUFRLEdBQVIsQ0FBWSxJQUFaLElBQW9CLElBQS9CO0FBQ0EsSUFBSSxNQUFKLENBQVcsSUFBWCxFQUFpQixZQUFZO0FBQzNCLFVBQVEsR0FBUixDQUFZLHFDQUFaO0FBQ0QsQ0FGRCIsImZpbGUiOiJzZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbnZhciBoYW5kbGVyID0gcmVxdWlyZSgnLi9saWIvcmVxdWVzdC1oYW5kbGVyLmpzJyk7XG52YXIgZXhwcmVzcyA9IHJlcXVpcmUoJ2V4cHJlc3MnKTtcbnZhciBhcHAgPSBleHByZXNzKCk7XG52YXIgYm9keVBhcnNlciA9IHJlcXVpcmUoJ2JvZHktcGFyc2VyJyk7XG52YXIgc2Vzc2lvbnMgPSByZXF1aXJlKFwiY2xpZW50LXNlc3Npb25zXCIpO1xudmFyIGNvcnMgPSByZXF1aXJlKCdjb3JzJyk7XG5cbmFwcC51c2UoY29ycygpKTtcbmFwcC51c2Uoc2Vzc2lvbnMoe1xuICBjb29raWVOYW1lOiAnbXlTZXNzaW9uJywgLy8gY29va2llIG5hbWUgZGljdGF0ZXMgdGhlIGtleSBuYW1lIGFkZGVkIHRvIHRoZSByZXF1ZXN0IG9iamVjdFxuICBzZWNyZXQ6ICdibGFyZ2FkZWVibGFyZ2JsYXJnJywgLy8gc2hvdWxkIGJlIGEgbGFyZ2UgdW5ndWVzc2FibGUgc3RyaW5nXG4gIHJlc2F2ZTogdHJ1ZSxcbiAgZHVyYXRpb246IDI0ICogNjAgKiA2MCAqIDEwMDAsIC8vIGhvdyBsb25nIHRoZSBzZXNzaW9uIHdpbGwgc3RheSB2YWxpZCBpbiBtc1xuICBhY3RpdmVEdXJhdGlvbjogMTAwMCAqIDYwICogNSwgLy8gaWYgZXhwaXJlc0luIDwgYWN0aXZlRHVyYXRpb24sIHRoZSBzZXNzaW9uIHdpbGwgYmUgZXh0ZW5kZWQgYnkgYWN0aXZlRHVyYXRpb24gbWlsbGlzZWNvbmRzXG4gIHNhdmVJbml0aWFsaXplZDogdHJ1ZVxufSkpO1xuXG5hcHAudXNlKGJvZHlQYXJzZXIudXJsZW5jb2RlZCh7ZXh0ZW5kZWQ6IHRydWV9KSk7XG5hcHAudXNlKGJvZHlQYXJzZXIuanNvbigpKTtcbmFwcC51c2UoZXhwcmVzcy5zdGF0aWMoX19kaXJuYW1lICsgJy9wdWJsaWMnKSk7XG5hcHAudXNlKCcvc2NyaXB0cycsIGV4cHJlc3Muc3RhdGljKF9fZGlybmFtZSArICcvbm9kZV9tb2R1bGVzJykpO1xuYXBwLnVzZSgnL2NvbXBpbGVkJywgZXhwcmVzcy5zdGF0aWMoX19kaXJuYW1lICsgJy9jb21waWxlZCcpKTtcblxuYXBwLnBvc3QoJy9zaWdudXAnLCBoYW5kbGVyLnNpZ251cFVzZXIpO1xuYXBwLnBvc3QoJy9sb2dpbicsIGhhbmRsZXIuc2lnbmluVXNlcik7XG5hcHAuZ2V0KCcvbG9naW4nLGZ1bmN0aW9uKHJlcSxyZXMpe1xuXHRjb25zb2xlLmxvZygnbG9laWp3ZmxvZWpmZWxpZmpkcCcpXG59KVxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vSGFuZGxpbmcgZnJpZW5kc1xuLy8vLy8vLy8vLy8vLy8vLy8vXG5cbi8vZnJpZW5kIHJlcXVlc3RzXG5hcHAucG9zdCgnL2xpc3RSZXF1ZXN0cycsIGhhbmRsZXIubGlzdFJlcXVlc3RzKTtcbmFwcC5wb3N0KCcvc2VuZFJlcXVlc3QnLCBoYW5kbGVyLnNlbmRSZXF1ZXN0KTtcbi8vRnJpZW5kIHJlcXVlc3RzXG5hcHAucG9zdCgnL2dldFRoaXNGcmllbmRzTW92aWVzJyxoYW5kbGVyLmdldFRoaXNGcmllbmRzTW92aWVzKVxuYXBwLnBvc3QoJy9sb2dvdXQnLCBoYW5kbGVyLmxvZ291dCk7XG5cbmFwcC5wb3N0KCcvc2VuZFdhdGNoUmVxdWVzdCcsaGFuZGxlci5zZW5kV2F0Y2hSZXF1ZXN0KVxuYXBwLmRlbGV0ZSgnL3NlbmRXYXRjaFJlcXVlc3QnLCBoYW5kbGVyLnJlbW92ZVdhdGNoUmVxdWVzdClcblxuYXBwLnBvc3QoJy9kZWNsaW5lJywgaGFuZGxlci5kZWNsaW5lKTtcbmFwcC5wb3N0KCcvYWNjZXB0JywgaGFuZGxlci5hY2NlcHQpO1xuYXBwLmRlbGV0ZSgnL3JlbW92ZVJlcXVlc3QnLCBoYW5kbGVyLnJlbW92ZVJlcXVlc3QpXG5cbmFwcC5wb3N0KCcvZmluZE1vdmllQnVkZGllcycsaGFuZGxlci5maW5kTW92aWVCdWRkaWVzKVxuYXBwLnBvc3QoJy9nZXRGcmllbmRzJyxoYW5kbGVyLmdldEZyaWVuZHMpXG5hcHAuZ2V0KCcvZ2V0RnJpZW5kTGlzdCcsIGhhbmRsZXIuZ2V0RnJpZW5kTGlzdClcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vSGFuZGxpbmcgbW92aWVzXG4vLy8vLy8vLy8vLy8vLy8vLy9cbmFwcC5wb3N0KCcvcmF0ZW1vdmllJywgaGFuZGxlci5yYXRlTW92aWUpO1xuYXBwLmdldCgnL3JlY2VudFJlbGVhc2UnLCBoYW5kbGVyLmdldFJlY2VudFJlbGVhc2UpO1xuYXBwLmdldCgnL2dldFVzZXJSYXRpbmdzJywgaGFuZGxlci5nZXRVc2VyUmF0aW5ncyk7XG5hcHAuZ2V0KCcvZ2V0RnJpZW5kVXNlclJhdGluZ3MnLCBoYW5kbGVyLmdldEZyaWVuZFVzZXJSYXRpbmdzKTtcbmFwcC5wb3N0KCcvZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MnLCBoYW5kbGVyLmdldE11bHRpcGxlTW92aWVSYXRpbmdzKTtcbmFwcC5wb3N0KCcvZ2V0RnJpZW5kUmF0aW5ncycsIGhhbmRsZXIuaGFuZGxlR2V0RnJpZW5kUmF0aW5ncyk7XG5hcHAuZ2V0KCcvc2VhcmNoUmF0ZWRNb3ZpZScsIGhhbmRsZXIuc2VhcmNoUmF0ZWRNb3ZpZSk7XG5cblxudmFyIHBvcnQgPSBwcm9jZXNzLmVudi5QT1JUIHx8IDMwMDA7XG5hcHAubGlzdGVuKHBvcnQsIGZ1bmN0aW9uICgpIHtcbiAgY29uc29sZS5sb2coJ0V4YW1wbGUgYXBwIGxpc3RlbmluZyBvbiBwb3J0IDMwMDAhJyk7XG59KTsiXX0=
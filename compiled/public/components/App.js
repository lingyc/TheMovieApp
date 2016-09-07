'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.state = {
      view: 'Login',
      friendsRatings: [],
      movie: null,
      friendRequests: [],
      pendingFriendRequests: [],
      myFriends: [],
      friendToFocusOn: '',
      individualFriendsMovies: [],
      potentialMovieBuddies: {},
      username: null,
      requestResponses: [],
      currentUser: null,
      requestsOfCurrentUser: []
    };
    return _this;
  }

  _createClass(App, [{
    key: 'getCurrentFriends',
    value: function getCurrentFriends() {
      var _this2 = this;

      console.log('testinggg');
      $.post(Url + '/getFriends', { test: 'info' }, function (a, b) {
        console.log('what you get back from server for get friends', a, b);
        for (var i = 0; i < a.length; i++) {
          if (a[i][1] === null) {
            a[i][1] = "No comparison to be made";
          }
        }

        var final = a.sort(function (a, b) {
          return b[1] - a[1];
        });
        _this2.setState({
          myFriends: final
        });
        console.log('thes are my friends!!!!!!!!!!!!!!!!!', _this2.state.myFriends);
      });
    }
  }, {
    key: 'acceptFriend',
    value: function acceptFriend(personToAccept, movie) {
      var _this3 = this;

      // $('button').on('click',function() {
      //   console.log($(this).html());
      // })
      // console.log(final +'should be accepted, for movie....', movie)

      $.post(Url + '/accept', { personToAccept: personToAccept, movie: movie }, function (resp, err) {
        _this3.listPendingFriendRequests();
      });

      console.log('refreshed inbox, should delete friend request on the spot instead of moving');
    }
  }, {
    key: 'declineFriend',
    value: function declineFriend(personToDecline, movie) {
      var _this4 = this;

      $.post(Url + '/decline', { personToDecline: personToDecline, movie: movie }, function (resp, err) {
        console.log('this is the state after declining friend, ', _this4.state);
        _this4.listPendingFriendRequests();
      });
    }
  }, {
    key: 'findMovieBuddies',
    value: function findMovieBuddies() {
      var _this5 = this;

      $.post(Url + '/findMovieBuddies', { dummy: 'info' }, function (resp, err) {
        var sorted = resp.sort(function (a, b) {
          return b[1] - a[1];
        });
        var myFriends = _this5.state.myFriends;
        var uniqueFriends = [];
        for (var i = 0; i < sorted.length; i++) {
          var unique = true;
          for (var x = 0; x < myFriends.length; x++) {
            if (sorted[i][0] === myFriends[x][0]) {
              unique = false;
            }
          }
          if (unique) {
            uniqueFriends.push(sorted[i]);
          }
        }

        _this5.setState({
          view: "FNMB",
          potentialMovieBuddies: uniqueFriends
        });

        console.log(_this5.state.myFriends, _this5.state.potentialMovieBuddies);
      });
    }
  }, {
    key: 'changeView',
    value: function changeView() {
      this.setState({
        view: "SignUp"
      });
    }
  }, {
    key: 'setCurrentUser',
    value: function setCurrentUser(username) {
      console.log('calling setCurrentUser');
      this.setState({
        currentUser: username
      });
    }
  }, {
    key: 'enterNewUser',
    value: function enterNewUser(name, password) {
      var _this6 = this;

      console.log(name, password);
      $.post(Url + '/signup', { name: name, password: password }).then(function () {
        console.log('success');
        _this6.setState({ username: name, view: "Home" });
      }).catch(function () {
        console.log('error');
      });
    }
  }, {
    key: 'getFriendMovieRatings',
    value: function getFriendMovieRatings() {
      var _this7 = this;

      var movieName = document.getElementById("movieToView").value;
      $.post(Url + '/getFriendRatings', { name: movieName }).then(function (response) {
        _this7.setState({
          view: "Home",
          friendsRatings: response
        });
        console.log('our response', _this7.state.friendsRatings);
      }).catch(function (err) {
        console.log(err);
      });
    }
  }, {
    key: 'logout',
    value: function logout() {
      var _this8 = this;

      $.post(Url + '/logout').then(function (response) {
        console.log(response);
        _this8.setState({
          view: "Login",
          friendsRatings: [],
          movie: null,
          friendRequests: [],
          pendingFriendRequests: [],
          myFriends: [],
          friendToFocusOn: '',
          individualFriendsMovies: [],
          potentialMovieBuddies: {},
          username: null,
          requestResponses: [],
          currentUser: null,
          requestsOfCurrentUser: []
        });
      });
    }
  }, {
    key: 'sendWatchRequest',
    value: function sendWatchRequest(friend) {
      var movie = document.getElementById('movieToWatch').value;
      var toSend = { requestee: friend, movie: movie };
      if (movie.length) {
        $.post(Url + '/sendWatchRequest', toSend, function (resp, err) {
          console.log(resp, err);
        });
        document.getElementById('movieToWatch').value = '';
      } else {
        console.log('you need to enter a movie to send a watch request!!!!');
      }
    }

    /////////////////////
    /////movie render
    /////////////////////
    //call searchmovie function
    //which gets passed down to the Movie Search 

  }, {
    key: 'getMovie',
    value: function getMovie(query) {
      var _this9 = this;

      var options = {
        query: query
      };

      this.props.searchMovie(options, function (movie) {
        console.log(movie);
        _this9.setState({
          view: "MovieSearchView",
          movie: movie
        });
      });
    }
    //show the movie searched in friend movie list
    //onto the stateview of moviesearchview

  }, {
    key: 'showMovie',
    value: function showMovie(movie) {
      this.setState({
        movie: movie
      });
    }
    /////////////////////
    /////Nav change
    /////////////////////

  }, {
    key: 'changeViews',
    value: function changeViews(targetState) {
      console.log(this.state);

      if (targetState === 'Friends') {
        console.log('you switched to friends!!');
        this.getCurrentFriends();
        this.sendRequest();
      }

      if (targetState === 'Home') {
        this.getCurrentFriends();
        this.sendRequest();
      }

      if (targetState === "Inbox") {
        this.listPendingFriendRequests();
      }

      this.setState({
        view: targetState
      });
    }
  }, {
    key: 'changeViewsMovie',
    value: function changeViewsMovie(targetState, movie) {
      this.setState({
        view: targetState,
        movie: movie
      });
    }
  }, {
    key: 'changeViewsFriends',
    value: function changeViewsFriends(targetState, friend) {
      this.setState({
        view: targetState,
        friendToFocusOn: friend
      });
    }
  }, {
    key: 'buddyRequest',
    value: function buddyRequest(person) {
      this.sendRequest(person);
    }
  }, {
    key: 'sendRequest',
    value: function sendRequest(a) {
      var _this10 = this;

      console.log('send request is being run!!');

      if (document.getElementById('findFriendByName') !== null) {
        var person = document.getElementById('findFriendByName').value;
      } else {
        var person = a || 'test';
      }
      var currFriends = this.state.myFriends;
      var friends1 = [];
      var friends2 = [];
      for (var i = 0; i < currFriends.length; i++) {
        console.log('line 251', currFriends[i]);
        friends1.push(currFriends[i][0]);
        friends2.push(currFriends[i][0]);
      }

      for (var i = 0; i < this.state.requestsOfCurrentUser.length; i++) {
        friends1.push(this.state.requestsOfCurrentUser[i]);
      }

      console.log('this should also be my friends', person, currFriends, friends1, friends2);

      //console.log('tof',friends1.indexOf(person)!== -1, friends1.length!==0)
      if (friends1.indexOf(person) !== -1 && friends1.length !== 0) {
        $("#AlreadyReq").fadeIn(1000);
        $("#AlreadyReq").fadeOut(1000);
        console.log('this person is already in there!!');
      } else if (!person.length) {
        $("#enterRealFriend").fadeIn(1000);
        $("#enterRealFriend").fadeOut(1000);
      } else {

        console.log('person is defined?', person);
        $.post(Url + '/sendRequest', { name: person }, function (resp, err) {

          _this10.setState({
            requestsOfCurrentUser: resp.concat([person])
          });
          console.log('line 281', _this10.state.requestsOfCurrentUser);

          $("#reqSent").fadeIn(1000);
          $("#reqSent").fadeOut(1000);
        });
        if (document.getElementById('findFriendByName') !== null) {
          document.getElementById('findFriendByName').value = '';
        }
      }
    }
  }, {
    key: 'listPendingFriendRequests',
    value: function listPendingFriendRequests() {
      var _this11 = this;

      console.log('this should list friend reqs');
      $.post(Url + '/listRequests', function (response, error) {
        var pFR = [];
        var rR = [];
        console.log('response to lpfr', response);

        for (var i = 0; i < response[0].length; i++) {
          var requestor = response[0][i]['requestor'];
          var responseTU = response[0][i]['response'];
          if (requestor !== response[1] && responseTU === null) {
            pFR.push(response[0][i]);
          }
          if (requestor === response[1] && responseTU !== null && response[0][i]['requestee'] !== 'test') {
            rR.push(response[0][i]);
          }
        }

        _this11.setState({
          pendingFriendRequests: pFR,
          requestResponses: rR
        });
      });
    }
  }, {
    key: 'focusOnFriend',
    value: function focusOnFriend(friend) {
      var _this12 = this;

      this.setState({
        view: 'singleFriend',
        friendToFocusOn: friend
      });

      $.get(Url + '/getFriendUserRatings', { friendName: friend }, function (response) {
        _this12.setState({
          individualFriendsMovies: response
        });
      });
    }
  }, {
    key: 'listPotentials',
    value: function listPotentials() {
      console.log('this should list potential friends');
    }
  }, {
    key: 'removeRequest',
    value: function removeRequest(person, self, movie) {
      var that = this;
      $.ajax({
        url: Url + '/removeRequest',
        type: 'DELETE',
        data: {
          requestor: self,
          requestee: person,
          movie: movie
        },
        success: function success(response) {
          console.log('REQUEST REMOVED! Movie is: ', movie);
          that.listPendingFriendRequests();
        },
        error: function error(_error) {
          console.log(_error);
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this13 = this;

      if (this.state.view === 'Login') {
        return React.createElement(LogIn, { changeViews: this.changeViews.bind(this), setCurrentUser: this.setCurrentUser.bind(this) });
      } else if (this.state.view === "SignUp") {
        return React.createElement(SignUp, { changeViews: this.changeViews.bind(this), setCurrentUser: this.setCurrentUser.bind(this) });
      }
      //this view is added for moviesearch rendering
      else if (this.state.view === "MovieSearchView") {
          return React.createElement(
            'div',
            null,
            React.createElement(
              'div',
              null,
              React.createElement(Nav, { name: this.state.currentUser,
                find: this.findMovieBuddies.bind(this),
                onClick: this.changeViews.bind(this),
                logout: this.logout.bind(this)
              })
            ),
            React.createElement(
              'div',
              null,
              React.createElement(MovieRating, {
                handleSearchMovie: this.getMovie.bind(this),
                movie: this.state.movie
              })
            )
          );
        } else if (this.state.view === "Inbox") {
          return React.createElement(
            'div',
            null,
            React.createElement(Nav, { name: this.state.currentUser,
              find: this.findMovieBuddies.bind(this),
              onClick: this.changeViews.bind(this),
              logout: this.logout.bind(this),
              Home: true
            }),
            React.createElement(Inbox, {
              requests: this.state.pendingFriendRequests,
              responsesAnswered: this.state.requestResponses,
              logout: this.logout.bind(this),
              accept: this.acceptFriend.bind(this),
              decline: this.declineFriend.bind(this),
              listRequests: this.listPendingFriendRequests.bind(this),
              pplWhoWantToBeFriends: this.state.pendingFriendRequests.map(function (a) {
                return [a.requestor, a.requestTyp, a.movie === null ? "" : a.movie, "Message:" + a.message === 'null' ? "none" : a.message];
              }),
              remove: this.removeRequest.bind(this)
            })
          );
        } else if (this.state.view === "Friends") {
          return React.createElement(
            'div',
            null,
            React.createElement(Nav, { name: this.state.currentUser,
              find: this.findMovieBuddies.bind(this),
              onClick: this.changeViews.bind(this),
              logout: this.logout.bind(this) }),
            React.createElement(Friends, {
              sendWatchRequest: this.sendWatchRequest.bind(this),
              fof: this.focusOnFriend.bind(this),
              getFriends: this.getCurrentFriends.bind(this),
              myFriends: this.state.myFriends,
              listPotentials: this.listPotentials.bind(this),
              logout: this.logout.bind(this),
              sendRequest: this.sendRequest.bind(this)
            })
          );
        } else if (this.state.view === "Home") {
          return React.createElement(
            'div',
            null,
            React.createElement(Nav, { name: this.state.currentUser,
              find: this.findMovieBuddies.bind(this),
              onClick: this.changeViews.bind(this),
              logout: this.logout.bind(this)
            }),
            React.createElement(Home, {
              change: this.changeViewsMovie.bind(this)
            })
          );
        } else if (this.state.view === "SingleMovie") {
          var _ret = function () {
            var that = _this13;
            return {
              v: React.createElement(
                'div',
                { onClick: function onClick() {
                    return console.log(that.state);
                  } },
                React.createElement(Nav, { name: _this13.state.currentUser,
                  onClick: _this13.changeViews.bind(_this13),
                  logout: _this13.logout.bind(_this13)
                }),
                React.createElement(SingleMovieRating, {
                  compatibility: _this13.state.myFriends,
                  currentMovie: _this13.state.movie,
                  change: _this13.changeViewsFriends.bind(_this13),
                  fof: _this13.focusOnFriend.bind(_this13)
                })
              )
            };
          }();

          if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
        } else if (this.state.view === 'singleFriend') {
          return React.createElement(
            'div',
            null,
            React.createElement(Nav, { name: this.state.currentUser,
              find: this.findMovieBuddies.bind(this),
              onClick: this.changeViews.bind(this),
              logout: this.logout.bind(this)
            }),
            React.createElement(SingleFriend, {
              moviesOfFriend: this.state.individualFriendsMovies,
              friendName: this.state.friendToFocusOn,
              onClick: this.changeViews.bind(this),
              change: this.changeViewsMovie.bind(this)
            })
          );
        } else if (this.state.view === "FNMB") {
          return React.createElement(
            'div',
            null,
            React.createElement(Nav, { name: this.state.currentUser,
              find: this.findMovieBuddies.bind(this),
              onClick: this.changeViews.bind(this),
              logout: this.logout.bind(this)
            }),
            React.createElement(FindMovieBuddy, {
              buddyfunc: this.buddyRequest.bind(this),
              buddies: this.state.potentialMovieBuddies
            })
          );
        } else if (this.state.view === "MyRatings") {
          return React.createElement(
            'div',
            null,
            React.createElement(Nav, { name: this.state.currentUser,
              find: this.findMovieBuddies.bind(this),
              onClick: this.changeViews.bind(this),
              logout: this.logout.bind(this)
            }),
            React.createElement(MyRatings, {
              change: this.changeViewsMovie.bind(this)
            })
          );
        }
    }
  }]);

  return App;
}(React.Component);

window.App = App;
//var Url = 'https://thawing-island-99747.herokuapp.com';
var Url = 'http://127.0.0.1:3000';
window.Url = Url;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0FwcC5qcyJdLCJuYW1lcyI6WyJBcHAiLCJwcm9wcyIsInN0YXRlIiwidmlldyIsImZyaWVuZHNSYXRpbmdzIiwibW92aWUiLCJmcmllbmRSZXF1ZXN0cyIsInBlbmRpbmdGcmllbmRSZXF1ZXN0cyIsIm15RnJpZW5kcyIsImZyaWVuZFRvRm9jdXNPbiIsImluZGl2aWR1YWxGcmllbmRzTW92aWVzIiwicG90ZW50aWFsTW92aWVCdWRkaWVzIiwidXNlcm5hbWUiLCJyZXF1ZXN0UmVzcG9uc2VzIiwiY3VycmVudFVzZXIiLCJyZXF1ZXN0c09mQ3VycmVudFVzZXIiLCJjb25zb2xlIiwibG9nIiwiJCIsInBvc3QiLCJVcmwiLCJ0ZXN0IiwiYSIsImIiLCJpIiwibGVuZ3RoIiwiZmluYWwiLCJzb3J0Iiwic2V0U3RhdGUiLCJwZXJzb25Ub0FjY2VwdCIsInJlc3AiLCJlcnIiLCJsaXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzIiwicGVyc29uVG9EZWNsaW5lIiwiZHVtbXkiLCJzb3J0ZWQiLCJ1bmlxdWVGcmllbmRzIiwidW5pcXVlIiwieCIsInB1c2giLCJuYW1lIiwicGFzc3dvcmQiLCJ0aGVuIiwiY2F0Y2giLCJtb3ZpZU5hbWUiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwidmFsdWUiLCJyZXNwb25zZSIsImZyaWVuZCIsInRvU2VuZCIsInJlcXVlc3RlZSIsInF1ZXJ5Iiwib3B0aW9ucyIsInNlYXJjaE1vdmllIiwidGFyZ2V0U3RhdGUiLCJnZXRDdXJyZW50RnJpZW5kcyIsInNlbmRSZXF1ZXN0IiwicGVyc29uIiwiY3VyckZyaWVuZHMiLCJmcmllbmRzMSIsImZyaWVuZHMyIiwiaW5kZXhPZiIsImZhZGVJbiIsImZhZGVPdXQiLCJjb25jYXQiLCJlcnJvciIsInBGUiIsInJSIiwicmVxdWVzdG9yIiwicmVzcG9uc2VUVSIsImdldCIsImZyaWVuZE5hbWUiLCJzZWxmIiwidGhhdCIsImFqYXgiLCJ1cmwiLCJ0eXBlIiwiZGF0YSIsInN1Y2Nlc3MiLCJjaGFuZ2VWaWV3cyIsImJpbmQiLCJzZXRDdXJyZW50VXNlciIsImZpbmRNb3ZpZUJ1ZGRpZXMiLCJsb2dvdXQiLCJnZXRNb3ZpZSIsImFjY2VwdEZyaWVuZCIsImRlY2xpbmVGcmllbmQiLCJtYXAiLCJyZXF1ZXN0VHlwIiwibWVzc2FnZSIsInJlbW92ZVJlcXVlc3QiLCJzZW5kV2F0Y2hSZXF1ZXN0IiwiZm9jdXNPbkZyaWVuZCIsImxpc3RQb3RlbnRpYWxzIiwiY2hhbmdlVmlld3NNb3ZpZSIsImNoYW5nZVZpZXdzRnJpZW5kcyIsImJ1ZGR5UmVxdWVzdCIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBTUEsRzs7O0FBQ0osZUFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLDBHQUNYQSxLQURXOztBQUdqQixVQUFLQyxLQUFMLEdBQWE7QUFDWEMsWUFBTSxPQURLO0FBRVhDLHNCQUFnQixFQUZMO0FBR1hDLGFBQU8sSUFISTtBQUlYQyxzQkFBZ0IsRUFKTDtBQUtYQyw2QkFBdUIsRUFMWjtBQU1YQyxpQkFBVyxFQU5BO0FBT1hDLHVCQUFpQixFQVBOO0FBUVhDLCtCQUF5QixFQVJkO0FBU1hDLDZCQUF1QixFQVRaO0FBVVhDLGdCQUFVLElBVkM7QUFXWEMsd0JBQWtCLEVBWFA7QUFZWEMsbUJBQWEsSUFaRjtBQWFYQyw2QkFBdUI7QUFiWixLQUFiO0FBSGlCO0FBa0JsQjs7Ozt3Q0FFbUI7QUFBQTs7QUFFbEJDLGNBQVFDLEdBQVIsQ0FBWSxXQUFaO0FBQ0FDLFFBQUVDLElBQUYsQ0FBT0MsTUFBTSxhQUFiLEVBQTJCLEVBQUNDLE1BQUssTUFBTixFQUEzQixFQUEwQyxVQUFDQyxDQUFELEVBQUlDLENBQUosRUFBVTtBQUNsRFAsZ0JBQVFDLEdBQVIsQ0FBWSwrQ0FBWixFQUE0REssQ0FBNUQsRUFBOERDLENBQTlEO0FBQ08sYUFBSyxJQUFJQyxJQUFFLENBQVgsRUFBYUEsSUFBRUYsRUFB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QXNCRixJQUF0QixDQUEyQixJQUEzQixDQURSO0FBRUUsdUJBQVMsS0FBS0QsV0FBTCxDQUFpQkMsSUFBakIsQ0FBc0IsSUFBdEIsQ0FGWDtBQUdFLHNCQUFRLEtBQUtHLE1BQUwsQ0FBWUgsSUFBWixDQUFpQixJQUFqQjtBQUhWLGNBREo7QUFNRSxnQ0FBQyxTQUFEO0FBQ0Usc0JBQVEsS0FBS2MsZ0JBQUwsQ0FBc0JkLElBQXRCLENBQTJCLElBQTNCO0FBRFY7QUFORixXQURGO0FBWUQ7QUFDRjs7OztFQXJlZWlCLE1BQU1DLFM7O0FBd2V4QkMsT0FBT3BHLEdBQVAsR0FBYUEsR0FBYjtBQUNBO0FBQ0EsSUFBSW9CLE1BQU0sdUJBQVY7QUFDQWdGLE9BQU9oRixHQUFQLEdBQWFBLEdBQWIiLCJmaWxlIjoiQXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIHZpZXc6ICdMb2dpbicsXHJcbiAgICAgIGZyaWVuZHNSYXRpbmdzOiBbXSxcclxuICAgICAgbW92aWU6IG51bGwsXHJcbiAgICAgIGZyaWVuZFJlcXVlc3RzOiBbXSxcclxuICAgICAgcGVuZGluZ0ZyaWVuZFJlcXVlc3RzOiBbXSxcclxuICAgICAgbXlGcmllbmRzOiBbXSxcclxuICAgICAgZnJpZW5kVG9Gb2N1c09uOiAnJyxcclxuICAgICAgaW5kaXZpZHVhbEZyaWVuZHNNb3ZpZXM6IFtdLFxyXG4gICAgICBwb3RlbnRpYWxNb3ZpZUJ1ZGRpZXM6IHt9LFxyXG4gICAgICB1c2VybmFtZTogbnVsbCxcclxuICAgICAgcmVxdWVzdFJlc3BvbnNlczogW10sXHJcbiAgICAgIGN1cnJlbnRVc2VyOiBudWxsLFxyXG4gICAgICByZXF1ZXN0c09mQ3VycmVudFVzZXI6IFtdXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgZ2V0Q3VycmVudEZyaWVuZHMoKSB7XHJcblxyXG4gICAgY29uc29sZS5sb2coJ3Rlc3RpbmdnZycpO1xyXG4gICAgJC5wb3N0KFVybCArICcvZ2V0RnJpZW5kcycse3Rlc3Q6J2luZm8nfSwgKGEsIGIpID0+IHtcclxuICAgICAgY29uc29sZS5sb2coJ3doYXQgeW91IGdldCBiYWNrIGZyb20gc2VydmVyIGZvciBnZXQgZnJpZW5kcycsYSxiKTtcclxuICAgICAgICAgICAgIGZvciAobGV0IGk9MDtpPGEubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICAgICAgICBpZiAoYVtpXVsxXT09PW51bGwpe1xyXG4gICAgICAgICAgICAgICAgICBhW2ldWzFdID0gXCJObyBjb21wYXJpc29uIHRvIGJlIG1hZGVcIjtcclxuICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICBjb25zdCBmaW5hbD0gYS5zb3J0KGZ1bmN0aW9uKGEsYil7cmV0dXJuIGJbMV0tYVsxXX0pO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBteUZyaWVuZHM6ZmluYWxcclxuICAgICAgfSlcclxuICAgICAgY29uc29sZS5sb2coJ3RoZXMgYXJlIG15IGZyaWVuZHMhISEhISEhISEhISEhISEhIScsdGhpcy5zdGF0ZS5teUZyaWVuZHMpXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgYWNjZXB0RnJpZW5kKHBlcnNvblRvQWNjZXB0LCBtb3ZpZSkge1xyXG4gICAgLy8gJCgnYnV0dG9uJykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcclxuICAgIC8vICAgY29uc29sZS5sb2coJCh0aGlzKS5odG1sKCkpO1xyXG4gICAgLy8gfSlcclxuICAgIC8vIGNvbnNvbGUubG9nKGZpbmFsICsnc2hvdWxkIGJlIGFjY2VwdGVkLCBmb3IgbW92aWUuLi4uJywgbW92aWUpXHJcblxyXG4gICAgJC5wb3N0KFVybCArICcvYWNjZXB0Jyx7cGVyc29uVG9BY2NlcHQ6cGVyc29uVG9BY2NlcHQsIG1vdmllOiBtb3ZpZX0sKHJlc3AsZXJyKT0+IHtcclxuICAgICAgdGhpcy5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCk7XHJcbiAgICB9KVxyXG4gICAgXHJcbiAgICBjb25zb2xlLmxvZygncmVmcmVzaGVkIGluYm94LCBzaG91bGQgZGVsZXRlIGZyaWVuZCByZXF1ZXN0IG9uIHRoZSBzcG90IGluc3RlYWQgb2YgbW92aW5nJylcclxuICB9XHJcblxyXG4gIGRlY2xpbmVGcmllbmQocGVyc29uVG9EZWNsaW5lLCBtb3ZpZSkge1xyXG4gICAgJC5wb3N0KFVybCArICcvZGVjbGluZScse3BlcnNvblRvRGVjbGluZTpwZXJzb25Ub0RlY2xpbmUsIG1vdmllOiBtb3ZpZX0sKHJlc3AsIGVycik9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBzdGF0ZSBhZnRlciBkZWNsaW5pbmcgZnJpZW5kLCAnLCB0aGlzLnN0YXRlKTtcclxuICAgICAgdGhpcy5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZpbmRNb3ZpZUJ1ZGRpZXMoKSB7XHJcbiAgIFxyXG4gICAgJC5wb3N0KFVybCArICcvZmluZE1vdmllQnVkZGllcycse2R1bW15OidpbmZvJ30sKHJlc3AsIGVycik9PiB7XHJcbiAgICAgIGNvbnN0IHNvcnRlZD1yZXNwLnNvcnQoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYlsxXS1hWzFdfSk7XHJcbiAgICAgIGNvbnN0IG15RnJpZW5kcz10aGlzLnN0YXRlLm15RnJpZW5kcztcclxuICAgICAgIGNvbnN0IHVuaXF1ZUZyaWVuZHM9W107XHJcbiAgICAgICAgZm9yIChsZXQgaT0wO2k8c29ydGVkLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgbGV0IHVuaXF1ZT10cnVlO1xyXG4gICAgICAgICAgZm9yIChsZXQgeD0wO3g8bXlGcmllbmRzLmxlbmd0aDt4Kyspe1xyXG4gICAgICAgICAgICBpZiAoc29ydGVkW2ldWzBdPT09bXlGcmllbmRzW3hdWzBdKXtcclxuICAgICAgICAgICAgICB1bmlxdWU9ZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICh1bmlxdWUpe1xyXG4gICAgICAgICAgICB1bmlxdWVGcmllbmRzLnB1c2goc29ydGVkW2ldKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHZpZXc6XCJGTk1CXCIsXHJcbiAgICAgICAgcG90ZW50aWFsTW92aWVCdWRkaWVzOnVuaXF1ZUZyaWVuZHNcclxuICAgICAgfSlcclxuXHJcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUubXlGcmllbmRzLHRoaXMuc3RhdGUucG90ZW50aWFsTW92aWVCdWRkaWVzKTtcclxuXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcblxyXG4gIGNoYW5nZVZpZXcoKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzpcIlNpZ25VcFwiIFxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIHNldEN1cnJlbnRVc2VyKHVzZXJuYW1lKSB7XHJcbiAgICBjb25zb2xlLmxvZygnY2FsbGluZyBzZXRDdXJyZW50VXNlcicpO1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIGN1cnJlbnRVc2VyOiB1c2VybmFtZVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGVudGVyTmV3VXNlcihuYW1lLHBhc3N3b3JkKSB7XHJcbiAgICBjb25zb2xlLmxvZyhuYW1lLHBhc3N3b3JkKTtcclxuICAgICQucG9zdChVcmwgKyAnL3NpZ251cCcse25hbWU6bmFtZSxwYXNzd29yZDpwYXNzd29yZH0pLnRoZW4oKCk9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdzdWNjZXNzJyk7IFxyXG4gICAgICB0aGlzLnNldFN0YXRlKHt1c2VybmFtZTogbmFtZSwgdmlldzogXCJIb21lXCJ9KVxyXG4gICAgfSkuY2F0Y2goKCk9PiB7Y29uc29sZS5sb2coJ2Vycm9yJyl9KVxyXG4gIH1cclxuXHJcbiAgZ2V0RnJpZW5kTW92aWVSYXRpbmdzKCkge1xyXG4gICAgbGV0IG1vdmllTmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibW92aWVUb1ZpZXdcIikudmFsdWVcclxuICAgICQucG9zdChVcmwgKyAnL2dldEZyaWVuZFJhdGluZ3MnLCB7IG5hbWU6IG1vdmllTmFtZSB9KS50aGVuKHJlc3BvbnNlPT4ge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzpcIkhvbWVcIixcclxuICAgICAgZnJpZW5kc1JhdGluZ3M6cmVzcG9uc2VcclxuICAgIH0pXHJcbiAgICBjb25zb2xlLmxvZygnb3VyIHJlc3BvbnNlJyx0aGlzLnN0YXRlLmZyaWVuZHNSYXRpbmdzKVxyXG4gICAgfSkuY2F0Y2goZXJyPT4ge2NvbnNvbGUubG9nKGVycil9KTtcclxuICB9XHJcblxyXG5cclxuXHJcblxyXG4gIGxvZ291dCgpIHtcclxuICAgICQucG9zdChVcmwgKyAnL2xvZ291dCcpLnRoZW4ocmVzcG9uc2U9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgdmlldzpcIkxvZ2luXCIsXHJcbiAgICAgICAgZnJpZW5kc1JhdGluZ3M6W10sXHJcbiAgICAgICAgbW92aWU6IG51bGwsXHJcbiAgICAgICAgZnJpZW5kUmVxdWVzdHM6W10sXHJcbiAgICAgICAgcGVuZGluZ0ZyaWVuZFJlcXVlc3RzOltdLFxyXG4gICAgICAgIG15RnJpZW5kczpbXSxcclxuICAgICAgICBmcmllbmRUb0ZvY3VzT246JycsXHJcbiAgICAgICAgaW5kaXZpZHVhbEZyaWVuZHNNb3ZpZXM6W10sXHJcbiAgICAgICAgcG90ZW50aWFsTW92aWVCdWRkaWVzOnt9LFxyXG4gICAgICAgIHVzZXJuYW1lOiBudWxsLFxyXG4gICAgICAgIHJlcXVlc3RSZXNwb25zZXM6W10sXHJcbiAgICAgICAgY3VycmVudFVzZXI6bnVsbCxcclxuICAgICAgICByZXF1ZXN0c09mQ3VycmVudFVzZXI6W11cclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNlbmRXYXRjaFJlcXVlc3QoZnJpZW5kKSB7XHJcbiAgICBjb25zdCBtb3ZpZT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vdmllVG9XYXRjaCcpLnZhbHVlO1xyXG4gICAgY29uc3QgdG9TZW5kPXtyZXF1ZXN0ZWU6ZnJpZW5kLCBtb3ZpZTptb3ZpZX07XHJcbiAgICBpZiAobW92aWUubGVuZ3RoKSB7XHJcbiAgICAgICQucG9zdChVcmwgKyAnL3NlbmRXYXRjaFJlcXVlc3QnLCB0b1NlbmQsIChyZXNwLCBlcnIpPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3AsIGVycik7XHJcbiAgICAgIH0pO1xyXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW92aWVUb1dhdGNoJykudmFsdWU9Jyc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZygneW91IG5lZWQgdG8gZW50ZXIgYSBtb3ZpZSB0byBzZW5kIGEgd2F0Y2ggcmVxdWVzdCEhISEnKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vLy8vbW92aWUgcmVuZGVyXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy9jYWxsIHNlYXJjaG1vdmllIGZ1bmN0aW9uXHJcbiAgLy93aGljaCBnZXRzIHBhc3NlZCBkb3duIHRvIHRoZSBNb3ZpZSBTZWFyY2ggXHJcbiAgZ2V0TW92aWUocXVlcnkpIHtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgIHF1ZXJ5OiBxdWVyeVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgdGhpcy5wcm9wcy5zZWFyY2hNb3ZpZShvcHRpb25zLCBtb3ZpZSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKG1vdmllKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgdmlldzpcIk1vdmllU2VhcmNoVmlld1wiLFxyXG4gICAgICAgIG1vdmllOiBtb3ZpZVxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuICB9XHJcbiAgLy9zaG93IHRoZSBtb3ZpZSBzZWFyY2hlZCBpbiBmcmllbmQgbW92aWUgbGlzdFxyXG4gIC8vb250byB0aGUgc3RhdGV2aWV3IG9mIG1vdmllc2VhcmNodmlld1xyXG4gIHNob3dNb3ZpZShtb3ZpZSkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIG1vdmllOiBtb3ZpZVxyXG4gICAgfSlcclxuICB9XHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8vLy9OYXYgY2hhbmdlXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgY2hhbmdlVmlld3ModGFyZ2V0U3RhdGUpIHtcclxuICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xyXG5cclxuICAgIGlmICh0YXJnZXRTdGF0ZT09PSdGcmllbmRzJyl7XHJcbiAgICAgIGNvbnNvbGUubG9nKCd5b3Ugc3dpdGNoZWQgdG8gZnJpZW5kcyEhJylcclxuICAgICAgdGhpcy5nZXRDdXJyZW50RnJpZW5kcygpXHJcbiAgICAgIHRoaXMuc2VuZFJlcXVlc3QoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGFyZ2V0U3RhdGU9PT0nSG9tZScpe1xyXG4gICAgICB0aGlzLmdldEN1cnJlbnRGcmllbmRzKClcclxuICAgICAgdGhpcy5zZW5kUmVxdWVzdCgpO1xyXG4gICAgfVxyXG5cclxuICAgICBpZiAodGFyZ2V0U3RhdGU9PT1cIkluYm94XCIpe1xyXG4gICAgICAgdGhpcy5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKClcclxuICAgICB9XHJcblxyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6IHRhcmdldFN0YXRlXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxuXHJcbiAgY2hhbmdlVmlld3NNb3ZpZSh0YXJnZXRTdGF0ZSwgbW92aWUpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OiB0YXJnZXRTdGF0ZSxcclxuICAgICAgbW92aWU6IG1vdmllXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNoYW5nZVZpZXdzRnJpZW5kcyh0YXJnZXRTdGF0ZSwgZnJpZW5kKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzogdGFyZ2V0U3RhdGUsXHJcbiAgICAgIGZyaWVuZFRvRm9jdXNPbjogZnJpZW5kXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG5cclxuICBidWRkeVJlcXVlc3QocGVyc29uKSB7XHJcbiAgICB0aGlzLnNlbmRSZXF1ZXN0KHBlcnNvbik7XHJcbiAgfVxyXG5cclxuXHJcbiAgc2VuZFJlcXVlc3QoYSkge1xyXG5jb25zb2xlLmxvZygnc2VuZCByZXF1ZXN0IGlzIGJlaW5nIHJ1biEhJylcclxuXHJcbiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRGcmllbmRCeU5hbWUnKSE9PW51bGwpe1xyXG4gICAgICB2YXIgcGVyc29uPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kRnJpZW5kQnlOYW1lJykudmFsdWVcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBwZXJzb24gPSBhIHx8ICd0ZXN0JztcclxuICAgIH1cclxuICAgIGNvbnN0IGN1cnJGcmllbmRzPXRoaXMuc3RhdGUubXlGcmllbmRzO1xyXG4gICAgY29uc3QgZnJpZW5kczE9W107XHJcbiAgICBjb25zdCBmcmllbmRzMj1bXVxyXG4gICAgZm9yICh2YXIgaT0wO2k8Y3VyckZyaWVuZHMubGVuZ3RoO2krKyl7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdsaW5lIDI1MScsY3VyckZyaWVuZHNbaV0pXHJcbiAgICAgIGZyaWVuZHMxLnB1c2goY3VyckZyaWVuZHNbaV1bMF0pO1xyXG4gICAgICBmcmllbmRzMi5wdXNoKGN1cnJGcmllbmRzW2ldWzBdKVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAodmFyIGk9MDtpPHRoaXMuc3RhdGUucmVxdWVzdHNPZkN1cnJlbnRVc2VyLmxlbmd0aDtpKyspe1xyXG4gICAgICBmcmllbmRzMS5wdXNoKHRoaXMuc3RhdGUucmVxdWVzdHNPZkN1cnJlbnRVc2VyW2ldKVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBhbHNvIGJlIG15IGZyaWVuZHMnLHBlcnNvbiwgY3VyckZyaWVuZHMsZnJpZW5kczEsZnJpZW5kczIpXHJcblxyXG4gICAgLy9jb25zb2xlLmxvZygndG9mJyxmcmllbmRzMS5pbmRleE9mKHBlcnNvbikhPT0gLTEsIGZyaWVuZHMxLmxlbmd0aCE9PTApXHJcbiAgICBpZiAoZnJpZW5kczEuaW5kZXhPZihwZXJzb24pIT09IC0xICYmIGZyaWVuZHMxLmxlbmd0aCE9PTApe1xyXG4gICAgICAkKFwiI0FscmVhZHlSZXFcIikuZmFkZUluKDEwMDApO1xyXG4gICAgICAkKFwiI0FscmVhZHlSZXFcIikuZmFkZU91dCgxMDAwKTtcclxuICAgICAgY29uc29sZS5sb2coJ3RoaXMgcGVyc29uIGlzIGFscmVhZHkgaW4gdGhlcmUhIScpXHJcbiAgICB9IGVsc2UgaWYgKCFwZXJzb24ubGVuZ3RoKSB7XHJcbiAgICAgICQoXCIjZW50ZXJSZWFsRnJpZW5kXCIpLmZhZGVJbigxMDAwKTtcclxuICAgICAgJChcIiNlbnRlclJlYWxGcmllbmRcIikuZmFkZU91dCgxMDAwKTtcclxuICAgIH0gZWxzZSB7XHJcblxyXG5jb25zb2xlLmxvZygncGVyc29uIGlzIGRlZmluZWQ/JyxwZXJzb24pO1xyXG4gICAgICAkLnBvc3QoVXJsICsgJy9zZW5kUmVxdWVzdCcse25hbWU6cGVyc29ufSwgKHJlc3AsIGVycik9PiB7XHJcbiAgICAgICBcclxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICByZXF1ZXN0c09mQ3VycmVudFVzZXI6cmVzcC5jb25jYXQoW3BlcnNvbl0pXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgY29uc29sZS5sb2coJ2xpbmUgMjgxJyx0aGlzLnN0YXRlLnJlcXVlc3RzT2ZDdXJyZW50VXNlcik7XHJcblxyXG4gICAgICAgICQoXCIjcmVxU2VudFwiKS5mYWRlSW4oMTAwMCk7XHJcbiAgICAgICAgJChcIiNyZXFTZW50XCIpLmZhZGVPdXQoMTAwMCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBpZiAoIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kRnJpZW5kQnlOYW1lJykhPT1udWxsKXtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZEZyaWVuZEJ5TmFtZScpLnZhbHVlID0gJyc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKSB7XHJcbiAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgbGlzdCBmcmllbmQgcmVxcycpXHJcbiAgICAkLnBvc3QoVXJsICsgJy9saXN0UmVxdWVzdHMnLCAocmVzcG9uc2UsIGVycm9yKT0+IHtcclxuICAgICAgY29uc3QgcEZSPVtdO1xyXG4gICAgICBjb25zdCByUj1bXTtcclxuICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlIHRvIGxwZnInLCByZXNwb25zZSk7XHJcblxyXG4gICAgICBmb3IgKHZhciBpPTA7aTxyZXNwb25zZVswXS5sZW5ndGg7aSsrKXtcclxuICAgICAgICBjb25zdCByZXF1ZXN0b3I9cmVzcG9uc2VbMF1baV1bJ3JlcXVlc3RvciddO1xyXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlVFU9IHJlc3BvbnNlWzBdW2ldWydyZXNwb25zZSddO1xyXG4gICAgICAgIGlmIChyZXF1ZXN0b3IhPT1yZXNwb25zZVsxXSAmJiByZXNwb25zZVRVPT09bnVsbCApe1xyXG4gICAgICAgICAgcEZSLnB1c2gocmVzcG9uc2VbMF1baV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVxdWVzdG9yPT09cmVzcG9uc2VbMV0gJiZyZXNwb25zZVRVIT09bnVsbCAmJiByZXNwb25zZVswXVtpXVsncmVxdWVzdGVlJ10hPT0ndGVzdCcpe1xyXG4gICAgICAgICAgclIucHVzaChyZXNwb25zZVswXVtpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBwZW5kaW5nRnJpZW5kUmVxdWVzdHM6cEZSLFxyXG4gICAgICAgIHJlcXVlc3RSZXNwb25zZXM6clJcclxuICAgICAgfSlcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGZvY3VzT25GcmllbmQoZnJpZW5kKSB7XHJcbiAgICBcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgdmlldzonc2luZ2xlRnJpZW5kJyxcclxuICAgICAgICBmcmllbmRUb0ZvY3VzT246IGZyaWVuZFxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgICQuZ2V0KFVybCArICcvZ2V0RnJpZW5kVXNlclJhdGluZ3MnLHtmcmllbmROYW1lOiBmcmllbmR9LCByZXNwb25zZT0+IHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgIGluZGl2aWR1YWxGcmllbmRzTW92aWVzOiByZXNwb25zZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gIGxpc3RQb3RlbnRpYWxzKCkge1xyXG4gICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGxpc3QgcG90ZW50aWFsIGZyaWVuZHMnKVxyXG4gIH1cclxuXHJcbiAgcmVtb3ZlUmVxdWVzdChwZXJzb24sIHNlbGYsIG1vdmllKSB7XHJcbiAgICB2YXIgdGhhdD0gdGhpcztcclxuICAgICQuYWpheCh7XHJcbiAgICAgIHVybDogVXJsICsgJy9yZW1vdmVSZXF1ZXN0JyxcclxuICAgICAgdHlwZTogJ0RFTEVURScsXHJcbiAgICAgIGRhdGE6IHtcclxuICAgICAgICByZXF1ZXN0b3I6IHNlbGYsXHJcbiAgICAgICAgcmVxdWVzdGVlOiBwZXJzb24sXHJcbiAgICAgICAgbW92aWU6IG1vdmllXHJcbiAgICAgIH0sXHJcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1JFUVVFU1QgUkVNT1ZFRCEgTW92aWUgaXM6ICcsIG1vdmllKTtcclxuICAgICAgICB0aGF0Lmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKTtcclxuICAgICAgfSxcclxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIGlmICh0aGlzLnN0YXRlLnZpZXc9PT0nTG9naW4nKSB7XHJcbiAgICAgIHJldHVybiAoPExvZ0luIGNoYW5nZVZpZXdzPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9IHNldEN1cnJlbnRVc2VyPXt0aGlzLnNldEN1cnJlbnRVc2VyLmJpbmQodGhpcyl9Lz4pO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXc9PT1cIlNpZ25VcFwiKSB7XHJcbiAgICAgIHJldHVybiAoPFNpZ25VcCBjaGFuZ2VWaWV3cz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfSBzZXRDdXJyZW50VXNlcj17dGhpcy5zZXRDdXJyZW50VXNlci5iaW5kKHRoaXMpfSAvPik7XHJcbiAgICB9IFxyXG4gICAgLy90aGlzIHZpZXcgaXMgYWRkZWQgZm9yIG1vdmllc2VhcmNoIHJlbmRlcmluZ1xyXG4gICAgZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIk1vdmllU2VhcmNoVmlld1wiKSB7XHJcbiAgICAgIHJldHVybiAoIFxyXG4gICAgICAgIDxkaXY+IFxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxyXG4gICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9IFxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgPE1vdmllUmF0aW5nIFxyXG4gICAgICAgICAgICBoYW5kbGVTZWFyY2hNb3ZpZT17dGhpcy5nZXRNb3ZpZS5iaW5kKHRoaXMpfSBcclxuICAgICAgICAgICAgbW92aWU9e3RoaXMuc3RhdGUubW92aWV9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkluYm94XCIgKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxyXG4gICAgICAgICAgICAgIGZpbmQ9e3RoaXMuZmluZE1vdmllQnVkZGllcy5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgICAgSG9tZT17dHJ1ZX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgPEluYm94IFxyXG4gICAgICAgICAgICAgIHJlcXVlc3RzPXt0aGlzLnN0YXRlLnBlbmRpbmdGcmllbmRSZXF1ZXN0c31cclxuICAgICAgICAgICAgICByZXNwb25zZXNBbnN3ZXJlZD17dGhpcy5zdGF0ZS5yZXF1ZXN0UmVzcG9uc2VzfVxyXG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX0gIFxyXG4gICAgICAgICAgICAgIGFjY2VwdD0ge3RoaXMuYWNjZXB0RnJpZW5kLmJpbmQodGhpcyl9IFxyXG4gICAgICAgICAgICAgIGRlY2xpbmU9e3RoaXMuZGVjbGluZUZyaWVuZC5iaW5kKHRoaXMpfSBcclxuICAgICAgICAgICAgICBsaXN0UmVxdWVzdHM9e3RoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cy5iaW5kKHRoaXMpfSBcclxuICAgICAgICAgICAgICBwcGxXaG9XYW50VG9CZUZyaWVuZHM9e3RoaXMuc3RhdGUucGVuZGluZ0ZyaWVuZFJlcXVlc3RzLm1hcChcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGEpe3JldHVybiBbYS5yZXF1ZXN0b3IsYS5yZXF1ZXN0VHlwLGEubW92aWU9PT1udWxsP1wiXCI6IGEubW92aWUsXCJNZXNzYWdlOlwiKyBhLm1lc3NhZ2U9PT0nbnVsbCc/XCJub25lXCI6YS5tZXNzYWdlXX0pfSBcclxuICAgICAgICAgICAgICByZW1vdmU9e3RoaXMucmVtb3ZlUmVxdWVzdC5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiRnJpZW5kc1wiICkge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cclxuICAgICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfS8+XHJcbiAgICAgICAgICA8RnJpZW5kcyBcclxuICAgICAgICAgICAgc2VuZFdhdGNoUmVxdWVzdD17dGhpcy5zZW5kV2F0Y2hSZXF1ZXN0LmJpbmQodGhpcyl9IFxyXG4gICAgICAgICAgICBmb2Y9IHt0aGlzLmZvY3VzT25GcmllbmQuYmluZCh0aGlzKX0gXHJcbiAgICAgICAgICAgIGdldEZyaWVuZHM9e3RoaXMuZ2V0Q3VycmVudEZyaWVuZHMuYmluZCh0aGlzKX0gXHJcbiAgICAgICAgICAgIG15RnJpZW5kcz17dGhpcy5zdGF0ZS5teUZyaWVuZHN9IFxyXG4gICAgICAgICAgICBsaXN0UG90ZW50aWFscz17dGhpcy5saXN0UG90ZW50aWFscy5iaW5kKHRoaXMpfSBcclxuICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfSAgXHJcbiAgICAgICAgICAgIHNlbmRSZXF1ZXN0PXt0aGlzLnNlbmRSZXF1ZXN0LmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkhvbWVcIikge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cclxuICAgICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKX0gXHJcbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDxIb21lIFxyXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NNb3ZpZS5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIlNpbmdsZU1vdmllXCIpIHtcclxuICAgICAgbGV0IHRoYXQgPSB0aGlzO1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXYgb25DbGljaz17KCk9PmNvbnNvbGUubG9nKHRoYXQuc3RhdGUpfT5cclxuICAgICAgICAgICAgPE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxyXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8U2luZ2xlTW92aWVSYXRpbmcgXHJcbiAgICAgICAgICAgIGNvbXBhdGliaWxpdHk9e3RoaXMuc3RhdGUubXlGcmllbmRzfVxyXG4gICAgICAgICAgICBjdXJyZW50TW92aWU9e3RoaXMuc3RhdGUubW92aWV9XHJcbiAgICAgICAgICAgIGNoYW5nZT17dGhpcy5jaGFuZ2VWaWV3c0ZyaWVuZHMuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgZm9mPXt0aGlzLmZvY3VzT25GcmllbmQuYmluZCh0aGlzKX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldz09PSdzaW5nbGVGcmllbmQnKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxyXG4gICAgICAgICAgICAgIGZpbmQ9e3RoaXMuZmluZE1vdmllQnVkZGllcy5iaW5kKHRoaXMpfSBcclxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgPFNpbmdsZUZyaWVuZCBcclxuICAgICAgICAgICAgbW92aWVzT2ZGcmllbmQ9e3RoaXMuc3RhdGUuaW5kaXZpZHVhbEZyaWVuZHNNb3ZpZXN9IFxyXG4gICAgICAgICAgICBmcmllbmROYW1lPXt0aGlzLnN0YXRlLmZyaWVuZFRvRm9jdXNPbn0gXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgY2hhbmdlPXt0aGlzLmNoYW5nZVZpZXdzTW92aWUuYmluZCh0aGlzKX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJGTk1CXCIpIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XHJcbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyl9IFxyXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8RmluZE1vdmllQnVkZHkgXHJcbiAgICAgICAgICAgIGJ1ZGR5ZnVuYz17dGhpcy5idWRkeVJlcXVlc3QuYmluZCh0aGlzKX0gXHJcbiAgICAgICAgICAgIGJ1ZGRpZXM9e3RoaXMuc3RhdGUucG90ZW50aWFsTW92aWVCdWRkaWVzfSBcclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJNeVJhdGluZ3NcIikge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cclxuICAgICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKX0gXHJcbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDxNeVJhdGluZ3MgXHJcbiAgICAgICAgICAgIGNoYW5nZT17dGhpcy5jaGFuZ2VWaWV3c01vdmllLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxud2luZG93LkFwcCA9IEFwcDtcclxuLy92YXIgVXJsID0gJ2h0dHBzOi8vdGhhd2luZy1pc2xhbmQtOTk3NDcuaGVyb2t1YXBwLmNvbSc7XHJcbnZhciBVcmwgPSAnaHR0cDovLzEyNy4wLjAuMTozMDAwJztcclxud2luZG93LlVybCA9IFVybDtcclxuIl19
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
      var that = this;
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
        that.setState({
          myFriends: final
        });
        console.log('thes are my friends!!!!!!!!!!!!!!!!!', that.state.myFriends);
      });
    }
  }, {
    key: 'acceptFriend',
    value: function acceptFriend(a, movie) {
      var that = this;
      var final = a;
      // $('button').on('click',function() {
      //   console.log($(this).html());
      // })
      // console.log(final +'should be accepted, for movie....', movie)

      $.post(Url + '/accept', { personToAccept: final, movie: movie }, function (a, b) {
        that.listPendingFriendRequests();
      });

      console.log('refreshed inbox, should delete friend request on the spot instead of moving');
    }
  }, {
    key: 'declineFriend',
    value: function declineFriend(a, movie) {
      var that = this;
      var final = a;

      $.post(Url + '/decline', { personToDecline: final, movie: movie }, function (a, b) {
        console.log(a, b);
        console.log('this is the state after declining friend, ', that.state);
        that.listPendingFriendRequests();
      });
    }
  }, {
    key: 'findMovieBuddies',
    value: function findMovieBuddies() {
      var that = this;
      $.post(Url + '/findMovieBuddies', { dummy: 'info' }, function (a, b) {
        var final = a.sort(function (a, b) {
          return b[1] - a[1];
        });
        var myFriends = that.state.myFriends;
        var realFinal = [];
        for (var i = 0; i < final.length; i++) {
          var unique = true;
          for (var x = 0; x < myFriends.length; x++) {
            if (final[i][0] === myFriends[x][0]) {
              unique = false;
            }
          }
          if (unique) {
            realFinal.push(final[i]);
          }
        }

        that.setState({
          view: "FNMB",
          potentialMovieBuddies: realFinal
        });
        console.log(that.state.myFriends, that.state.potentialMovieBuddies);
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
      console.log(name, password);
      $.post(Url + '/signup', { name: name, password: password }).then(function () {
        console.log('success');
        this.setState({ username: name, view: "Home" });
      }).catch(function () {
        console.log('error');
      });
    }
  }, {
    key: 'getFriendMovieRatings',
    value: function getFriendMovieRatings() {
      var that = this;
      console.log('mooooovie');
      var movieName = document.getElementById("movieToView").value;
      $.post(Url + '/getFriendRatings', { name: movieName }).then(function (response) {

        that.setState({
          view: "Home",
          friendsRatings: response
        });
        console.log('our response', that.state.friendsRatings);
      }).catch(function (err) {
        console.log(err);
      });
    }
  }, {
    key: 'logout',
    value: function logout() {
      var that = this;
      $.post(Url + '/logout').then(function (response) {
        console.log(response);
        that.setState({
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
      if (movie.length > 0) {
        $.post(Url + '/sendWatchRequest', toSend, function (a, b) {
          console.log(a, b);
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
      var _this2 = this;

      var options = {
        query: query
      };

      this.props.searchMovie(options, function (movie) {
        console.log(movie);
        _this2.setState({
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
      var that = this;

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
    value: function buddyRequest(a) {
      this.sendRequest(a);
    }
  }, {
    key: 'sendRequest',
    value: function sendRequest(a) {
      console.log('send request is being run!!');
      var that = this;
      if (document.getElementById('findFriendByName') !== null) {
        var person = document.getElementById('findFriendByName').value;
      } else {
        var person = a || 'test';
      }
      console.log('person:', person);
      console.log('state', this.state);
      console.log('line 248', this.state.myFriends);
      var friends1 = [];
      var friends2 = [];
      for (var i = 0; i < this.state.myFriends.length; i++) {
        console.log('line 251', this.state.myFriends[i]);
        friends1.push(this.state.myFriends[i][0]);
        friends2.push(this.state.myFriends[i][0]);
      }

      for (var i = 0; i < this.state.requestsOfCurrentUser.length; i++) {
        friends1.push(this.state.requestsOfCurrentUser[i]);
      }

      console.log('this should also be my friends', this.state.myFriends, friends1, friends2);

      var pplYouCantSendTo = friends1;
      console.log('tof', friends1.indexOf(person) !== -1, friends1.length !== 0);
      if (friends1.indexOf(person) !== -1 && friends1.length !== 0) {
        $("#AlreadyReq").fadeIn(1000);
        $("#AlreadyReq").fadeOut(1000);
        console.log('this person is already in there!!');
      } else if (person.length === 0) {
        $("#enterRealFriend").fadeIn(1000);
        $("#enterRealFriend").fadeOut(1000);
      } else {

        $.post(Url + '/sendRequest', { name: person }, function (a, b) {

          that.setState({
            requestsOfCurrentUser: a.concat([person])
          });
          console.log('line 281', that.state.requestsOfCurrentUser);

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
      var that = this;
      console.log('this should list friend reqs');
      $.post(Url + '/listRequests', function (response, error) {
        console.log('Response I get!!!!!!!', response);
        var top = [];
        var bottom = [];
        console.log('tr', response);
        for (var i = 0; i < response[0].length; i++) {
          if (response[0][i]['requestor'] !== response[1] && response[0][i]['response'] === null) {
            top.push(response[0][i]);
          }
          if (response[0][i]['requestor'] === response[1] && response[0][i]['response'] !== null && response[0][i]['requestee'] !== 'test') {
            bottom.push(response[0][i]);
          }
        }

        that.setState({
          pendingFriendRequests: top,
          requestResponses: bottom
        });
      });
    }
  }, {
    key: 'focusOnFriend',
    value: function focusOnFriend(friend) {
      var that = this;
      $('.friendEntryIndividual').on('click', function (event) {
        event.preventDefault();
        var friendName = $(this).html();

        that.setState({
          view: 'singleFriend',
          friendToFocusOn: friend
        });

        $.get(Url + '/getFriendUserRatings', { friendName: friend }, function (response) {
          console.log(friend);
          console.log('getting friend movies:', response);
          that.setState({
            individualFriendsMovies: response
          });
        });
        return false;
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
      var _this3 = this;

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
            var that = _this3;
            return {
              v: React.createElement(
                'div',
                { onClick: function onClick() {
                    return console.log(that.state);
                  } },
                React.createElement(Nav, { name: _this3.state.currentUser,
                  onClick: _this3.changeViews.bind(_this3),
                  logout: _this3.logout.bind(_this3)
                }),
                React.createElement(SingleMovieRating, {
                  compatibility: _this3.state.myFriends,
                  currentMovie: _this3.state.movie,
                  change: _this3.changeViewsFriends.bind(_this3),
                  fof: _this3.focusOnFriend.bind(_this3)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0FwcC5qcyJdLCJuYW1lcyI6WyJBcHAiLCJwcm9wcyIsInN0YXRlIiwidmlldyIsImZyaWVuZHNSYXRpbmdzIiwibW92aWUiLCJmcmllbmRSZXF1ZXN0cyIsInBlbmRpbmdGcmllbmRSZXF1ZXN0cyIsIm15RnJpZW5kcyIsImZyaWVuZFRvRm9jdXNPbiIsImluZGl2aWR1YWxGcmllbmRzTW92aWVzIiwicG90ZW50aWFsTW92aWVCdWRkaWVzIiwidXNlcm5hbWUiLCJyZXF1ZXN0UmVzcG9uc2VzIiwiY3VycmVudFVzZXIiLCJyZXF1ZXN0c09mQ3VycmVudFVzZXIiLCJ0aGF0IiwiY29uc29sZSIsImxvZyIsIiQiLCJwb3N0IiwiVXJsIiwidGVzdCIsImEiLCJiIiwiaSIsImxlbmd0aCIsImZpbmFsIiwic29ydCIsInNldFN0YXRlIiwicGVyc29uVG9BY2NlcHQiLCJsaXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzIiwicGVyc29uVG9EZWNsaW5lIiwiZHVtbXkiLCJyZWFsRmluYWwiLCJ1bmlxdWUiLCJ4IiwicHVzaCIsIm5hbWUiLCJwYXNzd29yZCIsInRoZW4iLCJjYXRjaCIsIm1vdmllTmFtZSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJ2YWx1ZSIsInJlc3BvbnNlIiwiZXJyIiwiZnJpZW5kIiwidG9TZW5kIiwicmVxdWVzdGVlIiwicXVlcnkiLCJvcHRpb25zIiwic2VhcmNoTW92aWUiLCJ0YXJnZXRTdGF0ZSIsImdldEN1cnJlbnRGcmllbmRzIiwic2VuZFJlcXVlc3QiLCJwZXJzb24iLCJmcmllbmRzMSIsImZyaWVuZHMyIiwicHBsWW91Q2FudFNlbmRUbyIsImluZGV4T2YiLCJmYWRlSW4iLCJmYWRlT3V0IiwiY29uY2F0IiwiZXJyb3IiLCJ0b3AiLCJib3R0b20iLCJvbiIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJmcmllbmROYW1lIiwiaHRtbCIsImdldCIsInNlbGYiLCJhamF4IiwidXJsIiwidHlwZSIsImRhdGEiLCJyZXF1ZXN0b3IiLCJzdWNjZXNzIiwiY2hhbmdlVmlld3MiLCJiaW5kIiwic2V0Q3VycmVudFVzZXIiLCJmaW5kTW92aWVCdWRkaWVzIiwibG9nb3V0IiwiZ2V0TW92aWUiLCJhY2NlcHRGcmllbmQiLCJkZWNsaW5lRnJpZW5kIiwibWFwIiwicmVxdWVzdFR5cCIsIm1lc3NhZ2UiLCJyZW1vdmVSZXF1ZXN0Iiwic2VuZFdhdGNoUmVxdWVzdCIsImZvY3VzT25GcmllbmQiLCJsaXN0UG90ZW50aWFscyIsImNoYW5nZVZpZXdzTW92aWUiLCJjaGFuZ2VWaWV3c0ZyaWVuZHMiLCJidWRkeVJlcXVlc3QiLCJSZWFjdCIsIkNvbXBvbmVudCIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQU1BLEc7OztBQUNKLGVBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSwwR0FDWEEsS0FEVzs7QUFHakIsVUFBS0MsS0FBTCxHQUFhO0FBQ1hDLFlBQUssT0FETTtBQUVYQyxzQkFBZSxFQUZKO0FBR1hDLGFBQU8sSUFISTtBQUlYQyxzQkFBZSxFQUpKO0FBS1hDLDZCQUFzQixFQUxYO0FBTVhDLGlCQUFVLEVBTkM7QUFPWEMsdUJBQWdCLEVBUEw7QUFRWEMsK0JBQXdCLEVBUmI7QUFTWEMsNkJBQXNCLEVBVFg7QUFVWEMsZ0JBQVUsSUFWQztBQVdYQyx3QkFBaUIsRUFYTjtBQVlYQyxtQkFBWSxJQVpEO0FBYVhDLDZCQUFzQjtBQWJYLEtBQWI7QUFIaUI7QUFrQmxCOzs7O3dDQUVtQjtBQUNsQixVQUFJQyxPQUFLLElBQVQ7QUFDQUMsY0FBUUMsR0FBUixDQUFZLFdBQVo7QUFDQUMsUUFBRUMsSUFBRixDQUFPQyxNQUFNLGFBQWIsRUFBMkIsRUFBQ0MsTUFBSyxNQUFOLEVBQTNCLEVBQXlDLFVBQVNDLENBQVQsRUFBV0MsQ0FBWCxFQUFjO0FBQ3JEUCxnQkFBUUMsR0FBUixDQUFZLCtDQUFaLEVBQTRESyxDQUE1RCxFQUE4REMsQ0FBOUQ7QUFDTyxhQUFLLElBQUlD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V1ksV0FBdEI7QUFDRSxvQkFBTSxLQUFLc0UsZ0JBQUwsQ0FBc0JGLElBQXRCLENBQTJCLElBQTNCLENBRFI7QUFFRSx1QkFBUyxLQUFLRCxXQUFMLENBQWlCQyxJQUFqQixDQUFzQixJQUF0QixDQUZYO0FBR0Usc0JBQVEsS0FBS0csTUFBTCxDQUFZSCxJQUFaLENBQWlCLElBQWpCO0FBSFYsY0FESjtBQU1FLGdDQUFDLFNBQUQ7QUFDRSxzQkFBUSxLQUFLYyxnQkFBTCxDQUFzQmQsSUFBdEIsQ0FBMkIsSUFBM0I7QUFEVjtBQU5GLFdBREY7QUFZRDtBQUNGOzs7O0VBOWZlaUIsTUFBTUMsUzs7QUFpZ0J4QkMsT0FBT3JHLEdBQVAsR0FBYUEsR0FBYjtBQUNBO0FBQ0EsSUFBSXFCLE1BQU0sdUJBQVY7QUFDQWdGLE9BQU9oRixHQUFQLEdBQWFBLEdBQWIiLCJmaWxlIjoiQXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgdmlldzonTG9naW4nLFxuICAgICAgZnJpZW5kc1JhdGluZ3M6W10sXG4gICAgICBtb3ZpZTogbnVsbCxcbiAgICAgIGZyaWVuZFJlcXVlc3RzOltdLFxuICAgICAgcGVuZGluZ0ZyaWVuZFJlcXVlc3RzOltdLFxuICAgICAgbXlGcmllbmRzOltdLFxuICAgICAgZnJpZW5kVG9Gb2N1c09uOicnLFxuICAgICAgaW5kaXZpZHVhbEZyaWVuZHNNb3ZpZXM6W10sXG4gICAgICBwb3RlbnRpYWxNb3ZpZUJ1ZGRpZXM6e30sXG4gICAgICB1c2VybmFtZTogbnVsbCxcbiAgICAgIHJlcXVlc3RSZXNwb25zZXM6W10sXG4gICAgICBjdXJyZW50VXNlcjpudWxsLFxuICAgICAgcmVxdWVzdHNPZkN1cnJlbnRVc2VyOltdXG4gICAgfTtcbiAgfVxuXG4gIGdldEN1cnJlbnRGcmllbmRzKCkge1xuICAgIHZhciB0aGF0PXRoaXM7XG4gICAgY29uc29sZS5sb2coJ3Rlc3RpbmdnZycpXG4gICAgJC5wb3N0KFVybCArICcvZ2V0RnJpZW5kcycse3Rlc3Q6J2luZm8nfSxmdW5jdGlvbihhLGIpIHtcbiAgICAgIGNvbnNvbGUubG9nKCd3aGF0IHlvdSBnZXQgYmFjayBmcm9tIHNlcnZlciBmb3IgZ2V0IGZyaWVuZHMnLGEsYik7XG4gICAgICAgICAgICAgZm9yICh2YXIgaT0wO2k8YS5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgICAgICBpZiAoYVtpXVsxXT09PW51bGwpe1xuICAgICAgICAgICAgICAgICAgYVtpXVsxXSA9IFwiTm8gY29tcGFyaXNvbiB0byBiZSBtYWRlXCI7XG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIH1cblxuICAgICAgIHZhciBmaW5hbD0gYS5zb3J0KGZ1bmN0aW9uKGEsYil7cmV0dXJuIGJbMV0tYVsxXX0pO1xuICAgICAgdGhhdC5zZXRTdGF0ZSh7XG4gICAgICAgIG15RnJpZW5kczpmaW5hbFxuICAgICAgfSlcbiAgICAgIGNvbnNvbGUubG9nKCd0aGVzIGFyZSBteSBmcmllbmRzISEhISEhISEhISEhISEhISEnLHRoYXQuc3RhdGUubXlGcmllbmRzKVxuICAgIH0pXG4gIH1cblxuICBhY2NlcHRGcmllbmQoYSwgbW92aWUpIHtcbiAgICB2YXIgdGhhdD10aGlzO1xuICAgIHZhciBmaW5hbD1hO1xuICAgIC8vICQoJ2J1dHRvbicpLm9uKCdjbGljaycsZnVuY3Rpb24oKSB7XG4gICAgLy8gICBjb25zb2xlLmxvZygkKHRoaXMpLmh0bWwoKSk7XG4gICAgLy8gfSlcbiAgICAvLyBjb25zb2xlLmxvZyhmaW5hbCArJ3Nob3VsZCBiZSBhY2NlcHRlZCwgZm9yIG1vdmllLi4uLicsIG1vdmllKVxuXG4gICAgJC5wb3N0KFVybCArICcvYWNjZXB0Jyx7cGVyc29uVG9BY2NlcHQ6ZmluYWwsIG1vdmllOiBtb3ZpZX0sZnVuY3Rpb24oYSxiKSB7XG4gICAgICB0aGF0Lmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKTtcbiAgICB9KVxuICAgIFxuICAgIGNvbnNvbGUubG9nKCdyZWZyZXNoZWQgaW5ib3gsIHNob3VsZCBkZWxldGUgZnJpZW5kIHJlcXVlc3Qgb24gdGhlIHNwb3QgaW5zdGVhZCBvZiBtb3ZpbmcnKVxuICB9XG5cbiAgZGVjbGluZUZyaWVuZChhLCBtb3ZpZSkge1xuICAgIHZhciB0aGF0PXRoaXM7XG4gICAgdmFyIGZpbmFsPWE7XG5cbiAgICAkLnBvc3QoVXJsICsgJy9kZWNsaW5lJyx7cGVyc29uVG9EZWNsaW5lOmZpbmFsLCBtb3ZpZTogbW92aWV9LGZ1bmN0aW9uKGEsYikge1xuICAgICAgY29uc29sZS5sb2coYSxiKVxuICAgICAgY29uc29sZS5sb2coJ3RoaXMgaXMgdGhlIHN0YXRlIGFmdGVyIGRlY2xpbmluZyBmcmllbmQsICcsIHRoYXQuc3RhdGUpO1xuICAgICAgdGhhdC5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCk7XG4gICAgfSlcbiAgfVxuXG4gIGZpbmRNb3ZpZUJ1ZGRpZXMoKSB7XG4gICAgdmFyIHRoYXQ9dGhpcztcbiAgICAkLnBvc3QoVXJsICsgJy9maW5kTW92aWVCdWRkaWVzJyx7ZHVtbXk6J2luZm8nfSxmdW5jdGlvbihhLGIpIHtcbiAgICAgIHZhciBmaW5hbD1hLnNvcnQoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYlsxXS1hWzFdfSlcbiAgICAgIHZhciBteUZyaWVuZHM9dGhhdC5zdGF0ZS5teUZyaWVuZHNcbiAgICAgICB2YXIgcmVhbEZpbmFsPVtdXG4gICAgICAgIGZvciAodmFyIGk9MDtpPGZpbmFsLmxlbmd0aDtpKyspe1xuICAgICAgICAgIHZhciB1bmlxdWU9dHJ1ZVxuICAgICAgICAgIGZvciAodmFyIHg9MDt4PG15RnJpZW5kcy5sZW5ndGg7eCsrKXtcbiAgICAgICAgICAgIGlmIChmaW5hbFtpXVswXT09PW15RnJpZW5kc1t4XVswXSl7XG4gICAgICAgICAgICAgIHVuaXF1ZT1mYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHVuaXF1ZSl7XG4gICAgICAgICAgICByZWFsRmluYWwucHVzaChmaW5hbFtpXSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG5cbiAgICAgIHRoYXQuc2V0U3RhdGUoe1xuICAgICAgICB2aWV3OlwiRk5NQlwiLFxuICAgICAgICBwb3RlbnRpYWxNb3ZpZUJ1ZGRpZXM6cmVhbEZpbmFsXG4gICAgICB9KVxuICAgICAgY29uc29sZS5sb2codGhhdC5zdGF0ZS5teUZyaWVuZHMsdGhhdC5zdGF0ZS5wb3RlbnRpYWxNb3ZpZUJ1ZGRpZXMpO1xuXG4gICAgfSlcbiAgfVxuXG4gIGNoYW5nZVZpZXcoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB2aWV3OlwiU2lnblVwXCIgXG4gICAgfSlcbiAgfVxuXG4gIHNldEN1cnJlbnRVc2VyKHVzZXJuYW1lKSB7XG4gICAgY29uc29sZS5sb2coJ2NhbGxpbmcgc2V0Q3VycmVudFVzZXInKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGN1cnJlbnRVc2VyOiB1c2VybmFtZVxuICAgIH0pXG4gIH1cblxuICBlbnRlck5ld1VzZXIobmFtZSxwYXNzd29yZCkge1xuICAgIGNvbnNvbGUubG9nKG5hbWUscGFzc3dvcmQpO1xuICAgICQucG9zdChVcmwgKyAnL3NpZ251cCcse25hbWU6bmFtZSxwYXNzd29yZDpwYXNzd29yZH0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICBjb25zb2xlLmxvZygnc3VjY2VzcycpOyBcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3VzZXJuYW1lOiBuYW1lLCB2aWV3OiBcIkhvbWVcIn0pXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24oKSB7Y29uc29sZS5sb2coJ2Vycm9yJyl9KVxuICB9XG5cbiAgZ2V0RnJpZW5kTW92aWVSYXRpbmdzKCkge1xuICAgIHZhciB0aGF0PXRoaXM7XG4gICAgY29uc29sZS5sb2coJ21vb29vb3ZpZScpO1xuICAgIHZhciBtb3ZpZU5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vdmllVG9WaWV3XCIpLnZhbHVlXG4gICAgJC5wb3N0KFVybCArICcvZ2V0RnJpZW5kUmF0aW5ncycsIHsgbmFtZTogbW92aWVOYW1lIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcblxuICAgICAgdGhhdC5zZXRTdGF0ZSh7XG4gICAgICB2aWV3OlwiSG9tZVwiLFxuICAgICAgZnJpZW5kc1JhdGluZ3M6cmVzcG9uc2VcbiAgICB9KVxuICAgIGNvbnNvbGUubG9nKCdvdXIgcmVzcG9uc2UnLHRoYXQuc3RhdGUuZnJpZW5kc1JhdGluZ3MpXG5cbiAgICB9KS5jYXRjaChmdW5jdGlvbihlcnIpIHtjb25zb2xlLmxvZyhlcnIpfSk7XG4gIH1cblxuICBsb2dvdXQoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICQucG9zdChVcmwgKyAnL2xvZ291dCcpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgIHRoYXQuc2V0U3RhdGUoe1xuICAgICAgICB2aWV3OlwiTG9naW5cIixcbiAgICAgICAgZnJpZW5kc1JhdGluZ3M6W10sXG4gICAgICAgIG1vdmllOiBudWxsLFxuICAgICAgICBmcmllbmRSZXF1ZXN0czpbXSxcbiAgICAgICAgcGVuZGluZ0ZyaWVuZFJlcXVlc3RzOltdLFxuICAgICAgICBteUZyaWVuZHM6W10sXG4gICAgICAgIGZyaWVuZFRvRm9jdXNPbjonJyxcbiAgICAgICAgaW5kaXZpZHVhbEZyaWVuZHNNb3ZpZXM6W10sXG4gICAgICAgIHBvdGVudGlhbE1vdmllQnVkZGllczp7fSxcbiAgICAgICAgdXNlcm5hbWU6IG51bGwsXG4gICAgICAgIHJlcXVlc3RSZXNwb25zZXM6W10sXG4gICAgICAgIGN1cnJlbnRVc2VyOm51bGwsXG4gICAgICAgIHJlcXVlc3RzT2ZDdXJyZW50VXNlcjpbXVxuXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHNlbmRXYXRjaFJlcXVlc3QoZnJpZW5kKSB7XG4gICAgdmFyIG1vdmllPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW92aWVUb1dhdGNoJykudmFsdWU7XG4gICAgdmFyIHRvU2VuZD17cmVxdWVzdGVlOmZyaWVuZCwgbW92aWU6bW92aWV9O1xuICAgIGlmIChtb3ZpZS5sZW5ndGg+MCkge1xuICAgICAgJC5wb3N0KFVybCArICcvc2VuZFdhdGNoUmVxdWVzdCcsIHRvU2VuZCAsZnVuY3Rpb24oYSxiKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGEsYik7XG4gICAgICB9KTtcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3ZpZVRvV2F0Y2gnKS52YWx1ZT0nJztcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3lvdSBuZWVkIHRvIGVudGVyIGEgbW92aWUgdG8gc2VuZCBhIHdhdGNoIHJlcXVlc3QhISEhJylcbiAgICB9XG4gIH1cblxuXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAvLy8vL21vdmllIHJlbmRlclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgLy9jYWxsIHNlYXJjaG1vdmllIGZ1bmN0aW9uXG4gIC8vd2hpY2ggZ2V0cyBwYXNzZWQgZG93biB0byB0aGUgTW92aWUgU2VhcmNoIFxuICBnZXRNb3ZpZShxdWVyeSkge1xuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgcXVlcnk6IHF1ZXJ5XG4gICAgfTtcbiAgICBcbiAgICB0aGlzLnByb3BzLnNlYXJjaE1vdmllKG9wdGlvbnMsIChtb3ZpZSkgPT4ge1xuICAgICAgY29uc29sZS5sb2cobW92aWUpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHZpZXc6XCJNb3ZpZVNlYXJjaFZpZXdcIixcbiAgICAgICAgbW92aWU6IG1vdmllXG4gICAgICB9KVxuICAgIH0pXG4gIH1cbiAgLy9zaG93IHRoZSBtb3ZpZSBzZWFyY2hlZCBpbiBmcmllbmQgbW92aWUgbGlzdFxuICAvL29udG8gdGhlIHN0YXRldmlldyBvZiBtb3ZpZXNlYXJjaHZpZXdcbiAgc2hvd01vdmllKG1vdmllKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBtb3ZpZTogbW92aWVcbiAgICB9KVxuICB9XG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAvLy8vL05hdiBjaGFuZ2VcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIGNoYW5nZVZpZXdzKHRhcmdldFN0YXRlKSB7XG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZSk7XG4gICAgdmFyIHRoYXQ9dGhpcztcblxuICAgIGlmICh0YXJnZXRTdGF0ZT09PSdGcmllbmRzJyl7XG4gICAgICBjb25zb2xlLmxvZygneW91IHN3aXRjaGVkIHRvIGZyaWVuZHMhIScpXG4gICAgICB0aGlzLmdldEN1cnJlbnRGcmllbmRzKClcbiAgICAgIHRoaXMuc2VuZFJlcXVlc3QoKTtcblxuICAgICAgXG4gICAgfVxuXG4gICBcbiAgICBpZiAodGFyZ2V0U3RhdGU9PT0nSG9tZScpe1xuICAgICAgdGhpcy5nZXRDdXJyZW50RnJpZW5kcygpXG4gICAgICB0aGlzLnNlbmRSZXF1ZXN0KCk7XG4gICAgICBcbiAgICB9XG5cblxuXG4gICAgIGlmICh0YXJnZXRTdGF0ZT09PVwiSW5ib3hcIil7XG4gICAgICAgdGhpcy5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKClcbiAgICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB2aWV3OiB0YXJnZXRTdGF0ZVxuICAgIH0pO1xuICB9XG5cbiAgY2hhbmdlVmlld3NNb3ZpZSh0YXJnZXRTdGF0ZSwgbW92aWUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHZpZXc6IHRhcmdldFN0YXRlLFxuICAgICAgbW92aWU6IG1vdmllXG4gICAgfSk7XG4gIH1cblxuICBjaGFuZ2VWaWV3c0ZyaWVuZHModGFyZ2V0U3RhdGUsIGZyaWVuZCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdmlldzogdGFyZ2V0U3RhdGUsXG4gICAgICBmcmllbmRUb0ZvY3VzT246IGZyaWVuZFxuICAgIH0pO1xuICB9XG5cblxuICBidWRkeVJlcXVlc3QoYSkge1xuICAgIHRoaXMuc2VuZFJlcXVlc3QoYSk7XG4gIH1cblxuXG4gIHNlbmRSZXF1ZXN0KGEpIHtcbmNvbnNvbGUubG9nKCdzZW5kIHJlcXVlc3QgaXMgYmVpbmcgcnVuISEnKVxuICAgIHZhciB0aGF0PXRoaXM7XG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kRnJpZW5kQnlOYW1lJykhPT1udWxsKXtcbiAgICAgIHZhciBwZXJzb249ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRGcmllbmRCeU5hbWUnKS52YWx1ZVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcGVyc29uID0gYSB8fCAndGVzdCc7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdwZXJzb246JyxwZXJzb24pXG4gICAgY29uc29sZS5sb2coJ3N0YXRlJywgdGhpcy5zdGF0ZSk7XG4gICAgY29uc29sZS5sb2coJ2xpbmUgMjQ4Jyx0aGlzLnN0YXRlLm15RnJpZW5kcylcbiAgICB2YXIgZnJpZW5kczE9W107XG4gICAgdmFyIGZyaWVuZHMyPVtdXG4gICAgZm9yICh2YXIgaT0wO2k8dGhpcy5zdGF0ZS5teUZyaWVuZHMubGVuZ3RoO2krKyl7XG4gICAgICBjb25zb2xlLmxvZygnbGluZSAyNTEnLHRoaXMuc3RhdGUubXlGcmllbmRzW2ldKVxuICAgICAgZnJpZW5kczEucHVzaCh0aGlzLnN0YXRlLm15RnJpZW5kc1tpXVswXSk7XG4gICAgICBmcmllbmRzMi5wdXNoKHRoaXMuc3RhdGUubXlGcmllbmRzW2ldWzBdKVxuICAgIH1cblxuICAgIGZvciAodmFyIGk9MDtpPHRoaXMuc3RhdGUucmVxdWVzdHNPZkN1cnJlbnRVc2VyLmxlbmd0aDtpKyspe1xuICAgICAgZnJpZW5kczEucHVzaCh0aGlzLnN0YXRlLnJlcXVlc3RzT2ZDdXJyZW50VXNlcltpXSlcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgYWxzbyBiZSBteSBmcmllbmRzJyx0aGlzLnN0YXRlLm15RnJpZW5kcyxmcmllbmRzMSxmcmllbmRzMilcblxuXG4gICAgdmFyIHBwbFlvdUNhbnRTZW5kVG89ZnJpZW5kczE7XG4gICAgY29uc29sZS5sb2coJ3RvZicsZnJpZW5kczEuaW5kZXhPZihwZXJzb24pIT09IC0xLCBmcmllbmRzMS5sZW5ndGghPT0wKVxuICAgIGlmIChmcmllbmRzMS5pbmRleE9mKHBlcnNvbikhPT0gLTEgJiYgZnJpZW5kczEubGVuZ3RoIT09MCl7XG4gICAgICAkKFwiI0FscmVhZHlSZXFcIikuZmFkZUluKDEwMDApO1xuICAgICAgJChcIiNBbHJlYWR5UmVxXCIpLmZhZGVPdXQoMTAwMCk7XG4gICAgICBjb25zb2xlLmxvZygndGhpcyBwZXJzb24gaXMgYWxyZWFkeSBpbiB0aGVyZSEhJylcbiAgICB9IGVsc2UgaWYgKHBlcnNvbi5sZW5ndGg9PT0wKSB7XG4gICAgICAkKFwiI2VudGVyUmVhbEZyaWVuZFwiKS5mYWRlSW4oMTAwMCk7XG4gICAgICAkKFwiI2VudGVyUmVhbEZyaWVuZFwiKS5mYWRlT3V0KDEwMDApO1xuICAgIH0gZWxzZSB7XG5cblxuICAgICAgJC5wb3N0KFVybCArICcvc2VuZFJlcXVlc3QnLHtuYW1lOnBlcnNvbn0sZnVuY3Rpb24oYSxiKSB7XG4gICAgICAgXG4gICAgICAgICAgdGhhdC5zZXRTdGF0ZSh7XG4gICAgICAgICAgICByZXF1ZXN0c09mQ3VycmVudFVzZXI6YS5jb25jYXQoW3BlcnNvbl0pXG4gICAgICAgICAgfSlcbiAgICAgICAgICBjb25zb2xlLmxvZygnbGluZSAyODEnLHRoYXQuc3RhdGUucmVxdWVzdHNPZkN1cnJlbnRVc2VyKTtcblxuICAgICAgICAkKFwiI3JlcVNlbnRcIikuZmFkZUluKDEwMDApO1xuICAgICAgICAkKFwiI3JlcVNlbnRcIikuZmFkZU91dCgxMDAwKTtcbiAgICAgIH0pO1xuICAgICAgaWYgKCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZEZyaWVuZEJ5TmFtZScpIT09bnVsbCl7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kRnJpZW5kQnlOYW1lJykudmFsdWUgPSAnJztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBsaXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCkge1xuICAgIHZhciB0aGF0PXRoaXM7XG4gICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGxpc3QgZnJpZW5kIHJlcXMnKVxuICAgICQucG9zdChVcmwgKyAnL2xpc3RSZXF1ZXN0cycsZnVuY3Rpb24ocmVzcG9uc2UsZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdSZXNwb25zZSBJIGdldCEhISEhISEnLHJlc3BvbnNlKTtcbiAgICAgIHZhciB0b3A9W11cbiAgICAgIHZhciBib3R0b209W11cbiAgICAgIGNvbnNvbGUubG9nKCd0cicsIHJlc3BvbnNlKVxuICAgICAgZm9yICh2YXIgaT0wO2k8cmVzcG9uc2VbMF0ubGVuZ3RoO2krKyl7XG4gICAgICAgIGlmIChyZXNwb25zZVswXVtpXVsncmVxdWVzdG9yJ10hPT1yZXNwb25zZVsxXSAmJiByZXNwb25zZVswXVtpXVsncmVzcG9uc2UnXT09PW51bGwgKXtcbiAgICAgICAgICB0b3AucHVzaChyZXNwb25zZVswXVtpXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3BvbnNlWzBdW2ldWydyZXF1ZXN0b3InXT09PXJlc3BvbnNlWzFdICYmcmVzcG9uc2VbMF1baV1bJ3Jlc3BvbnNlJ10hPT1udWxsICYmIHJlc3BvbnNlWzBdW2ldWydyZXF1ZXN0ZWUnXSE9PSd0ZXN0Jyl7XG4gICAgICAgICAgYm90dG9tLnB1c2gocmVzcG9uc2VbMF1baV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoYXQuc2V0U3RhdGUoe1xuICAgICAgICBwZW5kaW5nRnJpZW5kUmVxdWVzdHM6dG9wLFxuICAgICAgICByZXF1ZXN0UmVzcG9uc2VzOmJvdHRvbVxuICAgICAgfSlcbiAgICB9KTtcbiAgfTtcblxuICBmb2N1c09uRnJpZW5kKGZyaWVuZCkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAkKCcuZnJpZW5kRW50cnlJbmRpdmlkdWFsJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB2YXIgZnJpZW5kTmFtZSA9ICQodGhpcykuaHRtbCgpO1xuXG4gICAgICB0aGF0LnNldFN0YXRlKHtcbiAgICAgICAgdmlldzonc2luZ2xlRnJpZW5kJyxcbiAgICAgICAgZnJpZW5kVG9Gb2N1c09uOiBmcmllbmRcbiAgICAgIH0pO1xuXG4gICAgICAkLmdldChVcmwgKyAnL2dldEZyaWVuZFVzZXJSYXRpbmdzJyx7ZnJpZW5kTmFtZTogZnJpZW5kfSxmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhmcmllbmQpXG4gICAgICAgIGNvbnNvbGUubG9nKCdnZXR0aW5nIGZyaWVuZCBtb3ZpZXM6JywgcmVzcG9uc2UpO1xuICAgICAgICB0aGF0LnNldFN0YXRlKHtcbiAgICAgICAgICBpbmRpdmlkdWFsRnJpZW5kc01vdmllczogcmVzcG9uc2VcbiAgICAgICAgfSk7XG5cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgbGlzdFBvdGVudGlhbHMoKSB7XG4gICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGxpc3QgcG90ZW50aWFsIGZyaWVuZHMnKVxuICB9XG5cbiAgcmVtb3ZlUmVxdWVzdChwZXJzb24sIHNlbGYsIG1vdmllKSB7XG4gICAgdmFyIHRoYXQ9IHRoaXM7XG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogVXJsICsgJy9yZW1vdmVSZXF1ZXN0JyxcbiAgICAgIHR5cGU6ICdERUxFVEUnLFxuICAgICAgZGF0YToge1xuICAgICAgICByZXF1ZXN0b3I6IHNlbGYsXG4gICAgICAgIHJlcXVlc3RlZTogcGVyc29uLFxuICAgICAgICBtb3ZpZTogbW92aWVcbiAgICAgIH0sXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnUkVRVUVTVCBSRU1PVkVEISBNb3ZpZSBpczogJywgbW92aWUpO1xuICAgICAgICB0aGF0Lmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKTtcbiAgICAgIH0sXG4gICAgICBlcnJvcjogZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnZpZXc9PT0nTG9naW4nKSB7XG4gICAgICByZXR1cm4gKDxMb2dJbiBjaGFuZ2VWaWV3cz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfSBzZXRDdXJyZW50VXNlcj17dGhpcy5zZXRDdXJyZW50VXNlci5iaW5kKHRoaXMpfS8+KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldz09PVwiU2lnblVwXCIpIHtcbiAgICAgIHJldHVybiAoPFNpZ25VcCBjaGFuZ2VWaWV3cz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfSBzZXRDdXJyZW50VXNlcj17dGhpcy5zZXRDdXJyZW50VXNlci5iaW5kKHRoaXMpfSAvPik7XG4gICAgfSBcbiAgICAvL3RoaXMgdmlldyBpcyBhZGRlZCBmb3IgbW92aWVzZWFyY2ggcmVuZGVyaW5nXG4gICAgZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIk1vdmllU2VhcmNoVmlld1wiKSB7XG4gICAgICByZXR1cm4gKCBcbiAgICAgICAgPGRpdj4gXG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cbiAgICAgICAgICAgIGZpbmQ9e3RoaXMuZmluZE1vdmllQnVkZGllcy5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICA8TW92aWVSYXRpbmcgXG4gICAgICAgICAgICBoYW5kbGVTZWFyY2hNb3ZpZT17dGhpcy5nZXRNb3ZpZS5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgIG1vdmllPXt0aGlzLnN0YXRlLm1vdmllfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkluYm94XCIgKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxuICAgICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIEhvbWU9e3RydWV9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPEluYm94IFxuICAgICAgICAgICAgICByZXF1ZXN0cz17dGhpcy5zdGF0ZS5wZW5kaW5nRnJpZW5kUmVxdWVzdHN9XG4gICAgICAgICAgICAgIHJlc3BvbnNlc0Fuc3dlcmVkPXt0aGlzLnN0YXRlLnJlcXVlc3RSZXNwb25zZXN9XG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX0gIFxuICAgICAgICAgICAgICBhY2NlcHQ9IHt0aGlzLmFjY2VwdEZyaWVuZC5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgICAgZGVjbGluZT17dGhpcy5kZWNsaW5lRnJpZW5kLmJpbmQodGhpcyl9IFxuICAgICAgICAgICAgICBsaXN0UmVxdWVzdHM9e3RoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cy5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgICAgcHBsV2hvV2FudFRvQmVGcmllbmRzPXt0aGlzLnN0YXRlLnBlbmRpbmdGcmllbmRSZXF1ZXN0cy5tYXAoXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oYSl7cmV0dXJuIFthLnJlcXVlc3RvcixhLnJlcXVlc3RUeXAsYS5tb3ZpZT09PW51bGw/XCJcIjogYS5tb3ZpZSxcIk1lc3NhZ2U6XCIrIGEubWVzc2FnZT09PSdudWxsJz9cIm5vbmVcIjphLm1lc3NhZ2VdfSl9IFxuICAgICAgICAgICAgICByZW1vdmU9e3RoaXMucmVtb3ZlUmVxdWVzdC5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkZyaWVuZHNcIiApIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XG4gICAgICAgICAgICAgIGZpbmQ9e3RoaXMuZmluZE1vdmllQnVkZGllcy5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX0vPlxuICAgICAgICAgIDxGcmllbmRzIFxuICAgICAgICAgICAgc2VuZFdhdGNoUmVxdWVzdD17dGhpcy5zZW5kV2F0Y2hSZXF1ZXN0LmJpbmQodGhpcyl9IFxuICAgICAgICAgICAgZm9mPSB7dGhpcy5mb2N1c09uRnJpZW5kLmJpbmQodGhpcyl9IFxuICAgICAgICAgICAgZ2V0RnJpZW5kcz17dGhpcy5nZXRDdXJyZW50RnJpZW5kcy5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgIG15RnJpZW5kcz17dGhpcy5zdGF0ZS5teUZyaWVuZHN9IFxuICAgICAgICAgICAgbGlzdFBvdGVudGlhbHM9e3RoaXMubGlzdFBvdGVudGlhbHMuYmluZCh0aGlzKX0gXG4gICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9ICBcbiAgICAgICAgICAgIHNlbmRSZXF1ZXN0PXt0aGlzLnNlbmRSZXF1ZXN0LmJpbmQodGhpcyl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgICBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiSG9tZVwiKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxuICAgICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKX0gXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8SG9tZSBcbiAgICAgICAgICAgIGNoYW5nZT17dGhpcy5jaGFuZ2VWaWV3c01vdmllLmJpbmQodGhpcyl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIlNpbmdsZU1vdmllXCIpIHtcbiAgICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgb25DbGljaz17KCk9PmNvbnNvbGUubG9nKHRoYXQuc3RhdGUpfT5cbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDxTaW5nbGVNb3ZpZVJhdGluZyBcbiAgICAgICAgICAgIGNvbXBhdGliaWxpdHk9e3RoaXMuc3RhdGUubXlGcmllbmRzfVxuICAgICAgICAgICAgY3VycmVudE1vdmllPXt0aGlzLnN0YXRlLm1vdmllfVxuICAgICAgICAgICAgY2hhbmdlPXt0aGlzLmNoYW5nZVZpZXdzRnJpZW5kcy5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgZm9mPXt0aGlzLmZvY3VzT25GcmllbmQuYmluZCh0aGlzKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXc9PT0nc2luZ2xlRnJpZW5kJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyl9IFxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPFNpbmdsZUZyaWVuZCBcbiAgICAgICAgICAgIG1vdmllc09mRnJpZW5kPXt0aGlzLnN0YXRlLmluZGl2aWR1YWxGcmllbmRzTW92aWVzfSBcbiAgICAgICAgICAgIGZyaWVuZE5hbWU9e3RoaXMuc3RhdGUuZnJpZW5kVG9Gb2N1c09ufSBcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIGNoYW5nZT17dGhpcy5jaGFuZ2VWaWV3c01vdmllLmJpbmQodGhpcyl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkZOTUJcIikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyl9IFxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPEZpbmRNb3ZpZUJ1ZGR5IFxuICAgICAgICAgICAgYnVkZHlmdW5jPXt0aGlzLmJ1ZGR5UmVxdWVzdC5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgIGJ1ZGRpZXM9e3RoaXMuc3RhdGUucG90ZW50aWFsTW92aWVCdWRkaWVzfSBcbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiTXlSYXRpbmdzXCIpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XG4gICAgICAgICAgICAgIGZpbmQ9e3RoaXMuZmluZE1vdmllQnVkZGllcy5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDxNeVJhdGluZ3MgXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NNb3ZpZS5iaW5kKHRoaXMpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cblxud2luZG93LkFwcCA9IEFwcDtcbi8vdmFyIFVybCA9ICdodHRwczovL3RoYXdpbmctaXNsYW5kLTk5NzQ3Lmhlcm9rdWFwcC5jb20nO1xudmFyIFVybCA9ICdodHRwOi8vMTI3LjAuMC4xOjMwMDAnO1xud2luZG93LlVybCA9IFVybDtcbiJdfQ==
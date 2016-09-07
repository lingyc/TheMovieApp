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
      console.log('fof being run');
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
      var _this12 = this;

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
            var that = _this12;
            return {
              v: React.createElement(
                'div',
                { onClick: function onClick() {
                    return console.log(that.state);
                  } },
                React.createElement(Nav, { name: _this12.state.currentUser,
                  onClick: _this12.changeViews.bind(_this12),
                  logout: _this12.logout.bind(_this12)
                }),
                React.createElement(SingleMovieRating, {
                  compatibility: _this12.state.myFriends,
                  currentMovie: _this12.state.movie,
                  change: _this12.changeViewsFriends.bind(_this12),
                  fof: _this12.focusOnFriend.bind(_this12)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0FwcC5qcyJdLCJuYW1lcyI6WyJBcHAiLCJwcm9wcyIsInN0YXRlIiwidmlldyIsImZyaWVuZHNSYXRpbmdzIiwibW92aWUiLCJmcmllbmRSZXF1ZXN0cyIsInBlbmRpbmdGcmllbmRSZXF1ZXN0cyIsIm15RnJpZW5kcyIsImZyaWVuZFRvRm9jdXNPbiIsImluZGl2aWR1YWxGcmllbmRzTW92aWVzIiwicG90ZW50aWFsTW92aWVCdWRkaWVzIiwidXNlcm5hbWUiLCJyZXF1ZXN0UmVzcG9uc2VzIiwiY3VycmVudFVzZXIiLCJyZXF1ZXN0c09mQ3VycmVudFVzZXIiLCJjb25zb2xlIiwibG9nIiwiJCIsInBvc3QiLCJVcmwiLCJ0ZXN0IiwiYSIsImIiLCJpIiwibGVuZ3RoIiwiZmluYWwiLCJzb3J0Iiwic2V0U3RhdGUiLCJwZXJzb25Ub0FjY2VwdCIsInJlc3AiLCJlcnIiLCJsaXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzIiwicGVyc29uVG9EZWNsaW5lIiwiZHVtbXkiLCJzb3J0ZWQiLCJ1bmlxdWVGcmllbmRzIiwidW5pcXVlIiwieCIsInB1c2giLCJuYW1lIiwicGFzc3dvcmQiLCJ0aGVuIiwiY2F0Y2giLCJtb3ZpZU5hbWUiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwidmFsdWUiLCJyZXNwb25zZSIsImZyaWVuZCIsInRvU2VuZCIsInJlcXVlc3RlZSIsInF1ZXJ5Iiwib3B0aW9ucyIsInNlYXJjaE1vdmllIiwidGFyZ2V0U3RhdGUiLCJnZXRDdXJyZW50RnJpZW5kcyIsInNlbmRSZXF1ZXN0IiwicGVyc29uIiwiY3VyckZyaWVuZHMiLCJmcmllbmRzMSIsImZyaWVuZHMyIiwiaW5kZXhPZiIsImZhZGVJbiIsImZhZGVPdXQiLCJjb25jYXQiLCJlcnJvciIsInBGUiIsInJSIiwicmVxdWVzdG9yIiwicmVzcG9uc2VUVSIsInRoYXQiLCJvbiIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJmcmllbmROYW1lIiwiaHRtbCIsImdldCIsInNlbGYiLCJhamF4IiwidXJsIiwidHlwZSIsImRhdGEiLCJzdWNjZXNzIiwiY2hhbmdlVmlld3MiLCJiaW5kIiwic2V0Q3VycmVudFVzZXIiLCJmaW5kTW92aWVCdWRkaWVzIiwibG9nb3V0IiwiZ2V0TW92aWUiLCJhY2NlcHRGcmllbmQiLCJkZWNsaW5lRnJpZW5kIiwibWFwIiwicmVxdWVzdFR5cCIsIm1lc3NhZ2UiLCJyZW1vdmVSZXF1ZXN0Iiwic2VuZFdhdGNoUmVxdWVzdCIsImZvY3VzT25GcmllbmQiLCJsaXN0UG90ZW50aWFscyIsImNoYW5nZVZpZXdzTW92aWUiLCJjaGFuZ2VWaWV3c0ZyaWVuZHMiLCJidWRkeVJlcXVlc3QiLCJSZWFjdCIsIkNvbXBvbmVudCIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQU1BLEc7OztBQUNKLGVBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSwwR0FDWEEsS0FEVzs7QUFHakIsVUFBS0MsS0FBTCxHQUFhO0FBQ1hDLFlBQU0sT0FESztBQUVYQyxzQkFBZ0IsRUFGTDtBQUdYQyxhQUFPLElBSEk7QUFJWEMsc0JBQWdCLEVBSkw7QUFLWEMsNkJBQXVCLEVBTFo7QUFNWEMsaUJBQVcsRUFOQTtBQU9YQyx1QkFBaUIsRUFQTjtBQVFYQywrQkFBeUIsRUFSZDtBQVNYQyw2QkFBdUIsRUFUWjtBQVVYQyxnQkFBVSxJQVZDO0FBV1hDLHdCQUFrQixFQVhQO0FBWVhDLG1CQUFhLElBWkY7QUFhWEMsNkJBQXVCO0FBYlosS0FBYjtBQUhpQjtBQWtCbEI7Ozs7d0NBRW1CO0FBQUE7O0FBRWxCQyxjQUFRQyxHQUFSLENBQVksV0FBWjtBQUNBQyxRQUFFQyxJQUFGLENBQU9DLE1BQU0sYUFBYixFQUEyQixFQUFDQyxNQUFLLE1BQU4sRUFBM0IsRUFBMEMsVUFBQ0MsQ0FBRCxFQUFJQyxDQUFKLEVBQVU7QUFDbERQLGdCQUFRQyxHQUFSLENBQVksK0NBQVosRUFBNERLLENBQTVELEVBQThEQyxDQUE5RDtBQUNP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QUZYO0FBR0Usc0JBQVEsS0FBS0csTUFBTCxDQUFZSCxJQUFaLENBQWlCLElBQWpCO0FBSFYsY0FESjtBQU1FLGdDQUFDLGNBQUQ7QUFDRSx5QkFBVyxLQUFLZ0IsWUFBTCxDQUFrQmhCLElBQWxCLENBQXVCLElBQXZCLENBRGI7QUFFRSx1QkFBUyxLQUFLbkYsS0FBTCxDQUFXUztBQUZ0QjtBQU5GLFdBREY7QUFhRCxTQWRNLE1BY0EsSUFBSSxLQUFLVCxLQUFMLENBQVdDLElBQVgsS0FBb0IsV0FBeEIsRUFBcUM7QUFDMUMsaUJBQ0U7QUFBQTtBQUFBO0FBQ0ksZ0NBQUMsR0FBRCxJQUFLLE1BQU0sS0FBS0QsS0FBTCxDQUFXWSxXQUF0QjtBQUNFLG9CQUFNLEtBQUt5RSxnQkFBTCxDQUFzQkYsSUFBdEIsQ0FBMkIsSUFBM0IsQ0FEUjtBQUVFLHVCQUFTLEtBQUtELFdBQUwsQ0FBaUJDLElBQWpCLENBQXNCLElBQXRCLENBRlg7QUFHRSxzQkFBUSxLQUFLRyxNQUFMLENBQVlILElBQVosQ0FBaUIsSUFBakI7QUFIVixjQURKO0FBTUUsZ0NBQUMsU0FBRDtBQUNFLHNCQUFRLEtBQUtjLGdCQUFMLENBQXNCZCxJQUF0QixDQUEyQixJQUEzQjtBQURWO0FBTkYsV0FERjtBQVlEO0FBQ0Y7Ozs7RUE5ZWVpQixNQUFNQyxTOztBQWlmeEJDLE9BQU94RyxHQUFQLEdBQWFBLEdBQWI7QUFDQTtBQUNBLElBQUlvQixNQUFNLHVCQUFWO0FBQ0FvRixPQUFPcEYsR0FBUCxHQUFhQSxHQUFiIiwiZmlsZSI6IkFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEFwcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICB2aWV3OiAnTG9naW4nLFxyXG4gICAgICBmcmllbmRzUmF0aW5nczogW10sXHJcbiAgICAgIG1vdmllOiBudWxsLFxyXG4gICAgICBmcmllbmRSZXF1ZXN0czogW10sXHJcbiAgICAgIHBlbmRpbmdGcmllbmRSZXF1ZXN0czogW10sXHJcbiAgICAgIG15RnJpZW5kczogW10sXHJcbiAgICAgIGZyaWVuZFRvRm9jdXNPbjogJycsXHJcbiAgICAgIGluZGl2aWR1YWxGcmllbmRzTW92aWVzOiBbXSxcclxuICAgICAgcG90ZW50aWFsTW92aWVCdWRkaWVzOiB7fSxcclxuICAgICAgdXNlcm5hbWU6IG51bGwsXHJcbiAgICAgIHJlcXVlc3RSZXNwb25zZXM6IFtdLFxyXG4gICAgICBjdXJyZW50VXNlcjogbnVsbCxcclxuICAgICAgcmVxdWVzdHNPZkN1cnJlbnRVc2VyOiBbXVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGdldEN1cnJlbnRGcmllbmRzKCkge1xyXG5cclxuICAgIGNvbnNvbGUubG9nKCd0ZXN0aW5nZ2cnKTtcclxuICAgICQucG9zdChVcmwgKyAnL2dldEZyaWVuZHMnLHt0ZXN0OidpbmZvJ30sIChhLCBiKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCd3aGF0IHlvdSBnZXQgYmFjayBmcm9tIHNlcnZlciBmb3IgZ2V0IGZyaWVuZHMnLGEsYik7XHJcbiAgICAgICAgICAgICBmb3IgKGxldCBpPTA7aTxhLmxlbmd0aDtpKyspe1xyXG4gICAgICAgICAgICAgICAgaWYgKGFbaV1bMV09PT1udWxsKXtcclxuICAgICAgICAgICAgICAgICAgYVtpXVsxXSA9IFwiTm8gY29tcGFyaXNvbiB0byBiZSBtYWRlXCI7XHJcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgY29uc3QgZmluYWw9IGEuc29ydChmdW5jdGlvbihhLGIpe3JldHVybiBiWzFdLWFbMV19KTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgbXlGcmllbmRzOmZpbmFsXHJcbiAgICAgIH0pXHJcbiAgICAgIGNvbnNvbGUubG9nKCd0aGVzIGFyZSBteSBmcmllbmRzISEhISEhISEhISEhISEhISEnLHRoaXMuc3RhdGUubXlGcmllbmRzKVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGFjY2VwdEZyaWVuZChwZXJzb25Ub0FjY2VwdCwgbW92aWUpIHtcclxuICAgIC8vICQoJ2J1dHRvbicpLm9uKCdjbGljaycsZnVuY3Rpb24oKSB7XHJcbiAgICAvLyAgIGNvbnNvbGUubG9nKCQodGhpcykuaHRtbCgpKTtcclxuICAgIC8vIH0pXHJcbiAgICAvLyBjb25zb2xlLmxvZyhmaW5hbCArJ3Nob3VsZCBiZSBhY2NlcHRlZCwgZm9yIG1vdmllLi4uLicsIG1vdmllKVxyXG5cclxuICAgICQucG9zdChVcmwgKyAnL2FjY2VwdCcse3BlcnNvblRvQWNjZXB0OnBlcnNvblRvQWNjZXB0LCBtb3ZpZTogbW92aWV9LChyZXNwLGVycik9PiB7XHJcbiAgICAgIHRoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpO1xyXG4gICAgfSlcclxuICAgIFxyXG4gICAgY29uc29sZS5sb2coJ3JlZnJlc2hlZCBpbmJveCwgc2hvdWxkIGRlbGV0ZSBmcmllbmQgcmVxdWVzdCBvbiB0aGUgc3BvdCBpbnN0ZWFkIG9mIG1vdmluZycpXHJcbiAgfVxyXG5cclxuICBkZWNsaW5lRnJpZW5kKHBlcnNvblRvRGVjbGluZSwgbW92aWUpIHtcclxuICAgICQucG9zdChVcmwgKyAnL2RlY2xpbmUnLHtwZXJzb25Ub0RlY2xpbmU6cGVyc29uVG9EZWNsaW5lLCBtb3ZpZTogbW92aWV9LChyZXNwLCBlcnIpPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgc3RhdGUgYWZ0ZXIgZGVjbGluaW5nIGZyaWVuZCwgJywgdGhpcy5zdGF0ZSk7XHJcbiAgICAgIHRoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBmaW5kTW92aWVCdWRkaWVzKCkge1xyXG4gICBcclxuICAgICQucG9zdChVcmwgKyAnL2ZpbmRNb3ZpZUJ1ZGRpZXMnLHtkdW1teTonaW5mbyd9LChyZXNwLCBlcnIpPT4ge1xyXG4gICAgICBjb25zdCBzb3J0ZWQ9cmVzcC5zb3J0KGZ1bmN0aW9uKGEsYil7cmV0dXJuIGJbMV0tYVsxXX0pO1xyXG4gICAgICBjb25zdCBteUZyaWVuZHM9dGhpcy5zdGF0ZS5teUZyaWVuZHM7XHJcbiAgICAgICBjb25zdCB1bmlxdWVGcmllbmRzPVtdO1xyXG4gICAgICAgIGZvciAobGV0IGk9MDtpPHNvcnRlZC5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgIGxldCB1bmlxdWU9dHJ1ZTtcclxuICAgICAgICAgIGZvciAobGV0IHg9MDt4PG15RnJpZW5kcy5sZW5ndGg7eCsrKXtcclxuICAgICAgICAgICAgaWYgKHNvcnRlZFtpXVswXT09PW15RnJpZW5kc1t4XVswXSl7XHJcbiAgICAgICAgICAgICAgdW5pcXVlPWZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAodW5pcXVlKXtcclxuICAgICAgICAgICAgdW5pcXVlRnJpZW5kcy5wdXNoKHNvcnRlZFtpXSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICB2aWV3OlwiRk5NQlwiLFxyXG4gICAgICAgIHBvdGVudGlhbE1vdmllQnVkZGllczp1bmlxdWVGcmllbmRzXHJcbiAgICAgIH0pXHJcblxyXG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlLm15RnJpZW5kcyx0aGlzLnN0YXRlLnBvdGVudGlhbE1vdmllQnVkZGllcyk7XHJcblxyXG4gICAgfSlcclxuICB9XHJcblxyXG5cclxuICBjaGFuZ2VWaWV3KCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6XCJTaWduVXBcIiBcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBzZXRDdXJyZW50VXNlcih1c2VybmFtZSkge1xyXG4gICAgY29uc29sZS5sb2coJ2NhbGxpbmcgc2V0Q3VycmVudFVzZXInKTtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBjdXJyZW50VXNlcjogdXNlcm5hbWVcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICBlbnRlck5ld1VzZXIobmFtZSxwYXNzd29yZCkge1xyXG4gICAgY29uc29sZS5sb2cobmFtZSxwYXNzd29yZCk7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9zaWdudXAnLHtuYW1lOm5hbWUscGFzc3dvcmQ6cGFzc3dvcmR9KS50aGVuKCgpPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZygnc3VjY2VzcycpOyBcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7dXNlcm5hbWU6IG5hbWUsIHZpZXc6IFwiSG9tZVwifSlcclxuICAgIH0pLmNhdGNoKCgpPT4ge2NvbnNvbGUubG9nKCdlcnJvcicpfSlcclxuICB9XHJcblxyXG4gIGdldEZyaWVuZE1vdmllUmF0aW5ncygpIHtcclxuICAgIGxldCBtb3ZpZU5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vdmllVG9WaWV3XCIpLnZhbHVlXHJcbiAgICAkLnBvc3QoVXJsICsgJy9nZXRGcmllbmRSYXRpbmdzJywgeyBuYW1lOiBtb3ZpZU5hbWUgfSkudGhlbihyZXNwb25zZT0+IHtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6XCJIb21lXCIsXHJcbiAgICAgIGZyaWVuZHNSYXRpbmdzOnJlc3BvbnNlXHJcbiAgICB9KVxyXG4gICAgY29uc29sZS5sb2coJ291ciByZXNwb25zZScsdGhpcy5zdGF0ZS5mcmllbmRzUmF0aW5ncylcclxuICAgIH0pLmNhdGNoKGVycj0+IHtjb25zb2xlLmxvZyhlcnIpfSk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuICBsb2dvdXQoKSB7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9sb2dvdXQnKS50aGVuKHJlc3BvbnNlPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHZpZXc6XCJMb2dpblwiLFxyXG4gICAgICAgIGZyaWVuZHNSYXRpbmdzOltdLFxyXG4gICAgICAgIG1vdmllOiBudWxsLFxyXG4gICAgICAgIGZyaWVuZFJlcXVlc3RzOltdLFxyXG4gICAgICAgIHBlbmRpbmdGcmllbmRSZXF1ZXN0czpbXSxcclxuICAgICAgICBteUZyaWVuZHM6W10sXHJcbiAgICAgICAgZnJpZW5kVG9Gb2N1c09uOicnLFxyXG4gICAgICAgIGluZGl2aWR1YWxGcmllbmRzTW92aWVzOltdLFxyXG4gICAgICAgIHBvdGVudGlhbE1vdmllQnVkZGllczp7fSxcclxuICAgICAgICB1c2VybmFtZTogbnVsbCxcclxuICAgICAgICByZXF1ZXN0UmVzcG9uc2VzOltdLFxyXG4gICAgICAgIGN1cnJlbnRVc2VyOm51bGwsXHJcbiAgICAgICAgcmVxdWVzdHNPZkN1cnJlbnRVc2VyOltdXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZW5kV2F0Y2hSZXF1ZXN0KGZyaWVuZCkge1xyXG4gICAgY29uc3QgbW92aWU9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3ZpZVRvV2F0Y2gnKS52YWx1ZTtcclxuICAgIGNvbnN0IHRvU2VuZD17cmVxdWVzdGVlOmZyaWVuZCwgbW92aWU6bW92aWV9O1xyXG4gICAgaWYgKG1vdmllLmxlbmd0aCkge1xyXG4gICAgICAkLnBvc3QoVXJsICsgJy9zZW5kV2F0Y2hSZXF1ZXN0JywgdG9TZW5kLCAocmVzcCwgZXJyKT0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhyZXNwLCBlcnIpO1xyXG4gICAgICB9KTtcclxuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vdmllVG9XYXRjaCcpLnZhbHVlPScnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2coJ3lvdSBuZWVkIHRvIGVudGVyIGEgbW92aWUgdG8gc2VuZCBhIHdhdGNoIHJlcXVlc3QhISEhJylcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLy8vL21vdmllIHJlbmRlclxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vY2FsbCBzZWFyY2htb3ZpZSBmdW5jdGlvblxyXG4gIC8vd2hpY2ggZ2V0cyBwYXNzZWQgZG93biB0byB0aGUgTW92aWUgU2VhcmNoIFxyXG4gIGdldE1vdmllKHF1ZXJ5KSB7XHJcbiAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICBxdWVyeTogcXVlcnlcclxuICAgIH07XHJcbiAgICBcclxuICAgIHRoaXMucHJvcHMuc2VhcmNoTW92aWUob3B0aW9ucywgbW92aWUgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhtb3ZpZSk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHZpZXc6XCJNb3ZpZVNlYXJjaFZpZXdcIixcclxuICAgICAgICBtb3ZpZTogbW92aWVcclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgfVxyXG4gIC8vc2hvdyB0aGUgbW92aWUgc2VhcmNoZWQgaW4gZnJpZW5kIG1vdmllIGxpc3RcclxuICAvL29udG8gdGhlIHN0YXRldmlldyBvZiBtb3ZpZXNlYXJjaHZpZXdcclxuICBzaG93TW92aWUobW92aWUpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBtb3ZpZTogbW92aWVcclxuICAgIH0pXHJcbiAgfVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIC8vLy8vTmF2IGNoYW5nZVxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gIGNoYW5nZVZpZXdzKHRhcmdldFN0YXRlKSB7XHJcbiAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlKTtcclxuXHJcbiAgICBpZiAodGFyZ2V0U3RhdGU9PT0nRnJpZW5kcycpe1xyXG4gICAgICBjb25zb2xlLmxvZygneW91IHN3aXRjaGVkIHRvIGZyaWVuZHMhIScpXHJcbiAgICAgIHRoaXMuZ2V0Q3VycmVudEZyaWVuZHMoKVxyXG4gICAgICB0aGlzLnNlbmRSZXF1ZXN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRhcmdldFN0YXRlPT09J0hvbWUnKXtcclxuICAgICAgdGhpcy5nZXRDdXJyZW50RnJpZW5kcygpXHJcbiAgICAgIHRoaXMuc2VuZFJlcXVlc3QoKTtcclxuICAgIH1cclxuXHJcbiAgICAgaWYgKHRhcmdldFN0YXRlPT09XCJJbmJveFwiKXtcclxuICAgICAgIHRoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpXHJcbiAgICAgfVxyXG5cclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OiB0YXJnZXRTdGF0ZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcblxyXG4gIGNoYW5nZVZpZXdzTW92aWUodGFyZ2V0U3RhdGUsIG1vdmllKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzogdGFyZ2V0U3RhdGUsXHJcbiAgICAgIG1vdmllOiBtb3ZpZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjaGFuZ2VWaWV3c0ZyaWVuZHModGFyZ2V0U3RhdGUsIGZyaWVuZCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6IHRhcmdldFN0YXRlLFxyXG4gICAgICBmcmllbmRUb0ZvY3VzT246IGZyaWVuZFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgYnVkZHlSZXF1ZXN0KHBlcnNvbikge1xyXG4gICAgdGhpcy5zZW5kUmVxdWVzdChwZXJzb24pO1xyXG4gIH1cclxuXHJcblxyXG4gIHNlbmRSZXF1ZXN0KGEpIHtcclxuY29uc29sZS5sb2coJ3NlbmQgcmVxdWVzdCBpcyBiZWluZyBydW4hIScpXHJcblxyXG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kRnJpZW5kQnlOYW1lJykhPT1udWxsKXtcclxuICAgICAgdmFyIHBlcnNvbj1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZEZyaWVuZEJ5TmFtZScpLnZhbHVlXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgcGVyc29uID0gYSB8fCAndGVzdCc7XHJcbiAgICB9XHJcbiAgICBjb25zdCBjdXJyRnJpZW5kcz10aGlzLnN0YXRlLm15RnJpZW5kcztcclxuICAgIGNvbnN0IGZyaWVuZHMxPVtdO1xyXG4gICAgY29uc3QgZnJpZW5kczI9W11cclxuICAgIGZvciAodmFyIGk9MDtpPGN1cnJGcmllbmRzLmxlbmd0aDtpKyspe1xyXG4gICAgICBjb25zb2xlLmxvZygnbGluZSAyNTEnLGN1cnJGcmllbmRzW2ldKVxyXG4gICAgICBmcmllbmRzMS5wdXNoKGN1cnJGcmllbmRzW2ldWzBdKTtcclxuICAgICAgZnJpZW5kczIucHVzaChjdXJyRnJpZW5kc1tpXVswXSlcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKHZhciBpPTA7aTx0aGlzLnN0YXRlLnJlcXVlc3RzT2ZDdXJyZW50VXNlci5sZW5ndGg7aSsrKXtcclxuICAgICAgZnJpZW5kczEucHVzaCh0aGlzLnN0YXRlLnJlcXVlc3RzT2ZDdXJyZW50VXNlcltpXSlcclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgYWxzbyBiZSBteSBmcmllbmRzJyxwZXJzb24sIGN1cnJGcmllbmRzLGZyaWVuZHMxLGZyaWVuZHMyKVxyXG5cclxuICAgIC8vY29uc29sZS5sb2coJ3RvZicsZnJpZW5kczEuaW5kZXhPZihwZXJzb24pIT09IC0xLCBmcmllbmRzMS5sZW5ndGghPT0wKVxyXG4gICAgaWYgKGZyaWVuZHMxLmluZGV4T2YocGVyc29uKSE9PSAtMSAmJiBmcmllbmRzMS5sZW5ndGghPT0wKXtcclxuICAgICAgJChcIiNBbHJlYWR5UmVxXCIpLmZhZGVJbigxMDAwKTtcclxuICAgICAgJChcIiNBbHJlYWR5UmVxXCIpLmZhZGVPdXQoMTAwMCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCd0aGlzIHBlcnNvbiBpcyBhbHJlYWR5IGluIHRoZXJlISEnKVxyXG4gICAgfSBlbHNlIGlmICghcGVyc29uLmxlbmd0aCkge1xyXG4gICAgICAkKFwiI2VudGVyUmVhbEZyaWVuZFwiKS5mYWRlSW4oMTAwMCk7XHJcbiAgICAgICQoXCIjZW50ZXJSZWFsRnJpZW5kXCIpLmZhZGVPdXQoMTAwMCk7XHJcbiAgICB9IGVsc2Uge1xyXG5cclxuY29uc29sZS5sb2coJ3BlcnNvbiBpcyBkZWZpbmVkPycscGVyc29uKTtcclxuICAgICAgJC5wb3N0KFVybCArICcvc2VuZFJlcXVlc3QnLHtuYW1lOnBlcnNvbn0sIChyZXNwLCBlcnIpPT4ge1xyXG4gICAgICAgXHJcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgcmVxdWVzdHNPZkN1cnJlbnRVc2VyOnJlc3AuY29uY2F0KFtwZXJzb25dKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdsaW5lIDI4MScsdGhpcy5zdGF0ZS5yZXF1ZXN0c09mQ3VycmVudFVzZXIpO1xyXG5cclxuICAgICAgICAkKFwiI3JlcVNlbnRcIikuZmFkZUluKDEwMDApO1xyXG4gICAgICAgICQoXCIjcmVxU2VudFwiKS5mYWRlT3V0KDEwMDApO1xyXG4gICAgICB9KTtcclxuICAgICAgaWYgKCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZEZyaWVuZEJ5TmFtZScpIT09bnVsbCl7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRGcmllbmRCeU5hbWUnKS52YWx1ZSA9ICcnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBsaXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCkge1xyXG4gICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGxpc3QgZnJpZW5kIHJlcXMnKVxyXG4gICAgJC5wb3N0KFVybCArICcvbGlzdFJlcXVlc3RzJywgKHJlc3BvbnNlLCBlcnJvcik9PiB7XHJcbiAgICAgIGNvbnN0IHBGUj1bXTtcclxuICAgICAgY29uc3QgclI9W107XHJcbiAgICAgIGNvbnNvbGUubG9nKCdyZXNwb25zZSB0byBscGZyJywgcmVzcG9uc2UpO1xyXG5cclxuICAgICAgZm9yICh2YXIgaT0wO2k8cmVzcG9uc2VbMF0ubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgY29uc3QgcmVxdWVzdG9yPXJlc3BvbnNlWzBdW2ldWydyZXF1ZXN0b3InXTtcclxuICAgICAgICBjb25zdCByZXNwb25zZVRVPSByZXNwb25zZVswXVtpXVsncmVzcG9uc2UnXTtcclxuICAgICAgICBpZiAocmVxdWVzdG9yIT09cmVzcG9uc2VbMV0gJiYgcmVzcG9uc2VUVT09PW51bGwgKXtcclxuICAgICAgICAgIHBGUi5wdXNoKHJlc3BvbnNlWzBdW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlcXVlc3Rvcj09PXJlc3BvbnNlWzFdICYmcmVzcG9uc2VUVSE9PW51bGwgJiYgcmVzcG9uc2VbMF1baV1bJ3JlcXVlc3RlZSddIT09J3Rlc3QnKXtcclxuICAgICAgICAgIHJSLnB1c2gocmVzcG9uc2VbMF1baV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgcGVuZGluZ0ZyaWVuZFJlcXVlc3RzOnBGUixcclxuICAgICAgICByZXF1ZXN0UmVzcG9uc2VzOnJSXHJcbiAgICAgIH0pXHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBmb2N1c09uRnJpZW5kKGZyaWVuZCkge1xyXG4gICAgY29uc29sZS5sb2coJ2ZvZiBiZWluZyBydW4nKTtcclxuICAgIGNvbnN0IHRoYXQ9dGhpcztcclxuICAgICQoJy5mcmllbmRFbnRyeUluZGl2aWR1YWwnKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBjb25zdCBmcmllbmROYW1lID0gJCh0aGlzKS5odG1sKCk7XHJcblxyXG4gICAgICB0aGF0LnNldFN0YXRlKHtcclxuICAgICAgICB2aWV3OidzaW5nbGVGcmllbmQnLFxyXG4gICAgICAgIGZyaWVuZFRvRm9jdXNPbjogZnJpZW5kXHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgJC5nZXQoVXJsICsgJy9nZXRGcmllbmRVc2VyUmF0aW5ncycse2ZyaWVuZE5hbWU6IGZyaWVuZH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZnJpZW5kKVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdnZXR0aW5nIGZyaWVuZCBtb3ZpZXM6JywgcmVzcG9uc2UpO1xyXG4gICAgICAgIHRoYXQuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgaW5kaXZpZHVhbEZyaWVuZHNNb3ZpZXM6IHJlc3BvbnNlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBsaXN0UG90ZW50aWFscygpIHtcclxuICAgIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBsaXN0IHBvdGVudGlhbCBmcmllbmRzJylcclxuICB9XHJcblxyXG4gIHJlbW92ZVJlcXVlc3QocGVyc29uLCBzZWxmLCBtb3ZpZSkge1xyXG4gICAgdmFyIHRoYXQ9IHRoaXM7XHJcbiAgICAkLmFqYXgoe1xyXG4gICAgICB1cmw6IFVybCArICcvcmVtb3ZlUmVxdWVzdCcsXHJcbiAgICAgIHR5cGU6ICdERUxFVEUnLFxyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgcmVxdWVzdG9yOiBzZWxmLFxyXG4gICAgICAgIHJlcXVlc3RlZTogcGVyc29uLFxyXG4gICAgICAgIG1vdmllOiBtb3ZpZVxyXG4gICAgICB9LFxyXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdSRVFVRVNUIFJFTU9WRUQhIE1vdmllIGlzOiAnLCBtb3ZpZSk7XHJcbiAgICAgICAgdGhhdC5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGVycm9yOiBmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICBpZiAodGhpcy5zdGF0ZS52aWV3PT09J0xvZ2luJykge1xyXG4gICAgICByZXR1cm4gKDxMb2dJbiBjaGFuZ2VWaWV3cz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfSBzZXRDdXJyZW50VXNlcj17dGhpcy5zZXRDdXJyZW50VXNlci5iaW5kKHRoaXMpfS8+KTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3PT09XCJTaWduVXBcIikge1xyXG4gICAgICByZXR1cm4gKDxTaWduVXAgY2hhbmdlVmlld3M9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX0gc2V0Q3VycmVudFVzZXI9e3RoaXMuc2V0Q3VycmVudFVzZXIuYmluZCh0aGlzKX0gLz4pO1xyXG4gICAgfSBcclxuICAgIC8vdGhpcyB2aWV3IGlzIGFkZGVkIGZvciBtb3ZpZXNlYXJjaCByZW5kZXJpbmdcclxuICAgIGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJNb3ZpZVNlYXJjaFZpZXdcIikge1xyXG4gICAgICByZXR1cm4gKCBcclxuICAgICAgICA8ZGl2PiBcclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cclxuICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfSBcclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgIDxNb3ZpZVJhdGluZyBcclxuICAgICAgICAgICAgaGFuZGxlU2VhcmNoTW92aWU9e3RoaXMuZ2V0TW92aWUuYmluZCh0aGlzKX0gXHJcbiAgICAgICAgICAgIG1vdmllPXt0aGlzLnN0YXRlLm1vdmllfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJJbmJveFwiICkge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cclxuICAgICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAgIEhvbWU9e3RydWV9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgIDxJbmJveCBcclxuICAgICAgICAgICAgICByZXF1ZXN0cz17dGhpcy5zdGF0ZS5wZW5kaW5nRnJpZW5kUmVxdWVzdHN9XHJcbiAgICAgICAgICAgICAgcmVzcG9uc2VzQW5zd2VyZWQ9e3RoaXMuc3RhdGUucmVxdWVzdFJlc3BvbnNlc31cclxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9ICBcclxuICAgICAgICAgICAgICBhY2NlcHQ9IHt0aGlzLmFjY2VwdEZyaWVuZC5iaW5kKHRoaXMpfSBcclxuICAgICAgICAgICAgICBkZWNsaW5lPXt0aGlzLmRlY2xpbmVGcmllbmQuYmluZCh0aGlzKX0gXHJcbiAgICAgICAgICAgICAgbGlzdFJlcXVlc3RzPXt0aGlzLmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMuYmluZCh0aGlzKX0gXHJcbiAgICAgICAgICAgICAgcHBsV2hvV2FudFRvQmVGcmllbmRzPXt0aGlzLnN0YXRlLnBlbmRpbmdGcmllbmRSZXF1ZXN0cy5tYXAoXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihhKXtyZXR1cm4gW2EucmVxdWVzdG9yLGEucmVxdWVzdFR5cCxhLm1vdmllPT09bnVsbD9cIlwiOiBhLm1vdmllLFwiTWVzc2FnZTpcIisgYS5tZXNzYWdlPT09J251bGwnP1wibm9uZVwiOmEubWVzc2FnZV19KX0gXHJcbiAgICAgICAgICAgICAgcmVtb3ZlPXt0aGlzLnJlbW92ZVJlcXVlc3QuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkZyaWVuZHNcIiApIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XHJcbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX0vPlxyXG4gICAgICAgICAgPEZyaWVuZHMgXHJcbiAgICAgICAgICAgIHNlbmRXYXRjaFJlcXVlc3Q9e3RoaXMuc2VuZFdhdGNoUmVxdWVzdC5iaW5kKHRoaXMpfSBcclxuICAgICAgICAgICAgZm9mPSB7dGhpcy5mb2N1c09uRnJpZW5kLmJpbmQodGhpcyl9IFxyXG4gICAgICAgICAgICBnZXRGcmllbmRzPXt0aGlzLmdldEN1cnJlbnRGcmllbmRzLmJpbmQodGhpcyl9IFxyXG4gICAgICAgICAgICBteUZyaWVuZHM9e3RoaXMuc3RhdGUubXlGcmllbmRzfSBcclxuICAgICAgICAgICAgbGlzdFBvdGVudGlhbHM9e3RoaXMubGlzdFBvdGVudGlhbHMuYmluZCh0aGlzKX0gXHJcbiAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX0gIFxyXG4gICAgICAgICAgICBzZW5kUmVxdWVzdD17dGhpcy5zZW5kUmVxdWVzdC5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJIb21lXCIpIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XHJcbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyl9IFxyXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8SG9tZSBcclxuICAgICAgICAgICAgY2hhbmdlPXt0aGlzLmNoYW5nZVZpZXdzTW92aWUuYmluZCh0aGlzKX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJTaW5nbGVNb3ZpZVwiKSB7XHJcbiAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2IG9uQ2xpY2s9eygpPT5jb25zb2xlLmxvZyh0aGF0LnN0YXRlKX0+XHJcbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cclxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgPFNpbmdsZU1vdmllUmF0aW5nIFxyXG4gICAgICAgICAgICBjb21wYXRpYmlsaXR5PXt0aGlzLnN0YXRlLm15RnJpZW5kc31cclxuICAgICAgICAgICAgY3VycmVudE1vdmllPXt0aGlzLnN0YXRlLm1vdmllfVxyXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NGcmllbmRzLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgIGZvZj17dGhpcy5mb2N1c09uRnJpZW5kLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXc9PT0nc2luZ2xlRnJpZW5kJykge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cclxuICAgICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKX0gXHJcbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDxTaW5nbGVGcmllbmQgXHJcbiAgICAgICAgICAgIG1vdmllc09mRnJpZW5kPXt0aGlzLnN0YXRlLmluZGl2aWR1YWxGcmllbmRzTW92aWVzfSBcclxuICAgICAgICAgICAgZnJpZW5kTmFtZT17dGhpcy5zdGF0ZS5mcmllbmRUb0ZvY3VzT259IFxyXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgIGNoYW5nZT17dGhpcy5jaGFuZ2VWaWV3c01vdmllLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiRk5NQlwiKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxyXG4gICAgICAgICAgICAgIGZpbmQ9e3RoaXMuZmluZE1vdmllQnVkZGllcy5iaW5kKHRoaXMpfSBcclxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgPEZpbmRNb3ZpZUJ1ZGR5IFxyXG4gICAgICAgICAgICBidWRkeWZ1bmM9e3RoaXMuYnVkZHlSZXF1ZXN0LmJpbmQodGhpcyl9IFxyXG4gICAgICAgICAgICBidWRkaWVzPXt0aGlzLnN0YXRlLnBvdGVudGlhbE1vdmllQnVkZGllc30gXHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiTXlSYXRpbmdzXCIpIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XHJcbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyl9IFxyXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8TXlSYXRpbmdzIFxyXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NNb3ZpZS5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbndpbmRvdy5BcHAgPSBBcHA7XHJcbi8vdmFyIFVybCA9ICdodHRwczovL3RoYXdpbmctaXNsYW5kLTk5NzQ3Lmhlcm9rdWFwcC5jb20nO1xyXG52YXIgVXJsID0gJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMCc7XHJcbndpbmRvdy5VcmwgPSBVcmw7XHJcbiJdfQ==
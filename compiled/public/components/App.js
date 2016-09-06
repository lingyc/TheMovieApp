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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0FwcC5qcyJdLCJuYW1lcyI6WyJBcHAiLCJwcm9wcyIsInN0YXRlIiwidmlldyIsImZyaWVuZHNSYXRpbmdzIiwibW92aWUiLCJmcmllbmRSZXF1ZXN0cyIsInBlbmRpbmdGcmllbmRSZXF1ZXN0cyIsIm15RnJpZW5kcyIsImZyaWVuZFRvRm9jdXNPbiIsImluZGl2aWR1YWxGcmllbmRzTW92aWVzIiwicG90ZW50aWFsTW92aWVCdWRkaWVzIiwidXNlcm5hbWUiLCJyZXF1ZXN0UmVzcG9uc2VzIiwiY3VycmVudFVzZXIiLCJyZXF1ZXN0c09mQ3VycmVudFVzZXIiLCJ0aGF0IiwiY29uc29sZSIsImxvZyIsIiQiLCJwb3N0IiwiVXJsIiwidGVzdCIsImEiLCJiIiwiaSIsImxlbmd0aCIsImZpbmFsIiwic29ydCIsInNldFN0YXRlIiwicGVyc29uVG9BY2NlcHQiLCJsaXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzIiwicGVyc29uVG9EZWNsaW5lIiwiZHVtbXkiLCJyZWFsRmluYWwiLCJ1bmlxdWUiLCJ4IiwicHVzaCIsIm5hbWUiLCJwYXNzd29yZCIsInRoZW4iLCJjYXRjaCIsIm1vdmllTmFtZSIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJ2YWx1ZSIsInJlc3BvbnNlIiwiZXJyIiwiZnJpZW5kIiwidG9TZW5kIiwicmVxdWVzdGVlIiwicXVlcnkiLCJvcHRpb25zIiwic2VhcmNoTW92aWUiLCJ0YXJnZXRTdGF0ZSIsImdldEN1cnJlbnRGcmllbmRzIiwic2VuZFJlcXVlc3QiLCJwZXJzb24iLCJmcmllbmRzMSIsImZyaWVuZHMyIiwicHBsWW91Q2FudFNlbmRUbyIsImluZGV4T2YiLCJmYWRlSW4iLCJmYWRlT3V0IiwiY29uY2F0IiwiZXJyb3IiLCJ0b3AiLCJib3R0b20iLCJvbiIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJmcmllbmROYW1lIiwiaHRtbCIsImdldCIsInNlbGYiLCJhamF4IiwidXJsIiwidHlwZSIsImRhdGEiLCJyZXF1ZXN0b3IiLCJzdWNjZXNzIiwiY2hhbmdlVmlld3MiLCJiaW5kIiwic2V0Q3VycmVudFVzZXIiLCJmaW5kTW92aWVCdWRkaWVzIiwibG9nb3V0IiwiZ2V0TW92aWUiLCJhY2NlcHRGcmllbmQiLCJkZWNsaW5lRnJpZW5kIiwibWFwIiwicmVxdWVzdFR5cCIsIm1lc3NhZ2UiLCJyZW1vdmVSZXF1ZXN0Iiwic2VuZFdhdGNoUmVxdWVzdCIsImZvY3VzT25GcmllbmQiLCJsaXN0UG90ZW50aWFscyIsImNoYW5nZVZpZXdzTW92aWUiLCJjaGFuZ2VWaWV3c0ZyaWVuZHMiLCJidWRkeVJlcXVlc3QiLCJSZWFjdCIsIkNvbXBvbmVudCIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBQU1BLEc7OztBQUNKLGVBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSwwR0FDWEEsS0FEVzs7QUFHakIsVUFBS0MsS0FBTCxHQUFhO0FBQ1hDLFlBQU0sT0FESztBQUVYQyxzQkFBZ0IsRUFGTDtBQUdYQyxhQUFPLElBSEk7QUFJWEMsc0JBQWdCLEVBSkw7QUFLWEMsNkJBQXVCLEVBTFo7QUFNWEMsaUJBQVcsRUFOQTtBQU9YQyx1QkFBaUIsRUFQTjtBQVFYQywrQkFBeUIsRUFSZDtBQVNYQyw2QkFBdUIsRUFUWjtBQVVYQyxnQkFBVSxJQVZDO0FBV1hDLHdCQUFrQixFQVhQO0FBWVhDLG1CQUFhLElBWkY7QUFhWEMsNkJBQXVCO0FBYlosS0FBYjtBQUhpQjtBQWtCbEI7Ozs7d0NBRW1CO0FBQ2xCLFVBQUlDLE9BQUssSUFBVDtBQUNBQyxjQUFRQyxHQUFSLENBQVksV0FBWjtBQUNBQyxRQUFFQyxJQUFGLENBQU9DLE1BQU0sYUFBYixFQUEyQixFQUFDQyxNQUFLLE1BQU4sRUFBM0IsRUFBMEMsVUFBQ0MsQ0FBRCxFQUFJQyxDQUFKLEVBQVU7QUFDbERQLGdCQUFRQyxHQUFSLENBQVksK0NBQVosRUFBNERLLENBQTVELEVBQThEQyxDQUE5RDtBQUNPLGFBQUssSUFBSUMsSUFBRSxDQUFYLEVBQWFBLElBQUVGLEVBQUVHLE1BQWpCLEVBQXdCRCxHQUF4QixFQUE0QjtBQUN6QixjQUFJRixFQUFFRSxDQUFGLEVBQUssQ0FBTCxNQUFVLElBQWQsRUFBbUI7QUFDakJGLGNBQUVFLENBQUYsRUFBSyxDQUFMLElBQVUsMEJBQVY7QUFDRDtBQUNGOztBQUVSLFlBQUlFLFFBQU9KLEVBQUVLLElBQUYsQ0FBTyxVQUFTTCxDQUFULEVBQVdDLENBQVgsRUFBYTtBQUFDLGlCQUFPQSxFQUFFLENBQUYsSUFBS0QsRUFBRSxDQUFGLENBQVo7QUFBaUIsU0FBdEMsQ0FBWDtBQUNEUCxhQUFLYSxRQUFMLENBQWM7QUFDWnJCLHFCQUFVbUI7QUFERSxTQUFkO0FBR0FWLGdCQUFRQyxHQUFSLENBQVksc0NBQVosRUFBbURGLEtBQUtkLEtBQUwsQ0FBV00sU0FBOUQ7QUFDRCxPQWJEO0FBY0Q7OztpQ0FFWWUsQyxFQUFHbEIsSyxFQUFPO0FBQ3JCLFVBQUlXLE9BQUssSUFBVDtBQUNBLFVBQUlXLFFBQU1KLENBQVY7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQUosUUFBRUMsSUFBRixDQUFPQyxNQUFNLFNBQWIsRUFBdUIsRUFBQ1MsZ0JBQWVILEtBQWhCLEVBQXVCdEIsT0FBT0EsS0FBOUIsRUFBdkIsRUFBNEQsVUFBU2tCLENBQVQsRUFBV0MsQ0FBWCxFQUFjO0FBQ3hFUixhQUFLZSx5QkFBTDtBQUNELE9BRkQ7O0FBSUFkLGNBQVFDLEdBQVIsQ0FBWSw2RUFBWjtBQUNEOzs7a0NBRWFLLEMsRUFBR2xCLEssRUFBTztBQUN0QixVQUFJVyxPQUFLLElBQVQ7QUFDQSxVQUFJVyxRQUFNSixDQUFWOztBQUVBSixRQUFFQyxJQUFGLENBQU9DLE1BQU0sVUFBYixFQUF3QixFQUFDVyxpQkFBZ0JMLEtBQWpCLEVBQXdCdEIsT0FBT0EsS0FBL0IsRUFBeEIsRUFBOEQsVUFBU2tCLENBQVQsRUFBV0MsQ0FBWCxFQUFjO0FBQzFFUCxnQkFBUUMsR0FBUixDQUFZSyxDQUFaLEVBQWNDLENBQWQ7QUFDQVAsZ0JBQVFDLEdBQVIsQ0FBWSw0Q0FBWixFQUEwREYsS0FBS2QsS0FBL0Q7QUFDQWMsYUFBS2UseUJBQUw7QUFDRCxPQUpEO0FBS0Q7Ozt1Q0FFa0I7QUFDakIsVUFBSWYsT0FBSyxJQUFUO0FBQ0FHLFFBQUVDLElBQUYsQ0FBT0MsTUFBTSxtQkFBYixFQUFpQyxFQUFDWSxPQUFNLE1BQVAsRUFBakMsRUFBZ0QsVUFBU1YsQ0FBVCxFQUFXQyxDQUFYLEVBQWM7QUFDNUQsWUFBSUcsUUFBTUosRUFBRUssSUFBRixDQUFPLFVBQVNMLENBQVQsRUFBV0MsQ0FBWCxFQUFhO0FBQUMsaUJBQU9BLEVBQUUsQ0FBRixJQUFLRCxFQUFFLENBQUYsQ0FBWjtBQUFpQixTQUF0QyxDQUFWO0FBQ0EsWUFBSWYsWUFBVVEsS0FBS2QsS0FBTCxDQUFXTSxTQUF6QjtBQUNDLFlBQUkwQixZQUFVLEVBQWQ7QUFDQyxhQUFLLElBQUlULElBQUUsQ0FBWCxFQUFhQSxJQUFFRSxNQUFNRCxNQUFyQixFQUE0QkQsR0FBNUIsRUFBZ0M7QUFDOUIsY0FBSVUsU0FBTyxJQUFYO0FBQ0EsZUFBSyxJQUFJQyxJQUFFLENBQVgsRUFBYUEsSUFBRTVCLFVBQVVrQixNQUF6QixFQUFnQ1UsR0FBaEMsRUFBb0M7QUFDbEMsZ0JBQUlULE1BQU1GLENBQU4sRUFBUyxDQUFULE1BQWNqQixVQUFVNEIsQ0FBVixFQUFhLENBQWIsQ0FBbEIsRUFBa0M7QUFDaENELHVCQUFPLEtBQVA7QUFDRDtBQUNGO0FBQ0QsY0FBSUEsTUFBSixFQUFXO0FBQ1RELHNCQUFVRyxJQUFWLENBQWVWLE1BQU1GLENBQU4sQ0FBZjtBQUNEO0FBQ0Y7O0FBSUhULGFBQUthLFFBQUwsQ0FBYztBQUNaMUIsZ0JBQUssTUFETztBQUVaUSxpQ0FBc0J1QjtBQUZWLFNBQWQ7QUFJQWpCLGdCQUFRQyxHQUFSLENBQVlGLEtBQUtkLEtBQUwsQ0FBV00sU0FBdkIsRUFBaUNRLEtBQUtkLEtBQUwsQ0FBV1MscUJBQTVDO0FBRUQsT0F4QkQ7QUF5QkQ7OztpQ0FFWTtBQUNYLFdBQUtrQixRQUFMLENBQWM7QUFDWjFCLGNBQUs7QUFETyxPQUFkO0FBR0Q7OzttQ0FFY1MsUSxFQUFVO0FBQ3ZCSyxjQUFRQyxHQUFSLENBQVksd0JBQVo7QUFDQSxXQUFLVyxRQUFMLENBQWM7QUFDWmYscUJBQWFGO0FBREQsT0FBZDtBQUdEOzs7aUNBRVkwQixJLEVBQUtDLFEsRUFBVTtBQUMxQnRCLGNBQVFDLEdBQVIsQ0FBWW9CLElBQVosRUFBaUJDLFFBQWpCO0FBQ0FwQixRQUFFQyxJQUFGLENBQU9DLE1BQU0sU0FBYixFQUF1QixFQUFDaUIsTUFBS0EsSUFBTixFQUFXQyxVQUFTQSxRQUFwQixFQUF2QixFQUFzREMsSUFBdEQsQ0FBMkQsWUFBVztBQUNwRXZCLGdCQUFRQyxHQUFSLENBQVksU0FBWjtBQUNBLGFBQUtXLFFBQUwsQ0FBYyxFQUFDakIsVUFBVTBCLElBQVgsRUFBaUJuQyxNQUFNLE1BQXZCLEVBQWQ7QUFDRCxPQUhELEVBR0dzQyxLQUhILENBR1MsWUFBVztBQUFDeEIsZ0JBQVFDLEdBQVIsQ0FBWSxPQUFaO0FBQXFCLE9BSDFDO0FBSUQ7Ozs0Q0FFdUI7QUFDdEIsVUFBSUYsT0FBSyxJQUFUO0FBQ0FDLGNBQVFDLEdBQVIsQ0FBWSxXQUFaO0FBQ0EsVUFBSXdCLFlBQVlDLFNBQVNDLGNBQVQsQ0FBd0IsYUFBeEIsRUFBdUNDLEtBQXZEO0FBQ0ExQixRQUFFQyxJQUFGLENBQU9DLE1BQU0sbUJBQWIsRUFBa0MsRUFBRWlCLE1BQU1JLFNBQVIsRUFBbEMsRUFBdURGLElBQXZELENBQTRELFVBQVNNLFFBQVQsRUFBbUI7O0FBRTdFOUIsYUFBS2EsUUFBTCxDQUFjO0FBQ2QxQixnQkFBSyxNQURTO0FBRWRDLDBCQUFlMEM7QUFGRCxTQUFkO0FBSUY3QixnQkFBUUMsR0FBUixDQUFZLGNBQVosRUFBMkJGLEtBQUtkLEtBQUwsQ0FBV0UsY0FBdEM7QUFFQyxPQVJELEVBUUdxQyxLQVJILENBUVMsVUFBU00sR0FBVCxFQUFjO0FBQUM5QixnQkFBUUMsR0FBUixDQUFZNkIsR0FBWjtBQUFpQixPQVJ6QztBQVNEOzs7NkJBRVE7QUFDUCxVQUFJL0IsT0FBTyxJQUFYO0FBQ0FHLFFBQUVDLElBQUYsQ0FBT0MsTUFBTSxTQUFiLEVBQXdCbUIsSUFBeEIsQ0FBNkIsVUFBU00sUUFBVCxFQUFtQjtBQUM5QzdCLGdCQUFRQyxHQUFSLENBQVk0QixRQUFaO0FBQ0E5QixhQUFLYSxRQUFMLENBQWM7QUFDWjFCLGdCQUFLLE9BRE87QUFFWkMsMEJBQWUsRUFGSDtBQUdaQyxpQkFBTyxJQUhLO0FBSVpDLDBCQUFlLEVBSkg7QUFLWkMsaUNBQXNCLEVBTFY7QUFNWkMscUJBQVUsRUFORTtBQU9aQywyQkFBZ0IsRUFQSjtBQVFaQyxtQ0FBd0IsRUFSWjtBQVNaQyxpQ0FBc0IsRUFUVjtBQVVaQyxvQkFBVSxJQVZFO0FBV1pDLDRCQUFpQixFQVhMO0FBWVpDLHVCQUFZLElBWkE7QUFhWkMsaUNBQXNCOztBQWJWLFNBQWQ7QUFnQkQsT0FsQkQ7QUFtQkQ7OztxQ0FFZ0JpQyxNLEVBQVE7QUFDdkIsVUFBSTNDLFFBQU9zQyxTQUFTQyxjQUFULENBQXdCLGNBQXhCLEVBQXdDQyxLQUFuRDtBQUNBLFVBQUlJLFNBQU8sRUFBQ0MsV0FBVUYsTUFBWCxFQUFtQjNDLE9BQU1BLEtBQXpCLEVBQVg7QUFDQSxVQUFJQSxNQUFNcUIsTUFBTixHQUFhLENBQWpCLEVBQW9CO0FBQ2xCUCxVQUFFQyxJQUFGLENBQU9DLE1BQU0sbUJBQWIsRUFBa0M0QixNQUFsQyxFQUEwQyxVQUFTMUIsQ0FBVCxFQUFXQyxDQUFYLEVBQWM7QUFDdERQLGtCQUFRQyxHQUFSLENBQVlLLENBQVosRUFBY0MsQ0FBZDtBQUNELFNBRkQ7QUFHQW1CLGlCQUFTQyxjQUFULENBQXdCLGNBQXhCLEVBQXdDQyxLQUF4QyxHQUE4QyxFQUE5QztBQUNELE9BTEQsTUFLTztBQUNMNUIsZ0JBQVFDLEdBQVIsQ0FBWSx1REFBWjtBQUNEO0FBQ0Y7O0FBR0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs2QkFDU2lDLEssRUFBTztBQUFBOztBQUNkLFVBQUlDLFVBQVU7QUFDWkQsZUFBT0E7QUFESyxPQUFkOztBQUlBLFdBQUtsRCxLQUFMLENBQVdvRCxXQUFYLENBQXVCRCxPQUF2QixFQUFnQyxVQUFDL0MsS0FBRCxFQUFXO0FBQ3pDWSxnQkFBUUMsR0FBUixDQUFZYixLQUFaO0FBQ0EsZUFBS3dCLFFBQUwsQ0FBYztBQUNaMUIsZ0JBQUssaUJBRE87QUFFWkUsaUJBQU9BO0FBRkssU0FBZDtBQUlELE9BTkQ7QUFPRDtBQUNEO0FBQ0E7Ozs7OEJBQ1VBLEssRUFBTztBQUNmLFdBQUt3QixRQUFMLENBQWM7QUFDWnhCLGVBQU9BO0FBREssT0FBZDtBQUdEO0FBQ0Q7QUFDQTtBQUNBOzs7O2dDQUNZaUQsVyxFQUFhO0FBQ3ZCckMsY0FBUUMsR0FBUixDQUFZLEtBQUtoQixLQUFqQjtBQUNBLFVBQUljLE9BQUssSUFBVDs7QUFFQSxVQUFJc0MsZ0JBQWMsU0FBbEIsRUFBNEI7QUFDMUJyQyxnQkFBUUMsR0FBUixDQUFZLDJCQUFaO0FBQ0EsYUFBS3FDLGlCQUFMO0FBQ0EsYUFBS0MsV0FBTDtBQUdEOztBQUdELFVBQUlGLGdCQUFjLE1BQWxCLEVBQXlCO0FBQ3ZCLGFBQUtDLGlCQUFMO0FBQ0EsYUFBS0MsV0FBTDtBQUVEOztBQUlBLFVBQUlGLGdCQUFjLE9BQWxCLEVBQTBCO0FBQ3hCLGFBQUt2Qix5QkFBTDtBQUNEOztBQUVGLFdBQUtGLFFBQUwsQ0FBYztBQUNaMUIsY0FBTW1EO0FBRE0sT0FBZDtBQUdEOzs7cUNBRWdCQSxXLEVBQWFqRCxLLEVBQU87QUFDbkMsV0FBS3dCLFFBQUwsQ0FBYztBQUNaMUIsY0FBTW1ELFdBRE07QUFFWmpELGVBQU9BO0FBRkssT0FBZDtBQUlEOzs7dUNBRWtCaUQsVyxFQUFhTixNLEVBQVE7QUFDdEMsV0FBS25CLFFBQUwsQ0FBYztBQUNaMUIsY0FBTW1ELFdBRE07QUFFWjdDLHlCQUFpQnVDO0FBRkwsT0FBZDtBQUlEOzs7aUNBR1l6QixDLEVBQUc7QUFDZCxXQUFLaUMsV0FBTCxDQUFpQmpDLENBQWpCO0FBQ0Q7OztnQ0FHV0EsQyxFQUFHO0FBQ2pCTixjQUFRQyxHQUFSLENBQVksNkJBQVo7QUFDSSxVQUFJRixPQUFLLElBQVQ7QUFDQSxVQUFJMkIsU0FBU0MsY0FBVCxDQUF3QixrQkFBeEIsTUFBOEMsSUFBbEQsRUFBdUQ7QUFDckQsWUFBSWEsU0FBT2QsU0FBU0MsY0FBVCxDQUF3QixrQkFBeEIsRUFBNENDLEtBQXZEO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsWUFBSVksU0FBU2xDLEtBQUssTUFBbEI7QUFDRDtBQUNETixjQUFRQyxHQUFSLENBQVksU0FBWixFQUFzQnVDLE1BQXRCO0FBQ0F4QyxjQUFRQyxHQUFSLENBQVksT0FBWixFQUFxQixLQUFLaEIsS0FBMUI7QUFDQWUsY0FBUUMsR0FBUixDQUFZLFVBQVosRUFBdUIsS0FBS2hCLEtBQUwsQ0FBV00sU0FBbEM7QUFDQSxVQUFJa0QsV0FBUyxFQUFiO0FBQ0EsVUFBSUMsV0FBUyxFQUFiO0FBQ0EsV0FBSyxJQUFJbEMsSUFBRSxDQUFYLEVBQWFBLElBQUUsS0FBS3ZCLEtBQUwsQ0FBV00sU0FBWCxDQUFxQmtCLE1BQXBDLEVBQTJDRCxHQUEzQyxFQUErQztBQUM3Q1IsZ0JBQVFDLEdBQVIsQ0FBWSxVQUFaLEVBQXVCLEtBQUtoQixLQUFMLENBQVdNLFNBQVgsQ0FBcUJpQixDQUFyQixDQUF2QjtBQUNBaUMsaUJBQVNyQixJQUFULENBQWMsS0FBS25DLEtBQUwsQ0FBV00sU0FBWCxDQUFxQmlCLENBQXJCLEVBQXdCLENBQXhCLENBQWQ7QUFDQWtDLGlCQUFTdEIsSUFBVCxDQUFjLEtBQUtuQyxLQUFMLENBQVdNLFNBQVgsQ0FBcUJpQixDQUFyQixFQUF3QixDQUF4QixDQUFkO0FBQ0Q7O0FBRUQsV0FBSyxJQUFJQSxJQUFFLENBQVgsRUFBYUEsSUFBRSxLQUFLdkIsS0FBTCxDQUFXYSxxQkFBWCxDQUFpQ1csTUFBaEQsRUFBdURELEdBQXZELEVBQTJEO0FBQ3pEaUMsaUJBQVNyQixJQUFULENBQWMsS0FBS25DLEtBQUwsQ0FBV2EscUJBQVgsQ0FBaUNVLENBQWpDLENBQWQ7QUFDRDs7QUFFRFIsY0FBUUMsR0FBUixDQUFZLGdDQUFaLEVBQTZDLEtBQUtoQixLQUFMLENBQVdNLFNBQXhELEVBQWtFa0QsUUFBbEUsRUFBMkVDLFFBQTNFOztBQUdBLFVBQUlDLG1CQUFpQkYsUUFBckI7QUFDQXpDLGNBQVFDLEdBQVIsQ0FBWSxLQUFaLEVBQWtCd0MsU0FBU0csT0FBVCxDQUFpQkosTUFBakIsTUFBNEIsQ0FBQyxDQUEvQyxFQUFrREMsU0FBU2hDLE1BQVQsS0FBa0IsQ0FBcEU7QUFDQSxVQUFJZ0MsU0FBU0csT0FBVCxDQUFpQkosTUFBakIsTUFBNEIsQ0FBQyxDQUE3QixJQUFrQ0MsU0FBU2hDLE1BQVQsS0FBa0IsQ0FBeEQsRUFBMEQ7QUFDeERQLFVBQUUsYUFBRixFQUFpQjJDLE1BQWpCLENBQXdCLElBQXhCO0FBQ0EzQyxVQUFFLGFBQUYsRUFBaUI0QyxPQUFqQixDQUF5QixJQUF6QjtBQUNBOUMsZ0JBQVFDLEdBQVIsQ0FBWSxtQ0FBWjtBQUNELE9BSkQsTUFJTyxJQUFJdUMsT0FBTy9CLE1BQVAsS0FBZ0IsQ0FBcEIsRUFBdUI7QUFDNUJQLFVBQUUsa0JBQUYsRUFBc0IyQyxNQUF0QixDQUE2QixJQUE3QjtBQUNBM0MsVUFBRSxrQkFBRixFQUFzQjRDLE9BQXRCLENBQThCLElBQTlCO0FBQ0QsT0FITSxNQUdBOztBQUdMNUMsVUFBRUMsSUFBRixDQUFPQyxNQUFNLGNBQWIsRUFBNEIsRUFBQ2lCLE1BQUttQixNQUFOLEVBQTVCLEVBQTBDLFVBQVNsQyxDQUFULEVBQVdDLENBQVgsRUFBYzs7QUFFcERSLGVBQUthLFFBQUwsQ0FBYztBQUNaZCxtQ0FBc0JRLEVBQUV5QyxNQUFGLENBQVMsQ0FBQ1AsTUFBRCxDQUFUO0FBRFYsV0FBZDtBQUdBeEMsa0JBQVFDLEdBQVIsQ0FBWSxVQUFaLEVBQXVCRixLQUFLZCxLQUFMLENBQVdhLHFCQUFsQzs7QUFFRkksWUFBRSxVQUFGLEVBQWMyQyxNQUFkLENBQXFCLElBQXJCO0FBQ0EzQyxZQUFFLFVBQUYsRUFBYzRDLE9BQWQsQ0FBc0IsSUFBdEI7QUFDRCxTQVREO0FBVUEsWUFBS3BCLFNBQVNDLGNBQVQsQ0FBd0Isa0JBQXhCLE1BQThDLElBQW5ELEVBQXdEO0FBQ3RERCxtQkFBU0MsY0FBVCxDQUF3QixrQkFBeEIsRUFBNENDLEtBQTVDLEdBQW9ELEVBQXBEO0FBQ0Q7QUFDRjtBQUNGOzs7Z0RBRTJCO0FBQzFCLFVBQUk3QixPQUFLLElBQVQ7QUFDQUMsY0FBUUMsR0FBUixDQUFZLDhCQUFaO0FBQ0FDLFFBQUVDLElBQUYsQ0FBT0MsTUFBTSxlQUFiLEVBQTZCLFVBQVN5QixRQUFULEVBQWtCbUIsS0FBbEIsRUFBeUI7QUFDcERoRCxnQkFBUUMsR0FBUixDQUFZLHVCQUFaLEVBQW9DNEIsUUFBcEM7QUFDQSxZQUFJb0IsTUFBSSxFQUFSO0FBQ0EsWUFBSUMsU0FBTyxFQUFYO0FBQ0FsRCxnQkFBUUMsR0FBUixDQUFZLElBQVosRUFBa0I0QixRQUFsQjtBQUNBLGFBQUssSUFBSXJCLElBQUUsQ0FBWCxFQUFhQSxJQUFFcUIsU0FBUyxDQUFULEVBQVlwQixNQUEzQixFQUFrQ0QsR0FBbEMsRUFBc0M7QUFDcEMsY0FBSXFCLFNBQVMsQ0FBVCxFQUFZckIsQ0FBWixFQUFlLFdBQWYsTUFBOEJxQixTQUFTLENBQVQsQ0FBOUIsSUFBNkNBLFNBQVMsQ0FBVCxFQUFZckIsQ0FBWixFQUFlLFVBQWYsTUFBNkIsSUFBOUUsRUFBb0Y7QUFDbEZ5QyxnQkFBSTdCLElBQUosQ0FBU1MsU0FBUyxDQUFULEVBQVlyQixDQUFaLENBQVQ7QUFDRDtBQUNELGNBQUlxQixTQUFTLENBQVQsRUFBWXJCLENBQVosRUFBZSxXQUFmLE1BQThCcUIsU0FBUyxDQUFULENBQTlCLElBQTRDQSxTQUFTLENBQVQsRUFBWXJCLENBQVosRUFBZSxVQUFmLE1BQTZCLElBQXpFLElBQWlGcUIsU0FBUyxDQUFULEVBQVlyQixDQUFaLEVBQWUsV0FBZixNQUE4QixNQUFuSCxFQUEwSDtBQUN4SDBDLG1CQUFPOUIsSUFBUCxDQUFZUyxTQUFTLENBQVQsRUFBWXJCLENBQVosQ0FBWjtBQUNEO0FBQ0Y7O0FBRURULGFBQUthLFFBQUwsQ0FBYztBQUNadEIsaUNBQXNCMkQsR0FEVjtBQUVackQsNEJBQWlCc0Q7QUFGTCxTQUFkO0FBSUQsT0FsQkQ7QUFtQkQ7OztrQ0FFYW5CLE0sRUFBUTtBQUNwQixVQUFJaEMsT0FBTyxJQUFYO0FBQ0FHLFFBQUUsd0JBQUYsRUFBNEJpRCxFQUE1QixDQUErQixPQUEvQixFQUF3QyxVQUFTQyxLQUFULEVBQWdCO0FBQ3REQSxjQUFNQyxjQUFOO0FBQ0EsWUFBSUMsYUFBYXBELEVBQUUsSUFBRixFQUFRcUQsSUFBUixFQUFqQjs7QUFFQXhELGFBQUthLFFBQUwsQ0FBYztBQUNaMUIsZ0JBQUssY0FETztBQUVaTSwyQkFBaUJ1QztBQUZMLFNBQWQ7O0FBS0E3QixVQUFFc0QsR0FBRixDQUFNcEQsTUFBTSx1QkFBWixFQUFvQyxFQUFDa0QsWUFBWXZCLE1BQWIsRUFBcEMsRUFBeUQsVUFBU0YsUUFBVCxFQUFtQjtBQUMxRTdCLGtCQUFRQyxHQUFSLENBQVk4QixNQUFaO0FBQ0EvQixrQkFBUUMsR0FBUixDQUFZLHdCQUFaLEVBQXNDNEIsUUFBdEM7QUFDQTlCLGVBQUthLFFBQUwsQ0FBYztBQUNabkIscUNBQXlCb0M7QUFEYixXQUFkO0FBSUQsU0FQRDtBQVFBLGVBQU8sS0FBUDtBQUNELE9BbEJEO0FBbUJEOzs7cUNBRWdCO0FBQ2Y3QixjQUFRQyxHQUFSLENBQVksb0NBQVo7QUFDRDs7O2tDQUVhdUMsTSxFQUFRaUIsSSxFQUFNckUsSyxFQUFPO0FBQ2pDLFVBQUlXLE9BQU0sSUFBVjtBQUNBRyxRQUFFd0QsSUFBRixDQUFPO0FBQ0xDLGFBQUt2RCxNQUFNLGdCQUROO0FBRUx3RCxjQUFNLFFBRkQ7QUFHTEMsY0FBTTtBQUNKQyxxQkFBV0wsSUFEUDtBQUVKeEIscUJBQVdPLE1BRlA7QUFHSnBELGlCQUFPQTtBQUhILFNBSEQ7QUFRTDJFLGlCQUFTLGlCQUFTbEMsUUFBVCxFQUFtQjtBQUMxQjdCLGtCQUFRQyxHQUFSLENBQVksNkJBQVosRUFBMkNiLEtBQTNDO0FBQ0FXLGVBQUtlLHlCQUFMO0FBQ0QsU0FYSTtBQVlMa0MsZUFBTyxlQUFTQSxNQUFULEVBQWdCO0FBQ3JCaEQsa0JBQVFDLEdBQVIsQ0FBWStDLE1BQVo7QUFDRDtBQWRJLE9BQVA7QUFnQkQ7Ozs2QkFFUTtBQUFBOztBQUNQLFVBQUksS0FBSy9ELEtBQUwsQ0FBV0MsSUFBWCxLQUFrQixPQUF0QixFQUErQjtBQUM3QixlQUFRLG9CQUFDLEtBQUQsSUFBTyxhQUFhLEtBQUs4RSxXQUFMLENBQWlCQyxJQUFqQixDQUFzQixJQUF0QixDQUFwQixFQUFpRCxnQkFBZ0IsS0FBS0MsY0FBTCxDQUFvQkQsSUFBcEIsQ0FBeUIsSUFBekIsQ0FBakUsR0FBUjtBQUNELE9BRkQsTUFFTyxJQUFJLEtBQUtoRixLQUFMLENBQVdDLElBQVgsS0FBa0IsUUFBdEIsRUFBZ0M7QUFDckMsZUFBUSxvQkFBQyxNQUFELElBQVEsYUFBYSxLQUFLOEUsV0FBTCxDQUFpQkMsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBckIsRUFBa0QsZ0JBQWdCLEtBQUtDLGNBQUwsQ0FBb0JELElBQXBCLENBQXlCLElBQXpCLENBQWxFLEdBQVI7QUFDRDtBQUNEO0FBSE8sV0FJRixJQUFJLEtBQUtoRixLQUFMLENBQVdDLElBQVgsS0FBb0IsaUJBQXhCLEVBQTJDO0FBQzlDLGlCQUNFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUNFLGtDQUFDLEdBQUQsSUFBSyxNQUFNLEtBQUtELEtBQUwsQ0FBV1ksV0FBdEI7QUFDQSxzQkFBTSxLQUFLc0UsZ0JBQUwsQ0FBc0JGLElBQXRCLENBQTJCLElBQTNCLENBRE47QUFFQSx5QkFBUyxLQUFLRCxXQUFMLENBQWlCQyxJQUFqQixDQUFzQixJQUF0QixDQUZUO0FBR0Esd0JBQVEsS0FBS0csTUFBTCxDQUFZSCxJQUFaLENBQWlCLElBQWpCO0FBSFI7QUFERixhQURGO0FBUUU7QUFBQTtBQUFBO0FBQ0Esa0NBQUMsV0FBRDtBQUNFLG1DQUFtQixLQUFLSSxRQUFMLENBQWNKLElBQWQsQ0FBbUIsSUFBbkIsQ0FEckI7QUFFRSx1QkFBTyxLQUFLaEYsS0FBTCxDQUFXRztBQUZwQjtBQURBO0FBUkYsV0FERjtBQWlCRCxTQWxCSSxNQWtCRSxJQUFJLEtBQUtILEtBQUwsQ0FBV0MsSUFBWCxLQUFvQixPQUF4QixFQUFrQztBQUN2QyxpQkFDRTtBQUFBO0FBQUE7QUFDSSxnQ0FBQyxHQUFELElBQUssTUFBTSxLQUFLRCxLQUFMLENBQVdZLFdBQXRCO0FBQ0Usb0JBQU0sS0FBS3NFLGdCQUFMLENBQXNCRixJQUF0QixDQUEyQixJQUEzQixDQURSO0FBRUUsdUJBQVMsS0FBS0QsV0FBTCxDQUFpQkMsSUFBakIsQ0FBc0IsSUFBdEIsQ0FGWDtBQUdFLHNCQUFRLEtBQUtHLE1BQUwsQ0FBWUgsSUFBWixDQUFpQixJQUFqQixDQUhWO0FBSUUsb0JBQU07QUFKUixjQURKO0FBT0ksZ0NBQUMsS0FBRDtBQUNFLHdCQUFVLEtBQUtoRixLQUFMLENBQVdLLHFCQUR2QjtBQUVFLGlDQUFtQixLQUFLTCxLQUFMLENBQVdXLGdCQUZoQztBQUdFLHNCQUFRLEtBQUt3RSxNQUFMLENBQVlILElBQVosQ0FBaUIsSUFBakIsQ0FIVjtBQUlFLHNCQUFTLEtBQUtLLFlBQUwsQ0FBa0JMLElBQWxCLENBQXVCLElBQXZCLENBSlg7QUFLRSx1QkFBUyxLQUFLTSxhQUFMLENBQW1CTixJQUFuQixDQUF3QixJQUF4QixDQUxYO0FBTUUsNEJBQWMsS0FBS25ELHlCQUFMLENBQStCbUQsSUFBL0IsQ0FBb0MsSUFBcEMsQ0FOaEI7QUFPRSxxQ0FBdUIsS0FBS2hGLEtBQUwsQ0FBV0sscUJBQVgsQ0FBaUNrRixHQUFqQyxDQUNyQixVQUFTbEUsQ0FBVCxFQUFXO0FBQUMsdUJBQU8sQ0FBQ0EsRUFBRXdELFNBQUgsRUFBYXhELEVBQUVtRSxVQUFmLEVBQTBCbkUsRUFBRWxCLEtBQUYsS0FBVSxJQUFWLEdBQWUsRUFBZixHQUFtQmtCLEVBQUVsQixLQUEvQyxFQUFxRCxhQUFZa0IsRUFBRW9FLE9BQWQsS0FBd0IsTUFBeEIsR0FBK0IsTUFBL0IsR0FBc0NwRSxFQUFFb0UsT0FBN0YsQ0FBUDtBQUE2RyxlQURwRyxDQVB6QjtBQVNFLHNCQUFRLEtBQUtDLGFBQUwsQ0FBbUJWLElBQW5CLENBQXdCLElBQXhCO0FBVFY7QUFQSixXQURGO0FBcUJELFNBdEJNLE1Bc0JBLElBQUksS0FBS2hGLEtBQUwsQ0FBV0MsSUFBWCxLQUFvQixTQUF4QixFQUFvQztBQUN6QyxpQkFDRTtBQUFBO0FBQUE7QUFDSSxnQ0FBQyxHQUFELElBQUssTUFBTSxLQUFLRCxLQUFMLENBQVdZLFdBQXRCO0FBQ0Usb0JBQU0sS0FBS3NFLGdCQUFMLENBQXNCRixJQUF0QixDQUEyQixJQUEzQixDQURSO0FBRUUsdUJBQVMsS0FBS0QsV0FBTCxDQUFpQkMsSUFBakIsQ0FBc0IsSUFBdEIsQ0FGWDtBQUdFLHNCQUFRLEtBQUtHLE1BQUwsQ0FBWUgsSUFBWixDQUFpQixJQUFqQixDQUhWLEdBREo7QUFLRSxnQ0FBQyxPQUFEO0FBQ0UsZ0NBQWtCLEtBQUtXLGdCQUFMLENBQXNCWCxJQUF0QixDQUEyQixJQUEzQixDQURwQjtBQUVFLG1CQUFNLEtBQUtZLGFBQUwsQ0FBbUJaLElBQW5CLENBQXdCLElBQXhCLENBRlI7QUFHRSwwQkFBWSxLQUFLM0IsaUJBQUwsQ0FBdUIyQixJQUF2QixDQUE0QixJQUE1QixDQUhkO0FBSUUseUJBQVcsS0FBS2hGLEtBQUwsQ0FBV00sU0FKeEI7QUFLRSw4QkFBZ0IsS0FBS3VGLGNBQUwsQ0FBb0JiLElBQXBCLENBQXlCLElBQXpCLENBTGxCO0FBTUUsc0JBQVEsS0FBS0csTUFBTCxDQUFZSCxJQUFaLENBQWlCLElBQWpCLENBTlY7QUFPRSwyQkFBYSxLQUFLMUIsV0FBTCxDQUFpQjBCLElBQWpCLENBQXNCLElBQXRCO0FBUGY7QUFMRixXQURGO0FBaUJELFNBbEJNLE1BbUJGLElBQUksS0FBS2hGLEtBQUwsQ0FBV0MsSUFBWCxLQUFvQixNQUF4QixFQUFnQztBQUNuQyxpQkFDRTtBQUFBO0FBQUE7QUFDSSxnQ0FBQyxHQUFELElBQUssTUFBTSxLQUFLRCxLQUFMLENBQVdZLFdBQXRCO0FBQ0Usb0JBQU0sS0FBS3NFLGdCQUFMLENBQXNCRixJQUF0QixDQUEyQixJQUEzQixDQURSO0FBRUUsdUJBQVMsS0FBS0QsV0FBTCxDQUFpQkMsSUFBakIsQ0FBc0IsSUFBdEIsQ0FGWDtBQUdFLHNCQUFRLEtBQUtHLE1BQUwsQ0FBWUgsSUFBWixDQUFpQixJQUFqQjtBQUhWLGNBREo7QUFNRSxnQ0FBQyxJQUFEO0FBQ0Usc0JBQVEsS0FBS2MsZ0JBQUwsQ0FBc0JkLElBQXRCLENBQTJCLElBQTNCO0FBRFY7QUFORixXQURGO0FBWUQsU0FiSSxNQWFFLElBQUksS0FBS2hGLEtBQUwsQ0FBV0MsSUFBWCxLQUFvQixhQUF4QixFQUF1QztBQUFBO0FBQzVDLGdCQUFJYSxhQUFKO0FBQ0E7QUFBQSxpQkFDRTtBQUFBO0FBQUEsa0JBQUssU0FBUztBQUFBLDJCQUFJQyxRQUFRQyxHQUFSLENBQVlGLEtBQUtkLEtBQWpCLENBQUo7QUFBQSxtQkFBZDtBQUNJLG9DQUFDLEdBQUQsSUFBSyxNQUFNLE9BQUtBLEtBQUwsQ0FBV1ksV0FBdEI7QUFDRSwyQkFBUyxPQUFLbUUsV0FBTCxDQUFpQkMsSUFBakIsUUFEWDtBQUVFLDBCQUFRLE9BQUtHLE1BQUwsQ0FBWUgsSUFBWjtBQUZWLGtCQURKO0FBS0Usb0NBQUMsaUJBQUQ7QUFDRSxpQ0FBZSxPQUFLaEYsS0FBTCxDQUFXTSxTQUQ1QjtBQUVFLGdDQUFjLE9BQUtOLEtBQUwsQ0FBV0csS0FGM0I7QUFHRSwwQkFBUSxPQUFLNEYsa0JBQUwsQ0FBd0JmLElBQXhCLFFBSFY7QUFJRSx1QkFBSyxPQUFLWSxhQUFMLENBQW1CWixJQUFuQjtBQUpQO0FBTEY7QUFERjtBQUY0Qzs7QUFBQTtBQWdCN0MsU0FoQk0sTUFnQkEsSUFBSSxLQUFLaEYsS0FBTCxDQUFXQyxJQUFYLEtBQWtCLGNBQXRCLEVBQXNDO0FBQzNDLGlCQUNFO0FBQUE7QUFBQTtBQUNJLGdDQUFDLEdBQUQsSUFBSyxNQUFNLEtBQUtELEtBQUwsQ0FBV1ksV0FBdEI7QUFDRSxvQkFBTSxLQUFLc0UsZ0JBQUwsQ0FBc0JGLElBQXRCLENBQTJCLElBQTNCLENBRFI7QUFFRSx1QkFBUyxLQUFLRCxXQUFMLENBQWlCQyxJQUFqQixDQUFzQixJQUF0QixDQUZYO0FBR0Usc0JBQVEsS0FBS0csTUFBTCxDQUFZSCxJQUFaLENBQWlCLElBQWpCO0FBSFYsY0FESjtBQU1FLGdDQUFDLFlBQUQ7QUFDRSw4QkFBZ0IsS0FBS2hGLEtBQUwsQ0FBV1EsdUJBRDdCO0FBRUUsMEJBQVksS0FBS1IsS0FBTCxDQUFXTyxlQUZ6QjtBQUdFLHVCQUFTLEtBQUt3RSxXQUFMLENBQWlCQyxJQUFqQixDQUFzQixJQUF0QixDQUhYO0FBSUUsc0JBQVEsS0FBS2MsZ0JBQUwsQ0FBc0JkLElBQXRCLENBQTJCLElBQTNCO0FBSlY7QUFORixXQURGO0FBZUQsU0FoQk0sTUFnQkEsSUFBSSxLQUFLaEYsS0FBTCxDQUFXQyxJQUFYLEtBQW9CLE1BQXhCLEVBQWdDO0FBQ3JDLGlCQUNFO0FBQUE7QUFBQTtBQUNJLGdDQUFDLEdBQUQsSUFBSyxNQUFNLEtBQUtELEtBQUwsQ0FBV1ksV0FBdEI7QUFDRSxvQkFBTSxLQUFLc0UsZ0JBQUwsQ0FBc0JGLElBQXRCLENBQTJCLElBQTNCLENBRFI7QUFFRSx1QkFBUyxLQUFLRCxXQUFMLENBQWlCQyxJQUFqQixDQUFzQixJQUF0QixDQUZYO0FBR0Usc0JBQVEsS0FBS0csTUFBTCxDQUFZSCxJQUFaLENBQWlCLElBQWpCO0FBSFYsY0FESjtBQU1FLGdDQUFDLGNBQUQ7QUFDRSx5QkFBVyxLQUFLZ0IsWUFBTCxDQUFrQmhCLElBQWxCLENBQXVCLElBQXZCLENBRGI7QUFFRSx1QkFBUyxLQUFLaEYsS0FBTCxDQUFXUztBQUZ0QjtBQU5GLFdBREY7QUFhRCxTQWRNLE1BY0EsSUFBSSxLQUFLVCxLQUFMLENBQVdDLElBQVgsS0FBb0IsV0FBeEIsRUFBcUM7QUFDMUMsaUJBQ0U7QUFBQTtBQUFBO0FBQ0ksZ0NBQUMsR0FBRCxJQUFLLE1BQU0sS0FBS0QsS0FBTCxDQUFXWSxXQUF0QjtBQUNFLG9CQUFNLEtBQUtzRSxnQkFBTCxDQUFzQkYsSUFBdEIsQ0FBMkIsSUFBM0IsQ0FEUjtBQUVFLHVCQUFTLEtBQUtELFdBQUwsQ0FBaUJDLElBQWpCLENBQXNCLElBQXRCLENBRlg7QUFHRSxzQkFBUSxLQUFLRyxNQUFMLENBQVlILElBQVosQ0FBaUIsSUFBakI7QUFIVixjQURKO0FBTUUsZ0NBQUMsU0FBRDtBQUNFLHNCQUFRLEtBQUtjLGdCQUFMLENBQXNCZCxJQUF0QixDQUEyQixJQUEzQjtBQURWO0FBTkYsV0FERjtBQVlEO0FBQ0Y7Ozs7RUE5ZmVpQixNQUFNQyxTOztBQWlnQnhCQyxPQUFPckcsR0FBUCxHQUFhQSxHQUFiO0FBQ0E7QUFDQSxJQUFJcUIsTUFBTSx1QkFBVjtBQUNBZ0YsT0FBT2hGLEdBQVAsR0FBYUEsR0FBYiIsImZpbGUiOiJBcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgdmlldzogJ0xvZ2luJyxcclxuICAgICAgZnJpZW5kc1JhdGluZ3M6IFtdLFxyXG4gICAgICBtb3ZpZTogbnVsbCxcclxuICAgICAgZnJpZW5kUmVxdWVzdHM6IFtdLFxyXG4gICAgICBwZW5kaW5nRnJpZW5kUmVxdWVzdHM6IFtdLFxyXG4gICAgICBteUZyaWVuZHM6IFtdLFxyXG4gICAgICBmcmllbmRUb0ZvY3VzT246ICcnLFxyXG4gICAgICBpbmRpdmlkdWFsRnJpZW5kc01vdmllczogW10sXHJcbiAgICAgIHBvdGVudGlhbE1vdmllQnVkZGllczoge30sXHJcbiAgICAgIHVzZXJuYW1lOiBudWxsLFxyXG4gICAgICByZXF1ZXN0UmVzcG9uc2VzOiBbXSxcclxuICAgICAgY3VycmVudFVzZXI6IG51bGwsXHJcbiAgICAgIHJlcXVlc3RzT2ZDdXJyZW50VXNlcjogW11cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBnZXRDdXJyZW50RnJpZW5kcygpIHtcclxuICAgIHZhciB0aGF0PXRoaXM7XHJcbiAgICBjb25zb2xlLmxvZygndGVzdGluZ2dnJyk7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9nZXRGcmllbmRzJyx7dGVzdDonaW5mbyd9LCAoYSwgYikgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZygnd2hhdCB5b3UgZ2V0IGJhY2sgZnJvbSBzZXJ2ZXIgZm9yIGdldCBmcmllbmRzJyxhLGIpO1xyXG4gICAgICAgICAgICAgZm9yICh2YXIgaT0wO2k8YS5sZW5ndGg7aSsrKXtcclxuICAgICAgICAgICAgICAgIGlmIChhW2ldWzFdPT09bnVsbCl7XHJcbiAgICAgICAgICAgICAgICAgIGFbaV1bMV0gPSBcIk5vIGNvbXBhcmlzb24gdG8gYmUgbWFkZVwiO1xyXG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgIHZhciBmaW5hbD0gYS5zb3J0KGZ1bmN0aW9uKGEsYil7cmV0dXJuIGJbMV0tYVsxXX0pO1xyXG4gICAgICB0aGF0LnNldFN0YXRlKHtcclxuICAgICAgICBteUZyaWVuZHM6ZmluYWxcclxuICAgICAgfSlcclxuICAgICAgY29uc29sZS5sb2coJ3RoZXMgYXJlIG15IGZyaWVuZHMhISEhISEhISEhISEhISEhIScsdGhhdC5zdGF0ZS5teUZyaWVuZHMpXHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgYWNjZXB0RnJpZW5kKGEsIG1vdmllKSB7XHJcbiAgICB2YXIgdGhhdD10aGlzO1xyXG4gICAgdmFyIGZpbmFsPWE7XHJcbiAgICAvLyAkKCdidXR0b24nKS5vbignY2xpY2snLGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gICBjb25zb2xlLmxvZygkKHRoaXMpLmh0bWwoKSk7XHJcbiAgICAvLyB9KVxyXG4gICAgLy8gY29uc29sZS5sb2coZmluYWwgKydzaG91bGQgYmUgYWNjZXB0ZWQsIGZvciBtb3ZpZS4uLi4nLCBtb3ZpZSlcclxuXHJcbiAgICAkLnBvc3QoVXJsICsgJy9hY2NlcHQnLHtwZXJzb25Ub0FjY2VwdDpmaW5hbCwgbW92aWU6IG1vdmllfSxmdW5jdGlvbihhLGIpIHtcclxuICAgICAgdGhhdC5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCk7XHJcbiAgICB9KVxyXG4gICAgXHJcbiAgICBjb25zb2xlLmxvZygncmVmcmVzaGVkIGluYm94LCBzaG91bGQgZGVsZXRlIGZyaWVuZCByZXF1ZXN0IG9uIHRoZSBzcG90IGluc3RlYWQgb2YgbW92aW5nJylcclxuICB9XHJcblxyXG4gIGRlY2xpbmVGcmllbmQoYSwgbW92aWUpIHtcclxuICAgIHZhciB0aGF0PXRoaXM7XHJcbiAgICB2YXIgZmluYWw9YTtcclxuXHJcbiAgICAkLnBvc3QoVXJsICsgJy9kZWNsaW5lJyx7cGVyc29uVG9EZWNsaW5lOmZpbmFsLCBtb3ZpZTogbW92aWV9LGZ1bmN0aW9uKGEsYikge1xyXG4gICAgICBjb25zb2xlLmxvZyhhLGIpXHJcbiAgICAgIGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBzdGF0ZSBhZnRlciBkZWNsaW5pbmcgZnJpZW5kLCAnLCB0aGF0LnN0YXRlKTtcclxuICAgICAgdGhhdC5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCk7XHJcbiAgICB9KVxyXG4gIH1cclxuXHJcbiAgZmluZE1vdmllQnVkZGllcygpIHtcclxuICAgIHZhciB0aGF0PXRoaXM7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9maW5kTW92aWVCdWRkaWVzJyx7ZHVtbXk6J2luZm8nfSxmdW5jdGlvbihhLGIpIHtcclxuICAgICAgdmFyIGZpbmFsPWEuc29ydChmdW5jdGlvbihhLGIpe3JldHVybiBiWzFdLWFbMV19KVxyXG4gICAgICB2YXIgbXlGcmllbmRzPXRoYXQuc3RhdGUubXlGcmllbmRzXHJcbiAgICAgICB2YXIgcmVhbEZpbmFsPVtdXHJcbiAgICAgICAgZm9yICh2YXIgaT0wO2k8ZmluYWwubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgICB2YXIgdW5pcXVlPXRydWVcclxuICAgICAgICAgIGZvciAodmFyIHg9MDt4PG15RnJpZW5kcy5sZW5ndGg7eCsrKXtcclxuICAgICAgICAgICAgaWYgKGZpbmFsW2ldWzBdPT09bXlGcmllbmRzW3hdWzBdKXtcclxuICAgICAgICAgICAgICB1bmlxdWU9ZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICh1bmlxdWUpe1xyXG4gICAgICAgICAgICByZWFsRmluYWwucHVzaChmaW5hbFtpXSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgIHRoYXQuc2V0U3RhdGUoe1xyXG4gICAgICAgIHZpZXc6XCJGTk1CXCIsXHJcbiAgICAgICAgcG90ZW50aWFsTW92aWVCdWRkaWVzOnJlYWxGaW5hbFxyXG4gICAgICB9KVxyXG4gICAgICBjb25zb2xlLmxvZyh0aGF0LnN0YXRlLm15RnJpZW5kcyx0aGF0LnN0YXRlLnBvdGVudGlhbE1vdmllQnVkZGllcyk7XHJcblxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGNoYW5nZVZpZXcoKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzpcIlNpZ25VcFwiIFxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIHNldEN1cnJlbnRVc2VyKHVzZXJuYW1lKSB7XHJcbiAgICBjb25zb2xlLmxvZygnY2FsbGluZyBzZXRDdXJyZW50VXNlcicpO1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIGN1cnJlbnRVc2VyOiB1c2VybmFtZVxyXG4gICAgfSlcclxuICB9XHJcblxyXG4gIGVudGVyTmV3VXNlcihuYW1lLHBhc3N3b3JkKSB7XHJcbiAgICBjb25zb2xlLmxvZyhuYW1lLHBhc3N3b3JkKTtcclxuICAgICQucG9zdChVcmwgKyAnL3NpZ251cCcse25hbWU6bmFtZSxwYXNzd29yZDpwYXNzd29yZH0pLnRoZW4oZnVuY3Rpb24oKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdzdWNjZXNzJyk7IFxyXG4gICAgICB0aGlzLnNldFN0YXRlKHt1c2VybmFtZTogbmFtZSwgdmlldzogXCJIb21lXCJ9KVxyXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24oKSB7Y29uc29sZS5sb2coJ2Vycm9yJyl9KVxyXG4gIH1cclxuXHJcbiAgZ2V0RnJpZW5kTW92aWVSYXRpbmdzKCkge1xyXG4gICAgdmFyIHRoYXQ9dGhpcztcclxuICAgIGNvbnNvbGUubG9nKCdtb29vb292aWUnKTtcclxuICAgIHZhciBtb3ZpZU5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vdmllVG9WaWV3XCIpLnZhbHVlXHJcbiAgICAkLnBvc3QoVXJsICsgJy9nZXRGcmllbmRSYXRpbmdzJywgeyBuYW1lOiBtb3ZpZU5hbWUgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG5cclxuICAgICAgdGhhdC5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6XCJIb21lXCIsXHJcbiAgICAgIGZyaWVuZHNSYXRpbmdzOnJlc3BvbnNlXHJcbiAgICB9KVxyXG4gICAgY29uc29sZS5sb2coJ291ciByZXNwb25zZScsdGhhdC5zdGF0ZS5mcmllbmRzUmF0aW5ncylcclxuXHJcbiAgICB9KS5jYXRjaChmdW5jdGlvbihlcnIpIHtjb25zb2xlLmxvZyhlcnIpfSk7XHJcbiAgfVxyXG5cclxuICBsb2dvdXQoKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAkLnBvc3QoVXJsICsgJy9sb2dvdXQnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuICAgICAgdGhhdC5zZXRTdGF0ZSh7XHJcbiAgICAgICAgdmlldzpcIkxvZ2luXCIsXHJcbiAgICAgICAgZnJpZW5kc1JhdGluZ3M6W10sXHJcbiAgICAgICAgbW92aWU6IG51bGwsXHJcbiAgICAgICAgZnJpZW5kUmVxdWVzdHM6W10sXHJcbiAgICAgICAgcGVuZGluZ0ZyaWVuZFJlcXVlc3RzOltdLFxyXG4gICAgICAgIG15RnJpZW5kczpbXSxcclxuICAgICAgICBmcmllbmRUb0ZvY3VzT246JycsXHJcbiAgICAgICAgaW5kaXZpZHVhbEZyaWVuZHNNb3ZpZXM6W10sXHJcbiAgICAgICAgcG90ZW50aWFsTW92aWVCdWRkaWVzOnt9LFxyXG4gICAgICAgIHVzZXJuYW1lOiBudWxsLFxyXG4gICAgICAgIHJlcXVlc3RSZXNwb25zZXM6W10sXHJcbiAgICAgICAgY3VycmVudFVzZXI6bnVsbCxcclxuICAgICAgICByZXF1ZXN0c09mQ3VycmVudFVzZXI6W11cclxuXHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzZW5kV2F0Y2hSZXF1ZXN0KGZyaWVuZCkge1xyXG4gICAgdmFyIG1vdmllPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW92aWVUb1dhdGNoJykudmFsdWU7XHJcbiAgICB2YXIgdG9TZW5kPXtyZXF1ZXN0ZWU6ZnJpZW5kLCBtb3ZpZTptb3ZpZX07XHJcbiAgICBpZiAobW92aWUubGVuZ3RoPjApIHtcclxuICAgICAgJC5wb3N0KFVybCArICcvc2VuZFdhdGNoUmVxdWVzdCcsIHRvU2VuZCAsZnVuY3Rpb24oYSxiKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coYSxiKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3ZpZVRvV2F0Y2gnKS52YWx1ZT0nJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCd5b3UgbmVlZCB0byBlbnRlciBhIG1vdmllIHRvIHNlbmQgYSB3YXRjaCByZXF1ZXN0ISEhIScpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8vLy9tb3ZpZSByZW5kZXJcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvL2NhbGwgc2VhcmNobW92aWUgZnVuY3Rpb25cclxuICAvL3doaWNoIGdldHMgcGFzc2VkIGRvd24gdG8gdGhlIE1vdmllIFNlYXJjaCBcclxuICBnZXRNb3ZpZShxdWVyeSkge1xyXG4gICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgIHF1ZXJ5OiBxdWVyeVxyXG4gICAgfTtcclxuICAgIFxyXG4gICAgdGhpcy5wcm9wcy5zZWFyY2hNb3ZpZShvcHRpb25zLCAobW92aWUpID0+IHtcclxuICAgICAgY29uc29sZS5sb2cobW92aWUpO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICB2aWV3OlwiTW92aWVTZWFyY2hWaWV3XCIsXHJcbiAgICAgICAgbW92aWU6IG1vdmllXHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG4gIH1cclxuICAvL3Nob3cgdGhlIG1vdmllIHNlYXJjaGVkIGluIGZyaWVuZCBtb3ZpZSBsaXN0XHJcbiAgLy9vbnRvIHRoZSBzdGF0ZXZpZXcgb2YgbW92aWVzZWFyY2h2aWV3XHJcbiAgc2hvd01vdmllKG1vdmllKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgbW92aWU6IG1vdmllXHJcbiAgICB9KVxyXG4gIH1cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLy8vL05hdiBjaGFuZ2VcclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICBjaGFuZ2VWaWV3cyh0YXJnZXRTdGF0ZSkge1xyXG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZSk7XHJcbiAgICB2YXIgdGhhdD10aGlzO1xyXG5cclxuICAgIGlmICh0YXJnZXRTdGF0ZT09PSdGcmllbmRzJyl7XHJcbiAgICAgIGNvbnNvbGUubG9nKCd5b3Ugc3dpdGNoZWQgdG8gZnJpZW5kcyEhJylcclxuICAgICAgdGhpcy5nZXRDdXJyZW50RnJpZW5kcygpXHJcbiAgICAgIHRoaXMuc2VuZFJlcXVlc3QoKTtcclxuXHJcbiAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgXHJcbiAgICBpZiAodGFyZ2V0U3RhdGU9PT0nSG9tZScpe1xyXG4gICAgICB0aGlzLmdldEN1cnJlbnRGcmllbmRzKClcclxuICAgICAgdGhpcy5zZW5kUmVxdWVzdCgpO1xyXG4gICAgICBcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgICBpZiAodGFyZ2V0U3RhdGU9PT1cIkluYm94XCIpe1xyXG4gICAgICAgdGhpcy5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKClcclxuICAgICB9XHJcblxyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6IHRhcmdldFN0YXRlXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGNoYW5nZVZpZXdzTW92aWUodGFyZ2V0U3RhdGUsIG1vdmllKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzogdGFyZ2V0U3RhdGUsXHJcbiAgICAgIG1vdmllOiBtb3ZpZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjaGFuZ2VWaWV3c0ZyaWVuZHModGFyZ2V0U3RhdGUsIGZyaWVuZCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHZpZXc6IHRhcmdldFN0YXRlLFxyXG4gICAgICBmcmllbmRUb0ZvY3VzT246IGZyaWVuZFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgYnVkZHlSZXF1ZXN0KGEpIHtcclxuICAgIHRoaXMuc2VuZFJlcXVlc3QoYSk7XHJcbiAgfVxyXG5cclxuXHJcbiAgc2VuZFJlcXVlc3QoYSkge1xyXG5jb25zb2xlLmxvZygnc2VuZCByZXF1ZXN0IGlzIGJlaW5nIHJ1biEhJylcclxuICAgIHZhciB0aGF0PXRoaXM7XHJcbiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRGcmllbmRCeU5hbWUnKSE9PW51bGwpe1xyXG4gICAgICB2YXIgcGVyc29uPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kRnJpZW5kQnlOYW1lJykudmFsdWVcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBwZXJzb24gPSBhIHx8ICd0ZXN0JztcclxuICAgIH1cclxuICAgIGNvbnNvbGUubG9nKCdwZXJzb246JyxwZXJzb24pXHJcbiAgICBjb25zb2xlLmxvZygnc3RhdGUnLCB0aGlzLnN0YXRlKTtcclxuICAgIGNvbnNvbGUubG9nKCdsaW5lIDI0OCcsdGhpcy5zdGF0ZS5teUZyaWVuZHMpXHJcbiAgICB2YXIgZnJpZW5kczE9W107XHJcbiAgICB2YXIgZnJpZW5kczI9W11cclxuICAgIGZvciAodmFyIGk9MDtpPHRoaXMuc3RhdGUubXlGcmllbmRzLmxlbmd0aDtpKyspe1xyXG4gICAgICBjb25zb2xlLmxvZygnbGluZSAyNTEnLHRoaXMuc3RhdGUubXlGcmllbmRzW2ldKVxyXG4gICAgICBmcmllbmRzMS5wdXNoKHRoaXMuc3RhdGUubXlGcmllbmRzW2ldWzBdKTtcclxuICAgICAgZnJpZW5kczIucHVzaCh0aGlzLnN0YXRlLm15RnJpZW5kc1tpXVswXSlcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKHZhciBpPTA7aTx0aGlzLnN0YXRlLnJlcXVlc3RzT2ZDdXJyZW50VXNlci5sZW5ndGg7aSsrKXtcclxuICAgICAgZnJpZW5kczEucHVzaCh0aGlzLnN0YXRlLnJlcXVlc3RzT2ZDdXJyZW50VXNlcltpXSlcclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgYWxzbyBiZSBteSBmcmllbmRzJyx0aGlzLnN0YXRlLm15RnJpZW5kcyxmcmllbmRzMSxmcmllbmRzMilcclxuXHJcblxyXG4gICAgdmFyIHBwbFlvdUNhbnRTZW5kVG89ZnJpZW5kczE7XHJcbiAgICBjb25zb2xlLmxvZygndG9mJyxmcmllbmRzMS5pbmRleE9mKHBlcnNvbikhPT0gLTEsIGZyaWVuZHMxLmxlbmd0aCE9PTApXHJcbiAgICBpZiAoZnJpZW5kczEuaW5kZXhPZihwZXJzb24pIT09IC0xICYmIGZyaWVuZHMxLmxlbmd0aCE9PTApe1xyXG4gICAgICAkKFwiI0FscmVhZHlSZXFcIikuZmFkZUluKDEwMDApO1xyXG4gICAgICAkKFwiI0FscmVhZHlSZXFcIikuZmFkZU91dCgxMDAwKTtcclxuICAgICAgY29uc29sZS5sb2coJ3RoaXMgcGVyc29uIGlzIGFscmVhZHkgaW4gdGhlcmUhIScpXHJcbiAgICB9IGVsc2UgaWYgKHBlcnNvbi5sZW5ndGg9PT0wKSB7XHJcbiAgICAgICQoXCIjZW50ZXJSZWFsRnJpZW5kXCIpLmZhZGVJbigxMDAwKTtcclxuICAgICAgJChcIiNlbnRlclJlYWxGcmllbmRcIikuZmFkZU91dCgxMDAwKTtcclxuICAgIH0gZWxzZSB7XHJcblxyXG5cclxuICAgICAgJC5wb3N0KFVybCArICcvc2VuZFJlcXVlc3QnLHtuYW1lOnBlcnNvbn0sZnVuY3Rpb24oYSxiKSB7XHJcbiAgICAgICBcclxuICAgICAgICAgIHRoYXQuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICByZXF1ZXN0c09mQ3VycmVudFVzZXI6YS5jb25jYXQoW3BlcnNvbl0pXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgY29uc29sZS5sb2coJ2xpbmUgMjgxJyx0aGF0LnN0YXRlLnJlcXVlc3RzT2ZDdXJyZW50VXNlcik7XHJcblxyXG4gICAgICAgICQoXCIjcmVxU2VudFwiKS5mYWRlSW4oMTAwMCk7XHJcbiAgICAgICAgJChcIiNyZXFTZW50XCIpLmZhZGVPdXQoMTAwMCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBpZiAoIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kRnJpZW5kQnlOYW1lJykhPT1udWxsKXtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZEZyaWVuZEJ5TmFtZScpLnZhbHVlID0gJyc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKSB7XHJcbiAgICB2YXIgdGhhdD10aGlzO1xyXG4gICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGxpc3QgZnJpZW5kIHJlcXMnKVxyXG4gICAgJC5wb3N0KFVybCArICcvbGlzdFJlcXVlc3RzJyxmdW5jdGlvbihyZXNwb25zZSxlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmxvZygnUmVzcG9uc2UgSSBnZXQhISEhISEhJyxyZXNwb25zZSk7XHJcbiAgICAgIHZhciB0b3A9W11cclxuICAgICAgdmFyIGJvdHRvbT1bXVxyXG4gICAgICBjb25zb2xlLmxvZygndHInLCByZXNwb25zZSlcclxuICAgICAgZm9yICh2YXIgaT0wO2k8cmVzcG9uc2VbMF0ubGVuZ3RoO2krKyl7XHJcbiAgICAgICAgaWYgKHJlc3BvbnNlWzBdW2ldWydyZXF1ZXN0b3InXSE9PXJlc3BvbnNlWzFdICYmIHJlc3BvbnNlWzBdW2ldWydyZXNwb25zZSddPT09bnVsbCApe1xyXG4gICAgICAgICAgdG9wLnB1c2gocmVzcG9uc2VbMF1baV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocmVzcG9uc2VbMF1baV1bJ3JlcXVlc3RvciddPT09cmVzcG9uc2VbMV0gJiZyZXNwb25zZVswXVtpXVsncmVzcG9uc2UnXSE9PW51bGwgJiYgcmVzcG9uc2VbMF1baV1bJ3JlcXVlc3RlZSddIT09J3Rlc3QnKXtcclxuICAgICAgICAgIGJvdHRvbS5wdXNoKHJlc3BvbnNlWzBdW2ldKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoYXQuc2V0U3RhdGUoe1xyXG4gICAgICAgIHBlbmRpbmdGcmllbmRSZXF1ZXN0czp0b3AsXHJcbiAgICAgICAgcmVxdWVzdFJlc3BvbnNlczpib3R0b21cclxuICAgICAgfSlcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIGZvY3VzT25GcmllbmQoZnJpZW5kKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAkKCcuZnJpZW5kRW50cnlJbmRpdmlkdWFsJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgdmFyIGZyaWVuZE5hbWUgPSAkKHRoaXMpLmh0bWwoKTtcclxuXHJcbiAgICAgIHRoYXQuc2V0U3RhdGUoe1xyXG4gICAgICAgIHZpZXc6J3NpbmdsZUZyaWVuZCcsXHJcbiAgICAgICAgZnJpZW5kVG9Gb2N1c09uOiBmcmllbmRcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAkLmdldChVcmwgKyAnL2dldEZyaWVuZFVzZXJSYXRpbmdzJyx7ZnJpZW5kTmFtZTogZnJpZW5kfSxmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGZyaWVuZClcclxuICAgICAgICBjb25zb2xlLmxvZygnZ2V0dGluZyBmcmllbmQgbW92aWVzOicsIHJlc3BvbnNlKTtcclxuICAgICAgICB0aGF0LnNldFN0YXRlKHtcclxuICAgICAgICAgIGluZGl2aWR1YWxGcmllbmRzTW92aWVzOiByZXNwb25zZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgfSk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbGlzdFBvdGVudGlhbHMoKSB7XHJcbiAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgbGlzdCBwb3RlbnRpYWwgZnJpZW5kcycpXHJcbiAgfVxyXG5cclxuICByZW1vdmVSZXF1ZXN0KHBlcnNvbiwgc2VsZiwgbW92aWUpIHtcclxuICAgIHZhciB0aGF0PSB0aGlzO1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgdXJsOiBVcmwgKyAnL3JlbW92ZVJlcXVlc3QnLFxyXG4gICAgICB0eXBlOiAnREVMRVRFJyxcclxuICAgICAgZGF0YToge1xyXG4gICAgICAgIHJlcXVlc3Rvcjogc2VsZixcclxuICAgICAgICByZXF1ZXN0ZWU6IHBlcnNvbixcclxuICAgICAgICBtb3ZpZTogbW92aWVcclxuICAgICAgfSxcclxuICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnUkVRVUVTVCBSRU1PVkVEISBNb3ZpZSBpczogJywgbW92aWUpO1xyXG4gICAgICAgIHRoYXQubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpO1xyXG4gICAgICB9LFxyXG4gICAgICBlcnJvcjogZnVuY3Rpb24oZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgaWYgKHRoaXMuc3RhdGUudmlldz09PSdMb2dpbicpIHtcclxuICAgICAgcmV0dXJuICg8TG9nSW4gY2hhbmdlVmlld3M9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX0gc2V0Q3VycmVudFVzZXI9e3RoaXMuc2V0Q3VycmVudFVzZXIuYmluZCh0aGlzKX0vPik7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldz09PVwiU2lnblVwXCIpIHtcclxuICAgICAgcmV0dXJuICg8U2lnblVwIGNoYW5nZVZpZXdzPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9IHNldEN1cnJlbnRVc2VyPXt0aGlzLnNldEN1cnJlbnRVc2VyLmJpbmQodGhpcyl9IC8+KTtcclxuICAgIH0gXHJcbiAgICAvL3RoaXMgdmlldyBpcyBhZGRlZCBmb3IgbW92aWVzZWFyY2ggcmVuZGVyaW5nXHJcbiAgICBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiTW92aWVTZWFyY2hWaWV3XCIpIHtcclxuICAgICAgcmV0dXJuICggXHJcbiAgICAgICAgPGRpdj4gXHJcbiAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XHJcbiAgICAgICAgICAgIGZpbmQ9e3RoaXMuZmluZE1vdmllQnVkZGllcy5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX0gXHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICA8TW92aWVSYXRpbmcgXHJcbiAgICAgICAgICAgIGhhbmRsZVNlYXJjaE1vdmllPXt0aGlzLmdldE1vdmllLmJpbmQodGhpcyl9IFxyXG4gICAgICAgICAgICBtb3ZpZT17dGhpcy5zdGF0ZS5tb3ZpZX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiSW5ib3hcIiApIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XHJcbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgICBIb21lPXt0cnVlfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8SW5ib3ggXHJcbiAgICAgICAgICAgICAgcmVxdWVzdHM9e3RoaXMuc3RhdGUucGVuZGluZ0ZyaWVuZFJlcXVlc3RzfVxyXG4gICAgICAgICAgICAgIHJlc3BvbnNlc0Fuc3dlcmVkPXt0aGlzLnN0YXRlLnJlcXVlc3RSZXNwb25zZXN9XHJcbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfSAgXHJcbiAgICAgICAgICAgICAgYWNjZXB0PSB7dGhpcy5hY2NlcHRGcmllbmQuYmluZCh0aGlzKX0gXHJcbiAgICAgICAgICAgICAgZGVjbGluZT17dGhpcy5kZWNsaW5lRnJpZW5kLmJpbmQodGhpcyl9IFxyXG4gICAgICAgICAgICAgIGxpc3RSZXF1ZXN0cz17dGhpcy5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzLmJpbmQodGhpcyl9IFxyXG4gICAgICAgICAgICAgIHBwbFdob1dhbnRUb0JlRnJpZW5kcz17dGhpcy5zdGF0ZS5wZW5kaW5nRnJpZW5kUmVxdWVzdHMubWFwKFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oYSl7cmV0dXJuIFthLnJlcXVlc3RvcixhLnJlcXVlc3RUeXAsYS5tb3ZpZT09PW51bGw/XCJcIjogYS5tb3ZpZSxcIk1lc3NhZ2U6XCIrIGEubWVzc2FnZT09PSdudWxsJz9cIm5vbmVcIjphLm1lc3NhZ2VdfSl9IFxyXG4gICAgICAgICAgICAgIHJlbW92ZT17dGhpcy5yZW1vdmVSZXF1ZXN0LmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJGcmllbmRzXCIgKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxyXG4gICAgICAgICAgICAgIGZpbmQ9e3RoaXMuZmluZE1vdmllQnVkZGllcy5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9Lz5cclxuICAgICAgICAgIDxGcmllbmRzIFxyXG4gICAgICAgICAgICBzZW5kV2F0Y2hSZXF1ZXN0PXt0aGlzLnNlbmRXYXRjaFJlcXVlc3QuYmluZCh0aGlzKX0gXHJcbiAgICAgICAgICAgIGZvZj0ge3RoaXMuZm9jdXNPbkZyaWVuZC5iaW5kKHRoaXMpfSBcclxuICAgICAgICAgICAgZ2V0RnJpZW5kcz17dGhpcy5nZXRDdXJyZW50RnJpZW5kcy5iaW5kKHRoaXMpfSBcclxuICAgICAgICAgICAgbXlGcmllbmRzPXt0aGlzLnN0YXRlLm15RnJpZW5kc30gXHJcbiAgICAgICAgICAgIGxpc3RQb3RlbnRpYWxzPXt0aGlzLmxpc3RQb3RlbnRpYWxzLmJpbmQodGhpcyl9IFxyXG4gICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9ICBcclxuICAgICAgICAgICAgc2VuZFJlcXVlc3Q9e3RoaXMuc2VuZFJlcXVlc3QuYmluZCh0aGlzKX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiSG9tZVwiKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxyXG4gICAgICAgICAgICAgIGZpbmQ9e3RoaXMuZmluZE1vdmllQnVkZGllcy5iaW5kKHRoaXMpfSBcclxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgPEhvbWUgXHJcbiAgICAgICAgICAgIGNoYW5nZT17dGhpcy5jaGFuZ2VWaWV3c01vdmllLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICApO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiU2luZ2xlTW92aWVcIikge1xyXG4gICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBvbkNsaWNrPXsoKT0+Y29uc29sZS5sb2codGhhdC5zdGF0ZSl9PlxyXG4gICAgICAgICAgICA8TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XHJcbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDxTaW5nbGVNb3ZpZVJhdGluZyBcclxuICAgICAgICAgICAgY29tcGF0aWJpbGl0eT17dGhpcy5zdGF0ZS5teUZyaWVuZHN9XHJcbiAgICAgICAgICAgIGN1cnJlbnRNb3ZpZT17dGhpcy5zdGF0ZS5tb3ZpZX1cclxuICAgICAgICAgICAgY2hhbmdlPXt0aGlzLmNoYW5nZVZpZXdzRnJpZW5kcy5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICBmb2Y9e3RoaXMuZm9jdXNPbkZyaWVuZC5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3PT09J3NpbmdsZUZyaWVuZCcpIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XHJcbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyl9IFxyXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8U2luZ2xlRnJpZW5kIFxyXG4gICAgICAgICAgICBtb3ZpZXNPZkZyaWVuZD17dGhpcy5zdGF0ZS5pbmRpdmlkdWFsRnJpZW5kc01vdmllc30gXHJcbiAgICAgICAgICAgIGZyaWVuZE5hbWU9e3RoaXMuc3RhdGUuZnJpZW5kVG9Gb2N1c09ufSBcclxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NNb3ZpZS5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkZOTUJcIikge1xyXG4gICAgICByZXR1cm4gKFxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cclxuICAgICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKX0gXHJcbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDxGaW5kTW92aWVCdWRkeSBcclxuICAgICAgICAgICAgYnVkZHlmdW5jPXt0aGlzLmJ1ZGR5UmVxdWVzdC5iaW5kKHRoaXMpfSBcclxuICAgICAgICAgICAgYnVkZGllcz17dGhpcy5zdGF0ZS5wb3RlbnRpYWxNb3ZpZUJ1ZGRpZXN9IFxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIk15UmF0aW5nc1wiKSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxyXG4gICAgICAgICAgICAgIGZpbmQ9e3RoaXMuZmluZE1vdmllQnVkZGllcy5iaW5kKHRoaXMpfSBcclxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XHJcbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgPE15UmF0aW5ncyBcclxuICAgICAgICAgICAgY2hhbmdlPXt0aGlzLmNoYW5nZVZpZXdzTW92aWUuYmluZCh0aGlzKX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG53aW5kb3cuQXBwID0gQXBwO1xyXG4vL3ZhciBVcmwgPSAnaHR0cHM6Ly90aGF3aW5nLWlzbGFuZC05OTc0Ny5oZXJva3VhcHAuY29tJztcclxudmFyIFVybCA9ICdodHRwOi8vMTI3LjAuMC4xOjMwMDAnO1xyXG53aW5kb3cuVXJsID0gVXJsO1xyXG4iXX0=
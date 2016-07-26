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

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(App).call(this, props));

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
var Url = 'https://thawing-island-99747.herokuapp.com';
// var Url = 'http://127.0.0.1:3000';
window.Url = Url;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBTSxHOzs7QUFDSixlQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSx1RkFDWCxLQURXOztBQUdqQixVQUFLLEtBQUwsR0FBYTtBQUNYLFlBQUssT0FETTtBQUVYLHNCQUFlLEVBRko7QUFHWCxhQUFPLElBSEk7QUFJWCxzQkFBZSxFQUpKO0FBS1gsNkJBQXNCLEVBTFg7QUFNWCxpQkFBVSxFQU5DO0FBT1gsdUJBQWdCLEVBUEw7QUFRWCwrQkFBd0IsRUFSYjtBQVNYLDZCQUFzQixFQVRYO0FBVVgsZ0JBQVUsSUFWQztBQVdYLHdCQUFpQixFQVhOO0FBWVgsbUJBQVksSUFaRDtBQWFYLDZCQUFzQjtBQWJYLEtBQWI7QUFIaUI7QUFrQmxCOzs7O3dDQUVtQjtBQUNsQixVQUFJLE9BQUssSUFBVDtBQUNBLGNBQVEsR0FBUixDQUFZLFdBQVo7QUFDQSxRQUFFLElBQUYsQ0FBTyxNQUFNLGFBQWIsRUFBMkIsRUFBQyxNQUFLLE1BQU4sRUFBM0IsRUFBeUMsVUFBUyxDQUFULEVBQVcsQ0FBWCxFQUFjO0FBQ3JELGdCQUFRLEdBQVIsQ0FBWSwrQ0FBWixFQUE0RCxDQUE1RCxFQUE4RCxDQUE5RDtBQUNPLGFBQUssSUFBSSxJQUFFLENBQVgsRUFBYSxJQUFFLEVBQUUsTUFBakIsRUFBd0IsR0FBeEIsRUFBNEI7QUFDekIsY0FBSSxFQUFFLENBQUYsRUFBSyxDQUFMLE1BQVUsSUFBZCxFQUFtQjtBQUNqQixjQUFFLENBQUYsRUFBSyxDQUFMLElBQVUsMEJBQVY7QUFDRDtBQUNGOztBQUVSLFlBQUksUUFBTyxFQUFFLElBQUYsQ0FBTyxVQUFTLENBQVQsRUFBVyxDQUFYLEVBQWE7QUFBQyxpQkFBTyxFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBWjtBQUFpQixTQUF0QyxDQUFYO0FBQ0QsYUFBSyxRQUFMLENBQWM7QUFDWixxQkFBVTtB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c0NvbnRlbnQiOlsiY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgdmlldzonTG9naW4nLFxuICAgICAgZnJpZW5kc1JhdGluZ3M6W10sXG4gICAgICBtb3ZpZTogbnVsbCxcbiAgICAgIGZyaWVuZFJlcXVlc3RzOltdLFxuICAgICAgcGVuZGluZ0ZyaWVuZFJlcXVlc3RzOltdLFxuICAgICAgbXlGcmllbmRzOltdLFxuICAgICAgZnJpZW5kVG9Gb2N1c09uOicnLFxuICAgICAgaW5kaXZpZHVhbEZyaWVuZHNNb3ZpZXM6W10sXG4gICAgICBwb3RlbnRpYWxNb3ZpZUJ1ZGRpZXM6e30sXG4gICAgICB1c2VybmFtZTogbnVsbCxcbiAgICAgIHJlcXVlc3RSZXNwb25zZXM6W10sXG4gICAgICBjdXJyZW50VXNlcjpudWxsLFxuICAgICAgcmVxdWVzdHNPZkN1cnJlbnRVc2VyOltdXG4gICAgfTtcbiAgfVxuXG4gIGdldEN1cnJlbnRGcmllbmRzKCkge1xuICAgIHZhciB0aGF0PXRoaXM7XG4gICAgY29uc29sZS5sb2coJ3Rlc3RpbmdnZycpXG4gICAgJC5wb3N0KFVybCArICcvZ2V0RnJpZW5kcycse3Rlc3Q6J2luZm8nfSxmdW5jdGlvbihhLGIpIHtcbiAgICAgIGNvbnNvbGUubG9nKCd3aGF0IHlvdSBnZXQgYmFjayBmcm9tIHNlcnZlciBmb3IgZ2V0IGZyaWVuZHMnLGEsYik7XG4gICAgICAgICAgICAgZm9yICh2YXIgaT0wO2k8YS5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgICAgICBpZiAoYVtpXVsxXT09PW51bGwpe1xuICAgICAgICAgICAgICAgICAgYVtpXVsxXSA9IFwiTm8gY29tcGFyaXNvbiB0byBiZSBtYWRlXCI7XG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIH1cblxuICAgICAgIHZhciBmaW5hbD0gYS5zb3J0KGZ1bmN0aW9uKGEsYil7cmV0dXJuIGJbMV0tYVsxXX0pO1xuICAgICAgdGhhdC5zZXRTdGF0ZSh7XG4gICAgICAgIG15RnJpZW5kczpmaW5hbFxuICAgICAgfSlcbiAgICAgIGNvbnNvbGUubG9nKCd0aGVzIGFyZSBteSBmcmllbmRzISEhISEhISEhISEhISEhISEnLHRoYXQuc3RhdGUubXlGcmllbmRzKVxuICAgIH0pXG4gIH1cblxuICBhY2NlcHRGcmllbmQoYSwgbW92aWUpIHtcbiAgICB2YXIgdGhhdD10aGlzO1xuICAgIHZhciBmaW5hbD1hO1xuICAgIC8vICQoJ2J1dHRvbicpLm9uKCdjbGljaycsZnVuY3Rpb24oKSB7XG4gICAgLy8gICBjb25zb2xlLmxvZygkKHRoaXMpLmh0bWwoKSk7XG4gICAgLy8gfSlcbiAgICAvLyBjb25zb2xlLmxvZyhmaW5hbCArJ3Nob3VsZCBiZSBhY2NlcHRlZCwgZm9yIG1vdmllLi4uLicsIG1vdmllKVxuXG4gICAgJC5wb3N0KFVybCArICcvYWNjZXB0Jyx7cGVyc29uVG9BY2NlcHQ6ZmluYWwsIG1vdmllOiBtb3ZpZX0sZnVuY3Rpb24oYSxiKSB7XG4gICAgICB0aGF0Lmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKTtcbiAgICB9KVxuICAgIFxuICAgIGNvbnNvbGUubG9nKCdyZWZyZXNoZWQgaW5ib3gsIHNob3VsZCBkZWxldGUgZnJpZW5kIHJlcXVlc3Qgb24gdGhlIHNwb3QgaW5zdGVhZCBvZiBtb3ZpbmcnKVxuICB9XG5cbiAgZGVjbGluZUZyaWVuZChhLCBtb3ZpZSkge1xuICAgIHZhciB0aGF0PXRoaXM7XG4gICAgdmFyIGZpbmFsPWE7XG5cbiAgICAkLnBvc3QoVXJsICsgJy9kZWNsaW5lJyx7cGVyc29uVG9EZWNsaW5lOmZpbmFsLCBtb3ZpZTogbW92aWV9LGZ1bmN0aW9uKGEsYikge1xuICAgICAgY29uc29sZS5sb2coYSxiKVxuICAgICAgY29uc29sZS5sb2coJ3RoaXMgaXMgdGhlIHN0YXRlIGFmdGVyIGRlY2xpbmluZyBmcmllbmQsICcsIHRoYXQuc3RhdGUpO1xuICAgICAgdGhhdC5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCk7XG4gICAgfSlcbiAgfVxuXG4gIGZpbmRNb3ZpZUJ1ZGRpZXMoKSB7XG4gICAgdmFyIHRoYXQ9dGhpcztcbiAgICAkLnBvc3QoVXJsICsgJy9maW5kTW92aWVCdWRkaWVzJyx7ZHVtbXk6J2luZm8nfSxmdW5jdGlvbihhLGIpIHtcbiAgICAgIHZhciBmaW5hbD1hLnNvcnQoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYlsxXS1hWzFdfSlcbiAgICAgIHZhciBteUZyaWVuZHM9dGhhdC5zdGF0ZS5teUZyaWVuZHNcbiAgICAgICB2YXIgcmVhbEZpbmFsPVtdXG4gICAgICAgIGZvciAodmFyIGk9MDtpPGZpbmFsLmxlbmd0aDtpKyspe1xuICAgICAgICAgIHZhciB1bmlxdWU9dHJ1ZVxuICAgICAgICAgIGZvciAodmFyIHg9MDt4PG15RnJpZW5kcy5sZW5ndGg7eCsrKXtcbiAgICAgICAgICAgIGlmIChmaW5hbFtpXVswXT09PW15RnJpZW5kc1t4XVswXSl7XG4gICAgICAgICAgICAgIHVuaXF1ZT1mYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHVuaXF1ZSl7XG4gICAgICAgICAgICByZWFsRmluYWwucHVzaChmaW5hbFtpXSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG5cbiAgICAgIHRoYXQuc2V0U3RhdGUoe1xuICAgICAgICB2aWV3OlwiRk5NQlwiLFxuICAgICAgICBwb3RlbnRpYWxNb3ZpZUJ1ZGRpZXM6cmVhbEZpbmFsXG4gICAgICB9KVxuICAgICAgY29uc29sZS5sb2codGhhdC5zdGF0ZS5teUZyaWVuZHMsdGhhdC5zdGF0ZS5wb3RlbnRpYWxNb3ZpZUJ1ZGRpZXMpO1xuXG4gICAgfSlcbiAgfVxuXG4gIGNoYW5nZVZpZXcoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB2aWV3OlwiU2lnblVwXCIgXG4gICAgfSlcbiAgfVxuXG4gIHNldEN1cnJlbnRVc2VyKHVzZXJuYW1lKSB7XG4gICAgY29uc29sZS5sb2coJ2NhbGxpbmcgc2V0Q3VycmVudFVzZXInKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGN1cnJlbnRVc2VyOiB1c2VybmFtZVxuICAgIH0pXG4gIH1cblxuICBlbnRlck5ld1VzZXIobmFtZSxwYXNzd29yZCkge1xuICAgIGNvbnNvbGUubG9nKG5hbWUscGFzc3dvcmQpO1xuICAgICQucG9zdChVcmwgKyAnL3NpZ251cCcse25hbWU6bmFtZSxwYXNzd29yZDpwYXNzd29yZH0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICBjb25zb2xlLmxvZygnc3VjY2VzcycpOyBcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3VzZXJuYW1lOiBuYW1lLCB2aWV3OiBcIkhvbWVcIn0pXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24oKSB7Y29uc29sZS5sb2coJ2Vycm9yJyl9KVxuICB9XG5cbiAgZ2V0RnJpZW5kTW92aWVSYXRpbmdzKCkge1xuICAgIHZhciB0aGF0PXRoaXM7XG4gICAgY29uc29sZS5sb2coJ21vb29vb3ZpZScpO1xuICAgIHZhciBtb3ZpZU5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vdmllVG9WaWV3XCIpLnZhbHVlXG4gICAgJC5wb3N0KFVybCArICcvZ2V0RnJpZW5kUmF0aW5ncycsIHsgbmFtZTogbW92aWVOYW1lIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcblxuICAgICAgdGhhdC5zZXRTdGF0ZSh7XG4gICAgICB2aWV3OlwiSG9tZVwiLFxuICAgICAgZnJpZW5kc1JhdGluZ3M6cmVzcG9uc2VcbiAgICB9KVxuICAgIGNvbnNvbGUubG9nKCdvdXIgcmVzcG9uc2UnLHRoYXQuc3RhdGUuZnJpZW5kc1JhdGluZ3MpXG5cbiAgICB9KS5jYXRjaChmdW5jdGlvbihlcnIpIHtjb25zb2xlLmxvZyhlcnIpfSk7XG4gIH1cblxuICBsb2dvdXQoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICQucG9zdChVcmwgKyAnL2xvZ291dCcpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgIHRoYXQuc2V0U3RhdGUoe1xuICAgICAgICB2aWV3OlwiTG9naW5cIixcbiAgICAgICAgZnJpZW5kc1JhdGluZ3M6W10sXG4gICAgICAgIG1vdmllOiBudWxsLFxuICAgICAgICBmcmllbmRSZXF1ZXN0czpbXSxcbiAgICAgICAgcGVuZGluZ0ZyaWVuZFJlcXVlc3RzOltdLFxuICAgICAgICBteUZyaWVuZHM6W10sXG4gICAgICAgIGZyaWVuZFRvRm9jdXNPbjonJyxcbiAgICAgICAgaW5kaXZpZHVhbEZyaWVuZHNNb3ZpZXM6W10sXG4gICAgICAgIHBvdGVudGlhbE1vdmllQnVkZGllczp7fSxcbiAgICAgICAgdXNlcm5hbWU6IG51bGwsXG4gICAgICAgIHJlcXVlc3RSZXNwb25zZXM6W10sXG4gICAgICAgIGN1cnJlbnRVc2VyOm51bGwsXG4gICAgICAgIHJlcXVlc3RzT2ZDdXJyZW50VXNlcjpbXVxuXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHNlbmRXYXRjaFJlcXVlc3QoZnJpZW5kKSB7XG4gICAgdmFyIG1vdmllPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW92aWVUb1dhdGNoJykudmFsdWU7XG4gICAgdmFyIHRvU2VuZD17cmVxdWVzdGVlOmZyaWVuZCwgbW92aWU6bW92aWV9O1xuICAgIGlmIChtb3ZpZS5sZW5ndGg+MCkge1xuICAgICAgJC5wb3N0KFVybCArICcvc2VuZFdhdGNoUmVxdWVzdCcsIHRvU2VuZCAsZnVuY3Rpb24oYSxiKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGEsYik7XG4gICAgICB9KTtcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3ZpZVRvV2F0Y2gnKS52YWx1ZT0nJztcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3lvdSBuZWVkIHRvIGVudGVyIGEgbW92aWUgdG8gc2VuZCBhIHdhdGNoIHJlcXVlc3QhISEhJylcbiAgICB9XG4gIH1cblxuXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAvLy8vL21vdmllIHJlbmRlclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgLy9jYWxsIHNlYXJjaG1vdmllIGZ1bmN0aW9uXG4gIC8vd2hpY2ggZ2V0cyBwYXNzZWQgZG93biB0byB0aGUgTW92aWUgU2VhcmNoIFxuICBnZXRNb3ZpZShxdWVyeSkge1xuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgcXVlcnk6IHF1ZXJ5XG4gICAgfTtcbiAgICBcbiAgICB0aGlzLnByb3BzLnNlYXJjaE1vdmllKG9wdGlvbnMsIChtb3ZpZSkgPT4ge1xuICAgICAgY29uc29sZS5sb2cobW92aWUpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHZpZXc6XCJNb3ZpZVNlYXJjaFZpZXdcIixcbiAgICAgICAgbW92aWU6IG1vdmllXG4gICAgICB9KVxuICAgIH0pXG4gIH1cbiAgLy9zaG93IHRoZSBtb3ZpZSBzZWFyY2hlZCBpbiBmcmllbmQgbW92aWUgbGlzdFxuICAvL29udG8gdGhlIHN0YXRldmlldyBvZiBtb3ZpZXNlYXJjaHZpZXdcbiAgc2hvd01vdmllKG1vdmllKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBtb3ZpZTogbW92aWVcbiAgICB9KVxuICB9XG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAvLy8vL05hdiBjaGFuZ2VcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIGNoYW5nZVZpZXdzKHRhcmdldFN0YXRlKSB7XG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZSk7XG4gICAgdmFyIHRoYXQ9dGhpcztcblxuICAgIGlmICh0YXJnZXRTdGF0ZT09PSdGcmllbmRzJyl7XG4gICAgICBjb25zb2xlLmxvZygneW91IHN3aXRjaGVkIHRvIGZyaWVuZHMhIScpXG4gICAgICB0aGlzLmdldEN1cnJlbnRGcmllbmRzKClcbiAgICAgIHRoaXMuc2VuZFJlcXVlc3QoKTtcblxuICAgICAgXG4gICAgfVxuXG4gICBcbiAgICBpZiAodGFyZ2V0U3RhdGU9PT0nSG9tZScpe1xuICAgICAgdGhpcy5nZXRDdXJyZW50RnJpZW5kcygpXG4gICAgICB0aGlzLnNlbmRSZXF1ZXN0KCk7XG4gICAgICBcbiAgICB9XG5cblxuXG4gICAgIGlmICh0YXJnZXRTdGF0ZT09PVwiSW5ib3hcIil7XG4gICAgICAgdGhpcy5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKClcbiAgICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB2aWV3OiB0YXJnZXRTdGF0ZVxuICAgIH0pO1xuICB9XG5cbiAgY2hhbmdlVmlld3NNb3ZpZSh0YXJnZXRTdGF0ZSwgbW92aWUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHZpZXc6IHRhcmdldFN0YXRlLFxuICAgICAgbW92aWU6IG1vdmllXG4gICAgfSk7XG4gIH1cblxuICBjaGFuZ2VWaWV3c0ZyaWVuZHModGFyZ2V0U3RhdGUsIGZyaWVuZCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdmlldzogdGFyZ2V0U3RhdGUsXG4gICAgICBmcmllbmRUb0ZvY3VzT246IGZyaWVuZFxuICAgIH0pO1xuICB9XG5cblxuICBidWRkeVJlcXVlc3QoYSkge1xuICAgIHRoaXMuc2VuZFJlcXVlc3QoYSk7XG4gIH1cblxuXG4gIHNlbmRSZXF1ZXN0KGEpIHtcbmNvbnNvbGUubG9nKCdzZW5kIHJlcXVlc3QgaXMgYmVpbmcgcnVuISEnKVxuICAgIHZhciB0aGF0PXRoaXM7XG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kRnJpZW5kQnlOYW1lJykhPT1udWxsKXtcbiAgICAgIHZhciBwZXJzb249ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRGcmllbmRCeU5hbWUnKS52YWx1ZVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcGVyc29uID0gYSB8fCAndGVzdCc7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdwZXJzb246JyxwZXJzb24pXG4gICAgY29uc29sZS5sb2coJ3N0YXRlJywgdGhpcy5zdGF0ZSk7XG4gICAgY29uc29sZS5sb2coJ2xpbmUgMjQ4Jyx0aGlzLnN0YXRlLm15RnJpZW5kcylcbiAgICB2YXIgZnJpZW5kczE9W107XG4gICAgdmFyIGZyaWVuZHMyPVtdXG4gICAgZm9yICh2YXIgaT0wO2k8dGhpcy5zdGF0ZS5teUZyaWVuZHMubGVuZ3RoO2krKyl7XG4gICAgICBjb25zb2xlLmxvZygnbGluZSAyNTEnLHRoaXMuc3RhdGUubXlGcmllbmRzW2ldKVxuICAgICAgZnJpZW5kczEucHVzaCh0aGlzLnN0YXRlLm15RnJpZW5kc1tpXVswXSk7XG4gICAgICBmcmllbmRzMi5wdXNoKHRoaXMuc3RhdGUubXlGcmllbmRzW2ldWzBdKVxuICAgIH1cblxuICAgIGZvciAodmFyIGk9MDtpPHRoaXMuc3RhdGUucmVxdWVzdHNPZkN1cnJlbnRVc2VyLmxlbmd0aDtpKyspe1xuICAgICAgZnJpZW5kczEucHVzaCh0aGlzLnN0YXRlLnJlcXVlc3RzT2ZDdXJyZW50VXNlcltpXSlcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgYWxzbyBiZSBteSBmcmllbmRzJyx0aGlzLnN0YXRlLm15RnJpZW5kcyxmcmllbmRzMSxmcmllbmRzMilcblxuXG4gICAgdmFyIHBwbFlvdUNhbnRTZW5kVG89ZnJpZW5kczE7XG4gICAgY29uc29sZS5sb2coJ3RvZicsZnJpZW5kczEuaW5kZXhPZihwZXJzb24pIT09IC0xLCBmcmllbmRzMS5sZW5ndGghPT0wKVxuICAgIGlmIChmcmllbmRzMS5pbmRleE9mKHBlcnNvbikhPT0gLTEgJiYgZnJpZW5kczEubGVuZ3RoIT09MCl7XG4gICAgICAkKFwiI0FscmVhZHlSZXFcIikuZmFkZUluKDEwMDApO1xuICAgICAgJChcIiNBbHJlYWR5UmVxXCIpLmZhZGVPdXQoMTAwMCk7XG4gICAgICBjb25zb2xlLmxvZygndGhpcyBwZXJzb24gaXMgYWxyZWFkeSBpbiB0aGVyZSEhJylcbiAgICB9IGVsc2UgaWYgKHBlcnNvbi5sZW5ndGg9PT0wKSB7XG4gICAgICAkKFwiI2VudGVyUmVhbEZyaWVuZFwiKS5mYWRlSW4oMTAwMCk7XG4gICAgICAkKFwiI2VudGVyUmVhbEZyaWVuZFwiKS5mYWRlT3V0KDEwMDApO1xuICAgIH0gZWxzZSB7XG5cblxuICAgICAgJC5wb3N0KFVybCArICcvc2VuZFJlcXVlc3QnLHtuYW1lOnBlcnNvbn0sZnVuY3Rpb24oYSxiKSB7XG4gICAgICAgXG4gICAgICAgICAgdGhhdC5zZXRTdGF0ZSh7XG4gICAgICAgICAgICByZXF1ZXN0c09mQ3VycmVudFVzZXI6YS5jb25jYXQoW3BlcnNvbl0pXG4gICAgICAgICAgfSlcbiAgICAgICAgICBjb25zb2xlLmxvZygnbGluZSAyODEnLHRoYXQuc3RhdGUucmVxdWVzdHNPZkN1cnJlbnRVc2VyKTtcblxuICAgICAgICAkKFwiI3JlcVNlbnRcIikuZmFkZUluKDEwMDApO1xuICAgICAgICAkKFwiI3JlcVNlbnRcIikuZmFkZU91dCgxMDAwKTtcbiAgICAgIH0pO1xuICAgICAgaWYgKCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZEZyaWVuZEJ5TmFtZScpIT09bnVsbCl7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kRnJpZW5kQnlOYW1lJykudmFsdWUgPSAnJztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBsaXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCkge1xuICAgIHZhciB0aGF0PXRoaXM7XG4gICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGxpc3QgZnJpZW5kIHJlcXMnKVxuICAgICQucG9zdChVcmwgKyAnL2xpc3RSZXF1ZXN0cycsZnVuY3Rpb24ocmVzcG9uc2UsZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdSZXNwb25zZSBJIGdldCEhISEhISEnLHJlc3BvbnNlKTtcbiAgICAgIHZhciB0b3A9W11cbiAgICAgIHZhciBib3R0b209W11cbiAgICAgIGNvbnNvbGUubG9nKCd0cicsIHJlc3BvbnNlKVxuICAgICAgZm9yICh2YXIgaT0wO2k8cmVzcG9uc2VbMF0ubGVuZ3RoO2krKyl7XG4gICAgICAgIGlmIChyZXNwb25zZVswXVtpXVsncmVxdWVzdG9yJ10hPT1yZXNwb25zZVsxXSAmJiByZXNwb25zZVswXVtpXVsncmVzcG9uc2UnXT09PW51bGwgKXtcbiAgICAgICAgICB0b3AucHVzaChyZXNwb25zZVswXVtpXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3BvbnNlWzBdW2ldWydyZXF1ZXN0b3InXT09PXJlc3BvbnNlWzFdICYmcmVzcG9uc2VbMF1baV1bJ3Jlc3BvbnNlJ10hPT1udWxsICYmIHJlc3BvbnNlWzBdW2ldWydyZXF1ZXN0ZWUnXSE9PSd0ZXN0Jyl7XG4gICAgICAgICAgYm90dG9tLnB1c2gocmVzcG9uc2VbMF1baV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoYXQuc2V0U3RhdGUoe1xuICAgICAgICBwZW5kaW5nRnJpZW5kUmVxdWVzdHM6dG9wLFxuICAgICAgICByZXF1ZXN0UmVzcG9uc2VzOmJvdHRvbVxuICAgICAgfSlcbiAgICB9KTtcbiAgfTtcblxuICBmb2N1c09uRnJpZW5kKGZyaWVuZCkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAkKCcuZnJpZW5kRW50cnlJbmRpdmlkdWFsJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB2YXIgZnJpZW5kTmFtZSA9ICQodGhpcykuaHRtbCgpO1xuXG4gICAgICB0aGF0LnNldFN0YXRlKHtcbiAgICAgICAgdmlldzonc2luZ2xlRnJpZW5kJyxcbiAgICAgICAgZnJpZW5kVG9Gb2N1c09uOiBmcmllbmRcbiAgICAgIH0pO1xuXG4gICAgICAkLmdldChVcmwgKyAnL2dldEZyaWVuZFVzZXJSYXRpbmdzJyx7ZnJpZW5kTmFtZTogZnJpZW5kfSxmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhmcmllbmQpXG4gICAgICAgIGNvbnNvbGUubG9nKCdnZXR0aW5nIGZyaWVuZCBtb3ZpZXM6JywgcmVzcG9uc2UpO1xuICAgICAgICB0aGF0LnNldFN0YXRlKHtcbiAgICAgICAgICBpbmRpdmlkdWFsRnJpZW5kc01vdmllczogcmVzcG9uc2VcbiAgICAgICAgfSk7XG5cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgbGlzdFBvdGVudGlhbHMoKSB7XG4gICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGxpc3QgcG90ZW50aWFsIGZyaWVuZHMnKVxuICB9XG5cbiAgcmVtb3ZlUmVxdWVzdChwZXJzb24sIHNlbGYsIG1vdmllKSB7XG4gICAgdmFyIHRoYXQ9IHRoaXM7XG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogVXJsICsgJy9yZW1vdmVSZXF1ZXN0JyxcbiAgICAgIHR5cGU6ICdERUxFVEUnLFxuICAgICAgZGF0YToge1xuICAgICAgICByZXF1ZXN0b3I6IHNlbGYsXG4gICAgICAgIHJlcXVlc3RlZTogcGVyc29uLFxuICAgICAgICBtb3ZpZTogbW92aWVcbiAgICAgIH0sXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnUkVRVUVTVCBSRU1PVkVEISBNb3ZpZSBpczogJywgbW92aWUpO1xuICAgICAgICB0aGF0Lmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKTtcbiAgICAgIH0sXG4gICAgICBlcnJvcjogZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnZpZXc9PT0nTG9naW4nKSB7XG4gICAgICByZXR1cm4gKDxMb2dJbiBjaGFuZ2VWaWV3cz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfSBzZXRDdXJyZW50VXNlcj17dGhpcy5zZXRDdXJyZW50VXNlci5iaW5kKHRoaXMpfS8+KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldz09PVwiU2lnblVwXCIpIHtcbiAgICAgIHJldHVybiAoPFNpZ25VcCBjaGFuZ2VWaWV3cz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfSBzZXRDdXJyZW50VXNlcj17dGhpcy5zZXRDdXJyZW50VXNlci5iaW5kKHRoaXMpfSAvPik7XG4gICAgfSBcbiAgICAvL3RoaXMgdmlldyBpcyBhZGRlZCBmb3IgbW92aWVzZWFyY2ggcmVuZGVyaW5nXG4gICAgZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIk1vdmllU2VhcmNoVmlld1wiKSB7XG4gICAgICByZXR1cm4gKCBcbiAgICAgICAgPGRpdj4gXG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cbiAgICAgICAgICAgIGZpbmQ9e3RoaXMuZmluZE1vdmllQnVkZGllcy5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICA8TW92aWVSYXRpbmcgXG4gICAgICAgICAgICBoYW5kbGVTZWFyY2hNb3ZpZT17dGhpcy5nZXRNb3ZpZS5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgIG1vdmllPXt0aGlzLnN0YXRlLm1vdmllfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkluYm94XCIgKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxuICAgICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIEhvbWU9e3RydWV9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPEluYm94IFxuICAgICAgICAgICAgICByZXF1ZXN0cz17dGhpcy5zdGF0ZS5wZW5kaW5nRnJpZW5kUmVxdWVzdHN9XG4gICAgICAgICAgICAgIHJlc3BvbnNlc0Fuc3dlcmVkPXt0aGlzLnN0YXRlLnJlcXVlc3RSZXNwb25zZXN9XG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX0gIFxuICAgICAgICAgICAgICBhY2NlcHQ9IHt0aGlzLmFjY2VwdEZyaWVuZC5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgICAgZGVjbGluZT17dGhpcy5kZWNsaW5lRnJpZW5kLmJpbmQodGhpcyl9IFxuICAgICAgICAgICAgICBsaXN0UmVxdWVzdHM9e3RoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cy5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgICAgcHBsV2hvV2FudFRvQmVGcmllbmRzPXt0aGlzLnN0YXRlLnBlbmRpbmdGcmllbmRSZXF1ZXN0cy5tYXAoXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24oYSl7cmV0dXJuIFthLnJlcXVlc3RvcixhLnJlcXVlc3RUeXAsYS5tb3ZpZT09PW51bGw/XCJcIjogYS5tb3ZpZSxcIk1lc3NhZ2U6XCIrIGEubWVzc2FnZT09PSdudWxsJz9cIm5vbmVcIjphLm1lc3NhZ2VdfSl9IFxuICAgICAgICAgICAgICByZW1vdmU9e3RoaXMucmVtb3ZlUmVxdWVzdC5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkZyaWVuZHNcIiApIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XG4gICAgICAgICAgICAgIGZpbmQ9e3RoaXMuZmluZE1vdmllQnVkZGllcy5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX0vPlxuICAgICAgICAgIDxGcmllbmRzIFxuICAgICAgICAgICAgc2VuZFdhdGNoUmVxdWVzdD17dGhpcy5zZW5kV2F0Y2hSZXF1ZXN0LmJpbmQodGhpcyl9IFxuICAgICAgICAgICAgZm9mPSB7dGhpcy5mb2N1c09uRnJpZW5kLmJpbmQodGhpcyl9IFxuICAgICAgICAgICAgZ2V0RnJpZW5kcz17dGhpcy5nZXRDdXJyZW50RnJpZW5kcy5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgIG15RnJpZW5kcz17dGhpcy5zdGF0ZS5teUZyaWVuZHN9IFxuICAgICAgICAgICAgbGlzdFBvdGVudGlhbHM9e3RoaXMubGlzdFBvdGVudGlhbHMuYmluZCh0aGlzKX0gXG4gICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9ICBcbiAgICAgICAgICAgIHNlbmRSZXF1ZXN0PXt0aGlzLnNlbmRSZXF1ZXN0LmJpbmQodGhpcyl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgICBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiSG9tZVwiKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxuICAgICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKX0gXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8SG9tZSBcbiAgICAgICAgICAgIGNoYW5nZT17dGhpcy5jaGFuZ2VWaWV3c01vdmllLmJpbmQodGhpcyl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIlNpbmdsZU1vdmllXCIpIHtcbiAgICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgb25DbGljaz17KCk9PmNvbnNvbGUubG9nKHRoYXQuc3RhdGUpfT5cbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDxTaW5nbGVNb3ZpZVJhdGluZyBcbiAgICAgICAgICAgIGNvbXBhdGliaWxpdHk9e3RoaXMuc3RhdGUubXlGcmllbmRzfVxuICAgICAgICAgICAgY3VycmVudE1vdmllPXt0aGlzLnN0YXRlLm1vdmllfVxuICAgICAgICAgICAgY2hhbmdlPXt0aGlzLmNoYW5nZVZpZXdzRnJpZW5kcy5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgZm9mPXt0aGlzLmZvY3VzT25GcmllbmQuYmluZCh0aGlzKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXc9PT0nc2luZ2xlRnJpZW5kJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyl9IFxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPFNpbmdsZUZyaWVuZCBcbiAgICAgICAgICAgIG1vdmllc09mRnJpZW5kPXt0aGlzLnN0YXRlLmluZGl2aWR1YWxGcmllbmRzTW92aWVzfSBcbiAgICAgICAgICAgIGZyaWVuZE5hbWU9e3RoaXMuc3RhdGUuZnJpZW5kVG9Gb2N1c09ufSBcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIGNoYW5nZT17dGhpcy5jaGFuZ2VWaWV3c01vdmllLmJpbmQodGhpcyl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkZOTUJcIikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyl9IFxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPEZpbmRNb3ZpZUJ1ZGR5IFxuICAgICAgICAgICAgYnVkZHlmdW5jPXt0aGlzLmJ1ZGR5UmVxdWVzdC5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgIGJ1ZGRpZXM9e3RoaXMuc3RhdGUucG90ZW50aWFsTW92aWVCdWRkaWVzfSBcbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiTXlSYXRpbmdzXCIpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XG4gICAgICAgICAgICAgIGZpbmQ9e3RoaXMuZmluZE1vdmllQnVkZGllcy5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDxNeVJhdGluZ3MgXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NNb3ZpZS5iaW5kKHRoaXMpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cblxud2luZG93LkFwcCA9IEFwcDtcbnZhciBVcmwgPSAnaHR0cHM6Ly90aGF3aW5nLWlzbGFuZC05OTc0Ny5oZXJva3VhcHAuY29tJztcbi8vIHZhciBVcmwgPSAnaHR0cDovLzEyNy4wLjAuMTozMDAwJztcbndpbmRvdy5VcmwgPSBVcmw7XG4iXX0=
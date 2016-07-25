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
          friendsRatings: []
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
// var Url = 'https://thawing-island-99747.herokuapp.com';
var Url = 'http://127.0.0.1:3000';
window.Url = Url;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFBTSxHOzs7QUFDSixlQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSx1RkFDWCxLQURXOztBQUdqQixVQUFLLEtBQUwsR0FBYTtBQUNYLFlBQUssT0FETTtBQUVYLHNCQUFlLEVBRko7QUFHWCxhQUFPLElBSEk7QUFJWCxzQkFBZSxFQUpKO0FBS1gsNkJBQXNCLEVBTFg7QUFNWCxpQkFBVSxFQU5DO0FBT1gsdUJBQWdCLEVBUEw7QUFRWCwrQkFBd0IsRUFSYjtBQVNYLDZCQUFzQixFQVRYO0FBVVgsZ0JBQVUsSUFWQztBQVdYLHdCQUFpQixFQVhOO0FBWVgsbUJBQVksSUFaRDtBQWFYLDZCQUFzQjtBQWJYLEtBQWI7QUFIaUI7QUFrQmxCOzs7O3dDQUVtQjtBQUNsQixVQUFJLE9BQUssSUFBVDtBQUNBLGNBQVEsR0FBUixDQUFZLFdBQVo7QUFDQSxRQUFFLElBQUYsQ0FBTyxNQUFNLGFBQWIsRUFBMkIsRUFBQyxNQUFLLE1BQU4sRUFBM0IsRUFBeUMsVUFBUyxDQUFULEVBQVcsQ0FBWCxFQUFjO0FBQ3JELGdCQUFRLEdBQVIsQ0FBWSwrQ0FBWixFQUE0RCxDQUE1RCxFQUE4RCxDQUE5RDtBQUNPLGFBQUssSUFBSSxJQUFFLENBQVgsRUFBYSxJQUFFLEVBQUUsTUFBakIsRUFBd0IsR0FBeEIsRUFBNEI7QUFDekIsY0FBSSxFQUFFLENBQUYsRUFBSyxDQUFMLE1BQVUsSUFBZCxFQUFtQjtBQUNqQixjQUFFLENBQUYsRUFBSyxDQUFMLElBQVUsMEJBQVY7QUFDRDtBQUNGOztBQUVSLFlBQUksUUFBTyxFQUFFLElBQUYsQ0FBTyxVQUFTLENBQVQsRUFBVyxDQUFYLEVBQWE7QUFBQyxpQkFBTyxFQUFFLENBQUYsSUFBSyxFQUFFLENBQUYsQ0FBWjtBQUFpQixTQUF0QyxDQUFYO0FBQ0QsYUFBSyxRQUFMLENBQWM7QUFDWixxQkFBVTtB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QixDQUEyQixJQUEzQixDQURSO0FBRUUsdUJBQVMsS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCLENBRlg7QUFHRSxzQkFBUSxLQUFLLE1BQUwsQ0FBWSxJQUFaLENBQWlCLElBQWpCO0FBSFYsY0FESjtBQU1FLGdDQUFDLGNBQUQ7QUFDRSx5QkFBVyxLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FEYjtBQUVFLHVCQUFTLEtBQUssS0FBTCxDQUFXO0FBRnRCO0FBTkYsV0FERjtBQWFELFNBZE0sTUFjQSxJQUFJLEtBQUssS0FBTCxDQUFXLElBQVgsS0FBb0IsV0FBeEIsRUFBcUM7QUFDMUMsaUJBQ0U7QUFBQTtBQUFBO0FBQ0ksZ0NBQUMsR0FBRCxJQUFLLE1BQU0sS0FBSyxLQUFMLENBQVcsV0FBdEI7QUFDRSxvQkFBTSxLQUFLLGdCQUFMLENBQXNCLElBQXRCLENBQTJCLElBQTNCLENBRFI7QUFFRSx1QkFBUyxLQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsSUFBdEIsQ0FGWDtBQUdFLHNCQUFRLEtBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsSUFBakI7QUFIVixjQURKO0FBTUUsZ0NBQUMsU0FBRDtBQUNFLHNCQUFRLEtBQUssZ0JBQUwsQ0FBc0IsSUFBdEIsQ0FBMkIsSUFBM0I7QUFEVjtBQU5GLFdBREY7QUFZRDtBQUNGOzs7O0VBbGZlLE1BQU0sUzs7QUFxZnhCLE9BQU8sR0FBUCxHQUFhLEdBQWI7O0FBRUEsSUFBSSxNQUFNLHVCQUFWO0FBQ0EsT0FBTyxHQUFQLEdBQWEsR0FBYiIsImZpbGUiOiJBcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICB2aWV3OidMb2dpbicsXG4gICAgICBmcmllbmRzUmF0aW5nczpbXSxcbiAgICAgIG1vdmllOiBudWxsLFxuICAgICAgZnJpZW5kUmVxdWVzdHM6W10sXG4gICAgICBwZW5kaW5nRnJpZW5kUmVxdWVzdHM6W10sXG4gICAgICBteUZyaWVuZHM6W10sXG4gICAgICBmcmllbmRUb0ZvY3VzT246JycsXG4gICAgICBpbmRpdmlkdWFsRnJpZW5kc01vdmllczpbXSxcbiAgICAgIHBvdGVudGlhbE1vdmllQnVkZGllczp7fSxcbiAgICAgIHVzZXJuYW1lOiBudWxsLFxuICAgICAgcmVxdWVzdFJlc3BvbnNlczpbXSxcbiAgICAgIGN1cnJlbnRVc2VyOm51bGwsXG4gICAgICByZXF1ZXN0c09mQ3VycmVudFVzZXI6W11cbiAgICB9O1xuICB9XG5cbiAgZ2V0Q3VycmVudEZyaWVuZHMoKSB7XG4gICAgdmFyIHRoYXQ9dGhpcztcbiAgICBjb25zb2xlLmxvZygndGVzdGluZ2dnJylcbiAgICAkLnBvc3QoVXJsICsgJy9nZXRGcmllbmRzJyx7dGVzdDonaW5mbyd9LGZ1bmN0aW9uKGEsYikge1xuICAgICAgY29uc29sZS5sb2coJ3doYXQgeW91IGdldCBiYWNrIGZyb20gc2VydmVyIGZvciBnZXQgZnJpZW5kcycsYSxiKTtcbiAgICAgICAgICAgICBmb3IgKHZhciBpPTA7aTxhLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgIGlmIChhW2ldWzFdPT09bnVsbCl7XG4gICAgICAgICAgICAgICAgICBhW2ldWzFdID0gXCJObyBjb21wYXJpc29uIHRvIGJlIG1hZGVcIjtcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgdmFyIGZpbmFsPSBhLnNvcnQoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYlsxXS1hWzFdfSk7XG4gICAgICB0aGF0LnNldFN0YXRlKHtcbiAgICAgICAgbXlGcmllbmRzOmZpbmFsXG4gICAgICB9KVxuICAgICAgY29uc29sZS5sb2coJ3RoZXMgYXJlIG15IGZyaWVuZHMhISEhISEhISEhISEhISEhIScsdGhhdC5zdGF0ZS5teUZyaWVuZHMpXG4gICAgfSlcbiAgfVxuXG4gIGFjY2VwdEZyaWVuZChhLCBtb3ZpZSkge1xuICAgIHZhciB0aGF0PXRoaXM7XG4gICAgdmFyIGZpbmFsPWE7XG4gICAgLy8gJCgnYnV0dG9uJykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKCQodGhpcykuaHRtbCgpKTtcbiAgICAvLyB9KVxuICAgIC8vIGNvbnNvbGUubG9nKGZpbmFsICsnc2hvdWxkIGJlIGFjY2VwdGVkLCBmb3IgbW92aWUuLi4uJywgbW92aWUpXG5cbiAgICAkLnBvc3QoVXJsICsgJy9hY2NlcHQnLHtwZXJzb25Ub0FjY2VwdDpmaW5hbCwgbW92aWU6IG1vdmllfSxmdW5jdGlvbihhLGIpIHtcbiAgICAgIHRoYXQubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpO1xuICAgIH0pXG4gICAgXG4gICAgY29uc29sZS5sb2coJ3JlZnJlc2hlZCBpbmJveCwgc2hvdWxkIGRlbGV0ZSBmcmllbmQgcmVxdWVzdCBvbiB0aGUgc3BvdCBpbnN0ZWFkIG9mIG1vdmluZycpXG4gIH1cblxuICBkZWNsaW5lRnJpZW5kKGEsIG1vdmllKSB7XG4gICAgdmFyIHRoYXQ9dGhpcztcbiAgICB2YXIgZmluYWw9YTtcblxuICAgICQucG9zdChVcmwgKyAnL2RlY2xpbmUnLHtwZXJzb25Ub0RlY2xpbmU6ZmluYWwsIG1vdmllOiBtb3ZpZX0sZnVuY3Rpb24oYSxiKSB7XG4gICAgICBjb25zb2xlLmxvZyhhLGIpXG4gICAgICBjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgc3RhdGUgYWZ0ZXIgZGVjbGluaW5nIGZyaWVuZCwgJywgdGhhdC5zdGF0ZSk7XG4gICAgICB0aGF0Lmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKTtcbiAgICB9KVxuICB9XG5cbiAgZmluZE1vdmllQnVkZGllcygpIHtcbiAgICB2YXIgdGhhdD10aGlzO1xuICAgICQucG9zdChVcmwgKyAnL2ZpbmRNb3ZpZUJ1ZGRpZXMnLHtkdW1teTonaW5mbyd9LGZ1bmN0aW9uKGEsYikge1xuICAgICAgdmFyIGZpbmFsPWEuc29ydChmdW5jdGlvbihhLGIpe3JldHVybiBiWzFdLWFbMV19KVxuICAgICAgdmFyIG15RnJpZW5kcz10aGF0LnN0YXRlLm15RnJpZW5kc1xuICAgICAgIHZhciByZWFsRmluYWw9W11cbiAgICAgICAgZm9yICh2YXIgaT0wO2k8ZmluYWwubGVuZ3RoO2krKyl7XG4gICAgICAgICAgdmFyIHVuaXF1ZT10cnVlXG4gICAgICAgICAgZm9yICh2YXIgeD0wO3g8bXlGcmllbmRzLmxlbmd0aDt4Kyspe1xuICAgICAgICAgICAgaWYgKGZpbmFsW2ldWzBdPT09bXlGcmllbmRzW3hdWzBdKXtcbiAgICAgICAgICAgICAgdW5pcXVlPWZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodW5pcXVlKXtcbiAgICAgICAgICAgIHJlYWxGaW5hbC5wdXNoKGZpbmFsW2ldKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cblxuICAgICAgdGhhdC5zZXRTdGF0ZSh7XG4gICAgICAgIHZpZXc6XCJGTk1CXCIsXG4gICAgICAgIHBvdGVudGlhbE1vdmllQnVkZGllczpyZWFsRmluYWxcbiAgICAgIH0pXG4gICAgICBjb25zb2xlLmxvZyh0aGF0LnN0YXRlLm15RnJpZW5kcyx0aGF0LnN0YXRlLnBvdGVudGlhbE1vdmllQnVkZGllcyk7XG5cbiAgICB9KVxuICB9XG5cbiAgY2hhbmdlVmlldygpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHZpZXc6XCJTaWduVXBcIiBcbiAgICB9KVxuICB9XG5cbiAgc2V0Q3VycmVudFVzZXIodXNlcm5hbWUpIHtcbiAgICBjb25zb2xlLmxvZygnY2FsbGluZyBzZXRDdXJyZW50VXNlcicpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY3VycmVudFVzZXI6IHVzZXJuYW1lXG4gICAgfSlcbiAgfVxuXG4gIGVudGVyTmV3VXNlcihuYW1lLHBhc3N3b3JkKSB7XG4gICAgY29uc29sZS5sb2cobmFtZSxwYXNzd29yZCk7XG4gICAgJC5wb3N0KFVybCArICcvc2lnbnVwJyx7bmFtZTpuYW1lLHBhc3N3b3JkOnBhc3N3b3JkfSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdzdWNjZXNzJyk7IFxuICAgICAgdGhpcy5zZXRTdGF0ZSh7dXNlcm5hbWU6IG5hbWUsIHZpZXc6IFwiSG9tZVwifSlcbiAgICB9KS5jYXRjaChmdW5jdGlvbigpIHtjb25zb2xlLmxvZygnZXJyb3InKX0pXG4gIH1cblxuICBnZXRGcmllbmRNb3ZpZVJhdGluZ3MoKSB7XG4gICAgdmFyIHRoYXQ9dGhpcztcbiAgICBjb25zb2xlLmxvZygnbW9vb29vdmllJyk7XG4gICAgdmFyIG1vdmllTmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibW92aWVUb1ZpZXdcIikudmFsdWVcbiAgICAkLnBvc3QoVXJsICsgJy9nZXRGcmllbmRSYXRpbmdzJywgeyBuYW1lOiBtb3ZpZU5hbWUgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuXG4gICAgICB0aGF0LnNldFN0YXRlKHtcbiAgICAgIHZpZXc6XCJIb21lXCIsXG4gICAgICBmcmllbmRzUmF0aW5nczpyZXNwb25zZVxuICAgIH0pXG4gICAgY29uc29sZS5sb2coJ291ciByZXNwb25zZScsdGhhdC5zdGF0ZS5mcmllbmRzUmF0aW5ncylcblxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycikge2NvbnNvbGUubG9nKGVycil9KTtcbiAgfVxuXG4gIGxvZ291dCgpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgJC5wb3N0KFVybCArICcvbG9nb3V0JykudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgdGhhdC5zZXRTdGF0ZSh7XG4gICAgICAgIHZpZXc6XCJMb2dpblwiLFxuICAgICAgICBmcmllbmRzUmF0aW5nczpbXVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzZW5kV2F0Y2hSZXF1ZXN0KGZyaWVuZCkge1xuICAgIHZhciBtb3ZpZT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vdmllVG9XYXRjaCcpLnZhbHVlO1xuICAgIHZhciB0b1NlbmQ9e3JlcXVlc3RlZTpmcmllbmQsIG1vdmllOm1vdmllfTtcbiAgICBpZiAobW92aWUubGVuZ3RoPjApIHtcbiAgICAgICQucG9zdChVcmwgKyAnL3NlbmRXYXRjaFJlcXVlc3QnLCB0b1NlbmQgLGZ1bmN0aW9uKGEsYikge1xuICAgICAgICBjb25zb2xlLmxvZyhhLGIpO1xuICAgICAgfSk7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW92aWVUb1dhdGNoJykudmFsdWU9Jyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd5b3UgbmVlZCB0byBlbnRlciBhIG1vdmllIHRvIHNlbmQgYSB3YXRjaCByZXF1ZXN0ISEhIScpXG4gICAgfVxuICB9XG5cblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgLy8vLy9tb3ZpZSByZW5kZXJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIC8vY2FsbCBzZWFyY2htb3ZpZSBmdW5jdGlvblxuICAvL3doaWNoIGdldHMgcGFzc2VkIGRvd24gdG8gdGhlIE1vdmllIFNlYXJjaCBcbiAgZ2V0TW92aWUocXVlcnkpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIHF1ZXJ5OiBxdWVyeVxuICAgIH07XG4gICAgXG4gICAgdGhpcy5wcm9wcy5zZWFyY2hNb3ZpZShvcHRpb25zLCAobW92aWUpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKG1vdmllKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICB2aWV3OlwiTW92aWVTZWFyY2hWaWV3XCIsXG4gICAgICAgIG1vdmllOiBtb3ZpZVxuICAgICAgfSlcbiAgICB9KVxuICB9XG4gIC8vc2hvdyB0aGUgbW92aWUgc2VhcmNoZWQgaW4gZnJpZW5kIG1vdmllIGxpc3RcbiAgLy9vbnRvIHRoZSBzdGF0ZXZpZXcgb2YgbW92aWVzZWFyY2h2aWV3XG4gIHNob3dNb3ZpZShtb3ZpZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbW92aWU6IG1vdmllXG4gICAgfSlcbiAgfVxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgLy8vLy9OYXYgY2hhbmdlXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICBjaGFuZ2VWaWV3cyh0YXJnZXRTdGF0ZSkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xuICAgIHZhciB0aGF0PXRoaXM7XG5cbiAgICBpZiAodGFyZ2V0U3RhdGU9PT0nRnJpZW5kcycpe1xuICAgICAgY29uc29sZS5sb2coJ3lvdSBzd2l0Y2hlZCB0byBmcmllbmRzISEnKVxuICAgICAgdGhpcy5nZXRDdXJyZW50RnJpZW5kcygpXG4gICAgICB0aGlzLnNlbmRSZXF1ZXN0KCk7XG5cbiAgICAgIFxuICAgIH1cblxuICAgXG4gICAgaWYgKHRhcmdldFN0YXRlPT09J0hvbWUnKXtcbiAgICAgIHRoaXMuZ2V0Q3VycmVudEZyaWVuZHMoKVxuICAgICAgdGhpcy5zZW5kUmVxdWVzdCgpO1xuICAgICAgXG4gICAgfVxuXG5cblxuICAgICBpZiAodGFyZ2V0U3RhdGU9PT1cIkluYm94XCIpe1xuICAgICAgIHRoaXMubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpXG4gICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdmlldzogdGFyZ2V0U3RhdGVcbiAgICB9KTtcbiAgfVxuXG4gIGNoYW5nZVZpZXdzTW92aWUodGFyZ2V0U3RhdGUsIG1vdmllKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB2aWV3OiB0YXJnZXRTdGF0ZSxcbiAgICAgIG1vdmllOiBtb3ZpZVxuICAgIH0pO1xuICB9XG5cbiAgY2hhbmdlVmlld3NGcmllbmRzKHRhcmdldFN0YXRlLCBmcmllbmQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHZpZXc6IHRhcmdldFN0YXRlLFxuICAgICAgZnJpZW5kVG9Gb2N1c09uOiBmcmllbmRcbiAgICB9KTtcbiAgfVxuXG5cbiAgYnVkZHlSZXF1ZXN0KGEpIHtcbiAgICB0aGlzLnNlbmRSZXF1ZXN0KGEpO1xuICB9XG5cblxuICBzZW5kUmVxdWVzdChhKSB7XG5jb25zb2xlLmxvZygnc2VuZCByZXF1ZXN0IGlzIGJlaW5nIHJ1biEhJylcbiAgICB2YXIgdGhhdD10aGlzO1xuICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZEZyaWVuZEJ5TmFtZScpIT09bnVsbCl7XG4gICAgICB2YXIgcGVyc29uPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kRnJpZW5kQnlOYW1lJykudmFsdWVcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHBlcnNvbiA9IGEgfHwgJ3Rlc3QnO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZygncGVyc29uOicscGVyc29uKVxuICAgIGNvbnNvbGUubG9nKCdzdGF0ZScsIHRoaXMuc3RhdGUpO1xuICAgIGNvbnNvbGUubG9nKCdsaW5lIDI0OCcsdGhpcy5zdGF0ZS5teUZyaWVuZHMpXG4gICAgdmFyIGZyaWVuZHMxPVtdO1xuICAgIHZhciBmcmllbmRzMj1bXVxuICAgIGZvciAodmFyIGk9MDtpPHRoaXMuc3RhdGUubXlGcmllbmRzLmxlbmd0aDtpKyspe1xuICAgICAgY29uc29sZS5sb2coJ2xpbmUgMjUxJyx0aGlzLnN0YXRlLm15RnJpZW5kc1tpXSlcbiAgICAgIGZyaWVuZHMxLnB1c2godGhpcy5zdGF0ZS5teUZyaWVuZHNbaV1bMF0pO1xuICAgICAgZnJpZW5kczIucHVzaCh0aGlzLnN0YXRlLm15RnJpZW5kc1tpXVswXSlcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpPTA7aTx0aGlzLnN0YXRlLnJlcXVlc3RzT2ZDdXJyZW50VXNlci5sZW5ndGg7aSsrKXtcbiAgICAgIGZyaWVuZHMxLnB1c2godGhpcy5zdGF0ZS5yZXF1ZXN0c09mQ3VycmVudFVzZXJbaV0pXG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGFsc28gYmUgbXkgZnJpZW5kcycsdGhpcy5zdGF0ZS5teUZyaWVuZHMsZnJpZW5kczEsZnJpZW5kczIpXG5cblxuICAgIHZhciBwcGxZb3VDYW50U2VuZFRvPWZyaWVuZHMxO1xuICAgIGNvbnNvbGUubG9nKCd0b2YnLGZyaWVuZHMxLmluZGV4T2YocGVyc29uKSE9PSAtMSwgZnJpZW5kczEubGVuZ3RoIT09MClcbiAgICBpZiAoZnJpZW5kczEuaW5kZXhPZihwZXJzb24pIT09IC0xICYmIGZyaWVuZHMxLmxlbmd0aCE9PTApe1xuICAgICAgJChcIiNBbHJlYWR5UmVxXCIpLmZhZGVJbigxMDAwKTtcbiAgICAgICQoXCIjQWxyZWFkeVJlcVwiKS5mYWRlT3V0KDEwMDApO1xuICAgICAgY29uc29sZS5sb2coJ3RoaXMgcGVyc29uIGlzIGFscmVhZHkgaW4gdGhlcmUhIScpXG4gICAgfSBlbHNlIGlmIChwZXJzb24ubGVuZ3RoPT09MCkge1xuICAgICAgJChcIiNlbnRlclJlYWxGcmllbmRcIikuZmFkZUluKDEwMDApO1xuICAgICAgJChcIiNlbnRlclJlYWxGcmllbmRcIikuZmFkZU91dCgxMDAwKTtcbiAgICB9IGVsc2Uge1xuXG5cbiAgICAgICQucG9zdChVcmwgKyAnL3NlbmRSZXF1ZXN0Jyx7bmFtZTpwZXJzb259LGZ1bmN0aW9uKGEsYikge1xuICAgICAgIFxuICAgICAgICAgIHRoYXQuc2V0U3RhdGUoe1xuICAgICAgICAgICAgcmVxdWVzdHNPZkN1cnJlbnRVc2VyOmEuY29uY2F0KFtwZXJzb25dKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgY29uc29sZS5sb2coJ2xpbmUgMjgxJyx0aGF0LnN0YXRlLnJlcXVlc3RzT2ZDdXJyZW50VXNlcik7XG5cbiAgICAgICAgJChcIiNyZXFTZW50XCIpLmZhZGVJbigxMDAwKTtcbiAgICAgICAgJChcIiNyZXFTZW50XCIpLmZhZGVPdXQoMTAwMCk7XG4gICAgICB9KTtcbiAgICAgIGlmICggZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRGcmllbmRCeU5hbWUnKSE9PW51bGwpe1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZEZyaWVuZEJ5TmFtZScpLnZhbHVlID0gJyc7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpIHtcbiAgICB2YXIgdGhhdD10aGlzO1xuICAgIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBsaXN0IGZyaWVuZCByZXFzJylcbiAgICAkLnBvc3QoVXJsICsgJy9saXN0UmVxdWVzdHMnLGZ1bmN0aW9uKHJlc3BvbnNlLGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZygnUmVzcG9uc2UgSSBnZXQhISEhISEhJyxyZXNwb25zZSk7XG4gICAgICB2YXIgdG9wPVtdXG4gICAgICB2YXIgYm90dG9tPVtdXG4gICAgICBjb25zb2xlLmxvZygndHInLCByZXNwb25zZSlcbiAgICAgIGZvciAodmFyIGk9MDtpPHJlc3BvbnNlWzBdLmxlbmd0aDtpKyspe1xuICAgICAgICBpZiAocmVzcG9uc2VbMF1baV1bJ3JlcXVlc3RvciddIT09cmVzcG9uc2VbMV0gJiYgcmVzcG9uc2VbMF1baV1bJ3Jlc3BvbnNlJ109PT1udWxsICl7XG4gICAgICAgICAgdG9wLnB1c2gocmVzcG9uc2VbMF1baV0pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXNwb25zZVswXVtpXVsncmVxdWVzdG9yJ109PT1yZXNwb25zZVsxXSAmJnJlc3BvbnNlWzBdW2ldWydyZXNwb25zZSddIT09bnVsbCAmJiByZXNwb25zZVswXVtpXVsncmVxdWVzdGVlJ10hPT0ndGVzdCcpe1xuICAgICAgICAgIGJvdHRvbS5wdXNoKHJlc3BvbnNlWzBdW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGF0LnNldFN0YXRlKHtcbiAgICAgICAgcGVuZGluZ0ZyaWVuZFJlcXVlc3RzOnRvcCxcbiAgICAgICAgcmVxdWVzdFJlc3BvbnNlczpib3R0b21cbiAgICAgIH0pXG4gICAgfSk7XG4gIH07XG5cbiAgZm9jdXNPbkZyaWVuZChmcmllbmQpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgJCgnLmZyaWVuZEVudHJ5SW5kaXZpZHVhbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdmFyIGZyaWVuZE5hbWUgPSAkKHRoaXMpLmh0bWwoKTtcblxuICAgICAgdGhhdC5zZXRTdGF0ZSh7XG4gICAgICAgIHZpZXc6J3NpbmdsZUZyaWVuZCcsXG4gICAgICAgIGZyaWVuZFRvRm9jdXNPbjogZnJpZW5kXG4gICAgICB9KTtcblxuICAgICAgJC5nZXQoVXJsICsgJy9nZXRGcmllbmRVc2VyUmF0aW5ncycse2ZyaWVuZE5hbWU6IGZyaWVuZH0sZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgY29uc29sZS5sb2coZnJpZW5kKVxuICAgICAgICBjb25zb2xlLmxvZygnZ2V0dGluZyBmcmllbmQgbW92aWVzOicsIHJlc3BvbnNlKTtcbiAgICAgICAgdGhhdC5zZXRTdGF0ZSh7XG4gICAgICAgICAgaW5kaXZpZHVhbEZyaWVuZHNNb3ZpZXM6IHJlc3BvbnNlXG4gICAgICAgIH0pO1xuXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gIGxpc3RQb3RlbnRpYWxzKCkge1xuICAgIGNvbnNvbGUubG9nKCd0aGlzIHNob3VsZCBsaXN0IHBvdGVudGlhbCBmcmllbmRzJylcbiAgfVxuXG4gIHJlbW92ZVJlcXVlc3QocGVyc29uLCBzZWxmLCBtb3ZpZSkge1xuICAgIHZhciB0aGF0PSB0aGlzO1xuICAgICQuYWpheCh7XG4gICAgICB1cmw6IFVybCArICcvcmVtb3ZlUmVxdWVzdCcsXG4gICAgICB0eXBlOiAnREVMRVRFJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgcmVxdWVzdG9yOiBzZWxmLFxuICAgICAgICByZXF1ZXN0ZWU6IHBlcnNvbixcbiAgICAgICAgbW92aWU6IG1vdmllXG4gICAgICB9LFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1JFUVVFU1QgUkVNT1ZFRCEgTW92aWUgaXM6ICcsIG1vdmllKTtcbiAgICAgICAgdGhhdC5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCk7XG4gICAgICB9LFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS52aWV3PT09J0xvZ2luJykge1xuICAgICAgcmV0dXJuICg8TG9nSW4gY2hhbmdlVmlld3M9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX0gc2V0Q3VycmVudFVzZXI9e3RoaXMuc2V0Q3VycmVudFVzZXIuYmluZCh0aGlzKX0vPik7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXc9PT1cIlNpZ25VcFwiKSB7XG4gICAgICByZXR1cm4gKDxTaWduVXAgY2hhbmdlVmlld3M9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX0gc2V0Q3VycmVudFVzZXI9e3RoaXMuc2V0Q3VycmVudFVzZXIuYmluZCh0aGlzKX0gLz4pO1xuICAgIH0gXG4gICAgLy90aGlzIHZpZXcgaXMgYWRkZWQgZm9yIG1vdmllc2VhcmNoIHJlbmRlcmluZ1xuICAgIGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJNb3ZpZVNlYXJjaFZpZXdcIikge1xuICAgICAgcmV0dXJuICggXG4gICAgICAgIDxkaXY+IFxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XG4gICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX0gXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgPE1vdmllUmF0aW5nIFxuICAgICAgICAgICAgaGFuZGxlU2VhcmNoTW92aWU9e3RoaXMuZ2V0TW92aWUuYmluZCh0aGlzKX0gXG4gICAgICAgICAgICBtb3ZpZT17dGhpcy5zdGF0ZS5tb3ZpZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJJbmJveFwiICkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICBIb21lPXt0cnVlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxJbmJveCBcbiAgICAgICAgICAgICAgcmVxdWVzdHM9e3RoaXMuc3RhdGUucGVuZGluZ0ZyaWVuZFJlcXVlc3RzfVxuICAgICAgICAgICAgICByZXNwb25zZXNBbnN3ZXJlZD17dGhpcy5zdGF0ZS5yZXF1ZXN0UmVzcG9uc2VzfVxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9ICBcbiAgICAgICAgICAgICAgYWNjZXB0PSB7dGhpcy5hY2NlcHRGcmllbmQuYmluZCh0aGlzKX0gXG4gICAgICAgICAgICAgIGRlY2xpbmU9e3RoaXMuZGVjbGluZUZyaWVuZC5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgICAgbGlzdFJlcXVlc3RzPXt0aGlzLmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMuYmluZCh0aGlzKX0gXG4gICAgICAgICAgICAgIHBwbFdob1dhbnRUb0JlRnJpZW5kcz17dGhpcy5zdGF0ZS5wZW5kaW5nRnJpZW5kUmVxdWVzdHMubWFwKFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGEpe3JldHVybiBbYS5yZXF1ZXN0b3IsYS5yZXF1ZXN0VHlwLGEubW92aWU9PT1udWxsP1wiXCI6IGEubW92aWUsXCJNZXNzYWdlOlwiKyBhLm1lc3NhZ2U9PT0nbnVsbCc/XCJub25lXCI6YS5tZXNzYWdlXX0pfSBcbiAgICAgICAgICAgICAgcmVtb3ZlPXt0aGlzLnJlbW92ZVJlcXVlc3QuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJGcmllbmRzXCIgKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxuICAgICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9Lz5cbiAgICAgICAgICA8RnJpZW5kcyBcbiAgICAgICAgICAgIHNlbmRXYXRjaFJlcXVlc3Q9e3RoaXMuc2VuZFdhdGNoUmVxdWVzdC5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgIGZvZj0ge3RoaXMuZm9jdXNPbkZyaWVuZC5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgIGdldEZyaWVuZHM9e3RoaXMuZ2V0Q3VycmVudEZyaWVuZHMuYmluZCh0aGlzKX0gXG4gICAgICAgICAgICBteUZyaWVuZHM9e3RoaXMuc3RhdGUubXlGcmllbmRzfSBcbiAgICAgICAgICAgIGxpc3RQb3RlbnRpYWxzPXt0aGlzLmxpc3RQb3RlbnRpYWxzLmJpbmQodGhpcyl9IFxuICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfSAgXG4gICAgICAgICAgICBzZW5kUmVxdWVzdD17dGhpcy5zZW5kUmVxdWVzdC5iaW5kKHRoaXMpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkhvbWVcIikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyl9IFxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPEhvbWUgXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NNb3ZpZS5iaW5kKHRoaXMpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJTaW5nbGVNb3ZpZVwiKSB7XG4gICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IG9uQ2xpY2s9eygpPT5jb25zb2xlLmxvZyh0aGF0LnN0YXRlKX0+XG4gICAgICAgICAgICA8TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8U2luZ2xlTW92aWVSYXRpbmcgXG4gICAgICAgICAgICBjb21wYXRpYmlsaXR5PXt0aGlzLnN0YXRlLm15RnJpZW5kc31cbiAgICAgICAgICAgIGN1cnJlbnRNb3ZpZT17dGhpcy5zdGF0ZS5tb3ZpZX1cbiAgICAgICAgICAgIGNoYW5nZT17dGhpcy5jaGFuZ2VWaWV3c0ZyaWVuZHMuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIGZvZj17dGhpcy5mb2N1c09uRnJpZW5kLmJpbmQodGhpcyl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3PT09J3NpbmdsZUZyaWVuZCcpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XG4gICAgICAgICAgICAgIGZpbmQ9e3RoaXMuZmluZE1vdmllQnVkZGllcy5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDxTaW5nbGVGcmllbmQgXG4gICAgICAgICAgICBtb3ZpZXNPZkZyaWVuZD17dGhpcy5zdGF0ZS5pbmRpdmlkdWFsRnJpZW5kc01vdmllc30gXG4gICAgICAgICAgICBmcmllbmROYW1lPXt0aGlzLnN0YXRlLmZyaWVuZFRvRm9jdXNPbn0gXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NNb3ZpZS5iaW5kKHRoaXMpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJGTk1CXCIpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XG4gICAgICAgICAgICAgIGZpbmQ9e3RoaXMuZmluZE1vdmllQnVkZGllcy5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDxGaW5kTW92aWVCdWRkeSBcbiAgICAgICAgICAgIGJ1ZGR5ZnVuYz17dGhpcy5idWRkeVJlcXVlc3QuYmluZCh0aGlzKX0gXG4gICAgICAgICAgICBidWRkaWVzPXt0aGlzLnN0YXRlLnBvdGVudGlhbE1vdmllQnVkZGllc30gXG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIk15UmF0aW5nc1wiKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxuICAgICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKX0gXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8TXlSYXRpbmdzIFxuICAgICAgICAgICAgY2hhbmdlPXt0aGlzLmNoYW5nZVZpZXdzTW92aWUuYmluZCh0aGlzKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICB9XG59XG5cbndpbmRvdy5BcHAgPSBBcHA7XG4vLyB2YXIgVXJsID0gJ2h0dHBzOi8vdGhhd2luZy1pc2xhbmQtOTk3NDcuaGVyb2t1YXBwLmNvbSc7XG52YXIgVXJsID0gJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMCc7XG53aW5kb3cuVXJsID0gVXJsO1xuIl19
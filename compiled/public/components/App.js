'use strict';

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
      $('button').on('click', function () {
        console.log($(this).html());
      });
      console.log(final + 'should be accepted, for movie....', movie);

      $.post(Url + '/accept', { personToAccept: final, movie: movie }, function (a, b) {
        console.log(a, b);
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
        this.setState({ username: name });
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
      var friends1 = [];
      console.log('this should also be my friends', this.state.myFriends);
      for (var i = 0; i < this.state.myFriends; i++) {
        friends1.push(this.state.myFriends[i][0]);
      }

      for (var i = 0; i < this.state.requestsOfCurrentUser.length; i++) {
        friends1.push(this.state.requestsOfCurrentUser[i]);
      }

      var pplYouCantSendTo = friends1;
      console.log('ppl you cant send to', friends1, person);
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
            requestsOfCurrentUser: a
          });

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
          if (response[0][i]['requestor'] === response[1] && response[0][i]['response'] !== null) {
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
    value: function focusOnFriend() {
      var that = this;
      $('.individual').on('click', function (event) {
        event.preventDefault();
        var friendName = $(this).html();

        that.setState({
          view: 'singleFriend',
          friendToFocusOn: friendName
        });

        $.get(Url + '/getFriendUserRatings', { friendName: friendName }, function (response) {
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
      if (this.state.view === 'Login') {
        return React.createElement(LogIn, { changeViews: this.changeViews.bind(this), setCurrentUser: this.setCurrentUser.bind(this) });
      } else if (this.state.view === "SignUp") {
        return React.createElement(SignUp, { onClick: this.changeViews.bind(this), setCurrentUser: this.setCurrentUser.bind(this) });
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
          return React.createElement(
            'div',
            null,
            React.createElement(Nav, { name: this.state.currentUser,
              onClick: this.changeViews.bind(this),
              logout: this.logout.bind(this)
            }),
            React.createElement(SingleMovieRating, {
              currentMovie: this.state.movie,
              change: this.changeViewsFriends.bind(this),
              fof: this.focusOnFriend.bind(this)
            })
          );
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sRzs7O0FBQ0osZUFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsdUZBQ1gsS0FEVzs7QUFHakIsVUFBSyxLQUFMLEdBQWE7QUFDWCxZQUFLLE9BRE07QUFFWCxzQkFBZSxFQUZKO0FBR1gsYUFBTyxJQUhJO0FBSVgsc0JBQWUsRUFKSjtBQUtYLDZCQUFzQixFQUxYO0FBTVgsaUJBQVUsRUFOQztBQU9YLHVCQUFnQixFQVBMO0FBUVgsK0JBQXdCLEVBUmI7QUFTWCw2QkFBc0IsRUFUWDtBQVVYLGdCQUFVLElBVkM7QUFXWCx3QkFBaUIsRUFYTjtBQVlYLG1CQUFZLElBWkQ7QUFhWCw2QkFBc0I7QUFiWCxLQUFiO0FBSGlCO0FBa0JsQjs7Ozt3Q0FFbUI7QUFDbEIsVUFBSSxPQUFLLElBQVQ7QUFDQSxjQUFRLEdBQVIsQ0FBWSxXQUFaO0FBQ0EsUUFBRSxJQUFGLENBQU8sTUFBTSxhQUFiLEVBQTJCLEVBQUMsTUFBSyxNQUFOLEVBQTNCLEVBQXlDLFVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYztBQUNyRCxnQkFBUSxHQUFSLENBQVksK0NBQVosRUFBNEQsQ0FBNUQsRUFBOEQsQ0FBOUQ7QUFDTyxhQUFLLElBQUksSUFBRSxDQUFYLEVBQWEsSUFBRSxFQUFFLE1BQWpCLEVBQXdCLEdBQXhCLEVBQTRCO0FBQ3pCLGNBQUksRUFBRSxDQUFGLEVBQUssQ0FBTCxNQUFVLElBQWQsRUFBbUI7QUFDakIsY0FBRSxDQUFGLEVBQUssQ0FBTCxJQUFVLDBCQUFWO0FBQ0Q7QUFDRjs7QUFFUixZQUFJLFFBQU8sRUFBRSxJQUFGLENBQU8sVUFBUyxDQUFULEVBQVcsQ0FBWCxFQUFhO0FBQUMsaUJBQU8sRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQVo7QUFBaUIsU0FBdEMsQ0FBWDtBQUNELGFBQUssUUFBTCxDQUFjO0FBQ1oscUJBQVU7QUFE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TCxDQUFXLElBQVgsS0FBb0IsV0FBeEIsRUFBcUM7QUFDMUMsaUJBQ0U7QUFBQTtBQUFBO0FBQ0ksZ0NBQUMsR0FBRCxJQUFLLE1BQU0sS0FBSyxLQUFMLENBQVcsV0FBdEI7QUFDRSxvQkFBTSxLQUFLLGdCQUFMLENBQXNCLElBQXRCLENBQTJCLElBQTNCLENBRFI7QUFFRSx1QkFBUyxLQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsSUFBdEIsQ0FGWDtBQUdFLHNCQUFRLEtBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsSUFBakI7QUFIVixjQURKO0FBTUUsZ0NBQUMsU0FBRDtBQUNFLHNCQUFRLEtBQUssZ0JBQUwsQ0FBc0IsSUFBdEIsQ0FBMkIsSUFBM0I7QUFEVjtBQU5GLFdBREY7QUFZRDtBQUNGOzs7O0VBM2VlLE1BQU0sUzs7QUE4ZXhCLE9BQU8sR0FBUCxHQUFhLEdBQWI7QUFDQSxJQUFJLE1BQU0sNENBQVY7QUFDQTtBQUNBLE9BQU8sR0FBUCxHQUFhLEdBQWIiLCJmaWxlIjoiQXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgdmlldzonTG9naW4nLFxuICAgICAgZnJpZW5kc1JhdGluZ3M6W10sXG4gICAgICBtb3ZpZTogbnVsbCxcbiAgICAgIGZyaWVuZFJlcXVlc3RzOltdLFxuICAgICAgcGVuZGluZ0ZyaWVuZFJlcXVlc3RzOltdLFxuICAgICAgbXlGcmllbmRzOltdLFxuICAgICAgZnJpZW5kVG9Gb2N1c09uOicnLFxuICAgICAgaW5kaXZpZHVhbEZyaWVuZHNNb3ZpZXM6W10sXG4gICAgICBwb3RlbnRpYWxNb3ZpZUJ1ZGRpZXM6e30sXG4gICAgICB1c2VybmFtZTogbnVsbCxcbiAgICAgIHJlcXVlc3RSZXNwb25zZXM6W10sXG4gICAgICBjdXJyZW50VXNlcjpudWxsLFxuICAgICAgcmVxdWVzdHNPZkN1cnJlbnRVc2VyOltdXG4gICAgfTtcbiAgfVxuXG4gIGdldEN1cnJlbnRGcmllbmRzKCkge1xuICAgIHZhciB0aGF0PXRoaXM7XG4gICAgY29uc29sZS5sb2coJ3Rlc3RpbmdnZycpXG4gICAgJC5wb3N0KFVybCArICcvZ2V0RnJpZW5kcycse3Rlc3Q6J2luZm8nfSxmdW5jdGlvbihhLGIpIHtcbiAgICAgIGNvbnNvbGUubG9nKCd3aGF0IHlvdSBnZXQgYmFjayBmcm9tIHNlcnZlciBmb3IgZ2V0IGZyaWVuZHMnLGEsYik7XG4gICAgICAgICAgICAgZm9yICh2YXIgaT0wO2k8YS5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgICAgICBpZiAoYVtpXVsxXT09PW51bGwpe1xuICAgICAgICAgICAgICAgICAgYVtpXVsxXSA9IFwiTm8gY29tcGFyaXNvbiB0byBiZSBtYWRlXCI7XG4gICAgICAgICAgICAgICAgfSAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIH1cblxuICAgICAgIHZhciBmaW5hbD0gYS5zb3J0KGZ1bmN0aW9uKGEsYil7cmV0dXJuIGJbMV0tYVsxXX0pO1xuICAgICAgdGhhdC5zZXRTdGF0ZSh7XG4gICAgICAgIG15RnJpZW5kczpmaW5hbFxuICAgICAgfSlcbiAgICAgIGNvbnNvbGUubG9nKCd0aGVzIGFyZSBteSBmcmllbmRzISEhISEhISEhISEhISEhISEnLHRoYXQuc3RhdGUubXlGcmllbmRzKVxuICAgIH0pXG4gIH1cblxuICBhY2NlcHRGcmllbmQoYSwgbW92aWUpIHtcbiAgICB2YXIgdGhhdD10aGlzO1xuICAgIHZhciBmaW5hbD1hO1xuICAgICQoJ2J1dHRvbicpLm9uKCdjbGljaycsZnVuY3Rpb24oKSB7XG4gICAgICBjb25zb2xlLmxvZygkKHRoaXMpLmh0bWwoKSk7XG4gICAgfSlcbiAgICBjb25zb2xlLmxvZyhmaW5hbCArJ3Nob3VsZCBiZSBhY2NlcHRlZCwgZm9yIG1vdmllLi4uLicsIG1vdmllKVxuXG5cbiAgICAkLnBvc3QoVXJsICsgJy9hY2NlcHQnLHtwZXJzb25Ub0FjY2VwdDpmaW5hbCwgbW92aWU6IG1vdmllfSxmdW5jdGlvbihhLGIpIHtcbiAgICAgIGNvbnNvbGUubG9nKGEsYilcbiAgICAgIHRoYXQubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpO1xuICAgIH0pXG4gICAgXG4gICAgY29uc29sZS5sb2coJ3JlZnJlc2hlZCBpbmJveCwgc2hvdWxkIGRlbGV0ZSBmcmllbmQgcmVxdWVzdCBvbiB0aGUgc3BvdCBpbnN0ZWFkIG9mIG1vdmluZycpXG4gIH1cblxuICBkZWNsaW5lRnJpZW5kKGEsIG1vdmllKSB7XG4gICAgdmFyIHRoYXQ9dGhpcztcbiAgICB2YXIgZmluYWw9YTtcblxuXG4gICAgJC5wb3N0KFVybCArICcvZGVjbGluZScse3BlcnNvblRvRGVjbGluZTpmaW5hbCwgbW92aWU6IG1vdmllfSxmdW5jdGlvbihhLGIpIHtcbiAgICAgIGNvbnNvbGUubG9nKGEsYilcbiAgICAgIGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBzdGF0ZSBhZnRlciBkZWNsaW5pbmcgZnJpZW5kLCAnLCB0aGF0LnN0YXRlKTtcbiAgICAgIHRoYXQubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpO1xuICAgIH0pXG4gIH1cblxuICBmaW5kTW92aWVCdWRkaWVzKCkge1xuICAgIHZhciB0aGF0PXRoaXM7XG4gICAgJC5wb3N0KFVybCArICcvZmluZE1vdmllQnVkZGllcycse2R1bW15OidpbmZvJ30sZnVuY3Rpb24oYSxiKSB7XG4gICAgICB2YXIgZmluYWw9YS5zb3J0KGZ1bmN0aW9uKGEsYil7cmV0dXJuIGJbMV0tYVsxXX0pXG4gICAgICB2YXIgbXlGcmllbmRzPXRoYXQuc3RhdGUubXlGcmllbmRzXG4gICAgICAgdmFyIHJlYWxGaW5hbD1bXVxuICAgICAgICBmb3IgKHZhciBpPTA7aTxmaW5hbC5sZW5ndGg7aSsrKXtcbiAgICAgICAgICB2YXIgdW5pcXVlPXRydWVcbiAgICAgICAgICBmb3IgKHZhciB4PTA7eDxteUZyaWVuZHMubGVuZ3RoO3grKyl7XG4gICAgICAgICAgICBpZiAoZmluYWxbaV1bMF09PT1teUZyaWVuZHNbeF1bMF0pe1xuICAgICAgICAgICAgICB1bmlxdWU9ZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh1bmlxdWUpe1xuICAgICAgICAgICAgcmVhbEZpbmFsLnB1c2goZmluYWxbaV0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cblxuXG4gICAgICB0aGF0LnNldFN0YXRlKHtcbiAgICAgICAgdmlldzpcIkZOTUJcIixcbiAgICAgICAgcG90ZW50aWFsTW92aWVCdWRkaWVzOnJlYWxGaW5hbFxuICAgICAgfSlcbiAgICAgIGNvbnNvbGUubG9nKHRoYXQuc3RhdGUubXlGcmllbmRzLHRoYXQuc3RhdGUucG90ZW50aWFsTW92aWVCdWRkaWVzKTtcblxuICAgIH0pXG4gIH1cblxuICBjaGFuZ2VWaWV3KCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdmlldzpcIlNpZ25VcFwiIFxuICAgIH0pXG4gIH1cblxuICBzZXRDdXJyZW50VXNlcih1c2VybmFtZSkge1xuICAgIGNvbnNvbGUubG9nKCdjYWxsaW5nIHNldEN1cnJlbnRVc2VyJyk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBjdXJyZW50VXNlcjogdXNlcm5hbWVcbiAgICB9KVxuICB9XG5cbiAgZW50ZXJOZXdVc2VyKG5hbWUscGFzc3dvcmQpIHtcbiAgICBjb25zb2xlLmxvZyhuYW1lLHBhc3N3b3JkKTtcbiAgICAkLnBvc3QoVXJsICsgJy9zaWdudXAnLHtuYW1lOm5hbWUscGFzc3dvcmQ6cGFzc3dvcmR9KS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgY29uc29sZS5sb2coJ3N1Y2Nlc3MnKTsgXG4gICAgICB0aGlzLnNldFN0YXRlKHt1c2VybmFtZTogbmFtZX0pXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24oKSB7Y29uc29sZS5sb2coJ2Vycm9yJyl9KVxuICB9XG5cbiAgZ2V0RnJpZW5kTW92aWVSYXRpbmdzKCkge1xuICAgIHZhciB0aGF0PXRoaXM7XG4gICAgY29uc29sZS5sb2coJ21vb29vb3ZpZScpO1xuICAgIHZhciBtb3ZpZU5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1vdmllVG9WaWV3XCIpLnZhbHVlXG4gICAgJC5wb3N0KFVybCArICcvZ2V0RnJpZW5kUmF0aW5ncycsIHsgbmFtZTogbW92aWVOYW1lIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcblxuICAgICAgdGhhdC5zZXRTdGF0ZSh7XG4gICAgICB2aWV3OlwiSG9tZVwiLFxuICAgICAgZnJpZW5kc1JhdGluZ3M6cmVzcG9uc2VcbiAgICB9KVxuICAgIGNvbnNvbGUubG9nKCdvdXIgcmVzcG9uc2UnLHRoYXQuc3RhdGUuZnJpZW5kc1JhdGluZ3MpXG5cbiAgICB9KS5jYXRjaChmdW5jdGlvbihlcnIpIHtjb25zb2xlLmxvZyhlcnIpfSk7XG4gIH1cblxuICBsb2dvdXQoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICQucG9zdChVcmwgKyAnL2xvZ291dCcpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgIHRoYXQuc2V0U3RhdGUoe1xuICAgICAgICB2aWV3OlwiTG9naW5cIixcbiAgICAgICAgZnJpZW5kc1JhdGluZ3M6W11cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgc2VuZFdhdGNoUmVxdWVzdChmcmllbmQpIHtcbiAgICB2YXIgbW92aWU9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3ZpZVRvV2F0Y2gnKS52YWx1ZTtcbiAgICB2YXIgdG9TZW5kPXtyZXF1ZXN0ZWU6ZnJpZW5kLCBtb3ZpZTptb3ZpZX07XG4gICAgaWYgKG1vdmllLmxlbmd0aD4wKSB7XG4gICAgICAkLnBvc3QoVXJsICsgJy9zZW5kV2F0Y2hSZXF1ZXN0JywgdG9TZW5kICxmdW5jdGlvbihhLGIpIHtcbiAgICAgICAgY29uc29sZS5sb2coYSxiKTtcbiAgICAgIH0pO1xuICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vdmllVG9XYXRjaCcpLnZhbHVlPScnO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygneW91IG5lZWQgdG8gZW50ZXIgYSBtb3ZpZSB0byBzZW5kIGEgd2F0Y2ggcmVxdWVzdCEhISEnKVxuICAgIH1cbiAgfVxuXG5cbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIC8vLy8vbW92aWUgcmVuZGVyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAvL2NhbGwgc2VhcmNobW92aWUgZnVuY3Rpb25cbiAgLy93aGljaCBnZXRzIHBhc3NlZCBkb3duIHRvIHRoZSBNb3ZpZSBTZWFyY2ggXG4gIGdldE1vdmllKHF1ZXJ5KSB7XG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICBxdWVyeTogcXVlcnlcbiAgICB9O1xuICAgIFxuICAgIHRoaXMucHJvcHMuc2VhcmNoTW92aWUob3B0aW9ucywgKG1vdmllKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhtb3ZpZSk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgdmlldzpcIk1vdmllU2VhcmNoVmlld1wiLFxuICAgICAgICBtb3ZpZTogbW92aWVcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuICAvL3Nob3cgdGhlIG1vdmllIHNlYXJjaGVkIGluIGZyaWVuZCBtb3ZpZSBsaXN0XG4gIC8vb250byB0aGUgc3RhdGV2aWV3IG9mIG1vdmllc2VhcmNodmlld1xuICBzaG93TW92aWUobW92aWUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG1vdmllOiBtb3ZpZVxuICAgIH0pXG4gIH1cbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIC8vLy8vTmF2IGNoYW5nZVxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgY2hhbmdlVmlld3ModGFyZ2V0U3RhdGUpIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLnN0YXRlKTtcbiAgICB2YXIgdGhhdD10aGlzO1xuXG4gICAgaWYgKHRhcmdldFN0YXRlPT09J0ZyaWVuZHMnKXtcbiAgICAgIGNvbnNvbGUubG9nKCd5b3Ugc3dpdGNoZWQgdG8gZnJpZW5kcyEhJylcbiAgICAgIHRoaXMuZ2V0Q3VycmVudEZyaWVuZHMoKVxuICAgICAgdGhpcy5zZW5kUmVxdWVzdCgpO1xuXG4gICAgICBcbiAgICB9XG5cbiAgIFxuICAgIGlmICh0YXJnZXRTdGF0ZT09PSdIb21lJyl7XG4gICAgICB0aGlzLmdldEN1cnJlbnRGcmllbmRzKClcbiAgICAgIHRoaXMuc2VuZFJlcXVlc3QoKTtcbiAgICAgIFxuICAgIH1cblxuXG5cbiAgICAgaWYgKHRhcmdldFN0YXRlPT09XCJJbmJveFwiKXtcbiAgICAgICB0aGlzLmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKVxuICAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHZpZXc6IHRhcmdldFN0YXRlXG4gICAgfSk7XG4gIH1cblxuICBjaGFuZ2VWaWV3c01vdmllKHRhcmdldFN0YXRlLCBtb3ZpZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdmlldzogdGFyZ2V0U3RhdGUsXG4gICAgICBtb3ZpZTogbW92aWVcbiAgICB9KTtcbiAgfVxuXG4gIGNoYW5nZVZpZXdzRnJpZW5kcyh0YXJnZXRTdGF0ZSwgZnJpZW5kKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB2aWV3OiB0YXJnZXRTdGF0ZSxcbiAgICAgIGZyaWVuZFRvRm9jdXNPbjogZnJpZW5kXG4gICAgfSk7XG4gIH1cblxuXG4gIGJ1ZGR5UmVxdWVzdChhKSB7XG4gICAgdGhpcy5zZW5kUmVxdWVzdChhKTtcbiAgfVxuXG5cbiAgc2VuZFJlcXVlc3QoYSkge1xuY29uc29sZS5sb2coJ3NlbmQgcmVxdWVzdCBpcyBiZWluZyBydW4hIScpXG4gICAgdmFyIHRoYXQ9dGhpcztcbiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRGcmllbmRCeU5hbWUnKSE9PW51bGwpe1xuICAgICAgdmFyIHBlcnNvbj1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZEZyaWVuZEJ5TmFtZScpLnZhbHVlXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBwZXJzb24gPSBhIHx8ICd0ZXN0JztcbiAgICB9XG4gICAgY29uc29sZS5sb2coJ3BlcnNvbjonLHBlcnNvbilcbiAgICBjb25zb2xlLmxvZygnc3RhdGUnLCB0aGlzLnN0YXRlKTtcbiAgICB2YXIgZnJpZW5kczE9W107XG5jb25zb2xlLmxvZygndGhpcyBzaG91bGQgYWxzbyBiZSBteSBmcmllbmRzJyx0aGlzLnN0YXRlLm15RnJpZW5kcylcbiAgICBmb3IgKHZhciBpPTA7aTx0aGlzLnN0YXRlLm15RnJpZW5kcztpKyspe1xuICAgICAgZnJpZW5kczEucHVzaCh0aGlzLnN0YXRlLm15RnJpZW5kc1tpXVswXSlcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpPTA7aTx0aGlzLnN0YXRlLnJlcXVlc3RzT2ZDdXJyZW50VXNlci5sZW5ndGg7aSsrKXtcbiAgICAgIGZyaWVuZHMxLnB1c2godGhpcy5zdGF0ZS5yZXF1ZXN0c09mQ3VycmVudFVzZXJbaV0pXG4gICAgfVxuXG4gICAgdmFyIHBwbFlvdUNhbnRTZW5kVG89ZnJpZW5kczE7XG4gICAgY29uc29sZS5sb2coJ3BwbCB5b3UgY2FudCBzZW5kIHRvJyxmcmllbmRzMSxwZXJzb24pO1xuICAgIGNvbnNvbGUubG9nKCd0b2YnLGZyaWVuZHMxLmluZGV4T2YocGVyc29uKSE9PSAtMSwgZnJpZW5kczEubGVuZ3RoIT09MClcbiAgICBpZiAoZnJpZW5kczEuaW5kZXhPZihwZXJzb24pIT09IC0xICYmIGZyaWVuZHMxLmxlbmd0aCE9PTApe1xuICAgICAgJChcIiNBbHJlYWR5UmVxXCIpLmZhZGVJbigxMDAwKTtcbiAgICAgICQoXCIjQWxyZWFkeVJlcVwiKS5mYWRlT3V0KDEwMDApO1xuICAgICAgY29uc29sZS5sb2coJ3RoaXMgcGVyc29uIGlzIGFscmVhZHkgaW4gdGhlcmUhIScpXG4gICAgfSBlbHNlIGlmIChwZXJzb24ubGVuZ3RoPT09MCkge1xuICAgICAgJChcIiNlbnRlclJlYWxGcmllbmRcIikuZmFkZUluKDEwMDApO1xuICAgICAgJChcIiNlbnRlclJlYWxGcmllbmRcIikuZmFkZU91dCgxMDAwKTtcbiAgICB9IGVsc2Uge1xuXG5cbiAgICAgICQucG9zdChVcmwgKyAnL3NlbmRSZXF1ZXN0Jyx7bmFtZTpwZXJzb259LGZ1bmN0aW9uKGEsYikge1xuICAgICAgIFxuICAgICAgICAgIHRoYXQuc2V0U3RhdGUoe1xuICAgICAgICAgICAgcmVxdWVzdHNPZkN1cnJlbnRVc2VyOmFcbiAgICAgICAgICB9KVxuXG4gICAgICAgICQoXCIjcmVxU2VudFwiKS5mYWRlSW4oMTAwMCk7XG4gICAgICAgICQoXCIjcmVxU2VudFwiKS5mYWRlT3V0KDEwMDApO1xuICAgICAgfSk7XG4gICAgICBpZiAoIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kRnJpZW5kQnlOYW1lJykhPT1udWxsKXtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRGcmllbmRCeU5hbWUnKS52YWx1ZSA9ICcnO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKSB7XG4gICAgdmFyIHRoYXQ9dGhpcztcbiAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgbGlzdCBmcmllbmQgcmVxcycpXG4gICAgJC5wb3N0KFVybCArICcvbGlzdFJlcXVlc3RzJyxmdW5jdGlvbihyZXNwb25zZSxlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coJ1Jlc3BvbnNlIEkgZ2V0ISEhISEhIScscmVzcG9uc2UpO1xuICAgICAgdmFyIHRvcD1bXVxuICAgICAgdmFyIGJvdHRvbT1bXVxuICAgICAgY29uc29sZS5sb2coJ3RyJywgcmVzcG9uc2UpXG4gICAgICBmb3IgKHZhciBpPTA7aTxyZXNwb25zZVswXS5sZW5ndGg7aSsrKXtcbiAgICAgICAgaWYgKHJlc3BvbnNlWzBdW2ldWydyZXF1ZXN0b3InXSE9PXJlc3BvbnNlWzFdICYmIHJlc3BvbnNlWzBdW2ldWydyZXNwb25zZSddPT09bnVsbCApe1xuICAgICAgICAgIHRvcC5wdXNoKHJlc3BvbnNlWzBdW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzcG9uc2VbMF1baV1bJ3JlcXVlc3RvciddPT09cmVzcG9uc2VbMV0gJiZyZXNwb25zZVswXVtpXVsncmVzcG9uc2UnXSE9PW51bGwpe1xuICAgICAgICAgIGJvdHRvbS5wdXNoKHJlc3BvbnNlWzBdW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGF0LnNldFN0YXRlKHtcbiAgICAgICAgcGVuZGluZ0ZyaWVuZFJlcXVlc3RzOnRvcCxcbiAgICAgICAgcmVxdWVzdFJlc3BvbnNlczpib3R0b21cbiAgICAgIH0pXG4gICAgfSk7XG4gIH07XG5cbiAgZm9jdXNPbkZyaWVuZCgpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgJCgnLmluZGl2aWR1YWwnKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHZhciBmcmllbmROYW1lID0gJCh0aGlzKS5odG1sKCk7XG5cbiAgICAgIHRoYXQuc2V0U3RhdGUoe1xuICAgICAgICB2aWV3OidzaW5nbGVGcmllbmQnLFxuICAgICAgICBmcmllbmRUb0ZvY3VzT246IGZyaWVuZE5hbWVcbiAgICAgIH0pO1xuXG4gICAgICAkLmdldChVcmwgKyAnL2dldEZyaWVuZFVzZXJSYXRpbmdzJyx7ZnJpZW5kTmFtZTogZnJpZW5kTmFtZX0sZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2dldHRpbmcgZnJpZW5kIG1vdmllczonLCByZXNwb25zZSk7XG4gICAgICAgIHRoYXQuc2V0U3RhdGUoe1xuICAgICAgICAgIGluZGl2aWR1YWxGcmllbmRzTW92aWVzOiByZXNwb25zZVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICB9XG5cbiAgbGlzdFBvdGVudGlhbHMoKSB7XG4gICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGxpc3QgcG90ZW50aWFsIGZyaWVuZHMnKVxuICB9XG5cbiAgcmVtb3ZlUmVxdWVzdChwZXJzb24sIHNlbGYsIG1vdmllKSB7XG4gICAgdmFyIHRoYXQ9IHRoaXM7XG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogVXJsICsgJy9yZW1vdmVSZXF1ZXN0JyxcbiAgICAgIHR5cGU6ICdERUxFVEUnLFxuICAgICAgZGF0YToge1xuICAgICAgICByZXF1ZXN0b3I6IHNlbGYsXG4gICAgICAgIHJlcXVlc3RlZTogcGVyc29uLFxuICAgICAgICBtb3ZpZTogbW92aWVcbiAgICAgIH0sXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnUkVRVUVTVCBSRU1PVkVEISBNb3ZpZSBpczogJywgbW92aWUpO1xuICAgICAgICB0aGF0Lmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKTtcbiAgICAgIH0sXG4gICAgICBlcnJvcjogZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnZpZXc9PT0nTG9naW4nKSB7XG4gICAgICByZXR1cm4gKDxMb2dJbiBjaGFuZ2VWaWV3cz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfSBzZXRDdXJyZW50VXNlcj17dGhpcy5zZXRDdXJyZW50VXNlci5iaW5kKHRoaXMpfS8+KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldz09PVwiU2lnblVwXCIpIHtcbiAgICAgIHJldHVybiAoPFNpZ25VcCBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9IHNldEN1cnJlbnRVc2VyPXt0aGlzLnNldEN1cnJlbnRVc2VyLmJpbmQodGhpcyl9Lz4pO1xuICAgIH0gXG4gICAgLy90aGlzIHZpZXcgaXMgYWRkZWQgZm9yIG1vdmllc2VhcmNoIHJlbmRlcmluZ1xuICAgIGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJNb3ZpZVNlYXJjaFZpZXdcIikge1xuICAgICAgcmV0dXJuICggXG4gICAgICAgIDxkaXY+IFxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XG4gICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX0gXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgPE1vdmllUmF0aW5nIFxuICAgICAgICAgICAgaGFuZGxlU2VhcmNoTW92aWU9e3RoaXMuZ2V0TW92aWUuYmluZCh0aGlzKX0gXG4gICAgICAgICAgICBtb3ZpZT17dGhpcy5zdGF0ZS5tb3ZpZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJJbmJveFwiICkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICBIb21lPXt0cnVlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxJbmJveCBcbiAgICAgICAgICAgICAgcmVxdWVzdHM9e3RoaXMuc3RhdGUucGVuZGluZ0ZyaWVuZFJlcXVlc3RzfVxuICAgICAgICAgICAgICByZXNwb25zZXNBbnN3ZXJlZD17dGhpcy5zdGF0ZS5yZXF1ZXN0UmVzcG9uc2VzfVxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9ICBcbiAgICAgICAgICAgICAgYWNjZXB0PSB7dGhpcy5hY2NlcHRGcmllbmQuYmluZCh0aGlzKX0gXG4gICAgICAgICAgICAgIGRlY2xpbmU9e3RoaXMuZGVjbGluZUZyaWVuZC5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgICAgbGlzdFJlcXVlc3RzPXt0aGlzLmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMuYmluZCh0aGlzKX0gXG4gICAgICAgICAgICAgIHBwbFdob1dhbnRUb0JlRnJpZW5kcz17dGhpcy5zdGF0ZS5wZW5kaW5nRnJpZW5kUmVxdWVzdHMubWFwKFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGEpe3JldHVybiBbYS5yZXF1ZXN0b3IsYS5yZXF1ZXN0VHlwLGEubW92aWU9PT1udWxsP1wiXCI6IGEubW92aWUsXCJNZXNzYWdlOlwiKyBhLm1lc3NhZ2U9PT0nbnVsbCc/XCJub25lXCI6YS5tZXNzYWdlXX0pfSBcbiAgICAgICAgICAgICAgcmVtb3ZlPXt0aGlzLnJlbW92ZVJlcXVlc3QuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJGcmllbmRzXCIgKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxuICAgICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9Lz5cbiAgICAgICAgICA8RnJpZW5kcyBcbiAgICAgICAgICAgIHNlbmRXYXRjaFJlcXVlc3Q9e3RoaXMuc2VuZFdhdGNoUmVxdWVzdC5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgIGZvZj0ge3RoaXMuZm9jdXNPbkZyaWVuZC5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgIGdldEZyaWVuZHM9e3RoaXMuZ2V0Q3VycmVudEZyaWVuZHMuYmluZCh0aGlzKX0gXG4gICAgICAgICAgICBteUZyaWVuZHM9e3RoaXMuc3RhdGUubXlGcmllbmRzfSBcbiAgICAgICAgICAgIGxpc3RQb3RlbnRpYWxzPXt0aGlzLmxpc3RQb3RlbnRpYWxzLmJpbmQodGhpcyl9IFxuICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfSAgXG4gICAgICAgICAgICBzZW5kUmVxdWVzdD17dGhpcy5zZW5kUmVxdWVzdC5iaW5kKHRoaXMpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkhvbWVcIikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyl9IFxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPEhvbWUgXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NNb3ZpZS5iaW5kKHRoaXMpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJTaW5nbGVNb3ZpZVwiKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPFNpbmdsZU1vdmllUmF0aW5nIFxuICAgICAgICAgICAgY3VycmVudE1vdmllPXt0aGlzLnN0YXRlLm1vdmllfVxuICAgICAgICAgICAgY2hhbmdlPXt0aGlzLmNoYW5nZVZpZXdzRnJpZW5kcy5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgZm9mPXt0aGlzLmZvY3VzT25GcmllbmQuYmluZCh0aGlzKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXc9PT0nc2luZ2xlRnJpZW5kJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyl9IFxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPFNpbmdsZUZyaWVuZCBcbiAgICAgICAgICAgIG1vdmllc09mRnJpZW5kPXt0aGlzLnN0YXRlLmluZGl2aWR1YWxGcmllbmRzTW92aWVzfSBcbiAgICAgICAgICAgIGZyaWVuZE5hbWU9e3RoaXMuc3RhdGUuZnJpZW5kVG9Gb2N1c09ufSBcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIGNoYW5nZT17dGhpcy5jaGFuZ2VWaWV3c01vdmllLmJpbmQodGhpcyl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkZOTUJcIikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyl9IFxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPEZpbmRNb3ZpZUJ1ZGR5IFxuICAgICAgICAgICAgYnVkZHlmdW5jPXt0aGlzLmJ1ZGR5UmVxdWVzdC5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgIGJ1ZGRpZXM9e3RoaXMuc3RhdGUucG90ZW50aWFsTW92aWVCdWRkaWVzfSBcbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiTXlSYXRpbmdzXCIpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XG4gICAgICAgICAgICAgIGZpbmQ9e3RoaXMuZmluZE1vdmllQnVkZGllcy5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDxNeVJhdGluZ3MgXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NNb3ZpZS5iaW5kKHRoaXMpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cblxud2luZG93LkFwcCA9IEFwcDtcbnZhciBVcmwgPSAnaHR0cHM6Ly90aGF3aW5nLWlzbGFuZC05OTc0Ny5oZXJva3VhcHAuY29tJztcbi8vIHZhciBVcmwgPSAnaHR0cDovLzEyNy4wLjAuMTozMDAwJztcbndpbmRvdy5VcmwgPSBVcmw7XG4iXX0=
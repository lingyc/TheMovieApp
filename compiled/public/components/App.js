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
      currentUser: null
    };
    return _this;
  }

  _createClass(App, [{
    key: 'getCurrentFriends',
    value: function getCurrentFriends() {
      var that = this;
      console.log('testinggg');
      $.post('http://127.0.0.1:3000/getFriends', { test: 'info' }, function (a, b) {
        var final = a.sort(function (a, b) {
          return b[1] - a[1];
        });
        that.setState({
          myFriends: final
        });
      });
    }
  }, {
    key: 'acceptFriend',
    value: function acceptFriend(a) {
      var final = a;
      $('button').on('click', function () {
        console.log($(this).html());
      });
      console.log(final + 'should be accepted');

      $.post('http://127.0.0.1:3000/accept', { personToAccept: final }, function (a, b) {
        console.log(a, b);
      });
    }
  }, {
    key: 'declineFriend',
    value: function declineFriend(a) {
      var final = a;

      $.post('http://127.0.0.1:3000/decline', { personToDecline: final }, function (a, b) {
        console.log(a, b);
      });
    }
  }, {
    key: 'findMovieBuddies',
    value: function findMovieBuddies() {
      var that = this;
      $.post('http://127.0.0.1:3000/findMovieBuddies', { dummy: 'info' }, function (a, b) {
        var final = a.sort(function (a, b) {
          return b[1] - a[1];
        });
        console.log(that.state.myFriends, that.state.potentialMovieBuddies);

        that.setState({
          view: "FNMB",
          potentialMovieBuddies: final
        });
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
    key: 'logInFunction',
    value: function logInFunction(name, password) {
      this.setState({ username: name });
      var that = this;
      console.log(name, password);

      $.post('http://127.0.0.1:3000/login', { name: name, password: password }).then(function (response) {

        if (response[0] === 'it worked') {
          that.getCurrentFriends();

          console.log('hi');
          that.setState({
            view: 'Home',
            currentUser: response[1]

          });
        }
        console.log('this.state.view after state is set again', that.state.view);
      }).catch(function (err) {
        console.log(err);
      });
    }
  }, {
    key: 'enterNewUser',
    value: function enterNewUser(name, password) {
      console.log(name, password);
      $.post('http://127.0.0.1:3000/signup', { name: name, password: password }).then(function () {
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
      $.post('http://127.0.0.1:3000/getFriendRatings', { name: movieName }).then(function (response) {

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
      $.post('http://127.0.0.1:3000/logout').then(function (response) {
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
        $.post('http://127.0.0.1:3000/sendWatchRequest', toSend, function (a, b) {
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
      if (targetState === 'Friends') {
        this.getCurrentFriends();
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
      console.log('callingbuddy');
      console.log(a);
      $.post('http://127.0.0.1:3000/sendRequest', { name: a }, function (a, b) {
        console.log('a', 'b');
      });
    }
  }, {
    key: 'sendRequest',
    value: function sendRequest() {
      var person = document.getElementById('findFriendByName').value;
      if (person.length === 0) {
        $("#enterRealFriend").fadeIn(1000);
        $("#enterRealFriend").fadeOut(1000);
      } else {
        $.post('http://127.0.0.1:3000/sendRequest', { name: person }, function (a, b) {
          console.log(a, b);
        });
        var person = document.getElementById('findFriendByName').value = '';
      }
    }
  }, {
    key: 'listPendingFriendRequests',
    value: function listPendingFriendRequests() {
      var that = this;
      console.log('this should list friend reqs');
      $.post('http://127.0.0.1:3000/listRequests', function (response, error) {
        console.log('Response I get!!!!!!!', response);
        var top = [];
        var bottom = [];
        console.log('tr', top, response);
        for (var i = 0; i < response[0].length; i++) {
          if (response[0][i]['requestor'] !== response[1] && response[0][i]['response'] === null) {
            top.push(response[0][i]);
          }
          if (response[0][i]['requestor'] === response[1] && response[0][i]['response'] !== null) {
            bottom.push(response[0][i]);
          }
        }

        console.log('tr', top, response);
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

        $.get('http://127.0.0.1:3000/getFriendUserRatings', { friendName: friendName }, function (response) {
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
    key: 'render',
    value: function render() {
      if (this.state.view === 'Login') {
        return React.createElement(
          'div',
          null,
          ' ',
          React.createElement(
            'h2',
            { id: 'loginHeader' },
            'Login'
          ),
          ' ',
          React.createElement('br', null),
          React.createElement(LogIn, {
            ourFunction: this.changeView.bind(this),
            logInFunction: this.logInFunction.bind(this)
          }),
          '  '
        );
      } else if (this.state.view === "SignUp") {
        return React.createElement(
          'div',
          null,
          React.createElement(
            'h2',
            { id: 'loginHeader' },
            'SignUp'
          ),
          ' ',
          React.createElement('br', null),
          React.createElement(SignUp, { enterUser: this.enterNewUser.bind(this), onClick: this.changeViews.bind(this) })
        );
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
            React.createElement(
              'div',
              null,
              React.createElement(Nav, { name: this.state.currentUser,
                find: this.findMovieBuddies.bind(this),
                onClick: this.changeViews.bind(this),
                logout: this.logout.bind(this)
              })
            ),
            React.createElement(Inbox, {
              responsesAnswered: this.state.requestResponses,
              logout: this.logout.bind(this),
              accept: this.acceptFriend.bind(this),
              decline: this.declineFriend.bind(this),
              listRequests: this.listPendingFriendRequests.bind(this),
              pplWhoWantToBeFriends: this.state.pendingFriendRequests.map(function (a) {
                return [a.requestor, a.requestTyp, a.movie === null ? "" : "(" + a.movie + ")"];
              })
            })
          );
        } else if (this.state.view === "Friends") {
          return React.createElement(
            'div',
            null,
            React.createElement(
              'div',
              null,
              React.createElement(Nav, { name: this.state.currentUser,
                find: this.findMovieBuddies.bind(this),
                onClick: this.changeViews.bind(this),
                logout: this.logout.bind(this) })
            ),
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
            React.createElement(
              'div',
              null,
              React.createElement(Nav, { name: this.state.currentUser,
                find: this.findMovieBuddies.bind(this),
                onClick: this.changeViews.bind(this),
                logout: this.logout.bind(this)
              })
            ),
            React.createElement(Home, {
              change: this.changeViewsMovie.bind(this)
            })
          );
        } else if (this.state.view === "SingleMovie") {
          return React.createElement(
            'div',
            null,
            React.createElement(
              'div',
              null,
              React.createElement(Nav, { name: this.state.currentUser,
                onClick: this.changeViews.bind(this),
                logout: this.logout.bind(this)
              })
            ),
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
            React.createElement(
              'div',
              null,
              React.createElement(Nav, { name: this.state.currentUser,
                find: this.findMovieBuddies.bind(this),
                onClick: this.changeViews.bind(this),
                logout: this.logout.bind(this)
              })
            ),
            React.createElement(FindMovieBuddy, {
              buddyfunc: this.buddyRequest.bind(this),
              buddies: this.state.potentialMovieBuddies
            })
          );
        } else if (this.state.view === "MyRatings") {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sRzs7O0FBQ0osZUFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsdUZBQ1gsS0FEVzs7QUFHakIsVUFBSyxLQUFMLEdBQWE7QUFDWCxZQUFLLE9BRE07QUFFWCxzQkFBZSxFQUZKO0FBR1gsYUFBTyxJQUhJO0FBSVgsc0JBQWUsRUFKSjtBQUtYLDZCQUFzQixFQUxYO0FBTVgsaUJBQVUsRUFOQztBQU9YLHVCQUFnQixFQVBMO0FBUVgsK0JBQXdCLEVBUmI7QUFTWCw2QkFBc0IsRUFUWDtBQVVYLGdCQUFVLElBVkM7QUFXWCx3QkFBaUIsRUFYTjtBQVlYLG1CQUFZO0FBWkQsS0FBYjtBQUhpQjtBQWlCbEI7Ozs7d0NBRW1CO0FBQ2xCLFVBQUksT0FBSyxJQUFUO0FBQ0EsY0FBUSxHQUFSLENBQVksV0FBWjtBQUNBLFFBQUUsSUFBRixDQUFPLGtDQUFQLEVBQTBDLEVBQUMsTUFBSyxNQUFOLEVBQTFDLEVBQXdELFVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYztBQUNuRSxZQUFJLFFBQU8sRUFBRSxJQUFGLENBQU8sVUFBUyxDQUFULEVBQVcsQ0FBWCxFQUFhO0FBQUMsaUJBQU8sRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQVo7QUFBaUIsU0FBdEMsQ0FBWDtBQUNELGFBQUssUUFBTCxDQUFjO0FBQ1oscUJBQVU7QUFERSxTQUFkO0FBR0QsT0FMRDtBQU1EOzs7aUNBRVksQyxFQUFHO0FBQ2QsVUFBSSxRQUFNLENBQVY7QUFDQSxRQUFFLFFBQUYsRUFBWSxFQUFaLENBQWUsT0FBZixFQUF1QixZQUFXO0FBQ2hDLGdCQUFRLEdBQVIsQ0FBWSxFQUFFLElBQUYsRUFBUSxJQUFSLEVBQVo7QUFDRCxPQUZEO0FBR0EsY0FBUSxHQUFSLENBQVksUUFBTyxvQkFBbkI7O0FBRUEsUUFBRSxJQUFGLENBQU8sOEJBQVAsRUFBc0MsRUFBQyxn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SUFBdEIsQ0FBMkIsSUFBM0IsQ0FEUjtBQUVFLHlCQUFTLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixJQUF0QixDQUZYO0FBR0Usd0JBQVEsS0FBSyxNQUFMLENBQVksSUFBWixDQUFpQixJQUFqQjtBQUhWO0FBREYsYUFERjtBQVFFLGdDQUFDLFNBQUQ7QUFDRSxzQkFBUSxLQUFLLGdCQUFMLENBQXNCLElBQXRCLENBQTJCLElBQTNCO0FBRFY7QUFSRixXQURGO0FBY0Q7QUFDRjs7OztFQXBhZSxNQUFNLFM7O0FBdWF4QixPQUFPLEdBQVAsR0FBYSxHQUFiIiwiZmlsZSI6IkFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEFwcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHZpZXc6J0xvZ2luJyxcbiAgICAgIGZyaWVuZHNSYXRpbmdzOltdLFxuICAgICAgbW92aWU6IG51bGwsXG4gICAgICBmcmllbmRSZXF1ZXN0czpbXSxcbiAgICAgIHBlbmRpbmdGcmllbmRSZXF1ZXN0czpbXSxcbiAgICAgIG15RnJpZW5kczpbXSxcbiAgICAgIGZyaWVuZFRvRm9jdXNPbjonJyxcbiAgICAgIGluZGl2aWR1YWxGcmllbmRzTW92aWVzOltdLFxuICAgICAgcG90ZW50aWFsTW92aWVCdWRkaWVzOnt9LFxuICAgICAgdXNlcm5hbWU6IG51bGwsXG4gICAgICByZXF1ZXN0UmVzcG9uc2VzOltdLFxuICAgICAgY3VycmVudFVzZXI6bnVsbFxuICAgIH07XG4gIH1cblxuICBnZXRDdXJyZW50RnJpZW5kcygpIHtcbiAgICB2YXIgdGhhdD10aGlzO1xuICAgIGNvbnNvbGUubG9nKCd0ZXN0aW5nZ2cnKVxuICAgICQucG9zdCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL2dldEZyaWVuZHMnLHt0ZXN0OidpbmZvJ30sZnVuY3Rpb24oYSxiKSB7XG4gICAgICAgdmFyIGZpbmFsPSBhLnNvcnQoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYlsxXS1hWzFdfSk7XG4gICAgICB0aGF0LnNldFN0YXRlKHtcbiAgICAgICAgbXlGcmllbmRzOmZpbmFsXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBhY2NlcHRGcmllbmQoYSkge1xuICAgIHZhciBmaW5hbD1hO1xuICAgICQoJ2J1dHRvbicpLm9uKCdjbGljaycsZnVuY3Rpb24oKSB7XG4gICAgICBjb25zb2xlLmxvZygkKHRoaXMpLmh0bWwoKSk7XG4gICAgfSlcbiAgICBjb25zb2xlLmxvZyhmaW5hbCArJ3Nob3VsZCBiZSBhY2NlcHRlZCcpXG5cbiAgICAkLnBvc3QoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9hY2NlcHQnLHtwZXJzb25Ub0FjY2VwdDpmaW5hbH0sZnVuY3Rpb24oYSxiKSB7XG4gICAgICBjb25zb2xlLmxvZyhhLGIpXG4gICAgfSlcbiAgfVxuXG4gIGRlY2xpbmVGcmllbmQoYSkge1xuICAgIHZhciBmaW5hbD1hO1xuXG4gICAgJC5wb3N0KCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvZGVjbGluZScse3BlcnNvblRvRGVjbGluZTpmaW5hbH0sZnVuY3Rpb24oYSxiKSB7XG4gICAgICBjb25zb2xlLmxvZyhhLGIpXG4gICAgfSlcbiAgfVxuXG4gIGZpbmRNb3ZpZUJ1ZGRpZXMoKSB7XG4gICAgdmFyIHRoYXQ9dGhpcztcbiAgICAkLnBvc3QoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9maW5kTW92aWVCdWRkaWVzJyx7ZHVtbXk6J2luZm8nfSxmdW5jdGlvbihhLGIpIHtcbiAgICAgIHZhciBmaW5hbD1hLnNvcnQoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYlsxXS1hWzFdfSlcbmNvbnNvbGUubG9nKHRoYXQuc3RhdGUubXlGcmllbmRzLHRoYXQuc3RhdGUucG90ZW50aWFsTW92aWVCdWRkaWVzKTtcblxuICAgICAgdGhhdC5zZXRTdGF0ZSh7XG4gICAgICAgIHZpZXc6XCJGTk1CXCIsXG4gICAgICAgIHBvdGVudGlhbE1vdmllQnVkZGllczpmaW5hbFxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgY2hhbmdlVmlldygpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHZpZXc6XCJTaWduVXBcIiBcbiAgICB9KVxuICB9XG5cbiAgbG9nSW5GdW5jdGlvbihuYW1lLHBhc3N3b3JkKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7dXNlcm5hbWU6IG5hbWV9KVxuICAgIHZhciB0aGF0PXRoaXM7XG4gICAgY29uc29sZS5sb2cobmFtZSxwYXNzd29yZClcblxuICAgICQucG9zdCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL2xvZ2luJyx7bmFtZTpuYW1lLHBhc3N3b3JkOnBhc3N3b3JkfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgXG4gICBcbiAgICAgIGlmIChyZXNwb25zZVswXT09PSdpdCB3b3JrZWQnKSB7XG4gICAgICAgICAgdGhhdC5nZXRDdXJyZW50RnJpZW5kcygpO1xuICAgICAgICAgIFxuICAgICAgIGNvbnNvbGUubG9nKCdoaScpXG4gICAgICAgICAgdGhhdC5zZXRTdGF0ZSh7XG4gICAgICAgICAgICB2aWV3OidIb21lJyxcbiAgICAgICAgICAgIGN1cnJlbnRVc2VyOnJlc3BvbnNlWzFdXG5cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgY29uc29sZS5sb2coJ3RoaXMuc3RhdGUudmlldyBhZnRlciBzdGF0ZSBpcyBzZXQgYWdhaW4nLHRoYXQuc3RhdGUudmlldylcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycikge2NvbnNvbGUubG9nKGVycil9KVxuICAgIH1cblxuICBlbnRlck5ld1VzZXIobmFtZSxwYXNzd29yZCkge1xuICAgIGNvbnNvbGUubG9nKG5hbWUscGFzc3dvcmQpO1xuICAgICQucG9zdCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL3NpZ251cCcse25hbWU6bmFtZSxwYXNzd29yZDpwYXNzd29yZH0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICBjb25zb2xlLmxvZygnc3VjY2VzcycpOyBcbiAgICAgIHRoaXMuc2V0U3RhdGUoe3VzZXJuYW1lOiBuYW1lfSlcbiAgICB9KS5jYXRjaChmdW5jdGlvbigpIHtjb25zb2xlLmxvZygnZXJyb3InKX0pXG4gIH1cblxuICBnZXRGcmllbmRNb3ZpZVJhdGluZ3MoKSB7XG4gICAgdmFyIHRoYXQ9dGhpcztcbiAgICBjb25zb2xlLmxvZygnbW9vb29vdmllJyk7XG4gICAgdmFyIG1vdmllTmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibW92aWVUb1ZpZXdcIikudmFsdWVcbiAgICAkLnBvc3QoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9nZXRGcmllbmRSYXRpbmdzJywgeyBuYW1lOiBtb3ZpZU5hbWUgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuXG4gICAgICB0aGF0LnNldFN0YXRlKHtcbiAgICAgIHZpZXc6XCJIb21lXCIsXG4gICAgICBmcmllbmRzUmF0aW5nczpyZXNwb25zZVxuICAgIH0pXG4gICAgY29uc29sZS5sb2coJ291ciByZXNwb25zZScsdGhhdC5zdGF0ZS5mcmllbmRzUmF0aW5ncylcblxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGVycikge2NvbnNvbGUubG9nKGVycil9KTtcbiAgfVxuXG4gIGxvZ291dCgpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgJC5wb3N0KCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvbG9nb3V0JykudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgdGhhdC5zZXRTdGF0ZSh7XG4gICAgICAgIHZpZXc6XCJMb2dpblwiLFxuICAgICAgICBmcmllbmRzUmF0aW5nczpbXVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzZW5kV2F0Y2hSZXF1ZXN0KGZyaWVuZCkge1xuICAgIHZhciBtb3ZpZT0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21vdmllVG9XYXRjaCcpLnZhbHVlO1xuICAgIHZhciB0b1NlbmQ9e3JlcXVlc3RlZTpmcmllbmQsIG1vdmllOm1vdmllfTtcbiAgICBpZiAobW92aWUubGVuZ3RoPjApIHtcbiAgICAgICQucG9zdCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL3NlbmRXYXRjaFJlcXVlc3QnLCB0b1NlbmQgLGZ1bmN0aW9uKGEsYikge1xuICAgICAgICBjb25zb2xlLmxvZyhhLGIpO1xuICAgICAgfSk7XG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW92aWVUb1dhdGNoJykudmFsdWU9Jyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCd5b3UgbmVlZCB0byBlbnRlciBhIG1vdmllIHRvIHNlbmQgYSB3YXRjaCByZXF1ZXN0ISEhIScpXG4gICAgfVxuICB9XG5cblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgLy8vLy9tb3ZpZSByZW5kZXJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIC8vY2FsbCBzZWFyY2htb3ZpZSBmdW5jdGlvblxuICAvL3doaWNoIGdldHMgcGFzc2VkIGRvd24gdG8gdGhlIE1vdmllIFNlYXJjaCBcbiAgZ2V0TW92aWUocXVlcnkpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgIHF1ZXJ5OiBxdWVyeVxuICAgIH07XG4gICAgXG4gICAgdGhpcy5wcm9wcy5zZWFyY2hNb3ZpZShvcHRpb25zLCAobW92aWUpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKG1vdmllKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICB2aWV3OlwiTW92aWVTZWFyY2hWaWV3XCIsXG4gICAgICAgIG1vdmllOiBtb3ZpZVxuICAgICAgfSlcbiAgICB9KVxuICB9XG4gIC8vc2hvdyB0aGUgbW92aWUgc2VhcmNoZWQgaW4gZnJpZW5kIG1vdmllIGxpc3RcbiAgLy9vbnRvIHRoZSBzdGF0ZXZpZXcgb2YgbW92aWVzZWFyY2h2aWV3XG4gIHNob3dNb3ZpZShtb3ZpZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbW92aWU6IG1vdmllXG4gICAgfSlcbiAgfVxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgLy8vLy9OYXYgY2hhbmdlXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICBjaGFuZ2VWaWV3cyh0YXJnZXRTdGF0ZSkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUpO1xuICAgIGlmICh0YXJnZXRTdGF0ZT09PSdGcmllbmRzJyl7XG4gICAgICB0aGlzLmdldEN1cnJlbnRGcmllbmRzKCk7XG4gICAgfVxuXG4gICAgIGlmICh0YXJnZXRTdGF0ZT09PVwiSW5ib3hcIil7XG4gICAgICAgdGhpcy5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKClcbiAgICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB2aWV3OiB0YXJnZXRTdGF0ZVxuICAgIH0pO1xuICB9XG5cbiAgY2hhbmdlVmlld3NNb3ZpZSh0YXJnZXRTdGF0ZSwgbW92aWUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHZpZXc6IHRhcmdldFN0YXRlLFxuICAgICAgbW92aWU6IG1vdmllXG4gICAgfSk7XG4gIH1cblxuICBjaGFuZ2VWaWV3c0ZyaWVuZHModGFyZ2V0U3RhdGUsIGZyaWVuZCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdmlldzogdGFyZ2V0U3RhdGUsXG4gICAgICBmcmllbmRUb0ZvY3VzT246IGZyaWVuZFxuICAgIH0pO1xuICB9XG5cblxuICBidWRkeVJlcXVlc3QoYSkge1xuICAgIGNvbnNvbGUubG9nKCdjYWxsaW5nYnVkZHknKVxuICAgIGNvbnNvbGUubG9nKGEpO1xuICAgICQucG9zdCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL3NlbmRSZXF1ZXN0Jyx7bmFtZTphfSxmdW5jdGlvbihhLGIpIHtcbiAgICAgY29uc29sZS5sb2coJ2EnLCdiJyk7XG4gICAgfSk7XG4gIH1cblxuXG4gIHNlbmRSZXF1ZXN0KCkge1xuICAgIHZhciBwZXJzb249ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRGcmllbmRCeU5hbWUnKS52YWx1ZTtcbiAgICBpZiAocGVyc29uLmxlbmd0aD09PTApIHtcbiAgICAgICQoXCIjZW50ZXJSZWFsRnJpZW5kXCIpLmZhZGVJbigxMDAwKTtcbiAgICAgICQoXCIjZW50ZXJSZWFsRnJpZW5kXCIpLmZhZGVPdXQoMTAwMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQucG9zdCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL3NlbmRSZXF1ZXN0Jyx7bmFtZTpwZXJzb259LGZ1bmN0aW9uKGEsYikge1xuICAgICAgICBjb25zb2xlLmxvZyhhLGIpO1xuICAgICAgfSk7XG4gICAgICB2YXIgcGVyc29uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRGcmllbmRCeU5hbWUnKS52YWx1ZSA9ICcnO1xuICAgIH1cbiAgfVxuXG4gIGxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKSB7XG4gICAgdmFyIHRoYXQ9dGhpcztcbiAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgbGlzdCBmcmllbmQgcmVxcycpXG4gICAgJC5wb3N0KCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvbGlzdFJlcXVlc3RzJyxmdW5jdGlvbihyZXNwb25zZSxlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coJ1Jlc3BvbnNlIEkgZ2V0ISEhISEhIScscmVzcG9uc2UpO1xudmFyIHRvcD1bXVxudmFyIGJvdHRvbT1bXVxuY29uc29sZS5sb2coJ3RyJyx0b3AscmVzcG9uc2UpXG4gICAgICBmb3IgKHZhciBpPTA7aTxyZXNwb25zZVswXS5sZW5ndGg7aSsrKXtcbmlmIChyZXNwb25zZVswXVtpXVsncmVxdWVzdG9yJ10hPT1yZXNwb25zZVsxXSAmJiByZXNwb25zZVswXVtpXVsncmVzcG9uc2UnXT09PW51bGwgKXtcbiAgICAgICAgICB0b3AucHVzaChyZXNwb25zZVswXVtpXSk7XG4gICAgICAgIH1cbiAgICAgIGlmIChyZXNwb25zZVswXVtpXVsncmVxdWVzdG9yJ109PT1yZXNwb25zZVsxXSAmJnJlc3BvbnNlWzBdW2ldWydyZXNwb25zZSddIT09bnVsbCl7XG4gICAgICAgICAgYm90dG9tLnB1c2gocmVzcG9uc2VbMF1baV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbmNvbnNvbGUubG9nKCd0cicsdG9wLHJlc3BvbnNlKVxuICAgICAgdGhhdC5zZXRTdGF0ZSh7XG4gICAgICAgIHBlbmRpbmdGcmllbmRSZXF1ZXN0czp0b3AsXG4gICAgICAgIHJlcXVlc3RSZXNwb25zZXM6Ym90dG9tXG4gICAgICB9KVxuXG5cbiAgICB9KTtcbiAgfTtcblxuICBmb2N1c09uRnJpZW5kKCkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAkKCcuaW5kaXZpZHVhbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdmFyIGZyaWVuZE5hbWUgPSAkKHRoaXMpLmh0bWwoKTtcblxuICAgICAgdGhhdC5zZXRTdGF0ZSh7XG4gICAgICAgIHZpZXc6J3NpbmdsZUZyaWVuZCcsXG4gICAgICAgIGZyaWVuZFRvRm9jdXNPbjogZnJpZW5kTmFtZVxuICAgICAgfSk7XG5cbiAgICAgICQuZ2V0KCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvZ2V0RnJpZW5kVXNlclJhdGluZ3MnLHtmcmllbmROYW1lOiBmcmllbmROYW1lfSxmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBjb25zb2xlLmxvZygnZ2V0dGluZyBmcmllbmQgbW92aWVzOicsIHJlc3BvbnNlKTtcbiAgICAgICAgdGhhdC5zZXRTdGF0ZSh7XG4gICAgICAgICAgaW5kaXZpZHVhbEZyaWVuZHNNb3ZpZXM6IHJlc3BvbnNlXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuICBsaXN0UG90ZW50aWFscygpIHtcbiAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgbGlzdCBwb3RlbnRpYWwgZnJpZW5kcycpXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUudmlldz09PSdMb2dpbicpIHtcbiAgICAgIHJldHVybiAoIDwgZGl2ID4gPGgyIGlkPSdsb2dpbkhlYWRlcic+TG9naW48L2gyPiA8YnIvPlxuICAgICAgICA8IExvZ0luIFxuICAgICAgICAgIG91ckZ1bmN0aW9uPXt0aGlzLmNoYW5nZVZpZXcuYmluZCh0aGlzKX1cbiAgICAgICAgICBsb2dJbkZ1bmN0aW9uPXt0aGlzLmxvZ0luRnVuY3Rpb24uYmluZCh0aGlzKX1cbiAgICAgICAgIC8gPiAgPC9kaXY+ICk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXc9PT1cIlNpZ25VcFwiKSB7XG4gICAgICByZXR1cm4gKCA8IGRpdiA+PGgyIGlkPSdsb2dpbkhlYWRlcic+U2lnblVwPC9oMj4gPGJyLz5cbiAgICAgICAgPCBTaWduVXAgZW50ZXJVc2VyPXt0aGlzLmVudGVyTmV3VXNlci5iaW5kKHRoaXMpfSBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9LyA+XG4gICAgICAgIDwgL2Rpdj5cbiAgICAgICk7XG4gICAgfSBcbiAgICAvL3RoaXMgdmlldyBpcyBhZGRlZCBmb3IgbW92aWVzZWFyY2ggcmVuZGVyaW5nXG4gICAgZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIk1vdmllU2VhcmNoVmlld1wiKSB7XG4gICAgICByZXR1cm4gKCBcbiAgICAgICAgPGRpdj4gXG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cbiAgICAgICAgICAgIGZpbmQ9e3RoaXMuZmluZE1vdmllQnVkZGllcy5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICA8TW92aWVSYXRpbmcgXG4gICAgICAgICAgICBoYW5kbGVTZWFyY2hNb3ZpZT17dGhpcy5nZXRNb3ZpZS5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgIG1vdmllPXt0aGlzLnN0YXRlLm1vdmllfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkluYm94XCIgKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XG4gICAgICAgICAgICAgIGZpbmQ9e3RoaXMuZmluZE1vdmllQnVkZGllcy5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8SW5ib3ggXG4gICAgICAgICAgICByZXNwb25zZXNBbnN3ZXJlZD17dGhpcy5zdGF0ZS5yZXF1ZXN0UmVzcG9uc2VzfVxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9ICBcbiAgICAgICAgICAgICAgYWNjZXB0PSB7dGhpcy5hY2NlcHRGcmllbmQuYmluZCh0aGlzKX0gXG4gICAgICAgICAgICAgIGRlY2xpbmU9e3RoaXMuZGVjbGluZUZyaWVuZC5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgICAgbGlzdFJlcXVlc3RzPXt0aGlzLmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMuYmluZCh0aGlzKX0gXG4gICAgICAgICAgICAgIHBwbFdob1dhbnRUb0JlRnJpZW5kcz17dGhpcy5zdGF0ZS5wZW5kaW5nRnJpZW5kUmVxdWVzdHMubWFwKFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGEpe3JldHVybiBbYS5yZXF1ZXN0b3IsYS5yZXF1ZXN0VHlwLGEubW92aWU9PT1udWxsP1wiXCI6IFwiKFwiK2EubW92aWUrXCIpXCJdfSl9IFxuICAgICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkZyaWVuZHNcIiApIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfS8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPEZyaWVuZHMgXG4gICAgICAgICAgICBzZW5kV2F0Y2hSZXF1ZXN0PXt0aGlzLnNlbmRXYXRjaFJlcXVlc3QuYmluZCh0aGlzKX0gXG4gICAgICAgICAgICBmb2Y9IHt0aGlzLmZvY3VzT25GcmllbmQuYmluZCh0aGlzKX0gXG4gICAgICAgICAgICBnZXRGcmllbmRzPXt0aGlzLmdldEN1cnJlbnRGcmllbmRzLmJpbmQodGhpcyl9IFxuICAgICAgICAgICAgbXlGcmllbmRzPXt0aGlzLnN0YXRlLm15RnJpZW5kc30gXG4gICAgICAgICAgICBsaXN0UG90ZW50aWFscz17dGhpcy5saXN0UG90ZW50aWFscy5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX0gIFxuICAgICAgICAgICAgc2VuZFJlcXVlc3Q9e3RoaXMuc2VuZFJlcXVlc3QuYmluZCh0aGlzKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJIb21lXCIpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyl9IFxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPEhvbWUgXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NNb3ZpZS5iaW5kKHRoaXMpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJTaW5nbGVNb3ZpZVwiKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8U2luZ2xlTW92aWVSYXRpbmcgXG4gICAgICAgICAgICBjdXJyZW50TW92aWU9e3RoaXMuc3RhdGUubW92aWV9XG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NGcmllbmRzLmJpbmQodGhpcyl9XG4gICAgICAgICAgICBmb2Y9e3RoaXMuZm9jdXNPbkZyaWVuZC5iaW5kKHRoaXMpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldz09PSdzaW5nbGVGcmllbmQnKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxTaW5nbGVGcmllbmQgXG4gICAgICAgICAgICBtb3ZpZXNPZkZyaWVuZD17dGhpcy5zdGF0ZS5pbmRpdmlkdWFsRnJpZW5kc01vdmllc30gXG4gICAgICAgICAgICBmcmllbmROYW1lPXt0aGlzLnN0YXRlLmZyaWVuZFRvRm9jdXNPbn0gXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NNb3ZpZS5iaW5kKHRoaXMpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJGTk1CXCIpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyl9IFxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPEZpbmRNb3ZpZUJ1ZGR5IFxuICAgICAgICAgICAgYnVkZHlmdW5jPXt0aGlzLmJ1ZGR5UmVxdWVzdC5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgIGJ1ZGRpZXM9e3RoaXMuc3RhdGUucG90ZW50aWFsTW92aWVCdWRkaWVzfSBcbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiTXlSYXRpbmdzXCIpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyl9IFxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPE15UmF0aW5ncyBcbiAgICAgICAgICAgIGNoYW5nZT17dGhpcy5jaGFuZ2VWaWV3c01vdmllLmJpbmQodGhpcyl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuXG53aW5kb3cuQXBwID0gQXBwO1xuIl19
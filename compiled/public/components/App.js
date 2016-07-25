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
          return React.createElement(
            'div',
            null,
            React.createElement(Nav, { name: this.state.currentUser,
              onClick: this.changeViews.bind(this),
              logout: this.logout.bind(this)
            }),
            React.createElement(SingleMovieRating, {
              compatibility: this.state.myFriends,
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
// var Url = 'https://thawing-island-99747.herokuapp.com';
var Url = 'http://127.0.0.1:3000';
window.Url = Url;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0FwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sRzs7O0FBQ0osZUFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsdUZBQ1gsS0FEVzs7QUFHakIsVUFBSyxLQUFMLEdBQWE7QUFDWCxZQUFLLE9BRE07QUFFWCxzQkFBZSxFQUZKO0FBR1gsYUFBTyxJQUhJO0FBSVgsc0JBQWUsRUFKSjtBQUtYLDZCQUFzQixFQUxYO0FBTVgsaUJBQVUsRUFOQztBQU9YLHVCQUFnQixFQVBMO0FBUVgsK0JBQXdCLEVBUmI7QUFTWCw2QkFBc0IsRUFUWDtBQVVYLGdCQUFVLElBVkM7QUFXWCx3QkFBaUIsRUFYTjtBQVlYLG1CQUFZLElBWkQ7QUFhWCw2QkFBc0I7QUFiWCxLQUFiO0FBSGlCO0FBa0JsQjs7Ozt3Q0FFbUI7QUFDbEIsVUFBSSxPQUFLLElBQVQ7QUFDQSxjQUFRLEdBQVIsQ0FBWSxXQUFaO0FBQ0EsUUFBRSxJQUFGLENBQU8sTUFBTSxhQUFiLEVBQTJCLEVBQUMsTUFBSyxNQUFOLEVBQTNCLEVBQXlDLFVBQVMsQ0FBVCxFQUFXLENBQVgsRUFBYztBQUNyRCxnQkFBUSxHQUFSLENBQVksK0NBQVosRUFBNEQsQ0FBNUQsRUFBOEQsQ0FBOUQ7QUFDTyxhQUFLLElBQUksSUFBRSxDQUFYLEVBQWEsSUFBRSxFQUFFLE1BQWpCLEVBQXdCLEdBQXhCLEVBQTRCO0FBQ3pCLGNBQUksRUFBRSxDQUFGLEVBQUssQ0FBTCxNQUFVLElBQWQsRUFBbUI7QUFDakIsY0FBRSxDQUFGLEVBQUssQ0FBTCxJQUFVLDBCQUFWO0FBQ0Q7QUFDRjs7QUFFUixZQUFJLFFBQU8sRUFBRSxJQUFGLENBQU8sVUFBUyxDQUFULEVBQVcsQ0FBWCxFQUFhO0FBQUMsaUJBQU8sRUFBRSxDQUFGLElBQUssRUFBRSxDQUFGLENBQVo7QUFBaUIsU0FBdEMsQ0FBWDtBQUNELGFBQUssUUFBTCxDQUFjO0FBQ1oscUJBQVU7QUFE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LGNBQUQ7QUFDRSx5QkFBVyxLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FEYjtBQUVFLHVCQUFTLEtBQUssS0FBTCxDQUFXO0FBRnRCO0FBTkYsV0FERjtBQWFELFNBZE0sTUFjQSxJQUFJLEtBQUssS0FBTCxDQUFXLElBQVgsS0FBb0IsV0FBeEIsRUFBcUM7QUFDMUMsaUJBQ0U7QUFBQTtBQUFBO0FBQ0ksZ0NBQUMsR0FBRCxJQUFLLE1BQU0sS0FBSyxLQUFMLENBQVcsV0FBdEI7QUFDRSxvQkFBTSxLQUFLLGdCQUFMLENBQXNCLElBQXRCLENBQTJCLElBQTNCLENBRFI7QUFFRSx1QkFBUyxLQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsSUFBdEIsQ0FGWDtBQUdFLHNCQUFRLEtBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsSUFBakI7QUFIVixjQURKO0FBTUUsZ0NBQUMsU0FBRDtBQUNFLHNCQUFRLEtBQUssZ0JBQUwsQ0FBc0IsSUFBdEIsQ0FBMkIsSUFBM0I7QUFEVjtBQU5GLFdBREY7QUFZRDtBQUNGOzs7O0VBamZlLE1BQU0sUzs7QUFvZnhCLE9BQU8sR0FBUCxHQUFhLEdBQWI7O0FBRUEsSUFBSSxNQUFNLHVCQUFWO0FBQ0EsT0FBTyxHQUFQLEdBQWEsR0FBYiIsImZpbGUiOiJBcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBBcHAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICB2aWV3OidMb2dpbicsXG4gICAgICBmcmllbmRzUmF0aW5nczpbXSxcbiAgICAgIG1vdmllOiBudWxsLFxuICAgICAgZnJpZW5kUmVxdWVzdHM6W10sXG4gICAgICBwZW5kaW5nRnJpZW5kUmVxdWVzdHM6W10sXG4gICAgICBteUZyaWVuZHM6W10sXG4gICAgICBmcmllbmRUb0ZvY3VzT246JycsXG4gICAgICBpbmRpdmlkdWFsRnJpZW5kc01vdmllczpbXSxcbiAgICAgIHBvdGVudGlhbE1vdmllQnVkZGllczp7fSxcbiAgICAgIHVzZXJuYW1lOiBudWxsLFxuICAgICAgcmVxdWVzdFJlc3BvbnNlczpbXSxcbiAgICAgIGN1cnJlbnRVc2VyOm51bGwsXG4gICAgICByZXF1ZXN0c09mQ3VycmVudFVzZXI6W11cbiAgICB9O1xuICB9XG5cbiAgZ2V0Q3VycmVudEZyaWVuZHMoKSB7XG4gICAgdmFyIHRoYXQ9dGhpcztcbiAgICBjb25zb2xlLmxvZygndGVzdGluZ2dnJylcbiAgICAkLnBvc3QoVXJsICsgJy9nZXRGcmllbmRzJyx7dGVzdDonaW5mbyd9LGZ1bmN0aW9uKGEsYikge1xuICAgICAgY29uc29sZS5sb2coJ3doYXQgeW91IGdldCBiYWNrIGZyb20gc2VydmVyIGZvciBnZXQgZnJpZW5kcycsYSxiKTtcbiAgICAgICAgICAgICBmb3IgKHZhciBpPTA7aTxhLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgIGlmIChhW2ldWzFdPT09bnVsbCl7XG4gICAgICAgICAgICAgICAgICBhW2ldWzFdID0gXCJObyBjb21wYXJpc29uIHRvIGJlIG1hZGVcIjtcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgdmFyIGZpbmFsPSBhLnNvcnQoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYlsxXS1hWzFdfSk7XG4gICAgICB0aGF0LnNldFN0YXRlKHtcbiAgICAgICAgbXlGcmllbmRzOmZpbmFsXG4gICAgICB9KVxuICAgICAgY29uc29sZS5sb2coJ3RoZXMgYXJlIG15IGZyaWVuZHMhISEhISEhISEhISEhISEhIScsdGhhdC5zdGF0ZS5teUZyaWVuZHMpXG4gICAgfSlcbiAgfVxuXG4gIGFjY2VwdEZyaWVuZChhLCBtb3ZpZSkge1xuICAgIHZhciB0aGF0PXRoaXM7XG4gICAgdmFyIGZpbmFsPWE7XG4gICAgLy8gJCgnYnV0dG9uJykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKCQodGhpcykuaHRtbCgpKTtcbiAgICAvLyB9KVxuICAgIC8vIGNvbnNvbGUubG9nKGZpbmFsICsnc2hvdWxkIGJlIGFjY2VwdGVkLCBmb3IgbW92aWUuLi4uJywgbW92aWUpXG5cbiAgICAkLnBvc3QoVXJsICsgJy9hY2NlcHQnLHtwZXJzb25Ub0FjY2VwdDpmaW5hbCwgbW92aWU6IG1vdmllfSxmdW5jdGlvbihhLGIpIHtcbiAgICAgIHRoYXQubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpO1xuICAgIH0pXG4gICAgXG4gICAgY29uc29sZS5sb2coJ3JlZnJlc2hlZCBpbmJveCwgc2hvdWxkIGRlbGV0ZSBmcmllbmQgcmVxdWVzdCBvbiB0aGUgc3BvdCBpbnN0ZWFkIG9mIG1vdmluZycpXG4gIH1cblxuICBkZWNsaW5lRnJpZW5kKGEsIG1vdmllKSB7XG4gICAgdmFyIHRoYXQ9dGhpcztcbiAgICB2YXIgZmluYWw9YTtcblxuICAgICQucG9zdChVcmwgKyAnL2RlY2xpbmUnLHtwZXJzb25Ub0RlY2xpbmU6ZmluYWwsIG1vdmllOiBtb3ZpZX0sZnVuY3Rpb24oYSxiKSB7XG4gICAgICBjb25zb2xlLmxvZyhhLGIpXG4gICAgICBjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgc3RhdGUgYWZ0ZXIgZGVjbGluaW5nIGZyaWVuZCwgJywgdGhhdC5zdGF0ZSk7XG4gICAgICB0aGF0Lmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMoKTtcbiAgICB9KVxuICB9XG5cbiAgZmluZE1vdmllQnVkZGllcygpIHtcbiAgICB2YXIgdGhhdD10aGlzO1xuICAgICQucG9zdChVcmwgKyAnL2ZpbmRNb3ZpZUJ1ZGRpZXMnLHtkdW1teTonaW5mbyd9LGZ1bmN0aW9uKGEsYikge1xuICAgICAgdmFyIGZpbmFsPWEuc29ydChmdW5jdGlvbihhLGIpe3JldHVybiBiWzFdLWFbMV19KVxuICAgICAgdmFyIG15RnJpZW5kcz10aGF0LnN0YXRlLm15RnJpZW5kc1xuICAgICAgIHZhciByZWFsRmluYWw9W11cbiAgICAgICAgZm9yICh2YXIgaT0wO2k8ZmluYWwubGVuZ3RoO2krKyl7XG4gICAgICAgICAgdmFyIHVuaXF1ZT10cnVlXG4gICAgICAgICAgZm9yICh2YXIgeD0wO3g8bXlGcmllbmRzLmxlbmd0aDt4Kyspe1xuICAgICAgICAgICAgaWYgKGZpbmFsW2ldWzBdPT09bXlGcmllbmRzW3hdWzBdKXtcbiAgICAgICAgICAgICAgdW5pcXVlPWZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodW5pcXVlKXtcbiAgICAgICAgICAgIHJlYWxGaW5hbC5wdXNoKGZpbmFsW2ldKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cblxuICAgICAgdGhhdC5zZXRTdGF0ZSh7XG4gICAgICAgIHZpZXc6XCJGTk1CXCIsXG4gICAgICAgIHBvdGVudGlhbE1vdmllQnVkZGllczpyZWFsRmluYWxcbiAgICAgIH0pXG4gICAgICBjb25zb2xlLmxvZyh0aGF0LnN0YXRlLm15RnJpZW5kcyx0aGF0LnN0YXRlLnBvdGVudGlhbE1vdmllQnVkZGllcyk7XG5cbiAgICB9KVxuICB9XG5cbiAgY2hhbmdlVmlldygpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHZpZXc6XCJTaWduVXBcIiBcbiAgICB9KVxuICB9XG5cbiAgc2V0Q3VycmVudFVzZXIodXNlcm5hbWUpIHtcbiAgICBjb25zb2xlLmxvZygnY2FsbGluZyBzZXRDdXJyZW50VXNlcicpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY3VycmVudFVzZXI6IHVzZXJuYW1lXG4gICAgfSlcbiAgfVxuXG4gIGVudGVyTmV3VXNlcihuYW1lLHBhc3N3b3JkKSB7XG4gICAgY29uc29sZS5sb2cobmFtZSxwYXNzd29yZCk7XG4gICAgJC5wb3N0KFVybCArICcvc2lnbnVwJyx7bmFtZTpuYW1lLHBhc3N3b3JkOnBhc3N3b3JkfSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdzdWNjZXNzJyk7IFxuICAgICAgdGhpcy5zZXRTdGF0ZSh7dXNlcm5hbWU6IG5hbWV9KVxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKCkge2NvbnNvbGUubG9nKCdlcnJvcicpfSlcbiAgfVxuXG4gIGdldEZyaWVuZE1vdmllUmF0aW5ncygpIHtcbiAgICB2YXIgdGhhdD10aGlzO1xuICAgIGNvbnNvbGUubG9nKCdtb29vb292aWUnKTtcbiAgICB2YXIgbW92aWVOYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtb3ZpZVRvVmlld1wiKS52YWx1ZVxuICAgICQucG9zdChVcmwgKyAnL2dldEZyaWVuZFJhdGluZ3MnLCB7IG5hbWU6IG1vdmllTmFtZSB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cbiAgICAgIHRoYXQuc2V0U3RhdGUoe1xuICAgICAgdmlldzpcIkhvbWVcIixcbiAgICAgIGZyaWVuZHNSYXRpbmdzOnJlc3BvbnNlXG4gICAgfSlcbiAgICBjb25zb2xlLmxvZygnb3VyIHJlc3BvbnNlJyx0aGF0LnN0YXRlLmZyaWVuZHNSYXRpbmdzKVxuXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24oZXJyKSB7Y29uc29sZS5sb2coZXJyKX0pO1xuICB9XG5cbiAgbG9nb3V0KCkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAkLnBvc3QoVXJsICsgJy9sb2dvdXQnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICB0aGF0LnNldFN0YXRlKHtcbiAgICAgICAgdmlldzpcIkxvZ2luXCIsXG4gICAgICAgIGZyaWVuZHNSYXRpbmdzOltdXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHNlbmRXYXRjaFJlcXVlc3QoZnJpZW5kKSB7XG4gICAgdmFyIG1vdmllPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW92aWVUb1dhdGNoJykudmFsdWU7XG4gICAgdmFyIHRvU2VuZD17cmVxdWVzdGVlOmZyaWVuZCwgbW92aWU6bW92aWV9O1xuICAgIGlmIChtb3ZpZS5sZW5ndGg+MCkge1xuICAgICAgJC5wb3N0KFVybCArICcvc2VuZFdhdGNoUmVxdWVzdCcsIHRvU2VuZCAsZnVuY3Rpb24oYSxiKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGEsYik7XG4gICAgICB9KTtcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3ZpZVRvV2F0Y2gnKS52YWx1ZT0nJztcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3lvdSBuZWVkIHRvIGVudGVyIGEgbW92aWUgdG8gc2VuZCBhIHdhdGNoIHJlcXVlc3QhISEhJylcbiAgICB9XG4gIH1cblxuXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAvLy8vL21vdmllIHJlbmRlclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgLy9jYWxsIHNlYXJjaG1vdmllIGZ1bmN0aW9uXG4gIC8vd2hpY2ggZ2V0cyBwYXNzZWQgZG93biB0byB0aGUgTW92aWUgU2VhcmNoIFxuICBnZXRNb3ZpZShxdWVyeSkge1xuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgcXVlcnk6IHF1ZXJ5XG4gICAgfTtcbiAgICBcbiAgICB0aGlzLnByb3BzLnNlYXJjaE1vdmllKG9wdGlvbnMsIChtb3ZpZSkgPT4ge1xuICAgICAgY29uc29sZS5sb2cobW92aWUpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHZpZXc6XCJNb3ZpZVNlYXJjaFZpZXdcIixcbiAgICAgICAgbW92aWU6IG1vdmllXG4gICAgICB9KVxuICAgIH0pXG4gIH1cbiAgLy9zaG93IHRoZSBtb3ZpZSBzZWFyY2hlZCBpbiBmcmllbmQgbW92aWUgbGlzdFxuICAvL29udG8gdGhlIHN0YXRldmlldyBvZiBtb3ZpZXNlYXJjaHZpZXdcbiAgc2hvd01vdmllKG1vdmllKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBtb3ZpZTogbW92aWVcbiAgICB9KVxuICB9XG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAvLy8vL05hdiBjaGFuZ2VcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIGNoYW5nZVZpZXdzKHRhcmdldFN0YXRlKSB7XG4gICAgY29uc29sZS5sb2codGhpcy5zdGF0ZSk7XG4gICAgdmFyIHRoYXQ9dGhpcztcblxuICAgIGlmICh0YXJnZXRTdGF0ZT09PSdGcmllbmRzJyl7XG4gICAgICBjb25zb2xlLmxvZygneW91IHN3aXRjaGVkIHRvIGZyaWVuZHMhIScpXG4gICAgICB0aGlzLmdldEN1cnJlbnRGcmllbmRzKClcbiAgICAgIHRoaXMuc2VuZFJlcXVlc3QoKTtcblxuICAgICAgXG4gICAgfVxuXG4gICBcbiAgICBpZiAodGFyZ2V0U3RhdGU9PT0nSG9tZScpe1xuICAgICAgdGhpcy5nZXRDdXJyZW50RnJpZW5kcygpXG4gICAgICB0aGlzLnNlbmRSZXF1ZXN0KCk7XG4gICAgICBcbiAgICB9XG5cblxuXG4gICAgIGlmICh0YXJnZXRTdGF0ZT09PVwiSW5ib3hcIil7XG4gICAgICAgdGhpcy5saXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKClcbiAgICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB2aWV3OiB0YXJnZXRTdGF0ZVxuICAgIH0pO1xuICB9XG5cbiAgY2hhbmdlVmlld3NNb3ZpZSh0YXJnZXRTdGF0ZSwgbW92aWUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHZpZXc6IHRhcmdldFN0YXRlLFxuICAgICAgbW92aWU6IG1vdmllXG4gICAgfSk7XG4gIH1cblxuICBjaGFuZ2VWaWV3c0ZyaWVuZHModGFyZ2V0U3RhdGUsIGZyaWVuZCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdmlldzogdGFyZ2V0U3RhdGUsXG4gICAgICBmcmllbmRUb0ZvY3VzT246IGZyaWVuZFxuICAgIH0pO1xuICB9XG5cblxuICBidWRkeVJlcXVlc3QoYSkge1xuICAgIHRoaXMuc2VuZFJlcXVlc3QoYSk7XG4gIH1cblxuXG4gIHNlbmRSZXF1ZXN0KGEpIHtcbmNvbnNvbGUubG9nKCdzZW5kIHJlcXVlc3QgaXMgYmVpbmcgcnVuISEnKVxuICAgIHZhciB0aGF0PXRoaXM7XG4gICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kRnJpZW5kQnlOYW1lJykhPT1udWxsKXtcbiAgICAgIHZhciBwZXJzb249ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbmRGcmllbmRCeU5hbWUnKS52YWx1ZVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcGVyc29uID0gYSB8fCAndGVzdCc7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCdwZXJzb246JyxwZXJzb24pXG4gICAgY29uc29sZS5sb2coJ3N0YXRlJywgdGhpcy5zdGF0ZSk7XG4gICAgY29uc29sZS5sb2coJ2xpbmUgMjQ4Jyx0aGlzLnN0YXRlLm15RnJpZW5kcylcbiAgICB2YXIgZnJpZW5kczE9W107XG4gICAgdmFyIGZyaWVuZHMyPVtdXG4gICAgZm9yICh2YXIgaT0wO2k8dGhpcy5zdGF0ZS5teUZyaWVuZHMubGVuZ3RoO2krKyl7XG4gICAgICBjb25zb2xlLmxvZygnbGluZSAyNTEnLHRoaXMuc3RhdGUubXlGcmllbmRzW2ldKVxuICAgICAgZnJpZW5kczEucHVzaCh0aGlzLnN0YXRlLm15RnJpZW5kc1tpXVswXSk7XG4gICAgICBmcmllbmRzMi5wdXNoKHRoaXMuc3RhdGUubXlGcmllbmRzW2ldWzBdKVxuICAgIH1cblxuICAgIGZvciAodmFyIGk9MDtpPHRoaXMuc3RhdGUucmVxdWVzdHNPZkN1cnJlbnRVc2VyLmxlbmd0aDtpKyspe1xuICAgICAgZnJpZW5kczEucHVzaCh0aGlzLnN0YXRlLnJlcXVlc3RzT2ZDdXJyZW50VXNlcltpXSlcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgYWxzbyBiZSBteSBmcmllbmRzJyx0aGlzLnN0YXRlLm15RnJpZW5kcyxmcmllbmRzMSxmcmllbmRzMilcblxuXG4gICAgdmFyIHBwbFlvdUNhbnRTZW5kVG89ZnJpZW5kczE7XG4gICAgY29uc29sZS5sb2coJ3RvZicsZnJpZW5kczEuaW5kZXhPZihwZXJzb24pIT09IC0xLCBmcmllbmRzMS5sZW5ndGghPT0wKVxuICAgIGlmIChmcmllbmRzMS5pbmRleE9mKHBlcnNvbikhPT0gLTEgJiYgZnJpZW5kczEubGVuZ3RoIT09MCl7XG4gICAgICAkKFwiI0FscmVhZHlSZXFcIikuZmFkZUluKDEwMDApO1xuICAgICAgJChcIiNBbHJlYWR5UmVxXCIpLmZhZGVPdXQoMTAwMCk7XG4gICAgICBjb25zb2xlLmxvZygndGhpcyBwZXJzb24gaXMgYWxyZWFkeSBpbiB0aGVyZSEhJylcbiAgICB9IGVsc2UgaWYgKHBlcnNvbi5sZW5ndGg9PT0wKSB7XG4gICAgICAkKFwiI2VudGVyUmVhbEZyaWVuZFwiKS5mYWRlSW4oMTAwMCk7XG4gICAgICAkKFwiI2VudGVyUmVhbEZyaWVuZFwiKS5mYWRlT3V0KDEwMDApO1xuICAgIH0gZWxzZSB7XG5cblxuICAgICAgJC5wb3N0KFVybCArICcvc2VuZFJlcXVlc3QnLHtuYW1lOnBlcnNvbn0sZnVuY3Rpb24oYSxiKSB7XG4gICAgICAgXG4gICAgICAgICAgdGhhdC5zZXRTdGF0ZSh7XG4gICAgICAgICAgICByZXF1ZXN0c09mQ3VycmVudFVzZXI6YS5jb25jYXQoW3BlcnNvbl0pXG4gICAgICAgICAgfSlcbiAgICAgICAgICBjb25zb2xlLmxvZygnbGluZSAyODEnLHRoYXQuc3RhdGUucmVxdWVzdHNPZkN1cnJlbnRVc2VyKTtcblxuICAgICAgICAkKFwiI3JlcVNlbnRcIikuZmFkZUluKDEwMDApO1xuICAgICAgICAkKFwiI3JlcVNlbnRcIikuZmFkZU91dCgxMDAwKTtcbiAgICAgIH0pO1xuICAgICAgaWYgKCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmluZEZyaWVuZEJ5TmFtZScpIT09bnVsbCl7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaW5kRnJpZW5kQnlOYW1lJykudmFsdWUgPSAnJztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBsaXN0UGVuZGluZ0ZyaWVuZFJlcXVlc3RzKCkge1xuICAgIHZhciB0aGF0PXRoaXM7XG4gICAgY29uc29sZS5sb2coJ3RoaXMgc2hvdWxkIGxpc3QgZnJpZW5kIHJlcXMnKVxuICAgICQucG9zdChVcmwgKyAnL2xpc3RSZXF1ZXN0cycsZnVuY3Rpb24ocmVzcG9uc2UsZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdSZXNwb25zZSBJIGdldCEhISEhISEnLHJlc3BvbnNlKTtcbiAgICAgIHZhciB0b3A9W11cbiAgICAgIHZhciBib3R0b209W11cbiAgICAgIGNvbnNvbGUubG9nKCd0cicsIHJlc3BvbnNlKVxuICAgICAgZm9yICh2YXIgaT0wO2k8cmVzcG9uc2VbMF0ubGVuZ3RoO2krKyl7XG4gICAgICAgIGlmIChyZXNwb25zZVswXVtpXVsncmVxdWVzdG9yJ10hPT1yZXNwb25zZVsxXSAmJiByZXNwb25zZVswXVtpXVsncmVzcG9uc2UnXT09PW51bGwgKXtcbiAgICAgICAgICB0b3AucHVzaChyZXNwb25zZVswXVtpXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3BvbnNlWzBdW2ldWydyZXF1ZXN0b3InXT09PXJlc3BvbnNlWzFdICYmcmVzcG9uc2VbMF1baV1bJ3Jlc3BvbnNlJ10hPT1udWxsKXtcbiAgICAgICAgICBib3R0b20ucHVzaChyZXNwb25zZVswXVtpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhhdC5zZXRTdGF0ZSh7XG4gICAgICAgIHBlbmRpbmdGcmllbmRSZXF1ZXN0czp0b3AsXG4gICAgICAgIHJlcXVlc3RSZXNwb25zZXM6Ym90dG9tXG4gICAgICB9KVxuICAgIH0pO1xuICB9O1xuXG4gIGZvY3VzT25GcmllbmQoZnJpZW5kKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICQoJy5mcmllbmRFbnRyeUluZGl2aWR1YWwnKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHZhciBmcmllbmROYW1lID0gJCh0aGlzKS5odG1sKCk7XG5cbiAgICAgIHRoYXQuc2V0U3RhdGUoe1xuICAgICAgICB2aWV3OidzaW5nbGVGcmllbmQnLFxuICAgICAgICBmcmllbmRUb0ZvY3VzT246IGZyaWVuZFxuICAgICAgfSk7XG5cbiAgICAgICQuZ2V0KFVybCArICcvZ2V0RnJpZW5kVXNlclJhdGluZ3MnLHtmcmllbmROYW1lOiBmcmllbmR9LGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGZyaWVuZClcbiAgICAgICAgY29uc29sZS5sb2coJ2dldHRpbmcgZnJpZW5kIG1vdmllczonLCByZXNwb25zZSk7XG4gICAgICAgIHRoYXQuc2V0U3RhdGUoe1xuICAgICAgICAgIGluZGl2aWR1YWxGcmllbmRzTW92aWVzOiByZXNwb25zZVxuICAgICAgICB9KTtcblxuICAgICAgfSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gIH1cblxuICBsaXN0UG90ZW50aWFscygpIHtcbiAgICBjb25zb2xlLmxvZygndGhpcyBzaG91bGQgbGlzdCBwb3RlbnRpYWwgZnJpZW5kcycpXG4gIH1cblxuICByZW1vdmVSZXF1ZXN0KHBlcnNvbiwgc2VsZiwgbW92aWUpIHtcbiAgICB2YXIgdGhhdD0gdGhpcztcbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiBVcmwgKyAnL3JlbW92ZVJlcXVlc3QnLFxuICAgICAgdHlwZTogJ0RFTEVURScsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHJlcXVlc3Rvcjogc2VsZixcbiAgICAgICAgcmVxdWVzdGVlOiBwZXJzb24sXG4gICAgICAgIG1vdmllOiBtb3ZpZVxuICAgICAgfSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdSRVFVRVNUIFJFTU9WRUQhIE1vdmllIGlzOiAnLCBtb3ZpZSk7XG4gICAgICAgIHRoYXQubGlzdFBlbmRpbmdGcmllbmRSZXF1ZXN0cygpO1xuICAgICAgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUudmlldz09PSdMb2dpbicpIHtcbiAgICAgIHJldHVybiAoPExvZ0luIGNoYW5nZVZpZXdzPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9IHNldEN1cnJlbnRVc2VyPXt0aGlzLnNldEN1cnJlbnRVc2VyLmJpbmQodGhpcyl9Lz4pO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3PT09XCJTaWduVXBcIikge1xuICAgICAgcmV0dXJuICg8U2lnblVwIGNoYW5nZVZpZXdzPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9IHNldEN1cnJlbnRVc2VyPXt0aGlzLnNldEN1cnJlbnRVc2VyLmJpbmQodGhpcyl9Lz4pO1xuICAgIH0gXG4gICAgLy90aGlzIHZpZXcgaXMgYWRkZWQgZm9yIG1vdmllc2VhcmNoIHJlbmRlcmluZ1xuICAgIGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJNb3ZpZVNlYXJjaFZpZXdcIikge1xuICAgICAgcmV0dXJuICggXG4gICAgICAgIDxkaXY+IFxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICA8TmF2IG5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFVzZXJ9XG4gICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX0gXG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgPE1vdmllUmF0aW5nIFxuICAgICAgICAgICAgaGFuZGxlU2VhcmNoTW92aWU9e3RoaXMuZ2V0TW92aWUuYmluZCh0aGlzKX0gXG4gICAgICAgICAgICBtb3ZpZT17dGhpcy5zdGF0ZS5tb3ZpZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJJbmJveFwiICkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICBIb21lPXt0cnVlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxJbmJveCBcbiAgICAgICAgICAgICAgcmVxdWVzdHM9e3RoaXMuc3RhdGUucGVuZGluZ0ZyaWVuZFJlcXVlc3RzfVxuICAgICAgICAgICAgICByZXNwb25zZXNBbnN3ZXJlZD17dGhpcy5zdGF0ZS5yZXF1ZXN0UmVzcG9uc2VzfVxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9ICBcbiAgICAgICAgICAgICAgYWNjZXB0PSB7dGhpcy5hY2NlcHRGcmllbmQuYmluZCh0aGlzKX0gXG4gICAgICAgICAgICAgIGRlY2xpbmU9e3RoaXMuZGVjbGluZUZyaWVuZC5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgICAgbGlzdFJlcXVlc3RzPXt0aGlzLmxpc3RQZW5kaW5nRnJpZW5kUmVxdWVzdHMuYmluZCh0aGlzKX0gXG4gICAgICAgICAgICAgIHBwbFdob1dhbnRUb0JlRnJpZW5kcz17dGhpcy5zdGF0ZS5wZW5kaW5nRnJpZW5kUmVxdWVzdHMubWFwKFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uKGEpe3JldHVybiBbYS5yZXF1ZXN0b3IsYS5yZXF1ZXN0VHlwLGEubW92aWU9PT1udWxsP1wiXCI6IGEubW92aWUsXCJNZXNzYWdlOlwiKyBhLm1lc3NhZ2U9PT0nbnVsbCc/XCJub25lXCI6YS5tZXNzYWdlXX0pfSBcbiAgICAgICAgICAgICAgcmVtb3ZlPXt0aGlzLnJlbW92ZVJlcXVlc3QuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJGcmllbmRzXCIgKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxuICAgICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICBsb2dvdXQ9e3RoaXMubG9nb3V0LmJpbmQodGhpcyl9Lz5cbiAgICAgICAgICA8RnJpZW5kcyBcbiAgICAgICAgICAgIHNlbmRXYXRjaFJlcXVlc3Q9e3RoaXMuc2VuZFdhdGNoUmVxdWVzdC5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgIGZvZj0ge3RoaXMuZm9jdXNPbkZyaWVuZC5iaW5kKHRoaXMpfSBcbiAgICAgICAgICAgIGdldEZyaWVuZHM9e3RoaXMuZ2V0Q3VycmVudEZyaWVuZHMuYmluZCh0aGlzKX0gXG4gICAgICAgICAgICBteUZyaWVuZHM9e3RoaXMuc3RhdGUubXlGcmllbmRzfSBcbiAgICAgICAgICAgIGxpc3RQb3RlbnRpYWxzPXt0aGlzLmxpc3RQb3RlbnRpYWxzLmJpbmQodGhpcyl9IFxuICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfSAgXG4gICAgICAgICAgICBzZW5kUmVxdWVzdD17dGhpcy5zZW5kUmVxdWVzdC5iaW5kKHRoaXMpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodGhpcy5zdGF0ZS52aWV3ID09PSBcIkhvbWVcIikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyl9IFxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPEhvbWUgXG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NNb3ZpZS5iaW5kKHRoaXMpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJTaW5nbGVNb3ZpZVwiKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPFNpbmdsZU1vdmllUmF0aW5nIFxuICAgICAgICAgICAgY29tcGF0aWJpbGl0eT17dGhpcy5zdGF0ZS5teUZyaWVuZHN9XG4gICAgICAgICAgICBjdXJyZW50TW92aWU9e3RoaXMuc3RhdGUubW92aWV9XG4gICAgICAgICAgICBjaGFuZ2U9e3RoaXMuY2hhbmdlVmlld3NGcmllbmRzLmJpbmQodGhpcyl9XG4gICAgICAgICAgICBmb2Y9e3RoaXMuZm9jdXNPbkZyaWVuZC5iaW5kKHRoaXMpfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldz09PSdzaW5nbGVGcmllbmQnKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxuICAgICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKX0gXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8U2luZ2xlRnJpZW5kIFxuICAgICAgICAgICAgbW92aWVzT2ZGcmllbmQ9e3RoaXMuc3RhdGUuaW5kaXZpZHVhbEZyaWVuZHNNb3ZpZXN9IFxuICAgICAgICAgICAgZnJpZW5kTmFtZT17dGhpcy5zdGF0ZS5mcmllbmRUb0ZvY3VzT259IFxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5jaGFuZ2VWaWV3cy5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgY2hhbmdlPXt0aGlzLmNoYW5nZVZpZXdzTW92aWUuYmluZCh0aGlzKX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnZpZXcgPT09IFwiRk5NQlwiKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPE5hdiBuYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRVc2VyfVxuICAgICAgICAgICAgICBmaW5kPXt0aGlzLmZpbmRNb3ZpZUJ1ZGRpZXMuYmluZCh0aGlzKX0gXG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuY2hhbmdlVmlld3MuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgbG9nb3V0PXt0aGlzLmxvZ291dC5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8RmluZE1vdmllQnVkZHkgXG4gICAgICAgICAgICBidWRkeWZ1bmM9e3RoaXMuYnVkZHlSZXF1ZXN0LmJpbmQodGhpcyl9IFxuICAgICAgICAgICAgYnVkZGllcz17dGhpcy5zdGF0ZS5wb3RlbnRpYWxNb3ZpZUJ1ZGRpZXN9IFxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudmlldyA9PT0gXCJNeVJhdGluZ3NcIikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIDxOYXYgbmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VXNlcn1cbiAgICAgICAgICAgICAgZmluZD17dGhpcy5maW5kTW92aWVCdWRkaWVzLmJpbmQodGhpcyl9IFxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmNoYW5nZVZpZXdzLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIGxvZ291dD17dGhpcy5sb2dvdXQuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPE15UmF0aW5ncyBcbiAgICAgICAgICAgIGNoYW5nZT17dGhpcy5jaGFuZ2VWaWV3c01vdmllLmJpbmQodGhpcyl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuXG53aW5kb3cuQXBwID0gQXBwO1xuLy8gdmFyIFVybCA9ICdodHRwczovL3RoYXdpbmctaXNsYW5kLTk5NzQ3Lmhlcm9rdWFwcC5jb20nO1xudmFyIFVybCA9ICdodHRwOi8vMTI3LjAuMC4xOjMwMDAnO1xud2luZG93LlVybCA9IFVybDtcbiJdfQ==
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SingleMovieRating = function (_React$Component) {
  _inherits(SingleMovieRating, _React$Component);

  function SingleMovieRating(props) {
    _classCallCheck(this, SingleMovieRating);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SingleMovieRating).call(this, props));

    _this.state = {
      value: '',
      movie: props.currentMovie,
      view: 'SingleMovie',
      friendRatings: []
    };
    return _this;
  }

  _createClass(SingleMovieRating, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      //movie will have been successfully passed
      //into singlemovierating
      //note need to change app state movie
      //when other things are clicked later on
      // this.getFriends();
      this.getFriendsRating(this.state.movie);
      // $.get('http://127.0.0.1:3000/getFriends', {name: this.state.mainUser})
      //   .then(function(data) {
      //     console.log(data);
      //   })
      //   .catch(function(err) {
      //     console.log(err);
      //   });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps() {
      this.setState({
        movie: this.props.movie
      });
    }
  }, {
    key: 'onStarClick',
    value: function onStarClick(event) {
      this.setState({ userRating: event.target.value });
      this.updateRating(event.target.value);
    }
  }, {
    key: 'getFriends',
    value: function getFriends() {
      var that = this;
      $.post('http://127.0.0.1:3000/getFriends').then(function (resp) {
        console.log(that.state.friends);
      }).catch(function (err) {
        console.log(err);
      });
    }

    //get friend ratings by calling requesthandler
    //get friendratings, passing in mainUser and movieobj

  }, {
    key: 'getFriendsRating',
    value: function getFriendsRating(inputMovie) {
      var that = this;
      $.post('http://127.0.0.1:3000/getFriendRatings', { movie: inputMovie }).then(function (response) {
        console.log(response);
        that.setState({
          friendRatings: response
        });
      }).catch(function (err) {
        console.log(err);
      });
      // console.log('this is the movie', inputMovie);
    }
  }, {
    key: 'render',
    value: function render() {
      var that = this;
      var movie = this.state.movie;
      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'singleMovie' },
          React.createElement('img', { className: 'moviethumbnail', src: movie.poster }),
          React.createElement(
            'h1',
            { className: 'movieTitle' },
            movie.title
          ),
          React.createElement(
            'p',
            { className: 'movieYear' },
            movie.release_date
          ),
          React.createElement(
            'p',
            { className: 'movieDescription' },
            movie.description
          ),
          React.createElement(
            'p',
            { className: 'imdbRating' },
            'IMDB rating: ',
            movie.imdbRating
          ),
          React.createElement(
            'div',
            { className: 'watchRequestButton' },
            'send watch request'
          ),
          React.createElement(
            'div',
            { className: 'userRating' },
            this.state.userRating === null ? 'you have not rated this movie' : 'your rating is ' + this.state.userRating,
            React.createElement(StarRatingComponent, { onStarClick: this.onStarClick.bind(this) })
          ),
          React.createElement(
            'div',
            { className: 'avgFriendRatingBlock' },
            'average friend rating: ',
            movie.friendAverageRating ? movie.friendAverageRating : 'no friend ratings'
          )
        ),
        React.createElement(
          'div',
          null,
          this.state.friendRatings.map(function (friendRating) {
            return React.createElement(SingleMovieRatingEntry, {
              rating: friendRating,
              change: that.props.change,
              fof: that.props.fof
            });
          })
        )
      );
    }
  }]);

  return SingleMovieRating;
}(React.Component);

;

window.SingleMovieRating = SingleMovieRating;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9TaW5nbGVNb3ZpZVJhdGluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0saUI7OztBQUNKLDZCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxxR0FDWCxLQURXOztBQUVqQixVQUFLLEtBQUwsR0FBYTtBQUNYLGFBQU8sRUFESTtBQUVYLGFBQU8sTUFBTSxZQUZGO0FBR1gsWUFBTSxhQUhLO0FBSVgscUJBQWU7QUFKSixLQUFiO0FBRmlCO0FBUWxCOzs7O3dDQUVtQjs7Ozs7O0FBTWxCLFdBQUssZ0JBQUwsQ0FBc0IsS0FBSyxLQUFMLENBQVcsS0FBakM7Ozs7Ozs7O0FBUUQ7OztnREFFMkI7QUFDMUIsV0FBSyxRQUFMLENBQWM7QUFDWixlQUFPLEtBQUssS0FBTCxDQUFXO0FBRE4sT0FBZDtBQUdEOzs7Z0NBRVcsSyxFQUFPO0FBQ2pCLFdBQUssUUFBTCxDQUFjLEVBQUMsWUFBWSxNQUFNLE1BQU4sQ0FBYSxLQUExQixFQUFkO0FBQ0EsV0FBSyxZQUFMLENBQWtCLE1BQU0sTUFBTixDQUFhLEtBQS9CO0FBQ0Q7OztpQ0FFWTtBQUNYLFVBQUksT0FBTyxJQUFYO0FBQ0EsUUFBRSxJQUFGLENBQU8sa0NBQVAsRUFDRyxJQURILENBQ1EsVUFBUyxJQUFULEVBQWU7QUFDbkIsZ0JBQVEsR0FBUixDQUFZLEtBQUssS0FBTCxDQUFXLE9BQXZCO0FBQ0QsT0FISCxFQUlHLEtBSkgsQ0FJUyxVQUFTLEdBQVQsRUFBYztBQUNuQixnQkFBUSxHQUFSLENBQVksR0FBWjtBQUNELE9BTkg7QUFPRDs7Ozs7OztxQ0FJZ0IsVSxFQUFZO0FBQzNCLFVBQUksT0FBTyxJQUFYO0FBQ0EsUUFBRSxJQUFGLENBQU8sd0NBQVAsRUFDRSxFQUFDLE9BQU8sVUFBUixFQURGLEVBRUcsSUFGSCxDQUVRLFVBQVMsUUFBVCxFQUFtQjtBQUN2QixnQkFBUSxHQUFSLENBQVksUUFBWjtBQUNBLGFBQUssUUFBTCxDQUFjO0FBQ1oseUJBQWU7QUFESCxTQUFkO0FBR0QsT0FQSCxFQVFHLEtBUkgsQ0FRUyxVQUFTLEdBQVQsRUFBYztBQUNuQixnQkFBUSxHQUFSLENBQVksR0FBWjtBQUNELE9BVkg7O0FBWUQ7Ozs2QkFFUTtBQUNQLFVBQUksT0FBTyxJQUFYO0FBQ0EsVUFBSSxRQUFRLEtBQUssS0FBTCxDQUFXLEtBQXZCO0FBQ0EsYUFDRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLGFBQWY7QUFDRSx1Q0FBSyxXQUFVLGdCQUFmLEVBQWdDLEtBQUssTUFBTSxNQUEzQyxHQURGO0FBRUU7QUFBQTtBQUFBLGNBQUksV0FBVSxZQUFkO0FBQTRCLGtCQUFNO0FBQWxDLFdBRkY7QUFHRTtBQUFBO0FBQUEsY0FBRyxXQUFVLFdBQWI7QUFBMEIsa0JBQU07QUFBaEMsV0FIRjtBQUlFO0FBQUE7QUFBQSxjQUFHLFdBQVUsa0JBQWI7QUFBaUMsa0JBQU07QUFBdkMsV0FKRjtBQUtFO0FBQUE7QUFBQSxjQUFHLFdBQVUsWUFBYjtBQUFBO0FBQXdDLGtCQUFNO0FBQTlDLFdBTEY7QUFNRTtBQUFBO0FBQUEsY0FBSyxXQUFVLG9CQUFmO0FBQUE7QUFBQSxXQU5GO0FBT0U7QUFBQTtBQUFBLGNBQUssV0FBVSxZQUFmO0FBQThCLGlCQUFLLEtBQUwsQ0FBVyxVQUFYLEtBQTBCLElBQTNCLEdBQW1DLCtCQUFuQyxHQUFxRSxvQkFBb0IsS0FBSyxLQUFMLENBQVcsVUFBakk7QUFDQSxnQ0FBQyxtQkFBRCxJQUFxQixhQUFhLEtBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixJQUF0QixDQUFsQztBQURBLFdBUEY7QUFVRTtBQUFBO0FBQUEsY0FBSyxXQUFVLHNCQUFmO0FBQUE7QUFBK0Qsa0JBQU0sbUJBQVAsR0FBOEIsTUFBTSxtQkFBcEMsR0FBMEQ7QUFBeEg7QUFWRixTQURGO0FBYUU7QUFBQTtBQUFBO0FBQ0csZUFBSyxLQUFMLENBQVcsYUFBWCxDQUF5QixHQUF6QixDQUE2QjtBQUFBLG1CQUM1QixvQkFBQyxzQkFBRDtBQUNBLHNCQUFRLFlBRFI7QUFFQSxzQkFBUSxLQUFLLEtBQUwsQ0FBVyxNQUZuQjtBQUdBLG1CQUFLLEtBQUssS0FBTCxDQUFXO0FBSGhCLGNBRDRCO0FBQUEsV0FBN0I7QUFESDtBQWJGLE9BREY7QUF5QkQ7Ozs7RUEvRjZCLE1BQU0sUzs7QUFnR3JDOztBQUVELE9BQU8saUJBQVAsR0FBMkIsaUJBQTNCIiwiZmlsZSI6IlNpbmdsZU1vdmllUmF0aW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgU2luZ2xlTW92aWVSYXRpbmcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgdmFsdWU6ICcnLFxuICAgICAgbW92aWU6IHByb3BzLmN1cnJlbnRNb3ZpZSxcbiAgICAgIHZpZXc6ICdTaW5nbGVNb3ZpZScsXG4gICAgICBmcmllbmRSYXRpbmdzOiBbXVxuICAgIH07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICAvL21vdmllIHdpbGwgaGF2ZSBiZWVuIHN1Y2Nlc3NmdWxseSBwYXNzZWRcbiAgICAvL2ludG8gc2luZ2xlbW92aWVyYXRpbmcgXG4gICAgLy9ub3RlIG5lZWQgdG8gY2hhbmdlIGFwcCBzdGF0ZSBtb3ZpZVxuICAgIC8vd2hlbiBvdGhlciB0aGluZ3MgYXJlIGNsaWNrZWQgbGF0ZXIgb25cbiAgICAvLyB0aGlzLmdldEZyaWVuZHMoKTtcbiAgICB0aGlzLmdldEZyaWVuZHNSYXRpbmcodGhpcy5zdGF0ZS5tb3ZpZSk7XG4gICAgLy8gJC5nZXQoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9nZXRGcmllbmRzJywge25hbWU6IHRoaXMuc3RhdGUubWFpblVzZXJ9KVxuICAgIC8vICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgIC8vICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAvLyAgIH0pXG4gICAgLy8gICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgLy8gICB9KTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBtb3ZpZTogdGhpcy5wcm9wcy5tb3ZpZVxuICAgIH0pO1xuICB9XG5cbiAgb25TdGFyQ2xpY2soZXZlbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHt1c2VyUmF0aW5nOiBldmVudC50YXJnZXQudmFsdWV9KTtcbiAgICB0aGlzLnVwZGF0ZVJhdGluZyhldmVudC50YXJnZXQudmFsdWUpO1xuICB9XG5cbiAgZ2V0RnJpZW5kcygpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgJC5wb3N0KCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvZ2V0RnJpZW5kcycpXG4gICAgICAudGhlbihmdW5jdGlvbihyZXNwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoYXQuc3RhdGUuZnJpZW5kcylcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8vZ2V0IGZyaWVuZCByYXRpbmdzIGJ5IGNhbGxpbmcgcmVxdWVzdGhhbmRsZXJcbiAgLy9nZXQgZnJpZW5kcmF0aW5ncywgcGFzc2luZyBpbiBtYWluVXNlciBhbmQgbW92aWVvYmpcbiAgZ2V0RnJpZW5kc1JhdGluZyhpbnB1dE1vdmllKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICQucG9zdCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL2dldEZyaWVuZFJhdGluZ3MnLCBcbiAgICAgIHttb3ZpZTogaW5wdXRNb3ZpZX0pXG4gICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgIHRoYXQuc2V0U3RhdGUoe1xuICAgICAgICAgIGZyaWVuZFJhdGluZ3M6IHJlc3BvbnNlXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpXG4gICAgICB9KTtcbiAgICAvLyBjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgbW92aWUnLCBpbnB1dE1vdmllKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgbGV0IG1vdmllID0gdGhpcy5zdGF0ZS5tb3ZpZTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzaW5nbGVNb3ZpZVwiPlxuICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPSdtb3ZpZXRodW1ibmFpbCcgc3JjPXttb3ZpZS5wb3N0ZXJ9IC8+XG4gICAgICAgICAgPGgxIGNsYXNzTmFtZT0nbW92aWVUaXRsZSc+e21vdmllLnRpdGxlfTwvaDE+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPSdtb3ZpZVllYXInPnttb3ZpZS5yZWxlYXNlX2RhdGV9PC9wPlxuICAgICAgICAgIDxwIGNsYXNzTmFtZT0nbW92aWVEZXNjcmlwdGlvbic+e21vdmllLmRlc2NyaXB0aW9ufTwvcD5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9J2ltZGJSYXRpbmcnPklNREIgcmF0aW5nOiB7bW92aWUuaW1kYlJhdGluZ308L3A+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3dhdGNoUmVxdWVzdEJ1dHRvbic+c2VuZCB3YXRjaCByZXF1ZXN0PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3VzZXJSYXRpbmcnPnsodGhpcy5zdGF0ZS51c2VyUmF0aW5nID09PSBudWxsKSA/ICd5b3UgaGF2ZSBub3QgcmF0ZWQgdGhpcyBtb3ZpZScgOiAneW91ciByYXRpbmcgaXMgJyArIHRoaXMuc3RhdGUudXNlclJhdGluZ31cbiAgICAgICAgICA8U3RhclJhdGluZ0NvbXBvbmVudCBvblN0YXJDbGljaz17dGhpcy5vblN0YXJDbGljay5iaW5kKHRoaXMpfS8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2F2Z0ZyaWVuZFJhdGluZ0Jsb2NrJz5hdmVyYWdlIGZyaWVuZCByYXRpbmc6IHsobW92aWUuZnJpZW5kQXZlcmFnZVJhdGluZykgPyBtb3ZpZS5mcmllbmRBdmVyYWdlUmF0aW5nIDogJ25vIGZyaWVuZCByYXRpbmdzJyB9PC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIHt0aGlzLnN0YXRlLmZyaWVuZFJhdGluZ3MubWFwKGZyaWVuZFJhdGluZyA9PiBcbiAgICAgICAgICAgIDxTaW5nbGVNb3ZpZVJhdGluZ0VudHJ5IFxuICAgICAgICAgICAgcmF0aW5nPXtmcmllbmRSYXRpbmd9XG4gICAgICAgICAgICBjaGFuZ2U9e3RoYXQucHJvcHMuY2hhbmdlfVxuICAgICAgICAgICAgZm9mPXt0aGF0LnByb3BzLmZvZn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn07XG5cbndpbmRvdy5TaW5nbGVNb3ZpZVJhdGluZyA9IFNpbmdsZU1vdmllUmF0aW5nOyJdfQ==
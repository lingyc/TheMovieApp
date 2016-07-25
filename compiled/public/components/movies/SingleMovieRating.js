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
      movie: _this.props.currentMovie,
      view: 'SingleMovie',
      friendRatings: []
    };
    return _this;
  }

  _createClass(SingleMovieRating, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.getFriendsRating(this.state.movie);
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
      $.post(Url + '/getFriends').then(function (resp) {
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
      $.post(Url + '/getFriendRatings', { movie: inputMovie }).then(function (response) {
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
      var _this2 = this;

      var that = this;
      var movie = this.state.movie;
      return React.createElement(
        'div',
        { className: 'Home collection' },
        React.createElement(
          'div',
          { className: 'movieEntry collection-item row' },
          React.createElement('img', { className: 'moviethumnail col s3', src: movie.poster, onClick: function onClick() {
              return _this2.props.change("SingleMovie", movie);
            } }),
          React.createElement(
            'div',
            { className: 'right col s9' },
            React.createElement(
              'h5',
              { className: 'movieTitle', onClick: function onClick() {
                  return _this2.props.change("SingleMovie", movie);
                } },
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
            React.createElement(ReviewComponent, {
              review: movie.review,
              title: movie.title,
              id: movie.id }),
            React.createElement(MovieWatchRequest, { movie: movie }),
            React.createElement(
              'div',
              { className: 'ratings row' },
              React.createElement(
                'div',
                { className: 'imdbRating col s4' },
                'IMDB rating: ',
                React.createElement(
                  'b',
                  null,
                  movie.imdbRating
                )
              ),
              React.createElement(StarRatingComponent, { movie: movie }),
              React.createElement(
                'div',
                { className: 'avgFriendRatingBlock col s4' },
                'average friend rating: ',
                movie.friendAverageRating ? React.createElement(
                  'b',
                  null,
                  movie.friendAverageRating
                ) : 'n/a'
              )
            )
          )
        ),
        React.createElement(
          'div',
          { className: 'singleMovie' },
          React.createElement('img', { className: 'moviethumnail', src: movie.poster }),
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
          React.createElement(ReviewComponent, {
            review: movie.review,
            title: movie.title,
            id: movie.id }),
          React.createElement(
            'p',
            { className: 'imdbRating' },
            'IMDB rating: ',
            movie.imdbRating
          ),
          React.createElement(MovieWatchRequest, { movie: movie }),
          React.createElement(StarRatingComponent, { movie: movie }),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9TaW5nbGVNb3ZpZVJhdGluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0saUI7OztBQUNKLDZCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxxR0FDWCxLQURXOztBQUVqQixVQUFLLEtBQUwsR0FBYTtBQUNYLGFBQU8sRUFESTtBQUVYLGFBQU8sTUFBSyxLQUFMLENBQVcsWUFGUDtBQUdYLFlBQU0sYUFISztBQUlYLHFCQUFlO0FBSkosS0FBYjtBQUZpQjtBQVFsQjs7Ozt3Q0FFbUI7QUFDbEIsV0FBSyxnQkFBTCxDQUFzQixLQUFLLEtBQUwsQ0FBVyxLQUFqQztBQUVEOzs7Z0RBRTJCO0FBQzFCLFdBQUssUUFBTCxDQUFjO0FBQ1osZUFBTyxLQUFLLEtBQUwsQ0FBVztBQUROLE9BQWQ7QUFHRDs7O2dDQUVXLEssRUFBTztBQUNqQixXQUFLLFFBQUwsQ0FBYyxFQUFDLFlBQVksTUFBTSxNQUFOLENBQWEsS0FBMUIsRUFBZDtBQUNBLFdBQUssWUFBTCxDQUFrQixNQUFNLE1BQU4sQ0FBYSxLQUEvQjtBQUNEOzs7aUNBRVk7QUFDWCxVQUFJLE9BQU8sSUFBWDtBQUNBLFFBQUUsSUFBRixDQUFPLE1BQU0sYUFBYixFQUNHLElBREgsQ0FDUSxVQUFTLElBQVQsRUFBZTtBQUNuQixnQkFBUSxHQUFSLENBQVksS0FBSyxLQUFMLENBQVcsT0FBdkI7QUFDRCxPQUhILEVBSUcsS0FKSCxDQUlTLFVBQVMsR0FBVCxFQUFjO0FBQ25CLGdCQUFRLEdBQVIsQ0FBWSxHQUFaO0FBQ0QsT0FOSDtBQU9EOztBQUVEO0FBQ0E7Ozs7cUNBQ2lCLFUsRUFBWTtBQUMzQixVQUFJLE9BQU8sSUFBWDtBQUNBLFFBQUUsSUFBRixDQUFPLE1BQU0sbUJBQWIsRUFDRSxFQUFDLE9BQU8sVUFBUixFQURGLEVBRUcsSUFGSCxDQUVRLFVBQVMsUUFBVCxFQUFtQjtBQUN2QixnQkFBUSxHQUFS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LGNBRDRCO0FBQUEsV0FBN0I7QUFESDtBQWxDRixPQURGO0FBOENEOzs7O0VBekc2QixNQUFNLFM7O0FBMEdyQzs7QUFFRCxPQUFPLGlCQUFQLEdBQTJCLGlCQUEzQiIsImZpbGUiOiJTaW5nbGVNb3ZpZVJhdGluZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFNpbmdsZU1vdmllUmF0aW5nIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHZhbHVlOiAnJyxcbiAgICAgIG1vdmllOiB0aGlzLnByb3BzLmN1cnJlbnRNb3ZpZSxcbiAgICAgIHZpZXc6ICdTaW5nbGVNb3ZpZScsXG4gICAgICBmcmllbmRSYXRpbmdzOiBbXVxuICAgIH07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLmdldEZyaWVuZHNSYXRpbmcodGhpcy5zdGF0ZS5tb3ZpZSk7XG5cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBtb3ZpZTogdGhpcy5wcm9wcy5tb3ZpZVxuICAgIH0pO1xuICB9XG5cbiAgb25TdGFyQ2xpY2soZXZlbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHt1c2VyUmF0aW5nOiBldmVudC50YXJnZXQudmFsdWV9KTtcbiAgICB0aGlzLnVwZGF0ZVJhdGluZyhldmVudC50YXJnZXQudmFsdWUpO1xuICB9XG5cbiAgZ2V0RnJpZW5kcygpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgJC5wb3N0KFVybCArICcvZ2V0RnJpZW5kcycpXG4gICAgICAudGhlbihmdW5jdGlvbihyZXNwKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKHRoYXQuc3RhdGUuZnJpZW5kcylcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8vZ2V0IGZyaWVuZCByYXRpbmdzIGJ5IGNhbGxpbmcgcmVxdWVzdGhhbmRsZXJcbiAgLy9nZXQgZnJpZW5kcmF0aW5ncywgcGFzc2luZyBpbiBtYWluVXNlciBhbmQgbW92aWVvYmpcbiAgZ2V0RnJpZW5kc1JhdGluZyhpbnB1dE1vdmllKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICQucG9zdChVcmwgKyAnL2dldEZyaWVuZFJhdGluZ3MnLCBcbiAgICAgIHttb3ZpZTogaW5wdXRNb3ZpZX0pXG4gICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgIHRoYXQuc2V0U3RhdGUoe1xuICAgICAgICAgIGZyaWVuZFJhdGluZ3M6IHJlc3BvbnNlXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpXG4gICAgICB9KTtcbiAgICAvLyBjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgbW92aWUnLCBpbnB1dE1vdmllKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgbGV0IG1vdmllID0gdGhpcy5zdGF0ZS5tb3ZpZTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9J0hvbWUgY29sbGVjdGlvbic+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW92aWVFbnRyeSBjb2xsZWN0aW9uLWl0ZW0gcm93XCI+XG4gICAgICAgICAgPGltZyBjbGFzc05hbWU9J21vdmlldGh1bW5haWwgY29sIHMzJyBzcmM9e21vdmllLnBvc3Rlcn0gb25DbGljaz17KCkgPT4gKHRoaXMucHJvcHMuY2hhbmdlKFwiU2luZ2xlTW92aWVcIiwgbW92aWUpKX0vPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdyaWdodCBjb2wgczknPlxuICAgICAgICAgICAgPGg1IGNsYXNzTmFtZT0nbW92aWVUaXRsZScgb25DbGljaz17KCkgPT4gKHRoaXMucHJvcHMuY2hhbmdlKFwiU2luZ2xlTW92aWVcIiwgbW92aWUpKX0+e21vdmllLnRpdGxlfTwvaDU+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9J21vdmllWWVhcic+e21vdmllLnJlbGVhc2VfZGF0ZX08L3A+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9J21vdmllRGVzY3JpcHRpb24nPnttb3ZpZS5kZXNjcmlwdGlvbn08L3A+XG4gICAgICAgICAgICA8UmV2aWV3Q29tcG9uZW50IFxuICAgICAgICAgICAgICByZXZpZXc9e21vdmllLnJldmlld30gXG4gICAgICAgICAgICAgIHRpdGxlPXttb3ZpZS50aXRsZX1cbiAgICAgICAgICAgICAgaWQ9e21vdmllLmlkfS8+XG4gICAgICAgICAgICA8TW92aWVXYXRjaFJlcXVlc3QgbW92aWU9e21vdmllfS8+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmF0aW5ncyByb3dcIj5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ltZGJSYXRpbmcgY29sIHM0Jz5JTURCIHJhdGluZzogPGI+e21vdmllLmltZGJSYXRpbmd9PC9iPjwvZGl2PlxuICAgICAgICAgICAgICA8U3RhclJhdGluZ0NvbXBvbmVudCBtb3ZpZT17bW92aWV9Lz5cbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2F2Z0ZyaWVuZFJhdGluZ0Jsb2NrIGNvbCBzNCc+YXZlcmFnZSBmcmllbmQgcmF0aW5nOiB7KG1vdmllLmZyaWVuZEF2ZXJhZ2VSYXRpbmcpID8gPGI+e21vdmllLmZyaWVuZEF2ZXJhZ2VSYXRpbmd9PC9iPiA6ICduL2EnIH08L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzaW5nbGVNb3ZpZVwiPlxuICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPSdtb3ZpZXRodW1uYWlsJyBzcmM9e21vdmllLnBvc3Rlcn0gLz5cbiAgICAgICAgICA8aDEgY2xhc3NOYW1lPSdtb3ZpZVRpdGxlJyA+e21vdmllLnRpdGxlfTwvaDE+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPSdtb3ZpZVllYXInPnttb3ZpZS5yZWxlYXNlX2RhdGV9PC9wPlxuICAgICAgICAgIDxwIGNsYXNzTmFtZT0nbW92aWVEZXNjcmlwdGlvbic+e21vdmllLmRlc2NyaXB0aW9ufTwvcD5cbiAgICAgICAgICA8UmV2aWV3Q29tcG9uZW50IFxuICAgICAgICAgICAgcmV2aWV3PXttb3ZpZS5yZXZpZXd9IFxuICAgICAgICAgICAgdGl0bGU9e21vdmllLnRpdGxlfVxuICAgICAgICAgICAgaWQ9e21vdmllLmlkfS8+XG4gICAgICAgICAgPHAgY2xhc3NOYW1lPSdpbWRiUmF0aW5nJz5JTURCIHJhdGluZzoge21vdmllLmltZGJSYXRpbmd9PC9wPlxuICAgICAgICAgIDxNb3ZpZVdhdGNoUmVxdWVzdCBtb3ZpZT17bW92aWV9Lz5cbiAgICAgICAgICA8U3RhclJhdGluZ0NvbXBvbmVudCBtb3ZpZT17bW92aWV9Lz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nYXZnRnJpZW5kUmF0aW5nQmxvY2snPmF2ZXJhZ2UgZnJpZW5kIHJhdGluZzogeyhtb3ZpZS5mcmllbmRBdmVyYWdlUmF0aW5nKSA/IG1vdmllLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgOiAnbm8gZnJpZW5kIHJhdGluZ3MnIH08L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAge3RoaXMuc3RhdGUuZnJpZW5kUmF0aW5ncy5tYXAoZnJpZW5kUmF0aW5nID0+IFxuICAgICAgICAgICAgPFNpbmdsZU1vdmllUmF0aW5nRW50cnkgXG4gICAgICAgICAgICByYXRpbmc9e2ZyaWVuZFJhdGluZ31cbiAgICAgICAgICAgIGNoYW5nZT17dGhhdC5wcm9wcy5jaGFuZ2V9XG4gICAgICAgICAgICBmb2Y9e3RoYXQucHJvcHMuZm9mfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufTtcblxud2luZG93LlNpbmdsZU1vdmllUmF0aW5nID0gU2luZ2xlTW92aWVSYXRpbmc7Il19
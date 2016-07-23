'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MovieListEntry = function (_React$Component) {
  _inherits(MovieListEntry, _React$Component);

  function MovieListEntry(props) {
    _classCallCheck(this, MovieListEntry);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MovieListEntry).call(this, props));

    _this.state = {
      userRating: _this.props.movie.score,
      userReview: _this.props.movie.review,
      friendAverageRating: _this.props.movie.friendAverageRating
    };
    return _this;
  }

  _createClass(MovieListEntry, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState({
        userRating: nextProps.movie.score,
        userReview: this.props.movie.review,
        friendAverageRating: nextProps.movie.friendAverageRating
      });
    }
  }, {
    key: 'onStarClick',
    value: function onStarClick(event) {
      //setState is async
      this.setState({ userRating: event.target.value });
      this.updateRating(event.target.value);
    }
  }, {
    key: 'updateRating',
    value: function updateRating(rating) {
      var movieObj = {
        title: this.props.movie.title,
        id: this.props.movie.id,
        rating: rating
      };
      $.post('http://127.0.0.1:3000/ratemovie', movieObj).done(function (response) {
        console.log('movie rating updated');
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var movie = this.props.movie;

      if (this.props.friendName) {
        var friendSection = React.createElement(
          'div',
          null,
          React.createElement(
            'div',
            null,
            this.props.friendName + ' rates',
            ' ',
            React.createElement(
              'span',
              { className: 'friendScore' },
              movie.friendScore
            ),
            ' '
          ),
          React.createElement(
            'div',
            { className: 'friendReview' },
            this.props.friendName + '\'s review: ' + (movie.friendReview !== null ? movie.friendReview : this.props.friendName + ' did not leave a review')
          )
        );
      } else {
        var friendSection = '';
      }

      return React.createElement(
        'div',
        { className: 'movieEntry' },
        React.createElement('img', { className: 'moviethumnail', src: movie.poster, onClick: function onClick() {
            return _this2.props.change("SingleMovie", movie);
          } }),
        React.createElement(
          'h1',
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
          title: this.props.movie.title,
          id: this.props.movie.id }),
        React.createElement(
          'p',
          { className: 'imdbRating' },
          'IMDB rating: ',
          movie.imdbRating
        ),
        React.createElement(MovieWatchRequest, { movie: this.props.movie }),
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
        ),
        friendSection
      );
    }
  }]);

  return MovieListEntry;
}(React.Component);

window.MovieListEntry = MovieListEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9Nb3ZpZUxpc3RFbnRyeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sYzs7O0FBRUosMEJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLGtHQUNYLEtBRFc7O0FBRWpCLFVBQUssS0FBTCxHQUFhO0FBQ1gsa0JBQVksTUFBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixLQURsQjtBQUVYLGtCQUFZLE1BQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsTUFGbEI7QUFHWCwyQkFBcUIsTUFBSyxLQUFMLENBQVcsS0FBWCxDQUFpQjtBQUgzQixLQUFiO0FBRmlCO0FBT2xCOzs7OzhDQUV5QixTLEVBQVc7QUFDbkMsV0FBSyxRQUFMLENBQWM7QUFDWixvQkFBWSxVQUFVLEtBQVYsQ0FBZ0IsS0FEaEI7QUFFWixvQkFBWSxLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLE1BRmpCO0FBR1osNkJBQXFCLFVBQVUsS0FBVixDQUFnQjtBQUh6QixPQUFkO0FBS0Q7OztnQ0FFVyxLLEVBQU87O0FBRWpCLFdBQUssUUFBTCxDQUFjLEVBQUMsWUFBWSxNQUFNLE1BQU4sQ0FBYSxLQUExQixFQUFkO0FBQ0EsV0FBSyxZQUFMLENBQWtCLE1BQU0sTUFBTixDQUFhLEtBQS9CO0FBQ0Q7OztpQ0FHWSxNLEVBQVE7QUFDbkIsVUFBSSxXQUFXO0FBQ2IsZUFBTyxLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLEtBRFg7QUFFYixZQUFJLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsRUFGUjtBQUdiLGdCQUFRO0FBSEssT0FBZjtBQUtBLFFBQUUsSUFBRixDQUFPLGlDQUFQLEVBQTBDLFFBQTFDLEVBQ0MsSUFERCxDQUNNLG9CQUFZO0FBQ2hCLGdCQUFRLEdBQVIsQ0FBWSxzQkFBWjtBQUNELE9BSEQ7QUFJRDs7OzZCQUVRO0FBQUE7O0FBQ1AsVUFBSSxRQUFRLEtBQUssS0FBTCxDQUFXLEtBQXZCOztBQUVBLFVBQUksS0FBSyxLQUFMLENBQVcsVUFBZixFQUEyQjtBQUN6QixZQUFJLGdCQUNGO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUFTLGlCQUFLLEtBQUwsQ0FBVyxVQUFwQjtBQUFBO0FBQXdDO0FBQUE7QUFBQSxnQkFBTSxXQUFVLGFBQWhCO0FBQStCLG9CQUFNO0FBQXJDLGFBQXhDO0FBQUE7QUFBQSxXQURGO0FBRUU7QUFBQTtBQUFBLGNBQUssV0FBVSxjQUFmO0FBQWtDLGlCQUFLLEtBQUwsQ0FBVyxVQUE3QyxxQkFBc0UsTUFBTSxZQUFOLEtBQXVCLElBQXhCLEdBQWdDLE1BQU0sWUFBdEMsR0FBcUQsS0FBSyxLQUFMLENBQVcsVUFBWCxHQUF3Qix5QkFBbEo7QUFBQTtBQUZGLFNBREY7QUFNRCxPQVBELE1BT087QUFDTCxZQUFJLGdCQUFnQixFQUFwQjtBQUNEOztBQUVGLGFBQ0M7QUFBQTtBQUFBLFVBQUssV0FBVSxZQUFmO0FBQ0MscUNBQUssV0FBVSxlQUFmLEVBQStCLEtBQUssTUFBTSxNQUExQyxFQUFrRCxTQUFTO0FBQUEsbUJBQU8sT0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixhQUFsQixFQUFpQyxLQUFqQyxDQUFQO0FBQUEsV0FBM0QsR0FERDtBQUVDO0FBQUE7QUFBQSxZQUFJLFdBQVUsWUFBZCxFQUEyQixTQUFTO0FBQUEscUJBQU8sT0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixhQUFsQixFQUFpQyxLQUFqQyxDQUFQO0FBQUEsYUFBcEM7QUFBc0YsZ0JBQU07QUFBNUYsU0FGRDtBQUdDO0FBQUE7QUFBQSxZQUFHLFdBQVUsV0FBYjtBQUEwQixnQkFBTTtBQUFoQyxTQUhEO0FBSUM7QUFBQTtBQUFBLFlBQUcsV0FBVSxrQkFBYjtBQUFpQyxnQkFBTTtBQUF2QyxTQUpEO0FBS0ksNEJBQUMsZUFBRDtBQUNFLGtCQUFRLE1BQU0sTUFEaEI7QUFFRSxpQkFBTyxLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLEtBRjFCO0FBR0UsY0FBSSxLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLEVBSHZCLEdBTEo7QUFTQztBQUFBO0FBQUEsWUFBRyxXQUFVLFlBQWI7QUFBQTtBQUF3QyxnQkFBTTtBQUE5QyxTQVREO0FBVUMsNEJBQUMsaUJBQUQsSUFBbUIsT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUFyQyxHQVZEO0FBV0k7QUFBQTtBQUFBLFlBQUssV0FBVSxZQUFmO0FBQThCLGVBQUssS0FBTCxDQUFXLFVBQVgsS0FBMEIsSUFBM0IsR0FBbUMsK0JBQW5DLEdBQXFFLG9CQUFvQixLQUFLLEtBQUwsQ0FBVyxVQUFqSTtBQUNFLDhCQUFDLG1CQUFELElBQXFCLGFBQWEsS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCLENBQWxDO0FBREYsU0FYSjtBQWNJO0FBQUE7QUFBQSxZQUFLLFdBQVUsc0JBQWY7QUFBQTtBQUErRCxnQkFBTSxtQkFBUCxHQUE4QixNQUFNLG1CQUFwQyxHQUEwRDtBQUF4SCxTQWRKO0FBZUs7QUFmTCxPQUREO0FBbUJEOzs7O0VBdkUyQixNQUFNLFM7O0FBMEVuQyxPQUFPLGNBQVAsR0FBd0IsY0FBeEIiLCJmaWxlIjoiTW92aWVMaXN0RW50cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBNb3ZpZUxpc3RFbnRyeSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHVzZXJSYXRpbmc6IHRoaXMucHJvcHMubW92aWUuc2NvcmUsXG4gICAgICB1c2VyUmV2aWV3OiB0aGlzLnByb3BzLm1vdmllLnJldmlldyxcbiAgICAgIGZyaWVuZEF2ZXJhZ2VSYXRpbmc6IHRoaXMucHJvcHMubW92aWUuZnJpZW5kQXZlcmFnZVJhdGluZ1xuICAgIH07XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdXNlclJhdGluZzogbmV4dFByb3BzLm1vdmllLnNjb3JlLFxuICAgICAgdXNlclJldmlldzogdGhpcy5wcm9wcy5tb3ZpZS5yZXZpZXcsXG4gICAgICBmcmllbmRBdmVyYWdlUmF0aW5nOiBuZXh0UHJvcHMubW92aWUuZnJpZW5kQXZlcmFnZVJhdGluZ1xuICAgIH0pO1xuICB9XG5cbiAgb25TdGFyQ2xpY2soZXZlbnQpIHtcbiAgICAvL3NldFN0YXRlIGlzIGFzeW5jXG4gICAgdGhpcy5zZXRTdGF0ZSh7dXNlclJhdGluZzogZXZlbnQudGFyZ2V0LnZhbHVlfSk7XG4gICAgdGhpcy51cGRhdGVSYXRpbmcoZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgfVxuXG5cbiAgdXBkYXRlUmF0aW5nKHJhdGluZykge1xuICAgIHZhciBtb3ZpZU9iaiA9IHtcbiAgICAgIHRpdGxlOiB0aGlzLnByb3BzLm1vdmllLnRpdGxlLCBcbiAgICAgIGlkOiB0aGlzLnByb3BzLm1vdmllLmlkLFxuICAgICAgcmF0aW5nOiByYXRpbmdcbiAgICB9O1xuICAgICQucG9zdCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL3JhdGVtb3ZpZScsIG1vdmllT2JqKVxuICAgIC5kb25lKHJlc3BvbnNlID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdtb3ZpZSByYXRpbmcgdXBkYXRlZCcpO1xuICAgIH0pXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IG1vdmllID0gdGhpcy5wcm9wcy5tb3ZpZTtcblxuICAgIGlmICh0aGlzLnByb3BzLmZyaWVuZE5hbWUpIHtcbiAgICAgIHZhciBmcmllbmRTZWN0aW9uID0gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXY+e2Ake3RoaXMucHJvcHMuZnJpZW5kTmFtZX0gcmF0ZXNgfSA8c3BhbiBjbGFzc05hbWU9J2ZyaWVuZFNjb3JlJz57bW92aWUuZnJpZW5kU2NvcmV9PC9zcGFuPiA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZnJpZW5kUmV2aWV3Jz57YCR7dGhpcy5wcm9wcy5mcmllbmROYW1lfSdzIHJldmlldzogJHsobW92aWUuZnJpZW5kUmV2aWV3ICE9PSBudWxsKSA/IG1vdmllLmZyaWVuZFJldmlldyA6IHRoaXMucHJvcHMuZnJpZW5kTmFtZSArICcgZGlkIG5vdCBsZWF2ZSBhIHJldmlldyd9YH08L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBmcmllbmRTZWN0aW9uID0gJyc7XG4gICAgfVxuXG4gIFx0cmV0dXJuIChcbiAgXHRcdDxkaXYgY2xhc3NOYW1lPSdtb3ZpZUVudHJ5Jz5cbiAgXHRcdFx0PGltZyBjbGFzc05hbWU9J21vdmlldGh1bW5haWwnIHNyYz17bW92aWUucG9zdGVyfSBvbkNsaWNrPXsoKSA9PiAodGhpcy5wcm9wcy5jaGFuZ2UoXCJTaW5nbGVNb3ZpZVwiLCBtb3ZpZSkpfS8+XG4gIFx0XHRcdDxoMSBjbGFzc05hbWU9J21vdmllVGl0bGUnIG9uQ2xpY2s9eygpID0+ICh0aGlzLnByb3BzLmNoYW5nZShcIlNpbmdsZU1vdmllXCIsIG1vdmllKSl9Pnttb3ZpZS50aXRsZX08L2gxPlxuICBcdFx0XHQ8cCBjbGFzc05hbWU9J21vdmllWWVhcic+e21vdmllLnJlbGVhc2VfZGF0ZX08L3A+XG4gIFx0XHRcdDxwIGNsYXNzTmFtZT0nbW92aWVEZXNjcmlwdGlvbic+e21vdmllLmRlc2NyaXB0aW9ufTwvcD5cbiAgICAgICAgPFJldmlld0NvbXBvbmVudCBcbiAgICAgICAgICByZXZpZXc9e21vdmllLnJldmlld30gXG4gICAgICAgICAgdGl0bGU9e3RoaXMucHJvcHMubW92aWUudGl0bGV9XG4gICAgICAgICAgaWQ9e3RoaXMucHJvcHMubW92aWUuaWR9Lz5cbiAgXHRcdFx0PHAgY2xhc3NOYW1lPSdpbWRiUmF0aW5nJz5JTURCIHJhdGluZzoge21vdmllLmltZGJSYXRpbmd9PC9wPlxuICBcdFx0XHQ8TW92aWVXYXRjaFJlcXVlc3QgbW92aWU9e3RoaXMucHJvcHMubW92aWV9Lz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3VzZXJSYXRpbmcnPnsodGhpcy5zdGF0ZS51c2VyUmF0aW5nID09PSBudWxsKSA/ICd5b3UgaGF2ZSBub3QgcmF0ZWQgdGhpcyBtb3ZpZScgOiAneW91ciByYXRpbmcgaXMgJyArIHRoaXMuc3RhdGUudXNlclJhdGluZ31cbiAgICAgICAgICA8U3RhclJhdGluZ0NvbXBvbmVudCBvblN0YXJDbGljaz17dGhpcy5vblN0YXJDbGljay5iaW5kKHRoaXMpfS8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nYXZnRnJpZW5kUmF0aW5nQmxvY2snPmF2ZXJhZ2UgZnJpZW5kIHJhdGluZzogeyhtb3ZpZS5mcmllbmRBdmVyYWdlUmF0aW5nKSA/IG1vdmllLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgOiAnbm8gZnJpZW5kIHJhdGluZ3MnIH08L2Rpdj5cbiAgICAgICAge2ZyaWVuZFNlY3Rpb259XG4gICAgICA8L2Rpdj4pO1xuXG5cdH1cbn1cblxud2luZG93Lk1vdmllTGlzdEVudHJ5ID0gTW92aWVMaXN0RW50cnk7Il19
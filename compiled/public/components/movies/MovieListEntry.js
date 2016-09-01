'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MovieListEntry = function (_React$Component) {
  _inherits(MovieListEntry, _React$Component);

  function MovieListEntry(props) {
    _classCallCheck(this, MovieListEntry);

    var _this = _possibleConstructorReturn(this, (MovieListEntry.__proto__ || Object.getPrototypeOf(MovieListEntry)).call(this, props));

    _this.state = {
      userRating: _this.props.movie.score,
      userReview: _this.props.movie.review,
      friendAverageRating: Math.round(_this.props.movie.friendAverageRating * 10) / 10
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
        { className: 'movieEntry collection-item row' },
        React.createElement('img', { className: 'moviethumnail col s3', src: movie.poster, onClick: function onClick() {
            return _this2.props.change("SingleMovie", movie);
          }, alt: 'no_image_available.gif' }),
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
          ),
          friendSection
        )
      );
    }
  }]);

  return MovieListEntry;
}(React.Component);

window.MovieListEntry = MovieListEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9Nb3ZpZUxpc3RFbnRyeS5qcyJdLCJuYW1lcyI6WyJNb3ZpZUxpc3RFbnRyeSIsInByb3BzIiwic3RhdGUiLCJ1c2VyUmF0aW5nIiwibW92aWUiLCJzY29yZSIsInVzZXJSZXZpZXciLCJyZXZpZXciLCJmcmllbmRBdmVyYWdlUmF0aW5nIiwiTWF0aCIsInJvdW5kIiwibmV4dFByb3BzIiwic2V0U3RhdGUiLCJmcmllbmROYW1lIiwiZnJpZW5kU2VjdGlvbiIsImZyaWVuZFNjb3JlIiwiZnJpZW5kUmV2aWV3IiwicG9zdGVyIiwiY2hhbmdlIiwidGl0bGUiLCJyZWxlYXNlX2RhdGUiLCJkZXNjcmlwdGlvbiIsImlkIiwiaW1kYlJhdGluZyIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU1BLGM7OztBQUVKLDBCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsZ0lBQ1hBLEtBRFc7O0FBRWpCLFVBQUtDLEtBQUwsR0FBYTtBQUNYQyxrQkFBWSxNQUFLRixLQUFMLENBQVdHLEtBQVgsQ0FBaUJDLEtBRGxCO0FBRVhDLGtCQUFZLE1BQUtMLEtBQUwsQ0FBV0csS0FBWCxDQUFpQkcsTUFGbEI7QUFHWEMsMkJBQXFCQyxLQUFLQyxLQUFMLENBQVksTUFBS1QsS0FBTCxDQUFXRyxLQUFYLENBQWlCSSxtQkFBakIsR0FBdUMsRUFBbkQsSUFBMEQ7QUFIcEUsS0FBYjtBQUZpQjtBQU9sQjs7Ozs4Q0FFeUJHLFMsRUFBVztBQUNuQyxXQUFLQyxRQUFMLENBQWM7QUFDWlQsb0JBQVlRLFVBQVVQLEtBQVYsQ0FBZ0JDLEtBRGhCO0FBRVpDLG9CQUFZLEtBQUtMLEtBQUwsQ0FBV0csS0FBWCxDQUFpQkcsTUFGakI7QUFHWkMsNkJBQXFCRyxVQUFVUCxLQUFWLENBQWdCSTtBQUh6QixPQUFkO0FBS0Q7Ozs2QkFFUTtBQUFBOztBQUNQLFVBQUlKLFFBQVEsS0FBS0gsS0FBTCxDQUFXRyxLQUF2Qjs7QUFFQSxVQUFJLEtBQUtILEtBQUwsQ0FBV1ksVUFBZixFQUEyQjtBQUN6QixZQUFJQyxnQkFDRjtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFBUyxpQkFBS2IsS0FBTCxDQUFXWSxVQUFwQjtBQUFBO0FBQXdDO0FBQUE7QUFBQSxnQkFBTSxXQUFVLGFBQWhCO0FBQStCVCxvQkFBTVc7QUFBckMsYUFBeEM7QUFBQTtBQUFBLFdBREY7QUFFRTtBQUFBO0FBQUEsY0FBSyxXQUFVLGNBQWY7QUFBa0MsaUJBQUtkLEtBQUwsQ0FBV1ksVUFBN0MscUJBQXNFVCxNQUFNWSxZQUFOLEtBQXVCLElBQXhCLEdBQWdDWixNQUFNWSxZQUF0QyxHQUFxRCxLQUFLZixLQUFMLENBQVdZLFVBQVgsR0FBd0IseUJBQWxKO0FBQUE7QUFGRixTQURGO0FBTUQsT0FQRCxNQU9PO0FBQ0wsWUFBSUMsZ0JBQWdCLEVBQXBCO0FBQ0Q7O0FBRUYsYUFDQztBQUFBO0FBQUEsVUFBSyxXQUFVLGdDQUFmO0FBQ0MscUNBQUssV0FBVSxzQkFBZixFQUFzQyxLQUFLVixNQUFNYSxNQUFqRCxFQUF5RCxTQUFTO0FBQUEsbUJBQU8sT0FBS2hCLEtBQUwsQ0FBV2lCLE1BQVgsQ0FBa0IsYUFBbEIsRUFBaUNkLEtBQWpDLENBQVA7QUFBQSxXQUFsRSxFQUFtSCxLQUFJLHdCQUF2SCxHQUREO0FBRUk7QUFBQTtBQUFBLFlBQUssV0FBVSxjQUFmO0FBQ0Q7QUFBQTtBQUFBLGNBQUksV0FBVSxZQUFkLEVBQTJCLFNBQVM7QUFBQSx1QkFBTyxPQUFLSCxLQUFMLENBQVdpQixNQUFYLENBQWtCLGFBQWxCLEVBQWlDZCxLQUFqQyxDQUFQO0FBQUEsZUFBcEM7QUFBc0ZBLGtCQUFNZTtBQUE1RixXQURDO0FBRUQ7QUFBQTtBQUFBLGNBQUcsV0FBVSxXQUFiO0FBQTBCZixrQkFBTWdCO0FBQWhDLFdBRkM7QUFHRDtBQUFBO0FBQUEsY0FBRyxXQUFVLGtCQUFiO0FBQWlDaEIsa0JBQU1pQjtBQUF2QyxXQUhDO0FBSUUsOEJBQUMsZUFBRDtBQUNFLG9CQUFRakIsTUFBTUcsTUFEaEI7QUFFRSxtQkFBT0gsTUFBTWUsS0FGZjtBQUdFLGdCQUFJZixNQUFNa0IsRUFIWixHQUpGO0FBUUUsOEJBQUMsaUJBQUQsSUFBbUIsT0FBT2xCLEtBQTFCLEdBUkY7QUFVRTtBQUFBO0FBQUEsY0FBSyxXQUFVLGFBQWY7QUFDRDtBQUFBO0FBQUEsZ0JBQUssV0FBVSxtQkFBZjtBQUFBO0FBQWdEO0FBQUE7QUFBQTtBQUFJQSxzQkFBTW1CO0FBQVY7QUFBaEQsYUFEQztBQUVFLGdDQUFDLG1CQUFELElBQXFCLE9BQU9uQixLQUE1QixHQUZGO0FBR0U7QUFBQTtBQUFBLGdCQUFLLFdBQVUsNkJBQWY7QUFBQTtBQUFzRUEsb0JBQU1JLG1CQUFQLEdBQThCO0FBQUE7QUFBQTtBQUFJSixzQkFBTUk7QUFBVixlQUE5QixHQUFtRTtBQUF4STtBQUhGLFdBVkY7QUFlR007QUFmSDtBQUZKLE9BREQ7QUFzQkQ7Ozs7RUF2RDJCVSxNQUFNQyxTOztBQTBEbkNDLE9BQU8xQixjQUFQLEdBQXdCQSxjQUF4QiIsImZpbGUiOiJNb3ZpZUxpc3RFbnRyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIE1vdmllTGlzdEVudHJ5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgdXNlclJhdGluZzogdGhpcy5wcm9wcy5tb3ZpZS5zY29yZSxcbiAgICAgIHVzZXJSZXZpZXc6IHRoaXMucHJvcHMubW92aWUucmV2aWV3LFxuICAgICAgZnJpZW5kQXZlcmFnZVJhdGluZzogTWF0aC5yb3VuZCggdGhpcy5wcm9wcy5tb3ZpZS5mcmllbmRBdmVyYWdlUmF0aW5nICogMTAgKSAvIDEwXG4gICAgfTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB1c2VyUmF0aW5nOiBuZXh0UHJvcHMubW92aWUuc2NvcmUsXG4gICAgICB1c2VyUmV2aWV3OiB0aGlzLnByb3BzLm1vdmllLnJldmlldyxcbiAgICAgIGZyaWVuZEF2ZXJhZ2VSYXRpbmc6IG5leHRQcm9wcy5tb3ZpZS5mcmllbmRBdmVyYWdlUmF0aW5nXG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IG1vdmllID0gdGhpcy5wcm9wcy5tb3ZpZTtcblxuICAgIGlmICh0aGlzLnByb3BzLmZyaWVuZE5hbWUpIHtcbiAgICAgIHZhciBmcmllbmRTZWN0aW9uID0gKFxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXY+e2Ake3RoaXMucHJvcHMuZnJpZW5kTmFtZX0gcmF0ZXNgfSA8c3BhbiBjbGFzc05hbWU9J2ZyaWVuZFNjb3JlJz57bW92aWUuZnJpZW5kU2NvcmV9PC9zcGFuPiA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nZnJpZW5kUmV2aWV3Jz57YCR7dGhpcy5wcm9wcy5mcmllbmROYW1lfSdzIHJldmlldzogJHsobW92aWUuZnJpZW5kUmV2aWV3ICE9PSBudWxsKSA/IG1vdmllLmZyaWVuZFJldmlldyA6IHRoaXMucHJvcHMuZnJpZW5kTmFtZSArICcgZGlkIG5vdCBsZWF2ZSBhIHJldmlldyd9YH08L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBmcmllbmRTZWN0aW9uID0gJyc7XG4gICAgfVxuXG4gIFx0cmV0dXJuIChcbiAgXHRcdDxkaXYgY2xhc3NOYW1lPSdtb3ZpZUVudHJ5IGNvbGxlY3Rpb24taXRlbSByb3cnPlxuICBcdFx0XHQ8aW1nIGNsYXNzTmFtZT0nbW92aWV0aHVtbmFpbCBjb2wgczMnIHNyYz17bW92aWUucG9zdGVyfSBvbkNsaWNrPXsoKSA9PiAodGhpcy5wcm9wcy5jaGFuZ2UoXCJTaW5nbGVNb3ZpZVwiLCBtb3ZpZSkpfSBhbHQ9XCJub19pbWFnZV9hdmFpbGFibGUuZ2lmXCIvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncmlnaHQgY29sIHM5Jz5cbiAgICBcdFx0XHQ8aDUgY2xhc3NOYW1lPSdtb3ZpZVRpdGxlJyBvbkNsaWNrPXsoKSA9PiAodGhpcy5wcm9wcy5jaGFuZ2UoXCJTaW5nbGVNb3ZpZVwiLCBtb3ZpZSkpfT57bW92aWUudGl0bGV9PC9oNT5cbiAgICBcdFx0XHQ8cCBjbGFzc05hbWU9J21vdmllWWVhcic+e21vdmllLnJlbGVhc2VfZGF0ZX08L3A+XG4gICAgXHRcdFx0PHAgY2xhc3NOYW1lPSdtb3ZpZURlc2NyaXB0aW9uJz57bW92aWUuZGVzY3JpcHRpb259PC9wPlxuICAgICAgICAgIDxSZXZpZXdDb21wb25lbnQgXG4gICAgICAgICAgICByZXZpZXc9e21vdmllLnJldmlld30gXG4gICAgICAgICAgICB0aXRsZT17bW92aWUudGl0bGV9XG4gICAgICAgICAgICBpZD17bW92aWUuaWR9Lz5cbiAgICAgICAgICA8TW92aWVXYXRjaFJlcXVlc3QgbW92aWU9e21vdmllfS8+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJhdGluZ3Mgcm93XCI+XG4gICAgICBcdFx0XHQ8ZGl2IGNsYXNzTmFtZT0naW1kYlJhdGluZyBjb2wgczQnPklNREIgcmF0aW5nOiA8Yj57bW92aWUuaW1kYlJhdGluZ308L2I+PC9kaXY+XG4gICAgICAgICAgICA8U3RhclJhdGluZ0NvbXBvbmVudCBtb3ZpZT17bW92aWV9Lz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdhdmdGcmllbmRSYXRpbmdCbG9jayBjb2wgczQnPmF2ZXJhZ2UgZnJpZW5kIHJhdGluZzogeyhtb3ZpZS5mcmllbmRBdmVyYWdlUmF0aW5nKSA/IDxiPnttb3ZpZS5mcmllbmRBdmVyYWdlUmF0aW5nfTwvYj4gOiAnbi9hJyB9PC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAge2ZyaWVuZFNlY3Rpb259XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+KTtcblxuXHR9XG59XG5cbndpbmRvdy5Nb3ZpZUxpc3RFbnRyeSA9IE1vdmllTGlzdEVudHJ5OyJdfQ==
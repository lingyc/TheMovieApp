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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9Nb3ZpZUxpc3RFbnRyeS5qcyJdLCJuYW1lcyI6WyJNb3ZpZUxpc3RFbnRyeSIsInByb3BzIiwic3RhdGUiLCJ1c2VyUmF0aW5nIiwibW92aWUiLCJzY29yZSIsInVzZXJSZXZpZXciLCJyZXZpZXciLCJmcmllbmRBdmVyYWdlUmF0aW5nIiwiTWF0aCIsInJvdW5kIiwibmV4dFByb3BzIiwic2V0U3RhdGUiLCJmcmllbmROYW1lIiwiZnJpZW5kU2VjdGlvbiIsImZyaWVuZFNjb3JlIiwiZnJpZW5kUmV2aWV3IiwicG9zdGVyIiwiY2hhbmdlIiwidGl0bGUiLCJyZWxlYXNlX2RhdGUiLCJkZXNjcmlwdGlvbiIsImlkIiwiaW1kYlJhdGluZyIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU1BLGM7OztBQUVKLDBCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsZ0lBQ1hBLEtBRFc7O0FBRWpCLFVBQUtDLEtBQUwsR0FBYTtBQUNYQyxrQkFBWSxNQUFLRixLQUFMLENBQVdHLEtBQVgsQ0FBaUJDLEtBRGxCO0FBRVhDLGtCQUFZLE1BQUtMLEtBQUwsQ0FBV0csS0FBWCxDQUFpQkcsTUFGbEI7QUFHWEMsMkJBQXFCQyxLQUFLQyxLQUFMLENBQVksTUFBS1QsS0FBTCxDQUFXRyxLQUFYLENBQWlCSSxtQkFBakIsR0FBdUMsRUFBbkQsSUFBMEQ7QUFIcEUsS0FBYjtBQUZpQjtBQU9sQjs7Ozs4Q0FFeUJHLFMsRUFBVztBQUNuQyxXQUFLQyxRQUFMLENBQWM7QUFDWlQsb0JBQVlRLFVBQVVQLEtBQVYsQ0FBZ0JDLEtBRGhCO0FBRVpDLG9CQUFZLEtBQUtMLEtBQUwsQ0FBV0csS0FBWCxDQUFpQkcsTUFGakI7QUFHWkMsNkJBQXFCRyxVQUFVUCxLQUFWLENBQWdCSTtBQUh6QixPQUFkO0FBS0Q7Ozs2QkFFUTtBQUFBOztBQUNQLFVBQUlKLFFBQVEsS0FBS0gsS0FBTCxDQUFXRyxLQUF2Qjs7QUFFQSxVQUFJLEtBQUtILEtBQUwsQ0FBV1ksVUFBZixFQUEyQjtBQUN6QixZQUFJQyxnQkFDRjtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFBUyxpQkFBS2IsS0FBTCxDQUFXWSxVQUFwQjtBQUFBO0FBQXdDO0FBQUE7QUFBQSxnQkFBTSxXQUFVLGFBQWhCO0FBQStCVCxvQkFBTVc7QUFBckMsYUFBeEM7QUFBQTtBQUFBLFdBREY7QUFFRTtBQUFBO0FBQUEsY0FBSyxXQUFVLGNBQWY7QUFBa0MsaUJBQUtkLEtBQUwsQ0FBV1ksVUFBN0MscUJBQXNFVCxNQUFNWSxZQUFOLEtBQXVCLElBQXhCLEdBQWdDWixNQUFNWSxZQUF0QyxHQUFxRCxLQUFLZixLQUFMLENBQVdZLFVBQVgsR0FBd0IseUJBQWxKO0FBQUE7QUFGRixTQURGO0FBTUQsT0FQRCxNQU9PO0FBQ0wsWUFBSUMsZ0JBQWdCLEVBQXBCO0FBQ0Q7O0FBRUYsYUFDQztBQUFBO0FBQUEsVUFBSyxXQUFVLGdDQUFmO0FBQ0MscUNBQUssV0FBVSxzQkFBZixFQUFzQyxLQUFLVixNQUFNYSxNQUFqRCxFQUF5RCxTQUFTO0FBQUEsbUJBQU8sT0FBS2hCLEtBQUwsQ0FBV2lCLE1BQVgsQ0FBa0IsYUFBbEIsRUFBaUNkLEtBQWpDLENBQVA7QUFBQSxXQUFsRSxFQUFtSCxLQUFJLHdCQUF2SCxHQUREO0FBRUk7QUFBQTtBQUFBLFlBQUssV0FBVSxjQUFmO0FBQ0Q7QUFBQTtBQUFBLGNBQUksV0FBVSxZQUFkLEVBQTJCLFNBQVM7QUFBQSx1QkFBTyxPQUFLSCxLQUFMLENBQVdpQixNQUFYLENBQWtCLGFBQWxCLEVBQWlDZCxLQUFqQyxDQUFQO0FBQUEsZUFBcEM7QUFBc0ZBLGtCQUFNZTtBQUE1RixXQURDO0FBRUQ7QUFBQTtBQUFBLGNBQUcsV0FBVSxXQUFiO0FBQTBCZixrQkFBTWdCO0FBQWhDLFdBRkM7QUFHRDtBQUFBO0FBQUEsY0FBRyxXQUFVLGtCQUFiO0FBQWlDaEIsa0JBQU1pQjtBQUF2QyxXQUhDO0FBSUUsOEJBQUMsZUFBRDtBQUNFLG9CQUFRakIsTUFBTUcsTUFEaEI7QUFFRSxtQkFBT0gsTUFBTWUsS0FGZjtBQUdFLGdCQUFJZixNQUFNa0IsRUFIWixHQUpGO0FBUUUsOEJBQUMsaUJBQUQsSUFBbUIsT0FBT2xCLEtBQTFCLEdBUkY7QUFVRTtBQUFBO0FBQUEsY0FBSyxXQUFVLGFBQWY7QUFDRDtBQUFBO0FBQUEsZ0JBQUssV0FBVSxtQkFBZjtBQUFBO0FBQWdEO0FBQUE7QUFBQTtBQUFJQSxzQkFBTW1CO0FBQVY7QUFBaEQsYUFEQztBQUVFLGdDQUFDLG1CQUFELElBQXFCLE9BQU9uQixLQUE1QixHQUZGO0FBR0U7QUFBQTtBQUFBLGdCQUFLLFdBQVUsNkJBQWY7QUFBQTtBQUFzRUEsb0JBQU1JLG1CQUFQLEdBQThCO0FBQUE7QUFBQTtBQUFJSixzQkFBTUk7QUFBVixlQUE5QixHQUFtRTtBQUF4STtBQUhGLFdBVkY7QUFlR007QUFmSDtBQUZKLE9BREQ7QUFzQkQ7Ozs7RUF2RDJCVSxNQUFNQyxTOztBQTBEbkNDLE9BQU8xQixjQUFQLEdBQXdCQSxjQUF4QiIsImZpbGUiOiJNb3ZpZUxpc3RFbnRyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIE1vdmllTGlzdEVudHJ5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKTtcclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIHVzZXJSYXRpbmc6IHRoaXMucHJvcHMubW92aWUuc2NvcmUsXHJcbiAgICAgIHVzZXJSZXZpZXc6IHRoaXMucHJvcHMubW92aWUucmV2aWV3LFxyXG4gICAgICBmcmllbmRBdmVyYWdlUmF0aW5nOiBNYXRoLnJvdW5kKCB0aGlzLnByb3BzLm1vdmllLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgKiAxMCApIC8gMTBcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wcykge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHVzZXJSYXRpbmc6IG5leHRQcm9wcy5tb3ZpZS5zY29yZSxcclxuICAgICAgdXNlclJldmlldzogdGhpcy5wcm9wcy5tb3ZpZS5yZXZpZXcsXHJcbiAgICAgIGZyaWVuZEF2ZXJhZ2VSYXRpbmc6IG5leHRQcm9wcy5tb3ZpZS5mcmllbmRBdmVyYWdlUmF0aW5nXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIGxldCBtb3ZpZSA9IHRoaXMucHJvcHMubW92aWU7XHJcblxyXG4gICAgaWYgKHRoaXMucHJvcHMuZnJpZW5kTmFtZSkge1xyXG4gICAgICB2YXIgZnJpZW5kU2VjdGlvbiA9IChcclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgPGRpdj57YCR7dGhpcy5wcm9wcy5mcmllbmROYW1lfSByYXRlc2B9IDxzcGFuIGNsYXNzTmFtZT0nZnJpZW5kU2NvcmUnPnttb3ZpZS5mcmllbmRTY29yZX08L3NwYW4+IDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ZyaWVuZFJldmlldyc+e2Ake3RoaXMucHJvcHMuZnJpZW5kTmFtZX0ncyByZXZpZXc6ICR7KG1vdmllLmZyaWVuZFJldmlldyAhPT0gbnVsbCkgPyBtb3ZpZS5mcmllbmRSZXZpZXcgOiB0aGlzLnByb3BzLmZyaWVuZE5hbWUgKyAnIGRpZCBub3QgbGVhdmUgYSByZXZpZXcnfWB9PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIClcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBmcmllbmRTZWN0aW9uID0gJyc7XHJcbiAgICB9XHJcblxyXG4gIFx0cmV0dXJuIChcclxuICBcdFx0PGRpdiBjbGFzc05hbWU9J21vdmllRW50cnkgY29sbGVjdGlvbi1pdGVtIHJvdyc+XHJcbiAgXHRcdFx0PGltZyBjbGFzc05hbWU9J21vdmlldGh1bW5haWwgY29sIHMzJyBzcmM9e21vdmllLnBvc3Rlcn0gb25DbGljaz17KCkgPT4gKHRoaXMucHJvcHMuY2hhbmdlKFwiU2luZ2xlTW92aWVcIiwgbW92aWUpKX0gYWx0PVwibm9faW1hZ2VfYXZhaWxhYmxlLmdpZlwiLz5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncmlnaHQgY29sIHM5Jz5cclxuICAgIFx0XHRcdDxoNSBjbGFzc05hbWU9J21vdmllVGl0bGUnIG9uQ2xpY2s9eygpID0+ICh0aGlzLnByb3BzLmNoYW5nZShcIlNpbmdsZU1vdmllXCIsIG1vdmllKSl9Pnttb3ZpZS50aXRsZX08L2g1PlxyXG4gICAgXHRcdFx0PHAgY2xhc3NOYW1lPSdtb3ZpZVllYXInPnttb3ZpZS5yZWxlYXNlX2RhdGV9PC9wPlxyXG4gICAgXHRcdFx0PHAgY2xhc3NOYW1lPSdtb3ZpZURlc2NyaXB0aW9uJz57bW92aWUuZGVzY3JpcHRpb259PC9wPlxyXG4gICAgICAgICAgPFJldmlld0NvbXBvbmVudCBcclxuICAgICAgICAgICAgcmV2aWV3PXttb3ZpZS5yZXZpZXd9IFxyXG4gICAgICAgICAgICB0aXRsZT17bW92aWUudGl0bGV9XHJcbiAgICAgICAgICAgIGlkPXttb3ZpZS5pZH0vPlxyXG4gICAgICAgICAgPE1vdmllV2F0Y2hSZXF1ZXN0IG1vdmllPXttb3ZpZX0vPlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmF0aW5ncyByb3dcIj5cclxuICAgICAgXHRcdFx0PGRpdiBjbGFzc05hbWU9J2ltZGJSYXRpbmcgY29sIHM0Jz5JTURCIHJhdGluZzogPGI+e21vdmllLmltZGJSYXRpbmd9PC9iPjwvZGl2PlxyXG4gICAgICAgICAgICA8U3RhclJhdGluZ0NvbXBvbmVudCBtb3ZpZT17bW92aWV9Lz5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2F2Z0ZyaWVuZFJhdGluZ0Jsb2NrIGNvbCBzNCc+YXZlcmFnZSBmcmllbmQgcmF0aW5nOiB7KG1vdmllLmZyaWVuZEF2ZXJhZ2VSYXRpbmcpID8gPGI+e21vdmllLmZyaWVuZEF2ZXJhZ2VSYXRpbmd9PC9iPiA6ICduL2EnIH08L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAge2ZyaWVuZFNlY3Rpb259XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2Pik7XHJcblxyXG5cdH1cclxufVxyXG5cclxud2luZG93Lk1vdmllTGlzdEVudHJ5ID0gTW92aWVMaXN0RW50cnk7Il19
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
              'IMDB Rating: ',
              React.createElement(
                'b',
                null,
                movie.imdbRating,
                '/10'
              )
            ),
            React.createElement(StarRatingComponent, { movie: movie }),
            React.createElement(
              'div',
              { className: 'avgFriendRatingBlock col s4' },
              'Average Friend Rating: ',
              movie.friendAverageRating ? React.createElement(
                'b',
                { className: 'friendRating' },
                movie.friendAverageRating,
                '/5'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9Nb3ZpZUxpc3RFbnRyeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sYzs7O0FBRUosMEJBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLGtHQUNYLEtBRFc7O0FBRWpCLFVBQUssS0FBTCxHQUFhO0FBQ1gsa0JBQVksTUFBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixLQURsQjtBQUVYLGtCQUFZLE1BQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsTUFGbEI7QUFHWCwyQkFBcUIsS0FBSyxLQUFMLENBQVksTUFBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixtQkFBakIsR0FBdUMsRUFBbkQsSUFBMEQ7QUFIcEUsS0FBYjtBQUZpQjtBQU9sQjs7Ozs4Q0FFeUIsUyxFQUFXO0FBQ25DLFdBQUssUUFBTCxDQUFjO0FBQ1osb0JBQVksVUFBVSxLQUFWLENBQWdCLEtBRGhCO0FBRVosb0JBQVksS0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixNQUZqQjtBQUdaLDZCQUFxQixVQUFVLEtBQVYsQ0FBZ0I7QUFIekIsT0FBZDtBQUtEOzs7NkJBRVE7QUFBQTs7QUFDUCxVQUFJLFFBQVEsS0FBSyxLQUFMLENBQVcsS0FBdkI7O0FBRUEsVUFBSSxLQUFLLEtBQUwsQ0FBVyxVQUFmLEVBQTJCO0FBQ3pCLFlBQUksZ0JBQ0Y7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBO0FBQVMsaUJBQUssS0FBTCxDQUFXLFVBQXBCO0FBQUE7QUFBd0M7QUFBQTtBQUFBLGdCQUFNLFdBQVUsYUFBaEI7QUFBK0Isb0JBQU07QUFBckMsYUFBeEM7QUFBQTtBQUFBLFdBREY7QUFFRTtBQUFBO0FBQUEsY0FBSyxXQUFVLGNBQWY7QUFBa0MsaUJBQUssS0FBTCxDQUFXLFVBQTdDLHFCQUFzRSxNQUFNLFlBQU4sS0FBdUIsSUFBeEIsR0FBZ0MsTUFBTSxZQUF0QyxHQUFxRCxLQUFLLEtBQUwsQ0FBVyxVQUFYLEdBQXdCLHlCQUFsSjtBQUFBO0FBRkYsU0FERjtBQU1ELE9BUEQsTUFPTztBQUNMLFlBQUksZ0JBQWdCLEVBQXBCO0FBQ0Q7O0FBRUYsYUFDQztBQUFBO0FBQUEsVUFBSyxXQUFVLGdDQUFmO0FBQ0MscUNBQUssV0FBVSxzQkFBZixFQUFzQyxLQUFLLE1BQU0sTUFBakQsRUFBeUQsU0FBUztBQUFBLG1CQUFPLE9BQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsYUFBbEIsRUFBaUMsS0FBakMsQ0FBUDtBQUFBLFdBQWxFLEVBQW1ILEtBQUksd0JBQXZILEdBREQ7QUFFSTtBQUFBO0FBQUEsWUFBSyxXQUFVLGNBQWY7QUFDRDtBQUFBO0FBQUEsY0FBSSxXQUFVLFlBQWQsRUFBMkIsU0FBUztBQUFBLHVCQUFPLE9BQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsYUFBbEIsRUFBaUMsS0FBakMsQ0FBUDtBQUFBLGVBQXBDO0FBQXNGLGtCQUFNO0FBQTVGLFdBREM7QUFFRDtBQUFBO0FBQUEsY0FBRyxXQUFVLFdBQWI7QUFBMEIsa0JBQU07QUFBaEMsV0FGQztBQUdEO0FBQUE7QUFBQSxjQUFHLFdBQVUsa0JBQWI7QUFBaUMsa0JBQU07QUFBdkMsV0FIQztBQUlFLDhCQUFDLGVBQUQ7QUFDRSxvQkFBUSxNQUFNLE1BRGhCO0FBRUUsbUJBQU8sTUFBTSxLQUZmO0FBR0UsZ0JBQUksTUFBTSxFQUhaLEdBSkY7QUFRRSw4QkFBQyxpQkFBRCxJQUFtQixPQUFPLEtBQTFCLEdBUkY7QUFVRTtBQUFBO0FBQUEsY0FBSyxXQUFVLGFBQWY7QUFDRDtBQUFBO0FBQUEsZ0JBQUssV0FBVSxtQkFBZjtBQUFBO0FBQWdEO0FBQUE7QUFBQTtBQUFJLHNCQUFNLFVBQVY7QUFBQTtBQUFBO0FBQWhELGFBREM7QUFFRSxnQ0FBQyxtQkFBRCxJQUFxQixPQUFPLEtBQTVCLEdBRkY7QUFHRTtBQUFBO0FBQUEsZ0JBQUssV0FBVSw2QkFBZjtBQUFBO0FBQXNFLG9CQUFNLG1CQUFQLEdBQThCO0FBQUE7QUFBQSxrQkFBRyxXQUFVLGNBQWI7QUFBNkIsc0JBQU0sbUJBQW5DO0FBQUE7QUFBQSxlQUE5QixHQUE4RjtBQUFuSztBQUhGLFdBVkY7QUFlRztBQWZIO0FBRkosT0FERDtBQXNCRDs7OztFQXZEMkIsTUFBTSxTOztBQTBEbkMsT0FBTyxjQUFQLEdBQXdCLGNBQXhCIiwiZmlsZSI6Ik1vdmllTGlzdEVudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgTW92aWVMaXN0RW50cnkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICB1c2VyUmF0aW5nOiB0aGlzLnByb3BzLm1vdmllLnNjb3JlLFxuICAgICAgdXNlclJldmlldzogdGhpcy5wcm9wcy5tb3ZpZS5yZXZpZXcsXG4gICAgICBmcmllbmRBdmVyYWdlUmF0aW5nOiBNYXRoLnJvdW5kKCB0aGlzLnByb3BzLm1vdmllLmZyaWVuZEF2ZXJhZ2VSYXRpbmcgKiAxMCApIC8gMTBcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHVzZXJSYXRpbmc6IG5leHRQcm9wcy5tb3ZpZS5zY29yZSxcbiAgICAgIHVzZXJSZXZpZXc6IHRoaXMucHJvcHMubW92aWUucmV2aWV3LFxuICAgICAgZnJpZW5kQXZlcmFnZVJhdGluZzogbmV4dFByb3BzLm1vdmllLmZyaWVuZEF2ZXJhZ2VSYXRpbmdcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBsZXQgbW92aWUgPSB0aGlzLnByb3BzLm1vdmllO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuZnJpZW5kTmFtZSkge1xuICAgICAgdmFyIGZyaWVuZFNlY3Rpb24gPSAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRpdj57YCR7dGhpcy5wcm9wcy5mcmllbmROYW1lfSByYXRlc2B9IDxzcGFuIGNsYXNzTmFtZT0nZnJpZW5kU2NvcmUnPnttb3ZpZS5mcmllbmRTY29yZX08L3NwYW4+IDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdmcmllbmRSZXZpZXcnPntgJHt0aGlzLnByb3BzLmZyaWVuZE5hbWV9J3MgcmV2aWV3OiAkeyhtb3ZpZS5mcmllbmRSZXZpZXcgIT09IG51bGwpID8gbW92aWUuZnJpZW5kUmV2aWV3IDogdGhpcy5wcm9wcy5mcmllbmROYW1lICsgJyBkaWQgbm90IGxlYXZlIGEgcmV2aWV3J31gfTwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGZyaWVuZFNlY3Rpb24gPSAnJztcbiAgICB9XG5cbiAgXHRyZXR1cm4gKFxuICBcdFx0PGRpdiBjbGFzc05hbWU9J21vdmllRW50cnkgY29sbGVjdGlvbi1pdGVtIHJvdyc+XG4gIFx0XHRcdDxpbWcgY2xhc3NOYW1lPSdtb3ZpZXRodW1uYWlsIGNvbCBzMycgc3JjPXttb3ZpZS5wb3N0ZXJ9IG9uQ2xpY2s9eygpID0+ICh0aGlzLnByb3BzLmNoYW5nZShcIlNpbmdsZU1vdmllXCIsIG1vdmllKSl9IGFsdD1cIm5vX2ltYWdlX2F2YWlsYWJsZS5naWZcIi8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdyaWdodCBjb2wgczknPlxuICAgIFx0XHRcdDxoNSBjbGFzc05hbWU9J21vdmllVGl0bGUnIG9uQ2xpY2s9eygpID0+ICh0aGlzLnByb3BzLmNoYW5nZShcIlNpbmdsZU1vdmllXCIsIG1vdmllKSl9Pnttb3ZpZS50aXRsZX08L2g1PlxuICAgIFx0XHRcdDxwIGNsYXNzTmFtZT0nbW92aWVZZWFyJz57bW92aWUucmVsZWFzZV9kYXRlfTwvcD5cbiAgICBcdFx0XHQ8cCBjbGFzc05hbWU9J21vdmllRGVzY3JpcHRpb24nPnttb3ZpZS5kZXNjcmlwdGlvbn08L3A+XG4gICAgICAgICAgPFJldmlld0NvbXBvbmVudCBcbiAgICAgICAgICAgIHJldmlldz17bW92aWUucmV2aWV3fSBcbiAgICAgICAgICAgIHRpdGxlPXttb3ZpZS50aXRsZX1cbiAgICAgICAgICAgIGlkPXttb3ZpZS5pZH0vPlxuICAgICAgICAgIDxNb3ZpZVdhdGNoUmVxdWVzdCBtb3ZpZT17bW92aWV9Lz5cblxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmF0aW5ncyByb3dcIj5cbiAgICAgIFx0XHRcdDxkaXYgY2xhc3NOYW1lPSdpbWRiUmF0aW5nIGNvbCBzNCc+SU1EQiBSYXRpbmc6IDxiPnttb3ZpZS5pbWRiUmF0aW5nfS8xMDwvYj48L2Rpdj5cbiAgICAgICAgICAgIDxTdGFyUmF0aW5nQ29tcG9uZW50IG1vdmllPXttb3ZpZX0vPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2F2Z0ZyaWVuZFJhdGluZ0Jsb2NrIGNvbCBzNCc+QXZlcmFnZSBGcmllbmQgUmF0aW5nOiB7KG1vdmllLmZyaWVuZEF2ZXJhZ2VSYXRpbmcpID8gPGIgY2xhc3NOYW1lPVwiZnJpZW5kUmF0aW5nXCI+e21vdmllLmZyaWVuZEF2ZXJhZ2VSYXRpbmd9LzU8L2I+IDogJ24vYScgfTwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHtmcmllbmRTZWN0aW9ufVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2Pik7XG5cblx0fVxufVxuXG53aW5kb3cuTW92aWVMaXN0RW50cnkgPSBNb3ZpZUxpc3RFbnRyeTsiXX0=
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
        console.log('this is the response', response);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9TaW5nbGVNb3ZpZVJhdGluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0saUI7OztBQUNKLDZCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxxR0FDWCxLQURXOztBQUVqQixVQUFLLEtBQUwsR0FBYTtBQUNYLGFBQU8sRUFESTtBQUVYLGFBQU8sTUFBSyxLQUFMLENBQVcsWUFGUDtBQUdYLFlBQU0sYUFISztBQUlYLHFCQUFlO0FBSkosS0FBYjtBQUZpQjtBQVFsQjs7Ozt3Q0FFbUI7QUFDbEIsV0FBSyxnQkFBTCxDQUFzQixLQUFLLEtBQUwsQ0FBVyxLQUFqQztBQUVEOzs7Z0RBRTJCO0FBQzFCLFdBQUssUUFBTCxDQUFjO0FBQ1osZUFBTyxLQUFLLEtBQUwsQ0FBVztBQUROLE9BQWQ7QUFHRDs7O2dDQUVXLEssRUFBTztBQUNqQixXQUFLLFFBQUwsQ0FBYyxFQUFDLFlBQVksTUFBTSxNQUFOLENBQWEsS0FBMUIsRUFBZDtBQUNBLFdBQUssWUFBTCxDQUFrQixNQUFNLE1BQU4sQ0FBYSxLQUEvQjtBQUNEOzs7aUNBRVk7QUFDWCxVQUFJLE9BQU8sSUFBWDtBQUNBLFFBQUUsSUFBRixDQUFPLE1BQU0sYUFBYixFQUNHLElBREgsQ0FDUSxVQUFTLElBQVQsRUFBZTtBQUNuQixnQkFBUSxHQUFSLENBQVksS0FBSyxLQUFMLENBQVcsT0FBdkI7QUFDRCxPQUhILEVBSUcsS0FKSCxDQUlTLFVBQVMsR0FBVCxFQUFjO0FBQ25CLGdCQUFRLEdBQVIsQ0FBWSxHQUFaO0FBQ0QsT0FOSDtBQU9EOzs7Ozs7O3FDQUlnQixVLEVBQVk7QUFDM0IsVUFBSSxPQUFPLElBQVg7QUFDQSxRQUFFLElBQUYsQ0FBTyxNQUFNLG1CQUFiLEVBQ0UsRUFBQyxPQUFPLFVBQVIsRUFERixFQUVHLElBRkgsQ0FFUSxVQUFTLFFBQVQsRUFBbUI7QUFDdkIsZ0JBQVEsR0FBUixDQUFZLHNCQUFaLEVBQW9DLFFBQXBDO0FBQ0EsYUFBSyxRQUFMLENBQWM7QUFDWix5QkFBZTtBQURILFNBQWQ7QUFHRCxPQVBILEVBUUcsS0FSSCxDQVFTLFVBQVMsR0FBVCxFQUFjO0FBQ25CLGdCQUFRLEdBQVIsQ0FBWSxHQUFaO0FBQ0QsT0FWSDs7QUFZRDs7OzZCQUVRO0FBQUE7O0FBQ1AsVUFBSSxPQUFPLElBQVg7QUFDQSxVQUFJLFFBQVEsS0FBSyxLQUFMLENBQVcsS0FBdkI7QUFDQSxhQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUsaUJBQWY7QUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLGdDQUFmO0FBQ0UsdUNBQUssV0FBVSxzQkFBZixFQUFzQyxLQUFLLE1BQU0sTUFBakQsRUFBeUQsU0FBUztBQUFBLHFCQUFPLE9BQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsYUFBbEIsRUFBaUMsS0FBakMsQ0FBUDtBQUFBLGFBQWxFLEdBREY7QUFFRTtBQUFBO0FBQUEsY0FBSyxXQUFVLGNBQWY7QUFDRTtBQUFBO0FBQUEsZ0JBQUksV0FBVSxZQUFkLEVBQTJCLFNBQVM7QUFBQSx5QkFBTyxPQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLGFBQWxCLEVBQWlDLEtBQWpDLENBQVA7QUFBQSxpQkFBcEM7QUFBc0Ysb0JBQU07QUFBNUYsYUFERjtBQUVFO0FBQUE7QUFBQSxnQkFBRyxXQUFVLFdBQWI7QUFBMEIsb0JBQU07QUFBaEMsYUFGRjtBQUdFO0FBQUE7QUFBQSxnQkFBRyxXQUFVLGtCQUFiO0FBQWlDLG9CQUFNO0FBQXZDLGFBSEY7QUFJRSxnQ0FBQyxlQUFEO0FBQ0Usc0JBQVEsTUFBTSxNQURoQjtBQUVFLHFCQUFPLE1BQU0sS0FGZjtBQUdFLGtCQUFJLE1BQU0sRUFIWixHQUpGO0FBUUUsZ0NBQUMsaUJBQUQsSUFBbUIsT0FBTyxLQUExQixHQVJGO0FBVUU7QUFBQTtBQUFBLGdCQUFLLFdBQVUsYUFBZjtBQUNFO0FBQUE7QUFBQSxrQkFBSyxXQUFVLG1CQUFmO0FBQUE7QUFBZ0Q7QUFBQTtBQUFBO0FBQUksd0JBQU07QUFBVjtBQUFoRCxlQURGO0FBRUUsa0NBQUMsbUJBQUQsSUFBcUIsT0FBTyxLQUE1QixHQUZGO0FBR0U7QUFBQTtBQUFBLGtCQUFLLFdBQVUsNkJBQWY7QUFBQTtBQUFzRSxzQkFBTSxtQkFBUCxHQUE4QjtBQUFBO0FBQUE7QUFBSSx3QkFBTTtBQUFWLGlCQUE5QixHQUFtRTtBQUF4STtBQUhGO0FBVkY7QUFGRixTQURGO0FBb0JFO0FBQUE7QUFBQTtBQUNHLGVBQUssS0FBTCxDQUFXLGFBQVgsQ0FBeUIsR0FBekIsQ0FBNkI7QUFBQSxtQkFDNUIsb0JBQUMsc0JBQUQ7QUFDQSxzQkFBUSxZQURSO0FBRUEsc0JBQVEsS0FBSyxLQUFMLENBQVcsTUFGbkI7QUFHQSxtQkFBSyxLQUFLLEtBQUwsQ0FBVztBQUhoQixjQUQ0QjtBQUFBLFdBQTdCO0FBREg7QUFwQkYsT0FERjtBQWdDRDs7OztFQTNGNkIsTUFBTSxTOztBQTRGckM7O0FBRUQsT0FBTyxpQkFBUCxHQUEyQixpQkFBM0IiLCJmaWxlIjoiU2luZ2xlTW92aWVSYXRpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBTaW5nbGVNb3ZpZVJhdGluZyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICB2YWx1ZTogJycsXG4gICAgICBtb3ZpZTogdGhpcy5wcm9wcy5jdXJyZW50TW92aWUsXG4gICAgICB2aWV3OiAnU2luZ2xlTW92aWUnLFxuICAgICAgZnJpZW5kUmF0aW5nczogW11cbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5nZXRGcmllbmRzUmF0aW5nKHRoaXMuc3RhdGUubW92aWUpO1xuXG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgbW92aWU6IHRoaXMucHJvcHMubW92aWVcbiAgICB9KTtcbiAgfVxuXG4gIG9uU3RhckNsaWNrKGV2ZW50KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7dXNlclJhdGluZzogZXZlbnQudGFyZ2V0LnZhbHVlfSk7XG4gICAgdGhpcy51cGRhdGVSYXRpbmcoZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgfVxuXG4gIGdldEZyaWVuZHMoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICQucG9zdChVcmwgKyAnL2dldEZyaWVuZHMnKVxuICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcCkge1xuICAgICAgICBjb25zb2xlLmxvZyh0aGF0LnN0YXRlLmZyaWVuZHMpXG4gICAgICB9KVxuICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgfSk7XG4gIH1cblxuICAvL2dldCBmcmllbmQgcmF0aW5ncyBieSBjYWxsaW5nIHJlcXVlc3RoYW5kbGVyXG4gIC8vZ2V0IGZyaWVuZHJhdGluZ3MsIHBhc3NpbmcgaW4gbWFpblVzZXIgYW5kIG1vdmllb2JqXG4gIGdldEZyaWVuZHNSYXRpbmcoaW5wdXRNb3ZpZSkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAkLnBvc3QoVXJsICsgJy9nZXRGcmllbmRSYXRpbmdzJywgXG4gICAgICB7bW92aWU6IGlucHV0TW92aWV9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3RoaXMgaXMgdGhlIHJlc3BvbnNlJywgcmVzcG9uc2UpO1xuICAgICAgICB0aGF0LnNldFN0YXRlKHtcbiAgICAgICAgICBmcmllbmRSYXRpbmdzOiByZXNwb25zZVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyKVxuICAgICAgfSk7XG4gICAgLy8gY29uc29sZS5sb2coJ3RoaXMgaXMgdGhlIG1vdmllJywgaW5wdXRNb3ZpZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgIGxldCBtb3ZpZSA9IHRoaXMuc3RhdGUubW92aWU7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdIb21lIGNvbGxlY3Rpb24nPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vdmllRW50cnkgY29sbGVjdGlvbi1pdGVtIHJvd1wiPlxuICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPSdtb3ZpZXRodW1uYWlsIGNvbCBzMycgc3JjPXttb3ZpZS5wb3N0ZXJ9IG9uQ2xpY2s9eygpID0+ICh0aGlzLnByb3BzLmNoYW5nZShcIlNpbmdsZU1vdmllXCIsIG1vdmllKSl9Lz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncmlnaHQgY29sIHM5Jz5cbiAgICAgICAgICAgIDxoNSBjbGFzc05hbWU9J21vdmllVGl0bGUnIG9uQ2xpY2s9eygpID0+ICh0aGlzLnByb3BzLmNoYW5nZShcIlNpbmdsZU1vdmllXCIsIG1vdmllKSl9Pnttb3ZpZS50aXRsZX08L2g1PlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPSdtb3ZpZVllYXInPnttb3ZpZS5yZWxlYXNlX2RhdGV9PC9wPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPSdtb3ZpZURlc2NyaXB0aW9uJz57bW92aWUuZGVzY3JpcHRpb259PC9wPlxuICAgICAgICAgICAgPFJldmlld0NvbXBvbmVudCBcbiAgICAgICAgICAgICAgcmV2aWV3PXttb3ZpZS5yZXZpZXd9IFxuICAgICAgICAgICAgICB0aXRsZT17bW92aWUudGl0bGV9XG4gICAgICAgICAgICAgIGlkPXttb3ZpZS5pZH0vPlxuICAgICAgICAgICAgPE1vdmllV2F0Y2hSZXF1ZXN0IG1vdmllPXttb3ZpZX0vPlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJhdGluZ3Mgcm93XCI+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdpbWRiUmF0aW5nIGNvbCBzNCc+SU1EQiByYXRpbmc6IDxiPnttb3ZpZS5pbWRiUmF0aW5nfTwvYj48L2Rpdj5cbiAgICAgICAgICAgICAgPFN0YXJSYXRpbmdDb21wb25lbnQgbW92aWU9e21vdmllfS8+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdhdmdGcmllbmRSYXRpbmdCbG9jayBjb2wgczQnPmF2ZXJhZ2UgZnJpZW5kIHJhdGluZzogeyhtb3ZpZS5mcmllbmRBdmVyYWdlUmF0aW5nKSA/IDxiPnttb3ZpZS5mcmllbmRBdmVyYWdlUmF0aW5nfTwvYj4gOiAnbi9hJyB9PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAge3RoaXMuc3RhdGUuZnJpZW5kUmF0aW5ncy5tYXAoZnJpZW5kUmF0aW5nID0+IFxuICAgICAgICAgICAgPFNpbmdsZU1vdmllUmF0aW5nRW50cnkgXG4gICAgICAgICAgICByYXRpbmc9e2ZyaWVuZFJhdGluZ31cbiAgICAgICAgICAgIGNoYW5nZT17dGhhdC5wcm9wcy5jaGFuZ2V9XG4gICAgICAgICAgICBmb2Y9e3RoYXQucHJvcHMuZm9mfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufTtcblxud2luZG93LlNpbmdsZU1vdmllUmF0aW5nID0gU2luZ2xlTW92aWVSYXRpbmc7Il19
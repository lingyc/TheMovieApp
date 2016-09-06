'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SingleMovieRating = function (_React$Component) {
  _inherits(SingleMovieRating, _React$Component);

  function SingleMovieRating(props) {
    _classCallCheck(this, SingleMovieRating);

    var _this = _possibleConstructorReturn(this, (SingleMovieRating.__proto__ || Object.getPrototypeOf(SingleMovieRating)).call(this, props));

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
        { className: 'Home collection', onClick: function onClick() {
            return console.log(that.state);
          } },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9TaW5nbGVNb3ZpZVJhdGluZy5qcyJdLCJuYW1lcyI6WyJTaW5nbGVNb3ZpZVJhdGluZyIsInByb3BzIiwic3RhdGUiLCJ2YWx1ZSIsIm1vdmllIiwiY3VycmVudE1vdmllIiwidmlldyIsImZyaWVuZFJhdGluZ3MiLCJnZXRGcmllbmRzUmF0aW5nIiwic2V0U3RhdGUiLCJldmVudCIsInVzZXJSYXRpbmciLCJ0YXJnZXQiLCJ1cGRhdGVSYXRpbmciLCJ0aGF0IiwiJCIsInBvc3QiLCJVcmwiLCJ0aGVuIiwicmVzcCIsImNvbnNvbGUiLCJsb2ciLCJmcmllbmRzIiwiY2F0Y2giLCJlcnIiLCJpbnB1dE1vdmllIiwicmVzcG9uc2UiLCJwb3N0ZXIiLCJjaGFuZ2UiLCJ0aXRsZSIsInJlbGVhc2VfZGF0ZSIsImRlc2NyaXB0aW9uIiwicmV2aWV3IiwiaWQiLCJpbWRiUmF0aW5nIiwiZnJpZW5kQXZlcmFnZVJhdGluZyIsIm1hcCIsImZyaWVuZFJhdGluZyIsImZvZiIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU1BLGlCOzs7QUFDSiw2QkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLHNJQUNYQSxLQURXOztBQUVqQixVQUFLQyxLQUFMLEdBQWE7QUFDWEMsYUFBTyxFQURJO0FBRVhDLGFBQU8sTUFBS0gsS0FBTCxDQUFXSSxZQUZQO0FBR1hDLFlBQU0sYUFISztBQUlYQyxxQkFBZTtBQUpKLEtBQWI7QUFGaUI7QUFRbEI7Ozs7d0NBRW1CO0FBQ2xCLFdBQUtDLGdCQUFMLENBQXNCLEtBQUtOLEtBQUwsQ0FBV0UsS0FBakM7QUFDRDs7O2dEQUUyQjtBQUMxQixXQUFLSyxRQUFMLENBQWM7QUFDWkwsZUFBTyxLQUFLSCxLQUFMLENBQVdHO0FBRE4sT0FBZDtBQUdEOzs7Z0NBRVdNLEssRUFBTztBQUNqQixXQUFLRCxRQUFMLENBQWMsRUFB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O0FBQ0Esc0JBQVFDLFlBRFI7QUFFQSxzQkFBUXZCLEtBQUtiLEtBQUwsQ0FBVzJCLE1BRm5CO0FBR0EsbUJBQUtkLEtBQUtiLEtBQUwsQ0FBV3FDO0FBSGhCLGNBRDRCO0FBQUEsV0FBN0I7QUFESDtBQXBCRixPQURGO0FBZ0NEOzs7O0VBMUY2QkMsTUFBTUMsUzs7QUEyRnJDOztBQUVEQyxPQUFPekMsaUJBQVAsR0FBMkJBLGlCQUEzQiIsImZpbGUiOiJTaW5nbGVNb3ZpZVJhdGluZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFNpbmdsZU1vdmllUmF0aW5nIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpO1xyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgdmFsdWU6ICcnLFxyXG4gICAgICBtb3ZpZTogdGhpcy5wcm9wcy5jdXJyZW50TW92aWUsXHJcbiAgICAgIHZpZXc6ICdTaW5nbGVNb3ZpZScsXHJcbiAgICAgIGZyaWVuZFJhdGluZ3M6IFtdXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICB0aGlzLmdldEZyaWVuZHNSYXRpbmcodGhpcy5zdGF0ZS5tb3ZpZSk7XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIG1vdmllOiB0aGlzLnByb3BzLm1vdmllXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG9uU3RhckNsaWNrKGV2ZW50KSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHt1c2VyUmF0aW5nOiBldmVudC50YXJnZXQudmFsdWV9KTtcclxuICAgIHRoaXMudXBkYXRlUmF0aW5nKGV2ZW50LnRhcmdldC52YWx1ZSk7XHJcbiAgfVxyXG5cclxuICBnZXRGcmllbmRzKCkge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgJC5wb3N0KFVybCArICcvZ2V0RnJpZW5kcycpXHJcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3ApIHtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGF0LnN0YXRlLmZyaWVuZHMpXHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vZ2V0IGZyaWVuZCByYXRpbmdzIGJ5IGNhbGxpbmcgcmVxdWVzdGhhbmRsZXJcclxuICAvL2dldCBmcmllbmRyYXRpbmdzLCBwYXNzaW5nIGluIG1haW5Vc2VyIGFuZCBtb3ZpZW9ialxyXG4gIGdldEZyaWVuZHNSYXRpbmcoaW5wdXRNb3ZpZSkge1xyXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xyXG4gICAgJC5wb3N0KFVybCArICcvZ2V0RnJpZW5kUmF0aW5ncycsIFxyXG4gICAgICB7bW92aWU6IGlucHV0TW92aWV9KVxyXG4gICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSByZXNwb25zZScsIHJlc3BvbnNlKTtcclxuICAgICAgICB0aGF0LnNldFN0YXRlKHtcclxuICAgICAgICAgIGZyaWVuZFJhdGluZ3M6IHJlc3BvbnNlXHJcbiAgICAgICAgfSlcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycilcclxuICAgICAgfSk7XHJcbiAgICAvLyBjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgbW92aWUnLCBpbnB1dE1vdmllKTtcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgIGxldCBtb3ZpZSA9IHRoaXMuc3RhdGUubW92aWU7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nSG9tZSBjb2xsZWN0aW9uJyBvbkNsaWNrPXsoKT0+IGNvbnNvbGUubG9nKHRoYXQuc3RhdGUpfT5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vdmllRW50cnkgY29sbGVjdGlvbi1pdGVtIHJvd1wiPlxyXG4gICAgICAgICAgPGltZyBjbGFzc05hbWU9J21vdmlldGh1bW5haWwgY29sIHMzJyBzcmM9e21vdmllLnBvc3Rlcn0gb25DbGljaz17KCkgPT4gKHRoaXMucHJvcHMuY2hhbmdlKFwiU2luZ2xlTW92aWVcIiwgbW92aWUpKX0vPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3JpZ2h0IGNvbCBzOSc+XHJcbiAgICAgICAgICAgIDxoNSBjbGFzc05hbWU9J21vdmllVGl0bGUnIG9uQ2xpY2s9eygpID0+ICh0aGlzLnByb3BzLmNoYW5nZShcIlNpbmdsZU1vdmllXCIsIG1vdmllKSl9Pnttb3ZpZS50aXRsZX08L2g1PlxyXG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9J21vdmllWWVhcic+e21vdmllLnJlbGVhc2VfZGF0ZX08L3A+XHJcbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT0nbW92aWVEZXNjcmlwdGlvbic+e21vdmllLmRlc2NyaXB0aW9ufTwvcD5cclxuICAgICAgICAgICAgPFJldmlld0NvbXBvbmVudCBcclxuICAgICAgICAgICAgICByZXZpZXc9e21vdmllLnJldmlld30gXHJcbiAgICAgICAgICAgICAgdGl0bGU9e21vdmllLnRpdGxlfVxyXG4gICAgICAgICAgICAgIGlkPXttb3ZpZS5pZH0vPlxyXG4gICAgICAgICAgICA8TW92aWVXYXRjaFJlcXVlc3QgbW92aWU9e21vdmllfS8+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJhdGluZ3Mgcm93XCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ltZGJSYXRpbmcgY29sIHM0Jz5JTURCIHJhdGluZzogPGI+e21vdmllLmltZGJSYXRpbmd9PC9iPjwvZGl2PlxyXG4gICAgICAgICAgICAgIDxTdGFyUmF0aW5nQ29tcG9uZW50IG1vdmllPXttb3ZpZX0vPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdhdmdGcmllbmRSYXRpbmdCbG9jayBjb2wgczQnPmF2ZXJhZ2UgZnJpZW5kIHJhdGluZzogeyhtb3ZpZS5mcmllbmRBdmVyYWdlUmF0aW5nKSA/IDxiPnttb3ZpZS5mcmllbmRBdmVyYWdlUmF0aW5nfTwvYj4gOiAnbi9hJyB9PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgIHt0aGlzLnN0YXRlLmZyaWVuZFJhdGluZ3MubWFwKGZyaWVuZFJhdGluZyA9PiBcclxuICAgICAgICAgICAgPFNpbmdsZU1vdmllUmF0aW5nRW50cnkgXHJcbiAgICAgICAgICAgIHJhdGluZz17ZnJpZW5kUmF0aW5nfVxyXG4gICAgICAgICAgICBjaGFuZ2U9e3RoYXQucHJvcHMuY2hhbmdlfVxyXG4gICAgICAgICAgICBmb2Y9e3RoYXQucHJvcHMuZm9mfVxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICApfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICk7XHJcbiAgfVxyXG59O1xyXG5cclxud2luZG93LlNpbmdsZU1vdmllUmF0aW5nID0gU2luZ2xlTW92aWVSYXRpbmc7Il19
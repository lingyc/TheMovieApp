'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Home = function (_React$Component) {
  _inherits(Home, _React$Component);

  function Home(props) {
    _classCallCheck(this, Home);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Home).call(this, props));

    _this.state = {
      movies: [],
      view: 'recentRelease',
      focalMovie: null,
      recentRelease: true,
      search: ''
    };
    return _this;
  }

  //should have its own change view function


  _createClass(Home, [{
    key: 'changeViews',
    value: function changeViews(targetState) {
      this.setState({
        view: targetState
      });
    }

    //show render a list of recent releases on initialize

  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.getRecentReleasesInitialize();
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event) {
      this.setState({
        search: event.target.value
      });
    }
  }, {
    key: 'getRecentReleasesInitialize',
    value: function getRecentReleasesInitialize() {
      var _this2 = this;

      $.get(Url + '/recentRelease').then(function (moviesWithRatings) {
        console.log('response from server', moviesWithRatings);
        _this2.setState({
          movies: moviesWithRatings,
          recentRelease: true
        });
      });
    }

    //function that takes movies from external API and query the database for ratings
    //will set the movies state after ratings are successfully retrived

  }, {
    key: 'getUserRatingsForMovies',
    value: function getUserRatingsForMovies(moviesFromOMDB) {
      var _this3 = this;

      if (moviesFromOMDB.length === 0) {
        this.setState({
          movies: [],
          recentRelease: false
        });
      } else {
        console.log('posting to:', Url + '/getMultipleMovieRatings');
        $.post(Url + '/getMultipleMovieRatings', { movies: moviesFromOMDB }).done(function (moviesWithRatings) {
          console.log('response from server', moviesWithRatings);
          _this3.setState({
            movies: moviesWithRatings,
            recentRelease: false
          });
        });
      }
    }

    //////////////////////
    /////Event Handlers
    //////////////////////

    //this will call search for a movie from external API, do a database query for rating
    //and set the reponse to the movies state

  }, {
    key: 'handleSearch',
    value: function handleSearch(event) {
      if (event.charCode == 13 || event === 'clicked') {
        var that = this;

        //this will search TMDB for movie and send it to server to retrive user ratings
        $.ajax({
          url: "https://api.themoviedb.org/3/search/movie",
          jsonp: "callback",
          dataType: "jsonp",
          data: {
            query: this.state.search,
            api_key: "9d3b035ef1cd669aed398400b17fcea2",
            format: "json"
          },
          success: function success(response) {
            var sorted = _.sortBy(response.results, 'imdbRating');
            that.getUserRatingsForMovies(sorted);
          }
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var lable = 'recent releases';
      var feedbackMsg = '';
      if (this.state.recentRelease === false) {
        lable = 'back to recent releases';
        if (this.state.movies.length === 0) {
          feedbackMsg = React.createElement(
            'div',
            { className: 'errorMsg' },
            'no match found, please try another title'
          );
        } else {
          feedbackMsg = React.createElement(
            'div',
            { className: 'updatedMsg' },
            'all match results:'
          );
        }
      }

      return React.createElement(
        'div',
        { className: 'Home collection' },
        React.createElement(
          'div',
          { className: 'header', onClick: this.getRecentReleasesInitialize.bind(this) },
          lable
        ),
        React.createElement(
          'div',
          { className: 'searchMovie' },
          React.createElement('input', { type: 'text', id: 'movieInput',
            className: 'movieInput',
            placeholder: 'find a movie',
            value: this.state.search,
            onChange: this.handleChange.bind(this),
            onKeyPress: this.handleSearch.bind(this) }),
          React.createElement(
            'a',
            { className: 'waves-effect waves-light btn', onClick: function onClick() {
                return _this4.handleSearch.bind(_this4)('clicked');
              } },
            'search'
          )
        ),
        feedbackMsg,
        React.createElement(MovieList, { movies: this.state.movies,
          change: this.props.change.bind(this)
        })
      );
    }
  }]);

  return Home;
}(React.Component);

window.Home = Home;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL2hvbWUvSG9tZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sSTs7O0FBQ0osZ0JBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLHdGQUNYLEtBRFc7O0FBR2pCLFVBQUssS0FBTCxHQUFhO0FBQ1gsY0FBUSxFQURHO0FBRVgsWUFBTSxlQUZLO0FBR1gsa0JBQVksSUFIRDtBQUlYLHFCQUFlLElBSko7QUFLWCxjQUFRO0FBTEcsS0FBYjtBQUhpQjtBQVVsQjs7QUFFRDs7Ozs7Z0NBQ1ksVyxFQUFhO0FBQ3ZCLFdBQUssUUFBTCxDQUFjO0FBQ1osY0FBTTtBQURNLE9BQWQ7QUFHRDs7QUFFRDs7Ozt3Q0FDb0I7QUFDbEIsV0FBSywyQkFBTDtBQUNEOzs7aUNBRVksSyxFQUFPO0FBQ2xCLFdBQUssUUFBTCxDQUFjO0FBQ1osZ0JBQVEsTUFBTSxNQUFOLENBQWE7QUFEVCxPQUFkO0FBR0Q7OztrREFFNkI7QUFBQTs7QUFDNUIsUUFBRSxHQUFGLENBQU0sTUFBTSxnQkFBWixFQUNDLElBREQsQ0FDTSw2QkFBcUI7QUFDekIsZ0JBQVEsR0FBUixDQUFZLHNCQUFaLEVBQW9DLGlCQUFwQztBQUNBLGVBQUssUUFBTCxDQUFjO0FBQ1osa0JBQVEsaUJBREk7QUFFWix5QkFBZTtBQUZILFNBQWQ7QUFJRCxPQVBEO0FBU0Q7O0FBRUQ7QUFDQTs7Ozs0Q0FDd0IsYyxFQUFnQjtBQUFBOztBQUN0QyxVQUFJLGVBQWUsTUFBZixLQUEwQixDQUE5QixFQUFpQztBQUMvQixhQUFLLFFBQUwsQ0FBYztBQUNaLGtCQUFRLEVBREk7QUFFWix5QkFBZTtBQUZILFNBQWQ7QUFJRCxPQUxELE1BS087QUFDTCxnQkFBUSxHQUFSLENBQVksYUFBWixFQUEyQixNQUFNLDBCQUFqQztBQUNBLFVBQUUsSUFBRixDQUFPLE1BQU0sMEJBQWIsRUFBeUMsRUFBRSxRQUFRLGNBQVYsRUFBekMsRUFDQyxJQURELENBQ00sNkJBQXFCO0FBQ3pCLGtCQUFRLEdBQVIsQ0FBWSxzQkFBWixFQUFvQyxpQkFBcEM7QUFDQSxpQkFBSyxRQUFMLENBQWM7QUFDWixvQkFBUSxpQkFESTtBQUVaLDJCQUFlO0FBRkgsV0FBZDtBQUlELFNBUEQ7QUFRRDtBQUNGOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7O2lDQUNhLEssRUFBTztBQUNsQixVQUFJLE1BQU0sUUFBTixJQUFrQixFQUFsQixJQUF3QixVQUFVLFNBQXRDLEVBQWlEO0FBQy9DLFlBQUksT0FBTyxJQUFYOztBQUVBO0FBQ0EsVUFBRSxJQUFGLENBQU87QUFDTCxlQUFLLDJDQURBO0FBRUwsaUJBQU8sVUFGRjtBQUdMLG9CQUFVLE9BSEw7QUFJTCxnQkFBTTtBQUNGLG1CQUFPLEtBQUssS0FBTCxDQUFXLE1BRGhCO0FBRUYscUJBQVMsa0NBRlA7QUFHRixvQkFBUTtBQUhOLFdBSkQ7QUFTTCxtQkFBUyxpQkFBUyxRQUFULEVBQW1CO0FBQzFCLGdCQUFJLFNBQVMsRUFBRSxNQUFGLENBQVMsU0FBUyxPQUFsQixFQUEyQixZQUEzQixDQUFiO0FBQ0EsaUJBQUssdUJBQUwsQ0FBNkIsTUFBN0I7QUFDRDtBQVpJLFNBQVA7QUFjRDtBQUNGOzs7NkJBRVE7QUFBQTs7QUFFUCxVQUFJLFFBQVEsaUJBQVo7QUFDQSxVQUFJLGNBQWMsRUFBbEI7QUFDQSxVQUFJLEtBQUssS0FBTCxDQUFXLGFBQVgsS0FBNkIsS0FBakMsRUFBd0M7QUFDdEMsZ0JBQVEseUJBQVI7QUFDQSxZQUFJLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsTUFBbEIsS0FBNkIsQ0FBakMsRUFBb0M7QUFDbEMsd0JBQWU7QUFBQTtBQUFBLGNBQUssV0FBVSxVQUFmO0FBQUE7QUFBQSxXQUFmO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsd0JBQWU7QUFBQTtBQUFBLGNBQUssV0FBVSxZQUFmO0FBQUE7QUFBQSxXQUFmO0FBQ0Q7QUFDRjs7QUFFRCxhQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUsaUJBQWY7QUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLFFBQWYsRUFBd0IsU0FBUyxLQUFLLDJCQUFMLENBQWlDLElBQWpDLENBQXNDLElBQXRDLENBQWpDO0FBQStFO0FBQS9FLFNBREY7QUFFRTtBQUFBO0FBQUEsWUFBSyxXQUFVLGFBQWY7QUFDRSx5Q0FBTyxNQUFNLE1BQWIsRUFBb0IsSUFBRyxZQUF2QjtBQUNFLHVCQUFVLFlBRFo7QUFFRSx5QkFBWSxjQUZkO0FBR0UsbUJBQU8sS0FBSyxLQUFMLENBQVcsTUFIcEI7QUFJRSxzQkFBVSxLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FKWjtBQUtFLHdCQUFZLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixJQUF2QixDQUxkLEdBREY7QUFPRTtBQUFBO0FBQUEsY0FBRyxXQUFVLDhCQUFiLEVBQTRDLFNBQVM7QUFBQSx1QkFBTSxPQUFLLFlBQUwsQ0FBa0IsSUFBbEIsU0FBNkIsU0FBN0IsQ0FBTjtBQUFBLGVBQXJEO0FBQUE7QUFBQTtBQVBGLFNBRkY7QUFXRyxtQkFYSDtBQVlFLDRCQUFDLFNBQUQsSUFBVyxRQUFRLEtBQUssS0FBTCxDQUFXLE1BQTlCO0FBQ0Esa0JBQVEsS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixJQUFsQixDQUF1QixJQUF2QjtBQURSO0FBWkYsT0FERjtBQWtCRDs7OztFQTNIZ0IsTUFBTSxTOztBQThIekIsT0FBTyxJQUFQLEdBQWMsSUFBZCIsImZpbGUiOiJIb21lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgSG9tZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIG1vdmllczogW10sXG4gICAgICB2aWV3OiAncmVjZW50UmVsZWFzZScsXG4gICAgICBmb2NhbE1vdmllOiBudWxsLFxuICAgICAgcmVjZW50UmVsZWFzZTogdHJ1ZSxcbiAgICAgIHNlYXJjaDogJydcbiAgICB9O1xuICB9XG5cbiAgLy9zaG91bGQgaGF2ZSBpdHMgb3duIGNoYW5nZSB2aWV3IGZ1bmN0aW9uXG4gIGNoYW5nZVZpZXdzKHRhcmdldFN0YXRlKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB2aWV3OiB0YXJnZXRTdGF0ZVxuICAgIH0pO1xuICB9XG5cbiAgLy9zaG93IHJlbmRlciBhIGxpc3Qgb2YgcmVjZW50IHJlbGVhc2VzIG9uIGluaXRpYWxpemVcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5nZXRSZWNlbnRSZWxlYXNlc0luaXRpYWxpemUoKTtcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZShldmVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgc2VhcmNoOiBldmVudC50YXJnZXQudmFsdWVcbiAgICB9KTtcbiAgfVxuXG4gIGdldFJlY2VudFJlbGVhc2VzSW5pdGlhbGl6ZSgpIHtcbiAgICAkLmdldChVcmwgKyAnL3JlY2VudFJlbGVhc2UnKVxuICAgIC50aGVuKG1vdmllc1dpdGhSYXRpbmdzID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdyZXNwb25zZSBmcm9tIHNlcnZlcicsIG1vdmllc1dpdGhSYXRpbmdzKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBtb3ZpZXM6IG1vdmllc1dpdGhSYXRpbmdzLFxuICAgICAgICByZWNlbnRSZWxlYXNlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9KVxuICAgIFxuICB9XG5cbiAgLy9mdW5jdGlvbiB0aGF0IHRha2VzIG1vdmllcyBmcm9tIGV4dGVybmFsIEFQSSBhbmQgcXVlcnkgdGhlIGRhdGFiYXNlIGZvciByYXRpbmdzXG4gIC8vd2lsbCBzZXQgdGhlIG1vdmllcyBzdGF0ZSBhZnRlciByYXRpbmdzIGFyZSBzdWNjZXNzZnVsbHkgcmV0cml2ZWRcbiAgZ2V0VXNlclJhdGluZ3NGb3JNb3ZpZXMobW92aWVzRnJvbU9NREIpIHtcbiAgICBpZiAobW92aWVzRnJvbU9NREIubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbW92aWVzOiBbXSxcbiAgICAgICAgcmVjZW50UmVsZWFzZTogZmFsc2VcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygncG9zdGluZyB0bzonLCBVcmwgKyAnL2dldE11bHRpcGxlTW92aWVSYXRpbmdzJyk7XG4gICAgICAkLnBvc3QoVXJsICsgJy9nZXRNdWx0aXBsZU1vdmllUmF0aW5ncycsIHsgbW92aWVzOiBtb3ZpZXNGcm9tT01EQiB9KVxuICAgICAgLmRvbmUobW92aWVzV2l0aFJhdGluZ3MgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygncmVzcG9uc2UgZnJvbSBzZXJ2ZXInLCBtb3ZpZXNXaXRoUmF0aW5ncyk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIG1vdmllczogbW92aWVzV2l0aFJhdGluZ3MsXG4gICAgICAgICAgcmVjZW50UmVsZWFzZTogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgLy8vLy9FdmVudCBIYW5kbGVyc1xuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgLy90aGlzIHdpbGwgY2FsbCBzZWFyY2ggZm9yIGEgbW92aWUgZnJvbSBleHRlcm5hbCBBUEksIGRvIGEgZGF0YWJhc2UgcXVlcnkgZm9yIHJhdGluZ1xuICAvL2FuZCBzZXQgdGhlIHJlcG9uc2UgdG8gdGhlIG1vdmllcyBzdGF0ZVxuICBoYW5kbGVTZWFyY2goZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQuY2hhckNvZGUgPT0gMTMgfHwgZXZlbnQgPT09ICdjbGlja2VkJykge1xuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAvL3RoaXMgd2lsbCBzZWFyY2ggVE1EQiBmb3IgbW92aWUgYW5kIHNlbmQgaXQgdG8gc2VydmVyIHRvIHJldHJpdmUgdXNlciByYXRpbmdzXG4gICAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IFwiaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy9zZWFyY2gvbW92aWVcIixcbiAgICAgICAganNvbnA6IFwiY2FsbGJhY2tcIixcbiAgICAgICAgZGF0YVR5cGU6IFwianNvbnBcIixcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgcXVlcnk6IHRoaXMuc3RhdGUuc2VhcmNoLFxuICAgICAgICAgICAgYXBpX2tleTogXCI5ZDNiMDM1ZWYxY2Q2NjlhZWQzOTg0MDBiMTdmY2VhMlwiLFxuICAgICAgICAgICAgZm9ybWF0OiBcImpzb25cIixcbiAgICAgICAgfSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICB2YXIgc29ydGVkID0gXy5zb3J0QnkocmVzcG9uc2UucmVzdWx0cywgJ2ltZGJSYXRpbmcnKTtcbiAgICAgICAgICB0aGF0LmdldFVzZXJSYXRpbmdzRm9yTW92aWVzKHNvcnRlZCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBcbiAgICB2YXIgbGFibGUgPSAncmVjZW50IHJlbGVhc2VzJztcbiAgICB2YXIgZmVlZGJhY2tNc2cgPSAnJztcbiAgICBpZiAodGhpcy5zdGF0ZS5yZWNlbnRSZWxlYXNlID09PSBmYWxzZSkge1xuICAgICAgbGFibGUgPSAnYmFjayB0byByZWNlbnQgcmVsZWFzZXMnO1xuICAgICAgaWYgKHRoaXMuc3RhdGUubW92aWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBmZWVkYmFja01zZyA9ICg8ZGl2IGNsYXNzTmFtZT1cImVycm9yTXNnXCI+bm8gbWF0Y2ggZm91bmQsIHBsZWFzZSB0cnkgYW5vdGhlciB0aXRsZTwvZGl2PilcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZlZWRiYWNrTXNnID0gKDxkaXYgY2xhc3NOYW1lPVwidXBkYXRlZE1zZ1wiPmFsbCBtYXRjaCByZXN1bHRzOjwvZGl2PilcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9J0hvbWUgY29sbGVjdGlvbic+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdoZWFkZXInIG9uQ2xpY2s9e3RoaXMuZ2V0UmVjZW50UmVsZWFzZXNJbml0aWFsaXplLmJpbmQodGhpcyl9PntsYWJsZX08L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3NlYXJjaE1vdmllJz5cbiAgICAgICAgICA8aW5wdXQgdHlwZSA9J3RleHQnIGlkPSdtb3ZpZUlucHV0JyBcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nbW92aWVJbnB1dCdcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPSdmaW5kIGEgbW92aWUnXG4gICAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5zZWFyY2h9XG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIG9uS2V5UHJlc3M9e3RoaXMuaGFuZGxlU2VhcmNoLmJpbmQodGhpcyl9Lz5cbiAgICAgICAgICA8YSBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17KCkgPT4gdGhpcy5oYW5kbGVTZWFyY2guYmluZCh0aGlzKSgnY2xpY2tlZCcpfT5zZWFyY2g8L2E+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7ZmVlZGJhY2tNc2d9XG4gICAgICAgIDxNb3ZpZUxpc3QgbW92aWVzPXt0aGlzLnN0YXRlLm1vdmllc31cbiAgICAgICAgY2hhbmdlPXt0aGlzLnByb3BzLmNoYW5nZS5iaW5kKHRoaXMpfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbndpbmRvdy5Ib21lID0gSG9tZTsiXX0=
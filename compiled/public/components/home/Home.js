'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Home = function (_React$Component) {
  _inherits(Home, _React$Component);

  function Home(props) {
    _classCallCheck(this, Home);

    var _this = _possibleConstructorReturn(this, (Home.__proto__ || Object.getPrototypeOf(Home)).call(this, props));

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL2hvbWUvaG9tZS5qcyJdLCJuYW1lcyI6WyJIb21lIiwicHJvcHMiLCJzdGF0ZSIsIm1vdmllcyIsInZpZXciLCJmb2NhbE1vdmllIiwicmVjZW50UmVsZWFzZSIsInNlYXJjaCIsInRhcmdldFN0YXRlIiwic2V0U3RhdGUiLCJnZXRSZWNlbnRSZWxlYXNlc0luaXRpYWxpemUiLCJldmVudCIsInRhcmdldCIsInZhbHVlIiwiJCIsImdldCIsIlVybCIsInRoZW4iLCJjb25zb2xlIiwibG9nIiwibW92aWVzV2l0aFJhdGluZ3MiLCJtb3ZpZXNGcm9tT01EQiIsImxlbmd0aCIsInBvc3QiLCJkb25lIiwiY2hhckNvZGUiLCJ0aGF0IiwiYWpheCIsInVybCIsImpzb25wIiwiZGF0YVR5cGUiLCJkYXRhIiwicXVlcnkiLCJhcGlfa2V5IiwiZm9ybWF0Iiwic3VjY2VzcyIsInJlc3BvbnNlIiwic29ydGVkIiwiXyIsInNvcnRCeSIsInJlc3VsdHMiLCJnZXRVc2VyUmF0aW5nc0Zvck1vdmllcyIsImxhYmxlIiwiZmVlZGJhY2tNc2ciLCJiaW5kIiwiaGFuZGxlQ2hhbmdlIiwiaGFuZGxlU2VhcmNoIiwiY2hhbmdlIiwiUmVhY3QiLCJDb21wb25lbnQiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTUEsSTs7O0FBQ0osZ0JBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSw0R0FDWEEsS0FEVzs7QUFHakIsVUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGNBQVEsRUFERztBQUVYQyxZQUFNLGVBRks7QUFHWEMsa0JBQVksSUFIRDtBQUlYQyxxQkFBZSxJQUpKO0FBS1hDLGNBQVE7QUFMRyxLQUFiO0FBSGlCO0FBVWxCOztBQUVEOzs7OztnQ0FDWUMsVyxFQUFhO0FBQ3ZCLFdBQUtDLFFBQUwsQ0FBYztBQUNaTCxjQUFNSTtBQURNLE9BQWQ7QUFHRDs7QUFFRDs7Ozt3Q0FDb0I7QUFDbEIsV0FBS0UsMkJBQUw7QUFDRDs7O2lDQUVZQyxLLEVBQU87QUFDbEIsV0FBS0YsUUFBTCxDQUFjO0FBQ1pGLGdCQUFRSSxNQUFNQyxNQUFOLENBQWFDO0FBRFQsT0FBZDtBQUdEOzs7a0RBRTZCO0FBQUE7O0FBQzVCQyxRQUFFQyxHQUFGLENBQU1DLE1BQU0sZ0JBQVosRUFDQ0MsSUFERCxDQUNNLDZCQUFxQjtBQUN6QkMsZ0JBQVFDLEdBQVIsQ0FBWSxzQkFBWixFQUFvQ0MsaUJBQXBDO0FBQ0EsZUFBS1gsUUFBTCxDQUFjO0FBQ1pOLGtCQUFRaUIsaUJBREk7QUFFWmQseUJBQWU7QUFGSCxTQUFkO0FBSUQsT0FQRDtBQVNEOztBQUVEO0FBQ0E7Ozs7NENBQ3dCZSxjLEVBQWdCO0FBQUE7O0FBQ3RDLFVBQUlBLGVBQWVDLE1BQWYsS0FBMEIsQ0FBOUIsRUFBaUM7QUFDL0IsYUFBS2IsUUFBTCxDQUFjO0FBQ1pOLGtCQUFRLEVBREk7QUFFWkcseUJBQWU7QUFGSCxTQUFkO0FBSUQsT0FMRCxNQUtPO0FBQ0xZLGdCQUFRQyxHQUFSLENBQVksYUFBWixFQUEyQkgsTUFBTSwwQkFBakM7QUFDQUYsVUFBRVMsSUFBRixDQUFPUCxNQUFNLDBCQUFiLEVBQXlDLEVBQUViLFFBQVFrQixjQUFWLEVBQXpDLEVBQ0NHLElBREQsQ0FDTSw2QkFBcUI7QUFDekJOLGtCQUFRQyxHQUFSLENBQVksc0JBQVosRUFBb0NDLGlCQUFwQztBQUNBLGlCQUFLWCxRQUFMLENBQWM7QUFDWk4sb0JBQVFpQixpQkFESTtBQUVaZCwyQkFBZTtBQUZILFdBQWQ7QUFJRCxTQVBEO0FBUUQ7QUFDRjs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7OztpQ0FDYUssSyxFQUFPO0FBQ2xCLFVBQUlBLE1BQU1jLFFBQU4sSUFBa0IsRUFBbEIsSUFBd0JkLFVBQVUsU0FBdEMsRUFBaUQ7QUFDL0MsWUFBSWUsT0FBTyxJQUFYOztBQUVBO0FBQ0FaLFVBQUVhLElBQUYsQ0FBTztBQUNMQyxlQUFLLDJDQURBO0FBRUxDLGlCQUFPLFVBRkY7QUFHTEMsb0JBQVUsT0FITDtBQUlMQyxnQkFBTTtBQUNGQyxtQkFBTyxLQUFLOUIsS0FBTCxDQUFXSyxNQURoQjtBQUVGMEIscUJBQVMsa0NBRlA7QUFHRkMsb0JBQVE7QUFITixXQUpEO0FBU0xDLG1CQUFTLGlCQUFTQyxRQUFULEVBQW1CO0FBQzFCLGdCQUFJQyxTQUFTQyxFQUFFQyxNQUFGLENBQVNILFNBQVNJLE9BQWxCLEVBQTJCLFlBQTNCLENBQWI7QUFDQWQsaUJBQUtlLHVCQUFMLENBQTZCSixNQUE3QjtBQUNEO0FBWkksU0FBUDtBQWNEO0FBQ0Y7Ozs2QkFFUTtBQUFBOztBQUVQLFVBQUlLLFFBQVEsaUJBQVo7QUFDQSxVQUFJQyxjQUFjLEVBQWxCO0FBQ0EsVUFBSSxLQUFLekMsS0FBTCxDQUFXSSxhQUFYLEtBQTZCLEtBQWpDLEVBQXdDO0FBQ3RDb0MsZ0JBQVEseUJBQVI7QUFDQSxZQUFJLEtBQUt4QyxLQUFMLENBQVdDLE1BQVgsQ0FBa0JtQixNQUFsQixLQUE2QixDQUFqQyxFQUFvQztBQUNsQ3FCLHdCQUFlO0FBQUE7QUFBQSxjQUFLLFdBQVUsVUFBZjtBQUFBO0FBQUEsV0FBZjtBQUNELFNBRkQsTUFFTztBQUNMQSx3QkFBZTtBQUFBO0FBQUEsY0FBSyxXQUFVLFlBQWY7QUFBQTtBQUFBLFdBQWY7QUFDRDtBQUNGOztBQUVELGFBQ0U7QUFBQTtBQUFBLFVBQUssV0FBVSxpQkFBZjtBQUNFO0FBQUE7QUFBQSxZQUFLLFdBQVUsUUFBZixFQUF3QixTQUFTLEtBQUtqQywyQkFBTCxDQUFpQ2tDLElBQWpDLENBQXNDLElBQXRDLENBQWpDO0FBQStFRjtBQUEvRSxTQURGO0FBRUU7QUFBQTtBQUFBLFlBQUssV0FBVSxhQUFmO0FBQ0UseUNBQU8sTUFBTSxNQUFiLEVBQW9CLElBQUcsWUFBdkI7QUFDRSx1QkFBVSxZQURaO0FBRUUseUJBQVksY0FGZDtBQUdFLG1CQUFPLEtBQUt4QyxLQUFMLENBQVdLLE1BSHBCO0FBSUUsc0JBQVUsS0FBS3NDLFlBQUwsQ0FBa0JELElBQWxCLENBQXVCLElBQXZCLENBSlo7QUFLRSx3QkFBWSxLQUFLRSxZQUFMLENBQWtCRixJQUFsQixDQUF1QixJQUF2QixDQUxkLEdBREY7QUFPRTtBQUFBO0FBQUEsY0FBRyxXQUFVLDhCQUFiLEVBQTRDLFNBQVM7QUFBQSx1QkFBTSxPQUFLRSxZQUFMLENBQWtCRixJQUFsQixTQUE2QixTQUE3QixDQUFOO0FBQUEsZUFBckQ7QUFBQTtBQUFBO0FBUEYsU0FGRjtBQVdHRCxtQkFYSDtBQVlFLDRCQUFDLFNBQUQsSUFBVyxRQUFRLEtBQUt6QyxLQUFMLENBQVdDLE1BQTlCO0FBQ0Esa0JBQVEsS0FBS0YsS0FBTCxDQUFXOEMsTUFBWCxDQUFrQkgsSUFBbEIsQ0FBdUIsSUFBdkI7QUFEUjtBQVpGLE9BREY7QUFrQkQ7Ozs7RUEzSGdCSSxNQUFNQyxTOztBQThIekJDLE9BQU9sRCxJQUFQLEdBQWNBLElBQWQiLCJmaWxlIjoiaG9tZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEhvbWUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgbW92aWVzOiBbXSxcclxuICAgICAgdmlldzogJ3JlY2VudFJlbGVhc2UnLFxyXG4gICAgICBmb2NhbE1vdmllOiBudWxsLFxyXG4gICAgICByZWNlbnRSZWxlYXNlOiB0cnVlLFxyXG4gICAgICBzZWFyY2g6ICcnXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLy9zaG91bGQgaGF2ZSBpdHMgb3duIGNoYW5nZSB2aWV3IGZ1bmN0aW9uXHJcbiAgY2hhbmdlVmlld3ModGFyZ2V0U3RhdGUpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB2aWV3OiB0YXJnZXRTdGF0ZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvL3Nob3cgcmVuZGVyIGEgbGlzdCBvZiByZWNlbnQgcmVsZWFzZXMgb24gaW5pdGlhbGl6ZVxyXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgdGhpcy5nZXRSZWNlbnRSZWxlYXNlc0luaXRpYWxpemUoKTtcclxuICB9XHJcblxyXG4gIGhhbmRsZUNoYW5nZShldmVudCkge1xyXG4gICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgIHNlYXJjaDogZXZlbnQudGFyZ2V0LnZhbHVlXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldFJlY2VudFJlbGVhc2VzSW5pdGlhbGl6ZSgpIHtcclxuICAgICQuZ2V0KFVybCArICcvcmVjZW50UmVsZWFzZScpXHJcbiAgICAudGhlbihtb3ZpZXNXaXRoUmF0aW5ncyA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdyZXNwb25zZSBmcm9tIHNlcnZlcicsIG1vdmllc1dpdGhSYXRpbmdzKTtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgbW92aWVzOiBtb3ZpZXNXaXRoUmF0aW5ncyxcclxuICAgICAgICByZWNlbnRSZWxlYXNlOiB0cnVlXHJcbiAgICAgIH0pO1xyXG4gICAgfSlcclxuICAgIFxyXG4gIH1cclxuXHJcbiAgLy9mdW5jdGlvbiB0aGF0IHRha2VzIG1vdmllcyBmcm9tIGV4dGVybmFsIEFQSSBhbmQgcXVlcnkgdGhlIGRhdGFiYXNlIGZvciByYXRpbmdzXHJcbiAgLy93aWxsIHNldCB0aGUgbW92aWVzIHN0YXRlIGFmdGVyIHJhdGluZ3MgYXJlIHN1Y2Nlc3NmdWxseSByZXRyaXZlZFxyXG4gIGdldFVzZXJSYXRpbmdzRm9yTW92aWVzKG1vdmllc0Zyb21PTURCKSB7XHJcbiAgICBpZiAobW92aWVzRnJvbU9NREIubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIG1vdmllczogW10sXHJcbiAgICAgICAgcmVjZW50UmVsZWFzZTogZmFsc2VcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZygncG9zdGluZyB0bzonLCBVcmwgKyAnL2dldE11bHRpcGxlTW92aWVSYXRpbmdzJyk7XHJcbiAgICAgICQucG9zdChVcmwgKyAnL2dldE11bHRpcGxlTW92aWVSYXRpbmdzJywgeyBtb3ZpZXM6IG1vdmllc0Zyb21PTURCIH0pXHJcbiAgICAgIC5kb25lKG1vdmllc1dpdGhSYXRpbmdzID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZygncmVzcG9uc2UgZnJvbSBzZXJ2ZXInLCBtb3ZpZXNXaXRoUmF0aW5ncyk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICBtb3ZpZXM6IG1vdmllc1dpdGhSYXRpbmdzLFxyXG4gICAgICAgICAgcmVjZW50UmVsZWFzZTogZmFsc2VcclxuICAgICAgICB9KTtcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAvLy8vL0V2ZW50IEhhbmRsZXJzXHJcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAvL3RoaXMgd2lsbCBjYWxsIHNlYXJjaCBmb3IgYSBtb3ZpZSBmcm9tIGV4dGVybmFsIEFQSSwgZG8gYSBkYXRhYmFzZSBxdWVyeSBmb3IgcmF0aW5nXHJcbiAgLy9hbmQgc2V0IHRoZSByZXBvbnNlIHRvIHRoZSBtb3ZpZXMgc3RhdGVcclxuICBoYW5kbGVTZWFyY2goZXZlbnQpIHtcclxuICAgIGlmIChldmVudC5jaGFyQ29kZSA9PSAxMyB8fCBldmVudCA9PT0gJ2NsaWNrZWQnKSB7XHJcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgIC8vdGhpcyB3aWxsIHNlYXJjaCBUTURCIGZvciBtb3ZpZSBhbmQgc2VuZCBpdCB0byBzZXJ2ZXIgdG8gcmV0cml2ZSB1c2VyIHJhdGluZ3NcclxuICAgICAgJC5hamF4KHtcclxuICAgICAgICB1cmw6IFwiaHR0cHM6Ly9hcGkudGhlbW92aWVkYi5vcmcvMy9zZWFyY2gvbW92aWVcIixcclxuICAgICAgICBqc29ucDogXCJjYWxsYmFja1wiLFxyXG4gICAgICAgIGRhdGFUeXBlOiBcImpzb25wXCIsXHJcbiAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICBxdWVyeTogdGhpcy5zdGF0ZS5zZWFyY2gsXHJcbiAgICAgICAgICAgIGFwaV9rZXk6IFwiOWQzYjAzNWVmMWNkNjY5YWVkMzk4NDAwYjE3ZmNlYTJcIixcclxuICAgICAgICAgICAgZm9ybWF0OiBcImpzb25cIixcclxuICAgICAgICB9LFxyXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICB2YXIgc29ydGVkID0gXy5zb3J0QnkocmVzcG9uc2UucmVzdWx0cywgJ2ltZGJSYXRpbmcnKTtcclxuICAgICAgICAgIHRoYXQuZ2V0VXNlclJhdGluZ3NGb3JNb3ZpZXMoc29ydGVkKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgXHJcbiAgICB2YXIgbGFibGUgPSAncmVjZW50IHJlbGVhc2VzJztcclxuICAgIHZhciBmZWVkYmFja01zZyA9ICcnO1xyXG4gICAgaWYgKHRoaXMuc3RhdGUucmVjZW50UmVsZWFzZSA9PT0gZmFsc2UpIHtcclxuICAgICAgbGFibGUgPSAnYmFjayB0byByZWNlbnQgcmVsZWFzZXMnO1xyXG4gICAgICBpZiAodGhpcy5zdGF0ZS5tb3ZpZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgZmVlZGJhY2tNc2cgPSAoPGRpdiBjbGFzc05hbWU9XCJlcnJvck1zZ1wiPm5vIG1hdGNoIGZvdW5kLCBwbGVhc2UgdHJ5IGFub3RoZXIgdGl0bGU8L2Rpdj4pXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZmVlZGJhY2tNc2cgPSAoPGRpdiBjbGFzc05hbWU9XCJ1cGRhdGVkTXNnXCI+YWxsIG1hdGNoIHJlc3VsdHM6PC9kaXY+KVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBjbGFzc05hbWU9J0hvbWUgY29sbGVjdGlvbic+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2hlYWRlcicgb25DbGljaz17dGhpcy5nZXRSZWNlbnRSZWxlYXNlc0luaXRpYWxpemUuYmluZCh0aGlzKX0+e2xhYmxlfTwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdzZWFyY2hNb3ZpZSc+XHJcbiAgICAgICAgICA8aW5wdXQgdHlwZSA9J3RleHQnIGlkPSdtb3ZpZUlucHV0JyBcclxuICAgICAgICAgICAgY2xhc3NOYW1lPSdtb3ZpZUlucHV0J1xyXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj0nZmluZCBhIG1vdmllJ1xyXG4gICAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5zZWFyY2h9XHJcbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAgICBvbktleVByZXNzPXt0aGlzLmhhbmRsZVNlYXJjaC5iaW5kKHRoaXMpfS8+XHJcbiAgICAgICAgICA8YSBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17KCkgPT4gdGhpcy5oYW5kbGVTZWFyY2guYmluZCh0aGlzKSgnY2xpY2tlZCcpfT5zZWFyY2g8L2E+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAge2ZlZWRiYWNrTXNnfVxyXG4gICAgICAgIDxNb3ZpZUxpc3QgbW92aWVzPXt0aGlzLnN0YXRlLm1vdmllc31cclxuICAgICAgICBjaGFuZ2U9e3RoaXMucHJvcHMuY2hhbmdlLmJpbmQodGhpcyl9XHJcbiAgICAgICAgLz5cclxuICAgICAgPC9kaXY+XHJcbiAgICApXHJcbiAgfVxyXG59XHJcblxyXG53aW5kb3cuSG9tZSA9IEhvbWU7Il19
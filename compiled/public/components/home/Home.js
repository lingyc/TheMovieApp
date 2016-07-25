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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL2hvbWUvaG9tZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sSTs7O0FBQ0osZ0JBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLHdGQUNYLEtBRFc7O0FBR2pCLFVBQUssS0FBTCxHQUFhO0FBQ1gsY0FBUSxFQURHO0FBRVgsWUFBTSxlQUZLO0FBR1gsa0JBQVksSUFIRDtBQUlYLHFCQUFlLElBSko7QUFLWCxjQUFRO0FBTEcsS0FBYjtBQUhpQjtBQVVsQjs7Ozs7OztnQ0FHVyxXLEVBQWE7QUFDdkIsV0FBSyxRQUFMLENBQWM7QUFDWixjQUFNO0FBRE0sT0FBZDtBQUdEOzs7Ozs7d0NBR21CO0FBQ2xCLFdBQUssMkJBQUw7QUFDRDs7O2lDQUVZLEssRUFBTztBQUNsQixXQUFLLFFBQUwsQ0FBYztBQUNaLGdCQUFRLE1BQU0sTUFBTixDQUFhO0FBRFQsT0FBZDtBQUdEOzs7a0RBRTZCO0FBQUE7O0FBQzVCLFFBQUUsR0FBRixDQUFNLE1BQU0sZ0JBQVosRUFDQyxJQURELENBQ00sNkJBQXFCO0FBQ3pCLGdCQUFRLEdBQVIsQ0FBWSxzQkFBWixFQUFvQyxpQkFBcEM7QUFDQSxlQUFLLFFBQUwsQ0FBYztBQUNaLGtCQUFRLGlCQURJO0FBRVoseUJBQWU7QUFGSCxTQUFkO0FBSUQsT0FQRDtBQVNEOzs7Ozs7OzRDQUl1QixjLEVBQWdCO0FBQUE7O0FBQ3RDLFVBQUksZUFBZSxNQUFmLEtBQTBCLENBQTlCLEVBQWlDO0FBQy9CLGFBQUssUUFBTCxDQUFjO0FBQ1osa0JBQVEsRUFESTtBQUVaLHlCQUFlO0FBRkgsU0FBZDtBQUlELE9BTEQsTUFLTztBQUNMLGdCQUFRLEdBQVIsQ0FBWSxhQUFaLEVBQTJCLE1BQU0sMEJBQWpDO0FBQ0EsVUFBRSxJQUFGLENBQU8sTUFBTSwwQkFBYixFQUF5QyxFQUFFLFFBQVEsY0FBVixFQUF6QyxFQUNDLElBREQsQ0FDTSw2QkFBcUI7QUFDekIsa0JBQVEsR0FBUixDQUFZLHNCQUFaLEVBQW9DLGlCQUFwQztBQUNBLGlCQUFLLFFBQUwsQ0FBYztBQUNaLG9CQUFRLGlCQURJO0FBRVosMkJBQWU7QUFGSCxXQUFkO0FBSUQsU0FQRDtBQVFEO0FBQ0Y7Ozs7Ozs7Ozs7O2lDQVFZLEssRUFBTztBQUNsQixVQUFJLE1BQU0sUUFBTixJQUFrQixFQUFsQixJQUF3QixVQUFVLFNBQXRDLEVBQWlEO0FBQy9DLFlBQUksT0FBTyxJQUFYOzs7QUFHQSxVQUFFLElBQUYsQ0FBTztBQUNMLGVBQUssMkNBREE7QUFFTCxpQkFBTyxVQUZGO0FBR0wsb0JBQVUsT0FITDtBQUlMLGdCQUFNO0FBQ0YsbUJBQU8sS0FBSyxLQUFMLENBQVcsTUFEaEI7QUFFRixxQkFBUyxrQ0FGUDtBQUdGLG9CQUFRO0FBSE4sV0FKRDtBQVNMLG1CQUFTLGlCQUFTLFFBQVQsRUFBbUI7QUFDMUIsZ0JBQUksU0FBUyxFQUFFLE1BQUYsQ0FBUyxTQUFTLE9BQWxCLEVBQTJCLFlBQTNCLENBQWI7QUFDQSxpQkFBSyx1QkFBTCxDQUE2QixNQUE3QjtBQUNEO0FBWkksU0FBUDtBQWNEO0FBQ0Y7Ozs2QkFFUTtBQUFBOztBQUVQLFVBQUksUUFBUSxpQkFBWjtBQUNBLFVBQUksY0FBYyxFQUFsQjtBQUNBLFVBQUksS0FBSyxLQUFMLENBQVcsYUFBWCxLQUE2QixLQUFqQyxFQUF3QztBQUN0QyxnQkFBUSx5QkFBUjtBQUNBLFlBQUksS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixNQUFsQixLQUE2QixDQUFqQyxFQUFvQztBQUNsQyx3QkFBZTtBQUFBO0FBQUEsY0FBSyxXQUFVLFVBQWY7QUFBQTtBQUFBLFdBQWY7QUFDRCxTQUZELE1BRU87QUFDTCx3QkFBZTtBQUFBO0FBQUEsY0FBSyxXQUFVLFlBQWY7QUFBQTtBQUFBLFdBQWY7QUFDRDtBQUNGOztBQUVELGFBQ0U7QUFBQTtBQUFBLFVBQUssV0FBVSxpQkFBZjtBQUNFO0FBQUE7QUFBQSxZQUFLLFdBQVUsUUFBZixFQUF3QixTQUFTLEtBQUssMkJBQUwsQ0FBaUMsSUFBakMsQ0FBc0MsSUFBdEMsQ0FBakM7QUFBK0U7QUFBL0UsU0FERjtBQUVFO0FBQUE7QUFBQSxZQUFLLFdBQVUsYUFBZjtBQUNFLHlDQUFPLE1BQU0sTUFBYixFQUFvQixJQUFHLFlBQXZCO0FBQ0UsdUJBQVUsWUFEWjtBQUVFLHlCQUFZLGNBRmQ7QUFHRSxtQkFBTyxLQUFLLEtBQUwsQ0FBVyxNQUhwQjtBQUlFLHNCQUFVLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixJQUF2QixDQUpaO0FBS0Usd0JBQVksS0FBSyxZQUFMLENBQWtCLElBQWxCLENBQXVCLElBQXZCLENBTGQsR0FERjtBQU9FO0FBQUE7QUFBQSxjQUFHLFdBQVUsOEJBQWIsRUFBNEMsU0FBUztBQUFBLHVCQUFNLE9BQUssWUFBTCxDQUFrQixJQUFsQixTQUE2QixTQUE3QixDQUFOO0FBQUEsZUFBckQ7QUFBQTtBQUFBO0FBUEYsU0FGRjtBQVdHLG1CQVhIO0FBWUUsNEJBQUMsU0FBRCxJQUFXLFFBQVEsS0FBSyxLQUFMLENBQVcsTUFBOUI7QUFDQSxrQkFBUSxLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLElBQWxCLENBQXVCLElBQXZCO0FBRFI7QUFaRixPQURGO0FBa0JEOzs7O0VBM0hnQixNQUFNLFM7O0FBOEh6QixPQUFPLElBQVAsR0FBYyxJQUFkIiwiZmlsZSI6ImhvbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBIb21lIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbW92aWVzOiBbXSxcbiAgICAgIHZpZXc6ICdyZWNlbnRSZWxlYXNlJyxcbiAgICAgIGZvY2FsTW92aWU6IG51bGwsXG4gICAgICByZWNlbnRSZWxlYXNlOiB0cnVlLFxuICAgICAgc2VhcmNoOiAnJ1xuICAgIH07XG4gIH1cblxuICAvL3Nob3VsZCBoYXZlIGl0cyBvd24gY2hhbmdlIHZpZXcgZnVuY3Rpb25cbiAgY2hhbmdlVmlld3ModGFyZ2V0U3RhdGUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHZpZXc6IHRhcmdldFN0YXRlXG4gICAgfSk7XG4gIH1cblxuICAvL3Nob3cgcmVuZGVyIGEgbGlzdCBvZiByZWNlbnQgcmVsZWFzZXMgb24gaW5pdGlhbGl6ZVxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLmdldFJlY2VudFJlbGVhc2VzSW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWFyY2g6IGV2ZW50LnRhcmdldC52YWx1ZVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0UmVjZW50UmVsZWFzZXNJbml0aWFsaXplKCkge1xuICAgICQuZ2V0KFVybCArICcvcmVjZW50UmVsZWFzZScpXG4gICAgLnRoZW4obW92aWVzV2l0aFJhdGluZ3MgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlIGZyb20gc2VydmVyJywgbW92aWVzV2l0aFJhdGluZ3MpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG1vdmllczogbW92aWVzV2l0aFJhdGluZ3MsXG4gICAgICAgIHJlY2VudFJlbGVhc2U6IHRydWVcbiAgICAgIH0pO1xuICAgIH0pXG4gICAgXG4gIH1cblxuICAvL2Z1bmN0aW9uIHRoYXQgdGFrZXMgbW92aWVzIGZyb20gZXh0ZXJuYWwgQVBJIGFuZCBxdWVyeSB0aGUgZGF0YWJhc2UgZm9yIHJhdGluZ3NcbiAgLy93aWxsIHNldCB0aGUgbW92aWVzIHN0YXRlIGFmdGVyIHJhdGluZ3MgYXJlIHN1Y2Nlc3NmdWxseSByZXRyaXZlZFxuICBnZXRVc2VyUmF0aW5nc0Zvck1vdmllcyhtb3ZpZXNGcm9tT01EQikge1xuICAgIGlmIChtb3ZpZXNGcm9tT01EQi5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBtb3ZpZXM6IFtdLFxuICAgICAgICByZWNlbnRSZWxlYXNlOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdwb3N0aW5nIHRvOicsIFVybCArICcvZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MnKTtcbiAgICAgICQucG9zdChVcmwgKyAnL2dldE11bHRpcGxlTW92aWVSYXRpbmdzJywgeyBtb3ZpZXM6IG1vdmllc0Zyb21PTURCIH0pXG4gICAgICAuZG9uZShtb3ZpZXNXaXRoUmF0aW5ncyA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdyZXNwb25zZSBmcm9tIHNlcnZlcicsIG1vdmllc1dpdGhSYXRpbmdzKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgbW92aWVzOiBtb3ZpZXNXaXRoUmF0aW5ncyxcbiAgICAgICAgICByZWNlbnRSZWxlYXNlOiBmYWxzZVxuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAvLy8vL0V2ZW50IEhhbmRsZXJzXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAvL3RoaXMgd2lsbCBjYWxsIHNlYXJjaCBmb3IgYSBtb3ZpZSBmcm9tIGV4dGVybmFsIEFQSSwgZG8gYSBkYXRhYmFzZSBxdWVyeSBmb3IgcmF0aW5nXG4gIC8vYW5kIHNldCB0aGUgcmVwb25zZSB0byB0aGUgbW92aWVzIHN0YXRlXG4gIGhhbmRsZVNlYXJjaChldmVudCkge1xuICAgIGlmIChldmVudC5jaGFyQ29kZSA9PSAxMyB8fCBldmVudCA9PT0gJ2NsaWNrZWQnKSB7XG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgIC8vdGhpcyB3aWxsIHNlYXJjaCBUTURCIGZvciBtb3ZpZSBhbmQgc2VuZCBpdCB0byBzZXJ2ZXIgdG8gcmV0cml2ZSB1c2VyIHJhdGluZ3NcbiAgICAgICQuYWpheCh7XG4gICAgICAgIHVybDogXCJodHRwczovL2FwaS50aGVtb3ZpZWRiLm9yZy8zL3NlYXJjaC9tb3ZpZVwiLFxuICAgICAgICBqc29ucDogXCJjYWxsYmFja1wiLFxuICAgICAgICBkYXRhVHlwZTogXCJqc29ucFwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBxdWVyeTogdGhpcy5zdGF0ZS5zZWFyY2gsXG4gICAgICAgICAgICBhcGlfa2V5OiBcIjlkM2IwMzVlZjFjZDY2OWFlZDM5ODQwMGIxN2ZjZWEyXCIsXG4gICAgICAgICAgICBmb3JtYXQ6IFwianNvblwiLFxuICAgICAgICB9LFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgIHZhciBzb3J0ZWQgPSBfLnNvcnRCeShyZXNwb25zZS5yZXN1bHRzLCAnaW1kYlJhdGluZycpO1xuICAgICAgICAgIHRoYXQuZ2V0VXNlclJhdGluZ3NGb3JNb3ZpZXMoc29ydGVkKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIFxuICAgIHZhciBsYWJsZSA9ICdyZWNlbnQgcmVsZWFzZXMnO1xuICAgIHZhciBmZWVkYmFja01zZyA9ICcnO1xuICAgIGlmICh0aGlzLnN0YXRlLnJlY2VudFJlbGVhc2UgPT09IGZhbHNlKSB7XG4gICAgICBsYWJsZSA9ICdiYWNrIHRvIHJlY2VudCByZWxlYXNlcyc7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5tb3ZpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGZlZWRiYWNrTXNnID0gKDxkaXYgY2xhc3NOYW1lPVwiZXJyb3JNc2dcIj5ubyBtYXRjaCBmb3VuZCwgcGxlYXNlIHRyeSBhbm90aGVyIHRpdGxlPC9kaXY+KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZmVlZGJhY2tNc2cgPSAoPGRpdiBjbGFzc05hbWU9XCJ1cGRhdGVkTXNnXCI+YWxsIG1hdGNoIHJlc3VsdHM6PC9kaXY+KVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nSG9tZSBjb2xsZWN0aW9uJz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2hlYWRlcicgb25DbGljaz17dGhpcy5nZXRSZWNlbnRSZWxlYXNlc0luaXRpYWxpemUuYmluZCh0aGlzKX0+e2xhYmxlfTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nc2VhcmNoTW92aWUnPlxuICAgICAgICAgIDxpbnB1dCB0eXBlID0ndGV4dCcgaWQ9J21vdmllSW5wdXQnIFxuICAgICAgICAgICAgY2xhc3NOYW1lPSdtb3ZpZUlucHV0J1xuICAgICAgICAgICAgcGxhY2Vob2xkZXI9J2ZpbmQgYSBtb3ZpZSdcbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnNlYXJjaH1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgb25LZXlQcmVzcz17dGhpcy5oYW5kbGVTZWFyY2guYmluZCh0aGlzKX0vPlxuICAgICAgICAgIDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXsoKSA9PiB0aGlzLmhhbmRsZVNlYXJjaC5iaW5kKHRoaXMpKCdjbGlja2VkJyl9PnNlYXJjaDwvYT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHtmZWVkYmFja01zZ31cbiAgICAgICAgPE1vdmllTGlzdCBtb3ZpZXM9e3RoaXMuc3RhdGUubW92aWVzfVxuICAgICAgICBjaGFuZ2U9e3RoaXMucHJvcHMuY2hhbmdlLmJpbmQodGhpcyl9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxud2luZG93LkhvbWUgPSBIb21lOyJdfQ==
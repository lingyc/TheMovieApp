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
      recentRelease: true
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
    key: 'getRecentReleasesInitialize',
    value: function getRecentReleasesInitialize() {
      var _this2 = this;

      $.get('http://127.0.0.1:3000/recentRelease').then(function (moviesWithRatings) {
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

      console.log('posting to:', 'http://127.0.0.1:3000/getMultipleMovieRatings');
      $.post('http://127.0.0.1:3000/getMultipleMovieRatings', { movies: moviesFromOMDB }).done(function (moviesWithRatings) {
        console.log('response from server', moviesWithRatings);
        _this3.setState({
          movies: moviesWithRatings,
          recentRelease: false
        });
      });
    }

    //////////////////////
    /////Event Handlers
    //////////////////////

    //this will call search for a movie from external API, do a database query for rating
    //and set the reponse to the movies state

  }, {
    key: 'handleSearch',
    value: function handleSearch(event) {
      if (event.charCode == 13) {
        var that = this;

        //this will search TMDB for movie and send it to server to retrive user ratings
        $.ajax({
          url: "http://api.themoviedb.org/3/search/movie",
          jsonp: "callback",
          dataType: "jsonp",
          data: {
            query: event.target.value,
            api_key: "9d3b035ef1cd669aed398400b17fcea2",
            format: "json"
          },
          success: function success(response) {
            var sorted = _.sortBy(response.results, 'release_date').reverse();
            that.getUserRatingsForMovies(sorted);
          }
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var lable = 'recent releases';
      if (this.state.recentRelease === false) {
        lable = 'back to recent releases';
      }

      return React.createElement(
        'div',
        { className: 'Home' },
        React.createElement(
          'div',
          { onClick: this.getRecentReleasesInitialize.bind(this) },
          lable
        ),
        React.createElement(
          'div',
          { className: 'searchMovie' },
          React.createElement('input', { type: 'text', id: 'movieInput',
            className: 'movieInput',
            placeholder: 'Insert Movie Title',
            onKeyPress: this.handleSearch.bind(this) })
        ),
        React.createElement(MovieList, { movies: this.state.movies,
          change: this.props.change.bind(this)
        })
      );
    }
  }]);

  return Home;
}(React.Component);

window.Home = Home;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL2hvbWUvaG9tZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sSTs7O0FBQ0osZ0JBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLHdGQUNYLEtBRFc7O0FBR2pCLFVBQUssS0FBTCxHQUFhO0FBQ1gsY0FBUSxFQURHO0FBRVgsWUFBTSxlQUZLO0FBR1gsa0JBQVksSUFIRDtBQUlYLHFCQUFlO0FBSkosS0FBYjtBQUhpQjtBQVNsQjs7Ozs7OztnQ0FHVyxXLEVBQWE7QUFDdkIsV0FBSyxRQUFMLENBQWM7QUFDWixjQUFNO0FBRE0sT0FBZDtBQUdEOzs7Ozs7d0NBR21CO0FBQ2xCLFdBQUssMkJBQUw7QUFDRDs7O2tEQUU2QjtBQUFBOztBQUM1QixRQUFFLEdBQUYsQ0FBTSxxQ0FBTixFQUNDLElBREQsQ0FDTSw2QkFBcUI7QUFDekIsZ0JBQVEsR0FBUixDQUFZLHNCQUFaLEVBQW9DLGlCQUFwQztBQUNBLGVBQUssUUFBTCxDQUFjO0FBQ1osa0JBQVEsaUJBREk7QUFFWix5QkFBZTtBQUZILFNBQWQ7QUFJRCxPQVBEO0FBU0Q7Ozs7Ozs7NENBSXVCLGMsRUFBZ0I7QUFBQTs7QUFDdEMsY0FBUSxHQUFSLENBQVksYUFBWixFQUEyQiwrQ0FBM0I7QUFDQSxRQUFFLElBQUYsQ0FBTywrQ0FBUCxFQUF3RCxFQUFFLFFBQVEsY0FBVixFQUF4RCxFQUNDLElBREQsQ0FDTSw2QkFBcUI7QUFDekIsZ0JBQVEsR0FBUixDQUFZLHNCQUFaLEVBQW9DLGlCQUFwQztBQUNBLGVBQUssUUFBTCxDQUFjO0FBQ1osa0JBQVEsaUJBREk7QUFFWix5QkFBZTtBQUZILFNBQWQ7QUFJRCxPQVBEO0FBUUQ7Ozs7Ozs7Ozs7O2lDQVFZLEssRUFBTztBQUNsQixVQUFJLE1BQU0sUUFBTixJQUFrQixFQUF0QixFQUEwQjtBQUN4QixZQUFJLE9BQU8sSUFBWDs7O0FBR0EsVUFBRSxJQUFGLENBQU87QUFDTCxlQUFLLDBDQURBO0FBRUwsaUJBQU8sVUFGRjtBQUdMLG9CQUFVLE9BSEw7QUFJTCxnQkFBTTtBQUNGLG1CQUFPLE1BQU0sTUFBTixDQUFhLEtBRGxCO0FBRUYscUJBQVMsa0NBRlA7QUFHRixvQkFBUTtBQUhOLFdBSkQ7QUFTTCxtQkFBUyxpQkFBUyxRQUFULEVBQW1CO0FBQzFCLGdCQUFJLFNBQVMsRUFBRSxNQUFGLENBQVMsU0FBUyxPQUFsQixFQUEyQixjQUEzQixFQUEyQyxPQUEzQyxFQUFiO0FBQ0EsaUJBQUssdUJBQUwsQ0FBNkIsTUFBN0I7QUFDRDtBQVpJLFNBQVA7QUFjRDtBQUNGOzs7NkJBRVE7QUFDUCxVQUFJLFFBQVEsaUJBQVo7QUFDQSxVQUFJLEtBQUssS0FBTCxDQUFXLGFBQVgsS0FBNkIsS0FBakMsRUFBd0M7QUFDdEMsZ0JBQVEseUJBQVI7QUFDRDs7QUFFRCxhQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUsTUFBZjtBQUNFO0FBQUE7QUFBQSxZQUFLLFNBQVMsS0FBSywyQkFBTCxDQUFpQyxJQUFqQyxDQUFzQyxJQUF0QyxDQUFkO0FBQTREO0FBQTVELFNBREY7QUFFRTtBQUFBO0FBQUEsWUFBSyxXQUFVLGFBQWY7QUFDRSx5Q0FBTyxNQUFNLE1BQWIsRUFBb0IsSUFBRyxZQUF2QjtBQUNFLHVCQUFVLFlBRFo7QUFFRSx5QkFBWSxvQkFGZDtBQUdFLHdCQUFZLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixJQUF2QixDQUhkO0FBREYsU0FGRjtBQVFFLDRCQUFDLFNBQUQsSUFBVyxRQUFRLEtBQUssS0FBTCxDQUFXLE1BQTlCO0FBQ0Esa0JBQVEsS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixJQUFsQixDQUF1QixJQUF2QjtBQURSO0FBUkYsT0FERjtBQWNEOzs7O0VBbEdnQixNQUFNLFM7O0FBcUd6QixPQUFPLElBQVAsR0FBYyxJQUFkIiwiZmlsZSI6ImhvbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBIb21lIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbW92aWVzOiBbXSxcbiAgICAgIHZpZXc6ICdyZWNlbnRSZWxlYXNlJyxcbiAgICAgIGZvY2FsTW92aWU6IG51bGwsXG4gICAgICByZWNlbnRSZWxlYXNlOiB0cnVlXG4gICAgfTtcbiAgfVxuXG4gIC8vc2hvdWxkIGhhdmUgaXRzIG93biBjaGFuZ2UgdmlldyBmdW5jdGlvblxuICBjaGFuZ2VWaWV3cyh0YXJnZXRTdGF0ZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdmlldzogdGFyZ2V0U3RhdGVcbiAgICB9KTtcbiAgfVxuXG4gIC8vc2hvdyByZW5kZXIgYSBsaXN0IG9mIHJlY2VudCByZWxlYXNlcyBvbiBpbml0aWFsaXplXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuZ2V0UmVjZW50UmVsZWFzZXNJbml0aWFsaXplKCk7XG4gIH1cblxuICBnZXRSZWNlbnRSZWxlYXNlc0luaXRpYWxpemUoKSB7XG4gICAgJC5nZXQoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9yZWNlbnRSZWxlYXNlJylcbiAgICAudGhlbihtb3ZpZXNXaXRoUmF0aW5ncyA9PiB7XG4gICAgICBjb25zb2xlLmxvZygncmVzcG9uc2UgZnJvbSBzZXJ2ZXInLCBtb3ZpZXNXaXRoUmF0aW5ncyk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbW92aWVzOiBtb3ZpZXNXaXRoUmF0aW5ncyxcbiAgICAgICAgcmVjZW50UmVsZWFzZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSlcbiAgICBcbiAgfVxuXG4gIC8vZnVuY3Rpb24gdGhhdCB0YWtlcyBtb3ZpZXMgZnJvbSBleHRlcm5hbCBBUEkgYW5kIHF1ZXJ5IHRoZSBkYXRhYmFzZSBmb3IgcmF0aW5nc1xuICAvL3dpbGwgc2V0IHRoZSBtb3ZpZXMgc3RhdGUgYWZ0ZXIgcmF0aW5ncyBhcmUgc3VjY2Vzc2Z1bGx5IHJldHJpdmVkXG4gIGdldFVzZXJSYXRpbmdzRm9yTW92aWVzKG1vdmllc0Zyb21PTURCKSB7XG4gICAgY29uc29sZS5sb2coJ3Bvc3RpbmcgdG86JywgJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9nZXRNdWx0aXBsZU1vdmllUmF0aW5ncycpO1xuICAgICQucG9zdCgnaHR0cDovLzEyNy4wLjAuMTozMDAwL2dldE11bHRpcGxlTW92aWVSYXRpbmdzJywgeyBtb3ZpZXM6IG1vdmllc0Zyb21PTURCIH0pXG4gICAgLmRvbmUobW92aWVzV2l0aFJhdGluZ3MgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlIGZyb20gc2VydmVyJywgbW92aWVzV2l0aFJhdGluZ3MpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG1vdmllczogbW92aWVzV2l0aFJhdGluZ3MsXG4gICAgICAgIHJlY2VudFJlbGVhc2U6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9KVxuICB9XG5cbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAvLy8vL0V2ZW50IEhhbmRsZXJzXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAvL3RoaXMgd2lsbCBjYWxsIHNlYXJjaCBmb3IgYSBtb3ZpZSBmcm9tIGV4dGVybmFsIEFQSSwgZG8gYSBkYXRhYmFzZSBxdWVyeSBmb3IgcmF0aW5nXG4gIC8vYW5kIHNldCB0aGUgcmVwb25zZSB0byB0aGUgbW92aWVzIHN0YXRlXG4gIGhhbmRsZVNlYXJjaChldmVudCkge1xuICAgIGlmIChldmVudC5jaGFyQ29kZSA9PSAxMykge1xuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAvL3RoaXMgd2lsbCBzZWFyY2ggVE1EQiBmb3IgbW92aWUgYW5kIHNlbmQgaXQgdG8gc2VydmVyIHRvIHJldHJpdmUgdXNlciByYXRpbmdzXG4gICAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IFwiaHR0cDovL2FwaS50aGVtb3ZpZWRiLm9yZy8zL3NlYXJjaC9tb3ZpZVwiLFxuICAgICAgICBqc29ucDogXCJjYWxsYmFja1wiLFxuICAgICAgICBkYXRhVHlwZTogXCJqc29ucFwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBxdWVyeTogZXZlbnQudGFyZ2V0LnZhbHVlLFxuICAgICAgICAgICAgYXBpX2tleTogXCI5ZDNiMDM1ZWYxY2Q2NjlhZWQzOTg0MDBiMTdmY2VhMlwiLFxuICAgICAgICAgICAgZm9ybWF0OiBcImpzb25cIixcbiAgICAgICAgfSxcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICB2YXIgc29ydGVkID0gXy5zb3J0QnkocmVzcG9uc2UucmVzdWx0cywgJ3JlbGVhc2VfZGF0ZScpLnJldmVyc2UoKTtcbiAgICAgICAgICB0aGF0LmdldFVzZXJSYXRpbmdzRm9yTW92aWVzKHNvcnRlZCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICB2YXIgbGFibGUgPSAncmVjZW50IHJlbGVhc2VzJztcbiAgICBpZiAodGhpcy5zdGF0ZS5yZWNlbnRSZWxlYXNlID09PSBmYWxzZSkge1xuICAgICAgbGFibGUgPSAnYmFjayB0byByZWNlbnQgcmVsZWFzZXMnO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nSG9tZSc+IFxuICAgICAgICA8ZGl2IG9uQ2xpY2s9e3RoaXMuZ2V0UmVjZW50UmVsZWFzZXNJbml0aWFsaXplLmJpbmQodGhpcyl9PntsYWJsZX08L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3NlYXJjaE1vdmllJz5cbiAgICAgICAgICA8aW5wdXQgdHlwZSA9J3RleHQnIGlkPSdtb3ZpZUlucHV0JyBcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nbW92aWVJbnB1dCdcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPSdJbnNlcnQgTW92aWUgVGl0bGUnXG4gICAgICAgICAgICBvbktleVByZXNzPXt0aGlzLmhhbmRsZVNlYXJjaC5iaW5kKHRoaXMpfS8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8TW92aWVMaXN0IG1vdmllcz17dGhpcy5zdGF0ZS5tb3ZpZXN9XG4gICAgICAgIGNoYW5nZT17dGhpcy5wcm9wcy5jaGFuZ2UuYmluZCh0aGlzKX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG53aW5kb3cuSG9tZSA9IEhvbWU7Il19
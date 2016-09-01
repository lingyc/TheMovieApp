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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL2hvbWUvaG9tZS5qcyJdLCJuYW1lcyI6WyJIb21lIiwicHJvcHMiLCJzdGF0ZSIsIm1vdmllcyIsInZpZXciLCJmb2NhbE1vdmllIiwicmVjZW50UmVsZWFzZSIsInNlYXJjaCIsInRhcmdldFN0YXRlIiwic2V0U3RhdGUiLCJnZXRSZWNlbnRSZWxlYXNlc0luaXRpYWxpemUiLCJldmVudCIsInRhcmdldCIsInZhbHVlIiwiJCIsImdldCIsIlVybCIsInRoZW4iLCJjb25zb2xlIiwibG9nIiwibW92aWVzV2l0aFJhdGluZ3MiLCJtb3ZpZXNGcm9tT01EQiIsImxlbmd0aCIsInBvc3QiLCJkb25lIiwiY2hhckNvZGUiLCJ0aGF0IiwiYWpheCIsInVybCIsImpzb25wIiwiZGF0YVR5cGUiLCJkYXRhIiwicXVlcnkiLCJhcGlfa2V5IiwiZm9ybWF0Iiwic3VjY2VzcyIsInJlc3BvbnNlIiwic29ydGVkIiwiXyIsInNvcnRCeSIsInJlc3VsdHMiLCJnZXRVc2VyUmF0aW5nc0Zvck1vdmllcyIsImxhYmxlIiwiZmVlZGJhY2tNc2ciLCJiaW5kIiwiaGFuZGxlQ2hhbmdlIiwiaGFuZGxlU2VhcmNoIiwiY2hhbmdlIiwiUmVhY3QiLCJDb21wb25lbnQiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTUEsSTs7O0FBQ0osZ0JBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSw0R0FDWEEsS0FEVzs7QUFHakIsVUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGNBQVEsRUFERztBQUVYQyxZQUFNLGVBRks7QUFHWEMsa0JBQVksSUFIRDtBQUlYQyxxQkFBZSxJQUpKO0FBS1hDLGNBQVE7QUFMRyxLQUFiO0FBSGlCO0FBVWxCOztBQUVEOzs7OztnQ0FDWUMsVyxFQUFhO0FBQ3ZCLFdBQUtDLFFBQUwsQ0FBYztBQUNaTCxjQUFNSTtBQURNLE9BQWQ7QUFHRDs7QUFFRDs7Ozt3Q0FDb0I7QUFDbEIsV0FBS0UsMkJB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QUFLRSx3QkFBWSxLQUFLRSxZQUFMLENBQWtCRixJQUFsQixDQUF1QixJQUF2QixDQUxkLEdBREY7QUFPRTtBQUFBO0FBQUEsY0FBRyxXQUFVLDhCQUFiLEVBQTRDLFNBQVM7QUFBQSx1QkFBTSxPQUFLRSxZQUFMLENBQWtCRixJQUFsQixTQUE2QixTQUE3QixDQUFOO0FBQUEsZUFBckQ7QUFBQTtBQUFBO0FBUEYsU0FGRjtBQVdHRCxtQkFYSDtBQVlFLDRCQUFDLFNBQUQsSUFBVyxRQUFRLEtBQUt6QyxLQUFMLENBQVdDLE1BQTlCO0FBQ0Esa0JBQVEsS0FBS0YsS0FBTCxDQUFXOEMsTUFBWCxDQUFrQkgsSUFBbEIsQ0FBdUIsSUFBdkI7QUFEUjtBQVpGLE9BREY7QUFrQkQ7Ozs7RUEzSGdCSSxNQUFNQyxTOztBQThIekJDLE9BQU9sRCxJQUFQLEdBQWNBLElBQWQiLCJmaWxlIjoiaG9tZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIEhvbWUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBtb3ZpZXM6IFtdLFxuICAgICAgdmlldzogJ3JlY2VudFJlbGVhc2UnLFxuICAgICAgZm9jYWxNb3ZpZTogbnVsbCxcbiAgICAgIHJlY2VudFJlbGVhc2U6IHRydWUsXG4gICAgICBzZWFyY2g6ICcnXG4gICAgfTtcbiAgfVxuXG4gIC8vc2hvdWxkIGhhdmUgaXRzIG93biBjaGFuZ2UgdmlldyBmdW5jdGlvblxuICBjaGFuZ2VWaWV3cyh0YXJnZXRTdGF0ZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdmlldzogdGFyZ2V0U3RhdGVcbiAgICB9KTtcbiAgfVxuXG4gIC8vc2hvdyByZW5kZXIgYSBsaXN0IG9mIHJlY2VudCByZWxlYXNlcyBvbiBpbml0aWFsaXplXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuZ2V0UmVjZW50UmVsZWFzZXNJbml0aWFsaXplKCk7XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UoZXZlbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlYXJjaDogZXZlbnQudGFyZ2V0LnZhbHVlXG4gICAgfSk7XG4gIH1cblxuICBnZXRSZWNlbnRSZWxlYXNlc0luaXRpYWxpemUoKSB7XG4gICAgJC5nZXQoVXJsICsgJy9yZWNlbnRSZWxlYXNlJylcbiAgICAudGhlbihtb3ZpZXNXaXRoUmF0aW5ncyA9PiB7XG4gICAgICBjb25zb2xlLmxvZygncmVzcG9uc2UgZnJvbSBzZXJ2ZXInLCBtb3ZpZXNXaXRoUmF0aW5ncyk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbW92aWVzOiBtb3ZpZXNXaXRoUmF0aW5ncyxcbiAgICAgICAgcmVjZW50UmVsZWFzZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSlcbiAgICBcbiAgfVxuXG4gIC8vZnVuY3Rpb24gdGhhdCB0YWtlcyBtb3ZpZXMgZnJvbSBleHRlcm5hbCBBUEkgYW5kIHF1ZXJ5IHRoZSBkYXRhYmFzZSBmb3IgcmF0aW5nc1xuICAvL3dpbGwgc2V0IHRoZSBtb3ZpZXMgc3RhdGUgYWZ0ZXIgcmF0aW5ncyBhcmUgc3VjY2Vzc2Z1bGx5IHJldHJpdmVkXG4gIGdldFVzZXJSYXRpbmdzRm9yTW92aWVzKG1vdmllc0Zyb21PTURCKSB7XG4gICAgaWYgKG1vdmllc0Zyb21PTURCLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG1vdmllczogW10sXG4gICAgICAgIHJlY2VudFJlbGVhc2U6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ3Bvc3RpbmcgdG86JywgVXJsICsgJy9nZXRNdWx0aXBsZU1vdmllUmF0aW5ncycpO1xuICAgICAgJC5wb3N0KFVybCArICcvZ2V0TXVsdGlwbGVNb3ZpZVJhdGluZ3MnLCB7IG1vdmllczogbW92aWVzRnJvbU9NREIgfSlcbiAgICAgIC5kb25lKG1vdmllc1dpdGhSYXRpbmdzID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlIGZyb20gc2VydmVyJywgbW92aWVzV2l0aFJhdGluZ3MpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBtb3ZpZXM6IG1vdmllc1dpdGhSYXRpbmdzLFxuICAgICAgICAgIHJlY2VudFJlbGVhc2U6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIC8vLy8vRXZlbnQgSGFuZGxlcnNcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gIC8vdGhpcyB3aWxsIGNhbGwgc2VhcmNoIGZvciBhIG1vdmllIGZyb20gZXh0ZXJuYWwgQVBJLCBkbyBhIGRhdGFiYXNlIHF1ZXJ5IGZvciByYXRpbmdcbiAgLy9hbmQgc2V0IHRoZSByZXBvbnNlIHRvIHRoZSBtb3ZpZXMgc3RhdGVcbiAgaGFuZGxlU2VhcmNoKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmNoYXJDb2RlID09IDEzIHx8IGV2ZW50ID09PSAnY2xpY2tlZCcpIHtcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgLy90aGlzIHdpbGwgc2VhcmNoIFRNREIgZm9yIG1vdmllIGFuZCBzZW5kIGl0IHRvIHNlcnZlciB0byByZXRyaXZlIHVzZXIgcmF0aW5nc1xuICAgICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiBcImh0dHBzOi8vYXBpLnRoZW1vdmllZGIub3JnLzMvc2VhcmNoL21vdmllXCIsXG4gICAgICAgIGpzb25wOiBcImNhbGxiYWNrXCIsXG4gICAgICAgIGRhdGFUeXBlOiBcImpzb25wXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHF1ZXJ5OiB0aGlzLnN0YXRlLnNlYXJjaCxcbiAgICAgICAgICAgIGFwaV9rZXk6IFwiOWQzYjAzNWVmMWNkNjY5YWVkMzk4NDAwYjE3ZmNlYTJcIixcbiAgICAgICAgICAgIGZvcm1hdDogXCJqc29uXCIsXG4gICAgICAgIH0sXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgdmFyIHNvcnRlZCA9IF8uc29ydEJ5KHJlc3BvbnNlLnJlc3VsdHMsICdpbWRiUmF0aW5nJyk7XG4gICAgICAgICAgdGhhdC5nZXRVc2VyUmF0aW5nc0Zvck1vdmllcyhzb3J0ZWQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgXG4gICAgdmFyIGxhYmxlID0gJ3JlY2VudCByZWxlYXNlcyc7XG4gICAgdmFyIGZlZWRiYWNrTXNnID0gJyc7XG4gICAgaWYgKHRoaXMuc3RhdGUucmVjZW50UmVsZWFzZSA9PT0gZmFsc2UpIHtcbiAgICAgIGxhYmxlID0gJ2JhY2sgdG8gcmVjZW50IHJlbGVhc2VzJztcbiAgICAgIGlmICh0aGlzLnN0YXRlLm1vdmllcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZmVlZGJhY2tNc2cgPSAoPGRpdiBjbGFzc05hbWU9XCJlcnJvck1zZ1wiPm5vIG1hdGNoIGZvdW5kLCBwbGVhc2UgdHJ5IGFub3RoZXIgdGl0bGU8L2Rpdj4pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmZWVkYmFja01zZyA9ICg8ZGl2IGNsYXNzTmFtZT1cInVwZGF0ZWRNc2dcIj5hbGwgbWF0Y2ggcmVzdWx0czo8L2Rpdj4pXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdIb21lIGNvbGxlY3Rpb24nPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0naGVhZGVyJyBvbkNsaWNrPXt0aGlzLmdldFJlY2VudFJlbGVhc2VzSW5pdGlhbGl6ZS5iaW5kKHRoaXMpfT57bGFibGV9PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdzZWFyY2hNb3ZpZSc+XG4gICAgICAgICAgPGlucHV0IHR5cGUgPSd0ZXh0JyBpZD0nbW92aWVJbnB1dCcgXG4gICAgICAgICAgICBjbGFzc05hbWU9J21vdmllSW5wdXQnXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj0nZmluZCBhIG1vdmllJ1xuICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuc2VhcmNofVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyl9XG4gICAgICAgICAgICBvbktleVByZXNzPXt0aGlzLmhhbmRsZVNlYXJjaC5iaW5kKHRoaXMpfS8+XG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9eygpID0+IHRoaXMuaGFuZGxlU2VhcmNoLmJpbmQodGhpcykoJ2NsaWNrZWQnKX0+c2VhcmNoPC9hPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge2ZlZWRiYWNrTXNnfVxuICAgICAgICA8TW92aWVMaXN0IG1vdmllcz17dGhpcy5zdGF0ZS5tb3ZpZXN9XG4gICAgICAgIGNoYW5nZT17dGhpcy5wcm9wcy5jaGFuZ2UuYmluZCh0aGlzKX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG53aW5kb3cuSG9tZSA9IEhvbWU7Il19
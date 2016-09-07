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
      search: '',
      loading: true
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
          recentRelease: true,
          loading: false
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
        this.setState({ loading: true });
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
            setTimeout(function () {
              that.setState({ loading: false });
            }, 1000);
          }
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var lable = 'Recent Releases';
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
        this.state.loading ? React.createElement('img', { id: 'loadingBar', src: 'http://bit.ly/2czw4qB' }) : null,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL2hvbWUvaG9tZS5qcyJdLCJuYW1lcyI6WyJIb21lIiwicHJvcHMiLCJzdGF0ZSIsIm1vdmllcyIsInZpZXciLCJmb2NhbE1vdmllIiwicmVjZW50UmVsZWFzZSIsInNlYXJjaCIsImxvYWRpbmciLCJ0YXJnZXRTdGF0ZSIsInNldFN0YXRlIiwiZ2V0UmVjZW50UmVsZWFzZXNJbml0aWFsaXplIiwiZXZlbnQiLCJ0YXJnZXQiLCJ2YWx1ZSIsIiQiLCJnZXQiLCJVcmwiLCJ0aGVuIiwiY29uc29sZSIsImxvZyIsIm1vdmllc1dpdGhSYXRpbmdzIiwibW92aWVzRnJvbU9NREIiLCJsZW5ndGgiLCJwb3N0IiwiZG9uZSIsImNoYXJDb2RlIiwidGhhdCIsImFqYXgiLCJ1cmwiLCJqc29ucCIsImRhdGFUeXBlIiwiZGF0YSIsInF1ZXJ5IiwiYXBpX2tleSIsImZvcm1hdCIsInN1Y2Nlc3MiLCJyZXNwb25zZSIsInNvcnRlZCIsIl8iLCJzb3J0QnkiLCJyZXN1bHRzIiwiZ2V0VXNlclJhdGluZ3NGb3JNb3ZpZXMiLCJzZXRUaW1lb3V0IiwibGFibGUiLCJmZWVkYmFja01zZyIsImJpbmQiLCJoYW5kbGVDaGFuZ2UiLCJoYW5kbGVTZWFyY2giLCJjaGFuZ2UiLCJSZWFjdCIsIkNvbXBvbmVudCIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNQSxJOzs7QUFDSixnQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLDRHQUNYQSxLQURXOztBQUdqQixVQUFLQyxLQUFMLEdBQWE7QUFDWEMsY0FBUSxFQURHO0FBRVhDLFlBQU0sZUFGSztBQUdYQyxrQkFBWSxJQUhEO0FBSVhDLHFCQUFlLElBSko7QUFLWEMsY0FBUSxFQUxHO0FBTVhDLGVBQVM7QUFORSxLQUFiO0FBSGlCO0FBV2xCOztBQUVEOzs7OztnQ0FDWUMsVyxFQUFhO0FBQ3ZCLFdBQUtDLFFBQUwsQ0FBYztBQUNaTixjQUFNSztBQURNLE9B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V0FBVSxRQUFmLEVBQXdCLFNBQVMsS0FBS0csMkJBQUwsQ0FBaUNtQyxJQUFqQyxDQUFzQyxJQUF0QyxDQUFqQztBQUErRUY7QUFBL0UsU0FGRjtBQUdFO0FBQUE7QUFBQSxZQUFLLFdBQVUsYUFBZjtBQUNFLHlDQUFPLE1BQU0sTUFBYixFQUFvQixJQUFHLFlBQXZCO0FBQ0UsdUJBQVUsWUFEWjtBQUVFLHlCQUFZLGNBRmQ7QUFHRSxtQkFBTyxLQUFLMUMsS0FBTCxDQUFXSyxNQUhwQjtBQUlFLHNCQUFVLEtBQUt3QyxZQUFMLENBQWtCRCxJQUFsQixDQUF1QixJQUF2QixDQUpaO0FBS0Usd0JBQVksS0FBS0UsWUFBTCxDQUFrQkYsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FMZCxHQURGO0FBT0U7QUFBQTtBQUFBLGNBQUcsV0FBVSw4QkFBYixFQUE0QyxTQUFTO0FBQUEsdUJBQU0sT0FBS0UsWUFBTCxDQUFrQkYsSUFBbEIsU0FBNkIsU0FBN0IsQ0FBTjtBQUFBLGVBQXJEO0FBQUE7QUFBQTtBQVBGLFNBSEY7QUFZR0QsbUJBWkg7QUFhRSw0QkFBQyxTQUFELElBQVcsUUFBUSxLQUFLM0MsS0FBTCxDQUFXQyxNQUE5QjtBQUNBLGtCQUFRLEtBQUtGLEtBQUwsQ0FBV2dELE1BQVgsQ0FBa0JILElBQWxCLENBQXVCLElBQXZCO0FBRFI7QUFiRixPQURGO0FBbUJEOzs7O0VBL0hnQkksTUFBTUMsUzs7QUFrSXpCQyxPQUFPcEQsSUFBUCxHQUFjQSxJQUFkIiwiZmlsZSI6ImhvbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBIb21lIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIG1vdmllczogW10sXHJcbiAgICAgIHZpZXc6ICdyZWNlbnRSZWxlYXNlJyxcclxuICAgICAgZm9jYWxNb3ZpZTogbnVsbCxcclxuICAgICAgcmVjZW50UmVsZWFzZTogdHJ1ZSxcclxuICAgICAgc2VhcmNoOiAnJyxcclxuICAgICAgbG9hZGluZzogdHJ1ZVxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIC8vc2hvdWxkIGhhdmUgaXRzIG93biBjaGFuZ2UgdmlldyBmdW5jdGlvblxyXG4gIGNoYW5nZVZpZXdzKHRhcmdldFN0YXRlKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmlldzogdGFyZ2V0U3RhdGVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy9zaG93IHJlbmRlciBhIGxpc3Qgb2YgcmVjZW50IHJlbGVhc2VzIG9uIGluaXRpYWxpemVcclxuICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgIHRoaXMuZ2V0UmVjZW50UmVsZWFzZXNJbml0aWFsaXplKCk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVDaGFuZ2UoZXZlbnQpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBzZWFyY2g6IGV2ZW50LnRhcmdldC52YWx1ZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRSZWNlbnRSZWxlYXNlc0luaXRpYWxpemUoKSB7XHJcbiAgICAkLmdldChVcmwgKyAnL3JlY2VudFJlbGVhc2UnKVxyXG4gICAgLnRoZW4obW92aWVzV2l0aFJhdGluZ3MgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZygncmVzcG9uc2UgZnJvbSBzZXJ2ZXInLCBtb3ZpZXNXaXRoUmF0aW5ncyk7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIG1vdmllczogbW92aWVzV2l0aFJhdGluZ3MsXHJcbiAgICAgICAgcmVjZW50UmVsZWFzZTogdHJ1ZSxcclxuICAgICAgICBsb2FkaW5nOiBmYWxzZVxyXG4gICAgICB9KTtcclxuICAgIH0pXHJcbiAgICBcclxuICB9XHJcblxyXG4gIC8vZnVuY3Rpb24gdGhhdCB0YWtlcyBtb3ZpZXMgZnJvbSBleHRlcm5hbCBBUEkgYW5kIHF1ZXJ5IHRoZSBkYXRhYmFzZSBmb3IgcmF0aW5nc1xyXG4gIC8vd2lsbCBzZXQgdGhlIG1vdmllcyBzdGF0ZSBhZnRlciByYXRpbmdzIGFyZSBzdWNjZXNzZnVsbHkgcmV0cml2ZWRcclxuICBnZXRVc2VyUmF0aW5nc0Zvck1vdmllcyhtb3ZpZXNGcm9tT01EQikge1xyXG4gICAgaWYgKG1vdmllc0Zyb21PTURCLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBtb3ZpZXM6IFtdLFxyXG4gICAgICAgIHJlY2VudFJlbGVhc2U6IGZhbHNlXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS5sb2coJ3Bvc3RpbmcgdG86JywgVXJsICsgJy9nZXRNdWx0aXBsZU1vdmllUmF0aW5ncycpO1xyXG4gICAgICAkLnBvc3QoVXJsICsgJy9nZXRNdWx0aXBsZU1vdmllUmF0aW5ncycsIHsgbW92aWVzOiBtb3ZpZXNGcm9tT01EQiB9KVxyXG4gICAgICAuZG9uZShtb3ZpZXNXaXRoUmF0aW5ncyA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlIGZyb20gc2VydmVyJywgbW92aWVzV2l0aFJhdGluZ3MpO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgbW92aWVzOiBtb3ZpZXNXaXRoUmF0aW5ncyxcclxuICAgICAgICAgIHJlY2VudFJlbGVhc2U6IGZhbHNlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgLy8vLy9FdmVudCBIYW5kbGVyc1xyXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuXHJcbiAgLy90aGlzIHdpbGwgY2FsbCBzZWFyY2ggZm9yIGEgbW92aWUgZnJvbSBleHRlcm5hbCBBUEksIGRvIGEgZGF0YWJhc2UgcXVlcnkgZm9yIHJhdGluZ1xyXG4gIC8vYW5kIHNldCB0aGUgcmVwb25zZSB0byB0aGUgbW92aWVzIHN0YXRlXHJcbiAgaGFuZGxlU2VhcmNoKGV2ZW50KSB7XHJcbiAgICBpZiAoZXZlbnQuY2hhckNvZGUgPT0gMTMgfHwgZXZlbnQgPT09ICdjbGlja2VkJykge1xyXG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe2xvYWRpbmc6dHJ1ZX0pO1xyXG4gICAgICAvL3RoaXMgd2lsbCBzZWFyY2ggVE1EQiBmb3IgbW92aWUgYW5kIHNlbmQgaXQgdG8gc2VydmVyIHRvIHJldHJpdmUgdXNlciByYXRpbmdzXHJcbiAgICAgICQuYWpheCh7XHJcbiAgICAgICAgdXJsOiBcImh0dHBzOi8vYXBpLnRoZW1vdmllZGIub3JnLzMvc2VhcmNoL21vdmllXCIsXHJcbiAgICAgICAganNvbnA6IFwiY2FsbGJhY2tcIixcclxuICAgICAgICBkYXRhVHlwZTogXCJqc29ucFwiLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgcXVlcnk6IHRoaXMuc3RhdGUuc2VhcmNoLFxyXG4gICAgICAgICAgICBhcGlfa2V5OiBcIjlkM2IwMzVlZjFjZDY2OWFlZDM5ODQwMGIxN2ZjZWEyXCIsXHJcbiAgICAgICAgICAgIGZvcm1hdDogXCJqc29uXCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgdmFyIHNvcnRlZCA9IF8uc29ydEJ5KHJlc3BvbnNlLnJlc3VsdHMsICdpbWRiUmF0aW5nJyk7XHJcbiAgICAgICAgICB0aGF0LmdldFVzZXJSYXRpbmdzRm9yTW92aWVzKHNvcnRlZCk7XHJcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpPT57dGhhdC5zZXRTdGF0ZSh7bG9hZGluZzpmYWxzZX0pfSwxMDAwKVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICBcclxuICAgIHZhciBsYWJsZSA9ICdSZWNlbnQgUmVsZWFzZXMnO1xyXG4gICAgdmFyIGZlZWRiYWNrTXNnID0gJyc7XHJcbiAgICBpZiAodGhpcy5zdGF0ZS5yZWNlbnRSZWxlYXNlID09PSBmYWxzZSkge1xyXG4gICAgICBsYWJsZSA9ICdiYWNrIHRvIHJlY2VudCByZWxlYXNlcyc7XHJcbiAgICAgIGlmICh0aGlzLnN0YXRlLm1vdmllcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBmZWVkYmFja01zZyA9ICg8ZGl2IGNsYXNzTmFtZT1cImVycm9yTXNnXCI+bm8gbWF0Y2ggZm91bmQsIHBsZWFzZSB0cnkgYW5vdGhlciB0aXRsZTwvZGl2PilcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBmZWVkYmFja01zZyA9ICg8ZGl2IGNsYXNzTmFtZT1cInVwZGF0ZWRNc2dcIj5hbGwgbWF0Y2ggcmVzdWx0czo8L2Rpdj4pXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nSG9tZSBjb2xsZWN0aW9uJz5cclxuICAgICAge3RoaXMuc3RhdGUubG9hZGluZz88aW1nIGlkPSdsb2FkaW5nQmFyJyBzcmM9XCJodHRwOi8vYml0Lmx5LzJjenc0cUJcIi8+OiBudWxsfVxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdoZWFkZXInIG9uQ2xpY2s9e3RoaXMuZ2V0UmVjZW50UmVsZWFzZXNJbml0aWFsaXplLmJpbmQodGhpcyl9PntsYWJsZX08L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nc2VhcmNoTW92aWUnPlxyXG4gICAgICAgICAgPGlucHV0IHR5cGUgPSd0ZXh0JyBpZD0nbW92aWVJbnB1dCcgXHJcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nbW92aWVJbnB1dCdcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9J2ZpbmQgYSBtb3ZpZSdcclxuICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuc2VhcmNofVxyXG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKX1cclxuICAgICAgICAgICAgb25LZXlQcmVzcz17dGhpcy5oYW5kbGVTZWFyY2guYmluZCh0aGlzKX0vPlxyXG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9eygpID0+IHRoaXMuaGFuZGxlU2VhcmNoLmJpbmQodGhpcykoJ2NsaWNrZWQnKX0+c2VhcmNoPC9hPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIHtmZWVkYmFja01zZ31cclxuICAgICAgICA8TW92aWVMaXN0IG1vdmllcz17dGhpcy5zdGF0ZS5tb3ZpZXN9XHJcbiAgICAgICAgY2hhbmdlPXt0aGlzLnByb3BzLmNoYW5nZS5iaW5kKHRoaXMpfVxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKVxyXG4gIH1cclxufVxyXG5cclxud2luZG93LkhvbWUgPSBIb21lOyJdfQ==
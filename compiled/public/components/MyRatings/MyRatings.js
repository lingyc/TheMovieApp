'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MyRatings = function (_React$Component) {
  _inherits(MyRatings, _React$Component);

  function MyRatings(props) {
    _classCallCheck(this, MyRatings);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MyRatings).call(this, props));

    _this.state = {
      movies: [],
      allRatedMovies: true
    };
    return _this;
  }

  //show render a list of recent releases on initialize


  _createClass(MyRatings, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.getAllRatedMovies();
    }
  }, {
    key: 'getAllRatedMovies',
    value: function getAllRatedMovies() {
      var _this2 = this;

      $.get('http://127.0.0.1:3000/getUserRatings').then(function (userRatedMovies) {
        console.log('response from server', userRatedMovies);
        _this2.setState({
          movies: userRatedMovies,
          allRatedMovies: true
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
      var _this3 = this;

      if (event.charCode == 13) {
        var that = this;

        //this will search database
        $.get('http://127.0.0.1:3000/searchRatedMovie', { title: event.target.value }).then(function (searchResults) {
          console.log('response from server', searchResults);
          _this3.setState({
            movies: searchResults,
            allRatedMovies: false
          });
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var lable;
      var results;
      if (this.state.allRatedMovies === false) {
        lable = 'back to all rated movies';
        results = this.state.movies.length === 0 ? 'results cannot be found' : 'current results:';
      } else if (this.state.allRatedMovies && this.state.movies.length === 0) {
        lable = 'you have not rated any movies';
      } else if (this.state.movies.length === 0) {} else {
        lable = 'all rated movies';
      }

      return React.createElement(
        'div',
        { className: 'MyRatings' },
        React.createElement(
          'div',
          { onClick: this.getAllRatedMovies.bind(this) },
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
        React.createElement(
          'div',
          null,
          results
        ),
        React.createElement(MovieList, { movies: this.state.movies,
          change: this.props.change.bind(this)
        })
      );
    }
  }]);

  return MyRatings;
}(React.Component);

window.MyRatings = MyRatings;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL015UmF0aW5ncy9NeVJhdGluZ3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNLFM7OztBQUNKLHFCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSw2RkFDWCxLQURXOztBQUdqQixVQUFLLEtBQUwsR0FBYTtBQUNYLGNBQVEsRUFERztBQUVYLHNCQUFnQjtBQUZMLEtBQWI7QUFIaUI7QUFPbEI7Ozs7Ozs7d0NBR21CO0FBQ2xCLFdBQUssaUJBQUw7QUFDRDs7O3dDQUVtQjtBQUFBOztBQUNsQixRQUFFLEdBQUYsQ0FBTSxzQ0FBTixFQUNDLElBREQsQ0FDTSwyQkFBbUI7QUFDdkIsZ0JBQVEsR0FBUixDQUFZLHNCQUFaLEVBQW9DLGVBQXBDO0FBQ0EsZUFBSyxRQUFMLENBQWM7QUFDWixrQkFBUSxlQURJO0FBRVosMEJBQWdCO0FBRkosU0FBZDtBQUlELE9BUEQ7QUFTRDs7Ozs7Ozs7Ozs7aUNBUVksSyxFQUFPO0FBQUE7O0FBQ2xCLFVBQUksTUFBTSxRQUFOLElBQWtCLEVBQXRCLEVBQTBCO0FBQ3hCLFlBQUksT0FBTyxJQUFYOzs7QUFHRixVQUFFLEdBQUYsQ0FBTSx3Q0FBTixFQUFnRCxFQUFDLE9BQU8sTUFBTSxNQUFOLENBQWEsS0FBckIsRUFBaEQsRUFDQyxJQURELENBQ00seUJBQWlCO0FBQ3JCLGtCQUFRLEdBQVIsQ0FBWSxzQkFBWixFQUFvQyxhQUFwQztBQUNBLGlCQUFLLFFBQUwsQ0FBYztBQUNaLG9CQUFRLGFBREk7QUFFWiw0QkFBZ0I7QUFGSixXQUFkO0FBSUQsU0FQRDtBQVFDO0FBQ0Y7Ozs2QkFFUTtBQUNQLFVBQUksS0FBSjtBQUNBLFVBQUksT0FBSjtBQUNBLFVBQUksS0FBSyxLQUFMLENBQVcsY0FBWCxLQUE4QixLQUFsQyxFQUF5QztBQUN2QyxnQkFBUSwwQkFBUjtBQUNBLGtCQUFXLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsTUFBbEIsS0FBNkIsQ0FBOUIsR0FBbUMseUJBQW5DLEdBQStELGtCQUF6RTtBQUNELE9BSEQsTUFHTyxJQUFJLEtBQUssS0FBTCxDQUFXLGNBQVgsSUFBNkIsS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixNQUFsQixLQUE2QixDQUE5RCxFQUFpRTtBQUN0RSxnQkFBUSwrQkFBUjtBQUNELE9BRk0sTUFFQSxJQUFJLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsTUFBbEIsS0FBNkIsQ0FBakMsRUFBb0MsQ0FFMUMsQ0FGTSxNQUVBO0FBQ0wsZ0JBQVEsa0JBQVI7QUFDRDs7QUFFRCxhQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUsV0FBZjtBQUNFO0FBQUE7QUFBQSxZQUFLLFNBQVMsS0FBSyxpQkFBTCxDQUF1QixJQUF2QixDQUE0QixJQUE1QixDQUFkO0FBQWtEO0FBQWxELFNBREY7QUFFRTtBQUFBO0FBQUEsWUFBSyxXQUFVLGFBQWY7QUFDRSx5Q0FBTyxNQUFNLE1BQWIsRUFBb0IsSUFBRyxZQUF2QjtBQUNFLHVCQUFVLFlBRFo7QUFFRSx5QkFBWSxvQkFGZDtBQUdFLHdCQUFZLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixJQUF2QixDQUhkO0FBREYsU0FGRjtBQVFFO0FBQUE7QUFBQTtBQUFNO0FBQU4sU0FSRjtBQVNFLDRCQUFDLFNBQUQsSUFBVyxRQUFRLEtBQUssS0FBTCxDQUFXLE1BQTlCO0FBQ0Esa0JBQVEsS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixJQUFsQixDQUF1QixJQUF2QjtBQURSO0FBVEYsT0FERjtBQWVEOzs7O0VBOUVxQixNQUFNLFM7O0FBaUY5QixPQUFPLFNBQVAsR0FBbUIsU0FBbkIiLCJmaWxlIjoiTXlSYXRpbmdzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgTXlSYXRpbmdzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbW92aWVzOiBbXSxcbiAgICAgIGFsbFJhdGVkTW92aWVzOiB0cnVlXG4gICAgfTtcbiAgfVxuXG4gIC8vc2hvdyByZW5kZXIgYSBsaXN0IG9mIHJlY2VudCByZWxlYXNlcyBvbiBpbml0aWFsaXplXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHRoaXMuZ2V0QWxsUmF0ZWRNb3ZpZXMoKTtcbiAgfVxuXG4gIGdldEFsbFJhdGVkTW92aWVzKCkge1xuICAgICQuZ2V0KCdodHRwOi8vMTI3LjAuMC4xOjMwMDAvZ2V0VXNlclJhdGluZ3MnKVxuICAgIC50aGVuKHVzZXJSYXRlZE1vdmllcyA9PiB7XG4gICAgICBjb25zb2xlLmxvZygncmVzcG9uc2UgZnJvbSBzZXJ2ZXInLCB1c2VyUmF0ZWRNb3ZpZXMpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG1vdmllczogdXNlclJhdGVkTW92aWVzLFxuICAgICAgICBhbGxSYXRlZE1vdmllczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSlcbiAgICBcbiAgfVxuXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgLy8vLy9FdmVudCBIYW5kbGVyc1xuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgLy90aGlzIHdpbGwgY2FsbCBzZWFyY2ggZm9yIGEgbW92aWUgZnJvbSBleHRlcm5hbCBBUEksIGRvIGEgZGF0YWJhc2UgcXVlcnkgZm9yIHJhdGluZ1xuICAvL2FuZCBzZXQgdGhlIHJlcG9uc2UgdG8gdGhlIG1vdmllcyBzdGF0ZVxuICBoYW5kbGVTZWFyY2goZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQuY2hhckNvZGUgPT0gMTMpIHtcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgLy90aGlzIHdpbGwgc2VhcmNoIGRhdGFiYXNlXG4gICAgJC5nZXQoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9zZWFyY2hSYXRlZE1vdmllJywge3RpdGxlOiBldmVudC50YXJnZXQudmFsdWV9KVxuICAgIC50aGVuKHNlYXJjaFJlc3VsdHMgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlIGZyb20gc2VydmVyJywgc2VhcmNoUmVzdWx0cyk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbW92aWVzOiBzZWFyY2hSZXN1bHRzLFxuICAgICAgICBhbGxSYXRlZE1vdmllczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH0pXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHZhciBsYWJsZTtcbiAgICB2YXIgcmVzdWx0cztcbiAgICBpZiAodGhpcy5zdGF0ZS5hbGxSYXRlZE1vdmllcyA9PT0gZmFsc2UpIHtcbiAgICAgIGxhYmxlID0gJ2JhY2sgdG8gYWxsIHJhdGVkIG1vdmllcyc7XG4gICAgICByZXN1bHRzID0gKHRoaXMuc3RhdGUubW92aWVzLmxlbmd0aCA9PT0gMCkgPyAncmVzdWx0cyBjYW5ub3QgYmUgZm91bmQnIDogJ2N1cnJlbnQgcmVzdWx0czonXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLmFsbFJhdGVkTW92aWVzICYmIHRoaXMuc3RhdGUubW92aWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgbGFibGUgPSAneW91IGhhdmUgbm90IHJhdGVkIGFueSBtb3ZpZXMnO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5tb3ZpZXMubGVuZ3RoID09PSAwKSB7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgbGFibGUgPSAnYWxsIHJhdGVkIG1vdmllcyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdNeVJhdGluZ3MnPiBcbiAgICAgICAgPGRpdiBvbkNsaWNrPXt0aGlzLmdldEFsbFJhdGVkTW92aWVzLmJpbmQodGhpcyl9PntsYWJsZX08L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3NlYXJjaE1vdmllJz5cbiAgICAgICAgICA8aW5wdXQgdHlwZSA9J3RleHQnIGlkPSdtb3ZpZUlucHV0JyBcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nbW92aWVJbnB1dCdcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPSdJbnNlcnQgTW92aWUgVGl0bGUnXG4gICAgICAgICAgICBvbktleVByZXNzPXt0aGlzLmhhbmRsZVNlYXJjaC5iaW5kKHRoaXMpfS8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2PntyZXN1bHRzfTwvZGl2PlxuICAgICAgICA8TW92aWVMaXN0IG1vdmllcz17dGhpcy5zdGF0ZS5tb3ZpZXN9XG4gICAgICAgIGNoYW5nZT17dGhpcy5wcm9wcy5jaGFuZ2UuYmluZCh0aGlzKX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG53aW5kb3cuTXlSYXRpbmdzID0gTXlSYXRpbmdzOyJdfQ==
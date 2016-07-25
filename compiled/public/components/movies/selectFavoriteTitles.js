'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SelectFavoriteTitles = function (_React$Component) {
  _inherits(SelectFavoriteTitles, _React$Component);

  function SelectFavoriteTitles(props) {
    _classCallCheck(this, SelectFavoriteTitles);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SelectFavoriteTitles).call(this, props));

    _this.state = {
      movies: []
    };
    return _this;
  }

  //show render a list of recent releases on initialize


  _createClass(SelectFavoriteTitles, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.getAllRatedMovies();
    }

    //////////////////////
    /////Event Handlers
    //////////////////////

    //this will call search for a movie from external API, do a database query for rating
    //and set the reponse to the movies state

  }, {
    key: 'handleSearch',
    value: function handleSearch(event) {
      var _this2 = this;

      if (event.charCode == 13) {
        var that = this;

        //this will search database
        $.get(Url + '/searchRatedMovie', { title: event.target.value }).then(function (searchResults) {
          console.log('response from server', searchResults);
          _this2.setState({
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
        results = this.state.movies.length === 0 ? React.createElement(
          'div',
          { className: 'errorMsg' },
          'results cannot be found'
        ) : React.createElement(
          'div',
          { className: 'updateMsg' },
          'all match results:'
        );
      } else if (this.state.allRatedMovies && this.state.movies.length === 0) {
        lable = 'you have not rated any movies';
      } else {
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
        results,
        React.createElement(MovieList, { movies: this.state.movies,
          change: this.props.change.bind(this)
        })
      );
    }
  }]);

  return SelectFavoriteTitles;
}(React.Component);

window.MyRatings = MyRatings;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9zZWxlY3RGYXZvcml0ZVRpdGxlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sb0I7OztBQUNKLGdDQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSx3R0FDWCxLQURXOztBQUdqQixVQUFLLEtBQUwsR0FBYTtBQUNYLGNBQVE7QUFERyxLQUFiO0FBSGlCO0FBTWxCOztBQUVEOzs7Ozt3Q0FDb0I7QUFDbEIsV0FBSyxpQkFBTDtBQUNEOztBQUdEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7O2lDQUNhLEssRUFBTztBQUFBOztBQUNsQixVQUFJLE1BQU0sUUFBTixJQUFrQixFQUF0QixFQUEwQjtBQUN4QixZQUFJLE9BQU8sSUFBWDs7QUFFQTtBQUNGLFVBQUUsR0FBRixDQUFNLE1BQU0sbUJBQVosRUFBaUMsRUFBQyxPQUFPLE1BQU0sTUFBTixDQUFhLEtBQXJCLEVBQWpDLEVBQ0MsSUFERCxDQUNNLHlCQUFpQjtBQUNyQixrQkFBUSxHQUFSLENBQVksc0JBQVosRUFBb0MsYUFBcEM7QUFDQSxpQkFBSyxRQUFMLENBQWM7QUFDWixvQkFBUSxhQURJO0FBRVosNEJBQWdCO0FBRkosV0FBZDtBQUlELFNBUEQ7QUFRQztBQUNGOzs7NkJBRVE7QUFDUCxVQUFJLEtBQUo7QUFDQSxVQUFJLE9BQUo7QUFDQSxVQUFJLEtBQUssS0FBTCxDQUFXLGNBQVgsS0FBOEIsS0FBbEMsRUFBeUM7QUFDdkMsZ0JBQVEsMEJBQVI7QUFDQSxrQkFBVyxLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLE1BQWxCLEtBQTZCLENBQTlCLEdBQW9DO0FBQUE7QUFBQSxZQUFLLFdBQVUsVUFBZjtBQUFBO0FBQUEsU0FBcEMsR0FBZ0c7QUFBQTtBQUFBLFlBQUssV0FBVSxXQUFmO0FBQUE7QUFBQSxTQUExRztBQUNELE9BSEQsTUFHTyxJQUFJLEtBQUssS0FBTCxDQUFXLGNBQVgsSUFBNkIsS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixNQUFsQixLQUE2QixDQUE5RCxFQUFpRTtBQUN0RSxnQkFBUSwrQkFBUjtBQUNELE9BRk0sTUFFQTtBQUNMLGdCQUFRLGtCQUFSO0FBQ0Q7O0FBRUQsYUFDRTtBQUFBO0FBQUEsVUFBSyxXQUFVLFdBQWY7QUFDRTtBQUFBO0FBQUEsWUFBSyxTQUFTLEtBQUssaUJBQUwsQ0FBdUIsSUFBdkIsQ0FBNEIsSUFBNUIsQ0FBZDtBQUFrRDtBQUFsRCxTQURGO0FBRUU7QUFBQTtBQUFBLFlBQUssV0FBVSxhQUFmO0FBQ0UseUNBQU8sTUFBTSxNQUFiLEVBQW9CLElBQUcsWUFBdkI7QUFDRSx1QkFBVSxZQURaO0FBRUUseUJBQVksb0JBRmQ7QUFHRSx3QkFBWSxLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FIZDtBQURGLFNBRkY7QUFRRyxlQVJIO0FBU0UsNEJBQUMsU0FBRCxJQUFXLFFBQVEsS0FBSyxLQUFMLENBQVcsTUFBOUI7QUFDQSxrQkFBUSxLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLElBQWxCLENBQXVCLElBQXZCO0FBRFI7QUFURixPQURGO0FBZUQ7Ozs7RUFoRWdDLE1BQU0sUzs7QUFtRXpDLE9BQU8sU0FBUCxHQUFtQixTQUFuQiIsImZpbGUiOiJzZWxlY3RGYXZvcml0ZVRpdGxlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFNlbGVjdEZhdm9yaXRlVGl0bGVzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbW92aWVzOiBbXSxcbiAgICB9O1xuICB9XG5cbiAgLy9zaG93IHJlbmRlciBhIGxpc3Qgb2YgcmVjZW50IHJlbGVhc2VzIG9uIGluaXRpYWxpemVcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5nZXRBbGxSYXRlZE1vdmllcygpO1xuICB9XG5cblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIC8vLy8vRXZlbnQgSGFuZGxlcnNcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gIC8vdGhpcyB3aWxsIGNhbGwgc2VhcmNoIGZvciBhIG1vdmllIGZyb20gZXh0ZXJuYWwgQVBJLCBkbyBhIGRhdGFiYXNlIHF1ZXJ5IGZvciByYXRpbmdcbiAgLy9hbmQgc2V0IHRoZSByZXBvbnNlIHRvIHRoZSBtb3ZpZXMgc3RhdGVcbiAgaGFuZGxlU2VhcmNoKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmNoYXJDb2RlID09IDEzKSB7XG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgIC8vdGhpcyB3aWxsIHNlYXJjaCBkYXRhYmFzZVxuICAgICQuZ2V0KFVybCArICcvc2VhcmNoUmF0ZWRNb3ZpZScsIHt0aXRsZTogZXZlbnQudGFyZ2V0LnZhbHVlfSlcbiAgICAudGhlbihzZWFyY2hSZXN1bHRzID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdyZXNwb25zZSBmcm9tIHNlcnZlcicsIHNlYXJjaFJlc3VsdHMpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG1vdmllczogc2VhcmNoUmVzdWx0cyxcbiAgICAgICAgYWxsUmF0ZWRNb3ZpZXM6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICB2YXIgbGFibGU7XG4gICAgdmFyIHJlc3VsdHM7XG4gICAgaWYgKHRoaXMuc3RhdGUuYWxsUmF0ZWRNb3ZpZXMgPT09IGZhbHNlKSB7XG4gICAgICBsYWJsZSA9ICdiYWNrIHRvIGFsbCByYXRlZCBtb3ZpZXMnO1xuICAgICAgcmVzdWx0cyA9ICh0aGlzLnN0YXRlLm1vdmllcy5sZW5ndGggPT09IDApID8gKDxkaXYgY2xhc3NOYW1lPVwiZXJyb3JNc2dcIj5yZXN1bHRzIGNhbm5vdCBiZSBmb3VuZDwvZGl2PikgOiAoPGRpdiBjbGFzc05hbWU9XCJ1cGRhdGVNc2dcIj5hbGwgbWF0Y2ggcmVzdWx0czo8L2Rpdj4pXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLmFsbFJhdGVkTW92aWVzICYmIHRoaXMuc3RhdGUubW92aWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgbGFibGUgPSAneW91IGhhdmUgbm90IHJhdGVkIGFueSBtb3ZpZXMnO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYWJsZSA9ICdhbGwgcmF0ZWQgbW92aWVzJztcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9J015UmF0aW5ncyc+IFxuICAgICAgICA8ZGl2IG9uQ2xpY2s9e3RoaXMuZ2V0QWxsUmF0ZWRNb3ZpZXMuYmluZCh0aGlzKX0+e2xhYmxlfTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nc2VhcmNoTW92aWUnPlxuICAgICAgICAgIDxpbnB1dCB0eXBlID0ndGV4dCcgaWQ9J21vdmllSW5wdXQnIFxuICAgICAgICAgICAgY2xhc3NOYW1lPSdtb3ZpZUlucHV0J1xuICAgICAgICAgICAgcGxhY2Vob2xkZXI9J0luc2VydCBNb3ZpZSBUaXRsZSdcbiAgICAgICAgICAgIG9uS2V5UHJlc3M9e3RoaXMuaGFuZGxlU2VhcmNoLmJpbmQodGhpcyl9Lz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHtyZXN1bHRzfVxuICAgICAgICA8TW92aWVMaXN0IG1vdmllcz17dGhpcy5zdGF0ZS5tb3ZpZXN9XG4gICAgICAgIGNoYW5nZT17dGhpcy5wcm9wcy5jaGFuZ2UuYmluZCh0aGlzKX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG53aW5kb3cuTXlSYXRpbmdzID0gTXlSYXRpbmdzOyJdfQ==
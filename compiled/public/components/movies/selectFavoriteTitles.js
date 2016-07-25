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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9zZWxlY3RGYXZvcml0ZVRpdGxlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sb0I7OztBQUNKLGdDQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSx3R0FDWCxLQURXOztBQUdqQixVQUFLLEtBQUwsR0FBYTtBQUNYLGNBQVE7QUFERyxLQUFiO0FBSGlCO0FBTWxCOzs7Ozs7O3dDQUdtQjtBQUNsQixXQUFLLGlCQUFMO0FBQ0Q7Ozs7Ozs7Ozs7O2lDQVNZLEssRUFBTztBQUFBOztBQUNsQixVQUFJLE1BQU0sUUFBTixJQUFrQixFQUF0QixFQUEwQjtBQUN4QixZQUFJLE9BQU8sSUFBWDs7O0FBR0YsVUFBRSxHQUFGLENBQU0sTUFBTSxtQkFBWixFQUFpQyxFQUFDLE9BQU8sTUFBTSxNQUFOLENBQWEsS0FBckIsRUFBakMsRUFDQyxJQURELENBQ00seUJBQWlCO0FBQ3JCLGtCQUFRLEdBQVIsQ0FBWSxzQkFBWixFQUFvQyxhQUFwQztBQUNBLGlCQUFLLFFBQUwsQ0FBYztBQUNaLG9CQUFRLGFBREk7QUFFWiw0QkFBZ0I7QUFGSixXQUFkO0FBSUQsU0FQRDtBQVFDO0FBQ0Y7Ozs2QkFFUTtBQUNQLFVBQUksS0FBSjtBQUNBLFVBQUksT0FBSjtBQUNBLFVBQUksS0FBSyxLQUFMLENBQVcsY0FBWCxLQUE4QixLQUFsQyxFQUF5QztBQUN2QyxnQkFBUSwwQkFBUjtBQUNBLGtCQUFXLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsTUFBbEIsS0FBNkIsQ0FBOUIsR0FBb0M7QUFBQTtBQUFBLFlBQUssV0FBVSxVQUFmO0FBQUE7QUFBQSxTQUFwQyxHQUFnRztBQUFBO0FBQUEsWUFBSyxXQUFVLFdBQWY7QUFBQTtBQUFBLFNBQTFHO0FBQ0QsT0FIRCxNQUdPLElBQUksS0FBSyxLQUFMLENBQVcsY0FBWCxJQUE2QixLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLE1BQWxCLEtBQTZCLENBQTlELEVBQWlFO0FBQ3RFLGdCQUFRLCtCQUFSO0FBQ0QsT0FGTSxNQUVBO0FBQ0wsZ0JBQVEsa0JBQVI7QUFDRDs7QUFFRCxhQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUsV0FBZjtBQUNFO0FBQUE7QUFBQSxZQUFLLFNBQVMsS0FBSyxpQkFBTCxDQUF1QixJQUF2QixDQUE0QixJQUE1QixDQUFkO0FBQWtEO0FBQWxELFNBREY7QUFFRTtBQUFBO0FBQUEsWUFBSyxXQUFVLGFBQWY7QUFDRSx5Q0FBTyxNQUFNLE1BQWIsRUFBb0IsSUFBRyxZQUF2QjtBQUNFLHVCQUFVLFlBRFo7QUFFRSx5QkFBWSxvQkFGZDtBQUdFLHdCQUFZLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixJQUF2QixDQUhkO0FBREYsU0FGRjtBQVFHLGVBUkg7QUFTRSw0QkFBQyxTQUFELElBQVcsUUFBUSxLQUFLLEtBQUwsQ0FBVyxNQUE5QjtBQUNBLGtCQUFRLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsSUFBbEIsQ0FBdUIsSUFBdkI7QUFEUjtBQVRGLE9BREY7QUFlRDs7OztFQWhFZ0MsTUFBTSxTOztBQW1FekMsT0FBTyxTQUFQLEdBQW1CLFNBQW5CIiwiZmlsZSI6InNlbGVjdEZhdm9yaXRlVGl0bGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgU2VsZWN0RmF2b3JpdGVUaXRsZXMgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBtb3ZpZXM6IFtdLFxuICAgIH07XG4gIH1cblxuICAvL3Nob3cgcmVuZGVyIGEgbGlzdCBvZiByZWNlbnQgcmVsZWFzZXMgb24gaW5pdGlhbGl6ZVxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLmdldEFsbFJhdGVkTW92aWVzKCk7XG4gIH1cblxuXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgLy8vLy9FdmVudCBIYW5kbGVyc1xuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgLy90aGlzIHdpbGwgY2FsbCBzZWFyY2ggZm9yIGEgbW92aWUgZnJvbSBleHRlcm5hbCBBUEksIGRvIGEgZGF0YWJhc2UgcXVlcnkgZm9yIHJhdGluZ1xuICAvL2FuZCBzZXQgdGhlIHJlcG9uc2UgdG8gdGhlIG1vdmllcyBzdGF0ZVxuICBoYW5kbGVTZWFyY2goZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQuY2hhckNvZGUgPT0gMTMpIHtcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgLy90aGlzIHdpbGwgc2VhcmNoIGRhdGFiYXNlXG4gICAgJC5nZXQoVXJsICsgJy9zZWFyY2hSYXRlZE1vdmllJywge3RpdGxlOiBldmVudC50YXJnZXQudmFsdWV9KVxuICAgIC50aGVuKHNlYXJjaFJlc3VsdHMgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlIGZyb20gc2VydmVyJywgc2VhcmNoUmVzdWx0cyk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbW92aWVzOiBzZWFyY2hSZXN1bHRzLFxuICAgICAgICBhbGxSYXRlZE1vdmllczogZmFsc2VcbiAgICAgIH0pO1xuICAgIH0pXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHZhciBsYWJsZTtcbiAgICB2YXIgcmVzdWx0cztcbiAgICBpZiAodGhpcy5zdGF0ZS5hbGxSYXRlZE1vdmllcyA9PT0gZmFsc2UpIHtcbiAgICAgIGxhYmxlID0gJ2JhY2sgdG8gYWxsIHJhdGVkIG1vdmllcyc7XG4gICAgICByZXN1bHRzID0gKHRoaXMuc3RhdGUubW92aWVzLmxlbmd0aCA9PT0gMCkgPyAoPGRpdiBjbGFzc05hbWU9XCJlcnJvck1zZ1wiPnJlc3VsdHMgY2Fubm90IGJlIGZvdW5kPC9kaXY+KSA6ICg8ZGl2IGNsYXNzTmFtZT1cInVwZGF0ZU1zZ1wiPmFsbCBtYXRjaCByZXN1bHRzOjwvZGl2PilcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuYWxsUmF0ZWRNb3ZpZXMgJiYgdGhpcy5zdGF0ZS5tb3ZpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBsYWJsZSA9ICd5b3UgaGF2ZSBub3QgcmF0ZWQgYW55IG1vdmllcyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxhYmxlID0gJ2FsbCByYXRlZCBtb3ZpZXMnO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nTXlSYXRpbmdzJz4gXG4gICAgICAgIDxkaXYgb25DbGljaz17dGhpcy5nZXRBbGxSYXRlZE1vdmllcy5iaW5kKHRoaXMpfT57bGFibGV9PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdzZWFyY2hNb3ZpZSc+XG4gICAgICAgICAgPGlucHV0IHR5cGUgPSd0ZXh0JyBpZD0nbW92aWVJbnB1dCcgXG4gICAgICAgICAgICBjbGFzc05hbWU9J21vdmllSW5wdXQnXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj0nSW5zZXJ0IE1vdmllIFRpdGxlJ1xuICAgICAgICAgICAgb25LZXlQcmVzcz17dGhpcy5oYW5kbGVTZWFyY2guYmluZCh0aGlzKX0vPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge3Jlc3VsdHN9XG4gICAgICAgIDxNb3ZpZUxpc3QgbW92aWVzPXt0aGlzLnN0YXRlLm1vdmllc31cbiAgICAgICAgY2hhbmdlPXt0aGlzLnByb3BzLmNoYW5nZS5iaW5kKHRoaXMpfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbndpbmRvdy5NeVJhdGluZ3MgPSBNeVJhdGluZ3M7Il19
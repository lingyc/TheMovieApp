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
      allRatedMovies: true,
      search: ''
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
    key: 'handleChange',
    value: function handleChange(event) {
      this.setState({
        search: event.target.value
      });
    }
  }, {
    key: 'getAllRatedMovies',
    value: function getAllRatedMovies() {
      var _this2 = this;

      $.get(Url + '/getUserRatings').then(function (userRatedMovies) {
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

      if (event.charCode == 13 || event === 'clicked') {
        var that = this;

        //this will search database
        $.get(Url + '/searchRatedMovie', { title: this.state.search }).then(function (searchResults) {
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
      var _this4 = this;

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
        { className: 'MyRatings collection' },
        React.createElement(
          'div',
          { className: 'header', onClick: this.getAllRatedMovies.bind(this) },
          lable
        ),
        React.createElement(
          'div',
          { className: 'searchMovie' },
          React.createElement('input', { type: 'text', id: 'movieInput',
            className: 'movieInput',
            value: this.state.search,
            placeholder: 'Insert Movie Title',
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
        results,
        React.createElement(MovieList, { movies: this.state.movies,
          change: this.props.change.bind(this)
        })
      );
    }
  }]);

  return MyRatings;
}(React.Component);

window.MyRatings = MyRatings;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL015UmF0aW5ncy9NeVJhdGluZ3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNLFM7OztBQUNKLHFCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSw2RkFDWCxLQURXOztBQUdqQixVQUFLLEtBQUwsR0FBYTtBQUNYLGNBQVEsRUFERztBQUVYLHNCQUFnQixJQUZMO0FBR1gsY0FBUTtBQUhHLEtBQWI7QUFIaUI7QUFRbEI7O0FBRUQ7Ozs7O3dDQUNvQjtBQUNsQixXQUFLLGlCQUFMO0FBQ0Q7OztpQ0FFWSxLLEVBQU87QUFDbEIsV0FBSyxRQUFMLENBQWM7QUFDWixnQkFBUSxNQUFNLE1BQU4sQ0FBYTtBQURULE9BQWQ7QUFHRDs7O3dDQUdtQjtBQUFBOztBQUNsQixRQUFFLEdBQUYsQ0FBTSxNQUFNLGlCQUFaLEVBQ0MsSUFERCxDQUNNLDJCQUFtQjtBQUN2QixnQkFBUSxHQUFSLENBQVksc0JBQVosRUFBb0MsZUFBcEM7QUFDQSxlQUFLLFFBQUwsQ0FBYztBQUNaLGtCQUFRLGVBREk7QUFFWiwwQkFBZ0I7QUFGSixTQUFkO0FBSUQsT0FQRDtBQVNEOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7O2lDQUNhLEssRUFBTztBQUFBOztBQUNsQixVQUFJLE1BQU0sUUFBTixJQUFrQixFQUFsQixJQUF3QixVQUFVLFNBQXRDLEVBQWlEO0FBQy9DLFlBQUksT0FBTyxJQUFYOztBQUVBO0FBQ0YsVUFBRSxHQUFGLENBQU0sTUFBTSxtQkFBWixFQUFpQyxFQUFDLE9BQU8sS0FBSyxLQUFMLENBQVcsTUFBbkIsRUFBakMsRUFDQyxJQURELENBQ00seUJBQWlCO0FBQ3JCLGtCQUFRLEdBQVIsQ0FBWSxzQkFBWixFQUFvQyxhQUFwQztBQUNBLGlCQUFLLFFBQUwsQ0FBYztBQUNaLG9CQUFRLGFBREk7QUFFWiw0QkFBZ0I7QUFGSixXQUFkO0FBSUQsU0FQRDtBQVFDO0FBQ0Y7Ozs2QkFFUTtBQUFBOztBQUNQLFVBQUksS0FBSjtBQUNBLFVBQUksT0FBSjtBQUNBLFVBQUksS0FBSyxLQUFMLENBQVcsY0FBWCxLQUE4QixLQUFsQyxFQUF5QztBQUN2QyxnQkFBUSwwQkFBUjtBQUNBLGtCQUFXLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsTUFBbEIsS0FBNkIsQ0FBOUIsR0FBb0M7QUFBQTtBQUFBLFlBQUssV0FBVSxVQUFmO0FBQUE7QUFBQSxTQUFwQyxHQUFnRztBQUFBO0FBQUEsWUFBSyxXQUFVLFdBQWY7QUFBQTtBQUFBLFNBQTFHO0FBQ0QsT0FIRCxNQUdPLElBQUksS0FBSyxLQUFMLENBQVcsY0FBWCxJQUE2QixLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLE1BQWxCLEtBQTZCLENBQTlELEVBQWlFO0FBQ3RFLGdCQUFRLCtCQUFSO0FBQ0QsT0FGTSxNQUVBO0FBQ0wsZ0JBQVEsa0JBQVI7QUFDRDs7QUFFRCxhQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUsc0JBQWY7QUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLFFBQWYsRUFBd0IsU0FBUyxLQUFLLGlCQUFMLENBQXVCLElBQXZCLENBQTRCLElBQTVCLENBQWpDO0FBQXFFO0FBQXJFLFNBREY7QUFFRTtBQUFBO0FBQUEsWUFBSyxXQUFVLGFBQWY7QUFDRSx5Q0FBTyxNQUFNLE1BQWIsRUFBb0IsSUFBRyxZQUF2QjtBQUNFLHVCQUFVLFlBRFo7QUFFRSxtQkFBTyxLQUFLLEtBQUwsQ0FBVyxNQUZwQjtBQUdFLHlCQUFZLG9CQUhkO0FBSUUsc0JBQVUsS0FBSyxZQUFMLENBQWtCLElBQWxCLENBQXVCLElBQXZCLENBSlo7QUFLRSx3QkFBWSxLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FMZCxHQURGO0FBT0U7QUFBQTtBQUFBLGNBQUcsV0FBVSw4QkFBYixFQUE0QyxTQUFTO0FBQUEsdUJBQU0sT0FBSyxZQUFMLENBQWtCLElBQWxCLFNBQTZCLFNBQTdCLENBQU47QUFBQSxlQUFyRDtBQUFBO0FBQUE7QUFQRixTQUZGO0FBV0csZUFYSDtBQVlFLDRCQUFDLFNBQUQsSUFBVyxRQUFRLEtBQUssS0FBTCxDQUFXLE1BQTlCO0FBQ0Esa0JBQVEsS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixJQUFsQixDQUF1QixJQUF2QjtBQURSO0FBWkYsT0FERjtBQWtCRDs7OztFQXZGcUIsTUFBTSxTOztBQTBGOUIsT0FBTyxTQUFQLEdBQW1CLFNBQW5CIiwiZmlsZSI6Ik15UmF0aW5ncy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIE15UmF0aW5ncyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIG1vdmllczogW10sXG4gICAgICBhbGxSYXRlZE1vdmllczogdHJ1ZSxcbiAgICAgIHNlYXJjaDogJydcbiAgICB9O1xuICB9XG5cbiAgLy9zaG93IHJlbmRlciBhIGxpc3Qgb2YgcmVjZW50IHJlbGVhc2VzIG9uIGluaXRpYWxpemVcbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5nZXRBbGxSYXRlZE1vdmllcygpO1xuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBzZWFyY2g6IGV2ZW50LnRhcmdldC52YWx1ZVxuICAgIH0pO1xuICB9XG5cblxuICBnZXRBbGxSYXRlZE1vdmllcygpIHtcbiAgICAkLmdldChVcmwgKyAnL2dldFVzZXJSYXRpbmdzJylcbiAgICAudGhlbih1c2VyUmF0ZWRNb3ZpZXMgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ3Jlc3BvbnNlIGZyb20gc2VydmVyJywgdXNlclJhdGVkTW92aWVzKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBtb3ZpZXM6IHVzZXJSYXRlZE1vdmllcyxcbiAgICAgICAgYWxsUmF0ZWRNb3ZpZXM6IHRydWVcbiAgICAgIH0pO1xuICAgIH0pXG4gICAgXG4gIH1cblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIC8vLy8vRXZlbnQgSGFuZGxlcnNcbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gIC8vdGhpcyB3aWxsIGNhbGwgc2VhcmNoIGZvciBhIG1vdmllIGZyb20gZXh0ZXJuYWwgQVBJLCBkbyBhIGRhdGFiYXNlIHF1ZXJ5IGZvciByYXRpbmdcbiAgLy9hbmQgc2V0IHRoZSByZXBvbnNlIHRvIHRoZSBtb3ZpZXMgc3RhdGVcbiAgaGFuZGxlU2VhcmNoKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmNoYXJDb2RlID09IDEzIHx8IGV2ZW50ID09PSAnY2xpY2tlZCcpIHtcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgLy90aGlzIHdpbGwgc2VhcmNoIGRhdGFiYXNlXG4gICAgJC5nZXQoVXJsICsgJy9zZWFyY2hSYXRlZE1vdmllJywge3RpdGxlOiB0aGlzLnN0YXRlLnNlYXJjaH0pXG4gICAgLnRoZW4oc2VhcmNoUmVzdWx0cyA9PiB7XG4gICAgICBjb25zb2xlLmxvZygncmVzcG9uc2UgZnJvbSBzZXJ2ZXInLCBzZWFyY2hSZXN1bHRzKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBtb3ZpZXM6IHNlYXJjaFJlc3VsdHMsXG4gICAgICAgIGFsbFJhdGVkTW92aWVzOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfSlcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdmFyIGxhYmxlO1xuICAgIHZhciByZXN1bHRzO1xuICAgIGlmICh0aGlzLnN0YXRlLmFsbFJhdGVkTW92aWVzID09PSBmYWxzZSkge1xuICAgICAgbGFibGUgPSAnYmFjayB0byBhbGwgcmF0ZWQgbW92aWVzJztcbiAgICAgIHJlc3VsdHMgPSAodGhpcy5zdGF0ZS5tb3ZpZXMubGVuZ3RoID09PSAwKSA/ICg8ZGl2IGNsYXNzTmFtZT1cImVycm9yTXNnXCI+cmVzdWx0cyBjYW5ub3QgYmUgZm91bmQ8L2Rpdj4pIDogKDxkaXYgY2xhc3NOYW1lPVwidXBkYXRlTXNnXCI+YWxsIG1hdGNoIHJlc3VsdHM6PC9kaXY+KVxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5hbGxSYXRlZE1vdmllcyAmJiB0aGlzLnN0YXRlLm1vdmllcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGxhYmxlID0gJ3lvdSBoYXZlIG5vdCByYXRlZCBhbnkgbW92aWVzJztcbiAgICB9IGVsc2Uge1xuICAgICAgbGFibGUgPSAnYWxsIHJhdGVkIG1vdmllcyc7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdNeVJhdGluZ3MgY29sbGVjdGlvbic+IFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0naGVhZGVyJyBvbkNsaWNrPXt0aGlzLmdldEFsbFJhdGVkTW92aWVzLmJpbmQodGhpcyl9PntsYWJsZX08L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3NlYXJjaE1vdmllJz5cbiAgICAgICAgICA8aW5wdXQgdHlwZSA9J3RleHQnIGlkPSdtb3ZpZUlucHV0JyBcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nbW92aWVJbnB1dCdcbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnNlYXJjaH1cbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPSdJbnNlcnQgTW92aWUgVGl0bGUnXG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIG9uS2V5UHJlc3M9e3RoaXMuaGFuZGxlU2VhcmNoLmJpbmQodGhpcyl9Lz5cbiAgICAgICAgICA8YSBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17KCkgPT4gdGhpcy5oYW5kbGVTZWFyY2guYmluZCh0aGlzKSgnY2xpY2tlZCcpfT5zZWFyY2g8L2E+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7cmVzdWx0c31cbiAgICAgICAgPE1vdmllTGlzdCBtb3ZpZXM9e3RoaXMuc3RhdGUubW92aWVzfVxuICAgICAgICBjaGFuZ2U9e3RoaXMucHJvcHMuY2hhbmdlLmJpbmQodGhpcyl9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxud2luZG93Lk15UmF0aW5ncyA9IE15UmF0aW5nczsiXX0=
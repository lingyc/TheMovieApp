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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL015UmF0aW5ncy9NeVJhdGluZ3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNLFM7OztBQUNKLHFCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSw2RkFDWCxLQURXOztBQUdqQixVQUFLLEtBQUwsR0FBYTtBQUNYLGNBQVEsRUFERztBQUVYLHNCQUFnQixJQUZMO0FBR1gsY0FBUTtBQUhHLEtBQWI7QUFIaUI7QUFRbEI7Ozs7Ozs7d0NBR21CO0FBQ2xCLFdBQUssaUJBQUw7QUFDRDs7O2lDQUVZLEssRUFBTztBQUNsQixXQUFLLFFBQUwsQ0FBYztBQUNaLGdCQUFRLE1BQU0sTUFBTixDQUFhO0FBRFQsT0FBZDtBQUdEOzs7d0NBR21CO0FBQUE7O0FBQ2xCLFFBQUUsR0FBRixDQUFNLE1BQU0saUJBQVosRUFDQyxJQURELENBQ00sMkJBQW1CO0FBQ3ZCLGdCQUFRLEdBQVIsQ0FBWSxzQkFBWixFQUFvQyxlQUFwQztBQUNBLGVBQUssUUFBTCxDQUFjO0FBQ1osa0JBQVEsZUFESTtBQUVaLDBCQUFnQjtBQUZKLFNBQWQ7QUFJRCxPQVBEO0FBU0Q7Ozs7Ozs7Ozs7O2lDQVFZLEssRUFBTztBQUFBOztBQUNsQixVQUFJLE1BQU0sUUFBTixJQUFrQixFQUFsQixJQUF3QixVQUFVLFNBQXRDLEVBQWlEO0FBQy9DLFlBQUksT0FBTyxJQUFYOzs7QUFHRixVQUFFLEdBQUYsQ0FBTSxNQUFNLG1CQUFaLEVBQWlDLEVBQUMsT0FBTyxLQUFLLEtBQUwsQ0FBVyxNQUFuQixFQUFqQyxFQUNDLElBREQsQ0FDTSx5QkFBaUI7QUFDckIsa0JBQVEsR0FBUixDQUFZLHNCQUFaLEVBQW9DLGFBQXBDO0FBQ0EsaUJBQUssUUFBTCxDQUFjO0FBQ1osb0JBQVEsYUFESTtBQUVaLDRCQUFnQjtBQUZKLFdBQWQ7QUFJRCxTQVBEO0FBUUM7QUFDRjs7OzZCQUVRO0FBQUE7O0FBQ1AsVUFBSSxLQUFKO0FBQ0EsVUFBSSxPQUFKO0FBQ0EsVUFBSSxLQUFLLEtBQUwsQ0FBVyxjQUFYLEtBQThCLEtBQWxDLEVBQXlDO0FBQ3ZDLGdCQUFRLDBCQUFSO0FBQ0Esa0JBQVcsS0FBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixNQUFsQixLQUE2QixDQUE5QixHQUFvQztBQUFBO0FBQUEsWUFBSyxXQUFVLFVBQWY7QUFBQTtBQUFBLFNBQXBDLEdBQWdHO0FBQUE7QUFBQSxZQUFLLFdBQVUsV0FBZjtBQUFBO0FBQUEsU0FBMUc7QUFDRCxPQUhELE1BR08sSUFBSSxLQUFLLEtBQUwsQ0FBVyxjQUFYLElBQTZCLEtBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsTUFBbEIsS0FBNkIsQ0FBOUQsRUFBaUU7QUFDdEUsZ0JBQVEsK0JBQVI7QUFDRCxPQUZNLE1BRUE7QUFDTCxnQkFBUSxrQkFBUjtBQUNEOztBQUVELGFBQ0U7QUFBQTtBQUFBLFVBQUssV0FBVSxzQkFBZjtBQUNFO0FBQUE7QUFBQSxZQUFLLFdBQVUsUUFBZixFQUF3QixTQUFTLEtBQUssaUJBQUwsQ0FBdUIsSUFBdkIsQ0FBNEIsSUFBNUIsQ0FBakM7QUFBcUU7QUFBckUsU0FERjtBQUVFO0FBQUE7QUFBQSxZQUFLLFdBQVUsYUFBZjtBQUNFLHlDQUFPLE1BQU0sTUFBYixFQUFvQixJQUFHLFlBQXZCO0FBQ0UsdUJBQVUsWUFEWjtBQUVFLG1CQUFPLEtBQUssS0FBTCxDQUFXLE1BRnBCO0FBR0UseUJBQVksb0JBSGQ7QUFJRSxzQkFBVSxLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FKWjtBQUtFLHdCQUFZLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixJQUF2QixDQUxkLEdBREY7QUFPRTtBQUFBO0FBQUEsY0FBRyxXQUFVLDhCQUFiLEVBQTRDLFNBQVM7QUFBQSx1QkFBTSxPQUFLLFlBQUwsQ0FBa0IsSUFBbEIsU0FBNkIsU0FBN0IsQ0FBTjtBQUFBLGVBQXJEO0FBQUE7QUFBQTtBQVBGLFNBRkY7QUFXRyxlQVhIO0FBWUUsNEJBQUMsU0FBRCxJQUFXLFFBQVEsS0FBSyxLQUFMLENBQVcsTUFBOUI7QUFDQSxrQkFBUSxLQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLElBQWxCLENBQXVCLElBQXZCO0FBRFI7QUFaRixPQURGO0FBa0JEOzs7O0VBdkZxQixNQUFNLFM7O0FBMEY5QixPQUFPLFNBQVAsR0FBbUIsU0FBbkIiLCJmaWxlIjoiTXlSYXRpbmdzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgTXlSYXRpbmdzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgbW92aWVzOiBbXSxcbiAgICAgIGFsbFJhdGVkTW92aWVzOiB0cnVlLFxuICAgICAgc2VhcmNoOiAnJ1xuICAgIH07XG4gIH1cblxuICAvL3Nob3cgcmVuZGVyIGEgbGlzdCBvZiByZWNlbnQgcmVsZWFzZXMgb24gaW5pdGlhbGl6ZVxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB0aGlzLmdldEFsbFJhdGVkTW92aWVzKCk7XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UoZXZlbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHNlYXJjaDogZXZlbnQudGFyZ2V0LnZhbHVlXG4gICAgfSk7XG4gIH1cblxuXG4gIGdldEFsbFJhdGVkTW92aWVzKCkge1xuICAgICQuZ2V0KFVybCArICcvZ2V0VXNlclJhdGluZ3MnKVxuICAgIC50aGVuKHVzZXJSYXRlZE1vdmllcyA9PiB7XG4gICAgICBjb25zb2xlLmxvZygncmVzcG9uc2UgZnJvbSBzZXJ2ZXInLCB1c2VyUmF0ZWRNb3ZpZXMpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG1vdmllczogdXNlclJhdGVkTW92aWVzLFxuICAgICAgICBhbGxSYXRlZE1vdmllczogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSlcbiAgICBcbiAgfVxuXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgLy8vLy9FdmVudCBIYW5kbGVyc1xuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgLy90aGlzIHdpbGwgY2FsbCBzZWFyY2ggZm9yIGEgbW92aWUgZnJvbSBleHRlcm5hbCBBUEksIGRvIGEgZGF0YWJhc2UgcXVlcnkgZm9yIHJhdGluZ1xuICAvL2FuZCBzZXQgdGhlIHJlcG9uc2UgdG8gdGhlIG1vdmllcyBzdGF0ZVxuICBoYW5kbGVTZWFyY2goZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQuY2hhckNvZGUgPT0gMTMgfHwgZXZlbnQgPT09ICdjbGlja2VkJykge1xuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAvL3RoaXMgd2lsbCBzZWFyY2ggZGF0YWJhc2VcbiAgICAkLmdldChVcmwgKyAnL3NlYXJjaFJhdGVkTW92aWUnLCB7dGl0bGU6IHRoaXMuc3RhdGUuc2VhcmNofSlcbiAgICAudGhlbihzZWFyY2hSZXN1bHRzID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdyZXNwb25zZSBmcm9tIHNlcnZlcicsIHNlYXJjaFJlc3VsdHMpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG1vdmllczogc2VhcmNoUmVzdWx0cyxcbiAgICAgICAgYWxsUmF0ZWRNb3ZpZXM6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICB2YXIgbGFibGU7XG4gICAgdmFyIHJlc3VsdHM7XG4gICAgaWYgKHRoaXMuc3RhdGUuYWxsUmF0ZWRNb3ZpZXMgPT09IGZhbHNlKSB7XG4gICAgICBsYWJsZSA9ICdiYWNrIHRvIGFsbCByYXRlZCBtb3ZpZXMnO1xuICAgICAgcmVzdWx0cyA9ICh0aGlzLnN0YXRlLm1vdmllcy5sZW5ndGggPT09IDApID8gKDxkaXYgY2xhc3NOYW1lPVwiZXJyb3JNc2dcIj5yZXN1bHRzIGNhbm5vdCBiZSBmb3VuZDwvZGl2PikgOiAoPGRpdiBjbGFzc05hbWU9XCJ1cGRhdGVNc2dcIj5hbGwgbWF0Y2ggcmVzdWx0czo8L2Rpdj4pXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLmFsbFJhdGVkTW92aWVzICYmIHRoaXMuc3RhdGUubW92aWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgbGFibGUgPSAneW91IGhhdmUgbm90IHJhdGVkIGFueSBtb3ZpZXMnO1xuICAgIH0gZWxzZSB7XG4gICAgICBsYWJsZSA9ICdhbGwgcmF0ZWQgbW92aWVzJztcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9J015UmF0aW5ncyBjb2xsZWN0aW9uJz4gXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdoZWFkZXInIG9uQ2xpY2s9e3RoaXMuZ2V0QWxsUmF0ZWRNb3ZpZXMuYmluZCh0aGlzKX0+e2xhYmxlfTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nc2VhcmNoTW92aWUnPlxuICAgICAgICAgIDxpbnB1dCB0eXBlID0ndGV4dCcgaWQ9J21vdmllSW5wdXQnIFxuICAgICAgICAgICAgY2xhc3NOYW1lPSdtb3ZpZUlucHV0J1xuICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuc2VhcmNofVxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9J0luc2VydCBNb3ZpZSBUaXRsZSdcbiAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgb25LZXlQcmVzcz17dGhpcy5oYW5kbGVTZWFyY2guYmluZCh0aGlzKX0vPlxuICAgICAgICAgIDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXsoKSA9PiB0aGlzLmhhbmRsZVNlYXJjaC5iaW5kKHRoaXMpKCdjbGlja2VkJyl9PnNlYXJjaDwvYT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHtyZXN1bHRzfVxuICAgICAgICA8TW92aWVMaXN0IG1vdmllcz17dGhpcy5zdGF0ZS5tb3ZpZXN9XG4gICAgICAgIGNoYW5nZT17dGhpcy5wcm9wcy5jaGFuZ2UuYmluZCh0aGlzKX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG53aW5kb3cuTXlSYXRpbmdzID0gTXlSYXRpbmdzOyJdfQ==
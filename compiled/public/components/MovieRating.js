'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MovieRating = function (_React$Component) {
  _inherits(MovieRating, _React$Component);

  function MovieRating(props) {
    _classCallCheck(this, MovieRating);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MovieRating).call(this, props));

    _this.state = {
      value: ''
    };
    return _this;
  }

  _createClass(MovieRating, [{
    key: 'handleSearch',
    value: function handleSearch(event) {
      this.props.handleSearchMovie(event.target.value);
      this.setState({
        value: event.target.value
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'friendMovieList' },
        'Movie Title: ',
        React.createElement('input', { type: 'text',
          id: 'movieInput',
          className: 'movieInput',
          placeholder: 'Insert Movie Title',
          value: this.state.value,
          onChange: this.handleSearch.bind(this)
        }),
        React.createElement(
          'button',
          { className: 'searchSubmitButton' },
          'Get Movie'
        ),
        React.createElement(
          'div',
          null,
          React.createElement(MovieDisplay, {
            movie: this.props.movie
          })
        )
      );
    }
  }]);

  return MovieRating;
}(React.Component);

window.MovieRating = MovieRating;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL01vdmllUmF0aW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTSxXOzs7QUFDSix1QkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsK0ZBQ1gsS0FEVzs7QUFHakIsVUFBSyxLQUFMLEdBQWE7QUFDWCxhQUFPO0FBREksS0FBYjtBQUhpQjtBQU1sQjs7OztpQ0FFWSxLLEVBQU87QUFDbEIsV0FBSyxLQUFMLENBQVcsaUJBQVgsQ0FBNkIsTUFBTSxNQUFOLENBQWEsS0FBMUM7QUFDQSxXQUFLLFFBQUwsQ0FBYztBQUNaLGVBQU8sTUFBTSxNQUFOLENBQWE7QUFEUixPQUFkO0FBR0Q7Ozs2QkFFUTtBQUNQLGFBQ0U7QUFBQTtBQUFBLFVBQUssV0FBVSxpQkFBZjtBQUFBO0FBRWUsdUNBQU8sTUFBTSxNQUFiO0FBQ2IsY0FBRyxZQURVO0FBRWIscUJBQVUsWUFGRztBQUdiLHVCQUFZLG9CQUhDO0FBSWIsaUJBQU8sS0FBSyxLQUFMLENBQVcsS0FKTDtBQUtiLG9CQUFVLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixJQUF2QjtBQUxHLFVBRmY7QUFTRTtBQUFBO0FBQUEsWUFBUSxXQUFVLG9CQUFsQjtBQUFBO0FBQUEsU0FURjtBQVdFO0FBQUE7QUFBQTtBQUNFLDhCQUFDLFlBQUQ7QUFDQSxtQkFBTyxLQUFLLEtBQUwsQ0FBVztBQURsQjtBQURGO0FBWEYsT0FERjtBQW1CRDs7OztFQXBDdUIsTUFBTSxTOztBQXVDaEMsT0FBTyxXQUFQLEdBQXFCLFdBQXJCIiwiZmlsZSI6Ik1vdmllUmF0aW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgTW92aWVSYXRpbmcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICB2YWx1ZTogJydcbiAgICB9O1xuICB9XG5cbiAgaGFuZGxlU2VhcmNoKGV2ZW50KSB7XG4gICAgdGhpcy5wcm9wcy5oYW5kbGVTZWFyY2hNb3ZpZShldmVudC50YXJnZXQudmFsdWUpO1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdmFsdWU6IGV2ZW50LnRhcmdldC52YWx1ZVxuICAgIH0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nZnJpZW5kTW92aWVMaXN0Jz5cblxuICAgICAgICBNb3ZpZSBUaXRsZTogPGlucHV0IHR5cGUgPSd0ZXh0JyBcbiAgICAgICAgaWQ9J21vdmllSW5wdXQnIFxuICAgICAgICBjbGFzc05hbWU9J21vdmllSW5wdXQnXG4gICAgICAgIHBsYWNlaG9sZGVyPSdJbnNlcnQgTW92aWUgVGl0bGUnXG4gICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfVxuICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVTZWFyY2guYmluZCh0aGlzKX1cbiAgICAgICAgIC8+XG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPSdzZWFyY2hTdWJtaXRCdXR0b24nPlxuICAgICAgICBHZXQgTW92aWU8L2J1dHRvbj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8TW92aWVEaXNwbGF5XG4gICAgICAgICAgbW92aWU9e3RoaXMucHJvcHMubW92aWV9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG5cbndpbmRvdy5Nb3ZpZVJhdGluZyA9IE1vdmllUmF0aW5nOyJdfQ==
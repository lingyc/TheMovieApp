'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MovieRating = function (_React$Component) {
  _inherits(MovieRating, _React$Component);

  function MovieRating(props) {
    _classCallCheck(this, MovieRating);

    var _this = _possibleConstructorReturn(this, (MovieRating.__proto__ || Object.getPrototypeOf(MovieRating)).call(this, props));

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL01vdmllUmF0aW5nLmpzIl0sIm5hbWVzIjpbIk1vdmllUmF0aW5nIiwicHJvcHMiLCJzdGF0ZSIsInZhbHVlIiwiZXZlbnQiLCJoYW5kbGVTZWFyY2hNb3ZpZSIsInRhcmdldCIsInNldFN0YXRlIiwiaGFuZGxlU2VhcmNoIiwiYmluZCIsIm1vdmllIiwiUmVhY3QiLCJDb21wb25lbnQiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTUEsVzs7O0FBQ0osdUJBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSwwSEFDWEEsS0FEVzs7QUFHakIsVUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGFBQU87QUFESSxLQUFiO0FBSGlCO0FBTWxCOzs7O2lDQUVZQyxLLEVBQU87QUFDbEIsV0FBS0gsS0FBTCxDQUFXSSxpQkFBWCxDQUE2QkQsTUFBTUUsTUFBTixDQUFhSCxLQUExQztBQUNBLFdBQUtJLFFBQUwsQ0FBYztBQUNaSixlQUFPQyxNQUFNRSxNQUFOLENBQWFIO0FBRFIsT0FBZDtBQUdEOzs7NkJBRVE7QUFDUCxhQUNFO0FBQUE7QUFBQSxVQUFLLFdBQVUsaUJBQWY7QUFBQTtBQUVlLHVDQUFPLE1BQU0sTUFBYjtBQUNiLGNBQUcsWUFEVTtBQUViLHFCQUFVLFlBRkc7QUFHYix1QkFBWSxvQkFIQztBQUliLGlCQUFPLEtBQUtELEtBQUwsQ0FBV0MsS0FKTDtBQUtiLG9CQUFVLEtBQUtLLFlBQUwsQ0FBa0JDLElBQWxCLENBQXVCLElBQXZCO0FBTEcsVUFGZjtBQVNFO0FBQUE7QUFBQSxZQUFRLFdBQVUsb0JBQWxCO0FBQUE7QUFBQSxTQVRGO0FBV0U7QUFBQTtBQUFBO0FBQ0UsOEJBQUMsWUFBRDtBQUNBLG1CQUFPLEtBQUtSLEtBQUwsQ0FBV1M7QUFEbEI7QUFERjtBQVhGLE9BREY7QUFtQkQ7Ozs7RUFwQ3VCQyxNQUFNQyxTOztBQXVDaENDLE9BQU9iLFdBQVAsR0FBcUJBLFdBQXJCIiwiZmlsZSI6Ik1vdmllUmF0aW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgTW92aWVSYXRpbmcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgdmFsdWU6ICcnXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlU2VhcmNoKGV2ZW50KSB7XHJcbiAgICB0aGlzLnByb3BzLmhhbmRsZVNlYXJjaE1vdmllKGV2ZW50LnRhcmdldC52YWx1ZSk7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgdmFsdWU6IGV2ZW50LnRhcmdldC52YWx1ZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nZnJpZW5kTW92aWVMaXN0Jz5cclxuXHJcbiAgICAgICAgTW92aWUgVGl0bGU6IDxpbnB1dCB0eXBlID0ndGV4dCcgXHJcbiAgICAgICAgaWQ9J21vdmllSW5wdXQnIFxyXG4gICAgICAgIGNsYXNzTmFtZT0nbW92aWVJbnB1dCdcclxuICAgICAgICBwbGFjZWhvbGRlcj0nSW5zZXJ0IE1vdmllIFRpdGxlJ1xyXG4gICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfVxyXG4gICAgICAgIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZVNlYXJjaC5iaW5kKHRoaXMpfVxyXG4gICAgICAgICAvPlxyXG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPSdzZWFyY2hTdWJtaXRCdXR0b24nPlxyXG4gICAgICAgIEdldCBNb3ZpZTwvYnV0dG9uPlxyXG4gICAgICAgIDxkaXY+XHJcbiAgICAgICAgICA8TW92aWVEaXNwbGF5XHJcbiAgICAgICAgICBtb3ZpZT17dGhpcy5wcm9wcy5tb3ZpZX1cclxuICAgICAgICAgIC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuXHJcbndpbmRvdy5Nb3ZpZVJhdGluZyA9IE1vdmllUmF0aW5nOyJdfQ==
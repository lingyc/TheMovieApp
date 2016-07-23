'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SingleMovieRatingEntry = function (_React$Component) {
  _inherits(SingleMovieRatingEntry, _React$Component);

  function SingleMovieRatingEntry(props) {
    _classCallCheck(this, SingleMovieRatingEntry);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SingleMovieRatingEntry).call(this, props));

    _this.state = {
      rating: props.rating
    };
    return _this;
  }

  _createClass(SingleMovieRatingEntry, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      console.log(this.props);
    }
  }, {
    key: 'handleClick',
    value: function handleClick() {
      console.log(this);
      // this.props.fof();
      // this.props.change('singleFriend', this.state.rating.friendUserName);
    }
  }, {
    key: 'render',
    value: function render() {
      //note, on click of portrait, name, review
      //should be able to see all the movies reviewed by friend
      //on send watch request click, should send a watch request
      var rating = this.state.rating;
      var that = this;
      return React.createElement(
        'div',
        null,
        React.createElement(
          'h1',
          { className: 'individual', onClick: that.props.fof },
          rating.friendUserName
        ),
        React.createElement(
          'p',
          null,
          rating.review
        ),
        React.createElement(
          'p',
          null,
          rating.score
        ),
        React.createElement(
          'p',
          null,
          'PLACEHOLDER: taste compatability with me: 90%'
        ),
        React.createElement(
          'p',
          null,
          'PLACEHOLDER: send watch request'
        )
      );
    }
  }]);

  return SingleMovieRatingEntry;
}(React.Component);

window.SingleMovieRatingEntry = SingleMovieRatingEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9TaW5nbGVNb3ZpZVJhdGluZ0VudHJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTSxzQjs7O0FBQ0osa0NBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLDBHQUNYLEtBRFc7O0FBRWpCLFVBQUssS0FBTCxHQUFhO0FBQ1gsY0FBUSxNQUFNO0FBREgsS0FBYjtBQUZpQjtBQUtsQjs7Ozt3Q0FFbUI7QUFDbEIsY0FBUSxHQUFSLENBQVksS0FBSyxLQUFqQjtBQUNEOzs7a0NBRWE7QUFDWixjQUFRLEdBQVIsQ0FBWSxJQUFaOzs7QUFHRDs7OzZCQUVROzs7O0FBSVAsVUFBSSxTQUFTLEtBQUssS0FBTCxDQUFXLE1BQXhCO0FBQ0EsVUFBSSxPQUFPLElBQVg7QUFDQSxhQUNFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxZQUFJLFdBQVUsWUFBZCxFQUEyQixTQUFTLEtBQUssS0FBTCxDQUFXLEdBQS9DO0FBQXFELGlCQUFPO0FBQTVELFNBREY7QUFFRTtBQUFBO0FBQUE7QUFBSSxpQkFBTztBQUFYLFNBRkY7QUFHRTtBQUFBO0FBQUE7QUFBSSxpQkFBTztBQUFYLFNBSEY7QUFJRTtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBSkY7QUFLRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTEYsT0FERjtBQVNEOzs7O0VBakNrQyxNQUFNLFM7O0FBcUMzQyxPQUFPLHNCQUFQLEdBQWdDLHNCQUFoQyIsImZpbGUiOiJTaW5nbGVNb3ZpZVJhdGluZ0VudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgU2luZ2xlTW92aWVSYXRpbmdFbnRyeSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICByYXRpbmc6IHByb3BzLnJhdGluZ1xuICAgIH07XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLnByb3BzKTtcbiAgfVxuXG4gIGhhbmRsZUNsaWNrKCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMpXG4gICAgLy8gdGhpcy5wcm9wcy5mb2YoKTtcbiAgICAvLyB0aGlzLnByb3BzLmNoYW5nZSgnc2luZ2xlRnJpZW5kJywgdGhpcy5zdGF0ZS5yYXRpbmcuZnJpZW5kVXNlck5hbWUpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIC8vbm90ZSwgb24gY2xpY2sgb2YgcG9ydHJhaXQsIG5hbWUsIHJldmlld1xuICAgIC8vc2hvdWxkIGJlIGFibGUgdG8gc2VlIGFsbCB0aGUgbW92aWVzIHJldmlld2VkIGJ5IGZyaWVuZFxuICAgIC8vb24gc2VuZCB3YXRjaCByZXF1ZXN0IGNsaWNrLCBzaG91bGQgc2VuZCBhIHdhdGNoIHJlcXVlc3RcbiAgICBsZXQgcmF0aW5nID0gdGhpcy5zdGF0ZS5yYXRpbmc7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8aDEgY2xhc3NOYW1lPSdpbmRpdmlkdWFsJyBvbkNsaWNrPXt0aGF0LnByb3BzLmZvZn0+e3JhdGluZy5mcmllbmRVc2VyTmFtZX08L2gxPlxuICAgICAgICA8cD57cmF0aW5nLnJldmlld308L3A+XG4gICAgICAgIDxwPntyYXRpbmcuc2NvcmV9PC9wPlxuICAgICAgICA8cD5QTEFDRUhPTERFUjogdGFzdGUgY29tcGF0YWJpbGl0eSB3aXRoIG1lOiA5MCU8L3A+XG4gICAgICAgIDxwPlBMQUNFSE9MREVSOiBzZW5kIHdhdGNoIHJlcXVlc3Q8L3A+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbn1cblxud2luZG93LlNpbmdsZU1vdmllUmF0aW5nRW50cnkgPSBTaW5nbGVNb3ZpZVJhdGluZ0VudHJ5O1xuXG4iXX0=
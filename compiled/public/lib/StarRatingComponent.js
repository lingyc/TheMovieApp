'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StarRatingComponent = function (_React$Component) {
  _inherits(StarRatingComponent, _React$Component);

  function StarRatingComponent(props) {
    _classCallCheck(this, StarRatingComponent);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(StarRatingComponent).call(this, props));

    _this.state = {
      userRating: _this.props.movie.score,
      ratingUpdated: false
    };
    return _this;
  }

  _createClass(StarRatingComponent, [{
    key: 'onStarClick',
    value: function onStarClick(event) {
      this.setState({ userRating: event.target.value });
      this.updateRating(event.target.value);
    }
  }, {
    key: 'updateRating',
    value: function updateRating(rating) {
      var _this2 = this;

      var movieObj = {
        title: this.props.movie.title,
        id: this.props.movie.id,
        rating: rating
      };
      $.post(Url + '/ratemovie', movieObj).done(function (response) {
        console.log('movie rating updated');
        _this2.setState({
          ratingUpdated: true
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.state.userRating === 1) {
        var stars = React.createElement(
          'form',
          { className: 'star-rating col-sm-10' },
          React.createElement('input', { id: 'star-rating', checked: 'true', type: 'radio', name: 'group1', value: '1', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null),
          React.createElement('input', { id: 'star-rating', type: 'radio', name: 'group1', value: '2', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null),
          React.createElement('input', { id: 'star-rating', type: 'radio', name: 'group1', value: '3', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null),
          React.createElement('input', { id: 'star-rating', type: 'radio', name: 'group1', value: '4', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null),
          React.createElement('input', { id: 'star-rating', type: 'radio', name: 'group1', value: '5', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null)
        );
      } else if (this.state.userRating === 2) {
        var stars = React.createElement(
          'form',
          { className: 'star-rating col-sm-10' },
          React.createElement('input', { id: 'star-rating', type: 'radio', name: 'group1', value: '1', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null),
          React.createElement('input', { id: 'star-rating', checked: 'true', type: 'radio', name: 'group1', value: '2', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null),
          React.createElement('input', { id: 'star-rating', type: 'radio', name: 'group1', value: '3', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null),
          React.createElement('input', { id: 'star-rating', type: 'radio', name: 'group1', value: '4', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null),
          React.createElement('input', { id: 'star-rating', type: 'radio', name: 'group1', value: '5', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null)
        );
      } else if (this.state.userRating === 3) {
        var stars = React.createElement(
          'form',
          { className: 'star-rating col-sm-10' },
          React.createElement('input', { id: 'star-rating', type: 'radio', name: 'group1', value: '1', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null),
          React.createElement('input', { id: 'star-rating', type: 'radio', name: 'group1', value: '2', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null),
          React.createElement('input', { id: 'star-rating', checked: 'true', type: 'radio', name: 'group1', value: '3', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null),
          React.createElement('input', { id: 'star-rating', type: 'radio', name: 'group1', value: '4', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null),
          React.createElement('input', { id: 'star-rating', type: 'radio', name: 'group1', value: '5', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null)
        );
      } else if (this.state.userRating === 4) {
        var stars = React.createElement(
          'form',
          { className: 'star-rating col-sm-10' },
          React.createElement('input', { id: 'star-rating', type: 'radio', name: 'group1', value: '1', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null),
          React.createElement('input', { id: 'star-rating', type: 'radio', name: 'group1', value: '2', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null),
          React.createElement('input', { id: 'star-rating', type: 'radio', name: 'group1', value: '3', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null),
          React.createElement('input', { id: 'star-rating', checked: 'true', type: 'radio', name: 'group1', value: '4', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null),
          React.createElement('input', { id: 'star-rating', type: 'radio', name: 'group1', value: '5', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null)
        );
      } else if (this.state.userRating === 5) {
        var stars = React.createElement(
          'form',
          { className: 'star-rating col-sm-10' },
          React.createElement('input', { id: 'star-rating', type: 'radio', name: 'group1', value: '1', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null),
          React.createElement('input', { id: 'star-rating', type: 'radio', name: 'group1', value: '2', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null),
          React.createElement('input', { id: 'star-rating', type: 'radio', name: 'group1', value: '3', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null),
          React.createElement('input', { id: 'star-rating', type: 'radio', name: 'group1', value: '4', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null),
          React.createElement('input', { id: 'star-rating', checked: 'true', type: 'radio', name: 'group1', value: '5', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null)
        );
      } else {
        var stars = React.createElement(
          'form',
          { className: 'star-rating col-sm-10' },
          React.createElement('input', { id: 'star-rating', type: 'radio', name: 'group1', value: '1', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null),
          React.createElement('input', { id: 'star-rating', type: 'radio', name: 'group1', value: '2', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null),
          React.createElement('input', { id: 'star-rating', type: 'radio', name: 'group1', value: '3', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null),
          React.createElement('input', { id: 'star-rating', type: 'radio', name: 'group1', value: '4', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null),
          React.createElement('input', { id: 'star-rating', type: 'radio', name: 'group1', value: '5', onChange: this.onStarClick.bind(this) }),
          React.createElement('i', null)
        );
      }
      return React.createElement(
        'div',
        { className: 'userRating col s4' },
        this.state.userRating === null ? React.createElement(
          'div',
          { className: 'notRatedMsg' },
          'you haven\'t rated this movie'
        ) : React.createElement(
          'div',
          { className: 'yourRating' },
          'your rating is ',
          React.createElement(
            'b',
            null,
            this.state.userRating
          )
        ),
        stars,
        this.state.ratingUpdated ? React.createElement(
          'div',
          { className: 'updateMsg' },
          'rating has updated'
        ) : ''
      );
    }
  }]);

  return StarRatingComponent;
}(React.Component);

window.StarRatingComponent = StarRatingComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9saWIvU3RhclJhdGluZ0NvbXBvbmVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sbUI7OztBQUVKLCtCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSx1R0FDWCxLQURXOztBQUdqQixVQUFLLEtBQUwsR0FBYTtBQUNYLGtCQUFZLE1BQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsS0FEbEI7QUFFWCxxQkFBZTtBQUZKLEtBQWI7QUFIaUI7QUFPbEI7Ozs7Z0NBRVcsSyxFQUFPO0FBQ2pCLFdBQUssUUFBTCxDQUFjLEVBQUMsWUFBWSxNQUFNLE1BQU4sQ0FBYSxLQUExQixFQUFkO0FBQ0EsV0FBSyxZQUFMLENBQWtCLE1BQU0sTUFBTixDQUFhLEtBQS9CO0FBQ0Q7OztpQ0FFWSxNLEVBQVE7QUFBQTs7QUFDbkIsVUFBSSxXQUFXO0FBQ2IsZUFBTyxLQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLEtBRFg7QUFFYixZQUFJLEtBQUssS0FBTCxDQUFXLEtBQVgsQ0FBaUIsRUFGUjtBQUdiLGdCQUFRO0FBSEssT0FBZjtBQUtBLFFBQUUsSUFBRixDQUFPLE1BQU0sWUFBYixFQUEyQixRQUEzQixFQUNDLElBREQsQ0FDTSxvQkFBWTtBQUNoQixnQkFBUSxHQUFSLENBQVksc0JBQVo7QUFDQSxlQUFLLFFBQUwsQ0FBYztBQUNiLHlCQUFlO0FBREYsU0FBZDtBQUdELE9BTkQ7QUFPRDs7OzZCQUVRO0FBQ1AsVUFBSSxLQUFLLEtBQUwsQ0FBVyxVQUFYLEtBQTBCLENBQTlCLEVBQWlDO0FBQy9CLFlBQUksUUFDRjtBQUFBO0FBQUEsWUFBTSxXQUFVLHVCQUFoQjtBQUNFLHlDQUFPLElBQUcsYUFBVixFQUF3QixTQUFRLE1BQWhDLEVBQXVDLE1BQUssT0FBNUMsRUFBb0QsTUFBSyxRQUF6RCxFQUFrRSxPQUFNLEdBQXhFLEVBQTRFLFVBQVUsS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCLENBQXRG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SkY7QUFJdUcsd0NBSnZHO0FBS0UseUNBQU8sSUFBRyxhQUFWLEVBQXdCLE1BQUssT0FBN0IsRUFBcUMsTUFBSyxRQUExQyxFQUFtRCxPQUFNLEdBQXpELEVBQTZELFVBQVUsS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCLENBQXZFLEdBTEY7QUFLdUc7QUFMdkcsU0FERjtBQVNEO0FBQ0gsYUFDQTtBQUFBO0FBQUEsVUFBSyxXQUFVLG1CQUFmO0FBQ0csYUFBSyxLQUFMLENBQVcsVUFBWCxLQUEwQixJQUEzQixHQUFtQztBQUFBO0FBQUEsWUFBSyxXQUFVLGFBQWY7QUFBQTtBQUFBLFNBQW5DLEdBQXFHO0FBQUE7QUFBQSxZQUFLLFdBQVUsWUFBZjtBQUFBO0FBQTJDO0FBQUE7QUFBQTtBQUFJLGlCQUFLLEtBQUwsQ0FBVztBQUFmO0FBQTNDLFNBRHZHO0FBRUssYUFGTDtBQUdHLGFBQUssS0FBTCxDQUFXLGFBQVosR0FBNkI7QUFBQTtBQUFBLFlBQUssV0FBVSxXQUFmO0FBQUE7QUFBQSxTQUE3QixHQUFtRjtBQUhyRixPQURBO0FBTUM7Ozs7RUFuRytCLE1BQU0sUzs7QUFzR3hDLE9BQU8sbUJBQVAsR0FBNkIsbUJBQTdCIiwiZmlsZSI6IlN0YXJSYXRpbmdDb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBTdGFyUmF0aW5nQ29tcG9uZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICB1c2VyUmF0aW5nOiB0aGlzLnByb3BzLm1vdmllLnNjb3JlLFxuICAgICAgcmF0aW5nVXBkYXRlZDogZmFsc2VcbiAgICB9O1xuICB9XG5cbiAgb25TdGFyQ2xpY2soZXZlbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHt1c2VyUmF0aW5nOiBldmVudC50YXJnZXQudmFsdWV9KTtcbiAgICB0aGlzLnVwZGF0ZVJhdGluZyhldmVudC50YXJnZXQudmFsdWUpO1xuICB9XG5cbiAgdXBkYXRlUmF0aW5nKHJhdGluZykge1xuICAgIHZhciBtb3ZpZU9iaiA9IHtcbiAgICAgIHRpdGxlOiB0aGlzLnByb3BzLm1vdmllLnRpdGxlLCBcbiAgICAgIGlkOiB0aGlzLnByb3BzLm1vdmllLmlkLFxuICAgICAgcmF0aW5nOiByYXRpbmdcbiAgICB9O1xuICAgICQucG9zdChVcmwgKyAnL3JhdGVtb3ZpZScsIG1vdmllT2JqKVxuICAgIC5kb25lKHJlc3BvbnNlID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdtb3ZpZSByYXRpbmcgdXBkYXRlZCcpO1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBcdHJhdGluZ1VwZGF0ZWQ6IHRydWVcbiAgICAgIH0pXG4gICAgfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUudXNlclJhdGluZyA9PT0gMSkge1xuICAgICAgdmFyIHN0YXJzID0gKFxuICAgICAgICA8Zm9ybSBjbGFzc05hbWU9XCJzdGFyLXJhdGluZyBjb2wtc20tMTBcIj5cbiAgICAgICAgICA8aW5wdXQgaWQ9XCJzdGFyLXJhdGluZ1wiIGNoZWNrZWQ9XCJ0cnVlXCIgdHlwZT1cInJhZGlvXCIgbmFtZT1cImdyb3VwMVwiIHZhbHVlPVwiMVwiIG9uQ2hhbmdlPXt0aGlzLm9uU3RhckNsaWNrLmJpbmQodGhpcyl9Lz48aT48L2k+XG4gICAgICAgICAgPGlucHV0IGlkPVwic3Rhci1yYXRpbmdcIiB0eXBlPVwicmFkaW9cIiBuYW1lPVwiZ3JvdXAxXCIgdmFsdWU9XCIyXCIgb25DaGFuZ2U9e3RoaXMub25TdGFyQ2xpY2suYmluZCh0aGlzKX0vPjxpPjwvaT5cbiAgICAgICAgICA8aW5wdXQgaWQ9XCJzdGFyLXJhdGluZ1wiIHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJncm91cDFcIiB2YWx1ZT1cIjNcIiBvbkNoYW5nZT17dGhpcy5vblN0YXJDbGljay5iaW5kKHRoaXMpfS8+PGk+PC9pPlxuICAgICAgICAgIDxpbnB1dCBpZD1cInN0YXItcmF0aW5nXCIgdHlwZT1cInJhZGlvXCIgbmFtZT1cImdyb3VwMVwiIHZhbHVlPVwiNFwiIG9uQ2hhbmdlPXt0aGlzLm9uU3RhckNsaWNrLmJpbmQodGhpcyl9Lz48aT48L2k+XG4gICAgICAgICAgPGlucHV0IGlkPVwic3Rhci1yYXRpbmdcIiB0eXBlPVwicmFkaW9cIiBuYW1lPVwiZ3JvdXAxXCIgdmFsdWU9XCI1XCIgb25DaGFuZ2U9e3RoaXMub25TdGFyQ2xpY2suYmluZCh0aGlzKX0vPjxpPjwvaT5cbiAgICAgICAgPC9mb3JtPlxuICAgICAgICApXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnVzZXJSYXRpbmcgPT09IDIpIHtcbiAgICAgIHZhciBzdGFycyA9IChcbiAgICAgICAgPGZvcm0gY2xhc3NOYW1lPVwic3Rhci1yYXRpbmcgY29sLXNtLTEwXCI+XG4gICAgICAgICAgPGlucHV0IGlkPVwic3Rhci1yYXRpbmdcIiB0eXBlPVwicmFkaW9cIiBuYW1lPVwiZ3JvdXAxXCIgdmFsdWU9XCIxXCIgb25DaGFuZ2U9e3RoaXMub25TdGFyQ2xpY2suYmluZCh0aGlzKX0vPjxpPjwvaT5cbiAgICAgICAgICA8aW5wdXQgaWQ9XCJzdGFyLXJhdGluZ1wiIGNoZWNrZWQ9XCJ0cnVlXCIgdHlwZT1cInJhZGlvXCIgbmFtZT1cImdyb3VwMVwiIHZhbHVlPVwiMlwiIG9uQ2hhbmdlPXt0aGlzLm9uU3RhckNsaWNrLmJpbmQodGhpcyl9Lz48aT48L2k+XG4gICAgICAgICAgPGlucHV0IGlkPVwic3Rhci1yYXRpbmdcIiB0eXBlPVwicmFkaW9cIiBuYW1lPVwiZ3JvdXAxXCIgdmFsdWU9XCIzXCIgb25DaGFuZ2U9e3RoaXMub25TdGFyQ2xpY2suYmluZCh0aGlzKX0vPjxpPjwvaT5cbiAgICAgICAgICA8aW5wdXQgaWQ9XCJzdGFyLXJhdGluZ1wiIHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJncm91cDFcIiB2YWx1ZT1cIjRcIiBvbkNoYW5nZT17dGhpcy5vblN0YXJDbGljay5iaW5kKHRoaXMpfS8+PGk+PC9pPlxuICAgICAgICAgIDxpbnB1dCBpZD1cInN0YXItcmF0aW5nXCIgdHlwZT1cInJhZGlvXCIgbmFtZT1cImdyb3VwMVwiIHZhbHVlPVwiNVwiIG9uQ2hhbmdlPXt0aGlzLm9uU3RhckNsaWNrLmJpbmQodGhpcyl9Lz48aT48L2k+XG4gICAgICAgIDwvZm9ybT5cbiAgICAgICAgKVxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS51c2VyUmF0aW5nID09PSAzKSB7XG4gICAgICB2YXIgc3RhcnMgPSAoXG4gICAgICAgIDxmb3JtIGNsYXNzTmFtZT1cInN0YXItcmF0aW5nIGNvbC1zbS0xMFwiPlxuICAgICAgICAgIDxpbnB1dCBpZD1cInN0YXItcmF0aW5nXCIgdHlwZT1cInJhZGlvXCIgbmFtZT1cImdyb3VwMVwiIHZhbHVlPVwiMVwiIG9uQ2hhbmdlPXt0aGlzLm9uU3RhckNsaWNrLmJpbmQodGhpcyl9Lz48aT48L2k+XG4gICAgICAgICAgPGlucHV0IGlkPVwic3Rhci1yYXRpbmdcIiB0eXBlPVwicmFkaW9cIiBuYW1lPVwiZ3JvdXAxXCIgdmFsdWU9XCIyXCIgb25DaGFuZ2U9e3RoaXMub25TdGFyQ2xpY2suYmluZCh0aGlzKX0vPjxpPjwvaT5cbiAgICAgICAgICA8aW5wdXQgaWQ9XCJzdGFyLXJhdGluZ1wiIGNoZWNrZWQ9XCJ0cnVlXCIgdHlwZT1cInJhZGlvXCIgbmFtZT1cImdyb3VwMVwiIHZhbHVlPVwiM1wiIG9uQ2hhbmdlPXt0aGlzLm9uU3RhckNsaWNrLmJpbmQodGhpcyl9Lz48aT48L2k+XG4gICAgICAgICAgPGlucHV0IGlkPVwic3Rhci1yYXRpbmdcIiB0eXBlPVwicmFkaW9cIiBuYW1lPVwiZ3JvdXAxXCIgdmFsdWU9XCI0XCIgb25DaGFuZ2U9e3RoaXMub25TdGFyQ2xpY2suYmluZCh0aGlzKX0vPjxpPjwvaT5cbiAgICAgICAgICA8aW5wdXQgaWQ9XCJzdGFyLXJhdGluZ1wiIHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJncm91cDFcIiB2YWx1ZT1cIjVcIiBvbkNoYW5nZT17dGhpcy5vblN0YXJDbGljay5iaW5kKHRoaXMpfS8+PGk+PC9pPlxuICAgICAgICA8L2Zvcm0+XG4gICAgICAgIClcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudXNlclJhdGluZyA9PT0gNCkge1xuICAgICAgdmFyIHN0YXJzID0gKFxuICAgICAgICA8Zm9ybSBjbGFzc05hbWU9XCJzdGFyLXJhdGluZyBjb2wtc20tMTBcIj5cbiAgICAgICAgICA8aW5wdXQgaWQ9XCJzdGFyLXJhdGluZ1wiIHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJncm91cDFcIiB2YWx1ZT1cIjFcIiBvbkNoYW5nZT17dGhpcy5vblN0YXJDbGljay5iaW5kKHRoaXMpfS8+PGk+PC9pPlxuICAgICAgICAgIDxpbnB1dCBpZD1cInN0YXItcmF0aW5nXCIgdHlwZT1cInJhZGlvXCIgbmFtZT1cImdyb3VwMVwiIHZhbHVlPVwiMlwiIG9uQ2hhbmdlPXt0aGlzLm9uU3RhckNsaWNrLmJpbmQodGhpcyl9Lz48aT48L2k+XG4gICAgICAgICAgPGlucHV0IGlkPVwic3Rhci1yYXRpbmdcIiB0eXBlPVwicmFkaW9cIiBuYW1lPVwiZ3JvdXAxXCIgdmFsdWU9XCIzXCIgb25DaGFuZ2U9e3RoaXMub25TdGFyQ2xpY2suYmluZCh0aGlzKX0vPjxpPjwvaT5cbiAgICAgICAgICA8aW5wdXQgaWQ9XCJzdGFyLXJhdGluZ1wiIGNoZWNrZWQ9XCJ0cnVlXCIgdHlwZT1cInJhZGlvXCIgbmFtZT1cImdyb3VwMVwiIHZhbHVlPVwiNFwiIG9uQ2hhbmdlPXt0aGlzLm9uU3RhckNsaWNrLmJpbmQodGhpcyl9Lz48aT48L2k+XG4gICAgICAgICAgPGlucHV0IGlkPVwic3Rhci1yYXRpbmdcIiB0eXBlPVwicmFkaW9cIiBuYW1lPVwiZ3JvdXAxXCIgdmFsdWU9XCI1XCIgb25DaGFuZ2U9e3RoaXMub25TdGFyQ2xpY2suYmluZCh0aGlzKX0vPjxpPjwvaT5cbiAgICAgICAgPC9mb3JtPlxuICAgICAgICApXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnVzZXJSYXRpbmcgPT09IDUpIHtcbiAgICAgIHZhciBzdGFycyA9IChcbiAgICAgICAgPGZvcm0gY2xhc3NOYW1lPVwic3Rhci1yYXRpbmcgY29sLXNtLTEwXCI+XG4gICAgICAgICAgPGlucHV0IGlkPVwic3Rhci1yYXRpbmdcIiB0eXBlPVwicmFkaW9cIiBuYW1lPVwiZ3JvdXAxXCIgdmFsdWU9XCIxXCIgb25DaGFuZ2U9e3RoaXMub25TdGFyQ2xpY2suYmluZCh0aGlzKX0vPjxpPjwvaT5cbiAgICAgICAgICA8aW5wdXQgaWQ9XCJzdGFyLXJhdGluZ1wiIHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJncm91cDFcIiB2YWx1ZT1cIjJcIiBvbkNoYW5nZT17dGhpcy5vblN0YXJDbGljay5iaW5kKHRoaXMpfS8+PGk+PC9pPlxuICAgICAgICAgIDxpbnB1dCBpZD1cInN0YXItcmF0aW5nXCIgdHlwZT1cInJhZGlvXCIgbmFtZT1cImdyb3VwMVwiIHZhbHVlPVwiM1wiIG9uQ2hhbmdlPXt0aGlzLm9uU3RhckNsaWNrLmJpbmQodGhpcyl9Lz48aT48L2k+XG4gICAgICAgICAgPGlucHV0IGlkPVwic3Rhci1yYXRpbmdcIiB0eXBlPVwicmFkaW9cIiBuYW1lPVwiZ3JvdXAxXCIgdmFsdWU9XCI0XCIgb25DaGFuZ2U9e3RoaXMub25TdGFyQ2xpY2suYmluZCh0aGlzKX0vPjxpPjwvaT5cbiAgICAgICAgICA8aW5wdXQgaWQ9XCJzdGFyLXJhdGluZ1wiIGNoZWNrZWQ9XCJ0cnVlXCIgdHlwZT1cInJhZGlvXCIgbmFtZT1cImdyb3VwMVwiIHZhbHVlPVwiNVwiIG9uQ2hhbmdlPXt0aGlzLm9uU3RhckNsaWNrLmJpbmQodGhpcyl9Lz48aT48L2k+XG4gICAgICAgIDwvZm9ybT5cbiAgICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgc3RhcnMgPSAoXG4gICAgICAgIDxmb3JtIGNsYXNzTmFtZT1cInN0YXItcmF0aW5nIGNvbC1zbS0xMFwiPlxuICAgICAgICAgIDxpbnB1dCBpZD1cInN0YXItcmF0aW5nXCIgdHlwZT1cInJhZGlvXCIgbmFtZT1cImdyb3VwMVwiIHZhbHVlPVwiMVwiIG9uQ2hhbmdlPXt0aGlzLm9uU3RhckNsaWNrLmJpbmQodGhpcyl9Lz48aT48L2k+XG4gICAgICAgICAgPGlucHV0IGlkPVwic3Rhci1yYXRpbmdcIiB0eXBlPVwicmFkaW9cIiBuYW1lPVwiZ3JvdXAxXCIgdmFsdWU9XCIyXCIgb25DaGFuZ2U9e3RoaXMub25TdGFyQ2xpY2suYmluZCh0aGlzKX0vPjxpPjwvaT5cbiAgICAgICAgICA8aW5wdXQgaWQ9XCJzdGFyLXJhdGluZ1wiIHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJncm91cDFcIiB2YWx1ZT1cIjNcIiBvbkNoYW5nZT17dGhpcy5vblN0YXJDbGljay5iaW5kKHRoaXMpfS8+PGk+PC9pPlxuICAgICAgICAgIDxpbnB1dCBpZD1cInN0YXItcmF0aW5nXCIgdHlwZT1cInJhZGlvXCIgbmFtZT1cImdyb3VwMVwiIHZhbHVlPVwiNFwiIG9uQ2hhbmdlPXt0aGlzLm9uU3RhckNsaWNrLmJpbmQodGhpcyl9Lz48aT48L2k+XG4gICAgICAgICAgPGlucHV0IGlkPVwic3Rhci1yYXRpbmdcIiB0eXBlPVwicmFkaW9cIiBuYW1lPVwiZ3JvdXAxXCIgdmFsdWU9XCI1XCIgb25DaGFuZ2U9e3RoaXMub25TdGFyQ2xpY2suYmluZCh0aGlzKX0vPjxpPjwvaT5cbiAgICAgICAgPC9mb3JtPlxuICAgICAgICApXG4gICAgfVxuXHRcdHJldHVybiAoXG5cdFx0PGRpdiBjbGFzc05hbWU9XCJ1c2VyUmF0aW5nIGNvbCBzNFwiPlxuXHRcdFx0eyh0aGlzLnN0YXRlLnVzZXJSYXRpbmcgPT09IG51bGwpID8gPGRpdiBjbGFzc05hbWU9XCJub3RSYXRlZE1zZ1wiPnlvdSBoYXZlbid0IHJhdGVkIHRoaXMgbW92aWU8L2Rpdj4gOiA8ZGl2IGNsYXNzTmFtZT1cInlvdXJSYXRpbmdcIj55b3VyIHJhdGluZyBpcyA8Yj57dGhpcy5zdGF0ZS51c2VyUmF0aW5nfTwvYj48L2Rpdj59XG4gICAgICB7c3RhcnN9XG5cdFx0XHR7KHRoaXMuc3RhdGUucmF0aW5nVXBkYXRlZCkgPyA8ZGl2IGNsYXNzTmFtZT1cInVwZGF0ZU1zZ1wiPnJhdGluZyBoYXMgdXBkYXRlZDwvZGl2PiA6ICcnfVxuXHRcdDwvZGl2Pik7XG4gIH1cbn1cblxud2luZG93LlN0YXJSYXRpbmdDb21wb25lbnQgPSBTdGFyUmF0aW5nQ29tcG9uZW50OyJdfQ==
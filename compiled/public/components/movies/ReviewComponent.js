'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReviewComponent = function (_React$Component) {
  _inherits(ReviewComponent, _React$Component);

  function ReviewComponent(props) {
    _classCallCheck(this, ReviewComponent);

    var _this = _possibleConstructorReturn(this, (ReviewComponent.__proto__ || Object.getPrototypeOf(ReviewComponent)).call(this, props));

    _this.state = {
      userReview: _this.props.review,
      editMode: false,
      reviewSubmitted: false,
      currentInput: _this.props.review
    };
    return _this;
  }

  _createClass(ReviewComponent, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.setState({
        userReview: nextProps.review,
        editMode: false
      });
    }
  }, {
    key: 'handleEdit',
    value: function handleEdit() {
      this.setState({
        editMode: true,
        reviewSubmitted: false
      });
    }
  }, {
    key: 'closeEdit',
    value: function closeEdit() {
      this.setState({
        editMode: false,
        currentInput: this.state.userReview
      });
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit() {
      this.setState({
        editMode: false,
        userReview: this.state.currentInput
      });
      this.updateReview(this.state.currentInput);
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event) {
      this.setState({
        currentInput: event.target.value
      });
    }
  }, {
    key: 'updateReview',
    value: function updateReview(review) {
      var _this2 = this;

      var movieObj = {
        title: this.props.title,
        id: this.props.id,
        review: review
      };
      $.post(Url + '/ratemovie', movieObj).done(function (response) {
        console.log('movie rating updated');
        _this2.setState({
          reviewSubmitted: true
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.state.editMode) {
        return React.createElement(
          'div',
          { className: 'review' },
          'Enter your review, 255 characters maximum',
          React.createElement('textarea', { cols: '40', rows: '5', value: this.state.currentInput, onChange: this.handleChange.bind(this), maxlength: '255' }),
          React.createElement(
            'button',
            { onClick: this.handleSubmit.bind(this) },
            'submit review'
          ),
          React.createElement(
            'button',
            { onClick: this.closeEdit.bind(this) },
            'cancel'
          )
        );
      } else {
        return React.createElement(
          'div',
          { className: 'userReview' },
          React.createElement(
            'div',
            { className: 'review' },
            'your review:',
            React.createElement(
              'button',
              { className: 'editReviewButton', onClick: this.handleEdit.bind(this) },
              'edit review'
            )
          ),
          React.createElement(
            'div',
            { className: 'theReview' },
            this.state.userReview === '' || this.state.userReview === null ? 'You have not reviewed the movie yet' : this.state.userReview
          ),
          this.state.reviewSubmitted ? React.createElement(
            'div',
            { className: 'updateMsg' },
            'review submitted'
          ) : ''
        );
      }
    }
  }]);

  return ReviewComponent;
}(React.Component);

window.ReviewComponent = ReviewComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9SZXZpZXdDb21wb25lbnQuanMiXSwibmFtZXMiOlsiUmV2aWV3Q29tcG9uZW50IiwicHJvcHMiLCJzdGF0ZSIsInVzZXJSZXZpZXciLCJyZXZpZXciLCJlZGl0TW9kZSIsInJldmlld1N1Ym1pdHRlZCIsImN1cnJlbnRJbnB1dCIsIm5leHRQcm9wcyIsInNldFN0YXRlIiwidXBkYXRlUmV2aWV3IiwiZXZlbnQiLCJ0YXJnZXQiLCJ2YWx1ZSIsIm1vdmllT2JqIiwidGl0bGUiLCJpZCIsIiQiLCJwb3N0IiwiVXJsIiwiZG9uZSIsImNvbnNvbGUiLCJsb2ciLCJoYW5kbGVDaGFuZ2UiLCJiaW5kIiwiaGFuZGxlU3VibWl0IiwiY2xvc2VFZGl0IiwiaGFuZGxlRWRpdCIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU1BLGU7OztBQUVKLDJCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsa0lBQ1hBLEtBRFc7O0FBRWpCLFVBQUtDLEtBQUwsR0FBYTtBQUNYQyxrQkFBWSxNQUFLRixLQUFMLENBQVdHLE1BRFo7QUFFWEMsZ0JBQVUsS0FGQztBQUdYQyx1QkFBaUIsS0FITjtBQUlYQyxvQkFBYyxNQUFLTixLQUFMLENBQVdHO0FBSmQsS0FBYjtBQUZpQjtBQVFsQjs7Ozs4Q0FFeUJJLFMsRUFBVztBQUNuQyxXQUFLQyxRQUFMLENBQWM7QUFDWk4sb0JBQVlLLFVBQVVKLE1BRFY7QUFFWkMsa0JBQVU7QUFGRSxPQUFkO0FBSUQ7OztpQ0FFWTtBQUNYLFdBQUtJLFFBQUwsQ0FBYztBQUNaSixrQkFBVSxJQURFO0FBRVpDLHlCQUFpQjtBQUZMLE9BQWQ7QUFJRDs7O2dDQUVXO0FBQ1YsV0FBS0csUUFBTCxDQUFjO0FBQ1pKLGtCQUFVLEtBREU7QUFFWkUsc0JBQWMsS0FBS0wsS0FBTCxDQUFXQztBQUZiLE9BQWQ7QUFJRDs7O21DQUVjO0FBQ2IsV0FBS00sUUFBTCxDQUFjO0FBQ1pKLGtCQUFVLEtBREU7QUFFWkYsb0JBQVksS0FBS0QsS0FBTCxDQUFXSztBQUZYLE9BQWQ7QUFJQSxXQUFLRyxZQUFMLENBQWtCLEtBQUtSLEtBQUwsQ0FBV0ssWUFBN0I7QUFDRDs7O2lDQUVZSSxLLEVBQU87QUFDbEIsV0FBS0YsUUFBTCxDQUFjO0FBQ1pGLHNCQUFjSSxNQUFNQyxNQUFOLENBQWFDO0FBRGYsT0FBZDtBQUdEOzs7aUNBRVlULE0sRUFBUTtBQUFBOztBQUNuQixVQUFJVSxXQUFXO0FBQ2JDLGVBQU8sS0FBS2QsS0FBTCxDQUFXYyxLQURMO0FBRWJDLFlBQUksS0FBS2YsS0FBTCxDQUFXZSxFQUZGO0FBR2JaLGdCQUFRQTtBQUhLLE9BQWY7QUFLQWEsUUFBRUMsSUFBRixDQUFPQyxNQUFNLFlBQWIsRUFBMkJMLFFBQTNCLEVBQ0NNLElBREQsQ0FDTSxvQkFBWTtBQUNoQkMsZ0JBQVFDLEdBQVIsQ0FBWSxzQkFBWjtBQUNBLGVBQUtiLFFBQUwsQ0FBYztBQUNaSCwyQkFBaUI7QUFETCxTQUFkO0FBR0QsT0FORDtBQU9EOzs7NkJBRVE7QUFDUCxVQUFJLEtBQUtKLEtBQUwsQ0FBV0csUUFBZixFQUF5QjtBQUN6QixlQUNJO0FBQUE7QUFBQSxZQUFLLFdBQVUsUUFBZjtBQUFBO0FBRUcsNENBQVUsTUFBSyxJQUFmLEVBQW9CLE1BQUssR0FBekIsRUFBNkIsT0FBTyxLQUFLSCxLQUFMLENBQVdLLFlBQS9DLEVBQTZELFVBQVUsS0FBS2dCLFlBQUwsQ0FBa0JDLElBQWxCLENBQXVCLElBQXZCLENBQXZFLEVBQXFHLFdBQVUsS0FBL0csR0FGSDtBQUdHO0FBQUE7QUFBQSxjQUFRLFNBQVMsS0FBS0MsWUFBTCxDQUFrQkQsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FBakI7QUFBQTtBQUFBLFdBSEg7QUFJRztBQUFBO0FBQUEsY0FBUSxTQUFTLEtBQUtFLFNBQUwsQ0FBZUYsSUFBZixDQUFvQixJQUFwQixDQUFqQjtBQUFBO0FBQUE7QUFKSCxTQURKO0FBT0MsT0FSRCxNQVFPO0FBQ0wsZUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLFlBQWY7QUFDRTtBQUFBO0FBQUEsY0FBSyxXQUFVLFFBQWY7QUFBQTtBQUFvQztBQUFBO0FBQUEsZ0JBQVEsV0FBVSxrQkFBbEIsRUFBcUMsU0FBUyxLQUFLRyxVQUFMLENBQWdCSCxJQUFoQixDQUFxQixJQUFyQixDQUE5QztBQUFBO0FBQUE7QUFBcEMsV0FERjtBQUVFO0FBQUE7QUFBQSxjQUFLLFdBQVUsV0FBZjtBQUE2QixpQkFBS3RCLEtBQUwsQ0FBV0MsVUFBWCxLQUEwQixFQUExQixJQUFnQyxLQUFLRCxLQUFMLENBQVdDLFVBQVgsS0FBMEIsSUFBM0QsR0FBbUUscUNBQW5FLEdBQTJHLEtBQUtELEtBQUwsQ0FBV0M7QUFBbEosV0FGRjtBQUdJLGVBQUtELEtBQUwsQ0FBV0ksZUFBWixHQUErQjtBQUFBO0FBQUEsY0FBSyxXQUFVLFdBQWY7QUFBQTtBQUFBLFdBQS9CLEdBQW1GO0FBSHRGLFNBREY7QUFNRDtBQUNIOzs7O0VBL0U0QnNCLE1BQU1DLFM7O0FBa0ZwQ0MsT0FBTzlCLGVBQVAsR0FBeUJBLGVBQXpCIiwiZmlsZSI6IlJldmlld0NvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFJldmlld0NvbXBvbmVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHVzZXJSZXZpZXc6IHRoaXMucHJvcHMucmV2aWV3LFxuICAgICAgZWRpdE1vZGU6IGZhbHNlLFxuICAgICAgcmV2aWV3U3VibWl0dGVkOiBmYWxzZSxcbiAgICAgIGN1cnJlbnRJbnB1dDogdGhpcy5wcm9wcy5yZXZpZXdcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHVzZXJSZXZpZXc6IG5leHRQcm9wcy5yZXZpZXcsXG4gICAgICBlZGl0TW9kZTogZmFsc2VcbiAgICB9KTtcbiAgfVxuXG4gIGhhbmRsZUVkaXQoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBlZGl0TW9kZTogdHJ1ZSxcbiAgICAgIHJldmlld1N1Ym1pdHRlZDogZmFsc2VcbiAgICB9KTtcbiAgfVxuXG4gIGNsb3NlRWRpdCgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGVkaXRNb2RlOiBmYWxzZSxcbiAgICAgIGN1cnJlbnRJbnB1dDogdGhpcy5zdGF0ZS51c2VyUmV2aWV3XG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVTdWJtaXQoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBlZGl0TW9kZTogZmFsc2UsXG4gICAgICB1c2VyUmV2aWV3OiB0aGlzLnN0YXRlLmN1cnJlbnRJbnB1dFxuICAgIH0pO1xuICAgIHRoaXMudXBkYXRlUmV2aWV3KHRoaXMuc3RhdGUuY3VycmVudElucHV0KTtcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZShldmVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY3VycmVudElucHV0OiBldmVudC50YXJnZXQudmFsdWVcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZVJldmlldyhyZXZpZXcpIHtcbiAgICB2YXIgbW92aWVPYmogPSB7XG4gICAgICB0aXRsZTogdGhpcy5wcm9wcy50aXRsZSwgXG4gICAgICBpZDogdGhpcy5wcm9wcy5pZCxcbiAgICAgIHJldmlldzogcmV2aWV3XG4gICAgfTtcbiAgICAkLnBvc3QoVXJsICsgJy9yYXRlbW92aWUnLCBtb3ZpZU9iailcbiAgICAuZG9uZShyZXNwb25zZSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnbW92aWUgcmF0aW5nIHVwZGF0ZWQnKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICByZXZpZXdTdWJtaXR0ZWQ6IHRydWVcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5lZGl0TW9kZSkge1xuICBcdFx0cmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3Jldmlldyc+XG4gICAgICAgICAgRW50ZXIgeW91ciByZXZpZXcsIDI1NSBjaGFyYWN0ZXJzIG1heGltdW1cbiAgICAgICAgICAgPHRleHRhcmVhIGNvbHM9XCI0MFwiIHJvd3M9XCI1XCIgdmFsdWU9e3RoaXMuc3RhdGUuY3VycmVudElucHV0fSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKX0gbWF4bGVuZ3RoPVwiMjU1XCI+PC90ZXh0YXJlYT5cbiAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXt0aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpfT5zdWJtaXQgcmV2aWV3PC9idXR0b24+XG4gICAgICAgICAgIDxidXR0b24gb25DbGljaz17dGhpcy5jbG9zZUVkaXQuYmluZCh0aGlzKX0+Y2FuY2VsPC9idXR0b24+XG4gICAgICAgIDwvZGl2Pik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSd1c2VyUmV2aWV3Jz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncmV2aWV3Jz55b3VyIHJldmlldzo8YnV0dG9uIGNsYXNzTmFtZT0nZWRpdFJldmlld0J1dHRvbicgb25DbGljaz17dGhpcy5oYW5kbGVFZGl0LmJpbmQodGhpcyl9PmVkaXQgcmV2aWV3PC9idXR0b24+PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3RoZVJldmlldyc+eyh0aGlzLnN0YXRlLnVzZXJSZXZpZXcgPT09ICcnIHx8IHRoaXMuc3RhdGUudXNlclJldmlldyA9PT0gbnVsbCkgPyAnWW91IGhhdmUgbm90IHJldmlld2VkIHRoZSBtb3ZpZSB5ZXQnIDogdGhpcy5zdGF0ZS51c2VyUmV2aWV3fTwvZGl2PlxuICAgICAgICAgIHsodGhpcy5zdGF0ZS5yZXZpZXdTdWJtaXR0ZWQpID8gPGRpdiBjbGFzc05hbWU9XCJ1cGRhdGVNc2dcIj5yZXZpZXcgc3VibWl0dGVkPC9kaXY+IDogJyd9XG4gICAgICAgIDwvZGl2Pik7XG4gICAgfVxuXHR9XG59XG5cbndpbmRvdy5SZXZpZXdDb21wb25lbnQgPSBSZXZpZXdDb21wb25lbnQ7Il19
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9SZXZpZXdDb21wb25lbnQuanMiXSwibmFtZXMiOlsiUmV2aWV3Q29tcG9uZW50IiwicHJvcHMiLCJzdGF0ZSIsInVzZXJSZXZpZXciLCJyZXZpZXciLCJlZGl0TW9kZSIsInJldmlld1N1Ym1pdHRlZCIsImN1cnJlbnRJbnB1dCIsIm5leHRQcm9wcyIsInNldFN0YXRlIiwidXBkYXRlUmV2aWV3IiwiZXZlbnQiLCJ0YXJnZXQiLCJ2YWx1ZSIsIm1vdmllT2JqIiwidGl0bGUiLCJpZCIsIiQiLCJwb3N0IiwiVXJsIiwiZG9uZSIsImNvbnNvbGUiLCJsb2ciLCJoYW5kbGVDaGFuZ2UiLCJiaW5kIiwiaGFuZGxlU3VibWl0IiwiY2xvc2VFZGl0IiwiaGFuZGxlRWRpdCIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU1BLGU7OztBQUVKLDJCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsa0lBQ1hBLEtBRFc7O0FBRWpCLFVBQUtDLEtBQUwsR0FBYTtBQUNYQyxrQkFBWSxNQUFLRixLQUFMLENBQVdHLE1BRFo7QUFFWEMsZ0JBQVUsS0FGQztBQUdYQyx1QkFBaUIsS0FITjtBQUlYQyxvQkFBYyxNQUFLTixLQUFMLENBQVdHO0FBSmQsS0FBYjtBQUZpQjtBQVFsQjs7Ozs4Q0FFeUJJLFMsRUFBVztBQUNuQyxXQUFLQyxRQUFMLENBQWM7QUFDWk4sb0JBQVlLLFVBQVVKLE1BRFY7QUFFWkMsa0JBQVU7QUFGRSxPQUFkO0FBSUQ7OztpQ0FFWTtBQUNYLFdBQUtJLFFBQUwsQ0FBYztBQUNaSixrQkFBVSxJQURFO0FBRVpDLHlCQUFpQjtBQUZMLE9BQWQ7QUFJRDs7O2dDQUVXO0FBQ1YsV0FBS0csUUFBTCxDQUFjO0FBQ1pKLGtCQUFVLEtBREU7QUFFWkUsc0JBQWMsS0FBS0wsS0FBTCxDQUFXQztBQUZiLE9BQWQ7QUFJRDs7O21DQUVjO0FBQ2IsV0FBS00sUUFBTCxDQUFjO0FBQ1pKLGtCQUFVLEtBREU7QUFFWkYsb0JBQVksS0FBS0QsS0FBTCxDQUFXSztBQUZYLE9BQWQ7QUFJQSxXQUFLRyxZQUFMLENBQWtCLEtBQUtSLEtBQUwsQ0FBV0ssWUFBN0I7QUFDRDs7O2lDQUVZSSxLLEVBQU87QUFDbEIsV0FBS0YsUUFBTCxDQUFjO0FBQ1pGLHNCQUFjSSxNQUFNQyxNQUFOLENBQWFDO0FBRGYsT0FBZDtBQUdEOzs7aUNBRVlULE0sRUFBUTtBQUFBOztBQUNuQixVQUFJVSxXQUFXO0FBQ2JDLGVBQU8sS0FBS2QsS0FBTCxDQUFXYyxLQURMO0FBRWJDLFlBQUksS0FBS2YsS0FBTCxDQUFXZSxFQUZGO0FBR2JaLGdCQUFRQTtBQUhLLE9BQWY7QUFLQWEsUUFBRUMsSUFBRixDQUFPQyxNQUFNLFlBQWIsRUFBMkJMLFFBQTNCLEVBQ0NNLElBREQsQ0FDTSxvQkFBWTtBQUNoQkMsZ0JBQVFDLEdBQVIsQ0FBWSxzQkFBWjtBQUNBLGVBQUtiLFFBQUwsQ0FBYztBQUNaSCwyQkFBaUI7QUFETCxTQUFkO0FBR0QsT0FORDtBQU9EOzs7NkJBRVE7QUFDUCxVQUFJLEtBQUtKLEtBQUwsQ0FBV0csUUFBZixFQUF5QjtBQUN6QixlQUNJO0FBQUE7QUFBQSxZQUFLLFdBQVUsUUFBZjtBQUFBO0FBRUcsNENBQVUsTUFBSyxJQUFmLEVBQW9CLE1BQUssR0FBekIsRUFBNkIsT0FBTyxLQUFLSCxLQUFMLENBQVdLLFlBQS9DLEVBQTZELFVBQVUsS0FBS2dCLFlBQUwsQ0FBa0JDLElBQWxCLENBQXVCLElBQXZCLENBQXZFLEVBQXFHLFdBQVUsS0FBL0csR0FGSDtBQUdHO0FBQUE7QUFBQSxjQUFRLFNBQVMsS0FBS0MsWUFBTCxDQUFrQkQsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FBakI7QUFBQTtBQUFBLFdBSEg7QUFJRztBQUFBO0FBQUEsY0FBUSxTQUFTLEtBQUtFLFNBQUwsQ0FBZUYsSUFBZixDQUFvQixJQUFwQixDQUFqQjtBQUFBO0FBQUE7QUFKSCxTQURKO0FBT0MsT0FSRCxNQVFPO0FBQ0wsZUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLFlBQWY7QUFDRTtBQUFBO0FBQUEsY0FBSyxXQUFVLFFBQWY7QUFBQTtBQUFvQztBQUFBO0FBQUEsZ0JBQVEsV0FBVSxrQkFBbEIsRUFBcUMsU0FBUyxLQUFLRyxVQUFMLENBQWdCSCxJQUFoQixDQUFxQixJQUFyQixDQUE5QztBQUFBO0FBQUE7QUFBcEMsV0FERjtBQUVFO0FBQUE7QUFBQSxjQUFLLFdBQVUsV0FBZjtBQUE2QixpQkFBS3RCLEtBQUwsQ0FBV0MsVUFBWCxLQUEwQixFQUExQixJQUFnQyxLQUFLRCxLQUFMLENBQVdDLFVBQVgsS0FBMEIsSUFBM0QsR0FBbUUscUNBQW5FLEdBQTJHLEtBQUtELEtBQUwsQ0FBV0M7QUFBbEosV0FGRjtBQUdJLGVBQUtELEtBQUwsQ0FBV0ksZUFBWixHQUErQjtBQUFBO0FBQUEsY0FBSyxXQUFVLFdBQWY7QUFBQTtBQUFBLFdBQS9CLEdBQW1GO0FBSHRGLFNBREY7QUFNRDtBQUNIOzs7O0VBL0U0QnNCLE1BQU1DLFM7O0FBa0ZwQ0MsT0FBTzlCLGVBQVAsR0FBeUJBLGVBQXpCIiwiZmlsZSI6IlJldmlld0NvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFJldmlld0NvbXBvbmVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICB1c2VyUmV2aWV3OiB0aGlzLnByb3BzLnJldmlldyxcclxuICAgICAgZWRpdE1vZGU6IGZhbHNlLFxyXG4gICAgICByZXZpZXdTdWJtaXR0ZWQ6IGZhbHNlLFxyXG4gICAgICBjdXJyZW50SW5wdXQ6IHRoaXMucHJvcHMucmV2aWV3XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICB1c2VyUmV2aWV3OiBuZXh0UHJvcHMucmV2aWV3LFxyXG4gICAgICBlZGl0TW9kZTogZmFsc2VcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlRWRpdCgpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBlZGl0TW9kZTogdHJ1ZSxcclxuICAgICAgcmV2aWV3U3VibWl0dGVkOiBmYWxzZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBjbG9zZUVkaXQoKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgZWRpdE1vZGU6IGZhbHNlLFxyXG4gICAgICBjdXJyZW50SW5wdXQ6IHRoaXMuc3RhdGUudXNlclJldmlld1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVTdWJtaXQoKSB7XHJcbiAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgZWRpdE1vZGU6IGZhbHNlLFxyXG4gICAgICB1c2VyUmV2aWV3OiB0aGlzLnN0YXRlLmN1cnJlbnRJbnB1dFxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnVwZGF0ZVJldmlldyh0aGlzLnN0YXRlLmN1cnJlbnRJbnB1dCk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVDaGFuZ2UoZXZlbnQpIHtcclxuICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICBjdXJyZW50SW5wdXQ6IGV2ZW50LnRhcmdldC52YWx1ZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVSZXZpZXcocmV2aWV3KSB7XHJcbiAgICB2YXIgbW92aWVPYmogPSB7XHJcbiAgICAgIHRpdGxlOiB0aGlzLnByb3BzLnRpdGxlLCBcclxuICAgICAgaWQ6IHRoaXMucHJvcHMuaWQsXHJcbiAgICAgIHJldmlldzogcmV2aWV3XHJcbiAgICB9O1xyXG4gICAgJC5wb3N0KFVybCArICcvcmF0ZW1vdmllJywgbW92aWVPYmopXHJcbiAgICAuZG9uZShyZXNwb25zZSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdtb3ZpZSByYXRpbmcgdXBkYXRlZCcpO1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICByZXZpZXdTdWJtaXR0ZWQ6IHRydWVcclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgfVxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICBpZiAodGhpcy5zdGF0ZS5lZGl0TW9kZSkge1xyXG4gIFx0XHRyZXR1cm4gKFxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdyZXZpZXcnPlxyXG4gICAgICAgICAgRW50ZXIgeW91ciByZXZpZXcsIDI1NSBjaGFyYWN0ZXJzIG1heGltdW1cclxuICAgICAgICAgICA8dGV4dGFyZWEgY29scz1cIjQwXCIgcm93cz1cIjVcIiB2YWx1ZT17dGhpcy5zdGF0ZS5jdXJyZW50SW5wdXR9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfSBtYXhsZW5ndGg9XCIyNTVcIj48L3RleHRhcmVhPlxyXG4gICAgICAgICAgIDxidXR0b24gb25DbGljaz17dGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKX0+c3VibWl0IHJldmlldzwvYnV0dG9uPlxyXG4gICAgICAgICAgIDxidXR0b24gb25DbGljaz17dGhpcy5jbG9zZUVkaXQuYmluZCh0aGlzKX0+Y2FuY2VsPC9idXR0b24+XHJcbiAgICAgICAgPC9kaXY+KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3VzZXJSZXZpZXcnPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3Jldmlldyc+eW91ciByZXZpZXc6PGJ1dHRvbiBjbGFzc05hbWU9J2VkaXRSZXZpZXdCdXR0b24nIG9uQ2xpY2s9e3RoaXMuaGFuZGxlRWRpdC5iaW5kKHRoaXMpfT5lZGl0IHJldmlldzwvYnV0dG9uPjwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3RoZVJldmlldyc+eyh0aGlzLnN0YXRlLnVzZXJSZXZpZXcgPT09ICcnIHx8IHRoaXMuc3RhdGUudXNlclJldmlldyA9PT0gbnVsbCkgPyAnWW91IGhhdmUgbm90IHJldmlld2VkIHRoZSBtb3ZpZSB5ZXQnIDogdGhpcy5zdGF0ZS51c2VyUmV2aWV3fTwvZGl2PlxyXG4gICAgICAgICAgeyh0aGlzLnN0YXRlLnJldmlld1N1Ym1pdHRlZCkgPyA8ZGl2IGNsYXNzTmFtZT1cInVwZGF0ZU1zZ1wiPnJldmlldyBzdWJtaXR0ZWQ8L2Rpdj4gOiAnJ31cclxuICAgICAgICA8L2Rpdj4pO1xyXG4gICAgfVxyXG5cdH1cclxufVxyXG5cclxud2luZG93LlJldmlld0NvbXBvbmVudCA9IFJldmlld0NvbXBvbmVudDsiXX0=
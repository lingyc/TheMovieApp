'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReviewComponent = function (_React$Component) {
  _inherits(ReviewComponent, _React$Component);

  function ReviewComponent(props) {
    _classCallCheck(this, ReviewComponent);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ReviewComponent).call(this, props));

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9SZXZpZXdDb21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNLGU7OztBQUVKLDJCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxtR0FDWCxLQURXOztBQUVqQixVQUFLLEtBQUwsR0FBYTtBQUNYLGtCQUFZLE1BQUssS0FBTCxDQUFXLE1BRFo7QUFFWCxnQkFBVSxLQUZDO0FBR1gsdUJBQWlCLEtBSE47QUFJWCxvQkFBYyxNQUFLLEtBQUwsQ0FBVztBQUpkLEtBQWI7QUFGaUI7QUFRbEI7Ozs7OENBRXlCLFMsRUFBVztBQUNuQyxXQUFLLFFBQUwsQ0FBYztBQUNaLG9CQUFZLFVBQVUsTUFEVjtBQUVaLGtCQUFVO0FBRkUsT0FBZDtBQUlEOzs7aUNBRVk7QUFDWCxXQUFLLFFBQUwsQ0FBYztBQUNaLGtCQUFVLElBREU7QUFFWix5QkFBaUI7QUFGTCxPQUFkO0FBSUQ7OztnQ0FFVztBQUNWLFdBQUssUUFBTCxDQUFjO0FBQ1osa0JBQVUsS0FERTtBQUVaLHNCQUFjLEtBQUssS0FBTCxDQUFXO0FBRmIsT0FBZDtBQUlEOzs7bUNBRWM7QUFDYixXQUFLLFFBQUwsQ0FBYztBQUNaLGtCQUFVLEtBREU7QUFFWixvQkFBWSxLQUFLLEtBQUwsQ0FBVztBQUZYLE9BQWQ7QUFJQSxXQUFLLFlBQUwsQ0FBa0IsS0FBSyxLQUFMLENBQVcsWUFBN0I7QUFDRDs7O2lDQUVZLEssRUFBTztBQUNsQixXQUFLLFFBQUwsQ0FBYztBQUNaLHNCQUFjLE1BQU0sTUFBTixDQUFhO0FBRGYsT0FBZDtBQUdEOzs7aUNBRVksTSxFQUFRO0FBQUE7O0FBQ25CLFVBQUksV0FBVztBQUNiLGVBQU8sS0FBSyxLQUFMLENBQVcsS0FETDtBQUViLFlBQUksS0FBSyxLQUFMLENBQVcsRUFGRjtBQUdiLGdCQUFRO0FBSEssT0FBZjtBQUtBLFFBQUUsSUFBRixDQUFPLE1BQU0sWUFBYixFQUEyQixRQUEzQixFQUNDLElBREQsQ0FDTSxvQkFBWTtBQUNoQixnQkFBUSxHQUFSLENBQVksc0JBQVo7QUFDQSxlQUFLLFFBQUwsQ0FBYztBQUNaLDJCQUFpQjtBQURMLFNBQWQ7QUFHRCxPQU5EO0FBT0Q7Ozs2QkFFUTtBQUNQLFVBQUksS0FBSyxLQUFMLENBQVcsUUFBZixFQUF5QjtBQUN6QixlQUNJO0FBQUE7QUFBQSxZQUFLLFdBQVUsUUFBZjtBQUFBO0FBRUcsNENBQVUsTUFBSyxJQUFmLEVBQW9CLE1BQUssR0FBekIsRUFBNkIsT0FBTyxLQUFLLEtBQUwsQ0FBVyxZQUEvQyxFQUE2RCxVQUFVLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixJQUF2QixDQUF2RSxFQUFxRyxXQUFVLEtBQS9HLEdBRkg7QUFHRztBQUFBO0FBQUEsY0FBUSxTQUFTLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixJQUF2QixDQUFqQjtBQUFBO0FBQUEsV0FISDtBQUlHO0FBQUE7QUFBQSxjQUFRLFNBQVMsS0FBSyxTQUFMLENBQWUsSUFBZixDQUFvQixJQUFwQixDQUFqQjtBQUFBO0FBQUE7QUFKSCxTQURKO0FBT0MsT0FSRCxNQVFPO0FBQ0wsZUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLFlBQWY7QUFDRTtBQUFBO0FBQUEsY0FBSyxXQUFVLFFBQWY7QUFBQTtBQUFvQztBQUFBO0FBQUEsZ0JBQVEsV0FBVSxrQkFBbEIsRUFBcUMsU0FBUyxLQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsSUFBckIsQ0FBOUM7QUFBQTtBQUFBO0FBQXBDLFdBREY7QUFFRTtBQUFBO0FBQUEsY0FBSyxXQUFVLFdBQWY7QUFBNkIsaUJBQUssS0FBTCxDQUFXLFVBQVgsS0FBMEIsRUFBMUIsSUFBZ0MsS0FBSyxLQUFMLENBQVcsVUFBWCxLQUEwQixJQUEzRCxHQUFtRSxxQ0FBbkUsR0FBMkcsS0FBSyxLQUFMLENBQVc7QUFBbEosV0FGRjtBQUdJLGVBQUssS0FBTCxDQUFXLGVBQVosR0FBK0I7QUFBQTtBQUFBLGNBQUssV0FBVSxXQUFmO0FBQUE7QUFBQSxXQUEvQixHQUFtRjtBQUh0RixTQURGO0FBTUQ7QUFDSDs7OztFQS9FNEIsTUFBTSxTOztBQWtGcEMsT0FBTyxlQUFQLEdBQXlCLGVBQXpCIiwiZmlsZSI6IlJldmlld0NvbXBvbmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFJldmlld0NvbXBvbmVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHVzZXJSZXZpZXc6IHRoaXMucHJvcHMucmV2aWV3LFxuICAgICAgZWRpdE1vZGU6IGZhbHNlLFxuICAgICAgcmV2aWV3U3VibWl0dGVkOiBmYWxzZSxcbiAgICAgIGN1cnJlbnRJbnB1dDogdGhpcy5wcm9wcy5yZXZpZXdcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHVzZXJSZXZpZXc6IG5leHRQcm9wcy5yZXZpZXcsXG4gICAgICBlZGl0TW9kZTogZmFsc2VcbiAgICB9KTtcbiAgfVxuXG4gIGhhbmRsZUVkaXQoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBlZGl0TW9kZTogdHJ1ZSxcbiAgICAgIHJldmlld1N1Ym1pdHRlZDogZmFsc2VcbiAgICB9KTtcbiAgfVxuXG4gIGNsb3NlRWRpdCgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGVkaXRNb2RlOiBmYWxzZSxcbiAgICAgIGN1cnJlbnRJbnB1dDogdGhpcy5zdGF0ZS51c2VyUmV2aWV3XG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVTdWJtaXQoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBlZGl0TW9kZTogZmFsc2UsXG4gICAgICB1c2VyUmV2aWV3OiB0aGlzLnN0YXRlLmN1cnJlbnRJbnB1dFxuICAgIH0pO1xuICAgIHRoaXMudXBkYXRlUmV2aWV3KHRoaXMuc3RhdGUuY3VycmVudElucHV0KTtcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZShldmVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgY3VycmVudElucHV0OiBldmVudC50YXJnZXQudmFsdWVcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZVJldmlldyhyZXZpZXcpIHtcbiAgICB2YXIgbW92aWVPYmogPSB7XG4gICAgICB0aXRsZTogdGhpcy5wcm9wcy50aXRsZSwgXG4gICAgICBpZDogdGhpcy5wcm9wcy5pZCxcbiAgICAgIHJldmlldzogcmV2aWV3XG4gICAgfTtcbiAgICAkLnBvc3QoVXJsICsgJy9yYXRlbW92aWUnLCBtb3ZpZU9iailcbiAgICAuZG9uZShyZXNwb25zZSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnbW92aWUgcmF0aW5nIHVwZGF0ZWQnKTtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICByZXZpZXdTdWJtaXR0ZWQ6IHRydWVcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5lZGl0TW9kZSkge1xuICBcdFx0cmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3Jldmlldyc+XG4gICAgICAgICAgRW50ZXIgeW91ciByZXZpZXcsIDI1NSBjaGFyYWN0ZXJzIG1heGltdW1cbiAgICAgICAgICAgPHRleHRhcmVhIGNvbHM9XCI0MFwiIHJvd3M9XCI1XCIgdmFsdWU9e3RoaXMuc3RhdGUuY3VycmVudElucHV0fSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKX0gbWF4bGVuZ3RoPVwiMjU1XCI+PC90ZXh0YXJlYT5cbiAgICAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXt0aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpfT5zdWJtaXQgcmV2aWV3PC9idXR0b24+XG4gICAgICAgICAgIDxidXR0b24gb25DbGljaz17dGhpcy5jbG9zZUVkaXQuYmluZCh0aGlzKX0+Y2FuY2VsPC9idXR0b24+XG4gICAgICAgIDwvZGl2Pik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSd1c2VyUmV2aWV3Jz5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncmV2aWV3Jz55b3VyIHJldmlldzo8YnV0dG9uIGNsYXNzTmFtZT0nZWRpdFJldmlld0J1dHRvbicgb25DbGljaz17dGhpcy5oYW5kbGVFZGl0LmJpbmQodGhpcyl9PmVkaXQgcmV2aWV3PC9idXR0b24+PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3RoZVJldmlldyc+eyh0aGlzLnN0YXRlLnVzZXJSZXZpZXcgPT09ICcnIHx8IHRoaXMuc3RhdGUudXNlclJldmlldyA9PT0gbnVsbCkgPyAnWW91IGhhdmUgbm90IHJldmlld2VkIHRoZSBtb3ZpZSB5ZXQnIDogdGhpcy5zdGF0ZS51c2VyUmV2aWV3fTwvZGl2PlxuICAgICAgICAgIHsodGhpcy5zdGF0ZS5yZXZpZXdTdWJtaXR0ZWQpID8gPGRpdiBjbGFzc05hbWU9XCJ1cGRhdGVNc2dcIj5yZXZpZXcgc3VibWl0dGVkPC9kaXY+IDogJyd9XG4gICAgICAgIDwvZGl2Pik7XG4gICAgfVxuXHR9XG59XG5cbndpbmRvdy5SZXZpZXdDb21wb25lbnQgPSBSZXZpZXdDb21wb25lbnQ7Il19
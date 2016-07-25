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
            this.state.userReview === '' ? 'You have not reviewed the movie yet' : this.state.userReview
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9SZXZpZXdDb21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNLGU7OztBQUVKLDJCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxtR0FDWCxLQURXOztBQUVqQixVQUFLLEtBQUwsR0FBYTtBQUNYLGtCQUFZLE1BQUssS0FBTCxDQUFXLE1BRFo7QUFFWCxnQkFBVSxLQUZDO0FBR1gsdUJBQWlCLEtBSE47QUFJWCxvQkFBYyxNQUFLLEtBQUwsQ0FBVztBQUpkLEtBQWI7QUFGaUI7QUFRbEI7Ozs7OENBRXlCLFMsRUFBVztBQUNuQyxXQUFLLFFBQUwsQ0FBYztBQUNaLG9CQUFZLFVBQVUsTUFEVjtBQUVaLGtCQUFVO0FBRkUsT0FBZDtBQUlEOzs7aUNBRVk7QUFDWCxXQUFLLFFBQUwsQ0FBYztBQUNaLGtCQUFVLElBREU7QUFFWix5QkFBaUI7QUFGTCxPQUFkO0FBSUQ7OztnQ0FFVztBQUNWLFdBQUssUUFBTCxDQUFjO0FBQ1osa0JBQVUsS0FERTtBQUVaLHNCQUFjLEtBQUssS0FBTCxDQUFXO0FBRmIsT0FBZDtBQUlEOzs7bUNBRWM7QUFDYixXQUFLLFFBQUwsQ0FBYztBQUNaLGtCQUFVLEtBREU7QUFFWixvQkFBWSxLQUFLLEtBQUwsQ0FBVztBQUZYLE9BQWQ7QUFJQSxXQUFLLFlBQUwsQ0FBa0IsS0FBSyxLQUFMLENBQVcsWUFBN0I7QUFDRDs7O2lDQUVZLEssRUFBTztBQUNsQixXQUFLLFFBQUwsQ0FBYztBQUNaLHNCQUFjLE1BQU0sTUFBTixDQUFhO0FBRGYsT0FBZDtBQUdEOzs7aUNBRVksTSxFQUFRO0FBQUE7O0FBQ25CLFVBQUksV0FBVztBQUNiLGVBQU8sS0FBSyxLQUFMLENBQVcsS0FETDtBQUViLFlBQUksS0FBSyxLQUFMLENBQVcsRUFGRjtBQUdiLGdCQUFRO0FBSEssT0FBZjtBQUtBLFFBQUUsSUFBRixDQUFPLE1BQU0sWUFBYixFQUEyQixRQUEzQixFQUNDLElBREQsQ0FDTSxvQkFBWTtBQUNoQixnQkFBUSxHQUFSLENBQVksc0JBQVo7QUFDQSxlQUFLLFFBQUwsQ0FBYztBQUNaLDJCQUFpQjtBQURMLFNBQWQ7QUFHRCxPQU5EO0FBT0Q7Ozs2QkFFUTtBQUNQLFVBQUksS0FBSyxLQUFMLENBQVcsUUFBZixFQUF5QjtBQUN6QixlQUNJO0FBQUE7QUFBQSxZQUFLLFdBQVUsUUFBZjtBQUFBO0FBRUcsNENBQVUsTUFBSyxJQUFmLEVBQW9CLE1BQUssR0FBekIsRUFBNkIsT0FBTyxLQUFLLEtBQUwsQ0FBVyxZQUEvQyxFQUE2RCxVQUFVLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixJQUF2QixDQUF2RSxFQUFxRyxXQUFVLEtBQS9HLEdBRkg7QUFHRztBQUFBO0FBQUEsY0FBUSxTQUFTLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixJQUF2QixDQUFqQjtBQUFBO0FBQUEsV0FISDtBQUlHO0FBQUE7QUFBQSxjQUFRLFNBQVMsS0FBSyxTQUFMLENBQWUsSUFBZixDQUFvQixJQUFwQixDQUFqQjtBQUFBO0FBQUE7QUFKSCxTQURKO0FBT0MsT0FSRCxNQVFPO0FBQ0wsZUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLFlBQWY7QUFDRTtBQUFBO0FBQUEsY0FBSyxXQUFVLFFBQWY7QUFBQTtBQUFvQztBQUFBO0FBQUEsZ0JBQVEsV0FBVSxrQkFBbEIsRUFBcUMsU0FBUyxLQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsSUFBckIsQ0FBOUM7QUFBQTtBQUFBO0FBQXBDLFdBREY7QUFFRTtBQUFBO0FBQUEsY0FBSyxXQUFVLFdBQWY7QUFBNkIsaUJBQUssS0FBTCxDQUFXLFVBQVgsS0FBMEIsRUFBM0IsR0FBaUMscUNBQWpDLEdBQXlFLEtBQUssS0FBTCxDQUFXO0FBQWhILFdBRkY7QUFHSSxlQUFLLEtBQUwsQ0FBVyxlQUFaLEdBQStCO0FBQUE7QUFBQSxjQUFLLFdBQVUsV0FBZjtBQUFBO0FBQUEsV0FBL0IsR0FBbUY7QUFIdEYsU0FERjtBQU1EO0FBQ0g7Ozs7RUEvRTRCLE1BQU0sUzs7QUFrRnBDLE9BQU8sZUFBUCxHQUF5QixlQUF6QiIsImZpbGUiOiJSZXZpZXdDb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBSZXZpZXdDb21wb25lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICB1c2VyUmV2aWV3OiB0aGlzLnByb3BzLnJldmlldyxcbiAgICAgIGVkaXRNb2RlOiBmYWxzZSxcbiAgICAgIHJldmlld1N1Ym1pdHRlZDogZmFsc2UsXG4gICAgICBjdXJyZW50SW5wdXQ6IHRoaXMucHJvcHMucmV2aWV3XG4gICAgfTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB1c2VyUmV2aWV3OiBuZXh0UHJvcHMucmV2aWV3LFxuICAgICAgZWRpdE1vZGU6IGZhbHNlXG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVFZGl0KCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZWRpdE1vZGU6IHRydWUsXG4gICAgICByZXZpZXdTdWJtaXR0ZWQ6IGZhbHNlXG4gICAgfSk7XG4gIH1cblxuICBjbG9zZUVkaXQoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBlZGl0TW9kZTogZmFsc2UsXG4gICAgICBjdXJyZW50SW5wdXQ6IHRoaXMuc3RhdGUudXNlclJldmlld1xuICAgIH0pO1xuICB9XG5cbiAgaGFuZGxlU3VibWl0KCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZWRpdE1vZGU6IGZhbHNlLFxuICAgICAgdXNlclJldmlldzogdGhpcy5zdGF0ZS5jdXJyZW50SW5wdXRcbiAgICB9KTtcbiAgICB0aGlzLnVwZGF0ZVJldmlldyh0aGlzLnN0YXRlLmN1cnJlbnRJbnB1dCk7XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UoZXZlbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGN1cnJlbnRJbnB1dDogZXZlbnQudGFyZ2V0LnZhbHVlXG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVSZXZpZXcocmV2aWV3KSB7XG4gICAgdmFyIG1vdmllT2JqID0ge1xuICAgICAgdGl0bGU6IHRoaXMucHJvcHMudGl0bGUsIFxuICAgICAgaWQ6IHRoaXMucHJvcHMuaWQsXG4gICAgICByZXZpZXc6IHJldmlld1xuICAgIH07XG4gICAgJC5wb3N0KFVybCArICcvcmF0ZW1vdmllJywgbW92aWVPYmopXG4gICAgLmRvbmUocmVzcG9uc2UgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ21vdmllIHJhdGluZyB1cGRhdGVkJyk7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgcmV2aWV3U3VibWl0dGVkOiB0cnVlXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuZWRpdE1vZGUpIHtcbiAgXHRcdHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdyZXZpZXcnPlxuICAgICAgICAgIEVudGVyIHlvdXIgcmV2aWV3LCAyNTUgY2hhcmFjdGVycyBtYXhpbXVtXG4gICAgICAgICAgIDx0ZXh0YXJlYSBjb2xzPVwiNDBcIiByb3dzPVwiNVwiIHZhbHVlPXt0aGlzLnN0YXRlLmN1cnJlbnRJbnB1dH0gb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyl9IG1heGxlbmd0aD1cIjI1NVwiPjwvdGV4dGFyZWE+XG4gICAgICAgICAgIDxidXR0b24gb25DbGljaz17dGhpcy5oYW5kbGVTdWJtaXQuYmluZCh0aGlzKX0+c3VibWl0IHJldmlldzwvYnV0dG9uPlxuICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3RoaXMuY2xvc2VFZGl0LmJpbmQodGhpcyl9PmNhbmNlbDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj4pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ndXNlclJldmlldyc+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3Jldmlldyc+eW91ciByZXZpZXc6PGJ1dHRvbiBjbGFzc05hbWU9J2VkaXRSZXZpZXdCdXR0b24nIG9uQ2xpY2s9e3RoaXMuaGFuZGxlRWRpdC5iaW5kKHRoaXMpfT5lZGl0IHJldmlldzwvYnV0dG9uPjwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSd0aGVSZXZpZXcnPnsodGhpcy5zdGF0ZS51c2VyUmV2aWV3ID09PSAnJykgPyAnWW91IGhhdmUgbm90IHJldmlld2VkIHRoZSBtb3ZpZSB5ZXQnIDogdGhpcy5zdGF0ZS51c2VyUmV2aWV3fTwvZGl2PlxuICAgICAgICAgIHsodGhpcy5zdGF0ZS5yZXZpZXdTdWJtaXR0ZWQpID8gPGRpdiBjbGFzc05hbWU9XCJ1cGRhdGVNc2dcIj5yZXZpZXcgc3VibWl0dGVkPC9kaXY+IDogJyd9XG4gICAgICAgIDwvZGl2Pik7XG4gICAgfVxuXHR9XG59XG5cbndpbmRvdy5SZXZpZXdDb21wb25lbnQgPSBSZXZpZXdDb21wb25lbnQ7Il19
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
      editMode: false
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
    value: function handleEdit(event) {
      this.setState({ editMode: true });
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(event) {
      event.preventDefault();
      this.setState({
        editMode: false
      });
      this.updateReview(this.state.userReview);
    }
  }, {
    key: 'handleChange',
    value: function handleChange(event) {
      this.setState({
        userReview: event.target.value
      });
    }
  }, {
    key: 'updateReview',
    value: function updateReview(review) {
      var movieObj = {
        title: this.props.title,
        id: this.props.id,
        review: review
      };
      $.post('http://127.0.0.1:3000/ratemovie', movieObj).done(function (response) {
        console.log('movie rating updated');
      });
    }
  }, {
    key: 'render',
    value: function render() {
      if (this.state.editMode) {
        return React.createElement(
          'div',
          { className: 'userReviewInput' },
          'Enter your review, 255 characters maximum',
          React.createElement(
            'form',
            { onSubmit: this.handleSubmit.bind(this) },
            React.createElement('input', { type: 'text', value: this.state.userReview, onChange: this.handleChange.bind(this), maxlength: '255' }),
            React.createElement('input', { type: 'submit', value: 'submit review' })
          )
        );
      } else {
        return React.createElement(
          'div',
          { className: 'userReview' },
          'your review: ',
          this.state.userReview === '' ? 'you have not review the movie yet' : this.state.userReview,
          React.createElement(
            'button',
            { className: 'editReviewButton', onClick: this.handleEdit.bind(this) },
            'edit review'
          )
        );
      }
    }
  }]);

  return ReviewComponent;
}(React.Component);

window.ReviewComponent = ReviewComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9SZXZpZXdDb21wb25lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNLGU7OztBQUVKLDJCQUFZLEtBQVosRUFBbUI7QUFBQTs7QUFBQSxtR0FDWCxLQURXOztBQUVqQixVQUFLLEtBQUwsR0FBYTtBQUNYLGtCQUFZLE1BQUssS0FBTCxDQUFXLE1BRFo7QUFFWCxnQkFBVTtBQUZDLEtBQWI7QUFGaUI7QUFNbEI7Ozs7OENBRXlCLFMsRUFBVztBQUNuQyxXQUFLLFFBQUwsQ0FBYztBQUNaLG9CQUFZLFVBQVUsTUFEVjtBQUVaLGtCQUFVO0FBRkUsT0FBZDtBQUlEOzs7K0JBRVUsSyxFQUFPO0FBQ2hCLFdBQUssUUFBTCxDQUFjLEVBQUMsVUFBVSxJQUFYLEVBQWQ7QUFDRDs7O2lDQUVZLEssRUFBTztBQUNsQixZQUFNLGNBQU47QUFDQSxXQUFLLFFBQUwsQ0FBYztBQUNaLGtCQUFVO0FBREUsT0FBZDtBQUdBLFdBQUssWUFBTCxDQUFrQixLQUFLLEtBQUwsQ0FBVyxVQUE3QjtBQUNEOzs7aUNBRVksSyxFQUFPO0FBQ2xCLFdBQUssUUFBTCxDQUFjO0FBQ1osb0JBQVksTUFBTSxNQUFOLENBQWE7QUFEYixPQUFkO0FBR0Q7OztpQ0FFWSxNLEVBQVE7QUFDbkIsVUFBSSxXQUFXO0FBQ2IsZUFBTyxLQUFLLEtBQUwsQ0FBVyxLQURMO0FBRWIsWUFBSSxLQUFLLEtBQUwsQ0FBVyxFQUZGO0FBR2IsZ0JBQVE7QUFISyxPQUFmO0FBS0EsUUFBRSxJQUFGLENBQU8saUNBQVAsRUFBMEMsUUFBMUMsRUFDQyxJQURELENBQ00sb0JBQVk7QUFDaEIsZ0JBQVEsR0FBUixDQUFZLHNCQUFaO0FBQ0QsT0FIRDtBQUlEOzs7NkJBRVE7QUFDUCxVQUFJLEtBQUssS0FBTCxDQUFXLFFBQWYsRUFBeUI7QUFDekIsZUFDSTtBQUFBO0FBQUEsWUFBSyxXQUFVLGlCQUFmO0FBQUE7QUFFRTtBQUFBO0FBQUEsY0FBTSxVQUFVLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixJQUF2QixDQUFoQjtBQUNBLDJDQUFPLE1BQUssTUFBWixFQUFtQixPQUFPLEtBQUssS0FBTCxDQUFXLFVBQXJDLEVBQWlELFVBQVUsS0FBSyxZQUFMLENBQWtCLElBQWxCLENBQXVCLElBQXZCLENBQTNELEVBQXlGLFdBQVUsS0FBbkcsR0FEQTtBQUVDLDJDQUFPLE1BQUssUUFBWixFQUFxQixPQUFNLGVBQTNCO0FBRkQ7QUFGRixTQURKO0FBUUMsT0FURCxNQVNPO0FBQ0wsZUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLFlBQWY7QUFBQTtBQUNpQixlQUFLLEtBQUwsQ0FBVyxVQUFYLEtBQTBCLEVBQTNCLEdBQWlDLG1DQUFqQyxHQUF1RSxLQUFLLEtBQUwsQ0FBVyxVQURsRztBQUVFO0FBQUE7QUFBQSxjQUFRLFdBQVUsa0JBQWxCLEVBQXFDLFNBQVMsS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLElBQXJCLENBQTlDO0FBQUE7QUFBQTtBQUZGLFNBREY7QUFLRDtBQUNIOzs7O0VBaEU0QixNQUFNLFM7O0FBbUVwQyxPQUFPLGVBQVAsR0FBeUIsZUFBekIiLCJmaWxlIjoiUmV2aWV3Q29tcG9uZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgUmV2aWV3Q29tcG9uZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgdXNlclJldmlldzogdGhpcy5wcm9wcy5yZXZpZXcsXG4gICAgICBlZGl0TW9kZTogZmFsc2VcbiAgICB9O1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHVzZXJSZXZpZXc6IG5leHRQcm9wcy5yZXZpZXcsXG4gICAgICBlZGl0TW9kZTogZmFsc2VcbiAgICB9KTtcbiAgfVxuXG4gIGhhbmRsZUVkaXQoZXZlbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtlZGl0TW9kZTogdHJ1ZX0pO1xuICB9XG5cbiAgaGFuZGxlU3VibWl0KGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGVkaXRNb2RlOiBmYWxzZSxcbiAgICB9KTtcbiAgICB0aGlzLnVwZGF0ZVJldmlldyh0aGlzLnN0YXRlLnVzZXJSZXZpZXcpO1xuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB1c2VyUmV2aWV3OiBldmVudC50YXJnZXQudmFsdWVcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZVJldmlldyhyZXZpZXcpIHtcbiAgICB2YXIgbW92aWVPYmogPSB7XG4gICAgICB0aXRsZTogdGhpcy5wcm9wcy50aXRsZSwgXG4gICAgICBpZDogdGhpcy5wcm9wcy5pZCxcbiAgICAgIHJldmlldzogcmV2aWV3XG4gICAgfTtcbiAgICAkLnBvc3QoJ2h0dHA6Ly8xMjcuMC4wLjE6MzAwMC9yYXRlbW92aWUnLCBtb3ZpZU9iailcbiAgICAuZG9uZShyZXNwb25zZSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnbW92aWUgcmF0aW5nIHVwZGF0ZWQnKTtcbiAgICB9KVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmVkaXRNb2RlKSB7XG4gIFx0XHRyZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ndXNlclJldmlld0lucHV0Jz5cbiAgICAgICAgICBFbnRlciB5b3VyIHJldmlldywgMjU1IGNoYXJhY3RlcnMgbWF4aW11bVxuICAgICAgICAgIDxmb3JtIG9uU3VibWl0PXt0aGlzLmhhbmRsZVN1Ym1pdC5iaW5kKHRoaXMpfT5cbiAgICBcdCAgICAgPGlucHV0IHR5cGU9J3RleHQnIHZhbHVlPXt0aGlzLnN0YXRlLnVzZXJSZXZpZXd9IG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfSBtYXhsZW5ndGg9XCIyNTVcIi8+XG4gICAgICAgICAgIDxpbnB1dCB0eXBlPSdzdWJtaXQnIHZhbHVlPSdzdWJtaXQgcmV2aWV3Jy8+XG4gICAgICAgICAgPC9mb3JtPlxuICAgICAgICA8L2Rpdj4pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ndXNlclJldmlldyc+XG4gICAgICAgICAgeW91ciByZXZpZXc6IHsodGhpcy5zdGF0ZS51c2VyUmV2aWV3ID09PSAnJykgPyAneW91IGhhdmUgbm90IHJldmlldyB0aGUgbW92aWUgeWV0JyA6IHRoaXMuc3RhdGUudXNlclJldmlld31cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT0nZWRpdFJldmlld0J1dHRvbicgb25DbGljaz17dGhpcy5oYW5kbGVFZGl0LmJpbmQodGhpcyl9PmVkaXQgcmV2aWV3PC9idXR0b24+XG4gICAgICAgIDwvZGl2Pik7XG4gICAgfVxuXHR9XG59XG5cbndpbmRvdy5SZXZpZXdDb21wb25lbnQgPSBSZXZpZXdDb21wb25lbnQ7Il19
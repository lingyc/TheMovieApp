'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LogIn = function (_React$Component) {
  _inherits(LogIn, _React$Component);

  function LogIn(props) {
    _classCallCheck(this, LogIn);

    var _this = _possibleConstructorReturn(this, (LogIn.__proto__ || Object.getPrototypeOf(LogIn)).call(this, props));

    _this.state = {
      username: '',
      password: '',
      errorMsg: ''
    };
    return _this;
  }

  _createClass(LogIn, [{
    key: 'handleChange',
    value: function handleChange(event) {
      if (event.target.name === 'LogInName') {
        this.setState({
          username: event.target.value
        });
      } else {
        this.setState({
          password: event.target.value
        });
      }
    }
  }, {
    key: 'handleLogIn',
    value: function handleLogIn() {
      var _this2 = this;

      if (!this.state.username.length && !this.state.password.length) {
        this.setState({
          errorMsg: 'login is empty'
        });
      } else if (!this.state.username.length) {
        this.setState({
          errorMsg: 'please enter a username'
        });
      } else if (!this.state.password.length) {
        this.setState({
          errorMsg: 'please enter a password'
        });
      } else {
        (function () {
          var userObj = {
            name: _this2.state.username,
            password: _this2.state.password
          };

          var that = _this2;

          $.post(Url + '/login', userObj).then(function (response) {
            if (response[0] === 'it worked') {
              console.log('hi');

              that.setState({
                errorMsg: ''
              });

              that.props.changeViews('Home');
              that.props.setCurrentUser(response[1]);
            }
            console.log('this.state.view after state is set again', that.state.view);
          }).catch(function (err) {
            console.log(err);
            that.setState({
              errorMsg: 'invalid login information'
            });
          });
        })();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return React.createElement(
        'div',
        { className: 'landing row' },
        React.createElement(
          'div',
          { className: 'icon-block col s7' },
          React.createElement(
            'h2',
            { className: 'header logo' },
            'Welcome to TheMovieApp'
          ),
          React.createElement(
            'h5',
            { className: 'header col s12 light description' },
            'Lets find your next buddy by your movie taste!'
          )
        ),
        React.createElement(
          'div',
          { className: 'login icon-block' },
          React.createElement(
            'a',
            { className: 'waves-effect waves-light btn', onClick: function onClick() {
                return _this3.props.changeViews('SignUp');
              } },
            'Go to Sign Up'
          ),
          React.createElement(
            'div',
            { className: 'or' },
            'OR'
          ),
          React.createElement(
            'div',
            { className: 'loginForm' },
            React.createElement(
              'div',
              { className: 'input-field col s6' },
              React.createElement('input', { placeholder: 'username', id: 'user_name', name: 'LogInName', type: 'text', className: 'validate', onChange: this.handleChange.bind(this) }),
              React.createElement(
                'label',
                { 'for': 'user_name', className: 'active' },
                'Username'
              )
            ),
            React.createElement(
              'div',
              { className: 'input-field col s6' },
              React.createElement('input', { placeholder: 'password', id: 'password', name: 'LogInPassword', type: 'password', className: 'validate', onChange: this.handleChange.bind(this) }),
              React.createElement(
                'label',
                { 'for': 'password', className: 'active' },
                'Password'
              )
            ),
            React.createElement(
              'div',
              { className: 'errorMsg' },
              this.state.errorMsg
            ),
            React.createElement(
              'a',
              { className: 'waves-effect waves-light btn', onClick: this.handleLogIn.bind(this) },
              'log in'
            )
          )
        )
      );
    }
  }]);

  return LogIn;
}(React.Component);

window.LogIn = LogIn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0xvZ0luLmpzIl0sIm5hbWVzIjpbIkxvZ0luIiwicHJvcHMiLCJzdGF0ZSIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJlcnJvck1zZyIsImV2ZW50IiwidGFyZ2V0IiwibmFtZSIsInNldFN0YXRlIiwidmFsdWUiLCJsZW5ndGgiLCJ1c2VyT2JqIiwidGhhdCIsIiQiLCJwb3N0IiwiVXJsIiwidGhlbiIsInJlc3BvbnNlIiwiY29uc29sZSIsImxvZyIsImNoYW5nZVZpZXdzIiwic2V0Q3VycmVudFVzZXIiLCJ2aWV3IiwiY2F0Y2giLCJlcnIiLCJoYW5kbGVDaGFuZ2UiLCJiaW5kIiwiaGFuZGxlTG9nSW4iLCJSZWFjdCIsIkNvbXBvbmVudCIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNQSxLOzs7QUFFSixpQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLDhHQUNYQSxLQURXOztBQUdqQixVQUFLQyxLQUFMLEdBQWE7QUFDWEMsZ0JBQVUsRUFEQztBQUVYQyxnQkFBVSxFQUZDO0FBR1hDLGdCQUFVO0FBSEMsS0FBYjtBQUhpQjtBQVFsQjs7OztpQ0FFWUMsSyxFQUFPO0FBQ2xCLFVBQUlBLE1BQU1DLE1BQU4sQ0FBYUMsSUFBYixLQUFzQixXQUExQixFQUF1QztBQUNyQyxhQUFLQyxRQUFMLENBQWM7QUFDWk4sb0JBQVVHLE1BQU1DLE1BQU4sQ0FBYUc7QUFEWCxTQUFkO0FBR0QsT0FKRCxNQUlPO0FBQ0wsYUFBS0QsUUFBTCxDQUFjO0FBQ1pMLG9CQUFVRSxNQUFNQyxNQUFOLENBQWFHO0FBRFgsU0FBZDtBQUdEO0FBQ0Y7OztrQ0FFYTtBQUFBOztBQUNaLFVBQUksQ0FBQyxLQUFLUixLQUFMLENBQVdDLFFBQVgsQ0FBb0JRLE1BQXJCLElBQStCLENBQUMsS0FBS1QsS0FBTCxDQUFXRSxRQUFYLENBQW9CTyxNQUF4RCxFQUFnRTtBQUM5RCxhQUFLRixRQUFMLENBQWM7QUFDWkosb0JBQVU7QUFERSxTQUFkO0FBR0QsT0FKRCxNQUlPLElBQUksQ0FBQyxLQUFLSCxLQUFMLENBQVdDLFFBQVgsQ0FBb0JRLE1BQXpCLEVBQWlDO0FBQ3RDLGFBQUtGLFFBQUwsQ0FBYztBQUNaSixvQkFBVTtBQURFLFNBQWQ7QUFHRCxPQUpNLE1BSUEsSUFBSSxDQUFDLEtBQUtILEtBQUwsQ0FBV0UsUUFBWCxDQUFvQk8sTUFBekIsRUFBaUM7QUFDdEMsYUFBS0YsUUFBTCxDQUFjO0FBQ1pKLG9CQUFVO0FBREUsU0FBZDtBQUdELE9BSk0sTUFJQTtBQUFBO0FBQ0wsY0FBSU8sVUFBVTtBQUNaSixrQkFBTSxPQUFLTixLQUFMLENBQVdDLFFBREw7QUFFWkMsc0JBQVUsT0FBS0YsS0FBTCxDQUFXRTtBQUZULFdBQWQ7O0FBS0EsY0FBSVMsYUFBSjs7QUFFQUMsWUFBRUMsSUFBRixDQUFPQyxNQUFNLFFBQWIsRUFBdUJKLE9BQXZCLEVBQ0NLLElBREQsQ0FDTSxvQkFBWTtBQUNoQixnQkFBSUMsU0FBUyxDQUFULE1BQWdCLFdBQXBCLEVBQWlDO0FBQy9CQyxzQkFBUUMsR0FBUixDQUFZLElBQVo7O0FBRUFQLG1CQUFLSixRQUFMLENBQWM7QUFDWkosMEJBQVU7QUFERSxlQUFkOztBQUlBUSxtQkFBS1osS0FBTCxDQUFXb0IsV0FBWCxDQUF1QixNQUF2QjtBQUNBUixtQkFBS1osS0FBTCxDQUFXcUIsY0FBWCxDQUEwQkosU0FBUyxDQUFULENBQTFCO0FBQ0Q7QUFDQUMsb0JBQVFDLEdBQVIsQ0FBWSwwQ0FBWixFQUF1RFAsS0FBS1gsS0FBTCxDQUFXcUIsSUFBbEU7QUFDRixXQWJELEVBY0NDLEtBZEQsQ0FjTyxVQUFTQyxHQUFULEVBQWM7QUFDbkJOLG9CQUFRQyxHQUFSLENBQVlLLEdBQVo7QUFDQVosaUJBQUtKLFFBQUwsQ0FBYztBQUNaSix3QkFBVTtBQURFLGFBQWQ7QUFHRCxXQW5CRDtBQVJLO0FBNEJOO0FBQ0Y7Ozs2QkFHUTtBQUFBOztBQUNQLGFBQ0U7QUFBQTtBQUFBLFVBQUssV0FBVSxhQUFmO0FBQ0U7QUFBQTtBQUFBLFlBQUssV0FBVSxtQkFBZjtBQUNFO0FBQUE7QUFBQSxjQUFJLFdBQVUsYUFBZDtBQUFBO0FBQUEsV0FERjtBQUVFO0FBQUE7QUFBQSxjQUFJLFdBQVUsa0NBQWQ7QUFBQTtBQUFBO0FBRkYsU0FERjtBQU9FO0FBQUE7QUFBQSxZQUFLLFdBQVUsa0JBQWY7QUFDRTtBQUFBO0FBQUEsY0FBRyxXQUFVLDhCQUFiLEVBQTRDLFNBQVM7QUFBQSx1QkFBTSxPQUFLSixLQUFMLENBQVdvQixXQUFYLENBQXVCLFFBQXZCLENBQU47QUFBQSxlQUFyRDtBQUFBO0FBQUEsV0FERjtBQUVFO0FBQUE7QUFBQSxjQUFLLFdBQVUsSUFBZjtBQUFBO0FBQUEsV0FGRjtBQUdFO0FBQUE7QUFBQSxjQUFLLFdBQVUsV0FBZjtBQUNFO0FBQUE7QUFBQSxnQkFBSyxXQUFVLG9CQUFmO0FBQ0UsNkNBQU8sYUFBWSxVQUFuQixFQUE4QixJQUFHLFdBQWpDLEVBQTZDLE1BQUssV0FBbEQsRUFBOEQsTUFBSyxNQUFuRSxFQUEwRSxXQUFVLFVBQXBGLEVBQStGLFVBQVUsS0FBS0ssWUFBTCxDQUFrQkMsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FBekcsR0FERjtBQUVFO0FBQUE7QUFBQSxrQkFBTyxPQUFJLFdBQVgsRUFBdUIsV0FBVSxRQUFqQztBQUFBO0FBQUE7QUFGRixhQURGO0FBTUU7QUFBQTtBQUFBLGdCQUFLLFdBQVUsb0JBQWY7QUFDRSw2Q0FBTyxhQUFZLFVBQW5CLEVBQThCLElBQUcsVUFBakMsRUFBNEMsTUFBSyxlQUFqRCxFQUFpRSxNQUFLLFVBQXRFLEVBQWlGLFdBQVUsVUFBM0YsRUFBc0csVUFBVSxLQUFLRCxZQUFMLENBQWtCQyxJQUFsQixDQUF1QixJQUF2QixDQUFoSCxHQURGO0FBRUU7QUFBQTtBQUFBLGtCQUFPLE9BQUksVUFBWCxFQUFzQixXQUFVLFFBQWhDO0FBQUE7QUFBQTtBQUZGLGFBTkY7QUFVRTtBQUFBO0FBQUEsZ0JBQUssV0FBVSxVQUFmO0FBQTJCLG1CQUFLekIsS0FBTCxDQUFXRztBQUF0QyxhQVZGO0FBV0U7QUFBQTtBQUFBLGdCQUFHLFdBQVUsOEJBQWIsRUFBNEMsU0FBUyxLQUFLdUIsV0FBTCxDQUFpQkQsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBckQ7QUFBQTtBQUFBO0FBWEY7QUFIRjtBQVBGLE9BREY7QUEwQkQ7Ozs7RUFoR2lCRSxNQUFNQyxTOztBQW1HMUJDLE9BQU8vQixLQUFQLEdBQWVBLEtBQWYiLCJmaWxlIjoiTG9nSW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBMb2dJbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgdXNlcm5hbWU6ICcnLFxyXG4gICAgICBwYXNzd29yZDogJycsXHJcbiAgICAgIGVycm9yTXNnOiAnJ1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGhhbmRsZUNoYW5nZShldmVudCkge1xyXG4gICAgaWYgKGV2ZW50LnRhcmdldC5uYW1lID09PSAnTG9nSW5OYW1lJykge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICB1c2VybmFtZTogZXZlbnQudGFyZ2V0LnZhbHVlXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgcGFzc3dvcmQ6IGV2ZW50LnRhcmdldC52YWx1ZVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGhhbmRsZUxvZ0luKCkge1xyXG4gICAgaWYgKCF0aGlzLnN0YXRlLnVzZXJuYW1lLmxlbmd0aCAmJiAhdGhpcy5zdGF0ZS5wYXNzd29yZC5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgZXJyb3JNc2c6ICdsb2dpbiBpcyBlbXB0eSdcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKCF0aGlzLnN0YXRlLnVzZXJuYW1lLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBlcnJvck1zZzogJ3BsZWFzZSBlbnRlciBhIHVzZXJuYW1lJ1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAoIXRoaXMuc3RhdGUucGFzc3dvcmQubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIGVycm9yTXNnOiAncGxlYXNlIGVudGVyIGEgcGFzc3dvcmQnXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGV0IHVzZXJPYmogPSB7IFxyXG4gICAgICAgIG5hbWU6IHRoaXMuc3RhdGUudXNlcm5hbWUsXHJcbiAgICAgICAgcGFzc3dvcmQ6IHRoaXMuc3RhdGUucGFzc3dvcmRcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGxldCB0aGF0ID0gdGhpcztcclxuXHJcbiAgICAgICQucG9zdChVcmwgKyAnL2xvZ2luJywgdXNlck9iailcclxuICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgIGlmIChyZXNwb25zZVswXSA9PT0gJ2l0IHdvcmtlZCcpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdoaScpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICB0aGF0LnNldFN0YXRlKHtcclxuICAgICAgICAgICAgZXJyb3JNc2c6ICcnXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICB0aGF0LnByb3BzLmNoYW5nZVZpZXdzKCdIb21lJyk7XHJcbiAgICAgICAgICB0aGF0LnByb3BzLnNldEN1cnJlbnRVc2VyKHJlc3BvbnNlWzFdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKCd0aGlzLnN0YXRlLnZpZXcgYWZ0ZXIgc3RhdGUgaXMgc2V0IGFnYWluJyx0aGF0LnN0YXRlLnZpZXcpO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICB0aGF0LnNldFN0YXRlKHtcclxuICAgICAgICAgIGVycm9yTXNnOiAnaW52YWxpZCBsb2dpbiBpbmZvcm1hdGlvbidcclxuICAgICAgICB9KTtcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcblxyXG5cclxuICByZW5kZXIoKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nbGFuZGluZyByb3cnPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdpY29uLWJsb2NrIGNvbCBzNyc+XHJcbiAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwiaGVhZGVyIGxvZ29cIj5XZWxjb21lIHRvIFRoZU1vdmllQXBwPC9oMj5cclxuICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJoZWFkZXIgY29sIHMxMiBsaWdodCBkZXNjcmlwdGlvblwiPlxyXG4gICAgICAgICAgICBMZXRzIGZpbmQgeW91ciBuZXh0IGJ1ZGR5IGJ5IHlvdXIgbW92aWUgdGFzdGUhXHJcbiAgICAgICAgICA8L2g1PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdsb2dpbiBpY29uLWJsb2NrJz5cclxuICAgICAgICAgIDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXsoKSA9PiB0aGlzLnByb3BzLmNoYW5nZVZpZXdzKCdTaWduVXAnKX0+R28gdG8gU2lnbiBVcDwvYT5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JcIj5PUjwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2xvZ2luRm9ybSc+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZmllbGQgY29sIHM2XCI+XHJcbiAgICAgICAgICAgICAgPGlucHV0IHBsYWNlaG9sZGVyPVwidXNlcm5hbWVcIiBpZD1cInVzZXJfbmFtZVwiIG5hbWU9J0xvZ0luTmFtZScgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJ2YWxpZGF0ZVwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfS8+XHJcbiAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cInVzZXJfbmFtZVwiIGNsYXNzTmFtZT1cImFjdGl2ZVwiPlVzZXJuYW1lPC9sYWJlbD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWZpZWxkIGNvbCBzNlwiPlxyXG4gICAgICAgICAgICAgIDxpbnB1dCBwbGFjZWhvbGRlcj1cInBhc3N3b3JkXCIgaWQ9XCJwYXNzd29yZFwiIG5hbWU9J0xvZ0luUGFzc3dvcmQnIHR5cGU9XCJwYXNzd29yZFwiIGNsYXNzTmFtZT1cInZhbGlkYXRlXCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyl9Lz5cclxuICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwicGFzc3dvcmRcIiBjbGFzc05hbWU9XCJhY3RpdmVcIj5QYXNzd29yZDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImVycm9yTXNnXCI+e3RoaXMuc3RhdGUuZXJyb3JNc2d9PC9kaXY+XHJcbiAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXt0aGlzLmhhbmRsZUxvZ0luLmJpbmQodGhpcyl9PmxvZyBpbjwvYT5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj4pXHJcbiAgfVxyXG59XHJcblxyXG53aW5kb3cuTG9nSW4gPSBMb2dJbjtcclxuIl19
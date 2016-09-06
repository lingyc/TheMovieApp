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
      if (this.state.username.length === 0 && this.state.password.length === 0) {
        this.setState({
          errorMsg: 'login is empty'
        });
      } else if (this.state.username.length === 0) {
        this.setState({
          errorMsg: 'please enter a username'
        });
      } else if (this.state.password.length === 0) {
        this.setState({
          errorMsg: 'please enter a password'
        });
      } else {
        var userObj = {
          name: this.state.username,
          password: this.state.password
        };

        var that = this;

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
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

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
                return _this2.props.changeViews('SignUp');
              } },
            'Go to Sign Up'
          ),
          React.createElement(
            'div',
            { className: 'or' },
            '---------- OR -----------'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0xvZ0luLmpzIl0sIm5hbWVzIjpbIkxvZ0luIiwicHJvcHMiLCJzdGF0ZSIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJlcnJvck1zZyIsImV2ZW50IiwidGFyZ2V0IiwibmFtZSIsInNldFN0YXRlIiwidmFsdWUiLCJsZW5ndGgiLCJ1c2VyT2JqIiwidGhhdCIsIiQiLCJwb3N0IiwiVXJsIiwidGhlbiIsInJlc3BvbnNlIiwiY29uc29sZSIsImxvZyIsImNoYW5nZVZpZXdzIiwic2V0Q3VycmVudFVzZXIiLCJ2aWV3IiwiY2F0Y2giLCJlcnIiLCJoYW5kbGVDaGFuZ2UiLCJiaW5kIiwiaGFuZGxlTG9nSW4iLCJSZWFjdCIsIkNvbXBvbmVudCIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNQSxLOzs7QUFFSixpQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLDhHQUNYQSxLQURXOztBQUdqQixVQUFLQyxLQUFMLEdBQWE7QUFDWEMsZ0JBQVUsRUFEQztBQUVYQyxnQkFBVSxFQUZDO0FBR1hDLGdCQUFVO0FBSEMsS0FBYjtBQUhpQjtBQVFsQjs7OztpQ0FFWUMsSyxFQUFPO0FBQ2xCLFVBQUlBLE1BQU1DLE1BQU4sQ0FBYUMsSUFBYixLQUFzQixXQUExQixFQUF1QztBQUNyQyxhQUFLQyxRQUFMLENBQWM7QUFDWk4sb0JBQVVHLE1BQU1DLE1BQU4sQ0FBYUc7QUFEWCxTQUFkO0FBR0QsT0FKRCxNQUlPO0FBQ0wsYUFBS0QsUUFBTCxDQUFjO0FBQ1pMLG9CQUFVRSxNQUFNQyxNQUFOLENBQWFHO0FBRFgsU0FBZDtBQUdEO0FBQ0Y7OztrQ0FFYTtBQUNaLFVBQUksS0FBS1IsS0FBTCxDQUFXQyxRQUFYLENBQW9CUSxNQUFwQixLQUErQixDQUEvQixJQUFvQyxLQUFLVCxLQUFMLENBQVdFLFFBQVgsQ0FBb0JPLE1BQXBCLEtBQStCLENBQXZFLEVBQTBFO0FBQ3hFLGFBQUtGLFFBQUwsQ0FBYztB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QWY7QUFBMkIsbUJBQUt6QixLQUFMLENBQVdHO0FBQXRDLGFBVkY7QUFXRTtBQUFBO0FBQUEsZ0JBQUcsV0FBVSw4QkFBYixFQUE0QyxTQUFTLEtBQUt1QixXQUFMLENBQWlCRCxJQUFqQixDQUFzQixJQUF0QixDQUFyRDtBQUFBO0FBQUE7QUFYRjtBQUhGO0FBUEYsT0FERjtBQTBCRDs7OztFQWhHaUJFLE1BQU1DLFM7O0FBbUcxQkMsT0FBTy9CLEtBQVAsR0FBZUEsS0FBZiIsImZpbGUiOiJMb2dJbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIExvZ0luIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHJcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgIHN1cGVyKHByb3BzKTtcclxuXHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICB1c2VybmFtZTogJycsXHJcbiAgICAgIHBhc3N3b3JkOiAnJyxcclxuICAgICAgZXJyb3JNc2c6ICcnXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XHJcbiAgICBpZiAoZXZlbnQudGFyZ2V0Lm5hbWUgPT09ICdMb2dJbk5hbWUnKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHVzZXJuYW1lOiBldmVudC50YXJnZXQudmFsdWVcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBwYXNzd29yZDogZXZlbnQudGFyZ2V0LnZhbHVlXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaGFuZGxlTG9nSW4oKSB7XHJcbiAgICBpZiAodGhpcy5zdGF0ZS51c2VybmFtZS5sZW5ndGggPT09IDAgJiYgdGhpcy5zdGF0ZS5wYXNzd29yZC5sZW5ndGggPT09IDApIHtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgZXJyb3JNc2c6ICdsb2dpbiBpcyBlbXB0eSdcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudXNlcm5hbWUubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIGVycm9yTXNnOiAncGxlYXNlIGVudGVyIGEgdXNlcm5hbWUnXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnBhc3N3b3JkLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBlcnJvck1zZzogJ3BsZWFzZSBlbnRlciBhIHBhc3N3b3JkJ1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciB1c2VyT2JqID0geyBcclxuICAgICAgICBuYW1lOiB0aGlzLnN0YXRlLnVzZXJuYW1lLFxyXG4gICAgICAgIHBhc3N3b3JkOiB0aGlzLnN0YXRlLnBhc3N3b3JkXHJcbiAgICAgIH07XHJcblxyXG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgICAkLnBvc3QoVXJsICsgJy9sb2dpbicsIHVzZXJPYmopXHJcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgaWYgKHJlc3BvbnNlWzBdID09PSAnaXQgd29ya2VkJykge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ2hpJyk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgIHRoYXQuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgICBlcnJvck1zZzogJydcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIHRoYXQucHJvcHMuY2hhbmdlVmlld3MoJ0hvbWUnKTtcclxuICAgICAgICAgIHRoYXQucHJvcHMuc2V0Q3VycmVudFVzZXIocmVzcG9uc2VbMV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAgY29uc29sZS5sb2coJ3RoaXMuc3RhdGUudmlldyBhZnRlciBzdGF0ZSBpcyBzZXQgYWdhaW4nLHRoYXQuc3RhdGUudmlldyk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChmdW5jdGlvbihlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgIHRoYXQuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgZXJyb3JNc2c6ICdpbnZhbGlkIGxvZ2luIGluZm9ybWF0aW9uJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdsYW5kaW5nIHJvdyc+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ljb24tYmxvY2sgY29sIHM3Jz5cclxuICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJoZWFkZXIgbG9nb1wiPldlbGNvbWUgdG8gVGhlTW92aWVBcHA8L2gyPlxyXG4gICAgICAgICAgPGg1IGNsYXNzTmFtZT1cImhlYWRlciBjb2wgczEyIGxpZ2h0IGRlc2NyaXB0aW9uXCI+XHJcbiAgICAgICAgICAgIExldHMgZmluZCB5b3VyIG5leHQgYnVkZHkgYnkgeW91ciBtb3ZpZSB0YXN0ZSFcclxuICAgICAgICAgIDwvaDU+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2xvZ2luIGljb24tYmxvY2snPlxyXG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9eygpID0+IHRoaXMucHJvcHMuY2hhbmdlVmlld3MoJ1NpZ25VcCcpfT5HbyB0byBTaWduIFVwPC9hPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvclwiPi0tLS0tLS0tLS0gT1IgLS0tLS0tLS0tLS08L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdsb2dpbkZvcm0nPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWZpZWxkIGNvbCBzNlwiPlxyXG4gICAgICAgICAgICAgIDxpbnB1dCBwbGFjZWhvbGRlcj1cInVzZXJuYW1lXCIgaWQ9XCJ1c2VyX25hbWVcIiBuYW1lPSdMb2dJbk5hbWUnIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwidmFsaWRhdGVcIiBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKX0vPlxyXG4gICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJ1c2VyX25hbWVcIiBjbGFzc05hbWU9XCJhY3RpdmVcIj5Vc2VybmFtZTwvbGFiZWw+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1maWVsZCBjb2wgczZcIj5cclxuICAgICAgICAgICAgICA8aW5wdXQgcGxhY2Vob2xkZXI9XCJwYXNzd29yZFwiIGlkPVwicGFzc3dvcmRcIiBuYW1lPSdMb2dJblBhc3N3b3JkJyB0eXBlPVwicGFzc3dvcmRcIiBjbGFzc05hbWU9XCJ2YWxpZGF0ZVwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfS8+XHJcbiAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cInBhc3N3b3JkXCIgY2xhc3NOYW1lPVwiYWN0aXZlXCI+UGFzc3dvcmQ8L2xhYmVsPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJlcnJvck1zZ1wiPnt0aGlzLnN0YXRlLmVycm9yTXNnfTwvZGl2PlxyXG4gICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17dGhpcy5oYW5kbGVMb2dJbi5iaW5kKHRoaXMpfT5sb2cgaW48L2E+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+KVxyXG4gIH1cclxufVxyXG5cclxud2luZG93LkxvZ0luID0gTG9nSW47XHJcbiJdfQ==
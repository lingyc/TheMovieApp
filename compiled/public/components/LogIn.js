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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0xvZ0luLmpzIl0sIm5hbWVzIjpbIkxvZ0luIiwicHJvcHMiLCJzdGF0ZSIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJlcnJvck1zZyIsImV2ZW50IiwidGFyZ2V0IiwibmFtZSIsInNldFN0YXRlIiwidmFsdWUiLCJsZW5ndGgiLCJ1c2VyT2JqIiwidGhhdCIsIiQiLCJwb3N0IiwiVXJsIiwidGhlbiIsInJlc3BvbnNlIiwiY29uc29sZSIsImxvZyIsImNoYW5nZVZpZXdzIiwic2V0Q3VycmVudFVzZXIiLCJ2aWV3IiwiY2F0Y2giLCJlcnIiLCJoYW5kbGVDaGFuZ2UiLCJiaW5kIiwiaGFuZGxlTG9nSW4iLCJSZWFjdCIsIkNvbXBvbmVudCIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNQSxLOzs7QUFFSixpQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLDhHQUNYQSxLQURXOztBQUdqQixVQUFLQyxLQUFMLEdBQWE7QUFDWEMsZ0JBQVUsRUFEQztBQUVYQyxnQkFBVSxFQUZDO0FBR1hDLGdCQUFVO0FBSEMsS0FBYjtBQUhpQjtBQVFsQjs7OztpQ0FFWUMsSyxFQUFPO0FBQ2xCLFVBQUlBLE1BQU1DLE1BQU4sQ0FBYUMsSUFBYixLQUFzQixXQUExQixFQUF1QztBQUNyQyxhQUFLQyxRQUFMLENBQWM7QUFDWk4sb0JBQVVHLE1BQU1DLE1BQU4sQ0FBYUc7QUFEWCxTQUFkO0FBR0QsT0FKRCxNQUlPO0FBQ0wsYUFBS0QsUUFBTCxDQUFjO0FBQ1pMLG9CQUFVRSxNQUFNQyxNQUFOLENBQWFHO0FBRFgsU0FBZDtBQUdEO0FBQ0Y7OztrQ0FFYTtBQUNaLFVBQUksS0FBS1IsS0FBTCxDQUFXQyxRQUFYLENBQW9CUSxNQUFwQixLQUErQixDQUEvQixJQUFvQyxLQUFLVCxLQUFMLENBQVdFLFFBQVgsQ0FBb0JPLE1BQXBCLEtBQStCLENBQXZFLEVBQTBFO0FBQ3hFLGFBQUtGLFFBQUwsQ0FBYztB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QWY7QUFBMkIsbUJBQUt6QixLQUFMLENBQVdHO0FBQXRDLGFBVkY7QUFXRTtBQUFBO0FBQUEsZ0JBQUcsV0FBVSw4QkFBYixFQUE0QyxTQUFTLEtBQUt1QixXQUFMLENBQWlCRCxJQUFqQixDQUFzQixJQUF0QixDQUFyRDtBQUFBO0FBQUE7QUFYRjtBQUhGO0FBUEYsT0FERjtBQTBCRDs7OztFQWhHaUJFLE1BQU1DLFM7O0FBbUcxQkMsT0FBTy9CLEtBQVAsR0FBZUEsS0FBZiIsImZpbGUiOiJMb2dJbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIExvZ0luIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICB1c2VybmFtZTogJycsXG4gICAgICBwYXNzd29yZDogJycsXG4gICAgICBlcnJvck1zZzogJydcbiAgICB9O1xuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LnRhcmdldC5uYW1lID09PSAnTG9nSW5OYW1lJykge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHVzZXJuYW1lOiBldmVudC50YXJnZXQudmFsdWVcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgcGFzc3dvcmQ6IGV2ZW50LnRhcmdldC52YWx1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlTG9nSW4oKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUudXNlcm5hbWUubGVuZ3RoID09PSAwICYmIHRoaXMuc3RhdGUucGFzc3dvcmQubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZXJyb3JNc2c6ICdsb2dpbiBpcyBlbXB0eSdcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS51c2VybmFtZS5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBlcnJvck1zZzogJ3BsZWFzZSBlbnRlciBhIHVzZXJuYW1lJ1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnBhc3N3b3JkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGVycm9yTXNnOiAncGxlYXNlIGVudGVyIGEgcGFzc3dvcmQnXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVzZXJPYmogPSB7IFxuICAgICAgICBuYW1lOiB0aGlzLnN0YXRlLnVzZXJuYW1lLFxuICAgICAgICBwYXNzd29yZDogdGhpcy5zdGF0ZS5wYXNzd29yZFxuICAgICAgfTtcblxuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAkLnBvc3QoVXJsICsgJy9sb2dpbicsIHVzZXJPYmopXG4gICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBpZiAocmVzcG9uc2VbMF0gPT09ICdpdCB3b3JrZWQnKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ2hpJyk7XG4gICAgICAgICAgXG4gICAgICAgICAgdGhhdC5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBlcnJvck1zZzogJydcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRoYXQucHJvcHMuY2hhbmdlVmlld3MoJ0hvbWUnKTtcbiAgICAgICAgICB0aGF0LnByb3BzLnNldEN1cnJlbnRVc2VyKHJlc3BvbnNlWzFdKTtcbiAgICAgICAgfVxuICAgICAgICAgY29uc29sZS5sb2coJ3RoaXMuc3RhdGUudmlldyBhZnRlciBzdGF0ZSBpcyBzZXQgYWdhaW4nLHRoYXQuc3RhdGUudmlldyk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICB0aGF0LnNldFN0YXRlKHtcbiAgICAgICAgICBlcnJvck1zZzogJ2ludmFsaWQgbG9naW4gaW5mb3JtYXRpb24nXG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICB9XG4gIH1cblxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9J2xhbmRpbmcgcm93Jz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2ljb24tYmxvY2sgY29sIHM3Jz5cbiAgICAgICAgICA8aDIgY2xhc3NOYW1lPVwiaGVhZGVyIGxvZ29cIj5XZWxjb21lIHRvIFRoZU1vdmllQXBwPC9oMj5cbiAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwiaGVhZGVyIGNvbCBzMTIgbGlnaHQgZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgIExldHMgZmluZCB5b3VyIG5leHQgYnVkZHkgYnkgeW91ciBtb3ZpZSB0YXN0ZSFcbiAgICAgICAgICA8L2g1PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2xvZ2luIGljb24tYmxvY2snPlxuICAgICAgICAgIDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXsoKSA9PiB0aGlzLnByb3BzLmNoYW5nZVZpZXdzKCdTaWduVXAnKX0+R28gdG8gU2lnbiBVcDwvYT5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yXCI+LS0tLS0tLS0tLSBPUiAtLS0tLS0tLS0tLTwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSdsb2dpbkZvcm0nPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1maWVsZCBjb2wgczZcIj5cbiAgICAgICAgICAgICAgPGlucHV0IHBsYWNlaG9sZGVyPVwidXNlcm5hbWVcIiBpZD1cInVzZXJfbmFtZVwiIG5hbWU9J0xvZ0luTmFtZScgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJ2YWxpZGF0ZVwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfS8+XG4gICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJ1c2VyX25hbWVcIiBjbGFzc05hbWU9XCJhY3RpdmVcIj5Vc2VybmFtZTwvbGFiZWw+XG4gICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1maWVsZCBjb2wgczZcIj5cbiAgICAgICAgICAgICAgPGlucHV0IHBsYWNlaG9sZGVyPVwicGFzc3dvcmRcIiBpZD1cInBhc3N3b3JkXCIgbmFtZT0nTG9nSW5QYXNzd29yZCcgdHlwZT1cInBhc3N3b3JkXCIgY2xhc3NOYW1lPVwidmFsaWRhdGVcIiBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKX0vPlxuICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwicGFzc3dvcmRcIiBjbGFzc05hbWU9XCJhY3RpdmVcIj5QYXNzd29yZDwvbGFiZWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZXJyb3JNc2dcIj57dGhpcy5zdGF0ZS5lcnJvck1zZ308L2Rpdj5cbiAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXt0aGlzLmhhbmRsZUxvZ0luLmJpbmQodGhpcyl9PmxvZyBpbjwvYT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj4pXG4gIH1cbn1cblxud2luZG93LkxvZ0luID0gTG9nSW47XG4iXX0=
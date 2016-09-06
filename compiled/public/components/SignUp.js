'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SignUp = function (_React$Component) {
  _inherits(SignUp, _React$Component);

  function SignUp(props) {
    _classCallCheck(this, SignUp);

    var _this = _possibleConstructorReturn(this, (SignUp.__proto__ || Object.getPrototypeOf(SignUp)).call(this, props));

    _this.state = {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      errorMsg: '',
      successMsg: ''
    };
    return _this;
  }

  _createClass(SignUp, [{
    key: 'handleChange',
    value: function handleChange(event) {
      if (event.target.name === 'SignUpName') {
        this.setState({
          username: event.target.value
        });
      } else if (event.target.name === 'SignUpPassword') {
        this.setState({
          password: event.target.value
        });
      } else if (event.target.name === 'SignUpFirstname') {
        this.setState({
          firstName: event.target.value
        });
      } else if (event.target.name === 'SignUpLastname') {
        this.setState({
          lastName: event.target.value
        });
      }
    }
  }, {
    key: 'enterNewUser',
    value: function enterNewUser() {
      var _this2 = this;

      if (!this.state.username.length) {
        this.setState({
          errorMsg: 'please enter a username'
        });
      } else if (!this.state.password.length) {
        this.setState({
          errorMsg: 'please enter a password'
        });
      } else if (!this.state.firstName.length) {
        this.setState({
          errorMsg: 'please enter your first name'
        });
      } else if (!this.state.lastName.length) {
        this.setState({
          errorMsg: 'please enter your last name'
        });
      } else {
        (function () {
          var userObj = {
            name: _this2.state.username,
            password: _this2.state.password,
            firstName: _this2.state.firstName,
            lastName: _this2.state.lastName
          };

          var that = _this2;

          $.post(Url + '/signup', userObj).then(function (reponse) {
            //after signup should prompt user to select their favorite three movies
            that.setState({
              errorMsg: '',
              successMsg: 'new login created'
            });

            that.props.changeViews("Home");
            that.props.setCurrentUser(that.state.username);
          }).catch(function (err) {
            console.log(err);
            that.setState({
              errorMsg: 'username already exist, please use a different username'
            });
          });
        })();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var that = this;
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
                return _this3.props.changeViews('Login');
              } },
            'Go to Log In'
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
              React.createElement('input', { placeholder: 'username', id: 'user_name', name: 'SignUpName', type: 'text', className: 'validate', onChange: this.handleChange.bind(this) }),
              React.createElement(
                'label',
                { 'for': 'user_name', className: 'active' },
                'Username'
              )
            ),
            React.createElement(
              'div',
              { className: 'input-field col s6' },
              React.createElement('input', { placeholder: 'password', id: 'password', name: 'SignUpPassword', type: 'password', className: 'validate', onChange: this.handleChange.bind(this) }),
              React.createElement(
                'label',
                { 'for': 'password', className: 'active' },
                'Password'
              )
            ),
            React.createElement(
              'div',
              { className: 'input-field col s6' },
              React.createElement('input', { placeholder: 'first name', id: 'first_name', name: 'SignUpFirstname', type: 'text', className: 'validate', onChange: this.handleChange.bind(this) }),
              React.createElement(
                'label',
                { 'for': 'first_name', className: 'active' },
                'first name'
              )
            ),
            React.createElement(
              'div',
              { className: 'input-field col s6' },
              React.createElement('input', { placeholder: 'last name', id: 'last_name', name: 'SignUpLastname', type: 'text', className: 'validate', onChange: this.handleChange.bind(this) }),
              React.createElement(
                'label',
                { 'for': 'last_name', className: 'active' },
                'last name'
              )
            ),
            React.createElement(
              'div',
              { className: 'errorMsg' },
              this.state.errorMsg
            ),
            React.createElement(
              'a',
              { className: 'waves-effect waves-light btn', onClick: this.enterNewUser.bind(this) },
              'Sign Up!'
            )
          )
        )
      );
    }
  }]);

  return SignUp;
}(React.Component);

window.SignUp = SignUp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1NpZ25VcC5qcyJdLCJuYW1lcyI6WyJTaWduVXAiLCJwcm9wcyIsInN0YXRlIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsImZpcnN0TmFtZSIsImxhc3ROYW1lIiwiZXJyb3JNc2ciLCJzdWNjZXNzTXNnIiwiZXZlbnQiLCJ0YXJnZXQiLCJuYW1lIiwic2V0U3RhdGUiLCJ2YWx1ZSIsImxlbmd0aCIsInVzZXJPYmoiLCJ0aGF0IiwiJCIsInBvc3QiLCJVcmwiLCJ0aGVuIiwiY2hhbmdlVmlld3MiLCJzZXRDdXJyZW50VXNlciIsImNhdGNoIiwiZXJyIiwiY29uc29sZSIsImxvZyIsImhhbmRsZUNoYW5nZSIsImJpbmQiLCJlbnRlck5ld1VzZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQUFNQSxNOzs7QUFFSixrQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLGdIQUNYQSxLQURXOztBQUdqQixVQUFLQyxLQUFMLEdBQWE7QUFDWEMsZ0JBQVUsRUFEQztBQUVYQyxnQkFBVSxFQUZDO0FBR1hDLGlCQUFXLEVBSEE7QUFJWEMsZ0JBQVUsRUFKQztBQUtYQyxnQkFBVSxFQUxDO0FBTVhDLGtCQUFZO0FBTkQsS0FBYjtBQUhpQjtBQVdsQjs7OztpQ0FFWUMsSyxFQUFPO0FBQ2xCLFVBQUlBLE1BQU1DLE1BQU4sQ0FBYUMsSUFBYixLQUFzQixZQUExQixFQUF3QztBQUN0QyxhQUFLQyxRQUFMLENBQWM7QUFDWlQsb0JBQVVNLE1BQU1DLE1BQU4sQ0FBYUc7QUFEWCxTQUFkO0FBR0QsT0FKRCxNQUlPLElBQUlKLE1BQU1DLE1BQU4sQ0FBYUMsSUFBYixLQUFzQixnQkFBMUIsRUFBNEM7QUFDakQsYUFBS0MsUUFBTCxDQUFjO0FBQ1pSLG9CQUFVSyxNQUFNQyxNQUFOLENBQWFHO0FBRFgsU0FBZDtBQUdELE9BSk0sTUFJQSxJQUFJSixNQUFNQyxNQUFOLENBQWFD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bUJBQUsxQixLQUFMLENBQVdLO0FBQXRDLGFBckJGO0FBc0JFO0FBQUE7QUFBQSxnQkFBRyxXQUFVLDhCQUFiLEVBQTRDLFNBQVMsS0FBS3NCLFlBQUwsQ0FBa0JELElBQWxCLENBQXVCLElBQXZCLENBQXJEO0FBQUE7QUFBQTtBQXRCRjtBQUhGO0FBUEYsT0FEQTtBQXFDRDs7OztFQXpIa0JFLE1BQU1DLFM7O0FBNkgzQkMsT0FBT2hDLE1BQVAsR0FBZ0JBLE1BQWhCIiwiZmlsZSI6IlNpZ25VcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFNpZ25VcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgdXNlcm5hbWU6ICcnLFxyXG4gICAgICBwYXNzd29yZDogJycsXHJcbiAgICAgIGZpcnN0TmFtZTogJycsXHJcbiAgICAgIGxhc3ROYW1lOiAnJyxcclxuICAgICAgZXJyb3JNc2c6ICcnLFxyXG4gICAgICBzdWNjZXNzTXNnOiAnJ1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGhhbmRsZUNoYW5nZShldmVudCkge1xyXG4gICAgaWYgKGV2ZW50LnRhcmdldC5uYW1lID09PSAnU2lnblVwTmFtZScpIHtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgdXNlcm5hbWU6IGV2ZW50LnRhcmdldC52YWx1ZVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAoZXZlbnQudGFyZ2V0Lm5hbWUgPT09ICdTaWduVXBQYXNzd29yZCcpIHtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgcGFzc3dvcmQ6IGV2ZW50LnRhcmdldC52YWx1ZVxyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAoZXZlbnQudGFyZ2V0Lm5hbWUgPT09ICdTaWduVXBGaXJzdG5hbWUnKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIGZpcnN0TmFtZTogZXZlbnQudGFyZ2V0LnZhbHVlXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChldmVudC50YXJnZXQubmFtZSA9PT0gJ1NpZ25VcExhc3RuYW1lJykge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBsYXN0TmFtZTogZXZlbnQudGFyZ2V0LnZhbHVlXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZW50ZXJOZXdVc2VyKCkge1xyXG4gICAgaWYgKCF0aGlzLnN0YXRlLnVzZXJuYW1lLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBlcnJvck1zZzogJ3BsZWFzZSBlbnRlciBhIHVzZXJuYW1lJ1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAoIXRoaXMuc3RhdGUucGFzc3dvcmQubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIGVycm9yTXNnOiAncGxlYXNlIGVudGVyIGEgcGFzc3dvcmQnXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmICghdGhpcy5zdGF0ZS5maXJzdE5hbWUubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIGVycm9yTXNnOiAncGxlYXNlIGVudGVyIHlvdXIgZmlyc3QgbmFtZSdcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKCF0aGlzLnN0YXRlLmxhc3ROYW1lLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBlcnJvck1zZzogJ3BsZWFzZSBlbnRlciB5b3VyIGxhc3QgbmFtZSdcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsZXQgdXNlck9iaiA9IHsgXHJcbiAgICAgICAgbmFtZTogdGhpcy5zdGF0ZS51c2VybmFtZSxcclxuICAgICAgICBwYXNzd29yZDogdGhpcy5zdGF0ZS5wYXNzd29yZCxcclxuICAgICAgICBmaXJzdE5hbWU6IHRoaXMuc3RhdGUuZmlyc3ROYW1lLFxyXG4gICAgICAgIGxhc3ROYW1lOiB0aGlzLnN0YXRlLmxhc3ROYW1lXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBsZXQgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgICAkLnBvc3QoVXJsICsgJy9zaWdudXAnLCB1c2VyT2JqKVxyXG4gICAgICAudGhlbihyZXBvbnNlID0+IHtcclxuICAgICAgICAvL2FmdGVyIHNpZ251cCBzaG91bGQgcHJvbXB0IHVzZXIgdG8gc2VsZWN0IHRoZWlyIGZhdm9yaXRlIHRocmVlIG1vdmllc1xyXG4gICAgICAgIHRoYXQuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgZXJyb3JNc2c6ICcnLFxyXG4gICAgICAgICAgc3VjY2Vzc01zZzogJ25ldyBsb2dpbiBjcmVhdGVkJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGF0LnByb3BzLmNoYW5nZVZpZXdzKFwiSG9tZVwiKTtcclxuICAgICAgICB0aGF0LnByb3BzLnNldEN1cnJlbnRVc2VyKHRoYXQuc3RhdGUudXNlcm5hbWUpO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICB0aGF0LnNldFN0YXRlKHtcclxuICAgICAgICAgIGVycm9yTXNnOiAndXNlcm5hbWUgYWxyZWFkeSBleGlzdCwgcGxlYXNlIHVzZSBhIGRpZmZlcmVudCB1c2VybmFtZSdcclxuICAgICAgICB9KTtcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIGxldCB0aGF0ID0gdGhpcztcclxuICAgIHJldHVybiAoXHJcbiAgICA8ZGl2IGNsYXNzTmFtZT0nbGFuZGluZyByb3cnPlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0naWNvbi1ibG9jayBjb2wgczcnPlxyXG4gICAgICAgIDxoMiBjbGFzc05hbWU9XCJoZWFkZXIgbG9nb1wiPldlbGNvbWUgdG8gVGhlTW92aWVBcHA8L2gyPlxyXG4gICAgICAgIDxoNSBjbGFzc05hbWU9XCJoZWFkZXIgY29sIHMxMiBsaWdodCBkZXNjcmlwdGlvblwiPlxyXG4gICAgICAgICAgTGV0cyBmaW5kIHlvdXIgbmV4dCBidWRkeSBieSB5b3VyIG1vdmllIHRhc3RlIVxyXG4gICAgICAgIDwvaDU+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nbG9naW4gaWNvbi1ibG9jayc+XHJcbiAgICAgICAgPGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9eygpID0+IHRoaXMucHJvcHMuY2hhbmdlVmlld3MoJ0xvZ2luJyl9PkdvIHRvIExvZyBJbjwvYT5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yXCI+LS0tLS0tLS0tLSBPUiAtLS0tLS0tLS0tLTwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdsb2dpbkZvcm0nPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1maWVsZCBjb2wgczZcIj5cclxuICAgICAgICAgICAgPGlucHV0IHBsYWNlaG9sZGVyPVwidXNlcm5hbWVcIiBpZD1cInVzZXJfbmFtZVwiIG5hbWU9J1NpZ25VcE5hbWUnIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwidmFsaWRhdGVcIiBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKX0vPlxyXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwidXNlcl9uYW1lXCIgY2xhc3NOYW1lPVwiYWN0aXZlXCI+VXNlcm5hbWU8L2xhYmVsPlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1maWVsZCBjb2wgczZcIj5cclxuICAgICAgICAgICAgPGlucHV0IHBsYWNlaG9sZGVyPVwicGFzc3dvcmRcIiBpZD1cInBhc3N3b3JkXCIgbmFtZT0nU2lnblVwUGFzc3dvcmQnIHR5cGU9XCJwYXNzd29yZFwiIGNsYXNzTmFtZT1cInZhbGlkYXRlXCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyl9Lz5cclxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cInBhc3N3b3JkXCIgY2xhc3NOYW1lPVwiYWN0aXZlXCI+UGFzc3dvcmQ8L2xhYmVsPlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1maWVsZCBjb2wgczZcIj5cclxuICAgICAgICAgICAgPGlucHV0IHBsYWNlaG9sZGVyPVwiZmlyc3QgbmFtZVwiIGlkPVwiZmlyc3RfbmFtZVwiIG5hbWU9J1NpZ25VcEZpcnN0bmFtZScgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJ2YWxpZGF0ZVwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfS8+XHJcbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJmaXJzdF9uYW1lXCIgY2xhc3NOYW1lPVwiYWN0aXZlXCI+Zmlyc3QgbmFtZTwvbGFiZWw+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWZpZWxkIGNvbCBzNlwiPlxyXG4gICAgICAgICAgICA8aW5wdXQgcGxhY2Vob2xkZXI9XCJsYXN0IG5hbWVcIiBpZD1cImxhc3RfbmFtZVwiIG5hbWU9J1NpZ25VcExhc3RuYW1lJyB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cInZhbGlkYXRlXCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyl9Lz5cclxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImxhc3RfbmFtZVwiIGNsYXNzTmFtZT1cImFjdGl2ZVwiPmxhc3QgbmFtZTwvbGFiZWw+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImVycm9yTXNnXCI+e3RoaXMuc3RhdGUuZXJyb3JNc2d9PC9kaXY+XHJcbiAgICAgICAgICA8YSBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17dGhpcy5lbnRlck5ld1VzZXIuYmluZCh0aGlzKX0+U2lnbiBVcCE8L2E+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+KVxyXG4gIH1cclxuXHJcbn1cclxuXHJcbndpbmRvdy5TaWduVXAgPSBTaWduVXA7Il19
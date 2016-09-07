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
      var tar = event.target.value;
      switch (event.target.name) {
        case 'SignUpName':
          this.setState({
            username: tar
          });
          break;
        case 'SignUpPassword':
          this.setState({
            password: tar
          });
          break;
        case 'SignUpFirstname':
          this.setState({
            firstName: tar
          });
          break;
        case 'SignUpLastname':
          this.setState({
            lastName: tar
          });
          break;
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
        var userObj = {
          name: this.state.username,
          password: this.state.password,
          firstName: this.state.firstName,
          lastName: this.state.lastName
        };

        $.post(Url + '/signup', userObj).then(function (reponse) {
          //after signup should prompt user to select their favorite three movies
          _this2.setState({
            errorMsg: '',
            successMsg: 'new login created'
          });
          console.log(_this2, ' this');

          _this2.props.changeViews("Home");
          _this2.props.setCurrentUser(_this2.state.username);
        }).catch(function (err) {
          console.log(err);
          _this2.setState({
            errorMsg: 'username already exist, please use a different username'
          });
        });
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
                return _this3.props.changeViews('Login');
              } },
            'Go to Log In'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1NpZ25VcC5qcyJdLCJuYW1lcyI6WyJTaWduVXAiLCJwcm9wcyIsInN0YXRlIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsImZpcnN0TmFtZSIsImxhc3ROYW1lIiwiZXJyb3JNc2ciLCJzdWNjZXNzTXNnIiwiZXZlbnQiLCJ0YXIiLCJ0YXJnZXQiLCJ2YWx1ZSIsIm5hbWUiLCJzZXRTdGF0ZSIsImxlbmd0aCIsInVzZXJPYmoiLCIkIiwicG9zdCIsIlVybCIsInRoZW4iLCJjb25zb2xlIiwibG9nIiwiY2hhbmdlVmlld3MiLCJzZXRDdXJyZW50VXNlciIsImNhdGNoIiwiZXJyIiwiaGFuZGxlQ2hhbmdlIiwiYmluZCIsImVudGVyTmV3VXNlciIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU1BLE07OztBQUVKLGtCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsZ0hBQ1hBLEtBRFc7O0FBR2pCLFVBQUtDLEtBQUwsR0FBYTtBQUNYQyxnQkFBVSxFQURDO0FBRVhDLGdCQUFVLEVBRkM7QUFHWEMsaUJBQVcsRUFIQTtBQUlYQyxnQkFBVSxFQUpDO0FBS1hDLGdCQUFVLEVBTEM7QUFNWEMsa0JBQVk7QUFORCxLQUFiO0FBSGlCO0FBV2xCOzs7O2lDQUVZQyxLLEVBQU87QUFDbEIsVUFBTUMsTUFBTUQsTUFBTUUsTUFBTixDQUFhQyxLQUF6QjtBQUNBLGNBQVFILE1BQU1FLE1BQU4sQ0FBYUUsSUFBckI7QUFDRSxhQUFLLFlBQUw7QUFDQSxlQUFLQyxRQUFMLENBQWM7QUFDWlgsc0JBQVVPO0FBREUsV0FBZDtBQUdBO0FBQ0MsYUFBSyxnQkFBTDtBQUNELGVBQUtJLFFBQUwsQ0FBYztBQUNaVixzQkFBVU07QUFERSxXQUFkO0FBR0E7QUFDQyxhQUFLLGlCQUFMO0FBQ0QsZUFBS0ksUUFBTCxDQUFjO0FBQ1pULHVCQUFXSztBQURDLFdBQWQ7QUFHQTtBQUNDLGFB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T0FBT2hDLE1BQVAsR0FBZ0JBLE1BQWhCIiwiZmlsZSI6IlNpZ25VcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFNpZ25VcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgdXNlcm5hbWU6ICcnLFxyXG4gICAgICBwYXNzd29yZDogJycsXHJcbiAgICAgIGZpcnN0TmFtZTogJycsXHJcbiAgICAgIGxhc3ROYW1lOiAnJyxcclxuICAgICAgZXJyb3JNc2c6ICcnLFxyXG4gICAgICBzdWNjZXNzTXNnOiAnJ1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGhhbmRsZUNoYW5nZShldmVudCkge1xyXG4gICAgY29uc3QgdGFyID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgc3dpdGNoIChldmVudC50YXJnZXQubmFtZSl7XHJcbiAgICAgIGNhc2UgJ1NpZ25VcE5hbWUnOlxyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICB1c2VybmFtZTogdGFyXHJcbiAgICAgIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgICAgIGNhc2UgJ1NpZ25VcFBhc3N3b3JkJzpcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgcGFzc3dvcmQ6IHRhclxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICAgICBjYXNlICdTaWduVXBGaXJzdG5hbWUnOlxyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBmaXJzdE5hbWU6IHRhclxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICAgICBjYXNlICdTaWduVXBMYXN0bmFtZSc6XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIGxhc3ROYW1lOiB0YXJcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZW50ZXJOZXdVc2VyKCkge1xyXG4gICAgaWYgKCF0aGlzLnN0YXRlLnVzZXJuYW1lLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBlcnJvck1zZzogJ3BsZWFzZSBlbnRlciBhIHVzZXJuYW1lJ1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAoIXRoaXMuc3RhdGUucGFzc3dvcmQubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIGVycm9yTXNnOiAncGxlYXNlIGVudGVyIGEgcGFzc3dvcmQnXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmICghdGhpcy5zdGF0ZS5maXJzdE5hbWUubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIGVycm9yTXNnOiAncGxlYXNlIGVudGVyIHlvdXIgZmlyc3QgbmFtZSdcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKCF0aGlzLnN0YXRlLmxhc3ROYW1lLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBlcnJvck1zZzogJ3BsZWFzZSBlbnRlciB5b3VyIGxhc3QgbmFtZSdcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsZXQgdXNlck9iaiA9IHsgXHJcbiAgICAgICAgbmFtZTogdGhpcy5zdGF0ZS51c2VybmFtZSxcclxuICAgICAgICBwYXNzd29yZDogdGhpcy5zdGF0ZS5wYXNzd29yZCxcclxuICAgICAgICBmaXJzdE5hbWU6IHRoaXMuc3RhdGUuZmlyc3ROYW1lLFxyXG4gICAgICAgIGxhc3ROYW1lOiB0aGlzLnN0YXRlLmxhc3ROYW1lXHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkLnBvc3QoVXJsICsgJy9zaWdudXAnLCB1c2VyT2JqKVxyXG4gICAgICAudGhlbihyZXBvbnNlID0+IHtcclxuICAgICAgICAvL2FmdGVyIHNpZ251cCBzaG91bGQgcHJvbXB0IHVzZXIgdG8gc2VsZWN0IHRoZWlyIGZhdm9yaXRlIHRocmVlIG1vdmllc1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgZXJyb3JNc2c6ICcnLFxyXG4gICAgICAgICAgc3VjY2Vzc01zZzogJ25ldyBsb2dpbiBjcmVhdGVkJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMsJyB0aGlzJylcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy5jaGFuZ2VWaWV3cyhcIkhvbWVcIik7XHJcbiAgICAgICAgdGhpcy5wcm9wcy5zZXRDdXJyZW50VXNlcih0aGlzLnN0YXRlLnVzZXJuYW1lKTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGVycj0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgICAgZXJyb3JNc2c6ICd1c2VybmFtZSBhbHJlYWR5IGV4aXN0LCBwbGVhc2UgdXNlIGEgZGlmZmVyZW50IHVzZXJuYW1lJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgXHJcbiAgICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9J2xhbmRpbmcgcm93Jz5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9J2ljb24tYmxvY2sgY29sIHM3Jz5cclxuICAgICAgICA8aDIgY2xhc3NOYW1lPVwiaGVhZGVyIGxvZ29cIj5XZWxjb21lIHRvIFRoZU1vdmllQXBwPC9oMj5cclxuICAgICAgICA8aDUgY2xhc3NOYW1lPVwiaGVhZGVyIGNvbCBzMTIgbGlnaHQgZGVzY3JpcHRpb25cIj5cclxuICAgICAgICAgIExldHMgZmluZCB5b3VyIG5leHQgYnVkZHkgYnkgeW91ciBtb3ZpZSB0YXN0ZSFcclxuICAgICAgICA8L2g1PlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9J2xvZ2luIGljb24tYmxvY2snPlxyXG4gICAgICAgIDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXsoKSA9PiB0aGlzLnByb3BzLmNoYW5nZVZpZXdzKCdMb2dpbicpfT5HbyB0byBMb2cgSW48L2E+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvclwiPk9SPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2xvZ2luRm9ybSc+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWZpZWxkIGNvbCBzNlwiPlxyXG4gICAgICAgICAgICA8aW5wdXQgcGxhY2Vob2xkZXI9XCJ1c2VybmFtZVwiIGlkPVwidXNlcl9uYW1lXCIgbmFtZT0nU2lnblVwTmFtZScgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJ2YWxpZGF0ZVwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfS8+XHJcbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJ1c2VyX25hbWVcIiBjbGFzc05hbWU9XCJhY3RpdmVcIj5Vc2VybmFtZTwvbGFiZWw+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWZpZWxkIGNvbCBzNlwiPlxyXG4gICAgICAgICAgICA8aW5wdXQgcGxhY2Vob2xkZXI9XCJwYXNzd29yZFwiIGlkPVwicGFzc3dvcmRcIiBuYW1lPSdTaWduVXBQYXNzd29yZCcgdHlwZT1cInBhc3N3b3JkXCIgY2xhc3NOYW1lPVwidmFsaWRhdGVcIiBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKX0vPlxyXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwicGFzc3dvcmRcIiBjbGFzc05hbWU9XCJhY3RpdmVcIj5QYXNzd29yZDwvbGFiZWw+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWZpZWxkIGNvbCBzNlwiPlxyXG4gICAgICAgICAgICA8aW5wdXQgcGxhY2Vob2xkZXI9XCJmaXJzdCBuYW1lXCIgaWQ9XCJmaXJzdF9uYW1lXCIgbmFtZT0nU2lnblVwRmlyc3RuYW1lJyB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cInZhbGlkYXRlXCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyl9Lz5cclxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImZpcnN0X25hbWVcIiBjbGFzc05hbWU9XCJhY3RpdmVcIj5maXJzdCBuYW1lPC9sYWJlbD5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZmllbGQgY29sIHM2XCI+XHJcbiAgICAgICAgICAgIDxpbnB1dCBwbGFjZWhvbGRlcj1cImxhc3QgbmFtZVwiIGlkPVwibGFzdF9uYW1lXCIgbmFtZT0nU2lnblVwTGFzdG5hbWUnIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwidmFsaWRhdGVcIiBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKX0vPlxyXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwibGFzdF9uYW1lXCIgY2xhc3NOYW1lPVwiYWN0aXZlXCI+bGFzdCBuYW1lPC9sYWJlbD5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZXJyb3JNc2dcIj57dGhpcy5zdGF0ZS5lcnJvck1zZ308L2Rpdj5cclxuICAgICAgICAgIDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXt0aGlzLmVudGVyTmV3VXNlci5iaW5kKHRoaXMpfT5TaWduIFVwITwvYT5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj4pXHJcbiAgfVxyXG5cclxufVxyXG5cclxud2luZG93LlNpZ25VcCA9IFNpZ25VcDsiXX0=
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

      console.log("enu being run");
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

        $.post(Url + '/signup', userObj).then(function (response) {
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
            'Let\'s find your next buddy by your movie taste!'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1NpZ25VcC5qcyJdLCJuYW1lcyI6WyJTaWduVXAiLCJwcm9wcyIsInN0YXRlIiwidXNlcm5hbWUiLCJwYXNzd29yZCIsImZpcnN0TmFtZSIsImxhc3ROYW1lIiwiZXJyb3JNc2ciLCJzdWNjZXNzTXNnIiwiZXZlbnQiLCJ0YXIiLCJ0YXJnZXQiLCJ2YWx1ZSIsIm5hbWUiLCJzZXRTdGF0ZSIsImNvbnNvbGUiLCJsb2ciLCJsZW5ndGgiLCJ1c2VyT2JqIiwiJCIsInBvc3QiLCJVcmwiLCJ0aGVuIiwiY2hhbmdlVmlld3MiLCJzZXRDdXJyZW50VXNlciIsImNhdGNoIiwiZXJyIiwiaGFuZGxlQ2hhbmdlIiwiYmluZCIsImVudGVyTmV3VXNlciIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU1BLE07OztBQUVKLGtCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsZ0hBQ1hBLEtBRFc7O0FBR2pCLFVBQUtDLEtBQUwsR0FBYTtBQUNYQyxnQkFBVSxFQURDO0FBRVhDLGdCQUFVLEVBRkM7QUFHWEMsaUJBQVcsRUFIQTtBQUlYQyxnQkFBVSxFQUpDO0FBS1hDLGdCQUFVLEVBTEM7QUFNWEMsa0JBQVk7QUFORCxLQUFiO0FBSGlCO0FBV2xCOzs7O2lDQUVZQyxLLEVBQU87QUFDbEIsVUFBTUMsTUFBTUQsTUFBTUUsTUFBTixDQUFhQyxLQUF6QjtBQUNBLGNBQVFILE1BQU1FLE1BQU4sQ0FBYUUsSUFBckI7QUFDRSxhQUFLLFlBQUw7QUFDQSxlQUFLQyxRQUFMLENBQWM7QUFDWlgsc0JBQVVPO0FBREUsV0FBZDtBQUdBO0FBQ0MsYUFBSyxnQkFBTDtBQUNELGVBQUtJLFFBQUwsQ0FBYztBQUNaVixzQkFBVU07QUFERSxXQUFkO0FBR0E7QUFDQyxhQUFLLGlCQUFMO0FBQ0QsZUFBS0ksUUFBTCxDQUFjO0FBQ1pULHVCQUFXSztBQURDLFdBQWQ7QUFHQTtBQUNDLGFB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OztFQS9Ia0JFLE1BQU1DLFM7O0FBbUkzQkMsT0FBT2hDLE1BQVAsR0FBZ0JBLE1BQWhCIiwiZmlsZSI6IlNpZ25VcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNsYXNzIFNpZ25VcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XHJcbiAgICBzdXBlcihwcm9wcyk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgdXNlcm5hbWU6ICcnLFxyXG4gICAgICBwYXNzd29yZDogJycsXHJcbiAgICAgIGZpcnN0TmFtZTogJycsXHJcbiAgICAgIGxhc3ROYW1lOiAnJyxcclxuICAgICAgZXJyb3JNc2c6ICcnLFxyXG4gICAgICBzdWNjZXNzTXNnOiAnJ1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGhhbmRsZUNoYW5nZShldmVudCkge1xyXG4gICAgY29uc3QgdGFyID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgc3dpdGNoIChldmVudC50YXJnZXQubmFtZSl7XHJcbiAgICAgIGNhc2UgJ1NpZ25VcE5hbWUnOlxyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICB1c2VybmFtZTogdGFyXHJcbiAgICAgIH0pO1xyXG4gICAgICBicmVhaztcclxuICAgICAgIGNhc2UgJ1NpZ25VcFBhc3N3b3JkJzpcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgcGFzc3dvcmQ6IHRhclxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICAgICBjYXNlICdTaWduVXBGaXJzdG5hbWUnOlxyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBmaXJzdE5hbWU6IHRhclxyXG4gICAgICB9KTtcclxuICAgICAgYnJlYWs7XHJcbiAgICAgICBjYXNlICdTaWduVXBMYXN0bmFtZSc6XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIGxhc3ROYW1lOiB0YXJcclxuICAgICAgfSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZW50ZXJOZXdVc2VyKCkge1xyXG4gICAgY29uc29sZS5sb2coXCJlbnUgYmVpbmcgcnVuXCIpO1xyXG4gICAgaWYgKCF0aGlzLnN0YXRlLnVzZXJuYW1lLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBlcnJvck1zZzogJ3BsZWFzZSBlbnRlciBhIHVzZXJuYW1lJ1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAoIXRoaXMuc3RhdGUucGFzc3dvcmQubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIGVycm9yTXNnOiAncGxlYXNlIGVudGVyIGEgcGFzc3dvcmQnXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmICghdGhpcy5zdGF0ZS5maXJzdE5hbWUubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIGVycm9yTXNnOiAncGxlYXNlIGVudGVyIHlvdXIgZmlyc3QgbmFtZSdcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKCF0aGlzLnN0YXRlLmxhc3ROYW1lLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBlcnJvck1zZzogJ3BsZWFzZSBlbnRlciB5b3VyIGxhc3QgbmFtZSdcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsZXQgdXNlck9iaiA9IHsgXHJcbiAgICAgICAgbmFtZTogdGhpcy5zdGF0ZS51c2VybmFtZSxcclxuICAgICAgICBwYXNzd29yZDogdGhpcy5zdGF0ZS5wYXNzd29yZCxcclxuICAgICAgICBmaXJzdE5hbWU6IHRoaXMuc3RhdGUuZmlyc3ROYW1lLFxyXG4gICAgICAgIGxhc3ROYW1lOiB0aGlzLnN0YXRlLmxhc3ROYW1lXHJcbiAgICAgIH07XHJcblxyXG4gICAgICAkLnBvc3QoVXJsICsgJy9zaWdudXAnLCB1c2VyT2JqKVxyXG4gICAgICAudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgLy9hZnRlciBzaWdudXAgc2hvdWxkIHByb21wdCB1c2VyIHRvIHNlbGVjdCB0aGVpciBmYXZvcml0ZSB0aHJlZSBtb3ZpZXNcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgIGVycm9yTXNnOiAnJyxcclxuICAgICAgICAgIHN1Y2Nlc3NNc2c6ICduZXcgbG9naW4gY3JlYXRlZCdcclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLCcgdGhpcycpXHJcblxyXG4gICAgICAgIHRoaXMucHJvcHMuY2hhbmdlVmlld3MoXCJIb21lXCIpO1xyXG4gICAgICAgIHRoaXMucHJvcHMuc2V0Q3VycmVudFVzZXIodGhpcy5zdGF0ZS51c2VybmFtZSk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChlcnI9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZXJyKTtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgIGVycm9yTXNnOiAndXNlcm5hbWUgYWxyZWFkeSBleGlzdCwgcGxlYXNlIHVzZSBhIGRpZmZlcmVudCB1c2VybmFtZSdcclxuICAgICAgICB9KTtcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIFxyXG4gICAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPSdsYW5kaW5nIHJvdyc+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdpY29uLWJsb2NrIGNvbCBzNyc+XHJcbiAgICAgICAgPGgyIGNsYXNzTmFtZT1cImhlYWRlciBsb2dvXCI+V2VsY29tZSB0byBUaGVNb3ZpZUFwcDwvaDI+XHJcbiAgICAgICAgPGg1IGNsYXNzTmFtZT1cImhlYWRlciBjb2wgczEyIGxpZ2h0IGRlc2NyaXB0aW9uXCI+XHJcbiAgICAgICAgICBMZXQncyBmaW5kIHlvdXIgbmV4dCBidWRkeSBieSB5b3VyIG1vdmllIHRhc3RlIVxyXG4gICAgICAgIDwvaDU+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nbG9naW4gaWNvbi1ibG9jayc+XHJcbiAgICAgICAgPGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9eygpID0+IHRoaXMucHJvcHMuY2hhbmdlVmlld3MoJ0xvZ2luJyl9PkdvIHRvIExvZyBJbjwvYT5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9yXCI+T1I8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbG9naW5Gb3JtJz5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZmllbGQgY29sIHM2XCI+XHJcbiAgICAgICAgICAgIDxpbnB1dCBwbGFjZWhvbGRlcj1cInVzZXJuYW1lXCIgaWQ9XCJ1c2VyX25hbWVcIiBuYW1lPSdTaWduVXBOYW1lJyB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cInZhbGlkYXRlXCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyl9Lz5cclxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cInVzZXJfbmFtZVwiIGNsYXNzTmFtZT1cImFjdGl2ZVwiPlVzZXJuYW1lPC9sYWJlbD5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZmllbGQgY29sIHM2XCI+XHJcbiAgICAgICAgICAgIDxpbnB1dCBwbGFjZWhvbGRlcj1cInBhc3N3b3JkXCIgaWQ9XCJwYXNzd29yZFwiIG5hbWU9J1NpZ25VcFBhc3N3b3JkJyB0eXBlPVwicGFzc3dvcmRcIiBjbGFzc05hbWU9XCJ2YWxpZGF0ZVwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfS8+XHJcbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJwYXNzd29yZFwiIGNsYXNzTmFtZT1cImFjdGl2ZVwiPlBhc3N3b3JkPC9sYWJlbD5cclxuICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZmllbGQgY29sIHM2XCI+XHJcbiAgICAgICAgICAgIDxpbnB1dCBwbGFjZWhvbGRlcj1cImZpcnN0IG5hbWVcIiBpZD1cImZpcnN0X25hbWVcIiBuYW1lPSdTaWduVXBGaXJzdG5hbWUnIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwidmFsaWRhdGVcIiBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKX0vPlxyXG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwiZmlyc3RfbmFtZVwiIGNsYXNzTmFtZT1cImFjdGl2ZVwiPmZpcnN0IG5hbWU8L2xhYmVsPlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1maWVsZCBjb2wgczZcIj5cclxuICAgICAgICAgICAgPGlucHV0IHBsYWNlaG9sZGVyPVwibGFzdCBuYW1lXCIgaWQ9XCJsYXN0X25hbWVcIiBuYW1lPSdTaWduVXBMYXN0bmFtZScgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJ2YWxpZGF0ZVwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfS8+XHJcbiAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJsYXN0X25hbWVcIiBjbGFzc05hbWU9XCJhY3RpdmVcIj5sYXN0IG5hbWU8L2xhYmVsPlxyXG4gICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJlcnJvck1zZ1wiPnt0aGlzLnN0YXRlLmVycm9yTXNnfTwvZGl2PlxyXG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9e3RoaXMuZW50ZXJOZXdVc2VyLmJpbmQodGhpcyl9PlNpZ24gVXAhPC9hPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PilcclxuICB9XHJcblxyXG59XHJcblxyXG53aW5kb3cuU2lnblVwID0gU2lnblVwOyJdfQ==
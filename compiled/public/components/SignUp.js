'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SignUp = function (_React$Component) {
  _inherits(SignUp, _React$Component);

  function SignUp(props) {
    _classCallCheck(this, SignUp);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SignUp).call(this, props));

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
      if (this.state.username.length === 0) {
        this.setState({
          errorMsg: 'please enter a username'
        });
      } else if (this.state.password.length === 0) {
        this.setState({
          errorMsg: 'please enter a password'
        });
      } else if (this.state.firstName.length === 0) {
        this.setState({
          errorMsg: 'please enter your first name'
        });
      } else if (this.state.lastName.length === 0) {
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

        var that = this;

        $.post(Url + '/signup', userObj).then(function (reponse) {
          //after signup should prompt user to select their favorite three movies
          that.setState({
            errorMsg: '',
            successMsg: 'new login created'
          });

          that.props.onClick("Home");
          that.props.setCurrentUser(that.state.username);
        }).catch(function (err) {
          console.log(err);
          that.setState({
            errorMsg: 'username already exist, please use a different username'
          });
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var that = this;
      return React.createElement(
        'div',
        { className: 'landing row' },
        React.createElement(
          'div',
          { className: 'icon-block col s6' },
          React.createElement(
            'h2',
            { className: 'header logo' },
            'Movie Buddy'
          ),
          React.createElement(
            'h5',
            { className: 'header col s12 light description' },
            'Mea te nibh constituam, veritus convenire constituam ad quo, at cetero mandamus quo. Meliore salutandi percipitur et vel. In oratio soleat dissentiet eum. Vel an dolore numquam nusquam, mea ut essent integre denique, eos erat ocurreret gloriatur cu. Quod oratio forensibus eu ius, te periculis prodesset pri. His ne illum malis, duo te sententiae adipiscing.'
          )
        ),
        React.createElement(
          'div',
          { className: 'login icon-block' },
          React.createElement(
            'a',
            { className: 'waves-effect waves-light btn', onClick: function onClick() {
                return _this2.props.changeViews('Login');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1NpZ25VcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU0sTTs7O0FBRUosa0JBQVksS0FBWixFQUFtQjtBQUFBOztBQUFBLDBGQUNYLEtBRFc7O0FBR2pCLFVBQUssS0FBTCxHQUFhO0FBQ1gsZ0JBQVUsRUFEQztBQUVYLGdCQUFVLEVBRkM7QUFHWCxpQkFBVyxFQUhBO0FBSVgsZ0JBQVUsRUFKQztBQUtYLGdCQUFVLEVBTEM7QUFNWCxrQkFBWTtBQU5ELEtBQWI7QUFIaUI7QUFXbEI7Ozs7aUNBRVksSyxFQUFPO0FBQ2xCLFVBQUksTUFBTSxNQUFOLENBQWEsSUFBYixLQUFzQixZQUExQixFQUF3QztBQUN0QyxhQUFLLFFBQUwsQ0FBYztBQUNaLG9CQUFVLE1BQU0sTUFBTixDQUFhO0FBRFgsU0FBZDtBQUdELE9BSkQsTUFJTyxJQUFJLE1BQU0sTUFBTixDQUFhLElBQWIsS0FBc0IsZ0JBQTFCLEVBQTRDO0FBQ2pELGFBQUssUUFBTCxDQUFjO0FBQ1osb0JBQVUsTUFBTSxNQUFOLENBQWE7QUFEWCxTQUFkO0FBR0QsT0FKTSxNQUlBLElBQUksTUFBTSxNQUFOLENBQWEsSUFBYixLQUFzQixpQkFBMUIsRUFBNkM7QUFDbEQsYUFBSyxRQUFMLENBQWM7QUFDWixxQkFBVyxNQUFNLE1BQU4sQ0FBYTtBQURaLFNBQWQ7QUFHRCxPQUpNLE1BSUEsSUFBSSxNQUFNLE1BQU4sQ0FBYSxJQUFiLEtBQXNCLGdCQUExQixFQUE0QztBQUNqRCxhQUFLLFFBQUwsQ0FBYztBQUNaLG9CQUFVLE1BQU0sTUFBTixDQUFhO0FBRFgsU0FBZDtBQUdEO0FBQ0Y7OzttQ0FFYztBQUNiLFVBQUksS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixNQUFwQixLQUErQixDQUFuQyxFQUFzQztBQUNwQyxhQUFLLFFBQUwsQ0FBYztBQUNaLG9CQUFVO0FBREUsU0FBZDtBQUdELE9BSkQsTUFJTyxJQUFJLEtBQUss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TyxhQUFZLFlBQW5CLEVBQWdDLElBQUcsWUFBbkMsRUFBZ0QsTUFBSyxpQkFBckQsRUFBdUUsTUFBSyxNQUE1RSxFQUFtRixXQUFVLFVBQTdGLEVBQXdHLFVBQVUsS0FBSyxZQUFMLENBQWtCLElBQWxCLENBQXVCLElBQXZCLENBQWxILEdBREY7QUFFRTtBQUFBO0FBQUEsa0JBQU8sT0FBSSxZQUFYLEVBQXdCLFdBQVUsUUFBbEM7QUFBQTtBQUFBO0FBRkYsYUFYRjtBQWdCRTtBQUFBO0FBQUEsZ0JBQUssV0FBVSxvQkFBZjtBQUNFLDZDQUFPLGFBQVksV0FBbkIsRUFBK0IsSUFBRyxXQUFsQyxFQUE4QyxNQUFLLGdCQUFuRCxFQUFvRSxNQUFLLE1BQXpFLEVBQWdGLFdBQVUsVUFBMUYsRUFBcUcsVUFBVSxLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FBL0csR0FERjtBQUVFO0FBQUE7QUFBQSxrQkFBTyxPQUFJLFdBQVgsRUFBdUIsV0FBVSxRQUFqQztBQUFBO0FBQUE7QUFGRixhQWhCRjtBQXFCRTtBQUFBO0FBQUEsZ0JBQUssV0FBVSxVQUFmO0FBQTJCLG1CQUFLLEtBQUwsQ0FBVztBQUF0QyxhQXJCRjtBQXNCRTtBQUFBO0FBQUEsZ0JBQUcsV0FBVSw4QkFBYixFQUE0QyxTQUFTLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixJQUF2QixDQUFyRDtBQUFBO0FBQUE7QUF0QkY7QUFIRjtBQVBGLE9BREE7QUFxQ0Q7Ozs7RUF6SGtCLE1BQU0sUzs7QUE2SDNCLE9BQU8sTUFBUCxHQUFnQixNQUFoQiIsImZpbGUiOiJTaWduVXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBTaWduVXAgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHVzZXJuYW1lOiAnJyxcbiAgICAgIHBhc3N3b3JkOiAnJyxcbiAgICAgIGZpcnN0TmFtZTogJycsXG4gICAgICBsYXN0TmFtZTogJycsXG4gICAgICBlcnJvck1zZzogJycsXG4gICAgICBzdWNjZXNzTXNnOiAnJ1xuICAgIH07XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQudGFyZ2V0Lm5hbWUgPT09ICdTaWduVXBOYW1lJykge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHVzZXJuYW1lOiBldmVudC50YXJnZXQudmFsdWVcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQudGFyZ2V0Lm5hbWUgPT09ICdTaWduVXBQYXNzd29yZCcpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBwYXNzd29yZDogZXZlbnQudGFyZ2V0LnZhbHVlXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGV2ZW50LnRhcmdldC5uYW1lID09PSAnU2lnblVwRmlyc3RuYW1lJykge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGZpcnN0TmFtZTogZXZlbnQudGFyZ2V0LnZhbHVlXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGV2ZW50LnRhcmdldC5uYW1lID09PSAnU2lnblVwTGFzdG5hbWUnKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbGFzdE5hbWU6IGV2ZW50LnRhcmdldC52YWx1ZVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZW50ZXJOZXdVc2VyKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnVzZXJuYW1lLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGVycm9yTXNnOiAncGxlYXNlIGVudGVyIGEgdXNlcm5hbWUnXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUucGFzc3dvcmQubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZXJyb3JNc2c6ICdwbGVhc2UgZW50ZXIgYSBwYXNzd29yZCdcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5maXJzdE5hbWUubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZXJyb3JNc2c6ICdwbGVhc2UgZW50ZXIgeW91ciBmaXJzdCBuYW1lJ1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLmxhc3ROYW1lLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGVycm9yTXNnOiAncGxlYXNlIGVudGVyIHlvdXIgbGFzdCBuYW1lJ1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1c2VyT2JqID0geyBcbiAgICAgICAgbmFtZTogdGhpcy5zdGF0ZS51c2VybmFtZSxcbiAgICAgICAgcGFzc3dvcmQ6IHRoaXMuc3RhdGUucGFzc3dvcmQsXG4gICAgICAgIGZpcnN0TmFtZTogdGhpcy5zdGF0ZS5maXJzdE5hbWUsXG4gICAgICAgIGxhc3ROYW1lOiB0aGlzLnN0YXRlLmxhc3ROYW1lXG4gICAgICB9O1xuXG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICQucG9zdChVcmwgKyAnL3NpZ251cCcsIHVzZXJPYmopXG4gICAgICAudGhlbihmdW5jdGlvbihyZXBvbnNlKSB7XG4gICAgICAgIC8vYWZ0ZXIgc2lnbnVwIHNob3VsZCBwcm9tcHQgdXNlciB0byBzZWxlY3QgdGhlaXIgZmF2b3JpdGUgdGhyZWUgbW92aWVzXG4gICAgICAgIHRoYXQuc2V0U3RhdGUoe1xuICAgICAgICAgIGVycm9yTXNnOiAnJyxcbiAgICAgICAgICBzdWNjZXNzTXNnOiAnbmV3IGxvZ2luIGNyZWF0ZWQnXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoYXQucHJvcHMub25DbGljayhcIkhvbWVcIik7XG4gICAgICAgIHRoYXQucHJvcHMuc2V0Q3VycmVudFVzZXIodGhhdC5zdGF0ZS51c2VybmFtZSk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICB0aGF0LnNldFN0YXRlKHtcbiAgICAgICAgICBlcnJvck1zZzogJ3VzZXJuYW1lIGFscmVhZHkgZXhpc3QsIHBsZWFzZSB1c2UgYSBkaWZmZXJlbnQgdXNlcm5hbWUnXG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9J2xhbmRpbmcgcm93Jz5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdpY29uLWJsb2NrIGNvbCBzNic+XG4gICAgICAgIDxoMiBjbGFzc05hbWU9XCJoZWFkZXIgbG9nb1wiPk1vdmllIEJ1ZGR5PC9oMj5cbiAgICAgICAgPGg1IGNsYXNzTmFtZT1cImhlYWRlciBjb2wgczEyIGxpZ2h0IGRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgTWVhIHRlIG5pYmggY29uc3RpdHVhbSwgdmVyaXR1cyBjb252ZW5pcmUgY29uc3RpdHVhbSBhZCBxdW8sIGF0IGNldGVybyBtYW5kYW11cyBxdW8uIE1lbGlvcmUgc2FsdXRhbmRpIHBlcmNpcGl0dXIgZXQgdmVsLiBJbiBvcmF0aW8gc29sZWF0IGRpc3NlbnRpZXQgZXVtLiBWZWwgYW4gZG9sb3JlIG51bXF1YW0gbnVzcXVhbSwgbWVhIHV0IGVzc2VudCBpbnRlZ3JlIGRlbmlxdWUsIGVvcyBlcmF0IG9jdXJyZXJldCBnbG9yaWF0dXIgY3UuIFF1b2Qgb3JhdGlvIGZvcmVuc2lidXMgZXUgaXVzLCB0ZSBwZXJpY3VsaXMgcHJvZGVzc2V0IHByaS4gSGlzIG5lIGlsbHVtIG1hbGlzLCBkdW8gdGUgc2VudGVudGlhZSBhZGlwaXNjaW5nLlxuICAgICAgICA8L2g1PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nbG9naW4gaWNvbi1ibG9jayc+XG4gICAgICAgIDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXsoKSA9PiB0aGlzLnByb3BzLmNoYW5nZVZpZXdzKCdMb2dpbicpfT5HbyB0byBMb2cgSW48L2E+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JcIj4tLS0tLS0tLS0tIE9SIC0tLS0tLS0tLS0tPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdsb2dpbkZvcm0nPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZmllbGQgY29sIHM2XCI+XG4gICAgICAgICAgICA8aW5wdXQgcGxhY2Vob2xkZXI9XCJ1c2VybmFtZVwiIGlkPVwidXNlcl9uYW1lXCIgbmFtZT0nU2lnblVwTmFtZScgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJ2YWxpZGF0ZVwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfS8+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwidXNlcl9uYW1lXCIgY2xhc3NOYW1lPVwiYWN0aXZlXCI+VXNlcm5hbWU8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1maWVsZCBjb2wgczZcIj5cbiAgICAgICAgICAgIDxpbnB1dCBwbGFjZWhvbGRlcj1cInBhc3N3b3JkXCIgaWQ9XCJwYXNzd29yZFwiIG5hbWU9J1NpZ25VcFBhc3N3b3JkJyB0eXBlPVwicGFzc3dvcmRcIiBjbGFzc05hbWU9XCJ2YWxpZGF0ZVwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfS8+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwicGFzc3dvcmRcIiBjbGFzc05hbWU9XCJhY3RpdmVcIj5QYXNzd29yZDwvbGFiZWw+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWZpZWxkIGNvbCBzNlwiPlxuICAgICAgICAgICAgPGlucHV0IHBsYWNlaG9sZGVyPVwiZmlyc3QgbmFtZVwiIGlkPVwiZmlyc3RfbmFtZVwiIG5hbWU9J1NpZ25VcEZpcnN0bmFtZScgdHlwZT1cInRleHRcIiBjbGFzc05hbWU9XCJ2YWxpZGF0ZVwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfS8+XG4gICAgICAgICAgICA8bGFiZWwgZm9yPVwiZmlyc3RfbmFtZVwiIGNsYXNzTmFtZT1cImFjdGl2ZVwiPmZpcnN0IG5hbWU8L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1maWVsZCBjb2wgczZcIj5cbiAgICAgICAgICAgIDxpbnB1dCBwbGFjZWhvbGRlcj1cImxhc3QgbmFtZVwiIGlkPVwibGFzdF9uYW1lXCIgbmFtZT0nU2lnblVwTGFzdG5hbWUnIHR5cGU9XCJ0ZXh0XCIgY2xhc3NOYW1lPVwidmFsaWRhdGVcIiBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKX0vPlxuICAgICAgICAgICAgPGxhYmVsIGZvcj1cImxhc3RfbmFtZVwiIGNsYXNzTmFtZT1cImFjdGl2ZVwiPmxhc3QgbmFtZTwvbGFiZWw+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImVycm9yTXNnXCI+e3RoaXMuc3RhdGUuZXJyb3JNc2d9PC9kaXY+XG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9e3RoaXMuZW50ZXJOZXdVc2VyLmJpbmQodGhpcyl9PlNpZ24gVXAhPC9hPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PilcbiAgfVxuXG59XG5cbndpbmRvdy5TaWduVXAgPSBTaWduVXA7Il19
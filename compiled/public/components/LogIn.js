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
      var tar = event.target.value;
      if (event.target.name === 'LogInName') {
        this.setState({
          username: tar
        });
      } else {
        this.setState({
          password: tar
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
        var userObj = {
          name: this.state.username,
          password: this.state.password
        };

        $.post(Url + '/login', userObj).then(function (response) {
          if (response[0] === 'it worked') {
            console.log('hi');

            _this2.setState({
              errorMsg: ''
            });

            _this2.props.changeViews('Home');
            _this2.props.setCurrentUser(response[1]);
          }
          console.log('this.state.view after state is set again', _this2.state.view);
        }).catch(function (err) {
          console.log(err);
          _this2.setState({
            errorMsg: 'invalid login information'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0xvZ0luLmpzIl0sIm5hbWVzIjpbIkxvZ0luIiwicHJvcHMiLCJzdGF0ZSIsInVzZXJuYW1lIiwicGFzc3dvcmQiLCJlcnJvck1zZyIsImV2ZW50IiwidGFyIiwidGFyZ2V0IiwidmFsdWUiLCJuYW1lIiwic2V0U3RhdGUiLCJsZW5ndGgiLCJ1c2VyT2JqIiwiJCIsInBvc3QiLCJVcmwiLCJ0aGVuIiwicmVzcG9uc2UiLCJjb25zb2xlIiwibG9nIiwiY2hhbmdlVmlld3MiLCJzZXRDdXJyZW50VXNlciIsInZpZXciLCJjYXRjaCIsImVyciIsImhhbmRsZUNoYW5nZSIsImJpbmQiLCJoYW5kbGVMb2dJbiIsIlJlYWN0IiwiQ29tcG9uZW50Iiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0lBQU1BLEs7OztBQUVKLGlCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUEsOEdBQ1hBLEtBRFc7O0FBR2pCLFVBQUtDLEtBQUwsR0FBYTtBQUNYQyxnQkFBVSxFQURDO0FBRVhDLGdCQUFVLEVBRkM7QUFHWEMsZ0JBQVU7QUFIQyxLQUFiO0FBSGlCO0FBUWxCOzs7O2lDQUVZQyxLLEVBQU87QUFDbEIsVUFBTUMsTUFBSUQsTUFBTUUsTUFBTixDQUFhQyxLQUF2QjtBQUNBLFVBQUlILE1BQU1FLE1BQU4sQ0FBYUUsSUFBYixLQUFzQixXQUExQixFQUF1QztBQUNyQyxhQUFLQyxRQUFMLENBQWM7QUFDWlIsb0JBQVVJO0FBREUsU0FBZDtBQUdELE9BSkQsTUFJTztBQUNMLGFBQUtJLFFBQUwsQ0FBYztBQUNaUCxvQkFBVUc7QUFERSxTQUFkO0FBR0Q7QUFDRjs7O2tDQUVhO0FBQUE7O0FBQ1osVUFBSSxDQUFDLEtBQUtMLEtBQUwsQ0FBV0MsUUFBWCxDQUFvQlMsTUFBckIsSUFBK0IsQ0FBQyxLQUFLVixLQUFMLENBQVdFLFFBQVgsQ0FBb0JRLE1BQXhELEVBQWdFO0FBQzlELGFBQUtELFFBQUwsQ0FBYztBQUNa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LDhCQUFiLEVBQTRDLFNBQVMsS0FBS3VCLFdBQUwsQ0FBaUJELElBQWpCLENBQXNCLElBQXRCLENBQXJEO0FBQUE7QUFBQTtBQVhGO0FBSEY7QUFQRixPQURGO0FBMEJEOzs7O0VBaEdpQkUsTUFBTUMsUzs7QUFtRzFCQyxPQUFPL0IsS0FBUCxHQUFlQSxLQUFmIiwiZmlsZSI6IkxvZ0luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgTG9nSW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgc3VwZXIocHJvcHMpO1xyXG5cclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIHVzZXJuYW1lOiAnJyxcclxuICAgICAgcGFzc3dvcmQ6ICcnLFxyXG4gICAgICBlcnJvck1zZzogJydcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBoYW5kbGVDaGFuZ2UoZXZlbnQpIHtcclxuICAgIGNvbnN0IHRhcj1ldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICBpZiAoZXZlbnQudGFyZ2V0Lm5hbWUgPT09ICdMb2dJbk5hbWUnKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIHVzZXJuYW1lOiB0YXJcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBwYXNzd29yZDogdGFyXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaGFuZGxlTG9nSW4oKSB7XHJcbiAgICBpZiAoIXRoaXMuc3RhdGUudXNlcm5hbWUubGVuZ3RoICYmICF0aGlzLnN0YXRlLnBhc3N3b3JkLmxlbmd0aCkge1xyXG4gICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICBlcnJvck1zZzogJ2xvZ2luIGlzIGVtcHR5J1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAoIXRoaXMuc3RhdGUudXNlcm5hbWUubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xyXG4gICAgICAgIGVycm9yTXNnOiAncGxlYXNlIGVudGVyIGEgdXNlcm5hbWUnXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmICghdGhpcy5zdGF0ZS5wYXNzd29yZC5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgZXJyb3JNc2c6ICdwbGVhc2UgZW50ZXIgYSBwYXNzd29yZCdcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsZXQgdXNlck9iaiA9IHsgXHJcbiAgICAgICAgbmFtZTogdGhpcy5zdGF0ZS51c2VybmFtZSxcclxuICAgICAgICBwYXNzd29yZDogdGhpcy5zdGF0ZS5wYXNzd29yZFxyXG4gICAgICB9O1xyXG5cclxuXHJcbiAgICAgICQucG9zdChVcmwgKyAnL2xvZ2luJywgdXNlck9iailcclxuICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgIGlmIChyZXNwb25zZVswXSA9PT0gJ2l0IHdvcmtlZCcpIHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdoaScpO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcclxuICAgICAgICAgICAgZXJyb3JNc2c6ICcnXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICB0aGlzLnByb3BzLmNoYW5nZVZpZXdzKCdIb21lJyk7XHJcbiAgICAgICAgICB0aGlzLnByb3BzLnNldEN1cnJlbnRVc2VyKHJlc3BvbnNlWzFdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgIGNvbnNvbGUubG9nKCd0aGlzLnN0YXRlLnZpZXcgYWZ0ZXIgc3RhdGUgaXMgc2V0IGFnYWluJyx0aGlzLnN0YXRlLnZpZXcpO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZXJyPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICBlcnJvck1zZzogJ2ludmFsaWQgbG9naW4gaW5mb3JtYXRpb24nXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPGRpdiBjbGFzc05hbWU9J2xhbmRpbmcgcm93Jz5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0naWNvbi1ibG9jayBjb2wgczcnPlxyXG4gICAgICAgICAgPGgyIGNsYXNzTmFtZT1cImhlYWRlciBsb2dvXCI+V2VsY29tZSB0byBUaGVNb3ZpZUFwcDwvaDI+XHJcbiAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwiaGVhZGVyIGNvbCBzMTIgbGlnaHQgZGVzY3JpcHRpb25cIj5cclxuICAgICAgICAgICAgTGV0J3MgZmluZCB5b3VyIG5leHQgYnVkZHkgYnkgeW91ciBtb3ZpZSB0YXN0ZSFcclxuICAgICAgICAgIDwvaDU+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2xvZ2luIGljb24tYmxvY2snPlxyXG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9eygpID0+IHRoaXMucHJvcHMuY2hhbmdlVmlld3MoJ1NpZ25VcCcpfT5HbyB0byBTaWduIFVwPC9hPlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvclwiPk9SPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbG9naW5Gb3JtJz5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbnB1dC1maWVsZCBjb2wgczZcIj5cclxuICAgICAgICAgICAgICA8aW5wdXQgcGxhY2Vob2xkZXI9XCJ1c2VybmFtZVwiIGlkPVwidXNlcl9uYW1lXCIgbmFtZT0nTG9nSW5OYW1lJyB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cInZhbGlkYXRlXCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyl9Lz5cclxuICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwidXNlcl9uYW1lXCIgY2xhc3NOYW1lPVwiYWN0aXZlXCI+VXNlcm5hbWU8L2xhYmVsPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZmllbGQgY29sIHM2XCI+XHJcbiAgICAgICAgICAgICAgPGlucHV0IHBsYWNlaG9sZGVyPVwicGFzc3dvcmRcIiBpZD1cInBhc3N3b3JkXCIgbmFtZT0nTG9nSW5QYXNzd29yZCcgdHlwZT1cInBhc3N3b3JkXCIgY2xhc3NOYW1lPVwidmFsaWRhdGVcIiBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKX0vPlxyXG4gICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJwYXNzd29yZFwiIGNsYXNzTmFtZT1cImFjdGl2ZVwiPlBhc3N3b3JkPC9sYWJlbD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZXJyb3JNc2dcIj57dGhpcy5zdGF0ZS5lcnJvck1zZ308L2Rpdj5cclxuICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlTG9nSW4uYmluZCh0aGlzKX0+bG9nIGluPC9hPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PilcclxuICB9XHJcbn1cclxuXHJcbndpbmRvdy5Mb2dJbiA9IExvZ0luO1xyXG4iXX0=
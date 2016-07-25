'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LogIn = function (_React$Component) {
  _inherits(LogIn, _React$Component);

  function LogIn(props) {
    _classCallCheck(this, LogIn);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LogIn).call(this, props));

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
          { className: 'icon-block col s6' },
          React.createElement(
            'h2',
            { className: 'header logo' },
            'TheMovieApp'
          ),
          React.createElement(
            'h5',
            { className: 'header col s12 light description' },
            'TheMovieApp is the premier Movie App of the 21st Century.'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0xvZ0luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFBTSxLOzs7QUFFSixpQkFBWSxLQUFaLEVBQW1CO0FBQUE7O0FBQUEseUZBQ1gsS0FEVzs7QUFHakIsVUFBSyxLQUFMLEdBQWE7QUFDWCxnQkFBVSxFQURDO0FBRVgsZ0JBQVUsRUFGQztBQUdYLGdCQUFVO0FBSEMsS0FBYjtBQUhpQjtBQVFsQjs7OztpQ0FFWSxLLEVBQU87QUFDbEIsVUFBSSxNQUFNLE1BQU4sQ0FBYSxJQUFiLEtBQXNCLFdBQTFCLEVBQXVDO0FBQ3JDLGFBQUssUUFBTCxDQUFjO0FBQ1osb0JBQVUsTUFBTSxNQUFOLENBQWE7QUFEWCxTQUFkO0FBR0QsT0FKRCxNQUlPO0FBQ0wsYUFBSyxRQUFMLENBQWM7QUFDWixvQkFBVSxNQUFNLE1BQU4sQ0FBYTtBQURYLFNBQWQ7QUFHRDtBQUNGOzs7a0NBRWE7QUFDWixVQUFJLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsTUFBcEIsS0FBK0IsQ0FBL0IsSUFBb0MsS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixNQUFwQixLQUErQixDQUF2RSxFQUEwRTtBQUN4RSxhQUFLLFFBQUwsQ0FBYztBQUNaLG9CQUFVO0FBREUsU0FBZDtBQUdELE9BSkQsTUFJTyxJQUFJLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsTUFBcEIsS0FBK0IsQ0FBbkMsRUFBc0M7QUFDM0MsYUFBSyxRQUFMLENBQWM7QUFDWixvQkFBVTtBQURFLFNBQWQ7QUFHRCxPQUpNLE1BSUEsSUFBSSxLQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLE1BQXBCLEtBQStCLENBQW5DLEVBQXNDO0FBQzNDLGFBQUssUUFBTCxDQUFjO0FBQ1osb0JBQVU7QUFERSxTQUFkO0FBR0QsT0FKTSxNQUlBO0FBQ0wsWUFBSSxVQUFVO0FBQ1osZ0JBQU0sS0FBSyxLQUFMLENBQVcsUUFETDtBQUVaLG9CQUFVLEtBQUssS0FBTCxDQUFXO0FBRlQsU0FBZDs7QUFLQSxZQUFJLE9BQU8sSUFBWDs7QUFFQSxVQUFFLElBQUYsQ0FBTyxNQUFNLFFBQWIsRUFBdUIsT0FBdkIsRUFDQyxJQURELENBQ00sVUFBUyxRQUFULEVBQW1CO0FBQ3ZCLGNBQUksU0FBUyxDQUFULE1BQWdCLFdBQXBCLEVBQWlDO0FBQy9CLG9CQUFRLEdBQVIsQ0FBWSxJQUFaOztBQUVBLGlCQUFLLFFBQUwsQ0FBYztBQUNaLHdCQUFVO0FBREUsYUFBZDs7QUFJQSxpQkFBSyxLQUFMLENBQVcsV0FBWCxDQUF1QixNQUF2QjtBQUNBLGlCQUFLLEtBQUwsQ0FBVyxjQUFYLENBQTBCLFNBQVMsQ0FBVCxDQUExQjtBQUNEO0FBQ0Esa0JBQVEsR0FBUixDQUFZLDBDQUFaLEVBQXVELEtBQUssS0FBTCxDQUFXLElBQWxFO0FBQ0YsU0FiRCxFQWNDLEtBZEQsQ0FjTyxVQUFTLEdBQVQsRUFBYztBQUNuQixrQkFBUSxHQUFSLENBQVksR0FBWjtBQUNBLGVBQUssUUFBTCxDQUFjO0FBQ1osc0JBQVU7QUFERSxXQUFkO0FBR0QsU0FuQkQ7QUFvQkQ7QUFDRjs7OzZCQUdRO0FBQUE7O0FBQ1AsYUFDRTtBQUFBO0FBQUEsVUFBSyxXQUFVLGFBQWY7QUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLG1CQUFmO0FBQ0U7QUFBQTtBQUFBLGNBQUksV0FBVSxhQUFkO0FBQUE7QUFBQSxXQURGO0FBRUU7QUFBQTtBQUFBLGNBQUksV0FBVSxrQ0FBZDtBQUFBO0FBQUE7QUFGRixTQURGO0FBT0U7QUFBQTtBQUFBLFlBQUssV0FBVSxrQkFBZjtBQUNFO0FBQUE7QUFBQSxjQUFHLFdBQVUsOEJBQWIsRUFBNEMsU0FBUztBQUFBLHVCQUFNLE9BQUssS0FBTCxDQUFXLFdBQVgsQ0FBdUIsUUFBdkIsQ0FBTjtBQUFBLGVBQXJEO0FBQUE7QUFBQSxXQURGO0FBRUU7QUFBQTtBQUFBLGNBQUssV0FBVSxJQUFmO0FBQUE7QUFBQSxXQUZGO0FBR0U7QUFBQTtBQUFBLGNBQUssV0FBVSxXQUFmO0FBQ0U7QUFBQTtBQUFBLGdCQUFLLFdBQVUsb0JBQWY7QUFDRSw2Q0FBTyxhQUFZLFVBQW5CLEVBQThCLElBQUcsV0FBakMsRUFBNkMsTUFBSyxXQUFsRCxFQUE4RCxNQUFLLE1BQW5FLEVBQTBFLFdBQVUsVUFBcEYsRUFBK0YsVUFBVSxLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FBekcsR0FERjtBQUVFO0FBQUE7QUFBQSxrQkFBTyxPQUFJLFdBQVgsRUFBdUIsV0FBVSxRQUFqQztBQUFBO0FBQUE7QUFGRixhQURGO0FBTUU7QUFBQTtBQUFBLGdCQUFLLFdBQVUsb0JBQWY7QUFDRSw2Q0FBTyxhQUFZLFVBQW5CLEVBQThCLElBQUcsVUFBakMsRUFBNEMsTUFBSyxlQUFqRCxFQUFpRSxNQUFLLFVBQXRFLEVBQWlGLFdBQVUsVUFBM0YsRUFBc0csVUFBVSxLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsSUFBdkIsQ0FBaEgsR0FERjtBQUVFO0FBQUE7QUFBQSxrQkFBTyxPQUFJLFVBQVgsRUFBc0IsV0FBVSxRQUFoQztBQUFBO0FBQUE7QUFGRixhQU5GO0FBVUU7QUFBQTtBQUFBLGdCQUFLLFdBQVUsVUFBZjtBQUEyQixtQkFBSyxLQUFMLENBQVc7QUFBdEMsYUFWRjtBQVdFO0FBQUE7QUFBQSxnQkFBRyxXQUFVLDhCQUFiLEVBQTRDLFNBQVMsS0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLElBQXRCLENBQXJEO0FBQUE7QUFBQTtBQVhGO0FBSEY7QUFQRixPQURGO0FBMEJEOzs7O0VBaEdpQixNQUFNLFM7O0FBbUcxQixPQUFPLEtBQVAsR0FBZSxLQUFmIiwiZmlsZSI6IkxvZ0luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgTG9nSW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHVzZXJuYW1lOiAnJyxcbiAgICAgIHBhc3N3b3JkOiAnJyxcbiAgICAgIGVycm9yTXNnOiAnJ1xuICAgIH07XG4gIH1cblxuICBoYW5kbGVDaGFuZ2UoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQudGFyZ2V0Lm5hbWUgPT09ICdMb2dJbk5hbWUnKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgdXNlcm5hbWU6IGV2ZW50LnRhcmdldC52YWx1ZVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBwYXNzd29yZDogZXZlbnQudGFyZ2V0LnZhbHVlXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVMb2dJbigpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS51c2VybmFtZS5sZW5ndGggPT09IDAgJiYgdGhpcy5zdGF0ZS5wYXNzd29yZC5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBlcnJvck1zZzogJ2xvZ2luIGlzIGVtcHR5J1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnVzZXJuYW1lLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGVycm9yTXNnOiAncGxlYXNlIGVudGVyIGEgdXNlcm5hbWUnXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUucGFzc3dvcmQubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZXJyb3JNc2c6ICdwbGVhc2UgZW50ZXIgYSBwYXNzd29yZCdcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXNlck9iaiA9IHsgXG4gICAgICAgIG5hbWU6IHRoaXMuc3RhdGUudXNlcm5hbWUsXG4gICAgICAgIHBhc3N3b3JkOiB0aGlzLnN0YXRlLnBhc3N3b3JkXG4gICAgICB9O1xuXG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICQucG9zdChVcmwgKyAnL2xvZ2luJywgdXNlck9iailcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmIChyZXNwb25zZVswXSA9PT0gJ2l0IHdvcmtlZCcpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnaGknKTtcbiAgICAgICAgICBcbiAgICAgICAgICB0aGF0LnNldFN0YXRlKHtcbiAgICAgICAgICAgIGVycm9yTXNnOiAnJ1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGhhdC5wcm9wcy5jaGFuZ2VWaWV3cygnSG9tZScpO1xuICAgICAgICAgIHRoYXQucHJvcHMuc2V0Q3VycmVudFVzZXIocmVzcG9uc2VbMV0pO1xuICAgICAgICB9XG4gICAgICAgICBjb25zb2xlLmxvZygndGhpcy5zdGF0ZS52aWV3IGFmdGVyIHN0YXRlIGlzIHNldCBhZ2FpbicsdGhhdC5zdGF0ZS52aWV3KTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgIHRoYXQuc2V0U3RhdGUoe1xuICAgICAgICAgIGVycm9yTXNnOiAnaW52YWxpZCBsb2dpbiBpbmZvcm1hdGlvbidcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nbGFuZGluZyByb3cnPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0naWNvbi1ibG9jayBjb2wgczYnPlxuICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJoZWFkZXIgbG9nb1wiPlRoZU1vdmllQXBwPC9oMj5cbiAgICAgICAgICA8aDUgY2xhc3NOYW1lPVwiaGVhZGVyIGNvbCBzMTIgbGlnaHQgZGVzY3JpcHRpb25cIj5cbiAgICAgICAgICAgIFRoZU1vdmllQXBwIGlzIHRoZSBwcmVtaWVyIE1vdmllIEFwcCBvZiB0aGUgMjFzdCBDZW50dXJ5LlxuICAgICAgICAgIDwvaDU+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nbG9naW4gaWNvbi1ibG9jayc+XG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9eygpID0+IHRoaXMucHJvcHMuY2hhbmdlVmlld3MoJ1NpZ25VcCcpfT5HbyB0byBTaWduIFVwPC9hPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JcIj4tLS0tLS0tLS0tIE9SIC0tLS0tLS0tLS0tPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9J2xvZ2luRm9ybSc+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWZpZWxkIGNvbCBzNlwiPlxuICAgICAgICAgICAgICA8aW5wdXQgcGxhY2Vob2xkZXI9XCJ1c2VybmFtZVwiIGlkPVwidXNlcl9uYW1lXCIgbmFtZT0nTG9nSW5OYW1lJyB0eXBlPVwidGV4dFwiIGNsYXNzTmFtZT1cInZhbGlkYXRlXCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlLmJpbmQodGhpcyl9Lz5cbiAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cInVzZXJfbmFtZVwiIGNsYXNzTmFtZT1cImFjdGl2ZVwiPlVzZXJuYW1lPC9sYWJlbD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWZpZWxkIGNvbCBzNlwiPlxuICAgICAgICAgICAgICA8aW5wdXQgcGxhY2Vob2xkZXI9XCJwYXNzd29yZFwiIGlkPVwicGFzc3dvcmRcIiBuYW1lPSdMb2dJblBhc3N3b3JkJyB0eXBlPVwicGFzc3dvcmRcIiBjbGFzc05hbWU9XCJ2YWxpZGF0ZVwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZS5iaW5kKHRoaXMpfS8+XG4gICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJwYXNzd29yZFwiIGNsYXNzTmFtZT1cImFjdGl2ZVwiPlBhc3N3b3JkPC9sYWJlbD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJlcnJvck1zZ1wiPnt0aGlzLnN0YXRlLmVycm9yTXNnfTwvZGl2PlxuICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9e3RoaXMuaGFuZGxlTG9nSW4uYmluZCh0aGlzKX0+bG9nIGluPC9hPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PilcbiAgfVxufVxuXG53aW5kb3cuTG9nSW4gPSBMb2dJbjtcbiJdfQ==
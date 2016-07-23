'use strict';

var SignUp = function SignUp(props) {
  return React.createElement(
    'div',
    null,
    React.createElement(
      'p',
      { id: 'loginFields' },
      'Name'
    ),
    '  ',
    React.createElement('input', { type: 'text',
      id: 'SignUpName',
      name: 'SignUpName' }),
    React.createElement('br', null),
    React.createElement(
      'p',
      { id: 'loginFields' },
      'Password'
    ),
    ' ',
    React.createElement('input', { type: 'text',
      id: 'SignUpPassword',
      name: 'SignUpPassword' }),
    React.createElement('br', null),
    React.createElement(SignUpDrop, null),
    React.createElement(
      'div',
      { id: 'buttons2' },
      React.createElement(
        'button',
        { onClick: function onClick() {
            props.enterUser(document.getElementById('SignUpName').value, document.getElementById('SignUpPassword').value);
          } },
        ' Sign Up! '
      ),
      React.createElement(
        'button',
        { onClick: function onClick() {
            return props.onClick("Login");
          } },
        ' Log In Instead'
      )
    )
  );
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1NpZ25VcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksU0FBUyxTQUFULE1BQVMsQ0FBQyxLQUFEO0FBQUEsU0FFWDtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsUUFBRyxJQUFHLGFBQU47QUFBQTtBQUFBLEtBREY7QUFBQTtBQUNnQyxtQ0FBTyxNQUFPLE1BQWQ7QUFDOUIsVUFBSyxZQUR5QjtBQUU5QixZQUFPLFlBRnVCLEdBRGhDO0FBR3VCLG1DQUh2QjtBQUlFO0FBQUE7QUFBQSxRQUFHLElBQUcsYUFBTjtBQUFBO0FBQUEsS0FKRjtBQUFBO0FBSW1DLG1DQUFPLE1BQU8sTUFBZDtBQUNqQyxVQUFLLGdCQUQ0QjtBQUVqQyxZQUFPLGdCQUYwQixHQUpuQztBQU0yQixtQ0FOM0I7QUFRRSx3QkFBQyxVQUFELE9BUkY7QUFVRTtBQUFBO0FBQUEsUUFBSyxJQUFHLFVBQVI7QUFDRTtBQUFBO0FBQUEsVUFBUSxTQUNOLG1CQUFXO0FBQ1Qsa0JBQU0sU0FBTixDQUFnQixTQUFTLGNBQVQsQ0FBd0IsWUFBeEIsRUFBc0MsS0FBdEQsRUFBNkQsU0FBUyxjQUFULENBQXdCLGdCQUF4QixFQUEwQyxLQUF2RztBQUNELFdBSEg7QUFBQTtBQUFBLE9BREY7QUFNRTtBQUFBO0FBQUEsVUFBUSxTQUFTO0FBQUEsbUJBQ2QsTUFBTSxPQUFOLENBQWMsT0FBZCxDQURjO0FBQUEsV0FBakI7QUFBQTtBQUFBO0FBTkY7QUFWRixHQUZXO0FBQUEsQ0FBYiIsImZpbGUiOiJTaWduVXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgU2lnblVwID0gKHByb3BzKSA9PiAoXG5cbiAgPGRpdj5cbiAgICA8cCBpZD0nbG9naW5GaWVsZHMnPk5hbWU8L3A+ICA8aW5wdXQgdHlwZSA9ICd0ZXh0J1xuICAgIGlkID0gJ1NpZ25VcE5hbWUnXG4gICAgbmFtZSA9ICdTaWduVXBOYW1lJy8+PGJyLz5cbiAgICA8cCBpZD0nbG9naW5GaWVsZHMnPlBhc3N3b3JkPC9wPiA8aW5wdXQgdHlwZSA9ICd0ZXh0J1xuICAgIGlkID0gJ1NpZ25VcFBhc3N3b3JkJ1xuICAgIG5hbWUgPSAnU2lnblVwUGFzc3dvcmQnLz48YnIvPiBcblxuICAgIDxTaWduVXBEcm9wIC8+XG5cbiAgICA8ZGl2IGlkPSdidXR0b25zMic+XG4gICAgICA8YnV0dG9uIG9uQ2xpY2sgPSB7XG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHByb3BzLmVudGVyVXNlcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnU2lnblVwTmFtZScpLnZhbHVlLCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnU2lnblVwUGFzc3dvcmQnKS52YWx1ZSlcbiAgICAgICAgfVxuICAgICAgfT4gU2lnbiBVcCEgPC9idXR0b24+XG4gICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IFxuICAgICAgICAocHJvcHMub25DbGljayhcIkxvZ2luXCIpKX0+IExvZyBJbiBJbnN0ZWFkXG4gICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj4gXG4gIDwvZGl2PlxuXG4pXG4iXX0=
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1NpZ25VcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksU0FBUyxTQUFULE1BQVMsQ0FBQyxLQUFEO0FBQUEsU0FFWDtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsUUFBRyxJQUFHLGFBQU47QUFBQTtBQUFBLEtBREY7QUFBQTtBQUNnQyxtQ0FBTyxNQUFPLE1BQWQ7QUFDOUIsVUFBSyxZQUR5QjtBQUU5QixZQUFPLFlBRnVCLEdBRGhDO0FBR3VCLG1DQUh2QjtBQUlFO0FBQUE7QUFBQSxRQUFHLElBQUcsYUFBTjtBQUFBO0FBQUEsS0FKRjtBQUFBO0FBSW1DLG1DQUFPLE1BQU8sTUFBZDtBQUNqQyxVQUFLLGdCQUQ0QjtBQUVqQyxZQUFPLGdCQUYwQixHQUpuQztBQU0yQixtQ0FOM0I7QUFRRTtBQUFBO0FBQUEsUUFBSyxJQUFHLFVBQVI7QUFDRTtBQUFBO0FBQUEsVUFBUSxTQUNOLG1CQUFXO0FBQ1Qsa0JBQU0sU0FBTixDQUFnQixTQUFTLGNBQVQsQ0FBd0IsWUFBeEIsRUFBc0MsS0FBdEQsRUFBNkQsU0FBUyxjQUFULENBQXdCLGdCQUF4QixFQUEwQyxLQUF2RztBQUNELFdBSEg7QUFBQTtBQUFBLE9BREY7QUFNRTtBQUFBO0FBQUEsVUFBUSxTQUFTO0FBQUEsbUJBQ2QsTUFBTSxPQUFOLENBQWMsT0FBZCxDQURjO0FBQUEsV0FBakI7QUFBQTtBQUFBO0FBTkY7QUFSRixHQUZXO0FBQUEsQ0FBYiIsImZpbGUiOiJTaWduVXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgU2lnblVwID0gKHByb3BzKSA9PiAoXG5cbiAgPGRpdj5cbiAgICA8cCBpZD0nbG9naW5GaWVsZHMnPk5hbWU8L3A+ICA8aW5wdXQgdHlwZSA9ICd0ZXh0J1xuICAgIGlkID0gJ1NpZ25VcE5hbWUnXG4gICAgbmFtZSA9ICdTaWduVXBOYW1lJy8+PGJyLz5cbiAgICA8cCBpZD0nbG9naW5GaWVsZHMnPlBhc3N3b3JkPC9wPiA8aW5wdXQgdHlwZSA9ICd0ZXh0J1xuICAgIGlkID0gJ1NpZ25VcFBhc3N3b3JkJ1xuICAgIG5hbWUgPSAnU2lnblVwUGFzc3dvcmQnLz48YnIvPiBcblxuICAgIDxkaXYgaWQ9J2J1dHRvbnMyJz5cbiAgICAgIDxidXR0b24gb25DbGljayA9IHtcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcHJvcHMuZW50ZXJVc2VyKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdTaWduVXBOYW1lJykudmFsdWUsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdTaWduVXBQYXNzd29yZCcpLnZhbHVlKVxuICAgICAgICB9XG4gICAgICB9PiBTaWduIFVwISA8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gXG4gICAgICAgIChwcm9wcy5vbkNsaWNrKFwiTG9naW5cIikpfT4gTG9nIEluIEluc3RlYWRcbiAgICAgIDwvYnV0dG9uPlxuICAgIDwvZGl2PiBcbiAgPC9kaXY+XG5cbilcbiJdfQ==
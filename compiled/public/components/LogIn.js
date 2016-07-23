'use strict';

var LogIn = function LogIn(props) {
  return React.createElement(
    'div',
    { id: 'logInStyling' },
    React.createElement(
      'p',
      { id: 'loginFields' },
      'Name'
    ),
    ' ',
    React.createElement('input', { type: 'text',
      id: 'LogInName',
      name: 'LogInName' }),
    ' ',
    React.createElement('br', null),
    React.createElement(
      'p',
      { id: 'loginFields' },
      'Password'
    ),
    ' ',
    React.createElement('input', { type: 'text',
      id: 'LogInPassword',
      name: 'LogInPassword' }),
    ' ',
    React.createElement('br', null),
    React.createElement(
      'div',
      { id: 'buttons' },
      ' ',
      React.createElement(
        'button',
        { onClick: function onClick() {
            props.logInFunction(document.getElementById('LogInName').value, document.getElementById('LogInPassword').value);
          } },
        'Log In! '
      ),
      ' ',
      React.createElement(
        'button',
        { onClick: props.ourFunction },
        ' Sign Up Instead '
      )
    )
  );
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0xvZ0luLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxRQUFRLFNBQVIsS0FBUSxDQUFDLEtBQUQ7QUFBQSxTQUVWO0FBQUE7QUFBQSxNQUFNLElBQUcsY0FBVDtBQUNBO0FBQUE7QUFBQSxRQUFHLElBQUcsYUFBTjtBQUFBO0FBQUEsS0FEQTtBQUFBO0FBQzZCLG1DQUFRLE1BQU8sTUFBZjtBQUM3QixVQUFLLFdBRHdCO0FBRTdCLFlBQU8sV0FGc0IsR0FEN0I7QUFBQTtBQUd1QixtQ0FIdkI7QUFJQTtBQUFBO0FBQUEsUUFBRyxJQUFHLGFBQU47QUFBQTtBQUFBLEtBSkE7QUFBQTtBQUlpQyxtQ0FBUSxNQUFPLE1BQWY7QUFDakMsVUFBSyxlQUQ0QjtBQUVqQyxZQUFPLGVBRjBCLEdBSmpDO0FBQUE7QUFNMkIsbUNBTjNCO0FBT0E7QUFBQTtBQUFBLFFBQUssSUFBRyxTQUFSO0FBQUE7QUFBbUI7QUFBQTtBQUFBLFVBQVMsU0FBUyxtQkFBVTtBQUFDLGtCQUFNLGFBQU4sQ0FBb0IsU0FBUyxjQUFULENBQXdCLFdBQXhCLEVBQXFDLEtBQXpELEVBQWdFLFNBQVMsY0FBVCxDQUF3QixlQUF4QixFQUF5QyxLQUF6RztBQUFnSCxXQUE3STtBQUFBO0FBQUEsT0FBbkI7QUFBQTtBQUNtQjtBQUFBO0FBQUEsVUFBUyxTQUFTLE1BQU0sV0FBeEI7QUFBQTtBQUFBO0FBRG5CO0FBUEEsR0FGVTtBQUFBLENBQVoiLCJmaWxlIjoiTG9nSW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgTG9nSW4gPSAocHJvcHMpID0+IChcblxuICA8IGRpdiBpZD0nbG9nSW5TdHlsaW5nJyA+XG4gIDxwIGlkPSdsb2dpbkZpZWxkcyc+TmFtZTwvcD4gPCBpbnB1dCB0eXBlID0gJ3RleHQnXG4gIGlkID0gJ0xvZ0luTmFtZSdcbiAgbmFtZSA9ICdMb2dJbk5hbWUnIC8gPiA8IGJyIC8gPlxuICA8cCBpZD0nbG9naW5GaWVsZHMnPlBhc3N3b3JkPC9wPiA8IGlucHV0IHR5cGUgPSAndGV4dCdcbiAgaWQgPSAnTG9nSW5QYXNzd29yZCdcbiAgbmFtZSA9ICdMb2dJblBhc3N3b3JkJyAvID4gPCBiciAvID5cbiAgPGRpdiBpZD0nYnV0dG9ucyc+IDwgYnV0dG9uIG9uQ2xpY2s9e2Z1bmN0aW9uKCl7cHJvcHMubG9nSW5GdW5jdGlvbihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnTG9nSW5OYW1lJykudmFsdWUsIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdMb2dJblBhc3N3b3JkJykudmFsdWUpfX0+IFxuICBMb2cgSW4hIDwgL2J1dHRvbj4gPCBidXR0b24gb25DbGljaz17cHJvcHMub3VyRnVuY3Rpb259PiBTaWduIFVwIEluc3RlYWQgPCAvYnV0dG9uID48L2Rpdj5cbiAgPCAvZGl2PlxuXG4pXG4iXX0=
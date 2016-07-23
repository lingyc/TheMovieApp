'use strict';

var Friends = function Friends(props) {
  return React.createElement(
    'div',
    null,
    React.createElement(
      'h1',
      null,
      'Friends'
    ),
    'Enter friend you\'d like to add here here:',
    React.createElement('input', { id: 'findFriendByName' }),
    ' ',
    React.createElement(
      'button',
      { onClick: props.sendRequest },
      'Click to send request'
    ),
    React.createElement(
      'div',
      { style: { display: 'none' }, id: 'enterRealFriend' },
      'Please enter something!'
    ),
    React.createElement('br', null),
    React.createElement('br', null),
    React.createElement(
      'h2',
      null,
      'Here are your current friends'
    ),
    'Which movie do you want to watch? ',
    React.createElement('input', { id: 'movieToWatch', type: 'text' }),
    props.myFriends.map(function (friend) {
      return React.createElement(FriendEntry, { sendARequest: props.sendWatchRequest, Friend: friend[0], Comp: friend[1], fof: props.fof });
    })
  );
};

window.Friends = Friends;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL0ZyaWVuZHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFVBQVUsU0FBVixPQUFVLENBQUMsS0FBRDtBQUFBLFNBRVo7QUFBQTtBQUFBO0FBQ0Q7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQURDO0FBQUE7QUFFd0MsbUNBQU8sSUFBRyxrQkFBVixHQUZ4QztBQUFBO0FBRThFO0FBQUE7QUFBQSxRQUFRLFNBQVMsTUFBTSxXQUF2QjtBQUFBO0FBQUEsS0FGOUU7QUFHRDtBQUFBO0FBQUEsUUFBSyxPQUFPLEVBQUMsU0FBUSxNQUFULEVBQVosRUFBOEIsSUFBRyxpQkFBakM7QUFBQTtBQUFBLEtBSEM7QUFHK0UsbUNBSC9FO0FBT0YsbUNBUEU7QUFRRjtBQUFBO0FBQUE7QUFBQTtBQUFBLEtBUkU7QUFBQTtBQVNnQyxtQ0FBTyxJQUFHLGNBQVYsRUFBeUIsTUFBSyxNQUE5QixHQVRoQztBQVlELFVBQU0sU0FBTixDQUFnQixHQUFoQixDQUFvQixVQUFTLE1BQVQsRUFBZ0I7QUFBRSxhQUFRLG9CQUFDLFdBQUQsSUFBYSxjQUFjLE1BQU0sZ0JBQWpDLEVBQW9ELFFBQVEsT0FBTyxDQUFQLENBQTVELEVBQXVFLE1BQU0sT0FBTyxDQUFQLENBQTdFLEVBQXdGLEtBQUssTUFBTSxHQUFuRyxHQUFSO0FBQXFILEtBQTNKO0FBWkMsR0FGWTtBQUFBLENBQWQ7O0FBeUJBLE9BQU8sT0FBUCxHQUFpQixPQUFqQiIsImZpbGUiOiJGcmllbmRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEZyaWVuZHMgPSAocHJvcHMpID0+IChcbiBcbiAgPGRpdj5cbiA8aDE+RnJpZW5kczwvaDE+XG4gRW50ZXIgZnJpZW5kIHlvdSdkIGxpa2UgdG8gYWRkIGhlcmUgaGVyZTo8aW5wdXQgaWQ9J2ZpbmRGcmllbmRCeU5hbWUnPjwvaW5wdXQ+IDxidXR0b24gb25DbGljaz17cHJvcHMuc2VuZFJlcXVlc3R9PkNsaWNrIHRvIHNlbmQgcmVxdWVzdDwvYnV0dG9uPlxuIDxkaXYgc3R5bGU9e3tkaXNwbGF5Oidub25lJ319IGlkPSdlbnRlclJlYWxGcmllbmQnPlBsZWFzZSBlbnRlciBzb21ldGhpbmchPC9kaXY+PGJyLz5cbiBcblxuXG48YnIvPlxuPGgyID5IZXJlIGFyZSB5b3VyIGN1cnJlbnQgZnJpZW5kczwvaDI+XG5XaGljaCBtb3ZpZSBkbyB5b3Ugd2FudCB0byB3YXRjaD8gPGlucHV0IGlkPVwibW92aWVUb1dhdGNoXCIgdHlwZT0ndGV4dCc+PC9pbnB1dD5cblxuXG57cHJvcHMubXlGcmllbmRzLm1hcChmdW5jdGlvbihmcmllbmQpeyByZXR1cm4gKDxGcmllbmRFbnRyeSBzZW5kQVJlcXVlc3Q9e3Byb3BzLnNlbmRXYXRjaFJlcXVlc3R9ICBGcmllbmQ9e2ZyaWVuZFswXX0gQ29tcD17ZnJpZW5kWzFdfSBmb2Y9e3Byb3BzLmZvZn0gLz4gKX0pfVxuXG5cblxuXG5cbiAgPC9kaXY+XG5cblxuKTtcblxud2luZG93LkZyaWVuZHMgPSBGcmllbmRzO1xuIl19
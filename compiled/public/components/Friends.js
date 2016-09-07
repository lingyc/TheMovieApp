'use strict';

var Friends = function Friends(_ref) {
  var fof = _ref.fof;
  var sendRequest = _ref.sendRequest;
  var sendWatchRequest = _ref.sendWatchRequest;
  var myFriends = _ref.myFriends;
  return React.createElement(
    'div',
    { className: 'myFriends collection' },
    React.createElement('div', { className: 'header' }),
    React.createElement(
      'div',
      { className: 'findFriend' },
      React.createElement('input', { id: 'findFriendByName', placeholder: 'Enter friend you\'d like to add here here' }),
      React.createElement(
        'a',
        { className: 'waves-effect waves-light btn', onClick: sendRequest },
        'send a friend request'
      )
    ),
    React.createElement(
      'div',
      { className: 'errorMsg', style: { display: 'none' }, id: 'enterRealFriend' },
      'Please enter something!'
    ),
    React.createElement(
      'div',
      { className: 'updateMsg', style: { display: 'none' }, id: 'reqSent' },
      'Request sent!'
    ),
    React.createElement('br', null),
    React.createElement(
      'div',
      { className: 'errorMsg', style: { display: 'none' }, id: 'AlreadyReq' },
      'Youve already sent a request to this user!'
    ),
    React.createElement('br', null),
    React.createElement('br', null),
    React.createElement(
      'h5',
      { className: 'header lable' },
      'Your Friends'
    ),
    myFriends.map(function (friend) {
      return React.createElement(FriendEntry, { sendARequest: sendWatchRequest, Friend: friend[0], Comp: friend[1], fof: fof });
    })
  );
};

window.Friends = Friends;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0ZyaWVuZHMuanMiXSwibmFtZXMiOlsiRnJpZW5kcyIsImZvZiIsInNlbmRSZXF1ZXN0Iiwic2VuZFdhdGNoUmVxdWVzdCIsIm15RnJpZW5kcyIsImRpc3BsYXkiLCJtYXAiLCJmcmllbmQiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsVUFBVSxTQUFWQSxPQUFVO0FBQUEsTUFBRUMsR0FBRixRQUFFQSxHQUFGO0FBQUEsTUFBT0MsV0FBUCxRQUFPQSxXQUFQO0FBQUEsTUFBb0JDLGdCQUFwQixRQUFvQkEsZ0JBQXBCO0FBQUEsTUFBc0NDLFNBQXRDLFFBQXNDQSxTQUF0QztBQUFBLFNBRWQ7QUFBQTtBQUFBLE1BQUssV0FBVSxzQkFBZjtBQUNFLGlDQUFLLFdBQVUsUUFBZixHQURGO0FBRUU7QUFBQTtBQUFBLFFBQUssV0FBVSxZQUFmO0FBQ0UscUNBQU8sSUFBRyxrQkFBVixFQUE2QixhQUFZLDJDQUF6QyxHQURGO0FBRUU7QUFBQTtBQUFBLFVBQUcsV0FBVSw4QkFBYixFQUE0QyxTQUFTRixXQUFyRDtBQUFBO0FBQUE7QUFGRixLQUZGO0FBTUU7QUFBQTtBQUFBLFFBQUssV0FBVSxVQUFmLEVBQTBCLE9BQU8sRUFBQ0csU0FBUyxNQUFWLEVBQWpDLEVBQW9ELElBQUcsaUJBQXZEO0FBQUE7QUFBQSxLQU5GO0FBT0U7QUFBQTtBQUFBLFFBQUssV0FBVSxXQUFmLEVBQTJCLE9BQU8sRUFBQ0EsU0FBUyxNQUFWLEVBQWxDLEVBQXFELElBQUcsU0FBeEQ7QUFBQTtBQUFBLEtBUEY7QUFRRSxtQ0FSRjtBQVNFO0FBQUE7QUFBQSxRQUFLLFdBQVUsVUFBZixFQUEwQixPQUFPLEVBQUNBLFNBQVMsTUFBVixFQUFqQyxFQUFvRCxJQUFHLFlBQXZEO0FBQUE7QUFBQSxLQVRGO0FBVUUsbUNBVkY7QUFXRSxtQ0FYRjtBQVlFO0FBQUE7QUFBQSxRQUFJLFdBQVUsY0FBZDtBQUFBO0FBQUEsS0FaRjtBQWFHRCxjQUFVRSxHQUFWLENBQWM7QUFBQSxhQUNkLG9CQUFDLFdBQUQsSUFBYSxjQUFjSCxnQkFBM0IsRUFBNkMsUUFBUUksT0FBTyxDQUFQLENBQXJELEVBQWdFLE1BQU1BLE9BQU8sQ0FBUCxDQUF0RSxFQUFpRixLQUFLTixHQUF0RixHQURjO0FBQUEsS0FBZDtBQWJILEdBRmM7QUFBQSxDQUFkOztBQXNCQU8sT0FBT1IsT0FBUCxHQUFpQkEsT0FBakIiLCJmaWxlIjoiRnJpZW5kcy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBGcmllbmRzID0gKHtmb2YsIHNlbmRSZXF1ZXN0LCBzZW5kV2F0Y2hSZXF1ZXN0LCBteUZyaWVuZHN9KSA9PiAoXHJcbiBcclxuPGRpdiBjbGFzc05hbWU9XCJteUZyaWVuZHMgY29sbGVjdGlvblwiPlxyXG4gIDxkaXYgY2xhc3NOYW1lPSdoZWFkZXInPjwvZGl2PlxyXG4gIDxkaXYgY2xhc3NOYW1lPSdmaW5kRnJpZW5kJz5cclxuICAgIDxpbnB1dCBpZD0nZmluZEZyaWVuZEJ5TmFtZScgcGxhY2Vob2xkZXI9XCJFbnRlciBmcmllbmQgeW91J2QgbGlrZSB0byBhZGQgaGVyZSBoZXJlXCI+PC9pbnB1dD5cclxuICAgIDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXtzZW5kUmVxdWVzdH0+c2VuZCBhIGZyaWVuZCByZXF1ZXN0PC9hPlxyXG4gIDwvZGl2PlxyXG4gIDxkaXYgY2xhc3NOYW1lPVwiZXJyb3JNc2dcIiBzdHlsZT17e2Rpc3BsYXk6ICdub25lJ319IGlkPSdlbnRlclJlYWxGcmllbmQnPlBsZWFzZSBlbnRlciBzb21ldGhpbmchPC9kaXY+XHJcbiAgPGRpdiBjbGFzc05hbWU9XCJ1cGRhdGVNc2dcIiBzdHlsZT17e2Rpc3BsYXk6ICdub25lJ319IGlkPSdyZXFTZW50Jz5SZXF1ZXN0IHNlbnQhPC9kaXY+XHJcbiAgPGJyLz5cclxuICA8ZGl2IGNsYXNzTmFtZT1cImVycm9yTXNnXCIgc3R5bGU9e3tkaXNwbGF5OiAnbm9uZSd9fSBpZD0nQWxyZWFkeVJlcSc+WW91dmUgYWxyZWFkeSBzZW50IGEgcmVxdWVzdCB0byB0aGlzIHVzZXIhPC9kaXY+XHJcbiAgPGJyLz5cclxuICA8YnIvPlxyXG4gIDxoNSBjbGFzc05hbWU9XCJoZWFkZXIgbGFibGVcIj5Zb3VyIEZyaWVuZHM8L2g1PiBcclxuICB7bXlGcmllbmRzLm1hcChmcmllbmQ9PiggXHJcbiAgXHQ8RnJpZW5kRW50cnkgc2VuZEFSZXF1ZXN0PXtzZW5kV2F0Y2hSZXF1ZXN0fSBGcmllbmQ9e2ZyaWVuZFswXX0gQ29tcD17ZnJpZW5kWzFdfSBmb2Y9e2ZvZn0gLz4gXHJcbiAgICkpfVxyXG48L2Rpdj5cclxuXHJcbik7XHJcblxyXG53aW5kb3cuRnJpZW5kcyA9IEZyaWVuZHM7XHJcbiJdfQ==
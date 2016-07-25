'use strict';

var Friends = function Friends(props) {
	return React.createElement(
		'div',
		{ className: 'myFriends collection' },
		React.createElement(
			'div',
			{ className: 'header' },
			'Your Friends'
		),
		React.createElement(
			'div',
			{ className: 'findFriend' },
			React.createElement('input', { id: 'findFriendByName', placeholder: 'Enter friend you\'d like to add here here' }),
			React.createElement(
				'a',
				{ className: 'waves-effect waves-light btn', onClick: props.sendRequest },
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
			'your current friends'
		),
		props.myFriends.map(function (friend) {
			return React.createElement(FriendEntry, { sendARequest: props.sendWatchRequest, Friend: friend[0], Comp: friend[1], fof: props.fof });
		})
	);
};

window.Friends = Friends;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL0ZyaWVuZHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFVBQVUsU0FBVixPQUFVLENBQUMsS0FBRDtBQUFBLFFBRVo7QUFBQTtBQUFBLElBQUssV0FBVSxzQkFBZjtBQUNDO0FBQUE7QUFBQSxLQUFLLFdBQVUsUUFBZjtBQUFBO0FBQUEsR0FERDtBQUVDO0FBQUE7QUFBQSxLQUFLLFdBQVUsWUFBZjtBQUNDLGtDQUFPLElBQUcsa0JBQVYsRUFBNkIsYUFBWSwyQ0FBekMsR0FERDtBQUVDO0FBQUE7QUFBQSxNQUFHLFdBQVUsOEJBQWIsRUFBNEMsU0FBUyxNQUFNLFdBQTNEO0FBQUE7QUFBQTtBQUZELEdBRkQ7QUFNQztBQUFBO0FBQUEsS0FBSyxXQUFVLFVBQWYsRUFBMEIsT0FBTyxFQUFDLFNBQVEsTUFBVCxFQUFqQyxFQUFtRCxJQUFHLGlCQUF0RDtBQUFBO0FBQUEsR0FORDtBQU9DO0FBQUE7QUFBQSxLQUFLLFdBQVUsV0FBZixFQUEyQixPQUFPLEVBQUMsU0FBUSxNQUFULEVBQWxDLEVBQW9ELElBQUcsU0FBdkQ7QUFBQTtBQUFBLEdBUEQ7QUFPcUYsaUNBUHJGO0FBUUM7QUFBQTtBQUFBLEtBQUssV0FBVSxVQUFmLEVBQTBCLE9BQU8sRUFBQyxTQUFRLE1BQVQsRUFBakMsRUFBbUQsSUFBRyxZQUF0RDtBQUFBO0FBQUEsR0FSRDtBQVFvSCxpQ0FScEg7QUFTQSxpQ0FUQTtBQVVBO0FBQUE7QUFBQSxLQUFJLFdBQVUsY0FBZDtBQUFBO0FBQUEsR0FWQTtBQVdDLFFBQU0sU0FBTixDQUFnQixHQUFoQixDQUFvQixVQUFTLE1BQVQsRUFBZ0I7QUFBRSxVQUFRLG9CQUFDLFdBQUQsSUFBYSxjQUFjLE1BQU0sZ0JBQWpDLEVBQW9ELFFBQVEsT0FBTyxDQUFQLENBQTVELEVBQXVFLE1BQU0sT0FBTyxDQUFQLENBQTdFLEVBQXdGLEtBQUssTUFBTSxHQUFuRyxHQUFSO0FBQXFILEdBQTNKO0FBWEQsRUFGWTtBQUFBLENBQWQ7O0FBbUJBLE9BQU8sT0FBUCxHQUFpQixPQUFqQiIsImZpbGUiOiJGcmllbmRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEZyaWVuZHMgPSAocHJvcHMpID0+IChcbiBcbiAgPGRpdiBjbGFzc05hbWU9XCJteUZyaWVuZHMgY29sbGVjdGlvblwiPlxuXHRcdCA8ZGl2IGNsYXNzTmFtZT0naGVhZGVyJz5Zb3VyIEZyaWVuZHM8L2Rpdj5cblx0XHQgPGRpdiBjbGFzc05hbWU9J2ZpbmRGcmllbmQnPlxuXHRcdCBcdDxpbnB1dCBpZD0nZmluZEZyaWVuZEJ5TmFtZScgcGxhY2Vob2xkZXI9XCJFbnRlciBmcmllbmQgeW91J2QgbGlrZSB0byBhZGQgaGVyZSBoZXJlXCI+PC9pbnB1dD4gXG5cdFx0IFx0PGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9e3Byb3BzLnNlbmRSZXF1ZXN0fT5zZW5kIGEgZnJpZW5kIHJlcXVlc3Q8L2E+XG5cdFx0IDwvZGl2PlxuXHRcdCA8ZGl2IGNsYXNzTmFtZT1cImVycm9yTXNnXCIgc3R5bGU9e3tkaXNwbGF5Oidub25lJ319IGlkPSdlbnRlclJlYWxGcmllbmQnPlBsZWFzZSBlbnRlciBzb21ldGhpbmchPC9kaXY+XG5cdFx0IDxkaXYgY2xhc3NOYW1lPVwidXBkYXRlTXNnXCIgc3R5bGU9e3tkaXNwbGF5Oidub25lJ319IGlkPSdyZXFTZW50Jz5SZXF1ZXN0IHNlbnQhPC9kaXY+PGJyLz5cblx0XHQgPGRpdiBjbGFzc05hbWU9XCJlcnJvck1zZ1wiIHN0eWxlPXt7ZGlzcGxheTonbm9uZSd9fSBpZD0nQWxyZWFkeVJlcSc+WW91dmUgYWxyZWFkeSBzZW50IGEgcmVxdWVzdCB0byB0aGlzIHVzZXIhPC9kaXY+PGJyLz5cblx0XHQ8YnIvPlxuXHRcdDxoNSBjbGFzc05hbWU9XCJoZWFkZXIgbGFibGVcIj55b3VyIGN1cnJlbnQgZnJpZW5kczwvaDU+XG5cdFx0e3Byb3BzLm15RnJpZW5kcy5tYXAoZnVuY3Rpb24oZnJpZW5kKXsgcmV0dXJuICg8RnJpZW5kRW50cnkgc2VuZEFSZXF1ZXN0PXtwcm9wcy5zZW5kV2F0Y2hSZXF1ZXN0fSAgRnJpZW5kPXtmcmllbmRbMF19IENvbXA9e2ZyaWVuZFsxXX0gZm9mPXtwcm9wcy5mb2Z9IC8+ICl9KX1cbiAgPC9kaXY+XG5cblxuKTtcblxud2luZG93LkZyaWVuZHMgPSBGcmllbmRzO1xuIl19
'use strict';

var Friends = function Friends(props) {
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
			'Your Friends'
		),
		props.myFriends.map(function (friend) {
			return React.createElement(FriendEntry, { sendARequest: props.sendWatchRequest, Friend: friend[0], Comp: friend[1], fof: props.fof });
		})
	);
};

window.Friends = Friends;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0ZyaWVuZHMuanMiXSwibmFtZXMiOlsiRnJpZW5kcyIsInByb3BzIiwic2VuZFJlcXVlc3QiLCJkaXNwbGF5IiwibXlGcmllbmRzIiwibWFwIiwiZnJpZW5kIiwic2VuZFdhdGNoUmVxdWVzdCIsImZvZiIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxVQUFVLFNBQVZBLE9BQVUsQ0FBQ0MsS0FBRDtBQUFBLFFBRVo7QUFBQTtBQUFBLElBQUssV0FBVSxzQkFBZjtBQUNDLCtCQUFLLFdBQVUsUUFBZixHQUREO0FBRUM7QUFBQTtBQUFBLEtBQUssV0FBVSxZQUFmO0FBQ0Msa0NBQU8sSUFBRyxrQkFBVixFQUE2QixhQUFZLDJDQUF6QyxHQUREO0FBRUM7QUFBQTtBQUFBLE1BQUcsV0FBVSw4QkFBYixFQUE0QyxTQUFTQSxNQUFNQyxXQUEzRDtBQUFBO0FBQUE7QUFGRCxHQUZEO0FBTUM7QUFBQTtBQUFBLEtBQUssV0FBVSxVQUFmLEVBQTBCLE9BQU8sRUFBQ0MsU0FBUSxNQUFULEVBQWpDLEVBQW1ELElBQUcsaUJBQXREO0FBQUE7QUFBQSxHQU5EO0FBT0M7QUFBQTtBQUFBLEtBQUssV0FBVSxXQUFmLEVBQTJCLE9BQU8sRUFBQ0EsU0FBUSxNQUFULEVBQWxDLEVBQW9ELElBQUcsU0FBdkQ7QUFBQTtBQUFBLEdBUEQ7QUFPcUYsaUNBUHJGO0FBUUM7QUFBQTtBQUFBLEtBQUssV0FBVSxVQUFmLEVBQTBCLE9BQU8sRUFBQ0EsU0FBUSxNQUFULEVBQWpDLEVBQW1ELElBQUcsWUFBdEQ7QUFBQTtBQUFBLEdBUkQ7QUFRb0gsaUNBUnBIO0FBU0EsaUNBVEE7QUFVQTtBQUFBO0FBQUEsS0FBSSxXQUFVLGNBQWQ7QUFBQTtBQUFBLEdBVkE7QUFXQ0YsUUFBTUcsU0FBTixDQUFnQkMsR0FBaEIsQ0FBb0IsVUFBU0MsTUFBVCxFQUFnQjtBQUFFLFVBQVEsb0JBQUMsV0FBRCxJQUFhLGNBQWNMLE1BQU1NLGdCQUFqQyxFQUFvRCxRQUFRRCxPQUFPLENBQVAsQ0FBNUQsRUFBdUUsTUFBTUEsT0FBTyxDQUFQLENBQTdFLEVBQXdGLEtBQUtMLE1BQU1PLEdBQW5HLEdBQVI7QUFBcUgsR0FBM0o7QUFYRCxFQUZZO0FBQUEsQ0FBZDs7QUFtQkFDLE9BQU9ULE9BQVAsR0FBaUJBLE9BQWpCIiwiZmlsZSI6IkZyaWVuZHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgRnJpZW5kcyA9IChwcm9wcykgPT4gKFxuIFxuICA8ZGl2IGNsYXNzTmFtZT1cIm15RnJpZW5kcyBjb2xsZWN0aW9uXCI+XG5cdFx0IDxkaXYgY2xhc3NOYW1lPSdoZWFkZXInPjwvZGl2PlxuXHRcdCA8ZGl2IGNsYXNzTmFtZT0nZmluZEZyaWVuZCc+XG5cdFx0IFx0PGlucHV0IGlkPSdmaW5kRnJpZW5kQnlOYW1lJyBwbGFjZWhvbGRlcj1cIkVudGVyIGZyaWVuZCB5b3UnZCBsaWtlIHRvIGFkZCBoZXJlIGhlcmVcIj48L2lucHV0PiBcblx0XHQgXHQ8YSBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17cHJvcHMuc2VuZFJlcXVlc3R9PnNlbmQgYSBmcmllbmQgcmVxdWVzdDwvYT5cblx0XHQgPC9kaXY+XG5cdFx0IDxkaXYgY2xhc3NOYW1lPVwiZXJyb3JNc2dcIiBzdHlsZT17e2Rpc3BsYXk6J25vbmUnfX0gaWQ9J2VudGVyUmVhbEZyaWVuZCc+UGxlYXNlIGVudGVyIHNvbWV0aGluZyE8L2Rpdj5cblx0XHQgPGRpdiBjbGFzc05hbWU9XCJ1cGRhdGVNc2dcIiBzdHlsZT17e2Rpc3BsYXk6J25vbmUnfX0gaWQ9J3JlcVNlbnQnPlJlcXVlc3Qgc2VudCE8L2Rpdj48YnIvPlxuXHRcdCA8ZGl2IGNsYXNzTmFtZT1cImVycm9yTXNnXCIgc3R5bGU9e3tkaXNwbGF5Oidub25lJ319IGlkPSdBbHJlYWR5UmVxJz5Zb3V2ZSBhbHJlYWR5IHNlbnQgYSByZXF1ZXN0IHRvIHRoaXMgdXNlciE8L2Rpdj48YnIvPlxuXHRcdDxici8+XG5cdFx0PGg1IGNsYXNzTmFtZT1cImhlYWRlciBsYWJsZVwiPllvdXIgRnJpZW5kczwvaDU+XG5cdFx0e3Byb3BzLm15RnJpZW5kcy5tYXAoZnVuY3Rpb24oZnJpZW5kKXsgcmV0dXJuICg8RnJpZW5kRW50cnkgc2VuZEFSZXF1ZXN0PXtwcm9wcy5zZW5kV2F0Y2hSZXF1ZXN0fSAgRnJpZW5kPXtmcmllbmRbMF19IENvbXA9e2ZyaWVuZFsxXX0gZm9mPXtwcm9wcy5mb2Z9IC8+ICl9KX1cbiAgPC9kaXY+XG5cblxuKTtcblxud2luZG93LkZyaWVuZHMgPSBGcmllbmRzO1xuIl19
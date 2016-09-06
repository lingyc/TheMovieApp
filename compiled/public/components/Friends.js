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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0ZyaWVuZHMuanMiXSwibmFtZXMiOlsiRnJpZW5kcyIsInByb3BzIiwic2VuZFJlcXVlc3QiLCJkaXNwbGF5IiwibXlGcmllbmRzIiwibWFwIiwiZnJpZW5kIiwic2VuZFdhdGNoUmVxdWVzdCIsImZvZiIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxVQUFVLFNBQVZBLE9BQVUsQ0FBQ0MsS0FBRDtBQUFBLFFBRVo7QUFBQTtBQUFBLElBQUssV0FBVSxzQkFBZjtBQUNDLCtCQUFLLFdBQVUsUUFBZixHQUREO0FBRUM7QUFBQTtBQUFBLEtBQUssV0FBVSxZQUFmO0FBQ0Msa0NBQU8sSUFBRyxrQkFBVixFQUE2QixhQUFZLDJDQUF6QyxHQUREO0FBRUM7QUFBQTtBQUFBLE1BQUcsV0FBVSw4QkFBYixFQUE0QyxTQUFTQSxNQUFNQyxXQUEzRDtBQUFBO0FBQUE7QUFGRCxHQUZEO0FBTUM7QUFBQTtBQUFBLEtBQUssV0FBVSxVQUFmLEVBQTBCLE9BQU8sRUFBQ0MsU0FBUSxNQUFULEVBQWpDLEVBQW1ELElBQUcsaUJBQXREO0FBQUE7QUFBQSxHQU5EO0FBT0M7QUFBQTtBQUFBLEtBQUssV0FBVSxXQUFmLEVBQTJCLE9BQU8sRUFBQ0EsU0FBUSxNQUFULEVBQWxDLEVBQW9ELElBQUcsU0FBdkQ7QUFBQTtBQUFBLEdBUEQ7QUFPcUYsaUNBUHJGO0FBUUM7QUFBQTtBQUFBLEtBQUssV0FBVSxVQUFmLEVBQTBCLE9BQU8sRUFBQ0EsU0FBUSxNQUFULEVBQWpDLEVBQW1ELElBQUcsWUFBdEQ7QUFBQTtBQUFBLEdBUkQ7QUFRb0gsaUNBUnBIO0FBU0EsaUNBVEE7QUFVQTtBQUFBO0FBQUEsS0FBSSxXQUFVLGNBQWQ7QUFBQTtBQUFBLEdBVkE7QUFXQ0YsUUFBTUcsU0FBTixDQUFnQkMsR0FBaEIsQ0FBb0IsVUFBU0MsTUFBVCxFQUFnQjtBQUFFLFVBQVEsb0JBQUMsV0FBRCxJQUFhLGNBQWNMLE1BQU1NLGdCQUFqQyxFQUFvRCxRQUFRRCxPQUFPLENBQVAsQ0FBNUQsRUFBdUUsTUFBTUEsT0FBTyxDQUFQLENBQTdFLEVBQXdGLEtBQUtMLE1BQU1PLEdBQW5HLEdBQVI7QUFBcUgsR0FBM0o7QUFYRCxFQUZZO0FBQUEsQ0FBZDs7QUFtQkFDLE9BQU9ULE9BQVAsR0FBaUJBLE9BQWpCIiwiZmlsZSI6IkZyaWVuZHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgRnJpZW5kcyA9IChwcm9wcykgPT4gKFxyXG4gXHJcbiAgPGRpdiBjbGFzc05hbWU9XCJteUZyaWVuZHMgY29sbGVjdGlvblwiPlxyXG5cdFx0IDxkaXYgY2xhc3NOYW1lPSdoZWFkZXInPjwvZGl2PlxyXG5cdFx0IDxkaXYgY2xhc3NOYW1lPSdmaW5kRnJpZW5kJz5cclxuXHRcdCBcdDxpbnB1dCBpZD0nZmluZEZyaWVuZEJ5TmFtZScgcGxhY2Vob2xkZXI9XCJFbnRlciBmcmllbmQgeW91J2QgbGlrZSB0byBhZGQgaGVyZSBoZXJlXCI+PC9pbnB1dD4gXHJcblx0XHQgXHQ8YSBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17cHJvcHMuc2VuZFJlcXVlc3R9PnNlbmQgYSBmcmllbmQgcmVxdWVzdDwvYT5cclxuXHRcdCA8L2Rpdj5cclxuXHRcdCA8ZGl2IGNsYXNzTmFtZT1cImVycm9yTXNnXCIgc3R5bGU9e3tkaXNwbGF5Oidub25lJ319IGlkPSdlbnRlclJlYWxGcmllbmQnPlBsZWFzZSBlbnRlciBzb21ldGhpbmchPC9kaXY+XHJcblx0XHQgPGRpdiBjbGFzc05hbWU9XCJ1cGRhdGVNc2dcIiBzdHlsZT17e2Rpc3BsYXk6J25vbmUnfX0gaWQ9J3JlcVNlbnQnPlJlcXVlc3Qgc2VudCE8L2Rpdj48YnIvPlxyXG5cdFx0IDxkaXYgY2xhc3NOYW1lPVwiZXJyb3JNc2dcIiBzdHlsZT17e2Rpc3BsYXk6J25vbmUnfX0gaWQ9J0FscmVhZHlSZXEnPllvdXZlIGFscmVhZHkgc2VudCBhIHJlcXVlc3QgdG8gdGhpcyB1c2VyITwvZGl2Pjxici8+XHJcblx0XHQ8YnIvPlxyXG5cdFx0PGg1IGNsYXNzTmFtZT1cImhlYWRlciBsYWJsZVwiPllvdXIgRnJpZW5kczwvaDU+XHJcblx0XHR7cHJvcHMubXlGcmllbmRzLm1hcChmdW5jdGlvbihmcmllbmQpeyByZXR1cm4gKDxGcmllbmRFbnRyeSBzZW5kQVJlcXVlc3Q9e3Byb3BzLnNlbmRXYXRjaFJlcXVlc3R9ICBGcmllbmQ9e2ZyaWVuZFswXX0gQ29tcD17ZnJpZW5kWzFdfSBmb2Y9e3Byb3BzLmZvZn0gLz4gKX0pfVxyXG4gIDwvZGl2PlxyXG5cclxuXHJcbik7XHJcblxyXG53aW5kb3cuRnJpZW5kcyA9IEZyaWVuZHM7XHJcbiJdfQ==
"use strict";

var SingleFriend = function SingleFriend(props) {

	console.log('props.moviesOfFriend', props.moviesOfFriend);
	if (props.moviesOfFriend.length === 0) {
		return React.createElement(
			"div",
			null,
			React.createElement(
				"button",
				{ onClick: function onClick() {
						return props.onClick("Friends");
					} },
				"Back to all friends"
			),
			React.createElement("br", null),
			"Sorry, ",
			props.friendName.slice(props.friendName.indexOf(">") + 1, props.friendName.lastIndexOf("<")),
			" hasn't rated any movies."
		);
	} else {
		return React.createElement(
			"div",
			null,
			React.createElement(
				"button",
				{ onClick: function onClick() {
						return props.onClick("Friends");
					} },
				"Back to all friends"
			),
			React.createElement(
				"h2",
				null,
				" List of ",
				props.friendName,
				"'s Movies"
			),
			React.createElement(
				"div",
				{ className: "moviesOfFriend" },
				props.moviesOfFriend.map(function (movie) {
					return React.createElement(MovieListEntry, { friendName: props.friendName, movie: movie, change: props.change });
				})
			)
		);
	}
};

window.SingleFriend = SingleFriend;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1NpbmdsZUZyaWVuZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZUFBZSxTQUFmLFlBQWUsQ0FBQyxLQUFELEVBQVc7O0FBRzlCLFNBQVEsR0FBUixDQUFZLHNCQUFaLEVBQW1DLE1BQU0sY0FBekM7QUFDQSxLQUFJLE1BQU0sY0FBTixDQUFxQixNQUFyQixLQUE4QixDQUFsQyxFQUFvQztBQUNuQyxTQUNDO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQSxNQUFRLFNBQVM7QUFBQSxhQUFPLE1BQU0sT0FBTixDQUFjLFNBQWQsQ0FBUDtBQUFBLE1BQWpCO0FBQUE7QUFBQSxJQURBO0FBQytFLGtDQUQvRTtBQUFBO0FBRVEsU0FBTSxVQUFOLENBQWlCLEtBQWpCLENBQXVCLE1BQU0sVUFBTixDQUFpQixPQUFqQixDQUF5QixHQUF6QixJQUE4QixDQUFyRCxFQUF1RCxNQUFNLFVBQU4sQ0FBaUIsV0FBakIsQ0FBNkIsR0FBN0IsQ0FBdkQsQ0FGUjtBQUFBO0FBQUEsR0FERDtBQU9BLEVBUkQsTUFRTztBQUNOLFNBQ0M7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBLE1BQVEsU0FBUztBQUFBLGFBQU8sTUFBTSxPQUFOLENBQWMsU0FBZCxDQUFQO0FBQUEsTUFBakI7QUFBQTtBQUFBLElBREE7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFjLFVBQU0sVUFBcEI7QUFBQTtBQUFBLElBRkE7QUFHQTtBQUFBO0FBQUEsTUFBSyxXQUFVLGdCQUFmO0FBQ0UsVUFBTSxjQUFOLENBQXFCLEdBQXJCLENBQXlCO0FBQUEsWUFBUyxvQkFBQyxjQUFELElBQWdCLFlBQVksTUFBTSxVQUFsQyxFQUE4QyxPQUFPLEtBQXJELEVBQTRELFFBQVEsTUFBTSxNQUExRSxHQUFUO0FBQUEsS0FBekI7QUFERjtBQUhBLEdBREQ7QUFXQTtBQUNBLENBekJEOztBQTJCQSxPQUFPLFlBQVAsR0FBc0IsWUFBdEIiLCJmaWxlIjoiU2luZ2xlRnJpZW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFNpbmdsZUZyaWVuZCA9IChwcm9wcykgPT4ge1xuXG5cbmNvbnNvbGUubG9nKCdwcm9wcy5tb3ZpZXNPZkZyaWVuZCcscHJvcHMubW92aWVzT2ZGcmllbmQpXG5pZiAocHJvcHMubW92aWVzT2ZGcmllbmQubGVuZ3RoPT09MCl7XG5cdHJldHVybiAoXG5cdFx0PGRpdj5cblx0XHQ8YnV0dG9uIG9uQ2xpY2s9eygpID0+IChwcm9wcy5vbkNsaWNrKFwiRnJpZW5kc1wiKSl9PkJhY2sgdG8gYWxsIGZyaWVuZHM8L2J1dHRvbj48YnIvPlxuXHRcdFNvcnJ5LCB7cHJvcHMuZnJpZW5kTmFtZS5zbGljZShwcm9wcy5mcmllbmROYW1lLmluZGV4T2YoXCI+XCIpKzEscHJvcHMuZnJpZW5kTmFtZS5sYXN0SW5kZXhPZihcIjxcIikpfSBoYXNuJ3QgcmF0ZWQgYW55IG1vdmllcy5cblx0XHQ8L2Rpdj5cblx0XHQpXG5cbn0gZWxzZSB7XG5cdHJldHVybiAoXG4gIDxkaXY+XG5cdFx0PGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiAocHJvcHMub25DbGljayhcIkZyaWVuZHNcIikpfT5CYWNrIHRvIGFsbCBmcmllbmRzPC9idXR0b24+XG5cdFx0PGgyPiBMaXN0IG9mIHtwcm9wcy5mcmllbmROYW1lfSdzIE1vdmllczwvaDI+XG5cdFx0PGRpdiBjbGFzc05hbWU9J21vdmllc09mRnJpZW5kJz5cblx0XHRcdHtwcm9wcy5tb3ZpZXNPZkZyaWVuZC5tYXAobW92aWUgPT4gPE1vdmllTGlzdEVudHJ5IGZyaWVuZE5hbWU9e3Byb3BzLmZyaWVuZE5hbWV9IG1vdmllPXttb3ZpZX0gY2hhbmdlPXtwcm9wcy5jaGFuZ2V9Lz4gKX1cblx0XHQ8L2Rpdj5cblx0PC9kaXY+XG5cblxuXHQpXG59XG59O1xuXG53aW5kb3cuU2luZ2xlRnJpZW5kID0gU2luZ2xlRnJpZW5kO1xuIl19
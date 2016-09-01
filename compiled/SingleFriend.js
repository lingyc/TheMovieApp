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
			props.friendName,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL1NpbmdsZUZyaWVuZC5qcyJdLCJuYW1lcyI6WyJTaW5nbGVGcmllbmQiLCJwcm9wcyIsImNvbnNvbGUiLCJsb2ciLCJtb3ZpZXNPZkZyaWVuZCIsImxlbmd0aCIsIm9uQ2xpY2siLCJmcmllbmROYW1lIiwibWFwIiwibW92aWUiLCJjaGFuZ2UiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsZUFBZSxTQUFmQSxZQUFlLENBQUNDLEtBQUQsRUFBVzs7QUFHOUJDLFNBQVFDLEdBQVIsQ0FBWSxzQkFBWixFQUFtQ0YsTUFBTUcsY0FBekM7QUFDQSxLQUFJSCxNQUFNRyxjQUFOLENBQXFCQyxNQUFyQixLQUE4QixDQUFsQyxFQUFvQztBQUNuQyxTQUNDO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQSxNQUFRLFNBQVM7QUFBQSxhQUFPSixNQUFNSyxPQUFOLENBQWMsU0FBZCxDQUFQO0FBQUEsTUFBakI7QUFBQTtBQUFBLElBREE7QUFDK0Usa0NBRC9FO0FBQUE7QUFFUUwsU0FBTU0sVUFGZDtBQUFBO0FBQUEsR0FERDtBQU9BLEVBUkQsTUFRTztBQUNOLFNBQ0M7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBLE1BQVEsU0FBUztBQUFBLGFBQU9OLE1BQU1LLE9BQU4sQ0FBYyxTQUFkLENBQVA7QUFBQSxNQUFqQjtBQUFBO0FBQUEsSUFEQTtBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQWNMLFVBQU1NLFVBQXBCO0FBQUE7QUFBQSxJQUZBO0FBR0E7QUFBQTtBQUFBLE1BQUssV0FBVSxnQkFBZjtBQUNFTixVQUFNRyxjQUFOLENBQXFCSSxHQUFyQixDQUF5QjtBQUFBLFlBQVMsb0JBQUMsY0FBRCxJQUFnQixZQUFZUCxNQUFNTSxVQUFsQyxFQUE4QyxPQUFPRSxLQUFyRCxFQUE0RCxRQUFRUixNQUFNUyxNQUExRSxHQUFUO0FBQUEsS0FBekI7QUFERjtBQUhBLEdBREQ7QUFXQTtBQUNBLENBekJEOztBQTJCQUMsT0FBT1gsWUFBUCxHQUFzQkEsWUFBdEIiLCJmaWxlIjoiU2luZ2xlRnJpZW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFNpbmdsZUZyaWVuZCA9IChwcm9wcykgPT4ge1xuXG5cbmNvbnNvbGUubG9nKCdwcm9wcy5tb3ZpZXNPZkZyaWVuZCcscHJvcHMubW92aWVzT2ZGcmllbmQpXG5pZiAocHJvcHMubW92aWVzT2ZGcmllbmQubGVuZ3RoPT09MCl7XG5cdHJldHVybiAoXG5cdFx0PGRpdj5cblx0XHQ8YnV0dG9uIG9uQ2xpY2s9eygpID0+IChwcm9wcy5vbkNsaWNrKFwiRnJpZW5kc1wiKSl9PkJhY2sgdG8gYWxsIGZyaWVuZHM8L2J1dHRvbj48YnIvPlxuXHRcdFNvcnJ5LCB7cHJvcHMuZnJpZW5kTmFtZX0gaGFzbid0IHJhdGVkIGFueSBtb3ZpZXMuXG5cdFx0PC9kaXY+XG5cdFx0KVxuXG59IGVsc2Uge1xuXHRyZXR1cm4gKFxuICA8ZGl2PlxuXHRcdDxidXR0b24gb25DbGljaz17KCkgPT4gKHByb3BzLm9uQ2xpY2soXCJGcmllbmRzXCIpKX0+QmFjayB0byBhbGwgZnJpZW5kczwvYnV0dG9uPlxuXHRcdDxoMj4gTGlzdCBvZiB7cHJvcHMuZnJpZW5kTmFtZX0ncyBNb3ZpZXM8L2gyPlxuXHRcdDxkaXYgY2xhc3NOYW1lPSdtb3ZpZXNPZkZyaWVuZCc+XG5cdFx0XHR7cHJvcHMubW92aWVzT2ZGcmllbmQubWFwKG1vdmllID0+IDxNb3ZpZUxpc3RFbnRyeSBmcmllbmROYW1lPXtwcm9wcy5mcmllbmROYW1lfSBtb3ZpZT17bW92aWV9IGNoYW5nZT17cHJvcHMuY2hhbmdlfS8+ICl9XG5cdFx0PC9kaXY+XG5cdDwvZGl2PlxuXG5cblx0KVxufVxufTtcblxud2luZG93LlNpbmdsZUZyaWVuZCA9IFNpbmdsZUZyaWVuZDtcbiJdfQ==
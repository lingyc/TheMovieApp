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
			{ className: "Home collection" },
			React.createElement(
				"a",
				{ className: "center waves-effect waves-light btn", onClick: function onClick() {
						return props.onClick("Friends");
					} },
				"Back to all friends"
			),
			React.createElement(
				"div",
				{ className: "header large" },
				" list of ",
				props.friendName,
				"'s movies"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1NpbmdsZUZyaWVuZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZUFBZSxTQUFmLFlBQWUsQ0FBQyxLQUFELEVBQVc7O0FBRzdCLFNBQVEsR0FBUixDQUFZLHNCQUFaLEVBQW1DLE1BQU0sY0FBekM7QUFDQSxLQUFJLE1BQU0sY0FBTixDQUFxQixNQUFyQixLQUFnQyxDQUFwQyxFQUFzQztBQUNyQyxTQUNDO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQSxNQUFRLFNBQVM7QUFBQSxhQUFPLE1BQU0sT0FBTixDQUFjLFNBQWQsQ0FBUDtBQUFBLE1BQWpCO0FBQUE7QUFBQSxJQURBO0FBQytFLGtDQUQvRTtBQUFBO0FBRVEsU0FBTSxVQUFOLENBQWlCLEtBQWpCLENBQXVCLE1BQU0sVUFBTixDQUFpQixPQUFqQixDQUF5QixHQUF6QixJQUE4QixDQUFyRCxFQUF1RCxNQUFNLFVBQU4sQ0FBaUIsV0FBakIsQ0FBNkIsR0FBN0IsQ0FBdkQsQ0FGUjtBQUFBO0FBQUEsR0FERDtBQU9BLEVBUkQsTUFRTztBQUNOLFNBQ0M7QUFBQTtBQUFBLEtBQUssV0FBVSxpQkFBZjtBQUNBO0FBQUE7QUFBQSxNQUFHLFdBQVUscUNBQWIsRUFBbUQsU0FBUztBQUFBLGFBQU8sTUFBTSxPQUFOLENBQWMsU0FBZCxDQUFQO0FBQUEsTUFBNUQ7QUFBQTtBQUFBLElBREE7QUFFQTtBQUFBO0FBQUEsTUFBSyxXQUFVLGNBQWY7QUFBQTtBQUF3QyxVQUFNLFVBQTlDO0FBQUE7QUFBQSxJQUZBO0FBR0E7QUFBQTtBQUFBLE1BQUssV0FBVSxnQkFBZjtBQUNFLFVBQU0sY0FBTixDQUFxQixHQUFyQixDQUF5QjtBQUFBLFlBQVMsb0JBQUMsY0FBRCxJQUFnQixZQUFZLE1BQU0sVUFBbEMsRUFBOEMsT0FBTyxLQUFyRCxFQUE0RCxRQUFRLE1BQU0sTUFBMUUsR0FBVDtBQUFBLEtBQXpCO0FBREY7QUFIQSxHQUREO0FBU0E7QUFDRCxDQXZCRDs7QUF5QkEsT0FBTyxZQUFQLEdBQXNCLFlBQXRCIiwiZmlsZSI6IlNpbmdsZUZyaWVuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBTaW5nbGVGcmllbmQgPSAocHJvcHMpID0+IHtcblxuXG5cdGNvbnNvbGUubG9nKCdwcm9wcy5tb3ZpZXNPZkZyaWVuZCcscHJvcHMubW92aWVzT2ZGcmllbmQpXG5cdGlmIChwcm9wcy5tb3ZpZXNPZkZyaWVuZC5sZW5ndGggPT09IDApe1xuXHRcdHJldHVybiAoXG5cdFx0XHQ8ZGl2PlxuXHRcdFx0PGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiAocHJvcHMub25DbGljayhcIkZyaWVuZHNcIikpfT5CYWNrIHRvIGFsbCBmcmllbmRzPC9idXR0b24+PGJyLz5cblx0XHRcdFNvcnJ5LCB7cHJvcHMuZnJpZW5kTmFtZS5zbGljZShwcm9wcy5mcmllbmROYW1lLmluZGV4T2YoXCI+XCIpKzEscHJvcHMuZnJpZW5kTmFtZS5sYXN0SW5kZXhPZihcIjxcIikpfSBoYXNuJ3QgcmF0ZWQgYW55IG1vdmllcy5cblx0XHRcdDwvZGl2PlxuXHRcdFx0KVxuXG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIChcblx0ICA8ZGl2IGNsYXNzTmFtZT1cIkhvbWUgY29sbGVjdGlvblwiPlxuXHRcdFx0PGEgY2xhc3NOYW1lPVwiY2VudGVyIHdhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXsoKSA9PiAocHJvcHMub25DbGljayhcIkZyaWVuZHNcIikpfT5CYWNrIHRvIGFsbCBmcmllbmRzPC9hPlxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJoZWFkZXIgbGFyZ2VcIj4gbGlzdCBvZiB7cHJvcHMuZnJpZW5kTmFtZX0ncyBtb3ZpZXM8L2Rpdj5cblx0XHRcdDxkaXYgY2xhc3NOYW1lPSdtb3ZpZXNPZkZyaWVuZCc+XG5cdFx0XHRcdHtwcm9wcy5tb3ZpZXNPZkZyaWVuZC5tYXAobW92aWUgPT4gPE1vdmllTGlzdEVudHJ5IGZyaWVuZE5hbWU9e3Byb3BzLmZyaWVuZE5hbWV9IG1vdmllPXttb3ZpZX0gY2hhbmdlPXtwcm9wcy5jaGFuZ2V9Lz4gKX1cblx0XHRcdDwvZGl2PlxuXHRcdDwvZGl2PlxuXHRcdClcblx0fVxufTtcblxud2luZG93LlNpbmdsZUZyaWVuZCA9IFNpbmdsZUZyaWVuZDtcbiJdfQ==
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL1NpbmdsZUZyaWVuZC5qcyJdLCJuYW1lcyI6WyJTaW5nbGVGcmllbmQiLCJwcm9wcyIsImNvbnNvbGUiLCJsb2ciLCJtb3ZpZXNPZkZyaWVuZCIsImxlbmd0aCIsIm9uQ2xpY2siLCJmcmllbmROYW1lIiwibWFwIiwibW92aWUiLCJjaGFuZ2UiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsZUFBZSxTQUFmQSxZQUFlLENBQUNDLEtBQUQsRUFBVzs7QUFHOUJDLFNBQVFDLEdBQVIsQ0FBWSxzQkFBWixFQUFtQ0YsTUFBTUcsY0FBekM7QUFDQSxLQUFJSCxNQUFNRyxjQUFOLENBQXFCQyxNQUFyQixLQUE4QixDQUFsQyxFQUFvQztBQUNuQyxTQUNDO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQSxNQUFRLFNBQVM7QUFBQSxhQUFPSixNQUFNSyxPQUFOLENBQWMsU0FBZCxDQUFQO0FBQUEsTUFBakI7QUFBQTtBQUFBLElBREE7QUFDK0Usa0NBRC9FO0FBQUE7QUFFUUwsU0FBTU0sVUFGZDtBQUFBO0FBQUEsR0FERDtBQU9BLEVBUkQsTUFRTztBQUNOLFNBQ0M7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBLE1BQVEsU0FBUztBQUFBLGFBQU9OLE1BQU1LLE9BQU4sQ0FBYyxTQUFkLENBQVA7QUFBQSxNQUFqQjtBQUFBO0FBQUEsSUFEQTtBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQWNMLFVBQU1NLFVBQXBCO0FBQUE7QUFBQSxJQUZBO0FBR0E7QUFBQTtBQUFBLE1BQUssV0FBVSxnQkFBZjtBQUNFTixVQUFNRyxjQUFOLENBQXFCSSxHQUFyQixDQUF5QjtBQUFBLFlBQVMsb0JBQUMsY0FBRCxJQUFnQixZQUFZUCxNQUFNTSxVQUFsQyxFQUE4QyxPQUFPRSxLQUFyRCxFQUE0RCxRQUFRUixNQUFNUyxNQUExRSxHQUFUO0FBQUEsS0FBekI7QUFERjtBQUhBLEdBREQ7QUFXQTtBQUNBLENBekJEOztBQTJCQUMsT0FBT1gsWUFBUCxHQUFzQkEsWUFBdEIiLCJmaWxlIjoiU2luZ2xlRnJpZW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFNpbmdsZUZyaWVuZCA9IChwcm9wcykgPT4ge1xyXG5cclxuXHJcbmNvbnNvbGUubG9nKCdwcm9wcy5tb3ZpZXNPZkZyaWVuZCcscHJvcHMubW92aWVzT2ZGcmllbmQpXHJcbmlmIChwcm9wcy5tb3ZpZXNPZkZyaWVuZC5sZW5ndGg9PT0wKXtcclxuXHRyZXR1cm4gKFxyXG5cdFx0PGRpdj5cclxuXHRcdDxidXR0b24gb25DbGljaz17KCkgPT4gKHByb3BzLm9uQ2xpY2soXCJGcmllbmRzXCIpKX0+QmFjayB0byBhbGwgZnJpZW5kczwvYnV0dG9uPjxici8+XHJcblx0XHRTb3JyeSwge3Byb3BzLmZyaWVuZE5hbWV9IGhhc24ndCByYXRlZCBhbnkgbW92aWVzLlxyXG5cdFx0PC9kaXY+XHJcblx0XHQpXHJcblxyXG59IGVsc2Uge1xyXG5cdHJldHVybiAoXHJcbiAgPGRpdj5cclxuXHRcdDxidXR0b24gb25DbGljaz17KCkgPT4gKHByb3BzLm9uQ2xpY2soXCJGcmllbmRzXCIpKX0+QmFjayB0byBhbGwgZnJpZW5kczwvYnV0dG9uPlxyXG5cdFx0PGgyPiBMaXN0IG9mIHtwcm9wcy5mcmllbmROYW1lfSdzIE1vdmllczwvaDI+XHJcblx0XHQ8ZGl2IGNsYXNzTmFtZT0nbW92aWVzT2ZGcmllbmQnPlxyXG5cdFx0XHR7cHJvcHMubW92aWVzT2ZGcmllbmQubWFwKG1vdmllID0+IDxNb3ZpZUxpc3RFbnRyeSBmcmllbmROYW1lPXtwcm9wcy5mcmllbmROYW1lfSBtb3ZpZT17bW92aWV9IGNoYW5nZT17cHJvcHMuY2hhbmdlfS8+ICl9XHJcblx0XHQ8L2Rpdj5cclxuXHQ8L2Rpdj5cclxuXHJcblxyXG5cdClcclxufVxyXG59O1xyXG5cclxud2luZG93LlNpbmdsZUZyaWVuZCA9IFNpbmdsZUZyaWVuZDtcclxuIl19
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1NpbmdsZUZyaWVuZC5qcyJdLCJuYW1lcyI6WyJTaW5nbGVGcmllbmQiLCJwcm9wcyIsImNvbnNvbGUiLCJsb2ciLCJtb3ZpZXNPZkZyaWVuZCIsImxlbmd0aCIsIm9uQ2xpY2siLCJmcmllbmROYW1lIiwic2xpY2UiLCJpbmRleE9mIiwibGFzdEluZGV4T2YiLCJtYXAiLCJtb3ZpZSIsImNoYW5nZSIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxlQUFlLFNBQWZBLFlBQWUsQ0FBQ0MsS0FBRCxFQUFXOztBQUc3QkMsU0FBUUMsR0FBUixDQUFZLHNCQUFaLEVBQW1DRixNQUFNRyxjQUF6QztBQUNBLEtBQUlILE1BQU1HLGNBQU4sQ0FBcUJDLE1BQXJCLEtBQWdDLENBQXBDLEVBQXNDO0FBQ3JDLFNBQ0M7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBLE1BQVEsU0FBUztBQUFBLGFBQU9KLE1BQU1LLE9BQU4sQ0FBYyxTQUFkLENBQVA7QUFBQSxNQUFqQjtBQUFBO0FBQUEsSUFEQTtBQUMrRSxrQ0FEL0U7QUFBQTtBQUVRTCxTQUFNTSxVQUFOLENBQWlCQyxLQUFqQixDQUF1QlAsTUFBTU0sVUFBTixDQUFpQkUsT0FBakIsQ0FBeUIsR0FBekIsSUFBOEIsQ0FBckQsRUFBdURSLE1BQU1NLFVBQU4sQ0FBaUJHLFdBQWpCLENBQTZCLEdBQTdCLENBQXZELENBRlI7QUFBQTtBQUFBLEdBREQ7QUFPQSxFQVJELE1BUU87QUFDTixTQUNDO0FBQUE7QUFBQSxLQUFLLFdBQVUsaUJBQWY7QUFDQTtBQUFBO0FBQUEsTUFBRyxXQUFVLHFDQUFiLEVBQW1ELFNBQVM7QUFBQSxhQUFPVCxNQUFNSyxPQUFOLENBQWMsU0FBZCxDQUFQO0FBQUEsTUFBNUQ7QUFBQTtBQUFBLElBREE7QUFFQTtBQUFBO0FBQUEsTUFBSyxXQUFVLGNBQWY7QUFBQTtBQUF3Q0wsVUFBTU0sVUFBOUM7QUFBQTtBQUFBLElBRkE7QUFHQTtBQUFBO0FBQUEsTUFBSyxXQUFVLGdCQUFmO0FBQ0VOLFVBQU1HLGNBQU4sQ0FBcUJPLEdBQXJCLENBQXlCO0FBQUEsWUFBUyxvQkFBQyxjQUFELElBQWdCLFlBQVlWLE1BQU1NLFVBQWxDLEVBQThDLE9BQU9LLEtBQXJELEVBQTRELFFBQVFYLE1BQU1ZLE1BQTFFLEdBQVQ7QUFBQSxLQUF6QjtBQURGO0FBSEEsR0FERDtBQVNBO0FBQ0QsQ0F2QkQ7O0FBeUJBQyxPQUFPZCxZQUFQLEdBQXNCQSxZQUF0QiIsImZpbGUiOiJTaW5nbGVGcmllbmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgU2luZ2xlRnJpZW5kID0gKHByb3BzKSA9PiB7XG5cblxuXHRjb25zb2xlLmxvZygncHJvcHMubW92aWVzT2ZGcmllbmQnLHByb3BzLm1vdmllc09mRnJpZW5kKVxuXHRpZiAocHJvcHMubW92aWVzT2ZGcmllbmQubGVuZ3RoID09PSAwKXtcblx0XHRyZXR1cm4gKFxuXHRcdFx0PGRpdj5cblx0XHRcdDxidXR0b24gb25DbGljaz17KCkgPT4gKHByb3BzLm9uQ2xpY2soXCJGcmllbmRzXCIpKX0+QmFjayB0byBhbGwgZnJpZW5kczwvYnV0dG9uPjxici8+XG5cdFx0XHRTb3JyeSwge3Byb3BzLmZyaWVuZE5hbWUuc2xpY2UocHJvcHMuZnJpZW5kTmFtZS5pbmRleE9mKFwiPlwiKSsxLHByb3BzLmZyaWVuZE5hbWUubGFzdEluZGV4T2YoXCI8XCIpKX0gaGFzbid0IHJhdGVkIGFueSBtb3ZpZXMuXG5cdFx0XHQ8L2Rpdj5cblx0XHRcdClcblxuXHR9IGVsc2Uge1xuXHRcdHJldHVybiAoXG5cdCAgPGRpdiBjbGFzc05hbWU9XCJIb21lIGNvbGxlY3Rpb25cIj5cblx0XHRcdDxhIGNsYXNzTmFtZT1cImNlbnRlciB3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17KCkgPT4gKHByb3BzLm9uQ2xpY2soXCJGcmllbmRzXCIpKX0+QmFjayB0byBhbGwgZnJpZW5kczwvYT5cblx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyIGxhcmdlXCI+IGxpc3Qgb2Yge3Byb3BzLmZyaWVuZE5hbWV9J3MgbW92aWVzPC9kaXY+XG5cdFx0XHQ8ZGl2IGNsYXNzTmFtZT0nbW92aWVzT2ZGcmllbmQnPlxuXHRcdFx0XHR7cHJvcHMubW92aWVzT2ZGcmllbmQubWFwKG1vdmllID0+IDxNb3ZpZUxpc3RFbnRyeSBmcmllbmROYW1lPXtwcm9wcy5mcmllbmROYW1lfSBtb3ZpZT17bW92aWV9IGNoYW5nZT17cHJvcHMuY2hhbmdlfS8+ICl9XG5cdFx0XHQ8L2Rpdj5cblx0XHQ8L2Rpdj5cblx0XHQpXG5cdH1cbn07XG5cbndpbmRvdy5TaW5nbGVGcmllbmQgPSBTaW5nbGVGcmllbmQ7XG4iXX0=
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1NpbmdsZUZyaWVuZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZUFBZSxTQUFmLFlBQWUsQ0FBQyxLQUFELEVBQVc7O0FBRzlCLFNBQVEsR0FBUixDQUFZLHNCQUFaLEVBQW1DLE1BQU0sY0FBekM7QUFDQSxLQUFJLE1BQU0sY0FBTixDQUFxQixNQUFyQixLQUFnQyxDQUFwQyxFQUFzQztBQUNyQyxTQUNDO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQSxNQUFRLFNBQVM7QUFBQSxhQUFPLE1BQU0sT0FBTixDQUFjLFNBQWQsQ0FBUDtBQUFBLE1BQWpCO0FBQUE7QUFBQSxJQURBO0FBQytFLGtDQUQvRTtBQUFBO0FBRVEsU0FBTSxVQUFOLENBQWlCLEtBQWpCLENBQXVCLE1BQU0sVUFBTixDQUFpQixPQUFqQixDQUF5QixHQUF6QixJQUE4QixDQUFyRCxFQUF1RCxNQUFNLFVBQU4sQ0FBaUIsV0FBakIsQ0FBNkIsR0FBN0IsQ0FBdkQsQ0FGUjtBQUFBO0FBQUEsR0FERDtBQU9BLEVBUkQsTUFRTztBQUNOLFNBQ0M7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBLE1BQVEsU0FBUztBQUFBLGFBQU8sTUFBTSxPQUFOLENBQWMsU0FBZCxDQUFQO0FBQUEsTUFBakI7QUFBQTtBQUFBLElBREE7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFjLFVBQU0sVUFBcEI7QUFBQTtBQUFBLElBRkE7QUFHQTtBQUFBO0FBQUEsTUFBSyxXQUFVLGdCQUFmO0FBQ0UsVUFBTSxjQUFOLENBQXFCLEdBQXJCLENBQXlCO0FBQUEsWUFBUyxvQkFBQyxjQUFELElBQWdCLFlBQVksTUFBTSxVQUFsQyxFQUE4QyxPQUFPLEtBQXJELEVBQTRELFFBQVEsTUFBTSxNQUExRSxHQUFUO0FBQUEsS0FBekI7QUFERjtBQUhBLEdBREQ7QUFXQTtBQUNBLENBekJEOztBQTJCQSxPQUFPLFlBQVAsR0FBc0IsWUFBdEIiLCJmaWxlIjoiU2luZ2xlRnJpZW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIFNpbmdsZUZyaWVuZCA9IChwcm9wcykgPT4ge1xuXG5cbmNvbnNvbGUubG9nKCdwcm9wcy5tb3ZpZXNPZkZyaWVuZCcscHJvcHMubW92aWVzT2ZGcmllbmQpXG5pZiAocHJvcHMubW92aWVzT2ZGcmllbmQubGVuZ3RoID09PSAwKXtcblx0cmV0dXJuIChcblx0XHQ8ZGl2PlxuXHRcdDxidXR0b24gb25DbGljaz17KCkgPT4gKHByb3BzLm9uQ2xpY2soXCJGcmllbmRzXCIpKX0+QmFjayB0byBhbGwgZnJpZW5kczwvYnV0dG9uPjxici8+XG5cdFx0U29ycnksIHtwcm9wcy5mcmllbmROYW1lLnNsaWNlKHByb3BzLmZyaWVuZE5hbWUuaW5kZXhPZihcIj5cIikrMSxwcm9wcy5mcmllbmROYW1lLmxhc3RJbmRleE9mKFwiPFwiKSl9IGhhc24ndCByYXRlZCBhbnkgbW92aWVzLlxuXHRcdDwvZGl2PlxuXHRcdClcblxufSBlbHNlIHtcblx0cmV0dXJuIChcbiAgPGRpdj5cblx0XHQ8YnV0dG9uIG9uQ2xpY2s9eygpID0+IChwcm9wcy5vbkNsaWNrKFwiRnJpZW5kc1wiKSl9PkJhY2sgdG8gYWxsIGZyaWVuZHM8L2J1dHRvbj5cblx0XHQ8aDI+IExpc3Qgb2Yge3Byb3BzLmZyaWVuZE5hbWV9J3MgTW92aWVzPC9oMj5cblx0XHQ8ZGl2IGNsYXNzTmFtZT0nbW92aWVzT2ZGcmllbmQnPlxuXHRcdFx0e3Byb3BzLm1vdmllc09mRnJpZW5kLm1hcChtb3ZpZSA9PiA8TW92aWVMaXN0RW50cnkgZnJpZW5kTmFtZT17cHJvcHMuZnJpZW5kTmFtZX0gbW92aWU9e21vdmllfSBjaGFuZ2U9e3Byb3BzLmNoYW5nZX0vPiApfVxuXHRcdDwvZGl2PlxuXHQ8L2Rpdj5cblxuXG5cdClcbn1cbn07XG5cbndpbmRvdy5TaW5nbGVGcmllbmQgPSBTaW5nbGVGcmllbmQ7XG4iXX0=
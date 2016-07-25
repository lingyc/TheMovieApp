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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL1NpbmdsZUZyaWVuZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZUFBZSxTQUFmLFlBQWUsQ0FBQyxLQUFELEVBQVc7O0FBRzlCLFNBQVEsR0FBUixDQUFZLHNCQUFaLEVBQW1DLE1BQU0sY0FBekM7QUFDQSxLQUFJLE1BQU0sY0FBTixDQUFxQixNQUFyQixLQUE4QixDQUFsQyxFQUFvQztBQUNuQyxTQUNDO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQSxNQUFRLFNBQVM7QUFBQSxhQUFPLE1BQU0sT0FBTixDQUFjLFNBQWQsQ0FBUDtBQUFBLE1BQWpCO0FBQUE7QUFBQSxJQURBO0FBQytFLGtDQUQvRTtBQUFBO0FBRVEsU0FBTSxVQUZkO0FBQUE7QUFBQSxHQUREO0FBT0EsRUFSRCxNQVFPO0FBQ04sU0FDQztBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUEsTUFBUSxTQUFTO0FBQUEsYUFBTyxNQUFNLE9BQU4sQ0FBYyxTQUFkLENBQVA7QUFBQSxNQUFqQjtBQUFBO0FBQUEsSUFEQTtBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQWMsVUFBTSxVQUFwQjtBQUFBO0FBQUEsSUFGQTtBQUdBO0FBQUE7QUFBQSxNQUFLLFdBQVUsZ0JBQWY7QUFDRSxVQUFNLGNBQU4sQ0FBcUIsR0FBckIsQ0FBeUI7QUFBQSxZQUFTLG9CQUFDLGNBQUQsSUFBZ0IsWUFBWSxNQUFNLFVBQWxDLEVBQThDLE9BQU8sS0FBckQsRUFBNEQsUUFBUSxNQUFNLE1BQTFFLEdBQVQ7QUFBQSxLQUF6QjtBQURGO0FBSEEsR0FERDtBQVdBO0FBQ0EsQ0F6QkQ7O0FBMkJBLE9BQU8sWUFBUCxHQUFzQixZQUF0QiIsImZpbGUiOiJTaW5nbGVGcmllbmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgU2luZ2xlRnJpZW5kID0gKHByb3BzKSA9PiB7XG5cblxuY29uc29sZS5sb2coJ3Byb3BzLm1vdmllc09mRnJpZW5kJyxwcm9wcy5tb3ZpZXNPZkZyaWVuZClcbmlmIChwcm9wcy5tb3ZpZXNPZkZyaWVuZC5sZW5ndGg9PT0wKXtcblx0cmV0dXJuIChcblx0XHQ8ZGl2PlxuXHRcdDxidXR0b24gb25DbGljaz17KCkgPT4gKHByb3BzLm9uQ2xpY2soXCJGcmllbmRzXCIpKX0+QmFjayB0byBhbGwgZnJpZW5kczwvYnV0dG9uPjxici8+XG5cdFx0U29ycnksIHtwcm9wcy5mcmllbmROYW1lfSBoYXNuJ3QgcmF0ZWQgYW55IG1vdmllcy5cblx0XHQ8L2Rpdj5cblx0XHQpXG5cbn0gZWxzZSB7XG5cdHJldHVybiAoXG4gIDxkaXY+XG5cdFx0PGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiAocHJvcHMub25DbGljayhcIkZyaWVuZHNcIikpfT5CYWNrIHRvIGFsbCBmcmllbmRzPC9idXR0b24+XG5cdFx0PGgyPiBMaXN0IG9mIHtwcm9wcy5mcmllbmROYW1lfSdzIE1vdmllczwvaDI+XG5cdFx0PGRpdiBjbGFzc05hbWU9J21vdmllc09mRnJpZW5kJz5cblx0XHRcdHtwcm9wcy5tb3ZpZXNPZkZyaWVuZC5tYXAobW92aWUgPT4gPE1vdmllTGlzdEVudHJ5IGZyaWVuZE5hbWU9e3Byb3BzLmZyaWVuZE5hbWV9IG1vdmllPXttb3ZpZX0gY2hhbmdlPXtwcm9wcy5jaGFuZ2V9Lz4gKX1cblx0XHQ8L2Rpdj5cblx0PC9kaXY+XG5cblxuXHQpXG59XG59O1xuXG53aW5kb3cuU2luZ2xlRnJpZW5kID0gU2luZ2xlRnJpZW5kO1xuIl19
"use strict";

var SingleFriend = function SingleFriend(_ref) {
	var moviesOfFriend = _ref.moviesOfFriend;
	var _onClick = _ref.onClick;
	var friendName = _ref.friendName;
	var change = _ref.change;


	console.log('props.moviesOfFriend', moviesOfFriend);
	if (!moviesOfFriend.length) {
		return React.createElement(
			"div",
			null,
			React.createElement(
				"button",
				{ onClick: function onClick() {
						return _onClick("Friends");
					} },
				"Back to all friends"
			),
			React.createElement("br", null),
			"Sorry, ",
			friendName.slice(friendName.indexOf(">") + 1, friendName.lastIndexOf("<")),
			" hasn't rated any movies."
		);
	} else {
		return React.createElement(
			"div",
			{ className: "Home collection" },
			React.createElement(
				"a",
				{ className: "center waves-effect waves-light btn", onClick: function onClick() {
						return _onClick("Friends");
					} },
				"Back to all friends"
			),
			React.createElement(
				"div",
				{ className: "header large" },
				" list of ",
				friendName,
				"'s movies"
			),
			React.createElement(
				"div",
				{ className: "moviesOfFriend" },
				moviesOfFriend.map(function (movie) {
					return React.createElement(MovieListEntry, { friendName: friendName, movie: movie, change: change });
				})
			)
		);
	}
};

window.SingleFriend = SingleFriend;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1NpbmdsZUZyaWVuZC5qcyJdLCJuYW1lcyI6WyJTaW5nbGVGcmllbmQiLCJtb3ZpZXNPZkZyaWVuZCIsIm9uQ2xpY2siLCJmcmllbmROYW1lIiwiY2hhbmdlIiwiY29uc29sZSIsImxvZyIsImxlbmd0aCIsInNsaWNlIiwiaW5kZXhPZiIsImxhc3RJbmRleE9mIiwibWFwIiwibW92aWUiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsZUFBZSxTQUFmQSxZQUFlLE9BQWlEO0FBQUEsS0FBL0NDLGNBQStDLFFBQS9DQSxjQUErQztBQUFBLEtBQWhDQyxRQUFnQyxRQUFoQ0EsT0FBZ0M7QUFBQSxLQUF4QkMsVUFBd0IsUUFBeEJBLFVBQXdCO0FBQUEsS0FBWkMsTUFBWSxRQUFaQSxNQUFZOzs7QUFHbkVDLFNBQVFDLEdBQVIsQ0FBWSxzQkFBWixFQUFvQ0wsY0FBcEM7QUFDQSxLQUFJLENBQUNBLGVBQWVNLE1BQXBCLEVBQTJCO0FBQzFCLFNBQ0M7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBLE1BQVEsU0FBUztBQUFBLGFBQU9MLFNBQVEsU0FBUixDQUFQO0FBQUEsTUFBakI7QUFBQTtBQUFBLElBREE7QUFDeUUsa0NBRHpFO0FBQUE7QUFFUUMsY0FBV0ssS0FBWCxDQUFpQkwsV0FBV00sT0FBWCxDQUFtQixHQUFuQixJQUEwQixDQUEzQyxFQUE4Q04sV0FBV08sV0FBWCxDQUF1QixHQUF2QixDQUE5QyxDQUZSO0FBQUE7QUFBQSxHQUREO0FBT0EsRUFSRCxNQVFPO0FBQ04sU0FDQztBQUFBO0FBQUEsS0FBSyxXQUFVLGlCQUFmO0FBQ0E7QUFBQTtBQUFBLE1BQUcsV0FBVSxxQ0FBYixFQUFtRCxTQUFTO0FBQUEsYUFBT1IsU0FBUSxTQUFSLENBQVA7QUFBQSxNQUE1RDtBQUFBO0FBQUEsSUFEQTtBQUVBO0FBQUE7QUFBQSxNQUFLLFdBQVUsY0FBZjtBQUFBO0FBQXdDQyxjQUF4QztBQUFBO0FBQUEsSUFGQTtBQUdBO0FBQUE7QUFBQSxNQUFLLFdBQVUsZ0JBQWY7QUFDRUYsbUJBQWVVLEdBQWYsQ0FBbUI7QUFBQSxZQUFTLG9CQUFDLGNBQUQsSUFBZ0IsWUFBWVIsVUFBNUIsRUFBd0MsT0FBT1MsS0FBL0MsRUFBc0QsUUFBUVIsTUFBOUQsR0FBVDtBQUFBLEtBQW5CO0FBREY7QUFIQSxHQUREO0FBU0E7QUFDRCxDQXZCRDs7QUF5QkFTLE9BQU9iLFlBQVAsR0FBc0JBLFlBQXRCIiwiZmlsZSI6IlNpbmdsZUZyaWVuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBTaW5nbGVGcmllbmQgPSAoe21vdmllc09mRnJpZW5kLG9uQ2xpY2ssZnJpZW5kTmFtZSwgY2hhbmdlfSkgPT4ge1xyXG5cclxuXHJcblx0Y29uc29sZS5sb2coJ3Byb3BzLm1vdmllc09mRnJpZW5kJywgbW92aWVzT2ZGcmllbmQpXHJcblx0aWYgKCFtb3ZpZXNPZkZyaWVuZC5sZW5ndGgpe1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdj5cclxuXHRcdFx0PGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiAob25DbGljayhcIkZyaWVuZHNcIikpfT5CYWNrIHRvIGFsbCBmcmllbmRzPC9idXR0b24+PGJyLz5cclxuXHRcdFx0U29ycnksIHtmcmllbmROYW1lLnNsaWNlKGZyaWVuZE5hbWUuaW5kZXhPZihcIj5cIikgKyAxLCBmcmllbmROYW1lLmxhc3RJbmRleE9mKFwiPFwiKSl9IGhhc24ndCByYXRlZCBhbnkgbW92aWVzLlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0KVxyXG5cclxuXHR9IGVsc2Uge1xyXG5cdFx0cmV0dXJuIChcclxuXHQgIDxkaXYgY2xhc3NOYW1lPVwiSG9tZSBjb2xsZWN0aW9uXCI+XHJcblx0XHRcdDxhIGNsYXNzTmFtZT1cImNlbnRlciB3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17KCkgPT4gKG9uQ2xpY2soXCJGcmllbmRzXCIpKX0+QmFjayB0byBhbGwgZnJpZW5kczwvYT5cclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJoZWFkZXIgbGFyZ2VcIj4gbGlzdCBvZiB7ZnJpZW5kTmFtZX0ncyBtb3ZpZXM8L2Rpdj5cclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J21vdmllc09mRnJpZW5kJz5cclxuXHRcdFx0XHR7bW92aWVzT2ZGcmllbmQubWFwKG1vdmllID0+IDxNb3ZpZUxpc3RFbnRyeSBmcmllbmROYW1lPXtmcmllbmROYW1lfSBtb3ZpZT17bW92aWV9IGNoYW5nZT17Y2hhbmdlfS8+ICl9XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0PC9kaXY+XHJcblx0XHQpXHJcblx0fVxyXG59O1xyXG5cclxud2luZG93LlNpbmdsZUZyaWVuZCA9IFNpbmdsZUZyaWVuZDtcclxuIl19
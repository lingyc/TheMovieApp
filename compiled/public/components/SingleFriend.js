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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL1NpbmdsZUZyaWVuZC5qcyJdLCJuYW1lcyI6WyJTaW5nbGVGcmllbmQiLCJwcm9wcyIsImNvbnNvbGUiLCJsb2ciLCJtb3ZpZXNPZkZyaWVuZCIsImxlbmd0aCIsIm9uQ2xpY2siLCJmcmllbmROYW1lIiwic2xpY2UiLCJpbmRleE9mIiwibGFzdEluZGV4T2YiLCJtYXAiLCJtb3ZpZSIsImNoYW5nZSIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxlQUFlLFNBQWZBLFlBQWUsQ0FBQ0MsS0FBRCxFQUFXOztBQUc3QkMsU0FBUUMsR0FBUixDQUFZLHNCQUFaLEVBQW1DRixNQUFNRyxjQUF6QztBQUNBLEtBQUlILE1BQU1HLGNBQU4sQ0FBcUJDLE1BQXJCLEtBQWdDLENBQXBDLEVBQXNDO0FBQ3JDLFNBQ0M7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBLE1BQVEsU0FBUztBQUFBLGFBQU9KLE1BQU1LLE9BQU4sQ0FBYyxTQUFkLENBQVA7QUFBQSxNQUFqQjtBQUFBO0FBQUEsSUFEQTtBQUMrRSxrQ0FEL0U7QUFBQTtBQUVRTCxTQUFNTSxVQUFOLENBQWlCQyxLQUFqQixDQUF1QlAsTUFBTU0sVUFBTixDQUFpQkUsT0FBakIsQ0FBeUIsR0FBekIsSUFBOEIsQ0FBckQsRUFBdURSLE1BQU1NLFVBQU4sQ0FBaUJHLFdBQWpCLENBQTZCLEdBQTdCLENBQXZELENBRlI7QUFBQTtBQUFBLEdBREQ7QUFPQSxFQVJELE1BUU87QUFDTixTQUNDO0FBQUE7QUFBQSxLQUFLLFdBQVUsaUJBQWY7QUFDQTtBQUFBO0FBQUEsTUFBRyxXQUFVLHFDQUFiLEVBQW1ELFNBQVM7QUFBQSxhQUFPVCxNQUFNSyxPQUFOLENBQWMsU0FBZCxDQUFQO0FBQUEsTUFBNUQ7QUFBQTtBQUFBLElBREE7QUFFQTtBQUFBO0FBQUEsTUFBSyxXQUFVLGNBQWY7QUFBQTtBQUF3Q0wsVUFBTU0sVUFBOUM7QUFBQTtBQUFBLElBRkE7QUFHQTtBQUFBO0FBQUEsTUFBSyxXQUFVLGdCQUFmO0FBQ0VOLFVBQU1HLGNBQU4sQ0FBcUJPLEdBQXJCLENBQXlCO0FBQUEsWUFBUyxvQkFBQyxjQUFELElBQWdCLFlBQVlWLE1BQU1NLFVBQWxDLEVBQThDLE9BQU9LLEtBQXJELEVBQTRELFFBQVFYLE1BQU1ZLE1BQTFFLEdBQVQ7QUFBQSxLQUF6QjtBQURGO0FBSEEsR0FERDtBQVNBO0FBQ0QsQ0F2QkQ7O0FBeUJBQyxPQUFPZCxZQUFQLEdBQXNCQSxZQUF0QiIsImZpbGUiOiJTaW5nbGVGcmllbmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgU2luZ2xlRnJpZW5kID0gKHByb3BzKSA9PiB7XHJcblxyXG5cclxuXHRjb25zb2xlLmxvZygncHJvcHMubW92aWVzT2ZGcmllbmQnLHByb3BzLm1vdmllc09mRnJpZW5kKVxyXG5cdGlmIChwcm9wcy5tb3ZpZXNPZkZyaWVuZC5sZW5ndGggPT09IDApe1xyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0PGRpdj5cclxuXHRcdFx0PGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiAocHJvcHMub25DbGljayhcIkZyaWVuZHNcIikpfT5CYWNrIHRvIGFsbCBmcmllbmRzPC9idXR0b24+PGJyLz5cclxuXHRcdFx0U29ycnksIHtwcm9wcy5mcmllbmROYW1lLnNsaWNlKHByb3BzLmZyaWVuZE5hbWUuaW5kZXhPZihcIj5cIikrMSxwcm9wcy5mcmllbmROYW1lLmxhc3RJbmRleE9mKFwiPFwiKSl9IGhhc24ndCByYXRlZCBhbnkgbW92aWVzLlxyXG5cdFx0XHQ8L2Rpdj5cclxuXHRcdFx0KVxyXG5cclxuXHR9IGVsc2Uge1xyXG5cdFx0cmV0dXJuIChcclxuXHQgIDxkaXYgY2xhc3NOYW1lPVwiSG9tZSBjb2xsZWN0aW9uXCI+XHJcblx0XHRcdDxhIGNsYXNzTmFtZT1cImNlbnRlciB3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17KCkgPT4gKHByb3BzLm9uQ2xpY2soXCJGcmllbmRzXCIpKX0+QmFjayB0byBhbGwgZnJpZW5kczwvYT5cclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9XCJoZWFkZXIgbGFyZ2VcIj4gbGlzdCBvZiB7cHJvcHMuZnJpZW5kTmFtZX0ncyBtb3ZpZXM8L2Rpdj5cclxuXHRcdFx0PGRpdiBjbGFzc05hbWU9J21vdmllc09mRnJpZW5kJz5cclxuXHRcdFx0XHR7cHJvcHMubW92aWVzT2ZGcmllbmQubWFwKG1vdmllID0+IDxNb3ZpZUxpc3RFbnRyeSBmcmllbmROYW1lPXtwcm9wcy5mcmllbmROYW1lfSBtb3ZpZT17bW92aWV9IGNoYW5nZT17cHJvcHMuY2hhbmdlfS8+ICl9XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0PC9kaXY+XHJcblx0XHQpXHJcblx0fVxyXG59O1xyXG5cclxud2luZG93LlNpbmdsZUZyaWVuZCA9IFNpbmdsZUZyaWVuZDtcclxuIl19
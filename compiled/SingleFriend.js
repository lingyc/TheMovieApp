"use strict";

var SingleFriend = function SingleFriend(props) {
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
};

window.SingleFriend = SingleFriend;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL1NpbmdsZUZyaWVuZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksZUFBZSxTQUFmLFlBQWUsQ0FBQyxLQUFEO0FBQUEsUUFDakI7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBLEtBQVEsU0FBUztBQUFBLFlBQU8sTUFBTSxPQUFOLENBQWMsU0FBZCxDQUFQO0FBQUEsS0FBakI7QUFBQTtBQUFBLEdBREE7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFjLFNBQU0sVUFBcEI7QUFBQTtBQUFBLEdBRkE7QUFHQTtBQUFBO0FBQUEsS0FBSyxXQUFVLGdCQUFmO0FBQ0UsU0FBTSxjQUFOLENBQXFCLEdBQXJCLENBQXlCO0FBQUEsV0FBUyxvQkFBQyxjQUFELElBQWdCLFlBQVksTUFBTSxVQUFsQyxFQUE4QyxPQUFPLEtBQXJELEVBQTRELFFBQVEsTUFBTSxNQUExRSxHQUFUO0FBQUEsSUFBekI7QUFERjtBQUhBLEVBRGlCO0FBQUEsQ0FBbkI7O0FBWUEsT0FBTyxZQUFQLEdBQXNCLFlBQXRCIiwiZmlsZSI6IlNpbmdsZUZyaWVuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBTaW5nbGVGcmllbmQgPSAocHJvcHMpID0+IChcbiAgPGRpdj5cblx0XHQ8YnV0dG9uIG9uQ2xpY2s9eygpID0+IChwcm9wcy5vbkNsaWNrKFwiRnJpZW5kc1wiKSl9PkJhY2sgdG8gYWxsIGZyaWVuZHM8L2J1dHRvbj5cblx0XHQ8aDI+IExpc3Qgb2Yge3Byb3BzLmZyaWVuZE5hbWV9J3MgTW92aWVzPC9oMj5cblx0XHQ8ZGl2IGNsYXNzTmFtZT0nbW92aWVzT2ZGcmllbmQnPlxuXHRcdFx0e3Byb3BzLm1vdmllc09mRnJpZW5kLm1hcChtb3ZpZSA9PiA8TW92aWVMaXN0RW50cnkgZnJpZW5kTmFtZT17cHJvcHMuZnJpZW5kTmFtZX0gbW92aWU9e21vdmllfSBjaGFuZ2U9e3Byb3BzLmNoYW5nZX0vPiApfVxuXHRcdDwvZGl2PlxuXHQ8L2Rpdj5cblxuXG5cdCk7XG5cbndpbmRvdy5TaW5nbGVGcmllbmQgPSBTaW5nbGVGcmllbmQ7XG4iXX0=
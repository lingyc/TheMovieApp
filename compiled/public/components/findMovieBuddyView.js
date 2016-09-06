"use strict";

var FindMovieBuddy = function FindMovieBuddy(props) {
	var empty = props.buddies.length === 0 ? "You've friended everybody!" : "";
	return React.createElement(
		"div",
		{ className: "movieBuddy collection" },
		React.createElement(
			"div",
			{ className: "header" },
			"find your next movie buddy"
		),
		React.createElement("br", null),
		empty,
		React.createElement(
			"div",
			{ style: { display: 'none' }, id: "AlreadyReq2" },
			"You have already sent a request to this user!"
		),
		React.createElement("br", null),
		props.buddies.map(function (buddy) {
			if (buddy[1] === null) {
				buddy[1] = 'Nothing to compare';
			}return React.createElement(BuddyEntry, { buddyfunc: props.buddyfunc, Buddy: buddy[0], BuddyScore: buddy[1] });
		})
	);
};

window.FindMovieBuddy = FindMovieBuddy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL2ZpbmRNb3ZpZUJ1ZGR5Vmlldy5qcyJdLCJuYW1lcyI6WyJGaW5kTW92aWVCdWRkeSIsInByb3BzIiwiZW1wdHkiLCJidWRkaWVzIiwibGVuZ3RoIiwiZGlzcGxheSIsIm1hcCIsImJ1ZGR5IiwiYnVkZHlmdW5jIiwid2luZG93Il0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLGlCQUFpQixTQUFqQkEsY0FBaUIsQ0FBQ0MsS0FBRCxFQUFXO0FBQy9CLEtBQUlDLFFBQU9ELE1BQU1FLE9BQU4sQ0FBY0MsTUFBZCxLQUF1QixDQUF2QixHQUF5Qiw0QkFBekIsR0FBc0QsRUFBakU7QUFDQyxRQUVBO0FBQUE7QUFBQSxJQUFLLFdBQVUsdUJBQWY7QUFDQztBQUFBO0FBQUEsS0FBSyxXQUFVLFFBQWY7QUFBQTtBQUFBLEdBREQ7QUFDeUQsaUNBRHpEO0FBRUVGLE9BRkY7QUFHQztBQUFBO0FBQUEsS0FBSyxPQUFPLEVBQUNHLFNBQVEsTUFBVCxFQUFaLEVBQThCLElBQUcsYUFBakM7QUFBQTtBQUFBLEdBSEQ7QUFHbUcsaUNBSG5HO0FBSUVKLFFBQU1FLE9BQU4sQ0FBY0csR0FBZCxDQUFrQixVQUFTQyxLQUFULEVBQWU7QUFBRSxPQUFJQSxNQUFNLENBQU4sTUFBVyxJQUFmLEVBQXFCO0FBQUNBLFVBQU0sQ0FBTixJQUFTLG9CQUFUO0FBQThCLElBQUMsT0FBUSxvQkFBQyxVQUFELElBQVksV0FBV04sTUFBTU8sU0FBN0IsRUFBd0MsT0FBT0QsTUFBTSxDQUFOLENBQS9DLEVBQXlELFlBQVlBLE1BQU0sQ0FBTixDQUFyRSxHQUFSO0FBQTRGLEdBQXBMO0FBSkYsRUFGQTtBQVdBLENBYkY7O0FBZUFFLE9BQU9ULGNBQVAsR0FBd0JBLGNBQXhCIiwiZmlsZSI6ImZpbmRNb3ZpZUJ1ZGR5Vmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBGaW5kTW92aWVCdWRkeSA9IChwcm9wcykgPT4ge1xyXG5cdHZhciBlbXB0eSA9cHJvcHMuYnVkZGllcy5sZW5ndGg9PT0wP1wiWW91J3ZlIGZyaWVuZGVkIGV2ZXJ5Ym9keSFcIjpcIlwiO1xyXG4gIHJldHVybiAoXHJcblxyXG4gIDxkaXYgY2xhc3NOYW1lPSdtb3ZpZUJ1ZGR5IGNvbGxlY3Rpb24nPlxyXG5cdCAgPGRpdiBjbGFzc05hbWU9J2hlYWRlcic+ZmluZCB5b3VyIG5leHQgbW92aWUgYnVkZHk8L2Rpdj48YnIvPlxyXG5cdCAge2VtcHR5fVxyXG5cdCAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J25vbmUnfX0gaWQ9J0FscmVhZHlSZXEyJz5Zb3UgaGF2ZSBhbHJlYWR5IHNlbnQgYSByZXF1ZXN0IHRvIHRoaXMgdXNlciE8L2Rpdj48YnIvPlxyXG5cdCAge3Byb3BzLmJ1ZGRpZXMubWFwKGZ1bmN0aW9uKGJ1ZGR5KXsgaWYgKGJ1ZGR5WzFdPT09bnVsbCkge2J1ZGR5WzFdPSdOb3RoaW5nIHRvIGNvbXBhcmUnfSByZXR1cm4gKDxCdWRkeUVudHJ5IGJ1ZGR5ZnVuYz17cHJvcHMuYnVkZHlmdW5jfSBCdWRkeT17YnVkZHlbMF19IEJ1ZGR5U2NvcmU9e2J1ZGR5WzFdfSAvPiApfSl9XHJcblxyXG4gIDwvZGl2PlxyXG4gICBcclxuXHJcbil9O1xyXG5cclxud2luZG93LkZpbmRNb3ZpZUJ1ZGR5ID0gRmluZE1vdmllQnVkZHk7Il19
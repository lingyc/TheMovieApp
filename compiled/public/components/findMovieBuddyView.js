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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL2ZpbmRNb3ZpZUJ1ZGR5Vmlldy5qcyJdLCJuYW1lcyI6WyJGaW5kTW92aWVCdWRkeSIsInByb3BzIiwiZW1wdHkiLCJidWRkaWVzIiwibGVuZ3RoIiwiZGlzcGxheSIsIm1hcCIsImJ1ZGR5IiwiYnVkZHlmdW5jIiwid2luZG93Il0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLGlCQUFpQixTQUFqQkEsY0FBaUIsQ0FBQ0MsS0FBRCxFQUFXO0FBQy9CLEtBQUlDLFFBQU9ELE1BQU1FLE9BQU4sQ0FBY0MsTUFBZCxLQUF1QixDQUF2QixHQUF5Qiw0QkFBekIsR0FBc0QsRUFBakU7QUFDQyxRQUVBO0FBQUE7QUFBQSxJQUFLLFdBQVUsdUJBQWY7QUFDQztBQUFBO0FBQUEsS0FBSyxXQUFVLFFBQWY7QUFBQTtBQUFBLEdBREQ7QUFDeUQsaUNBRHpEO0FBRUVGLE9BRkY7QUFHQztBQUFBO0FBQUEsS0FBSyxPQUFPLEVBQUNHLFNBQVEsTUFBVCxFQUFaLEVBQThCLElBQUcsYUFBakM7QUFBQTtBQUFBLEdBSEQ7QUFHbUcsaUNBSG5HO0FBSUVKLFFBQU1FLE9BQU4sQ0FBY0csR0FBZCxDQUFrQixVQUFTQyxLQUFULEVBQWU7QUFBRSxPQUFJQSxNQUFNLENBQU4sTUFBVyxJQUFmLEVBQXFCO0FBQUNBLFVBQU0sQ0FBTixJQUFTLG9CQUFUO0FBQThCLElBQUMsT0FBUSxvQkFBQyxVQUFELElBQVksV0FBV04sTUFBTU8sU0FBN0IsRUFBd0MsT0FBT0QsTUFBTSxDQUFOLENBQS9DLEVBQXlELFlBQVlBLE1BQU0sQ0FBTixDQUFyRSxHQUFSO0FBQTRGLEdBQXBMO0FBSkYsRUFGQTtBQVdBLENBYkY7O0FBZUFFLE9BQU9ULGNBQVAsR0FBd0JBLGNBQXhCIiwiZmlsZSI6ImZpbmRNb3ZpZUJ1ZGR5Vmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBGaW5kTW92aWVCdWRkeSA9IChwcm9wcykgPT4ge1xuXHR2YXIgZW1wdHkgPXByb3BzLmJ1ZGRpZXMubGVuZ3RoPT09MD9cIllvdSd2ZSBmcmllbmRlZCBldmVyeWJvZHkhXCI6XCJcIjtcbiAgcmV0dXJuIChcblxuICA8ZGl2IGNsYXNzTmFtZT0nbW92aWVCdWRkeSBjb2xsZWN0aW9uJz5cblx0ICA8ZGl2IGNsYXNzTmFtZT0naGVhZGVyJz5maW5kIHlvdXIgbmV4dCBtb3ZpZSBidWRkeTwvZGl2Pjxici8+XG5cdCAge2VtcHR5fVxuXHQgIDxkaXYgc3R5bGU9e3tkaXNwbGF5Oidub25lJ319IGlkPSdBbHJlYWR5UmVxMic+WW91IGhhdmUgYWxyZWFkeSBzZW50IGEgcmVxdWVzdCB0byB0aGlzIHVzZXIhPC9kaXY+PGJyLz5cblx0ICB7cHJvcHMuYnVkZGllcy5tYXAoZnVuY3Rpb24oYnVkZHkpeyBpZiAoYnVkZHlbMV09PT1udWxsKSB7YnVkZHlbMV09J05vdGhpbmcgdG8gY29tcGFyZSd9IHJldHVybiAoPEJ1ZGR5RW50cnkgYnVkZHlmdW5jPXtwcm9wcy5idWRkeWZ1bmN9IEJ1ZGR5PXtidWRkeVswXX0gQnVkZHlTY29yZT17YnVkZHlbMV19IC8+ICl9KX1cblxuICA8L2Rpdj5cbiAgIFxuXG4pfTtcblxud2luZG93LkZpbmRNb3ZpZUJ1ZGR5ID0gRmluZE1vdmllQnVkZHk7Il19
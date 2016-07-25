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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL2ZpbmRNb3ZpZUJ1ZGR5Vmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksaUJBQWlCLFNBQWpCLGNBQWlCLENBQUMsS0FBRCxFQUFXO0FBQy9CLEtBQUksUUFBTyxNQUFNLE9BQU4sQ0FBYyxNQUFkLEtBQXVCLENBQXZCLEdBQXlCLDRCQUF6QixHQUFzRCxFQUFqRTtBQUNDLFFBRUE7QUFBQTtBQUFBLElBQUssV0FBVSx1QkFBZjtBQUNDO0FBQUE7QUFBQSxLQUFLLFdBQVUsUUFBZjtBQUFBO0FBQUEsR0FERDtBQUN5RCxpQ0FEekQ7QUFFRSxPQUZGO0FBR0M7QUFBQTtBQUFBLEtBQUssT0FBTyxFQUFDLFNBQVEsTUFBVCxFQUFaLEVBQThCLElBQUcsYUFBakM7QUFBQTtBQUFBLEdBSEQ7QUFHbUcsaUNBSG5HO0FBSUUsUUFBTSxPQUFOLENBQWMsR0FBZCxDQUFrQixVQUFTLEtBQVQsRUFBZTtBQUFFLE9BQUksTUFBTSxDQUFOLE1BQVcsSUFBZixFQUFxQjtBQUFDLFVBQU0sQ0FBTixJQUFTLG9CQUFUO0FBQThCLElBQUMsT0FBUSxvQkFBQyxVQUFELElBQVksV0FBVyxNQUFNLFNBQTdCLEVBQXdDLE9BQU8sTUFBTSxDQUFOLENBQS9DLEVBQXlELFlBQVksTUFBTSxDQUFOLENBQXJFLEdBQVI7QUFBNEYsR0FBcEw7QUFKRixFQUZBO0FBV0EsQ0FiRjs7QUFlQSxPQUFPLGNBQVAsR0FBd0IsY0FBeEIiLCJmaWxlIjoiZmluZE1vdmllQnVkZHlWaWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEZpbmRNb3ZpZUJ1ZGR5ID0gKHByb3BzKSA9PiB7XG5cdHZhciBlbXB0eSA9cHJvcHMuYnVkZGllcy5sZW5ndGg9PT0wP1wiWW91J3ZlIGZyaWVuZGVkIGV2ZXJ5Ym9keSFcIjpcIlwiO1xuICByZXR1cm4gKFxuXG4gIDxkaXYgY2xhc3NOYW1lPSdtb3ZpZUJ1ZGR5IGNvbGxlY3Rpb24nPlxuXHQgIDxkaXYgY2xhc3NOYW1lPSdoZWFkZXInPmZpbmQgeW91ciBuZXh0IG1vdmllIGJ1ZGR5PC9kaXY+PGJyLz5cblx0ICB7ZW1wdHl9XG5cdCAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J25vbmUnfX0gaWQ9J0FscmVhZHlSZXEyJz5Zb3UgaGF2ZSBhbHJlYWR5IHNlbnQgYSByZXF1ZXN0IHRvIHRoaXMgdXNlciE8L2Rpdj48YnIvPlxuXHQgIHtwcm9wcy5idWRkaWVzLm1hcChmdW5jdGlvbihidWRkeSl7IGlmIChidWRkeVsxXT09PW51bGwpIHtidWRkeVsxXT0nTm90aGluZyB0byBjb21wYXJlJ30gcmV0dXJuICg8QnVkZHlFbnRyeSBidWRkeWZ1bmM9e3Byb3BzLmJ1ZGR5ZnVuY30gQnVkZHk9e2J1ZGR5WzBdfSBCdWRkeVNjb3JlPXtidWRkeVsxXX0gLz4gKX0pfVxuXG4gIDwvZGl2PlxuICAgXG5cbil9O1xuXG53aW5kb3cuRmluZE1vdmllQnVkZHkgPSBGaW5kTW92aWVCdWRkeTsiXX0=
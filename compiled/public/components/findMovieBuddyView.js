"use strict";

var FindMovieBuddy = function FindMovieBuddy(_ref) {
	var buddyfunc = _ref.buddyfunc;
	var buddies = _ref.buddies;

	var empty = buddies.length === 0 ? "You've friended everybody!" : "";
	return React.createElement(
		"div",
		{ className: "movieBuddy collection" },
		React.createElement(
			"div",
			{ className: "header" },
			"Find Your Next Movie Buddy"
		),
		React.createElement("br", null),
		empty,
		React.createElement(
			"div",
			{ style: { display: 'none' }, id: "AlreadyReq2" },
			"You have already sent a request to this user!"
		),
		React.createElement("br", null),
		buddies.map(function (buddy) {
			if (buddy[1] === null) {
				buddy[1] = 'Nothing to compare';
			}return React.createElement(BuddyEntry, { buddyfunc: buddyfunc, Buddy: buddy[0], BuddyScore: buddy[1] });
		})
	);
};

window.FindMovieBuddy = FindMovieBuddy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL2ZpbmRNb3ZpZUJ1ZGR5Vmlldy5qcyJdLCJuYW1lcyI6WyJGaW5kTW92aWVCdWRkeSIsImJ1ZGR5ZnVuYyIsImJ1ZGRpZXMiLCJlbXB0eSIsImxlbmd0aCIsImRpc3BsYXkiLCJtYXAiLCJidWRkeSIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxpQkFBaUIsU0FBakJBLGNBQWlCLE9BQTBCO0FBQUEsS0FBeEJDLFNBQXdCLFFBQXhCQSxTQUF3QjtBQUFBLEtBQWJDLE9BQWEsUUFBYkEsT0FBYTs7QUFDaEQsS0FBSUMsUUFBTUQsUUFBUUUsTUFBUixLQUFpQixDQUFqQixHQUFtQiw0QkFBbkIsR0FBZ0QsRUFBMUQ7QUFDQyxRQUNBO0FBQUE7QUFBQSxJQUFLLFdBQVUsdUJBQWY7QUFDQztBQUFBO0FBQUEsS0FBSyxXQUFVLFFBQWY7QUFBQTtBQUFBLEdBREQ7QUFDeUQsaUNBRHpEO0FBRUVELE9BRkY7QUFHQztBQUFBO0FBQUEsS0FBSyxPQUFPLEVBQUNFLFNBQVEsTUFBVCxFQUFaLEVBQThCLElBQUcsYUFBakM7QUFBQTtBQUFBLEdBSEQ7QUFHbUcsaUNBSG5HO0FBSUVILFVBQVFJLEdBQVIsQ0FBWSxpQkFBTztBQUFFLE9BQUlDLE1BQU0sQ0FBTixNQUFXLElBQWYsRUFBcUI7QUFBQ0EsVUFBTSxDQUFOLElBQVMsb0JBQVQ7QUFBOEIsSUFBQyxPQUFRLG9CQUFDLFVBQUQsSUFBWSxXQUFXTixTQUF2QixFQUFrQyxPQUFPTSxNQUFNLENBQU4sQ0FBekMsRUFBbUQsWUFBWUEsTUFBTSxDQUFOLENBQS9ELEdBQVI7QUFBc0YsR0FBaEs7QUFKRixFQURBO0FBU0EsQ0FYRjs7QUFhQUMsT0FBT1IsY0FBUCxHQUF3QkEsY0FBeEIiLCJmaWxlIjoiZmluZE1vdmllQnVkZHlWaWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgRmluZE1vdmllQnVkZHkgPSAoe2J1ZGR5ZnVuYywgYnVkZGllc30pID0+IHtcclxuXHRsZXQgZW1wdHk9YnVkZGllcy5sZW5ndGg9PT0wP1wiWW91J3ZlIGZyaWVuZGVkIGV2ZXJ5Ym9keSFcIjpcIlwiO1xyXG4gIHJldHVybiAoXHJcbiAgPGRpdiBjbGFzc05hbWU9J21vdmllQnVkZHkgY29sbGVjdGlvbic+XHJcblx0ICA8ZGl2IGNsYXNzTmFtZT0naGVhZGVyJz5GaW5kIFlvdXIgTmV4dCBNb3ZpZSBCdWRkeTwvZGl2Pjxici8+XHJcblx0ICB7ZW1wdHl9XHJcblx0ICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonbm9uZSd9fSBpZD0nQWxyZWFkeVJlcTInPllvdSBoYXZlIGFscmVhZHkgc2VudCBhIHJlcXVlc3QgdG8gdGhpcyB1c2VyITwvZGl2Pjxici8+XHJcblx0ICB7YnVkZGllcy5tYXAoYnVkZHk9PnsgaWYgKGJ1ZGR5WzFdPT09bnVsbCkge2J1ZGR5WzFdPSdOb3RoaW5nIHRvIGNvbXBhcmUnfSByZXR1cm4gKDxCdWRkeUVudHJ5IGJ1ZGR5ZnVuYz17YnVkZHlmdW5jfSBCdWRkeT17YnVkZHlbMF19IEJ1ZGR5U2NvcmU9e2J1ZGR5WzFdfSAvPiApfSl9XHJcblxyXG4gIDwvZGl2PlxyXG4gICBcclxuKX07XHJcblxyXG53aW5kb3cuRmluZE1vdmllQnVkZHkgPSBGaW5kTW92aWVCdWRkeTsiXX0=
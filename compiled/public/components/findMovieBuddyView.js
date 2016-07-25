"use strict";

var FindMovieBuddy = function FindMovieBuddy(props) {
  var empty = props.buddies.length === 0 ? "You've friended everybody!" : "";
  return React.createElement(
    "div",
    null,
    React.createElement(
      "h2",
      null,
      "Your Potential Movie Buddies"
    ),
    "  ",
    React.createElement("br", null),
    empty,
    React.createElement(
      "div",
      { style: { display: 'none' }, id: "AlreadyReq2" },
      "Youve already sent a request to this user!"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL2ZpbmRNb3ZpZUJ1ZGR5Vmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksaUJBQWlCLFNBQWpCLGNBQWlCLENBQUMsS0FBRCxFQUFXO0FBQ2hDLE1BQUksUUFBTSxNQUFNLE9BQU4sQ0FBYyxNQUFkLEtBQXVCLENBQXZCLEdBQXlCLDRCQUF6QixHQUFzRCxFQUFoRTtBQUNFLFNBRUM7QUFBQTtBQUFBO0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQUZBO0FBQUE7QUFFdUMsbUNBRnZDO0FBR0MsU0FIRDtBQUlBO0FBQUE7QUFBQSxRQUFLLE9BQU8sRUFBQyxTQUFRLE1BQVQsRUFBWixFQUE4QixJQUFHLGFBQWpDO0FBQUE7QUFBQSxLQUpBO0FBSStGLG1DQUovRjtBQU1DLFVBQU0sT0FBTixDQUFjLEdBQWQsQ0FBa0IsVUFBUyxLQUFULEVBQWU7QUFBRSxVQUFJLE1BQU0sQ0FBTixNQUFXLElBQWYsRUFBb0I7QUFBQyxjQUFNLENBQU4sSUFBUyxvQkFBVDtBQUE4QixPQUFDLE9BQVEsb0JBQUMsVUFBRCxJQUFZLFdBQVcsTUFBTSxTQUE3QixFQUF3QyxPQUFPLE1BQU0sQ0FBTixDQUEvQyxFQUF5RCxZQUFZLE1BQU0sQ0FBTixDQUFyRSxHQUFSO0FBQTRGLEtBQW5MO0FBTkQsR0FGRDtBQWFBLENBZkY7O0FBaUJBLE9BQU8sY0FBUCxHQUF3QixjQUF4QiIsImZpbGUiOiJmaW5kTW92aWVCdWRkeVZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgRmluZE1vdmllQnVkZHkgPSAocHJvcHMpID0+IHtcbnZhciBlbXB0eT1wcm9wcy5idWRkaWVzLmxlbmd0aD09PTA/XCJZb3UndmUgZnJpZW5kZWQgZXZlcnlib2R5IVwiOlwiXCI7XG4gIHJldHVybiAoXG5cbiAgIDxkaXY+XG5cbiAgIDxoMj5Zb3VyIFBvdGVudGlhbCBNb3ZpZSBCdWRkaWVzPC9oMj4gIDxici8+XG4gICB7ZW1wdHl9XG4gICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTonbm9uZSd9fSBpZD0nQWxyZWFkeVJlcTInPllvdXZlIGFscmVhZHkgc2VudCBhIHJlcXVlc3QgdG8gdGhpcyB1c2VyITwvZGl2Pjxici8+XG5cbiAgIHtwcm9wcy5idWRkaWVzLm1hcChmdW5jdGlvbihidWRkeSl7IGlmIChidWRkeVsxXT09PW51bGwpe2J1ZGR5WzFdPSdOb3RoaW5nIHRvIGNvbXBhcmUnfSByZXR1cm4gKDxCdWRkeUVudHJ5IGJ1ZGR5ZnVuYz17cHJvcHMuYnVkZHlmdW5jfSBCdWRkeT17YnVkZHlbMF19IEJ1ZGR5U2NvcmU9e2J1ZGR5WzFdfSAvPiApfSl9XG5cbiAgICAgPC9kaXY+XG4gICBcblxuKX07XG5cbndpbmRvdy5GaW5kTW92aWVCdWRkeSA9IEZpbmRNb3ZpZUJ1ZGR5OyJdfQ==
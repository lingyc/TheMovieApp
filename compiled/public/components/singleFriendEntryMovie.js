"use strict";

var FriendMovieEntry = function FriendMovieEntry(props) {

  return React.createElement(
    "div",
    { className: "FriendMovieEntry" },
    React.createElement(
      "h2",
      null,
      "Title:",
      props.name
    ),
    React.createElement("br", null),
    React.createElement(
      "h3",
      null,
      "Rating:",
      props.rating
    ),
    React.createElement("br", null),
    React.createElement(
      "p",
      null,
      React.createElement(
        "i",
        null,
        "Comments:",
        props.review
      )
    ),
    React.createElement("br", null)
  );
};

window.FriendMovieEntry = FriendMovieEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL3NpbmdsZUZyaWVuZEVudHJ5TW92aWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLG1CQUFtQixTQUFuQixnQkFBbUIsQ0FBQyxLQUFELEVBQVc7O0FBR2hDLFNBQ0E7QUFBQTtBQUFBLE1BQUssV0FBVSxrQkFBZjtBQUNDO0FBQUE7QUFBQTtBQUFBO0FBQVcsWUFBTTtBQUFqQixLQUREO0FBQzRCLG1DQUQ1QjtBQUVDO0FBQUE7QUFBQTtBQUFBO0FBQVksWUFBTTtBQUFsQixLQUZEO0FBRStCLG1DQUYvQjtBQUdDO0FBQUE7QUFBQTtBQUFHO0FBQUE7QUFBQTtBQUFBO0FBQWEsY0FBTTtBQUFuQjtBQUFILEtBSEQ7QUFHc0M7QUFIdEMsR0FEQTtBQU1BLENBVEY7O0FBV0EsT0FBTyxnQkFBUCxHQUEwQixnQkFBMUIiLCJmaWxlIjoic2luZ2xlRnJpZW5kRW50cnlNb3ZpZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBGcmllbmRNb3ZpZUVudHJ5ID0gKHByb3BzKSA9PiB7XG5cblxuICByZXR1cm4gKFxuICA8ZGl2IGNsYXNzTmFtZT1cIkZyaWVuZE1vdmllRW50cnlcIj5cbiAgIDxoMj5UaXRsZTp7cHJvcHMubmFtZX08L2gyPjxici8+XG4gICA8aDM+UmF0aW5nOntwcm9wcy5yYXRpbmd9PC9oMz48YnIvPlxuICAgPHA+PGk+Q29tbWVudHM6e3Byb3BzLnJldmlld308L2k+PC9wPjxici8+XG4gIDwvZGl2PlxuKX07XG5cbndpbmRvdy5GcmllbmRNb3ZpZUVudHJ5ID0gRnJpZW5kTW92aWVFbnRyeTsiXX0=
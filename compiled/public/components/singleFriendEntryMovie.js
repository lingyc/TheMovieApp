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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL3NpbmdsZUZyaWVuZEVudHJ5TW92aWUuanMiXSwibmFtZXMiOlsiRnJpZW5kTW92aWVFbnRyeSIsInByb3BzIiwibmFtZSIsInJhdGluZyIsInJldmlldyIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxtQkFBbUIsU0FBbkJBLGdCQUFtQixDQUFDQyxLQUFELEVBQVc7O0FBR2hDLFNBQ0E7QUFBQTtBQUFBLE1BQUssV0FBVSxrQkFBZjtBQUNDO0FBQUE7QUFBQTtBQUFBO0FBQVdBLFlBQU1DO0FBQWpCLEtBREQ7QUFDNEIsbUNBRDVCO0FBRUM7QUFBQTtBQUFBO0FBQUE7QUFBWUQsWUFBTUU7QUFBbEIsS0FGRDtBQUUrQixtQ0FGL0I7QUFHQztBQUFBO0FBQUE7QUFBRztBQUFBO0FBQUE7QUFBQTtBQUFhRixjQUFNRztBQUFuQjtBQUFILEtBSEQ7QUFHc0M7QUFIdEMsR0FEQTtBQU1BLENBVEY7O0FBV0FDLE9BQU9MLGdCQUFQLEdBQTBCQSxnQkFBMUIiLCJmaWxlIjoic2luZ2xlRnJpZW5kRW50cnlNb3ZpZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBGcmllbmRNb3ZpZUVudHJ5ID0gKHByb3BzKSA9PiB7XHJcblxyXG5cclxuICByZXR1cm4gKFxyXG4gIDxkaXYgY2xhc3NOYW1lPVwiRnJpZW5kTW92aWVFbnRyeVwiPlxyXG4gICA8aDI+VGl0bGU6e3Byb3BzLm5hbWV9PC9oMj48YnIvPlxyXG4gICA8aDM+UmF0aW5nOntwcm9wcy5yYXRpbmd9PC9oMz48YnIvPlxyXG4gICA8cD48aT5Db21tZW50czp7cHJvcHMucmV2aWV3fTwvaT48L3A+PGJyLz5cclxuICA8L2Rpdj5cclxuKX07XHJcblxyXG53aW5kb3cuRnJpZW5kTW92aWVFbnRyeSA9IEZyaWVuZE1vdmllRW50cnk7Il19
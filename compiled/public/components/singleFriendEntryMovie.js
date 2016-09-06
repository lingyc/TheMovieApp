"use strict";

var FriendMovieEntry = function FriendMovieEntry(_ref) {
  var name = _ref.name;
  var rating = _ref.rating;
  var review = _ref.review;


  return React.createElement(
    "div",
    { className: "FriendMovieEntry" },
    React.createElement(
      "h2",
      null,
      "Title:",
      name
    ),
    React.createElement("br", null),
    React.createElement(
      "h3",
      null,
      "Rating:",
      rating
    ),
    React.createElement("br", null),
    React.createElement(
      "p",
      null,
      React.createElement(
        "i",
        null,
        "Comments:",
        review
      )
    ),
    React.createElement("br", null)
  );
};

window.FriendMovieEntry = FriendMovieEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL3NpbmdsZUZyaWVuZEVudHJ5TW92aWUuanMiXSwibmFtZXMiOlsiRnJpZW5kTW92aWVFbnRyeSIsIm5hbWUiLCJyYXRpbmciLCJyZXZpZXciLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsbUJBQW1CLFNBQW5CQSxnQkFBbUIsT0FBNEI7QUFBQSxNQUExQkMsSUFBMEIsUUFBMUJBLElBQTBCO0FBQUEsTUFBcEJDLE1BQW9CLFFBQXBCQSxNQUFvQjtBQUFBLE1BQVpDLE1BQVksUUFBWkEsTUFBWTs7O0FBR2pELFNBQ0E7QUFBQTtBQUFBLE1BQUssV0FBVSxrQkFBZjtBQUNDO0FBQUE7QUFBQTtBQUFBO0FBQVdGO0FBQVgsS0FERDtBQUNzQixtQ0FEdEI7QUFFQztBQUFBO0FBQUE7QUFBQTtBQUFZQztBQUFaLEtBRkQ7QUFFeUIsbUNBRnpCO0FBR0M7QUFBQTtBQUFBO0FBQUc7QUFBQTtBQUFBO0FBQUE7QUFBYUM7QUFBYjtBQUFILEtBSEQ7QUFHZ0M7QUFIaEMsR0FEQTtBQU1BLENBVEY7O0FBV0FDLE9BQU9KLGdCQUFQLEdBQTBCQSxnQkFBMUIiLCJmaWxlIjoic2luZ2xlRnJpZW5kRW50cnlNb3ZpZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBGcmllbmRNb3ZpZUVudHJ5ID0gKHtuYW1lLCByYXRpbmcsIHJldmlld30pID0+IHtcclxuXHJcblxyXG4gIHJldHVybiAoXHJcbiAgPGRpdiBjbGFzc05hbWU9XCJGcmllbmRNb3ZpZUVudHJ5XCI+XHJcbiAgIDxoMj5UaXRsZTp7bmFtZX08L2gyPjxici8+XHJcbiAgIDxoMz5SYXRpbmc6e3JhdGluZ308L2gzPjxici8+XHJcbiAgIDxwPjxpPkNvbW1lbnRzOntyZXZpZXd9PC9pPjwvcD48YnIvPlxyXG4gIDwvZGl2PlxyXG4pfTtcclxuXHJcbndpbmRvdy5GcmllbmRNb3ZpZUVudHJ5ID0gRnJpZW5kTW92aWVFbnRyeTsiXX0=
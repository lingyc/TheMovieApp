"use strict";

var MovieFriendView = function MovieFriendView() {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "h1",
      null,
      "Star Trek"
    ),
    React.createElement(
      "div",
      { className: "movieFriends" },
      React.createElement(
        "h5",
        null,
        "Friend Ratings"
      ),
      React.createElement(MovieFriendViewEntry, null)
    )
  );
};

window.MovieFriendView = MovieFriendView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL01vdmllRnJpZW5kVmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksa0JBQWtCLFNBQWxCLGVBQWtCO0FBQUEsU0FDcEI7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBO0FBQUE7QUFBQSxLQURGO0FBRUU7QUFBQTtBQUFBLFFBQUssV0FBVSxjQUFmO0FBQ0U7QUFBQTtBQUFBO0FBQUE7QUFBQSxPQURGO0FBRUUsMEJBQUMsb0JBQUQ7QUFGRjtBQUZGLEdBRG9CO0FBQUEsQ0FBdEI7O0FBVUEsT0FBTyxlQUFQLEdBQXlCLGVBQXpCIiwiZmlsZSI6Ik1vdmllRnJpZW5kVmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBNb3ZpZUZyaWVuZFZpZXcgPSAoKSA9PiAoXG4gIDxkaXY+XG4gICAgPGgxPlN0YXIgVHJlazwvaDE+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJtb3ZpZUZyaWVuZHNcIj5cbiAgICAgIDxoNT5GcmllbmQgUmF0aW5nczwvaDU+XG4gICAgICA8TW92aWVGcmllbmRWaWV3RW50cnkgLz5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4pO1xuXG53aW5kb3cuTW92aWVGcmllbmRWaWV3ID0gTW92aWVGcmllbmRWaWV3OyJdfQ==
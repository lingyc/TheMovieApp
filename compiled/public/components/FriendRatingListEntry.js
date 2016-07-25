"use strict";

var FriendRatingListEntry = function FriendRatingListEntry(props) {
  return React.createElement(
    "div",
    { className: "FriendRatingListEntry" },
    React.createElement(
      "span",
      { id: "friend" },
      "Name:",
      props.name,
      "    "
    ),
    React.createElement(
      "span",
      { id: "rating" },
      "Rating:",
      props.rating
    ),
    React.createElement("br", null)
  );
};

window.FriendRatingListEntry = FriendRatingListEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0ZyaWVuZFJhdGluZ0xpc3RFbnRyeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksd0JBQXdCLFNBQXhCLHFCQUF3QixDQUFDLEtBQUQ7QUFBQSxTQUMxQjtBQUFBO0FBQUEsTUFBSyxXQUFVLHVCQUFmO0FBQ0U7QUFBQTtBQUFBLFFBQU0sSUFBRyxRQUFUO0FBQUE7QUFBd0IsWUFBTSxJQUE5QjtBQUFBO0FBQUEsS0FERjtBQUVFO0FBQUE7QUFBQSxRQUFNLElBQUcsUUFBVDtBQUFBO0FBQTBCLFlBQU07QUFBaEMsS0FGRjtBQUdFO0FBSEYsR0FEMEI7QUFBQSxDQUE1Qjs7QUFRQSxPQUFPLHFCQUFQLEdBQStCLHFCQUEvQiIsImZpbGUiOiJGcmllbmRSYXRpbmdMaXN0RW50cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgRnJpZW5kUmF0aW5nTGlzdEVudHJ5ID0gKHByb3BzKSA9PiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwiRnJpZW5kUmF0aW5nTGlzdEVudHJ5XCI+XG4gICAgPHNwYW4gaWQ9XCJmcmllbmRcIj5OYW1lOntwcm9wcy5uYW1lfSAgICA8L3NwYW4+XG4gICAgPHNwYW4gaWQ9XCJyYXRpbmdcIj5SYXRpbmc6e3Byb3BzLnJhdGluZ308L3NwYW4+XG4gICAgPGJyLz5cbiAgPC9kaXY+XG4pO1xuXG53aW5kb3cuRnJpZW5kUmF0aW5nTGlzdEVudHJ5ID0gRnJpZW5kUmF0aW5nTGlzdEVudHJ5OyJdfQ==
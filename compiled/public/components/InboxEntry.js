"use strict";

var InboxEntry = function InboxEntry(_ref) {
  var inboxName = _ref.inboxName;
  var accept = _ref.accept;
  var requestMovie = _ref.requestMovie;
  var decline = _ref.decline;
  var requestType = _ref.requestType;
  var messageInfo = _ref.messageInfo;
  return React.createElement(
    "div",
    { className: "InboxEntry Reponses collection-item row" },
    React.createElement(
      "div",
      { className: "col s3" },
      React.createElement("img", { className: "profilethumnail", src: 'https://unsplash.it/170/170/?random' })
    ),
    React.createElement(
      "div",
      { className: "response col s9" },
      React.createElement(
        "span",
        { className: "inboxFriend" },
        " Name:",
        inboxName,
        React.createElement(
          "a",
          { className: "waves-effect waves-light btn accept", onClick: function onClick() {
              accept(inboxName, requestMovie);
            } },
          "Accept ",
          inboxName,
          "'s ",
          requestType,
          " request ",
          requestMovie
        ),
        React.createElement(
          "a",
          { className: "waves-effect waves-light btn decline", onClick: function onClick() {
              decline(inboxName, requestMovie);
            } },
          "Decline ",
          inboxName,
          "'s ",
          requestType,
          " request ",
          requestMovie
        )
      ),
      React.createElement("br", null),
      " Message:",
      messageInfo === null ? 'No message' : messageInfo
    )
  );
};

window.InboxEntry = InboxEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0luYm94RW50cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNLGFBQWEsU0FBYixVQUFhO0FBQUEsTUFBRSxTQUFGLFFBQUUsU0FBRjtBQUFBLE1BQWEsTUFBYixRQUFhLE1BQWI7QUFBQSxNQUFxQixZQUFyQixRQUFxQixZQUFyQjtBQUFBLE1BQW1DLE9BQW5DLFFBQW1DLE9BQW5DO0FBQUEsTUFBNEMsV0FBNUMsUUFBNEMsV0FBNUM7QUFBQSxNQUF5RCxXQUF6RCxRQUF5RCxXQUF6RDtBQUFBLFNBQ25CO0FBQUE7QUFBQSxNQUFLLFdBQVUseUNBQWY7QUFDRTtBQUFBO0FBQUEsUUFBSyxXQUFVLFFBQWY7QUFDRSxtQ0FBSyxXQUFVLGlCQUFmLEVBQWlDLEtBQU0scUNBQXZDO0FBREYsS0FERjtBQUlFO0FBQUE7QUFBQSxRQUFLLFdBQVUsaUJBQWY7QUFDRTtBQUFBO0FBQUEsVUFBTSxXQUFVLGFBQWhCO0FBQUE7QUFBcUMsaUJBQXJDO0FBQ0k7QUFBQTtBQUFBLFlBQUcsV0FBVSxxQ0FBYixFQUFtRCxTQUFTLG1CQUFJO0FBQUMscUJBQU8sU0FBUCxFQUFrQixZQUFsQjtBQUFnQyxhQUFqRztBQUFBO0FBQ1EsbUJBRFI7QUFBQTtBQUNzQixxQkFEdEI7QUFBQTtBQUM0QztBQUQ1QyxTQURKO0FBR0k7QUFBQTtBQUFBLFlBQUcsV0FBVSxzQ0FBYixFQUFvRCxTQUFTLG1CQUFJO0FBQUMsc0JBQVEsU0FBUixFQUFtQixZQUFuQjtBQUFpQyxhQUFuRztBQUFBO0FBQ1MsbUJBRFQ7QUFBQTtBQUN1QixxQkFEdkI7QUFBQTtBQUM2QztBQUQ3QztBQUhKLE9BREY7QUFNRSxxQ0FORjtBQUFBO0FBTWlCLHNCQUFnQixJQUFoQixHQUF1QixZQUF2QixHQUFzQztBQU52RDtBQUpGLEdBRG1CO0FBQUEsQ0FBbkI7O0FBaUJBLE9BQU8sVUFBUCxHQUFvQixVQUFwQiIsImZpbGUiOiJJbmJveEVudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgSW5ib3hFbnRyeSA9ICh7aW5ib3hOYW1lLCBhY2NlcHQsIHJlcXVlc3RNb3ZpZSwgZGVjbGluZSwgcmVxdWVzdFR5cGUsIG1lc3NhZ2VJbmZvfSkgPT4gKFxuPGRpdiBjbGFzc05hbWU9XCJJbmJveEVudHJ5IFJlcG9uc2VzIGNvbGxlY3Rpb24taXRlbSByb3dcIj5cbiAgPGRpdiBjbGFzc05hbWU9XCJjb2wgczNcIj5cbiAgICA8aW1nIGNsYXNzTmFtZT0ncHJvZmlsZXRodW1uYWlsJyBzcmM9eyAnaHR0cHM6Ly91bnNwbGFzaC5pdC8xNzAvMTcwLz9yYW5kb20nfS8+XG4gIDwvZGl2PlxuICA8ZGl2IGNsYXNzTmFtZT1cInJlc3BvbnNlIGNvbCBzOVwiPlxuICAgIDxzcGFuIGNsYXNzTmFtZT1cImluYm94RnJpZW5kXCI+IE5hbWU6e2luYm94TmFtZX0gXG4gICAgICAgIDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG4gYWNjZXB0XCIgb25DbGljaz17KCk9PnthY2NlcHQoaW5ib3hOYW1lLCByZXF1ZXN0TW92aWUpfX0+IFxuICAgICAgICBBY2NlcHQge2luYm94TmFtZX0ncyB7cmVxdWVzdFR5cGV9IHJlcXVlc3Qge3JlcXVlc3RNb3ZpZX08L2E+XG4gICAgICAgIDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG4gZGVjbGluZVwiIG9uQ2xpY2s9eygpPT57ZGVjbGluZShpbmJveE5hbWUsIHJlcXVlc3RNb3ZpZSl9fT5cbiAgICAgICAgRGVjbGluZSB7aW5ib3hOYW1lfSdzIHtyZXF1ZXN0VHlwZX0gcmVxdWVzdCB7cmVxdWVzdE1vdmllfTwvYT48L3NwYW4+XG4gICAgPGJyLz4gTWVzc2FnZTp7bWVzc2FnZUluZm8gPT09IG51bGwgPyAnTm8gbWVzc2FnZScgOiBtZXNzYWdlSW5mb31cbiAgPC9kaXY+XG48L2Rpdj5cblxuKTtcblxud2luZG93LkluYm94RW50cnkgPSBJbmJveEVudHJ5OyJdfQ==
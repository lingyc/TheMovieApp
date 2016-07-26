"use strict";

var InboxEntry = function InboxEntry(props) {
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
        props.inboxName,
        React.createElement(
          "a",
          { className: "waves-effect waves-light btn accept", onClick: function onClick() {
              props.accept(props.inboxName, props.requestMovie);
            } },
          "Accept ",
          props.inboxName,
          "'s ",
          props.requestType,
          " request ",
          props.requestMovie
        ),
        React.createElement(
          "a",
          { className: "waves-effect waves-light btn decline", onClick: function onClick() {
              props.decline(props.inboxName, props.requestMovie);
            } },
          "Decline ",
          props.inboxName,
          "'s ",
          props.requestType,
          " request ",
          props.requestMovie
        )
      ),
      React.createElement("br", null),
      "Message:",
      props.messageInfo === null ? 'No message' : props.messageInfo
    )
  );
};
window.InboxEntry = InboxEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0luYm94RW50cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGFBQWEsU0FBYixVQUFhLENBQUMsS0FBRCxFQUFXO0FBQzFCLFNBQ0E7QUFBQTtBQUFBLE1BQUssV0FBVSx5Q0FBZjtBQUNNO0FBQUE7QUFBQSxRQUFLLFdBQVUsUUFBZjtBQUNFLG1DQUFLLFdBQVUsaUJBQWYsRUFBaUMsS0FBSyxxQ0FBdEM7QUFERixLQUROO0FBSU07QUFBQTtBQUFBLFFBQUssV0FBVSxpQkFBZjtBQUNBO0FBQUE7QUFBQSxVQUFNLFdBQVUsYUFBaEI7QUFBQTtBQUFxQyxjQUFNLFNBQTNDO0FBQ0E7QUFBQTtBQUFBLFlBQUcsV0FBVSxxQ0FBYixFQUFtRCxTQUFTLG1CQUFVO0FBQUMsb0JBQU0sTUFBTixDQUFhLE1BQU0sU0FBbkIsRUFBOEIsTUFBTSxZQUFwQztBQUFrRCxhQUF6SDtBQUFBO0FBQ1EsZ0JBQU0sU0FEZDtBQUFBO0FBQzRCLGdCQUFNLFdBRGxDO0FBQUE7QUFDd0QsZ0JBQU07QUFEOUQsU0FEQTtBQUdBO0FBQUE7QUFBQSxZQUFHLFdBQVUsc0NBQWIsRUFBb0QsU0FBUyxtQkFBVTtBQUFDLG9CQUFNLE9BQU4sQ0FBYyxNQUFNLFNBQXBCLEVBQStCLE1BQU0sWUFBckM7QUFBbUQsYUFBM0g7QUFBQTtBQUNTLGdCQUFNLFNBRGY7QUFBQTtBQUM2QixnQkFBTSxXQURuQztBQUFBO0FBQ3lELGdCQUFNO0FBRC9EO0FBSEEsT0FEQTtBQU1BLHFDQU5BO0FBQUE7QUFPUyxZQUFNLFdBQU4sS0FBc0IsSUFBdEIsR0FBNkIsWUFBN0IsR0FBNEMsTUFBTTtBQVAzRDtBQUpOLEdBREE7QUFlQSxDQWhCRjtBQWlCQSxPQUFPLFVBQVAsR0FBb0IsVUFBcEIiLCJmaWxlIjoiSW5ib3hFbnRyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBJbmJveEVudHJ5ID0gKHByb3BzKSA9PiB7XG4gIHJldHVybiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwiSW5ib3hFbnRyeSBSZXBvbnNlcyBjb2xsZWN0aW9uLWl0ZW0gcm93XCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sIHMzXCI+XG4gICAgICAgICAgPGltZyBjbGFzc05hbWU9J3Byb2ZpbGV0aHVtbmFpbCcgc3JjPXsnaHR0cHM6Ly91bnNwbGFzaC5pdC8xNzAvMTcwLz9yYW5kb20nfS8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlc3BvbnNlIGNvbCBzOVwiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpbmJveEZyaWVuZFwiPiBOYW1lOntwcm9wcy5pbmJveE5hbWV9IFxuICAgICAgICA8YSBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuIGFjY2VwdFwiIG9uQ2xpY2s9e2Z1bmN0aW9uKCl7cHJvcHMuYWNjZXB0KHByb3BzLmluYm94TmFtZSwgcHJvcHMucmVxdWVzdE1vdmllKX19PiBcbiAgICAgICAgQWNjZXB0IHtwcm9wcy5pbmJveE5hbWV9J3Mge3Byb3BzLnJlcXVlc3RUeXBlfSByZXF1ZXN0IHtwcm9wcy5yZXF1ZXN0TW92aWV9PC9hPiBcbiAgICAgICAgPGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0biBkZWNsaW5lXCIgb25DbGljaz17ZnVuY3Rpb24oKXtwcm9wcy5kZWNsaW5lKHByb3BzLmluYm94TmFtZSwgcHJvcHMucmVxdWVzdE1vdmllKX19PlxuICAgICAgICBEZWNsaW5lIHtwcm9wcy5pbmJveE5hbWV9J3Mge3Byb3BzLnJlcXVlc3RUeXBlfSByZXF1ZXN0IHtwcm9wcy5yZXF1ZXN0TW92aWV9PC9hPjwvc3Bhbj5cbiAgICAgICAgPGJyLz5cbiAgICAgICAgTWVzc2FnZTp7cHJvcHMubWVzc2FnZUluZm8gPT09IG51bGwgPyAnTm8gbWVzc2FnZScgOiBwcm9wcy5tZXNzYWdlSW5mb31cbiAgICAgIDwvZGl2PlxuICA8L2Rpdj5cbil9O1xud2luZG93LkluYm94RW50cnkgPSBJbmJveEVudHJ5OyJdfQ==
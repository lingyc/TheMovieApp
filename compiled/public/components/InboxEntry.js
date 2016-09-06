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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0luYm94RW50cnkuanMiXSwibmFtZXMiOlsiSW5ib3hFbnRyeSIsInByb3BzIiwiaW5ib3hOYW1lIiwiYWNjZXB0IiwicmVxdWVzdE1vdmllIiwicmVxdWVzdFR5cGUiLCJkZWNsaW5lIiwibWVzc2FnZUluZm8iLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsYUFBYSxTQUFiQSxVQUFhLENBQUNDLEtBQUQsRUFBVztBQUMxQixTQUNBO0FBQUE7QUFBQSxNQUFLLFdBQVUseUNBQWY7QUFDTTtBQUFBO0FBQUEsUUFBSyxXQUFVLFFBQWY7QUFDRSxtQ0FBSyxXQUFVLGlCQUFmLEVBQWlDLEtBQUsscUNBQXRDO0FBREYsS0FETjtBQUlNO0FBQUE7QUFBQSxRQUFLLFdBQVUsaUJBQWY7QUFDQTtBQUFBO0FBQUEsVUFBTSxXQUFVLGFBQWhCO0FBQUE7QUFBcUNBLGNBQU1DLFNBQTNDO0FBQ0E7QUFBQTtBQUFBLFlBQUcsV0FBVSxxQ0FBYixFQUFtRCxTQUFTLG1CQUFVO0FBQUNELG9CQUFNRSxNQUFOLENBQWFGLE1BQU1DLFNBQW5CLEVBQThCRCxNQUFNRyxZQUFwQztBQUFrRCxhQUF6SDtBQUFBO0FBQ1FILGdCQUFNQyxTQURkO0FBQUE7QUFDNEJELGdCQUFNSSxXQURsQztBQUFBO0FBQ3dESixnQkFBTUc7QUFEOUQsU0FEQTtBQUdBO0FBQUE7QUFBQSxZQUFHLFdBQVUsc0NBQWIsRUFBb0QsU0FBUyxtQkFBVTtBQUFDSCxvQkFBTUssT0FBTixDQUFjTCxNQUFNQyxTQUFwQixFQUErQkQsTUFBTUcsWUFBckM7QUFBbUQsYUFBM0g7QUFBQTtBQUNTSCxnQkFBTUMsU0FEZjtBQUFBO0FBQzZCRCxnQkFBTUksV0FEbkM7QUFBQTtBQUN5REosZ0JBQU1HO0FBRC9EO0FBSEEsT0FEQTtBQU1BLHFDQU5BO0FBQUE7QUFPU0gsWUFBTU0sV0FBTixLQUFzQixJQUF0QixHQUE2QixZQUE3QixHQUE0Q04sTUFBTU07QUFQM0Q7QUFKTixHQURBO0FBZUEsQ0FoQkY7QUFpQkFDLE9BQU9SLFVBQVAsR0FBb0JBLFVBQXBCIiwiZmlsZSI6IkluYm94RW50cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgSW5ib3hFbnRyeSA9IChwcm9wcykgPT4ge1xyXG4gIHJldHVybiAoXHJcbiAgPGRpdiBjbGFzc05hbWU9XCJJbmJveEVudHJ5IFJlcG9uc2VzIGNvbGxlY3Rpb24taXRlbSByb3dcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbCBzM1wiPlxyXG4gICAgICAgICAgPGltZyBjbGFzc05hbWU9J3Byb2ZpbGV0aHVtbmFpbCcgc3JjPXsnaHR0cHM6Ly91bnNwbGFzaC5pdC8xNzAvMTcwLz9yYW5kb20nfS8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZXNwb25zZSBjb2wgczlcIj5cclxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpbmJveEZyaWVuZFwiPiBOYW1lOntwcm9wcy5pbmJveE5hbWV9IFxyXG4gICAgICAgIDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG4gYWNjZXB0XCIgb25DbGljaz17ZnVuY3Rpb24oKXtwcm9wcy5hY2NlcHQocHJvcHMuaW5ib3hOYW1lLCBwcm9wcy5yZXF1ZXN0TW92aWUpfX0+IFxyXG4gICAgICAgIEFjY2VwdCB7cHJvcHMuaW5ib3hOYW1lfSdzIHtwcm9wcy5yZXF1ZXN0VHlwZX0gcmVxdWVzdCB7cHJvcHMucmVxdWVzdE1vdmllfTwvYT4gXHJcbiAgICAgICAgPGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0biBkZWNsaW5lXCIgb25DbGljaz17ZnVuY3Rpb24oKXtwcm9wcy5kZWNsaW5lKHByb3BzLmluYm94TmFtZSwgcHJvcHMucmVxdWVzdE1vdmllKX19PlxyXG4gICAgICAgIERlY2xpbmUge3Byb3BzLmluYm94TmFtZX0ncyB7cHJvcHMucmVxdWVzdFR5cGV9IHJlcXVlc3Qge3Byb3BzLnJlcXVlc3RNb3ZpZX08L2E+PC9zcGFuPlxyXG4gICAgICAgIDxici8+XHJcbiAgICAgICAgTWVzc2FnZTp7cHJvcHMubWVzc2FnZUluZm8gPT09IG51bGwgPyAnTm8gbWVzc2FnZScgOiBwcm9wcy5tZXNzYWdlSW5mb31cclxuICAgICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcbil9O1xyXG53aW5kb3cuSW5ib3hFbnRyeSA9IEluYm94RW50cnk7Il19
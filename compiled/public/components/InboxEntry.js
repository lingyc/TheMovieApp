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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0luYm94RW50cnkuanMiXSwibmFtZXMiOlsiSW5ib3hFbnRyeSIsInByb3BzIiwiaW5ib3hOYW1lIiwiYWNjZXB0IiwicmVxdWVzdE1vdmllIiwicmVxdWVzdFR5cGUiLCJkZWNsaW5lIiwibWVzc2FnZUluZm8iLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsYUFBYSxTQUFiQSxVQUFhLENBQUNDLEtBQUQsRUFBVztBQUMxQixTQUNBO0FBQUE7QUFBQSxNQUFLLFdBQVUseUNBQWY7QUFDTTtBQUFBO0FBQUEsUUFBSyxXQUFVLFFBQWY7QUFDRSxtQ0FBSyxXQUFVLGlCQUFmLEVBQWlDLEtBQUsscUNBQXRDO0FBREYsS0FETjtBQUlNO0FBQUE7QUFBQSxRQUFLLFdBQVUsaUJBQWY7QUFDQTtBQUFBO0FBQUEsVUFBTSxXQUFVLGFBQWhCO0FBQUE7QUFBcUNBLGNBQU1DLFNBQTNDO0FBQ0E7QUFBQTtBQUFBLFlBQUcsV0FBVSxxQ0FBYixFQUFtRCxTQUFTLG1CQUFVO0FBQUNELG9CQUFNRSxNQUFOLENBQWFGLE1BQU1DLFNBQW5CLEVBQThCRCxNQUFNRyxZQUFwQztBQUFrRCxhQUF6SDtBQUFBO0FBQ1FILGdCQUFNQyxTQURkO0FBQUE7QUFDNEJELGdCQUFNSSxXQURsQztBQUFBO0FBQ3dESixnQkFBTUc7QUFEOUQsU0FEQTtBQUdBO0FBQUE7QUFBQSxZQUFHLFdBQVUsc0NBQWIsRUFBb0QsU0FBUyxtQkFBVTtBQUFDSCxvQkFBTUssT0FBTixDQUFjTCxNQUFNQyxTQUFwQixFQUErQkQsTUFBTUcsWUFBckM7QUFBbUQsYUFBM0g7QUFBQTtBQUNTSCxnQkFBTUMsU0FEZjtBQUFBO0FBQzZCRCxnQkFBTUksV0FEbkM7QUFBQTtBQUN5REosZ0JBQU1HO0FBRC9EO0FBSEEsT0FEQTtBQU1BLHFDQU5BO0FBQUE7QUFPU0gsWUFBTU0sV0FBTixLQUFzQixJQUF0QixHQUE2QixZQUE3QixHQUE0Q04sTUFBTU07QUFQM0Q7QUFKTixHQURBO0FBZUEsQ0FoQkY7QUFpQkFDLE9BQU9SLFVBQVAsR0FBb0JBLFVBQXBCIiwiZmlsZSI6IkluYm94RW50cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgSW5ib3hFbnRyeSA9IChwcm9wcykgPT4ge1xuICByZXR1cm4gKFxuICA8ZGl2IGNsYXNzTmFtZT1cIkluYm94RW50cnkgUmVwb25zZXMgY29sbGVjdGlvbi1pdGVtIHJvd1wiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbCBzM1wiPlxuICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPSdwcm9maWxldGh1bW5haWwnIHNyYz17J2h0dHBzOi8vdW5zcGxhc2guaXQvMTcwLzE3MC8/cmFuZG9tJ30vPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZXNwb25zZSBjb2wgczlcIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaW5ib3hGcmllbmRcIj4gTmFtZTp7cHJvcHMuaW5ib3hOYW1lfSBcbiAgICAgICAgPGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0biBhY2NlcHRcIiBvbkNsaWNrPXtmdW5jdGlvbigpe3Byb3BzLmFjY2VwdChwcm9wcy5pbmJveE5hbWUsIHByb3BzLnJlcXVlc3RNb3ZpZSl9fT4gXG4gICAgICAgIEFjY2VwdCB7cHJvcHMuaW5ib3hOYW1lfSdzIHtwcm9wcy5yZXF1ZXN0VHlwZX0gcmVxdWVzdCB7cHJvcHMucmVxdWVzdE1vdmllfTwvYT4gXG4gICAgICAgIDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG4gZGVjbGluZVwiIG9uQ2xpY2s9e2Z1bmN0aW9uKCl7cHJvcHMuZGVjbGluZShwcm9wcy5pbmJveE5hbWUsIHByb3BzLnJlcXVlc3RNb3ZpZSl9fT5cbiAgICAgICAgRGVjbGluZSB7cHJvcHMuaW5ib3hOYW1lfSdzIHtwcm9wcy5yZXF1ZXN0VHlwZX0gcmVxdWVzdCB7cHJvcHMucmVxdWVzdE1vdmllfTwvYT48L3NwYW4+XG4gICAgICAgIDxici8+XG4gICAgICAgIE1lc3NhZ2U6e3Byb3BzLm1lc3NhZ2VJbmZvID09PSBudWxsID8gJ05vIG1lc3NhZ2UnIDogcHJvcHMubWVzc2FnZUluZm99XG4gICAgICA8L2Rpdj5cbiAgPC9kaXY+XG4pfTtcbndpbmRvdy5JbmJveEVudHJ5ID0gSW5ib3hFbnRyeTsiXX0=
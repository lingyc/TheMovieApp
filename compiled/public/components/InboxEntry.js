"use strict";

var InboxEntry = function InboxEntry(props) {

  return React.createElement(
    "div",
    { className: "InboxEntry" },
    React.createElement(
      "span",
      { className: "inboxFriend" },
      " Name:",
      props.inboxName,
      " ",
      React.createElement(
        "button",
        { className: "accept", onClick: function onClick() {
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
        "button",
        { className: "decline", onClick: function onClick() {
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
    props.messageInfo
  );
};

window.InboxEntry = InboxEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0luYm94RW50cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGFBQWEsU0FBYixVQUFhLENBQUMsS0FBRCxFQUFXOztBQUUxQixTQUNBO0FBQUE7QUFBQSxNQUFLLFdBQVUsWUFBZjtBQUNFO0FBQUE7QUFBQSxRQUFNLFdBQVUsYUFBaEI7QUFBQTtBQUFxQyxZQUFNLFNBQTNDO0FBQUE7QUFBc0Q7QUFBQTtBQUFBLFVBQVEsV0FBVSxRQUFsQixFQUEyQixTQUFTLG1CQUFVO0FBQUMsa0JBQU0sTUFBTixDQUFhLE1BQU0sU0FBbkIsRUFBOEIsTUFBTSxZQUFwQztBQUFrRCxXQUFqRztBQUFBO0FBQzlDLGNBQU0sU0FEd0M7QUFBQTtBQUMxQixjQUFNLFdBRG9CO0FBQUE7QUFDRSxjQUFNO0FBRFIsT0FBdEQ7QUFFQTtBQUFBO0FBQUEsVUFBUSxXQUFVLFNBQWxCLEVBQTRCLFNBQVMsbUJBQVU7QUFBQyxrQkFBTSxPQUFOLENBQWMsTUFBTSxTQUFwQixFQUErQixNQUFNLFlBQXJDO0FBQW1ELFdBQW5HO0FBQUE7QUFDUyxjQUFNLFNBRGY7QUFBQTtBQUM2QixjQUFNLFdBRG5DO0FBQUE7QUFDeUQsY0FBTTtBQUQvRDtBQUZBLEtBREY7QUFLRSxtQ0FMRjtBQUFBO0FBTVcsVUFBTTtBQU5qQixHQURBO0FBU0EsQ0FYRjs7QUFhQSxPQUFPLFVBQVAsR0FBb0IsVUFBcEIiLCJmaWxlIjoiSW5ib3hFbnRyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBJbmJveEVudHJ5ID0gKHByb3BzKSA9PiB7XG5cbiAgcmV0dXJuIChcbiAgPGRpdiBjbGFzc05hbWU9XCJJbmJveEVudHJ5XCI+XG4gICAgPHNwYW4gY2xhc3NOYW1lPVwiaW5ib3hGcmllbmRcIj4gTmFtZTp7cHJvcHMuaW5ib3hOYW1lfSA8YnV0dG9uIGNsYXNzTmFtZT0nYWNjZXB0JyBvbkNsaWNrPXtmdW5jdGlvbigpe3Byb3BzLmFjY2VwdChwcm9wcy5pbmJveE5hbWUsIHByb3BzLnJlcXVlc3RNb3ZpZSl9fT4gXG4gICAgQWNjZXB0IHtwcm9wcy5pbmJveE5hbWV9J3Mge3Byb3BzLnJlcXVlc3RUeXBlfSByZXF1ZXN0IHtwcm9wcy5yZXF1ZXN0TW92aWV9PC9idXR0b24+IFxuICAgIDxidXR0b24gY2xhc3NOYW1lPSdkZWNsaW5lJyBvbkNsaWNrPXtmdW5jdGlvbigpe3Byb3BzLmRlY2xpbmUocHJvcHMuaW5ib3hOYW1lLCBwcm9wcy5yZXF1ZXN0TW92aWUpfX0+XG4gICAgRGVjbGluZSB7cHJvcHMuaW5ib3hOYW1lfSdzIHtwcm9wcy5yZXF1ZXN0VHlwZX0gcmVxdWVzdCB7cHJvcHMucmVxdWVzdE1vdmllfTwvYnV0dG9uPjwvc3Bhbj5cbiAgICA8YnIvPlxuICAgIE1lc3NhZ2U6e3Byb3BzLm1lc3NhZ2VJbmZvfVxuICA8L2Rpdj5cbil9O1xuXG53aW5kb3cuSW5ib3hFbnRyeSA9IEluYm94RW50cnk7Il19
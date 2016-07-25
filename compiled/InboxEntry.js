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
            props.accept(props.inboxName);
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
            props.decline(props.inboxName);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL0luYm94RW50cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGFBQWEsU0FBYixVQUFhLENBQUMsS0FBRCxFQUFXOztBQUUxQixTQUNBO0FBQUE7QUFBQSxNQUFLLFdBQVUsWUFBZjtBQUNFO0FBQUE7QUFBQSxRQUFNLFdBQVUsYUFBaEI7QUFBQTtBQUFxQyxZQUFNLFNBQTNDO0FBQUE7QUFBc0Q7QUFBQTtBQUFBLFVBQVEsV0FBVSxRQUFsQixFQUEyQixTQUFTLG1CQUFVO0FBQUMsa0JBQU0sTUFBTixDQUFhLE1BQU0sU0FBbkI7QUFBOEIsV0FBN0U7QUFBQTtBQUM5QyxjQUFNLFNBRHdDO0FBQUE7QUFDMUIsY0FBTSxXQURvQjtBQUFBO0FBQ0UsY0FBTTtBQURSLE9BQXREO0FBRUE7QUFBQTtBQUFBLFVBQVEsV0FBVSxTQUFsQixFQUE0QixTQUFTLG1CQUFVO0FBQUMsa0JBQU0sT0FBTixDQUFjLE1BQU0sU0FBcEI7QUFBK0IsV0FBL0U7QUFBQTtBQUNTLGNBQU0sU0FEZjtBQUFBO0FBQzZCLGNBQU0sV0FEbkM7QUFBQTtBQUN5RCxjQUFNO0FBRC9EO0FBRkEsS0FERjtBQUtFLG1DQUxGO0FBQUE7QUFNVyxVQUFNO0FBTmpCLEdBREE7QUFTQSxDQVhGOztBQWFBLE9BQU8sVUFBUCxHQUFvQixVQUFwQiIsImZpbGUiOiJJbmJveEVudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEluYm94RW50cnkgPSAocHJvcHMpID0+IHtcblxuICByZXR1cm4gKFxuICA8ZGl2IGNsYXNzTmFtZT1cIkluYm94RW50cnlcIj5cbiAgICA8c3BhbiBjbGFzc05hbWU9XCJpbmJveEZyaWVuZFwiPiBOYW1lOntwcm9wcy5pbmJveE5hbWV9IDxidXR0b24gY2xhc3NOYW1lPSdhY2NlcHQnIG9uQ2xpY2s9e2Z1bmN0aW9uKCl7cHJvcHMuYWNjZXB0KHByb3BzLmluYm94TmFtZSl9fT4gXG4gICAgQWNjZXB0IHtwcm9wcy5pbmJveE5hbWV9J3Mge3Byb3BzLnJlcXVlc3RUeXBlfSByZXF1ZXN0IHtwcm9wcy5yZXF1ZXN0TW92aWV9PC9idXR0b24+IFxuICAgIDxidXR0b24gY2xhc3NOYW1lPSdkZWNsaW5lJyBvbkNsaWNrPXtmdW5jdGlvbigpe3Byb3BzLmRlY2xpbmUocHJvcHMuaW5ib3hOYW1lKX19PlxuICAgIERlY2xpbmUge3Byb3BzLmluYm94TmFtZX0ncyB7cHJvcHMucmVxdWVzdFR5cGV9IHJlcXVlc3Qge3Byb3BzLnJlcXVlc3RNb3ZpZX08L2J1dHRvbj48L3NwYW4+XG4gICAgPGJyLz5cbiAgICBNZXNzYWdlOntwcm9wcy5tZXNzYWdlSW5mb31cbiAgPC9kaXY+XG4pfTtcblxud2luZG93LkluYm94RW50cnkgPSBJbmJveEVudHJ5OyJdfQ==
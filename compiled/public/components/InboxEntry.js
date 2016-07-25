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
    props.messageInfo === null ? 'No message' : props.messageInfo
  );
};

window.InboxEntry = InboxEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0luYm94RW50cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGFBQWEsU0FBYixVQUFhLENBQUMsS0FBRCxFQUFXOztBQUUxQixTQUNBO0FBQUE7QUFBQSxNQUFLLFdBQVUsWUFBZjtBQUNFO0FBQUE7QUFBQSxRQUFNLFdBQVUsYUFBaEI7QUFBQTtBQUFxQyxZQUFNLFNBQTNDO0FBQUE7QUFBc0Q7QUFBQTtBQUFBLFVBQVEsV0FBVSxRQUFsQixFQUEyQixTQUFTLG1CQUFVO0FBQUMsa0JBQU0sTUFBTixDQUFhLE1BQU0sU0FBbkIsRUFBOEIsTUFBTSxZQUFwQztBQUFrRCxXQUFqRztBQUFBO0FBQzlDLGNBQU0sU0FEd0M7QUFBQTtBQUMxQixjQUFNLFdBRG9CO0FBQUE7QUFDRSxjQUFNO0FBRFIsT0FBdEQ7QUFFQTtBQUFBO0FBQUEsVUFBUSxXQUFVLFNBQWxCLEVBQTRCLFNBQVMsbUJBQVU7QUFBQyxrQkFBTSxPQUFOLENBQWMsTUFBTSxTQUFwQixFQUErQixNQUFNLFlBQXJDO0FBQW1ELFdBQW5HO0FBQUE7QUFDUyxjQUFNLFNBRGY7QUFBQTtBQUM2QixjQUFNLFdBRG5DO0FBQUE7QUFDeUQsY0FBTTtBQUQvRDtBQUZBLEtBREY7QUFLRSxtQ0FMRjtBQUFBO0FBTVcsVUFBTSxXQUFOLEtBQXNCLElBQXRCLEdBQTZCLFlBQTdCLEdBQTRDLE1BQU07QUFON0QsR0FEQTtBQVNBLENBWEY7O0FBYUEsT0FBTyxVQUFQLEdBQW9CLFVBQXBCIiwiZmlsZSI6IkluYm94RW50cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgSW5ib3hFbnRyeSA9IChwcm9wcykgPT4ge1xuXG4gIHJldHVybiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwiSW5ib3hFbnRyeVwiPlxuICAgIDxzcGFuIGNsYXNzTmFtZT1cImluYm94RnJpZW5kXCI+IE5hbWU6e3Byb3BzLmluYm94TmFtZX0gPGJ1dHRvbiBjbGFzc05hbWU9J2FjY2VwdCcgb25DbGljaz17ZnVuY3Rpb24oKXtwcm9wcy5hY2NlcHQocHJvcHMuaW5ib3hOYW1lLCBwcm9wcy5yZXF1ZXN0TW92aWUpfX0+IFxuICAgIEFjY2VwdCB7cHJvcHMuaW5ib3hOYW1lfSdzIHtwcm9wcy5yZXF1ZXN0VHlwZX0gcmVxdWVzdCB7cHJvcHMucmVxdWVzdE1vdmllfTwvYnV0dG9uPiBcbiAgICA8YnV0dG9uIGNsYXNzTmFtZT0nZGVjbGluZScgb25DbGljaz17ZnVuY3Rpb24oKXtwcm9wcy5kZWNsaW5lKHByb3BzLmluYm94TmFtZSwgcHJvcHMucmVxdWVzdE1vdmllKX19PlxuICAgIERlY2xpbmUge3Byb3BzLmluYm94TmFtZX0ncyB7cHJvcHMucmVxdWVzdFR5cGV9IHJlcXVlc3Qge3Byb3BzLnJlcXVlc3RNb3ZpZX08L2J1dHRvbj48L3NwYW4+XG4gICAgPGJyLz5cbiAgICBNZXNzYWdlOntwcm9wcy5tZXNzYWdlSW5mbyA9PT0gbnVsbCA/ICdObyBtZXNzYWdlJyA6IHByb3BzLm1lc3NhZ2VJbmZvfVxuICA8L2Rpdj5cbil9O1xuXG53aW5kb3cuSW5ib3hFbnRyeSA9IEluYm94RW50cnk7Il19
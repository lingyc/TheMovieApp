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
    React.createElement("br", null)
  );
};

window.InboxEntry = InboxEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL0luYm94RW50cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGFBQWEsU0FBYixVQUFhLENBQUMsS0FBRCxFQUFXOztBQUUxQixTQUNBO0FBQUE7QUFBQSxNQUFLLFdBQVUsWUFBZjtBQUNFO0FBQUE7QUFBQSxRQUFNLFdBQVUsYUFBaEI7QUFBQTtBQUFxQyxZQUFNLFNBQTNDO0FBQUE7QUFBc0Q7QUFBQTtBQUFBLFVBQVEsV0FBVSxRQUFsQixFQUEyQixTQUFTLG1CQUFVO0FBQUMsa0JBQU0sTUFBTixDQUFhLE1BQU0sU0FBbkI7QUFBOEIsV0FBN0U7QUFBQTtBQUM5QyxjQUFNLFNBRHdDO0FBQUE7QUFDMUIsY0FBTSxXQURvQjtBQUFBO0FBQ0UsY0FBTTtBQURSLE9BQXREO0FBRUE7QUFBQTtBQUFBLFVBQVEsV0FBVSxTQUFsQixFQUE0QixTQUFTLG1CQUFVO0FBQUMsa0JBQU0sT0FBTixDQUFjLE1BQU0sU0FBcEI7QUFBK0IsV0FBL0U7QUFBQTtBQUNTLGNBQU0sU0FEZjtBQUFBO0FBQzZCLGNBQU0sV0FEbkM7QUFBQTtBQUN5RCxjQUFNO0FBRC9EO0FBRkEsS0FERjtBQUtFO0FBTEYsR0FEQTtBQVFBLENBVkY7O0FBWUEsT0FBTyxVQUFQLEdBQW9CLFVBQXBCIiwiZmlsZSI6IkluYm94RW50cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgSW5ib3hFbnRyeSA9IChwcm9wcykgPT4ge1xuXG4gIHJldHVybiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwiSW5ib3hFbnRyeVwiPlxuICAgIDxzcGFuIGNsYXNzTmFtZT1cImluYm94RnJpZW5kXCI+IE5hbWU6e3Byb3BzLmluYm94TmFtZX0gPGJ1dHRvbiBjbGFzc05hbWU9J2FjY2VwdCcgb25DbGljaz17ZnVuY3Rpb24oKXtwcm9wcy5hY2NlcHQocHJvcHMuaW5ib3hOYW1lKX19PiBcbiAgICBBY2NlcHQge3Byb3BzLmluYm94TmFtZX0ncyB7cHJvcHMucmVxdWVzdFR5cGV9IHJlcXVlc3Qge3Byb3BzLnJlcXVlc3RNb3ZpZX08L2J1dHRvbj4gXG4gICAgPGJ1dHRvbiBjbGFzc05hbWU9J2RlY2xpbmUnIG9uQ2xpY2s9e2Z1bmN0aW9uKCl7cHJvcHMuZGVjbGluZShwcm9wcy5pbmJveE5hbWUpfX0+XG4gICAgRGVjbGluZSB7cHJvcHMuaW5ib3hOYW1lfSdzIHtwcm9wcy5yZXF1ZXN0VHlwZX0gcmVxdWVzdCB7cHJvcHMucmVxdWVzdE1vdmllfTwvYnV0dG9uPjwvc3Bhbj5cbiAgICA8YnIvPlxuICA8L2Rpdj5cbil9O1xuXG53aW5kb3cuSW5ib3hFbnRyeSA9IEluYm94RW50cnk7Il19
"use strict";

var FriendEntry = function FriendEntry(props) {

  return React.createElement(
    "div",
    { className: "FriendEntry" },
    React.createElement(
      "div",
      { id: "Friend" },
      React.createElement(
        "div",
        null,
        React.createElement(
          "h3",
          { className: "individual", onClick: props.fof },
          props.Friend
        )
      ),
      "  ",
      React.createElement(
        "b",
        null,
        "Compatability: ",
        props.Comp
      ),
      React.createElement(
        "div",
        { className: "watchModule" },
        React.createElement(
          "button",
          { onClick: function onClick() {
              props.sendARequest(props.Friend);
            } },
          "Send watch request"
        )
      )
    ),
    React.createElement("br", null)
  );
};

window.FriendEntry = FriendEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL0ZyaWVuZEVudHJ5Vmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksY0FBYyxTQUFkLFdBQWMsQ0FBQyxLQUFELEVBQVc7O0FBRzNCLFNBQ0E7QUFBQTtBQUFBLE1BQUssV0FBVSxhQUFmO0FBQ0U7QUFBQTtBQUFBLFFBQUssSUFBRyxRQUFSO0FBQWlCO0FBQUE7QUFBQTtBQUFLO0FBQUE7QUFBQSxZQUFJLFdBQVUsWUFBZCxFQUEyQixTQUFTLE1BQU0sR0FBMUM7QUFBZ0QsZ0JBQU07QUFBdEQ7QUFBTCxPQUFqQjtBQUFBO0FBQWdHO0FBQUE7QUFBQTtBQUFBO0FBQW1CLGNBQU07QUFBekIsT0FBaEc7QUFDRTtBQUFBO0FBQUEsVUFBSyxXQUFVLGFBQWY7QUFBNkI7QUFBQTtBQUFBLFlBQVEsU0FBUyxtQkFBVTtBQUFDLG9CQUFNLFlBQU4sQ0FBbUIsTUFBTSxNQUF6QjtBQUFpQyxhQUE3RDtBQUFBO0FBQUE7QUFBN0I7QUFERixLQURGO0FBR0U7QUFIRixHQURBO0FBTUEsQ0FURjs7QUFXQSxPQUFPLFdBQVAsR0FBcUIsV0FBckIiLCJmaWxlIjoiRnJpZW5kRW50cnlWaWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEZyaWVuZEVudHJ5ID0gKHByb3BzKSA9PiB7XG5cblxuICByZXR1cm4gKFxuICA8ZGl2IGNsYXNzTmFtZT1cIkZyaWVuZEVudHJ5XCI+XG4gICAgPGRpdiBpZD1cIkZyaWVuZFwiPjxkaXY+PGgzIGNsYXNzTmFtZT0naW5kaXZpZHVhbCcgb25DbGljaz17cHJvcHMuZm9mfT57cHJvcHMuRnJpZW5kfTwvaDM+PC9kaXY+ICA8Yj5Db21wYXRhYmlsaXR5OiB7cHJvcHMuQ29tcH08L2I+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nd2F0Y2hNb2R1bGUnPjxidXR0b24gb25DbGljaz17ZnVuY3Rpb24oKXtwcm9wcy5zZW5kQVJlcXVlc3QocHJvcHMuRnJpZW5kKX19PlNlbmQgd2F0Y2ggcmVxdWVzdDwvYnV0dG9uPjwvZGl2PjwvZGl2PlxuICAgIDxici8+XG4gIDwvZGl2PlxuKX07XG5cbndpbmRvdy5GcmllbmRFbnRyeSA9IEZyaWVuZEVudHJ5OyJdfQ==
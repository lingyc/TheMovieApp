"use strict";

var FriendEntry = function FriendEntry(props) {

  return React.createElement(
    "div",
    { className: "FriendEntry collection-item row" },
    React.createElement(
      "div",
      { className: "col s3" },
      React.createElement("img", { className: "profilethumnail", src: 'https://unsplash.it/170/170/?random' })
    ),
    React.createElement(
      "div",
      { id: "Friend", className: "col s9" },
      React.createElement(
        "a",
        { className: "individual" },
        React.createElement(
          "h3",
          { className: "friendName", onClick: props.fof },
          props.Friend
        )
      ),
      React.createElement(
        "div",
        { className: "compatability" },
        "Compatability: ",
        props.Comp
      )
    )
  );
};

window.FriendEntry = FriendEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL0ZyaWVuZEVudHJ5Vmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksY0FBYyxTQUFkLFdBQWMsQ0FBQyxLQUFELEVBQVc7O0FBRzNCLFNBQ0E7QUFBQTtBQUFBLE1BQUssV0FBVSxpQ0FBZjtBQUNDO0FBQUE7QUFBQSxRQUFLLFdBQVUsUUFBZjtBQUNDLG1DQUFLLFdBQVUsaUJBQWYsRUFBaUMsS0FBSyxxQ0FBdEM7QUFERCxLQUREO0FBSUU7QUFBQTtBQUFBLFFBQUssSUFBRyxRQUFSLEVBQWlCLFdBQVUsUUFBM0I7QUFDQztBQUFBO0FBQUEsVUFBRyxXQUFVLFlBQWI7QUFBMEI7QUFBQTtBQUFBLFlBQUksV0FBVSxZQUFkLEVBQTJCLFNBQVMsTUFBTSxHQUExQztBQUFnRCxnQkFBTTtBQUF0RDtBQUExQixPQUREO0FBRUM7QUFBQTtBQUFBLFVBQUssV0FBVSxlQUFmO0FBQUE7QUFBZ0QsY0FBTTtBQUF0RDtBQUZEO0FBSkYsR0FEQTtBQVVBLENBYkY7O0FBZUEsT0FBTyxXQUFQLEdBQXFCLFdBQXJCIiwiZmlsZSI6IkZyaWVuZEVudHJ5Vmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBGcmllbmRFbnRyeSA9IChwcm9wcykgPT4ge1xuXG5cbiAgcmV0dXJuIChcbiAgPGRpdiBjbGFzc05hbWU9XCJGcmllbmRFbnRyeSBjb2xsZWN0aW9uLWl0ZW0gcm93XCI+XG4gIFx0PGRpdiBjbGFzc05hbWU9XCJjb2wgczNcIj5cbiAgXHRcdDxpbWcgY2xhc3NOYW1lPSdwcm9maWxldGh1bW5haWwnIHNyYz17J2h0dHBzOi8vdW5zcGxhc2guaXQvMTcwLzE3MC8/cmFuZG9tJ30vPlxuICBcdDwvZGl2PlxuICAgIDxkaXYgaWQ9XCJGcmllbmRcIiBjbGFzc05hbWU9XCJjb2wgczlcIj5cbiAgICBcdDxhIGNsYXNzTmFtZT0naW5kaXZpZHVhbCc+PGgzIGNsYXNzTmFtZT1cImZyaWVuZE5hbWVcIiBvbkNsaWNrPXtwcm9wcy5mb2Z9Pntwcm9wcy5GcmllbmR9PC9oMz48L2E+ICBcbiAgICBcdDxkaXYgY2xhc3NOYW1lPVwiY29tcGF0YWJpbGl0eVwiID5Db21wYXRhYmlsaXR5OiB7cHJvcHMuQ29tcH08L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4pfTtcblxud2luZG93LkZyaWVuZEVudHJ5ID0gRnJpZW5kRW50cnk7Il19
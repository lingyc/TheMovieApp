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
      { id: "Friend", className: "friendEntry col s9" },
      React.createElement(
        "a",
        { className: "friendEntryIndividual" },
        React.createElement(
          "h3",
          { className: "friendName", onClick: function onClick() {
              props.fof(props.Friend);
            } },
          props.Friend
        )
      ),
      React.createElement(
        "div",
        { className: "friendEntryCompatability" },
        "Compatability: ",
        props.Comp,
        "%"
      )
    )
  );
};

window.FriendEntry = FriendEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0ZyaWVuZEVudHJ5Vmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksY0FBYyxTQUFkLFdBQWMsQ0FBQyxLQUFELEVBQVc7O0FBRzNCLFNBQ0E7QUFBQTtBQUFBLE1BQUssV0FBVSxpQ0FBZjtBQUNDO0FBQUE7QUFBQSxRQUFLLFdBQVUsUUFBZjtBQUNDLG1DQUFLLFdBQVUsaUJBQWYsRUFBaUMsS0FBSyxxQ0FBdEM7QUFERCxLQUREO0FBSUU7QUFBQTtBQUFBLFFBQUssSUFBRyxRQUFSLEVBQWlCLFdBQVUsb0JBQTNCO0FBQ0M7QUFBQTtBQUFBLFVBQUcsV0FBVSx1QkFBYjtBQUFxQztBQUFBO0FBQUEsWUFBSSxXQUFVLFlBQWQsRUFBMkIsU0FBUyxtQkFBVTtBQUFDLG9CQUFNLEdBQU4sQ0FBVSxNQUFNLE1BQWhCO0FBQXdCLGFBQXZFO0FBQTBFLGdCQUFNO0FBQWhGO0FBQXJDLE9BREQ7QUFFQztBQUFBO0FBQUEsVUFBSyxXQUFVLDBCQUFmO0FBQUE7QUFBMkQsY0FBTSxJQUFqRTtBQUFBO0FBQUE7QUFGRDtBQUpGLEdBREE7QUFVQSxDQWJGOztBQWVBLE9BQU8sV0FBUCxHQUFxQixXQUFyQiIsImZpbGUiOiJGcmllbmRFbnRyeVZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgRnJpZW5kRW50cnkgPSAocHJvcHMpID0+IHtcblxuXG4gIHJldHVybiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwiRnJpZW5kRW50cnkgY29sbGVjdGlvbi1pdGVtIHJvd1wiID5cbiAgXHQ8ZGl2IGNsYXNzTmFtZT1cImNvbCBzM1wiPlxuICBcdFx0PGltZyBjbGFzc05hbWU9J3Byb2ZpbGV0aHVtbmFpbCcgc3JjPXsnaHR0cHM6Ly91bnNwbGFzaC5pdC8xNzAvMTcwLz9yYW5kb20nfS8+XG4gIFx0PC9kaXY+XG4gICAgPGRpdiBpZD1cIkZyaWVuZFwiIGNsYXNzTmFtZT1cImZyaWVuZEVudHJ5IGNvbCBzOVwiPlxuICAgIFx0PGEgY2xhc3NOYW1lPSdmcmllbmRFbnRyeUluZGl2aWR1YWwnPjxoMyBjbGFzc05hbWU9XCJmcmllbmROYW1lXCIgb25DbGljaz17ZnVuY3Rpb24oKXtwcm9wcy5mb2YocHJvcHMuRnJpZW5kKX19Pntwcm9wcy5GcmllbmR9PC9oMz48L2E+ICBcbiAgICBcdDxkaXYgY2xhc3NOYW1lPVwiZnJpZW5kRW50cnlDb21wYXRhYmlsaXR5XCIgPkNvbXBhdGFiaWxpdHk6IHtwcm9wcy5Db21wfSU8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4pfTtcblxud2luZG93LkZyaWVuZEVudHJ5ID0gRnJpZW5kRW50cnk7Il19
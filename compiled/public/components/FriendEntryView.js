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
        props.Comp,
        "%"
      )
    )
  );
};

window.FriendEntry = FriendEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0ZyaWVuZEVudHJ5Vmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksY0FBYyxTQUFkLFdBQWMsQ0FBQyxLQUFELEVBQVc7O0FBRzNCLFNBQ0E7QUFBQTtBQUFBLE1BQUssV0FBVSxpQ0FBZjtBQUNDO0FBQUE7QUFBQSxRQUFLLFdBQVUsUUFBZjtBQUNDLG1DQUFLLFdBQVUsaUJBQWYsRUFBaUMsS0FBSyxxQ0FBdEM7QUFERCxLQUREO0FBSUU7QUFBQTtBQUFBLFFBQUssSUFBRyxRQUFSLEVBQWlCLFdBQVUsUUFBM0I7QUFDQztBQUFBO0FBQUEsVUFBRyxXQUFVLFlBQWI7QUFBMEI7QUFBQTtBQUFBLFlBQUksV0FBVSxZQUFkLEVBQTJCLFNBQVMsTUFBTSxHQUExQztBQUFnRCxnQkFBTTtBQUF0RDtBQUExQixPQUREO0FBRUM7QUFBQTtBQUFBLFVBQUssV0FBVSxlQUFmO0FBQUE7QUFBZ0QsY0FBTSxJQUF0RDtBQUFBO0FBQUE7QUFGRDtBQUpGLEdBREE7QUFVQSxDQWJGOztBQWVBLE9BQU8sV0FBUCxHQUFxQixXQUFyQiIsImZpbGUiOiJGcmllbmRFbnRyeVZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgRnJpZW5kRW50cnkgPSAocHJvcHMpID0+IHtcblxuXG4gIHJldHVybiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwiRnJpZW5kRW50cnkgY29sbGVjdGlvbi1pdGVtIHJvd1wiPlxuICBcdDxkaXYgY2xhc3NOYW1lPVwiY29sIHMzXCI+XG4gIFx0XHQ8aW1nIGNsYXNzTmFtZT0ncHJvZmlsZXRodW1uYWlsJyBzcmM9eydodHRwczovL3Vuc3BsYXNoLml0LzE3MC8xNzAvP3JhbmRvbSd9Lz5cbiAgXHQ8L2Rpdj5cbiAgICA8ZGl2IGlkPVwiRnJpZW5kXCIgY2xhc3NOYW1lPVwiY29sIHM5XCI+XG4gICAgXHQ8YSBjbGFzc05hbWU9J2luZGl2aWR1YWwnPjxoMyBjbGFzc05hbWU9XCJmcmllbmROYW1lXCIgb25DbGljaz17cHJvcHMuZm9mfT57cHJvcHMuRnJpZW5kfTwvaDM+PC9hPiAgXG4gICAgXHQ8ZGl2IGNsYXNzTmFtZT1cImNvbXBhdGFiaWxpdHlcIiA+Q29tcGF0YWJpbGl0eToge3Byb3BzLkNvbXB9JTwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbil9O1xuXG53aW5kb3cuRnJpZW5kRW50cnkgPSBGcmllbmRFbnRyeTsiXX0=
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
          { className: "friendName", onClick: function onClick() {
              props.fof(props.Friend);
            } },
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0ZyaWVuZEVudHJ5Vmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksY0FBYyxTQUFkLFdBQWMsQ0FBQyxLQUFELEVBQVc7O0FBRzNCLFNBQ0E7QUFBQTtBQUFBLE1BQUssV0FBVSxpQ0FBZjtBQUNDO0FBQUE7QUFBQSxRQUFLLFdBQVUsUUFBZjtBQUNDLG1DQUFLLFdBQVUsaUJBQWYsRUFBaUMsS0FBSyxxQ0FBdEM7QUFERCxLQUREO0FBSUU7QUFBQTtBQUFBLFFBQUssSUFBRyxRQUFSLEVBQWlCLFdBQVUsUUFBM0I7QUFDQztBQUFBO0FBQUEsVUFBRyxXQUFVLFlBQWI7QUFBMEI7QUFBQTtBQUFBLFlBQUksV0FBVSxZQUFkLEVBQTJCLFNBQVMsbUJBQVU7QUFBQyxvQkFBTSxHQUFOLENBQVUsTUFBTSxNQUFoQjtBQUF3QixhQUF2RTtBQUEwRSxnQkFBTTtBQUFoRjtBQUExQixPQUREO0FBRUM7QUFBQTtBQUFBLFVBQUssV0FBVSxlQUFmO0FBQUE7QUFBZ0QsY0FBTSxJQUF0RDtBQUFBO0FBQUE7QUFGRDtBQUpGLEdBREE7QUFVQSxDQWJGOztBQWVBLE9BQU8sV0FBUCxHQUFxQixXQUFyQiIsImZpbGUiOiJGcmllbmRFbnRyeVZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgRnJpZW5kRW50cnkgPSAocHJvcHMpID0+IHtcblxuXG4gIHJldHVybiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwiRnJpZW5kRW50cnkgY29sbGVjdGlvbi1pdGVtIHJvd1wiPlxuICBcdDxkaXYgY2xhc3NOYW1lPVwiY29sIHMzXCI+XG4gIFx0XHQ8aW1nIGNsYXNzTmFtZT0ncHJvZmlsZXRodW1uYWlsJyBzcmM9eydodHRwczovL3Vuc3BsYXNoLml0LzE3MC8xNzAvP3JhbmRvbSd9Lz5cbiAgXHQ8L2Rpdj5cbiAgICA8ZGl2IGlkPVwiRnJpZW5kXCIgY2xhc3NOYW1lPVwiY29sIHM5XCI+XG4gICAgXHQ8YSBjbGFzc05hbWU9J2luZGl2aWR1YWwnPjxoMyBjbGFzc05hbWU9XCJmcmllbmROYW1lXCIgb25DbGljaz17ZnVuY3Rpb24oKXtwcm9wcy5mb2YocHJvcHMuRnJpZW5kKX19Pntwcm9wcy5GcmllbmR9PC9oMz48L2E+ICBcbiAgICBcdDxkaXYgY2xhc3NOYW1lPVwiY29tcGF0YWJpbGl0eVwiID5Db21wYXRhYmlsaXR5OiB7cHJvcHMuQ29tcH0lPC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuKX07XG5cbndpbmRvdy5GcmllbmRFbnRyeSA9IEZyaWVuZEVudHJ5OyJdfQ==
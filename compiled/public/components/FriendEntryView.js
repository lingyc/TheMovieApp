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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0ZyaWVuZEVudHJ5Vmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksY0FBYyxTQUFkLFdBQWMsQ0FBQyxLQUFELEVBQVc7O0FBRzNCLFNBQ0E7QUFBQTtBQUFBLE1BQUssV0FBVSxpQ0FBZjtBQUNDO0FBQUE7QUFBQSxRQUFLLFdBQVUsUUFBZjtBQUNDLG1DQUFLLFdBQVUsaUJBQWYsRUFBaUMsS0FBSyxxQ0FBdEM7QUFERCxLQUREO0FBSUU7QUFBQTtBQUFBLFFBQUssSUFBRyxRQUFSLEVBQWlCLFdBQVUsb0JBQTNCO0FBQ0M7QUFBQTtBQUFBLFVBQUcsV0FBVSx1QkFBYjtBQUFxQztBQUFBO0FBQUEsWUFBSSxXQUFVLFlBQWQsRUFBMkIsU0FBUyxtQkFBVTtBQUFDLG9CQUFNLEdBQU4sQ0FBVSxNQUFNLE1BQWhCO0FBQXdCLGFBQXZFO0FBQTBFLGdCQUFNO0FBQWhGO0FBQXJDLE9BREQ7QUFFQztBQUFBO0FBQUEsVUFBSyxXQUFVLDBCQUFmO0FBQUE7QUFBMkQsY0FBTSxJQUFqRTtBQUFBO0FBQUE7QUFGRDtBQUpGLEdBREE7QUFVQSxDQWJGOztBQWVBLE9BQU8sV0FBUCxHQUFxQixXQUFyQiIsImZpbGUiOiJGcmllbmRFbnRyeVZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgRnJpZW5kRW50cnkgPSAocHJvcHMpID0+IHtcblxuXG4gIHJldHVybiAoXG4gIDxkaXYgY2xhc3NOYW1lPVwiRnJpZW5kRW50cnkgY29sbGVjdGlvbi1pdGVtIHJvd1wiPlxuICBcdDxkaXYgY2xhc3NOYW1lPVwiY29sIHMzXCI+XG4gIFx0XHQ8aW1nIGNsYXNzTmFtZT0ncHJvZmlsZXRodW1uYWlsJyBzcmM9eydodHRwczovL3Vuc3BsYXNoLml0LzE3MC8xNzAvP3JhbmRvbSd9Lz5cbiAgXHQ8L2Rpdj5cbiAgICA8ZGl2IGlkPVwiRnJpZW5kXCIgY2xhc3NOYW1lPVwiZnJpZW5kRW50cnkgY29sIHM5XCI+XG4gICAgXHQ8YSBjbGFzc05hbWU9J2ZyaWVuZEVudHJ5SW5kaXZpZHVhbCc+PGgzIGNsYXNzTmFtZT1cImZyaWVuZE5hbWVcIiBvbkNsaWNrPXtmdW5jdGlvbigpe3Byb3BzLmZvZihwcm9wcy5GcmllbmQpfX0+e3Byb3BzLkZyaWVuZH08L2gzPjwvYT4gIFxuICAgIFx0PGRpdiBjbGFzc05hbWU9XCJmcmllbmRFbnRyeUNvbXBhdGFiaWxpdHlcIiA+Q29tcGF0YWJpbGl0eToge3Byb3BzLkNvbXB9JTwvZGl2PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbil9O1xuXG53aW5kb3cuRnJpZW5kRW50cnkgPSBGcmllbmRFbnRyeTsiXX0=
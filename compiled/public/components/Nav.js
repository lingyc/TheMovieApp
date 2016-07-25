"use strict";

var Nav = function Nav(props) {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "div",
      { className: "navbar-fixed movieBuddyNav" },
      React.createElement(
        "nav",
        null,
        React.createElement(
          "div",
          { className: "nav-wrapper" },
          React.createElement(
            "a",
            { href: "#", onClick: function onClick() {
                return props.onClick("Home");
              }, className: "brand-logo center" },
            "TheMovieApp"
          ),
          React.createElement(
            "ul",
            { id: "nav-mobile", className: "left hide-on-med-and-down" },
            React.createElement(
              "li",
              null,
              React.createElement(
                "a",
                { className: props.Home === true ? "active" : "", onClick: function onClick() {
                    return props.onClick("Home");
                  } },
                "Home"
              )
            ),
            React.createElement(
              "li",
              null,
              React.createElement(
                "a",
                { onClick: function onClick() {
                    return props.onClick("MyRatings");
                  } },
                "My Ratings"
              )
            ),
            React.createElement(
              "li",
              null,
              React.createElement(
                "a",
                { onClick: function onClick() {
                    return props.onClick("Friends");
                  } },
                "My Friends"
              )
            ),
            React.createElement(
              "li",
              null,
              React.createElement(
                "a",
                { onClick: props.find },
                "New Buddies"
              )
            )
          ),
          React.createElement(
            "ul",
            { id: "nav-mobile", className: "right hide-on-med-and-down" },
            React.createElement(
              "li",
              null,
              React.createElement(
                "a",
                { onClick: props.logout },
                "Log Out"
              )
            ),
            React.createElement(
              "li",
              null,
              React.createElement(
                "a",
                { onClick: function onClick() {
                    return props.onClick("Inbox");
                  } },
                "Notifications"
              )
            )
          )
        )
      )
    ),
    React.createElement(
      "div",
      { className: "headBand" },
      React.createElement(
        "h3",
        null,
        "Hi, ",
        props.name,
        "!"
      )
    )
  );
};

window.Nav = Nav;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL05hdi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksTUFBTSxTQUFOLEdBQU0sQ0FBQyxLQUFEO0FBQUEsU0FDTjtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsUUFBSyxXQUFVLDRCQUFmO0FBQ0U7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLFlBQUssV0FBVSxhQUFmO0FBQ0U7QUFBQTtBQUFBLGNBQUcsTUFBSyxHQUFSLEVBQVksU0FBUztBQUFBLHVCQUFPLE1BQU0sT0FBTixDQUFjLE1BQWQsQ0FBUDtBQUFBLGVBQXJCLEVBQW9ELFdBQVUsbUJBQTlEO0FBQUE7QUFBQSxXQURGO0FBRUU7QUFBQTtBQUFBLGNBQUksSUFBRyxZQUFQLEVBQW9CLFdBQVUsMkJBQTlCO0FBQ0U7QUFBQTtBQUFBO0FBQUk7QUFBQTtBQUFBLGtCQUFHLFdBQVksTUFBTSxJQUFOLEtBQWUsSUFBaEIsR0FBd0IsUUFBeEIsR0FBbUMsRUFBakQsRUFBcUQsU0FBUztBQUFBLDJCQUFPLE1BQU0sT0FBTixDQUFjLE1BQWQsQ0FBUDtBQUFBLG1CQUE5RDtBQUFBO0FBQUE7QUFBSixhQURGO0FBRUU7QUFBQTtBQUFBO0FBQUk7QUFBQTtBQUFBLGtCQUFHLFNBQVM7QUFBQSwyQkFBTyxNQUFNLE9BQU4sQ0FBYyxXQUFkLENBQVA7QUFBQSxtQkFBWjtBQUFBO0FBQUE7QUFBSixhQUZGO0FBR0U7QUFBQTtBQUFBO0FBQUk7QUFBQTtBQUFBLGtCQUFHLFNBQVM7QUFBQSwyQkFBTyxNQUFNLE9BQU4sQ0FBYyxTQUFkLENBQVA7QUFBQSxtQkFBWjtBQUFBO0FBQUE7QUFBSixhQUhGO0FBSUU7QUFBQTtBQUFBO0FBQUk7QUFBQTtBQUFBLGtCQUFHLFNBQVMsTUFBTSxJQUFsQjtBQUFBO0FBQUE7QUFBSjtBQUpGLFdBRkY7QUFRRTtBQUFBO0FBQUEsY0FBSSxJQUFHLFlBQVAsRUFBb0IsV0FBVSw0QkFBOUI7QUFDRTtBQUFBO0FBQUE7QUFBSTtBQUFBO0FBQUEsa0JBQUcsU0FBUyxNQUFNLE1BQWxCO0FBQUE7QUFBQTtBQUFKLGFBREY7QUFFRTtBQUFBO0FBQUE7QUFBSTtBQUFBO0FBQUEsa0JBQUcsU0FBUztBQUFBLDJCQUFPLE1BQU0sT0FBTixDQUFjLE9BQWQsQ0FBUDtBQUFBLG1CQUFaO0FBQUE7QUFBQTtBQUFKO0FBRkY7QUFSRjtBQURGO0FBREYsS0FERjtBQWtCRTtBQUFBO0FBQUEsUUFBSyxXQUFVLFVBQWY7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFTLGNBQU0sSUFBZjtBQUFBO0FBQUE7QUFERjtBQWxCRixHQURNO0FBQUEsQ0FBVjs7QUF5QkEsT0FBTyxHQUFQLEdBQWEsR0FBYiIsImZpbGUiOiJOYXYuanMiLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgTmF2ID0gKHByb3BzKSA9PiAoXG4gICAgPGRpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWZpeGVkIG1vdmllQnVkZHlOYXZcIj5cbiAgICAgICAgPG5hdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdi13cmFwcGVyXCI+XG4gICAgICAgICAgICA8YSBocmVmPVwiI1wiIG9uQ2xpY2s9eygpID0+IChwcm9wcy5vbkNsaWNrKFwiSG9tZVwiKSl9IGNsYXNzTmFtZT1cImJyYW5kLWxvZ28gY2VudGVyXCI+VGhlTW92aWVBcHA8L2E+XG4gICAgICAgICAgICA8dWwgaWQ9XCJuYXYtbW9iaWxlXCIgY2xhc3NOYW1lPVwibGVmdCBoaWRlLW9uLW1lZC1hbmQtZG93blwiPlxuICAgICAgICAgICAgICA8bGk+PGEgY2xhc3NOYW1lPXsocHJvcHMuSG9tZSA9PT0gdHJ1ZSkgPyBcImFjdGl2ZVwiIDogXCJcIn0gb25DbGljaz17KCkgPT4gKHByb3BzLm9uQ2xpY2soXCJIb21lXCIpKX0+SG9tZTwvYT48L2xpPlxuICAgICAgICAgICAgICA8bGk+PGEgb25DbGljaz17KCkgPT4gKHByb3BzLm9uQ2xpY2soXCJNeVJhdGluZ3NcIikpfT5NeSBSYXRpbmdzPC9hPjwvbGk+XG4gICAgICAgICAgICAgIDxsaT48YSBvbkNsaWNrPXsoKSA9PiAocHJvcHMub25DbGljayhcIkZyaWVuZHNcIikpfT5NeSBGcmllbmRzPC9hPjwvbGk+XG4gICAgICAgICAgICAgIDxsaT48YSBvbkNsaWNrPXtwcm9wcy5maW5kfT5OZXcgQnVkZGllczwvYT48L2xpPlxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDx1bCBpZD1cIm5hdi1tb2JpbGVcIiBjbGFzc05hbWU9XCJyaWdodCBoaWRlLW9uLW1lZC1hbmQtZG93blwiPlxuICAgICAgICAgICAgICA8bGk+PGEgb25DbGljaz17cHJvcHMubG9nb3V0fT5Mb2cgT3V0PC9hPjwvbGk+ICAgICAgXG4gICAgICAgICAgICAgIDxsaT48YSBvbkNsaWNrPXsoKSA9PiAocHJvcHMub25DbGljayhcIkluYm94XCIpKX0+Tm90aWZpY2F0aW9uczwvYT48L2xpPiAgICAgXG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L25hdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJoZWFkQmFuZFwiPlxuICAgICAgICA8aDM+SGksIHtwcm9wcy5uYW1lfSE8L2gzPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4pO1xuXG53aW5kb3cuTmF2ID0gTmF2O1xuIl19
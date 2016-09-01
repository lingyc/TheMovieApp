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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL05hdi5qcyJdLCJuYW1lcyI6WyJOYXYiLCJwcm9wcyIsIm9uQ2xpY2siLCJIb21lIiwiZmluZCIsImxvZ291dCIsIm5hbWUiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsTUFBTSxTQUFOQSxHQUFNLENBQUNDLEtBQUQ7QUFBQSxTQUNOO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxRQUFLLFdBQVUsNEJBQWY7QUFDRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLGFBQWY7QUFDRTtBQUFBO0FBQUEsY0FBRyxNQUFLLEdBQVIsRUFBWSxTQUFTO0FBQUEsdUJBQU9BLE1BQU1DLE9BQU4sQ0FBYyxNQUFkLENBQVA7QUFBQSxlQUFyQixFQUFvRCxXQUFVLG1CQUE5RDtBQUFBO0FBQUEsV0FERjtBQUVFO0FBQUE7QUFBQSxjQUFJLElBQUcsWUFBUCxFQUFvQixXQUFVLDJCQUE5QjtBQUNFO0FBQUE7QUFBQTtBQUFJO0FBQUE7QUFBQSxrQkFBRyxXQUFZRCxNQUFNRSxJQUFOLEtBQWUsSUFBaEIsR0FBd0IsUUFBeEIsR0FBbUMsRUFBakQsRUFBcUQsU0FBUztBQUFBLDJCQUFPRixNQUFNQyxPQUFOLENBQWMsTUFBZCxDQUFQO0FBQUEsbUJBQTlEO0FBQUE7QUFBQTtBQUFKLGFBREY7QUFFRTtBQUFBO0FBQUE7QUFBSTtBQUFBO0FBQUEsa0JBQUcsU0FBUztBQUFBLDJCQUFPRCxNQUFNQyxPQUFOLENBQWMsV0FBZCxDQUFQO0FBQUEsbUJBQVo7QUFBQTtBQUFBO0FBQUosYUFGRjtBQUdFO0FBQUE7QUFBQTtBQUFJO0FBQUE7QUFBQSxrQkFBRyxTQUFTO0FBQUEsMkJBQU9ELE1BQU1DLE9BQU4sQ0FBYyxTQUFkLENBQVA7QUFBQSxtQkFBWjtBQUFBO0FBQUE7QUFBSixhQUhGO0FBSUU7QUFBQTtBQUFBO0FBQUk7QUFBQTtBQUFBLGtCQUFHLFNBQVNELE1BQU1HLElBQWxCO0FBQUE7QUFBQTtBQUFKO0FBSkYsV0FGRjtBQVFFO0FBQUE7QUFBQSxjQUFJLElBQUcsWUFBUCxFQUFvQixXQUFVLDRCQUE5QjtBQUNFO0FBQUE7QUFBQTtBQUFJO0FBQUE7QUFBQSxrQkFBRyxTQUFTSCxNQUFNSSxNQUFsQjtBQUFBO0FBQUE7QUFBSixhQURGO0FBRUU7QUFBQTtBQUFBO0FBQUk7QUFBQTtBQUFBLGtCQUFHLFNBQVM7QUFBQSwyQkFBT0osTUFBTUMsT0FBTixDQUFjLE9BQWQsQ0FBUDtBQUFBLG1CQUFaO0FBQUE7QUFBQTtBQUFKO0FBRkY7QUFSRjtBQURGO0FBREYsS0FERjtBQWtCRTtBQUFBO0FBQUEsUUFBSyxXQUFVLFVBQWY7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFTRCxjQUFNSyxJQUFmO0FBQUE7QUFBQTtBQURGO0FBbEJGLEdBRE07QUFBQSxDQUFWOztBQXlCQUMsT0FBT1AsR0FBUCxHQUFhQSxHQUFiIiwiZmlsZSI6Ik5hdi5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBOYXYgPSAocHJvcHMpID0+IChcbiAgICA8ZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXItZml4ZWQgbW92aWVCdWRkeU5hdlwiPlxuICAgICAgICA8bmF2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2LXdyYXBwZXJcIj5cbiAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgb25DbGljaz17KCkgPT4gKHByb3BzLm9uQ2xpY2soXCJIb21lXCIpKX0gY2xhc3NOYW1lPVwiYnJhbmQtbG9nbyBjZW50ZXJcIj5UaGVNb3ZpZUFwcDwvYT5cbiAgICAgICAgICAgIDx1bCBpZD1cIm5hdi1tb2JpbGVcIiBjbGFzc05hbWU9XCJsZWZ0IGhpZGUtb24tbWVkLWFuZC1kb3duXCI+XG4gICAgICAgICAgICAgIDxsaT48YSBjbGFzc05hbWU9eyhwcm9wcy5Ib21lID09PSB0cnVlKSA/IFwiYWN0aXZlXCIgOiBcIlwifSBvbkNsaWNrPXsoKSA9PiAocHJvcHMub25DbGljayhcIkhvbWVcIikpfT5Ib21lPC9hPjwvbGk+XG4gICAgICAgICAgICAgIDxsaT48YSBvbkNsaWNrPXsoKSA9PiAocHJvcHMub25DbGljayhcIk15UmF0aW5nc1wiKSl9Pk15IFJhdGluZ3M8L2E+PC9saT5cbiAgICAgICAgICAgICAgPGxpPjxhIG9uQ2xpY2s9eygpID0+IChwcm9wcy5vbkNsaWNrKFwiRnJpZW5kc1wiKSl9Pk15IEZyaWVuZHM8L2E+PC9saT5cbiAgICAgICAgICAgICAgPGxpPjxhIG9uQ2xpY2s9e3Byb3BzLmZpbmR9Pk5ldyBCdWRkaWVzPC9hPjwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPHVsIGlkPVwibmF2LW1vYmlsZVwiIGNsYXNzTmFtZT1cInJpZ2h0IGhpZGUtb24tbWVkLWFuZC1kb3duXCI+XG4gICAgICAgICAgICAgIDxsaT48YSBvbkNsaWNrPXtwcm9wcy5sb2dvdXR9PkxvZyBPdXQ8L2E+PC9saT4gICAgICBcbiAgICAgICAgICAgICAgPGxpPjxhIG9uQ2xpY2s9eygpID0+IChwcm9wcy5vbkNsaWNrKFwiSW5ib3hcIikpfT5Ob3RpZmljYXRpb25zPC9hPjwvbGk+ICAgICBcbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvbmF2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlYWRCYW5kXCI+XG4gICAgICAgIDxoMz5IaSwge3Byb3BzLm5hbWV9ITwvaDM+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbik7XG5cbndpbmRvdy5OYXYgPSBOYXY7XG4iXX0=
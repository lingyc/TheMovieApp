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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL05hdi5qcyJdLCJuYW1lcyI6WyJOYXYiLCJwcm9wcyIsIm9uQ2xpY2siLCJIb21lIiwiZmluZCIsImxvZ291dCIsIm5hbWUiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsTUFBTSxTQUFOQSxHQUFNLENBQUNDLEtBQUQ7QUFBQSxTQUNOO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxRQUFLLFdBQVUsNEJBQWY7QUFDRTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsWUFBSyxXQUFVLGFBQWY7QUFDRTtBQUFBO0FBQUEsY0FBRyxNQUFLLEdBQVIsRUFBWSxTQUFTO0FBQUEsdUJBQU9BLE1BQU1DLE9BQU4sQ0FBYyxNQUFkLENBQVA7QUFBQSxlQUFyQixFQUFvRCxXQUFVLG1CQUE5RDtBQUFBO0FBQUEsV0FERjtBQUVFO0FBQUE7QUFBQSxjQUFJLElBQUcsWUFBUCxFQUFvQixXQUFVLDJCQUE5QjtBQUNFO0FBQUE7QUFBQTtBQUFJO0FBQUE7QUFBQSxrQkFBRyxXQUFZRCxNQUFNRSxJQUFOLEtBQWUsSUFBaEIsR0FBd0IsUUFBeEIsR0FBbUMsRUFBakQsRUFBcUQsU0FBUztBQUFBLDJCQUFPRixNQUFNQyxPQUFOLENBQWMsTUFBZCxDQUFQO0FBQUEsbUJBQTlEO0FBQUE7QUFBQTtBQUFKLGFBREY7QUFFRTtBQUFBO0FBQUE7QUFBSTtBQUFBO0FBQUEsa0JBQUcsU0FBUztBQUFBLDJCQUFPRCxNQUFNQyxPQUFOLENBQWMsV0FBZCxDQUFQO0FBQUEsbUJBQVo7QUFBQTtBQUFBO0FBQUosYUFGRjtBQUdFO0FBQUE7QUFBQTtBQUFJO0FBQUE7QUFBQSxrQkFBRyxTQUFTO0FBQUEsMkJBQU9ELE1BQU1DLE9BQU4sQ0FBYyxTQUFkLENBQVA7QUFBQSxtQkFBWjtBQUFBO0FBQUE7QUFBSixhQUhGO0FBSUU7QUFBQTtBQUFBO0FBQUk7QUFBQTtBQUFBLGtCQUFHLFNBQVNELE1BQU1HLElBQWxCO0FBQUE7QUFBQTtBQUFKO0FBSkYsV0FGRjtBQVFFO0FBQUE7QUFBQSxjQUFJLElBQUcsWUFBUCxFQUFvQixXQUFVLDRCQUE5QjtBQUNFO0FBQUE7QUFBQTtBQUFJO0FBQUE7QUFBQSxrQkFBRyxTQUFTSCxNQUFNSSxNQUFsQjtBQUFBO0FBQUE7QUFBSixhQURGO0FBRUU7QUFBQTtBQUFBO0FBQUk7QUFBQTtBQUFBLGtCQUFHLFNBQVM7QUFBQSwyQkFBT0osTUFBTUMsT0FBTixDQUFjLE9BQWQsQ0FBUDtBQUFBLG1CQUFaO0FBQUE7QUFBQTtBQUFKO0FBRkY7QUFSRjtBQURGO0FBREYsS0FERjtBQWtCRTtBQUFBO0FBQUEsUUFBSyxXQUFVLFVBQWY7QUFDRTtBQUFBO0FBQUE7QUFBQTtBQUFTRCxjQUFNSyxJQUFmO0FBQUE7QUFBQTtBQURGO0FBbEJGLEdBRE07QUFBQSxDQUFWOztBQXlCQUMsT0FBT1AsR0FBUCxHQUFhQSxHQUFiIiwiZmlsZSI6Ik5hdi5qcyIsInNvdXJjZXNDb250ZW50IjpbImxldCBOYXYgPSAocHJvcHMpID0+IChcclxuICAgIDxkaXY+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2YmFyLWZpeGVkIG1vdmllQnVkZHlOYXZcIj5cclxuICAgICAgICA8bmF2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXYtd3JhcHBlclwiPlxyXG4gICAgICAgICAgICA8YSBocmVmPVwiI1wiIG9uQ2xpY2s9eygpID0+IChwcm9wcy5vbkNsaWNrKFwiSG9tZVwiKSl9IGNsYXNzTmFtZT1cImJyYW5kLWxvZ28gY2VudGVyXCI+VGhlTW92aWVBcHA8L2E+XHJcbiAgICAgICAgICAgIDx1bCBpZD1cIm5hdi1tb2JpbGVcIiBjbGFzc05hbWU9XCJsZWZ0IGhpZGUtb24tbWVkLWFuZC1kb3duXCI+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIGNsYXNzTmFtZT17KHByb3BzLkhvbWUgPT09IHRydWUpID8gXCJhY3RpdmVcIiA6IFwiXCJ9IG9uQ2xpY2s9eygpID0+IChwcm9wcy5vbkNsaWNrKFwiSG9tZVwiKSl9PkhvbWU8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgb25DbGljaz17KCkgPT4gKHByb3BzLm9uQ2xpY2soXCJNeVJhdGluZ3NcIikpfT5NeSBSYXRpbmdzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIG9uQ2xpY2s9eygpID0+IChwcm9wcy5vbkNsaWNrKFwiRnJpZW5kc1wiKSl9Pk15IEZyaWVuZHM8L2E+PC9saT5cclxuICAgICAgICAgICAgICA8bGk+PGEgb25DbGljaz17cHJvcHMuZmluZH0+TmV3IEJ1ZGRpZXM8L2E+PC9saT5cclxuICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgPHVsIGlkPVwibmF2LW1vYmlsZVwiIGNsYXNzTmFtZT1cInJpZ2h0IGhpZGUtb24tbWVkLWFuZC1kb3duXCI+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIG9uQ2xpY2s9e3Byb3BzLmxvZ291dH0+TG9nIE91dDwvYT48L2xpPiAgICAgIFxyXG4gICAgICAgICAgICAgIDxsaT48YSBvbkNsaWNrPXsoKSA9PiAocHJvcHMub25DbGljayhcIkluYm94XCIpKX0+Tm90aWZpY2F0aW9uczwvYT48L2xpPiAgICAgXHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L25hdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZEJhbmRcIj5cclxuICAgICAgICA8aDM+SGksIHtwcm9wcy5uYW1lfSE8L2gzPlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4pO1xyXG5cclxud2luZG93Lk5hdiA9IE5hdjtcclxuIl19
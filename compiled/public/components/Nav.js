"use strict";

var Nav = function Nav(_ref) {
  var _onClick = _ref.onClick;
  var Home = _ref.Home;
  var find = _ref.find;
  var logout = _ref.logout;
  var name = _ref.name;
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
                return _onClick("Home");
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
                { className: Home === true ? "active" : "", onClick: function onClick() {
                    return _onClick("Home");
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
                    return _onClick("MyRatings");
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
                    return _onClick("Friends");
                  } },
                "My Friends"
              )
            ),
            React.createElement(
              "li",
              null,
              React.createElement(
                "a",
                { onClick: find },
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
                { onClick: logout },
                "Log Out"
              )
            ),
            React.createElement(
              "li",
              null,
              React.createElement(
                "a",
                { onClick: function onClick() {
                    return _onClick("Inbox");
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
        name,
        "!"
      )
    )
  );
};

window.Nav = Nav;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL05hdi5qcyJdLCJuYW1lcyI6WyJOYXYiLCJvbkNsaWNrIiwiSG9tZSIsImZpbmQiLCJsb2dvdXQiLCJuYW1lIiwid2luZG93Il0sIm1hcHBpbmdzIjoiOztBQUFBLElBQU1BLE1BQU0sU0FBTkEsR0FBTTtBQUFBLE1BQUVDLFFBQUYsUUFBRUEsT0FBRjtBQUFBLE1BQVdDLElBQVgsUUFBV0EsSUFBWDtBQUFBLE1BQWlCQyxJQUFqQixRQUFpQkEsSUFBakI7QUFBQSxNQUF1QkMsTUFBdkIsUUFBdUJBLE1BQXZCO0FBQUEsTUFBK0JDLElBQS9CLFFBQStCQSxJQUEvQjtBQUFBLFNBQ1I7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLFFBQUssV0FBVSw0QkFBZjtBQUNFO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxZQUFLLFdBQVUsYUFBZjtBQUNFO0FBQUE7QUFBQSxjQUFHLE1BQUssR0FBUixFQUFZLFNBQVM7QUFBQSx1QkFBT0osU0FBUSxNQUFSLENBQVA7QUFBQSxlQUFyQixFQUE4QyxXQUFVLG1CQUF4RDtBQUFBO0FBQUEsV0FERjtBQUVFO0FBQUE7QUFBQSxjQUFJLElBQUcsWUFBUCxFQUFvQixXQUFVLDJCQUE5QjtBQUNFO0FBQUE7QUFBQTtBQUFJO0FBQUE7QUFBQSxrQkFBRyxXQUFZQyxTQUFTLElBQVYsR0FBa0IsUUFBbEIsR0FBNkIsRUFBM0MsRUFBK0MsU0FBUztBQUFBLDJCQUFPRCxTQUFRLE1BQVIsQ0FBUDtBQUFBLG1CQUF4RDtBQUFBO0FBQUE7QUFBSixhQURGO0FBRUU7QUFBQTtBQUFBO0FBQUk7QUFBQTtBQUFBLGtCQUFHLFNBQVM7QUFBQSwyQkFBT0EsU0FBUSxXQUFSLENBQVA7QUFBQSxtQkFBWjtBQUFBO0FBQUE7QUFBSixhQUZGO0FBR0U7QUFBQTtBQUFBO0FBQUk7QUFBQTtBQUFBLGtCQUFHLFNBQVM7QUFBQSwyQkFBT0EsU0FBUSxTQUFSLENBQVA7QUFBQSxtQkFBWjtBQUFBO0FBQUE7QUFBSixhQUhGO0FBSUU7QUFBQTtBQUFBO0FBQUk7QUFBQTtBQUFBLGtCQUFHLFNBQVNFLElBQVo7QUFBQTtBQUFBO0FBQUo7QUFKRixXQUZGO0FBUUU7QUFBQTtBQUFBLGNBQUksSUFBRyxZQUFQLEVBQW9CLFdBQVUsNEJBQTlCO0FBQ0U7QUFBQTtBQUFBO0FBQUk7QUFBQTtBQUFBLGtCQUFHLFNBQVNDLE1BQVo7QUFBQTtBQUFBO0FBQUosYUFERjtBQUVFO0FBQUE7QUFBQTtBQUFJO0FBQUE7QUFBQSxrQkFBRyxTQUFTO0FBQUEsMkJBQU9ILFNBQVEsT0FBUixDQUFQO0FBQUEsbUJBQVo7QUFBQTtBQUFBO0FBQUo7QUFGRjtBQVJGO0FBREY7QUFERixLQURGO0FBa0JFO0FBQUE7QUFBQSxRQUFLLFdBQVUsVUFBZjtBQUNFO0FBQUE7QUFBQTtBQUFBO0FBQVNJLFlBQVQ7QUFBQTtBQUFBO0FBREY7QUFsQkYsR0FEUTtBQUFBLENBQVo7O0FBeUJBQyxPQUFPTixHQUFQLEdBQWFBLEdBQWIiLCJmaWxlIjoiTmF2LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgTmF2ID0gKHtvbkNsaWNrLCBIb21lLCBmaW5kLCBsb2dvdXQsIG5hbWV9KSA9PiAoXHJcbiAgICA8ZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhci1maXhlZCBtb3ZpZUJ1ZGR5TmF2XCI+XHJcbiAgICAgICAgPG5hdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibmF2LXdyYXBwZXJcIj5cclxuICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBvbkNsaWNrPXsoKSA9PiAob25DbGljayhcIkhvbWVcIikpfSBjbGFzc05hbWU9XCJicmFuZC1sb2dvIGNlbnRlclwiPlRoZU1vdmllQXBwPC9hPlxyXG4gICAgICAgICAgICA8dWwgaWQ9XCJuYXYtbW9iaWxlXCIgY2xhc3NOYW1lPVwibGVmdCBoaWRlLW9uLW1lZC1hbmQtZG93blwiPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBjbGFzc05hbWU9eyhIb21lID09PSB0cnVlKSA/IFwiYWN0aXZlXCIgOiBcIlwifSBvbkNsaWNrPXsoKSA9PiAob25DbGljayhcIkhvbWVcIikpfT5Ib21lPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIG9uQ2xpY2s9eygpID0+IChvbkNsaWNrKFwiTXlSYXRpbmdzXCIpKX0+TXkgUmF0aW5nczwvYT48L2xpPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBvbkNsaWNrPXsoKSA9PiAob25DbGljayhcIkZyaWVuZHNcIikpfT5NeSBGcmllbmRzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgPGxpPjxhIG9uQ2xpY2s9e2ZpbmR9Pk5ldyBCdWRkaWVzPC9hPjwvbGk+XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgIDx1bCBpZD1cIm5hdi1tb2JpbGVcIiBjbGFzc05hbWU9XCJyaWdodCBoaWRlLW9uLW1lZC1hbmQtZG93blwiPlxyXG4gICAgICAgICAgICAgIDxsaT48YSBvbkNsaWNrPXtsb2dvdXR9PkxvZyBPdXQ8L2E+PC9saT4gICAgICBcclxuICAgICAgICAgICAgICA8bGk+PGEgb25DbGljaz17KCkgPT4gKG9uQ2xpY2soXCJJbmJveFwiKSl9Pk5vdGlmaWNhdGlvbnM8L2E+PC9saT4gICAgIFxyXG4gICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9uYXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImhlYWRCYW5kXCI+XHJcbiAgICAgICAgPGgzPkhpLCB7bmFtZX0hPC9oMz5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuKTtcclxuXHJcbndpbmRvdy5OYXYgPSBOYXY7XHJcbiJdfQ==
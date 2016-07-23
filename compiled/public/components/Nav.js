"use strict";

var Nav = function Nav(props) {
  return React.createElement(
    "nav",
    { className: "navbar" },
    React.createElement(
      "div",
      null,
      React.createElement(
        "h1",
        null,
        "Hi, ",
        props.name,
        "!"
      ),
      React.createElement(
        "button",
        { onClick: function onClick() {
            return props.onClick("Home");
          } },
        "Home"
      ),
      React.createElement(
        "button",
        { onClick: function onClick() {
            return props.onClick("MyRatings");
          } },
        "My Ratings"
      ),
      React.createElement(
        "button",
        { onClick: function onClick() {
            return props.onClick("Friends");
          } },
        "My Friends "
      ),
      React.createElement(
        "button",
        { onClick: props.find },
        "Find New Movie Buddies"
      ),
      React.createElement(
        "div",
        { id: "logOutButton" },
        React.createElement(
          "button",
          { onClick: props.logout },
          "Log Out"
        ),
        React.createElement(
          "button",
          { onClick: function onClick() {
              return props.onClick("Inbox");
            } },
          "Notifications "
        )
      )
    )
  );
};

window.Nav = Nav;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL05hdi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksTUFBTSxTQUFOLEdBQU0sQ0FBQyxLQUFEO0FBQUEsU0FDUjtBQUFBO0FBQUEsTUFBSyxXQUFVLFFBQWY7QUFDRTtBQUFBO0FBQUE7QUFDSTtBQUFBO0FBQUE7QUFBQTtBQUFTLGNBQU0sSUFBZjtBQUFBO0FBQUEsT0FESjtBQUVJO0FBQUE7QUFBQSxVQUFRLFNBQVM7QUFBQSxtQkFBTyxNQUFNLE9BQU4sQ0FBYyxNQUFkLENBQVA7QUFBQSxXQUFqQjtBQUFBO0FBQUEsT0FGSjtBQUdJO0FBQUE7QUFBQSxVQUFRLFNBQVM7QUFBQSxtQkFBTyxNQUFNLE9BQU4sQ0FBYyxXQUFkLENBQVA7QUFBQSxXQUFqQjtBQUFBO0FBQUEsT0FISjtBQUlJO0FBQUE7QUFBQSxVQUFRLFNBQVM7QUFBQSxtQkFBTyxNQUFNLE9BQU4sQ0FBYyxTQUFkLENBQVA7QUFBQSxXQUFqQjtBQUFBO0FBQUEsT0FKSjtBQUtJO0FBQUE7QUFBQSxVQUFRLFNBQVMsTUFBTSxJQUF2QjtBQUFBO0FBQUEsT0FMSjtBQU1JO0FBQUE7QUFBQSxVQUFLLElBQUcsY0FBUjtBQUNBO0FBQUE7QUFBQSxZQUFRLFNBQVMsTUFBTSxNQUF2QjtBQUFBO0FBQUEsU0FEQTtBQUVBO0FBQUE7QUFBQSxZQUFRLFNBQVM7QUFBQSxxQkFBTyxNQUFNLE9BQU4sQ0FBYyxPQUFkLENBQVA7QUFBQSxhQUFqQjtBQUFBO0FBQUE7QUFGQTtBQU5KO0FBREYsR0FEUTtBQUFBLENBQVY7O0FBaUJBLE9BQU8sR0FBUCxHQUFhLEdBQWIiLCJmaWxlIjoiTmF2LmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IE5hdiA9IChwcm9wcykgPT4gKFxuICA8bmF2IGNsYXNzTmFtZT1cIm5hdmJhclwiPlxuICAgIDxkaXY+XG4gICAgICAgIDxoMT5IaSwge3Byb3BzLm5hbWV9ITwvaDE+XG4gICAgICAgIDxidXR0b24gb25DbGljaz17KCkgPT4gKHByb3BzLm9uQ2xpY2soXCJIb21lXCIpKX0+SG9tZTwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IChwcm9wcy5vbkNsaWNrKFwiTXlSYXRpbmdzXCIpKX0+TXkgUmF0aW5nczwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9eygpID0+IChwcm9wcy5vbkNsaWNrKFwiRnJpZW5kc1wiKSl9Pk15IEZyaWVuZHMgPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gb25DbGljaz17cHJvcHMuZmluZH0+RmluZCBOZXcgTW92aWUgQnVkZGllczwvYnV0dG9uPlxuICAgICAgICA8ZGl2IGlkPSdsb2dPdXRCdXR0b24nPlxuICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e3Byb3BzLmxvZ291dH0+TG9nIE91dDwvYnV0dG9uPiBcbiAgICAgICAgPGJ1dHRvbiBvbkNsaWNrPXsoKSA9PiAocHJvcHMub25DbGljayhcIkluYm94XCIpKX0+Tm90aWZpY2F0aW9ucyA8L2J1dHRvbj5cbiAgICAgICAgIDwvZGl2PlxuICAgICAgXG4gICAgPC9kaXY+XG4gIDwvbmF2PlxuKTtcblxud2luZG93Lk5hdiA9IE5hdjtcblxuXG5cbiJdfQ==
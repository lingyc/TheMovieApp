"use strict";

var FindMovieBuddy = function FindMovieBuddy(props) {

  return React.createElement(
    "div",
    null,
    React.createElement(
      "h2",
      null,
      "Your Potential Movie Buddies"
    ),
    "  ",
    React.createElement("br", null),
    props.buddies.map(function (buddy) {
      return React.createElement(BuddyEntry, { buddyfunc: props.buddyfunc, Buddy: buddy[0], BuddyScore: buddy[1] });
    })
  );
};

window.FindMovieBuddy = FindMovieBuddy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2ZpbmRNb3ZpZUJ1ZGR5Vmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksaUJBQWlCLFNBQWpCLGNBQWlCLENBQUMsS0FBRCxFQUFXOztBQUU5QixTQUVDO0FBQUE7QUFBQTtBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FGQTtBQUFBO0FBRXVDLG1DQUZ2QztBQUlDLFVBQU0sT0FBTixDQUFjLEdBQWQsQ0FBa0IsVUFBUyxLQUFULEVBQWU7QUFBRSxhQUFRLG9CQUFDLFVBQUQsSUFBWSxXQUFXLE1BQU0sU0FBN0IsRUFBd0MsT0FBTyxNQUFNLENBQU4sQ0FBL0MsRUFBeUQsWUFBWSxNQUFNLENBQU4sQ0FBckUsR0FBUjtBQUE0RixLQUEvSDtBQUpELEdBRkQ7QUFXQSxDQWJGOztBQWVBLE9BQU8sY0FBUCxHQUF3QixjQUF4QiIsImZpbGUiOiJmaW5kTW92aWVCdWRkeVZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgRmluZE1vdmllQnVkZHkgPSAocHJvcHMpID0+IHtcblxuICByZXR1cm4gKFxuXG4gICA8ZGl2PlxuXG4gICA8aDI+WW91ciBQb3RlbnRpYWwgTW92aWUgQnVkZGllczwvaDI+ICA8YnIvPlxuICBcbiAgIHtwcm9wcy5idWRkaWVzLm1hcChmdW5jdGlvbihidWRkeSl7IHJldHVybiAoPEJ1ZGR5RW50cnkgYnVkZHlmdW5jPXtwcm9wcy5idWRkeWZ1bmN9IEJ1ZGR5PXtidWRkeVswXX0gQnVkZHlTY29yZT17YnVkZHlbMV19IC8+ICl9KX1cblxuICAgICA8L2Rpdj5cbiAgIFxuXG4pfTtcblxud2luZG93LkZpbmRNb3ZpZUJ1ZGR5ID0gRmluZE1vdmllQnVkZHk7Il19
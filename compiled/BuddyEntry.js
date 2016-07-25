'use strict';

var BuddyEntry = function BuddyEntry(props) {
  //var test=props.Friend;
  return React.createElement(
    'div',
    null,
    React.createElement(
      'h3',
      null,
      props.Buddy
    ),
    React.createElement(
      'button',
      { className: 'buddy', onClick: function onClick() {
          props.buddyfunc(props.Buddy);
        } },
      'Click to send ',
      props.Buddy,
      ' a friend request'
    ),
    ' Compatability:',
    props.BuddyScore,
    '%'
  );
};

window.BuddyEntry = BuddyEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL0J1ZGR5RW50cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGFBQWEsU0FBYixVQUFhLENBQUMsS0FBRCxFQUFXOztBQUUxQixTQUNDO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFNLFlBQU07QUFBWixLQURBO0FBQ3VCO0FBQUE7QUFBQSxRQUFRLFdBQVUsT0FBbEIsRUFBMEIsU0FBUyxtQkFBVTtBQUFDLGdCQUFNLFNBQU4sQ0FBZ0IsTUFBTSxLQUF0QjtBQUE2QixTQUEzRTtBQUFBO0FBQTRGLFlBQU0sS0FBbEc7QUFBQTtBQUFBLEtBRHZCO0FBQUE7QUFDeUssVUFBTSxVQUQvSztBQUFBO0FBQUEsR0FERDtBQUtELENBUEQ7O0FBU0EsT0FBTyxVQUFQLEdBQW9CLFVBQXBCIiwiZmlsZSI6IkJ1ZGR5RW50cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgQnVkZHlFbnRyeSA9IChwcm9wcykgPT4ge1xuLy92YXIgdGVzdD1wcm9wcy5GcmllbmQ7XG4gIHJldHVybiAoXG4gICA8ZGl2PlxuICAgPGgzID57cHJvcHMuQnVkZHl9PC9oMz48YnV0dG9uIGNsYXNzTmFtZT0nYnVkZHknIG9uQ2xpY2s9e2Z1bmN0aW9uKCl7cHJvcHMuYnVkZHlmdW5jKHByb3BzLkJ1ZGR5KX19PkNsaWNrIHRvIHNlbmQge3Byb3BzLkJ1ZGR5fSBhIGZyaWVuZCByZXF1ZXN0PC9idXR0b24+IENvbXBhdGFiaWxpdHk6e3Byb3BzLkJ1ZGR5U2NvcmV9JVxuICA8L2Rpdj5cbilcbn07XG5cbndpbmRvdy5CdWRkeUVudHJ5ID0gQnVkZHlFbnRyeTsiXX0=
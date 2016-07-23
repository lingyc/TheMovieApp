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
    props.BuddyScore
  );
};

window.BuddyEntry = BuddyEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL0J1ZGR5RW50cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGFBQWEsU0FBYixVQUFhLENBQUMsS0FBRCxFQUFXOzs7QUFHMUIsU0FDQTtBQUFBO0FBQUE7QUFDQztBQUFBO0FBQUE7QUFBTSxZQUFNO0FBQVosS0FERDtBQUN3QjtBQUFBO0FBQUEsUUFBUSxXQUFVLE9BQWxCLEVBQTBCLFNBQVMsbUJBQVU7QUFBQyxnQkFBTSxTQUFOLENBQWdCLE1BQU0sS0FBdEI7QUFBNkIsU0FBM0U7QUFBQTtBQUE0RixZQUFNLEtBQWxHO0FBQUE7QUFBQSxLQUR4QjtBQUFBO0FBQzBLLFVBQU07QUFEaEwsR0FEQTtBQUlBLENBUEY7O0FBU0EsT0FBTyxVQUFQLEdBQW9CLFVBQXBCIiwiZmlsZSI6IkJ1ZGR5RW50cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgQnVkZHlFbnRyeSA9IChwcm9wcykgPT4ge1xuLy92YXIgdGVzdD1wcm9wcy5GcmllbmQ7XG5cbiAgcmV0dXJuIChcbiAgPGRpdj5cbiAgIDxoMyA+e3Byb3BzLkJ1ZGR5fTwvaDM+PGJ1dHRvbiBjbGFzc05hbWU9J2J1ZGR5JyBvbkNsaWNrPXtmdW5jdGlvbigpe3Byb3BzLmJ1ZGR5ZnVuYyhwcm9wcy5CdWRkeSl9fT5DbGljayB0byBzZW5kIHtwcm9wcy5CdWRkeX0gYSBmcmllbmQgcmVxdWVzdDwvYnV0dG9uPiBDb21wYXRhYmlsaXR5Ontwcm9wcy5CdWRkeVNjb3JlfVxuICA8L2Rpdj5cbil9O1xuXG53aW5kb3cuQnVkZHlFbnRyeSA9IEJ1ZGR5RW50cnk7Il19
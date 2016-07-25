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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0J1ZGR5RW50cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGFBQWEsU0FBYixVQUFhLENBQUMsS0FBRCxFQUFXO0FBQzVCO0FBQ0UsU0FDQztBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBTSxZQUFNO0FBQVosS0FEQTtBQUN1QjtBQUFBO0FBQUEsUUFBUSxXQUFVLE9BQWxCLEVBQTBCLFNBQVMsbUJBQVU7QUFBQyxnQkFBTSxTQUFOLENBQWdCLE1BQU0sS0FBdEI7QUFBNkIsU0FBM0U7QUFBQTtBQUE0RixZQUFNLEtBQWxHO0FBQUE7QUFBQSxLQUR2QjtBQUFBO0FBQ3lLLFVBQU0sVUFEL0s7QUFBQTtBQUFBLEdBREQ7QUFLRCxDQVBEOztBQVNBLE9BQU8sVUFBUCxHQUFvQixVQUFwQiIsImZpbGUiOiJCdWRkeUVudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEJ1ZGR5RW50cnkgPSAocHJvcHMpID0+IHtcbi8vdmFyIHRlc3Q9cHJvcHMuRnJpZW5kO1xuICByZXR1cm4gKFxuICAgPGRpdj5cbiAgIDxoMyA+e3Byb3BzLkJ1ZGR5fTwvaDM+PGJ1dHRvbiBjbGFzc05hbWU9J2J1ZGR5JyBvbkNsaWNrPXtmdW5jdGlvbigpe3Byb3BzLmJ1ZGR5ZnVuYyhwcm9wcy5CdWRkeSl9fT5DbGljayB0byBzZW5kIHtwcm9wcy5CdWRkeX0gYSBmcmllbmQgcmVxdWVzdDwvYnV0dG9uPiBDb21wYXRhYmlsaXR5Ontwcm9wcy5CdWRkeVNjb3JlfSVcbiAgPC9kaXY+XG4pXG59O1xuXG53aW5kb3cuQnVkZHlFbnRyeSA9IEJ1ZGR5RW50cnk7Il19
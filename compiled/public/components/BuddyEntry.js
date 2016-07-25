'use strict';

var BuddyEntry = function BuddyEntry(props) {
  //var test=props.Friend;
  return React.createElement(
    'div',
    { className: 'collection-item row' },
    React.createElement(
      'div',
      { className: 'col s3' },
      React.createElement('img', { className: 'profilethumnail', src: 'https://unsplash.it/170/170/?random' })
    ),
    React.createElement(
      'div',
      { id: 'Friend', className: 'buddy col s9' },
      React.createElement(
        'h3',
        { className: 'buddyName' },
        props.Buddy
      ),
      React.createElement(
        'a',
        { className: 'waves-effect waves-light btn', onClick: function onClick() {
            props.buddyfunc(props.Buddy);
          } },
        'send friend request'
      ),
      React.createElement(
        'div',
        { className: 'buddyCompatibility' },
        'Compatability:',
        props.BuddyScore
      )
    )
  );
};

window.BuddyEntry = BuddyEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0J1ZGR5RW50cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGFBQWEsU0FBYixVQUFhLENBQUMsS0FBRCxFQUFXO0FBQzVCO0FBQ0UsU0FDQTtBQUFBO0FBQUEsTUFBSyxXQUFVLHFCQUFmO0FBQ0U7QUFBQTtBQUFBLFFBQUssV0FBVSxRQUFmO0FBQ0MsbUNBQUssV0FBVSxpQkFBZixFQUFpQyxLQUFLLHFDQUF0QztBQURELEtBREY7QUFJRTtBQUFBO0FBQUEsUUFBSyxJQUFHLFFBQVIsRUFBaUIsV0FBVSxjQUEzQjtBQUNDO0FBQUE7QUFBQSxVQUFJLFdBQVUsV0FBZDtBQUEyQixjQUFNO0FBQWpDLE9BREQ7QUFFQztBQUFBO0FBQUEsVUFBRyxXQUFVLDhCQUFiLEVBQTRDLFNBQVMsbUJBQVU7QUFBQyxrQkFBTSxTQUFOLENBQWdCLE1BQU0sS0FBdEI7QUFBNkIsV0FBN0Y7QUFBQTtBQUFBLE9BRkQ7QUFHQztBQUFBO0FBQUEsVUFBSyxXQUFVLG9CQUFmO0FBQUE7QUFBbUQsY0FBTTtBQUF6RDtBQUhEO0FBSkYsR0FEQTtBQVlELENBZEQ7O0FBZ0JBLE9BQU8sVUFBUCxHQUFvQixVQUFwQiIsImZpbGUiOiJCdWRkeUVudHJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEJ1ZGR5RW50cnkgPSAocHJvcHMpID0+IHtcbi8vdmFyIHRlc3Q9cHJvcHMuRnJpZW5kO1xuICByZXR1cm4gKFxuICA8ZGl2IGNsYXNzTmFtZT0nY29sbGVjdGlvbi1pdGVtIHJvdyc+XG4gICAgPGRpdiBjbGFzc05hbWU9XCJjb2wgczNcIj5cbiAgICBcdDxpbWcgY2xhc3NOYW1lPSdwcm9maWxldGh1bW5haWwnIHNyYz17J2h0dHBzOi8vdW5zcGxhc2guaXQvMTcwLzE3MC8/cmFuZG9tJ30vPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgaWQ9XCJGcmllbmRcIiBjbGFzc05hbWU9XCJidWRkeSBjb2wgczlcIj5cbiAgIFx0XHQ8aDMgY2xhc3NOYW1lPVwiYnVkZHlOYW1lXCI+e3Byb3BzLkJ1ZGR5fTwvaDM+XG4gICBcdFx0PGEgY2xhc3NOYW1lPVwid2F2ZXMtZWZmZWN0IHdhdmVzLWxpZ2h0IGJ0blwiIG9uQ2xpY2s9e2Z1bmN0aW9uKCl7cHJvcHMuYnVkZHlmdW5jKHByb3BzLkJ1ZGR5KX19PnNlbmQgZnJpZW5kIHJlcXVlc3Q8L2E+IFxuICAgXHRcdDxkaXYgY2xhc3NOYW1lPVwiYnVkZHlDb21wYXRpYmlsaXR5XCI+Q29tcGF0YWJpbGl0eTp7cHJvcHMuQnVkZHlTY29yZX08L2Rpdj5cbiAgXHQ8L2Rpdj5cbiAgPC9kaXY+XG4pXG59O1xuXG53aW5kb3cuQnVkZHlFbnRyeSA9IEJ1ZGR5RW50cnk7Il19
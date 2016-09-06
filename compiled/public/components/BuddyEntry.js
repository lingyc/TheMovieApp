'use strict';

var BuddyEntry = function BuddyEntry(_ref) {
  var Buddy = _ref.Buddy;
  var BuddyScore = _ref.BuddyScore;
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
        Buddy
      ),
      React.createElement(
        'div',
        { className: 'buddyCompatibility' },
        BuddyScore === 'Nothing to compare' ? 'Compatability: ' + Buddy + ' has not rated any movies' : 'Compatability' + BuddyScore
      ),
      React.createElement(
        'a',
        { className: 'waves-effect waves-light btn', onClick: function onClick() {
            buddyfunc(Buddy);
          } },
        'send friend request'
      )
    )
  );
};

window.BuddyEntry = BuddyEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0J1ZGR5RW50cnkuanMiXSwibmFtZXMiOlsiQnVkZHlFbnRyeSIsIkJ1ZGR5IiwiQnVkZHlTY29yZSIsImJ1ZGR5ZnVuYyIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxhQUFhLFNBQWJBLFVBQWE7QUFBQSxNQUFFQyxLQUFGLFFBQUVBLEtBQUY7QUFBQSxNQUFTQyxVQUFULFFBQVNBLFVBQVQ7QUFBQSxTQUVqQjtBQUFBO0FBQUEsTUFBSyxXQUFVLHFCQUFmO0FBQ0U7QUFBQTtBQUFBLFFBQUssV0FBVSxRQUFmO0FBQ0MsbUNBQUssV0FBVSxpQkFBZixFQUFpQyxLQUFLLHFDQUF0QztBQURELEtBREY7QUFJRTtBQUFBO0FBQUEsUUFBSyxJQUFHLFFBQVIsRUFBaUIsV0FBVSxjQUEzQjtBQUNDO0FBQUE7QUFBQSxVQUFJLFdBQVUsV0FBZDtBQUEyQkQ7QUFBM0IsT0FERDtBQUVFO0FBQUE7QUFBQSxVQUFLLFdBQVUsb0JBQWY7QUFBc0NDLHVCQUFlLG9CQUFoQix1QkFBMERELEtBQTFELG1EQUE2R0M7QUFBbEosT0FGRjtBQUdDO0FBQUE7QUFBQSxVQUFHLFdBQVUsOEJBQWIsRUFBNEMsU0FBUyxtQkFBVTtBQUFDQyxzQkFBVUYsS0FBVjtBQUFpQixXQUFqRjtBQUFBO0FBQUE7QUFIRDtBQUpGLEdBRmlCO0FBQUEsQ0FBbkI7O0FBZUFHLE9BQU9KLFVBQVAsR0FBb0JBLFVBQXBCIiwiZmlsZSI6IkJ1ZGR5RW50cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBCdWRkeUVudHJ5ID0gKHtCdWRkeSwgQnVkZHlTY29yZX0pID0+IChcclxuIFxyXG4gIDxkaXYgY2xhc3NOYW1lPSdjb2xsZWN0aW9uLWl0ZW0gcm93Jz5cclxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sIHMzXCI+XHJcbiAgICBcdDxpbWcgY2xhc3NOYW1lPSdwcm9maWxldGh1bW5haWwnIHNyYz17J2h0dHBzOi8vdW5zcGxhc2guaXQvMTcwLzE3MC8/cmFuZG9tJ30vPlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGlkPVwiRnJpZW5kXCIgY2xhc3NOYW1lPVwiYnVkZHkgY29sIHM5XCI+XHJcbiAgIFx0XHQ8aDMgY2xhc3NOYW1lPVwiYnVkZHlOYW1lXCI+e0J1ZGR5fTwvaDM+XHJcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnVkZHlDb21wYXRpYmlsaXR5XCI+eyhCdWRkeVNjb3JlID09PSAnTm90aGluZyB0byBjb21wYXJlJykgPyBgQ29tcGF0YWJpbGl0eTogJHtCdWRkeX0gaGFzIG5vdCByYXRlZCBhbnkgbW92aWVzYCA6IGBDb21wYXRhYmlsaXR5JHtCdWRkeVNjb3JlfWB9PC9kaXY+XHJcbiAgIFx0XHQ8YSBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17ZnVuY3Rpb24oKXtidWRkeWZ1bmMoQnVkZHkpfX0+c2VuZCBmcmllbmQgcmVxdWVzdDwvYT4gXHJcbiAgXHQ8L2Rpdj5cclxuICA8L2Rpdj5cclxuKVxyXG5cclxuXHJcbndpbmRvdy5CdWRkeUVudHJ5ID0gQnVkZHlFbnRyeTtcclxuXHJcbiJdfQ==
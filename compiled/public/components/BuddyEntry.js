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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0J1ZGR5RW50cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGFBQWEsU0FBYixVQUFhLENBQUMsS0FBRCxFQUFXOztBQUUxQixTQUNBO0FBQUE7QUFBQSxNQUFLLFdBQVUscUJBQWY7QUFDRTtBQUFBO0FBQUEsUUFBSyxXQUFVLFFBQWY7QUFDQyxtQ0FBSyxXQUFVLGlCQUFmLEVBQWlDLEtBQUsscUNBQXRDO0FBREQsS0FERjtBQUlFO0FBQUE7QUFBQSxRQUFLLElBQUcsUUFBUixFQUFpQixXQUFVLGNBQTNCO0FBQ0M7QUFBQTtBQUFBLFVBQUksV0FBVSxXQUFkO0FBQTJCLGNBQU07QUFBakMsT0FERDtBQUVDO0FBQUE7QUFBQSxVQUFHLFdBQVUsOEJBQWIsRUFBNEMsU0FBUyxtQkFBVTtBQUFDLGtCQUFNLFNBQU4sQ0FBZ0IsTUFBTSxLQUF0QjtBQUE2QixXQUE3RjtBQUFBO0FBQUEsT0FGRDtBQUdDO0FBQUE7QUFBQSxVQUFLLFdBQVUsb0JBQWY7QUFBQTtBQUFtRCxjQUFNO0FBQXpEO0FBSEQ7QUFKRixHQURBO0FBWUQsQ0FkRDs7QUFnQkEsT0FBTyxVQUFQLEdBQW9CLFVBQXBCIiwiZmlsZSI6IkJ1ZGR5RW50cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgQnVkZHlFbnRyeSA9IChwcm9wcykgPT4ge1xuLy92YXIgdGVzdD1wcm9wcy5GcmllbmQ7XG4gIHJldHVybiAoXG4gIDxkaXYgY2xhc3NOYW1lPSdjb2xsZWN0aW9uLWl0ZW0gcm93Jz5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbCBzM1wiPlxuICAgIFx0PGltZyBjbGFzc05hbWU9J3Byb2ZpbGV0aHVtbmFpbCcgc3JjPXsnaHR0cHM6Ly91bnNwbGFzaC5pdC8xNzAvMTcwLz9yYW5kb20nfS8+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBpZD1cIkZyaWVuZFwiIGNsYXNzTmFtZT1cImJ1ZGR5IGNvbCBzOVwiPlxuICAgXHRcdDxoMyBjbGFzc05hbWU9XCJidWRkeU5hbWVcIj57cHJvcHMuQnVkZHl9PC9oMz5cbiAgIFx0XHQ8YSBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17ZnVuY3Rpb24oKXtwcm9wcy5idWRkeWZ1bmMocHJvcHMuQnVkZHkpfX0+c2VuZCBmcmllbmQgcmVxdWVzdDwvYT4gXG4gICBcdFx0PGRpdiBjbGFzc05hbWU9XCJidWRkeUNvbXBhdGliaWxpdHlcIj5Db21wYXRhYmlsaXR5Ontwcm9wcy5CdWRkeVNjb3JlfTwvZGl2PlxuICBcdDwvZGl2PlxuICA8L2Rpdj5cbilcbn07XG5cbndpbmRvdy5CdWRkeUVudHJ5ID0gQnVkZHlFbnRyeTsiXX0=
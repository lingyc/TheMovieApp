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
        'div',
        { className: 'buddyCompatibility' },
        props.BuddyScore === 'Nothing to compare' ? 'Compatability: ' + props.Buddy + ' has not rated any movies' : 'Compatability: ' + props.BuddyScore
      ),
      React.createElement(
        'a',
        { className: 'waves-effect waves-light btn', onClick: function onClick() {
            props.buddyfunc(props.Buddy);
          } },
        'send friend request'
      )
    )
  );
};

window.BuddyEntry = BuddyEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0J1ZGR5RW50cnkuanMiXSwibmFtZXMiOlsiQnVkZHlFbnRyeSIsInByb3BzIiwiQnVkZHkiLCJCdWRkeVNjb3JlIiwiYnVkZHlmdW5jIiwid2luZG93Il0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLGFBQWEsU0FBYkEsVUFBYSxDQUFDQyxLQUFELEVBQVc7QUFDNUI7QUFDRSxTQUNBO0FBQUE7QUFBQSxNQUFLLFdBQVUscUJBQWY7QUFDRTtBQUFBO0FBQUEsUUFBSyxXQUFVLFFBQWY7QUFDQyxtQ0FBSyxXQUFVLGlCQUFmLEVBQWlDLEtBQUsscUNBQXRDO0FBREQsS0FERjtBQUlFO0FBQUE7QUFBQSxRQUFLLElBQUcsUUFBUixFQUFpQixXQUFVLGNBQTNCO0FBQ0M7QUFBQTtBQUFBLFVBQUksV0FBVSxXQUFkO0FBQTJCQSxjQUFNQztBQUFqQyxPQUREO0FBRUM7QUFBQTtBQUFBLFVBQUssV0FBVSxvQkFBZjtBQUFzQ0QsY0FBTUUsVUFBTixLQUFxQixvQkFBdEIsR0FBOEMsb0JBQW9CRixNQUFNQyxLQUExQixHQUFrQywyQkFBaEYsR0FBOEcsb0JBQW9CRCxNQUFNRTtBQUE3SyxPQUZEO0FBR0M7QUFBQTtBQUFBLFVBQUcsV0FBVSw4QkFBYixFQUE0QyxTQUFTLG1CQUFVO0FBQUNGLGtCQUFNRyxTQUFOLENBQWdCSCxNQUFNQyxLQUF0QjtBQUE2QixXQUE3RjtBQUFBO0FBQUE7QUFIRDtBQUpGLEdBREE7QUFZRCxDQWREOztBQWdCQUcsT0FBT0wsVUFBUCxHQUFvQkEsVUFBcEIiLCJmaWxlIjoiQnVkZHlFbnRyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBCdWRkeUVudHJ5ID0gKHByb3BzKSA9PiB7XG4vL3ZhciB0ZXN0PXByb3BzLkZyaWVuZDtcbiAgcmV0dXJuIChcbiAgPGRpdiBjbGFzc05hbWU9J2NvbGxlY3Rpb24taXRlbSByb3cnPlxuICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sIHMzXCI+XG4gICAgXHQ8aW1nIGNsYXNzTmFtZT0ncHJvZmlsZXRodW1uYWlsJyBzcmM9eydodHRwczovL3Vuc3BsYXNoLml0LzE3MC8xNzAvP3JhbmRvbSd9Lz5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGlkPVwiRnJpZW5kXCIgY2xhc3NOYW1lPVwiYnVkZHkgY29sIHM5XCI+XG4gICBcdFx0PGgzIGNsYXNzTmFtZT1cImJ1ZGR5TmFtZVwiPntwcm9wcy5CdWRkeX08L2gzPlxuICAgXHRcdDxkaXYgY2xhc3NOYW1lPVwiYnVkZHlDb21wYXRpYmlsaXR5XCI+eyhwcm9wcy5CdWRkeVNjb3JlID09PSAnTm90aGluZyB0byBjb21wYXJlJykgPyAnQ29tcGF0YWJpbGl0eTogJyArIHByb3BzLkJ1ZGR5ICsgJyBoYXMgbm90IHJhdGVkIGFueSBtb3ZpZXMnIDogJ0NvbXBhdGFiaWxpdHk6ICcgKyBwcm9wcy5CdWRkeVNjb3JlIH08L2Rpdj5cbiAgIFx0XHQ8YSBjbGFzc05hbWU9XCJ3YXZlcy1lZmZlY3Qgd2F2ZXMtbGlnaHQgYnRuXCIgb25DbGljaz17ZnVuY3Rpb24oKXtwcm9wcy5idWRkeWZ1bmMocHJvcHMuQnVkZHkpfX0+c2VuZCBmcmllbmQgcmVxdWVzdDwvYT4gXG4gIFx0PC9kaXY+XG4gIDwvZGl2PlxuKVxufTtcblxud2luZG93LkJ1ZGR5RW50cnkgPSBCdWRkeUVudHJ5OyJdfQ==
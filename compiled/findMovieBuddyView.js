'use strict';

var FindMovieBuddy = function FindMovieBuddy(props) {

  return React.createElement(
    'div',
    null,
    React.createElement(
      'h2',
      null,
      'Your Potential Movie Buddies'
    ),
    '  ',
    React.createElement('br', null),
    React.createElement(
      'div',
      { style: { display: 'none' }, id: 'AlreadyReq2' },
      'Youve already sent a request to this user!'
    ),
    React.createElement('br', null),
    props.buddies.map(function (buddy) {
      if (buddy[1] === null) {
        buddy[1] = 'Nothing to compare';
      }return React.createElement(BuddyEntry, { buddyfunc: props.buddyfunc, Buddy: buddy[0], BuddyScore: buddy[1] });
    })
  );
};

window.FindMovieBuddy = FindMovieBuddy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2ZpbmRNb3ZpZUJ1ZGR5Vmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksaUJBQWlCLFNBQWpCLGNBQWlCLENBQUMsS0FBRCxFQUFXOztBQUU5QixTQUVDO0FBQUE7QUFBQTtBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FGQTtBQUFBO0FBRXVDLG1DQUZ2QztBQUdBO0FBQUE7QUFBQSxRQUFLLE9BQU8sRUFBQyxTQUFRLE1BQVQsRUFBWixFQUE4QixJQUFHLGFBQWpDO0FBQUE7QUFBQSxLQUhBO0FBRytGLG1DQUgvRjtBQUtDLFVBQU0sT0FBTixDQUFjLEdBQWQsQ0FBa0IsVUFBUyxLQUFULEVBQWU7QUFBRSxVQUFJLE1BQU0sQ0FBTixNQUFXLElBQWYsRUFBb0I7QUFBQyxjQUFNLENBQU4sSUFBUyxvQkFBVDtBQUE4QixPQUFDLE9BQVEsb0JBQUMsVUFBRCxJQUFZLFdBQVcsTUFBTSxTQUE3QixFQUF3QyxPQUFPLE1BQU0sQ0FBTixDQUEvQyxFQUF5RCxZQUFZLE1BQU0sQ0FBTixDQUFyRSxHQUFSO0FBQTRGLEtBQW5MO0FBTEQsR0FGRDtBQVlBLENBZEY7O0FBZ0JBLE9BQU8sY0FBUCxHQUF3QixjQUF4QiIsImZpbGUiOiJmaW5kTW92aWVCdWRkeVZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgRmluZE1vdmllQnVkZHkgPSAocHJvcHMpID0+IHtcblxuICByZXR1cm4gKFxuXG4gICA8ZGl2PlxuXG4gICA8aDI+WW91ciBQb3RlbnRpYWwgTW92aWUgQnVkZGllczwvaDI+ICA8YnIvPlxuICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6J25vbmUnfX0gaWQ9J0FscmVhZHlSZXEyJz5Zb3V2ZSBhbHJlYWR5IHNlbnQgYSByZXF1ZXN0IHRvIHRoaXMgdXNlciE8L2Rpdj48YnIvPlxuXG4gICB7cHJvcHMuYnVkZGllcy5tYXAoZnVuY3Rpb24oYnVkZHkpeyBpZiAoYnVkZHlbMV09PT1udWxsKXtidWRkeVsxXT0nTm90aGluZyB0byBjb21wYXJlJ30gcmV0dXJuICg8QnVkZHlFbnRyeSBidWRkeWZ1bmM9e3Byb3BzLmJ1ZGR5ZnVuY30gQnVkZHk9e2J1ZGR5WzBdfSBCdWRkeVNjb3JlPXtidWRkeVsxXX0gLz4gKX0pfVxuXG4gICAgIDwvZGl2PlxuICAgXG5cbil9O1xuXG53aW5kb3cuRmluZE1vdmllQnVkZHkgPSBGaW5kTW92aWVCdWRkeTsiXX0=
'use strict';

var FriendEntry = function FriendEntry(props) {
  var score = props.Comp === 'No comparison to be made' ? 'No comparison to be made' : props.Comp + '%';
  return React.createElement(
    'div',
    { className: 'FriendEntry collection-item row' },
    React.createElement(
      'div',
      { className: 'col s3' },
      React.createElement('img', { className: 'profilethumnail', src: 'https://unsplash.it/170/170/?random' })
    ),
    React.createElement(
      'div',
      { id: 'Friend', className: 'friendEntry col s9' },
      React.createElement(
        'a',
        { className: 'friendEntryIndividual' },
        React.createElement(
          'h3',
          { className: 'friendName', onClick: function onClick() {
              props.fof(props.Friend);
            } },
          props.Friend
        )
      ),
      React.createElement(
        'div',
        { className: 'friendEntryCompatability' },
        'Compatability: ',
        score
      )
    )
  );
};

window.FriendEntry = FriendEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0ZyaWVuZEVudHJ5Vmlldy5qcyJdLCJuYW1lcyI6WyJGcmllbmRFbnRyeSIsInByb3BzIiwic2NvcmUiLCJDb21wIiwiZm9mIiwiRnJpZW5kIiwid2luZG93Il0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLGNBQWMsU0FBZEEsV0FBYyxDQUFDQyxLQUFELEVBQVc7QUFDM0IsTUFBSUMsUUFBUUQsTUFBTUUsSUFBTixLQUFlLDBCQUFmLEdBQTRDLDBCQUE1QyxHQUF5RUYsTUFBTUUsSUFBTixHQUFhLEdBQWxHO0FBQ0EsU0FDQTtBQUFBO0FBQUEsTUFBSyxXQUFVLGlDQUFmO0FBQ0M7QUFBQTtBQUFBLFFBQUssV0FBVSxRQUFmO0FBQ0MsbUNBQUssV0FBVSxpQkFBZixFQUFpQyxLQUFLLHFDQUF0QztBQURELEtBREQ7QUFJRTtBQUFBO0FBQUEsUUFBSyxJQUFHLFFBQVIsRUFBaUIsV0FBVSxvQkFBM0I7QUFDQztBQUFBO0FBQUEsVUFBRyxXQUFVLHVCQUFiO0FBQXFDO0FBQUE7QUFBQSxZQUFJLFdBQVUsWUFBZCxFQUEyQixTQUFTLG1CQUFVO0FBQUNGLG9CQUFNRyxHQUFOLENBQVVILE1BQU1JLE1BQWhCO0FBQXdCLGFBQXZFO0FBQTBFSixnQkFBTUk7QUFBaEY7QUFBckMsT0FERDtBQUVDO0FBQUE7QUFBQSxVQUFLLFdBQVUsMEJBQWY7QUFBQTtBQUEyREg7QUFBM0Q7QUFGRDtBQUpGLEdBREE7QUFVQSxDQVpGOztBQWNBSSxPQUFPTixXQUFQLEdBQXFCQSxXQUFyQiIsImZpbGUiOiJGcmllbmRFbnRyeVZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgRnJpZW5kRW50cnkgPSAocHJvcHMpID0+IHtcclxuICBsZXQgc2NvcmUgPSBwcm9wcy5Db21wID09PSAnTm8gY29tcGFyaXNvbiB0byBiZSBtYWRlJyA/ICdObyBjb21wYXJpc29uIHRvIGJlIG1hZGUnIDogcHJvcHMuQ29tcCArICclJztcclxuICByZXR1cm4gKFxyXG4gIDxkaXYgY2xhc3NOYW1lPVwiRnJpZW5kRW50cnkgY29sbGVjdGlvbi1pdGVtIHJvd1wiID5cclxuICBcdDxkaXYgY2xhc3NOYW1lPVwiY29sIHMzXCI+XHJcbiAgXHRcdDxpbWcgY2xhc3NOYW1lPSdwcm9maWxldGh1bW5haWwnIHNyYz17J2h0dHBzOi8vdW5zcGxhc2guaXQvMTcwLzE3MC8/cmFuZG9tJ30vPlxyXG4gIFx0PC9kaXY+XHJcbiAgICA8ZGl2IGlkPVwiRnJpZW5kXCIgY2xhc3NOYW1lPVwiZnJpZW5kRW50cnkgY29sIHM5XCI+XHJcbiAgICBcdDxhIGNsYXNzTmFtZT0nZnJpZW5kRW50cnlJbmRpdmlkdWFsJz48aDMgY2xhc3NOYW1lPVwiZnJpZW5kTmFtZVwiIG9uQ2xpY2s9e2Z1bmN0aW9uKCl7cHJvcHMuZm9mKHByb3BzLkZyaWVuZCl9fT57cHJvcHMuRnJpZW5kfTwvaDM+PC9hPiAgXHJcbiAgICBcdDxkaXYgY2xhc3NOYW1lPVwiZnJpZW5kRW50cnlDb21wYXRhYmlsaXR5XCIgPkNvbXBhdGFiaWxpdHk6IHtzY29yZX08L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gIDwvZGl2PlxyXG4pfTtcclxuXHJcbndpbmRvdy5GcmllbmRFbnRyeSA9IEZyaWVuZEVudHJ5OyJdfQ==
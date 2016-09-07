'use strict';

var BuddyEntry = function BuddyEntry(_ref) {
  var Buddy = _ref.Buddy;
  var BuddyScore = _ref.BuddyScore;
  var buddyfunc = _ref.buddyfunc;
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
        'Send friend request'
      ),
      React.createElement('div', { id: 'friendReqConf' })
    )
  );
};

window.BuddyEntry = BuddyEntry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0J1ZGR5RW50cnkuanMiXSwibmFtZXMiOlsiQnVkZHlFbnRyeSIsIkJ1ZGR5IiwiQnVkZHlTY29yZSIsImJ1ZGR5ZnVuYyIsIndpbmRvdyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxhQUFhLFNBQWJBLFVBQWE7QUFBQSxNQUFFQyxLQUFGLFFBQUVBLEtBQUY7QUFBQSxNQUFTQyxVQUFULFFBQVNBLFVBQVQ7QUFBQSxNQUFvQkMsU0FBcEIsUUFBb0JBLFNBQXBCO0FBQUEsU0FDakI7QUFBQTtBQUFBLE1BQUssV0FBVSxxQkFBZjtBQUNFO0FBQUE7QUFBQSxRQUFLLFdBQVUsUUFBZjtBQUNDLG1DQUFLLFdBQVUsaUJBQWYsRUFBaUMsS0FBSyxxQ0FBdEM7QUFERCxLQURGO0FBSUU7QUFBQTtBQUFBLFFBQUssSUFBRyxRQUFSLEVBQWlCLFdBQVUsY0FBM0I7QUFDQztBQUFBO0FBQUEsVUFBSSxXQUFVLFdBQWQ7QUFBMkJGO0FBQTNCLE9BREQ7QUFFRTtBQUFBO0FBQUEsVUFBSyxXQUFVLG9CQUFmO0FBQXNDQyx1QkFBZSxvQkFBaEIsdUJBQTBERCxLQUExRCxtREFBNkdDO0FBQWxKLE9BRkY7QUFHQztBQUFBO0FBQUEsVUFBRyxXQUFVLDhCQUFiLEVBQTRDLFNBQVMsbUJBQUk7QUFBQ0Msc0JBQVVGLEtBQVY7QUFBaUIsV0FBM0U7QUFBQTtBQUFBLE9BSEQ7QUFJRSxtQ0FBSyxJQUFHLGVBQVI7QUFKRjtBQUpGLEdBRGlCO0FBQUEsQ0FBbkI7O0FBZUFHLE9BQU9KLFVBQVAsR0FBb0JBLFVBQXBCIiwiZmlsZSI6IkJ1ZGR5RW50cnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBCdWRkeUVudHJ5ID0gKHtCdWRkeSwgQnVkZHlTY29yZSxidWRkeWZ1bmN9KSA9PiAoXHJcbiAgPGRpdiBjbGFzc05hbWU9J2NvbGxlY3Rpb24taXRlbSByb3cnPlxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJjb2wgczNcIj5cclxuICAgIFx0PGltZyBjbGFzc05hbWU9J3Byb2ZpbGV0aHVtbmFpbCcgc3JjPXsnaHR0cHM6Ly91bnNwbGFzaC5pdC8xNzAvMTcwLz9yYW5kb20nfS8+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgaWQ9XCJGcmllbmRcIiBjbGFzc05hbWU9XCJidWRkeSBjb2wgczlcIj5cclxuICAgXHRcdDxoMyBjbGFzc05hbWU9XCJidWRkeU5hbWVcIj57QnVkZHl9PC9oMz5cclxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJidWRkeUNvbXBhdGliaWxpdHlcIj57KEJ1ZGR5U2NvcmUgPT09ICdOb3RoaW5nIHRvIGNvbXBhcmUnKSA/IGBDb21wYXRhYmlsaXR5OiAke0J1ZGR5fSBoYXMgbm90IHJhdGVkIGFueSBtb3ZpZXNgIDogYENvbXBhdGFiaWxpdHkke0J1ZGR5U2NvcmV9YH08L2Rpdj5cclxuICAgXHRcdDxhIGNsYXNzTmFtZT1cIndhdmVzLWVmZmVjdCB3YXZlcy1saWdodCBidG5cIiBvbkNsaWNrPXsoKT0+e2J1ZGR5ZnVuYyhCdWRkeSl9fT5TZW5kIGZyaWVuZCByZXF1ZXN0PC9hPiBcclxuICAgICAgPGRpdiBpZD1cImZyaWVuZFJlcUNvbmZcIj48L2Rpdj5cclxuICBcdDwvZGl2PlxyXG4gIDwvZGl2PlxyXG4pXHJcblxyXG5cclxud2luZG93LkJ1ZGR5RW50cnkgPSBCdWRkeUVudHJ5O1xyXG5cclxuIl19
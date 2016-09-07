'use strict';

var FriendRatingList = function FriendRatingList(_ref) {
  var friendRatings = _ref.friendRatings;
  var getFriendMovieRatings = _ref.getFriendMovieRatings;
  return React.createElement(
    'div',
    { className: 'friendRating-list' },
    React.createElement(
      'div',
      { id: 'inputAndButton' },
      React.createElement('input', { type: 'text', name: 'movie', id: 'movieToView' }),
      React.createElement(
        'button',
        { type: 'submit', onClick: getFriendMovieRatings },
        'Click Me'
      )
    ),
    friendRatings.map(function (friendRating) {
      return React.createElement(FriendRatingListEntry, { rating: friendRating.rating, name: friendRating.name });
    })
  );
};

window.FriendRatingList = FriendRatingList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0ZyaWVuZFJhdGluZ0xpc3QuanMiXSwibmFtZXMiOlsiRnJpZW5kUmF0aW5nTGlzdCIsImZyaWVuZFJhdGluZ3MiLCJnZXRGcmllbmRNb3ZpZVJhdGluZ3MiLCJtYXAiLCJmcmllbmRSYXRpbmciLCJyYXRpbmciLCJuYW1lIiwid2luZG93Il0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLG1CQUFtQixTQUFuQkEsZ0JBQW1CO0FBQUEsTUFBRUMsYUFBRixRQUFFQSxhQUFGO0FBQUEsTUFBaUJDLHFCQUFqQixRQUFpQkEscUJBQWpCO0FBQUEsU0FDckI7QUFBQTtBQUFBLE1BQUssV0FBVSxtQkFBZjtBQUNFO0FBQUE7QUFBQSxRQUFLLElBQUcsZ0JBQVI7QUFBeUIscUNBQU8sTUFBSyxNQUFaLEVBQW1CLE1BQUssT0FBeEIsRUFBZ0MsSUFBRyxhQUFuQyxHQUF6QjtBQUNBO0FBQUE7QUFBQSxVQUFRLE1BQUssUUFBYixFQUFzQixTQUFTQSxxQkFBL0I7QUFBQTtBQUFBO0FBREEsS0FERjtBQUdHRCxrQkFBY0UsR0FBZCxDQUFrQjtBQUFBLGFBQWdCLG9CQUFDLHFCQUFELElBQXVCLFFBQVFDLGFBQWFDLE1BQTVDLEVBQW9ELE1BQU1ELGFBQWFFLElBQXZFLEdBQWhCO0FBQUEsS0FBbEI7QUFISCxHQURxQjtBQUFBLENBQXZCOztBQVFBQyxPQUFPUCxnQkFBUCxHQUEwQkEsZ0JBQTFCIiwiZmlsZSI6IkZyaWVuZFJhdGluZ0xpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgRnJpZW5kUmF0aW5nTGlzdCA9ICh7ZnJpZW5kUmF0aW5ncywgZ2V0RnJpZW5kTW92aWVSYXRpbmdzfSkgPT4gKFxyXG4gIDxkaXYgY2xhc3NOYW1lPVwiZnJpZW5kUmF0aW5nLWxpc3RcIj5cclxuICAgIDxkaXYgaWQ9J2lucHV0QW5kQnV0dG9uJz48aW5wdXQgdHlwZT0ndGV4dCcgbmFtZT0nbW92aWUnIGlkPVwibW92aWVUb1ZpZXdcIi8+XHJcbiAgICA8YnV0dG9uIHR5cGU9J3N1Ym1pdCcgb25DbGljaz17Z2V0RnJpZW5kTW92aWVSYXRpbmdzfT5DbGljayBNZTwvYnV0dG9uPjwvZGl2PlxyXG4gICAge2ZyaWVuZFJhdGluZ3MubWFwKGZyaWVuZFJhdGluZyA9PiA8RnJpZW5kUmF0aW5nTGlzdEVudHJ5IHJhdGluZz17ZnJpZW5kUmF0aW5nLnJhdGluZ30gbmFtZT17ZnJpZW5kUmF0aW5nLm5hbWV9Lz4pfVxyXG4gIDwvZGl2PlxyXG4pO1xyXG5cclxud2luZG93LkZyaWVuZFJhdGluZ0xpc3QgPSBGcmllbmRSYXRpbmdMaXN0OyJdfQ==
'use strict';

var FriendRatingList = function FriendRatingList(props) {
  return React.createElement(
    'div',
    { className: 'friendRating-list' },
    React.createElement(
      'div',
      { id: 'inputAndButton' },
      React.createElement('input', { type: 'text', name: 'movie', id: 'movieToView' }),
      React.createElement(
        'button',
        { type: 'submit', onClick: props.getFriendMovieRatings },
        'Click Me'
      )
    ),
    props.friendRatings.map(function (friendRating) {
      return React.createElement(FriendRatingListEntry, { rating: friendRating.rating, name: friendRating.name });
    })
  );
};

window.FriendRatingList = FriendRatingList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0ZyaWVuZFJhdGluZ0xpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLG1CQUFtQixTQUFuQixnQkFBbUIsQ0FBQyxLQUFEO0FBQUEsU0FDckI7QUFBQTtBQUFBLE1BQUssV0FBVSxtQkFBZjtBQUVFO0FBQUE7QUFBQSxRQUFLLElBQUcsZ0JBQVI7QUFBeUIscUNBQU8sTUFBSyxNQUFaLEVBQW1CLE1BQUssT0FBeEIsRUFBZ0MsSUFBRyxhQUFuQyxHQUF6QjtBQUNBO0FBQUE7QUFBQSxVQUFRLE1BQUssUUFBYixFQUFzQixTQUFTLE1BQU0scUJBQXJDO0FBQUE7QUFBQTtBQURBLEtBRkY7QUFLRyxVQUFNLGFBQU4sQ0FBb0IsR0FBcEIsQ0FBd0I7QUFBQSxhQUFnQixvQkFBQyxxQkFBRCxJQUF1QixRQUFRLGFBQWEsTUFBNUMsRUFBb0QsTUFBTSxhQUFhLElBQXZFLEdBQWhCO0FBQUEsS0FBeEI7QUFMSCxHQURxQjtBQUFBLENBQXZCOztBQVdBLE9BQU8sZ0JBQVAsR0FBMEIsZ0JBQTFCIiwiZmlsZSI6IkZyaWVuZFJhdGluZ0xpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgRnJpZW5kUmF0aW5nTGlzdCA9IChwcm9wcykgPT4gKFxuICA8ZGl2IGNsYXNzTmFtZT1cImZyaWVuZFJhdGluZy1saXN0XCI+XG4gICAgXG4gICAgPGRpdiBpZD0naW5wdXRBbmRCdXR0b24nPjxpbnB1dCB0eXBlPSd0ZXh0JyBuYW1lPSdtb3ZpZScgaWQ9XCJtb3ZpZVRvVmlld1wiLz5cbiAgICA8YnV0dG9uIHR5cGU9J3N1Ym1pdCcgb25DbGljaz17cHJvcHMuZ2V0RnJpZW5kTW92aWVSYXRpbmdzfT5DbGljayBNZTwvYnV0dG9uPjwvZGl2PlxuXG4gICAge3Byb3BzLmZyaWVuZFJhdGluZ3MubWFwKGZyaWVuZFJhdGluZyA9PiA8RnJpZW5kUmF0aW5nTGlzdEVudHJ5IHJhdGluZz17ZnJpZW5kUmF0aW5nLnJhdGluZ30gbmFtZT17ZnJpZW5kUmF0aW5nLm5hbWV9Lz4pfVxuICBcbiAgPC9kaXY+XG4pO1xuXG53aW5kb3cuRnJpZW5kUmF0aW5nTGlzdCA9IEZyaWVuZFJhdGluZ0xpc3Q7Il19
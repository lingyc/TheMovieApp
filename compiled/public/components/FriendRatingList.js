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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL0ZyaWVuZFJhdGluZ0xpc3QuanMiXSwibmFtZXMiOlsiRnJpZW5kUmF0aW5nTGlzdCIsInByb3BzIiwiZ2V0RnJpZW5kTW92aWVSYXRpbmdzIiwiZnJpZW5kUmF0aW5ncyIsIm1hcCIsImZyaWVuZFJhdGluZyIsInJhdGluZyIsIm5hbWUiLCJ3aW5kb3ciXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsbUJBQW1CLFNBQW5CQSxnQkFBbUIsQ0FBQ0MsS0FBRDtBQUFBLFNBQ3JCO0FBQUE7QUFBQSxNQUFLLFdBQVUsbUJBQWY7QUFFRTtBQUFBO0FBQUEsUUFBSyxJQUFHLGdCQUFSO0FBQXlCLHFDQUFPLE1BQUssTUFBWixFQUFtQixNQUFLLE9BQXhCLEVBQWdDLElBQUcsYUFBbkMsR0FBekI7QUFDQTtBQUFBO0FBQUEsVUFBUSxNQUFLLFFBQWIsRUFBc0IsU0FBU0EsTUFBTUMscUJBQXJDO0FBQUE7QUFBQTtBQURBLEtBRkY7QUFLR0QsVUFBTUUsYUFBTixDQUFvQkMsR0FBcEIsQ0FBd0I7QUFBQSxhQUFnQixvQkFBQyxxQkFBRCxJQUF1QixRQUFRQyxhQUFhQyxNQUE1QyxFQUFvRCxNQUFNRCxhQUFhRSxJQUF2RSxHQUFoQjtBQUFBLEtBQXhCO0FBTEgsR0FEcUI7QUFBQSxDQUF2Qjs7QUFXQUMsT0FBT1IsZ0JBQVAsR0FBMEJBLGdCQUExQiIsImZpbGUiOiJGcmllbmRSYXRpbmdMaXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEZyaWVuZFJhdGluZ0xpc3QgPSAocHJvcHMpID0+IChcclxuICA8ZGl2IGNsYXNzTmFtZT1cImZyaWVuZFJhdGluZy1saXN0XCI+XHJcbiAgICBcclxuICAgIDxkaXYgaWQ9J2lucHV0QW5kQnV0dG9uJz48aW5wdXQgdHlwZT0ndGV4dCcgbmFtZT0nbW92aWUnIGlkPVwibW92aWVUb1ZpZXdcIi8+XHJcbiAgICA8YnV0dG9uIHR5cGU9J3N1Ym1pdCcgb25DbGljaz17cHJvcHMuZ2V0RnJpZW5kTW92aWVSYXRpbmdzfT5DbGljayBNZTwvYnV0dG9uPjwvZGl2PlxyXG5cclxuICAgIHtwcm9wcy5mcmllbmRSYXRpbmdzLm1hcChmcmllbmRSYXRpbmcgPT4gPEZyaWVuZFJhdGluZ0xpc3RFbnRyeSByYXRpbmc9e2ZyaWVuZFJhdGluZy5yYXRpbmd9IG5hbWU9e2ZyaWVuZFJhdGluZy5uYW1lfS8+KX1cclxuICBcclxuICA8L2Rpdj5cclxuKTtcclxuXHJcbndpbmRvdy5GcmllbmRSYXRpbmdMaXN0ID0gRnJpZW5kUmF0aW5nTGlzdDsiXX0=
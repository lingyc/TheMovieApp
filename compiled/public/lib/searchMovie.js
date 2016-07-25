'use strict';

var searchMovie = function searchMovie(options, callback) {

  $.get('http://www.omdbapi.com', {
    t: options.query,
    tomatoes: true
  }).done(function (movie) {
    if (callback) {
      callback(movie);
    }
  }).fail(function (_ref) {
    var response = _ref.response;

    response.error.errors.forEach(function (err) {
      return console.error(err);
    });
  });
};

window.searchMovie = searchMovie;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3B1YmxpYy9saWIvc2VhcmNoTW92aWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLGNBQWMsU0FBZCxXQUFjLENBQUMsT0FBRCxFQUFVLFFBQVYsRUFBdUI7O0FBRXZDLElBQUUsR0FBRixDQUFNLHdCQUFOLEVBQWdDO0FBQzlCLE9BQUcsUUFBUSxLQURtQjtBQUU5QixjQUFVO0FBRm9CLEdBQWhDLEVBSUMsSUFKRCxDQUlNLFVBQUMsS0FBRCxFQUFXO0FBQ2YsUUFBSSxRQUFKLEVBQWM7QUFDWixlQUFTLEtBQVQ7QUFDRDtBQUNGLEdBUkQsRUFTQyxJQVRELENBU00sZ0JBQWdCO0FBQUEsUUFBZCxRQUFjLFFBQWQsUUFBYzs7QUFDcEIsYUFBUyxLQUFULENBQWUsTUFBZixDQUFzQixPQUF0QixDQUE4QixVQUFDLEdBQUQ7QUFBQSxhQUM1QixRQUFRLEtBQVIsQ0FBYyxHQUFkLENBRDRCO0FBQUEsS0FBOUI7QUFHRCxHQWJEO0FBY0QsQ0FoQkQ7O0FBa0JBLE9BQU8sV0FBUCxHQUFxQixXQUFyQiIsImZpbGUiOiJzZWFyY2hNb3ZpZS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBzZWFyY2hNb3ZpZSA9IChvcHRpb25zLCBjYWxsYmFjaykgPT4ge1xuICBcbiAgJC5nZXQoJ2h0dHA6Ly93d3cub21kYmFwaS5jb20nLCB7XG4gICAgdDogb3B0aW9ucy5xdWVyeSxcbiAgICB0b21hdG9lczogdHJ1ZVxuICB9KVxuICAuZG9uZSgobW92aWUpID0+IHtcbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKG1vdmllKTtcbiAgICB9XG4gIH0pXG4gIC5mYWlsKCh7cmVzcG9uc2V9KSA9PiB7XG4gICAgcmVzcG9uc2UuZXJyb3IuZXJyb3JzLmZvckVhY2goKGVycikgPT5cbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxuICAgICk7XG4gIH0pO1xufTtcblxud2luZG93LnNlYXJjaE1vdmllID0gc2VhcmNoTW92aWU7Il19
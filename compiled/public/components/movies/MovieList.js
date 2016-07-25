'use strict';

var MovieList = function MovieList(_ref) {
	var movies = _ref.movies;
	var change = _ref.change;

	return React.createElement(
		'div',
		{ className: 'movieList' },
		movies.map(function (movie) {
			return React.createElement(MovieListEntry, {
				movie: movie,
				change: change });
		})
	);
};

window.MovieList = MovieList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3B1YmxpYy9jb21wb25lbnRzL21vdmllcy9Nb3ZpZUxpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLFlBQVksU0FBWixTQUFZLE9BQXNCO0FBQUEsS0FBcEIsTUFBb0IsUUFBcEIsTUFBb0I7QUFBQSxLQUFaLE1BQVksUUFBWixNQUFZOztBQUNyQyxRQUFRO0FBQUE7QUFBQSxJQUFLLFdBQVUsV0FBZjtBQUNMLFNBQU8sR0FBUCxDQUFXO0FBQUEsVUFBUyxvQkFBQyxjQUFEO0FBQ2xCLFdBQU8sS0FEVztBQUVsQixZQUFRLE1BRlUsR0FBVDtBQUFBLEdBQVg7QUFESyxFQUFSO0FBTUEsQ0FQRDs7QUFTQSxPQUFPLFNBQVAsR0FBbUIsU0FBbkIiLCJmaWxlIjoiTW92aWVMaXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIE1vdmllTGlzdCA9ICh7bW92aWVzLCBjaGFuZ2V9KSA9PiB7XG5cdHJldHVybiAoPGRpdiBjbGFzc05hbWU9J21vdmllTGlzdCc+XG5cdFx0eyBtb3ZpZXMubWFwKG1vdmllID0+IDxNb3ZpZUxpc3RFbnRyeSBcbiAgICAgIG1vdmllPXttb3ZpZX0gXG4gICAgICBjaGFuZ2U9e2NoYW5nZX0gLz4gKX1cblx0XHRcblx0PC9kaXY+KVxufVxuXG53aW5kb3cuTW92aWVMaXN0ID0gTW92aWVMaXN0OyJdfQ==
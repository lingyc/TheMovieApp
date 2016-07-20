var MovieList = ({movies}) => (
	<div className='movieList'>
		{ movies.map(movie => <MovieListEntry movie={movie})/> }
	</div>
)

window.MovieList = MovieList;
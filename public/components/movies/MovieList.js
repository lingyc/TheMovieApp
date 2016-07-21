var MovieList = ({movies, change}) => (
	<div className='movieList'>
		{ movies.map(movie => <MovieListEntry 
      movie={movie} 
      change={change} /> )}
		
	</div>
)

window.MovieList = MovieList;
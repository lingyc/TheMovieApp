var MovieList = ({movies, change}) => {
	return (<div className='movieList'>
		{ movies.map((movie, i) => <MovieListEntry 
      movie = {movie} 
      change = {change}
      key = {movie.title} /> )}
		
	</div>)
}

window.MovieList = MovieList;
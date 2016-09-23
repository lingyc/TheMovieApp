var MovieList = ({movies, change}) => {
	return (<div className='movieList'>
		{ movies.map((movie, i) => <MovieListEntry 
      movie = {movie} 
      change = {change}
      key = {i} /> )}
		
	</div>)
}

window.MovieList = MovieList;
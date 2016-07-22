var MovieList = ({movies, change}) => {
	return (<div className='movieList'>
		{ movies.map(movie => <MovieListEntry 
      movie={movie} 
      change={change} /> )}
		
	</div>)
}

window.MovieList = MovieList;
var MovieList = ({movies, change}) => {
	console.log('passing down movies:', movies);
	return (<div className='movieList'>
		{ movies.map(movie => <MovieListEntry 
      movie={movie} 
      change={change} /> )}
		
	</div>)
}

window.MovieList = MovieList;
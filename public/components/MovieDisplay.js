let MovieDisplay = ({movie}) => (
  !movie ? <div className="movie-display">Please Enter Movie</div> :
  <div className="movie-display">
    <h3>{movie.Title}</h3>
    <p>{movie.Plot}</p>
    <img src={movie.Poster}>
    <p>{movie.imdbRating}</p>
  </div>
);

window.MovieDisplay = MovieDisplay;
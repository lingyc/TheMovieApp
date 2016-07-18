let MovieDisplay = ({movie}) => (
  //removed the below poster query because
  //no access to media-imdb
  //one way to have the thumbnails is to download the 
  //image into our database with the url, then serve it up
  // <img src={movie.Poster} alt=""></img>
  !movie ? <div className="movie-display">Please search a movie</div> :
  <div className="movie-display">
    <h3>{movie.Title}</h3>
    <p>{movie.Plot}</p>
    <p>IMDB Rating: {movie.imdbRating}</p>
    <p>Rotten Tomato Rating: {movie.tomatoRating}</p>
  </div>
);

window.MovieDisplay = MovieDisplay;
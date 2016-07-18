var AddMovie = (props) => (
  //using rating as a text, as number will have
  //drag menu
  <div className='addMovie'>
    <div className='addMovieInput'>
      <input type='text' id='addMovieInputTitle' name='addMovieInput' placeholder='movie title'/>
      <input type='text' id='addMovieInputGenre' name='addMovieInput' placeholder='movie genre'/>
      <input type='text' id='addMovieInputPoster' name='addMovieInput' placeholder='movie posterURL'/>
      <input type='text' id='addMovieInputDate' name='addMovieInput' placeholder='movie release date'/>
      <input type='text' id='ratingScore' name='movieTitle' placeholder='your rating'/>
      <button onClick={props.addMovie}> add movie </button>
      <button onClick={props.rateMovie}> rate movie </button>
    </div>
  </div>
)

window.AddMovie = AddMovie;

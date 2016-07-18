var CreateMovie = (props) => (
  //using rating as a text, as number will have
  //drag menu

  <div className='createMovie'>
    <div className='createMovieInput'>
      Movie Title: <input type='text'
      id='createMovieInput'
      name='createMovieInput'
      placeHolder='Insert Move to Rate'
      />

      Rating: <input type='text'
      id='createMovieRating'
      name='createMovieRating'
      placeHolder='Insert Rating'
      />
    </div>

    <div className='showMovieRated'>
      <CreateMovieList />
    </div>
  </div>


)

window.CreateMovie = CreateMovie;

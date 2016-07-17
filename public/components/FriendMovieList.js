let FriendMovieList = (props) => (
  //have a nav bar and button
  //depending on query on click
  //map the recommended movies
  <div className='friendMovieList'>

    Movie Title: <input type ='text' 
    id='movieInput' 
    name='movieInput'
    placeholder='Insert Movie Title'
     />
    <button onClick={function()
      {props.getMovies(
        document.getElementById('movieInput')
        )}}>Get Movie</button>
    <div>
      <FriendMovieListEntry />
    </div>

  </div>
);

window.FriendMovieList = FriendMovieList;
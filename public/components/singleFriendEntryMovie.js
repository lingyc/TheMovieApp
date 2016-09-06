var FriendMovieEntry = ({name, rating, review}) => {


  return (
  <div className="FriendMovieEntry">
   <h2>Title:{name}</h2><br/>
   <h3>Rating:{rating}</h3><br/>
   <p><i>Comments:{review}</i></p><br/>
  </div>
)};

window.FriendMovieEntry = FriendMovieEntry;
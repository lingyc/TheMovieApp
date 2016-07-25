var FriendMovieEntry = (props) => {


  return (
  <div className="FriendMovieEntry">
   <h2>Title:{props.name}</h2><br/>
   <h3>Rating:{props.rating}</h3><br/>
   <p><i>Comments:{props.review}</i></p><br/>
  </div>
)};

window.FriendMovieEntry = FriendMovieEntry;
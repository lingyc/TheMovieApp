var FriendRatingList = (props) => (
  <div className="friendRating-list">
    
    <input type='text' name='movie' id="movieToView"/>
    <button type='submit' onClick={props.getFriendMovieRatings}>Click Me</button>

    {props.friendRatings.map(friendRating => <FriendRatingListEntry rating={friendRating.rating} name={friendRating.name}/>)}
  
  </div>
);

window.FriendRatingList = FriendRatingList;
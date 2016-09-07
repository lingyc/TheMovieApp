var FriendRatingList = ({friendRatings, getFriendMovieRatings}) => (
  <div className="friendRating-list">
    <div id='inputAndButton'><input type='text' name='movie' id="movieToView"/>
    <button type='submit' onClick={getFriendMovieRatings}>Click Me</button></div>
    {friendRatings.map(friendRating => <FriendRatingListEntry rating={friendRating.rating} name={friendRating.name}/>)}
  </div>
);

window.FriendRatingList = FriendRatingList;
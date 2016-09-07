var FriendRatingListEntry = ({name, rating}) => (
  <div className="FriendRatingListEntry">
    <span id="friend">Name:{name}</span>
    <span id="rating">Rating:{rating}</span>
    <br/>
  </div>
);

window.FriendRatingListEntry = FriendRatingListEntry;
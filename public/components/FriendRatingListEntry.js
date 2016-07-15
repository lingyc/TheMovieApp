var FriendRatingListEntry = (props) => (
  <div className="FriendRatingListEntry">
    <span id="friend">Name:{props.name}    </span>
    <span id="rating">Rating:{props.rating}</span>
    <br/>
  </div>
);

window.FriendRatingListEntry = FriendRatingListEntry;
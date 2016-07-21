var SingleFriend = (props) => (
 
  <div>
<button onClick={() => (props.onClick("Friends"))}>Back to all friends</button>

<h2> List of {props.friendName}'s Movies</h2>
<div>

{props.moviesOfFriend.map(function(movie){ return (<FriendMovieEntry name={movie[0]} rating={movie[1]} review={movie[2]} /> )})}
</div>
</div>


);

window.SingleFriend = SingleFriend;

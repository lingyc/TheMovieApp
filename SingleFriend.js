var SingleFriend = (props) => (
 
  <div>
<button onClick={() => (props.onClick("Friends"))}>Back to all friends</button>

<h2> List of {props.friendName}'s Movies</h2>
</div>


);

window.SingleFriend = SingleFriend;

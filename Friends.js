var Friends = (props) => (
 
  <div>
 Friends
 Enter friend here:<input id='findFriendByName'></input> <button onClick={props.sendRequest}>Click to send request</button>
 <button onClick={props.listPotentials}>Click to List like minded people</button>
 <button onClick={props.logout}>LogOut</button>
  </div>


);

window.Friends = Friends;

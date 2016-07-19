var Friends = (props) => (
 
  <div>
 <h1>Friends</h1>
 Enter friend here:<input id='findFriendByName'></input><br/> <button onClick={props.sendRequest}>Click to send request</button>
 <div style={{display:'none'}} id='enterRealFriend'>Please enter something!</div><br/>
 <button onClick={props.listPotentials}>Click to List like minded people</button><br/>
 <button onClick={props.logout}>LogOut</button><br/>
  </div>


);

window.Friends = Friends;

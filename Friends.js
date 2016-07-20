var Friends = (props) => (
 
  <div>
 <h1>Friends</h1>
 Enter friend you'd like to add here here:<input id='findFriendByName'></input> <button onClick={props.sendRequest}>Click to send request</button>
 <div style={{display:'none'}} id='enterRealFriend'>Please enter something!</div><br/>
 
 <button onClick={props.getFriends}> Click to see your CurrentFriends</button>
 <button onClick={props.listPotentials}>Click to List like minded people</button>

<br/>
<h2>Here are your current friends</h2>



{props.myFriends.map(function(friend){ return (<FriendEntry Friend={friend} /> )})}





  </div>


);

window.Friends = Friends;

var Friends = (props) => (
 
  <div>
 <h1>Friends</h1>
 Enter friend you'd like to add here here:<input id='findFriendByName'></input> <button onClick={props.sendRequest}>Click to send request</button>
 <div style={{display:'none'}} id='enterRealFriend'>Please enter something!</div><br/>
 


<br/>
<h2 >Here are your current friends</h2>
<button onClick={props.getFriends}>Click to get your current friends</button>


{props.myFriends.map(function(friend){ return (<FriendEntry sendARequest={props.sendWatchRequest}  Friend={friend} fof={props.fof} /> )})}





  </div>


);

window.Friends = Friends;

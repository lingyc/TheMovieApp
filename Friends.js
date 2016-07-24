var Friends = (props) => (
 
  <div>
 <h1>Friends</h1>
 Enter friend you'd like to add here here:<input id='findFriendByName'></input> <button onClick={props.sendRequest}>Click to send request</button>
 <div style={{display:'none'}} id='enterRealFriend'>Please enter something!</div>
 <div style={{display:'none'}} id='reqSent'>Request sent!</div><br/>
 <div style={{display:'none'}} id='AlreadyReq'>Youve already sent a request to this user!</div><br/>


<br/>
<h2 >Here are your current friends</h2>


{props.myFriends.map(function(friend){ return (<FriendEntry sendARequest={props.sendWatchRequest}  Friend={friend[0]} Comp={friend[1]} fof={props.fof} /> )})}





  </div>


);

window.Friends = Friends;

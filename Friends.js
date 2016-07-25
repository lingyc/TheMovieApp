var Friends = (props) => (
 
  <div className="myFriends collection">
		 <div className='header'>Your Friends</div>
		 <div className='findFriend'>
		 	<input id='findFriendByName' placeholder="Enter friend you'd like to add here here"></input> 
		 	<a className="waves-effect waves-light btn" onClick={props.sendRequest}>Click to send request</a>
		 </div>
		 <div style={{display:'none'}} id='enterRealFriend'>Please enter something!</div>
		 <div style={{display:'none'}} id='reqSent'>Request sent!</div><br/>
		 <div style={{display:'none'}} id='AlreadyReq'>Youve already sent a request to this user!</div><br/>
		<br/>
		<h2 >Here are your current friends</h2>
		{props.myFriends.map(function(friend){ return (<FriendEntry sendARequest={props.sendWatchRequest}  Friend={friend[0]} Comp={friend[1]} fof={props.fof} /> )})}
  </div>


);

window.Friends = Friends;

var Friends = (props) => (
 
  <div>
 Friends
 Enter friend here:<input id='findFriendByName'></input><br/> <button onClick={props.sendRequest}>Click to send request</button><br/>
 <button onClick={props.listPotentials}>Click to List like minded people</button><br/>
 <button onClick={props.logout}>LogOut</button><br/>
  </div>


);

window.Friends = Friends;

var Inbox = (props) => (
 
  <div>
 <h2>Inbox</h2>

 list of people who've sent you friend requests:<br/>
 <button onClick={props.logout}>LogOut</button>
  </div>


);

window.Inbox = Inbox;

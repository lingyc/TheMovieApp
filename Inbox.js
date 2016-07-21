var Inbox = (props) => (
 
  <div>
 <h2>Inbox</h2>

 list of people who've sent you friend requests:<br/>
<button onClick={props.listRequests}>Click me to see said people </button>

{props.pplWhoWantToBeFriends.map(function(friend){ return (<InboxEntry accept={props.accept} decline={props.decline} 
  inboxName={friend} /> )})}


</div>


);

window.Inbox = Inbox;

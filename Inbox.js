var Inbox = (props) => (
 
  <div>
 <h2 className='nh'>Inbox</h2>

 List of people who've sent you requests:<br/>


{props.pplWhoWantToBeFriends.map(function(friend){ return (<InboxEntry accept={props.accept} decline={props.decline} 
  inboxName={friend[0]} requestType={friend[1]} /> )})}

Request Responses:


</div>


);

window.Inbox = Inbox;

var Inbox = (props) => (
 
  <div>
 <h2 className='nh'>Inbox</h2>

 List of people who've sent you requests:<br/>


{props.pplWhoWantToBeFriends.map(function(friend){ return (<InboxEntry accept={props.accept} decline={props.decline} 
  inboxName={friend[0]} requestType={friend[1]} requestMovie={friend[2]} /> )})}

Request Responses:
{props.responsesAnswered.map(function(unit){ return <Responses responsesInfo={unit.requestor} responseAnswer={unit.response} responseType={unit.requestTyp} />})}

</div>


);

window.Inbox = Inbox;

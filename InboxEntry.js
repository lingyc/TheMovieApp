var InboxEntry = (props) => {


  return (
  <div className="InboxEntry">
    <span className="inboxFriend">Name:{props.inboxName} <button className='accept' onClick={function(){props.accept(props.inboxName)}}> Accept {props.inboxName}'s {props.requestType} request</button> 
    <button className='decline' onClick={function(){props.decline(props.inboxName)}}>Decline {props.inboxName}'s {props.requestType} request</button></span>
    <br/>
  </div>
)};

window.InboxEntry = InboxEntry;
var InboxEntry = (props) => {

  return (
  <div className="InboxEntry">
    <span className="inboxFriend"> Name:{props.inboxName} <button className='accept' onClick={function(){props.accept(props.inboxName, props.requestMovie)}}> 
    Accept {props.inboxName}'s {props.requestType} request {props.requestMovie}</button> 
    <button className='decline' onClick={function(){props.decline(props.inboxName)}}>
    Decline {props.inboxName}'s {props.requestType} request {props.requestMovie}</button></span>
    <br/>
    Message:{props.messageInfo}
  </div>
)};

window.InboxEntry = InboxEntry;
var InboxEntry = (props) => {


  return (
  <div className="InboxEntry">
    <span id="inboxFriend">Name:{props.inboxName} <button className='accept' onClick={props.accept}> Accept {props.inboxName} </button> 
    <button className='decline' onClick={props.decline}>Decline {props.inboxName}</button></span>
    <br/>
  </div>
)};

window.InboxEntry = InboxEntry;
var InboxEntry = (props) => {


  return (
  <div className="InboxEntry">
    <span id="inboxFriend">Name:{props.inboxName} <button className='accept' onClick={function(){props.accept(props.inboxName)}}> Accept {props.inboxName} </button> 
    <button className='decline' onClick={function(){props.decline(props.inboxName)}}>Decline {props.inboxName}</button></span>
    <br/>
  </div>
)};

window.InboxEntry = InboxEntry;
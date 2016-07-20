var InboxEntry = (props) => {


  return (
  <div className="InboxEntry">
    <span id="inboxFriend">Name:{props.inboxName} <button className='accept' onClick={function(){props.accept('aaa')}}> Accept {props.inboxName} </button> 
    <button className='decline' onClick={function(){props.decline('aaaa')}}>Decline {props.inboxName}</button></span>
    <br/>
  </div>
)};

window.InboxEntry = InboxEntry;
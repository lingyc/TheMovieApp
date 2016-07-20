var InboxEntry = (props) => (
  <div className="InboxEntry">
    <span id="inboxFriend">Name:{props.inboxName} <button onClick={props.accept} >Accept</button> <button onClick={props.decline}>Decline</button></span>
    <br/>
  </div>
);

window.InboxEntry = InboxEntry;
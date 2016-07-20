var InboxEntry = (props) => (
  <div className="InboxEntry">
    <span id="inboxFriend">Name:{props.inboxName}</span>
    <br/>
  </div>
);

window.InboxEntry = InboxEntry;
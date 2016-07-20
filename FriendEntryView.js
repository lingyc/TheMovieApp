var FriendEntry = (props) => {


  return (
  <div className="FriendEntry">
    <div id="Friend"><div><h3>{props.Friend}</h3></div>  <b>Compatability: TBD</b>  <button>Send watch request</button></div>
    <br/>
  </div>
)};

window.FriendEntry = FriendEntry;
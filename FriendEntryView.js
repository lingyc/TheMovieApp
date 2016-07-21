var FriendEntry = (props) => {
//var test=props.Friend;

  return (
  <div className="FriendEntry">
    <div id="Friend"><div><h3 className='individual' onClick={props.fof}>{props.Friend}</h3></div>  <b>Compatability: TBD</b>  <button>Send watch request</button></div>
    <br/>
  </div>
)};

window.FriendEntry = FriendEntry;
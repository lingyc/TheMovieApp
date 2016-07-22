var FriendEntry = (props) => {
//var test=props.Friend;

  return (
  <div className="FriendEntry">
    <div id="Friend"><div><h3 className='individual' onClick={props.fof}>{props.Friend}</h3></div>  <b>Compatability: TBD</b>
      <div className='watchModule'><button onClick={function(){props.sendARequest(props.Friend)}}>Send watch request</button>Movie name here<input type='text'></input></div></div>
    <br/>
  </div>
)};

window.FriendEntry = FriendEntry;
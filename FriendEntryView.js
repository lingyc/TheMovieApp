var FriendEntry = (props) => {


  return (
  <div className="FriendEntry">
    <div id="Friend"><div><h3 className='individual' onClick={props.fof}>{props.Friend}</h3></div>  <b>Compatability: {props.Comp}</b>
      <div className='watchModule'><button onClick={function(){props.sendARequest(props.Friend)}}>Send watch request</button></div></div>
    <br/>
  </div>
)};

window.FriendEntry = FriendEntry;
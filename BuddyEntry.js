var BuddyEntry = (props) => {
//var test=props.Friend;

  return (
  <div>
   <h3 >{props.Buddy}</h3><button className='buddy' onClick={function(){props.buddyfunc(props.Buddy)}}>Click to send {props.Buddy} a friend request</button> Compatability:{props.BuddyScore}
  </div>
)};

window.BuddyEntry = BuddyEntry;
var BuddyEntry = (props) => {
//var test=props.Friend;
  return (
  <div className='collection-item row'>
    <div className="col s3">
    	<img className='profilethumnail' src={'https://unsplash.it/170/170/?random'}/>
    </div>
    <div id="Friend" className="buddy col s9">
   		<h3 className="buddyName">{props.Buddy}</h3>
   		<a className="waves-effect waves-light btn" onClick={function(){props.buddyfunc(props.Buddy)}}>send friend request</a> 
   		<div className="buddyCompatibility">Compatability:{props.BuddyScore}</div>
  	</div>
  </div>
)
};

window.BuddyEntry = BuddyEntry;
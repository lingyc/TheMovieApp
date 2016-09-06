const BuddyEntry = ({Buddy, BuddyScore,buddyfunc}) => (
 
  <div className='collection-item row'>
    <div className="col s3">
    	<img className='profilethumnail' src={'https://unsplash.it/170/170/?random'}/>
    </div>
    <div id="Friend" className="buddy col s9">
   		<h3 className="buddyName">{Buddy}</h3>
      <div className="buddyCompatibility">{(BuddyScore === 'Nothing to compare') ? `Compatability: ${Buddy} has not rated any movies` : `Compatability${BuddyScore}`}</div>
   		<a className="waves-effect waves-light btn" onClick={function(){buddyfunc(Buddy)}}>send friend request</a> 
  	</div>
  </div>
)


window.BuddyEntry = BuddyEntry;


var FriendEntry = (props) => {


  return (
  <div className="FriendEntry collection-item row">
  	<div className="col s3">
  		<img className='profilethumnail' src={'https://unsplash.it/170/170/?random'}/>
  	</div>
    <div id="Friend" className="col s9">
    	<a className='individual'><h3 className="friendName" onClick={function(){props.fof(props.Friend)}}>{props.Friend}</h3></a>  
    	<div className="compatability" >Compatability: {props.Comp}%</div>
    </div>
  </div>
)};

window.FriendEntry = FriendEntry;
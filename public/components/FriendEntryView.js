var FriendEntry = (props) => {


  return (
  <div className="FriendEntry collection-item row">
  	<div className="col s3">
  		<img className='profilethumnail' src={'https://unsplash.it/200/300/?random'}/>
  	</div>
    <div id="Friend" className="col s9">
    	<h3 className='individual' onClick={props.fof}>{props.Friend}</h3>  
    	<div>Compatability: {props.Comp}</div>
    </div>
  </div>
)};

window.FriendEntry = FriendEntry;
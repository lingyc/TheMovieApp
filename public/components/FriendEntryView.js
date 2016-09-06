const FriendEntry = ({Friend, fof, Comp }) =>  (
  <div className="FriendEntry collection-item row" >
  	<div className="col s3">
  		<img className='profilethumnail' src={'https://unsplash.it/170/170/?random'}/>
  	</div>
    <div id="Friend" className="friendEntry col s9">
    	<a className='friendEntryIndividual'><h3 className="friendName" onClick={()=>{fof(Friend)}}>{Friend}</h3></a>  
    	<div className="friendEntryCompatability" >Compatability: {Comp === 'No comparison to be made' ? 'No comparison to be made' : Comp + '%'}</div>
    </div>
  </div>
);

window.FriendEntry = FriendEntry;
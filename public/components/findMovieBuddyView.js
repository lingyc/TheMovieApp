var FindMovieBuddy = (props) => {
	var empty =props.buddies.length===0?"You've friended everybody!":"";
  return (

  <div className='movieBuddy collection'>
	  <div className='header'>find your next movie buddy</div><br/>
	  {empty}
	  <div style={{display:'none'}} id='AlreadyReq2'>You have already sent a request to this user!</div><br/>
	  {props.buddies.map(function(buddy){ if (buddy[1]===null) {buddy[1]='Nothing to compare'} return (<BuddyEntry buddyfunc={props.buddyfunc} Buddy={buddy[0]} BuddyScore={buddy[1]} /> )})}

  </div>
   

)};

window.FindMovieBuddy = FindMovieBuddy;
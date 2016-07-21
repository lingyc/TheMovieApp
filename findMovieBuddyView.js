var FindMovieBuddy = (props) => {

  return (

   <div>

   <h2>Your Potential Movie Buddies</h2>  <br/>
  
   {props.buddies.map(function(buddy){ return (<BuddyEntry buddyfunc={props.buddyfunc} Buddy={buddy} /> )})}

     </div>
   

)};

window.FindMovieBuddy = FindMovieBuddy;
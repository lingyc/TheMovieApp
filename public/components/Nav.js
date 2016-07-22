let Nav = (props) => (
  <nav className="navbar">
    <div>
        
        <button onClick={() => (props.onClick("Home"))}>Home</button>
        <button onClick={() => (props.onClick("MyRatings"))}>My Ratings</button>
        <button onClick={() => (props.onClick("Friends"))}>My Friends </button>
        <button onClick={props.find}>Find New Movie Buddies</button>
        <div id='logOutButton'>
        <button onClick={props.logout}>Log Out</button> 
        <button onClick={() => (props.onClick("Inbox"))}>Notifications </button>
         </div>
      
    </div>
  </nav>
);

window.Nav = Nav;




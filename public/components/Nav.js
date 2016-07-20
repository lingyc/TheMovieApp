let Nav = (props) => (
  <nav className="navbar">
    <div>
        
        <button onClick={() => (props.onClick("Home"))}>
        Home</button>
        <button>My Ratings (not yet functional(nyf))</button>
        <button>My Friends(nyf)</button>
        <button>Find New Movie Buddies(nyf)</button>
        <button onClick={() => (props.onClick("MovieSearchView"))}>
        IMDB Movie Ratings</button>
        <button onClick={() => (props.onClick("Friends"))}>Friends </button>
        <div id='logOutButton'>
        <button onClick={props.logout}>Log Out</button> 
        <button onClick={() => (props.onClick("Inbox"))}>Notifications </button>
         </div>
      
    </div>
  </nav>
);

window.Nav = Nav;




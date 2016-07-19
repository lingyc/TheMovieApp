let Nav = (props) => (
  <nav className="navbar">
    <div>
        <button onClick={() => (props.onClick("recentRelease"))}>Home</button>
        <button id='logOutButton' onClick={props.logout}>Log Out</button> 
        <button onClick={() => (props.onClick("Home"))}>
        Home</button>
        <button>My Ratings (not yet functional(nyf))</button>
        <button>My Friends(nyf)</button>
        <button>Find New Movie Buddies(nyf)</button>
        <button onClick={() => (props.onClick("MovieSearchView"))}>
        IMDB Movie Ratings</button>
        <button onClick={() => (props.onClick("Home2"))}>
        Add Movie Ratings</button>
        <button onClick={() => (props.onClick("Friends"))}>Friends </button>
        <button onClick={() => (props.onClick("Inbox"))}>Inbox </button>
    </div>
  </nav>
);

window.Nav = Nav;




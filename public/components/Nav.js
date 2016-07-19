let Nav = (props) => (
  <nav className="navbar">
    <div>
    
        <button onClick={() => (props.onClick("Home"))}>
        Get Friends' Movie Ratings</button>
        <button onClick={() => (props.onClick("MovieSearchView"))}>
        IMDB Movie Ratings</button>
        <button onClick={() => (props.onClick("Home2"))}>
        Add Movie Ratings</button>
        <button onClick={() => (props.onClick("Friends"))}>Friends </button>
        <button onClick={() => (props.onClick("Inbox"))}>Inbox </button>
        <button onClick={props.logout}>Log Out</button>  
      
    </div>
  </nav>
);

window.Nav = Nav;




let Nav = (props) => (
  <nav className="navbar">
    <div>
    
        <button onClick={() => (props.onClick("Home"))}>
        Friend Movie Ratings</button>
        <button onClick={() => (props.onClick("MovieSearchView"))}>
        Movie Ratings</button>
        <button onClick={() => (props.onClick("Home2"))}>
        Add Movie Rating</button>
        <button onClick={props.logout}>Log Out</button>  
        <button onClick={() => (props.onClick("Friends"))}>Friends </button>
        <button onClick={() => (props.onClick("Inbox"))}>Inbox </button>
      
    </div>
  </nav>
);

window.Nav = Nav;




let Nav = (props) => (
  <nav className="navbar">
    <div>
      <ul>
        <li onClick={() => (props.onClick("Home"))}>
        Friend Movie Ratings</li>
        <li onClick={() => (props.onClick("MovieSearchView"))}>
        Movie Ratings</li>
        <li onClick={() => (props.onClick("Home2"))}>
        Add Movie Rating</li>
        <li onClick={props.logout}>Log Out</li>  
        <li onClick={() => (props.onClick("Friends"))}>Friends </li>
        <li onClick={() => (props.onClick("Inbox"))}>Inbox </li>
      </ul>
    </div>
  </nav>
);

window.Nav = Nav;




let Nav = (props) => (
  <nav className="navbar">
    <div>
      <ul>
        <li>List</li>
        <li>Friends</li>
        <li>Settings</li>
        <li onClick={props.logout}>Log Out</li>  
      </ul>
    </div>
  </nav>
);

window.Nav = Nav;




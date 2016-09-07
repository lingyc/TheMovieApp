const Nav = ({onClick, Home, find, logout, name}) => (
    <div>
      <div className="navbar-fixed movieBuddyNav">
        <nav>
          <div className="nav-wrapper">
            <a href="#" onClick={() => (onClick("Home"))} className="brand-logo center">TheMovieApp</a>
            <ul id="nav-mobile" className="left hide-on-med-and-down">
              <li><a className={(Home === true) ? "active" : ""} onClick={() => (onClick("Home"))}>Home</a></li>
              <li><a onClick={() => (onClick("MyRatings"))}>My Ratings</a></li>
              <li><a onClick={() => (onClick("Friends"))}>My Friends</a></li>
              <li><a onClick={find}>New Buddies</a></li>
            </ul>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li><a onClick={logout}>Log Out</a></li>      
              <li><a onClick={() => (onClick("Inbox"))}>Notifications</a></li>     
            </ul>
          </div>
        </nav>
      </div>
      <div className="headBand">
        <h3>Hi, {name}!</h3>
      </div>
    </div>
);

window.Nav = Nav;

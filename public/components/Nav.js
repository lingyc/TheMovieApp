let Nav = (props) => (
    <div>
      <div className="navbar-fixed movieBuddyNav">
        <nav>
          <div className="nav-wrapper">
            <a href="#" onClick={() => (props.onClick("Home"))} className="brand-logo center">Movie Buddy</a>
            <ul id="nav-mobile" className="left hide-on-med-and-down">
              <li><a className={(props.Home === true) ? "active" : ""} onClick={() => (props.onClick("Home"))}>Home</a></li>
              <li><a onClick={() => (props.onClick("MyRatings"))}>My Ratings</a></li>
              <li><a onClick={() => (props.onClick("Friends"))}>My Friends</a></li>
              <li><a onClick={props.find}>New Buddies</a></li>
            </ul>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              <li><a onClick={props.logout}>Log Out</a></li>      
              <li><a onClick={() => (props.onClick("Inbox"))}>Notifications</a></li>     
            </ul>
          </div>
        </nav>
      </div>
      <div className="headBand">
        <h3>Hi, {props.name}!</h3>
      </div>
    </div>
);

window.Nav = Nav;

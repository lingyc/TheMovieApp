class MovieWatchRequest extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
   		active: false,
   		friends: [],
   		friendStash:[],
      filter: '',
      message: ''
    };
  }

  getFriendList() {
  	//send get request to retrive friends and set to this.state.friends
    $.get('http://127.0.0.1:3000/getFriendList')
    .then(friends => {
      console.log('response from server', friends);
      this.setState({
        friends: friends
      });
    })
  }

  handleClick() {
  	//will turn this.state.active to true and rerender the view
    this.setState({
      active: !this.state.active
    })
    this.getFriendList();
  }

  handleSubmit() {
  	//will send out a watch request for this.props.movie to friends in the stash
  	//will display a message saying the request is made
  	//set this.state.active to false
    //set the stash to empty
  	//show send another request button

    this.setState({
      active: false,
      friendStash: [],
      filter: '',
      message: ''
    })
  }

  handleFilter() {
  	//Filter a particular friend in the friend list

  }

  handleAddFriend(friend) {
    //add friend to stash
    console.log('calling handleAddFriend');
    if (this.state.friendStash.indexOf(friend) < 0) {
      var stashCopy = this.state.friendStash.unshift(friend)
      stashCopy.unshift(friend)
      this.setState({
        friendStash: stashCopy
      });
      console.log(this.state.friendStash);
    }
  }

  handleRemoveFriend(friend) {
    //remove friend from stash
    console.log('calling handleRemoveFriend');
    var idx = this.state.friendStash.indexOf(friend)
    this.setState({
      friendStash: this.state.friendStash.splice(idx, 1)
    });
  }

  render() {
    if (this.state.active) {
      if (this.state.friendStash) {

        var stash = 
          this.state.friendStash.map(fue => console.log('asdfasd'));
          (<div className="MovieWatchRequestFriendStash">
            <ul className="friendStash" name="friendStash" multiple>
              {this.state.friendStash.map(friend => <WatchRequestStashEntry friend={friend} handleRemoveFriend={this.handleRemoveFriend.bind(this)}/>)}
            </ul>
          </div>)

      } else {
        var stash = 'friend stash is empty';
      }

      return(
        <div className="activeWatchRequest">
          <div className="MovieWatchRequestFriendList">
            <input type="text" value={this.state.filter} placeholder="filter friends" onChange={this.handleFilter.bind(this)}/>
            <ul className="friendList" name="friendsList" multiple>
              {this.state.friends.map(friend => <WatchRequestFriendEntry friend={friend} handleAddFriend={this.handleAddFriend.bind(this)}/>)}
            </ul>
          </div>

          {stash}
          <input className="messageBox" value={this.state.message} placeholder="add a message"/>
          <button className="watchRequest" onClick={this.handleSubmit.bind(this)}>send watch request</button>
        </div>
      )
    } else {
      return (<div onClick={this.handleClick.bind(this)}>send watch request</div>)
    }
  }
}




var WatchRequestFriendEntry = (props) => {
  return (<li>{props.friend}<button onClick={() => props.handleAddFriend(props.friend)}>add</button></li>)
};

var WatchRequestStashEntry = (props) => {
  return (<li>{props.friend}<button onClick={() => props.handleRemoveFriend(props.friend)}>remove</button></li>)
};


window.MovieWatchRequest = MovieWatchRequest;




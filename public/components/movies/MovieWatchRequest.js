class MovieWatchRequest extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
   		active: false,
   		friends: [],
      filteredFriends: [],
   		friendStash:[],
      message: '',
      requestSent: false,
      noRequesteeWarning: false
    };
  }

  getFriendList() {
  	//send get request to retrive friends and set to this.state.friends
    $.get(Url + '/getFriendList')
    .then(friends => {
      console.log('response from server', friends);
      var uniqFriend = _.uniq(friends);
      this.setState({
        friends: uniqFriend,
        filteredFriends: uniqFriend
      });
    })
  }

  handleClick() {
  	//will turn this.state.active to true and rerender the view
    this.setState({
      active: !this.state.active,
      requestSent: false

    })
    this.getFriendList();
  }

  handleMsg(event) {
    this.setState({
      message: event.target.value
    })
  }

  handleSubmit() {
  	//will send out a watch request for this.props.movie to friends in the stash
  	//will display a message saying the request is made
  	//set this.state.active to false
    //set the stash to empty
  	//show send another request button
    if (this.state.friendStash.length) {
      var requestObj = {
        requestTyp: 'watch',
        movie: this.props.movie.title,
        movieid: this.props.movie.id,
        message: this.state.message,
        requestee: this.state.friendStash
      };

      $.post(Url + '/sendWatchRequest', requestObj)
      .done(response => {
        this.setState({
          active: false,
          friendStash: [],
          filter: '',
          message: '',
          requestSent: true
        })
      });
    } else {
      this.setState({
        noRequesteeWarning: true
      })
    }

  }

  handleFilter(event) {
  	//Filter a particular friend in the friend list

    var filteredFriends = [];
    this.state.friends.forEach(friend => {
      if (friend.indexOf(event.target.value) > -1 ) {
        filteredFriends.push(friend);
      }
    })
    
    this.setState({
      filteredFriends: filteredFriends
    });
  }

  handleAddFriend(friend) {
    console.log('should be all friends to choose from', this.state.filteredFriends)
    //add friend to stash
    console.log('calling handleAddFriend');
    var newFilteredFriends=this.state.filteredFriends;
    newFilteredFriends.splice(newFilteredFriends.indexOf(friend),1);
    if (this.state.friendStash.indexOf(friend) < 0) {
      var stashCopy = this.state.friendStash;
      stashCopy.unshift(friend);
      this.setState({
        friendStash: stashCopy,
        filteredFriends:newFilteredFriends
      });
    }
  }

  handleRemoveFriend(friend) {
    //remove friend from stash
    var idx = this.state.friendStash.indexOf(friend)
    if (this.state.friendStash.length === 1) {
      this.setState({
        friendStash: []
      });
    } else {
      console.log('im trying to remove', friend);
      var stashCopy = this.state.friendStash;
      stashCopy.splice(idx, 1);
      this.setState({
        friendStash: stashCopy
      });
    }

    var newFilteredFriends=this.state.filteredFriends.concat([friend]);
    this.setState({
      filteredFriends: newFilteredFriends
    });


  }

  render() {
    if (this.state.active) {
      if (this.state.friendStash.length > 0) {
        var stash = 
          (<div className="MovieWatchRequestFriendStash col s6">
            <ul className="friendStash" name="friendStash" multiple>
              {this.state.friendStash.map(friend => <WatchRequestStashEntry friend={friend} handleRemoveFriend={this.handleRemoveFriend.bind(this)}/>)}
            </ul>
          </div>)
      } else if (this.state.friendStash.length === 0) {
        var stash = 
        <div className="MovieWatchRequestFriendStash col s6">
          <ul className="friendStash" name="friendStash" multiple>
            <div className="errorMsg">Please Select A Friend</div>
          </ul>
        </div>;
      }

      return(
        <div className="activeWatchRequest">
          <input type="text" placeholder="filter friends" onChange={this.handleFilter.bind(this)}/>
          <div className="row">
            <div className="MovieWatchRequestFriendList col s6">
              <ul className="friendList" name="friendsList" multiple>
                {(this.state.filteredFriends.length === 0) ? <div className="errorMsg">'no friend match is found'</div> : ''}
                {this.state.filteredFriends.map(friend => <WatchRequestFriendEntry friend={friend} handleAddFriend={this.handleAddFriend.bind(this)}/>)}
              </ul>
            </div>

            {stash}
          </div>
          <textarea className="messageBox" cols="40" rows="5" onChange={this.handleMsg.bind(this)} placeholder="Add a message" maxlength="255"></textarea>
          <button className="watchRequest" onClick={this.handleSubmit.bind(this)}>Send Watch Request</button>
          <button className="closeWatchRequest" onClick={this.handleClick.bind(this)}>Close Watch Request</button>
        </div>
      )
    } else {
      return (
        <div>
          <button className="watchRequestButton" onClick={this.handleClick.bind(this)}>{(this.state.requestSent) ? 'send another watch request' : 'send a watch request'}</button>
          <span className='sent updateMsg'>{(this.state.requestSent) ? 'your request has been sent' : ''}</span>
        </div>
        )
    }
  }
}




var WatchRequestFriendEntry = (props) => {

  return (<li><span>{props.friend}</span><a className="btn-floating btn-small waves-effect waves-light red" onClick={() => props.handleAddFriend(props.friend)}><i class="material-icons">+</i></a></li>)
};

var WatchRequestStashEntry = (props) => {
  return (<li><span>{props.friend}</span><a className="btn-floating btn-small waves-effect waves-light red" onClick={() => props.handleRemoveFriend(props.friend)}><i class="material-icons">-</i></a></li>)
};


window.MovieWatchRequest = MovieWatchRequest;




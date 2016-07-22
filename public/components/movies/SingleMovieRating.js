class SingleMovieRating extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      movie: props.currentMovie,
      view: 'SingleMovie',
      mainUser: props.currentUser,
      friends: []
    };
  }

  componentDidMount() {
    //movie will have been successfully passed
    //into singlemovierating 
    //note need to change app state movie
    //when other things are clicked later on
    this.setState({
      friends: this.getFriends();
    });
    console.log('this is friends', this.state.friends);
    // this.getFriendsRating(this.state.movie);
    // $.get('http://127.0.0.1:3000/getFriends', {name: this.state.mainUser})
    //   .then(function(data) {
    //     console.log(data);
    //   })
    //   .catch(function(err) {
    //     console.log(err);
    //   });
  }

  componentWillReceiveProps() {
    this.setState({
      movie: this.props.movie
    });
  }

  onStarClick(event) {
    this.setState({userRating: event.target.value});
    this.updateRating(event.target.value);
  }

  getFriends() {
    console.log('hi');
    $.post('http://127.0.0.1:3000/getFriends')
      .then(function(resp) {
        console.log(resp);
      })
      .catch(function(err) {
        console.log(err);
      });
    console.log('hi2')
  }

  //get friend ratings by calling requesthandler
  //get friendratings, passing in mainUser and movieobj
  getFriendsRating(inputMovie) {
    $.post('http://127.0.0.1:3000/getFriendRatings', 
      {movie: inputMovie})
      .then(function(response) {
        console.log(response);
      })
      .catch(function(err) {
        console.log(err)
      });
    console.log('this is the movie', inputMovie);
  }

  render() {
    let movie = this.state.movie;
    return (
      <div>
        <div className="singleMovie">
          <img className='moviethumbnail' src={movie.poster} />
          <h1 className='movieTitle'>{movie.title}</h1>
          <p className='movieYear'>{movie.release_date}</p>
          <p className='movieDescription'>{movie.description}</p>
          <p className='imdbRating'>IMDB rating: {movie.imdbRating}</p>
          <div className='watchRequestButton'>send watch request</div>
          <div className='userRating'>{(this.state.userRating === null) ? 'you have not rated this movie' : 'your rating is ' + this.state.userRating}
          <StarRatingComponent onStarClick={this.onStarClick.bind(this)}/>
          </div>
          <div className='avgFriendRatingBlock'>average friend rating: {(movie.friendAverageRating) ? movie.friendAverageRating : 'no friend ratings' }</div>
        </div>
        <div>
          {this.state.friends.map((friend, i) => 
            <singleMovieRatingEntry
            currentMovie={this.state.movie}
            mainUser={this.state.mainUser}
            friendFocus={this.state.friends[i]}
            />
          )}
        </div>
      </div>
    );
  }
};

window.SingleMovieRating = SingleMovieRating;
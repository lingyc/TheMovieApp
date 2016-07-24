class SingleMovieRating extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      movie: this.props.currentMovie,
      view: 'SingleMovie',
      friendRatings: []
    };
  }

  componentDidMount() {
    //movie will have been successfully passed
    //into singlemovierating 
    //note need to change app state movie
    //when other things are clicked later on
    // this.getFriends();
    this.getFriendsRating(this.state.movie);
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
    var that = this;
    $.post('http://127.0.0.1:3000/getFriends')
      .then(function(resp) {
        console.log(that.state.friends)
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  //get friend ratings by calling requesthandler
  //get friendratings, passing in mainUser and movieobj
  getFriendsRating(inputMovie) {
    var that = this;
    $.post('http://127.0.0.1:3000/getFriendRatings', 
      {movie: inputMovie})
      .then(function(response) {
        console.log(response);
        that.setState({
          friendRatings: response
        })
      })
      .catch(function(err) {
        console.log(err)
      });
    // console.log('this is the movie', inputMovie);
  }

  render() {
    let that = this;
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
          <StarRatingComponent onStarClick={this.onStarClick.bind(this)} movie={this.props.currentMovie}/>
          </div>
          <div className='avgFriendRatingBlock'>average friend rating: {(movie.friendAverageRating) ? movie.friendAverageRating : 'no friend ratings' }</div>
        </div>
        <div>
          {this.state.friendRatings.map(friendRating => 
            <SingleMovieRatingEntry 
            rating={friendRating}
            change={that.props.change}
            fof={that.props.fof}
            />
            )}
        </div>
      </div>
    );
  }
};

window.SingleMovieRating = SingleMovieRating;
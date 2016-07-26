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
    this.getFriendsRating(this.state.movie);
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
    $.post(Url + '/getFriends')
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
    $.post(Url + '/getFriendRatings', 
      {movie: inputMovie})
      .then(function(response) {
        console.log('this is the response', response);
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
      <div className='Home collection' onClick={()=> console.log(that.state)}>
        <div className="movieEntry collection-item row">
          <img className='moviethumnail col s3' src={movie.poster} onClick={() => (this.props.change("SingleMovie", movie))}/>
          <div className='right col s9'>
            <h5 className='movieTitle' onClick={() => (this.props.change("SingleMovie", movie))}>{movie.title}</h5>
            <p className='movieYear'>{movie.release_date}</p>
            <p className='movieDescription'>{movie.description}</p>
            <ReviewComponent 
              review={movie.review} 
              title={movie.title}
              id={movie.id}/>
            <MovieWatchRequest movie={movie}/>

            <div className="ratings row">
              <div className='imdbRating col s4'>IMDB rating: <b>{movie.imdbRating}</b></div>
              <StarRatingComponent movie={movie}/>
              <div className='avgFriendRatingBlock col s4'>average friend rating: {(movie.friendAverageRating) ? <b>{movie.friendAverageRating}</b> : 'n/a' }</div>
            </div>
          </div>
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
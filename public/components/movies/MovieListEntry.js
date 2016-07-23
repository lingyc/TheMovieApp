class MovieListEntry extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userRating: this.props.movie.score,
      userReview: this.props.movie.review,
      friendAverageRating: this.props.movie.friendAverageRating
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      userRating: nextProps.movie.score,
      userReview: this.props.movie.review,
      friendAverageRating: nextProps.movie.friendAverageRating
    });
  }

  onStarClick(event) {
    //setState is async
    this.setState({userRating: event.target.value});
    this.updateRating(event.target.value);
  }


  updateRating(rating) {
    var movieObj = {
      title: this.props.movie.title, 
      id: this.props.movie.id,
      rating: rating
    };
    $.post('http://127.0.0.1:3000/ratemovie', movieObj)
    .done(response => {
      console.log('movie rating updated');
    })
  }

  render() {
    let movie = this.props.movie;

    if (this.props.friendName) {
      var friendSection = (
        <div>
          <div>{`${this.props.friendName} rates`} <span className='friendScore'>{movie.friendScore}</span> </div>
          <div className='friendReview'>{`${this.props.friendName}'s review: ${(movie.friendReview !== null) ? movie.friendReview : this.props.friendName + ' did not leave a review'}`}</div>
        </div>
      )
    } else {
      var friendSection = '';
    }

  	return (
  		<div className='movieEntry'>
  			<img className='moviethumnail' src={movie.poster} onClick={() => (this.props.change("SingleMovie", movie))}/>
  			<h1 className='movieTitle' onClick={() => (this.props.change("SingleMovie", movie))}>{movie.title}</h1>
  			<p className='movieYear'>{movie.release_date}</p>
  			<p className='movieDescription'>{movie.description}</p>
        <ReviewComponent 
          review={movie.review} 
          title={this.props.movie.title}
          id={this.props.movie.id}/>
  			<p className='imdbRating'>IMDB rating: {movie.imdbRating}</p>
  			<MovieWatchRequest movie={this.props.movie}/>
        <div className='userRating'>{(this.state.userRating === null) ? 'you have not rated this movie' : 'your rating is ' + this.state.userRating}
          <StarRatingComponent onStarClick={this.onStarClick.bind(this)}/>
        </div>
        <div className='avgFriendRatingBlock'>average friend rating: {(movie.friendAverageRating) ? movie.friendAverageRating : 'no friend ratings' }</div>
        {friendSection}
      </div>);

	}
}

window.MovieListEntry = MovieListEntry;
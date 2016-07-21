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
    console.log('componentWillReceiveProps');
    this.setState({
      userRating: nextProps.movie.score,
      userReview: this.props.movie.review,
      friendAverageRating: nextProps.movie.friendAverageRating
    });
    console.log('user rating', nextProps.movie.title, nextProps.userRating);
  }

  onStarClick(event) {
    //setState is async
    this.setState({userRating: event.target.value});
    this.updateRatingOrReview(event.target.value, null);
  }

  onSubmitReview(review) {
    //setState is async
    this.setState({userReview: review})
    this.updateRatingOrReview(null, review);
  }

  updateRatingOrReview(rating, review) {
    if (rating) {
      var review = this.state.userReview;
    } else if (review) {
      var rating = this.state.userRating;
    }

    var movieObj = {
      title: this.props.movie.title, 
      id: this.props.movie.id,
      rating: rating,
      review: review
    };
    $.post('http://127.0.0.1:3000/ratemovie', movieObj)
    .done(response => {
      console.log('movie rating updated');
    })
  }

  render() {
  	let movie = this.props.movie;
  	return (
  		<div className='movieEntry'>
  			<img className='moviethumnail' src={movie.poster} onClick={() => (this.props.change("SingleMovie", movie))}/>
  			<h1 className='movieTitle' onClick={() => (this.props.change("SingleMovie", movie))}>{movie.title}</h1>
  			<p className='movieYear'>{movie.release_date}</p>
  			<p className='movieDescription'>{movie.description}</p>
        <ReviewComponent review={movie.review} onSubmit={this.onSubmitReview.bind(this)}/>
  			<p className='imdbRating'>IMDB rating: {movie.imdbRating}</p>
  			<div className='watchRequestButton'>send watch request</div>
        <div className='userRating'>{(this.state.userRating === null) ? 'you have not rated this movie' : 'your rating is ' + this.state.userRating}
          <StarRatingComponent onStarClick={this.onStarClick.bind(this)}/>
        </div>
        <div className='avgFriendRatingBlock'>average friend rating: {(movie.friendAverageRating) ? movie.friendAverageRating : 'no friend ratings' }</div>
      </div>);
	}
}

window.MovieListEntry = MovieListEntry;
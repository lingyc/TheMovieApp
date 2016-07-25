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
  		<div className='movieEntry collection-item'>
  			<img className='moviethumnail col s7 push-s5' src={movie.poster} onClick={() => (this.props.change("SingleMovie", movie))}/>
        <div className='col s5 pull-s7'>
    			<h3 className='movieTitle' onClick={() => (this.props.change("SingleMovie", movie))}>{movie.title}</h3>
    			<p className='movieYear'>{movie.release_date}</p>
    			<p className='movieDescription'>{movie.description}</p>
          <ReviewComponent 
            review={movie.review} 
            title={movie.title}
            id={movie.id}/>
    			<p className='imdbRating'>IMDB rating: {movie.imdbRating}</p>
    			<MovieWatchRequest movie={movie}/>
          <StarRatingComponent movie={movie}/>
          <div className='avgFriendRatingBlock'>average friend rating: {(movie.friendAverageRating) ? movie.friendAverageRating : 'no friend ratings' }</div>
          {friendSection}
        </div>
      </div>);

	}
}

window.MovieListEntry = MovieListEntry;
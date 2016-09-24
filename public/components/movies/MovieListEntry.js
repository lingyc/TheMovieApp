class MovieListEntry extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userRating: this.props.movie.score,
      userReview: this.props.movie.review,
      friendAverageRating: Math.round( this.props.movie.friendAverageRating * 10 ) / 10
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
  		<div className='movieEntry collection-item row'>
  			<img className='moviethumnail col s3' src={movie.poster} onClick={() => (this.props.change("SingleMovie", movie))} alt="no_image_available.gif"/>
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
      			<div className='imdbRating col s4'>IMDB Rating: <b>{movie.imdbRating}/10</b></div>
            <StarRatingComponent movie={movie}/>
            <div className='avgFriendRatingBlock col s4'>Average Friend Rating: {(movie.friendAverageRating) ? <b className="friendRating">{movie.friendAverageRating}/5</b> : 'n/a' }</div>
          </div>
          {friendSection}
        </div>
      </div>);

	}
}

window.MovieListEntry = MovieListEntry;
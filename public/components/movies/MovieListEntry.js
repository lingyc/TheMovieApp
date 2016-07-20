class MovieListEntry extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    	userRating: null,
    	friendAverageRating: null
    };
  }

  componentWillMount() {
  	this.setState({
  		userRating: this.props.movie.score,
  		friendAverageRating: this.props.movie.friendAverageRating
  	})
  }

  onStarClick(name, value) {
    this.setState({userRating: value});
  }


  render() {
  	let movie = this.props.movie
  	return (
  		<div className='movieEntry'>
  			<img className='moviethumnail' src={movie.poster}/>
  			<h1 className='movieTitle'>{movie.title}</h1>
  			<p className='movieYear'>{movie.release_date}</p>
  			<p className='movieDescription'>{movie.description}</p>
  			<p className='userReview'>{(movie.review === '') ? movie.review : 'you have not review the movie yet'}</p>
  			<p className='imdbRating'>IMDB rating: {movie.imdbRating}</p>
  			<div className='watchRequestButton'>send watch request</div>
  			<div className='userRatingBlock'>user rating: {(movie.score) ? movie.score : 'you have not rate the movie'}</div>
  			<div className='avgFriendRatingBlock'>average friend rating: {(movie.friendAverageRating) ? movie.friendAverageRating : 'no friend ratings' }</div>
  		</div>);
	}
}

window.MovieListEntry = MovieListEntry;
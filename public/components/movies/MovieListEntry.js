var MovieListEntry = ({movie}) => (
	<div className='movieEntry'>
		<img className='moviethumnail' src={movie.poster}/>
		<h1 className='movieTitle'>{movie.title}</h1>
		<h1 className='movieYear'>{movie.year}</h1>
		<p className='movieDescription'>{movie.description}</p>
		<p className='userReview'>{(movie.review === '') ? movie.review : 'you have not review the movie yet'}</p>
		<p className='imdbRating'>IMDB rating: {movie.imdbRating}</p>
		<div className='watchRequestButton'>send watch request</div>
		<div className='userRatingBlock'>user rating: {(movie.score) ? movie.score : 'you have not rate the movie'}</div>
		<div className='avgFriendRatingBlock'>average friend rating: {(movie.friendAverageRating) ? movie.friendAverageRating : 'no friend ratings' }</div>
	</div>
)

window.MovieListEntry = MovieListEntry;
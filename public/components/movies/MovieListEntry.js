var MovieListEntry = ({movie}) => (
	<div className='movieEntry'>
		<img className='moviethumnail' src={movie.poster}/>
		<h1 className='movieTitle'>{movie.title}</h1>
		<h1 className='movieYear'>{movie.year}</h1>
		<p className='movieDescription'>movie description</p>
		<p className='userReview'>user review</p>
		<p className='imdbRating'>IMDB rating</p>
		<div className='watchRequestButton'>send watch request</div>
		<div className='userRatingBlock'>user rating{movie.score}</div>
		<div className='avgFriendRatingBlock'>average friend rating: {movie.friendAverageRating}</div>
	</div>
)

window.MovieListEntry = MovieListEntry;
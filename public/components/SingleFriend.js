var SingleFriend = (props) => {


console.log('props.moviesOfFriend',props.moviesOfFriend)
if (props.moviesOfFriend.length===0){
	return (
		<div>
		<button onClick={() => (props.onClick("Friends"))}>Back to all friends</button><br/>
		Sorry, {props.friendName} hasn't rated any movies.
		</div>
		)

} else {
	return (
  <div>
		<button onClick={() => (props.onClick("Friends"))}>Back to all friends</button>
		<h2> List of {props.friendName}'s Movies</h2>
		<div className='moviesOfFriend'>
			{props.moviesOfFriend.map(movie => <MovieListEntry friendName={props.friendName} movie={movie} change={props.change}/> )}
		</div>
	</div>


	)
}
};

window.SingleFriend = SingleFriend;

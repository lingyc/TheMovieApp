var SingleFriend = (props) => {


	console.log('props.moviesOfFriend',props.moviesOfFriend)
	if (props.moviesOfFriend.length === 0){
		return (
			<div>
			<button onClick={() => (props.onClick("Friends"))}>Back to all friends</button><br/>
			Sorry, {props.friendName.slice(props.friendName.indexOf(">")+1,props.friendName.lastIndexOf("<"))} hasn't rated any movies.
			</div>
			)

	} else {
		return (
	  <div className="Home collection">
			<a className="center waves-effect waves-light btn" onClick={() => (props.onClick("Friends"))}>Back to all friends</a>
			<div className="header large"> list of {props.friendName}'s movies</div>
			<div className='moviesOfFriend'>
				{props.moviesOfFriend.map(movie => <MovieListEntry friendName={props.friendName} movie={movie} change={props.change}/> )}
			</div>
		</div>
		)
	}
};

window.SingleFriend = SingleFriend;

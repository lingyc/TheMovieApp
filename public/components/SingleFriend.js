var SingleFriend = ({moviesOfFriend,onClick,friendName, change}) => {


	// console.log('props.moviesOfFriend', moviesOfFriend)
	if (!moviesOfFriend.length){
		return (
			<div>
			<button onClick={() => (onClick("Friends"))}>Back to all friends</button><br/>
			Sorry, {friendName.slice(friendName.indexOf(">") + 1, friendName.lastIndexOf("<"))} hasn't rated any movies.
			</div>
			)

	} else {
		return (
	  <div className="Home collection">
			<a className="center waves-effect waves-light btn" onClick={() => (onClick("Friends"))}>Back to all friends</a>
			<div className="header large"> list of {friendName}'s movies</div>
			<div className='moviesOfFriend'>
				{moviesOfFriend.map(movie => <MovieListEntry friendName={friendName} movie={movie} change={change}/> )}
			</div>
		</div>
		)
	}
};

window.SingleFriend = SingleFriend;

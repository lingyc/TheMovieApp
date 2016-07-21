class SingleMovieRatingEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movie: props.currentMovie
    };
  }

  componentsDidMount() {
    console.log(this.state.friendTargeted);
  }

  render() {
    //note, on click of portrait, name, review
    //should be able to see all the movies reviewed by friend
    //on send watch request click, should send a watch request
    return (
      <div>
        <h1 className='singleMovieFriend'>{props.friendFocus}</h1>
        <p>reviews</p>
        <p>send watch request</p>
        <p>taste compatability</p>
        <p>Friend rating</p>
      </div>
    );
  }

}

window.SingleMovieRatingEntry = SingleMovieRatingEntry;
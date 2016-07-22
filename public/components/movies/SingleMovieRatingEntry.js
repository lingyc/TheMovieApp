class SingleMovieRatingEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: props.rating
    };
  }

  componentsDidMount() {
    console.log(this.props);
  }

  render() {
    //note, on click of portrait, name, review
    //should be able to see all the movies reviewed by friend
    //on send watch request click, should send a watch request
    let rating = this.state.rating;
    return (
      <div>
        <h1 className='singleMovieFriend'>{rating.friendFirstName}</h1>
        <p>{rating.review}</p>
        <p>{rating.score}</p>
      </div>
    );
  }

}

window.SingleMovieRatingEntry = SingleMovieRatingEntry;


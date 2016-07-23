class SingleMovieRatingEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: props.rating
    };
  }

  componentDidMount() {
    console.log(this.props);
  }

  handleClick() {
    console.log(this)
    // this.props.fof();
    // this.props.change('singleFriend', this.state.rating.friendUserName);
  }

  render() {
    //note, on click of portrait, name, review
    //should be able to see all the movies reviewed by friend
    //on send watch request click, should send a watch request
    let rating = this.state.rating;
    var that = this;
    return (
      <div>
        <h1 className='individual' onClick={that.props.fof}>{rating.friendUserName}</h1>
        <p>{rating.review}</p>
        <p>{rating.score}</p>
        <p>PLACEHOLDER: taste compatability with me: 90%</p>
        <p>PLACEHOLDER: send watch request</p>
      </div>
    );
  }

}

window.SingleMovieRatingEntry = SingleMovieRatingEntry;


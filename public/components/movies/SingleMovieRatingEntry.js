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

  handleClick(buddy) {
    console.log(this)
    // this.props.fof(buddy);
    // this.props.change('singleFriend', this.state.rating.friendUserName);
  }

  render() {
    //note, on click of portrait, name, review
    //should be able to see all the movies reviewed by friend
    //on send watch request click, should send a watch request
    let rating = this.state.rating;
    var that = this;
    return (
      <div className="collection-item row" onClick={()=> console.log(that.props)}>
        <div className="col s3">
          <img className='profilethumnail' src={'https://unsplash.it/170/170/?random'}/>
        </div>
        <div id="Friend" className="MovieEntryFriend col s9">
          <div className="top">
            <div className="firendCompatability">taste compatability with me: 90%</div>
            <a className='friendEntryIndividual individual'><div className="friendName" onClick={that.props.fof}>{rating.friendUserName}</div></a>
          </div>
          <div className="friendReview">{(rating.review === null) ? rating.friendUserName + ' did not leave a review' : rating.friendUserName + "'s review: " + rating.review}</div>
          <div className="friendRating">{(rating.score === null) ? rating.friendUserName + ' have not rate the movie yet' : rating.friendUserName + "'s rating is: " + rating.score}</div>
        </div>
      </div>
    );
  }

}

window.SingleMovieRatingEntry = SingleMovieRatingEntry;


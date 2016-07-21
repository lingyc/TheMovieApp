class StarRatingComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    	rating: this.props.rating || null,
    }
  }

  onStarClick(event) {
    console.log(event.target.value);
    this.setState({
      rating: event.target.value
    });
    console.log('here is this.state.rating', this.state.rating);
    this.props.onStarClick(event.target.value);
  }

  render() {
    if (this.state.rating === null) {
      var rating = 'you have not rate the movie';
    } else {
      var rating = 'Your rating is: ' + this.state.rating;
      console.log('rendering');
    }
  	return (
			<div className="star-rating col-sm-10">{rating}
			  <input type="radio" name="rating" value="1" onChange={this.onStarClick.bind(this)}/><i></i>
			  <input type="radio" name="rating" value="2" onChange={this.onStarClick.bind(this)}/><i></i>
			  <input type="radio" name="rating" value="3" onChange={this.onStarClick.bind(this)}/><i></i>
			  <input type="radio" name="rating" value="4" onChange={this.onStarClick.bind(this)}/><i></i>
			  <input type="radio" name="rating" value="5" onChange={this.onStarClick.bind(this)}/><i></i>
			</div>)
  }
}

window.StarRatingComponent = StarRatingComponent;
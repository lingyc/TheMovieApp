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
    this.props.onStarClick(event.target.value);
  }

  render() {
  	return (
			<div className="star-rating col-sm-10">{(this.rating === undefined) ? 'you have not rate the movie' : 'Your rating is: ' + this.props.value}
			  <input type="radio" name="rating" value="1" onChange={this.onStarClick.bind(this)}/><i></i>
			  <input type="radio" name="rating" value="2" onChange={this.onStarClick.bind(this)}/><i></i>
			  <input type="radio" name="rating" value="3" onChange={this.onStarClick.bind(this)}/><i></i>
			  <input type="radio" name="rating" value="4" onChange={this.onStarClick.bind(this)}/><i></i>
			  <input type="radio" name="rating" value="5" onChange={this.onStarClick.bind(this)}/><i></i>
			</div>)
  }
}

window.StarRatingComponent = StarRatingComponent;
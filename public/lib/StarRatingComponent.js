class StarRatingComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      userRating: this.props.movie.score,
      ratingUpdated: false
    };
  }

  onStarClick(event) {
    this.setState({userRating: event.target.value});
    this.updateRating(event.target.value);
  }

  updateRating(rating) {
    var movieObj = {
      title: this.props.movie.title, 
      id: this.props.movie.id,
      rating: rating
    };
    $.post('http://127.0.0.1:3000/ratemovie', movieObj)
    .done(response => {
      console.log('movie rating updated');
      this.setState({
      	ratingUpdated: true
      })
    });
  }

  render() {
		return (
		<div className="userRating col s4">
			<form className="star-rating col-sm-10">
			  <input type="radio" name="group1" value="1" onChange={this.onStarClick.bind(this)}/><i></i>
			  <input type="radio" name="group1" value="2" onChange={this.onStarClick.bind(this)}/><i></i>
			  <input type="radio" name="group1" value="3" onChange={this.onStarClick.bind(this)}/><i></i>
			  <input type="radio" name="group1" value="4" onChange={this.onStarClick.bind(this)}/><i></i>
			  <input type="radio" name="group1" value="5" onChange={this.onStarClick.bind(this)}/><i></i>
      </form>
			{(this.state.userRating === null) ? 'you have not rated this movie' : 'your rating is ' + this.state.userRating}
			{(this.state.ratingUpdated) ? <div className="updatedMsg">rating has updated</div> : ''}
		</div>);
  }
}

window.StarRatingComponent = StarRatingComponent;
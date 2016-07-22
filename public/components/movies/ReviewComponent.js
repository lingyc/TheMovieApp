class ReviewComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userReview: this.props.review,
      editMode: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      userReview: nextProps.review,
      editMode: false
    });
  }

  handleEdit(event) {
    this.setState({editMode: true});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      editMode: false,
    });
    this.updateReview(this.state.userReview);
  }

  handleChange(event) {
    this.setState({
      userReview: event.target.value
    });
  }

  updateReview(review) {
    var movieObj = {
      title: this.props.title, 
      id: this.props.id,
      review: review
    };
    $.post('http://127.0.0.1:3000/ratemovie', movieObj)
    .done(response => {
      console.log('movie rating updated');
    })
  }

  render() {
    console.log('rerendering');
    if (this.state.editMode) {
  		return (
        <div className='userReviewInput'>
          Enter your review, 255 characters maximum
          <form onSubmit={this.handleSubmit.bind(this)}>
    	     <input type='text' value={this.state.userReview} onChange={this.handleChange.bind(this)} maxlength="255"/>
           <input type='submit' value='submit review'/>
          </form>
        </div>);
    } else {
      return (
        <div className='userReview'>
          your review: {(this.state.userReview === '') ? 'you have not review the movie yet' : this.state.userReview}
          <button className='editReviewButton' onClick={this.handleEdit.bind(this)}>edit review</button>
        </div>);
    }
	}
}

window.ReviewComponent = ReviewComponent;
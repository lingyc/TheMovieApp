class ReviewComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userReview: this.props.review,
      editMode: false
    };
  }

  componentWillReceiveProps(nextProps) {
  }

  handleEdit(event) {
    this.setState({editMode: true});
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(event);
    this.setState({
      editMode: false
    });
  }

  handleChange(event) {
    this.setState({
      userReview: event.target.value
    });
  }
  render() {
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
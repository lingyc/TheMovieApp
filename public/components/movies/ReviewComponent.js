class ReviewComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userReview: this.props.review,
      editMode: false,
      reviewSubmitted: false,
      currentInput: this.props.review
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      userReview: nextProps.review,
      editMode: false
    });
  }

  handleEdit() {
    this.setState({
      editMode: true,
      reviewSubmitted: false
    });
  }

  closeEdit() {
    this.setState({
      editMode: false,
      currentInput: this.state.userReview
    });
  }

  handleSubmit() {
    this.setState({
      editMode: false,
      userReview: this.state.currentInput
    });
    this.updateReview(this.state.currentInput);
  }

  handleChange(event) {
    this.setState({
      currentInput: event.target.value
    });
  }

  updateReview(review) {
    var movieObj = {
      title: this.props.title, 
      id: this.props.id,
      review: review
    };
    $.post(Url + '/ratemovie', movieObj)
    .done(response => {
      console.log('movie rating updated');
      this.setState({
        reviewSubmitted: true
      })
    })
  }

  render() {
    if (this.state.editMode) {
  		return (
        <div className='review'>
          Enter your review, 255 characters maximum
           <textarea cols="40" rows="5" value={this.state.currentInput} onChange={this.handleChange.bind(this)} maxlength="255"></textarea>
           <button onClick={this.handleSubmit.bind(this)}>submit review</button>
           <button onClick={this.closeEdit.bind(this)}>cancel</button>
        </div>);
    } else {
      return (
        <div className='userReview'>
          <div className='review'>your review:<button className='editReviewButton' onClick={this.handleEdit.bind(this)}>edit review</button></div>
          <div className='theReview'>{(this.state.userReview === '') ? 'You have not reviewed the movie yet' : this.state.userReview}</div>
          {(this.state.reviewSubmitted) ? <div className="updateMsg">review submitted</div> : ''}
        </div>);
    }
	}
}

window.ReviewComponent = ReviewComponent;
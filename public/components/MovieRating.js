class MovieRating extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ''
    };
  }

  handleSearch(event) {
    this.props.handleSearchMovie(event.target.value);
    this.setState({
      value: event.target.value
    });
  }

  render() {
    return (
      <div className='friendMovieList'>

        Movie Title: <input type ='text' 
        id='movieInput' 
        className='movieInput'
        placeholder='Insert Movie Title'
        value={this.state.value}
        onChange={this.handleSearch.bind(this)}
         />
        <button className='searchSubmitButton'>
        Get Movie</button>
        <div>
          <MovieDisplay
          movie={this.props.movie}
          />
        </div>
      </div>
    );
  }
}

window.MovieRating = MovieRating;
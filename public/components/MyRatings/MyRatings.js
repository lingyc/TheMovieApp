class MyRatings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      movies: [],
      allRatedMovies: true
    };
  }

  //show render a list of recent releases on initialize
  componentDidMount() {
    this.getAllRatedMovies();
  }

  getAllRatedMovies() {
    $.get('http://127.0.0.1:3000/getUserRatings')
    .then(userRatedMovies => {
      console.log('response from server', userRatedMovies);
      this.setState({
        movies: userRatedMovies,
        allRatedMovies: true
      });
    })
    
  }

  //////////////////////
  /////Event Handlers
  //////////////////////

  //this will call search for a movie from external API, do a database query for rating
  //and set the reponse to the movies state
  handleSearch(event) {
    if (event.charCode == 13) {
      var that = this;

      //this will search database
    $.get('http://127.0.0.1:3000/searchRatedMovie', {title: event.target.value})
    .then(searchResults => {
      console.log('response from server', searchResults);
      this.setState({
        movies: searchResults,
        allRatedMovies: false
      });
    })
    }
  }

  render() {
    var lable;
    var results;
    if (this.state.allRatedMovies === false) {
      lable = 'back to all rated movies';
      results = (this.state.movies.length === 0) ? 'results cannot be found' : 'current results:'
    } else if (this.state.allRatedMovies && this.state.movies.length === 0) {
      lable = 'you have not rated any movies';
    } else if (this.state.movies.length === 0) {

    } else {
      lable = 'all rated movies';
    }

    return (
      <div className='MyRatings'> 
        <div onClick={this.getAllRatedMovies.bind(this)}>{lable}</div>
        <div className='searchMovie'>
          <input type ='text' id='movieInput' 
            className='movieInput'
            placeholder='Insert Movie Title'
            onKeyPress={this.handleSearch.bind(this)}/>
        </div>
        <div>{results}</div>
        <MovieList movies={this.state.movies}
        change={this.props.change.bind(this)}
        />
      </div>
    )
  }
}

window.MyRatings = MyRatings;
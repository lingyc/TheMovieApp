class MyRatings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      movies: [],
      allRatedMovies: true,
      search: ''
    };
  }

  //show render a list of recent releases on initialize
  componentDidMount() {
    this.getAllRatedMovies();
  }

  handleChange(event) {
    this.setState({
      search: event.target.value
    });
  }


  getAllRatedMovies() {
    $.get(Url + '/getUserRatings')
    .then(userRatedMovies => {
      // console.log('response from server', userRatedMovies);
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
    if (event.charCode == 13 || event === 'clicked') {
      var that = this;

      //this will search database
    $.get(Url + '/searchRatedMovie', {title: this.state.search})
    .then(searchResults => {
      // console.log('response from server', searchResults);
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
      lable = 'Back To All Rated Movies';
      results = (this.state.movies.length === 0) ? (<div className="errorMsg">results cannot be found</div>) : (<div className="updateMsg">all match results:</div>)
    } else if (this.state.allRatedMovies && this.state.movies.length === 0) {
      lable = 'you have not rated any movies';
    } else {
      lable = 'All Rated Movies';
    }

    return (
      <div className='MyRatings collection'> 
        <div className='header' onClick={this.getAllRatedMovies.bind(this)}>{lable}</div>
        <div className='searchMovie'>
          <input type ='text' id='movieInput' 
            className='movieInput'
            value={this.state.search}
            placeholder='Insert Movie Title'
            onChange={this.handleChange.bind(this)}
            onKeyPress={this.handleSearch.bind(this)}/>
          <a className="waves-effect waves-light btn" onClick={() => this.handleSearch.bind(this)('clicked')}>search</a>
        </div>
        {results}
        <MovieList movies={this.state.movies}
        change={this.props.change.bind(this)}
        />
      </div>
    )
  }
}

window.MyRatings = MyRatings;
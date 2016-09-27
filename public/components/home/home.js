class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      movies: [],
      view: 'recentRelease',
      focalMovie: null,
      recentRelease: true,
      search: '',
      loading: true
    };
  }

  //should have its own change view function
  changeViews(targetState) {
    this.setState({
      view: targetState
    });
  }

  //show render a list of recent releases on initialize
  componentDidMount() {
    this.getRecentReleasesInitialize();
  }

  handleChange(event) {
    this.setState({
      search: event.target.value
    });
  }

  getRecentReleasesInitialize() {
    $.get(Url + '/recentRelease')
    .then(moviesWithRatings => {
      // console.log('response from server', moviesWithRatings);
      this.setState({
        movies: moviesWithRatings,
        recentRelease: true,
        loading: false
      });
    });
  }

  //function that takes movies from external API and query the database for ratings
  //will set the movies state after ratings are successfully retrived
  getUserRatingsForMovies(moviesFromOMDB) {
    if (moviesFromOMDB.length === 0) {
      this.setState({
        movies: [],
        recentRelease: false
      });
    } else {
      // console.log('posting to:', Url + '/getMultipleMovieRatings');
      $.post(Url + '/getMultipleMovieRatings', { movies: moviesFromOMDB })
      .done(moviesWithRatings => {
        // console.log('response from server', moviesWithRatings);
        this.setState({
          movies: moviesWithRatings,
          recentRelease: false
        });
      });
    }
  }

  //////////////////////
  /////Event Handlers
  //////////////////////

  //this will call search for a movie from external API, do a database query for rating
  //and set the reponse to the movies state
  handleSearch(event) {
    if (event.charCode === 13 || event === 'clicked') {
      var that = this;
      this.setState({loading:true});
      //this will search TMDB for movie and send it to server to retrive user ratings
      $.ajax({
        url: "https://api.themoviedb.org/3/search/movie",
        jsonp: "callback",
        dataType: "jsonp",
        data: {
            query: this.state.search,
            api_key: "9d3b035ef1cd669aed398400b17fcea2",
            format: "json",
        },
        success: function(response) {
          var sorted = _.sortBy(response.results, 'imdbRating');
          that.getUserRatingsForMovies(sorted);
          setTimeout(()=>{that.setState({loading:false})},1000)
        }
      });
    }
  }

  render() {

    var lable = 'Recent Releases';
    var feedbackMsg = '';
    if (this.state.recentRelease === false) {
      lable = 'back to recent releases';
      if (this.state.movies.length === 0) {
        feedbackMsg = (<div className="errorMsg">no match found, please try another title</div>);
      } else {
        feedbackMsg = (<div className="updatedMsg">all match results:</div>);
      }
    }
    return (
      <div className='Home collection'>
      {this.state.loading ? <div className="progress loadingBar"> <div className="indeterminate"></div> </div> : null}
        <div className='header' onClick={this.getRecentReleasesInitialize.bind(this)}>{lable}</div>
        <div className='searchMovie'>
          <input type ='text' id='movieInput' 
            className='movieInput'
            placeholder='find a movie'
            value={this.state.search}
            onChange={this.handleChange.bind(this)}
            onKeyPress={this.handleSearch.bind(this)}/>
          <a className="waves-effect waves-light btn" onClick={() => this.handleSearch.bind(this)('clicked')}>search</a>
        </div>
        {feedbackMsg}
        <MovieList movies={this.state.movies}
          change={this.props.change.bind(this)}
        />
      </div>
    );
  }
}

window.Home = Home;
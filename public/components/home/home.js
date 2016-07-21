class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      movies: [],
      view: 'recentRelease',
      focalMovie: null,
      recentRelease: true
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

  getRecentReleasesInitialize() {
    $.get('http://127.0.0.1:3000/recentRelease')
    .then(moviesWithRatings => {
      console.log('response from server', moviesWithRatings);
      this.setState({
        movies: moviesWithRatings,
        recentRelease: true
      });
    })
    
  }

  //function that takes movies from external API and query the database for ratings
  //will set the movies state after ratings are successfully retrived
  getUserRatingsForMovies(moviesFromOMDB) {
    console.log('posting to:', 'http://127.0.0.1:3000/getMultipleMovieRatings');
    $.post('http://127.0.0.1:3000/getMultipleMovieRatings', { movies: moviesFromOMDB })
    .done(moviesWithRatings => {
      console.log('response from server', moviesWithRatings);
      this.setState({
        movies: moviesWithRatings,
        recentRelease: false
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
      console.log('enter event triggered');
      var that = this;

      //this will search TMDB for movie and send it to server to retrive user ratings
      $.ajax({
        url: "http://api.themoviedb.org/3/search/movie",
        jsonp: "callback",
        dataType: "jsonp",
        data: {
            query: event.target.value,
            api_key: "9d3b035ef1cd669aed398400b17fcea2",
            format: "json"
        },
        success: function(response) {
          console.log('TMDB response', response);
          that.getUserRatingsForMovies(response.results);
        }
      });
    }
  }


  handleClick(events) {
    //handle click between movielist view and friendRating view
  }

  render() {

    // if (this.state.view === 'recentRelease') {

    // }
    var lable = 'recent releases';
    if (this.state.recentRelease === false) {
      lable = 'back to recent releases';
    }

    return (
      <div className='Home'> 
        <div onClick={this.getRecentReleasesInitialize.bind(this)}>{lable}</div>
        <div className='searchMovie'>
          <input type ='text' id='movieInput' 
            className='movieInput'
            placeholder='Insert Movie Title'
            onKeyPress={this.handleSearch.bind(this)}/>
        </div>
        <MovieList movies={this.state.movies}
        change={this.props.change.bind(this)}
        />
      </div>
    )
  }
}

window.Home = Home;
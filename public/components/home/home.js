class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      movies: [],
      view: 'recentRelease'
    };
  }

  //should have its own change view function
  changeViews(targetState) {
    this.setState({
      view: targetState
    });
  }

  //show render a list of recent releases on initialize
  componentWillMount() {
    this.getRecentReleases();
  }

  //function to retrive recent releases from external API
  getRecentReleases() {
    var options = {

    };

    this.props.getRecentReleases(options, (recentMovies) =>
      this.getUserRatingsForMovies();
    );
  }

  //function that takes movies from external API and query the database for ratings
  //will set the movies state after ratings are successfully retrived
  getUserRatingsForMovies(moviesFromOMDB) {
    $.post('http://127.0.0.1:3000/getMultipleMovieRatings', { movies: moviesFromOMDB })
    .then(moviesWithRatings => {
      this.setState({
        movies: recentMovies
      });
    })
  }

  //this will call search for a movie from external API, do a database query for rating
  //and set the reponse to the movies state
  handleSearch(event) {
    this.setState({
      value: event.target.value
    });

    var options = {
      query: event.target.value
    }

    this.props.searchMovie(options, (movie) => {
      this.getUserRatingsForMovies([movie]);
    });

  }

  render() {
    var lable = '';
    if (this.state.value === '') {
      this.getRecentReleases();
      lable = 'recent releases';
    }

    return (
      <div className='Home'> {lable}
        <div className='searchMovie'>
          <input type ='text' id='movieInput' 
            className='movieInput'
            placeholder='Insert Movie Title'
            value={this.state.value}
            onChange={this.handleSearch.bind(this)}
          />
      </div>
    )
  }

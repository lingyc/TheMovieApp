class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      movies: [],
      view: 'recentRelease',
      focalMovie: null
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
    this.getRecentReleases();
  }

  //function to retrive recent releases from external API
  getRecentReleases() {
    var options = {
    };

    var recentMovies = [{
      title: 'matrix', 
      genre: 'scify', 
      release_date: '1999', 
      poster: 'http://www.imagozone.com/var/albums/filme/The%20Matrix/The%20Matrix009.jpg?m=1292987658'
    },
    {
      title: 'starwars', 
      genre: 'scify', 
      release_date: '1989', 
      poster: 'http://i.kinja-img.com/gawker-media/image/upload/s---zKMfGT0--/c_scale,fl_progressive,q_80,w_800/19fk32sw3nt1wjpg.jpg'
    }];

    this.getUserRatingsForMovies(recentMovies);
    
    // this.props.getRecentReleases(options, (recentMovies) =>
    //   this.getUserRatingsForMovies(recentMovies);
    // );
  }

  //function that takes movies from external API and query the database for ratings
  //will set the movies state after ratings are successfully retrived
  getUserRatingsForMovies(moviesFromOMDB) {
    console.log('posting to:', 'http://127.0.0.1:3000/getMultipleMovieRatings');
    $.post('http://127.0.0.1:3000/getMultipleMovieRatings', { movies: moviesFromOMDB })
    .then(moviesWithRatings => {
      console.log('response from server', moviesWithRatings);
      this.setState({
        movies: moviesWithRatings
      });
    })
  }

  //////////////////////
  /////Event Handlers
  //////////////////////

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


  handleClick(event) {
    //handle click between movielist view and friendRating view
  }

  render() {

    // if (this.state.view === 'recentRelease') {

    // }
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
        <MovieList movies={this.state.movies}/>
      </div>
    )
  }
}

window.Home = Home;
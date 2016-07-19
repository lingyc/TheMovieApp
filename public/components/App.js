class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view:'Login',
      friendsRatings:[],
      movie: null,
      friendRequests:[]
    };
  }


  changeView(){

    this.setState({
      view:"SignUp" 
    })
  }

  logInFunction(name,password){
    var that=this;
    console.log(name,password)

    $.post('http://127.0.0.1:3000/login',{name:name,password:password}).then(function(response) {
      console.log(response==='it worked')
   
        if (response==='it worked'){
       console.log('hi')
          that.setState({
            view:'Home'
          })
        }
       console.log('this.state.view after state is set again',that.state.view)
      }).catch(function(err){console.log(err)})
    }

  enterNewUser(name,password){
    console.log(name,password);
    $.post('http://127.0.0.1:3000/signup',{name:name,password:password}).then(function() {
      console.log('success'); 

    }).catch(function(){console.log('error')})

  }

  getFriendMovieRatings() {
    var that=this;
    console.log('mooooovie');
    var movieName = document.getElementById("movieToView").value
    $.post('http://127.0.0.1:3000/getFriendRatings', { name: movieName }).then(function(response) {

      that.setState({
      view:"Home",
      friendsRatings:response
    })
    console.log('our response',that.state.friendsRatings)

    }).catch(function(err){console.log(err)});
  }

  logout() {
    var that = this;
    $.post('http://127.0.0.1:3000/logout').then(function(response) {
      console.log(response);
      that.setState({
        view:"Login",
        friendsRatings:[]
      });
    });
  }

  /////////////////////
  /////movie handlers
  /////////////////////

  // test function, server expects this: { title: 'name', genre: 'genre', poster: 'link', release_date: 'year' }
  addMovie() {
    var movieObj = {
      title: document.getElementById('addMovieInputTitle').value, 
      genre: document.getElementById('addMovieInputGenre').value, 
      poster: document.getElementById('addMovieInputPoster').value, 
      release_date: document.getElementById('addMovieInputDate').value
    };

    $.post('http://127.0.0.1:3000/addmovie', movieObj)
    .then(function(response) {
      console.log('success'); 
    })
    .catch(function(err){
      console.log('error')
    })
  }

  // test function, server expects this: { username: 'name', title: 'name', genre: 'genre', poster: 'link', release_date: 'year' , rating: rating}
  rateMovie() {
    var ratingObj = {
      //need to store username in states
      username: 'ling',
      title: document.getElementById('addMovieInputTitle').value, 
      genre: document.getElementById('addMovieInputGenre').value, 
      poster: document.getElementById('addMovieInputPoster').value, 
      release_date: document.getElementById('addMovieInputDate').value,
      rating: document.getElementById('ratingScore').value
    };

    $.post('http://127.0.0.1:3000/ratemovie', ratingObj)
    .then(function(response) {
      console.log('success'); 
    })
    .catch(function(err){
      console.log('error');
    })
  }


  /////////////////////
  /////movie render
  /////////////////////
  //call searchmovie function
  //which gets passed down to the Movie Search 
  getMovie(query) {
    var options = {
      query: query
    };
    
    this.props.searchMovie(options, (movie) => {
      console.log(movie);
      this.setState({
        view:"MovieSearchView",
        movie: movie
      })
    })
  }
  //show the movie searched in friend movie list
  //onto the stateview of moviesearchview
  showMovie(movie) {
    this.setState({
      movie: movie
    })
  }
  /////////////////////
  /////Nav change
  /////////////////////
  changeViews(targetState) {
    this.setState({
      view: targetState
    });
  }

sendRequest(){
  var person=document.getElementById('findFriendByName').value;
if (person.length===0){
$("#enterRealFriend").fadeIn(1000);
$("#enterRealFriend").fadeOut(1000);
} else {

$.post('http://127.0.0.1:3000/sendRequest',{name:person},function(a,b){
  console.log('a','b');
});
var person = document.getElementById('findFriendByName').value = '';

 }


}


listPotentials() {
  console.log('this should list potential friends')
}

  render() {
    if (this.state.view==='Login') {
      return ( < div > <h2 id='loginHeader'>Login</h2> <br/>
        < LogIn 
          ourFunction={this.changeView.bind(this)}
          logInFunction={this.logInFunction.bind(this)}
         / >  </div> );
    } else if (this.state.view==="SignUp"){
      return ( < div ><h2>Signup</h2> <br/>
        < SignUp enterUser={this.enterNewUser.bind(this)} onClick={this.changeViews.bind(this)}/ >
        < /div>
      );
    } else if (this.state.view==="Home"){
      return ( 
        <div>
          <div> <h2>Welcome home, [insert name here based off of state]!</h2><br/>
            <Nav 
            onClick={this.changeViews.bind(this)}
            logout={this.logout.bind(this)} />
          </div>
          <FriendRatingList 
            getFriendMovieRatings={this.getFriendMovieRatings.bind(this)} 
            friendRatings={this.state.friendsRatings} />
        </div>
      );
    } 
    //this view is added for testing the addMovie and rateMovie backend functionality
    else if (this.state.view === "Home2"){
      return (
        <div>
          <div><Nav 
          onClick={this.changeViews.bind(this)}
          logout={this.logout.bind(this)}/></div>
          <AddMovie addMovie={this.addMovie.bind(this)} rateMovie={this.rateMovie.bind(this)}/>
        </div>
      );
    }
    //this view is added for moviesearch rendering
    else if (this.state.view === "MovieSearchView") {
      return ( 
        <div> 
          <div>
            <Nav 
            onClick={this.changeViews.bind(this)}
            logout={this.logout.bind(this)} 
            />
          </div>
          <div>
          <MovieRating 
            handleSearchMovie={this.getMovie.bind(this)} 
            movie={this.state.movie}
            />
          </div>
        </div>
      );
    } else if (this.state.view === "Inbox" ){

      return (
        <div><div><Nav 
          onClick={this.changeViews.bind(this)}
          logout={this.logout.bind(this)}/></div>
        <Inbox logout={this.logout.bind(this)} />
        </div>

        )
    } else if (this.state.view === "Friends" ){

      return (
        <div><div><Nav 
          onClick={this.changeViews.bind(this)}
          logout={this.logout.bind(this)}/></div>
        <Friends listPotentials={this.listPotentials.bind(this)} logout={this.logout.bind(this)} sendRequest={this.sendRequest.bind(this)}/>
        </div>

        )
    }
  }
}

window.App = App;

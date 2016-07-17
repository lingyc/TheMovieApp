class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    view:'Login',
    friendsRatings:[]

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
  
  // server expects this: { moviename: 'name', genre: 'genre', poster: 'link', release_date: 'year' }
  addMovie(moviename, genre, posterURL, release_date) {
    $.post('http://127.0.0.1:3000/signup',
      {
        moviename: movieName, 
        genre: genre, 
        poster: posterURL, 
        release_date: release_date
      })
    .then(function(response) {
      console.log('success'); 
    })
    .catch(function(err){
      console.log('error')
    })
  }

  render() {
    if (this.state.view==='Login') {
      return ( < div >
        < LogIn 
          ourFunction={this.changeView.bind(this)}
          logInFunction={this.logInFunction.bind(this)}
         / >  </div> );
    } else if (this.state.view==="SignUp"){
      return ( < div >
        < SignUp enterUser={this.enterNewUser.bind(this)}/ >
        < /div>
      );
    } else if (this.state.view==="Home"){
      return ( < div >
        <div><Nav logout={this.logout.bind(this)} /></div>
       <FriendRatingList getFriendMovieRatings={this.getFriendMovieRatings.bind(this)} friendRatings={this.state.friendsRatings}/>
        < /div>
      );

    }
  }
}

window.App = App;

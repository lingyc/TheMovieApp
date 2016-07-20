class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view:'Home',
      friendsRatings:[],
      movie: null,
      friendRequests:[],
      pendingFriendRequests:[]
    };
  }

acceptFriend(){
  console.log('friend should be accepted')
}
declineFriend(){
  console.log('friend should be declined')
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

listPendingFriendRequests(){
  var that=this;
console.log('this should list friend reqs')
$.post('http://127.0.0.1:3000/listRequests',function(response,error){
  that.setState(
  {
    pendingFriendRequests:response
  })
 var result= that.state.pendingFriendRequests.map(function(a){return a.requestor})
 console.log(result)

});
};




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
      return ( < div ><h2 id='loginHeader'>SignUp</h2> <br/>
        < SignUp enterUser={this.enterNewUser.bind(this)} onClick={this.changeViews.bind(this)}/ >
        < /div>
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
          logout={this.logout.bind(this)}
                    />


          </div>
        <Inbox logout={this.logout.bind(this)}  accept= {this.acceptFriend.bind(this)} decline={this.declineFriend.bind(this)} listRequests={this.listPendingFriendRequests.bind(this)} 
        pplWhoWantToBeFriends={this.state.pendingFriendRequests.map(function(a){return a.requestor})} />
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
    else if (this.state.view === "Home"){
      return (
        <div>
          <div><Nav onClick={this.changeViews.bind(this)}logout={this.logout.bind(this)}/></div>
          <Home/>
        </div>
      );
    }
  }
}

window.App = App;

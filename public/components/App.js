class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view:'Home',
      friendsRatings:[],
      movie: null,
      friendRequests:[],
      pendingFriendRequests:[],
      myFriends:['krishan','justin'],
      friendToFocusOn:'',
      individualFriendsMovies:[],
      potentialMovieBuddies:['barack','obama']
    };
  }

getCurrentFriends(){
  var that=this;
console.log('testinggg')
  $.post('http://127.0.0.1:3000/getFriends',{test:'info'},function(a,b){
that.setState({
  myFriends:a
})
  })
}



acceptFriend(a){
var final=a;

console.log(final +'should be accepted')


$.post('http://127.0.0.1:3000/accept',{personToAccept:final},function(a,b){
  console.log(a,b)
})



}

declineFriend(a){
var final=a;

$.post('http://127.0.0.1:3000/decline',{personToDecline:final},function(a,b){
  console.log(a,b)
})

}

findMovieBuddies(){

var that=this;
$.post('http://127.0.0.1:3000/findMovieBuddies',{dummy:'info'},function(a,b){
console.log(a,b)

  that.setState({
      view:"FNMB",
      potentialMovieBuddies:a 
    })




})
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


buddyRequest(a){
  console.log('callingbuddy')
  console.log(a);
$.post('http://127.0.0.1:3000/sendRequest',{name:a},function(a,b){
  console.log('a','b');
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

focusOnFriend(){
var that=this
 $('.individual').on('click',function(){
var test=$(this).html();
console.log(test)
that.setState({
  view:'singleFriend',
  friendToFocusOn:test
})

$.post('http://127.0.0.1:3000/getThisFriendsMovies',{specificFriend:test},function(a,b){
console.log(a,b);
that.setState({
  individualFriendsMovies:a
})
})



})



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
            <Nav find={this.findMovieBuddies.bind(this)}
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
        <div><div><Nav  find={this.findMovieBuddies.bind(this)}
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
        <div><div><Nav find={this.findMovieBuddies.bind(this)}
          onClick={this.changeViews.bind(this)}
          logout={this.logout.bind(this)}/></div>
        <Friends fof= {this.focusOnFriend.bind(this)} getFriends={this.getCurrentFriends.bind(this)} myFriends={this.state.myFriends} 
        listPotentials={this.listPotentials.bind(this)} logout={this.logout.bind(this)} sendRequest={this.sendRequest.bind(this)}/>
        </div>

      )
    }
    else if (this.state.view === "Home"){
      return (
        <div>
          <div><Nav find={this.findMovieBuddies.bind(this)} onClick={this.changeViews.bind(this)}logout={this.logout.bind(this)}/></div>
          <Home/>
        </div>
      );
    } else if (this.state.view==='singleFriend'){
      return (
        <div>

     <SingleFriend moviesOfFriend={this.state.individualFriendsMovies} friendName={this.state.friendToFocusOn} onClick={this.changeViews.bind(this)}/>

        </div>

        )
    } else if (this.state.view === "FNMB"){
return (
        <div>
       <div><Nav find={this.findMovieBuddies.bind(this)} onClick={this.changeViews.bind(this)}logout={this.logout.bind(this)}/></div>
     <FindMovieBuddy buddyfunc={this.buddyRequest.bind(this)} buddies={this.state.potentialMovieBuddies} />

        </div>

        )

    }
  }
}

window.App = App;

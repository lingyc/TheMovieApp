class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view:'Login',
      friendsRatings:[],
      movie: null,
      friendRequests:[],
      pendingFriendRequests:[],
      myFriends:[],
      friendToFocusOn:'',
      individualFriendsMovies:[],
      potentialMovieBuddies:{},
      username: null,
      requestResponses:[],
      currentUser:null,
      requestsOfCurrentUser:[]
    };
  }

  getCurrentFriends() {
    var that=this;
    console.log('testinggg')
    $.post(Url + '/getFriends',{test:'info'},function(a,b) {
      console.log('what you get back from server for get friends',a,b);
             for (var i=0;i<a.length;i++){
                if (a[i][1]===null){
                  a[i][1] = "No comparison to be made";
                }              
              }

       var final= a.sort(function(a,b){return b[1]-a[1]});
      that.setState({
        myFriends:final
      })
      console.log('thes are my friends!!!!!!!!!!!!!!!!!',that.state.myFriends)
    })
  }

  acceptFriend(a, movie) {
    var that=this;
    var final=a;
    // $('button').on('click',function() {
    //   console.log($(this).html());
    // })
    // console.log(final +'should be accepted, for movie....', movie)

    $.post(Url + '/accept',{personToAccept:final, movie: movie},function(a,b) {
      that.listPendingFriendRequests();
    })
    
    console.log('refreshed inbox, should delete friend request on the spot instead of moving')
  }

  declineFriend(a, movie) {
    var that=this;
    var final=a;

    $.post(Url + '/decline',{personToDecline:final, movie: movie},function(a,b) {
      console.log(a,b)
      console.log('this is the state after declining friend, ', that.state);
      that.listPendingFriendRequests();
    })
  }

  findMovieBuddies() {
    var that=this;
    $.post(Url + '/findMovieBuddies',{dummy:'info'},function(a,b) {
      var final=a.sort(function(a,b){return b[1]-a[1]})
      var myFriends=that.state.myFriends
       var realFinal=[]
        for (var i=0;i<final.length;i++){
          var unique=true
          for (var x=0;x<myFriends.length;x++){
            if (final[i][0]===myFriends[x][0]){
              unique=false;
            }
          }
          if (unique){
            realFinal.push(final[i])
          }
        }



      that.setState({
        view:"FNMB",
        potentialMovieBuddies:realFinal
      })
      console.log(that.state.myFriends,that.state.potentialMovieBuddies);

    })
  }

  changeView() {
    this.setState({
      view:"SignUp" 
    })
  }

  setCurrentUser(username) {
    console.log('calling setCurrentUser');
    this.setState({
      currentUser: username
    })
  }

  enterNewUser(name,password) {
    console.log(name,password);
    $.post(Url + '/signup',{name:name,password:password}).then(function() {
      console.log('success'); 
      this.setState({username: name, view: "Home"})
    }).catch(function() {console.log('error')})
  }

  getFriendMovieRatings() {
    var that=this;
    console.log('mooooovie');
    var movieName = document.getElementById("movieToView").value
    $.post(Url + '/getFriendRatings', { name: movieName }).then(function(response) {

      that.setState({
      view:"Home",
      friendsRatings:response
    })
    console.log('our response',that.state.friendsRatings)

    }).catch(function(err) {console.log(err)});
  }

  logout() {
    var that = this;
    $.post(Url + '/logout').then(function(response) {
      console.log(response);
      that.setState({
        view:"Login",
        friendsRatings:[]
      });
    });
  }

  sendWatchRequest(friend) {
    var movie= document.getElementById('movieToWatch').value;
    var toSend={requestee:friend, movie:movie};
    if (movie.length>0) {
      $.post(Url + '/sendWatchRequest', toSend ,function(a,b) {
        console.log(a,b);
      });
      document.getElementById('movieToWatch').value='';
    } else {
      console.log('you need to enter a movie to send a watch request!!!!')
    }
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
    console.log(this.state);
    var that=this;

    if (targetState==='Friends'){
      console.log('you switched to friends!!')
      this.getCurrentFriends()
      this.sendRequest();

      
    }

   
    if (targetState==='Home'){
      this.getCurrentFriends()
      this.sendRequest();
      
    }



     if (targetState==="Inbox"){
       this.listPendingFriendRequests()
     }

    this.setState({
      view: targetState
    });
  }

  changeViewsMovie(targetState, movie) {
    this.setState({
      view: targetState,
      movie: movie
    });
  }

  changeViewsFriends(targetState, friend) {
    this.setState({
      view: targetState,
      friendToFocusOn: friend
    });
  }


  buddyRequest(a) {
    this.sendRequest(a);
  }


  sendRequest(a) {
console.log('send request is being run!!')
    var that=this;
    if (document.getElementById('findFriendByName')!==null){
      var person=document.getElementById('findFriendByName').value
    } else {
      var person = a || 'test';
    }
    console.log('person:',person)
    console.log('state', this.state);
    console.log('line 248',this.state.myFriends)
    var friends1=[];
    var friends2=[]
    for (var i=0;i<this.state.myFriends.length;i++){
      console.log('line 251',this.state.myFriends[i])
      friends1.push(this.state.myFriends[i][0]);
      friends2.push(this.state.myFriends[i][0])
    }

    for (var i=0;i<this.state.requestsOfCurrentUser.length;i++){
      friends1.push(this.state.requestsOfCurrentUser[i])
    }

    console.log('this should also be my friends',this.state.myFriends,friends1,friends2)


    var pplYouCantSendTo=friends1;
    console.log('tof',friends1.indexOf(person)!== -1, friends1.length!==0)
    if (friends1.indexOf(person)!== -1 && friends1.length!==0){
      $("#AlreadyReq").fadeIn(1000);
      $("#AlreadyReq").fadeOut(1000);
      console.log('this person is already in there!!')
    } else if (person.length===0) {
      $("#enterRealFriend").fadeIn(1000);
      $("#enterRealFriend").fadeOut(1000);
    } else {


      $.post(Url + '/sendRequest',{name:person},function(a,b) {
       
          that.setState({
            requestsOfCurrentUser:a.concat([person])
          })
          console.log('line 281',that.state.requestsOfCurrentUser);

        $("#reqSent").fadeIn(1000);
        $("#reqSent").fadeOut(1000);
      });
      if ( document.getElementById('findFriendByName')!==null){
        document.getElementById('findFriendByName').value = '';
      }
    }
  }

  listPendingFriendRequests() {
    var that=this;
    console.log('this should list friend reqs')
    $.post(Url + '/listRequests',function(response,error) {
      console.log('Response I get!!!!!!!',response);
      var top=[]
      var bottom=[]
      console.log('tr', response)
      for (var i=0;i<response[0].length;i++){
        if (response[0][i]['requestor']!==response[1] && response[0][i]['response']===null ){
          top.push(response[0][i]);
        }
        if (response[0][i]['requestor']===response[1] &&response[0][i]['response']!==null && response[0][i]['requestee']!=='test'){
          bottom.push(response[0][i]);
        }
      }

      that.setState({
        pendingFriendRequests:top,
        requestResponses:bottom
      })
    });
  };

  focusOnFriend(friend) {
    var that = this;
    $('.friendEntryIndividual').on('click', function(event) {
      event.preventDefault();
      var friendName = $(this).html();

      that.setState({
        view:'singleFriend',
        friendToFocusOn: friend
      });

      $.get(Url + '/getFriendUserRatings',{friendName: friend},function(response) {
        console.log(friend)
        console.log('getting friend movies:', response);
        that.setState({
          individualFriendsMovies: response
        });

      });
      return false;
    });
  }

  listPotentials() {
    console.log('this should list potential friends')
  }

  removeRequest(person, self, movie) {
    var that= this;
    $.ajax({
      url: Url + '/removeRequest',
      type: 'DELETE',
      data: {
        requestor: self,
        requestee: person,
        movie: movie
      },
      success: function(response) {
        console.log('REQUEST REMOVED! Movie is: ', movie);
        that.listPendingFriendRequests();
      },
      error: function(error) {
        console.log(error);
      }
    });
  }

  render() {
    if (this.state.view==='Login') {
      return (<LogIn changeViews={this.changeViews.bind(this)} setCurrentUser={this.setCurrentUser.bind(this)}/>);
    } else if (this.state.view==="SignUp") {
      return (<SignUp changeViews={this.changeViews.bind(this)} setCurrentUser={this.setCurrentUser.bind(this)} />);
    } 
    //this view is added for moviesearch rendering
    else if (this.state.view === "MovieSearchView") {
      return ( 
        <div> 
          <div>
            <Nav name={this.state.currentUser}
            find={this.findMovieBuddies.bind(this)}
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
    } else if (this.state.view === "Inbox" ) {
      return (
        <div>
            <Nav name={this.state.currentUser}
              find={this.findMovieBuddies.bind(this)}
              onClick={this.changeViews.bind(this)}
              logout={this.logout.bind(this)}
              Home={true}
            />
            <Inbox 
              requests={this.state.pendingFriendRequests}
              responsesAnswered={this.state.requestResponses}
              logout={this.logout.bind(this)}  
              accept= {this.acceptFriend.bind(this)} 
              decline={this.declineFriend.bind(this)} 
              listRequests={this.listPendingFriendRequests.bind(this)} 
              pplWhoWantToBeFriends={this.state.pendingFriendRequests.map(
                function(a){return [a.requestor,a.requestTyp,a.movie===null?"": a.movie,"Message:"+ a.message==='null'?"none":a.message]})} 
              remove={this.removeRequest.bind(this)}
            />
        </div>
      );
    } else if (this.state.view === "Friends" ) {
      return (
        <div>
            <Nav name={this.state.currentUser}
              find={this.findMovieBuddies.bind(this)}
              onClick={this.changeViews.bind(this)}
              logout={this.logout.bind(this)}/>
          <Friends 
            sendWatchRequest={this.sendWatchRequest.bind(this)} 
            fof= {this.focusOnFriend.bind(this)} 
            getFriends={this.getCurrentFriends.bind(this)} 
            myFriends={this.state.myFriends} 
            listPotentials={this.listPotentials.bind(this)} 
            logout={this.logout.bind(this)}  
            sendRequest={this.sendRequest.bind(this)}
          />
        </div>
      );
    }
    else if (this.state.view === "Home") {
      return (
        <div>
            <Nav name={this.state.currentUser}
              find={this.findMovieBuddies.bind(this)} 
              onClick={this.changeViews.bind(this)}
              logout={this.logout.bind(this)}
            />
          <Home 
            change={this.changeViewsMovie.bind(this)}
          />
        </div>
      );
    } else if (this.state.view === "SingleMovie") {
      let that = this;
      return (
        <div onClick={()=>console.log(that.state)}>
            <Nav name={this.state.currentUser}
              onClick={this.changeViews.bind(this)}
              logout={this.logout.bind(this)}
            />
          <SingleMovieRating 
            compatibility={this.state.myFriends}
            currentMovie={this.state.movie}
            change={this.changeViewsFriends.bind(this)}
            fof={this.focusOnFriend.bind(this)}
          />
        </div>
      );
    } else if (this.state.view==='singleFriend') {
      return (
        <div>
            <Nav name={this.state.currentUser}
              find={this.findMovieBuddies.bind(this)} 
              onClick={this.changeViews.bind(this)}
              logout={this.logout.bind(this)}
            />
          <SingleFriend 
            moviesOfFriend={this.state.individualFriendsMovies} 
            friendName={this.state.friendToFocusOn} 
            onClick={this.changeViews.bind(this)}
            change={this.changeViewsMovie.bind(this)}
          />
        </div>
      );
    } else if (this.state.view === "FNMB") {
      return (
        <div>
            <Nav name={this.state.currentUser}
              find={this.findMovieBuddies.bind(this)} 
              onClick={this.changeViews.bind(this)}
              logout={this.logout.bind(this)}
            />
          <FindMovieBuddy 
            buddyfunc={this.buddyRequest.bind(this)} 
            buddies={this.state.potentialMovieBuddies} 
          />
        </div>
      );
    } else if (this.state.view === "MyRatings") {
      return (
        <div>
            <Nav name={this.state.currentUser}
              find={this.findMovieBuddies.bind(this)} 
              onClick={this.changeViews.bind(this)}
              logout={this.logout.bind(this)}
            />
          <MyRatings 
            change={this.changeViewsMovie.bind(this)}
          />
        </div>
      );
    }
  }
}

window.App = App;
var Url = 'https://thawing-island-99747.herokuapp.com';
// var Url = 'http://127.0.0.1:3000';
window.Url = Url;

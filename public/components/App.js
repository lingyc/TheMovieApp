class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'Login',
      friendsRatings: [],
      movie: null,
      friendRequests: [],
      pendingFriendRequests: [],
      myFriends: [],
      friendToFocusOn: '',
      individualFriendsMovies: [],
      potentialMovieBuddies: {},
      username: null,
      requestResponses: [],
      currentUser: null,
      requestsOfCurrentUser: []
    };
  }

  getCurrentFriends() {

    console.log('testinggg');
    $.post(Url + '/getFriends',{test:'info'}, (a, b) => {
      console.log('what you get back from server for get friends',a,b);
             for (let i=0;i<a.length;i++){
                if (a[i][1]===null){
                  a[i][1] = "No comparison to be made";
                }              
              }

       const final= a.sort(function(a,b){return b[1]-a[1]});
      this.setState({
        myFriends:final
      })
      console.log('thes are my friends!!!!!!!!!!!!!!!!!',this.state.myFriends)
    })
  }

  acceptFriend(personToAccept, movie) {
    // $('button').on('click',function() {
    //   console.log($(this).html());
    // })
    // console.log(final +'should be accepted, for movie....', movie)

    $.post(Url + '/accept',{personToAccept:personToAccept, movie: movie},(resp,err)=> {
      this.listPendingFriendRequests();
    })
    
    console.log('refreshed inbox, should delete friend request on the spot instead of moving')
  }

  declineFriend(personToDecline, movie) {
    $.post(Url + '/decline',{personToDecline:personToDecline, movie: movie},(resp, err)=> {
      console.log('this is the state after declining friend, ', this.state);
      this.listPendingFriendRequests();
    });
  }

  findMovieBuddies() {
   
    $.post(Url + '/findMovieBuddies',{dummy:'info'},(resp, err)=> {
      const sorted=resp.sort(function(a,b){return b[1]-a[1]});
      const myFriends=this.state.myFriends;
       const uniqueFriends=[];
        for (let i=0;i<sorted.length;i++){
          let unique=true;
          for (let x=0;x<myFriends.length;x++){
            if (sorted[i][0]===myFriends[x][0]){
              unique=false;
            }
          }
          if (unique){
            uniqueFriends.push(sorted[i])
          }
        }

      this.setState({
        view:"FNMB",
        potentialMovieBuddies:uniqueFriends
      })

      console.log(this.state.myFriends,this.state.potentialMovieBuddies);

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
    $.post(Url + '/signup',{name:name,password:password}).then(()=> {
      console.log('success'); 
      this.setState({username: name, view: "Home"})
    }).catch(()=> {console.log('error')})
  }

  getFriendMovieRatings() {
    let movieName = document.getElementById("movieToView").value
    $.post(Url + '/getFriendRatings', { name: movieName }).then(response=> {
      this.setState({
      view:"Home",
      friendsRatings:response
    })
    console.log('our response',this.state.friendsRatings)
    }).catch(err=> {console.log(err)});
  }




  logout() {
    $.post(Url + '/logout').then(response=> {
      console.log(response);
      this.setState({
        view:"Login",
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
      });
    });
  }

  sendWatchRequest(friend) {
    const movie= document.getElementById('movieToWatch').value;
    const toSend={requestee:friend, movie:movie};
    if (movie.length) {
      $.post(Url + '/sendWatchRequest', toSend, (resp, err)=> {
        console.log(resp, err);
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
    const options = {
      query: query
    };
    
    this.props.searchMovie(options, movie => {
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

    if (targetState==='Friends'){
      console.log('you switched to friends!!')
      this.getCurrentFriends()
      this.sendRequest();
    }

    if (targetState==='Home'){
      // this.getCurrentFriends()
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


  buddyRequest(person) {
    this.sendRequest(person);
  }


  sendRequest(a) {
console.log('send request is being run!!')

    if (document.getElementById('findFriendByName')!==null){
      var person=document.getElementById('findFriendByName').value
    } else {
      var person = a || 'test';
    }
    const currFriends=this.state.myFriends;
    const friends1=[];
    const friends2=[]
    for (var i=0;i<currFriends.length;i++){
      console.log('line 251',currFriends[i])
      friends1.push(currFriends[i][0]);
      friends2.push(currFriends[i][0])
    }

    for (var i=0;i<this.state.requestsOfCurrentUser.length;i++){
      friends1.push(this.state.requestsOfCurrentUser[i])
    }

    console.log('this should also be my friends',person, currFriends,friends1,friends2)

    //console.log('tof',friends1.indexOf(person)!== -1, friends1.length!==0)
    if (friends1.indexOf(person)!== -1 && friends1.length!==0){
      $("#AlreadyReq").fadeIn(1000);
      $("#AlreadyReq").fadeOut(1000);
      console.log('this person is already in there!!')
    } else if (!person.length) {
      $("#enterRealFriend").fadeIn(1000);
      $("#enterRealFriend").fadeOut(1000);
    } else {

console.log('person is defined?',person);
      $.post(Url + '/sendRequest',{name:person}, (resp, err)=> {
       
          this.setState({
            requestsOfCurrentUser:resp.concat([person])
          })
          // console.log('line 281',this.state.requestsOfCurrentUser);

        $("#reqSent").fadeIn(1000);
        $("#reqSent").fadeOut(1000);
      });
      if ( document.getElementById('findFriendByName')!==null){
        document.getElementById('findFriendByName').value = '';
      }
    }
  }

  listPendingFriendRequests() {
    console.log('this should list friend reqs')
    $.post(Url + '/listRequests', (response, error)=> {
      const pFR=[];
      const rR=[];
      console.log('response to lpfr', response);

      for (var i=0;i<response[0].length;i++){
        const requestor=response[0][i]['requestor'];
        const responseTU= response[0][i]['response'];
        if (requestor!==response[1] && responseTU===null ){
          pFR.push(response[0][i]);
        }
        if (requestor===response[1] &&responseTU!==null && response[0][i]['requestee']!=='test'){
          rR.push(response[0][i]);
        }
      }

      this.setState({
        pendingFriendRequests:pFR,
        requestResponses:rR
      })
    });
  };

  focusOnFriend(friend) {
    
      this.setState({
        view:'singleFriend',
        friendToFocusOn: friend
      });

      $.get(Url + '/getFriendUserRatings',{friendName: friend}, response=> {
        this.setState({
          individualFriendsMovies: response
        });

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
var Url = 'https://reelmates.herokuapp.com';
// var Url = 'http://127.0.0.1:3000';
window.Url = Url;
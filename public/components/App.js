class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    view:'Login'

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
    }).catch(function(){console.log('error')})
}

  enterNewUser(name,password){
    console.log(name,password);
    $.post('http://127.0.0.1:3000/signup',{name:name,password:password}).then(function() {
      console.log('success'); 

    }).catch(function(){console.log('error')})

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
        Youre Home!!!
        < /div>
      );

    }
  }
}

window.App = App;

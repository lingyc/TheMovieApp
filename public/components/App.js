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

console.log(name,password)

  $.post('http://127.0.0.1:3000/login',{name:name,password:password}).then(function() {
      console.log('success');
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
    } else {
      return ( < div >
        < SignUp enterUser={this.enterNewUser.bind(this)}/ >
        < /div>
      );
    }
  }
}

window.App = App;

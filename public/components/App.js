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


  enterNewUser(name,password){
    console.log(name,password);
    $.post('http://127.0.0.1:3000',{name:name,password:password},function(data,err){
      console.log(data)
    })

  }

  render() {
    if (this.state.view==='Login') {
      return ( < div >
        < LogIn ourFunction={this.changeView.bind(this)} / >  </div> );
    } else {
      return ( < div >
        < SignUp enterUser={this.enterNewUser.bind(this)}/ >
        < /div>
      );
    }
  }
}

window.App = App;

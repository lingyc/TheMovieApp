class LogIn extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      errorMsg: ''
    };
  }

  handleChange(event) {
    if (event.target.name === 'LogInName') {
      this.setState({
        username: event.target.value
      });
    } else {
      this.setState({
        password: event.target.value
      });
    }
  }

  handleLogIn() {
    if (this.state.username.length === 0 && this.state.password.length === 0) {
      this.setState({
        errorMsg: 'login is empty'
      });
    } else if (this.state.username.length === 0) {
      this.setState({
        errorMsg: 'please enter a username'
      });
    } else if (this.state.password.length === 0) {
      this.setState({
        errorMsg: 'please enter a password'
      });
    } else {
      var userObj = { 
        name: this.state.username,
        password: this.state.password
      };

      var that = this;

      $.post('http://127.0.0.1:3000/login', userObj)
      .then(function(response) {
        if (response[0] === 'it worked') {
          console.log('hi');
          
          that.setState({
            errorMsg: ''
          });

          that.props.changeViews('Home');
          that.props.logInFunction(response[1]);
        }
         console.log('this.state.view after state is set again',that.state.view);
      })
      .catch(function(err) {
        console.log(err);
        that.setState({
          errorMsg: 'invalid login information'
        });
      })
    }
  }


  render() {
    return (<div><h2 id='loginHeader'>Login</h2><br/>
      <div id='logInStyling'>
        <p id='loginFields'>Name</p>
        <input type='text' id='LogInName' name='LogInName' placeholder='username' onChange={this.handleChange.bind(this)}/> <br/>
        <p id='loginFields'>Password</p>
        <input type='password' id ='LogInPassword' name='LogInPassword' placeholder='password' onChange={this.handleChange.bind(this)}/> <br/>
        <div id='buttons'> 
          <div className="errorMsg">{this.state.errorMsg}</div>
          <button onClick={this.handleLogIn.bind(this)}> 
            Log In!
          </button> 
          <button onClick={() => this.props.changeViews('SignUp')}> Go to Sign Up </button>
        </div>
      </div>
    </div>)
  }
}

window.LogIn = LogIn;


// var LogIn = (props) => (

//   < div id='logInStyling' >
//   <p id='loginFields'>Name</p> < input type = 'text'
//   id = 'LogInName'
//   name = 'LogInName' / > < br / >
//   <p id='loginFields'>Password</p> < input type = 'text'
//   id = 'LogInPassword'
//   name = 'LogInPassword' / > < br / >
//   <div id='buttons'> < button onClick={function(){props.logInFunction(document.getElementById('LogInName').value, document.getElementById('LogInPassword').value)}}> 
//   Log In! < /button> < button onClick={props.ourFunction}> Sign Up Instead < /button ></div>
//   < /div>

// )

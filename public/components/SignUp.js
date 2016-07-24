class SignUp extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      errorMsg: '',
      successMsg: ''
    };
  }

  handleChange(event) {
    if (event.target.name === 'SignUpName') {
      this.setState({
        username: event.target.value
      });
    } else if (event.target.name === 'SignUpPassword') {
      this.setState({
        password: event.target.value
      });
    } else if (event.target.name === 'SignUpFirstname') {
      this.setState({
        firstName: event.target.value
      });
    } else if (event.target.name === 'SignUpLastname') {
      this.setState({
        lastName: event.target.value
      });
    }
  }

  enterNewUser() {
    if (this.state.username.length === 0) {
      this.setState({
        errorMsg: 'please enter a username'
      });
    } else if (this.state.password.length === 0) {
      this.setState({
        errorMsg: 'please enter a password'
      });
    } else if (this.state.firstName.length === 0) {
      this.setState({
        errorMsg: 'please enter your first name'
      });
    } else if (this.state.lastName.length === 0) {
      this.setState({
        errorMsg: 'please enter your last name'
      });
    } else {
      var userObj = { 
        name: this.state.username,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName
      };

      var that = this;

      $.post('http://127.0.0.1:3000/signup', userObj)
      .then(function(reponse) {
        //after signup should prompt user to select their favorite three movies
        that.setState({
          errorMsg: '',
          successMsg: 'new login created'
        });

        that.props.setCurrentUser(that.state.username);
        that.props.onClick("Home");
      })
      .catch(function(err) {
        console.log(err);
        that.setState({
          errorMsg: 'username already exist, please use a different username'
        });
      })
    }
  }

  render() {
    let that = this;
    return (
    <div className='signUpForm'>
      <h2 id='loginHeader'>SignUp</h2><br/>
      <p id='loginFields'>Name</p>  
      <input type = 'text' id='SignUpName' autocomplete="off" placeholder='enter a username' name='SignUpName' onChange={this.handleChange.bind(this)}/><br/>
      <p id='loginFields'>Password</p> 
      <input type = 'password' id='SignUpName' autocomplete="off" placeholder='enter a password' name='SignUpPassword' onChange={this.handleChange.bind(this)}/><br/> 
      <p id='loginFields'>First Name</p> 
      <input type = 'text' id='SignUpName' autocomplete="off" placeholder='enter your first name' name='SignUpFirstname' onChange={this.handleChange.bind(this)}/><br/> 
      <p id='loginFields'>Last Name</p> 
      <input type = 'text' id='SignUpName' autocomplete="off" placeholder='enter your last name' name='SignUpLastname' onChange={this.handleChange.bind(this)}/><br/> 
      <div id='buttons'>
        <div className="errorMsg">{this.state.errorMsg}</div>
        <button onClick = {this.enterNewUser.bind(this)}> Sign Up! </button>
        <button onClick={() => (this.props.onClick("Login"))}> Log In Instead
        </button>
      </div> 
    </div>)
  }

}

window.SignUp = SignUp;
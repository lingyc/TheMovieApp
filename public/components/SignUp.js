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
    <div className='landing'>
      <div className='login'>
        <a className="waves-effect waves-light btn" onClick={() => this.props.changeViews('Login')}>Go to Log In</a>
        <div className="or">---------- OR -----------</div>
        <div className='loginForm'>
          <div className="input-field col s6">
            <input placeholder="username" id="user_name" name='SignUpName' type="text" className="validate" onChange={this.handleChange.bind(this)}/>
            <label for="user_name" className="active">Username</label>
          </div>

          <div className="input-field col s6">
            <input placeholder="password" id="password" name='SignUpPassword' type="password" className="validate" onChange={this.handleChange.bind(this)}/>
            <label for="password" className="active">Password</label>
          </div>

          <div className="input-field col s6">
            <input placeholder="first name" id="first_name" name='SignUpFirstname' type="text" className="validate" onChange={this.handleChange.bind(this)}/>
            <label for="first_name" className="active">first name</label>
          </div>

          <div className="input-field col s6">
            <input placeholder="last name" id="last_name" name='SignUpLastname' type="text" className="validate" onChange={this.handleChange.bind(this)}/>
            <label for="last_name" className="active">last name</label>
          </div>

          <div className="errorMsg">{this.state.errorMsg}</div>
          <a className="waves-effect waves-light btn" onClick={this.enterNewUser.bind(this)}>Sign Up!</a>
        </div>
      </div>
    </div>)
  }

}

window.SignUp = SignUp;
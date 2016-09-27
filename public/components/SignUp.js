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
    const tar = event.target.value;
    switch (event.target.name){
      case 'SignUpName':
      this.setState({
        username: tar
      });
      break;
       case 'SignUpPassword':
      this.setState({
        password: tar
      });
      break;
       case 'SignUpFirstname':
      this.setState({
        firstName: tar
      });
      break;
       case 'SignUpLastname':
      this.setState({
        lastName: tar
      });
      break;
    }
  }

  enterNewUser() {
    // console.log("enu being run");
    if (!this.state.username.length) {
      this.setState({
        errorMsg: 'please enter a username'
      });
    } else if (!this.state.password.length) {
      this.setState({
        errorMsg: 'please enter a password'
      });
    } else if (!this.state.firstName.length) {
      this.setState({
        errorMsg: 'please enter your first name'
      });
    } else if (!this.state.lastName.length) {
      this.setState({
        errorMsg: 'please enter your last name'
      });
    } else {
      let userObj = { 
        name: this.state.username,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName
      };

      $.post(Url + '/signup', userObj)
      .then(response => {
        //after signup should prompt user to select their favorite three movies
        this.setState({
          errorMsg: '',
          successMsg: 'new login created'
        });
        // console.log(this,' this')

        this.props.changeViews("Home");
        this.props.setCurrentUser(this.state.username);
      })
      .catch(err=> {
        // console.log(err);
        this.setState({
          errorMsg: 'username already exist, please use a different username'
        });
      })
    }
  }

  render() {
    
    return (
    <div className='landing row'>
      <div className='icon-block col s7'>
        <h2 className="header logo">Welcome to ReelPals</h2>
        <h5 className="header col s12 light description">
          Let's find your next buddy by your movie taste!
        </h5>
      </div>
      <div className='login icon-block'>
        <a className="waves-effect waves-light btn" onClick={() => this.props.changeViews('Login')}>Go to Log In</a>
        <div className="or">OR</div>
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
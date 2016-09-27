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
    const tar = event.target.value;
    if (event.target.name === 'LogInName') {
      this.setState({
        username: tar
      });
    } else {
      this.setState({
        password: tar
      });
    }
  }

  handleLogIn() {
    if (!this.state.username.length && !this.state.password.length) {
      this.setState({
        errorMsg: 'login is empty'
      });
    } else if (!this.state.username.length) {
      this.setState({
        errorMsg: 'please enter a username'
      });
    } else if (!this.state.password.length) {
      this.setState({
        errorMsg: 'please enter a password'
      });
    } else {
      let userObj = {
        name: this.state.username,
        password: this.state.password
      };


      $.post(Url + '/login', userObj)
      .then(response => {
        if (response[0] === 'it worked') {
          // console.log('hi');
          
          this.setState({
            errorMsg: ''
          });

          this.props.changeViews('Home');
          this.props.setCurrentUser(response[1]);
        }
         // console.log('this.state.view after state is set again',this.state.view);
      })
      .catch(err=> {
        // console.log(err);
        this.setState({
          errorMsg: 'invalid login information'
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
          <a className="waves-effect waves-light btn" onClick={() => this.props.changeViews('SignUp')}>Go to Sign Up</a>
          <div className="or">OR</div>
          <div className='loginForm'>
            <div className="input-field col s6">
              <input placeholder="username" id="user_name" name='LogInName' type="text" className="validate" onChange={this.handleChange.bind(this)}/>
              <label htmlFor="user_name" className="active">Username</label>
            </div>

            <div className="input-field col s6">
              <input placeholder="password" id="password" name='LogInPassword' type="password" className="validate" onChange={this.handleChange.bind(this)}/>
              <label htmlFor="password" className="active">Password</label>
            </div>
            <div className="errorMsg">{this.state.errorMsg}</div>
            <a className="waves-effect waves-light btn" onClick={this.handleLogIn.bind(this)}>log in</a>
          </div>
        </div>
      </div>)
  }
}

window.LogIn = LogIn;

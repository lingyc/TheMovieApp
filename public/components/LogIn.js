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

      $.post(Url + '/login', userObj)
      .then(function(response) {
        if (response[0] === 'it worked') {
          console.log('hi');
          
          that.setState({
            errorMsg: ''
          });

          that.props.changeViews('Home');
          that.props.setCurrentUser(response[1]);
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
    return (
      <div className='landing row'>
        <div className='icon-block col s6'>
          <h2 className="header logo">Movie Buddy</h2>
          <h5 className="header col s12 light description">
            Mea te nibh constituam, veritus convenire constituam ad quo, at cetero mandamus quo. Meliore salutandi percipitur et vel. In oratio soleat dissentiet eum. Vel an dolore numquam nusquam, mea ut essent integre denique, eos erat ocurreret gloriatur cu. Quod oratio forensibus eu ius, te periculis prodesset pri. His ne illum malis, duo te sententiae adipiscing.
          </h5>
        </div>
        <div className='login icon-block'>
          <a className="waves-effect waves-light btn" onClick={() => this.props.changeViews('SignUp')}>Go to Sign Up</a>
          <div className="or">---------- OR -----------</div>
          <div className='loginForm'>
            <div className="input-field col s6">
              <input placeholder="username" id="user_name" name='LogInName' type="text" className="validate" onChange={this.handleChange.bind(this)}/>
              <label for="user_name" className="active">Username</label>
            </div>

            <div className="input-field col s6">
              <input placeholder="password" id="password" name='LogInPassword' type="password" className="validate" onChange={this.handleChange.bind(this)}/>
              <label for="password" className="active">Password</label>
            </div>
            <div className="errorMsg">{this.state.errorMsg}</div>
            <a className="waves-effect waves-light btn" onClick={this.handleLogIn.bind(this)}>log in</a>
          </div>
        </div>
      </div>)
  }
}

window.LogIn = LogIn;

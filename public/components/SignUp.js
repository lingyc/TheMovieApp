class SignUp extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      errorMsg: ''
    };
  }

  handleChange(event) {
    if (event.target.name === 'SignUpName') {
      this.setState({
        username: event.target.value
      });
    } else {
      this.setState({
        password: event.target.value
      });
    }
  }

  render() {
    return (
    <div>
      <p id='loginFields'>Name</p>  <input type = 'text' id = 'SignUpName' name = 'SignUpName'/><br/>
      <p id='loginFields'>Password</p> <input type = 'text' id = 'SignUpPassword' name = 'SignUpPassword'/><br/> 
      <div id='buttons2'>
        <button onClick = {
          function() {
            props.enterUser(document.getElementById('SignUpName').value, document.getElementById('SignUpPassword').value)
          }
        }> Sign Up! </button>
        <button onClick={() => 
          (props.onClick("Login"))}> Log In Instead
        </button>
      </div> 
    </div>)
  }

}

window.SignUp = SignUp;
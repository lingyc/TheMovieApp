var SignUp = (props) => (

  < div >
  Name: < input type = 'text'
  id = 'SignUpName'
  name = 'SignUpName' / > < br / >
  Password < input type = 'text'
  id = 'SignUpPassword'
  name = 'SignUpPassword' / > < br / > < button onClick = {
    function() {
      props.enterUser(document.getElementById('SignUpName').value, document.getElementById('SignUpPassword').value)
    }
  } > Sign Up! < /button>  < /div >

)

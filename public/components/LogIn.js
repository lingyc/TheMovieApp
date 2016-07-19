var LogIn = (props) => (

  < div id='logInStyling' >
  <p id='loginFields'>Name</p> < input type = 'text'
  id = 'LogInName'
  name = 'LogInName' / > < br / >
  <p id='loginFields'>Password</p> < input type = 'text'
  id = 'LogInPassword'
  name = 'LogInPassword' / > < br / >
  <div id='buttons'> < button onClick={function(){props.logInFunction(document.getElementById('LogInName').value, document.getElementById('LogInPassword').value)}}> 
  Log In! < /button> < button onClick={props.ourFunction}> Sign Up Instead < /button ></div>
  < /div>

)

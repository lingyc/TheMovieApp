var LogIn = (props) => (

  < div >
  Name: < input type = 'text'
  id = 'LogInName'
  name = 'LogInName' / > < br / >
  Password < input type = 'text'
  id = 'LogInPassword'
  name = 'LogInPassword' / > < br / >
   < button onClick={function(){props.logInFunction(document.getElementById('LogInName').value, document.getElementById('LogInPassword').value)}}> 
  Log In(new)! < /button> < button onClick={props.ourFunction}> Sign Up! < /button >
  < /div>

)

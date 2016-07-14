var LogIn = (props) => (

  < div >
  Name: < input type = 'text'
  id = 'LogInName'
  name = 'LogInName' / > < br / >
  Password < input type = 'text'
  id = 'LoginPassword'
  name = 'LogInPassword' / > < br / >
  < button > Log In! < /button> < button onClick={props.ourFunction}> Sign Up! < /button >
  < /div>

)

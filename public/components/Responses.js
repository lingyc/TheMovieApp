var Responses = (props) => {
console.log(props)
  return (

  <div className="Reponses">
    <h3>{props.responsesInfo} said {props.responseAnswer} to your {props.responseType} request! 
      <button onClick={()=>props.remove(props.responsesInfo, props.self)}>Got it</button>
    </h3>
  </div>
)};

window.Responses = Responses;
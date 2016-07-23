var Responses = (props) => {
	
  return (
  <div className="Reponses">
    <h3>{props.responsesInfo} said {props.responseAnswer} to your {props.responseType} request! <button>Got it</button></h3>
  </div>
)};

window.Responses = Responses;
var Responses = (props) => {
  console.log(props)
  if (props.movie !== null) {
    return (
      <div className="Reponses">
        <h3>{props.responsesInfo} said {props.responseAnswer} to your {props.responseType} request to watch {props.movie}!  
          <button onClick={()=>props.remove(props.responsesInfo, props.self, props.movie)}>Got it</button>
        </h3>
      </div>
    )
  } else {
    return (
      <div className="Reponses">
        <h3>{props.responsesInfo} said {props.responseAnswer} to your {props.responseType} request! 
          <button onClick={()=>props.remove(props.responsesInfo, props.self, null)}>Got it</button>
        </h3>
      </div>
    );
  }
};

window.Responses = Responses;
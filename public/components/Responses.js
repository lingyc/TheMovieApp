var Responses = (props) => {
  console.log('props.movie', props.movie)
  if (props.movie !== null) {
    return (
      <div className="Reponses collection-item row">
        <div className="col s3">
          <img className='profilethumnail' src={'https://unsplash.it/170/170/?random'}/>
        </div>
        <div className="response col s9">
          <div className="responseMsg">{props.responsesInfo} said {props.responseAnswer} to your {props.responseType} request to watch {props.movie}!  
          <a className="waves-effect waves-light btn" onClick={()=>props.remove(props.responsesInfo, props.self, props.movie)}>Got it</a>
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <div className="Reponses collection-item row">
        <div className="col s3">
          <img className='profilethumnail' src={'https://unsplash.it/170/170/?random'}/>
        </div>

        <div className="response col s9">
          <div className="responseMsg">{props.responsesInfo} said {props.responseAnswer} to your {props.responseType} request!</div>
          <a className="waves-effect waves-light btn" onClick={()=>props.remove(props.responsesInfo, props.self, null)}>Got it</a>
        </div>
      </div>
    );
  }
};

window.Responses = Responses;
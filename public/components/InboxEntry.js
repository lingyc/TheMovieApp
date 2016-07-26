var InboxEntry = (props) => {
  return (
  <div className="InboxEntry Reponses collection-item row">
        <div className="col s3">
          <img className='profilethumnail' src={'https://unsplash.it/170/170/?random'}/>
        </div>
        <div className="response col s9">
        <span className="inboxFriend"> Name:{props.inboxName} 
        <a className="waves-effect waves-light btn accept" onClick={function(){props.accept(props.inboxName, props.requestMovie)}}> 
        Accept {props.inboxName}'s {props.requestType} request {props.requestMovie}</a> 
        <a className="waves-effect waves-light btn decline" onClick={function(){props.decline(props.inboxName, props.requestMovie)}}>
        Decline {props.inboxName}'s {props.requestType} request {props.requestMovie}</a></span>
        <br/>
        Message:{props.messageInfo === null ? 'No message' : props.messageInfo}
      </div>
  </div>
)};
window.InboxEntry = InboxEntry;
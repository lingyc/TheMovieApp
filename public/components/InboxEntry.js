const InboxEntry = ({inboxName, accept, requestMovie, decline, requestType, messageInfo}) => (
<div className="InboxEntry Reponses collection-item row">
  <div className="col s3">
    <img className='profilethumnail' src={ 'https://unsplash.it/170/170/?random'}/>
  </div>
  <div className="response col s9">
    <span className="inboxFriend"> Name:{inboxName} 
        <a className="waves-effect waves-light btn accept" onClick={()=>{accept(inboxName, requestMovie)}}> 
        Accept {inboxName}'s {requestType} request {requestMovie}</a>
        <a className="waves-effect waves-light btn decline" onClick={()=>{decline(inboxName, requestMovie)}}>
        Decline {inboxName}'s {requestType} request {requestMovie}</a></span>
    <br/> Message:{messageInfo === null ? 'No message' : messageInfo}
  </div>
</div>

);

window.InboxEntry = InboxEntry;